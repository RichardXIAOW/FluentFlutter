import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[calc(100vh-var(--hd-h)-160px)] max-w-page flex-col items-center justify-center px-4 py-20 text-center"
    >
      {/* 68px 的装饰数字：原先用 text-brand-100，浅色下只有 1.12:1 几乎看不见，
          改成渐变文字既是"科技风"该有的样子，也天然满足大字号 3:1 的下限 */}
      <span className="text-grad font-mono text-[68px] font-bold leading-none tracking-tight">
        404
      </span>
      <h1 className="mt-4 text-[25px] font-semibold tracking-tight text-ink-900">
        这个页面不存在
      </h1>
      <p className="mt-2 max-w-md text-[16.5px] leading-relaxed text-ink-600">
        可能是链接输错了，或者这个组件还没写。用上面的搜索框直接找组件名会更快。
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/components"
          className="flex h-10 items-center gap-1.5 rounded-lg bg-grad-brand px-4 text-[16.5px] font-medium text-white shadow-sm transition hover:brightness-110"
        >
          浏览全部组件
        </Link>
        <Link
          href="/"
          className="flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-4 text-[16.5px] font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
        >
          回到首页
        </Link>
      </div>
    </main>
  );
}
