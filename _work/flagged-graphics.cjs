// 只输出被标记示例的图形 JSX（跳过代码段），便于快速定位要改的地方
const fs = require('fs');
const path = require('path');
const pairs = fs.readFileSync(path.join(__dirname, 'demo-mock-pairs.txt'), 'utf8');
const blocks = pairs.split('\n\u250c').slice(1);
const hits = fs
  .readFileSync(path.join(__dirname, 'literal-diff.txt'), 'utf8')
  .split('\n')
  .filter((l) => l.startsWith('《'))
  .map((l) => l.replace(/^《|》.*$/g, '').trim());
const out = [];
const seen = new Set();
for (const b of blocks) {
  const key = (b.match(/'([^']+::[^']+)'/) || [])[1] || b.split('\n')[0];
  if (!hits.some((h) => key.startsWith(h))) continue;
  if (seen.has(key)) continue;
  seen.add(key);
  const lines = b.split('\n');
  const cut = lines.findIndex((l) => l.includes('图形 JSX'));
  const head = lines.slice(0, cut < 0 ? 2 : 1);
  out.push('\u250c' + head.join('\n').trimEnd() + '\n' + lines.slice(cut).join('\n').trimEnd());
}
fs.writeFileSync(path.join(__dirname, 'flagged-graphics.txt'), out.join('\n\n'), 'utf8');
console.log('已写出_' + seen.size + '_个');
