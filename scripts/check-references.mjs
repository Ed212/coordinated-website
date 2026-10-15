import { existsSync } from 'node:fs';
const missing=['RULES.md','landing-v4.tpl.html','calc.js','FIVE-SECOND-TEST.md'].filter(file=>!existsSync(`docs/site-v5/${file}`));
if(missing.length) throw Error(`Release blocked: original required references missing: ${missing.join(', ')}`);
if(!existsSync('docs/site-v5/attention-section.html')) throw Error('Release blocked: comparison section has not been ported and verified.');
console.log('PASS original v5 references and comparison port present.');
