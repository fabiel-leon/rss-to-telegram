require('dotenv').config();
const { rewriter } = require('rss-rewriter');
const rssToTelegram = require('../src');

const { TELEGRAM_BOT, TELEGRAM_CHANNEL } = process.env;

rssToTelegram({
  bot: TELEGRAM_BOT,
  channel: TELEGRAM_CHANNEL,
  cron: '1/15 * * * * *',
  // filter: async () => true,
  source: async () => rewriter({
    source: 'https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss', // source url or stream
    site: 'https://pricecrypto.surge.sh/redirect', // redirection page
    title: 'My Rss title',
    description: 'My Rss description',
    format: 'rss', // rss|atom|json  , default is rss
    array: true, // return array of items instead of string result in defined format
  }),
});
