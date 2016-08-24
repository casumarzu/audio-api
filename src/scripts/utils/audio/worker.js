import RecorderWorker from './RecorderWorker'

const bindPostMessage = postMessage.bind(this)
let recorder = null

onmessage = function(e,w,q) {
  switch(e.data.command){
    case 'init':
      recorder = new RecorderWorker(e.data.config, bindPostMessage)
      break
    case 'record':
      recorder.record(e.data.buffer)
      break
    case 'exportWAV':
      recorder.exportWAV(e.data.type)
      break
    case 'exportMonoWAV':
      recorder.exportMonoWAV(e.data.type)
      break
    case 'getBuffers':
      recorder.getBuffers()
      break
    case 'clear':
      recorder.clear()
      break
    default:
      break
  }
}
