'use client';

import { useState } from 'react';
import type { Demo } from '@/data/types';
import CodeBlock from './CodeBlock';
import FlutterPreview from './FlutterPreview';
import MockRuntime from './MockRuntime';
import { getMock } from './mocks';
import { getDemoMock } from './demo-mocks';

/**
 * 示例卡片（Element Plus 的「组件示例」对应物）
 *
 * 交互：
 *   - 预览区是**可点的**：按钮按下有 Material 涟漪，开关/单选/多选/标签/滑块
 *     会真的切换状态；带 data-snack 的控件会弹一条材质 SnackBar。
 *   - 右上角工具条：查看代码 / 复制代码 / 重新演示（把 mock 重新挂载，回到初始状态）。
 *
 * 图形示例的取用顺序（关键）：
 *   1. 示例专属 mock —— `demo-mocks.tsx` 里按「slug::示例标题」注册的，
 *      画的是**这个示例**特有的样子（改圆角 / 带图标 / 禁用 / 溢出对比…）
 *   2. 组件默认 mock —— `mocks.tsx` 里该组件的典型外观
 *   3. live / image 预览
 *   4. 代码
 */

function ToolBtn({
  on,
  onClick,
  label,
  children,
}: {
  on?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group/tool relative flex h-8 items-center gap-1 rounded-lg px-2 text-[12.5px] transition ${
        on
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
      }`}
    >
      {children}
    </button>
  );
}

function CopyBtn({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <ToolBtn
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* 无剪贴板权限时静默 */
        }
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      label={done ? '已复制' : '复制代码'}
    >
      {done ? (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M15 5H6a2 2 0 0 0-2 2v9" />
        </svg>
      )}
      <span>{done ? '已复制' : '复制'}</span>
    </ToolBtn>
  );
}

export default function DemoPreview({
  demo,
  index,
  defaultPreview,
  defaultImage,
  mockSlug,
}: {
  demo: Demo;
  index: number;
  defaultPreview?: string;
  defaultImage?: string;
  mockSlug?: string;
}) {
  const previewUrl = demo.previewUrl ?? defaultPreview;
  const imageUrl = demo.imageUrl ?? defaultImage;
  const mock = mockSlug
    ? (getDemoMock(mockSlug, demo.title) ?? getMock(mockSlug))
    : undefined;

  let mode: 'live' | 'image' | 'mock' | 'none';
  if (demo.preview === 'none' && !mock) mode = 'none';
  else if (previewUrl) mode = 'live';
  else if (imageUrl) mode = 'image';
  else if (mock) mode = 'mock';
  else mode = 'none';

  const [showCode, setShowCode] = useState(mode === 'none');
  /** 换 key 强制重挂载 mock，回到初始状态 */
  const [runId, setRunId] = useState(0);

  return (
    <section
      id={`demo-${index + 1}`}
      className="group scroll-mt-24 overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-card transition hover:border-brand-200 hover:shadow-pop"
    >
      {/* 标题行 */}
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2 px-4 pt-4 sm:px-5">
        <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-md bg-brand-50 px-1.5 font-mono text-[12.5px] font-semibold text-brand-700">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold leading-snug text-ink-900">{demo.title}</h3>
          {demo.note && (
            <p className="mt-0.5 text-[15px] leading-relaxed text-ink-500">{demo.note}</p>
          )}
        </div>

        {/* 工具条：代码 / 复制 / 重新演示 */}
        {mode !== 'none' && (
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg">
            <ToolBtn
              on={showCode}
              onClick={() => setShowCode((v) => !v)}
              label={showCode ? '收起代码' : '查看代码'}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
              </svg>
              <span>{showCode ? '收起' : '代码'}</span>
            </ToolBtn>
            <CopyBtn code={demo.code} />
            {mode === 'mock' && (
              <ToolBtn onClick={() => setRunId((v) => v + 1)} label="重新演示">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
                </svg>
                <span>重放</span>
              </ToolBtn>
            )}
          </div>
        )}
      </header>

      {/* 效果区 */}
      <div className="relative px-4 pb-4 pt-3 sm:px-5">
        {mode !== 'none' ? (
          mode === 'mock' ? (
            <div className="relative">
              <MockRuntime
                key={runId}
                className="preview-grid overflow-hidden rounded-xl border border-ink-100"
              >
                {mock}
              </MockRuntime>
              <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full bg-surface/85 px-2 py-0.5 text-[11.5px] font-medium text-brand-700 ring-1 ring-brand-100 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                可交互 · 点点看
              </span>
            </div>
          ) : (
            <FlutterPreview
              url={previewUrl}
              image={imageUrl}
              mode={mode}
              title={demo.title}
            />
          )
        ) : (
          <CodeBlock code={demo.code} lang="dart" maxHeight={560} />
        )}
      </div>

      {/* 可展开的代码区 */}
      {showCode && mode !== 'none' && (
        <div className="anim-in border-t border-ink-100 bg-subtle px-4 py-4 sm:px-5">
          <CodeBlock code={demo.code} lang="dart" maxHeight={560} />
        </div>
      )}
    </section>
  );
}
