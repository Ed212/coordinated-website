import assert from 'node:assert/strict';

// Exact presentation approved in private review commit 03275e42fed674249237b046cc01532ed9a5cec6.
// Keep production metadata, original text, controls, footage and playback unchanged.
export const blueGalaxyStyles = ['blue-galaxy-study.css', 'hero-composition.css'];
export const blueGalaxyAsset = 'assets/galaxy/blue-merger-study.png';
export function blueGalaxyRelease(page) {
  const oldClass = 'class="homepage-clarity launch-preview galaxy-preview"';
  const oldCamera = '<picture class="galaxy-camera"><source media="(max-width: 760px)" srcset="assets/galaxy/landscape-1200.webp"><img src="assets/galaxy/landscape-1600.webp" width="1600" height="889" alt="" loading="lazy" decoding="async"></picture>';
  for (const marker of [oldClass, oldCamera, '<div class="hero-product"', '</head>']) assert.equal(page.split(marker).length, 2, `Expected unique approved release marker: ${marker}`);
  return page.replace(oldClass, 'class="homepage-clarity launch-preview galaxy-preview blue-galaxy-study hero-composition"')
    .replace(oldCamera, `<picture class="galaxy-camera"><img src="${blueGalaxyAsset}" width="1681" height="936" alt="" fetchpriority="high" decoding="async"></picture>`)
    .replace('<div class="hero-product"', '<div id="product-preview" class="hero-product"')
    .replace('</head>', '<script src="hero-composition.js" type="module"></script>\n</head>');
}
