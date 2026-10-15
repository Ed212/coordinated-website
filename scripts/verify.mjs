import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { checkCopy } from './check-copy.mjs';
import { createHash } from 'node:crypto';
const originalCalc=await readFile('docs/site-v5/calc.js','utf8');
const digest=text=>createHash('sha256').update(text).digest('hex');
const documents=new Map();
const base=process.env.BASE_URL || 'http://127.0.0.1:4174';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const log=[];
await mkdir('docs/site-v5/screenshots',{recursive:true});
try {
 for(const file of ['index.html','b.html']) for(const width of [400,1100]) for(const colorScheme of ['light','dark']) {
  const page=await browser.newPage({viewport:{width,height:900},colorScheme,reducedMotion:'reduce'});
  let expectedFailure=false;const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error' && !(expectedFailure && /502|404/.test(m.text())))errors.push(m.text())});
  await page.goto(`${base}/${file}`);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').textContent(),file==='index.html'?'Give your team its focus back.':'Stop repeating decisions and chasing updates.');
  assert(await page.evaluate(()=>document.scrollingElement.scrollWidth<=innerWidth),'Horizontal overflow');
  // Scroll the complete document to load images and observe all six moments.
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,15))}});
  assert.deepEqual(checkCopy(await page.locator('body').innerText(),`${file} rendered`),[]);
  assert.equal(digest(await page.locator('#attention-model').textContent()),digest(originalCalc),'Inline calculator bytes changed');
  const totals=()=>page.locator('#cmp tr:not(:first-child)').evaluateAll(rows=>rows.map(row=>row.cells[4].textContent));
  assert.deepEqual(await totals(),['52','58','36','29']);
  assert.deepEqual(await page.evaluate(()=>model().R.map(row=>Math.round(row.total))),[52,58,36,29]);
  await page.locator('#pess').check();assert.deepEqual((await totals()).slice(2),['41','35']);
  await page.locator('#pess').uncheck();assert.deepEqual(await totals(),['52','58','36','29']);
  await page.locator('details').first().locator('summary').click();
  await page.locator('#r-cardMin').fill('3');await page.locator('#r-cardMin').dispatchEvent('input');assert.equal(await page.locator('#v-cardMin').textContent(),'3.0');
  assert.equal(await page.evaluate(()=>P.cardMin.v),3);assert((await totals())[1]!=='58','Assumption did not recalculate');
  await page.locator('#r-cardMin').fill('2');await page.locator('#r-cardMin').dispatchEvent('input');assert.deepEqual(await totals(),['52','58','36','29']);
  await page.locator('details').nth(1).locator('summary').click();
  assert.equal(await page.locator('#ledgerV4 tr').count(),11);assert.equal(await page.locator('#ledgerV4 tr').last().locator('td').nth(2).textContent(),'33');
  assert.deepEqual(checkCopy(await page.locator('body').innerText(),`${file} expanded rendered`),[]);
  assert(!await page.locator('nav a').evaluateAll(links=>links.some(a=>/(?:^|\/)b(?:\.html)?(?:$|[?#])/.test(a.getAttribute('href')))),'B appears in navigation');
  assert.equal(await page.locator('.hero [data-pilot-action]').textContent(),'Discuss a six-week pilot');
  assert.equal(await page.locator('#moments .evidence-label').textContent(),'In the pilot today');
  assert.equal(await page.locator('#pilot .evidence-label').textContent(),'In the pilot today');
  assert.equal(await page.locator('#architecture .evidence-label').textContent(),'What we are building');
  assert(await page.locator('#pilot').innerText().then(t=>t.includes('by hand')));
  assert.equal(await page.locator('#launch-form').evaluate(form=>!!form.closest('#pilot')),true);
  const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({alt:i.getAttribute('alt'),loaded:i.complete&&i.naturalWidth>0,source:i.currentSrc})));
  assert(images.every(i=>i.alt!==null&&i.loaded),'Missing alt or broken image');
  assert(images.some(i=>i.source.includes('starfield-1600.webp')),'Responsive starfield must use 1600px below 1200px');
  await page.keyboard.press('Tab');
  const controls=await page.locator('a, button, input:not([tabindex="-1"]), textarea, summary, [tabindex="0"]').all();
  for(const control of controls){if(!await control.isVisible())continue;await control.focus();assert(await control.evaluate(el=>{const s=getComputedStyle(el);return s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0}),'Missing visible focus indicator on '+await control.evaluate(el=>el.outerHTML.slice(0,180)))}
  for(const href of await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')))) {
   const url=new URL(href,page.url());if(url.origin!==new URL(base).origin)continue;
   const key=url.origin+url.pathname;
   if(!documents.has(key)){const response=await page.request.get(key);assert(response.ok(),`Broken link ${href}`);documents.set(key,await response.text())}
   if(url.hash)assert(await page.evaluate(({html,id})=>new DOMParser().parseFromString(html,'text/html').getElementById(id)!==null,{html:documents.get(key),id:decodeURIComponent(url.hash.slice(1))}),`Broken anchor ${href}`);
  }
  await page.getByRole('button',{name:'Copy address'}).first().click();await page.waitForFunction(()=>document.querySelector('.copy-status').textContent.length>0);
  await page.locator('.copy-status').evaluateAll(elements=>elements.forEach(el=>el.textContent=''));
  await page.locator('details').evaluateAll(elements=>elements.forEach(el=>el.open=false));
  const start=page.url();await page.locator('#email').fill('operator@example.com');await page.locator('#document').fill('A local test document.');
  await page.locator('#launch-form button').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent==='We read it and reply.');assert.equal(page.url(),start,'Form navigated');
  expectedFailure=true;
  await page.route('**/api/contact',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'Your document could not be sent. Please try again or email ed@coordinatedai.ai.'})}));
  await page.locator('#email').fill('operator@example.com');await page.locator('#document').fill('Retain this text after a failed send.');await page.locator('#launch-form button').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('could not be sent'));assert.equal(await page.locator('#document').inputValue(),'Retain this text after a failed send.');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact',route=>route.fulfill({status:404,contentType:'text/html',body:'<html>Page not found</html>'}));
  await page.locator('#launch-form button').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('Please email your document'));assert.equal(page.url(),start,'Missing endpoint navigated');
  assert.equal(await page.locator('#document').inputValue(),'Retain this text after a failed send.');
  await page.unroute('**/api/contact');await page.locator('#launch-form').evaluate(form=>form.reset());await page.locator('#form-status').evaluate(el=>el.textContent='');
  await page.locator('h1').click();await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`docs/site-v5/screenshots/${file==='index.html'?'a':'b'}-${width}-${colorScheme}.png`,fullPage:true});
  assert.deepEqual(errors,[],'Browser console errors');
  log.push(`PASS ${file} ${width}px ${colorScheme}: headline, B unlinked, totals 52/58/36/29, pessimistic 41/35, sliders, ledger weekdays, unchanged calculator hash, labels, optional form, copy address, overflow, rendered copy, images, focus, links/anchors, form success/failure without navigation.`);
  await page.close();
 }
 const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(base);assert(await noJS.locator('noscript a[href="mailto:ed@coordinatedai.ai"]').isVisible());await noJS.close();log.push('PASS no-JavaScript email fallback.');
 // OG is rendered by the same browser, never generated from an unrelated asset.
 const og=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});await og.goto(`${base}/og.html`);await og.evaluate(()=>document.fonts.ready);await og.screenshot({path:'assets/galaxy/og-1200x630.png'});await og.close();log.push('PASS OG rendered from dedicated og.html at 1200x630.');
 log.push('PASS calculator SHA-256 '+digest(originalCalc));
} catch(error) {log.push(`FAIL ${error.stack}`);throw error} finally {await browser.close();await writeFile('docs/site-v5/logs/playwright.log',log.join('\n')+'\n');console.log(log.join('\n'))}
