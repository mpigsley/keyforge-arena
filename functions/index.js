const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');

admin.initializeApp();

exports.submitDeck = submitDeck;
