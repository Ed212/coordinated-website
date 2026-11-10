import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, extname} from 'node:path';
import {releaseHomepage, canonicalPage} from './release-page.mjs';
import {fallbackDelivery, releaseLoadingPage, releaseStyleBundle, releaseStylesheet, verifyFallbackDelivery} from './release-loading.mjs';
import {alignNorthstarCopy} from './preview-northstar-copy.mjs';
import {commercialPositioning, commercialDescription} from './galaxy-commercial-story.mjs';
const read = file => readFile(`dist/${file}`, 'utf8');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const [root, b, galaxy, solar, cases, release, media] = await Promise.all([
  ...['index.html','b.html','galaxy-study.html','solar-study.html','use-cases.html'].map(read),
  read('release-manifest.json').then(JSON.parse), read('launch-preview-manifest.json').then(JSON.parse)
]);
assert(['local','review','production'].includes(release.mode));
assert.equal(root, releaseLoadingPage(releaseHomepage(galaxy, {indexable:release.mode !== 'review'})), 'Root is exactly the approved galaxy with only release metadata/banner and verified delivery differences');
assert.equal(b, root, '/b is a coherent canonical alias');
await verifyFallbackDelivery(file => readFile(`dist/${file}`));
assert.equal(await read(releaseStylesheet), await releaseStyleBundle(), 'Every CSS byte and cascade order is preserved in the release bundle');
assert(root.includes(`<source type="image/webp" srcset="${fallbackDelivery.file}">`));
assert.equal(root.match(/<link rel="stylesheet"/g)?.length, 1, 'One blocking stylesheet, with unchanged rules');
assert.equal(cases, canonicalPage(alignNorthstarCopy(await readFile('use-cases.html','utf8'),'useCases'), '/use-cases'), 'Linked story receives only approved consistency changes and canonical metadata');
assert.equal(solar, await read('launch-preview.html'), 'Solar comparison and launch alias remain identical');
for (const page of [galaxy, solar, await read('launch-preview.html')]) assert(page.includes('name="robots" content="noindex,nofollow"'));
assert(!root.includes('study-banner') && !root.includes('About this preview'));
assert(root.replace(/<[^>]*>/g,'').includes(commercialPositioning) && root.includes(commercialDescription));
assert(root.includes('Prelaunch. Software in development.') && root.includes('Fictional example · Northstar'));
assert.equal(root.includes('name="robots" content="noindex,nofollow"'), release.mode === 'review');
assert(root.includes('<link rel="canonical" href="https://coordinatedai.ai/">'));
assert(root.includes('<meta property="og:url" content="https://coordinatedai.ai/">'));
assert(root.includes('class="flight-animation" hidden') && root.includes('aria-label="Hero motion controls" hidden'), 'No-JS defaults are static with hidden controls');
assert(root.includes(`<img src="${media.fallback.file}" width="1280" height="720"`));
for (const control of ['pause','skip','replay']) assert.equal(root.split(`data-flight-${control}`).length,2);
assert(root.includes('id="distant-flight-video" muted playsinline loop'));
assert(!root.includes('<canvas') && !root.includes('data-flight-still'));
for (const asset of [media.launch,media.departure,media.flight,media.fallback,{file:media.launch.poster,...media.launch.posterIntegrity}]) {
  const bytes = await readFile(`dist/${asset.file}`);
  assert.equal(hash(bytes),asset.sha256,`Exact selected bytes: ${asset.file}`);
  if(asset.bytes !== undefined) assert.equal(bytes.length,asset.bytes);
}
for (const file of ['site.js','launch-preview.js','launch-preview.css','galaxy-scroll.js','galaxy-scroll.css','northstar-walkthrough.css','hero-live.css','styles.css','fonts.css']) assert.equal(hash(await readFile(`dist/${file}`)),hash(await readFile(file)),`Runtime and styles unchanged: ${file}`);
for (const [name,page] of [['index.html',root],['b.html',b],['use-cases.html',cases]]) {
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${name}: unique IDs`);
  for (const [,url] of page.matchAll(/\b(?:href|src|srcset|data-src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue;
    const [path,fragment] = url.split('#');
    let target = path ? path.split('?')[0] : name;
    if (!extname(target)) target += '.html';
    const resolved = resolve('dist',target.replace(/^\//,''));
    assert(resolved.startsWith(resolve('dist') + '/'), 'Links remain inside output');
    assert((await stat(resolved)).isFile(), `${name}: ${url}`);
    if (fragment) assert((await readFile(resolved,'utf8')).includes(`id="${fragment}"`),`${name}: target exists for ${url}`);
  }
}
console.log(`PASS ${release.mode} release: exact approved root and /b, current linked story, metadata, aliases, all local links/anchors, source-identical runtime, selected media hashes and no-JS defaults.`);
