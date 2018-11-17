import {
  INITIALIZED,
  LOGGED_IN,
  SIGNED_OUT,
  AUTH_FAILURE,
} from 'store/actions/session.actions';

const initialState = {
  isInitialized: false,
  model: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
    case LOGGED_IN:
      return { ...state, model: action.user, error: null, isInitialized: true };
    case SIGNED_OUT:
      return { ...state, model: null, error: null };
    case AUTH_FAILURE:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
