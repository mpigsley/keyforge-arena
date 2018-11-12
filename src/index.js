import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase/app';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

Firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
});

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
