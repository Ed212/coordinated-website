# Coordinated marketing site

Static multi-page marketing site for Coordinated.

## Pages

- `index.html` — homepage and category narrative
- `use-cases.html` — six complete change moments with HTML product cards
- `pilot-evidence.html` — five pilot measures and first-readout placeholders
- `design-notes.html` — sitemap, concepts, motion, components and fact ledger
- `privacy.html` and `terms.html` — existing legal pages

## Local preview

Run any static server from the repo root. For example:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

The production host uses `vercel.json` with clean URLs enabled.

## Replacing placeholders

Search for `[` to find all pending proof fields. Replace them only with approved pilot evidence:

- `[PILOT PROOF POINT]`
- `[Company]`
- `[Operator quote]`
- `[Operator name, role]`
- `[Chases per week: before → after]`
- `[Median hours to decide]`
- `[Changes decided before the deadline: n of m]`
- `[People pending at deadline]`
- `[Review prep: before → after]`
- `[initiative]` and `[pilot window]`

Keep every published date in weekday-month-day format, for example `Tue Oct 6`. Do not replace bracketed fields with estimates.

## Assets

The active hero system lives in `assets/galaxy/`. Runtime delivery uses the quality-94 WebPs; the landscape and phone PNG masters remain in the source archive and are intentionally excluded from the site build. The Open Graph PNG, path SVGs, anchors, alt text, prompts and verification results are kept with the runtime assets. Earlier generated supporting assets remain in `assets/generated/`, with provenance in `ASSET-PROMPTS.md`.

## Interaction and accessibility

`site.js` controls the scroll-driven hero layers, pinned narrative states, active moment index, card answer states and reader receipt. It has no external dependency and stays below the 40 KB interaction budget. Reduced-motion users receive static narrative states with no rotation, push, parallax, stream or pulse animation. Below 768px, the galaxy remains still and the foreground starfield is removed from the protected headline area.
