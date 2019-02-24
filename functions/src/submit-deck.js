const admin = require('firebase-admin');
const functions = require('firebase-functions');
const request = require('request-promise');

const { find } = require('../constants/lodash');
const { firestore } = require('../utils/common');

const EXPANSIONS = {
  341: 'cota',
};

module.exports = functions.https.onCall(async ({ link }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  }

  try {
    const splitLink = link.split('/');
    const deckId = splitLink[splitLink.length - 1];

    const deckSnapshot = await firestore
      .collection('decks')
      .where('deckId', '==', deckId)
      .where('creator', '==', context.auth.uid)
      .get();

    if (!deckSnapshot.empty) {
      throw new functions.https.HttpsError(
        'already-exists',
        'Deck already exists in your library.',
      );
    }

    const response = await request(
      `https://www.keyforgegame.com/api/decks/${deckId}?links=cards`,
    );
    const { data, _linked } = JSON.parse(response);
    const { name, expansion, _links } = data;
    const cardIds = _links.cards;
    const { cards } = _linked;

    if (!EXPANSIONS[expansion]) {
      throw new functions.https.HttpsError(
        'not-found',
        'Deck is from an unknown expansion',
      );
    }

    const houses = cardIds
      .map(id => find(cards, { id }))
      .reduce((housesObj, { card_number, house }) => {
        return {
          ...housesObj,
          [house.toLowerCase()]: [
            ...(housesObj[house.toLowerCase()] || []),
            `000${card_number}`.substr(-3, 3),
          ],
        };
      }, {});

    const deck = {
      creator: context.auth.uid,
      expansion: EXPANSIONS[expansion],
      deckId,
      houses,
      name,
    };

    const ref = await firestore.collection('decks').add({
      ...deck,
      created: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { [ref.id]: deck };
  } catch (e) {
    if (e.code === 'already-exists' || e.code === 'not-found') {
      throw e;
    }
    console.error(e);
    throw new functions.https.HttpsError('unknown', 'Deck link is not valid');
  }
});
