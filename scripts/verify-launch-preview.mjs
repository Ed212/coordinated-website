import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4197';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
const out='preview-review/wide-launch';
const title='Make your go-to-market move at the speed of your product.';
await mkdir(out,{recursive:true});
const phase=(p,v,timeout=40000)=>p.waitForFunction(v=>document.body.dataset.flightPhase===v,v,{timeout});
const paused=p=>p.locator('.flight-scene video').evaluateAll(v=>v.every(e=>e.paused));
async function checkStill(p){assert(await p.locator('.hero-copy').isVisible());assert.equal(await p.locator('#hero-title').innerText(),title);assert(await p.locator('.flight-animation').isHidden());assert(await paused(p));}
async function journey(width){
 const p=await browser.newPage({viewport:{width,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
 await p.goto(base+'/launch-preview.html');await phase(p,'launch');
 const box=await p.locator('#hero-title').boundingBox();
 assert.equal(await p.locator('#hero-title').innerText(),title);assert.equal(await p.locator('.hero-copy').evaluate(e=>e.inert),false);
 assert(await p.locator('.hero-copy a').first().isVisible());
 await p.locator('[data-flight-pause]').click();assert(await paused(p));
 await p.screenshot({path:`${out}/continuous-opening-${width}.png`});
 await p.locator('[data-flight-pause]').click();await phase(p,'departure');
 assert.deepEqual(await p.locator('#hero-title').boundingBox(),box);
 await p.screenshot({path:`${out}/continuous-orbit-${width}.png`});
 await p.locator('[data-flight-pause]').click();assert(await paused(p));await p.locator('[data-flight-pause]').click();
 await phase(p,'ambient');assert.deepEqual(await p.locator('#hero-title').boundingBox(),box);
 assert(await paused(p));assert.equal(await p.locator('.flight-ambient').evaluate(e=>getComputedStyle(e).opacity),'1');
 await p.screenshot({path:`${out}/continuous-settled-${width}.png`});
 await p.locator('[data-flight-pause]').click();assert.equal(await p.locator('.flight-ambient img').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
 await p.waitForTimeout(100);const a=await p.locator('.flight-ambient img').evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(400);assert.equal(await p.locator('.flight-ambient img').evaluate(e=>getComputedStyle(e).transform),a);
 await p.locator('[data-flight-pause]').click();
 await p.locator('#pilot').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.body.dataset.motionPaused==='true');
 await p.evaluate(()=>scrollTo(0,0));await p.waitForFunction(()=>document.body.dataset.motionPaused==='false');
 if(width===1440&&process.env.CHECK_AMBIENT_CYCLES==='1'){
  const start=await p.locator('.flight-ambient img').evaluate(e=>e.getAnimations()[0].currentTime);
  for(const ms of [16000,16000,16000,16000]){await p.waitForTimeout(ms);assert.equal(await p.locator('.flight-ambient img').evaluate(e=>getComputedStyle(e).animationPlayState),'running');}
  const end=await p.locator('.flight-ambient img').evaluate(e=>e.getAnimations()[0].currentTime);assert(end-start>=63000);results.push({ambientDurationObserved:end-start,twoCompleteDriftCycles:true});
 }
 await p.locator('[data-flight-still]').click();await phase(p,'still');await checkStill(p);
 await p.locator('[data-flight-replay]').click();await phase(p,'launch');await p.locator('[data-flight-skip]').click();await phase(p,'ambient');assert(await p.locator('[data-flight-replay]').evaluate(e=>document.activeElement===e));
 await p.locator('[data-flight-replay]').click();await p.emulateMedia({reducedMotion:'reduce'});await phase(p,'still');await checkStill(p);assert(await p.locator('.flight-controls').isHidden());
 await p.emulateMedia({reducedMotion:'no-preference'});await checkStill(p);
 assert(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1));
 const cls=await p.evaluate(()=>window.__cls);assert(cls<.02,`CLS ${cls}`);assert.deepEqual(errors,[]);
 results.push({width,realTwoShotPlayback:true,stationaryHeadlineAndCTA:true,pauseResumeAllPhases:true,ambientOffscreenPauseResume:true,skipReplayStill:true,reducedMotionChange:true,cls,errors});await p.close();
}
try{
 await Promise.all([journey(390),journey(1440)]);
 for(const mode of ['reduced','no-js','launch-failed','autoplay-blocked','hash','save-data','departure-failed']){
  const p=await browser.newPage({javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),media=[];
  p.on('request',r=>{if(r.url().endsWith('.mp4'))media.push(r.url())});
  if(mode==='launch-failed')await p.route('**/wide-shuttle-launch.mp4',r=>r.abort());
  if(mode==='departure-failed')await p.route('**/deep-space-continuation.mp4',r=>r.abort());
  if(mode==='autoplay-blocked')await p.addInitScript(()=>HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError')));
  if(mode==='save-data')await p.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true}}));
  await p.goto(base+'/launch-preview.html'+(mode==='hash'?'#moments':''));
  if(mode!=='no-js')await phase(p,'still');await checkStill(p);
  if(['reduced','no-js','hash','save-data'].includes(mode))assert.equal(media.length,0,`Unexpected media ${mode}`);
  results.push({mode,staticFallback:true,mediaRequests:media.length});await p.close();
 }
 for(const width of [320,375,768,1024,1920]){
  const p=await browser.newPage({viewport:{width,height:1000}});await p.goto(base+'/launch-preview.html');await phase(p,'launch');
  assert(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1),`Overflow ${width}`);
  assert(await p.locator('.flight-controls').evaluate(e=>{let r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}));
  await p.locator('[data-flight-skip]').click();await phase(p,'ambient');assert(await p.locator('#hero-title').isVisible());
  results.push({width,responsive:true});await p.close();
 }
 const p=await browser.newPage();await p.goto(base+'/');assert.equal(await p.locator('.flight-scene').count(),0);assert.equal(await p.locator('#hero-title').innerText(),'Turn product momentum into market growth.');results.push({ordinaryHomepageUnchanged:true});
 await writeFile(`${out}/continuous-checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
