import copyTile from '../shared/copyTile'
import decodeImage from './decodeImage'

function toRGBA8(out)
{
	var w = out.width, h = out.height;
	if(out.tabs.acTL==null) return [decodeImage(out.data, w, h, out).buffer];

	var frms = [];
	if(out.frames[0].data==null) out.frames[0].data = out.data;

	var len = w*h*4, img = new Uint8Array(len), empty = new Uint8Array(len), prev=new Uint8Array(len);
	for(var i=0; i<out.frames.length; i++)
	{
		var frm = out.frames[i];
		var fx=frm.rect.x, fy=frm.rect.y, fw = frm.rect.width, fh = frm.rect.height;
		var fdata = decodeImage(frm.data, fw,fh, out);

		if(i!=0) for(var j=0; j<len; j++) prev[j]=img[j];

		if     (frm.blend==0) copyTile(fdata, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.blend==1) copyTile(fdata, fw, fh, img, w, h, fx, fy, 1);

		frms.push(img.buffer.slice(0));

		if     (frm.dispose==0) {}
		else if(frm.dispose==1) copyTile(empty, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.dispose==2) for(var j=0; j<len; j++) img[j]=prev[j];
	}
	return frms;
}

export default toRGBA8
