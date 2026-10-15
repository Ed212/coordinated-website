import { readFile, readdir } from 'node:fs/promises';
export const rules = [
 ['em dash', /—/g], ['bracket placeholder', /\[[^\]\n]+\]/g],
 ['prohibited wording', /\b(genuinely|honestly|straightforward|system of record|40x|Nobody pinged)\b/gi],
 ['Git vocabulary', /\b(commit|commits|merge|merges|branch|branches|diff|diffs|repo|repos|pull request)\b/gi],
 ['risk label', /\b(at risk|on track|likely to slip|health|score)\b/gi],
 ['response promise', /\b(within the hour|same day|two business days)\b/gi],
 ['competitor or certification', /\b(LinearB|Gartner|Atlassian|Asana|Monday\.com|SOC\s*2|certified|certification)\b/gi],
 ['date missing weekday', /(?<!\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) )\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}\b/g]
];
export function checkCopy(text, label) {
 const failures=[];
 for(const [name,pattern] of rules) for(const hit of text.matchAll(pattern)) failures.push(`${label}: ${name}: ${hit[0]}`);
 return failures;
}
export function htmlText(html) {
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[^]*?-->/g,'').replace(/<[^>]+>/g,' ').replace(/&mdash;|&#8212;|&#x2014;/gi,'—').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
}
export async function checkBuild() {
 let failures=[];
 for(const file of (await readdir('dist')).filter(f=>f.endsWith('.html'))) {
  const html=await readFile(`dist/${file}`,'utf8');
  failures.push(...checkCopy(htmlText(html),file));
  if (/\[[^\]\n]+\]/.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,''))) failures.push(`${file}: raw HTML bracket placeholder`);
 }
 if(failures.length) throw Error(failures.join('\n'));
 console.log('PASS copy grep: all built HTML pages; placeholders, vocabulary, dates and promises.');
}
// Run on import during build, or directly from the command line.
await checkBuild();
