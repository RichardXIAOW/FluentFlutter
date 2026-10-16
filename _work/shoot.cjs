/* 无头 Edge 批量截图（双主题）
 * 用法: node _work/shoot.cjs <port> <outPrefix>
 *   node _work/shoot.cjs 3415 _
 * 主题通过 public/__set-theme.html 预置 localStorage['ff-theme'] 后跳转实现。
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || '3415';
const PREFIX = process.argv[3] || '';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join('_work', 'shots');
const BASE = `http://127.0.0.1:${PORT}`;

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', '/', 1920, 1900],
  ['dart', '/resources/dart', 1920, 1500],
  ['flutter', '/resources/flutter', 1920, 1500],
  ['grid', '/components', 1920, 1750],
  ['comp', '/components/filled-button', 1920, 2100],
  ['guide', '/guide', 1920, 1500],
  ['res', '/resources', 1920, 1400],
  ['hb', '/handbook', 1920, 1500],
  ['narrow', '/components', 1366, 1500],
  ['404', '/no-such-page', 1366, 900],
];

const only = process.env.ONLY;
for (const theme of ['dark', 'light']) {
  for (const [name, url, w, h] of PAGES) {
    if (only && !only.split(',').includes(name)) continue;
    // 必须给绝对路径：Edge 不按调用方的 CWD 解析 --screenshot 的相对路径
    const file = path.resolve(OUT, `${PREFIX}${theme === 'dark' ? 'dk' : 'lt'}-${name}.png`);
    const target = `${BASE}/__set-theme.html?t=${theme}&to=${encodeURIComponent(url)}`;
    const r = spawnSync(
      EDGE,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        // handbook 页的 iframe 是异步注入的，--screenshot 默认在 load 即拍会拍到骨架屏；
        // 虚拟时间预算让 Edge 把定时器快进跑完再拍
        '--virtual-time-budget=9000',
        `--window-size=${w},${h}`,
        `--screenshot=${file}`,
        target,
      ],
      { stdio: 'ignore', timeout: 90000 },
    );
    const ok = fs.existsSync(file);
    console.log(`  ${ok ? '✓' : '✗'} ${theme.padEnd(5)} ${name.padEnd(8)} ${w}x${h}  ${file}`);
    if (!ok) console.log(`    exit=${r.status} ${r.error ? r.error.message : ''}`);
  }
}
console.log('\n截图目录: ' + OUT);
