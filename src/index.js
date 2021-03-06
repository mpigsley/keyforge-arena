import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import Firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import createStore, { history } from 'store';

import Protected from 'primitives/protected-hoc';
import Wrapper from 'primitives/wrapper';
import Home from 'components/home';
import Dashboard from 'components/dashboard';
import Decks from 'components/decks';
import Profile from 'components/profile';
import GameBoard from 'components/game-board';
import Lobby from 'components/lobby';

import 'react-redux-toastr/src/styles/index.scss';
import 'react-hint/css/index.css';
import 'styles/global.scss';

Firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
});

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Wrapper>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Protected(Dashboard)} />
          <Route exact path="/profile" component={Protected(Profile)} />
          <Route exact path="/lobby" component={Protected(Lobby)} />
          <Route path="/deck/:id?" component={Protected(Decks)} />
          <Route path="/game/:id" component={Protected(GameBoard)} />
        </Switch>
      </Wrapper>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
