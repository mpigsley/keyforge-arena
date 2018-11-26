import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import reducers from './reducers';
import initSagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();

export default () => {
  const store = createStore(
    combineReducers({
      ...reducers,
      toastr: toastrReducer,
      router: connectRouter(history),
    }),
    composeWithDevTools(
      applyMiddleware(thunk, sagaMiddleware, routerMiddleware(history)),
    ),
  );
  initSagas(sagaMiddleware);
  return store;
};
