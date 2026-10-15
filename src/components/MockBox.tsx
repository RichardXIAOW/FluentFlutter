'use client';

import { getMock } from './mocks';

/**
 * 图形 mock 的客户端外壳
 *
 * mocks.tsx 已标 'use client'（内含 hooks，mock 可交互）。
 * Server Component 不能直接调用 getMock() —— 会被解析成客户端引用，
 * 编译成 b.Vh(slug) 之类然后运行时报 "not a function"。
 * 所有来自 Server Component 的调用都必须经过本组件中转。
 */
export default function MockBox({ slug }: { slug: string }) {
  return <>{getMock(slug)}</>;
}
