import React, { Component, PropTypes } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import {drawBuffer} from 'Util/audio/paintDiagram'
import Recorder from 'Util/audio/Recorder'
import 'Styles/audioRecorder'

window.AudioContext = window.AudioContext || window.webkitAudioContext

const audioStyle = {
  display: 'inline-block',
  verticalAlign: 'middle'
}

let audioContext = new AudioContext()
let audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null
let rafID = null
let analyserContext = null
let canvasWidth, canvasHeight
let recIndex = 0
let analyserNode = null

let recording = false

export default class VisualRecorder extends Component {
  componentWillMount() { this.state = { audioList: [], timer: 0 } }

  componentDidMount() { this.initAudio() }

  setupDownload(blob, filename) {
    let src = (window.URL || window.webkitURL).createObjectURL(blob)
    const name = filename || 'output.wav'
    this.pushAudio({src, name, blob, buffers: this.buffers})
  }

  saveAudio() {
    audioRecorder.exportWAV(::this.doneEncoding)
  }

  gotBuffers(buffers) {
    this.buffers = buffers
    // const canvas = document.getElementById('wavedisplay')
    // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] )
    audioRecorder.exportWAV(::this.doneEncoding)
  }

  doneEncoding(blob) {
    this.setupDownload( blob, "Record__" + ((recIndex<10)?"0":"") + recIndex + ".wav" )
    recIndex++
  }

  toggleRecording(e) {
    const {target} = e
    if (recording) {
      // stop recording
      this.stopTimer()
      audioRecorder.stop()
      target.classList.remove('recording')
      recording = false
      audioRecorder.getBuffers(::this.gotBuffers)
    } else {
      // start recording
      if (!audioRecorder) return
      this.startTimer()
      target.classList.add('recording')
      recording = true
      audioRecorder.clear()
      audioRecorder.record()
    }
  }

  convertToMono(input) {
    let splitter = audioContext.createChannelSplitter(2)
    let merger = audioContext.createChannelMerger(2)

    input.connect( splitter )
    splitter.connect( merger, 0, 0 )
    splitter.connect( merger, 0, 1 )
    return merger
  }

  cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID )
    rafID = null
  }

  updateAnalysers(time) {
    // if (!analyserContext) {
    //   let canvas = document.getElementById("analyser")
    //   canvasWidth = canvas.width
    //   canvasHeight = canvas.height
    //   analyserContext = canvas.getContext('2d')
    // }
    let canvas = document.getElementById("analyser")
    canvasWidth = canvas.width
    canvasHeight = canvas.height
    analyserContext = canvas.getContext('2d')

    const SPACING = 50
    const BAR_WIDTH = 30
    let numBars = Math.round(canvasWidth / SPACING)
    let freqByteData = new Uint8Array(analyserNode.frequencyBinCount)

    analyserNode.getByteFrequencyData(freqByteData)

    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight)
    analyserContext.fillStyle = '#F6D565'
    analyserContext.lineCap = 'round'
    let multiplier = analyserNode.frequencyBinCount / numBars

    for (let i = 0; i < numBars; ++i) {
      let magnitude = 0
      let offset = Math.floor( i * multiplier )
      for (let j = 0; j< multiplier; j++) {
        magnitude += freqByteData[offset + j]
      }
      magnitude = magnitude / multiplier
      let magnitude2 = freqByteData[i * multiplier]
      analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)"
      analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude)
    }


    rafID = window.requestAnimationFrame(::this.updateAnalysers)
  }

  toggleMono() {
    if (audioInput !== realAudioInput) {
      audioInput.disconnect()
      realAudioInput.disconnect()
      audioInput = realAudioInput
    } else {
      realAudioInput.disconnect()
      audioInput = this.convertToMono(realAudioInput)
    }

    audioInput.connect(inputPoint)
  }

  gotStream(stream) {
    inputPoint = audioContext.createGain()

    realAudioInput = audioContext.createMediaStreamSource(stream)
    audioInput = realAudioInput
    audioInput.connect(inputPoint)

    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = 2048
    inputPoint.connect( analyserNode )

    audioRecorder = new Recorder(inputPoint)

    let zeroGain = audioContext.createGain()
    zeroGain.gain.value = 0.0
    inputPoint.connect( zeroGain )
    zeroGain.connect( audioContext.destination )
    this.updateAnalysers()
  }

  initAudio() {
    if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame
    if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame

    navigator.getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      }, ::this.gotStream, function(e) {
        alert('Error getting audio') // eslint-disable-line no-alert
      })
  }

  pushAudio(audio) {
    const { audioList } = this.state
    audioList.push(audio)
    this.setState({audioList})
  }

  startTimer() {
    let {timer} = this.state
    this.timer = setTimeout( () => {
      this.setState({timer: ++timer})
      this.startTimer()
    }, 1000)
  }

  stopTimer() {
    clearTimeout(this.timer)
    this.setState({timer: 0})
  }

  render() {
    const {audioList, timer} = this.state
    const timerNode = (timer > 0) ? (<span>Timer: {timer}</span>) : null
    return (
      <div>
        <div id="viz">
          <canvas id="analyser" width="1024" height="500"></canvas>
        </div>
        <div className="controls">
          <button
            id="record"
            className="controls__button"
            onClick={::this.toggleRecording}>Record</button>
          {timerNode}
        </div>
        <div className="player">
          {
            audioList.map( (audioTrack, i) => {
              const {name, blob, src, buffers} = audioTrack
              const id = `diagram_${i}`
              setTimeout( () => {
                const canvas = document.getElementById(id)
                drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] )
              }, 100)
              return (
                <div className="audioItem" key={i}>
                  <p>Название: {name}</p>
                  <div>
                    <audio style={audioStyle} src={src} controls></audio>
                    <canvas width="1024" height="500" id={id}></canvas>
                  </div>
                  <div className="controls">
                    <a className="controls__button" download={name} href={src}>Загрузить</a>
                    <button className="controls__button">Отправить на сервер</button>
                  </div>
                </div>
              )
            } )
          }
        </div>
      </div>
    )
  }
}
