import type { ComponentDoc } from '../types';

/**
 * 数据展示类组件
 *
 * 这个分类的组件共同点是：它们不收集输入、不触发动作，
 * 只负责「把已经存在的数据画成用户能看懂的样子」。
 * 所以这里的坑几乎全在「数据多了怎么办」和「数据还没来怎么办」。
 */
export const displayComponents: ComponentDoc[] = [
  {
    slug: 'list-view',
    name: 'ListView',
    title: '滚动列表',
    summary: '最常用的长列表容器。ListView.builder 只构建屏幕上可见的那几项，一万条数据也不会卡。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['列表', '滚动', 'list', 'scroll', 'builder'],
    highlights: [
      'ListView.builder 懒加载，只构建可见项，内存占用与列表长度无关',
      'ListView.separated 自带分隔线，比手写 Divider 更省事',
      'children 版本一次性构建全部子项，只适合写死的短列表',
    ],
    whenToUse: {
      do: [
        '列表项数量不确定或可能很多 —— 一律用 .builder',
        '数据来自接口分页 —— 配合 ScrollController 监听触底加载下一页',
        '需要分组标题 —— 用 CustomScrollView + SliverList，或用 package:sticky_headers',
      ],
      dont: [
        '把 ListView 直接放进 Column —— 高度无限，必报 unbounded height',
        '用 shrinkWrap: true 包一个很长的列表 —— 这会让懒加载彻底失效',
      ],
    },
    notes:
      'ListView 本质是 ScrollView 的子类，它的 itemBuilder 会在滚动时反复调用。' +
      '所以 itemBuilder 里不要做重活（网络请求、大对象构造），否则滚动会掉帧。',
    props: [
      { name: 'itemCount', type: 'int?', desc: '列表项总数，必须给准确值，多了会报越界、少了显示不全' },
      { name: 'itemBuilder', type: 'Widget Function(BuildContext, int)', required: true, desc: '根据下标构建单项，index 从 0 开始' },
      { name: 'separatorBuilder', type: 'Widget Function(BuildContext, int)', desc: '仅 ListView.separated 有，在第 index 项与第 index+1 项之间插入' },
      { name: 'scrollDirection', type: 'Axis', def: 'Axis.vertical', desc: '改成 horizontal 变横向列表' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '列表整体内边距，比在外面套 Padding 更省一层 widget' },
      { name: 'physics', type: 'ScrollPhysics?', desc: '滚动物理效果；NeverScrollableScrollPhysics 用于禁用自身滚动' },
      { name: 'shrinkWrap', type: 'bool', def: 'false', desc: '让 ListView 按内容高度收缩；开了就失去懒加载，谨慎' },
      { name: 'controller', type: 'ScrollController?', desc: '监听滚动位置、触底加载、回到顶部都靠它' },
    ],
    demos: [
      {
        title: '基础用法：为什么必须用 .builder',
        note: 'ListView(children: [...]) 会一次性构建全部 1000 项；.builder 只构建屏幕上的约 8 项。',
        code: `// ❌ 1000 项全部构建，启动时明显卡顿
ListView(
  children: List.generate(1000, (i) => ListTile(title: Text('第 \$i 项'))),
)

// ✅ 只构建可见的项，滚到哪构建到哪
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      leading: CircleAvatar(child: Text(item.name[0])),
      title: Text(item.name),
      subtitle: Text(item.subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => openDetail(item),
    );
  },
)`,
        preview: 'none',
      },
      {
        title: '带分隔线与自定义内边距',
        note: 'separated 的 separatorBuilder 会在第 index 项后面插一个 widget，所以最后一项后面不会多出一条线。',
        code: `ListView.separated(
  padding: const EdgeInsets.symmetric(vertical: 8),
  itemCount: orders.length,
  separatorBuilder: (_, __) => const Divider(height: 1, indent: 72),
  itemBuilder: (context, index) => OrderTile(order: orders[index]),
)`,
        preview: 'none',
      },
      {
        title: '触底加载下一页',
        note: '关键点有两个：一是 -40 的缓冲（提前一点开始加载，别等完全到底），二是 _isLoading 守卫（防止同一页重复请求）。',
        code: `class OrderListPage extends StatefulWidget {
  const OrderListPage({super.key});
  @override
  State<OrderListPage> createState() => _OrderListPageState();
}

class _OrderListPageState extends State<OrderListPage> {
  final _controller = ScrollController();
  final _orders = <Order>[];
  var _page = 1;
  var _isLoading = false;
  var _hasMore = true;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onScroll);
    _loadMore();
  }

  @override
  void dispose() {
    // 手动加的 listener 一定要在 dispose 里解绑，否则 controller 被释放后
    // 回调仍可能触发，报 "setState() called after dispose()"
    _controller.removeListener(_onScroll);
    _controller.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isLoading || !_hasMore) return;
    final threshold = _controller.position.maxScrollExtent - 40;
    if (_controller.position.pixels >= threshold) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    setState(() => _isLoading = true);
    final next = await api.fetchOrders(page: _page);
    if (!mounted) return;
    setState(() {
      _orders.addAll(next);
      _page++;
      _isLoading = false;
      _hasMore = next.isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      itemCount: _orders.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _orders.length) {
          return const Padding(
            padding: EdgeInsets.all(16),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        return OrderTile(order: _orders[index]);
      },
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['list-tile', 'single-child-scroll-view', 'sized-box', 'refresh-indicator'],
  },

  {
    slug: 'list-tile',
    name: 'ListTile',
    title: '列表项',
    summary: 'Material 规定好版式的标准列表行：一左一右两个槽位，中间标题+副标题。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['列表项', 'list', 'tile', 'cell'],
    highlights: [
      'leading / title / subtitle / trailing 四个槽位已经对齐好，不需要自己调间距',
      '点击水波纹、无障碍语义、48dp 最小高度都自动满足',
      'onTap 为空时不会渲染水波纹 —— 这正好用来区分「可点」和「不可点」',
    ],
    whenToUse: {
      do: [
        '设置项、消息列表、搜索建议这类「一行一个条目」的场景',
        '需要在行尾接一个开关/箭头 —— 直接塞进 trailing',
        '需要三行版式 —— isThreeLine: true 配合 subtitle 换行',
      ],
      dont: [
        '需要展示很复杂的内容（多张图 + 多个按钮）—— 用 Card + 自定义 Row 更自由',
        '列表需要多项选择 —— 用 CheckboxListTile / RadioListTile 变体',
      ],
    },
    props: [
      { name: 'leading', type: 'Widget?', desc: '左侧：图标、头像、复选框' },
      { name: 'title', type: 'Widget?', desc: '主标题，通常一行文字' },
      { name: 'subtitle', type: 'Widget?', desc: '副标题，字号更小、颜色更灰' },
      { name: 'trailing', type: 'Widget?', desc: '右侧：箭头、开关、金额' },
      { name: 'onTap', type: 'VoidCallback?', desc: '点击回调；为 null 则整行不可点、无涟漪' },
      { name: 'onLongPress', type: 'GestureLongPressCallback?', desc: '长按回调，常用于弹出上下文菜单' },
      { name: 'isThreeLine', type: 'bool', def: 'false', desc: '允许 subtitle 折成两行，总高度变 88' },
      { name: 'dense', type: 'bool', def: 'false', desc: '紧凑版，高度降到 48，适合信息密度高的列表' },
      { name: 'enabled', type: 'bool', def: 'true', desc: '设为 false 整行变灰并禁用点击' },
    ],
    demos: [
      {
        title: '三种典型版式',
        note: '注意 trailing 里放的是任意 Widget —— 所以「金额」「开关」「箭头」「状态标签」都用同一个组件就能解决。',
        code: `// 1 设置项：图标 + 标题 + 开关
SwitchListTile(
  secondary: const Icon(Icons.notifications_outlined),
  title: const Text('推送通知'),
  subtitle: const Text('仅在工作时间提醒'),
  value: pushEnabled,
  onChanged: (v) => setState(() => pushEnabled = v),
)

// 2 导航项：头像 + 双行文字 + 箭头
ListTile(
  leading: const CircleAvatar(backgroundImage: NetworkImage(avatarUrl)),
  title: Text(group.name),
  subtitle: Text('最近消息：\${group.lastMessage}'),
  trailing: const Icon(Icons.chevron_right),
  onTap: () => Navigator.pushNamed(context, '/chat', arguments: group.id),
)

// 3 金额项：标题 + 右对齐的金额与状态
ListTile(
  title: Text(order.title),
  subtitle: Text(order.createdAt),
  trailing: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      Text('¥\${order.amount}', style: const TextStyle(fontWeight: FontWeight.w600)),
      Text(order.status, style: TextStyle(color: statusColor(order.status))),
    ],
  ),
)`,
        preview: 'none',
      },
      {
        title: 'dense 让密集列表更好看',
        note: '聊天记录、通讯录这类行数多、内容短的地方，dense 能多展示约 1/3 的内容。',
        code: `ListView.builder(
  itemCount: contacts.length,
  itemBuilder: (context, index) => ListTile(
    dense: true,
    leading: CircleAvatar(
      radius: 18,
      child: Text(contacts[index].name.characters.first),
    ),
    title: Text(contacts[index].name),
    onTap: () => openContact(contacts[index]),
  ),
)`,
        preview: 'none',
      },
    ],
    related: ['list-view', 'card', 'divider', 'circle-avatar'],
  },

  {
    slug: 'image',
    name: 'Image',
    title: '图片',
    summary: '加载本地与网络图片。网络图片必须给 loadingBuilder 和 errorBuilder，否则弱网就是一片白。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['图片', 'image', '可网络', 'network', 'asset'],
    highlights: [
      'Image.network / .asset / .file / .memory 四种来源，用法一致',
      'fit 决定「图比框大或小时怎么缩放」，是超过 90% 显示问题的根源',
      'frameBuilder + loadingBuilder + errorBuilder 三件套决定弱网体验',
    ],
    whenToUse: {
      do: [
        '网络图一定要给 errorBuilder —— 否则图挂了用户看到的是异常红框',
        '列表里的图一定要给 cacheWidth —— 不压缩的话 4000px 原图解码要占十几 MB 内存',
        '需要圆角/圆形 —— 外面套 ClipRRect 或 ClipOval',
      ],
      dont: [
        '用 Image.network 直接加载超大原图（列表场景务必带 cacheWidth）',
        '在 build 里反复创建 NetworkImage 对象而不加 const —— 会导致重复请求',
      ],
    },
    notes:
      'BoxFit 速记：cover 填满并裁掉多余（默认想要的效果）；contain 完整显示但可能留白；' +
      'fill 拉伸变形；fitWidth / fitHeight 只保证一个方向。',
    props: [
      { name: 'image', type: 'ImageProvider', required: true, desc: '图片源，通常由 .network/.asset 命名构造器自动生成' },
      { name: 'fit', type: 'BoxFit?', desc: '缩放方式：cover / contain / fill / fitWidth / fitHeight / none / scaleDown' },
      { name: 'width / height', type: 'double?', desc: '显示尺寸；只给一个时另一个按原图比例' },
      { name: 'alignment', type: 'AlignmentGeometry', def: 'Alignment.center', desc: '图小于框时贴哪边；图大于框时决定裁剪保留哪部分' },
      { name: 'color / colorBlendMode', type: 'Color? / BlendMode?', desc: '给图染色，常用于占位或蒙层' },
      { name: 'errorBuilder', type: 'Widget Function(BuildContext, Object, StackTrace?)', desc: '加载失败时显示什么，强烈建议都写' },
      { name: 'loadingBuilder', type: 'Widget Function(BuildContext, Widget, ImageChunkEvent?)', desc: '加载进度回调；chunk 为 null 表示已加载完成' },
      { name: 'cacheWidth / cacheHeight', type: 'int?', desc: '按像素解码尺寸，列表图务必设置以省内存' },
    ],
    demos: [
      {
        title: '网络图完整写法（含加载中与失败）',
        note: 'progress == null 是官方约定：为 null 说明图已就绪，此时要 return child 而不是返回进度圈。',
        code: `ClipRRect(
  borderRadius: BorderRadius.circular(12),
  child: Image.network(
    product.imageUrl,
    width: double.infinity,
    height: 180,
    fit: BoxFit.cover,
    // 列表里 180 逻辑像素高、3 倍屏就是 540；不限制的话原图按原始尺寸解码
    cacheWidth: 1080,
    loadingBuilder: (context, child, progress) {
      if (progress == null) return child; // 加载完成
      final expected = progress.expectedTotalBytes;
      return Container(
        color: const Color(0xFFF5F7FA),
        alignment: Alignment.center,
        child: expected != null
            ? CircularProgressIndicator(
                value: progress.cumulativeBytesLoaded / expected,
              )
            : const CircularProgressIndicator(),
      );
    },
    errorBuilder: (context, error, stack) => Container(
      color: const Color(0xFFF5F7FA),
      alignment: Alignment.center,
      child: const Icon(Icons.broken_image_outlined, color: Color(0xFFA8ABB2)),
    ),
  ),
)`,
        preview: 'none',
      },
      {
        title: '占位图 + 淡入，避免「图片突然弹出来」',
        note: 'frameBuilder 里用 AnimatedOpacity 做淡入，是最省事的「高级感」做法，不需要任何第三方包。',
        code: `Image.network(
  url,
  fit: BoxFit.cover,
  frameBuilder: (context, child, frame, wasSynchronouslyLoaded) {
    if (wasSynchronouslyLoaded) return child; // 命中缓存，直接显示不做动画
    return AnimatedOpacity(
      opacity: frame == null ? 0 : 1,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
      child: child,
    );
  },
)`,
        preview: 'none',
      },
    ],
    related: ['circle-avatar', 'card', 'skeleton'],
  },

  {
    slug: 'circle-avatar',
    name: 'CircleAvatar',
    title: '圆形头像',
    summary: '一个固定尺寸的圆形容器，专门放头像。图挂了会自动回退成 child（通常是首字母）。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['头像', 'avatar', '圆形', 'circle'],
    highlights: [
      'backgroundImage 加载失败时不会报错，而是继续显示 child —— 这是它比 Image + ClipOval 好的地方',
      'radius 与 minRadius/maxRadius 二选一，不要混用',
      '不写 child 且图挂了会显示成纯色圆，所以最好总是给一个字母兜底',
    ],
    whenToUse: {
      do: [
        '用户头像、群头像 —— 首选',
        '需要在头像右上角挂红点 —— 套一个 Badge',
        '纯色背景 + 首字母的兜底方案 —— 给 child 传 Text 即可',
      ],
      dont: [
        '需要方形圆角头像 —— 用 ClipRRect + Image',
        '需要头像堆叠（多人头像叠一起）—— 用 Stack + 负 margin 自己拼',
      ],
    },
    props: [
      { name: 'radius', type: 'double?', desc: '半径；不设则由父级约束决定大小' },
      { name: 'minRadius / maxRadius', type: 'double?', desc: '让头像在可用空间内自适应，与 radius 互斥' },
      { name: 'backgroundImage', type: 'ImageProvider?', desc: '头像图；失败时静默回退到 backgroundColor + child' },
      { name: 'backgroundColor', type: 'Color?', desc: '底色，没图时显示' },
      { name: 'foregroundImage', type: 'ImageProvider?', desc: '画在 child 之上的图，用于叠加一层蒙版' },
      { name: 'child', type: 'Widget?', desc: '通常是首字母文字；图加载失败时就是它在兜底' },
      { name: 'onBackgroundImageError', type: 'ImageErrorListener?', desc: '图失败回调；一般不用，因为会自动回退' },
    ],
    demos: [
      {
        title: '网络头像 + 首字母兜底 + 未读红点',
        note: '三层嵌套的顺序很重要：Badge 在最外层才能浮到圆外面；CircleAvatar 的 child 是兜底而不是叠加内容。',
        code: `Badge(
  isLabelVisible: unreadCount > 0,
  label: Text('\$unreadCount'),
  child: CircleAvatar(
    radius: 24,
    backgroundColor: Colors.blue.shade100,
    foregroundImage: NetworkImage(user.avatarUrl),
    // 上面那张图挂了就会显示这个 child
    child: Text(
      user.name.characters.first.toUpperCase(),
      style: TextStyle(
        color: Colors.blue.shade800,
        fontWeight: FontWeight.w600,
      ),
    ),
  ),
)`,
        preview: 'none',
      },
    ],
    related: ['badge', 'image', 'list-tile'],
  },

  {
    slug: 'badge',
    name: 'Badge',
    title: '徽标',
    summary: '挂在别的组件右上角的红点或数字角标。可以显示数字，也可以只是一个点。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['徽标', '角标', '红点', 'badge', 'unread'],
    highlights: [
      'label 为 null 时自动变成一个实心小圆点',
      'isLabelVisible 控制显隐 —— 用它做「数字为 0 时隐藏」，比条件渲染更平滑',
      'offset 微调位置；默认位置是右上角，圆形图标上往往要往外挪一点',
    ],
    whenToUse: {
      do: [
        '未读数、待办数、状态标记 —— 挂在图标或头像上',
        '纯状态点（在线/离线）—— 不传 label 即可',
      ],
      dont: [
        '数字可能超过两位数 —— 记得自己在外面做一次「99+」截断',
        '需要显示在按钮文字的右上 —— 需要用它包住整个按钮',
      ],
    },
    props: [
      { name: 'label', type: 'Widget?', desc: '角标内容；为 null 时显示为小圆点' },
      { name: 'child', type: 'Widget?', desc: '被挂载的目标，角标画在它的右上角' },
      { name: 'isLabelVisible', type: 'bool', def: 'true', desc: '是否显示；数字为 0 时可设为 false' },
      { name: 'backgroundColor', type: 'Color?', desc: '角标底色，默认取主题的 error 色' },
      { name: 'textColor', type: 'Color?', desc: '角标文字颜色' },
      { name: 'offset', type: 'Offset?', desc: '相对默认位置的偏移，用于避开图标本身的留白' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '角标内边距，影响角标胖瘦' },
    ],
    demos: [
      {
        title: '底栏未读 + 图标未读',
        note: '大数字要自己截断，否则三位数会把角标撑得很难看。',
        code: `// 1 底部导航用 navigationDestination 的 icon 包 Badge
NavigationDestination(
  icon: Badge(
    isLabelVisible: unread > 0,
    label: Text(unread > 99 ? '99+' : '\$unread'),
    child: const Icon(Icons.chat_bubble_outline),
  ),
  selectedIcon: Badge(
    isLabelVisible: unread > 0,
    label: Text(unread > 99 ? '99+' : '\$unread'),
    child: const Icon(Icons.chat_bubble),
  ),
  label: '消息',
)

// 2 普通图标未读：注意 offset 往外挪，否则会被图标内边距挡住
Badge(
  isLabelVisible: hasNew,
  offset: const Offset(4, -4),
  child: IconButton(
    icon: const Icon(Icons.notifications_outlined),
    onPressed: openNotifications,
  ),
)

// 3 纯状态点：不传 label 就是一个实心圆
const Badge(child: Icon(Icons.person_outline))`,
        preview: 'none',
      },
    ],
    related: ['circle-avatar', 'navigation-bar', 'icon-button'],
  },

  {
    slug: 'data-table',
    name: 'DataTable',
    title: '数据表格',
    summary: '列对齐的表格。适合列数固定、每列语义明确的数据；列多时优先考虑横向滚动或改成卡片。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['表格', 'table', 'data', '报表'],
    highlights: [
      '列宽自适应，也可以给每列固定 labelStyle/numeric',
      'numeric: true 让数字列右对齐并启用等宽数字，金额对比时才看得准',
      'DataTable 默认不滚动，列太多会溢出 —— 外面要套 SingleChildScrollView(scrollDirection: horizontal)',
    ],
    whenToUse: {
      do: [
        '列数 3~6 列的报表、明细 —— 合适',
        '需要按某列排序 —— onSort 回调配合 sortColumnIndex 即可',
        '移动端列多时 —— 外面套横向滚动，或干脆改成卡片列表',
      ],
      dont: [
        '把 DataTable 放进 ListView.builder 的大量数据里 —— 它一次性构建所有行，没有虚拟化',
        '用它做可编辑表格 —— 需要自己往 cell 里塞 TextField，且布局很别扭',
      ],
    },
    notes:
      'DataTable 没有懒加载，几百行以上会明显卡。数据量大的场景请用 ' +
      'package:data_table_2 的 PaginatedDataTable2，或自己用 Row 拼。',
    props: [
      { name: 'columns', type: 'List<DataColumn>', required: true, desc: '列定义；DataColumn 的 label 是表头、numeric 控制右对齐' },
      { name: 'rows', type: 'List<DataRow>', required: true, desc: '行数据；每行的 cells 数量必须与 columns 一致' },
      { name: 'sortColumnIndex', type: 'int?', desc: '当前排序列下标，配合 onSort 使用' },
      { name: 'sortAscending', type: 'bool', def: 'true', desc: '升序还是降序' },
      { name: 'onSelectChanged', type: 'void Function(bool, int)?', desc: '开启行选择，并显示首列的复选框' },
      { name: 'columnSpacing', type: 'double', def: '56.0', desc: '列间距；列多的时候调小以塞进屏幕' },
      { name: 'headingRowHeight / dataRowHeight', type: 'double?', desc: '表头/数据行高度，dense 场景调小' },
    ],
    demos: [
      {
        title: '可排序的销售明细表',
        note: '数字列标 numeric: true 后会自动右对齐并使用等宽数字（tabular figures），' +
          '这样 1 和 7 占同样宽度，纵向比对金额时不会错位。',
        code: `class SalesTable extends StatefulWidget {
  const SalesTable({super.key, required this.rows});
  final List<SaleRow> rows;
  @override
  State<SalesTable> createState() => _SalesTableState();
}

class _SalesTableState extends State<SalesTable> {
  var _sortIndex = 2;
  var _ascending = false;

  @override
  Widget build(BuildContext context) {
    final sorted = [...widget.rows]..sort((a, b) {
      final r = switch (_sortIndex) {
        0 => a.product.compareTo(b.product),
        1 => a.region.compareTo(b.region),
        _ => a.amount.compareTo(b.amount),
      };
      return _ascending ? r : -r;
    });

    // 列多的时候一定要横向可滚，否则右半边直接被裁掉
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        sortColumnIndex: _sortIndex,
        sortAscending: _ascending,
        columnSpacing: 24,
        onSort: (index, ascending) =>
            setState(() { _sortIndex = index; _ascending = ascending; }),
        columns: const [
          DataColumn(label: Text('产品'), onSort: (_, __) {}),
          DataColumn(label: Text('区域'), onSort: (_, __) {}),
          DataColumn(label: Text('销售额'), numeric: true, onSort: (_, __) {}),
        ],
        rows: [
          for (final r in sorted)
            DataRow(cells: [
              DataCell(Text(r.product)),
              DataCell(Text(r.region)),
              DataCell(Text('¥\${r.amount.toStringAsFixed(2)}')),
            ]),
        ],
      ),
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['list-view', 'card', 'divider'],
  },

  {
    slug: 'expansion-tile',
    name: 'ExpansionTile',
    title: '可展开列表项',
    summary: '点击标题展开/收起内容块。FAQ、设置分组、筛选条件折叠都用它。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['折叠', '展开', 'expand', 'accordion', 'faq'],
    highlights: [
      '自带箭头旋转动画，且箭头方向会跟随展开状态',
      'initiallyExpanded 控制初始状态；要「同时只展开一个」需要自己接管 onExpansionChanged',
      'children 是整个内容区，可以放任意 widget（包括嵌套列表）',
    ],
    whenToUse: {
      do: [
        'FAQ、说明文档那种「标题 + 大段内容」的场景',
        '设置页分组折叠 —— 减少首屏长度',
        '和 Card 搭配做手风琴 —— 外层套 Card，视觉最完整',
      ],
      dont: [
        '展开内容本身是个长列表 —— 内外都滚动会打架，考虑换成新页面',
        '需要多级嵌套折叠 —— ExpansionTile 嵌套后动画容易跳，建议换 package:expansion_tile_group',
      ],
    },
    props: [
      { name: 'title', type: 'Widget', required: true, desc: '始终可见的标题行' },
      { name: 'children', type: 'List<Widget>', required: true, desc: '展开后显示的内容' },
      { name: 'subtitle', type: 'Widget?', desc: '标题下方的副文本' },
      { name: 'leading', type: 'Widget?', desc: '左侧图标；给了它箭头仍在右侧' },
      { name: 'trailing', type: 'Widget?', desc: '覆盖默认的展开箭头 —— 一旦设置，箭头就没了' },
      { name: 'initiallyExpanded', type: 'bool', def: 'false', desc: '初始是否展开' },
      { name: 'onExpansionChanged', type: 'ValueChanged<bool>?', desc: '展开状态变化回调，用来实现「只开一个」' },
      { name: 'tilePadding / childrenPadding', type: 'EdgeInsetsGeometry?', desc: '标题行 / 内容区的内边距' },
      { name: 'shape / collapsedShape', type: 'ShapeBorder?', desc: '展开/收起时的外框；要加边框线就靠它' },
    ],
    demos: [
      {
        title: '手风琴：同时只展开一个',
        note: '核心技巧是用 ExpansionTileController：需要收起时直接调用 collapse()，' +
          '比维护一个「哪个是开的」的下标更不容易出错，也不会有 setState 时序问题。',
        code: `class FaqList extends StatefulWidget {
  const FaqList({super.key, required this.items});
  final List<FaqItem> items;
  @override
  State<FaqList> createState() => _FaqListState();
}

class _FaqListState extends State<FaqList> {
  // 每个 tile 一个 controller，用来在别的 tile 展开时主动收起自己
  late final _controllers =
      List.generate(widget.items.length, (_) => ExpansionTileController());

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < widget.items.length; i++)
          Card(
            elevation: 0,
            margin: const EdgeInsets.only(bottom: 8),
            shape: RoundedRectangleBorder(
              side: const BorderSide(color: Color(0xFFE4E7ED)),
              borderRadius: BorderRadius.circular(8),
            ),
            child: ExpansionTile(
              controller: _controllers[i],
              title: Text(widget.items[i].question),
              shape: const Border(),          // 展开时不要默认的上下分割线
              collapsedShape: const Border(),
              onExpansionChanged: (expanded) {
                if (!expanded) return;
                // 收起其他所有
                for (var j = 0; j < _controllers.length; j++) {
                  if (j != i) _controllers[j].collapse();
                }
              },
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(widget.items[i].answer),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['card', 'list-tile', 'divider'],
  },

  {
    slug: 'skeleton',
    name: '骨架屏（自建）',
    title: '骨架屏',
    summary: 'Flutter 官方没有 Skeleton 组件。这是用 Container + 动画自己拼的版本，比转圈圈更不"闪"。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['骨架屏', 'skeleton', 'shimmer', 'loading', '占位'],
    highlights: [
      '为什么用手写：官方没有；第三方包（skeletonizer）会引入额外依赖和构建成本',
      '核心是「形状和真实内容一致，只是没有内容」—— 骨架和真内容位置差太多反而更晃眼',
      '配 AnimationController 做明暗呼吸，比静态灰块体验好很多',
    ],
    whenToUse: {
      do: [
        '首屏需要等网络数据 —— 骨架屏比 CircularProgressIndicator 的感知等待时间更短',
        '列表页 —— 骨架画成 5~6 个假卡片即可',
      ],
      dont: [
        '加载会在 200ms 内结束 —— 骨架一闪而过反而更烦，此时用「延迟 300ms 才显示 loading」（见 s5-2）',
        '错误状态 —— 骨架不是错误占位，应该用 errorBuilder 或独立的错误视图',
      ],
    },
    notes:
      '骨架屏的关键工程量在「延迟显示」：先等 300ms，还没数据才画骨架。' +
      '否则本地缓存命中时会闪一下，观感比不画还差。',
    props: [
      { name: 'width / height', type: 'double', desc: '灰块尺寸，尽量和真实内容一致' },
      { name: 'borderRadius', type: 'BorderRadius', desc: '圆角；文字占位用 4，图片占位用 8~12' },
      { name: '_baseColor', type: 'Color', desc: '灰块基色，深色模式下需要换' },
      { name: 'duration', type: 'Duration', desc: '闪烁周期，1000~1400ms 比较自然' },
    ],
    demos: [
      {
        title: '闪烁骨架块 + 列表骨架',
        note: '用 Transform 的 scaleY 做明暗变化（其实是把小方块纵向压扁再拉回），' +
          '比改颜色更省性能，因为不触发重绘整个子树。',
        code: `class SkeletonBox extends StatefulWidget {
  const SkeletonBox({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.radius = 4,
  });

  final double width;
  final double height;
  final double radius;

  @override
  State<SkeletonBox> createState() => _SkeletonBoxState();
}

class _SkeletonBoxState extends State<SkeletonBox>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  )..repeat(reverse: true);

  @override
  void dispose() {
    // AnimationController 必须 dispose，否则会一直占着 ticker
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: Tween<double>(begin: 0.45, end: 0.9).animate(
        CurvedAnimation(parent: _c, curve: Curves.easeInOut),
      ),
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: const Color(0xFFEEF1F5),
          borderRadius: BorderRadius.circular(widget.radius),
        ),
      ),
    );
  }
}

/// 一个「假卡片」，形状照着真实的商品卡片画
class ProductCardSkeleton extends StatelessWidget {
  const ProductCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SkeletonBox(width: 72, height: 72, radius: 8),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SkeletonBox(height: 14),
                  SizedBox(height: 10),
                  SkeletonBox(height: 12, width: 140),
                  SizedBox(height: 10),
                  SkeletonBox(height: 12, width: 80),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 用法：先等 300ms 再决定画骨架还是画内容
class _ListPageState extends State<ListPage> {
  var _showSkeleton = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (!mounted) return;
      if (_items.isEmpty) setState(() => _showSkeleton = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_showSkeleton && _items.isEmpty) {
      return ListView(
        children: const [
          ProductCardSkeleton(),
          ProductCardSkeleton(),
          ProductCardSkeleton(),
        ],
      );
    }
    return ListView.builder(
      itemCount: _items.length,
      itemBuilder: (_, i) => ProductCard(_items[i]),
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['card', 'image', 'circular-progress-indicator'],
  },

  {
    slug: 'stepper',
    name: 'Stepper',
    title: '步骤条',
    summary: '多步流程的导航条。默认竖直排列，也能横过来。但复杂表单自己画往往更好控。',
    category: 'display',
    import: 'package:flutter/material.dart',
    tags: ['步骤', 'stepper', 'wizard', '流程'],
    highlights: [
      '三种状态：complete（打勾）/ active（高亮）/ 灰色待办，由 currentStep 决定',
      'controlsBuilder 可以完全替换底部按钮，默认的 Continue/Cancel 文案是英文',
      'type: StepperType.horizontal 变横版 —— 步骤多时横版放不下',
    ],
    whenToUse: {
      do: [
        '注册、下单、审批这类「线性流程」且步骤 ≤ 5 个',
        '每步内容不多 —— 内容多的话用户不知道自己在哪',
      ],
      dont: [
        '步骤超过 5 个 —— 换成横向进度条 + 主内容区',
        '步骤可以任意跳转 —— Stepper 的语义是顺序推进，出现反直觉',
        '需要复杂校验 —— 自己用 PageView + 顶部自绘指示器更可控',
      ],
    },
    notes:
      'Stepper 默认底部按钮是英文 "CONTINUE" / "CANCEL"。' +
      '国内项目几乎都要用 controlsBuilder 覆盖，否则就要靠全局 MaterialApp 的 localizations。',
    props: [
      { name: 'currentStep', type: 'int', required: true, desc: '当前处于第几步，从 0 开始' },
      { name: 'steps', type: 'List<Step>', required: true, desc: '步骤定义；每个 Step 有 title/content/isActive/state' },
      { name: 'type', type: 'StepperType', def: 'StepperType.vertical', desc: 'vertical 竖排 / horizontal 横排' },
      { name: 'onStepTapped', type: 'ValueChanged<int>?', desc: '点头部跳步；不给则不可跳' },
      { name: 'onStepContinue', type: 'VoidCallback?', desc: '下一步回调' },
      { name: 'onStepCancel', type: 'VoidCallback?', desc: '上一步回调' },
      { name: 'controlsBuilder', type: 'ControlsWidgetBuilder?', desc: '替换底部按钮，用来改成中文和自定义禁用逻辑' },
      { name: 'physics', type: 'ScrollPhysics?', desc: '横版时控制滚动行为' },
    ],
    demos: [
      {
        title: '下单流程 + 中文按钮 + 分步校验',
        note: '注意 onStepContinue 里先校验再 setState —— 校验不通过就不要推进 currentStep，' +
          '否则用户会跳到一个空步骤。',
        code: `class CheckoutStepper extends StatefulWidget {
  const CheckoutStepper({super.key});
  @override
  State<CheckoutStepper> createState() => _CheckoutStepperState();
}

class _CheckoutStepperState extends State<CheckoutStepper> {
  var _current = 0;
  final _formKey = GlobalKey<FormState>();

  bool get _isLast => _current == 2;

  void _next() {
    // 只有当前步校验通过才推进
    if (_current == 0 && !(_formKey.currentState?.validate() ?? false)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请先填写完整收货信息')),
      );
      return;
    }
    if (_isLast) {
      submitOrder();
      return;
    }
    setState(() => _current++);
  }

  @override
  Widget build(BuildContext context) {
    return Stepper(
      currentStep: _current,
      onStepTapped: (i) => setState(() => _current = i),
      onStepContinue: _next,
      onStepCancel: () {
        if (_current == 0) return;
        setState(() => _current--);
      },
      controlsBuilder: (context, details) {
        return Padding(
          padding: const EdgeInsets.only(top: 16),
          child: Row(
            children: [
              FilledButton(
                onPressed: details.onStepContinue,
                child: Text(_isLast ? '提交订单' : '下一步'),
              ),
              const SizedBox(width: 12),
              if (_current > 0)
                OutlinedButton(
                  onPressed: details.onStepCancel,
                  child: const Text('上一步'),
                ),
            ],
          ),
        );
      },
      steps: [
        Step(
          title: const Text('收货信息'),
          isActive: _current >= 0,
          state: _current > 0 ? StepState.complete : StepState.indexed,
          content: AddressForm(formKey: _formKey),
        ),
        Step(
          title: const Text('配送方式'),
          isActive: _current >= 1,
          state: _current > 1 ? StepState.complete : StepState.indexed,
          content: const ShippingOptions(),
        ),
        Step(
          title: const Text('确认支付'),
          isActive: _current >= 2,
          content: const OrderSummary(),
        ),
      ],
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['linear-progress-indicator', 'form', 'card'],
  },
];
