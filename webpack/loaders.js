var NODE_ENV = process.env.NODE_ENV;

var path = require('path'),
    webpack = require('webpack');


var ExtractTextPlugin = require('extract-text-webpack-plugin');

var include = path.join(__dirname, '..', '/src'),
    exclude = /(node_modules)/;

var imageLoader = {
  test: /.jpe?g$|.gif$|.png$|.svg$/,
  loaders: [
    'file-loader?hash=sha512&digest=hex&name=[name].[hash].[ext]',
    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
  ]
}

var jsLoader = function (loader, lang) {
  var loaders = [loader];

  if(NODE_ENV === 'development') loaders = ['react-hot', loader];

  return {
    test: lang,
    loaders: loaders,
    include: include,
    exculde: exclude
  };
}

var fileLoader = function (loader, lang) {

  return {
    test: lang,
    loader: loader,
    include: include,
    exculde: exclude
  };
}

var styleLoader = function (loader, lang) {
  if(NODE_ENV === 'development'){
    loader = 'style-loader' + loader;
  }else if(NODE_ENV === 'production'){
    loader = ExtractTextPlugin.extract('style-loader', loader);
  }

  return {
    test: lang,
    loader: loader
  };
}

var babelLoader   = jsLoader('babel-loader', /\.js?$|\.jsx?$/);
var coffeeLoader  = jsLoader('coffee-jsx-loader', /\.coffee?$/);
var tsLoader      = jsLoader('ts-loader!ts-jsx-loader', /\.ts?$/);

var jadeLoader = fileLoader('pug', /\.jade?$/);

// var css = '!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:10]!postcss-loader';
var css = '!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]!postcss-loader';

var cssLoader  = styleLoader(css, /\.css?$/);
var stylLoader = styleLoader(css + '!stylus-loader', /\.styl?$/);
var scssLoader = styleLoader(css + '!sass-loader', /\.scss$|\.sass$/);
var lessLoader = styleLoader(css + '!less-loader', /\.less?$/);
var urlLoader = { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' };
var fontLoader = { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=fonts/[name].[ext]' };


var loaders = [
  jadeLoader,
  babelLoader,
  coffeeLoader,
  tsLoader,
  cssLoader,
  stylLoader,
  scssLoader,
  lessLoader,
  imageLoader,
  fontLoader
];

module.exports = loaders;
