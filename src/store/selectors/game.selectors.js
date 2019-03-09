import { createSelector } from 'reselect';

import {
  getUserId,
  getDecks,
  getGames,
  getCardModal,
  getDraggedCard,
  getSelectedGame,
} from 'store/selectors/base.selectors';
import { find, every, mapValues, size, keys, map } from 'constants/lodash';
import CARD_MODAL_TYPES from 'constants/card-modal-types';
import CARDS_BY_EXPANSION from 'constants/cards';
import CARD_TYPES from 'constants/card-types';

export const selectedGame = createSelector(
  [getGames, getSelectedGame],
  (games, selected) => games[selected],
);

export const selectedGameStart = createSelector(
  [selectedGame],
  game => (game ? game.created.toDate() : undefined),
);

export const isGameFinished = createSelector(
  [selectedGame],
  game => !!(game || {}).isFinished,
);

export const gameDecks = createSelector(
  [selectedGame, getDecks],
  (game, decks) =>
    !game ? [] : mapValues(game.state, state => decks[state.deck]),
);

export const hasLoadedGameDecks = createSelector(
  [gameDecks],
  decks => size(decks) === 2 && every(Object.values(decks)),
);

const buildState = (state, deck) => ({
  ...state,
  artifacts: state.artifacts,
  battleline: state.battleline,
  purged: state.purged,
  discard: state.discard,
  hand: state.hand || [],
  archived: state.archived || [],
  houses: keys((deck || {}).houses),
});

export const gameState = createSelector(
  [selectedGame, getUserId, gameDecks],
  (game, userId, decks) => {
    if (!game) {
      return undefined;
    }
    return {
      ...game,
      state: map(game.state, (state, key) => ({
        key,
        isOpponent: key !== userId,
        ...buildState(state, decks[key]),
      })),
    };
  },
);

export const playerState = createSelector(
  [gameState],
  game => find((game || {}).state, { isOpponent: false }) || {},
);

export const opponentState = createSelector(
  [gameState],
  game => find((game || {}).state, { isOpponent: true }) || {},
);

export const opponentTurn = createSelector(
  [gameState, getUserId],
  (game, userId) => game.turn !== userId,
);

export const playerTurn = createSelector(
  [gameState, getUserId],
  (game, userId) => game.turn === userId,
);

export const playerHouse = createSelector(
  [playerState],
  state => state.house,
);

export const playerHand = createSelector(
  [playerState],
  state => state.hand || [],
);

export const draggedCardType = createSelector(
  [playerHand, getDraggedCard],
  (hand, cardKey) => {
    const { expansion, card } = find(hand, { key: cardKey }) || {};
    if (!card) {
      return undefined;
    }
    return find(CARDS_BY_EXPANSION[expansion], { card_number: Number(card) })
      .card_type;
  },
);

export const isDraggedAction = createSelector(
  [draggedCardType],
  type => type === CARD_TYPES.ACTION,
);

export const isDraggedArtifact = createSelector(
  [draggedCardType],
  type => type === CARD_TYPES.ARTIFACT,
);

export const isDraggedCreature = createSelector(
  [draggedCardType],
  type => type === CARD_TYPES.CREATURE,
);

export const isDraggedUpgrade = createSelector(
  [draggedCardType],
  type => type === CARD_TYPES.UPGRADE,
);

export const cardModal = createSelector(
  [playerState, opponentState, getCardModal],
  (player, opponent, cardModalKey) => {
    const { listKey, ...cardModalConfig } =
      CARD_MODAL_TYPES[cardModalKey] || {};
    const cardLists = {
      hand: player.hand,
      discard: player.discard,
      purged: player.purged,
      archived: player.purged,
      opponentDiscard: opponent.discard,
      opponentPurged: opponent.purged,
    };
    return {
      ...cardModalConfig,
      cards: cardLists[listKey] || [],
    };
  },
);
