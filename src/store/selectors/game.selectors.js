import { createSelector } from 'reselect';

import {
  getUserId,
  getDecks,
  getGames,
  getSelectedGame,
  getCardImages,
} from 'store/selectors/base.selectors';
import { every, flatten, mapValues, reduce, size } from 'constants/lodash';

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
  (game, decks) => (!game ? [] : mapValues(game.decks, id => decks[id])),
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

export const getGameDeckDetails = createSelector(
  [getUserId, gameDecks, getCardImages],
  (userId, decks, cardImages) =>
    mapValues(decks, (deck, key) =>
      !deck
        ? {}
        : {
            key,
            isCurrentUser: key === userId,
            expansion: deck.expansion,
            cards: reduce(
              deck.houses,
              (arr, cards, house) => [
                ...arr,
                ...cards.map(card => ({
                  card,
                  house,
                  image: cardImages[`${deck.expansion}-${card}`],
                })),
              ],
              [],
            ),
          },
    ),
);
