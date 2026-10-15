// 抽取 handbook 附录 E（Dart 高级语法速查）的完整 HTML，存成 _work/dart-appendix.html
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'public', 'handbook', 'index.html');
const html = fs.readFileSync(src, 'utf8');

const s = html.indexOf('<h2 id="a5">');
const e = html.indexOf('<h2 id="a6">');
if (s === -1 || e === -1) {
  console.error('找不到附录 E 边界');
  process.exit(1);
}

const seg = html.slice(s, e);
fs.writeFileSync(path.join(__dirname, 'dart-appendix.html'), seg);

const h3 = [...seg.matchAll(/<h[34][^>]*>([\s\S]{0,140}?)<\/h[34]>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, '').trim(),
);
console.log('抽取长度:', seg.length);
console.log('小节:');
h3.forEach((t) => console.log('  - ' + t));
