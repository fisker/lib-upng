
import pako from 'pako'
import filterLine from './filterLine.mjs'

const {deflate} = pako

function filterZero(img,h,bpp,bpl,data, filter, levelZero)
{
	var fls = [], ftry=[0,1,2,3,4];
	if     (filter!=-1)             ftry=[filter];
	else if(h*bpl>500000 || bpp==1) ftry=[0];
	var opts;  if(levelZero) opts={level:0};

  // [@fisker] https://github.com/photopea/UPNG.js/commit/7bb5540f1b0e0cef354ab79f0ffebfcc82b07926
  // Use `UZIP.deflate` for data.length>10e6

  var time = Date.now();
	for(var i=0; i<ftry.length; i++) {
		for(var y=0; y<h; y++) filterLine(data, img, y, bpl, bpp, ftry[i]);
		//var nimg = new Uint8Array(data.length);
		//var sz = UZIP.F.deflate(data, nimg);  fls.push(nimg.slice(0,sz));
		//var dfl = pako["deflate"](data), dl=dfl.length-4;
		//var crc = (dfl[dl+3]<<24)|(dfl[dl+2]<<16)|(dfl[dl+1]<<8)|(dfl[dl+0]<<0);
		//console.log(crc, UZIP.adler(data,2,data.length-6));
		fls.push(deflate(data,opts));
	}

	var ti, tsize=1e9;
	for(var i=0; i<fls.length; i++) if(fls[i].length<tsize) {  ti=i;  tsize=fls[i].length;  }
	return fls[ti];
}

export default filterZero
