const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.firestore = firestore;

exports.generateTag = () =>
  [...Array(4)].map(() => Math.floor(Math.random() * 10)).join('');

exports.getGameState = async gameId => {
  const game = await firestore
    .collection('games')
    .doc(gameId)
    .get();

  return game.data();
};
