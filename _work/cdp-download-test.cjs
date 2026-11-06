/* 下载按钮端到端验证：打开教程页 → 点击「下载 HTML」→ 检查落盘文件内容 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PAGE = process.argv[2] || 'http://127.0.0.1:3415/resources/basic';
const OUT_DIR = process.argv[3] || path.join(os.tmpdir(), 'ff-dl-' + Date.now());
const PORT = 9334;

fs.mkdirSync(OUT_DIR, { recursive: true });
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-dl-'));

const edge = spawn(
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--window-size=1440,1000', '--hide-scrollbars', '--force-device-scale-factor=1',
    PAGE,
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let page = null;
  for (let i = 0; i < 40 && !page; i++) {
    await sleep(400);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      page = list.find((t) => t.type === 'page' && t.url.includes('127.0.0.1'));
    } catch {}
  }
  if (!page) { console.error('CDP 未就绪'); edge.kill(); process.exit(1); }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.exceptionThrown') {
      console.log('PAGE EXCEPTION: ' + JSON.stringify(m.params.exceptionDetails).slice(0, 500));
    }
    if (m.method === 'Runtime.consoleAPICalled') {
      console.log('console.' + m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
    }
    if (m.method === 'Browser.downloadWillBegin') console.log('download begin: ' + m.params.suggestedFilename);
    if (m.method === 'Browser.downloadProgress') console.log('download progress: ' + m.params.state);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT_DIR, eventsEnabled: true });
  await sleep(2500);

  // 取按钮坐标，用真实鼠标事件点（脚本 click 不算用户手势，下载会被取消）
  const box = await send('Runtime.evaluate', {
    expression: `(() => {
      const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().includes('下载 HTML'));
      if (!b) return null;
      b.scrollIntoView({ block: 'center' });
      const r = b.getBoundingClientRect();
      return JSON.stringify({ x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) });
    })()`,
    returnByValue: true,
  });
  const raw = box.result?.result?.value;
  if (!raw) { console.error('BUTTON_NOT_FOUND'); ws.close(); edge.kill(); process.exit(1); }
  const { x, y } = JSON.parse(raw);
  console.log('button at ' + x + ',' + y);
  await sleep(400);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', pointerType: 'mouse' });
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, pointerType: 'mouse' });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, pointerType: 'mouse' });
  console.log('click: dispatched');

  await sleep(1800);

  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.html'));
  if (!files.length) { console.error('没有生成文件: ' + fs.readdirSync(OUT_DIR).join(',')); ws.close(); edge.kill(); process.exit(1); }

  const f = path.join(OUT_DIR, files[0]);
  const html = fs.readFileSync(f, 'utf8');
  const count = (re) => (html.match(re) || []).length;
  console.log('file: ' + files[0]);
  console.log('bytes: ' + Buffer.byteLength(html));
  console.log('h2: ' + count(/<h2>/g) + '  h3: ' + count(/<h3>/g) + '  pre: ' + count(/<pre class="code">/g));
  console.log('external refs: ' + count(/src="http|href="http(?!s:\/\/fluent)/g));
  console.log('has doctype: ' + /^<!DOCTYPE html>/.test(html.trim()));
  console.log('script tags: ' + count(/<script/g));
  console.log('universal_ble in export: ' + (html.includes('universal_ble') ? 'yes' : 'no'));
  console.log('head: ' + html.slice(0, 120).replace(/\n/g, ' '));

  ws.close(); edge.kill(); process.exit(0);
})().catch((e) => { console.error('ERR ' + e.message); edge.kill(); process.exit(1); });
