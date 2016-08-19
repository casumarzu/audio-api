import App from './containers/App'
import SimpleRecorder from './containers/SimpleRecorder'
import VisualRecorder from './containers/VisualRecorder'
import React, { Component } from 'react'
import { Router, IndexRoute, Route } from 'react-router'

export default class Routes extends Component {
  render() {
    const { history } = this.props
    return (
      <Router history={ history }>
        <Route path="/" component={ App }>
          <IndexRoute component={ VisualRecorder } />
          <Route path="/visual" component={ VisualRecorder } />
          <Route path="/simple" component={ SimpleRecorder } />
        </Route>
      </Router>
    )
  }
}
