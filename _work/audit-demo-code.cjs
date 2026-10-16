/* ⚠️ 已废弃 —— 请勿使用。改用 _work/pair-demo-mock.cjs（+ literal-diff.cjs）。
 *
 * 废弃原因：本脚本抓组件详情页的渲染后 HTML，靠 <section id="demo-N"> 手工切片，
 * 但代码块与预览区的边界切不准，会把下一页的 markup 混进来，产出大量假阳性
 * （例如在 filled-button 上报出 «aria-label=» «class=» «self.__next_f.push([1,»）。
 * 直接读数据源 + mock 源码的方案更准，见 pair-demo-mock.cjs。
 *
 * ────────────────────────────────────────────────────────────────
 * 示例「代码 ↔ 图形」一致性审计
 *
 * 目标：找出「示例代码写的是什么」和「示例图画的是什么」对不上的地方。
 *
 * 做法：抓组件详情页的渲染后 HTML，按 <section id="demo-N"> 切分，
 * 每段里分别抽出
 *   - 标题（h3/h4）
 *   - 图形区（preview-grid 内）的可见文字
 *   - 代码块里的字符串字面量
 * 然后自动比对：代码里出现的字符串字面量，是否真的出现在图形里。
 * 不匹配的先自动列出，再由人判断哪些是真错、哪些是合理（图标、动态值等）。
 *
 * 用法: BASE_URL=http://127.0.0.1:3415 node _work/audit-demo-code.cjs [slug...]
 */
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3399';

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** 只保留「像给人看的文案」的字面量，过滤掉类名 / 键名 / 布局常量 */
function literals(code) {
  const out = new Set();
  const re = /'([^'\\\n]{2,40})'|"([^"\\\n]{2,40})"/g;
  let m;
  while ((m = re.exec(code))) {
    const v = (m[1] || m[2]).trim();
    if (!v) continue;
    if (/^[a-z][a-zA-Z0-9_]*$/.test(v)) continue; // 键名、方法名
    if (/^[\d\s.,:%/-]+$/.test(v)) continue; // 纯数字/符号
    if (/^[a-z0-9_.:/#-]+$/.test(v)) continue; // 路径、类名
    if (/^[A-Z][a-zA-Z0-9]*(\.[a-zA-Z0-9.]+)?$/.test(v)) continue; // 枚举名 Icons.star
    out.add(v);
  }
  return [...out];
}

(async () => {
  const slugs = process.argv.slice(2).length
    ? process.argv.slice(2)
    : JSON.parse(fs.readFileSync(path.join(__dirname, 'slugs.json'), 'utf8'));

  const report = [];
  let demos = 0;
  let flagged = 0;

  for (const slug of slugs) {
    const html = await (await fetch(`${BASE}/components/${slug}`)).text();
    const head = html.slice(0, html.indexOf('id="demo-'));
    const pageName = (head.match(/<h1[^>]*>(.*?)<\/h1>/s) || [])[1];
    const parts = html.split('id="demo-').slice(1);

    const rows = [];
    parts.forEach((p, i) => {
      const gi = p.indexOf('preview-grid');
      const end = gi === -1 ? -1 : p.indexOf('查看代码', gi);
      const mockSeg = gi === -1 ? '' : p.slice(gi, end === -1 ? gi + 4000 : end);

      // 标题在 preview 之前
      const titleSeg = gi === -1 ? p.slice(0, 800) : p.slice(0, gi);
      const t = decode(
        (titleSeg.match(/<h[34][^>]*>(.*?)<\/h[34]>/s) || [])[1] || '',
      );

      // 代码区：从 preview 结束到该 section 结束
      const codeSeg = gi === -1 ? p : p.slice(end === -1 ? gi : end);
      const mockText = decode(mockSeg);
      const codeText = decode(codeSeg);

      const lits = literals(codeText);
      const missing = lits.filter((v) => !mockText.includes(v));

      demos++;
      const bad = gi !== -1 && missing.length > 0;
      if (bad) flagged++;

      rows.push({ i: i + 1, title: t, code: codeText, mock: mockText, lits, missing, bad });
    });

    report.push({ slug, pageName: decode(pageName || ''), rows });
  }

  const lines = [];
  const W = (s) => {
    lines.push(s);
    console.log(s);
  };

  for (const page of report) {
    W(`\n${'═'.repeat(78)}`);
    W(`  ${page.slug}   ${page.pageName}`);
    W('═'.repeat(78));
    for (const r of page.rows) {
      W(`\n  [${r.i}] ${r.title}`);
      if (r.mock === '') {
        W(`      图形：无（纯代码示例）`);
      } else {
        W(`      图形文字：${r.mock.slice(0, 150)}`);
      }
      W(`      代码      ：${r.code.slice(0, 220)}`);
      if (r.bad) {
        W(`      ⚠️ 代码里有、图形里没有：${r.missing.map((x) => `«${x}»`).join(' ')}`);
      }
    }
  }

  W(`\n${'─'.repeat(78)}`);
  W(`共 ${report.length} 个组件 / ${demos} 个示例，其中 ${flagged} 个存在「代码有、图形无」的字面量`);
  fs.writeFileSync('_work/demo-code-report.txt', lines.join('\n'), 'utf8');
  W('报告：_work/demo-code-report.txt');
})();
