import {drawBuffer} from 'Util/audio/paintDiagram'
import Recorder from 'Util/audio/Recorder'

window.AudioContext = window.AudioContext || window.webkitAudioContext

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

export default class Main {
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
      audioRecorder.stop()
      target.classList.remove('recording')
      recording = false
      audioRecorder.getBuffers(::this.gotBuffers)
    } else {
      // start recording
      if (!audioRecorder) return
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

    // analyzer draw code here

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

  initAudio(pushAudio) {
    this.pushAudio = pushAudio
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

}
