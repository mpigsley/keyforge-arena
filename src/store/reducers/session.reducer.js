import {
  SIGNED_OUT,
  AUTH_FAILURE,
  INITIALIZED_APP,
  TOGGLED_LOGIN_MODAL,
  UPDATED_LOGIN_FORM,
  UPDATED_USER_FORM,
  UPDATED_USER,
} from 'store/actions/session.actions';

const initialLoginForm = {
  email: '',
  password: '',
  confirm: '',
};

const initialState = {
  isInitialized: false,
  isLoginModalOpen: false,
  loginForm: initialLoginForm,
  userForm: {},
  model: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED_APP:
      return {
        ...state,
        error: null,
        isInitialized: true,
        isLoginModalOpen: false,
        model: { ...(state.model || {}), ...action.user },
        userForm: {
          email: (action.user || {}).email,
          username: (action.user || {}).username || '',
          ...state.userForm,
        },
      };
    case TOGGLED_LOGIN_MODAL:
      return {
        ...state,
        isLoginModalOpen: !state.isLoginModalOpen,
        loginForm: initialLoginForm,
      };
    case UPDATED_USER_FORM:
      return { ...state, userForm: { ...state.userForm, ...action.form } };
    case UPDATED_LOGIN_FORM:
      return { ...state, loginForm: { ...state.loginForm, ...action.form } };
    case UPDATED_USER:
      return {
        ...state,
        model: { ...state.model, ...action.user },
        userForm: { ...state.userForm, ...action.user },
      };
    case AUTH_FAILURE:
      return { ...state, error: action.error };
    case SIGNED_OUT:
      return {
        ...initialState,
        isInitialized: true,
      };
    default:
      return state;
  }
}
