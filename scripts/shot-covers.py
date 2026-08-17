#!/usr/bin/env python3
"""Обложки кейсов 1600x900: python3 scripts/shot-covers.py [slug ...]"""
import json, subprocess, time, sys, urllib.request, base64, os

ROOT = "/Users/emirsemenov/Desktop/portfolio"
SLUGS = sys.argv[1:] or ["atlas", "form", "volt", "ai"]
BASE = "http://localhost:8646"
CDP = 9350
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

subprocess.run(["pkill", "-f", f"remote-debugging-port={CDP}"], capture_output=True)
subprocess.run(["pkill", "-f", "http.server 8646"], capture_output=True)
time.sleep(0.6)
server = subprocess.Popen([sys.executable, "-m", "http.server", "8646"],
    cwd=os.path.join(ROOT, "templates"), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = None
try:
    import websocket
    for slug in SLUGS:
        out = os.path.join(ROOT, f"public/images/works/{slug}-cover.png")
        proc = subprocess.Popen([CHROME, "--headless", "--hide-scrollbars",
            f"--remote-debugging-port={CDP}", "--remote-allow-origins=*",
            "--window-size=1600,900", "--force-device-scale-factor=1", "--no-first-run",
            "--user-data-dir=/tmp/cdp-profile-covers", f"{BASE}/{slug}/index.html"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        ws_url = None
        for _ in range(80):
            try:
                tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{CDP}/json"))
                pages = [t for t in tabs if t.get("type") == "page" and f"/{slug}/" in t.get("url", "")]
                if pages:
                    ws_url = pages[0]["webSocketDebuggerUrl"]; break
            except Exception:
                pass
            time.sleep(0.25)
        if not ws_url:
            print(f"FATAL {slug}: no tab"); continue
        ws = websocket.create_connection(ws_url, timeout=60)
        mid = 0
        def cmd(method, params=None):
            global mid
            mid += 1
            ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
            while True:
                msg = json.loads(ws.recv())
                if msg.get("id") == mid:
                    return msg.get("result", {})
        cmd("Page.enable"); cmd("Network.enable"); cmd("Network.setCacheDisabled", {"cacheDisabled": True})
        cmd("Emulation.setDeviceMetricsOverride", {"width": 1600, "height": 900, "deviceScaleFactor": 1, "mobile": False})
        time.sleep(3.2)  # шрифты + анимации hero
        data = cmd("Page.captureScreenshot", {"format": "png"}).get("data")
        open(out, "wb").write(base64.b64decode(data))
        from PIL import Image
        im = Image.open(out)
        # проверка, что не пустой/не чёрный квадрат
        g = im.convert("L").resize((80, 45))
        px = list(g.getdata()); mean = sum(px) / len(px)
        std = (sum((x - mean) ** 2 for x in px) / len(px)) ** 0.5
        print(f"cover {slug}: {out} {im.size} mean={mean:.0f} std={std:.0f}")
        ws.close()
        proc.terminate(); proc = None
        time.sleep(0.5)
finally:
    if proc: proc.terminate()
    server.terminate()
