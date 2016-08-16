import React, { Component, PropTypes } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import * as mui from 'material-ui'

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.webkitGetUserMedia
)

const audioStyle = {
  display: 'inline-block',
  verticalAlign: 'middle'
}

const hasGetUserMedia = () => !!(navigator.getUserMedia)

const videoStyle = {
  width: '300px',
  height: '300px',
  border: '3px solid red'
}

export default class App extends Component {
  componentWillMount() {
    this.recorder()
    this.state = {
      audioList: []
    }
  }

  visualize(event) {
    const stream = event
    console.log(stream) // eslint-disable-line no-console
  }

  record() {
    this.mediaRecorder.start()
    console.log(this.mediaRecorder.state) // eslint-disable-line no-console
    console.log("recorder started") // eslint-disable-line no-console
  }

  stop() {
    this.mediaRecorder.stop()
    console.log(this.mediaRecorder.state) // eslint-disable-line no-console
    console.log("recorder stopped") // eslint-disable-line no-console
    // mediaRecorder.requestData();
  }

  onSuccess(stream) {
    this.mediaRecorder = new MediaRecorder(stream)
    this.visualize(stream)
    this.mediaRecorder.onstop = ::this.stopHandle
    this.mediaRecorder.ondataavailable = ::this.dataAvailableHandle
  }

  onError(err) {
    console.log('The following error occured: ' + err) // eslint-disable-line no-console
  }

  stopHandle(e) {
    const clipName = prompt('Enter a name for your sound clip')
    let blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' })
    this.chunks = []
    let audioURL = window.URL.createObjectURL(blob)
    const { audioList } = this.state
    audioList.push({src: audioURL, clipName})
    this.setState({audioList})


    // const a = document.createElement("a")
    // a.href = audioURL
    // a.download = clipName
    // a.click()
    // window.URL.revokeObjectURL(audioURL)

  }

  dataAvailableHandle(e) {
    // console.log('Add part of data!', e.data) // eslint-disable-line no-console
    this.chunks.push(e.data)
  }

  recorder() {
    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.') // eslint-disable-line no-console
      let constraints = { audio: true }
      this.chunks = []
      navigator.getUserMedia(constraints, ::this.onSuccess, ::this.onError)
    } else {
       console.log('getUserMedia not supported on your browser!') // eslint-disable-line no-console
    }
  }

  render() {
    const mediaSupport = hasGetUserMedia()
    let mediaSupportNode = ''
    if(mediaSupport) mediaSupportNode = <p>Медиа поддерживается</p>
    const shit = true
    return (
      <div>
        <h1>Audio Api!</h1>
        {mediaSupportNode}
        <button onClick={::this.record}>record</button>
        <button onClick={::this.stop}>stop</button>
        <div>
          {
            this.state.audioList.map(
              audio =>
                <p>{audio.clipName}: <audio autoplay="true" style={audioStyle} preload controls src={audio.src}></audio></p>
            )
          }
        </div>
      </div>
    )
  }
}
