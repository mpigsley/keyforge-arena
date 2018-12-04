import { createSelector } from 'reselect';

import {
  getDecks,
  getGames,
  getSelectedGame,
  getCardImages,
} from 'store/selectors/base.selectors';
import { every, flatten, mapValues, size } from 'constants/lodash';

export const selectedGame = createSelector(
  [getGames, getSelectedGame],
  (games, selected) => games[selected],
);

export const gameDecks = createSelector(
  [selectedGame, getDecks],
  (game, decks) => (!game ? [] : mapValues(game.decks, id => decks[id])),
);

export const hasLoadedGameDecks = createSelector(
  [gameDecks],
  decks => size(decks) === 2 && every(Object.values(decks)),
);

export const hasGameLoaded = createSelector(
  [hasLoadedGameDecks, selectedGame, getDecks, getCardImages],
  (loadedDecks, game, decks, images) => {
    if (!loadedDecks) {
      return false;
    }
    const gameDecks = Object.values(game.decks).map(id => decks[id]);
    const imageRefs = gameDecks.reduce(
      (arr, { expansion, houses }) => [
        ...arr,
        ...flatten(Object.values(houses)).map(id => `${expansion}-${id}`),
      ],
      [],
    );
    return every(imageRefs, ref => images[ref]);
  },
);
