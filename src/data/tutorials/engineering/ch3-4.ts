import type { Chapter } from '../types';

/**
 * 工程化搭建指南 · 第 3 ~ 4 章（重写重点）
 *
 * 第 3 章 Riverpod：选型大表 / 心智模型 / codegen 实战 / 消费与一次性事件 / 测试
 * 第 4 章 go_router：选型 / 最小配置 / 底部导航骨架 / 登录态重定向 / 传参的坑
 */
export const engineeringCh3to4: Chapter[] = [
  /* ════════════════════════════ 第 3 章 ════════════════════════════ */
  {
    id: 'ech3',
    no: '第 3 章',
    title: '状态管理：Riverpod',
    lead: '这是全指南最重的一章。选型、心智模型、codegen 写法、消费与一次性事件、测试 —— 五节读完，状态管理在项目里就没有未知区了。',
    sections: [
      {
        id: 'e-state-choice',
        title: '3.1 选型大表：为什么默认 Riverpod',
        level: '基础',
        summary: '结论：2026 年起新项目默认 Riverpod 3（codegen 写法）。GetX 不要用于正经项目；Bloc 只在特定条件下考虑。',
        blocks: [
          {
            kind: 'table',
            head: ['方案', '样板量', '编译期安全', '可测试性', '学习曲线', '适合谁'],
            rows: [
              ['<code>setState</code>', '零', '中', '弱（耦合 Widget）', '最低', '单个页面内的临时 UI 态'],
              ['<code>InheritedWidget</code>', '高', '高', '中', '低', '框架作者 / 封装底层库'],
              ['Provider（package）', '低', '中（运行时找类型）', '中', '低', '老项目维护；新项目不建议起步'],
              ['Bloc', '高', '高', '高', '陡', '超大团队、复杂事件流、强规范'],
              ['GetX', '低', '弱', '弱', '低', '不建议用于正经项目'],
              ['<b>Riverpod 3</b>', '低（codegen 后）', '<b>高</b>', '<b>高</b>', '中', '<b>默认选择</b>'],
            ],
          },
          {
            kind: 'p',
            html: '选 Riverpod 的核心理由浓缩成三条：<b>① 编译期安全</b> —— provider 在编译期就是确定的依赖图节点，写错 provider 名、循环依赖在写代码时就暴露，而不是运行时；<b>② 与 Widget 解耦</b> —— provider 图不依赖 BuildContext，任何地方都能读，测试时不需要 pump Widget；<b>③ 生命周期可控</b> —— provider 默认用完即回收（autoDispose），也可以一行声明常驻。不过 Bloc 的规范化和事件流建模对超大团队有价值，但它的样板量对中小项目是纯负担。',
          },
          {
            kind: 'note',
            tone: 'bad',
            html: '<b>关于 GetX，明说：不要用于正经项目。</b>它把路由、状态、依赖注入、国际化全揉在一个包里，与 Flutter 官方的演进路线完全脱节 —— 每个 Flutter 大版本升级，GetX 相关代码都是最先坏的。它「学得快」的代价是把你锁死在它自己的体系里，等你想换掉时，路由、状态、弹窗没有一处是标准 Flutter 写法，等于重写。',
          },
          {
            kind: 'p',
            html: '那什么时候才考虑 Bloc？满足下面全部条件时它是合理选择，否则就是过度工程：',
          },
          {
            kind: 'list',
            items: [
              '团队 10 人以上、人员流动大，需要<b>强制的</b>事件 → 状态规范化流程来约束所有人',
              '核心业务是复杂事件流（多个异步事件交错、需要事件重放 / 审计）',
              '公司已有 Bloc 积累和配套（监控、测试基建、老项目）',
              '愿意接受它的样板量（event / state / bloc 三件套，每个功能起步就是几个文件）',
            ],
          },
          {
            kind: 'keypoints',
            items: [
              '新项目默认 <b>Riverpod 3 + codegen</b>（<code>@riverpod</code> 注解写法）。',
              'GetX 不进正经项目：耦合深、脱离官方演进、迁移成本等于重写。',
              'Bloc 是「组织问题」的答案，不是「技术问题」的答案 —— 小团队用它是给自己上枷锁。',
              '<code>setState</code> 没有过时：单个页面内的临时 UI 态（Tab 选中、输入框显隐）用它就是最优解。',
            ],
          },
        ],
      },
      {
        id: 'e-mental',
        title: '3.2 心智模型：provider 是依赖图的节点',
        level: '进阶',
        summary: '把 ref.watch / ref.read / autoDispose / family 四个概念一次讲透。这四个用对，Riverpod 就入门了。',
        blocks: [
          {
            kind: 'p',
            html: 'Riverpod 的心智模型一句话：<b>整个应用是一张 provider 组成的依赖图</b>。每个 provider 是图上的一个节点，节点之间通过 <code>ref.watch</code> 连边。UI 也只是这张图的一个「订阅者」：它 watch 的任何节点变了，对应 Widget 就重建。理解了这一点，下面四个 API 就不是「要背的规则」，而是「必然的设计」。',
          },
          {
            kind: 'term',
            items: [
              {
                term: 'ref.watch —— build 里用',
                desc: '订阅节点。它 watch 的 provider 一变，<b>当前 Widget / provider 立即重建</b>。规则：只出现在 <code>build</code> 方法里。写在 build 里是「我要跟着它变」，这是 watch 的唯一语义。',
              },
              {
                term: 'ref.read —— 回调里用',
                desc: '读一次，不订阅。用在按钮 onTap、提交方法里：「此刻取个值就够了，之后变了别通知我」。在 build 里用 read 是最常见的 bug 来源 —— 界面从此不更新，你还以为状态没改。',
              },
              {
                term: 'autoDispose（默认）/ keepAlive',
                desc: 'Riverpod 3 里 <code>@riverpod</code> 生成的 provider <b>默认 autoDispose</b>：没有订阅者就销毁、重建时重新初始化 —— 页面退出，列表状态自动清掉，正是大多数场景想要的。需要常驻（如登录态、全局配置）时写 <code>@Riverpod(keepAlive: true)</code>。',
              },
              {
                term: 'family —— 带参数的 provider',
                desc: '同一个 provider 按参数生成多个实例：<code>@riverpod</code> 函数加个参数即可，生成 <code>orderDetailProvider(id)</code>。进详情页传 id、按 id 缓存，天然支持。注意：参数应是可以比较相等性的值（id、枚举），<b>不要传整个对象</b>。',
              },
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ build 里用 ref.read',
              code: `@override
Widget build(BuildContext context) {
  // 只在首次 build 读了一次。
  // 之后购物车怎么变，这个 Text 永远显示 "0"
  final count = ref.read(cartCountProvider);

  return Text('共 \$count 件');
}`,
            },
            good: {
              title: '✅ build 里 watch，回调里 read',
              code: `@override
Widget build(BuildContext context) {
  // watch：购物车一变，Text 就重建
  final count = ref.watch(cartCountProvider);

  return Text('共 \$count 件');
}

void _onSubmit() {
  // 回调里 read：取当前值发请求，不需要订阅
  final cart = ref.read(cartProvider);
  submitOrder(cart);
}`,
            },
            note: '一条判断法：这段代码「需要跟着变化走」→ watch；「用一下当下的值」→ read。拿不准就 watch，watch 不会错出静默 bug。',
          },
          {
            kind: 'keypoints',
            items: [
              'provider 图是唯一真相源，UI 只是订阅者。',
              '<code>watch</code> 只在 build 里；<code>read</code> 只在回调和一次性逻辑里。',
              'autoDispose 是默认且多数情况正确；keepAlive 要给出理由（登录态、全局配置）。',
              'family 参数用 id 这类可比较的值，不传对象。',
            ],
          },
        ],
      },
      {
        id: 'e-riverpod-code',
        title: '3.3 codegen 实战：函数式 provider 与 Notifier',
        level: '进阶',
        summary: '两种 provider 写法 + 一个真实购物车。看懂这一节，项目里 90% 的状态管理代码你都会写。',
        blocks: [
          {
            kind: 'p',
            html: 'Riverpod 3 的 codegen 写法只有两种形态，对应两种需求：<b>无状态的派生值用函数</b>，<b>有方法、会变化的状态用 class + Notifier</b>。先看函数式 —— 购物车商品数的派生值：',
          },
          {
            kind: 'code',
            filename: 'lib/features/cart/logic/cart_count.dart',
            code: `import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'cart_count.g.dart';

/// 函数式 provider：输入 cartProvider，输出商品总数。
/// 上游一变，这个值自动重算，订阅它的 UI 自动重建。
@riverpod
int cartCount(Ref ref) {
  final cart = ref.watch(cartProvider);
  return cart.fold(0, (sum, item) => sum + item.count);
}`,
          },
          {
            kind: 'p',
            html: '需要对外暴露「方法」的状态（加购、删除、清空），用 class 形态的 Notifier。类名继承 <code>_$类名</code>（生成器来填），<code>build()</code> 是初始状态，其他公开方法就是「修改状态的入口」：',
          },
          {
            kind: 'code',
            filename: 'lib/features/cart/logic/cart.dart',
            code: `import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/cart_item.dart';

part 'cart.g.dart';

/// 购物车状态。@riverpod 默认 autoDispose：购物页退出即清空。
@riverpod
class Cart extends _$Cart {
  @override
  List<CartItem> build() => const [];

  /// 加购：同款合并数量，异款追加
  void add(CartItem item) {
    final index = state.indexWhere((e) => e.id == item.id);
    if (index >= 0) {
      state = [...state]..[index] =
          state[index].copyWith(count: state[index].count + 1);
    } else {
      state = [...state, item];
    }
  }

  void remove(String id) {
    state = state.where((e) => e.id != id).toList();
  }

  void clear() => state = const [];
}`,
          },
          {
            kind: 'p',
            html: '和 freezed 三态组合，就是「从服务器拉数据」的标准写法 —— Notifier 的状态类型是 <code>Future&lt;T&gt;</code>（即 AsyncNotifier），Riverpod 自动帮你管理 loading / error / data 三态：',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/logic/order_list.dart',
            code: `import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/network/failure.dart';
import '../data/order.dart';
import '../data/order_repository.dart';

part 'order_list.g.dart';

/// 订单列表：AsyncNotifier 三件套。
/// build 里的 Future 由 Riverpod 管理 —— 未完成是 loading，
/// 抛错是 error，正常返回是 data。
@riverpod
class OrderList extends _$OrderList {
  @override
  Future<List<Order>> build() async {
    final result = await ref.watch(orderRepositoryProvider).fetchOrders();
    return switch (result) {
      Ok(:final data) => data,
      Err(:final failure) => throw failure, // 交给三态 UI 渲染
    };
  }

  /// 下拉刷新：ref.invalidateSelf() 重新执行 build
  void refresh() => ref.invalidateSelf();
}`,
          },
          {
            kind: 'keypoints',
            items: [
              '派生值（count、totalPrice、过滤结果）→ 函数式 provider，<code>ref.watch</code> 上游。',
              '有方法的状态（购物车、表单）→ <code>@riverpod class Xxx extends _$Xxx</code>，build 给初值。',
              '服务端数据 → 状态类型写 <code>Future&lt;T&gt;</code>，三态白送。',
              '改完带注解的类记得 build_runner 生成 —— 没生成时报的错都指向 <code>*.g.dart</code> 里的名字。',
            ],
          },
        ],
      },
      {
        id: 'e-consume',
        title: '3.4 消费三态与一次性事件',
        level: '进阶',
        summary: 'UI 消费 AsyncValue 用 switch 三分支；提示类事件用 ref.listen。这一节解决「为什么我的 SnackBar 弹了三次」。',
        blocks: [
          {
            kind: 'p',
            html: '消费端的标准形态是 <code>ConsumerWidget</code> + Dart 3 模式匹配：<code>AsyncValue</code> 的三个子类正好对应三个分支，<b>编译器强制你处理完 loading / error / data 才放行</b> —— 想漏掉错误态都难：',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/ui/order_list_page.dart',
            code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../logic/order_list.dart';
import 'widgets/order_tile.dart';

class OrderListPage extends ConsumerWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(orderListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('我的订单')),
      body: RefreshIndicator(
        onRefresh: () async => ref.read(orderListProvider.notifier).refresh(),
        child: switch (state) {
          AsyncLoading() => const Center(child: CircularProgressIndicator()),
          AsyncError(:final error) => ErrorRetryView(
              message: (error as Failure).userMessage(),
              onRetry: () =>
                  ref.invalidate(orderListProvider),
            ),
          AsyncData(:final value) => value.isEmpty
              ? const EmptyView(text: '还没有订单')
              : ListView.builder(
                  itemCount: value.length,
                  itemBuilder: (_, i) => OrderTile(order: value[i]),
                ),
        },
      ),
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '然后是新手第一大坑：SnackBar 弹提示。直觉写法是在「状态变化的地方」弹 —— 但状态变化往往发生在 build 期间或伴随重建，<b>同一条提示会被弹多次</b>。正确工具是 <code>ref.listen</code>：它只在值「变化」时回调一次，而且重建不会重复触发。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 在 build / 状态回调里直接弹',
              code: `// 提交结果用状态存：成功时 state = true
void _submit() {
  ref.read(submitProvider.notifier).submit();
}

@override
Widget build(BuildContext context, WidgetRef ref) {
  final ok = ref.watch(submitProvider);
  if (ok) {
    // 每次 rebuild 都会走到这里：
    // 键盘弹出、路由动画、任何 setState
    // —— SnackBar 弹了一次又一次
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('下单成功')));
  }
  ...
}`,
            },
            good: {
              title: '✅ ref.listen，变化才弹一次',
              code: `@override
Widget build(BuildContext context, WidgetRef ref) {
  // listen：只在值变化时回调一次，重建不重放
  ref.listen(submitProvider, (prev, next) {
    if (next && prev != true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('下单成功')),
      );
      ref.read(submitProvider.notifier).reset();
    }
  });

  return ...; // build 主体只管渲染
}`,
            },
            note: '口诀：<b>渲染用 watch，提示 / 跳页这类「一次性动作」用 listen</b>。凡是「弹窗、导航、震动」都不该写进 build 逻辑。',
          },
          {
            kind: 'keypoints',
            items: [
              '三态 UI 用 <code>switch (state)</code> 三分支，漏分支编译不过 —— 这是白送的健壮性。',
              '错误态必须给「重试」入口（<code>ref.invalidate</code> 即可，不用手动重新请求）。',
              'SnackBar / 路由跳转 / 系统反馈 → 一律 <code>ref.listen</code>。',
              'listen 的回调里先比较 prev 和 next，避免「新值恰好等于旧值」被误判为事件。',
            ],
          },
        ],
      },
      {
        id: 'e-state-test',
        title: '3.5 测试：ProviderContainer + overrides',
        level: '实战',
        summary: 'Riverpod 的状态逻辑可以在不启动任何 Widget 的情况下测试 —— 用假的 repository 覆盖真 provider 即可。',
        blocks: [
          {
            kind: 'p',
            html: 'Riverpod 可测试性的来源是 <b>ProviderContainer</b>：它就是 App 运行时那张 provider 图的独立实例。测试里创建一个 container，用 <code>overrides</code> 把「真仓库」换成「假仓库」，整条状态链路（repository → Notifier → 派生值）就都能在纯 Dart 里验证，不需要任何 UI：',
          },
          {
            kind: 'code',
            filename: 'test/logic/cart_test.dart',
            code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:my_shop/features/cart/data/cart_item.dart';
import 'package:my_shop/features/cart/logic/cart.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late ProviderContainer container;

  setUp(() {
    container = ProviderContainer();
    addTearDown(container.dispose);
  });

  group('购物车', () {
    test('同款加购合并数量', () {
      final cart = container.read(cartProvider.notifier);

      cart.add(const CartItem(id: 'p1', title: '手机壳', price: 29.9));
      cart.add(const CartItem(id: 'p1', title: '手机壳', price: 29.9));
      cart.add(const CartItem(id: 'p2', title: '钢化膜', price: 19.9));

      expect(container.read(cartProvider).length, 2);
      expect(container.read(cartCountProvider), 3);
    });

    test('删除后派生值同步', () {
      final cart = container.read(cartProvider.notifier);
      cart.add(const CartItem(id: 'p1', title: '手机壳', price: 29.9));

      cart.remove('p1');

      expect(container.read(cartProvider), isEmpty);
      expect(container.read(cartCountProvider), 0);
    });
  });
}`,
          },
          {
            kind: 'p',
            html: '牵扯到网络的 Notifier（比如订单列表），用 <code>overrides</code> 把 repository 换成 mocktail 生成的假对象，让「成功」「失败」都变成可精确控制的输入：',
          },
          {
            kind: 'code',
            filename: 'test/logic/order_list_test.dart',
            code: `class MockOrderRepository extends Mock implements OrderRepository {}

void main() {
  late MockOrderRepository repo;
  late ProviderContainer container;

  setUp(() {
    repo = MockOrderRepository();
    container = ProviderContainer(
      overrides: [
        // 把依赖图里的真仓库换成假仓库 —— 被测单元只有一个：Notifier
        orderRepositoryProvider.overrideWithValue(repo),
      ],
    );
    addTearDown(container.dispose);
  });

  test('接口失败时，状态进入 error 且携带 Failure', () async {
    when(() => repo.fetchOrders())
        .thenAnswer((_) async => const Result.err(NetworkFailure('断网')));

    // 订阅以触发 build 执行
    container.listen(orderListProvider, (_, __) {});
    await container.pump(); // 让 Future 跑完

    final state = container.read(orderListProvider);
    expect(state, isA<AsyncError>());
    expect((state as AsyncError).error, isA<NetworkFailure>());
  });
}`,
          },
          {
            kind: 'keypoints',
            title: '状态放哪的判断口诀',
            items: [
              '<b>临时 UI 态</b>（Tab 选中、动画开关、输入草稿）→ <code>setState</code>，别动 Riverpod。',
              '<b>跨页面共享</b>（购物车、登录态、用户信息）→ Riverpod（需要常驻的加 keepAlive）。',
              '<b>服务端缓存</b>（列表、详情）→ AsyncNotifier（<code>Future&lt;T&gt;</code> 状态），三态和刷新白送。',
              '测试状态逻辑用 ProviderContainer + overrides，不需要 pumpWidget。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 4 章 ════════════════════════════ */
  {
    id: 'ech4',
    no: '第 4 章',
    title: '路由：go_router',
    lead: '路由是「改起来最疼」的那类基建 —— 项目成型后再从 Navigator 迁到声明式路由，等于把所有页面动一遍。所以第一天就上 go_router。',
    sections: [
      {
        id: 'e-router-choice',
        title: '4.1 选型：为什么是 go_router',
        level: '基础',
        summary: 'Navigator 2.0 的 API 设计给「框架作者」用的，不是给业务开发的。go_router 是官方给的业务答案。',
        blocks: [
          {
            kind: 'table',
            head: ['方案', '一句话', '问题 / 优势'],
            rows: [
              ['Navigator 1.0', '<code>push / pop</code> 命令式', '简单，但没有 URL、无法深链、页面栈黑盒，Web 上浏览器返回键失效'],
              ['Navigator 2.0 裸写', 'Page / Router API', '能力最强但 API 极其底层，业务项目直接用是在造轮子'],
              ['<b>go_router</b>', '官方维护的声明式路由', '<b>URL 驱动、深链、Web 友好、重定向机制内建</b>'],
              ['auto_route', '社区方案，codegen 生成', '类型安全更强；多一套生成链路，换 go_router 官方维护更稳'],
            ],
          },
          {
            kind: 'p',
            html: 'go_router 的核心价值用一句话说：<b>「界面长什么样」由 URL 路由表唯一决定</b>。这带来三个实际好处：登录拦截只写一处（重定向逻辑在路由表上）；Web/桌面端浏览器前进后退、深链直达天然可用；新页面 = 在表里加一行，不用满项目找「上一页是哪」。',
          },
          {
            kind: 'keypoints',
            items: [
              '默认 go_router；页面极少的纯 App 可以 Navigator 1.0，但后面加 Web/深链时要还债。',
              'auto_route 类型安全更好，代价是多一条 codegen 链路 —— 按团队口味选，二选一即可。',
              '选 go_router 就把路由表当「唯一真相源」：禁止绕过路由表直接 Navigator.push。',
            ],
          },
        ],
      },
      {
        id: 'e-router-min',
        title: '4.2 最小配置：路由表 + MaterialApp.router',
        level: '基础',
        summary: '从 MaterialApp(home) 迁到 MaterialApp.router，顺便看路径参数怎么写。',
        blocks: [
          {
            kind: 'compare',
            bad: {
              title: '❌ MaterialApp(home) + 满天 push',
              code: `MaterialApp(home: HomePage());

// 每个跳转点都要知道目标页面长什么样：
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => OrderDetailPage(orderId: id),
  ),
);

// 登录拦截？要找到所有跳转点一个个改。
// 新页面从哪进？全项目搜 push。`,
            },
            good: {
              title: '✅ 集中路由表',
              code: `MaterialApp.router(routerConfig: router);

// 跳转只报 URL，不 import 目标页面：
context.push('/orders/\$order.id');

// 登录拦截只写一次（见 4.4 redirect）。
// 所有页面入口在一张表里，一眼看全。`,
            },
            note: '路由表集中之后，「新页面从哪进」这个问题消失了 —— 入口就是 URL，哪里需要哪里 push。',
          },
          {
            kind: 'code',
            filename: 'lib/app/router/app_router.dart',
            code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/order/ui/order_detail_page.dart';
import '../../features/order/ui/order_list_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/orders',
    routes: [
      // 列表页：静态路径
      GoRoute(
        path: '/orders',
        builder: (context, state) => const OrderListPage(),
      ),
      // 详情页：路径参数，:id 是占位符
      GoRoute(
        path: '/orders/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return OrderDetailPage(orderId: id);
        },
      ),
    ],
  );
});`,
          },
          {
            kind: 'p',
            html: '注意 <code>/orders/:id</code> 的写法：<code>:id</code> 是路径参数占位符，从 <code>state.pathParameters[&#39;id&#39;]</code> 取值。跳转侧就是拼 URL：<code>context.push(&#39;/orders/\${order.id}&#39;)</code>。<b>详情页只拿 id、自己去取数据</b>，这是声明式路由的正确姿势 —— 原因见 4.5 的 extra 大坑。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>MaterialApp.router(routerConfig: router)</code> 是新项目的标准壳。',
              '路由表集中一处，跳转只报 URL（<code>context.push</code>），不 import 目标页面。',
              '路径参数 <code>:id</code> 从 <code>state.pathParameters</code> 取；查询参数从 <code>state.uri.queryParameters</code> 取。',
            ],
          },
        ],
      },
      {
        id: 'e-shell',
        title: '4.3 底部导航骨架：StatefulShellRoute + IndexedStack',
        level: '进阶',
        summary: '带底部导航的 App 骨架，一处配置搞定「四个 Tab 各自保有自己的页面栈和滚动位置」。',
        blocks: [
          {
            kind: 'p',
            html: '带底部导航的 App 有个经典痛点：Tab 之间切换时，<b>每个 Tab 里的页面栈和滚动位置要不要保留</b>？裸写要自己管理一堆 Navigator key。go_router 给了现成答案：<code>StatefulShellRoute.indexedStack</code> —— 每个 branch 一条独立的路由子树，内部用 IndexedStack 保活（呼应组件手册的 indexed-stack 一章）：',
          },
          {
            kind: 'code',
            filename: 'lib/app/router/app_router.dart',
            code: `final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => HomeShell(shell: shell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: '/home', builder: (_, __) => const HomePage()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/orders',
              builder: (_, __) => const OrderListPage(),
              routes: [ // 二级页也挂在 branch 里，保栈
                GoRoute(
                  path: ':id',
                  builder: (_, s) =>
                      OrderDetailPage(orderId: s.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
          ]),
        ],
      ),
    ],
  );
});

/// 壳组件：body 换成 shell，底部挂 NavigationBar
class HomeShell extends StatelessWidget {
  const HomeShell({super.key, required this.shell});
  final StatefulNavigationShell shell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: shell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: shell.currentIndex,
        onDestinationSelected: (i) => shell.goBranch(
          i,
          // 再点当前 Tab → 回到该 Tab 的根页面（符合系统 App 的习惯）
          initialLocation: i == shell.currentIndex,
        ),
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home), label: '首页'),
          NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long), label: '订单'),
          NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}`,
          },
          {
            kind: 'keypoints',
            items: [
              '<code>StatefulShellRoute.indexedStack</code> = 底部导航 + 各 Tab 独立保活，一行配置替代全部手写。',
              '每个 Tab 的二级页挂在自己 branch 的 <code>routes</code> 里，切 Tab 栈不丢。',
              '再点当前 Tab 回根页面的交互，靠 <code>goBranch(i, initialLocation: true)</code> 一行实现。',
            ],
          },
        ],
      },
      {
        id: 'e-redirect',
        title: '4.4 登录态重定向',
        level: '实战',
        summary: '全局 redirect 一处拦截所有页面。这是从 Navigator 迁到声明式路由最实在的回报。',
        blocks: [
          {
            kind: 'p',
            html: '需求很常见：没登录访问任何页面 → 踢到 /login；已登录访问 /login → 送回 /orders 业务首页。命令式写法要在每个跳转点判断；go_router 只需一个全局 <code>redirect</code> —— <b>每次导航都会先过这道关卡</b>，你甚至不用在业务代码里写任何判断。',
          },
          {
            kind: 'code',
            filename: 'lib/app/router/app_router.dart',
            code: `final routerProvider = Provider<GoRouter>((ref) {
  // 登录态的可监听包装：值一变，路由自动重新评估 redirect
  // （authState 是个简单的 ValueNotifier<bool>，也可以由 Riverpod 登录态驱动）
  final loggedIn = ValueNotifier<bool>(false);
  ref.onDispose(loggedIn.dispose);

  return GoRouter(
    initialLocation: '/home',
    refreshListenable: loggedIn, // 关键：登录态变了触发重定向重算
    redirect: (context, state) {
      final loggingIn = state.matchedLocation == '/login';

      if (!loggedIn.value && !loggingIn) return '/login'; // 没登录 → 去 login
      if (loggedIn.value && loggingIn) return '/orders';  // 已登录 → 别停在 login
      return null; // 其余情况放行
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      // ...其余路由同 4.3
    ],
  );
});

// 登录成功后只做一件事，重定向自动发生：
// loggedIn.value = true;`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: '如果登录态已经在 Riverpod 里管理（多数项目如此），用 <code>ref.listen(authStateProvider, (_, v) =&gt; loggedIn.value = v)</code> 把 Riverpod 状态桥接到 <code>refreshListenable</code> 即可 —— go_router 需要的是一个 Listenable，不需要知道状态从哪来。别把整个 Riverpod 体系搬进路由层，桥一寸宽就够。',
          },
          {
            kind: 'keypoints',
            items: [
              '登录拦截写在全局 <code>redirect</code>，一处生效、全路由覆盖。',
              '<code>redirect</code> 必须是<b>纯函数</b>：只根据当前状态决定去哪，不发请求不弹窗。',
              '登录态变化要触发重算 → 挂 <code>refreshListenable</code>。',
              '业务代码里不该出现「检查登录再跳转」—— 那说明拦截漏了。',
            ],
          },
        ],
      },
      {
        id: 'e-extra',
        title: '4.5 传参的坑：extra 不可靠',
        level: '进阶',
        summary: 'extra 看着方便，是深链和 Web 的隐形炸弹。规则只有一条：路由间只传 id。',
        blocks: [
          {
            kind: 'p',
            html: 'go_router 提供了一个 <code>extra</code> 参数，能把任意对象塞进路由 —— 于是很多人顺手把整个 Order 对象传给详情页。它能跑，但有两个致命场景：',
          },
          {
            kind: 'note',
            tone: 'bad',
            html: '<b>坑 ①：Web 刷新即丢。</b>URL 里没有 extra 的影子，用户在详情页按 F5，extra 就没了 —— 对象字段全变 null，线上直接白屏或空指针。<b>坑 ②：深链进不来。</b>用户从分享链接、推送通知直达 <code>/orders/123</code>，这个请求没有经过「列表页选一条」，你根本没机会塞 extra。两种情况解法相同：<b>详情页只接收 id，自己调接口取数据</b> —— 反正 AsyncNotifier 的 loading 三态你已经会写了，刷新时用户看到的只是重新加载，而不是崩溃。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ extra 传整个对象',
              code: `// 列表页
context.push('/orders/detail',
    extra: order); // 传了整个对象

// 详情页
final order =
    GoRouterState.of(context).extra as Order;
// Web 刷新：extra == null → as 抛异常
// 深链进来：连 extra 都没塞过`,
            },
            good: {
              title: '✅ 只传 id，详情页自己取',
              code: `// 列表页
context.push('/orders/\${order.id}');

// 详情页
class OrderDetailPage extends ConsumerWidget {
  const OrderDetailPage({super.key,
      required this.orderId});
  final String orderId;

  // build 里按 id 取数据：
  // loading / error / data 三态兜底，
  // 刷新、深链、分享进来全都正常工作
  final detail = ref.watch(
      orderDetailProvider(orderId));
}`,
            },
            note: '唯一可以传对象的例外：「编辑表单」这类纯本地的中间态（从列表直接进编辑、必然有前置页面）。只要它刷新会丢不影响正确性，用 extra 才是省事而不是埋雷。',
          },
          {
            kind: 'keypoints',
            items: [
              '路由传参默认只传 id（路径参数）；详情页按 id 自己取数据。',
              'extra 在 Web 刷新必丢、深链必缺 —— 凡是「丢了会崩」的参数都别放 extra。',
              '所有页面都要经得起「直接输 URL 进入」的考验，这是声明式路由的基本修养。',
            ],
          },
        ],
      },
    ],
  },
];
