/**
 * 主题化改造：清除会阻碍深色主题的硬编码颜色
 *
 * 关键区分（不是无脑全局替换）：
 *   - bg-white（实色）           = 卡片/浮层「面」 → bg-surface
 *   - bg-white/95 /85 /80 /70    = 半透明面        → bg-surface/NN
 *   - bg-white/40 /25 /15        = 叠在**彩色/深色**元素上的浅色覆盖层（涟漪、角标、骨架）
 *                                  → 保留白色，否则在深色下会变成一块灰斑
 *   - macOS 红绿灯 #ff5f57/#febc2e/#28c840 = 代码块窗口按钮，两个主题都要真实色 → 保留
 *   - #2c3038 / #1f2328          = 深色 SnackBar / Tooltip 底，本来就该深 → 保留
 *   - #0d1b2a（叠在 brand-400 亮青上的文字）→ 亮青两主题都不变，深色文字始终正确 → 保留
 *
 * 用法：node _work/theme-tokens.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const dry = process.argv.includes('--dry');

/** 按顺序应用，先具体后笼统 */
const RULES = [
  // 骨架条：必须放在 bg-white/NN 之前，否则会被换成几乎看不见的面色
  ['rounded bg-white/80', 'rounded bg-ink-200'],

  // 光环（头像/滑块圆点叠在面上）
  ['ring-white', 'ring-surface'],

  // 半透明面
  ['hover:bg-white/70', 'hover:bg-surface/70'],
  ['bg-white/95', 'bg-surface/95'],
  ['bg-white/85', 'bg-surface/85'],
  ['bg-white/80', 'bg-surface/80'],
  ['bg-white/70', 'bg-surface/70'],

  // 实色面
  ['bg-white', 'bg-surface'],

  // ── mock 里的 Material 3 色调容器 → 走 brand token，随主题翻转 ──
  ['bg-[#e8f1fd]', 'bg-brand-50'],
  ['bg-[#eef4fc]', 'bg-brand-50'],
  ['bg-[#dceafb]', 'bg-brand-100'],
  ['bg-[#d3e5fa]', 'bg-brand-100'],
  ['bg-[#e1ebf8]', 'bg-brand-100'],
  ['text-[#1e4e84]', 'text-brand-800'],
  ['ring-[#eef4fc]', 'ring-brand-50'],
  ['ring-[#a8c9ee]', 'ring-brand-200'],

  // 语义色
  ['text-[#3d7a4a]', 'text-ok'],
  ['text-[#529b2e]', 'text-ok'],
  ['bg-[#3d7a4a]', 'bg-ok'],
  ['text-[#a06a10]', 'text-warn'],
  ['text-[#7fb8f7]', 'text-brand-300'],

  // 代码区底
  ['bg-[#f8f9fb]', 'bg-subtle'],
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

const tally = {};
let filesChanged = 0;

for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, 'utf8');
  let out = src;
  for (const [from, to] of RULES) {
    const parts = out.split(from);
    const n = parts.length - 1;
    if (n > 0) {
      out = parts.join(to);
      const key = `${from}  →  ${to}`;
      tally[key] = (tally[key] || 0) + n;
    }
  }
  if (out !== src) {
    if (!dry) fs.writeFileSync(file, out);
    filesChanged += 1;
  }
}

const rows = Object.entries(tally).sort((a, b) => b[1] - a[1]);
for (const [k, n] of rows) console.log(`${String(n).padStart(4)}  ${k}`);
const total = rows.reduce((s, [, n]) => s + n, 0);
console.log(
  `\n合计 ${total} 处，涉及 ${filesChanged} 个文件${dry ? '（dry-run，未写入）' : '（已写入）'}`,
);
