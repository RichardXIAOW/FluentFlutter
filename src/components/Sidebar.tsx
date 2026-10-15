'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categories } from '@/data/categories';
import { allComponents, getComponentsByCategory } from '@/data';

/**
 * 左侧导航：全部分类 + 组件（activeSlug 高亮当前项）
 *
 * 每个分类都可折叠，折叠状态存 localStorage —— 用户下次回来还能保持。
 * 页内锚点目录在右侧的 TocRail（Element Plus 同款布局）。
 */
const STORAGE_KEY = 'mdocs.collapsed';

export default function Sidebar({
  activeSlug,
}: {
  activeSlug?: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 恢复折叠状态（SSR 阶段没有 localStorage，所以放 useEffect）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCollapsed(JSON.parse(raw));
    } catch {
      /* 忽略解析失败 */
    }
  }, []);

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* 忽略写入失败（隐私模式） */
      }
      return next;
    });
  };

  const groups = categories
    .map((c) => ({ cat: c, items: getComponentsByCategory(c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="sticky top-[var(--hd-h)] hidden h-[calc(100vh-var(--hd-h))] w-[var(--side-w)] shrink-0 overflow-y-auto border-r border-ink-100 px-3 py-6 thin-scroll lg:block">
      {groups.map((g) => {
        const isCollapsed = collapsed[g.cat.id];
        return (
          <section key={g.cat.id} className="mb-3">
            <button
              type="button"
              onClick={() => toggle(g.cat.id)}
              className="group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition hover:bg-ink-50"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-3 w-3 shrink-0 text-ink-400 transition-transform ${
                  isCollapsed ? '-rotate-90' : ''
                }`}
                fill="currentColor"
              >
                <path d="M12 15.5 5.5 9h13L12 15.5Z" />
              </svg>
              <span className="text-[12px] font-semibold tracking-wide text-ink-500 group-hover:text-ink-800">
                {g.cat.name}
              </span>
              <span className="ml-auto text-[10.5px] text-ink-300">
                {g.items.length}
              </span>
            </button>

            {!isCollapsed && (
              <ul className="mt-0.5 space-y-px pl-1">
                {g.items.map((it) => {
                  const on = it.slug === activeSlug;
                  return (
                    <li key={it.slug}>
                      <Link
                        href={`/components/${it.slug}`}
                        className={`flex items-center gap-2 rounded-md px-2.5 py-[5px] text-[13px] transition ${
                          on
                            ? 'bg-brand-50 font-medium text-brand-600'
                            : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                        }`}
                      >
                        <span className="truncate font-mono">{it.name}</span>
                        <span
                          className={`ml-auto truncate text-[11px] ${
                            on ? 'text-brand-400' : 'text-ink-400'
                          }`}
                        >
                          {it.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}

      <p className="mt-6 border-t border-ink-100 px-2 pt-4 text-[11px] leading-relaxed text-ink-400">
        共 {allComponents.length} 个组件
        <br />
        全部内容为手写精选，非 API 文档搬运
      </p>
    </aside>
  );
}
