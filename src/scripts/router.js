import App from './containers/App'
import Test from './containers/Test'
import React, { Component } from 'react'
import { Router, IndexRoute, Route } from 'react-router'

export default class Routes extends Component {
  render() {
    const { history } = this.props
    return (
      <Router history={ history }>
        <Route path="/" component={ App }>
          <IndexRoute component={ Test } />
          <Route path="/test" component={ Test } />
        </Route>
      </Router>
    )
  }
}
