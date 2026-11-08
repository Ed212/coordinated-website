import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const local=process.env.WIDE_LAUNCH_PREVIEW==='local'&&!process.env.NETLIFY&&!process.env.VERCEL;
const hosted=process.env.NETLIFY==='true'&&process.env.CONTEXT==='deploy-preview'&&process.env.HEAD==='codex/wide-shuttle-preview';
if(local||hosted) {
 const manifest=JSON.parse(await readFile('assets/video/wide-launch.json','utf8'));
 const bytes=await readFile(manifest.file);
 if(createHash('sha256').update(bytes).digest('hex')!==manifest.sha256||bytes.length!==manifest.bytes)throw Error('Launch source hash mismatch');
 let page=await readFile('dist/index.html','utf8');
 const markup=`<section class="launch-intro" aria-label="Launch opening film" hidden>
 <video id="launch-intro-video" muted playsinline preload="none" poster="assets/video/wide-shuttle-poster.jpg" data-src="${manifest.file}" aria-hidden="true"></video>
 <div class="launch-intro-copy"><p class="launch-kicker">Coordinated · a launch is only the beginning</p>
 <h2>Let your <span>go-to-market</span> move at the speed of your launch.</h2>
 <p class="launch-bridge">Align the people. Move the work. Learn what comes next.</p>
 <div class="launch-actions"><a class="button button-paper" href="mailto:ed@coordinatedai.ai?subject=30-minute%20launch%20walkthrough">Walk through your last launch</a><a href="#moments">Explore the idea <span aria-hidden="true">↓</span></a></div><p class="launch-note">Generated launch film · interaction preview</p>
 <div class="launch-controls"><button type="button" data-launch-skip>Skip to galaxies <span aria-hidden="true">→</span></button><button type="button" data-launch-pause>Pause</button><span class="launch-status" role="status">10-second launch</span></div></div>
 </section><button class="launch-replay" type="button" hidden>Replay launch ↗</button>`;
 page=page.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="launch-preview.css">\n<script src="launch-preview.js" defer></script>').replace('class="homepage-clarity"','class="homepage-clarity launch-preview"').replace('<section class="hero" aria-labelledby="hero-title" data-hero>','<section class="hero" aria-labelledby="hero-title" data-hero>'+markup);
 await writeFile('dist/launch-preview.html',page);
 await mkdir('dist/assets/video',{recursive:true});
 await cp(manifest.file,'dist/'+manifest.file);
 await cp('assets/video/wide-shuttle-poster.jpg','dist/assets/video/wide-shuttle-poster.jpg');
 await cp('launch-preview.js','dist/launch-preview.js');await cp('launch-preview.css','dist/launch-preview.css');
 await writeFile('dist/launch-preview-manifest.json',JSON.stringify({...manifest,commit:process.env.COMMIT_REF||null}));
 console.log('Built isolated wide-shuttle preview only.');
}
