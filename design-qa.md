# Design QA

**Comparison setup**

- Source visual truth: `/Users/edhaddad/Developer/Coordinated Website/herov2/hero_v2.png`
- Source pixels: 2880 × 2240 at 2× density, normalized to 1440 × 1120 for comparison.
- Implementation: `http://127.0.0.1:4173/`
- Implementation screenshot: `/Users/edhaddad/Documents/Codex/2026-09-15/referenced-chatgpt-conversation-this-is-an/work/coordinated-v2/qa-implementation-desktop.png`
- Implementation pixels and CSS viewport: 1440 × 1120 at 1× density.
- State: desktop, page top, propagation complete.
- Full-view comparison: `/Users/edhaddad/Documents/Codex/2026-09-15/referenced-chatgpt-conversation-this-is-an/work/coordinated-v2/qa-comparison-full.png`
- Focused hero comparison: `/Users/edhaddad/Documents/Codex/2026-09-15/referenced-chatgpt-conversation-this-is-an/work/coordinated-v2/qa-comparison-hero.png`
- Primary interactions tested: all four anchor destinations and the replay form's successful email-fallback state.
- Browser console errors: none.

**Findings**

- No actionable P0, P1, or P2 visual mismatches remain.
- Fonts and typography: Inter 400/500/600, the 54px headline, line breaks, weights, tracking, and tabular numerals match the source and brief.
- Spacing and layout rhythm: the 96px change line, 128px content origin, 700px hero, 428 × 330 change card, section spacing, radii, and shadows match the measured reference.
- Colors and visual tokens: graphite, white, off-white, border, muted tones, and changed red are mapped exactly. The fixed `#D2463E` token measures 4.48:1 against white in Lighthouse for small changed-value text; the token was preserved because the brief forbids changing it, and the resulting accessibility score is 95.
- Image quality and asset fidelity: the supplied SVG artwork remains vector. Receipt, Slack, and brief crops have their ruled-paper and margin-line backgrounds removed. The light mark is exact geometry extracted from the supplied Hero V2 source.
- Copy and content: the hero and reference copy match exactly. Below the hero, the implementation intentionally proceeds to Why while the abbreviated source board previews Evidence; this follows the requested page order.
- Responsiveness: 390px mobile is single-column, has no horizontal overflow, hides the change line, and keeps the product card and form usable.

**Open Questions**

- None.

**Comparison History**

- Pass 1: the hero copy column was 40px too narrow, the product card sat 17px low, and the supplied supporting SVGs still showed ruled-paper backgrounds.
- Fixes: widened the copy track to 700px, aligned the card at y=150, matched the specified desktop line breaks, and generated clean vector crops from the supplied SVGs.
- Post-fix evidence: the final full and focused comparisons show aligned hero geometry, matching typography, clean supporting artwork, and no remaining P0/P1/P2 drift.

**Implementation Checklist**

- Exact desktop and mobile layouts verified.
- Final propagation state verified.
- Replay success state verified.
- Source assets and crop quality verified.
- Lighthouse mobile performance and accessibility thresholds met.

**Follow-up Polish**

- None required for this brief.

final result: passed
