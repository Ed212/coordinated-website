import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Check the actual MP4 movie duration without requiring ffprobe on a hosting build.
export function movieDuration(bytes) {
 function find(start, end) {
  for (let at = start; at + 8 <= end;) {
   const size = bytes.readUInt32BE(at), kind = bytes.toString('ascii', at + 4, at + 8);
   assert(size >= 8 && at + size <= end, 'Invalid MP4 box');
   if (kind === 'moov') return find(at + 8, at + size);
   if (kind === 'mvhd') {
    const body = at + 8, version = bytes[body], offset = version === 1 ? 20 : 12;
    assert(version === 0 || version === 1, 'Unknown MP4 movie header');
    const scale = bytes.readUInt32BE(body + offset);
    const duration = version === 1 ? Number(bytes.readBigUInt64BE(body + offset + 4)) : bytes.readUInt32BE(body + offset + 4);
    assert(scale > 0, 'Invalid MP4 timescale'); return duration / scale;
   }
   at += size;
  }
  throw Error('MP4 movie duration is missing');
 }
 return find(0, bytes.length);
}
export async function validateFlightAssets({ launch, departure, flight, fallback }, read = readFile) {
 const originalLaunch = '3479c5f3ed9f38856bc1a7ae8987c4359814fa1507b52a6bfafc815cd59242c8';
 const originalDeparture = 'bf0efe9efbc6515434385559c87dbe6877411620e0ae693b238224d5a1935be3';
 const selectedLaunch = 'a513a9c72b7c0cdafa6869e731e826ef1e6da7803f94c3414027e303195a2bdb';
 const selectedLoop = '99b635d4da196ad8a4e5f85dad4d4be06d83ed3e67b2f9152a21ea26d0287c06';
 assert.equal(launch.sha256, selectedLaunch, 'Only the verified Arc launch is selected');
 assert.equal(launch.source.sha256, originalLaunch);
 assert.equal(departure.sha256, originalDeparture, 'The deployed departure stays unchanged');
 assert.equal(flight.sha256, selectedLoop, 'Only the verified late-flight loop is selected');
 assert.equal(flight.source.file, departure.file); assert.equal(flight.source.sha256, departure.sha256);
 assert.equal(fallback.source.file, departure.file); assert.equal(fallback.source.sha256, departure.sha256);
 assert.equal(fallback.sha256, 'a650aa31ccc5c07130714404aec4d69beec56f1aa275274c9ae4e3fb096338ee');
 assert.equal(fallback.source.frameIndex, 240); assert.equal(fallback.source.framesPerSecond, 24);
 for (const asset of [launch, flight]) {
  assert.equal(asset.fps, 24); assert.equal(asset.hasAudio, false);
  assert(Math.abs(asset.duration - asset.frames / asset.fps) < .00001, 'Frame count and duration must agree');
 }
 assert.equal(launch.frames, 241); assert.equal(flight.frames, 77);
 assert.equal(launch.duration, departure.duration, 'The appearance edit cannot retime launch');
 assert.equal(flight.nativeLoop, true); assert.equal(flight.playbackRate, 1);
 assert(Math.abs(flight.sourceEntrySeconds - 164 / 24) < 1e-9, 'Enter only the selected late source frame');
 assert(Math.abs(flight.sourceWrapBlendStartSeconds - 221 / 24) < 1e-9, 'Match only unblended footage');
 assert(Math.abs(flight.wrapBlendDuration - 20 / 24) < 1e-9);
 assert.equal(flight.sourceSegmentStartSeconds, 6);
 assert(Math.abs(flight.duration - (flight.sourceWrapBlendStartSeconds - flight.sourceEntrySeconds + flight.wrapBlendDuration)) < .00001);
 assert(flight.sourceWrapBlendStartSeconds + flight.wrapBlendDuration <= departure.duration + .00001);
 async function integrity(asset) {
  assert(/^assets\/video\/[a-z0-9.-]+$/.test(asset.file), 'Only local selected video assets are permitted');
  const bytes = await read(asset.file);
  if (asset.bytes !== undefined) assert.equal(bytes.length, asset.bytes, `Size mismatch: ${asset.file}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `Hash mismatch: ${asset.file}`);
  if (asset.duration !== undefined) assert(Math.abs(movieDuration(bytes) - asset.duration) < .002, `MP4 duration mismatch: ${asset.file}`);
 }
 for (const asset of [launch, departure, flight, fallback, launch.source, { file: launch.poster, ...launch.posterIntegrity }]) await integrity(asset);
}
