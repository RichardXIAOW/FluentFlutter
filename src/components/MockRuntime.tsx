'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * MockRuntime —— 示例预览的「交互运行时」
 *
 * 背景：预览区是用 HTML/CSS 复刻 Flutter 渲染结果的，很多控件是 <span>，
 * 点上去没有任何反应，看起来像张截图。
 *
 * 这一层做三件事，且**不需要改任何 mock**：
 *   1. 指针按下的涟漪（Material 的 ink ripple）+ 轻微缩放，凡是被判定为
 *      「控件」的元素（button / [data-press] / 实色或主色底的胶囊…）都有反馈；
 *   2. 材质 SnackBar 宿主：mock 里任何地方调 snack('已加入购物车') 就能弹出来，
 *      位置固定在当前预览卡片底部，2.2s 自动消失；
 *   3. 键盘可达：给 [data-press] 补 tabindex/role，回车空格等同点击。
 *
 * 两个约定属性：
 *   data-snack="文案"  → 按下时弹一条 SnackBar（不用写 onClick）
 *   data-noink         → 故意不给反馈（演示「水波被盖住 / 已禁用」这类反面例子）
 *
 * 判定控件的选择器集中在 PRESSABLE，新增控件样式时改这一处即可。
 */

export const PRESSABLE =
  'button,[data-press],[data-noink],[role="button"],[class*="bg-solid"],[class*="bg-brand-5"],[class*="bg-brand-6"],[class*="bg-danger"]';

/** 在任意 mock 里弹一条 Material SnackBar */
export function snack(message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('mock-snack', { detail: message }));
}

type Toast = { msg: string; id: number };

export default function MockRuntime({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const onSnack = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      if (typeof msg === 'string' && msg) setToast({ msg, id: Date.now() });
    };
    window.addEventListener('mock-snack', onSnack);
    return () => window.removeEventListener('mock-snack', onSnack);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const host = ref.current;
    if (!host) return;
    const el = (e.target as HTMLElement).closest(PRESSABLE) as HTMLElement | null;
    if (!el || !host.contains(el)) return;

    const box = el.getBoundingClientRect();
    const msg = el.getAttribute('data-snack');

    // data-noink：故意不做反馈 —— 用来演示「水波被盖住」「禁用了」这类反面例子。
    // 只弹提示说明原因，视觉上一点反应都没有，和真实 Flutter 的表现一致。
    if (el.hasAttribute('data-noink')) {
      if (msg) snack(msg);
      return;
    }

    const size = Math.max(box.width, box.height) * 2.2 || 40;
    const cs = window.getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    if (cs.overflow === 'visible') el.style.overflow = 'hidden';

    const ink = document.createElement('span');
    ink.className = 'mock-ink';
    ink.style.left = `${e.clientX - box.left}px`;
    ink.style.top = `${e.clientY - box.top}px`;
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    el.appendChild(ink);
    setTimeout(() => ink.remove(), 520);

    el.dataset.pressing = '1';
    setTimeout(() => delete el.dataset.pressing, 150);

    if (msg) snack(msg);
  }

  return (
    <div ref={ref} onPointerDown={handlePointerDown} className={`relative ${className}`}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center px-3">
        {toast && (
          <div
            key={toast.id}
            className="anim-in flex items-center gap-3 rounded-lg bg-[#2c3038] px-3.5 py-2 text-[13px] text-white shadow-pop"
          >
            {toast.msg}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="pointer-events-auto text-[13px] font-medium text-brand-400"
            >
              知道了
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
