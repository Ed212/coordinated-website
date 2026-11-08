const root=document.querySelector('.launch-preview');
const layer=document.querySelector('.flight-animation');
const launch=document.querySelector('#launch-intro-video');
const departure=document.querySelector('#departure-video');
const ambient=document.querySelector('.flight-ambient');
const controls=document.querySelector('.flight-controls');
const replay=document.querySelector('[data-flight-replay]');
const skip=document.querySelector('[data-flight-skip]');
const pause=document.querySelector('[data-flight-pause]');
const still=document.querySelector('[data-flight-still]');
const status=document.querySelector('.flight-status');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const settleAt=Number(departure.dataset.settleAt);
let phase='still',run=0,manualPause=false,inView=true,startingDeparture=false,timeout,raf;
const moving=()=>phase!=='still'&&!manualPause&&!preference.matches&&!document.hidden&&inView;
function phaseTo(next){phase=next;root.dataset.flightPhase=next;root.dataset.launchState=next;}
function setPausedState(){root.dataset.motionPaused=String(!moving());pause.textContent=manualPause?'Resume motion':'Pause motion';}
function pauseAll(){launch.pause();departure.pause();setPausedState();}
async function syncMotion(){
 setPausedState();if(!moving()){launch.pause();departure.pause();return;}
 try{if(phase==='launch'){if(launch.ended)await beginDeparture();else await launch.play();}else if(phase==='departure')await departure.play();}catch{showStill();}
}
function load(v){if(!v.src){v.src=v.dataset.src;v.load();}}
function showStill(){run++;clearTimeout(timeout);phaseTo('still');manualPause=false;launch.pause();departure.pause();layer.hidden=true;root.classList.remove('flight-settled');controls.hidden=preference.matches;skip.hidden=true;replay.hidden=false;pause.hidden=true;still.hidden=true;status.textContent='Still image';setPausedState();}
function settle(reason='complete',focus=false){
 clearTimeout(timeout);startingDeparture=false;phaseTo('ambient');launch.pause();departure.pause();
 launch.style.opacity='0';departure.style.opacity='0';ambient.style.opacity='1';layer.hidden=false;root.classList.add('flight-settled');
 skip.hidden=true;replay.hidden=false;pause.hidden=false;still.hidden=false;status.textContent=reason==='skipped'?'Ambient space':'A quiet view of deep space';setPausedState();
 if(focus)replay.focus({preventScroll:true});
}
async function beginDeparture(){
 if(startingDeparture||phase!=='launch')return;startingDeparture=true;const attempt=run;
 load(departure);departure.currentTime=0;departure.playbackRate=1;
 try{
  await departure.play();if(attempt!==run){departure.pause();return;}
  if(manualPause||document.hidden||!inView){departure.pause();startingDeparture=false;return;}
  clearTimeout(timeout);phaseTo('departure');departure.style.opacity='1';launch.style.opacity='0';launch.pause();status.textContent='Leaving Earth behind';setPausedState();
 }catch{if(attempt===run)showStill();}
}
async function start(){
 if(preference.matches){showStill();return;}
 const attempt=++run;clearTimeout(timeout);manualPause=false;startingDeparture=false;
 launch.pause();departure.pause();launch.currentTime=0;departure.currentTime=0;departure.playbackRate=1;
 ambient.style.opacity='0';departure.style.opacity='0';launch.style.opacity='1';layer.hidden=false;root.classList.remove('flight-settled');
 controls.hidden=false;replay.hidden=true;skip.hidden=false;pause.hidden=false;still.hidden=false;
 phaseTo('launch');status.textContent='Launch';setPausedState();load(launch);
 timeout=setTimeout(()=>{if(attempt===run&&launch.paused)showStill();},5000);
 try{await launch.play();if(attempt!==run){launch.pause();return;}clearTimeout(timeout);load(departure);if(!moving())launch.pause();}catch{if(attempt===run)showStill();}
}
function update(v,t){
 if(!moving())return;
 if(v===launch&&phase==='launch'&&t>=launch.duration-.15&&departure.readyState>=2)beginDeparture();
 if(v===departure&&phase==='departure'){
  // Decelerate the actual camera motion, then retain its exact final composition.
  const startSlow=Math.max(0,settleAt-2.5),p=Math.max(0,Math.min(1,(t-startSlow)/(settleAt-startSlow)));
  departure.playbackRate=1-.72*(p*p*(3-2*p));
  if(t>=settleAt-.001)settle();
 }
}
function followFrames(v){if('requestVideoFrameCallback'in v){v.requestVideoFrameCallback(function tick(_,meta){update(v,meta.mediaTime);v.requestVideoFrameCallback(tick);});}}
followFrames(launch);followFrames(departure);
if(!('requestVideoFrameCallback'in launch)){const frame=()=>{update(launch,launch.currentTime);update(departure,departure.currentTime);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);}
launch.addEventListener('ended',()=>{if(phase==='launch'){status.textContent='Continuing into space';beginDeparture();timeout=setTimeout(()=>{if(phase==='launch')showStill();},6000);}});
departure.addEventListener('ended',()=>{if(phase==='departure')settle();});
launch.addEventListener('error',()=>{if(phase==='launch')showStill();});
departure.addEventListener('error',()=>{if(phase==='departure')showStill();});
pause.addEventListener('click',()=>{manualPause=!manualPause;syncMotion();});
skip.addEventListener('click',()=>{run++;manualPause=false;settle('skipped',true);});
replay.addEventListener('click',()=>{start();skip.focus({preventScroll:true});});
still.addEventListener('click',()=>{showStill();if(!controls.hidden)replay.focus({preventScroll:true});});
preference.addEventListener('change',()=>{if(preference.matches)showStill();else controls.hidden=false;});
document.addEventListener('visibilitychange',syncMotion);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:.02}).observe(document.querySelector('.hero'));
window.addEventListener('pagehide',()=>{launch.pause();departure.pause();cancelAnimationFrame(raf);});
window.addEventListener('pageshow',e=>{if(e.persisted)syncMotion();});
if(preference.matches||navigator.connection?.saveData||location.hash)showStill();else start();
