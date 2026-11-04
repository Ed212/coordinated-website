import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const source = process.env.HERO_FILM_SOURCE;
if (!source) throw new Error('Set HERO_FILM_SOURCE to the supplied Library video.');
const out = 'preview-review/hero-film-local';
const tag = process.env.HERO_FILM_TAG || 'source';
if (!/^[a-z0-9-]+$/.test(tag)) throw new Error('Use a simple evidence tag.');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:4186'}/?heroFilm=1`);
  await page.setContent('<input id="hero-film-file" type="file" accept="video/mp4,video/webm"><video muted playsinline preload="none"></video>');
  await page.evaluate(() => document.querySelector('input').addEventListener('change', event => {
    const video=document.querySelector('video');video.muted=true;video.src=URL.createObjectURL(event.target.files[0]);video.load();
  }));
  await page.locator('#hero-film-file').setInputFiles(source);
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 1);
  const metadata = await page.locator('video').evaluate(v => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, readyState: v.readyState, paused: v.paused, muted: v.muted, codecSupport: v.canPlayType('video/mp4; codecs="avc1.640028"') }));
  const requested = process.env.HERO_FILM_SAMPLES?.split(',').map(Number);
  const raw = requested || [0.05, .1, .2, .3, .4].map(t => t === .05 ? t : metadata.duration * t).concat([metadata.duration / 2 - .08, metadata.duration / 2 + .08], [.6, .7, .8, .9, .99].map(t => metadata.duration * t));
  if (!raw.length || raw.some(t => !Number.isFinite(t) || t < 0 || t >= metadata.duration)) throw new Error('Sampling times must be finite seconds within this video.');
  const samples = [...new Set(raw.map(t => Number(t.toFixed(3))))].sort((a,b) => a-b);
  metadata.sampleTimes = samples;
  await writeFile(`${out}/${tag}-metadata.json`, JSON.stringify(metadata, null, 2) + '\n');
  const columns = samples.length > 9 ? 4 : 3;
  const rows = Math.ceil(samples.length / columns);
  await page.setViewportSize({ width: columns * 320 + 20, height: rows * 204 + 20 });
  await page.evaluate(({ columns, rows }) => {
    const sheet = document.createElement('canvas'); sheet.id = 'film-inspection'; sheet.width = columns * 320; sheet.height = rows * 204;
    sheet.style = 'position:fixed;top:0;left:0;z-index:999999;background:#000';
    document.body.append(sheet);
  }, { columns, rows });
  for (const [index, time] of samples.entries()) {
    await page.locator('video').evaluate(async (video, time) => {
      await new Promise((resolve, reject) => { video.addEventListener('seeked', resolve, { once: true }); video.addEventListener('error', reject, { once: true }); video.currentTime = time; });
    }, time);
    await page.evaluate(({ index, time, columns }) => {
      const video = document.querySelector('video'); const c = document.querySelector('#film-inspection').getContext('2d');
      const x = (index % columns) * 320, y = Math.floor(index / columns) * 204;
      c.drawImage(video, x, y, 320, 180); c.fillStyle='#fff'; c.font='14px sans-serif'; c.fillText(`${time.toFixed(3)}s — supplied concept`, x + 8, y + 197);
    }, { index, time, columns });
  }
  await page.locator('#film-inspection').screenshot({ path: `${out}/${tag}-frames.png` });
  console.log(JSON.stringify(metadata));
} finally { await browser.close(); }
