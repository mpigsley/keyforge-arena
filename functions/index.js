const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');
const generateUsername = require('./src/generate-username');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.submitDeck = submitDeck;
exports.generateUsername = generateUsername;
