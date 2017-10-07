
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';;
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import routes from './routes';
//import history from './history';
import App from './App';
import { AUTH_USER } from './authentication.types';
import reducers from './reducers';
const mountApp = document.getElementById('root');

const token = localStorage.getItem('token');

const enhancers = [
  applyMiddleware(thunk),
];

const store = createStore(reducers, window.__INITIAL_STATE__, enhancers);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const newReducer = require('./reducers').default;
    store.replaceReducer(newReducer);
  });
}

// <Router history={history}>

if (token) {
  store.dispatch({ type: AUTH_USER });
}

console.log('>>>> client > INDEX.js <<<< module.hot', module.hot);
console.log('>>>> client > INDEX.js <<<< store', store);
console.log('>>>> client > INDEX.js <<<< token', token);
console.log('>>>> client > INDEX.js <<<< Router', Router);
console.log('>>>> client > INDEX.js <<<< mountApp', mountApp);