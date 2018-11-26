import {
  LOGGED_IN,
  SIGNED_OUT,
  INITIALIZED,
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
  isLoggingIn: false,
  isLoginModalOpen: false,
  loginForm: initialLoginForm,
  userForm: {},
  model: null,
  error: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
      return { ...state, isInitialized: true };
    case LOGGED_IN.PENDING:
      return { ...state, isLoggingIn: true, error: null };
    case LOGGED_IN.ERROR:
      return { ...state, isLoggingIn: false, error: action.error };
    case LOGGED_IN.SUCCESS:
      return {
        ...state,
        error: null,
        isLoggingIn: false,
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
        model: { ...state.model, ...action.update },
        userForm: { ...state.userForm, ...action.update },
      };
    case SIGNED_OUT.SUCCESS:
      return {
        ...initialState,
        isInitialized: true,
      };
    default:
      return state;
  }
}
