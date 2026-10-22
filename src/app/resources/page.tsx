import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '资源',
  description:
    'Flutter 学习路线：Dart 语言 → Flutter 框架讲解 → 基础开发（界面 / 导航 / 第三方库）→ 工程化搭建 → 实战教程。组件手册全程随用随查。从零基础到能独立交付项目，按阶段排好，卡在哪查哪。',
};

/**
 * 资源页
 *
 * 五步路线，顺序即依赖关系：
 *   语言 → 框架 → 基础开发 → 工程化 → 实战（组件手册不在主线上，作随用随查的字典）
 * 前四步都已完成，第五步整理中。
 */

type Step = {
  no: string;
  stage: string;
  title: string;
  desc: string;
  bullets: string[];
  tags: string[];
  href?: string;
  external?: boolean;
  state: 'ready' | 'coming';
};

const steps: Step[] = [
  {
    no: '01',
    stage: '语言基础',
    title: 'Dart 语言讲解',
    desc: '写 Flutter 就是写 Dart。这一页从变量、空安全、函数、类、集合、异步这些「必须先会」的东西讲起，再到 sealed、模式匹配、copyWith、mixin 这些工程化必备的高级语法。',
    bullets: [
      '零基础友好：每段代码都能贴进 dartpad.dev 直接跑',
      '三段式结构：是干啥的 / 什么时候用 / 常见的坑',
      '高级语法部分由工程化指南的附录 E 搬运并整合进来',
    ],
    tags: ['空安全', 'sealed', 'copyWith', 'mixin', '异步'],
    href: '/resources/dart',
    state: 'ready',
  },
  {
    no: '02',
    stage: '框架入门',
    title: 'Flutter 讲解',
    desc: '会写 Dart 不等于会写 Flutter。这一页讲框架的心智模型：一切皆 Widget 是什么意思、界面怎么一层层搭出来、build 为什么会被调很多次、context 到底是什么。',
    bullets: [
      '基础：Widget 树、build 方法、BuildContext',
      '组件封装：参数怎么设计、组合优于继承、const 优化、布局约束与溢出',
      '进阶：状态放哪、State 生命周期、性能优化三条、常见反模式',
    ],
    tags: ['Widget 树', '组件封装', '布局约束', '生命周期', '性能'],
    href: '/resources/flutter',
    state: 'ready',
  },
  {
    no: '03',
    stage: '上手开发',
    title: 'Flutter 基础开发',
    desc: '把页面真正写出来：基本界面的编写方法、AppBar / 底部导航 / TabBar 等常用界面元素的配置，以及蓝牙、定位、文件上传下载、扫码这些基础能力对应的第三方库用法。循序渐进，学完就能写出多页 App。',
    bullets: [
      '界面编写：页面骨架、布局组件怎么选、ListView 列表、setState 交互',
      '常用配置：AppBar、底部导航（保状态的正确姿势）、顶部标签页、抽屉与轻提示',
      '第三方库速查：dio 上传下载、mobile_scanner 扫码、geolocator 定位、flutter_blue_plus 蓝牙',
      '新手高频坑速查表 + 与第四步工程化的衔接地图',
    ],
    tags: ['界面编写', 'TabBar / 底部导航', '第三方库', '避坑速查'],
    href: '/resources/basic',
    state: 'ready',
  },
  {
    no: '04',
    stage: '真实项目',
    title: '工程化搭建指南',
    desc: '页面会写了，项目怎么搭？从一张全站选型总表开始（Riverpod 3 / go_router / freezed / dio / slang / drift），逐章落地环境分档、feature-first 目录、统一错误处理、测试与 CI/CD，直到签名上架。每个技术点先结论、再对比、再最小可跑代码。',
    bullets: [
      '每章明确告诉你「小项目不要做什么」，拒绝过度工程',
      '状态 / 路由 / 网络三个重写章，配端到端可抄的订单列表模板',
      '结尾附「从零到上架的 10 步验收清单」与常见坑速查表',
    ],
    tags: ['12 章', '选型总表', '可抄模板', '避坑清单'],
    href: '/handbook',
    state: 'ready',
  },
  {
    no: '05',
    stage: '综合运用',
    title: '实战教程 · 完整项目',
    desc: '把前面四步串起来，跟着做一个能上架的真实应用：需求拆解、页面骨架、状态管理落地、接口对接、异常兜底、打包发布。整理中。',
    bullets: [
      '从需求文档到可用 App 的完整链路',
      '复用工程化指南的目录结构与分层约定',
      '含发布上架与后续迭代的工程实践',
    ],
    tags: ['综合实战', '完整链路'],
    state: 'coming',
  },
];

export default function ResourcesPage() {
  return (
    <main id="main" className="mx-auto max-w-page px-4 py-10 sm:px-6">
      {/* ── 头部 ── */}
      <header className="max-w-3xl">
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[14px] font-medium text-brand-600">
          学习路线
        </span>
        <h1 className="mt-3 text-[30px] font-bold tracking-tight text-ink-900 sm:text-[36px]">
          从入门到能独立交付
        </h1>
        <p className="mt-3 text-[17.5px] leading-relaxed text-ink-600">
          按依赖关系排的五步。新手从上往下走；
          有经验的直接跳到需要的那一站 ——
          <strong className="font-semibold text-ink-800">
            每站都不需要「学完才走下一步」，够用就往前走，卡住再回来查。
          </strong>
        </p>
      </header>

      {/* ── 路线概览：一条横向的连接线 ── */}
      <div className="mt-8 hidden items-center gap-1 lg:flex">
        {steps.map((s, i) => (
          <div key={s.no} className="flex flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div
                className={`h-1 rounded-full ${
                  s.state === 'coming' ? 'bg-ink-100' : 'bg-brand-300'
                }`}
              />
              <span
                className={`truncate text-[14.5px] font-medium ${
                  s.state === 'coming' ? 'text-ink-400' : 'text-ink-700'
                }`}
              >
                {s.no} {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* ── 步骤卡片 ── */}
      <div className="mt-8 space-y-4">
        {steps.map((s) => (
          <StepCard key={s.no} s={s} />
        ))}
      </div>

      {/* ── 随用随查：组件手册 ── */}
      <section className="mt-6">
        <Link
          href="/components"
          className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-surface p-4 shadow-card transition hover:border-brand-200 hover:shadow-pop"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500 transition group-hover:bg-brand-50 group-hover:text-brand-600">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 5h16v6H4zM4 13h7v6H4zM13 13h7v6h-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16.5px] font-semibold text-ink-900 group-hover:text-brand-600">
              组件手册 · 随用随查
            </span>
            <span className="mt-0.5 block text-[15px] leading-relaxed text-ink-500">
              67 个高频 Material 组件、134 个图形示例、属性速查与避坑 —— 不在主线上，当字典用。
            </span>
          </span>
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-400 transition group-hover:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* ── 官方资料 ── */}
      <section className="mt-14">
        <h2 className="text-[22px] font-semibold tracking-tight text-ink-900">官方资料</h2>
        <p className="mt-1.5 text-[16px] text-ink-500">
          本站是「带你上手」的中文整理，遇到需要精确签名或权威说明时，回官方查。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: 'https://api.flutter.dev/flutter/material/material-library.html',
              t: 'Material 组件 API',
              d: '查精确构造签名与参数时用',
            },
            {
              href: 'https://dart.dev/language',
              t: 'Dart 语言文档',
              d: '语言层面的权威说明',
            },
            {
              href: 'https://docs.flutter.dev',
              t: 'Flutter 文档',
              d: '官方教程与指南总入口',
            },
            {
              href: 'https://dartpad.dev',
              t: 'DartPad 在线运行',
              d: '不用装环境，代码贴进去就能跑',
            },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-ink-100 bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-pop"
            >
              <p className="flex items-center gap-1.5 text-[16.5px] font-semibold text-ink-900 group-hover:text-brand-600">
                {l.t}
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-500">{l.d}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ── 单个步骤卡片 ── */
function StepCard({ s }: { s: Step }) {
  const coming = s.state === 'coming';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition ${
        coming
          ? 'border-dashed border-ink-200 bg-ink-50/50'
          : 'border-ink-100 bg-surface shadow-card hover:border-brand-200 hover:shadow-pop'
      }`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        {/* 编号 */}
        <div className="flex shrink-0 items-start gap-3 sm:w-[124px] sm:flex-col sm:gap-2">
          <span
            className={`font-mono text-[33px] font-bold leading-none tracking-tight ${
              coming ? 'text-ink-400' : 'text-brand-600'
            }`}
          >
            {s.no}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[14px] font-medium ${
              coming ? 'bg-surface text-ink-400' : 'bg-brand-50 text-brand-600'
            }`}
          >
            {s.stage}
          </span>
        </div>

        {/* 主体 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`text-[20px] font-semibold ${coming ? 'text-ink-500' : 'text-ink-900'}`}>
              {s.title}
            </h2>
            {coming && (
              <span className="rounded-full bg-warn/10 px-2 py-0.5 text-[13.5px] font-medium text-warn">
                整理中
              </span>
            )}
          </div>

          <p className={`mt-2 text-[16px] leading-relaxed ${coming ? 'text-ink-500' : 'text-ink-600'}`}>
            {s.desc}
          </p>

          <ul className="mt-3 space-y-1.5">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[15.5px] leading-relaxed text-ink-600">
                <svg
                  viewBox="0 0 24 24"
                  className={`mt-[5px] h-3 w-3 shrink-0 ${coming ? 'text-ink-400' : 'text-brand-600'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {s.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-ink-100 bg-ink-50/60 px-1.5 py-0.5 text-[13.5px] text-ink-500"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 items-start sm:pt-1">
          {coming ? (
            <span className="inline-flex h-9 items-center rounded-lg border border-dashed border-ink-200 px-3.5 text-[16px] text-ink-400">
              敬请期待
            </span>
          ) : (
            <Link
              href={s.href!}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-3.5 text-[16px] font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              进入
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
