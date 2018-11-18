import { createSelector } from 'reselect';

import { getDecks, getDeckSearchTerm } from 'store/selectors/base.selectors';
import { includes, sortBy, map } from 'constants/lodash';

const deckArray = createSelector(
  [getDecks],
  decks => map(decks, (deck, key) => ({ ...deck, key })),
);

const filteredDecks = createSelector(
  [deckArray, getDeckSearchTerm],
  (decks, searchTerm) =>
    decks.filter(({ name }) =>
      includes(name.toLowerCase(), searchTerm.toLowerCase()),
    ),
);

// eslint-disable-next-line
export const getSortedDecks = createSelector(
  [filteredDecks],
  decks => sortBy(decks, 'name'),
);
