/**
 * 数据自检（不依赖 ts-node / next）：
 * 用极简的正则从 .ts 数据文件里抽出 slug / related / category，
 * 然后报告：
 *   1. 重复 slug
 *   2. related 指向不存在的 slug（dangling）
 *   3. 未使用的 category
 *   4. 每个分类的组件数
 *
 * 之所以不用真的 import TS：跑这个脚本时 npm install 可能还没完成，
 * 用正则能立刻拿到结果，且不依赖任何依赖。
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data', 'components');

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.ts'));

/** @type {{slug:string,file:string,category:string,related:string[]}[]} */
const entries = [];

for (const file of files) {
  const src = fs.readFileSync(path.join(DIR, file), 'utf8');

  // 每个组件项从 "    slug: 'xxx'," 开始（4 空格缩进）
  const slugRe = /^\s{2,6}slug:\s*'([^']+)'/gm;
  const positions = [];
  let m;
  while ((m = slugRe.exec(src)) !== null) {
    positions.push({ slug: m[1], at: m.index });
  }

  for (let i = 0; i < positions.length; i += 1) {
    const start = positions[i].at;
    const end = i + 1 < positions.length ? positions[i + 1].at : src.length;
    const chunk = src.slice(start, end);

    const cat = /^\s{2,6}category:\s*'([^']+)'/m.exec(chunk);
    const relBlock = /^\s{2,6}related:\s*\[([^\]]*)\]/m.exec(chunk);
    const related = relBlock
      ? [...relBlock[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
      : [];

    entries.push({
      slug: positions[i].slug,
      file,
      category: cat ? cat[1] : '??',
      related,
    });
  }
}

// --- 1. 重复 slug -----------------------------------------------------------
const seen = new Map();
const dupes = [];
for (const e of entries) {
  if (seen.has(e.slug)) dupes.push(`${e.slug}  (${seen.get(e.slug)} + ${e.file})`);
  else seen.set(e.slug, e.file);
}

// --- 2. dangling related ---------------------------------------------------
const slugSet = new Set(entries.map((e) => e.slug));
const dangling = [];
for (const e of entries) {
  for (const r of e.related) {
    if (!slugSet.has(r)) dangling.push(`${e.slug}  →  ${r}`);
  }
}

// --- 3. 分类统计 -----------------------------------------------------------
const byCat = {};
for (const e of entries) byCat[e.category] = (byCat[e.category] ?? 0) + 1;

// --- 4. 未被任何 related 引用的孤立组件 ------------------------------------
const referenced = new Set();
for (const e of entries) e.related.forEach((r) => referenced.add(r));
const orphans = entries.filter((e) => !referenced.has(e.slug)).map((e) => e.slug);

console.log('=== 组件总数 ===');
console.log(entries.length);
console.log('\n=== 各分类组件数 ===');
for (const [k, v] of Object.entries(byCat).sort()) console.log(`  ${k.padEnd(12)} ${v}`);
console.log('\n=== 重复 slug ===');
console.log(dupes.length ? dupes.join('\n') : '  无');
console.log('\n=== related 指向不存在的 slug ===');
console.log(dangling.length ? dangling.join('\n') : '  无');
console.log('\n=== 全量 slug 清单 ===');
console.log(entries.map((e) => e.slug).sort().join(', '));
console.log('\n=== 未被 related 引用的组件（仅供参考，不算错误）===');
console.log(orphans.length ? orphans.join(', ') : '  无');
