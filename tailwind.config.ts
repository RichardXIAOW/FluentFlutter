import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Element Plus 风格主色
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#409eff',
          600: '#337ecc',
          700: '#2b6cb0',
          800: '#1e4e84',
          900: '#153a63',
        },
        ink: {
          900: '#1f2328',
          800: '#2c3038',
          700: '#4a5058',
          600: '#606266',
          500: '#8a9099',
          400: '#a8abb2',
          300: '#c0c4cc',
          200: '#dcdfe6',
          100: '#e4e7ed',
          50: '#f5f7fa',
        },
        ok: '#67c23a',
        warn: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399',
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
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 2px 8px rgba(16,24,40,.04)',
        pop: '0 4px 12px rgba(16,24,40,.06), 0 12px 32px rgba(16,24,40,.08)',
      },
      maxWidth: {
        // 1440 在 2K/宽屏上两侧留白过大；1620 兼顾 1080p（内容区仍充足）与宽屏利用率
        page: '1620px',
      },
    },
  },
  plugins: [],
};

export default config;
