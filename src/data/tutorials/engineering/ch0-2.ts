import type { Chapter } from '../types';

/**
 * 工程化搭建指南 · 第 0 ~ 2 章
 *
 * 选型总表 / 环境分档 / 项目骨架 / 依赖与代码生成。
 * 写作原则与 dart.ts 对齐：先结论、再对比、再最小可跑代码，每节 keypoints 收束。
 */
export const engineeringCh0to2: Chapter[] = [
  /* ════════════════════════════ 第 0 章 ════════════════════════════ */
  {
    id: 'ech0',
    no: '第 0 章',
    title: '这份指南怎么用',
    lead: '工程化不是炫技清单。它只解决一件事：让三个月后的你、和新来的同事，能不看运气地改代码。',
    sections: [
      {
        id: 'e-why',
        title: '0.1 工程化到底解决什么问题',
        level: '基础',
        summary: '先想清楚「为什么」，后面的每条选型你才知道自己在买什么。',
        blocks: [
          {
            kind: 'p',
            html: '跟着教程写 demo 的时候，一切都很美好：一个 main.dart、三五个文件、报错一眼就能看到。真实项目不是这样 —— 接口地址有三个环境、后台返回的数据结构会变、同事改了你的页面你不知道、三个月后你自己都忘了这段代码为什么这么写。',
          },
          {
            kind: 'p',
            html: '<b>工程化解决的就是这些「规模化之后才出现」的问题</b>。对照一下，一个没有做工程化的 Flutter 项目，三个月后通常长这样：',
          },
          {
            kind: 'list',
            items: [
              '环境配置散落在各个文件里，切换测试环境靠注释代码 —— 总有一次忘改就发布',
              '网络层每个页面自己 new Dio、自己 try-catch，同一个接口错误有人弹提示有人静默',
              '路由全是 <code>Navigator.push</code>，想加登录拦截得改几十个文件',
              '模型是手写的 <code>fromJson</code>，后台加一个字段，全项目照抄一遍',
              '没有任何测试和 CI，「能不能发版」取决于谁有空手动点一遍',
            ],
          },
          {
            kind: 'p',
            html: '这份指南会把这些逐个收敛掉。但它有一条贯穿始终的原则，先放在这里：',
          },
          {
            kind: 'note',
            tone: 'ok',
            html: '<b>拒绝过度工程。</b>每个技术点都会明确说「小项目不要做的事」。业务简单时给每个接口包一层 UseCase、强上 DDD 四层架构、为了三个页面引状态管理全家桶 —— 这些都会让项目更难维护，而不是更好维护。工程化的标准不是「用了多少先进方案」，而是「新人能不能半天看懂目录、安全地提一个 PR」。',
          },
          {
            kind: 'p',
            html: '还有一个时间维度要注意：<b>2026 年的主流实践</b>意味着本指南按 Flutter 3.3x / Dart 3.9+ / Material 3 编写，状态管理默认 Riverpod 3 的 codegen 写法，路由默认 go_router。如果你在维护老项目，个别写法对不上很正常 —— 先看「选型理由」，再决定要不要迁移，不要为了新而新。',
          },
        ],
      },
      {
        id: 'e-stack',
        title: '0.2 全站技术选型总表',
        level: '基础',
        summary: '一页看完整个技术栈。后面每一章会展开「为什么选它、怎么用、坑在哪」。',
        blocks: [
          {
            kind: 'p',
            html: '下面这张表是整份指南的地基。每一行在后面都有独立章节展开，这里先给你全局印象 —— <b>为什么是它、备选是什么、什么情况下换备选</b>。',
          },
          {
            kind: 'table',
            head: ['领域', '选型', '一句话理由', '备选'],
            rows: [
              ['状态管理', '<code>Riverpod 3</code>', '编译期安全、无 context 依赖、测试友好，社区事实标准', 'Bloc（超大团队强规范时）'],
              ['路由', '<code>go_router</code>', '官方维护、声明式 URL、深链和 Web 友好', 'auto_route（需要更强类型生成时）'],
              ['模型', '<code>freezed + json_serializable</code>', '一个注解搞定不可变模型 + copyWith + fromJson', '手写（不建议）、dart_mappable'],
              ['网络', '<code>dio</code>', '拦截器、取消、超时齐全，中文社区资料最多', 'http（简单项目够用）'],
              ['错误处理', '<code>sealed Result</code>', '把「失败」变成类型的一部分，UI 不用满天 try-catch', '直接抛异常（不推荐）'],
              ['国际化', '<code>slang</code>', '类型安全、写起来最快', 'gen-l10n（要跟官方生态时）'],
              ['KV 存储', '<code>shared_preferences</code>', '官方维护，存 token/开关/设置足够', 'hive_ce（量大或要加密时）'],
              ['结构化存储', '<code>drift</code>', '真 SQLite、类型安全、支持复杂查询', 'isar（注意维护状态）'],
              ['Lint', '<code>flutter_lints</code>', '官方默认，零配置起步', 'very_good_analysis（团队要求严格时）'],
              ['CI', '<code>GitHub Actions</code>', '和仓库零距离，PR 门禁免费', 'GitLab CI / Codemagic'],
            ],
          },
          {
            kind: 'p',
            html: '最终的项目形态就是下面这棵树（feature-first 结构，第 1.3 节细讲）。你可以先扫一眼有个印象 —— <b>读完整份指南之后，你应该能独立搭出这棵树</b>：',
          },
          {
            kind: 'code',
            lang: 'yaml',
            filename: '项目最终形态（feature-first）',
            maxHeight: 420,
            code: `lib/
├── main.dart                    # 入口：只做 bootstrap（环境校验、DB 初始化、runApp）
├── app/
│   ├── app.dart                 # MaterialApp.router + 全局主题 + 国际化挂载
│   └── router/
│       └── app_router.dart      # go_router 路由表 + 登录态重定向
├── core/
│   ├── env/
│   │   └── app_env.dart         # 环境分档（--dart-define）
│   ├── network/
│   │   ├── dio_provider.dart    # dio 单例 + 拦截器
│   │   └── failure.dart         # sealed Failure 层级
│   ├── error/
│   │   └── result.dart          # Result<T>（Ok / Err）
│   ├── storage/
│   │   ├── kv_store.dart        # shared_preferences 封装
│   │   └── app_database.dart    # drift 数据库
│   └── theme/
│       └── app_theme.dart       # Material 3 主题
└── features/
    ├── order/
    │   ├── data/
    │   │   ├── order.dart       # freezed 模型
    │   │   └── order_repository.dart
    │   ├── logic/
    │   │   └── order_list.dart  # Riverpod Notifier
    │   └── ui/
    │       ├── order_list_page.dart
    │       └── widgets/
    └── cart/
        ├── data/
        ├── logic/
        └── ui/`,
          },
          {
            kind: 'keypoints',
            title: '学习路径建议',
            items: [
              '<b>不要按顺序等学完再动手。</b>正确顺序是：第 1 章先把骨架搭起来（半天），然后直接开始写业务，缺什么回来查对应的章。',
              '第 3、4、5 章是核心三件套（状态 / 路由 / 网络），值得完整读，其余章节用到再查。',
              '每章结尾的 keypoints 是浓缩版，忘了先看 keypoints，不够再进正文。',
              '选型不用背：跟着指南做完一个项目，这套组合自然就是你的默认配置。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 1 章 ════════════════════════════ */
  {
    id: 'ech1',
    no: '第 1 章',
    title: '起步：环境与项目骨架',
    lead: '这一章做完，你会得到一个干净、分档清晰、结构合理、有 Lint 门禁的空项目。后续所有章节都在这个骨架上长出来。',
    sections: [
      {
        id: 'e-env',
        title: '1.1 环境分档：--dart-define 优先，flavor 是例外',
        level: '基础',
        summary: '绝大多数项目只需要 --dart-define。flavor 是为「同一套代码发多个不同原生形态的包」准备的，不要一上来就配。',
        blocks: [
          {
            kind: 'p',
            html: '<b>结论先行：接口地址、环境开关、功能开关，一律用 <code>--dart-define</code></b>。只有当不同环境的「原生资源」不一样（应用图标、名称、包名不同，比如同一个 App 要给两个公司各发一版），才值得上 flavor。很多教程上来就教配 flavor，那是把例外当成了常规。',
          },
          {
            kind: 'table',
            head: ['维度', '--dart-define', 'flavor'],
            rows: [
              ['能改什么', '任意编译期常量（Dart 层读取）', '图标、名称、包名、原生资源全套'],
              ['配置成本', '命令行加一个参数', 'android/ios 原生工程各配一套'],
              ['切换方式', 'run/build 命令里写', 'IDE scheme / xcodebuild 参数'],
              ['适用场景', 'dev / staging / prod 接口切换', '多品牌分发、渠道包'],
              ['常见的坑', '值会编译进产物，<b>别放密钥</b>', '配置散在原生层，维护成本高'],
            ],
          },
          {
            kind: 'p',
            html: '落地方式是给项目写一个 <code>AppEnv</code> 类，<b>作为读取环境变量的唯一入口</b>。业务代码里不许散落 <code>String.fromEnvironment</code> —— 散落了你就永远说不清「到底有几处读环境」。',
          },
          {
            kind: 'code',
            filename: 'lib/core/env/app_env.dart',
            code: `/// 环境配置：全项目唯一的入口。
/// 业务代码只 import 这个类，禁止直接写 String.fromEnvironment。
class AppEnv {
  const AppEnv._();

  /// 启动命令传：--dart-define=APP_ENV=prod
  /// 不传默认 dev —— 本地 flutter run 不用记任何参数
  static const String _name = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'dev',
  );

  /// 给日志和报错用的只读视图
  static String get name => _name;

  static const bool isDev = _name == 'dev';
  static const bool isStaging = _name == 'staging';
  static const bool isProd = _name == 'prod';

  /// 各环境接口地址：加新环境只改这里
  static String get apiBaseUrl => switch (_name) {
        'prod' => 'https://api.example.com',
        'staging' => 'https://staging-api.example.com',
        _ => 'http://localhost:8080',
      };

  /// 调试面板（切环境、清缓存）只在非 prod 显示
  static bool get showDebugPanel => !isProd;
}`,
          },
          {
            kind: 'p',
            html: '然后在入口处加两道保险。<code>assert</code> 只在 debug/profile 下执行，用来在开发期拦住「配置矛盾」；release 包的校验则用运行时检查 —— <b>打包脚本忘了传参数，就让它在测试机上直接崩，而不是悄悄把 dev 配置带到线上</b>。',
          },
          {
            kind: 'code',
            filename: 'lib/main.dart',
            code: `import 'package:flutter/foundation.dart' show kReleaseMode;
import 'package:flutter/material.dart';

import 'app/app.dart';
import 'core/env/app_env.dart';

void main() {
  // 保险 ①：debug 期发现配置矛盾，立刻报错（assert 会被 release 剔除，零开销）
  assert(() {
    if (AppEnv.isProd && !kReleaseMode) {
      throw StateError('APP_ENV=prod 却在跑 debug？检查启动脚本');
    }
    return true;
  }());

  // 保险 ②：release 包必须是 prod —— 打包脚本漏传参数，测试机直接崩
  if (kReleaseMode && !AppEnv.isProd) {
    throw StateError(
      'release 包必须用 --dart-define=APP_ENV=prod 构建，'
      '当前环境是 \${AppEnv.name}',
    );
  }

  runApp(const ShopApp());
}`,
          },
          {
            kind: 'code',
            lang: 'bash',
            filename: '常用启动 / 打包命令',
            code: `# 本地开发：不传参数，默认 dev
flutter run

# 连测试环境联调
flutter run --dart-define=APP_ENV=staging

# 打生产包（混淆见第 8 章，这里先记住完整形态）
flutter build apk --release \\
  --dart-define=APP_ENV=prod \\
  --obfuscate --split-debug-info=build/symbols`,
          },
          {
            kind: 'keypoints',
            items: [
              '环境读取收敛到 <code>AppEnv</code> 一个类，业务代码零 <code>String.fromEnvironment</code>。',
              'dev 不传参、staging 传参联调、prod 只出现在打包脚本里。',
              '<code>assert</code> 管 debug 期矛盾，<code>kReleaseMode</code> 检查管 release 包。',
              'dart-define 的值会编译进产物，密钥类的东西永远别放这里。',
            ],
          },
        ],
      },
      {
        id: 'e-create',
        title: '1.2 项目创建与清理',
        level: '基础',
        summary: 'flutter create 之后的第一件事不是写代码，是把 counter demo 和默认依赖清干净。',
        blocks: [
          {
            kind: 'p',
            html: '创建命令只有一条，重点是 <code>--org</code> 要想好 —— 它决定了包名（Android applicationId / iOS bundle id），<b>上架之后改包名的代价比重建项目还大</b>。组织域名倒过来写：公司是 example.com，org 就是 com.example。',
          },
          {
            kind: 'code',
            lang: 'bash',
            filename: '创建项目',
            code: `# --org 决定包名，--platforms 控制要哪些端（按实际需要选，别全平台都要）
flutter create my_shop --org com.example.shop --platforms android,ios,web

# 验证：起得来、能热重载，再往下走
flutter run`,
          },
          {
            kind: 'p',
            html: '接下来是清理。模板自带的 counter demo 和一堆「看起来都会用到」的依赖，是新手项目的两大噪音源。建议照着这个清单过一遍：',
          },
          {
            kind: 'list',
            items: [
              '<code>main.dart</code> 里的 counter 逻辑整段删掉，换成你的 <code>MaterialApp</code> 入口（1 分钟）',
              '测试目录里的默认 <code>widget_test.dart</code> 会编译失败（它引用了 counter），直接删或重写',
              'pubspec 里的 <code>cupertino_icons</code> 用 Material 3 基本用不上，可删',
              '<code>README.md</code> 换成你自己项目的三行说明：怎么跑、环境变量、目录约定',
            ],
          },
          {
            kind: 'p',
            html: '关于依赖，最大的坑是「预支焦虑」：还没写第一行业务，就把 twenty 个包装进 pubspec。依赖是分批装的 —— 每个包什么时候装，第 2 章有一张完整的表。这里只说原则：',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 一把梭全装',
              code: `# 项目第一天：
flutter pub add dio riverpod go_router freezed \\
  drift slang get_bloc mockito golden_toolkit ...

# 结果：build_runner 没配、版本互相冲突、
# 一半的包三个月没用过，
# 升级 Flutter 时每个包都是雷`,
            },
            good: {
              title: '✅ 按需分批装',
              code: `# 第一天：只装跑起来必须的
flutter pub add flutter_riverpod go_router

# 写到模型时再装模型三件套
flutter pub add freezed_annotation json_annotation
flutter pub add --dev freezed json_serializable build_runner

# 每批装完跑一次分析，确认干净
flutter analyze`,
            },
            note: '每批依赖都对应指南的一章。装的时候读那一章，比装完再看省一半时间。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>--org</code> 定包名，上架后改不动，创建前想清楚。',
              '先删 counter 和默认测试，再开始写代码 —— 否则 <code>flutter test</code> 第一天就是红的。',
              '依赖分批装：跑得起来 → 写模型 → 接网络 → 国际化存储，每批装完跑一次 <code>flutter analyze</code>。',
            ],
          },
        ],
      },
      {
        id: 'e-structure',
        title: '1.3 目录结构：feature-first',
        level: '基础',
        summary: '按「功能」分目录，而不是按「技术分层」分目录。这是本指南最重要的一条结构决定。',
        blocks: [
          {
            kind: 'p',
            html: '目录结构只有两个流派值得讨论：<b>layer-first</b>（顶层按 data / logic / ui 分）和 <b>feature-first</b>（顶层按订单 / 购物车 / 用户分，每个 feature 内部再分层）。判断标准很简单：改一个功能要在几个目录之间跳？',
          },
          {
            kind: 'table',
            head: ['维度', 'layer-first（按层分）', 'feature-first（按功能分）'],
            rows: [
              ['顶层目录', '<code>models/ pages/ providers/ repositories/</code>', '<code>features/order/ features/cart/</code>'],
              ['改「订单列表加一列」要跳', '4~5 个目录，来回穿梭', '1 个目录内闭环'],
              ['删一个功能', '到各层目录里翻找散落的文件', '删一个文件夹'],
              ['多人协作', '所有人都在改同几个目录，冲突密集', '按 feature 分工，冲突自然减少'],
              ['适合', '极小的 demo、纯工具类项目', '有多个业务模块的真实项目'],
            ],
          },
          {
            kind: 'p',
            html: 'layer-first 的隐含假设是「改需求会横跨所有功能」—— 实际恰恰相反，<b>真实需求几乎总是落在单个功能里</b>。所以本指南全部按 feature-first 组织，标准树在第 0.2 节你已经见过，这里补上每个目录的职责约定：',
          },
          {
            kind: 'term',
            items: [
              {
                term: 'lib/main.dart',
                desc: '入口只做 bootstrap：环境校验、必要的初始化、<code>runApp</code>。<b>不写任何业务逻辑</b>。',
              },
              {
                term: 'lib/app/',
                desc: '应用壳：<code>MaterialApp.router</code>、路由表、全局配置。这里的东西全局只有一份。',
              },
              {
                term: 'lib/core/',
                desc: '跨功能共享的基础设施：网络、存储、主题、错误、环境。判断标准 —— 它自己<b>不包含任何业务概念</b>。出现了 <code>OrderService</code> 就该搬进 features。',
              },
              {
                term: 'lib/features/&lt;feature&gt;/data',
                desc: '该功能的模型（freezed）和 repository（负责网络/数据库调用，返回 Result）。',
              },
              {
                term: 'lib/features/&lt;feature&gt;/logic',
                desc: 'Riverpod provider / Notifier：持有状态、调用 repository、暴露方法。不含 Widget。',
              },
              {
                term: 'lib/features/&lt;feature&gt;/ui',
                desc: '页面和专属小组件。只消费 logic 层的状态，不直接碰 dio 和数据库。',
              },
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html: '<b>小功能不要强制三层。</b>一个「设置页」总共三个文件的事，硬拆 data / logic / ui 是仪式感，不是架构。规则：<b>状态超过一个 provider、或需要调接口，才拆三层</b>；否则一个文件夹放平即可。同理，不要一上来就 data / domain / presentation 四层 —— domain 层（纯业务用例）只有当业务规则复杂到值得独立测试时才出现，第 5.4 节细说。',
          },
          {
            kind: 'keypoints',
            items: [
              '按功能分目录，不按技术层分目录 —— 改一个功能应该只打开一个文件夹。',
              '<code>core/</code> 里不许出现业务词汇，出现了就搬走。',
              '层是长出来的，不是预支的：简单功能一个文件夹，复杂了才拆三层。',
            ],
          },
        ],
      },
      {
        id: 'e-lint',
        title: '1.4 Lint 与格式化：让机器管风格',
        level: '基础',
        summary: '代码风格不应该出现在 code review 里。Lint 管规则，format 管排版，CI 管住两者。',
        blocks: [
          {
            kind: 'p',
            html: '<b>结论：新项目从 <code>flutter_lints</code> 起步就够了</b> —— 它是 <code>flutter create</code> 的默认配置，覆盖了官方推荐的大部分规则。什么时候升级到 <code>very_good_analysis</code>？当你所在的团队需要更严格的强制（禁 print、必须写文档注释、必须处理异步返回值），并且愿意为它多花时间时。它是「进阶选项」，不是「正确选项」。',
          },
          {
            kind: 'code',
            lang: 'yaml',
            filename: 'analysis_options.yaml（最小可用形态）',
            code: `include: package:flutter_lints/flutter.yaml
# 团队要求严格时再换成：
# include: package:very_good_analysis/analysis_options.yaml

analyzer:
  exclude:
    # 生成文件不参与分析 —— 它们是机器写的，人改了也会被覆盖
    - "**/*.g.dart"
    - "**/*.freezed.dart"

linter:
  rules:
    prefer_single_quotes: true
    # 有 async 但没 await 的方法要显式 unawaited()，防漏 await
    unawaited_futures: true`,
          },
          {
            kind: 'p',
            html: '排版交给 <code>dart format</code>，没有讨论空间 —— <b>所有 Dart 文件都应该被 format 过</b>，这件事不配占用人的注意力。真正容易失守的不是规则本身，而是「没人执行」：总有人忘了 format、总有人 new 一个 warning 不管。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 靠自觉',
              code: `// 约定：提交前请 format + analyze
// 现实：
//   - 有人 IDE 配了 format，有人没配
//   - analyze 的 warning 攒了 47 个没人管
//   - review 里反复出现"这里缩进不对"
//   - 三个月后没人敢动 analyze 配置，
//     因为一动全是错`,
            },
            good: {
              title: '✅ CI 卡门禁',
              code: `# .github/workflows/ci.yml（第 8 章有完整版）
- run: dart format --set-exit-if-changed .
- run: flutter analyze --fatal-infos
- run: flutter test

# 效果：
#   - format 不过 → PR 直接红
#   - warning 数量只准减不准增
#   - review 里再无风格话题`,
            },
            note: '第一次跑 <code>--set-exit-if-changed</code> 全红是正常的：先 <code>dart format .</code> 一把过，再清 analyze 的存量问题（通常半小时以内）。',
          },
          {
            kind: 'keypoints',
            items: [
              '<code>flutter_lints</code> 起步，团队有强规范需求再上 <code>very_good_analysis</code>。',
              '生成文件（<code>*.g.dart</code> / <code>*.freezed.dart</code>）一律加入 analyzer exclude。',
              'format 不用讨论，全量执行；执行靠 CI 卡，不靠自觉。',
              'analyze 的 warning 要清零并保持清零 —— 存量警告会让新问题永远被淹没。',
            ],
          },
        ],
      },
    ],
  },

  /* ════════════════════════════ 第 2 章 ════════════════════════════ */
  {
    id: 'ech2',
    no: '第 2 章',
    title: '依赖与代码生成',
    lead: '这一章解决两件事：依赖到底什么时候装、装哪些；以及 freezed / build_runner 这套代码生成的工作方式。代码生成是 Flutter 工程化绕不开的一环，提前把心法建立好，后面每章都会受益。',
    sections: [
      {
        id: 'e-deps',
        title: '2.1 依赖分批表',
        level: '基础',
        summary: '每个包对应指南的一章，写到哪章装哪批。别提前装 —— 没用上的依赖是纯负债。',
        blocks: [
          {
            kind: 'p',
            html: '下面这张表是第 1.2 节「分批装」的完整版。一个实用的检验标准：<b>pubspec 里的每一个包，你应该都能说出「它替我干了什么活」</b>；说不出来的，就是该删的。',
          },
          {
            kind: 'table',
            head: ['批次', '包', '用途', '什么时候装'],
            rows: [
              ['状态', '<code>flutter_riverpod</code>', '状态管理运行时', '第 1 天就要（App 壳会用到）'],
              ['状态', '<code>riverpod_annotation</code> + <code>riverpod_generator</code>(dev)', 'Riverpod 3 的 codegen 写法', '与上一条同批'],
              ['路由', '<code>go_router</code>', '声明式路由', '第 1 天（App 壳即 <code>MaterialApp.router</code>）'],
              ['模型', '<code>freezed_annotation</code>', 'freezed 模型的运行时注解', '第一次写模型时'],
              ['模型', '<code>json_annotation</code>', '<code>json_serializable</code> 的注解', '第一次接接口时'],
              ['模型', '<code>freezed / json_serializable</code>(dev)', '对应的生成器', '与上两条同批'],
              ['代码生成', '<code>build_runner</code>(dev)', '所有 codegen 的执行器', '与 freezed 同批（只装一次）'],
              ['网络', '<code>dio</code>', 'HTTP 客户端', '第一次接真实接口时'],
              ['国际化', '<code>slang</code>(dev)', '类型安全的文案生成', '有第一个面向用户的文案时'],
              ['存储', '<code>shared_preferences</code>', 'KV 存储', '存 token / 用户设置时'],
              ['存储', '<code>drift / drift_dev</code>(dev)', '结构化 SQLite', '出现列表缓存、离线数据、搜索需求时'],
              ['工具', '<code>mocktail</code>(dev)', '测试 mock', '第一次写测试时'],
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html: '安装姿势有讲究：<b>运行时的注解包（<code>freezed_annotation</code>、<code>json_annotation</code>、<code>riverpod_annotation</code>）装在 dependencies</b>，因为生成的代码里会 import 它们；<b>生成器（<code>freezed</code>、<code>json_serializable</code>、<code>riverpod_generator</code>、<code>build_runner</code>）装在 dev_dependencies</b>，只在构建时用。装反了也能跑，但打出来的包会白白变大。',
          },
          {
            kind: 'keypoints',
            title: '分批安装命令速查',
            items: [
              '第 1 批：<code>flutter pub add flutter_riverpod go_router</code>',
              '第 2 批：<code>flutter pub add freezed_annotation json_annotation</code> + <code>flutter pub add --dev freezed json_serializable build_runner</code>',
              '第 3 批（接接口）：<code>flutter pub add dio</code>',
              '每批之后：<code>flutter analyze</code> 确认干净，再装下一批。',
            ],
          },
        ],
      },
      {
        id: 'e-freezed',
        title: '2.2 freezed + json_serializable：模型别手写',
        level: '基础',
        summary: '手写模型的每一段 boilerplate 都是未来的 bug 来源。一个注解让生成器替你写，而且写得比你稳。',
        blocks: [
          {
            kind: 'p',
            html: '一个正经的数据模型需要什么？不可变字段、<code>copyWith</code>、<code>==</code> / <code>hashCode</code>、<code>toString</code>、<code>fromJson</code> / <code>toJson</code>。手写这些的问题不是「麻烦」，是<b>每一份都是抄来的代码</b>：抄 <code>copyWith</code> 漏一个字段、<code>fromJson</code> 类型抄错、加字段忘了改 <code>==</code> —— 全是运行时才炸的 bug。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 手写模型',
              code: `class Order {
  const Order({required this.id, required this.title,
    required this.amount, this.status = 0});
  final String id;
  final String title;
  final double amount;
  final int status;

  // copyWith：30 行起步，加字段漏改一处就埋雷
  Order copyWith({String? id, String? title,
      double? amount, int? status}) {
    return Order(
      id: id ?? this.id,
      title: title ?? this.title,
      amount: amount ?? this.amount,
      status: status ?? this.status,
    );
  }

  // == 和 hashCode：大概率忘写，写了大概率抄错
  // fromJson：每个字段一遍 as / cast，类型错运行时才炸
  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String,
      title: json['title'] as String,
      amount: (json['amount'] as num).toDouble(),
      status: json['status'] as int? ?? 0,
    );
  }
}`,
            },
            good: {
              title: '✅ freezed 一个注解',
              code: `@freezed
class Order with _$Order {
  const factory Order({
    required String id,
    required String title,
    required double amount,
    @Default(0) int status,
  }) = _Order;

  factory Order.fromJson(Map<String, dynamic> json) =>
      _$OrderFromJson(json);
}

// copyWith / == / hashCode / toString / fromJson / toJson
// 全部生成。加字段只改构造函数，重新生成即可。`,
            },
            note: '生成的代码在哪看不到也没关系，它们是 <code>order.freezed.dart</code> 和 <code>order.g.dart</code>，永远不要手改。',
          },
          {
            kind: 'p',
            html: 'freezed 还有一杀手锏：<b><code>sealed</code> 状态类</b>。把「一个页面可能处于的几种状态」建模成封闭集合，配合 Dart 3 的模式匹配，编译器会强制你处理每一种情况 —— 新增一个状态，所有没处理它的 <code>switch</code> 直接编译报错，而不是运行时白屏。',
          },
          {
            kind: 'code',
            filename: 'lib/features/order/logic/order_state.dart',
            code: `import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../core/network/failure.dart';
import '../data/order.dart';

part 'order_state.freezed.dart';

/// 订单列表的三态。sealed 保证 switch 漏分支时编译报错。
@freezed
sealed class OrderState with _$OrderState {
  const factory OrderState.loading() = OrderLoading;
  const factory OrderState.error(Failure failure) = OrderError;
  const factory OrderState.data(List<Order> orders) = OrderData;
}`,
          },
          {
            kind: 'p',
            html: '生成命令就是 build_runner，两个姿势 —— 日常开发用 watch（挂着自动生成），提交前用 build 确认一遍：',
          },
          {
            kind: 'code',
            lang: 'bash',
            filename: 'build_runner 常用命令',
            code: `# 一次性生成（提交前跑）
dart run build_runner build --delete-conflicting-outputs

# 开发时挂着，改了自动生成（推荐单开一个终端）
dart run build_runner watch --delete-conflicting-outputs

# 生成器抽风时的标准恢复流程
flutter clean
flutter pub get
dart run build_runner build --delete-conflicting-outputs`,
          },
          {
            kind: 'note',
            tone: 'bad',
            html: '<b>常见报错速查：</b>「The getter &#39;copyWith&#39; isn&#39;t defined」→ 生成文件不存在或过期，先跑 build_runner；build_runner 卡在 build script → <code>flutter clean</code> + 删 <code>.dart_tool</code> 再来；<code>--delete-conflicting-outputs</code> 是防「生成文件与手改冲突」的，加上它就不会问你删不删。',
          },
          {
            kind: 'keypoints',
            title: '2.3 codegen 心法',
            items: [
              '<b>生成文件永远不手改</b>（<code>*.g.dart</code> / <code>*.freezed.dart</code>）—— 手改会在下次生成时被覆盖，且覆盖没有提示。',
              '改了带注解的源码没生效？检查 watch 终端是否还活着，或手动跑一次 build。',
              '<code>--delete-conflicting-outputs</code> 每次都带上，省掉交互确认。',
              '生成文件要提交进 git（团队协作时别人 clone 下来能直接编译，不依赖本地 codegen 环境）。',
              '什么改动需要跑 build_runner：改了 <code>@freezed</code> / <code>@riverpod</code> / <code>@JsonSerializable</code> / <code>@DriftDatabase</code> 注解的类。纯 UI 改动不需要。',
            ],
          },
        ],
      },
    ],
  },
];
