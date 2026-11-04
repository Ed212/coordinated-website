import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { heroFilmAssets } from '../hero-film-assets.js';

const base = new URL(process.env.BASE_URL || 'http://127.0.0.1:4188');
const experiment = new URL(process.env.HERO_FILM_URL || '/hero-film.html', base).href;
const out = process.env.HERO_FILM_EVIDENCE || 'preview-review/hero-film-local/interaction-final';
const timeout = 30000;
const results = [];
let browser;
await mkdir(out, { recursive: true });

const assets = Object.fromEntries(Object.entries(heroFilmAssets).map(([key, asset]) => {
  assert(['launch', 'galaxy'].includes(key));
  assert.equal(typeof asset.file, 'string');
  const path = asset.file.includes('/') ? asset.file : `assets/video/${asset.file}`;
  const url = new URL('/' + path.replace(/^\/+/, ''), base);
  assert.equal(url.origin, base.origin, 'Media stays on the preview origin');
  assert(Number.isSafeInteger(asset.bytes) && asset.bytes > 1024);
  assert(/^[a-f0-9]{64}$/.test(asset.sha256));
  assert(Number.isFinite(asset.duration) && asset.duration > 0);
  assert(asset.width > 0 && asset.height > 0);
  return [key, { ...asset, url: url.href }];
}));
assert(assets.launch && assets.galaxy, 'Both supplied clips are required');
assert.equal(assets.galaxy.bytes, 3031532);
assert.equal(assets.galaxy.sha256, '588c3572cc957743052af91149f6bfd44020bcd51cab002d4b18559cf658af2c');
assert.equal(assets.galaxy.width, 1920);
assert.equal(assets.galaxy.height, 1080);
assert(Math.abs(assets.galaxy.duration - 10.041667) < 0.001);

const mediaIds = { launch: 'hero-launch-video', galaxy: 'hero-galaxy-video' };
const isMediaRequest = url => /\.(?:mp4|webm)(?:[?#]|$)/i.test(url);
const fetchTimed = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });

async function instrument(page) {
  const trace = { requests: [], console: [], errors: [], responses: [], failed: [] };
  page.on('request', request => trace.requests.push({ url: request.url(), method: request.method() }));
  page.on('console', message => { if (message.type() === 'error') trace.console.push(message.text()); });
  page.on('pageerror', error => trace.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) trace.responses.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => {
    const reason = request.failure()?.errorText || '';
    if (!/ERR_ABORTED|NS_BINDING_ABORTED|cancelled|canceled/i.test(reason)) trace.failed.push(`${reason} ${request.url()}`);
  });
  await page.addInitScript(() => {
    window.heroMotionTrace = { states: [], sources: [], loads: [], ended: [] };
    const nativeLoad = HTMLMediaElement.prototype.load;
    HTMLMediaElement.prototype.load = function (...args) {
      if (/^hero-(launch|galaxy)-video$/.test(this.id)) window.heroMotionTrace.loads.push({ id: this.id, src: this.getAttribute('src') });
      return Reflect.apply(nativeLoad, this, args);
    };
    document.addEventListener('ended', event => {
      if (/^hero-(launch|galaxy)-video$/.test(event.target.id)) window.heroMotionTrace.ended.push(event.target.id);
    }, true);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.attributeName === 'data-motion-state' && record.target.matches('[data-hero]')) window.heroMotionTrace.states.push(record.oldValue, record.target.dataset.motionState);
        if (record.attributeName === 'src' && /^hero-(launch|galaxy)-video$/.test(record.target.id)) window.heroMotionTrace.sources.push({ id: record.target.id, src: record.target.getAttribute('src') });
      }
    }).observe(document, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['data-motion-state', 'src'] });
  });
  return trace;
}

function assertClean(trace) {
  assert.deepEqual(trace.console, [], 'No unexpected console errors');
  assert.deepEqual(trace.errors, [], 'No page errors throughout the interaction');
  assert.deepEqual(trace.responses, [], 'No failed HTTP responses');
  assert.deepEqual(trace.failed, [], 'No unexpected network failures');
  assert(trace.requests.every(request => request.method === 'GET'), 'The preview performs no uploads or mutations');
}

async function openPreview(page, reduced = false) {
  await page.goto(experiment);
  await page.locator('#hero-film-stage').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.hero-film-poster-image').evaluate(image => image.decode());
  await page.waitForFunction(expected => document.querySelector('#hero-film-load').disabled === expected, reduced);
  await page.waitForFunction(() => document.querySelector('[data-hero]').dataset.motionState === 'static');
}

async function geometry(page) {
  return page.locator('#hero-film-stage').evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
  });
}

async function assertGeometry(page, expected, label) {
  const current = await geometry(page);
  for (const key of Object.keys(expected)) assert(Math.abs(current[key] - expected[key]) <= 1, `${label}: ${key} remains stable`);
}

async function assertLayout(page, immediateCTA = false) {
  const layout = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect();
    const copy = rect('.hero-copy'), stage = rect('#hero-film-stage'), panel = rect('.hero-film-panel');
    const card = rect('.hero-product'), cta = rect('.hero-actions a');
    return {
      overflow: document.scrollingElement.scrollWidth > innerWidth,
      separate: copy.bottom <= stage.top + 1 || copy.right <= stage.left + 1 || stage.right <= copy.left + 1,
      cardBelow: card.top + 1 >= Math.max(copy.bottom, panel.bottom),
      copyFirst: innerWidth > 900 || copy.bottom <= stage.top + 1,
      ctaVisible: cta.top >= 0 && cta.left >= 0 && cta.right <= innerWidth && cta.bottom <= innerHeight,
      fit: getComputedStyle(document.querySelector('.hero-film-poster-image')).objectFit
    };
  });
  assert(!layout.overflow, 'No horizontal overflow');
  assert(layout.separate && layout.copyFirst, 'Copy and film have separate, ordered regions');
  assert(layout.cardBelow, 'The illustrative product card remains below the top hero row');
  assert.equal(layout.fit, 'contain');
  if (immediateCTA) assert(layout.ctaVisible, 'The complete primary CTA is visible without scrolling');
}

async function assertStatic(page, sourcesCleared = false) {
  await page.waitForFunction(() => {
    const hero = document.querySelector('[data-hero]');
    return hero.dataset.motionState === 'static' && [...hero.querySelectorAll('video')].every(video => video.paused && video.hidden);
  });
  assert(await page.locator('.hero-film-poster').isVisible(), 'Exact static artwork is visible');
  assert(await page.locator('#hero-film-play').isDisabled());
  assert(!(await page.locator('#hero-film-reset').isDisabled()));
  if (sourcesCleared) for (const id of Object.values(mediaIds)) assert.equal(await page.locator('#' + id).getAttribute('src'), null);
}

async function waitPlaying(page, clip, after = 0.15) {
  await page.waitForFunction(({ clip, after }) => {
    const video = document.querySelector(`#hero-${clip}-video`);
    return document.querySelector('[data-hero]').dataset.motionState === clip && !video.paused && video.currentTime > after;
  }, { clip, after }, { timeout });
  const metadata = await page.locator('#' + mediaIds[clip]).evaluate(video => ({ width: video.videoWidth, height: video.videoHeight, duration: video.duration, muted: video.muted }));
  assert.equal(metadata.width, assets[clip].width);
  assert.equal(metadata.height, assets[clip].height);
  assert(Math.abs(metadata.duration - assets[clip].duration) < 0.1);
  assert(metadata.muted, 'Motion remains muted');
}

async function pauseResume(page, clip) {
  const video = page.locator('#' + mediaIds[clip]);
  await page.locator('#hero-film-play').click();
  await page.waitForFunction(clip => document.querySelector('[data-hero]').dataset.motionState === `paused-${clip}`, clip);
  assert(await video.evaluate(element => element.paused));
  const paused = await video.evaluate(element => element.currentTime);
  await page.waitForTimeout(180);
  assert(Math.abs(await video.evaluate(element => element.currentTime) - paused) < 0.03, 'Paused media time stays still');
  await page.locator('#hero-film-play').click();
  await waitPlaying(page, clip, paused + 0.1);
}

async function nearEnd(page, clip) {
  await page.locator('#' + mediaIds[clip]).evaluate(video => new Promise((resolve, reject) => {
    const done = error => {
      clearTimeout(timer);
      video.removeEventListener('seeked', seeked);
      video.removeEventListener('error', failed);
      error ? reject(error) : resolve();
    };
    const seeked = () => done(), failed = () => done(new Error('Media seek failed'));
    const timer = setTimeout(() => done(new Error('Media seek timed out')), 10000);
    video.addEventListener('seeked', seeked, { once: true });
    video.addEventListener('error', failed, { once: true });
    video.currentTime = video.duration - 0.2;
  }));
}

async function keyboardStill(page, expectedGeometry) {
  await page.locator('#hero-film-reset').focus();
  await page.keyboard.press('Enter');
  await assertStatic(page, true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'hero-film-reset', 'Still keeps keyboard focus');
  await assertGeometry(page, expectedGeometry, 'Still');
}

async function pendingCancellation(clip, reduce) {
  const page = await browser.newPage({ viewport: { width: 400, height: 900 }, reducedMotion: 'no-preference' });
  const trace = await instrument(page);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let intercepted;
  const started = new Promise(resolve => { intercepted = resolve; });
  const handlers = [];
  await page.route(assets[clip].url, route => {
    const handling = (async () => {
      intercepted();
      await gate;
      try { await route.continue(); }
      catch (error) { if (!/closed|cancel|abort|Invalid InterceptionId/i.test(error.message)) throw error; }
    })();
    handlers.push(handling);
    return handling;
  });
  try {
    await openPreview(page);
    const initial = await geometry(page);
    await page.locator(clip === 'launch' ? '#hero-film-load' : '#hero-galaxy-play').click();
    let startTimer;
    try { await Promise.race([started, new Promise((_, reject) => { startTimer = setTimeout(() => reject(new Error(`No pending ${clip} request`)), 10000); })]); }
    finally { clearTimeout(startTimer); }
    await page.waitForFunction(clip => document.querySelector('[data-hero]').dataset.motionState === `loading-${clip}`, clip);
    if (reduce) await page.emulateMedia({ reducedMotion: 'reduce' });
    else await keyboardStill(page, initial);
    await assertStatic(page);
    const status = await page.locator('#hero-film-status').innerText();
    release();
    await Promise.all(handlers);
    await page.evaluate(async () => {
      for (let index = 0; index < 4; index++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (document.querySelector('[data-hero]').dataset.motionState !== 'static' || [...document.querySelectorAll('[data-hero] video')].some(video => !video.paused || !video.hidden)) throw new Error('Canceled media resumed');
      }
    });
    assert.equal(await page.locator('#hero-film-status').innerText(), status, 'Canceled play promises do not replace the current status');
    if (reduce) {
      assert(await page.locator('#hero-film-load').isDisabled());
      assert(await page.locator('#hero-galaxy-play').isDisabled());
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await assertStatic(page);
    } else assert.equal(await page.evaluate(() => document.activeElement.id), 'hero-film-reset');
    await assertGeometry(page, initial, 'Pending cancellation');
    assertClean(trace);
    results.push(`PASS pending ${clip} media response: ${reduce ? 'reduced motion' : 'keyboard Still'} cancels loading, preserves state/status/geometry and never resumes stale work.`);
  } finally {
    release();
    await page.close();
  }
}

async function pendingPlayCancellation(clip, reduce) {
  const page = await browser.newPage({ viewport: { width: 400, height: 900 }, reducedMotion: 'no-preference' });
  const trace = await instrument(page);
  await page.addInitScript(id => {
    const nativePlay = HTMLMediaElement.prototype.play;
    window.heroHeldPlay = { used: false, ready: false, release: null };
    HTMLMediaElement.prototype.play = function (...args) {
      const result = Reflect.apply(nativePlay, this, args);
      if (this.id !== id || window.heroHeldPlay.used) return result;
      window.heroHeldPlay.used = true;
      return result.then(() => new Promise(resolve => {
        window.heroHeldPlay.ready = true;
        window.heroHeldPlay.release = resolve;
      }));
    };
  }, mediaIds[clip]);
  try {
    await openPreview(page);
    const initial = await geometry(page);
    await page.locator(clip === 'launch' ? '#hero-film-load' : '#hero-galaxy-play').click();
    await page.waitForFunction(() => window.heroHeldPlay.ready);
    if (reduce) await page.emulateMedia({ reducedMotion: 'reduce' });
    else await keyboardStill(page, initial);
    await assertStatic(page);
    const status = await page.locator('#hero-film-status').innerText();
    await page.evaluate(() => window.heroHeldPlay.release());
    await page.evaluate(async () => {
      for (let index = 0; index < 4; index++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (document.querySelector('[data-hero]').dataset.motionState !== 'static' || [...document.querySelectorAll('[data-hero] video')].some(video => !video.paused || !video.hidden)) throw new Error('Stale play completion changed the current state');
      }
    });
    assert.equal(await page.locator('#hero-film-status').innerText(), status);
    if (!reduce) assert.equal(await page.evaluate(() => document.activeElement.id), 'hero-film-reset');
    await assertGeometry(page, initial, 'Held play completion');
    assertClean(trace);
    results.push(`PASS deferred ${clip} play() completion: ${reduce ? 'reduced motion' : 'keyboard Still'} remains authoritative after the old promise resolves.`);
  } finally {
    await page.evaluate(() => window.heroHeldPlay?.release?.()).catch(() => {});
    await page.close();
  }
}

try {
  for (const [clip, asset] of Object.entries(assets)) {
    for (const [range, start, end] of [['bytes=0-1023', 0, 1023], ['bytes=-1024', asset.bytes - 1024, asset.bytes - 1]]) {
      const response = await fetchTimed(asset.url, { headers: { Range: range } });
      assert.equal(response.status, 206, `${clip} supports byte ranges`);
      assert(response.headers.get('content-type')?.startsWith('video/mp4'));
      assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${asset.bytes}`);
      assert.equal((await response.arrayBuffer()).byteLength, 1024);
    }
    const response = await fetchTimed(asset.url);
    assert.equal(response.status, 200);
    assert(response.headers.get('content-type')?.startsWith('video/mp4'));
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    results.push(`PASS ${clip}: exact supplied bytes/SHA-256, video/mp4 MIME, initial/tail ranges; ${asset.width}x${asset.height}, ${asset.duration}s${asset.provisional ? ' (provisional)' : ''}.`);
  }
  for (const name of ['rocket-galaxies-v2.mp4', 'launch-to-galaxies-web.mp4']) assert.equal((await fetchTimed(new URL('/assets/video/' + name, base))).status, 404);
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });

  const ordinary = await browser.newPage({ viewport: { width: 400, height: 900 } });
  const ordinaryTrace = await instrument(ordinary);
  await ordinary.goto(base.href);
  await ordinary.waitForLoadState('networkidle');
  assert.equal(await ordinary.locator('video,.hero-film-stage,.hero-film-controls').count(), 0);
  assert(!ordinaryTrace.requests.some(request => request.url.includes('hero-film-preview.js') || isMediaRequest(request.url)));
  assertClean(ordinaryTrace);
  await ordinary.close();
  results.push('PASS ordinary root: no experiment DOM, module request or video fetch.');

  for (const width of [400, 1100]) {
    const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const requests = [];
    nojs.on('request', request => requests.push(request.url()));
    await nojs.goto(experiment);
    await nojs.evaluate(() => document.fonts.ready);
    assert(await nojs.locator('body').evaluate(body => body.classList.contains('hero-film-experiment')));
    assert(await nojs.locator('.hero-film-poster-image').isVisible());
    assert(await nojs.locator('#hero-film-load').isDisabled());
    for (const id of Object.values(mediaIds)) {
      assert.equal(await nojs.locator('#' + id).getAttribute('src'), null);
      assert.equal(await nojs.locator('#' + id).getAttribute('preload'), 'none');
    }
    await assertLayout(nojs, true);
    assert(!requests.some(isMediaRequest));
    await nojs.close();
  }
  results.push('PASS no JavaScript at 400/1100px: stable static structure, no media fetch, complete primary CTA visible.');

  const reduced = await browser.newPage({ viewport: { width: 400, height: 900 }, reducedMotion: 'reduce' });
  const reducedTrace = await instrument(reduced);
  await openPreview(reduced, true);
  await assertStatic(reduced);
  assert(await reduced.locator('#hero-galaxy-play').isDisabled());
  assert(!reducedTrace.requests.some(request => isMediaRequest(request.url)));
  await reduced.emulateMedia({ reducedMotion: 'no-preference' });
  await assertStatic(reduced);
  assertClean(reducedTrace);
  await reduced.close();
  results.push('PASS initial reduced motion: both motion actions disabled, exact still shown, no media fetched and no automatic resume.');

  for (const width of [400, 1100]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const trace = await instrument(page);
    await openPreview(page);
    await assertStatic(page, true);
    await assertLayout(page, true);
    const initial = await geometry(page);
    for (const id of Object.values(mediaIds)) {
      assert.equal(await page.locator('#' + id).getAttribute('preload'), 'none');
      assert.equal(await page.locator('#' + id).getAttribute('autoplay'), null);
    }
    assert(!trace.requests.some(request => isMediaRequest(request.url)), 'Neither film is fetched initially');
    await page.screenshot({ path: `${out}/static-${width}.png`, fullPage: true });
    await page.screenshot({ path: `${out}/viewport-${width}.png` });
    await page.locator('#hero-film-load').click();
    await waitPlaying(page, 'launch');
    assert.equal(await page.locator('#hero-galaxy-video').getAttribute('src'), null, 'Galaxy remains unloaded until requested');
    await pauseResume(page, 'launch');
    await assertGeometry(page, initial, 'Launch playback');
    if (width === 400) {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await assertStatic(page);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await assertStatic(page);
      await page.locator('#hero-film-load').click();
      await waitPlaying(page, 'launch');
    }
    await page.locator('#hero-galaxy-play').focus();
    await page.keyboard.press('Enter');
    await waitPlaying(page, 'galaxy');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'hero-galaxy-play', 'Keyboard Skip keeps focus');
    assert(await page.locator('#hero-launch-video').evaluate(video => video.paused));
    await pauseResume(page, 'galaxy');
    await assertGeometry(page, initial, 'Galaxy playback');
    await page.locator('#hero-film-stage').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/galaxy-${width}.png` });
    await keyboardStill(page, initial);

    await page.locator('#hero-film-load').click();
    await waitPlaying(page, 'launch');
    if (width === 400) await nearEnd(page, 'launch');
    await page.waitForFunction(() => document.querySelector('[data-hero]').dataset.motionState === 'galaxy', {}, { timeout: Math.ceil((assets.launch.duration + 15) * 1000) });
    await waitPlaying(page, 'galaxy');
    assert(await page.evaluate(() => window.heroMotionTrace.ended.includes('hero-launch-video')), 'Actual launch completion starts the galaxy clip');
    const states = await page.evaluate(() => window.heroMotionTrace.states);
    assert(states.includes('loading-launch') && states.includes('loading-galaxy'));
    const loopStart = await page.locator('[data-hero]').evaluate(hero => Number(hero.dataset.galaxyLoops || 0));
    const beforeLoop = await page.evaluate(() => ({
      sources: window.heroMotionTrace.sources.filter(record => record.id === 'hero-galaxy-video').length,
      loads: window.heroMotionTrace.loads.filter(record => record.id === 'hero-galaxy-video').length,
      src: document.querySelector('#hero-galaxy-video').currentSrc
    }));
    if (width === 400) await nearEnd(page, 'galaxy');
    await page.waitForFunction(start => Number(document.querySelector('[data-hero]').dataset.galaxyLoops) > start, loopStart, { timeout: Math.ceil((assets.galaxy.duration + 15) * 1000) });
    await waitPlaying(page, 'galaxy');
    const afterLoop = await page.evaluate(() => ({
      sources: window.heroMotionTrace.sources.filter(record => record.id === 'hero-galaxy-video').length,
      loads: window.heroMotionTrace.loads.filter(record => record.id === 'hero-galaxy-video').length,
      src: document.querySelector('#hero-galaxy-video').currentSrc
    }));
    assert.deepEqual(afterLoop, beforeLoop, 'Galaxy loop rewinds the same source without reassignment or another load()');
    await assertGeometry(page, initial, 'Transition and loop');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await assertStatic(page);
    assert(await page.locator('#hero-film-load').isDisabled());
    assert(await page.locator('#hero-galaxy-play').isDisabled());
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await assertStatic(page);
    await keyboardStill(page, initial);
    assertClean(trace);
    await page.getByRole('link', { name: 'Return to ordinary preview' }).click();
    assert.equal(await page.locator('.hero-film-stage').count(), 0);
    assertClean(trace);
    await page.close();
    results.push(`PASS ${width}px: single-action launch, pause/resume both clips, keyboard Skip/Still with focus, actual launch-to-galaxy transition, galaxy loop with retained source, stable geometry and reduced-motion interruption; ${width === 1100 ? 'transition and loop played at normal speed' : 'end transitions exercised by bounded seek'}.`);
  }

  await pendingCancellation('launch', false);
  await pendingCancellation('galaxy', false);
  await pendingCancellation('galaxy', true);
  await pendingPlayCancellation('launch', false);
  await pendingPlayCancellation('galaxy', true);

  const remote = await browser.newPage();
  const remoteTrace = await instrument(remote);
  const root = resolve('dist');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
  const mockHost = 'https://deploy-preview-999--mellow-lokum-bcedf5.netlify.app';
  await remote.route(`${mockHost}/**`, async route => {
    const url = new URL(route.request().url());
    let file = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    if (!extname(file)) file += '.html';
    if (!file.startsWith(root + '/')) return route.fulfill({ status: 403, body: '' });
    try { await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] || 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await remote.goto(`${mockHost}/?heroFilm=1`);
  await remote.waitForLoadState('networkidle');
  assert.equal(await remote.locator('.hero-film-stage,video').count(), 0);
  assert(!remoteTrace.requests.some(request => request.url.includes('hero-film-preview.js') || isMediaRequest(request.url)));
  for (const path of ['/hero-film.html', '/hero-film']) {
    await remote.goto(mockHost + path);
    await remote.waitForFunction(() => !document.querySelector('#hero-film-load').disabled);
    for (const id of Object.values(mediaIds)) assert.equal(await remote.locator('#' + id).getAttribute('src'), null);
    assert.equal(await remote.locator('#hero-film-file').count(), 0);
    for (const width of [320, 375, 768, 1440]) {
      await remote.setViewportSize({ width, height: 900 });
      await remote.evaluate(() => document.fonts.ready);
      await assertLayout(remote);
    }
  }
  assert(!remoteTrace.requests.some(request => isMediaRequest(request.url)));
  assertClean(remoteTrace);
  await remote.close();
  results.push('PASS mocked hosted root guard and both dedicated paths: no initial media fetch, no file picker, 320/375/768/1440px layout.');
  if (assets.launch.provisional) results.push('LIMIT: launch clip is provisional; replacement repair and publication checkpoint remain pending.');
  results.push('LIMIT: physical iOS/Safari not tested.');
} catch (error) {
  results.push(`FAIL ${error.stack || error.message}`);
  throw error;
} finally {
  if (browser) await browser.close();
  await writeFile(`${out}/checks.txt`, results.join('\n') + '\n');
  console.log(results.join('\n'));
}
