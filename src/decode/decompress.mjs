import pako from 'pako'
import getBPP from './getBPP.mjs'
import filterZero from './filterZero.mjs'
import readInterlace from './readInterlace.mjs'
import inflate from './inflate.mjs'

const {inflateRaw} = pako

function decompress(out, dd, w, h) {
	var time = Date.now();
	var bpp = getBPP(out), bpl = Math.ceil(w*bpp/8), buff = new Uint8Array((bpl+1+out.interlace)*h);
	if(out.tabs["CgBI"]) dd = inflateRaw(dd,buff);
	else                 dd = inflate(dd,buff);
	//console.log(dd.length, buff.length);
	//console.log(Date.now()-time);

	var time=Date.now();
	if     (out.interlace==0) dd = filterZero(dd, out, 0, w, h);
	else if(out.interlace==1) dd = readInterlace(dd, out);
	//console.log(Date.now()-time);
	return dd;
}

export default decompress
