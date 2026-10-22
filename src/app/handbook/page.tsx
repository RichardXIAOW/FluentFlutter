import type { Metadata } from 'next';
import TutorialShell from '@/components/TutorialShell';
import { engineeringTutorial } from '@/data/tutorials/engineering';

export const metadata: Metadata = {
  title: '工程化搭建指南',
  description:
    'Flutter 工程化全流程：环境分档与项目骨架、Riverpod 状态管理、go_router 路由、dio 网络层与统一错误处理、国际化与存储、主题定制与明暗切换、测试与 CI/CD、发布签名与性能。每章先结论、再对比、再最小可跑代码，按 Flutter 3.3x / Dart 3.9+ 的 2026 年主流实践编写。',
};

/**
 * Flutter 工程化搭建指南（站内原生渲染；旧版 iframe 文档仅作为留档保留在 public/handbook/ 下，站内无入口）
 *
 * 12 章结构：第 0 章讲选型总表，第 1-2 章骨架与依赖，第 3-5 章是核心三件套
 * （状态 / 路由 / 网络），第 6-11 章覆盖 i18n、存储、主题、测试、CI/CD、性能与验收。
 */
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
      chapters={engineeringTutorial}
      accent="violet"
      siblings={{
        prev: { href: '/components', label: '组件手册' },
      }}
    />
  );
}
