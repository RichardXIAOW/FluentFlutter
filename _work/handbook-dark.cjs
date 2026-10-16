/**
 * 工程化手册（public/handbook/index.html）的深色主题适配。
 *
 * 这是一份独立 HTML（站内用 iframe 承载），不经过 Tailwind。它内部已经用
 * CSS 变量做了一层抽象，所以做法是：
 *   1. 把正文里写死的颜色换回变量（只在 :root 块**之后**替换，避免改坏定义）
 *   2. 在 :root 里补齐新变量的浅色值
 *   3. 紧跟 :root 加一段 html.dark 的变量覆盖
 *   4. <head> 里加防闪烁引导脚本 + storage 监听
 *      —— iframe 与站点同源，能直接读到父页写在 localStorage 里的 ff-theme，
 *         所以切主题时 iframe 会跟着变（storage 事件跨文档触发）。
 *
 * 用法：node _work/handbook-dark.cjs [--dry]
 * 注意：用户若用新版 handbook 覆盖本文件，此脚本需重跑（README 有记录）。
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'public', 'handbook', 'index.html');
const dry = process.argv.includes('--dry');

const src = fs.readFileSync(FILE, 'utf8');

/* ── 1. 定位 :root 块结束位置 ── */
const rootStart = src.indexOf(':root');
if (rootStart < 0) {
  console.error('找不到 :root');
  process.exit(1);
}
const rootEnd = src.indexOf('}', rootStart) + 1;
const head = src.slice(0, rootEnd); // 含 :root{...}
let rest = src.slice(rootEnd);

/* ── 2. :root 补新变量的浅色值 ── */
const EXTRA_LIGHT = `
  /* 主题扩展（浅色） */
  --topbar:rgba(255,255,255,.92);
  --acc-deep:#2b85c8;
  --code-bg:#f6f8fa; --code-tx:#24292f;
  --skw:#cf222e; --sstr:#0a3069; --snum:#0550ae; --scom:#6e7781;
  --sfn:#8250df; --styp:#953800; --sann:#0969da;
`;

let newHead = head.replace(/\n\}$/, `\n${EXTRA_LIGHT}}\n`);
if (newHead === head) {
  // 兜底：:root 结尾格式不同就直接插在 } 前
  newHead = head.slice(0, -1) + EXTRA_LIGHT + '}';
}
// 主色从 Element 蓝换成站点的青蓝
newHead = newHead.replace('--acc:#409eff;', '--acc:#0891b2;');

/* ── 3. 正文写死颜色 → 变量（顺序敏感：长的先换） ── */
const RULES = [
  ['rgba(255,255,255,.92)', 'var(--topbar)'],
  ['rgba(64,158,255,', 'rgb(8 145 178 /'], // 蓝色 tint → 新主色 tint（alpha 原样保留）
  ['#f8f9fb', 'var(--code-bg)'],
  ['#24292f', 'var(--code-tx)'],
  ['#cf222e', 'var(--skw)'],
  ['#0a3069', 'var(--sstr)'],
  ['#0550ae', 'var(--snum)'],
  ['#6e7781', 'var(--scom)'],
  ['#8250df', 'var(--sfn)'],
  ['#953800', 'var(--styp)'],
  ['#0969da', 'var(--sann)'],
  ['#ffffff', 'var(--panel)'],
  ['#fff;', 'var(--panel);'],
  ['#1f2328', 'var(--tx)'],
  ['#4a5058', 'var(--tx2)'],
  ['#606266', 'var(--tx2)'],
  ['#8a9099', 'var(--tx3)'],
  ['#a8abb2', 'var(--tx3)'],
  ['#dcdfe6', 'var(--line2)'],
  ['#e4e7ed', 'var(--line)'],
  ['#409eff', 'var(--acc)'],
  ['#337ecc', 'var(--acc-deep)'],
  ['#f56c6c', 'var(--bad)'],
];

const tally = {};
for (const [from, to] of RULES) {
  const parts = rest.split(from);
  const n = parts.length - 1;
  if (n) {
    rest = parts.join(to);
    tally[`${from} → ${to}`] = n;
  }
}

/* ── 4. html.dark 变量覆盖 ── */
const DARK = `
/* ---------- 深色主题 ---------- */
html.dark{
  --bg:#0b0f16; --bg2:#0f141c; --panel:#141a23; --panel2:#1a212b;
  --line:#232a35; --line2:#2e3644;
  --tx:#f3f7fb; --tx2:#c9d3de; --tx3:#93a0b0;
  --acc:#22d3ee; --acc2:#4ade80; --warn:#fbbf24; --bad:#f87171; --info:#94a3b8;
  --topbar:rgba(15,20,28,.88);
  --acc-deep:#67e8f9;
  --code-bg:#0f141c; --code-tx:#e6edf3;
  --skw:#ff7b72; --sstr:#a5d6ff; --snum:#79c0ff; --scom:#8b949e;
  --sfn:#d2a8ff; --styp:#ffa657; --sann:#79c0ff;
}
html.dark ::selection{background:rgba(34,211,238,.28)}
`;

/* ── 5. 引导脚本（与站点 layout.tsx 的逻辑一致）── */
const BOOT = `<script>
/* 主题引导：与站点同源，直接读父页写好的偏好；storage 事件让父页切换时这里跟着变 */
(function(){
  function apply(){
    var s=null;try{s=localStorage.getItem('ff-theme')}catch(e){}
    var dark;
    if(s==='light')dark=false;
    else if(s==='dark')dark=true;
    else if(s==='system')dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
    else dark=true;
    document.documentElement.classList.toggle('dark',dark);
  }
  apply();
  try{window.addEventListener('storage',function(e){if(!e.key||e.key==='ff-theme')apply()})}catch(e){}
})();
</script>
</body>`;

let out = newHead + '\n' + DARK + rest;
out = out.replace(/<\/body>/, BOOT);

if (!dry) fs.writeFileSync(FILE, out);

console.log('── 替换统计 ──');
for (const [k, n] of Object.entries(tally).sort((a, b) => b[1] - a[1]))
  console.log(`${String(n).padStart(4)}  ${k}`);
const total = Object.values(tally).reduce((a, b) => a + b, 0);
console.log(`\n合计 ${total} 处${dry ? '（dry-run，未写入）' : '（已写入）'}`);
