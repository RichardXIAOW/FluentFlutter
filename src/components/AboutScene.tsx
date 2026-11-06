'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * AboutScene —— /about 的「科技展厅」3D 场景
 *
 * 层次（由远及近）：
 *   1. 星空三层（远景星尘 / 中景星点 / 近景辉光）—— 缓慢漂移、微旋转
 *   2. 星云光斑（程序化径向渐变贴图，additive 低透明度）—— 制造纵深
 *   3. 背光光轮 + 五道竖光柱 —— 人物身后的圆形辉光与「神殿感」光带
 *   3.5 人物核心粒子 + 轮廓辉光壳（shadow 层用低透明度青色放大 5% 做出边缘发光）
 *   3. 地阵三层：外八卦（双环 + 八角 + 八卦爻纹）/ 中符文阵 / 内五行（五芒星 + 金木水火土），
 *      转速与方向各不相同，带呼吸明暗
 *   4. 能量环 ×3（TorusGeometry + additive）—— 不同倾角反向旋转，形成光环缠绕
 *   5. 人物粒子模型（约 9k 粒子按人体几何采样：头/颈/躯干/骨盆/双臂/双腿）—— 呼吸、微旋转
 *   6. 蓝牙数据流（两条 CatmullRom 曲线上的流动粒子：设备→手掌、绕身螺旋）—— 青→品红渐变
 *   7. 技能卫星 ×6（Vue / Flutter / Three.js / BLE / OTA / uni-app）—— 倾斜圆轨道 +
 *      线框八面体 + 发光铭牌，铭牌关闭 depthTest，任何角度都能看清
 *   8. 前景浮尘 —— 近景小粒子，强化空间感
 *   后期：UnrealBloom（辉光）+ OutputPass（色彩空间输出）
 *
 * 交互 / 降级：
 *   - 指针视差（相机平移 + 场景轻微倾斜），lerp 平滑
 *   - prefers-reduced-motion：只渲染静态帧
 *   - WebGL 创建失败：静默降级（CSS 渐变兜底，页面不崩）
 *   - 标签页隐藏时暂停 rAF，回到前台继续
 *   - 卸载时完整 dispose（geometry / material / texture / composer / renderer）
 */

const CYAN = 0x38bdf8;
const VIOLET = 0xa78bfa;
const MAGENTA = 0xe879f9;
const ICE = 0xc7f0ff;

/* ───────────── 程序化贴图 ───────────── */

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(180,235,255,0.95)');
  g.addColorStop(0.25, 'rgba(120,190,255,0.35)');
  g.addColorStop(1, 'rgba(80,120,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeNebulaTexture(hue: string): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, hue);
  g.addColorStop(0.4, hue.replace(/[\d.]+\)$/, '0.12)'));
  g.addColorStop(1, hue.replace(/[\d.]+\)$/, '0)'));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 魔法法阵：同心圆 + 刻度 + 断弧 + 六角标记 */
function makeRuneTexture(): THREE.Texture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(size / 2, size / 2);
  const R = size / 2;

  ctx.strokeStyle = 'rgba(120,220,255,0.85)';
  ctx.lineWidth = 2;

  // 外环 + 内环
  for (const r of [0.96, 0.86, 0.58, 0.34]) {
    ctx.beginPath();
    ctx.arc(0, 0, R * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 外环刻度
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const long = i % 8 === 0;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * R * 0.88, Math.sin(a) * R * 0.88);
    ctx.lineTo(Math.cos(a) * R * (long ? 0.96 : 0.92), Math.sin(a) * R * (long ? 0.96 : 0.92));
    ctx.globalAlpha = long ? 0.9 : 0.45;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 三段断弧（半径 0.72）
  for (let s = 0; s < 3; s++) {
    const start = (s / 3) * Math.PI * 2 + 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.72, start, start + Math.PI / 3.4);
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.lineWidth = 2;

  // 六角标记（半径 0.46 处）
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const cx = Math.cos(a) * R * 0.46;
    const cy = Math.sin(a) * R * 0.46;
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const b = a + (k / 3) * Math.PI * 2;
      const px = cx + Math.cos(b) * R * 0.035;
      const py = cy + Math.sin(b) * R * 0.035;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 八卦地阵：双环 + 八角 + 八卦爻纹（外层，最慢自转） */
function makeTrigramTexture(): THREE.Texture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(size / 2, size / 2);
  const R = size / 2;

  ctx.strokeStyle = 'rgba(120,220,255,0.8)';
  ctx.lineWidth = 2;

  for (const r of [0.98, 0.93, 0.66]) {
    ctx.beginPath();
    ctx.arc(0, 0, R * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 八角形
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * R * 0.9;
    const y = Math.sin(a) * R * 0.9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 八卦爻纹：阳爻一整条、阴爻断成两截，三条一卦
  const TRIGRAMS = ['111', '110', '101', '100', '011', '010', '001', '000'];
  ctx.lineWidth = 3.5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(Math.cos(a) * R * 0.78, Math.sin(a) * R * 0.78);
    ctx.rotate(a + Math.PI / 2);
    const half = R * 0.055;
    for (let k = 0; k < 3; k++) {
      const y = (k - 1) * 11;
      if (TRIGRAMS[i][k] === '1') {
        ctx.beginPath();
        ctx.moveTo(-half, y);
        ctx.lineTo(half, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-half, y);
        ctx.lineTo(-half * 0.22, y);
        ctx.moveTo(half * 0.22, y);
        ctx.lineTo(half, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // 边缘细刻度
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    ctx.globalAlpha = i % 8 === 0 ? 0.75 : 0.28;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * R * 0.935, Math.sin(a) * R * 0.935);
    ctx.lineTo(Math.cos(a) * R * (i % 8 === 0 ? 0.98 : 0.955), Math.sin(a) * R * (i % 8 === 0 ? 0.98 : 0.955));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 五行地阵：五芒星 + 金木水火土（内层，反向自转） */
function makePentacleTexture(): THREE.Texture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(size / 2, size / 2);
  const R = size / 2;

  ctx.strokeStyle = 'rgba(200,170,255,0.85)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.95, 0, Math.PI * 2);
  ctx.stroke();

  // 内接正五边形顶点
  const pt = (i: number, r: number) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(a) * R * r, Math.sin(a) * R * r] as const;
  };

  // 五芒星：隔点连线
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const [x, y] = pt(i * 2, 0.8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 内五边形
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const [x, y] = pt(i, 0.5);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 顶点小圆
  for (let i = 0; i < 5; i++) {
    const [x, y] = pt(i, 0.95);
    ctx.beginPath();
    ctx.arc(x, y, R * 0.012, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(210,185,255,0.9)';
    ctx.fill();
  }

  // 五行字
  const ELEMENTS = ['金', '木', '水', '火', '土'];
  ctx.font = `600 ${Math.round(R * 0.1)}px "PingFang SC","Microsoft YaHei",serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(226,210,255,0.92)';
  ELEMENTS.forEach((ch, i) => {
    const [x, y] = pt(i, 0.665);
    ctx.fillText(ch, x, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 技能铭牌：圆角胶囊底 + 发光文字，作为卫星标签 */
function makeLabelTexture(text: string, rgb: [number, number, number]): { texture: THREE.Texture; aspect: number } {
  const fontSize = 44;
  const padX = 24;
  const h = 92;
  const font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = font;
  const w = Math.ceil(probe.measureText(text).width) + padX * 2;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 胶囊底
  const r = h / 2 - 6;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(3, 6, w - 6, h - 12, r);
  else ctx.rect(3, 6, w - 6, h - 12);
  ctx.fillStyle = 'rgba(6,10,22,0.66)';
  ctx.fill();
  ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.7)`;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 文字（带同色辉光）
  ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.95)`;
  ctx.shadowBlur = 16;
  ctx.fillStyle = 'rgba(240,250,255,0.96)';
  ctx.fillText(text, w / 2, h / 2 + 1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { texture: tex, aspect: w / h };
}

/** 背光光轮：中心柔光 + 两道辉光圆环（人物背后的「动漫式」光晕） */
function makeHaloTexture(): THREE.Texture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const R = size / 2;

  const soft = ctx.createRadialGradient(R, R, 0, R, R, R);
  soft.addColorStop(0, 'rgba(90,200,255,0.16)');
  soft.addColorStop(0.45, 'rgba(110,190,255,0.09)');
  soft.addColorStop(0.8, 'rgba(120,150,255,0.03)');
  soft.addColorStop(1, 'rgba(80,110,255,0)');
  ctx.fillStyle = soft;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(180,235,255,0.9)';
  ctx.shadowColor = 'rgba(80,200,255,0.95)';
  ctx.shadowBlur = 46;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(R, R, R * 0.66, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(R, R, R * 0.73, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 竖光柱：底部亮、向上淡出，左右横向再淡出（destination-out 挖边） */
function makeShaftTexture(): THREE.Texture {
  const w = 128;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const v = ctx.createLinearGradient(0, h, 0, 0);
  v.addColorStop(0, 'rgba(170,235,255,0.5)');
  v.addColorStop(0.3, 'rgba(120,195,255,0.22)');
  v.addColorStop(1, 'rgba(90,140,255,0)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);

  const edge = ctx.createLinearGradient(0, 0, w, 0);
  edge.addColorStop(0, 'rgba(0,0,0,1)');
  edge.addColorStop(0.34, 'rgba(0,0,0,0)');
  edge.addColorStop(0.66, 'rgba(0,0,0,0)');
  edge.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ───────────── 人体粒子采样 ───────────── */
type P3 = [number, number, number];

function randDir(): THREE.Vector3 {
  // 球面均匀方向（避免极点聚集）
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  );
}

function pushSphere(out: number[], c: P3, r: number, n: number, jitter = 0.06) {
  for (let i = 0; i < n; i++) {
    const d = randDir().multiplyScalar(r * (1 + (Math.random() - 0.5) * jitter));
    out.push(c[0] + d.x, c[1] + d.y, c[2] + d.z);
  }
}

function pushEllipsoid(out: number[], c: P3, rx: number, ry: number, rz: number, n: number) {
  for (let i = 0; i < n; i++) {
    const d = randDir();
    const k = 1 + (Math.random() - 0.5) * 0.08;
    out.push(c[0] + d.x * rx * k, c[1] + d.y * ry * k, c[2] + d.z * rz * k);
  }
}

function pushCapsule(out: number[], a: P3, b: P3, r0: number, r1: number, n: number) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const axis = new THREE.Vector3().subVectors(B, A);
  for (let i = 0; i < n; i++) {
    const t = Math.random();
    const center = new THREE.Vector3().copy(A).addScaledVector(axis, t);
    const d = randDir();
    // 去掉沿轴分量，得到环绕方向
    d.sub(axis.clone().normalize().multiplyScalar(d.dot(axis.clone().normalize())));
    if (d.lengthSq() < 1e-6) d.set(1, 0, 0);
    d.normalize().multiplyScalar((r0 + (r1 - r0) * t) * (0.8 + Math.random() * 0.4));
    out.push(center.x + d.x, center.y + d.y, center.z + d.z);
  }
}

/** 采样一个「能量人形」的点云（单位：米级；身高约 1.75） */
function buildHumanPositions(density: number): Float32Array {
  const pts: number[] = [];
  // 头 / 颈
  pushSphere(pts, [0, 0.78, 0], 0.145, Math.round(700 * density), 0.05);
  pushCapsule(pts, [0, 0.66, 0], [0, 0.58, 0], 0.05, 0.06, Math.round(120 * density));
  // 躯干（上宽下窄：两段椭球叠加）
  pushEllipsoid(pts, [0, 0.42, 0], 0.235, 0.20, 0.135, Math.round(1400 * density));
  pushEllipsoid(pts, [0, 0.20, 0], 0.19, 0.13, 0.12, Math.round(800 * density));
  // 肩
  pushSphere(pts, [-0.235, 0.55, 0], 0.085, Math.round(180 * density), 0.08);
  pushSphere(pts, [0.235, 0.55, 0], 0.085, Math.round(180 * density), 0.08);
  // 双臂（上臂 / 前臂 / 手）
  for (const s of [-1, 1] as const) {
    pushCapsule(pts, [0.235 * s, 0.55, 0], [0.35 * s, 0.30, 0.03], 0.062, 0.05, Math.round(420 * density));
    pushCapsule(pts, [0.35 * s, 0.30, 0.03], [0.40 * s, 0.06, 0.10], 0.05, 0.042, Math.round(380 * density));
    pushSphere(pts, [0.41 * s, 0.02, 0.12], 0.05, Math.round(120 * density), 0.12);
    // 双腿（髋 / 大腿 / 小腿 / 脚）
    pushCapsule(pts, [0.11 * s, 0.12, 0], [0.13 * s, -0.24, 0.01], 0.085, 0.062, Math.round(600 * density));
    pushCapsule(pts, [0.13 * s, -0.24, 0.01], [0.14 * s, -0.62, 0.02], 0.06, 0.045, Math.round(520 * density));
    pushSphere(pts, [0.14 * s, -0.66, 0.06], 0.055, Math.round(120 * density), 0.15);
  }
  return new Float32Array(pts);
}

/* ───────────── 组件 ───────────── */

export default function AboutScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 720px)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL 不可用：保持 canvas 透明度 0，父级渐变兜底
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    // 不透明背景（与页面底色一致）：alpha: true 的画布经 EffectComposer 后
    // 会因 premultiplied 合成把 additive 内容二次压暗，必须用实色背景规避
    scene.background = new THREE.Color(0x05070f);
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
    camera.position.set(0, 0.15, 3.9);

    const dispose: Array<{ dispose: () => void }> = [];
    const glowTex = makeGlowTexture();
    const nebulaTexA = makeNebulaTexture('rgba(56,189,248,0.55)');
    const nebulaTexB = makeNebulaTexture('rgba(167,139,250,0.5)');
    const runeTex = makeRuneTexture();
    const trigramTex = makeTrigramTexture();
    const pentacleTex = makePentacleTexture();
    const haloTex = makeHaloTexture();
    const shaftTex = makeShaftTexture();
    dispose.push(glowTex, nebulaTexA, nebulaTexB, runeTex, trigramTex, pentacleTex, haloTex, shaftTex);

    /* ── 1. 星空三层 ── */
    const starLayers: Array<{ points: THREE.Points; geo: THREE.BufferGeometry; speed: number }> = [];
    // 尺寸换算：高 900px / fov 46° 时 1 世界单位 ≈ 264px，粒子直径按可视 3~6px 反推
    const starSpecs = [
      { count: smallScreen ? 1600 : 2600, size: 0.038, color: ICE, opacity: 0.5, spread: [26, 16, 14], speed: 0.000012 },
      { count: smallScreen ? 900 : 1500, size: 0.05, color: CYAN, opacity: 0.6, spread: [20, 13, 10], speed: 0.00002 },
      { count: smallScreen ? 260 : 420, size: 0.085, color: 0xffffff, opacity: 0.75, spread: [16, 10, 8], speed: 0.00003 },
    ];
    for (const spec of starSpecs) {
      const n = spec.count;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spec.spread[0];
        pos[i * 3 + 1] = (Math.random() - 0.5) * spec.spread[1];
        pos[i * 3 + 2] = (Math.random() - 0.5) * spec.spread[2] - 2.5;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: spec.color,
        size: spec.size,
        map: glowTex,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      starLayers.push({ points, geo, speed: spec.speed });
      dispose.push(geo, mat);
    }

    /* ── 2. 星云光斑 ── */
    const nebulae: THREE.Sprite[] = [];
    const nebulaSpecs = [
      { tex: nebulaTexA, pos: [-3.2, 0.9, -6], scale: 9, opacity: 0.28 },
      { tex: nebulaTexB, pos: [3.4, -1.2, -7], scale: 11, opacity: 0.24 },
      { tex: nebulaTexA, pos: [0.6, 2.6, -8], scale: 8, opacity: 0.16 },
    ];
    for (const spec of nebulaSpecs) {
      const mat = new THREE.SpriteMaterial({
        map: spec.tex,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(...(spec.pos as [number, number, number]));
      sprite.scale.setScalar(spec.scale);
      scene.add(sprite);
      nebulae.push(sprite);
      dispose.push(mat);
    }

    /* ── 3. 人物粒子 + 随身光环（统一旋转的组）── */
    const figure = new THREE.Group();
    figure.position.set(0, -0.12, 0);
    scene.add(figure);

    /* ── 3.1 背光光轮：人物身后的圆形辉光（动漫式轮廓光）── */
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.position.set(0, 0.44, -1.1);
    halo.scale.setScalar(2.9);
    figure.add(halo);
    dispose.push(haloMat);

    /* ── 3.2 竖光柱：背景数道向上的光带，做出「神殿感」纵深 ── */
    const shafts: Array<{ mat: THREE.MeshBasicMaterial; phase: number; base: number }> = [];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.PlaneGeometry(0.4 + (i % 2) * 0.18, 4.6);
      const base = 0.11 + (i % 3) * 0.035;
      const mat = new THREE.MeshBasicMaterial({
        map: shaftTex,
        transparent: true,
        opacity: base,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const shaft = new THREE.Mesh(geo, mat);
      shaft.position.set(-1.5 + i * 0.75, 0.85, -1.5 - (i % 3) * 0.28);
      shaft.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.06;
      figure.add(shaft);
      shafts.push({ mat, phase: i * 1.7, base });
      dispose.push(geo, mat);
    }

    const humanPos = buildHumanPositions(smallScreen ? 0.62 : 1);
    const humanGeo = new THREE.BufferGeometry();
    humanGeo.setAttribute('position', new THREE.BufferAttribute(humanPos, 3));
    const count = humanPos.length / 3;
    const colors = new Float32Array(count * 3);
    // 更饱和的霓虹梯度：深紫 → 青 → 冰蓝（少量白点做「星火」，避免整体发白）
    const cBottom = new THREE.Color(0x6d28d9);
    const cMid = new THREE.Color(0x22d3ee);
    const cTop = new THREE.Color(0x9be8ff);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const y = humanPos[i * 3 + 1];
      const t = THREE.MathUtils.clamp((y + 0.7) / 1.6, 0, 1);
      tmpColor.copy(t < 0.62 ? cBottom.clone().lerp(cMid, t / 0.62) : cMid.clone().lerp(cTop, (t - 0.62) / 0.38));
      if (Math.random() < 0.02) tmpColor.lerp(new THREE.Color(0xffffff), 0.45);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }
    humanGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const humanMat = new THREE.PointsMaterial({
      size: smallScreen ? 0.028 : 0.022,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.66,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const humanPoints = new THREE.Points(humanGeo, humanMat);
    figure.add(humanPoints);
    dispose.push(humanGeo, humanMat);

    // 轮廓辉光壳：同一套点放大一圈、只留低透明度青色，做出「边缘发光」而不是整体过曝
    const auraGeo = humanGeo.clone();
    const auraMat = new THREE.PointsMaterial({
      size: smallScreen ? 0.06 : 0.05,
      map: glowTex,
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const humanAura = new THREE.Points(auraGeo, auraMat);
    humanAura.scale.setScalar(1.05);
    figure.add(humanAura);
    dispose.push(auraGeo, auraMat);

    /* ── 4. 能量环 ×3（缠绕人物的光环）── */
    const rings: THREE.Mesh[] = [];
    const ringSpecs = [
      { r: 0.62, tilt: [Math.PI / 2.4, 0, 0.25], color: CYAN, opacity: 0.4, speed: 0.004 },
      { r: 0.78, tilt: [Math.PI / 1.9, 0.4, -0.3], color: VIOLET, opacity: 0.32, speed: -0.0032 },
      { r: 0.95, tilt: [Math.PI / 2.9, -0.35, 0.5], color: MAGENTA, opacity: 0.22, speed: 0.0022 },
    ];
    for (const spec of ringSpecs) {
      const geo = new THREE.TorusGeometry(spec.r, 0.009, 8, 160);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
      ring.userData.speed = spec.speed;
      figure.add(ring);
      rings.push(ring);
      dispose.push(geo, mat);
    }

    /* ── 5. 地阵三层：外八卦 / 中符文 / 内五行（脚下，各层转速与方向不同）── */
    const makeFloor = (tex: THREE.Texture, size: number, y: number, opacity: number, tint: number) => {
      const geo = new THREE.PlaneGeometry(size, size);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        color: tint,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      figure.add(mesh);
      dispose.push(geo, mat);
      return { mesh, mat };
    };

    const trigramFloor = makeFloor(trigramTex, 4.6, -0.75, 0.26, 0x9fe4ff);
    const runeFloor = makeFloor(runeTex, 2.6, -0.738, 0.46, 0xffffff);
    const pentacleFloor = makeFloor(pentacleTex, 1.72, -0.726, 0.4, 0xe6d9ff);

    /* ── 5.1 地面冲击波：三道由内向外扩散的圆环 ── */
    const ripples: Array<{ mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; offset: number }> = [];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.RingGeometry(0.94, 1, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -0.744;
      figure.add(mesh);
      ripples.push({ mesh, mat, offset: i / 3 });
      dispose.push(geo, mat);
    }

    /* ── 5.2 能量丝带：绕体数圈的光带，比细圆环更有「能量流动」感 ── */
    const ribbons: THREE.Mesh[] = [];
    const ribbonSpecs = [
      { color: 0x67e8f9, r: 0.66, turns: 2.6, y0: -0.6, y1: 0.8, speed: 0.006, opacity: 0.24, squash: 0.9 },
      { color: 0xe879f9, r: 0.8, turns: 2.1, y0: -0.55, y1: 0.72, speed: -0.0045, opacity: 0.18, squash: 0.8 },
      { color: 0xa78bfa, r: 0.92, turns: 3.1, y0: -0.5, y1: 0.86, speed: 0.0035, opacity: 0.15, squash: 0.95 },
    ];
    for (const spec of ribbonSpecs) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const a = t * Math.PI * 2 * spec.turns;
        const r = spec.r * (1 + 0.1 * Math.sin(t * Math.PI * 3));
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * r,
            spec.y0 + (spec.y1 - spec.y0) * t,
            Math.sin(a) * r * spec.squash,
          ),
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 220, 0.008, 6, false);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.speed = spec.speed;
      figure.add(mesh);
      ribbons.push(mesh);
      dispose.push(geo, mat);
    }

    /* ── 6. 蓝牙数据流：设备→手掌 + 绕身螺旋 ── */
    const streamCurves = [
      // 设备（左侧悬浮）→ 右手
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.55, 0.18, 0.45),
        new THREE.Vector3(-1.25, 0.42, 0.5),
        new THREE.Vector3(-0.95, 0.3, 0.35),
        new THREE.Vector3(-0.7, 0.12, 0.2),
        new THREE.Vector3(-0.45, 0.02, 0.14),
      ]),
      // 绕身螺旋（自下而上）
      new THREE.CatmullRomCurve3(
        Array.from({ length: 26 }, (_, i) => {
          const t = i / 25;
          const a = t * Math.PI * 4.2;
          return new THREE.Vector3(Math.cos(a) * 0.5, -0.55 + t * 1.45, Math.sin(a) * 0.4);
        }),
      ),
    ];

    const streams: Array<{
      geo: THREE.BufferGeometry;
      mat: THREE.PointsMaterial;
      curve: THREE.CatmullRomCurve3;
      baseT: Float32Array;
      speeds: Float32Array;
    }> = [];

    for (const [ci, curve] of streamCurves.entries()) {
      const n = ci === 0 ? (smallScreen ? 90 : 150) : smallScreen ? 120 : 210;
      const pos = new Float32Array(n * 3);
      const col = new Float32Array(n * 3);
      const baseT = new Float32Array(n);
      const speeds = new Float32Array(n);
      const cA = new THREE.Color(ci === 0 ? CYAN : VIOLET);
      const cB = new THREE.Color(ci === 0 ? MAGENTA : CYAN);
      for (let i = 0; i < n; i++) {
        baseT[i] = Math.random();
        speeds[i] = 0.08 + Math.random() * 0.14;
        const mixed = cA.clone().lerp(cB, baseT[i]);
        col[i * 3] = mixed.r;
        col[i * 3 + 1] = mixed.g;
        col[i * 3 + 2] = mixed.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({
        size: ci === 0 ? 0.05 : 0.045,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      figure.add(points);
      streams.push({ geo, mat, curve, baseT, speeds });
      dispose.push(geo, mat);
    }

    /* ── 7. 设备（左侧悬浮能量方块）── */
    const device = new THREE.Group();
    const devGeo = new THREE.IcosahedronGeometry(0.14, 0);
    const devMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.9 });
    device.add(new THREE.Mesh(devGeo, devMat));
    const devGlowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: CYAN,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const devGlow = new THREE.Sprite(devGlowMat);
    devGlow.scale.setScalar(0.7);
    device.add(devGlow);
    device.position.set(-1.55, 0.18, 0.45);
    figure.add(device);
    dispose.push(devGeo, devMat, devGlowMat);

    /* ── 8. 技能卫星：六块铭牌沿不同倾角的轨道绕体飞行 ── */
    const SKILLS: Array<{
      name: string;
      color: number;
      rgb: [number, number, number];
      r: number;
      y: number;
      tilt: number;
      speed: number;
      phase: number;
    }> = [
      { name: 'Vue 3', color: 0x42d392, rgb: [66, 211, 146], r: 1.22, y: 0.3, tilt: 0.44, speed: 0.34, phase: 0 },
      { name: 'Flutter', color: 0x54c5f8, rgb: [84, 197, 248], r: 1.1, y: 0.52, tilt: -0.3, speed: -0.44, phase: 1.15 },
      { name: 'Three.js', color: 0xdce8ff, rgb: [220, 232, 255], r: 1.52, y: -0.1, tilt: 0.22, speed: 0.27, phase: 2.3 },
      { name: 'BLE', color: 0x38bdf8, rgb: [56, 189, 248], r: 1.02, y: 0.04, tilt: -0.56, speed: 0.52, phase: 3.4 },
      { name: 'OTA', color: 0xe879f9, rgb: [232, 121, 249], r: 1.36, y: 0.48, tilt: 0.58, speed: -0.35, phase: 4.5 },
      { name: 'uni-app', color: 0xa78bfa, rgb: [167, 139, 250], r: 1.16, y: -0.24, tilt: 0.1, speed: 0.4, phase: 5.6 },
    ];

    const satellites: THREE.Group[] = [];
    for (const s of SKILLS) {
      const group = new THREE.Group();

      // 能量点（辉光 sprite）
      const dotMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: s.color,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dot = new THREE.Sprite(dotMat);
      dot.scale.setScalar(0.24);
      group.add(dot);

      // 线框八面体（转动时更有「实体」感）
      const octaGeo = new THREE.OctahedronGeometry(0.05, 0);
      const octaMat = new THREE.MeshBasicMaterial({
        color: s.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      const octa = new THREE.Mesh(octaGeo, octaMat);
      group.add(octa);
      dispose.push(octaGeo, octaMat, dotMat);

      // 铭牌：关掉 depthTest，始终可读（HUD 观感）
      const { texture, aspect } = makeLabelTexture(s.name, s.rgb);
      const labelMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: smallScreen ? 0.68 : 0.92,
        depthWrite: false,
        depthTest: false,
      });
      const label = new THREE.Sprite(labelMat);
      label.scale.set(0.16 * aspect, 0.16, 1);
      label.position.y = 0.14;
      group.add(label);
      dispose.push(texture, labelMat);

      group.userData = { ...s, octa };
      figure.add(group);
      satellites.push(group);
    }

    /* ── 9. 前景浮尘 ── */
    const dustCount = smallScreen ? 160 : 300;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dustPos[i * 3 + 2] = 1.2 + Math.random() * 1.6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: ICE,
      size: 0.035,
      map: glowTex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    dispose.push(dustGeo, dustMat);

    /* ── 后期：Bloom ── */
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    const renderPass = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), smallScreen ? 0.42 : 0.5, 0.85, 0.3);
    const outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(bloom);
    composer.addPass(outputPass);
    dispose.push(composer);

    /* ── 尺寸 / 布局自适应 ── */
    let orbitScale = 1; // 窄屏收窄卫星轨道，避免铭牌被视口切掉
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // 宽屏：人物偏右，给左侧文案留空间；窄屏：居中偏下
      const wide = w >= 1024;
      figure.position.x = wide ? 0.72 : 0;
      figure.position.y = wide ? -0.1 : -0.18;
      figure.scale.setScalar(wide ? 1 : 0.92);
      camera.position.z = wide ? 3.9 : 4.4;
      orbitScale = wide ? 1 : 0.64;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    /* ── 指针视差 ── */
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'clientX' in e ? e.clientX : (e.touches[0]?.clientX ?? 0);
      const cy = 'clientY' in e ? e.clientY : (e.touches[0]?.clientY ?? 0);
      target.x = (cx / window.innerWidth) * 2 - 1;
      target.y = (cy / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseout', onPointerLeave);
    document.documentElement.addEventListener('mouseleave', onPointerLeave);

    /* ── 动画 ── */
    let rafId = 0;
    let running = true;
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();

    const renderFrame = (elapsed: number) => {
      // 相机视差
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      camera.position.x = pointer.x * 0.5;
      camera.position.y = 0.15 - pointer.y * 0.28 + Math.sin(elapsed * 0.25) * 0.03;
      camera.lookAt(0, 0.02, 0);

      // 星空微旋 + 缓慢漂移
      for (const layer of starLayers) {
        layer.points.rotation.y += layer.speed;
        layer.points.rotation.x = Math.sin(elapsed * 0.05) * 0.02;
      }

      // 星云呼吸
      nebulae.forEach((n, i) => {
        const pulse = 1 + Math.sin(elapsed * 0.3 + i * 1.7) * 0.06;
        n.scale.setScalar((i === 2 ? 8 : 10) * pulse);
      });

      // 人物：呼吸 + 微旋转（核心与辉光壳同步）
      const breath = 1 + Math.sin(elapsed * 0.9) * 0.012;
      humanPoints.scale.setScalar(breath);
      humanAura.scale.setScalar(breath * 1.05);
      figure.rotation.y = Math.sin(elapsed * 0.12) * 0.28 + pointer.x * 0.18;
      figure.rotation.z = Math.sin(elapsed * 0.16) * 0.02;

      // 背光光轮：缓慢自转 + 呼吸
      haloMat.rotation += 0.0007;
      haloMat.opacity = 0.4 + 0.14 * (0.5 + 0.5 * Math.sin(elapsed * 0.6));
      halo.scale.setScalar(2.85 + Math.sin(elapsed * 0.6) * 0.05);

      // 竖光柱：各自缓慢明暗
      for (const s of shafts) {
        s.mat.opacity = s.base * (0.65 + 0.35 * (0.5 + 0.5 * Math.sin(elapsed * 0.5 + s.phase)));
      }

      // 能量丝带：绕体反向旋转
      for (const r of ribbons) {
        r.rotation.y += r.userData.speed as number;
      }

      // 地面冲击波：由内向外扩散并淡出
      for (const rp of ripples) {
        const t = (elapsed * 0.22 + rp.offset) % 1;
        const fadeIn = Math.min(1, t / 0.12);
        rp.mesh.scale.setScalar(0.7 + t * 3.1);
        rp.mat.opacity = (1 - t) * 0.3 * fadeIn;
      }

      // 光环反向旋转
      rings.forEach((ring, i) => {
        ring.rotation.z += (ring.userData.speed as number) * (1 + i * 0.15);
        ring.rotation.x += (ring.userData.speed as number) * 0.35;
        const m = ring.material as THREE.MeshBasicMaterial;
        m.opacity = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(elapsed * 0.8 + i));
      });

      // 地阵三层：外八卦慢转、中符文正转、内五行反转，各自呼吸
      trigramFloor.mesh.rotation.z += 0.0009;
      trigramFloor.mat.opacity = 0.18 + 0.12 * (0.5 + 0.5 * Math.sin(elapsed * 0.45));
      runeFloor.mesh.rotation.z += 0.0016;
      runeFloor.mat.opacity = 0.32 + 0.2 * (0.5 + 0.5 * Math.sin(elapsed * 0.7));
      pentacleFloor.mesh.rotation.z -= 0.0026;
      pentacleFloor.mat.opacity = 0.28 + 0.16 * (0.5 + 0.5 * Math.sin(elapsed * 0.9 + 1.2));

      // 技能卫星：倾斜圆轨道 + 轻微上下浮动
      for (const s of satellites) {
        const { r, y, tilt, speed, phase, octa } = s.userData as {
          r: number;
          y: number;
          tilt: number;
          speed: number;
          phase: number;
          octa: THREE.Mesh;
        };
        const a = elapsed * speed + phase;
        const rr = r * orbitScale;
        const px = Math.cos(a) * rr;
        const pz = Math.sin(a) * rr;
        const py = y + Math.sin(a * 2 + phase) * 0.05;
        s.position.set(
          px,
          py * Math.cos(tilt) - pz * Math.sin(tilt),
          py * Math.sin(tilt) + pz * Math.cos(tilt),
        );
        octa.rotation.x += 0.02;
        octa.rotation.y += 0.026;
      }

      // 数据流粒子推进
      for (const s of streams) {
        const attr = s.geo.getAttribute('position') as THREE.BufferAttribute;
        const arr = attr.array as Float32Array;
        for (let i = 0; i < s.baseT.length; i++) {
          const t = (s.baseT[i] + elapsed * s.speeds[i] * 0.12) % 1;
          s.curve.getPointAt(t, tmp);
          arr[i * 3] = tmp.x;
          arr[i * 3 + 1] = tmp.y;
          arr[i * 3 + 2] = tmp.z;
        }
        attr.needsUpdate = true;
      }

      // 设备：自转 + 呼吸光
      device.rotation.y += 0.012;
      device.rotation.x += 0.006;
      devGlow.scale.setScalar(0.62 + Math.sin(elapsed * 2.2) * 0.08);
      devGlowMat.opacity = 0.4 + 0.2 * (0.5 + 0.5 * Math.sin(elapsed * 2.2));

      // 前景浮尘上移
      const dattr = dustGeo.getAttribute('position') as THREE.BufferAttribute;
      const darr = dattr.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        let y = darr[i * 3 + 1] + 0.0025;
        if (y > 2.2) y = -2.2;
        darr[i * 3 + 1] = y;
      }
      dattr.needsUpdate = true;

      composer.render();
    };

    const start = () => {
      running = true;
      const tick = () => {
        if (!running) return;
        rafId = requestAnimationFrame(tick);
        renderFrame(clock.getElapsedTime());
      };
      tick();
    };

    if (reducedMotion) {
      // 静态帧：跑两帧让 bloom 稳定后停
      renderFrame(0);
      renderFrame(0.016);
      setReady(true);
    } else {
      start();
      setReady(true);
    }

    /* ── 标签页不可见时暂停，回来再继续 ── */
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!reducedMotion) {
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseout', onPointerLeave);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      scene.clear();
      for (const d of dispose) d.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
