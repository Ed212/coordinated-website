import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spaceFrame,starAt,advanceSpaceTime} from '../solar-journey.js';

test('archived canvas: exact departure join and indefinite bounded, non-zooming camera',()=>{
 assert.deepEqual(spaceFrame(0),{scale:1,x:0,y:0,stars:0});
 for(const t of [1,12,24,48,173,227,3600,86400,1e8]){
  const f=spaceFrame(t),next=spaceFrame(t+.001);
  assert(f.scale>=1&&f.scale<=1.045);
  assert(Math.abs(f.x)<=(f.scale-1)*640+1e-9);
  assert(Math.abs(f.y)<=(f.scale-1)*360+1e-9);
  assert(Math.abs(f.x-next.x)<.001&&Math.abs(f.y-next.y)<.001);
  if(t>=12)assert.equal(f.scale,1.045);
 }
});
test('archived canvas: all star wraps are invisible, smooth and deterministic',()=>{
 for(let i=0;i<100;i++){
  const initial=starAt(i,0),later=starAt(i,1),speed=(initial.x-later.x+1)%1;
  const boundary=initial.x/speed;
  for(const t of [boundary-0.001,boundary,boundary+0.001])assert(starAt(i,t).alpha<1e-8);
  assert.deepEqual(starAt(i,86400),starAt(i,86400));
 }
});
test('archived canvas: paused/resumed clocks do not accumulate background time',()=>{
 assert.equal(advanceSpaceTime(50,100,100000,false),50);
 assert.equal(advanceSpaceTime(50,null,100000,true),50);
 assert.equal(advanceSpaceTime(50,100000,100016,true),50.016);
 assert.equal(advanceSpaceTime(50,100,100000,true),50.1);
});
