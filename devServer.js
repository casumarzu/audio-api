import webpack from 'webpack'
import config from './webpack.config.babel'
import WebpackDevServer from 'webpack-dev-server'
const port = 8080

function proxyConfig(url) {
  return {
    target: {
      host: 'run.skbx.ru',
      protocol: 'http:',
      path: '/'+ url +'/',
      secure: false,
      port: 80
    },
    rewrite: function(req) {
      var rx = new RegExp('^\/' + url);
      req.url = req.url.replace(rx, '');
    },
    changeOrigin: true,
    secure: false
  }
}

const server = new WebpackDevServer(webpack(config), {
  contentBase: './src',
  hot: true,
  quiet: false,
  historyApiFallback: true,
  proxy: {
    '/api/*': proxyConfig('api'),
    '/uploads/*': proxyConfig('uploads')
  },
  stats: {
    colors: true,
    progress: true
  }
});

server.listen(port, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + port);
});
