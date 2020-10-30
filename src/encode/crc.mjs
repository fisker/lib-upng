const table = ( function() {
  var tab = new Uint32Array(256);
  for (var n=0; n<256; n++) {
  var c = n;
  for (var k=0; k<8; k++) {
    if (c & 1)  c = 0xedb88320 ^ (c >>> 1);
    else        c = c >>> 1;
  }
  tab[n] = c;  }
return tab;  })()
function update(c, buf, off, len) {
for (var i=0; i<len; i++)  c = table[(c ^ buf[off+i]) & 0xff] ^ (c >>> 8);
return c;
}
function crc(b,o,l)  {  return update(0xffffffff,b,o,l) ^ 0xffffffff;  }

export default crc
