'use client';

import { useMemo, useState } from 'react';
import { highlight, type Lang } from '@/lib/highlight';

/**
 * 代码块 + 复制按钮
 *
 * 复制功能的几个细节：
 * - navigator.clipboard 只在 https / localhost 可用，所以要 try-catch 兜底
 * - 复制成功后按钮变「已复制」2 秒，给用户明确反馈
 * - 行号用 CSS 计数器生成，不参与复制（用 CSS ::before 不进入选区）
 */
export default function CodeBlock({
  code,
  lang = 'dart',
  showLineNumbers = true,
  maxHeight,
  filename,
}: {
  code: string;
  lang?: Lang;
  showLineNumbers?: boolean;
  /** 超过这个高度就内部滚动，避免长代码把页面撑得很难看 */
  maxHeight?: number;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [wrapped, setWrapped] = useState(false);

  const html = useMemo(() => highlight(code, lang), [code, lang]);
  const lineCount = useMemo(() => code.split('\n').length, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 非安全上下文（http）下 clipboard 不可用，退回到 execCommand
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* 实在不行就静默失败，不弹 alert 打扰用户 */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="group/code overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
      {/* 头部：文件名 / 语言 / 操作 */}
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/70 px-3 py-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>

        {filename ? (
          <span className="ml-1.5 truncate font-mono text-[14.5px] text-ink-500">
            {filename}
          </span>
        ) : (
          <span className="ml-1.5 rounded border border-ink-200 bg-white px-1.5 py-px font-mono text-[13px] uppercase tracking-wide text-ink-500">
            {lang}
          </span>
        )}

        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWrapped((v) => !v)}
            title={wrapped ? '取消自动换行' : '开启自动换行'}
            className={`rounded-md px-1.5 py-1 text-[14px] transition ${
              wrapped
                ? 'bg-brand-50 text-brand-600'
                : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h13a3 3 0 0 1 0 6h-4" strokeLinecap="round" />
              <path d="m14 16-2 2 2 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={copy}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[14px] font-medium transition ${
              copied
                ? 'bg-ok/10 text-ok'
                : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
            }`}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M6 15V6a2 2 0 0 1 2-2h8" strokeLinecap="round" />
                </svg>
                复制
              </>
            )}
          </button>
        </span>
      </div>

      {/* 代码区 */}
      <div
        className="overflow-auto thin-scroll"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre
          className={`m-0 p-0 text-[15.5px] leading-[1.75] ${
            wrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
          }`}
        >
          <code className="block font-mono">
            {showLineNumbers ? (
              <span className="flex">
                {/* 行号列 */}
                <span
                  aria-hidden="true"
                  className="sticky left-0 z-10 select-none border-r border-ink-100 bg-white px-2.5 py-3 text-right text-[14.5px] leading-[1.75] text-ink-300"
                  style={{ minWidth: `${String(lineCount).length + 2}ch` }}
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i} className="block">
                      {i + 1}
                    </span>
                  ))}
                </span>
                {/* 代码列 */}
                <span
                  className="block flex-1 px-3.5 py-3 text-ink-800"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </span>
            ) : (
              <span
                className="block px-3.5 py-3 text-ink-800"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
