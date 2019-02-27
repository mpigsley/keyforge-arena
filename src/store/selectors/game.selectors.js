import { createSelector } from 'reselect';

import {
  getUserId,
  getDecks,
  getGames,
  getCardImages,
  getCardModal,
  getSelectedGame,
} from 'store/selectors/base.selectors';
import { find, every, mapValues, size, keys, map } from 'constants/lodash';
import CARD_MODAL_TYPES from 'constants/card-modal-types';

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

const cardIdsToObjects = cardIds =>
  cardIds.map(id => {
    const [expansion, house, card] = id.split('-');
    return { card, expansion, house };
  });

const buildState = (state, deck, cardImages) => ({
  ...state,
  artifacts: cardIdsToObjects(state.artifacts, cardImages),
  battlelines: cardIdsToObjects(state.battlelines, cardImages),
  purged: cardIdsToObjects(state.purged, cardImages),
  discard: cardIdsToObjects(state.discard, cardImages),
  hand: cardIdsToObjects(state.hand || [], cardImages),
  archived: cardIdsToObjects(state.archived || [], cardImages),
  houses: keys((deck || {}).houses),
});

export const gameState = createSelector(
  [selectedGame, getUserId, getCardImages, gameDecks],
  (game, userId, cardImages, decks) => {
    if (!game) {
      return undefined;
    }
    return {
      ...game,
      state: map(game.state, (state, key) => ({
        key,
        isOpponent: key !== userId,
        ...buildState(state, decks[key], cardImages),
      })),
    };
  },
);

export const opponentTurn = createSelector(
  [gameState, getUserId],
  (game, userId) => game.turn !== userId,
);

export const playerHouse = createSelector(
  [gameState],
  game => (find(game.state, { isOpponent: false }) || {}).house,
);

export const cardModal = createSelector(
  [gameState, getCardModal],
  (game, cardModalKey) => {
    const { listKey, ...cardModalConfig } =
      CARD_MODAL_TYPES[cardModalKey] || {};
    const playerState = find(game.state, { isOpponent: false }) || {};
    const opponentState = find(game.state, { isOpponent: true }) || {};
    const cardLists = {
      hand: playerState.hand,
      discard: playerState.discard,
      purged: playerState.purged,
      archived: playerState.purged,
      opponentDiscard: opponentState.discard,
      opponentPurged: opponentState.purged,
    };
    return {
      ...cardModalConfig,
      cards: cardLists[listKey] || [],
    };
  },
);
