const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');
const instantiateUser = require('./src/instantiate-user');
const updateUser = require('./src/update-user');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.submitDeck = submitDeck;
exports.instantiateUser = instantiateUser;
exports.updateUser = updateUser;
