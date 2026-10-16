'use client';

import { useState, type ReactNode } from 'react';

/**
 * mock 复用原语
 *
 * mocks.tsx（组件默认外观）与 demo-mocks.tsx（示例级外观）共用这一套零件，
 * 保证两处的视觉语言完全一致。
 */

/* material 风格小图标（简化 path，仅示意） */
export function MI({
  d,
  size = 20,
  className = '',
}: {
  d: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export const P = {
  home: 'M4 11.5 12 4l8 7.5M6 10v9h12v-9',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5.5 12.5L21 21',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.5 3-6 7-6s7 2.5 7 6',
  cart: 'M4 5h2l2.2 10h9.6L20 8H7M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  star: 'M12 3.5 14.7 9l6 .9-4.3 4.2 1 6-5.4-2.8L6.6 20l1-6L3.3 10l6-.9L12 3.5Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  chevR: 'm9 6 6 6-6 6',
  chevD: 'M12 15.5 5.5 9h13L12 15.5Z',
  fav: 'M12 20s-7-4.5-7-9.5C5 7 7 5 9.5 5c1.4 0 2.1.6 2.5 1.2C12.4 5.6 13.1 5 14.5 5 17 5 19 7 19 10.5 19 15.5 12 20 12 20Z',
  notif: 'M6 16v-5a6 6 0 1 1 12 0v5l1.5 2.5H4.5L6 16ZM10 21a2 2 0 0 0 4 0',
  inbox: 'M4 13h4l2 3h4l2-3h4M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2-8Z',
  del: 'M5 7h14M9 7V5h6v2m-8 0 1 13h8l1-13',
  share: 'M6 12v7h12v-7M12 3v11M8 7l4-4 4 4',
};

export function MockFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[107px] select-none items-center justify-center overflow-hidden p-4 ${className}`}
    >
      {children}
    </div>
  );
}

/** 点按涟漪 */
export function useRipple() {
  const [ripples, setRipples] = useState<number[]>([]);
  const add = () => {
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, id]);
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 500);
  };
  const node = ripples.map((id) => (
    <span
      key={id}
      className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-[ripple_.5s_ease-out] rounded-full bg-white/40"
    />
  ));
  return { add, node };
}

/** M3 按钮（可按压 + 涟漪） */
export function Btn({
  children,
  kind = 'filled',
  icon,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  kind?: 'filled' | 'elevated' | 'outlined' | 'text' | 'tonal';
  icon?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const { add, node } = useRipple();
  const base =
    'relative inline-flex h-9 select-none items-center justify-center gap-1.5 overflow-hidden rounded-[18px] px-4 text-[15px] font-medium transition active:scale-95';
  const styles = {
    filled: danger ? 'bg-danger text-white' : 'bg-brand-500 text-white',
    elevated: 'bg-[#e8f1fd] text-brand-600 shadow-sm',
    outlined: 'border border-ink-300 text-brand-600',
    text: danger ? 'text-danger px-3' : 'text-brand-600 px-3',
    tonal: 'bg-[#dceafb] text-[#1e4e84]',
  } as const;
  return (
    <button
      type="button"
      onClick={() => {
        add();
        onClick?.();
      }}
      className={`${base} ${styles[kind]}`}
    >
      {node}
      {icon && <span className="text-[16px] leading-none">{icon}</span>}
      {children}
    </button>
  );
}

export function IconBtn({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition active:scale-90 active:bg-ink-100 ${className}`}
    >
      {children}
    </button>
  );
}

/** 开关 */
export function SwitchI({ init = false, label }: { init?: boolean; label?: string }) {
  const [on, setOn] = useState(init);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className="flex items-center gap-2 text-[14.5px] text-ink-700"
    >
      <span
        className={`relative flex h-[22px] w-[40px] items-center rounded-full px-0.5 transition-colors ${
          on ? 'bg-brand-500' : 'bg-ink-200'
        }`}
      >
        <span
          className={`h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-[18px]' : ''
          }`}
        />
      </span>
      {label && <span className={on ? 'text-ink-700' : 'text-ink-500'}>{label}</span>}
    </button>
  );
}

/** 复选框 */
export function CheckI({ init = false, label }: { init?: boolean; label?: string }) {
  const [on, setOn] = useState(init);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className="flex items-center gap-2 text-[14.5px]"
    >
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] transition ${
          on ? 'bg-brand-500 text-white' : 'border-2 border-ink-300'
        }`}
      >
        {on && (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        )}
      </span>
      <span className={on ? 'text-ink-700' : 'text-ink-500'}>{label}</span>
    </button>
  );
}

/** 单选组 */
export function RadioG({ options, init = 0 }: { options: string[]; init?: number }) {
  const [sel, setSel] = useState(init);
  return (
    <div className="flex gap-4">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => setSel(i)}
          className="flex items-center gap-2 text-[14.5px]"
        >
          <span
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition ${
              sel === i ? 'border-brand-500' : 'border-ink-300'
            }`}
          >
            {sel === i && <span className="h-2 w-2 rounded-full bg-brand-500" />}
          </span>
          <span className={sel === i ? 'text-ink-700' : 'text-ink-500'}>{o}</span>
        </button>
      ))}
    </div>
  );
}

/** 滑块（真·input range） */
export function SliderI({ init = 60 }: { init?: number }) {
  const [v, setV] = useState(init);
  return (
    <div className="flex w-full flex-col items-stretch gap-1">
      <div className="relative h-1.5 rounded-full bg-ink-100">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-brand-500 transition-[width]"
          style={{ width: `${v}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 ring-2 ring-white"
          style={{ left: `${v}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="absolute inset-x-0 -top-2 h-6 w-full cursor-pointer opacity-0"
        />
      </div>
      <span className="text-right font-mono text-[12.5px] text-ink-400">value: {v}</span>
    </div>
  );
}

/** 可点 chips（单选高亮） */
export function WrapChips({ items }: { items: string[] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setSel(i)}
          className={`rounded-full px-2.5 py-1 text-[13.5px] transition active:scale-95 ${
            sel === i
              ? 'bg-brand-500 text-white'
              : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200 hover:bg-brand-50'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** chip（可切换选中） */
export function ChipToggle({ items }: { items: string[] }) {
  const [sel, setSel] = useState<boolean[]>(items.map((_, i) => i === 0));
  return (
    <div className="flex gap-2">
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setSel((s) => s.map((v, j) => (j === i ? !v : v)))}
          className={`rounded-lg px-3 py-1.5 text-[14.5px] transition active:scale-95 ${
            sel[i]
              ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-300'
              : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200'
          }`}
        >
          {t}
          {sel[i] ? ' ✓' : ' ×'}
        </button>
      ))}
    </div>
  );
}

/** filter chips（多选） */
export function FilterChips({ items }: { items: string[] }) {
  const [sel, setSel] = useState<boolean[]>(items.map((_, i) => i === 0));
  return (
    <div className="flex gap-2">
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setSel((s) => s.map((v, j) => (j === i ? !v : v)))}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[14.5px] transition active:scale-95 ${
            sel[i] ? 'bg-brand-500 text-white' : 'bg-ink-50 text-ink-600 ring-1 ring-ink-200'
          }`}
        >
          {sel[i] && (
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          )}
          {t}
        </button>
      ))}
    </div>
  );
}

/** 分段控件 */
export function SegmentedG({ items, init = 0 }: { items: string[]; init?: number }) {
  const [sel, setSel] = useState(init);
  return (
    <div className="flex overflow-hidden rounded-full border border-ink-300">
      {items.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setSel(i)}
          className={`flex h-9 items-center gap-1 px-4 text-[14.5px] transition ${
            i > 0 ? 'border-l border-ink-300' : ''
          } ${sel === i ? 'bg-brand-50 font-medium text-brand-600' : 'text-ink-600 hover:bg-ink-50'}`}
        >
          {sel === i && (
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          )}
          {t}
        </button>
      ))}
    </div>
  );
}

/** TabBar（可切换） */
export function TabsG({ items }: { items: string[] }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="w-full border-b border-ink-100">
      <div className="flex">
        {items.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setSel(i)}
            className={`relative flex-1 pb-2 pt-1 text-center text-[15px] transition ${
              sel === i ? 'font-medium text-brand-600' : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {t}
            {sel === i && (
              <span className="absolute inset-x-4 -bottom-px h-[2.5px] rounded-full bg-brand-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** NavigationBar / BottomNavigationBar（可切换） */
export function NavBarG({
  items,
  variant = 'm3',
}: {
  items: { d: string; t: string; badge?: boolean }[];
  variant?: 'm3' | 'classic';
}) {
  const [sel, setSel] = useState(0);
  if (variant === 'classic') {
    return (
      <div className="flex w-full items-stretch rounded-xl bg-white px-1 py-1 shadow-card ring-1 ring-ink-100">
        {items.map((it, i) => (
          <button
            key={it.t}
            type="button"
            onClick={() => setSel(i)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1 transition active:scale-95 ${
              sel === i ? 'text-brand-600' : 'text-ink-400'
            }`}
          >
            <MI d={it.d} size={19} />
            <span className="text-[12px]">{it.t}</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-around rounded-2xl bg-[#eef4fc] px-2 py-2">
      {items.map((it, i) => (
        <button
          key={it.t}
          type="button"
          onClick={() => setSel(i)}
          className="flex flex-col items-center gap-0.5"
        >
          <span
            className={`relative flex h-7 w-14 items-center justify-center rounded-full transition ${
              sel === i ? 'bg-[#d3e5fa]' : ''
            }`}
          >
            <MI d={it.d} size={18} className={sel === i ? 'text-brand-700' : 'text-ink-500'} />
            {it.badge && sel !== i && (
              <span className="absolute right-3 top-0 h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </span>
          <span className={`text-[12px] ${sel === i ? 'font-medium text-brand-700' : 'text-ink-500'}`}>
            {it.t}
          </span>
        </button>
      ))}
    </div>
  );
}

/** 可展开的列表项 */
export function ExpansionI({ q, a, init = false }: { q: string; a: string; init?: boolean }) {
  const [open, setOpen] = useState(init);
  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-card ring-1 ring-ink-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-[14.5px] text-ink-800"
      >
        {q}
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
        >
          <path d="M12 15.5 5.5 9h13L12 15.5Z" />
        </svg>
      </button>
      {open && a && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">{a}</p>}
    </div>
  );
}

/** 下拉选择 */
export function DropdownI({ items, init = 0 }: { items: string[]; init?: number }) {
  const [open, setOpen] = useState(true);
  const [sel, setSel] = useState(init);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-ink-300 px-3 text-[15px] text-ink-900"
      >
        {items[sel]}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className={`text-ink-400 transition-transform ${open ? '' : 'rotate-180'}`}
          fill="currentColor"
        >
          <path d="M12 15.5 5.5 9h13L12 15.5Z" />
        </svg>
      </button>
      {open && (
        <div className="mt-1 overflow-hidden rounded-lg bg-white shadow-pop ring-1 ring-ink-100">
          {items.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setSel(i);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-[14.5px] ${
                i === sel ? 'bg-brand-50 text-brand-600' : 'text-ink-700 hover:bg-ink-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** 步骤条（可点切换） */
export function StepperI({ steps }: { steps: string[] }) {
  const [cur, setCur] = useState(1);
  return (
    <div className="flex w-full items-start">
      {steps.map((t, i) => {
        const done = i < cur;
        const active = i === cur;
        return (
          <button
            key={t}
            type="button"
            onClick={() => setCur(i)}
            className="flex flex-1 flex-col items-center"
          >
            <div className="flex w-full items-center">
              <span
                className={`h-px flex-1 ${
                  i === 0 ? 'bg-transparent' : done || active ? 'bg-brand-500' : 'bg-ink-200'
                }`}
              />
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] transition ${
                  done
                    ? 'bg-brand-500 text-white'
                    : active
                      ? 'border-2 border-brand-500 bg-white text-brand-600'
                      : 'border-2 border-ink-300 bg-white text-ink-400'
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
            <span className={`mt-1 text-[12.5px] ${active ? 'font-medium text-brand-600' : 'text-ink-600'}`}>
              {t}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** SnackBar（点「撤销」会消失） */
export function SnackBarI() {
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <button
        type="button"
        onClick={() => setGone(false)}
        className="rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[14px] text-brand-600 shadow-card transition hover:border-brand-300"
      >
        ↻ 再看一次 SnackBar
      </button>
    );
  }
  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-[#2c3038] px-4 py-3 shadow-pop anim-in">
      <span className="text-[14.5px] text-white">已加入购物车</span>
      <button
        type="button"
        onClick={() => setGone(true)}
        className="ml-auto text-[14.5px] font-medium text-[#7fb8f7] transition hover:text-white"
      >
        撤销
      </button>
    </div>
  );
}

/** 对话框 */
export function DialogI({
  title,
  body,
  okLabel,
  cancelLabel = '取消',
  okDanger = false,
  withInput = false,
  onlyOk = false,
}: {
  title: string;
  body: string;
  okLabel: string;
  cancelLabel?: string;
  okDanger?: boolean;
  withInput?: boolean;
  onlyOk?: boolean;
}) {
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <button
        type="button"
        onClick={() => setGone(false)}
        className="rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[14px] text-brand-600 shadow-card transition hover:border-brand-300"
      >
        ↻ 再打开对话框
      </button>
    );
  }
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-pop anim-in">
      <p className="text-[17px] font-semibold text-ink-900">{title}</p>
      {withInput ? (
        <div className="mt-3 rounded-lg border border-ink-200 px-3 py-2">
          <input
            placeholder="请输入备注内容…"
            className="w-full bg-transparent text-[14.5px] text-ink-900 outline-none placeholder:text-ink-400"
          />
        </div>
      ) : (
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{body}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        {!onlyOk && (
          <Btn kind="text" onClick={() => setGone(true)}>
            {cancelLabel}
          </Btn>
        )}
        <Btn kind="text" danger={okDanger} onClick={() => setGone(true)}>
          {okLabel}
        </Btn>
      </div>
    </div>
  );
}

/** BottomSheet */
export function SheetI({ items }: { items: string[] }) {
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <button
        type="button"
        onClick={() => setGone(false)}
        className="rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[14px] text-brand-600 shadow-card transition hover:border-brand-300"
      >
        ↻ 再打开 BottomSheet
      </button>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-t-2xl bg-white p-3 shadow-pop ring-1 ring-ink-100 anim-in">
      <span className="mx-auto block h-1 w-9 rounded-full bg-ink-200" />
      <div className="mt-2 divide-y divide-ink-50">
        {items.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setGone(true)}
            className={`block w-full py-2 text-center text-[15px] transition active:bg-ink-50 ${
              t === '取消' ? 'text-ink-500' : 'text-ink-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Banner */
export function BannerI({ text }: { text: string }) {
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <button
        type="button"
        onClick={() => setGone(false)}
        className="rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-[14px] text-brand-600 shadow-card transition hover:border-brand-300"
      >
        ↻ 再看一次 Banner
      </button>
    );
  }
  return (
    <div className="flex w-full items-center gap-2.5 rounded-lg bg-brand-50 px-3.5 py-2.5 ring-1 ring-brand-200 anim-in">
      <MI d={P.notif} size={17} className="shrink-0 text-brand-600" />
      <span className="text-[14px] text-ink-700">{text}</span>
      <button
        type="button"
        onClick={() => setGone(true)}
        className="ml-auto shrink-0 text-[14px] font-medium text-brand-600 transition hover:text-brand-700"
      >
        重试
      </button>
    </div>
  );
}

/** InkWell：真有涟漪的可点卡片 */
export function InkWellI() {
  const { add, node } = useRipple();
  const [clicked, setClicked] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        add();
        setClicked(true);
        setTimeout(() => setClicked(false), 600);
      }}
      className="relative flex w-full select-none items-center gap-3 overflow-hidden rounded-xl bg-white px-4 py-3 shadow-card ring-1 ring-ink-100 transition active:bg-ink-50"
    >
      {node}
      <span className="relative text-[15.5px] text-ink-900">
        {clicked ? '→ 涟漪已触发！' : '可点击的卡片（涟漪效果）'}
      </span>
      <MI d={P.chevR} size={18} className="relative ml-auto text-ink-400" />
    </button>
  );
}
