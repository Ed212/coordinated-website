/* A deterministic cinematic bridge, not a scale model or new generated footage. */
export const journeyDuration = 24;
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { n=clamp(n); return n*n*(3-2*n); };
const image = async src => { const value=new Image(); value.src=src; await value.decode(); return value; };
export async function prepareJourney(canvas) {
 const [space,galaxy,moonMap,mars]=await Promise.all([
  image('assets/video/deep-space-settled.jpg'),image('assets/galaxy/landscape-upscaled-2880x1600.webp'),
  image('assets/video/solar/moon-color.jpg'),image('assets/video/solar/mars-global.jpg')
 ]);
 const ctx=canvas.getContext('2d'); if(!ctx)throw Error('Canvas unavailable');
 canvas.width=1280;canvas.height=720;
 // Project the NASA equirectangular lunar map onto a shaded sphere once.
 const texture=document.createElement('canvas');texture.width=moonMap.width;texture.height=moonMap.height;
 const tx=texture.getContext('2d',{willReadFrequently:true});tx.drawImage(moonMap,0,0);
 const source=tx.getImageData(0,0,texture.width,texture.height).data;
 const moon=document.createElement('canvas');moon.width=moon.height=384;
 const mx=moon.getContext('2d'),pixels=mx.createImageData(384,384);
 for(let y=0;y<384;y++)for(let x=0;x<384;x++){
  const nx=(x+0.5)/192-1,ny=(y+0.5)/192-1,rr=nx*nx+ny*ny;if(rr>=1)continue;
  const nz=Math.sqrt(1-rr),u=(.5+Math.atan2(nx,nz)/(Math.PI*2)),v=.5+Math.asin(ny)/Math.PI;
  const s=(Math.floor(v*(texture.height-1))*texture.width+Math.floor(u*(texture.width-1)))*4,d=(y*384+x)*4;
  const light=.025+.82*Math.pow(Math.max(0,-nx*.77-ny*.3+nz*.56),.75);
  for(let c=0;c<3;c++)pixels.data[d+c]=source[s+c]*light;
  pixels.data[d+3]=Math.round(Math.min(1,(1-Math.sqrt(rr))*192)*255);
 }
 mx.putImageData(pixels,0,0);
 function cover(img,x=0,y=0,w=1280,h=720){const scale=Math.max(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale);}
 function framing(){const scale=Math.max(canvas.clientWidth/1280,canvas.clientHeight/720),width=canvas.clientWidth/scale;return{width,left:(1280-width)*(innerWidth<=760?.73:.68),small:innerWidth<=760};}
 function galaxyCover(){const view=framing(),offset=view.small?view.left+view.width*.58-1280*.62:0;cover(galaxy,offset);}
 function planet(img,time,start,length,y,size){
  const p=clamp((time-start)/length);if(time<start||p>=1)return;
  const view=framing(),radius=(.019+size*p*p)*Math.min(720,view.width*1.65),cx=view.left+(.70+.70*p*p)*view.width,cy=view.small?Math.min(620,canvas.clientHeight*.45)/canvas.clientHeight*720:(y+.09*p)*720;
  ctx.save();ctx.globalAlpha=ease(p/.15);ctx.translate(cx,cy);ctx.rotate(-.12*p);
  ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.clip();ctx.drawImage(img,-radius,-radius,radius*2,radius*2);
  if(img===mars){const shadow=ctx.createLinearGradient(-radius,-radius*.5,radius,radius*.5);shadow.addColorStop(0,'rgba(0,0,0,.1)');shadow.addColorStop(.4,'rgba(0,0,0,.18)');shadow.addColorStop(1,'rgba(0,0,0,.94)');ctx.fillStyle=shadow;ctx.fillRect(-radius,-radius,radius*2,radius*2);}
  ctx.restore();
 }
 function render(time){
  const t=Math.max(0,Math.min(journeyDuration,time)),arrival=ease((t-12)/12);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#000';ctx.fillRect(0,0,1280,720);
  const drift=1+.035*ease(t/journeyDuration);ctx.save();ctx.translate(1280*.68,720*.45);ctx.scale(drift,drift);ctx.translate(-1280*.68,-720*.45);cover(space);ctx.restore();
  // Darkness accumulates gently; the background never cuts to a black frame.
  ctx.fillStyle=`rgba(0,0,0,${arrival*.84})`;ctx.fillRect(0,0,1280,720);
  const sunlight=ease(t/2.5)*(1-ease((t-9)/7));
  if(sunlight>0){ctx.save();ctx.globalAlpha=sunlight*.8;const view=framing(),gx=view.left+view.width*.84,gy=720*(view.small?.42:.28),glow=ctx.createRadialGradient(gx,gy,0,gx,gy,21);glow.addColorStop(0,'rgba(255,242,212,1)');glow.addColorStop(.07,'rgba(255,224,165,.92)');glow.addColorStop(.28,'rgba(255,201,125,.12)');glow.addColorStop(1,'rgba(255,201,125,0)');ctx.fillStyle=glow;ctx.fillRect(gx-21,gy-21,42,42);ctx.restore();}
  planet(moon,t,.8,8.5,.43,.21);planet(mars,t,7.2,9,.48,.22);
  if(arrival>0){
   // Approach the original artwork from a distant point. Its pattern never morphs.
   const scale=.075+.925*arrival,anchorX=framing().left+framing().width*.67,anchorY=720*.43;
   ctx.save();ctx.translate(anchorX*(1-scale),anchorY*(1-scale));ctx.scale(scale,scale);
   ctx.globalAlpha=ease((t-12)/6);ctx.globalCompositeOperation='screen';galaxyCover();ctx.restore();
   // The final two seconds converge on exactly the retained original composition.
   const finish=ease((t-22)/2);if(finish){ctx.globalAlpha=finish;galaxyCover();ctx.globalAlpha=1;}
  }
  canvas.dataset.journeyTime=t.toFixed(3);
 }
 render(journeyDuration);const ending=canvas.toDataURL('image/jpeg',.96);render(0);
 return {render,ending};
}
