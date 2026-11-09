# Commercial story review preview

November 9, 2026. Local draft for `/galaxy-study` only. No publication, push,
merge, production promotion, new media generation or purchase is included.

## Direction

The approved commercial positioning is:

> Launch fast, learn what lands, and act on that learning.

The cinematic headline remains exactly:

> Make your go-to-market move at the speed of your product.

Supporting hero copy:

> We’re building an AI GTM program manager to help your team decide what to
> launch, what to learn and what to do next.
>
> Prelaunch. Software in development. The workflow below is intended, not shipped.

The three benefits are Launch fast, Learn what lands, and Act on that learning.
Positioning, pricing, budget, launch readiness and market evidence are presented
as a human-led intended workflow. Decision, commitment, version and permission
boundaries stay in the concise trust section rather than leading the pitch.

The Northstar illustration keeps guided activation and the first shared report.
Its release is ready, but prospects misunderstand the value. Campaign clicks
look promising in the fictional review; activation evidence is incomplete.
Product and GTM approve a clearer positioning direction, Pricing keeps current
terms and Finance holds extra spend pending better evidence. Leo, Maya and
Priya still must accept the changed deliverables and dates. None of these are
verified campaign results or proof of growth.

All four native walkthrough steps stay in reading order and visible without
JavaScript: Frame the value, Launch with a question, Read the response, Choose
the next move. Only supporting work/gate and version detail is collapsed.
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

- `node --test tests/*.test.mjs`: 32 passing tests, including 7 new commercial
  copy, maturity, fictional-state, permissions, preservation and fail-closed
  tests. Walkthrough assertions now compare the deliberately revised story,
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
  1,293 default / 1,433 expanded; revised galaxy 969 default / 1,129 expanded.
  Counts strip markup, hide only closed-details contents for default, and retain
  summaries. This is a reading-volume comparison, not a comprehension result.

The final local output is the preview build, ready for supported browser QA.
No shell Chromium, full Playwright browser suite, Lighthouse or hosted CI was
run for this revision. Parent-managed CUA review is separate; earlier visual
checks do not validate this new copy's wrapping or layout.
