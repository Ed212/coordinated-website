import { heroFilmAssets } from './hero-film-assets.js';

export function heroFilmControlsMarkup() {
  return `<p class="section-number" id="hero-film-label">Motion preview</p>
    <p id="hero-film-status" role="status" aria-live="polite">Exact brand artwork shown. Choose the launch or go straight to the living galaxy.</p>
    <div class="hero-film-control-row">
      <button type="button" id="hero-film-load" disabled>Play launch</button>
      <button type="button" id="hero-galaxy-play" disabled>Skip to galaxies</button>
      <button type="button" id="hero-film-play" disabled>Pause motion</button>
      <button type="button" id="hero-film-reset" aria-controls="hero-film-stage">Still image</button>
    </div>
    <p class="hero-film-note">Silent, opt-in motion. Launch: ${(heroFilmAssets.launch.bytes/1e6).toFixed(2)} MB; living galaxy: ${(heroFilmAssets.galaxy.bytes/1e6).toFixed(2)} MB. Reduced motion keeps the original still.</p>
    ${heroFilmAssets.launch.note ? `<p class="hero-film-note">${heroFilmAssets.launch.note}</p>` : ''}
    <a class="hero-film-exit" href="/">Return to ordinary preview</a>`;
}

export function initHeroFilmPreview() {
  const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const dedicated=document.documentElement.dataset.heroFilmPreview==='motion'&&['/hero-film','/hero-film.html'].includes(location.pathname);
  const hosted=/^deploy-preview-\d+--mellow-lokum-bcedf5\.netlify\.app$/.test(location.hostname)&&dedicated;
  if(!(local&&(dedicated||new URLSearchParams(location.search).get('heroFilm')==='1'))&&!hosted)return;
  const hero=document.querySelector('[data-hero]');
  const poster=hero?.querySelector('.hero-film-poster,.hero-media');
  if(!hero||!poster||hero.dataset.heroFilmReady)return;
  hero.dataset.heroFilmReady='true';
  document.body.classList.add('hero-film-experiment');
  poster.className='hero-film-poster';poster.removeAttribute('aria-hidden');
  const image=poster.querySelector('img');image.className='hero-film-poster-image';
  image.alt='Illustration: two merging galaxies with a small red point at their shared core.';
  let stage=hero.querySelector('.hero-film-stage');
  if(!stage){stage=document.createElement('figure');stage.className='hero-film-stage';stage.append(poster);}
  stage.id='hero-film-stage';stage.setAttribute('aria-label','Optional launch and living-galaxy motion');
  const makeVideo=(id,className)=>{
    const v=stage.querySelector('#'+id)||document.createElement('video');
    v.id=id;v.className=className;v.muted=true;v.playsInline=true;v.preload='none';v.hidden=true;v.setAttribute('aria-hidden','true');
    if(!v.parentElement)stage.append(v);
    return v;
  };
  const launch=makeVideo('hero-launch-video','hero-film-video hero-launch-video');
  const galaxy=makeVideo('hero-galaxy-video','hero-film-video hero-galaxy-video');
  const controls=hero.querySelector('.hero-film-controls')||document.createElement('aside');
  controls.className='hero-film-controls';controls.setAttribute('aria-labelledby','hero-film-label');
  if(!controls.innerHTML)controls.innerHTML=heroFilmControlsMarkup();
  let panel=hero.querySelector('.hero-film-panel');
  if(!panel){panel=document.createElement('div');panel.className='hero-film-panel';hero.querySelector('.hero-layout').insertBefore(panel,hero.querySelector('.hero-product'));panel.append(stage,controls);}
  const exit=new URL(location.href);exit.searchParams.delete('heroFilm');
  controls.querySelector('.hero-film-exit').href=dedicated?'/':exit.pathname+exit.search+exit.hash;
  const start=controls.querySelector('#hero-film-load'),skip=controls.querySelector('#hero-galaxy-play');
  const pause=controls.querySelector('#hero-film-play'),still=controls.querySelector('#hero-film-reset');
  const status=controls.querySelector('#hero-film-status'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let epoch=0,operation,active=null;
  const beginOperation=()=>{operation?.abort();operation=new AbortController();return++epoch;};
  const current=token=>token===epoch&&!operation.signal.aborted&&!reduced.matches;
  const state=(name,message)=>{
    hero.dataset.motionState=name;status.textContent=message;
    pause.disabled=!['launch','galaxy','paused-launch','paused-galaxy'].includes(name);
    pause.textContent=name.startsWith('paused-')?'Resume motion':'Pause motion';
    start.disabled=skip.disabled=reduced.matches;
  };
  const showStill=(message)=>{
    beginOperation();active=null;
    for(const v of [launch,galaxy]){v.pause();v.hidden=true;v.classList.remove('is-dissolving');v.removeAttribute('src');v.load();}
    poster.hidden=false;
    state('static',message||(reduced.matches?'Reduced motion: the exact static artwork is shown.':'Exact brand artwork shown. Choose the launch or go straight to the living galaxy.'));
  };
  const delay=(ms,signal)=>new Promise((resolve,reject)=>{
    const done=()=>{signal.removeEventListener('abort',abort);resolve();};
    const timer=setTimeout(done,ms);const abort=()=>{clearTimeout(timer);reject(new DOMException('Canceled','AbortError'));};
    signal.addEventListener('abort',abort,{once:true});
  });
  const prepare=(video,asset,signal)=>new Promise((resolve,reject)=>{
    const finish=error=>{clearTimeout(timer);video.removeEventListener('loadeddata',ready);video.removeEventListener('error',failed);signal.removeEventListener('abort',abort);error?reject(error):resolve();};
    const ready=()=>{if(video.readyState>=2)finish();};
    const failed=()=>finish(new Error('Video could not decode'));
    const abort=()=>finish(new DOMException('Canceled','AbortError'));
    const timer=setTimeout(()=>finish(new Error('Video load timed out')),15000);
    video.addEventListener('loadeddata',ready);video.addEventListener('error',failed);signal.addEventListener('abort',abort,{once:true});
    if(video.getAttribute('src')!=='./'+asset.file){video.src='./'+asset.file;video.preload='auto';video.load();}
    ready();
  });
  const fail=(token)=>{if(token===epoch)showStill('Motion could not load. The exact static artwork is shown; you can try again.');};
  async function startGalaxy(handoff=false){
    if(reduced.matches){showStill();return;}
    const token=beginOperation(),signal=operation.signal;
    active=null;launch.pause();galaxy.pause();
    if(!handoff){launch.hidden=true;launch.removeAttribute('src');launch.load();}
    state('loading-galaxy','Loading the living galaxy. Copy and links remain available.');
    try{
      await prepare(galaxy,heroFilmAssets.galaxy,signal);if(!current(token))return;
      galaxy.currentTime=0;galaxy.classList.add('is-dissolving');
      await galaxy.play();if(!current(token))return;
      galaxy.hidden=false;poster.hidden=false;void galaxy.offsetWidth;galaxy.classList.remove('is-dissolving');
      active='galaxy';hero.dataset.galaxyLoops='0';state('galaxy','Living galaxy. Pause motion or choose the still image at any time.');
      if(handoff&&!launch.hidden){launch.classList.add('is-dissolving');await delay(600,signal);if(current(token)){launch.hidden=true;launch.removeAttribute('src');launch.load();}}
    }catch{fail(token);}
  }
  async function startLaunch(){
    if(reduced.matches){showStill();return;}
    const token=beginOperation(),signal=operation.signal;
    active=null;launch.pause();galaxy.pause();galaxy.hidden=true;launch.hidden=true;poster.hidden=false;
    state('loading-launch','Loading the launch. Copy and links remain available.');
    try{
      await prepare(launch,heroFilmAssets.launch,signal);if(!current(token))return;
      launch.currentTime=0;launch.classList.remove('is-dissolving');await launch.play();if(!current(token))return;
      launch.hidden=false;active='launch';state('launch','Playing the launch. Skip straight to the living galaxy at any time.');
    }catch{fail(token);}
  }
  start.addEventListener('click',startLaunch);
  skip.addEventListener('click',()=>startGalaxy(false));
  still.addEventListener('click',()=>showStill());
  pause.addEventListener('click',async()=>{
    if(!active||reduced.matches)return;
    const type=active,video=type==='launch'?launch:galaxy;
    const token=beginOperation();
    if(!hero.dataset.motionState.startsWith('paused-')){video.pause();if(type==='galaxy')launch.hidden=true;state('paused-'+type,'Motion paused. Resume or keep the still image.');return;}
    try{video.classList.remove('is-dissolving');await video.play();if(current(token))state(type,type==='launch'?'Playing the launch.':'Living galaxy.');}catch{fail(token);}
  });
  launch.addEventListener('ended',()=>{if(active==='launch'&&!reduced.matches)startGalaxy(true);});
  galaxy.addEventListener('ended',async()=>{
    if(active!=='galaxy'||hero.dataset.motionState!=='galaxy'||reduced.matches)return;
    const token=epoch,signal=operation.signal;
    try{
      galaxy.classList.add('is-dissolving');await delay(220,signal);if(!current(token))return;
      galaxy.currentTime=0;await galaxy.play();if(!current(token))return;
      galaxy.classList.remove('is-dissolving');hero.dataset.galaxyLoops=String(Number(hero.dataset.galaxyLoops||0)+1);
    }catch{fail(token);}
  });
  for(const [type,v]of[['launch',launch],['galaxy',galaxy]])v.addEventListener('error',()=>{if(active===type&&v.getAttribute('src'))showStill('Motion could not play. The exact static artwork is shown.');});
  reduced.addEventListener('change',()=>{if(reduced.matches)showStill();else state('static','Exact brand artwork shown. Motion stays off until you choose it.');});
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)return;
    if(hero.dataset.motionState?.startsWith('loading-')){showStill();return;}
    if(active){beginOperation();const video=active==='launch'?launch:galaxy;video.pause();if(active==='galaxy')launch.hidden=true;state('paused-'+active,'Motion paused while this tab was hidden.');}
  });
  window.addEventListener('pagehide',()=>{operation?.abort();launch.pause();galaxy.pause();},{once:true});
  hero.dataset.galaxyLoops='0';showStill();
}
