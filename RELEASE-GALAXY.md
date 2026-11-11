# Approved galaxy release

## Scope

Promote the exact derived `galaxy-study.html` artifact to `dist/index.html` and its `/b` alias after the linked Northstar copy alignment. Remove the review banner, add production canonical metadata and remove noindex only for the indexable local/production candidate. Hosted review roots remain noindex. Retain prelaunch, fictional-example and permission disclosures. Media content, CSS rules, JavaScript, contact actions, original sources and comparison aliases are unchanged. Release roots additionally apply the narrow loading transform described below.

The live destination is `https://coordinatedai.ai/`, Vercel project `ed-s-projects-7daef98f/coordinated-website-np6n`, production branch `main`. The build gates are in `scripts/build-mode.mjs`; no dashboard settings are changed. `dist/release-manifest.json` identifies local, review or production output and records the host commit when available.

## Verification

CI checks release Lighthouse early, then restores the ordinary build for its browser/performance checks, runs the isolated studies, and rebuilds the exact release for its complete browser/motion checks. The threshold and all existing coverage are retained:

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

`verify-release-build.mjs` requires the exact approved galaxy content except the narrow release metadata and loading transforms, current detailed story, coherent `/b`, alias noindex, correct metadata, local link/anchor integrity, source-identical runtime/styles and all selected-media byte hashes. The existing 90-file archival source digest is retained, normalizing only the exact reviewed build hooks and gate. Ten real build modes check isolation and unchanged galaxy/solar hashes.

The browser checks cover desktop/mobile root and detailed story, reduced motion, no-JavaScript native details/contact, actual Arc launch → departure → native loop playback, repeated loop wraps, pause/replay/skip, failures and exact static fallback. The existing Lighthouse gate remains ≥90 mobile performance and zero CLS on the release index and `/b`; failures require investigation, not silent threshold changes.

## Release handoff

Local implementation does not publish. Review the same-tree hosted candidate root, require checks for the exact candidate commit, then use the authorized existing Vercel/main release path. Verify the live root's title, prelaunch disclosure, release manifest, selected media responses and playback after deployment. A hosted review root is deliberately noindex; Vercel main production must omit noindex. Retain the comparison URLs for later review.

Local checks passed during preparation: 74 Node tests, ten real build modes, ordinary build, isolated-study build/verifier, explicit release build/verifier, copy checks and archived references. Automated browser/Lighthouse execution was not available in the preparation container; the CI jobs and separate managed-browser review must supply that evidence before release. This note is not a claim those checks have already passed.

## Focused mobile loading correction

The exact candidate CI reports from run `42923832720` identify `.flight-fallback img` as LCP: the 454,965-byte final-frame PNG is already eager, high-priority and HTML-discoverable, but its simulated transfer and request delay produce 5.3s LCP and 80/100 mobile performance. No motion, content or layout failure was reported.

For release roots only, `scripts/release-loading.mjs` adds a full-size lossless WebP source (247,256 bytes, 45.7% smaller) ahead of the unchanged PNG fallback, preloads it before competing resources, and replaces six blocking stylesheet requests with their exact bytes concatenated in the same cascade order. No image is cropped, resized, recolored or regenerated. All original image/video files and comparison output hashes remain unchanged.

The delivery manifest locks both file hashes and the complete decoded RGBA hash. `python scripts/encode-release-fallback.py` reproduces and checks the encoding with Pillow/libwebp 1.6.0. Node tests check lossless encoding, full dimensions, unchanged fallback/source, exact style bytes/order, release isolation and fail-closed transforms. The release browser verifier compares all 3,686,400 RGBA bytes against the PNG, checks the recorded pixel hash and exercises the original PNG when WebP is unsupported. Existing motion, reduced-motion, no-JavaScript and failure checks remain required. The original performance script and ≥90/zero-CLS targets are unchanged. The loading correction still needs passing exact-head CI before publication.

### Visibility-based request priority

The first loading candidate improved the real CI scores to 85–87 (LCP 4.0–4.3s, FCP 1.5s, zero CLS), still below the unchanged gate. The audit confirmed the full-size WebP was selected once, with no duplicate PNG, but remained LCP even while the opaque animation covered it.

The next local candidate prioritizes the existing launch poster for normal motion and fetches the covered fallback at low priority. The full-frame high-priority preload is retained for no-JavaScript, reduced-motion, Save-Data and hash entry. A release-only phase observer immediately upgrades the same request for initial or later still states, including video failure; it never reloads the image or controls playback. A scoped visibility rule only hides the fallback in the four phases where the opaque animation already covers it. No source pixels, crop, dimensions, animation timing or motion controller are changed by this loading correction.

Browser checks require one fallback request without a duplicate PNG, a decoded visible fallback in each still mode, and identical paused-motion screenshots with the covered fallback hidden or shown. These checks and actual Lighthouse remain required before publication.
