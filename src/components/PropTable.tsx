'use client';

import { useState } from 'react';
import type { PropRow } from '@/data/types';

/**
 * 属性表
 *
 * 两个刻意的选择：
 * 1. 必填列用小红点而不是文字「是/否」—— 视觉噪音更小
 * 2. 默认值用等宽字体 —— 一眼能看出 'false' 是字符串还是布尔
 *
 * 支持移动端：小屏时自动切成卡片式（表格 4 列在手机上放不下）
 */
export default function PropTable({ rows }: { rows: PropRow[] }) {
  const [compact, setCompact] = useState(false);

  if (!rows.length) {
    return (
      <p className="rounded-lg border border-dashed border-ink-200 px-4 py-6 text-center text-[13px] text-ink-400">
        这个组件没有需要特别说明的属性
      </p>
    );
  }

  const hasType = rows.some((r) => r.type);

  return (
    <div>
      {/* 移动端切换按钮 */}
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setCompact((v) => !v)}
          className="rounded-md border border-ink-200 px-2.5 py-1 text-[11.5px] text-ink-500 transition hover:border-brand-300 hover:text-brand-600 lg:hidden"
        >
          {compact ? '切换到表格' : '切换到卡片'}
        </button>
      </div>

      {/* ── 卡片式（移动端 / 手动切换） ── */}
      {compact ? (
        <div className="space-y-2 lg:hidden">
          {rows.map((r) => (
            <div key={r.name} className="rounded-xl border border-ink-100 bg-white p-3.5">
              <div className="flex items-center gap-2">
                <code className="font-mono text-[13px] font-semibold text-ink-900">
                  {r.name}
                </code>
                {r.required && (
                  <span className="rounded bg-danger/10 px-1.5 py-px text-[10.5px] font-medium text-danger">
                    必填
                  </span>
                )}
                <code className="ml-auto font-mono text-[11px] text-brand-600">
                  {r.type}
                </code>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">{r.desc}</p>
              {r.def && (
                <p className="mt-1.5 text-[11.5px] text-ink-400">
                  默认值 <code className="font-mono text-ink-600">{r.def}</code>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-100">
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-ink-50 text-[11.5px] uppercase tracking-wide text-ink-500">
                  <th className="px-4 py-2.5 font-semibold">属性</th>
                  {hasType && <th className="px-4 py-2.5 font-semibold">类型</th>}
                  <th className="px-4 py-2.5 font-semibold">默认值</th>
                  <th className="px-4 py-2.5 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.name}
                    className={`border-t border-ink-100 align-top transition hover:bg-brand-50/40 ${
                      i % 2 === 1 ? 'bg-ink-50/40' : 'bg-white'
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <code className="font-mono font-medium text-ink-900">
                          {r.name}
                        </code>
                        {r.required && (
                          <span
                            title="必填"
                            aria-label="必填"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
                          />
                        )}
                      </span>
                    </td>
                    {hasType && (
                      <td className="px-4 py-3">
                        <code className="font-mono text-[12px] text-brand-600">
                          {r.type}
                        </code>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3">
                      {r.def ? (
                        <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[11.5px] text-ink-600">
                          {r.def}
                        </code>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 leading-relaxed text-ink-600">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-2 text-[11.5px] text-ink-400">
        仅列出高频使用的参数。完整签名见官方 API 文档；带
        <span className="mx-1 inline-block h-1.5 w-1.5 rounded-full bg-danger align-middle" />
        标记的为必填。
      </p>
    </div>
  );
}
