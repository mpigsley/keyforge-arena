const functions = require('firebase-functions');

const { getGameState } = require('../utils/common');
const GAME_ACTIONS = require('../constants/game-actions');

module.exports = functions.https.onCall(
  async ({ game, action, metadata }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    } else if (!game) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'A reference to the current game is required.',
      );
    } else if (!action || !GAME_ACTIONS[action]) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'A valid action type is required.',
      );
    }

    try {
      const gameState = await getGameState(game);
      console.log(action, metadata, gameState);
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError(
        'unknown',
        'Could perform game action.',
      );
    }
  },
);
