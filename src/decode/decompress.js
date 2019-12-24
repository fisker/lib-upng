import getBPP from './getBPP'
import filterZero from './filterZero'
import readInterlace from './readInterlace'
import inflate from './inflate'

function decompress(out, dd, w, h) {
	var time = Date.now();
	var bpp = getBPP(out), bpl = Math.ceil(w*bpp/8), buff = new Uint8Array((bpl+1+out.interlace)*h);
	dd = inflate(dd,buff);
	//console.log(dd.length, buff.length);
	//console.log(Date.now()-time);

	var time=Date.now();
	if     (out.interlace==0) dd = filterZero(dd, out, 0, w, h);
	else if(out.interlace==1) dd = readInterlace(dd, out);
	//console.log(Date.now()-time);
	return dd;
}

export default decompress