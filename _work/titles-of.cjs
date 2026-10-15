// 用法：node _work/titles-of.cjs <slug>
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const dir = path.join(__dirname, '..', 'src', 'data', 'components');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts'));

for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = src.match(new RegExp("slug:\\s*'" + slug + "'"));
  if (!m) continue;
  // 定位到该组件的 demos: 起点，截到下一个 slug: 或文件尾
  const start = src.indexOf('demos:', m.index);
  const next = src.indexOf("\n    slug:", m.index);
  const seg = src.slice(start, next === -1 ? src.length : next);
  const titles = [...seg.matchAll(/title:\s*'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
  console.log(f + ' :: ' + slug);
  titles.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
}
