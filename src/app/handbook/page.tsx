import type { Metadata } from 'next';
import TutorialShell from '@/components/TutorialShell';
import { engineeringTutorial } from '@/data/tutorials/engineering';

export const metadata: Metadata = {
  title: '工程化搭建指南',
  description:
    'Flutter 工程化全流程：环境分档与项目骨架、Riverpod 状态管理、go_router 路由、dio 网络层与统一错误处理、国际化与存储、测试与 CI/CD、发布签名与性能。每章先结论、再对比、再最小可跑代码，按 Flutter 3.3x / Dart 3.9+ 的 2026 年主流实践编写。',
};

/**
 * Flutter 工程化搭建指南（站内原生渲染；旧版 iframe 文档仅作为留档保留在 public/handbook/ 下，站内无入口）
 *
 * 11 章结构：第 0 章讲选型总表，第 1-2 章骨架与依赖，第 3-5 章是核心三件套
 * （状态 / 路由 / 网络），第 6-10 章覆盖 i18n、存储、测试、CI/CD、性能与验收。
 *
 * overview：渲染在章节总览卡与正文之间的「主题说明」区 ——
 * 先回答「这份指南讲什么 / 讲到哪为止」，再让读者进正文。
 */

/* 主题卡：四大板块，每张对应指南的一段章节区间 */
const TOPICS = [
  {
    icon: 'M4 6h16M4 12h10M4 18h7', // 骨架：横线分层
    title: '骨架与环境',
    range: '第 0 – 2 章',
    desc: '全站选型总表、--dart-define 环境分档、feature-first 目录结构、依赖分批与 freezed 代码生成。读完这一段，项目就有了干净的底座。',
  },
  {
    icon: 'M13 3 4 14h6l-1 7 9-11h-6l1-7z', // 三件套：闪电
    title: '核心三件套',
    range: '第 3 – 5 章',
    desc: '状态（Riverpod 3 codegen）、路由（go_router + 登录重定向）、网络（dio 单例 + sealed Failure + Result）。这是日常写业务碰得最多的三层。',
  },
  {
    icon: 'M4 7h16M4 12h16M4 17h10M18 15v4M16 17h4', // 存储：列表 + 加号
    title: '本地化与存储',
    range: '第 6 章',
    desc: 'slang 与 gen-l10n 的取舍、KV 与 SQLite 的选型边界：shared_preferences 存什么、drift 什么时候才值得上。',
  },
  {
    icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z', // 质量与发布：盾牌
    title: '质量与发布',
    range: '第 7 – 10 章',
    desc: '测试三层（单元 / Widget / 集成）、GitHub Actions 门禁、签名与混淆、包体积与启动性能，最后一张十步验收清单收尾。',
  },
] as const;

/* 选型一览：一眼看到这套栈的构成 */
const STACK_CHIPS = [
  'Riverpod 3',
  'go_router',
  'freezed',
  'dio',
  'sealed Result',
  'slang',
  'drift',
  'flutter_lints',
  'GitHub Actions',
] as const;

function TopicCard({ t }: { t: (typeof TOPICS)[number] }) {
  return (
    <div className="group rounded-xl border border-ink-100 bg-surface p-4 transition hover:border-brand-200 hover:shadow-card">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-grad-brand group-hover:text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-[16px] font-semibold text-ink-900">{t.title}</span>
          <span className="block font-mono text-[12.5px] text-brand-600">{t.range}</span>
        </span>
      </div>
      <p className="mt-2.5 text-[15px] leading-[1.8] text-ink-500">{t.desc}</p>
    </div>
  );
}

function HandbookOverview() {
  return (
    <section aria-label="主题说明" className="overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
      {/* 主题说明 */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[20px] font-bold tracking-tight text-ink-900">这份指南讲什么</h2>
          <p className="text-[14px] text-ink-400">
            从 <code className="rounded border border-ink-100 bg-ink-50 px-1.5 py-px font-mono text-[0.9em] text-brand-700">flutter create</code> 到能上架，
            讲到哪为止：Web / 移动端一整套工程底座
          </p>
        </div>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {TOPICS.map((t) => (
            <TopicCard key={t.title} t={t} />
          ))}
        </div>
      </div>

      {/* 分隔线 */}
      <div className="border-t border-dashed border-ink-100" />

      {/* 选型一览 + 怎么读 */}
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold uppercase tracking-wider text-ink-400">
            2026 选型一览
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {STACK_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ink-100 bg-ink-50/70 px-2.5 py-1 font-mono text-[13.5px] text-ink-600"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl bg-brand-50/50 p-3.5 lg:max-w-[340px]">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v5M12 17h.01" strokeLinecap="round" />
          </svg>
          <p className="text-[14.5px] leading-[1.75] text-ink-600">
            <b className="font-semibold text-ink-900">怎么读：</b>
            第 1 章半天把骨架搭起来，然后直接写业务；缺什么回来查对应的章。每章先结论、再对比、再最小可跑代码。
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HandbookPage() {
  return (
    <TutorialShell
      eyebrow="第 4 步 · 真实项目"
      title="Flutter 工程化搭建指南"
      intro={
        <>
          组件会用了，项目怎么搭？这份指南从 <code>flutter create</code> 讲到
          能上架：先给一张全站选型总表，再逐章落地状态管理、路由、网络、测试与发布。
          <strong className="font-semibold text-ink-800">
            每个技术点都是先结论、再对比、再最小可跑代码
          </strong>
          ，并明确告诉你小项目不要做什么。
        </>
      }
      overview={<HandbookOverview />}
      chapters={engineeringTutorial}
      accent="violet"
      siblings={{
        prev: { href: '/components', label: '组件手册' },
      }}
    />
  );
}
