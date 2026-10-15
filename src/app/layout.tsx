import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://fluent.wlp.de5.net'),
  title: {
    default: 'FluentFlutter · Flutter 从入门到工程化',
    template: '%s · FluentFlutter',
  },
  description:
    'Flutter 中文学习站：Dart 语言讲解、Flutter 框架与组件封装、67 个 Material 组件手册（135 个可交互图形示例）、从零搭建项目的工程化指南。一条线从入门走到能独立交付。',
  keywords: [
    'Flutter',
    'Flutter 教程',
    'Flutter 中文文档',
    'Dart 语言',
    'Material',
    '组件文档',
    'Flutter 工程化',
    'Flutter 组件封装',
  ],
  authors: [{ name: 'FluentFlutter' }],
  openGraph: {
    title: 'FluentFlutter · Flutter 从入门到工程化',
    description:
      'Dart → Flutter 框架 → 组件手册 → 工程化 → 实战。67 个 Material 组件、135 个图形示例，附从零搭建项目的完整指南。',
    type: 'website',
    siteName: 'FluentFlutter',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#409eff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 键盘用户跳过导航直达内容 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
        >
          跳到主要内容
        </a>

        <Header />

        <div className="pt-[var(--hd-h)]">{children}</div>

        <footer className="mt-16 border-t border-ink-100 bg-ink-50/60">
          <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-8 text-[12.5px] text-ink-500 sm:px-6 md:flex-row md:items-center">
            <p>
              <strong className="font-semibold text-ink-700">FluentFlutter</strong>
              <span className="mx-1.5 text-ink-300">·</span>
              内容为手写精选，示例代码可直接在 Flutter 项目中使用
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 md:ml-auto">
              <a
                href="https://flutter.dev"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-brand-600"
              >
                Flutter 官网
              </a>
              <a
                href="https://api.flutter.dev/flutter/material/material-library.html"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-brand-600"
              >
                Material API
              </a>
              <a href="/handbook" className="transition hover:text-brand-600">
                工程化搭建指南
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
