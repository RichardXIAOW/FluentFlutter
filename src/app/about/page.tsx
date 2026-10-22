import type { Metadata } from 'next';
import QQCopyButton from '@/components/QQCopyButton';

export const metadata: Metadata = {
  title: '关于作者',
  description:
    '居然是二师兄 · 前端开发工程师：Vue2/Vue3 生态、Flutter、uniapp、Three.js 3D，尤其擅长设备蓝牙交互与 OTA 升级。GitHub：RichardXIAOW。',
};

const GITHUB_URL = 'https://github.com/RichardXIAOW';
const AVATAR_URL = 'https://avatars.githubusercontent.com/RichardXIAOW';
const QQ_NUMBER = '2932257007';

/**
 * 关于作者（/about）
 *
 * Hero（头像 + 昵称 + slogan + 联系按钮）
 * → 擅长什么（技能栈网格，蓝牙/OTA 单独强调）
 * → 做过什么（项目卡）
 * → 怎么找到我（GitHub / QQ）
 */

/* 技能栈：icon 用简洁线性图形，颜色全部走语义令牌（双主题自适应） */
const SKILLS = [
  {
    title: 'Vue 2 / Vue 3 生态',
    desc: '从选项式到组合式的完整实战：组件体系设计、Pinia / Vuex 状态管理、Vue Router、Vite 工程化，业务系统的主要生产力。',
    icon: 'M12 3l9 5.2v7.6L12 21l-9-5.2V8.2L12 3z', // 多边形
    tag: '主力栈',
  },
  {
    title: 'Flutter',
    desc: '一套代码多端一致体验：界面体系、状态管理、原生插件接入，本站组件手册与工程化指南即出自日常实践。',
    icon: 'M5 4l14 8-14 8V4z', // 三角
    tag: '多端',
  },
  {
    title: 'uni-app',
    desc: '一套代码多端投放：App / 微信小程序 / H5，条件编译与平台差异处理经验充足。',
    icon: 'M4 5h16v10H4zM9 19h6', // 屏幕
    tag: '跨端',
  },
  {
    title: 'Three.js 3D',
    desc: 'WebGL 场景搭建、模型加载与交互可视化，让页面不止于平面。',
    icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 3v9m8-4.5L12 12 4 7.5', // 立方体
    tag: '可视化',
  },
] as const;

/* 特色能力：蓝牙 / OTA 单独一块讲透 */
const BLE_POINTS = [
  'BLE 扫描、连接、服务发现、特征读写与 Notify 订阅全流程',
  '固件 OTA 升级：分包传输、进度回调、断连重试与异常兜底',
  'Android / iOS 双端权限与系统差异踩坑经验充足',
] as const;

const PROJECTS = [
  {
    name: 'MoonTV',
    desc: '开源影视聚合项目，基于 Next.js 构建，部署于 Cloudflare Pages。',
    href: 'https://github.com/RichardXIAOW/MoonTV',
    label: 'GitHub',
  },
  {
    name: 'FluentFlutter',
    desc: 'Flutter 中文学习站（就是你正在看的这个站）：Dart 讲解、基础开发、组件手册、工程化指南一条线。',
    href: 'https://fluent.wlp.de5.net',
    label: '访问',
  },
  {
    name: '更多项目',
    desc: '长期更新的实验与工具项目，都在 GitHub 上。',
    href: GITHUB_URL,
    label: '去看看',
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-page px-4 py-10 sm:px-6">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-100/50 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          {/* 头像 */}
          <img
            src={AVATAR_URL}
            alt="居然是二师兄的 GitHub 头像"
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-ink-100 sm:h-28 sm:w-28"
          />
          <div className="min-w-0">
            <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[14px] font-medium text-brand-700">
              前端开发工程师
            </span>
            <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-tight text-ink-900 sm:text-[40px]">
              居然是二师兄
            </h1>
            <p className="mt-2.5 max-w-2xl text-[17px] leading-[1.9] text-ink-600">
              计算机专业出身的软件工程师。日常在 Vue 生态里做业务，在 Flutter 里做产品，
              在 Three.js 里做表达；最熟悉的领域是
              <strong className="font-semibold text-ink-800">
                设备侧的蓝牙交互与 OTA 升级
              </strong>
              —— 让 App 和硬件「说上话」这件事，做过很多遍。
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center gap-1.5 rounded-xl bg-grad-brand px-4 text-[16.5px] font-medium text-white shadow-sm transition hover:brightness-110"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
              <QQCopyButton />
              <span className="hidden text-[13.5px] text-ink-400 sm:block">点 QQ 号可复制</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 技能栈 ── */}
      <section className="mt-10">
        <h2 className="text-[22px] font-bold tracking-tight text-ink-900">我会什么</h2>
        <p className="mt-1.5 text-[16px] text-ink-500">
          前端为主业，跨端与 3D 为延伸，设备通信为特长。
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {SKILLS.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-ink-100 bg-surface p-4 transition hover:border-brand-200 hover:shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-grad-brand group-hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[12.5px] text-ink-500">
                  {s.tag}
                </span>
              </div>
              <p className="mt-2.5 text-[16px] font-semibold text-ink-900">{s.title}</p>
              <p className="mt-1.5 text-[14.5px] leading-[1.75] text-ink-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 蓝牙 / OTA 特色条 */}
        <div className="mt-2.5 rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-surface p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-grad-brand text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M12 7l5-3v10l-5-3M12 7L7 4v10l5 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[16.5px] font-semibold text-ink-900">
              特色：蓝牙交互 & OTA 固件升级
            </p>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {BLE_POINTS.map((p) => (
              <li key={p} className="flex gap-2 text-[15px] leading-[1.75] text-ink-600">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-[5px] h-3 w-3 shrink-0 text-brand-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 项目 ── */}
      <section className="mt-10">
        <h2 className="text-[22px] font-bold tracking-tight text-ink-900">做过什么</h2>
        <p className="mt-1.5 text-[16px] text-ink-500">选几个有代表性的，其余都在 GitHub。</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {PROJECTS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-ink-100 bg-surface p-4 transition hover:border-brand-200 hover:shadow-card"
            >
              <p className="flex items-center gap-1.5 text-[16.5px] font-semibold text-ink-900 group-hover:text-brand-600">
                {p.name}
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-ink-400 transition group-hover:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
              <p className="mt-1.5 text-[14.5px] leading-[1.75] text-ink-500">{p.desc}</p>
              <p className="mt-2 text-[13.5px] font-medium text-brand-600">{p.label} →</p>
            </a>
          ))}
        </div>
      </section>

      {/* ── 联系 ── */}
      <section className="mt-10">
        <h2 className="text-[22px] font-bold tracking-tight text-ink-900">怎么找到我</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-surface p-4 transition hover:border-brand-200 hover:shadow-card"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-600 transition group-hover:bg-brand-50 group-hover:text-brand-600">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold text-ink-900">GitHub</span>
              <span className="block truncate font-mono text-[14.5px] text-ink-500">
                github.com/RichardXIAOW
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-400 transition group-hover:text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-surface p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-600">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 10h.01M15 10h.01M8.5 14.5c1 .9 2.2 1.4 3.5 1.4s2.5-.5 3.5-1.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold text-ink-900">QQ</span>
              <span className="block font-mono text-[14.5px] text-ink-500">{QQ_NUMBER}</span>
            </span>
            <span className="text-[13px] text-ink-400">添加请备注来意</span>
          </div>
        </div>
        <p className="mt-5 text-[14.5px] leading-relaxed text-ink-400">
          本站的 Flutter 教程与组件手册会持续更新，有问题或建议欢迎通过 GitHub Issue 交流。
        </p>
      </section>
    </main>
  );
}
