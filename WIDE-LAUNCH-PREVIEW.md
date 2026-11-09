## Current revision: endless space (November 9, 2026)

The shared hero on `/solar-study`, `/launch-preview` and `/galaxy-study` now plays launch and departure once, then remains in an indefinite composited space passage. There is no Moon/Mars sequence, timed arrival at merging galaxies, or automatic replay. The galaxy-study backdrop still approaches the existing galaxy artwork with native page scrolling. Business copy, headline, CTA and layout are unchanged.

The ambient canvas begins with the existing departure still at its original framing. Gentle overscan enters smoothly, followed by long lateral drift and sparse parallax stars whose opacity reaches zero smoothly at wrap boundaries. This is local composited motion, not new continuous generated footage. No generation spend was incurred. Stage separation is still obscured by glow and remains unresolved.

Pause/Resume preserves passage time; hidden/offscreen/still states cancel animation work. Skip enters space, and only explicit Replay starts the launch again. Reduced-motion, Save-Data, hash navigation, no-JS and failed-media fallbacks remain. The deterministic renderer/controller suite is `node --test tests/endless-space.test.mjs`; browser verification scripts now assert an endless ambient phase instead of a fixed galaxy arrival.

The older study notes below are historical; this revision supersedes any timed Moon/Mars/galaxy-arrival description.

---

# Separate composited motion study

This branch is a clearly labeled alternative study. It does not replace PR #5 or production. Start with /solar-study on this branch's Netlify Deploy Preview.

The original source files are retained. This revision uses an AI-edited, unbranded Starship-inspired launch; the Earth-departure shot is unchanged. A locally rendered, 24-second canvas journey adds the Moon, Mars, a distant Sun, and a slow arrival at the original galaxy artwork. This is composited motion, not newly generated continuous film, and it is not an astronomical scale model. The hero is full background on desktop and phone; portrait cover framing crops the original wide image.

The requested headline is unchanged: “Make your go-to-market move at the speed of your product.” All business copy outside the study label is unchanged. Pause, Replay, Skip, Still image, offscreen/hidden pause and reduced-motion/Save-Data/no-JavaScript/deep-link/error fallbacks remain.

NASA imagery sources are in assets/video/solar/SOURCES.md and linked visibly from the preview banner. This study uses an AI-edited launch, the existing Earth-departure footage and locally rendered motion; it does not claim a new continuous generated film.

Prior revision tests: normal build/copy/references, five contact tests, baseline browser and responsive sweep, cinematic flow/fallback tests, and focused real playback through each new phase at 390/1440. The focused script checks the absence of copy panels, scene-darkening overlays and media masks; white glyph edges/shadows; pause freezing; and a stationary headline. Background-only contrast is reported without a pass claim because it excludes the glyph outline/shadow used for legibility. Real launch and galaxy frames are also visually reviewed. This is not a complete WCAG contrast certification. Current receipts and screenshots are in preview-review/solar-bridge. Baseline mobile Lighthouse scored 97 with CLS 0; that baseline score is not a performance claim for this canvas study. Physical iOS/Safari is untested.

No merge, production promotion, or product acceptance is established by this visual study.

## Natural-background revision

Per review, the preview removes the inherited black copy panel, full-scene dark gradients and top media masks. Only a narrow glyph outline and shadow protect white text. Both moving clips overlap for an 800 ms dissolve from launch into departure. The galaxy approach is one forward-scaled composition, without the previous offset final-image dissolve. The original source assets are retained and the approved wording stays unchanged.

## Elegant rocket revision

The selected launch is `wide-starship-launch.mp4`, 1920×1080, 24 fps, 10.041667 seconds, no audio. A targeted edit replaces the shuttle with an elegant silver two-stage vehicle, preserving the coastal surroundings and wide camera move. The approved keyframe anchored the edit. The ending still recedes to the bright-point position used by the next shot.

Known limit: stage separation is suggested at altitude, but engine glow hides a distinct booster body. This is a review candidate for the rocket and continuity, not acceptance of a physically accurate separation. Two other variants were rejected for early separation and stretched-body artifacts; neither is published.

`/galaxy-study` is an additive page with the same current hero and an original-artwork galaxy background continuing behind the five existing content sections. `/solar-study` keeps the previous post-hero design. The ordinary homepage, PR #5 and production are not changed.

Current validation: source frames and transition endpoints visually reviewed; metadata, asset hashes, build/copy/reference checks, contact tests, isolated galaxy build checks and galaxy unit tests are verified locally. CUA verified the integrated 1180px desktop hero and a 390px iframe: the new rocket loads, launch advances into departure and the canvas journey, pause/resume and Still/Replay/Skip work, navigation pauses offscreen hero motion, galaxy scroll transforms and pause/resume work, and neither layout overflows. The entire uninterrupted Moon/Mars/galaxy sequence was not re-timed manually; CI remains the full playback check. Full local Playwright and Lighthouse could not run in this cloud environment because Chromium process-singleton sockets are unavailable. Older browser receipts above do not certify this new asset. Physical iOS/Safari and full WCAG contrast certification remain untested.
