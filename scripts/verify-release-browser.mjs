import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {commercialPositioning} from './galaxy-commercial-story.mjs';
import {fallbackDelivery} from './release-loading.mjs';
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
  await writeFile(`${out}/checks.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
