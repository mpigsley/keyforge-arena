const uuid = require('uuid/v4');
const firestore = require('firebase-admin').firestore();
const chance = require('chance').Chance();

const { reduce, take, drop, sortBy } = require('../constants/lodash');

exports.firestore = firestore;
exports.chance = chance;

exports.generateTag = () =>
  [...Array(4)].map(() => Math.floor(Math.random() * 10)).join('');

const createDeck = ({ expansion, houses }) =>
  reduce(
    houses,
    (arr, cards, house) => [
      ...arr,
      ...cards.map(card => ({
        isExhausted: false,
        isStunned: false,
        powerMod: 0,
        key: uuid(),
        damage: 0,
        expansion,
        house,
        card,
      })),
    ],
    [],
  );
exports.createDeck = createDeck;

exports.removeExhaustion = cards =>
  cards.map(card => ({ ...card, isExhausted: false }));

exports.shuffleAndDrawHand = (deck, handSize) => {
  const shuffledDeck = chance.shuffle(deck);
  return [
    sortBy(take(shuffledDeck, handSize), 'house'),
    drop(shuffledDeck, handSize),
  ];
};
