/* Scroll sets the camera directly. No loop, inertia, scroll hijacking, or new media. */
const root = document.querySelector('.galaxy-preview');
const camera = document.querySelector('.galaxy-camera');
const content = document.querySelector('[data-galaxy-content]');
const controls = document.querySelector('.galaxy-navigation');
const button = document.querySelector('[data-galaxy-motion]');
const locationLabel = document.querySelector('.galaxy-location');
const meter = document.querySelector('.galaxy-progress i');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 760px)');
const connection = navigator.connection;
const chapters = [...content.querySelectorAll('[data-galaxy-chapter]')];
let manualPause = false, frame = 0, start = 0, end = 1, positions = [];
const clamp = n => Math.max(0, Math.min(1, n));
const constrained = () => reduced.matches || Boolean(connection?.saveData);
function measure() {
  start = content.getBoundingClientRect().top + scrollY;
  end = Math.max(start + 1, content.getBoundingClientRect().bottom + scrollY - innerHeight);
  positions = chapters.map(chapter => chapter.getBoundingClientRect().top + scrollY);
}
function render() {
  frame = 0;
  if (document.hidden) return;
  const progress = clamp((scrollY - start) / (end - start));
  const stopped = manualPause || constrained();
  root.dataset.galaxyMotion = stopped ? 'still' : 'scroll';
  if (!stopped) {
    // Advance along the same spiral from arrival to the brighter central region.
    // The smaller mobile move avoids large lateral motion in a narrow viewport.
    const zoom = compact.matches ? .28 : .64;
    const travel = compact.matches ? 2 : 5;
    camera.style.transform = `translate3d(${-travel * progress}%,${2 * progress}%,0) scale(${1.06 + zoom * progress})`;
  } else if (constrained()) camera.style.removeProperty('transform');
  meter.style.transform = `scaleX(${progress})`;
  const chapter = chapters[positions.reduce((active, top, index) => top <= scrollY + innerHeight * .42 ? index : active, 0)];
  locationLabel.textContent = `${chapter.dataset.galaxyChapter} / 05 · ${chapter.dataset.galaxyLabel}`;
  button.disabled = constrained();
  button.setAttribute('aria-pressed', String(stopped));
  button.textContent = constrained() ? 'Still view enabled' : manualPause ? 'Resume scroll motion' : 'Pause scroll motion';
  root.dataset.galaxyProgress = progress.toFixed(4);
}
function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
function resize() { measure(); schedule(); }
button.addEventListener('click', () => { manualPause = !manualPause; schedule(); });
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('pageshow', resize);
window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
document.addEventListener('visibilitychange', schedule);
reduced.addEventListener('change', resize);
compact.addEventListener('change', resize);
connection?.addEventListener('change', resize);
new ResizeObserver(resize).observe(content);
// Keep the hero's explicit still-image choice consistent across the page.
// Offscreen hero pausing is automatic and does not disable scroll traversal.
document.querySelector('[data-flight-still]')?.addEventListener('click', () => { manualPause = true; schedule(); });
controls.hidden = false;
resize();
