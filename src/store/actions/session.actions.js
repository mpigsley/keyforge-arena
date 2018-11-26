import { passwordReset as doPasswordReset } from 'store/api/session.api';

import { getLoginForm } from 'store/selectors/base.selectors';

import { pick } from 'constants/lodash';
import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@user';
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;
export const UPDATE_PROFILE = `${ACTION_PREFIX}/UPDATE_PROFILE`;
export const LOGGED_IN = createAsyncTypes(`${ACTION_PREFIX}/LOGGED_IN`);
export const SIGNED_OUT = createAsyncTypes(`${ACTION_PREFIX}/SIGNED_OUT`);
export const UPDATED_USER = createAsyncTypes(`${ACTION_PREFIX}/UPDATED_USER`);

export const TOGGLED_LOGIN_MODAL = `${ACTION_PREFIX}/TOGGLED_LOGIN_MODAL`;
export const UPDATED_LOGIN_FORM = `${ACTION_PREFIX}/UPDATED_LOGIN_FORM`;
export const UPDATED_USER_FORM = `${ACTION_PREFIX}/UPDATED_USER_FORM`;

export const updateUserForm = form => ({ type: UPDATED_USER_FORM, form });
export const updateLoginForm = form => ({ type: UPDATED_LOGIN_FORM, form });
export const toggleLoginModal = () => ({ type: TOGGLED_LOGIN_MODAL });
export const signout = () => ({ type: SIGNED_OUT.PENDING });
export const authenticate = (key, form) => ({
  type: LOGGED_IN.PENDING,
  key,
  form,
});
export const updateProfile = (uid, form) => ({
  type: UPDATED_USER.PENDING,
  user: uid,
  form: pick(form, 'username'),
});

export const passwordReset = () => (dispatch, getState) => {
  const state = getState();
  const { email } = getLoginForm(state);
  return doPasswordReset(email);
};
