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
    .onSnapshot(doc => cb(doc.data()));
