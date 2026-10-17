/* 交互诚实性审计：图形里「点了会弹提示」的示例，代码里必须真的有提示代码。
 *
 * 规则（用户 2026-10-17 定）：示例代码没写 showSnackBar / showDialog，
 * 点击后就只能有涟漪，不许弹任何提示。
 *
 * 用法: node _work/audit-toast.cjs
 * 输出: _work/toast-audit.txt
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = 'src/data/components';
const MOCK_FILE = 'src/components/demo-mocks.tsx';
const KIT_FILE = 'src/components/mock-kit.tsx';

function maskTemplates(s) {
  let out = '';
  const spans = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '`') {
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '\\') { j += 2; continue; }
        if (s[j] === '`') break;
        j++;
      }
      spans.push({ start: i, end: j + 1 });
      out += '`' + '\u0000'.repeat(Math.max(0, j - i - 1)) + '`';
      i = j + 1;
    } else { out += s[i]; i++; }
  }
  return [out, spans];
}
const unescapeTpl = (s) => s.replace(/\\`/g, '`').replace(/\\\$\{/g, '${').replace(/\\\\/g, '\\');

function parseData() {
  const out = [];
  for (const f of fs.readdirSync(DATA_DIR).filter((x) => x.endsWith('.ts'))) {
    const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
    const comps = [...src.matchAll(/^\s{2}\{\s*\n\s+slug: '([^']+)'/gm)];
    comps.forEach((m, i) => {
      const start = m.index;
      const end = i + 1 < comps.length ? comps[i + 1].index : src.length;
      const block = src.slice(start, end);
      const dstart = block.indexOf('demos: [');
      if (dstart === -1) return;
      const demosSeg = block.slice(dstart);
      const [segMasked, segSpans] = maskTemplates(demosSeg);
      const titles = [...segMasked.matchAll(/title: '((?:[^'\\]|\\.)*)'/g)];
      const demos = [];
      titles.forEach((t, j) => {
        const s = t.index;
        const e = j + 1 < titles.length ? titles[j + 1].index : demosSeg.length;
        const codeKey = segMasked.indexOf('code:', s);
        const lower = codeKey >= 0 && codeKey < e ? codeKey : s;
        const sp = segSpans.find((x) => x.start >= lower && x.start < e);
        const code = sp ? demosSeg.slice(sp.start + 1, sp.end - 1) : '';
        demos.push({ title: t[1], code: unescapeTpl(code) });
      });
      out.push({ slug: m[1], demos });
    });
  }
  return out;
}

function defOf(src, name) {
  for (const pat of [`const ${name} =`, `function ${name}(`]) {
    const s = src.indexOf(pat);
    if (s >= 0) {
      const rest = src.slice(s);
      const next = rest.slice(1).search(/\n(?:const|function|export)\s/);
      return rest.slice(0, next === -1 ? rest.length : next + 1);
    }
  }
  return '';
}

function parseMocks() {
  const src = fs.readFileSync(MOCK_FILE, 'utf8');
  const all = src + '\n' + fs.readFileSync(KIT_FILE, 'utf8');
  const start = src.indexOf('export const demoMocks');
  const body = src.slice(start === -1 ? 0 : start);
  const map = new Map();
  const keys = [...body.matchAll(/\n {2}'((?:[^'\\]|\\.)+)': \(\) =>/g)];
  keys.forEach((k, i) => {
    const s = k.index;
    const e = i + 1 < keys.length ? keys[i + 1].index : body.length;
    let text = body.slice(s, e).trim();
    const seen = new Set();
    const queue = [...text.matchAll(/<([A-Z]\w+)/g)].map((m) => m[1]);
    while (queue.length && seen.size < 24) {
      const name = queue.shift();
      if (seen.has(name)) continue;
      seen.add(name);
      const def = defOf(all, name);
      if (!def) continue;
      text += '\n' + def;
      for (const m of def.matchAll(/<([A-Z]\w+)/g)) queue.push(m[1]);
    }
    map.set(k[1].replace(/\\'/g, "'"), text);
  });
  return map;
}

/** 图形里是否有「点了弹提示」的写法（不含已注册组件内部的 toast 参数） */
function graphicToasts(text) {
  const hits = [];
  for (const m of text.matchAll(/data-snack=(?:"([^"]*)"|\{`([^`]*)`\})/g)) hits.push(m[1] ?? m[2]);
  for (const m of text.matchAll(/toast=(?:"([^"]*)"|\{([^}]*)\})/g)) hits.push(m[1] ?? m[2]);
  if (/snack\(/.test(text)) hits.push('snack(...)');
  return hits;
}

/** 判定标准（严格版）：只有代码里真的写了 showSnackBar，点击才允许弹提示。
 *  对话框关闭、Navigator.pop、print 都不算 —— 前者不是提示语，后者只在控制台。 */
const CODE_HINT = /showSnackBar/;

const data = parseData();
const mocks = parseMocks();
const lines = [];
let bad = 0;
let okc = 0;

for (const c of data) {
  for (const d of c.demos) {
    const key = `${c.slug}::${d.title}`;
    const mk = mocks.get(key);
    if (!mk) continue;
    const toasts = graphicToasts(mk);
    if (!toasts.length) continue;
    const codeHas = CODE_HINT.test(d.code);
    if (codeHas) { okc += 1; continue; }
    bad += 1;
    lines.push(`\n${'─'.repeat(76)}`);
    lines.push(`《${key}》  ← 代码没有提示，图里却会弹`);
    lines.push(`  图形提示：${toasts.join(' | ')}`);
  }
}

const head = `交互诚实性审计：图形会弹提示、但代码没写的示例 —— ${bad} 个（另有 ${okc} 个代码确实会弹，合规）`;
console.log(head);
console.log(lines.join('\n'));
fs.writeFileSync('_work/toast-audit.txt', head + lines.join('\n') + '\n', 'utf8');
