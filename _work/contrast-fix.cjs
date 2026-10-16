/* 对比度体检 + 候选值搜索
 * 用法: node _work/contrast-fix.cjs
 */
const fs = require('fs');
const path = require('path');

const hex = (h) => {
  h = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (rgb) => {
  const c = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const l1 = lum(hex(a));
  const l2 = lum(hex(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const p = (label, fg, bg) => {
  const r = ratio(fg, bg);
  console.log(
    `  ${label.padEnd(34)} ${fg}   ${r.toFixed(2)}:1  ${
      r >= 4.5 ? 'AA✓' : r >= 3 ? 'AA大字号' : 'FAIL'
    }`,
  );
};

console.log('\n── 候选值搜索：浅色主题 meta 文字（白底 #ffffff）──');
const cands = [
  '#64748b', '#6b7b90', '#70809a', '#748499', '#7a8a9e',
  '#7c8ba1', '#8091a5', '#8494a8', '#8898ab', '#8a9aad',
];
for (const c of cands) p(c, c, '#ffffff');

console.log('\n── 浅色主题：青蓝文字链（白底 / 淡底）──');
for (const c of ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63']) {
  p(`${c} on white`, c, '#ffffff');
}
p('#0e7490 on brand-50', '#0e7490', '#ecfeff');
p('#155e75 on brand-50', '#155e75', '#ecfeff');

console.log('\n── 浅色主题：渐变按钮白字（浅端决定下限）──');
for (const c of ['#0891b2', '#0e7490', '#155e75']) p(`white on ${c}`, '#ffffff', c);
p('white on #4f46e5 (accent-600)', '#ffffff', '#4f46e5');

console.log('\n── 深色主题（卡片 #141a23）不改动，仅复核 ──');
for (const c of ['#f3f7fb', '#93a0b0', '#7c8698', '#22d3ee', '#0e7490']) {
  p(`${c} on card`, c, '#141a23');
}
p('dark text on #155e75 (solid)', '#f3f7fb', '#155e75');

console.log('\n── 调用点统计 ──');
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.tsx?$/.test(e.name)) out.push(f);
  }
  return out;
};
const files = walk('src');
for (const tok of ['text-brand-500', 'text-brand-600', 'text-brand-700', 'text-ink-400']) {
  let n = 0;
  for (const f of files) n += (fs.readFileSync(f, 'utf8').match(new RegExp(tok, 'g')) || []).length;
  console.log(`  ${tok.padEnd(20)} ${n}`);
}
