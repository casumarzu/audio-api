const WORKER = require('worker!./worker')


const worker = new WORKER
let recording = false
let currCallback = null

export default class Recorder {
  constructor(source, cfg) {
    this.config = cfg || {}
    this.context = source.context
    this.createScriptNode(this.config.bufferLen || 4096)
    this.initListeners()
    this.connect(source)
  }

  createScriptNode(bufferLen) {
    if(!this.context.createScriptProcessor) {
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2)
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2)
    }
  }

  initListeners() {
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    })

    this.node.onaudioprocess = function(e){
      if (!recording) return
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      })
    }

    worker.onmessage = function(e){
      const blob = e.data
      currCallback(blob)
    }
  }

  connect(source) {
    source.connect(this.node)
    this.node.connect(this.context.destination)
  }


  configure(cfg) {
    for (let prop in cfg){
      if (cfg.hasOwnProperty(prop)){
        this.config[prop] = cfg[prop]
      }
    }
  }

  record() { recording = true }

  stop() { recording = false }

  clear() { worker.postMessage({ command: 'clear' }) }

  getBuffers(cb) {
    currCallback = cb || this.config.callback
    worker.postMessage({ command: 'getBuffers' })
  }

  exportWAV(cb, type) {
    currCallback = cb || this.config.callback
    type = type || this.config.type || 'audio/wav'
    if (!currCallback) throw new Error('Callback not set')

    worker.postMessage({
      command: 'exportWAV',
      type: type
    })
  }

  exportMonoWAV(cb, type) {
    currCallback = cb || this.config.callback
    type = type || this.config.type || 'audio/wav'
    if (!currCallback) throw new Error('Callback not set')
    worker.postMessage({
      command: 'exportMonoWAV',
      type: type
    })
  }
}
