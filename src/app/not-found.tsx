import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[calc(100vh-var(--hd-h)-160px)] max-w-page flex-col items-center justify-center px-4 py-20 text-center"
    >
      <span className="font-mono text-[64px] font-bold leading-none tracking-tight text-brand-100">
        404
      </span>
      <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-ink-900">
        这个页面不存在
      </h1>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-600">
        可能是链接输错了，或者这个组件还没写。用上面的搜索框直接找组件名会更快。
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/components"
          className="flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[13.5px] font-medium text-white shadow-sm transition hover:bg-brand-600"
        >
          浏览全部组件
        </Link>
        <Link
          href="/"
          className="flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 text-[13.5px] font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
        >
          回到首页
        </Link>
      </div>
    </main>
  );
}
