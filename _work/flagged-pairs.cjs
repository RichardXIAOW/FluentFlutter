// 只输出被 literal-diff 标记的示例的代码与图形，供人工比对
const fs = require('fs');
const path = require('path');
const pairs = fs.readFileSync(path.join(__dirname, 'demo-mock-pairs.txt'), 'utf8');
const blocks = pairs.split('\n\u250c').slice(1);
const out = [];
let hits = [];
try {
  hits = fs
    .readFileSync(path.join(__dirname, 'literal-diff.txt'), 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('《'))
    .map((l) => l.replace(/^《|》.*$/g, '').trim());
} catch (e) {}
const seen = new Set();
for (const b of blocks) {
  const key = (b.match(/'([^']+::[^']+)'/) || [])[1] || b.split('\n')[0];
  if (hits.length && !hits.some((h) => key.startsWith(h))) continue;
  if (seen.has(key)) continue;
  seen.add(key);
  out.push('\u250c' + b.trimEnd());
}
fs.writeFileSync(path.join(__dirname, 'flagged-pairs.txt'), out.join('\n\n'), 'utf8');
console.log('已写出_' + seen.size + '_个示例');
