import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {blueGalaxyRelease} from '../scripts/blue-galaxy-release.mjs';
const read=file=>readFile(new URL('../'+file,import.meta.url));
test('approved presentation source bytes remain exact, including the full-width cover correction',async()=>{
 for(const [file,sha] of Object.entries({
  'blue-galaxy-study.css':'3b919dcc45b0b51a569b43816d0e63efc1f02307b611ab431cf2140af52f6d3d',
  'hero-composition.css':'3167995443318be307d5fd63d90764f1cb1d483ef1f5fcec0c1589ea5f9bd858',
  'hero-composition.js':'c5209f3d0d8a189164d10a865835fed9a7bdc2d651c040fce00bedff98a88d4f',
  'assets/galaxy/blue-merger-study.png':'d37a95a3883510f7fdf37d93f88d7c08387ab3f77ffeb1ea5ba01c0f3f91cf96'
 }))assert.equal(createHash('sha256').update(await read(file)).digest('hex'),sha,file);
});
test('approved reveal follows media, preserves an inert reserved slot, permits reading, and resets on Replay',async()=>{
 const script=(await read('hero-composition.js')).toString();
 let mutation,scroll,active=null,focusCalls=0;
 const attrs=new Map(),dataset={};
 const card={dataset,inert:false,contains:el=>el===card,setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),getBoundingClientRect:()=>({top:250,bottom:650})};
 let heroRect={top:84,bottom:724};
 const hero={getBoundingClientRect:()=>heroRect};
 const root={dataset:{flightPhase:'launch'},querySelector:selector=>selector==='.hero-product'?card:selector==='.hero'?hero:{focus:opts=>{assert.equal(opts.preventScroll,true);focusCalls++}}};
 const document={querySelector:()=>root,get activeElement(){return active}};
 vm.runInNewContext(script,{document,innerHeight:757,window:{addEventListener:(event,cb)=>{if(event==='scroll')scroll=cb}},MutationObserver:class{constructor(cb){mutation=cb}observe(){}}});
 assert.equal(card.inert,true);assert.equal(attrs.get('aria-hidden'),'true');
 for(const phase of ['departure','loading-loop']){root.dataset.flightPhase=phase;mutation();assert.equal(card.inert,true)}
 for(const phase of ['loop','still',undefined]){root.dataset.flightPhase=phase;mutation();assert.equal(card.inert,false);assert.equal(attrs.has('aria-hidden'),false)}
 root.dataset.flightPhase='launch';active=card;mutation();assert.equal(focusCalls,1);assert.equal(card.inert,true);
 heroRect={top:-100,bottom:540};scroll();assert.equal(card.inert,false);assert.equal(root.dataset.productDiscovered,'true');
 root.dataset.flightPhase='departure';mutation();assert.equal(card.inert,false);
 root.dataset.flightPhase='loop';mutation();root.dataset.flightPhase='launch';mutation();assert.equal(card.inert,true);
 heroRect={top:-900,bottom:-200};scroll();assert.equal(card.inert,false);
});
test('presentation transformation fails closed for missing or duplicate release markup',()=>{
 assert.throws(()=>blueGalaxyRelease('not a release page'),/Expected unique approved/);
});
