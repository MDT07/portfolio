#!/usr/bin/env python3
"""Зонд NORDE: (1) регрессия «бесконечного зума» — фото инвентарного листа
обязано оставаться статичным при наведении (transform: none во всех сэмплах),
(2) кто владеет transform у фото листа и плавающего preview,
(3-5) замер FPS и long tasks при скролле по всей странице. Не часть QA-сьюта."""
import json, subprocess, time, sys, urllib.request, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates/ecommerce")
BASE = "http://localhost:8082"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CDP_PORT = 9336

subprocess.run(["pkill", "-f", "remote-debugging-port=9336"], capture_output=True)
subprocess.run(["pkill", "-f", "http.server 8082"], capture_output=True)
time.sleep(0.6)

server = subprocess.Popen([sys.executable, "-m", "http.server", "8082"], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = subprocess.Popen([CHROME, "--headless", "--hide-scrollbars",
    f"--remote-debugging-port={CDP_PORT}", "--remote-allow-origins=*",
    "--window-size=1440,900", "--no-first-run",
    "--user-data-dir=/tmp/cdp-profile-norde-qa", BASE + "/"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def cleanup(*_):
    proc.terminate(); server.terminate()

try:
    import websocket
    ws_url = None
    for _ in range(80):
        try:
            tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json"))
            pages = [t for t in tabs if t.get("type") == "page" and ":8082" in t.get("url", "")]
            if pages:
                ws_url = pages[0]["webSocketDebuggerUrl"]; break
        except Exception:
            pass
        time.sleep(0.25)
    if not ws_url:
        print("FATAL: no CDP tab"); cleanup(); sys.exit(1)
    ws = websocket.create_connection(ws_url, timeout=90)
    mid = 0
    def cmd(method, params=None):
        global mid
        mid += 1
        ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == mid:
                return msg.get("result", {})
    def js(expr):
        r = cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        return (r.get("result") or {}).get("value")

    cmd("Page.enable"); cmd("Runtime.enable")
    cmd("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
    cmd("Page.navigate", {"url": BASE + "/"})
    time.sleep(7)

    print("=== ЗОНД 1: фото листа статично при наведении (анти-зум регрессия) ===")
    js("""(() => { const el = document.querySelector('[data-chapter="04"]');
      if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true }); else el.scrollIntoView(); })()""")
    time.sleep(1.5)
    js("document.querySelector('.ledger-row').click()")  # раскрыть первый лист
    time.sleep(1.2)
    rect = json.loads(js("JSON.stringify(document.querySelector('.ledger-sheet.open .sheet-media img').getBoundingClientRect())"))
    cx, cy = rect["x"] + rect["width"] / 2, rect["y"] + min(rect["height"] / 2, 400)
    cmd("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": cx, "y": cy})
    time.sleep(0.3)
    cmd("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": cx + 2, "y": cy + 2})
    samples = js("""(async () => {
      const img = document.querySelector('.ledger-sheet.open .sheet-media img');
      const out = [];
      for (let i = 0; i < 14; i++) {
        out.push(getComputedStyle(img).transform + ' | inline: ' + img.style.transform);
        await new Promise(r => setTimeout(r, 220));
      }
      return out;
    })()""")
    for s in (samples or []):
        print(" ", s)
    bad = [s for s in (samples or []) if not s.startswith('none')]
    print("  STATIC:", "OK — transform ни разу не менялся" if not bad else f"FAIL — {len(bad)} сэмплов с transform")

    print("=== ЗОНД 2: hover-цепочка (кто владеет transform) ===")
    print(js("""(() => {
      const img = document.querySelector('.ledger-sheet.open .sheet-media img');
      const prev = document.querySelector('.ledger-preview');
      const pack = el => el ? {transform: getComputedStyle(el).transform, transition: getComputedStyle(el).transition,
        willChange: getComputedStyle(el).willChange, gsap: !!el._gsap, gsapScale: el._gsap ? el._gsap.scaleX : null} : null;
      return JSON.stringify({ sheetImg: pack(img), cursorPreview: pack(prev) });
    })()"""))

    print("=== ЗОНД 3: FPS при скролле ===")
    fps = js("""(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const go = y => { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y); };
      const h = document.body.scrollHeight - innerHeight;
      const frames = [];
      let last = performance.now(), run = true;
      const tick = t => { frames.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      for (let y = 0; y <= h; y += Math.round(innerHeight * 0.5)) { go(y); await wait(160); }
      run = false;
      const clean = frames.filter(d => d > 0 && d < 250);
      const avg = clean.reduce((a, b) => a + b, 0) / clean.length;
      const worst = clean.slice().sort((a, b) => b - a).slice(0, 12).map(d => Math.round(d));
      const over33 = clean.filter(d => d > 33.4).length;
      const over17 = clean.filter(d => d > 17.5).length;
      return { frames: clean.length, avgMs: +avg.toFixed(1), fps: +(1000 / avg).toFixed(1),
               over17pct: +(over17 / clean.length * 100).toFixed(1),
               over33pct: +(over33 / clean.length * 100).toFixed(1), worst };
    })()""")
    print(" ", fps)

    print("=== ЗОНД 4: FPS при НЕПРЕРЫВНОМ скролле (wheel) ===")
    # непрерывный колёсный скролл вниз через пины, затем вверх — худший случай
    fps2 = js("""(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      window.__frames = [];
      let last = performance.now(), run = true;
      const tick = t => { window.__frames.push(t - last); last = t; if (run) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      window.__stopFrames = () => { run = false; };
      return 'armed';
    })()""")
    h = js("document.body.scrollHeight - innerHeight")
    steps = int(h // 120)
    for i in range(steps):
        cmd("Input.dispatchMouseEvent", {"type": "mouseWheel", "x": 720, "y": 450,
                                         "deltaX": 0, "deltaY": 120})
        if i % 10 == 0:
            time.sleep(0.02)
    time.sleep(1.2)
    res2 = js("""(() => {
      window.__stopFrames();
      const clean = window.__frames.filter(d => d > 0 && d < 250);
      const avg = clean.reduce((a, b) => a + b, 0) / clean.length;
      const worst = clean.slice().sort((a, b) => b - a).slice(0, 12).map(d => Math.round(d));
      return { frames: clean.length, avgMs: +avg.toFixed(1), fps: +(1000 / avg).toFixed(1),
               over17pct: +(clean.filter(d => d > 17.5).length / clean.length * 100).toFixed(1),
               over33pct: +(clean.filter(d => d > 33.4).length / clean.length * 100).toFixed(1), worst };
    })()""")
    print(" ", res2)

    print("=== ЗОНД 5: long tasks при непрерывном скролле (реальный джанк) ===")
    js("""(() => {
      window.__longtasks = 0; window.__longest = 0;
      window.__po = new PerformanceObserver(list => {
        for (const e of list.getEntries()) { window.__longtasks++; window.__longest = Math.max(window.__longest, e.duration); }
      });
      window.__po.observe({ entryTypes: ['longtask'] });
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      return 'armed';
    })()""")
    time.sleep(1.5)
    for i in range(steps):
        cmd("Input.dispatchMouseEvent", {"type": "mouseWheel", "x": 720, "y": 450,
                                         "deltaX": 0, "deltaY": 120})
        if i % 10 == 0:
            time.sleep(0.02)
    time.sleep(1.5)
    print(" ", js("({ longtasks: window.__longtasks, longestMs: Math.round(window.__longest) })"))

    ws.close()
finally:
    cleanup()
print("PROBE DONE")
