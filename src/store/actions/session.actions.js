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
import { profileListener } from '../api/session.api';

const ACTION_PREFIX = '@@session';
export const SIGNED_OUT = `${ACTION_PREFIX}/SIGNED_OUT`;
export const AUTH_FAILURE = `${ACTION_PREFIX}/AUTH_FAILURE`;
export const UPDATED_FORM = `${ACTION_PREFIX}/UPDATED_FORM`;
export const UPDATED_USER = `${ACTION_PREFIX}/UPDATED_USER`;

let profileListenerRef;
const onLogin = dispatch => result => {
  const user = result.user ? result.user : result;
  const json = user.toJSON();
  profileListenerRef = profileListener(json.uid, update =>
    dispatch({ type: UPDATED_USER, user: update }),
  );
  dispatch(initializeApp(json));
  return user;
};

export const updateForm = form => ({ type: UPDATED_FORM, form });

export const updateUser = () => (dispatch, getState) => {
  const state = getState();
  const uid = getUserId(state);
  const form = pick(getUserForm(state), 'username');
  return updateProfile(uid, form);
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
    .then(user => user.sendEmailVerification())
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
      if (profileListenerRef) {
        profileListenerRef();
      }
      dispatch(push('/'));
      dispatch({ type: SIGNED_OUT });
    })
    .catch(console.error);
