import pako from 'pako'

const {inflateRaw} = pako

function inflate(data, buff) {  var out=inflateRaw(new Uint8Array(data.buffer, 2,data.length-6),buff);  return out;  }

export default inflate