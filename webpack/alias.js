import path from 'path'

const alias = {
  Root: path.resolve( __dirname, '..', 'src' ),
  Actions: path.resolve( __dirname, '..', 'src', 'scripts', 'actions' ),
  Constants: path.resolve( __dirname, '..', 'src', 'scripts', 'constants' ),
  Reducers: path.resolve( __dirname, '..', 'src', 'scripts', 'reducers' ),
  Store: path.resolve( __dirname, '..', 'src', 'scripts', 'store' ),

  Containers: path.resolve( __dirname, '..', 'src', 'scripts', 'containers' ),
  Components: path.resolve( __dirname, '..', 'src', 'scripts', 'components' ),

  Layout: path.resolve( __dirname, '..', 'src', 'scripts', 'layouts' ),
  Page: path.resolve( __dirname, '..', 'src', 'scripts', 'pages' ),

  Util: path.resolve( __dirname, '..', 'src', 'scripts', 'utils' ),
  Exp: path.resolve( __dirname, '..', 'src', 'scripts', 'exp' ),
  Api: path.resolve( __dirname, '..', 'src', 'scripts', 'api' ),

  Images: path.resolve( __dirname, '..', 'src', 'images' ),
  Scripts: path.resolve( __dirname, '..', 'src', 'scripts' ),
  Styles: path.resolve( __dirname, '..', 'src', 'stylesheets' ),
  Tmpl: path.resolve( __dirname, '..', 'src', 'templates' ),
  Data: path.resolve( __dirname, '..', 'src', 'scripts', 'data' )
}

export default alias
