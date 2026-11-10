import {readFile, writeFile} from 'node:fs/promises';
import {buildMode, isReleaseReview} from './build-mode.mjs';
import {canonicalPage, releaseHomepage} from './release-page.mjs';
if (buildMode() === 'release') {
  // Promote the exact derived galaxy artifact after linked-page consistency.
  // No duplicate template, media selection, CSS or runtime implementation.
  const mode = isReleaseReview() ? 'review' : process.env.COORDINATED_RELEASE === 'local' ? 'local' : 'production';
  const page = releaseHomepage(await readFile('dist/galaxy-study.html', 'utf8'), {indexable: mode !== 'review'});
  for (const file of ['index.html', 'b.html']) await writeFile(`dist/${file}`, page);
  const cases = await readFile('dist/use-cases.html', 'utf8');
  await writeFile('dist/use-cases.html', canonicalPage(cases, '/use-cases'));
  await writeFile('dist/release-manifest.json', JSON.stringify({mode, source: 'galaxy-study.html', canonical: 'https://coordinatedai.ai/', commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_REF || null}, null, 2));
  console.log('Built approved galaxy release at / and /b; comparison aliases remain noindex.');
}
