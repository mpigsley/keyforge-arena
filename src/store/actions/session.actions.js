import { push } from 'connected-react-router';

import {
  doGoogleLogin,
  doSignup,
  doLogin,
  doPasswordReset,
  doSignout,
  updateProfile,
} from 'store/api/session.api';
import { initializeApp } from 'store/actions/combined.actions';
import { getUserId, getUserForm } from 'store/selectors/base.selectors';
import { pick } from 'constants/lodash';

const ACTION_PREFIX = '@@session';
export const SIGNED_OUT = `${ACTION_PREFIX}/SIGNED_OUT`;
export const AUTH_FAILURE = `${ACTION_PREFIX}/AUTH_FAILURE`;
export const UPDATED_FORM = `${ACTION_PREFIX}/UPDATED_FORM`;
export const UPDATED_USER = `${ACTION_PREFIX}/UPDATED_USER`;

const onLogin = dispatch => result => {
  dispatch(initializeApp(result.user ? result.user.toJSON() : result.toJSON()));
};

export const updateForm = form => ({ type: UPDATED_FORM, form });

export const updateUser = () => (dispatch, getState) => {
  const state = getState();
  const uid = getUserId(state);
  const form = pick(getUserForm(state), 'username');
  return updateProfile(uid, form).then(() =>
    dispatch({
      type: UPDATED_USER,
      user: form,
    }),
  );
};

export const googleLogin = () => dispatch =>
  doGoogleLogin()
    .then(onLogin(dispatch))
    .catch(error => {
      dispatch({ type: AUTH_FAILURE, error: error.message });
      console.error(error);
      throw error;
    });

export const signup = ({ email, password, confirm }) => dispatch => {
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
    .then(result => (result.user || result).sendEmailVerification())
    .catch(error => {
      dispatch({ type: AUTH_FAILURE, error: error.message });
      console.error(error);
      throw error;
    });
};

export const login = ({ email, password }) => dispatch => {
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

export const passwordReset = ({ email }) => dispatch =>
  doPasswordReset(email).catch(error => {
    dispatch({ type: AUTH_FAILURE, error: error.message });
    console.error(error);
  });

export const signout = () => dispatch =>
  doSignout()
    .then(() => {
      dispatch(push('/'));
      dispatch({ type: SIGNED_OUT });
    })
    .catch(console.error);
