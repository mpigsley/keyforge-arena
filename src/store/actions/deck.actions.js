import { push } from 'connected-react-router';

import { submitDeck, deleteDeck } from 'store/api/deck.api';
import { getPathname } from 'store/selectors/base.selectors';

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
      dispatch(push('/decks'));
    }
  });
