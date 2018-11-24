import { createSelector } from 'reselect';

import {
  getDecks,
  getDeckSearchTerm,
  getUserId,
} from 'store/selectors/base.selectors';
import { find, includes, sortBy, map } from 'constants/lodash';

const deckArray = createSelector(
  [getDecks],
  decks => map(decks, (deck, key) => ({ ...deck, key })),
);

const filteredDecks = createSelector(
  [deckArray, getDeckSearchTerm, getUserId],
  (decks, searchTerm, userId) =>
    decks.filter(
      ({ name, creator }) =>
        includes(name.toLowerCase(), searchTerm.toLowerCase()) &&
        creator === userId,
    ),
);

export const getSortedDecks = createSelector(
  [filteredDecks],
  decks => sortBy(decks, 'name'),
);

export const getSelectedDeck = createSelector(
  [getSortedDecks],
  decks => find(decks, { selected: true }) || decks[0],
);
