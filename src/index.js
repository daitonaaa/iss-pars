const puppeteer = require('puppeteer');
const config = require('./config.json');

if (!config) {
  throw new Error('[Config] please create /config.json')
}

async function main() {
  if (!config.entrypoint) {
    throw new Error('[Config] entrypoint required')
  }

  const browser = await puppeteer.launch();
  console.log('[Puppeteer] launched')
  const page = await browser.newPage();

  if (config.auth) {
    console.log('[Puppeteer] authenticate detect');
    await page.authenticate({
      password: config.auth.password,
      username: config.auth.username
    })
  }

  console.log('[Puppeteer] go to ', config.entrypoint);
  await page.goto(config.entrypoint)

  console.log('[Puppeteer] create screenshot');
  await page.screenshot({ path: `${Date.now()}_screen.png` });

  await browser.close();
}

main();
