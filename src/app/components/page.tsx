import type { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { allComponents, getComponentsByCategory } from '@/data';
import Sidebar from '@/components/Sidebar';
import MockBox from '@/components/MockBox';

export const metadata: Metadata = {
  title: '全部组件',
  description: `按分类浏览 ${allComponents.length} 个 Flutter Material 组件的中文说明、示例与属性表。`,
};

export default function ComponentsPage() {
  const groups = categories
    .map((c) => ({ cat: c, items: getComponentsByCategory(c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto flex max-w-page">
      <Sidebar />

      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <header className="border-b border-ink-100 pb-6">
          <h1 className="text-[26px] font-bold tracking-tight text-ink-900 sm:text-[30px]">
            全部组件
          </h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink-600">
            共 <strong className="font-semibold text-ink-900">{allComponents.length}</strong> 个组件，
            按用途分成 {groups.length} 组。这里不追求穷举 Material 的全部 API，
            而是挑出<strong className="font-semibold text-ink-900">你真正会用到的那些</strong>，
            讲清楚它们之间的差别。
          </p>

          {/* 分类快捷跳转 */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {groups.map((g) => (
              <a
                key={g.cat.id}
                href={`#${g.cat.id}`}
                className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-[12px] text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
              >
                {g.cat.name}
                <span className="ml-1 text-ink-400">{g.items.length}</span>
              </a>
            ))}
          </div>
        </header>

        {groups.map((g) => (
          <section key={g.cat.id} id={g.cat.id} className="mt-10 scroll-mt-24">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="flex items-center gap-2 text-[19px] font-semibold tracking-tight text-ink-900">
                <span className="h-4 w-1 rounded-full bg-brand-500" />
                {g.cat.name}
              </h2>
              <span className="rounded bg-ink-50 px-1.5 py-px text-[11px] font-medium text-ink-500">
                {g.items.length}
              </span>
              {g.cat.desc && (
                <p className="text-[12.5px] text-ink-500">{g.cat.desc}</p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/components/${c.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
                >
                  {/* 图形示例条：直接看到组件长什么样 */}
                  <div className="border-b border-ink-100 bg-ink-50/40 transition group-hover:bg-brand-50/40">
                    <MockBox slug={c.slug} />
                  </div>

                  <div className="flex flex-1 flex-col p-4 pt-3">
                    <div className="flex items-baseline gap-2">
                      <code className="font-mono text-[14px] font-semibold text-ink-900 group-hover:text-brand-600">
                        {c.name}
                      </code>
                      <span className="truncate text-[11.5px] text-ink-400">
                        {c.title}
                      </span>
                    </div>

                    <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-600">
                      {c.summary}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-400">
                      <span>{c.props.length} 个属性</span>
                      <span className="h-3 w-px bg-ink-200" />
                      <span>{c.demos.length} 个示例</span>
                      {c.whenToUse?.dont?.length ? (
                        <>
                          <span className="h-3 w-px bg-ink-200" />
                          <span className="text-danger/80">
                            {c.whenToUse.dont.length} 个坑
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6">
          <h2 className="text-[17px] font-semibold text-ink-900">
            组件的下一步：把它们组织成项目
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-600">
            会写 67 个组件不等于会写项目。真实项目的难点在于：配置怎么分环境、
            网络层怎么统一错误、路由怎么写才不乱、发布构建怎么不出错。
            这份指南把这些问题按 14 个阶段拆成可执行步骤，每步都带验证方法。
          </p>
          <Link
            href="/handbook"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[13.5px] font-medium text-white transition hover:bg-brand-600"
          >
            阅读工程化搭建指南
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </main>
    </div>
  );
}
