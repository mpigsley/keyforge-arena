import { LOCATION_CHANGE } from 'connected-react-router';
import {
  SET_SEARCH_TERM,
  UPDATED,
  SUBMITTED,
  TOGGLED_SUBMIT_MODAL,
  DELETED,
} from 'store/actions/deck.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';

import { omit } from 'constants/lodash';

const initialState = {
  searchTerm: '',
  isSubmitModalOpen: false,
  isSubmittingDeck: false,
  error: null,
  models: {},
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case UPDATED.SUCCESS:
      return { ...state, models: { ...state.models, ...action.decks } };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.searchTerm };
    case TOGGLED_SUBMIT_MODAL:
      return { ...state, isSubmitModalOpen: !state.isSubmitModalOpen };
    case SUBMITTED.PENDING:
      return { ...state, isSubmittingDeck: true };
    case SUBMITTED.ERROR:
      return { ...state, isSubmittingDeck: false, error: action.error };
    case SUBMITTED.SUCCESS:
      return {
        ...state,
        error: null,
        isSubmittingDeck: false,
        isSubmitModalOpen: false,
        models: { ...state.models, ...action.deck },
      };
    case DELETED.SUCCESS:
      return { ...state, models: omit(state.models, action.id) };
    case LOCATION_CHANGE:
      return {
        ...state,
        error: null,
        isSubmittingDeck: false,
        isSubmitModalOpen: false,
      };
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
