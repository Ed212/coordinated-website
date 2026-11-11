import assert from 'node:assert/strict';
export const productionOrigin = 'https://coordinatedai.ai';
export function canonicalPage(page, path) {
  assert(!page.includes('rel="canonical"'), 'Do not duplicate canonical metadata');
  const url = productionOrigin + path;
  assert.equal((page.match(/<meta property="og:url"[^>]*>/g) || []).length, 1);
  return page.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}">`)
    .replace('</head>', `<link rel="canonical" href="${url}">\n</head>`);
}
export function releaseHomepage(galaxy, {indexable = true} = {}) {
  const robots = '<meta name="robots" content="noindex,nofollow">';
  const banner = /<aside class="study-banner" aria-label="About this preview">[^]*?<\/aside>/g;
  assert.equal(galaxy.split(robots).length, 2, 'Expected exactly one study robots directive');
  assert.equal([...galaxy.matchAll(banner)].length, 1, 'Expected exactly one study banner');
  assert(galaxy.includes('Prelaunch. Software in development.'), 'Product maturity disclosure must survive release');
  return canonicalPage(galaxy.replace(robots, indexable ? '' : robots).replace(banner, ''), '/');
}
