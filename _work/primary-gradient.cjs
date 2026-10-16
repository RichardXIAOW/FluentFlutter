/**
 * 主按钮改用「主题安全的实心色 / 渐变」。
 *
 * 原因：原来 73 处是 `bg-brand-500 text-white`。深色主题下 brand-500 是亮青
 * #22d3ee（这是有意的——亮色强调色在深色底上做文字/图标才对），但白字压在上面
 * 对比度只有 1.8:1。所以凡「实心主色 + 白字」的组合统一切掉：
 *   - 站点 chrome（按钮、CTA）→ bg-grad-brand（青蓝→紫渐变，两端都够深）
 *   - mock 三件套            → bg-solid（Material 3 的 FilledButton 是实色，
 *                              用渐变会失真，所以只换更深的实心 token）
 *
 * 只处理**同一个 className 字符串里同时含 bg-brand-500 与 text-white** 的情况；
 * 纯装饰性的 bg-brand-500（进度条、指示点、色块）保持不动 —— 它们在深色下
 * 就该是亮青色。
 *
 * hover:bg-brand-600 对渐变无效（background-image 盖住 background-color），
 * 换成对整块做亮度的 hover:brightness-110；对实色也一样适用。
 *
 * 用法：node _work/primary-gradient.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const MOCKS = new Set(['demo-mocks.tsx', 'mocks.tsx', 'mock-kit.tsx']);
const dry = process.argv.includes('--dry');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

/** 找到 pos 所在的引号串边界（class 串一定是被引号包住的） */
function stringBounds(s, pos) {
  let start = -1;
  for (let i = pos; i >= 0; i -= 1) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      start = i;
      break;
    }
    if (c === '\n') break; // 跨行了说明判断失误，放弃
  }
  if (start < 0) return null;
  const quote = s[start];
  let end = -1;
  for (let i = pos; i < s.length; i += 1) {
    if (s[i] === quote && s[i - 1] !== '\\') {
      end = i;
      break;
    }
    if (s[i] === '\n') break;
  }
  if (end < 0) return null;
  return [start + 1, end];
}

let converted = 0;
let brandsTouched = 0;
const files = [];

for (const file of walk(SRC)) {
  let src = fs.readFileSync(file, 'utf8');
  const chunks = new Map(); // 引号串范围 → 新内容
  const re = /bg-brand-500/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const b = stringBounds(src, m.index);
    if (!b) continue;
    const [a, z] = b;
    const key = `${a}-${z}`;
    if (chunks.has(key)) continue;
    chunks.set(key, src.slice(a, z));
  }

  let hits = 0;
  // 从后往前替换，避免偏移失效
  const spans = [...chunks.keys()]
    .map((k) => k.split('-').map(Number))
    .sort((p, q) => q[0] - p[0]);

  for (const [a, z] of spans) {
    const body = src.slice(a, z);
    if (!/text-white/.test(body)) continue;
    if (!/bg-brand-500/.test(body)) continue;
    const isMock = MOCKS.has(path.basename(file));
    let next = body.replace(/bg-brand-500/g, isMock ? 'bg-solid' : 'bg-grad-brand');
    // 渐变不吃 background-color 的 hover，换成亮度
    next = next.replace(/hover:bg-brand-600/g, 'hover:brightness-110');
    next = next.replace(/hover:bg-brand-500/g, 'hover:brightness-110');
    next = next.replace(/\s{2,}/g, ' ');
    if (next !== body) {
      src = src.slice(0, a) + next + src.slice(z);
      hits += 1;
      brandsTouched += (body.match(/bg-brand-500/g) || []).length;
    }
  }

  if (hits) {
    if (!dry) fs.writeFileSync(file, src);
    converted += hits;
    files.push(`${String(hits).padStart(3)} 处  ${path.relative(SRC, file)}`);
  }
}

console.log(files.sort().join('\n'));
console.log(
  `\n替换 ${converted} 个 class 串（涉及 ${brandsTouched} 个 bg-brand-500）${dry ? '（dry-run）' : '（已写入）'}`,
);
