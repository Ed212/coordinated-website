import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4197';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
await mkdir('preview-review/wide-launch',{recursive:true});
for(const width of [390,1440]) {
 const page=await browser.newPage({viewport:{width,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
 await page.goto(base+'/launch-preview.html');
 await page.waitForFunction(()=>document.body.dataset.launchState==='playing');
 await page.locator('[data-launch-pause]').click();
 assert.equal(await page.locator('#launch-intro-video').evaluate(v=>v.paused),true);
 assert.equal(await page.locator('.launch-intro h2').getAttribute('aria-label'),'Make your go-to-market move at the speed of your launch.');
 assert.equal(await page.locator('.hero-copy').evaluate(e=>e.inert),true);
 assert(await page.locator('.launch-actions a').first().isVisible());
 assert(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1));
 await page.screenshot({path:`preview-review/wide-launch/opening-${width}.png`,fullPage:false});
 await page.locator('[data-launch-pause]').click();
 await page.waitForFunction(()=>document.getElementById('launch-intro-video').currentTime>=8.5);
 const transition=await page.evaluate(()=>({launchOpacity:+document.body.style.getPropertyValue('--launch-opacity'),productLine:document.body.classList.contains('product-line'),galaxyTime:document.querySelector('.hero-galaxy-motion video').currentTime}));
 assert(transition.launchOpacity>0&&transition.launchOpacity<1);assert(transition.productLine);assert(transition.galaxyTime>0);
 await page.screenshot({path:`preview-review/wide-launch/emerging-${width}.png`,fullPage:false});
 await page.waitForFunction(()=>document.body.dataset.launchState==='complete',null,{timeout:20000});
 assert.equal(await page.locator('.hero-copy').evaluate(e=>e.inert),false);
 assert.equal(await page.locator('#hero-title').innerText(),'Make your go-to-market move at the speed of your product.');
 assert(await page.locator('.hero-motion-controls').isVisible());
 await page.screenshot({path:`preview-review/wide-launch/galaxy-${width}.png`,fullPage:false});
 await page.waitForFunction(()=>+document.body.dataset.galaxyLoops>=1,null,{timeout:20000});
 const playing=await page.locator('.hero-galaxy-motion video').evaluateAll(v=>v.some(e=>!e.paused&&e.currentTime>0));assert(playing,'Galaxy continues after loop');
 await page.locator('[data-galaxy-pause]').click();assert(await page.locator('.hero-galaxy-motion video').evaluateAll(v=>v.every(e=>e.paused)));
 await page.locator('[data-galaxy-pause]').click();await page.waitForFunction(()=>document.body.dataset.galaxyMotion==='playing');
 await page.locator('.hero-motion-controls [data-motion-still]').click();assert(await page.locator('.hero-galaxy-motion').isHidden());assert(await page.locator('.hero-galaxy-motion video').evaluateAll(v=>v.every(e=>e.paused)));
 await page.locator('[data-galaxy-pause]').click();await page.waitForFunction(()=>document.body.dataset.galaxyMotion==='playing');
 await page.locator('#pilot').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.hero-galaxy-motion video')].every(v=>v.paused));
 await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>[...document.querySelectorAll('.hero-galaxy-motion video')].some(v=>!v.paused));
 const cls=await page.evaluate(()=>window.__cls);assert(cls<.02,`CLS ${cls}`);
 await page.locator('.launch-replay').click();await page.locator('[data-launch-skip]').click();await page.waitForFunction(()=>document.body.dataset.launchState==='skipped');
 assert.equal(await page.locator('.launch-replay').evaluate(e=>document.activeElement===e),true);
 await page.locator('.launch-replay').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.body.dataset.launchState==='reduced-motion');
 assert.equal(await page.locator('#launch-intro-video').evaluate(v=>v.paused),true);assert(await page.locator('.hero-galaxy-motion video').evaluateAll(v=>v.every(e=>e.paused)));
 await page.emulateMedia({reducedMotion:'no-preference'});assert.equal(await page.locator('#launch-intro-video').evaluate(v=>v.paused),true);assert(await page.locator('.hero-galaxy-motion').isHidden());
 assert.deepEqual(errors,[]);results.push({width,realEndedTransition:true,transition,continuousGalaxyLoop:true,offscreenPauseResume:true,pauseResumeStill:true,skipReplay:true,preferenceChange:true,cls,errors});await page.close();
}
for(const mode of ['reduced','no-js','failed','autoplay-blocked','hash','save-data','galaxy-failed']) {
 const page=await browser.newPage({javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 const media=[];page.on('request',r=>{if(r.url().endsWith('.mp4'))media.push(r.url())});
 if(mode==='failed')await page.route('**/*.mp4',r=>r.abort());
 if(mode==='galaxy-failed')await page.route('**/galaxy-living-photo.mp4',r=>r.abort());
 if(mode==='autoplay-blocked')await page.addInitScript(()=>HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError')));
 if(mode==='save-data')await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true}}));
 await page.goto(base+'/launch-preview.html'+(mode==='hash'?'#moments':''));
 if(['failed','autoplay-blocked','galaxy-failed'].includes(mode))await page.waitForFunction(()=>!document.body.hasAttribute('data-launch-active'));
 assert(await page.locator('.hero-copy').isVisible());assert.equal(await page.locator('.hero-copy').evaluate(e=>e.inert),false);
 if(['reduced','no-js','hash','save-data'].includes(mode))assert.equal(media.length,0,`Unexpected media for ${mode}`);
 if(mode==='galaxy-failed')assert(await page.locator('.hero-galaxy-motion').isHidden());
 results.push({mode,staticFallback:true,mediaRequests:media.length});await page.close();
}
for(const width of [320,375,768,1024,1920]) {
 const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(base+'/launch-preview.html');await page.locator('[data-launch-skip]').click();await page.waitForFunction(()=>document.body.dataset.launchState==='skipped');
 assert(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+1),`Overflow ${width}`);
 assert(await page.locator('.hero-motion-controls').evaluate(e=>{let r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}));
 assert(await page.locator('#hero-title').isVisible());results.push({width,responsiveMotionHero:true});await page.close();
}
const p=await browser.newPage();await p.goto(base+'/');assert.equal(await p.locator('.launch-intro').count(),0);assert.equal(await p.locator('#hero-title').innerText(),'Turn product momentum into market growth.');
results.push({ordinaryHomepageUnchanged:true});await browser.close();await writeFile('preview-review/wide-launch/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
