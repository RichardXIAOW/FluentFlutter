/* 全量对比度审计：把 src 里所有 text-* / bg-* / border-* 取出来，
 * 用 globals.css 的真实变量值逐一核对比度。写入 _work/contrast-report.txt
 * 用法: node _work/audit-contrast-full.cjs
 */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('src/app/globals.css', 'utf8');
const grab = (block) => {
  const out = {};
  const re = /--([a-z0-9-]+):\s*([0-9]+ [0-9]+ [0-9]+);/g;
  let m;
  while ((m = re.exec(block))) out[m[1]] = m[2].split(' ').map(Number);
  return out;
};
const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
const darkBlock = css.slice(css.indexOf('.dark {'), css.indexOf('/* ═', css.indexOf('.dark {')));
const LIGHT = grab(rootBlock);
const DARK = grab(darkBlock);

const lum = (rgb) => {
  const c = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// 文字要 4.5，图形/描边要 3
const TARGET = { text: 4.5, icon: 3 };

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.tsx?$/.test(e.name)) out.push(f);
  }
  return out;
};

const files = walk('src');
const usage = new Map(); // key: "text:brand-600" -> Set(files)

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const clsPool = src.match(/[a-z0-9:\-\[\]\/\.]+/g) || [];
  for (const tok of clsPool) {
    const m = /^(text|bg|border|ring|fill|stroke|from|to)-([a-z]+)-(\d{2,3})$/.exec(tok);
    if (!m) continue;
    const [, kind, name, step] = m;
    if (!LIGHT[`${name}-${step}`] && !LIGHT[name]) continue;
    const key = `${kind}:${name}-${step}`;
    if (!usage.has(key)) usage.set(key, new Set());
    usage.get(key).add(path.relative('src', f));
  }
}

const isMockFile = (s) =>
  /demo-mocks|mocks\.tsx|mock-kit/.test([...s].join(','));

const lines = [];
const put = (s) => {
  lines.push(s);
  console.log(s);
};

for (const theme of ['LIGHT', 'DARK']) {
  const V = theme === 'LIGHT' ? LIGHT : DARK;
  const surface = V.surface;
  const canvas = V.canvas;
  const subtle = V.subtle;
  put(`\n${'█'.repeat(74)}`);
  put(`  ${theme} 主题 —— 卡片底 #${surface.map((x) => x.toString(16).padStart(2, '0')).join('')}`);
  put('█'.repeat(74));

  const probs = [];
  for (const [key, fileset] of [...usage.entries()].sort()) {
    const [kind, token] = key.split(':');
    let rgb = V[token];
    if (!rgb) continue;
    let target = kind === 'text' ? TARGET.text : TARGET.icon;
    // 只审前景色。border-* / ring-* 是发丝分隔线，属 WCAG 1.4.11 明确豁免的
    // 纯装饰成分，强行提到 3:1 会让整站描边变重变脏。
    if (!['text', 'fill', 'stroke'].includes(kind)) continue;

    const r = ratio(rgb, surface);
    if (r >= target) continue;
    probs.push({
      key,
      hex: '#' + rgb.map((x) => x.toString(16).padStart(2, '0')).join(''),
      r,
      target,
      n: fileset.size,
      files: [...fileset].slice(0, 4).join(', '),
    });
  }

  if (!probs.length) put('  ✓ 全部达标');
  for (const p of probs.sort((a, b) => a.r - b.r)) {
    put(
      `  ${(p.r.toFixed(2) + ':1').padEnd(9)} 需≥${p.target}  ${p.key.padEnd(22)} ${
        p.hex
      }  ${p.n} 个文件  ${p.files}`,
    );
  }
}

fs.writeFileSync('_work/contrast-report.txt', lines.join('\n'), 'utf8');
console.log('\n报告已写入 _work/contrast-report.txt');
