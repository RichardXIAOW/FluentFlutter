import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  allComponents,
  getComponent,
  getComponentsByCategory,
} from '@/data';
import { categoryMap } from '@/data/categories';
import Sidebar from '@/components/Sidebar';
import TocRail from '@/components/TocRail';
import PropTable from '@/components/PropTable';
import DemoPreview from '@/components/DemoPreview';
import MockBox from '@/components/MockBox';
import CodeBlock from '@/components/CodeBlock';

/** 静态导出所有组件页 —— Vercel 上直接是静态 HTML，无需函数计算 */
export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = getComponent(params.slug);
  if (!c) return { title: '组件不存在' };
  return {
    title: `${c.name} · ${c.title}`,
    description: c.summary,
    keywords: [c.name, c.title, ...(c.tags ?? [])],
  };
}

export default function ComponentPage({
  params,
}: {
  params: { slug: string };
}) {
  const c = getComponent(params.slug);
  if (!c) notFound();

  const cat = categoryMap.get(c.category);
  const siblings = getComponentsByCategory(c.category).filter(
    (x) => x.slug !== c.slug,
  );

  // 右侧「本页目录」锚点（TocRail 渲染，滚动时自动高亮）
  const anchors: { id: string; label: string }[] = [
    { id: 'intro', label: '组件说明' },
    ...(c.props.length ? [{ id: 'api', label: '属性' }] : []),
    ...c.demos.map((d, i) => ({ id: `demo-${i + 1}`, label: d.title })),
    ...(c.related?.length ? [{ id: 'related', label: '相关组件' }] : []),
  ];

  return (
    <div className="mx-auto flex max-w-page">
      <Sidebar activeSlug={c.slug} />

      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        {/* 面包屑 */}
        <nav className="flex items-center gap-1.5 text-[12px] text-ink-400">
          <Link href="/" className="transition hover:text-brand-600">
            首页
          </Link>
          <span>/</span>
          <Link href="/components" className="transition hover:text-brand-600">
            组件
          </Link>
          <span>/</span>
          <Link
            href={`/components#${c.category}`}
            className="transition hover:text-brand-600"
          >
            {cat?.name ?? '其他'}
          </Link>
        </nav>

        {/* ── 标题区 ── */}
        <header id="intro" className="mt-3 scroll-mt-24">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-[26px] font-bold tracking-tight text-ink-900 sm:text-[30px]">
              {c.name}
            </h1>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[12px] font-medium text-brand-600">
              {c.title}
            </span>
            {cat && (
              <span className="rounded-md border border-ink-200 px-2 py-0.5 text-[11.5px] text-ink-500">
                {cat.name}
              </span>
            )}
          </div>

          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">
            {c.summary}
          </p>

          {c.import && (
            <p className="mt-3 text-[12.5px] text-ink-500">
              引入：
              <code className="ml-1 rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[12px] text-ink-700">
                import '{c.import}';
              </code>
            </p>
          )}

          {/* 关键特性 */}
          {c.highlights?.length ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {c.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 rounded-xl border border-ink-100 bg-white p-3 text-[12.5px] leading-relaxed text-ink-600 shadow-card"
                >
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        {/* ── 图形示例：一眼看到这个组件长什么样 ── */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/70 px-4 py-2">
            <span className="text-[11.5px] font-medium text-ink-500">组件效果</span>
            <span className="text-[10.5px] text-ink-400">
              HTML 复刻的典型外观，细节以真实 Flutter 渲染为准
            </span>
          </div>
          {<MockBox slug={c.slug} />}
        </section>

        {/* ── 什么时候用 / 别用 ── */}
        {c.whenToUse ? (
          <section className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-ok/25 bg-ok/[.04] p-4">
              <h2 className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-900">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-ok" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                适合用
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {c.whenToUse.do.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-700">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ok" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {c.whenToUse.dont?.length ? (
              <div className="rounded-2xl border border-danger/25 bg-danger/[.04] p-4">
                <h2 className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-900">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-danger" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                  别用（或要小心）
                </h2>
                <ul className="mt-2.5 space-y-1.5">
                  {c.whenToUse.dont.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-700">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-danger" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ── 补充说明 ── */}
        {c.notes ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 16v-5M12 8h.01" strokeLinecap="round" />
            </svg>
            <p className="text-[12.5px] leading-relaxed text-ink-700">{c.notes}</p>
          </div>
        ) : null}

        {/* ── 属性表 ── */}
        <section id="api" className="mt-12 scroll-mt-24">
          <SectionTitle
            title="属性"
            sub={`${c.props.length} 个高频参数。完整签名请查官方 API。`}
          />
          <PropTable rows={c.props} />
        </section>

        {/* ── 示例 ── */}
        <section className="mt-12">
          <SectionTitle
            title="代码示例"
            sub={`${c.demos.length} 个示例，每个都说明「为什么这么写」。`}
          />
          <div className="space-y-5">
            {c.demos.map((d, i) => (
              <DemoPreview
                key={i}
                demo={d}
                index={i}
                defaultPreview={c.defaultPreview}
                defaultImage={c.previewImage}
                mockSlug={c.slug}
              />
            ))}
          </div>
        </section>

        {/* ── 相关组件 ── */}
        {c.related?.length ? (
          <section id="related" className="mt-12 scroll-mt-24">
            <SectionTitle title="相关组件" />
            <div className="flex flex-wrap gap-2">
              {c.related.map((slug) => {
                const r = getComponent(slug);
                if (!r) return null;
                return (
                  <Link
                    key={slug}
                    href={`/components/${slug}`}
                    className="group flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
                  >
                    <code className="font-mono text-[13px] font-medium text-ink-900 group-hover:text-brand-600">
                      {r.name}
                    </code>
                    <span className="text-[11.5px] text-ink-400">{r.title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* ── 同组其他组件 ── */}
        {siblings.length ? (
          <section className="mt-12 border-t border-ink-100 pt-8">
            <h2 className="text-[13px] font-semibold text-ink-500">
              {cat?.name} 里的其他组件
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/components/${s.slug}`}
                  className="rounded-lg border border-ink-100 bg-white px-2.5 py-1.5 font-mono text-[12px] text-ink-600 transition hover:border-brand-200 hover:text-brand-600"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── 引申阅读 ── */}
        <section className="mt-12 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">
            想在真实项目里用起来？
          </h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
            组件知道怎么用了，但项目该怎么搭？这份指南从目录结构、环境分档、网络层到发布构建，
            带你做一遍完整的工程化搭建。
          </p>
          <Link
            href="/handbook"
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 text-[13px] font-medium text-white transition hover:bg-brand-600"
          >
            查看工程化搭建指南
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </main>

      {/* 右侧「本页目录」（Element Plus 同款，窄屏自动隐藏） */}
      <TocRail anchors={anchors} />
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink-900">
        <span className="h-4 w-1 rounded-full bg-brand-500" />
        {title}
      </h2>
      {sub && <p className="ml-3 mt-1 text-[12.5px] text-ink-500">{sub}</p>}
    </div>
  );
}
