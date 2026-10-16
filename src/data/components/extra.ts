import type { ComponentDoc } from '../types';

/**
 * 其他 —— 补齐 layout/general 里被 related 引用、但属于「结构型」的组件：
 * Spacer / Expanded 的兄弟 Flexible、对齐类 Align、定位类 Positioned、
 * IndexedStack、SafeArea、SelectableText、RichText、InkWell、Banner、Dialog。
 *
 * 这些是新手写界面时的「填空工具」：不用它们也能做出来，
 * 但会用之后代码会短一半、也不容易出现魔法数字。
 */
export const extraComponents: ComponentDoc[] = [
  {
    slug: 'spacer',
    name: 'Spacer',
    title: '弹性空白',
    summary: 'Row / Column 里的"橡皮筋空隙"。占满剩余空间并把自己撑开，用来把两边内容顶到尽头。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['空白', 'spacer', '撑开', '间距', 'flex'],
    highlights: [
      '本质就是 Expanded(child: SizedBox.shrink())，但意图更清楚',
      'flex 可以加权：两个 Spacer(flex:1) 和 (flex:2) 会按 1:2 分配空白',
      '在 Row 里想「左边文字 + 右边按钮」用它，比 MainAxisAlignment.spaceBetween 更可控',
    ],
    whenToUse: {
      do: [
        'Row 里把右侧元素顶到最右边',
        'Column 里把底部按钮顶到屏幕底部',
        '需要按比例分配空白 —— 用 flex 加权',
      ],
      dont: [
        'Row 里有超长文字 —— Spacer 不换行，文字还是会溢出，此时要用 Expanded',
        '只是想要固定间距 —— 用 SizedBox(width: 8) 更明确',
      ],
    },
    props: [
      { name: 'flex', type: 'int', def: '1', desc: '分配权重；多个 Spacer 按权重分剩余空间' },
    ],
    demos: [
      {
        title: 'Row 两端对齐 / Column 底部顶住',
        note: 'Spacer 比 MainAxisAlignment.spaceBetween 好在哪里：' +
          '当你有三个元素、但只想让「第一个和第三个」分开时，spaceBetween 做不到，Spacer 可以。',
        code: `// 1 左标题 + 右按钮
Row(
  children: [
    const Text('收货地址'),
    const Spacer(),                    // ← 把后面的推到底
    TextButton(onPressed: editAddress, child: const Text('修改')),
  ],
)

// 2 三个元素，只想让后两个靠右：spaceBetween 做不到
Row(
  children: [
    const Icon(Icons.location_on_outlined),
    const SizedBox(width: 8),
    const Text('广州市天河区'),
    const Spacer(),
    TextButton(onPressed: copy, child: const Text('复制')),
  ],
)

// 3 内容在上、按钮吸底
Column(
  children: [
    const AddressForm(),
    const Spacer(),                    // ← 把按钮推到最底
    SizedBox(
      width: double.infinity,
      child: FilledButton(onPressed: submit, child: const Text('保存')),
    ),
  ],
)`,
        preview: 'none',
      },
    ],
    related: ['expanded', 'flexible', 'row', 'column'],
  },

  {
    slug: 'flexible',
    name: 'Flexible',
    title: '弹性尺寸',
    summary: 'Expanded 的"可选项"版本。Expanded 强制占满剩余空间，Flexible 允许子组件比分配到的空间更小。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['弹性', 'flexible', 'expanded', '缩', 'fit'],
    highlights: [
      'Expanded = Flexible(fit: FlexFit.tight)；关键差别就在这个 fit',
      'tight 强制撑满，loose 允许子组件按自己内容收缩 —— 这是它和 Expanded 唯一的区别',
      'Row 里有「图标 + 文字 + 图标」时，文字用 Flexible 才不会把图标挤没',
    ],
    whenToUse: {
      do: [
        '文字可能很短，不希望被拉伸变形 —— 用 Flexible',
        '希望严格等分剩余空间 —— 用 Expanded',
        '需要按比例分配（2:1）—— 两者都可以，给 flex: 2 / flex: 1',
      ],
      dont: [
        '该用 Expanded 的地方写 Flexible —— 会导致短内容不撑满，右边缘参差不齐',
        '把 Flexible 直接放进非 Flex 父级（Column 之外）—— 会报错',
      ],
    },
    notes:
      '判断方法：如果你希望这个子组件的宽度「就是我分到的那么多」，用 Expanded；' +
      '如果「最多我分到的那么多，但内容少时也允许它小一点」，用 Flexible。',
    props: [
      { name: 'flex', type: 'int', def: '1', desc: '分配权重' },
      { name: 'fit', type: 'FlexFit', def: 'FlexFit.loose', desc: 'loose 允许小于分配空间；tight 强制占满（相当于 Expanded）' },
      { name: 'child', type: 'Widget', required: true, desc: '被约束的子组件' },
    ],
    demos: [
      {
        title: 'Expanded 与 Flexible 的实际差别',
        note: '看这个例子：Row 总宽 300，图标 48，还剩 252。' +
          '如果文字用 Flexible，文字短的时候右边会留白；用 Expanded 则文字容器一定撑满到 252。',
        code: `// ✅ Flexible：文字短，容器就短，右边留白 —— 适合内容本身不需要撑满的场景
Row(
  children: [
    const Icon(Icons.label, size: 48),
    Flexible(
      child: Text(
        shortName,                       // "A"
        style: const TextStyle(backgroundColor: Color(0x22000000)),
      ),
    ),
  ],
)

// ✅ Expanded：无论文字多长，容器永远撑满剩余宽度
Row(
  children: [
    const Icon(Icons.label, size: 48),
    Expanded(
      child: Text(
        longDescription,                 // 长文字
        maxLines: 1,
        overflow: TextOverflow.ellipsis, // 一定要给，否则还是溢出
      ),
    ),
  ],
)

// ✅ 按比例分配：左边占 2 份，右边占 1 份
Row(
  children: [
    Expanded(flex: 2, child: Text(title)),
    const SizedBox(width: 12),
    Expanded(flex: 1, child: Text(subtitle)),
  ],
)`,
        preview: 'none',
      },
    ],
    related: ['expanded', 'spacer', 'row'],
  },

  {
    slug: 'align',
    name: 'Align',
    title: '单子对齐',
    summary: '把单个子组件摆到父级空间的任意位置。相对于 Center（只居中），Align 能指定任意对齐点。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['对齐', 'align', '位置', 'alignment'],
    highlights: [
      'Alignment 坐标系：(-1,-1) 左上， (0,0) 正中， (1,1) 右下',
      'widthFactor / heightFactor 让 Align 按子组件尺寸的倍数收缩，避免撑满父级',
      'Center 就是 Align(alignment: Alignment.center) 的语法糖',
    ],
    whenToUse: {
      do: [
        '在 Stack 或固定尺寸盒子内把内容放到某个角',
        '文字内容想左对齐但整体居中 —— 用 Align(alignment: Alignment.centerLeft)',
        '需要按比例偏移（比如放在 30% 高度处）—— 用 Alignment(0, -0.4)',
      ],
      dont: [
        '只是想居中 —— 用 Center，语义更直白',
        'Column 里想让内容左对齐 —— 用 crossAxisAlignment，用 Align 是绕远路',
      ],
    },
    props: [
      { name: 'alignment', type: 'AlignmentGeometry', def: 'Alignment.center', desc: '对齐点，用 Alignment(x, y)，x/y ∈ [-1, 1]' },
      { name: 'child', type: 'Widget?', desc: '被对齐的子组件' },
      { name: 'widthFactor', type: 'double?', desc: '宽度 = 子组件宽度 × 该值；给了才能让 Align 不撑满' },
      { name: 'heightFactor', type: 'double?', desc: '同理，控制高度收缩' },
    ],
    demos: [
      {
        title: 'Alignment 的坐标系与常见用法',
        note: '记住这张"九宫格"：x 从左到右是 -1 → 0 → 1，y 从上到下是 -1 → 0 → 1。' +
          '想放中上就是 Alignment(0, -1)。',
        code: `// Alignment 九宫格
//    (-1,-1)  (0,-1)  (1,-1)      topLeft    topCenter    topRight
//    (-1, 0)  (0, 0)  (1, 0)   =  centerLeft center       centerRight
//    (-1, 1)  (0, 1)  (1, 1)      bottomLeft bottomCenter bottomRight

// 1 固定高度的横幅里，标题靠左下角
SizedBox(
  height: 160,
  child: DecoratedBox(
    decoration: const BoxDecoration(
      image: DecorationImage(
        image: NetworkImage(bannerUrl),
        fit: BoxFit.cover,
      ),
    ),
    child: const Align(
      alignment: Alignment.bottomLeft,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text(
          '限时 5 折',
          style: TextStyle(color: Colors.white, fontSize: 22),
        ),
      ),
    ),
  ),
)

// 2 想按比例定位（放到 70% 高度处），用小数
Align(
  alignment: const Alignment(0, 0.4),
  child: Text('标记位置'),
)

// 3 空状态：图标在中间偏上，文字在下面
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    const Icon(Icons.inbox_outlined, size: 64, color: Color(0xFFC0C4CC)),
    const SizedBox(height: 12),
    Align(
      alignment: Alignment.center,
      child: Text('还没有数据', style: TextStyle(color: Colors.grey.shade600)),
    ),
  ],
)`,
        preview: 'none',
      },
    ],
    related: ['center', 'stack', 'positioned'],
  },

  {
    slug: 'positioned',
    name: 'Positioned',
    title: '绝对定位',
    summary: '只在 Stack 里面用。通过 top/left/right/bottom 把子组件钉到父级的某条边上。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['定位', 'positioned', 'stack', '悬浮', '绝对'],
    highlights: [
      '必须直接是 Stack 的 children，放在别的容器里会报 "Positioned must be a descendant of Stack"',
      '不写 width 只写 left+right，子组件会被拉伸到两边之间 —— 这是最实用的技巧',
      '不写 top 只写 bottom，就是"吸附底部"；配合 left+right 可做吸底横幅',
    ],
    whenToUse: {
      do: [
        '图片上叠角标、播放按钮、渐变蒙层',
        '悬浮在列表右下角的"回到顶部"按钮',
        '需要盖在别的内容之上的弹层',
      ],
      dont: [
        '普通的两栏/三栏布局 —— 用 Row，Positioned 会导致父级尺寸塌陷',
        '需要跟随滚动的悬浮按钮 —— 用 Scaffold.floatingActionButton，Positioned 会被滚动带走',
      ],
    },
    notes:
      'Stack 的尺寸由「非 Positioned 的子组件」决定。如果 Stack 里全是 Positioned，' +
      'Stack 会缩到最小 —— 这是"悬浮按钮不见了"的最常见原因。',
    props: [
      { name: 'left / top / right / bottom', type: 'double?', desc: '到四条边的距离；同时给 left+right 会拉伸宽度' },
      { name: 'width / height', type: 'double?', desc: '显式尺寸；与同方向的 left+right 不能同时用' },
      { name: 'child', type: 'Widget', required: true, desc: '被定位的子组件' },
    ],
    demos: [
      {
        title: '商品图：左上角折扣标 + 底部渐变蒙层',
        note: '注意底部蒙层同时给了 left/right/bottom —— 这样它会横向拉满、只顶住下边。' +
          '如果只给 bottom，它会按自己内容宽高摆在下边中间。',
        code: `SizedBox(
  height: 200,
  child: Stack(
    children: [
      // 背景图 —— 非 Positioned，由它决定 Stack 的尺寸
      Positioned.fill(
        child: Image.network(product.imageUrl, fit: BoxFit.cover),
      ),

      // 左上角折扣标签
      Positioned(
        left: 0,
        top: 12,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: const BoxDecoration(
            color: Color(0xFFF56C6C),
            borderRadius: BorderRadius.only(
              topRight: Radius.circular(4),
              bottomRight: Radius.circular(4),
            ),
          ),
          child: Text(
            '\${product.discount}% OFF',
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ),
      ),

      // 底部渐变蒙层 + 标题：left+right+bottom 一起给才能横向拉满
      Positioned(
        left: 0,
        right: 0,
        bottom: 0,
        child: Container(
          padding: const EdgeInsets.fromLTRB(12, 32, 12, 12),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Colors.transparent, Colors.black54],
            ),
          ),
          child: Text(
            product.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(color: Colors.white, fontSize: 16),
          ),
        ),
      ),

      // 右上角收藏按钮
      Positioned(
        right: 8,
        top: 8,
        child: IconButton(
          icon: Icon(
            product.isFavorite ? Icons.favorite : Icons.favorite_border,
            color: product.isFavorite ? Colors.red : Colors.white,
          ),
          onPressed: toggleFavorite,
        ),
      ),
    ],
  ),
)`,
        preview: 'none',
      },
      {
        title: '回到顶部按钮：注意 Stack 的尺寸陷阱',
        note: '第一个 Positioned.fill 里的 SizedBox.expand 是"占位子"，' +
          '保证 Stack 有明确尺寸。没有它，悬浮按钮会跑到屏幕左上角。',
        code: `Stack(
  children: [
    // 占位：让 Stack 撑满可用空间
    const Positioned.fill(child: SizedBox.expand()),

    ListView.builder(
      controller: _controller,
      itemCount: items.length,
      itemBuilder: (_, i) => ItemTile(items[i]),
    ),

    // 用 ValueListenableBuilder 让按钮随滚动显隐，且不重建整个列表
    Positioned(
      right: 16,
      bottom: 24,
      child: ValueListenableBuilder<double>(
        valueListenable: _scrollNotifier,
        builder: (context, offset, _) => AnimatedOpacity(
          opacity: offset > 400 ? 1 : 0,
          duration: const Duration(milliseconds: 200),
          child: IgnorePointer(
            // 隐藏时不响应点击，否则会挡住下面的内容
            ignoring: offset <= 400,
            child: FloatingActionButton.small(
              onPressed: () => _controller.animateTo(
                0,
                duration: const Duration(milliseconds: 400),
                curve: Curves.easeOut,
              ),
              child: const Icon(Icons.arrow_upward),
            ),
          ),
        ),
      ),
    ),
  ],
)`,
        preview: 'none',
      },
    ],
    related: ['stack', 'align', 'scaffold'],
  },

  {
    slug: 'indexed-stack',
    name: 'IndexedStack',
    title: '索引堆栈',
    summary: '在多个页面/组件间切换，但保留所有子组件的状态。用底部导航切 tab 时，它是"不准丢状态"的标准答案。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['indexedstack', 'tab', '状态保持', '切换', '底部导航'],
    highlights: [
      '所有子组件都在树上，只是只显示 index 指定的那个 —— 所以 State 不会丢',
      '代价是首帧会构建全部子组件；如果某个 tab 很重，要用懒加载包装',
      '和 BottomNavigationBar / NavigationBar 搭配是官方推荐做法',
    ],
    whenToUse: {
      do: [
        '底部导航切 tab，希望滚到一半的列表、填了一半的表单都还在',
        'tab 数量固定（2~5 个）—— 数量多时全部构建的代价太大',
      ],
      dont: [
        '需要页面切换动画 —— IndexedStack 是瞬间切换，没有过渡',
        'tab 页面很重（比如都带视频播放器）—— 用 PageView + AutomaticKeepAliveClientMixin 更省',
      ],
    },
    notes:
      '判断要不要用它，问一个问题：用户切回来时，希望看到「之前的状态」还是「重新开始」？' +
      '前者用 IndexedStack，后者直接换 widget 就行。',
    props: [
      { name: 'index', type: 'int?', def: '0', desc: '显示第几个子组件' },
      { name: 'children', type: 'List<Widget>', required: true, desc: '所有页面，index 对不上会显示空白' },
      { name: 'alignment', type: 'AlignmentGeometry', def: 'AlignmentDirectional.topStart', desc: '子组件在自身空间内的对齐方式' },
      { name: 'sizing', type: 'StackFit', def: 'StackFit.loose', desc: '非定位子组件如何被约束' },
    ],
    demos: [
      {
        title: '底部导航 + 状态保持（最常用的组合）',
        note: '这里解决了一个经典问题：切到"分类"填了搜索条件，切到"我的"再切回来，条件应该还在。' +
          'IndexedStack 天然满足；如果你用的是 children[index] 直接取，条件就没了。',
        code: `class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});
  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  var _index = 0;

  // 常量列表放在外面，避免每次 build 都重建 widget 树
  static const _pages = [
    HomePage(),
    CategoryPage(),
    CartPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ✅ 关键：IndexedStack 让四个页面同时存在于树上，
      //    每个页面的 State、滚动位置、输入内容都会被保留
      body: IndexedStack(index: _index, children: _pages),

      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: '首页',
          ),
          NavigationDestination(
            icon: Icon(Icons.category_outlined),
            selectedIcon: Icon(Icons.category),
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
        preview: 'none',
      },
      {
        title: 'tab 很重时的懒加载包装',
        note: 'IndexedStack 会一次性构建全部子组件。如果某个 tab 要发请求、初始化播放器，' +
          '可以用「访问过才真正构建」的方式推迟。',
        code: `class LazyIndexedStack extends StatefulWidget {
  const LazyIndexedStack({
    super.key,
    required this.index,
    required this.children,
  });

  final int index;
  final List<Widget> children;

  @override
  State<LazyIndexedStack> createState() => _LazyIndexedStackState();
}

class _LazyIndexedStackState extends State<LazyIndexedStack> {
  /// 记录「哪些下标被访问过」。没访问过的用空白占位，不构建真身。
  late final _visited = <int>{widget.index};

  @override
  void didUpdateWidget(covariant LazyIndexedStack old) {
    super.didUpdateWidget(old);
    _visited.add(widget.index);
  }

  @override
  Widget build(BuildContext context) {
    return IndexedStack(
      index: widget.index,
      children: [
        for (var i = 0; i < widget.children.length; i++)
          if (_visited.contains(i)) widget.children[i] else const SizedBox.shrink(),
      ],
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['stack', 'navigation-bar', 'bottom-navigation-bar'],
  },

  {
    slug: 'safe-area',
    name: 'SafeArea',
    title: '安全区',
    summary: '自动给内容加内边距，避开刘海、挖孔、底部手势条。全屏布局和底部按钮必须用。',
    category: 'layout',
    import: 'package:flutter/material.dart',
    tags: ['安全区', 'safearea', '刘海', '手势条', '避让'],
    highlights: [
      '它做的事情就是把 MediaQuery.padding 翻译成 Padding —— 所以你也可以手动做，但没必要',
      '四个方向可以按需开关：只关心底部就 top: false, bottom: true',
      'minimum 用来保证「至少留这么多」，即使系统没给安全区也有呼吸空间',
    ],
    whenToUse: {
      do: [
        '底部固定按钮 —— 不加会被 iPhone 的手势条压住',
        '全屏背景图 + 内容覆盖 —— 图片铺满，内容用 SafeArea 包',
        '横向滚动列表 —— 横屏时左右也有安全区',
      ],
      dont: [
        '已经用了 Scaffold 的 body —— Scaffold 已经帮你避开系统栏，再套一层会留出多余空白',
        '需要背景色延伸到安全区里 —— 那就把 SafeArea 放在内容层而不是根层',
      ],
    },
    notes:
      '最常见的过度使用：Scaffold(body: SafeArea(child: ...))。' +
      'Scaffold 本身已经处理了顶部（AppBar）和底部（bottomNavigationBar）。' +
      '套两层的结果是内容凭空多出 20~30px 空白，看着像"没对齐"。',
    props: [
      { name: 'top / bottom / left / right', type: 'bool', def: 'true', desc: '是否在该方向避让安全区' },
      { name: 'minimum', type: 'EdgeInsets', def: 'EdgeInsets.zero', desc: '在安全区基础上再保证的最小内边距' },
      { name: 'maintainBottomViewPadding', type: 'bool', def: 'false', desc: '键盘弹出时是否仍保留底部安全区（避免跳动）' },
      { name: 'child', type: 'Widget', required: true, desc: '内容' },
    ],
    demos: [
      {
        title: '底部操作栏：正确写法',
        note: 'bottomNavigationBar 里的内容不会有任何安全区保护，' +
          '所以这里必须自己包 SafeArea —— 这是 iPhone 上最常见的"按钮被挡住"来源。',
        code: `Scaffold(
  appBar: AppBar(title: const Text('确认订单')),
  body: const OrderSummary(),

  // ❌ 错的：iPhone 上会被底部手势条压住
  // bottomNavigationBar: Padding(
  //   padding: EdgeInsets.all(16),
  //   child: FilledButton(...),
  // ),

  // ✅ 对的：SafeArea 负责避让，minimum 负责视觉呼吸
  bottomNavigationBar: SafeArea(
    minimum: const EdgeInsets.fromLTRB(16, 8, 16, 12),
    child: SizedBox(
      height: 48,
      child: FilledButton(
        onPressed: submit,
        child: const Text('提交订单'),
      ),
    ),
  ),
)

// 只关心底部，顶部由 AppBar 负责
SafeArea(
  top: false,
  child: BottomActionBar(),
)

// 全屏图 + 内容避让
Stack(
  children: [
    Positioned.fill(child: Image.asset('assets/bg.png', fit: BoxFit.cover)),
    SafeArea(
      minimum: const EdgeInsets.all(20),
      child: const LoginContent(),
    ),
  ],
)`,
        preview: 'none',
      },
    ],
    related: ['scaffold', 'media-query', 'bottom-navigation-bar'],
  },

  {
    slug: 'selectable-text',
    name: 'SelectableText',
    title: '可选中文本',
    summary: '用户能长按选中、复制的文字。订单号、地址、错误堆栈这类"要给别人看"的内容必须用它。',
    category: 'general',
    import: 'package:flutter/material.dart',
    tags: ['文本', 'selectable', '复制', '选中', '文案'],
    highlights: [
      'Text 是不可选中的 —— 这在 Web 端用户眼中很反直觉',
      '长按会弹出「复制/全选」系统菜单，不需要自己写 clipboard 代码',
      'SelectionArea 可以一次性让整棵子树都变成可选中，比逐个替换成 SelectableText 省事',
    ],
    whenToUse: {
      do: [
        '订单号、快递单号、邀请码、地址、错误信息 —— 需要被复制的内容',
        '整篇协议、帮助文档 —— 直接在外层套 SelectionArea',
        '需要自定义选区菜单 —— 配 contextMenuBuilder',
      ],
      dont: [
        '普通正文 —— SelectableText 会带来额外的选区层开销，没必要',
        '里面套 Text —— 应该直接把文字写进 SelectableText 的 text 参数',
      ],
    },
    props: [
      { name: 'text', type: 'String', required: true, desc: '要显示的文字内容' },
      { name: 'style', type: 'TextStyle?', desc: '同 Text' },
      { name: 'textAlign', type: 'TextAlign?', desc: '同 Text' },
      { name: 'maxLines / overflow', type: 'int? / TextOverflow?', desc: '同 Text' },
      { name: 'enableInteractiveSelection', type: 'bool', def: 'true', desc: '设为 false 就等价于普通 Text' },
      { name: 'showCursor', type: 'bool', def: 'false', desc: '显示光标，看起来像输入框' },
      { name: 'contextMenuBuilder', type: 'EditableTextContextMenuBuilder?', desc: '自定义长按菜单，比如加个「分享」' },
      { name: 'onTap', type: 'VoidCallback?', desc: '点击回调' },
    ],
    demos: [
      {
        title: '订单号可复制 + 整页可选中',
        note: '两个层次：单个字段要复制用 SelectableText；' +
          '整页文档想可选中，直接在页面根上套 SelectionArea，子树里所有 Text 都自动可选。',
        code: `// 1 单个字段：订单号必须能让用户复制去投诉/查询
ListTile(
  title: const Text('订单号'),
  subtitle: SelectableText(
    order.sn,
    style: const TextStyle(
      fontFamily: 'monospace',
      letterSpacing: 0.5,
    ),
  ),
  trailing: IconButton(
    icon: const Icon(Icons.copy_outlined),
    tooltip: '复制订单号',
    onPressed: () async {
      await Clipboard.setData(ClipboardData(text: order.sn));
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('已复制订单号')),
      );
    },
  ),
)

// 2 整页可选中：一份协议页面
class AgreementPage extends StatelessWidget {
  const AgreementPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('用户协议')),
      // SelectionArea 让子树里所有 Text 都变成可选中，
      // 不需要把几十处 Text 逐个换成 SelectableText
      body: SelectionArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(agreement.title, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              for (final section in agreement.sections)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Text(section, style: const TextStyle(height: 1.7)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}`,
        preview: 'none',
      },
    ],
    related: ['text', 'rich-text'],
  },

  {
    slug: 'rich-text',
    name: 'RichText / Text.rich',
    title: '富文本',
    summary: '一段文字里混用多种样式。价格数字大、单位小、协议里的链接高亮，都靠它。',
    category: 'general',
    import: 'package:flutter/material.dart',
    tags: ['富文本', 'richtext', 'textspan', 'span', '混排'],
    highlights: [
      'Text.rich 比 RichText 更好用：它会自动继承 DefaultTextStyle，不用手动给 base style',
      'TextSpan 的 children 是递归的 —— 可以无限嵌套，样式逐层叠加',
      'GestureRecognizer 挂在 span 上就有局部点击，但必须记得 dispose（用 TapGestureRecognizer 时）',
    ],
    whenToUse: {
      do: [
        '价格：¥ 小、数字大、小数点后两位更小',
        '一段话里有可点击的"《用户协议》"',
        '标签 + 内容混排，且要求整体作为一个段落换行',
      ],
      dont: [
        '只是想让两个 widget 并排不同样式 —— 用 Row 更简单，别为了省一层就上 TextSpan',
        '富文本里需要换行对齐复杂布局 —— 用 WidgetSpan 塞 widget，或干脆用 Row/Column',
      ],
    },
    notes:
      'Text.rich 与 RichText 的区别：RichText 需要你手动指定 style（否则用默认的粗黑体），' +
      'Text.rich 会沿用外面的 DefaultTextStyle。日常用 Text.rich。',
    props: [
      { name: 'textSpan', type: 'InlineSpan', required: true, desc: 'Text.rich 的参数名，传 TextSpan' },
      { name: 'text', type: 'String?', desc: 'TextSpan 的文字；有 children 时通常不写' },
      { name: 'children', type: 'List<InlineSpan>?', desc: '子 span，样式叠加在父 span 之上' },
      { name: 'style', type: 'TextStyle?', desc: '当前 span 的样式' },
      { name: 'recognizer', type: 'GestureRecognizer?', desc: '点击手势；需在 State.dispose 里释放' },
      { name: 'semanticsLabel', type: 'String?', desc: '无障碍朗读文本 —— 富文本强烈建议给' },
      { name: 'WidgetSpan', type: '—', desc: '一种特殊 span，可以内嵌任意 Widget（图标、按钮）' },
    ],
    demos: [
      {
        title: '价格 / 协议链接 / WidgetSpan 插图标',
        note: '注意第 3 个例子里 WidgetSpan 的 alignment —— ' +
          '图标默认是 baseline 对齐，会跟文字底部对不齐，通常要改成 middle。',
        code: `// 1 价格：¥ 小、整数大、小数更小更淡
Text.rich(
  TextSpan(
    children: [
      const TextSpan(
        text: '¥ ',
        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      ),
      TextSpan(
        text: '1299',
        style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
      ),
      const TextSpan(
        text: '.00',
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Color(0xFF909399),
        ),
      ),
    ],
  ),
  style: const TextStyle(color: Color(0xFFF56C6C), height: 1),
)

// 2 协议勾选行：中间的《用户协议》可点
class AgreementCheckbox extends StatefulWidget {
  const AgreementCheckbox({super.key});
  @override
  State<AgreementCheckbox> createState() => _AgreementCheckboxState();
}

class _AgreementCheckboxState extends State<AgreementCheckbox> {
  var _agreed = false;
  late final TapGestureRecognizer _agreementTap;

  @override
  void initState() {
    super.initState();
    _agreementTap = TapGestureRecognizer()
      ..onTap = () => Navigator.pushNamed(context, '/agreement');
  }

  @override
  void dispose() {
    // ⚠️ GestureRecognizer 不是 Widget，不会被自动回收，
    //    不 dispose 会内存泄漏（flutter analyze 也会警告）
    _agreementTap.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: _agreed,
          onChanged: (v) => setState(() => _agreed = v ?? false),
        ),
        Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _agreed = !_agreed),
            child: Text.rich(
              TextSpan(
                children: [
                  const TextSpan(text: '我已阅读并同意 '),
                  TextSpan(
                    text: '《用户协议》',
                    style: const TextStyle(color: Color(0xFF0E7490)),
                    recognizer: _agreementTap,
                  ),
                  const TextSpan(text: ' 与 '),
                  TextSpan(
                    text: '《隐私政策》',
                    style: const TextStyle(color: Color(0xFF0E7490)),
                    recognizer: TapGestureRecognizer()
                      ..onTap = () => Navigator.pushNamed(context, '/privacy'),
                  ),
                ],
              ),
              style: const TextStyle(fontSize: 13, color: Color(0xFF606266)),
              semanticsLabel: '我已阅读并同意用户协议与隐私政策',
            ),
          ),
        ),
      ],
    );
  }
}

// 3 WidgetSpan：文字中间插一个小图标
Text.rich(
  TextSpan(
    children: [
      WidgetSpan(
        // 默认是 baseline 对齐，图标往往会往下沉，改成 middle
        alignment: PlaceholderAlignment.middle,
        child: Icon(Icons.verified, size: 16, color: Color(0xFF67C23A)),
      ),
      const TextSpan(text: ' 官方旗舰店'),
    ],
  ),
  style: const TextStyle(fontSize: 13),
)`,
        preview: 'none',
      },
    ],
    related: ['text', 'selectable-text'],
  },

  {
    slug: 'ink-well',
    name: 'InkWell / GestureDetector',
    title: '点击响应',
    summary: '给任意组件加点击。InkWell 带 Material 水波纹反馈，GestureDetector 不带但支持更复杂的手势。',
    category: 'general',
    import: 'package:flutter/material.dart',
    tags: ['点击', 'inkwell', 'gesture', 'onTap', '水波纹', '涟漪'],
    highlights: [
      'InkWell 的水波纹需要 Material 祖先 —— 放在 Container 里会被颜色盖住看不见',
      '要用 Material + Ink + InkWell 的组合，或把 InkWell 放到 Container 外面',
      'GestureDetector 支持 onPan / onScale / onLongPress 等，但没有视觉反馈',
    ],
    whenToUse: {
      do: [
        '自定义卡片要能点 —— 用 InkWell，视觉反馈符合 Material 规范',
        '拖拽、缩放手势 —— 用 GestureDetector',
        '只是要一个"能点但不该有水波纹"的区域 —— GestureDetector(behavior: HitTestBehavior.opaque)',
      ],
      dont: [
        '已经有专门组件的场景去套 InkWell（按钮、ListTile 自带点击）',
        'ink 层被 Container 的颜色盖住时硬用 InkWell —— 会"点了没反应"的错觉',
      ],
    },
    notes:
      '水波纹看不见的排查顺序：1) 外面有没有 Material 祖先？' +
      '2) 有没有 Container 的 color 在 InkWell 之上（那就是它盖住了）？' +
      '3) 点击区域是不是被别的 widget 抢走了命中测试？',
    props: [
      { name: 'onTap', type: 'GestureTapCallback?', desc: '单击' },
      { name: 'onDoubleTap', type: 'GestureTapCallback?', desc: '双击' },
      { name: 'onLongPress', type: 'GestureLongPressCallback?', desc: '长按 —— 滑动删除、呼出菜单' },
      { name: 'onTapDown / onTapCancel', type: 'GestureTapDownCallback?', desc: '按下 / 取消，用于自绘按压态' },
      { name: 'borderRadius', type: 'BorderRadius?', desc: '水波纹的圆角，要和外层容器一致才不"越界"' },
      { name: 'splashColor / highlightColor', type: 'Color?', desc: '水波纹 / 按压高亮色' },
      { name: 'behavior', type: 'HitTestBehavior', def: 'deferToChild', desc: 'GestureDetector 用；opaque 让整块区域都能响应（子组件透明也算）' },
    ],
    demos: [
      {
        title: '水波纹被盖住的经典 bug 与修法',
        note: '把 Container 换成 Material + Ink 的组合就行：Material 负责提供 elevation 裁剪，' +
          'Ink 负责画出那个颜色的背景 —— 而 Ink 的背景会画在 InkWell 的水波纹之下。',
        code: `// ❌ 错：Container 的 color 画在 InkWell 之上，水波纹被完全盖住
InkWell(
  onTap: openDetail,
  child: Container(
    color: Colors.white,
    padding: const EdgeInsets.all(16),
    child: const Text('点了没有任何反馈'),
  ),
)

// ✅ 对：Material 提供 ink 层，Ink 提供背景色
Material(
  color: Colors.white,
  child: InkWell(
    onTap: openDetail,
    child: const Padding(
      padding: EdgeInsets.all(16),
      child: Text('有水波纹了'),
    ),
  ),
)

// ✅ 另一种常用写法：InkWell 套在外面 + 自带圆角
Material(
  color: Colors.transparent,
  child: InkWell(
    borderRadius: BorderRadius.circular(12),
    onTap: openDetail,
    child: Ink(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE4E7ED)),
      ),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(child: Text('产品卡片')),
            Icon(Icons.chevron_right),
          ],
        ),
      ),
    ),
  ),
)`,
        preview: 'none',
      },
      {
        title: 'GestureDetector 做滑动删除 + 全区域可点',
        note: 'HitTestBehavior.opaque 是解决"点了没反应"的另一把钥匙：' +
          '当子组件是透明的（比如 Column 里的空白），默认情况下那片空白不接收点击，' +
          '设为 opaque 后整块矩形区域都能响应。',
        code: `// 1 左滑出现删除
Dismissible(
  key: ValueKey(item.id),
  direction: DismissDirection.endToStart,
  background: Container(
    alignment: Alignment.centerRight,
    padding: const EdgeInsets.only(right: 24),
    color: const Color(0xFFF56C6C),
    child: const Icon(Icons.delete_outline, color: Colors.white),
  ),
  confirmDismiss: (_) async {
    // 返回 false 可以撤销这次滑动（比如用户取消了确认框）
    return await showConfirmDialog(context, '确定删除这条记录？');
  },
  onDismissed: (_) => removeItem(item),
  child: ListTile(title: Text(item.title)),
)

// 2 整块区域可点（包含空白）
GestureDetector(
  // deferToChild 时，透明区域的点击会被"穿透"到下层；
  // opaque 让这块矩形自己吞掉所有点击
  behavior: HitTestBehavior.opaque,
  onTap: openDetail,
  child: const Padding(
    padding: EdgeInsets.all(24),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('标题'),
        SizedBox(height: 40),          // 这块空白也应该能点
        Text('副标题'),
      ],
    ),
  ),
)`,
        preview: 'none',
      },
    ],
    related: ['card', 'text', 'icon-button'],
  },

  {
    slug: 'banner',
    name: 'MaterialBanner',
    title: '横幅提示',
    summary: '从页面顶部推下来的横幅，带操作按钮。适合"需要用户决策且不能忽略"的提示，比如无网络、要续费。',
    category: 'feedback',
    import: 'package:flutter/material.dart',
    tags: ['横幅', 'banner', '提示', '公告', '离线'],
    highlights: [
      '和 SnackBar 的核心区别：Banner 不自动消失、在顶部、必须给操作按钮',
      '通过 ScaffoldMessenger.showMaterialBanner 显示，返回一个 controller 用来手动关闭',
      'content 里可以放多行文字，适合解释原因 + 给出解决方案',
    ],
    whenToUse: {
      do: [
        '离线状态、需要在恢复后重试 —— Banner 常驻直到问题解决',
        '试用到期、需要升级才能继续 —— 必须让用户看到并做决定',
        '需要「立即处理 / 稍后」两个动作',
      ],
      dont: [
        '操作成功的轻提示 —— 用 SnackBar（会自动消失）',
        '表单字段级的校验错误 —— 用 TextField 的 errorText',
        '一次要显示多条 —— Banner 会排队，用户要一条条关，体验很差',
      ],
    },
    notes:
      'ScaffoldMessenger 会缓存 Banner。如果网络反复断开重连，可能堆一串 Banner。' +
      '正确做法是：先 removeCurrentMaterialBanner() 再 show，或用一个标志位保证只显示一条。',
    props: [
      { name: 'content', type: 'Widget', required: true, desc: '横幅正文，通常 Text' },
      { name: 'actions', type: 'List<Widget>', required: true, desc: '操作按钮，至少一个' },
      { name: 'leading', type: 'Widget?', desc: '左侧图标' },
      { name: 'backgroundColor / textStyle', type: 'Color? / TextStyle?', desc: '底色与文字样式' },
      { name: 'forceActionsBelow', type: 'bool', def: 'false', desc: '把按钮放到文字下方而不是右侧（文字长时用）' },
      { name: 'overflowAlignment', type: 'MaterialBannerOverflowAlignment', desc: '空间不够时按钮靠哪边' },
    ],
    demos: [
      {
        title: '离线横幅：只显示一条 + 恢复后自动关闭',
        note: '关键在 _withBanner 标志位。没有它，网络抖动会连续调 show 好几次，' +
          '用户要连点好几次"重试"才能把横幅清干净。',
        code: `class ConnectivityBanner extends StatefulWidget {
  const ConnectivityBanner({super.key, required this.child});
  final Widget child;

  @override
  State<ConnectivityBanner> createState() => _ConnectivityBannerState();
}

class _ConnectivityBannerState extends State<ConnectivityBanner> {
  var _withBanner = false;
  MaterialBanner? _banner;

  @override
  void initState() {
    super.initState();
    _subscription = Connectivity().onConnectivityChanged.listen(_onChanged);
  }

  void _onChanged(List<ConnectivityResult> results) {
    if (!mounted) return;
    final offline = results.every((r) => r == ConnectivityResult.none);

    if (offline && !_withBanner) {
      _withBanner = true;
      _banner = MaterialBanner(
        leading: const Icon(Icons.wifi_off_outlined, color: Color(0xFFF56C6C)),
        content: const Text('当前无网络连接，部分内容可能无法加载'),
        actions: [
          TextButton(
            onPressed: () => retryLoad(),
            child: const Text('重试'),
          ),
        ],
      );
      ScaffoldMessenger.of(context).showMaterialBanner(_banner!);
    } else if (!offline && _withBanner) {
      _withBanner = false;
      // 网络恢复后主动收起，不要让用户手动点
      ScaffoldMessenger.of(context).removeCurrentMaterialBanner();
    }
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}`,
        preview: 'none',
      },
    ],
    related: ['snack-bar', 'alert-dialog'],
  },

  {
    slug: 'dialog',
    name: 'Dialog',
    title: '自定义弹窗',
    summary: 'AlertDialog 之外的弹窗基类。需要自定义版式（输入框、多选项、带图）时用它。',
    category: 'feedback',
    import: 'package:flutter/material.dart',
    tags: ['弹窗', 'dialog', '模态', 'modal', 'popup'],
    highlights: [
      'Dialog 只给一个圆角白盒 + 内边距，里面布局完全自己定',
      'insetPadding 控制弹窗距屏幕边缘的最小距离，宽屏上很重要',
      'barrierDismissible: false 让用户必须做出选择（点遮罩不关）',
    ],
    whenToUse: {
      do: [
        '弹窗里要有输入框、多个单选、日期选择 —— 用 Dialog 自己搭',
        '需要在小屏上占满宽度、大屏上居中固定宽度 —— 用 insetPadding + ConstrainedBox',
        '需要非模态的浮层 —— 用 showMenu / showModalBottomSheet 更合适',
      ],
      dont: [
        '只是问"确定吗"—— 用 AlertDialog，语义清楚',
        '需要底部弹出的选择列表 —— 用 showModalBottomSheet',
      ],
    },
    notes:
      'showDialog 的 builder 里拿到的 context 是「弹窗自己的」context，' +
      '关闭时要用 Navigator.of(dialogContext).pop()，而不是外层的 context。',
    props: [
      { name: 'child', type: 'Widget', required: true, desc: '弹窗内容（含自己的 padding 与圆角需求）' },
      { name: 'insetPadding', type: 'EdgeInsets', def: 'EdgeInsets.symmetric(horizontal: 40, vertical: 24)', desc: '距屏幕边缘的最小距离' },
      { name: 'backgroundColor', type: 'Color?', desc: '弹窗底色' },
      { name: 'elevation', type: 'double?', desc: '阴影高度' },
      { name: 'shape', type: 'ShapeBorder?', desc: '圆角形状' },
      { name: 'clipBehavior', type: 'Clip', def: 'Clip.none', desc: '内容裁剪方式；有图片圆角时要设 antiAlias' },
    ],
    demos: [
      {
        title: '带输入框的自定义弹窗（含键盘避让）',
        note: '两个易错点：1) 弹窗内容要用 SingleChildScrollView 包，否则键盘弹起时溢出；' +
          '2) 关闭要用 dialogContext 而不是外层 context。',
        code: `Future<String?> showRemarkDialog(
  BuildContext context, {
  String? initial,
}) {
  return showDialog<String>(
    context: context,
    barrierDismissible: false,      // 必须做选择，点遮罩不关
    builder: (dialogContext) {
      final controller = TextEditingController(text: initial);

      return Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: ConstrainedBox(
          // 限制最大宽度，平板上不会变成一条横条
          constraints: const BoxConstraints(maxWidth: 400),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,   // ← 不加会撑满屏幕
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('添加备注', style: Theme.of(dialogContext).textTheme.titleMedium),
                const SizedBox(height: 16),

                // 键盘弹起时这块可以滚，避免 Overflow
                Flexible(
                  child: SingleChildScrollView(
                    child: TextField(
                      controller: controller,
                      maxLines: 4,
                      maxLength: 200,
                      autofocus: true,
                      decoration: const InputDecoration(
                        hintText: '请输入备注内容',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      // ⚠️ 用 dialogContext，用外层 context 会把整个页面 pop 掉
                      onPressed: () => Navigator.of(dialogContext).pop(),
                      child: const Text('取消'),
                    ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: () => Navigator.of(dialogContext)
                          .pop(controller.text.trim()),
                      child: const Text('确定'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}

// 调用方：注意返回值可能是 null（点了取消或按了返回键）
final remark = await showRemarkDialog(context, initial: order.remark);
if (!context.mounted) return;
if (remark != null) {
  setState(() => order = order.copyWith(remark: remark));
}`,
        preview: 'none',
      },
    ],
    related: ['alert-dialog', 'bottom-sheet', 'text-field'],
  },
];
