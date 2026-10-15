'use client';

import { useEffect, useState } from 'react';

/**
 * Flutter Web 预览
 *
 * 设计取舍 —— 为什么用「点击加载」而不是自动加载：
 * Flutter Web 的 canvas 渲染包体积在 2MB 以上（含 skwasm/canvaskit）。
 * 一页放 5~10 个示例，如果全部自动加载，首屏会变成几十 MB，
 * 用户会以为网站坏了。
 *
 * 所以策略是：
 *   1. 默认展示静态截图（几十 KB，秒出）
 *   2. 点「运行预览」才挂载 iframe 去加载真的 Flutter Web
 *   3. iframe 里配 sandbox，避免第三方脚本拿到主站权限
 *
 * ⚠️ 调用方（DemoPreview）已经保证：只有 url 存在时才会以 'live' 调进来。
 * 如果某天你不想维护 Web 端构建，把数据的 preview 改成 'none' 或 'image'
 * 即可 —— 组件本身不需要改。
 */
export default function FlutterPreview({
  url,
  image,
  mode,
  title,
}: {
  url?: string;
  image?: string;
  mode: 'live' | 'image' | 'none';
  title: string;
}) {
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // 切换示例时重置状态，否则会残留上一个示例的"已加载"
  useEffect(() => {
    setLive(false);
    setLoaded(false);
    setFailed(false);
    setImgFailed(false);
  }, [url, image]);

  // ── 纯静态图 ──
  if (mode === 'image' && image && !imgFailed) {
    return (
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-3 py-1.5">
          <span className="text-[11.5px] text-ink-400">渲染效果（静态截图）</span>
        </div>
        <div className="preview-grid flex items-center justify-center p-6">
          {/* 用原生 img：这些是本地静态资源，不需要 next/image 优化 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${title} 的渲染效果`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="max-h-[420px] w-auto max-w-full rounded-lg shadow-card"
          />
        </div>
      </div>
    );
  }

  // ── 实时预览 ──
  if (mode === 'live' && url && live) {
    return (
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
        <div className="flex items-center gap-2 border-b border-ink-100 bg-white px-3 py-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              loaded ? 'bg-ok' : 'animate-pulse bg-warn'
            }`}
          />
          <span className="text-[11.5px] text-ink-500">
            {loaded ? 'Flutter Web 实时渲染' : '正在加载 Flutter 运行时…'}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[11.5px] text-brand-600 hover:underline"
          >
            新标签页打开
          </a>
        </div>

        {failed ? (
          <div className="px-4 py-12 text-center">
            <p className="text-[13px] text-ink-500">预览加载失败</p>
            <p className="mt-1 text-[11.5px] text-ink-400">
              可能是网络问题，或该示例的 Web 构建未包含在本次部署中。
              可以先看「代码」tab。
            </p>
          </div>
        ) : (
          <div className="relative">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-50">
                <div className="flex flex-col items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-brand-500" />
                  <span className="text-[11.5px] text-ink-400">
                    首次加载约需 3~10 秒
                  </span>
                </div>
              </div>
            )}
            <iframe
              src={url}
              title={`${title} 的 Flutter Web 预览`}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              // sandbox 只给必要权限：允许脚本与同源资源，不允许弹窗/顶层跳转
              sandbox="allow-scripts allow-same-origin"
              className="h-[420px] w-full border-0 bg-white"
            />
          </div>
        )}
      </div>
    );
  }

  // ── 有静态图时的待运行状态 ──
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
      <div className="preview-grid relative flex min-h-[220px] items-center justify-center p-6">
        {image && !imgFailed ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${title} 的渲染效果`}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="max-h-[380px] w-auto max-w-full rounded-lg shadow-card"
            />
            {url && (
              <button
                type="button"
                onClick={() => setLive(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-ink-900/85 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur transition hover:bg-ink-900"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5Z" />
                </svg>
                运行预览
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink-300 shadow-card">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-[12.5px] text-ink-500">正在准备预览…</p>
            {url && (
              <button
                type="button"
                onClick={() => setLive(true)}
                className="mt-1 flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-[12.5px] font-medium text-white shadow-sm transition hover:bg-brand-600"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5Z" />
                </svg>
                运行 Flutter Web 预览
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
