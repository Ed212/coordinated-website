import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const booking = process.env.BOOKING_URL?.trim();
if (booking && new URL(booking).protocol !== 'https:') throw Error('BOOKING_URL must use HTTPS');
if (!booking) console.warn('TODO Ed: BOOKING_URL is unset; pilot discussion uses the verified email route.');
await import('./check-references.mjs');
const calc = await readFile('docs/site-v5/calc.js','utf8');
const comparison = await readFile('docs/site-v5/attention-section.html','utf8');
const runtime = await readFile('templates/attention-runtime.js','utf8');
const digest=createHash('sha256').update(calc).digest('hex');
const destination=booking || 'mailto:ed@coordinatedai.ai?subject=Discuss%20a%20six-week%20pilot';
const action=theme=>`<a class="button button-${theme}" href="${escape(destination)}" data-pilot-action>Discuss a six-week pilot</a>`;
let template = await readFile('templates/home.html','utf8');
for(const [marker,value] of Object.entries({
 '{{PILOT_LINK}}':action('paper'), '{{PILOT_ACTION}}':action('dark'),
 '{{FOOTER_BOOKING}}':booking?`<a href="${escape(booking)}">Book 20 minutes</a>`:'',
 '{{PILOT_PRICE}}':escape(process.env.PILOT_PRICE?.trim() || 'Ask us for the number'),
 '{{COMPARISON}}':comparison
})) template=template.replaceAll(marker,()=>value);
template=template.replace(/[ \t]+$/gm,'');
// Insert after all formatting so the source bytes, including whitespace, remain unchanged.
template=template.replace('</body>',()=>`<script id="attention-model">${calc}</script>\n<script>${runtime}</script>\n</body>`);
for (const [file,headline] of [['index.html','Give your team its focus back.'],['b.html','Stop repeating decisions and chasing updates.']]) await writeFile(file,template.replace('{{HEADLINE}}',headline));
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for (const file of ['index.html','b.html','use-cases.html','pilot-evidence.html','privacy.html','terms.html','og.html','fonts.css','styles.css','site.js']) await cp(file,`dist/${file}`);
await cp('assets/fonts','dist/assets/fonts',{recursive:true});
await mkdir('dist/brand',{recursive:true}); await mkdir('dist/assets/galaxy',{recursive:true});
for(const file of ['mark_dark.svg','mark_light.svg','favicon_64.png']) await cp(`brand/${file}`,`dist/brand/${file}`);
for(const file of ['starfield-2880x1600.webp','starfield-1600.webp','landscape-upscaled-2880x1600.webp','landscape-1600.webp','og-1200x630.png']) await cp(`assets/galaxy/${file}`,`dist/assets/galaxy/${file}`);
await writeFile('docs/site-v5/logs/calc-sha256.log',`${digest}  docs/site-v5/calc.js\n`);
console.log('calc.js SHA-256:',digest);
await import('./check-copy.mjs');
console.log('Built both headlines from templates/home.html with the original calculator.');
