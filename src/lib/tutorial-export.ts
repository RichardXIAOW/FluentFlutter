import { escapeHtml, highlight } from './highlight';
import type { Block, Chapter } from '@/data/tutorials/types';
import type { Lang as HighlightLang } from './highlight';

type TutLang = 'dart' | 'yaml' | 'bash' | 'json';

/**
 * 教程 → 独立单文件 HTML
 *
 * 为什么直接吃数据、而不是抓页面 DOM：
 *   1. DOM 里混着「复制代码」「下载」这类交互壳，导出前要逐个剔除，容易漏；
 *   2. 抓 DOM 还得把站点的 Tailwind 产物内联进去，几十 KB 且随样式改动失效；
 *   3. 数据模型本身就是「章节 → 小节 → 内容块」，直出反而更干净、可控、可打印。
 *
 * 产物约束：单文件、零外链、零脚本，双击就能看，也能直接打印成 PDF。
 */

const NOTE_META = {
  ok: { label: '推荐做法', color: '#0f9d58', bg: '#f0fbf5', bar: '#12b76a' },
  warn: { label: '注意', color: '#b54708', bg: '#fffbf0', bar: '#f79009' },
  bad: { label: '别这么写', color: '#b42318', bg: '#fef3f2', bar: '#f04438' },
  info: { label: '说明', color: '#175cd3', bg: '#f5f8ff', bar: '#2e90fa' },
} as const;

function codeBlockHtml(code: string, lang: TutLang, filename?: string) {
  const body = highlight(code, (lang ?? 'dart') as HighlightLang);
  const cap = filename
    ? `<p class="code-cap"><span class="dot"></span>${escapeHtml(filename)}</p>`
    : '';
  return `<div class="code-wrap">${cap}<pre class="code"><code>${body}</code></pre></div>`;
}

function blockHtml(b: Block): string {
  switch (b.kind) {
    case 'p':
      return `<p>${b.html}</p>`;

    case 'code':
      return codeBlockHtml(b.code, b.lang ?? 'dart', b.filename);

    case 'note': {
      const tone = NOTE_META[(b.tone ?? 'info') as keyof typeof NOTE_META];
      return `<div class="note" style="--bar:${tone.bar};--bg:${tone.bg};--fg:${tone.color}">
  <p class="note-tag">${tone.label}</p>
  <div class="note-body">${b.html}</div>
</div>`;
    }

    case 'list':
      return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

    case 'table':
      return `<div class="table-wrap"><table>
  <thead><tr>${b.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${b.rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody>
</table></div>`;

    case 'term':
      return `<dl class="terms">${b.items
        .map((it) => `<div class="term"><dt>${escapeHtml(it.term)}</dt><dd>${it.desc}</dd></div>`)
        .join('')}</dl>`;

    case 'compare':
      return `<div class="compare">
  <div class="col bad"><p class="col-tag">${escapeHtml(b.bad.title ?? '问题写法')}</p><pre><code>${escapeHtml(b.bad.code)}</code></pre></div>
  <div class="col good"><p class="col-tag">${escapeHtml(b.good.title ?? '推荐写法')}</p><pre><code>${escapeHtml(b.good.code)}</code></pre></div>
</div>${b.note ? `<p class="muted">${b.note}</p>` : ''}`;

    case 'keypoints':
      return `<div class="keypoints">
  <p class="kp-tag">${escapeHtml(b.title ?? '记住这几条')}</p>
  <ol>${b.items.map((i) => `<li>${i}</li>`).join('')}</ol>
</div>`;

    default:
      return '';
  }
}

const STYLE = `
:root{color-scheme:light}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#1f2937;font:16px/1.85 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased}
.page{max-width:860px;margin:0 auto;padding:56px 24px 96px}
.top{border-bottom:1px solid #e5e7eb;padding-bottom:28px;margin-bottom:32px}
.eyebrow{display:inline-block;margin:0 0 14px;padding:4px 10px;border:1px solid #bae6fd;border-radius:999px;background:#f0f9ff;color:#0369a1;font-size:13.5px;font-weight:600}
h1{margin:0;font-size:34px;line-height:1.25;letter-spacing:-.02em;color:#0f172a}
.meta{margin:14px 0 0;color:#6b7280;font-size:14.5px}
.meta code{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:1px 5px;font-size:13px}
h2{display:flex;align-items:baseline;gap:10px;margin:0 0 6px;font-size:24px;line-height:1.35;color:#0f172a}
h2 .no{flex:none;font:600 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#0284c7;letter-spacing:.06em;text-transform:uppercase}
h3{margin:0;font-size:19px;line-height:1.45;color:#0f172a;font-weight:700}
h3 .num{font:600 15px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#0284c7;margin-right:8px}
.chapter{margin:44px 0 0;padding-top:26px;border-top:1px solid #eef1f5}
.chapter:first-of-type{border-top:0;padding-top:0}
.lead{margin:14px 0 0;padding:12px 16px;border-left:3px solid #7dd3fc;background:#f8fbff;border-radius:0 10px 10px 0;color:#475569;font-size:15.5px}
.sec{margin:34px 0 0}
.summary{margin:8px 0 0;color:#6b7280;font-size:15.5px}
.level{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:12.5px;font-weight:600;vertical-align:2px}
p{margin:14px 0;color:#374151}
b,strong{color:#0f172a;font-weight:600}
code{font:.92em/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:1px 5px;color:#0e7490}
ul,ol{margin:14px 0;padding-left:22px}
li{margin:7px 0;color:#374151}
.table-wrap{margin:16px 0;overflow-x:auto;border:1px solid #e5e7eb;border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:14.5px}
th,td{padding:9px 12px;border-bottom:1px solid #eef1f5;text-align:left;vertical-align:top}
th{background:#f8fafc;color:#334155;font-weight:600}
tr:last-child td{border-bottom:0}
.code-wrap{margin:16px 0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#fbfdff}
.code-cap{display:flex;align-items:center;gap:7px;margin:0;padding:8px 14px;border-bottom:1px solid #eef1f5;background:#f8fafc;color:#64748b;font:500 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.code-cap .dot{width:7px;height:7px;border-radius:999px;background:#38bdf8}
pre.code{margin:0;padding:14px 16px;overflow-x:auto;font:13.5px/1.75 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#1e293b}
pre.code code{background:none;border:0;padding:0;color:inherit;font-size:inherit}
.tok-kw{color:#7c3aed;font-weight:600}
.tok-type{color:#0e7490}
.tok-str{color:#15803d}
.tok-num{color:#b45309}
.tok-com{color:#94a3b8;font-style:italic}
.tok-ann{color:#c2410c}
.tok-fn{color:#1d4ed8}
.note{margin:16px 0;padding:14px 16px;border-left:3px solid var(--bar);border-radius:0 10px 10px 0;background:var(--bg)}
.note-tag{margin:0 0 6px;color:var(--fg);font-size:13px;font-weight:700;letter-spacing:.02em}
.note-body{color:#374151}
.compare{display:grid;gap:12px;margin:16px 0}
@media(min-width:720px){.compare{grid-template-columns:1fr 1fr}}
.compare .col{border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
.compare .col.bad{border-color:#fecaca;background:#fffafa}
.compare .col.good{border-color:#bbf7d0;background:#f8fffb}
.col-tag{margin:0;padding:6px 12px;border-bottom:1px solid #eef1f5;font-size:13px;font-weight:700}
.compare .bad .col-tag{color:#b42318;background:#fef3f2}
.compare .good .col-tag{color:#067647;background:#f0fdf4}
.compare pre{margin:0;padding:12px 14px;overflow-x:auto;font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;color:#1e293b}
.compare pre code{background:none;border:0;padding:0;color:inherit}
.muted{color:#6b7280;font-size:14.5px}
.terms{display:grid;gap:10px;margin:16px 0}
@media(min-width:720px){.terms{grid-template-columns:1fr 1fr}}
.term{margin:0;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px}
.term dt{margin:0 0 4px;color:#0e7490;font:600 14.5px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
.term dd{margin:0;color:#374151;font-size:15px}
.keypoints{margin:16px 0;padding:14px 16px;border:1px solid #bae6fd;border-radius:12px;background:linear-gradient(135deg,#f0f9ff,#fff)}
.kp-tag{margin:0 0 8px;color:#0369a1;font-size:13.5px;font-weight:700}
.keypoints ol{margin:0;padding-left:20px}
.toc{margin:0 0 8px;padding:18px 22px;border:1px solid #e5e7eb;border-radius:12px;background:#fcfdff}
.toc p{margin:0 0 10px;color:#64748b;font:600 12.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
.toc ol{margin:0;padding-left:20px}
.toc ol ol{padding-left:18px}
.toc a{color:#334155;text-decoration:none}
.toc a:hover{color:#0284c7;text-decoration:underline}
.footer{margin:56px 0 0;padding-top:22px;border-top:1px solid #eef1f5;color:#9ca3af;font-size:13.5px}
.footer a{color:#0284c7;text-decoration:none}
@media print{body{font-size:12pt}.page{max-width:none;padding:0}.toc{break-after:page}.chapter{break-before:page}.sec{break-inside:avoid}pre.code{white-space:pre-wrap;word-break:break-word}}
`;

export function buildTutorialHtml(opts: {
  title: string;
  eyebrow: string;
  chapters: Chapter[];
  /** 站点内路径，写进页脚，方便回溯 */
  sourcePath?: string;
  siteName?: string;
}): string {
  const { title, eyebrow, chapters, sourcePath = '/', siteName = 'FluentFlutter' } = opts;

  const sections = chapters.flatMap((c) => c.sections);
  const codeCount = sections.reduce((n, s) => n + s.blocks.filter((b) => b.kind === 'code').length, 0);
  const stamp = new Date().toLocaleString('zh-CN', { hour12: false });

  const toc = chapters
    .map(
      (c) => `<li><a href="#${c.id}">${escapeHtml(c.no)} · ${escapeHtml(c.title)}</a>
  <ol>${c.sections.map((s) => `<li><a href="#${s.id}">${escapeHtml(s.title)}</a></li>`).join('')}</ol>
</li>`,
    )
    .join('');

  const body = chapters
    .map((c, ci) => {
      const lead = c.lead ? `<p class="lead">${escapeHtml(c.lead)}</p>` : '';
      const secs = c.sections
        .map((s) => {
          const m = s.title.match(/^([\d.]+)\s+(.*)$/);
          const num = m ? `<span class="num">${m[1]}</span>` : '';
          const text = m ? m[2] : s.title;
          const lv = s.level ? `<span class="level">${s.level}</span>` : '';
          const summary = s.summary ? `<p class="summary">${escapeHtml(s.summary)}</p>` : '';
          return `<article class="sec" id="${s.id}">
  <h3>${num}${escapeHtml(text)}${lv}</h3>
  ${summary}
  ${s.blocks.map(blockHtml).join('\n  ')}
</article>`;
        })
        .join('\n  ');

      return `<section class="chapter" id="${c.id}">
  <h2><span class="no">${escapeHtml(c.no)}</span>${escapeHtml(c.title)}</h2>
  ${lead}
  ${secs}
</section>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} · ${escapeHtml(siteName)}</title>
<meta name="generator" content="${escapeHtml(siteName)} · 教程导出">
<style>${STYLE}</style>
</head>
<body>
<div class="page">
  <header class="top">
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">${chapters.length} 章 · ${sections.length} 节 · ${codeCount} 个代码块</p>
  </header>

  <nav class="toc">
    <p>目录</p>
    <ol>${toc}</ol>
  </nav>

${body}

  <footer class="footer">
    <p>导出自 <a href="https://fluent.wlp.de5.net${sourcePath}">${escapeHtml(siteName)} · ${escapeHtml(sourcePath)}</a>　·　${escapeHtml(stamp)}</p>
  </footer>
</div>
</body>
</html>
`;
}

/** 文件名：去掉文件系统非法字符，保留中文 */
export function tutorialFileName(title: string): string {
  return `${title.replace(/[\\/:*?"<>|\s]+/g, '-').replace(/-+/g, '-')}.html`;
}
