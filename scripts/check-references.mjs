import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const missing=['RULES.md','landing-v4.tpl.html','calc.js','FIVE-SECOND-TEST.md','COPY-FIXES.md'].filter(file=>!existsSync(`docs/site-v5/${file}`));
if(missing.length) throw Error(`Release blocked: original required references missing: ${missing.join(', ')}`);
if(!existsSync('docs/site-v5/attention-section.html') || !existsSync('templates/attention-runtime.js')) throw Error('Comparison port is missing.');
const expected='a289412212e78d7b1bdf20d1063077ed0ca991be56fd5f300d6da42c3a45adde';
const actual=createHash('sha256').update(readFileSync('docs/site-v5/calc.js')).digest('hex');
if(actual!==expected)throw Error('Original calculator bytes changed.');
console.log(`PASS original v5 references and comparison port present; calc.js SHA-256 ${actual}`);
