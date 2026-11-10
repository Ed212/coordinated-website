import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {validateFlightAssets} from './flight-assets.mjs';
import {buildMode} from './build-mode.mjs';
if(buildMode() !== 'legacy'){
 const launch=JSON.parse(await readFile('assets/video/arc-launch.json','utf8'));
 const departure=JSON.parse(await readFile('assets/video/deep-space.json','utf8'));
 const flight=JSON.parse(await readFile('assets/video/distant-flight-loop.json','utf8'));
 const fallback=JSON.parse(await readFile('assets/video/deep-space-final-frame.json','utf8'));
 await validateFlightAssets({launch,departure,flight,fallback});
 let page=await readFile('dist/index.html','utf8');
 const original=page.match(/<div class="hero-media" aria-hidden="true"><picture>[\s\S]*?<\/picture><\/div>/)?.[0];
 if(!original)throw Error('Original galaxy hero missing');
 const picture=`<picture class="flight-fallback"><img src="${fallback.file}" width="${fallback.width}" height="${fallback.height}" alt="" fetchpriority="high" decoding="async"></picture>`;
 const heroPreload=/<link rel="preload" as="image" href="assets\/galaxy\/[^"]+"[^>]*>/g;
 if([...page.matchAll(heroPreload)].length!==3)throw Error('Expected original hero image preloads');
 let preloaded=false;
 page=page.replace(heroPreload,()=>{if(preloaded)return '';preloaded=true;return `<link rel="preload" as="image" href="${fallback.file}" fetchpriority="high">`;});
 const scene=`<div class="flight-scene" aria-hidden="true">${picture}<div class="flight-animation" hidden><video id="distant-flight-video" muted playsinline loop preload="none" data-src="${flight.file}" data-source-entry="${flight.sourceEntrySeconds}" data-source-match-until="${flight.sourceWrapBlendStartSeconds}" data-fps="${flight.fps}"></video><video id="departure-video" muted playsinline preload="none" data-src="${departure.file}"></video><video id="launch-intro-video" muted playsinline preload="none" poster="${launch.poster}" data-src="${launch.file}"></video></div></div>`;
 const controls=`<div class="flight-controls" aria-label="Hero motion controls" hidden><button type="button" data-flight-replay hidden>Replay journey ↗</button><button type="button" data-flight-skip>Skip journey →</button><button type="button" data-flight-pause>Pause motion</button><span class="flight-status" role="status">Launch</span></div>`;
 page=page.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">\n<link rel="stylesheet" href="launch-preview.css">\n<script src="launch-preview.js" type="module"></script>').replace('class="homepage-clarity"','class="homepage-clarity launch-preview"').replace(original,'').replace('<section class="hero" aria-labelledby="hero-title" data-hero>','<section class="hero" aria-labelledby="hero-title" data-hero>'+scene+controls).replace('<h1 id="hero-title">Turn product momentum into market growth.</h1>','<h1 id="hero-title">Make your <span class="headline-phrase">go-to-market</span> move at the speed of your product.</h1>');
 page=page.replace('<section class="hero"', '<aside class="study-banner" aria-label="About this preview">Composited motion study · AI-edited rocket · <a href="solar-study-sources.txt">Imagery and limitations</a></aside><section class="hero"');
 await writeFile('dist/solar-study.html',page);await writeFile('dist/launch-preview.html',page);await cp('assets/video/solar/SOURCES.md','dist/solar-study-sources.txt');await mkdir('dist/assets/video',{recursive:true});
 for(const file of[launch.file,departure.file,flight.file,launch.poster,fallback.file])await cp(file,'dist/'+file);
 for(const file of['launch-preview.js','launch-preview.css'])await cp(file,'dist/'+file);
 await writeFile('dist/launch-preview-manifest.json',JSON.stringify({launch,departure,flight,fallback,commit:process.env.COMMIT_REF||null}));
 console.log('Built isolated Arc launch and native late-flight loop preview.');
}
