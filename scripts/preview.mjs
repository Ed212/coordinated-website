import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve(process.env.PREVIEW_ROOT || 'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/api/contact') {
  let input='';for await(const part of req){input+=part;if(input.length>150000){res.writeHead(413).end();return;}}
  res.status=code=>{res.statusCode=code;return res};res.json=body=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))};
  req.body=input;
  const {createHandler}=await import('../api/contact.js');
  // Explicit test mode uses a local delivery sink. Production never uses this sink.
  const sendMail=process.env.TEST_MAIL_SINK==='1' ? async()=>({accepted:['local-test']}) : undefined;
  await createHandler({sendMail})(req,res);return;
 }
 try {
  let file=resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path));
  if(!file.startsWith(root+'/'))throw Error('Invalid path');
  try{await stat(file)}catch{if(!extname(file))file+='.html'}
  const body=await readFile(file);res.setHeader('Content-Type',types[extname(file)] || 'application/octet-stream');res.end(body);
 }catch{res.writeHead(404).end('Page not found');}
}).listen(Number(process.env.PORT || 4174),'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${process.env.PORT || 4174}`));
