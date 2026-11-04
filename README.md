## November 4 review corrections

The preview foregrounds the illustrative product card and audience. Hero links reveal the affected work and the next decision; they do not approve changes. The website now offers mailto contact only, with no collection/submission form. BOOKING_URL is intentionally unused in this preview so every contact CTA matches its email-app explanation. The legacy contact endpoint is retained for compatibility; its response confirms configured mail-service recipient acceptance only, never inbox delivery. Its tests use injected transports and send no real messages. Privacy text covers the marketing website and email enquiries; proposed product boundaries are not presented as verified production controls. This work remains preview-only, with no production promotion or security-setting changes.

## November 3 review preview: product-speed go-to-market

The newest review direction leads with “Let your go-to-market move at the speed of your product.” The core proof is an explicitly illustrative before/after: Security delays export; the same seven functions coordinate the same scope and approvals. Show parallel core preparation, work waiting for approved facts, unresolved Security clearance, accountable owners and the human go/no-go. No invented time savings or measured speedup. The older meeting-effort simulator is secondary and collapsed, with no claim that it evaluates launch speed. This iteration is PREVIEW ONLY; no production promotion or security-prompt interaction is authorized.

## November 3 positioning update

The current website request supersedes earlier category-provisional copy and local-only delivery restrictions for this website update. Lead with “AI go-to-market program manager for launches”. Describe an adaptable current plan, accountable owners, approvals, launch gates, dependencies, readiness evidence and changed commitments. People keep decision and approval authority. Approved positioning, feature and security information underpin this workflow; broader company decisions are secondary. Coordinated is prelaunch with no launched users; illustrative workflows and simulator assumptions are not shipped capability or customer results. Discovery is a 30-minute walkthrough of the last launch, no prep or documents, using the visitor’s screen rather than collecting data. Any pilot and data sharing need a separate scope and permissions agreement. Preserve existing hosting audience, privacy and security boundaries.

# Coordinated marketing site v5

Static HTML marketing site with a Vercel email function. No tracking is included.

## Develop and verify

Use Node 22 or newer. Run `npm ci`, then `npm run build`. The generated homepage files are checked in for review; edit `templates/home.html` and rebuild to keep A and B synchronized. `b.html` is intentionally absent from navigation.

Check port ownership first. Run `PORT=4186 TEST_MAIL_SINK=1 npm run preview` for a local test preview at http://127.0.0.1:4186 (or choose a verified free port). Port 4174 was observed serving the separate Aura app; do not stop an unrelated server. This explicit local test mode accepts mail without sending it. The production handler has no test sink. Without the flag, local preview uses the real SMTP configuration and fails visibly when it is missing.

- `npm run check:copy`: checks all built HTML for placeholders, prohibited language, promises and dates without weekdays.
- `npm test`: validates contact delivery and failure behavior with an injected transport.
- `npm run test:browser`: captures both variants at 400 and 1100 pixels, light and dark; tests copy, overflow, links, anchors, alt attributes, image delivery, focus, form success/failure, and no-JavaScript fallback. Start the preview with the test sink first.
- `npm run test:performance`: mobile Lighthouse for both variants, requiring at least 90.
- `npm run check:references`: verifies the required references, the comparison port and the original calculator SHA-256.

Install Chromium with `npx playwright install chromium`, or set `CHROME_PATH` to an existing Chrome executable. The GitHub workflow runs these checks and retains screenshots and logs. It does not deploy.

## Configuration

Copy `.env.example` into your local environment as needed; scripts read environment variables, not the file itself.

Build variables:

- `BOOKING_URL`: HTTPS launch-discussion booking destination. If unset, the primary action uses the verified email route and a TODO is logged; no fake booking destination is shown.
- `PILOT_PRICE`: approved display price; defaults to “Ask us for the number”.

Server variables:

- `CONTACT_ADDRESS`: document recipient, default `ed@coordinatedai.ai`; confirm with Ed.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: authenticated mail transport and verified sender. Port 465 uses TLS; other ports require STARTTLS.

The form sends email and pasted document text to `/api/contact` on this site's host. There is no third-party form service or document storage. Success is returned only after SMTP accepts the message. Delivery failure keeps the document in the form. No JavaScript fallback: email `ed@coordinatedai.ai`.

The Vercel configuration preserves clean URLs and explicitly sets the build output to dist/. The function uses the host's standard `api/` convention; no native static form service is configured. No dashboard, DNS, or environment settings were changed; the repository outputDirectory declaration corrects the reported preview-build mismatch. Configure the mail transport before accepting live submissions. Production deployment remains manual.

## Copy and comparison sources

Current copy authority is `docs/site-v5/BRIEF.md`, `RULES.md`, `COPY-FIXES.md` and
`FIVE-SECOND-TEST.md`, aligned October 30 with the canonical Handled ROADMAP/D-0021
and Execution HQ GTM sources linked in the brief. The later October 30 homepage review leads with concrete intended outcomes:
“Launch faster. Keep your standards.” The decision-to-action loop remains the job,
not the opening benefit. Four distinct role benefits follow the hero.
Outcome/analysis-first consultation, decision preparation, scoped human approval,
separate exact delivery acceptance, authorized follow-through and later evidence
define the complete job. Category naming remains provisional. Documents are optional. Initial Linear/GitHub
coexistence implies no deployed integration.

The October 29 instructions are preserved in
`docs/site-v5/archive/2026-10-30-decision-to-action/`. The original v5 instructions are preserved in
`docs/site-v5/archive/2026-10-29-copy-reconciliation/`; `landing-v4.tpl.html` and
`v4-CHANGES.md` are historical source evidence only. Their document-first journey,
fixed shared-record pitch and present pilot language are superseded. Do not
regenerate current copy from them. Original calc.js remains unchanged.

The comparison markup is ported in `docs/site-v5/attention-section.html`; the weekday ledger adapter is in `templates/attention-runtime.js`. The build inlines `calc.js` byte-for-byte unchanged, after all formatting. Its SHA-256 is `a289412212e78d7b1bdf20d1063077ed0ca991be56fd5f300d6da42c3a45adde`. Browser checks verify both that hash and totals 52, 58, 36, 29 hours; pessimistic 41 and 35; slider recalculation; and the person ledger's weekday labels.

The evidence labels separate simulator counts, illustrative workflows, research/manual exploration and planned architecture. The full product and product pilot are not ready. Atlas moments are fictional, separate from the Lantern fixture; manual effort is not software autonomy or customer-value proof.

Both headline pages are generated from the same template; `b.html` is not linked from navigation. The five-second founder test remains a human research step before production release; no participant results have been invented.

See `CHANGES.md` for every section's source, removals, verification and the remaining owner configuration. Review artifacts live in `docs/site-v5/`. That October 30 request was local only. The newer November 3 website update authorizes publishing this positioning update through the existing website hosting path; unrelated product deployments and configuration changes remain out of scope.
