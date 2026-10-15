'use client';

import { useState } from 'react';
import CodeBlock from './CodeBlock';

/**
 * 首页的「代码 → 真实渲染」对照演示
 *
 * 这里不引 Flutter，而是用 HTML/CSS 一比一手工复刻 Flutter 的渲染结果。
 * 这么做是有意的：如果首页需要加载 Flutter Web 运行时才算「能看」，
 * 首屏会变成十几 MB，SEO 也拿不到内容。
 *
 * 复刻的忠实度按 Material 3 的默认规格来：
 *   FilledButton 高 40、内边距水平 24、圆角 20（药丸形）、主色 #409EFF
 *   Card 圆角 12、elevation 1 的阴影
 *   列表项高 72（双行）、左图标 24、右箭头 24
 */
type Sample = {
  id: string;
  label: string;
  code: string;
  render: React.ReactNode;
  /** 这个示例想让你注意什么 */
  point: string;
};

/* ── 复刻用的小零件 ─────────────────────────────────────── */

function M3Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-xl bg-white p-[1px] shadow-[0_1px_3px_rgba(0,0,0,.10),0_1px_2px_rgba(0,0,0,.06)]">
      <div className="p-4">{children}</div>
    </div>
  );
}

function M3PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center justify-center rounded-[20px] bg-brand-500 px-6 text-[14px] font-medium tracking-[.01em] text-white">
      {children}
    </span>
  );
}

function M3OutlinedButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center justify-center rounded-[20px] border border-ink-300 px-6 text-[14px] font-medium text-brand-600">
      {children}
    </span>
  );
}

/** 打开新窗口图标（Material 的 chevron_right） */
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 三个示例 ───────────────────────────────────────────── */

const SAMPLES: Sample[] = [
  {
    id: 'row',
    label: 'Row 两端对齐',
    point: '末尾那个 Spacer 把右侧内容顶到底 —— 这是「两端对齐」最稳的写法，比 spaceBetween 更可控。',
    code: `Row(
  children: [
    const Icon(Icons.location_on_outlined, size: 20),
    const SizedBox(width: 8),
    const Text('广州市天河区体育西路 1 号'),
    const Spacer(),
    TextButton(
      onPressed: copyAddress,
      child: const Text('复制'),
    ),
  ],
)`,
    render: (
      <div className="w-full max-w-[380px]">
        <M3Card>
          <div className="flex items-center">
            {/* material icon: location_on_outlined */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-700" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="ml-2 truncate text-[14px] text-ink-900">
              广州市天河区体育西路 1 号
            </span>
            <span className="ml-auto shrink-0 pl-2 text-[13px] font-medium text-brand-600">
              复制
            </span>
          </div>
        </M3Card>
        <p className="mt-2 text-center text-[10.5px] text-ink-400">
          ↑ 右侧「复制」被顶到最右边，靠的就是 Spacer
        </p>
      </div>
    ),
  },
  {
    id: 'column',
    label: 'Column 居中失效',
    point: 'mainAxisAlignment: center 没生效，是因为 Column 默认 mainAxisSize 是 max —— 它占满父级高度，「居中」等于没居中。加 MainAxisSize.min 才好。',
    code: `// ❌ 看起来对，其实没居中
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [Text('空状态'), Icon(Icons.inbox_outlined)],
)

// ✅ 改这一行就对了
Column(
  mainAxisSize: MainAxisSize.min,   // ← 关键
  mainAxisAlignment: MainAxisAlignment.center,
  children: [Text('空状态'), Icon(Icons.inbox_outlined)],
)`,
    render: (
      <div className="flex w-full max-w-[380px] gap-3">
        <div className="flex-1">
          <div className="flex h-[168px] flex-col rounded-lg border border-dashed border-danger/40 bg-danger/5 p-2">
            <div className="flex flex-1 flex-col items-start justify-center">
              <span className="text-[11px] text-ink-500">空状态</span>
              <svg viewBox="0 0 24 24" className="mt-1 h-6 w-6 text-ink-300" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 12h4l2 3h6l2-3h4" />
                <path d="M5 5h14l2 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5L5 5Z" />
              </svg>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10.5px] font-medium text-danger">
            ❌ 内容挤在上面
          </p>
        </div>
        <div className="flex-1">
          <div className="flex h-[168px] flex-col items-center justify-center rounded-lg border border-dashed border-ok/40 bg-ok/5 p-2">
            <span className="text-[11px] text-ink-500">空状态</span>
            <svg viewBox="0 0 24 24" className="mt-1 h-6 w-6 text-ink-300" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 12h4l2 3h6l2-3h4" />
              <path d="M5 5h14l2 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5L5 5Z" />
            </svg>
          </div>
          <p className="mt-1.5 text-center text-[10.5px] font-medium text-ok">
            ✅ 真正垂直居中
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'card',
    label: 'Card + 按钮组合',
    point: 'FilledButton 用于主操作、OutlinedButton 用于次要操作。一个界面里主按钮通常只留一个，用户才知道该点哪。',
    code: `Card(
  margin: const EdgeInsets.all(12),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('订单已提交', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        Text('预计 3 个工作日内发货', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
        const SizedBox(height: 16),
        Row(
          children: [
            FilledButton(onPressed: viewOrder, child: const Text('查看订单')),
            const SizedBox(width: 12),
            OutlinedButton(onPressed: contact, child: const Text('联系客服')),
          ],
        ),
      ],
    ),
  ),
)`,
    render: (
      <div className="w-full max-w-[380px]">
        <M3Card>
          <p className="text-[16px] font-semibold text-ink-900">订单已提交</p>
          <p className="mt-1.5 text-[13px] text-ink-600">预计 3 个工作日内发货</p>
          <div className="mt-4 flex items-center gap-3">
            <M3PrimaryButton>查看订单</M3PrimaryButton>
            <M3OutlinedButton>联系客服</M3OutlinedButton>
          </div>
        </M3Card>
      </div>
    ),
  },
];

/* ── 主体 ───────────────────────────────────────────────── */

export default function DemoShowcase() {
  const [active, setActive] = useState(0);
  const s = SAMPLES[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-pop">
      {/* tab 栏 */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-ink-100 bg-ink-50/60 px-2 thin-scroll">
        {SAMPLES.map((sample, i) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setActive(i)}
            className={`relative shrink-0 px-3.5 py-3 text-[12.5px] font-medium transition ${
              i === active ? 'text-brand-600' : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {sample.label}
            {i === active && (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t-full bg-brand-500" />
            )}
          </button>
        ))}
        <span className="ml-auto shrink-0 pr-2 text-[10.5px] text-ink-400">
          代码与渲染结果对照
        </span>
      </div>

      {/* 左右分栏 */}
      <div className="grid lg:grid-cols-2">
        {/* 左：代码 */}
        <div className="border-b border-ink-100 p-3 lg:border-b-0 lg:border-r">
          <CodeBlock code={s.code} lang="dart" maxHeight={330} />
        </div>

        {/* 右：渲染 */}
        <div className="flex flex-col justify-center gap-3 bg-ink-50/40 p-5">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">
            实际渲染效果
          </span>
          <div className="flex justify-center">{s.render}</div>
        </div>
      </div>

      {/* 讲解 */}
      <div className="flex items-start gap-2.5 border-t border-ink-100 bg-brand-50/50 px-4 py-3">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-5M12 8h.01" strokeLinecap="round" />
        </svg>
        <p className="text-[12.5px] leading-relaxed text-ink-700">
          <strong className="font-semibold text-ink-900">这里要注意：</strong>
          {s.point}
        </p>
      </div>
    </div>
  );
}
