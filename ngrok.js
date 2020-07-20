require('dotenv').config();
const ngrok = require('ngrok');
const clipboardy = require('clipboardy');

const PORT = process.env.PORT || 8080;

(async function() {
  const url = await ngrok.connect(PORT);
  console.log(`Copying URL to clipboard: ${url}`);
  clipboardy.writeSync(url);
})();
