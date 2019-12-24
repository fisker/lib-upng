function nextZero(data,p)  {  while(data[p]!=0) p++;  return p;  }
function readUshort(buff,p)  {  return (buff[p]<< 8) | buff[p+1];  }
function writeUshort(buff,p,n){  buff[p] = (n>>8)&255;  buff[p+1] = n&255;  }
function readUint(buff,p)  {  return (buff[p]*(256*256*256)) + ((buff[p+1]<<16) | (buff[p+2]<< 8) | buff[p+3]);  }
function writeUint(buff,p,n){  buff[p]=(n>>24)&255;  buff[p+1]=(n>>16)&255;  buff[p+2]=(n>>8)&255;  buff[p+3]=n&255;  }
function readASCII(buff,p,l){  var s = "";  for(var i=0; i<l; i++) s += String.fromCharCode(buff[p+i]);  return s;    }
function writeASCII(data,p,s){  for(var i=0; i<s.length; i++) data[p+i] = s.charCodeAt(i);  }
function readBytes(buff,p,l){  var arr = [];   for(var i=0; i<l; i++) arr.push(buff[p+i]);   return arr;  }
function pad(n) { return n.length < 2 ? "0" + n : n; }
function readUTF8(buff, p, l) {
		var s = "", ns;
		for(var i=0; i<l; i++) s += "%" + pad(buff[p+i].toString(16));
		try {  ns = decodeURIComponent(s); }
		catch(e) {  return readASCII(buff, p, l);  }
		return  ns;
	}

export {
  nextZero,
  readUshort,
  writeUshort,
  readUint,
  writeUint,
  readASCII,
  writeASCII,
  readBytes,
  pad,
  readUTF8,
}