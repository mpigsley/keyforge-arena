const GAME_ACTION_TYPES = require('../constants/game-action-types');
const { shuffleAndDrawHand } = require('./common');

const DEFAULT_CONFIG = {
  validate: () => true,
  invokeAction: () => ({}),
};

module.exports = {
  [GAME_ACTION_TYPES.KEEP_HAND]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game }) => game.state[uid].turn === 0,
    invokeAction: ({ uid, game }) => ({
      game: {
        ...game,
        state: {
          ...game.state,
          [uid]: {
            ...game.state[uid],
            turn: 1,
          },
        },
      },
    }),
  },
  [GAME_ACTION_TYPES.MULLIGAN_HAND]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game }) => game.state[uid].turn === 0,
    invokeAction: ({ uid, game, personal, hidden }) => {
      const [hand, deck] = shuffleAndDrawHand(
        [...personal[uid].hand, ...hidden[uid].deck],
        personal[uid].hand.length - 1,
      );
      return {
        personal: {
          [uid]: { ...personal[uid], hand },
        },
        hidden: {
          [uid]: { ...hidden[uid], deck },
        },
        game: {
          ...game,
          state: {
            ...game.state,
            [uid]: {
              ...game.state[uid],
              deckSize: deck.length,
              handSize: hand.length,
              turn: 1,
            },
          },
        },
      };
    },
  },
};
