#!/usr/bin/env python3
"""CDP QA для NORDE. Запуск: python3 scripts/qa-norde.py [--shot] [--rm] [--mobile]
Коды выхода: 0 — все ассерты зелёные и консоль чистая; 1 — есть красные.
NB: скриншот ch02-drift (внутри pinned-секции) в headless может содержать артефакт
растрирования (фикс-слой визуально обрезан) — баг захвата Chrome, не страницы;
корректность дрейфа гарантирует DOM-проверка «дрейф: пин покрывает вьюпорт…»."""
import json, subprocess, time, sys, base64, urllib.request, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates/ecommerce")
BASE = "http://localhost:8082"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CDP_PORT = 9336
SHOT = "--shot" in sys.argv
RM = "--rm" in sys.argv
MOBILE = "--mobile" in sys.argv
WIDTH = 390 if MOBILE else 1440

# зачистка осиротевших процессов прошлых прогонов (иначе CDP цепляется к старой вкладке)
subprocess.run(["pkill", "-f", "remote-debugging-port=9336"], capture_output=True)
subprocess.run(["pkill", "-f", "http.server 8082"], capture_output=True)
time.sleep(0.6)

server = subprocess.Popen([sys.executable, "-m", "http.server", "8082"], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = subprocess.Popen([CHROME, "--headless", "--hide-scrollbars",
    f"--remote-debugging-port={CDP_PORT}", "--remote-allow-origins=*",
    f"--window-size={WIDTH},900", "--no-first-run",
    "--user-data-dir=/tmp/cdp-profile-norde-qa", BASE + "/"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

errors, failures = [], []

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
            m = msg.get("method")
            if m == "Runtime.exceptionThrown":
                d = msg["params"]["exceptionDetails"]
                errors.append("EXC: " + str(d.get("text")) + " " + str((d.get("exception") or {}).get("description", ""))[:300])
            elif m == "Runtime.consoleAPICalled" and msg["params"]["type"] == "error":
                args = " ".join(str(a.get("value", a.get("description", "")))[:200] for a in msg["params"]["args"])
                errors.append("ERROR: " + args)

    def js(expr):
        r = cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        return (r.get("result") or {}).get("value")

    def check(name, expr, expect=True):
        got = js(expr)
        ok = (got == expect)
        print(("  PASS " if ok else "  FAIL ") + name + ("" if ok else f" (got: {got!r}, want: {expect!r})"))
        if not ok:
            failures.append(name)

    def shot_view(name):
        data = cmd("Page.captureScreenshot", {"format": "png"})["data"]
        out = f"/tmp/norde-qa-{name}.png"
        open(out, "wb").write(base64.b64decode(data))
        print("  shot:", out)

    cmd("Page.enable"); cmd("Runtime.enable"); cmd("Network.enable")
    cmd("Network.setCacheDisabled", {"cacheDisabled": True})  # профиль переиспользуется — без этого отдаёт устаревший HTML
    if RM:
        cmd("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
    cmd("Emulation.setDeviceMetricsOverride", {"width": WIDTH, "height": 900, "deviceScaleFactor": 1, "mobile": MOBILE})
    cmd("Page.navigate", {"url": BASE + "/"})
    time.sleep(7)  # шрифты + CDN + прелоадер

    CHECKS = json.load(open(os.path.join(ROOT, "scripts/qa-norde-checks.json")))

    def run_checks(checks):
        for c in checks:
            mode = c.get("mode")  # "rm" — только reduced-motion, "no-rm" — только обычный прогон
            if mode == "rm" and not RM:
                continue
            if mode == "no-rm" and RM:
                continue
            check(c["name"], c["js"], c.get("expect", True))

    run_checks([c for c in CHECKS if not c.get("end")])
    if SHOT:
        # сброс UI-состояния после функциональных проверок (drawer с актом, toast)
        js("document.querySelector('.drawer-close')?.click(); document.body.style.overflow=''")
        time.sleep(2.8)  # переждать toast (2.4s)
        # captureBeyondViewport ненадёжен в headless (дыры в растре) —
        # снимаем по вьюпорту, прокручивая к каждой главе и футеру.
        # Якорь вычисляем СВЕЖИМ перед каждым кадром: после загрузки GLB в ch03
        # меняются высоты и pin-спейсеры, заранее собранные координаты протухают.
        names = json.loads(js("""JSON.stringify(
          [...document.querySelectorAll('[data-chapter], .footer')].map(e =>
            'ch' + (e.dataset.chapter || 'footer')))""") or "[]")
        for n in names:
            if n == "chfooter":
                js("window.scrollTo(0, document.body.scrollHeight)")
            else:
                js(f"""(() => {{
                  const el = document.querySelector('[data-chapter="{n[2:]}"]');
                  if (el) window.scrollTo(0, Math.round(el.getBoundingClientRect().top + window.scrollY));
                }})()""")
            time.sleep(5 if n == "ch03" else 1.6)  # ch03: three.js + GLB по сети; остальным — догнать scrub
            pos = js("""JSON.stringify({y: Math.round(window.scrollY),
              at: (document.elementFromPoint(40, 130)?.closest('[data-chapter], .footer') || {}).dataset?.chapter || '?'})""")
            print(f"  pos {n}: {pos}")
            shot_view(n)
            if n == "ch02":  # кадр внутри pinned-дрейфа лукбука
                js("window.scrollTo(0, Math.round(window.scrollY + window.innerHeight * 1.5))")
                time.sleep(1.6)
                pos = js("""JSON.stringify({y: Math.round(window.scrollY),
                  at: (document.elementFromPoint(40, 130)?.closest('[data-chapter], .footer') || {}).dataset?.chapter || '?'})""")
                print(f"  pos ch02-drift: {pos}")
                shot_view("ch02-drift")
                # NB: в headless-снимке внутри пина возможен артефакт растрирования
                # (фикс-слой обрезан ниже ~середины) — это баг захвата кадра, не страницы.
                # Поэтому состояние дрейфа дополнительно верифицируем по DOM:
                if not RM:
                    ok = js("""(() => {
                      const sec = document.querySelector('[data-chapter="02"]');
                      const r = sec.getBoundingClientRect();
                      const pinned = getComputedStyle(sec).position === 'fixed';
                      const covers = r.top <= 1 && r.bottom >= window.innerHeight - 1;
                      const imgsOk = [...sec.querySelectorAll('.look img')].every(i => i.complete && i.naturalHeight > 0);
                      const moved = new DOMMatrixReadOnly(getComputedStyle(sec.querySelector('.lookbook-track')).transform).m41 < -50;
                      return !!(pinned && covers && imgsOk && moved);
                    })()""")
                    print(("  PASS " if ok else "  FAIL ") + "дрейф: пин покрывает вьюпорт, трек сдвинут, образы загружены (DOM-уровень)")
                    if not ok:
                        failures.append("ch02-drift-dom")
    ENDC = [c for c in CHECKS if c.get("end")]
    if ENDC:
        # прогон по странице, чтобы lazy-контент догрузился до end-чеков
        # (скролл через Lenis, если он активен — window.scrollTo Lenis перезапишет)
        js("""
          (async () => {
            const h = document.body.scrollHeight;
            for (let y = 0; y <= h; y += Math.round(innerHeight * 0.7)) {
              if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
              else window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 150));
            }
            if (window.__lenis) window.__lenis.scrollTo(h, { immediate: true });
            else window.scrollTo(0, h);
          })()
        """)
        time.sleep(3)
        run_checks(ENDC)
    if errors:
        print("CONSOLE ISSUES:")
        for e in dict.fromkeys(errors):
            print(" ", e)
        failures.append("console")
    ws.close()
finally:
    cleanup()
print("RESULT:", "FAIL" if failures else "PASS")
sys.exit(1 if failures else 0)
