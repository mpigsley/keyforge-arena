const GAME_ACTION_TYPES = require('../constants/game-action-types.json');
const { shuffleAndDrawHand, removeExhaustion } = require('./common');
const { find, filter, take, drop } = require('../constants/lodash');

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
  [GAME_ACTION_TYPES.CHOOSE_HOUSE]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game, metadata }) =>
      metadata.house && game.turn === uid && !game.state[uid].house,
    invokeAction: ({ uid, game, metadata }) => ({
      game: {
        ...game,
        state: {
          ...game.state,
          [uid]: {
            ...game.state[uid],
            house: metadata.house,
          },
        },
      },
    }),
  },
  [GAME_ACTION_TYPES.END_TURN]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game }) => game.turn === uid && game.state[uid].house,
    invokeAction: ({ uid, game, hidden, personal }) => {
      const numCardDraw = Math.max(
        game.state[uid].maxHandSize - personal[uid].hand.length,
        0,
      );
      const deck = drop(hidden[uid].deck, numCardDraw);
      const hand = [
        ...personal[uid].hand,
        ...take(hidden[uid].deck, numCardDraw),
      ];
      return {
        hidden: {
          [uid]: {
            ...personal[hidden],
            deck,
          },
        },
        personal: {
          [uid]: {
            ...personal[uid],
            hand,
          },
        },
        game: {
          ...game,
          turn: game.players.filter(player => player !== uid)[0],
          state: {
            ...game.state,
            [uid]: {
              ...game.state[uid],
              deckSize: deck.length,
              handSize: hand.length,
              turn: game.state[uid].turn + 1,
              chain: Math.max(game.state[uid].chain - 1, 0),
              battleline: removeExhaustion(game.state[uid].battleline),
              artifacts: removeExhaustion(game.state[uid].artifacts),
              house: '',
            },
          },
        },
      };
    },
  },
  [GAME_ACTION_TYPES.DISCARD_CARD]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game, metadata, personal }) => {
      const { house } = game.state[uid];
      const card = find(personal[uid].hand, { key: metadata.key });
      return game.turn === uid && house && card && card.house === house;
    },
    invokeAction: ({ uid, game, metadata, personal }) => ({
      personal: {
        [uid]: {
          ...personal[uid],
          hand: filter(personal[uid].hand, ({ key }) => key !== metadata.key),
        },
      },
      game: {
        ...game,
        state: {
          ...game.state,
          [uid]: {
            ...game.state[uid],
            handSize: game.state[uid].handSize - 1,
            discard: [
              find(personal[uid].hand, { key: metadata.key }),
              ...game.state[uid].discard,
            ],
          },
        },
      },
    }),
  },
  [GAME_ACTION_TYPES.PLAY_CREATURE]: {
    ...DEFAULT_CONFIG,
    validate: ({ uid, game, metadata, personal }) => {
      const { house } = game.state[uid];
      const card = find(personal[uid].hand, { key: metadata.key });
      return game.turn === uid && house && card && card.house === house;
    },
    invokeAction: ({ uid, game, metadata, personal }) => {
      const card = {
        ...find(personal[uid].hand, { key: metadata.key }),
        isExhausted: true,
      };
      let battleline = game.state[uid].battleline;
      if (metadata.isLeftFlank) {
        battleline = [card, ...battleline];
      } else {
        battleline = [...battleline, card];
      }
      return {
        personal: {
          [uid]: {
            ...personal[uid],
            hand: filter(personal[uid].hand, ({ key }) => key !== metadata.key),
          },
        },
        game: {
          ...game,
          state: {
            ...game.state,
            [uid]: {
              ...game.state[uid],
              handSize: game.state[uid].handSize - 1,
              battleline,
            },
          },
        },
      };
    },
  },
};
