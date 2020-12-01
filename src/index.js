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
  template = '<a href="{{image}}"> </a> <b><a href="{{link}}">{{title}}</a></b>\n @{{channel}}',
  preprocess = async (item) => { },
  disablePreview = false,
  extraFields = {},
}) => new CronJob(
  cron,
  async () => {
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
    console.log('items', items.length, filtered.length);
    const result = await async.eachOfSeries(filtered, async (item) => {
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
    console.log('finished', result);
  },
  null,
  true,
  timezone,
);
