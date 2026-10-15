import type { Category } from './types';

export const categories: Category[] = [
  { id: 'general', name: '通用', desc: '按钮、图标、文字这类最基础的积木' },
  { id: 'layout', name: '布局', desc: '决定「东西放在哪」的容器与排列' },
  { id: 'input', name: '输入', desc: '收集用户填的东西' },
  { id: 'selection', name: '选择', desc: '让用户在几个选项里挑' },
  { id: 'display', name: '数据展示', desc: '把已有的数据画出来' },
  { id: 'feedback', name: '反馈', desc: '告诉用户「正在发生什么」' },
  { id: 'navigation', name: '导航', desc: '在页面之间移动' },
  { id: 'other', name: '其他', desc: '不属于上面任何一类' },
];

export const categoryMap = new Map(categories.map((c) => [c.id, c]));
