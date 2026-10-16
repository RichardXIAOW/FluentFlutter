'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { getComponentsByCategory } from '@/data';
import SearchBox from './SearchBox';

/**
 * 顶部导航
 *
 * 桌面端：横向排列 + 搜索框
 * 移动端：汉堡按钮 → 抽屉式侧边导航（由 Sidebar 的 mobile 模式承载）
 */
export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 路由变化时自动收起移动端菜单 —— 忘了这步用户点完还要自己关
  useEffect(() => setMobileOpen(false), [pathname]);

  const groups = useMemo(
    () =>
      categories
        .map((c) => ({ cat: c, items: getComponentsByCategory(c.id) }))
        .filter((g) => g.items.length > 0),
    [],
  );

  const nav = [
    { href: '/', label: '首页' },
    { href: '/guide', label: '指南' },
    { href: '/components', label: '组件' },
    { href: '/resources', label: '资源' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/components') return pathname.startsWith('/components');
    // 「资源」tab 覆盖资源索引页与工程化搭建指南
    if (href === '/resources') return pathname.startsWith('/resources') || pathname.startsWith('/handbook');
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-[var(--hd-h)] border-b border-ink-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-page items-center gap-4 px-4 sm:px-6">
          {/* 移动端菜单按钮 */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="打开导航菜单"
            aria-expanded={mobileOpen}
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-600 transition hover:bg-ink-50 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                {/* Flutter 风格的简化双菱形 */}
                <path d="M13.9 2 6.4 9.5l2.6 2.6L19 2h-5.1Z" opacity=".95" />
                <path d="M9 12.1 6.4 14.7 12.6 21H18l-6.4-6.4 1.4-1.4L9 12.1Z" opacity=".7" />
              </svg>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <strong className="text-[18px] font-semibold tracking-tight text-ink-900">
                FluentFlutter
              </strong>
              <span className="mt-0.5 text-[13.5px] text-ink-400">
                Flutter · 从入门到工程化
              </span>
            </span>
          </Link>

          {/* 主导航 */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3.5 py-2 text-[15.5px] font-medium transition ${
                  isActive(n.href)
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchBox className="hidden w-[280px] sm:block" />
            <a
              href="https://api.flutter.dev/flutter/material/material-library.html"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-3.5 text-[14px] font-medium text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 md:flex"
            >
              官方 API
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* 移动端抽屉 */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[var(--hd-h)] z-30 max-h-[calc(100vh-var(--hd-h))] overflow-y-auto border-b border-ink-100 bg-white px-4 pb-6 pt-4 shadow-pop anim-in thin-scroll lg:hidden">
          <SearchBox className="mb-4" />

          <div className="mb-4 flex flex-wrap gap-1.5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-1.5 text-[16px] font-medium transition ${
                  isActive(n.href)
                    ? 'bg-brand-500 text-white'
                    : 'bg-ink-50 text-ink-600'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>

          {groups.map((g) => (
            <section key={g.cat.id} className="mb-4">
              <h3 className="mb-1.5 text-[14px] font-semibold uppercase tracking-wider text-ink-400">
                {g.cat.name}
              </h3>
              <div className="flex flex-wrap gap-1">
                {g.items.map((it) => (
                  <Link
                    key={it.slug}
                    href={`/components/${it.slug}`}
                    className={`rounded-md px-2 py-1 font-mono text-[14.5px] transition ${
                      pathname === `/components/${it.slug}`
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    {it.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
