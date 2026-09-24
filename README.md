# Coordinated marketing site

Static, dependency-free website for Coordinated. Production uses Vercel clean URLs.

## Pages

- `index.html`: living-plan positioning, galaxy hero, six-stage interactive example, audience benefits, research and pilot invitation.
- `principles.html`: context, participation, response to concerns, honest forecasts, audience boundaries, human authority.
- `pilot.html`: pilot scope, practical questions, optional email-draft preparation. No file upload or lead-submission service.
- `pilot-evidence.html`: measurement methodology, explicitly separated from unpublished customer results.
- `use-cases.html`: six independent fictional scenarios; static response illustrations point to the interactive homepage example.
- `privacy.html` and `terms.html`: existing policies, unchanged. Their operational claims still require owner verification.
- `design-notes.html`: implementation notes (noindex).

## Local preview

```sh
python3 -m http.server 4188
```

Open `http://127.0.0.1:4188/`. The `.html` navigation works on a basic static server and Vercel.

## Walkthrough behavior

The example has six stages: agreed plan, forecast, Sarah's response, Nadia's decision, current terms, next-review brief. A proposed date becomes the agreement only when the example decision is explicitly recorded. Asking to talk or leaving a request unanswered preserves v1 and its unresolved status. Legal approval remains open in every path. Revising a response invalidates later decisions; restart clears the simulation.

The source plan declares the customer pilot's separate staging prerequisite and independence from the public announcement. All people, company names, and Oct 2026 dates are illustrative. User-entered example text is escaped, stays in memory, and is never transmitted or persisted. Without JavaScript a readable example remains available.

## Pilot contact

The form previews an email. It does not send a lead, claim success, upload documents, or install Slack. The visitor must send the prepared message in their email app. Editing the form hides the previous draft; clipboard failure provides a manual-copy fallback. Without JavaScript the submit button stays disabled and direct email remains available. No analytics or external intake endpoint was added.

Pilot scope, duration, pricing, participant effort and data arrangements must be agreed with the founder before starting. These are deliberately not invented in the copy. The current policies were not rewritten to claim unverified security or AI-provider practices.

## Assets

The existing galaxy hero and phone crop remain. The redundant narrative galaxy and placeholder proof art are removed from active pages. The product visualization is accessible HTML/CSS with deterministic local state rather than a raster mockup. `assets/product/og-template.html` is the source for the new 1200×630 social PNG. Legacy artwork remains for provenance and is not referenced by active pages.

## Verification

See `design-qa.md` for the checks actually performed on this revision. `tests/website-smoke.cjs` covers the meaningful state and contact risks. It uses Playwright; run with `node tests/website-smoke.cjs` while the preview server is running. Set `SITE_BASE_URL` and `SITE_QA_DIR` to override its local URL and screenshot location. This task used the environment's installed Playwright dependency; no package installation is required for the website itself.

## Review images

Current desktop, phone, and interactive review screenshots are in `docs/previews/`. These review artifacts and the QA scripts are excluded from the Vercel deployment.
