'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackdrop —— 装饰性 3D 背景（/about 展厅页专用）
 *
 * 内容：
 *   - 外层：IcosahedronGeometry(1.55, 1) 的线框（EdgesGeometry + LineSegments）
 *   - 内层：IcosahedronGeometry(1.05, 0) 半透明实体
 *   - 星场：约 1000 个粒子的 Points，缓慢上移循环
 *
 * 行为：
 *   - 外层线框缓慢自转 + 呼吸缩放；相机随指针做视差（lerp 平滑）
 *   - prefers-reduced-motion 时只渲染一帧静态画面
 *   - WebGL 创建失败时静默降级（不渲染 canvas，父级 CSS 渐变兜底）
 *   - 卸载时完整清理（rAF / 监听 / dispose），StrictMode 下不泄漏
 */
export default function ThreeBackdrop({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // 尊重系统减少动态偏好：只画一帧静态画面
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // ── WebGL 环境与渲染器：失败则静默降级 ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      return; // canvas 保持不显示，父级 CSS 渐变兜底
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const disposables: Array<{ dispose: () => void }> = [];

    // ── 外层线框（品牌青）──
    const outerGeo = new THREE.IcosahedronGeometry(1.55, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const wireframe = new THREE.LineSegments(outerEdges, outerMat);
    scene.add(wireframe);
    disposables.push(outerGeo, outerEdges, outerMat);

    // ── 内层半透明实体（淡紫）──
    const innerGeo = new THREE.IcosahedronGeometry(1.05, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });
    const core = new THREE.Mesh(innerGeo, innerMat);
    scene.add(core);
    disposables.push(innerGeo, innerMat);

    // ── 星场粒子（青紫混合）──
    const COUNT = 1000;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // 铺满一个包围盒，稍后缓慢上移并在超出后循环回底部
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.012,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    // ── 尺寸自适应 ──
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ── 指针视差 ──
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      // mousemove 与 touchmove 各自取代表坐标（触摸取第一个触点）
      const cx =
        'clientX' in e ? e.clientX : (e.touches[0]?.clientX ?? 0);
      const cy =
        'clientY' in e ? e.clientY : (e.touches[0]?.clientY ?? 0);
      target.x = (cx / window.innerWidth) * 2 - 1;
      target.y = (cy / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseout', onPointerLeave);
    // document 上的 mouseleave 不会触发（document 不产生 enter/leave 事件），
    // 必须挂在 documentElement 上才能真正感知指针离开页面
    document.documentElement.addEventListener('mouseleave', onPointerLeave);

    // ── 动画循环 ──
    let rafId = 0;
    const clock = new THREE.Clock();

    const renderFrame = (t: number) => {
      // 相机视差（lerp 平滑）
      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;
      camera.position.x = pointer.x * 0.5;
      camera.position.y = -pointer.y * 0.35;
      camera.lookAt(0, 0, 0);

      // 外层线框：缓慢自转 + 呼吸缩放
      wireframe.rotation.y += 0.0015;
      wireframe.rotation.x = Math.sin(t * 0.0002) * 0.12;
      const breath = 1 + Math.sin(t * 0.0012) * 0.03;
      wireframe.scale.setScalar(breath);

      // 内层实体：反向慢转，弱化层次对比
      core.rotation.y -= 0.0008;

      // 粒子缓慢上移，超出顶部后循环回底部
      const pos = starGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        let y = arr[i * 3 + 1] + 0.0035;
        if (y > 5) y = -5;
        arr[i * 3 + 1] = y;
      }
      pos.needsUpdate = true;
    };

    if (reducedMotion) {
      // 只渲染一帧静态画面
      renderFrame(0);
      renderer.render(scene, camera);
    } else {
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        renderFrame(clock.getElapsedTime() * 1000);
        renderer.render(scene, camera);
      };
      tick();
    }

    // ── 清理 ──
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseout', onPointerLeave);
      document.documentElement.removeEventListener(
        'mouseleave',
        onPointerLeave
      );
      scene.remove(wireframe, core, stars);
      for (const d of disposables) d.dispose();
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
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
