import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { heroFilmControlsMarkup } from '../hero-film-preview.js';
import { heroFilmAssets } from '../hero-film-assets.js';
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await import('./check-references.mjs');
const calc = await readFile('docs/site-v5/calc.js','utf8');
const comparison = await readFile('docs/site-v5/attention-section.html','utf8');
const runtime = await readFile('templates/attention-runtime.js','utf8');
const digest=createHash('sha256').update(calc).digest('hex');
const destination='mailto:ed@coordinatedai.ai?subject=30-minute%20launch%20walkthrough';
const action=theme=>`<a class="button button-${theme}" href="${escape(destination)}" data-pilot-action>Walk through your last launch</a>`;
let template = await readFile('templates/home.html','utf8');
for(const [marker,value] of Object.entries({
 '{{PILOT_LINK}}':action('paper'), '{{PILOT_ACTION}}':action('dark'),
 '{{FOOTER_BOOKING}}':'',
 '{{PILOT_PRICE}}':escape(process.env.PILOT_PRICE?.trim() || 'Ask us for the number'),
 '{{COMPARISON}}':comparison
})) template=template.replaceAll(marker,()=>value);
template=template.replace(/[ \t]+$/gm,'');
// Insert after all formatting so the source bytes, including whitespace, remain unchanged.
template=template.replace('</body>',()=>`<script id="attention-model">${calc}</script>\n<script>${runtime}</script>\n</body>`);
for (const [file,headline] of [['index.html','Let your go-to-market move at the speed of your product.'],['b.html','Let your go-to-market move at the speed of your product.']]) await writeFile(file,template.replace('{{HEADLINE}}',headline.replace('go-to-market','<span class="headline-phrase">go-to-market</span>')));
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for (const file of ['index.html','b.html','use-cases.html','pilot-evidence.html','privacy.html','terms.html','og.html','fonts.css','styles.css','site.js','hero-film-preview.js','hero-film-assets.js']) await cp(file,`dist/${file}`);
await cp('assets/fonts','dist/assets/fonts',{recursive:true});
await mkdir('dist/brand',{recursive:true}); await mkdir('dist/assets/galaxy',{recursive:true});
for(const file of ['mark_dark.svg','mark_light.svg','favicon_64.png']) await cp(`brand/${file}`,`dist/brand/${file}`);
for(const file of ['starfield-2880x1600.webp','starfield-1600.webp','landscape-upscaled-2880x1600.webp','landscape-1600.webp','landscape-1200.webp','og-1200x630.png']) await cp(`assets/galaxy/${file}`,`dist/assets/galaxy/${file}`);
// Only this isolated Deploy Preview (or an explicit local QA build) includes the film.
const localFilmBuild=process.env.HERO_FILM_PREVIEW==='local'&&!process.env.NETLIFY&&!process.env.VERCEL;
const hostedFilmBuild=process.env.NETLIFY==='true'&&process.env.CONTEXT==='deploy-preview'&&process.env.HEAD==='codex/hero-film-preview';
if(localFilmBuild||hostedFilmBuild) {
 await mkdir('dist/assets/video',{recursive:true});
 const manifest={};
 for(const [key,asset]of Object.entries(heroFilmAssets)) {
  const bytes=await readFile(asset.file),sha256=createHash('sha256').update(bytes).digest('hex');
  if(bytes.length!==asset.bytes||sha256!==asset.sha256)throw Error(`Unexpected ${key} video bytes`);
  await writeFile('dist/'+asset.file,bytes);manifest[key]={...asset,sha256};
 }
 let page=(await readFile('index.html','utf8')).replace('<html lang="en">','<html lang="en" data-hero-film-preview="motion">').replace('<head>','<head>\n  <meta name="robots" content="noindex,nofollow">');
 const media=page.match(/<div class="hero-media" aria-hidden="true"><picture>[\s\S]*?<\/picture><\/div>/)?.[0];
 if(!media)throw Error('Hero picture missing from preview source');
 const poster=media.replace('class="hero-media" aria-hidden="true"','class="hero-film-poster"').replace('class="hero-galaxy"','class="hero-film-poster-image"').replace('alt=""','alt="Illustration: two merging galaxies with a small red point at their shared core."');
 const stage=`<figure class="hero-film-stage" id="hero-film-stage" aria-label="Optional launch and living-galaxy motion">${poster}<video id="hero-launch-video" class="hero-film-video hero-launch-video" muted playsinline preload="none" hidden aria-hidden="true"></video><video id="hero-galaxy-video" class="hero-film-video hero-galaxy-video" muted playsinline preload="none" hidden aria-hidden="true"></video></figure>`;
 const controls=`<aside class="hero-film-controls" aria-labelledby="hero-film-label">${heroFilmControlsMarkup()}<noscript><p>Static preview shown. Enable JavaScript to test the video.</p></noscript></aside>`;
 const panel=`<div class="hero-film-panel">${stage}${controls}</div>`;
 page=page.replace(media,'').replace(/(<body\b[^>]*\bclass=")/,match=>match+'hero-film-experiment ').replace('<div class="hero-product"',panel+'<div class="hero-product"');
 await writeFile('dist/hero-film.html',page);
 await writeFile('dist/hero-film-manifest.json',JSON.stringify({take:'living-galaxy',assets:manifest,commit:process.env.COMMIT_REF||null})+'\n');
}
await writeFile('docs/site-v5/logs/calc-sha256.log',`${digest}  docs/site-v5/calc.js\n`);
console.log('calc.js SHA-256:',digest);
await import('./check-copy.mjs');
console.log('Built both headlines from templates/home.html with the original calculator.');
