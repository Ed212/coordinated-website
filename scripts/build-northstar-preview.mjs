import { readFile, writeFile, access } from 'node:fs/promises';
import { alignNorthstarCopy } from './preview-northstar-copy.mjs';

// build.mjs clears dist first. The galaxy page exists only after the existing
// isolated local/correct-branch draft gate succeeds. Transform linked pages
// last, so neither comparison study nor the canonical galaxy copy is changed.
let enabled = false;
try { await access('dist/galaxy-study.html'); enabled = true; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (enabled) {
  for (const [file, kind] of [['index.html', 'home'], ['use-cases.html', 'useCases']]) {
    await writeFile(`dist/${file}`, alignNorthstarCopy(await readFile(`dist/${file}`, 'utf8'), kind));
  }
  const { checkBuild } = await import('./check-copy.mjs');
  await checkBuild();
  console.log('Aligned draft root and detailed Northstar example with the current galaxy story.');
}
