import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import Firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';

import store, { history } from 'store';
import * as serviceWorker from 'serviceWorker';

import Protected from 'primitives/protected-hoc';
import Navigtion from 'components/navigation';
import Home from 'components/home';
import Decks from 'components/decks';
import GameBoard from 'components/game-board';

import 'styles/global.scss';

Firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Navigtion>
          <Route exact path="/" component={Home} />
          <Route exact path="/decks" component={Protected(Decks)} />
          <Route exact path="/game" component={Protected(GameBoard)} />
        </Navigtion>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
