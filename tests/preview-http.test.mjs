import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createPreviewServer,byteRange} from '../scripts/preview.mjs';

async function fixture(t){
 const root=await mkdtemp(join(tmpdir(),'flight-range-test-'));
 const bytes=Buffer.from('0123456789abcdefghij');
 await writeFile(join(root,'flight.mp4'),bytes);await writeFile(join(root,'empty.mp4'),'');await writeFile(join(root,'index.html'),'<p>Preview</p>');
 const server=createPreviewServer({root,testMailSink:true});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});});
 const base=`http://127.0.0.1:${server.address().port}`;
 return {base,bytes,request:(range,path='/flight.mp4',options={})=>fetch(base+path,{...options,headers:{...(range?{Range:range}:{}),...options.headers}})};
}
test('preview serves complete GET/HEAD responses with media type, size and byte-range support',async t=>{
 const f=await fixture(t),response=await f.request();
 assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'video/mp4');assert.equal(response.headers.get('content-length'),'20');assert.equal(response.headers.get('accept-ranges'),'bytes');assert.equal(response.headers.get('content-range'),null);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),f.bytes);
 const head=await f.request('bytes=5-9','/flight.mp4',{method:'HEAD'});
 assert.equal(head.status,200);assert.equal(head.headers.get('content-length'),'20');assert.equal(await head.text(),'');
 const page=await f.request(null,'/');assert.equal(page.headers.get('content-type'),'text/html; charset=utf-8');assert.equal(await page.text(),'<p>Preview</p>');
 const alias=await f.request(null,'/index');assert.equal(alias.status,200);assert.equal(await alias.text(),'<p>Preview</p>');
});
test('preview supports closed, open-ended, suffix and clamped single ranges with exact 206 bytes',async t=>{
 const f=await fixture(t);
 for(const [range,start,end] of [['bytes=0-0',0,0],['bytes=5-9',5,9],['bytes=13-',13,19],['bytes=-4',16,19],['bytes=18-100',18,19],['bytes=-100',0,19],['bytes=0-9999999999999999999999999',0,19]]){
  const response=await f.request(range);assert.equal(response.status,206,range);
  assert.equal(response.headers.get('content-type'),'video/mp4');assert.equal(response.headers.get('accept-ranges'),'bytes');
  assert.equal(response.headers.get('content-range'),`bytes ${start}-${end}/20`);assert.equal(response.headers.get('content-length'),String(end-start+1));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),f.bytes.subarray(start,end+1));
 }
});
test('preview returns empty 416 responses for unsatisfiable ranges, including empty files',async t=>{
 const f=await fixture(t);
 for(const range of ['bytes=20-','bytes=99-100','bytes=5-2','bytes=-0','bytes=9999999999999999999999999-']){
  const response=await f.request(range);assert.equal(response.status,416,range);assert.equal(response.headers.get('content-range'),'bytes */20');assert.equal(response.headers.get('content-length'),'0');assert.equal(await response.text(),'');
 }
 const empty=await f.request('bytes=0-','/empty.mp4');assert.equal(empty.status,416);assert.equal(empty.headers.get('content-range'),'bytes */0');assert.equal(await empty.text(),'');
});
test('preview safely ignores malformed/unsupported ranges and unverifiable If-Range',async t=>{
 const f=await fixture(t);
 for(const range of ['items=0-1','bytes=oops','bytes=-','bytes=0-1,3-4']){
  const response=await f.request(range);assert.equal(response.status,200);assert.equal(response.headers.get('content-range'),null);assert.deepEqual(Buffer.from(await response.arrayBuffer()),f.bytes);
 }
 const conditional=await f.request('bytes=0-1','/flight.mp4',{headers:{'If-Range':'"unknown-validator"'}});assert.equal(conditional.status,200);assert.deepEqual(Buffer.from(await conditional.arrayBuffer()),f.bytes);
 assert.deepEqual(byteRange('bytes=0-',0),{unsatisfiable:true});
});
test('preview preserves the contact test sink, origin checks, missing files and root boundary',async t=>{
 const f=await fixture(t);
 const response=await f.request(null,'/api/contact',{method:'POST',headers:{Origin:f.base,'Content-Type':'application/json'},body:JSON.stringify({email:'operator@example.com',document:'A test launch plan.',website:''})});
 assert.equal(response.status,200);assert.equal((await response.json()).message,'The mail service accepted your message; inbox delivery is not confirmed.');
 const denied=await f.request(null,'/api/contact',{method:'POST',headers:{Origin:'https://elsewhere.example','Content-Type':'application/json'},body:'{}'});assert.equal(denied.status,403);
 assert.equal((await f.request(null,'/api/contact')).status,405);
 for(const path of ['/missing','/..%2Fsecret.txt']){const missing=await f.request(null,path);assert.equal(missing.status,404);assert.equal(await missing.text(),'Page not found');}
});
