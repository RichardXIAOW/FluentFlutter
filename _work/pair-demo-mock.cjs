/* 把「示例代码」与「示例图形（mock JSX 源码）」配对导出，供人工比对语义
 *
 * 数据来源两个文件，都按固定文本结构解析（不做 TS 求值，避免 RSC/编译依赖）：
 *   src/data/components/*.ts   →  slug + demos[{title, note, code}]
 *   src/components/demo-mocks.tsx → 'slug::title': () => ( ...jsx... )
 *
 * 用法: node _work/pair-demo-mock.cjs [slug...]
 * 输出: _work/demo-mock-pairs.txt
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = 'src/data/components';
const MOCK_FILE = 'src/components/demo-mocks.tsx';

/* ---------- 1. 解析组件数据 ---------- */
const unescapeTpl = (s) =>
  s.replace(/\\`/g, '`').replace(/\\\$\{/g, '${').replace(/\\\\/g, '\\');

/* 把块里的模板字符串（反引号字面量）整段遮蔽成 \u0000，
 * 这样里面的 Dart 代码（例如 MaterialApp(title: 'PulseShop')）不会再被
 * "title: '...'" 这个切分正则误当成示例条目的标题。
 * 返回 [掩码串, spans[{start,end}]]，spans 用原串下标，可原样取回内容。 */
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
    } else {
      out += s[i];
      i++;
    }
  }
  return [out, spans];
}

function parseData() {
  const out = [];
  for (const f of fs.readdirSync(DATA_DIR).filter((x) => x.endsWith('.ts'))) {
    const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
    // 每个组件块以 "  { slug: 'xxx'," 开头
    const comps = [...src.matchAll(/^\s{2}\{\s*\n\s+slug: '([^']+)'/gm)];
    comps.forEach((m, i) => {
      const start = m.index;
      const end = i + 1 < comps.length ? comps[i + 1].index : src.length;
      const block = src.slice(start, end);
      const slug = m[1];
      const nameM = block.match(/^\s+name: '([^']+)'/m);
      const dstart = block.indexOf('demos: [');
      if (dstart === -1) return;
      // 不按 "]," 收尾 —— 有些示例数组收尾缩进不一致，会截掉末尾几个示例。
      // 组件块本身以下一个 slug: 为界（见上面的 comps 切分），不会串台。
      const demosSeg = block.slice(dstart);
      const [segMasked, segSpans] = maskTemplates(demosSeg);

      const demos = [];
      // 按 title: '...' 切分条目 —— 比按缩进切稳，条目缩进并不完全一致。
      // 用掩码串定位（模板字符串里的 title: '...' 已被遮蔽），下标与原串一致。
      const titles = [...segMasked.matchAll(/title: '((?:[^'\\]|\\.)*)'/g)];
      titles.forEach((t, j) => {
        const s = t.index;
        const e = j + 1 < titles.length ? titles[j + 1].index : demosSeg.length;
        const seg = demosSeg.slice(s, e);
        const title = t[1];
        const noteM = seg.match(/note: '((?:[^'\\]|\\.)*)'/);
        // code 用模板跨度取，避免 /\`[\s\S]*?\`/ 在「代码里带转义反引号」时提前截断
        const codeSpan = segSpans.find((sp) => sp.start >= s && sp.start < e);
        const code = codeSpan ? demosSeg.slice(codeSpan.start + 1, codeSpan.end - 1) : '';
        demos.push({
          title,
          note: noteM ? noteM[1].replace(/\\'/g, "'") : '',
          code: unescapeTpl(code).replace(/\s+$/, ''),
        });
      });
      out.push({ slug, name: nameM ? nameM[1] : '', demos });
    });
  }
  return out;
}

/* ---------- 2. 解析 mock 源码 ---------- */
function parseMocks() {
  const src = fs.readFileSync(MOCK_FILE, 'utf8');
  const start = src.indexOf('export const demoMocks');
  const body = src.slice(start === -1 ? 0 : start);
  const map = new Map();
  // 键后面可能是 () => ( ... ) 也可能是 () => <NamedComp />
  const keys = [...body.matchAll(/\n {2}'((?:[^'\\]|\\.)+)': \(\) =>/g)];
  keys.forEach((k, i) => {
    const s = k.index;
    const e = i + 1 < keys.length ? keys[i + 1].index : body.length;
    let text = body.slice(s, e).trim();
    // 引用了具名组件的话，把它的定义也带上，否则看不到画了什么
    const ref = text.match(/=>\s*<([A-Z]\w+)\s*\/>/);
    if (ref) {
      const defStart = src.indexOf(`const ${ref[1]} =`);
      if (defStart >= 0) {
        const rest = src.slice(defStart);
        const nextDef = rest.slice(1).search(/\n(?:const|function|export)\s/);
        const defEnd = nextDef === -1 ? rest.length : nextDef + 1;
        text += `\n\n  /* ↓↓ 该键引用的具名组件 ${ref[1]} ↓↓ */\n` + rest.slice(0, defEnd);
      }
    }
    map.set(k[1].replace(/\\'/g, "'"), text);
  });
  return map;
}

/* ---------- 3. 配对输出 ---------- */
const WANT = process.argv.slice(2);
const data = parseData();
const mocks = parseMocks();
const pairs = [];
let onlyCode = [];
let onlyMock = [];

for (const c of data) {
  if (WANT.length && !WANT.includes(c.slug)) continue;
  for (const d of c.demos) {
    const key = `${c.slug}::${d.title}`;
    const mock = mocks.get(key);
    if (!mock) onlyCode.push(key);
    pairs.push({ slug: c.slug, name: c.name, ...d, mock: mock || null });
  }
}

const seen = new Set(pairs.map((p) => `${p.slug}::${p.title}`));
for (const k of mocks.keys()) if (!seen.has(k)) onlyMock.push(k);

const lines = [];
const W = (s) => {
  lines.push(s);
  console.log(s);
};

const bySlug = new Map();
for (const p of pairs) {
  if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
  bySlug.get(p.slug).push(p);
}

for (const [slug, list] of bySlug) {
  W(`\n${'█'.repeat(80)}`);
  W(`  ${slug}  ·  ${list[0].name}   （${list.length} 个示例）`);
  W('█'.repeat(80));
  for (const p of list) {
    W(`\n┌─ 示例《${p.title}》`);
    if (p.note) W(`│ 意图：${p.note}`);
    W(`├─ 代码 ─────────────────────────────────────────────────`);
    for (const l of p.code.split('\n')) W(`│ ${l}`);
    W(`├─ 图形 JSX ─────────────────────────────────────────────`);
    if (!p.mock) W('│ （未注册图形）');
    else for (const l of p.mock.split('\n').slice(0, 70)) W(`│ ${l}`);
    W('└' + '─'.repeat(70));
  }
}

W(`\n${'─'.repeat(80)}`);
W(`共 ${pairs.length} 个示例；${bySlug.size} 个组件`);
if (onlyCode.length) W(`\n⚠️ 有代码但没注册图形（${onlyCode.length}）：\n  ${onlyCode.join('\n  ')}`);
if (onlyMock.length) W(`\n⚠️ 注册了图形但没有对应示例（${onlyMock.length}）：\n  ${onlyMock.join('\n  ')}`);

fs.writeFileSync('_work/demo-mock-pairs.txt', lines.join('\n'), 'utf8');
console.log('\n配对报告：_work/demo-mock-pairs.txt');
