import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const code = await readFile(new URL('../galaxy-scroll.js',import.meta.url),'utf8');
function harness({mobile=false,reduced=false,saveData=false}={}) {
  const listeners = new Map(), pending = new Map(); let id=0;
  const target = (name, extra={}) => ({dataset:{},style:{removeProperty(key){delete this[key];}},hidden:true,addEventListener(event,fn){listeners.set(`${name}:${event}`,fn);},setAttribute(key,value){this[key]=value;},...extra});
  const body=target('body'),camera=target('camera'),button=target('button'),controls=target('controls'),label=target('label'),meter=target('meter'),still=target('still');
  const pref=target('reduced',{matches:reduced}),compact=target('mobile',{matches:mobile}),connection=target('connection',{saveData});
  const chapters=Array.from({length:5},(_,index)=>target(`chapter${index}`,{dataset:{galaxyChapter:String(index+1).padStart(2,'0'),galaxyLabel:`Chapter ${index+1}`},getBoundingClientRect:()=>({top:1000+index*1000-context.scrollY})}));
  const content=target('content',{querySelectorAll:()=>chapters,getBoundingClientRect:()=>({top:1000-context.scrollY,bottom:6000-context.scrollY})});
  const selectors={'.galaxy-preview':body,'.galaxy-camera':camera,'[data-galaxy-content]':content,'.galaxy-navigation':controls,'[data-galaxy-motion]':button,'.galaxy-location':label,'.galaxy-progress i':meter,'[data-flight-still]':still};
  const document=target('document',{hidden:false,querySelector:s=>selectors[s]});
  const context={document,navigator:{connection},matchMedia:q=>q.includes('reduced')?pref:compact,window:target('window'),scrollY:0,innerHeight:800,requestAnimationFrame:fn=>{pending.set(++id,fn);return id;},cancelAnimationFrame:key=>pending.delete(key),ResizeObserver:class{observe(){}},console};
  vm.runInNewContext(code,context);
  const flush=()=>{for(const [key,fn] of [...pending]){pending.delete(key);fn();}};
  const event=(name)=>{listeners.get(name)?.();flush();};
  const scroll=y=>{context.scrollY=y;event('window:scroll');};
  flush();
  return{context,body,camera,button,controls,label,meter,pref,compact,connection,document,pending,event,scroll,flush,trigger:name=>listeners.get(name)?.()};
}
test('advances one shared image with scroll, clamps endpoints, and reverses',()=>{
 const h=harness();assert.equal(h.controls.hidden,false);h.scroll(3100);const middle=h.camera.style.transform;assert(Math.abs(Number(middle.match(/scale\(([^)]+)\)/)[1])-1.38)<1e-10);h.scroll(9000);assert(Math.abs(Number(h.camera.style.transform.match(/scale\(([^)]+)\)/)[1])-1.7)<1e-10);assert.equal(h.body.dataset.galaxyProgress,'1.0000');h.scroll(3100);assert.equal(h.camera.style.transform,middle);h.scroll(0);assert.equal(h.body.dataset.galaxyProgress,'0.0000');assert.equal(h.pending.size,0);
});
test('manual pause preserves framing while scrolling; resume uses current position',()=>{
 const h=harness();h.scroll(3000);h.event('button:click');const frozen=h.camera.style.transform;h.scroll(5000);assert.equal(h.camera.style.transform,frozen);assert.equal(h.button['aria-pressed'],'true');h.event('button:click');assert.notEqual(h.camera.style.transform,frozen);assert.equal(h.body.dataset.galaxyMotion,'scroll');
});
test('reduced motion and save-data start still without moving the camera',()=>{
 for(const option of[{reduced:true},{saveData:true}]){const h=harness(option);h.scroll(5000);assert.equal(h.camera.style.transform,undefined);assert.equal(h.body.dataset.galaxyMotion,'still');assert.equal(h.button.disabled,true);assert.equal(h.button.textContent,'Still view enabled');}
});
test('changing motion preference removes movement and safely restores scroll mode',()=>{
 const h=harness();h.scroll(3000);h.pref.matches=true;h.event('reduced:change');assert.equal(h.camera.style.transform,undefined);h.pref.matches=false;h.event('reduced:change');assert.match(h.camera.style.transform,/translate3d/);
});
test('mobile traversal is smaller than desktop',()=>{
 const h=harness({mobile:true});h.scroll(6000);assert.match(h.camera.style.transform,/translate3d\(-2%,2%,0\) scale\(1\.34\)/);
});
test('no continuous animation loop, coalesced scroll frames, hidden document does no work',()=>{
 const h=harness();assert.equal(h.pending.size,0);h.trigger('window:scroll');h.trigger('window:scroll');assert.equal(h.pending.size,1);h.flush();h.document.hidden=true;h.scroll(3000);assert.equal(h.pending.size,0);h.document.hidden=false;h.event('document:visibilitychange');assert.equal(h.body.dataset.galaxyProgress,'0.4762');assert.equal(h.pending.size,0);
});
test('hero still choice applies to scroll, and pagehide clears pending frames',()=>{
 const h=harness();h.scroll(3000);h.event('still:click');assert.equal(h.body.dataset.galaxyMotion,'still');h.event('window:pagehide');assert.equal(h.pending.size,0);h.event('window:pageshow');assert.equal(h.body.dataset.galaxyMotion,'still');
});
test('chapter indication follows reading position without live announcements',()=>{
 const h=harness();h.scroll(3700);assert.equal(h.label.textContent,'04 / 05 · Chapter 4');assert.equal(h.label['aria-live'],undefined);
});
