import type { Chapter } from './types';

/**
 * Flutter 讲解 · 内容
 *
 * 三段：
 *   第 0 章 基础    —— 一切皆 Widget、Widget 树、build 方法、BuildContext
 *   第 1 章 组件封装 —— 自定义组件、参数设计、const、组合优于继承、布局约束
 *   第 2 章 进阶    —— 状态放哪、生命周期、性能、常见反模式
 */
export const flutterTutorial: Chapter[] = [
  /* ══════════════════════════════════════════════════════ */
  {
    id: 'f-ch0',
    no: '第 0 章',
    title: 'Flutter 的心智模型',
    lead: '这一章要建立的，是一张能画在纸上的图：代码如何一步步变成屏幕上的像素。',
    sections: [
      {
        id: 'f-what',
        title: '0.1 Flutter 是什么：和 React Native / 原生有什么不同',
        level: '基础',
        summary:
          '先搞清楚「它为什么能做到一套代码两端一致」，后面很多设计就顺理成章了。',
        blocks: [
          {
            kind: 'p',
            html: '最常见的误解是「Flutter 也是调用系统原生控件」。<b>不是。</b>React Native 会把 JS 组件映射成 iOS/Android 的原生按钮；Flutter 走的是另一条路 —— <b>它自己带了一套渲染引擎，直接画像素。</b>',
          },
          {
            kind: 'term',
            items: [
              {
                term: '自带渲染引擎',
                desc: 'Flutter 用 Skia（新版是 Impeller）直接绘制到画布。不经过系统控件，所以 iOS 和 Android 上的外观<b>长得一模一样</b>，不会出现「安卓上好看、iOS 上歪了」。',
              },
              {
                term: '没有「平台原生控件」这层',
                desc: '你写的 <code>ElevatedButton</code> 不是 iOS 的 UIButton，也不是 Android 的 MaterialButton —— 它是 Flutter 自己画出来的。这带来一致性，代价是「原生质感」要靠框架自己模拟。',
              },
              {
                term: 'Dart 单线程 + 事件循环',
                desc: '业务代码跑在一个 isolate 里，靠事件循环调度。所以<b>不要写阻塞主线程的死循环或重计算</b>，那会直接卡住界面。',
              },
              {
                term: '两端同一份代码，但布局要自己适配',
                desc: '代码一样不代表布局能偷懒。手机竖屏、平板、折叠屏都要考虑 —— 这是 0.5 节和「布局约束」会讲的。',
              },
            ],
          },
          {
            kind: 'table',
            head: ['对比项', 'Flutter', 'React Native', '原生开发'],
            rows: [
              ['渲染方式', '自绘引擎', '映射原生控件', '直接用系统控件'],
              ['两端一致性', '完全一致', '大部分一致', '各自实现'],
              ['开发体验', '热重载秒级', '热重载较快', '编译较慢'],
              ['性能', '接近原生', '有桥接开销', '最好'],
              ['包体积', '较大（含引擎）', '中等', '最小'],
              ['语言', 'Dart', 'JavaScript / TS', 'Swift / Kotlin'],
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>「自绘」还有一个实际好处：</b>做自定义 UI 时你可以完全控制每一个像素 —— 想要一个奇形怪状的进度条、非标准的动画曲线，都不用跟系统控件较劲。这也是 Flutter 做「设计感强的 App」特别顺手的原因。',
          },
          {
            kind: 'keypoints',
            title: '这一节要记住的',
            items: [
              'Flutter 自己画界面，不是调用原生控件 —— 这是两端一致的根源。',
              '业务代码在主 isolate 上跑，重活要挪走（用 <code>compute</code> 或 isolate）。',
              '一致性是优点，但布局适配仍要自己做，别指望框架自动解决。',
            ],
          },
        ],
      },

      {
        id: 'f-widget',
        title: '0.2 一切皆 Widget：界面是「配置」不是「对象」',
        level: '基础',
        summary:
          '这是 Flutter 最反直觉、也最关键的一点。想通它，后面所有设计都顺理成章。',
        blocks: [
          {
            kind: 'p',
            html: '在 Android / iOS 原生开发里，一个按钮是一个<b>真实存在的对象</b>，它有自己的内存、自己的生命周期，你直接改它的属性。Flutter 不是这样：你写的 <code>ElevatedButton</code> <b>只是一份描述</b> —— 「这里应该有一个这样的按钮」。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/widget_idea.dart',
            code: `// 你写的这段代码，运行时并不会「变成一个按钮对象」
ElevatedButton(
  onPressed: () {},
  child: const Text('提交'),
)

// 它的真实身份是：一份不可变的配置（Widget）
// Flutter 拿到这份配置 → 生成 Element → 生成 RenderObject → 画到屏幕上
//
// 所以：
//   ✅ 每次 rebuild 都会 new 一个新的 Widget 对象 —— 这非常便宜，别怕
//   ❌ 不要试图「拿到按钮对象然后改它」—— Widget 本来就是一次性的
//
// 这也是为什么字段要标 final：一份配置改了就该是另一份配置。`,
          },
          {
            kind: 'p',
            html: '<b>理解这一点，很多事情立刻说得通了。</b>为什么 Widget 的字段要 final？因为一份配置改了就该是另一份。为什么重建整棵树不卡？因为「建一份配置」本来就很便宜，真正贵的是后面两步，而那两步框架会做 diff 复用。',
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>三棵树，记住名字就够：</b><br><b>Widget 树</b> —— 你写的代码，不可变的配置。<br><b>Element 树</b> —— 框架维护的「这一帧对应哪个 Widget」，负责 diff 和复用。<br><b>RenderObject 树</b> —— 真正负责测量、布局、绘制。<br>你写的代码只碰第一棵；后两棵是框架的事。',
          },
          {
            kind: 'code',
            lang: 'dart',
            code: `你的代码                    框架
─────────────              ──────────────────────
ElevatedButton(...)   ──►   Widget    「我想长这样」
                                │
                                ▼
                            Element   「和上一帧比，要改什么」  ← 复用发生在这里
                                │
                                ▼
                          RenderObject 「量多大、画在哪」
                                │
                                ▼
                             屏幕像素`,
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 想「拿到控件对象改它」（原生思维）',
              code: `// 这是 Android/iOS 的写法，
// Flutter 里没有对应的东西
_myButton.text = '新文字';
_myButton.setEnabled(false);

// Flutter 里你做不到，也不该做
// —— 因为 ElevatedButton 只是
//    一次性使用的「配置描述」`,
            },
            good: {
              title: '✅ 改「配置」然后重建',
              code: `String _label = '提交';
bool _enabled = true;

// 想改界面 = 改数据 + 告诉框架重算
void _update() => setState(() {
  _label = '新文字';
  _enabled = false;
});

// build 里根据最新数据生成新配置
ElevatedButton(
  onPressed: _enabled ? _onTap : null,
  child: Text(_label),
)`,
            },
            note:
              '一句话概括 Flutter 的编程模型：<b>你不操作界面，你描述界面</b>。数据变了就重新描述一遍，框架负责算出最小改动量。',
          },
        ],
      },

      {
        id: 'f-tree',
        title: '0.3 Widget 树：界面是一层套一层搭出来的',
        level: '基础',
        summary:
          'Flutter 没有「样式表」，也没有「绝对定位优先」的布局。一切排版都靠嵌套 —— 外层给约束，内层决定自己多大。',
        blocks: [
          {
            kind: 'p',
            html: '你在组件文档里看到的所有示例，本质都是同一件事：把若干个 Widget 套起来。下面这段代码，把「一行图标 + 文字」放到一张卡片里，再放进页面中央：',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/tree.dart',
            code: `Scaffold(                        // 页面骨架（AppBar / body / 底部栏）
  appBar: AppBar(title: const Text('商品')),
  body: Center(                  // 居中
    child: Card(                 // 卡片（圆角 + 阴影）
      child: Padding(            // 内边距
        padding: const EdgeInsets.all(16),
        child: Row(              // 横向排列
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.local_cafe),          // 图标
            const SizedBox(width: 8),        // 间距（一个「什么都没有」的盒子）
            const Text('拿铁'),              // 文字
          ],
        ),
      ),
    ),
  ),
)`,
          },
          {
            kind: 'p',
            html: '把它画成树是这样 —— 这正是 Flutter DevTools 里 Widget Inspector 给你看的东西：',
          },
          {
            kind: 'code',
            lang: 'dart',
            code: `Scaffold
├── AppBar
│   └── Text("商品")
└── body: Center
         └── Card
              └── Padding
                   └── Row
                        ├── Icon
                        ├── SizedBox(width: 8)   ← 用「空盒子」占位是 Flutter 的惯用手法
                        └── Text("拿铁")`,
          },
          {
            kind: 'table',
            head: ['你想干什么', '用哪个 Widget', '为什么'],
            rows: [
              ['加内边距', '<code>Padding</code>', '只管一件事，语义最清晰'],
              ['加固定间距', '<code>SizedBox(width/height)</code>', '比 Padding 更轻，且能当占位'],
              ['要背景色 + 圆角 + 边距组合', '<code>Container</code>', '它就是 Padding/Decorator/ConstrainedBox 的组合体'],
              ['居中', '<code>Center</code> / <code>Align</code>', 'Center 是 Align 的简写'],
              ['横向排列', '<code>Row</code>', '主轴水平'],
              ['纵向排列', '<code>Column</code>', '主轴垂直'],
              ['层层叠（后画的在上）', '<code>Stack</code> + <code>Positioned</code>', '像绝对定位'],
              ['可滚动', '<code>ListView</code> / <code>SingleChildScrollView</code>', '内容多时必须要'],
            ],
          },
          {
            kind: 'note',
            tone: 'ok',
            html:
              '<b>为什么用 <code>SizedBox</code> 加间距，而不是给 Text 加 margin？</b>因为 Flutter 里大多数 Widget 根本没有 margin 这个属性。间距、边距、对齐、约束，都是「套一层专门的 Widget」来表达的。<code>Padding</code> 管内边距，<code>Container</code> 管更综合的一套，<code>SizedBox</code> 管固定尺寸或占位。习惯这种「一层管一件事」的写法后，布局代码会变得很好读。',
          },
        ],
      },

      {
        id: 'f-build',
        title: '0.4 build 方法：它会被调用很多次，所以必须便宜',
        level: '基础',
        summary:
          '理解这一点，就理解了 Flutter 里 90% 的性能规则 —— build 里不要做重活，不要有副作用。',
        blocks: [
          {
            kind: 'p',
            html: '<code>build</code> 不是「初始化」，而是「描述当前这一帧长什么样」。框架随时可能调它：窗口大小变了、主题变了、父组件重建了、你调了 <code>setState</code>。所以你写的东西必须满足两条：<b>快</b>、<b>可重复执行</b>。',
          },
          {
            kind: 'code',
            filename: 'lib/widgets/bad_good_build.dart',
            code: `// ❌ 反面教材：build 里干重活 / 有副作用
@override
Widget build(BuildContext context) {
  final total = computeExpensiveTotal();     // ❌ 每次 rebuild 都算一遍
  Analytics.track('page_view');              // ❌ 副作用：可能被上报几十次
  http.get('/api/cart').then(...);           // ❌ 发请求更不行，会疯狂重复请求
  return Text('\$total');
}

// ✅ 正确做法
class CartSummary extends StatefulWidget {
  const CartSummary({super.key});
  @override
  State<CartSummary> createState() => _CartSummaryState();
}

class _CartSummaryState extends State<CartSummary> {
  late final double _total = _computeExpensiveTotal();  // ① 只算一次

  @override
  void initState() {
    super.initState();
    Analytics.track('page_view');                        // ② 副作用放这
    _load();
  }

  Future<void> _load() async { /* ③ 异步也放这 */ }

  @override
  Widget build(BuildContext context) {
    return Text('\$_total');                             // ④ build 只负责描述
  }
}`,
          },
          {
            kind: 'table',
            head: ['该做的事', '该放哪'],
            rows: [
              ['一次性计算、昂贵的初始化', '<code>late final _x = ...</code> 或 <code>initState</code>'],
              ['发网络请求 / 订阅事件', '<code>initState</code>；取消订阅放 <code>dispose</code>'],
              ['上报埋点', '<code>initState</code>'],
              ['读取 <code>context</code> 依赖（主题、尺寸）', '<code>build</code> 里 —— 它本来就是描述界面'],
              ['把数据算成 Widget', '<code>build</code> 里 —— 但要便宜，能提前算好就提前'],
              ['修改状态触发重建', '<code>setState</code> / 状态管理'],
            ],
          },
          {
            kind: 'keypoints',
            title: '判断一段代码该放哪，问自己三个问题',
            items: [
              '<b>它会不会改变外部状态？</b>会 → 不能放 build（build 可能被调用任意多次）。',
              '<b>它贵不贵？</b>贵 → 提前算好或用 <code>late final</code>，别每次都重算。',
              '<b>它需要 context 吗？</b>需要（读主题、尺寸）→ 只能在 build 里，那就要保证它便宜。',
            ],
          },
        ],
      },

      {
        id: 'f-context',
        title: '0.5 BuildContext：它是「我在树里的位置」',
        level: '基础',
        summary:
          '到处都是 context，但没人解释它是什么。理解后就明白为什么它能在 await 之后失效。',
        blocks: [
          {
            kind: 'p',
            html: '<code>BuildContext</code> 不是「页面对象」，也不是「全局环境」。它是<b>这个 Widget 在树上的坐标</b> —— 用来向上查找「祖先们」提供的东西。你写的 <code>Theme.of(context)</code>，意思就是「从我这个位置往上找，第一个提供 Theme 的祖先」。',
          },
          {
            kind: 'code',
            code: `MyApp (MaterialApp, 提供了 Theme / Navigator / MediaQuery ...)
  └── HomePage (context 指向这里)
       └── Card
            └── Text   ← 在 Text 的 build 里调用 Theme.of(context)
                         实际是：从这个位置向上找 Theme

// 所以这也是合法的 —— 你可以主动「换一个坐标」
Theme(
  data: ThemeData(colorScheme: ...),
  child: Builder(                      // Builder：拿一个新的 context
    builder: (innerContext) => Text(
      '现在这里用的是内层主题',           // 因为坐标变了
      style: Theme.of(innerContext).textTheme.bodyLarge,
    ),
  ),
)`,
          },
          {
            kind: 'code',
            filename: 'lib/scratch/of_context.dart',
            code: `// 「of(context)」这套 API 是 Flutter 的依赖注入方式。
// 常见的有：
Theme.of(context)              // 主题
MediaQuery.of(context)         // 屏幕信息
Navigator.of(context)          // 路由
ScaffoldMessenger.of(context)  // 弹 SnackBar
DefaultTabController.of(context)
Provider.of<T>(context) / context.watch<T>()  // 状态（Riverpod/Provider）

// 两个经验：
// 1. 能不用 of 的地方就别用 —— 它会让这个 Widget 依赖祖先，
//    祖先一变就要重建（这也是「性能」一节要讲的）
// 2. 想缩小依赖范围，就把用了 context 的那一小块拆成子 Widget`,
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ await 之后直接用 context',
              code: `Future<void> submit() async {
  final data = await api.load();
  Navigator.of(context).pop();   // 可能已经崩了
  ScaffoldMessenger.of(context).showSnackBar(...);
  // ⚠️ await 期间用户可能已经返回，
  // 这个页面已销毁，context 随之失效`,
            },
            good: {
              title: '✅ 提前取出来 + 判断还活着',
              code: `Future<void> submit() async {
  // ① 先拿到要用的东西
  final nav = Navigator.of(context);
  final messenger = ScaffoldMessenger.of(context);

  // ② 再 await
  final data = await api.load();

  // ③ 判断页面还活着
  if (!mounted) return;      // Widget 方法里用 context.mounted
  nav.pop(data);
  messenger.showSnackBar(...);
}`,
            },
            note:
              '两种写法都对：<b>提前取出来</b>（推荐，最稳）或 <b>判断 <code>mounted</code></b>。区别是提前取出来之后，即使 context 失效了，<code>nav</code> 对象本身仍然可用。',
          },
        ],
      },

      {
        id: 'f-hotreload',
        title: '0.6 热重载、热重启：开发时最该掌握的两个操作',
        level: '基础',
        summary:
          '知道什么时候按 r、什么时候按 R，能省下大量等待时间。也能帮你理解「什么变了会丢状态」。',
        blocks: [
          {
            kind: 'table',
            head: ['操作', '快捷键', '做了什么', '状态'],
            rows: [
              ['热重载 Hot Reload', '<code>r</code>（小写）', '把改动的代码注入运行中的 App，只重建 Widget', '<b>保留</b>'],
              ['热重启 Hot Restart', '<code>R</code>（大写）', '重启整个 App 的 Dart 部分', '<b>清空</b>'],
              ['完全重启', '停止再 <code>flutter run</code>', '重新编译安装原生部分', '清空'],
            ],
          },
          {
            kind: 'list',
            items: [
              '<b>改界面、改样式、改 build 逻辑</b> → 热重载就够了（<code>r</code>），当前页面状态还在，效率极高。',
              '<b>改了全局变量初始化、<code>main()</code>、状态管理的 Provider 声明</b> → 必须热重启（<code>R</code>），否则可能行为不一致。',
              '<b>改了原生代码、加了新依赖、改了 <code>pubspec.yaml</code></b> → 完全重启。',
              '<b>热重载不生效时</b>：先试 <code>R</code>；还不行就完全重启。偶尔的「改了没反应」多半是这个原因，不是你写错了。',
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>为什么热重载能保留状态？</b>因为它只替换了「描述」（Widget），没动 Element 树和 State 对象。这也是为什么<b>热重载后 <code>initState</code> 不会重新跑</b> —— 如果你的改动依赖 <code>initState</code> 里的逻辑，就会看不到效果。改这类代码记得用 <code>R</code>。',
          },
          {
            kind: 'keypoints',
            title: '顺带理解「状态为什么重要」',
            items: [
              '热重载能保留状态，是因为 State 对象没被销毁 —— 这恰好演示了「State 的生命周期比 Widget 长」。',
              '改 <code>initState</code> 里的代码要热重启，因为 <code>initState</code> 不会再跑一遍。',
              '这解释了为什么「改一个字段就该用 setState」而不是直接赋值：直接赋值不会触发重建。',
            ],
          },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════ */
  {
    id: 'f-ch1',
    no: '第 1 章',
    title: '组件封装',
    lead: '这一章回答「怎么写出别人愿意用的组件」。这是从「会写 Flutter」到「能扛项目」的分水岭。',
    sections: [
      {
        id: 'f-custom',
        title: '1.1 写你自己的第一个组件',
        level: '基础',
        summary: '把重复的界面抽成一个类。三分钟就能学会，但获益是从此刻开始持续的。',
        blocks: [
          {
            kind: 'p',
            html: '先看没有封装的代码 —— 同一个「图标 + 标题 + 副标题」的结构，在两个地方各写了一遍：',
          },
          {
            kind: 'code',
            filename: 'lib/pages/home_page.dart（未封装）',
            code: `// 每次都要写这一坨
ListTile(
  leading: CircleAvatar(child: Icon(Icons.person)),
  title: const Text('个人资料'),
  subtitle: const Text('头像、昵称、手机号'),
  trailing: const Icon(Icons.chevron_right),
  onTap: () => go('/profile'),
),
const Divider(),
ListTile(
  leading: CircleAvatar(child: Icon(Icons.settings)),
  title: const Text('设置'),
  subtitle: const Text('通知、缓存、关于'),
  trailing: const Icon(Icons.chevron_right),
  onTap: () => go('/settings'),
),`,
          },
          {
            kind: 'p',
            html: '封装之后，调用方只关心「表达什么」，不再关心「怎么画」：',
          },
          {
            kind: 'code',
            filename: 'lib/widgets/setting_tile.dart',
            code: `class SettingTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  const SettingTile({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(child: Icon(icon)),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

// ── 调用方
SettingTile(
  icon: Icons.person,
  title: '个人资料',
  subtitle: '头像、昵称、手机号',
  onTap: () => go('/profile'),
)`,
          },
          {
            kind: 'keypoints',
            title: '封装带来的不只是「少写代码」',
            items: [
              '<b>单点修改</b>：设计说「所有列表项图标改成圆角矩形」，你只改 <code>SettingTile</code> 一处，全站一致。',
              '<b>语义清晰</b>：读代码的人看到 <code>SettingTile(icon:..., title:...)</code> 就知道这是设置项，不用去数 ListTile 的五个参数。',
              '<b>容易统一风格</b>：间距、字号、圆角都固化在组件里，不会出现「这个页面 16、那个页面 14」。',
              '<b>方便替换实现</b>：以后要换一套 UI，只改组件内部，调用方完全不用动。',
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>什么时候该抽组件？</b>一个经验规则：<b>同一段结构在项目里出现第 2 次，就该抽出来。</b>第 1 次先写着，第 2 次出现时你已经知道哪些参数要变、哪些是固定的 —— 这时候抽出来的组件质量最高。急着在第 1 次就抽，往往会设计出难用的参数。',
          },
        ],
      },

      {
        id: 'f-props',
        title: '1.2 参数怎么设计：必填、可选、给不给默认值',
        level: '基础',
        summary: '组件的参数列表就是它的 API。设计得好，用的人不会用错；设计得差，迟早出 bug。',
        blocks: [
          {
            kind: 'list',
            items: [
              '<b>必填的用 <code>required</code></b>：忘传直接编译报错，这是最便宜的防护。',
              '<b>可选给默认值</b>：<code>this.padding = EdgeInsets.zero</code>，用的人不必关心。',
              '<b>回调用可空 <code>VoidCallback?</code></b>：null 表示「不给点击」。不要给个空函数当默认值 —— 那会让「禁用态」没法表达。',
              '<b>布尔参数超过两个就危险</b>：<code>showX / showY / showZ</code> 组合起来是 8 种情况，没人测得完。改用命名构造或枚举。',
              '<b>不要把整个对象传进去当万能参数</b>：<code>ProductCard(product: p)</code> 比 <code>ProductCard(data: anyMap)</code> 好，因为编译器能替你检查字段名。',
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 布尔开关爆炸',
              code: `class PriceTag extends StatelessWidget {
  final double price;
  final bool showCurrency;
  final bool showDiscount;
  final bool big;
  // 用的人得记住 showCurrency: true,
  // showDiscount: false, big: true 是啥效果；
  // 再加一个 bool 组合数就翻倍`,
            },
            good: {
              title: '✅ 用变体固化常见组合',
              code: `enum PriceTagSize { normal, large }

class PriceTag extends StatelessWidget {
  final double price;
  final double? originalPrice;   // 传了才显示划线价
  final PriceTagSize size;

  // 布尔表达不出的「互斥状态」用 enum，
  // 「有/没有」用可空字段，
  // 组合数从 2^n 降到 1`,
            },
          },
          {
            kind: 'code',
            filename: 'lib/widgets/price_tag.dart',
            code: `class PriceTag extends StatelessWidget {
  final double price;
  final double? originalPrice;      // 传了才显示划线价
  final PriceTagSize size;

  const PriceTag({
    super.key,
    required this.price,
    this.originalPrice,
    this.size = PriceTagSize.normal,
  });

  bool get _hasDiscount => originalPrice != null && originalPrice! > price;

  @override
  Widget build(BuildContext context) {
    final large = size == PriceTagSize.large;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('¥\$price', style: large ? Theme.of(context).textTheme.titleLarge : null),
        if (_hasDiscount) ...[                    // 集合里的 if：条件渲染的惯用手法
          const SizedBox(width: 6),
          Text(
            '¥\$originalPrice',
            style: const TextStyle(decoration: TextDecoration.lineThrough),
          ),
        ],
      ],
    );
  }
}`,
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b><code>if</code> 和 <code>for</code> 可以直接写在 <code>children</code> 列表里。</b>这是 Dart 集合语法的用法，Flutter 里极其常见：<code>children: [A, if (cond) B, for (final x in list) C(x)]</code>。比写 <code>cond ? B : SizedBox()</code> 清爽得多，也不会留下占位 Widget。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 用三目 + 空盒子占位',
              code: `Row(
  children: [
    const Icon(Icons.info),
    showHint
        ? const Text('提示')
        : const SizedBox.shrink(),
    // 多一个「什么都不画」的 Widget，
    // 白占一个 Element 节点
  ],
)`,
            },
            good: {
              title: '✅ 用集合 if',
              code: `Row(
  children: [
    const Icon(Icons.info),
    if (showHint) const Text('提示'),
    // 条件不成立时，这个元素
    // 压根不存在，节点更少
  ],
)`,
            },
            note:
              '需要「展开多个元素」时用 <code>if (cond) ...[A, B]</code> —— 三个点把列表展开进来。',
          },
        ],
      },

      {
        id: 'f-const',
        title: '1.3 const 构造函数：最便宜的性能优化',
        level: '基础',
        summary: '加一个 const 不会改变行为，但能实质减少重建开销。这是投入产出比最高的一条。',
        blocks: [
          {
            kind: 'p',
            html: '当父组件重建时，框架会逐个比较子节点。如果子节点是 <code>const</code> 的，框架在编译期就知道「它永远是同一个实例」，可以直接跳过整个子树的比较 —— 不管这棵子树有多深。',
          },
          {
            kind: 'code',
            filename: 'lib/widgets/const_demo.dart',
            code: `// ❌ 每次 rebuild 都新建一个 Padding 和 Text
Column(children: [
  Padding(
    padding: const EdgeInsets.all(16),
    child: Text('不会变的一行字'),
  ),
  ExpensiveChart(data: _data),
])

// ✅ 整棵不变的子树标 const —— 框架直接跳过它
Column(children: [
  const Padding(
    padding: EdgeInsets.all(16),
    child: Text('不会变的一行字'),
  ),
  ExpensiveChart(data: _data),      // 这个会变，保留
])`,
          },
          {
            kind: 'list',
            items: [
              '<b>IDE 会提示你</b>：VSCode / Android Studio 里有 lint 提示 <code>prefer_const_constructors</code>，看到就可以加。',
              '<b>项目一开始就打开 lint</b>：在 <code>analysis_options.yaml</code> 里启用 <code>flutter_lints</code>，它会帮你盯着。',
              '<b>别为了 const 牺牲可读性</b>：如果一段代码为了能标 const 而变得难懂，就不标。它的收益是渐进的，不是必须。',
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 整个 Column 都重建',
              code: `Widget build(BuildContext context) {
  return Column(children: [
    // 这三个永远不变，但每次
    // rebuild 都新建一遍对象
    Padding(padding: EdgeInsets.all(16),
      child: Text('标题')),
    SizedBox(height: 8),
    Text('副标题'),
    // 只有这个会变
    Text('计数: \$_count'),
  ]);
}`,
            },
            good: {
              title: '✅ 不变的标 const',
              code: `Widget build(BuildContext context) {
  return Column(children: [
    // 一棵 const 子树，框架
    // 直接跳过比较
    const Padding(
      padding: EdgeInsets.all(16),
      child: Text('标题'),
    ),
    const SizedBox(height: 8),
    const Text('副标题'),
    Text('计数: \$_count'),
  ]);
}`,
            },
          },
          {
            kind: 'note',
            tone: 'ok',
            html:
              '<b>怎么判断「这棵子树不变」：</b>看它依赖不依赖「每次 build 都变的变量」（比如 <code>setState</code> 改的字段、<code>context</code> 读到的实时尺寸）。不依赖 → 大胆 <code>const</code>。',
          },
        ],
      },

      {
        id: 'f-compose',
        title: '1.4 组合优于继承：为什么 Widget 靠「套」而不是「继承」',
        level: '进阶',
        summary: '你几乎永远不该继承 ElevatedButton 去改它的样式。这个反直觉的结论背后有明确理由。',
        blocks: [
          {
            kind: 'p',
            html: '很多人的第一反应是：我想改按钮的样式，那就 <code>class MyButton extends ElevatedButton</code>。这条路在 Flutter 里是错的，因为 Widget 的构造函数参数太多、太耦合，继承会把所有细节曝光给子类，而且样式改动会散布在继承链的各层。',
          },
          {
            kind: 'code',
            filename: 'lib/widgets/app_button.dart',
            code: `// ❌ 继承：脆弱、难改、和框架版本绑定
class MyPrimaryButton extends ElevatedButton {
  MyPrimaryButton({required super.onPressed, required super.child});
  // 想改圆角？得去 override 一堆东西
}

// ✅ 组合：包一层，把「我们项目的按钮规格」固化下来
class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool loading;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    // 真正在用的时候：还是那个官方 ElevatedButton，只是参数由我们统一决定
    return ElevatedButton(
      onPressed: loading ? null : onPressed,     // 加载中自动禁用
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(0, 48),          // 统一高度
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: Theme.of(context).colorScheme.primary,   // ← 跟着主题走
      ),
      child: loading
          ? const SizedBox(
              width: 18, height: 18,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            )
          : Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (icon != null) ...[Icon(icon, size: 18), const SizedBox(width: 6)],
                Text(label),
              ],
            ),
    );
  }
}`,
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>顺带解决了一个真实需求：加载态。</b>「提交按钮点击后转圈、期间不可点」是几乎每个项目都要的。如果每次都手写 <code>onPressed: _loading ? null : _submit</code>，总有地方会漏。封装成 <code>loading</code> 参数后，这个逻辑只存在一处。',
          },
          {
            kind: 'p',
            html: '同理，<b>「继承 StatefulWidget」也不是为了复用代码</b>，而是因为你需要可变状态。复用永远优先用组合、mixin，而不是继承。',
          },
          {
            kind: 'table',
            head: ['你可能想做', '正确做法', '不要做'],
            rows: [
              ['改按钮样式', '包一层 + <code>styleFrom</code>', '<code>extends ElevatedButton</code>'],
              ['给多个组件加同一个能力', '写 mixin <code>with</code> 进去', '抽一个共同父类'],
              ['复用一段布局', '抽成无状态 Widget', '写一个返回 Widget 的静态方法（会丢 const 与热重载）'],
              ['统一 spacing / 颜色', '放在 <code>ThemeData</code> 或常量类', '每个组件各自写死'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b><code>Widget _buildXxx() { return ...; }</code> 这种「方法拆组件」是有代价的。</b>它只是把代码挪了个地方，并没有产生独立的 Widget 节点 —— 所以这棵子树<b>无法被 <code>const</code> 优化</b>，出了错也不好定位。拆成独立 Widget 类才是正解。',
          },
        ],
      },

      {
        id: 'f-constraint',
        title: '1.5 布局约束：为什么我的 Widget 会出现「溢出」黄黑条纹',
        level: '进阶',
        summary: '这是新手最常见的报错。理解了「约束向下、尺寸向上」这一条规则，就不会再被它拦住。',
        blocks: [
          {
            kind: 'p',
            html: 'Flutter 的布局只有一条核心规则，记住它：<b>父组件向下传递约束（最大/最小宽高），子组件向上汇报自己的尺寸。</b>父组件不能强制子组件长多大，只能给它一个范围。',
          },
          {
            kind: 'code',
            lang: 'dart',
            code: `父组件 → 子组件：  你最多可以 375 宽、最大高度无限
子组件 → 父组件：  那我要 400 宽

→ 400 > 375，装不下 → RenderFlex overflowed（黄黑条纹）`,
          },
          {
            kind: 'code',
            filename: 'lib/scratch/overflow.dart',
            code: `// ❌ 经典溢出：Row 里有长文字，宽度超了
Row(children: [
  const Icon(Icons.info),
  const Text('这是一段非常非常非常长的说明文字，超出了屏幕宽度'),
])

// ✅ 方案一：让文字可伸缩（最常用）
Row(children: [
  const Icon(Icons.info),
  const Expanded(                       // 占满剩余空间，会自动换行
    child: Text('这是一段非常非常非常长的说明文字，超出了屏幕宽度'),
  ),
])

// ✅ 方案二：单行截断（列表项必备）
Row(children: [
  const Icon(Icons.info),
  Expanded(
    child: Text(
      '这是一段非常长的说明文字',
      maxLines: 1,
      overflow: TextOverflow.ellipsis,    // 超出显示 …
    ),
  ),
])

// ✅ 方案三：本来就该滚动的，套一个滚动容器
SizedBox(
  height: 200,
  child: ListView(children: [...]),       // 纵向溢出 → 用 ListView
)`,
          },
          {
            kind: 'table',
            head: ['看到这个报错', '多半是因为', '怎么修'],
            rows: [
              [
                '<code>RenderFlex overflowed ... in Row</code>',
                'Row 里的子项加起来超宽',
                '给会变长的那个包 <code>Expanded</code> / <code>Flexible</code>',
              ],
              [
                '<code>... in Column</code>',
                'Column 里内容超高（且父级高度有限）',
                '<code>Expanded</code> 包住可滚部分，或外层换 <code>ListView</code>',
              ],
              [
                '<code>Vertical viewport was given unbounded height</code>',
                '把 <code>ListView</code> 放进了没高度的容器里',
                '给它一个有界的父级（<code>Expanded</code> / <code>SizedBox(height:)</code>）',
              ],
              [
                '<code>Incorrect use of ParentDataWidget</code>',
                '<code>Expanded</code> 的父级不是 Flex',
                '把 <code>Expanded</code> 直接放到 <code>Row</code> / <code>Column</code> 里',
              ],
              [
                '<code>setState() called after dispose()</code>',
                '异步回来时页面已经销毁',
                '回调开头加 <code>if (!mounted) return;</code>',
              ],
            ],
          },
          {
            kind: 'keypoints',
            title: '记住这几条就不会再被布局拦住',
            items: [
              '<b>约束向下、尺寸向上</b> —— 父给范围，子报尺寸，谁都别越界。',
              '<b>Row/Column 里的「会变长的东西」一律包 <code>Expanded</code></b>（文字、图片、列表都算）。',
              '<b>可滚动组件必须有个「有高度」的父级</b>，否则它不知道自己要滚多长。',
              '<b>黄黑条纹在 debug 才会出现</b>，release 下是静默裁掉 —— 所以别指望上线后自己好。',
            ],
          },
        ],
      },

      {
        id: 'f-flex',
        title: '1.6 Expanded / Flexible / Spacer：一行里的空间怎么分',
        level: '进阶',
        summary: '这三个是 Row / Column 里最常用也最容易搞混的。用一张表说清。',
        blocks: [
          {
            kind: 'table',
            head: ['组件', '作用', '区别'],
            rows: [
              ['<code>Expanded</code>', '占满剩余空间', '<code>flex: 1</code> 且强制填满'],
              ['<code>Flexible</code>', '可以使用剩余空间', '子组件可以小于分配量（不强制填满）'],
              ['<code>Spacer</code>', '纯占位', '就是 <code>Expanded(child: SizedBox.shrink())</code>'],
            ],
          },
          {
            kind: 'code',
            filename: 'lib/scratch/flex.dart',
            code: `// 常见的「左标题、右按钮」布局
Row(
  children: [
    const Expanded(child: Text('商品名称', maxLines: 1, overflow: TextOverflow.ellipsis)),
    // 标题会自适应宽度，按钮保持原大小
    TextButton(onPressed: () {}, child: const Text('编辑')),
  ],
)

// 按比例分空间：标题占 3 份，副标题占 2 份
Row(
  children: const [
    Expanded(flex: 3, child: Text('主标题')),
    Expanded(flex: 2, child: Text('副标题')),
  ],
)

// 让两个元素一左一右（用 Spacer 撑开）
Row(
  children: [
    const Text('左侧'),
    const Spacer(),           // 把右边顶到最右
    const Text('右侧'),
  ],
)

// 注意：Expanded 的「填满」有时会带来副作用 ——
// 如果你只是想让文字换行、不想撑满，用 Flexible：
Row(
  children: [
    const Icon(Icons.info),
    Flexible(                         // 文字多行换行，但不必填满整行
      child: const Text('一段说明文字'),
    ),
  ],
)`,
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b><code>Expanded</code> 在 Row 里会强制子组件宽度 = 分配到的空间。</b>如果你给 <code>Text</code> 包了 <code>Expanded</code>，它会尝试占满，可能导致「短文字也被拉得很宽」的视觉问题（虽然文字本身靠左）。这种时候改用 <code>Flexible</code>。<b>经验：要换行用 Flexible，要填满用 Expanded。</b>',
          },
        ],
      },

      {
        id: 'f-responsive',
        title: '1.7 适配不同屏幕：MediaQuery、LayoutBuilder 与断点',
        level: '进阶',
        summary: '手机上好看不等于平板 / 折叠屏上好看。这一节给出一套能直接用的适配骨架。',
        blocks: [
          {
            kind: 'p',
            html: 'Flutter 里拿屏幕信息有两个途径：<code>MediaQuery</code>（整个屏幕）和 <code>LayoutBuilder</code>（当前父组件给的空间）。<b>选哪个取决于你想适配「屏幕」还是「这个位置」。</b>',
          },
          {
            kind: 'code',
            filename: 'lib/core/responsive.dart',
            code: `// ── 方案 A：MediaQuery —— 关心整个屏幕
class ScreenInfo {
  static bool isPhone(BuildContext c) => MediaQuery.sizeOf(c).width < 600;
  static bool isTablet(BuildContext c) {
    final w = MediaQuery.sizeOf(c).width;
    return w >= 600 && w < 900;
  }
  static bool isDesktop(BuildContext c) => MediaQuery.sizeOf(c).width >= 900;

  // 安全区（刘海屏 / 底部手势条）
  static EdgeInsets safe(BuildContext c) => MediaQuery.paddingOf(c);
}

// ── 方案 B：LayoutBuilder —— 关心「我这里有多大」
// 更好用：同一个 Widget 放在侧栏（窄）和主区（宽）时能自适应
class AdaptiveRow extends StatelessWidget {
  final Widget left;
  final Widget right;

  const AdaptiveRow({super.key, required this.left, required this.right});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // 宽度够就并排，不够就上下堆
        if (constraints.maxWidth >= 520) {
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: left),
              const SizedBox(width: 16),
              Expanded(child: right),
            ],
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [left, const SizedBox(height: 12), right],
        );
      },
    );
  }
}`,
          },
          {
            kind: 'code',
            filename: 'lib/core/breakpoints.dart',
            code: `// 把断点集中定义，避免各页面各写一套数字
abstract final class Breakpoints {
  static const double phone = 600;    // < 600 手机
  static const double tablet = 900;   // 600-900 平板
  static const double desktop = 1200; // > 1200 桌面/横屏平板
}

// 常用：根据宽度决定栅格列数
int columnsFor(double width) {
  if (width >= Breakpoints.desktop) return 4;
  if (width >= Breakpoints.tablet) return 3;
  if (width >= Breakpoints.phone) return 2;
  return 1;
}

// 用起来（配合 GridView）
LayoutBuilder(
  builder: (context, c) => GridView.builder(
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: columnsFor(c.maxWidth),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
    ),
    itemCount: items.length,
    itemBuilder: (_, i) => ItemCard(items[i]),
  ),
)`,
          },
          {
            kind: 'table',
            head: ['要适配什么', '用什么'],
            rows: [
              ['整个屏幕的宽高', '<code>MediaQuery.sizeOf(context)</code>'],
              ['刘海 / 手势条安全区', '<code>MediaQuery.paddingOf(context)</code>'],
              ['系统字号缩放（无障碍）', '<code>MediaQuery.textScalerOf(context)</code>'],
              ['「我这里」有多大', '<code>LayoutBuilder</code>（推荐）'],
              ['横竖屏', '<code>MediaQuery.orientationOf(context)</code>'],
              ['折叠屏姿态', '<code>MediaQuery.displayFeaturesOf(context)</code>'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>别写死尺寸。</b><code>Container(width: 375)</code> 在平板上是灾难。宽度用 <code>double.infinity</code> + 约束，或用 <code>Flexible</code> / <code>Expanded</code> 让布局自己算。<b>唯一该写死的是「最大宽度」</b>（防止超宽屏上文字拉成一条线）：<code>ConstrainedBox(maxWidth: 720)</code>。',
          },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════ */
  {
    id: 'f-ch2',
    no: '第 2 章',
    title: '进阶：状态、生命周期与性能',
    lead: '到这里你已能写出可用的界面。这一章讲的是「写完之后怎么不出事」。',
    sections: [
      {
        id: 'f-state',
        title: '2.1 StatelessWidget 还是 StatefulWidget：状态该放哪',
        level: '进阶',
        summary:
          '选择的依据不是「要不要变」，而是「这个变化会不会影响界面」。另外，状态尽量往下放。',
        blocks: [
          {
            kind: 'table',
            head: ['情况', '用什么'],
            rows: [
              ['界面纯粹由传入参数决定，自己不记东西', '<code>StatelessWidget</code>'],
              ['有会在运行时变、且变化要反映到界面上的数据', '<code>StatefulWidget</code>'],
              ['只有「这一屏自己用」的临时状态（开关、输入框内容）', '<code>StatefulWidget</code> 的 <code>State</code>'],
              ['多个页面共享的状态（登录用户、购物车）', '状态管理（Riverpod / Provider），见「工程化」'],
              ['只在切换页面间存活的（表单草稿、Tab 位置）', '<code>PageStorage</code> / 提升到父级'],
            ],
          },
          {
            kind: 'code',
            filename: 'lib/widgets/counter.dart',
            code: `class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;               // 状态：变了要重绘

  void _inc() => setState(() => _count++);   // setState 告诉框架「这帧要重算」

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text('\$_count'),
        // 注意：把 setState 拆到子组件里，避免整页重绘
        _IconBtn(onTap: _inc),
      ],
    );
  }
}

// 无状态的小按钮 —— 它自己不记东西，能标 const
class _IconBtn extends StatelessWidget {
  final VoidCallback onTap;
  const _IconBtn({required this.onTap});

  @override
  Widget build(BuildContext context) =>
      IconButton(onPressed: onTap, icon: const Icon(Icons.add));
}`,
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ setState 写在最外层页面',
              code: `class _FormPageState extends State<FormPage> {
  final _nameCtrl = TextEditingController();
  int _tabIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // 输入框每敲一个字都会
      // setState → 整棵树重建
      TextField(
        controller: _nameCtrl,
        onChanged: (_) => setState(() {}),
      ),
      ExpensiveList(),   // 无辜被重建
      ExpensiveChart(),  // 无辜被重建
    ]);
  }
}`,
            },
            good: {
              title: '✅ 状态就放在用到它的地方',
              code: `// 方案一：只需要「值」不需要 setState
// —— 用 ValueListenableBuilder 只重建那一小块
ValueListenableBuilder<TextEditingValue>(
  valueListenable: _nameCtrl,
  builder: (_, value, __) => Text('已输入 \${value.text.length} 字'),
)
// 其余部分完全不受影响

// 方案二：把带状态的部分抽成独立子 Widget，
// setState 只在这个子 Widget 里，
// 重建范围被限制住了`,
            },
            note:
              '<b>状态尽量放在离用它的地方最近的位置。</b>只有那个小计数器需要重绘，就别让整个表单跟着重算 —— 这是 Flutter 性能优化里收益最大的一条。',
          },
          {
            kind: 'note',
            tone: 'bad',
            html:
              '<b><code>setState</code> 的三个硬规定：</b>① 不能在 <code>build</code> 里调（会无限循环）；② 不能异步之后直接调（页面可能已销毁，先 <code>if (!mounted) return;</code>）；③ 传入的函数不能是 async（返回值是 Future，setState 不认）。违反这三条，报错信息通常不明确，很难查。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/setstate_pitfalls.dart',
            code: `// ❌ 在 build 里调 setState —— 无限循环
Widget build(BuildContext context) {
  setState(() => _x++);      // 绝对不行
  return Text('\$_x');
}

// ❌ 传 async 函数给 setState
setState(() async {
  _x = await fetchX();       // 语法能过，但语义是错的
});

// ✅ 正确：await 在外面，setState 只包赋值
Future<void> load() async {
  final x = await fetchX();
  if (!mounted) return;
  setState(() => _x = x);
}`,
          },
        ],
      },

      {
        id: 'f-lifecycle',
        title: '2.2 State 的生命周期：什么时候做什么',
        level: '进阶',
        summary: '只有 4 个方法你真正需要记住，其他都是极少用的边缘情况。',
        blocks: [
          {
            kind: 'code',
            lang: 'dart',
            code: `createState()  ← 创建 State，只调一次
      │
      ▼
 initState()    ← ① 初始化：发请求、订阅、建控制器。此时还没有 context 的尺寸信息
      │
      ▼
 didChangeDependencies()  ← ② 依赖变了（如主题切换）；首次也会调一次
      │
      ▼
   build()      ← ③ 渲染（会被调很多次）
      │
      ▼
 dispose()      ← ④ 销毁：取消订阅、释放控制器。忘了这里 = 内存泄漏`,
          },
          {
            kind: 'code',
            filename: 'lib/pages/chat_page.dart',
            code: `class _ChatPageState extends State<ChatPage> {
  final _scroll = ScrollController();
  StreamSubscription<Msg>? _sub;
  Timer? _poll;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);                  // 监听
    _sub = msgStream.listen(_onMsg);                 // 订阅
    _poll = Timer.periodic(const Duration(seconds: 10), (_) => _refresh());
  }

  @override
  void dispose() {
    _scroll.removeListener(_onScroll);               // 逐个还回去
    _scroll.dispose();                               // 控制器要 dispose
    _sub?.cancel();
    _poll?.cancel();
    super.dispose();                                 // 放最后
  }

  void _onScroll() {}
  void _onMsg(Msg m) {}
  Future<void> _refresh() async {}

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}`,
          },
          {
            kind: 'table',
            head: ['资源', '创建于', '必须在 dispose 里还'],
            rows: [
              ['<code>TextEditingController</code>', '<code>initState</code> 或字段初始化', '<code>controller.dispose()</code>'],
              ['<code>ScrollController</code> / <code>PageController</code>', '字段初始化', '<code>controller.dispose()</code>'],
              ['<code>AnimationController</code>', '<code>initState</code>（需要 vsync）', '<code>controller.dispose()</code>'],
              ['<code>StreamSubscription</code>', '<code>initState</code>', '<code>sub.cancel()</code>'],
              ['<code>Timer</code> / <code>Timer.periodic</code>', '<code>initState</code>', '<code>timer.cancel()</code>'],
              ['<code>FocusNode</code>', '字段初始化', '<code>node.dispose()</code>'],
              ['第三方 SDK 监听器', '<code>initState</code>', '对应的 <code>removeListener</code>'],
            ],
          },
          {
            kind: 'keypoints',
            title: '一条简单规则',
            items: [
              '<b><code>initState</code> 里「拿了什么」，<code>dispose</code> 里就「还什么」。</b>',
              'Controller、Subscription、Timer、Listener 都是有借有还的东西。',
              '养成这个习惯，能避免绝大多数内存泄漏与「页面关了还在跑」的问题。',
              '记忆点：<b>凡是在 <code>initState</code> 里写了 <code>addXxx</code> / <code>listen</code> / <code>periodic</code>，就去 <code>dispose</code> 里找对应的 <code>remove</code> / <code>cancel</code>。</b>',
            ],
          },
        ],
      },

      {
        id: 'f-perf',
        title: '2.3 性能：只做三件事，能解决 95% 的卡顿',
        level: '进阶',
        summary: '不用一上来就研究渲染管线。先把这三件事做了，绝大多数项目的流畅度就够了。',
        blocks: [
          {
            kind: 'p',
            html: '<b>第一件：长列表必须用 <code>.builder</code>。</b>这是 Flutter 里收益最大的一条优化，没有之一。',
          },
          {
            kind: 'code',
            filename: 'lib/pages/product_list.dart',
            code: `// ❌ 一次性把 1000 个 Item 全建出来 —— 首帧卡死
ListView(children: [
  for (final p in products) ProductTile(p),
])

// ✅ 按需构建：只建屏幕上看得见的那几个
ListView.builder(
  itemCount: products.length,
  itemBuilder: (context, i) => ProductTile(products[i]),
)

// ✅ 高度固定时用这个，滚动更顺（省去动态测量）
ListView.builder(
  itemExtent: 72,
  itemCount: products.length,
  itemBuilder: (context, i) => ProductTile(products[i]),
)`,
          },
          {
            kind: 'p',
            html: '<b>第二件：把 <code>setState</code> 的作用范围缩小。</b>见 2.1 的说明。',
          },
          {
            kind: 'p',
            html: '<b>第三件：不变的子树标 <code>const</code>。</b>见 1.3。',
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>怎么知道真的卡了？</b>别靠感觉。开 DevTools（<code>flutter run</code> 时按 <code>p</code>），看 Performance 页的帧耗时：60fps 需要每帧 &lt; 16.7ms。超过就是有问题，再对着上面三条查。',
          },
          {
            kind: 'table',
            head: ['症状', '先查什么'],
            rows: [
              ['首次打开列表就卡一下', '是不是没用 <code>.builder</code>；是不是 <code>itemBuilder</code> 里做了重活'],
              ['输入文字时整页卡', '<code>setState</code> 是不是写在了最外层；<code>TextField</code> 的 <code>onChanged</code> 里做了什么'],
              ['滚动时掉帧', '列表项是不是 <code>const</code> 能用没用；有没有堆太多阴影/模糊（<code>BackdropFilter</code> 很贵）'],
              ['图片多的地方卡', '有没有用 <code>cached_network_image</code>；<code>cacheWidth</code> 有没有设（默认按原图解码，一张 4000px 的图会吃掉几十 MB 内存）'],
              ['页面返回时卡顿', '<code>dispose</code> 里有没有做重活，或者有定时器没取消'],
              ['动画不流畅', '是不是在 <code>build</code> 里建 <code>AnimationController</code>；有没有用 <code>AnimatedBuilder</code> 缩小重建范围'],
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 图片按原图解码（内存杀手）',
              code: `// 后端返回的原图可能是 4000×3000
// 直接塞进 100×100 的框里
Image.network(url)

// 解码后占用内存：
// 4000 × 3000 × 4 字节 ≈ 48 MB
// 列表里放 20 张 → 直接 OOM 崩掉`,
            },
            good: {
              title: '✅ 按显示尺寸解码 + 加缓存',
              code: `CachedNetworkImage(
  imageUrl: url,
  width: 100,
  height: 100,
  // 按实际显示尺寸解码，
  // 内存占用直接降两个数量级
  memCacheWidth: 100,
  memCacheHeight: 100,
  placeholder: (_, __) => const Shimmer(),
  errorWidget: (_, __, ___) => const Icon(Icons.broken_image),
)`,
            },
            note:
              '列表里的图片是 OOM 的头号来源。<b>凡是 <code>Image.network</code> 都该想想：这张图实际要显示多大？</b>能用 <code>cacheWidth</code> / <code>memCacheWidth</code> 就用。',
          },
        ],
      },

      {
        id: 'f-antipattern',
        title: '2.4 几个应该尽早改掉的反模式',
        level: '实战',
        summary: '这些写法能跑、看起来也没问题，但它们会在项目变大后开始收利息。',
        blocks: [
          {
            kind: 'term',
            items: [
              {
                term: '在 build 里创建 Controller / 发请求',
                desc: '每次 rebuild 都是一个新 Controller，旧的没人 dispose；请求会重复发。正确做法：字段位置 <code>late final _c = ...</code>，或放 <code>initState</code>。',
              },
              {
                term: '用全局变量存页面状态',
                desc: '两个页面同时用同一个全局变量，返回时空数据、切页面数据串了。这属于「状态该放哪」的问题，见 2.1；跨页面共享请用状态管理。',
              },
              {
                term: '到处写死的颜色和字号',
                desc: '<code>Color(0xFF409EFF)</code>、<code>fontSize: 14</code> 散落在几十个文件里。想换品牌色时无法下手，且暗色模式必然失效。正确做法：集中在 <code>ThemeData</code> 里定义，业务代码只读 <code>Theme.of(context)</code>。',
              },
              {
                term: '深层嵌套却不拆组件',
                desc: '一个 <code>build</code> 方法 200 行、缩进 8 层。这不只是难看 —— 意味着无法复用、无法单独测试、改一处要重新理解整段。到第 5 层就该抽出去了。',
              },
              {
                term: '用 ! 消掉编译错误',
                desc: '看到 <code>!</code> 就问「这个值为什么可能是 null」。加 <code>!</code> 是在向编译器保证「不可能」，猜错就是线上崩溃。',
              },
              {
                term: '忘记 dispose',
                desc: 'Controller / Subscription / AnimationController / Timer 都要还。<code>initState</code> 拿了什么，<code>dispose</code> 就还什么。',
              },
              {
                term: 'Widget 方法拆组件（_buildXxx）',
                desc: '返回 Widget 的私有方法不会产生独立 Widget 节点，因此无法享受 <code>const</code> 优化，排查时在 DevTools 里也看不到这一层。抽成独立 Widget 类才对。',
              },
              {
                term: '在 Widget 里存可变字段',
                desc: '在 <code>StatelessWidget</code> 里写 <code>var _counter = 0;</code> 然后改它 —— 改了不会重建，因为 StatelessWidget 每次 build 都是新实例。可变数据必须在 <code>State</code> 里。',
              },
            ],
          },
          {
            kind: 'note',
            tone: 'ok',
            html:
              '<b>这些反模式有个共同点：它们在「只有 3 个页面」时都没问题。</b>所以真正有价值的做法不是等出问题再改，而是在项目一开始就把「颜色集中定义」「状态就近放置」「组件及时拆分」当规矩立下来。这正是「工程化」要解决的事 —— 下一站的工程化搭建指南接着讲。',
          },
        ],
      },

      {
        id: 'f-next',
        title: '2.5 接下来该学什么',
        level: '实战',
        summary: '这一页建立的是「框架心智模型」。往下按需要补，不用全学完再动手。',
        blocks: [
          {
            kind: 'keypoints',
            title: '按需要补的五个方向',
            items: [
              '<b>状态管理</b>：跨页面共享数据怎么做。Riverpod / Provider / Bloc 选一个，工程化指南里用的是 Riverpod。',
              '<b>路由导航</b>：多页面跳转、传参、返回拦击。<code>go_router</code> 是当前主流，支持深链接。',
              '<b>网络与数据</b>：Dio 封装、统一错误模型、JSON 序列化（<code>json_serializable</code> / <code>freezed</code>）。',
              '<b>动画</b>：<code>AnimatedContainer</code> 这类隐式动画 → <code>AnimationController</code> 显式动画 → <code>Hero</code> 转场。',
              '<b>测试</b>：单元测试（纯逻辑）、Widget 测试（界面）、集成测试（端到端）。先把单元测试做起来收益最大。',
            ],
          },
          {
            kind: 'p',
            html: '组件本身还没熟的话，下一站是 <b>Material 组件手册</b> —— 67 个高频组件，每个都配可交互的图形示例、属性表和避坑说明。等组件和框架都通了，再去 <b>工程化搭建指南</b> 把项目结构立起来。',
          },
        ],
      },
    ],
  },
];
