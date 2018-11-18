import {
  SET_SEARCH_TERM,
  SUBMITTED,
  DELETED,
} from 'store/actions/deck.actions';
import { INITIALIZED } from 'store/actions/combined.actions';
import { omit } from 'constants/lodash';

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
      return { ...state, models: { ...state.models, ...action.deck } };
    case DELETED:
      return { ...state, models: omit(state.models, action.id) };
    default:
      return state;
  }
}
