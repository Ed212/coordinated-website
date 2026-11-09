import { walkthroughNavigation, addNorthstarWalkthrough } from './northstar-walkthrough.mjs';
import { addCommercialStory, commercialPositioning } from './galaxy-commercial-story.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,stat} from 'node:fs/promises';
const read = file => readFile(`dist/${file}`,'utf8');
const [solar,galaxy,index,b,css,script] = await Promise.all(['solar-study.html','galaxy-study.html','index.html','b.html','galaxy-scroll.css','galaxy-scroll.js'].map(read));
assert.equal(galaxy.split(walkthroughNavigation).length,2,'Exactly one known navigation block is added.');
const expected = addNorthstarWalkthrough(addCommercialStory(solar));
const text = page => page.replace(/<p class="galaxy-chapter-label"[^>]*>[\s\S]*?<\/p>/g,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const content = page => text(page.slice(page.indexOf('<section class="trust-ribbon"'),page.indexOf('</main>')));
assert.equal(content(galaxy),content(expected),'Post-hero content is the approved commercial transformation, not the old comparison copy.');
const hero = page => page.match(/<div class="hero-copy">[\s\S]*?<\/section>/)[0];
assert.equal(hero(galaxy),hero(expected),'Only approved hero supporting copy changes; headline and CTA markup survive.');
assert(galaxy.includes(`<p class="hero-promise">${commercialPositioning}</p>`));
assert.equal(text(galaxy.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0]),'Make your go-to-market move at the speed of your product.');
const media = page => page.match(/<div class="flight-scene"[\s\S]*?<div class="ledger-boundary hero-layout">/)[0];
assert.equal(media(galaxy),media(solar),'The cinematic scene and controls are byte-for-byte unchanged.');
const fallback=JSON.parse(await readFile('assets/video/deep-space-final-frame.json','utf8'));
const fallbackBytes=await readFile(`dist/${fallback.file}`);
assert.equal(fallbackBytes.length,fallback.bytes);
assert.equal(createHash('sha256').update(fallbackBytes).digest('hex'),fallback.sha256,'Preview fallback retains the exact verified final-frame PNG.');
const manifest=JSON.parse(await read('launch-preview-manifest.json'));
assert.deepEqual(manifest.fallback,fallback);
assert.equal(fallback.source.sha256,manifest.departure.sha256);
for(const page of [solar,galaxy,await read('launch-preview.html')]){
 const picture=page.match(/<picture class="flight-fallback">[\s\S]*?<\/picture>/)?.[0];
 assert(picture?.includes(`src="${fallback.file}"`),'Static hero uses the final video frame.');
 assert(!picture.includes('assets/galaxy/')&&!picture.includes('<source'),'No galaxy responsive source can replace the final-frame fallback.');
 assert(!media(page).includes('assets/galaxy/')&&!media(page).includes('hero-galaxy'),'The preview hero has no merging-galaxy fallback.');
 assert(page.includes(`<link rel="preload" as="image" href="${fallback.file}" fetchpriority="high">`));
 assert(!/<link rel="preload" as="image" href="assets\/galaxy\//.test(page),'The old hero is not preloaded.');
 assert(!page.includes('data-flight-still'),'No explicit still-image button.');
 assert(page.includes('class="flight-animation" hidden')&&page.includes('aria-label="Hero motion controls" hidden'),'No-JS leaves the static frame visible and controls hidden.');
 for(const control of ['pause','skip','replay'])assert.equal(page.split(`data-flight-${control}`).length,2);
 assert(page.includes('<span class="flight-status" role="status">'),'Static status stays noninteractive.');
}
for(const page of [index,b]){
 assert(!page.includes('flight-fallback')&&!page.includes(fallback.file),'Ordinary pages do not adopt the new fallback.');
 assert(page.includes('class="hero-galaxy"')&&page.includes('assets/galaxy/landscape-upscaled-2880x1600.webp'),'Ordinary hero artwork remains unchanged.');
}
for(const file of ['launch-preview.js','galaxy-scroll.js'])assert(!(await read(file)).includes('data-flight-still'),'Runtime has no stale button listener or visibility dependency.');
const contact = page => page.match(/<section[^>]*id="pilot"[^>]*>[\s\S]*?<\/section>/)[0];
assert.equal(text(contact(galaxy)),text(contact(solar)),'Contact copy and behavior remain unchanged.');
const hrefs = page => [...page.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(hrefs(galaxy.replace(walkthroughNavigation,'')).filter(href=>!['galaxy-scroll.css','northstar-walkthrough.css'].includes(href)),hrefs(solar));
for(const match of galaxy.matchAll(/href="#([^"]+)"/g)) assert.equal(galaxy.split(`id="${match[1]}"`).length,2,`Unique native anchor: ${match[1]}`);
assert.equal(galaxy.match(/data-galaxy-chapter=/g)?.length,5);
assert(galaxy.includes('data-galaxy-label="Toward the merging galaxies"'));
assert(galaxy.includes('<span>02 / 05</span> Toward the merging galaxies</p>'));
assert(!galaxy.includes('Into the spiral'));
assert(galaxy.includes('name="robots" content="noindex,nofollow"'));
assert(galaxy.includes('class="galaxy-navigation" aria-label="Galaxy journey controls" hidden'));
for(const original of [solar,index,b]) {
  assert(!original.includes('galaxy-scroll')&&!original.includes('galaxy-content')&&!original.includes('northstar-walkthrough'),'Existing routes exclude galaxy additions.');
  assert(!original.includes(commercialPositioning),'Commercial revision is isolated from existing routes.');
  assert(original.includes('Conversation history helps recall what was said.'),'Comparison copy remains intact.');
}
assert.equal(solar,await read('launch-preview.html'),'The original comparison and alias are unchanged.');
for (const file of ['index.html','b.html','use-cases.html','pilot-evidence.html','privacy.html','terms.html','site.js','launch-preview.css','launch-preview.js','solar-journey.js']) assert.equal(await read(file),await readFile(file,'utf8'),`${file} is copied without preview changes.`);
assert(css.includes('@media(prefers-reduced-motion:reduce)'));
assert(!script.includes('setInterval')&&!script.includes('setTimeout'),'No timer-driven animation.');
assert(!script.includes('preventDefault'),'Native scrolling is not intercepted.');
assert(script.includes("window.addEventListener('scroll', schedule, { passive: true })"));
assert(galaxy.includes('href="northstar-walkthrough.css"'));
const addedBytes=(await stat('dist/galaxy-scroll.css')).size+(await stat('dist/galaxy-scroll.js')).size+(await stat('dist/northstar-walkthrough.css')).size;
assert(addedBytes<15000,`Styles and script remain lightweight: ${addedBytes}`);
console.log(`PASS isolated commercial story, shared preview media/controls, unchanged ordinary routes/contact, exact final-frame fallback, no still button, five chapters, still/no-JS defaults, native anchors and scrolling, ${addedBytes} bytes CSS + JS.`);
