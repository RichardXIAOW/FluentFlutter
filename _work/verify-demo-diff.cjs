// 验证「每个组件的每个示例，渲染出的图形都不一样」。
//
// 关键：服务端 HTML 里每个示例是一个 <section id="demo-N">。
// 「查看代码」在一次示例里出现两次（title + aria-label），
// 所以不能按它切。改为按 id="demo- 切，并且只取预览区
// （preview-grid 容器内的内容）做指纹，排除代码块与标题的干扰。
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3399';

function fingerprint(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

(async () => {
  const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'slugs.json'), 'utf8'));

  let totalDemos = 0;
  let totalUniq = 0;
  const dup = [];
  const noMock = [];

  for (const slug of slugs) {
    const html = await (await fetch(`${BASE}/components/${slug}`)).text();

    // 按 section 切开：每段开头是 id="demo-N"
    const parts = html.split('id="demo-').slice(1);
    const fps = [];
    for (const p of parts) {
      // 预览区内容在 preview-grid 之后
      const gi = p.indexOf('preview-grid');
      if (gi === -1) {
        // 该示例没有图形预览（mode === 'none'），单独记录，不参与比对
        fps.push(null);
        continue;
      }
      // 预览区结束于右下角工具条之前
      const end = p.indexOf('查看代码', gi);
      const seg = p.slice(gi, end === -1 ? gi + 3000 : end);
      fps.push(fingerprint(seg));
    }

    const real = fps.filter((x) => x !== null);
    const uniq = new Set(real);
    totalDemos += real.length;
    totalUniq += uniq.size;

    if (real.length === 0) noMock.push(slug);

    // 找出重复组
    const groups = new Map();
    fps.forEach((f, i) => {
      if (f === null) return;
      if (!groups.has(f)) groups.set(f, []);
      groups.get(f).push(i + 1);
    });
    const bad = [...groups.values()].filter((g) => g.length > 1);
    if (bad.length) dup.push({ slug, bad });
  }

  console.log(`检查 ${slugs.length} 个组件页，共 ${totalDemos} 个带图形的示例`);
  console.log(`渲染出唯一图形的示例：${totalUniq} / ${totalDemos}`);
  console.log('');

  if (noMock.length) {
    console.log(`（${noMock.length} 个组件无图形示例，仅展示代码：${noMock.join(', ')}）\n`);
  }

  if (dup.length) {
    console.log('⚠️ 下列组件内存在「看起来一样」的示例：');
    for (const d of dup) {
      console.log(`  ${d.slug}: ${d.bad.map((g) => `第 ${g.join('、')} 个相同`).join('；')}`);
    }
    const n = dup.reduce((a, d) => a + d.bad.reduce((x, g) => x + g.length - 1, 0), 0);
    console.log(`\n共 ${dup.length} 个组件存在重复，合计 ${n} 个示例与他图相同`);
    process.exit(1);
  }

  console.log('✓ 所有组件内，每个示例的图形都互不相同');
})();
