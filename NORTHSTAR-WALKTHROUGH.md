# Northstar example walkthrough

Preview-only enhancement on `/galaxy-study`. `/solar-study`, production pages,
hero assets, business copy and example approval/acceptance states are unchanged.

Four numbered native links guide readers through the existing direction,
commitments, coordination and learning content. The links navigate rather than
approve, change or simulate product state. All four stages remain visible in
original reading order, with no JavaScript dependency, hidden panels, timed
advancing, pinned section or scroll interception. Native fragments support
keyboard focus, browser history and direct links. Target outlines identify the
selected stage. Existing dependencies, learning-review anchor and contact links
remain available. Reduced motion uses the existing global static-scroll rule.

Implementation: `scripts/northstar-walkthrough.mjs` transforms the derived
preview only; `northstar-walkthrough.css` adds the scoped layout. The build
fails if expected insertion targets are missing or duplicated. Copy verification
removes only the exact known navigation string before comparing every original
post-hero word with the solar comparison.

Verification:
- `node --test tests/contact.test.mjs tests/galaxy-scroll.test.mjs tests/endless-space.test.mjs tests/northstar-walkthrough.test.mjs`: 25 passing.
- Normal `npm run build`: no galaxy, walkthrough or launch-preview assets/routes.
- `WIDE_LAUNCH_PREVIEW=local npm run build`, `node scripts/verify-galaxy-build.mjs`, copy and reference checks: passing.
- Browser visual/keyboard QA and hosted CI are coordinated separately; these
  static checks do not substitute for browser validation.
