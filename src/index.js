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
  console.log('[Puppeteer] launched');
  const page = await browser.newPage();

  const getNewPageWhenLoaded = async () => {
    return new Promise(x =>
      browser.on('targetcreated', async target => {
        if (target.type() === 'page') {
          const newPage = await target.page();
          const newPagePromise = new Promise(y =>
            newPage.once('domcontentloaded', () => y(newPage))
          );
          const isPageLoaded = await newPage.evaluate(
            () => document.readyState
          );
          return isPageLoaded.match('complete|interactive')
            ? x(newPage)
            : x(newPagePromise);
        }
      })
    );
  };

  if (config.auth) {
    console.log('[Puppeteer] authenticate detect');
    await page.authenticate({
      password: config.auth.password,
      username: config.auth.username
    })
  }

  console.log('[Puppeteer] go to ', config.entrypoint);
  await page.goto(config.entrypoint);
  //
  // const span = await page.$('table tr td span');
  // await span.click();

  await page.focus('input');
  await page.keyboard.type('test');
  await page.screenshot({ path: `${Date.now()}_screen.png` });

  await page.click('#btn');

  // const li = await page.$$eval('li', elements => {
  //   for (let el of elements) {
  //     if (el.textContent === 'li2') {
  //       return el.textContent;
  //     }
  //   }
  // });

  const newPagePromise = getNewPageWhenLoaded();
  const newPage = await newPagePromise;

  await newPage.screenshot({ path: `second_page.png` });

  await browser.close();
}

main().then(() => console.log('Success'));
