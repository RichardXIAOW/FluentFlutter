import type { ComponentDoc } from '../types';

/** 选择：Radio / Chip / SegmentedButton */
export const selectionComponents: ComponentDoc[] = [
  {
    slug: 'radio',
    name: 'Radio',
    title: '单选',
    summary: '在一组互斥选项里选一个。',
    category: 'selection',
    tags: ['单选', 'radio', '互斥', '选择'],
    highlights: [
      '一组 Radio 的 groupValue 必须共享同一个变量，value 各不相同',
      '选项 ≤ 5 个时直接铺开，多了改用下拉',
      '整组用 RadioGroup（Flutter 3.32+）或自己管状态',
    ],
    props: [
      { name: 'value', type: 'T', required: true, desc: '这个选项代表的值' },
      { name: 'groupValue', type: 'T?', desc: '整组当前选中的值。当它等于自己的 value 时，这个 Radio 显示为选中' },
      { name: 'onChanged', type: 'ValueChanged<T?>?', desc: '选择回调，传 null 即禁用' },
      { name: 'toggleable', type: 'bool', def: 'false', desc: '为 true 时再点已选中的项可以取消选择' },
      { name: 'activeColor', type: 'Color?', desc: '选中时的颜色' },
      { name: 'fillColor', type: 'MaterialStateProperty<Color?>?', desc: '精细控制填充色' },
    ],
    demos: [
      {
        title: '一组单选（用 RadioListTile，整行可点）',
        preview: 'live',
        code: `class _RadioDemo extends StatefulWidget {
  const _RadioDemo();
  @override
  State<_RadioDemo> createState() => _RadioDemoState();
}

class _RadioDemoState extends State<_RadioDemo> {
  String _pay = 'wechat';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        RadioListTile<String>(
          value: 'wechat',
          groupValue: _pay,
          onChanged: (v) => setState(() => _pay = v!),
          title: const Text('微信支付'),
          secondary: const Icon(Icons.chat_bubble_outline),
        ),
        RadioListTile<String>(
          value: 'alipay',
          groupValue: _pay,
          onChanged: (v) => setState(() => _pay = v!),
          title: const Text('支付宝'),
          secondary: const Icon(Icons.account_balance_wallet_outlined),
        ),
        RadioListTile<String>(
          value: 'card',
          groupValue: _pay,
          onChanged: (v) => setState(() => _pay = v!),
          title: const Text('银行卡'),
          secondary: const Icon(Icons.credit_card),
        ),
      ],
    );
  }
}`,
      },
      {
        title: '选项少的时候用 Chip 更省空间',
        note: '2~4 个短选项横着排，比竖着列三行 Radio 紧凑得多。',
        preview: 'live',
        code: `class _ChipRadio extends StatefulWidget {
  const _ChipRadio();
  @override
  State<_ChipRadio> createState() => _ChipRadioState();
}

class _ChipRadioState extends State<_ChipRadio> {
  String _size = 'M';

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      children: ['S', 'M', 'L', 'XL'].map((s) => ChoiceChip(
        label: Text(s),
        selected: _size == s,
        onSelected: (_) => setState(() => _size = s),
      )).toList(),
    );
  }
}`,
      },
    ],
    related: ['checkbox', 'chip', 'dropdown-button', 'segmented-button'],
  },

  {
    slug: 'chip',
    name: 'Chip',
    title: '标签',
    summary: '一小块圆角区域，用来展示标签或承载轻量操作。',
    category: 'selection',
    tags: ['标签', 'chip', 'tag', '徽标'],
    highlights: [
      '四个变体各司其职：Chip（展示）、FilterChip（筛选）、ChoiceChip（单选）、ActionChip（触发动作）',
      '只是「显示」标签时用 Chip，别给它加 onPressed',
      'Chip 自带的最小高度是 32，比自己用 Container 拼更符合规范',
    ],
    props: [
      { name: 'label', type: 'Widget', required: true, desc: '标签内容，通常是 Text' },
      { name: 'avatar', type: 'Widget?', desc: '左侧的小头像或图标' },
      { name: 'deleteIcon', type: 'Widget?', desc: '右侧的删除图标' },
      { name: 'onDeleted', type: 'VoidCallback?', desc: '设了这个才会出现删除按钮' },
      { name: 'backgroundColor', type: 'Color?', desc: '底色' },
      { name: 'side', type: 'BorderSide?', desc: '描边，设为 BorderSide.none 可去掉边框' },
      { name: 'padding', type: 'EdgeInsetsGeometry?', desc: '内边距' },
      { name: 'visualDensity', type: 'VisualDensity?', desc: '视觉密度，调小能让 Chip 更紧凑' },
    ],
    demos: [
      {
        title: '四个变体对照',
        note: '选错变体会让用户误以为能点。这三个字是判断标准：静态展示用 Chip、能多选用 FilterChip、只能选一个用 ChoiceChip、点了会触发动作（如下载）用 ActionChip。',
        preview: 'live',
        code: `Wrap(
  spacing: 8,
  runSpacing: 8,
  children: [
    // ① 纯展示
    const Chip(label: Text('数码')),

    // 带图标
    const Chip(
      avatar: Icon(Icons.tag, size: 16),
      label: Text('新品'),
    ),

    // 可删除
    Chip(
      label: const Text('已选条件'),
      onDeleted: () {},
    ),

    // ② 筛选（可多选）
    FilterChip(
      label: const Text('包邮'),
      selected: true,
      onSelected: (_) {},
    ),

    // ③ 单选
    ChoiceChip(
      label: const Text('M'),
      selected: true,
      onSelected: (_) {},
    ),

    // ④ 触发动作
    ActionChip(
      avatar: const Icon(Icons.download, size: 16),
      label: const Text('下载'),
      onPressed: () {},
    ),
  ],
)`,
      },
      {
        title: '状态标签（订单状态这类）',
        note: '不同状态用不同底色是常见需求。写成一个小函数复用它，比在每个页面写 switch 好。',
        preview: 'live',
        code: `Widget statusChip(String status) {
  final (bg, fg) = switch (status) {
    '已完成' => (const Color(0xffe8f5e9), const Color(0xff2e7d32)),
    '进行中' => (const Color(0xffe3f2fd), const Color(0xff1565c0)),
    '已取消' => (const Color(0xfff5f5f5), const Color(0xff757575)),
    _ => (const Color(0xfffff3e0), const Color(0xffe65100)),
  };
  return Chip(
    label: Text(status, style: TextStyle(color: fg, fontSize: 12)),
    backgroundColor: bg,
    side: BorderSide.none,
    visualDensity: VisualDensity.compact,
  );
}

// 用的时候
Wrap(spacing: 8, children: [
  statusChip('已完成'),
  statusChip('进行中'),
  statusChip('已取消'),
])`,
      },
    ],
    related: ['filter-chip', 'radio', 'wrap', 'badge'],
  },

  {
    slug: 'filter-chip',
    name: 'FilterChip',
    title: '筛选标签',
    summary: '可多选的标签，选中后前面会出现一个对勾。',
    category: 'selection',
    tags: ['筛选', 'filter', '多选', '标签'],
    highlights: [
      '和 ChoiceChip 的区别：FilterChip 可以同时选中多个，ChoiceChip 只能一个',
      '选中态自带对勾图标，不用自己加',
      '数据量大时在 onSelected 里防抖，避免每次勾选都发请求',
    ],
    props: [
      { name: 'label', type: 'Widget', required: true, desc: '标签内容' },
      { name: 'selected', type: 'bool', required: true, desc: '是否选中' },
      { name: 'onSelected', type: 'ValueChanged<bool>?', required: true, desc: '选中状态变化回调，参数是「变化后」的值' },
      { name: 'showCheckmark', type: 'bool', def: 'true', desc: '是否显示选中时的对勾' },
      { name: 'checkmarkColor', type: 'Color?', desc: '对勾颜色' },
      { name: 'selectedColor', type: 'Color?', desc: '选中时的底色' },
      { name: 'avatar', type: 'Widget?', desc: '左侧图标。设了它 showCheckmark 会自动失效' },
    ],
    demos: [
      {
        title: '多条件筛选（带「重置」）',
        note: '把选中项存在 Set 里比 List 好 —— 判断「是否选中」是 O(1)，而且天然去重。',
        preview: 'live',
        code: `class _FilterBar extends StatefulWidget {
  const _FilterBar();
  @override
  State<_FilterBar> createState() => _FilterBarState();
}

class _FilterBarState extends State<_FilterBar> {
  static const _options = ['包邮', '现货', '7天退换', '品牌店', '分期免息', '百亿补贴'];
  final _selected = <String>{};

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _options.map((o) => FilterChip(
            label: Text(o),
            selected: _selected.contains(o),
            onSelected: (v) => setState(() {
              if (v) { _selected.add(o); } else { _selected.remove(o); }
            }),
          )).toList(),
        ),
        const SizedBox(height: 12),
        Text(
          _selected.isEmpty ? '未筛选' : '已选：\${_selected.join(" · ")}',
          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
        ),
        if (_selected.isNotEmpty)
          TextButton(
            onPressed: () => setState(_selected.clear),
            child: const Text('重置'),
          ),
      ],
    );
  }
}`,
      },
    ],
    related: ['chip', 'checkbox', 'wrap'],
  },

  {
    slug: 'segmented-button',
    name: 'SegmentedButton',
    title: '分段按钮',
    summary: '连在一起的一组按钮，用于 2~5 个选项里挑一个（或多个）。',
    category: 'selection',
    tags: ['分段', 'segmented', '切换', 'tab'],
    highlights: [
      '比 Tab 轻，比 Chip 正式，适合「列表/网格」「日/周/月」这种视图切换',
      '多选时把 multiSelectionEnabled 设为 true，selected 传 Set',
      '选项超过 5 个就不适合了，改用 TabBar',
    ],
    props: [
      { name: 'segments', type: 'List<ButtonSegment<T>>', required: true, desc: '各段的内容' },
      { name: 'selected', type: 'Set<T>', required: true, desc: '选中的值集合（单选也是一个 Set，只是长度为 1）' },
      { name: 'onSelectionChanged', type: 'ValueChanged<Set<T>>?', desc: '选择变化回调' },
      { name: 'multiSelectionEnabled', type: 'bool', def: 'false', desc: '是否允许多选' },
      { name: 'emptySelectionAllowed', type: 'bool', def: 'false', desc: '是否允许一个都不选' },
      { name: 'showSelectedIcon', type: 'bool', def: 'true', desc: '选中时是否显示对勾。字多的时候关掉更清爽' },
    ],
    demos: [
      {
        title: '视图切换（列表 / 网格）',
        note: '比 TabBar 更「轻」，因为它不涉及页面导航，只是切换同一个列表的展示方式。',
        preview: 'live',
        code: `class _ViewSwitch extends StatefulWidget {
  const _ViewSwitch();
  @override
  State<_ViewSwitch> createState() => _ViewSwitchState();
}

class _ViewSwitchState extends State<_ViewSwitch> {
  String _view = 'list';

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<String>(
      segments: const [
        ButtonSegment(value: 'list', icon: Icon(Icons.view_list), label: Text('列表')),
        ButtonSegment(value: 'grid', icon: Icon(Icons.grid_view), label: Text('网格')),
      ],
      selected: {_view},
      onSelectionChanged: (s) => setState(() => _view = s.first),
      showSelectedIcon: false,
    );
  }
}`,
      },
      {
        title: '时间范围（多选）',
        note: 'multiSelectionEnabled 打开后，selected 是一个可能包含多项的 Set。',
        preview: 'none',
        code: `SegmentedButton<String>(
  segments: const [
    ButtonSegment(value: 'mon', label: Text('周一')),
    ButtonSegment(value: 'wed', label: Text('周三')),
    ButtonSegment(value: 'fri', label: Text('周五')),
  ],
  selected: _days,
  multiSelectionEnabled: true,
  onSelectionChanged: (s) => setState(() => _days = s),
)`,
      },
    ],
    related: ['tab-bar', 'chip', 'radio'],
  },
];
