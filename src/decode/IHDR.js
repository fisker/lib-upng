import {
  readUint
} from './bin'

function IHDR(data, offset, out)
{
	out.width  = readUint(data, offset);  offset += 4;
	out.height = readUint(data, offset);  offset += 4;
	out.depth     = data[offset];  offset++;
	out.ctype     = data[offset];  offset++;
	out.compress  = data[offset];  offset++;
	out.filter    = data[offset];  offset++;
	out.interlace = data[offset];  offset++;
}

export default IHDR