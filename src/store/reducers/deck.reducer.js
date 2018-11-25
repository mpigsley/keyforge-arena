import {
  SET_SEARCH_TERM,
  UPDATED_DECKS,
  SUBMITTED,
  DELETED,
} from 'store/actions/deck.actions';
import { INITIALIZED_GAME } from 'store/actions/combined.actions';
import { SIGNED_OUT, INITIALIZED_APP } from 'store/actions/session.actions';

import { omit } from 'constants/lodash';

const initialState = {
  searchTerm: '',
  models: {},
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED_APP:
    case INITIALIZED_GAME:
    case UPDATED_DECKS:
      return { ...state, models: { ...state.models, ...action.decks } };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.searchTerm };
    case SUBMITTED:
      return { ...state, models: { ...state.models, ...action.deck } };
    case DELETED:
      return { ...state, models: omit(state.models, action.id) };
    case SIGNED_OUT:
      return initialState;
    default:
      return state;
  }
}
