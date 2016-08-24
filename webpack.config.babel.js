import path from 'path'
import webpack from 'webpack'

import loaders from './webpack/loaders'
import postcss from './webpack/postCss'
import plugins from './webpack/plugins'
import entry from './webpack/entry'
import alias from './webpack/alias'

const NODE_ENV = process.env.NODE_ENV

let config = {
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
    alias
  },
  plugins,
  module: {
    preLoaders: [
      {test: /\.js$/, loaders: ['eslint'], include: [ path.resolve(__dirname, './src')]}
    ],
    loaders: loaders
  },
  postcss() { return postcss }
};

if(NODE_ENV === 'development') {
  config.devtool = 'cheap-module-eval-source-map';
}

export default config
