import type { Chapter } from './types';

/**
 * Flutter 基础开发 · 第 3 站（原第三步为组件手册，组件手册保留在 /components 作速查字典）
 *
 * 定位： Dart 语言、Flutter 心智模型之后、工程化指南之前。
 * 聚焦「动手写出能跑的页面」：
 *   第 1 章 界面编写的基本方法（骨架 / 布局 / 列表 / setState）
 *   第 2 章 常用界面元素配置（AppBar / 底部导航 / TabBar / Drawer 等）
 *   第 3 章 常用第三方库（网络与文件 / 扫码 / 定位 / 蓝牙 / 权限与工具）
 *   第 4 章 补遗与衔接（异步与 JSON / 常见坑 / 通往工程化）
 *
 * 写作原则与全站一致：先结论、再最小可跑代码、每节 keypoints 收束。
 */
export const basicsTutorial: Chapter[] = [
  /* ════════════════════════════ 第 1 章 ════════════════════════════ */
  {
    id: 'basics-ui',
    no: '第 1 章',
    title: '界面编写的基本方法',
    lead: 'Flutter 里没有 XML 布局，界面就是代码：一层 Widget 套一层 Widget。这一章给你最小可跑的页面骨架、布局组件的选择标准、列表的正确写法，以及让页面动起来的 setState。',
    sections: [
      {
        id: 'b-scaffold',
        title: '1.1 最小页面骨架：MaterialApp + Scaffold',
        level: '基础',
        summary: '每个页面 = MaterialApp 之下的一块 Scaffold。骨架配齐，后面所有界面元素都有位置放。',
        blocks: [
          {
            kind: 'p',
            html: '一个能跑的 Flutter 页面只需要两层：<code>MaterialApp</code> 提供全局环境（主题、导航、国际化），<code>Scaffold</code> 提供单页的「脚手架」—— 顶栏、内容区、底栏、悬浮按钮都有了标准位置。下面是完整可跑的最小页面，直接替换 <code>main.dart</code> 就能运行：',
          },
          {
            kind: 'code',
            filename: 'lib/main.dart',
            code: `import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: '第一个页面',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('首页')),
      body: const Center(child: Text('Hello Flutter')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '记住 <code>Scaffold</code> 的六个常用插槽：<code>appBar</code> 顶栏、<code>body</code> 内容、<code>bottomNavigationBar</code> 底部导航、<code>floatingActionButton</code> 悬浮按钮、<code>drawer</code> 抽屉、<code>bottomSheet</code> 底部弹层。<b>初学阶段 90% 的页面就是这几个插槽的排列组合</b>，第 2 章会逐个展开。',
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>热重载是你的主战场：</b>改代码保存后界面秒级刷新（终端按 <code>r</code> 全量重载、<code>R</code> 重启）。但注意：改了 <code>initState</code>、<code>main</code>、全局变量这类「只执行一次」的代码，热重载不生效，要用热重启（大写 <code>R</code>）。调试与真机运行的完整命令见工程化指南第 1.2 节。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>MaterialApp</code> 全局一个，<code>Scaffold</code> 每页一个 —— 骨架先行，再填内容。',
              'Scaffold 六插槽：<code>appBar / body / bottomNavigationBar / floatingActionButton / drawer / bottomSheet</code>。',
              '热重载改 UI、热重启改初始化逻辑，两个键（<code>r</code> / <code>R</code>）分清楚。',
            ],
          },
        ],
      },
      {
        id: 'b-layout',
        title: '1.2 布局组件怎么选',
        level: '基础',
        summary: '不要背组件列表，记「场景 → 组件」的对应关系。布局出问题，九成是约束（constraints）没理解。',
        blocks: [
          {
            kind: 'p',
            html: 'Flutter 布局的思考方式是<b>「由外向内给约束」</b>：父组件告诉子组件「你最大能多大」，子组件在这范围内决定自己实际多大。日常开发用到的布局组件其实很少，按场景对号入座即可：',
          },
          {
            kind: 'table',
            head: ['场景', '组件', '一句话说明'],
            rows: [
              ['纵向排列', '<code>Column</code>', '子组件从上到下排'],
              ['横向排列', '<code>Row</code>', '子组件从左到右排'],
              ['叠放（图上叠字）', '<code>Stack</code> + <code>Positioned</code>', '后画的在上面，<code>alignment</code> 控制默认位置'],
              ['占满剩余空间', '<code>Expanded</code> / <code>Flexible</code>', '只用在 Row / Column 里，按比例分空间'],
              ['居中 / 加边距 / 定尺寸', '<code>Center</code> / <code>Padding</code> / <code>SizedBox</code>', '最常用的三个「小工具」'],
              ['内容多放不下自动换行', '<code>Wrap</code>', '标签流式布局'],
              ['圆角、边框、阴影、渐变', '<code>Container</code> + <code>BoxDecoration</code>', '装饰都写在 <code>decoration</code> 里'],
              ['点一下 / 水波纹', '<code>GestureDetector</code> / <code>InkWell</code>', 'InkWell 自带 Material 水波纹'],
              ['占位与留白', '<code>SizedBox</code> / <code>Spacer</code>', '比 Container 空盒子更便宜'],
            ],
          },
          {
            kind: 'p',
            html: '初学者最常撞到的报错就是 <b>「A RenderFlex overflowed by N pixels」</b>（黄黑条纹溢出警告）。原因是 Row / Column 里的内容比可用空间大 —— 固定尺寸的内容交给 <code>Expanded</code> 去分配，或者外包一层 <code>SingleChildScrollView</code> 允许滚动：',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 内容一多就溢出',
              code: `Row(
  children: [
    Text('一段可能很长的标题文字'),
    Text('¥99.00'),
  ],
)
// 文字过长 → 溢出报黄`,
            },
            good: {
              title: '✅ 弹性空间 + 溢出省略',
              code: `Row(
  children: [
    Expanded(
      child: Text(
        '一段可能很长的标题文字',
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    ),
    const Text('¥99.00'),
  ],
)`,
            },
            note: '经验法则：<b>Row / Column 里「可有可无会伸缩」的部分包 Expanded，固定不变的部分保持原样</b>。',
          },
          {
            kind: 'keypoints',
            items: [
              '按场景选组件，不背列表：排列用 Column/Row、叠放用 Stack、弹性用 Expanded。',
              '溢出报错的解法就两招：<code>Expanded</code> 分空间、<code>SingleChildScrollView</code> 给滚动。',
              '装饰（圆角边框阴影）写在 <code>Container.decoration</code>，点击用 <code>InkWell</code>。',
            ],
          },
        ],
      },
      {
        id: 'b-list',
        title: '1.3 列表：ListView 与构建式写法',
        level: '基础',
        summary: '列表是 App 里出现频率最高的界面。几十条以内随便用 ListView，接口翻页列表必须用 ListView.builder。',
        blocks: [
          {
            kind: 'p',
            html: '<code>ListView</code> 是滚动的长列表。它有两种用法，区别在<b>懒加载</b>：直接传 <code>children</code> 会一次性把所有条目构建出来；<code>ListView.builder</code> 只构建屏幕内可见的条目，划到哪建到哪 —— <b>接口返回的列表一律用 builder 写法</b>：',
          },
          {
            kind: 'code',
            filename: '订单列表（ListView.builder 标准写法）',
            code: `class OrderListPage extends StatelessWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final orders = <Map<String, String>>[
      {'id': 'A-1024', 'title': '机械键盘', 'amount': '¥399'},
      {'id': 'A-1025', 'title': '无线鼠标', 'amount': '¥129'},
      // ...接口返回的数据
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('我的订单')),
      body: ListView.builder(
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final o = orders[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: ListTile(
              leading: const Icon(Icons.receipt_long),
              title: Text(o['title']!),
              subtitle: Text('单号 \${o['id']}'),
              trailing: Text(o['amount']!, style: const TextStyle(fontWeight: FontWeight.bold)),
              onTap: () {
                // 进详情页
              },
            ),
          );
        },
      ),
    );
  }
}`,
          },
          {
            kind: 'term',
            items: [
              {
                term: 'ListView / GridView',
                desc: 'children 一次性给全，适合固定的少量条目（设置页十来行这种）。',
              },
              {
                term: '.builder 版本',
                desc: '<code>itemCount + itemBuilder</code> 懒构建，<b>接口数据、可能很长的列表一律用它</b>。',
              },
              {
                term: '.separated 版本',
                desc: 'builder 的变体，多一个 <code>separatorBuilder</code> 专门画条目之间的分隔线，省去手写 margin。',
              },
              {
                term: 'SingleChildScrollView + Column',
                desc: '「一屏内容可能超出一屏」的表单页、详情页用这个，不是列表场景别拿 ListView 硬套。',
              },
              {
                term: '分页加载',
                desc: '滚到底部加载下一页：监听 <code>ScrollController</code> 或用 <code>infinite_scroll_pagination</code> 包，工程化阶段再上。',
              },
            ],
          },
          {
            kind: 'keypoints',
            items: [
              '接口列表用 <code>ListView.builder</code>（或 <code>.separated</code>），固定小列表才用 children 写法。',
              '一屏可能放不下的表单 / 详情页用 <code>SingleChildScrollView + Column</code>。',
              '<code>ListTile</code> 是列表条目的标准起点：leading / title / subtitle / trailing。',
            ],
          },
        ],
      },
      {
        id: 'b-state',
        title: '1.4 让页面动起来：setState 与输入框',
        level: '基础',
        summary: '界面要随数据变，就需要 StatefulWidget。初学阶段 setState 完全够用，管理规范到工程化指南再换 Riverpod。',
        blocks: [
          {
            kind: 'p',
            html: '<code>StatelessWidget</code> 是「画出来就不变」的，<code>StatefulWidget</code> 是「数据变了界面跟着变」的。变的过程只有一个动作：<b>改数据后调 <code>setState()</code>，Flutter 重新执行 <code>build</code></b>。一个计数卡片 + 一个输入框，覆盖交互的最小闭环：',
          },
          {
            kind: 'code',
            filename: 'setState 与输入框',
            code: `class FeedbackCard extends StatefulWidget {
  const FeedbackCard({super.key});

  @override
  State<FeedbackCard> createState() => _FeedbackCardState();
}

class _FeedbackCardState extends State<FeedbackCard> {
  int _stars = 0;                                  // ① 状态：会变的数据
  final _controller = TextEditingController();     // ② 输入框控制器

  @override
  void dispose() {
    _controller.dispose();                         // ③ 控制器必须释放
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('本次服务评分：\$_stars 星'),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (i) {
                return IconButton(
                  onPressed: () => setState(() => _stars = i + 1), // ④ 改数据必须包 setState
                  icon: Icon(
                    i < _stars ? Icons.star : Icons.star_border,
                    color: Colors.amber,
                  ),
                );
              }),
            ),
            TextField(
              controller: _controller,                    // 绑定控制器读输入
              decoration: const InputDecoration(labelText: '想说点什么'),
            ),
            FilledButton(
              onPressed: () {
                debugPrint('评分 \$_stars，留言：\${_controller.text}');
              },
              child: const Text('提交'),
            ),
          ],
        ),
      ),
    );
  }
}`,
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>两条铁律：</b>① 改了状态字段但没包 <code>setState</code>，界面<b>不会</b>刷新 —— 这是新手「为什么界面没反应」的第一大原因；② <code>TextEditingController</code> 这类资源必须在 <code>dispose()</code> 里释放，否则泄漏。另外别在 <code>build</code> 里做耗时计算或发起请求 —— <code>build</code> 会被频繁调用。',
          },
          {
            kind: 'keypoints',
            items: [
              '数据变 → 界面变的完整链路：改字段 + <code>setState</code> → <code>build</code> 重跑。',
              '<code>TextEditingController</code> 管输入框，用完 <code>dispose()</code>。',
              'setState 适合单页面的小状态；跨页面共享、复杂状态留给工程化指南的 Riverpod（第 3 章）。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 2 章 ════════════════════════════ */
  {
    id: 'basics-widgets',
    no: '第 2 章',
    title: '常用界面元素配置',
    lead: 'App 的「框架感」来自这几样：顶栏、底部导航、顶部标签页、抽屉。这一章给的全是标准 Material 3 配置，可直接抄进项目，也和工程化指南的主题章节完全兼容。',
    sections: [
      {
        id: 'b-appbar',
        title: '2.1 AppBar：标题、动作与返回',
        level: '基础',
        summary: '顶栏是每个页面的门面。actions 放高频操作，返回按钮 Scaffold 自动给，样式全局统一去 ThemeData 配。',
        blocks: [
          {
            kind: 'code',
            filename: 'AppBar 常用配置',
            code: `Scaffold(
  appBar: AppBar(
    title: const Text('商品详情'),
    centerTitle: true,                       // 标题居中（iOS 风格）
    actions: [
      IconButton(
        onPressed: () {},
        icon: const Icon(Icons.share),
        tooltip: '分享',                     // 长按提示，别省
      ),
      IconButton(
        onPressed: () {},
        icon: const Icon(Icons.shopping_cart_outlined),
      ),
    ],
    // push 进来的页面自动有返回箭头；想自定义返回行为：
    // leading: IconButton(
    //   onPressed: () => Navigator.maybePop(context),
    //   icon: const Icon(Icons.close),
    // ),
  ),
  body: const SizedBox.shrink(),
)`,
          },
          {
            kind: 'p',
            html: '三个要点：<b>① 返回按钮是自动的</b> —— 只有当这一页是通过 <code>Navigator.push</code> 进入的，AppBar 才会显示返回箭头，首页没有是正常的；<b>② 图标按钮都写 <code>tooltip</code></b>，长按有说明，无障碍也靠它；<b>③ 颜色、高度、居中这类全局风格不要每页写一遍</b>，在 <code>appBarTheme</code> 里配一次（工程化指南第 7.1 节有现成配置）。',
          },
        ],
      },
      {
        id: 'b-navbar',
        title: '2.2 底部导航栏：NavigationBar + IndexedStack',
        level: '基础',
        summary: '三个 tab 以上的 App 都需要底部导航。重点不是 NavigationBar 本身，是用 IndexedStack 保住每个页面的状态。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/app/home_page.dart（三 tab 主页模板）',
            code: `class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _index = 0;

  // 三个 tab 对应的页面。IndexedStack 会同时持有它们 —— 切回来不丢状态
  final _pages = const [FeedPage(), DiscoverPage(), ProfilePage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: '发现',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_outline),
            selectedIcon: Icon(Icons.favorite),
            label: '收藏',
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
            kind: 'p',
            html: '<code>NavigationBar</code> 是 Material 3 的底部导航（旧教程里的 <code>BottomNavigationBar</code> 是 Material 2 遗产，新项目优先用这个）。真正的关键在 <code>body</code> 用了 <code>IndexedStack</code>：<b>所有 tab 页同时活着，切走再切回来，滚动位置、输入内容、加载过的数据都还在</b>。如果直接 <code>body: _pages[_index]</code>，每次切换都销毁重建 —— 列表回到顶部、数据重新请求，体验立刻垮掉。',
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>tab 页内再点进二级页</b>用 <code>Navigator.push</code> 即可，返回时 tab 状态不受影响。将来工程化指南会把这套结构升级为 go_router 的 <code>StatefulShellRoute.indexedStack</code>（第 4 章）—— 思路一模一样，只是换声明式写法。',
          },
          {
            kind: 'keypoints',
            items: [
              '新项目用 Material 3 的 <code>NavigationBar</code>，不要再抄 <code>BottomNavigationBar</code> 老代码。',
              '<code>IndexedStack</code> 保 tab 状态，是底部导航的标配搭档。',
              'destinations 的图标给 outline 常态 + selected 高亮态，观感最正。',
            ],
          },
        ],
      },
      {
        id: 'b-tabbar',
        title: '2.3 顶部标签页：TabBar + TabBarView',
        level: '基础',
        summary: '「全部 / 待付款 / 已完成」这种顶部 tab，DefaultTabController 十行搞定。tab 内容是各自独立的可滚动页面。',
        blocks: [
          {
            kind: 'code',
            filename: '订单分栏（TabBar 标准写法）',
            code: `class OrderTabsPage extends StatelessWidget {
  const OrderTabsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,                                 // 必须和 tabs 数量一致
      child: Scaffold(
        appBar: AppBar(
          title: const Text('订单'),
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
            OrderListView(status: 'all'),
            OrderListView(status: 'pending'),
            OrderListView(status: 'done'),
          ],
        ),
      ),
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '结构就一句话：<b><code>TabBar</code> 挂在 <code>AppBar.bottom</code>，<code>TabBarView</code> 放在 <code>body</code>，两者由同一个 controller 驱动</b>。用 <code>DefaultTabController</code> 包一层就不需要手写 controller；<code>length</code> 必须等于 <code>tabs</code> 的数量，也必须等于 <code>TabBarView.children</code> 的数量，对不上直接抛错。每个 tab 的内容自己是一个列表页 —— 用第 1.3 节的 <code>ListView.builder</code> 就行。',
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>TabBarView 里的页面默认会被销毁重建</b>（切换时离开视口的 tab 页会丢状态）。列表要保活，给对应页面混入 <code>AutomaticKeepAliveClientMixin</code>：<code>with AutomaticKeepAliveClientMixin</code> + <code>build</code> 开头调 <code>super.build(context)</code> + 重写 <code>wantKeepAlive => true</code> 三步。',
          },
          {
            kind: 'keypoints',
            items: [
              'TabBar 放 <code>AppBar.bottom</code>，TabBarView 放 body，数量必须一一对应。',
              '<code>DefaultTabController</code> 免写 controller；要精确控制（联动滚动、记忆位置）再手动建 <code>TabController</code>。',
              'tab 页保活三步：<code>AutomaticKeepAliveClientMixin</code>。',
            ],
          },
        ],
      },
      {
        id: 'b-drawer',
        title: '2.4 抽屉、悬浮按钮与轻提示',
        level: '基础',
        summary: 'Scaffold 剩下的三个插槽一次配齐：drawer 侧滑菜单、FAB 主操作、SnackBar 轻提示。',
        blocks: [
          {
            kind: 'code',
            filename: 'drawer + FAB + SnackBar',
            code: `Scaffold(
  appBar: AppBar(title: const Text('工作台')),
  drawer: Drawer(
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        const DrawerHeader(
          decoration: BoxDecoration(color: Colors.blueGrey),
          child: Text('用户信息区'),
        ),
        ListTile(
          leading: const Icon(Icons.settings),
          title: const Text('设置'),
          onTap: () => Navigator.pop(context),     // 先关抽屉，再跳转
        ),
        ListTile(
          leading: const Icon(Icons.info),
          title: const Text('关于'),
          onTap: () => Navigator.pop(context),
        ),
      ],
    ),
  ),
  floatingActionButton: FloatingActionButton.extended(
    onPressed: () {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('已保存')),
      );
    },
    icon: const Icon(Icons.save),
    label: const Text('保存'),
  ),
  body: const SizedBox.shrink(),
)`,
          },
          {
            kind: 'p',
            html: '几个容易忽略的细节：<b>① <code>DrawerHeader</code> 之外菜单项的 <code>padding: EdgeInsets.zero</code></b> 能去掉 ListView 默认顶部的空隙；<b>② 菜单项点击后先 <code>Navigator.pop(context)</code> 关抽屉</b>再做事，不然抽屉挂着跳页很怪；<b>③ SnackBar 用 <code>ScaffoldMessenger.of(context)</code> 弹</b>，同一个 context 里连续弹会排队而不是覆盖。提示条的全局样式（浮动、圆角）同样去 <code>snackBarTheme</code> 配一次（工程化指南第 7.1 节）。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>Drawer</code> 是标准侧滑菜单，菜单项点击先 <code>Navigator.pop</code> 关掉它。',
              '<code>FloatingActionButton.extended</code> 自带图标 + 文字，适合「保存 / 新建」这类主操作。',
              '轻提示统一 <code>ScaffoldMessenger.of(context).showSnackBar</code>。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 3 章 ════════════════════════════ */
  {
    id: 'basics-libs',
    no: '第 3 章',
    title: '常用第三方库：基础能力速查',
    lead: '蓝牙、定位、扫码、文件 —— 这些能力 Flutter SDK 不内置，靠生态里的插件包。这一章给的是每个基础场景「该装哪个包、最小怎么用」，全部选自社区主流、维护活跃的库。',
    sections: [
      {
        id: 'b-lib-choose',
        title: '3.1 选库三条原则',
        level: '基础',
        summary: '装包之前花两分钟看三样东西，能避开 80% 的烂坑。',
        blocks: [
          {
            kind: 'list',
            items: [
              '<b>维护状态优先。</b>pub.dev 主页看「最近一次发布时间」—— 超过一年没更新、issue 堆着没人回的包，再好用也别上，升级 Flutter 后大概率编译不过。',
              '<b>看健康度指标。</b>pub points（静态分析、文档完备度）、likes、下载量三个数一起看；有官方（flutter.dev 组织）或大厂背书的优先。',
              '<b>平台覆盖要对上。</b>你要 Android / iOS / Web 哪几端，表格里都要勾上 —— 很多插件只覆盖移动端，Web 一跑就报错。',
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>国内拉包慢：</b>给 Flutter 配官方中国镜像 —— 环境变量 <code>PUB_HOSTED_URL=https://pub.flutter-io.cn</code> 与 <code>FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn</code>，配完 <code>flutter pub get</code> 速度正常。装完新包先跑一次 <code>flutter analyze</code> 确认没引入冲突。',
          },
        ],
      },
      {
        id: 'b-lib-net',
        title: '3.2 网络请求与文件上传下载',
        level: '基础',
        summary: 'dio 是事实标准：请求、下载、上传一个包全包。文件「怎么选、存哪里」由 file_picker 和 path_provider 补齐。',
        blocks: [
          {
            kind: 'code',
            filename: 'dio 三件套：请求 / 下载 / 上传',
            code: `import 'package:dio/dio.dart';

final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  connectTimeout: const Duration(seconds: 10),
));

// ① 普通 GET
final res = await dio.get('/orders');
debugPrint('status: \${res.statusCode}, data: \${res.data}');

// ② 下载文件（自带进度回调）
await dio.download(
  'https://cdn.example.com/report.pdf',
  '/storage/emulated/0/Download/report.pdf',
  onReceiveProgress: (received, total) {
    if (total > 0) debugPrint('下载进度 \${(received / total * 100).toStringAsFixed(0)}%');
  },
);

// ③ 上传文件（multipart 表单）
final form = FormData.fromMap({
  'file': await MultipartFile.fromFile(
    filePath,
    filename: 'report.pdf',       // 服务端收到的文件名
  ),
});
await dio.post(
  '/upload',
  data: form,
  onSendProgress: (sent, total) => debugPrint('上传 \$sent/\$total'),
);`,
          },
          {
            kind: 'table',
            head: ['要做的事', '用什么', '一句话说明'],
            rows: [
              ['选文件（任意类型）', '<code>file_picker</code>', '<code>FilePicker.platform.pickFiles()</code> 返回本地路径，配合上传用'],
              ['选图片 / 拍照', '<code>image_picker</code>', '官方维护，相册和相机两入口'],
              ['拿到可写目录', '<code>path_provider</code>', '下载缓存去 <code>getApplicationDocumentsDirectory()</code>，别写死路径'],
              ['统一网络层', '<code>dio</code>', '拦截器、超时、取消都有；工程化指南第 5 章会配成单例 + 统一错误处理'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>下载路径别写死。</b>示例里为了直观写了个绝对路径，真实项目用 <code>path_provider</code> 拿目录；Android 11+ 直接写公共 Download 目录还要额外申请存储权限 —— 起步阶段先下到 App 私有目录最省事。',
          },
        ],
      },
      {
        id: 'b-lib-scan',
        title: '3.3 扫码、定位与蓝牙',
        level: '进阶',
        summary: '三个最常被问到的「原生能力」。共同点：都涉及权限 —— 权限没配好，代码写得再对也不工作。',
        blocks: [
          {
            kind: 'p',
            html: '<b>扫码：mobile_scanner</b>（基于 MLKit，识别快、支持一维码 / 二维码）。Android 端用相机需要在你自己的 <code>AndroidManifest.xml</code> 里声明相机权限：',
          },
          {
            kind: 'code',
            filename: 'mobile_scanner 最小示例',
            code: `import 'package:mobile_scanner/mobile_scanner.dart';

class ScanPage extends StatelessWidget {
  const ScanPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('扫码')),
      body: MobileScanner(
        onDetect: (capture) {
          for (final barcode in capture.barcodes) {
            final value = barcode.rawValue;
            if (value != null) {
              debugPrint('扫码结果：\$value');
              Navigator.pop(context, value);   // 把结果带回上一页
            }
          }
        },
      ),
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '<b>定位：geolocator</b>（跨平台定位统一封装）。它只管「拿坐标」，地图展示要用地图 SDK（国内推荐高德或腾讯地图官方维护的 Flutter 插件，需要各自平台的 key）：',
          },
          {
            kind: 'code',
            filename: 'geolocator 拿当前坐标',
            code: `import 'package:geolocator/geolocator.dart';

Future<Position> getCurrent() async {
  var permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();   // 弹系统授权框
  }
  if (permission == LocationPermission.denied ||
      permission == LocationPermission.deniedForever) {
    throw Exception('定位权限被拒绝');
  }
  return Geolocator.getCurrentPosition();
}
// 结果：Position(latitude: 23.13, longitude: 113.26, ...)`,
          },
          {
            kind: 'p',
            html: '<b>蓝牙：flutter_blue_plus</b>（社区最活跃的 BLE 库）。经典流程四步 —— 扫描 → 连接 → 发现服务 → 读写特征：',
          },
          {
            kind: 'code',
            filename: 'flutter_blue_plus：扫描与连接',
            code: `import 'package:flutter_blue_plus/flutter_blue_plus.dart';

// ① 扫描（记得先开手机蓝牙 + 定位权限，Android 扫 BLE 依赖定位权限）
await FlutterBluePlus.startScan(timeout: const Duration(seconds: 4));

// ② 监听扫描结果，选目标设备
FlutterBluePlus.scanResults.listen((results) {
  for (final r in results) {
    debugPrint('\${r.device.remoteId}  \${r.advertisementData.advName}  RSSI \${r.rssi}');
  }
});

// ③ 连接并发现服务
final device = /* 从扫描结果里挑一个 */;
await device.connect();
final services = await device.discoverServices();
for (final s in services) {
  debugPrint('服务 \${s.uuid}');
}

// ④ 读写特征值（读写、订阅 notify 都在 characteristic 上）
// await c.write(value);  final v = await c.read();  c.onValueReceived.listen(...);`,
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>这类库的共同前提是权限与清单配置</b>：相机（扫码）、定位（BLE 扫描 + 定位）、蓝牙（Android 12+ 需要 <code>BLUETOOTH_SCAN/CONNECT</code>）。权限申请统一用 <code>permission_handler</code>（下一节）。iOS 端还要在 <code>Info.plist</code> 写「用途说明文案」，否则直接被系统拒。',
          },
          {
            kind: 'keypoints',
            items: [
              '扫码 <code>mobile_scanner</code>、定位 <code>geolocator</code>、BLE <code>flutter_blue_plus</code>，都是当前主流选择。',
              '原生能力先配权限再写代码：Android 改 Manifest，iOS 改 Info.plist 加用途文案。',
              '地图展示国内选高德 / 腾讯官方插件（要平台 key），geolocator 只负责拿坐标。',
            ],
          },
        ],
      },
      {
        id: 'b-lib-tools',
        title: '3.4 权限申请与工具库速查',
        level: '基础',
        summary: 'permission_handler 统一管运行时权限；再认识六个几乎每个项目都会装的官方系小工具。',
        blocks: [
          {
            kind: 'code',
            filename: 'permission_handler 统一申请权限',
            code: `import 'package:permission_handler/permission_handler.dart';

final status = await Permission.camera.request();   // 相机
// 同类：Permission.location / storage / microphone / bluetooth...
if (status.isGranted) {
  // 授权，继续业务
} else if (status.isPermanentlyDenied) {
  // 用户勾了「不再询问」—— 引导去系统设置页
  await openAppSettings();
}`,
          },
          {
            kind: 'table',
            head: ['库', '干什么', '什么时候装'],
            rows: [
              ['<code>url_launcher</code>', '打开链接 / 电话 / 邮件 / 外部 App', '有「联系我们」「去商店评分」这类入口时'],
              ['<code>shared_preferences</code>', 'KV 轻量本地存储', '存开关、token、主题选择（工程化第 6 章展开）'],
              ['<code>path_provider</code>', '拿系统目录（文档 / 缓存 / 临时）', '第一次读写文件时'],
              ['<code>image_picker</code>', '相册选图 / 拍照', '头像上传、反馈截图'],
              ['<code>package_info_plus</code>', '读自身版本号', '「关于」页、埋点上报'],
              ['<code>device_info_plus</code>', '读设备信息', '日志排查、客服工单'],
            ],
          },
          {
            kind: 'p',
            html: '这批库加上第 3.2 ~ 3.3 节的能力库，基本覆盖初学阶段的全部原生需求。<b>装机原则沿用工程化指南第 2.1 节的分批表：写到哪个功能装哪个包</b>，装一个会一个，别第一天全塞进 pubspec。',
          },
          {
            kind: 'keypoints',
            items: [
              '运行时权限统一 <code>permission_handler</code>，「永久拒绝」要引导 <code>openAppSettings()</code>。',
              '官方系小工具（url_launcher / shared_preferences / path_provider…）几乎必装，但按需分批。',
              '每个库装完跑 <code>flutter analyze</code> + 各端跑一次，确认平台覆盖没问题。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 4 章 ════════════════════════════ */
  {
    id: 'basics-next',
    no: '第 4 章',
    title: '上手之后：补遗与衔接',
    lead: '这一章补两块初学者迟早要撞的知识（异步与数据解析、高频坑），然后把线索交给下一站 —— 工程化指南。',
    sections: [
      {
        id: 'b-async',
        title: '4.1 异步与 JSON 解析打底',
        level: '基础',
        summary: '接口调用 = async/await + JSON 解析。这一节把最小闭环写通，工程化阶段再升级为 Result + freezed。',
        blocks: [
          {
            kind: 'code',
            filename: '取数据并解析成对象',
            code: `import 'dart:convert';
import 'package:dio/dio.dart';

class Order {
  final String id;
  final String title;
  final double amount;
  const Order({required this.id, required this.title, required this.amount});

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'] as String,
        title: json['title'] as String,
        amount: (json['amount'] as num).toDouble(),
      );
}

Future<List<Order>> fetchOrders() async {
  final res = await Dio().get<Map<String, dynamic>>('/orders');
  final list = res.data?['list'] as List? ?? [];
  return list.map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
}`,
          },
          {
            kind: 'p',
            html: '三个要点：<b>① <code>await</code> 只能出现在 <code>async</code> 函数里</b>，返回值是 <code>Future&lt;T&gt;</code>；<b>② <code>res.data</code> 的类型要显式声明</b>（<code>get&lt;Map&lt;String, dynamic&gt;&gt;</code>），不然拿到的是 dynamic 到处 as；<b>③ 手写 <code>fromJson</code> 能跑就行</b>，但字段一多就是灾难 —— 工程化指南第 2 章的 freezed 会生成它，这里先理解原理。',
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>界面等数据的三种姿态：</b>最简单是 <code>FutureBuilder</code>（快但容易在 rebuild 时重复请求，<code>future</code> 参数要在 State 里缓存好）；其次「进页面先 loading、拿到数据 setState」（第 1.4 节的路子）；正式项目用 Riverpod 的 <code>AsyncNotifier</code>（工程化第 3 章）—— 三者是演进关系，不是替代关系。',
          },
        ],
      },
      {
        id: 'b-pitfalls',
        title: '4.2 新手高频坑速查',
        level: '基础',
        summary: '初学阶段 80% 的「奇怪现象」都在这张表里，卡住先来对号。',
        blocks: [
          {
            kind: 'table',
            head: ['现象', '原因', '解法'],
            rows: [
              ['改了数据界面没反应', '改字段没包 <code>setState</code>', '状态变更一律 <code>setState(() =&gt; ...)</code>'],
              ['黄黑条纹溢出警告', 'Row / Column 内容超宽超高', '<code>Expanded</code> 分空间，或外包 <code>SingleChildScrollView</code>'],
              ['热重载没反应', '改了 initState / main / 全局变量', '热重启（终端大写 <code>R</code>）'],
              ['页面上写死 Colors.white，深色模式发白刺眼', '颜色没走主题', '用 <code>Theme.of(context).colorScheme</code>（工程化第 7 章）'],
              ['接口报错直接白屏', '没捕获异常', '<code>try-catch</code> 包住请求，失败给错误页（工程化第 5 章统一处理）'],
              ['用了 context 的代码在异步回调里报错', '页面可能已经销毁（async gap）', 'await 之后用 context 前判 <code>context.mounted</code>'],
              ['切换 tab 后列表回到顶部', '页面被销毁重建', '底部导航配 <code>IndexedStack</code>（第 2.2 节）'],
              ['真机跑不起来', '设备没授权 / adb 没认到', '工程化指南第 1.2 节真机三板斧'],
            ],
          },
        ],
      },
      {
        id: 'b-to-engineering',
        title: '4.3 下一站：把 demo 长成项目',
        level: '进阶',
        summary: '到这里你已具备写页面的全部基础能力。下一站解决的是「真实项目」的问题：环境、结构、状态、路由、网络、质量。',
        blocks: [
          {
            kind: 'p',
            html: '本站教的是<b>「把界面写出来」</b>，下一站工程化指南解决<b>「三个月后还能不能维护」</b>。衔接关系是这样的：',
          },
          {
            kind: 'list',
            items: [
              '第 1 章的页面骨架，在工程化里长成 <code>MaterialApp.router + feature-first 目录</code>（其第 0、1 章）。',
              '<code>setState</code> 管不动的大状态，换 Riverpod 的 codegen 写法（其第 3 章）。',
              '散装的 <code>Navigator.push</code>，升级为 go_router 声明式路由 + 登录重定向（其第 4 章）。',
              '第 3 章裸用的 dio，配成单例 + 拦截器 + sealed Failure 统一错误（其第 5 章）。',
              '调试运行与打包的完整命令，在其第 1.2 节随时可查；主题（本站第 2 章）的全局配置在其第 7 章。',
              '需要查某个组件长什么样、有什么属性 —— 随时回组件手册（<code>/components</code>），当字典用。',
            ],
          },
          {
            kind: 'keypoints',
            title: '学习路径建议',
            items: [
              '别在本站停留太久：能写出「带底部导航 + 列表 + 网络请求」的三页 App 就该往前走。',
              '工程化指南第 1 章半天能搭完骨架，之后缺什么回来查 —— 和本站的学习方式一致。',
              '遇到本站没覆盖的原生能力（推送、支付、视频…），先去 pub.dev 按第 3.1 节的三条原则选库。',
            ],
          },
        ],
      },
    ],
  },
];
