import { createHash } from 'node:crypto';

// Approved commercial-story draft. Apply only to the derived galaxy preview,
// before chapter decoration and native walkthrough links. No runtime behavior.
export const commercialPositioning = 'Launch fast, learn what lands, and act on that learning.';
export const commercialDescription = 'We’re building an AI GTM program manager to help teams launch, learn from market evidence and decide what to do next. Prelaunch software in development.';

const heroProduct = `<div class="hero-product" aria-label="A fictional follow-through example">
          <article class="slack-card hero-card" data-hero-card>
            <p class="example-label">Fictional example · Northstar</p>
            <header class="slack-card-header">
              <img loading="lazy" src="brand/mark_dark.svg" width="32" height="32" alt="">
              <div><strong>Coordinated</strong><span>Illustrative follow-through</span></div>
              <time datetime="2026-11-24T09:14">Tue Nov 24, 9:14 AM</time>
            </header>
            <h2 data-hero-card-title>A clearer message. Then check again.</h2>
            <p>Northstar tests its first-shared-report positioning. Pricing stays steady; extra spend waits for stronger activation evidence.</p>
            <dl class="reached-list">
              <div><dt>Accepted</dt><dd>Leo: revised message and demo by Fri Nov 27</dd></div>
              <div><dt>Standard</dt><dd>Claims must match product evidence</dd></div>
              <div><dt>Next check</dt><dd>Tue Dec 1: understanding and first use</dd></div>
            </dl>
            <nav class="card-actions" aria-label="Explore this illustrative example">
              <a href="#launch-dependencies" data-open-detail="launch-dependencies">See work and gates</a>
              <a href="#next-decision" data-focus-target="next-decision">See the learning review</a>
            </nav>
            <p class="card-reason">Leo’s acceptance covers his task, not other owners’ work.</p>
          </article>
        </div>`;

const sections = {
  roles: `<section class="trust-ribbon" id="roles" aria-label="The intended launch and learning workflow">
      <picture class="ribbon-starfield-picture" aria-hidden="true">
        <source media="(max-width: 1199px)" srcset="assets/galaxy/starfield-1600.webp">
        <img class="ribbon-starfield" src="assets/galaxy/starfield-2880x1600.webp" width="2880" height="1600" loading="lazy" alt="">
      </picture>
      <div class="ledger-boundary trust-ribbon-grid role-benefits">
        <article><h2>Launch fast</h2><p>Get open decisions to the people who can answer, before waiting holds up the launch.</p></article>
        <article><h2>Learn what lands</h2><p>Compare what prospects understand, what campaigns attract and what customers experience.</p></article>
        <article><h2>Act on that learning</h2><p>Give the next change an owner, an agreed delivery date and a defined evidence check.</p></article>
      </div>
    </section>`,
  moments: `<section class="section ledger-section launch-comparison" id="moments" aria-labelledby="moments-title">
      <div class="ledger-boundary">
        <p class="example-label">Fictional program · Northstar</p>
        <h2 id="moments-title">The release is ready. Is the market?</h2>
        <p class="scenario-trigger"><strong>Market evidence raises a question.</strong> Northstar’s guided activation is ready to launch. Dana makes the go/no-go call after the required gates pass. At the Tue Nov 24 review, campaign clicks look promising, but prospects mistake the first shared report for another dashboard. Activation evidence is incomplete.</p>
        <div class="launch-comparison-grid">
          <article class="launch-comparison-panel">
            <p class="section-number">Human decision</p><h3>Test the message before changing price or spend.</h3>
            <p>Product and GTM approve a clearer explanation. Pricing keeps current terms because confusion alone does not justify a price change. Finance holds additional spend; the test must fit the existing campaign budget. The company’s claim standard rules out promising a faster first report without evidence.</p>
          </article>
          <article class="launch-comparison-panel proposed-panel">
            <p class="section-number">Accepted work</p><h3>Leo accepts a specific next step.</h3>
            <p>The task begins as a proposal. Leo then accepts the revised message and demo for Fri Nov 27, within the current budget. Product and GTM review the final wording before publication. Leo’s acceptance does not change Maya’s or Priya’s work.</p>
          </article>
        </div>
        <div class="launch-state" aria-label="Illustrative Northstar learning review">
          <div><span>Check again · Tue Dec 1</span><p>Leo and Maya review dated prospect notes and first-use observations from Mon Nov 23 to Mon Nov 30. They keep observations before and after the message change separate; this is not a causal comparison.</p></div>
          <div><span>Check delivery and understanding</span><p>Was the revised message used? Can prospects explain the value? Do new teams reach their first shared report?</p></div>
          <div><span>Revisit the decision</span><p>Product, GTM, Pricing and Finance review whether the evidence warrants another message, price or spending change, with the necessary approvals.</p></div>
          <div id="next-decision" tabindex="-1"><span>Keep gaps visible</span><p>The review records missing evidence and the next question. This illustration leaves delivery and market results open; it does not assume the test worked.</p></div>
        </div>
        <details class="dependency-map" id="launch-dependencies">
          <summary>See the work, dependencies and launch gates</summary>
          <div class="dependency-map-rows">
            <article><h3>Product and GTM</h3><p>Approve the test and review final claims against product evidence. A later change to the direction or company standard needs the responsible people’s judgment and approvals.</p><span class="dependency-tag">Revisable human decision</span></article>
            <article><h3>Leo, Maya and Priya</h3><p>Leo has accepted only his message and demo task. Any change to Maya’s first-run flow or Priya’s support guidance would need their separate acceptance.</p><span class="dependency-tag">Acceptance is specific</span></article>
            <article><h3>Release, Pricing and Finance</h3><p>Required launch gates still apply. The test stays within current pricing and budget; changes need the appropriate commercial decision.</p><span class="dependency-tag">Authority stays with people</span></article>
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
          <p>Launches stall while people wait for answers, redo work from old decisions or miss follow-up. Coordinated is being designed to help in three ways.</p>
          <ol class="journey-list">
            <li><h3>Get the unanswered decision to its owner</h3><p>Ask the responsible people about open decisions and launch readiness, rather than leave the team waiting for another round of status relaying.</p></li>
            <li><h3>Work from the current agreed version</h3><p>Keep people and permitted agents working from current claims and decisions, so drafts do not repeat superseded direction.</p></li>
            <li><h3>Give learning a next step</h3><p>Ask whether accepted work happened and bring dated evidence to the next review. People decide what changes; owners accept the next work.</p></li>
          </ol>
        </div>
        <div class="narrative-visual"><p class="section-number">How we would test this</p><article class="slack-card launch-outcome-card"><p class="example-label">Prospective measures</p><h3>Measure delays, not just activity.</h3><p>A separately agreed pilot would examine:</p><dl class="reached-list"><div><dt>Built to launch</dt><dd>Time from a ready build to release</dd></div><div><dt>Waiting</dt><dd>Decisions still awaiting answers</dd></div><div><dt>Rework</dt><dd>Late changes from superseded direction</dd></div></dl><p>We would also check whether assumptions held after release. No timing or growth improvement has been measured.</p></article><a class="text-link" href="use-cases.html">Read the detailed workflow example →</a></div>
      </div>
    </section>`,
  trust: `<section class="section ledger-section" id="trust" aria-labelledby="trust-title">
      <div class="ledger-boundary">
        <div class="section-intro"><p class="section-number">Trust behind the next move</p><h2 id="trust-title">People stay accountable.</h2></div>
        <p class="scope-line" id="start">The intended workflow keeps decisions, commitments and versions clear for people and permitted agents.</p>
        <div class="trust-grid concise-boundaries">
          <article><h3>People approve and revise decisions</h3><p>People can revise positioning, pricing, budgets and company standards using judgment and necessary approvals. Required specialist gates remain in place.</p></article>
          <article><h3>Owners accept the work</h3><p>Named owners accept the exact deliverable and date. A decision approval is not delivery acceptance; missing answers remain open.</p></article>
          <article><h3>Agents stay within permissions</h3><p>Agents would use only permitted sources and actions. Reading context grants no approval or action rights. Publishing needs separate authorization.</p></article>
        </div>
        <details class="decision-detail" id="agreement-change">
          <summary>See what changes and what stays agreed</summary>
          <p class="example-label">Fictional Northstar · From version 1 to version 2</p>
          <p>Version 1 was the launch plan. Product and GTM approve version 2’s message-test direction, and Leo accepts his work and date. Version 2 replaces the earlier direction for this test; final wording still needs Product and GTM review before publication. Pricing, budget and other accepted work stay unchanged.</p>
          <p>Later decisions can revise this direction with the necessary approvals and affected owners’ acceptance. Evidence keeps its source and observation window; missing or old notes do not prove a result.</p>
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
  page = replaceOne(page, '<title>Coordinated: turn product momentum into market growth</title>', '<title>Coordinated: launch, learn and act</title>');
  page = replaceOne(page, '<meta property="og:title" content="Coordinated: turn product momentum into market growth">', '<meta property="og:title" content="Coordinated: launch, learn and act">');
  for (const attribute of ['name="description"', 'property="og:description"']) {
    page = replaceOne(page, `<meta ${attribute} content="We’re building an AI GTM program manager for launches and learning, with approved decisions and versions for people and permitted agents.">`, `<meta ${attribute} content="${commercialDescription}">`);
  }
  page = replaceOne(page, '<p class="hero-promise">We’re building your AI GTM program manager in Slack to coordinate commitments and feedback, so each launch can teach you what drives growth.</p>', `<p class="hero-promise">${commercialPositioning}</p>`);
  page = replaceOne(page, '<p class="hero-audience hero-agreement">Conversation history helps recall what was said. We’re building Coordinated to preserve what was agreed and decided.</p>', '<p class="hero-audience hero-agreement">We’re building an AI GTM program manager to help teams get decisions answered, avoid work based on old decisions and follow through on what they learn.</p>');
  page = replaceOne(page, '<p class="proof-line">Prelaunch. Software in development.</p>', '<p class="proof-line">Prelaunch. Software in development. Intended workflow, not shipped capability.</p>');
  page = replaceOne(page, 'See the launch-to-learning loop <span', 'Explore the fictional launch <span');
  page = replaceRegion(page, /<div class="hero-product"[\s\S]*?<\/article>\s*<\/div>/g, 'heroProduct', heroProduct);
  for (const [id, replacement] of Object.entries(sections)) {
    page = replaceRegion(page, new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`, 'g'), id, replacement);
  }
  return page;
}
