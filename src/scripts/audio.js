import 'babel-polyfill'
import 'whatwg-fetch'
require('react-tap-event-plugin')()
import React, { Component } from 'react'
import { render } from 'react-dom'

import 'Util/audio/recorder'
import {toggleRecording} from 'Util/audio/main'
import 'Styles/audioRecorder'

import micImg from 'Images/mic128.png'
import saveImg from 'Images/save.svg'

let recording = false

render(
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
  , document.getElementById('root')
)
