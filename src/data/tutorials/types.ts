/**
 * 教程内容模型（Dart / Flutter 讲解页共用）
 *
 * 为什么不用 MDX：
 *   本站没有 MDX 依赖，引入会把构建链复杂化；
 *   而教程内容是「结构清晰、块类型有限」的，用数据描述反而更好维护 ——
 *   代码块走已有的 CodeBlock（带高亮与复制），段落的少量行内标记用受限 HTML 字符串表达。
 *
 * 约定：p / note / list / table / term 里的 html 字符串只允许
 *   <b> <code> <br> 三种标签，其余一律当纯文本。
 */

export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'code'; code: string; lang?: 'dart' | 'yaml' | 'bash' | 'json'; filename?: string; maxHeight?: number }
  | { kind: 'note'; tone?: 'ok' | 'warn' | 'bad' | 'info'; html: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'term'; items: { term: string; desc: string }[] }
  /** 正误对照：左右两栏，左边 ❌ 右边 ✅ —— 讲「为什么这么写」时最好用 */
  | { kind: 'compare'; bad: { title?: string; code: string }; good: { title?: string; code: string }; note?: string }
  /** 要点清单：带标题的一组关键结论，用来收束一个小节 */
  | { kind: 'keypoints'; title?: string; items: string[] };

export type Section = {
  /** 锚点 id */
  id: string;
  title: string;
  /** 一句话导语 */
  summary?: string;
  /** 难度标记，用于在目录里提示新手 */
  level?: '基础' | '进阶' | '实战';
  blocks: Block[];
};

export type Chapter = {
  id: string;
  /** 章节编号，如「第 0 章」 */
  no: string;
  title: string;
  lead?: string;
  sections: Section[];
};
