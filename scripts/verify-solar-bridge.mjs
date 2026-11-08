import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {measureHeroContrast} from './hero-contrast.mjs';
const base=process.env.BASE_URL||'http://127.0.0.1:4198';
const out='preview-review/solar-bridge';await mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
try{for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});await p.goto(base+'/launch-preview');
 await p.waitForFunction(()=>document.body.dataset.flightPhase==='departure',{timeout:20000});
 await p.waitForFunction(()=>document.body.dataset.flightPhase==='journey',null,{timeout:25000});
 const box=await p.locator('#hero-title').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}});
 for(const [label,t] of [['moon',5],['mars',11],['galaxies-approaching',18],['galaxies-arrival',23.5]]){
  await p.waitForFunction(t=>+document.querySelector('.flight-bridge').dataset.journeyTime>=t,t,{timeout:20000});
  await p.locator('[data-flight-pause]').click();
  const before=await p.locator('.flight-bridge').getAttribute('data-journey-time');await p.waitForTimeout(300);assert.equal(await p.locator('.flight-bridge').getAttribute('data-journey-time'),before);
  assert.deepEqual(await p.locator('#hero-title').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}),box);await p.evaluate(()=>scrollTo(0,0));
  await p.screenshot({path:`${out}/${label}-${width}.png`});
  const data=await p.locator('.flight-bridge').evaluate(c=>c.toDataURL('image/jpeg',.92));await writeFile(`${out}/${label}-scene-${width}.jpg`,Buffer.from(data.split(',')[1],'base64'));
  const contrast=await measureHeroContrast(p);assert(contrast.minimum>=4.5,JSON.stringify({width,label,contrast}));
  results.push({width,label,time:before,pauseFrozen:true,stationaryHeadline:true,contrast});
  await p.locator('[data-flight-pause]').click();
 }
 await p.waitForFunction(()=>document.body.dataset.flightPhase==='ambient');
 const fill=await p.evaluate(()=>{const hero=document.querySelector('.hero').getBoundingClientRect(),scene=document.querySelector('.flight-scene').getBoundingClientRect();return{heroHeight:hero.height,sceneHeight:scene.height,heroWidth:hero.width,sceneWidth:scene.width}});assert.equal(fill.heroHeight,fill.sceneHeight);assert.equal(fill.heroWidth,fill.sceneWidth);results.push({width,fullHero:true,...fill});
 // Replay and skip during the new phase cannot resurrect stale async playback.
 await p.locator('[data-flight-replay]').click();await p.locator('[data-flight-skip]').click();await p.waitForTimeout(500);assert.equal(await p.locator('body').getAttribute('data-flight-phase'),'ambient');await p.close();
 }
 await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await b.close();}
