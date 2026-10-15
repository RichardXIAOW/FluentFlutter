/**
 * 组件数据注册表
 *
 * 这一层负责：
 * 1. 把所有分类的数组拼成一个有序列表
 * 2. 提供 getComponent / searchComponents 等查询入口
 * 3. 开发期校验：related 里写的 slug 必须真实存在，否则构建时 console.warn
 *    —— 手写数据最容易出的错就是「相关组件指向了一个不存在的页面」，
 *       而这种错在页面上只会表现成一个点不动的链接，很难发现。
 */
import type { ComponentDoc } from './types';
import { generalComponents } from './components/general';
import { layoutComponents } from './components/layout';
import { inputComponents } from './components/input';
import { selectionComponents } from './components/selection';
import { displayComponents } from './components/display';
import { feedbackComponents } from './components/feedback';
import { navigationComponents } from './components/navigation';
import { otherComponents } from './components/other';
import { extraComponents } from './components/extra';

/** 按「先通用、再布局，最后业务」的顺序排列，与左侧导航一致 */
export const allComponents: ComponentDoc[] = [
  ...generalComponents,
  ...layoutComponents,
  ...inputComponents,
  ...selectionComponents,
  ...displayComponents,
  ...feedbackComponents,
  ...navigationComponents,
  ...otherComponents,
  ...extraComponents,
];

const bySlug = new Map<string, ComponentDoc>();
for (const c of allComponents) {
  if (bySlug.has(c.slug)) {
    // 开发期重复 slug 是最容易埋的雷：两个页面抢同一个 URL，
    // 后写的会静默覆盖前面的。
    console.warn(`[material-docs] 重复的组件 slug: "${c.slug}"（${c.name}）`);
  }
  bySlug.set(c.slug, c);
}

export function getComponent(slug: string): ComponentDoc | undefined {
  return bySlug.get(slug);
}

export function getComponentsByCategory(categoryId: string): ComponentDoc[] {
  return allComponents.filter((c) => c.category === categoryId);
}

/** slug → 组件名，用于 related 渲染成可点链接 */
export function componentName(slug: string): string | undefined {
  return bySlug.get(slug)?.name;
}

// ---------------------------------------------------------------------------
// 搜索：中英文混搜。标题/类名/摘要/标签都进索引。
// ---------------------------------------------------------------------------

export type SearchHit = {
  slug: string;
  name: string;
  title: string;
  category: string;
  /** 命中的片段，用于结果里显示上下文 */
  snippet: string;
  score: number;
};

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function searchComponents(rawQuery: string, limit = 12): SearchHit[] {
  const q = normalize(rawQuery);
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const c of allComponents) {
    let score = 0;

    const name = normalize(c.name);
    const title = normalize(c.title);
    const slug = normalize(c.slug);
    const summary = normalize(c.summary);

    // 完全相等 / 前缀 / 包含，权重依次递减
    if (name === q || title === q || slug === q) score += 100;
    else if (name.startsWith(q) || title.startsWith(q)) score += 60;
    else if (name.includes(q) || title.includes(q)) score += 40;
    else if (slug.includes(q)) score += 30;
    else if (summary.includes(q)) score += 15;

    // 标签命中给一个中等权重：用户搜「红点」应该能搜到 Badge
    for (const t of c.tags ?? []) {
      const tag = normalize(t);
      if (tag === q) score += 35;
      else if (tag.includes(q)) score += 18;
    }

    // 属性名命中：搜 "itemBuilder" 应该能定位到 ListView
    for (const p of c.props) {
      if (normalize(p.name) === q) {
        score += 25;
        break;
      }
    }

    if (score > 0) {
      hits.push({
        slug: c.slug,
        name: c.name,
        title: c.title,
        category: c.category,
        snippet: c.summary,
        score,
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ---------------------------------------------------------------------------
// 开发期校验
// ---------------------------------------------------------------------------

let validated = false;

/** 校验 related 指向、必填字段完整性。只在开发环境跑一次。 */
export function validateData(): string[] {
  if (validated) return [];
  validated = true;

  const problems: string[] = [];
  const slugs = new Set(allComponents.map((c) => c.slug));

  for (const c of allComponents) {
    if (!c.summary) problems.push(`${c.slug}: 缺少 summary`);
    if (!c.props.length) problems.push(`${c.slug}: props 为空`);
    if (!c.demos.length) problems.push(`${c.slug}: demos 为空`);

    for (const r of c.related ?? []) {
      if (!slugs.has(r)) problems.push(`${c.slug}: related 指向不存在的 "${r}"`);
    }
  }

  // 有分类没有组件时提示一下（可能只是还没写）
  return problems;
}

if (process.env.NODE_ENV !== 'production') {
  const problems = validateData();
  if (problems.length) {
    console.warn(
      `[material-docs] 数据校验发现 ${problems.length} 个问题：\n` +
        problems.map((p) => '  · ' + p).join('\n'),
    );
  }
}
