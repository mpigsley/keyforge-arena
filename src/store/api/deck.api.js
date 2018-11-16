import Firebase from 'firebase/app';

// eslint-disable-next-line
export const submitDeck = link =>
  Firebase.functions().httpsCallable('submitDeck')({ link });
