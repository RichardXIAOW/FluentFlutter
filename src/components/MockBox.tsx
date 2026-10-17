'use client';

import MockRuntime from './MockRuntime';
import { getMock } from './mocks';

/**
 * 图形 mock 的客户端外壳
 *
 * mocks.tsx 已标 'use client'（内含 hooks，mock 可交互）。
 * Server Component 不能直接调用 getMock() —— 会被解析成客户端引用，
 * 编译成 b.Vh(slug) 之类然后运行时报 "not a function"。
 * 所有来自 Server Component 的调用都必须经过本组件中转。
 *
 * 顺带把 MockRuntime 包上，让「组件效果」这块大图也能点：
 * 涟漪 + SnackBar 宿主都在这一层，mock 本身不用改。
 */
export default function MockBox({
  slug,
  className = '',
  canvas = false,
}: {
  slug: string;
  className?: string;
  /** 加棋盘/点阵底，用于页面顶部的展示台 */
  canvas?: boolean;
}) {
  return (
    <MockRuntime
      className={`${canvas ? 'preview-grid flex justify-center px-4 py-6' : ''} ${className}`}
    >
      {getMock(slug)}
    </MockRuntime>
  );
}
