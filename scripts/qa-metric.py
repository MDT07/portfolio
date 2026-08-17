#!/usr/bin/env python3
"""CDP QA для METRIC CRM. Запуск: python3 scripts/qa-metric.py [--mobile] [--shot]
0 — все ассерты зелёные и консоль чистая; 1 — есть красные."""
import json, subprocess, time, sys, urllib.request, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates/metric")
BASE = "http://localhost:8643"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CDP_PORT = 9347
MOBILE = "--mobile" in sys.argv
SHOT = "--shot" in sys.argv
WIDTH, HEIGHT = (390, 844) if MOBILE else (1440, 900)
OUT = "/tmp/metric-shots"
os.makedirs(OUT, exist_ok=True)

subprocess.run(["pkill", "-f", f"remote-debugging-port={CDP_PORT}"], capture_output=True)
subprocess.run(["pkill", "-f", "http.server 8643"], capture_output=True)
time.sleep(0.6)

server = subprocess.Popen([sys.executable, "-m", "http.server", "8643"], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = subprocess.Popen([CHROME, "--headless", "--hide-scrollbars",
    f"--remote-debugging-port={CDP_PORT}", "--remote-allow-origins=*",
    f"--window-size={WIDTH},{HEIGHT}", "--no-first-run",
    "--user-data-dir=/tmp/cdp-profile-metric-qa", BASE + "/index.html"],
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
            pages = [t for t in tabs if t.get("type") == "page" and ":8643" in t.get("url", "")]
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

    def check(name, expr, expect: object = True):
        got = js(expr)
        ok = (got == expect)
        print(("  PASS " if ok else "  FAIL ") + name + ("" if ok else f" (got: {got!r}, want: {expect!r})"))
        if not ok:
            failures.append(name)

    def shot(name):
        if not SHOT: return
        data = cmd("Page.captureScreenshot", {"format": "png"}).get("data")
        if data:
            import base64
            p = os.path.join(OUT, name + ".png")
            open(p, "wb").write(base64.b64decode(data))
            print("  SHOT " + p)

    cmd("Runtime.enable"); cmd("Page.enable")
    cmd("Network.enable"); cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    time.sleep(2.2)  # fonts + first render

    tag = "MOBILE" if MOBILE else "DESKTOP"
    print(f"== METRIC QA ({tag} {WIDTH}x{HEIGHT}) ==")

    js("localStorage.removeItem('metric-crm-v1'); location.reload()")
    time.sleep(2.0)

    check("boot: sidebar", "!!document.querySelector('.sidebar')")
    check("boot: kpi cards = 4", "document.querySelectorAll('.kpi').length", 4)
    check("boot: revenue chart svg", "document.querySelectorAll('#rev-chart svg').length", 1)
    check("boot: funnel rows = 6", "document.querySelectorAll('#dash-funnel .fn-row').length", 6)
    check("boot: activity items > 0", "document.querySelectorAll('#dash-act .act-item').length > 0")
    check("boot: fonts Onest", "document.fonts.check('14px Onest')")
    check("boot: no horizontal overflow", "document.documentElement.scrollWidth <= window.innerWidth + 1")
    shot("01-dashboard")

    js("navigate('deals')"); time.sleep(0.3)
    check("deals: kanban cols = 7", "document.querySelectorAll('.kb-col').length", 7)
    check("deals: kanban cards > 30", "document.querySelectorAll('.kb-card').length > 30")
    check("deals: table mode", "(document.querySelector('[data-action=\"deals-mode\"][data-mode=\"table\"]').click(), document.querySelectorAll('.tbl tbody tr').length > 30)")
    shot("02-deals-table")
    js("document.querySelector('[data-action=\"deals-mode\"][data-mode=\"kanban\"]').click()"); time.sleep(0.3)
    if not MOBILE:
        dnd = js("""(()=>{const c=document.querySelector('.kb-card');const sr=c.getBoundingClientRect();const id=c.dataset.id;const before=dealById(id).stage;
        const col=document.querySelectorAll('.kb-col')[1];const cr=col.getBoundingClientRect();const tx=cr.x+cr.width/2,ty=cr.y+120;
        c.dispatchEvent(new PointerEvent('pointerdown',{button:0,clientX:sr.x+12,clientY:sr.y+12,bubbles:true}));
        document.dispatchEvent(new PointerEvent('pointermove',{clientX:sr.x+90,clientY:sr.y+30,bubbles:true}));
        document.dispatchEvent(new PointerEvent('pointermove',{clientX:tx,clientY:ty,bubbles:true}));
        document.dispatchEvent(new PointerEvent('pointerup',{clientX:tx,clientY:ty,bubbles:true}));
        return before+'>'+dealById(id).stage})()""")
        ok = bool(dnd) and dnd.endswith(">qualified")
        print(("  PASS " if ok else "  FAIL ") + f"deals: kanban dnd lead→qualified (got {dnd})")
        if not ok: failures.append("deals dnd")
        shot("03-kanban-dnd")
    check("deals: drawer opens", "(openDealDrawer(document.querySelector('.kb-card').dataset.id), new Promise(r=>setTimeout(()=>r(document.querySelectorAll('.drawer.open').length),250)), 1)" if False else "(async()=>{openDealDrawer(document.querySelector('.kb-card').dataset.id);await new Promise(r=>setTimeout(r,250));const n=document.querySelectorAll('.drawer.open').length;closeOverlays();await new Promise(r=>setTimeout(r,300));return n===1 && document.querySelectorAll('.overlay.open').length===0})()")

    js("navigate('clients')"); time.sleep(0.25)
    check("clients: company rows > 15", "document.querySelectorAll('.tbl tbody tr').length > 15")
    js("navigate('tasks')"); time.sleep(0.25)
    check("tasks: 3 groups", "document.querySelectorAll('#tk-body .grid-3 > .card').length", 3)
    check("tasks: calendar", "(document.querySelector('[data-action=\"tasks-mode\"][data-mode=\"calendar\"]').click(), !!document.querySelector('#tk-body .card'))")
    js("navigate('analytics')"); time.sleep(0.3)
    check("analytics: chart + funnel", "document.querySelectorAll('#an-chart svg').length===1 && document.querySelectorAll('#an-funnel .fn-row').length===6")
    js("navigate('invoices')"); time.sleep(0.25)
    check("invoices: rows > 10", "document.querySelectorAll('.tbl tbody tr').length > 10")

    js("navigate('builder')"); time.sleep(0.25)
    check("builder: palette widgets = 11", "document.querySelectorAll('.palette-widget').length", 11)
    check("builder: add 2 widgets", "(async()=>{document.querySelector('[data-action=\"widget-add\"][data-type=\"kpi\"]').click();document.querySelector('[data-action=\"widget-add\"][data-type=\"chart\"]').click();await new Promise(r=>setTimeout(r,400));return document.querySelectorAll('.bw').length===2})()")
    check("builder: undo/redo", """(async()=>{
      const p=activePage();const n0=p.widgets.length;
      ACTIONS['b-undo']();await new Promise(r=>setTimeout(r,150));
      const afterUndo=activePage().widgets.length;
      ACTIONS['b-redo']();await new Promise(r=>setTimeout(r,150));
      const afterRedo=activePage().widgets.length;
      return afterUndo===n0-1 && afterRedo===n0})()""")
    check("builder: snap off free mode", """(async()=>{
      ACTIONS['b-snap']();await new Promise(r=>setTimeout(r,200));
      const free=document.querySelectorAll('.bw.free').length>0;
      ACTIONS['b-snap']();await new Promise(r=>setTimeout(r,200));
      return free && document.querySelectorAll('.bw.free').length===0})()""")
    check("builder: widget edit + custom title", """(async()=>{
      const p=activePage();const w=p.widgets[0];
      ACTIONS['widget-edit']({dataset:{id:w.id}});await new Promise(r=>setTimeout(r,150));
      document.querySelector('#we-title').value='Моя метрика';
      ACTIONS['widget-save']({dataset:{id:w.id}});await new Promise(r=>setTimeout(r,200));
      return activePage().widgets[0].props.title==='Моя метрика'})()""")
    check("builder: checklist widget + toggle", """(async()=>{
      document.querySelector('[data-action=\"widget-add\"][data-type=\"checklist\"]').click();await new Promise(r=>setTimeout(r,250));
      const wl=activePage().widgets.find(x=>x.type==='checklist');
      if(!wl)return false;
      ACTIONS['wl-toggle']({dataset:{wid:wl.id,i:'0'}});await new Promise(r=>setTimeout(r,120));
      return wl.props.items[0].done===true})()""")
    shot("04-builder")
    check("stages: add custom stage", """(async()=>{
      ACTIONS['stages-manage']();await new Promise(r=>setTimeout(r,150));
      document.querySelector('#stg-name').value='Онбординг';
      ACTIONS['stage-add']();await new Promise(r=>setTimeout(r,150));
      const ok=state.stages.some(s=>s.label==='Онбординг');
      closeModal();navigate('deals');await new Promise(r=>setTimeout(r,250));
      const colOk=Array.from(document.querySelectorAll('.kb-col .kb-title')).some(x=>x.textContent==='Онбординг');
      return ok && colOk})()""")
    check("stages: dnd into custom stage", """(async()=>{
      navigate('deals');await new Promise(r=>setTimeout(r,250));
      const col=Array.from(document.querySelectorAll('.kb-col')).find(c=>c.dataset.stage.startsWith('st_'));
      if(!col)return 'nostage';
      col.scrollIntoView({inline:'center',block:'nearest'});
      await new Promise(r=>setTimeout(r,350));
      const card=document.querySelector('.kb-card');const sr=card.getBoundingClientRect();const id=card.dataset.id;
      const cr=col.getBoundingClientRect();const tx=cr.x+cr.width/2,ty=cr.y+Math.min(60,Math.max(20,cr.height-8));
      if(tx>window.innerWidth-10)return 'offscreen';
      card.dispatchEvent(new PointerEvent('pointerdown',{button:0,clientX:sr.x+12,clientY:sr.y+12,bubbles:true}));
      document.dispatchEvent(new PointerEvent('pointermove',{clientX:sr.x+90,clientY:sr.y+30,bubbles:true}));
      document.dispatchEvent(new PointerEvent('pointermove',{clientX:tx,clientY:ty,bubbles:true}));
      document.dispatchEvent(new PointerEvent('pointerup',{clientX:tx,clientY:ty,bubbles:true}));
      await new Promise(r=>setTimeout(r,300));
      return dealById(id).stage===col.dataset.stage})()""")
    check("dash: KPI picker", """(async()=>{
      navigate('dashboard');await new Promise(r=>setTimeout(r,250));
      ACTIONS['dash-kpis']();await new Promise(r=>setTimeout(r,150));
      const sels=document.querySelectorAll('.dk-sel');sels[0].value='conversion';
      ACTIONS['dash-kpis-save']();await new Promise(r=>setTimeout(r,250));
      return state.dashKpis[0]==='conversion' && document.querySelectorAll('.kpi').length===4})()""")
    check("entity: wizard + create + nav", """(async()=>{
      ACTIONS['new-entity']();await new Promise(r=>setTimeout(r,150));
      document.querySelector('#ne-name').value='Объекты';
      ACTIONS['entity-create']();await new Promise(r=>setTimeout(r,200));
      const inNav=document.querySelectorAll('#nav-custom .nav-item').length===1;
      const route=state.route.startsWith('entity:');
      ACTIONS['new-record']({dataset:{id:state.customEntities[0].id}});await new Promise(r=>setTimeout(r,120));
      document.querySelectorAll('[data-rf]')[0].value='ЖК Север';
      ACTIONS['record-create']({dataset:{id:state.customEntities[0].id}});await new Promise(r=>setTimeout(r,150));
      return inNav && route && document.querySelectorAll('.tbl tbody tr').length===1})()""")

    check("palette: opens + filters", """(async()=>{openPalette();await new Promise(r=>setTimeout(r,120));
      const n0=document.querySelectorAll('.pal-item').length;
      const inp=document.querySelector('#pal-input');inp.value='сделк';inp.dispatchEvent(new Event('input'));
      await new Promise(r=>setTimeout(r,120));const n1=document.querySelectorAll('.pal-item').length;
      closePalette();return n0>5 && n1>0 && n1<n0})()""")

    check("ai: answer with real data", """(async()=>{openAI();aiUserSay('Сводка за неделю');
      await new Promise(r=>setTimeout(r,1600));
      const last=document.querySelector('#ai-body .ai-msg:last-child');
      const ok=last && last.textContent.includes('Выручка');
      closeAI();return ok})()""")

    check("theme: dark flips tokens", """(async()=>{ACTIONS['toggle-theme']();await new Promise(r=>setTimeout(r,120));
      const dark=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()==='#0F1115';
      ACTIONS['toggle-theme']();await new Promise(r=>setTimeout(r,120));
      const back=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()==='#F8FAFC';
      return dark && back})()""")
    check("lang: EN toggle", """(async()=>{ACTIONS['toggle-lang']();await new Promise(r=>setTimeout(r,120));
      const en=document.querySelector('[data-action="nav"][data-route="deals"]').textContent.includes('Deals');
      ACTIONS['toggle-lang']();return en})()""")

    if MOBILE:
        check("mobile: burger visible", "getComputedStyle(document.querySelector('.burger')).display !== 'none'")
        check("mobile: sidebar off-canvas", """(()=>{const sb=document.querySelector('.sidebar');const r=sb.getBoundingClientRect();return r.right<=1})()""")
        check("mobile: burger opens sidebar", "(document.querySelector('.burger').click(), document.querySelector('.sidebar').classList.contains('open'))")
        js("document.querySelector('#scrim').click()")
        check("mobile: no h-overflow on deals", "(navigate('deals'), document.documentElement.scrollWidth <= window.innerWidth + 1)")
        check("mobile: no h-overflow on dashboard", "(navigate('dashboard'), document.documentElement.scrollWidth <= window.innerWidth + 1)")
        shot("05-mobile-dashboard")

    js("localStorage.removeItem('metric-crm-v1')")
    time.sleep(0.5)
    print("== console errors:", len(errors))
    for e in errors[:10]: print("  " + e)
    if errors: failures.append("console errors")
    print("== RESULT:", "FAIL" if failures else "ALL GREEN", ("— " + ", ".join(failures)) if failures else "")
    cleanup(); sys.exit(1 if failures else 0)
except Exception as e:
    print("FATAL:", e); cleanup(); sys.exit(1)
