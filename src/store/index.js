import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { reducer as toastrReducer } from 'react-redux-toastr';

import reducers from './reducers';

export const history = createBrowserHistory();
const middleware = [thunk, routerMiddleware(history)];

export default createStore(
  combineReducers({
    ...reducers,
    toastr: toastrReducer,
    router: connectRouter(history),
  }),
  composeWithDevTools(applyMiddleware(...middleware)),
);
