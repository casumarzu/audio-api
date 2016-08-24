import path from 'path'
import webpack, { optimize } from 'webpack'
const { CommonsChunkPlugin } = optimize
import HtmlPlugin from 'html-webpack-plugin'
import NpmInstallPlugin from 'npm-install-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import colors from 'colors'

const NODE_ENV = process.env.NODE_ENV
let plugins

const title = 'Audio Api'

if(NODE_ENV === 'development') {
  plugins = [
    new HtmlPlugin({
      filename: 'index.html',
      title: `Dev ${title}`,
      favicon: path.join(__dirname, '..', '/src', 'favicon.ico'),
      template: path.join(__dirname, '..', '/src', '/templates/index.html'),
      chunks: ['common', 'vendors']
    }),
    // new NpmInstallPlugin(),
    new ExtractTextPlugin(),
    new CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(function(percentage, msg) {
      percentage = (percentage * 100) + '%'
      console.log(percentage.cyan, msg.green)
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.NoErrorsPlugin()
  ];
}else if(NODE_ENV === 'production'){
  plugins = [
    new HtmlPlugin({
      filename: 'index.html',
      title,
      favicon: path.join(__dirname, '..', '/src', 'favicon.ico'),
      template: path.join(__dirname, '..', '/src', '/templates/index.html'),
      chunks: ['common', 'vendors'],
    }),
    new CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
    new ExtractTextPlugin('bundle.[hash].css', { allChunks: true }),
    new webpack.ProgressPlugin(function(percentage, msg) {
      percentage = (percentage * 100) + '%'
      console.log(percentage.cyan, msg.green)
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    // new NpmInstallPlugin()
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  ];
}

module.exports = plugins;
