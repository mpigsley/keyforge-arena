import { submitDeck } from 'store/api/deck.api';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;

export const setSearchTerm = searchTerm => ({
  type: SET_SEARCH_TERM,
  searchTerm,
});

export const submitNewDeck = link => dispatch =>
  submitDeck(link).then(deck => dispatch({ type: SUBMITTED, deck }));
