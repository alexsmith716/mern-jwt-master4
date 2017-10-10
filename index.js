
// http://babeljs.io/docs/usage/babel-register/
// babel-register: a require hook. binds itself to node's require & automatically compiles files on the fly
// All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel
// https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/user-handbook.md

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
// equal to your Webpack configuration "context" parameter
const projectBasePath = require('path').resolve(__dirname, './');

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

if (process.env.NODE_ENV === 'production') {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./build/server/server.bundle');

  });

} else {

  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack.config.tools'))

  .server(projectBasePath, () => {

    require('./server/server');

  });

};
