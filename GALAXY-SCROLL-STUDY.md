# Galaxy scroll study

Preview-only continuation of the solar journey, requested November 9, 2026.

## Scope

`/galaxy-study` derives from the current `/solar-study` at build time. The hero film, controls and exact headline remain owned by the solar study. The November 9 commercial revision changes supporting copy only on `/galaxy-study`; see `COMMERCIAL-STORY-PREVIEW.md`. All five subsequent homepage sections, the contact section and the footer share the galaxy palette. The same existing galaxy artwork becomes a fixed camera plane that advances as the page scrolls. This is an artistic traversal, not a scientific model of the Milky Way.

The galaxy-specific changes leave `/solar-study`, `/launch-preview`, `/`, `/b` and supporting pages unchanged. The shared hero's later controls/fallback revision applies across all three preview routes; see `WIDE-LAUNCH-PREVIEW.md`. The new route exists only when the existing isolated solar-study build is enabled. An ordinary production build has neither study. Nothing here changes hosting audience, deploy settings, security, contact behavior, or existing comparison/production copy. No merge or production promotion.

## Motion and readability

- One existing image, transformed once per scroll animation frame, with no continuous background loop, extra video or dependency.
- Native scrolling in both directions; no pinned-scroll trap, wheel interception, or simulated scrolling.
- Restrained zoom and lateral travel, reduced further on narrow layouts.
- High-opacity dark surfaces keep headings and body copy readable over the bright galaxy. Existing foreground content does not move with the image.
- A sticky pause/resume control freezes the current scroll-camera frame. It remains separate from the hero's Pause motion control. There is no separate hero Still image button or cross-page still-button listener.
- Reduced-motion and save-data preferences select a still view. No-JavaScript keeps all original content visible with the static background and no unusable controls.
- The hero's automatic static fallback uses the exact final frame from the deployed departure clip, including load failure, rejected autoplay, reduced motion, Save-Data, deep links and no-JavaScript. The post-hero scroll background remains the original galaxy artwork.
- Resize, disclosure expansion, page restoration and preference changes recalculate the camera range. Hidden documents do no scheduled scroll rendering.
- Decorative chapter labels and progress have no live announcements.

The galaxy and native-walkthrough CSS and JavaScript total 11,190 uncompressed bytes. Existing galaxy image variants are reused. The shared hero's separate exact-frame fallback is 454,965 bytes. This is not a measured Lighthouse score.

## Current shared-hero revision

The local-only Arc appearance edit and native late-flight loop are shared across the three preview routes. The hero preserves the original launch/departure sequence and 800 ms overlap, then loops late footage at normal speed with no canvas drift or automatic launch replay. The commercial copy, scroll camera and galaxy controls are unchanged. See `WIDE-LAUNCH-PREVIEW.md` for source-frame timing, fallback behavior, asset provenance and current limits. No upload, push or deployment is included. Desktop CUA verified the natural sequence, sampled repeated native wraps, pause/resume, offscreen navigation and Back, explicit Replay/Skip, absent canvas/Still image button and no horizontal overflow. Responsive 390 px iframe CUA verified the exact hash-navigation fallback without media loading, readable copy/CTA, keyboard Replay/Skip/Pause/Resume and no horizontal overflow. These sampled desktop/iframe checks do not establish a perfect seam across browsers, physical-device support or native reduced-motion preference emulation.

## Verification

Current copy and isolation verification, plus historical local visual results, are in `COMMERCIAL-STORY-PREVIEW.md`. Fresh visual review is required for the refined copy.

Checks retained on the current source:

- Normal build excludes both previews; local preview build includes them.
- `node scripts/verify-galaxy-build.mjs`: approved preview-only commercial story, unchanged ordinary routes and comparison copy, shared headline/media/contact, exact final-frame hero fallback, no explicit still-image button, five chapters, noindex, default-hidden JS controls, native anchors/scrolling and size guard.
- `node --test tests/galaxy-scroll.test.mjs`: 9 tests covering forward/reverse progress, endpoint clamping, pause/resume, reduced motion and save-data, dynamic preference changes, smaller mobile motion, idle/hidden behavior, absent hero still button, pause/fallback page restoration and chapter labels.
- `node --test tests/*.test.mjs`: 49 tests pass for the native late-flight revision.
- Existing `npm test`: 5 contact tests.
- `npm run check:copy`, `npm run check:references`, and `git diff --check`.

Historical visual checks, before the latest commercial-copy and controls/fallback revisions:

- CUA browser: desktop rendering, actual changing camera transform during scrolling, frozen transform while paused, resume, disclosure expand/collapse, contact URL preservation, no horizontal overflow, image delivery and visible keyboard focus. Browser extension metadata warnings were present; no site error was observed.
- Responsive visual check in a 390-pixel iframe: one-column reading layout, no content/heading overflow, usable motion control.

Not run for the controls/fallback revision: CUA review, the full repository Playwright suite and Lighthouse. Earlier narrow iframe verification is not a physical-device or touch-browser test. Reduced-motion/save-data logic is covered by the focused tests, not current native browser preference emulation.

## Local review and integration

Build with `WIDE_LAUNCH_PREVIEW=local npm run build`. The resulting `dist/galaxy-study.html` is the review route. For managed-cloud QA, use the supported Sites preview daemon with a local-only static directory manifest; do not commit that temporary manifest.

Integration adds `galaxy-scroll.css`, `galaxy-scroll.js`, the derived-preview builder and focused tests, plus one import at the end of `scripts/build.mjs`. It does not edit the hero implementation. The commercial-story transformation runs only on the derived galaxy page. Rebuild and verify the final integrated route before sharing a hosted link.
