
import copyTile from '../shared/copyTile.mjs'
import prepareDiff from './prepareDiff.mjs'

function updateFrame(bufs, w,h, frms, i, r, evenCrd) {
	var U8 = Uint8Array, U32 = Uint32Array;
	var pimg = new U8(bufs[i-1]), pimg32 = new U32(bufs[i-1]), nimg = i+1<bufs.length ? new U8(bufs[i+1]):null;
	var cimg = new U8(bufs[i]), cimg32 = new U32(cimg.buffer);

	var mix=w,miy=h,max=-1,may=-1;
	for(var y=0; y<r.height; y++) for(var x=0; x<r.width; x++) {
		var cx = r.x+x, cy = r.y+y;
		var j = cy*w+cx, cc = cimg32[j];
		// no need to draw transparency, or to dispose it. Or, if writing the same color and the next one does not need transparency.
		if(cc==0 || (frms[i-1].dispose==0 && pimg32[j]==cc && (nimg==null || nimg[j*4+3]!=0))/**/) {}
		else {
			if(cx<mix) mix=cx;  if(cx>max) max=cx;
			if(cy<miy) miy=cy;  if(cy>may) may=cy;
		}
	}
	if(max==-1) mix=miy=max=may=0;
	if(evenCrd) {  if((mix&1)==1)mix--;  if((miy&1)==1)miy--;  }
	r = {x:mix, y:miy, width:max-mix+1, height:may-miy+1};

	var fr = frms[i];  fr.rect = r;  fr.blend = 1;  fr.img = new Uint8Array(r.width*r.height*4);
	if(frms[i-1].dispose==0) {
		copyTile(pimg,w,h, fr.img,r.width,r.height, -r.x,-r.y, 0);
		prepareDiff(cimg,w,h,fr.img,r);
		//copyTile(cimg,w,h, fr.img,r.width,r.height, -r.x,-r.y, 2);
	}
	else
		copyTile(cimg,w,h, fr.img,r.width,r.height, -r.x,-r.y, 0);
}

function framize(bufs,w,h,alwaysBlend,evenCrd,forbidPrev) {
	/*  DISPOSE
	    - 0 : no change
		- 1 : clear to transparent
		- 2 : retstore to content before rendering (previous frame disposed)
		BLEND
		- 0 : replace
		- 1 : blend
	*/
	var frms = [];
	for(var j=0; j<bufs.length; j++) {
		var cimg = new Uint8Array(bufs[j]), cimg32 = new Uint32Array(cimg.buffer);
		var nimg;

		var nx=0, ny=0, nw=w, nh=h, blend=alwaysBlend?1:0;
		if(j!=0) {
			var tlim = (forbidPrev || alwaysBlend || j==1 || frms[j-2].dispose!=0)?1:2, tstp = 0, tarea = 1e9;
			for(var it=0; it<tlim; it++)
			{
				var pimg = new Uint8Array(bufs[j-1-it]), p32 = new Uint32Array(bufs[j-1-it]);
				var mix=w,miy=h,max=-1,may=-1;
				for(var y=0; y<h; y++) for(var x=0; x<w; x++) {
					var i = y*w+x;
					if(cimg32[i]!=p32[i]) {
						if(x<mix) mix=x;  if(x>max) max=x;
						if(y<miy) miy=y;  if(y>may) may=y;
					}
				}
				if(max==-1) mix=miy=max=may=0;
				if(evenCrd) {  if((mix&1)==1)mix--;  if((miy&1)==1)miy--;  }
				var sarea = (max-mix+1)*(may-miy+1);
				if(sarea<tarea) {
					tarea = sarea;  tstp = it;
					nx = mix; ny = miy; nw = max-mix+1; nh = may-miy+1;
				}
			}

			// alwaysBlend: pokud zjistím, že blendit nelze, nastavím předchozímu snímku dispose=1. Zajistím, aby obsahoval můj obdélník.
			var pimg = new Uint8Array(bufs[j-1-tstp]);
			if(tstp==1) frms[j-1].dispose = 2;

			nimg = new Uint8Array(nw*nh*4);
			copyTile(pimg,w,h, nimg,nw,nh, -nx,-ny, 0);

			blend =  copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 3) ? 1 : 0;
			if(blend==1) prepareDiff(cimg,w,h,nimg,{x:nx,y:ny,width:nw,height:nh});
			else         copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 0);
			//copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, blend==1?2:0);
		}
		else nimg = cimg.slice(0);	// img may be rewritten further ... don't rewrite input

		frms.push({rect:{x:nx,y:ny,width:nw,height:nh}, img:nimg, blend:blend, dispose:0});
	}


	if(alwaysBlend) for(var j=0; j<frms.length; j++) {
		var frm = frms[j];  if(frm.blend==1) continue;
		var r0 = frm.rect, r1 = frms[j-1].rect
		var miX = Math.min(r0.x, r1.x), miY = Math.min(r0.y, r1.y);
		var maX = Math.max(r0.x+r0.width, r1.x+r1.width), maY = Math.max(r0.y+r0.height, r1.y+r1.height);
		var r = {x:miX, y:miY, width:maX-miX, height:maY-miY};

		frms[j-1].dispose = 1;
		if(j-1!=0)
		updateFrame(bufs, w,h,frms, j-1,r, evenCrd);
		updateFrame(bufs, w,h,frms, j  ,r, evenCrd);
	}
	var area = 0;
	if(bufs.length!=1) for(var i=0; i<frms.length; i++) {
		var frm = frms[i];
		area += frm.rect.width*frm.rect.height;
		//if(i==0 || frm.blend!=1) continue;
		//var ob = new Uint8Array(
		//console.log(frm.blend, frm.dispose, frm.rect);
	}
	//if(area!=0) console.log(area);
	return frms;
}

export default framize
