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

Generated assets live in `assets/generated/`. Alt text and exact regeneration prompts are in `ASSET-PROMPTS.md`. The supplied mark files in `brand/mark_dark.svg` and `brand/mark_light.svg` are reused unchanged.

## Interaction and accessibility

`site.js` controls the pinned narrative, active moment index, card answer states and reader receipt. It has no external dependency and stays below the 60 KB interaction budget. Reduced-motion users receive immediate state changes and a static settled narrative frame.
