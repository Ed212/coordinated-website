import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {emulateSaveData, emulateBlockedAutoplay} from '../scripts/browser-fixtures.mjs';
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

test('serialized Save-Data fixture preserves the connection EventTarget used by both release runtimes', async () => {
 const navigator = {userAgent:'unchanged'};
 vm.runInNewContext(`(${emulateSaveData.toString()})()`, {navigator, EventTarget});
 const connection = navigator.connection;
 assert.equal(connection.saveData, true);
 assert(connection instanceof EventTarget);
 let changes = 0;
 const listener = () => changes++;
 connection.addEventListener('change', listener);
 connection.dispatchEvent(new Event('change'));
 assert.equal(changes, 1, 'The galaxy and flight change-listener APIs remain usable');
 connection.removeEventListener('change', listener);
 connection.dispatchEvent(new Event('change'));
 assert.equal(changes, 1);
 assert.equal(navigator.userAgent, 'unchanged');
 const verifier = await read('scripts/verify-launch-preview.mjs');
 assert(verifier.includes("if(mode==='save-data')await p.addInitScript(emulateSaveData)"));
 assert(!verifier.includes('value:{saveData:true}'), 'Do not replace NetworkInformation with a plain object');
});
test('serialized autoplay fixture rejects only play without replacing the media interface', async () => {
 class Media extends EventTarget { pause() { this.paused = true; } }
 const pause = Media.prototype.pause;
 vm.runInNewContext(`(${emulateBlockedAutoplay.toString()})()`, {HTMLMediaElement:Media, DOMException});
 const media = new Media();
 await assert.rejects(media.play(), error => error instanceof DOMException && error.name === 'NotAllowedError');
 assert.equal(Media.prototype.pause, pause);
 media.pause(); assert.equal(media.paused, true);
 assert.equal(typeof media.addEventListener, 'function');
 assert((await read('scripts/verify-launch-preview.mjs')).includes("if(mode==='autoplay-blocked')await p.addInitScript(emulateBlockedAutoplay)"));
});
