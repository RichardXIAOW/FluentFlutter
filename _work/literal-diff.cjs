/* 字面量差异扫描：把「示例代码里的中文串」与「图形 JSX 里的中文串」做集合对比，
 * 只输出差异较大的示例，用来兜底发现「代码说 A、图里画 B」的问题。
 *
 * 用法: node _work/literal-diff.cjs [阈值]
 * 输出: _work/literal-diff.txt
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = 'src/data/components';
const MOCK_FILE = 'src/components/demo-mocks.tsx';

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
        const sp = segSpans.find((x) => x.start >= s && x.start < e);
        const code = sp ? demosSeg.slice(sp.start + 1, sp.end - 1) : '';
        demos.push({ title: t[1], code: unescapeTpl(code) });
      });
      out.push({ slug: m[1], demos });
    });
  }
  return out;
}

function parseMocks() {
  const src = fs.readFileSync(MOCK_FILE, 'utf8');
  const start = src.indexOf('export const demoMocks');
  const body = src.slice(start === -1 ? 0 : start);
  const map = new Map();
  const keys = [...body.matchAll(/\n {2}'((?:[^'\\]|\\.)+)': \(\) =>/g)];
  keys.forEach((k, i) => {
    const s = k.index;
    const e = i + 1 < keys.length ? keys[i + 1].index : body.length;
    let text = body.slice(s, e).trim();
    const ref = text.match(/=>\s*<([A-Z]\w+)\s*\/>/);
    if (ref) {
      for (const pat of [`const ${ref[1]} =`, `function ${ref[1]}(`]) {
        const defStart = src.indexOf(pat);
        if (defStart >= 0) {
          const rest = src.slice(defStart);
          const nextDef = rest.slice(1).search(/\n(?:const|function|export)\s/);
          const defEnd = nextDef === -1 ? rest.length : nextDef + 1;
          text += '\n' + rest.slice(0, defEnd);
          break;
        }
      }
    }
    map.set(k[1].replace(/\\'/g, "'"), text);
  });
  return map;
}

/** 抽中文串（长度 >= 2），去掉模板/变量拼接带来的噪声 */
function hanzi(s) {
  const set = new Set();
  for (const m of s.matchAll(/[\u4e00-\u9fa5][\u4e00-\u9fa5A-Za-z0-9+\-·%（）()：:，,。、→\s]*/g)) {
    const t = m[0].replace(/\s+/g, '').trim();
    if (t.replace(/[^\u4e00-\u9fa5]/g, '').length >= 2) set.add(t);
  }
  return set;
}
/** 代码里的中文常常带 Dart 插值，做一次宽松化：只留中文核心 */
function core(s) {
  const out = new Set();
  for (const t of s) {
    const c = t.replace(/[^\u4e00-\u9fa5]/g, '');
    if (c.length >= 2) out.add(c);
  }
  return out;
}

const data = parseData();
const mocks = parseMocks();
const lines = [];
const TH = Number(process.argv[2] || 3);
let flagged = 0;
const missingMock = [];

for (const c of data) {
  for (const d of c.demos) {
    const key = `${c.slug}::${d.title}`;
    const mk = mocks.get(key);
    if (!mk) { missingMock.push(key); continue; }
    const codeCore = core(hanzi(d.code));
    const mockCore = core(hanzi(mk));
    const onlyCode = [...codeCore].filter((x) => ![...mockCore].some((y) => y.includes(x) || x.includes(y)));
    const onlyMock = [...mockCore].filter((x) => ![...codeCore].some((y) => y.includes(x) || x.includes(y)));
    if (onlyCode.length + onlyMock.length >= TH) {
      flagged += 1;
      lines.push(`\n${'─'.repeat(76)}`);
      lines.push(`《${key}》`);
      lines.push(`  代码有、图里没有：${onlyCode.join(' | ') || '（无）'}`);
      lines.push(`  图里有、代码没有：${onlyMock.join(' | ') || '（无）'}`);
    }
  }
}

const head = `字面量差异扫描（阈值 ${TH}）\n命中 ${flagged} 个示例；共 ${data.reduce((a, c) => a + c.demos.length, 0)} 个示例`;
console.log(head);
console.log(lines.join('\n'));
if (missingMock.length) console.log(`\n未注册图形：${missingMock.join(', ')}`);
fs.writeFileSync('_work/literal-diff.txt', head + lines.join('\n') + '\n', 'utf8');
