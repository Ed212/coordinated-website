// Presentation follows the actual media controller. No timing guesses and no
// changes to its playback, loading, loop, pause, skip or recovery behavior.
const root=document.querySelector('.hero-composition');
const product=root?.querySelector('.hero-product');
if(root && product){
 const concealed=new Set(['launch','departure','loading-loop']);
 const hero=root.querySelector('.hero');
 let previousPhase=root.dataset.flightPhase;
 const sync=()=>{
  const next=root.dataset.flightPhase;
  // A fresh Replay starts the presentation again. Scroll discovery is otherwise latched.
  if(next==='launch' && previousPhase!==next)delete root.dataset.productDiscovered;
  previousPhase=next;
  const hide=concealed.has(next) && root.dataset.productDiscovered!=='true';
  // Never leave a keyboard user focused inside something about to be hidden.
  if(hide && product.contains(document.activeElement)){
   const control=root.querySelector('[data-flight-pause]:not([hidden])') || root.querySelector('[data-flight-skip]:not([hidden])');
   control?.focus({preventScroll:true});
  }
  product.inert=hide;
  if(hide)product.setAttribute('aria-hidden','true');
  else product.removeAttribute('aria-hidden');
  product.dataset.reveal=hide?'waiting':'ready';
 };
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-flight-phase']});
 const discover=()=>{
  const scene=hero.getBoundingClientRect(), card=product.getBoundingClientRect();
  // Reading takes precedence over the cinematic introduction. This also
  // releases the card if the offscreen media controller has paused the film.
  if(scene.bottom<=0 || (scene.top<0 && card.top<innerHeight && card.bottom>0)){
   root.dataset.productDiscovered='true'; sync();
  }
 };
 window.addEventListener('scroll',discover,{passive:true});
 sync();
}
