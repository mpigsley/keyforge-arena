import { submitDeck } from 'store/api/deck.api';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;
export const SUBMIT_ERRORED = `${ACTION_PREFIX}/SUBMIT_ERRORED`;

export const setSearchTerm = searchTerm => ({
  type: SET_SEARCH_TERM,
  searchTerm,
});

export const submitNewDeck = link => dispatch =>
  submitDeck(link)
    .then(deck => dispatch({ type: SUBMITTED, deck }))
    .catch(e => dispatch({ type: SUBMIT_ERRORED, error: e.message }));
