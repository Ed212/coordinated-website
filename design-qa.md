# Coordinated visual refinement — design QA

Final result: **passed**.

No actionable P0, P1 or P2 visual issue remains in the reviewed candidate. This result covers the local visual refinement, not production publication or physical-device certification.

## Source and comparison setup

- Live baseline: `https://coordinatedai.ai/`, repository baseline `962edeeaac8daf36da982b1b68f50f825b5e19ab`. The parent’s `preview-review/visual-refinement/source-match.json` records the live-to-release source match.
- Candidate: `http://127.0.0.1:4191/`, release build from the isolated `coordinated-visual-refinement` checkout.
- Browser: headless local Google Chrome through Playwright. No foreground app takeover, external design reviewer, contact submission or message delivery occurred.
- Matching capture viewports: desktop **1440 × 1000**, mobile **390 × 844**, device scale factor 1. Main comparisons use reduced motion and a settled still state; full-page and section captures use the same state on each side.
- Actual source captures: `preview-review/visual-refinement/before/`. Final candidate captures: `preview-review/visual-refinement/after/`. The initial candidate is retained separately in `after-initial/`.
- Paired comparison inputs were generated as local HTML with the baseline left and candidate right. Both sides use the same display scale. The 390px hero/story boards preserve native mobile width; larger desktop/full-page boards are equally downscaled for composition review. Gray canvas outside a capture belongs to the comparison helper, not the website.

## Combined inputs reviewed

The complete page and focused surfaces were inspected in combined before/after images, in addition to the original screenshots and DOM/font measurements:

- `preview-review/visual-refinement/comparisons/desktop-full.png`
- `preview-review/visual-refinement/comparisons/mobile-full.png`
- `preview-review/visual-refinement/comparisons/desktop-hero.png`
- `preview-review/visual-refinement/comparisons/mobile-hero.png`
- `preview-review/visual-refinement/comparisons/desktop-story.png`
- `preview-review/visual-refinement/comparisons/mobile-story-top.png`
- `preview-review/visual-refinement/comparisons/desktop-how.png`
- `preview-review/visual-refinement/comparisons/desktop-card-focus.png`
- `preview-review/visual-refinement/comparisons/mobile-card-focus.png`

Full-page comparisons establish section hierarchy and density; focused native-width images establish text readability. They are not treated as equivalent measurement scales.

## Findings and iteration history

The baseline repeated rectangular frames at chapter, navigation, goal, decision, acceptance and evidence levels. Decorative section and story numbers competed with meaningful status labels. The baseline heading used medium Inter with incidental clause breaks; tiny monospaced labels and controls weakened hierarchy.

The candidate resolves these approved visual changes: the hero uses the deliberate three-line treatment “Launch fast. / Learn what lands. / Act on that learning.”; chapter and story counters are visually removed while meaningful sequence remains; Northstar is one continuous dark story surface with text navigation, spacing and separating rules. Sections outside that example no longer repeat the same enclosing box.

**Initial candidate P2 — small metadata and motion controls.** The timestamp was still 9px, the context badge 11px, and flight controls 10–11px. This was reported before passing the review. The parent applied one focused correction: 12px timestamp and badge, 13px flight controls with 44px targets, a dedicated mobile timestamp row, and readable sans-serif action/control text. Final screenshots and the font/controls probes confirm the correction. Status: **resolved**.

A first normal-motion test clicked before startup playback had settled and incorrectly assumed Skip should enter the still state. The final helper waits for decoded, advancing video and checks the intended Skip-to-loop behavior. This was a test-setup correction; the final playback probe passed. The original result is not used as a playback pass.

## Five visual surfaces

**Typography — passed.** Chrome’s platform-font probe confirms the actual headline font is custom `BricolageGrotesque-SemiBold` at both viewports, rather than only a computed CSS family. It renders at 600 weight, approximately 57.6px desktop and 30.42px mobile, with the intended clause breaks. Inter remains practical body and control typography. Meaningful chapter/story labels are more readable and no longer look like machine counters. The final timestamp and badge are 12px; motion buttons are 13px. Evidence: `after/font-probe.json`, `after/1440-hero-card.png`, `after/390-hero-card.png`, and focused comparison boards.

**Spacing and hierarchy — passed.** The candidate removes redundant nested padding and borders while keeping distinguishable decision, accepted-work and review stages. Northstar’s mobile narrative uses the available width more effectively. Header, hero/card, CTA, story navigation and footer show no collision or horizontal overflow at the two comparison viewports. Larger readable text makes the mobile full page slightly longer; desktop becomes shorter as repeated frames are removed. This is an intentional hierarchy change, not clipped content.

**Color and surfaces — passed.** Dark navy, white product artifact, muted blue text and space identity remain coherent. The white fictional Northstar card retains the strongest product contrast. The continuous Northstar surface, quiet rules and unboxed surrounding sections establish clearer hierarchy than repeated nested outlines. No color or background mismatch was found in the paired views. Automated contrast/accessibility validation remains covered by the parent’s functional checks; this report does not invent an audit score.

**Images and media — passed.** The matching hero views preserve the galaxy/space artwork, visual framing, brand mark and product artifact. No replacement art, crop defect or broken image was observed. Reduced-motion captures remain stable. Normal-motion controls were inspected separately in `after/1440-normal-paused-hero.png`, `after/390-normal-paused-hero.png`, and the corresponding `*-motion-controls.png` images.

**Copy — passed.** Fictional-example and prelaunch boundaries remain visible. Body text, excluding scripts/styles and aria-hidden decorative content, is equal before and after: 8,833 normalized characters, SHA-256 `831fe869767ca30b2d6fa5d9552e34deb12daeecd4cf680ae24b964b165dff03`. Receipt: `after/copy-equivalence.json`. The distinction between approved visual simplification and content preservation is therefore checked against actual source text, not screenshots alone.

## Interaction and capture evidence

- Final capture receipts: `before/capture.json`, `after/capture.json`, and per-device snapshot JSON. No page error or horizontal overflow was observed in these captures.
- Independent local normal-motion check at 1440 × 1000 and 390 × 844: decoded video advanced, Pause changed to Resume, Skip entered the living-galaxy loop, and Replay returned to launch. Both visible motion controls measured 44px high, stayed inside the viewport, and used 13px Inter. No runtime errors were recorded. Receipt: `after/controls.json`.
- The parent’s final lifecycle suite additionally passed at 390/1180/1440/2048, including pause, skip, replay, card inertness, stable height, scroll escape, reduced motion, no-JavaScript and failure states. Parent-owned receipt: `preview-review/hero-composition/checks.json`.
- The parent separately reported its final 10-viewport functional/focus/header checks and 320–1920 responsive sweep passing. Those are supporting checks, not recast here as tests run by this visual reviewer.
- All capture, font-probe, playback and comparison-composition browser processes were closed before this report was completed, leaving the parent free to run final performance validation.

## Limits and publication state

This is Chrome-based desktop/mobile viewport QA, with no physical iPhone/Safari check. Contact links were preserved and inspected without sending a contact request. Final Lighthouse and hosted-preview verification are the parent’s remaining release checks. This reviewer made no site source/runtime changes, Git changes, push, PR, deployment or access change.

## Implementation closeout

The final local Lighthouse run passed the existing mobile performance gate: `/` 91, `/b.html` 92, automated accessibility 100 on both, CLS 0 on both. This is a lab result; hosted verification is recorded in the draft PR rather than inferred from it.

Portable review screenshots are committed under `docs/visual-refinement-2026-11-18/`: [desktop hero](docs/visual-refinement-2026-11-18/desktop-hero.png), [mobile hero](docs/visual-refinement-2026-11-18/mobile-hero.png), and [mobile Northstar story](docs/visual-refinement-2026-11-18/mobile-story-top.png). Each image pairs the actual live baseline on the left with the final candidate on the right. The detailed local receipts above remain in the task workspace.
