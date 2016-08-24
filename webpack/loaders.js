
import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const NODE_ENV = process.env.NODE_ENV
const include = path.join(__dirname, '..', '/src')
const exclude = /(node_modules)/

const imageLoader = {
  test: /.jpe?g$|.gif$|.png$|.svg$/,
  loaders: [
    'file-loader?hash=sha512&digest=hex&name=[name].[hash].[ext]',
    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
  ]
}

const jsLoader = (loader, lang) => {
  var loaders = [loader];

  if(NODE_ENV === 'development') loaders = ['react-hot', loader]

  return {
    test: lang, loaders, include, exclude
  }
}

const fileLoader = (loader, lang) => {
  return {
    test: lang, loader, include, exclude
  }
}

const styleLoader = (loader, lang) => {
  if(NODE_ENV === 'development'){
    loader = 'style-loader' + loader;
  }else if(NODE_ENV === 'production'){
    loader = ExtractTextPlugin.extract('style-loader', loader);
  }

  return {
    test: lang, loader
  }
}

const babelLoader   = jsLoader('babel-loader', /\.js?$|\.jsx?$/)
const coffeeLoader  = jsLoader('coffee-jsx-loader', /\.coffee?$/)
const tsLoader      = jsLoader('ts-loader!ts-jsx-loader', /\.ts?$/)

const jadeLoader = fileLoader('pug', /\.jade?$/)

// var css = '!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:10]!postcss-loader';
const css = '!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]!postcss-loader'

const cssLoader  = styleLoader(css, /\.css?$/);
const stylLoader = styleLoader(css + '!stylus-loader', /\.styl?$/)
const scssLoader = styleLoader(css + '!sass-loader', /\.scss$|\.sass$/)
const lessLoader = styleLoader(css + '!less-loader', /\.less?$/)
const urlLoader = { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
const fontLoader = { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=fonts/[name].[ext]' }


const loaders = [
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

export default loaders
