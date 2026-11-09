import { createHash } from 'node:crypto';

// Local commercial-story review draft. Apply only to the derived galaxy preview,
// before chapter decoration and native walkthrough links. No runtime behavior.
export const commercialPositioning = 'Launch fast. Learn what lands. Act on that learning.';
export const commercialHeroSupport = 'Give Coordinated a goal and the people involved. We’re building it to help your team shape a launch plan, agree who owns what and use market evidence to decide the next move.';
export const commercialHeroAgreement = 'A shared, versioned plan that keeps decisions and accepted commitments clear. People retain judgment.';
export const commercialDescription = 'We’re building Coordinated to help teams launch, learn from market evidence and decide what to do next. Prelaunch software in development.';

const heroProduct = `<div class="hero-product" aria-label="A fictional launch and learning example">
          <article class="slack-card hero-card" data-hero-card>
            <p class="example-label">Fictional example · Northstar</p>
            <header class="slack-card-header">
              <img loading="lazy" src="brand/mark_dark.svg" width="32" height="32" alt="">
              <div><strong>Coordinated</strong><span>Illustrative next decision</span></div>
              <time datetime="2026-11-24T09:14">Tue Nov 24, 9:14 AM</time>
            </header>
            <h2 data-hero-card-title>The launch is out. What comes next?</h2>
            <p>Northstar spent $1,200 of its $3,000 launch budget. Three of five prospects misunderstood the offer. Dana chooses a message test before more spend.</p>
            <dl class="reached-list">
              <div><dt>Accepted</dt><dd>Leo: revised message and demo by Fri Nov 27</dd></div>
              <div><dt>Held steady</dt><dd>$49 per team/month; no extra budget</dd></div>
              <div><dt>Next check</dt><dd>Tue Dec 1: understanding and first use</dd></div>
            </dl>
            <nav class="card-actions" aria-label="Explore this illustrative example">
              <a href="#launch-dependencies" data-open-detail="launch-dependencies">See work and gates</a>
              <a href="#next-decision" data-focus-target="next-decision">See the learning review</a>
            </nav>
            <p class="card-reason">Fictional observations, not customer results. The next test’s outcome is open.</p>
          </article>
        </div>`;

const sections = {
  roles: `<section class="trust-ribbon" id="roles" aria-label="The intended launch and learning workflow">
      <picture class="ribbon-starfield-picture" aria-hidden="true">
        <source media="(max-width: 1199px)" srcset="assets/galaxy/starfield-1600.webp">
        <img class="ribbon-starfield" src="assets/galaxy/starfield-2880x1600.webp" width="2880" height="1600" loading="lazy" alt="">
      </picture>
      <div class="ledger-boundary trust-ribbon-grid role-benefits">
        <article><h2>Launch fast</h2><p>Turn a goal into a plan with owners, commercial choices, dependencies and launch gates.</p></article>
        <article><h2>Learn what lands</h2><p>Review what prospects understood, what customers did and what the launch actually cost.</p></article>
        <article><h2>Act on that learning</h2><p>Choose the next move, agree who will deliver it and set the next evidence check.</p></article>
      </div>
    </section>`,
  moments: `<section class="section ledger-section launch-comparison" id="moments" aria-labelledby="moments-title">
      <div class="ledger-boundary">
        <p class="example-label">Fictional program · Northstar</p>
        <h2 id="moments-title">One goal. A changing plan. A next step.</h2>
        <p class="scenario-trigger"><strong>Start with the goal and the people.</strong> Dana wants Northstar’s new teams to reach their first shared report. She names Product, GTM, Support, Security, Pricing and Finance. The intended workflow turns that brief into a launch plan: guided activation on Mon Nov 23, first-report positioning, a $49 per team/month offer and a $3,000 campaign budget.</p>
        <div class="launch-comparison-grid">
          <article class="launch-comparison-panel">
            <p class="section-number">Human decision</p><h3>Security needs another week. Choose the scope.</h3>
            <p>Export’s security review is delayed. Dana can move the whole launch to Mon Nov 30 or launch guided activation on Mon Nov 23 without export, once its own gates pass. Product and GTM choose the smaller launch. Pricing and Finance keep the offer and budget unchanged. Export remains blocked pending Security approval.</p>
          </article>
          <article class="launch-comparison-panel proposed-panel">
            <p class="section-number">Accepted work</p><h3>A revised plan needs each owner’s acceptance.</h3>
            <p>Version 2 proposes the smaller launch. Maya accepts core readiness by Thu Nov 19; Leo accepts the page and demo without export claims by Fri Nov 20; Priya accepts matching support guidance by Fri Nov 20. Each accepts their own revised deliverable and date. Dana’s decision alone does not assign their work.</p>
          </article>
        </div>
        <div class="launch-state" aria-label="Illustrative Northstar learning review">
          <div><span>Launch · Mon Nov 23</span><p>The owners deliver, required core checks pass and Dana gives the go-ahead. The page, demo and support guidance describe guided activation only. Export stays out.</p></div>
          <div><span>Read the evidence · Tue Nov 24</span><p>Sales notes from five launch-day calls show three prospects mistook the offer for another dashboard. First-use records show two of six new teams shared a report. Finance records $1,200 spent. These small samples leave important questions open.</p></div>
          <div><span>Choose the next move</span><p>Dana and GTM choose a clearer first-report message. Pricing stays at $49; Finance holds extra spend. Leo accepts revised copy and a demo by Fri Nov 27, with Product and GTM reviewing claims before publication.</p></div>
          <div id="next-decision" tabindex="-1"><span>Check again · Tue Dec 1</span><p>Leo and Maya accept the review: did the revised message run, can prospects explain the value, and are teams sharing a first report? They compare dated notes, first-use records and actual spend, keeping before/after observations separate. The next decision waits for that evidence.</p></div>
        </div>
        <details class="dependency-map" id="launch-dependencies">
          <summary>See the work, dependencies and launch gates</summary>
          <div class="dependency-map-rows">
            <article><h3>Product and Security</h3><p>Maya owns guided-activation readiness and first-use evidence. Security clears the core release separately; export cannot enter the plan until its review passes.</p><span class="dependency-tag">A gate is not a date</span></article>
            <article><h3>GTM and Support</h3><p>Leo’s page and demo depend on approved scope and claims. Priya’s support guidance depends on that same version. A new scope change needs their separate acceptance.</p><span class="dependency-tag">Acceptance is specific</span></article>
            <article><h3>Pricing, Finance and Dana</h3><p>Pricing owns the offer; Finance owns the budget and actual-spend review. Dana makes the go/no-go decision after required approvals and readiness evidence.</p><span class="dependency-tag">Authority stays with people</span></article>
          </div>
        </details>
        <p class="scenario-disclosure">Fictional example of the intended workflow, not a customer result or evidence of growth.</p>
        <a class="text-link text-link-dark" href="use-cases.html">Read the detailed workflow example →</a>
      </div>
    </section>`,
  how: `<section class="section narrative-section" id="how" aria-labelledby="how-title">
      <div class="ledger-boundary narrative-layout">
        <div class="narrative-copy">
          <div class="section-intro"><p class="section-number">How we expect it to help. Not yet measured.</p><h2 id="how-title">Less waiting. Less rework. A next check.</h2></div>
          <p>A general assistant can help draft a plan or recall a conversation. Coordinated is being designed around a shared, versioned plan: what people decided, which work each owner accepted and what still needs an answer.</p>
          <ol class="journey-list">
            <li><h3>Build the plan with the people</h3><p>Start with the goal and team. Bring positioning, pricing, content, budget, owners, dependencies and launch gates into one plan. Ask the responsible people to resolve open choices.</p></li>
            <li><h3>Work from the current agreed version</h3><p>Keep people and permitted agents working from current decisions and accepted commitments. When scope changes, show what it affects and ask those owners to accept the revised work.</p></li>
            <li><h3>Give learning a next step</h3><p>After launch, bring customer observations, market evidence and actual spend to a review. People decide the next action; owners accept the work and its next evidence check.</p></li>
          </ol>
        </div>
        <div class="narrative-visual"><p class="section-number">How we would test this</p><article class="slack-card launch-outcome-card"><p class="example-label">Prospective measures</p><h3>Measure delays, not just activity.</h3><p>A separately agreed pilot would examine:</p><dl class="reached-list"><div><dt>Built to launch</dt><dd>Time from a ready build to release</dd></div><div><dt>Waiting</dt><dd>Decisions still awaiting answers</dd></div><div><dt>Rework</dt><dd>Late changes from superseded direction</dd></div></dl><p>We would also check whether assumptions held after release. No timing or growth improvement has been measured.</p></article><a class="text-link" href="use-cases.html">Read the detailed workflow example →</a></div>
      </div>
    </section>`,
  trust: `<section class="section ledger-section" id="trust" aria-labelledby="trust-title">
      <div class="ledger-boundary">
        <div class="section-intro"><p class="section-number">Trust behind the next move</p><h2 id="trust-title">People stay accountable.</h2></div>
        <p class="scope-line" id="start">Shared decisions and accepted commitments are the intended foundation. People keep judgment, approval and delivery responsibility.</p>
        <div class="trust-grid concise-boundaries">
          <article><h3>People approve and revise decisions</h3><p>People can revise positioning, pricing, budgets and company standards using judgment and necessary approvals. Required specialist gates remain in place.</p></article>
          <article><h3>Owners accept the work</h3><p>Named owners accept the exact deliverable and date. A decision approval is not delivery acceptance; missing answers remain open.</p></article>
          <article><h3>Agents stay within permissions</h3><p>Agents would use only permitted sources and actions. Reading context grants no approval or action rights. Publishing needs separate authorization.</p></article>
        </div>
        <details class="decision-detail" id="agreement-change">
          <summary>See what changes and what stays agreed</summary>
          <p class="example-label">Fictional Northstar · One shared plan, three versions</p>
          <p>Version 1 planned guided activation and export together. Version 2 records the approved core-only launch and Maya’s, Leo’s and Priya’s accepted changes. Version 3 records the post-launch message test, Leo’s accepted task and the Tue Dec 1 review accepted by Leo and Maya. It does not reopen unchanged work or clear export’s security gate.</p>
          <p>People and permitted agents would consult the current version, with earlier decisions marked as superseded. Changes still need the right approvals and affected owners’ acceptance. Evidence keeps its source and observation window; missing or old notes do not prove a result.</p>
        </details>
        <p class="scope-line">Any pilot needs agreed sources, permissions and data handling. This website does not connect to your workspace.</p>
      </div>
    </section>`
};

// Freeze only the source regions deliberately replaced. Any upstream amendment
// requires review rather than silently discarding it in this isolated preview.
const sourceHashes = {
  roles: '097ba35bc6bc69fc3cb7308c5987bdaaea26a06887fbf3444fad43242f2754af',
  moments: '2afda25495571c317a4809dcd5dccf07d30484ba4266b5ea8ca81071ab63d3ff',
  how: 'f313224c55c27e8cfc09b9affdc96f1cf2fcd6fa9657b840b962acb7190fe2cd',
  trust: 'd467deff31f2f0ea7127e3d77d84ed41e1ab3a80a3ff8ae98ac58d231ef3f38f',
  heroProduct: '3c9167bfc217f564f21ee8e50ab19f74f5228c9d8db4581bfd39c4aa7d2414aa'
};
const replaceOne = (page, from, to) => {
  if (page.split(from).length !== 2) throw Error(`Expected one commercial-story target: ${from}`);
  return page.replace(from, () => to);
};
function replaceRegion(page, pattern, key, replacement) {
  const matches = [...page.matchAll(pattern)];
  if (matches.length !== 1) throw Error(`Expected one commercial-story region: ${key}`);
  const original = matches[0][0];
  if (createHash('sha256').update(original).digest('hex') !== sourceHashes[key]) {
    throw Error(`Commercial-story source changed; review required: ${key}`);
  }
  return replaceOne(page, original, replacement);
}

export function addCommercialStory(page) {
  const headline = '<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>';
  if (page.split(headline).length !== 2) throw Error('Expected the exact cinematic preview headline');
  page = replaceOne(page, headline, '<h1 id="hero-title">Launch fast. Learn <span class="headline-phrase">what lands.</span> Act on that learning.</h1>');
  page = replaceOne(page, '<title>Coordinated: turn product momentum into market growth</title>', '<title>Coordinated: launch, learn and act</title>');
  page = replaceOne(page, '<meta property="og:title" content="Coordinated: turn product momentum into market growth">', '<meta property="og:title" content="Coordinated: launch, learn and act">');
  for (const attribute of ['name="description"', 'property="og:description"']) {
    page = replaceOne(page, `<meta ${attribute} content="We’re building an AI GTM program manager for launches and learning, with approved decisions and versions for people and permitted agents.">`, `<meta ${attribute} content="${commercialDescription}">`);
  }
  page = replaceOne(page, '<p class="hero-promise">We’re building your AI GTM program manager in Slack to coordinate commitments and feedback, so each launch can teach you what drives growth.</p>', `<p class="hero-promise">${commercialHeroSupport}</p>`);
  page = replaceOne(page, '<p class="hero-audience hero-agreement">Conversation history helps recall what was said. We’re building Coordinated to preserve what was agreed and decided.</p>', `<p class="hero-audience hero-agreement">${commercialHeroAgreement}</p>`);
  page = replaceOne(page, '<p class="proof-line">Prelaunch. Software in development.</p>', '<p class="proof-line">Prelaunch. Software in development. Intended workflow, not shipped capability.</p>');
  page = replaceOne(page, 'See the launch-to-learning loop <span', 'Explore the fictional launch <span');
  page = replaceRegion(page, /<div class="hero-product"[\s\S]*?<\/article>\s*<\/div>/g, 'heroProduct', heroProduct);
  for (const [id, replacement] of Object.entries(sections)) {
    page = replaceRegion(page, new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`, 'g'), id, replacement);
  }
  return page;
}
