
import React from 'react';
import ReactDOM from 'react-dom/server';
import helmet from 'react-helmet';
import { render } from 'react-dom';
import express from 'express';
// import { Router } from 'express';
// const router = new Router();
const app = express();

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { StaticRouter as Router, matchPath } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';

import reducers from '../client/reducers';
import sharedRoutes from '../client/routes';
import Header from '../client/Header';

module.exports = function(app) {

  console.log('>>> router.js > in app <<<');

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  app.use((req, res, next) => {

    console.log('>>> server.js <<< app.use(req, res, next) > req.url: ', req.url);
    console.log('>>> server.js <<< app.use(req, res, next) > req.method: ', req.method);

    const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
    const store = createStoreWithMiddleware(reducers);

    if (process.env.NODE_ENV === 'development') {
      global.webpackIsomorphicTools.refresh();
    }

    let foundPath = null;
    let { path, component } = routes.routes.find(
      ({ path, exact }) => {
        foundPath = matchPath(req.url,
          {
            path,
            exact,
            strict: false
          }
        )
        return foundPath;
    }) || {};

    // checking out above let foundPath
    console.log('>>> server.js <<< app.use(req, res, next) > foundPath: ', foundPath);

    const branch = matchRoutes(routes, req.url);

    // do async request for new initialState provide to server render
    const promises = branch.map(({route}) => {

      let fetchData = route.component.fetchData;
      return fetchData instanceof Function ? fetchData(store) : Promise.resolve(null)

    });

    Promise.all(promises).then(() => {

      let preloadedState = store.getState();
      let context = {};

      const html = renderToString(

        <Provider store={store}>

          <Router context={context} location={req.url}>

            {renderRoutes(routes)}

          </Router>

        </Provider>

      )

      const helmetData = helmet.renderStatic();

      console.log('>>> server.js <<< app.use(req, res, next) > Promise.all > context.status: ', context.status);
      console.log('>>> server.js <<< app.use(req, res, next) > Promise.all > context.url: ', context.url);
      console.log('>>> server.js <<< app.use(req, res, next) > Promise.all > html: ', html);
      console.log('>>> server.js <<< app.use(req, res, next) > Promise.all > preloadedState: ', preloadedState);
      //res.status(200).send(renderFullPage(html, preloadedState, helmetData));

    }).catch((err) => {

      console.log('>>> server.js <<< app.use(req, res, next) > Promise.all > err: ', err);
      next(err);

    });

  });

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  function renderFullPage(html, preloadedState, helmet) {

    return `
    <!doctype html>
    <html>
      <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon/favicon.ico" type="image/ico" />

        <!-- <link href="data:image/x-icon;" type="image/x-icon" rel="shortcut icon"> -->
        <!-- <intercept-url pattern="/favicon.ico" access="ROLE_ANONYMOUS"></intercept-url> -->

        <link rel="stylesheet" href="/style/style.css">
        <link rel="stylesheet" href="/vendor/bootstrap.3.3.7/css/bootstrap.min.css">

        <title>MERN-JWT!!!!!</title>

      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/public/vendor.js"></script>
        <script src="/public/app.js"></script>
      </body>
    </html>
    `
  };
};
