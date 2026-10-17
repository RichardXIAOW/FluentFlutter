// 在配对报告里定位指定字面量（只看「代码」段），输出上下文，帮助决定图形怎么改
const fs = require('fs');
const path = require('path');
const pairs = fs.readFileSync(path.join(__dirname, 'demo-mock-pairs.txt'), 'utf8');
const blocks = pairs.split('\n\u250c').slice(1);
const wants = process.argv.slice(2);
for (const w of wants) {
  console.log('\n===== ' + w + ' =====');
  for (const b of blocks) {
    const lines = b.split('\n');
    const iCode = lines.findIndex((l) => l.includes('├─ 代码'));
    const iJsx = lines.findIndex((l) => l.includes('图形 JSX'));
    const code = lines.slice(iCode + 1, iJsx < 0 ? lines.length : iJsx);
    const hit = code.findIndex((l) => l.includes(w));
    if (hit < 0) continue;
    console.log('--- ' + lines[0].replace(/^\u2500\s*/, ''));
    console.log(code.slice(Math.max(0, hit - 2), hit + 3).join('\n'));
  }
}
