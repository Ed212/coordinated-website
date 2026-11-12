import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {commercialPositioning} from './galaxy-commercial-story.mjs';
import {fallbackDelivery, launchPoster} from './release-loading.mjs';
import {emulateSaveData} from './browser-fixtures.mjs';
const base = process.env.BASE_URL || 'http://127.0.0.1:4174';
const out = 'preview-review/release';
await mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const results=[];
try {
  for (const width of [390,1440]) {
    const context = await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    const page = await context.newPage(), errors=[], failures=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)failures.push(`${response.status()} ${response.url()}`);});
    for (const route of ['/','/b','/use-cases']) {
      await page.goto(base+route);
      await page.evaluate(()=>document.fonts.ready);
      assert(await page.locator('body').evaluate(body=>body.scrollWidth<=innerWidth+1), `${route}: no horizontal overflow at ${width}`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://coordinatedai.ai'+(route==='/use-cases'?route:'/'));
      if (route !== '/use-cases') {
        assert.equal(await page.locator('#hero-title').innerText(),commercialPositioning);
        assert.equal(await page.locator('.study-banner').count(),0);
        assert(await page.locator('.flight-fallback img').isVisible());
        assert(await page.locator('.flight-animation').isHidden());
        assert(await page.locator('.flight-controls').isHidden());
        assert.equal(await page.locator('[data-galaxy-chapter]').count(),5);
        assert.equal(await page.locator('.proof-line').innerText(),'Prelaunch. Software in development. Intended workflow, not shipped capability.');
        await page.locator('a[href="#launch-dependencies"]').first().click();
        assert(await page.locator('#launch-dependencies').evaluate(node=>node.open));
        assert.equal(new URL(page.url()).hash,'#launch-dependencies');
        await page.goBack();
        await page.locator('button[data-galaxy-motion]').scrollIntoViewIfNeeded();
        assert.equal(await page.locator('button[data-galaxy-motion]').innerText(),'Still view enabled');
      } else {
        const text=await page.locator('main').innerText();
        for (const value of ['$49','$3,000','$1,200','Fri Nov 27','Tue Dec 1','Version 3']) assert(text.includes(value),value);
        assert(!text.includes('Finance’s decision is still open'));
      }
      await page.screenshot({path:`${out}/${route==='/'?'root':route.slice(1)}-${width}.png`,fullPage:true});
      results.push({width,route,noOverflow:true,metadata:true,currentStory:true});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:1000}});
  const page=await context.newPage();await page.goto(base+'/');
  assert.equal(await page.locator('#hero-title').innerText(),commercialPositioning);
  assert(await page.locator('.flight-fallback img').isVisible());
  assert(await page.locator('.flight-controls').isHidden());
  const details=page.locator('#launch-dependencies');
  const wasOpen=await details.evaluate(node=>node.open);
  await page.locator('#launch-dependencies summary').click();
  assert.equal(await details.evaluate(node=>node.open),!wasOpen);
  await page.locator('#launch-dependencies summary').click();
  assert.equal(await details.evaluate(node=>node.open),wasOpen);
  assert(await page.locator('a[href^="mailto:"]').first().isVisible());
  results.push({rootNoJavaScript:true,nativeDetails:true,contactAvailable:true});
  await context.close();
  // Compare the complete decoded images in the browser that renders the release.
  // The canvas is detached and never changes the page or its LCP measurement.
  const pixelsContext = await browser.newContext({reducedMotion:'reduce'});
  const pixelsPage = await pixelsContext.newPage();
  await pixelsPage.goto(base + '/');
  const identity = await pixelsPage.evaluate(async asset => {
    async function pixels(src) {
      const image = new Image(); image.src = src; await image.decode();
      const {naturalWidth:width,naturalHeight:height} = image;
      if (width !== asset.width || height !== asset.height) throw Error('Fallback dimensions changed');
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d', {willReadFrequently:true});
      context.drawImage(image,0,0);
      return context.getImageData(0,0,width,height).data;
    }
    const [original,delivered] = await Promise.all([pixels(asset.source.file),pixels(asset.file)]);
    let differentBytes = 0;
    for (let index=0;index<original.length;index++) if (original[index] !== delivered[index]) differentBytes++;
    const decodedRgbaSha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', delivered))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
    return {differentBytes,comparedBytes:original.length,decodedRgbaSha256,currentSrc:document.querySelector('.flight-fallback img').currentSrc};
  }, fallbackDelivery);
  assert.equal(identity.differentBytes,0,'Every decoded RGBA byte equals the exact original final frame');
  assert.equal(identity.comparedBytes,1280*720*4);
  assert.equal(identity.decodedRgbaSha256,fallbackDelivery.decodedRgbaSha256);
  assert(identity.currentSrc.endsWith('/'+fallbackDelivery.file),'Release uses the verified lossless delivery');
  await pixelsPage.locator('.flight-fallback source').evaluate(source=>source.type='image/not-supported');
  const pngFallback = await pixelsPage.locator('.flight-fallback img').evaluate(async image=>{await image.decode();return {src:image.currentSrc,width:image.naturalWidth,height:image.naturalHeight};});
  assert(pngFallback.src.endsWith('/'+fallbackDelivery.source.file),'Unsupported WebP uses the original PNG');
  assert.equal(pngFallback.width,1280); assert.equal(pngFallback.height,720);
  results.push({losslessFallback:identity,pngCompatibilityFallback:pngFallback});
  await pixelsContext.close();
  for (const mode of ['motion','reduced','no-js','save-data','hash','launch-failed']) {
    const context = await browser.newContext({viewport:{width:390,height:1000},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    const page = await context.newPage(), requests=[];
    page.on('request',request=>requests.push(request.url()));
    if (mode==='save-data') await page.addInitScript(emulateSaveData);
    if (mode==='launch-failed') await page.route('**/arc-appearance-edit-v2.mp4',route=>route.abort());
    await page.goto(base+'/' +(mode==='hash'?'#main':''));
    const image=page.locator('.flight-fallback img');
    if(mode==='motion') {
      await page.waitForFunction(()=>document.body.dataset.flightPhase==='launch' && document.querySelector('#launch-intro-video').readyState>=2 && document.querySelector('#launch-intro-video').currentTime>=.2);
      assert(await image.isHidden(),'The exact fallback is covered by the opaque active animation');
      assert.equal(await image.getAttribute('fetchpriority'),'low');
      assert.equal(await page.locator(`link[rel="preload"][href="${launchPoster}"]`).count(),1);
      await page.locator('[data-flight-pause]').click(); await page.evaluate(()=>document.fonts.ready);
      // The approved full-width composition also has an asynchronously decoded
      // decorative backdrop. Settle images and the paused decoded frame before
      // isolating the fallback visibility change in two otherwise identical shots.
      await page.locator('.galaxy-camera img,.flight-fallback img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      await page.waitForFunction(()=>document.body.dataset.flightPhase==='launch' && [...document.querySelectorAll('.flight-scene video')].every(video=>video.paused));
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const covered=await page.screenshot({path:`${out}/covered-fallback.png`});
      const originalVisibility=await page.addStyleTag({content:'.flight-fallback { visibility:visible !important; }'});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const unchanged=await page.screenshot({path:`${out}/revealed-covered-fallback.png`});
      if(!covered.equals(unchanged)) {
        const difference=await page.evaluate(async ([a,b])=>{
          const pixels=async src=>{const image=new Image();image.src=src;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return {data:ctx.getImageData(0,0,image.width,image.height).data,width:image.width,height:image.height};};
          const left=await pixels(a),right=await pixels(b);let count=0,minX=left.width,minY=left.height,maxX=-1,maxY=-1;
          for(let i=0;i<left.data.length;i+=4)if(left.data.slice(i,i+4).some((value,k)=>value!==right.data[i+k])){count++;const x=i/4%left.width,y=Math.floor(i/4/left.width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
          return {count,bounds:{minX,minY,maxX,maxY},phase:document.body.dataset.flightPhase,scene:document.querySelector('.flight-scene').getBoundingClientRect().toJSON(),launchTime:document.querySelector('#launch-intro-video').currentTime};
        },[covered,unchanged].map(bytes=>'data:image/png;base64,'+bytes.toString('base64')));
        console.log('Fallback visibility screenshot difference:',JSON.stringify(difference));
      }
      assert(covered.equals(unchanged),'Hiding only the already-covered fallback changes no visible screenshot pixel');
      await originalVisibility.evaluate(style=>style.remove());
    } else {
      if(mode!=='no-js') await page.waitForFunction(()=>document.body.dataset.flightPhase==='still');
      await image.evaluate(element=>element.decode());
      assert(await image.isVisible(),'Every actual still state displays the complete decoded original frame');
      if(mode!=='no-js') assert.equal(await image.getAttribute('fetchpriority'),'high');
      assert.equal(await page.locator(`link[rel="preload"][href="${fallbackDelivery.file}"]`).count(),1);
      assert(await page.locator('.flight-animation').isHidden());
    }
    assert.equal(requests.filter(url=>url.endsWith('/'+fallbackDelivery.file)).length,1,'Load the full-size frame once, with no forced reload on priority upgrade');
    assert.equal(requests.filter(url=>url.endsWith('/'+fallbackDelivery.source.file)).length,0,'No duplicate PNG transfer in a WebP-capable browser');
    results.push({loadingMode:mode,correctVisibleImage:true,oneFallbackRequest:true,noDuplicatePng:true});
    await context.close();
  }
  await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
