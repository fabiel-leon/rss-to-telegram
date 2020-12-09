const { stream, feedparser } = require('rss-rewriter');
const { CronJob } = require('cron');
const sanitizeHtml = require('sanitize-html');
const handlebars = require('handlebars');
const async = require('async');
const telegram = require('./telegramAPI');

module.exports = ({
  bot,
  channel,
  source,
  cron = '00 00 06 * * *',
  timezone = 'America/Havana',
  filter,
  template = '<a href="{{image}}"> </a> <b><a href="{{link}}">{{title}}</a></b>\n{{channel}}',
  preprocess,
  disablePreview = false,
  extraFields = {},
}) => new CronJob(
  cron,
  async () => {
    try {
      console.log('executing cron');
      let items;
      if (typeof source === 'function') {
        items = await source();
      } else if (Array.isArray(source)) {
        items = source;
      } else {
        const data = await stream(source);
        items = await feedparser(data);
      }
      const filtered = filter ? await async.filter(items, filter) : items;
      const procesed = preprocess ? await async.map(filtered, preprocess) : filtered;
      // console.log('items', items.length, filtered.length);
      const result = await async.eachOfSeries(procesed, async (item) => {
        item.description = sanitizeHtml(item.description, {
          allowedTags: ['b', 'i', 'strong', 'em', 'pre', 'code', 'a'],
          allowedAttributes: {
            a: ['href'],
          },
        });
        item.channel = channel;
        item.bot = bot;
        const compiled = handlebars.compile(template);
        return telegram(bot, channel, compiled({ ...item, ...extraFields }), disablePreview);
      });
    } catch (error) {
      console.error(error);
    }
    console.log('finished', result);
  },
  null,
  true,
  timezone,
);
