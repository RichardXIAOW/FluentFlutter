import type { ComponentDoc } from '../types';

/** 通用：按钮、图标、文字、分割线 —— 最基础的积木 */
export const generalComponents: ComponentDoc[] = [
  {
    slug: 'elevated-button',
    name: 'ElevatedButton',
    title: '凸起按钮',
    summary: '有阴影的实心按钮，用于页面里最主要的那个动作。',
    category: 'general',
    tags: ['button', '按钮', '主按钮', 'FilledButton'],
    highlights: [
      '有高度（阴影），在视觉上「浮」在背景之上',
      '一个页面里最多一到两个，多了用户不知道该点哪个',
      'Material 3 里的新写法是 FilledButton，功能类似',
    ],
    whenToUse: {
      do: ['提交表单', '弹窗里的确认操作', '页面唯一的主要动作'],
      dont: [
        '一整排操作都用它 —— 那样就没有「主要」了，该用 TextButton 或 OutlinedButton',
        '用在列表项里 —— 列表应该整行可点，不是塞个按钮',
      ],
    },
    props: [
      {
        name: 'onPressed',
        type: 'VoidCallback?',
        required: true,
        desc: '点击回调。传 null 按钮会变灰并禁用 —— 这是「禁用按钮」的标准做法，不要自己写一套灰色样式',
      },
      {
        name: 'child',
        type: 'Widget',
        required: true,
        desc: '按钮里的内容。通常是一个 Text，也可以是图标 + 文字的组合',
      },
      {
        name: 'style',
        type: 'ButtonStyle?',
        desc: '覆盖外观。用 FilledButton.styleFrom() 构造最省事，不建议手拼 MaterialStateProperty',
      },
      {
        name: 'autofocus',
        type: 'bool',
        def: 'false',
        desc: '为 true 时页面一加载就聚焦它。桌面端键盘操作会用得上',
      },
      {
        name: 'clipBehavior',
        type: 'Clip',
        def: 'Clip.none',
        desc: '圆角把内容切出去时的裁剪方式。给按钮加自定义圆角时偶尔需要',
      },
    ],
    demos: [
      {
        title: '最基础的用法',
        note: 'onPressed 传 null 就等于禁用 —— 这是 Flutter 里的默认约定。',
        preview: 'live',
        code: `ElevatedButton(
  onPressed: () => print('点了'),
  child: const Text('确认提交'),
)

// 禁用态：什么都不用改，把回调传 null 即可
ElevatedButton(
  onPressed: null,
  child: const Text('不可点击'),
)`,
      },
      {
        title: '改高度和圆角',
        note: '别在每个按钮上各写一遍 style —— 应该在 ThemeData 里用 filledButtonTheme 统一兜住。这里只是演示怎么写。',
        preview: 'live',
        code: `ElevatedButton(
  style: ElevatedButton.styleFrom(
    minimumSize: const Size.fromHeight(48),   // 触摸目标下限
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(10),
    ),
    padding: const EdgeInsets.symmetric(horizontal: 24),
  ),
  onPressed: () {},
  child: const Text('整行宽度'),
)`,
      },
      {
        title: '带图标',
        note: '用 Row 的 mainAxisSize: MainAxisSize.min，否则按钮会试图撑满宽度。',
        preview: 'live',
        code: `ElevatedButton.icon(
  onPressed: () {},
  icon: const Icon(Icons.download),
  label: const Text('下载'),
)`,
      },
      {
        title: '请求中禁用（最常见的实战需求）',
        note: '防连点的关键在「请求开始到结束之间 onPressed 是 null」。这比在回调里 if (loading) return 更可靠，因为用户能看到按钮灰了。',
        preview: 'live',
        code: `class _SubmitButton extends StatefulWidget {
  const _SubmitButton();
  @override
  State<_SubmitButton> createState() => _SubmitButtonState();
}

class _SubmitButtonState extends State<_SubmitButton> {
  bool _loading = false;

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      await Future.delayed(const Duration(seconds: 2)); // 假装在发请求
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      // ★ 请求中传 null，按钮自己会变灰
      onPressed: _loading ? null : _submit,
      child: _loading
          ? const SizedBox(
              width: 18, height: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : const Text('提交'),
    );
  }
}`,
      },
    ],
    related: ['filled-button', 'outlined-button', 'text-button', 'icon-button'],
  },

  {
    slug: 'filled-button',
    name: 'FilledButton',
    title: '实心按钮',
    summary: 'Material 3 里代替 ElevatedButton 的主按钮，没有阴影但底色更实。',
    category: 'general',
    tags: ['button', '按钮', '主按钮', 'M3'],
    highlights: [
      'Material 3 推荐的「主要动作」按钮',
      '和 ElevatedButton 的区别：没有投影，靠底色区分层级',
      'FilledButton.tonal() 是它的弱化版，适合「次主要」动作',
    ],
    props: [
      {
        name: 'onPressed',
        type: 'VoidCallback?',
        required: true,
        desc: '点击回调，传 null 即禁用',
      },
      {
        name: 'child',
        type: 'Widget',
        required: true,
        desc: '按钮内容',
      },
      {
        name: 'style',
        type: 'ButtonStyle?',
        desc: '外观覆盖。全站统一在 ThemeData.filledButtonTheme 里配',
      },
    ],
    demos: [
      {
        title: '三种强调层级',
        note: '一个页面里同时出现这三个时，用户一眼就知道哪个是主要动作。这是 Material 3 的核心设计意图。',
        preview: 'live',
        code: `Column(
  spacing: 12,
  children: [
    // 主要动作
    FilledButton(onPressed: () {}, child: const Text('主要操作')),
    // 次主要（底色淡一些）
    FilledButton.tonal(onPressed: () {}, child: const Text('次要操作')),
    // 最弱
    TextButton(onPressed: () {}, child: const Text('取消')),
  ],
)`,
      },
      {
        title: '在主题里统一配好按钮高度',
        note: '在 ThemeData 里配一次，全项目所有 FilledButton 都跟着变 —— 这就是「令牌 + 主题」的价值。',
        preview: 'none',
        code: `ThemeData(
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      minimumSize: const Size.fromHeight(AppSize.buttonHeight),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
    ),
  ),
)`,
      },
    ],
    related: ['elevated-button', 'outlined-button', 'text-button'],
  },

  {
    slug: 'outlined-button',
    name: 'OutlinedButton',
    title: '描边按钮',
    summary: '只有边框没有填充，用于次要动作。',
    category: 'general',
    tags: ['button', '按钮', '描边'],
    highlights: [
      '比 FilledButton 弱、比 TextButton 强，处在中间层级',
      '在浅色页面上比实心按钮更「轻」，适合成组出现',
    ],
    props: [
      { name: 'onPressed', type: 'VoidCallback?', required: true, desc: '点击回调，传 null 即禁用' },
      { name: 'child', type: 'Widget', required: true, desc: '按钮内容' },
      { name: 'style', type: 'ButtonStyle?', desc: '外观覆盖' },
      { name: 'side', type: 'BorderSide?', desc: '边框颜色与粗细。改描边颜色用这个，别改 theme' },
    ],
    demos: [
      {
        title: '成组出现的次要操作',
        note: '「取消 / 确定」这种组合里，取消用 OutlinedButton 或 TextButton，确定用 FilledButton。',
        preview: 'live',
        code: `Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [
    OutlinedButton(onPressed: () {}, child: const Text('取消')),
    const SizedBox(width: 12),
    FilledButton(onPressed: () {}, child: const Text('保存')),
  ],
)`,
      },
    ],
    related: ['filled-button', 'text-button'],
  },

  {
    slug: 'text-button',
    name: 'TextButton',
    title: '文字按钮',
    summary: '没有背景也没有边框，最轻量的按钮。',
    category: 'general',
    tags: ['button', '按钮', '文字按钮', '链接'],
    highlights: [
      '强调层级最低，适合「取消」「稍后」「查看更多」这类',
      '在对话框里通常放在右下角',
      '不要用它当正文里的链接 —— 那是另一个组件',
    ],
    props: [
      { name: 'onPressed', type: 'VoidCallback?', required: true, desc: '点击回调，传 null 即禁用' },
      { name: 'child', type: 'Widget', required: true, desc: '按钮内容' },
      { name: 'style', type: 'ButtonStyle?', desc: '外观覆盖' },
    ],
    demos: [
      {
        title: '对话框里的标准排布',
        note: 'Material 规范里对话框按钮是「低强调在左、高强调在右」——中文环境常反过来，选一种全项目统一即可。',
        preview: 'live',
        code: `AlertDialog(
  title: const Text('删除这条记录？'),
  content: const Text('删除后无法恢复。'),
  actions: [
    TextButton(
      onPressed: () => Navigator.pop(context),
      child: const Text('取消'),
    ),
    FilledButton(
      onPressed: () { /* 删 */ },
      child: const Text('删除'),
    ),
  ],
)`,
      },
    ],
    related: ['filled-button', 'outlined-button'],
  },

  {
    slug: 'icon-button',
    name: 'IconButton',
    title: '图标按钮',
    summary: '只有一个图标的按钮，自带 48×48 的点击区域。',
    category: 'general',
    tags: ['button', '图标', 'icon', '关闭'],
    highlights: [
      '自带最小触摸区域，不会因图标小而点不到 —— 别自己用 GestureDetector 包 Icon',
      '务必传 tooltip：无障碍和桌面端悬停提示都靠它',
      'tooltip 也是屏幕阅读器唯一的描述来源',
    ],
    whenToUse: {
      do: ['AppBar 右侧的操作', '列表项尾部的更多/删除', '对话输入框的附件按钮'],
      dont: [
        '用 Icon 加 GestureDetector 自己实现 —— 会丢掉 48dp 触摸区和涟漪效果',
        '没有任何文字提示的图标按钮放在关键路径上（用户猜不到含义）',
      ],
    },
    props: [
      { name: 'icon', type: 'Widget', required: true, desc: '图标本身，通常写 Icon(Icons.xxx)' },
      { name: 'onPressed', type: 'VoidCallback?', required: true, desc: '点击回调，传 null 即禁用' },
      {
        name: 'tooltip',
        type: 'String?',
        desc: '长按（移动端）或悬停（桌面端）显示的提示。也是无障碍标签，强烈建议总是传',
      },
      {
        name: 'iconSize',
        type: 'double?',
        def: '24',
        desc: '图标大小。注意改这个不会缩小触摸区域，触摸区域始终不小于 48',
      },
      {
        name: 'color',
        type: 'Color?',
        desc: '图标颜色。优先用 IconTheme 或主题取色，别硬编码 Colors.grey',
      },
      {
        name: 'style',
        type: 'ButtonStyle?',
        desc: 'M3 的外观覆盖，可用来改背景和形状（做「圆形底」的图标按钮）',
      },
    ],
    demos: [
      {
        title: 'AppBar 上的标准用法',
        note: '每个都带 tooltip，成本几乎为零，收益是「无障碍评分」和「桌面端体验」。',
        preview: 'live',
        code: `AppBar(
  title: const Text('订单详情'),
  actions: [
    IconButton(
      tooltip: '分享',
      icon: const Icon(Icons.ios_share),
      onPressed: () {},
    ),
    IconButton(
      tooltip: '更多',
      icon: const Icon(Icons.more_vert),
      onPressed: () {},
    ),
  ],
)`,
      },
      {
        title: '带圆形底的图标按钮',
        note: 'M3 里常见于图片右上角的关闭/收藏。用 style 给它一层表面色，比手动套 Container 干净。',
        preview: 'live',
        code: `IconButton(
  tooltip: '收藏',
  onPressed: () {},
  icon: const Icon(Icons.favorite_border),
  style: IconButton.styleFrom(
    backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
    foregroundColor: Theme.of(context).colorScheme.onSurfaceVariant,
  ),
)`,
      },
      {
        title: '禁用态',
        preview: 'live',
        code: `// onPressed 传 null，图标自动变灰
const IconButton(
  tooltip: '已提交，不能重复操作',
  onPressed: null,
  icon: Icon(Icons.lock_outline),
)`,
      },
    ],
    related: ['elevated-button', 'icon', 'chip'],
  },

  {
    slug: 'icon',
    name: 'Icon',
    title: '图标',
    summary: '画一个 Material 图标，是展示而非交互。',
    category: 'general',
    tags: ['图标', 'icon', '矢量'],
    highlights: [
      'MaterialIcons 字体里内置了 2000+ 图标，直接用 Icons.xxx 即可',
      '图标本质是字体，所以能用 fontSize / color 控制外观',
      '要点击行为就换成 IconButton，不要给 Icon 套 GestureDetector',
    ],
    props: [
      { name: 'IconData', type: 'IconData', required: true, desc: '图标数据，写 Icons.add 这样。这是第一个位置参数，不是命名参数' },
      {
        name: 'size',
        type: 'double?',
        def: '24',
        desc: '图标尺寸。不传则跟随 IconTheme（AppBar 里默认是 24）',
      },
      { name: 'color', type: 'Color?', desc: '颜色。不传则跟随 IconTheme，由主题决定' },
      {
        name: 'semanticLabel',
        type: 'String?',
        desc: '给屏幕阅读器读的说明。纯装饰性图标不用传，但「有含义」的图标必须传',
      },
      {
        name: 'textDirection',
        type: 'TextDirection?',
        desc: '图标本身不分方向，但某些图标（如箭头）在 RTL 语言下需要镜像',
      },
    ],
    demos: [
      {
        title: '基本用法与尺寸',
        preview: 'live',
        code: `Row(
  spacing: 16,
  children: [
    const Icon(Icons.star, size: 16),
    const Icon(Icons.star, size: 24),           // 默认尺寸
    const Icon(Icons.star, size: 36),
    Icon(Icons.star, size: 36, color: Colors.amber.shade600),
  ],
)`,
      },
      {
        title: '纯装饰图标要标记为无需朗读',
        note: 'excludeFromSemantics: true 告诉屏幕阅读器「跳过它」。图标本身没有文字含义时，不标记会让读屏用户听到一堆无意义的「图标」。',
        preview: 'none',
        code: `Row(
  children: [
    // 装饰性：跳过朗读
    const Icon(Icons.circle, size: 8, color: Colors.green),
    const SizedBox(width: 8),
    // 这样读屏只会读「在线」
    const Text('在线'),
  ],
)

// 或者用 ExcludeSemantics 包一层
const ExcludeSemantics(
  child: Icon(Icons.star, color: Colors.amber),
)`,
      },
    ],
    related: ['icon-button'],
  },

  {
    slug: 'text',
    name: 'Text',
    title: '文本',
    summary: '显示一段文字，是所有界面里出现频率最高的组件。',
    category: 'general',
    tags: ['文字', '文本', 'Text', '字号'],
    highlights: [
      '不传 style 时会继承 DefaultTextStyle（主题里的 bodyMedium）',
      '要「标题」效果优先用 Theme.of(context).textTheme.titleLarge，而不是自己写 fontSize: 20',
      'maxLines + overflow 是防文字撑爆布局的必备组合',
    ],
    props: [
      { name: 'data', type: 'String', required: true, desc: '要显示的文字。位置参数，写 Text(\'你好\')' },
      {
        name: 'style',
        type: 'TextStyle?',
        desc: '文字样式。只想改一部分（比如加粗）时用它；整体字号应该由主题决定',
      },
      {
        name: 'maxLines',
        type: 'int?',
        desc: '最多显示几行，超出部分按 overflow 处理。不设时文字会一直撑高',
      },
      {
        name: 'overflow',
        type: 'TextOverflow?',
        def: 'TextOverflow.clip',
        desc: '超出怎么办：ellipsis 打点、fade 淡出、visible 溢出显示。配合 maxLines 用',
      },
      {
        name: 'textAlign',
        type: 'TextAlign?',
        desc: '水平对齐。注意它需要「父容器给了确定宽度」才看得出来效果',
      },
      {
        name: 'softWrap',
        type: 'bool',
        def: 'true',
        desc: '不够宽时是否换行。设 false 相当于强制单行',
      },
      {
        name: 'textScaler',
        type: 'TextScaler?',
        desc: '用户系统字号放大时的缩放策略。默认跟随系统，一般不要覆盖',
      },
      {
        name: 'locale',
        type: 'Locale?',
        desc: '强制指定语言，影响断行规则。多语言 App 里偶尔需要',
      },
    ],
    demos: [
      {
        title: '用主题的字号阶梯，而不是自己写 fontSize',
        note: '这是「设计令牌」思路在文字上的体现。displayLarge / titleMedium / bodySmall 这套阶梯，全项目统一，改一处全站变。',
        preview: 'live',
        code: `final t = Theme.of(context).textTheme;

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: 8,
  children: [
    Text('页面大标题', style: t.headlineSmall),
    Text('区块标题', style: t.titleMedium),
    Text('正文内容，这是用户读得最多的部分。', style: t.bodyMedium),
    Text('辅助说明文字', style: t.bodySmall),
    Text('错误提示', style: t.bodySmall?.copyWith(color: Theme.of(context).colorScheme.error)),
  ],
)`,
      },
      {
        title: '单行截断（列表项必备）',
        note: '不写 maxLines + overflow，长标题会把布局撑坏或直接报 RenderFlex overflow。',
        preview: 'live',
        code: `SizedBox(
  width: 180,
  child: Text(
    '这是一个非常长的商品标题，长到一行放不下，需要截断',
    maxLines: 1,
    overflow: TextOverflow.ellipsis,   // 变成 "这是一个非常长的商品标..."
  ),
)

// 两行截断
const Text(
  '这是两行描述的示例，超出两行之后会打点。适合列表里的摘要。',
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
)`,
      },
      {
        title: '富文本：只让一部分变样式',
        note: 'Text.rich 把多个 TextSpan 拼成一段文字，它们会自然连排、正常换行 —— 比 Row 里塞两个 Text 好得多。',
        preview: 'live',
        code: `Text.rich(
  TextSpan(
    children: [
      const TextSpan(text: '支付金额 '),
      TextSpan(
        text: '¥128.00',
        style: const TextStyle(
          color: Color(0xfff56c6c),
          fontWeight: FontWeight.w600,
        ),
      ),
      const TextSpan(text: '，确认后不可撤销。'),
    ],
  ),
)`,
      },
    ],
    related: ['selectable-text', 'rich-text'],
  },

  {
    slug: 'divider',
    name: 'Divider',
    title: '分割线',
    summary: '一条水平或垂直的细线，用来区隔内容。',
    category: 'general',
    tags: ['分割线', 'divider', '分隔'],
    highlights: [
      '默认会撑满可用宽度，两侧各有 16 的内边距',
      '列表里用 ListView.separated 比手动插 Divider 更省事',
      'Divider 的 indent / endIndent 用来做「左侧留白」的分割线',
    ],
    props: [
      { name: 'height', type: 'double?', def: '16', desc: '分割线占据的总高度（含上下留白），不是线的粗细' },
      { name: 'thickness', type: 'double?', def: '0', desc: '线本身的厚度。0 表示用最细的 1 物理像素' },
      { name: 'indent', type: 'double', def: '0', desc: '左侧缩进。列表里做「和文字对齐」的效果很有用' },
      { name: 'endIndent', type: 'double', def: '0', desc: '右侧缩进' },
      { name: 'color', type: 'Color?', desc: '线的颜色，默认取主题的 outlineVariant' },
    ],
    demos: [
      {
        title: '三种常见形态',
        preview: 'live',
        code: `Column(
  children: [
    const Divider(),                             // 默认，两侧留白

    const Divider(height: 1),                    // 紧贴，适合列表内

    const Divider(
      height: 32,
      thickness: 2,
      indent: 16,
      endIndent: 16,
      color: Colors.black12,
    ),
  ],
)`,
      },
      {
        title: '列表分隔线：用 separated 而不是手写',
        note: 'ListView.separated 只会在「两项之间」插入分隔线，不会在最后一项后面多画一条 —— 手写很容易漏掉这个边界。',
        preview: 'live',
        code: `ListView.separated(
  shrinkWrap: true,
  itemCount: 5,
  separatorBuilder: (context, index) => const Divider(height: 1),
  itemBuilder: (context, index) => ListTile(
    title: Text('第 \${index + 1} 项'),
  ),
)`,
      },
    ],
    related: ['list-view', 'list-tile'],
  },

  {
    slug: 'card',
    name: 'Card',
    title: '卡片',
    summary: '带圆角和阴影的容器，把一组相关信息圈在一起。',
    category: 'general',
    tags: ['卡片', 'card', '容器', '阴影'],
    highlights: [
      '提供「这是一组信息」的视觉边界，本身不负责布局',
      'Card 里通常放 Padding + Column / Row',
      'M3 里 Card 有多种 variant：elevated（有阴影）、filled（纯色）、outlined（描边）',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '卡片内容。通常是一个 Padding' },
      {
        name: 'elevation',
        type: 'double?',
        def: '1',
        desc: '阴影高度。0 表示无阴影（配合 color 做纯色卡片）',
      },
      { name: 'color', type: 'Color?', desc: '卡片底色，默认取主题 surfaceContainerLow' },
      {
        name: 'margin',
        type: 'EdgeInsetsGeometry?',
        def: 'EdgeInsets.all(4)',
        desc: '卡片外间距。注意 Card 自带 4 的 margin，做成紧密排列时要手动清零',
      },
      { name: 'shape', type: 'ShapeBorder?', desc: '圆角形状，默认 RoundedRectangleBorder(12)' },
      {
        name: 'clipBehavior',
        type: 'Clip',
        def: 'Clip.none',
        desc: '内容超出圆角时是否裁剪。放图片时必须设成 Clip.antiAlias，否则图片会盖住圆角',
      },
    ],
    demos: [
      {
        title: '最常见的商品/文章卡片',
        preview: 'live',
        code: `Card(
  clipBehavior: Clip.antiAlias,   // ★ 图片超出圆角时必须加
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 顶部图片
      Container(height: 120, color: Colors.blue.shade100, width: double.infinity),

      Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 6,
          children: [
            const Text('商品标题', style: TextStyle(fontWeight: FontWeight.w600)),
            Text(
              '这是商品的一句话描述，太长的话会截断。',
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ],
        ),
      ),
    ],
  ),
)`,
      },
      {
        title: '纯色卡片（无阴影，靠底色区分）',
        note: '阴影多了页面会显得脏。内容密集的页面用「填充色」比「阴影」更干净。',
        preview: 'live',
        code: `Card(
  elevation: 0,
  color: Theme.of(context).colorScheme.surfaceContainerHighest,
  child: const Padding(
    padding: EdgeInsets.all(16),
    child: Text('这是一块提示区域'),
  ),
)`,
      },
    ],
    related: ['container', 'list-tile', 'ink-well'],
  },

  {
    slug: 'container',
    name: 'Container',
    title: '容器',
    summary: '能设宽高、内外边距、背景、边框、圆角的万能盒子。',
    category: 'general',
    tags: ['容器', 'container', '盒子', '背景'],
    highlights: [
      '功能最多也最容易滥用 —— 只做一件事的容器性能更好',
      '只加内边距 → 用 Padding；只加外间距 → 用 SizedBox 或 Padding',
      '只设 background → 用 ColoredBox；只设宽高 → 用 SizedBox',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '子组件' },
      { name: 'width', type: 'double?', desc: '宽度。不传则由 child 决定' },
      { name: 'height', type: 'double?', desc: '高度。不传则由 child 决定' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '内边距（在边框之内）' },
      { name: 'margin', type: 'EdgeInsetsGeometry?', desc: '外间距（在边框之外）' },
      {
        name: 'decoration',
        type: 'Decoration?',
        desc: '背景、边框、圆角、阴影。设了它就不能再设 color —— 颜色要写进 decoration 里，两者同时写会报错',
      },
      { name: 'alignment', type: 'AlignmentGeometry?', desc: 'child 在容器内的位置。想居中就写 Alignment.center' },
      { name: 'constraints', type: 'BoxConstraints?', desc: '最小/最大宽高。比 width/height 更灵活' },
    ],
    demos: [
      {
        title: '基础：一只有样式的盒子',
        preview: 'live',
        code: `Container(
  padding: const EdgeInsets.all(16),
  margin: const EdgeInsets.symmetric(vertical: 8),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Colors.black12),
  ),
  child: const Text('内容'),
)`,
      },
      {
        title: '什么时候不该用 Container',
        note: 'Container 是一个「组合组件」，里面套了好几层。只做一件事时用更轻的组件，列表滚动时的性能差异会累积起来。',
        preview: 'none',
        code: `// 不要：只想加内边距
Container(padding: const EdgeInsets.all(16), child: child)

// 应该：
Padding(padding: const EdgeInsets.all(16), child: child)

// 不要：只想加个背景色
Container(color: Colors.red, child: child)

// 应该：
ColoredBox(color: Colors.red, child: child)

// 不要：只想固定宽高
Container(width: 100, height: 100, child: child)

// 应该：
SizedBox(width: 100, height: 100, child: child)`,
      },
      {
        title: '渐变背景',
        note: '渐变必须走 decoration —— Container 没有 gradient 参数。',
        preview: 'live',
        code: `Container(
  height: 100,
  decoration: const BoxDecoration(
    gradient: LinearGradient(
      colors: [Color(0xff409eff), Color(0xff67c23a)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    borderRadius: BorderRadius.all(Radius.circular(12)),
  ),
  alignment: Alignment.center,
  child: const Text('渐变卡片', style: TextStyle(color: Colors.white)),
)`,
      },
    ],
    related: ['card', 'sized-box', 'padding'],
  },

  {
    slug: 'sized-box',
    name: 'SizedBox',
    title: '尺寸盒',
    summary: '只给一个固定尺寸或一个间距，是最轻量的布局组件。',
    category: 'general',
    tags: ['尺寸', '间距', 'sizedbox', '占位', 'space'],
    highlights: [
      '最常见的用途是「占位间距」：SizedBox(height: 12)',
      '比 Container 轻得多 —— 列表里差别明显',
      '不传 child 时它就是一个透明的空隙',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '子组件。不传就是纯占位' },
      { name: 'width', type: 'double?', desc: '宽度；child 会被强制约束到此宽度' },
      { name: 'height', type: 'double?', desc: '高度' },
    ],
    demos: [
      {
        title: '替代「写死间距」的几种写法',
        note: 'Column / Row 从 Flutter 3.27 起支持 spacing 参数，垂直排列时优先用它，比插一堆 SizedBox 干净。',
        preview: 'live',
        code: `// ✅ 推荐：Column 自带 spacing
Column(
  spacing: 12,   // 每两项之间 12
  children: [
    Text('第一行'),
    Text('第二行'),
    Text('第三行'),
  ],
)

// 也可以用 SizedBox 手动隔开（需要对个别间距做差异化时）
Column(
  children: [
    Text('第一行'),
    const SizedBox(height: 24),   // 这一处特别大
    Text('第二行'),
  ],
)`,
      },
      {
        title: '把子组件撑成正方形',
        note: 'width 和 height 同时给，child 就会被强约束成这个尺寸 —— 做头像框这类很常用。',
        preview: 'live',
        code: `SizedBox(
  width: 64,
  height: 64,
  child: ClipOval(
    child: ColoredBox(
      color: Colors.blue.shade100,
      child: const Icon(Icons.person, size: 32),
    ),
  ),
)`,
      },
    ],
    related: ['container', 'padding', 'row', 'column'],
  },
];
