// ---- Coordinated attention calculator: shared model (inlined into both pages by build-calc.py) ----
// Measured from the simulator fixture (headless replay of all 67 steps, Mon Sep 28 to Mon Nov 16, 2026):
const LEDGER = {
  haley:{persona:'operator',cards:1,notes:2,posts:12,words:1081,peak:'Oct 19',approvals:33},
  priya:{persona:'sponsor',cards:0,notes:0,posts:12,words:746,peak:'none'},
  nadia:{persona:'decision-holder',cards:1,notes:2,posts:12,words:1106,peak:'Sep 28'},
  maya:{persona:'owner (moved her date)',cards:10,notes:2,posts:12,words:1736,peak:'Oct 19: 5 cards, 2 notes'},
  leo:{persona:'owner',cards:3,notes:0,posts:12,words:966,peak:'Sep 28'},
  sarah:{persona:'owner (countered)',cards:8,notes:2,posts:12,words:1686,peak:'Oct 19: 5 cards, 2 notes'},
  ivy:{persona:'owner',cards:5,notes:1,posts:12,words:1301,peak:'Oct 19'},
  marco:{persona:'owner',cards:5,notes:0,posts:12,words:1091,peak:'Sep 28'},
  omar:{persona:'everyone else',cards:0,notes:0,posts:12,words:746,peak:'none'}
};
const FIX = { people:9, owners:5, weeks:7, changes:2, cards:33, notes:9, postsPerPerson:12, approvals:33,
  wordsTotal:Object.values(LEDGER).reduce((a,p)=>a+p.words,0) };

const P = {
  people:{v:9,min:4,max:40,step:1,l:'People on the launch'},
  weeks:{v:7,min:2,max:13,step:1,l:'Weeks'},
  changes:{v:2,min:0,max:8,step:1,l:'Material changes'},
  statusMin:{v:30,min:0,max:60,step:5,l:'Weekly status meeting today, minutes, everyone'},
  reviewMin:{v:60,min:0,max:120,step:15,l:'Launch review meeting today, minutes, everyone'},
  adhocMin:{v:30,min:0,max:60,step:5,l:'Meeting per change today, minutes'},
  adhocPeople:{v:4,min:1,max:12,step:1,l:'People in that meeting'},
  chatter:{v:8,min:0,max:40,step:1,l:'Launch-channel messages a day, read by all'},
  threadMsgs:{v:25,min:0,max:80,step:5,l:'Slack thread messages per change, read by all'},
  dmPerChange:{v:6,min:0,max:20,step:1,l:'DMs to answer per change'},
  chase:{v:1,min:0,max:5,step:1,l:'"Is this still on?" DMs per owner per week'},
  setupH:{v:4,min:0,max:12,step:0.5,l:'Setup and formation interviews, team hours'},
  cardMin:{v:2,min:0.5,max:8,step:0.5,l:'Minutes to think through and answer a card'},
  noteMin:{v:0.5,min:0,max:3,step:0.5,l:'Minutes to read a settlement note'},
  approvalSec:{v:30,min:0,max:90,step:5,l:'Seconds per operator send approval (0 with a mandate)'},
  adminMin:{v:15,min:0,max:60,step:5,l:'Operator administration, minutes a week'},
  evidenceH:{v:2,min:0,max:8,step:0.5,l:'Evidence handling and corrections, team hours'},
  msgRemainB:{v:50,min:0,max:100,step:5,l:'% of today\'s message work that remains'},
  rate:{v:70,min:30,max:200,step:5,l:'Loaded cost of an hour, $'},
  readSec:{v:8,min:3,max:30,step:1,l:'Seconds to read a Slack message'},
  dmSec:{v:45,min:15,max:180,step:15,l:'Seconds to answer a DM'},
  wpm:{v:200,min:120,max:300,step:10,l:'Reading speed, words a minute'}
};
const GROUPS = {
  'c-launch':['people','weeks','changes'],
  'c-today':['statusMin','reviewMin','adhocMin','adhocPeople','chatter','threadMsgs','dmPerChange','chase'],
  'c-co':['setupH','cardMin','noteMin','approvalSec','adminMin','evidenceH','msgRemainB'],
  'c-speed':['rate','readSec','dmSec','wpm']
};
function fmtv(k){ const p=P[k]; return (p.step<1? p.v.toFixed(1): String(p.v)); }
function buildControls(){
  for (const g of Object.keys(GROUPS)){ const host=document.getElementById(g); if (!host) continue;
    for (const k of GROUPS[g]){ const p=P[k]; const d=document.createElement('div'); d.className='ctrl';
      d.innerHTML='<label><span>'+p.l+'</span><b id="v-'+k+'">'+fmtv(k)+'</b></label><input type="range" id="r-'+k+'" min="'+p.min+'" max="'+p.max+'" step="'+p.step+'" value="'+p.v+'" aria-label="'+p.l+'">';
      host.appendChild(d); d.querySelector('input').addEventListener('input',e=>{ P[k].v=parseFloat(e.target.value); document.getElementById('v-'+k).textContent=fmtv(k); render(); }); } }
  const pess=document.getElementById('pess'); if (pess) pess.addEventListener('change',render);
}
function model(){
  const v=k=>P[k].v; const N=v('people'), W=v('weeks'), C=v('changes'); const owners=Math.max(1,Math.round(N*FIX.owners/FIX.people));
  const pess=!!(document.getElementById('pess')&&document.getElementById('pess').checked);
  const rs=v('readSec')/3600, ds=v('dmSec')/3600;
  // today's workflow
  const statusH=W*v('statusMin')*N/60, reviewH=v('reviewMin')*N/60, changeH=C*v('adhocMin')*Math.min(N,v('adhocPeople'))/60;
  const reads=W*5*v('chatter')+C*v('threadMsgs'); const answers=W*v('chase')*owners+C*v('dmPerChange');
  const msgH=N*reads*rs + answers*ds;
  const today={ name:'Today: meetings and threads', short:'Today', meet:statusH+reviewH+changeH, msg:msgH, own:0 };
  // Coordinated's own work, from the measured ledger scaled to the scenario
  const scale=(owners/FIX.owners)*(0.5+0.5*C/FIX.changes); const cards=Math.round(FIX.cards*scale), notes=Math.round(FIX.notes*(C/FIX.changes));
  const wordsPP=(FIX.wordsTotal/FIX.people)*(W/FIX.weeks)*(0.6+0.4*(C/FIX.changes));
  const setup=v('setupH')*(pess?2:1), cardMin=pess? Math.max(5,v('cardMin')) : v('cardMin');
  const own = setup + N*wordsPP/v('wpm')/60 + cards*cardMin/60 + notes*v('noteMin')/60 + cards*v('approvalSec')/3600 + W*v('adminMin')/60 + v('evidenceH');
  const ownParts={ setup, reading:N*wordsPP/v('wpm')/60, cards:cards*cardMin/60+notes*v('noteMin')/60, approvals:cards*v('approvalSec')/3600, admin:W*v('adminMin')/60, evidence:v('evidenceH') };
  const rem=v('msgRemainB')/100;
  // three meeting policies with Coordinated
  const A={ name:'With Coordinated, all meetings stay', short:'Coordinated, meetings stay', meet:today.meet, msg:msgH*rem, own };
  const B={ name:'With Coordinated, status meeting stops after week two', short:'Coordinated, status meeting stops', meet:Math.min(W,2)*v('statusMin')*N/60 + reviewH + changeH, msg:msgH*rem, own };
  const syncs=Math.max(0,W-2); const small=Math.min(N,4), tiny=Math.min(N,3);
  const Cc={ name:'With Coordinated, meetings smaller and shorter', short:'Coordinated, meetings smaller', meet:Math.min(W,2)*v('statusMin')*N/60 + syncs*15*small/60 + 30*small/60 + C*15*tiny/60, msg:msgH*Math.min(rem,0.25), own };
  const R=[today,A,B,Cc];
  for (const r of R){ r.total=r.meet+r.msg+r.own; r.net=today.total-r.total; r.pct=today.total>0? r.net/today.total:0; r.value=r.net*v('rate'); }
  return { R, today, A, B, Cc, N, W, C, cards, notes, ownParts, pess };
}
function h1(x){ const a=Math.abs(x); const r=(a>=10? Math.round(a) : Math.round(a*10)/10).toLocaleString(); return (x<0?'−':'')+r; }
function pct(x){ return Math.round(x*100); }
function money(x){ const s=Math.round(Math.abs(x)).toLocaleString(); return (x<0?'−$':'$')+s; }
function niceStep(max){ const raw=max/5; const p=Math.pow(10,Math.floor(Math.log10(raw))); const m=raw/p; return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p; }
function drawBars(host, rows, legendSegs){
  const max=Math.max(...rows.map(r=>r.total))*1.12 || 1; const Wd=900, left=250, right=70, rowH=46, top=10; const H=top+rows.length*rowH+30; const plotW=Wd-left-right; const x=v=>left+v/max*plotW;
  const ticks=[]; const step=niceStep(max); for (let t=0;t<=max;t+=step) ticks.push(t);
  let s='<svg viewBox="0 0 '+Wd+' '+H+'" role="img" aria-label="Team coordination hours by scenario">';
  for (const t of ticks){ s+='<line x1="'+x(t)+'" y1="'+top+'" x2="'+x(t)+'" y2="'+(top+rows.length*rowH)+'" stroke="var(--grid)" stroke-width="1"/><text x="'+x(t)+'" y="'+(top+rows.length*rowH+18)+'" font-size="12" text-anchor="middle" fill="var(--muted)">'+t.toLocaleString()+(t===ticks[ticks.length-1]?' h':'')+'</text>'; }
  rows.forEach((r,i)=>{ const y=top+i*rowH+11; const bh=24; let cx=left;
    s+='<text x="'+(left-12)+'" y="'+(y+16)+'" font-size="13" text-anchor="end" fill="var(--fg)">'+r.short+'</text>';
    legendSegs.forEach((sg,j)=>{ const w=Math.max(0,r[sg[0]]/max*plotW); if (w<=0) return; const gap=j>0?2:0; const last=legendSegs.slice(j+1).every(q=>r[q[0]]<=0);
      s+='<rect class="seg" data-name="'+r.short+'" data-seg="'+sg[2]+'" data-v="'+h1(r[sg[0]])+'" x="'+(cx+gap)+'" y="'+y+'" width="'+Math.max(0.5,w-gap)+'" height="'+bh+'" fill="'+sg[1]+'"'+(last?' rx="4"':'')+'/>'; cx+=w; });
    s+='<text x="'+(x(r.total)+8)+'" y="'+(y+16)+'" font-size="13" fill="var(--fg2)">'+h1(r.total)+' h</text>'; });
  s+='<line x1="'+left+'" y1="'+top+'" x2="'+left+'" y2="'+(top+rows.length*rowH)+'" stroke="var(--axis)" stroke-width="1"/></svg>';
  host.innerHTML=s; const tip=document.getElementById('tip'); const box=host.parentElement;
  host.querySelectorAll('.seg').forEach(el=>{ el.addEventListener('mousemove',e=>{ tip.style.display='block'; tip.textContent=el.dataset.name+' · '+el.dataset.seg+': '+el.dataset.v+' h'; const b=box.getBoundingClientRect(); tip.style.left=Math.min(e.clientX-b.left+12,b.width-200)+'px'; tip.style.top=(e.clientY-b.top-36)+'px'; }); el.addEventListener('mouseleave',()=>tip.style.display='none'); });
}
function renderCore(){
  const M=model(); const [today,A,B,Cc]=M.R;
    const hero=document.getElementById('hero');
  if (hero){ const lo=Math.min(B.pct,Cc.pct), hi=Math.max(B.pct,Cc.pct);
    hero.innerHTML='<div class="label">Illustrative '+M.W+'-week launch, '+M.N+' people'+(M.pess?' · pessimistic case':'')+'</div><div class="big">'+pct(lo)+' to '+pct(hi)+'% less</div><p class="sub">coordination time when the status meeting goes. If every meeting stays, the same launch takes '+(A.net<0? pct(-A.pct)+'% more':pct(A.pct)+'% less')+' time, because Coordinated adds work of its own: about '+h1(A.own)+' hours of setup, reading, answering, approvals and evidence.</p>'; }
  const T=document.getElementById('cmp');
  if (T) T.innerHTML='<tr><th>Scenario</th><th class="num">Meetings, h</th><th class="num">Messages and threads, h</th><th class="num">Coordinated\'s own work, h</th><th class="num">Total, h</th><th class="num">Net recovered, h</th><th class="num">Change</th><th class="num">At $'+P.rate.v+'/h</th></tr>'+
    M.R.map((r,i)=>'<tr'+(i>0?' class="co"':'')+'><td style="min-width:150px">'+r.short+'</td><td class="num">'+h1(r.meet)+'</td><td class="num">'+h1(r.msg)+'</td><td class="num">'+(r.own?h1(r.own):'0')+'</td><td class="num">'+h1(r.total)+'</td><td class="num">'+(i?h1(r.net):'')+'</td><td class="num">'+(i?(r.net<0? pct(-r.pct)+'% more':pct(r.pct)+'% less'):'')+'</td><td class="num">'+(i?money(r.value):'')+'</td></tr>').join('');
  const ch=document.getElementById('chart'); if (ch) drawBars(ch, M.R, [['meet','var(--s1)','In meetings'],['msg','var(--s2)','Messages and threads'],['own','var(--s3)','Coordinated\'s own work']]);
  const L=document.getElementById('ledgerT');
  if (L) L.innerHTML='<tr><th>Person</th><th>Role</th><th class="num">Cards to answer</th><th class="num">Settlement notes to read</th><th class="num">Channel posts to read</th><th class="num">Reading minutes</th><th>Busiest week</th></tr>'+
    Object.keys(LEDGER).map(k=>{ const p=LEDGER[k]; return '<tr><td>'+k[0].toUpperCase()+k.slice(1)+'</td><td>'+p.persona+(p.approvals?' (also approved '+p.approvals+' sends)':'')+'</td><td class="num">'+p.cards+'</td><td class="num">'+p.notes+'</td><td class="num">'+p.posts+'</td><td class="num">'+h1(p.words/P.wpm.v)+'</td><td>'+p.peak+'</td></tr>'; }).join('')+
    '<tr class="co"><td>Total</td><td>nine people, seven weeks</td><td class="num">'+FIX.cards+'</td><td class="num">'+FIX.notes+'</td><td class="num">'+FIX.postsPerPerson+' each</td><td class="num">'+h1(FIX.wordsTotal/P.wpm.v)+'</td><td></td></tr>';
  const own=document.getElementById('own');
  if (own){ const o=M.ownParts; own.textContent='Coordinated\'s own work in this scenario: setup '+h1(o.setup)+' h, reading '+h1(o.reading)+' h, '+M.cards+' cards and '+M.notes+' notes '+h1(o.cards)+' h, operator approvals '+h1(o.approvals)+' h, administration '+h1(o.admin)+' h, evidence and corrections '+h1(o.evidence)+' h.'; }
  return M;
}
