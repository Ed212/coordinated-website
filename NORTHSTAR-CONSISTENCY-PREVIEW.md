# Northstar cross-page consistency correction

November 10, 2026. This local correction takes the existing public draft's
`/galaxy-study` story as its source of truth. It changes only the built draft
homepage and its linked `/use-cases` example. It does not publish, deploy or
change the production-build gate.

## One story across the three pages

- Version 1 plans guided activation and export together. Planning is not a
  cleared gate or delivery acceptance.
- Export's delayed Security review creates the choice between moving the whole
  launch to Mon Nov 30 and releasing core guided activation on Mon Nov 23 once
  its own gates pass. Product and GTM choose the smaller launch. Export stays
  held. Pricing and Finance keep $49 per team/month and the $3,000 budget.
- Version 2 records the approved core-only launch and separate owner acceptance:
  Maya's core readiness by Thu Nov 19; Leo's page/demo without export claims and
  Priya's matching support guidance by Fri Nov 20. Owners deliver, required core
  checks pass and Dana gives the Mon Nov 23 go-ahead.
- The Tue Nov 24 review uses launch-day sales notes (three of five prospects
  misunderstood), first-use records (two of six teams shared a report) and
  Finance's $1,200 actual spend. These are small fictional observations.
- Version 3 records Dana and GTM's clearer first-report message test, Leo's
  accepted revised copy/demo by Fri Nov 27 and the Tue Dec 1 evidence review
  accepted by Leo and Maya. Product/GTM review claims before publication. Price
  and budget remain unchanged; before/after observations remain separate and
  the outcome stays open.

The root keeps its existing heading, components, styles and geometry rules.
The six-step detail page keeps its six articles and all IDs. Text naturally
changes wrapping; no markup or spacing is added to accommodate it. Every exact
old/new string is listed in `scripts/preview-northstar-copy.mjs`.

## Isolation and verification

`alignNorthstarCopy` is a pure, fail-closed copy transformation, reusable by a
separately authorized release builder. The draft build hook runs last, only
when the existing gated build has produced `dist/galaxy-study.html`. Source
`index.html`, `b.html`, `use-cases.html`, the home template, all CSS/runtime,
media, contact behavior and link destinations are unchanged. The canonical
galaxy output, including its later market-opportunity paragraph, and the solar
comparison/launch alias remain byte-identical to the prior public draft.

Passed locally:

- `node --test tests/*.test.mjs`: 71 tests.
- Six real builds in a temporary copy: ordinary, Netlify production, wrong-branch
  preview and Vercel retain identical ordinary output with no draft assets;
  local and correct-branch draft builds change only the expected root/detail
  output and preserve canonical galaxy/comparison hashes.
- Regression coverage checks version status, acceptance, chronology, weekdays,
  numerical evidence, fictional/prelaunch boundaries, unchanged markup/assets/
  links/contact and fail-closed behavior on changed or already-transformed input.
- Existing 90-file invariant remains intact, allowing only the exact new final
  build import. No existing production source or design file is exempted.
- `WIDE_LAUNCH_PREVIEW=local npm run build`,
  `node scripts/verify-galaxy-build.mjs`, `npm run check:copy`,
  `npm run check:references` and `git diff --check`.

Browser QA is assigned separately. No browser, Lighthouse, hosted CI or
publication result is claimed here. The generic old-homepage browser suite
remains for ordinary builds; the draft-specific build verifier checks the
aligned copy rather than asserting it is a byte-for-byte ordinary-page copy.
