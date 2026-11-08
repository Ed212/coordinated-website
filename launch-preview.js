const root = document.querySelector('.launch-preview');
const intro = document.querySelector('.launch-intro');
const video = document.querySelector('#launch-intro-video');
const heroCopy = [...document.querySelectorAll('.hero-copy, .hero-product')];
const galaxyLayer = document.querySelector('.hero-galaxy-motion');
const galaxies = [...document.querySelectorAll('.hero-galaxy-motion video')];
const controls = document.querySelector('.hero-motion-controls');
const replay = document.querySelector('.launch-replay');
const pause = document.querySelector('[data-launch-pause]');
const skip = document.querySelector('[data-launch-skip]');
const stillButtons = [...document.querySelectorAll('[data-motion-still]')];
const galaxyPause = document.querySelector('[data-galaxy-pause]');
const status = document.querySelector('.launch-status');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let timer, deadline, completed = false, run = 0, allowGalaxy = false, manualPause = false;
let galaxyUnavailable = false;
let current = 0, mixing = false, mixStart = 0, loopCount = 0, inView = true, animation;
const active = () => root.hasAttribute('data-launch-active');
const canAnimate = () => allowGalaxy && !manualPause && !preference.matches && !document.hidden && inView;
function setHeroAccessible(on) { for (const el of heroCopy) { el.inert = !on; if(on)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden','true'); } }
function pauseGalaxies() { galaxies.forEach(v => v.pause()); }
function loadGalaxies() { for(const v of galaxies) if(!v.src) {v.src=v.dataset.src;v.load();} }
async function playGalaxies() {
 if(!canAnimate()||galaxyUnavailable)return;
 loadGalaxies();
 try {
  await galaxies[current].play();
  if(!canAnimate()) {pauseGalaxies();return;}
  if(mixing) await galaxies[1-current].play();
  galaxyLayer.hidden=false; root.dataset.galaxyMotion='playing';
  galaxyPause.textContent='Pause galaxy';
 } catch { stopGalaxies(); }
}
function stopGalaxies() {
 allowGalaxy=false;pauseGalaxies();galaxyLayer.hidden=true;
 root.dataset.galaxyMotion='still';galaxyPause.textContent='Play galaxy';
}
function showHero(reason = 'complete', moveFocus = false, motion = true) {
 run += 1; clearTimeout(deadline); clearTimeout(timer); video.pause();
 completed=true;root.dataset.launchState='revealing';root.classList.add('product-line');
 setHeroAccessible(true);controls.hidden=preference.matches;
 if(motion&&!preference.matches&&!navigator.connection?.saveData) {allowGalaxy=true;manualPause=false;playGalaxies();}
 else stopGalaxies();
 if(moveFocus&&!controls.hidden)replay.focus({preventScroll:true});
 const finish=()=>{intro.hidden=true;delete root.dataset.launchActive;root.dataset.launchState=reason;};
 if(preference.matches||['error','autoplay-blocked','still','reduced-motion'].includes(reason))finish();
 else timer=setTimeout(finish,1000);
}
async function start() {
 if(preference.matches){showHero('reduced-motion',false,false);return;}
 const attempt=++run;clearTimeout(timer);clearTimeout(deadline);completed=false;
 stopGalaxies();current=0;mixing=false;manualPause=false;
 for(const [i,v] of galaxies.entries()){if(v.readyState)v.currentTime=0;v.style.opacity=i?'0':'1';}
 root.style.setProperty('--launch-opacity','1');root.classList.remove('product-line');intro.querySelector('h2').setAttribute('aria-label','Make your go-to-market move at the speed of your launch.');
 intro.hidden=false;controls.hidden=true;root.dataset.launchActive='';root.dataset.launchState='loading';setHeroAccessible(false);
 pause.textContent='Pause';status.textContent='Loading launch…';
 if(!video.src)video.src=video.dataset.src;video.currentTime=0;
 deadline=setTimeout(()=>{if(attempt===run&&video.paused)showHero('error',false,false);},4500);
 try {
  await video.play();if(attempt!==run||completed){video.pause();return;}
  clearTimeout(deadline);root.dataset.launchState='playing';status.textContent='Launch → product → a living galaxy';
  loadGalaxies();
 }catch{if(attempt===run)showHero('autoplay-blocked',false,false);}
}
function frame() {
 if(active()&&!completed) {
  const t=video.currentTime;
  if(t>=7.4&&!allowGalaxy&&!galaxyUnavailable&&!preference.matches){allowGalaxy=true;playGalaxies();}
  const progress=Math.max(0,Math.min(1,(t-7.8)/2.15));
  root.style.setProperty('--launch-opacity',String(1-(progress*progress*(3-2*progress))));
  if(t>=8.15){root.classList.add('product-line');intro.querySelector('h2').setAttribute('aria-label','Make your go-to-market move at the speed of your product.');}
 }
 if(canAnimate()&&!galaxyLayer.hidden) {
  const from=galaxies[current],to=galaxies[1-current];
  if(!mixing&&Number.isFinite(from.duration)&&from.currentTime>=from.duration-.8) {
   mixing=true;mixStart=from.currentTime;to.currentTime=0;to.style.opacity='0';to.play().catch(()=>stopGalaxies());
  }
  if(mixing) {
   const p=Math.max(0,Math.min(1,(from.currentTime-mixStart)/.72));
   to.style.opacity=String(p);from.style.opacity=String(1-p);
   if(p>=1||from.ended){from.pause();from.currentTime=0;from.style.opacity='0';to.style.opacity='1';current=1-current;mixing=false;loopCount++;root.dataset.galaxyLoops=String(loopCount);}
  }
 }
 animation=requestAnimationFrame(frame);
}
pause.addEventListener('click',async()=>{
 if(!active()||completed)return;
 if(!video.paused){video.pause();pauseGalaxies();manualPause=true;pause.textContent='Resume';root.dataset.launchState='paused';status.textContent='Paused';}
 else {try{await video.play();if(completed){video.pause();return;}manualPause=false;playGalaxies();pause.textContent='Pause';root.dataset.launchState='playing';status.textContent='Launch → product → a living galaxy';}catch{showHero('error',true,false);}}
});
skip.addEventListener('click',()=>showHero('skipped',true));
replay.addEventListener('click',()=>{start();skip.focus({preventScroll:true});});
for(const button of stillButtons)button.addEventListener('click',()=>{manualPause=true;showHero('still',intro.contains(button),false);});
galaxyPause.addEventListener('click',()=>{
 if(allowGalaxy&&!manualPause){manualPause=true;pauseGalaxies();root.dataset.galaxyMotion='paused';galaxyPause.textContent='Resume galaxy';}
 else{allowGalaxy=true;manualPause=false;playGalaxies();}
});
video.addEventListener('ended',()=>{if(!completed)showHero('complete',intro.contains(document.activeElement));});
video.addEventListener('error',()=>{if(!completed)showHero('error',intro.contains(document.activeElement),false);});
for(const v of galaxies)v.addEventListener('error',()=>{galaxyUnavailable=true;stopGalaxies();});
preference.addEventListener('change',()=>{if(preference.matches)showHero('reduced-motion',false,false);else controls.hidden=false;});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){pauseGalaxies();if(active()&&!video.paused&&!completed){video.pause();manualPause=true;pause.textContent='Resume';root.dataset.launchState='paused';status.textContent='Paused while this tab is hidden';}}
 else if(!active())playGalaxies();
});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)pauseGalaxies();else if(!active())playGalaxies();},{threshold:.02}).observe(document.querySelector('.hero'));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{if(active())showHero('skipped');}));
window.addEventListener('pagehide',()=>{cancelAnimationFrame(animation);video.pause();pauseGalaxies();});
window.addEventListener('pageshow',e=>{if(e.persisted){animation=requestAnimationFrame(frame);if(!active())playGalaxies();}});
animation=requestAnimationFrame(frame);
if(preference.matches||navigator.connection?.saveData||location.hash)showHero(preference.matches?'reduced-motion':'still',false,false);else start();
