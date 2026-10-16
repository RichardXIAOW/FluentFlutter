/**
 * 全局字号提升（一次性迁移脚本）
 *
 * 背景：全站 700+ 处硬编码 text-[Npx]，多数在 9–13.5px，观感是「75% 缩放」。
 * 逐个手改必漏，且会破坏相对层级 —— 所以用脚本做**系统性平移**：
 *   - 站点骨架（除 mock 外的所有 .tsx/.ts）：N ≤ 33 → +3px；N > 33 → +4px
 *     （统一增量 = 相对层级逐字保留，只有绝对尺寸变大，不会产生新的排版失衡）
 *   - mock 三文件（demo-mocks / mocks / mock-kit）：+2px —— 它们是「设备仿真画布」，
 *     涨太多会溢出固定框；同时把 ≥40px 的固定高度、≥200px 的固定宽度 ×1.16，
 *     让容器和文字同比放大，避免换行变多后撑破。
 *
 * 用法：node _work/rescale-type.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const MOCKS = new Set(['demo-mocks.tsx', 'mocks.tsx', 'mock-kit.tsx']);
const dry = process.argv.includes('--dry');

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/** 骨架：+3 / 大字号 +4 */
function chromeSize(n) {
  return n <= 33 ? n + 3 : n + 4;
}
/** mock：+2 */
function mockSize(n) {
  return n + 2;
}
/** mock 容器：×1.16 */
function mockBox(n) {
  return Math.round(n * 1.16);
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(SRC).filter((p) => !p.includes(`${path.sep}data${path.sep}`) || true);
let totalText = 0;
let totalBox = 0;
const report = [];

for (const file of files) {
  const base = path.basename(file);
  const isMock = MOCKS.has(base);
  const src = fs.readFileSync(file, 'utf8');
  let textN = 0;
  let boxN = 0;

  let out = src.replace(/text-\[([0-9.]+)px\]/g, (m, num) => {
    const n = parseFloat(num);
    const next = fmt(isMock ? mockSize(n) : chromeSize(n));
    if (next === num) return m;
    textN += 1;
    return `text-[${next}px]`;
  });

  if (isMock) {
    // 固定高度 ≥40 放大 1.16（<40 是旋钮/细条，不动）
    out = out.replace(/h-\[([0-9]+)px\]/g, (m, num) => {
      const n = parseInt(num, 10);
      if (n < 40) return m;
      const next = String(mockBox(n));
      if (next === num) return m;
      boxN += 1;
      return `h-[${next}px]`;
    });
    // 宽度只放大 ≥200 的画布框（<200 的控件宽度不动，避免开关等比例控件错位）
    out = out.replace(/(?<![a-z-])w-\[([0-9]+)px\]/g, (m, num) => {
      const n = parseInt(num, 10);
      if (n < 200) return m;
      const next = String(mockBox(n));
      if (next === num) return m;
      boxN += 1;
      return `w-[${next}px]`;
    });
  }

  if (textN || boxN) {
    if (!dry) fs.writeFileSync(file, out);
    report.push(`${String(textN).padStart(4)} 字号 ${String(boxN).padStart(3)} 容器  ${path.relative(SRC, file)}`);
    totalText += textN;
    totalBox += boxN;
  }
}

console.log(report.sort().join('\n'));
console.log(`\n合计：字号 ${totalText} 处，容器 ${totalBox} 处 ${dry ? '（dry-run，未写入）' : '（已写入）'}`);
