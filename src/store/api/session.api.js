import Firebase from 'firebase/app';

export const getCurrentUser = () =>
  new Promise(resolve => {
    Firebase.auth().onAuthStateChanged(user => {
      if (!(user || {}).uid) {
        return resolve(null);
      }
      return resolve(user.toJSON());
    });
  });

export const doGoogleLogin = () =>
  Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider());

export const doSignup = (email, password) =>
  Firebase.auth().createUserWithEmailAndPassword(email, password);

export const doLogin = (email, password) =>
  Firebase.auth().signInWithEmailAndPassword(email, password);

export const doSignout = () => Firebase.auth().signOut();

export const doPasswordReset = email =>
  Firebase.auth().sendPasswordResetEmail(email);
