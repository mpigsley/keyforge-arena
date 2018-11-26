import { push } from 'connected-react-router';

import { submitDeck, deleteDeck, updateDeck } from 'store/api/deck.api';
import { getPathname, getDecks } from 'store/selectors/base.selectors';
import { getSelectedDeck } from 'store/selectors/deck.selectors';

import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;
export const UPDATED_DECKS = createAsyncTypes(`${ACTION_PREFIX}/UPDATED_DECKS`);
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

export const changeSelectedDeck = id => (dispatch, getState) => {
  const state = getState();
  const selectedDeck = getSelectedDeck(state);
  const decks = getDecks(state);
  dispatch({
    type: UPDATED_DECKS.SUCCESS,
    decks: {
      [selectedDeck.key]: { ...decks[selectedDeck.key], selected: false },
      [id]: { ...decks[id], selected: true },
    },
  });
  return Promise.all([
    updateDeck(selectedDeck.key, { selected: false }),
    updateDeck(id, { selected: true }),
  ]);
};
