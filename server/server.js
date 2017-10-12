
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

console.log('>>>> server.dev > webpackConfigDev <<<<: ', webpackConfigDev);

/*
{ entry: 
   { app: 
      [ 'webpack-hot-middleware/client',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        'babel-polyfill',
        'bootstrap-loader',
        '/Users/robertsnith/Documents/PDFs5/mern-jwt-master4/client/index.js' ],
     vendor: 
      [ 'axios',
        'react',
        'react-bootstrap',
        'react-dom',
        'react-helmet',
        'react-hot-loader',
        'react-redux',
        'react-router',
        'react-router-bootstrap',
        'react-router-config',
        'react-router-dom',
        'redux',
        'redux-form',
        'redux-thunk' ] },
  output: 
   { path: '/Users/robertsnith/Documents/PDFs5/mern-jwt-master4/dist',
     filename: '[name].[chunkhash].js',
     chunkFilename: '[name].[chunkhash].js',
     publicPath: '/' },
  module: 
   { rules: 
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ] },
  resolve: { extensions: [ '.js', '.jsx', '.css' ] },
  devtool: 'inline-source-map',
  plugins: 
   [ HotModuleReplacementPlugin {
       options: {},
       multiStep: undefined,
       fullBuildTimeout: 200,
       requestTimeout: 10000 },
     CommonsChunkPlugin {
       chunkNames: [Array],
       filenameTemplate: '[name].[hash].js',
       minChunks: Infinity,
       selectedChunks: undefined,
       children: undefined,
       async: undefined,
       minSize: undefined,
       ident: '/Users/robertsnith/Documents/PDFs5/mern-jwt-master4/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js0' },
     DefinePlugin { definitions: [Object] },
     ProvidePlugin { definitions: [Object] },
     Webpack_isomorphic_tools_plugin {
       options: [Object],
       log: [Object],
       regular_expressions: [Object] },
     BundleAnalyzerPlugin { opts: [Object], server: null, logger: [Object] } ] 
}
*/

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
      res.status('>>>> APP UNCAUGHT ERR HANDLER DEVELOPMENT > NO XHR <<<<: ').send(err);
    }
  });
};

app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Express server running on port ${process.env.PORT}`);
  }
});

export default app;
