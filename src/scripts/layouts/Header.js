import React, { Component, PropTypes } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

export default class HeaderLayout extends Component {
  render() {
    return (
      <header>
        <Link to="/visual">Визуальный</Link>
        <Link to="/simple">Простой</Link>
      </header>
    )
  }
}
