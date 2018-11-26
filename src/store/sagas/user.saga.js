import { all, call, put, take, spawn, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { eventChannel } from 'redux-saga';

import {
  LOGGED_IN,
  SIGNED_OUT,
  INITIALIZED,
  UPDATED_USER,
} from 'store/actions/session.actions';
import {
  profileListener,
  getCurrentUser,
  signout,
  googleLogin,
  login,
  signup,
} from 'store/api/session.api';
import { createAction } from 'utils/store';

const createProfileListener = uid =>
  eventChannel(emit => {
    const unsubscribe = profileListener(uid, emit);
    return () => {
      unsubscribe();
    };
  });

function* updateProfile(profileChannel) {
  while (true) {
    const update = yield take(profileChannel);
    yield put(createAction(UPDATED_USER, { update }));
  }
}

let profileChannel;
function* onLogin(user) {
  profileChannel = yield call(createProfileListener, user.uid);
  yield spawn(updateProfile, profileChannel);
  yield put(createAction(LOGGED_IN.SUCCESS, { user }));
  yield put(push('/dashboard'));
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
  yield all([call(sessionFlow)]);
}
