
import dotenv from 'dotenv/config';
//import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import webpack from 'webpack';
import webpackConfigDev from '../webpack.config.dev.js';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

//dotenv.config();

const app = express();

// https://github.com/webpack/webpack-dev-middleware
// https://github.com/glenjamin/webpack-hot-middleware

if (process.env.NODE_ENV === 'development') {

  const compiler = webpack(webpackConfigDev);

  // serve files emitted from webpack over a connect server
  // noInfo: warnings and errors to console
  // publicPath: path to bind the middleware to (same as used in webpack)
  app.use(webpackDevMiddleware(compiler, {
      noInfo: false, 
      publicPath: webpackConfigDev.output.publicPath 
    },
  ));

  app.use(webpackHotMiddleware(compiler));

  console.log('>>>> server 1 > ', process.env.NODE_ENV, ' > HOT !!! <<<<')

}

console.log('>>>> server 2 > ', process.env.NODE_ENV);

import router from './router';
import apiRoutes from './api_routes';
import serverConfig from './config/config';

if (process.env.NODE_ENV === 'development') {
  //
}

app.use(compression());
// app.use(express.static(path.join(__dirname, '../public')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public/favicon', 'favicon.ico')));

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(helmet())
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use((req, res, next) => {
  console.log('>>>>>>>>>>> GOING THROUGH APP NOW <<<<<<<<<<<<<');
  res.locals.publicViews = path.join(__dirname, 'public')
  console.log('REQ.method +++++: ', req.method);
  console.log('REQ.url ++++++++: ', req.url);
  console.log('REQ.headers ++++: ', req.headers)
  next();
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use('/api', apiRoutes);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// http://mongoosejs.com/docs/connections.html
// http://mongodb.github.io/node-mongodb-native/2.1/api/Server.html
mongoose.Promise = global.Promise;
const mongooseOptions = { useMongoClient: true, autoReconnect: true, keepAlive: 2, connectTimeoutMS: 400000 };
mongoose.connect(process.env.MONGO_URL, mongooseOptions, error => {
  if (error) {
    console.error('>>>>>> mongoose.connect error <<<<<<<: ', error);
    let err = new Error('>>>>>> mongoose.connect error <<<<<<<: ', error);
    throw error;
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// router(app);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(function (req, res, next) {
  console.log('>>>> APP UNCAUGHT ERR HANDLER 404 <<<<');
  let err = new Error('Not Found, req.originalUrl: '+req.originalUrl);
  err.status = 404;
  next(err);
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

if (app.get('env') === 'development') {

  app.use(function (err, req, res, next) {

    console.log('>>>> APP UNCAUGHT ERR HANDLER DEVELOPMENT <<<<');

    res.status(err.status || 500);

    console.log('>>>> DEV ERR: ', err);
    console.log('>>>> DEV ERR.code: ', err.code);
    console.log('>>>> DEV ERR.status: ', err.status);
    console.log('>>>> DEV ERR.name: ', err.name);
    console.log('>>>> DEV ERR.message: ', err.message);
    console.log('>>>> DEV ERR.referer: ', err.referer);
    console.log('>>>> DEV REQ.originalUrl: ',  req.originalUrl);
    console.log('>>>> DEV REQ.HEADERS.referer: ', req.headers['referer']);
    console.log('>>>> DEV REQ.xhr: ', req.xhr);

    if (req.xhr) {
      console.log('>>>> APP UNCAUGHT ERR HANDLER DEVELOPMENT > YES XHR <<<<');
      res.json({'response': 'error', 'type': 'error', 'err': err});

    } else {
      console.log('>>>> APP UNCAUGHT ERR HANDLER DEVELOPMENT > NO XHR <<<<');
      res.send('>>>> APP UNCAUGHT ERR HANDLER DEVELOPMENT > NO XHR <<<<: ', err);
    }
  });
};

app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Express server running on port ${process.env.PORT}`);
  }
});

export default app;
