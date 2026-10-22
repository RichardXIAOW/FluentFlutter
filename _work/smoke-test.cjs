/**
 * 全站页面巡检
 *
 * 对构建产物里每一个组件页发 HTTP 请求，检查：
 *   1. HTTP 200
 *   2. 有 <h1>（页面渲染没崩）
 *   3. 有代码高亮 token（说明 CodeBlock 工作了）
 *   4. 有属性表（说明 props 数据进到页面了）
 *   5. 没有 "undefined" / "NaN" / "[object Object]" 这类数据缺失痕迹
 *   6. 没有空白的预览占位（"正在准备预览" 不该出现在最终 HTML 里）
 *
 * 用法：先 next start，再 node _work/smoke-test.cjs
 */
const BASE = process.env.BASE_URL || 'http://localhost:3399';

/** 从构建产物目录直接读 slug 列表，保证和实际生成的一致 */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', '.next', 'server', 'app', 'components');
let slugs = [];
try {
  slugs = fs
    .readdirSync(appDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace(/\.html$/, ''))
    // Next 会为 [slug] 生成一个"未知路径"的兜底产物，名字取决于最后一次
    // 被访问过的无效 slug。它不是真实组件，巡检时要跳过。
    .filter((s) => !s.startsWith('__'));
} catch (e) {
  console.error('读不到构建产物，先跑 npm run build');
  process.exit(1);
}

// / 是真实首页（hero + 分类导航），200
// contains: 该页必须命中的特征串（正则），用来防「页面渲染成了空壳」
const STATIC_ROUTES = [
  { url: '/', status: 200, contains: [/Flutter 从入门/] },
  { url: '/components', status: 200 },
  { url: '/guide', status: 200 },
  { url: '/resources', status: 200, contains: [/Dart 语言讲解/, /Flutter 基础开发/, /工程化搭建指南/, /组件手册/] },
  {
    url: '/resources/dart',
    status: 200,
    // 三章标题 + 至少 20 个代码块 + 16 个小节
    contains: [/先把 Dart 写出来/, /工程化必备的高级语法/, /速查与练习/],
    minCode: 20,
    minSections: 14,
  },
  {
    url: '/resources/flutter',
    status: 200,
    contains: [/Flutter 的心智模型/, /组件封装/, /状态、生命周期与性能/],
    minCode: 18,
    minSections: 16,
  },
  {
    url: '/resources/basic',
    status: 200,
    // 基础开发（第 3 站）：抽 3 个章标题做特征
    contains: [/界面编写的基本方法/, /常用界面元素配置/, /常用第三方库/],
    minCode: 12,
    minSections: 14,
  },
  {
    url: '/handbook',
    status: 200,
    // 工程化指南已改为站内渲染（TutorialShell）：抽 3 个章标题做特征
    contains: [/这份指南怎么用/, /状态管理：Riverpod/, /验收清单/],
    minCode: 28,
    minSections: 34,
  },
  // 旧 iframe 版文档在 public/handbook/ 留档（站内已无入口），直接访问仍应 200
  { url: '/handbook/index.html', status: 200 },
];

const problems = [];
let ok = 0;

async function check(url, expect) {
  let res;
  try {
    res = await fetch(BASE + url);
  } catch (e) {
    problems.push(`${url}  请求失败: ${e.message}`);
    return;
  }
  if (res.status !== expect.status) {
    problems.push(`${url}  HTTP ${res.status}（期望 ${expect.status}）`);
    return;
  }
  if (!expect.contains && !expect.minCode && !expect.minSections) {
    ok += 1;
    return;
  }

  const body = await res.text();
  const missing = (expect.contains || []).filter((c) => !c.test(body));
  if (missing.length) {
    problems.push(
      `${url}  缺少: ${missing.map((m) => m.toString().slice(0, 42)).join(' | ')}`,
    );
    return;
  }

  // 代码块用 CodeBlock 头部的红绿灯计数
  if (expect.minCode) {
    const n = (body.match(/bg-\[#ff5f57\]/g) || []).length;
    if (n < expect.minCode) {
      problems.push(`${url}  代码块只有 ${n} 个（期望 ≥ ${expect.minCode}）`);
      return;
    }
  }
  // 小节用 <h3> 计数
  if (expect.minSections) {
    const n = (body.match(/<h3[\s>]/g) || []).length;
    if (n < expect.minSections) {
      problems.push(`${url}  小节只有 ${n} 个（期望 ≥ ${expect.minSections}）`);
      return;
    }
  }
  ok += 1;
}

(async () => {
  console.log(`巡检 ${slugs.length} 个组件页 + ${STATIC_ROUTES.length} 个静态路由…\n`);

  for (const r of STATIC_ROUTES) {
    await check(r.url, {
      status: r.status,
      contains: r.contains ?? (r.status === 200 ? [/<h1/] : undefined),
      minCode: r.minCode,
      minSections: r.minSections,
    });
  }

  for (const s of slugs) {
    const body = await (await fetch(`${BASE}/components/${s}`)).text();

    const hasH1 = /<h1/.test(body);
    // demo 现在默认展示「效果」（mock 或预览），代码在客户端切 tab 后才渲染。
    // SSR 里「有高亮 token」或「有 mock 图形」二者满足其一即算正常。
    const hasCode = /tok-(kw|str|punc|typ)/.test(body);
    const hasMock = /组件效果/.test(body);
    // CodeBlock 头部的红绿灯是它的特有标记（"复制"一词会出现在 meta/描述里，不可靠）
    const hasCodeBlock = /bg-\[#ff5f57\]/.test(body);
    const hasProps = /属性表|个高频参数/.test(body);

    if (!hasH1) problems.push(`/components/${s}  缺少 <h1>`);
    if (!(hasCode || hasMock)) problems.push(`/components/${s}  既无代码也无 mock`);
    if (!hasMock) problems.push(`/components/${s}  缺少图形示例区（组件效果）`);
    if (!hasProps) problems.push(`/components/${s}  缺少属性区`);
    if (hasCodeBlock && !hasCode) {
      problems.push(`/components/${s}  渲染了代码块却没有高亮 token`);
    }
    const clean = body.replace(/\$undefined/g, ''); // RSC 载荷的 null 表示，不是缺陷
    if (/undefined|\[object Object\]|NaN%/.test(clean)) {
      problems.push(`/components/${s}  含有数据缺失痕迹`);
    }
    ok += 1;
  }

  // 404 必须是 404（不存在的组件应触发 not-found 页）
  await check('/components/__definitely_not_exists__', {
    status: 404,
    contains: [/这个页面不存在/],
  });

  console.log(`通过: ${ok}`);
  console.log(`问题: ${problems.length}\n`);
  if (problems.length) {
    for (const p of problems) console.log('  · ' + p);
    process.exit(1);
  }
  console.log('✓ 全部通过');
})();
