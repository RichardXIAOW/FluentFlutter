import type { ComponentDoc } from '../types';

/** 输入：TextField / Form / Checkbox / Switch / Slider 等 */
export const inputComponents: ComponentDoc[] = [
  {
    slug: 'text-field',
    name: 'TextField',
    title: '文本输入框',
    summary: '让用户输入文字，是表单里出现最多的组件。',
    category: 'input',
    tags: ['输入框', 'textfield', '输入', '表单', 'password'],
    highlights: [
      '必传 controller 或 onChanged 之一，否则你拿不到用户输入的内容',
      'obscureText: true 做密码框，但记得同时关掉自动纠正',
      'TextEditingController 必须 dispose，否则内存泄漏',
    ],
    whenToUse: {
      do: ['收集用户填写的文字', '搜索框', '备注/留言'],
    },
    props: [
      {
        name: 'controller',
        type: 'TextEditingController?',
        desc: '控制器。需要主动读值、改值、监听变化时用它。用了它就必须在 dispose 里释放',
      },
      {
        name: 'decoration',
        type: 'InputDecoration?',
        desc: '外观：labelText（浮动标签）、hintText（占位提示）、errorText（错误信息）、prefixIcon 等。不传就是一条下划线',
      },
      {
        name: 'obscureText',
        type: 'bool',
        def: 'false',
        desc: '密码模式，输入内容变成圆点。配合 autocorrect: false 和 enableSuggestions: false',
      },
      {
        name: 'keyboardType',
        type: 'TextInputType?',
        desc: '弹哪种键盘：number（数字）、emailAddress（带@）、phone（拨号盘）、multiline（多行）',
      },
      {
        name: 'maxLines',
        type: 'int?',
        def: '1',
        desc: '显示几行。1 是单行；设成 null 表示无限高，会随内容长高（做留言框常用）',
      },
      {
        name: 'maxLength',
        type: 'int?',
        desc: '最多输入多少字。设了会自动在右下角显示字数计数',
      },
      {
        name: 'onChanged',
        type: 'ValueChanged<String>?',
        desc: '每次内容变化都回调。只想知道「最终值」应该在提交时读 controller.text',
      },
      {
        name: 'onSubmitted',
        type: 'ValueChanged<String>?',
        desc: '用户按键盘上的「完成/回车」时触发。搜索框常在这里发请求',
      },
      {
        name: 'enabled',
        type: 'bool?',
        def: 'true',
        desc: '为 false 时整个框禁用变灰。比 readOnly 更彻底（连复制都不行）',
      },
      {
        name: 'readOnly',
        type: 'bool',
        def: 'false',
        desc: '只读，但能选中复制。做「点击弹选择器」的假输入框时用它',
      },
      {
        name: 'focusNode',
        type: 'FocusNode?',
        desc: '焦点控制。需要「按下一项」或「自动聚焦」时用',
      },
      {
        name: 'inputFormatters',
        type: 'List<TextInputFormatter>?',
        desc: '输入过滤：只允许数字、限制长度、手机号加空格等',
      },
    ],
    demos: [
      {
        title: '基础：带标签和提示',
        note: 'labelText 会「浮动」到边框上，比 hintText 更适合做字段名 —— hintText 会随输入消失。',
        preview: 'live',
        code: `Column(
  spacing: 16,
  children: const [
    TextField(
      decoration: InputDecoration(
        labelText: '手机号',                    // 字段名，浮动标签
        hintText: '请输入 11 位手机号',          // 占位提示
        prefixIcon: Icon(Icons.phone_android),
        border: OutlineInputBorder(),           // 加边框（默认只有下划线）
      ),
      keyboardType: TextInputType.phone,
    ),
    TextField(
      decoration: InputDecoration(
        labelText: '备注',
        hintText: '选填',
        border: OutlineInputBorder(),
      ),
      maxLines: 3,
    ),
  ],
)`,
      },
      {
        title: '密码框',
        note: '注意三个参数要一起写。只写 obscureText 的话，iOS 的自动纠错会在密码里乱加空格 —— 用户会收到"密码错误"但完全不知道为什么。',
        preview: 'live',
        code: `TextField(
  obscureText: true,
  autocorrect: false,          // ★ 必须
  enableSuggestions: false,    // ★ 必须
  decoration: const InputDecoration(
    labelText: '密码',
    prefixIcon: Icon(Icons.lock_outline),
    border: OutlineInputBorder(),
  ),
)

// 带「显示/隐藏密码」按钮
class _PasswordField extends StatefulWidget {
  const _PasswordField();
  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      obscureText: _obscure,
      autocorrect: false,
      enableSuggestions: false,
      decoration: InputDecoration(
        labelText: '密码',
        border: const OutlineInputBorder(),
        suffixIcon: IconButton(
          tooltip: _obscure ? '显示密码' : '隐藏密码',
          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
          onPressed: () => setState(() => _obscure = !_obscure),
        ),
      ),
    );
  }
}`,
      },
      {
        title: '用 controller 读值 + 释放',
        note: '最容易漏的是 dispose。不释放 controller 会内存泄漏，而且在热重载时会看到「A TextEditingController was used after being disposed」这样的报错。',
        preview: 'live',
        code: `class _SearchBox extends StatefulWidget {
  const _SearchBox();
  @override
  State<_SearchBox> createState() => _SearchBoxState();
}

class _SearchBoxState extends State<_SearchBox> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();   // ★ 一定要
    super.dispose();
  }

  void _submit() {
    // 读当前值
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    print('搜索：\$text');
    // 想清空：_controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      onSubmitted: (_) => _submit(),
      decoration: InputDecoration(
        hintText: '搜索商品',
        prefixIcon: const Icon(Icons.search),
        border: const OutlineInputBorder(),
        suffixIcon: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => _controller.clear(),
        ),
      ),
    );
  }
}`,
      },
      {
        title: '只允许输入数字 + 限长',
        note: 'inputFormatters 在「输入的那一刻」就过滤掉非法字符，比事后校验体验好得多。',
        preview: 'live',
        code: `import 'package:flutter/services.dart';

TextField(
  keyboardType: TextInputType.number,
  inputFormatters: [
    FilteringTextInputFormatter.digitsOnly,      // 只允许数字
    LengthLimitingTextInputFormatter(6),         // 最多 6 位（验证码）
  ],
  decoration: const InputDecoration(
    labelText: '验证码',
    border: OutlineInputBorder(),
    counterText: '',                              // 隐藏默认的字数计数
  ),
)

// 手机号：自动每 4 位加空格（需要自定义 formatter）
class PhoneFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digits = newValue.text.replaceAll(RegExp(r'\\D'), '');
    final buf = StringBuffer();
    for (var i = 0; i < digits.length && i < 11; i++) {
      if (i == 3 || i == 7) buf.write(' ');
      buf.write(digits[i]);
    }
    final text = buf.toString();
    return TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }
}`,
      },
      {
        title: '错误提示',
        note: 'errorText 一设，边框自动变红、下面自动出现提示文字 —— 不需要自己画。',
        preview: 'live',
        code: `TextField(
  decoration: const InputDecoration(
    labelText: '邮箱',
    border: OutlineInputBorder(),
    errorText: '邮箱格式不正确',      // ← 设了它就有红框和红字
  ),
)`,
      },
    ],
    related: ['form', 'text-form-field', 'selectable-text'],
  },

  {
    slug: 'text-form-field',
    name: 'TextFormField',
    title: '表单文本域',
    summary: 'TextField 的表单版，自带校验能力，是 Form 的标准子项。',
    category: 'input',
    tags: ['表单', '校验', 'form', 'validate'],
    highlights: [
      '比 TextField 多一个 validator —— 这就是它存在的全部理由',
      '必须放在 Form 里，validator 才会被触发',
      '错误提示由 validator 返回的字符串自动渲染，不用自己画',
    ],
    props: [
      {
        name: 'validator',
        type: 'FormFieldValidator<String>?',
        desc: '校验函数。返回 null 表示通过；返回字符串则显示为错误提示。这就是它和 TextField 的唯一区别',
      },
      { name: 'onSaved', type: 'FormFieldSetter<String>?', desc: '表单 validate 通过后调用，常用来赋值给变量' },
      { name: 'initialValue', type: 'String?', desc: '初始值。注意它和 controller 不能同时用' },
      { name: 'autovalidateMode', type: 'AutovalidateMode?', desc: '什么时候触发校验：disabled（默认，只在 validate() 时）、onUserInteraction（用户一改就校验，体验更好）' },
      { name: 'controller', type: 'TextEditingController?', desc: '同 TextField' },
      { name: 'keyboardType', type: 'TextInputType?', desc: '同 TextField' },
      { name: 'decoration', type: 'InputDecoration?', desc: '同 TextField' },
    ],
    demos: [
      {
        title: '完整登录表单',
        note: '注意 validate() 的返回值：它是一个整体判断，任意一项失败就返回 false。不看你写了几条规则。',
        preview: 'live',
        code: `class _LoginForm extends StatefulWidget {
  const _LoginForm();
  @override
  State<_LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<_LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _phone = TextEditingController();
  final _pwd = TextEditingController();

  @override
  void dispose() {
    _phone.dispose();
    _pwd.dispose();
    super.dispose();
  }

  void _submit() {
    // ★ 这一句触发所有 validator
    if (!_formKey.currentState!.validate()) return;
    print('通过：\${_phone.text} / \${_pwd.text}');
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      // 用户一改就校验，不用等到点提交才知道错了
      autovalidateMode: AutovalidateMode.onUserInteraction,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 16,
        children: [
          TextFormField(
            controller: _phone,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              labelText: '手机号',
              prefixIcon: Icon(Icons.phone_android),
              border: OutlineInputBorder(),
            ),
            validator: (v) {
              if (v == null || v.isEmpty) return '手机号不能为空';
              if (!RegExp(r'^1[3-9]\\\\d{9}$').hasMatch(v)) return '手机号格式不正确';
              return null;                          // null = 通过
            },
          ),
          TextFormField(
            controller: _pwd,
            obscureText: true,
            autocorrect: false,
            enableSuggestions: false,
            decoration: const InputDecoration(
              labelText: '密码',
              prefixIcon: Icon(Icons.lock_outline),
              border: OutlineInputBorder(),
            ),
            validator: (v) {
              if (v == null || v.isEmpty) return '密码不能为空';
              if (v.length < 8) return '密码至少 8 位';
              return null;
            },
          ),
          const SizedBox(height: 8),
          FilledButton(onPressed: _submit, child: const Text('登录')),
        ],
      ),
    );
  }
}`,
      },
      {
        title: '异步校验（比如「手机号是否已注册」）',
        note: 'validator 不能是 async —— 它是同步函数。异步校验要在提交时单独 await，然后用 setState 把错误塞进去。',
        preview: 'none',
        code: `// ❌ validator 不能 async，这样写拿不到结果
validator: (v) async { ... }

// ✅ 提交时先跑异步校验
Future<void> _submit() async {
  if (!_formKey.currentState!.validate()) return;

  setState(() => _checking = true);
  final exists = await api.isPhoneRegistered(_phone.text);
  setState(() => _checking = false);

  if (exists) {
    setState(() => _phoneError = '该手机号已注册');
    return;
  }
  // 继续提交
}

// 然后把这个错误喂给 decoration.errorText
TextFormField(
  decoration: InputDecoration(
    labelText: '手机号',
    errorText: _phoneError,           // 由 setState 控制
  ),
)`,
      },
    ],
    related: ['form', 'text-field'],
  },

  {
    slug: 'form',
    name: 'Form',
    title: '表单',
    summary: '把一组输入框包起来统一校验、统一取值。',
    category: 'input',
    tags: ['表单', 'form', '校验', 'validate'],
    highlights: [
      '必须配一个 GlobalKey<FormState>，否则没法触发校验',
      'validate() 会遍历所有子项的 validator，全部通过才返回 true',
      'reset() 清空所有子项的值和错误',
    ],
    props: [
      { name: 'key', type: 'GlobalKey<FormState>', desc: '必需。用它才能从外部调 validate() / save() / reset()' },
      { name: 'child', type: 'Widget', required: true, desc: '通常是一个 Column' },
      { name: 'autovalidateMode', type: 'AutovalidateMode?', desc: '自动校验时机。推荐 onUserInteraction，比默认的「只在提交时」体验好' },
      { name: 'onChanged', type: 'VoidCallback?', desc: '任意子项值变化时触发' },
      { name: 'onWillPop', type: 'WillPopScopeCallback?', desc: '返回时拦截（比如提示「有未保存的修改」）。新版用 PopScope' },
    ],
    demos: [
      {
        title: 'Form 的三个核心动作',
        preview: 'none',
        code: `final _formKey = GlobalKey<FormState>();

// ① 校验：返回 bool，任意一项失败即 false
final ok = _formKey.currentState!.validate();
if (!ok) return;

// ② 保存：调用所有子项的 onSaved
_formKey.currentState!.save();

// ③ 重置：清空值和错误提示
_formKey.currentState!.reset();`,
      },
      {
        title: '提交时先校验、提交中禁用按钮',
        note: '这是「表单提交」的标准流程，把前面学的防连点也用上了。',
        preview: 'live',
        code: `Future<void> _submit() async {
  // ① 校验
  if (!_formKey.currentState!.validate()) return;

  // ② 提交中禁用
  setState(() => _submitting = true);
  try {
    await api.submit(_phone.text, _pwd.text);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('提交成功')),
    );
  } catch (e) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('提交失败：\$e')),
    );
  } finally {
    // ★ 无论成功失败都要恢复按钮
    if (mounted) setState(() => _submitting = false);
  }
}`,
      },
    ],
    related: ['text-form-field', 'text-field', 'elevated-button'],
  },

  {
    slug: 'checkbox',
    name: 'Checkbox',
    title: '复选框',
    summary: '勾选/取消勾选，也可以做「多选一组」。',
    category: 'input',
    tags: ['复选框', 'checkbox', '多选', '勾选', '同意'],
    highlights: [
      'value 可以是 true / false / null（null 表示半选，做「全选」时用）',
      '单个 Checkbox 的点击区域很小，要配 CheckboxListTile 或自己包一层',
      '「同意用户协议」这类必须配合文字，不能只给一个框',
    ],
    props: [
      { name: 'value', type: 'bool?', desc: '当前状态。null 渲染成横杠（半选态），用于「部分选中」的父级复选框' },
      { name: 'onChanged', type: 'ValueChanged<bool?>?', desc: '状态变化回调。传 null 即禁用变灰' },
      { name: 'tristate', type: 'bool', def: 'false', desc: '是否允许三态（true / false / null）。做「全选」父子联动必须开' },
      { name: 'activeColor', type: 'Color?', desc: '勾选后的填充色' },
      { name: 'checkColor', type: 'Color?', desc: '对勾的颜色' },
      { name: 'shape', type: 'OutlinedBorder?', desc: '外框形状。默认是圆角方形，改成 CircleBorder 就是圆形勾选' },
      { name: 'side', type: 'BorderSide?', desc: '未选中时的边框样式' },
    ],
    demos: [
      {
        title: '带文字的复选框：用 CheckboxListTile',
        note: '裸 Checkbox 的点击区域只有 18×18，用户很难点到。CheckboxListTile 让整行都能点，这是 Material 规范的要求。',
        preview: 'live',
        code: `class _AgreeDemo extends StatefulWidget {
  const _AgreeDemo();
  @override
  State<_AgreeDemo> createState() => _AgreeDemoState();
}

class _AgreeDemoState extends State<_AgreeDemo> {
  bool _agreed = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CheckboxListTile(
          value: _agreed,
          onChanged: (v) => setState(() => _agreed = v ?? false),
          title: const Text('我已阅读并同意《用户协议》'),
          controlAffinity: ListTileControlAffinity.leading,  // 框在左、字在右
          contentPadding: EdgeInsets.zero,
        ),
        FilledButton(
          // 没勾同意就不能提交
          onPressed: _agreed ? () {} : null,
          child: const Text('注册'),
        ),
      ],
    );
  }
}`,
      },
      {
        title: '全选 / 半选（tristate 的经典用法）',
        note: '父级的 value 是计算出来的：全选了就是 true、一个没选是 false、选了一部分是 null。这就是 tristate 存在的意义。',
        preview: 'live',
        code: `class _MultiSelect extends StatefulWidget {
  const _MultiSelect();
  @override
  State<_MultiSelect> createState() => _MultiSelectState();
}

class _MultiSelectState extends State<_MultiSelect> {
  final _all = ['手机', '电脑', '平板', '耳机'];
  final _checked = <String>{};

  bool? get _headState {
    if (_checked.isEmpty) return false;
    if (_checked.length == _all.length) return true;
    return null;                     // 部分选中
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CheckboxListTile(
          value: _headState,
          tristate: true,              // ★ 允许半选
          onChanged: (v) => setState(() {
            if (v == true) {
              _checked.addAll(_all);
            } else {
              _checked.clear();
            }
          }),
          title: const Text('全选'),
        ),
        const Divider(height: 1),
        ..._all.map((item) => CheckboxListTile(
          value: _checked.contains(item),
          onChanged: (v) => setState(() {
            if (v == true) { _checked.add(item); } else { _checked.remove(item); }
          }),
          title: Text(item),
        )),
      ],
    );
  }
}`,
      },
    ],
    related: ['switch', 'radio', 'chip'],
  },

  {
    slug: 'switch',
    name: 'Switch',
    title: '开关',
    summary: '立即生效的二元开关，适合「设置项」。',
    category: 'input',
    tags: ['开关', 'switch', 'toggle', '设置', '开关按钮'],
    highlights: [
      '语义是「立刻生效」—— 拨一下设置就变了，不需要点保存',
      '反例：表单里「是否开票」这种要等提交的，应该用 Checkbox',
      '做设置页建议用 SwitchListTile，整行可点',
    ],
    props: [
      { name: 'value', type: 'bool', required: true, desc: '当前状态' },
      { name: 'onChanged', type: 'ValueChanged<bool>?', desc: '切换回调。传 null 即禁用' },
      { name: 'activeColor', type: 'Color?', desc: '打开时的滑块颜色' },
      { name: 'activeTrackColor', type: 'Color?', desc: '打开时轨道颜色' },
      { name: 'thumbColor', type: 'MaterialStateProperty<Color?>?', desc: '精细控制滑块颜色（按下/悬停等状态）' },
      { name: 'dragStartBehavior', type: 'DragStartBehavior', def: 'start', desc: '拖拽起点行为。一般不用改' },
    ],
    demos: [
      {
        title: '设置页标准写法',
        note: 'SwitchListTile 的 subtitle 用来说明「打开后会怎样」，这比只写开关名字有用得多。',
        preview: 'live',
        code: `class _SettingsDemo extends StatefulWidget {
  const _SettingsDemo();
  @override
  State<_SettingsDemo> createState() => _SettingsDemoState();
}

class _SettingsDemoState extends State<_SettingsDemo> {
  bool _notify = true;
  bool _darkMode = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SwitchListTile(
          value: _notify,
          onChanged: (v) => setState(() => _notify = v),
          title: const Text('接收推送通知'),
          subtitle: const Text('关闭后你将不会收到订单和活动提醒'),
          secondary: const Icon(Icons.notifications_outlined),
        ),
        const Divider(height: 1),
        SwitchListTile(
          value: _darkMode,
          onChanged: (v) => setState(() => _darkMode = v),
          title: const Text('深色模式'),
          secondary: const Icon(Icons.dark_mode_outlined),
        ),
      ],
    );
  }
}`,
      },
      {
        title: '切换时发请求（注意别卡住 UI）',
        note: '开关是「立即生效」语义，所以要马上反映在界面上（乐观更新），失败再回滚。如果等请求回来才改状态，用户会觉得卡顿。',
        preview: 'none',
        code: `Future<void> _toggle(bool v) async {
  setState(() => _notify = v);            // ★ 先乐观更新
  try {
    await api.updateNotification(v);
  } catch (e) {
    if (!mounted) return;
    setState(() => _notify = !v);          // 失败回滚
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('设置失败，请重试')),
    );
  }
}`,
      },
    ],
    related: ['checkbox', 'radio', 'chip'],
  },

  {
    slug: 'slider',
    name: 'Slider',
    title: '滑块',
    summary: '在连续或离散的区间里拖选一个值。',
    category: 'input',
    tags: ['滑块', 'slider', '拖动', '区间', '价格'],
    highlights: [
      '价格区间、音量、亮度这类「模糊数值」最适合',
      '需要精确数值时用输入框，Slider 拖不准',
      'divisions 设了就是离散档位，不设就是连续',
    ],
    props: [
      { name: 'value', type: 'double', required: true, desc: '当前值，必须在 min 和 max 之间' },
      { name: 'onChanged', type: 'ValueChanged<double>?', desc: '拖动中持续回调。想实时显示数值就靠它' },
      { name: 'min', type: 'double', def: '0.0', desc: '最小值' },
      { name: 'max', type: 'double', def: '1.0', desc: '最大值' },
      { name: 'divisions', type: 'int?', desc: '分几档。设了就有吸附效果（比如 0/25/50/75/100）' },
      { name: 'label', type: 'String?', desc: '拖动时气泡显示的文本。需要配 divisions 才有气泡' },
      { name: 'onChangeEnd', type: 'ValueChanged<double>?', desc: '松手时触发。适合在这里发请求，避免拖动过程中疯狂请求' },
      { name: 'activeColor', type: 'Color?', desc: '已选部分的颜色' },
    ],
    demos: [
      {
        title: '价格区间选择',
        note: '关键在 onChangeEnd —— 拖动过程中 onChanged 会触发几十次，请求要放在松手时。',
        preview: 'live',
        code: `class _PriceRange extends StatefulWidget {
  const _PriceRange();
  @override
  State<_PriceRange> createState() => _PriceRangeState();
}

class _PriceRangeState extends State<_PriceRange> {
  double _max = 500;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('最高价：¥\${_max.round()}'),
        Slider(
          value: _max,
          min: 0,
          max: 1000,
          divisions: 20,                    // 每 50 一档
          label: '¥\${_max.round()}',
          onChanged: (v) => setState(() => _max = v),   // 只更新 UI
          onChangeEnd: (v) {
            // ★ 松手才发请求
            print('筛选：0 ~ \${v.round()}');
          },
        ),
      ],
    );
  }
}`,
      },
      {
        title: '数值范围超出滑块时的处理',
        note: 'Slider 的 value 必须在 [min, max] 内，否则会直接抛异常。数据可能是脏的，要 clamp。',
        preview: 'none',
        code: `// ❌ 如果 _max 是 1200，这里会崩
Slider(value: _max, min: 0, max: 1000, onChanged: ...)

// ✅ 先夹到范围内
Slider(
  value: _max.clamp(0, 1000),
  min: 0,
  max: 1000,
  onChanged: (v) => setState(() => _max = v),
)`,
      },
    ],
    related: ['checkbox', 'switch', 'text-field'],
  },

  {
    slug: 'search-bar',
    name: 'SearchBar',
    title: '搜索栏',
    summary: 'Material 3 的搜索输入框，自带圆角、阴影和搜索图标。',
    category: 'input',
    tags: ['搜索', 'search', 'searchbar', '查找'],
    highlights: [
      'M3 新增组件，比自己拿 TextField 拼一个更省事',
      '通常配合 SearchAnchor 做搜索建议下拉',
      '搜索框和普通输入框的差别：搜索框不需要 label，靠 hint 就够',
    ],
    props: [
      { name: 'controller', type: 'TextEditingController?', desc: '文本控制器' },
      { name: 'hintText', type: 'String?', desc: '占位提示文字' },
      { name: 'leading', type: 'Widget?', desc: '前置组件，默认是搜索图标' },
      { name: 'trailing', type: 'Iterable<Widget>?', desc: '后置组件列表，比如清空按钮' },
      { name: 'onChanged', type: 'ValueChanged<String>?', desc: '文字变化回调' },
      { name: 'onSubmitted', type: 'ValueChanged<String>?', desc: '提交回调' },
      { name: 'elevation', type: 'MaterialStateProperty<double?>?', desc: '阴影高度' },
      { name: 'padding', type: 'MaterialStateProperty<EdgeInsetsGeometry?>?', desc: '内边距' },
    ],
    demos: [
      {
        title: '基础搜索栏',
        preview: 'live',
        code: `class _SearchDemo extends StatefulWidget {
  const _SearchDemo();
  @override
  State<_SearchDemo> createState() => _SearchDemoState();
}

class _SearchDemoState extends State<_SearchDemo> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SearchBar(
      controller: _controller,
      hintText: '搜索商品、品牌、分类',
      leading: const Icon(Icons.search),
      trailing: [
        if (_controller.text.isNotEmpty)
          IconButton(
            tooltip: '清空',
            icon: const Icon(Icons.close),
            onPressed: () => setState(_controller.clear),
          ),
      ],
      onChanged: (v) => setState(() {}),       // 让清空按钮出现/消失
      onSubmitted: (v) => print('搜索：\$v'),
    );
  }
}`,
      },
      {
        title: '带搜索建议（SearchAnchor）',
        note: '这是 M3 里「搜索 + 下拉建议」的官方组合，不用自己写 Overlay。',
        preview: 'none',
        code: `SearchAnchor(
  builder: (context, controller) {
    return IconButton(
      icon: const Icon(Icons.search),
      onPressed: () => controller.openView(),
    );
  },
  suggestionsBuilder: (context, controller) {
    final keyword = controller.text;
    return [
      ListTile(
        leading: const Icon(Icons.search),
        title: Text('搜索「\$keyword」'),
        onTap: () => Navigator.pop(context),
      ),
      const ListTile(leading: Icon(Icons.history), title: Text('历史记录')),
    ];
  },
)`,
      },
    ],
    related: ['text-field', 'text-form-field'],
  },

  {
    slug: 'dropdown-button',
    name: 'DropdownButton',
    title: '下拉选择',
    summary: '在一个列表里选一项，收起后只显示当前选项。',
    category: 'input',
    tags: ['下拉', 'dropdown', '选择', 'select'],
    highlights: [
      '选项多（>7）时用下拉，少时用 Radio 或 Chip 直接铺开',
      'value 必须在 items 里能找到，否则会抛断言错误',
      '要「不选中」的语义时，把 value 设成 null 并加一个 null 选项',
    ],
    props: [
      { name: 'value', type: 'T?', desc: '当前选中值。null 表示未选' },
      { name: 'items', type: 'List<DropdownMenuItem<T>>', required: true, desc: '选项列表' },
      { name: 'onChanged', type: 'ValueChanged<T?>?', desc: '选择变化回调。传 null 即禁用' },
      { name: 'hint', type: 'Widget?', desc: '未选中时显示的占位内容' },
      { name: 'isExpanded', type: 'bool', def: 'false', desc: '是否撑满可用宽度。默认不撑，长文字会溢出 —— 通常要设 true' },
      { name: 'isDense', type: 'bool', def: 'false', desc: '紧凑模式，高度更小' },
      { name: 'icon', type: 'Widget?', desc: '右侧箭头图标' },
      { name: 'underline', type: 'Widget?', desc: '下划线。想完全去掉就传 SizedBox.shrink()' },
    ],
    demos: [
      {
        title: '基础下拉（注意 isExpanded）',
        note: '不写 isExpanded: true，选项文字长了就会溢出。这是个很高频的坑。',
        preview: 'live',
        code: `class _DropdownDemo extends StatefulWidget {
  const _DropdownDemo();
  @override
  State<_DropdownDemo> createState() => _DropdownDemoState();
}

class _DropdownDemoState extends State<_DropdownDemo> {
  String? _city = 'shanghai';

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: _city,
      isExpanded: true,          // ★ 防止长文字溢出
      decoration: const InputDecoration(
        labelText: '所在城市',
        border: OutlineInputBorder(),
      ),
      hint: const Text('请选择'),
      items: const [
        DropdownMenuItem(value: 'beijing', child: Text('北京')),
        DropdownMenuItem(value: 'shanghai', child: Text('上海')),
        DropdownMenuItem(value: 'guangzhou', child: Text('广州')),
      ],
      onChanged: (v) => setState(() => _city = v),
    );
  }
}`,
      },
      {
        title: '带 null 选项（允许「不限」）',
        note: 'DropdownMenuItem 的 value 是 null 时，DropdownButton 会把它当成"未选中"渲染，需要显式处理一下。',
        preview: 'none',
        code: `// 用「空字符串」代替 null 更省事
DropdownButton<String>(
  value: _filter,
  items: const [
    DropdownMenuItem(value: '', child: Text('不限')),
    DropdownMenuItem(value: 'new', child: Text('全新')),
    DropdownMenuItem(value: 'used', child: Text('二手')),
  ],
  onChanged: (v) => setState(() => _filter = v ?? ''),
)`,
      },
    ],
    related: ['radio', 'chip', 'selectable-text'],
  },
];
