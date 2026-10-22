'use client';

import { useEffect, useState } from 'react';

const QQ_NUMBER = '2932257007';

/**
 * QQ 号复制按钮（关于页专用）
 *
 * 点击复制 QQ 号，短暂显示「已复制」反馈 —— 复制成功由剪贴板 API 的
 * resolve 驱动，不复制假反馈。
 */
export default function QQCopyButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(QQ_NUMBER)
          .then(() => setCopied(true))
          .catch(() => {});
      }}
      title="点击复制 QQ 号"
      className={`flex h-10 items-center gap-1.5 rounded-xl border px-4 text-[16.5px] font-medium transition ${
        copied
          ? 'border-ok/40 bg-ok/10 text-ok'
          : 'border-ink-200 bg-surface text-ink-700 hover:border-brand-300 hover:text-brand-600'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        {copied ? (
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M8.5 4C5.5 4 3 6.2 3 9c0 1.7.9 3.1 2.2 4-.2 1.3-.8 2.4-1.7 3.2 1.5.1 2.9-.4 4-1.3.3 0 .7.1 1 .1M15.5 9c1.4 0 2.7.4 3.8 1.1.4-1 .4-2-.1-3.1M17 20.5c2.8-.5 4.5-2.4 4.5-4.7 0-2.9-2.5-5-5.5-5s-5.5 2.1-5.5 5 2.5 5 5.5 5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      {copied ? '已复制' : `QQ：${QQ_NUMBER}`}
    </button>
  );
}
