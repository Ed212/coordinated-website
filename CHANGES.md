# Coordinated site v5 changes

Status: local review candidate on `codex/site-v5`. Incomplete pending original comparison sources and deployment-safe PR publication. No deployment, DNS or hosting configuration change was performed. Brand marks and color variables are unchanged. Pre-existing untracked artwork and `.DS_Store` changes are excluded.

## Section sources and disposition

| Section | Source | Result |
| --- | --- | --- |
| Announcement | Original index/use-cases/evidence | Removed unverified pilot proof placeholders. |
| Hero A and B | Supplied BRIEF.md, change 2 | Exact label, headline variants, mechanism, agent line and proof line. One `templates/home.html` generates both files. B is absent from navigation. |
| Hero image | Existing Slack HTML card and galaxy assets | Slack card retained; subtle starfield replaces hero galaxy; smaller 1600px sources below 1200px; images lazy-loaded. |
| Actions | BRIEF.md, change 3 | Primary anchors to a real email-and-textarea form; secondary anchors to sample record; booking is generated only with BOOKING_URL. |
| Product strip | BRIEF.md, change 4a | Exact corrected reading boundary, one-card rule and company-size wording. |
| Memory band | Original dark-statement | Copy retained and moved before How it works; redundant galaxy background removed. |
| How it works | Original narrative-section | Three steps, path overlay and state changes preserved; one galaxy frame with responsive source. |
| Sample record | Original moments-section plus BRIEF.md, change 4d | Retitled; all six questions, provenance lists and decision rails retained. Fictional-example label added from existing design-notes fact ledger. |
| Attention comparison | Required landing-v4.tpl.html and calc.js, both missing | Blocked. No invented model, totals, measured labels or substitute calculator. Release gate fails. Exact replacement question remains pending with the comparison port. |
| Pilot | BRIEF.md, change 4f | Six weeks, one launch, chasing answers and preparing the review; four readout dimensions; configurable price with requested default. |
| Trust and architecture | Original trust-section and supplied context | Trust cards retained. People alone change the record; people and agents read accepted decisions. |
| Closing steps | Original starts-section | “One document. One change. One review.” retained; moved after trust; action leads to form. |
| Document form | BRIEF.md, change 3 | Email plus document textarea; same-origin Vercel function uses SMTP, no third-party form service. Success after transport accepts email; failure retains text; mailto no-JavaScript fallback. |
| Reading receipt | Original reader-receipt and BRIEF.md, change 4i | Browser-local receipt retained with requested quarterly product-receipt line. |
| Footer | Existing footer and BRIEF.md, change 4j | Address displayed as text; internal navigation repaired. |
| Use cases | Original use-cases.html | All product cards preserved; removed announcement, updated metadata, navigation and footer. |
| Pilot evidence | Original pilot-evidence.html and new brief | Placeholder readout removed; four measurement definitions, no claimed results. |
| Legal | Existing privacy and terms | Title punctuation only; legal copy and effective dates retained. |
| Metadata/OG | BRIEF.md, change 5 and existing Slack card | Exact title and description; dedicated og.html rendered to committed 1200x630 PNG with Playwright. |
| Internal design notes and unused generated imagery | Original internal materials | Excluded from the allowlisted built site, so historical placeholders and unsourced statistics are not public build output. Original files retained as internal history. |
| Statistics and why cards | Original sections 01 and 04 | Removed in full as requested; no exact approved source URLs for Half/45%/87%, so none retained. |

## Verification

- Copy grep passes for all seven built HTML documents and the rendered body of both variants.
- Eight Playwright cases pass: A/B at 400/1100 pixels, light/dark. No overflow or unexpected console errors; internal links/anchors, alt attributes, loaded responsive images, focus indicators, in-page submit success and failure checked. Expected simulated HTTP 502 is excluded from unexpected console errors.
- Form success is an integration test against the real local endpoint with an explicitly injected mail sink. No real customer document or live email was sent. Four server tests also exercise delivery failure, invalid input, foreign origins and absent configuration.
- No-JavaScript fallback checked.
- Lighthouse mobile: A 90, B 99; CLS zero for both. Raw reports and summary logs are in docs/site-v5/logs.
- Before screenshots: before-400.png and before-1100.png. After screenshots: a/b at both widths and both schemes in docs/site-v5/screenshots.
- OG rendered from og.html at 1200x630 and visually reviewed.
- calc.js unchanged-byte comparison, hash and totals (52, 58, 36, 29; pessimistic 41, 35) are BLOCKED because the source file is absent. The original RULES.md and FIVE-SECOND-TEST.md could not be reviewed either. Reference-check failure is saved, and CI deliberately fails the release gate until sources and comparison port are supplied.

## Items Ed must resolve

1. Supply the original four reference files named in the brief. They were absent locally; checking RULES.md on GitHub's default branch also returned 404. The comparison must then be ported and its original SHA-256 recorded here and in the PR.
2. TODO BOOKING_URL: unset. Booking action omitted until the real HTTPS destination is supplied.
3. CONTACT_ADDRESS: implementation defaults to the supplied ed@coordinatedai.ai; confirm the recipient.
4. PILOT_PRICE: unset; requested “Ask us for the number” is shown.
5. Form backend: repository indicates Vercel, so an API function using authenticated SMTP is implemented. Confirm SMTP host, port, credentials and verified sender before live delivery testing. No environment/hosting settings were changed.
6. PR publication: latest existing GitHub commit has a successful Vercel deployment status. Automatic preview behavior for this branch is unconfirmed. The no-deploy instruction prevents pushing/opening a PR until previews are confirmed disabled or Ed authorizes a preview. Prepared PR description is in docs/site-v5/PR.md.
7. Removed statistics: Half (LinearB), 45% (Gartner), 87% (Atlassian). No source lookup is needed to retain them because the brief authorizes full removal; none is used in v5.

## Removed-line ledger

Every removed text line from the original tracked files changed by this revision is listed below with its original line number and the reason applying to that removal block. Blank lines are included. Moves may appear as removal and addition in Git; their reason is the new section order. The previous OG raster was replaced by the requested browser-rendered share image. No brand raster/vector was altered.

### index.html, original lines 6 to 7

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
6:   <title>Coordinated — version control for what your company has agreed</title>
7:   <meta name="description" content="When a launch date or an assumption changes, the affected teams reach a decision before the deadline, with their conditions on record, and the next review starts current.">
```

### index.html, original lines 9 to 10

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
9:   <meta property="og:title" content="Coordinated — version control for what your company has agreed">
10:   <meta property="og:description" content="When the plan changes, everyone who depends on it knows the same day.">
```

### index.html, original lines 16 to 16

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
16:   <meta property="og:image:alt" content="Illustration: Two merging galaxies with a tiny red core beside the headline, “When the plan changes, everyone who depends on it knows the same day.”">
```

### index.html, original lines 27 to 31

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
27:
28:   <div class="announcement">
29:     <a href="pilot-evidence.html"><span>[PILOT PROOF POINT]</span> <span aria-hidden="true">→</span></a>
30:   </div>
31:
```

### index.html, original lines 38 to 38

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
38:       <a href="#why">Why</a>
```

### index.html, original lines 42 to 42

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
42:       <a class="nav-contact" href="mailto:ed@coordinatedai.ai?subject=Coordinated%20pilot">Contact</a>
```

### index.html, original lines 45 to 45

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
45:
```

### index.html, original lines 48 to 58

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
48:       <div class="hero-media">
49:         <picture>
50:           <source media="(max-width: 767px)" type="image/webp" srcset="assets/galaxy/portrait-upscaled-1600x2400.webp">
51:           <source type="image/webp" srcset="assets/galaxy/landscape-native-master-1485x825.webp 1485w, assets/galaxy/landscape-upscaled-2880x1600.webp 2880w" sizes="100vw">
52:           <img class="hero-galaxy" src="assets/galaxy/landscape-upscaled-2880x1600.webp" width="2880" height="1600" fetchpriority="high" alt="Illustration: Two interacting spiral galaxies with pale tidal tails converging on a bright shared core marked by a tiny red point, against deep black space.">
53:         </picture>
54:         <picture class="hero-starfield-picture" aria-hidden="true">
55:           <source media="(min-width: 768px)" type="image/webp" srcset="assets/galaxy/starfield-2880x1600.webp">
56:           <img class="hero-starfield" src="assets/galaxy/transparent.svg" width="2880" height="1600" alt="">
57:         </picture>
58:       </div>
```

### index.html, original lines 60 to 60

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
60:       <svg class="hero-connector" aria-hidden="true"><path data-hero-connector></path></svg>
```

### index.html, original lines 63 to 65

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
63:           <p class="eyebrow">Version control for what your company has agreed.</p>
64:           <h1 id="hero-title">When the plan changes, everyone who depends on it knows the same day.</h1>
65:           <p class="hero-promise">When a launch date or an assumption changes, the affected teams reach a decision before the deadline, with their conditions on record, and the next review starts current.</p>
```

### index.html, original lines 67 to 68

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
67:             <a class="button button-paper" href="mailto:ed@coordinatedai.ai?subject=My%20last%20launch%20document">Send us your last launch doc</a>
68:             <a class="text-link" href="#how">See a change propagate <span aria-hidden="true">→</span></a>
```

### index.html, original lines 98 to 98

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
98:
```

### index.html, original lines 101 to 101

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
101:         <p>Reads only what you hand it, post as artifacts, or tag it in</p>
```

### index.html, original lines 103 to 103

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
103:         <p>Built for 50–300-person software companies</p>
```

### index.html, original lines 106 to 107

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
106:
107:     <section class="section ledger-section" id="why" aria-labelledby="why-title" data-receipt-label="Why coordination fails">
```

### index.html, original lines 109 to 129

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
109:         <div class="section-intro">
110:           <p class="section-number">01 / Why</p>
111:           <h2 id="why-title">The plan changes where the record stops.</h2>
112:         </div>
113:         <div class="why-grid">
114:           <article class="why-card">
115:             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 3V5Z"/><path class="changed-stroke" d="M8 9h8M8 12h5"/></svg>
116:             <h3>A meeting is where the plan changes and where the record stops.</h3>
117:             <p>Review notes preserve the discussion. They rarely bind the owner, the date, the condition and the people downstream.</p>
118:           </article>
119:           <article class="why-card">
120:             <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h4M13 11l4-4M13 13l4 4"/><path class="changed-stroke" d="M11 9v6"/></svg>
121:             <h3>Everyone who depends on the date finds out on their own schedule.</h3>
122:             <p>Broadcasts make information available. They do not show who was asked, who answered, or whose condition still holds.</p>
123:           </article>
124:           <article class="why-card">
125:             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/><circle class="changed-fill" cx="17" cy="16" r="2"/></svg>
126:             <h3>The next review starts by reconstructing what happened.</h3>
127:             <p>The operator spends the first half of the meeting rebuilding the current plan instead of deciding what comes next.</p>
128:           </article>
129:         </div>
```

### index.html, original lines 132 to 132

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
132:
```

### index.html, original lines 137 to 137

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
137:             <p class="section-number">02 / How it works</p>
```

### index.html, original lines 161 to 162

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
161:             <img class="narrative-galaxy-image" src="assets/galaxy/landscape-upscaled-2880x1600.webp" width="2880" height="1600" loading="lazy" alt="Illustration: Two interacting spiral galaxies with pale tidal tails converging on a bright shared core marked by a tiny red point, against deep black space.">
162:             <img class="narrative-starfield" src="assets/galaxy/starfield-2880x1600.webp" width="2880" height="1600" loading="lazy" alt="" aria-hidden="true">
```

### index.html, original lines 191 to 199

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
191:
192:     <section class="dark-statement" data-receipt-label="Memory and the record">
193:       <div class="ledger-boundary">
194:         <img src="brand/mark_light.svg" width="56" height="56" alt="">
195:         <p>Memory tells you what was said. The record tells you what was agreed.</p>
196:       </div>
197:     </section>
198:
199:     <section class="section moments-section ledger-section" id="moments" aria-labelledby="moments-title" data-receipt-label="Six moments of change">
```

### index.html, original lines 202 to 203

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
202:           <p class="section-number">03 / Moments</p>
203:           <h2 id="moments-title">The record matters at the moment something changes.</h2>
```

### index.html, original lines 263 to 263

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
263:     <section class="stats-section" id="evidence" aria-labelledby="evidence-title" data-receipt-label="External evidence">
```

### index.html, original lines 265 to 267

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
265:         <div class="section-intro section-intro-wide">
266:           <p class="section-number">04 / Evidence</p>
267:           <h2 id="evidence-title">Execution breaks after the plan is already in motion.</h2>
```

### index.html, original lines 269 to 274

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
269:         <div class="stats-grid">
270:           <article><strong>Half</strong><p>of committed sprint work ships when promised.</p><cite>LinearB · 2,000+ engineering teams</cite></article>
271:           <article><strong>45%</strong><p>of product launches slip by a month or more.</p><cite>Gartner product-manager survey</cite></article>
272:           <article><strong>87%</strong><p>say there is no capacity to coordinate once everyone is executing.</p><cite>Atlassian State of Teams 2026 · 12,000 workers</cite></article>
273:         </div>
274:         <p class="stats-close">The slip isn't the problem we fix. What happens in the hours after it is.</p>
```

### index.html, original lines 277 to 313

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
277:
278:     <section class="section case-section ledger-section" aria-labelledby="case-title" data-receipt-label="Pilot proof">
279:       <div class="ledger-boundary case-grid">
280:         <figure class="evidence-placeholder" role="img" aria-label="A reserved evidence panel with four redacted pilot measures and one pending proof point.">
281:           <span>Evidence reserved</span><i></i><i></i><i></i><i></i>
282:         </figure>
283:         <div>
284:           <p class="section-number">05 / Pilot proof</p>
285:           <h2 id="case-title">[Company] worked one real change before the next review.</h2>
286:           <blockquote>“[Operator quote]”</blockquote>
287:           <p class="case-person">[Operator name, role]</p>
288:           <dl class="case-metrics">
289:             <div><dt>Chases per week</dt><dd>[Before → after]</dd></div>
290:             <div><dt>Median hours to decide</dt><dd>[Hours]</dd></div>
291:             <div><dt>Before the deadline</dt><dd>[n of m]</dd></div>
292:             <div><dt>Review prep</dt><dd>[Before → after]</dd></div>
293:           </dl>
294:           <a class="button button-outline" href="pilot-evidence.html">See how we measure</a>
295:         </div>
296:       </div>
297:     </section>
298:
299:     <section class="section starts-section" id="pilot" aria-labelledby="starts-title" data-receipt-label="How a pilot starts">
300:       <div class="ledger-boundary">
301:         <div class="section-intro">
302:           <p class="section-number">06 / How it starts</p>
303:           <h2 id="starts-title">One document. One change. One review.</h2>
304:         </div>
305:         <ol class="starts-grid">
306:           <li><span>01</span><p>Send one document with a real date in the next six weeks.</p></li>
307:           <li><span>02</span><p>Review one draft; send one card per person.</p></li>
308:           <li><span>03</span><p>Work through one change before the next review.</p></li>
309:         </ol>
310:         <a class="button button-dark" href="mailto:ed@coordinatedai.ai?subject=My%20last%20launch%20document">Send us your last launch doc</a>
311:       </div>
312:     </section>
313:
```

### index.html, original lines 317 to 317

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
317:           <p class="section-number">07 / Trust</p>
```

### index.html, original lines 339 to 339

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
339:
```

### index.html, original lines 355 to 355

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
355:
```

### index.html, original lines 360 to 360

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
360:         <a href="#why">Why</a><a href="#how">How it works</a><a href="pilot-evidence.html">Evidence</a><a href="#pilot">Pilot</a><a href="mailto:ed@coordinatedai.ai">Contact</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a>
```

### index.html, original lines 362 to 362

Reason: Apply the exact v5 hierarchy and metadata; remove unapproved placeholders, unsourced statistics and why cards; reorder retained sections, repair navigation, and replace email-only conversion with the document form.

```text
362:       <p>Built in the Bay Area.</p>
```

### pilot-evidence.html, original lines 6 to 6

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
6:   <title>Pilot evidence — Coordinated</title>
```

### pilot-evidence.html, original lines 9 to 9

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
9:   <meta property="og:title" content="Pilot evidence — Coordinated">
```

### pilot-evidence.html, original lines 14 to 14

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
14:   <meta property="og:image:alt" content="Illustration: Two merging galaxies with a tiny red core beside the headline, “When the plan changes, everyone who depends on it knows the same day.”">
```

### pilot-evidence.html, original lines 23 to 23

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
23:   <div class="announcement"><a href="#first-readout"><span>[PILOT PROOF POINT]</span> <span aria-hidden="true">→</span></a></div>
```

### pilot-evidence.html, original lines 26 to 26

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
26:     <nav class="primary-nav" aria-label="Primary navigation"><a href="index.html#why">Why</a><a href="index.html#how">How it works</a><a href="use-cases.html">Use cases</a><a href="pilot-evidence.html" aria-current="page">Evidence</a><a class="nav-contact" href="mailto:ed@coordinatedai.ai?subject=Coordinated%20pilot">Contact</a></nav>
```

### pilot-evidence.html, original lines 34 to 34

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
34:         <p>A pilot starts with one live initiative and defines the measures before the first change. The readout shows where coordination load moved, how quickly a recorded decision arrived, and whether the next review opened current.</p>
```

### pilot-evidence.html, original lines 41 to 67

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
41:         <h2 id="measures-title" class="section-number">Five pilot measures</h2>
42:         <article class="measure">
43:           <p class="measure-number">01</p>
44:           <div><h2>Chase load per week</h2><p>The number of direct follow-ups the operator sends to obtain an owner, answer, condition or decision for the pilot initiative. Routine reminders unrelated to a recorded change are excluded.</p></div>
45:           <p class="measure-placeholder">[Chases per week: before → after]</p>
46:         </article>
47:         <article class="measure">
48:           <p class="measure-number">02</p>
49:           <div><h2>Hours from reported change to recorded decision</h2><p>Elapsed time from the first artifact or tagged thread that reports a change until the person with authority records the accepted terms. Forecasts that never become changes remain visible but do not count as decisions.</p></div>
50:           <p class="measure-placeholder">[Median hours to decide]</p>
51:         </article>
52:         <article class="measure">
53:           <p class="measure-number">03</p>
54:           <div><h2>Changes decided before the earliest affected deadline</h2><p>The number of recorded changes decided before the first downstream lock, review, customer date or spend deadline named in the accepted dependencies.</p></div>
55:           <p class="measure-placeholder">[Changes decided before the deadline: n of m]</p>
56:         </article>
57:         <article class="measure">
58:           <p class="measure-number">04</p>
59:           <div><h2>People pending at the deadline</h2><p>The count of people asked to accept, condition, propose a date or decline who have not answered when the earliest affected deadline arrives. People who were only informed are not included.</p></div>
60:           <p class="measure-placeholder">[People pending at deadline]</p>
61:         </article>
62:         <article class="measure">
63:           <p class="measure-number">05</p>
64:           <div><h2>Review preparation minutes</h2><p>Operator time spent reconstructing the current initiative state before the weekly review. Time spent deciding future work during the review is excluded.</p></div>
65:           <p class="measure-placeholder">[Review prep: before → after]</p>
66:         </article>
67:       </div>
```

### pilot-evidence.html, original lines 73 to 73

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
73:         <div><p>The operator confirms the initiative, the earliest affected deadlines and the baseline window before the pilot begins. Coordinated records timestamps from accepted cards and review briefs. The final readout keeps bracketed fields until there is enough observed data to replace them.</p><p>No invented benchmark, extrapolated saving or unnamed customer quote appears in the readout.</p></div>
```

### pilot-evidence.html, original lines 77 to 92

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
77:     <section class="section ledger-section" id="first-readout" aria-labelledby="readout-title">
78:       <div class="ledger-boundary case-grid">
79:         <figure class="evidence-placeholder" role="img" aria-label="A reserved evidence panel with four redacted pilot measures and one pending proof point.">
80:           <span>Evidence reserved</span><i></i><i></i><i></i><i></i>
81:         </figure>
82:         <div>
83:           <p class="section-number">First readout / Pending</p>
84:           <h2 id="readout-title">[Company] · [initiative] · [pilot window]</h2>
85:           <dl class="case-metrics">
86:             <div><dt>Chases per week</dt><dd>[Before → after]</dd></div><div><dt>Median hours to decide</dt><dd>[Hours]</dd></div><div><dt>Before the deadline</dt><dd>[n of m]</dd></div><div><dt>Pending at deadline</dt><dd>[Count]</dd></div><div><dt>Review prep</dt><dd>[Before → after]</dd></div>
87:           </dl>
88:           <p>[Operator observation, with name and role after permission.]</p>
89:           <a class="button button-dark" href="mailto:ed@coordinatedai.ai?subject=Coordinated%20pilot">Discuss a pilot</a>
90:         </div>
91:       </div>
92:     </section>
```

### pilot-evidence.html, original lines 95 to 95

Reason: Remove unverified announcement, redaction graphic and bracketed readout; align measurement definitions with the four requested pilot outcomes; repair navigation and metadata.

```text
95:   <footer class="site-footer"><div class="ledger-boundary footer-grid"><a class="brand brand-footer" href="index.html"><img src="brand/mark_light.svg" width="36" height="36" alt=""><span>Coordinated</span></a><nav aria-label="Footer navigation"><a href="index.html#why">Why</a><a href="index.html#how">How it works</a><a href="use-cases.html">Use cases</a><a href="index.html#pilot">Pilot</a><a href="mailto:ed@coordinatedai.ai">Contact</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></nav><p>Built in the Bay Area.</p></div></footer>
```

### use-cases.html, original lines 6 to 6

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
6:   <title>Six moments on record — Coordinated</title>
```

### use-cases.html, original lines 9 to 9

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
9:   <meta property="og:title" content="Six moments on record — Coordinated">
```

### use-cases.html, original lines 14 to 14

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
14:   <meta property="og:image:alt" content="Illustration: Two merging galaxies with a tiny red core beside the headline, “When the plan changes, everyone who depends on it knows the same day.”">
```

### use-cases.html, original lines 24 to 24

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
24:   <div class="announcement"><a href="pilot-evidence.html"><span>[PILOT PROOF POINT]</span> <span aria-hidden="true">→</span></a></div>
```

### use-cases.html, original lines 28 to 28

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
28:       <a href="index.html#why">Why</a><a href="index.html#how">How it works</a><a href="use-cases.html" aria-current="page">Use cases</a><a href="pilot-evidence.html">Evidence</a><a class="nav-contact" href="mailto:ed@coordinatedai.ai?subject=Coordinated%20pilot">Contact</a>
```

### use-cases.html, original lines 149 to 149

Reason: Remove placeholder announcement; remove old response-time OG copy and em dash; repair removed-anchor navigation and show the contact address.

```text
149:   <footer class="site-footer"><div class="ledger-boundary footer-grid"><a class="brand brand-footer" href="index.html"><img src="brand/mark_light.svg" width="36" height="36" alt=""><span>Coordinated</span></a><nav aria-label="Footer navigation"><a href="index.html#why">Why</a><a href="index.html#how">How it works</a><a href="pilot-evidence.html">Evidence</a><a href="index.html#pilot">Pilot</a><a href="mailto:ed@coordinatedai.ai">Contact</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></nav><p>Built in the Bay Area.</p></div></footer>
```

### site.js, original lines 4 to 39

Reason: Remove obsolete galaxy-hero parallax/connector logic after replacing the hero image; retain all narrative, card and reading-receipt behavior.

```text
4:
5: const hero = document.querySelector("[data-hero]");
6: const heroGalaxy = document.querySelector(".hero-galaxy");
7: const heroStarfield = document.querySelector(".hero-starfield");
8: const heroConnector = document.querySelector(".hero-connector");
9: const heroConnectorPath = document.querySelector("[data-hero-connector]");
10: const heroCardTitle = document.querySelector("[data-hero-card-title]");
11: const landscapeHeroAlt = "Illustration: Two interacting spiral galaxies with pale tidal tails converging on a bright shared core marked by a tiny red point, against deep black space.";
12: const portraitHeroAlt = "Illustration: Two merging galaxies with a tiny red shared core and pale tails sweeping from the left, beneath a dark, open upper field.";
13:
14: function updateHero() {
15:   if (!hero || !heroGalaxy || !heroStarfield) return;
16:   heroGalaxy.alt = desktopMotion.matches ? landscapeHeroAlt : portraitHeroAlt;
17:
18:   if (reduceMotion.matches || !desktopMotion.matches) {
19:     heroGalaxy.style.transform = "none";
20:     heroStarfield.style.transform = "none";
21:   } else {
22:     const heroRect = hero.getBoundingClientRect();
23:     const progress = clamp(-heroRect.top / Math.max(window.innerHeight, 1));
24:     heroGalaxy.style.transform = `scale(${1 + (progress * 0.05)}) rotate(${progress * 2.5}deg)`;
25:     heroStarfield.style.transform = `scale(${1 + (progress * 0.08)}) rotate(${progress * 4}deg) translate3d(0, ${progress * -10}px, 0)`;
26:   }
27:
28:   if (!heroConnector || !heroConnectorPath || !heroCardTitle || !desktopMotion.matches) return;
29:   const heroRect = hero.getBoundingClientRect();
30:   const titleRect = heroCardTitle.getBoundingClientRect();
31:   const startX = heroRect.width * 0.62011;
32:   const startY = heroRect.height * 0.45;
33:   const endX = titleRect.left - heroRect.left;
34:   const endY = titleRect.top - heroRect.top + Math.min(titleRect.height / 2, 14);
35:   const bend = Math.max(36, (endX - startX) * 0.45);
36:
37:   heroConnector.setAttribute("viewBox", `0 0 ${heroRect.width} ${heroRect.height}`);
38:   heroConnectorPath.setAttribute("d", `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - 34} ${endY}, ${endX} ${endY}`);
39: }
```

### site.js, original lines 46 to 46

Reason: Remove obsolete galaxy-hero parallax/connector logic after replacing the hero image; retain all narrative, card and reading-receipt behavior.

```text
46:     updateHero();
```

### site.js, original lines 143 to 143

Reason: Remove obsolete galaxy-hero parallax/connector logic after replacing the hero image; retain all narrative, card and reading-receipt behavior.

```text
143: updateHero();
```

### privacy.html, original lines 7 to 7

Reason: Replace the em dash in title metadata to satisfy the copy rule; legal text is unchanged.

```text
7:     <title>Privacy Policy — Coordinated</title>
```

### terms.html, original lines 7 to 7

Reason: Replace the em dash in title metadata to satisfy the copy rule; legal text is unchanged.

```text
7:     <title>Terms of Service — Coordinated</title>
```

### README.md, original lines 1 to 1

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
1: # Coordinated marketing site
```

### README.md, original lines 3 to 3

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
3: Static multi-page marketing site for Coordinated.
```

### README.md, original lines 5 to 5

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
5: ## Pages
```

### README.md, original lines 7 to 11

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
7: - `index.html` — homepage and category narrative
8: - `use-cases.html` — six complete change moments with HTML product cards
9: - `pilot-evidence.html` — five pilot measures and first-readout placeholders
10: - `design-notes.html` — sitemap, concepts, motion, components and fact ledger
11: - `privacy.html` and `terms.html` — existing legal pages
```

### README.md, original lines 13 to 13

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
13: ## Local preview
```

### README.md, original lines 15 to 15

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
15: Run any static server from the repo root. For example:
```

### README.md, original lines 17 to 19

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
17: ```sh
18: python3 -m http.server 4173
19: ```
```

### README.md, original lines 21 to 21

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
21: Then open `http://127.0.0.1:4173/`.
```

### README.md, original lines 23 to 23

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
23: The production host uses `vercel.json` with clean URLs enabled.
```

### README.md, original lines 25 to 25

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
25: ## Replacing placeholders
```

### README.md, original lines 27 to 27

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
27: Search for `[` to find all pending proof fields. Replace them only with approved pilot evidence:
```

### README.md, original lines 29 to 38

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
29: - `[PILOT PROOF POINT]`
30: - `[Company]`
31: - `[Operator quote]`
32: - `[Operator name, role]`
33: - `[Chases per week: before → after]`
34: - `[Median hours to decide]`
35: - `[Changes decided before the deadline: n of m]`
36: - `[People pending at deadline]`
37: - `[Review prep: before → after]`
38: - `[initiative]` and `[pilot window]`
```

### README.md, original lines 40 to 40

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
40: Keep every published date in weekday-month-day format, for example `Tue Oct 6`. Do not replace bracketed fields with estimates.
```

### README.md, original lines 42 to 42

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
42: ## Assets
```

### README.md, original lines 44 to 44

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
44: The active hero system lives in `assets/galaxy/`. Runtime delivery uses the quality-94 WebPs; the landscape and phone PNG masters remain in the source archive and are intentionally excluded from the site build. The Open Graph PNG, path SVGs, anchors, alt text, prompts and verification results are kept with the runtime assets. Earlier generated supporting assets remain in `assets/generated/`, with provenance in `ASSET-PROMPTS.md`.
```

### README.md, original lines 46 to 46

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
46: ## Interaction and accessibility
```

### README.md, original lines 48 to 48

Reason: Replace obsolete v4 and placeholder instructions with v5 development, form configuration, verification and source-blocker documentation.

```text
48: `site.js` controls the scroll-driven hero layers, pinned narrative states, active moment index, card answer states and reader receipt. It has no external dependency and stays below the 40 KB interaction budget. Reduced-motion users receive static narrative states with no rotation, push, parallax, stream or pulse animation. Below 768px, the galaxy remains still and the foreground starfield is removed from the protected headline area.
```
