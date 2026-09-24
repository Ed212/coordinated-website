# Coordinated marketing site

A static, dependency-free marketing site. The convergence edition connects the merging-galaxy identity to a living company plan across functions, a local interactive product illustration, and a concrete design-partner pilot.

## Pages

- `index.html`: galaxy-led positioning; interactive company plan; change and decision loop; operator, contributor, leader, and agent views; operating cadence; fit, boundaries, pilot scorecard, and FAQ.
- `pilot.html`: recommended starting scope, effort estimates, three-review sequence, deliverables, success proposals, and founder contact.
- `pilot-evidence.html`: baseline, definitions, suggested thresholds, integrity checks, and continue/adjust/stop criteria.
- `principles.html`: context, participation, dissent, honest forecasts, audience boundaries, and human authority.
- `use-cases.html`: six explicitly fictional coordination scenarios.
- `privacy.html` and `terms.html`: existing policy text in the shared visual shell. Policy text is unchanged; implementation does not establish its operational accuracy.
- `design-notes.html`: implementation notes, excluded from indexing.

## Local preview

```sh
python3 -m http.server 4188
```

Open the local server. Vercel uses clean URLs; links also work on a simple static server.

## Design and assets

`styles.css` retains the existing base and walkthrough styles. `experience.css` applies the responsive visual system: deep ink black, warm paper-white and ivory, charcoal, and neutral gray. Red is reserved for meaningful change/error states and the galaxy core; ordinary navigation and availability indicators stay neutral. The existing galaxy pair and native mobile artwork are preserved. The hero reveals the shared red core; the closing and inner-page compositions reuse the same art. No generated customer portraits, logos, testimonials, or product screenshots were added.

`assets/product/og-template.html` is the source for the new 1200×630 social PNG. Review screenshots are in `docs/previews/` and excluded from the Vercel deployment. Galaxy asset provenance remains in `assets/galaxy/README.md`.

## Local interactions

`experience.js` powers three initiative views: Atlas launch, customer onboarding, and delivery capacity. The Atlas delay changes a forecast only. Its impact follows explicitly declared relationships. Other views preserve missing baseline evidence and conditional hiring capacity. The example is labeled fictional throughout.

Four accessible role tabs explain operator, human, leader, and optional agent value. Arrow keys, Home, and End navigate tabs. Links into the detailed simulation open its disclosure. `site.js` retains the six-stage simulation with explicit authority, stale-decision invalidation, unresolved responses, and an open legal prerequisite.

These are frontend illustrations. They do not query a company, execute an agent, authorize a real decision, send data, or persist state. The examples reset on reload. No analytics or trackers were added. No auto-playing animation is used; reduced motion disables smooth scrolling and decorative transforms.

## Pilot offer and contact

The suggested starting scope is one initiative, two or three functions, and three existing reviews, usually two to four weeks. Setup and check-in durations are planning estimates. A 30% reduction in recurring operator effort is a proposed target to agree at kickoff, not an observed result or guarantee. Participant effort, setup, corrections, founder support, missed deadlines, open decisions, and integrity checks remain part of the evaluation.

Pricing, data arrangements, continuation, and any live connectors or agent experiment must be explicitly scoped with the founder. The site does not claim those integrations are generally available.

The contact form previews an encoded email draft. The user sends it in their own mail app. It does not submit a lead or claim a message was sent. Starter prompts never replace visitor-written content. Edits invalidate the previous draft; clipboard failure has a manual-copy fallback. With JavaScript off, starter controls are hidden and the preview submit button is disabled; direct email remains available.

## Verification

`tests/website-smoke.cjs` uses Playwright for meaningful state, contact, and responsive checks. Set `SITE_BASE_URL`, `SITE_QA_DIR`, and optionally `CHROMIUM_EXECUTABLE_PATH`. The website itself has no package dependencies.

See `design-qa.md` for verified checks and remaining limitations. Production publication is separate from the draft PR preview.
