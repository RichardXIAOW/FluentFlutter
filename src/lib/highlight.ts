/**
 * 极简 Dart 语法高亮器
 *
 * 为什么自己写而不用 highlight.js / prism：
 * 1. 它们体积大（几十 KB），而我们只需要 Dart 和 YAML 两种语言
 * 2. 通过 innerHTML 塞第三方高亮的输出的方式容易引入 XSS 风险（数据里带代码）
 * 3. 自己写可以保证「转义」这一步一定发生 —— 这是安全的关键
 *
 * 实现方式：单遍扫描 + 状态机。逐个字符走，遇到 /* 或 // 或 " 或 ' 就切模式，
 * 其余正常累积。这样天然处理了「字符串里的 // 不是注释」这类问题，
 * 用正则对切分是做不对的。
 */

export type Lang = 'dart' | 'yaml' | 'bash' | 'json' | 'properties' | 'text';

/** HTML 转义 —— 必须在拼接任何 token 之前调用 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Dart 关键字 */
const DART_KEYWORDS = new Set([
  'abstract', 'as', 'assert', 'async', 'await', 'base', 'break', 'case', 'catch',
  'class', 'const', 'continue', 'covariant', 'default', 'deferred', 'do',
  'dynamic', 'else', 'enum', 'export', 'extends', 'extension', 'external',
  'factory', 'false', 'final', 'finally', 'for', 'get', 'hide', 'if',
  'implements', 'import', 'in', 'interface', 'is', 'late', 'library', 'mixin',
  'new', 'null', 'on', 'operator', 'part', 'required', 'rethrow', 'return',
  'sealed', 'set', 'show', 'static', 'super', 'switch', 'sync', 'this', 'throw',
  'true', 'try', 'typedef', 'var', 'void', 'when', 'while', 'with', 'yield',
]);

/** 常见内置类型与 Flutter 类型名（用于着色，非必须精确） */
const DART_TYPES = new Set([
  'String', 'int', 'double', 'bool', 'num', 'Object', 'List', 'Map', 'Set',
  'Future', 'Stream', 'Iterable', 'Duration', 'DateTime', 'Color', 'Offset',
  'Size', 'Rect', 'EdgeInsets', 'EdgeInsetsGeometry', 'Alignment',
  'AlignmentGeometry', 'BorderRadius', 'TextStyle', 'Widget', 'BuildContext',
  'State', 'StatefulWidget', 'StatelessWidget', 'Key', 'GlobalKey',
  'ValueKey', 'ValueNotifier', 'AnimationController', 'TextEditingController',
  'ScrollController', 'TabController', 'ExpansionTileController',
  'Navigator', 'ScaffoldMessenger', 'MediaQuery', 'Theme', 'Icons', 'Colors',
  'BoxFit', 'TextOverflow', 'TextAlign', 'MainAxisAlignment',
  'CrossAxisAlignment', 'MainAxisSize', 'Axis', 'FlexFit', 'FontWeight',
  'BorderRadiusGeometry', 'Border', 'BorderSide', 'BoxDecoration', 'Gradient',
  'LinearGradient', 'DecorationImage', 'Curves', 'BoxConstraints',
  'GestureRecognizer', 'TapGestureRecognizer', 'Clipboard', 'ClipboardData',
]);

/** 在已转义的文本上做高亮。返回可直接放进 dangerouslySetInnerHTML 的字符串。 */
export function highlight(code: string, lang: Lang): string {
  if (lang === 'text') return escapeHtml(code);

  const kw = lang === 'dart' || lang === 'json' ? DART_KEYWORDS : null;

  let out = '';
  let i = 0;
  const n = code.length;

  const emit = (cls: string, text: string) => {
    // 注意：text 是原文，这里统一做转义
    out += `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
  };

  /** 读一个标识符（字母/数字/下划线/$） */
  const readIdent = (start: number): number => {
    let j = start;
    while (j < n && /[A-Za-z0-9_$]/.test(code[j])) j += 1;
    return j;
  };

  while (i < n) {
    const c = code[i];

    // ── 行注释 ──
    if (c === '/' && code[i + 1] === '/') {
      let j = code.indexOf('\n', i);
      if (j === -1) j = n;
      emit('com', code.slice(i, j));
      i = j;
      continue;
    }

    // ── 块注释 ──
    if (c === '/' && code[i + 1] === '*') {
      let j = code.indexOf('*/', i + 2);
      j = j === -1 ? n : j + 2;
      emit('com', code.slice(i, j));
      i = j;
      continue;
    }

    // ── # 注释（YAML / properties / bash） ──
    if (c === '#' && (lang === 'yaml' || lang === 'properties' || lang === 'bash')) {
      let j = code.indexOf('\n', i);
      if (j === -1) j = n;
      emit('com', code.slice(i, j));
      i = j;
      continue;
    }

    // ── 字符串（含三引号） ──
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      const triple = code.slice(i, i + 3) === quote.repeat(3);
      const open = triple ? quote.repeat(3) : quote;
      let j = i + open.length;

      // 字符串插值 \${...}：整段都算字符串色，不做进一步解析
      while (j < n) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code.slice(j, j + open.length) === open) { j += open.length; break; }
        // 单引号字符串遇到换行就结束（Dart 规则）
        if (!triple && quote !== '`' && code[j] === '\n') break;
        j += 1;
      }
      emit('str', code.slice(i, j));
      i = j;
      continue;
    }

    // ── 数字 ──
    if (/[0-9]/.test(c) && !/[A-Za-z_$]/.test(code[i - 1] ?? '')) {
      let j = i;
      while (j < n && /[0-9a-fA-FxX_.]/.test(code[j])) j += 1;
      emit('num', code.slice(i, j));
      i = j;
      continue;
    }

    // ── 注解 @Foo ──
    if (c === '@' && /[A-Za-z]/.test(code[i + 1] ?? '')) {
      const j = readIdent(i + 1);
      emit('ann', code.slice(i, j));
      i = j;
      continue;
    }

    // ── 标识符 / 关键字 ──
    if (/[A-Za-z_$]/.test(c)) {
      const j = readIdent(i);
      const word = code.slice(i, j);
      const nextCh = code[j] ?? '';

      if (kw?.has(word)) emit('kw', word);
      else if (DART_TYPES.has(word)) emit('typ', word);
      else if (nextCh === '(') emit('fn', word);       // 后面跟括号 → 当函数名
      else if (nextCh === ':') emit('prop', word);      // YAML 的 key
      else out += escapeHtml(word);
      i = j;
      continue;
    }

    // ── 标点 ──
    if ('()[]{}<>,;:.=+-*/%!&|?~^'.includes(c)) {
      emit('punc', c);
      i += 1;
      continue;
    }

    // ── 其他（空白、换行、中文注释里的汉字等）──
    out += escapeHtml(c);
    i += 1;
  }

  return out;
}
