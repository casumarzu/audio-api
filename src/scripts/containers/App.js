import React, { Component, PropTypes } from 'react'
import {Router, Route, Link, browserHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import DevTools from 'Containers/DevTools'
import {getMuiTheme, MuiThemeProvider} from 'material-ui/styles'
import {muiStyle} from 'Scripts/config'

// import {firebaseApp, firebaseAuth} from 'Api/Firebase'

import Header from 'Layout/Header'
import Footer from 'Layout/Footer'

const muiTheme = getMuiTheme(muiStyle)

export default class App extends Component {
  componentWillMount() {}

  render() {
    let DevToolsNode = ''
    if(process.env.NODE_ENV === 'development' && !window.devToolsExtension) {
      DevToolsNode = <DevTools />
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {/*<Header />*/}
          <content>
            {this.props.children}
          </content>
          <Footer />
          {DevToolsNode}
        </div>
      </MuiThemeProvider>
    )
  }
}
