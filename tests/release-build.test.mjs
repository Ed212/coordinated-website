import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildMode} from '../scripts/build-mode.mjs';
import {releaseHomepage} from '../scripts/release-page.mjs';
const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');

test('release gate allows only explicit unhosted verification, named review branch, or Vercel main production', () => {
  for (const env of [{}, {WIDE_LAUNCH_PREVIEW:'yes'}, {VERCEL:'1',VERCEL_ENV:'production',VERCEL_GIT_COMMIT_REF:'other'}, {VERCEL:'1',VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'main'}, {NETLIFY:'true',CONTEXT:'production',HEAD:'main'}, {NETLIFY:'true',CONTEXT:'deploy-preview',HEAD:'other'}, {WIDE_LAUNCH_PREVIEW:'local',VERCEL:'1'}]) assert.equal(buildMode(env), 'legacy', JSON.stringify(env));
  assert.equal(buildMode({WIDE_LAUNCH_PREVIEW:'local'}), 'study');
  for (const env of [{COORDINATED_RELEASE:'local'}, {VERCEL:'1',VERCEL_ENV:'production',VERCEL_GIT_COMMIT_REF:'main'}, {VERCEL:'1',VERCEL_ENV:'preview',VERCEL_GIT_COMMIT_REF:'codex/solar-bridge-study'}, {NETLIFY:'true',CONTEXT:'deploy-preview',HEAD:'codex/solar-bridge-study'}]) assert.equal(buildMode(env), 'release', JSON.stringify(env));
  for (const env of [{COORDINATED_RELEASE:'yes'}, {COORDINATED_RELEASE:'local',VERCEL:'1'}, {COORDINATED_RELEASE:'local',NETLIFY:'true'}]) assert.throws(() => buildMode(env));
});
test('release promotion removes only study metadata/banner and adds production canonical metadata', () => {
  const head = '<head><meta name="robots" content="noindex,nofollow"><meta property="og:url" content="https://coordinatedai.ai/"></head>';
  const banner = '<aside class="study-banner" aria-label="About this preview">Review only</aside>';
  const body = '<body>Prelaunch. Software in development.<video loop></video><p>Fictional example · Northstar</p></body>';
  const released = releaseHomepage(head + banner + body);
  assert.equal(released.slice(released.indexOf('<body>')), body);
  assert(!released.includes('noindex') && !released.includes('study-banner'));
  const review = releaseHomepage(head + banner + body, {indexable:false});
  assert(review.includes('noindex,nofollow') && !review.includes('study-banner'), 'Hosted candidate remains noindex without adding a review strip to the approved design');
  assert(released.includes('<link rel="canonical" href="https://coordinatedai.ai/">'));
  assert.throws(() => releaseHomepage(head + body), /banner/);
  assert.throws(() => releaseHomepage(head + banner + body.replace('Prelaunch. Software in development.', '')), /maturity/);
});
test('CI verifies release root artifacts and actual root flight rather than only aliases', async () => {
  const ci = await read('.github/workflows/site.yml');
  for (const required of ['COORDINATED_RELEASE=local npm run build', 'node scripts/verify-release-build.mjs', 'node scripts/verify-release-browser.mjs', 'TEST_PAGE=/ TEST_RELEASE=1', 'TEST_PAGE=/ VERIFY_OUTPUT=preview-review/release-flight']) assert(ci.includes(required), required);
  for (const script of ['verify-launch-preview.mjs', 'verify-solar-bridge.mjs']) assert((await read(`scripts/${script}`)).includes('process.env.TEST_PAGE'), script);
});

test('release browser motion controls exclude the body motion-state attribute', async () => {
  const verifier = await read('scripts/verify-release-browser.mjs');
  const selectors = [...verifier.matchAll(/\.locator\(['"]([^'"]*\[data-galaxy-motion\][^'"]*)['"]\)/g)].map(match => match[1]);
  assert.equal(selectors.length, 2, 'Both scroll and text checks target the motion control');
  assert.deepEqual(selectors, ['button[data-galaxy-motion]', 'button[data-galaxy-motion]'], 'The runtime also sets body[data-galaxy-motion], so an attribute-only locator is ambiguous');
});
