import Firebase from 'firebase/app';

export const getHouseLink = house =>
  Firebase.storage()
    .ref(`houses/${house}.png`)
    .getDownloadURL();

export const getCardLink = (set, card) =>
  Firebase.storage()
    .ref(`${set}/${card}.png`)
    .getDownloadURL();
