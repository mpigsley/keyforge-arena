import { push } from 'connected-react-router';
import { map, sortBy } from 'constants/lodash';

import { submitDeck, deleteDeck } from 'store/api/deck.api';
import { getDecks, getPathname } from 'store/selectors/base.selectors';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;
export const DELETED = `${ACTION_PREFIX}/DELETED`;

export const setSearchTerm = searchTerm => ({
  type: SET_SEARCH_TERM,
  searchTerm,
});

export const submitNewDeck = link => dispatch =>
  submitDeck(link).then(deck => {
    dispatch({ type: SUBMITTED, deck });
    dispatch(push(`/decks/${Object.keys(deck)[0]}`));
  });

export const removeDeck = id => (dispatch, getState) =>
  deleteDeck(id).then(() => {
    dispatch({ type: DELETED, id });
    const state = getState();
    const pathname = getPathname(state);
    if (pathname.includes(id)) {
      const decks = getDecks(state);
      const sortedDecks = sortBy(
        map(decks, (deck, key) => ({ ...deck, key })),
        'name',
      );
      if (sortedDecks.length) {
        dispatch(push(`/decks/${sortedDecks[0].key}`));
      } else {
        dispatch(push('/decks'));
      }
    }
  });
