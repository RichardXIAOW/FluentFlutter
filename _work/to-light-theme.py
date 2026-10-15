# -*- coding: utf-8 -*-
"""把 flutter-new-project-setup.html 从暗色主题转为浅色（Element Plus 风格）。

替换策略：全部是「精确字符串 → 精确字符串」的全局替换，顺序敏感：
先替换更长的 / 更具体的（代码高亮 token），再替换通用的（SVG 颜色）。
脚本最后会校验：文件里不再残留已知的暗色值。
"""
import shutil
import sys

TARGETS = [
    r"D:/曹禹/flutter教程/material-docs/public/handbook/index.html",
    r"D:/曹禹/flutter教程/PulseShop-Handbook/flutter-new-project-setup.html",
]

# (旧, 新, 说明)
REPLACEMENTS = [
    # ── :root 变量 ──
    ("--bg:#0d0f13", "--bg:#f5f7fa", "页面底色"),
    ("--bg2:#12151b", "--bg2:#ffffff", "次级底色"),
    ("--panel:#161a21", "--panel:#ffffff", "面板"),
    ("--panel2:#1b2029", "--panel2:#f5f7fa", "面板 2"),
    ("--line:#262c36", "--line:#e4e7ed", "分割线"),
    ("--line2:#323a47", "--line2:#dcdfe6", "分割线 2"),
    ("--tx:#e7eaf0", "--tx:#1f2328", "主文字"),
    ("--tx2:#a7b0be", "--tx2:#4a5058", "次文字"),
    ("--tx3:#6f7a89", "--tx3:#8a9099", "弱文字"),
    ("--acc:#8b7bf7", "--acc:#409eff", "主色（紫→蓝）"),
    ("--acc2:#6ee7c8", "--acc2:#529b2e", "成功色（薄荷→深绿，白底可读）"),
    ("--warn:#f0b429", "--warn:#e6a23c", "警告色"),
    ("--bad:#f0716c", "--bad:#f56c6c", "危险色"),
    ("--info:#5aa9f0", "--info:#3a8ee6", "信息色"),

    # ── 紫色 rgba → 蓝色 rgba ──
    ("rgba(139,123,247,.16)", "rgba(64,158,255,.15)", "brand dot 光圈"),
    ("rgba(139,123,247,.12)", "rgba(64,158,255,.10)", "h2 tag 底"),
    ("rgba(139,123,247,.28)", "rgba(64,158,255,.30)", "h2 tag 边框"),
    ("rgba(139,123,247,.08)", "rgba(64,158,255,.07)", "SVG domain 框"),

    # ── 顶栏 ──
    ("rgba(13,15,19,.94)", "rgba(255,255,255,.92)", "顶栏玻璃底"),

    # ── 复选框对勾（绿底上的深勾 → 白勾）──
    ("border:solid #0d0f13", "border:solid #fff", "checkbox 对勾"),

    # ── 代码块 ──
    ("background:#0a0c10}", "background:#f8f9fb}", "代码块底"),
    ("color:#cfd6e0;\n  white-space:pre", "color:#24292f;\n  white-space:pre", "代码正文"),
    # token（先于 SVG，因为更具体）
    (".c-kw{color:#c792ea}", ".c-kw{color:#cf222e}", "关键字"),
    (".c-typ{color:#7fd1e0}", ".c-typ{color:#0550ae}", "类型"),
    (".c-str{color:#9fd88a}", ".c-str{color:#0a3069}", "字符串"),
    (".c-com{color:#5e6875;font-style:italic}", ".c-com{color:#6e7781;font-style:italic}", "注释"),
    (".c-num{color:#f0b429}", ".c-num{color:#953800}", "数字"),
    (".c-ann{color:#e0a3f5}", ".c-ann{color:#0969da}", "注解"),
    (".c-key{color:#7fd1e0}", ".c-key{color:#0550ae}", "YAML key"),
    (".c-fn{color:#82b1ff}", ".c-fn{color:#8250df}", "函数"),

    # ── callout 底色换新色调 ──
    ("rgba(110,231,200,.055)", "rgba(103,194,58,.08)", "ok 提示底"),
    ("rgba(240,180,41,.055)", "rgba(230,162,60,.09)", "warn 提示底"),
    ("rgba(240,113,108,.055)", "rgba(245,108,108,.08)", "bad 提示底"),
    ("rgba(90,169,240,.055)", "rgba(58,142,230,.08)", "why 提示底"),

    # ── SVG 架构图 ──
    ('fill="#1b2029"', 'fill="#ffffff"', "SVG 框底"),
    ('stroke="#323a47"', 'stroke="#dcdfe6"', "SVG 框边"),
    ('fill="#cfd6e0"', 'fill="#1f2328"', "SVG 主文字"),
    ('fill="#6f7a89"', 'fill="#8a9099"', "SVG 弱文字"),
    ('fill="#7b8496"', 'fill="#606266"', "SVG 次文字"),
    ('stroke="#7b8496"', 'stroke="#a8abb2"', "SVG 次线条"),
    ('fill="#8b7bf7"', 'fill="#409eff"', "SVG 主色块"),
    ('stroke="#8b7bf7"', 'stroke="#409eff"', "SVG 主色线"),
    ('fill="#9d95cf"', 'fill="#337ecc"', "SVG 淡主色文字"),
    ('fill="#c9c2ff"', 'fill="#337ecc"', "SVG domain 标题"),
    ('fill="#f0716c"', 'fill="#f56c6c"', "SVG 危险色"),
]

# 替换后不允许再出现的暗色残留
FORBIDDEN = [
    "#0d0f13", "#12151b", "#161a21", "#1b2029", "#262c36", "#323a47",
    "#0a0c10", "#e7eaf0", "#a7b0be", "#8b7bf7", "#6ee7c8",
    "#c792ea", "#7fd1e0", "#9fd88a", "#e0a3f5", "#82b1ff",
    "rgba(139,123,247", "rgba(13,15,19",
]

ok = True
for path in TARGETS:
    print(f"\n=== {path} ===")
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()

    backup = path + ".dark-backup"
    shutil.copy2(path, backup)

    missed = []
    for old, new, note in REPLACEMENTS:
        n = src.count(old)
        if n == 0:
            missed.append(f"  ? 未找到（可能已换过）: {old}  [{note}]")
            continue
        src = src.replace(old, new)
        print(f"  x{n:<3} {old}  →  {new}   [{note}]")

    # 校验残留
    leftover = [f for f in FORBIDDEN if f in src]
    if leftover:
        ok = False
        print(f"  !! 仍有暗色残留: {leftover}")
    else:
        print("  ✓ 无暗色残留")

    for m in missed:
        print(m)

    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)

print("\n" + ("全部完成" if ok else "有残留，需人工检查"))
sys.exit(0 if ok else 1)
