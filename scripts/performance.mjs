import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const prefix=process.env.VERIFY_PREFIX || '';
const profile=await mkdtemp(join(tmpdir(),'coordinated-lighthouse-'));
const executable=process.env.CHROME_PATH || chromium.executablePath();
const child=spawn(executable,['--headless=new','--no-sandbox','--remote-debugging-port=9223',`--user-data-dir=${profile}`],{stdio:'ignore'});
try {
 let ready=false;for(let i=0;i<60;i++){try{await fetch('http://127.0.0.1:9223/json/version');ready=true;break}catch{await new Promise(r=>setTimeout(r,100))}}
 if(!ready)throw Error('Chrome debugging port unavailable');
 const logs=[];
 for(const file of ['index.html','b.html']) {
  const result=await lighthouse(`${process.env.BASE_URL || 'http://127.0.0.1:4174'}/${file}`,{port:9223,output:'json',onlyCategories:['performance'],logLevel:'error',formFactor:'mobile',screenEmulation:{mobile:true,width:400,height:900,deviceScaleFactor:1,disabled:false}});
  const score=Math.round(result.lhr.categories.performance.score*100);logs.push(`${file}: mobile performance ${score}; FCP ${result.lhr.audits['first-contentful-paint'].displayValue}; LCP ${result.lhr.audits['largest-contentful-paint'].displayValue}; CLS ${result.lhr.audits['cumulative-layout-shift'].displayValue}`);
  await writeFile(`docs/site-v5/logs/${prefix}lighthouse-${file.split('.')[0]}.json`,result.report);
  if(result.lhr.audits['cumulative-layout-shift'].numericValue!==0)logs.push('FAIL requested CLS zero');
  if(score<90)logs.push('FAIL requested mobile performance threshold 90');
 }
 await writeFile(`docs/site-v5/logs/${prefix}lighthouse.log`,logs.join('\n')+'\n');console.log(logs.join('\n'));
 if(logs.some(l=>l.startsWith('FAIL')))process.exitCode=1;
} finally {child.kill();await new Promise(r=>child.once('exit',r));await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200})}
