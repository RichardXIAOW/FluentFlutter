import type { ComponentDoc } from '../types';

/**
 * 其他 —— 放不进上面任何一类、但新手一定会撞上的东西。
 *
 * 这一组不是「组件」，而是「结构」：Scaffold 是页面骨架，
 * InheritedWidget 是数据往下传的机制，Theme 是全局样式。
 * 单独成组是因为新手最容易漏掉它们，而漏掉之后会到处写重复代码。
 */
export const otherComponents: ComponentDoc[] = [
  {
    slug: 'scaffold',
    name: 'Scaffold',
    title: '页面骨架',
    summary: '一个页面的「标准外壳」：AppBar、body、FAB、底部栏、抽屉都挂在这上面。每个路由页面几乎都以它开头。',
    category: 'other',
    import: 'package:flutter/material.dart',
    tags: ['骨架', 'scaffold', '页面', 'page', 'appbar', 'fab'],
    highlights: [
      'body 会自动避开 AppBar 与底部安全区，不需要手算 padding',
      'ScaffoldMessenger.of(context) 拿到的是「最近的那个 Scaffold」，所以 SnackBar 会显示在正确的页面',
      '同一个页面里嵌套 Scaffold 是合法的，但会导致 SnackBar 挂在里层 —— 这是很多"提示弹不出来的 bug 的原因',
    ],
    whenToUse: {
      do: [
        '每个有独立路由的页面都用它作为根 widget',
        '需要在 body 上盖一层浮动按钮 —— 用 floatingActionButton 而不是自己 Stack',
        '需要底部固定栏 —— 用 bottomNavigationBar，它会自动让 body 的内容不被遮住',
      ],
      dont: [
        '在页面的「一部分」里套 Scaffold 只为拿个 AppBar —— 用 Container + 自绘标题更省',
        '把 Scaffold 放进 ListView 的 item 里 —— 会有两层安全区叠加',
      ],
    },
    notes:
      'Scaffold 真正的价值不是布局，而是「注册表」：它把自己注册到树上，' +
      'ScaffoldMessenger、BottomSheet、Drawer 才能通过 context 找到正确的宿主。',
    props: [
      { name: 'appBar', type: 'PreferredSizeWidget?', desc: '顶部应用栏，通常传 AppBar' },
      { name: 'body', type: 'Widget?', desc: '主体内容；会被自动避让系统栏' },
      { name: 'floatingActionButton', type: 'Widget?', desc: '右下角浮动按钮；位置由 floatingActionButtonLocation 控制' },
      { name: 'floatingActionButtonLocation', type: 'FloatingActionButtonLocation?', desc: '默认 endFloat；centerFloat / centerDocked 常用于底部导航' },
      { name: 'bottomNavigationBar', type: 'Widget?', desc: '底部固定栏；NavigationBar 通常放这里' },
      { name: 'drawer / endDrawer', type: 'Widget?', desc: '左 / 右侧抽屉；设置后 AppBar 会自动加汉堡按钮' },
      { name: 'backgroundColor', type: 'Color?', desc: '页面底色，默认取主题 scaffoldBackgroundColor' },
      { name: 'resizeToAvoidBottomInset', type: 'bool', def: 'true', desc: '键盘弹出时是否压缩 body；设为 false 会导致输入框被键盘挡住' },
      { name: 'persistentFooterButtons', type: 'List<Widget>?', desc: '底部常驻按钮行，显示在 body 与 bottomNavigationBar 之间' },
    ],
    demos: [
      {
        title: '标准页面模板（照抄就能用）',
        note: '注意 resizeToAvoidBottomInset 默认 true —— 这正是输入框不会被键盘挡住的原因。' +
          '如果你发现键盘弹出后内容没上移，八成是被哪层包装设成了 false。',
        code: `class ProductDetailPage extends StatefulWidget {
  const ProductDetailPage({super.key, required this.productId});

  final String productId;

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('商品详情'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: '分享',
            onPressed: () => share(widget.productId),
          ),
        ],
      ),
      body: const ProductDetailBody(),
      // 底部固定操作栏：会自动让 body 内容不被它遮住
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: addToCart,
                child: const Text('加入购物车'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                onPressed: buyNow,
                child: const Text('立即购买'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
        preview: 'none',
      },
      {
        title: 'SnackBar 为什么有时"看不见"',
        note: '这是新手最常踩的坑之一。SnackBar 挂在最近的 ScaffoldMessenger 上，' +
          '而 ScaffoldMessenger 通常由 MaterialApp 提供 —— 所以如果你在另一个页面调用了它，' +
          '提示会显示在那个页面而不是当前页面。当前页面要显示，必须 await 完再 setState 之后才调用。',
        code: `// ❌ 在 A 页面 push 到 B 之后立刻调，SnackBar 被 B 页面盖住了
Navigator.push(context, MaterialPageRoute(builder: (_) => const BPage()));
ScaffoldMessenger.of(context).showSnackBar(
  const SnackBar(content: Text('操作成功')),
);

// ✅ 拿到返回值，回到 A 之后再提示
final saved = await Navigator.push<bool>(
  context,
  MaterialPageRoute(builder: (_) => const BPage()),
);
if (!mounted) return;           // await 之后 context 可能已经失效
if (saved == true) {            // 注意：可能是 null，必须显式比 true
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('保存成功')),
  );
}`,
        preview: 'none',
      },
      {
        title: '每个页面包一层 ScaffoldMessenger 隔离提示',
        note: '如果希望提示只显示在当前页面内部（比如带底部导航的 tab 页），' +
          '在该页面的 Scaffold 外套一个 ScaffoldMessenger 就行。',
        code: `Column(
  children: [
    Expanded(child: ProductListView()),
  ],
)

// 改成：
ScaffoldMessenger(
  child: Scaffold(
    appBar: AppBar(title: const Text('商品')),
    body: const ProductListView(),
  ),
)`,
        preview: 'none',
      },
    ],
    related: ['app-bar', 'drawer', 'bottom-navigation-bar', 'snack-bar'],
  },

  {
    slug: 'theme',
    name: 'Theme / ThemeData',
    title: '全局主题',
    summary: '集中定义配色、字号、圆角、按钮样式。目的是让"改一次，全站生效"成立，而不是到处硬编码颜色。',
    category: 'other',
    import: 'package:flutter/material.dart',
    tags: ['主题', 'theme', '颜色', 'color', '暗色', 'dark', '设计令牌'],
    highlights: [
      'ThemeData 拆成 VisualDensity / ColorScheme / componentTheme 三层，改的时候要改对层',
      'Material 3 下颜色几乎都从 ColorScheme 取，直接写 Color(0xFF...) 会在暗色模式下失效',
      'Theme.of(context).xxx 拿到的值会随最近一层 Theme 变化 —— 这是做局部主题的机制',
    ],
    whenToUse: {
      do: [
        '项目一开始就定好 seedColor —— 后面改品牌色只需要改一行',
        '暗色模式用 ColorScheme.fromSeed(brightness: Brightness.dark) 自动生成一套',
        '单个页面想换风格 —— 外面包一层 Theme(data: ...) 即可，不影响全站',
      ],
      dont: [
        '在业务代码里写死 Color(0xFF409EFF) —— 换主题时这些地方不会跟着变',
        '用 ThemeData(primarySwatch: ...) 这个 M2 老 API —— M3 下行为不一致',
      ],
    },
    notes:
      '判断一个 Flutter 项目工程化程度，看两处就够了：' +
      '一是有没有集中的 ThemeData，二是业务代码里有没有硬编码的颜色和字号。',
    props: [
      { name: 'colorScheme', type: 'ColorScheme?', desc: 'M3 的颜色总方案；推荐 ColorScheme.fromSeed 生成' },
      { name: 'useMaterial3', type: 'bool', def: 'true', desc: '启不启用 Material 3；老项目可能还是 false' },
      { name: 'textTheme', type: 'TextTheme?', desc: '全局字号字重；定义一次，Text 不写 style 也有正确大小' },
      { name: 'appBarTheme / cardTheme / ...', type: 'XxxThemeData?', desc: '按组件覆盖样式，比在每个实例上写 style 更省' },
      { name: 'visualDensity', type: 'VisualDensity?', desc: '整体紧凑度；compact 能多塞一点内容' },
      { name: 'fontFamily', type: 'String?', desc: '全局字体；中文字体建议在这里指定而不是逐个 Text' },
      { name: 'scaffoldBackgroundColor', type: 'Color?', desc: '页面底色，通常希望和卡片区分开' },
      { name: 'pageTransitionsTheme', type: 'PageTransitionsTheme?', desc: '页面切换动画；iOS/Android 默认不同' },
    ],
    demos: [
      {
        title: '两个页面之间切换明暗主题',
        note: '关键点：ThemeMode 存状态，ThemeData 用 fromSeed 生成。' +
          '这样暗色模式不是"手调 100 个颜色"，而是一行代码。',
        code: `class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PulseShop',
      // 一份种子色生成两套方案，保证亮/暗模式色相一致
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0E7490)),
        appBarTheme: const AppBarTheme(centerTitle: true),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: Color(0xFFE2E8F0)),
          ),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0E7490),
          brightness: Brightness.dark,
        ),
      ),
      // 跟随系统；想手动切换就把它接到 state 上
      themeMode: ThemeMode.system,
      home: const HomePage(),
    );
  }
}`,
        preview: 'none',
      },
      {
        title: '业务代码里正确取颜色',
        note: '对比一下：写死颜色的那行在暗色模式下就是白底白字，' +
          '而用 colorScheme 的那行会自动适配。',
        code: `// ❌ 写死：暗色模式下会出问题
Container(
  color: const Color(0xFFFFFFFF),
  child: const Text('标题', style: TextStyle(color: Color(0xFF2C3038))),
)

// ✅ 从主题取
final scheme = Theme.of(context).colorScheme;
final text = Theme.of(context).textTheme;

Container(
  color: scheme.surface,
  child: Text('标题', style: text.titleMedium),
)

// 只对一个页面换风格：包一层 Theme 即可，不影响其他页面
Theme(
  data: Theme.of(context).copyWith(
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
  ),
  child: const PromoPage(),
)`,
        preview: 'none',
      },
      {
        title: '中文字体：在一处指定，全局生效',
        note: '不要在几十个 Text 上重复写 fontFamily。' +
          '更完整的做法是配合 google_fonts 或自己放字体文件到 assets/fonts。',
        code: `ThemeData(
  useMaterial3: true,
  // 中英文混排：拉丁字符用 Inter，汉字回落到系统字体
  fontFamily: 'PingFang SC',
  fontFamilyFallback: const ['Microsoft YaHei', 'sans-serif'],
  textTheme: const TextTheme(
    titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    bodyMedium: TextStyle(fontSize: 14, height: 1.5),
    labelSmall: TextStyle(fontSize: 12, letterSpacing: 0),
  ),
)`,
        preview: 'none',
      },
    ],
    related: ['scaffold', 'card', 'text'],
  },

  {
    slug: 'media-query',
    name: 'MediaQuery',
    title: '屏幕信息',
    summary: '读取屏幕尺寸、像素比、安全区、键盘高度、文字缩放。做响应式与避让时全靠它。',
    category: 'other',
    import: 'package:flutter/material.dart',
    tags: ['屏幕', '尺寸', 'mediaquery', '响应式', '安全区', '键盘'],
    highlights: [
      'MediaQuery.of(context).size 拿到的是「当前窗口」尺寸，不是物理屏幕',
      'viewPadding / padding 是刘海屏与手势条的安全区，底部按钮必须加',
      'textScaler 反映系统的"字体放大"设置 —— 不处理会导致大字号下布局崩掉',
    ],
    whenToUse: {
      do: [
        '底部操作栏、悬浮按钮 —— 必须加 SafeArea 或读 viewPadding.bottom',
        '区分手机/平板布局 —— 按 size.width 断点分支',
        '需要避开键盘 —— 读 viewInsets.bottom，但通常 Scaffold 已经处理好了',
      ],
      dont: [
        '在 build 里反复调 MediaQuery.of(context) 只为了拿一个值 —— 用 MediaQuery.sizeOf(context) 更精确，只在这几个属性变化时才重建',
      ],
    },
    props: [
      { name: '.size', type: 'Size', desc: '窗口逻辑尺寸（宽高，单位是逻辑像素）' },
      { name: '.sizeOf(context)', type: 'Size', desc: '只依赖尺寸的重建；比 .of() 性能好' },
      { name: '.padding', type: 'EdgeInsets', desc: '安全区，刘海/挖孔/手势条' },
      { name: '.viewInsets', type: 'EdgeInsets', desc: '被系统 UI 遮住的区域，键盘弹出时 bottom 大于 0' },
      { name: '.viewPadding', type: 'EdgeInsets', desc: '原始安全区，不随键盘变化' },
      { name: '.devicePixelRatio', type: 'double', desc: '像素比；缓存图片尺寸时用它换算' },
      { name: '.textScaler', type: 'TextScaler', desc: '系统字号缩放；用它代替老 API textScaleFactor' },
      { name: '.platformBrightness', type: 'Brightness', desc: '系统当前是亮色还是暗色' },
    ],
    demos: [
      {
        title: '断点布局 + 安全区 + 大字号兜底',
        note: '三个新手最容易漏的点都在这一段里：' +
          '1) 用 sizeOf 而不是 of；2) 底部用 SafeArea 包裹；3) 字号放大时改用可滚动的布局而不是硬撑。',
        code: `class ResponsiveProductGrid extends StatelessWidget {
  const ResponsiveProductGrid({super.key, required this.products});
  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    // sizeOf 只在尺寸变化时重建，比 MediaQuery.of(context) 精准
    final width = MediaQuery.sizeOf(context).width;

    // 三档断点：手机 2 列 / 小平板 3 列 / 大屏 4 列
    final columns = switch (width) {
      < 600 => 2,
      < 900 => 3,
      _ => 4,
    };

    return SafeArea(
      // 顶部和左右不额外留，只保证不被刘海/手势条挡
      minimum: const EdgeInsets.only(top: 8),
      child: GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columns,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 0.72,
        ),
        itemCount: products.length,
        itemBuilder: (_, i) => ProductCard(products[i]),
      ),
    );
  }
}

// 系统字号调很大时，行高固定的布局会溢出。用 MediaQuery 读出来做兜底
class BigTextGuard extends StatelessWidget {
  const BigTextGuard({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final scaler = MediaQuery.textScalerOf(context);
    // 超过 1.3 倍就允许滚动，避免 Overflow
    final tooBig = scaler.scale(14) / 14 > 1.3;
    if (!tooBig) return child;
    return SingleChildScrollView(child: child);
  }
}`,
        preview: 'none',
      },
    ],
    related: ['scaffold', 'safe-area', 'grid-view'],
  },
];
