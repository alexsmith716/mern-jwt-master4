
// https://nodejs.org/dist/latest-v8.x/docs/api/globals.html
// https://nodejs.org/dist/latest-v8.x/docs/api/modules.html

// global objects are available in all modules
// In browsers, the top-level scope is the global scope. 
// This means that within the browser var something will define a new global variable. 
// In Node.js this is different. The top-level scope is not the global scope; 
// var something inside a Node.js module will be local to that module.

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
// equal to your Webpack configuration "context" parameter
const projectBasePath = require('path').resolve(__dirname, './');

// babel-register: a require hook. binds itself to node's require & automatically compiles files on the fly
require('babel-register')({
  plugins: [
    [
      'babel-plugin-webpack-loaders', {
        config: './webpack.config.babel.js',
        verbose: true
      }
    ],
  ]
});

require('babel-polyfill');

// "global.webpackIsomorphicTools" used later in app middleware

if (process.env.NODE_ENV === 'production') {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./dist/server.bundle');

  });

} else {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./server/server');

  });

};



