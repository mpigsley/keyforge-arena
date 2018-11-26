import {
  LOGGED_IN,
  SIGNED_OUT,
  INITIALIZED,
  TOGGLED_LOGIN_MODAL,
  UPDATED_LOGIN_FORM,
  UPDATED_USER_FORM,
  UPDATED_USER,
  PASSWORD_RESET,
} from 'store/actions/user.actions';

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
    case TOGGLED_LOGIN_MODAL:
      return {
        ...state,
        isLoginModalOpen: !state.isLoginModalOpen,
        loginForm: initialLoginForm,
      };
    case LOGGED_IN.PENDING:
    case PASSWORD_RESET.PENDING:
      return { ...state, isLoggingIn: true, error: null };
    case LOGGED_IN.ERROR:
    case UPDATED_USER.ERROR:
    case PASSWORD_RESET.ERROR:
      return { ...state, isLoggingIn: false, error: action.error };
    case PASSWORD_RESET.SUCCESS:
      return { ...state, isLoginModalOpen: false };
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
    case UPDATED_USER.SUCCESS:
      return {
        ...state,
        model: { ...state.model, ...action.update },
        userForm: { ...state.userForm, ...action.update },
      };
    case UPDATED_USER_FORM:
      return {
        ...state,
        error: null,
        userForm: { ...state.userForm, ...action.form },
      };
    case UPDATED_LOGIN_FORM:
      return { ...state, loginForm: { ...state.loginForm, ...action.form } };
    case SIGNED_OUT.SUCCESS:
      return {
        ...initialState,
        isInitialized: true,
      };
    default:
      return state;
  }
}
