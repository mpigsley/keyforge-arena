import { all, call, put, take, spawn } from 'redux-saga/effects';
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

function* onLogin(user) {
  const profileChannel = yield call(createProfileListener, user.uid);
  yield spawn(updateProfile, profileChannel);
  yield put(createAction(LOGGED_IN.SUCCESS, { user }));
  yield put(push('/dashboard'));
  return profileChannel;
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
    const channel = yield call(onLogin, loginUser);
    return channel;
  } catch (error) {
    yield put(createAction(LOGGED_IN.ERROR, { error: error.message }));
    return null;
  }
}

function* signoutFlow(channel) {
  try {
    const action = yield take([LOGGED_IN.ERROR, SIGNED_OUT.PENDING]);
    if (action.type === SIGNED_OUT.PENDING) {
      yield call(signout);
      yield put(createAction(SIGNED_OUT.SUCCESS));
    }
    channel.close();
  } catch (error) {
    yield put(createAction(SIGNED_OUT.ERROR, { error: error.message }));
  }
}

function* sessionFlow() {
  const currentUser = yield call(getCurrentUser);
  if (currentUser) {
    const channel = yield call(onLogin, currentUser);
    yield call(signoutFlow, channel);
  } else {
    yield put(createAction(INITIALIZED));
  }
  while (true) {
    const channel = yield call(loginFlow);
    yield call(signoutFlow, channel);
  }
}

export default function*() {
  yield all([call(sessionFlow)]);
}
