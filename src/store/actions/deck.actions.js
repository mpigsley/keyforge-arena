import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@deck';
export const TOGGLED_SUBMIT_MODAL = `${ACTION_PREFIX}/TOGGLED_SUBMIT_MODAL`;
export const TOGGLED_CHANGE_MODAL = `${ACTION_PREFIX}/TOGGLED_CHANGE_MODAL`;
export const SET_SEARCH_TERM = `${ACTION_PREFIX}/SET_SEARCH_TERM`;
export const SUBMITTED = createAsyncTypes(`${ACTION_PREFIX}/SUBMITTED`);
export const UPDATED = createAsyncTypes(`${ACTION_PREFIX}/UPDATED`);
export const DELETED = createAsyncTypes(`${ACTION_PREFIX}/DELETED`);
export const CHANGED_SELECTED = createAsyncTypes(
  `${ACTION_PREFIX}/CHANGED_SELECTED`,
);

export const toggleSubmitModal = () => ({ type: TOGGLED_SUBMIT_MODAL });
export const toggleChangeModal = () => ({ type: TOGGLED_CHANGE_MODAL });
export const submitNewDeck = link => ({ type: SUBMITTED.PENDING, link });
export const deleteDeck = id => ({ type: DELETED.PENDING, id });
export const changeSelected = (previous, current) => ({
  type: CHANGED_SELECTED.PENDING,
  previous,
  current,
});
export const setSearchTerm = searchTerm => ({
  type: SET_SEARCH_TERM,
  searchTerm,
});
