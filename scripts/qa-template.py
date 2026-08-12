#!/usr/bin/env python3
"""CDP-QA для статических шаблонов portfolio (atlas/form/volt/ai).
Запуск: python3 scripts/qa-template.py <name> [--mobile] [--shot]
Сервер: python3 -m http.server 8642 --directory templates (ожидается живым).
"""
import json, os, subprocess, sys, time, urllib.request, base64, socket, struct

PORT = 9223
HTTP_PORT = 8642
NAME = sys.argv[1]
MOBILE = "--mobile" in sys.argv
DO_SHOTS = "--shot" in sys.argv
W, H = (390, 844) if MOBILE else (1440, 900)
OUT = f"/tmp/tpl-shots/{NAME}"
os.makedirs(OUT, exist_ok=True)

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates")
server = subprocess.Popen([sys.executable, "-m", "http.server", str(HTTP_PORT)], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
proc = subprocess.Popen([CHROME, f"--remote-debugging-port={PORT}", "--headless=new",
    f"--window-size={W},{H}", "--hide-scrollbars", "--mute-audio",
    "--user-data-dir=/tmp/cdp-tpl-profile", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def wait_ws():
    for _ in range(60):
        try:
            with urllib.request.urlopen(f"http://localhost:{PORT}/json") as r:
                tabs = json.load(r)
            for t in tabs:
                if t.get("type") == "page":
                    return t["webSocketDebuggerUrl"]
        except Exception:
            pass
        time.sleep(0.25)
    raise SystemExit("chrome not up")

class WS:
    def __init__(self, url):
        host, rest = url[5:].split("/", 1)
        h, p = host.split(":")
        self.sock = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        req = (f"GET /{rest} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\n"
               f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n")
        self.sock.sendall(req.encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.mid = 0
        self.console = []
    def _recv_exact(self, n):
        d = b""
        while len(d) < n:
            c = self.sock.recv(n - len(d))
            if not c: raise ConnectionError("closed")
            d += c
        return d
    def _read_frame(self):
        while True:
            hdr = self._recv_exact(2)
            b1, b2 = hdr[0], hdr[1]
            op = b1 & 0x0F
            ln = b2 & 0x7F
            if ln == 126: ln = struct.unpack(">H", self._recv_exact(2))[0]
            elif ln == 127: ln = struct.unpack(">Q", self._recv_exact(8))[0]
            mask = b2 & 0x80
            mk = self._recv_exact(4) if mask else b"\x00"*4
            payload = bytearray(self._recv_exact(ln))
            for i in range(ln): payload[i] ^= mk[i % 4]
            if op == 1:
                return json.loads(bytes(payload))
            if op == 9:
                self._send(0xA, bytes(payload))
            if op == 8:
                raise ConnectionError("ws closed")
    def _send(self, op, payload):
        hdr = bytearray([0x80 | op])
        ln = len(payload)
        mask_bit = 0x80
        if ln < 126: hdr.append(mask_bit | ln)
        elif ln < 65536: hdr.append(mask_bit | 126); hdr += struct.pack(">H", ln)
        else: hdr.append(mask_bit | 127); hdr += struct.pack(">Q", ln)
        mk = os.urandom(4)
        hdr += mk
        enc = bytearray(payload)
        for i in range(ln): enc[i] ^= mk[i % 4]
        self.sock.sendall(bytes(hdr) + bytes(enc))
    def cmd(self, method, params=None):
        self.mid += 1
        mid = self.mid
        self._send(1, json.dumps({"id": mid, "method": method, "params": params or {}}).encode())
        while True:
            msg = self._read_frame()
            if msg.get("method") == "Runtime.exceptionThrown":
                d = msg["params"]["exceptionDetails"]
                self.console.append("EXC: " + str(d.get("text")) + " " + str((d.get("exception") or {}).get("description", ""))[:200])
            if msg.get("method") == "Runtime.consoleAPICalled" and msg["params"]["type"] in ("error",):
                args = " ".join(str(a.get("value", a.get("description", "")))[:150] for a in msg["params"]["args"])
                self.console.append("ERR: " + args)
            if msg.get("id") == mid:
                return msg.get("result", {})
    def js(self, expr):
        r = self.cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        if "exceptionDetails" in r:
            return "JSEXC: " + str(r["exceptionDetails"].get("text")) + " " + str((r["exceptionDetails"].get("exception") or {}).get("description", ""))[:300]
        return r.get("result", {}).get("value")
    def shot(self, name):
        r = self.cmd("Page.captureScreenshot", {"format": "png"})
        p = f"{OUT}/{name}.png"
        with open(p, "wb") as f: f.write(base64.b64decode(r["data"]))
        print(f"  SHOT {p}")

# ---------- per-template asserts ----------
ASSERTS = {
 "atlas": [
   ("boot: logo", "!!document.querySelector('.logo')"),
   ("boot: hero title", "document.querySelector('.hero-title') && document.querySelector('.hero-title').textContent.length > 10"),
   ("boot: 6 expedition cards", "document.querySelectorAll('.exp-card').length", 6),
   ("boot: guides = 4", "document.querySelectorAll('.g-card').length", 4),
   ("boot: journal cards = 5", "document.querySelectorAll('.j-card').length", 5),
   ("boot: faq items = 5", "document.querySelectorAll('.faq-item').length", 5),
   ("boot: counters present", "document.querySelectorAll('.cv').length", 4),
   ("boot: fonts Playfair", "getComputedStyle(document.querySelector('.hero-title')).fontFamily.includes('Playfair')"),
   ("boot: no h-overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1"),
   ("filter: desert shows 1 card", "(async()=>{document.querySelector('[data-f=\"desert\"]').click();await new Promise(r=>setTimeout(r,150));const n=document.querySelectorAll('.exp-card').length;document.querySelector('[data-f=\"all\"]').click();await new Promise(r=>setTimeout(r,150));return n===1})()"),
   ("modal: expedition opens", "(async()=>{document.querySelector('.exp-card').click();await new Promise(r=>setTimeout(r,250));const ok=document.querySelector('.modal.open') && document.querySelector('.m-title');const x=document.querySelector('[data-close]');if(x)x.click();await new Promise(r=>setTimeout(r,200));return !!ok})()"),
   ("modal: esc closes", "(async()=>{document.querySelector('.exp-card').click();await new Promise(r=>setTimeout(r,200));document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await new Promise(r=>setTimeout(r,250));return !document.querySelector('.modal.open')})()"),
   ("form: validation blocks empty", "(async()=>{document.querySelector('header [data-book]').click();await new Promise(r=>setTimeout(r,250));document.querySelector('#bookForm button[type=submit]').click();await new Promise(r=>setTimeout(r,120));const errs=document.querySelectorAll('.input.err').length;const stillOpen=!!document.querySelector('.modal.open');document.querySelector('#ovl').click();await new Promise(r=>setTimeout(r,150));return errs>=2 && stillOpen})()"),
   ("form: valid submit shows success", "(async()=>{document.querySelector('header [data-book]').click();await new Promise(r=>setTimeout(r,250));document.querySelector('#bf-name').value='Тест';document.querySelector('#bf-contact').value='+79990001122';document.querySelector('#bookForm button[type=submit]').click();await new Promise(r=>setTimeout(r,300));const ok=!!document.querySelector('.success');document.querySelector('#ovl').click();return ok})()"),
   ("faq: accordion opens", "(async()=>{const q=document.querySelector('.faq-q');q.click();await new Promise(r=>setTimeout(r,450));const open=document.querySelector('.faq-item.open');const h=open && open.querySelector('.faq-a').style.maxHeight;return !!open && h && h!=='0px'})()"),
   ("counter: animates on view", "(async()=>{const c=document.querySelector('.cv');c.scrollIntoView();await new Promise(r=>setTimeout(r,1600));return parseInt(c.textContent)>0})()"),
 ],
 "form": [
   ("boot: logo", "document.querySelector('.logo').textContent.includes('FORM')"),
   ("boot: display font Outfit", "getComputedStyle(document.querySelector('h1')).fontFamily.includes('Outfit')"),
   ("boot: hero section plane", "!!document.querySelector('#sectionPlane')"),
   ("boot: dimension lines", "document.querySelectorAll('.dim').length >= 3"),
   ("boot: material strip = 5", "document.querySelectorAll('.mat-cell').length", 5),
   ("boot: project bands = 3", "document.querySelectorAll('.band').length", 3),
   ("boot: services = 4", "document.querySelectorAll('.service').length", 4),
   ("boot: contact form", "!!document.querySelector('#contactForm')"),
   ("boot: no h-overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1"),
   ("reduced motion", "!!document.querySelector('style')?.textContent?.includes('prefers-reduced-motion')"),
   ("dim: draws on scroll", "(async()=>{const d=document.querySelector('.dim');d.scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,900));return d.classList.contains('is-drawn')})()"),
   ("form: submit success", "(async()=>{document.querySelector('#name').value='Тест';document.querySelector('#email').value='test@example.com';document.querySelector('#message').value='Сообщение';document.querySelector('#contactForm button[type=submit]').click();await new Promise(r=>setTimeout(r,300));return document.querySelector('#contactForm button[type=submit]').textContent.includes('Отправлено')})()"),
 ],
 "volt": [
   ("boot: logo", "document.querySelector('.logo').textContent.includes('VOLT')"),
   ("boot: display font Chakra Petch", "getComputedStyle(document.querySelector('h1')).fontFamily.includes('Chakra Petch')"),
   ("boot: particle canvas", "!!document.querySelector('#particleCanvas')"),
   ("boot: liquid level", "!!document.querySelector('#liquidLevel')"),
   ("boot: stats = 4", "document.querySelectorAll('.stat').length", 4),
   ("boot: stations = 6", "document.querySelectorAll('.station-card').length", 6),
   ("boot: tariffs = 3", "document.querySelectorAll('.tariff').length", 3),
   ("boot: faq = 4", "document.querySelectorAll('.faq-item').length", 4),
   ("boot: fleet form", "!!document.querySelector('#fleetForm')"),
   ("boot: no h-overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1"),
   ("reduced motion", "!!document.querySelector('style')?.textContent?.includes('prefers-reduced-motion')"),
   ("calc: slider recomputes", "(async()=>{const km=document.querySelector('#km');const before=document.querySelector('#savings').textContent;km.value=5000;km.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,300));const after=document.querySelector('#savings').textContent;return before!==after && after!=='0 ₽'})()"),
   ("faq: accordion opens", "(async()=>{document.querySelector('.faq-q').click();await new Promise(r=>setTimeout(r,450));const it=document.querySelector('.faq-item.is-open');return !!it})()"),
   ("form: validation + success", "(async()=>{document.querySelector('#fleetForm button[type=submit]').click();await new Promise(r=>setTimeout(r,120));const anyErr=[...document.querySelectorAll('#fleetForm input, #fleetForm select')].some(i=>!i.value);if(!anyErr)return 'no-err';document.querySelector('#fleetName').value='Тест';document.querySelector('#fleetCompany').value='ООО Тест';document.querySelector('#fleetEmail').value='fleet@test.ru';document.querySelector('#fleetCount').value='5-10';document.querySelector('#fleetForm button[type=submit]').click();await new Promise(r=>setTimeout(r,200));return document.querySelector('#fleetForm button[type=submit]').textContent.includes('отправлен')})()"),
 ],
 "norde": [
   ("boot: logo", "document.querySelector('.logo').textContent.includes('NORDE')"),
   ("boot: display font Cormorant Garamond", "getComputedStyle(document.querySelector('h1')).fontFamily.includes('Cormorant Garamond')"),
   ("boot: specimen card", "!!document.querySelector('.specimen-card')"),
   ("boot: provenance map", "!!document.querySelector('#map')"),
   ("boot: passport cards = 4", "document.querySelectorAll('.passport-card').length", 4),
   ("boot: ledger rows = 8", "document.querySelectorAll('.ledger-row').length", 8),
   ("boot: journal cards = 3", "document.querySelectorAll('.journal-card').length", 3),
   ("boot: cart drawer", "!!document.querySelector('#drawer')"),
   ("boot: no h-overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1"),
   ("reduced motion", "!!document.querySelector('style')?.textContent?.includes('prefers-reduced-motion')"),
   ("ledger: accordion opens", "(async()=>{const row=document.querySelector('.ledger-row');row.querySelector('.ledger-summary').click();await new Promise(r=>setTimeout(r,600));return row.classList.contains('is-open')})()"),
   ("cart: add from hero", "(async()=>{const before=document.querySelector('#cartCount').textContent;document.querySelector('#heroAdd').click();await new Promise(r=>setTimeout(r,400));const count=document.querySelector('#cartCount').textContent;return +count > +before})()"),
   ("cart: drawer opens + close", "(async()=>{document.querySelector('#heroAdd').click();await new Promise(r=>setTimeout(r,400));const open=document.querySelector('#drawer').classList.contains('is-open');document.querySelector('[data-close-drawer]').click();await new Promise(r=>setTimeout(r,400));const closed=!document.querySelector('#drawer').classList.contains('is-open');return open && closed})()"),
   ("club: form success", "(async()=>{const inp=document.querySelector('#clubForm input');inp.value='test@example.com';document.querySelector('#clubForm button[type=submit]').click();await new Promise(r=>setTimeout(r,300));return document.querySelector('#clubForm button[type=submit]').textContent.includes('Подписано')})()"),
 ],
 "ai": [
   ("boot: logo", "document.querySelector('.logo').textContent.includes('AI WORKS')"),
   ("boot: display font Manrope", "getComputedStyle(document.querySelector('h1.hero-title')).fontFamily.includes('Manrope')"),
   ("boot: core chips = 6", "document.querySelectorAll('#coreRow .core-chip').length", 6),
   ("boot: hero counters = 4", "document.querySelectorAll('.hero-meta .v').length", 4),
   ("boot: chat greeting present", "document.querySelectorAll('#chatBody .msg.bot').length >= 1"),
   ("boot: cases = 6", "document.querySelectorAll('.case').length", 6),
   ("boot: core rows = 6", "document.querySelectorAll('.core-row-i').length", 6),
   ("boot: picker opts = 4", "document.querySelectorAll('.pk-opt').length", 4),
   ("boot: steps = 4", "document.querySelectorAll('.step').length", 4),
   ("boot: pricing = 3", "document.querySelectorAll('.pr').length", 3),
   ("boot: faq = 5", "document.querySelectorAll('.faq-item').length", 5),
   ("boot: pipeline runner", "!!document.querySelector('.pipe-runner animateMotion')"),
   ("boot: no h-overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1"),
   ("core: switch recolors page", "(async()=>{document.querySelector('[data-core=\"gemini\"]').click();await new Promise(r=>setTimeout(r,200));const acc=document.documentElement.style.getPropertyValue('--acc');const meta=document.querySelector('#chatMeta').textContent;return acc==='#4285F4' && meta.includes('Gemini')})()"),
   ("chat: suggest gets bot reply", "(async()=>{const n0=document.querySelectorAll('.msg.bot').length;document.querySelector('#suggests .sugg').click();await new Promise(r=>setTimeout(r,5200));const n1=document.querySelectorAll('.msg.bot').length;return n1>n0})()"),
   ("chat: input send works", "(async()=>{const n0=document.querySelectorAll('.msg').length;const inp=document.querySelector('#chatInput');inp.value='какие цены?';document.querySelector('#chatSend').click();await new Promise(r=>setTimeout(r,6000));const bots=Array.from(document.querySelectorAll('.msg.bot'));const last=bots[bots.length-1];return document.querySelectorAll('.msg').length>n0 && last && last.textContent.includes('190')})()"),
   ("chat: channel skin tg", "(async()=>{document.querySelector('#pick-chan [data-k=\"tg\"]').click();await new Promise(r=>setTimeout(r,150));const ok=document.querySelector('#chatShell').classList.contains('ch-tg') && document.querySelector('#chatName').textContent.includes('bot');document.querySelector('#pick-chan [data-k=\"web\"]').click();return ok})()"),
   ("picker: privacy rec llama", "(async()=>{document.querySelector('[data-k=\"privacy\"]').click();await new Promise(r=>setTimeout(r,150));return document.querySelector('#pkRes').textContent.includes('Llama') && !!document.querySelector('.core-row-i.rec')})()"),
   ("counter: hero animates", "(async()=>{const v=document.querySelector('.hero-meta .v');v.scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,1700));return parseFloat(v.textContent)>0})()"),
   ("faq: accordion opens", "(async()=>{document.querySelector('.faq-q').click();await new Promise(r=>setTimeout(r,450));const it=document.querySelector('.faq-item.open');return !!it && it.querySelector('.faq-a').style.maxHeight!=='0px'})()"),
   ("cta: validation + success", "(async()=>{const inp=document.querySelector('#ctaInput');inp.value='bad';document.querySelector('#ctaForm button').click();await new Promise(r=>setTimeout(r,120));if(!inp.classList.contains('err'))return 'no-err';inp.value='@founder';document.querySelector('#ctaForm button').click();await new Promise(r=>setTimeout(r,200));return !!document.querySelector('.cta-ok')})()"),
 ],
}

try:
    ws = WS(wait_ws())
    ws.cmd("Runtime.enable"); ws.cmd("Page.enable")
    ws.cmd("Network.enable"); ws.cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    url = f"http://localhost:{HTTP_PORT}/{NAME}/index.html?v={int(time.time())}"
    ws.cmd("Page.navigate", {"url": url})
    time.sleep(3.0)
    print(f"== QA {NAME.upper()} ({'MOBILE 390' if MOBILE else 'DESKTOP 1440'}) ==")
    fails = []
    def check(label, expr, expect=True):
        v = ws.js(expr)
        ok = (v == expect)
        if not ok: fails.append(f"{label} (got: {v!r}, want: {expect!r})")
        print(("  PASS " if ok else "  FAIL ") + label + ("" if ok else f"  -> {v!r}"))
    for a in ASSERTS.get(NAME, []):
        check(*a)
    if any("h-overflow" in f for f in fails):
        wide = ws.js("Array.from(document.querySelectorAll('body *')).filter(e=>{const r=e.getBoundingClientRect();if(r.right<=window.innerWidth+1||r.width<=4)return false;let p=e.parentElement;while(p){const o=getComputedStyle(p).overflowX;if(o!=='visible')return false;p=p.parentElement}return true}).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,6).map(e=>e.tagName+'.'+String(e.className).split(' ')[0]+' right='+Math.round(e.getBoundingClientRect().right)+' w='+Math.round(e.getBoundingClientRect().width))")
        print("  DEBUG widest:", wide)
        dims = ws.js("JSON.stringify({iw:window.innerWidth,sw:document.documentElement.scrollWidth,bsw:document.body.scrollWidth,bw:document.body.getBoundingClientRect().width,mq:document.querySelector('.marquee')?document.querySelector('.marquee').scrollWidth:0,pv:(()=>{const p=document.querySelector('.preview');return p?p.getBoundingClientRect().right:0})()})")
        print("  DEBUG dims:", dims)
        bis = ws.js("(()=>{const out=[];const base=document.documentElement.scrollWidth;Array.from(document.body.children).forEach(ch=>{const d=ch.style.display;ch.style.display='none';const sw=document.documentElement.scrollWidth;ch.style.display=d;if(sw<base-4)out.push(ch.tagName+'.'+String(ch.className).split(' ')[0]+' -> '+sw)});const main=document.querySelector('main');const deep=[];if(main){Array.from(main.children).forEach(ch=>{const d=ch.style.display;ch.style.display='none';const sw=document.documentElement.scrollWidth;ch.style.display=d;if(sw<base-4)deep.push((ch.id||ch.tagName)+'.'+String(ch.className).split(' ')[0]+' -> '+sw)})}return JSON.stringify({base,out,deep})})()")
        print("  DEBUG bisect:", bis)
        bleed = ws.js("JSON.stringify(Array.from(document.querySelectorAll('body *')).filter(e=>e.scrollWidth>e.clientWidth+1&&e.clientWidth>0).slice(0,8).map(e=>e.tagName+'.'+String(e.className).split(' ')[0]+' sw='+e.scrollWidth+' cw='+e.clientWidth))")
        print("  DEBUG bleeders:", bleed)
    if DO_SHOTS:
        ws.js("window.scrollTo(0,0)"); time.sleep(0.6); ws.shot("01-top")
        ws.js("window.scrollTo(0,document.body.scrollHeight*0.35)"); time.sleep(1.2); ws.shot("02-mid")
        ws.js("window.scrollTo(0,document.body.scrollHeight*0.7)"); time.sleep(1.2); ws.shot("03-low")
        ws.js("window.scrollTo(0,document.body.scrollHeight)"); time.sleep(1.2); ws.shot("04-end")
    errs = [c for c in ws.console if not c.startswith("ERR: Failed to load resource") or "favicon" not in c]
    errs = [c for c in errs if "favicon" not in c]
    print(f"== console errors: {len(errs)}")
    for e in errs[:10]: print("   " + e)
    if errs: fails.append(f"console errors: {len(errs)}")
    print("== RESULT:", "ALL GREEN" if not fails else "FAIL — " + "; ".join(fails))
finally:
    proc.terminate()
    server.terminate()
