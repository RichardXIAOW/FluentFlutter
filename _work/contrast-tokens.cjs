/* 对比度批量修正（严格按审核结论，不做宽泛替换）
 *
 * 依据 _work/audit-contrast-full.cjs 的报告：
 *   text-ink-300   浅色 1.48:1 / 深色 1.89:1  → text-ink-400（4.76 / 4.76）
 *   text-brand-500 浅色 3.68:1                → text-brand-600（5.36 / 深色更亮）
 *   text-brand-400 浅色 1.81:1                → text-brand-600
 *
 * 只动 text-* 前景色。border-* / ring-* 是发丝分隔线，属 WCAG 1.4.11 豁免的
 * 纯装饰，保持不动，否则整站描边会变重变脏。
 *
 * 用法: node _work/contrast-tokens.cjs
 */
const fs = require('fs');
const path = require('path');

const RULES = [
  ['text-ink-300', 'text-ink-400'],
  ['text-brand-500', 'text-brand-600'],
  ['text-brand-400', 'text-brand-600'],
];

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.tsx?$/.test(e.name)) out.push(f);
  }
  return out;
};

let total = 0;
const touched = [];
for (const file of walk('src')) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  let n = 0;
  for (const [from, to] of RULES) {
    const hits = after.split(from).length - 1;
    if (!hits) continue;
    after = after.split(from).join(to);
    n += hits;
  }
  if (after === before) continue;
  fs.writeFileSync(file, after, 'utf8');
  total += n;
  touched.push([path.relative('src', file), n]);
}

for (const [f, n] of touched.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${f}`);
}
console.log(`\n共 ${total} 处替换，涉及 ${touched.length} 个文件`);
