const functions = require('firebase-functions');

module.exports = functions.https.onCall(({ link }) => {
  const splitLink = link.split('/');
  const id = splitLink[splitLink.length - 1];
  return request(`https://www.keyforgegame.com/api/decks/${id}?links=cards`)
    .then(response => {
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

      return { name, houses };
    })
    .catch(() => {
      throw new functions.https.HttpsError(
        'not-found',
        'Deck link is not valid',
      );
    });
});
