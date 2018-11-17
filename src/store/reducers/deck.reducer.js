import {
  SET_SEARCH_TERM,
  SUBMITTED,
  SUBMIT_ERRORED,
} from 'store/actions/deck.actions';
import { INITIALIZED } from 'store/actions/combined.actions';

const initialState = {
  searchTerm: '',
  models: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
      return { ...state, models: action.decks };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.searchTerm };
    case SUBMITTED:
      return { ...state, decks: { ...state.decks, ...action.deck } };
    case SUBMIT_ERRORED:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
