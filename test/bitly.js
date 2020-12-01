require('dotenv').config();
const { BitlyClient } = require('bitly');

const bitly = new BitlyClient(process.env.BITLY_TOKEN);

const test = async () => {
  try {
    const data = await bitly.shorten('http://pricecrypto.surge.sh');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
test();
