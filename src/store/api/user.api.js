import Firebase from 'firebase/app';

export const getCurrentUser = () =>
  new Promise(resolve => {
    Firebase.auth().onAuthStateChanged(user => {
      if (!(user || {}).uid) {
        return resolve(null);
      }
      return Firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            resolve({ ...doc.data(), ...user.toJSON() });
          }
          resolve(user.toJSON());
        });
    });
  });

export const updateProfile = (uid, profile) => {
  if (!uid) {
    throw new Error('Uid required to update a user.');
  } else if (
    !profile.username ||
    !profile.username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*([.][a-z0-9_]+)*$')
  ) {
    throw new Error(
      'Username can only include alphanumeric characters and an underscore.',
    );
  }
  return Firebase.firestore()
    .collection('users')
    .doc(uid)
    .set(profile, { merge: true });
};

export const profileListener = (uid, cb) =>
  Firebase.firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        cb(data);
      }
    });

export const googleLogin = () =>
  Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider());

export const signup = ({ email, password, confirm }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  if (password !== confirm) {
    throw new Error('Passwords do not match.');
  }
  return Firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const login = ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  return Firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signout = () => Firebase.auth().signOut();

export const passwordReset = ({ email }) => {
  if (!email) {
    throw new Error('Email is required.');
  }
  return Firebase.auth().sendPasswordResetEmail(email);
};
