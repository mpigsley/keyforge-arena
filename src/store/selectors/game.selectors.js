import { createSelector } from 'reselect';

import {
  getUserId,
  getDecks,
  getGames,
  getSelectedGame,
  getCardImages,
} from 'store/selectors/base.selectors';
import { find, every, flatten, mapValues, size } from 'constants/lodash';

export const selectedGame = createSelector(
  [getGames, getSelectedGame],
  (games, selected) => games[selected],
);

export const selectedGameStart = createSelector(
  [selectedGame],
  game => (game ? game.created.toDate() : undefined),
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

export const hasGameLoaded = createSelector(
  [hasLoadedGameDecks, gameDecks, getCardImages],
  (loadedDecks, decks, images) => {
    if (!loadedDecks) {
      return false;
    }
    const imageRefs = Object.values(decks).reduce(
      (arr, { expansion, houses }) => [
        ...arr,
        ...flatten(Object.values(houses)).map(id => `${expansion}-${id}`),
      ],
      [],
    );
    return every(imageRefs, ref => images[ref]);
  },
);

const cardIdsToObjects = (cardIds, cardImages) =>
  cardIds.map(id => {
    const [expansion, house, card] = id.split('-');
    return {
      card,
      expansion,
      house,
      image: cardImages[`${expansion}-${card}`],
    };
  });

const buildState = (state, cardImages) => ({
  ...state,
  artifacts: cardIdsToObjects(state.artifacts, cardImages),
  battlelines: cardIdsToObjects(state.battlelines, cardImages),
  purged: cardIdsToObjects(state.purged, cardImages),
  discard: cardIdsToObjects(state.discard, cardImages),
  hand: cardIdsToObjects(state.hand || [], cardImages),
  archived: cardIdsToObjects(state.archived || [], cardImages),
});

export const getPlayerState = createSelector(
  [selectedGame, getUserId, getCardImages],
  (game, userId, cardImages) =>
    !game ? undefined : buildState(game.state[userId], cardImages),
);

export const getOpponentState = createSelector(
  [selectedGame, getUserId, getCardImages],
  (game, userId, cardImages) =>
    !game
      ? undefined
      : buildState(find(game.state, (_, uid) => uid !== userId), cardImages),
);
