import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const LAUNCH='#launch-intro-video', DEPARTURE='#departure-video', FLIGHT='#distant-flight-video';
const PAUSE='[data-flight-pause]', SKIP='[data-flight-skip]', REPLAY='[data-flight-replay]';
const ENTRY=164/24;
async function controller(options={}) {
 const nodes=new Map(),frames=new Map(),timers=new Map(),blocked=new Set(options.blocked||[]),pending=new Map(options.pending||[]);let frameId=0,timerId=0,frameClock=0,observer;
 const node=selector=>{
  if(selector==='[data-flight-still]')return null;
  if(!nodes.has(selector)){
   const n={dataset:{src:selector+'.mp4',sourceEntry:ENTRY,sourceMatchUntil:221/24,fps:24},style:{},preload:'none',hidden:false,paused:true,_currentTime:0,seekCalls:0,get currentTime(){return this._currentTime;},set currentTime(value){this._currentTime=value;this.seekCalls++;},duration:241/24,readyState:4,ended:false,seeking:false,textContent:'',playCalls:0,loadCalls:0,events:{},callbacks:new Map(),
    addEventListener(type,fn){this.events[type]=fn;},pause(){this.paused=true;},
    play(){this.playCalls++;if(blocked.has(selector))return Promise.reject(Error('Autoplay blocked'));this.paused=false;if(pending.has(selector))return pending.get(selector);return Promise.resolve();},
    load(){this.loadCalls++;},focus(){document.activeElement=this;}};
   if(!options.legacy){n.requestVideoFrameCallback=fn=>{const id=++frameId;n.callbacks.set(id,fn);return id;};n.cancelVideoFrameCallback=id=>n.callbacks.delete(id);}
   nodes.set(selector,n);
  }
  return nodes.get(selector);
 };
 const document={hidden:false,querySelector:node,events:{},addEventListener(type,fn){this.events[type]=fn;}};
 const window={events:{},addEventListener(type,fn){this.events[type]=fn;}};
 const preference={matches:options.reduced||false,addEventListener(type,fn){this.change=fn;}};
 const connection={saveData:options.saveData||false,addEventListener(type,fn){this.change=fn;}};
 const context={document,matchMedia:()=>preference,navigator:{connection},location:{hash:options.hash||''},window,IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}},requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(await readFile(new URL('../launch-preview.js',import.meta.url),'utf8'),context);
 const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};await flush();
 const c={node,document,window,preference,connection,frames,timers,blocked,pending,flush,phase:()=>node('.launch-preview').dataset.flightPhase,
  click:async s=>{node(s).events.click();await flush();},
  frame:async(s,t,clock={})=>{const n=node(s);n._currentTime=clock.playhead??t;const now=clock.now??(frameClock+=16);const batch=[...n.callbacks.values()];n.callbacks.clear();for(const fn of batch)fn(now,{mediaTime:t,expectedDisplayTime:clock.displayAt??now});await flush();},
  raf:async()=>{const batch=[...frames.values()];frames.clear();for(const fn of batch)fn(0);await flush();},
  view:async visible=>{observer([{isIntersecting:visible}]);await flush();},
  event:async(s,event)=>{node(s).events[event]();await flush();},
  timeout:async()=>{const batch=[...timers.values()];timers.clear();batch.forEach(fn=>fn());await flush();}
 };
 c.depart=async()=>{await c.frame(LAUNCH,241/24-.8);await c.frame(DEPARTURE,0);assert.equal(c.phase(),'departure');};
 c.loop=async()=>{await c.depart();await c.frame(DEPARTURE,ENTRY);await c.frame(FLIGHT,0);await c.frame(DEPARTURE,ENTRY+.13);assert.equal(c.phase(),'loop');};
 return c;
}
function allPaused(c){for(const s of [LAUNCH,DEPARTURE,FLIGHT])assert.equal(c.node(s).paused,true,s);}
function noCallbacks(c){assert.equal(c.frames.size,0);for(const s of [LAUNCH,DEPARTURE,FLIGHT])assert.equal(c.node(s).callbacks.size,0,s);}
function still(c){assert.equal(c.phase(),'still');allPaused(c);noCallbacks(c);assert.equal(c.node('.flight-animation').hidden,true);assert.equal(c.node(PAUSE).hidden,true);assert.equal(c.node(SKIP).hidden,true);assert.equal(c.node(REPLAY).hidden,false);assert.equal(c.node('.flight-status').textContent,'Still image');}
test('only three controls initialize, originals play at rate 1, moving launch dissolve stays 0.8s',async()=>{
 const c=await controller();assert.equal(c.phase(),'launch');assert.equal(c.node('[data-flight-still]'),null);
 assert.equal(c.node(PAUSE).hidden,false);assert.equal(c.node(SKIP).hidden,false);assert.equal(c.node(REPLAY).hidden,true);
 await c.depart();await c.frame(DEPARTURE,.4);assert.equal(+c.node(LAUNCH).style.opacity,.5);assert.equal(c.node(LAUNCH).paused,false);
 await c.frame(DEPARTURE,.8);assert.equal(+c.node(LAUNCH).style.opacity,0);assert.equal(c.node(LAUNCH).paused,true);
 await c.frame(DEPARTURE,6);assert.equal(c.phase(),'departure');assert.equal(c.node(FLIGHT).playCalls,0);assert.equal(c.node(DEPARTURE).playbackRate,1);
});
test('native distant footage enters on matching decoded frame and loops without replay or a canvas clock',async()=>{
 const c=await controller();await c.loop();assert.equal(c.node(FLIGHT).loop,true);assert.equal(c.node(FLIGHT).playbackRate,1);assert.equal(c.node(FLIGHT).paused,false);
 assert.equal(c.node(DEPARTURE).paused,true);assert.equal(c.node(LAUNCH).paused,true);assert.equal(c.node(FLIGHT).style.opacity,'1');noCallbacks(c);
 c.node(FLIGHT).currentTime=0;await c.flush();assert.equal(c.phase(),'loop');assert.equal(c.node(LAUNCH).playCalls,1);
 await c.event(DEPARTURE,'ended');assert.equal(c.phase(),'loop');
});
test('pause/resume freezes all three players in launch, overlap, departure, handoff and native loop',async()=>{
 const c=await controller();
 for(const stage of ['launch','overlap','departure','handoff','loop']){
  if(stage==='overlap')await c.depart();if(stage==='departure')await c.frame(DEPARTURE,1);if(stage==='handoff')await c.frame(DEPARTURE,ENTRY);
  if(stage==='loop'){await c.frame(DEPARTURE,ENTRY);await c.frame(FLIGHT,0);await c.frame(DEPARTURE,ENTRY+.13);}
  await c.click(PAUSE);allPaused(c);noCallbacks(c);assert.equal(c.node(PAUSE).textContent,'Resume motion');
  await c.click(PAUSE);assert.equal(c.node('.launch-preview').dataset.motionPaused,'false');
 }
 assert.equal(c.phase(),'loop');assert.equal(c.node(FLIGHT).paused,false);
});
test('manual pause survives offscreen/hidden/bfcache and native loop resumes at its retained time',async()=>{
 const c=await controller();await c.loop();c.node(FLIGHT).currentTime=2;await c.click(PAUSE);
 await c.view(false);await c.view(true);c.document.hidden=true;await c.document.events.visibilitychange();c.document.hidden=false;await c.document.events.visibilitychange();
 c.window.events.pagehide();await c.window.events.pageshow({persisted:true});allPaused(c);noCallbacks(c);assert.equal(c.node(FLIGHT).currentTime,2);
 await c.click(PAUSE);assert.equal(c.node(FLIGHT).paused,false);await c.view(false);allPaused(c);await c.view(true);assert.equal(c.node(FLIGHT).paused,false);
 c.window.events.pagehide();allPaused(c);noCallbacks(c);await c.window.events.pageshow({persisted:true});assert.equal(c.node(FLIGHT).paused,false);
});
test('explicit repeated Replay and Skip do not leave stale playback or reset on automatic events',async()=>{
 const c=await controller();await c.loop();
 for(let i=0;i<3;i++){
  await c.click(REPLAY);assert.equal(c.phase(),'launch');assert.equal(c.node(LAUNCH).currentTime,0);assert.equal(c.document.activeElement,c.node(SKIP));
  await c.click(SKIP);assert.equal(c.phase(),'loading-loop');await c.frame(FLIGHT,0);assert.equal(c.phase(),'loop');assert.equal(c.document.activeElement,c.node(REPLAY));assert.equal(c.node(LAUNCH).paused,true);
 }
});
test('reduced motion, Save-Data, no automatic replay after preference reset, and hash fallbacks',async()=>{
 for(const options of [{reduced:true},{saveData:true},{hash:'#pilot'}]){
  const c=await controller(options);still(c);for(const s of [LAUNCH,DEPARTURE,FLIGHT]){assert.equal(c.node(s).playCalls,0);assert.equal(c.node(s).loadCalls,0);}
 }
 const c=await controller();await c.loop();c.preference.matches=true;c.preference.change();still(c);assert.equal(c.node('.flight-controls').hidden,true);
 c.preference.matches=false;c.preference.change();await c.view(false);await c.view(true);still(c);assert.equal(c.node('.flight-controls').hidden,false);
 await c.click(REPLAY);assert.equal(c.phase(),'launch');c.connection.saveData=true;c.connection.change();still(c);
});
test('late readiness seeks into matching source, but never enters the internal wrap blend',async()=>{
 const c=await controller();await c.depart();c.node(FLIGHT).readyState=0;await c.frame(DEPARTURE,ENTRY);assert.equal(c.node(FLIGHT).playCalls,0);
 c.node(FLIGHT).readyState=4;await c.frame(DEPARTURE,ENTRY+1);assert.equal(c.node(FLIGHT).currentTime,1);
 await c.frame(FLIGHT,1);await c.frame(DEPARTURE,ENTRY+1.13);assert.equal(c.phase(),'loop');
 const d=await controller();await d.depart();d.node(FLIGHT).readyState=0;await d.frame(DEPARTURE,ENTRY);d.node(FLIGHT).readyState=4;await d.frame(DEPARTURE,9.1);assert.equal(d.node(FLIGHT).playCalls,0);assert.equal(d.phase(),'departure');await d.event(DEPARTURE,'ended');still(d);
});
test('unmatched or still-seeking frames never expose the loop; bounded retry then exact fallback',async()=>{
 const c=await controller();await c.depart();await c.frame(DEPARTURE,ENTRY);
 c.node(FLIGHT).seeking=true;await c.frame(FLIGHT,0);assert.equal(c.node(FLIGHT).style.opacity,'0');c.node(FLIGHT).seeking=false;
 c.node(DEPARTURE).currentTime=8;
 for(let i=0;i<3;i++)await c.frame(FLIGHT,0);
 assert.equal(c.phase(),'departure');assert.equal(c.node(FLIGHT).paused,true);assert.equal(c.node(FLIGHT).style.opacity,'0');await c.event(DEPARTURE,'ended');still(c);
});
test('launch and departure load errors and autoplay failure use exact static view; replay can recover',async()=>{
 for(const s of [LAUNCH,DEPARTURE]){const c=await controller();await c.event(s,'error');still(c);}
 const c=await controller({blocked:[LAUNCH]});still(c);c.blocked.clear();await c.click(REPLAY);assert.equal(c.phase(),'launch');
 c.blocked.add(DEPARTURE);await c.frame(LAUNCH,10);still(c);
});
test('loop rejection/error preserves original departure until exact fallback; direct Skip fails safely',async()=>{
 const c=await controller({blocked:[FLIGHT]});await c.depart();await c.frame(DEPARTURE,ENTRY);assert.equal(c.phase(),'departure');assert.equal(c.node(DEPARTURE).paused,false);await c.event(DEPARTURE,'ended');still(c);
 const d=await controller();await d.depart();await d.event(FLIGHT,'error');assert.equal(d.phase(),'departure');await d.event(DEPARTURE,'ended');still(d);
 const e=await controller({blocked:[FLIGHT]});await e.click(SKIP);still(e);
 const f=await controller();await f.loop();await f.event(FLIGHT,'error');still(f);
});
test('skip loading timeout uses fallback, and pending promises cannot stop a more recent replay',async()=>{
 const c=await controller();let resolve;c.pending.set(FLIGHT,new Promise(r=>resolve=r));await c.click(SKIP);await c.timeout();still(c);resolve();await c.flush();still(c);
 const d=await controller();let release;d.pending.set(FLIGHT,new Promise(r=>release=r));await d.click(SKIP);await d.click(REPLAY);d.pending.clear();await d.click(SKIP);await d.frame(FLIGHT,0);assert.equal(d.phase(),'loop');release();await d.flush();assert.equal(d.node(FLIGHT).paused,false);
});
test('legacy frame scheduler matches entry and stops once native looping begins or motion is paused',async()=>{
 const c=await controller({legacy:true});c.node(LAUNCH).currentTime=10;await c.raf();assert.equal(c.phase(),'departure');
 c.node(DEPARTURE).currentTime=ENTRY;await c.raf();await c.raf();c.node(DEPARTURE).currentTime=ENTRY+.13;await c.raf();assert.equal(c.phase(),'loop');noCallbacks(c);
 await c.click(PAUSE);allPaused(c);noCallbacks(c);
});
test('a delayed departure after launch ends never restarts launch during pause/resume',async()=>{
 const c=await controller();c.node(LAUNCH).ended=true;c.node(LAUNCH).paused=true;await c.event(LAUNCH,'ended');assert.equal(c.phase(),'launch');await c.frame(DEPARTURE,0);assert.equal(c.phase(),'departure');
 const calls=c.node(LAUNCH).playCalls;await c.click(PAUSE);await c.click(PAUSE);assert.equal(c.node(LAUNCH).playCalls,calls);assert.equal(c.node(LAUNCH).paused,true);
});
test('loading watchdog re-arms after hiding instead of leaving a pending Skip or stalled launch forever',async()=>{
 const c=await controller();c.pending.set(FLIGHT,new Promise(()=>{}));await c.click(SKIP);await c.view(false);await c.timeout();assert.equal(c.phase(),'loading-loop');
 await c.view(true);await c.timeout();still(c);
 const d=await controller();d.node(LAUNCH).readyState=1;await d.event(LAUNCH,'waiting');await d.timeout();still(d);
});
test('natural handoff seeks with playback clocks and accepts matching decoded frames despite callback latency',async()=>{
 const c=await controller();await c.depart();
 await c.frame(DEPARTURE,ENTRY,{playhead:ENTRY+.125,now:1000});
 assert.equal(c.node(FLIGHT).currentTime,.125,'Initial seek follows the live departure clock, not delayed metadata');
 const seeks=c.node(FLIGHT).seekCalls;
 await c.frame(DEPARTURE,ENTRY+1/24,{playhead:ENTRY+1/24+.125,now:1020});
 await c.frame(FLIGHT,1/24,{playhead:1/24+.125,now:1020});
 assert.equal(c.node(FLIGHT).seekCalls,seeks,'Matching clock and decoded-frame pairs do not trigger a false seek');
 assert.equal(c.node(FLIGHT).style.opacity,'1');
 await c.frame(DEPARTURE,ENTRY+1/24+.13,{now:1050});assert.equal(c.phase(),'loop');
});
test('captured Mac 132ms startup lag is corrected without user input or accepting a stale pre-seek frame',async()=>{
 const c=await controller();await c.depart();await c.frame(DEPARTURE,ENTRY,{now:980});
 await c.frame(DEPARTURE,167/24,{playhead:6.9827,now:1000});
 const seeks=c.node(FLIGHT).seekCalls;
 await c.frame(FLIGHT,1/24,{playhead:.017,now:1000});
 assert.equal(c.node(FLIGHT).seekCalls,seeks+1);
 assert(Math.abs(c.node(FLIGHT).currentTime-(6.9827-ENTRY))<1e-9);
 assert.equal(c.node(FLIGHT).style.opacity,'0','The seek itself cannot expose an undecoded frame');
 await c.frame(DEPARTURE,7,{playhead:7.025,now:1033});
 await c.frame(FLIGHT,1/24,{playhead:7.025-ENTRY,now:1033});
 assert.equal(c.node(FLIGHT).style.opacity,'0','Old metadata cannot pass after seek just because clocks align');
 await c.frame(FLIGHT,4/24,{playhead:7.025-ENTRY,now:1050});
 assert.equal(c.node(FLIGHT).style.opacity,'1');
 await c.frame(DEPARTURE,7.13,{now:1070});assert.equal(c.phase(),'loop');
});
test('widely separated or stale presentation samples never prove decoded-frame alignment',async()=>{
 const c=await controller();await c.depart();await c.frame(DEPARTURE,ENTRY,{now:1000});
 await c.frame(FLIGHT,0,{now:1200});assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.frame(DEPARTURE,ENTRY,{now:1200,displayAt:1000});assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.frame(DEPARTURE,ENTRY,{now:1210});assert.equal(c.node(FLIGHT).style.opacity,'1');
 await c.frame(DEPARTURE,ENTRY+.13,{now:1240});assert.equal(c.phase(),'loop');
});
test('pause invalidates decoded samples and resume waits for a fresh loop frame',async()=>{
 const c=await controller();await c.depart();await c.frame(DEPARTURE,ENTRY,{now:1000});
 await c.frame(FLIGHT,0,{now:1200});assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.click(PAUSE);await c.click(PAUSE);
 await c.frame(DEPARTURE,ENTRY,{now:1210});assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.frame(FLIGHT,0,{now:1220});assert.equal(c.node(FLIGHT).style.opacity,'1');
});
test('metadata-free scheduler corrects the 125ms gap and waits for a ready non-seeking frame',async()=>{
 const c=await controller({legacy:true});c.node(LAUNCH).currentTime=10;await c.raf();
 c.node(DEPARTURE).currentTime=ENTRY;await c.raf();
 c.node(DEPARTURE).currentTime=ENTRY+.125;c.node(FLIGHT).currentTime=0;
 c.node(FLIGHT).seeking=true;await c.raf();assert.equal(c.node(FLIGHT).style.opacity,'0');
 c.node(FLIGHT).seeking=false;c.node(FLIGHT).readyState=1;await c.raf();assert.equal(c.node(FLIGHT).style.opacity,'0');
 c.node(FLIGHT).readyState=4;await c.raf();assert.equal(c.node(FLIGHT).currentTime,.125);
 assert.equal(c.node(FLIGHT).style.opacity,'1');
 c.node(DEPARTURE).currentTime=ENTRY+.26;c.node(FLIGHT).currentTime=.26;await c.raf();assert.equal(c.phase(),'loop');
});

test('successors explicitly buffer after successful launch without preroll or requests on static visits',async()=>{
 let release;const c=await controller({pending:[[LAUNCH,new Promise(resolve=>release=resolve)]]});
 for(const s of [DEPARTURE,FLIGHT]){assert.equal(c.node(s).loadCalls,0);assert.equal(c.node(s).preload,'none');assert.equal(c.node(s).playCalls,0);}
 release();await c.flush();
 for(const s of [DEPARTURE,FLIGHT]){assert.equal(c.node(s).preload,'auto');assert.equal(c.node(s).loadCalls,1);assert.equal(c.node(s).playCalls,0);assert.equal(c.node(s).currentTime,0);}
 for(const options of [{reduced:true},{saveData:true},{hash:'#pilot'},{blocked:[LAUNCH]}]){
  const d=await controller(options);
  for(const s of [DEPARTURE,FLIGHT]){assert.equal(d.node(s).loadCalls,0);assert.equal(d.node(s).preload,'none');assert.equal(d.node(s).src,undefined);}
 }
});
test('departure play resolution cannot reveal an undecoded or still-seeking frame',async()=>{
 const c=await controller();await c.frame(LAUNCH,241/24-.8);
 assert.equal(c.phase(),'launch');assert.equal(c.node(DEPARTURE).playCalls,1);assert.equal(c.node(DEPARTURE).style.opacity,'0');assert.equal(c.node(LAUNCH).style.opacity,'1');
 c.node(DEPARTURE).seeking=true;await c.frame(DEPARTURE,0);assert.equal(c.phase(),'launch');
 c.node(DEPARTURE).seeking=false;c.node(DEPARTURE).readyState=1;await c.frame(DEPARTURE,0);assert.equal(c.phase(),'launch');
 c.node(DEPARTURE).readyState=4;await c.frame(DEPARTURE,.1);assert.equal(c.phase(),'departure');
 assert.equal(+c.node(LAUNCH).style.opacity,1-(.125*.125*(3-2*.125)),'Dissolve uses the decoded source time, not a new wall-clock timer');
 await c.frame(DEPARTURE,.4);assert.equal(+c.node(LAUNCH).style.opacity,.5);
 await c.frame(DEPARTURE,.8);assert.equal(+c.node(LAUNCH).style.opacity,0);assert.equal(c.node(LAUNCH).paused,true);
});
test('a decoded departure waits for pending play to settle before beginning the unchanged dissolve',async()=>{
 const c=await controller();let release;c.pending.set(DEPARTURE,new Promise(resolve=>release=resolve));
 await c.frame(LAUNCH,241/24-.8);await c.frame(DEPARTURE,1/24);
 assert.equal(c.phase(),'launch');assert.equal(c.node(DEPARTURE).style.opacity,'0');
 release();await c.flush();assert.equal(c.phase(),'departure');assert.equal(c.node(DEPARTURE).currentTime,1/24);
 const progress=(1/24)/.8;assert.equal(+c.node(LAUNCH).style.opacity,1-progress*progress*(3-2*progress));
});
test('pending departure frames and play promises cannot reveal an old Replay attempt',async()=>{
 const c=await controller();let release;c.pending.set(DEPARTURE,new Promise(resolve=>release=resolve));
 await c.frame(LAUNCH,241/24-.8);const staleFrames=[...c.node(DEPARTURE).callbacks.values()];
 await c.click(REPLAY);c.pending.clear();await c.frame(LAUNCH,241/24-.8);
 const callbacks=c.node(DEPARTURE).callbacks.size;
 release();await c.flush();for(const fn of staleFrames)fn(1000,{mediaTime:.7,expectedDisplayTime:1000});await c.flush();
 assert.equal(c.phase(),'launch');assert.equal(c.node(DEPARTURE).style.opacity,'0');assert.equal(c.node(DEPARTURE).callbacks.size,callbacks,'Old callback cannot consume the new frame subscription');
 await c.frame(DEPARTURE,0);assert.equal(c.phase(),'departure');assert.equal(c.node(LAUNCH).style.opacity,'1');
 const d=await controller();let finish;d.pending.set(DEPARTURE,new Promise(resolve=>finish=resolve));await d.frame(LAUNCH,241/24-.8);const cancelled=[...d.node(DEPARTURE).callbacks.values()];
 await d.click(SKIP);await d.frame(FLIGHT,0);assert.equal(d.phase(),'loop');finish();await d.flush();for(const fn of cancelled)fn(2000,{mediaTime:.4});await d.flush();
 assert.equal(d.phase(),'loop');assert.equal(d.node(DEPARTURE).paused,true);assert.equal(d.node(DEPARTURE).style.opacity,'0');
});
test('pending departure honors pause, offscreen, hidden and bfcache and resumes only on a new frame',async()=>{
 for(const lifecycle of ['manual','offscreen','hidden','bfcache']){
  const c=await controller();await c.frame(LAUNCH,241/24-.8);c.node(DEPARTURE)._currentTime=.1;
  const staleFrames=[...c.node(DEPARTURE).callbacks.values()];
  if(lifecycle==='manual')await c.click(PAUSE);
  if(lifecycle==='offscreen')await c.view(false);
  if(lifecycle==='hidden'){c.document.hidden=true;await c.document.events.visibilitychange();}
  if(lifecycle==='bfcache'){c.window.events.pagehide();await c.flush();}
  allPaused(c);noCallbacks(c);await c.timeout();assert.equal(c.phase(),'launch');
  if(lifecycle==='manual')await c.click(PAUSE);
  if(lifecycle==='offscreen')await c.view(true);
  if(lifecycle==='hidden'){c.document.hidden=false;await c.document.events.visibilitychange();}
  if(lifecycle==='bfcache'){await c.window.events.pageshow({persisted:true});}
  for(const fn of staleFrames)fn(1000,{mediaTime:.1});await c.flush();
  assert.equal(c.phase(),'launch');assert.equal(c.node(DEPARTURE).currentTime,.1);assert.equal(c.node(DEPARTURE).paused,false);
  await c.frame(DEPARTURE,.125);assert.equal(c.phase(),'departure');
 }
});
test('an interrupted departure play rejection preserves the pending handoff for Resume',async()=>{
 const c=await controller();let reject;c.pending.set(DEPARTURE,new Promise((resolve,r)=>reject=r));
 await c.frame(LAUNCH,241/24-.8);await c.click(PAUSE);reject(Error('AbortError: play interrupted by pause'));await c.flush();
 assert.equal(c.phase(),'launch');allPaused(c);c.pending.clear();await c.click(PAUSE);assert.equal(c.phase(),'launch');
 await c.frame(DEPARTURE,0);assert.equal(c.phase(),'departure');
});
test('missing departure frames fall back after the bounded watchdog, including after lifecycle resume',async()=>{
 for(const interrupted of [false,true]){
  const c=await controller();await c.frame(LAUNCH,241/24-.8);
  if(interrupted){await c.view(false);await c.timeout();assert.equal(c.phase(),'launch');await c.view(true);}
  await c.timeout();still(c);
 }
 const c=await controller();let release;c.pending.set(DEPARTURE,new Promise(resolve=>release=resolve));await c.frame(LAUNCH,241/24-.8);
 await c.timeout();still(c);release();await c.flush();still(c);
});
test('delayed native loop play still needs fresh matching decoded frames after its bounded correction',async()=>{
 const c=await controller();await c.depart();let release;c.pending.set(FLIGHT,new Promise(resolve=>release=resolve));
 await c.frame(DEPARTURE,ENTRY,{now:1000});await c.frame(FLIGHT,0,{now:1000});
 await c.frame(DEPARTURE,ENTRY+.125,{now:1125});assert.equal(c.node(FLIGHT).style.opacity,'0');
 release();await c.flush();assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.frame(DEPARTURE,ENTRY+.125,{now:1125});assert.equal(c.node(FLIGHT).currentTime,.125);assert.equal(c.node(FLIGHT).style.opacity,'0');
 await c.frame(FLIGHT,0,{now:1125,playhead:.125});assert.equal(c.node(FLIGHT).style.opacity,'0','A stale pre-seek frame cannot pass merely because the clocks now match');
 await c.frame(FLIGHT,.125,{now:1140});assert.equal(c.node(FLIGHT).style.opacity,'1');
 await c.frame(DEPARTURE,ENTRY+.255,{now:1270});assert.equal(c.phase(),'loop');
});
test('Resume after launch ends resumes its pending departure without restarting launch or seeking',async()=>{
 const c=await controller();await c.frame(LAUNCH,241/24-.8);c.node(LAUNCH).ended=true;c.node(LAUNCH).paused=true;await c.event(LAUNCH,'ended');
 c.node(DEPARTURE)._currentTime=.1;const seeks=c.node(DEPARTURE).seekCalls,calls=c.node(LAUNCH).playCalls;
 await c.click(PAUSE);await c.click(PAUSE);
 assert.equal(c.node(LAUNCH).playCalls,calls);assert.equal(c.node(LAUNCH).paused,true);assert.equal(c.node(DEPARTURE).paused,false);assert.equal(c.node(DEPARTURE).seekCalls,seeks);
 await c.frame(DEPARTURE,.125);assert.equal(c.phase(),'departure');
});
