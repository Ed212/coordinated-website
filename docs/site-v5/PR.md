# Revise site v5 messaging, pilot conversion and attention comparison

The site now leads with Coordinated as an AI program manager in Slack and offers a six-week pilot discussion before requesting a launch document. A single template generates the two headline variants; `b.html` exists for the five-second test and is not linked from navigation. The pitch sentence remains verbatim.

The original attention comparison is ported with its chart, table, assumptions, pessimistic case, person ledger and replacement question. `calc.js` is inlined byte-for-byte unchanged. SHA-256: `a289412212e78d7b1bdf20d1063077ed0ca991be56fd5f300d6da42c3a45adde`.

Copy distinguishes “Measured on the simulator fixture”, “In the pilot today” with manual delivery, and “What we are building”. Unsupported absolutes were removed; acceptance is distinguished from current evidence and unknowns. Atlas examples are individually labeled fictional and separate from the Lantern simulator; all original provenance and decision rails remain verbatim. The alleged nothing-due/Marco contradiction does not appear in these Atlas lines, so no unsupported timeline edit was made.

All placeholders in the built site, the reserved-evidence graphic, three why cards and unsourced statistics strip are removed. The existing mark, palette, Slack card, galaxy propagation frame, trust cards and browser-local receipt remain. The optional form sits below the agreed-scope line inside the pilot section; its same-origin SMTP function confirms only after delivery succeeds. No tracking is added. Fonts retain the same families and weights and are served locally with their licenses.

## Validation

- `check:references` passes; original calculator hash pinned.
- Eight Playwright cases pass: A/B, 400/1100px, light/dark. Tests include rendered copy, overflow, console errors, links/anchors, images/alt, keyboard focus, evidence labels, optional-form placement, copy buttons, form success/failure without navigation, B navigation isolation and exact inline hash.
- Default totals: 52, 58, 36, 29 hours. Pessimistic: 41 and 35. Sliders and weekday person ledger verified.
- Copy grep passes across the built pages and collapsed/expanded rendered text.
- Four contact-server tests pass; local mail sink used for browser checks. No live email sent.
- Mobile Lighthouse A **98**, B **98**, CLS zero. Share image rendered from dedicated og.html at 1200x630.

[Section sources and removed-line ledger](../../CHANGES.md) · [Logs](logs/) · [Original references](.)

| View | Before | After A | After B |
| --- | --- | --- | --- |
| 400px | [Before](screenshots/before-400.png) | [A](screenshots/a-400-light.png) | [B](screenshots/b-400-light.png) |
| 1100px | [Before](screenshots/before-1100.png) | [A](screenshots/a-1100-light.png) | [B](screenshots/b-1100-light.png) |

Dark-mode screenshots are also committed beside these. Human founder research has not been run; the provided five-second protocol remains a production-release step.

## Ed's remaining configuration

- **TODO BOOKING_URL:** unset; “Discuss a six-week pilot” uses the verified email route until a real HTTPS scheduling URL is supplied.
- **CONTACT_ADDRESS:** defaults to `ed@coordinatedai.ai`; confirm recipient and add SMTP values plus a verified sender as Vercel environment variables. Never put them in the repository. Live delivery awaits that configuration; the email route remains visible.
- **PILOT_PRICE:** unset; “Ask us for the number” shown.
- Branch previews are allowed by the updated request. Production deploys remain manual. Vercel Git settings redirected to sign-in, so promotion settings were not independently verified. No merge, Vercel deploy/promotion command, DNS or account setting change was made. The repository now declares outputDirectory: dist as the targeted preview-build correction.
- Half/45%/87% figures were removed; no statistic is retained without its exact source.

## Preview-host findings

The first GitHub push workflow passed. The first PR workflow also passed its browser checks and Lighthouse scores (97/98), then failed deleting Chrome's temporary directory. Cleanup now retries the delete to handle child-process teardown. Final local browser checks pass, including an HTML 404 response from a missing form endpoint; that case now keeps the document and displays the email fallback rather than a technical parse error.

The supplied Vercel error confirms that it expected public/ after the build, while the build produces dist/. vercel.json now explicitly selects dist, preserving cleanUrls. This fixes the output-directory mismatch without a dashboard change. The repository also has an existing Netlify integration. Its preview renders both headlines, but serves repository sources including raw templates and has no `/api/contact` function (404). That separate Netlify output/backend configuration still needs owner attention before using it for production. The intended `dist/` output excludes raw templates and passes placeholder checks. No account settings or DNS were changed; only the repository outputDirectory declaration was added for the reported Vercel failure. See [preview checks](logs/host-previews.log). No merge or production deploy was initiated; main remained at 74aa156.
