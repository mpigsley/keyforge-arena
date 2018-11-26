import { pick } from 'constants/lodash';
import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@user';
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;
export const TOGGLED_LOGIN_MODAL = `${ACTION_PREFIX}/TOGGLED_LOGIN_MODAL`;
export const UPDATED_LOGIN_FORM = `${ACTION_PREFIX}/UPDATED_LOGIN_FORM`;
export const UPDATED_USER_FORM = `${ACTION_PREFIX}/UPDATED_USER_FORM`;
export const LOGGED_IN = createAsyncTypes(`${ACTION_PREFIX}/LOGGED_IN`);
export const SIGNED_OUT = createAsyncTypes(`${ACTION_PREFIX}/SIGNED_OUT`);
export const UPDATED_USER = createAsyncTypes(`${ACTION_PREFIX}/UPDATED_USER`);
export const PASSWORD_RESET = createAsyncTypes(
  `${ACTION_PREFIX}/PASSWORD_RESET`,
);

export const updateUserForm = form => ({ type: UPDATED_USER_FORM, form });
export const updateLoginForm = form => ({ type: UPDATED_LOGIN_FORM, form });
export const toggleLoginModal = () => ({ type: TOGGLED_LOGIN_MODAL });
export const signout = () => ({ type: SIGNED_OUT.PENDING });
export const authenticate = (key, form) => ({
  type: LOGGED_IN.PENDING,
  key,
  form,
});
export const passwordReset = form => ({
  type: PASSWORD_RESET.PENDING,
  form,
});
export const updateProfile = (uid, form) => ({
  type: UPDATED_USER.PENDING,
  user: uid,
  form: pick(form, 'username'),
});
