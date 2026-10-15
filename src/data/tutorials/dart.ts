import type { Chapter } from './types';

/**
 * Dart 语言讲解 · 内容
 *
 * 来源：
 *   第 0 章 —— 本站原创（面向零基础，补齐「能写」这一层）
 *   第 1 章 —— 由工程化指南「附录 E · Dart 高级语法速查」搬运并改写为本站排版
 *   第 2 章 —— 一页纸总结 + 练习路线
 *
 * 写作原则：每条都按「是干啥的 / 什么时候用 / 常见的坑」三段式，
 * 不解释编译器原理，只回答「我该写哪个」。
 */
export const dartTutorial: Chapter[] = [
  /* ══════════════════════════════════════════════════════ */
  {
    id: 'ch0',
    no: '第 0 章',
    title: '先把 Dart 写出来',
    lead: '这一章只解决一件事：让你能读懂也写得出 Flutter 项目里 80% 的代码。不追求语言完整性，只讲天天要碰的东西。',
    sections: [
      {
        id: 'd-intro',
        title: '0.1 开始之前：Dart 到底是什么、为什么 Flutter 选它',
        level: '基础',
        summary:
          '花两分钟建立整体印象，比一上来就背语法有用得多。知道「它为什么长这样」，后面很多设计就不用死记。',
        blocks: [
          {
            kind: 'p',
            html: 'Dart 是 Google 在 2011 年发布的语言，早期主要想做「替代 JavaScript」。真正让它起量的是 Flutter —— 2017 年后，Dart 基本成了 Flutter 的专用语言。<b>所以你现在学 Dart，99% 的场景就是写 Flutter。</b>',
          },
          {
            kind: 'term',
            items: [
              {
                term: '它是「静态类型」的',
                desc: '每个变量都有确定的类型，编译器在<b>写代码时</b>就能发现类型错误。这跟 JavaScript、Python 那类「跑起来才知道错」的语言是两个世界。',
              },
              {
                term: '同时支持「面向对象」和「函数式」',
                desc: '你可以写类、继承、接口；也可以写 <code>list.where((x) =&gt; x &gt; 0).map((x) =&gt; x * 2)</code> 这种链式风格。Flutter 里两种都大量使用。',
              },
              {
                term: '编译成两种东西',
                desc: '开发时用 <b>JIT</b>（即时编译），支持热重载 —— 改一行代码不到一秒就看到效果；发布时用 <b>AOT</b>（提前编译），编成机器码，性能接近原生。这是 Flutter 开发体验好的根本原因。',
              },
              {
                term: '自带「空安全」',
                desc: '2021 年引入。它把「这个值可能是 null」变成类型系统的一部分，是 Dart 最有价值的一条规则（0.3 节细讲）。',
              },
            ],
          },
          {
            kind: 'keypoints',
            title: '这一页怎么用',
            items: [
              '第 0 章是「能写」：类型、空安全、函数、类、集合、异步。看一遍，遇到不懂的回来查。',
              '第 1 章是「写稳」：sealed、模式匹配、copyWith、mixin 这些工程化必备的写法。做项目前值得完整读。',
              '第 2 章是「速查」：一页表格 + 练习建议。忘了就来扫一眼。',
              '每段代码都能直接贴进 <b>dartpad.dev</b> 跑。不要只读，改一改再跑，理解速度会快很多。',
            ],
          },
        ],
      },

      {
        id: 'd-type',
        title: '0.2 类型：Dart 是「强类型」但不用处处写类型',
        level: '基础',
        summary:
          'Dart 是静态类型语言 —— 类型错了编译就过不去。但它有类型推断，绝大多数时候你不用手写类型。',
        blocks: [
          {
            kind: 'p',
            html: '新手最容易误会的一点：以为 Dart 像 JavaScript 那样「变量什么都能装」。不是的。Dart 的每个变量都有确定类型，只是编译器能替你推断出来而已。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/types.dart',
            code: `void main() {
  // 推断：编译器从右边看出这是 String，你不用写
  var name = 'Flutter';        // 类型是 String
  var count = 42;              // 类型是 int
  var ratio = 0.75;            // 类型是 double

  name = 123;                  // ❌ 编译错误：String 不能装 int
  // 这就是强类型的好处 —— 错误在写代码时就报，而不是上线后

  // 想显式写类型也行，两种等价，团队里统一一种即可
  String a = 'Flutter';
  var b = 'Flutter';
}`,
          },
          {
            kind: 'p',
            html: '关于数字有个小坑要提前说：<b>Dart 没有「整数自动变小数」这回事</b>。<code>int</code> 除以 <code>int</code> 结果仍是 <code>int</code>（向下取整），想要小数必须显式转换。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/numbers.dart',
            code: `void main() {
  print(7 / 2);        // 3.5    ← / 永远返回 double
  print(7 ~/ 2);       // 3      ← ~/ 是整除，返回 int
  print(7 % 2);        // 1      ← 取余

  final price = 18.5;              // double
  final count = 3;                 // int
  // final total = price * count;  // ✅ double * int = double，没问题

  print((2.7).round());            // 3   四舍五入
  print((2.2).ceil());             // 3   向上取整
  print((2.9).floor());            // 2   向下取整
  print(18.5.toStringAsFixed(1));  // '18.5'  格式化小数位（金额显示必备）

  // 字符串转数字：解析失败会抛异常，所以有 tryParse 这个安全版本
  print(int.parse('42'));          // 42
  print(int.tryParse('abc'));      // null  ← 不抛异常，返回 null
}`,
          },
          {
            kind: 'table',
            head: ['类型', '装什么', '字面量写法'],
            rows: [
              ['<code>int</code>', '整数（没有小数点的数）', '<code>42</code> <code>-7</code>'],
              ['<code>double</code>', '小数', '<code>0.75</code> <code>3.14</code>'],
              ['<code>num</code>', '<code>int</code> 和 <code>double</code> 的父类型', '一般不用主动写'],
              ['<code>String</code>', '文本', "<code>'单引号'</code> <code>\"双引号\"</code>"],
              ['<code>bool</code>', '真 / 假', '<code>true</code> <code>false</code>'],
              ['<code>List&lt;T&gt;</code>', '有序列表', '<code>[1, 2, 3]</code>'],
              ['<code>Map&lt;K, V&gt;</code>', '键值对', "<code>{'id': 1}</code>"],
              ['<code>Set&lt;T&gt;</code>', '去重集合', '<code>{1, 2, 3}</code>'],
              ['<code>dynamic</code>', '什么都装，编译期不检查', '能不用就别用，见下'],
              ['<code>Object?</code>', '任何类型的父类，可能为 null', '需要「类型待定」时用它'],
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 用 dynamic 当万金油',
              code: `dynamic data = fetchApi();
// 编译器什么都不知道，
// 下面这行完全合法，跑起来才崩
print(data.userName.wrongMethod());

// 更糟的是：方法名拼错了也不报错，
// 直到那行代码真的被执行`,
            },
            good: {
              title: '✅ 用具体类型或 Object?',
              code: `final data = fetchApi();       // 有确定类型
print(data.userName);

Object? raw = readConfig();
if (raw is Map<String, dynamic>) {
  print(raw['name']);          // 判断类型后，编译器才允许这样用
}`,
            },
            note:
              '<code>dynamic</code> 会关掉 Dart 最值钱的静态检查能力。全项目搜一下 <code>dynamic</code>，能换成具体类型的都换掉。',
          },
        ],
      },

      {
        id: 'd-nullsafety',
        title: '0.3 空安全：Dart 最有价值的一条规则',
        level: '基础',
        summary:
          '「这个值可能是 null」必须写进类型里。整个语言帮你堵住了「忘记判空」这类历史上最贵的 bug。',
        blocks: [
          {
            kind: 'p',
            html: '在空安全之前，你写的每个 <code>user.name</code> 都可能是定时炸弹 —— 只要 <code>user</code> 恰好是 null 就崩。Dart 的解法很直接：<b>能装 null 的类型，必须在类型后面加个问号</b>。不带问号的类型，编译器保证它永远不是 null。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/null_safety.dart',
            code: `String a = 'hello';       // 永远不是 null
String? b = null;          // 可能为 null —— 问号是显式声明

void main() {
  print(a.length);         // ✅ 安全，a 不可能是 null
  // print(b.length);      // ❌ 编译错误：b 可能是 null

  // 三种正确的取用方式
  print(b?.length);        // ① 安全调用：b 是 null 就整个表达式的值是 null
  print(b ?? '默认值');     // ② 空合并：b 是 null 就用右边的
  if (b != null) {
    print(b.length);       // ③ 判空之后，编译器会把 b 当作 String
  }
}`,
          },
          {
            kind: 'table',
            head: ['写法', '叫什么', '效果'],
            rows: [
              ['<code>a?.b</code>', '安全调用', '<code>a</code> 为 null 时返回 null，不崩'],
              ['<code>a ?? c</code>', '空合并', '<code>a</code> 为 null 时取 <code>c</code>'],
              ['<code>a ??= c</code>', '空赋值', '<code>a</code> 为 null 时才把 <code>c</code> 赋给它'],
              ['<code>a!</code>', '断言非空', '告诉编译器「我保证不是 null」—— 猜错就运行时崩'],
              ['<code>a?.b?.c</code>', '链式安全调用', '中间任一环为 null 就整体返回 null'],
              ['<code>late T a</code>', '延迟初始化', '声明时不赋值，用时才赋；漏赋会抛 <code>LateInitializationError</code>'],
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 看到红线就加 ! 消掉',
              code: `// 编译器说不安全，我加个 ! 让它闭嘴
final name = user!.profile!.nickname!;

// 这三个 ! 是在向编译器「保证」不为 null。
// 只要有一个猜错，线上就崩，
// 而且崩的位置离问题源头很远，极难查。`,
            },
            good: {
              title: '✅ 往上找根因',
              code: `// 1) 先把「可能为空的边界」收掉
final user = await repo.currentUser();
if (user == null) {
  return const LoginPrompt();      // 明确处理「没登录」
}

// 2) 进了这个分支之后，类型已经收窄，不需要 !
final name = user.profile.nickname ?? '匿名用户';`,
            },
            note:
              '<code>!</code> 只应该在「逻辑上绝不可能为 null，但类型系统看不出来」时用，且旁边写一句注释说明为什么。',
          },
          {
            kind: 'keypoints',
            title: '空安全三条铁律',
            items: [
              '接口返回值、网络响应字段、可选的 UI 参数 —— 一律标 <code>?</code>，让编译器帮你盯着。',
              '有默认值就一定要给，<code>??</code> 优先于 <code>!</code>。',
              '每个 <code>!</code> 都要能被一句话解释清楚为什么安全；解释不出来就是设计有问题。',
            ],
          },
        ],
      },

      {
        id: 'd-function',
        title: '0.4 函数与命名参数：Flutter 代码里到处是这个',
        level: '基础',
        summary:
          'Flutter 的构造函数几乎全是「命名参数」风格。看不懂它，就读不懂组件文档里的写法。',
        blocks: [
          {
            kind: 'p',
            html: '两种参数：<b>位置参数</b>（按顺序传）和<b>命名参数</b>（写在花括号里，按名字传）。Flutter 里几乎所有 Widget 构造都用命名参数，因为一个 Widget 可能有十几个可选配置，位置参数根本没法用。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/functions.dart',
            code: `// 位置参数：按顺序传
String greet(String name, int age) => '你好 \$name，\$age 岁';

// 命名参数：用 {} 包起来，调用时必须写名字
// required 表示必填，不加 required 就是可选
void showDialog({
  required String title,
  String? content,
  bool barrierDismissible = true,   // 给默认值就不用 required
}) {
  print('\$title / \$content / \$barrierDismissible');
}

void main() {
  print(greet('小明', 18));

  showDialog(title: '删除确认');                    // ✅ content 可省
  showDialog(content: '...', title: '删除确认');    // ✅ 顺序无所谓
  // showDialog();                                  // ❌ 编译错误：title 必填

  // 函数也是值，可以当参数传 —— Flutter 的事件回调就是这么来的
  final double Function(double) twice = (x) => x * 2;
  print([1, 2, 3].map(twice).toList());            // [2, 4, 6]
}`,
          },
          {
            kind: 'p',
            html: '<b>箭头函数与多行函数的区别</b>：<code>=&gt;</code> 右边只能是一个表达式，不能有语句块。有 <code>if</code>、<code>for</code>、多个语句时就得用 <code>{ }</code>。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/arrow.dart',
            code: `// 单表达式 → 可以箭头
int square(int x) => x * x;
String label(int n) => n > 0 ? '正' : '非正';

// 多语句 → 必须用花括号 + return
String describe(int n) {
  if (n > 0) return '正数';
  if (n < 0) return '负数';
  return '零';
}

// 作为回调时最常见的两种写法
final list = [1, 2, 3, 4];
print(list.where((n) => n.isEven).toList());     // [2, 4]  单表达式
print(list.map((n) {
  final doubled = n * 2;                          // 多语句
  return doubled + 1;
}).toList());                                     // [3, 5, 7, 9]`,
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b>为什么 Flutter 这么做</b>加 <code>required</code> 的作用是把「忘记传参数」从运行时的崩溃，变成编译时的红线。这就是「让机器替你检查」的思路 —— 后面第 1 章的高级语法基本都是同一个思路的延伸。',
          },
        ],
      },

      {
        id: 'd-class',
        title: '0.5 类：构造函数、字段、继承',
        level: '基础',
        summary: 'Flutter 里你写的每个页面、每个自定义组件都是一个类。构造函数的几种简写必须认得。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/scratch/classes.dart',
            code: `class Product {
  final String id;          // final：构造进来后不再改
  final String name;
  final double price;
  bool selected = false;    // 有默认值，不用进构造函数

  // ① 简写：this.id 直接把参数赋给同名字段
  const Product({
    required this.id,
    required this.name,
    required this.price,
  });

  // ② 具名构造：给「另一种造法」起个名字
  Product.free(this.id, this.name) : price = 0;

  // ③ 计算属性：像字段一样用，实际每次算
  String get priceLabel => '¥\${price.toStringAsFixed(2)}';

  // ④ 方法
  Product copyWith({double? price}) => Product(
        id: id,
        name: name,
        price: price ?? this.price,   // 不传就用原值
      );
}

void main() {
  const p = Product(id: 'A1', name: '咖啡', price: 18.5);
  print(p.priceLabel);                       // ¥18.50
  print(p.copyWith(price: 15).priceLabel);   // ¥15.00
  final f = Product.free('A2', '赠品');
  print(f.priceLabel);                       // ¥0.00
}`,
          },
          {
            kind: 'p',
            html: '<b>继承用 <code>extends</code>，实现接口用 <code>implements</code>，复用行为用 <code>with</code>（mixin，1.6 节细讲）。</b>三者目的不同，不要混着用。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/inherit.dart',
            code: `abstract class Shape {
  double area();                       // 抽象方法：子类必须实现
}

class Circle extends Shape {           // extends：继承实现
  final double r;
  Circle(this.r);

  @override
  double area() => 3.14159 * r * r;
}

class Printable {                      // 只是个「能力」声明
  void printMe() => print('被打印了');
}

class Square extends Shape with Printable {   // 继承 + 混入能力
  final double side;
  Square(this.side);

  @override
  double area() => side * side;
}

void main() {
  final s = Square(3);
  print(s.area());     // 9.0
  s.printMe();         // 从 mixin 得来的方法
}`,
          },
          {
            kind: 'list',
            items: [
              '<b><code>this.x</code> 简写</b>：省掉 <code>id = id</code> 这种同义反复，Flutter 源码里满屏都是。',
              '<b><code>const</code> 构造函数</b>：字段全是 final、初始化表达式全是常量时才能标。标了之后同一份配置全 App 只存在一份实例，是 Flutter 性能优化的第一步。',
              '<b>具名构造</b>：<code>Product.free(...)</code>。常见于 <code>fromJson</code>、<code>.empty()</code>、<code>.copyWith()</code> 这类「另一种造法」。',
              '<b><code>get</code> 计算属性</b>：没有自己的存储，每次访问重新计算。适合「由其他字段推出来」的值，别在里做重活。',
              '<b><code>@override</code> 注解</b>：不是必须写，但强烈建议写 —— 拼错父类方法名时它会报错，否则你会以为覆盖成功了。',
            ],
          },
        ],
      },

      {
        id: 'd-collection',
        title: '0.6 集合：List / Map / Set 与常用操作',
        level: '基础',
        summary:
          '这三种是你处理数据的主力。掌握 map / where / fold 三个方法，就能应付绝大多数场景。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/scratch/collections.dart',
            code: `void main() {
  final nums = [1, 2, 3, 4, 5];

  // map：一对一转换
  final doubled = nums.map((n) => n * 2).toList();      // [2, 4, 6, 8, 10]

  // where：筛选
  final evens = nums.where((n) => n.isEven).toList();   // [2, 4]

  // fold：把整个列表「折」成一个值
  final sum = nums.fold<int>(0, (acc, n) => acc + n);   // 15

  // any / every：判断「有没有」/「是不是全都」
  print(nums.any((n) => n > 4));                        // true
  print(nums.every((n) => n > 0));                      // true

  // 链式：找第一个 > 3 的偶数
  final found = nums.where((n) => n.isEven).firstWhere((n) => n > 3); // 4

  // 排序（会改变原列表）
  final unsorted = [3, 1, 2];
  unsorted.sort((a, b) => a.compareTo(b));              // [1, 2, 3]

  // Map 的遍历与安全取值
  final stock = {'咖啡': 12, '茶': 0};
  stock['果汁'] = 5;
  print(stock['咖啡']);              // 12
  print(stock['不存在的键']);         // null —— 不会崩

  stock.forEach((k, v) => print('\$k: \$v'));
  print(stock.containsKey('茶'));    // true
  print(stock.keys.toList());       // [咖啡, 茶, 果汁]

  // 展开运算符
  final more = [...nums, 6, 7];      // [1..5, 6, 7]
  final merged = {...stock, '水': 99};
}`,
          },
          {
            kind: 'p',
            html: '<b><code>Set</code> 与 <code>List</code> 的区别只有一条：Set 自动去重。</b>需要在列表里做「唯一性」判断时，用 Set 比反复 <code>contains</code> 快得多。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 忘了 toList（惰性视图的坑）',
              code: `// map / where 返回的不是 List，是「惰性视图」：
// 每次遍历都会重新算一遍
final view = nums.map((n) => expensiveCalc(n));

print(view.first);     // 算一次
print(view.last);      // 又全算一遍
print(view.length);    // 再全算一遍

// 而且很多 List 的方法它没有
// view[0]  ← 报错：视图不支持索引`,
            },
            good: {
              title: '✅ 要当数据用就 toList()',
              code: `// 立刻求值一次，之后就是普通 List
final list = nums.map((n) => expensiveCalc(n)).toList();

print(list.first);     // 查缓存
print(list.last);
print(list.length);
print(list[0]);        // ✅ 可以用索引

// 注意：要传给 Widget 的集合基本都要 toList()`,
            },
            note:
              '规律：<code>map</code> / <code>where</code> / <code>take</code> / <code>skip</code> 都是惰性的，末尾补 <code>.toList()</code> 才变成真数据。',
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>另一个常见坑：<code>sort</code> 会原地修改列表。</b>如果你不想动原数据，先复制：<code>final sorted = [...list]..sort();</code>（<code>..</code> 是级联运算符，返回列表本身）。',
          },
        ],
      },

      {
        id: 'd-async',
        title: '0.7 异步：Future / async / await',
        level: '基础',
        summary:
          '网络请求、读文件、等用户操作 —— 全是异步。这一节只讲能用的部分，Stream 放到第 1 章。',
        blocks: [
          {
            kind: 'p',
            html: '一句话理解：<code>async</code> 函数返回一个「将来会有值」的盒子，也就是 <code>Future</code>。<code>await</code> 是「打开盒子拿值」的语法糖。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/async.dart',
            code: `// 模拟一个网络请求
Future<String> fetchUserName(int id) async {
  await Future.delayed(const Duration(milliseconds: 300));  // 假装在等网络
  if (id <= 0) throw Exception('id 不合法');
  return '用户 \$id';
}

// 方式一：async/await —— 读起来像同步代码，推荐
Future<void> load() async {
  try {
    final name = await fetchUserName(1);
    print(name);
  } catch (e) {
    print('失败了：\$e');          // await 抛的异常能被 try 接住
  } finally {
    print('无论如何都会走这里');
  }
}

// 方式二：.then —— 老写法，嵌套多了会很难读
void loadOld() {
  fetchUserName(1).then((name) => print(name)).catchError((e) => print(e));
}

void main() => load();`,
          },
          {
            kind: 'p',
            html: '<b>并发比串行快得多，别忘了 <code>Future.wait</code>。</b>三个互不依赖的请求，串行要 3 倍时间，并发只要 1 倍。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/concurrent.dart',
            code: `// ❌ 串行：总耗时 = 三个请求之和
Future<void> loadSlow() async {
  final a = await getUser();      // 等 300ms
  final b = await getOrders();    // 再等 300ms
  final c = await getCoupons();   // 再等 300ms
  // 总共约 900ms
}

// ✅ 并发：总耗时 = 最慢的那个
Future<void> loadFast() async {
  final results = await Future.wait([
    getUser(),
    getOrders(),
    getCoupons(),
  ]);
  final a = results[0];           // 类型是 List<Object?>，要转
}

// ✅ 类型安全版（Dart 3 的记录语法）—— 推荐
Future<void> loadTyped() async {
  final (user, orders, coupons) = await (
    getUser(),
    getOrders(),
    getCoupons(),
  ).wait;
  // 三个变量类型都是正确的，不用转
}`,
          },
          {
            kind: 'table',
            head: ['场景', '写法'],
            rows: [
              ['等一个结果', '<code>final x = await f();</code>'],
              ['并发等多个（结果同类型）', '<code>await Future.wait([f1(), f2()]);</code>'],
              ['并发等多个（结果不同类型）', '<code>final (a, b) = await (f1(), f2()).wait;</code>'],
              ['只关心「都完成了」', '<code>await Future.wait([...], eagerError: false);</code>'],
              ['给异步加超时', '<code>await f().timeout(Duration(seconds: 5));</code>'],
              ['不关心结果也不等', '<code>f();</code> 直接调用（异常会变 unhandled）'],
              ['在 build 里', '<b>不要</b> await —— 用 <code>FutureBuilder</code> 或状态管理'],
            ],
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ await 之后直接用 context',
              code: `Future<void> submit() async {
  final res = await api.submit(data);
  Navigator.of(context).pop(res);
  // ⚠️ await 期间用户可能已经返回了，
  // 这个页面已销毁，context 失效 → 崩溃
}`,
            },
            good: {
              title: '✅ 先判断还活着',
              code: `Future<void> submit() async {
  // 更稳：动手前先把要用的取出来
  final nav = Navigator.of(context);
  final res = await api.submit(data);
  if (!mounted) return;          // State 里用 mounted
  nav.pop(res);
}`,
            },
            note:
              '在 <code>State</code> 里用 <code>mounted</code>；在没有 mounted 的地方用 <code>context.mounted</code>。这是 Flutter 里最常见的崩溃原因之一。',
          },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════ */
  {
    id: 'ch1',
    no: '第 1 章',
    title: '工程化必备的高级语法',
    lead: '这一章原先是工程化指南的附录 E，现在搬到这里。它们不是炫技 —— 每一个都在替你做一件机器能做的检查。',
    sections: [
      {
        id: 'd-qualifiers',
        title: '1.1 var / final / const / late final：到底该用哪个',
        level: '进阶',
        summary: '这几个是新手最容易糊在一起的。判断顺序只有一个，从上往下问。',
        blocks: [
          {
            kind: 'code',
            lang: 'dart',
            code: `值在编译期就能算出来吗？（字面量、纯运算）
  ├─ 能 → const     常量，编译期内联，零运行时开销
  └─ 不能
      ├─ 只赋值一次，之后永不改 → final
      │     ├─ 值要等运行时才知道（读配置、拿 context）→ late final
      │     └─ 立即能算出来 → final
      └─ 之后还要改 → var（局部变量）
                       具名字段别用 var，见下面坑 ③`,
          },
          {
            kind: 'code',
            filename: 'lib/scratch/qualifiers.dart',
            code: `// ── const：编译期常量。同一份字面量在整个 App 里只存在一份。
const double kPagePadding = 16;
const Color kBrandSeed = Color(0xFF409EFF);   // 构造函数是 const → 可以 const

// ── final：运行期只赋值一次。它是「实例字段」，每个实例一份。
class DemoController {
  final DemoRepository _repo;        // 构造进来后就不换了 —— 这正是我们要的
  const DemoController(this._repo);
}

// ── final 局部变量：习惯性写 final，编译器帮你挡住手滑
void expand(List<String> raw) {
  final cleaned = raw.where((s) => s.trim().isNotEmpty).toList();
  // cleaned = [];                   // ← 编译错误，正合我意
  print(cleaned.length);
}

// ── late final：声明时不赋值，第一次读的时候才求值，且只求一次。
class CartPage {
  late final CartController controller = CartController();
  // 用到才创建，不会被白创建
}`,
          },
          {
            kind: 'table',
            head: ['修饰符', '何时求值', '能改吗', '典型场景'],
            rows: [
              ['<code>const</code>', '编译期', '不能', '颜色、间距、固定配置'],
              ['<code>final</code>', '运行时一次', '不能', '构造注入的依赖、一次算好的值'],
              ['<code>late final</code>', '首次读取时', '不能', '依赖 this 或昂贵对象的字段'],
              ['<code>var</code>', '运行时', '能', '局部变量、循环计数'],
              ['<code>late</code>（非 final）', '首次赋值时', '能', '极少用，慎用'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>三个最常见的坑</b><br>① <b><code>const</code> 不等于「值不变」，是「编译期已知」。</b><code>const now = DateTime.now()</code> 编译不过，因为 <code>DateTime.now()</code> 不是常量构造。<br>② <b><code>final</code> 只锁「引用」不锁「内容」。</b><code>final list = [];</code> 之后 <code>list.add(1)</code> 完全合法 —— <code>final</code> 保证的是这个变量名不再指向别的列表。想连内容都锁死，用 <code>const [1, 2, 3]</code> 或 <code>List.unmodifiable(...)</code>。<br>③ <b>公开 API 上别用 <code>var</code> 当字段。</b>类的字段默认可变，等于把内部状态敞开给所有人改。约束应当是「默认 final，确实需要才放开」。',
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ late 被当成「逃避初始化」的工具',
              code: `class Page {
  late String title;   // 没有初始化！

  void render() {
    print(title.length);
    // 如果构造后忘了赋值：
    // LateInitializationError: Field 'title'
    // has not been initialized
  }
}`,
            },
            good: {
              title: '✅ 能立刻给值就别用 late',
              code: `class Page {
  final String title;                 // 构造必须传

  const Page({required this.title});
}

// 或者：真的有默认值
class Page2 {
  String title = '未命名';
}`,
            },
            note:
              '<code>late</code> 是给「我保证赋值了」这句话打白条。忘了兑现，运行时会在第一次读它的时候才抛错 —— 比 null 更迟、更难查。只有「需要 this」或「想延迟到用时才创建」这两个正当理由。',
          },
        ],
      },

      {
        id: 'd-sealed',
        title: '1.2 abstract / abstract final class / sealed：三种「我不能随便被继承」',
        level: '进阶',
        summary: '这三个修饰符都在回答同一个问题：谁能继承我？答案不同，编译器能帮你做的检查也不同。',
        blocks: [
          {
            kind: 'table',
            head: ['写法', '谁能继承 / 实现', '编译器能帮你检查什么', '典型用途'],
            rows: [
              [
                '<code>abstract class</code>',
                '谁都能继承；不能直接 new',
                '只检查「子类有没有实现抽象方法」',
                '定义接口 / 基类',
              ],
              [
                '<code>abstract final class</code>',
                '谁都不能继承，只能当静态容器',
                '防止别人拿它当接口用',
                '纯常量 / 纯工具方法的家',
              ],
              [
                '<code>sealed class</code>',
                '只有<b>同一个文件</b>里的子类能继承',
                '<b>switch 时少写一个分支就编译报错</b>',
                '状态机、接口返回结果的多种情况',
              ],
            ],
          },
          {
            kind: 'p',
            html: '<b>先说 <code>abstract final class</code>：纯常量容器。</b>当一组常量或工具方法不属于任何实例时，它需要一个「家」。用普通 class 的话，别人可能继承它、new 它，都是误用。',
          },
          {
            kind: 'code',
            filename: 'lib/core/app_spacing.dart',
            code: `abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
}

// 用起来：AppSpacing.md
// 别人写 class X extends AppSpacing 会直接编译报错 —— 这就是我们要的`,
          },
          {
            kind: 'p',
            html: '<b>再重点说 <code>sealed</code>：让编译器替你找漏掉的分支。</b>它最适合描述「只有这几种可能」的数据。比如一个网络请求的结果，要么成功带数据、要么失败带原因、要么还在加载，除此之外没有第四种。',
          },
          {
            kind: 'code',
            filename: 'lib/features/product/product_state.dart',
            code: `sealed class ProductState {
  const ProductState();
}

class ProductLoading extends ProductState {
  const ProductLoading();
}

class ProductReady extends ProductState {
  final List<Product> items;
  const ProductReady(this.items);
}

class ProductFailed extends ProductState {
  final String message;
  const ProductFailed(this.message);
}

// ── 关键在这里：switch 覆盖全部情况，少写一个就编译不过
Widget buildBody(ProductState state) {
  return switch (state) {
    ProductLoading() => const CircularProgressIndicator(),
    ProductReady(:final items) => ProductList(items),
    ProductFailed(:final message) => ErrorView(message),
    // 试着删掉上面任意一行 —— 编译器会立刻报错告诉你漏了
  };
}`,
          },
          {
            kind: 'keypoints',
            title: '为什么这比 enum 强',
            items: [
              '<code>enum</code> 只能带「标签」，不能带数据；<code>sealed</code> 的每个子类可以带自己的数据。',
              '<code>ProductReady</code> 带 <code>List&lt;Product&gt;</code>，<code>ProductFailed</code> 带错误原因 —— 各自需要什么就带什么。',
              '保留了「穷举检查」：以后新增一种状态，所有没处理的 <code>switch</code> 会一起报错。',
              '<b>编译器帮你列出了所有要改的地方</b> —— 这就是它最大的价值。',
            ],
          },
        ],
      },

      {
        id: 'd-pattern',
        title: '1.3 模式匹配：switch 表达式、when 守卫、:final 解构',
        level: '进阶',
        summary: '上一节的 sealed 之所以好用，一半功劳在模式匹配 —— 它是「一边判断一边取值」的写法。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/scratch/patterns.dart',
            code: `// ① switch 表达式：整个 switch 是一个值，可以赋值/返回
String describe(int score) => switch (score) {
      >= 90 => '优秀',
      >= 60 => '及格',
      _ => '不及格',              // _ 是「其他所有情况」
    };

// ② when 守卫：匹配之后再补一个条件
String classify(Object o) => switch (o) {
      int n when n < 0 => '负整数',
      int n => '非整数：\$n'.replaceAll('非整数', '非负整数'),
      String s when s.isEmpty => '空字符串',
      String s => '字符串：\$s',
      _ => '其他类型',
    };

// ③ 解构：直接把对象里的字段取出来当变量
class Point {
  final int x, y;
  const Point(this.x, this.y);
}

void deconstruct(Point p) {
  switch (p) {
    case Point(x: 0, y: 0):
      print('原点');
    case Point(x: 0, y: final y):
      print('在 y 轴上，y = \$y');       // final y 直接绑定字段值
    case Point(:final x, :final y):     // 简写：绑定同名字段
      print('(\$x, \$y)');
  }
}

// ④ 列表 / Map 也能解构
void main() {
  final [first, second, ...rest] = [1, 2, 3, 4];
  print('\$first \$second \$rest');      // 1 2 [3, 4]

  final {'name': String n, 'age': int a} = {'name': '小明', 'age': 18};
  print('\$n \$a');                     // 小明 18
}`,
          },
          {
            kind: 'compare',
            bad: {
              title: '❌ 老写法：判断 + 强转 + 取值，三步',
              code: `if (state is ProductReady) {
  // 还要记住加 ! 或强转
  final items = (state as ProductReady).items;
  return ProductList(items);
} else if (state is ProductFailed) {
  return ErrorView((state as ProductFailed).message);
}
// 没有「穷举检查」——
// 以后新增状态，这里不会报错，
// 页面就静默显示成空白`,
            },
            good: {
              title: '✅ 模式匹配：判断和取值一次完成',
              code: `return switch (state) {
  ProductLoading() => const CircularProgressIndicator(),
  ProductReady(:final items) => ProductList(items),
  ProductFailed(:final message) => ErrorView(message),
};
// 类型自动收窄，不用强转；
// 新增状态时这里会编译报错`,
            },
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b><code>:final x</code> 是「绑定同名字段」的简写。</b>完整的写法是 <code>ProductReady(items: final items)</code>，因为字段名和变量名一样，可以缩成 <code>ProductReady(:final items)</code>。这个简写在 Flutter 的 state 处理里出现频率极高。',
          },
        ],
      },

      {
        id: 'd-copywith',
        title: '1.4 copyWith：谁生成的、为什么必须有它',
        level: '进阶',
        summary: '状态管理里的「改一个字段」，标准做法不是修改原对象，而是造一个只改了那个字段的新对象。',
        blocks: [
          {
            kind: 'p',
            html: '原因很简单：Flutter 判断「要不要重绘」靠的是<b>对象是不是同一个</b>。<code>setState</code> 里如果改的是原对象的字段，引用没变，框架可能认为什么都没发生。所以不可变数据 + <code>copyWith</code> 是 Flutter 状态管理的基本功。',
          },
          {
            kind: 'code',
            filename: 'lib/features/cart/cart_item.dart',
            code: `class CartItem {
  final String id;
  final String name;
  final int qty;
  final bool selected;

  const CartItem({
    required this.id,
    required this.name,
    this.qty = 1,
    this.selected = true,
  });

  // copyWith 的标准写法：每个参数都可空，不传就用原值
  CartItem copyWith({
    String? id,
    String? name,
    int? qty,
    bool? selected,
  }) {
    return CartItem(
      id: id ?? this.id,
      name: name ?? this.name,
      qty: qty ?? this.qty,
      selected: selected ?? this.selected,
    );
  }
}`,
          },
          {
            kind: 'p',
            html: '<b>光有 <code>copyWith</code> 还不够 —— 还得有 <code>==</code> 和 <code>hashCode</code>，否则框架比不出「内容变了」。</b>这是新手最容易漏的一环。',
          },
          {
            kind: 'code',
            filename: 'lib/features/cart/cart_item.dart（续）',
            code: `  // 值相等：内容一样就算「同一个」，这是 Flutter 重建优化的前提
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CartItem &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          qty == other.qty &&
          selected == other.selected;

  @override
  int get hashCode => Object.hash(id, name, qty, selected);
}`,
          },
          {
            kind: 'table',
            head: ['方案', '怎么写', '什么时候选它'],
            rows: [
              ['手写', '自己写 copyWith / == / hashCode', '字段 ≤ 5 个，想看清楚每个字段怎么处理'],
              ['<code>freezed</code>', '<code>@freezed</code> + <code>build_runner</code> 生成', '字段多、还要 fromJson / toJson / 联合类型'],
              ['<code>equatable</code>', '继承 <code>Equatable</code>，只写 <code>props</code>', '只要 == / hashCode，不需要 copyWith 代码生成'],
            ],
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>坑：<code>copyWith</code> 没法把字段设回 null。</b>因为「不传」和「传 null」在 <code>??</code> 里是同一个意思。如果你确实需要把某个可空字段清空，得额外加一个哨兵值方案（<code>Object? id = _sentinel</code>），或者干脆写一个 <code>.clearXxx()</code> 方法。',
          },
        ],
      },

      {
        id: 'd-misc',
        title: '1.5 extension：给别人的类加方法',
        level: '进阶',
        summary: '不用改源码、不用继承，就能给任何类「外挂」方法。Flutter 里最常用的是给 BuildContext 加糖。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/core/ext/context_ext.dart',
            code: `extension BuildContextX on BuildContext {
  ThemeData get theme => Theme.of(this);
  ColorScheme get colors => Theme.of(this).colorScheme;
  TextTheme get texts => Theme.of(this).textTheme;
  double get w => MediaQuery.sizeOf(this).width;
  double get h => MediaQuery.sizeOf(this).height;
  bool get isDark => Theme.of(this).brightness == Brightness.dark;

  // 常用：拿一个「屏幕宽度百分比」
  double wp(double percent) => w * percent / 100;
}

// 用起来 —— 比 Theme.of(context).colorScheme.primary 短得多，且不会拿错
// context.colors.primary
// context.isDark ? ... : ...`,
          },
          {
            kind: 'list',
            items: [
              '<b>只能加方法/属性，不能加字段。</b>extension 没有自己的存储空间。',
              '<b>同一个类型可以有多个 extension</b>，但同名方法会冲突，编译器会要求你显式指定。',
              '<b>适合给「第三方库的类型」加便利方法</b>：<code>DateTime</code>、<code>String</code>、<code>BuildContext</code> 都是常见对象。',
              '<b>不要滥用</b>：如果你在给项目自己的类加方法，改那个类通常更直接。',
            ],
          },
          {
            kind: 'code',
            filename: 'lib/core/ext/date_ext.dart',
            code: `extension DateTimeX on DateTime {
  /// 转成「2026-03-05」这种可读格式
  String get ymd =>
      '\$year-\${month.toString().padLeft(2, '0')}-\${day.toString().padLeft(2, '0')}';

  /// 相对时间：刚刚 / 5 分钟前 / 3 天前
  String get relative {
    final diff = DateTime.now().difference(this);
    if (diff.inMinutes < 1) return '刚刚';
    if (diff.inHours < 1) return '\${diff.inMinutes} 分钟前';
    if (diff.inDays < 1) return '\${diff.inHours} 小时前';
    if (diff.inDays < 30) return '\${diff.inDays} 天前';
    return ymd;
  }
}

// DateTime.now().relative  →  '刚刚'`,
          },
        ],
      },

      {
        id: 'd-mixin',
        title: '1.6 mixin：横向复用行为，而不是靠继承',
        level: '进阶',
        summary: '当两个不相干的类都需要「同一段行为」时，继承是错的（它们没有 is-a 关系），mixin 才是答案。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/scratch/mixins.dart',
            code: `mixin LoggerMixin {
  // 只能定义在 class 上，没有构造函数
  void log(String msg) => print('[\${runtimeType}] \$msg');
}

mixin RetryMixin {
  int get maxRetry => 3;

  Future<T> retry<T>(Future<T> Function() task) async {
    for (var i = 1; i <= maxRetry; i++) {
      try {
        return await task();
      } catch (e) {
        if (i == maxRetry) rethrow;         // 最后一次还失败就抛出去
      }
    }
    throw StateError('unreachable');
  }
}

// 两个不相干的类，都能「戴上」这两个能力
class ApiClient with LoggerMixin, RetryMixin {
  Future<String> fetch() => retry(() async {
        log('开始请求');                     // LoggerMixin 给的
        return 'data';
      });
}

class CacheStore with LoggerMixin {
  void put(String k, String v) => log('写入 \$k');   // 也能用
}`,
          },
          {
            kind: 'table',
            head: ['写法', '关系', '什么时候用'],
            rows: [
              ['<code>extends</code>', 'is-a（是某种东西）', '子类确实是父类的一种'],
              ['<code>with</code>', 'has-a（具备某种能力）', '两个不相干的类要复用同一段行为'],
              ['<code>implements</code>', 'can-do（遵守某种契约）', '只想要「接口约束」，不要实现'],
            ],
          },
          {
            kind: 'note',
            tone: 'info',
            html:
              '<b><code>on</code> 关键字：限制 mixin 只能贴在某些类上。</b><code>mixin Foo on Bar {}</code> 表示「只有 Bar 的子类才能 with Foo」。这样你在 mixin 里就可以安全地调用 Bar 的方法。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/mixin_on.dart',
            code: `abstract class Store {
  Map<String, dynamic> toJson();
}

// 只有能 toJson 的类才能用这个 mixin
mixin PersistMixin on Store {
  void save() {
    final json = toJson();      // ✅ 因为 on Store，这里能安全调用
    print('保存: \$json');
  }
}

class UserStore extends Store with PersistMixin {
  @override
  Map<String, dynamic> toJson() => {'name': 'x'};
}

// class Other with PersistMixin {}  // ❌ 编译错误：Other 不是 Store`,
          },
        ],
      },

      {
        id: 'd-stream',
        title: '1.7 async* / Stream：一次返回多个值',
        level: '进阶',
        summary: '普通 async 只给一个结果；需要「持续吐值」时用 Stream。这是实时数据、事件流的基础。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/scratch/streams.dart',
            code: `// async* + yield：把「多次返回」写成看起来像同步的代码
Stream<int> countdown(int from) async* {
  for (var i = from; i > 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;                     // 每 yield 一次，订阅者就收到一个值
  }
}

void main() async {
  // 消费方式一：await for —— 像读列表一样读流
  await for (final n in countdown(3)) {
    print(n);                    // 3 / 2 / 1
  }

  // 消费方式二：listen —— 更细粒度，能控订阅
  final sub = countdown(3).listen(
    (n) => print(n),
    onError: (e) => print('出错了 \$e'),
    onDone: () => print('结束'),
  );
  await Future.delayed(const Duration(seconds: 5));
  await sub.cancel();            // 记得取消，否则可能内存泄漏
}`,
          },
          {
            kind: 'p',
            html: '<b>Flutter 里最常接触的 Stream 场景：文本框输入、按钮连点、WebSocket 推送。</b>Stream 还能像集合一样做转换，这些操作符非常有用。',
          },
          {
            kind: 'code',
            filename: 'lib/scratch/stream_ops.dart',
            code: `// 场景：搜索框防抖 + 去重 + 只取最新一次结果
Stream<String> search(Stream<String> input) => input
    .debounceTime(const Duration(milliseconds: 300))   // 停止输入 300ms 才继续
    .distinct()                                        // 内容没变就别重复请求
    .switchMap((kw) => http.get('/search?q=\$kw'));     // 新请求来了就取消旧的

// 说明：debounceTime / switchMap 来自 rxdart 包，
// 原生 Stream 只有 map / where / take 等基础操作符。`,
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>Stream 一定要记得取消订阅。</b>在 <code>State</code> 里通常会转成 <code>StreamSubscription</code> 字段，然后在 <code>dispose</code> 里 <code>cancel()</code>。忘了取消，页面关了流还在跑 —— 这是 Flutter 里典型的内存泄漏来源。',
          },
        ],
      },

      {
        id: 'd-required',
        title: '1.8 required 与命名参数：把「忘记传」变成编译错误',
        level: '进阶',
        summary: '这一节把 0.4 的思路落到真实组件上 —— 参数设计得好，用的人不可能用错。',
        blocks: [
          {
            kind: 'code',
            filename: 'lib/widgets/product_card.dart',
            code: `class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;
  final bool showPrice;

  const ProductCard({
    super.key,
    required this.product,       // 必须传，忘传就编译报错
    required this.onTap,
    this.showPrice = true,       // 有默认值，可选
  });

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}`,
          },
          {
            kind: 'keypoints',
            title: '参数设计的五条经验',
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
              code: `PriceTag(
  price: 18.5,
  showCurrency: true,
  showDiscount: false,
  big: true,
)
// 用的人得记住这三个 bool 是啥效果，
// 加第四个时组合就变 16 种`,
            },
            good: {
              title: '✅ 用枚举把常见组合固化',
              code: `enum PriceTagSize { normal, large }

PriceTag(
  price: 18.5,
  originalPrice: 25,          // 传了才显示划线价
  size: PriceTagSize.large,
)
// 一个枚举说清「大/小」，
// 折扣是「有没有原价」推导出来的`,
            },
          },
        ],
      },

      {
        id: 'd-sugar',
        title: '1.9 四个天天用的语法糖',
        level: '进阶',
        summary: '?.、??、??=、... 这四个符号在 Flutter 代码里出现频率极高，必须一眼看懂。',
        blocks: [
          {
            kind: 'table',
            head: ['写法', '含义', '例子'],
            rows: [
              ['<code>?.</code>', '左边为 null 就短路，返回 null', '<code>user?.name</code>'],
              ['<code>??</code>', '左边为 null 就取右边', "<code>name ?? '匿名'</code>"],
              ['<code>??=</code>', '左边为 null 才赋值', "<code>cache['k'] ??= 1</code>"],
              ['<code>...</code>', '把集合「展开」进来', '<code>[...a, ...b]</code>'],
              ['<code>...?</code>', '展开一个可能为 null 的集合', '<code>[...?maybeList]</code>'],
              ['<code>&#36;{}</code>', '字符串插值', "<code>'共 &#36;{items.length} 件'</code>"],
              ['<code>..</code>', '级联：返回对象本身', '<code>list..add(1)..add(2)</code>'],
            ],
          },
          {
            kind: 'code',
            filename: 'lib/scratch/sugar.dart',
            code: `void main() {
  // ?. 与 ?? 组合：安全地取嵌套值 + 兜底
  final city = user?.address?.city ?? '未知城市';

  // ??= 常用于「缓存没有才去算」
  final cache = <String, int>{};
  cache['count'] ??= 100;      // 第一次赋值
  cache['count'] ??= 200;      // 已有值，不覆盖 → 仍是 100
  print(cache['count']);

  // ... 在 Widget 里极其常见：条件性地插入子元素
  final widgets = <String>[
    '固定项',
    if (true) '条件项',        // 集合里的 if
    for (var i = 0; i < 2; i++) '循环项\$i',
    ...['展开', '进来的'],
  ];
  print(widgets);

  // .. 级联：省掉重复写变量名
  final buf = StringBuffer()
    ..write('Hello')
    ..write(' ')
    ..write('World');
  print(buf.toString());       // Hello World
}`,
          },
          {
            kind: 'note',
            tone: 'warn',
            html:
              '<b>别把 <code>?.</code> 和 <code>!</code> 混着用出一堆噪音。</b>像 <code>a!.b?.c!?.d</code> 这种代码，说明类型设计有问题。正确做法是先把 null 收在边界（见 0.3），进到业务逻辑里就不该再有问号。',
          },
          {
            kind: 'code',
            lang: 'dart',
            code: `// 在 Flutter 的 children 里，这两种写法等价，但左边清爽得多
// ❌ 用三目 + 占位
children: [
  const Icon(Icons.info),
  showHint ? const Text('提示') : const SizedBox.shrink(),
]

// ✅ 用集合 if（不会有占位 Widget）
children: [
  const Icon(Icons.info),
  if (showHint) const Text('提示'),
]`,
          },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════ */
  {
    id: 'ch2',
    no: '第 2 章',
    title: '速查与练习',
    lead: '忘了就来这一页扫一眼。左边是「你想干什么」，右边是「该写什么」。',
    sections: [
      {
        id: 'd-cheatsheet',
        title: '2.1 速查表',
        level: '基础',
        summary: '按「我想…」组织，直接找你要做的事。',
        blocks: [
          {
            kind: 'table',
            head: ['我想…', '写什么'],
            rows: [
              ['定义一个不会变的编译期常量', '<code>const kXxx = ...;</code>'],
              ['定义一个只赋一次、运行时才知道的值', '<code>final x = ...;</code>（字段）'],
              ['定义一个可能为空的变量', '<code>String? x;</code>'],
              ['安全地取可能为空的属性', '<code>x?.name</code>'],
              ['给可能为空的值一个默认值', "<code>x ?? '默认'</code>"],
              ['让参数必填', '<code>required this.title</code>'],
              ['给别人的类加方法', '<code>extension X on Y { ... }</code>'],
              ['复用一段与继承无关的行为', '<code>mixin M { ... }</code>'],
              ['表达「只有这几种情况」的数据', '<code>sealed class</code> + 子类'],
              ['穷举所有情况（漏了会报错）', '<code>switch</code> 表达式 + <code>sealed</code>'],
              ['改一个字段但不动原对象', '<code>obj.copyWith(x: 1)</code>'],
              ['让两个「内容相同」的对象相等', '重写 <code>==</code> 与 <code>hashCode</code>'],
              ['一次返回多个值', '<code>Stream</code> + <code>async*</code> / <code>yield</code>'],
              ['把一组常量归拢成一处', '<code>abstract final class</code>'],
              ['并发等多个请求', '<code>await Future.wait([...])</code>'],
              ['把集合拼起来', '<code>[...a, ...b]</code>'],
              ['在 children 里做条件渲染', '<code>if (cond) Widget()</code>'],
              ['格式化小数位', '<code>d.toStringAsFixed(2)</code>'],
              ['列表转 Map（按某字段索引）', '<code>list.asMap()</code> / <code>{for (var x in l) x.id: x}</code>'],
              ['安全地解析可能失败的数字', '<code>int.tryParse(s)</code>'],
            ],
          },
          {
            kind: 'term',
            items: [
              { term: 'final vs const', desc: '<code>const</code> 编译期已知；<code>final</code> 运行时一次。不确定就 <code>final</code>。' },
              { term: 'var vs 具体类型', desc: '局部变量用 <code>var</code>；公开 API（函数签名、字段）写明类型。' },
              { term: 'late 的代价', desc: '能立即赋值就别用 <code>late</code>；漏赋值会抛 <code>LateInitializationError</code>。' },
              { term: 'sealed 的边界', desc: '子类必须同文件。跨文件就需要 <code>part</code>，这通常是「该拆成两个概念」的信号。' },
            ],
          },
        ],
      },
      {
        id: 'd-practice',
        title: '2.2 接下来练什么',
        level: '实战',
        summary: '读完不动手，两周就忘光。这四件事花不了多少时间，但能让语法真正变成你的。',
        blocks: [
          {
            kind: 'keypoints',
            title: '四个具体练习',
            items: [
              '把上面每个代码块贴进 <a href="https://dartpad.dev" target="_blank" rel="noreferrer" class="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2">dartpad.dev</a> 跑一遍 —— 亲眼看到编译错误长什么样，比读十遍说明管用。',
              '打开你正在做的 Flutter 项目，搜索 <code>dynamic</code>，看看有没有可以换成具体类型的地方。',
              '搜索项目里的 <code>!</code>，每一个都问问自己「这里为什么可能有 null」，能去掉是最好的重构。',
              '如果你在写状态管理，检查每个状态类有没有 <code>copyWith</code> 和 <code>==</code>；如果有 <code>sealed</code> 能覆盖的场景，试着改过去，感受编译器帮你兜底的体验。',
            ],
          },
          {
            kind: 'note',
            tone: 'ok',
            html:
              '<b>回头看一遍第 1 章的那句话：</b>这些语言特性不是炫技。每一个都在替你做一件机器能做的检查 —— <code>sealed</code> 让编译器替你找漏掉的分支，<code>final</code> 让编译器拦住手滑的二次赋值，<code>copyWith</code> 让状态更新变成「造一个新对象」而不是「到处改字段」。<b>你少写一行检查，就少一个能在凌晨三点炸的 bug。</b>',
          },
          {
            kind: 'p',
            html: '语法这部分通了，下一步就是 Flutter 本身 —— 界面是怎么被「搭」出来的、组件为什么这么封装。这正是下一站要讲的。',
          },
        ],
      },
    ],
  },
];
