import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export const releaseStyles = ['launch-preview.css','fonts.css','styles.css','hero-live.css','galaxy-scroll.css','northstar-walkthrough.css'];
export const releaseStylesheet = 'release-styles.css';
export const fallbackDelivery = JSON.parse(await readFile(new URL('../assets/video/deep-space-final-frame-lossless.json', import.meta.url), 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

// No minification or CSS rewriting: keep the original bytes in their cascade order.
export async function releaseStyleBundle(read = readFile) {
  return (await Promise.all(releaseStyles.map(file => read(file, 'utf8')))).join('\n');
}
export async function verifyFallbackDelivery(read = readFile) {
  const bytes = await read(fallbackDelivery.file);
  assert.equal(bytes.length, fallbackDelivery.bytes);
  assert.equal(digest(bytes), fallbackDelivery.sha256, 'Exact verified lossless delivery bytes');
  assert.equal(bytes.toString('ascii',0,4), 'RIFF');
  assert.equal(bytes.toString('ascii',8,16), 'WEBPVP8L', 'Only lossless WebP is permitted');
  assert.equal(digest(await read(fallbackDelivery.source.file)), fallbackDelivery.source.sha256, 'The original final-frame PNG stays unchanged');
}
export function releaseLoadingPage(page) {
  const tags = [...page.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
  assert.deepEqual(tags.map(match => match[1]), releaseStyles, 'Review any cascade/order change before bundling');
  const oldPreload = `<link rel="preload" as="image" href="${fallbackDelivery.source.file}" fetchpriority="high">`;
  const oldPicture = `<picture class="flight-fallback"><img src="${fallbackDelivery.source.file}"`;
  assert.equal(page.split(oldPreload).length, 2, 'Expected exactly the approved PNG preload');
  assert.equal(page.split(oldPicture).length, 2, 'Expected exactly the approved PNG fallback');
  assert.equal(page.split('<head>').length, 2);
  page = page.replace(oldPreload, '').replace('<head>', `<head>\n<link rel="preload" as="image" type="image/webp" href="${fallbackDelivery.file}" fetchpriority="high">`);
  page = page.replace(oldPicture, `<picture class="flight-fallback"><source type="image/webp" srcset="${fallbackDelivery.file}"><img src="${fallbackDelivery.source.file}"`);
  let first = true;
  return page.replace(/<link rel="stylesheet" href="([^"]+)">/g, () => {
    if (!first) return '';
    first = false;
    return `<link rel="stylesheet" href="${releaseStylesheet}">`;
  });
}
