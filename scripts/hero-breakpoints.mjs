import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {measureHeroContrast} from './hero-contrast.mjs';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 for(const file of ['index.html','b.html'])for(const width of [320,600,601,760,761,1020,1199,1200,1600,1920]){
  await page.setViewportSize({width,height:900});await page.goto(`${process.env.BASE_URL||'http://127.0.0.1:4174'}/${file}`);await page.evaluate(()=>document.fonts.ready);
  const contrast=await measureHeroContrast(page);assert(contrast.minimum>=4.5,`${file} ${width}: contrast below 4.5`);
  assert(await page.evaluate(()=>document.scrollingElement.scrollWidth<=innerWidth),`${file} ${width}: overflow`);
  const core=await page.evaluate(()=>{
   const image=document.querySelector('.hero-galaxy'),box=image.getBoundingClientRect(),hero=document.querySelector('.hero').getBoundingClientRect();
   const scale=Math.max(box.width/image.naturalWidth,box.height/image.naturalHeight);
   const [px,py]=getComputedStyle(image).objectPosition.split(' ').map(value=>parseFloat(value)/100);
   return {x:box.x-hero.x+(box.width-image.naturalWidth*scale)*px+.62011*image.naturalWidth*scale,
    y:box.y-hero.y+(box.height-image.naturalHeight*scale)*py+.44999*image.naturalHeight*scale};
  });
  assert(core.x>=width*.55&&core.x<=width*.98,`${file} ${width}: shared core is outside the right composition`);
  results.push({file,width,core,...contrast});
 }
 console.log('PASS hero contrast and overflow at 320, 600, 601, 760, 761, 1020, 1199, 1200, 1600 and 1920 pixels for A and B.');
 console.log('Minimum boundary-sweep contrast:',Math.min(...results.map(r=>r.minimum)).toFixed(3)+':1');
} finally {await browser.close();await writeFile('docs/site-v5/logs/galaxy-hero-breakpoints.json',JSON.stringify(results,null,2)+'\n')}
