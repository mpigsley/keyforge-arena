import { LOCATION_CHANGE } from 'connected-react-router';
import {
  TOGGLED_SUBMIT_MODAL,
  TOGGLED_CHANGE_MODAL,
  CHANGED_SELECTED,
  SET_SEARCH_TERM,
  SUBMITTED,
  UPDATED,
  DELETED,
} from 'store/actions/deck.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';

import { omit } from 'constants/lodash';

const initialState = {
  searchTerm: '',
  isSubmitModalOpen: false,
  isSubmittingDeck: false,
  isChangeModalOpen: false,
  isChangingSelected: false,
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
    case TOGGLED_CHANGE_MODAL:
      return { ...state, isChangeModalOpen: !state.isChangeModalOpen };
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
    case CHANGED_SELECTED.PENDING:
      return { ...state, isChangingSelected: true };
    case CHANGED_SELECTED.ERROR:
      return { ...state, isChangingSelected: false, error: action.error };
    case CHANGED_SELECTED.SUCCESS:
      return {
        ...state,
        error: null,
        isChangingSelected: false,
        isChangeModalOpen: false,
        models: {
          ...state.models,
          [action.current]: { ...state.models[action.current], selected: true },
          [action.previous]: {
            ...state.models[action.previous],
            selected: false,
          },
        },
      };
    case DELETED.SUCCESS:
      return { ...state, models: omit(state.models, action.id) };
    case LOCATION_CHANGE:
      return {
        ...state,
        error: null,
        isSubmittingDeck: false,
        isSubmitModalOpen: false,
        isChangingSelected: false,
        isChangeModalOpen: false,
      };
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
