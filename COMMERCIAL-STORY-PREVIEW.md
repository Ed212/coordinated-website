# Commercial story review preview

November 9, 2026. Local, unpublished content-only revision of `/galaxy-study`,
based on `0ff959764c81dd507217a39081aa811b89f72c65`. No push, deployment,
production change, new asset, integration or purchase is included. The full
reading-order copy is in `COMMERCIAL-STORY-COPY.md`.

## Exact hero copy

**Headline**

> Launch fast. Learn what lands. Act on that learning.

**Support**

> Give Coordinated a goal and the people involved. We’re building it to help
> your team shape a launch plan, agree who owns what and use market evidence
> to decide the next move.

**Shared-plan distinction**

> A shared, versioned plan that keeps decisions and accepted commitments clear.
> People retain judgment.

**Maturity disclosure**

> Prelaunch. Software in development. Intended workflow, not shipped capability.

The headline replaces the earlier cinematic wording only on `/galaxy-study`.
The existing heading element, inline span, classes, fonts, styling and layout
rules remain intact. Text naturally changes wrapping and section height; no
layout, typography or spacing rules are changed to accommodate it.

## One end-to-end story

Northstar is one fictional example throughout the hero card and page:

1. Dana supplies the goal, helping new teams reach their first shared report,
   and the people involved. The launch plan covers guided activation, positioning,
   a fictional $49 per team/month offer and a fictional $3,000 campaign budget.
2. Export’s delayed Security review creates an explicit human choice: move the
   whole launch to Mon Nov 30 or launch core guided activation on Mon Nov 23,
   after its own gates pass. Product and GTM choose the smaller scope. Export
   remains blocked; Pricing and Finance retain the offer and budget.
3. Maya, Leo and Priya separately accept revised readiness, page/demo and support
   deliverables with dates. The approved direction is not itself owner acceptance.
4. Owners deliver, required core checks pass and Dana authorizes the launch.
5. The Tue Nov 24 review uses launch-day evidence: three of five prospects
   mistook the offer for another dashboard, two of six new teams shared a report,
   and Finance records $1,200 actually spent. All observations are fictional,
   explicitly small and inconclusive, not measured product or customer outcomes.
6. Dana and GTM choose a message test. Pricing stays steady and Finance holds
   extra spend. Leo accepts revised copy/demo by Fri Nov 27. Leo and Maya accept
   the Tue Dec 1 evidence review. Product and GTM review claims before publication.
   Before/after observations stay separate; no causal effect or successful test
   outcome is asserted.

Three shared versions carry the launch plan, the core-only revision and the
post-launch test. Current decisions, exact accepted commitments, superseded
versions and open answers explain the intended distinction from general
assistant drafting or recall. People retain judgment and approval authority.
Reading context grants no action authority; permitted agents stay within scope.

There is no claim of a shipped full loop, deployed integration, measured speed
improvement, growth or ROI. The separate strategic-visibility/sandbox discussion
is not added to this preview.

## Preserved design and behavior

- `scripts/galaxy-commercial-story.mjs` changes preview-only text and its text
  labels. `scripts/northstar-walkthrough.mjs` changes only two navigation labels:
  Set the goal; Launch and learn. The other two remain Make the decision and
  Accept the work. All four stages stay visible without JavaScript.
- No element structure, class, ID, link destination, control or disclosure
  behavior changes. The headline retains the existing inline span. Content
  regions still fail closed when the upstream source differs.
- A checked-in test fixture compares structural markup before and after the
  commercial and walkthrough transforms with the pre-revision `0ff9597` output.
  Only text nodes and text-only ARIA/metadata labels are excluded from this hash.
- A second invariant covers the bytes of 90 design, media, runtime, production,
  template and supporting files. All CSS, runtime JavaScript, Arc launch and
  native-loop footage, exact fallback image, accessibility behavior and controls
  match that same baseline.
- Production `/` and `/b`, supporting pages, `/solar-study`, `/launch-preview`,
  contact/email behavior, privacy and terms remain unchanged. PR #5 is untouched.
  Existing detailed-workflow links retain their destinations.

## Verification

Passed on the revised source:

- `node --test tests/*.test.mjs`: 65 tests, including 12 commercial-story tests.
  Coverage includes exact headline, goal/plan/choice/acceptance chronology,
  fictional evidence and spend, dates, version/authority boundaries, no-JS
  content, fail-closed transforms, structural hashes and unchanged-file hashes.
- `WIDE_LAUNCH_PREVIEW=local npm run build`.
- `node scripts/verify-galaxy-build.mjs`.
- `npm run check:copy`, `npm run check:references`, `git diff --check`.
- Six build modes checked in a separate temporary source copy, leaving the
  review build stable. Ordinary, Netlify production, wrong-branch deploy-preview
  and Vercel modes exclude preview routes/assets. Local and correct draft-branch
  modes include them. Ordinary output hashes match across all six modes; both
  comparison and revised-preview hashes match across the two preview modes.
  These are local build tests, not a deployment or hosted CI result.

Reading volume versus `0ff9597`, with the same counting method on both versions:

- Editorial main content: 930 → 1,070 default; 1,107 → 1,266 expanded.
- Including decorative labels and motion-control text: 985 → 1,125 default;
  1,162 → 1,321 expanded.
- Default excludes closed-disclosure bodies but retains their summaries.
  Expanded includes both disclosures. Editorial counts exclude the preview
  banner, decorative chapter labels and motion controls. The additional 140
  default words cover the earlier goal, plan, security choice and launch stages.
  Counts describe reading volume, not comprehension or conversion.

Managed-preview CUA review passed at 1,180 pixels and in a 390-pixel iframe:

- New hero and support text readable, existing visual treatment/components
  retained, and no horizontal overflow at either width.
- Desktop native Example navigation, keyboard Launch and learn navigation
  focusing `northstar-learning`, and disclosure expansion verified.
- Mobile keyboard Accept the work navigation focused `northstar-coordinate`;
  the complete acceptance card was readable without clipping.
- Static deep-link fallback and media wrappers remained unchanged.

These are sampled responsive checks, not a physical-device test or full
accessibility audit. Shell Chromium could not start because of environment
socket permissions; no browser result is claimed from that route. No full
Playwright suite, Lighthouse or hosted CI run is claimed for this local copy
revision. The unchanged long motion suite was not rerun in a browser; existing
runtime unit coverage and byte-preservation assertions pass.

Publication remains pending separate approval. Do not present the existing
public preview as containing this new copy until the revised commit is
explicitly published and verified.
