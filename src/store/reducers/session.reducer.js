import { SIGNED_OUT, AUTH_FAILURE } from 'store/actions/session.actions';
import { INITIALIZED_APP } from 'store/actions/combined.actions';

const initialState = {
  isInitialized: false,
  model: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED_APP:
      return { ...state, model: action.user, error: null, isInitialized: true };
    case SIGNED_OUT:
      return { ...state, model: null, error: null };
    case AUTH_FAILURE:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
