#!/usr/bin/env python3
"""Спотчек LCP для NORDE (разовый, не часть QA-харнесса)."""
import json, subprocess, time, sys, urllib.request, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates/ecommerce")
BASE = "http://localhost:8083"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CDP_PORT = 9337

subprocess.run(["pkill", "-f", "remote-debugging-port=9337"], capture_output=True)
subprocess.run(["pkill", "-f", "http.server 8083"], capture_output=True)
time.sleep(0.6)

server = subprocess.Popen([sys.executable, "-m", "http.server", "8083"], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = subprocess.Popen([CHROME, "--headless", "--hide-scrollbars",
    f"--remote-debugging-port={CDP_PORT}", "--remote-allow-origins=*",
    "--window-size=1440,900", "--no-first-run",
    "--user-data-dir=/tmp/cdp-profile-norde-lcp", BASE + "/"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def cleanup(*_):
    proc.terminate(); server.terminate()

try:
    import websocket
    ws_url = None
    for _ in range(80):
        try:
            tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json"))
            pages = [t for t in tabs if t.get("type") == "page" and ":8083" in t.get("url", "")]
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

    cmd("Page.enable"); cmd("Runtime.enable"); cmd("Network.enable")
    cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    cmd("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
    cmd("Page.navigate", {"url": BASE + "/"})
    time.sleep(8)  # шрифты + CDN + прелоадер + hero-фото

    lcp = js("""
      new Promise(resolve => {
        let done = false;
        const po = new PerformanceObserver(list => {
          const e = list.getEntries();
          if (e.length && !done) { done = true; resolve(Math.round(e[e.length-1].startTime)); po.disconnect(); }
        });
        po.observe({type: 'largest-contentful-paint', buffered: true});
        setTimeout(() => { if (!done) { done = true; resolve(-1); } }, 4000);
      })
    """)
    print(f"LCP: {lcp} ms")
    print("RESULT:", "PASS" if isinstance(lcp, (int, float)) and 0 < lcp < 2500 else "FAIL")
finally:
    cleanup()
