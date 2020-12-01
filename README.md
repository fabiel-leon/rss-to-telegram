# rss-to-telegram

This is the module that you need to send rss news to a telegram channel.

support for:

- Cron sintaxis to flexible time publishing.
- Filter function, to filter your content.
- Preprocess function to add extra data to meessages.
- Enabled telegram preview option.
- Flexible message template with handlebar.

## Install

```sh
npm i rss-to-telegram
```

## use

```javascript
const rssToTelegram = require("rss-to-telegram");
const { TELEGRAM_BOT, TELEGRAM_CHANNEL } = process.env;

rssToTelegram({
  bot: TELEGRAM_BOT,
  channel: TELEGRAM_CHANNEL,
  cron: "*/15 * * * * *", // publish every 15 seconds, cron sintaxis
  timezone: "America/Havana", // your defined timezone
  // rss source
  source: "https://feed.informer.com/digests/ZO8A5LZCGA/feeder.rss", // can be an async function or and array of objects
  // source: async () => {
  //   return db.get({ limit: 10 }); // your custom db
  // },
  // source: [{colo:"red"}],
  // add new fields to show in the message
  preprocess: async (item) => {
    item.color = "green";
  },
  // define you own message template
  template:
    'Color is {{color}}, <a href="{{image}}"> </a> <b><a href="{{link}}">{{title}}</a></b>\n @{{channel}}',
  // filter news of the day, use this function to filter already published posts
  filter: async ({ date }) => { // async functtion
    // must be async
    const d = new Date();
    return (
      date.getDate() === d.getDate() &&
      date.getMonth() === d.getMonth() &&
      date.getFullYear() === d.getFullYear()
    );
  },
  // add extra common fields to all items,
  extraFields: { colo: "red", line: "stroke" }, // add line field to all items and overwrite color field
});
```

## Cron sintaxis

```text
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
```

- every five minutes. `0 */5 * * * *`
- every quarter hour. `0 */15 * * * *`
- every hour at minute 30. `0 30 * * * *`
- three times every hour, at minute 0, 5 and 10 `0 0,5,10 * * * *`
- every half hour `0 */30 * * * *`

More example https://crontab.guru/examples.html

## Timezone

https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json

## Template fields

- title
- link
- image
- channel
- description
- date

use the preprocess function to add fields, then modify the template to show the new fields in the message

```javascript
rssToTelegram({
...
 preprocess: async (item) => { item.color = "green"; },
 template: 'Color is {{color}}, Link is {{link}}, Title is {{title}} \n @{{channel}}',
...
})
```

Donate Bitcoin:

bitcoin:3GqQcxFk5y7onUyoTKqZHwoWXvLusqJSVG

`3GqQcxFk5y7onUyoTKqZHwoWXvLusqJSVG`

Contact: `fabiel.leon.oliva@gmail.com`
