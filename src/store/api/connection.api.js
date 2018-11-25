import Firebase from 'firebase/app';

export const requestConnection = ({ connection }) =>
  Firebase.functions().httpsCallable('requestConnection')({ connection });

export const connectionReply = ({ connnection, accepted }) =>
  Firebase.functions().httpsCallable('connectionReply')({
    connnection,
    accepted,
  });
