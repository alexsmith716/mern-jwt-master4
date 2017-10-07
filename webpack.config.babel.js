
// https://github.com/istarkov/babel-plugin-webpack-loaders
// https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/webpack.config.js
// https://webpack.js.org/loaders
// https://github.com/webpack-contrib/css-loader
// https://javascriptplayground.com/blog/2016/07/css-modules-webpack-react/

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