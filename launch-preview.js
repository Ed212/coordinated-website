// The deployed flight path, with an appearance-only launch edit and native late-flight loop.
const root = document.querySelector('.launch-preview');
const layer = document.querySelector('.flight-animation');
const launch = document.querySelector('#launch-intro-video');
const departure = document.querySelector('#departure-video');
const flight = document.querySelector('#distant-flight-video');
const videos = [launch, departure, flight];
const controls = document.querySelector('.flight-controls');
const replay = document.querySelector('[data-flight-replay]');
const skip = document.querySelector('[data-flight-skip]');
const pause = document.querySelector('[data-flight-pause]');
const status = document.querySelector('.flight-status');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
const entry = Number(flight.dataset.sourceEntry);
const matchUntil = Number(flight.dataset.sourceMatchUntil);
const fps = Number(flight.dataset.fps);
const handoffDuration = .8;
const loopDissolve = .125;
const tolerance = 2 / fps;
const smooth = n => { n = Math.max(0, Math.min(1, n)); return n * n * (3 - 2 * n); };
let phase = 'still', run = 0, manualPause = false, inView = true, pageActive = true;
let startingDeparture = null, loopAttempt = null, loopFailed = false, timeout, raf;
const callbacks = new Map();
const presented = new Map();
const nativeFrames = 'requestVideoFrameCallback' in launch;
const moving = () => phase !== 'still' && !manualPause && !preference.matches && !document.hidden && inView && pageActive;
const wanted = video => moving() && (video === launch && !launch.ended && (phase === 'launch' || phase === 'departure' && departure.currentTime < handoffDuration) || video === departure && (phase === 'departure' || Boolean(startingDeparture)) || video === flight && (phase === 'loop' || Boolean(loopAttempt)));
function phaseTo(next) { phase = next; root.dataset.flightPhase = next; root.dataset.launchState = next; }
function stopMedia() {
 for (const video of videos) {
  video.pause();
  if (callbacks.has(video)) video.cancelVideoFrameCallback(callbacks.get(video));
 }
 callbacks.clear(); presented.clear();
 if (raf) cancelAnimationFrame(raf); raf = null;
}
// preload=none is retained in markup for static/data-saving visits. Once motion
// is allowed, explicitly buffer successors; load() alone still honors 'none'.
function load(video) { if (!video.src) { video.preload = 'auto'; video.src = video.dataset.src; video.load(); } else if (video.error) video.load(); }
function setPausedState() {
 root.dataset.motionPaused = String(!moving());
 pause.textContent = manualPause ? 'Resume motion' : 'Pause motion';
 if (!moving()) clearTimeout(timeout);
 scheduleFrames();
}
// Bounded loading recovery, re-armed after a hidden/offscreen loading interruption.
function watchLoading() {
 clearTimeout(timeout);
 if (!moving()) return;
 const attempt = run;
 timeout = setTimeout(() => {
  if (attempt !== run || !moving()) return;
  if (phase === 'loading-loop' || startingDeparture || videos.some(video => wanted(video) && video.readyState < 2)) showStill();
 }, 6000);
}
// Only watch frames while a handoff is pending. Native looping needs no canvas or timer.
function scheduleFrames() {
 const watch = moving() && phase !== 'loop';
 for (const video of videos) {
  const shouldWatch = watch && wanted(video);
  if (!shouldWatch && callbacks.has(video)) { video.cancelVideoFrameCallback(callbacks.get(video)); callbacks.delete(video); }
  if (shouldWatch && 'requestVideoFrameCallback' in video && !callbacks.has(video)) {
   const attempt = run;
   const id = video.requestVideoFrameCallback((now, meta) => {
    if (attempt !== run || callbacks.get(video) !== id) return;
    callbacks.delete(video); update(video, meta.mediaTime, { time: meta.mediaTime, displayAt: meta.expectedDisplayTime ?? now, observedAt: now }); scheduleFrames();
   });
   callbacks.set(video, id);
  }
 }
 if (!watch || nativeFrames) { if (raf) cancelAnimationFrame(raf); raf = null; }
 else if (!raf) raf = requestAnimationFrame(() => { raf = null; for (const video of videos) if (wanted(video)) update(video, video.currentTime); scheduleFrames(); });
}
function showStill() {
 ++run; clearTimeout(timeout); startingDeparture = null; loopAttempt = null;
 phaseTo('still'); manualPause = false; stopMedia(); layer.hidden = true;
 controls.hidden = preference.matches; skip.hidden = true; replay.hidden = false; pause.hidden = true;
 status.textContent = 'Still image'; setPausedState();
}
function abandonLoop() {
 loopAttempt = null; loopFailed = true; presented.delete(flight); flight.pause(); flight.style.opacity = '0'; departure.style.opacity = '1'; scheduleFrames();
}
function enterLoop(focus = false) {
 clearTimeout(timeout); loopAttempt = null; presented.clear(); phaseTo('loop'); launch.pause(); departure.pause();
 launch.style.opacity = '0'; departure.style.opacity = '0'; flight.style.opacity = '1'; layer.hidden = false;
 skip.hidden = true; replay.hidden = false; pause.hidden = false;
 status.textContent = 'Flying through distant space'; setPausedState();
 if (focus) replay.focus({ preventScroll: true });
}
async function play(video, attempt = run) {
 await video.play();
 // A stale promise must not pause playback started by a more recent Replay.
 if (!wanted(video)) video.pause();
 if (attempt === run && video === departure && startingDeparture) {
  startingDeparture.playing = true; update(departure, presented.get(departure)?.time ?? departure.currentTime);
 }
 return attempt === run;
}
async function syncMotion() {
 setPausedState();
 if (!moving()) { stopMedia(); return; }
 const attempt = run;
 if (phase === 'loading-loop' || startingDeparture || videos.some(video => wanted(video) && video.readyState < 2)) watchLoading();
 try {
  if (phase === 'launch' && launch.ended && !startingDeparture) { await beginDeparture(); return; }
  for (const video of videos) if (wanted(video)) await play(video, attempt);
  if (attempt === run && phase === 'departure') update(departure, departure.currentTime);
 } catch {
  if (attempt === run && moving()) showStill();
 }
}
function revealDeparture() {
 if (!startingDeparture?.playing || phase !== 'launch' || !moving() || departure.seeking || departure.readyState < 2) return;
 // play() can settle before the compositor has presented the next player.
 // A buffered first frame is useful for preparation, but only a fresh frame
 // from this playback attempt can begin the unchanged 800 ms moving dissolve.
 if (nativeFrames && !presented.has(departure)) return;
 startingDeparture = null; clearTimeout(timeout); phaseTo('departure');
 departure.style.opacity = '1'; launch.style.opacity = '1';
 status.textContent = 'Leaving Earth behind'; setPausedState();
}
async function beginDeparture() {
 if (startingDeparture || phase !== 'launch' || !moving()) return;
 const attempt = startingDeparture = { run, playing: false }; watchLoading();
 load(departure); presented.delete(departure); departure.currentTime = 0; departure.playbackRate = 1;
 scheduleFrames();
 try {
  await play(departure, attempt.run);
 } catch {
  // A lifecycle pause may abort a pending play. Keep the attempt so Resume
  // restarts the same media time and waits for a new decoded frame.
  if (attempt === startingDeparture && attempt.run === run && moving()) showStill();
 }
}
async function beginLoop(time, direct = false) {
 const sourceTime = direct ? entry : departure.currentTime;
 if (loopAttempt || loopFailed || !moving() || (!direct && (phase !== 'departure' || time < entry || sourceTime < entry || sourceTime >= matchUntil - loopDissolve - tolerance))) return;
 load(flight);
 if (!direct && flight.readyState < 2) return;
 const attempt = loopAttempt = { run, direct, playing: false, dissolveAt: null, retries: 0 };
 // Seek with paired playback clocks, not a possibly delayed frame callback time.
 presented.delete(flight);
 flight.currentTime = direct ? 0 : Math.max(0, sourceTime - entry);
 flight.playbackRate = 1; flight.loop = true;
 try {
  await flight.play();
  if (attempt !== loopAttempt || attempt.run !== run) { if (!wanted(flight)) flight.pause(); return; }
  attempt.playing = true;
  if (!moving()) flight.pause();
  scheduleFrames();
 } catch {
  if (attempt === loopAttempt && attempt.run === run) {
   if (direct) showStill(); else abandonLoop();
  }
 }
}
async function start() {
 if (preference.matches) { showStill(); return; }
 const attempt = ++run; clearTimeout(timeout); loopAttempt = null; loopFailed = false; startingDeparture = null; manualPause = false;
 stopMedia();
 for (const video of videos) { video.currentTime = 0; video.playbackRate = 1; }
 flight.style.opacity = '0'; departure.style.opacity = '0'; launch.style.opacity = '1'; layer.hidden = false;
 controls.hidden = false; replay.hidden = true; skip.hidden = false; pause.hidden = false;
 phaseTo('launch'); status.textContent = 'Launch'; setPausedState(); load(launch);
 watchLoading();
 try {
  await play(launch, attempt);
  if (attempt !== run) return;
  clearTimeout(timeout); load(departure); load(flight);
 } catch { if (attempt === run) showStill(); }
}
function update(video, time, frame) {
 if (!moving()) return;
 if (frame && (video === departure || video === flight)) presented.set(video, frame);
 if (video === launch && phase === 'launch' && time >= launch.duration - handoffDuration && departure.readyState >= 2) beginDeparture();
 if (video === departure && phase === 'launch' && startingDeparture) revealDeparture();
 if (video === departure && phase === 'departure') {
  launch.style.opacity = String(1 - smooth(time / handoffDuration));
  if (time >= handoffDuration) launch.pause();
  if (loopAttempt?.dissolveAt !== null && loopAttempt?.dissolveAt !== undefined) {
   const progress = (time - loopAttempt.dissolveAt) / loopDissolve;
   departure.style.opacity = String(1 - smooth(progress));
   if (progress >= 1) enterLoop();
  } else if (time >= matchUntil - loopDissolve - tolerance && loopAttempt) abandonLoop();
  else beginLoop(time);
 }
 if (video === departure || video === flight) alignLoop(video, frame?.observedAt);
}
function alignLoop(video, now) {
 if (!loopAttempt?.playing || flight.seeking || flight.readyState < 2) return;
 const loopFrame = presented.get(flight), departureFrame = presented.get(departure);
 // The legacy scheduler samples both playback clocks in one animation frame.
 // With rVFC, require a newly decoded loop frame before seeking or revealing it.
 if (nativeFrames && !loopFrame) return;
 if (loopAttempt.direct) { if (video === flight) enterLoop(true); return; }
 const sourceClock = entry + flight.currentTime, departureClock = departure.currentTime;
 const safeEnd = loopAttempt.dissolveAt === null ? matchUntil - loopDissolve : matchUntil;
 if (sourceClock >= safeEnd || departureClock >= safeEnd) { abandonLoop(); return; }
 const clockDelta = sourceClock - departureClock;
 if (loopAttempt.dissolveAt === null && Math.abs(clockDelta) > tolerance + 1e-6) {
  // Correct every true clock mismatch outside the existing two-frame tolerance.
  // Invalidate decoded samples and wait for fresh frames after the bounded seek.
  if (++loopAttempt.retries > 2) abandonLoop();
  else { presented.delete(flight); flight.currentTime = Math.max(0, departureClock - entry); }
  return;
 }
 let departureTime = departureClock, loopTime = flight.currentTime;
 if (nativeFrames) {
  if (!departureFrame || now === undefined) return;
  // Compare decoded frames that were presented together, never a frame timestamp
  // from one player against the other player's later playback clock.
  const frameMillis = 1000 / fps;
  if (Math.abs(loopFrame.displayAt - departureFrame.displayAt) > frameMillis + 1 || now - Math.min(loopFrame.displayAt, departureFrame.displayAt) > frameMillis * 2) return;
  departureTime = departureFrame.time; loopTime = loopFrame.time;
 }
 if (Math.abs(entry + loopTime - departureTime) <= tolerance + 1e-6) {
  flight.style.opacity = '1';
  loopAttempt.dissolveAt ??= departureTime;
 }
}

launch.addEventListener('ended', () => {
 if (phase !== 'launch') return;
 status.textContent = 'Continuing into space'; beginDeparture(); const attempt = run;
 clearTimeout(timeout); timeout = setTimeout(() => { if (attempt === run && phase === 'launch' && moving()) showStill(); }, 6000);
});
departure.addEventListener('ended', () => { if (phase === 'departure') showStill(); });
for (const video of videos) for (const event of ['waiting', 'stalled']) video.addEventListener(event, () => { if (wanted(video)) watchLoading(); });
for (const video of videos) video.addEventListener('error', () => {
 if (video === flight && phase === 'departure') abandonLoop();
 else if (video === launch && phase === 'launch' || video === departure && (phase === 'launch' || phase === 'departure') || video === flight && (phase === 'loop' || phase === 'loading-loop')) showStill();
});
pause.addEventListener('click', () => { manualPause = !manualPause; syncMotion(); });
skip.addEventListener('click', () => {
 ++run; clearTimeout(timeout); loopAttempt = null; loopFailed = false; manualPause = false; startingDeparture = null; stopMedia();
 phaseTo('loading-loop'); status.textContent = 'Continuing into space'; setPausedState();
 const attempt = run; beginLoop(0, true);
 timeout = setTimeout(() => { if (attempt === run && phase === 'loading-loop' && moving()) { showStill(); replay.focus({ preventScroll: true }); } }, 5000);
});
replay.addEventListener('click', () => { start(); skip.focus({ preventScroll: true }); });
preference.addEventListener('change', () => { if (preference.matches) showStill(); else controls.hidden = false; });
connection?.addEventListener?.('change', () => { if (connection.saveData) showStill(); });
document.addEventListener('visibilitychange', syncMotion);
new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncMotion(); }, { threshold: .02 }).observe(document.querySelector('.hero'));
window.addEventListener('pagehide', () => { pageActive = false; syncMotion(); });
window.addEventListener('pageshow', event => { if (event.persisted) { pageActive = true; syncMotion(); } });
if (preference.matches || connection?.saveData || location.hash) showStill(); else start();
