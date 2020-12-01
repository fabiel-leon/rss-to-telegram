const { stream, feedparser } = require('rss-rewriter');
const cheerio = require('cheerio');
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
  filter = async ({ date }) => {
    const d = new Date();
    return date.getDate() === d.getDate()
      && date.getMonth() === d.getMonth()
      && date.getFullYear() === d.getFullYear();
  },
  template = '<a href="{{image}}"> </a> <b><a href="{{link}}">{{title}}</a></b>\n @{{channel}}',
  preprocess = async (item) => { },
  disablePreview = false,
}) => new CronJob(
  cron,
  async () => {
    console.log('executing cron');
    const data = await stream(source);
    const items = await feedparser(data);
    const filtered = await async.filter(items, filter);
    console.log(filtered);
    const result = await async.eachOfSeries(filtered, async (item) => {
      item.description = sanitizeHtml(item.description, {
        allowedTags: ['b', 'i', 'strong', 'em', 'pre', 'code', 'a'],
        allowedAttributes: {
          a: ['href'],
        },
      });
      item.channel = channel;
      const compiled = handlebars.compile(template);
      return telegram(bot, channel, compiled(item), disablePreview);
    });
    console.log('finished', result);
  },
  null,
  true,
  timezone,
);
