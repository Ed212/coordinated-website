# Coordinated marketing site v5

Static HTML marketing site with a Vercel email function. No tracking is included.

## Develop and verify

Use Node 22 or newer. Run `npm ci`, then `npm run build`. The generated homepage files are checked in for review; edit `templates/home.html` and rebuild to keep A and B synchronized. `b.html` is intentionally absent from navigation.

Run `TEST_MAIL_SINK=1 npm run preview` for a local preview at http://127.0.0.1:4174. This explicit local test mode accepts mail without sending it. The production handler has no test sink. Without the flag, local preview uses the real SMTP configuration and fails visibly when it is missing.

- `npm run check:copy`: checks all built HTML for placeholders, prohibited language, promises and dates without weekdays.
- `npm test`: validates contact delivery and failure behavior with an injected transport.
- `npm run test:browser`: captures both variants at 400 and 1100 pixels, light and dark; tests copy, overflow, links, anchors, alt attributes, image delivery, focus, form success/failure, and no-JavaScript fallback. Start the preview with the test sink first.
- `npm run test:performance`: mobile Lighthouse for both variants, requiring at least 90.
- `npm run check:references`: verifies the required references, the comparison port and the original calculator SHA-256.

Install Chromium with `npx playwright install chromium`, or set `CHROME_PATH` to an existing Chrome executable. The GitHub workflow runs these checks and retains screenshots and logs. It does not deploy.

## Configuration

Copy `.env.example` into your local environment as needed; scripts read environment variables, not the file itself.

Build variables:

- `BOOKING_URL`: HTTPS pilot-discussion booking destination. If unset, the primary action uses the verified email route and a TODO is logged; no fake booking destination is shown.
- `PILOT_PRICE`: approved display price; defaults to “Ask us for the number”.

Server variables:

- `CONTACT_ADDRESS`: document recipient, default `ed@coordinatedai.ai`; confirm with Ed.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: authenticated mail transport and verified sender. Port 465 uses TLS; other ports require STARTTLS.

The form sends email and pasted document text to `/api/contact` on this site's host. There is no third-party form service or document storage. Success is returned only after SMTP accepts the message. Delivery failure keeps the document in the form. No JavaScript fallback: email `ed@coordinatedai.ai`.

The existing Vercel configuration is unchanged. The function uses the host's standard `api/` convention; no native static form service is configured. No hosting, DNS, or environment settings were changed in this revision. Configure the mail transport before accepting live submissions. Production deployment remains manual.

## Copy and comparison sources

The original references now live in `docs/site-v5/`: RULES.md, landing-v4.tpl.html, calc.js, FIVE-SECOND-TEST.md and COPY-FIXES.md. The latest copy fixes supersede the earlier cold-document ask and unsupported absolutes. The pitch sentence remains verbatim.

The comparison markup is ported in `docs/site-v5/attention-section.html`; the weekday ledger adapter is in `templates/attention-runtime.js`. The build inlines `calc.js` byte-for-byte unchanged, after all formatting. Its SHA-256 is `a289412212e78d7b1bdf20d1063077ed0ca991be56fd5f300d6da42c3a45adde`. Browser checks verify both that hash and totals 52, 58, 36, 29 hours; pessimistic 41 and 35; slider recalculation; and the person ledger's weekday labels.

The three evidence labels separate simulator measurements, manually delivered pilots and planned architecture. Atlas moments remain fictional examples, explicitly separate from the measured Lantern fixture.

Both headline pages are generated from the same template; `b.html` is not linked from navigation. The five-second founder test remains a human research step before production release; no participant results have been invented.

See `CHANGES.md` for every section's source, removals, verification and the remaining owner configuration. Review artifacts live in `docs/site-v5/`. Branch previews are allowed under the updated request; production deployment remains manual. No deployment or hosting-settings command is part of this workflow.
