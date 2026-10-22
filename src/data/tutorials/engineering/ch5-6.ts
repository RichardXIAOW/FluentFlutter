import type { Chapter } from '../types';

/**
 * 工程化搭建指南 · 第 5 ~ 6 章（第 5 章为重写重点）
 *
 * 第 5 章 网络层与错误处理：dio 单例 / sealed Failure + Result / 端到端闭环 / 明确不要做的事
 * 第 6 章 国际化与本地存储：slang / 存储选型与 drift
 */
export const engineeringCh5to6: Chapter[] = [
  /* ════════════════════════════ 第 5 章 ════════════════════════════ */
  {
    id: 'ech5',
    no: '第 5 章',
    title: '网络层与错误处理',
    lead: '网络层是真实项目和 demo 项目的分水岭。这一章的目标：全项目只有一个 dio、错误只有一种形态、UI 永远不需要写 try-catch。',
    sections: [
      {
        id: 'e-dio',
        title: '5.1 dio 单例：一个 Provider 管住所有请求',
        level: '基础',
        summary: 'baseUrl 从 AppEnv 来、token 在拦截器加、日志只在 dev 打。配置一处生效，业务代码零配置。',
        blocks: [
          {
            kind: 'p',
            html: '<b>全项目只允许一个 dio 实例</b>，它以 Riverpod provider 的形态存在。所有「每个请求都要做的事」（带 token、统一超时、错误翻译、日志）都收敛在它的配置里。业务层（repository）从 provider 里拿 dio 用，自己不 new。',
          },
          {
            kind: 'code',
            filename: 'lib/core/network/dio_provider.dart',
            code: `import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../env/app_env.dart';
import '../storage/kv_store.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppEnv.apiBaseUrl, // 环境唯一来源，见 1.1
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
    ),
  );

  // 业务拦截器：每个请求自动带 token
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = ref.read(kvStoreProvider).getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer \$token';
        }
        handler.next(options);
      },
    ),
  );

  // 日志拦截器：只在非 prod 打 —— 线上包里打印响应体是安全事故
  if (AppEnv.showDebugPanel) {
    dio.interceptors.add(
      LogInterceptor(requestBody: false, responseBody: true),
    );
  }

  return dio;
});`,
          },
          {
            kind: 'p',
            html: '三个设计点值得停下来看：<b>① baseUrl 只读 AppEnv</b> —— 切环境改一个命令行参数，代码零改动；<b>② token 在拦截器加</b> —— 每个 repository 里手写 header 的做法，早晚会漏一个接口；<b>③ 日志用 AppEnv.showDebugPanel 门禁</b>而不是 kDebugMode —— 这样 staging 联调时也能看日志，prod 构建时整段剔除。另外注意 token 用 <code>ref.read</code>：拦截器只在发请求那一刻需要值，不该订阅它。',
          },
          {
            kind: 'keypoints',
            items: [
              'dio 全局唯一，以 provider 形态存在；业务代码 import provider，永不 <code>new Dio()</code>。',
              'baseUrl / 超时 / token / 日志全部在 provider 配置里收敛。',
              '日志拦截器用环境开关控制，且请求体别打（里面可能有密码）。',
            ],
          },
        ],
      },
      {
        id: 'e-result',
        title: '5.2 错误归一化：sealed Failure + Result<T>',
        level: '进阶',
        summary: 'try-catch 收敛到 repository 一层。UI 拿到的永远是「成功（带数据）」或「失败（带分类）」，不需要知道异常长什么样。',
        blocks: [
          {
            kind: 'p',
            html: '不做错误归一化的项目，UI 层是这个样子的：有的地方 catch DioException、有的地方 catch Exception、有的地方什么都不 catch —— 同一次断网，A 页面白屏、B 页面闪退、C 页面静默。根因是<b>异常在层层上抛，每一层都不得不关心它</b>。归一化的思路：把异常在 repository 层全部截住，翻译成统一的 <code>Failure</code>，用 <code>Result</code> 包装返回 —— <b>失败成为返回值的一部分，而不是要逃逸的异常</b>。',
          },
          {
            kind: 'code',
            filename: 'lib/core/network/failure.dart',
            code: `/// 错误的分类学。sealed 保证 switch 处理时漏类必报编译错。
sealed class Failure {
  const Failure();

  /// 给用户看的一句话（弹 SnackBar 用的是它，不是堆栈）
  String userMessage() => switch (this) {
        NetworkFailure(:final message) => message,
        ServerFailure(:final message) => message,
        ParseFailure() => '数据解析出错，请稍后重试',
        AuthFailure() => '登录已过期，请重新登录',
      };
}

/// 网络不通：断网、超时、DNS 失败
class NetworkFailure extends Failure {
  const NetworkFailure([this.message = '网络不给力，请检查网络后重试']);
  final String message;
}

/// 服务器明确回了错误：4xx / 5xx
class ServerFailure extends Failure {
  const ServerFailure(this.code, this.message);
  final int code;
  final String message;
}

/// 数据长错了：结构对不上、字段类型变了
class ParseFailure extends Failure {
  const ParseFailure(this.detail);
  final String detail;
}

/// 登录态失效：401 之类
class AuthFailure extends Failure {
  const AuthFailure() : super();
}`,
          },
          {
            kind: 'code',
            filename: 'lib/core/error/result.dart',
            code: `/// Result<T>：成功包数据，失败包 Failure。
/// 用 sealed + 工厂构造，调用方 switch 两种情况，编译器把关。
sealed class Result<T> {
  const Result();

  const factory Result.ok(T data) = Ok<T>;
  const factory Result.err(Failure failure) = Err<T>;
}

class Ok<T> extends Result<T> {
  const Ok(this.data);
  final T data;
}

class Err<T> extends Result<T> {
  const Err(this.failure);
  final Failure failure;
}`,
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ UI 层满天 try-catch',
              code: `// 每个页面都要长一套：
Future<void> load() async {
  try {
    final res = await dio.get('/orders');
    setState(() => orders = ...);
  } on DioException catch (e) {
    // 断网？超时？404？500？
    // 每个页面翻译一遍，口径必然不一
    if (e.type == DioExceptionType.connectionTimeout) {
      showToast('超时了');
    } else { ... }
  } catch (e) {
    showToast('出错了'); // 兜底永远写不周全
  }
}`,
            },
            good: {
              title: '✅ repository 返回 Result',
              code: `// UI 永远不写 try-catch：
final result = await repo.fetchOrders();

switch (result) {
  case Ok(:final data):
    render(data);
  case Err(:final failure):
    // 统一文案、统一口径，
    // 这里连 dio 是什么都不知道
    showToast(failure.userMessage());
}`,
            },
            note: '异常不是消失了，是被关进了 repository 的笼子。全项目 try-catch 只出现在 repository 一层，出现第二处就说明有代码绕过了 Result。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>Failure</code> 是分类学（sealed），<code>Result</code> 是容器（Ok / Err）。',
              'try-catch 只允许出现在 repository；UI 只认识 <code>failure.userMessage()</code>。',
              '每个 Failure 都要实现 <code>userMessage()</code> —— 给人看的话在这里写，别在 UI 里现场判断错误码。',
            ],
          },
        ],
      },
      {
        id: 'e-end2end',
        title: '5.3 端到端最小闭环：订单列表',
        level: '实战',
        summary: 'Repository → Notifier → UI 三段代码连起来，就是本指南网络层的全部。第 3 章的 Riverpod 在这里合流。',
        blocks: [
          {
            kind: 'p',
            html: '前面几节的零件（dio 单例、Result、freezed 模型、AsyncNotifier、三态 UI）现在拼成完整闭环。这一节的三段代码可以直接当模板抄 —— <b>项目里每个「列表页」都是这个形状</b>。第一段，Repository：调 dio、翻译错误、返回 Result：',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/data/order_repository.dart',
            code: `import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/error/result.dart';
import '../../../core/network/failure.dart';
import '../../../core/network/dio_provider.dart';
import 'order.dart';

class OrderRepository {
  OrderRepository(this._dio);
  final Dio _dio;

  Future<Result<List<Order>>> fetchOrders() async {
    try {
      final res = await _dio.get<List<dynamic>>('/orders');
      final orders = (res.data ?? const [])
          .map((e) => Order.fromJson(e as Map<String, dynamic>))
          .toList();
      return Result.ok(orders);
    } on DioException catch (e) {
      // 三类网络异常 → 三种 Failure，翻译一次，全项目复用
      switch (e.type) {
        case DioExceptionType.connectionError:
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.receiveTimeout:
          return const Result.err(NetworkFailure());
        default:
          final code = e.response?.statusCode ?? 0;
          if (code == 401) return const Result.err(AuthFailure());
          return Result.err(ServerFailure(
              code, e.response?.data?['message'] as String? ?? '服务器开小差了'));
      }
    } catch (e) {
      // 剩下的基本都是解析错（字段类型变了之类）
      return Result.err(ParseFailure(e.toString()));
    }
  }
}

final orderRepositoryProvider =
    Provider<OrderRepository>((ref) => OrderRepository(ref.watch(dioProvider)));`,
          },
          {
            kind: 'p',
            html: '第二段，Notifier：调 repository、拆 Result，把数据交给 Riverpod 的三态管理。这一段你在 3.3 已经见过，放在这里是为了看它的位置 —— <b>它只做拆包，不做任何错误翻译</b>：',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/logic/order_list.dart',
            code: `import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/error/result.dart';
import '../../../core/network/failure.dart';
import '../data/order.dart';
import '../data/order_repository.dart';

part 'order_list.g.dart';

@riverpod
class OrderList extends _$OrderList {
  @override
  Future<List<Order>> build() async {
    final result = await ref.watch(orderRepositoryProvider).fetchOrders();

    // Err 分支 throw 出去 → Riverpod 记成 error 态；
    // Ok 分支直接返回 → data 态。错误翻译已经在 repository 完成了。
    return switch (result) {
      Ok(:final data) => data,
      Err(:final failure) => throw failure,
    };
  }

  void refresh() => ref.invalidateSelf();
}`,
          },
          {
            kind: 'p',
            html: '第三段，UI：三态渲染 + 错误文案直接用 <code>userMessage()</code>。整个页面没有一行 try-catch，没有一次 dio import —— 它甚至不知道「网络」的存在：',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/ui/order_list_page.dart',
            code: `class OrderListPage extends ConsumerWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(orderListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('我的订单')),
      body: switch (state) {
        AsyncLoading() => const Center(child: CircularProgressIndicator()),
        AsyncError(:final error) => ErrorRetryView(
            // Failure.userMessage() —— 统一口径的错误文案
            message: (error as Failure).userMessage(),
            onRetry: () => ref.invalidate(orderListProvider),
          ),
        AsyncData(:final value) => ListView.builder(
            itemCount: value.length,
            itemBuilder: (_, i) => OrderTile(order: value[i]),
          ),
      },
    );
  }
}`,
          },
          {
            kind: 'keypoints',
            items: [
              '闭环三段职责固定：Repository 管「取 + 翻译错误」，Notifier 管「拆包 + 持有」，UI 管「三态渲染」。',
              'UI 不 import dio、不写 try-catch、不认识 Failure 的具体子类。',
              '错误文案只在 <code>Failure.userMessage()</code> 一个地方写，全 App 口径一致。',
              '新列表页 = 复制这套形状改类型。它是模板，不是特例。',
            ],
          },
        ],
      },
      {
        id: 'e-dont',
        title: '5.4 明确不要做的事',
        level: '基础',
        summary: '小项目里，下面这些「最佳实践」是负资产。',
        blocks: [
          {
            kind: 'p',
            html: '网络层是「过度工程」重灾区 —— 因为网上教程大多来自大厂实践，而大厂的问题是规模问题，不是你的问题。以下三条，业务简单时（十个接口以内、三五个页面）<b>明确不要做</b>：',
          },
          {
            kind: 'list',
            items: [
              '<b>每个接口包一层 UseCase / Interactor。</b>UseCase 的价值在于编排多个 repository、承载独立业务规则。你的「取订单列表」只有一个 repo 调用、零规则 —— 包一层 UseCase 只是把三行代码搬进第四个文件，改个字段要连穿 ui → notifier → usecase → repository。等真的出现「下单要同时扣库存 + 发通知 + 失败回滚」这种编排需求再引入，一分钟就能加。',
              '<b>fpdart / 全函数式改造。</b>Either、TaskEither、fp 风格链式处理对数学背景的人优雅，对多数团队是新的学习税 + review 门槛。sealed Result 已经给了你 90% 的类型安全，剩下 10% 不值得全组换范式。',
              '<b>在 UI / Notifier 里 new Dio。</b>哪怕「就这一个页面用」—— 有了第一个就有第二个，环境切换和 token 注入立刻裂开两套。永远从 <code>dioProvider</code> 拿。',
            ],
          },
          {
            kind: 'keypoints',
            title: '网络层检查单',
            items: [
              '全项目 <code>grep "Dio("</code> 只应该命中 dio_provider.dart 一处。',
              '全项目 <code>grep "try {"</code> 只应该出现在 repository 层。',
              'repository 方法返回 <code>Result&lt;T&gt;</code>，不返回裸数据、不抛裸异常。',
              'UseCase 等出现真实编排需求再加 —— 预支的架构是负债。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 6 章 ════════════════════════════ */
  {
    id: 'ech6',
    no: '第 6 章',
    title: '国际化与本地存储',
    lead: '两个「不起眼但返工最贵」的领域：文案硬编码后补国际化要逐页翻；存储选错了要带着数据搬家。',
    sections: [
      {
        id: 'e-i18n',
        title: '6.1 国际化：slang 优先，gen-l10n 保底',
        level: '进阶',
        summary: '结论：追求开发体验选 slang，必须跟官方生态选 gen-l10n。两条路的共同点是：文案永远不硬编码在 Widget 里。',
        blocks: [
          {
            kind: 'p',
            html: '<b>先说无论选哪个都不变的原则</b>：所有面向用户的文案，从第一天起就放进文案文件，不在 Widget 里写中文字符串。国际化最贵的不是配置，是「先硬编码、后补翻译」—— 届时每一页都要人工翻一遍，漏一个就永远漏下去。',
          },
          {
            kind: 'table',
            head: ['维度', 'slang', 'gen-l10n（官方）'],
            rows: [
              ['类型安全', '强 —— 生成强类型访问器 <code>t.cart.empty</code>，拼错编译不过', '弱 —— <code>AppLocalizations.of(context)!</code>，key 是字符串'],
              ['维护方式', '改 json/tsv，保存即生成，热重载可见', '改 .arb，跑命令生成，偶发生成器抽风'],
              ['复数 / 占位符', '开箱支持，语法简单', '支持，arb 语法较繁琐'],
              ['生态 / 稳妥性', '社区包，活跃维护', '<b>官方工具链，永远跟 Flutter 走</b>'],
              ['嵌套 / 命名空间', 'json 结构即命名空间', '扁平 key，靠前缀约定'],
            ],
          },
          {
            kind: 'p',
            html: '<b>结论：新项目默认 slang</b> —— 写起来快、类型安全，省下的时间是真的。<code>gen-l10n</code> 适合两种情况：公司规范强制官方方案；或者你不想在文档里多解释一个第三方依赖。功能上两者都够用，差别在 DX。',
          },
          {
            kind: 'p',
            html: 'slang 最小接入三步 —— 装包、写文案 json、挂进 MaterialApp：',
          },
          {
            kind: 'code',
            lang: 'json',
            filename: 'lib/i18n/strings_zh-CN.i18n.json',
            code: `{
  "greeting": "你好，{name}",
  "cart": {
    "empty": "购物车空空如也",
    "itemCount": "{count} 件商品",
    "checkout": "去结算"
  },
  "order": {
    "status": {
      "0": "待付款",
      "1": "已付款",
      "2": "已发货"
    }
  }
}`,
          },
          {
            kind: 'code',
            filename: 'lib/app/app.dart（挂载与使用）',
            code: `// 装包：flutter pub add --dev slang
// 生成：dart run slang  （也可挂 build_runner watch）

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import '../i18n/strings.g.dart'; // slang 生成的入口

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return TranslationProvider(
      child: MaterialApp.router(
        routerConfig: router,
        locale: TranslationProvider.of(context).flutterLocale,
        supportedLocales: AppLocaleUtils.supportedLocales,
        localizationsDelegates: GlobalMaterialLocalizations.delegates,
      ),
    );
  }
}

// 任意 Widget 里使用 —— 全程类型安全，拼错 key 编译不过：
// Text(t.greeting(name: '曹工'))
// Text(t.cart.empty)
// Text(t.cart.itemCount(count: 3))
// Text(t.order.status['1'])  // → 已付款`,
          },
          {
            kind: 'keypoints',
            items: [
              '文案从第一天进文件，不硬编码 —— 这是比选哪个包重要十倍的事。',
              '默认 slang；要跟官方生态选 gen-l10n，二者能力都够，别纠结超过十分钟。',
              '切换语言后 UI 自动刷新由 TranslationProvider 处理，不需要手动 setState。',
            ],
          },
        ],
      },
      {
        id: 'e-storage',
        title: '6.2 本地存储：KV 用 shared_preferences，查询用 drift',
        level: '进阶',
        summary: '结论：token、开关、设置存 shared_preferences；列表缓存、离线数据、搜索用 drift。isar 注意维护状态。',
        blocks: [
          {
            kind: 'p',
            html: '存储选型只有一道判断题：<b>你的数据要不要查询？</b>要不要=存 token、用户设置、功能开关这类「按 key 取 value」；要=存业务数据、要按条件查、要排序分页。判断完了查表：',
          },
          {
            kind: 'table',
            head: ['方案', '本质', '适合', '注意'],
            rows: [
              ['<code>shared_preferences</code>', 'KV 键值对', 'token、设置项、开关 —— 默认选择', '别当数据库用：key 一多就无法查询'],
              ['<b>drift</b>', '真 SQLite + 类型安全 API', '<b>列表缓存、离线数据、条件查询、排序分页</b>', '有 codegen，但换来的是编译期检查的 SQL'],
              ['<code>hive_ce</code>', 'KV + 盒子（社区续作）', '数据量偏大、需要加密的 KV 场景', '查询能力弱，关系型需求勉强'],
              ['isar', 'NoSQL 文档库', '原型验证、性能敏感的文档查询', '<b>先查维护状态再引入</b>，社区维护波动大'],
            ],
          },
          {
            kind: 'p',
            html: 'KV 侧（shared_preferences）没什么可讲的，两行 API。真正值得展开的是 drift —— 它是「SQLite 但有类型」：<b>表定义用 Dart 写，查询也是类型安全的 Dart，写错列名编译不过</b>，这对迭代频繁的表结构是巨大减负：',
          },
          {
            kind: 'code',
            filename: 'lib/core/storage/app_database.dart',
            code: `import 'package:drift/drift.dart';

part 'app_database.g.dart';

// ① 表定义：一个类一张表，字段类型写错编译不过
class OrderCache extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  RealColumn get amount => real()();
  IntColumn get status => integer()();
  DateTimeColumn get cachedAt => dateTime()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [OrderCache])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1; // 表结构变更时 +1 并写迁移

  // ② 查询：类型安全，IDE 直接补全列名
  Future<List<OrderCacheRow>> recentOrders({int limit = 20}) {
    return (select(orderCache)
          ..orderBy([(o) => OrderingTerm.desc(o.cachedAt)])
          ..limit(limit))
        .get();
  }

  // ③ upsert：onConflict 指定主键冲突时替换
  Future<void> cacheOrders(List<OrderCacheCompanion> rows) {
    return batch((b) {
      b.insertAllOnConflictUpdate(orderCache, rows);
    });
  }

  // ④ 按 id 取单条
  Future<OrderCacheRow?> orderById(String id) {
    return (select(orderCache)..where((o) => o.id.equals(id)))
        .getSingleOrNull();
  }
}`,
          },
          {
            kind: 'note',
            tone: 'info',
            html: 'drift 的常见用法是「网络缓存」：接口成功 → 写 drift；接口失败 → 读缓存兜底。搭配第 5 章的 Result 模式，<code>Err</code> 分支里查一次库，「断网也能看上次的数据」就是十几行代码的事。另外 <code>schemaVersion</code> 不是摆设 —— 上线后改表结构必须走迁移（<code>MigrationStrategy</code>），开发期改表最省事的办法是卸载重装。',
          },
          {
            kind: 'keypoints',
            items: [
              '一道判断题定存储：按 key 取 → shared_preferences；要查询 → drift。',
              'isar / hive_ce 引入前先看仓库维护状态 —— 存储层的迁移成本是所有层里最高的。',
              'drift 表结构变更 = schemaVersion +1 + 写迁移；开发期可以卸载重装偷懒，上线后不行。',
              '存储封装放 <code>core/storage</code>，暴露 Dart API，业务层不知道底下是 SQLite 还是 KV。',
            ],
          },
        ],
      },
    ],
  },
];
