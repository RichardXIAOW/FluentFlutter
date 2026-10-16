/* handbook 独立调色板的对比度修正
 *
 * handbook/index.html 是独立文档，有自己的 :root 变量层，不跟随站点 tailwind 色板。
 * 它的浅色语义色全是 Element Plus 原色，做文字用时全部不达 AA：
 *   --acc  #0891b2  3.68:1   （链接、h2 标签、目录高亮）
 *   --acc2 #529b2e  3.45:1   （行内代码、callout 强调、checkbox）
 *   --warn #e6a23c  2.19:1   （callout.warn b / pill.y 文字）
 *   --bad  #f56c6c  2.90:1   （callout.bad b / pill.r 文字 / SVG 文字）
 *   --info #3a8ee6  3.39:1   （callout.why b）
 *   --tx3  #8a9099  3.24:1   （行号、说明文字）
 *
 * 只改 :root 里的浅色值；html.dark 段是亮色配深底，本来就达标，保持不动。
 * 用法: node _work/handbook-contrast.cjs
 */
const fs = require('fs');

const FILE = 'public/handbook/index.html';
const MAP = [
  ['--acc:#0891b2', '--acc:#0e7490'],
  ['--acc2:#529b2e', '--acc2:#3d7a4a'],
  ['--warn:#e6a23c', '--warn:#a06a10'],
  ['--bad:#f56c6c', '--bad:#c0392b'],
  ['--info:#3a8ee6', '--info:#1d6fb8'],
  ['--acc-deep:#2b85c8', '--acc-deep:#155e75'],
  ['--tx3:#8a9099', '--tx3:#6b7280'],
];

let html = fs.readFileSync(FILE, 'utf8');
const head =
  html.indexOf(':root{') >= 0 ? html.indexOf(':root{') : html.indexOf(':root {');
const dark = html.indexOf('html.dark{') >= 0 ? html.indexOf('html.dark{') : html.indexOf('html.dark {');
if (head < 0 || dark < 0 || dark < head) throw new Error('定位 :root / html.dark 失败');

// 三段：head 之前 / 浅色段 / 深色段起。务必三段拼回，漏掉 prefix 会把
// <!DOCTYPE>…<style> 整段吃掉（本脚本初版就踩过这个坑）。
const prefix = html.slice(0, head);

// 只在浅色段内替换
let lightPart = html.slice(head, dark);
const darkPart = html.slice(dark);

let n = 0;
for (const [from, to] of MAP) {
  const c = lightPart.split(from).length - 1;
  if (c !== 1) {
    console.log(`  ! ${from.padEnd(22)} 命中 ${c} 次（期望 1），跳过`);
    continue;
  }
  lightPart = lightPart.replace(from, to);
  n++;
  console.log(`  ✓ ${from.padEnd(22)} →  ${to}`);
}

// 之前把站点的品牌青搬进来时留下了 rgb(8 145 178 /…) 的半透明装饰，
// 一并跟到新的 --acc，否则描边与文字不同色
const before = lightPart.split('rgb(8 145 178 /').length - 1;
if (before) {
  lightPart = lightPart.split('rgb(8 145 178 /').join('rgb(14 116 144 /');
  console.log(`  ✓ rgb(8 145 178 /…) → rgb(14 116 144 /…)   ${before} 处`);
  n += before;
}
const beforeDark = darkPart.split('rgb(8 145 178 /').length - 1;
const darkFixed = beforeDark
  ? darkPart.split('rgb(8 145 178 /').join('rgb(34 211 238 /')
  : darkPart;
if (beforeDark) {
  console.log(`  ✓ 深色段 rgb(8 145 178 /…) → rgb(34 211 238 /…)   ${beforeDark} 处`);
  n += beforeDark;
}

fs.writeFileSync(FILE, prefix + lightPart + darkFixed, 'utf8');
console.log(`\n共 ${n} 处替换 → ${FILE}`);
console.log(`文件头保留检查: ${prefix.startsWith('<!DOCTYPE') ? '✓ 完整' : '✗ 异常'}`);
