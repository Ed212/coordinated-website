import {readFile, writeFile, cp} from 'node:fs/promises';
import {buildMode, isReleaseReview} from './build-mode.mjs';
import {canonicalPage, releaseHomepage} from './release-page.mjs';
import {blueGalaxyRelease, blueGalaxyStyles, blueGalaxyAsset} from './blue-galaxy-release.mjs';
import {fallbackDelivery, releaseLoadingPage, releaseStyleBundle, releaseStylesheet, verifyFallbackDelivery} from './release-loading.mjs';
if (buildMode() === 'release') {
  // Promote the exact derived galaxy artifact after linked-page consistency.
  // Delivery-only additions preserve source pixels, CSS rules and runtime.
  const mode = isReleaseReview() ? 'review' : process.env.COORDINATED_RELEASE === 'local' ? 'local' : 'production';
  await verifyFallbackDelivery();
  await cp(fallbackDelivery.file, 'dist/' + fallbackDelivery.file);
  await writeFile('dist/' + releaseStylesheet, await releaseStyleBundle());
  for (const file of [...blueGalaxyStyles, blueGalaxyAsset, 'hero-composition.js']) await cp(file, 'dist/' + file);
  const page = blueGalaxyRelease(releaseLoadingPage(releaseHomepage(await readFile('dist/galaxy-study.html', 'utf8'), {indexable: mode !== 'review'})));
  for (const file of ['index.html', 'b.html']) await writeFile(`dist/${file}`, page);
  const cases = await readFile('dist/use-cases.html', 'utf8');
  await writeFile('dist/use-cases.html', canonicalPage(cases, '/use-cases'));
  await writeFile('dist/release-manifest.json', JSON.stringify({mode, source: 'galaxy-study.html', presentation: 'blue-galaxy-hero', approvedPresentationCommit: '03275e42fed674249237b046cc01532ed9a5cec6', canonical: 'https://coordinatedai.ai/', commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_REF || null}, null, 2));
  console.log('Built approved galaxy release at / and /b; comparison aliases remain noindex.');
}
