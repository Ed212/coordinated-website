import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const local=process.env.WIDE_LAUNCH_PREVIEW==='local'&&!process.env.NETLIFY&&!process.env.VERCEL;
const hosted=process.env.NETLIFY==='true'&&process.env.CONTEXT==='deploy-preview'&&process.env.HEAD==='codex/wide-shuttle-preview';
if(local||hosted) {
 const manifest=JSON.parse(await readFile('assets/video/wide-launch.json','utf8'));
 const bytes=await readFile(manifest.file);
 if(createHash('sha256').update(bytes).digest('hex')!==manifest.sha256||bytes.length!==manifest.bytes)throw Error('Launch source hash mismatch');
 const galaxy={file:'assets/video/galaxy-living-photo.mp4',bytes:3031532,sha256:'588c3572cc957743052af91149f6bfd44020bcd51cab002d4b18559cf658af2c',width:1920,height:1080,duration:10.041667};
 const galaxyBytes=await readFile(galaxy.file);
 if(galaxyBytes.length!==galaxy.bytes||createHash('sha256').update(galaxyBytes).digest('hex')!==galaxy.sha256)throw Error('Living galaxy source mismatch');
 let page=await readFile('dist/index.html','utf8');
 const markup=`<section class="launch-intro" aria-label="Launch opening film" hidden>
 <div class="launch-backdrop" aria-hidden="true"></div><video id="launch-intro-video" muted playsinline preload="none" poster="assets/video/wide-shuttle-poster.jpg" data-src="${manifest.file}" aria-hidden="true"></video>
 <div class="launch-intro-copy"><p class="launch-kicker">Coordinated · a launch is only the beginning</p>
 <h2 aria-label="Make your go-to-market move at the speed of your launch.">Make your <span>go-to-market</span> move at the speed of your <span class="launch-word" aria-hidden="true"><span class="word-launch">launch.</span><span class="word-product">product.</span></span></h2>
 <p class="launch-bridge">Align the people. Move the work. Learn what comes next.</p>
 <div class="launch-actions"><a class="button button-paper" href="mailto:ed@coordinatedai.ai?subject=30-minute%20launch%20walkthrough">Walk through your last launch</a><a href="#moments">Explore the idea <span aria-hidden="true">↓</span></a></div><p class="launch-note">Generated launch film · interaction preview</p>
 <div class="launch-controls"><button type="button" data-launch-skip>Skip to galaxies <span aria-hidden="true">→</span></button><button type="button" data-launch-pause>Pause</button><button type="button" data-motion-still>Still image</button><span class="launch-status" role="status">10-second launch</span></div></div>
 </section><div class="hero-motion-controls" aria-label="Hero motion controls" hidden><button class="launch-replay" type="button">Replay launch ↗</button><button type="button" data-galaxy-pause>Pause galaxy</button><button type="button" data-motion-still>Still image</button></div>`;
 page=page.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="launch-preview.css">\n<script src="launch-preview.js" defer></script>').replace('class="homepage-clarity"','class="homepage-clarity launch-preview"').replace('<section class="hero" aria-labelledby="hero-title" data-hero>','<section class="hero" aria-labelledby="hero-title" data-hero>'+markup);
 page=page.replace('<h1 id="hero-title">Turn product momentum into market growth.</h1>','<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>');
 page=page.replace('</picture></div>',`</picture><div class="hero-galaxy-motion" hidden aria-hidden="true"><video muted playsinline preload="none" data-src="${galaxy.file}"></video><video muted playsinline preload="none" data-src="${galaxy.file}"></video></div></div>`);
 await writeFile('dist/launch-preview.html',page);
 await mkdir('dist/assets/video',{recursive:true});
 await cp(manifest.file,'dist/'+manifest.file);
 await cp(galaxy.file,'dist/'+galaxy.file);
 await cp('assets/video/wide-shuttle-poster.jpg','dist/assets/video/wide-shuttle-poster.jpg');
 await cp('launch-preview.js','dist/launch-preview.js');await cp('launch-preview.css','dist/launch-preview.css');
 await writeFile('dist/launch-preview-manifest.json',JSON.stringify({...manifest,galaxy,commit:process.env.COMMIT_REF||null}));
 console.log('Built isolated wide-shuttle preview only.');
}
