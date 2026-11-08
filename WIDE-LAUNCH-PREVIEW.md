# Continuous launch journey preview

Separate review experiment, November 8, 2026. No merge or production promotion.

Review: https://deploy-preview-5--mellow-lokum-bcedf5.netlify.app/launch-preview
Draft PR: https://github.com/Ed212/coordinated-website/pull/5

## Current direction

Preserve the approved wide Cape Canaveral-style shuttle launch, its water and ground setting. Continue from its exact orbital ending into a second generated shot: Earth's limb gradually drops away as a restrained starfield and Milky Way-like band emerge. The last portion slows down and settles into the exact decoded ending frame. A 32-second, 0.3% scale drift and a faint 19-second light cycle keep that retained scene gently alive. This is a stabilized living image after the flight, not an endlessly generated or seamless looping flight video.

The previous abrupt dissolve into enormous galaxy discs is removed from the automatic journey. There is no Moon/Mars montage, which would introduce more scale and camera discontinuities. The original merging-galaxy still remains the explicit Still image and reduced-motion fallback.

One headline and one CTA stay in place throughout, with the exact requested headline:

“Make your go-to-market move at the speed of your product.”

The film is a background on desktop and a wide section above the same stationary copy on mobile. The example card sits below the film's visible area rather than hiding the shuttle. All other business copy remains the current growth-learning baseline from 34dd49e. The ordinary homepage retains “Turn product momentum into market growth.”

## Interaction and constraints

- No splash-screen gate. Text, navigation and CTA are usable immediately.
- Muted inline opening plays once, followed by the anchored continuation. It does not restart automatically.
- Both clips use the same 16:9 plane, with a short matched-frame handoff. Displayed media frames drive timing where requestVideoFrameCallback is supported; a frame-loop fallback handles older browsers.
- The final 2.5 media seconds gradually slow to 0.28x before the retained-frame handoff. Total wall-clock journey is roughly 24 seconds, depending on buffering. The source films are each about ten seconds.
- Pause freezes all video and ambient CSS motion. Replay, Skip journey and Still image remain available. Hidden tabs and offscreen heroes pause motion.
- Reduced motion, Save Data, deep links and no JavaScript show the original static galaxy without requesting MP4 files. Blocked autoplay or failed media falls back to that still.
- Built only for explicit local preview or Netlify Deploy Preview on codex/wide-shuttle-preview. Default/production builds exclude this experiment and its media.

## Source and generation evidence

Approved launch: 1920 × 1080, 10.041667 seconds, no audio, 5,966,854 bytes. SHA-256 4325f277ef1aa1c921ac3899c47a61a9704b4452708682cbf1f54500ccee76b1. Runway task cc4faf72-5f80-4334-beee-e904032156df. The source clip is unchanged. A soft top vignette suppresses its generated text-like artifact.

Continuation: 1280 × 720 actual output, 10.041667 seconds, 2,236,633 bytes. SHA-256 bf0efe9efbc6515434385559c87dbe6877411620e0ae693b238224d5a1935be3. Runway task 4e07153e-67dd-407a-8a53-b53944a0f42d. It was anchored to the approved launch's final decoded frame. One generation used 120 existing credits, leaving 46. No purchase was made. The provider returned 720p despite a 1080p request; the preview does not claim a 1080p continuation.

The ending is the actual frame at media time 10 seconds. It retains a tiny warm point and a sliver of Earth's blue limb, so this is a cinematic departure illustration, not a physically timed solar-system flight or documentary. The stars do not suddenly become nearby giant galaxies.

## Verification

The committed browser script checks real two-shot playback, a fixed headline bounding box, usable CTA, pause/resume across phases, offscreen pause, skip/replay/still, reduced-motion changes, no-JavaScript/Save-Data/deep-link/autoplay/media-error fallbacks, responsive overflow, and unchanged ordinary homepage. CHECK_AMBIENT_CYCLES=1 adds observation of two complete 32-second ambient drift cycles. These are website interaction checks, not product evaluation.

Physical iOS and Safari remain untested. Local and hosted check results are retained in the review workspace. Prior iterations' test passes do not substitute for running these current checks.
