import type { Metadata } from 'next';
import QQCopyButton from '@/components/QQCopyButton';
import AboutScene from '@/components/AboutScene';

export const metadata: Metadata = {
  title: '关于作者',
  description: '居然是二师兄 · FluentFlutter 站长。GitHub：RichardXIAOW。',
  // 覆写全局 openGraph/twitter description（含「蓝牙 / 定位 / 扫码」等能力叙述），
  // /about 页的社交卡片只保留站点级信息，不携带个人能力文案。
  openGraph: {
    title: '关于作者 · FluentFlutter',
    description: '居然是二师兄 · FluentFlutter。GitHub：RichardXIAOW。',
    type: 'website',
  },
  twitter: {
    title: '关于作者 · FluentFlutter',
    description: '居然是二师兄 · FluentFlutter。GitHub：RichardXIAOW。',
  },
};

const GITHUB_URL = 'https://github.com/RichardXIAOW';

/**
 * 关于作者（/about）· 三维科技展厅
 *
 * 视觉主体是 AboutScene（星空 + 粒子人形 + 魔法法阵 + 能量光环 + 蓝牙数据流 + Bloom）。
 * 页面只承载两样信息：昵称与联系方式 —— 能力由画面表达，不用文字自述。
 *
 * 宽屏：人物在右、文案在左；窄屏：人物居中后方、文案居中。
 * WebGL 不可用 / prefers-reduced-motion 时由 AboutScene 静默降级，深色底兜底。
 */
export default function AboutPage() {
  return (
    <main
      id="main"
      className="relative min-h-[calc(100vh-var(--hd-h))] overflow-hidden bg-[#05070f] text-white"
    >
      {/* ── 3D 场景（WebGL 失败时静默消失，由底色兜底）── */}
      <AboutScene />

      {/* ── 四周暗角：压住画面边缘，让中心更聚焦 ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 58% 46%, rgba(5,7,15,0) 0%, rgba(5,7,15,0.28) 45%, rgba(5,7,15,0.82) 100%)',
        }}
      />

      {/* ── 顶/底渐隐，与站点头尾自然衔接 ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#05070f] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05070f] to-transparent" />

      {/* ── 角落 HUD 标签 ── */}
      <span className="pointer-events-none absolute left-5 top-5 z-10 font-mono text-[11px] uppercase tracking-[0.32em] text-white/25 sm:left-8 sm:top-7">
        About
      </span>
      <span className="pointer-events-none absolute right-5 top-5 z-10 font-mono text-[11px] uppercase tracking-[0.32em] text-white/25 sm:right-8 sm:top-7">
        FluentFlutter
      </span>

      {/* ── 文案层：宽屏左对齐，窄屏居中 ── */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-var(--hd-h))] w-full max-w-page flex-col justify-center px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:pl-6 lg:text-left">
          {/* 装饰性技术标签：不叙述能力，只做氛围 */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.34em] text-white/35 lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <i className="h-1 w-1 animate-pulse rounded-full bg-cyan-300" />
              BLE&nbsp;Stream
            </span>
            <span className="text-white/15">/</span>
            <span>OTA</span>
            <span className="text-white/15">/</span>
            <span>3D&nbsp;Visual</span>
          </div>

          <h1
            className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-[44px] font-bold leading-[1.08] tracking-tight text-transparent sm:text-[66px] lg:text-[78px]"
            style={{ textShadow: '0 0 60px rgba(56,189,248,0.35), 0 0 22px rgba(167,139,250,0.25)' }}
          >
            居然是二师兄
          </h1>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 text-[15.5px] font-medium text-white/85 backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-white/[0.12] hover:text-white hover:shadow-[0_0_28px_rgba(56,189,248,0.28)]"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            <QQCopyButton tone="dark" />
          </div>

          <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.28em] text-white/20">
            Move&nbsp;your&nbsp;cursor&nbsp;·&nbsp;the&nbsp;scene&nbsp;responds
          </p>
        </div>
      </div>
    </main>
  );
}
