import Link from 'next/link';
import { categories } from '@/data/categories';
import { allComponents, getComponentsByCategory } from '@/data';
import SearchBox from '@/components/SearchBox';
import DemoShowcase from '@/components/DemoShowcase';

export default function HomePage() {
  const groups = categories
    .map((c) => ({ cat: c, items: getComponentsByCategory(c.id) }))
    .filter((g) => g.items.length > 0);

  // 首页「热门组件」：手工挑几个新手最先要用的
  const featuredSlugs = [
    'row',
    'column',
    'list-view',
    'text-field',
    'elevated-button',
    'card',
    'navigation-bar',
    'snack-bar',
  ];
  const featured = featuredSlugs
    .map((s) => allComponents.find((c) => c.slug === s)!)
    .filter(Boolean);

  return (
    <main id="main">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-canvas">
        {/* 细网格底纹：科技感来源，靠渐隐遮罩收边，避免纹理顶到边界显得脏 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid mask-fade-radial" />
        {/* 两团微光：青蓝 + 紫，呼应主色渐变 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[460px] w-[460px] rounded-full bg-brand-400/20 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-24 h-[360px] w-[360px] rounded-full bg-accent-400/20 blur-[110px]"
        />

        <div className="relative mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/[0.08] px-3.5 py-1.5 text-[14px] font-medium text-brand-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              {allComponents.length} 个组件 · 全部手写精选
            </span>

            <h1 className="mt-6 text-balance text-[34px] font-bold leading-[1.15] tracking-tight text-ink-900 sm:text-[48px]">
              Flutter 从入门
              <span className="text-grad"> 到工程化</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[17.5px] leading-relaxed text-ink-600 sm:text-[18.5px]">
              一条线走完：<strong className="font-semibold text-ink-800">Dart 语言</strong> →
              <strong className="font-semibold text-ink-800">框架与组件封装</strong> →
              <strong className="font-semibold text-ink-800">67 个 Material 组件</strong> →
              <strong className="font-semibold text-ink-800">工程化搭建</strong>。
              不搬运 API 文档，只讲长什么样、什么场景该用、新手最容易踩什么坑。
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBox />
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/components"
                className="flex h-11 items-center gap-1.5 rounded-lg bg-grad-brand px-5 text-[16px] font-medium text-white shadow-glow-sm transition hover:brightness-110"
              >
                浏览全部组件
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/resources"
                className="flex h-11 items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-5 text-[16px] font-medium text-ink-700 transition hover:border-brand-400/60 hover:text-brand-600"
              >
                学习资源
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 一组真实的代码 → 效果对照，让首屏就有"内容很实"的感觉 */}
          <div className="mt-12">
            <DemoShowcase />
          </div>
        </div>
      </section>

      {/* ── 分类导航 ── */}
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[23px] font-semibold tracking-tight text-ink-900">
              按用途查找
            </h2>
            <p className="mt-1 text-[16px] text-ink-500">
              同一个东西往往有多个名字。想不起类名时，按「你想干什么」找更快。
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <Link
              key={g.cat.id}
              href={`/components#${g.cat.id}`}
              className="group flex flex-col rounded-xl border border-ink-100 bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-semibold text-ink-900 group-hover:text-brand-600">
                  {g.cat.name}
                </h3>
                <span className="rounded bg-ink-50 px-1.5 py-px text-[13.5px] font-medium text-ink-500">
                  {g.items.length}
                </span>
              </div>
              <p className="mt-1.5 flex-1 text-[15.5px] leading-relaxed text-ink-500">
                {g.cat.desc}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {g.items.slice(0, 4).map((it) => (
                  <span
                    key={it.slug}
                    className="rounded border border-ink-100 bg-ink-50/60 px-1.5 py-0.5 font-mono text-[13.5px] text-ink-500"
                  >
                    {it.name}
                  </span>
                ))}
                {g.items.length > 4 && (
                  <span className="px-1 py-0.5 text-[13.5px] text-ink-400">
                    +{g.items.length - 4}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 新手最常用 ── */}
      <section className="border-y border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-page px-4 py-14 sm:px-6">
          <h2 className="text-[23px] font-semibold tracking-tight text-ink-900">
            刚上手先看这几个
          </h2>
          <p className="mt-1 text-[16px] text-ink-500">
            这 8 个组件能覆盖你前两周 80% 的界面需求。学完它们再回头看别的会快很多。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="group flex flex-col rounded-xl border border-ink-100 bg-surface p-4 transition hover:border-brand-300 hover:shadow-card"
              >
                <code className="font-mono text-[16.5px] font-semibold text-ink-900 group-hover:text-brand-600">
                  {c.name}
                </code>
                <span className="mt-0.5 text-[14.5px] text-ink-400">{c.title}</span>
                <p className="mt-2 line-clamp-3 text-[15.5px] leading-relaxed text-ink-600">
                  {c.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 资源入口 ── */}
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-surface p-6 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[14px] font-medium text-brand-600 shadow-sm">
                五步学习路线
              </span>
              <h2 className="mt-3 text-[23px] font-semibold tracking-tight text-ink-900 sm:text-[26px]">
                从零基础到能独立交付
              </h2>
              <p className="mt-2 max-w-2xl text-[16.5px] leading-relaxed text-ink-600">
                Dart 语言 → Flutter 框架 → 组件手册 → 工程化搭建 → 实战教程。
                按依赖关系排好，每站都不需要「学完才走下一步」——
                够用就往前走，卡住了再回来查。
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[15.5px] text-ink-600">
                {[
                  'Dart 语言：基础 + 高级语法',
                  'Flutter 讲解：框架与组件封装',
                  '67 个组件 · 134 个示例',
                  '工程化搭建 · 选型到上架',
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/resources"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-grad-brand px-5 text-[17px] font-medium text-white shadow-sm transition hover:brightness-110"
            >
              进入学习路线
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
