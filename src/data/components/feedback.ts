import type { ComponentDoc } from '../types';

/** 反馈：SnackBar / AlertDialog / ProgressIndicator / Tooltip / RefreshIndicator */
export const feedbackComponents: ComponentDoc[] = [
  {
    slug: 'snack-bar',
    name: 'SnackBar',
    title: '轻提示',
    summary: '从底部滑出的一条短暂提示，几秒后自动消失。',
    category: 'feedback',
    tags: ['提示', 'snackbar', 'toast', '轻提示', '操作反馈'],
    highlights: [
      '必须通过 ScaffoldMessenger.of(context).showSnackBar 调用',
      '用 ScaffoldMessenger 而非 Scaffold 的旧 API —— 前者能在页面切换后继续显示',
      '不要用它显示「重要错误」—— 几秒就消失了，用户可能没看到。重要的用 AlertDialog',
    ],
    whenToUse: {
      do: ['操作成功了（"已保存"）', '带「撤销」的轻量操作', '不阻塞用户的提示'],
      dont: ['需要用户确认的信息', '错误详情（会被截断且来不及读）', '需要用户做出选择的场景'],
    },
    props: [
      { name: 'content', type: 'Widget', required: true, desc: '提示内容，通常是一个 Text' },
      { name: 'duration', type: 'Duration', def: '4 秒', desc: '显示时长。带 action 的至少给 5 秒，否则用户来不及点' },
      { name: 'action', type: 'SnackBarAction?', desc: '右下角的操作按钮，比如「撤销」' },
      { name: 'behavior', type: 'SnackBarBehavior?', def: 'fixed', desc: 'fixed 会占满宽度并顶起底部组件；floating 是浮起来的圆角条，观感更好' },
      { name: 'backgroundColor', type: 'Color?', desc: '底色。错误提示常用 error 色' },
      { name: 'showCloseIcon', type: 'bool', def: 'false', desc: '是否显示右侧关闭按钮' },
      { name: 'margin', type: 'EdgeInsetsGeometry?', desc: 'floating 模式下的外边距' },
      { name: 'width', type: 'double?', desc: '固定宽度。设了它会自动变成 floating 行为' },
    ],
    demos: [
      {
        title: '基础用法与两种行为',
        preview: 'live',
        code: `// 固定贴底（默认）
ScaffoldMessenger.of(context).showSnackBar(
  const SnackBar(content: Text('已保存')),
)

// 浮动圆角（推荐，观感更好）
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: const Text('已添加到购物车'),
    behavior: SnackBarBehavior.floating,
    margin: const EdgeInsets.all(16),
    duration: const Duration(seconds: 2),
  ),
)`,
      },
      {
        title: '带「撤销」的操作（最典型的用法）',
        note: '「删除后给 5 秒后悔时间」是移动端很成熟的模式。注意 duration 要给长一点，否则用户来不及点。',
        preview: 'live',
        code: `void _deleteItem(int id) {
  // ① 先从 UI 上移除（乐观更新）
  setState(() => _items.removeWhere((e) => e.id == id));

  // ② 给出撤销机会
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: const Text('已删除'),
      duration: const Duration(seconds: 5),        // ★ 给够时间
      behavior: SnackBarBehavior.floating,
      action: SnackBarAction(
        label: '撤销',
        onPressed: () {
          setState(() => _items.insert(0, removed));   // 恢复
        },
      ),
    ),
  );
}`,
      },
      {
        title: '成功 / 失败用不同颜色',
        note: '把「发提示」封装成一个方法，比每次写一长串 showSnackBar 好维护。',
        preview: 'live',
        code: `void showToast(BuildContext context, String msg, {bool error = false}) {
  final scheme = Theme.of(context).colorScheme;
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(msg),
      behavior: SnackBarBehavior.floating,
      margin: const EdgeInsets.all(16),
      backgroundColor: error ? scheme.error : const Color(0xff2c3038),
      duration: Duration(seconds: error ? 3 : 2),
    ),
  );
}

// 用
showToast(context, '保存成功');
showToast(context, '网络异常，请重试', error: true);`,
      },
      {
        title: '连续弹提示时先清掉上一个',
        note: '不 clear 的话它们会排队一条条播 —— 用户快速点五次会看到五条提示慢慢播完，很怪。',
        preview: 'live',
        code: `// 先清空队列，再显示新的
ScaffoldMessenger.of(context)
  ..clearSnackBars()
  ..showSnackBar(const SnackBar(content: Text('新的提示')));`,
      },
    ],
    related: ['alert-dialog', 'tooltip', 'banner'],
  },

  {
    slug: 'alert-dialog',
    name: 'AlertDialog',
    title: '对话框',
    summary: '居中弹出的模态窗口，需要用户看完并做出回应。',
    category: 'feedback',
    tags: ['对话框', 'dialog', '弹窗', '确认', '模态'],
    highlights: [
      '模态：弹出时用户不能操作背后的内容。这是它和 SnackBar 的根本区别',
      '必须提供至少一条出路（确定 / 取消 / 关闭），否则用户会卡住',
      '危险操作（删除）要把「确认」按钮做成红色',
    ],
    whenToUse: {
      do: ['重要且不可逆的操作前确认', '需要用户输入才能继续', '必须让用户知道的信息'],
      dont: ['只是通知一句（用 SnackBar）', '展示大量内容（用新页面）', '频繁弹出（用户会烦，且体验被打断）'],
    },
    props: [
      { name: 'title', type: 'Widget?', desc: '标题。用一句话说清「要干什么」' },
      { name: 'content', type: 'Widget?', desc: '正文。危险操作的后果要在这里说清楚' },
      { name: 'actions', type: 'List<Widget>', desc: '底部按钮列表。通常放 TextButton（取消）和 FilledButton（确认）' },
      { name: 'barrierDismissible', type: 'bool', def: 'true', desc: '点遮罩是否关闭。危险操作建议设 false，防止误触关掉' },
      { name: 'actionsAlignment', type: 'MainAxisAlignment?', desc: '按钮的对齐方式。默认靠右' },
      { name: 'actionsOverflowDirection', type: 'VerticalDirection?', desc: '按钮放不下时怎么换行' },
      { name: 'insetPadding', type: 'EdgeInsetsGeometry?', def: '40', desc: '对话框距离屏幕边缘的最小距离' },
    ],
    demos: [
      {
        title: '确认对话框（标准写法）',
        note: '注意 await 的返回值 —— showDialog 是 Future<T?>，点了遮罩关闭会返回 null。所以判断要写 if (ok == true) 而不是 if (ok)。',
        preview: 'live',
        code: `Future<void> _confirmDelete(BuildContext context) async {
  final ok = await showDialog<bool>(
    context: context,
    // 危险操作，禁止点遮罩关闭
    barrierDismissible: false,
    builder: (context) => AlertDialog(
      title: const Text('删除这条记录？'),
      content: const Text('删除后无法恢复，该记录的所有附件也会一并删除。'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('取消'),
        ),
        FilledButton(
          style: FilledButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
          onPressed: () => Navigator.pop(context, true),
          child: const Text('删除'),
        ),
      ],
    ),
  );

  // ★ 必须和 true 比较：点遮罩关闭时 ok 是 null
  if (ok == true) {
    // 执行删除
  }
}`,
      },
      {
        title: '对话框里带输入框',
        note: '让用户输入才能继续的场景。注意 controller 要在 builder 外创建，否则每次重建都会丢输入内容。',
        preview: 'live',
        code: `Future<String?> _askName(BuildContext context) async {
  final controller = TextEditingController();      // ★ 建在外面
  try {
    return await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('新建文件夹'),
        content: TextField(
          controller: controller,
          autofocus: true,                              // 自动聚焦，省一次点击
          decoration: const InputDecoration(
            hintText: '请输入名称',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (v) => Navigator.pop(context, v),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('创建'),
          ),
        ],
      ),
    );
  } finally {
    controller.dispose();                            // ★ 释放
  }
}`,
      },
      {
        title: '用 SafeArea 包一下（小屏 / 横屏会溢出）',
        note: '横屏时对话框可能比屏幕还高，直接报 overflow。官方推荐的做法是外面套 SafeArea + SingleChildScrollView。',
        preview: 'none',
        code: `showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: const Text('很长的一段说明'),
    content: const SingleChildScrollView(            // ★ 内容可滚
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [ /* 很多内容 */ ],
      ),
    ),
    actions: [ /* ... */ ],
  ),
)`,
      },
    ],
    related: ['snack-bar', 'bottom-sheet', 'dialog'],
  },

  {
    slug: 'circular-progress-indicator',
    name: 'CircularProgressIndicator',
    title: '圆形进度',
    summary: '转圈的加载指示器，用于「不知道要多久」的场景。',
    category: 'feedback',
    tags: ['加载', 'loading', '进度', '转圈', 'spinner'],
    highlights: [
      '有两种模式：value 为 null 时是不确定的转圈；给了 0~1 的值就是确定的进度环',
      '不要在 build 里无条件放一个转圈 —— 加载很快时它会闪一下，比不加还难看',
      '加载超过 300ms 才显示，这个技巧能显著提升「感觉上的速度」',
    ],
    props: [
      { name: 'value', type: 'double?', desc: '进度值 0.0~1.0。null 表示「不确定进度」，会一直转' },
      { name: 'strokeWidth', type: 'double', def: '4.0', desc: '圆环的粗细' },
      { name: 'color', type: 'Color?', desc: '圆环颜色' },
      { name: 'backgroundColor', type: 'Color?', desc: '圆环底部的轨道颜色。只有确定进度模式下才看得出来' },
      { name: 'semanticsLabel', type: 'String?', desc: '无障碍标签，会朗读出来' },
      { name: 'strokeCap', type: 'StrokeCap?', def: 'round', desc: '线帽样式' },
    ],
    demos: [
      {
        title: '两种模式',
        preview: 'live',
        code: `// ① 不确定进度：转圈，不知道什么时候结束
const SizedBox(
  width: 32, height: 32,
  child: CircularProgressIndicator(strokeWidth: 3),
)

// ② 确定进度：0~1 的值，画出进度环
CircularProgressIndicator(
  value: 0.65,
  strokeWidth: 6,
  backgroundColor: Colors.grey.shade200,
)`,
      },
      {
        title: '延迟显示：解决「闪一下」的问题',
        note: '这是体感优化的关键技巧。本地请求 50ms 就回来了，如果立刻显示转圈，用户会看到一闪而过 —— 反而像是页面卡了一下。',
        preview: 'live',
        code: `class _DelayedLoading extends StatefulWidget {
  const _DelayedLoading();
  @override
  State<_DelayedLoading> createState() => _DelayedLoadingState();
}

class _DelayedLoadingState extends State<_DelayedLoading> {
  Timer? _timer;
  bool _show = false;

  @override
  void initState() {
    super.initState();
    // 300ms 后才显示。如果在此之前就加载完了，转圈根本不会出现
    _timer = Timer(const Duration(milliseconds: 300), () {
      if (mounted) setState(() => _show = true);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_show) return const SizedBox.shrink();     // 或返回骨架屏
    return const Center(child: CircularProgressIndicator());
  }
}`,
      },
      {
        title: '按钮里的加载态',
        note: '按钮内加载要固定尺寸，否则按钮会随状态变化而跳动。',
        preview: 'live',
        code: `FilledButton(
  onPressed: _loading ? null : _submit,
  child: _loading
      // ★ 固定 18×18，和文字行高接近，按钮宽度不会跳
      ? const SizedBox(
          width: 18, height: 18,
          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
        )
      : const Text('提交'),
)`,
      },
    ],
    related: ['linear-progress-indicator', 'skeleton', 'snack-bar'],
  },

  {
    slug: 'linear-progress-indicator',
    name: 'LinearProgressIndicator',
    title: '线性进度',
    summary: '一条横向的进度条，适合放在列表顶部或页面顶端。',
    category: 'feedback',
    tags: ['进度条', 'progress', 'linear', '加载'],
    highlights: [
      '空间占用小，适合「页面级加载」——放在 AppBar 下面一条',
      '确定进度时能给出「还剩多少」的心理预期，比转圈好',
      '多个异步任务并行时，用不确定进度更诚实',
    ],
    props: [
      { name: 'value', type: 'double?', desc: '0.0~1.0。null 表示不确定进度' },
      { name: 'minHeight', type: 'double', def: '4.0', desc: '进度条高度' },
      { name: 'color', type: 'Color?', desc: '已完成部分的颜色' },
      { name: 'backgroundColor', type: 'Color?', desc: '未完成部分的底色' },
      { name: 'borderRadius', type: 'BorderRadius?', desc: '圆角' },
      { name: 'semanticsLabel', type: 'String?', desc: '无障碍标签' },
    ],
    demos: [
      {
        title: '页面顶部的加载条',
        note: '这是最常见的用法：内容还在加载时，顶上一条细线，内容是骨架或旧数据。',
        preview: 'live',
        code: `Column(
  children: [
    // 加载中就在顶部显示一条
    if (_loading)
      const LinearProgressIndicator(minHeight: 2),

    const SizedBox(height: 20),

    // 下面放内容
    const Text('页面内容'),
  ],
)`,
      },
      {
        title: '带百分比的确定进度',
        preview: 'live',
        code: `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: 8,
  children: [
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: const [
        Text('正在上传'),
        Text('65%'),
      ],
    ),
    LinearProgressIndicator(
      value: 0.65,
      minHeight: 8,
      borderRadius: BorderRadius.circular(4),
      backgroundColor: const Color(0xffe4e7ed),
    ),
  ],
)`,
      },
    ],
    related: ['circular-progress-indicator', 'skeleton'],
  },

  {
    slug: 'tooltip',
    name: 'Tooltip',
    title: '提示气泡',
    summary: '长按或悬停时弹出的小气泡，解释这个元素是干什么的。',
    category: 'feedback',
    tags: ['提示', 'tooltip', '悬停', '气泡'],
    highlights: [
      '移动端是「长按」触发，桌面端是「悬停」——两端都覆盖到了',
      '图标按钮的 tooltip 参数就是包了一层 Tooltip',
      'tooltip 文字也是无障碍标签，别只把它当视觉提示',
    ],
    props: [
      { name: 'message', type: 'String?', desc: '气泡里显示的文字' },
      { name: 'child', type: 'Widget', required: true, desc: '被提示的组件' },
      { name: 'preferBelow', type: 'bool', def: 'true', desc: '优先显示在下方。上方空间不够时会自动翻转' },
      { name: 'waitDuration', type: 'Duration', def: '0ms', desc: '悬停多久才显示。桌面端可以设 500ms 避免误触' },
      { name: 'showDuration', type: 'Duration', def: '1.5s', desc: '显示多久后自动消失' },
      { name: 'triggerMode', type: 'TooltipTriggerMode?', def: 'longPress', desc: '移动端的触发方式：longPress 或 tap' },
      { name: 'decoration', type: 'Decoration?', desc: '气泡外观，可以自定义颜色和圆角' },
      { name: 'textStyle', type: 'TextStyle?', desc: '文字样式' },
    ],
    demos: [
      {
        title: '基础用法',
        note: '移动端要长按才出来 —— 所以别把「必须看到的信息」只放在 tooltip 里。',
        preview: 'live',
        code: `Tooltip(
  message: '这是删除按钮，点了之后无法恢复',
  child: IconButton(
    icon: const Icon(Icons.delete_outline),
    onPressed: () {},
  ),
)

// 桌面端：悬停 500ms 才显示，避免鼠标划过时乱弹
Tooltip(
  message: '导出数据',
  waitDuration: const Duration(milliseconds: 500),
  child: const Icon(Icons.file_download_outlined),
)`,
      },
      {
        title: '自定义外观',
        preview: 'live',
        code: `Tooltip(
  message: '自定义样式的提示',
  decoration: BoxDecoration(
    color: const Color(0xff2c3038),
    borderRadius: BorderRadius.circular(8),
  ),
  textStyle: const TextStyle(color: Colors.white, fontSize: 12),
  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
  child: const Icon(Icons.info_outline),
)`,
      },
    ],
    related: ['icon-button', 'snack-bar'],
  },

  {
    slug: 'refresh-indicator',
    name: 'RefreshIndicator',
    title: '下拉刷新',
    summary: '下拉时出现转圈，松手触发刷新。',
    category: 'feedback',
    tags: ['下拉刷新', 'refresh', '刷新', 'pull'],
    highlights: [
      '必须包在一个可滚动组件外面，且这个组件要能响应下拉手势',
      'onRefresh 返回的 Future 决定转圈什么时候停 —— 这就是为什么它必须是 async',
      '列表内容不足一屏时下拉不动，需要给 scroll 加 AlwaysScrollableScrollPhysics',
    ],
    props: [
      { name: 'onRefresh', type: 'RefreshCallback', required: true, desc: '刷新回调。返回的 Future 完成时转圈才消失 —— 必须真的 await 你的请求' },
      { name: 'child', type: 'Widget', required: true, desc: '被包的可滚动组件，通常是 ListView' },
      { name: 'color', type: 'Color?', desc: '转圈的颜色' },
      { name: 'backgroundColor', type: 'Color?', desc: '转圈背景色' },
      { name: 'displacement', type: 'double', def: '40.0', desc: '转圈距离顶部的距离' },
      { name: 'notificationPredicate', type: 'ScrollNotificationPredicate', desc: '判断是否响应滚动通知。嵌套滚动时需要配置' },
    ],
    demos: [
      {
        title: '列表下拉刷新',
        note: 'onRefresh 里必须 await 真正的加载，否则转圈会立刻消失，用户以为没刷新。',
        preview: 'none',
        code: `RefreshIndicator(
  onRefresh: () async {
    // ★ 必须 await 到数据真的回来
    await ref.read(listProvider.notifier).reload();
  },
  child: ListView.builder(
    // ★ 内容不足一屏时也能下拉
    physics: const AlwaysScrollableScrollPhysics(),
    itemCount: items.length,
    itemBuilder: (context, i) => ListTile(title: Text(items[i].name)),
  ),
)`,
      },
      {
        title: '下拉刷新 + 上拉加载更多',
        note: '这是列表页的标准组合。注意「加载更多」要用 ScrollController 监听，不能也靠 RefreshIndicator。',
        preview: 'none',
        code: `class _ListPageState extends State<_ListPage> {
  final _scroll = ScrollController();
  bool _loadingMore = false;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
  }

  void _onScroll() {
    // 距离底部 200 像素时触发加载更多
    if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_loadingMore || !hasMore) return;
    setState(() => _loadingMore = true);
    try {
      await api.loadMore();
    } finally {
      if (mounted) setState(() => _loadingMore = false);
    }
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _reload,
      child: ListView.builder(
        controller: _scroll,
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: items.length + 1,      // +1 给底部的加载提示
        itemBuilder: (context, i) {
          if (i == items.length) {
            // 最后一项是「加载更多」的提示
            return _loadingMore
                ? const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(child: CircularProgressIndicator()),
                  )
                : const SizedBox(height: 40);
          }
          return ListTile(title: Text(items[i].name));
        },
      ),
    );
  }
}`,
      },
    ],
    related: ['list-view', 'circular-progress-indicator', 'single-child-scroll-view'],
  },

  {
    slug: 'bottom-sheet',
    name: 'BottomSheet',
    title: '底部弹层',
    summary: '从屏幕底部滑出的面板，用于「选择」「确认」这类不必离开当前页面的交互。',
    category: 'feedback',
    tags: ['底部弹层', 'bottomsheet', '弹层', '选择器'],
    highlights: [
      '移动端比对话框更顺手 —— 拇指能够到底部',
      '用 showModalBottomSheet 做临时选择；Scaffold 的 bottomSheet 做常驻面板',
      '内容较长时要设 isScrollControlled + DraggableScrollableSheet',
    ],
    props: [
      { name: 'context', type: 'BuildContext', required: true, desc: '用于定位与主题' },
      { name: 'builder', type: 'WidgetBuilder', required: true, desc: '构建面板内容' },
      { name: 'isScrollControlled', type: 'bool', def: 'false', desc: '为 true 时面板可以超过屏幕一半高度。内容多时必须开' },
      { name: 'isDismissible', type: 'bool', def: 'true', desc: '点遮罩是否关闭' },
      { name: 'enableDrag', type: 'bool', def: 'true', desc: '能否向下拖动关闭' },
      { name: 'showDragHandle', type: 'bool', def: 'false', desc: '顶部是否显示一条拖拽指示条（M3 推荐开）' },
      { name: 'shape', type: 'ShapeBorder?', desc: '顶部圆角' },
      { name: 'backgroundColor', type: 'Color?', desc: '面板底色' },
      { name: 'useSafeArea', type: 'bool', def: 'false', desc: '是否避开刘海与手势条' },
    ],
    demos: [
      {
        title: '选择器（最典型用法）',
        note: '每项都要能点关闭 —— 否则用户选完还得自己找关闭方式。',
        preview: 'live',
        code: `Future<void> _pickSort(BuildContext context) async {
  final result = await showModalBottomSheet<String>(
    context: context,
    showDragHandle: true,                  // M3 推荐的拖拽条
    builder: (context) => SafeArea(
      child: Column(
        mainAxisSize: MainAxisSize.min,    // ★ 只占内容高度
        children: [
          ListTile(title: const Text('排序方式', style: TextStyle(fontWeight: FontWeight.w600))),
          const Divider(height: 1),
          ...[
            ('综合排序', 'default'),
            ('价格从低到高', 'price_asc'),
            ('销量优先', 'sales'),
          ].map((e) => ListTile(
            title: Text(e.\$1),
            trailing: _sort == e.\$2 ? const Icon(Icons.check) : null,
            onTap: () => Navigator.pop(context, e.\$2),
          )),
        ],
      ),
    ),
  );

  if (result != null) setState(() => _sort = result);
}`,
      },
      {
        title: '内容较多：可拖拽调整高度',
        note: 'isScrollControlled + DraggableScrollableSheet 是内容多时的官方组合。给用户一个「拖上来展开」的能力。',
        preview: 'none',
        code: `showModalBottomSheet(
  context: context,
  isScrollControlled: true,              // ★ 允许超过半屏
  showDragHandle: true,
  builder: (context) => DraggableScrollableSheet(
    initialChildSize: 0.6,               // 初始占 60% 高度
    minChildSize: 0.3,
    maxChildSize: 0.95,
    expand: false,
    builder: (context, scrollController) => ListView.builder(
      controller: scrollController,      // ★ 必须传，否则拖拽和滚动会打架
      itemCount: 30,
      itemBuilder: (context, i) => ListTile(title: Text('选项 \$i')),
    ),
  ),
)`,
      },
    ],
    related: ['alert-dialog', 'snack-bar', 'list-tile'],
  },
];
