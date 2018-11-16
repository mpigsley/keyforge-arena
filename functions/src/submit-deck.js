const functions = require('firebase-functions');

module.exports = functions.https.onCall(data => {
  return data.link;
});
