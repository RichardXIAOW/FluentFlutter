import type { Metadata } from 'next';
import Link from 'next/link';
import TutorialShell from '@/components/TutorialShell';
import { dartTutorial } from '@/data/tutorials/dart';

export const metadata: Metadata = {
  title: 'Dart 语言讲解',
  description:
    '从零讲清 Dart：变量与类型、空安全、函数与类、集合、异步，再到 sealed / copyWith / mixin / 模式匹配等工程化必备的高级语法。每条都按「是干啥的 / 什么时候用 / 常见的坑」三段式写。',
};

/**
 * Dart 语言讲解
 *
 * 面向零基础，按「先能写 → 再写好 → 再写稳」三段推进：
 *   第 0 章 基础：类型、变量、空安全、函数、类、集合、异步
 *   第 1 章 进阶：sealed、模式匹配、copyWith、mixin、extension……
 *   第 2 章 速查：一页纸总结
 *
 * 内容源：本站原创 + 工程化指南附录 E 的 Dart 高级语法速查（已并入本页）。
 */
export default function DartPage() {
  return (
    <>
      <TutorialShell
        eyebrow="第 1 步 · 语言基础"
        title="Dart 语言讲解"
        intro={
          <>
            写 Flutter 就是写 Dart。这一页不要求你从头读到尾 ——
            按「是干啥的 / 什么时候用 / 常见的坑」三段式组织，
            <strong className="font-semibold text-ink-800">卡在哪查哪</strong>。
            每段代码都能单独跑，直接贴进{' '}
            <a
              href="https://dartpad.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-500"
            >
              dartpad.dev
            </a>{' '}
            就能验证。
          </>
        }
        chapters={dartTutorial}
        siblings={{
          prev: { href: '/resources', label: '学习路线' },
          next: { href: '/resources/flutter', label: 'Flutter 讲解' },
        }}
      />

      {/* 底部：下一站 */}
      <div className="mx-auto max-w-page px-4 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-brand-600">下一步</p>
            <p className="mt-1 text-[15px] font-semibold text-ink-900">
              语言会了，接着看 Flutter 是怎么把界面「搭」出来的
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
              Widget 树、StatefulWidget 的生命周期、BuildContext 到底指什么、
              怎么写一个能复用的组件 —— 这些是看懂组件文档的前提。
            </p>
          </div>
          <Link
            href="/resources/flutter"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[13.5px] font-medium text-white shadow-sm transition hover:bg-brand-600"
          >
            Flutter 讲解
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
