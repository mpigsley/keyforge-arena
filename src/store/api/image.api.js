import Firebase from 'firebase/app';

export const getHouseLink = house =>
  Firebase.storage()
    .ref(`houses/${house}.png`)
    .getDownloadURL();

export const getCardLink = (expansion, card) =>
  Firebase.storage()
    .ref(`sets/${expansion}/${card}.png`)
    .getDownloadURL();
