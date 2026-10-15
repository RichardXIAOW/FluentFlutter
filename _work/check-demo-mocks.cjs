/**
 * 校验 demo-mocks 的注册键是否与 data 里的示例标题逐一对应
 *
 * 键格式 `slug::示例标题`。写错一个字就会静默回落到组件默认 mock，
 * 也就是「所有示例图都一样」——正是要避免的问题，所以必须机器校验。
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data', 'components');
const MOCKS = path.join(__dirname, '..', 'src', 'components', 'demo-mocks.tsx');

// ── 1. 从 data 收集真实存在的 (slug, title) ──
const real = new Set();
const perComp = {};

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.ts')) continue;
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');

  // 组件按 `slug: 'xxx',` 切段
  const slugRe = /slug:\s*'([^']+)'/g;
  const marks = [];
  let m;
  while ((m = slugRe.exec(src))) marks.push({ slug: m[1], at: m.index });
  marks.push({ slug: null, at: src.length });

  for (let i = 0; i < marks.length - 1; i++) {
    const seg = src.slice(marks[i].at, marks[i + 1].at);
    const titles = [...seg.matchAll(/(?:^|\s)title:\s*'((?:[^'\\]|\\.)*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    );
    // 只取 demos 数组里的 title —— demos 之后才出现的是示例标题
    const demosAt = seg.indexOf('demos:');
    const segDemos = demosAt >= 0 ? seg.slice(demosAt) : '';
    const demoTitles = [...segDemos.matchAll(/title:\s*'((?:[^'\\]|\\.)*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    );
    if (!demoTitles.length) continue;
    perComp[marks[i].slug] = demoTitles;
    for (const t of demoTitles) real.add(`${marks[i].slug}::${t}`);
  }
}

// ── 2. 从 demo-mocks.tsx 收集注册键 ──
const mk = fs.readFileSync(MOCKS, 'utf8');
const keys = [...mk.matchAll(/^\s*'([a-z0-9-]+::(?:[^'\\]|\\.)*)':\s*\(\)/gm)].map((x) =>
  x[1].replace(/\\'/g, "'"),
);

console.log(`data 里共 ${real.size} 个示例，分布在 ${Object.keys(perComp).length} 个组件`);
console.log(`demo-mocks 注册了 ${keys.length} 个示例专属图形\n`);

const problems = [];

// 注册了但 data 里不存在 → 大概率是标题写错了
for (const k of keys) {
  if (!real.has(k)) problems.push(`注册键对不上任何示例（标题可能写错）：${k}`);
}

// ── 3. 统计覆盖率：哪些组件的示例还没做差异化 ──
const REG = new Set(keys);
const uncovered = [];
let covTotal = 0;
let covHit = 0;
for (const [slug, titles] of Object.entries(perComp)) {
  const hit = titles.filter((t) => REG.has(`${slug}::${t}`));
  covTotal += titles.length;
  covHit += hit.length;
  if (titles.length > 1 && hit.length < titles.length) {
    uncovered.push({ slug, miss: titles.filter((t) => !REG.has(`${slug}::${t}`)) });
  }
}

console.log(
  `示例级图形覆盖：${covHit} / ${covTotal}（${((covHit / covTotal) * 100).toFixed(1)}%）`,
);
if (uncovered.length) {
  console.log(`\n还有 ${uncovered.length} 个组件的示例未完全差异化（会回落到组件默认图）：`);
  for (const u of uncovered.slice(0, 40)) {
    console.log(`  ${u.slug}: ${u.miss.join(' | ')}`);
  }
  if (uncovered.length > 40) console.log(`  … 另有 ${uncovered.length - 40} 个`);
}

if (problems.length) {
  console.log('\n问题:');
  for (const p of problems) console.log('  ✗ ' + p);
  process.exit(1);
}
console.log('\n✓ 所有注册键都能对应到真实示例');
