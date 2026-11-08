import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await import('./check-references.mjs');
const calc = await readFile('docs/site-v5/calc.js','utf8');
const digest=createHash('sha256').update(calc).digest('hex');
const destination='mailto:ed@coordinatedai.ai?subject=30-minute%20launch%20walkthrough';
const action=theme=>`<a class="button button-${theme}" href="${escape(destination)}" data-pilot-action>Walk through your last launch</a>`;
let template = await readFile('templates/home.html','utf8');
for(const [marker,value] of Object.entries({
 '{{PILOT_LINK}}':action('paper'), '{{PILOT_ACTION}}':action('dark'),
 '{{FOOTER_BOOKING}}':'',
 '{{PILOT_PRICE}}':escape(process.env.PILOT_PRICE?.trim() || 'Ask us for the number')
})) template=template.replaceAll(marker,()=>value);
template=template.replace(/[ \t]+$/gm,'');
for (const [file,headline] of [['index.html','Turn product momentum into market growth.'],['b.html','Turn product momentum into market growth.']]) await writeFile(file,template.replace('{{HEADLINE}}',headline));
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for (const file of ['index.html','b.html','use-cases.html','pilot-evidence.html','privacy.html','terms.html','og.html','fonts.css','styles.css','hero-live.css','site.js']) await cp(file,`dist/${file}`);
await cp('assets/fonts','dist/assets/fonts',{recursive:true});
await mkdir('dist/brand',{recursive:true}); await mkdir('dist/assets/galaxy',{recursive:true});
for(const file of ['mark_dark.svg','mark_light.svg','favicon_64.png']) await cp(`brand/${file}`,`dist/brand/${file}`);
for(const file of ['starfield-2880x1600.webp','starfield-1600.webp','landscape-upscaled-2880x1600.webp','landscape-1600.webp','landscape-1200.webp','og-1200x630.png']) await cp(`assets/galaxy/${file}`,`dist/assets/galaxy/${file}`);
await writeFile('docs/site-v5/logs/calc-sha256.log',`${digest}  docs/site-v5/calc.js\n`);
console.log('calc.js SHA-256:',digest);
await import('./check-copy.mjs');
console.log('Built both headline pages; archived calculator source remains unchanged.');

await import("./build-launch-preview.mjs");
