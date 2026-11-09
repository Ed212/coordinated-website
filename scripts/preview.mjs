import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4','.jpg':'image/jpeg','.json':'application/json'};

// This development server supports one byte range, as used by native video seeks.
// Unknown units, malformed syntax and unsupported multiple ranges are ignored.
export function byteRange(header,length){
 if(typeof header!=='string')return null;
 const match=/^bytes\s*=\s*(\d*)-(\d*)\s*$/i.exec(header.trim());
 if(!match||(!match[1]&&!match[2]))return null;
 const size=BigInt(length);
 if(size===0n)return {unsatisfiable:true};
 let start,end;
 if(!match[1]){
  const suffix=BigInt(match[2]);if(suffix===0n)return {unsatisfiable:true};
  start=suffix>=size?0n:size-suffix;end=size-1n;
 }else{
  start=BigInt(match[1]);end=match[2]?BigInt(match[2]):size-1n;
  if(start>=size||end<start)return {unsatisfiable:true};
  if(end>=size)end=size-1n;
 }
 return {start:Number(start),end:Number(end)};
}

export function createPreviewServer({root=process.env.PREVIEW_ROOT||'dist',testMailSink=process.env.TEST_MAIL_SINK==='1'}={}){
 root=resolve(root);
 return http.createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/api/contact') {
   let input='';for await(const part of req){input+=part;if(input.length>150000){res.writeHead(413).end();return;}}
   res.status=code=>{res.statusCode=code;return res};res.json=body=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))};
   req.body=input;
   const {createHandler}=await import('../api/contact.js');
   // Explicit test mode uses a local delivery sink. Production never uses this sink.
   const sendMail=testMailSink ? async()=>({accepted:[process.env.CONTACT_ADDRESS || 'ed@coordinatedai.ai']}) : undefined;
   await createHandler({sendMail})(req,res);return;
  }
  try {
   let file=resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path));
   if(!file.startsWith(root+'/'))throw Error('Invalid path');
   try{await stat(file)}catch{if(!extname(file))file+='.html'}
   const body=await readFile(file);
   res.setHeader('Content-Type',types[extname(file)] || 'application/octet-stream');
   res.setHeader('Accept-Ranges','bytes');
   // With no server validators, If-Range cannot be verified: send the full file.
   // Range only applies to GET; HEAD reports the corresponding complete length.
   const range=req.method==='GET'&&!req.headers['if-range']?byteRange(req.headers.range,body.length):null;
   if(range?.unsatisfiable){
    res.writeHead(416,{'Content-Range':`bytes */${body.length}`,'Content-Length':'0'});res.end();return;
   }
   if(range){
    const chunk=body.subarray(range.start,range.end+1);
    res.writeHead(206,{'Content-Range':`bytes ${range.start}-${range.end}/${body.length}`,'Content-Length':String(chunk.length)});
    res.end(chunk);return;
   }
   res.setHeader('Content-Length',String(body.length));res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8','Content-Length':'14'}).end(req.method==='HEAD'?undefined:'Page not found');}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const port=Number(process.env.PORT||4174);
 createPreviewServer().listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`));
}
