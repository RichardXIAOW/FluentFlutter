'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchComponents, type SearchHit } from '@/data';

/**
 * 全局搜索框
 *
 * 交互细节（都是「用过才想得到」的）：
 * - Cmd/Ctrl + K 聚焦，ESC 关闭
 * - 上下键移动选中项，回车跳转
 * - 点外部关闭，用 mousedown 而不是 click（避免和结果项的 click 打架）
 * - 结果用绝对定位浮层，不挤压下面的内容
 */
export default function SearchBox({ className = '' }: { className?: string }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hits: SearchHit[] = useMemo(() => searchComponents(q, 10), [q]);

  // 结果变化时把选中项归零，否则会指向一个不存在的位置
  useEffect(() => setActive(0), [q]);

  // Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 点外部关闭
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    setQ('');
    inputRef.current?.blur();
    router.push(`/components/${slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hits.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((v) => (v + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((v) => (v - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(hits[active].slug);
    }
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="搜索组件 / 属性，如 Row、itemBuilder"
          aria-label="搜索组件"
          className="h-10 w-full rounded-lg border border-ink-200 bg-ink-50 pl-10 pr-16 text-[15px] text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[12.5px] text-ink-500">
          ⌘K
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-[52px] z-50 max-h-[420px] overflow-y-auto rounded-xl border border-ink-100 bg-white py-1.5 shadow-pop thin-scroll anim-in">
          {hits.length === 0 ? (
            <p className="px-4 py-6 text-center text-[14.5px] text-ink-500">
              没有找到「{q}」相关的组件
            </p>
          ) : (
            hits.map((h, i) => (
              <button
                key={h.slug}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h.slug)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                  i === active ? 'bg-brand-50' : 'hover:bg-ink-50'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[12.5px] font-semibold ${
                    i === active
                      ? 'bg-brand-500 text-white'
                      : 'bg-ink-100 text-ink-600'
                  }`}
                >
                  {h.name.replace(/[^A-Za-z]/g, '').slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate font-mono text-[15px] font-medium text-ink-900">
                      {h.name}
                    </span>
                    <span className="shrink-0 text-[13px] text-ink-400">
                      {h.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13.5px] text-ink-500">
                    {h.snippet}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
