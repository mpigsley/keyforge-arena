const fs = require('fs');
const prettier = require('prettier');
const request = require('request-promise-native');
const { map, reduce, some, size } = require('lodash');

const PAGE_SIZE = 50;
const EXPANSION_SIZES = {
  341: 370,
};
const LANGUAGES = ['en', 'fr'];
const EXPANSION_NAMES = {
  341: 'cota',
};

const remainingCards = newCards =>
  some(
    EXPANSION_SIZES,
    (expectedSize, expansion) => size(newCards[expansion]) !== expectedSize,
  );

const buildUrl = page =>
  `https://www.keyforgegame.com/api/decks/?page=${page}&page_size=${PAGE_SIZE}&links=cards`;

const fetchCardForLanguage = async lang => {
  let page = 1;
  let cards = reduce(EXPANSION_SIZES, (obj, _, expansion) => ({
    ...obj,
    [expansion]: {},
  }));

  do {
    // eslint-disable-next-line
    const result = await request({
      url: buildUrl(page),
      headers: {
        'Content-Language': lang,
        'Accept-Language': lang,
      },
    });
    // eslint-disable-next-line
    cards = JSON.parse(result)._linked.cards.reduce(
      (obj, card) => ({
        ...obj,
        [card.expansion]: {
          ...obj[card.expansion],
          [card.card_number]: card,
        },
      }),
      cards,
    );
    page += 1;
  } while (page < 100 && remainingCards(cards));

  return cards;
};

const fetchCards = async () => {
  await Promise.all(
    LANGUAGES.map(async lang => {
      const cardsForLang = await fetchCardForLanguage(lang);

      await Promise.all(
        map(
          cardsForLang,
          (cards, expansion) =>
            new Promise((resolve, reject) => {
              const formattedJson = prettier.format(JSON.stringify(cards), {
                parser: 'json',
              });
              const directory = `./src/constants/cards/${lang}`;
              if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
              }
              fs.writeFile(
                `${directory}/${EXPANSION_NAMES[expansion]}.json`,
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
    }),
  );
};

fetchCards();
