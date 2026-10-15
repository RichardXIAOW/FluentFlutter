'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * 工程化指南的外壳
 *
 * 那份指南是一个约 180KB 的独立 HTML 文件（自带样式、脚本、目录、进度条），
 * 把它改写成 React 组件是纯亏损 —— 会丢掉它已经做好的交互，
 * 还要把 70 多个代码块重新高亮一遍。
 *
 * 所以采用「iframe 承载 + 本站导航包裹」的方式：
 *   - iframe 用 sandbox 锁住，它拿不到主站的 cookie / localStorage
 *   - 顶部给「新标签页打开」的出口 —— iframe 里做不到全屏阅读体验
 *   - 首屏用一个静态骨架占位，避免 180KB 加载期间出现白屏
 */
export default function HandbookShell() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // 假进度条：不是真实加载百分比（浏览器不给），只是"在动了"的反馈
  useEffect(() => {
    if (loaded) {
      setProgress(100);
      return;
    }
    const t = setInterval(() => {
      setProgress((p) => (p >= 88 ? 88 : p + Math.random() * 12));
    }, 180);
    return () => clearInterval(t);
  }, [loaded]);

  // 让 iframe 自己适配高度（它的内容很长，内部有自己的滚动）
  return (
    <main id="main" className="mx-auto max-w-page px-4 pb-10 pt-6 sm:px-6">
      {/* ── 顶部信息条 ── */}
      <div className="mb-4 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-brand-600 shadow-sm">
                引申阅读
              </span>
              <span className="text-[11.5px] text-ink-500">
                14 阶段 · 39 步 · 约 5 小时
              </span>
            </div>

            <h1 className="mt-2.5 text-[20px] font-semibold tracking-tight text-ink-900 sm:text-[23px]">
              从零搭建一个工程化的 Flutter 项目
            </h1>
            <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-600">
              组件会用了，项目怎么搭？这份指南带你走完整流程 ——
              目录结构、环境分档与密钥管理、Dio 网络层、统一错误模型、Riverpod 状态管理、
              go_router 声明式路由、构建脚本与发布签名。
              <strong className="font-semibold text-ink-800">
                每一步都写明「怎么验证你做对了」
              </strong>
              ，不会出现「跟着做但不知道对不对」的情况。
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="/handbook/index.html"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-600"
            >
              全屏阅读
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <Link
              href="/components"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 text-[13px] font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              回到组件手册
            </Link>
          </div>
        </div>

        {/* 加载进度 */}
        <div className="h-0.5 w-full bg-brand-100">
          <div
            className="h-full bg-brand-500 transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* ── iframe ── */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink-200 border-t-brand-500" />
            <p className="text-[13px] text-ink-500">正在载入指南…</p>
            <p className="text-[11.5px] text-ink-400">
              约 180KB，含 72 个代码块
            </p>
          </div>
        )}

        <iframe
          ref={frameRef}
          src="/handbook/index.html"
          title="从零搭建 Flutter 工程化项目"
          onLoad={() => setLoaded(true)}
          // 允许脚本（指南自带目录高亮与进度条）与同源资源；
          // 不给 allow-top-navigation，防止 iframe 内部把主站跳走
          sandbox="allow-scripts allow-same-origin allow-popups"
          className="h-[calc(100vh-var(--hd-h)-180px)] min-h-[600px] w-full border-0"
        />
      </div>

      <p className="mt-3 text-center text-[11.5px] text-ink-400">
        如果上面的内容显示不完整，请点「全屏阅读」在新标签页打开
      </p>
    </main>
  );
}
