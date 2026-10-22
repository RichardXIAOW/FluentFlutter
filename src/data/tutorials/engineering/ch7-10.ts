import type { Chapter } from '../types';

/**
 * 工程化搭建指南 · 第 7 ~ 11 章（重写重点：第 8、9 章）
 *
 * 第 7 章 主题定制与明暗切换（2026-10-22 新增）/ 第 8 章 测试 / 第 9 章 CI-CD 与发布
 * / 第 10 章 性能与包体积 / 第 11 章 验收清单
 */
export const engineeringCh7to10: Chapter[] = [
  /* ════════════════════════════ 第 7 章 ════════════════════════════ */
  {
    id: 'etheme',
    no: '第 7 章',
    title: '主题定制与明暗切换',
    lead: '主题不是美化工，是结构工：颜色和字体只有一个出处（ThemeData），明暗两套就是同一个出处的两种亮度。做对了，跟随系统是免费的，手动切换只需要一个枚举加一个缓存。',
    sections: [
      {
        id: 'e-theme-data',
        title: '7.1 ThemeData：一套代码派生明暗两套主题',
        level: '基础',
        summary: '结论：从 ColorScheme.fromSeed 起步，全部颜色从 ColorScheme 派生，不写死。这是后面「自动切换零成本」的前提。',
        blocks: [
          {
            kind: 'p',
            html: 'Flutter 的主题体系只有一层核心：<b>ThemeData 是全站样式的唯一出处</b>，Material 组件（按钮、输入框、AppBar……）全部从它取色。所以「定制主题」不是到处改组件样式，而是把 <code>ThemeData</code> 配好 —— 组件自然就对了。而 Material 3 给了一个起点：<code>ColorScheme.fromSeed</code>，给一个品牌种子色，自动派生出整套明暗两档配色。',
          },
          {
            kind: 'code',
            filename: 'lib/core/theme/app_theme.dart',
            code: `import 'package:flutter/material.dart';

/// 全站主题唯一出处（目录约定见第 1.4 节 core/theme/）。
/// 页面里要用颜色/字体，一律 Theme.of(context)，禁止写死。
class AppTheme {
  const AppTheme._();

  /// 品牌主色：只定义这一次
  static const _seed = Color(0xFF2563EB);

  static ThemeData light() => _base(Brightness.light);
  static ThemeData dark() => _base(Brightness.dark);

  /// 明暗共用一套配置 —— 差异全部由 ColorScheme 承担
  static ThemeData _base(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: _seed,
      brightness: brightness,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: 0,
        centerTitle: true,
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: const OutlineInputBorder(),
        filled: true,
        fillColor: scheme.surfaceContainerHighest,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '注意这个写法的关键点：<b><code>light()</code> 和 <code>dark()</code> 共用同一个 <code>_base</code></b>，差异完全交给 <code>ColorScheme.fromSeed(brightness: ...)</code> 去派生。你没有任何一处 <code>if (isDark)</code> —— 这就是「一套代码两套主题」。想强化品牌感时，可以在此基础上覆写个别槽位（<code>scheme.primary = ...</code> 用 <code>copyWith</code>），但别推倒 fromSeed 的结果从零手拼。',
          },
          {
            kind: 'table',
            head: ['常用主题槽位', '管什么', '什么时候动它'],
            rows: [
              ['<code>colorScheme</code>', '全部颜色的根：primary / surface / error / onXxx', '几乎只动 seedColor，其余派生'],
              ['<code>textTheme</code>', '六档文字样式（display/headline/title/body/label）', '要统一字号行高时，在默认 M3 基础上 copyWith'],
              ['<code>appBarTheme</code>', '顶栏背景、前景、高度', '想要「与页面同色无边框」顶栏时'],
              ['<code>inputDecorationTheme</code>', '所有输入框的边框、填充、内边距', '表单多于一个页面时尽早配掉'],
              ['<code>snackBarTheme</code>', '提示条的形态（浮动、圆角）', '有全局提示规范时'],
            ],
          },
          {
            kind: 'keypoints',
            items: [
              '主题只有一个出处：<code>core/theme/app_theme.dart</code>，别在页面里散落样式。',
              '<code>ColorScheme.fromSeed</code> 起步，品牌感靠覆写个别槽位，不从零手拼。',
              '明暗两套共用一个 <code>_base</code>，差异全在 <code>ColorScheme</code>，业务代码零 <code>if (isDark)</code>。',
              '组件级一次性样式（输入框、提示条）配进 ThemeData，别每个页面重复写。',
            ],
          },
        ],
      },
      {
        id: 'e-theme-app',
        title: '7.2 MaterialApp：theme / darkTheme / themeMode',
        level: '基础',
        summary: '三个参数各管一件事：浅色给 theme、深色给 darkTheme、themeMode 决定用哪个。就这么简单，没有第四件事。',
        blocks: [
          {
            kind: 'p',
            html: '<code>MaterialApp</code> 上有三个主题参数，分工非常干净：<b><code>theme</code> 是浅色、<code>darkTheme</code> 是深色、<code>themeMode</code> 是开关</b>（system / light / dark 三选一，默认 system）。把第 7.1 节的两套 ThemeData 挂上去：',
          },
          {
            kind: 'code',
            filename: 'lib/app/app.dart',
            code: `class ShopApp extends ConsumerWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(appThemeModeProvider); // 第 7.4 节
    return MaterialApp.router(
      theme: AppTheme.light(),    // 浅色
      darkTheme: AppTheme.dark(), // 深色
      themeMode: themeMode,       // system / light / dark
      routerConfig: appRouter,
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '只有 <code>theme</code> 没有 <code>darkTheme</code> 时，系统切到深色，App 依然是浅色 —— <b>很多人以为「深色模式要专门开发」，其实是因为只给了一半材料</b>。两个都给、<code>themeMode</code> 保持默认，跟随系统就已经成立了。剩下的全部工作只有一件事：<b>页面里不许写死颜色</b>。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 颜色写死',
              code: `Container(
  // 白天正常，深色模式下刺眼的白块
  color: Colors.white,
  child: Text(
    '标题',
    style: TextStyle(
      color: Colors.black, // 深色下直接看不见
      fontSize: 16,
    ),
  ),
)`,
            },
            good: {
              title: '✅ 全部从 Theme 取',
              code: `Container(
  // 明暗各自正确，切换零代码
  color: Theme.of(context).colorScheme.surface,
  child: Text(
    '标题',
    style: Theme.of(context).textTheme.titleMedium,
  ),
)`,
            },
            note: '判别标准很简单：<b>业务代码里出现 <code>Colors.white</code> / <code>Colors.black</code>，基本都该换成 <code>colorScheme</code> 的语义色</b>。品牌色用 <code>theme.colorScheme.primary</code>，错误用 <code>error</code>，表面用 <code>surface</code> / <code>surfaceContainerHighest</code>。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>theme</code> 浅色、<code>darkTheme</code> 深色、<code>themeMode</code> 决定用哪个，三参数分工。',
              '两个都给了，跟随系统自动成立；只给一个是「半成品」。',
              '页面颜色一律 <code>Theme.of(context).colorScheme</code>，写死的 <code>Colors.white/black</code> 是深色模式的最大杀手。',
            ],
          },
        ],
      },
      {
        id: 'e-theme-system',
        title: '7.3 跟随系统：默认就该是这个行为',
        level: '基础',
        summary: 'themeMode: ThemeMode.system 是默认值 —— 只要颜色没写死，跟随系统的成本约等于零。要做的只剩适配检查。',
        blocks: [
          {
            kind: 'p',
            html: '<code>ThemeMode.system</code> 下，Flutter 监听系统的明暗设置并自动重建 —— <b>这部分框架全包了，你不用写一行监听代码</b>。个别地方确实需要手动分支时（比如深色下换一张图），用 <code>MediaQuery.platformBrightnessOf(context)</code> 判断，别自己查系统 API。',
          },
          {
            kind: 'p',
            html: '真正的工作量在「适配检查」—— 深色模式下把每个页面过一遍，常见翻车点就这几类：',
          },
          {
            kind: 'list',
            items: [
              '<b>写死的颜色</b>：上一节说过，<code>Colors.white/black</code> 全换成语义色，这一条能消灭 90% 的问题。',
              '<b>图片与图标</b>：彩色彩 logo 在深色下可能突兀 —— 图标优先用 <code>IconTheme</code> 着色，必要时按明暗给两份资源。',
              '<b>系统栏</b>：状态栏图标颜色要跟随 —— 用 <code>AnnotatedRegion&lt;SystemUiOverlayStyle&gt;</code> 包页面，或交给 <code>AppBarTheme.systemOverlayStyle</code>。',
              '<b>原生洞</b>：WebView、地图、广告这类原生视图不受 ThemeData 管，深色下单独检查观感。',
              '<b>启动瞬间</b>：原生启动屏是白是黑与 Flutter 无关，用原生主题（styles.xml / Info.plist）配，避免「闪一下白」。',
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>调试技巧：</b>不用真的去改系统设置。Flutter DevTools（第 1.2 节那条链接）里可以直接切换 platform brightness，模拟器/真机上在开发者选项里切深色也行 —— 每改一轮主题相关代码，明暗各过一遍页面，成本两分钟。',
          },
          {
            kind: 'keypoints',
            items: [
              '跟随系统是默认行为，前提是 theme + darkTheme 都给了、颜色没写死。',
              '手动分支用 <code>MediaQuery.platformBrightnessOf(context)</code>，别引系统插件。',
              '适配检查五类点：写死颜色 / 图片图标 / 系统栏 / 原生洞 / 启动屏。',
            ],
          },
        ],
      },
      {
        id: 'e-theme-toggle',
        title: '7.4 手动切换与持久化：一个 Notifier + 一个缓存',
        level: '进阶',
        summary: '「让用户自己选」只需要三态枚举进 Riverpod、写进 shared_preferences。启动先给默认值再异步恢复，避免白等。',
        blocks: [
          {
            kind: 'p',
            html: '用户手动选择的主题要记住 —— 状态用 Riverpod 管，持久化用 <code>shared_preferences</code>（第 6 章的 KV 存储，存这种开关正合适）。核心只有一个 <code>ThemeMode</code> 三态枚举：',
          },
          {
            kind: 'code',
            filename: 'lib/core/theme/theme_mode.dart',
            code: `import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'theme_mode.g.dart';

/// 主题模式状态：system（跟随系统）/ light / dark
@riverpod
class AppThemeMode extends _$AppThemeMode {
  static const _key = 'theme_mode';

  @override
  ThemeMode build() {
    _restore(); // 异步恢复 —— 先返回默认值，不阻塞启动
    return ThemeMode.system;
  }

  Future<void> _restore() async {
    final sp = await SharedPreferences.getInstance();
    final saved = sp.getString(_key);
    if (saved == null) return; // 没存过 = 第一次用，跟随系统
    state = ThemeMode.values.firstWhere(
      (m) => m.name == saved,
      orElse: () => ThemeMode.system,
    );
  }

  /// 切换并持久化。UI 给三选一控件调这一个方法就够
  Future<void> set(ThemeMode mode) async {
    state = mode; // 立刻生效，不等磁盘
    final sp = await SharedPreferences.getInstance();
    await sp.setString(_key, mode.name);
  }
}`,
          },
          {
            kind: 'p',
            html: '两个设计点说清楚。<b>第一，「先默认、再恢复」</b>：<code>build()</code> 同步返回 <code>ThemeMode.system</code>，缓存在后台异步读 —— App 秒开，读到缓存后自动重建，最多闪一下过渡帧，比启动时同步等磁盘强得多。<b>第二，缓存键存的是枚举名</b>（<code>mode.name</code>），<code>firstWhere + orElse</code> 兜底，以后加新档位、或缓存里出现了垃圾值，都不会崩。',
          },
          {
            kind: 'p',
            html: '设置页的入口，一个三选一的 <code>SegmentedButton</code> 就是全部 UI：',
          },
          {
            kind: 'code',
            filename: '设置页 · 主题三选一',
            code: `SegmentedButton<ThemeMode>(
  segments: const [
    ButtonSegment(
      value: ThemeMode.system,
      icon: Icon(Icons.brightness_auto),
      label: Text('系统'),
    ),
    ButtonSegment(
      value: ThemeMode.light,
      icon: Icon(Icons.light_mode),
      label: Text('浅色'),
    ),
    ButtonSegment(
      value: ThemeMode.dark,
      icon: Icon(Icons.dark_mode),
      label: Text('深色'),
    ),
  ],
  selected: {ref.watch(appThemeModeProvider)},
  onSelectionChanged: (s) =>
      ref.read(appThemeModeProvider.notifier).set(s.first),
)`,
          },
          {
            kind: 'p',
            html: '跑一下 <code>build_runner</code> 生成 <code>theme_mode.g.dart</code>（第 2.2 节的心法），接上第 7.2 节的 <code>MaterialApp</code> —— 手动切换 + 持久化 + 启动恢复，整条链路就通了。默认「跟随系统」、用户选了就记住，这正是主流 App 的行为。',
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>不要做的事：</b>别为此引 provider 之外的持久化方案（数据库、文件）—— 一个字符串键值的活；也别把主题状态塞给每一页单独传 —— 它是全局唯一的，放全局 provider，<code>MaterialApp</code> 一处消费。',
          },
          {
            kind: 'keypoints',
            items: [
              '状态 = <code>@riverpod</code> Notifier 持有 <code>ThemeMode</code>，持久化 = <code>shared_preferences</code> 存枚举名。',
              '启动先返回 <code>ThemeMode.system</code>，缓存异步恢复 —— 不阻塞启动。',
              '读缓存要 <code>orElse</code> 兜底，缓存脏值不能让 App 崩。',
              'UI 只有一个 <code>SegmentedButton</code> 三选一，调 <code>set()</code> 一个方法。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 8 章 ════════════════════════════ */
  {
    id: 'ech7',
    no: '第 8 章',
    title: '测试',
    lead: '测试的目标不是覆盖率数字，是「改代码时敢不敢直接提交」。这一章给的是务实配置：核心逻辑必测，UI 测关键交互，其余靠 CI 的 analyze 和 format 兜底。',
    sections: [
      {
        id: 'e-test-what',
        title: '8.1 测什么：金字塔与务实原则',
        level: '基础',
        summary: '把有限的测试预算花在「逻辑会变、错了会赔钱」的地方。',
        blocks: [
          {
            kind: 'p',
            html: '教科书上的测试金字塔（单元多、集成中、UI 少）是对的，但落到 Flutter 业务项目，还有更务实的三条判断标准：<b>这段逻辑会经常改吗？改错了用户能直接感知吗？用真机点一遍要多久？</b>三条里中两条，就值得写测试。',
          },
          {
            kind: 'table',
            head: ['层次', '测什么', '工具', '务实要求'],
            rows: [
              ['纯逻辑', '金额计算、状态机、工具函数、Notifier 里的规则', '纯 Dart + <code>flutter_test</code>', '<b>必测</b>。跑得最快、回报最高'],
              ['Repository / 数据层', '错误翻译、Result 拆包、缓存回退', '<code>mocktail</code> mock 掉 dio', '<b>必测</b>。第 5 章的闭环就靠它守住'],
              ['Widget 测试', '关键交互：「点下单 → 出现成功提示」', '<code>testWidgets</code> + <code>pumpWidget</code>', '只测关键路径，一两个页面几个用例'],
              ['Golden 快照', 'UI 视觉回归', '<code>matchesGoldenFile</code>', '<b>可选</b>。截图噪声大，团队没痛点就先不做'],
              ['集成测试', '完整业务流', '<code>integration_test</code>', '上线前人工回归替代，初具规模再补'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '两个反面清单：<b>不要测 Widget 的布局细节</b>（改个 padding 测试全红，维护测试比维护代码还贵）；<b>不要为了覆盖率写断言为空的测试</b>（<code>expect(true, isTrue)</code> 这种测试比没有测试更有害，它让你误以为有保护网）。覆盖率是仪表盘不是 KPI，第 8.4 节细说。',
          },
          {
            kind: 'keypoints',
            items: [
              '测试预算的优先级：纯逻辑 &gt; Repository &gt; 关键 Widget 交互 &gt; 其他。',
              '判断标准：会常改 + 错了用户能感知 + 真机回归成本高 —— 中两条就写测试。',
              '不测布局细节、不写无断言测试 —— 这两类测试是负资产。',
            ],
          },
        ],
      },
      {
        id: 'e-test-unit',
        title: '8.2 单元测试：测 Riverpod Notifier',
        level: '实战',
        summary: 'ProviderContainer + mocktail 假仓库，不启动任何 UI 就能把状态链路测完。',
        blocks: [
          {
            kind: 'p',
            html: '3.5 节已经给过 Notifier 测试的骨架，这里给一个「订单列表」的完整可跑版本，把成功、失败、错误类型三个断言写全 —— <b>这就是数据层测试的标准形状</b>：',
          },
          {
            kind: 'code',
            filename: 'test/logic/order_list_test.dart',
            code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:my_shop/core/error/result.dart';
import 'package:my_shop/core/network/failure.dart';
import 'package:my_shop/features/order/data/order.dart';
import 'package:my_shop/features/order/data/order_repository.dart';
import 'package:my_shop/features/order/logic/order_list.dart';

/// 假仓库：只实现接口，不碰网络
class MockOrderRepository extends Mock implements OrderRepository {}

void main() {
  late MockOrderRepository repo;
  late ProviderContainer container;

  setUp(() {
    repo = MockOrderRepository();
    container = ProviderContainer(
      overrides: [orderRepositoryProvider.overrideWithValue(repo)],
    );
    // 必须 addTearDown：测试结束后销毁 container，防串扰
    addTearDown(container.dispose);
  });

  Future<void> pump() async {
    container.listen(orderListProvider, (_, __) {}); // 订阅触发 build
    await container.pump();                          // 让 Future 跑完
  }

  test('成功 → data 态，数据来自仓库', () async {
    when(() => repo.fetchOrders()).thenAnswer(
      (_) async => const Result.ok([
        Order(id: 'o1', title: '手机壳', amount: 29.9),
      ]),
    );
    await pump();

    final state = container.read(orderListProvider);
    expect(state.valueOrNull, isNotNull);
    expect(state.requireValue.first.id, 'o1');
  });

  test('断网 → error 态且是 NetworkFailure', () async {
    when(() => repo.fetchOrders())
        .thenAnswer((_) async => const Result.err(NetworkFailure()));
    await pump();

    final state = container.read(orderListProvider);
    expect(state, isA<AsyncError>());
    expect((state as AsyncError).error, isA<NetworkFailure>());
  });
}`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: '两个容易疑惑的点：<b>① 为什么没有 await container.read？</b>因为 provider 的 build 返回 Future，用 <code>container.pump()</code> 推进微任务队列即可。<b>② 为什么用 mocktail 不用 mockito？</b>mockito 需要 codegen（mock 也要生成），mocktail 纯运行时 API，少一条生成链路 —— 对测试代码来说是纯赚。',
          },
          {
            kind: 'keypoints',
            items: [
              '容器 + overrides 是 Riverpod 测试的全部机关：被测单元只有 Notifier。',
              'mocktail 手写 mock 类（<code>class X extends Mock implements Y</code>），无需 codegen。',
              '<code>addTearDown(container.dispose)</code> 必写，测试间状态隔离靠它。',
              '断言三件事：状态类型（data/error）、载荷内容、错误的具体类型。',
            ],
          },
        ],
      },
      {
        id: 'e-test-widget',
        title: '8.3 Widget 测试模板：点按钮出现 X',
        level: '进阶',
        summary: '只测关键交互。一个可复制的模板，覆盖 80% 的 Widget 测试需求。',
        blocks: [
          {
            kind: 'p',
            html: 'Widget 测试在假浏览器环境里跑（不是模拟器，所以很快），套路固定四步：<b>pumpWidget 起页面 → find 定位元素 → tester.tap 模拟点击 → expect 断言结果</b>。测的目标永远是「用户可见的行为」，不是内部实现：',
          },
          {
            kind: 'code',
            filename: 'test/ui/order_list_page_test.dart',
            code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:my_shop/core/error/result.dart';
import 'package:my_shop/features/order/data/order_repository.dart';
import 'package:my_shop/features/order/ui/order_list_page.dart';

class MockOrderRepository extends Mock implements OrderRepository {}

void main() {
  testWidgets('有订单时展示订单标题', (tester) async {
    final repo = MockOrderRepository();
    // —— 准备：假仓库返回一条订单（异步，所以 thenAnswer）
    when(() => repo.fetchOrders()).thenAnswer(
      (_) async => const Result.ok([]), // 简化：空列表走 EmptyView 分支
    );

    // —— 执行：起页面（ProviderScope 包住才能用 Riverpod）
    await tester.pumpWidget(
      ProviderScope(
        overrides: [orderRepositoryProvider.overrideWithValue(repo)],
        child: const MaterialApp(home: OrderListPage()),
      ),
    );
    await tester.pumpAndSettle(); // 等所有动画 / Future 结束

    // —— 断言
    expect(find.text('我的订单'), findsOneWidget);
    expect(find.byType(CircularProgressIndicator), findsNothing);
  });

  testWidgets('点击结算按钮出现成功提示', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: const MaterialApp(home: CartPage()),
      ),
    );

    await tester.tap(find.byKey(const Key('checkout-button')));
    await tester.pump(); // 只 pump 一帧，SnackBar 出现即可

    expect(find.text('下单成功'), findsOneWidget);
  });
}`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: '<b>find.text 里的中文完全没问题</b> —— 测试环境对字符串没有任何编码特殊处理，<code>find.text(&#39;我的订单&#39;)</code> 和英文一样工作。另外两个常用细节：给被点的按钮挂 <code>Key(&#39;checkout-button&#39;)</code> 比按类型找更稳；动画结束用 <code>pumpAndSettle()</code>，简单刷新用 <code>pump()</code> —— 不确定的区别就是「等不等转圈圈结束」。',
          },
          {
            kind: 'keypoints',
            items: [
              'Widget 测试模板四步：pumpWidget → find → tap → expect。',
              '断言「用户看得见的结果」（文案、控件出现与否），不断言内部状态。',
              '<code>pumpAndSettle</code> 等动画结束；<code>pump</code> 只推一帧。',
              '中文文案直接写进 find.text，无坑。',
            ],
          },
        ],
      },
      {
        id: 'e-coverage',
        title: '8.4 覆盖率：看趋势，别追数字',
        level: '进阶',
        summary: '核心逻辑 80% 是健康线，全局 100% 是病态线。',
        blocks: [
          {
            kind: 'p',
            html: 'Flutter 自带覆盖率采集，两条命令出 HTML 报告：',
          },
          {
            kind: 'code',
            lang: 'bash',
            filename: '覆盖率采集与查看',
            code: `# 采集：coverage/lcov.info
flutter test --coverage

# 需要 genhtml（lcov 包）。生成可视化网页：
genhtml coverage/lcov.info -o coverage/html

# macOS：brew install lcov
# Windows：choco install lcov  或用 VS Code 的 Coverage Gutters 插件直接读 lcov.info`,
          },
          {
            kind: 'p',
            html: '拿到数字之后的用法比数字本身重要。务实的标准：<b><code>features/*/logic</code> 和 <code>core/</code>（核心逻辑）≥ 80%；全局覆盖率无所谓</b>。UI 代码（布局、样式）天然难测、收益低，把它们计入分母只会制造焦虑。CI 里可以加一个只针对核心目录的覆盖率门禁 —— 对目录，不对全局：',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>flutter test --coverage</code> 出 <code>lcov.info</code>，genhtml 出可视化报告。',
              '门禁只对核心逻辑（logic / core）设阈值，推荐 80% 起步。',
              '全局 100% 覆盖率是负向信号 —— 它通常意味着大量无断言测试。',
              '覆盖率突然下降的 PR 值得 review 里问一句，比固定阈值更有用。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 9 章 ════════════════════════════ */
  {
    id: 'ech8',
    no: '第 9 章',
    title: 'CI/CD 与发布',
    lead: '这一章让「能不能发版」不再取决于谁的记性好：PR 门禁自动守住质量，构建命令和签名各就各位，发布前对着检查单走一遍。',
    sections: [
      {
        id: 'e-ci',
        title: '9.1 GitHub Actions：PR 门禁',
        level: '实战',
        summary: 'format / analyze / test 三道闸，配置一次，永久生效。',
        blocks: [
          {
            kind: 'p',
            html: '门禁的目标在第 1.5 节说过：风格话题不进 review、analyze 存量只减不增、测试挂了不能合。一个 workflow 三道闸全解决，直接照抄：',
          },
          {
            kind: 'code',
            lang: 'yaml',
            filename: '.github/workflows/ci.yml',
            code: `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 稳定版 Flutter + 缓存，冷启动从 ~5 分钟降到 ~1 分钟
      - uses: subosito/flutter-action@v2
        with:
          channel: stable
          cache: true

      - run: flutter pub get

      # 闸 ①：format 有任何未格式化文件就失败
      - run: dart format --output=none --set-exit-if-changed .

      # 闸 ②：analyze 零容忍（info 也算）
      - run: flutter analyze --fatal-infos

      # 闸 ③：测试全量 + 顺手产出覆盖率
      - run: flutter test --coverage

      # 可选：把覆盖率摘要贴到 Actions 输出，趋势一眼可见
      - name: 覆盖率摘要
        if: always()
        run: |
          if [ -f coverage/lcov.info ]; then
            LINES=$(grep -oP '(?<=LF:)[0-9]+' coverage/lcov.info | paste -sd+ | bc)
            HIT=$(grep -oP '(?<=LH:)[0-9]+' coverage/lcov.info | paste -sd+ | bc)
            echo "总行数 \$LINES，覆盖 \$HIT"
          fi`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: '三道闸的顺序有讲究：format 最快先跑（几秒），analyze 次之（十几秒），test 最后（最慢）——<b>让明显的问题在最便宜的地方先挡住</b>。另外别忘了在 GitHub 仓库设置里开「Require status checks」，否则门禁只是装饰。',
          },
          {
            kind: 'keypoints',
            items: [
              '门禁三件套：format --set-exit-if-changed → analyze --fatal-infos → test。',
              '闸的顺序按「快而便宜」排，format 第一。',
              '必须在仓库设置开启 Require status checks 才是硬门禁。',
            ],
          },
        ],
      },
      {
        id: 'e-build',
        title: '9.2 构建模式与混淆',
        level: '基础',
        summary: 'debug / profile / release 各干什么；release 必开混淆，符号文件要留好。',
        blocks: [
          {
            kind: 'term',
            items: [
              {
                term: 'debug（flutter run 默认）',
                desc: '带热重载、断点、assert 生效。性能不代表线上，<b>绝不能拿它做性能结论</b>。',
              },
              {
                term: 'profile（flutter run --profile）',
                desc: '接近 release 的性能 + 可连接 devtools。调帧率、查内存用它 —— 这也是 devtools 性能面板要求的模式。',
              },
              {
                term: 'release（flutter build --release）',
                desc: 'AOT 编译、树摇、混淆。发版唯一模式。',
              },
            ],
          },
          {
            kind: 'p',
            html: 'release 构建必须带混淆 —— Dart 代码默认可以被逆向工具直接还原出函数名，加了 <code>--obfuscate</code> 之后标识符被替换成随机符号，逆向成本陡增。但它有个必须理解的代价：<b>混淆后的崩溃堆栈也变成了乱码，要靠 <code>split-debug-info</code> 留下的符号文件才能还原</b>：',
          },
          {
            kind: 'code',
            lang: 'bash',
            filename: 'release 构建命令（Android 示例）',
            code: `flutter build apk --release \\
  --dart-define=APP_ENV=prod \\
  --obfuscate \\
  --split-debug-info=build/symbols/android

# --split-debug-info：把符号文件存到本地目录
# 这批符号只对应这一次构建 —— 必须随版本归档，
# 丢了就没有还原崩溃栈的机会`,
          },
          {
            kind: 'note',
            tone: 'bad',
            html: '<b>符号文件丢了 = 崩溃栈永远解不开。</b>正确做法：按版本号归档（如 <code>symbols/1.2.0+15/</code>），连同构建一起传到私有存储或至少进团队的备份盘。什么时候需要它：线上崩溃平台（如 Firebase Crashlytics）拿到的是混淆后的堆栈，上传对应版本的符号文件才能翻译成可读的类名行号。',
          },
          {
            kind: 'p',
            html: '版本号管理用 pubspec 的三段式：<code>version: 1.2.0+15</code> —— 加号前是用户可见版本（1.2.0），加号后是构建号（15，每次发版递增，应用商店用）。Android 的 <code>versionCode</code> / iOS 的 build number 会自动取加号后的值，<b>不要在原生工程里另设一套</b>。',
          },
          {
            kind: 'keypoints',
            items: [
              '性能结论只能来自 profile/release；debug 的卡顿说明不了任何问题。',
              'release 一律 <code>--obfuscate --split-debug-info</code>，符号文件按版本归档。',
              '版本号只在 pubspec 管：<code>1.2.0+15</code>，原生工程不另设。',
            ],
          },
        ],
      },
      {
        id: 'e-sign',
        title: '9.3 Android 签名：key.properties 标准接法',
        level: '进阶',
        summary: '密钥不进 git、不硬编码，通过 properties 文件注入 gradle。',
        blocks: [
          {
            kind: 'p',
            html: 'Android 签名的核心矛盾：gradle 需要密钥配置，但<b>密钥绝不能进 git</b>。标准解法是三层隔离 —— 密钥文件放本机，<code>key.properties</code> 记路径和密码（进 .gitignore），gradle 读 properties 注入：',
          },
          {
            kind: 'code',
            lang: 'yaml',
            filename: 'android/key.properties（本地，不进 git）',
            code: `storePassword=你的keystore密码
keyPassword=你的key密码
keyAlias=upload
storeFile=../keystores/upload-keystore.jks`,
          },
          {
            kind: 'code',
            filename: 'android/app/build.gradle.kts',
            code: `import java.util.Properties
import java.io.FileInputStream

// ① 顶部：读 key.properties（不存在时给默认值，CI 上无密钥也能编 debug）
val keystoreProperties = Properties().apply {
    val f = rootProject.file("key.properties")
    if (f.exists()) load(FileInputStream(f))
}

android {
    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String?
            keyPassword = keystoreProperties["keyPassword"] as String?
            storeFile = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String?
        }
    }
    buildTypes {
        release {
            // ② release 用签名配置；没有密钥时回退 debug 签名，保证 CI 能出包
            signingConfig = if (keystoreProperties["storeFile"] != null) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }
}`,
          },
          {
            kind: 'note',
            tone: 'bad',
            html: '<b>三条红线：</b>① keystore 文件和 key.properties 都加进 <code>.gitignore</code>（提交历史里的密钥等于公开）；② keystore 丢了就无法再给该应用发更新 —— 备份到密码管理器或私有存储，和代码同级重要；③ 别把密码写进 gradle 或 CI 脚本明文。iOS 侧一句话：证书和描述文件在 Xcode 里配，CI 上用 fastlane match 管理密钥 —— 小团队先手动打包 iOS，等有持续发布需求再上 match。',
          },
          {
            kind: 'keypoints',
            items: [
              '密钥三层隔离：keystore 文件（本机）→ key.properties（.gitignore）→ gradle 读注入。',
              'keystore 是 App 的「身份证」，丢了就无法更新 —— 备份优先级和源码同级。',
              'CI 无密钥时回退 debug 签名，让门禁流程不中断。',
            ],
          },
        ],
      },
      {
        id: 'e-checklist',
        title: '9.4 发布前检查单',
        level: '实战',
        summary: '发版不是技术活，是流程活。每次发布对着这张单走一遍。',
        blocks: [
          {
            kind: 'keypoints',
            title: '从改完代码到点「发布」',
            items: [
              '<b>① 图标与启动图</b>：用 <code>flutter_launcher_icons</code> / <code>flutter_native_splash</code> 生成，检查各分辨率都换了（模板图标上架被拒的真实发生过）。',
              '<b>② 环境确认</b>：打包命令里有 <code>--dart-define=APP_ENV=prod</code>；装到真机后先确认连的是生产接口。',
              '<b>③ 版本号</b>：pubspec <code>version</code> 更新，构建号 +1。',
              '<b>④ 混淆与符号</b>：<code>--obfuscate --split-debug-info</code> 带上，符号目录按版本归档。',
              '<b>⑤ 真机回归</b>：release 包真机跑核心路径（登录 → 浏览 → 下单 → 支付）—— debug 没问题不代表 release 没问题，混淆本身就可能暴露反射/序列化问题。',
              '<b>⑥ CHANGELOG</b>：这版改了什么、修了什么，写三行就有 —— 半年后你自己会回来查。',
              '<b>⑦ tag</b>：<code>git tag v1.2.0</code> 并 push，让代码、符号、CHANGELOG 三者对得上号。',
            ],
          },
        ],
      },
      {
        id: 'e-web',
        title: '9.5 （可选）Web 部署一句话',
        level: '基础',
        summary: 'Flutter Web 的产物就是一堆静态文件，任何静态托管都能吃。',
        blocks: [
          {
            kind: 'code',
            lang: 'bash',
            filename: 'Web 构建',
            code: `flutter build web --release --base-href /my_shop/

# 产物在 build/web，扔给任何静态托管（Nginx、Vercel、OSS+CDN）即可
# --base-href：部署在子路径时必须指定；部署在根路径可省`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: '两个提醒：① go_router 的路由是客户端 URL，部署在 Nginx 时要配 fallback（所有 404 回落到 index.html），否则深链刷新就 404；② Flutter Web 适合「工具、后台、演示」，重交互的移动端页面体验仍不如原生 —— 是否上 Web 是产品决策，不是默认动作。',
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 10 章 ════════════════════════════ */
  {
    id: 'ech9',
    no: '第 10 章',
    title: '上线之后：性能与包体积',
    lead: '短章。不追求性能优化大全 —— 90% 的 Flutter 性能问题由下面这几件事造成，先把它们做对。',
    sections: [
      {
        id: 'e-perf',
        title: '10.1 先做对这六件事',
        level: '进阶',
        summary: '每条一两句话。都做对了还有性能问题，再去 devtools 找。',
        blocks: [
          {
            kind: 'table',
            head: ['优化点', '做法', '一句话原理'],
            rows: [
              ['<code>const</code> 构造', '所有不变的 Widget 都加 <code>const</code>', '编译期常量不参与 rebuild —— lint 会提醒，顺手加'],
              ['长列表用 builder', '<code>ListView.builder</code> / <code>ListView.separated</code>', '懒构建：只建可见项。<code>ListView(children: [])</code> 一次性建全部'],
              ['图片降采样', '网络图配 <code>cacheWidth</code>，或 <code>ResizeImage</code>', '一张 4000px 图解码成全尺寸内存；列表里 200px 显示就该按 200 解码'],
              ['按 ABI 拆包', '<code>flutter build apk --split-per-abi</code>', '一个通用 apk 塞了 arm64+armeabi+v7a 三份 so，包体三倍'],
              ['只重建需要的部分', '把变化部分抽成小 Widget + 精准 watch', 'rebuild 的单位是 Widget；一个页面包一个 watch，键盘弹出都全页重绘'],
              ['怀疑性能问题时', '<code>flutter run --profile</code> → devtools 的 Performance / Memory 面板', '一切性能结论以 profile 模式的数据为准，肉眼和 debug 都不算数'],
            ],
          },
          {
            kind: 'keypoints',
            title: '性能心法',
            items: [
              '先做对上面六件事 —— 它们覆盖了绝大多数「Flutter 卡」的真实原因。',
              'devtools 入口：profile 模式启动 → IDE 或 <code>flutter pub global activate devtools</code> 打开；帧率看 Performance，内存看 Memory。',
              '优化前先量化（多少帧、多少 MB），优化后再量化一次 —— 没有数字的优化是玄学。',
              '包体积除了拆 ABI，大头通常是图片资源：能用矢量就用矢量，必须位图就压缩。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 10 章 ════════════════════════════ */
  {
    id: 'ech10',
    no: '第 11 章',
    title: '验收清单',
    lead: '全指南收官。这一页是前面九章的浓缩 —— 能对着它逐条打勾，说明项目真的立住了。',
    sections: [
      {
        id: 'e-final-check',
        title: '11.1 从零到能上架的 10 步',
        level: '实战',
        summary: '建议的动手顺序。每步对应的章在括号里。',
        blocks: [
          {
            kind: 'keypoints',
            title: 'Checklist',
            items: [
              '<b>① 建项目、清理、定目录</b>（1.2 / 1.3）—— feature-first 结构，counter 删干净。',
              '<b>② 环境 + Lint</b>（1.1 / 1.4）—— AppEnv 就位，analysis_options 配好，format 全量过一遍。',
              '<b>③ 第一批依赖</b>（2.1）—— Riverpod + go_router，App 壳跑起来。',
              '<b>④ 路由骨架</b>（4.2 / 4.3）—— 路由表 + StatefulShellRoute 底部导航，所有空页面挂进去。',
              '<b>⑤ 网络与错误</b>（5.1 / 5.2）—— dioProvider、Failure、Result 就位。',
              '<b>⑥ 第一个真实页面闭环</b>（2.2 / 3.3 / 5.3）—— 模型 freezed → repository → Notifier → 三态 UI，照订单列表模板抄。',
              '<b>⑦ 登录态重定向</b>（4.4）—— 全局 redirect + refreshListenable。',
              '<b>⑧ 国际化与存储</b>（6.1 / 6.2）—— slang 接入，shared_preferences / drift 按需上。',
              '<b>⑨ CI 门禁 + 测试</b>（8 / 9.1）—— workflow 三道闸，核心逻辑测试 ≥ 80%。',
              '<b>⑩ 发布流程</b>（9.2 ~ 9.4）—— 混淆 + 符号归档 + 签名 + 检查单走通一次。走通过一次，之后就是重复劳动。',
            ],
          },
        ],
      },
      {
        id: 'e-pitfalls',
        title: '11.2 常见坑速查',
        level: '基础',
        summary: '九个最高频的坑。出问题时先来这里对症状。',
        blocks: [
          {
            kind: 'table',
            head: ['症状', '原因', '解法'],
            rows: [
              ['build_runner 卡住不动', '生成器缓存抽风 / watch 进程死了', '<code>flutter clean</code> → 删 <code>.dart_tool</code> → 重新 <code>pub get</code> + build（见 2.2）'],
              ['路由刷新 404（Web）', '服务器把深链当 404 处理', 'Nginx 配 <code>try_files</code> fallback 到 index.html（见 9.5）'],
              ['Riverpod 报循环依赖', 'A watch B、B 又 watch A', '把共享状态抽成第三个 provider，两个都 watch 它（见 3.2）'],
              ['混淆后崩溃栈看不懂', '符号文件没归档或版本对不上', '按版本归档 <code>split-debug-info</code>，崩溃平台上传对应版本符号（见 9.2）'],
              ['dart-define 没生效', '改了参数没重新构建 / 用了 run 没用 build', 'dart-define 是编译期常量，热重载不生效 —— 全新启动或重新 build（见 1.1）'],
              ['Web 端 extra 丢失崩溃', '路由参数依赖 extra 传对象', '只传 id，详情页按 id 取数据（见 4.5）'],
              ['切换语言界面没变', '文案硬编码在 Widget 里 / 没挂 TranslationProvider', '文案进 json，App 壳挂 TranslationProvider（见 6.1）'],
              ['CI format 不过', '本地没跑 format 就提交', 'IDE 开保存即 format；先 <code>dart format .</code> 一把过再推（见 1.4）'],
              ['状态改了界面不更新', 'build 里用了 <code>ref.read</code>', 'build 里用 watch，回调里才用 read（见 3.2）'],
            ],
          },
          {
            kind: 'keypoints',
            title: '最后一句',
            items: [
              '这份指南的终态不是「背下所有方案」，而是建立起一套默认配置：遇到新项目直接复制骨架，遇到新需求回来查对应章。',
              '选型会过时，方法论不会 —— 「先结论、再对比、再最小实现、明确不做什么」这个决策流程，比任何一个具体包的生命周期都长。',
            ],
          },
        ],
      },
    ],
  },
];
