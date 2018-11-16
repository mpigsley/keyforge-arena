const fs = require('fs');
const prettier = require('prettier');
const { map, chunk, sortBy } = require('lodash');
const puppeteer = require('puppeteer');

const CHUNK_SIZE = 50;

const getText = (page, className) =>
  page.$eval(className, element => element.innerText).catch(() => '');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://aembertree.com/sets/core', {
    waitUntil: 'networkidle0',
  });

  const cardLinks = await page.$$('.card--link');
  const linkProperties = await Promise.all(
    cardLinks.map(card => card.getProperty('href')),
  );
  const links = await Promise.all(linkProperties.map(card => card.jsonValue()));
  await page.close();

  const linkChunks = chunk(links, CHUNK_SIZE);

  const allCards = await linkChunks.reduce(
    (cardsPromise, chunkLinks) =>
      cardsPromise.then(cards =>
        Promise.all(
          chunkLinks.map(async link => {
            const url = link.split('/');

            const cardPage = await browser.newPage();
            await cardPage.goto(link, { waitUntil: 'networkidle2' });

            const content = await Promise.all([
              getText(cardPage, '.cardview--name'),
              getText(cardPage, '.cardview--house'),
              getText(cardPage, '.cardview--type'),
              getText(cardPage, '.cardview--traits'),
              getText(cardPage, '.cardview--power'),
              getText(cardPage, '.cardview--armor'),
              getText(cardPage, '.cardview--aember'),
              getText(cardPage, '.cardview--keyword'),
              getText(cardPage, '.cardview--text'),
              getText(cardPage, '.cardview--rarity'),
              getText(cardPage, '.cardview--artist'),
            ]);

            const aember = content[6].replace('Aember: ', '');
            const id = url[url.length - 1];
            const set = url[url.length - 2];

            await cardPage.close();

            return {
              id,
              set,
              name: content[0],
              house: content[1],
              type: content[2],
              traits: content[3],
              power: content[4],
              armor: content[5],
              aember: aember ? parseInt(aember, 10) : 0,
              keyword: content[7],
              text: content[8],
              rarity: content[9],
              artist: content[10].replace('Artist: ', ''),
            };
          }),
        ).then(chunkData => [...cards, ...chunkData]),
      ),
    Promise.resolve([]),
  );

  const cardsInSets = sortBy(allCards, ({ id }) => parseInt(id, 10)).reduce(
    (sets, { id, set, ...card }) => ({
      ...sets,
      [set]: {
        ...(sets[set] || {}),
        [id]: card,
      },
    }),
    {},
  );

  await Promise.all(
    map(
      cardsInSets,
      (cards, set) =>
        new Promise((resolve, reject) => {
          const formattedJson = prettier.format(JSON.stringify(cards), {
            parser: 'json',
          });
          fs.writeFile(
            `./src/constants/sets/${set}.json`,
            formattedJson,
            'utf8',
            err => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            },
          );
        }),
    ),
  );

  await browser.close();
};

scrape();
