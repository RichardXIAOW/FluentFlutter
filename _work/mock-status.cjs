/**
 * 示例级图形覆盖状态
 *
 * 校验 demo-mocks.tsx 的注册键 `slug::标题` 是否与 data 里真实的示例标题一致。
 * 写错一个字 → 静默回落到组件默认 mock → 就是「所有示例图都一样」那个 bug，
 * 所以必须机器校验。
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data', 'components');
const MOCKS = path.join(__dirname, '..', 'src', 'components', 'demo-mocks.tsx');

// ── 1. 收集真实 (slug, 标题) ──
/* 关键：先把模板字符串整段遮蔽成 \u0000，再去找 title: '...'。
 * 否则 Dart 代码里的 MaterialApp(title: 'PulseShop') 会被误当成示例标题 ——
 * 既凭空多出一个「示例」，又让注册表里对应的孤儿键看起来是合法的。 */
function maskTemplates(s) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === '`') {
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '\\') { j += 2; continue; }
        if (s[j] === '`') break;
        j++;
      }
      out += '`' + '\u0000'.repeat(Math.max(0, j - i - 1)) + '`';
      i = j + 1;
    } else {
      out += s[i];
      i++;
    }
  }
  return out;
}

const perComp = {};
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.ts')) continue;
  const src = maskTemplates(fs.readFileSync(path.join(DIR, f), 'utf8'));
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
    if (titles.length) perComp[marks[i].slug] = titles;
  }
}

const real = new Set();
let total = 0;
for (const [slug, titles] of Object.entries(perComp)) {
  for (const t of titles) {
    real.add(`${slug}::${t}`);
    total += 1;
  }
}

// ── 2. 收集注册键 ──
const mk = fs.readFileSync(MOCKS, 'utf8');
const keys = [...mk.matchAll(/^\s{2}'([a-z0-9-]+::(?:[^'\\]|\\.)*)':\s*\(\)/gm)].map((x) =>
  x[1].replace(/\\'/g, "'"),
);

console.log(`真实示例：${total} 个，分布在 ${Object.keys(perComp).length} 个组件`);
console.log(`已注册示例专属图形：${keys.length} 个\n`);

const REG = new Set(keys);
const bad = keys.filter((k) => !real.has(k));

let hit = 0;
const missing = [];
for (const [slug, titles] of Object.entries(perComp)) {
  const miss = titles.filter((t) => !REG.has(`${slug}::${t}`));
  hit += titles.length - miss.length;
  if (miss.length) missing.push({ slug, miss, of: titles.length });
}

console.log(
  `覆盖率：${hit}/${total}（${((hit / total) * 100).toFixed(1)}%）\n`,
);

if (missing.length) {
  console.log(`未差异化的组件（这些示例会回落到组件默认图）：`);
  for (const u of missing) {
    console.log(`  ${u.slug} (${u.of - u.miss.length}/${u.of})`);
  }
  console.log('');
}

if (bad.length) {
  console.log(`❌ 有 ${bad.length} 个注册键对不上真实标题（标题写错了）：`);
  for (const b of bad) console.log('   ' + b);
  process.exit(1);
}

console.log('✓ 所有注册键都能对应到真实示例');
if (missing.length) process.exit(2);
