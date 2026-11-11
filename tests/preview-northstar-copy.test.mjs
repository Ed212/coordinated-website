import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdtemp, cp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {releaseHomepage, canonicalPage} from '../scripts/release-page.mjs';
import {releaseLoadingPage} from '../scripts/release-loading.mjs';
import { alignNorthstarCopy } from '../scripts/preview-northstar-copy.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFile(join(root, file), 'utf8');
const originals = { home: await read('index.html'), useCases: await read('use-cases.html') };
const aligned = Object.fromEntries(Object.entries(originals).map(([kind, html]) => [kind, alignNorthstarCopy(html, kind)]));
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const hash = content => createHash('sha256').update(content).digest('hex');
const section = (html, id) => html.match(new RegExp(`<section\\b[^>]* id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))[0];

function assertCurrentStory(html, name) {
  const copy = text(html);
  for (const phrase of ['Northstar', 'Mon Nov 23', 'Thu Nov 19', 'Fri Nov 20', 'Tue Nov 24', 'Fri Nov 27', 'Tue Dec 1', '$49 per team/month', '$3,000', '$1,200', 'Version 1', 'Version 2', 'Version 3']) assert(copy.includes(phrase), `${name}: ${phrase}`);
  assert.match(copy, /(?:Version 1 plan(?:s|ned) guided activation and export together)/, name);
  assert.match(copy, /Version 2(?: records the approved core-only launch|: the approved core-only launch)/, name);
  assert.match(copy, /Version 3(?: records|: an accepted test)/, name);
  assert.match(copy, /Maya accepts core readiness by Thu Nov 19/, name);
  assert.match(copy, /Leo accepts the page and demo without export claims by Fri Nov 20/, name);
  assert.match(copy, /Priya accepts matching support guidance by Fri Nov 20/, name);
  assert.match(copy, /Leo accepts revised copy and a demo by Fri Nov 27/, name);
  assert.match(copy, /Leo and Maya accept the (?:Tue Dec 1 )?review/, name);
  assert.match(copy, /(?:three of five prospects misunderstood|five launch-day calls show three prospects mistook)/i, name);
  assert.match(copy, /two of six (?:new )?teams shared a report/, name);
  assert.match(copy, /(?:price and budget stay unchanged|offer and budget unchanged|budget unchanged)/i, name);
  assert.match(copy, /before\/after observations (?:remain|stay|separate|Separate)|keeping before\/after observations separate/i, name);
  assert.match(copy, /export (?:stays|remains) (?:blocked|held|out)/i, name);
  assert.match(copy, /Dana’s decision alone does not assign their work|Dana’s decision alone does not assign their deliverables/, name);
  assert.match(copy, /prelaunch/i, name);
  assert.match(copy, /fictional/i, name);
  assert.match(copy, /not (?:a customer result|customer results|live software)|not a deployed workflow/, name);
  assert.match(copy, /(?:outcome (?:is|remains) open|open outcome|next decision waits for (?:that )?evidence)/i, name);
  assert.doesNotMatch(copy, /Tue Nov 17|Thu Nov 12|Fri Nov 13|prompt test|Finance’s (?:test-)?budget decision is (?:still )?open/i, name);
  assert.doesNotMatch(copy, /\b(?:proven ROI|proven growth|calculates? (?:your )?ROI|integrates? with|automatically (?:monitors|publishes|launches|approves)|\d+(?:\.\d+)?% (?:growth|lift|increase))\b/i, name);
}

test('draft root and detailed example share the canonical facts, decisions and accepted work', () => {
  for (const [kind, page] of Object.entries(aligned)) assertCurrentStory(page, kind);
  const homeStory = text(section(aligned.home, 'moments'));
  const detailStory = text(aligned.useCases.slice(aligned.useCases.indexOf('<section class="use-case-list')));
  for (const [copy, markers] of [[homeStory, ['Version 1 plans', 'Propose version 2', 'Maya accepts', 'Launch · Mon Nov 23', 'Read the evidence · Tue Nov 24', 'Choose the next move', 'Check again · Tue Dec 1']], [detailStory, ['Version 1 plans', 'Version 2 proposes', 'Maya accepts', 'Version 2: the approved core-only launch', 'Tue Nov 24: review', 'Version 3: an accepted test']]]) {
    let previous = -1;
    for (const marker of markers) { const at = copy.indexOf(marker); assert(at > previous, marker); previous = at; }
  }
  for (const [date, day] of [['2026-11-19',4],['2026-11-20',5],['2026-11-23',1],['2026-11-24',2],['2026-11-27',5],['2026-11-30',1],['2026-12-01',2]]) assert.equal(new Date(`${date}T00:00:00Z`).getUTCDay(), day);
});

test('copy amendments preserve markup, styles, media, disclosures, anchors, links and contact behavior', () => {
  const structure = html => html.replace(/>[^<]*</g, '><').replace(/aria-label="[^"]*"/g, 'aria-label="COPY"').replace(/datetime="[^"]*"/g, 'datetime="COPY"');
  const linksAndAssets = html => [...html.matchAll(/\b(?:href|src|srcset|data-src)="[^"]*"/g)].map(m => m[0]);
  for (const [kind, html] of Object.entries(aligned)) {
    assert.equal(structure(html), structure(originals[kind]), kind);
    assert.deepEqual(linksAndAssets(html), linksAndAssets(originals[kind]), kind);
    assert.equal(html.slice(html.indexOf('<footer')), originals[kind].slice(originals[kind].indexOf('<footer')), kind);
    assert.doesNotMatch(html, /galaxy-scroll|launch-preview|northstar-walkthrough|data-flight-|<video/, kind);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.equal(html.split(`id="${match[1]}"`).length, 2, match[1]);
  }
  assert.equal(section(aligned.home, 'pilot'), section(originals.home, 'pilot'));
  assert(aligned.home.includes('datetime="2026-11-24T09:14">Tue Nov 24, 9:14 AM'));
  assert(aligned.home.includes('<details class="dependency-map" id="launch-dependencies" open>'));
  assert(aligned.home.includes('<details class="decision-detail" id="agreement-change">'));
});

test('copy transformations fail closed on upstream changes and cannot be applied twice', () => {
  for (const [kind, html] of Object.entries(originals)) {
    assert.throws(() => alignNorthstarCopy(html + ' ', kind), /source changed; review required/);
    assert.throws(() => alignNorthstarCopy(aligned[kind], kind), /source changed; review required/);
  }
  assert.throws(() => alignNorthstarCopy(originals.home, 'other'), /Unknown Northstar page/);
});

test('ten real build modes isolate draft changes and keep canonical galaxy/comparison bytes intact', { timeout: 120000 }, async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'coordinated-northstar-'));
  try {
    await cp(root, temporary, { recursive: true, filter: path => !['.git','node_modules','dist','.openai','preview-review'].includes(basename(path)) });
    const environment = { ...process.env };
    for (const key of ['WIDE_LAUNCH_PREVIEW','NETLIFY','VERCEL','CONTEXT','HEAD','COMMIT_REF','COORDINATED_RELEASE','VERCEL_ENV','VERCEL_GIT_COMMIT_REF','VERCEL_GIT_COMMIT_SHA']) delete environment[key];
    const modes = [
      ['ordinary', {}, false],
      ['netlify-production', { WIDE_LAUNCH_PREVIEW: 'local', NETLIFY: 'true', CONTEXT: 'production', HEAD: 'codex/solar-bridge-study' }, false],
      ['wrong-branch', { WIDE_LAUNCH_PREVIEW: 'local', NETLIFY: 'true', CONTEXT: 'deploy-preview', HEAD: 'codex/other' }, false],
      ['vercel', { WIDE_LAUNCH_PREVIEW: 'local', VERCEL: '1' }, false],
      ['local', { WIDE_LAUNCH_PREVIEW: 'local' }, true],
      ['draft-branch', { NETLIFY: 'true', CONTEXT: 'deploy-preview', HEAD: 'codex/solar-bridge-study' }, true, 'review'],
      ['local-release', { COORDINATED_RELEASE: 'local' }, true, 'local'],
      ['vercel-production', { VERCEL:'1', VERCEL_ENV:'production', VERCEL_GIT_COMMIT_REF:'main' }, true, 'production'],
      ['vercel-review', { VERCEL:'1', VERCEL_ENV:'preview', VERCEL_GIT_COMMIT_REF:'codex/solar-bridge-study' }, true, 'review'],
      ['wrong-production-branch', { VERCEL:'1', VERCEL_ENV:'production', VERCEL_GIT_COMMIT_REF:'other' }, false]
    ];
    let ordinary;
    for (const [name, env, preview, release] of modes) {
      execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: temporary, env: { ...environment, ...env }, stdio: 'pipe' });
      const directory = join(temporary, 'dist');
      const files = await readdir(directory, { recursive: true, withFileTypes: true });
      const output = {};
      for (const entry of files.filter(entry => entry.isFile())) {
        const absolute = join(entry.parentPath ?? entry.path, entry.name);
        output[absolute.slice(directory.length + 1)] = hash(await readFile(absolute));
      }
      if (!ordinary) ordinary = output;
      const exempt = release ? ['index.html','b.html','use-cases.html'] : preview ? ['index.html','use-cases.html'] : [];
      for (const [file, digest] of Object.entries(ordinary)) if (!exempt.includes(file)) assert.equal(output[file], digest, `${name}: unchanged ${file}`);
      if (!preview) {
        assert.deepEqual(output, ordinary, `${name}: no draft files or assets`);
        assert.equal(await readFile(join(directory, 'index.html'), 'utf8'), originals.home);
        assert.equal(await readFile(join(directory, 'use-cases.html'), 'utf8'), originals.useCases);
      } else {
        const galaxy = await readFile(join(directory, 'galaxy-study.html'), 'utf8');
        for (const [file, kind] of [['index.html','home'],['use-cases.html','useCases']]) {
          const html = await readFile(join(directory, file), 'utf8');
          const expected = !release ? aligned[kind] : kind === 'home' ? releaseLoadingPage(releaseHomepage(galaxy,{indexable:release!=='review'})) : canonicalPage(aligned[kind],'/use-cases');
          assert.equal(html, expected, `${name}: exact ${file} amendment`);
          assertCurrentStory(html, `${name}/${file}`);
        }
        assertCurrentStory(galaxy, `${name}/galaxy-study`);
        assert.equal(hash(galaxy), '8b002a2f1c9c28085c63c5a39aac7512bf839ab1313fec396ff75e0752694bb8', 'Canonical current galaxy is byte-identical');
        for (const file of ['solar-study.html','launch-preview.html']) assert.equal(output[file], '629c53b1fed5061598af2fb4c1b3b7a1a8d4c07e03b2fcd2683ba6edb463a475', `${name}: comparison unchanged`);
        execFileSync(process.execPath, [release ? 'scripts/verify-release-build.mjs' : 'scripts/verify-galaxy-build.mjs'], { cwd: temporary, env: environment, stdio: 'pipe' });
      }
    }
  } finally { await rm(temporary, { recursive: true, force: true }); }
});
