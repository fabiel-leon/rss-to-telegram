require('dotenv').config();
const rssToTelegram = require('../src');

const { TELEGRAM_BOT, TELEGRAM_CHANNEL } = process.env;

rssToTelegram({
  bot: TELEGRAM_BOT,
  channel: TELEGRAM_CHANNEL,
  filter: async ({ date }) => {
    const d = new Date();
    return date.getDate() === d.getDate()
      && date.getMonth() === d.getMonth()
      && date.getFullYear() === d.getFullYear();
  },
  cron: '1/15 * * * * *',
  source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss',
});
