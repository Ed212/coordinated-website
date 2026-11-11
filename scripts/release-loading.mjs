import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export const releaseStyles = ['launch-preview.css','fonts.css','styles.css','hero-live.css','galaxy-scroll.css','northstar-walkthrough.css'];
export const releaseStylesheet = 'release-styles.css';
export const motionFallbackVisibility = '.launch-preview:is([data-flight-phase="launch"],[data-flight-phase="departure"],[data-flight-phase="loop"],[data-flight-phase="loading-loop"]) .flight-fallback { visibility:hidden; }';
export const fallbackDelivery = JSON.parse(await readFile(new URL('../assets/video/deep-space-final-frame-lossless.json', import.meta.url), 'utf8'));
export const launchPoster = JSON.parse(await readFile(new URL('../assets/video/arc-launch.json', import.meta.url), 'utf8')).poster;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

// No minification or CSS rewriting: keep the original bytes in their cascade order.
export async function releaseStyleBundle(read = readFile) {
  return (await Promise.all(releaseStyles.map(file => read(file, 'utf8')))).join('\n') + '\n' + motionFallbackVisibility + '\n';
}
export async function verifyFallbackDelivery(read = readFile) {
  const bytes = await read(fallbackDelivery.file);
  assert.equal(bytes.length, fallbackDelivery.bytes);
  assert.equal(digest(bytes), fallbackDelivery.sha256, 'Exact verified lossless delivery bytes');
  assert.equal(bytes.toString('ascii',0,4), 'RIFF');
  assert.equal(bytes.toString('ascii',8,16), 'WEBPVP8L', 'Only lossless WebP is permitted');
  assert.equal(digest(await read(fallbackDelivery.source.file)), fallbackDelivery.source.sha256, 'The original final-frame PNG stays unchanged');
}
// Run before image discovery. These are the same static-start conditions as the
// motion controller, not browser/benchmark detection or a delay in the journey.
export function initializeReleaseLoading({fallback, poster}) {
  const preload = (href, type) => {
    const link = document.createElement('link');
    link.rel = 'preload'; link.as = 'image'; link.type = type;
    link.href = href; link.fetchPriority = 'high'; document.head.append(link);
  };
  let fallbackPreloaded = false;
  const prioritizeStill = () => {
    if (!fallbackPreloaded) { preload(fallback, 'image/webp'); fallbackPreloaded = true; }
    const image = document.querySelector('.flight-fallback img');
    if (image) image.fetchPriority = 'high';
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData || location.hash || document.querySelector('.launch-preview')?.dataset.flightPhase === 'still') prioritizeStill();
  else preload(poster, 'image/jpeg');
  // The still phase also covers playback failure and preference changes. Raise
  // priority immediately, including while an existing low-priority fetch runs.
  new MutationObserver(records => {
    if (records.some(record => record.target.matches('.launch-preview') && record.target.dataset.flightPhase === 'still')) prioritizeStill();
  }).observe(document.documentElement, {subtree:true,attributes:true,attributeFilter:['data-flight-phase']});
}
export function releaseLoadingPage(page) {
  const tags = [...page.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
  assert.deepEqual(tags.map(match => match[1]), releaseStyles, 'Review any cascade/order change before bundling');
  const oldPreload = `<link rel="preload" as="image" href="${fallbackDelivery.source.file}" fetchpriority="high">`;
  const oldPicture = `<picture class="flight-fallback"><img src="${fallbackDelivery.source.file}"`;
  assert.equal(page.split(oldPreload).length, 2, 'Expected exactly the approved PNG preload');
  assert.equal(page.split(oldPicture).length, 2, 'Expected exactly the approved PNG fallback');
  assert.equal(page.split('<head>').length, 2);
  assert(page.includes(`poster="${launchPoster}"`), 'Only the unchanged selected launch poster is preloaded');
  const charset = '<meta charset="utf-8">', viewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
  assert.equal(page.split(charset).length, 2); assert.equal(page.split(viewport).length, 2);
  page = page.replace(charset, '').replace(viewport, '');
  const bootstrap = `(${initializeReleaseLoading.toString()})(${JSON.stringify({fallback:fallbackDelivery.file,poster:launchPoster})});`;
  const preload = `<noscript><link rel="preload" as="image" type="image/webp" href="${fallbackDelivery.file}" fetchpriority="high"></noscript><script>${bootstrap}</script>`;
  page = page.replace(oldPreload, '').replace('<head>', `<head>\n${charset}\n${viewport}\n${preload}`);
  page = page.replace(oldPicture, `<picture class="flight-fallback"><source type="image/webp" srcset="${fallbackDelivery.file}"><img src="${fallbackDelivery.source.file}"`);
  const image = page.match(/<picture class="flight-fallback">[^]*?<\/picture>/)?.[0];
  assert(image?.includes('fetchpriority="high"'));
  page = page.replace(image, image.replace('fetchpriority="high"', 'fetchpriority="low"'));
  let first = true;
  return page.replace(/<link rel="stylesheet" href="([^"]+)">/g, () => {
    if (!first) return '';
    first = false;
    return `<link rel="stylesheet" href="${releaseStylesheet}">`;
  });
}
