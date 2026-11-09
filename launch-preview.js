import { prepareJourney, advanceSpaceTime } from './solar-journey.js';
const root=document.querySelector('.launch-preview');
const layer=document.querySelector('.flight-animation');
const launch=document.querySelector('#launch-intro-video');
const departure=document.querySelector('#departure-video');
const ambient=document.querySelector('.flight-ambient');
const bridge=document.querySelector('.flight-bridge');
let journey,preparing,bridgeTime=0,previousFrame=null;
function prepare(){return preparing??=prepareJourney(bridge).then(value=>{journey=value;return value;});}
const controls=document.querySelector('.flight-controls');
const replay=document.querySelector('[data-flight-replay]');
const skip=document.querySelector('[data-flight-skip]');
const pause=document.querySelector('[data-flight-pause]');
const status=document.querySelector('.flight-status');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const settleAt=Number(departure.dataset.settleAt);
const handoffDuration=.8;
const smooth=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
let phase='still',run=0,manualPause=false,inView=true,startingDeparture=false,timeout,raf;
const moving=()=>phase!=='still'&&!manualPause&&!preference.matches&&!document.hidden&&inView;
function phaseTo(next){phase=next;root.dataset.flightPhase=next;root.dataset.launchState=next;}
function setPausedState(){root.dataset.motionPaused=String(!moving());pause.textContent=manualPause?'Resume motion':'Pause motion';scheduleFrame();}
async function syncMotion(){
 previousFrame=null;setPausedState();if(!moving()){launch.pause();departure.pause();return;}
 try{if(phase==='launch'){if(launch.ended)await beginDeparture();else await launch.play();}else if(phase==='departure'){await departure.play();if(departure.currentTime<handoffDuration&&!launch.ended)await launch.play();}}catch{showStill();}
}
function load(v){if(!v.src){v.src=v.dataset.src;v.load();}}
function showStill(){run++;clearTimeout(timeout);phaseTo('still');manualPause=false;launch.pause();departure.pause();layer.hidden=true;root.classList.remove('flight-settled');controls.hidden=preference.matches;skip.hidden=true;replay.hidden=false;pause.hidden=true;status.textContent='Still image';setPausedState();}
function settle(reason='complete',focus=false){
 bridgeTime=0;previousFrame=null;bridge.style.opacity=journey?'1':'0';
 if(journey)journey.render(0);
 clearTimeout(timeout);startingDeparture=false;phaseTo('ambient');launch.pause();departure.pause();
 launch.style.opacity='0';departure.style.opacity='0';ambient.style.opacity='1';layer.hidden=false;root.classList.add('flight-settled');
 skip.hidden=true;replay.hidden=false;pause.hidden=false;status.textContent='Floating through space';setPausedState();
 const attempt=run;prepare().then(ready=>{if(attempt===run&&phase==='ambient'){ready.render(bridgeTime);bridge.style.opacity='1';scheduleFrame();}}).catch(()=>{if(attempt===run)showStill();});
 if(focus)replay.focus({preventScroll:true});
}
async function beginDeparture(){
 if(startingDeparture||phase!=='launch')return;startingDeparture=true;const attempt=run;
 load(departure);departure.currentTime=0;departure.playbackRate=1;
 try{
  await departure.play();if(attempt!==run){departure.pause();return;}
  if(!moving()){departure.pause();startingDeparture=false;return;}
  clearTimeout(timeout);phaseTo('departure');departure.style.opacity='1';launch.style.opacity='1';status.textContent='Leaving Earth behind';setPausedState();
 }catch{if(attempt===run)showStill();}
}
function beginBridge(){
 if(phase==='departure')settle();
}
// One scheduler for the canvas and older browsers' video-frame fallback.
// No animation frames are requested while hidden, offscreen, paused or still.
function scheduleFrame(){
 if(!moving()||('requestVideoFrameCallback'in launch&&(phase!=='ambient'||!journey))){if(raf)cancelAnimationFrame(raf);raf=null;previousFrame=null;return;}
 if(!raf)raf=requestAnimationFrame(animateBridge);
}
function animateBridge(now){
 raf=null;if(!moving()){previousFrame=null;return;}
 if(phase==='ambient'&&journey){
  bridgeTime=advanceSpaceTime(bridgeTime,previousFrame,now,true);
  journey.render(bridgeTime);previousFrame=now;
 }else previousFrame=null;
 if(!('requestVideoFrameCallback'in launch)){update(launch,launch.currentTime);update(departure,departure.currentTime);}
 scheduleFrame();
}
async function start(){
 if(preference.matches){showStill();return;}
 const attempt=++run;clearTimeout(timeout);manualPause=false;startingDeparture=false;bridgeTime=0;previousFrame=null;bridge.style.opacity='0';prepare().catch(()=>{});
 launch.pause();departure.pause();launch.currentTime=0;departure.currentTime=0;departure.playbackRate=1;
 ambient.style.opacity='0';departure.style.opacity='0';launch.style.opacity='1';layer.hidden=false;root.classList.remove('flight-settled');
 controls.hidden=false;replay.hidden=true;skip.hidden=false;pause.hidden=false;
 phaseTo('launch');status.textContent='Launch';setPausedState();load(launch);
 timeout=setTimeout(()=>{if(attempt===run&&launch.paused)showStill();},5000);
 try{await launch.play();if(attempt!==run){launch.pause();return;}clearTimeout(timeout);load(departure);if(!moving())launch.pause();}catch{if(attempt===run)showStill();}
}
function update(v,t){
 if(!moving())return;
 if(v===launch&&phase==='launch'&&t>=launch.duration-handoffDuration&&departure.readyState>=2)beginDeparture();
 if(v===departure&&phase==='departure'){
  // Dissolve matched frames while both clips move; never cut through black.
  launch.style.opacity=String(1-smooth(t/handoffDuration));
  if(t>=handoffDuration)launch.pause();
  // Decelerate the actual camera motion, then retain its exact final composition.
  const startSlow=Math.max(0,settleAt-1),p=Math.max(0,Math.min(1,(t-startSlow)/(settleAt-startSlow)));
  departure.playbackRate=1-.25*(p*p*(3-2*p));
  if(t>=settleAt-.001)beginBridge();
 }
}
function followFrames(v){if('requestVideoFrameCallback'in v){v.requestVideoFrameCallback(function tick(_,meta){update(v,meta.mediaTime);v.requestVideoFrameCallback(tick);});}}
followFrames(launch);followFrames(departure);

launch.addEventListener('ended',()=>{if(phase==='launch'){status.textContent='Continuing into space';beginDeparture();timeout=setTimeout(()=>{if(phase==='launch')showStill();},6000);}});
departure.addEventListener('ended',()=>{if(phase==='departure')beginBridge();});
launch.addEventListener('error',()=>{if(phase==='launch')showStill();});
departure.addEventListener('error',()=>{if(phase==='departure')showStill();});
pause.addEventListener('click',()=>{manualPause=!manualPause;syncMotion();});
skip.addEventListener('click',()=>{run++;manualPause=false;settle('skipped',true);});
replay.addEventListener('click',()=>{start();skip.focus({preventScroll:true});});
preference.addEventListener('change',()=>{if(preference.matches)showStill();else controls.hidden=false;});
document.addEventListener('visibilitychange',syncMotion);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:.02}).observe(document.querySelector('.hero'));
window.addEventListener('pagehide',()=>{launch.pause();departure.pause();if(raf)cancelAnimationFrame(raf);raf=null;previousFrame=null;});
window.addEventListener('pageshow',e=>{if(e.persisted)syncMotion();});
if(preference.matches||navigator.connection?.saveData||location.hash)showStill();else start();
