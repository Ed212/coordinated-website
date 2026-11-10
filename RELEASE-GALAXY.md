# Approved galaxy release

## Scope

Promote the exact derived `galaxy-study.html` artifact to `dist/index.html` and its `/b` alias after the linked Northstar copy alignment. Remove the review banner, add production canonical metadata and remove noindex only for the indexable local/production candidate. Hosted review roots remain noindex. Retain prelaunch, fictional-example and permission disclosures. Media, CSS, JavaScript, contact actions, original sources and comparison aliases are unchanged.

The live destination is `https://coordinatedai.ai/`, Vercel project `ed-s-projects-7daef98f/coordinated-website-np6n`, production branch `main`. The build gates are in `scripts/build-mode.mjs`; no dashboard settings are changed. `dist/release-manifest.json` identifies local, review or production output and records the host commit when available.

## Verification

CI first runs the ordinary-site browser/performance checks and the isolated-study checks. It then builds and tests the actual release root:

```sh
node --test tests/*.test.mjs
COORDINATED_RELEASE=local npm run build
node scripts/verify-release-build.mjs
# Start the local server on a verified unused port with TEST_MAIL_SINK=1.
BASE_URL=http://127.0.0.1:4174 node scripts/verify-release-browser.mjs
BASE_URL=http://127.0.0.1:4174 TEST_PAGE=/ TEST_RELEASE=1 VERIFY_OUTPUT=preview-review/release-motion node scripts/verify-launch-preview.mjs
BASE_URL=http://127.0.0.1:4174 TEST_PAGE=/ VERIFY_OUTPUT=preview-review/release-flight node scripts/verify-solar-bridge.mjs
VERIFY_PREFIX=release- npm run test:performance
```

`verify-release-build.mjs` requires the exact approved galaxy content except the narrow release transform, current detailed story, coherent `/b`, alias noindex, correct metadata, local link/anchor integrity, source-identical runtime/styles and all selected-media byte hashes. The existing 90-file archival source digest is retained, normalizing only the exact reviewed build hooks and gate. Ten real build modes check isolation and unchanged galaxy/solar hashes.

The browser checks cover desktop/mobile root and detailed story, reduced motion, no-JavaScript native details/contact, actual Arc launch → departure → native loop playback, repeated loop wraps, pause/replay/skip, failures and exact static fallback. The existing Lighthouse gate remains ≥90 mobile performance and zero CLS on the release index and `/b`; failures require investigation, not silent threshold changes.

## Release handoff

Local implementation does not publish. Review the same-tree hosted candidate root, require checks for the exact candidate commit, then use the authorized existing Vercel/main release path. Verify the live root's title, prelaunch disclosure, release manifest, selected media responses and playback after deployment. A hosted review root is deliberately noindex; Vercel main production must omit noindex. Retain the comparison URLs for later review.

Local checks passed during preparation: 74 Node tests, ten real build modes, ordinary build, isolated-study build/verifier, explicit release build/verifier, copy checks and archived references. Automated browser/Lighthouse execution was not available in the preparation container; the CI jobs and separate managed-browser review must supply that evidence before release. This note is not a claim those checks have already passed.
