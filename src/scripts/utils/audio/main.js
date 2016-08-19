import {drawBuffer} from 'Util/audio/audiodisplay'
import Recorder from 'Util/audio/recorder'

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

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function saveAudio() {
  audioRecorder.exportWAV( doneEncoding )
  // could get mono instead by saying
  // audioRecorder.exportMonoWAV( doneEncoding )
}

function gotBuffers( buffers ) {
  let canvas = document.getElementById( "wavedisplay" )

  drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] )

  // the ONLY time gotBuffers is called is right after a new recording is completed -
  // so here's where we should set up the download.
  audioRecorder.exportWAV( doneEncoding )
}

function doneEncoding( blob ) {
  Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" )
  recIndex++
}

let recording = false

export function toggleRecording( e ) {
  const {target} = e
  if (recording) {
    // stop recording
    audioRecorder.stop()
    target.classList.remove("recording")
    recording = false
    audioRecorder.getBuffers( gotBuffers )
  } else {
    // start recording
    if (!audioRecorder) return
    target.classList.add("recording")
    recording = true
    audioRecorder.clear()
    audioRecorder.record()
  }
}

function convertToMono( input ) {
  let splitter = audioContext.createChannelSplitter(2)
  let merger = audioContext.createChannelMerger(2)

  input.connect( splitter )
  splitter.connect( merger, 0, 0 )
  splitter.connect( merger, 0, 1 )
  return merger
}

export function cancelAnalyserUpdates() {
  window.cancelAnimationFrame( rafID )
  rafID = null
}

function updateAnalysers(time) {
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

  let SPACING = 20
  let BAR_WIDTH = 10
  let numBars = Math.round(canvasWidth / SPACING)
  let freqByteData = new Uint8Array(analyserNode.frequencyBinCount)

  analyserNode.getByteFrequencyData(freqByteData)

  analyserContext.clearRect(0, 0, canvasWidth, canvasHeight)
  analyserContext.fillStyle = '#F6D565'
  analyserContext.lineCap = 'round'
  let multiplier = analyserNode.frequencyBinCount / numBars

  // Draw rectangle for each frequency bin.
  for (let i = 0; i < numBars; ++i) {
    let magnitude = 0
    let offset = Math.floor( i * multiplier )
    // gotta sum/average the block, or we miss narrow-bandwidth spikes
    for (let j = 0; j< multiplier; j++) {
      magnitude += freqByteData[offset + j]
    }
    magnitude = magnitude / multiplier
    let magnitude2 = freqByteData[i * multiplier]
    analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)"
    analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude)
  }


  rafID = window.requestAnimationFrame( updateAnalysers )
}

function toggleMono() {
  if (audioInput !== realAudioInput) {
    audioInput.disconnect()
    realAudioInput.disconnect()
    audioInput = realAudioInput
  } else {
    realAudioInput.disconnect()
    audioInput = convertToMono( realAudioInput )
  }

  audioInput.connect(inputPoint)
}

function gotStream(stream) {
  inputPoint = audioContext.createGain()

  // Create an AudioNode from the stream.
  realAudioInput = audioContext.createMediaStreamSource(stream)
  audioInput = realAudioInput
  audioInput.connect(inputPoint)

  //    audioInput = convertToMono( input )

  analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  inputPoint.connect( analyserNode )

  audioRecorder = new Recorder( inputPoint )

  let zeroGain = audioContext.createGain()
  zeroGain.gain.value = 0.0
  inputPoint.connect( zeroGain )
  zeroGain.connect( audioContext.destination )
  updateAnalysers()
}

export function initAudio() {
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
    }, gotStream, function(e) {
      alert('Error getting audio') // eslint-disable-line no-alert
    })
  }
