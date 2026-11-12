## Approved blue galaxy hero release

The November 12 approved composition is integrated only into the existing release build. The exact source is private review commit `03275e42fed674249237b046cc01532ed9a5cec6`. The source image and presentation styles/controller remain byte-identical. `scripts/blue-galaxy-release.mjs` adds the blue backdrop, viewport-safe layout and product reveal after actual distant flight (or static/failure/scroll escape), while preserving every on-page word, link, media byte and playback control. The original playback controller is unchanged. Mobile retains full-width 16:9 film above copy/card; desktop fills the viewport edge to edge.

Release CSS appends the two scoped approved sheets in cascade order without changing their bytes. Production canonical/indexability, `/b`, linked pages and contact flow remain intact. The named `codex/blue-galaxy-release-20261112` Vercel/Netlify review branch now builds this same root with noindex; production still requires Vercel main. All comparison pages retain their original files. `scripts/verify-hero-composition.mjs` adds viewport, inert-card, Replay, scroll-escape and static-state checks to CI. The existing mobile Lighthouse >=90 and exact-zero CLS gates are unchanged.

Rollback baseline: `0b39ede42e1f1d71360771f298ebd14e4ba18cb6` (tree `7ad192f4c8713f3c98f2e316aef5698332084b7f`). Chromium CI is required before merge. Safari remains unverified; no additional access or media work is included.

## Latest galaxy release

The latest deployment request supersedes the historical preview-only directions below for this marketing website. The approved galaxy page is the release source, with its current Northstar story, exact cinematic media/runtime, prelaunch disclosures and existing contact behavior. The root and `/b` are the same canonical homepage; `/use-cases` uses the aligned chronology. `/galaxy-study`, `/solar-study` and `/launch-preview` remain available and noindex, with their comparison content intact.

Build modes are explicit and tested:

- `npm run build`: archival ordinary output outside the release gates below.
- `WIDE_LAUNCH_PREVIEW=local npm run build`: isolated local comparison studies and aligned linked pages, without promoting the root.
- `COORDINATED_RELEASE=local npm run build`: exact indexable release-root candidate for local verification and CI. This override fails on hosted builds.
- Vercel production: only `VERCEL=1`, `VERCEL_ENV=production`, and `VERCEL_GIT_COMMIT_REF=main` promote the galaxy root.
- Same-tree review: only the `codex/solar-bridge-study` branch in Netlify deploy-preview or Vercel preview promotes the candidate root. It stays noindex, with production canonical/OG URLs. Other hosted branches and Netlify production stay ordinary.

Release changes remove the study-only banner at `/` and `/b`, preserve all product-maturity and fictional-example disclosures, and add canonical metadata. There is no second release template, new creative asset, CTA, form, permission or hosting-dashboard change. Release roots use a full-size, pixel-identical lossless WebP delivery of the final-frame PNG (which remains the unchanged fallback), with earlier preload discovery and an exact concatenation of the existing CSS in cascade order. Comparison pages and all motion/runtime sources remain unchanged. See `RELEASE-GALAXY.md` for the validation commands and deployment handoff. Production publication remains a separate authorized step after exact-candidate checks.

## November 10 draft cross-page consistency correction

The existing `/galaxy-study` story now also governs the isolated draft root and linked `/use-cases` example. Their dates, separate owner acceptances, three plan versions, fictional launch-day evidence and next review agree. A final copy-only draft build step preserves the production templates, canonical galaxy story, solar comparison and all design/media/runtime behavior. See `NORTHSTAR-CONSISTENCY-PREVIEW.md` for exact scope and six-mode isolation checks. This correction alone does not enable production output or publish anything.

## Opus follow-up on November 8

The corrections to reviewed head 7f84ddd keep PR #4 draft and preview-only. Northstar’s first mention is explicitly fictional; the hero names GTM leads, product leaders and founders, and frames growth as something each launch can teach us about. A short conversation-history/agreement distinction now appears in the hero. A paired Leo/agent example consults the same approved version 1 and scope source, without action authority. Repeated loop narration is trimmed; the hero action accurately says See the learning review. The proven Inter hyphen-width issue is fixed by removing global tabular numeric features, without replacing fonts or ordinary hyphens. See CONTENT-OPUS-FOLLOWUP-2026-11-08.md for scope and review handoff. No ready transition, merge or production promotion.

## November 8 review revision: shared agreement for people and agents

Continue draft PR #4 on codex/growth-learning-preview. The previous 6e89b2b preview is superseded for review by the current copy; neither prior checks nor this amendment authorize production. Keep the growth headline, active program-manager/learning loop, three benefits and original galaxy hero. Explain that conversation history helps recall what was said, while Coordinated is being built to preserve what was agreed/decided, which version applies and what still needs an answer.

Make the intended benefits concrete for people and permitted agents across positioning, pricing, budgets, dependencies and launch gates. Show proposed versus approved changes, superseded decisions, source/evidence freshness and missing delivery acceptance. A changed decision requires the appropriate human authority and separate owner acceptance; reading context grants no action/approval rights. Agent consultation is design intent, not deployed capability or an integration claim. Preserve prelaunch/illustrative/no demonstrated growth labels and existing contact/privacy/runtime/assets. No categorical claims about other memory tools. Current scope and review-sensitive promises are in CONTENT-POSITIONING-2026-11-08.md. Required Opus review is pending in the existing opportunity thread; keep PR #4 draft, with no merge or production promotion.

## November 7 growth-led review preview

The current preview starts from published commit `5e5c8707268f9257554045c7f248a411209df6ad`, whose tree matches the approved November 4 source. Lead with “Turn product momentum into market growth.” Coordinated is an AI GTM program manager in development: form concrete dated owner commitments, map dependencies and launch gates, run targeted owner check-ins, gather market evidence against assumptions and help people carry decisions into coordinated follow-through. Launch is a milestone, not the end. Growth is an outcome ambition, not a demonstrated lift.

Use the illustrative Northstar guided-activation program to show both forming commitments and learning after launch. Keep the export/Security delay as a supporting dependency, not the entire job. Distinguish proposed work, exact owner acceptance, human judgment/approval, specialist gates and action authority. Named people and selected Slack sources may support a separately permitted first pilot; do not imply CRM/product-analytics integrations, automatic prioritization, setup-time evidence, launched software or customer results.

Preserve the original galaxy assets and hero geometry, static stack, existing email/copy fallback, privacy and terms behavior. Video stays deferred on its separate branch. This iteration authorizes an isolated GitHub/Netlify review preview only; no merge, production promotion, security/DNS/environment changes or outreach. This latest direction supersedes the narrower launch-only positioning and earlier publication status notes below. See `CONTENT-POSITIONING-2026-11-07.md` for current scope and verification.

## November 4 content follow-up: preserve the live hero

This content-only preview keeps the exact live hero photo, responsive image sources, hero-specific styles and desktop photo/card geometry from live commit a9db33408f81ffaefa8f54ef206a6622950e7bf4. The mobile order stays copy, photo, card. New text changes wrapping and moves the mobile photo/card down 31.484px; header height and image framing match live. The mobile header CTA is now visible and unclipped. Video work stays deferred on its separate branch and preview.

Lead with the AI go-to-market program manager for launches, the 50 to 300-person software-company audience and the product/GTM pace gap. Explain active coordination, human decisions and owner confirmation through one illustrative Northstar story. Keep one clear Prelaunch disclosure, no launched-user/results claims and no unsupported security/privacy guarantees. Use Walk through your last launch with existing email/copy fallback. Remove homepage simulator, reading receipt and broader company-decision pitch; preserve the original calculator source only as an archive. Supporting pages use one Launch example and How we’ll measure vocabulary.

Current work is preview-only on the existing content-preview branch. Do not merge, promote production, change account security or add video. The current user instruction overrides older hero-enlargement and historical local-only notes below.

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

The public site uses mailto and Copy address, with no submission form or document-upload flow. The legacy `/api/contact` endpoint remains for compatibility; its tests use injected transports. A configured mail service accepting a recipient is not confirmation of inbox delivery. The website does not claim delivery or a reply.

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
