
// https://github.com/webpack-contrib/css-loader
// https://github.com/webpack/file-loader
// https://github.com/webpack/url-loader
// https://www.w3.org/TR/eventsource/
// svg-react-loader (turn SVGs into React Components)
//  allows for inline usage as a React component
//  aalows for composing individual SVGs into larger ones

const webpack = require('webpack');
const path = require('path');

const webpackIsomorphicToolsConfig = require('./webpack.config.tools');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const bootstrapEntryPoints = require('./webpack.bootstrap.config');

console.log('>>>>>> webpack.config.dev <<<<<<<<');
console.log('>>>> bootstrap-loader configuration: ', `${bootstrapEntryPoints.dev}`);

module.exports = {

  entry: {
    app: [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      'babel-polyfill',
      bootstrapEntryPoints.dev,
      path.join(__dirname, './client/index.js')
    ],
    vendor: [
      'axios',
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
      'redux-thunk',
    ]
  },

  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /.+\.config.js/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {'targets': { 'browsers': ['last 2 versions'] }}],
              'stage-0',
              'react'
            ]
          }
        }]

      },

      {
        test: /\.css$/,
        use:[
          {
            loader: 'style-loader',
          }, 
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }, 
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 2 versions', 'IE >= 9', 'safari >= 8'],
                }),
              ],
            },
          }
        ],
      },

      {
        test: /\.scss$/,
        use:[
          {
            loader: 'style-loader',
          }, 
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }, 
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 2 versions', 'IE >= 9', 'safari >= 8'],
                }),
              ],
            },
          }, 
          {
            loader: 'sass-loader',
          }
        ],
      },

      {
        test: /\.less$/,
        use:[
          { loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }, 
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 2 versions', 'IE >= 9', 'safari >= 8'],
                }),
              ],
            },
          }, 
          {
            loader: 'less-loader',
          }
        ],
      },

      {
        test: /\.(woff|woff2)?(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/font-woff' }
          }
        ]
      },

      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'application/octet-stream' }
          }
        ]
      },

      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'file-loader' }
        ]
      },

      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, mimetype: 'image/svg+xml' }
          }
        ]
      },

      {
        test: /\.(jpe?g|gif|png)$/i,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000 }
          }
        ]
      },

      {
        test: /\.json$/,
        use: [
          { loader: 'json-loader' }
        ]
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },

  devtool: 'inline-source-map',

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].[hash].js'
    }),

    // global constants configured at compile time
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
        PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true
    }),

    // Bootstrap 4 requires Tether:
    // new webpack.ProvidePlugin({
    //  'window.Tether': 'tether',
    //}),

    new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig).development(),

    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: 8888,
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false
    })
  ]
};

// reqiured for jquery:
//{
//  test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
//  use: [
//    {
//      loader: 'imports-loader?jQuery=jquery'
//    }
//  ]
//},
