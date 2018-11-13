const fs = require('fs');
const prettier = require('prettier');
const { map, chunk, zipObject, sortBy } = require('lodash');
const request = require('request-promise');
const puppeteer = require('puppeteer');

const CHUNK_SIZE = 50;

const getText = (page, className) =>
  page.$eval(className, element => element.innerText).catch(() => '');

const downloadImage = async uri => {
  const splitUri = uri.split('/');
  const fileName = splitUri[splitUri.length - 1];
  await new Promise((resolve, reject) =>
    request(uri)
      .pipe(fs.createWriteStream(`./public/images/${fileName}`))
      .on('close', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }),
  );
};

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://aembertree.com/sets/core', {
    waitUntil: 'networkidle2',
  });

  const cardLinks = await page.$$('.card--link');
  const linkProperties = await Promise.all(
    cardLinks.map(card => card.getProperty('href')),
  );
  const links = await Promise.all(linkProperties.map(card => card.jsonValue()));
  await page.close();

  const linkChunks = chunk(links, CHUNK_SIZE);

  const coreCards = await linkChunks.reduce(
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
              getText(cardPage, '.cardview--aember'),
              getText(cardPage, '.cardview--keyword'),
              getText(cardPage, '.cardview--text'),
              getText(cardPage, '.cardview--rarity'),
              getText(cardPage, '.cardview--artist'),
            ]);

            const aember = content[4].replace('Aember: ', '');
            const id = url[url.length - 1];

            await Promise.all([
              cardPage.close(),
              downloadImage(`http://aembertree.com/cards/core-${id}.jpg`),
            ]);

            return {
              id,
              set: url[url.length - 2],
              name: content[0],
              house: content[1],
              type: content[2],
              traits: content[3],
              aember: aember ? parseInt(aember, 10) : 0,
              keyword: content[5],
              text: content[6],
              rarity: content[7],
              artist: content[8].replace('Artist: ', ''),
            };
          }),
        ).then(chunkData => [...cards, ...chunkData]),
      ),
    Promise.resolve([]),
  );

  const sorted = sortBy(coreCards, ({ id }) => parseInt(id, 10));

  await Promise.all(
    map(
      { core: zipObject(sorted.map(({ id }) => id), sorted) },
      (cards, set) =>
        new Promise((resolve, reject) => {
          fs.writeFile(
            `./src/constants/${set}.json`,
            prettier.format(JSON.stringify(cards), { parser: 'json' }),
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
