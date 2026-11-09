import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {measureHeroContrast} from '../scripts/hero-contrast.mjs';

const read=file=>readFile(new URL('../'+file,import.meta.url),'utf8');
test('CI includes every Node suite and its browser verifiers have no retired ambient runtime dependency',async()=>{
 const workflow=await read('.github/workflows/site.yml');
 assert(workflow.includes('node --test tests/*.test.mjs'),'New controller, asset and regression tests run in CI');
 const files=[...workflow.matchAll(/node (scripts\/[\w-]+\.mjs)/g)].map(match=>match[1]);
 for(const name of ['verify-launch-preview','verify-solar-bridge','verify-galaxy-build'])assert(files.includes(`scripts/${name}.mjs`));
 for(const file of files){
  const source=await read(file);
  assert(!/['"]ambient['"]/.test(source),`${file} must not require the old phase`);
  assert(!source.includes('Floating through space'),`${file} must not require the old status`);
  assert(!source.includes('data-journey-time'),`${file} must not inspect the archived canvas clock`);
  assert(!/querySelector\(['"]\.flight-bridge['"]\)/.test(source),`${file} must not read the removed canvas`);
 }
});
test('solar verifier captures native video, waits for Replay/Skip states and preserves visual invariants',async()=>{
 const source=await read('scripts/verify-solar-bridge.mjs');
 for(const required of ["waitForPhase(p,'loop')","waitForPhase(p,'launch')",'Flying through distant space',"canvas.getContext('2d').drawImage(video,0,0)",'copyPanel','sceneShade','videoMasks','glyphEdgeProtection','Pause freezes every video time','stationaryHeadline','fullHero','backgroundOnlyContrast','playback.wraps>=2'])assert(source.includes(required),required);
 assert(!source.includes('waitForTimeout(500)'),'Skip readiness must not use a fixed delay');
 assert(!source.includes('appendChild(canvas)')&&!source.includes('append(canvas)'),'Video capture canvas is detached');
});
test('contrast helper decodes either ordinary artwork or the current exact-frame fallback',async()=>{
 const stop=Error('Stop after image decode');let decoded=false;
 const page={locator(selector){assert.equal(selector,'.hero-galaxy, .flight-fallback img');return{evaluate(fn){return fn({decode(){decoded=true;throw stop;}});}};}};
 await assert.rejects(()=>measureHeroContrast(page),error=>error===stop);assert(decoded);
});
