import Firebase from 'firebase/app';

export const createChallengeLobby = (player, opponent) => {
  const doc = {
    created: Firebase.firestore.FieldValue.serverTimestamp(),
    opponent,
    player,
  };
  return Firebase.firestore()
    .collection('lobby')
    .add(doc)
    .then(ref => ({ [ref.id]: doc }));
};

export const lobbyListener = (uid, cb) =>
  Firebase.firestore()
    .collection('lobby')
    .where('opponent', '==', uid)
    .onSnapshot(snapShot => {
      let lobbies = {};
      snapShot.forEach(doc => {
        lobbies = {
          ...lobbies,
          [doc.id]: doc.data(),
        };
      });
      cb(lobbies);
    });
