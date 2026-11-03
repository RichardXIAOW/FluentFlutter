import type { Metadata } from "next";
import QQCopyButton from "@/components/QQCopyButton";
import ThreeBackdrop from "@/components/ThreeBackdrop";

export const metadata: Metadata = {
  title: "关于作者",
  description: "居然是二师兄 · FluentFlutter 站长。GitHub：RichardXIAOW。",
  // 覆写全局 openGraph/twitter description（含「蓝牙 / 定位 / 扫码」等能力叙述），
  // /about 页的社交卡片只保留站点级信息，不携带个人能力文案。
  openGraph: {
    title: "关于作者 · FluentFlutter",
    description: "居然是二师兄 · FluentFlutter。GitHub：RichardXIAOW。",
    type: "website",
  },
  twitter: {
    title: "关于作者 · FluentFlutter",
    description: "居然是二师兄 · FluentFlutter。GitHub：RichardXIAOW。",
  },
};

const GITHUB_URL = "https://github.com/RichardXIAOW";

/**
 * 关于作者（/about）
 *
 * 一块深色「展厅」：Three.js 3D 背景铺满整块，内容只留昵称与联系方式。
 * WebGL 不可用或 prefers-reduced-motion 时由 ThreeBackdrop 静默降级，
 * 深色 CSS 渐变兜底，页面不会崩。
 */
export default function AboutPage() {
  return (
    <main
      id="main"
      className="relative flex min-h-[calc(100vh-var(--hd-h))] flex-col overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(160deg, #070b14 0%, #0b1220 55%, #101a2e 100%)",
      }}
    >
      {/* ── 3D 背景（WebGL 失败时静默消失，由深色渐变兜底）── */}
      <ThreeBackdrop />

      {/* ── 极细网格线：两层正交渐变，叠在 3D 之上、内容之下 ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* ── 中央柔光暗角：让白色昵称压在 3D 线框上仍然清晰 ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(7,11,20,0.82) 0%, rgba(7,11,20,0.55) 28%, rgba(7,11,20,0) 62%)",
        }}
      />

      {/* ── 上下渐隐：压住网格与 3D 的边界，视觉收口 ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#070b14] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#101a2e] to-transparent"
      />

      {/* ── 角落小标签 ── */}
      <span className="pointer-events-none absolute left-5 top-5 font-mono text-[12px] uppercase tracking-[0.3em] text-white/30 sm:left-8 sm:top-7">
        About
      </span>
      <span className="pointer-events-none absolute right-5 top-5 font-mono text-[12px] uppercase tracking-[0.3em] text-white/30 sm:right-8 sm:top-7">
        FluentFlutter
      </span>

      {/* ── 展厅内容：昵称 + 联系方式 ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1
          className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-[40px] font-bold leading-tight tracking-tight text-transparent sm:text-[64px] lg:text-[72px]"
          style={{ textShadow: "0 0 48px rgba(56,189,248,0.25)" }}
        >
          居然是二师兄
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-[16px] font-medium text-white/85 backdrop-blur-sm transition hover:border-white/45 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <QQCopyButton tone="dark" />
        </div>
      </div>
    </main>
  );
}
