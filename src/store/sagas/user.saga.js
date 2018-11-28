import {
  all,
  call,
  put,
  take,
  spawn,
  fork,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { toastr } from 'react-redux-toastr';
import { push } from 'connected-react-router';

import {
  INITIALIZED,
  LOGGED_IN,
  SIGNED_OUT,
  UPDATED_USER,
  PASSWORD_RESET,
} from 'store/actions/user.actions';
import {
  updateProfile as doUpdateProfile,
  passwordReset,
  profileListener,
  getCurrentUser,
  signout,
  googleLogin,
  login,
  signup,
} from 'store/api/user.api';
import { getPathname } from 'store/selectors/base.selectors';
import { createAction } from 'utils/store';

function* updateProfile({ user, form }) {
  try {
    yield call(doUpdateProfile, user, form);
  } catch (error) {
    yield put(createAction(UPDATED_USER.ERROR, { error: error.message }));
  }
}

function* resetPassword({ form }) {
  try {
    yield call(passwordReset, form);
    yield put(createAction(PASSWORD_RESET.SUCCESS));
    yield call(
      toastr.success,
      'Password Reset Sent',
      'You should be receiving an email shortly.',
    );
  } catch (error) {
    yield put(createAction(PASSWORD_RESET.ERROR, { error: error.message }));
  }
}

const createProfileListener = uid =>
  eventChannel(emit => {
    const unsubscribe = profileListener(uid, emit);
    return () => unsubscribe();
  });

function* updateProfileHandler(channel) {
  while (true) {
    const update = yield take(channel);
    yield put(createAction(UPDATED_USER.SUCCESS, { update }));
  }
}

let profileChannel;
function* onLogin(user) {
  profileChannel = yield call(createProfileListener, user.uid);
  yield spawn(updateProfileHandler, profileChannel);
  yield put(createAction(LOGGED_IN.SUCCESS, { user }));
  const pathname = yield select(getPathname);
  if (pathname === '/') {
    yield put(push('/dashboard'));
  }
}

function* loginFlow() {
  try {
    const { key, form } = yield take(LOGGED_IN.PENDING);
    let loginUser;
    if (key === 'google') {
      loginUser = yield call(googleLogin);
    } else if (key === 'signup') {
      loginUser = yield call(signup, form);
    } else {
      loginUser = yield call(login, form);
    }
    loginUser = loginUser.user ? loginUser.user.toJSON() : loginUser.toJSON();
    yield call(onLogin, loginUser);
  } catch (error) {
    yield put(createAction(LOGGED_IN.ERROR, { error: error.message }));
  }
}

function* signoutFlow() {
  try {
    const action = yield take([LOGGED_IN.ERROR, SIGNED_OUT.PENDING]);
    if (action.type === LOGGED_IN.ERROR) {
      return;
    }
    yield call(signout);
    yield put(createAction(SIGNED_OUT.SUCCESS));
    if (profileChannel) {
      profileChannel.close();
    }
  } catch (error) {
    yield put(createAction(SIGNED_OUT.ERROR, { error: error.message }));
  }
}

function* sessionFlow() {
  const currentUser = yield call(getCurrentUser);
  if (currentUser) {
    yield fork(onLogin, currentUser);
    yield call(signoutFlow);
  } else {
    yield put(createAction(INITIALIZED));
  }
  while (true) {
    yield fork(loginFlow);
    yield call(signoutFlow);
  }
}

export default function*() {
  yield all([
    call(sessionFlow),
    takeEvery(UPDATED_USER.PENDING, updateProfile),
    takeEvery(PASSWORD_RESET.PENDING, resetPassword),
  ]);
}
