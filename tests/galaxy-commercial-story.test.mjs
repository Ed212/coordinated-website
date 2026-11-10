import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { addNorthstarWalkthrough } from '../scripts/northstar-walkthrough.mjs';
import { readFile } from 'node:fs/promises';
import { addCommercialStory, commercialPositioning, commercialHeroSupport, commercialHeroAgreement, commercialDescription } from '../scripts/galaxy-commercial-story.mjs';

const original = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const sourceHeadline = '<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>';
const solar = original.replace('<h1 id="hero-title">Turn product momentum into market growth.</h1>', sourceHeadline);
const page = addCommercialStory(solar);
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const section = (html, id) => html.match(new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];
const boundaries = JSON.parse(await readFile(new URL('./fixtures/galaxy-content-boundaries.json', import.meta.url), 'utf8'));

test('exact requested headline and goal-led support appear only in the revised preview', () => {
  assert.equal(text(page.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0]), commercialPositioning);
  assert.equal(commercialPositioning, 'Launch fast. Learn what lands. Act on that learning.');
  assert(page.includes(`<p class="hero-promise">${commercialHeroSupport}</p>`));
  assert(page.includes(`<p class="hero-audience hero-agreement">${commercialHeroAgreement}</p>`));
  assert.equal(page.split(commercialDescription).length, 3, 'description and Open Graph agree');
  assert.match(page, /For GTM leads, product leaders and founders at 50 to 300-person software companies\./);
  for (const title of ['Launch fast', 'Learn what lands', 'Act on that learning']) assert(section(page, 'roles').includes(`<h2>${title}</h2>`));
  assert(solar.includes(sourceHeadline));
  assert(!solar.includes(commercialHeroSupport));
});

test('maturity boundaries exclude shipped, connected, calculated ROI and proven-growth claims', () => {
  for (const phrase of [
    'Prelaunch. Software in development. Intended workflow, not shipped capability.',
    'We’re building it to help your team',
    'How we expect it to help. Not yet measured.',
    'Fictional observations, not customer results.',
    'Fictional example of the intended workflow, not a customer result or evidence of growth.',
    'No timing or growth improvement has been measured.',
    'This website does not connect to your workspace.'
  ]) assert(text(page).includes(phrase), phrase);
  assert(!/\b(?:guaranteed|proven growth|proven ROI|calculates? (?:your )?ROI|integrates? with|automatically (?:publishes|launches|approves)|\d+(?:\.\d+)?% (?:growth|lift|increase))\b/i.test(text(page)));
  assert(!/AI GTM program manager/i.test(page));
});

test('one fictional Northstar example starts with goal, people and a complete commercial plan', () => {
  const firstNorthstar = page.indexOf('Northstar');
  assert.equal(page.slice(firstNorthstar - 'Fictional example · '.length, firstNorthstar), 'Fictional example · ');
  const story = text(section(page, 'moments'));
  for (const phrase of [
    'Start with the goal and the people.',
    'Dana wants Northstar’s new teams to reach their first shared report.',
    'She names Product, GTM, Support, Security, Pricing and Finance.',
    'guided activation on Mon Nov 23, first-report positioning, a $49 per team/month offer and a $3,000 campaign budget.',
    'Leo’s page and demo depend on approved scope and claims.',
    'Priya’s support guidance depends on that same version.',
    'Dana makes the go/no-go decision after required approvals and readiness evidence.'
  ]) assert(story.includes(phrase), phrase);
  assert(!/\b(?:Atlas|Lantern)\b/.test(text(page)));
  assert.equal(page.split('Read the detailed workflow example →').length, 3);
});

test('a Security delay creates an explicit human choice, gated scope and separate owner acceptance', () => {
  const story = text(section(page, 'moments'));
  for (const phrase of [
    'Export’s security review is delayed.',
    'Dana can move the whole launch to Mon Nov 30 or launch guided activation on Mon Nov 23 without export, once its own gates pass.',
    'Product and GTM choose the smaller launch.',
    'Pricing and Finance keep the offer and budget unchanged.',
    'Export remains blocked pending Security approval.',
    'Version 2 proposes the smaller launch.',
    'Maya accepts core readiness by Thu Nov 19; Leo accepts the page and demo without export claims by Fri Nov 20; Priya accepts matching support guidance by Fri Nov 20.',
    'Each accepts their own revised deliverable and date.',
    'Dana’s decision alone does not assign their work.',
    'The owners deliver, required core checks pass and Dana gives the go-ahead.'
  ]) assert(story.includes(phrase), phrase);
});

test('launch-day observations and actual spend lead to a human choice and dated next check', () => {
  const story = text(section(page, 'moments'));
  let previous = -1;
  for (const phrase of ['Start with the goal and the people.', 'Human decision', 'Accepted work', 'Launch · Mon Nov 23', 'Read the evidence · Tue Nov 24', 'Choose the next move', 'Check again · Tue Dec 1']) {
    const at = story.indexOf(phrase); assert(at > previous, phrase); previous = at;
  }
  for (const phrase of [
    'Sales notes from five launch-day calls show three prospects mistook the offer for another dashboard.',
    'First-use records show two of six new teams shared a report.',
    'Finance records $1,200 spent.',
    'These small samples leave important questions open.',
    'Dana and GTM choose a clearer first-report message.',
    'Pricing stays at $49; Finance holds extra spend.',
    'Leo accepts revised copy and a demo by Fri Nov 27, with Product and GTM reviewing claims before publication.',
    'Leo and Maya accept the review:',
    'did the revised message run, can prospects explain the value, and are teams sharing a first report?',
    'keeping before/after observations separate.',
    'The next decision waits for that evidence.'
  ]) assert(story.includes(phrase), phrase);
  assert(!/\b(?:lift|improved|increased|validated|caused|ROI)\b/i.test(story));
  for (const [date, weekday] of [['2026-11-19', 4], ['2026-11-20', 5], ['2026-11-23', 1], ['2026-11-24', 2], ['2026-11-27', 5], ['2026-11-30', 1], ['2026-12-01', 2]]) {
    assert.equal(new Date(`${date}T00:00:00Z`).getUTCDay(), weekday, date);
  }
  assert(page.includes('Leo: revised message and demo by Fri Nov 27'));
  assert(page.includes('Tue Dec 1: understanding and first use'));
});

test('shared current versions and accepted commitments preserve human judgment and permission boundaries', () => {
  const how = text(section(page, 'how')), trust = text(section(page, 'trust'));
  assert(how.includes('A general assistant can help draft a plan or recall a conversation.'));
  assert(how.includes('a shared, versioned plan: what people decided, which work each owner accepted and what still needs an answer.'));
  for (const phrase of [
    'People keep judgment, approval and delivery responsibility.',
    'People approve and revise decisions', 'Owners accept the work', 'Agents stay within permissions',
    'Required specialist gates remain in place.',
    'A decision approval is not delivery acceptance',
    'Reading context grants no approval or action rights.',
    'Publishing needs separate authorization.',
    'Version 1 planned guided activation and export together.',
    'Version 2 records the approved core-only launch and Maya’s, Leo’s and Priya’s accepted changes.',
    'Version 3 records the post-launch message test, Leo’s accepted task and the Tue Dec 1 review accepted by Leo and Maya.',
    'It does not reopen unchanged work or clear export’s security gate.',
    'People and permitted agents would consult the current version, with earlier decisions marked as superseded.',
    'Changes still need the right approvals and affected owners’ acceptance.',
    'Evidence keeps its source and observation window'
  ]) assert(trust.includes(phrase), phrase);
  assert(!/approved once|set once|set-and-forget/i.test(text(page)));
});

test('the fictional market signal leads through capability and intent checks, human choice, accepted work and review', () => {
  const how = section(page, 'how');
  const paragraph = how.match(/<h3>Give learning a next step<\/h3><p>([^<]*)<\/p>/)[1];
  const phrases = [
    'In the fictional Northstar example, public agency forum questions shared by the team suggest an opportunity.',
    'Maya checks whether the product could support a sellable offer;',
    'Leo checks buyer need, strategic fit and Northstar’s presence in search and AI answers.',
    'Fit remains uncertain, so Dana and GTM choose interviews before changing positioning, scope or spend.',
    'Leo accepts three buyer interviews by Fri Dec 4;',
    'Maya accepts a capability summary for the Tue Dec 8 review.',
    'They compare dated findings from Tue Dec 1 through Fri Dec 4 before deciding whether to develop an offer, adjust positioning or pass.',
    'The opportunity remains an unproven hypothesis.'
  ];
  let previous = -1;
  for (const phrase of phrases) {
    const at = paragraph.indexOf(phrase); assert(at > previous, phrase); previous = at;
  }
  assert(paragraph.split(/\s+/).length <= 120, 'Keep the opportunity example concise.');
  assert(!/\b(?:monitors?|tracking|integrates?|automatically|proven demand|ROI|growth result)\b/i.test(paragraph));
  for (const [date, weekday] of [['2026-12-01', 2], ['2026-12-04', 5], ['2026-12-08', 2]]) {
    assert.equal(new Date(`${date}T00:00:00Z`).getUTCDay(), weekday, date);
  }
  assert(!/\shidden[\s=>]|<script|onclick/.test(how));
});

test('the market-opportunity addition changes only the existing learning paragraph from reviewed 20d5a4f', () => {
  const priorParagraph = 'After launch, bring customer observations, market evidence and actual spend to a review. People decide the next action; owners accept the work and its next evidence check.';
  const restored = page.replace(/(<h3>Give learning a next step<\/h3><p>)[^<]*(<\/p>)/, `$1${priorParagraph}$2`);
  assert.equal(createHash('sha256').update(restored).digest('hex'), '345445f7bd2af0b797d4658cc2cb957e4beafe3c457ab95e74be48995703d712');
});

test('structure, classes and IDs match the pre-revision preview; only text and text labels change', () => {
  // Baseline is the transformed page at 0ff9597, before this content-only revision.
  // Ignore text nodes and text-only ARIA/metadata labels, not layout attributes.
  const structure = html => html.replace(/>[^<]*</g, '><').replace(/aria-label="[^"]*"/g, 'aria-label="COPY"').replace(/(<meta (?:name="description"|property="og:(?:description|title)") content=")[^"]*/g, '$1COPY').replace(/\s+/g, ' ').trim();
  assert.equal(createHash('sha256').update(structure(page)).digest('hex'), boundaries.structuralMarkupSha256);
  assert.equal(createHash('sha256').update(structure(addNorthstarWalkthrough(page))).digest('hex'), boundaries.walkthroughMarkupSha256);
});

test('design, media, runtime, production templates and supporting pages remain byte-identical', async () => {
  const digest = createHash('sha256');
  for (const file of boundaries.immutableFiles) {
    let bytes = await readFile(new URL(`../${file}`, import.meta.url));
    // Normalize only the exact reviewed build hooks/gate. The original 90-file
    // archival digest still protects every remaining source byte.
    if (file === 'scripts/build.mjs') {
      for (const hook of ['\nawait import("./build-northstar-preview.mjs");\n', '\nawait import("./build-release.mjs");\n// Run again after every derived page and release transformation.\nawait (await import("./check-copy.mjs")).checkBuild();\n']) {
        assert.equal(bytes.toString().split(hook).length, 2);
        bytes = Buffer.from(bytes.toString().replace(hook, ''));
      }
    }
    if (file === 'scripts/build-launch-preview.mjs') {
      const gate = "import {buildMode} from './build-mode.mjs';\nif(buildMode() !== 'legacy'){";
      assert.equal(bytes.toString().split(gate).length, 2);
      bytes = Buffer.from(bytes.toString().replace(gate, "const local=process.env.WIDE_LAUNCH_PREVIEW==='local'&&!process.env.NETLIFY&&!process.env.VERCEL;\nconst hosted=process.env.NETLIFY==='true'&&process.env.CONTEXT==='deploy-preview'&&process.env.HEAD==='codex/solar-bridge-study';\nif(local||hosted){"));
    }
    digest.update(file + '\0').update(bytes).update('\0');
  }
  assert.equal(digest.digest('hex'), boundaries.immutableFilesSha256);
});

test('all link destinations, contact behavior, privacy, media, controls and existing anchor IDs survive', () => {
  const hrefs = html => [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(hrefs(page), hrefs(solar));
  assert.equal(section(page, 'pilot'), section(solar, 'pilot'));
  assert.equal(page.slice(page.indexOf('<footer')), solar.slice(solar.indexOf('<footer')));
  for (const id of [...solar.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])) assert.equal(page.split(`id="${id}"`).length, 2, id);
  const assets = html => [...html.matchAll(/\b(?:src|srcset|data-src)="([^"]+)"/g)].map(match => match[0]);
  assert.deepEqual(assets(page), assets(solar));
  assert.match(page, /href="#launch-dependencies" data-open-detail="launch-dependencies"/);
  assert.match(page, /href="#next-decision" data-focus-target="next-decision"/);
  assert.match(page, /id="next-decision" tabindex="-1"/);
});

test('the whole launch-to-learning story is visible without JavaScript or opening a disclosure', () => {
  const story = section(page, 'moments');
  assert(!/\shidden[\s=>]|<script|onclick|role="tab/.test(story));
  for (const phrase of ['Start with the goal', 'Export’s security review is delayed', 'Maya accepts core readiness', 'Launch · Mon Nov 23', 'Finance records $1,200 spent', 'Leo accepts revised copy', 'Check again · Tue Dec 1']) {
    assert(story.indexOf(phrase) >= 0 && story.indexOf(phrase) < story.indexOf('<details'), phrase);
  }
  assert.match(story, /<details class="dependency-map" id="launch-dependencies">/);
  assert.match(page, /<details class="decision-detail" id="agreement-change">/);
});

test('commercial transform fails closed on changed, missing, repeated or previously transformed source', () => {
  assert.throws(() => addCommercialStory(original), /exact cinematic preview headline/);
  assert.throws(() => addCommercialStory(page), /exact cinematic preview headline/);
  assert.throws(() => addCommercialStory(solar.replace('Who will deliver what, by when?', 'Updated claim')), /source changed; review required: heroProduct/);
  for (const id of ['roles', 'moments', 'how', 'trust']) {
    const region = section(solar, id);
    assert.throws(() => addCommercialStory(solar.replace(region, '')), /Expected one commercial-story region/);
    assert.throws(() => addCommercialStory(solar.replace(region, region + region)), /Expected one commercial-story region/);
    assert.throws(() => addCommercialStory(solar.replace(region, region.replace('</section>', '<p>New upstream fact</p></section>'))), /source changed; review required/);
  }
  assert.throws(() => addCommercialStory(solar.replace('<p class="proof-line">', '<p class="proof-line">Changed. ')), /commercial-story target/);
});

test('speed mechanisms are specific and measurements stay prospective', () => {
  const how = text(section(page, 'how'));
  for (const phrase of [
    'How we expect it to help. Not yet measured.',
    'Bring positioning, pricing, content, budget, owners, dependencies and launch gates into one plan.',
    'When scope changes, show what it affects and ask those owners to accept the revised work.',
    'After launch, bring customer observations, market evidence and actual spend to a review.',
    'Prospective measures', 'A separately agreed pilot would examine:',
    'Time from a ready build to release', 'Decisions still awaiting answers',
    'Late changes from superseded direction',
    'No timing or growth improvement has been measured.'
  ]) assert(how.includes(phrase), phrase);
  assert(!/\b(?:ROI|\d+%|saved \d+|\d+x faster)\b/i.test(how));
});
