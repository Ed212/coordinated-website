# Wide launch interaction study

Separate preview only, requested November 8. No production promotion, merge, security change or contact change.

The complete generated shuttle is seen from a wide Cape Canaveral-style ground viewpoint before ascending toward space. Exact website headline: “Let your go-to-market move at the speed of your launch.” The accessible HTML overlay is separate from the video, remaining crisp and responsive rather than baking inaccessible text into pixels.

A ten-second muted, inline opening replaces the hero visually, then dissolves into the original merging-galaxy artwork and the current prelaunch content. It uses the same reserved hero space, so the page does not collapse or jump. Header, contact and skip remain usable immediately. Pause/resume and replay are provided. Reduced-motion, Save Data, video failure, blocked autoplay, deep links and no JavaScript lead directly to the original static hero. Background tabs pause.

The experiment builds only with WIDE_LAUNCH_PREVIEW=local or the isolated codex/wide-shuttle-preview Netlify Deploy Preview. Default/production builds exclude the experiment and media. The original index and b pages are not changed by the experiment. All existing prelaunch and illustrative-example disclosures remain.

Footage is a generated cinematic illustration with compressed ascent, not NASA footage or a physically timed mission simulation. Exact asset evidence and visual QA are recorded after generation. No new purchase or account was made.

## Verified source and checks

Source: 1920 × 1080 H.264, 10.041667 seconds, no audio, 5,966,854 bytes. SHA-256 4325f277ef1aa1c921ac3899c47a61a9704b4452708682cbf1f54500ccee76b1. Real-time playback frames confirm a full shuttle beside the pad, liftoff at about 3 seconds, climbing through blue sky at 6 seconds and a small vehicle above Earth near 9 seconds. Ascent is deliberately compressed; this is not a physically timed documentary. A top-edge vignette suppresses small generated text-like artifacts. The original prior rocket and galaxy video assets are not replaced.

Based on copy revision 34dd49e. Local checks: build/copy/references, 5 contact unit tests, eight baseline browser variants, six responsive widths, and baseline mobile Lighthouse 97 / CLS 0. Isolated 390/1440px checks cover real ended transition, pause/resume, replay/skip, reduced-motion changes, no JavaScript, blocked/error media, Save Data and deep-link fallbacks. Physical iOS/Safari is not tested. The experiment is not a product evaluation or production release.

## Living-galaxy refinement

The follow-up keeps the approved wide shuttle clip unchanged. From about 7.8 to 9.95 seconds, the rocket and Earth recede while the existing living-galaxy asset gradually emerges on the exact plane that remains in the hero. The line changes from “Make your go-to-market move at the speed of your launch” to “Make your go-to-market move at the speed of your product.” The final hero uses that product line in this preview only. Normal homepages retain the growth headline.

The supplied living galaxy is reused, not regenerated: 1920 × 1080, 10.041667 seconds, 3,031,532 bytes, SHA-256 588c3572cc957743052af91149f6bfd44020bcd51cab002d4b18559cf658af2c. Two cached video elements overlap their ends for a soft 720ms loop handoff. The restrained moving light continues while the hero is visible. Pause galaxy, Still image and Replay remain available. Offscreen/hidden-tab motion pauses. Reduced motion, Save Data and no JavaScript show the original still without loading motion. Failed media falls back to the original still.

On phones, the same reserved media plane stays above the copy through the transition so the galaxies do not jump to a different part of the page. No extra generation, credits or production change is part of this refinement. Physical iOS/Safari remains untested.
