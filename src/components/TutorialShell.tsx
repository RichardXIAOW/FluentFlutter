'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import CodeBlock from './CodeBlock';
import type { Chapter, Block, Section } from '@/data/tutorials/types';

/**
 * 教程页外壳（Dart / Flutter 两页共用）
 *
 * 版式目标：长文可读 + 结构可见 + 随时能定位。
 *   - Hero：这条路线走到哪一步、这页有多少内容、大概要多久
 *   - 左栏：章节分组导航，带编号块与当前行进条
 *   - 正文：小节用「编号 + 标题 + 导语 + 内容块」四段式，
 *           每个小节顶部有一条细进度线，滚动到哪一眼看得出来
 *   - 右栏：本页小节（细线指示器）
 *
 * 内容块支持 6 种：p / code / note / list / table / term。
 */

/** 依据内容块数量估算阅读时长（每个代码块按 1.5 分钟、每段文字按 40 秒粗算） */
function estimateMinutes(chapters: Chapter[]) {
  let code = 0;
  let text = 0;
  for (const c of chapters)
    for (const s of c.sections)
      for (const b of s.blocks) {
        if (b.kind === 'code') code += 1;
        else text += 1;
      }
  return Math.max(5, Math.round((code * 1.5 + text * 0.7) / 5) * 5);
}

export default function TutorialShell({
  eyebrow,
  title,
  intro,
  chapters,
  siblings,
  accent = 'brand',
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  chapters: Chapter[];
  siblings?: {
    prev?: { href: string; label: string };
    next?: { href: string; label: string };
  };
  /** 主题色，用于章节编号块 —— 两页区分一下 */
  accent?: 'brand' | 'violet';
}) {
  const flat = useMemo(() => chapters.flatMap((c) => c.sections), [chapters]);
  const [active, setActive] = useState<string>(flat[0]?.id ?? '');
  const [progress, setProgress] = useState(0);

  // 滚动高亮 + 阅读进度
  useEffect(() => {
    const onScroll = () => {
      let cur = flat[0]?.id ?? '';
      for (const s of flat) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) cur = s.id;
        else break;
      }
      setActive(cur);

      // 阅读进度：从正文顶部到正文底部
      const main = document.getElementById('tut-body');
      if (main) {
        const { top, height } = main.getBoundingClientRect();
        const vh = window.innerHeight;
        const done = Math.min(1, Math.max(0, (140 - top) / Math.max(1, height - vh + 140)));
        setProgress(done);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [flat]);

  const minutes = useMemo(() => estimateMinutes(chapters), [chapters]);
  const codeCount = useMemo(
    () =>
      chapters.reduce(
        (n, c) => n + c.sections.reduce((m, s) => m + s.blocks.filter((b) => b.kind === 'code').length, 0),
        0,
      ),
    [chapters],
  );

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  const currentChapter = chapters.find((c) => c.sections.some((s) => s.id === active));

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6">
      {/* ══ Hero ══ */}
      <header className="relative mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
        {/* 装饰 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-[280px] w-[280px] rounded-full bg-brand-100/50 blur-3xl"
        />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[14px] font-medium text-brand-700">
                {eyebrow}
              </span>
              <span className="text-[14.5px] text-ink-400">
                {chapters.length} 章 · {flat.length} 节 · {codeCount} 个代码块
              </span>
            </div>

            <h1 className="mt-3.5 text-[33px] font-bold leading-tight tracking-tight text-ink-900 sm:text-[42px]">
              {title}
            </h1>
            <div className="mt-3.5 max-w-2xl text-[17px] leading-[1.9] text-ink-600">{intro}</div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => jump(flat[0]?.id ?? '')}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-brand-500 px-4 text-[16.5px] font-medium text-white shadow-sm transition hover:bg-brand-600"
              >
                从第一节开始
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {siblings?.next && (
                <Link
                  href={siblings.next.href}
                  className="flex h-10 items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-4 text-[16.5px] font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
                >
                  直接看 {siblings.next.label}
                </Link>
              )}
            </div>
          </div>

          {/* 右侧：章节目录卡 */}
          <div className="min-w-0">
            <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
              <p className="text-[13.5px] font-semibold uppercase tracking-wider text-ink-400">
                本页章节
              </p>
              <ol className="mt-2.5 space-y-1.5">
                {chapters.map((c, i) => {
                  const done = currentChapter && chapters.indexOf(currentChapter) > i;
                  const isCur = currentChapter?.id === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => jump(c.sections[0]?.id ?? '')}
                        className={`group flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition ${
                          isCur ? 'bg-white shadow-sm' : 'hover:bg-white/70'
                        }`}
                      >
                        <span
                          className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[13.5px] font-bold ${
                            isCur
                              ? 'bg-brand-500 text-white'
                              : done
                                ? 'bg-ok/15 text-ok'
                                : 'bg-white text-ink-400 ring-1 ring-ink-100'
                          }`}
                        >
                          {done ? '✓' : i + 1}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-[15.5px] font-medium leading-snug ${
                              isCur ? 'text-brand-700' : 'text-ink-700'
                            }`}
                          >
                            {c.title}
                          </span>
                          <span className="mt-0.5 block text-[13.5px] text-ink-400">
                            {c.sections.length} 节
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 border-t border-ink-100 pt-2.5 text-[13.5px] text-ink-400">
                预计阅读 <span className="font-mono text-ink-600">{minutes}</span> 分钟 · 建议边读边敲
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ══ 主体三栏 ══ */}
      <div className="mt-6 flex gap-8 pb-10">
        {/* ── 左：章节导航 ── */}
        <aside className="hidden w-[248px] shrink-0 lg:block">
          <nav className="sticky top-[calc(var(--hd-h)+24px)] max-h-[calc(100vh-var(--hd-h)-48px)] overflow-y-auto pr-1 thin-scroll">
            <p className="mb-2.5 px-2 text-[13.5px] font-semibold uppercase tracking-wider text-ink-400">
              目录
            </p>
            {chapters.map((c) => (
              <div key={c.id} className="mb-4">
                <p className="mb-1 flex items-center gap-1.5 px-2 text-[14.5px] font-semibold text-ink-800">
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                  {c.no} · {c.title}
                </p>
                <ul className="space-y-px">
                  {c.sections.map((s) => {
                    const on = active === s.id;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            jump(s.id);
                          }}
                          className={`flex gap-2 rounded-lg py-1.5 pl-3 pr-2 text-[15px] leading-snug transition ${
                            on
                              ? 'bg-brand-50 font-medium text-brand-700'
                              : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
                          }`}
                        >
                          <span
                            className={`shrink-0 font-mono text-[13.5px] leading-[1.7] ${
                              on ? 'text-brand-500' : 'text-ink-300'
                            }`}
                          >
                            {s.title.split(' ')[0]}
                          </span>
                          <span className="min-w-0">{s.title.split(' ').slice(1).join(' ')}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* ── 中：正文 ── */}
        <main id="main" className="min-w-0 flex-1">
          {/* 移动端目录 */}
          <details className="mb-6 overflow-hidden rounded-2xl border border-ink-100 bg-white lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-[16px] font-medium text-ink-800">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
              </svg>
              本页目录（{flat.length} 节）
            </summary>
            <div className="border-t border-ink-100 px-3 py-2">
              {chapters.map((c) => (
                <div key={c.id} className="py-1.5">
                  <p className="px-1 text-[14px] font-semibold text-ink-500">
                    {c.no} · {c.title}
                  </p>
                  <ul className="mt-1">
                    {c.sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            jump(s.id);
                          }}
                          className="block rounded px-2 py-1 text-[15.5px] text-ink-600 hover:bg-ink-50"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>

          <div id="tut-body">
            {chapters.map((c, ci) => (
              <section key={c.id} className={ci > 0 ? 'mt-14' : ''}>
                {/* 章节头 */}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 font-mono text-[18px] font-bold text-white shadow-sm">
                    {ci}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold uppercase tracking-wider text-brand-500">
                      {c.no}
                    </p>
                    <h2 className="text-[24px] font-bold tracking-tight text-ink-900">{c.title}</h2>
                  </div>
                </div>
                {c.lead && (
                  <p className="mt-3 rounded-xl border-l-[3px] border-brand-200 bg-brand-50/40 px-4 py-2.5 text-[16.5px] leading-relaxed text-ink-600">
                    {c.lead}
                  </p>
                )}

                {c.sections.map((s) => (
                  <SectionView key={s.id} s={s} />
                ))}
              </section>
            ))}
          </div>

          {/* 上一站 / 下一站 */}
          {siblings && (
            <nav className="mt-16 grid gap-3 border-t border-ink-100 pt-6 sm:grid-cols-2">
              {siblings.prev ? (
                <Link
                  href={siblings.prev.href}
                  className="group flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 transition hover:border-brand-200 hover:shadow-card"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500 transition group-hover:bg-brand-50 group-hover:text-brand-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] uppercase tracking-wide text-ink-400">上一站</span>
                    <span className="block truncate text-[16.5px] font-medium text-ink-800 group-hover:text-brand-600">
                      {siblings.prev.label}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {siblings.next && (
                <Link
                  href={siblings.next.href}
                  className="group flex items-center justify-end gap-3 rounded-2xl border border-ink-100 bg-white p-4 text-right transition hover:border-brand-200 hover:shadow-card"
                >
                  <span className="min-w-0">
                    <span className="block text-[13.5px] uppercase tracking-wide text-ink-400">下一站</span>
                    <span className="block truncate text-[16.5px] font-medium text-ink-800 group-hover:text-brand-600">
                      {siblings.next.label}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              )}
            </nav>
          )}
        </main>

        {/* ── 右：本页小节 ── */}
        <aside className="hidden w-[204px] shrink-0 xl:block">
          <nav className="sticky top-[calc(var(--hd-h)+24px)] max-h-[calc(100vh-var(--hd-h)-48px)] overflow-y-auto thin-scroll">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13.5px] font-semibold uppercase tracking-wider text-ink-400">
                本页小节
              </p>
              <span className="font-mono text-[13px] text-ink-400">
                {Math.max(1, flat.findIndex((s) => s.id === active) + 1)}/{flat.length}
              </span>
            </div>
            {/* 进度条 */}
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-[width] duration-150"
                style={{ width: `${Math.max(4, progress * 100)}%` }}
              />
            </div>
            <ul className="border-l border-ink-100">
              {flat.map((s) => {
                const on = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        jump(s.id);
                      }}
                      className={`-ml-px block border-l-2 py-1.5 pl-3 pr-1 text-[14.5px] leading-snug transition ${
                        on
                          ? 'border-brand-500 font-medium text-brand-600'
                          : 'border-transparent text-ink-400 hover:border-ink-200 hover:text-ink-700'
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}

/* ════════════════ 小节 ════════════════ */

function SectionView({ s }: { s: Section }) {
  // 标题形如「0.1 类型：…」—— 把编号拆出来单独排版
  const m = s.title.match(/^([\d.]+)\s+(.*)$/);
  const num = m ? m[1] : null;
  const text = m ? m[2] : s.title;

  return (
    <article id={s.id} className="scroll-mt-24 pt-9">
      <h3 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[20px] font-bold leading-snug text-ink-900">
        {num && (
          <span className="shrink-0 font-mono text-[16px] font-semibold text-brand-500">{num}</span>
        )}
        <span className="min-w-0">{text}</span>
        {s.level && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[13.5px] font-medium ${
              s.level === '基础'
                ? 'bg-ok/10 text-ok'
                : s.level === '进阶'
                  ? 'bg-warn/10 text-warn'
                  : 'bg-brand-50 text-brand-600'
            }`}
          >
            {s.level}
          </span>
        )}
      </h3>
      {s.summary && (
        <p className="mt-1.5 text-[16.5px] leading-relaxed text-ink-500">{s.summary}</p>
      )}
      <div className="mt-4 space-y-3.5">
        {s.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </div>
    </article>
  );
}

/* ════════════════ 内容块 ════════════════ */

const INLINE =
  '[&_b]:font-semibold [&_b]:text-ink-900 [&_strong]:font-semibold [&_strong]:text-ink-900 ' +
  '[&_code]:mx-px [&_code]:rounded [&_code]:border [&_code]:border-ink-100 [&_code]:bg-ink-50 ' +
  '[&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-brand-700';

const NOTE_TONE = {
  ok: { bar: 'border-ok', bg: 'bg-ok/[0.055]', label: 'text-ok', icon: 'M20 6 9 17l-5-5' },
  warn: { bar: 'border-warn', bg: 'bg-warn/[0.06]', label: 'text-warn', icon: 'M12 8v5M12 17h.01' },
  bad: { bar: 'border-danger', bg: 'bg-danger/[0.055]', label: 'text-danger', icon: 'M12 8v5M12 17h.01' },
  info: { bar: 'border-info', bg: 'bg-info/[0.055]', label: 'text-info', icon: 'M12 16v-5M12 8h.01' },
} as const;

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return (
        <p
          className={`max-w-[76ch] text-[17px] leading-[1.95] text-ink-600 ${INLINE}`}
          dangerouslySetInnerHTML={{ __html: b.html }}
        />
      );

    case 'code':
      return (
        <CodeBlock
          code={b.code}
          lang={b.lang ?? 'dart'}
          filename={b.filename}
          maxHeight={b.maxHeight ?? 560}
        />
      );

    case 'note': {
      const tone = NOTE_TONE[(b.tone ?? 'info') as keyof typeof NOTE_TONE];
      return (
        <div
          className={`relative max-w-[76ch] overflow-hidden rounded-xl border border-ink-100 ${tone.bg} p-4 pl-5`}
        >
          <span className={`absolute inset-y-0 left-0 w-[3px] ${tone.bar.replace('border-', 'bg-')}`} />
          <div
            className={`text-[16.5px] leading-[1.85] text-ink-700 ${INLINE}`}
            dangerouslySetInnerHTML={{ __html: b.html }}
          />
        </div>
      );
    }

    case 'list':
      return (
        <ul className="max-w-[76ch] space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[16.8px] leading-[1.85] text-ink-600">
              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
              <span className={INLINE} dangerouslySetInnerHTML={{ __html: it }} />
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div className="max-w-[84ch] overflow-hidden rounded-xl border border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[16px]">
              <thead>
                <tr className="bg-ink-50/80">
                  {b.head.map((h, i) => (
                    <th
                      key={i}
                      className="border-b border-ink-100 px-3.5 py-2.5 text-left text-[15px] font-semibold text-ink-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="align-top transition hover:bg-brand-50/40 [&:last-child_td]:border-b-0">
                    {r.map((c, j) => (
                      <td
                        key={j}
                        className={`border-b border-ink-100 px-3.5 py-2.5 text-ink-600 ${INLINE}`}
                        dangerouslySetInnerHTML={{ __html: c }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'term':
      return (
        <dl className="grid max-w-[84ch] gap-2.5 sm:grid-cols-2">
          {b.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink-100 bg-white p-3.5 transition hover:border-brand-200"
            >
              <dt className="flex items-center gap-1.5 font-mono text-[15.5px] font-semibold text-brand-700">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-brand-300" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" strokeLinecap="round" />
                </svg>
                {it.term}
              </dt>
              <dd className={`mt-1.5 text-[16px] leading-[1.8] text-ink-600 ${INLINE}`} dangerouslySetInnerHTML={{ __html: it.desc }} />
            </div>
          ))}
        </dl>
      );

    case 'compare':
      return (
        <div className="max-w-[88ch]">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              { d: b.bad, ok: false },
              { d: b.good, ok: true },
            ].map(({ d, ok }, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-xl border ${
                  ok ? 'border-ok/30 bg-ok/[0.03]' : 'border-danger/30 bg-danger/[0.03]'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 border-b px-3 py-1.5 text-[14px] font-semibold ${
                    ok ? 'border-ok/20 text-ok' : 'border-danger/20 text-danger'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {ok ? (
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                    )}
                  </svg>
                  {d.title ?? (ok ? '推荐写法' : '问题写法')}
                </div>
                <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[15px] leading-[1.7] text-ink-700">
                  <code>{d.code}</code>
                </pre>
              </div>
            ))}
          </div>
          {b.note && (
            <p
              className={`mt-2.5 text-[15.5px] leading-relaxed text-ink-500 ${INLINE}`}
              dangerouslySetInnerHTML={{ __html: b.note }}
            />
          )}
        </div>
      );

    case 'keypoints':
      return (
        <div className="max-w-[80ch] rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-white p-4">
          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-brand-700">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
            </svg>
            {b.title ?? '记住这几条'}
          </p>
          <ul className="mt-2.5 space-y-2">
            {b.items.map((it, i) => (
              <li key={i} className="flex gap-2.5 text-[16.5px] leading-[1.8] text-ink-700">
                <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-500/10 font-mono text-[12.5px] font-bold text-brand-600">
                  {i + 1}
                </span>
                <span className={INLINE} dangerouslySetInnerHTML={{ __html: it }} />
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}
