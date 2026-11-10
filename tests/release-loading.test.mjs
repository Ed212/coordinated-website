import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fallbackDelivery, releaseLoadingPage, releaseStyleBundle, releaseStyles, releaseStylesheet, verifyFallbackDelivery} from '../scripts/release-loading.mjs';
const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const picture = `<picture class="flight-fallback"><img src="${fallbackDelivery.source.file}" width="1280" height="720" alt="" fetchpriority="high" decoding="async"></picture>`;
const preload = `<link rel="preload" as="image" href="${fallbackDelivery.source.file}" fetchpriority="high">`;
const body = `<body><h1>Unchanged copy</h1>${picture}<video loop></video><button>Pause motion</button></body>`;
const fixture = `<head>${releaseStyles.map(file => `<link rel="stylesheet" href="${file}">`).join('\n')}${preload}<script src="launch-preview.js" type="module"></script></head>${body}`;

test('release delivery changes only the stylesheet requests and lossless image source/preload', () => {
  const page = releaseLoadingPage(fixture);
  const source = `<source type="image/webp" srcset="${fallbackDelivery.file}">`;
  assert.equal(page.slice(page.indexOf('<body>')).replace(source,''), body, 'No copy, geometry, runtime or controls change');
  assert(page.includes(picture.replace('<img', source + '<img')), 'Original PNG remains the fallback');
  assert.equal(page.match(/<link rel="stylesheet"/g)?.length, 1);
  assert(page.includes(`<link rel="stylesheet" href="${releaseStylesheet}">`));
  assert(page.indexOf(`href="${fallbackDelivery.file}"`) < page.indexOf(`href="${releaseStylesheet}"`), 'LCP preload comes before blocking resources');
  assert(!page.includes(preload), 'Do not download the original PNG as well as its delivery variant');
  assert(page.includes('<script src="launch-preview.js" type="module"></script>'));
});
test('release bundling preserves all original CSS bytes in exact cascade order', async () => {
  const css = await releaseStyleBundle();
  assert.equal(css, (await Promise.all(releaseStyles.map(read))).join('\n'));
  assert(!css.includes('@import') && !css.includes('@charset'), 'No order-sensitive imports or charset directives need rewriting');
});
test('delivery transform rejects changed stylesheet order, missing source and repeat application', () => {
  assert.throws(() => releaseLoadingPage(fixture.replace('href="launch-preview.css"','href="unexpected.css"')), /cascade/);
  assert.throws(() => releaseLoadingPage(fixture.replace(preload,'')), /preload/);
  assert.throws(() => releaseLoadingPage(fixture.replace(picture,'')), /fallback/);
  assert.throws(() => releaseLoadingPage(releaseLoadingPage(fixture)), /cascade/);
});
test('delivery variant is the locked full-size lossless WebP and retains the original verified PNG', async () => {
  await verifyFallbackDelivery();
  const bytes = await readFile(new URL('../' + fallbackDelivery.file, import.meta.url));
  assert.equal(bytes[20], 0x2f, 'VP8L lossless signature');
  const bits = bytes.readUInt32LE(21);
  assert.equal((bits & 0x3fff) + 1, 1280);
  assert.equal(((bits >>> 14) & 0x3fff) + 1, 720);
  assert.equal(fallbackDelivery.width, 1280);
  assert.equal(fallbackDelivery.height, 720);
  assert.equal(fallbackDelivery.source.sha256, 'a650aa31ccc5c07130714404aec4d69beec56f1aa275274c9ae4e3fb096338ee');
  assert.equal(fallbackDelivery.decodedRgbaSha256, 'e2ebbb379c5fa19fb98d7ee8288cf1c4dc65b28dad4e1cf08616760eca5d4eda');
  await assert.rejects(() => verifyFallbackDelivery(async file => file === fallbackDelivery.file ? Buffer.alloc(fallbackDelivery.bytes) : readFile(file)));
});
test('real browser release check compares every decoded PNG/WebP byte, not a sampled screenshot', async () => {
  const verifier = await read('scripts/verify-release-browser.mjs');
  for (const marker of ["from './release-loading.mjs'", 'decodedRgbaSha256', 'getImageData(0,0,width,height)', 'original[index] !== delivered[index]', "crypto.subtle.digest('SHA-256', delivered)"]) assert(verifier.includes(marker), marker);
});
test('unchanged release Lighthouse gate runs once early, then ordinary and release browser coverage remain', async () => {
  const ci = await read('.github/workflows/site.yml');
  const gate = 'VERIFY_PREFIX=release- npm run test:performance';
  assert.equal(ci.split(gate).length, 2);
  assert(ci.indexOf(gate) < ci.indexOf('npm run test:browser'));
  assert(ci.indexOf('npm run build',ci.indexOf(gate)) < ci.indexOf('npm run test:browser'), 'Restore ordinary pages before legacy browser checks');
  for (const marker of ['node scripts/verify-release-browser.mjs', 'TEST_PAGE=/ TEST_RELEASE=1', 'TEST_PAGE=/ VERIFY_OUTPUT=preview-review/release-flight']) assert(ci.includes(marker), marker);
  const performance = await read('scripts/performance.mjs');
  assert(performance.includes('if(score<90)') && performance.includes("numericValue!==0"), 'No threshold or CLS change');
});
