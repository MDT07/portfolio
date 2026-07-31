# NORDE «Архив» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Полный редизайн `templates/ecommerce/index.html` в «NORDE Архив» — editorial-archive магазин уровня Awwwards: бумага/чернила + Playfair, 2D-кинематографика (GSAP/Lenis), pinned лукбук-дрейф, 3D-глава со scroll-камерой, при полном сохранении e-commerce функциональности.

**Architecture:** Один самодостаточный `index.html` (CSS в `<style>`, JS в `<script type="module">`), CDN: GSAP 3.12+ScrollTrigger, Lenis 1.x, Three.js 0.16x (importmap, только глава 03), Google Fonts cyrillic. Прогрессивное улучшение: без JS/CDN контент полностью читаем. Верификация — исполняемые CDP-ассерты `scripts/qa-norde.py` (установленный в репо паттерн CDP-QA): каждая задача сначала добавляет падающие проверки, потом делает их зелёными. Работа на `main`, частые коммиты.

**Tech Stack:** HTML/CSS/vanilla JS (ES-модуль), GSAP+ScrollTrigger, Lenis, Three.js+GLTFLoader+DRACOLoader, Python 3 + websocket-client (QA).

**Spec:** `docs/superpowers/specs/2026-07-31-norde-redesign-design.md` (читать целиком перед стартом). **Референсы:** `docs/research/norde-redesign-references.md`.

---

### Task 1: QA-харNESS `scripts/qa-norde.py`

**Files:**
- Create: `scripts/qa-norde.py`

ХарNESS: поднимает `python3 -m http.server 8082` в `templates/ecommerce`, гоняет headless Chrome по CDP (порт 9336, профиль `/tmp/cdp-profile-norde-qa`), выполняет JS-ассерты через `Runtime.evaluate`, собирает console-ошибки, делает скриншоты. Режимы: `--shot` (только скриншоты), `--rm` (эмуляция prefers-reduced-motion), `--mobile` (390px).

- [ ] **Step 1: Написать харNESS**

```python
#!/usr/bin/env python3
"""CDP QA для NORDE. Запуск: python3 scripts/qa-norde.py [--shot] [--rm] [--mobile]
Коды выхода: 0 — все ассерты зелёные и консоль чистая; 1 — есть красные."""
import json, subprocess, time, sys, base64, urllib.request, os, signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMPL = os.path.join(ROOT, "templates/ecommerce")
BASE = "http://localhost:8082"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CDP_PORT = 9336
SHOT = "--shot" in sys.argv
RM = "--rm" in sys.argv
MOBILE = "--mobile" in sys.argv
WIDTH = 390 if MOBILE else 1440

server = subprocess.Popen([sys.executable, "-m", "http.server", "8082"], cwd=TMPL,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
proc = subprocess.Popen([CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
    f"--remote-debugging-port={CDP_PORT}", "--remote-allow-origins=*",
    f"--window-size={WIDTH},900", "--no-first-run",
    "--user-data-dir=/tmp/cdp-profile-norde-qa", f"{BASE}/"],
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
            if pages: ws_url = pages[0]["webSocketDebuggerUrl"]; break
        except Exception: pass
        time.sleep(0.25)
    if not ws_url: print("FATAL: no CDP tab"); cleanup(); sys.exit(1)
    ws = websocket.create_connection(ws_url, timeout=90)
    mid = 0
    def cmd(method, params=None):
        global mid
        mid += 1
        ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == mid: return msg.get("result", {})
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
        if not ok: failures.append(name)
    def shot(name):
        h = js("document.documentElement.scrollHeight") or 900
        h = min(h, 6000)
        data = cmd("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True,
            "clip": {"x": 0, "y": 0, "width": WIDTH, "height": h, "scale": 1}})["data"]
        out = f"/tmp/norde-qa-{name}.png"
        open(out, "wb").write(base64.b64decode(data))
        print("  shot:", out)

    cmd("Page.enable"); cmd("Runtime.enable"); cmd("Network.enable")
    if RM:
        cmd("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
    cmd("Emulation.setDeviceMetricsOverride", {"width": WIDTH, "height": 900, "deviceScaleFactor": 1, "mobile": MOBILE})
    time.sleep(7)  # шрифты + CDN + прелоадер

    CHECKS = json.load(open(os.path.join(ROOT, "scripts/qa-norde-checks.json")))
    for c in CHECKS:
        check(c["name"], c["js"], c.get("expect", True))
    if SHOT:
        for name, y in [("top", 0), ("mid", 0.5), ("end", 1.0)]:
            js(f"window.scrollTo(0, document.documentElement.scrollHeight * {y})")
            time.sleep(1.2)
            shot(name)
    if errors:
        print("CONSOLE ISSUES:")
        for e in dict.fromkeys(errors): print(" ", e)
        failures.append("console")
    ws.close()
finally:
    cleanup()
print("RESULT:", "FAIL" if failures else "PASS")
sys.exit(1 if failures else 0)
```

- [ ] **Step 2: Написать начальный набор проверок `scripts/qa-norde-checks.json`**

Проверки текущего (старого) шаблона — харNESS должен быть зелёным ДО редизайна:

```json
[
  {"name": "страница загрузилась", "js": "document.readyState === 'complete'"},
  {"name": "каталог отрендерен (8 карточек)", "js": "document.querySelectorAll('.product').length", "expect": 8},
  {"name": "фильтр obuv оставляет 2 товара", "js": "(document.querySelector('[data-filter=obuv]').click(), document.querySelectorAll('.product').length)", "expect": 2},
  {"name": "quick-view открывается", "js": "(document.querySelector('.product').click(), document.querySelector('#modal').classList.contains('open'))"},
  {"name": "добавление в корзину", "js": "(document.querySelector('#qvAdd').click(), !document.querySelector('#cartCount').classList.contains('hidden'))"},
  {"name": "итого корзины > 0", "js": "document.querySelector('#drawerFoot').textContent.includes('₽')"}
]
```

- [ ] **Step 3: Прогнать на текущем шаблоне — все PASS**

Run: `python3 scripts/qa-norde.py`
Expected: все строки `PASS`, `RESULT: PASS`, exit 0. Если имена селекторов не совпали — поправить JSON под текущую разметку (селекторы старой версии: `.product`, `[data-filter=obuv]`, `#modal`, `#qvAdd`, `#cartCount`, `#drawerFoot` — проверены чтением файла).

- [ ] **Step 4: Commit**

```bash
git add scripts/qa-norde.py scripts/qa-norde-checks.json
git commit -m "test(norde): CDP QA-харNESS с циклом магазина (baseline)"
```

---

### Task 2: Скелет «Архива» — токены, главы, статический поток

**Files:**
- Modify: `templates/ecommerce/index.html` (полная перезапись)
- Modify: `scripts/qa-norde-checks.json` (новые структурные проверки)

Переписать файл: `<head>` (fonts + importmap + preconnect), CSS (токены/ресет/база/компоненты), статический HTML всех глав в потоке (читаем без JS), header, постерный футер, зерно. Без анимаций и без каталога-JS (каталог — Task 3; пока статичная заглушка-сетка).

- [ ] **Step 1: Добавить падающие проверки в `qa-norde-checks.json`** (заменить baseline-набор — селекторы старого шаблона больше не существуют)

```json
[
  {"name": "страница загрузилась", "js": "document.readyState === 'complete'"},
  {"name": "6 глав с маркерами", "js": "document.querySelectorAll('[data-chapter]').length", "expect": 6},
  {"name": "токен paper применён", "js": "getComputedStyle(document.body).backgroundColor", "expect": "rgb(250, 250, 249)"},
  {"name": "Playfair подключён", "js": "document.fonts.check('16px \"Playfair Display\"')"},
  {"name": "Manrope подключён", "js": "document.fonts.check('16px Manrope')"},
  {"name": "2 тёмные инверсии", "js": "document.querySelectorAll('.chapter--dark').length", "expect": 2},
  {"name": "постерный футер wordmark", "js": "!!document.querySelector('.footer-wordmark')"},
  {"name": "зерно присутствует", "js": "!!document.querySelector('.grain')"}
]
```

- [ ] **Step 2: Прогнать — FAIL по всем новым проверкам**

Run: `python3 scripts/qa-norde.py`
Expected: FAIL «6 глав с маркерами», «токен paper», «Playfair», инверсии, wordmark, зерно.

- [ ] **Step 3: Переписать `index.html` — head и CSS-каркас**

Структура файла (полный CSS-каркас ниже; кастомные свойства — точные значения из спеки §4):

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NORDE — Архив · Выпуск 01</title>
<meta name="description" content="Архив-издание скандинавского магазина: одежда и предметы дома без лишнего шума.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=Manrope:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="importmap">
{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/"
} }
</script>
<style>
:root{
  --paper:#FAFAF9; --paper-2:#F4F3F1; --ink:#1C1917;
  --ink-2:rgba(28,25,23,.62); --ink-3:rgba(28,25,23,.38);
  --line:#D6D3D1; --brass:#A16207; --brass-hover:#8A5506;
  --dark:#161412; --dark-ink:#EDE9E4; --dark-line:rgba(237,233,228,.16);
  --error:#DC2626;
  --font-display:"Playfair Display",Georgia,serif;
  --font-ui:"Manrope",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",monospace;
  --ease-cine:cubic-bezier(0.65,0,0.35,1);
  --container:1360px;
}
/* ресет: margin/padding 0, box-sizing border-box, img block max-width 100% */
/* body: bg var(--paper), color var(--ink), font var(--font-ui) 16px/1.6 */
/* .mono: var(--font-mono), 11–12px, uppercase, letter-spacing .06em */
/* .container: max-width var(--container), padding 0 40px, margin auto */
/* .chapter: padding 140px 0, position relative */
/* .chapter--dark: bg var(--dark), color var(--dark-ink) */
/* .chapter-index: mono, var(--ink-3), формат «01 /» */
/* .grain: fixed inset 0, pointer-events none, opacity .05, SVG-noise data-uri, z-index 999 */
/* .btn / .btn-primary(ink→brass hover) / .btn-ghost: бордеры 1px, radius 3px, без теней */
/* hairline: border-top 1px var(--line) */
/* @media (prefers-reduced-motion: reduce): все анимации/переходы отключены */
</style>
</head>
```

- [ ] **Step 4: Статический HTML всех глав**

Каркас (контент — точные тексты; 6 секций `data-chapter` + header + footer):

```html
<body>
<div class="grain" aria-hidden="true"></div>
<header class="header" id="header">
  <div class="container header-row">
    <a class="wordmark" href="#top">NORDE</a>
    <p class="mono header-meta">Архив · Выпуск 01 · Осень 2026</p>
    <button class="cart-btn" id="cartBtn" aria-label="Открыть корзину">Корзина <span class="cart-count hidden" id="cartCount">0</span></button>
  </div>
</header>
<main id="top">
  <section class="chapter hero" data-chapter="00">
    <div class="container">
      <p class="mono chapter-index">00 / Обложка</p>
      <h1 class="hero-title" data-mask>Одежда и предметы дома — без лишнего шума</h1>
      <p class="hero-sub">Скандинавская витрина: вещи, которые работают каждый день и не надоедают.</p>
      <div class="hero-media"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" alt="Коллекция NORDE" fetchpriority="high"></div>
      <p class="mono hero-scroll" aria-hidden="true">Листайте ↓</p>
    </div>
  </section>
  <section class="chapter" data-chapter="01">
    <div class="container">
      <p class="mono chapter-index">01 / Манифест</p>
      <h2 data-mask>Правила простые и одинаковые для всех</h2>
      <ol class="manifest-list">
        <li><span class="mono">П. 1.1</span> Вещь должна работать каждый день и не надоедать.</li>
        <li><span class="mono">П. 1.2</span> Никаких акций-ловушек и условий со звёздочкой.</li>
        <li><span class="mono">П. 1.3</span> Материалы важнее логотипов.</li>
      </ol>
    </div>
  </section>
  <section class="chapter chapter--dark" data-chapter="02">…заголовок «02 / Лукбук» + <div class="lookbook-track" id="lookTrack"> (лента заполняется JS, Task 6) + статичный fallback: 6 <figure> с теми же фото…</section>
  <section class="chapter chapter--dark" data-chapter="03">…заголовок «03 / Planche», <div id="plancheStage">, mono-спеки, swatch-кнопки, fallback-<img> обуви…</section>
  <section class="chapter" data-chapter="04">
    <p class="mono chapter-index">04 / Архив единиц</p>
    <h2 data-mask>Картотека</h2>
    <div class="filters" id="filters"><!-- рубрикаторы: Все/Одежда/Обувь/Аксессуары/Дом --></div>
    <div class="catalog-grid" id="catalogGrid"></div>
  </section>
  <section class="chapter" data-chapter="05">
    <p class="mono chapter-index">05 / Условия архива</p>
    <table class="terms"><!-- 4 строки: Доставка / Возврат / Гарантия / Оплата — hairline-строки, mono-номера —></table>
  </section>
</main>
<footer class="footer">
  <div class="footer-wordmark" aria-hidden="true">NORDE</div>
  <div class="container footer-cols"><!-- Каталог / Архив / Контакты --></div>
  <p class="mono footer-note">NORDE · Архив · Выпуск 01 — демонстрационный шаблон</p>
</footer>
<!-- modal, drawer, overlay, toast — разметка из Task 3 -->
<script type="module" src="#"></script>
</body>
```

- [ ] **Step 5: Прогнать — структурные проверки PASS**

Run: `python3 scripts/qa-norde.py`
Expected: все 8 проверок PASS, `RESULT: PASS`. Скриншот `/tmp/norde-qa-top.png` глазами: бумага, Playfair, маркеры глав.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html scripts/qa-norde-checks.json
git commit -m "feat(norde): скелет «Архива» — токены, главы, статический поток"
```

---

### Task 3: E-commerce ядро — данные, каталог-картотека, quick-view, корзина, «Акт приёма»

**Files:**
- Modify: `templates/ecommerce/index.html` (JS-модуль + разметка modal/drawer/toast)
- Modify: `scripts/qa-norde-checks.json` (функциональные проверки цикла)

Данные товаров — БЕЗ изменений из текущего файла (8 товаров, CATS, SIZES, FREE_DELIVERY 10000, DELIVERY_COST 490) + новые поля `unit` (инвентарный номер) и массив LOOKS для главы 02.

- [ ] **Step 1: Добавить падающие функциональные проверки**

```json
[
  {"name": "каталог: 8 карточек картотеки", "js": "document.querySelectorAll('.product').length", "expect": 8},
  {"name": "инвентарный номер на карточке", "js": "document.querySelector('.product .product-unit').textContent.includes('Unit n°')"},
  {"name": "фильтр obuv → 2 товара", "js": "(document.querySelector('[data-filter=obuv]').click(), document.querySelectorAll('.product').length)", "expect": 2},
  {"name": "фильтр all → 8 товаров", "js": "(document.querySelector('[data-filter=all]').click(), document.querySelectorAll('.product').length)", "expect": 8},
  {"name": "quick-view открывается с planche-разметкой", "js": "(document.querySelector('.product').click(), document.querySelector('#modal').classList.contains('open') && document.querySelector('#qvUnit').textContent.includes('Unit'))"},
  {"name": "выбор размера", "js": "(document.querySelectorAll('.size-btn')[2].click(), document.querySelectorAll('.size-btn')[2].classList.contains('active'))"},
  {"name": "в корзину → drawer открыт", "js": "(document.querySelector('#qvAdd').click(), document.querySelector('#drawer').classList.contains('open'))"},
  {"name": "счётчик корзины = 1", "js": "document.querySelector('#cartCount').textContent", "expect": "1"},
  {"name": "qty +1", "js": "(document.querySelector('[data-act=inc]').click(), document.querySelector('.cart-item .qty span').textContent)", "expect": "2"},
  {"name": "доставка бесплатно от 10000", "js": "document.querySelector('#drawerFoot').textContent.includes('Бесплатно')"},
  {"name": "оформление → Акт приёма", "js": "(document.querySelector('#checkoutBtn').click(), document.querySelector('#drawer').textContent.includes('Акт приёма'))"},
  {"name": "корзина очищена после акта", "js": "document.querySelector('#cartCount').classList.contains('hidden')"}
]
```

- [ ] **Step 2: Прогнать — FAIL** (каталог пуст)

Run: `python3 scripts/qa-norde.py` → FAIL по карточкам/корзине.

- [ ] **Step 3: JS-модуль — данные**

```js
const CATS = { odezhda:'Одежда', obuv:'Обувь', aksessuary:'Аксессуары', dom:'Дом' };
const SIZES = { odezhda:['XS','S','M','L','XL'], obuv:['40','41','42','43','44'], aksessuary:['One size'], dom:['One size'] };
const FREE_DELIVERY = 10000, DELIVERY_COST = 490;
// PRODUCTS: 8 объектов из текущего шаблона (id 1–8, те же name/price/img/desc/meta)
// + поле unit: 'Unit n°041'…'Unit n°048' (по порядку id)
const PRODUCTS = [ /* …скопировать 8 объектов, добавить unit… */ ];
// LOOKS для главы 02 (Task 6 рендерит, данные уже здесь):
const LOOKS = [
  { n: 1, title: 'Look n°1 — Город', items: [1, 3], img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80' },
  { n: 2, title: 'Look n°2 — Студия', items: [2, 4], img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80' },
  { n: 3, title: 'Look n°3 — Дом', items: [7, 8], img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80' },
  { n: 4, title: 'Look n°4 — Путь', items: [5, 2, 4], img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80' },
  { n: 5, title: 'Look n°5 — Вечер', items: [1, 6], img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80' },
  { n: 6, title: 'Look n°6 — Свет', items: [3, 5], img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80' }
];
```

- [ ] **Step 4: JS — каталог/фильтры/quick-view/корзина/checkout**

Портировать логику из текущего файла (строки 1110–1504): `renderCatalog`, фильтры, `openQuickView/closeQuickView`, `addToCart`, `cartTotals`, `renderCart`, qty-контролы, удаление, checkout, toast. Изменения против оригинала:

- Карточка: добавить `<span class="product-unit mono">Unit n°04X</span>` и класс `.product-media img` clip-reveal при появлении (класс `.is-in` по IntersectionObserver).
- Quick-view: добавить `<span id="qvUnit" class="mono">`, Playfair для `#qvName` (классом, не инлайн).
- Checkout: после клика `#checkoutBtn` drawer рендерит «Акт приёма n°{случайные 4 цифры}» (mono), список единиц, итог; кнопка «Закрыть акт»; `state.cart = []` + `renderCart()` при закрытии акта.
- Toast: формат `Unit n°043 → Корзина`.
- `fmt()` и `byId()` — как в оригинале.

- [ ] **Step 5: Прогнать — весь цикл PASS**

Run: `python3 scripts/qa-norde.py`
Expected: все проверки (структурные + функциональные) PASS, консоль чистая.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html scripts/qa-norde-checks.json
git commit -m "feat(norde): e-commerce ядро — картотека, quick-view, корзина, «Акт приёма»"
```

---

### Task 4: Главы 00/01/05 и постерный футер — визуальная отделка

**Files:**
- Modify: `templates/ecommerce/index.html` (CSS + мелкая разметка глав 00/01/05/footer)

- [ ] **Step 1: CSS глав** (точные правила)

- `.hero`: min-height 92vh, hero-title `clamp(3rem, 9vw, 8rem)` Playfair 400, lh 0.98, max-width 12 колонок; hero-media: рамка 1px var(--line), img aspect 21/9 cover, margin-top 64px.
- `.manifest-list`: счётчик-строки через hairline, шаг 28px, mono-маркеры П. 1.x.
- `.terms`: display table, строки border-top var(--line), колонки mono-номер 11px / название Playfair 24px / описание Manrope 15px var(--ink-2).
- `.footer-wordmark`: Playfair 900, `clamp(6rem, 22vw, 22rem)`, lh 0.8, uppercase, translateY(18%) (clipped снизу, overflow hidden), цвет var(--ink), opacity .9.
- Header: fixed, backdrop blur 12px при скролле (класс `.scrolled`), border-bottom var(--line).

- [ ] **Step 2: Скриншоты + глазами**

Run: `python3 scripts/qa-norde.py --shot`
Expected: PASS + 3 скриншота; проверить глазами обложку/манифест/условия/футер (wordmark clipped).

- [ ] **Step 3: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): главы 00/01/05 и постерный футер"
```

---

### Task 5: Motion-база — Lenis, preloader, reveals, вайпы, marquee, reduced-motion

**Files:**
- Modify: `templates/ecommerce/index.html` (CDN-скрипты + JS motion-модуль)
- Modify: `scripts/qa-norde-checks.json` (RM-проверка)

- [ ] **Step 1: Падающая проверка reduced-motion**

```json
[
  {"name": "RM: preloader не показан", "js": "getComputedStyle(document.querySelector('#preloader')).display", "expect": "none"},
  {"name": "RM: заголовок hero виден сразу", "js": "getComputedStyle(document.querySelector('.hero-title')).opacity", "expect": "1"}
]
```

Run: `python3 scripts/qa-norde.py --rm` → FAIL (preloader ещё не существует — добавить проверку наличия: временно будет FAIL).

- [ ] **Step 2: CDN + инициализация**

Перед `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
```

JS-модуль (в начале, обёртка `if (!reducedMotion && window.gsap)`):

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Preloader: #preloader (fixed, bg var(--paper), mono-счётчик 0→100 за ~1.6s,
  // затем y:-100% по --ease-cine 0.9s; sessionStorage 'norde-loaded' — пропуск)
  // data-mask заголовки: сплит по словам в overflow-hidden span'ы, y:115%→0, stagger 0.07,
  //   ScrollTrigger start 'top 82%', aria-label = полный текст, спаны aria-hidden
  // clip-reveal [data-clip]: clipPath inset(100% 0 0 0)→inset(0) + img scale 1.12→1, 1s
  // curtain-wipe: .wipe панели в начале глав 02/03/04 — y:0→-101%, once
  // velocity-marquee: .marquee-inner xPercent 0→-50 repeat -1, timeScale от |velocity| (max 4)
}
```

- [ ] **Step 3: Разметка preloader/marquee/wipe**

```html
<div id="preloader" aria-hidden="true"><span class="mono" id="preCount">0</span></div>
<!-- marquee-лента между главами 01→02 и 04→05: -->
<div class="marquee" aria-hidden="true"><div class="marquee-inner">
  <span>NORDE — Архив — Выпуск 01 — </span><span>NORDE — Архив — Выпуск 01 — </span>
</div></div>
```

CSS: `#preloader{display:flex;…}` + `@media (prefers-reduced-motion: reduce){#preloader{display:none}}`.

- [ ] **Step 4: Прогнаты — обычный и RM**

Run: `python3 scripts/qa-norde.py --shot` и `python3 scripts/qa-norde.py --rm`
Expected: PASS в обоих; на RM-скриншоте весь контент виден без анимаций; на обычном — hero после preloader.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html scripts/qa-norde-checks.json
git commit -m "feat(norde): motion-база — Lenis, preloader, reveals, вайпы, marquee, RM"
```

---

### Task 6: Глава 02 «Лукбук-дрейф» — pinned горизонтальная лента

**Files:**
- Modify: `templates/ecommerce/index.html` (CSS + JS главы 02)
- Modify: `scripts/qa-norde-checks.json` (проверки лука)

- [ ] **Step 1: Падающие проверки**

```json
[
  {"name": "6 образов в ленте", "js": "document.querySelectorAll('.look').length", "expect": 6},
  {"name": "состав лука mono", "js": "document.querySelector('.look .look-items').textContent.includes('Unit n°')"},
  {"name": "«Образ в корзину» добавляет 2 товара", "js": "(document.querySelector('.look-add').click(), document.querySelector('#cartCount').textContent)", "expect": "2"},
  {"name": "глава 02 тёмная", "js": "document.querySelector('[data-chapter=\"02\"]').classList.contains('chapter--dark')"}
]
```

Run: `python3 scripts/qa-norde.py` → FAIL (лента пустая). Внимание: проверки корзины идут после корзинных из Task 3 — счётчик накопительный; сброс: первой строкой этого блока проверок выполнить очистку `{"name":"сброс корзины","js":"(localStorage.clear(), true)"}` — корзина не в localStorage, поэтому: проверку «Образ в корзину» считать от текущего значения: использовать выражение `((n0=document.querySelector('#cartCount').textContent), document.querySelector('.look-add').click(), +document.querySelector('#cartCount').textContent - +n0)` с expect 2.

- [ ] **Step 2: Рендер ленты + CSS**

JS: по `LOOKS` рендерить в `#lookTrack` (и в статичный fallback-блок, который под cutline-JS скрывается классом `.js-ok`):

```html
<figure class="look" data-look="1">
  <div class="look-media"><img src="…" alt="Look n°1 — Город" loading="lazy"></div>
  <figcaption>
    <p class="mono">Look n°1</p>
    <p class="look-items mono">Пальто из шерсти · Кеды Court Low</p>
    <button class="btn btn-ghost look-add" data-look="1">Образ в корзину</button>
  </figcaption>
</figure>
```

CSS: `.lookbook-track{display:flex; gap:40px; will-change:transform}`; `.look{flex:0 0 min(58vw, 560px)}`; `.look-media{aspect-ratio:4/5; overflow:hidden}`.

- [ ] **Step 3: Pinned scrub-дрейф**

```js
const track = document.querySelector('#lookTrack');
if (!reducedMotion && window.gsap && track) {
  const dist = () => track.scrollWidth - track.parentElement.clientWidth;
  gsap.to(track, { x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '[data-chapter="02"]', start: 'top top',
      end: () => '+=' + (dist() + innerHeight * 0.6), pin: true, scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: st => { // velocity-skew ≤ 4° + прогресс-линейка #lookProgress scaleX = st.progress
        const v = gsap.utils.clamp(-4, 4, st.getVelocity() / 250);
        gsap.to(track, { skewX: -v, duration: 0.3, overwrite: 'auto' });
      } } });
}
```

- [ ] **Step 4: «Образ в корзину»**

Клик по `.look-add`: по `data-look` взять `LOOKS[n].items`, для каждого id — `addToCart(id, SIZES[cat][средний])`, toast `Look n°3 → Корзина (2 единицы)`, `openDrawer()`. Без reduced-motion/pin зависимостей — работает всегда.

- [ ] **Step 5: Прогнать + скриншот главы**

Run: `python3 scripts/qa-norde.py --shot` → PASS; на mid-скриншоте виден дрейф ленты.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html scripts/qa-norde-checks.json
git commit -m "feat(norde): глава 02 — pinned лукбук-дрейф с «Образ в корзину»"
```

---

### Task 7: Глава 03 «Planche» — Three.js scroll-камера

**Files:**
- Modify: `templates/ecommerce/index.html` (CSS + JS главы 03)
- Modify: `scripts/qa-norde-checks.json` (проверки 3D/fallback)

- [ ] **Step 1: Падающие проверки**

```json
[
  {"name": "сцена: canvas или fallback", "js": "!!(document.querySelector('#plancheStage canvas') || document.querySelector('#plancheStage img.planche-fallback'))"},
  {"name": "4 ракурса в подписях", "js": "document.querySelectorAll('.planche-view').length", "expect": 4},
  {"name": "3 swatch", "js": "document.querySelectorAll('.swatch').length", "expect": 3},
  {"name": "спеки mono присутствуют", "js": "document.querySelector('#plancheSpecs').textContent.includes('Подошва')"}
]
```

Run → FAIL (глава пустая).

- [ ] **Step 2: Ленивая инициализация Three.js**

```js
const stage = document.querySelector('#plancheStage');
const plancheOn = !reducedMotion && stage && window.WebGLRenderingContext;
if (plancheOn) {
  const io3 = new IntersectionObserver(async (es) => {
    if (!es[0].isIntersecting) return;
    io3.disconnect();
    try {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
      initPlanche(THREE, GLTFLoader, DRACOLoader);
    } catch (e) { showPlancheFallback(); }
  }, { rootMargin: '600px' });
  io3.observe(stage);
} else { showPlancheFallback(); }
// showPlancheFallback: stage.innerHTML = '<img class="planche-fallback" src="фото кед Unsplash" alt="Кеды Court Low — Planche n°2">'
```

- [ ] **Step 3: `initPlanche` — сцена, модель, путь камеры**

```js
function initPlanche(THREE, GLTFLoader, DRACOLoader) {
  const w = stage.clientWidth, h = Math.min(innerHeight * 0.8, 760);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xEDE9E4, 0x161412, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 5, 2); scene.add(key);
  const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/libs/draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const loaderEl = document.querySelector('#plancheLoader');
  loader.load(
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
    (gltf) => {
      scene.add(gltf.scene);
      loaderEl.style.display = 'none';
      startCameraPath(gltf.scene);
    },
    (xhr) => { loaderEl.textContent = 'Chargement… ' + Math.round(xhr.loaded / xhr.total * 100 || 0) + '%'; },
    () => showPlancheFallback()
  );
  // Камера: 4 стопа {pos, target, label}
  const STOPS = [
    { pos: [2.6, 0.5, 0.2], tgt: [0, 0.15, 0], label: 'Vue latérale' },
    { pos: [0.3, 2.8, 0.4], tgt: [0, 0, 0],   label: 'Vue de dessus' },
    { pos: [1.1, 0.4, 1.1], tgt: [0.25, 0.2, 0], label: 'Détail couture' },
    { pos: [2.0, 1.2, 2.0], tgt: [0, 0.1, 0],  label: 'Vue 3/4' }
  ];
  function startCameraPath(model) {
    // ScrollTrigger pinned ~300vh: прогресс 0..1 → непрерывная интерполяция
    // между STOPS (catmull-rom по pos и tgt), gsap.utils.interpolate;
    // активный .planche-view подсвечивается по Math.round(progress * 3);
    // hover-drift: mousemove → camera.position += offset ±3° (lerp);
    // render-цикл через gsap.ticker, пауза когда глава вне viewport (ScrollTrigger onToggle).
  }
}
```

Swatch: модель MaterialsVariantsShoe содержит варианты материалов — переключение через `KHR_materials_variants`: получить extension-список вариантов, 3 кнопки `.swatch` ставят `selectVariant` (через `gltf.functions?.selectVariant` либо смена `material.color` на ближайший из палитры: `#1C1917 / #A16207 / #EDE9E4` — fallback-реализация цвета обязательна, если вариантов нет).

- [ ] **Step 4: Разметка главы**

```html
<div class="planche-grid">
  <aside><ol id="plancheSpecs" class="mono">
    <li>Подошва — каучук Margom</li><li>Верх — телятина</li><li>Вес — 320 г</li><li>Артикул — NR-0201</li>
  </ol></aside>
  <div id="plancheStage"><p class="mono" id="plancheLoader">Chargement…</p></div>
  <nav class="planche-views mono">
    <span class="planche-view active">Vue latérale</span><span class="planche-view">Vue de dessus</span>
    <span class="planche-view">Détail couture</span><span class="planche-view">Vue 3/4</span>
  </nav>
  <div class="swatches"><button class="swatch" data-c="#1C1917" style="--c:#1C1917" aria-label="Чернила"></button><button class="swatch" data-c="#A16207" style="--c:#A16207" aria-label="Латунь"></button><button class="swatch" data-c="#EDE9E4" style="--c:#EDE9E4" aria-label="Бумага"></button></div>
</div>
```

- [ ] **Step 5: Прогнать + скриншот**

Run: `python3 scripts/qa-norde.py --shot` → PASS (в headless Chrome WebGL работает через SwiftShader — canvas ожидаем; если нет — зелёная ветка fallback). Скриншот главы 03 глазами.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html scripts/qa-norde-checks.json
git commit -m "feat(norde): глава 03 — Three.js planche со scroll-камерой и вариантами"
```

---

### Task 8: FLIP-перелёт, финальная полировка и сдача

**Files:**
- Modify: `templates/ecommerce/index.html` (FLIP + финальные штрихи)
- Modify: `public/templates/ecommerce/index.html` (синхронная копия)
- Modify: `templates/ecommerce/README.md`
- Modify: `public/templates/ecommerce/README.md`

- [ ] **Step 1: FLIP-перелёт товара 02→04**

При входе главы 04 (ScrollTrigger once): клон первого `.look-media img` летит в слот первой карточки каталога: измерить `getBoundingClientRect()` источника/цели, fixed-клон, gsap.to по x/y/scale 0.9s var(--ease-cine), удалить клон. Только без reduced-motion. Не блокирует ничего — чистая вишенка.

- [ ] **Step 2: Полный QA-прогон (десктоп)**

Run: `python3 scripts/qa-norde.py --shot`
Expected: `RESULT: PASS`, консоль чистая, все скриншоты проверены глазами.

- [ ] **Step 3: Мобильный прогон 390px**

Run: `python3 scripts/qa-norde.py --mobile --shot`
Expected: PASS; hero-title не ломается, лента лука `flex-basis 78vw`, planche-grid в одну колонку, drawer на весь экран. Красные места — чинить медиазапросами `@media (max-width: 720px)`.

- [ ] **Step 4: Reduced-motion прогон**

Run: `python3 scripts/qa-norde.py --rm --shot`
Expected: PASS; весь контент виден, pinned-главы статичны, preloader скрыт.

- [ ] **Step 5: Перфоманс-быстрый аудит**

Run: `python3 scripts/qa-norde.py` + в консоли CDP: `js("performance.getEntriesByType('largest-contentful-paint')[0]?.startTime")` — ориентир < 2500ms на локалке; `document.querySelectorAll('img[loading=lazy]').length >= 10`; fetchpriority только у hero.

- [ ] **Step 6: Синхронизация копии и README**

```bash
cp templates/ecommerce/index.html public/templates/ecommerce/index.html
```

README (оба): новое описание — «NORDE Архив», главы 00–05, стек (GSAP/Lenis/Three.js CDN), запуск двойным кликом, QA `python3 scripts/qa-norde.py`.

- [ ] **Step 7: Финальный commit**

```bash
git add templates/ecommerce/ public/templates/ecommerce/
git commit -m "feat(norde): FLIP-перелёт, мобильная/RM-полировка, синхронизация витрины"
```

---

## Self-Review пройден

- **Spec coverage:** §3 карта глав → Tasks 2,4,6,7; §4 визуал → Tasks 2,4; §5 кинематографика → Task 5 (+вайпы/marquee/preloader); §6 3D → Task 7; §7 интерактив/e-com → Tasks 3,6; §8 реализация → Tasks 2,8; §9 проверки → QA-шаги в каждой задаче + Task 8; §10 YAGNI — соблюдено.
- **Placeholders:** данные PRODUCTS копируются из текущего файла (точно указано откуда); LOOKS выписаны полностью; весь нетривиальный код приведён.
- **Type consistency:** селекторы/ID (`#catalogGrid`, `#qvUnit`, `#lookTrack`, `#plancheStage`, `.look-add`, `[data-chapter]`, `#cartCount`, `#drawerFoot`, `#checkoutBtn`) единообразны между задачами и проверками.
- **TDD-адаптация зафиксирована:** тесты = исполняемые CDP-ассерты (baseline → fail → pass), скриншот-ревью для визуала.
