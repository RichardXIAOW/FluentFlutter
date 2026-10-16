'use client';

import { useState, type ReactNode } from 'react';
import {
  MI,
  P,
  IconBtn,
  SwitchI,
  ExpansionI,
  SnackBarI,
  DialogI,
  SheetI,
} from './mock-kit';

/**
 * 示例级预览注册表 —— 键为「组件 slug::示例标题」，与 data 里 title 严格一致。
 *
 * 核心原则：同一个组件下的几个示例，讲的是**不同写法带来的视觉差异**，
 * 所以每张图都必须长得不一样。例如 ElevatedButton 的
 * 「最基础的用法 / 改高度和圆角 / 带图标 / 请求中禁用（最常见的实战需求）」
 * 四张图分别是：默认按钮 / 三种尺寸圆角对比 / 带图标 / 空闲·请求中·禁用三态。
 *
 * 标题可用 _work/mock-status.cjs 机器校验，写错会直接报错。
 */

const Frame = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`flex min-h-[111px] select-none items-center justify-center overflow-hidden p-4 ${className}`}
  >
    {children}
  </div>
);

const Spinner = ({
  size = 15,
  cls = 'border-white/35 border-t-white',
}: {
  size?: number;
  cls?: string;
}) => (
  <span
    className={`inline-block animate-spin rounded-full border-2 ${cls}`}
    style={{ width: size, height: size }}
  />
);

const Box = ({
  children,
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <span
    className={`flex items-center justify-center rounded text-[12.5px] ${className}`}
  >
    {children}
  </span>
);

/* 步骤条（提到外面，避免与外层 hooks 顺序纠缠） */
function StepsRow({ steps, cur }: { steps: string[]; cur: number }) {
  return (
    <div className="flex w-full items-start">
      {steps.map((t, i) => {
        const done = i < cur;
        const active = i === cur;
        return (
          <div key={t} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className={`h-px flex-1 ${
                  i === 0 ? 'bg-transparent' : done || active ? 'bg-brand-500' : 'bg-ink-200'
                }`}
              />
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${
                  done
                    ? 'bg-solid text-white'
                    : active
                      ? 'border-2 border-brand-500 bg-surface text-brand-600'
                      : 'border-2 border-ink-300 bg-surface text-ink-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={`h-px flex-1 ${
                  i === steps.length - 1 ? 'bg-transparent' : done ? 'bg-brand-500' : 'bg-ink-200'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-[12px] ${active ? 'font-medium text-brand-600' : 'text-ink-600'}`}
            >
              {t}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** IndexedStack：切页保留各自状态 */
function IndexedStackDemo() {
  // 与代码一一对应：4 个 tab（首页/分类/购物车/我的），IndexedStack 让每个页面的 State 都保留
  const tabs = ['首页', '分类', '购物车', '我的'];
  const [idx, setIdx] = useState(0);
  const [counts, setCounts] = useState([3, 0, 1, 0]);
  const bump = () =>
    setCounts((c) => c.map((v, i) => (i === idx ? v + 1 : v)));
  return (
    <Frame className="w-full max-w-[300px] p-4">
      <div className="w-full rounded-xl border border-dashed border-brand-300 p-2.5">
        <div className="flex h-11 items-center justify-center rounded-lg bg-brand-50 text-[13.5px] font-medium text-brand-700">
          {tabs[idx]} · 计数 {counts[idx]}
        </div>
        <div className="mt-2 flex items-center gap-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setIdx(i)}
              className={`flex-1 rounded px-1 py-1 text-[12px] transition ${
                idx === i ? 'bg-solid text-white' : 'bg-ink-50 text-ink-500'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px bg-ink-200" />
          <button
            type="button"
            onClick={bump}
            className="rounded bg-ink-100 px-2 py-1 text-[12.5px] text-ink-700 active:scale-95"
          >
            当前页 +1
          </button>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-ink-400">
          在「首页」加几次 → 切到「我的」→ 再切回来，数字不会归零。
        </p>
      </div>
    </Frame>
  );
}

export const demoMocks: Record<string, () => ReactNode> = {
  /* ═══════════════ 通用 ═══════════════ */

  'elevated-button::最基础的用法': () => (
    <Frame>
      <span className="inline-flex h-9 items-center justify-center rounded-[18px] bg-brand-50 px-5 text-[15px] font-medium text-brand-600 shadow-sm">
        提交
      </span>
    </Frame>
  ),
  'elevated-button::改高度和圆角': () => (
    <Frame className="flex-col gap-2.5">
      {[
        ['默认 40 / 圆角 20', 'h-9 rounded-[18px] px-4'],
        ['高 48 / 圆角 10', 'h-12 rounded-[10px] px-5'],
        ['高 36 / 直角', 'h-9 rounded-none px-4'],
      ].map(([t, cls]) => (
        <div key={t} className="flex items-center gap-3">
          <span className="w-[120px] shrink-0 text-[12.5px] text-ink-400">{t}</span>
          <span
            className={`inline-flex items-center justify-center bg-brand-50 text-[14.5px] font-medium text-brand-600 shadow-sm ${cls}`}
          >
            按钮
          </span>
        </div>
      ))}
    </Frame>
  ),
  'elevated-button::带图标': () => (
    <Frame className="gap-3">
      <span className="inline-flex h-9 items-center gap-1.5 rounded-[18px] bg-brand-50 px-4 text-[15px] font-medium text-brand-600 shadow-sm">
        <span className="text-[17px] leading-none">＋</span>新建
      </span>
      <span className="inline-flex h-9 items-center gap-1.5 rounded-[18px] bg-brand-50 px-4 text-[15px] font-medium text-brand-600 shadow-sm">
        <span className="text-[17px] leading-none">↓</span>下载
      </span>
      <span className="inline-flex h-9 items-center gap-1.5 rounded-[18px] bg-brand-50 px-4 text-[15px] font-medium text-brand-600 shadow-sm">
        下一步
        <MI d={P.chevR} size={15} />
      </span>
    </Frame>
  ),
  'elevated-button::请求中禁用（最常见的实战需求）': () => (
    <Frame className="w-full flex-col items-stretch gap-3 p-4">
      <div className="flex items-center gap-3">
        <span className="w-[70px] shrink-0 text-[12.5px] text-ink-400">空闲</span>
        <span className="inline-flex h-9 items-center rounded-[18px] bg-solid px-4 text-[15px] font-medium text-white shadow-sm">
          提交
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-[70px] shrink-0 text-[12.5px] text-brand-600">请求中</span>
        <span className="inline-flex h-9 min-w-[104px] items-center justify-center gap-2 rounded-[18px] bg-solid/45 px-4 text-[15px] font-medium text-white">
          <Spinner />
          提交中…
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-[70px] shrink-0 text-[12.5px] text-ink-400">禁用</span>
        <span className="inline-flex h-9 items-center rounded-[18px] bg-brand-50 px-4 text-[15px] font-medium text-ink-400 shadow-sm">
          不可用
        </span>
      </div>
    </Frame>
  ),

  'filled-button::三种强调层级': () => (
    <Frame className="w-full max-w-[300px] flex-col gap-2.5">
      {[
        ['high', 'bg-solid text-white', '主操作'],
        ['medium', 'bg-brand-100 text-brand-800', '次操作'],
        ['low', 'bg-brand-50 text-brand-700', '弱操作'],
      ].map(([lv, cls, t]) => (
        <div key={lv} className="flex w-full items-center gap-3">
          <span className="w-12 shrink-0 font-mono text-[12px] text-ink-400">{lv}</span>
          <span
            className={`inline-flex h-9 flex-1 items-center justify-center rounded-[18px] text-[14.5px] font-medium ${cls}`}
          >
            {t}
          </span>
        </div>
      ))}
    </Frame>
  ),
  'filled-button::在主题里统一配好按钮高度': () => (
    <Frame className="w-full max-w-[290px] flex-col items-stretch gap-2 p-4">
      <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50/40 p-2">
        <span className="block font-mono text-[11.5px] text-brand-600">
          主题默认 → height 40
        </span>
        <span className="mt-1 inline-flex h-9 w-full items-center justify-center rounded-[18px] bg-solid text-[14.5px] font-medium text-white">
          按钮
        </span>
      </div>
      <div className="rounded-lg border border-dashed border-ok/50 bg-ok/5 p-2">
        <span className="block font-mono text-[11.5px] text-ok">
          minimumSize: Size(0, 48)
        </span>
        <span className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-solid text-[15px] font-medium text-white">
          按钮
        </span>
      </div>
    </Frame>
  ),

  'outlined-button::成组出现的次要操作': () => (
    // 与代码一一对应：Row(mainAxisAlignment: end) + OutlinedButton('取消') + FilledButton('保存')
    <Frame className="p-4">
      <div className="w-full max-w-[300px] rounded-xl bg-surface p-3 shadow-card ring-1 ring-ink-100">
        <p className="mb-2.5 text-[13px] text-ink-500">
          取消用描边降低层级，主操作仍然用实心
        </p>
        <div className="flex justify-end gap-3">
          <span className="inline-flex h-9 items-center rounded-[18px] border border-ink-300 px-4 text-[14.5px] font-medium text-brand-600">
            取消
          </span>
          <span className="inline-flex h-9 items-center rounded-[18px] bg-solid px-4 text-[14.5px] font-medium text-white">
            保存
          </span>
        </div>
      </div>
    </Frame>
  ),

  'text-button::对话框里的标准排布': () => (
    <Frame className="p-4">
      <div className="w-full max-w-[290px] rounded-xl bg-surface p-4 shadow-pop ring-1 ring-ink-100">
        <p className="text-[15.5px] font-semibold text-ink-900">放弃编辑？</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
          未保存的内容会丢失。
        </p>
        <div className="mt-3 flex justify-end gap-1">
          <span className="rounded px-3 py-1.5 text-[14.5px] font-medium text-brand-600">
            取消
          </span>
          <span className="rounded px-3 py-1.5 text-[14.5px] font-medium text-danger">
            放弃
          </span>
        </div>
      </div>
    </Frame>
  ),

  'icon-button::AppBar 上的标准用法': () => (
    <Frame className="p-4">
      <div className="flex h-12 w-full max-w-[330px] items-center gap-1 rounded-xl bg-solid px-1.5 text-white">
        <IconBtn className="text-white">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </IconBtn>
        <span className="text-[15.5px] font-medium">商品详情</span>
        <span className="ml-auto flex items-center">
          <IconBtn className="text-white">
            <MI d={P.fav} size={18} />
          </IconBtn>
          <IconBtn className="text-white">
            <MI d={P.share} size={18} />
          </IconBtn>
          <IconBtn className="text-white">
            <MI d={P.cart} size={18} />
          </IconBtn>
        </span>
      </div>
    </Frame>
  ),
  'icon-button::带圆形底的图标按钮': () => (
    <Frame className="gap-5">
      {[
        ['filled', 'bg-solid text-white'],
        ['tonal', 'bg-brand-50 text-brand-600'],
        ['outlined', 'border border-ink-300 text-brand-600'],
      ].map(([t, cls]) => (
        <div key={t} className="flex flex-col items-center gap-1.5">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${cls}`}>
            <MI d={P.fav} size={19} />
          </span>
          <span className="text-[12px] text-ink-400">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'icon-button::禁用态': () => (
    <Frame className="gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600">
          <MI d={P.share} size={20} />
        </span>
        <span className="text-[12px] text-ok">可点</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400">
          <MI d={P.share} size={20} />
        </span>
        <span className="text-[12px] text-ink-400">onPressed: null</span>
      </div>
    </Frame>
  ),

  'icon::基本用法与尺寸': () => (
    <Frame className="items-end gap-4">
      {[
        [16, '16'],
        [24, '24 默认'],
        [32, '32'],
      ].map(([s, t]) => (
        <div key={String(t)} className="flex flex-col items-center gap-1.5">
          <MI d={P.star} size={Number(s)} className="text-warn" />
          <span className="text-[12px] text-ink-400">{t}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1.5">
        <MI d={P.star} size={26} className="text-brand-600" />
        <span className="text-[12px] text-ink-400">color</span>
      </div>
    </Frame>
  ),
  'icon::纯装饰图标要标记为无需朗读': () => (
    <Frame className="gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ok/15">
          <MI d={P.person} size={18} className="text-ok" />
        </span>
        <span className="text-[12px] text-ink-400">会被读屏读到</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100">
          <MI d={P.person} size={18} className="text-ink-400" />
        </span>
        <span className="text-[12px] text-ink-400">silent: true</span>
      </div>
    </Frame>
  ),

  'text::用主题的字号阶梯，而不是自己写 fontSize': () => (
    <Frame className="w-full max-w-[330px] flex-col items-start gap-2 p-4">
      {[
        ['displaySmall', 'text-[26px]'],
        ['headlineSmall', 'text-[21px]'],
        ['titleMedium', 'text-[18px] font-medium'],
        ['bodyMedium', 'text-[16px]'],
        ['labelSmall', 'text-[13px] font-medium'],
      ].map(([n, cls]) => (
        <div key={n} className="flex w-full items-baseline gap-3">
          <span className="w-[84px] shrink-0 font-mono text-[11px] text-ink-400">{n}</span>
          <span className={`text-ink-900 ${cls}`}>示例文字</span>
        </div>
      ))}
    </Frame>
  ),
  'text::单行截断（列表项必备）': () => (
    <Frame className="w-full max-w-[290px] flex-col items-stretch gap-2.5 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11.5px] text-danger">
          maxLines: 1 → 单行省略
        </span>
        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14.5px] text-ink-700">
          这是一段特别长的商品标题用于演示单行截断的效果
        </p>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11.5px] text-ok">maxLines: 2 → 换行</span>
        <p className="line-clamp-2 text-[14.5px] leading-snug text-ink-700">
          这是一段特别长的商品标题用于演示两行截断的效果
        </p>
      </div>
    </Frame>
  ),
  'text::富文本：只让一部分变样式': () => (
    <Frame className="w-full flex-col items-start gap-2.5 p-4">
      <span className="text-[15.5px] leading-relaxed text-ink-700">
        订单 <b className="font-semibold text-brand-600">#2026</b> 已发货，实付{' '}
        <span className="font-bold text-danger">¥1,299.00</span>
      </span>
      <span className="text-[14px] leading-relaxed text-ink-500">
        超时未取件将自动退回（
        <span className="underline decoration-dotted">查看规则</span>）
      </span>
    </Frame>
  ),

  'divider::三种常见形态': () => (
    <Frame className="w-full flex-col items-stretch gap-3 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">纯线</span>
        <div className="h-px w-full bg-ink-200" />
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">带标签</span>
        <div className="flex w-full items-center gap-2">
          <span className="h-px flex-1 bg-ink-200" />
          <span className="text-[12px] text-ink-400">或</span>
          <span className="h-px flex-1 bg-ink-200" />
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">竖向</span>
        <div className="flex h-8 items-center gap-3">
          <span className="text-[13px] text-ink-700">左</span>
          <span className="h-full w-px bg-ink-200" />
          <span className="text-[13px] text-ink-700">右</span>
        </div>
      </div>
    </Frame>
  ),
  'divider::列表分隔线：用 separated 而不是手写': () => (
    <Frame className="w-full max-w-[280px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        {[
          ['收货地址', '广东省深圳市'],
          ['支付方式', '微信支付'],
          ['发票信息', '电子发票'],
        ].map(([a, b], i) => (
          <div key={a}>
            {i > 0 && <div className="ml-3 h-px bg-ink-100" />}
            <div className="flex items-center px-3 py-2">
              <span className="text-[14px] text-ink-800">{a}</span>
              <span className="ml-auto text-[13px] text-ink-500">{b}</span>
            </div>
          </div>
        ))}
      </div>
      <span className="mt-1.5 block text-center font-mono text-[11px] text-ink-400">
        分隔线自动从内容左侧缩进
      </span>
    </Frame>
  ),

  'card::最常见的商品/文章卡片': () => (
    <Frame className="w-full max-w-[270px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="h-[81px] bg-gradient-to-br from-brand-100 to-brand-200" />
        <div className="p-3">
          <p className="text-[14.5px] font-semibold text-ink-900">PulseShop 会员年卡</p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
            全年免运费，专属客服，生日双倍积分。
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[17px] font-bold text-danger">¥199</span>
            <span className="text-[12px] text-ink-400">1.2 万人已购</span>
          </div>
        </div>
      </div>
    </Frame>
  ),
  'card::纯色卡片（无阴影，靠底色区分）': () => (
    <Frame className="w-full max-w-[400px] gap-2.5">
      {[
        ['elevated', 'bg-surface shadow-card ring-1 ring-ink-100', '阴影 + 白底'],
        ['filled', 'bg-ink-50', '纯色底，无阴影'],
        ['outlined', 'border border-ink-200 bg-surface', '只有描边'],
      ].map(([t, cls, d]) => (
        <div key={t} className={`flex-1 rounded-xl p-2.5 ${cls}`}>
          <p className="text-[13.5px] font-semibold text-ink-900">{t}</p>
          <p className="mt-1 text-[12px] text-ink-500">{d}</p>
        </div>
      ))}
    </Frame>
  ),

  'container::基础：一只有样式的盒子': () => (
    <Frame>
      <div className="rounded-xl bg-brand-50 px-5 py-4 ring-1 ring-brand-200">
        <span className="text-[14.5px] text-brand-700">
          color + borderRadius + padding 一次写完
        </span>
      </div>
    </Frame>
  ),
  'container::什么时候不该用 Container': () => (
    <Frame className="w-full max-w-[330px] flex-col gap-2 p-4">
      <div className="rounded-lg border border-danger/40 bg-danger/5 p-2.5">
        <span className="block text-[12.5px] font-medium text-danger">
          ❌ 只想要间距 → 不该用 Container
        </span>
        <span className="mt-0.5 block font-mono text-[11.5px] text-ink-500">
          Container(padding: EdgeInsets.all(8))
        </span>
      </div>
      <div className="rounded-lg border border-ok/40 bg-ok/5 p-2.5">
        <span className="block text-[12.5px] font-medium text-ok">
          ✅ 意图明确 → Padding / SizedBox
        </span>
        <span className="mt-0.5 block font-mono text-[11.5px] text-ink-500">
          Padding(padding: EdgeInsets.all(8))
        </span>
      </div>
    </Frame>
  ),
  'container::渐变背景': () => (
    <Frame>
      <div className="flex h-[86px] w-[232px] items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700">
        <span className="text-[14px] font-medium text-white">BoxDecoration(gradient: …)</span>
      </div>
    </Frame>
  ),

  'sized-box::替代「写死间距」的几种写法': () => (
    <Frame className="w-full max-w-[300px] flex-col items-stretch gap-2 p-4">
      {[
        ['SizedBox(height: 16)', '固定间距'],
        ['SizedBox.shrink()', '不占位（条件显示）'],
        ['SizedBox.expand()', '撑满父级'],
      ].map(([code, t]) => (
        <div
          key={code}
          className="flex items-center gap-2 rounded border border-dashed border-brand-200 bg-brand-50/40 px-2 py-1.5"
        >
          <span className="font-mono text-[11.5px] text-brand-600">{code}</span>
          <span className="ml-auto text-[12px] text-ink-500">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'sized-box::把子组件撑成正方形': () => (
    <Frame className="gap-5">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-[74px] w-[100px] items-center justify-center rounded-lg bg-ink-100 text-[12px] text-ink-500">
          长方形
        </span>
        <span className="font-mono text-[11.5px] text-ink-400">原始尺寸</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex aspect-square h-[74px] items-center justify-center rounded-lg bg-solid text-[12px] text-white">
          正方形
        </span>
        <span className="font-mono text-[11.5px] text-brand-600">AspectRatio 1:1</span>
      </div>
    </Frame>
  ),

  'selectable-text::订单号可复制 + 整页可选中': () => (
    <Frame className="w-full max-w-[280px] flex-col items-stretch gap-2.5 p-4">
      <div className="rounded-lg bg-ink-50 px-3 py-2">
        <span className="block text-[11.5px] text-ink-400">普通 Text（选了没反应）</span>
        <span className="text-[14px] text-ink-600">SN20261015001</span>
      </div>
      <div className="rounded-lg bg-brand-50 px-3 py-2 ring-1 ring-brand-200">
        <span className="block text-[11.5px] text-brand-600">SelectableText（可选中复制）</span>
        <span className="font-mono text-[14px] text-ink-900 ring-1 ring-brand-500/50 ring-offset-1">
          SN20261015001
        </span>
      </div>
      <span className="text-center font-mono text-[11px] text-ink-400">
        SelectionArea 可让整页可选中
      </span>
    </Frame>
  ),

  'rich-text::价格 / 协议链接 / WidgetSpan 插图标': () => (
    <Frame className="w-full flex-col items-start gap-3 p-4">
      <div className="flex items-baseline gap-0.5">
        <span className="text-[15px] font-medium text-danger">¥</span>
        <span className="text-[28px] font-bold leading-none text-danger">1299</span>
        <span className="text-[15px] font-semibold text-danger">.00</span>
        <span className="ml-2 rounded bg-ok/10 px-1.5 py-0.5 text-[12px] font-medium text-ok">
          官方旗舰店
        </span>
      </div>
      <span className="text-[13px] leading-relaxed text-ink-500">
        下单即表示同意
        <span className="text-brand-600 underline decoration-dotted">《用户协议》</span>
        与
        <span className="text-brand-600 underline decoration-dotted">《隐私政策》</span>
      </span>
      <span className="flex items-center gap-1 text-[13px] text-brand-600">
        <MI d={P.person} size={12} />
        WidgetSpan 插图标
      </span>
    </Frame>
  ),

  'ink-well::水波纹被盖住的经典 bug 与修法': () => (
    <Frame className="w-full max-w-[410px] gap-3 p-4">
      <div className="flex-1">
        <span className="mb-1 block text-[11.5px] text-danger">❌ Container 盖住水波</span>
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2.5 shadow-card ring-1 ring-ink-100">
          <span className="text-[13.5px] text-ink-700">点我</span>
          <span className="ml-auto text-[11px] text-ink-400">无反馈</span>
        </div>
      </div>
      <div className="flex-1">
        <span className="mb-1 block text-[11.5px] text-ok">✅ Ink 铺底 + InkWell 在上</span>
        <div className="relative flex items-center gap-2 overflow-hidden rounded-lg bg-surface px-3 py-2.5 shadow-card ring-1 ring-ink-100">
          <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20" />
          <span className="relative text-[13.5px] text-ink-700">点我</span>
          <span className="relative ml-auto text-[11px] text-brand-600">有涟漪</span>
        </div>
      </div>
    </Frame>
  ),
  'ink-well::GestureDetector 做滑动删除 + 全区域可点': () => (
    <Frame className="w-full max-w-[290px] p-4">
      <div className="relative w-full overflow-hidden rounded-xl">
        <span className="absolute inset-y-0 right-0 flex w-14 items-center justify-center bg-danger text-[12.5px] font-medium text-white">
          删除
        </span>
        <div className="relative -translate-x-[52px] rounded-xl bg-surface px-3 py-2.5 shadow-card ring-1 ring-ink-100">
          <span className="flex items-center gap-2">
            <span className="text-[14px] text-ink-800">滑动整行都可触发</span>
            <MI d={P.chevR} size={15} className="ml-auto text-ink-400" />
          </span>
          <span className="mt-1 block text-[11.5px] text-ink-400">
            InkWell 的 onTap 全区域可点
          </span>
        </div>
      </div>
    </Frame>
  ),

  /* ═══════════════ 布局 ═══════════════ */

  'row::左右分布：用 spaceBetween 或 Spacer': () => (
    <Frame className="w-full flex-col gap-2.5 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          MainAxisAlignment.spaceBetween
        </span>
        <div className="flex w-full items-center justify-between rounded border border-dashed border-brand-200 bg-brand-50/40 p-1.5">
          <Box className="h-6 w-12 bg-solid !text-white">左侧</Box>
          <Box className="h-6 w-12 bg-brand-100 !text-brand-800">右侧</Box>
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">Spacer() 撑开</span>
        <div className="flex w-full items-center rounded border border-dashed border-brand-200 bg-brand-50/40 p-1.5">
          <Box className="h-6 w-12 bg-solid !text-white">左侧</Box>
          <span className="mx-1 flex-1 border-t border-dotted border-brand-400" />
          <Box className="h-6 w-12 bg-brand-100 !text-brand-800">右侧</Box>
        </div>
      </div>
    </Frame>
  ),
  'row::让 Row 里的文字可伸缩（避免溢出）': () => (
    <Frame className="w-full flex-col gap-2 p-4">
      <div>
        <span className="mb-1 block text-[11.5px] text-danger">❌ 不用 Expanded → 溢出</span>
        <div className="flex w-full gap-1.5 overflow-hidden rounded border border-danger/40 bg-danger/5 p-1.5">
          <Box className="h-6 w-9 shrink-0 bg-ink-200 !text-ink-600">图标</Box>
          <span className="shrink-0 whitespace-nowrap rounded bg-danger/15 px-2 py-1 text-[12px] text-danger">
            很长的标题文字被挤出边界 →
          </span>
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11.5px] text-ok">✅ 用 Expanded → 自动换行</span>
        <div className="flex w-full gap-1.5 rounded border border-ok/40 bg-ok/5 p-1.5">
          <Box className="h-6 w-9 shrink-0 bg-ink-200 !text-ink-600">图标</Box>
          <span className="min-w-0 flex-1 rounded bg-solid px-2 py-1 text-[12px] leading-tight text-white">
            很长的标题文字自动换行不溢出
          </span>
        </div>
      </div>
    </Frame>
  ),
  'row::垂直方向对齐的三个值': () => (
    <Frame className="w-full flex-col gap-2 p-4">
      {[
        ['crossAxisAlignment: start', 'items-start'],
        ['center', 'items-center'],
        ['stretch', 'items-stretch'],
      ].map(([t, cls]) => (
        <div key={t}>
          <span className="mb-1 block font-mono text-[11px] text-ink-400">{t}</span>
          <div className={`flex h-11 w-full gap-1.5 rounded border border-dashed border-brand-200 p-1.5 ${cls}`}>
            <Box className="h-9 w-9 bg-solid !text-white">小</Box>
            <Box className="h-5 w-9 bg-brand-100 !text-brand-800">中</Box>
          </div>
        </div>
      ))}
    </Frame>
  ),

  'column::居中：为什么 mainAxisAlignment.center 有时没用': () => (
    <Frame className="w-full items-stretch gap-3 p-4">
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-[11px] leading-tight text-danger">
          mainAxisSize.max（默认）→ 没有多余空间，center 无效
        </span>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded border border-dashed border-danger/40 bg-danger/5 p-2">
          <Box className="h-5 w-14 bg-ink-200 !text-ink-600">子项</Box>
          <Box className="h-5 w-14 bg-ink-200 !text-ink-600">子项</Box>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-[11px] leading-tight text-ok">
          mainAxisSize.min → 居中生效
        </span>
        <div className="flex flex-1 flex-col items-center justify-center rounded border border-dashed border-ok/50 bg-ok/5 p-2">
          <div className="flex flex-col items-center gap-1">
            <Box className="h-5 w-14 bg-solid !text-white">子项</Box>
            <Box className="h-5 w-14 bg-solid !text-white">子项</Box>
          </div>
        </div>
      </div>
    </Frame>
  ),
  'column::表单：标签在上、输入在下': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2.5 p-4">
      {[
        ['收件人', '曹禹'],
        ['手机号', '138****8000'],
      ].map(([l, v]) => (
        <div key={l}>
          <span className="mb-0.5 block text-[12px] text-ink-500">{l}</span>
          <div className="rounded-lg border border-ink-200 bg-surface px-3 py-1.5 text-[14px] text-ink-900">
            {v}
          </div>
        </div>
      ))}
      <span className="font-mono text-[11px] text-ink-400">
        crossAxisAlignment: stretch 让输入框同宽
      </span>
    </Frame>
  ),
  'column::Column 太长怎么办': () => (
    <Frame className="w-full max-w-[260px] flex-col gap-2 p-4">
      <div>
        <span className="mb-1 block text-[11px] text-danger">❌ 直接塞 → 溢出黄黑条</span>
        <div className="overflow-hidden rounded border border-dashed border-danger/40">
          <div className="flex flex-col gap-1 bg-danger/5 p-1.5">
            {[1, 2, 3].map((i) => (
              <Box key={i} className="h-4 w-full shrink-0 bg-ink-200 !text-ink-600">
                项 {i}
              </Box>
            ))}
          </div>
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#f5c2c0_0_6px,#fae6e5_6px_12px)]" />
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-ok">✅ 套 SingleChildScrollView</span>
        <div className="h-[67px] overflow-y-auto rounded border border-dashed border-ok/50 bg-ok/5 p-1.5 thin-scroll">
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} className="h-4 w-full shrink-0 bg-brand-50 !text-brand-700">
                项 {i}
              </Box>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  ),

  'stack::图片右下角浮一个价签': () => (
    <Frame>
      <div className="relative h-[114px] w-[164px] overflow-hidden rounded-xl bg-gradient-to-br from-ink-300 to-ink-400">
        <span className="absolute bottom-2 right-2 rounded-md bg-danger px-2 py-1 text-[13px] font-semibold text-white shadow">
          ¥199
        </span>
      </div>
    </Frame>
  ),
  'stack::头像右上角的小红点': () => (
    <Frame className="gap-5">
      {[
        ['在线', 'bg-ok'],
        ['忙碌', 'bg-danger'],
      ].map(([t, c]) => (
        <div key={t} className="flex flex-col items-center gap-1.5">
          <span className="relative">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-[19px] font-semibold text-brand-700">
              曹
            </span>
            <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${c} ring-2 ring-surface`} />
          </span>
          <span className="text-[12px] text-ink-400">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'stack::加载遮罩：内容之上盖一层半透明': () => (
    <Frame className="w-full max-w-[270px]">
      <div className="relative w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-surface/70">
          <Spinner size={22} cls="border-brand-200 border-t-brand-500" />
        </span>
        <div className="space-y-2 p-3">
          <div className="h-2.5 w-2/3 rounded bg-ink-100" />
          <div className="h-2.5 w-full rounded bg-ink-100" />
          <div className="h-2.5 w-1/2 rounded bg-ink-100" />
        </div>
      </div>
    </Frame>
  ),

  'padding::四种构造方式': () => (
    <Frame className="w-full flex-col gap-2 p-4">
      {[
        ['EdgeInsets.all(12)', 'p-3'],
        ['EdgeInsets.symmetric(horizontal: 20)', 'px-5 py-1'],
        ['EdgeInsets.only(left: 28)', 'pl-7 pr-1 py-1'],
      ].map(([code, cls]) => (
        <div key={code}>
          <span className="mb-0.5 block font-mono text-[11px] text-ink-400">{code}</span>
          <div className="w-full rounded border border-dashed border-warn/60 bg-warn/5">
            <div className={`flex w-full items-center ${cls}`}>
              <span className="flex flex-1 items-center justify-center rounded bg-brand-50 py-1.5 text-[12.5px] text-brand-700">
                内容
              </span>
            </div>
          </div>
        </div>
      ))}
    </Frame>
  ),
  'padding::列表项的标准内边距': () => (
    <Frame className="w-full max-w-[290px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="h-9 w-9 shrink-0 rounded-lg bg-brand-50" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] text-ink-900">标准列表项</span>
            <span className="block truncate font-mono text-[11px] text-ink-400">
              horizontal: 16, vertical: 12
            </span>
          </span>
        </div>
      </div>
    </Frame>
  ),

  'center::居中 vs 单方向对齐': () => (
    <Frame className="gap-5">
      {[
        ['Center', 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', 'border-brand-300'],
        ['Align(topRight)', 'right-2 top-2', 'border-warn/60'],
      ].map(([t, pos, bd]) => (
        <div key={t} className="flex flex-col items-center gap-1.5">
          <div className={`relative h-[84px] w-[102px] rounded-lg border border-dashed ${bd}`}>
            <span className={`absolute ${pos} rounded bg-brand-50 px-1.5 py-0.5 text-[11.5px] text-brand-700`}>
              {t}
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-400">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'center::居中一个「会撑满」的组件为什么会失败': () => (
    <Frame className="w-full flex-col gap-2 p-4">
      <div>
        <span className="mb-1 block text-[11px] text-danger">
          ❌ Center 套 width:∞ 的 Container → 撑满，看不出居中
        </span>
        <div className="flex h-9 w-full items-center justify-center rounded border border-dashed border-danger/40 bg-danger/5">
          <span className="h-full w-full rounded bg-ink-200/70" />
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-ok">✅ 给子组件一个有限尺寸</span>
        <div className="flex h-9 w-full items-center justify-center rounded border border-dashed border-ok/50 bg-ok/5">
          <span className="flex h-6 w-20 items-center justify-center rounded bg-solid text-[12px] text-white">
            子组件
          </span>
        </div>
      </div>
    </Frame>
  ),

  'expanded::Expanded vs Flexible 的区别': () => (
    <Frame className="w-full flex-col gap-2.5 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          Expanded → 强制占满剩余空间
        </span>
        <div className="flex w-full gap-1.5">
          <Box className="h-7 w-10 shrink-0 bg-ink-100 !text-ink-500">固定</Box>
          <Box className="h-7 flex-1 bg-solid !text-white">Expanded</Box>
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          Flexible → 内容小就只占内容大小
        </span>
        <div className="flex w-full gap-1.5">
          <Box className="h-7 w-10 shrink-0 bg-ink-100 !text-ink-500">固定</Box>
          <Box className="h-7 w-[52px] bg-ok/20 !text-ok">Flexible</Box>
          <Box className="h-7 flex-1 bg-ink-50 !text-ink-400">空</Box>
        </div>
      </div>
    </Frame>
  ),
  'expanded::按比例分配宽度': () => (
    <Frame className="w-full p-4">
      <div className="flex w-full gap-1.5">
        {[
          ['1', 'flex-1', 'bg-brand-300'],
          ['2', 'flex-[2]', 'bg-brand-500'],
          ['3', 'flex-[3]', 'bg-brand-700'],
        ].map(([f, cls, bg]) => (
          <Box key={f} className={`h-9 ${cls} ${bg} !text-white`}>
            flex {f}
          </Box>
        ))}
      </div>
    </Frame>
  ),

  'spacer::Row 两端对齐 / Column 底部顶住': () => (
    // 与代码一一对应：① 收货地址 + 修改 ② 图标+地址 + 复制（只让后两个靠右） ③ Column 里按钮吸底（保存）
    <Frame className="w-full max-w-[300px] flex-col gap-2.5 p-4">
      <div>
        <span className="mb-1 block text-[11px] text-ink-400">Row + Spacer → 左右两端</span>
        <div className="flex w-full items-center rounded border border-dashed border-brand-200 bg-brand-50/40 px-2 py-1.5">
          <span className="text-[13px] text-ink-700">收货地址</span>
          <span className="mx-1 flex-1 border-t border-dotted border-brand-400" />
          <span className="text-[13px] text-brand-600">修改</span>
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-ink-400">
          三个元素只让后两个靠右 —— spaceBetween 做不到
        </span>
        <div className="flex w-full items-center rounded border border-dashed border-brand-200 bg-brand-50/40 px-2 py-1.5">
          <span className="text-[13px] text-ink-700">📍 广州市天河区</span>
          <span className="mx-1 flex-1 border-t border-dotted border-brand-400" />
          <span className="text-[13px] text-brand-600">复制</span>
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-ink-400">Column + Spacer → 按钮顶到底部</span>
        <div className="flex h-[65px] flex-col rounded border border-dashed border-ok/50 bg-ok/5 p-1.5">
          <span className="text-[12.5px] text-ink-600">AddressForm 表单内容</span>
          <span className="flex-1" />
          <span className="rounded bg-solid py-1 text-center text-[12px] text-white">保存</span>
        </div>
      </div>
    </Frame>
  ),

  'flexible::Expanded 与 Flexible 的实际差别': () => (
    // 与代码一一对应：① Flexible(fit: loose) 内容多短占多短 ② Expanded 撑满剩余 ③ flex 2:1
    <Frame className="w-full flex-col gap-2.5 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          Flexible(fit: loose) · 文字短，容器就短
        </span>
        <div className="flex w-full gap-1.5">
          <Box className="h-7 w-10 shrink-0 bg-ink-100 !text-ink-500">固定</Box>
          <Box className="h-7 w-[56px] bg-ok/25 !text-ok">只占内容</Box>
          <Box className="h-7 flex-1 bg-ink-50 !text-ink-400">留白</Box>
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          Expanded · 永远撑满剩余宽度
        </span>
        <div className="flex w-full gap-1.5">
          <Box className="h-7 w-10 shrink-0 bg-ink-100 !text-ink-500">固定</Box>
          <Box className="h-7 flex-1 bg-solid !text-white">撑满剩余</Box>
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ink-400">
          Expanded(flex: 2) + Expanded(flex: 1) · 按 2:1 分
        </span>
        <div className="flex w-full gap-1.5">
          <Box className="h-7 flex-[2] bg-solid !text-white">2 份</Box>
          <Box className="h-7 flex-1 bg-ok/25 !text-ok">1 份</Box>
        </div>
      </div>
    </Frame>
  ),

  'wrap::标签云（最典型的用法）': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="flex flex-wrap gap-1.5">
        {['热门', '数码', '服饰', '食品生鲜', '美妆个护', '家居', '运动'].map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-2.5 py-1 text-[13px] ${
              i < 3 ? 'bg-solid text-white' : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </Frame>
  ),
  'wrap::筛选条件标签': () => (
    <Frame className="w-full max-w-[270px] flex-col gap-2 p-4">
      <span className="text-[11px] text-ink-400">行放不下就自动换行</span>
      <div className="flex w-full flex-wrap gap-1.5">
        {['包邮', '七天无理由', '现货', '官方旗舰', '支持分期'].map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 rounded bg-brand-50 px-2 py-0.5 text-[12.5px] text-brand-700 ring-1 ring-brand-200"
          >
            {t}
            <span className="text-[11.5px] text-brand-600">×</span>
          </span>
        ))}
      </div>
      <div className="flex items-center border-t border-ink-100 pt-2">
        <span className="text-[12px] text-ink-400">共 5 个条件</span>
        <span className="ml-auto text-[12px] text-brand-600">重置</span>
      </div>
    </Frame>
  ),

  'grid-view::固定 3 列的商品宫格': () => (
    <Frame className="w-full flex-col items-center gap-2 p-4">
      <span className="font-mono text-[11px] text-ink-400">crossAxisCount: 3 · spacing 8</span>
      <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-md bg-surface p-1 shadow-card ring-1 ring-ink-100">
            <div className="flex aspect-square items-center justify-center rounded bg-brand-50 text-[11px] text-brand-600">
              {i + 1}
            </div>
            <div className="mt-1 h-1.5 w-3/4 rounded bg-ink-100" />
          </div>
        ))}
      </div>
    </Frame>
  ),
  'grid-view::自适应列数（不同屏幕都能用）': () => (
    <Frame className="w-full flex-col gap-2.5 p-4">
      {[
        ['maxCrossAxisExtent: 120', 2, '窄屏 → 2 列'],
        ['maxCrossAxisExtent: 60', 4, '宽屏 → 4 列'],
      ].map(([code, n, t]) => (
        <div key={String(t)}>
          <span className="mb-1 block font-mono text-[11px] text-ink-400">
            {code} → {t}
          </span>
          <div
            className="grid w-full gap-1.5"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}
          >
            {Array.from({ length: Number(n) * 2 }).map((_, i) => (
              <div key={i} className="aspect-square rounded bg-brand-100" />
            ))}
          </div>
        </div>
      ))}
    </Frame>
  ),
  'grid-view::放在 Column 里（必须加两行）': () => (
    <Frame className="w-full max-w-[270px] flex-col gap-2 p-4">
      <div className="rounded-lg border border-danger/40 bg-danger/5 p-2">
        <span className="block font-mono text-[11px] text-danger">
          ❌ Column(children: [ GridView(…), ])
        </span>
        <span className="mt-0.5 block text-[11.5px] text-ink-500">
          未指定高度 → 直接渲染报错
        </span>
      </div>
      <div className="rounded-lg border border-ok/40 bg-ok/5 p-2">
        <span className="block font-mono text-[11px] text-ok">
          ✅ shrinkWrap: true + physics: NeverScrollable
        </span>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-brand-100" />
          ))}
        </div>
      </div>
    </Frame>
  ),

  'single-child-scroll-view::表单页面（最常用场景）': () => (
    <Frame className="w-full max-w-[240px]">
      <div className="h-[123px] w-full overflow-y-auto rounded-xl bg-surface p-2.5 shadow-card ring-1 ring-ink-100 thin-scroll">
        {['收货人', '手机号', '所在地区', '详细地址'].map((t) => (
          <div key={t} className="mb-2">
            <span className="mb-0.5 block text-[11px] text-ink-400">{t}</span>
            <div className="h-5 rounded border border-ink-200 bg-ink-50/50" />
          </div>
        ))}
      </div>
    </Frame>
  ),
  'single-child-scroll-view::内容不足一屏也想能下拉（刷新手势）': () => (
    <Frame className="w-full max-w-[240px]">
      <div className="relative h-[123px] w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex h-8 items-center justify-center gap-1.5 text-[11.5px] text-brand-600">
          <Spinner size={12} cls="border-brand-200 border-t-brand-500" />
          下拉刷新中…
        </div>
        <div className="px-2.5">
          <div className="flex h-12 items-center justify-center rounded bg-ink-50 text-[12px] text-ink-400">
            内容很少，但也能下拉
          </div>
        </div>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10.5px] text-ink-400">
          AlwaysScrollableScrollPhysics
        </span>
      </div>
    </Frame>
  ),

  'align::Alignment 的坐标系与常见用法': () => (
    <Frame className="w-full p-4">
      <div className="relative h-[107px] w-full rounded-lg border border-dashed border-brand-300 bg-brand-50/30">
        <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 bg-ink-300" />
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-ink-300" />
        <span className="absolute left-1 top-1 rounded bg-solid px-1.5 py-0.5 text-[10.5px] text-white">
          (-1,-1)
        </span>
        <span className="absolute right-1 top-1 rounded bg-solid px-1.5 py-0.5 text-[10.5px] text-white">
          (1,-1)
        </span>
        <span className="absolute bottom-1 left-1 rounded bg-solid px-1.5 py-0.5 text-[10.5px] text-white">
          (-1,1)
        </span>
        <span className="absolute bottom-1 right-1 rounded bg-solid px-1.5 py-0.5 text-[10.5px] text-white">
          (1,1)
        </span>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-ok px-1.5 py-0.5 text-[10.5px] text-white">
          (0,0)
        </span>
      </div>
      <span className="mt-1.5 block text-center font-mono text-[11px] text-ink-400">
        取值范围 -1 ~ 1
      </span>
      {/* 与代码一一对应：用法 1 —— 160 高的横幅里 Alignment.bottomLeft 放「限时 5 折」 */}
      <div className="relative mt-1 h-[64px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-ink-400 to-ink-600">
        <span className="absolute bottom-2 left-3 text-[15px] font-medium text-white">
          限时 5 折
        </span>
        <span className="absolute right-2 top-1.5 font-mono text-[10px] text-white/70">
          Alignment.bottomLeft
        </span>
      </div>
    </Frame>
  ),

  'positioned::商品图：左上角折扣标 + 底部渐变蒙层': () => (
    <Frame>
      <div className="relative h-[118px] w-[170px] overflow-hidden rounded-xl bg-gradient-to-br from-ink-300 to-ink-500">
        <span className="absolute left-0 top-3 rounded-r-md bg-danger px-1.5 py-0.5 text-[12px] font-medium text-white">
          5 折
        </span>
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 text-[12px] text-white">
          商品标题（底部蒙层）
        </span>
      </div>
    </Frame>
  ),
  'positioned::回到顶部按钮：注意 Stack 的尺寸陷阱': () => (
    <Frame className="w-full max-w-[270px]">
      <div className="relative h-[118px] w-full rounded-xl bg-ink-50 ring-1 ring-ink-100">
        <div className="space-y-1.5 p-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 rounded bg-ink-100" />
          ))}
        </div>
        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-brand-600 shadow-pop ring-1 ring-ink-100">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5m-6 6 6-6 6 6" />
          </svg>
        </span>
        <span className="absolute bottom-2 left-2 text-[11px] text-ink-400">
          offset &gt; 400 才出现 · 隐藏时 IgnorePointer 不吞点击
        </span>
      </div>
    </Frame>
  ),

  'indexed-stack::底部导航 + 状态保持（最常用的组合）': () => <IndexedStackDemo />,
  'indexed-stack::tab 很重时的懒加载包装': () => (
    <Frame className="w-full max-w-[280px] flex-col gap-2 p-4">
      <div className="flex w-full overflow-hidden rounded-lg bg-ink-50 p-1">
        {['首页', '重页面'].map((t, i) => (
          <span
            key={t}
            className={`flex-1 rounded py-1 text-center text-[13px] ${
              i === 1 ? 'bg-surface font-medium text-brand-600 shadow-sm' : 'text-ink-500'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-1.5">
        <div className="rounded border border-dashed border-ink-200 p-1.5 text-center">
          <span className="block text-[11px] text-ink-400">页 1</span>
          <span className="block text-[11.5px] text-ok">已构建</span>
        </div>
        <div className="rounded border border-dashed border-brand-300 bg-brand-50/40 p-1.5 text-center">
          <span className="block text-[11px] text-ink-400">页 2（重）</span>
          <span className="block text-[11.5px] text-brand-600">首次访问才建</span>
        </div>
      </div>
      <span className="font-mono text-[10.5px] text-ink-400">
        建过之后缓存，切回不重建
      </span>
    </Frame>
  ),

  'safe-area::底部操作栏：正确写法': () => (
    <Frame className="w-full max-w-[240px]">
      <div className="relative h-[125px] w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="space-y-2 p-2.5">
          <div className="h-2.5 w-2/3 rounded bg-ink-100" />
          <div className="h-2.5 w-1/2 rounded bg-ink-100" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex gap-1.5 px-2.5 pb-1.5">
            <span className="flex-1 rounded-full border border-ink-300 py-1 text-center text-[12px] text-brand-600">
              取消
            </span>
            <span className="flex-1 rounded-full bg-solid py-1 text-center text-[12px] text-white">
              确认
            </span>
          </div>
          <div className="flex h-5 items-center justify-center bg-danger/10 text-[10.5px] text-danger">
            ↑ SafeArea 避让手势条
          </div>
        </div>
      </div>
    </Frame>
  ),

  /* ═══════════════ 输入 ═══════════════ */

  'text-field::基础：带标签和提示': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2.5 p-4">
      <div>
        <span className="mb-0.5 block text-[12px] text-ink-500">收件人</span>
        <div className="rounded-lg border border-ink-300 bg-surface px-3 py-1.5 text-[14px] text-ink-900">
          曹禹
        </div>
        <span className="mt-0.5 block text-[11.5px] text-ink-400">
          helperText：请与身份证保持一致
        </span>
      </div>
      <div>
        <span className="mb-0.5 block text-[12px] text-ink-500">备注</span>
        <div className="rounded-lg border border-ink-200 bg-surface px-3 py-1.5 text-[14px] text-ink-400">
          选填
        </div>
      </div>
    </Frame>
  ),
  'text-field::密码框': () => (
    <Frame className="w-full max-w-[260px] p-4">
      <div className="w-full rounded-lg border-2 border-brand-500 bg-surface px-3 py-1.5 ring-2 ring-brand-500/15">
        <span className="block text-[11.5px] text-brand-600">密码</span>
        <div className="mt-0.5 flex items-center">
          <span className="text-[15px] tracking-[3px] text-ink-900">••••••••</span>
          <span className="ml-auto text-ink-400">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </span>
        </div>
      </div>
      <span className="mt-1.5 block w-full font-mono text-[11px] text-ink-400">
        obscureText: true + 后缀切换图标
      </span>
    </Frame>
  ),
  'text-field::用 controller 读值 + 释放': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2 p-4">
      <div className="rounded-lg border border-ink-300 bg-surface px-3 py-1.5">
        <span className="text-[14px] text-ink-900">pulse_dev</span>
        <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-brand-500 align-middle" />
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[11px] text-ink-500">
          controller.text
        </span>
        <span className="text-[12px] text-brand-600">→ &quot;pulse_dev&quot;</span>
      </div>
      <span className="rounded bg-danger/10 px-1.5 py-0.5 font-mono text-[11px] text-danger">
        dispose() 里必须 controller.dispose()
      </span>
    </Frame>
  ),
  'text-field::只允许输入数字 + 限长': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2 p-4">
      <div className="rounded-lg border border-ink-300 bg-surface px-3 py-1.5">
        <div className="flex items-center">
          <span className="font-mono text-[14.5px] tracking-wide text-ink-900">13800138000</span>
          <span className="ml-auto font-mono text-[11.5px] text-ink-400">11/11</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['keyboardType: number', 'maxLength: 11', 'inputFormatters'].map((t) => (
          <span key={t} className="rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] text-brand-600">
            {t}
          </span>
        ))}
      </div>
    </Frame>
  ),
  'text-field::错误提示': () => (
    <Frame className="w-full max-w-[260px] p-4">
      <div className="w-full">
        <span className="mb-0.5 block text-[12px] text-danger">手机号</span>
        <div className="rounded-lg border-2 border-danger bg-surface px-3 py-1.5 text-[14px] text-ink-900">
          abc123
        </div>
        <span className="mt-0.5 block text-[12px] text-danger">
          errorText：只能输入 11 位数字
        </span>
      </div>
    </Frame>
  ),

  'text-form-field::完整登录表单': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2 p-4">
      {[
        ['邮箱', 'dev@pulseshop.cn'],
        ['密码', '••••••••'],
      ].map(([l, v]) => (
        <div key={l}>
          <span className="mb-0.5 block text-[12px] text-ink-500">{l}</span>
          <div className="rounded-lg border border-ink-300 bg-surface px-3 py-1.5 text-[14px] text-ink-900">
            {v}
          </div>
        </div>
      ))}
      <span className="mt-0.5 rounded-full bg-solid py-1.5 text-center text-[14px] font-medium text-white">
        登录
      </span>
    </Frame>
  ),
  'text-form-field::异步校验（比如「手机号是否已注册」）': () => (
    <Frame className="w-full max-w-[260px] p-4">
      <div className="w-full">
        <span className="mb-0.5 block text-[12px] text-ink-500">手机号</span>
        <div className="flex items-center gap-2 rounded-lg border-2 border-brand-500 bg-surface px-3 py-1.5">
          <span className="text-[14px] text-ink-900">13800138000</span>
          <span className="ml-auto">
            <Spinner size={13} cls="border-brand-200 border-t-brand-500" />
          </span>
        </div>
        <span className="mt-0.5 block text-[12px] text-brand-600">正在校验是否已注册…</span>
      </div>
    </Frame>
  ),

  'form::Form 的三个核心动作': () => (
    <Frame className="w-full max-w-[270px] flex-col gap-2 p-4">
      {[
        ['validate()', '校验全部字段', 'bg-ok/15 text-ok'],
        ['save()', '把值写回各字段', 'bg-brand-50 text-brand-600'],
        ['reset()', '清空并回到初始值', 'bg-warn/15 text-warn'],
      ].map(([code, t, cls]) => (
        <div key={code} className="flex items-center gap-2 rounded-lg bg-surface px-2.5 py-1.5 shadow-card ring-1 ring-ink-100">
          <span className={`rounded px-1.5 py-0.5 font-mono text-[11.5px] ${cls}`}>{code}</span>
          <span className="text-[13px] text-ink-700">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'form::提交时先校验、提交中禁用按钮': () => (
    <Frame className="w-full max-w-[260px] flex-col items-stretch gap-2 p-4">
      <div className="rounded-lg border-2 border-danger bg-surface px-3 py-1.5 text-[14px] text-ink-900">
        abc
      </div>
      <span className="text-[11.5px] text-danger">手机号格式不正确</span>
      <span className="flex items-center justify-center gap-2 rounded-full bg-solid/45 py-1.5 text-[14px] font-medium text-white">
        <Spinner size={13} />
        提交中…
      </span>
      <span className="font-mono text-[10.5px] text-ink-400">
        _submitting ? null : _submit
      </span>
    </Frame>
  ),

  'checkbox::带文字的复选框：用 CheckboxListTile': () => (
    // 与代码一一对应：CheckboxListTile「我已阅读并同意《用户协议》」（框在左）+ 未勾选时禁用的「注册」
    <Frame className="w-full max-w-[270px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface p-3 shadow-card ring-1 ring-ink-100">
        <div className="flex items-center gap-3">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-solid text-white">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="text-[14px] text-ink-800">
            我已阅读并同意<span className="text-brand-600">《用户协议》</span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex h-9 flex-1 items-center justify-center rounded-[18px] bg-solid text-[14px] font-medium text-white">
            注册
          </span>
        </div>
        <span className="mt-1.5 block text-center text-[11px] text-ink-400">
          不勾选时「注册」是灰的（onPressed: null）
        </span>
      </div>
    </Frame>
  ),
  'checkbox::全选 / 半选（tristate 的经典用法）': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="w-full rounded-xl bg-surface p-3 shadow-card ring-1 ring-ink-100">
        <div className="flex items-center gap-2.5 border-b border-ink-100 pb-2">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-brand-500">
            <span className="h-0.5 w-2.5 rounded bg-surface" />
          </span>
          <span className="text-[14px] font-medium text-ink-900">全选</span>
          <span className="ml-auto text-[11.5px] text-ink-400">已选 2/4</span>
        </div>
        <div className="mt-2 space-y-2">
          {[
            ['手机', true],
            ['电脑', true],
            ['平板', false],
            ['耳机', false],
          ].map(([t, on]) => (
            <div key={String(t)} className="flex items-center gap-2.5">
              <span
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] ${
                  on ? 'bg-solid text-white' : 'border-2 border-ink-300'
                }`}
              >
                {on ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                ) : null}
              </span>
              <span className="text-[13.5px] text-ink-700">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  ),

  'switch::设置页标准写法': () => (
    <Frame className="w-full max-w-[280px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        {[
          ['消息推送', true],
          ['深色模式', false],
        ].map(([t, on], i) => (
          <div key={String(t)}>
            {i > 0 && <div className="ml-3 h-px bg-ink-100" />}
            <div className="flex items-center px-3.5 py-2.5">
              <span className="text-[14px] text-ink-800">{t}</span>
              <span className="ml-auto">
                <SwitchI init={Boolean(on)} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  'switch::切换时发请求（注意别卡住 UI）': () => (
    <Frame className="w-full max-w-[280px] flex-col items-stretch gap-2.5 p-4">
      <div className="flex items-center rounded-lg bg-surface px-3.5 py-2.5 shadow-card ring-1 ring-ink-100">
        <span className="text-[14px] text-ink-800">同步到云端</span>
        <span className="ml-auto flex items-center gap-2">
          <Spinner size={13} cls="border-brand-200 border-t-brand-500" />
          <span className="relative flex h-[22px] w-[40px] items-center rounded-full bg-brand-500/50 px-0.5">
            <span className="ml-auto h-[18px] w-[18px] rounded-full bg-surface shadow" />
          </span>
        </span>
      </div>
      <span className="text-[11px] leading-snug text-ink-400">
        乐观更新：先切 UI，等请求；失败再回滚，别把整个页面卡住
      </span>
    </Frame>
  ),

  'slider::价格区间选择': () => (
    <Frame className="w-full max-w-[250px] flex-col items-stretch gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-ink-400">价格区间</span>
        <span className="text-[14px] font-medium text-brand-600">¥250 - ¥750</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-ink-100">
        <span className="absolute left-[25%] right-[25%] top-0 h-full rounded-full bg-brand-500" />
        <span className="absolute left-[25%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 ring-2 ring-surface" />
        <span className="absolute left-[75%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 ring-2 ring-surface" />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-ink-400">
        <span>0</span>
        <span>500</span>
        <span>1000</span>
      </div>
    </Frame>
  ),
  'slider::数值范围超出滑块时的处理': () => (
    <Frame className="w-full max-w-[250px] flex-col items-stretch gap-3 p-4">
      <div>
        <span className="mb-1 block font-mono text-[11px] text-danger">
          ❌ value=120 但 max=100 → 抛异常
        </span>
        <div className="relative h-1.5 rounded-full bg-danger/20">
          <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-danger ring-2 ring-surface" />
        </div>
      </div>
      <div>
        <span className="mb-1 block font-mono text-[11px] text-ok">
          ✅ value.clamp(0, max)
        </span>
        <div className="relative h-1.5 rounded-full bg-ink-100">
          <span className="absolute left-0 right-0 top-0 h-full rounded-full bg-brand-500" />
          <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-brand-500 ring-2 ring-surface" />
        </div>
      </div>
    </Frame>
  ),

  'search-bar::基础搜索栏': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="flex h-10 w-full items-center gap-2 rounded-full bg-ink-50 px-3.5 ring-1 ring-ink-200">
        <MI d={P.search} size={16} className="shrink-0 text-ink-400" />
        <span className="text-[14px] text-ink-400">搜索商品…</span>
      </div>
    </Frame>
  ),
  'search-bar::带搜索建议（SearchAnchor）': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="w-full">
        <div className="flex h-10 w-full items-center gap-2 rounded-t-full bg-surface px-3.5 ring-1 ring-brand-300">
          <MI d={P.search} size={16} className="shrink-0 text-brand-600" />
          <span className="text-[14px] text-ink-900">无线</span>
          <span className="ml-auto h-3.5 w-px bg-ink-300" />
        </div>
        <div className="overflow-hidden rounded-b-lg bg-surface shadow-pop ring-1 ring-ink-100">
          {['无线耳机', '无线充电器', '无线鼠标'].map((t, i) => (
            <div
              key={t}
              className={`flex items-center gap-2 px-3 py-1.5 text-[13px] ${
                i === 0 ? 'bg-brand-50 text-brand-600' : 'text-ink-700'
              }`}
            >
              <MI d={P.search} size={11} className="text-ink-400" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  ),

  'dropdown-button::基础下拉（注意 isExpanded）': () => (
    <Frame className="w-full max-w-[220px] p-4">
      <div className="w-full">
        <div className="flex h-10 w-full items-center justify-between rounded-lg border border-ink-300 px-3 text-[14px] text-ink-900">
          广东省
          <svg viewBox="0 0 24 24" width="16" height="16" className="text-ink-400" fill="currentColor">
            <path d="M12 15.5 5.5 9h13L12 15.5Z" />
          </svg>
        </div>
        <div className="mt-1 overflow-hidden rounded-lg bg-surface shadow-pop ring-1 ring-ink-100">
          {['广东省', '湖南省', '浙江省'].map((t, i) => (
            <div
              key={t}
              className={`px-3 py-1.5 text-[13px] ${i === 0 ? 'bg-brand-50 text-brand-600' : 'text-ink-700'}`}
            >
              {t}
            </div>
          ))}
        </div>
        <span className="mt-1 block text-[11px] text-warn">
          不加 isExpanded，按钮会缩成「广」
        </span>
      </div>
    </Frame>
  ),
  'dropdown-button::带 null 选项（允许「不限」）': () => (
    <Frame className="w-full max-w-[220px] p-4">
      <div className="w-full">
        <div className="flex h-10 w-full items-center justify-between rounded-lg border border-ink-300 bg-surface px-3 text-[14px] text-ink-400">
          不限
          <svg viewBox="0 0 24 24" width="16" height="16" className="text-ink-400" fill="currentColor">
            <path d="M12 15.5 5.5 9h13L12 15.5Z" />
          </svg>
        </div>
        <div className="mt-1 overflow-hidden rounded-lg bg-surface shadow-pop ring-1 ring-ink-100">
          <div className="px-3 py-1.5 text-[13px] text-ink-400">不限（value: null）</div>
          {['广东省', '湖南省'].map((t) => (
            <div key={t} className="px-3 py-1.5 text-[13px] text-ink-700">
              {t}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  ),

  /* ═══════════════ 选择 ═══════════════ */

  'radio::一组单选（用 RadioListTile，整行可点）': () => (
    // 与代码一一对应：三个 RadioListTile（微信支付 / 支付宝 / 银行卡），_pay 默认 'wechat'
    <Frame className="w-full max-w-[280px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        {[
          ['微信支付', true, 'M4 8h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4-3 1.5-2h5L16 5'],
          ['支付宝', false, 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 5h5m-5 3h8'],
          ['银行卡', false, 'M3 7h18v10H3V7Zm0 4h18'],
        ].map(([t, on, d], i) => (
          <div key={String(t)}>
            {i > 0 && <div className="ml-3 h-px bg-ink-100" />}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                  on ? 'border-brand-500' : 'border-ink-300'
                }`}
              >
                {on ? <span className="h-2 w-2 rounded-full bg-brand-500" /> : null}
              </span>
              <span className="text-[14px] text-ink-800">{t}</span>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-auto text-ink-400"
              >
                <path d={String(d)} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  'radio::选项少的时候用 Chip 更省空间': () => (
    // 与代码一一对应：Wrap + ChoiceChip('S'|'M'|'L'|'XL')，_size 默认 'M'
    <Frame className="flex-wrap gap-2">
      {['S', 'M', 'L', 'XL'].map((s) => {
        const on = s === 'M';
        return (
          <span
            key={s}
            className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-1.5 text-[14px] ${
              on
                ? 'bg-solid font-medium text-white'
                : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200'
            }`}
          >
            {on ? (
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            ) : null}
            {s}
          </span>
        );
      })}
    </Frame>
  ),

  'chip::四个变体对照': () => (
    // 与代码一一对应：① Chip（数码 / 新品 / 已选条件+删除） ② FilterChip（包邮，选中）
    // ③ ChoiceChip（M，选中） ④ ActionChip（下载）
    <Frame className="w-full max-w-[340px] flex-wrap gap-2 p-4">
      {/* ① 纯展示 */}
      <span className="inline-flex items-center rounded-lg bg-surface px-3 py-1.5 text-[13px] text-ink-700 ring-1 ring-ink-300">
        数码
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[13px] text-ink-700 ring-1 ring-ink-300">
        <span className="opacity-70">#</span>新品
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[13px] text-ink-700 ring-1 ring-ink-300">
        已选条件
        <span className="opacity-60">×</span>
      </span>
      {/* ② 筛选（可多选，selected: true） */}
      <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-[13px] text-brand-700 ring-1 ring-brand-300">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        包邮
      </span>
      {/* ③ 单选（selected: true） */}
      <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-[13px] text-brand-700 ring-1 ring-brand-300">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        M
      </span>
      {/* ④ 触发动作 */}
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-[13px] text-ink-600 ring-1 ring-ink-200">
        <span className="opacity-70">⬇</span>下载
      </span>
    </Frame>
  ),
  'chip::状态标签（订单状态这类）': () => (
    // 与代码一一对应：statusChip('已完成')(绿) / statusChip('进行中')(蓝) / statusChip('已取消')(灰)
    <Frame className="w-full max-w-[280px] flex-wrap gap-2 p-4">
      <span className="rounded bg-[#e8f5e9] px-2.5 py-1 text-[12.5px] font-medium text-[#2e7d32]">
        已完成
      </span>
      <span className="rounded bg-[#e3f2fd] px-2.5 py-1 text-[12.5px] font-medium text-[#1565c0]">
        进行中
      </span>
      <span className="rounded bg-ink-100 px-2.5 py-1 text-[12.5px] font-medium text-ink-500">
        已取消
      </span>
      <span className="w-full font-mono text-[10.5px] text-ink-400">
        兜底分支 → 橙色（未知状态）
      </span>
    </Frame>
  ),

  'filter-chip::多条件筛选（带「重置」）': () => (
    // 与代码一一对应：_options 前 4 项；_selected = {包邮, 现货}；提示「已选：包邮 · 现货」
    <Frame className="w-full max-w-[300px] flex-col gap-2 p-4">
      <div className="flex flex-wrap gap-1.5">
        {['包邮', '现货'].map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-lg bg-solid px-2.5 py-1 text-[13px] text-white">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
            {t}
          </span>
        ))}
        {['7天退换', '品牌店', '分期免息'].map((t) => (
          <span key={t} className="rounded-lg bg-ink-50 px-2.5 py-1 text-[13px] text-ink-600 ring-1 ring-ink-200">
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center border-t border-ink-100 pt-2">
        <span className="text-[12px] text-ink-400">已选：包邮 · 现货</span>
        <span className="ml-auto rounded border border-ink-200 px-2 py-0.5 text-[12px] text-ink-600">
          重置
        </span>
      </div>
    </Frame>
  ),

  'segmented-button::视图切换（列表 / 网格）': () => (
    // 与代码一一对应：_view = 'list' → 列表段选中；图标 view_list / grid_view；showSelectedIcon: false
    <Frame className="flex-col gap-3 p-4">
      <div className="flex overflow-hidden rounded-full border border-ink-300">
        <span className="flex h-9 items-center gap-1.5 bg-brand-50 px-4 text-[14px] font-medium text-brand-600">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
          列表
        </span>
        <span className="flex h-9 items-center gap-1.5 border-l border-ink-300 px-4 text-[14px] text-ink-600">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="7" height="7" rx="1" />
            <rect x="13" y="4" width="7" height="7" rx="1" />
            <rect x="4" y="13" width="7" height="7" rx="1" />
            <rect x="13" y="13" width="7" height="7" rx="1" />
          </svg>
          网格
        </span>
      </div>
      <span className="font-mono text-[11px] text-ink-400">selected: &#123;list&#125;</span>
    </Frame>
  ),
  'segmented-button::时间范围（多选）': () => (
    // 与代码一一对应：三段 周一/周三/周五；multiSelectionEnabled；默认勾选 周一 + 周五
    <Frame className="flex-col gap-3 p-4">
      <div className="flex overflow-hidden rounded-full border border-ink-300">
        {[
          ['周一', 'mon', true],
          ['周三', 'wed', false],
          ['周五', 'fri', true],
        ].map(([t, v, on], i) => (
          <span
            key={String(v)}
            className={`flex h-9 items-center gap-1 px-4 text-[14px] ${
              i > 0 ? 'border-l border-ink-300' : ''
            } ${
              on
                ? 'bg-brand-50 font-medium text-brand-600'
                : 'text-ink-600'
            }`}
          >
            {on ? (
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            ) : null}
            {t}
          </span>
        ))}
      </div>
      <span className="font-mono text-[11px] text-ink-400">
        multiSelectionEnabled · selected: &#123;mon, fri&#125;
      </span>
    </Frame>
  ),

  /* ═══════════════ 数据展示 ═══════════════ */

  'list-view::基础用法：为什么必须用 .builder': () => (
    <Frame className="w-full max-w-[410px] gap-3 p-4">
      <div className="flex-1">
        <span className="mb-1 block text-[11px] text-danger">❌ children 一次建完</span>
        <div className="h-[97px] overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-ink-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-ink-50 px-2.5 py-1.5 text-[12.5px] text-ink-700">
              项 {i}
            </div>
          ))}
          <div className="bg-danger/10 px-2.5 py-1 text-[11px] text-danger">+997 全都建好了</div>
        </div>
      </div>
      <div className="flex-1">
        <span className="mb-1 block text-[11px] text-ok">✅ .builder 按需构建</span>
        <div className="h-[97px] overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-ink-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-ink-50 px-2.5 py-1.5 text-[12.5px] text-ink-700">
              项 {i}
            </div>
          ))}
          <div className="bg-ok/10 px-2.5 py-1 text-[11px] text-ok">只建可视区</div>
        </div>
      </div>
    </Frame>
  ),
  'list-view::带分隔线与自定义内边距': () => (
    // 与代码一一对应：separatorBuilder 是 Divider(height: 1, indent: 72) —— 缩进 72 正好让过 leading 头像
    <Frame className="w-full max-w-[270px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface py-1 shadow-card ring-1 ring-ink-100">
        {[
          ['收货地址', '广东省深圳市'],
          ['支付方式', '微信支付'],
          ['发票信息', '电子发票'],
        ].map(([a, b], i) => (
          <div key={a}>
            {i > 0 && <div className="ml-[72px] h-px bg-ink-200" />}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] text-brand-700">
                {a[0]}
              </span>
              <span className="text-[14px] text-ink-800">{a}</span>
              <span className="ml-auto text-[13px] text-ink-500">{b}</span>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  'list-view::触底加载下一页': () => (
    <Frame className="w-full max-w-[270px]">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        {[1, 2].map((i) => (
          <div key={i} className="border-b border-ink-50 px-3 py-2 text-[13px] text-ink-700">
            列表项 {i}
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 py-2.5">
          <Spinner size={13} cls="border-brand-200 border-t-brand-500" />
          <span className="text-[12px] text-brand-600">加载更多…</span>
        </div>
      </div>
    </Frame>
  ),

  'list-tile::三种典型版式': () => (
    <Frame className="w-full max-w-[300px] flex-col items-stretch gap-1.5 p-4">
      {[
        ['单行', ['曹禹']],
        ['两行', ['曹禹', '最近消息：明天见']],
        ['三行', ['曹禹', '最近消息：明天见', '昨天 22:10']],
      ].map(([t, lines]) => (
        <div key={String(t)} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 shadow-card ring-1 ring-ink-100">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[13px] font-semibold text-brand-700">
            曹
          </span>
          <span className="min-w-0 flex-1">
            {(lines as string[]).map((line, li) => (
              <span
                key={line}
                className={`block truncate ${
                  li === 0 ? 'text-[13.5px] text-ink-900' : 'text-[12px] text-ink-500'
                }`}
              >
                {line}
              </span>
            ))}
          </span>
          <span className="shrink-0 rounded bg-ink-50 px-1.5 py-0.5 text-[10.5px] text-ink-400">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'list-tile::dense 让密集列表更好看': () => (
    <Frame className="w-full max-w-[410px] gap-3 p-4">
      <div className="flex-1">
        <span className="mb-1 block font-mono text-[11px] text-ink-400">默认</span>
        <div className="overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-ink-100">
          {['项 A', '项 B', '项 C'].map((t) => (
            <div key={t} className="flex items-center gap-2.5 border-b border-ink-50 px-3 py-2.5">
              <span className="h-7 w-7 shrink-0 rounded-full bg-brand-100" />
              <span className="text-[13px] text-ink-800">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <span className="mb-1 block font-mono text-[11px] text-ok">dense: true</span>
        <div className="overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-ink-100">
          {['项 A', '项 B', '项 C', '项 D'].map((t) => (
            <div key={t} className="flex items-center gap-2.5 border-b border-ink-50 px-3 py-1.5">
              <span className="h-5 w-5 shrink-0 rounded-full bg-brand-100" />
              <span className="text-[12.5px] text-ink-800">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  ),

  'image::网络图完整写法（含加载中与失败）': () => (
    <Frame className="gap-5">
      {[
        ['加载中', 'spinner'],
        ['加载失败', 'error'],
      ].map(([t, kind]) => (
        <div key={t} className="flex flex-col items-center gap-1.5">
          <div className="flex h-[86px] w-[96px] items-center justify-center overflow-hidden rounded-lg bg-ink-50 ring-1 ring-ink-200">
            {kind === 'spinner' ? (
              <Spinner size={20} cls="border-brand-200 border-t-brand-500" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <svg viewBox="0 0 24 24" width="20" height="20" className="text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 3l18 18M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10" />
                </svg>
                <span className="font-mono text-[10.5px] text-ink-400">errorBuilder</span>
              </div>
            )}
          </div>
          <span className="text-[12px] text-ink-400">{t}</span>
        </div>
      ))}
    </Frame>
  ),
  'image::占位图 + 淡入，避免「图片突然弹出来」': () => (
    <Frame className="gap-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-[86px] w-[96px] rounded-lg bg-ink-100" />
        <span className="text-[11.5px] text-ink-400">占位灰块</span>
      </div>
      <span className="text-ink-400">→</span>
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-[86px] w-[96px] rounded-lg bg-gradient-to-br from-brand-200 to-brand-400 opacity-70" />
        <span className="font-mono text-[11px] text-brand-600">FadeInImage</span>
      </div>
    </Frame>
  ),

  'circle-avatar::网络头像 + 首字母兜底 + 未读红点': () => (
    <Frame className="gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-[17px] font-semibold text-brand-700">
          曹
        </span>
        <span className="text-[11.5px] text-ink-400">首字母兜底</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-[17px] font-semibold text-brand-800">
            L
          </span>
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[11px] font-medium text-white ring-2 ring-surface">
            5
          </span>
        </span>
        <span className="text-[11.5px] text-ink-400">未读红点</span>
      </div>
    </Frame>
  ),

  'badge::底栏未读 + 图标未读': () => (
    <Frame className="w-full max-w-[310px]">
      <div className="flex w-full items-center justify-around rounded-xl bg-brand-50 px-2 py-2">
        {[
          { d: P.home, t: '首页', n: '', dot: false },
          { d: P.notif, t: '消息', n: '99+', dot: false },
          { d: P.cart, t: '购物车', n: '', dot: true },
          { d: P.person, t: '我的', n: '', dot: false },
        ].map((it) => (
          <div key={it.t} className="flex flex-col items-center gap-0.5">
            <span className="relative flex h-7 w-14 items-center justify-center">
              <MI d={it.d} size={18} className="text-ink-500" />
              {it.n ? (
                <span className="absolute right-2.5 top-0 flex h-4 min-w-[17px] items-center justify-center rounded-full bg-danger px-1 text-[11px] font-medium text-white">
                  {it.n}
                </span>
              ) : null}
              {it.dot ? (
                <span className="absolute right-4 top-0.5 h-2 w-2 rounded-full bg-danger" />
              ) : null}
            </span>
            <span className="text-[11.5px] text-ink-500">{it.t}</span>
          </div>
        ))}
      </div>
    </Frame>
  ),

  'data-table::可排序的销售明细表': () => (
    <Frame className="w-full max-w-[320px] p-4">
      <div className="w-full overflow-hidden rounded-lg bg-surface text-left text-[12px] shadow-card ring-1 ring-ink-100">
        <div className="flex bg-ink-50 text-ink-600">
          {/* 与代码一一对应：_sortIndex = 2（销售额）、_ascending = false → 箭头在销售额且向下 */}
          <span className="flex flex-1 items-center px-2 py-1.5 font-medium">产品</span>
          <span className="w-14 px-2 py-1.5 font-medium">区域</span>
          <span className="flex w-20 items-center justify-end gap-1 px-2 py-1.5 font-medium">
            销售额
            <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor" className="text-brand-600">
              <path d="M12 15.5 5.5 9h13L12 15.5Z" />
            </svg>
          </span>
        </div>
        {[
          ['云服务器', '华南', '¥12,800'],
          ['CDN', '华东', '¥5,320'],
          ['对象存储', '华北', '¥2,140'],
        ].map(([a, b, c], i) => (
          <div key={a} className={`flex border-t border-ink-100 ${i % 2 ? 'bg-ink-50/40' : ''}`}>
            <span className="flex-1 px-2 py-1.5 text-ink-800">{a}</span>
            <span className="w-14 px-2 py-1.5 text-ink-600">{b}</span>
            <span className="w-20 px-2 py-1.5 text-right tabular-nums text-ink-800">{c}</span>
          </div>
        ))}
      </div>
    </Frame>
  ),

  'expansion-tile::手风琴：同时只展开一个': () => (
    <Frame className="w-full max-w-[280px] flex-col items-stretch gap-1.5 p-4">
      <ExpansionI init q="如何申请退款？" a="展开后，其他项会自动收起 —— 这就是手风琴。" />
      <ExpansionI q="发票怎么开？" a="下单时填写抬头。" />
      <ExpansionI q="多久能到？" a="视地区而定。" />
    </Frame>
  ),

  'skeleton::闪烁骨架块 + 列表骨架': () => (
    <Frame className="w-full max-w-[290px] flex-col items-stretch gap-2.5 p-4">
      <div className="space-y-1.5">
        <span className="block h-2.5 w-full animate-pulse rounded bg-ink-100" />
        <span className="block h-2.5 w-4/5 animate-pulse rounded bg-ink-100" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-ink-100" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-2.5 w-2/3 animate-pulse rounded bg-ink-100" />
          <span className="block h-2.5 w-1/2 animate-pulse rounded bg-ink-100" />
        </span>
      </div>
    </Frame>
  ),

  'stepper::下单流程 + 中文按钮 + 分步校验': () => (
    <Frame className="w-full max-w-[280px] flex-col gap-3 p-4">
      {/* 与代码一一对应：steps 收货信息/配送方式/确认支付；末步按钮变「提交订单」 */}
      <StepsRow steps={['收货信息', '配送方式', '确认支付']} cur={1} />
      <div className="flex gap-1.5">
        <span className="flex-1 rounded-full border border-ink-300 py-1 text-center text-[12px] text-ink-600">
          上一步
        </span>
        <span className="flex-[2] rounded-full bg-solid py-1 text-center text-[12px] text-white">
          下一步（末步 → 提交订单）
        </span>
      </div>
      <span className="font-mono text-[10.5px] text-ink-400">
        每步都先校验再放行
      </span>
    </Frame>
  ),

  /* ═══════════════ 反馈 ═══════════════ */

  'snack-bar::基础用法与两种行为': () => (
    <Frame className="w-full max-w-[300px] flex-col gap-2 p-4">
      <div className="flex w-full items-center rounded-lg bg-[#2c3038] px-3.5 py-2.5 shadow-pop">
        <span className="text-[13px] text-white">
          SnackBarBehavior.floating（浮起）
        </span>
      </div>
      <div className="flex w-full items-center rounded-lg bg-[#2c3038] px-3.5 py-2.5">
        <span className="text-[13px] text-white">
          SnackBarBehavior.fixed（贴底）
        </span>
      </div>
    </Frame>
  ),
  'snack-bar::带「撤销」的操作（最典型的用法）': () => (
    <Frame className="w-full max-w-[300px] p-4">
      {/* 与代码一一对应：content「已删除」+ action「撤销」，点撤销后 5 秒内可恢复 */}
      <SnackBarI label="已删除" />
    </Frame>
  ),
  'snack-bar::成功 / 失败用不同颜色': () => (
    // 与代码一一对应：showToast(context, '保存成功') 深色底 / showToast(..., error: true) 用 scheme.error
    <Frame className="w-full max-w-[300px] flex-col gap-2 p-4">
      <div className="flex w-full items-center rounded-lg bg-[#2c3038] px-3.5 py-2.5 shadow-pop">
        <span className="text-[13px] text-white">保存成功</span>
        <span className="ml-auto font-mono text-[10px] text-white/50">Color(0xff2c3038)</span>
      </div>
      <div className="flex w-full items-center rounded-lg bg-danger px-3.5 py-2.5 shadow-pop">
        <span className="text-[13px] text-white">网络异常，请重试</span>
        <span className="ml-auto font-mono text-[10px] text-white/60">scheme.error</span>
      </div>
    </Frame>
  ),
  'snack-bar::连续弹提示时先清掉上一个': () => (
    <Frame className="w-full max-w-[300px] flex-col gap-2 p-4">
      <div className="relative h-16">
        <div className="absolute inset-x-0 top-0 flex items-center rounded-lg bg-[#2c3038]/40 px-3.5 py-2.5">
          <span className="text-[13px] text-white/60">上一条（即将消失）</span>
        </div>
        <div className="absolute inset-x-0 top-8 flex items-center rounded-lg bg-[#2c3038] px-3.5 py-2.5 shadow-pop">
          <span className="text-[13px] text-white">最新一条</span>
          <span className="ml-auto text-[13px] text-brand-400">撤销</span>
        </div>
      </div>
      <span className="font-mono text-[10.5px] text-ink-400">
        hideCurrentSnackBar() 之后再 show
      </span>
    </Frame>
  ),

  'alert-dialog::确认对话框（标准写法）': () => (
    <Frame className="w-full max-w-[270px] p-4">
      {/* 与代码一一对应：title / content 原文 */}
      <DialogI
        title="删除这条记录？"
        body="删除后无法恢复，该记录的所有附件也会一并删除。"
        okLabel="删除"
        okDanger
      />
    </Frame>
  ),
  'alert-dialog::对话框里带输入框': () => (
    <Frame className="w-full max-w-[270px] p-4">
      {/* 与代码一一对应：标题「新建文件夹」、hint「请输入名称」、按钮 取消 / 创建 */}
      <DialogI title="新建文件夹" body="" okLabel="创建" withInput placeholder="请输入名称" />
    </Frame>
  ),
  'alert-dialog::用 SafeArea 包一下（小屏 / 横屏会溢出）': () => (
    // 与代码一一对应：title「很长的一段说明」+ content 是 SingleChildScrollView（内容可滚）
    <Frame className="w-full max-w-[270px] p-4">
      <div className="relative w-full rounded-xl bg-ink-100 p-3">
        <span className="absolute -top-1.5 left-2 rounded bg-danger px-1 py-0.5 text-[10px] text-white">
          ⚠ 横屏高度不足
        </span>
        <div className="mt-1 rounded-lg bg-surface p-3 shadow-pop">
          <p className="text-[14.5px] font-semibold text-ink-900">很长的一段说明</p>
          <div className="mt-1 space-y-1">
            <p className="text-[12.5px] text-ink-600">说明文字第 1 行…</p>
            <p className="text-[12.5px] text-ink-600">说明文字第 2 行…</p>
            <p className="text-[12.5px] text-ink-400">↓ 再往下就要滚动了（SingleChildScrollView）</p>
          </div>
          <div className="mt-2.5 flex justify-end gap-1.5">
            <span className="px-2.5 py-1 text-[13px] text-brand-600">取消</span>
            <span className="px-2.5 py-1 text-[13px] text-brand-600">同意</span>
          </div>
        </div>
        <span className="mt-1.5 block text-center font-mono text-[10.5px] text-ok">
          SafeArea 包住对话框
        </span>
      </div>
    </Frame>
  ),

  'dialog::带输入框的自定义弹窗（含键盘避让）': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="w-full">
        <div className="rounded-xl bg-surface p-3.5 shadow-pop">
          <p className="text-[15px] font-semibold text-ink-900">添加备注</p>
          <div className="mt-2 rounded-lg border-2 border-brand-500 px-2.5 py-1.5 ring-2 ring-brand-500/15">
            <span className="text-[13.5px] text-ink-900">尽快发货</span>
            <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-brand-500 align-middle" />
          </div>
          <div className="mt-2 rounded-lg bg-ink-200/70 p-1">
            <div className="grid grid-cols-6 gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-3 rounded bg-ink-200" />
              ))}
            </div>
          </div>
        </div>
        <span className="mt-1.5 block text-center font-mono text-[10.5px] text-ink-400">
          viewInsets.bottom 把弹窗顶上去
        </span>
      </div>
    </Frame>
  ),

  'circular-progress-indicator::两种模式': () => (
    <Frame className="gap-7">
      <div className="flex flex-col items-center gap-1.5">
        <Spinner size={28} cls="border-brand-100 border-t-brand-500" />
        <span className="text-[11.5px] text-ink-400">不确定（转圈）</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {/* 与代码一一对应：value: 0.65、strokeWidth: 6、backgroundColor: grey.shade200 */}
        <span className="relative flex h-11 w-11 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-ink-100" strokeWidth="6" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="stroke-solid"
              strokeWidth="6"
              strokeDasharray="94.2"
              strokeDashoffset="33"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10.5px] font-medium text-ink-600">65%</span>
        </span>
        <span className="text-[11.5px] text-ink-400">确定（value: 0.65）</span>
      </div>
    </Frame>
  ),
  'circular-progress-indicator::延迟显示：解决「闪一下」的问题': () => (
    <Frame className="w-full max-w-[290px] flex-col gap-3 p-4">
      <div>
        <span className="mb-1 block text-[11px] text-danger">❌ 立即显示 loading</span>
        <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/5 px-2.5 py-1.5">
          <Spinner size={14} cls="border-brand-100 border-t-brand-500" />
          <span className="text-[11.5px] text-ink-500">
            80ms 就返回 → 用户看到&ldquo;闪一下&rdquo;
          </span>
        </div>
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-ok">✅ 延迟 300ms 再显示</span>
        <div className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/5 px-2.5 py-1.5">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="stroke-ok" strokeWidth="2.6" strokeLinecap="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          <span className="text-[11.5px] text-ink-500">80ms 内返回 → 全程不显示</span>
        </div>
      </div>
    </Frame>
  ),
  'circular-progress-indicator::按钮里的加载态': () => (
    <Frame className="gap-3 p-4">
      <span className="inline-flex h-9 items-center rounded-[18px] bg-solid px-4 text-[14px] font-medium text-white">
        提交
      </span>
      <span className="inline-flex h-9 min-w-[96px] items-center justify-center gap-2 rounded-[18px] bg-solid/45 px-4 text-[14px] font-medium text-white">
        <Spinner size={14} />
        提交中
      </span>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-solid/45 text-white">
        <Spinner size={14} />
      </span>
    </Frame>
  ),

  'linear-progress-indicator::页面顶部的加载条': () => (
    <Frame className="w-full max-w-[290px] p-4">
      <div className="w-full overflow-hidden rounded-lg bg-surface shadow-card ring-1 ring-ink-100">
        <div className="h-[3px] w-full bg-brand-100">
          <div className="h-full w-2/3 bg-brand-500" />
        </div>
        <div className="space-y-1.5 p-2.5">
          <div className="h-2.5 w-3/4 rounded bg-ink-100" />
          <div className="h-2.5 w-1/2 rounded bg-ink-100" />
        </div>
      </div>
      <span className="mt-1.5 block text-center font-mono text-[10.5px] text-ink-400">
        页面加载时置顶，不占布局
      </span>
    </Frame>
  ),
  'linear-progress-indicator::带百分比的确定进度': () => (
    <Frame className="w-full max-w-[280px] flex-col gap-2 p-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
        <div className="h-full w-[68%] rounded-full bg-brand-500" />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-ink-500">正在下载资源包</span>
        <span className="font-mono text-[13px] font-medium text-brand-600">68%</span>
      </div>
      <span className="font-mono text-[11px] text-ink-400">value: 0.68</span>
    </Frame>
  ),

  'tooltip::基础用法': () => (
    <Frame className="w-full max-w-[270px] flex-col items-center gap-2 p-4">
      <span className="relative">
        <span className="rounded-md bg-[#2c3038] px-2.5 py-1 text-[13px] text-white shadow-pop">
          分享给好友
        </span>
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-[#2c3038]" />
      </span>
      <span className="mt-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-600 ring-1 ring-ink-200">
        <MI d={P.share} size={19} />
      </span>
      <span className="text-[11px] text-ink-400">长按 / 悬停触发</span>
    </Frame>
  ),
  'tooltip::自定义外观': () => (
    <Frame className="w-full max-w-[290px] flex-col items-center gap-2 p-4">
      <span className="relative rounded-lg bg-solid px-3 py-1.5 text-[13px] text-white shadow-pop">
        自定义气泡
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-brand-500" />
      </span>
      <span className="mt-2 text-[12.5px] text-ink-600">悬停目标</span>
      <span className="font-mono text-[10.5px] text-ink-400">
        decoration / textStyle / waitDuration
      </span>
    </Frame>
  ),

  'refresh-indicator::列表下拉刷新': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex items-center justify-center gap-2 py-3">
          <Spinner size={15} cls="border-brand-200 border-t-brand-500" />
          <span className="text-[12px] text-brand-600">正在刷新…</span>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="border-t border-ink-50 px-3 py-2 text-[13px] text-ink-700">
            列表项 {i}
          </div>
        ))}
      </div>
    </Frame>
  ),
  'refresh-indicator::下拉刷新 + 上拉加载更多': () => (
    <Frame className="w-full max-w-[270px] p-4">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex items-center justify-center gap-1.5 border-b border-ink-50 py-2 text-[11.5px] text-ok">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          刷新完成
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="border-b border-ink-50 px-3 py-2 text-[13px] text-ink-700">
            列表项 {i}
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 py-2.5">
          <Spinner size={13} cls="border-brand-200 border-t-brand-500" />
          <span className="text-[11.5px] text-brand-600">上拉加载更多…</span>
        </div>
      </div>
    </Frame>
  ),

  'bottom-sheet::选择器（最典型用法）': () => (
    <Frame className="w-full max-w-[280px] p-4">
      <SheetI items={['拍照上传', '从相册选择', '取消']} />
    </Frame>
  ),
  'bottom-sheet::内容较多：可拖拽调整高度': () => (
    <Frame className="w-full max-w-[280px] p-4">
      <div className="relative h-[116px] w-full overflow-hidden rounded-t-2xl bg-surface shadow-pop ring-1 ring-ink-100">
        <div className="flex justify-center pt-2">
          <span className="h-1 w-9 rounded-full bg-ink-300" />
        </div>
        <div className="mt-2 space-y-1.5 px-3">
          {['选项一', '选项二', '选项三'].map((t) => (
            <div key={t} className="rounded-lg bg-ink-50 px-2.5 py-1.5 text-[13px] text-ink-700">
              {t}
            </div>
          ))}
          <div className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-[13px] text-brand-700 opacity-50">
            选项四（再拖才可见）
          </div>
        </div>
        <span className="absolute bottom-1 right-2 font-mono text-[10.5px] text-ink-400">
          DraggableScrollableSheet
        </span>
      </div>
    </Frame>
  ),

  'banner::离线横幅：只显示一条 + 恢复后自动关闭': () => (
    <Frame className="w-full max-w-[320px] flex-col gap-2 p-4">
      <div className="flex w-full items-center gap-2 rounded-lg bg-warn/10 px-3 py-2 ring-1 ring-warn/40">
        <MI d={P.notif} size={15} className="shrink-0 text-warn" />
        <span className="text-[13px] text-ink-700">当前离线（只显示这一条）</span>
        <span className="ml-auto text-[12.5px] font-medium text-warn">详情</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-ok/10 px-3 py-2 ring-1 ring-ok/40">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" className="stroke-ok" strokeWidth="2.6" strokeLinecap="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        <span className="text-[12.5px] text-ink-600">已恢复连接 → 自动关闭</span>
      </div>
    </Frame>
  ),

  /* ═══════════════ 导航 ═══════════════ */

  'app-bar::标准顶栏': () => (
    <Frame className="w-full max-w-[330px] p-4">
      <div className="flex h-12 w-full items-center gap-1 rounded-xl bg-solid px-1.5 text-white">
        <IconBtn className="text-white">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </IconBtn>
        <span className="text-[15px] font-medium">商品详情</span>
        <span className="ml-auto flex items-center">
          <IconBtn className="text-white">
            <MI d={P.share} size={18} />
          </IconBtn>
          <IconBtn className="text-white">
            <MI d={P.cart} size={18} />
          </IconBtn>
        </span>
      </div>
    </Frame>
  ),
  'app-bar::标题 + 副标题（两行）': () => (
    <Frame className="w-full max-w-[330px] p-4">
      <div className="flex h-14 w-full items-center gap-1.5 rounded-xl bg-solid px-1.5 text-white">
        <IconBtn className="text-white">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </IconBtn>
        <span className="flex flex-col leading-tight">
          <span className="text-[14.5px] font-medium">订单详情</span>
          <span className="text-[11.5px] text-white/70">#20261015</span>
        </span>
      </div>
    </Frame>
  ),
  'app-bar::搜索框直接放在顶栏里': () => (
    <Frame className="w-full max-w-[330px] p-4">
      <div className="flex h-14 w-full items-center gap-2 rounded-xl bg-brand-500 px-2.5">
        <span className="flex h-8 flex-1 items-center gap-1.5 rounded-full bg-surface/95 px-3">
          <MI d={P.search} size={14} className="text-ink-400" />
          <span className="text-[13px] text-ink-400">搜索商品</span>
        </span>
        <MI d={P.person} size={19} className="shrink-0 text-white" />
      </div>
    </Frame>
  ),

  'navigation-bar::用 IndexedStack 保住各页状态': () => (
    <Frame className="w-full max-w-[310px] p-4">
      <div className="w-full rounded-xl bg-brand-50 p-2">
        <div className="mb-2 flex h-9 items-center justify-center rounded-lg bg-surface text-[12.5px] text-ink-600 shadow-sm">
          各页状态被保留（滚动位置 / 输入内容）
        </div>
        <NavBarGBlock />
      </div>
    </Frame>
  ),
  'navigation-bar::带未读角标': () => (
    <Frame className="w-full max-w-[310px] p-4">
      <div className="flex w-full items-center justify-around rounded-xl bg-brand-50 px-2 py-2">
        {[
          { d: P.home, t: '首页', on: true, badge: false },
          { d: P.cart, t: '购物车', on: false, badge: false },
          { d: P.notif, t: '消息', on: false, badge: true },
          { d: P.person, t: '我的', on: false, badge: false },
        ].map((it) => (
          <div key={it.t} className="flex flex-col items-center gap-0.5">
            <span
              className={`relative flex h-7 w-14 items-center justify-center rounded-full ${
                it.on ? 'bg-brand-100' : ''
              }`}
            >
              <MI d={it.d} size={18} className={it.on ? 'text-brand-700' : 'text-ink-500'} />
              {it.badge ? (
                <span className="absolute right-3 top-0 h-2 w-2 rounded-full bg-danger ring-2 ring-brand-50" />
              ) : null}
            </span>
            <span className={`text-[11.5px] ${it.on ? 'font-medium text-brand-700' : 'text-ink-500'}`}>
              {it.t}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  ),

  'tab-bar::顶栏 + 标签页（最标准形态）': () => (
    <Frame className="w-full max-w-[330px] p-4">
      <div className="w-full overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex h-10 items-center bg-solid px-3 text-[14.5px] font-medium text-white">
          我的订单
        </div>
        <div className="px-3 pt-1">
          <div className="w-full border-b border-ink-100">
            <div className="flex">
              {['全部', '待付款', '待发货'].map((t, i) => (
                <span
                  key={t}
                  className={`relative flex-1 pb-2 pt-1 text-center text-[14px] ${
                    i === 0 ? 'font-medium text-brand-600' : 'text-ink-500'
                  }`}
                >
                  {t}
                  {i === 0 ? (
                    <span className="absolute inset-x-4 -bottom-px h-[2.5px] rounded-full bg-brand-500" />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-3 text-[12.5px] text-ink-400">标签页内容区</div>
      </div>
    </Frame>
  ),
  'tab-bar::标签多到放不下：isScrollable': () => (
    <Frame className="w-full max-w-[310px] p-4">
      <div className="w-full overflow-hidden rounded-xl bg-surface p-3 shadow-card ring-1 ring-ink-100">
        <div className="flex gap-3 overflow-x-auto border-b border-ink-100 pb-2 thin-scroll">
          {['推荐', '数码', '服饰', '生鲜', '美妆', '家居'].map((t, i) => (
            <span
              key={t}
              className={`relative shrink-0 text-[13.5px] ${
                i === 0 ? 'font-medium text-brand-600' : 'text-ink-500'
              }`}
            >
              {t}
              {i === 0 ? (
                <span className="absolute -bottom-2 left-1/2 h-[2.5px] w-4 -translate-x-1/2 rounded-full bg-brand-500" />
              ) : null}
            </span>
          ))}
        </div>
        <span className="mt-2 block font-mono text-[10.5px] text-ink-400">
          isScrollable: true → 可横向滚动
        </span>
      </div>
    </Frame>
  ),

  'drawer::标准侧边菜单': () => (
    <Frame className="w-full max-w-[310px] p-4">
      <div className="flex h-[130px] w-full overflow-hidden rounded-xl shadow-card ring-1 ring-ink-100">
        <div className="w-[62%] bg-surface">
          <div className="bg-brand-500 px-3 pb-2.5 pt-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/25 text-[13.5px] font-semibold text-white">
              曹
            </span>
            <p className="mt-1.5 text-[13.5px] font-medium text-white">曹禹</p>
            <p className="font-mono text-[10.5px] text-white/70">dev@pulseshop.cn</p>
          </div>
          <div className="py-1">
            {['我的订单', '收货地址', '设置'].map((t, i) => (
              <div
                key={t}
                className={`flex items-center gap-2 px-3 py-1.5 text-[12.5px] ${
                  i === 0 ? 'bg-brand-50 font-medium text-brand-600' : 'text-ink-700'
                }`}
              >
                <span className="h-3 w-3 rounded-sm bg-current opacity-40" />
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-scrim/40" />
      </div>
    </Frame>
  ),

  'bottom-navigation-bar::基础用法（注意 type）': () => (
    <Frame className="w-full max-w-[330px] flex-col gap-3 p-4">
      <div>
        <span className="mb-1 block text-[11px] text-ok">3 个：默认即可</span>
        <ClassicBar items={['首页', '购物车', '我的']} />
      </div>
      <div>
        <span className="mb-1 block text-[11px] text-danger">
          4 个及以上：必须 type: fixed，否则白字白底
        </span>
        <ClassicBar items={['首页', '分类', '购物车', '我的']} />
      </div>
    </Frame>
  ),

  /* ═══════════════ 其他 ═══════════════ */

  'scaffold::标准页面模板（照抄就能用）': () => (
    // 与代码一一对应：AppBar('商品详情') + 分享按钮 / body / bottomNavigationBar 双按钮
    <Frame className="p-4">
      <div className="w-[200px] overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-ink-100">
        <div className="flex h-8 items-center bg-solid px-2.5 text-[12px] text-white">
          <span className="flex-1 text-center">商品详情</span>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12M8 7l4-4 4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
          </svg>
        </div>
        <div className="flex h-[72px] items-center justify-center bg-ink-50 text-[12px] text-ink-400">
          body · 商品内容
        </div>
        <div className="flex gap-2 border-t border-ink-100 p-2">
          <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-brand-500 text-[12.5px] font-medium text-brand-600">
            加入购物车
          </span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-lg bg-solid text-[12.5px] font-medium text-white">
            立即购买
          </span>
        </div>
      </div>
    </Frame>
  ),
  'scaffold::SnackBar 为什么有时"看不见"': () => (
    // 与代码一一对应：❌ push 之后立刻弹（被 B 页盖住） / ✅ await 回到 A 再弹
    <Frame className="w-full max-w-[300px] flex-col gap-2 p-4">
      <div className="rounded-lg border border-danger/40 bg-danger/5 p-2.5">
        <span className="block text-[12px] font-medium text-danger">
          ❌ push(B) 之后立刻弹 → 被 B 页盖住
        </span>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] text-ink-500">A 页面</span>
          <span className="text-[11px] text-ink-400">→</span>
          <span className="rounded bg-solid px-1.5 py-0.5 text-[11px] text-white">B 页面</span>
          <span className="ml-auto rounded bg-[#2c3038] px-1.5 py-0.5 text-[10.5px] text-white/50">
            操作成功（被盖住）
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-ok/40 bg-ok/5 p-2.5">
        <span className="block text-[12px] font-medium text-ok">
          ✅ await push 回到 A 之后再弹
        </span>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded bg-solid px-1.5 py-0.5 text-[11px] text-white">A 页面</span>
          <span className="ml-auto rounded bg-[#2c3038] px-1.5 py-0.5 text-[10.5px] text-white">
            保存成功
          </span>
        </div>
      </div>
    </Frame>
  ),
  'scaffold::每个页面包一层 ScaffoldMessenger 隔离提示': () => (
    <Frame className="w-full max-w-[290px] flex-col gap-2 p-4">
      {[
        ['页面 A', true],
        ['页面 B', false],
      ].map(([t, on]) => (
        <div key={String(t)} className="rounded-lg bg-surface p-2 shadow-card ring-1 ring-ink-100">
          <span className="block text-[12px] text-ink-700">{t}</span>
          <div
            className={`mt-1.5 flex items-center rounded px-2 py-1 text-[11.5px] ${
              on ? 'bg-[#2c3038] text-white' : 'bg-ink-100 text-ink-400'
            }`}
          >
            {on ? 'SnackBar 只在自己页面显示' : '不受影响'}
          </div>
        </div>
      ))}
    </Frame>
  ),

  'theme::两个页面之间切换明暗主题': () => (
    <Frame className="gap-3 p-4">
      <div className="flex-1 overflow-hidden rounded-xl bg-surface p-3 shadow-card ring-1 ring-ink-100">
        <span className="block text-[12.5px] font-medium text-ink-900">浅色</span>
        <div className="mt-1.5 h-2 w-3/4 rounded bg-ink-100" />
        <div className="mt-1 h-2 w-1/2 rounded bg-ink-100" />
        <div className="mt-2 inline-block rounded-full bg-solid px-2 py-0.5 text-[11px] text-white">
          按钮
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-xl bg-[#1f2328] p-3">
        <span className="block text-[12.5px] font-medium text-white">深色</span>
        <div className="mt-1.5 h-2 w-3/4 rounded bg-surface/15" />
        <div className="mt-1 h-2 w-1/2 rounded bg-surface/15" />
        <div className="mt-2 inline-block rounded-full bg-brand-400 px-2 py-0.5 text-[11px] text-[#0d1b2a]">
          按钮
        </div>
      </div>
    </Frame>
  ),
  'theme::业务代码里正确取颜色': () => (
    // 与代码一一对应：✅ 从 colorScheme 取（随主题变） / ❌ 写死 Color(0xFF...)
    <Frame className="w-full max-w-[310px] flex-col gap-2 p-4">
      <div className="rounded-lg border border-ok/40 bg-ok/5 p-2.5">
        <span className="block font-mono text-[11px] text-ok">
          ✅ Theme.of(context).colorScheme.primary —— 跟着主题走
        </span>
        <div className="mt-1.5 flex gap-1.5">
          <span className="h-6 flex-1 rounded bg-solid" />
          <span className="h-6 flex-1 rounded bg-brand-400" />
          <span className="h-6 flex-1 rounded bg-brand-100" />
        </div>
      </div>
      <div className="rounded-lg border border-danger/40 bg-danger/5 p-2.5">
        <span className="block font-mono text-[11px] text-danger">
          ❌ Color(0xFF409EFF) 写死
        </span>
        <span className="mt-1 block text-[11.5px] text-ink-500">换主题时不会跟着变</span>
      </div>
    </Frame>
  ),
  'theme::中文字体：在一处指定，全局生效': () => (
    <Frame className="w-full max-w-[310px] p-4">
      <div className="w-full rounded-lg bg-surface p-2.5 shadow-card ring-1 ring-ink-100">
        <span className="block font-mono text-[11px] text-ink-400">
          ThemeData(fontFamily: …)
        </span>
        <span className="mt-1.5 block text-[15px] text-ink-900">
          中文标题字重正常 · 不再是日文字形
        </span>
        <span className="mt-0.5 block text-[13px] text-ink-600">正文中文示例</span>
      </div>
      <span className="mt-1.5 block font-mono text-[10.5px] text-ink-400">
        一处配置，全站生效
      </span>
    </Frame>
  ),

  'media-query::断点布局 + 安全区 + 大字号兜底': () => (
    <Frame className="w-full max-w-[410px] gap-2.5 p-4">
      {[
        ['< 600', 1, '手机', 'ring-1 ring-ink-100'],
        ['600-900', 2, '平板', 'ring-2 ring-brand-300'],
        ['> 900', 3, '桌面', 'ring-1 ring-ink-100'],
      ].map(([w, n, t, ring]) => (
        <div key={String(w)} className={`flex-1 rounded-lg bg-surface p-2.5 shadow-card ${ring}`}>
          <span className="block font-mono text-[10.5px] text-ink-400">{w}</span>
          <span className="mt-0.5 block text-[13px] font-medium text-ink-800">{t}</span>
          <div
            className="mt-1.5 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}
          >
            {Array.from({ length: Number(n) }).map((_, i) => (
              <span key={i} className="h-4 rounded bg-brand-100" />
            ))}
          </div>
        </div>
      ))}
    </Frame>
  ),
};

/** indexed-stack 用的导航块（可点） */
function NavBarGBlock() {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex w-full items-center justify-around rounded-xl bg-brand-100 px-2 py-2">
      {[
        { d: P.home, t: '首页' },
        { d: P.cart, t: '购物车' },
        { d: P.person, t: '我的' },
      ].map((it, i) => (
        <button
          key={it.t}
          type="button"
          onClick={() => setSel(i)}
          className="flex flex-col items-center gap-0.5"
        >
          <span
            className={`flex h-7 w-14 items-center justify-center rounded-full ${
              sel === i ? 'bg-brand-100' : ''
            }`}
          >
            <MI d={it.d} size={18} className={sel === i ? 'text-brand-700' : 'text-ink-500'} />
          </span>
          <span className={`text-[11.5px] ${sel === i ? 'font-medium text-brand-700' : 'text-ink-500'}`}>
            {it.t}
          </span>
        </button>
      ))}
    </div>
  );
}

/** BottomNavigationBar（3 个 / 4 个对照用） */
function ClassicBar({ items }: { items: string[] }) {
  const [sel, setSel] = useState(0);
  const icons = [P.home, P.inbox, P.cart, P.person];
  return (
    <div className="flex w-full items-stretch rounded-xl bg-surface px-1 py-1 shadow-card ring-1 ring-ink-100">
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setSel(i)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-1 ${
            sel === i ? 'text-brand-600' : 'text-ink-400'
          }`}
        >
          <MI d={icons[i]} size={18} />
          <span className="text-[11.5px]">{t}</span>
        </button>
      ))}
    </div>
  );
}

export function getDemoMock(slug: string, title: string): ReactNode | undefined {
  const fn = demoMocks[`${slug}::${title}`];
  return fn ? fn() : undefined;
}
