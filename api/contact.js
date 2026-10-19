import nodemailer from 'nodemailer';

export function createHandler({ env = process.env, sendMail } = {}) {
 return async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if(req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({error:'Use the document form to send your launch document.'}); }
  if(req.headers.origin) {
   try { if(new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({error:'Please send the document from this site.'}); }
   catch { return res.status(403).json({error:'Please send the document from this site.'}); }
  }
  let body=req.body;
  if(typeof body === 'string') {
   try { body=JSON.parse(body); } catch { return res.status(400).json({error:'Please check your document and email.'}); }
  }
  if(!body || typeof body !== 'object') return res.status(400).json({error:'Please check your document and email.'});
  const {email,document,website}=body;
  if(typeof website==='string' && website) return res.status(400).json({error:'Please check your document and email.'});
  if(typeof email!=='string' || email.length>254 || !/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(email) || typeof document!=='string' || !document.trim() || document.length>30000) return res.status(400).json({error:'Please check your document and email.'});
  const {SMTP_HOST,SMTP_PORT='465',SMTP_USER,SMTP_PASS,SMTP_FROM,CONTACT_ADDRESS='ed@coordinatedai.ai'}=env;
  if(!sendMail && (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM)) return res.status(503).json({error:'The form is unavailable. Please email your document to ed@coordinatedai.ai.'});
  try {
   const deliver=sendMail || (message=>nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT),secure:SMTP_PORT==='465',requireTLS:true,auth:{user:SMTP_USER,pass:SMTP_PASS},connectionTimeout:10000,socketTimeout:15000}).sendMail(message));
   await deliver({from:SMTP_FROM,to:CONTACT_ADDRESS,replyTo:email,subject:'Coordinated launch document',text:`From: ${email}\n\n${document}`});
   return res.status(200).json({message:'We read it and reply.'});
  } catch {
   return res.status(502).json({error:'Your document could not be sent. Please try again or email ed@coordinatedai.ai.'});
  }
 };
}
export default createHandler();
