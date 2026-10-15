// 把 handbook 里的附录 E 替换成「指向 /resources/dart 的引导卡片」，
// 并把所有 #a5 / #a5.x 内部锚点改指向 /resources/dart。
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'public', 'handbook', 'index.html');
let h = fs.readFileSync(p, 'utf8');
const before = h.length;

// ── 1. 定位附录 E ──
const s = h.indexOf('<h2 id="a5">');
const e = h.indexOf('<h2 id="a6">');
if (s === -1 || e === -1) {
  console.error('找不到附录 E 边界');
  process.exit(1);
}

const NEW = `<h2 id="a5">附录 E · Dart 高级语法速查</h2>
<p class="lead">这一节已独立成篇，搬到配套站点的 <b>Dart 语言讲解</b> 页面里 —— 并且在那里补齐了前置的语言基础（类型、空安全、函数、类、集合、异步），不再只有高级语法。</p>

<div class="callout why"><b>为什么搬走</b>
Dart 是 Flutter 的地基，放在"工程化指南的附录"里位置不对 —— 它应该在学组件<b>之前</b>就能读到。现在它和 Flutter 讲解、组件手册一起构成一条按依赖关系排好的学习路线。

<div class="box" style="margin:14px 0 2px"><h4>去这里读</h4>
<p style="margin:6px 0 10px">第 1 章「工程化必备的高级语法」收录了原先在这里的全部内容：<code class="inl">var/final/const/late final</code>、<code class="inl">abstract final class</code> / <code class="inl">sealed</code>、模式匹配、<code class="inl">copyWith</code>、<code class="inl">extension</code>、<code class="inl">mixin</code>、<code class="inl">async*</code>/<code class="inl">Stream</code>、<code class="inl">required</code> 命名参数与四个语法糖。</p>
<a class="btn" href="/resources/dart" style="display:inline-flex;align-items:center;gap:6px;background:var(--acc);border-color:var(--acc);color:#fff;padding:7px 14px">打开 Dart 语言讲解 →</a>
</div>
</div>

<p>下面是本附录原有的小节索引，点击会跳到新页面里的对应位置：</p>
<ul>
  <li><a href="/resources/dart#d-qualifiers">E.1 <code class="inl">var</code> / <code class="inl">final</code> / <code class="inl">const</code> / <code class="inl">late final</code>：我到底该用哪个</a></li>
  <li><a href="/resources/dart#d-sealed">E.2 <code class="inl">abstract</code> / <code class="inl">abstract final class</code> / <code class="inl">sealed</code></a></li>
  <li><a href="/resources/dart#d-pattern">E.3 模式匹配：switch 表达式、when 守卫、:final 解构</a></li>
  <li><a href="/resources/dart#d-copywith">E.4 <code class="inl">copyWith</code>：谁生成的、为什么必须有它</a></li>
  <li><a href="/resources/dart#d-misc">E.5 其他天天碰到的写法（extension / mixin / async* / required / 语法糖）</a></li>
  <li><a href="/resources/dart#d-cheatsheet">E.6 一页纸总结</a></li>
</ul>

`;

h = h.slice(0, s) + NEW + h.slice(e);

// ── 2. 把剩下的 #a5 锚点（含 #a5.1 之类）改成跨站链接 ──
//    映射到新页面的对应 id
const map = {
  'a5.1': 'd-qualifiers',
  'a5.2': 'd-sealed',
  'a5.3': 'd-pattern',
  'a5.4': 'd-copywith',
  'a5.5': 'd-misc',
  'a5.6': 'd-cheatsheet',
};
for (const [k, v] of Object.entries(map)) {
  h = h.split(`#${k}`).join(`/resources/dart#${v}`);
}
// 裸 #a5（不含小节号）统一指向页面顶部
h = h.split('href="#a5"').join('href="/resources/dart"');

fs.writeFileSync(p, h);
console.log(`替换完成：${before} → ${h.length}（-${before - h.length} 字节）`);
const left = (h.match(/#a5/g) || []).length;
console.log(`残留 #a5 引用：${left}`);
