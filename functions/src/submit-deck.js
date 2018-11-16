const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const getText = (page, className) =>
  page.$eval(className, element => element.innerText).catch(() => '');

module.exports = functions
  .runWith({ memory: '1GB' })
  .https.onCall(async ({ link }) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle0' });

    const [deckName, houseLists] = await Promise.all([
      getText(page, '.deck-page__deck-name'),
      page.$$('.card-table__deck'),
    ]);

    const houses = {};
    await Promise.all(
      houseLists.map(async houseList => {
        const [houseName, cardNumbers] = await Promise.all([
          getText(houseList, '.card-table__deck-house-name'),
          houseList.$$('.card-table__deck-card-number'),
        ]);

        const numberProperties = await Promise.all(
          cardNumbers.map(number => number.getProperty('innerText')),
        );
        const numbers = await Promise.all(
          numberProperties.map(number => number.jsonValue()),
        );
        houses[houseName.toLowerCase()] = numbers.map(num =>
          num.substring(0, 3),
        );
      }),
    );

    await page.close();
    await browser.close();

    return { name: deckName, houses };
  });
