
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

console.log('>>>>>> webpack.config.dev <<<<<<<<')

module.exports = {

  entry: {
    app: [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      'babel-polyfill',
      'bootstrap-loader',
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
            options: { sourceMap: true }
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
              config: './postcss.config.js',
              sourceMap: true,
            }
          }
        ],
      },

      {
        test: /\.scss$/,
        use:[
          {
            loader: 'style-loader',
            options: { sourceMap: true }
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
              config: './postcss.config.js',
              sourceMap: true,
            }
          }, 
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true
            }
          }
        ],
      },

      {
        test: /\.less$/,
        use:[
          { loader: 'style-loader',
            options: { sourceMap: true }
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
              config: './postcss.config.js',
              sourceMap: true,
            }
          }, 
          {
            loader: 'less-loader',
            query: {
              outputStyle: 'expanded',
              sourceMap: true
            }
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

      {
        test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        use: [
          {
            loader: 'imports-loader?jQuery=jquery'
          }
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
      }
    }),

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
