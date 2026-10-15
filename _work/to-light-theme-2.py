# -*- coding: utf-8 -*-
"""第二轮：清理第一轮之后查到的旧色相残留（薄荷绿/白高亮/目录树文字色）。"""
import sys

TARGETS = [
    r"D:/曹禹/flutter教程/material-docs/public/handbook/index.html",
    r"D:/曹禹/flutter教程/PulseShop-Handbook/flutter-new-project-setup.html",
]

REPLACEMENTS = [
    # 完成态步骤：薄荷绿 → 绿
    ("rgba(110,231,200,.34)", "rgba(103,194,58,.35)", "done 边框"),
    ("rgba(110,231,200,.028)", "rgba(103,194,58,.05)", "done 底"),
    # 表格 hover：白高亮在浅底不可见 → 淡蓝
    ("rgba(255,255,255,.017)", "rgba(64,158,255,.05)", "表格行 hover"),
    # 徽章 pill：薄荷绿 → 绿
    ("rgba(110,231,200,.4)", "rgba(103,194,58,.45)", "绿 pill 边框"),
    ("rgba(110,231,200,.08)", "rgba(103,194,58,.09)", "绿 pill 底"),
    # 目录树：为暗底调的亮灰 → 深灰
    ("color:#aab3c1", "color:#4a5058", "目录树正文"),
    ("color:#5e6875", "color:#8a9099", "目录树注释"),
]

FORBIDDEN = [
    "rgba(110,231,200", "rgba(255,255,255,.017",
    "#aab3c1", "#5e6875",
]

ok = True
for path in TARGETS:
    print(f"\n=== {path} ===")
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()
    for old, new, note in REPLACEMENTS:
        n = src.count(old)
        if n == 0:
            print(f"  ? 未找到: {old}  [{note}]")
            continue
        src = src.replace(old, new)
        print(f"  x{n:<3} {old}  →  {new}   [{note}]")
    leftover = [f for f in FORBIDDEN if f in src]
    if leftover:
        ok = False
        print(f"  !! 残留: {leftover}")
    else:
        print("  ✓ 无残留")
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)

print("\n" + ("完成" if ok else "有残留"))
sys.exit(0 if ok else 1)
