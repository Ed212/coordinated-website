import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { addNorthstarWalkthrough, walkthroughNavigation } from '../scripts/northstar-walkthrough.mjs';
const original = await readFile(new URL('../index.html',import.meta.url),'utf8');
const css = await readFile(new URL('../northstar-walkthrough.css',import.meta.url),'utf8');
const page = addNorthstarWalkthrough(original);
const text = html => html.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();

test('preserves every original word in original order, adding only known navigation', () => {
  assert.equal(text(page.replace(walkthroughNavigation,'')),text(original));
});
test('four native links each have exactly one focusable destination in reading order', () => {
  const targets = [...walkthroughNavigation.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
  assert.equal(targets.length,4);
  let previous = -1;
  for(const id of targets) {
    assert.equal(page.split(`id="${id}"`).length,2);
    assert.match(page,new RegExp(`id="${id}" tabindex="-1"`));
    const index = page.indexOf(`id="${id}"`);
    assert(index > previous); previous = index;
  }
  assert.match(walkthroughNavigation,/<nav[^>]+aria-label="Fictional Northstar example walkthrough"/);
  assert(!/role="tab|aria-selected|button/.test(walkthroughNavigation));
});
test('all content remains available with no JavaScript; no hiding, timers or handlers are added', () => {
  assert(!/\shidden(?:[\s=>])|<script|onclick|aria-hidden="true"[^>]*>[^0]/.test(walkthroughNavigation));
  assert(!/display\s*:\s*none|visibility\s*:\s*hidden|position\s*:\s*(sticky|fixed)|animation\s*:/.test(css));
  assert.match(walkthroughNavigation,/All four steps are shown below/);
});
test('original links, details, contact and hero are untouched', () => {
  const hrefs = html => [...html.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(hrefs(page.replace(walkthroughNavigation,'')),hrefs(original));
  assert.equal(page.slice(0,page.indexOf('<section class="section ledger-section launch-comparison"')),original.slice(0,original.indexOf('<section class="section ledger-section launch-comparison"')));
  assert.equal(page.slice(page.indexOf('<section class="section narrative-section"')),original.slice(original.indexOf('<section class="section narrative-section"')));
  assert.match(page,/<details class="dependency-map" id="launch-dependencies" open>/);
  assert.match(page,/id="next-decision" tabindex="-1"/);
});
test('style is scoped and supports mobile, visible target focus, and reduced motion', () => {
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/scroll-margin-top:110px/);
  for(const line of css.split('\n').filter(line=>line.includes('{')&&!line.startsWith('@'))) assert(line.trim().startsWith('.galaxy-preview'));
});
test('builder fails closed on missing, duplicated or already transformed targets', () => {
  assert.throws(()=>addNorthstarWalkthrough(''),/section missing/);
  assert.throws(()=>addNorthstarWalkthrough(page),/Expected one Northstar target/);
  assert.throws(()=>addNorthstarWalkthrough(original.replace('<p class="scenario-trigger">','<p class="scenario-trigger"><p class="scenario-trigger">')),/Expected one Northstar target/);
});
