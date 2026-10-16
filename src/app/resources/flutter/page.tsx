import type { Metadata } from 'next';
import Link from 'next/link';
import TutorialShell from '@/components/TutorialShell';
import { flutterTutorial } from '@/data/tutorials/flutter';

export const metadata: Metadata = {
  title: 'Flutter 讲解',
  description:
    'Flutter 从基础到进阶：一切皆 Widget、Widget 树怎么搭、StatelessWidget 与 StatefulWidget 怎么选、BuildContext 到底是什么、怎么写一个能复用的自定义组件，再到状态管理、性能优化与生命周期。',
};

/**
 * Flutter 讲解
 *
 * 定位：夹在「Dart 语言」和「组件手册」之间。
 *   上一站告诉你 Dart 怎么写；
 *   这一站告诉你 Flutter 是怎么把界面「搭」出来的、组件为什么这么设计；
 *   下一站才是逐个组件的具体用法。
 */
export default function FlutterPage() {
  return (
    <>
      <TutorialShell
        eyebrow="第 2 步 · 框架入门"
        title="Flutter 讲解"
        intro={
          <>
            会写 Dart 不等于会写 Flutter。这一页讲的是框架的<b className="font-semibold text-ink-800">心智模型</b> ——
            界面是怎么被「搭」出来的、状态放在哪、组件为什么要这么封装。
            搞懂这些，再看组件文档就不是在背 API 了。
          </>
        }
        chapters={flutterTutorial}
        siblings={{
          prev: { href: '/resources/dart', label: 'Dart 语言讲解' },
          next: { href: '/components', label: 'Material 组件手册' },
        }}
      />

      <div className="mx-auto max-w-page px-4 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-brand-600">下一步</p>
            <p className="mt-1 text-[18px] font-semibold text-ink-900">
              原理通了，开始逐个认识组件
            </p>
            <p className="mt-1 text-[15.5px] leading-relaxed text-ink-600">
              67 个高频 Material 组件，每个都配图形示例、属性表和避坑说明。
              每个示例右下角点一下就能看源码。
            </p>
          </div>
          <Link
            href="/components"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[16.5px] font-medium text-white shadow-sm transition hover:bg-brand-600"
          >
            浏览组件手册
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
