import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {measureHeroContrast} from './hero-contrast.mjs';
const base=process.env.BASE_URL||'http://127.0.0.1:4198';
const out='preview-review/solar-bridge';await mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
const waitForPhase=(page,phase,timeout=25000)=>page.waitForFunction(value=>document.body.dataset.flightPhase===value,phase,{timeout});
const mediaTimes=page=>page.locator('.flight-scene video').evaluateAll(videos=>videos.map(video=>({id:video.id,time:video.currentTime,paused:video.paused})));
const headlineBox=page=>page.locator('#hero-title').evaluate(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,width:r.width,height:r.height};});
try{for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});await p.goto(base+'/launch-preview');
 await p.evaluate(()=>document.fonts.ready);
 const box=await headlineBox(p);
 await waitForPhase(p,'departure',20000);
 await waitForPhase(p,'loop');
 assert.deepEqual(await headlineBox(p),box);
 assert.equal(await p.locator('canvas,.flight-bridge,.flight-ambient').count(),0,'No archived renderer is mounted');
 const natural=await p.evaluate(()=>{const style=(selector,pseudo)=>getComputedStyle(document.querySelector(selector),pseudo);return{copyPanel:style('.hero-copy','::before').display,sceneShade:style('.flight-scene','::after').display,copyBackground:style('.hero-copy').backgroundColor,videoMasks:[...document.querySelectorAll('.flight-scene video')].map(video=>getComputedStyle(video).maskImage)};});
 assert.deepEqual(natural,{copyPanel:'none',sceneShade:'none',copyBackground:'rgba(0, 0, 0, 0)',videoMasks:['none','none','none']});
 const textEdges=await p.locator('.hero-copy h1,.hero-copy p,.hero-copy .text-link').evaluateAll(nodes=>nodes.map(node=>{const s=getComputedStyle(node);return{text:node.textContent.trim(),color:s.color,stroke:s.webkitTextStrokeColor,width:parseFloat(s.webkitTextStrokeWidth),shadow:s.textShadow,paintOrder:s.paintOrder};}));
 for(const edge of textEdges){assert.equal(edge.color,'rgb(255, 255, 255)');assert(edge.width>=.65);assert.notEqual(edge.shadow,'none');assert.equal(edge.paintOrder,'stroke');}
 results.push({width,naturalBackground:true,glyphEdgeProtection:textEdges});
 await p.locator('#distant-flight-video').evaluate(video=>{
  const probe=window.__flightVerification={elapsed:0,wraps:0,last:video.currentTime};
  video.addEventListener('timeupdate',()=>{
   const delta=video.currentTime-probe.last;
   if(delta<0){probe.wraps++;probe.elapsed+=video.duration+delta;}else probe.elapsed+=delta;
   probe.last=video.currentTime;
  });
 });
 for(const [label,time] of [['loop-entry',.1],['late-flight',2],['first-wrap',4],['repeating-flight',8]]){
  await p.waitForFunction(target=>window.__flightVerification.elapsed>=target,time,{timeout:20000});
  await p.locator('[data-flight-pause]').click();
  const before=await mediaTimes(p);assert.equal(before.length,3);assert(before.every(video=>video.paused));
  await p.waitForTimeout(300);assert.deepEqual(await mediaTimes(p),before,'Pause freezes every video time');
  assert.deepEqual(await headlineBox(p),box);await p.evaluate(()=>scrollTo(0,0));
  await p.screenshot({path:`${out}/${label}-${width}.png`});
  // A detached test-only canvas captures the actual decoded video frame.
  // No drawing canvas is added to the page or to the website runtime.
  const data=await p.locator('#distant-flight-video').evaluate(video=>{
   if(video.readyState<2||!video.videoWidth||!video.videoHeight)throw Error('Loop frame is not decoded');
   const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;
   canvas.getContext('2d').drawImage(video,0,0);return canvas.toDataURL('image/jpeg',.92);
  });
  await writeFile(`${out}/${label}-scene-${width}.jpg`,Buffer.from(data.split(',')[1],'base64'));
  // Background-only contrast intentionally excludes glyph outlines/shadows.
  // Record it honestly, but do not require a dark panel to raise this metric.
  // Edge styles and no-overlay invariants above plus real-frame visual review
  // cover this design; these samples are not a full WCAG contrast certification.
  const contrast=await measureHeroContrast(p);
  const playback=await p.locator('#distant-flight-video').evaluate(video=>({time:video.currentTime,rate:video.playbackRate,loop:video.loop,...window.__flightVerification}));
  assert.equal(playback.rate,1);assert.equal(playback.loop,true);
  if(time>=4)assert(playback.wraps>=1);if(time>=8)assert(playback.wraps>=2);
  results.push({width,label,playback,pauseFrozen:true,stationaryHeadline:true,backgroundOnlyContrast:contrast});
  await p.locator('[data-flight-pause]').click();
 }
 await waitForPhase(p,'loop');
 const fill=await p.evaluate(()=>{const hero=document.querySelector('.hero').getBoundingClientRect(),scene=document.querySelector('.flight-scene').getBoundingClientRect();return{heroHeight:hero.height,sceneHeight:scene.height,heroWidth:hero.width,sceneWidth:scene.width};});
 assert.equal(fill.heroHeight,fill.sceneHeight);assert.equal(fill.heroWidth,fill.sceneWidth);results.push({width,fullHero:true,...fill});
 assert.equal(await p.locator('.flight-status').innerText(),'Flying through distant space');
 // Wait for actual state changes, rather than assuming a loading duration.
 await p.locator('[data-flight-replay]').click();await waitForPhase(p,'launch');
 await p.locator('[data-flight-skip]').click();await waitForPhase(p,'loop');
 assert(await p.locator('[data-flight-replay]').evaluate(element=>document.activeElement===element));
 assert.equal(await p.locator('canvas').count(),0);await p.close();
 }
 await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await b.close();}
