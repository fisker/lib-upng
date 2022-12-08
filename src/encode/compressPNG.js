import filterZero from './filterZero.js'

function compressPNG(out, filter, levelZero) {
	for(var i=0; i<out.frames.length; i++) {
		var frm = out.frames[i], nw=frm.rect.width, nh=frm.rect.height;
		var fdata = new Uint8Array(nh*frm.bpl+nh);
		frm.cimg = filterZero(frm.img,nh,frm.bpp,frm.bpl,fdata, filter, levelZero);
	}
}

export default compressPNG
