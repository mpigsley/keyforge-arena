import Firebase from 'firebase/app';

export const createChallengeLobby = (player, opponent) =>
  Firebase.firestore()
    .collection('lobby')
    .add({
      created: Firebase.firestore.FieldValue.serverTimestamp(),
      opponent,
      player,
    });

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
