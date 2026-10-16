'use client';

import { useState, type ReactNode } from 'react';
import {
  MI,
  P,
  MockFrame,
  Btn,
  IconBtn,
  SwitchI,
  CheckI,
  RadioG,
  SliderI,
  WrapChips,
  ChipToggle,
  FilterChips,
  SegmentedG,
  TabsG,
  NavBarG,
  ExpansionI,
  DropdownI,
  StepperI,
  SnackBarI,
  DialogI,
  SheetI,
  BannerI,
  InkWellI,
} from './mock-kit';

/* ── 各组件 mock ─────────────────────────────────────────── */

export const mocks: Record<string, () => ReactNode> = {
  /* ══ 通用 ══ */
  'elevated-button': () => (
    <MockFrame className="gap-2.5">
      <Btn kind="elevated">提交</Btn>
      <Btn kind="elevated" icon="＋">
        新建
      </Btn>
    </MockFrame>
  ),
  'filled-button': () => (
    <MockFrame className="gap-2.5">
      <Btn kind="filled">确定</Btn>
      <Btn kind="filled" icon="→">
        下一步
      </Btn>
    </MockFrame>
  ),
  'outlined-button': () => (
    <MockFrame className="gap-2.5">
      <Btn kind="outlined">取消</Btn>
      <Btn kind="outlined">查看详情</Btn>
    </MockFrame>
  ),
  'text-button': () => (
    <MockFrame className="gap-3">
      <Btn kind="text">知道了</Btn>
      <Btn kind="text">了解更多 »</Btn>
    </MockFrame>
  ),
  'icon-button': () => (
    <MockFrame className="gap-1">
      <IconBtn>
        <MI d={P.fav} className="text-danger" />
      </IconBtn>
      <IconBtn>
        <MI d={P.share} />
      </IconBtn>
      <IconBtn>
        <MI d={P.del} />
      </IconBtn>
      <IconBtn>
        <MI d={P.notif} />
      </IconBtn>
    </MockFrame>
  ),
  icon: () => (
    <MockFrame className="gap-3.5">
      <MI d={P.home} size={26} className="text-brand-500" />
      <MI d={P.star} size={26} className="text-warn" />
      <MI d={P.fav} size={26} className="text-danger" />
      <MI d={P.person} size={26} className="text-ink-400" />
    </MockFrame>
  ),
  text: () => (
    <MockFrame className="w-full flex-col items-start gap-1.5">
      <span className="text-[21px] font-semibold text-ink-900">
        标题 titleLarge
      </span>
      <span className="text-[16px] text-ink-700">
        正文 bodyMedium —— 一行普通的内容描述
      </span>
      <span className="text-[13.5px] tracking-wide text-ink-400">
        弱化文字 labelSmall
      </span>
    </MockFrame>
  ),
  divider: () => (
    <MockFrame className="w-full flex-col gap-2.5 p-5">
      <span className="text-[15px] text-ink-700">上面的内容</span>
      <span className="h-px w-full bg-ink-200" />
      <span className="text-[15px] text-ink-700">下面的内容</span>
    </MockFrame>
  ),
  card: () => (
    <MockFrame className="w-full max-w-[280px]">
      <div className="w-full rounded-xl bg-white p-4 shadow-card ring-1 ring-ink-100 transition active:scale-[.98]">
        <p className="text-[16px] font-semibold text-ink-900">卡片标题</p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">
          卡片内容，通常包一层 Margin 与圆角。
        </p>
      </div>
    </MockFrame>
  ),
  container: () => (
    <MockFrame>
      <div className="flex h-16 w-56 select-none items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200 transition active:bg-brand-100">
        <span className="text-[15px] text-brand-700">Container(带颜色与圆角)</span>
      </div>
    </MockFrame>
  ),
  'sized-box': () => (
    <MockFrame>
      <div className="flex items-center">
        <div className="h-11 w-11 rounded-md bg-[#dceafb] transition active:scale-90" />
        <span className="ml-2 text-[13px] text-ink-400">← SizedBox(44, 44)</span>
      </div>
    </MockFrame>
  ),
  'selectable-text': () => (
    <MockFrame className="w-full flex-col items-start gap-2">
      <span className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[14.5px] text-ink-800 ring-1 ring-brand-200 transition active:bg-brand-100">
        SN20261015001
      </span>
      <span className="text-[13px] text-ink-400">长按可选中的文字（订单号）</span>
    </MockFrame>
  ),
  'rich-text': () => (
    <MockFrame className="flex items-baseline gap-1">
      <span className="text-[16px] font-medium text-danger">¥ </span>
      <span className="text-[28px] font-bold text-danger">1299</span>
      <span className="text-[16px] font-semibold text-ink-400">.00</span>
      <span className="ml-3 rounded bg-ok/10 px-1.5 py-0.5 text-[13px] font-medium text-[#529b2e]">
        官方旗舰店
      </span>
    </MockFrame>
  ),
  'ink-well': () => (
    <MockFrame className="w-full max-w-[280px]">
      <InkWellI />
    </MockFrame>
  ),

  /* ══ 布局 ══ */
  row: () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex w-full items-center gap-2 rounded-lg border border-dashed border-brand-300 p-2">
        {[
          ['A', 'flex-1', '#dceafb', '#1e4e84'],
          ['B', 'w-14', '#e2f2e4', '#3d7a4a'],
          ['C', 'w-20', '#fae6e5', '#b0524c'],
        ].map(([t, w, bg, c]) => (
          <button
            key={t}
            type="button"
            className={`flex h-8 items-center justify-center rounded text-[13px] transition active:scale-95 ${w}`}
            style={{ backgroundColor: bg, color: c }}
          >
            {t}
          </button>
        ))}
      </div>
    </MockFrame>
  ),
  column: () => (
    <MockFrame className="w-full max-w-[180px]">
      <div className="flex w-full flex-col items-stretch gap-2 rounded-lg border border-dashed border-brand-300 p-2">
        {[
          ['子项 1', '#dceafb', '#1e4e84'],
          ['子项 2', '#e2f2e4', '#3d7a4a'],
          ['子项 3', '#fae6e5', '#b0524c'],
        ].map(([t, bg, c]) => (
          <button
            key={t}
            type="button"
            className="flex h-7 items-center justify-center rounded text-[13px] transition active:scale-95"
            style={{ backgroundColor: bg, color: c }}
          >
            {t}
          </button>
        ))}
      </div>
    </MockFrame>
  ),
  stack: () => (
    <MockFrame>
      <div className="relative h-[121px] w-[255px] transition active:scale-[.98]">
        <div className="absolute inset-0 rounded-lg bg-[#dceafb] ring-1 ring-[#a8c9ee]" />
        <div className="absolute left-4 top-4 h-[84px] w-[130px] rounded-lg bg-white/95 shadow-card ring-1 ring-ink-100" />
        <span className="absolute right-2 top-2 rounded-md bg-danger px-1.5 py-0.5 text-[12px] font-medium text-white">
          Positioned
        </span>
      </div>
    </MockFrame>
  ),
  padding: () => (
    <MockFrame>
      <div className="rounded-lg border border-dashed border-warn/60 bg-warn/5 p-3 transition active:scale-[.98]">
        <div className="flex h-11 w-40 items-center justify-center rounded bg-brand-50 text-[14px] text-brand-700">
          内边距 12px
        </div>
      </div>
    </MockFrame>
  ),
  center: () => (
    <MockFrame className="w-full max-w-[260px]">
      <div className="flex h-[111px] w-full items-center justify-center rounded-lg border border-dashed border-brand-300">
        <span className="rounded bg-[#dceafb] px-2.5 py-1 text-[14px] text-[#1e4e84] transition active:scale-95">
          正中间
        </span>
      </div>
    </MockFrame>
  ),
  expanded: () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex w-full gap-2">
        <span className="flex h-9 w-12 items-center justify-center rounded bg-ink-100 text-[12.5px] text-ink-500 transition active:scale-95">
          图标
        </span>
        <span className="flex h-9 flex-1 items-center justify-center rounded bg-brand-500 text-[13px] text-white transition active:scale-95">
          Expanded(flex: 1)
        </span>
        <span className="flex h-9 w-12 items-center justify-center rounded bg-ink-100 text-[12.5px] text-ink-500 transition active:scale-95">
          尾部
        </span>
      </div>
    </MockFrame>
  ),
  spacer: () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex w-full items-center">
        <span className="text-[14.5px] text-ink-800">收货地址</span>
        <span className="mx-2 h-px flex-1 border-t border-dashed border-brand-400" />
        <button type="button" className="text-[14px] text-brand-600 transition active:scale-95">
          修改
        </button>
      </div>
    </MockFrame>
  ),
  flexible: () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex w-full gap-2">
        <span className="flex h-9 w-12 items-center justify-center rounded bg-ink-100 text-[12.5px] text-ink-500 transition active:scale-95">
          图标
        </span>
        <span className="flex h-9 items-center justify-center rounded bg-ok/15 px-3 text-[13px] text-[#3d7a4a] transition active:scale-95">
          Flexible(短内容)
        </span>
        <span className="flex h-9 flex-1 items-center justify-center rounded bg-ink-50 text-[13px] text-ink-400">
          剩余空白
        </span>
      </div>
    </MockFrame>
  ),
  wrap: () => (
    <MockFrame className="w-full max-w-[280px]">
      <WrapChips items={['数码', '服饰', '食品生鲜', '美妆个护', '家居']} />
    </MockFrame>
  ),
  'grid-view': () => (
    <MockFrame className="w-full max-w-[260px]">
      <div className="grid w-full grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="rounded-md bg-white p-1.5 shadow-card ring-1 ring-ink-100 transition active:scale-95"
          >
            <div className="h-8 rounded bg-ink-100" />
            <div className="mt-1 h-1.5 w-3/4 rounded bg-ink-200" />
          </button>
        ))}
      </div>
    </MockFrame>
  ),
  'single-child-scroll-view': () => (
    <MockFrame className="w-full max-w-[180px]">
      <div className="relative flex h-[128px] w-full flex-col gap-1.5 overflow-y-auto rounded-lg border border-dashed border-brand-300 p-2 thin-scroll">
        {['第 1 屏', '第 2 屏', '第 3 屏', '第 4 屏', '第 5 屏'].map((t) => (
          <span
            key={t}
            className="flex h-8 shrink-0 items-center justify-center rounded bg-ink-50 text-[13px] text-ink-500"
          >
            {t}
          </span>
        ))}
      </div>
    </MockFrame>
  ),
  align: () => (
    <MockFrame className="w-full max-w-[240px]">
      <div className="relative h-[107px] w-full rounded-lg border border-dashed border-brand-300">
        <span className="absolute bottom-1.5 left-1.5 rounded bg-[#dceafb] px-1.5 py-0.5 text-[12.5px] text-[#1e4e84] transition active:scale-95">
          bottomLeft
        </span>
      </div>
    </MockFrame>
  ),
  positioned: () => (
    <MockFrame>
      <div className="relative h-[121px] w-[255px] overflow-hidden rounded-lg bg-ink-100 transition active:scale-[.98]">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-300 to-ink-400" />
        <span className="absolute left-0 top-3 rounded-r-md bg-danger px-1.5 py-0.5 text-[12px] font-medium text-white">
          5 折
        </span>
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-1.5 pt-5 text-[13px] text-white">
          商品标题（底部蒙层）
        </span>
      </div>
    </MockFrame>
  ),
  'indexed-stack': () => {
    const pages = ['首页的内容', '分类的内容', '我的的内容'];
    return <IndexedStackDemo pages={pages} />;
  },
  'safe-area': () => (
    <MockFrame>
      <div className="relative h-[121px] w-[180px] overflow-hidden rounded-xl bg-brand-500">
        <span className="absolute left-2 top-1.5 rounded bg-black/25 px-1.5 py-0.5 text-[11px] text-white">
          刘海区
        </span>
        <span className="absolute bottom-0 left-0 right-0 flex h-6 items-center justify-center bg-black/20 text-[11.5px] text-white">
          手势条 · SafeArea 避开
        </span>
        <span className="absolute inset-x-2 top-7 rounded bg-white/95 py-1 text-center text-[12.5px] text-ink-700">
          实际内容
        </span>
      </div>
    </MockFrame>
  ),

  /* ══ 输入 ══ */
  'text-field': () => (
    <MockFrame className="w-full max-w-[260px] flex-col items-stretch gap-2">
      <label className="rounded-lg border border-brand-500 bg-white px-3 py-2 ring-2 ring-brand-500/15 transition focus-within:ring-4">
        <span className="block text-[12px] text-brand-600">用户名</span>
        <input
          defaultValue="pulse_dev"
          className="mt-0.5 w-full bg-transparent text-[15px] text-ink-900 outline-none"
        />
      </label>
      <label className="rounded-lg border border-ink-200 bg-white px-3 py-2 transition focus-within:border-brand-500">
        <input
          type="password"
          placeholder="请输入密码"
          className="w-full bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
        />
      </label>
    </MockFrame>
  ),
  'text-form-field': () => (
    <MockFrame className="w-full max-w-[260px] flex-col items-stretch gap-2">
      <div className="rounded-lg border border-danger bg-white px-3 py-2 transition focus-within:ring-2 focus-within:ring-danger/20">
        <input
          defaultValue="abc"
          className="w-full bg-transparent text-[15px] text-ink-900 outline-none"
        />
        <span className="mt-0.5 block text-[12.5px] text-danger">
          手机号格式不正确（校验错误）
        </span>
      </div>
      <span className="text-[12.5px] text-ink-400">与 Form / validator 配合使用</span>
    </MockFrame>
  ),
  form: () => (
    <MockFrame className="w-full max-w-[260px] flex-col items-stretch gap-2">
      <input
        placeholder="邮箱"
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-[14.5px] text-ink-900 outline-none transition focus:border-brand-500 placeholder:text-ink-500"
      />
      <input
        placeholder="密码"
        type="password"
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-[14.5px] text-ink-900 outline-none transition focus:border-brand-500 placeholder:text-ink-500"
      />
      <Btn kind="filled">登录</Btn>
    </MockFrame>
  ),
  checkbox: () => (
    <MockFrame className="gap-4">
      <CheckI init label="选中" />
      <CheckI label="未选" />
    </MockFrame>
  ),
  switch: () => (
    <MockFrame className="gap-4">
      <SwitchI init label="开" />
      <SwitchI label="关" />
    </MockFrame>
  ),
  slider: () => (
    <MockFrame className="w-full max-w-[240px]">
      <SliderI />
    </MockFrame>
  ),
  'search-bar': () => (
    <MockFrame className="w-full max-w-[260px]">
      <div className="flex h-10 w-full items-center gap-2 rounded-full bg-ink-50 px-3.5 ring-1 ring-ink-200 transition focus-within:ring-2 focus-within:ring-brand-500/40">
        <MI d={P.search} size={16} className="shrink-0 text-ink-400" />
        <input
          placeholder="搜索商品…"
          className="w-full bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
        />
      </div>
    </MockFrame>
  ),
  'dropdown-button': () => (
    <MockFrame className="w-full max-w-[220px]">
      <DropdownI items={['广东省', '湖南省', '浙江省']} />
    </MockFrame>
  ),

  /* ══ 选择 ══ */
  radio: () => (
    <MockFrame>
      <RadioG options={['男', '女']} init={0} />
    </MockFrame>
  ),
  chip: () => (
    <MockFrame>
      <ChipToggle items={['可选标签', '可删除']} />
    </MockFrame>
  ),
  'filter-chip': () => (
    <MockFrame>
      <FilterChips items={['包邮', '七天无理由']} />
    </MockFrame>
  ),
  'segmented-button': () => (
    <MockFrame>
      <SegmentedG items={['日', '周', '月']} init={0} />
    </MockFrame>
  ),

  /* ══ 数据展示 ══ */
  'list-view': () => (
    <MockFrame className="w-full max-w-[280px]">
      <div className="w-full divide-y divide-ink-100 rounded-xl bg-white shadow-card ring-1 ring-ink-100">
        {[P.cart, P.fav, P.star].map((d, i) => (
          <button
            key={i}
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2 text-left transition active:bg-ink-50"
          >
            <MI d={d} size={18} className="text-ink-500" />
            <span className="text-[14.5px] text-ink-800">列表项 {i + 1}</span>
            <MI d={P.chevR} size={15} className="ml-auto text-ink-300" />
          </button>
        ))}
      </div>
    </MockFrame>
  ),
  'list-tile': () => (
    <MockFrame className="w-full max-w-[300px]">
      <button
        type="button"
        className="w-full rounded-xl bg-white px-3.5 py-3 text-left shadow-card ring-1 ring-ink-100 transition active:bg-ink-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[15px] font-semibold text-brand-700">
            曹
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15.5px] text-ink-900">曹禹</p>
            <p className="truncate text-[13.5px] text-ink-500">最近消息：明天见</p>
          </div>
          <MI d={P.chevR} size={17} className="ml-auto text-ink-300" />
        </div>
      </button>
    </MockFrame>
  ),
  image: () => (
    <MockFrame>
      <div className="relative h-[111px] w-[180px] overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 transition active:scale-[.98]">
        <svg viewBox="0 0 24 24" width="30" height="30" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-400" fill="currentColor">
          <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 12h12l-4-5-3 3.5L9 12l-3 4Z" />
          <circle cx="9" cy="9" r="1.8" />
        </svg>
        <span className="absolute bottom-1 right-1.5 text-[11.5px] text-brand-700">
          BoxFit.cover
        </span>
      </div>
    </MockFrame>
  ),
  'circle-avatar': () => (
    <MockFrame className="gap-3">
      <button type="button" className="transition active:scale-90">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-[17px] font-semibold text-brand-700">
          曹
        </span>
      </button>
      <button type="button" className="relative transition active:scale-90">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dceafb] text-[17px] font-semibold text-[#1e4e84]">
          L
        </span>
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[11.5px] font-medium text-white">
          5
        </span>
      </button>
    </MockFrame>
  ),
  badge: () => (
    <MockFrame className="gap-5">
      <button type="button" className="relative text-ink-600 transition active:scale-90">
        <MI d={P.notif} size={24} />
        <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[17px] items-center justify-center rounded-full bg-danger px-1 text-[11.5px] font-medium text-white">
          99+
        </span>
      </button>
      <button type="button" className="relative text-ink-600 transition active:scale-90">
        <MI d={P.inbox} size={24} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
      </button>
      <button type="button" className="relative text-ink-600 transition active:scale-90">
        <MI d={P.person} size={24} />
      </button>
    </MockFrame>
  ),
  'data-table': () => (
    <MockFrame className="w-full max-w-[300px]">
      <table className="w-full overflow-hidden rounded-lg bg-white text-left text-[13.5px] shadow-card ring-1 ring-ink-100">
        <thead>
          <tr className="bg-ink-50 text-ink-500">
            <th className="px-2.5 py-1.5 font-medium">产品</th>
            <th className="px-2.5 py-1.5 font-medium">区域</th>
            <th className="px-2.5 py-1.5 text-right font-medium">销售额</th>
          </tr>
        </thead>
        <tbody className="text-ink-700">
          {[
            ['云服务器', '华南', '¥12,800'],
            ['CDN', '华东', '¥5,320'],
          ].map(([a, b, c]) => (
            <tr key={a} className="border-t border-ink-100 transition hover:bg-brand-50/50">
              <td className="px-2.5 py-1.5">{a}</td>
              <td className="px-2.5 py-1.5">{b}</td>
              <td className="px-2.5 py-1.5 text-right tabular-nums">{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MockFrame>
  ),
  'expansion-tile': () => (
    <MockFrame className="w-full max-w-[280px] flex-col items-stretch gap-1.5">
      <ExpansionI
        init
        q="如何申请退款？"
        a="在订单详情页点击「申请售后」，选择退款原因后提交，1-3 个工作日内到账。"
      />
      <ExpansionI q="发票怎么开？" a="下单时在「发票」一栏填写抬头，或订单完成后在详情页补开。" />
    </MockFrame>
  ),
  skeleton: () => (
    <MockFrame className="w-full max-w-[280px] flex-col items-stretch gap-2.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card ring-1 ring-ink-100">
          <span className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-ink-100" />
          <div className="flex-1 space-y-1.5">
            <span className="block h-2.5 w-3/4 animate-pulse rounded bg-ink-100" />
            <span className="block h-2.5 w-1/2 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      ))}
    </MockFrame>
  ),
  stepper: () => (
    <MockFrame className="w-full max-w-[280px]">
      <StepperI steps={['收货', '配送', '支付']} />
    </MockFrame>
  ),

  /* ══ 反馈 ══ */
  'snack-bar': () => (
    <MockFrame className="w-full max-w-[300px]">
      <SnackBarI />
    </MockFrame>
  ),
  'alert-dialog': () => (
    <MockFrame className="w-full max-w-[280px]">
      <DialogI
        title="删除这条记录？"
        body="删除后无法恢复，确定要继续吗？"
        okLabel="删除"
        okDanger
      />
    </MockFrame>
  ),
  dialog: () => (
    <MockFrame className="w-full max-w-[280px]">
      <DialogI title="添加备注" body="" okLabel="确定" withInput />
    </MockFrame>
  ),
  'circular-progress-indicator': () => (
    <MockFrame className="gap-5">
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500" />
      <span className="h-7 w-7 rounded-full border-[3px] border-ink-100" />
    </MockFrame>
  ),
  'linear-progress-indicator': () => (
    <MockFrame className="w-full max-w-[260px] flex-col items-stretch gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div className="h-full w-2/3 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-brand-500" />
      </div>
      <span className="text-[12.5px] text-ink-400">value: 0.66（下载进度）</span>
    </MockFrame>
  ),
  tooltip: () => (
    <MockFrame>
      <div className="group relative cursor-pointer">
        <span className="rounded-md bg-[#2c3038] px-2 py-1 text-[13px] text-white opacity-100 shadow-pop transition group-hover:opacity-100 group-active:opacity-0">
          分享给好友
        </span>
        <span className="absolute left-4 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2c3038]" />
        <span className="mt-4 flex justify-center text-ink-600">
          <MI d={P.share} size={22} />
        </span>
      </div>
    </MockFrame>
  ),
  'refresh-indicator': () => (
    <MockFrame>
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500" />
    </MockFrame>
  ),
  'bottom-sheet': () => (
    <MockFrame className="w-full max-w-[280px]">
      <SheetI items={['拍照上传', '从相册选择', '取消']} />
    </MockFrame>
  ),
  banner: () => (
    <MockFrame className="w-full max-w-[320px]">
      <BannerI text="当前无网络连接，内容可能无法刷新" />
    </MockFrame>
  ),

  /* ══ 导航 ══ */
  'app-bar': () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex h-14 w-full items-center gap-3 rounded-xl bg-brand-500 px-3 text-white shadow-card">
        <IconBtn className="text-white">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </IconBtn>
        <span className="text-[17px] font-medium">商品详情</span>
        <span className="ml-auto flex items-center gap-1">
          <IconBtn className="text-white">
            <MI d={P.share} size={18} />
          </IconBtn>
          <IconBtn className="text-white">
            <MI d={P.cart} size={18} />
          </IconBtn>
        </span>
      </div>
    </MockFrame>
  ),
  'navigation-bar': () => (
    <MockFrame className="w-full max-w-[320px]">
      <NavBarG
        items={[
          { d: P.home, t: '首页' },
          { d: P.cart, t: '购物车' },
          { d: P.notif, t: '消息', badge: true },
          { d: P.person, t: '我的' },
        ]}
      />
    </MockFrame>
  ),
  'tab-bar': () => (
    <MockFrame className="w-full max-w-[300px]">
      <TabsG items={['全部', '待付款', '待发货']} />
    </MockFrame>
  ),
  drawer: () => (
    <MockFrame className="w-full max-w-[300px]">
      <div className="flex w-full gap-1.5">
        <div className="w-36 overflow-hidden rounded-r-xl bg-white shadow-pop ring-1 ring-ink-100">
          <div className="bg-brand-500 px-3 pb-3 pt-4">
            <p className="text-[15px] font-medium text-white">曹禹</p>
            <p className="text-[12.5px] text-white/70">dev@pulseshop.cn</p>
          </div>
          <div className="py-1.5">
            {['我的订单', '收货地址', '设置'].map((t, i) => (
              <button
                key={t}
                type="button"
                className={`block w-full px-3 py-1.5 text-left text-[14px] transition ${
                  i === 0 ? 'bg-brand-50 text-brand-600' : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="w-20 rounded-lg bg-ink-50" />
      </div>
    </MockFrame>
  ),
  'bottom-navigation-bar': () => (
    <MockFrame className="w-full max-w-[320px]">
      <NavBarG
        variant="classic"
        items={[
          { d: P.home, t: '首页' },
          { d: P.inbox, t: '分类' },
          { d: P.cart, t: '购物车' },
          { d: P.person, t: '我的' },
        ]}
      />
    </MockFrame>
  ),

  /* ══ 其他 ══ */
  scaffold: () => (
    <MockFrame>
      <div className="w-[232px] overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-ink-100">
        <div className="flex h-9 items-center bg-brand-500 px-2.5 text-[13.5px] text-white">
          AppBar
        </div>
        <div className="flex h-[79px] items-center justify-center bg-ink-50 text-[13px] text-ink-400">
          body
        </div>
        <div className="flex h-8 items-center justify-end px-2.5">
          <button type="button" className="-mt-6 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-[18px] text-white shadow-pop transition active:scale-90">
            ＋
          </button>
        </div>
        <div className="flex h-7 items-center justify-around border-t border-ink-100 text-[11px] text-ink-400">
          <span>首页</span>
          <span>分类</span>
          <span>我的</span>
        </div>
      </div>
    </MockFrame>
  ),
  theme: () => (
    <MockFrame className="gap-3">
      {[
        ['#409eff', 'seed'],
        ['#67c23a', 'ok'],
        ['#e6a23c', 'warn'],
        ['#f56c6c', 'danger'],
      ].map(([c, t]) => (
        <button key={t} type="button" className="flex flex-col items-center gap-1 transition active:scale-90">
          <span className="h-9 w-9 rounded-full" style={{ backgroundColor: c }} />
          <span className="text-[12px] text-ink-500">{t}</span>
        </button>
      ))}
    </MockFrame>
  ),
  'media-query': () => (
    <MockFrame className="gap-2.5">
      {[
        ['< 600', '2 列'],
        ['600-900', '3 列'],
        ['> 900', '4 列'],
      ].map(([w, c], i) => (
        <div
          key={w}
          className={`flex h-[97px] flex-col items-center justify-center rounded-lg px-3 text-center ring-1 transition active:scale-95 ${
            i === 1 ? 'bg-brand-50 ring-brand-200' : 'bg-white ring-ink-100'
          }`}
        >
          <span className="font-mono text-[12.5px] text-ink-500">{w}</span>
          <span className={`mt-0.5 text-[14px] font-medium ${i === 1 ? 'text-brand-600' : 'text-ink-700'}`}>
            {c}
          </span>
        </div>
      ))}
    </MockFrame>
  ),
};

/** IndexedStack demo（可切换页签，内容跟着变） */
function IndexedStackDemo({ pages }: { pages: string[] }) {
  const [idx, setIdx] = useState(1);
  return (
    <MockFrame className="w-full max-w-[260px]">
      <div className="w-full rounded-lg border border-dashed border-brand-300 p-2">
        <div className="flex h-12 items-center justify-center rounded bg-brand-50 text-[14px] font-medium text-brand-700">
          当前页：index = {idx}（{pages[idx]}）
        </div>
        <div className="mt-1.5 flex justify-center gap-1.5">
          {['首页', '分类', '我的'].map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setIdx(i)}
              className={`rounded px-2 py-0.5 text-[12.5px] transition ${
                idx === i ? 'bg-brand-500 text-white' : 'bg-ink-50 text-ink-400 hover:bg-ink-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/** 未注册 mock 的组件用这个抽象示意（圆角框 + 组件名） */
export function fallbackMock(name: string): ReactNode {
  return (
    <MockFrame>
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f1fd]">
          <svg viewBox="0 0 24 24" width="22" height="22" className="text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="4" y="5" width="16" height="14" rx="2.5" />
            <path d="M4 10h16" />
          </svg>
        </span>
        <span className="font-mono text-[12.5px] text-ink-400">{name}</span>
      </div>
    </MockFrame>
  );
}

export function getMock(slug: string): ReactNode {
  const fn = mocks[slug];
  return fn ? fn() : fallbackMock(slug);
}
