import { readFile, writeFile, cp } from 'node:fs/promises';

// This derived study exists only when the isolated solar preview was built.
// Production index, b, templates, and the original solar study stay unchanged.
let page;
try { page = await readFile('dist/solar-study.html', 'utf8'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (page) {
  const backdrop = `<div class="galaxy-backdrop" aria-hidden="true">
    <picture class="galaxy-camera"><source media="(max-width: 760px)" srcset="assets/galaxy/landscape-1200.webp"><img src="assets/galaxy/landscape-1600.webp" width="1600" height="889" alt="" loading="lazy" decoding="async"></picture>
    <div class="galaxy-vignette"></div>
  </div>`;
  const navigator = `<div class="galaxy-navigation" aria-label="Galaxy journey controls" hidden>
    <span class="galaxy-location" aria-hidden="true">01 / 05 · Arrival</span>
    <span class="galaxy-progress" aria-hidden="true"><i></i></span>
    <button type="button" data-galaxy-motion aria-pressed="false">Pause scroll motion</button>
  </div>`;
  page = page.replace('</head>', '<link rel="stylesheet" href="galaxy-scroll.css">\n<script src="galaxy-scroll.js" type="module"></script>\n</head>')
    .replace('homepage-clarity launch-preview', 'homepage-clarity launch-preview galaxy-preview')
    .replace('<a class="skip-link"', backdrop + '\n<a class="skip-link"')
    .replace('Composited motion study · Not a newly generated film ·', 'Galaxy scroll study · Preview only ·')
    .replace('<section class="trust-ribbon"', `<div class="galaxy-content" data-galaxy-content>${navigator}<section class="trust-ribbon"`)
    .replace('  </main>', '    </div>\n  </main>');
  for (const [id, number, label] of [
    ['roles', '01', 'Arrival'], ['moments', '02', 'Into the spiral'],
    ['how', '03', 'Along the current'], ['trust', '04', 'A shared direction'],
    ['pilot', '05', 'Next horizon']
  ]) {
    page = page.replace(`id="${id}"`, `id="${id}" data-galaxy-chapter="${number}" data-galaxy-label="${label}"`);
    const section = new RegExp(`(<section[^>]*id="${id}"[^>]*>)([\\s\\S]*?)(<div class="ledger-boundary[^>]*>)`);
    page = page.replace(section, `$1$2$3\n<p class="galaxy-chapter-label" aria-hidden="true"><span>${number} / 05</span> ${label}</p>`);
  }
  await writeFile('dist/galaxy-study.html', page);
  for (const file of ['galaxy-scroll.css', 'galaxy-scroll.js']) await cp(file, `dist/${file}`);
  console.log('Built separate scroll-through-galaxy study.');
}
