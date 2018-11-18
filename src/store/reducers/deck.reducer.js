import { SET_SEARCH_TERM, SUBMITTED } from 'store/actions/deck.actions';
import { INITIALIZED } from 'store/actions/combined.actions';

const initialState = {
  searchTerm: '',
  models: {},
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
      return { ...state, models: action.decks };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.searchTerm };
    case SUBMITTED:
      return { ...state, decks: { ...state.decks, ...action.deck } };
    default:
      return state;
  }
}
