// 查看指定示例的「代码」与「图形 JSX」，便于人工比对
// 用法: node _work/show-pair.cjs app-bar
const fs = require('fs');
const path = require('path');
const txt = fs.readFileSync(path.join(__dirname, 'demo-mock-pairs.txt'), 'utf8');
const want = process.argv[2] || '';
const blocks = txt.split('\n\u250c').slice(1);
for (const b of blocks) {
  if (!want || b.includes(want)) {
    console.log('\u250c' + b.trimEnd());
    console.log('');
  }
}
