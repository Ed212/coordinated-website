import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const booking = process.env.BOOKING_URL?.trim();
if (booking && new URL(booking).protocol !== 'https:') throw Error('BOOKING_URL must use HTTPS');
if (!booking) console.warn('TODO Ed: BOOKING_URL is unset; booking action omitted.');
let comparison = '';
const comparisonPath = 'docs/site-v5/attention-section.html';
if (existsSync(comparisonPath) && existsSync('docs/site-v5/calc.js')) {
  const calc = await readFile('docs/site-v5/calc.js','utf8');
  comparison = await readFile(comparisonPath,'utf8') + '\n<script id="attention-model">' + calc + '</script>';
  console.log('calc.js SHA-256:',createHash('sha256').update(calc).digest('hex'));
} else console.warn('BLOCKED: original comparison template and calc.js missing. Comparison omitted; do not publish.');
let template = await readFile('templates/home.html','utf8');
template = template.replace('{{BOOKING_LINK}}', booking ? `<a class="text-link" href="${escape(booking)}">Book 20 minutes</a>` : '')
 .replace('{{PILOT_PRICE}}',escape(process.env.PILOT_PRICE?.trim() || 'Ask us for the number'))
 .replace('{{COMPARISON}}',comparison).replace(/[ \t]+$/gm,'');
for (const [file,headline] of [['index.html','Give your team its focus back.'],['b.html','Stop repeating decisions and chasing updates.']]) {
 await writeFile(file,template.replace('{{HEADLINE}}',headline));
}
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for (const file of ['index.html','b.html','use-cases.html','pilot-evidence.html','privacy.html','terms.html','og.html','styles.css','site.js']) await cp(file,`dist/${file}`);
await mkdir('dist/brand',{recursive:true}); await mkdir('dist/assets/galaxy',{recursive:true});
for(const file of ['mark_dark.svg','mark_light.svg','favicon_64.png']) await cp(`brand/${file}`,`dist/brand/${file}`);
for(const file of ['starfield-2880x1600.webp','starfield-1600.webp','landscape-upscaled-2880x1600.webp','landscape-1600.webp','og-1200x630.png']) await cp(`assets/galaxy/${file}`,`dist/assets/galaxy/${file}`);
await import('./check-copy.mjs');
console.log('Built both headlines from templates/home.html.');
