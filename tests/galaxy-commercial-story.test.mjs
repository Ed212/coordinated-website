import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { addCommercialStory, commercialPositioning, commercialDescription } from '../scripts/galaxy-commercial-story.mjs';

const original = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const headline = '<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>';
const solar = original.replace('<h1 id="hero-title">Turn product momentum into market growth.</h1>', headline);
const page = addCommercialStory(solar);
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const section = (html, id) => html.match(new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

test('approved commercial positioning leads below the exact cinematic headline', () => {
  assert(page.includes(headline));
  assert(page.includes(`<p class="hero-promise">${commercialPositioning}</p>`));
  assert.equal(commercialPositioning, 'Launch fast, learn what lands, and act on that learning.');
  assert.equal(page.split(commercialDescription).length, 3, 'description and Open Graph agree');
  assert.match(page, /For GTM leads, product leaders and founders at 50 to 300-person software companies\./);
  for (const title of ['Launch fast', 'Learn what lands', 'Act on that learning']) assert(section(page, 'roles').includes(`<h2>${title}</h2>`));
  assert(!page.includes('Conversation history helps recall'));
  assert(!page.includes('Form the commitments'));
});

test('maturity boundaries exclude shipped, connected, calculated ROI and proven-growth claims', () => {
  assert.match(page, /Prelaunch\. Software in development\. Intended workflow, not shipped capability\./);
  assert.match(page, /We’re building Coordinated to help teams get decisions answered/);
  assert.match(page, /How we expect it to help\. Not yet measured\./);
  assert.match(page, /Fictional example of the intended workflow, not a customer result or evidence of growth\./);
  assert.match(page, /No timing or growth improvement has been measured\./);
  assert.match(page, /This website does not connect to your workspace\./);
  assert(!/\b(?:guaranteed|proven growth|proven ROI|calculates? (?:your )?ROI|integrates? with|automatically (?:publishes|launches|approves)|\d+(?:\.\d+)?% (?:growth|lift|increase))\b/i.test(text(page)));
  assert(!/AI GTM program manager/i.test(page), 'System-first positioning applies to visible copy and metadata.');
});

test('Northstar is explicitly fictional and incomplete evidence leads to bounded human decisions', () => {
  const firstNorthstar = page.indexOf('Northstar');
  assert.equal(page.slice(firstNorthstar - 'Fictional example · '.length, firstNorthstar), 'Fictional example · ');
  const story = text(section(page, 'moments'));
  for (const phrase of [
    'Northstar’s guided activation is ready to launch.',
    'first shared report', 'guided activation',
    'At the Tue Nov 24 review, campaign clicks look promising',
    'Activation evidence is incomplete.',
    'prospects mistake the first shared report for another dashboard',
    'Product and GTM approve a clearer explanation.',
    'Pricing keeps current terms',
    'Finance holds additional spend; the test must fit the existing campaign budget.',
    'Leo’s acceptance does not change Maya’s or Priya’s work.',
    'This illustration leaves delivery and market results open; it does not assume the test worked.'
  ]) assert(story.includes(phrase), phrase);
  assert(!/lift|improved|increased|validated/.test(story));
  assert(!page.includes('Follow the full Northstar example'));
  assert.equal(page.split('Read the detailed workflow example →').length, 3);
});

test('trust retains separate decision, acceptance, version and permission boundaries', () => {
  const trust = text(section(page, 'trust'));
  for (const phrase of [
    'People approve and revise decisions', 'Owners accept the work', 'Agents stay within permissions',
    'People can revise positioning, pricing, budgets and company standards using judgment and necessary approvals.',
    'Required specialist gates remain in place.',
    'A decision approval is not delivery acceptance',
    'Reading context grants no approval or action rights.',
    'Publishing needs separate authorization.',
    'Version 1 was the launch plan.',
    'Product and GTM approve version 2’s message-test direction, and Leo accepts his work and date.',
    'Version 2 replaces the earlier direction for this test; final wording still needs Product and GTM review before publication.',
    'Pricing, budget and other accepted work stay unchanged.',
    'Later decisions can revise this direction with the necessary approvals and affected owners’ acceptance.',
    'Evidence keeps its source and observation window',
    'missing or old notes do not prove a result.'
  ]) assert(trust.includes(phrase), phrase);
  assert(!/\b(?:approve|accept)\b/.test(text(section(page, 'roles'))), 'benefits lead with the commercial purpose, not machinery');
  assert(!/approved once|set once|set-and-forget/i.test(text(page)));
  assert(!page.includes('Version 2 proposes the positioning test'));
  assert(!page.includes('awaiting owner acceptance'));
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

test('commercial content stays readable without JavaScript or disclosure interaction', () => {
  const story = section(page, 'moments');
  assert(!/\shidden[\s=>]|<script|onclick|role="tab/.test(story));
  for (const phrase of ['campaign clicks look promising', 'Finance holds additional spend', 'Leo then accepts the revised message and demo for Fri Nov 27', 'Check again · Tue Dec 1']) {
    assert(story.indexOf(phrase) >= 0 && story.indexOf(phrase) < story.indexOf('<details'), phrase);
  }
  assert.match(story, /<details class="dependency-map" id="launch-dependencies">/);
  assert.match(page, /<details class="decision-detail" id="agreement-change">/);
});

test('commercial transform fails closed on changed, missing, repeated or previously transformed source', () => {
  assert.throws(() => addCommercialStory(original), /exact cinematic preview headline/);
  assert.throws(() => addCommercialStory(page), /commercial-story target/);
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
    'Launches stall while people wait for answers, redo work from old decisions or miss follow-up.',
    'Coordinated is being designed to help in three ways.',
    'Ask the responsible people about open decisions and launch readiness',
    'current claims and decisions, so drafts do not repeat superseded direction',
    'Ask whether accepted work happened and bring dated evidence to the next review.',
    'Prospective measures', 'A separately agreed pilot would examine:',
    'Time from a ready build to release', 'Decisions still awaiting answers',
    'Late changes from superseded direction',
    'We would also check whether assumptions held after release.',
    'No timing or growth improvement has been measured.'
  ]) assert(how.includes(phrase), phrase);
  assert(!/\b(?:ROI|\d+%|saved \d+|\d+x faster)\b/i.test(how));
});

test('fictional end-to-end example includes accepted scope and a dated evidence check after the decision', () => {
  const story = text(section(page, 'moments'));
  let previous = -1;
  for (const phrase of ['Market evidence raises a question.', 'Human decision', 'Accepted work', 'Check again · Tue Dec 1']) {
    const at = story.indexOf(phrase); assert(at > previous, phrase); previous = at;
  }
  for (const phrase of [
    'The task begins as a proposal. Leo then accepts the revised message and demo for Fri Nov 27, within the current budget.',
    'Product and GTM review the final wording before publication.',
    'Pricing keeps current terms because confusion alone does not justify a price change.',
    'The company’s claim standard rules out promising a faster first report without evidence.',
    'Leo and Maya review dated prospect notes and first-use observations from Mon Nov 23 to Mon Nov 30.',
    'They keep observations before and after the message change separate; this is not a causal comparison.',
    'Was the revised message used? Can prospects explain the value? Do new teams reach their first shared report?',
    'review whether the evidence warrants another message, price or spending change, with the necessary approvals'
  ]) assert(story.includes(phrase), phrase);
  for (const [date, weekday] of [['2026-11-23', 1], ['2026-11-24', 2], ['2026-11-27', 5], ['2026-11-30', 1], ['2026-12-01', 2]]) {
    assert.equal(new Date(`${date}T00:00:00Z`).getUTCDay(), weekday, date);
  }
  assert(page.includes('Leo: revised message and demo by Fri Nov 27'));
  assert(page.includes('Tue Dec 1: understanding and first use'));
});
