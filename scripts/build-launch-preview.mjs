import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const local=process.env.WIDE_LAUNCH_PREVIEW==='local'&&!process.env.NETLIFY&&!process.env.VERCEL;
const hosted=process.env.NETLIFY==='true'&&process.env.CONTEXT==='deploy-preview'&&process.env.HEAD==='codex/solar-bridge-study';
if(local||hosted){
 const launch=JSON.parse(await readFile('assets/video/wide-launch.json','utf8'));
 const departure=JSON.parse(await readFile('assets/video/deep-space.json','utf8'));
 for(const asset of[launch,departure]){const bytes=await readFile(asset.file);if(bytes.length!==asset.bytes||createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error('Flight asset mismatch: '+asset.file);}
 let page=await readFile('dist/index.html','utf8');
 const original=page.match(/<div class="hero-media" aria-hidden="true"><picture>[\s\S]*?<\/picture><\/div>/)?.[0];
 if(!original)throw Error('Original galaxy hero missing');
 const picture=original.replace('<div class="hero-media" aria-hidden="true">','').replace(/<\/div>$/,'');
 const scene=`<div class="flight-scene" aria-hidden="true">${picture}<div class="flight-animation" hidden><canvas class="flight-bridge" width="1280" height="720"></canvas><div class="flight-ambient"><img src="${departure.poster}" width="${departure.width}" height="${departure.height}" alt=""><div class="flight-glow"></div></div><video id="departure-video" muted playsinline preload="none" data-src="${departure.file}" data-settle-at="${departure.settleAt}"></video><video id="launch-intro-video" muted playsinline preload="none" poster="assets/video/wide-shuttle-poster.jpg" data-src="${launch.file}"></video></div></div>`;
 const controls=`<div class="flight-controls" aria-label="Hero motion controls" hidden><button type="button" data-flight-replay hidden>Replay journey ↗</button><button type="button" data-flight-skip>Skip journey →</button><button type="button" data-flight-pause>Pause motion</button><button type="button" data-flight-still>Still image</button><span class="flight-status" role="status">Launch</span></div>`;
 page=page.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="launch-preview.css">\n<script src="launch-preview.js" type="module"></script>').replace('class="homepage-clarity"','class="homepage-clarity launch-preview"').replace(original,'').replace('<section class="hero" aria-labelledby="hero-title" data-hero>','<section class="hero" aria-labelledby="hero-title" data-hero>'+scene+controls).replace('<h1 id="hero-title">Turn product momentum into market growth.</h1>','<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>');
 page=page.replace('<section class="hero"', '<aside class="study-banner" aria-label="About this preview">Composited motion study · Not a newly generated film · <a href="solar-study-sources.txt">Imagery and limitations</a></aside><section class="hero"');
 await writeFile('dist/solar-study.html',page);await writeFile('dist/launch-preview.html',page);await cp('assets/video/solar/SOURCES.md','dist/solar-study-sources.txt');await mkdir('dist/assets/video',{recursive:true});
 await cp('assets/video/solar','dist/assets/video/solar',{recursive:true});
 for(const file of[launch.file,departure.file,departure.poster,'assets/video/wide-shuttle-poster.jpg','assets/video/launch-orbit-keyframe.jpg'])await cp(file,'dist/'+file);
 for(const file of['launch-preview.js','launch-preview.css','solar-journey.js'])await cp(file,'dist/'+file);
 await writeFile('dist/launch-preview-manifest.json',JSON.stringify({launch,departure,commit:process.env.COMMIT_REF||null}));
 console.log('Built isolated Earth-to-galaxy preview.');
}
