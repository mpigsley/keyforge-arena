const admin = require('firebase-admin');
const functions = require('firebase-functions');
const request = require('request-promise');

module.exports = functions.https.onCall(async ({ link }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  try {
    const splitLink = link.split('/');
    const id = splitLink[splitLink.length - 1];

    const existingDeck = await admin
      .firestore()
      .collection('decks')
      .doc(id)
      .get();

    if (existingDeck.exists) {
      throw new functions.https.HttpsError(
        'already-exists',
        'Deck already exists in your library.',
      );
    }

    const response = await request(
      `https://www.keyforgegame.com/api/decks/${id}?links=cards`,
    );
    const { data, _linked } = JSON.parse(response);
    const { name } = data;
    const { cards } = _linked;

    const houses = cards.reduce(
      (housesObj, { card_number, house }) => ({
        ...housesObj,
        [house.toLowerCase()]: [
          ...(housesObj[house.toLowerCase()] || []),
          card_number,
        ],
      }),
      {},
    );

    const deck = {
      creator: context.auth.uid,
      houses,
      name,
    };

    await admin
      .firestore()
      .collection('decks')
      .doc(id)
      .set({
        ...deck,
        created: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { id: deck };
  } catch (e) {
    if (e.code === 'already-exists') {
      throw e;
    }
    console.error(e);
    throw new functions.https.HttpsError('not-found', 'Deck link is not valid');
  }
});
