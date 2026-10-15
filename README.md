# Coordinated marketing site v5

Static HTML marketing site with a Vercel email function. No tracking is included.

## Develop and verify

Use Node 22 or newer. Run `npm ci`, then `npm run build`. The generated homepage files are checked in for review; edit `templates/home.html` and rebuild to keep A and B synchronized. `b.html` is intentionally absent from navigation.

Run `TEST_MAIL_SINK=1 npm run preview` for a local preview at http://127.0.0.1:4174. This explicit local test mode accepts mail without sending it. The production handler has no test sink. Without the flag, local preview uses the real SMTP configuration and fails visibly when it is missing.

- `npm run check:copy`: checks all built HTML for placeholders, prohibited language, promises and dates without weekdays.
- `npm test`: validates contact delivery and failure behavior with an injected transport.
- `npm run test:browser`: captures both variants at 400 and 1100 pixels, light and dark; tests copy, overflow, links, anchors, alt attributes, image delivery, focus, form success/failure, and no-JavaScript fallback. Start the preview with the test sink first.
- `npm run test:performance`: mobile Lighthouse for both variants, requiring at least 90.
- `npm run check:references`: blocks release while the original required reference files or comparison port are absent.

Install Chromium with `npx playwright install chromium`, or set `CHROME_PATH` to an existing Chrome executable. The GitHub workflow runs these checks and retains screenshots and logs. It does not deploy.

## Configuration

Copy `.env.example` into your local environment as needed; scripts read environment variables, not the file itself.

Build variables:

- `BOOKING_URL`: HTTPS booking destination. If unset, the action is omitted and a TODO is logged. A fake destination is never shown.
- `PILOT_PRICE`: approved display price; defaults to “Ask us for the number”.

Server variables:

- `CONTACT_ADDRESS`: document recipient, default `ed@coordinatedai.ai`; confirm with Ed.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: authenticated mail transport and verified sender. Port 465 uses TLS; other ports require STARTTLS.

The form sends email and pasted document text to `/api/contact` on this site's host. There is no third-party form service or document storage. Success is returned only after SMTP accepts the message. Delivery failure keeps the document in the form. No JavaScript fallback: email `ed@coordinatedai.ai`.

The existing Vercel configuration is unchanged. The function uses the host's standard `api/` convention; no native static form service is configured. No hosting, DNS, or environment settings were changed in this revision. Do not publish until the source blockers and mail configuration are resolved.

## Required source files

The supplied brief names `docs/site-v5/RULES.md`, `landing-v4.tpl.html`, `calc.js`, and `FIVE-SECOND-TEST.md`. None existed locally or at the checked GitHub default-branch path. Copy checks currently implement the rules stated directly in the brief.

The attention comparison is intentionally incomplete until the original sources arrive. Do not reconstruct a model from the requested totals. Once supplied, port the exact comparison markup to `docs/site-v5/attention-section.html`, retain labels, add the replacement question, and keep `calc.js` byte-for-byte unchanged. The build inlines that file and prints its SHA-256. Verify totals 52, 58, 36, 29 hours and pessimistic 41, 35 before clearing the release gate.

See `CHANGES.md` for section sources, removals and the remaining decisions. Review artifacts live in `docs/site-v5/`.
