import type { ComponentDoc } from '../types';

/** 导航：AppBar / BottomNavigationBar / NavigationBar / TabBar / Drawer */
export const navigationComponents: ComponentDoc[] = [
  {
    slug: 'app-bar',
    name: 'AppBar',
    title: '应用栏',
    summary: '页面顶部的横条，放标题和操作按钮。',
    category: 'navigation',
    tags: ['顶栏', 'appbar', '标题栏', '导航'],
    highlights: [
      '放在 Scaffold 的 appBar 参数里，不要手动 Positioned',
      'leading 通常不用写 —— 有上一页时会自动出现返回箭头',
      'bottom 参数可以挂一个 TabBar，这是「标题 + 标签页」的标准组合',
    ],
    props: [
      { name: 'title', type: 'Widget?', desc: '标题。用 Text 或自己拼 Row（左标题右副标题）' },
      { name: 'leading', type: 'Widget?', desc: '左侧组件。不写时 Flutter 会自动放返回箭头（前提是能 pop）' },
      { name: 'actions', type: 'List<Widget>?', desc: '右侧操作列表，通常是一排 IconButton' },
      { name: 'bottom', type: 'PreferredSizeWidget?', desc: '底部附加内容，最常用于挂 TabBar' },
      { name: 'centerTitle', type: 'bool?', desc: '标题是否居中。iOS 默认居中、Android 默认靠左，不写就跟随平台' },
      { name: 'automaticallyImplyLeading', type: 'bool', def: 'true', desc: '是否自动加返回箭头。做首页时设 false 可以去掉' },
      { name: 'backgroundColor', type: 'Color?', desc: '背景色。M3 默认取 surfaceContainer' },
      { name: 'elevation', type: 'double?', def: '0（M3）', desc: '阴影。M3 默认无阴影，用背景色区分层级' },
      { name: 'scrolledUnderElevation', type: 'double?', def: '3（M3）', desc: '内容滚到它下面时的阴影 —— 这个细节让「有东西被挡住了」变得可见' },
      { name: 'systemOverlayStyle', type: 'SystemUiOverlayStyle?', desc: '状态栏图标颜色。深色 AppBar 上需要设成 light' },
    ],
    demos: [
      {
        title: '标准顶栏',
        preview: 'live',
        code: `Scaffold(
  appBar: AppBar(
    title: const Text('订单详情'),
    actions: [
      IconButton(tooltip: '分享', icon: const Icon(Icons.ios_share), onPressed: () {}),
      IconButton(tooltip: '更多', icon: const Icon(Icons.more_vert), onPressed: () {}),
    ],
  ),
  body: const Center(child: Text('页面内容')),
)`,
      },
      {
        title: '标题 + 副标题（两行）',
        note: 'AppBar 的 title 可以放任意 Widget，所以「主标题 + 小字副标题」完全合法。',
        preview: 'live',
        code: `AppBar(
  title: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    children: [
      const Text('订单 #12345', style: TextStyle(fontSize: 17)),
      Text(
        '2026-10-15 创建',
        style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
      ),
    ],
  ),
)`,
      },
      {
        title: '搜索框直接放在顶栏里',
        note: '这是电商 App 很常见的形态。搜出来的框要收紧内边距，否则会显得很挤。',
        preview: 'live',
        code: `AppBar(
  title: TextField(
    decoration: InputDecoration(
      hintText: '搜索商品',
      prefixIcon: const Icon(Icons.search),
      filled: true,
      fillColor: Colors.grey.shade100,
      contentPadding: EdgeInsets.zero,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(22),
        borderSide: BorderSide.none,
      ),
    ),
  ),
  actions: [
    IconButton(tooltip: '购物车', icon: const Icon(Icons.shopping_cart_outlined), onPressed: () {}),
  ],
)`,
      },
    ],
    related: ['tab-bar', 'scaffold', 'drawer', 'search-bar'],
  },

  {
    slug: 'navigation-bar',
    name: 'NavigationBar',
    title: '底部导航（M3）',
    summary: 'Material 3 的底部导航栏，用来切换几个主要页面。',
    category: 'navigation',
    tags: ['底部导航', 'navigationbar', 'tabbar', '标签栏', 'tab'],
    highlights: [
      'M3 推荐用它替代 BottomNavigationBar',
      '3~5 个标签最合适，少于 3 个不必做导航，多于 5 个该合并',
      '切换页面时用 IndexedStack 保住各页状态，否则滚动位置会丢',
    ],
    props: [
      { name: 'selectedIndex', type: 'int', required: true, desc: '当前选中的索引' },
      { name: 'onDestinationSelected', type: 'ValueChanged<int>?', desc: '切换回调' },
      { name: 'destinations', type: 'List<NavigationDestination>', required: true, desc: '标签列表' },
      { name: 'labelBehavior', type: 'NavigationDestinationLabelBehavior', def: 'alwaysShow', desc: '文字标签显示策略：alwaysShow / onlyShowSelected / alwaysHide' },
      { name: 'height', type: 'double?', def: '80', desc: '导航栏高度' },
      { name: 'indicatorColor', type: 'Color?', desc: '选中项背后的胶囊底色' },
      { name: 'backgroundColor', type: 'Color?', desc: '底色' },
    ],
    demos: [
      {
        title: '用 IndexedStack 保住各页状态',
        note: '这是关键 —— 直接用 _pages[_index] 的话，切走再切回来页面会重建，滚动位置、输入内容全没了。',
        preview: 'live',
        code: `class _MainShell extends StatefulWidget {
  const _MainShell();
  @override
  State<_MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<_MainShell> {
  int _index = 0;

  // ★ const 的页面列表，配合 IndexedStack
  static const _pages = [
    Center(child: Text('首页')),
    Center(child: Text('分类')),
    Center(child: Text('购物车')),
    Center(child: Text('我的')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ★ IndexedStack 保留所有页面的 State
      body: IndexedStack(index: _index, children: _pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),        // 选中时换成实心
            label: '首页',
          ),
          NavigationDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view),
            label: '分类',
          ),
          NavigationDestination(
            icon: Icon(Icons.shopping_cart_outlined),
            selectedIcon: Icon(Icons.shopping_cart),
            label: '购物车',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: '我的',
          ),
        ],
      ),
    );
  }
}`,
      },
      {
        title: '带未读角标',
        note: 'NavigationDestination 的 icon 可以包一个 Badge，这是官方提供的方式。',
        preview: 'live',
        code: `NavigationBar(
  selectedIndex: 0,
  onDestinationSelected: (_) {},
  destinations: const [
    NavigationDestination(icon: Icon(Icons.home_outlined), label: '首页'),
    NavigationDestination(
      icon: Badge(
        label: Text('3'),                    // 数字角标
        child: Icon(Icons.chat_bubble_outline),
      ),
      label: '消息',
    ),
    NavigationDestination(
      icon: Badge(                           // 小红点（无数字）
        child: Icon(Icons.notifications_none),
      ),
      label: '通知',
    ),
  ],
)`,
      },
    ],
    related: ['app-bar', 'bottom-navigation-bar', 'badge', 'tab-bar'],
  },

  {
    slug: 'tab-bar',
    name: 'TabBar',
    title: '标签页',
    summary: '一排可横向切换的标签，用于同一页面的不同视图。',
    category: 'navigation',
    tags: ['标签页', 'tabbar', 'tab', '切换'],
    highlights: [
      '必须配 TabController（手写或用 DefaultTabController 包一层）',
      '挂在 AppBar 的 bottom 参数里是最标准的做法',
      '标签多了可以设 isScrollable: true 让它能横向滚',
    ],
    props: [
      { name: 'tabs', type: 'List<Widget>', required: true, desc: '标签列表，通常是 Tab(text: ...)' },
      { name: 'controller', type: 'TabController?', desc: '控制器。用 DefaultTabController 时可以省略' },
      { name: 'isScrollable', type: 'bool', def: 'false', desc: '是否可横向滚动。标签多时开' },
      { name: 'indicatorColor', type: 'Color?', desc: '指示器颜色' },
      { name: 'indicatorSize', type: 'TabBarIndicatorSize?', def: 'tab', desc: '指示器宽度：tab（贴合文字）或 label（占满整个 tab）' },
      { name: 'labelColor', type: 'Color?', desc: '选中标签的文字颜色' },
      { name: 'unselectedLabelColor', type: 'Color?', desc: '未选中标签的文字颜色' },
      { name: 'onTap', type: 'ValueChanged<int>?', desc: '点击回调。可以在切页时上报埋点' },
    ],
    demos: [
      {
        title: '顶栏 + 标签页（最标准形态）',
        note: 'DefaultTabController 会自动把 TabController 提供给子树，省掉手动 dispose。',
        preview: 'live',
        code: `DefaultTabController(
  length: 3,
  child: Scaffold(
    appBar: AppBar(
      title: const Text('我的订单'),
      bottom: const TabBar(
        tabs: [
          Tab(text: '全部'),
          Tab(text: '待付款'),
          Tab(text: '已完成'),
        ],
      ),
    ),
    body: const TabBarView(
      children: [
        Center(child: Text('全部订单')),
        Center(child: Text('待付款订单')),
        Center(child: Text('已完成订单')),
      ],
    ),
  ),
)`,
      },
      {
        title: '标签多到放不下：isScrollable',
        preview: 'none',
        code: `TabBar(
  isScrollable: true,                    // ★ 可以横向滚动
  tabAlignment: TabAlignment.start,      // 从左边开始排（否则会居中）
  tabs: const [
    Tab(text: '推荐'),
    Tab(text: '数码'),
    Tab(text: '家电'),
    Tab(text: '美妆'),
    Tab(text: '母婴'),
    Tab(text: '运动'),
    Tab(text: '图书'),
  ],
)`,
      },
    ],
    related: ['app-bar', 'navigation-bar', 'segmented-button'],
  },

  {
    slug: 'drawer',
    name: 'Drawer',
    title: '侧边抽屉',
    summary: '从屏幕左侧滑出的菜单面板。',
    category: 'navigation',
    tags: ['抽屉', 'drawer', '侧边栏', '菜单'],
    highlights: [
      '移动端用抽屉收纳次要入口；桌面端建议用 NavigationRail 常驻',
      '放在 Scaffold 的 drawer 参数里，左上角会自动出现汉堡图标',
      '抽屉里的项点了之后一定要关掉抽屉，否则用户会以为没反应',
    ],
    props: [
      { name: 'child', type: 'Widget?', desc: '抽屉内容' },
      { name: 'width', type: 'double?', def: '304', desc: '抽屉宽度' },
      { name: 'elevation', type: 'double?', def: '16', desc: '阴影高度' },
      { name: 'shape', type: 'ShapeBorder?', desc: '形状，可以只给右侧圆角' },
      { name: 'backgroundColor', type: 'Color?', desc: '背景色' },
      { name: 'open', type: 'bool?', desc: '当前是否打开。用于响应式控制' },
      { name: 'onClose', type: 'VoidCallback?', desc: '关闭回调' },
    ],
    demos: [
      {
        title: '标准侧边菜单',
        note: '（桌面端预览里抽屉需要点左上角汉堡图标打开）',
        preview: 'live',
        code: `Scaffold(
  appBar: AppBar(title: const Text('首页')),
  drawer: Drawer(
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        // 顶部用户信息区
        UserAccountsDrawerHeader(
          accountName: const Text('张三'),
          accountEmail: const Text('zhangsan@example.com'),
          currentAccountPicture: const CircleAvatar(
            child: Icon(Icons.person),
          ),
          onDetailsPressed: () {},
        ),

        ListTile(
          leading: const Icon(Icons.home_outlined),
          title: const Text('首页'),
          selected: true,
          onTap: () {
            Navigator.pop(context);          // ★ 先关抽屉
            // 然后导航
          },
        ),
        ListTile(
          leading: const Icon(Icons.settings_outlined),
          title: const Text('设置'),
          onTap: () => Navigator.pop(context),
        ),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.red),
          title: const Text('退出登录', style: TextStyle(color: Colors.red)),
          onTap: () => Navigator.pop(context),
        ),
      ],
    ),
  ),
  body: const Center(child: Text('点左上角打开抽屉')),
)`,
      },
    ],
    related: ['app-bar', 'scaffold', 'list-tile'],
  },

  {
    slug: 'bottom-navigation-bar',
    name: 'BottomNavigationBar',
    title: '底部导航（旧版）',
    summary: 'Material 2 的底部导航，新项目建议用 NavigationBar。',
    category: 'navigation',
    tags: ['底部导航', 'bottomnavigationbar', 'm2', '旧版'],
    highlights: [
      'M2 的组件，M3 里对应的是 NavigationBar —— 新项目优先选新的',
      '需要 4 个以上 item 时，必须显式设 type: BottomNavigationBarType.fixed，否则会自动变成 shifting 动画',
      '想保留各页状态同样要配 IndexedStack',
    ],
    props: [
      { name: 'items', type: 'List<BottomNavigationBarItem>', required: true, desc: '标签列表' },
      { name: 'currentIndex', type: 'int', required: true, desc: '当前索引' },
      { name: 'onTap', type: 'ValueChanged<int>?', desc: '点击回调' },
      { name: 'type', type: 'BottomNavigationBarType?', desc: 'fixed / shifting。≥4 个 item 必须设 fixed，否则未选中项的文字会消失' },
      { name: 'selectedItemColor', type: 'Color?', desc: '选中项颜色' },
      { name: 'unselectedItemColor', type: 'Color?', desc: '未选中项颜色' },
      { name: 'showUnselectedLabels', type: 'bool?', def: 'true（fixed）', desc: '是否显示未选中项的文字' },
    ],
    demos: [
      {
        title: '基础用法（注意 type）',
        note: '这是这个组件最大的坑：不写 type，一旦 item 达到 4 个，未选中的标签文字会莫名其妙消失。',
        preview: 'live',
        code: `BottomNavigationBar(
  currentIndex: _index,
  onTap: (i) => setState(() => _index = i),
  // ★ 4 个以上必须显式设为 fixed
  type: BottomNavigationBarType.fixed,
  selectedItemColor: Theme.of(context).colorScheme.primary,
  unselectedItemColor: Colors.grey.shade600,
  items: const [
    BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: '首页'),
    BottomNavigationBarItem(icon: Icon(Icons.grid_view_outlined), label: '分类'),
    BottomNavigationBarItem(icon: Icon(Icons.shopping_cart_outlined), label: '购物车'),
    BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: '我的'),
  ],
)`,
      },
    ],
    related: ['navigation-bar', 'app-bar'],
  },
];
