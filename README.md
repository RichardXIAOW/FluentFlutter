# FluentFlutter · Flutter 从入门到工程化

一个 Element Plus 风格的 Flutter 中文学习站，按依赖关系排成五步学习路线：

1. **Dart 语言讲解** —— 类型、空安全、函数、类、集合、异步，再到 sealed / 模式匹配 / copyWith / mixin 等工程化必备语法
2. **Flutter 讲解** —— Widget 树、build 与 BuildContext、组件封装与参数设计、布局约束、状态与生命周期、性能优化
3. **Material 组件手册** —— 67 个高频组件、135 个可交互图形示例、属性表与避坑说明
4. **工程化搭建指南** —— 14 阶段 39 步，从 `flutter create` 到发布签名
5. **实战教程** —— 完整项目实战（整理中）

> 域名约定：`xx.wlp.de5.net` 中的 `xx` 取 **`fluent`**，
> 即 https://fluent.wlp.de5.net
> （"Fluent" 既是「流利的」，也呼应 Flutter 的 "flut-"；拼写短、好记、不易打错）

技术栈：Next.js 14 (App Router) + TypeScript + Tailwind CSS。零配置部署到 Vercel。

---

## 快速开始

```bash
npm install
npm run dev        # http://localhost:3000
```

其他命令：

```bash
npm run build      # 生产构建
npm run start      # 本地跑生产构建
npm run typecheck  # 只做类型检查，不产出文件
```

---

## 目录结构

```
material-docs/
├─ public/
│  └─ handbook/
│     └─ index.html          # 工程化搭建指南（独立 HTML，iframe 承载）
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # 根布局：Header + Footer
│  │  ├─ globals.css         # 设计令牌 + 代码高亮配色
│  │  ├─ page.tsx            # 首页
│  │  ├─ components/
│  │  │  ├─ page.tsx         # 组件总览（按分类分组）
│  │  │  └─ [slug]/page.tsx  # 组件详情（SSG）
│  │  ├─ resources/
│  │  │  ├─ page.tsx         # 五步学习路线（资源总入口）
│  │  │  ├─ dart/page.tsx    # Dart 语言讲解
│  │  │  └─ flutter/page.tsx # Flutter 讲解
│  │  ├─ handbook/page.tsx   # 工程化指南外壳
│  │  ├─ guide/page.tsx      # 指南（怎么用这个站）
│  │  └─ not-found.tsx       # 404
│  ├─ components/            # 站点 UI 组件
│  │  ├─ Header.tsx          # 顶栏 + 移动端抽屉
│  │  ├─ Sidebar.tsx         # 左侧导航（可折叠 + 滚动定位）
│  │  ├─ TocRail.tsx         # 右侧「本页目录」（Element Plus 同款）
│  │  ├─ TutorialShell.tsx   # 教程页外壳（Dart / Flutter 两页共用）
│  │  ├─ SearchBox.tsx       # 全局搜索（⌘K）
│  │  ├─ CodeBlock.tsx       # 代码块（复制 / 换行 / 行号）
│  │  ├─ PropTable.tsx       # 属性表（移动端卡片式）
│  │  ├─ DemoPreview.tsx     # 示例卡片（效果 + 右下角代码开关）
│  │  ├─ FlutterPreview.tsx  # Flutter Web / 静态图预览
│  │  ├─ DemoShowcase.tsx    # 首页「代码 ↔ 渲染」对照
│  │  ├─ MockBox.tsx         # mock 的客户端中转外壳（见下）
│  │  ├─ mock-kit.tsx        # 图形 mock 的共用零件
│  │  ├─ mocks.tsx           # 67 个组件的默认外观
│  │  ├─ demo-mocks.tsx      # 135 个「示例专属」外观（key = slug::示例标题）
│  │  └─ HandbookShell.tsx   # 指南的 iframe 外壳
│  ├─ data/
│  │  ├─ types.ts            # 组件数据类型定义
│  │  ├─ categories.ts       # 8 个分类
│  │  ├─ index.ts            # 注册表 + 搜索 + 数据校验
│  │  ├─ components/         # 组件数据（按分类拆文件）
│  │  └─ tutorials/          # 教程内容（dart.ts / flutter.ts / types.ts）
│  └─ lib/
│     └─ highlight.ts        # 自研 Dart/YAML 语法高亮
└─ _work/                    # 开发脚本，不参与构建
```

---

## 怎么加一个新组件

**只需改两个地方，不需要动任何 UI 代码。**

### 1. 写数据

在 `src/data/components/` 里对应分类的文件末尾追加一项：

```ts
{
  slug: 'my-widget',              // URL 段 → /components/my-widget
  name: 'MyWidget',               // 类名
  title: '一句话定位',
  summary: '列表卡片上的一句话摘要',
  category: 'general',            // 必须与 categories.ts 里的 id 一致
  import: 'package:flutter/material.dart',
  tags: ['关键词', '用于搜索'],
  highlights: ['关键特性 1', '关键特性 2'],
  whenToUse: {
    do: ['什么场景该用'],
    dont: ['什么场景别用'],        // 建议一定要写，这是本站最有价值的部分
  },
  props: [
    { name: 'foo', type: 'String?', def: "'bar'", desc: '这个参数干什么' },
  ],
  demos: [
    {
      title: '示例标题',
      note: '这个示例想让你看到什么',
      code: `MyWidget(foo: 'bar')`,
      preview: 'none',            // 'live' | 'image' | 'none'
    },
  ],
  related: ['row', 'column'],     // ⚠️ 必须是已存在的 slug
}
```

### 2. 校验

```bash
node _work/audit-data.cjs
```

这个脚本会检查：重复 slug、`related` 指向不存在的组件、各分类数量。
**`related` 写错不会报构建错误**，只会在页面上表现为一个点不动的链接 ——
所以每次加完数据都跑一下。

---

## 关于预览

每个组件的「效果」按优先级自动降级：

1. **Flutter Web 实时预览** —— 有 `previewUrl` 时，点「运行预览」才加载 iframe（运行时 2MB+，不能自动加载）
2. **静态截图** —— 有 `previewImage` / `demo.imageUrl` 时显示
3. **示例专属图形** —— `src/components/demo-mocks.tsx` 里按 `slug::示例标题` 注册的 HTML/CSS 复刻
4. **组件默认图形** —— `src/components/mocks.tsx` 里该组件的典型外观
5. **代码** —— 什么资源都没有时直接展示代码

**为什么 mock 分两层**：同一个组件下的几个示例如果都渲染成同一张图，示例就失去了
「展示写法差异」的意义。所以 `demo-mocks.tsx` 为**每个示例**单独画图
（比如 `elevated-button::改高度和圆角` 画三行对比、`row::避免溢出` 画 ❌/✅ 对照），
`mocks.tsx` 只负责「没有专属图时」的兜底。

**为什么 `live` 不自动加载**：Flutter Web 运行时（含 canvaskit）在 2MB 以上。
一页放 8 个示例就是十几 MB，首屏会崩。所以采用「点击才加载」。

### 怎么改 mock

- 改**某个示例**的样子 → 改 `src/components/demo-mocks.tsx`，key 是 `slug::示例标题`
  （标题必须与 `src/data/components/*.ts` 里**完全一致**）
- 改**某个组件的默认外观** → 改 `src/components/mocks.tsx`
- 共用零件（按钮、开关、对话框等）→ 改 `src/components/mock-kit.tsx`

**两个校验脚本，改完必跑**：

```bash
node _work/mock-status.cjs      # 注册键 vs 真实示例标题交叉校验，写错标题会 exit 1
node _work/verify-demo-diff.cjs # 抓渲染后的 HTML，证明同组件内每个示例图都不同
```

**注意**：Server Component 不要直接 `import { getMock }` / `getDemoMock` ——
它们被客户端组件引用，服务端图里会被解析成客户端引用代理，运行时报
`(0, b.Vh) is not a function`。必须通过 `MockBox`（客户端外壳）中转：

```tsx
// ❌ Server Component 里直接调用会炸
{getMock(c.slug)}

// ✅ 用客户端外壳中转
<MockBox slug={c.slug} />
```

放静态图：把图片放到 `public/previews/`，然后：

```ts
previewImage: '/previews/my-widget.png',   // 组件级默认
// 或在单个 demo 里覆盖
{ ..., preview: 'image', imageUrl: '/previews/my-widget-dark.png' }
```

---

## 部署到 Vercel

### 方式一：Git 仓库（推荐）

```bash
cd material-docs
git init
git add .
git commit -m "feat: Material 组件手册"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

然后到 [vercel.com/new](https://vercel.com/new) 导入这个仓库。
Vercel 会自动识别 Next.js，**不需要改任何配置**，直接点 Deploy。

### 方式二：CLI

```bash
npm i -g vercel
cd material-docs
vercel          # 预览环境
vercel --prod   # 生产环境
```

### 部署后要确认的三件事

1. **`/handbook` 能正常显示** —— 它走的是 `public/handbook/index.html` 静态文件。
   如果显示 404 或白屏，检查 `next.config.js` 里给 `/handbook/:path*.html`
   设置的 `Content-Type` 头是否生效（中文必须带 `charset=utf-8`）。
2. **搜索能搜到中文** —— 搜索是纯前端内存过滤，不依赖任何 API。
3. **移动端布局** —— 用手机打开，确认左侧导航变成了顶部抽屉。

### 关于 `vercel.json`

```json
{ "framework": "nextjs" }
```

这一行就够了。**不要**加 `"outputDirectory"` —— App Router 的产物布局
和静态导出不同，写错会导致 404。

---

## 更新工程化指南

那份指南是独立维护的 HTML，本站只是搬运：

```bash
cp "../PulseShop-Handbook/flutter-new-project-setup.html" \
   "public/handbook/index.html"
```

复制完对比一下大小，确认是完整文件：

```bash
wc -c "../PulseShop-Handbook/flutter-new-project-setup.html" \
      "public/handbook/index.html"
```

**注意**：仓库里的 `public/handbook/index.html` 已经做了一处本地修改 ——
原「附录 E · Dart 高级语法速查」已被搬到 `/resources/dart`，
原地替换成一张指向新页面的引导卡片，页内所有 `#a5*` 锚点也改成了跨页链接。
直接覆盖会把这份改动冲掉，覆盖后需要重新跑一遍：

```bash
node _work/move-dart-appendix.cjs
```

两个数字不一致是正常的（搬运后体积会略小）。改完提交，Vercel 会自动重新部署。

---

## 设计约定

**颜色**：统一用 `tailwind.config.ts` 里的 Element Plus 色板
（`brand-500: #409eff`、`ink-*` 灰阶、`ok/warn/danger/info`）。
不要在组件里写 `#xxxxxx`。

**属性表只列高频参数**。官方签名有 30 个参数时，这里只列 5~10 个。
判断标准：新手在写第一个项目时会不会改它？

**示例必须讲「为什么」**。光给代码的示例等于没写 ——
每个 `demo.note` 和代码里的注释都要回答「为什么这么写、不这么写会怎样」。

**代码里的坑要标出来**。`whenToUse.dont` 和示例里的 `// ❌` / `// ✅` 对比
是本站区别于官方文档的核心价值，不要为了「看起来简洁」而删掉。

---

## 已知限制

- 搜索是纯前端字符串匹配，不支持模糊拼写纠错
- 组件数据手写维护，不会自动同步 Flutter 版本更新
- Flutter Web 实时预览需要有对应的构建产物，目前示例默认走静态图降级
