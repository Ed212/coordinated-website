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
  assert.match(page, /Prelaunch\. Software in development\. The workflow below is intended, not shipped\./);
  assert.match(page, /We’re building an AI GTM program manager/);
  assert.match(page, /This describes design intent, not an available end-to-end product, connected integrations or an ROI calculation\./);
  assert.match(page, /This is a fictional illustration of the intended workflow, not deployed software, verified campaign results or evidence of growth\. No lift has been demonstrated\./);
  assert.match(page, /This website does not connect to your workspace\./);
  assert(!/\b(?:guaranteed|proven growth|proven ROI|calculates? (?:your )?ROI|integrates? with|automatically (?:publishes|launches|approves)|\d+(?:\.\d+)?% (?:growth|lift|increase))\b/i.test(text(page)));
  assert(!page.includes('your AI GTM program manager in Slack'));
});

test('Northstar is explicitly fictional and incomplete evidence leads to bounded human decisions', () => {
  const firstNorthstar = page.indexOf('Northstar');
  assert.equal(page.slice(firstNorthstar - 'Fictional example · '.length, firstNorthstar), 'Fictional example · ');
  const story = text(section(page, 'moments'));
  for (const phrase of [
    'The release is ready, but prospects mistake its value for another dashboard.',
    'first shared report', 'guided activation',
    'Campaign clicks look promising in the fictional review',
    'Activation evidence is incomplete.',
    'The team cannot yet tell whether interest becomes a useful first experience.',
    'Product and GTM approve the direction',
    'Pricing keeps current terms',
    'Finance holds extra spending until the team has better evidence about activation.',
    'Each owner must accept the exact work and dates before those commitments change.'
  ]) assert(story.includes(phrase), phrase);
  assert(!/lift|improved|increased|validated/.test(story.replace('No lift has been demonstrated.', '')));
  assert(!page.includes('Follow the full Northstar example'));
  assert.equal(page.split('Read the detailed workflow example →').length, 3);
});

test('trust retains separate decision, acceptance, version and permission boundaries', () => {
  const trust = text(section(page, 'trust'));
  for (const phrase of [
    'People approve decisions', 'Owners accept the work', 'Agents stay within permissions',
    'positioning, pricing, budget and launch readiness',
    'Required specialist gates remain in place.',
    'A decision approval is not delivery acceptance',
    'Reading context grants no approval or action rights.',
    'Publishing needs separate authorization.',
    'Version 1 is the approved launch plan. Version 2 proposes the positioning test.',
    'Current pricing and spend remain in force.',
    'only the affected decision is labeled superseded',
    'Evidence keeps its source and observation window',
    'missing or old notes do not prove a result.'
  ]) assert(trust.includes(phrase), phrase);
  assert(!/\b(?:approve|accept)\b/.test(text(section(page, 'roles'))), 'benefits lead with the commercial purpose, not machinery');
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
  assert(story.indexOf('Campaign clicks look promising') < story.indexOf('<details'));
  assert(story.indexOf('Finance holds extra spending') < story.indexOf('<details'));
  assert(story.indexOf('Each owner must accept') < story.indexOf('<details'));
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
