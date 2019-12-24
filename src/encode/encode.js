import compress from './compress'
import compressPNG from './compressPNG'

function encode(bufs, w, h, ps, dels, tabs, forbidPlte)
{
	if(ps==null) ps=0;
	if(forbidPlte==null) forbidPlte = false;

	var nimg = compress(bufs, w, h, ps, [false, false, false, 0, forbidPlte]);
	compressPNG(nimg, -1);
	
	return main(nimg, w, h, dels, tabs);
}

export default encode
