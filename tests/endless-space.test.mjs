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
 const nodes=new Map(),frames=new Map(),blocked=new Set(options.blocked||[]);let frameId=0,observer;
 const node=selector=>{if(selector==='[data-flight-still]')return null;if(!nodes.has(selector))nodes.set(selector,{dataset:{settleAt:10,src:'video.mp4'},style:{},hidden:false,paused:true,currentTime:0,duration:10,readyState:4,ended:false,textContent:'',playCalls:0,loadCalls:0,classList:{add(){},remove(){}},events:{},addEventListener(type,fn){this.events[type]=fn;},querySelector:()=>node('img'),pause(){this.paused=true;},play(){this.playCalls++;if(blocked.has(selector))return Promise.reject(Error('Autoplay blocked'));this.paused=false;return Promise.resolve();},load(){this.loadCalls++;},focus(){document.activeElement=this;},requestVideoFrameCallback(){}});return nodes.get(selector);};
 const document={hidden:false,querySelector:node,events:{},addEventListener(type,fn){this.events[type]=fn;}};
 const window={events:{},addEventListener(type,fn){this.events[type]=fn;}};
 const preference={matches:options.reduced||false,addEventListener(type,fn){this.change=fn;}};
 const context={document,matchMedia:()=>preference,navigator:{connection:{saveData:options.saveData||false}},location:{hash:options.hash||''},window,IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}},requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:()=>1,clearTimeout(){},prepareJourney:async()=>{if(options.spaceFailed)throw Error('Image failed');return {render:t=>{node('.flight-bridge').dataset.journeyTime=t.toFixed(3);}};},advanceSpaceTime};
 const source=(await readFile(new URL('../launch-preview.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');
 vm.runInNewContext(source,context);
 const flush=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};await flush();
 return {node,document,window,preference,frames,blocked,flush,phase:()=>node('.launch-preview').dataset.flightPhase,click:async s=>{node(s).events.click();await flush();},frame:now=>{const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(now));},view:async visible=>{observer([{isIntersecting:visible}]);await flush();}};
}
function assertStill(c){
 assert.equal(c.phase(),'still');assert.equal(c.frames.size,0);
 assert.equal(c.node('.flight-animation').hidden,true);
 assert.equal(c.node('#launch-intro-video').paused,true);assert.equal(c.node('#departure-video').paused,true);
 assert.equal(c.node('[data-flight-pause]').hidden,true);assert.equal(c.node('[data-flight-skip]').hidden,true);
 assert.equal(c.node('[data-flight-replay]').hidden,false);assert.equal(c.node('.flight-status').textContent,'Still image');
 assert.equal(c.node('[data-flight-still]'),null);
}
test('hero initializes with Pause, Skip and Replay but no still-image button or null listeners',async()=>{
 const c=await controller();assert.equal(c.phase(),'launch');assert.equal(c.node('[data-flight-still]'),null);
 assert.equal(c.node('[data-flight-pause]').hidden,false);assert.equal(c.node('[data-flight-skip]').hidden,false);
 assert.equal(c.node('[data-flight-replay]').hidden,true);assert.equal(c.node('.flight-controls').hidden,false);
 await c.click('[data-flight-pause]');assert.equal(c.node('#launch-intro-video').paused,true);
 assert.equal(c.node('[data-flight-pause]').textContent,'Resume motion');
 await c.click('[data-flight-pause]');assert.equal(c.node('#launch-intro-video').paused,false);
});
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
 await c.click('[data-flight-replay]');assert.equal(c.phase(),'launch');
 assert.equal(c.document.activeElement,c.node('[data-flight-skip]'));
 await c.click('[data-flight-skip]');assert.equal(c.phase(),'ambient');assert.equal(c.node('#launch-intro-video').paused,true);
 assert.equal(c.document.activeElement,c.node('[data-flight-replay]'));
 c.node('#departure-video').events.ended();assert.equal(c.phase(),'ambient');
});
test('manual pause survives offscreen, hidden and page-restoration interruptions',async()=>{
 const c=await controller();await c.click('[data-flight-skip]');c.frame(0);c.frame(16);
 await c.click('[data-flight-pause]');const time=c.node('.flight-bridge').dataset.journeyTime;
 await c.view(false);await c.view(true);
 c.document.hidden=true;await c.document.events.visibilitychange();
 c.document.hidden=false;await c.document.events.visibilitychange();
 c.window.events.pagehide();await c.window.events.pageshow({persisted:true});
 assert.equal(c.frames.size,0);assert.equal(c.node('[data-flight-pause]').textContent,'Resume motion');
 assert.equal(c.node('.flight-bridge').dataset.journeyTime,time);
 await c.click('[data-flight-pause]');c.frame(1e8);assert.equal(c.node('.flight-bridge').dataset.journeyTime,time);
 c.frame(1e8+16);assert(+c.node('.flight-bridge').dataset.journeyTime>+time);
 c.window.events.pagehide();assert.equal(c.frames.size,0);
 await c.window.events.pageshow({persisted:true});c.frame(2e8);assert.equal(c.phase(),'ambient');
});
test('reduced-motion change selects static fallback and only explicit replay restarts',async()=>{
 const c=await controller();await c.click('[data-flight-skip]');
 c.preference.matches=true;c.preference.change();assertStill(c);assert.equal(c.node('.flight-controls').hidden,true);
 c.preference.matches=false;c.preference.change();assertStill(c);assert.equal(c.node('.flight-controls').hidden,false);
 await c.view(false);await c.view(true);assertStill(c);
 await c.click('[data-flight-replay]');assert.equal(c.phase(),'launch');assert.equal(c.node('[data-flight-pause]').hidden,false);
});
test('preference and navigation fallbacks do not start media or schedule frames',async()=>{
 for(const options of [{reduced:true},{saveData:true},{hash:'#pilot'}]){
  const c=await controller(options);assertStill(c);
  for(const selector of ['#launch-intro-video','#departure-video']){assert.equal(c.node(selector).loadCalls,0);assert.equal(c.node(selector).playCalls,0);}
 }
});
test('failed space asset, launch and departure errors retain static fallback',async()=>{
 const c=await controller({spaceFailed:true});await c.click('[data-flight-skip]');assertStill(c);
 const d=await controller();d.node('#launch-intro-video').events.error();assertStill(d);
 const e=await controller();e.node('#launch-intro-video').events.ended();await e.flush();assert.equal(e.phase(),'departure');
 await e.click('[data-flight-pause]');assert.equal(e.node('#departure-video').paused,true);
 await e.click('[data-flight-pause]');assert.equal(e.node('#departure-video').paused,false);
 e.node('#departure-video').events.error();assertStill(e);
});
test('autoplay rejection falls back without the removed control and replay can recover',async()=>{
 const c=await controller({blocked:['#launch-intro-video']});assertStill(c);
 c.blocked.clear();await c.click('[data-flight-replay]');assert.equal(c.phase(),'launch');
 c.blocked.add('#departure-video');c.node('#launch-intro-video').events.ended();await c.flush();assertStill(c);
});
