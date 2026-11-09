# Northstar example walkthrough

Preview-only enhancement on `/galaxy-study`. The November 9 commercial revision
is documented in `COMMERCIAL-STORY-PREVIEW.md`. The comparison routes, production
pages, hero headline, assets and controls remain unchanged.

Four numbered native links guide readers through the fictional commercial
example: Frame the value, Launch with a question, Read the response, Choose the
next move. The links navigate rather than approve, change or simulate product
state. All four stages remain visible in reading order, with no JavaScript
dependency, hidden panels, timed advancing, pinned section or scroll
interception. Native fragments support keyboard focus, browser history and
direct links. Target outlines identify the selected stage. Existing work/gate,
learning-review and contact anchors remain available. Reduced motion uses the
existing global static-scroll rule.

The primary illustration stays visible. Supporting work/gate details are now
collapsed, like the version detail in the trust section; the existing hero link
opens the work/gate disclosure when selected. No primary copy sits in a carousel
or a simulated product interface.

Implementation: `scripts/galaxy-commercial-story.mjs` first applies the approved
preview-only copy. `scripts/northstar-walkthrough.mjs` adds navigation over that
story; `northstar-walkthrough.css` retains the existing scoped layout. The
transforms fail on missing, duplicated or changed expected targets. Verification
compares the approved transformed story rather than demand original-copy
equality with the intentionally unchanged solar comparison.

Verification:
- `node --test tests/*.test.mjs`: 32 passing.
- Normal build and non-authorized hosting modes exclude preview routes/assets.
- Local/draft-branch builds, galaxy verification, copy and reference checks pass.
- Hero media/controls, contact, link destinations and existing IDs are preserved.
- Local browser review passed at desktop and in a 390-pixel iframe, including
  all four native targets, keyboard focus, disclosure toggles and Back.
  This is not a physical-device test. Full browser/performance checks run in CI.
