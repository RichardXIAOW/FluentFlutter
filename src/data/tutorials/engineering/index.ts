import type { Chapter } from '../types';
import { engineeringCh0to2 } from './ch0-2';
import { engineeringCh3to4 } from './ch3-4';
import { engineeringCh5to6 } from './ch5-6';
import { engineeringCh7to10 } from './ch7-10';

/**
 * Flutter 工程化搭建指南 · 站内原生渲染版
 *
 * 章节体量大，按章组分文件维护：
 *   ch0-2    选型总表 / 环境与骨架 / 依赖与代码生成
 *   ch3-4    Riverpod 状态管理 / go_router 路由（重写重点）
 *   ch5-6    网络与错误处理（重写重点）/ 国际化与存储
 *   ch7-10   主题定制与明暗切换 / 测试 / CI-CD 与发布 / 性能 / 验收清单（重写重点：8、9）
 *
 * 唯一入口：engineeringTutorial —— 消费方（/handbook 页）只 import 这里。
 */
export const engineeringTutorial: Chapter[] = [
  ...engineeringCh0to2,
  ...engineeringCh3to4,
  ...engineeringCh5to6,
  ...engineeringCh7to10,
];
