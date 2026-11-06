/* CDP 截图：启动有头 Edge（真实 GPU）加载指定 URL，等 N 秒后 Page.captureScreenshot */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const URL_ = process.argv[2] || 'http://127.0.0.1:3415/about';
const OUT = process.argv[3] || path.join(__dirname, 'shots', 'cdp-shot.png');
const WAIT_MS = Number(process.argv[4] || 6000);
const GEOM = process.argv[5] || '1440,900';
const PORT = 9333;

const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-'));
const edge = spawn(
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--window-size=' + GEOM, '--window-position=0,0',
    '--hide-scrollbars', '--force-device-scale-factor=1',
    URL_,
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // 等调试端口就绪
  let targets = null;
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      targets = await res.json();
      const page = targets.find((t) => t.type === 'page' && !/^(edge|about|devtools)/.test(t.url));
      if (page) break;
    } catch { /* 端口未就绪 */ }
  }
  if (!targets) { console.error('CDP 端口未就绪'); edge.kill(); process.exit(1); }
  const page = targets.find((t) => t.type === 'page' && !/^(edge|about|devtools)/.test(t.url));
  if (!page) { console.error('未找到页面 target'); edge.kill(); process.exit(1); }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

  await send('Page.enable');
  await sleep(WAIT_MS); // 给动画 / 淡入留真实时间

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot.result && shot.result.data) {
    fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
    console.log('saved: ' + OUT + ' (' + shot.result.data.length + ' b64 chars)');
  } else {
    console.error('captureScreenshot 失败: ' + JSON.stringify(shot).slice(0, 300));
  }

  // 顺便抓控制台错误 + canvas 像素采样
  const probe = await send('Runtime.evaluate', {
    expression: `(() => {
      const c = document.querySelector('canvas');
      if (!c) return 'no canvas';
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) return 'no gl handle';
      const w = c.width, h = c.height;
      const px = new Uint8Array(4 * 100);
      // 读中心区域 10x10
      gl.readPixels(Math.floor(w/2)-5, Math.floor(h/2)-5, 10, 10, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let sum = [0,0,0,0];
      for (let i = 0; i < 100; i++) { sum[0]+=px[i*4]; sum[1]+=px[i*4+1]; sum[2]+=px[i*4+2]; sum[3]+=px[i*4+3]; }
      return JSON.stringify({ w, h, dpr: window.devicePixelRatio, center: sum.map(v => Math.round(v/100)) });
    })()`,
    returnByValue: true,
  });
  console.log('probe: ' + JSON.stringify(probe.result?.result?.value));

  ws.close();
  edge.kill();
  process.exit(0);
})().catch((e) => { console.error('ERR: ' + e.message); edge.kill(); process.exit(1); });
