const firestore = require('firebase-admin').firestore();
const chance = require('chance').Chance();

const { reduce, take, drop } = require('../constants/lodash');

exports.firestore = firestore;
exports.chance = chance;

exports.generateTag = () =>
  [...Array(4)].map(() => Math.floor(Math.random() * 10)).join('');

const createDeck = ({ expansion, houses }) =>
  reduce(
    houses,
    (arr, cards, house) => [
      ...arr,
      ...cards.map(card => `${expansion}-${house}-${card}`),
    ],
    [],
  );
exports.createDeck = createDeck;

exports.shuffleAndDrawHand = (deck, handSize) => {
  const shuffledDeck = chance.shuffle(deck);
  return [take(shuffledDeck, handSize), drop(shuffledDeck, handSize)];
};
