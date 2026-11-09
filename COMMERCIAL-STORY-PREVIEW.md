# Commercial story review preview

November 9, 2026. Local unpublished refinement for `/galaxy-study` only. No upload,
push, remote metadata change, deployment, merge, new media generation or purchase
is included. Full locally reviewable editorial copy is in
`COMMERCIAL-STORY-COPY.md`.

## Direction

The approved commercial positioning is:

> Launch fast, learn what lands, and act on that learning.

The cinematic headline remains exactly:

> Make your go-to-market move at the speed of your product.

Supporting hero copy:

> We’re building an AI GTM program manager to help teams get decisions answered,
> avoid work based on old decisions and follow through on what they learn.
>
> Prelaunch. Software in development. Intended workflow, not shipped capability.

The three benefits are Launch fast, Learn what lands, and Act on that learning.
Positioning, pricing, budget, launch readiness and market evidence are presented
as a human-led intended workflow. Decision, commitment, version and permission
boundaries stay in the concise trust section rather than leading the pitch.

The refinement names three intended speed mechanisms: getting unanswered
decisions to responsible people, avoiding rework from superseded direction,
and giving accepted work a defined evidence check. These are labeled “How we
expect it to help. Not yet measured.” Prospective measures cover ready-build to
release time, decisions awaiting answers, late changes and whether assumptions
held. No measured acceleration, ROI or existing integration is claimed.

The fictional Northstar illustration keeps guided activation and the first
shared report. It runs from incomplete market evidence at the Tue Nov 24 review
to a human decision, Leo’s accepted message/demo task for Fri Nov 27, and a
Tue Dec 1 check of delivery, understanding and first use. The fictional task
explicitly moves from a proposal to Leo’s acceptance. The review keeps
observations before and after the message change separate, without implying
a causal comparison. Version 2 changes the test direction; final public wording
still needs Product and GTM review.
Pricing stays steady because confusion alone does not justify a price change;
Finance holds extra spend and the test uses the current campaign budget. The
company’s claim standard rules out an unsupported speed promise. Leo’s acceptance
does not change other owners’ work. The example leaves delivery and market
results open. Decisions and standards remain revisable through human judgment,
necessary approvals and affected owners’ acceptance.

All four native walkthrough steps stay in reading order and visible without
JavaScript: Read the evidence, Make the decision, Accept the work, Check again. Only supporting work/gate and version detail is collapsed.
The existing hero link opens the work/gate detail when selected.

## Implementation boundaries

- `scripts/galaxy-commercial-story.mjs` contains the full revised copy and a
  deterministic, preview-only transformation. It runs before chapter decoration
  and native walkthrough links. Replaced source regions are hash-checked, and
  individual replacements require exactly one target. Changed, missing,
  duplicated or previously transformed source fails rather than being ignored.
- The production template, generated ordinary homepages, supporting pages,
  `/solar-study` and `/launch-preview` comparison remain unchanged. The older
  use-case links now say “Read the detailed workflow example” instead of
  promising that page continues this revised compact story verbatim.
- Existing media, motion CSS/JavaScript, assets, controls, headline markup,
  contact section, email destinations, copy-address behavior, privacy and terms
  are unchanged. No additional runtime code, dependency or asset is added.
- CI now includes the new focused tests and reruns copy checks after building
  the previews. The normal build and existing preview-only hosting gate are unchanged.
  Local inspection of the hosted gate is a build test, not a deployment.

## Checks completed

- `node --test tests/*.test.mjs`: 34 passing tests, including 9 commercial
  copy, maturity, fictional-state, permissions, preservation, fail-closed, specific speed-mechanism and dated
  end-to-end example tests. Walkthrough assertions now compare the deliberately revised story,
  rather than require the obsolete comparison copy.
- `WIDE_LAUNCH_PREVIEW=local npm run build` and
  `node scripts/verify-galaxy-build.mjs`: passing. Verifies exact headline,
  approved transformed copy, byte-identical cinematic scene/controls,
  preserved contact/link destinations, unique native anchors, comparison
  isolation and all existing motion/no-JS static safeguards.
- `npm run check:copy`, `npm run check:references`, `git diff --check`: passing.
  Calculator SHA-256 remains
  `a289412212e78d7b1bdf20d1063077ed0ca991be56fd5f300d6da42c3a45adde`.
- Ordinary, Netlify production, wrong-branch deploy-preview and Vercel-mode
  builds exclude study routes and assets. The authorized Netlify draft-branch
  build includes them. Ordinary page/runtime output hashes match across all
  five modes; comparison HTML hash matches between local and draft modes.
- Main-content word counts, including preview controls/labels: solar comparison
  1,293 default / 1,433 expanded; refined galaxy 991 default / 1,168 expanded.
  The previous commercial revision was 969 / 1,129 words.
  Counts strip markup, hide only closed-details contents for default, and retain
  summaries. This is a reading-volume comparison, not a comprehension result.

Historical local browser review of the previous copy was recorded in `fcf0360`:
at 1180 pixels and in a 390-pixel iframe, the hero and story were readable, with
no horizontal overflow, working native step navigation, keyboard focus,
disclosure toggles, browser Back and unchanged email destinations. Launch and
floating-space states were observed. This was not a physical-device test or a
full accessibility audit.

That visual result does not validate wrapping or layout of this refinement.
Fresh supported browser review remains outstanding. No shell Chromium, full
Playwright suite, Lighthouse or hosted CI was run for this local refinement.
