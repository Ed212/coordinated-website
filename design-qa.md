# Website revision QA — September 24, 2026

## Scope

Local static build of the website on `feat/gtm-living-plan-experience`. This is website behavior verification, not validation of the underlying Coordinated service. No production deployment or contact message was sent.

## Automated checks performed

Run `tests/website-smoke.cjs` with a local static server. Browser: packaged headless Chromium in the task environment.

- Five public pages load with one H1 and no horizontal overflow at 1440, 768, 390, and 320 pixels.
- A forecast does not change the agreed announcement date.
- Sarah's proposed date becomes v2 only after the explicit example decision by Nadia.
- The exact contributor note reaches the decision as escaped text, not executable HTML.
- Missing responses and requests for discussion cannot take the amendment path.
- Editing a response invalidates previously reached decisions; restart clears the example.
- Every branch preserves outstanding legal approval in the next-review brief.
- The unresolved path calls out the passed spend lock instead of claiming spend was paused.
- The email form rejects whitespace-only descriptions, produces an encoded draft, hides stale previews after edits, and makes no submission request.
- Without JavaScript, the example is readable and email remains available; the form's disabled preview button cannot submit personal information as URL parameters.
- No browser JavaScript exceptions in the exercised paths.
- No bracketed pilot-proof placeholders or broken images on the five tested pages.

## Visual inspection

Reviewed desktop hero, example review brief, mobile hero, mobile response card, and 1200×630 social image. The mobile headline spacing and header layout were corrected during review. The desktop now presents the whole example card alongside the main proposition. The second galaxy illustration is replaced by readable product state. The fictional-data label remains visible on the walkthrough.

## Limits and launch dependencies

- No quantified accessibility-compliance or performance score is claimed.
- The form prepares email only. Actual mailbox delivery and qualification are outside this static website.
- The existing privacy/terms pages are unchanged. The founder must confirm actual pilot scope, commercial terms, source permissions, retention/deletion and AI-provider arrangements with prospects.
- Customer outcomes are unpublished; the evidence page describes a methodology, not results.
- Social metadata references the new PNG; third-party crawler refresh/caching was not tested.
