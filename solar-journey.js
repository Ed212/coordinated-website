/* Endless composited space, not new generated footage or a scale model. */
const TAU=Math.PI*2;
const ease=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
const wrap=n=>((n%1)+1)%1;
// Pure, deterministic samples make wrap continuity testable without a browser.
// A fixed overscan grows in gently from the exact departure still. There is
// no forward zoom / arrival and no timer that can restart the launch.
export function spaceFrame(seconds){
 const t=Math.max(0,seconds),entry=ease(t/12);
 return {scale:1+.045*entry,x:9*Math.sin(TAU*t/173)*entry,y:5*Math.sin(TAU*t/227)*entry,stars:entry};
}
export function starAt(index,seconds){
 const seed=n=>wrap(Math.sin(n*127.1+311.7)*43758.5453);
 const depth=.3+.7*seed(index+19),x=wrap(seed(index+1)-seconds*(.00055+.00065*depth));
 // Invisible at both edges, with zero derivative: no popping at wrap.
 const fade=ease(x/.06)*ease((1-x)/.06);
 return {x,y:seed(index+71),radius:.35+.65*depth,alpha:(.12+.32*depth)*fade};
}
export function advanceSpaceTime(time,previous,now,active){
 return active&&previous!==null?time+Math.max(0,Math.min(.1,(now-previous)/1000)):time;
}
export async function prepareJourney(canvas){
 const space=new Image();space.src='assets/video/deep-space-settled.jpg';await space.decode();
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');
 canvas.width=1280;canvas.height=720;
 function render(time){
  const frame=spaceFrame(time),w=1280*frame.scale,h=720*frame.scale;
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  ctx.drawImage(space,(1280-w)/2+frame.x,(720-h)/2+frame.y,w,h);
  // Sparse, slow foreground parallax. No trails, twinkling or pulse effect.
  ctx.fillStyle='#c9dcf0';
  for(let i=0;i<100;i++){const s=starAt(i,time);ctx.globalAlpha=s.alpha*frame.stars;ctx.beginPath();ctx.arc(s.x*1280,s.y*720,s.radius,0,TAU);ctx.fill();}
  ctx.globalAlpha=1;canvas.dataset.journeyTime=Math.max(0,time).toFixed(3);
 }
 render(0);return {render};
}
