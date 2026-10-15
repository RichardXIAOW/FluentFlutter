import type { ComponentDoc } from '../types';

/** 布局：Row / Column / Stack / Padding / Center / Expanded / Wrap / GridView */
export const layoutComponents: ComponentDoc[] = [
  {
    slug: 'row',
    name: 'Row',
    title: '行',
    summary: '把子组件横向排成一排。',
    category: 'layout',
    tags: ['横向', 'row', '排列', '一行'],
    import: 'package:flutter/material.dart',
    highlights: [
      '主轴是「水平方向」，对齐用 mainAxisAlignment',
      '交叉轴是「垂直方向」，对齐用 crossAxisAlignment',
      '子项总宽超出一行时不会自动换行 —— 那要换 Wrap 或加横向滚动',
    ],
    props: [
      {
        name: 'children',
        type: 'List<Widget>',
        required: true,
        desc: '子组件列表',
      },
      {
        name: 'mainAxisAlignment',
        type: 'MainAxisAlignment',
        def: 'start',
        desc: '水平方向怎么分配剩余空间：start（靠左）、center、end（靠右）、spaceBetween、spaceAround、spaceEvenly',
      },
      {
        name: 'mainAxisSize',
        type: 'MainAxisSize',
        def: 'max',
        desc: 'Row 自身占多宽。max = 撑满父容器；min = 只包住子项。想让 Row 居中必须改成 min',
      },
      {
        name: 'crossAxisAlignment',
        type: 'CrossAxisAlignment',
        def: 'center',
        desc: '垂直方向对齐：start（顶部对齐）、center（居中）、end（底部）、stretch（拉伸等高）',
      },
      {
        name: 'spacing',
        type: 'double',
        def: '0',
        desc: '子项之间的间距。Flutter 3.27+ 才有 —— 有它就不用插一堆 SizedBox 了',
      },
      {
        name: 'textDirection',
        type: 'TextDirection?',
        desc: '排列方向。跟随 Locale 自动处理 RTL 语言，一般不用手写',
      },
    ],
    demos: [
      {
        title: '左右分布：用 spaceBetween 或 Spacer',
        note: '「左边一个标题，右边一个按钮」是最常见的需求。spaceBetween 处理不了中间有多组元素的情况，Spacer 更灵活。',
        preview: 'live',
        code: `// 方式一：两端对齐
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    const Text('订单总额'),
    Text('¥128.00', style: const TextStyle(fontWeight: FontWeight.w600)),
  ],
)

// 方式二：Spacer 把后面的元素推到最右（中间还能放别的）
Row(
  children: [
    const Text('订单总额'),
    const Spacer(),                 // ← 吃掉所有剩余空间
    Text('¥128.00', style: const TextStyle(fontWeight: FontWeight.w600)),
  ],
)`,
      },
      {
        title: '让 Row 里的文字可伸缩（避免溢出）',
        note: 'Row 里放长文本几乎一定会报 RenderFlex overflow。Expanded 让文字「占剩下多少就用多少」，超出部分再交给 maxLines 截断。',
        preview: 'live',
        code: `Row(
  children: [
    const Icon(Icons.image, size: 40),
    const SizedBox(width: 12),

    // ★ 必须 Expanded：否则长标题会撑爆
    Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '一个很长很长的标题会撑破布局',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text('副标题', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        ],
      ),
    ),

    const Icon(Icons.chevron_right),
  ],
)`,
      },
      {
        title: '垂直方向对齐的三个值',
        preview: 'live',
        code: `Row(
  crossAxisAlignment: CrossAxisAlignment.start,   // 顶部对齐
  children: [
    Icon(Icons.abc, size: 40),
    const Text('这一行文字比较短'),
  ],
)

Row(
  crossAxisAlignment: CrossAxisAlignment.center,  // 居中（默认）
  children: [
    Icon(Icons.abc, size: 40),
    const Text('这一行文字比较短'),
  ],
)`,
      },
    ],
    related: ['column', 'wrap', 'expanded', 'spacer'],
  },

  {
    slug: 'column',
    name: 'Column',
    title: '列',
    summary: '把子组件纵向排成一列。',
    category: 'layout',
    tags: ['纵向', 'column', '排列', '一列', '垂直'],
    highlights: [
      '主轴是「垂直方向」—— 和 Row 正好相反，这个容易记混',
      'Column 放不下时不滚动，会直接报 overflow —— 要滚动得用 SingleChildScrollView 或 ListView',
      'spacing 参数比手动插 SizedBox 干净（Flutter 3.27+）',
    ],
    props: [
      { name: 'children', type: 'List<Widget>', required: true, desc: '子组件列表' },
      {
        name: 'mainAxisAlignment',
        type: 'MainAxisAlignment',
        def: 'start',
        desc: '垂直方向怎么分配剩余空间：start = 顶部对齐。想让一列在屏幕中间，需要配合 mainAxisSize: min',
      },
      {
        name: 'mainAxisSize',
        type: 'MainAxisSize',
        def: 'max',
        desc: 'Column 自身占多高。max = 撑满；min = 只包住子项。默认 max 意味着「居中」不会生效，必须改成 min',
      },
      {
        name: 'crossAxisAlignment',
        type: 'CrossAxisAlignment',
        def: 'center',
        desc: '水平方向对齐：start（靠左）、center、end（靠右）、stretch（拉满宽度）',
      },
      { name: 'spacing', type: 'double', def: '0', desc: '子项之间的间距' },
    ],
    demos: [
      {
        title: '居中：为什么 mainAxisAlignment.center 有时没用',
        note: '这是新手最常卡的一个点。Column 默认 mainAxisSize: max，也就是「我本来就占满整个高度」，既然占满了就没有剩余空间可言，center 自然看不出效果。',
        preview: 'live',
        code: `// ❌ 看起来应该居中，实际不会
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [const Text('我在中间吗？')],
)

// ✅ 两种正确写法
// 写法一：告诉 Column「你只包住内容就好」
Column(
  mainAxisSize: MainAxisSize.min,
  mainAxisAlignment: MainAxisAlignment.center,
  children: [const Text('我在中间了')],
)

// 写法二（更常用）：交给父组件居中
Center(
  child: Column(
    mainAxisSize: MainAxisSize.min,
    children: [const Text('我在中间了')],
  ),
)`,
      },
      {
        title: '表单：标签在上、输入在下',
        note: 'crossAxisAlignment: stretch 能让所有输入框拉满宽度，比逐个写 width: double.infinity 干净。',
        preview: 'live',
        code: `Padding(
  padding: const EdgeInsets.all(16),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,  // 子项都拉满宽度
    spacing: 12,
    children: [
      const TextField(decoration: InputDecoration(labelText: '手机号')),
      const TextField(decoration: InputDecoration(labelText: '验证码')),
      FilledButton(onPressed: () {}, child: const Text('登录')),
    ],
  ),
)`,
      },
      {
        title: 'Column 太长怎么办',
        note: '超过屏幕高度会报 RenderFlex overflow。给出路而不是把内容砍掉。',
        preview: 'none',
        code: `// ❌ 内容一多就 overflow
Column(children: [ ...很多内容 ])

// ✅ 让它可以滚
SingleChildScrollView(
  padding: const EdgeInsets.all(16),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [ ...很多内容 ],
  ),
)

// ✅ 或者用 ListView（内容特别多、需要懒加载时）
ListView(
  padding: const EdgeInsets.all(16),
  children: [ ... ],
)`,
      },
    ],
    related: ['row', 'list-view', 'single-child-scroll-view', 'expanded'],
  },

  {
    slug: 'stack',
    name: 'Stack',
    title: '层叠',
    summary: '把子组件叠在一起，后面的盖在前面的上面。',
    category: 'layout',
    tags: ['层叠', 'stack', '叠加', '绝对定位', '浮层'],
    highlights: [
      '用 position 定位的写法接近 CSS 的 absolute',
      'Stack 的大小由「没有定位的那些子项」决定 —— 如果全都定位了，它会塌成 0',
      '超出范围的内容默认会被裁掉（clipBehavior: hardEdge）',
    ],
    props: [
      { name: 'children', type: 'List<Widget>', required: true, desc: '子组件列表。越靠后越在上层' },
      {
        name: 'alignment',
        type: 'AlignmentGeometry',
        def: 'topStart',
        desc: '没有定位的子项怎么对齐。想让未定位内容居中就写 Alignment.center',
      },
      {
        name: 'fit',
        type: 'StackFit',
        def: 'loose',
        desc: '怎么把尺寸约束传给子项。expand 表示「未定位的子项都撑满 Stack」',
      },
      {
        name: 'clipBehavior',
        type: 'Clip',
        def: 'hardEdge',
        desc: '超出边界是否裁剪。做「头像上的角标」这类会溢出的效果时改成 Clip.none',
      },
    ],
    demos: [
      {
        title: '图片右下角浮一个价签',
        note: '这就是 Stack 最典型的用途：主体（未定位，决定大小）+ 点缀（用 Positioned 定位）。',
        preview: 'live',
        code: `Stack(
  children: [
    // 主体：决定 Stack 的大小
    Container(
      width: 200, height: 140,
      decoration: BoxDecoration(
        color: Colors.blue.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(child: Icon(Icons.image, size: 40)),
    ),

    // 点缀：定位到右下角
    Positioned(
      right: 8,
      bottom: 8,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(.65),
          borderRadius: BorderRadius.circular(6),
        ),
        child: const Text('¥128', style: TextStyle(color: Colors.white, fontSize: 12)),
      ),
    ),
  ],
)`,
      },
      {
        title: '头像右上角的小红点',
        note: '小红点用 Positioned 定位到右上角，父级需要 SizedBox 给它一个明确尺寸。',
        preview: 'live',
        code: `SizedBox(
  width: 56,
  height: 56,
  child: Stack(
    clipBehavior: Clip.none,          // 允许角标溢出边界
    children: [
      const CircleAvatar(
        radius: 28,
        backgroundColor: Color(0xffdbeafe),
        child: Icon(Icons.person),
      ),
      Positioned(
        right: 0,
        top: 0,
        child: Container(
          width: 14, height: 14,
          decoration: BoxDecoration(
            color: const Color(0xfff56c6c),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
          ),
        ),
      ),
    ],
  ),
)`,
      },
      {
        title: '加载遮罩：内容之上盖一层半透明',
        note: '这是「请求中禁止操作」的另一种做法，比禁用每个按钮更彻底。',
        preview: 'live',
        code: `Stack(
  children: [
    // 内容
    const Padding(
      padding: EdgeInsets.all(16),
      child: Text('下面这块内容在加载时会被遮住'),
    ),

    // 遮罩
    Positioned.fill(                  // ← 铺满整个 Stack
      child: ColoredBox(
        color: Colors.white.withOpacity(.7),
        child: const Center(
          child: SizedBox(
            width: 28, height: 28,
            child: CircularProgressIndicator(strokeWidth: 3),
          ),
        ),
      ),
    ),
  ],
)`,
      },
    ],
    related: ['positioned', 'container', 'indexed-stack'],
  },

  {
    slug: 'padding',
    name: 'Padding',
    title: '内边距',
    summary: '给子组件加一圈「往里挤」的空白。',
    category: 'layout',
    tags: ['内边距', 'padding', '边距'],
    highlights: [
      '比 Container 轻 —— 只有内边距需求时用它',
      'EdgeInsets 有一套很顺手的命名：all / symmetric / only / fromLTRB',
      'SafeArea 处理的是「屏幕缺口/刘海」避让，两者配合使用',
    ],
    props: [
      { name: 'padding', type: 'EdgeInsetsGeometry', required: true, desc: '内边距大小' },
      { name: 'child', type: 'Widget?', desc: '子组件' },
    ],
    demos: [
      {
        title: '四种构造方式',
        preview: 'none',
        code: `// 四边等距
Padding(padding: const EdgeInsets.all(16), child: child)

// 水平 24、垂直 12（最常用）
Padding(padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12), child: child)

// 只某一两条边
Padding(padding: const EdgeInsets.only(left: 16, top: 8), child: child)

// 左 上 右 下 顺时针（LTRB）
Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 24), child: child)`,
      },
      {
        title: '列表项的标准内边距',
        note: '16 是 Material 规范里的基准值，也是「人体工学上看起来舒服」的经验值。全项目统一成令牌里的 AppSpacing.lg。',
        preview: 'live',
        code: `Column(
  children: [
    Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          const Icon(Icons.settings),
          const SizedBox(width: 12),
          const Expanded(child: Text('设置')),
          Icon(Icons.chevron_right, color: Colors.grey.shade400),
        ],
      ),
    ),
    const Divider(height: 1, indent: 16),
    // ...
  ],
)`,
      },
    ],
    related: ['container', 'sized-box', 'safe-area'],
  },

  {
    slug: 'center',
    name: 'Center',
    title: '居中',
    summary: '把子组件放到父容器的正中间。',
    category: 'layout',
    tags: ['居中', 'center', '对齐'],
    highlights: [
      '等价于 Align(alignment: Alignment.center)',
      '它会尽可能撑满父容器，然后把 child 放在中间',
      '只想水平居中或垂直居中时，用 Align 指定单一方向更省资源',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '要居中的子组件' },
      {
        name: 'widthFactor',
        type: 'double?',
        desc: 'Center 自身宽度 = child 宽度 × 这个系数。传了它 Center 就不再撑满父容器',
      },
      { name: 'heightFactor', type: 'double?', desc: '同上，作用于高度' },
    ],
    demos: [
      {
        title: '居中 vs 单方向对齐',
        preview: 'live',
        code: `// 完全居中
const Center(child: Text('我是居中的'))

// 只水平居中（垂直方向从顶部开始）
// 用 Alignment.center 的 x 方向
const Align(
  alignment: Alignment.topCenter,
  child: Text('水平居中，贴着顶部'),
)

// 只垂直居中，靠左
const Align(
  alignment: Alignment.centerLeft,
  child: Text('垂直居中，贴着左边'),
)`,
      },
      {
        title: '居中一个「会撑满」的组件为什么会失败',
        note: 'Column / ListView 这类默认撑满父容器的组件，包在 Center 里看不出居中效果 —— 因为它本来就占满了。解法是先给它设 mainAxisSize.min 或 shrinkWrap: true。',
        preview: 'none',
        code: `// ❌ 没有居中效果，因为 Column 本来就占满
Center(
  child: Column(children: [const Text('a'), const Text('b')]),
)

// ✅ 告诉 Column 只包住内容
Center(
  child: Column(
    mainAxisSize: MainAxisSize.min,
    children: [const Text('a'), const Text('b')],
  ),
)`,
      },
    ],
    related: ['align', 'column', 'row'],
  },

  {
    slug: 'expanded',
    name: 'Expanded',
    title: '弹性扩展',
    summary: '在 Row / Column 里「吃掉剩余空间」，是防溢出的第一手段。',
    category: 'layout',
    tags: ['扩展', 'expanded', 'flex', '自适应', '溢出'],
    highlights: [
      '只能直接放在 Row / Column / Flex 里 —— 放别处会运行时报错',
      'Row 里放长文本不包 Expanded，几乎必然 overflow',
      'flex 参数控制多个 Expanded 之间怎么分配空间',
    ],
    props: [
      { name: 'child', type: 'Widget', required: true, desc: '要扩展的子组件' },
      {
        name: 'flex',
        type: 'int',
        def: '1',
        desc: '权重。两个 Expanded 分别是 1 和 2，就按 1:2 分配剩余空间',
      },
    ],
    demos: [
      {
        title: 'Expanded vs Flexible 的区别',
        note: 'Expanded 是 Flexible(fit: FlexFit.tight) 的简写 —— 也就是「必须占满分配到的空间」。Flexible 允许子组件「用多少算多少」，多余空间还回去。',
        preview: 'live',
        code: `// Expanded：占满分配到的空间（更常用）
Row(
  children: [
    Expanded(child: Container(height: 40, color: Colors.blue.shade200)),
    Expanded(child: Container(height: 40, color: Colors.green.shade200)),
  ],
)

// Flexible：只占自己需要的大小，剩余空间留白
Row(
  children: [
    Flexible(child: Container(height: 40, width: 60, color: Colors.blue.shade200)),
    const Flexible(child: Text('文字很短')),
  ],
)`,
      },
      {
        title: '按比例分配宽度',
        note: '左右分栏 1:2 是很常见的布局需求，直接写 flex 就行。',
        preview: 'live',
        code: `SizedBox(
  height: 60,
  child: Row(
    children: [
      Expanded(flex: 1, child: Container(color: Colors.blue.shade200, alignment: Alignment.center, child: const Text('1'))),
      Expanded(flex: 2, child: Container(color: Colors.green.shade200, alignment: Alignment.center, child: const Text('2'))),
    ],
  ),
)`,
      },
    ],
    related: ['flexible', 'row', 'column', 'spacer'],
  },

  {
    slug: 'wrap',
    name: 'Wrap',
    title: '流式换行',
    summary: '一行放不下时自动换到下一行，像文字排版一样。',
    category: 'layout',
    tags: ['换行', 'wrap', '流式', '标签', 'tag'],
    highlights: [
      '标签云、筛选条件、头像墙的标准解法',
      'Row 不会换行、GridView 会强制等宽 —— Wrap 是这两种之间的选择',
      'spacing 管水平间距，runSpacing 管行与行之间的间距（两个都要设）',
    ],
    props: [
      { name: 'children', type: 'List<Widget>', required: true, desc: '子组件列表' },
      { name: 'direction', type: 'Axis', def: 'horizontal', desc: '排列方向。horizontal 是「先横着排、放不下换行」' },
      { name: 'spacing', type: 'double', def: '0', desc: '同一行里子项之间的水平间距' },
      { name: 'runSpacing', type: 'double', def: '0', desc: '行与行之间的距离。很多人漏写这个，导致换行后挤在一起' },
      { name: 'alignment', type: 'WrapAlignment', def: 'start', desc: '每一行的水平对齐' },
      { name: 'runAlignment', type: 'WrapAlignment', def: 'start', desc: '整体在垂直方向的对齐' },
    ],
    demos: [
      {
        title: '标签云（最典型的用法）',
        note: '注意 spacing 和 runSpacing 都写了 —— 只写 spacing 的话换行后上下会贴死。',
        preview: 'live',
        code: `Wrap(
  spacing: 8,        // 水平间距
  runSpacing: 8,     // 行间距（容易漏）
  children: [
    '手机', '数码', '家电', '图书', '服饰',
    '美妆', '运动', '食品', '母婴',
  ].map((t) => Chip(label: Text(t))).toList(),
)`,
      },
      {
        title: '筛选条件标签',
        note: '可点击的筛选标签用 FilterChip 而不是 Chip。',
        preview: 'live',
        code: `class _FilterDemo extends StatefulWidget {
  const _FilterDemo();
  @override
  State<_FilterDemo> createState() => _FilterDemoState();
}

class _FilterDemoState extends State<_FilterDemo> {
  final _selected = <String>{'包邮'};

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: ['包邮', '现货', '7天退换', '品牌店'].map((label) {
        return FilterChip(
          label: Text(label),
          selected: _selected.contains(label),
          onSelected: (v) => setState(() {
            if (v) { _selected.add(label); } else { _selected.remove(label); }
          }),
        );
      }).toList(),
    );
  }
}`,
      },
    ],
    related: ['row', 'chip', 'filter-chip', 'grid-view'],
  },

  {
    slug: 'grid-view',
    name: 'GridView',
    title: '网格',
    summary: '把内容排列成等宽的多列网格。',
    category: 'layout',
    tags: ['网格', 'gridview', '宫格', '九宫格'],
    highlights: [
      'GridView.count 按「固定列数」排是最省事的写法',
      'GridView.extent 按「每项最大宽度」排，能自动适应屏幕宽度',
      '嵌套在 Column 里时必须 shrinkWrap: true + physics: NeverScrollableScrollPhysics()',
    ],
    props: [
      { name: 'gridDelegate', type: 'SliverGridDelegate', required: true, desc: '决定几列、间距多少。一般用 .count / .extent 的便捷构造避免手写' },
      { name: 'children / builder', type: 'List<Widget> | IndexedWidgetBuilder', desc: '内容。builder 版本是懒加载的，长列表必须用它' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '网格整体的内边距' },
      { name: 'shrinkWrap', type: 'bool', def: 'false', desc: '为 true 时只占内容需要的高度。嵌套在 Column 里必须开，否则报无界高度错误' },
      { name: 'physics', type: 'ScrollPhysics?', desc: '滚动物理效果。嵌套时用 NeverScrollableScrollPhysics 关掉自己的滚动' },
      { name: 'crossAxisSpacing', type: 'double', def: '0', desc: '（count/extent 便捷构造）列间距' },
      { name: 'mainAxisSpacing', type: 'double', def: '0', desc: '（count/extent 便捷构造）行间距' },
      { name: 'childAspectRatio', type: 'double', def: '1.0', desc: '（count/extent 便捷构造）每项的宽高比。1 是正方形，0.75 是竖长' },
    ],
    demos: [
      {
        title: '固定 3 列的商品宫格',
        note: 'childAspectRatio 是最常调的一个值 —— 算错了就会出现内容显示不全或大片空白。',
        preview: 'live',
        code: `GridView.count(
  crossAxisCount: 3,
  crossAxisSpacing: 12,
  mainAxisSpacing: 12,
  padding: const EdgeInsets.all(16),
  childAspectRatio: 0.78,           // 竖长一点，给标题留位置
  children: List.generate(6, (i) => Card(
    elevation: 0,
    color: Colors.blue.shade50,
    child: Center(child: Text('商品 \${i + 1}')),
  )),
)`,
      },
      {
        title: '自适应列数（不同屏幕都能用）',
        note: 'GridView.extent 更「响应式」：手机 2 列、平板 4 列，不用自己算屏幕宽度。',
        preview: 'live',
        code: `GridView.extent(
  maxCrossAxisExtent: 160,          // 每项最多 160 宽，能塞几列塞几列
  crossAxisSpacing: 12,
  mainAxisSpacing: 12,
  padding: const EdgeInsets.all(16),
  children: List.generate(8, (i) => Container(
    color: Colors.green.shade50,
    alignment: Alignment.center,
    child: Text('项目 \${i + 1}'),
  )),
)`,
      },
      {
        title: '放在 Column 里（必须加两行）',
        note: '忘了 shrinkWrap 和 physics 这两个，几乎一定会看到 "Vertical viewport was given unbounded height"。',
        preview: 'none',
        code: `Column(
  children: [
    const Text('上面的标题'),
    GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,                                  // ★ 必须
      physics: const NeverScrollableScrollPhysics(),     // ★ 必须
      children: [ /* ... */ ],
    ),
  ],
)`,
      },
    ],
    related: ['list-view', 'wrap', 'column'],
  },

  {
    slug: 'single-child-scroll-view',
    name: 'SingleChildScrollView',
    title: '单子滚动视图',
    summary: '内容比屏幕高时，让它整体能滚。',
    category: 'layout',
    tags: ['滚动', 'scroll', '长页面'],
    highlights: [
      '适合「内容不多但可能超屏」的页面，比如表单、详情页',
      '内容很多（几百项）时用 ListView，因为 ListView 会懒加载',
      '自带键盘避让：输入框被键盘挡住时它会自动滚动上去',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '要滚动的内容' },
      { name: 'scrollDirection', type: 'Axis', def: 'vertical', desc: '滚动方向' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '内边距' },
      { name: 'physics', type: 'ScrollPhysics?', desc: '滚动物理。AlwaysScrollableScrollPhysics 让内容不足一屏时也能下拉' },
      { name: 'reverse', type: 'bool', def: 'false', desc: '反向滚动。聊天记录这类「新的在下面」的场景配合使用' },
    ],
    demos: [
      {
        title: '表单页面（最常用场景）',
        note: '配合 SafeArea 避开刘海和底部手势条，这是移动端的必备组合。',
        preview: 'none',
        code: `SafeArea(
  child: SingleChildScrollView(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 16,
      children: [
        TextField(decoration: InputDecoration(labelText: '收货人')),
        TextField(decoration: InputDecoration(labelText: '手机号')),
        TextField(maxLines: 3, decoration: InputDecoration(labelText: '详细地址')),
        FilledButton(onPressed: () {}, child: const Text('提交')),
      ],
    ),
  ),
)`,
      },
      {
        title: '内容不足一屏也想能下拉（刷新手势）',
        preview: 'none',
        code: `SingleChildScrollView(
  physics: const AlwaysScrollableScrollPhysics(),   // ★ 关键
  child: SizedBox(
    height: MediaQuery.sizeOf(context).height * 0.8,
    child: const Center(child: Text('内容不够高，但也能下拉')),
  ),
)`,
      },
    ],
    related: ['list-view', 'column', 'safe-area', 'refresh-indicator'],
  },
];
