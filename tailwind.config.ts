import type { Config } from 'tailwindcss';

/**
 * 色板全部走 CSS 变量（globals.css 里 :root 与 .dark 各一套）。
 *
 * 为什么这么做：全站颜色本来就只经 ink-* / brand-* 这些 token 使用，
 * 把 token 的值换成变量，整套配色就能跟着主题翻转 —— 不用改 700 处 class。
 *
 * 语义约定（两个主题都成立）：
 *   ink-900 = 最强的文字   →  ink-50  = 最弱的填充面
 *   brand-* = 主强调（青蓝）  accent-* = 次强调（紫）
 *   surface = 卡片/浮层底色     canvas = 页面底色
 * 深色主题下 ink / brand / accent 的 50~900 是**整体倒序**的，
 * 所以 bg-ink-50（浅灰底）在深色下自动变成深色底，text-ink-900 自动变亮。
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

/** 生成一段 50~900 的变量引用 */
const ramp = (prefix: string) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((k) => [
      k,
      v(`${prefix}-${k}`),
    ]),
  ) as Record<string, string>;

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /** 主强调：青蓝 */
        brand: ramp('brand'),
        /** 次强调：紫（与 brand 组成渐变） */
        accent: ramp('accent'),
        /** 中性色阶（语义见文件头注释） */
        ink: ramp('ink'),
        /** 卡片/浮层底色 —— 替代原先写死的 bg-white */
        surface: v('surface'),
        /** 轻一档的填充面（表格斑马纹、代码区） */
        subtle: v('subtle'),
        /** 页面底色 */
        canvas: v('canvas'),
        /**
         * 实心强调填充（白字压在上面）。
         * 给 mock 用：mock 是 Flutter 真实外观的仿真，Material 3 的 FilledButton
         * 是实色而非渐变，用渐变会失真。两个主题都取够深的停靠点保证白字可读。
         */
        solid: v('solid'),
        /**
         * 遮罩 / 浮层（白字压在上面）。
         * 不参与深浅倒序：它的职责是压住底下的截图或图片，两个主题下都必须够暗。
         */
        scrim: v('scrim'),
        ok: v('ok'),
        warn: v('warn'),
        danger: v('danger'),
        info: v('info'),
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'JetBrains Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      boxShadow: {
        /* 层次主要靠发丝描边，阴影只做极轻微的托底 */
        card: '0 1px 2px rgb(var(--shadow-rgb) / .04)',
        pop: '0 8px 28px -6px rgb(var(--shadow-rgb) / .18), 0 2px 6px -2px rgb(var(--shadow-rgb) / .10)',
        /* 强调色微光，用在主按钮与悬停卡片上 */
        glow: '0 0 0 1px rgb(var(--brand-500) / .28), 0 6px 22px -6px rgb(var(--brand-500) / .45)',
        'glow-sm': '0 0 0 1px rgb(var(--brand-500) / .22), 0 2px 10px -3px rgb(var(--brand-500) / .35)',
      },
      maxWidth: {
        // 1440 在 2K/宽屏上两侧留白过大；1620 兼顾 1080p 与宽屏利用率
        page: '1620px',
      },
      backgroundImage: {
        /**
         * 主按钮渐变。刻意不用 brand-500/accent-500 —— 那两个在深色主题下是
         * 亮青/亮紫，白字压不住（对比度仅 1.8:1）。--grad-from/--grad-to
         * 两个主题都取了足够深的停靠点，白字全段过 AA。
         */
        'grad-brand': 'linear-gradient(135deg, rgb(var(--grad-from)), rgb(var(--grad-to)))',
        'grad-brand-soft':
          'linear-gradient(135deg, rgb(var(--brand-500) / .12), rgb(var(--accent-500) / .12))',
      },
    },
  },
  plugins: [],
};

export default config;
