# Design QA

## Comparison setup

- Implementation: `http://127.0.0.1:4173/`
- Desktop viewport: 1280 × 900.
- Tablet viewport: 768 × 900.
- Mobile viewport: 390 × 844.
- Reviewed states: hero, all three feature rows, Evidence audience band, Replay sample and form, empty/format errors, successful email handoff, and all three artifact overlays.
- Acceptance screenshots: `coordinated-1280-{hero,how,replay}.png` and `coordinated-390-{hero,how,replay}.png` in the task outputs directory.

## Final findings

- No actionable P0, P1, or P2 visual or interaction mismatches remain.
- Typography: Inter 400/500/600, sentence case, tabular numerals, requested hierarchy, and mobile wrapping are preserved.
- Layout and spacing: sections use 72px vertical padding on desktop and 48px on mobile. Labels have a 28px content gap. At 1280px, all feature artifacts measure 635px with a 64px gutter and alternate as specified.
- Responsiveness: 390px and 768px show no horizontal overflow. The red margin rule is hidden below 900px. Feature copy precedes each artifact, and mobile controls use 44px or larger targets (the checkbox uses its 44px associated label).
- Color and surfaces: off-white appears only on How it works; all other sections remain white or graphite. Changed values alone use the brand red. Cards retain the requested border, radius, and shadow.
- Assets: receipt and brief remain SVG and use viewBox crops rather than redraws. The change card is HTML. The supplied logo marks are reused without modification.
- Interactions: propagation replay stays in place, all artifact overlays close by button or Escape, the file control is keyboard labeled, and all requested inline validation states work.
- Accessibility: the initial count is `aria-hidden`; the final count remains exposed. Reduced motion removes the animation and the initial visual state. Lighthouse mobile accessibility is 95. The sole failing audit is the fixed `#D2463E` brand red at 4.48:1 against white, which was not altered because the design system forbids deviation.
- Performance: critical hero CSS is inlined while the full stylesheet loads asynchronously. Lighthouse mobile performance is 100, with 0.9s FCP and 1.3s LCP.

## Open item

- The privacy retention sentence was intentionally not added. The current mailto-only handoff cannot technically enforce deletion; product-owner confirmation of the manual retention process is required first.

final result: passed
