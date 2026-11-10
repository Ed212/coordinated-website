import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4197';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
const release=process.env.TEST_RELEASE==='1';
const path=process.env.TEST_PAGE||'/launch-preview.html';
const out=process.env.VERIFY_OUTPUT||'preview-review/wide-launch';
const title=release?'Launch fast. Learn what lands. Act on that learning.':'Make your go-to-market move at the speed of your product.';
await mkdir(out,{recursive:true});
const phase=(p,v,timeout=40000)=>p.waitForFunction(v=>document.body.dataset.flightPhase===v,v,{timeout});
const paused=p=>p.locator('.flight-scene video').evaluateAll(v=>v.every(e=>e.paused));
async function checkControls(p){assert.equal(await p.locator('[data-flight-still]').count(),0);assert.equal(await p.locator('.flight-controls button').count(),3);assert.equal(await p.locator('.flight-status').evaluate(e=>e.tagName),'SPAN');}
async function checkStill(p){await checkControls(p);assert(await p.locator('.hero-copy').isVisible());assert.equal(await p.locator('#hero-title').innerText(),title);assert(await p.locator('.flight-animation').isHidden());assert(await paused(p));const image=p.locator('.flight-fallback img');assert(await image.isVisible());assert.equal(await image.getAttribute('src'),'assets/video/deep-space-final-frame.png');assert(await image.evaluate(e=>e.complete&&e.naturalWidth===1280&&e.naturalHeight===720));assert.equal(await p.locator('.flight-scene .hero-galaxy,.flight-fallback source').count(),0);}
async function journey(width){
 const p=await browser.newPage({viewport:{width,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
 await p.goto(base+path);await phase(p,'launch');
 await checkControls(p);
 const box=await p.locator('#hero-title').boundingBox();
 assert.equal(await p.locator('#hero-title').innerText(),title);assert.equal(await p.locator('.hero-copy').evaluate(e=>e.inert),false);
 assert(await p.locator('.hero-copy a').first().isVisible());
 await p.locator('[data-flight-pause]').click();assert(await paused(p));
 await p.screenshot({path:`${out}/continuous-opening-${width}.png`});
 await p.locator('[data-flight-pause]').click();await phase(p,'departure');
 assert.deepEqual(await p.locator('#hero-title').boundingBox(),box);
 const dissolve=await p.waitForFunction(()=>{const launch=document.querySelector('#launch-intro-video'),departure=document.querySelector('#departure-video'),opacity=+getComputedStyle(launch).opacity;return opacity>0&&opacity<1&&departure.currentTime<.8?{opacity,departureTime:departure.currentTime}:false;},null,{timeout:5000});
 assert((await dissolve.jsonValue()).opacity>0,'Matched moving clips overlap during handoff');
 await p.screenshot({path:`${out}/continuous-orbit-${width}.png`});
 await p.locator('[data-flight-pause]').click();assert(await paused(p));await p.locator('[data-flight-pause]').click();
 await phase(p,'loop');assert.deepEqual(await p.locator('#hero-title').boundingBox(),box);
 assert.equal(await p.locator('#distant-flight-video').evaluate(e=>({paused:e.paused,loop:e.loop,rate:e.playbackRate})).then(v=>!v.paused&&v.loop&&v.rate===1),true);
 assert.equal(await p.locator('canvas,.flight-ambient').count(),0);
 await p.screenshot({path:`${out}/native-loop-${width}.png`});
 const time=()=>p.locator('#distant-flight-video').evaluate(e=>e.currentTime);
 await p.locator('[data-flight-pause]').click();const frozen=await time();await p.waitForTimeout(400);assert.equal(await time(),frozen);
 await p.locator('[data-flight-pause]').click();await p.waitForTimeout(200);assert.notEqual(await time(),frozen);
 await p.locator('#pilot').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.body.dataset.motionPaused==='true');
 const offscreen=await time();await p.waitForTimeout(400);assert.equal(await time(),offscreen);
 await p.evaluate(()=>scrollTo(0,0));await p.waitForFunction(()=>document.body.dataset.motionPaused==='false');
 if(width===1440){
  await p.evaluate(()=>{const v=document.querySelector('#distant-flight-video');let last=v.currentTime;window.__wraps=0;v.addEventListener('timeupdate',()=>{if(v.currentTime<last)window.__wraps++;last=v.currentTime;});});
  await p.waitForTimeout(11000);assert(await p.evaluate(()=>window.__wraps)>=3);
  assert.equal(await p.locator('body').getAttribute('data-flight-phase'),'loop');
  assert.equal(await p.locator('#distant-flight-video').evaluate(e=>e.paused),false);assert.equal(await p.locator('#launch-intro-video').evaluate(e=>e.paused),true);results.push({threeNativeWrapsObserved:true,noLaunchRestart:true});
 }
 await p.locator('[data-flight-replay]').click();await phase(p,'launch');await p.locator('[data-flight-skip]').click();await phase(p,'loop');assert(await p.locator('[data-flight-replay]').evaluate(e=>document.activeElement===e));
 await p.locator('[data-flight-replay]').click();await p.emulateMedia({reducedMotion:'reduce'});await phase(p,'still');await checkStill(p);assert(await p.locator('.flight-controls').isHidden());
 await p.emulateMedia({reducedMotion:'no-preference'});await checkStill(p);
 assert(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1));
 const cls=await p.evaluate(()=>window.__cls);assert(cls<.02,`CLS ${cls}`);assert.deepEqual(errors,[]);
 results.push({width,realTwoShotPlayback:true,stationaryHeadlineAndCTA:true,pauseResumeAllPhases:true,movingClipDissolve:true,nativeLoopOffscreenPauseResume:true,skipReplay:true,noStillImageButton:true,automaticStaticFallback:true,reducedMotionChange:true,cls,errors});await p.close();
}
try{
 await Promise.all([journey(390),journey(1440)]);
 for(const mode of ['reduced','no-js','launch-failed','autoplay-blocked','hash','save-data','departure-failed','loop-failed']){
  const p=await browser.newPage({javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),media=[],errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('request',r=>{if(r.url().endsWith('.mp4'))media.push(r.url())});
  if(mode==='loop-failed')await p.route('**/deployed-late-flight-loop-v2.mp4',r=>r.abort());
  if(mode==='launch-failed')await p.route('**/arc-appearance-edit-v2.mp4',r=>r.abort());
  if(mode==='departure-failed')await p.route('**/deep-space-continuation.mp4',r=>r.abort());
  if(mode==='autoplay-blocked')await p.addInitScript(()=>HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError')));
  if(mode==='save-data')await p.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true}}));
  await p.goto(base+path+(mode==='hash'?'#moments':''));
  if(mode!=='no-js')await phase(p,'still');await checkStill(p);
  if(['reduced','no-js'].includes(mode))assert(await p.locator('.flight-controls').isHidden());
  if(['reduced','no-js','hash','save-data'].includes(mode))assert.equal(media.length,0,`Unexpected media ${mode}`);
  assert.deepEqual(errors,[]);results.push({mode,staticFallback:true,exactFinalFrame:true,noStillImageButton:true,mediaRequests:media.length,errors});await p.close();
 }
 for(const width of [320,375,768,1024,1920]){
  const p=await browser.newPage({viewport:{width,height:1000}});await p.goto(base+path);await phase(p,'launch');
  assert(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1),`Overflow ${width}`);
  assert(await p.locator('.flight-controls').evaluate(e=>{let r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}));
  await p.locator('[data-flight-skip]').click();await phase(p,'loop');assert(await p.locator('#hero-title').isVisible());
  results.push({width,responsive:true});await p.close();
 }
 if(!release){const p=await browser.newPage();await p.goto(base+'/');assert.equal(await p.locator('.flight-scene').count(),0);assert.equal(await p.locator('#hero-title').innerText(),'Turn product momentum into market growth.');results.push({ordinaryHomepageUnchanged:true});await p.close();}
 await writeFile(`${out}/continuous-checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
