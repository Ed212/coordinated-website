import assert from 'node:assert/strict';

// Retain the approved base presentation and append the isolated visual refinement.
// Keep production metadata, original text, controls, footage and playback unchanged.
// The decorative backdrop must not compete with the visible launch poster.
export const blueGalaxyStyles = ['blue-galaxy-study.css', 'hero-composition.css', 'visual-refinement.css'];
export const blueGalaxyAsset = 'assets/galaxy/blue-merger-study.png';
export function blueGalaxyRelease(page) {
  const oldClass = 'class="homepage-clarity launch-preview galaxy-preview"';
  const oldHeadline = '<h1 id="hero-title">Launch fast. Learn <span class="headline-phrase">what lands.</span> Act on that learning.</h1>';
  const displayHeadline = '<h1 id="hero-title"><span class="display-line">Launch fast.</span> <span class="display-line">Learn what lands.</span> <span class="display-line">Act on that learning.</span></h1>';
  const oldCamera = '<picture class="galaxy-camera"><source media="(max-width: 760px)" srcset="assets/galaxy/landscape-1200.webp"><img src="assets/galaxy/landscape-1600.webp" width="1600" height="889" alt="" loading="lazy" decoding="async"></picture>';
  for (const marker of [oldClass, oldCamera, oldHeadline, '<div class="hero-product"', '</head>']) assert.equal(page.split(marker).length, 2, `Expected unique approved release marker: ${marker}`);
  return page.replace(oldClass, 'class="homepage-clarity launch-preview galaxy-preview blue-galaxy-study hero-composition visual-refinement"')
    .replace(oldHeadline, displayHeadline)
    .replace(oldCamera, `<picture class="galaxy-camera"><img src="${blueGalaxyAsset}" width="1681" height="936" alt="" fetchpriority="low" decoding="async"></picture>`)
    .replace('<div class="hero-product"', '<div id="product-preview" class="hero-product"')
    .replace('</head>', '<link rel="preload" as="font" href="assets/fonts/bricolage-grotesque-latin.ttf" type="font/ttf" crossorigin>\n<script src="hero-composition.js" type="module"></script>\n</head>');
}
