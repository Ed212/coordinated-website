import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve(process.env.PREVIEW_ROOT || 'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/api/contact') {
  let input='';for await(const part of req){input+=part;if(input.length>150000){res.writeHead(413).end();return;}}
  res.status=code=>{res.statusCode=code;return res};res.json=body=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))};
  req.body=input;
  const {createHandler}=await import('../api/contact.js');
  // Explicit test mode uses a local delivery sink. Production never uses this sink.
  const sendMail=process.env.TEST_MAIL_SINK==='1' ? async()=>({accepted:[process.env.CONTACT_ADDRESS || 'ed@coordinatedai.ai']}) : undefined;
  await createHandler({sendMail})(req,res);return;
 }
 try {
  let file=resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path));
  if(!file.startsWith(root+'/'))throw Error('Invalid path');
  try{await stat(file)}catch{if(!extname(file))file+='.html'}
  const body=await readFile(file);res.setHeader('Content-Type',types[extname(file)] || 'application/octet-stream');
  if(['.mp4','.webm'].includes(extname(file))) {
   res.setHeader('Accept-Ranges','bytes');
   if(req.headers.range) {
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    const start=match?.[1] ? Number(match[1]) : match?.[2] ? Math.max(0,body.length-Number(match[2])) : NaN;
    const end=match?.[1] && match[2] ? Math.min(Number(match[2]),body.length-1) : body.length-1;
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=body.length) {res.writeHead(416,{'Content-Range':`bytes */${body.length}`}).end();return;}
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${body.length}`,'Content-Length':end-start+1});res.end(body.subarray(start,end+1));return;
   }
  }
  res.setHeader('Content-Length',body.length);res.end(body);
 }catch{res.writeHead(404).end('Page not found');}
}).listen(Number(process.env.PORT || 4174),'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${process.env.PORT || 4174}`));
