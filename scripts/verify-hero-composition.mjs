import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4174';
const out='preview-review/hero-composition';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
const phase=(page,value)=>page.waitForFunction(value=>document.body.dataset.flightPhase===value,value,{timeout:40000});
const state=page=>page.locator('.hero-product').evaluate(el=>({inert:el.inert,hidden:el.getAttribute('aria-hidden'),reveal:el.dataset.reveal}));
try{
 for(const viewport of [{width:390,height:844},{width:1180,height:757},{width:1440,height:720},{width:2048,height:1029}]){
  const page=await browser.newPage({viewport}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');await phase(page,'launch');await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('#launch-intro-video').readyState>=2 && document.querySelector('#launch-intro-video').currentTime>0.2);
  await page.locator('[data-flight-pause]').click();
  assert.deepEqual(await state(page),{inert:true,hidden:'true',reveal:'waiting'});
  const height=await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().height);
  const geometry=await page.evaluate(()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};return {scene:box('.flight-scene'),copy:box('.hero-copy'),card:box('.hero-product'),fit:[...document.querySelectorAll('.flight-scene img,.flight-scene video')].map(el=>getComputedStyle(el).objectFit),overflow:document.body.scrollWidth>innerWidth+1}});
  assert.equal(geometry.overflow,false);assert.equal(geometry.scene.x,0);assert.equal(geometry.scene.width,viewport.width);assert(geometry.fit.every(fit=>fit==='cover'));
  if(viewport.width<=900){assert(geometry.copy.y>geometry.scene.bottom);assert(geometry.card.y>geometry.copy.bottom);}
  else{assert(geometry.card.x>geometry.copy.x);assert(geometry.card.right<=viewport.width);}
  await page.locator('[data-flight-skip]').click();await phase(page,'loop');
  assert.deepEqual(await state(page),{inert:false,hidden:null,reveal:'ready'});
  assert.equal(await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().height),height);
  await page.screenshot({path:`${out}/settled-${viewport.width}.png`,fullPage:false});
  await page.locator('[data-flight-replay]').click();await phase(page,'launch');assert.equal((await state(page)).inert,true);
  assert.equal(await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().height),height);
  await page.locator('.hero-product').evaluate(el=>el.scrollIntoView());await page.waitForFunction(()=>!document.querySelector('.hero-product').inert);
  assert.equal((await state(page)).reveal,'ready');
  assert.deepEqual(errors,[]);results.push({viewport,fullWidth:true,cover:true,cardInertUntilLoop:true,stableHeroHeight:height,replayResets:true,scrollEscape:true,geometry});await page.close();
 }
 for(const mode of ['reduced','no-js','failure']){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
  if(mode==='failure')await page.route('**/arc-appearance-edit-v2.mp4',route=>route.abort());
  await page.goto(base+'/');if(mode!=='no-js')await phase(page,'still');
  assert(await page.locator('.hero-product').isVisible());assert.equal((await state(page)).inert,false);assert(await page.locator('.flight-fallback img').isVisible());
  results.push({mode,staticCardAvailable:true});await page.close();
 }
 await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
