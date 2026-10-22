/**
 * 锚点完整性巡检
 *
 * 检查页面里所有 href="#xxx" 都有对应的 id="xxx"。
 * 侧栏导航、教程目录都是动态生成锚点的，这类代码最容易出的 bug 就是
 * 「锚点指向一个不存在的位置」—— 页面不会报错，只是点了没反应。
 *
 * 覆盖范围：67 个组件详情页 + 关键静态页（首页/指南/资源/两个教程页）。
 */
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:3399';
const appDir = path.join(__dirname, '..', '.next', 'server', 'app', 'components');

const componentSlugs = fs
  .readdirSync(appDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''))
  // Next 会为 [slug] 生成一个「未知路径」兜底产物，名字取决于最后一次
  // 被访问过的无效 slug。它不是真实组件，巡检时要跳过。
  .filter((s) => !s.startsWith('__'));

const routes = [
  ...componentSlugs.map((s) => `/components/${s}`),
  '/',
  '/guide',
  '/resources',
  '/resources/dart',
  '/resources/flutter',
  '/resources/basic',
  '/components',
];

const problems = [];
let checkedPages = 0;
let checkedAnchors = 0;

(async () => {
  // 先确认服务在线
  try {
    await fetch(BASE + '/');
  } catch {
    console.error(`服务未启动：${BASE}，先跑 next start`);
    process.exit(2);
  }

  for (const r of routes) {
    const res = await fetch(BASE + r);
    if (!res.ok) {
      problems.push(`${r}  →  HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    checkedPages += 1;

    // 收集页面上所有 id
    const ids = new Set();
    for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);

    // 收集所有页内锚点（排除 #main 这种全局 skip-link）
    const anchors = new Set();
    for (const m of html.matchAll(/href="#([^"]+)"/g)) anchors.add(m[1]);

    for (const a of anchors) {
      if (a === 'main') continue;
      checkedAnchors += 1;
      if (!ids.has(a)) {
        problems.push(`${r}  →  #${a} 不存在`);
      }
    }
  }

  console.log(`检查了 ${checkedPages} 个页面里的 ${checkedAnchors} 个锚点`);
  console.log(`断链: ${problems.length}\n`);
  if (problems.length) {
    for (const p of problems) console.log('  · ' + p);
    process.exit(1);
  }
  console.log('✓ 无断链');
})();
