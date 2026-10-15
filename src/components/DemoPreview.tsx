'use client';

import { useState } from 'react';
import type { Demo } from '@/data/types';
import CodeBlock from './CodeBlock';
import FlutterPreview from './FlutterPreview';
import { getMock } from './mocks';
import { getDemoMock } from './demo-mocks';

/**
 * 示例卡片（Element Plus 的"组件示例"对应物）
 *
 * 交互方式对齐 Element Plus：
 *   - 默认只展示效果（mock / 截图 / 实时预览）
 *   - 预览区右下角一排小图标，点「代码」图标在下方展开源码，再点收起
 *
 * 图形示例的取用顺序（关键）：
 *   1. 示例专属 mock —— `demo-mocks.tsx` 里按「slug::示例标题」注册的，
 *      画的是**这个示例**特有的样子（改圆角 / 带图标 / 禁用 / 溢出对比…）
 *   2. 组件默认 mock —— `mocks.tsx` 里该组件的典型外观
 *   3. live / image 预览
 *   4. 代码
 *
 * 第 1 条是重点：同一个组件下的几个示例必须长得不一样，
 * 否则示例就失去了「展示写法差异」的意义。
 */

/** 小图标按钮（预览区右下角的工具条） */
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
      className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
        on
          ? 'bg-brand-50 text-brand-600'
          : 'text-ink-400 hover:bg-ink-50 hover:text-ink-700'
      }`}
    >
      {children}
    </button>
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
  /** 组件级 live 预览入口 */
  defaultPreview?: string;
  /** 组件级静态图 */
  defaultImage?: string;
  /** 组件 slug，用于在客户端取对应的图形 mock */
  mockSlug?: string;
}) {
  const previewUrl = demo.previewUrl ?? defaultPreview;
  const imageUrl = demo.imageUrl ?? defaultImage;
  // 优先用「这个示例专属」的图形；没有才回落到该组件的默认外观
  const mock = mockSlug
    ? (getDemoMock(mockSlug, demo.title) ?? getMock(mockSlug))
    : undefined;

  // 按实际资源降级：live + 有 url → 实时预览；live + 只有 image → 静态图；
  // live + 有 mock → mock；什么都没有 → none（只展示代码）
  let mode: 'live' | 'image' | 'mock' | 'none';
  if (demo.preview === 'none' && !mock) mode = 'none';
  else if (previewUrl) mode = 'live';
  else if (imageUrl) mode = 'image';
  else if (mock) mode = 'mock';
  else mode = 'none';

  const [showCode, setShowCode] = useState(mode === 'none');

  return (
    <section
      id={`demo-${index + 1}`}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
    >
      {/* 标题 */}
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 pt-4 sm:px-5">
        <h3 className="text-[15px] font-semibold text-ink-900">{demo.title}</h3>
        {demo.note && (
          <p className="w-full text-[12.5px] leading-relaxed text-ink-500 sm:w-auto sm:flex-1">
            {demo.note}
          </p>
        )}
      </header>

      {/* ── 效果区 ── */}
      <div className="relative p-4 pb-2 sm:p-5 sm:pb-2">
        {mode !== 'none' ? (
          mode === 'mock' ? (
            /* 图形 mock：可交互的 HTML 复刻 */
            <div className="preview-grid rounded-xl border border-ink-100 bg-white px-3 py-1">
              {mock}
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

        {/* 右下角工具条：点「代码」展开源码（Element Plus 同款位置） */}
        {mode !== 'none' && (
          <div className="flex justify-end border-t border-ink-50 pt-1.5">
            <ToolBtn
              on={showCode}
              onClick={() => setShowCode((v) => !v)}
              label={showCode ? '收起代码' : '查看代码'}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </ToolBtn>
          </div>
        )}
      </div>

      {/* ── 可展开的代码区 ── */}
      {showCode && mode !== 'none' && (
        <div className="anim-in border-t border-ink-100 bg-[#f8f9fb] px-4 py-4 sm:px-5">
          <CodeBlock code={demo.code} lang="dart" maxHeight={560} />
        </div>
      )}
    </section>
  );
}
