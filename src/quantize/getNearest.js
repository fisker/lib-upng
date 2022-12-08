import dist from './dist.js'
import planeDstFunction from './planeDst.js'

function getNearest(nd, r,g,b,a)
{
	if(nd.left==null) {  nd.tdst = dist(nd.est.q,r,g,b,a);  return nd;  }
	var planeDst = planeDstFunction(nd.est,r,g,b,a);

	var node0 = nd.left, node1 = nd.right;
	if(planeDst>0) {  node0=nd.right;  node1=nd.left;  }

	var ln = getNearest(node0, r,g,b,a);
	if(ln.tdst<=planeDst*planeDst) return ln;
	var rn = getNearest(node1, r,g,b,a);
	return rn.tdst<ln.tdst ? rn : ln;
}

export default getNearest
