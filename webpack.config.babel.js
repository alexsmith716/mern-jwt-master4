
// All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel
// https://webpack.github.io/docs/commonjs.html
// https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/user-handbook.md

let cssModulesIdentName = '[name]__[local]__[hash:base64:5]';
// defines structure of what generated CSS class should be, maps to generated output
if (process.env.NODE_ENV === 'production') {
  cssModulesIdentName = '[hash:base64]';
}

module.exports = {

  output: {
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['client', 'node_modules']
  },

  module: {
    rules: [

      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?localIdentName=' + cssModulesIdentName + '&modules&importLoaders=1&sourceMap!postcss-loader',
      },

      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/i,
        loader: 'url-loader?limit=10000'
      }

    ]
  }
};