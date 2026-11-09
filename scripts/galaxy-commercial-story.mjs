import { createHash } from 'node:crypto';

// Approved commercial-story draft. Apply only to the derived galaxy preview,
// before chapter decoration and native walkthrough links. No runtime behavior.
export const commercialPositioning = 'Launch fast, learn what lands, and act on that learning.';
export const commercialDescription = 'We’re building an AI GTM program manager to help teams launch, learn from market evidence and decide what to do next. Prelaunch software in development.';

const heroProduct = `<div class="hero-product" aria-label="A fictional example awaiting owner acceptance">
          <article class="slack-card hero-card" data-hero-card>
            <p class="example-label">Fictional example · Northstar</p>
            <header class="slack-card-header">
              <img loading="lazy" src="brand/mark_dark.svg" width="32" height="32" alt="">
              <div><strong>Coordinated</strong><span>Illustrative review</span></div>
              <time datetime="2026-11-09T09:14">Mon Nov 9, 9:14 AM</time>
            </header>
            <h2 data-hero-card-title>What should change after launch?</h2>
            <p>Prospects misunderstand the value of Northstar’s first shared report. Clicks look promising, but activation evidence is incomplete.</p>
            <dl class="reached-list">
              <div><dt>Test</dt><dd>Clearer positioning</dd></div>
              <div><dt>Keep</dt><dd>Current pricing</dd></div>
              <div><dt>Hold</dt><dd>Additional spend until there is better evidence</dd></div>
            </dl>
            <nav class="card-actions" aria-label="Explore this illustrative example">
              <a href="#launch-dependencies" data-open-detail="launch-dependencies">See work and gates</a>
              <a href="#next-decision" data-focus-target="next-decision">See the learning review</a>
            </nav>
            <p class="card-reason">Fictional review, not a result. People approve decisions; owners must accept the changed work and dates.</p>
          </article>
        </div>`;

const sections = {
  roles: `<section class="trust-ribbon" id="roles" aria-label="The intended launch and learning workflow">
      <picture class="ribbon-starfield-picture" aria-hidden="true">
        <source media="(max-width: 1199px)" srcset="assets/galaxy/starfield-1600.webp">
        <img class="ribbon-starfield" src="assets/galaxy/starfield-2880x1600.webp" width="2880" height="1600" loading="lazy" alt="">
      </picture>
      <div class="ledger-boundary trust-ribbon-grid role-benefits">
        <article><h2>Launch fast</h2><p>Bring the product, message and launch readiness into one plan your team can act on.</p></article>
        <article><h2>Learn what lands</h2><p>Compare what prospects understand, what campaigns attract and what customers experience.</p></article>
        <article><h2>Act on that learning</h2><p>Decide what to change in positioning, pricing or budget, and what needs more evidence first.</p></article>
      </div>
    </section>`,
  moments: `<section class="section ledger-section launch-comparison" id="moments" aria-labelledby="moments-title">
      <div class="ledger-boundary">
        <p class="example-label">Fictional program · Northstar</p>
        <h2 id="moments-title">The release is ready. Is the market?</h2>
        <p class="scenario-trigger"><strong>A useful product needs a clear reason to try it.</strong> In this fictional example, Northstar’s guided activation helps teams reach their first shared report. The release is ready, but prospects mistake its value for another dashboard. Product and GTM want to test a clearer explanation.</p>
        <div class="launch-comparison-grid">
          <article class="launch-comparison-panel">
            <p class="section-number">Launch with a clear question</p><h3>Will people understand the value?</h3>
            <p>The team launches the approved guided-activation experience with its current message and pricing. Dana makes the go/no-go call after the required gates pass. Named owners bring customer conversations, campaign observations and first-use evidence to the review.</p>
          </article>
          <article class="launch-comparison-panel proposed-panel">
            <p class="section-number">Learn from the response</p><h3>Promising clicks are only part of the picture.</h3>
            <p>Campaign clicks look promising in the fictional review, but prospect conversations still suggest they misunderstand the value. Activation evidence is incomplete. The team cannot yet tell whether interest becomes a useful first experience.</p>
          </article>
        </div>
        <div class="launch-state" aria-label="Illustrative Northstar learning review">
          <div><span>Test clearer positioning</span><p>Product and GTM approve the direction: explain the value of the first shared report more clearly.</p></div>
          <div><span>Keep pricing steady</span><p>Pricing keeps current terms while the team tests whether the message is understood.</p></div>
          <div><span>Hold additional spend</span><p>Finance holds extra spending until the team has better evidence about activation.</p></div>
          <div id="next-decision" tabindex="-1"><span>Next work to confirm</span><p>Leo’s message and demo, Maya’s first-run explanation and Priya’s support guidance are proposed changes. Each owner must accept the exact work and dates before those commitments change.</p></div>
        </div>
        <details class="dependency-map" id="launch-dependencies">
          <summary>See the work, dependencies and launch gates</summary>
          <div class="dependency-map-rows">
            <article><h3>Product and GTM</h3><p>Approve the positioning test against the intended product experience. A clearer message must still reflect approved product behavior.</p><span class="dependency-tag">Human decision</span></article>
            <article><h3>Leo, Maya and Priya</h3><p>Accept the changed deliverables and dates separately. Approval of the direction does not establish delivery acceptance.</p><span class="dependency-tag">Acceptance still required</span></article>
            <article><h3>Release, Pricing and Finance</h3><p>Keep their respective authority over launch gates, commercial terms and spending. A release-ready build does not approve claims, prices or extra spending.</p><span class="dependency-tag">Required approvals stay in place</span></article>
          </div>
        </details>
        <p class="scenario-disclosure">This is a fictional illustration of the intended workflow, not deployed software, verified campaign results or evidence of growth. No lift has been demonstrated.</p>
        <a class="text-link text-link-dark" href="use-cases.html">Read the detailed workflow example →</a>
      </div>
    </section>`,
  how: `<section class="section narrative-section" id="how" aria-labelledby="how-title">
      <div class="ledger-boundary narrative-layout">
        <div class="narrative-copy">
          <div class="section-intro"><p class="section-number">From evidence to action</p><h2 id="how-title">Make the next commercial call with context.</h2></div>
          <p>The workflow we’re designing connects launch readiness and market evidence to the decisions your team needs to make.</p>
          <ol class="journey-list">
            <li><h3>Positioning: what do prospects understand?</h3><p>Compare the intended value with what people hear in sales conversations and customer feedback. Decide what message to test next.</p></li>
            <li><h3>Pricing: what would justify a change?</h3><p>Separate confusion about the product from evidence about willingness to pay. Keep the decision with the people responsible for commercial terms.</p></li>
            <li><h3>Budget: what deserves more investment?</h3><p>Review campaign interest alongside product experience and missing evidence. People decide where to spend, where to hold and what to learn first.</p></li>
          </ol>
        </div>
        <div class="narrative-visual"><p class="section-number">The intended role for Coordinated</p><article class="slack-card launch-outcome-card"><p class="example-label">Software in development</p><h3>Help the team turn learning into its next move.</h3><p>Coordinated is being built to bring the relevant evidence and open questions to people, prepare options and coordinate the work they approve.</p><dl class="reached-list"><div><dt>People bring</dt><dd>Market observations, context and judgment</dd></div><div><dt>People decide</dt><dd>What to test, what to keep and what to hold</dd></div><div><dt>Owners accept</dt><dd>The next work and dates</dd></div></dl><p>This describes design intent, not an available end-to-end product, connected integrations or an ROI calculation.</p></article><a class="text-link" href="use-cases.html">Read the detailed workflow example →</a></div>
      </div>
    </section>`,
  trust: `<section class="section ledger-section" id="trust" aria-labelledby="trust-title">
      <div class="ledger-boundary">
        <div class="section-intro"><p class="section-number">Trust behind the next move</p><h2 id="trust-title">People stay accountable.</h2></div>
        <p class="scope-line" id="start">The intended workflow keeps decisions, commitments and versions clear for people and permitted agents.</p>
        <div class="trust-grid concise-boundaries">
          <article><h3>People approve decisions</h3><p>The responsible people approve positioning, pricing, budget and launch readiness. Required specialist gates remain in place.</p></article>
          <article><h3>Owners accept the work</h3><p>Named owners accept the exact deliverable and date. A decision approval is not delivery acceptance; missing answers remain open.</p></article>
          <article><h3>Agents stay within permissions</h3><p>Agents would use only permitted sources and actions. Reading context grants no approval or action rights. Publishing needs separate authorization.</p></article>
        </div>
        <details class="decision-detail" id="agreement-change">
          <summary>See what changes and what stays agreed</summary>
          <p class="example-label">Fictional Northstar · Version 1 and proposed version 2</p>
          <p>Version 1 is the approved launch plan. Version 2 proposes the positioning test. Product and GTM approve its direction; Leo, Maya and Priya still need to accept the changed work and dates. Current pricing and spend remain in force.</p>
          <p>When an approved amendment takes effect, only the affected decision is labeled superseded. Unchanged terms and gates still apply. Evidence keeps its source and observation window; missing or old notes do not prove a result.</p>
        </details>
        <p class="scope-line">Agent consultation is part of the design. Any pilot needs agreed sources, permissions and data handling. This website does not connect to your workspace.</p>
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
  page = replaceOne(page, '<p class="hero-audience hero-agreement">Conversation history helps recall what was said. We’re building Coordinated to preserve what was agreed and decided.</p>', '<p class="hero-audience hero-agreement">We’re building an AI GTM program manager to help your team decide what to launch, what to learn and what to do next.</p>');
  page = replaceOne(page, '<p class="proof-line">Prelaunch. Software in development.</p>', '<p class="proof-line">Prelaunch. Software in development. The workflow below is intended, not shipped.</p>');
  page = replaceOne(page, 'See the launch-to-learning loop <span', 'Explore the fictional launch <span');
  page = replaceRegion(page, /<div class="hero-product"[\s\S]*?<\/article>\s*<\/div>/g, 'heroProduct', heroProduct);
  for (const [id, replacement] of Object.entries(sections)) {
    page = replaceRegion(page, new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`, 'g'), id, replacement);
  }
  return page;
}
