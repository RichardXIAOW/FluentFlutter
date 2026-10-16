/* 浅色主题中性色阶重排 —— 计算并校验 WCAG
 * 问题：slate-400 (#94a3b8) 在白底仅 2.56:1，而 text-ink-400 有 169 处调用
 * 结论：要保住 6 级文字层次且每级都过 AA，整条 400..900 必须重排
 * 用法: node _work/ink-ramp.cjs
 */
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
const show = (label, fg, bg) => {
  const r = ratio(fg, bg);
  const tag = r >= 4.5 ? 'AA✓  ' : r >= 3 ? '大字号' : 'FAIL ';
  console.log(`  ${label.padEnd(28)} ${fg.padEnd(9)} ${r.toFixed(2)}:1  ${tag}`);
};

console.log('\n【方案 A】整条下移一格（Tailwind slate 500→400, 600→500 …）');
const A = {
  400: '#64748b', 500: '#475569', 600: '#334155',
  700: '#1e293b', 800: '#0f172a', 900: '#020617',
};
const B = {
  400: '#64748b', 500: '#4b5a6e', 600: '#38465a',
  700: '#2b3747', 800: '#1c2634', 900: '#0b1220',
};
for (const [k, name] of [['A', '方案 A'], ['B', '方案 B（保守，900 不压到近黑）']]) {
  const ramp = k === 'A' ? A : B;
  console.log(`\n── ${name} ──`);
  for (const step of [400, 500, 600, 700, 800, 900]) {
    const c = ramp[step];
    const onWhite = ratio(c, '#ffffff');
    const onF8 = ratio(c, '#f8fafc');
    const onF1 = ratio(c, '#f1f5f9');
    console.log(
      `  ink-${step}  ${c}  白底 ${onWhite.toFixed(2)}  底#f8fafc ${onF8.toFixed(
        2,
      )}  底#f1f5f9 ${onF1.toFixed(2)}`,
    );
  }
}

console.log('\n── 现状（对照）──');
for (const [step, c] of [
  [400, '#94a3b8'], [500, '#64748b'], [600, '#475569'],
  [700, '#334155'], [800, '#1e293b'], [900, '#0f172a'],
]) {
  console.log(`  ink-${step}  ${c}  白底 ${ratio(c, '#ffffff').toFixed(2)}`);
}

console.log('\n── 深色主题复核（卡片 #141a23 / 页面 #0b0f16）──');
for (const [step, c] of [
  [400, '#7c8698'], [500, '#93a0b0'], [600, '#a8b4c2'],
  [700, '#c3cdd8'], [800, '#dde5ed'], [900, '#f3f7fb'],
]) {
  console.log(
    `  ink-${step}  ${c}  卡片 ${ratio(c, '#141a23').toFixed(2)}  页面 ${ratio(
      c,
      '#0b0f16',
    ).toFixed(2)}`,
  );
}

console.log('\n── 青蓝文字链（浅色）──');
show('brand-500 现', '#06b6d4', '#ffffff');
show('brand-600 新', '#0e7490', '#ffffff');
show('brand-700 新', '#155e75', '#ffffff');
show('brand-800 新', '#164e63', '#ffffff');
show('白字 on --solid 新', '#ffffff', '#0e7490');
show('白字 on --grad-from 新', '#ffffff', '#0e7490');
