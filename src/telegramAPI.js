const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

module.exports = async (bot, channel, text, disablePreview = false, parseMode = 'html') => {
  const params = new URLSearchParams({
    chat_id: `@${channel}`,
    parse_mode: parseMode,
    disable_web_page_preview: disablePreview,
    text,
  });
  const res = await fetch(`https://api.telegram.org/bot${bot}/sendMessage?${params}`);
  if (!res.ok) { // !(res.status >= 200 && res.status < 300)
    const json = await res.json();
    console.error(json);
    throw new Error('Error sending telegram message');
  } else {
    return res;
  }
};
