/**
 * Material 组件文档 · 数据类型定义
 *
 * 设计原则：
 * - 属性表只列「真正会改的」参数，不照抄 API 文档。
 *   官方签名有 30 个参数，新手会用的通常只有 5~8 个。
 * - 每个示例都给「为什么这么写」而不是只给代码。
 */

export type PropRow = {
  /** 属性名 */
  name: string;
  /** 类型签名（精简，能看懂即可） */
  type: string;
  /** 默认值 */
  def?: string;
  /** 必填 */
  required?: boolean;
  /** 这块是干什么的 —— 用一句话，不写"设置xxx"这种同义反复 */
  desc: string;
};

export type Demo = {
  /** 示例标题 */
  title: string;
  /** 一句话说明这个示例想让你看到什么 */
  note?: string;
  /** Dart 代码 */
  code: string;
  /**
   * 预览方式：
   * - 'live'  表示这个示例「适合」做成实时预览。真正能不能显示，
   *           取决于 previewUrl / 组件级 defaultPreview 是否存在 ——
   *           不存在时会自动降级（有图则显示图，没有则直接展示代码）。
   *           这样即使还没有 Flutter Web 构建产物，页面也不会出现空白预览区。
   * - 'image' 强制用静态截图
   * - 'none'  只给代码
   */
  preview?: 'live' | 'image' | 'none';
  /** live 预览时的入口文件 URL（public/previews/ 下）；缺省则用组件级 defaultPreview */
  previewUrl?: string;
  /** image 预览时的图片路径（public/ 下）；缺省则用组件级 previewImage */
  imageUrl?: string;
};

export type ComponentDoc = {
  /** URL 段，如 button → /components/button */
  slug: string;
  /** 组件类名，如 ElevatedButton */
  name: string;
  /** 中文名 / 一句话定位 */
  title: string;
  /** 列表页与详情页顶部的一句话 */
  summary: string;
  /** 分组 id，见 categories */
  category: string;
  /** 引入路径，如 package:flutter/material.dart */
  import?: string;
  /** 关键特性 bullet */
  highlights?: string[];
  /** 什么时候用它 / 什么时候别用 */
  whenToUse?: { do: string[]; dont?: string[] };
  /** 属性表 */
  props: PropRow[];
  /** 构造函数或类的关键说明 */
  notes?: string;
  /** 代码示例 */
  demos: Demo[];
  /** 组件级默认预览入口（live） */
  defaultPreview?: string;
  /** 组件级默认静态图 */
  previewImage?: string;
  /** 相关组件 slug */
  related?: string[];
  /** 标签，用于搜索 */
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  /** 左侧导航分组下的说明 */
  desc?: string;
};
