const root = document.querySelector('.launch-preview');
const intro = document.querySelector('.launch-intro');
const video = document.querySelector('#launch-intro-video');
const hero = document.querySelector('.hero-layout');
const replay = document.querySelector('.launch-replay');
const pause = document.querySelector('[data-launch-pause]');
const skip = document.querySelector('[data-launch-skip]');
const status = document.querySelector('.launch-status');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let timer, deadline, completed = false, run = 0;
const active = () => root.hasAttribute('data-launch-active');
function showHero(reason = 'complete', moveFocus = false) {
  run += 1; clearTimeout(deadline); clearTimeout(timer); video.pause();
  completed = true; root.dataset.launchState = 'revealing';
  hero.inert = false; hero.removeAttribute('aria-hidden');
  replay.hidden = preference.matches;
  if (moveFocus && !replay.hidden) replay.focus({preventScroll:true});
  const finish = () => { intro.hidden = true; delete root.dataset.launchActive; root.dataset.launchState = reason; };
  if (preference.matches || reason === 'error' || reason === 'autoplay-blocked') finish();
  else timer = setTimeout(finish, 900);
}
async function start() {
  if (preference.matches) { showHero('reduced-motion'); return; }
  const attempt = ++run;
  clearTimeout(timer); clearTimeout(deadline); completed = false;
  intro.hidden = false; replay.hidden = true; root.dataset.launchActive = '';
  root.dataset.launchState = 'loading'; hero.inert = true; hero.setAttribute('aria-hidden','true');
  pause.textContent = 'Pause'; status.textContent = 'Loading launch…';
  if (!video.src) video.src = video.dataset.src;
  video.currentTime = 0;
  deadline = setTimeout(() => { if (attempt === run && video.paused) showHero('error'); }, 4500);
  try {
    await video.play();
    if (attempt !== run || completed) { video.pause(); return; }
    clearTimeout(deadline); root.dataset.launchState = 'playing'; status.textContent = '10-second launch · then the galaxy hero';
  } catch { if (attempt === run) showHero('autoplay-blocked'); }
}
pause.addEventListener('click', async () => {
  if (!active() || completed) return;
  if (!video.paused) { video.pause(); pause.textContent = 'Resume'; root.dataset.launchState = 'paused'; status.textContent = 'Paused'; }
  else {
    try { await video.play(); if (completed) {video.pause();return;} pause.textContent = 'Pause'; root.dataset.launchState = 'playing'; status.textContent = '10-second launch · then the galaxy hero'; }
    catch { showHero('error',true); }
  }
});
skip.addEventListener('click', () => showHero('skipped',true));
replay.addEventListener('click', () => { start(); skip.focus({preventScroll:true}); });
video.addEventListener('ended', () => { if (!completed) showHero('complete',intro.contains(document.activeElement)); });
video.addEventListener('error', () => { if (!completed) showHero('error',intro.contains(document.activeElement)); });
preference.addEventListener('change', () => { if (preference.matches) showHero('reduced-motion'); else replay.hidden = false; });
document.addEventListener('visibilitychange', () => {
 if (document.hidden && active() && !video.paused && !completed) { video.pause(); pause.textContent='Resume'; root.dataset.launchState='paused'; status.textContent='Paused while this tab is hidden'; }
});
// Navigation and contact work immediately; never force a visitor to wait through the film.
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {if(active())showHero('skipped');}));
if (preference.matches || navigator.connection?.saveData || location.hash) showHero(preference.matches?'reduced-motion':'still');
else start();
