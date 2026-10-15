/** 导出每个组件下方真实的示例标题（供人工核对后再写图形） */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data', 'components');
const out = {};

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.ts')) continue;
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const marks = [];
  const re = /slug:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) marks.push({ slug: m[1], at: m.index });
  marks.push({ slug: null, at: src.length });

  for (let i = 0; i < marks.length - 1; i++) {
    const seg = src.slice(marks[i].at, marks[i + 1].at);
    const d = seg.indexOf('demos:');
    if (d < 0) continue;
    const titles = [...seg.slice(d).matchAll(/title:\s*'((?:[^'\\]|\\.)*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    );
    if (titles.length) out[marks[i].slug] = titles;
  }
}

fs.writeFileSync(
  path.join(__dirname, 'real-titles.json'),
  JSON.stringify(out, null, 2),
);

let n = 0;
for (const k in out) n += out[k].length;
console.log(`组件 ${Object.keys(out).length} 个，示例 ${n} 个`);

const want = process.argv[2];
const keys = want ? want.split(',') : Object.keys(out);
for (const k of keys) {
  if (out[k]) console.log(`\n【${k}】\n  ` + out[k].join('\n  '));
}
