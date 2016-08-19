import React, { Component, PropTypes } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import {cancelAnalyserUpdates} from 'Util/audio/main'
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


export default class SimpleRecorder extends Component {
  componentWillMount() {
    this.recorder()
    this.state = {
      audioList: []
    }
    cancelAnalyserUpdates()
  }

  visualize(event) {
    const stream = event
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
    const name = prompt('Введите название') // eslint-disable-line no-alert
    let blob = new Blob(this.chunks, { 'type' : 'audio/ogg' })
    this.chunks = []
    let audioURL = window.URL.createObjectURL(blob)
    const { audioList } = this.state
    audioList.push({src: audioURL, name, blob})
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
      let constraints = { audio: true }
      this.chunks = []
      navigator.getUserMedia(constraints, ::this.onSuccess, ::this.onError)
    } else {
       console.log('getUserMedia not supported on your browser!') // eslint-disable-line no-console
    }
  }

  download(blob, filename){
    const url = (window.URL || window.webkitURL).createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = filename || 'output.wav'
    const click = document.createEvent("Event")
    click.initEvent("click", true, true)
    link.dispatchEvent(click)
  }

  downloadHandle() {}

  render() {
    const mediaSupport = hasGetUserMedia()
    let mediaSupportNode = ''
    if(mediaSupport) mediaSupportNode = <p>Медиа поддерживается</p>
    return (
      <div>
        <h1>Audio Api!</h1>
        {mediaSupportNode}
        <button onClick={::this.record}>record</button>
        <button onClick={::this.stop}>stop</button>
        <div>
          {
            this.state.audioList.map(
              (audio, i) => {
                const {name, blob, src} = audio
                const downloadHandle = () => {
                  this.download(blob, name)
                }
                return (
                  <p key={i}>{name}: <audio
                    style={audioStyle}
                    preload
                    controls>
                      <source src={src}></source>
                    </audio>
                    <button onClick={downloadHandle}>Загрузить</button>
                  </p>
                )
              }

            )
          }
        </div>
      </div>
    )
  }
}
