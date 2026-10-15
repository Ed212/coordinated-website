import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../api/contact.js';
const valid={email:'operator@example.com',document:'Launch plan: staging Thu Oct 15.',website:''};
async function request({body=valid,method='POST',headers={origin:'http://localhost:4174',host:'localhost:4174'},env={},sendMail}={}){
 let status,result;const response={setHeader(){},status(code){status=code;return this},json(value){result=value;return this}};
 await createHandler({env,sendMail})({body,method,headers},response);return {status,result};
}
test('success follows delivery, uses fixed recipient and reply-to',async()=>{
 let sent;const result=await request({env:{CONTACT_ADDRESS:'ed@coordinatedai.ai',SMTP_FROM:'site@example.com'},sendMail:async message=>{sent=message}});
 assert.equal(result.status,200);assert.equal(result.result.message,'We read it and reply.');assert.equal(sent.to,'ed@coordinatedai.ai');assert.equal(sent.replyTo,valid.email);assert.match(sent.text,/Launch plan/);
});
test('delivery failure never confirms receipt',async()=>{assert.equal((await request({sendMail:async()=>{throw Error('SMTP failed')}})).status,502)});
test('missing transport configuration is unavailable',async()=>{assert.equal((await request()).status,503)});
test('rejects bad input, oversized text, header injection, traps and foreign origins',async()=>{
 for(const body of [{...valid,email:'bad'},{...valid,email:'a@example.com\r\nBcc:x@y.com'},{...valid,document:' '},{...valid,document:'a'.repeat(30001)},{...valid,website:'bot'},null]) assert.equal((await request({body})).status,400);
 assert.equal((await request({headers:{origin:'https://elsewhere.example',host:'localhost:4174'}})).status,403);
 assert.equal((await request({method:'GET'})).status,405);
});
