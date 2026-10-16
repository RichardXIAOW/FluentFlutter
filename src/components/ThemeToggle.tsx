'use client';

import { useEffect, useState } from 'react';

/**
 * 主题切换：浅色 / 深色 / 跟随系统
 *
 * 几个必要的细节：
 * - 用 localStorage 持久化，键名与 layout.tsx 里的防闪烁内联脚本必须一致
 * - 首屏的 class 由内联脚本在绘制前就设好，这里只负责后续切换，避免闪白
 * - 选「跟随系统」时要监听 prefers-color-scheme 变化，否则用户在系统里切了主题页面不跟
 */

const KEY = 'ff-theme';
type Mode = 'light' | 'dark' | 'system';

const OPTIONS: { mode: Mode; label: string; icon: React.ReactNode }[] = [
  {
    mode: 'light',
    label: '浅色',
    icon: (
      <>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
      </>
    ),
  },
  {
    mode: 'dark',
    label: '深色',
    icon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.6 8.6 0 1 0 10.2 10.2Z" />,
  },
  {
    mode: 'system',
    label: '跟随系统',
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="2.2" />
        <path d="M8.5 20h7M12 16.5V20" />
      </>
    ),
  },
];

function resolve(mode: Mode) {
  if (mode === 'light') return false;
  if (mode === 'dark') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('dark');
  const [ready, setReady] = useState(false);

  // 读取已存偏好
  useEffect(() => {
    let initial: Mode = 'dark';
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === 'light' || raw === 'dark' || raw === 'system') initial = raw;
    } catch {
      /* 隐私模式下读不到就用默认 */
    }
    setMode(initial);
    setReady(true);
  }, []);

  // 应用 + 跟随系统时监听变化
  useEffect(() => {
    if (!ready) return;
    const apply = () => {
      const dark = resolve(mode);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode, ready]);

  const pick = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* 写不进去也不影响本次会话 */
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="主题"
      className={`flex shrink-0 items-center gap-0.5 rounded-full border border-ink-200 bg-ink-50 p-0.5 ${className}`}
    >
      {OPTIONS.map((o) => {
        const on = mode === o.mode;
        return (
          <button
            key={o.mode}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.label}
            title={o.label}
            onClick={() => pick(o.mode)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
              on
                ? 'bg-surface text-brand-600 shadow-sm ring-1 ring-ink-200'
                : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[15px] w-[15px]"
              fill={o.mode === 'dark' ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {o.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
