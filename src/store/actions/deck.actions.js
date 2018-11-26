import { updateDeck } from 'store/api/deck.api';
import { getDecks } from 'store/selectors/base.selectors';
import { getSelectedDeck } from 'store/selectors/deck.selectors';

import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = createAsyncTypes(`${ACTION_PREFIX}/SUBMITTED`);
export const UPDATED = createAsyncTypes(`${ACTION_PREFIX}/UPDATED`);
export const DELETED = createAsyncTypes(`${ACTION_PREFIX}/DELETED`);
export const TOGGLED_SUBMIT_MODAL = `${ACTION_PREFIX}/TOGGLED_SUBMIT_MODAL`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;

export const toggleSubmitModal = () => ({ type: TOGGLED_SUBMIT_MODAL });
export const submitNewDeck = link => ({ type: SUBMITTED.PENDING, link });
export const deleteDeck = id => ({ type: DELETED.PENDING, id });
export const setSearchTerm = searchTerm => ({
  type: SET_SEARCH_TERM,
  searchTerm,
});

export const changeSelectedDeck = id => (dispatch, getState) => {
  const state = getState();
  const selectedDeck = getSelectedDeck(state);
  const decks = getDecks(state);
  dispatch({
    type: UPDATED.SUCCESS,
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
