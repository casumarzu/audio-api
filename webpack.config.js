var NODE_ENV = process.env.NODE_ENV;
var path = require('path'),
    webpack = require('webpack');

var loaders = require('./webpack/loaders');
var postcss = require('./webpack/postCss');
var plugins = require('./webpack/plugins');
var entry = require('./webpack/entry');

var config = {
  entry: entry,
  vendors: [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'react-tap-event-plugin',
    'redux',
    'redux-devtools',
    'redux-devtools-log-monitor',
    'redux-devtools-dock-monitor',
    'lodash',
    'jquery',
    'babel-polyfill',
    'whatwg-fetch',
    'material-ui'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.css', '.scss', '.less', '.styl', '.json', '.eot'],
    alias: {
      Root: path.resolve( __dirname, 'src' ),
      Actions: path.resolve( __dirname, 'src', 'scripts', 'actions' ),
      Constants: path.resolve( __dirname, 'src', 'scripts', 'constants' ),
      Reducers: path.resolve( __dirname, 'src', 'scripts', 'reducers' ),
      Store: path.resolve( __dirname, 'src', 'scripts', 'store' ),

      Containers: path.resolve( __dirname, 'src', 'scripts', 'containers' ),
      Components: path.resolve( __dirname, 'src', 'scripts', 'components' ),

      Layout: path.resolve( __dirname, 'src', 'scripts', 'loyouts' ),
      Page: path.resolve( __dirname, 'src', 'scripts', 'pages' ),

      Util: path.resolve( __dirname, 'src', 'scripts', 'utils' ),
      Exp: path.resolve( __dirname, 'src', 'scripts', 'exp' ),
      Api: path.resolve( __dirname, 'src', 'scripts', 'api' ),

      Images: path.resolve( __dirname, 'src', 'images' ),
      Scripts: path.resolve( __dirname, 'src', 'scripts' ),
      Styles: path.resolve( __dirname, 'src', 'stylesheets' ),
      Tmpl: path.resolve( __dirname, 'src', 'templates' ),
      Data: path.resolve( __dirname, 'src', 'scripts', 'data' )

    }
  },
  plugins: plugins,
  module: {
    preLoaders: [
      {test: /\.js$/, loaders: ['eslint'], include: [ path.resolve(__dirname, './src')]}
    ],
    loaders: loaders
  },
  postcss: function () {
    return postcss;
  }
};

if(NODE_ENV === 'development') {
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
