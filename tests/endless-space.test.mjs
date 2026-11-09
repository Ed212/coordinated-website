import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {spaceFrame,starAt,advanceSpaceTime} from '../solar-journey.js';

test('exact departure join and indefinite bounded, non-zooming camera',()=>{
 assert.deepEqual(spaceFrame(0),{scale:1,x:0,y:0,stars:0});
 for(const t of [1,12,24,48,173,227,3600,86400,1e8]){
  const f=spaceFrame(t),next=spaceFrame(t+.001);
  assert(f.scale>=1&&f.scale<=1.045);
  assert(Math.abs(f.x)<=(f.scale-1)*640+1e-9);
  assert(Math.abs(f.y)<=(f.scale-1)*360+1e-9);
  assert(Math.abs(f.x-next.x)<.001&&Math.abs(f.y-next.y)<.001);
  if(t>=12)assert.equal(f.scale,1.045);
 }
});
test('all star wraps are invisible, smooth and deterministic',()=>{
 for(let i=0;i<100;i++){
  const initial=starAt(i,0),later=starAt(i,1),speed=(initial.x-later.x+1)%1;
  const boundary=initial.x/speed;
  for(const t of [boundary-0.001,boundary,boundary+0.001])assert(starAt(i,t).alpha<1e-8);
  assert.deepEqual(starAt(i,86400),starAt(i,86400));
 }
});
test('paused/resumed clocks do not accumulate background time',()=>{
 assert.equal(advanceSpaceTime(50,100,100000,false),50);
 assert.equal(advanceSpaceTime(50,null,100000,true),50);
 assert.equal(advanceSpaceTime(50,100000,100016,true),50.016);
 assert.equal(advanceSpaceTime(50,100,100000,true),50.1);
});

async function controller(options={}){
 const nodes=new Map(),frames=new Map();let frameId=0,observer;
 const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{dataset:{settleAt:10,src:'video.mp4'},style:{},hidden:false,paused:true,currentTime:0,duration:10,readyState:4,ended:false,textContent:'',classList:{add(){},remove(){}},events:{},addEventListener(type,fn){this.events[type]=fn;},querySelector:()=>node('img'),pause(){this.paused=true;},play(){this.paused=false;return Promise.resolve();},load(){},focus(){},requestVideoFrameCallback(){}});return nodes.get(selector);};
 const document={hidden:false,querySelector:node,events:{},addEventListener(type,fn){this.events[type]=fn;}};
 const preference={matches:options.reduced||false,addEventListener(type,fn){this.change=fn;}};
 const context={document,matchMedia:()=>preference,navigator:{connection:{saveData:options.saveData||false}},location:{hash:options.hash||''},window:{addEventListener(){}},IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}},requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:()=>1,clearTimeout(){},prepareJourney:async()=>{if(options.spaceFailed)throw Error('Image failed');return {render:t=>{node('.flight-bridge').dataset.journeyTime=t.toFixed(3);}};},advanceSpaceTime};
 const source=(await readFile(new URL('../launch-preview.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');
 vm.runInNewContext(source,context);
 const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};await flush();
 return {node,document,preference,frames,flush,phase:()=>node('.launch-preview').dataset.flightPhase,click:async s=>{node(s).events.click();await flush();},frame:now=>{const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(now));},view:async visible=>{observer([{isIntersecting:visible}]);await flush();}};
}
test('launch runs once, departure enters endless space; explicit replay alone restarts',async()=>{
 const c=await controller();assert.equal(c.phase(),'launch');
 c.node('#launch-intro-video').ended=true;c.node('#launch-intro-video').events.ended();await c.flush();assert.equal(c.phase(),'departure');
 c.node('#departure-video').events.ended();await c.flush();assert.equal(c.phase(),'ambient');
 c.frame(0);c.frame(16);c.frame(1e8);assert.equal(c.phase(),'ambient');assert.equal(c.node('#launch-intro-video').paused,true);
 await c.click('[data-flight-pause]');assert.equal(c.frames.size,0);const time=c.node('.flight-bridge').dataset.journeyTime;
 await c.click('[data-flight-pause]');c.frame(2e8);assert.equal(c.node('.flight-bridge').dataset.journeyTime,time);
 await c.view(false);assert.equal(c.frames.size,0);await c.view(true);c.frame(3e8);assert.equal(c.node('.flight-bridge').dataset.journeyTime,time);
 c.document.hidden=true;await c.document.events.visibilitychange();assert.equal(c.frames.size,0);
 c.document.hidden=false;await c.document.events.visibilitychange();
 await c.click('[data-flight-still]');assert.equal(c.phase(),'still');assert.equal(c.frames.size,0);
 await c.click('[data-flight-replay]');assert.equal(c.phase(),'launch');
 await c.click('[data-flight-skip]');assert.equal(c.phase(),'ambient');assert.equal(c.node('#launch-intro-video').paused,true);
 c.node('#departure-video').events.ended();assert.equal(c.phase(),'ambient');
 c.preference.matches=true;c.preference.change();assert.equal(c.phase(),'still');assert.equal(c.frames.size,0);
 c.preference.matches=false;c.preference.change();assert.equal(c.phase(),'still');
});

test('preference and navigation fallbacks do not start media or schedule frames',async()=>{
 for(const options of [{reduced:true},{saveData:true},{hash:'#pilot'}]){
  const c=await controller(options);assert.equal(c.phase(),'still');assert.equal(c.frames.size,0);
  assert.equal(c.node('#launch-intro-video').paused,true);assert.equal(c.node('#departure-video').paused,true);
 }
});
test('failed space asset and video errors fail safely to still image',async()=>{
 const c=await controller({spaceFailed:true});await c.click('[data-flight-skip]');assert.equal(c.phase(),'still');assert.equal(c.frames.size,0);
 const d=await controller();d.node('#launch-intro-video').events.error();assert.equal(d.phase(),'still');assert.equal(d.frames.size,0);
});
