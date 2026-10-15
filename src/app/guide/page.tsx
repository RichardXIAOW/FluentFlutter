import type { Metadata } from 'next';
import Link from 'next/link';
import { allComponents, getComponentsByCategory } from '@/data';
import { categories } from '@/data/categories';

export const metadata: Metadata = {
  title: '指南',
  description:
    '这份 Material 组件手册的内容范围、写法约定、以及为什么它不照抄 API 文档。',
};

const stats = (c: typeof allComponents) => {
  const demos = c.reduce((n, x) => n + x.demos.length, 0);
  const props = c.reduce((n, x) => n + x.props.length, 0);
  const pitfalls = c.reduce((n, x) => n + (x.whenToUse?.dont?.length ?? 0), 0);
  return [
    { n: c.length, label: '个组件', note: '手写精选 · 非 API 搬运', icon: 'M4 5h16v14H4zM4 10h16' },
    { n: demos, label: '个可交互示例', note: '点得动 · 每个都讲为什么', icon: 'm8 7-5 5 5 5M16 7l5 5-5 5' },
    { n: props, label: '条高频属性', note: '只列真正会改的参数', icon: 'M4 7h16M4 12h10M4 17h7' },
    { n: pitfalls, label: '个真实避坑', note: '来自踩过的雷', icon: 'M12 3 2 20h20L12 3Zm0 7v4m0 3h.01' },
  ];
};

export default function GuidePage() {
  const s = stats(allComponents);

  return (
    <main id="main" className="mx-auto max-w-page px-4 py-10 sm:px-6">
      {/* ══════════ Hero ══════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50/40 px-6 py-12 shadow-card sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full bg-brand-200/30 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11.5px] font-medium text-brand-600 shadow-sm ring-1 ring-brand-100">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 3 2 20h20L12 3Zm0 7v4m0 3h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            开始之前 · 先读这一页
          </span>
          <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-tight text-ink-900 sm:text-[38px]">
            这份手册
            <span className="text-brand-500">怎么用</span>
          </h1>
          <p className="mt-4 text-pretty text-[14.5px] leading-relaxed text-ink-600">
            它和网上大多数 Flutter 中文资料不太一样：不搬运 API 文档，
            只回答三个问题 ——
            <strong className="font-semibold text-ink-800">组件长什么样</strong>、
            <strong className="font-semibold text-ink-800">什么场景该用</strong>、
            <strong className="font-semibold text-ink-800">新手会在哪踩坑</strong>。
            先花 3 分钟读完这页，后面的每一站都会更顺。
          </p>

          {/* 快捷入口 */}
          <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
            {[
              { href: '/components', t: '直接看组件', d: '总览页按用途分类', primary: true },
              { href: '/resources', t: '五步学习路线', d: 'Dart → Flutter → 组件 → 工程化' },
              { href: '/handbook', t: '工程化搭建', d: '14 阶段 · 39 步' },
            ].map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition hover:-translate-y-0.5 hover:shadow-pop ${
                  q.primary
                    ? 'border-brand-300 bg-white shadow-card'
                    : 'border-ink-100 bg-white/80 hover:border-brand-200'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${
                    q.primary ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold text-ink-900 group-hover:text-brand-600">
                    {q.t}
                  </span>
                  <span className="block text-[11.5px] text-ink-500">{q.d}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 数据概览 ══════════ */}
      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {s.map((x) => (
          <div
            key={x.label}
            className="group flex items-start gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-pop"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={x.icon} />
              </svg>
            </span>
            <span>
              <span className="flex items-baseline gap-1">
                <strong className="text-[24px] font-bold leading-none tracking-tight text-ink-900">
                  {x.n}
                </strong>
                <span className="text-[12.5px] font-medium text-ink-700">{x.label}</span>
              </span>
              <span className="mt-1 block text-[11.5px] text-ink-400">{x.note}</span>
            </span>
          </div>
        ))}
      </section>

      {/* ══════════ 三步使用法 ══════════ */}
      <section className="mt-14">
        <SectionHead
          title="三步使用法"
          sub="大多数人的正确打开方式 —— 卡住了随时跳回上一步。"
        />

        <div className="relative mt-6 grid gap-4 md:grid-cols-3">
          {/* 连接线（桌面端） */}
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-brand-200 md:block"
          />
          {[
            {
              step: '1',
              t: '遇到需求，按「想干什么」找组件',
              d: '不用背类名。想「我要一个列表」就翻列表类，想「要弹提示」就翻反馈类。都不熟就先去资源页按路线补。',
              link: { href: '/components', label: '打开组件总览' },
            },
            {
              step: '2',
              t: '看图形示例，动手点一点',
              d: '每个示例都是可交互的：开关能切、按钮有涟漪。点示例右下角的代码图标看实现。',
              link: { href: '/components/elevated-button', label: '试一个例子' },
            },
            {
              step: '3',
              t: '组件够用了，就去搭真实项目',
              d: '在真实工程结构里用组件，比在空文件里背属性表快得多。',
              link: { href: '/handbook', label: '开始工程化搭建' },
            },
          ].map((x) => (
            <div
              key={x.step}
              className="relative flex flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-[14px] font-bold text-white shadow-sm">
                {x.step}
              </span>
              <h3 className="mt-3.5 text-[14.5px] font-semibold leading-snug text-ink-900">
                {x.t}
              </h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-600">
                {x.d}
              </p>
              <Link
                href={x.link.href}
                className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-600 transition hover:gap-1.5 hover:underline"
              >
                {x.link.label}
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ 是 / 不是 ══════════ */}
      <section className="mt-14 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ok/25 bg-gradient-to-b from-ok/[.05] to-white p-5">
          <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-ink-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ok/15 text-ok">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            它会帮你解决
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              ['看得懂文档，但不知道什么时候用', '每个组件都有「适合用 / 别用」两栏，直接对应真实决策。'],
              ['照着示例写，跑出来和想的不一样', '示例讲完就讲「注意」—— 专治看起来对、其实不生效的写法。'],
              ['属性表太长不知道改哪个', '官方 30 个参数，这里只列新手真正会动的 5~10 个。'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
                <span>
                  <span className="block text-[13px] font-medium text-ink-900">{t}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-500">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-danger/25 bg-gradient-to-b from-danger/[.05] to-white p-5">
          <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-ink-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/15 text-danger">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
            别指望它做的事
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              ['全量 API 参考', '要精确签名请查官方文档，这里刻意只留高频参数。'],
              ['炫酷组件大合集', '没有特效库、没有第三方套件，只有 Material 原生。'],
              ['覆盖每一个组件', '低频组件（如 DataTable 进阶用法）故意不讲。宁可少而实。'],
              ['示例直接拼成整个 App', '示例是片段。完整项目骨架在工程化搭建指南里。'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                <span>
                  <span className="block text-[13px] font-medium text-ink-900">{t}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-500">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════ 组件页结构 ══════════ */}
      <section className="mt-14 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          <div className="border-b border-ink-100 bg-ink-50/50 p-6 lg:border-b-0 lg:border-r">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink-900">
              每个组件页面的固定结构
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
              从上到下按「先判断、再看细节」排。右上角的「本页目录」可以随时跳转；
              看完第一段觉得不合适，直接返回换组件，不用浪费时间。
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50/60 px-3.5 py-2.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 16v-5M12 8h.01" strokeLinecap="round" />
              </svg>
              <p className="text-[12px] leading-relaxed text-ink-700">
                示例默认只显示效果，点每个示例<b>右下角的代码图标</b>展开源码 —— 和 Element Plus 一样。
              </p>
            </div>
          </div>

          <ol className="p-6">
            {[
              ['组件说明 + 关键特性', '先判断适不适合你的场景'],
              ['适合用 / 别用', '最值钱的一栏，别跳过'],
              ['属性表', '红点 = 必填；注意 \'false\' 字符串和布尔 false'],
              ['代码示例（可交互）', '效果可以直接点，代码右下角展开'],
              ['相关组件', '同一需求的多个解法，帮你找到更合适的写法'],
            ].map(([t, d], i, arr) => (
              <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                {/* 竖线 */}
                {i < arr.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[11px] top-6 h-full w-px bg-ink-100"
                  />
                )}
                <span className="z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10.5px] font-bold text-brand-600 ring-4 ring-white">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-ink-900">{t}</span>
                  <span className="mt-0.5 block text-[12px] text-ink-500">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════ 分类总览 ══════════ */}
      <section className="mt-14">
        <SectionHead title="分类总览" sub="按用途分成 8 类。点击分类名直达总览页对应位置。" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {categories
            .map((c) => ({ c, items: getComponentsByCategory(c.id) }))
            .filter((g) => g.items.length > 0)
            .map((g, i) => (
              <Link
                key={g.c.id}
                href={`/components#${g.c.id}`}
                className={`group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop ${
                  i % 2 === 1 ? 'sm:bg-white' : ''
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/60 font-mono text-[13px] font-bold text-brand-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink-900 group-hover:text-brand-600">
                      {g.c.name}
                    </span>
                    <span className="rounded bg-ink-50 px-1.5 py-px text-[10.5px] font-medium text-ink-500">
                      {g.items.length}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-ink-500">
                    {g.items
                      .slice(0, 4)
                      .map((x) => x.name)
                      .join(' · ')}
                    {g.items.length > 4 ? ' …' : ''}
                  </span>
                </span>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
        </div>
      </section>

      {/* ══════════ 推荐节奏 ══════════ */}
      <section className="mt-14">
        <SectionHead title="不知道从哪开始？按这个节奏走" sub="组件 → 项目，缺什么补什么，不用一口气全学完。" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              day: '第 1 天',
              t: '布局四件套',
              d: 'Row / Column / Stack / Expanded 决定了你对 Flutter 布局的心智模型。没搞懂它们，后面全是玄学。',
              href: '/components#layout',
              cta: '去看布局组件',
            },
            {
              day: '第 2~3 天',
              t: '最高频交互组件',
              d: 'TextField、Button、ListView 出现频率最高。重点看示例里的「注意事项」。',
              href: '/components#input',
              cta: '去看输入组件',
            },
            {
              day: '第 4 天起',
              t: '搭真实项目',
              d: '组件够用了就开工程。在真实结构里用，比背属性表快得多。',
              href: '/resources',
              cta: '进入资源页',
            },
          ].map((x) => (
            <div
              key={x.t}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
                {x.day}
              </span>
              <h3 className="mt-1.5 text-[15px] font-semibold text-ink-900">{x.t}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">{x.d}</p>
              <Link
                href={x.href}
                className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-600 transition hover:gap-1.5 hover:underline"
              >
                {x.cta}
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-[20px] font-semibold tracking-tight text-ink-900">
        <span className="h-5 w-1 rounded-full bg-brand-500" />
        {title}
      </h2>
      {sub && <p className="mt-1.5 pl-3.5 text-[13px] text-ink-500">{sub}</p>}
    </div>
  );
}
