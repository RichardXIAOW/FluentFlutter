'use client';

import { useEffect, useState } from 'react';

/**
 * 详情页右侧的「本页目录」导航条（Element Plus 同款交互）
 *
 * - 只在宽屏（xl 及以上）显示，窄屏隐藏不占位
 * - 滚动时自动高亮当前所在章节
 * - 点击平滑跳到对应锚点
 *
 * 为什么从 Sidebar 挪到这里：参考 Element Plus 的布局 ——
 * 左侧放「全局」导航（组件列表），右侧放「本页」目录，职责分离互不挤占。
 */
export default function TocRail({
  anchors,
}: {
  anchors: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState(anchors[0]?.id ?? '');

  // 滚动定位：找出当前视口里最靠上的那个锚点
  useEffect(() => {
    if (!anchors.length) return;

    const onScroll = () => {
      // 顶部偏移（header 高度 + 一点余量）
      const offset = 90;
      let current = anchors[0].id;
      for (const a of anchors) {
        const el = document.getElementById(a.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = a.id;
        else break;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [anchors]);

  if (!anchors.length) return null;

  return (
    <aside className="sticky top-[var(--hd-h)] hidden h-[calc(100vh-var(--hd-h))] w-[190px] shrink-0 overflow-y-auto py-10 pl-2 pr-3 thin-scroll xl:block">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
        本页目录
      </p>
      <ul className="mt-2 border-l border-ink-100">
        {anchors.map((a) => {
          const on = a.id === activeId;
          return (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                onClick={(e) => {
                  // 平滑滚动；hash 变化交给浏览器，方便刷新后仍定位
                  e.preventDefault();
                  document
                    .getElementById(a.id)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  history.replaceState(null, '', `#${a.id}`);
                  setActiveId(a.id);
                }}
                className={`-ml-px block border-l-2 py-1.5 pl-3 text-[12px] leading-snug transition ${
                  on
                    ? 'border-brand-500 font-medium text-brand-600'
                    : 'border-transparent text-ink-500 hover:border-ink-200 hover:text-ink-800'
                }`}
              >
                {a.label}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
