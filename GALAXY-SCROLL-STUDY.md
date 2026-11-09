# Galaxy scroll study

Preview-only continuation of the solar journey, requested November 9, 2026.

## Scope

`/galaxy-study` derives from the current `/solar-study` at build time. The hero film, controls and exact headline remain owned by the solar study. The November 9 commercial revision changes supporting copy only on `/galaxy-study`; see `COMMERCIAL-STORY-PREVIEW.md`. All five subsequent homepage sections, the contact section and the footer share the galaxy palette. The same existing galaxy artwork becomes a fixed camera plane that advances as the page scrolls. This is an artistic traversal, not a scientific model of the Milky Way.

`/solar-study`, `/launch-preview`, `/`, `/b` and supporting pages remain unchanged. The new route exists only when the existing isolated solar-study build is enabled. An ordinary production build has neither study. Nothing here changes hosting audience, deploy settings, security, contact behavior, or existing comparison/production content. No merge or production promotion.

## Motion and readability

- One existing image, transformed once per scroll animation frame, with no continuous background loop, extra video or dependency.
- Native scrolling in both directions; no pinned-scroll trap, wheel interception, or simulated scrolling.
- Restrained zoom and lateral travel, reduced further on narrow layouts.
- High-opacity dark surfaces keep headings and body copy readable over the bright galaxy. Existing foreground content does not move with the image.
- A sticky pause/resume control freezes the current camera frame. The hero's explicit Still image control also pauses the scroll camera.
- Reduced-motion and save-data preferences select a still view. No-JavaScript keeps all original content visible with the static background and no unusable controls.
- Resize, disclosure expansion, page restoration and preference changes recalculate the camera range. Hidden documents do no scheduled scroll rendering.
- Decorative chapter labels and progress have no live announcements.

The galaxy and native-walkthrough CSS and JavaScript total 11,460 uncompressed bytes. Existing image variants are reused. This is not a measured Lighthouse score.

## Verification

Initial visual verification below predates the commercial copy revision. Current copy and isolation verification is in `COMMERCIAL-STORY-PREVIEW.md`.

Checks retained on the current source:

- Normal build excludes both previews; local preview build includes them.
- `node scripts/verify-galaxy-build.mjs`: approved preview-only commercial story, existing comparison/production routes unchanged, preserved headline/media/contact, five chapters, noindex, default-hidden JS controls, native anchors/scrolling and size guard.
- `node --test tests/galaxy-scroll.test.mjs`: 8 tests covering forward/reverse progress, endpoint clamping, pause/resume, reduced motion and save-data, dynamic preference changes, smaller mobile motion, idle/hidden behavior, hero still choice, page restoration and chapter labels.
- Existing `npm test`: 5 contact tests.
- `npm run check:copy`, `npm run check:references`, and `git diff --check`.

Earlier visual checks, to be repeated against the revised copy:

- CUA browser: desktop rendering, actual changing camera transform during scrolling, frozen transform while paused, resume, disclosure expand/collapse, contact URL preservation, no horizontal overflow, image delivery and visible keyboard focus. Browser extension metadata warnings were present; no site error was observed.
- Responsive visual check in a 390-pixel iframe: one-column reading layout, no content/heading overflow, usable motion control.

Not run: the full repository Playwright suite and Lighthouse. Narrow iframe verification is not a physical-device or touch-browser test. Reduced-motion/save-data logic was covered by the focused tests, not native browser preference emulation.

## Local review and integration

Build with `WIDE_LAUNCH_PREVIEW=local npm run build`. The resulting `dist/galaxy-study.html` is the review route. For managed-cloud QA, use the supported Sites preview daemon with a local-only static directory manifest; do not commit that temporary manifest.

Integration adds `galaxy-scroll.css`, `galaxy-scroll.js`, the derived-preview builder and focused tests, plus one import at the end of `scripts/build.mjs`. It does not edit hero-owned source files. The commercial-story transformation runs only on the derived galaxy page. Cherry-pick this study onto the current PR #6 branch after the hero worker's changes. Rebuild and verify the final integrated route before sharing a hosted link.
