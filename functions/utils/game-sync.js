const { map } = require('../constants/lodash');
const { firestore } = require('./common');

const snapShotToObject = snapshot => {
  let obj = {};
  snapshot.forEach(doc => {
    obj = {
      ...obj,
      [doc.id]: doc.data(),
    };
  });
  return obj;
};

exports.getGameState = async (gameId, uid, metadata) => {
  const [game, personal, hidden] = await Promise.all([
    firestore
      .collection('games')
      .doc(gameId)
      .get()
      .then(game => game.data()),
    firestore
      .collection('games')
      .doc(gameId)
      .collection('personal')
      .get()
      .then(snapShotToObject),
    firestore
      .collection('games')
      .doc(gameId)
      .collection('hidden')
      .get()
      .then(snapShotToObject),
  ]);

  return {
    game,
    personal,
    hidden,
    metadata,
    uid,
  };
};

exports.saveGameState = async (gameId, { game, personal, hidden }) => {
  const batch = firestore.batch();

  if (game) {
    batch.set(firestore.collection('games').doc(gameId), game);
  }

  map(personal, (doc, id) => {
    batch.set(
      firestore
        .collection('games')
        .doc(gameId)
        .collection('personal')
        .doc(id),
      doc,
    );
  });

  map(hidden, (doc, id) => {
    batch.set(
      firestore
        .collection('games')
        .doc(gameId)
        .collection('hidden')
        .doc(id),
      doc,
    );
  });

  await batch.commit();
};
