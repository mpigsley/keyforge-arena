import {
  passwordReset as doPasswordReset,
  googleLogin as doGoogleLogin,
  signup as doSignup,
  login as doLogin,
  updateProfile,
} from 'store/api/session.api';

import {
  getUserId,
  getUserForm,
  getLoginForm,
} from 'store/selectors/base.selectors';

import { pick } from 'constants/lodash';
import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@session';
export const LOGGED_IN = createAsyncTypes(`${ACTION_PREFIX}/LOGGED_IN`);
export const SIGNED_OUT = createAsyncTypes(`${ACTION_PREFIX}/SIGNED_OUT`);
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;
export const AUTH_FAILURE = `${ACTION_PREFIX}/AUTH_FAILURE`;
export const TOGGLED_LOGIN_MODAL = `${ACTION_PREFIX}/TOGGLED_LOGIN_MODAL`;
export const UPDATED_LOGIN_FORM = `${ACTION_PREFIX}/UPDATED_LOGIN_FORM`;
export const UPDATED_USER_FORM = `${ACTION_PREFIX}/UPDATED_USER_FORM`;
export const UPDATED_USER = `${ACTION_PREFIX}/UPDATED_USER`;

export const updateUserForm = form => ({ type: UPDATED_USER_FORM, form });
export const updateLoginForm = form => ({ type: UPDATED_LOGIN_FORM, form });
export const toggleLoginModal = () => ({ type: TOGGLED_LOGIN_MODAL });
export const signout = () => ({ type: SIGNED_OUT.PENDING });
export const authenticate = (key, form) => ({
  type: LOGGED_IN.PENDING,
  key,
  form,
});

const onLogin = () => result => (result.user ? result.user : result);

export const updateUser = () => (dispatch, getState) => {
  const state = getState();
  const uid = getUserId(state);
  return updateProfile(uid, pick(getUserForm(state), 'username'));
};

export const googleLogin = () => dispatch =>
  doGoogleLogin()
    .then(onLogin(dispatch))
    .catch(error => {
      dispatch({ type: AUTH_FAILURE, error: error.message });
      console.error(error);
      throw error;
    });

export const signup = () => (dispatch, getState) => {
  const state = getState();
  const { email, password, confirm } = getLoginForm(state);
  if (!email || !password || !confirm) {
    return dispatch({
      type: AUTH_FAILURE,
      error: 'Email and password are required.',
    });
  }
  if (password !== confirm) {
    return dispatch({
      type: AUTH_FAILURE,
      error: 'Passwords do not match.',
    });
  }
  return doSignup(email, password)
    .then(onLogin(dispatch))
    .then(user => user.sendEmailVerification())
    .catch(error => {
      dispatch({ type: AUTH_FAILURE, error: error.message });
      console.error(error);
      throw error;
    });
};

export const login = () => (dispatch, getState) => {
  const state = getState();
  const { email, password } = getLoginForm(state);
  if (!email || !password) {
    return dispatch({
      type: AUTH_FAILURE,
      error: 'Email and password are required.',
    });
  }
  return doLogin(email, password)
    .then(onLogin(dispatch))
    .catch(error => {
      dispatch({ type: AUTH_FAILURE, error: error.message });
      console.error(error);
      throw error;
    });
};

export const passwordReset = () => (dispatch, getState) => {
  const state = getState();
  const { email } = getLoginForm(state);
  return doPasswordReset(email).catch(error => {
    dispatch({ type: AUTH_FAILURE, error: error.message });
    console.error(error);
  });
};
