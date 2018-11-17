const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.submitDeck = submitDeck;
