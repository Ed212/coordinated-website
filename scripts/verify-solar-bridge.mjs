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
 await p.waitForFunction(()=>document.body.dataset.flightPhase==='ambient',null,{timeout:25000});
 const natural=await p.evaluate(()=>{const style=(selector,pseudo)=>getComputedStyle(document.querySelector(selector),pseudo);return{copyPanel:style('.hero-copy','::before').display,sceneShade:style('.flight-scene','::after').display,copyBackground:style('.hero-copy').backgroundColor,videoMask:style('#launch-intro-video').maskImage,canvasMask:style('.flight-bridge').maskImage};});
 assert.deepEqual(natural,{copyPanel:'none',sceneShade:'none',copyBackground:'rgba(0, 0, 0, 0)',videoMask:'none',canvasMask:'none'});
 const textEdges=await p.locator('.hero-copy h1,.hero-copy p,.hero-copy .text-link').evaluateAll(nodes=>nodes.map(node=>{const s=getComputedStyle(node);return{text:node.textContent.trim(),color:s.color,stroke:s.webkitTextStrokeColor,width:parseFloat(s.webkitTextStrokeWidth),shadow:s.textShadow,paintOrder:s.paintOrder};}));
 for(const edge of textEdges){assert.equal(edge.color,'rgb(255, 255, 255)');assert(edge.width>=.65);assert.notEqual(edge.shadow,'none');assert.equal(edge.paintOrder,'stroke');}
 results.push({width,naturalBackground:true,glyphEdgeProtection:textEdges});
 const box=await p.locator('#hero-title').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}});
 for(const [label,t] of [['space-entry',.1],['space-drift',5],['space-passage',18],['space-continues',30]]){
  await p.waitForFunction(t=>+document.querySelector('.flight-bridge').dataset.journeyTime>=t,t,{timeout:20000});
  await p.locator('[data-flight-pause]').click();
  const before=await p.locator('.flight-bridge').getAttribute('data-journey-time');await p.waitForTimeout(300);assert.equal(await p.locator('.flight-bridge').getAttribute('data-journey-time'),before);
  assert.deepEqual(await p.locator('#hero-title').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}),box);await p.evaluate(()=>scrollTo(0,0));
  await p.screenshot({path:`${out}/${label}-${width}.png`});
  const data=await p.locator('.flight-bridge').evaluate(c=>c.toDataURL('image/jpeg',.92));await writeFile(`${out}/${label}-scene-${width}.jpg`,Buffer.from(data.split(',')[1],'base64'));
  // Background-only contrast intentionally excludes glyph outlines/shadows.
  // Record it honestly, but do not require a dark panel to raise this metric.
  // Edge styles and no-overlay invariants above plus real-frame visual review
  // cover this design; these samples are not a full WCAG contrast certification.
  const contrast=await measureHeroContrast(p);
  results.push({width,label,time:before,pauseFrozen:true,stationaryHeadline:true,backgroundOnlyContrast:contrast});
  await p.locator('[data-flight-pause]').click();
 }
 await p.waitForFunction(()=>document.body.dataset.flightPhase==='ambient');
 const fill=await p.evaluate(()=>{const hero=document.querySelector('.hero').getBoundingClientRect(),scene=document.querySelector('.flight-scene').getBoundingClientRect();return{heroHeight:hero.height,sceneHeight:scene.height,heroWidth:hero.width,sceneWidth:scene.width}});assert.equal(fill.heroHeight,fill.sceneHeight);assert.equal(fill.heroWidth,fill.sceneWidth);results.push({width,fullHero:true,...fill});
 assert.equal(await p.locator('body').getAttribute('data-flight-phase'),'ambient');
 assert.equal(await p.locator('.flight-status').innerText(),'Floating through space');
 // Replay and skip during the new phase cannot resurrect stale async playback.
 await p.locator('[data-flight-replay]').click();await p.locator('[data-flight-skip]').click();await p.waitForTimeout(500);assert.equal(await p.locator('body').getAttribute('data-flight-phase'),'ambient');await p.close();
 }
 await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await b.close();}
