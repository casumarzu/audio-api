import path from 'path'
const NODE_ENV = process.env.NODE_ENV
const port = 8080
let preEntry

if(NODE_ENV === 'development') {
  preEntry = [
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/only-dev-server',
    'babel-polyfill',
  ]
}else if(NODE_ENV === 'production') {
  preEntry = [
    'babel-polyfill'
  ]
}

var entry = {
  common: preEntry.concat([path.join(__dirname, '..', '/src/scripts', 'index.js')]),
  // alpha: preEntry.concat([path.join(__dirname, '..', '/src/scripts', 'alpha.js')]),
  // beta: preEntry.concat([path.join(__dirname, '..', '/src/scripts', 'beta.js')])
};


export default entry
