# 组件示例「代码 ↔ 图形」一致性审计

审计对象：`material-docs` 站内 67 个组件、134 个示例
审计方式：直接解析数据源（`src/data/components/*.ts`）与图形注册表（`src/components/demo-mocks.tsx`），
逐条把每个示例的代码与它对应的 JSX 图形做语义比对。
产出：`_work/demo-mock-pairs.txt`（完整配对报告，可直接翻查原文）

---

## 0. 先说一个必须先讲的事：示例总数是 134，不是 135

站内 4 处文案写着「135 个示例」，实际是 **134**。原因是一个校验盲点：

校验脚本用正则 `/title: '([^']*)'/` 在 `demos:` 之后的片段里找示例标题，但**没有先把
TS 模板字符串（也就是示例的 `code:` 反引号块）遮蔽掉**。而 `theme` 组件的第一个示例，
Dart 代码里恰好有这样一行：

```dart
return MaterialApp(
  title: 'PulseShop',      // ← 被正则当成了「第 4 个示例的标题」
```

于是连锁反应：

| 现象 | 说明 |
|---|---|
| 凭空多出一个示例《PulseShop》 | 数据里根本没有这个示例 |
| 真示例的代码被截成空串 | 表现为「示例图有图无代码」，是**假**报 |
| `theme::PulseShop` 孤儿注册键被藏住 | 注册表里 135 个键，数据里 134 个示例，差的那一个正好对上了这个影子 |
| `mock-status.cjs` 报 135/135 全绿 | **假通过**，校验形同虚设 |

**已修复**（两个脚本都改）：

- `_work/pair-demo-mock.cjs` —— 先扫反引号跨度把模板串整段换成 `\u0000`，在掩码串上找
  `title:`（下标与原串一致），`code` 按跨度用原串切片取回。
- `_work/mock-status.cjs` —— 同一处盲点，同样修法。修后正确以 **exit 1** 抓出孤儿键：
  ```
  真实示例：134 个，分布在 67 个组件
  已注册示例专属图形：135 个
  覆盖率：134/134（100.0%）
  ❌ 有 1 个注册键对不上真实标题（标题写错了）：
     theme::PulseShop
  ```
- 新增 `_work/literal-diff.cjs` —— 把「代码里的中文串」与「图形里的中文串」做集合差，
  作为兜底线索（精度有限，多数命中是图形有意使用抽象标签，不能当结论用）。
- `_work/audit-demo-code.cjs` 已在文件头标注**废弃**（抓渲染 HTML 手工切片会串台、产假阳性）。

---

## 1. 真·内容对不上（代码说 A，图画 B）

| 严重度 | 示例 | 代码 | 图形 |
|---|---|---|---|
| 高 | `scaffold::标准页面模板（照抄就能用）` | AppBar「商品详情」+ 分享按钮；body；底部 bottomNavigationBar = 加入购物车 / 立即购买。**没有 FAB，没有底部 Tab** | appBar/body 占位块 + 一个悬浮「＋」按钮 + 首页/分类/我的 底部导航 —— **凭空多出 FAB 和 TabBar** |
| 高 | `data-table::可排序的销售明细表` | `_sortIndex = 2`（销售额）、`_ascending = false` → 箭头应在「销售额」且向下 | 高亮箭头在「产品」，销售额的箭头是灰的 —— 与代码状态直接矛盾 |
| 高 | `radio::一组单选（用 RadioListTile，整行可点）` | 微信支付 / 支付宝 / 银行卡（三个 RadioListTile + secondary 图标） | 标准配送（3-5 天）/ 次日达（+¥12）—— 换了整套业务 |
| 高 | `radio::选项少的时候用 Chip 更省空间` | `['S','M','L','XL']` 的 ChoiceChip | 一个月 / 三个月 / 一年 |
| 高 | `alert-dialog::对话框里带输入框` | 标题「新建文件夹」、hint「请输入名称」、按钮 取消 / **创建** | 标题「添加备注」、placeholder「请输入备注内容…」、按钮 取消 / **确定** |
| 高 | `chip::四个变体对照` | 用的是 **Chip / FilterChip / ChoiceChip / ActionChip**（Flutter 真实类名） | 标的是 MD3 的 **assist / filter / input / suggestion** —— 两套分类法，且与示例 note（"静态展示用 Chip、能多选用 FilterChip…"）自相矛盾 |
| 高 | `scaffold::SnackBar 为什么有时"看不见"` | 讲的是：A 页面 push 到 B 后立刻 showSnackBar 会被盖住 → 改成 await 返回值再提示 | 讲的是：**嵌套 Scaffold** 被外层遮住 → 用根 Scaffold 的 context。两个不同的坑 |
| 中高 | `checkbox::带文字的复选框：用 CheckboxListTile` | `我已阅读并同意《用户协议》` + 未勾选时禁用的「注册」按钮 | 包邮 / 七天无理由 两个勾选项 +「整行可点」 |
| 中 | `snack-bar::带「撤销」的操作` | `Text('已删除')` + `SnackBarAction(label: '撤销')` | `SnackBarI` 里文案是「已加入购物车」 |
| 中 | `snack-bar::成功 / 失败用不同颜色` | `showToast(context, '保存成功')`；纯文字无图标 | 「提交成功」；多了 ✓ / ✗ 图标 |
| 中 | `alert-dialog::确认对话框（标准写法）` | 正文「删除后无法恢复，**该记录的所有附件也会一并删除**。」 | 正文「删除后无法恢复，**确定要继续吗？**」 |
| 中 | `alert-dialog::用 SafeArea 包一下` | 标题「很长的一段说明」，讲横屏溢出 + SingleChildScrollView | 画的是「删除这条记录？/ 删除后无法恢复。」 |
| 中 | `chip::状态标签（订单状态这类）` | 状态集：已完成 / 进行中 / 已取消（+ 兜底） | 待付款 / 已发货 / 已完成 / 已取消 —— 多了两个，少了「进行中」 |
| 中 | `filter-chip::多条件筛选（带「重置」）` | 选项含「7天退换」；提示「已选：包邮 · 现货」（列名字） | 「七天无理由」；提示「已选 2 项」 |
| 中 | `segmented-button::视图切换（列表 / 网格）` | `selected = 'list'`（列表选中）；列表 `Icons.view_list`、网格 `Icons.grid_view` | 高亮的是「网格」，图标还被调换（列表用 menu、网格用 inbox）；底部写 `selected: {1}` |
| 中 | `segmented-button::时间范围（多选）` | 周一 / 周三 / 周五 | 日 / 周 / 月；底部 `selected: {0, 2}` |
| 中 | `circular-progress-indicator::两种模式` | `value: 0.65`（65%）、`strokeWidth: 6` | 写 70%、strokeWidth 4 |
| 中 | `list-view::带分隔线与自定义内边距` | `Divider(height: 1, indent: 72)` | 用的是 `ml-3`（12px） |
| 中 | `stepper::下单流程 + 中文按钮 + 分步校验` | 三步：收货信息 / 配送方式 / 确认支付；按钮「**提交订单**」/ 下一步 + 上一步 | 收货人 / 支付 / 完成；只有 上一步 / 下一步，缺「提交订单」这个关键差异 |
| 中低 | `checkbox::全选 / 半选` | 手机 / 电脑 / 平板 / 耳机（4 项，「已选 x/4」） | Apple / Xiaomi / Huawei（3 项，「已选 2/3」，且是写死的） |

---

## 2. 图形只画了代码的一部分（不是错，但容易让人以为示例就这些）

| 示例 | 代码里有 | 图形里少了 |
|---|---|---|
| `indexed-stack::底部导航 + 状态保持` | 4 个 tab：首页 / 分类 / 购物车 / 我的 | 只画了 2 个（首页 / 购物车） |
| `flexible::Expanded 与 Flexible 的实际差别` | 3 种情形，含 `Expanded(flex: 2)` 按比例分配 | 少了比例分配那一例 |
| `align::Alignment 的坐标系与常见用法` | 3 个实际用法（横幅左下角 / `Alignment(0, 0.4)` / 空状态） | 只有九宫格坐标示意图 |
| `spacer::Row 两端对齐 / Column 底部顶住` | 3 个情形 | 少了「三元素只让后两个靠右」；标签也从「收货地址 / 修改」抽象成了「标题 / 更多」 |
| `positioned::回到顶部按钮` | 滚动 > 400 才出现、隐藏时 `IgnorePointer` 不吞点击 | 没体现显隐逻辑 |

---

## 3. 工程层面的硬缺陷

1. **`theme::PulseShop` 孤儿注册键** —— 注册表里有这个图形，数据里没有任何叫「PulseShop」的示例。
   这是死代码，也是它把校验脚本骗过去的元凶。
2. **站内 4 处文案写「135 个示例」**，实际 134：
   - `src/app/layout.tsx`（openGraph description + description，2 处）
   - `src/app/page.tsx`「67 个组件 · 135 个示例」
   - `src/app/resources/page.tsx`「67 个组件 / 135 个示例」

---

## 4. 主题化漏网的 Element Plus 硬编码色

这些颜色绕过了 CSS 变量，**暗色模式下不会跟着变**，且与站点新配色（青蓝 → 紫）不一致。

| 位置 | 内容 |
|---|---|
| `src/app/layout.tsx:36` | `themeColor: '#409eff'` —— 浏览器 UI 主题色还是旧蓝 |
| `demo-mocks.tsx:2153 / 2159` | 进度环 `stroke="#dbeafe"` / `stroke="#409eff"` |
| `demo-mocks.tsx:2641` | theme 示例色卡 `#409eff / #337ecc / #dbeafe` |
| `demo-mocks.tsx:1678 / 2186 / 2338`、`mocks.tsx:161 / 181` | 对勾图标 `stroke="#3d7a4a"` |
| `mocks.tsx:752 / 755` | `theme` 的组件级默认 mock 用 `#409eff / #67c23a / #e6a23c / #f56c6c` 整套 Element 色板 |
| `other.ts:203 / 216`、`extra.ts:828 / 834`、`tutorials/dart.ts:649`、`tutorials/flutter.ts:1423` | Dart 示例里的 `Color(0xFF409EFF)`。其中 `other.ts:171` 是「❌ 反面教材」属于有意为之；但 203/216 是当**种子色正面示例**在用的，和站点主色已经不是同一个颜色了 |

---

## 5. 排除掉的误报（上一轮曾以为有问题，核对后确认没事）

- `app-bar` 的 3 个注册键与数据标题**完全一致**（之前是我解析脚本的问题）。
- `demo-mocks.tsx` 里已无 `text-ink-300` 当文字色用的地方（上一轮已清干净）。
- `theme` 两个示例的 `code` **不是空的** —— 纯属上面那个解析 bug 导致的假象。

---

## 6. 修复量估计

- 第 1 类（内容对不上）：20 处，主要是改 `demo-mocks.tsx` 里的 JSX 文案与状态；
  `chip::四个变体对照` 需要重画（分类法要换回 Flutter 真实类名）；
  `scaffold::标准页面模板` 需要删掉图里凭空多出的 FAB 和 TabBar。
- 第 2 类（覆盖不全）：5 处，补画缺失的分支。
- 第 3 类（工程缺陷）：删 1 个孤儿键 + 改 4 处文案 →「135」改「134」。
- 第 4 类（残留色）：约 12 处，全部改成主题变量（`text-brand-*` / `bg-solid` / `currentColor`）。

改完需重跑：`mock-status.cjs`（现在会真的报错了）、`pair-demo-mock.cjs`、
`verify-demo-diff.cjs`、`smoke-test.cjs`、`check-anchors.cjs`，最后 `next build`。
