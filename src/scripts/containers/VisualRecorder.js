import React, { Component, PropTypes } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

import {toggleRecording, initAudio} from 'Util/audio/main'
import 'Styles/audioRecorder'

export default class VisualRecorder extends Component {
  componentDidMount() {
    initAudio()
  }
  render() {
    return(
      <div>
        <div id="viz">
          <canvas id="analyser" width="1024" height="500"></canvas>
          <canvas id="wavedisplay" width="1024" height="500"></canvas>
        </div>
        <div id="controls">
          <button id="record" onClick={toggleRecording}>Record</button>
          <a id="save" href="#">
            <button>Save</button>
          </a>
        </div>
      </div>
    )
  }
}
