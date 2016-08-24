export default class RecorderWorker {
  constructor(config, postMessage) {
    this.recLength = 0
    this.recBuffersL = []
    this.recBuffersR = []
    this.sampleRate = null
    this.postMessage = postMessage
    this.sampleRate = config.sampleRate
  }

  init(config) {
    this.sampleRate = config.sampleRate
  }

  record(inputBuffer) {
    this.recBuffersL.push(inputBuffer[0])
    this.recBuffersR.push(inputBuffer[1])
    this.recLength += inputBuffer[0].length
  }

  exportWAV(type) {
    const bufferL = this.mergeBuffers(this.recBuffersL, this.recLength)
    const bufferR = this.mergeBuffers(this.recBuffersR, this.recLength)
    const interleaved = this.interleave(bufferL, bufferR)
    const dataview = this.encodeWAV(interleaved)
    const audioBlob = new Blob([dataview], { type })
    this.postMessage(audioBlob)
  }

  exportMonoWAV(type) {
    const bufferL = this.mergeBuffers(recBuffersL, recLength)
    const dataview = this.encodeWAV(bufferL, true)
    const audioBlob = new Blob([dataview], { type: type })
    this.postMessage(audioBlob)
  }

  getBuffers() {
    let buffers = []
    buffers.push( this.mergeBuffers(this.recBuffersL, this.recLength) )
    buffers.push( this.mergeBuffers(this.recBuffersR, this.recLength) )
    this.postMessage(buffers)
  }

  clear(){
    this.recLength = 0
    this.recBuffersL = []
    this.recBuffersR = []
  }

  mergeBuffers(recBuffers, recLength) {
    let result = new Float32Array(recLength)
    let offset = 0
    for (let i = 0; i < recBuffers.length; i++){
      result.set(recBuffers[i], offset)
      offset += recBuffers[i].length
    }
    return result
  }

  interleave(inputL, inputR) {
    let length = inputL.length + inputR.length
    let result = new Float32Array(length)

    let index = 0,
      inputIndex = 0

    while (index < length){
      result[index++] = inputL[inputIndex]
      result[index++] = inputR[inputIndex]
      inputIndex++
    }
    return result
  }

  floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset+=2){
      let s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++){
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  encodeWAV(samples, mono){
    let buffer = new ArrayBuffer(44 + samples.length * 2)
    let view = new DataView(buffer)

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF')
    /* file length */
    view.setUint32(4, 32 + samples.length * 2, true)
    /* RIFF type */
    this.writeString(view, 8, 'WAVE')
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ')
    /* format chunk length */
    view.setUint32(16, 16, true)
    /* sample format (raw) */
    view.setUint16(20, 1, true)
    /* channel count */
    view.setUint16(22, mono?1:2, true)
    /* sample rate */
    view.setUint32(24, this.sampleRate, true)
    /* byte rate (sample rate * block align) */
    view.setUint32(28, this.sampleRate * 4, true)
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 4, true)
    /* bits per sample */
    view.setUint16(34, 16, true)
    /* data chunk identifier */
    this.writeString(view, 36, 'data')
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true)

    this.floatTo16BitPCM(view, 44, samples)

    return view
  }
}
