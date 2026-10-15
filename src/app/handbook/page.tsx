import type { Metadata } from 'next';
import HandbookShell from '@/components/HandbookShell';

export const metadata: Metadata = {
  title: '从零搭建 Flutter 工程化项目',
  description:
    '14 个阶段、39 个步骤的 Flutter 项目工程化搭建指南：环境分档、网络层、错误处理、路由、状态管理、构建与发布签名，每一步都带验证方法。',
};

export default function HandbookPage() {
  return <HandbookShell />;
}
