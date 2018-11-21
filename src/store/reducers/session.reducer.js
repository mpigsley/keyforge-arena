import { LOCATION_CHANGE } from 'connected-react-router';
import {
  SIGNED_OUT,
  AUTH_FAILURE,
  UPDATED_FORM,
  UPDATED_USER,
} from 'store/actions/session.actions';
import { INITIALIZED_APP } from 'store/actions/combined.actions';

const initialState = {
  isInitialized: false,
  form: { email: '', username: '' },
  model: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED_APP:
      return {
        ...state,
        model: action.user,
        error: null,
        isInitialized: true,
        form: {
          email: action.user.email,
          username: action.user.username || '',
        },
      };
    case LOCATION_CHANGE: {
      const { email, username } = state.model || {};
      return {
        ...state,
        form: { email: email || '', username: username || '' },
      };
    }
    case UPDATED_FORM:
      return { ...state, form: { ...state.form, ...action.form } };
    case UPDATED_USER:
      return { ...state, model: { ...state.model, ...state.user } };
    case AUTH_FAILURE:
      return { ...state, error: action.error };
    case SIGNED_OUT:
      return initialState;
    default:
      return state;
  }
}
