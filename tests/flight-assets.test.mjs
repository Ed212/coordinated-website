import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateFlightAssets, movieDuration } from '../scripts/flight-assets.mjs';
const manifest={};
for(const [key,file] of Object.entries({launch:'arc-launch',departure:'deep-space',flight:'distant-flight-loop',fallback:'deep-space-final-frame'}))manifest[key]=JSON.parse(await readFile(`assets/video/${file}.json`,'utf8'));
const cache=new Map();const read=async path=>{if(!cache.has(path))cache.set(path,await readFile(path));return cache.get(path);};
test('selected Arc edit, native loop, original sources, exact fallback and poster pass byte/hash/duration checks',async()=>{
 await validateFlightAssets(manifest,read);
 assert(Math.abs(movieDuration(await read(manifest.launch.file))-241/24)<.002);
 assert(Math.abs(movieDuration(await read(manifest.flight.file))-77/24)<.002);
});
test('asset selection and entry guards reject earlier loop, mutated source, retiming, changed rate and invalid blend',async()=>{
 for(const mutate of [
  m=>m.flight.sourceEntrySeconds=20/24,m=>m.flight.sourceWrapBlendStartSeconds=9,
  m=>m.flight.playbackRate=.75,m=>m.flight.nativeLoop=false,m=>m.launch.duration=9,
  m=>m.flight.duration=2,m=>m.flight.frames=76,m=>m.flight.source.sha256='bad',
  m=>m.launch.sha256='old',m=>m.departure.sha256='changed',m=>m.fallback.source.frameIndex=239,
  m=>m.launch.bytes++,m=>m.flight.bytes++,m=>m.launch.posterIntegrity.sha256='bad'
 ]){
  const m=structuredClone(manifest);mutate(m);await assert.rejects(()=>validateFlightAssets(m,read));
 }
});
test('actual MP4 duration mismatches and malformed boxes fail closed',async()=>{
 const bytes=Buffer.from(await read(manifest.flight.file));const header=bytes.indexOf('mvhd');assert(header>0);bytes.writeUInt32BE(1,header+20);
 assert.notEqual(movieDuration(bytes),manifest.flight.duration);
 assert.throws(()=>movieDuration(Buffer.alloc(12)));
});
