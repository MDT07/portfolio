# NORDE «Архив оживает» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переделать шаблон NORDE по спеке `docs/superpowers/specs/2026-08-01-norde-archive-alive-design.md`: убрать 3D из главы 03 (2D-сцена: анатомия + студия цвета), перекомпоновать лукбук 02 (образ целиком + detail-стейдж), обогатить каталог 04 (фикс зума, сортировки), добавить цветные главы, секции «Материалы»/«Журнал»/«Клуб» и 2D-моушн-пакет.

**Architecture:** Один самодостаточный `templates/ecommerce/index.html` (CSS/JS инлайн, CDN: Lenis, GSAP+ScrollTrigger). Three.js удаляется. Моушн только transform/opacity/clip-path/filter + CSS-переменная `--chapter-accent`. QA-харнесс `scripts/qa-norde.py` + чеки `scripts/qa-norde-checks.json` (TDD: сначала красные чеки, потом реализация).

**Tech Stack:** vanilla HTML/CSS/JS, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.14, Python CDP QA (websocket-client), Unsplash.

**Рабочее дерево:** `main`, `~/Desktop/portfolio`. Коммит после каждой задачи (авторизовано). Все правки в `templates/ecommerce/index.html`, синк в `public/templates/ecommerce/` — только в Task 12.

**Конвенции файла:** CSS секции с баннерами `/* ===== X ===== */`; JS секции `/* ===== X ===== */` внутри `<script type="module">`; хелперы `$`/`$$`/`fmt`/`byId`; `motionOK = !reducedMotion && gsap && ScrollTrigger && Lenis`; дуотон `grayscale(1) sepia(.22) contrast(1.06) brightness(1.02)`; токены `--paper/--ink/--brass/--dark/--dark-ink/--dark-line/--ease-cine`.

**Фото-правило:** новые Unsplash-URL обязательно проверяются `curl -sfI -o /dev/null -w '%{http_code}' <url>` (200 = ок). Кандидаты даны в задачах; если 404 — берём следующий кандидат из списка.

---

### Task 1: QA — новая красная база + end-чеки в харнессе

**Files:**
- Modify: `scripts/qa-norde-checks.json` (полная замена)
- Modify: `scripts/qa-norde.py:95-102` (поддержка `"end": true` чеков)

- [ ] **Step 1: Переписать чеки целиком**

Заменить `scripts/qa-norde-checks.json` на:

```json
[
  {"name": "страница загрузилась", "js": "document.readyState === 'complete'"},
  {"name": "8 секций с маркерами", "js": "document.querySelectorAll('[data-chapter]').length", "expect": 8},
  {"name": "токен paper применён", "js": "getComputedStyle(document.body).backgroundColor", "expect": "rgb(250, 250, 249)"},
  {"name": "Playfair подключён", "js": "document.fonts.check('16px \"Playfair Display\"')"},
  {"name": "Manrope подключён", "js": "document.fonts.check('16px Manrope')"},
  {"name": "2 тёмные инверсии", "js": "document.querySelectorAll('.chapter--dark').length", "expect": 2},
  {"name": "постерный футер wordmark", "js": "!!document.querySelector('.footer-wordmark')"},
  {"name": "зерно присутствует", "js": "!!document.querySelector('.grain')"},
  {"name": "каталог: 8 карточек картотеки", "js": "document.querySelectorAll('.product').length", "expect": 8},
  {"name": "инвентарный номер на карточке", "js": "document.querySelector('.product .product-unit').textContent.includes('Unit n°')"},
  {"name": "каталог: бейдж дефицита", "js": "!!document.querySelector('.product-stock')"},
  {"name": "каталог: материал на карточке", "js": "!!document.querySelector('.product-material')"},
  {"name": "каталог: счётчик показано", "js": "document.querySelector('#shownCount') && document.querySelector('#shownCount').textContent", "expect": "8"},
  {"name": "зум-фикс: у .product нет hover-transform", "js": "(() => { let css=''; for (const s of document.styleSheets) { try { css += [...s.cssRules].map(r=>r.cssText).join('\\n'); } catch(e){} } return !/\\.product:hover\\s*\\{[^}]*transform/.test(css); })()"},
  {"name": "фильтр obuv → 2 товара", "js": "(document.querySelector('[data-filter=obuv]').click(), document.querySelectorAll('.product').length)", "expect": 2},
  {"name": "фильтр all → 8 товаров", "js": "(document.querySelector('[data-filter=all]').click(), document.querySelectorAll('.product').length)", "expect": 8},
  {"name": "сортировка цена ↓ меняет порядок", "js": "(() => { const g=()=>[...document.querySelectorAll('.product')].map(p=>p.dataset.id).join(','); const a=g(); document.querySelector('[data-sort=price-desc]').click(); const b=g(); const prices=[...document.querySelectorAll('.product .product-price')].map(e=>parseInt(e.textContent.replace(/\\D/g,''))); const ok=prices.every((v,i,arr)=>!i||arr[i-1]>=v); document.querySelector('[data-sort=featured]').click(); return a!==b && ok; })()"},
  {"name": "quick-view открывается с planche-разметкой", "js": "(document.querySelector('.product').click(), document.querySelector('#modal').classList.contains('open') && document.querySelector('#qvUnit').textContent.includes('Unit'))"},
  {"name": "quick-view: два фото", "js": "(document.querySelectorAll('.modal-thumb').length >= 2 && document.querySelector('#qvImg').src.length > 0)"},
  {"name": "выбор размера", "js": "(document.querySelectorAll('.size-btn')[2].click(), document.querySelectorAll('.size-btn')[2].classList.contains('active'))"},
  {"name": "в корзину → drawer открыт", "js": "(document.querySelector('#qvAdd').click(), document.querySelector('#drawer').classList.contains('open'))"},
  {"name": "счётчик корзины = 1", "js": "document.querySelector('#cartCount').textContent", "expect": "1"},
  {"name": "qty +1", "js": "(document.querySelector('[data-act=inc]').click(), document.querySelector('.cart-item .qty span').textContent)", "expect": "2"},
  {"name": "доставка бесплатно от 10000", "js": "document.querySelector('#drawerFoot').textContent.includes('Бесплатно')"},
  {"name": "оформление → Акт приёма", "js": "(document.querySelector('#checkoutBtn').click(), document.querySelector('#drawer').textContent.includes('Акт приёма'))"},
  {"name": "корзина очищена после акта", "js": "document.querySelector('#cartCount').classList.contains('hidden')"},
  {"name": "«+ в корзину» с карточки", "js": "(() => { const n0=+document.querySelector('#cartCount').textContent||0; document.querySelector('[data-add]').click(); return (+document.querySelector('#cartCount').textContent)>n0; })()"},
  {"name": "GSAP/Lenis подключены", "mode": "no-rm", "js": "typeof gsap !== 'undefined' && typeof Lenis !== 'undefined'"},
  {"name": "preloader отработал, sessionStorage выставлен", "mode": "no-rm", "js": "sessionStorage.getItem('norde-loaded') === '1'"},
  {"name": "hero-title разбит на слова", "mode": "no-rm", "js": "document.querySelectorAll('.hero-title .mask-line > span').length >= 5"},
  {"name": "hero-title виден после интро", "mode": "no-rm", "js": "(function(){var m = new DOMMatrix(getComputedStyle(document.querySelector('.hero-title .mask-line > span')).transform); return Math.abs(m.m42) < 1})()"},
  {"name": "RM: preloader не показан", "mode": "rm", "js": "getComputedStyle(document.querySelector('#preloader')).display", "expect": "none"},
  {"name": "RM: заголовок hero виден сразу", "mode": "rm", "js": "getComputedStyle(document.querySelector('.hero-title')).opacity", "expect": "1"},
  {"name": "RM: без сплита заголовков", "mode": "rm", "js": "document.querySelectorAll('.mask-line').length", "expect": 0},
  {"name": "RM: шторки скрыты", "mode": "rm", "js": "[...document.querySelectorAll('.wipe')].every(w => getComputedStyle(w).display === 'none')"},
  {"name": "6 образов в ленте", "js": "document.querySelectorAll('.look').length", "expect": 6},
  {"name": "интерлюдии в ленте", "js": "document.querySelectorAll('.look-interlude').length >= 4"},
  {"name": "лукбук: кадр 3:4 и ≤ 80vh", "js": "(() => { const r=document.querySelector('.look-media').getBoundingClientRect(); return r.height <= innerHeight*0.8 && Math.abs(r.width/r.height - 0.75) < 0.05; })()"},
  {"name": "первые 2 образа eager, остальные lazy", "js": "[...document.querySelectorAll('.look img')].map(i=>i.loading).join(',')", "expect": "eager,eager,lazy,lazy,lazy,lazy"},
  {"name": "состав лука mono", "js": "document.querySelector('.look .look-items').textContent.includes('Unit n°')"},
  {"name": "detail-стейдж открывается", "js": "(document.querySelector('.look .look-media').click(), document.querySelector('#lookStage').classList.contains('open'))"},
  {"name": "стейдж: «Образ в корзину» добавляет 2 товара", "js": "(() => { const n0=+document.querySelector('#cartCount').textContent||0; document.querySelector('#lsAddAll').click(); return (+document.querySelector('#cartCount').textContent)-n0; })()", "expect": 2},
  {"name": "detail-стейдж закрывается по Esc", "js": "(document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})), !document.querySelector('#lookStage').classList.contains('open'))"},
  {"name": "глава 02 тёмная", "js": "document.querySelector('[data-chapter=\"02\"]').classList.contains('chapter--dark')"},
  {"name": "3D и planche удалены", "js": "!document.querySelector('script[type=importmap]') && !document.querySelector('#plancheStage') && !document.querySelector('canvas')"},
  {"name": "анатомия: 4 плашки", "js": "document.querySelectorAll('.anatomy-plate').length", "expect": 4},
  {"name": "анатомия: 4 подписи спек", "js": "document.querySelectorAll('.anatomy-caps li').length", "expect": 4},
  {"name": "спеки анатомии присутствуют", "js": "document.querySelector('.anatomy-caps').textContent.includes('Подошва')"},
  {"name": "студия: 3 фото колорвеев", "js": "document.querySelectorAll('.studio-photo').length", "expect": 3},
  {"name": "3 swatch", "js": "document.querySelectorAll('.studio-swatches .swatch').length", "expect": 3},
  {"name": "студия: свотч меняет колорвей", "js": "(() => { const b=[...document.querySelectorAll('.studio-swatches .swatch')][1]; b.click(); return b.getAttribute('aria-pressed')==='true' && document.querySelector('.studio-photo.is-active').dataset.way==='1' && document.querySelector('#studioName').textContent==='Песок'; })()"},
  {"name": "студия: фон переливается", "js": "(async () => { await new Promise(r=>setTimeout(r,1000)); return getComputedStyle(document.querySelector('#studio')).backgroundColor === 'rgb(43, 37, 27)'; })()"},
  {"name": "нумералы: 01 02 03 А 04 Б 05", "js": "[...document.querySelectorAll('.chapter-numeral')].map(e=>e.textContent.trim()).join(' ')", "expect": "01 02 03 А 04 Б 05"},
  {"name": "пигменты: --chapter-accent и ≥4 data-accent", "js": "(() => { const v=getComputedStyle(document.documentElement).getPropertyValue('--chapter-accent').trim(); const n=new Set([...document.querySelectorAll('[data-accent]')].map(e=>e.dataset.accent)).size; return v!=='' && n>=4; })()"},
  {"name": "borderless: глава без border-top", "js": "getComputedStyle(document.querySelector('[data-chapter=\"01\"]')).borderTopWidth", "expect": "0px"},
  {"name": "дуотон на образах лукбука", "js": "getComputedStyle(document.querySelector('.look img')).filter.includes('grayscale')"},
  {"name": "материалы: 4 карточки", "js": "document.querySelectorAll('.material-card').length", "expect": 4},
  {"name": "материалы: дуотон до проявления", "js": "getComputedStyle(document.querySelector('.material-media img')).filter.includes('grayscale')"},
  {"name": "журнал: 3 статьи", "js": "document.querySelectorAll('.journal-card').length", "expect": 3},
  {"name": "журнал: overlay с реальным текстом", "js": "(() => { document.querySelector('.journal-read').click(); const ok=document.querySelector('#journalOverlay').classList.contains('open') && document.querySelectorAll('#joText p').length>=3; document.querySelector('#journalClose').click(); return ok && !document.querySelector('#journalOverlay').classList.contains('open'); })()"},
  {"name": "клуб: валидация и успех", "js": "(async () => { const em=document.querySelector('#clubEmail'), f=document.querySelector('#clubForm'), m=document.querySelector('#clubMsg'); em.value='bad'; f.dispatchEvent(new Event('submit',{cancelable:true})); const err=m.textContent.length>0; em.value='a@b.co'; f.dispatchEvent(new Event('submit',{cancelable:true})); await new Promise(r=>setTimeout(r,1000)); return err && /Вы в списке/.test(m.textContent); })()"},
  {"name": "marquee-мосты ≥ 3", "js": "document.querySelectorAll('.marquee').length >= 3"},
  {"name": "кастомный курсор активен", "mode": "no-rm", "js": "matchMedia('(pointer:fine)').matches ? document.querySelector('#cursor').classList.contains('on') : !document.querySelector('#cursor').classList.contains('on')"},
  {"name": "все изображения загружены", "end": true, "js": "[...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src)", "expect": []}
]
```

- [ ] **Step 2: Поддержка `"end": true` в харнессе**

В `scripts/qa-norde.py` заменить блок:

```python
    CHECKS = json.load(open(os.path.join(ROOT, "scripts/qa-norde-checks.json")))
    for c in CHECKS:
        mode = c.get("mode")  # "rm" — только reduced-motion, "no-rm" — только обычный прогон
        if mode == "rm" and not RM:
            continue
        if mode == "no-rm" and RM:
            continue
        check(c["name"], c["js"], c.get("expect", True))
```

на:

```python
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
```

И после блока `if SHOT:` (весь shot-блок остаётся как есть) добавить:

```python
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
```

- [ ] **Step 3: Прогон — красная база**

Run: `python3 scripts/qa-norde.py 2>&1 | grep FAIL`
Expected: FAIL у новых чеков (бейдж, материал, shownCount, зум-фикс, сортировка, +в корзину, два фото, интерлюдии, кадр 3:4, eager/lazy, стейдж ×3, 3D удалён (importmap ещё есть — FAIL), анатомия ×3, студия ×4, нумералы, пигменты, материалы ×2, журнал ×2, клуб, marquee, курсор). Старые чеки — PASS.

- [ ] **Step 4: Commit**

```bash
git add scripts/qa-norde-checks.json scripts/qa-norde.py
git commit -m "test(norde): чеки «Архив оживает» + end-чеки в харнессе (красная база)"
```

---

### Task 2: Цветные главы — пигменты и перелив

**Files:**
- Modify: `templates/ecommerce/index.html` — токены (:24-36), chapter CSS (:67-74, :125-139, :157-168, :195-201, :246-252, :404-405), data-accent у секций (:464,478,501,527,563,585), wipe (:502,528,564), motion JS (после :1182)

- [ ] **Step 1: Токен и потребители акцента в CSS**

В `:root` после `--error:#DC2626;` добавить:

```css
  --chapter-accent:#A16207;  /* пигмент текущей главы; скрабится GSAP на границах */
```

Правило `.chapter-index b{font-weight:500; color:var(--brass)}` →

```css
.chapter-index b{font-weight:500; color:var(--chapter-accent)}
```

Правило `.chapter-numeral{... color:var(--ink); opacity:.05; ...}` и `.chapter--dark .chapter-numeral{color:var(--dark-ink); opacity:.07}` → единое:

```css
.chapter-numeral{
  position:absolute; top:32px; right:-0.04em; z-index:0;
  font:900 clamp(8rem,18vw,16rem)/0.8 var(--font-display);
  color:var(--chapter-accent); opacity:.08; pointer-events:none; user-select:none;
  transition:color .3s;
}
```

(строку `.chapter--dark .chapter-numeral{...}` удалить).

`.manifest-no{... color:var(--brass) ...}` и `.manifest-quote{... color:var(--brass) ...}` → в обоих `color:var(--chapter-accent)`.

`.lookbook-progress i{... background:var(--brass); ...}` → `background:var(--chapter-accent)`.

`.look .mono b{color:var(--brass); font-weight:500}` → `color:var(--chapter-accent)`.

`.filter-btn.active{color:var(--brass)}` → `color:var(--chapter-accent)`; `.filter-btn.active::after{background:var(--brass)}` → `background:var(--chapter-accent)`.

`.wipe{... background:var(--paper)}` →

```css
.wipe{position:absolute; inset:0; z-index:5; pointer-events:none; background:var(--wipe-c, var(--paper))}
.wipe--dark{background:var(--wipe-c, var(--dark))}
```

- [ ] **Step 2: data-accent на секциях и цвета шторок в HTML**

- `<section class="chapter hero" data-chapter="00">` → `... data-chapter="00" data-accent="#A16207">`
- `<section class="chapter" data-chapter="01">` → `... data-accent="#3F6212">`
- `<section class="chapter chapter--dark" data-chapter="02">` → `... data-accent="#FB7185">`; его `<div class="wipe" aria-hidden="true"></div>` → `<div class="wipe" style="--wipe-c:#9F1239" aria-hidden="true"></div>`
- `<section class="chapter chapter--dark" data-chapter="03">` → `... data-accent="#67E8F9">`; его wipe → `<div class="wipe" style="--wipe-c:#155E75" aria-hidden="true"></div>`
- `<section class="chapter" data-chapter="04">` → `... data-accent="#9A3412">`; его `<div class="wipe wipe--dark" aria-hidden="true"></div>` → `<div class="wipe wipe--dark" style="--wipe-c:#9A3412" aria-hidden="true"></div>`
- `<section class="chapter" data-chapter="05">` → `... data-accent="#A16207">`

(Материалы/Журнал получат свои data-accent в Task 8/9.)

- [ ] **Step 3: Скраб-перелив --chapter-accent (JS)**

В блоке `if (motionOK) {` после цикла `$$('.wipe').forEach(...)` добавить:

```js
  /* --- пигменты глав: перелив --chapter-accent на границах --- */
  const accEls = $$('[data-accent]');
  accEls.forEach((el, i) => {
    const prev = i ? accEls[i - 1].dataset.accent : '#A16207';
    gsap.fromTo(document.documentElement, { '--chapter-accent': prev }, {
      '--chapter-accent': el.dataset.accent, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 30%', scrub: true }
    });
  });
```

- [ ] **Step 4: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | tail -3`
Expected: чек «пигменты: --chapter-accent и ≥4 data-accent» — PASS; остальные новые — по-прежнему FAIL.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): цветные главы — пигменты, перелив --chapter-accent, цветные шторки"
```

---

### Task 3: Глава 03 — удаление Three.js, анатомия (статика) + студия цвета

**Files:**
- Modify: `templates/ecommerce/index.html` — head (:11-21), duotone CSS (:184-193), planche CSS (:204-237), planche markup (:526-560), RM CSS (:410-417), responsive CSS (:420-424), JS: HELPERS (:750-760), весь Three.js блок (:1240-1401)

**Фото (проверить curl до вставки):**
- Анатомия + студия «Море»: `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80`
- Студия «Песок»: `https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80`
- Студия «Графит» кандидаты: `photo-1600185365483-26d7a4cc7519`, `photo-1542291026-7eec264c27ff`, `photo-1595950653106-6c9ebd614d3a` (все `?w=1200&q=80`)

- [ ] **Step 1: Проверить фото**

Run:
```bash
for u in "photo-1549298916-b41d501d3772" "photo-1560769629-975ec94e6a86" "photo-1600185365483-26d7a4cc7519" "photo-1542291026-7eec264c27ff" "photo-1595950653106-6c9ebd614d3a"; do
  code=$(curl -sfI -o /dev/null -w '%{http_code}' "https://images.unsplash.com/$u?w=1200&q=80"); echo "$u -> $code"
done
```
Expected: все 200. «Графит» = первый из кандидатов с 200. Далее в коде — `$GRAPHITE`.

- [ ] **Step 2: Удалить importmap и лишний preload из head**

Удалить строки:

```html
<script type="importmap">
{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/"
} }
</script>
```

Preload-ссылки: оставить только первые два образа (см. Task 5 — там же; здесь НЕ трогаем, чтобы не смешивать правки).

- [ ] **Step 3: Дуотон — убрать transform из transition и .planche-fallback**

Заменить блок `/* ================= DUOTONE ... */` целиком на:

```css
/* ================= DUOTONE (архивная обработка фото) ================= */
/* transform НЕ в общей transition: CSS-transition на transform конфликтует с
   gsap-твинами (clip-reveal) — это и был источник «бесконечного зума» */
.hero-media img, .look-media img, .product-media img,
.modal-media img, .modal-thumb img, .cart-item img{
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(1.02);
  transition:filter .6s var(--ease-cine);
}
.chapter--dark .look-media img, .anatomy-plate img{
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(.95);
}
.look:hover .look-media img, .product:hover .product-media img{filter:none}
```

- [ ] **Step 4: Заменить CSS блока PLANCHE на CSS анатомии и студии**

Удалить весь блок `/* ================= PLANCHE (03) ================= */` (правила `.planche-grid` … `.swatch-name`), кроме `.swatches`/`.swatch` — их сохранить в новом виде. Вставить на его место:

```css
/* ================= PLANCHE 03: ANATOMY (акт 1) ================= */
.anatomy{position:relative}
.anatomy-stage{
  position:relative; height:100vh; min-height:560px;
  display:flex; align-items:center; justify-content:center; overflow:hidden;
}
.anatomy-frame{position:relative; width:min(58vh,460px); aspect-ratio:4/5}
.anatomy-plate{position:absolute; inset:0; margin:0; overflow:hidden; will-change:transform}
.anatomy-plate img{width:100%; height:100%; object-fit:cover}
.anatomy-plate:nth-child(1){clip-path:inset(0 0 75% 0)}
.anatomy-plate:nth-child(2){clip-path:inset(25% 0 50% 0)}
.anatomy-plate:nth-child(3){clip-path:inset(50% 0 25% 0)}
.anatomy-plate:nth-child(4){clip-path:inset(75% 0 0 0)}
.anatomy-caps{position:absolute; inset:0; margin:0; padding:0; list-style:none; pointer-events:none}
.anatomy-caps li{position:absolute; max-width:230px; color:var(--dark-ink-2)}
.anatomy-caps li b{color:var(--dark-ink); font-weight:500}
.anatomy-caps li::before{content:""; position:absolute; top:.75em; width:44px; height:1px; background:var(--dark-line)}
.anatomy-caps li:nth-child(odd){left:7%; text-align:right}
.anatomy-caps li:nth-child(odd)::before{right:-52px}
.anatomy-caps li:nth-child(even){right:7%}
.anatomy-caps li:nth-child(even)::before{left:-52px}
.anatomy-caps li:nth-child(1){top:12%}
.anatomy-caps li:nth-child(2){top:36%}
.anatomy-caps li:nth-child(3){top:60%}
.anatomy-caps li:nth-child(4){top:84%}

/* ================= PLANCHE 03: STUDIO (акт 2) ================= */
.studio{padding:120px 0 0}
.studio-grid{display:grid; grid-template-columns:1.15fr 1fr; gap:64px; align-items:center}
.studio-media{position:relative; aspect-ratio:4/3; overflow:hidden}
.studio-photo{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  opacity:0; transition:opacity .7s var(--ease-cine);
}
.studio-photo.is-active{opacity:1}
.studio-side{display:flex; flex-direction:column; gap:22px; align-items:flex-start}
.studio-kicker{color:var(--chapter-accent)}
.studio-name{font-size:clamp(2.4rem,4vw,3.6rem); line-height:1}
.studio-specs{list-style:none; width:100%}
.studio-specs li{padding:12px 0; border-top:1px solid var(--dark-line); color:var(--dark-ink-2)}
.studio-specs li b{color:var(--dark-ink); font-weight:500}
.swatches{display:flex; gap:12px; align-items:center}
.swatch{
  width:30px; height:30px; border-radius:50%; background:var(--c);
  border:1px solid var(--dark-line); transition:transform .2s, outline-color .2s;
}
.swatch:hover{transform:scale(1.15)}
.swatch.active{outline:1px solid var(--chapter-accent); outline-offset:3px}
.studio-note{color:var(--dark-ink-2); font-size:15px; max-width:36ch}
```

- [ ] **Step 5: Заменить разметку главы 03**

Заменить всё содержимое `<section class="chapter chapter--dark" data-chapter="03" data-accent="#67E8F9"> … </section>` (wipe и numeral остаются!) на:

```html
    <div class="wipe" style="--wipe-c:#155E75" aria-hidden="true"></div>
    <span class="chapter-numeral" aria-hidden="true">03</span>
    <div class="container">
      <p class="mono chapter-index"><b>03</b> / Planche</p>
      <h2 data-mask>Archive Runner — анатомия</h2>
    </div>

    <!-- Акт 1: exploded-анатомия NR-0202 -->
    <div class="anatomy" id="anatomy">
      <div class="anatomy-stage">
        <div class="anatomy-frame">
          <figure class="anatomy-plate"><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="Archive Runner — верх, переработанный текстиль" loading="lazy"></figure>
          <figure class="anatomy-plate"><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="" aria-hidden="true" loading="lazy"></figure>
          <figure class="anatomy-plate"><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="" aria-hidden="true" loading="lazy"></figure>
          <figure class="anatomy-plate"><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="" aria-hidden="true" loading="lazy"></figure>
        </div>
        <ul class="anatomy-caps mono">
          <li><b>Верх</b> — переработанный текстиль · 87%</li>
          <li><b>Подошва</b> — пена EVA</li>
          <li><b>Вес</b> — <span class="scramble" data-final="290 г">290 г</span></li>
          <li><b>Артикул</b> — NR-0202</li>
        </ul>
      </div>
    </div>

    <!-- Акт 2: студия цвета -->
    <div class="studio" id="studio">
      <div class="container studio-grid">
        <div class="studio-media">
          <img class="studio-photo is-active" data-way="0" src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80" alt="Archive Runner — колорвей Море" loading="eager">
          <img class="studio-photo" data-way="1" src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80" alt="Archive Runner — колорвей Песок" loading="lazy">
          <img class="studio-photo" data-way="2" src="$GRAPHITE" alt="Archive Runner — колорвей Графит" loading="lazy">
        </div>
        <div class="studio-side">
          <p class="mono studio-kicker">Студия цвета</p>
          <h3 class="studio-name" id="studioName">Море</h3>
          <ul class="studio-specs mono">
            <li>Верх — <b>переработанный текстиль</b></li>
            <li>Подошва — <b>пена EVA</b></li>
            <li>Вес — <b class="scramble" data-final="290 г">290 г</b></li>
            <li>Переработано — <b class="scramble" data-final="87%">87%</b></li>
            <li>Артикул — <b>NR-0202</b></li>
          </ul>
          <div class="swatches studio-swatches">
            <button class="swatch active" type="button" data-way="0" style="--c:#2E4A5B" aria-pressed="true" aria-label="Колорвей Море"></button>
            <button class="swatch" type="button" data-way="1" style="--c:#C9A227" aria-pressed="false" aria-label="Колорвей Песок"></button>
            <button class="swatch" type="button" data-way="2" style="--c:#232120" aria-pressed="false" aria-label="Колорвей Графит"></button>
          </div>
          <p class="studio-note">Единственный силуэт выпуска с прошивкой «ёлочкой» — второй такой партии не будет.</p>
          <button class="btn btn-primary" type="button" id="studioAdd" data-magnetic>В корзину — 11 900 ₽</button>
        </div>
      </div>
    </div>
```

- [ ] **Step 6: Responsive и RM для новых блоков (CSS)**

В `@media (max-width:1100px)` удалить строки `.planche-grid{...}` и `.swatches{grid-column:1}`, добавить:

```css
  .studio-grid{grid-template-columns:1fr; gap:40px}
```

В `@media (max-width:720px)` добавить:

```css
  .anatomy-frame{width:74vw}
  .anatomy-caps li{max-width:34vw; font-size:10px}
  .anatomy-caps li:nth-child(odd){left:3%}
  .anatomy-caps li:nth-child(even){right:3%}
  .anatomy-caps li::before{display:none}
  .studio{padding:80px 0 0}
```

В блок `@media (prefers-reduced-motion: reduce)` добавить:

```css
  .anatomy-caps{position:static; display:flex; flex-direction:column; gap:10px; padding:24px 20px 0; pointer-events:auto}
  .anatomy-caps li{position:static; max-width:none; text-align:left}
  .anatomy-caps li::before{display:none}
  .anatomy-stage{height:auto; min-height:0; flex-direction:column; padding:40px 0}
  #cursor{display:none !important}
```

- [ ] **Step 7: Scramble-хелпер (JS, вне motionOK)**

В секцию HELPERS (после `const byId = …`) добавить:

```js
/* scramble-перебор: цифры/буквы «расшифровываются» в финальный текст */
const SCRAMBLE_CHARS = '0123456789—·ABCDEF';
function scrambleText(el, finalText, dur = 800) {
  if (reducedMotion) { el.textContent = finalText; return; }
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const keep = Math.floor(p * finalText.length);
    el.textContent = finalText.slice(0, keep) + finalText.slice(keep).replace(/[^\s]/g, () =>
      SCRAMBLE_CHARS[Math.random() * SCRAMBLE_CHARS.length | 0]);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = finalText;
  })(t0);
}
```

- [ ] **Step 8: Удалить Three.js-блок, добавить студийную логику (JS)**

Удалить весь JS от строки `/* ================= PLANCHE (03) — Three.js ================= */` до конца функции `initPlanche` (бывшие строки 1240–1401). Вставить на их место (перед `</script>`):

```js
/* ================= PLANCHE 03: СТУДИЯ ЦВЕТА ================= */
const STUDIO_WAYS = [
  { name: 'Море',   bg: '#1B2B33' },
  { name: 'Песок',  bg: '#2B251B' },
  { name: 'Графит', bg: '#151412' }
];
const studioEl = $('#studio');
let studioWay = 0;

function setStudioWay(i) {
  if (i === studioWay) return;
  studioWay = i;
  const way = STUDIO_WAYS[i];
  $$('.studio-photo').forEach(p => p.classList.toggle('is-active', p.dataset.way == i));
  $$('.studio-swatches .swatch').forEach(b => {
    const on = b.dataset.way == i;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  scrambleText($('#studioName'), way.name, 500);
  $$('.studio-specs .scramble').forEach(el => scrambleText(el, el.dataset.final, 700));
  if (window.gsap && !reducedMotion) gsap.to(studioEl, { backgroundColor: way.bg, duration: .8, ease: 'power2.out' });
  else studioEl.style.backgroundColor = way.bg;
}

$$('.studio-swatches .swatch').forEach(b =>
  b.addEventListener('click', () => setStudioWay(+b.dataset.way)));

$('#studioAdd').addEventListener('click', () => {
  const p = byId(4);  // Archive Runner = Retro Runner, NR-0202
  const sizes = SIZES[p.cat];
  addToCart(p.id, sizes[Math.floor(sizes.length / 2)]);
  openDrawer();
  toast(`${p.unit} · ${STUDIO_WAYS[studioWay].name} → Корзина`);
});
```

- [ ] **Step 9: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёные — «3D и planche удалены», «анатомия: 4 плашки», «анатомия: 4 подписи спек», «спеки анатомии присутствуют», «студия: 3 фото», «3 swatch», «студия: свотч меняет колорвей», «студия: фон переливается». FAIL остаются на 02/04/новых секциях.

- [ ] **Step 10: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): глава 03 без 3D — exploded-анатомия + студия цвета (статика и логика)"
```

---

### Task 4: Глава 03 — моушн анатомии (pinned scrub)

**Files:**
- Modify: `templates/ecommerce/index.html` — motion-блок `if (motionOK)`, после блока pinned лукбук-дрейфа (порядок создания пинов = порядок в DOM: 02 → анатомия 03)

- [ ] **Step 1: Pinned таймлайн анатомии + scramble при входе**

Внутри `if (motionOK) { … }` сразу после блока «глава 02: pinned лукбук-дрейф» добавить:

```js
  /* --- глава 03, акт 1: exploded-анатомия (explode → hold → assemble) --- */
  {
    const plates = $$('.anatomy-plate');
    const caps = $$('.anatomy-caps li');
    if (plates.length === 4) {
      const off = () => innerHeight * 0.34;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#anatomy', start: 'top top', end: '+=250%',
          pin: true, scrub: 0.6, anticipatePin: true, invalidateOnRefresh: true
        }
      });
      tl.to(plates[0], { y: () => -off() * 1.35, ease: 'none' }, 0)
        .to(plates[1], { y: () => -off() * 0.45, ease: 'none' }, 0)
        .to(plates[2], { y: () => off() * 0.45, ease: 'none' }, 0)
        .to(plates[3], { y: () => off() * 1.35, ease: 'none' }, 0)
        .fromTo(caps, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.18, ease: 'none' }, 0.10)
        .to({}, { duration: 0.28 })  // hold: разобранное состояние
        .to(caps, { autoAlpha: 0, y: -14, duration: 0.14, ease: 'none' })
        .to(plates, { y: 0, duration: 0.34, ease: 'none' }, '<');
    }
    /* scramble спек при первом входе в анатомию */
    ScrollTrigger.create({
      trigger: '#anatomy', start: 'top 60%', once: true,
      onEnter: () => $$('.anatomy-caps .scramble').forEach(el => scrambleText(el, el.dataset.final, 900))
    });
    /* scramble спек студии при входе */
    ScrollTrigger.create({
      trigger: '#studio', start: 'top 70%', once: true,
      onEnter: () => $$('.studio-specs .scramble').forEach(el => scrambleText(el, el.dataset.final, 900))
    });
  }
```

- [ ] **Step 2: Прогон QA тремя режимами + кадры**

Run:
```bash
python3 scripts/qa-norde.py --shot 2>&1 | tail -2
python3 scripts/qa-norde.py --rm 2>&1 | tail -2
```
Expected: RESULT: PASS для всех зелёных ранее чеков (красные — только ещё не реализованные 02/04/секции; харнесс в целом вернёт FAIL-строки, это норма до Task 12). Открыть `/tmp/norde-qa-ch03.png` — анатомия/студия без артефактов (в RM — собранное фото + подписи списком).

- [ ] **Step 3: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): анатомия — pinned explode/assemble, scramble спек при входе"
```

---

### Task 5: Глава 02 — компоновка ленты (образ целиком, интерлюдии, eager/lazy)

**Files:**
- Modify: `templates/ecommerce/index.html` — head preload (:11-14), LOOKBOOK CSS (:156-168), responsive `.look` (:440), LOOKS data (:738-745), `renderLooks()` (:1038-1052), статичный fallback в разметке (:515-521)

- [ ] **Step 1: CSS — кадр 3:4 по высоте вьюпорта + интерлюдии**

Заменить правила `.look`, `.look-media`, `.look figcaption` на:

```css
.look{flex:0 0 auto; display:flex; flex-direction:column}
.look-media{position:relative; height:min(72vh,780px); aspect-ratio:3/4; overflow:hidden; cursor:pointer}
.look-media img{width:100%; height:100%; object-fit:cover}
.look-view{
  position:absolute; left:50%; bottom:14px; transform:translate(-50%,8px);
  padding:10px 18px; background:rgba(22,20,18,.72); color:var(--dark-ink);
  font:500 10px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.06em;
  opacity:0; transition:opacity .25s, transform .25s; pointer-events:none;
}
.look:hover .look-view, .look-media:focus-visible .look-view{opacity:1; transform:translate(-50%,0)}
.look figcaption{display:flex; flex-direction:column; gap:10px; padding-top:16px}
.look .mono{color:var(--dark-ink-2)}
.look .mono b{color:var(--chapter-accent); font-weight:500}
.look-interlude{
  flex:0 0 auto; align-self:center; max-width:24ch; padding:0 4vw;
  color:var(--dark-ink-2); display:flex; flex-direction:column; gap:14px;
}
.look-interlude .li-no{font:400 clamp(2.4rem,4vw,3.6rem)/1 var(--font-display); color:var(--chapter-accent)}
.look-interlude p:last-child{font-size:15px; line-height:1.6}
```

В `@media (max-width:720px)` заменить `.look{flex-basis:78vw}` на:

```css
  .look-media{height:58vh}
  .look-interlude{max-width:60vw; padding:0 6vw}
```

- [ ] **Step 2: LOOKS — шестой образ «Утро», eager только первым двум**

В `LOOKS` заменить `{ n: 6, title: 'Look n°6 — Свет', … }` на `{ n: 6, title: 'Look n°6 — Утро', … }` (img и items `[3, 5]` оставить).

- [ ] **Step 3: renderLooks — интерлюдии, eager/lazy, кнопка просмотра**

Заменить функцию `renderLooks()` целиком:

```js
const LOOK_MOODS = {
  2: 'Студия — свет как материал',
  3: 'Дом — вещи, которые живут дольше нас',
  4: 'Путь — слои против ветра',
  5: 'Вечер — архив при лампах',
  6: 'Утро — первый кофе, последний слой'
};

function renderLooks() {
  lookTrack.innerHTML = LOOKS.map((l, i) => {
    const prods = l.items.map(byId).filter(Boolean);
    const items = prods.map(p => `${p.name} (${p.unit})`).join(' · ');
    const loading = i < 2 ? 'eager' : 'lazy';
    const interlude = i === 0 ? '' : `
    <div class="look-interlude" aria-hidden="true">
      <span class="li-no">0${l.n}</span>
      <p class="mono">Look n°${l.n}</p>
      <p>${LOOK_MOODS[l.n] || ''}</p>
    </div>`;
    return interlude + `
    <figure class="look" data-look="${l.n}">
      <div class="look-media" data-cursor="Смотреть образ" tabindex="0" role="button" aria-label="${l.title} — открыть образ">
        <img src="${l.img}" alt="${l.title}" loading="${loading}">
        <span class="look-view">Смотреть образ</span>
      </div>
      <figcaption>
        <p class="mono"><b>Look n°${l.n}</b></p>
        <p class="look-items mono">${items}</p>
        <button class="btn btn-ghost look-add" type="button" data-look="${l.n}">Образ в корзину</button>
      </figcaption>
    </figure>`;
  }).join('');
}
```

Статичный fallback в разметке (`<!-- статичный fallback … -->` — 6 `<figure class="look">…`): удалить 4 последних figure, оставить 2 первых (no-JS витрина), и у их `<img>` оставить `loading="eager"`. (JS всё равно перезапишет через renderLooks.)

- [ ] **Step 4: Head — preload только 2 образов**

Удалить третью строку preload (`photo-1493663284031-b7e3aefcae8e`), обновить комментарий: `<!-- preload первых двух образов лукбука: они видны при входе в pinned-дрейф -->`.

- [ ] **Step 5: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёные — «лукбук: кадр 3:4 и ≤ 80vh», «интерлюдии в ленте», «первые 2 образа eager, остальные lazy». FAIL остаются на 04/секциях/стейдже.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): лукбук — кадр 3:4 целиком, интерлюдии, eager первым двум"
```

---

### Task 6: Глава 02 — detail-стейдж образа

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка главы 02 (внутрь `<section data-chapter="02">` после `.lookbook-viewport`), CSS (новый блок после LOOKBOOK), JS: обработчики lookbook, Esc-хендлер, `flyClone` хелпер

- [ ] **Step 1: Разметка стейджа**

Внутри `<section class="chapter chapter--dark" data-chapter="02" …>`, сразу после закрывающего `</div>` блока `.lookbook-viewport`, вставить:

```html
    <!-- detail-стейдж образа: overlay внутри pinned-секции, не ломает ScrollTrigger -->
    <div class="look-stage" id="lookStage" aria-hidden="true">
      <div class="look-stage-media" id="lookStageMedia"><img id="lsImg" src="" alt=""></div>
      <aside class="look-stage-panel">
        <p class="mono chapter-index"><b id="lsNo">02</b> / Образ</p>
        <h3 class="ls-title" id="lsTitle"></h3>
        <ul class="ls-items" id="lsItems"></ul>
        <button class="btn btn-primary" type="button" id="lsAddAll" data-magnetic>Образ в корзину</button>
        <button class="look-stage-close mono" type="button" id="lsClose">Закрыть ×</button>
      </aside>
    </div>
```

- [ ] **Step 2: CSS стейджа**

После блока LOOKBOOK CSS добавить:

```css
/* ================= LOOK STAGE (детальный просмотр образа) ================= */
.look-stage{
  position:absolute; inset:0; z-index:6; display:none;
  grid-template-columns:55% 45%; background:var(--dark);
}
.look-stage.open{display:grid}
.look-stage-media{overflow:hidden}
.look-stage-media img{width:100%; height:100%; object-fit:cover}
.look-stage-panel{
  padding:96px 48px 48px; display:flex; flex-direction:column; gap:22px;
  align-items:flex-start; overflow:auto;
}
.ls-title{font-size:clamp(1.8rem,3vw,2.8rem)}
.ls-items{list-style:none; width:100%; display:flex; flex-direction:column}
.ls-items li{
  display:flex; align-items:baseline; gap:14px; padding:14px 0;
  border-top:1px solid var(--dark-line);
}
.ls-items .mono{color:var(--dark-ink-2)}
.ls-name{flex:1; font-size:16px}
.ls-add{
  color:var(--chapter-accent); font-size:11px; letter-spacing:.06em;
  text-transform:uppercase; padding:6px 0;
}
.ls-add:hover{text-decoration:underline; text-underline-offset:4px}
.look-stage-close{color:var(--dark-ink-2); letter-spacing:.06em; text-transform:uppercase; margin-top:auto}
.look-stage-close:hover{color:var(--dark-ink)}
@media (max-width:720px){
  .look-stage.open{grid-template-columns:1fr; grid-template-rows:42% 58%}
  .look-stage-panel{padding:24px 20px 32px; gap:16px}
}
```

- [ ] **Step 3: flyClone-хелпер (JS)**

В секцию HELPERS (после `scrambleText`) добавить:

```js
/* FLIP-перелёт клона из srcImg в dstEl (и обратно) — паттерн перелёта образа → каталог */
function flyClone(srcImg, dstEl, onDone) {
  if (!window.gsap || reducedMotion || !srcImg || !dstEl) { if (onDone) onDone(); return; }
  const r1 = srcImg.getBoundingClientRect();
  const r2 = dstEl.getBoundingClientRect();
  if (!r1.width || !r2.width) { if (onDone) onDone(); return; }
  const clone = srcImg.cloneNode();
  Object.assign(clone.style, {
    position: 'fixed', left: r1.left + 'px', top: r1.top + 'px',
    width: r1.width + 'px', height: r1.height + 'px',
    objectFit: 'cover', zIndex: 95, pointerEvents: 'none', margin: '0', filter: 'none'
  });
  document.body.appendChild(clone);
  gsap.to(clone, {
    x: r2.left - r1.left, y: r2.top - r1.top,
    scaleX: r2.width / r1.width, scaleY: r2.height / r1.height,
    transformOrigin: '0 0', duration: 0.8, ease: 'power3.inOut',
    onComplete: () => { clone.remove(); if (onDone) onDone(); }
  });
}
```

- [ ] **Step 4: Логика стейджа (JS)**

После существующего обработчика `lookTrack.addEventListener('click', …)` добавить:

```js
/* --- detail-стейдж --- */
const lookStage = $('#lookStage');
const lsImg = $('#lsImg');
let stageLook = null;

function openLookStage(n) {
  const look = LOOKS.find(l => l.n === n);
  if (!look) return;
  stageLook = look;
  const prods = look.items.map(byId).filter(Boolean);
  $('#lsNo').textContent = '02.' + look.n;
  $('#lsTitle').textContent = look.title;
  lsImg.src = look.img;
  lsImg.alt = look.title;
  $('#lsItems').innerHTML = prods.map(p => `
    <li>
      <span class="mono">${p.unit}</span>
      <span class="ls-name">${p.name}</span>
      <span class="mono">${fmt(p.price)}</span>
      <button class="ls-add mono" type="button" data-id="${p.id}">+ в корзину</button>
    </li>`).join('');

  const srcImg = $(`.look[data-look="${look.n}"] .look-media img`);
  lsImg.style.visibility = 'hidden';
  lookStage.classList.add('open');
  lookStage.setAttribute('aria-hidden', 'false');
  if (window.__lenis) window.__lenis.stop();
  document.body.style.overflow = 'hidden';
  flyClone(srcImg, $('#lookStageMedia'), () => { lsImg.style.visibility = ''; });
}

function closeLookStage() {
  const srcImg = stageLook ? $(`.look[data-look="${stageLook.n}"] .look-media img`) : null;
  const finish = () => {
    lookStage.classList.remove('open');
    lookStage.setAttribute('aria-hidden', 'true');
    if (window.__lenis) window.__lenis.start();
    document.body.style.overflow = '';
    stageLook = null;
  };
  if (srcImg && lookStage.classList.contains('open')) {
    lsImg.style.visibility = 'hidden';
    flyClone(lsImg, srcImg, finish);
  } else finish();
}

lookTrack.addEventListener('click', e => {
  const media = e.target.closest('.look-media');
  if (media) openLookStage(+media.closest('.look').dataset.look);
});
lookTrack.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const media = e.target.closest('.look-media');
  if (!media) return;
  e.preventDefault();
  openLookStage(+media.closest('.look').dataset.look);
});
$('#lsClose').addEventListener('click', closeLookStage);
$('#lsAddAll').addEventListener('click', () => {
  if (!stageLook) return;
  stageLook.items.forEach(id => {
    const p = byId(id);
    const sizes = SIZES[p.cat];
    addToCart(id, sizes[Math.floor(sizes.length / 2)]);
  });
  toast(`Look n°${stageLook.n} → Корзина (${stageLook.items.length} ${pluralUnits(stageLook.items.length)})`);
});
$('#lsItems').addEventListener('click', e => {
  const btn = e.target.closest('.ls-add');
  if (!btn) return;
  const p = byId(+btn.dataset.id);
  const sizes = SIZES[p.cat];
  addToCart(p.id, sizes[Math.floor(sizes.length / 2)]);
  flyToCart(btn);
  toast(`${p.unit} → Корзина`);
});
```

NB: `flyToCart` появится в Task 7 (HELPERS). Чтобы Task 6 проходил QA до Task 7, добавить `flyToCart` уже здесь — в HELPERS после `flyClone`:

```js
/* микро-перелёт точки в счётчик корзины */
function flyToCart(fromEl) {
  if (!window.gsap || reducedMotion || !fromEl) return;
  const r1 = fromEl.getBoundingClientRect();
  const r2 = cartCountEl.getBoundingClientRect();
  const d = document.createElement('i');
  Object.assign(d.style, {
    position: 'fixed', left: (r1.left + r1.width / 2) + 'px', top: r1.top + 'px',
    width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brass)',
    zIndex: 400, pointerEvents: 'none'
  });
  document.body.appendChild(d);
  gsap.to(d, {
    x: (r2.left + r2.width / 2) - (r1.left + r1.width / 2), y: r2.top - r1.top,
    scale: .4, duration: .6, ease: 'power2.in', onComplete: () => d.remove()
  });
}
```

(`cartCountEl` объявлен ниже в секции CART — JS hoisting: `const` не hoisted, но `flyToCart` вызывается только по клику, после инициализации всего модуля — безопасно.)

- [ ] **Step 5: Esc — стейдж первым**

Заменить существующий Esc-хендлер:

```js
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (lookStage.classList.contains('open')) closeLookStage();
  else if (modal.classList.contains('open')) closeQuickView();
  else if (drawer.classList.contains('open')) closeDrawer();
});
```

- [ ] **Step 6: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"` и `python3 scripts/qa-norde.py --rm 2>&1 | tail -2`
Expected: зелёные — «detail-стейдж открывается», «стейдж: „Образ в корзину“ добавляет 2 товара», «detail-стейдж закрывается по Esc» (в обоих режимах).

- [ ] **Step 7: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): detail-стейдж образа — FLIP-перелёт, состав с покупкой, Esc"
```

---

### Task 7: Глава 04 — зум-фикс, данные, карточки, сортировки, quick-view ×2

**Files:**
- Modify: `templates/ecommerce/index.html` — CATALOG CSS (:239-279), разметка главы 04 (:562-578), PRODUCTS (:686-735), state (:748), renderCatalog + обработчики (:786-818), FILTERS (:820-835), QUICK VIEW разметка (:636-651) и JS (:840-857)

**Фото img2 (проверить curl; первый 200 побеждает):**
- 1 Пальто: `photo-1544022613-e87ca99a784a`, `photo-1591047139829-d91aecb6caea`
- 2 Футболка: `photo-1576566588028-4147f3842f27`, `photo-1583743814966-8936f5b7be1a`
- 3 Кеды: `photo-1525966222134-fcfa99b8ae77`, `photo-1606107557195-0e29a4b5b4aa`
- 4 Ретро: `photo-1595950653106-6c9ebd614d3a`, `photo-1542291026-7eec264c27ff`
- 5 Рюкзак: `photo-1622560480605-d83c853bc5c3`, `photo-1491637639811-60e2756cc1c7`
- 6 Часы: `photo-1524592094714-0f0654e20314`, `photo-1508057198894-247b23fe5ade`
- 7 Кресло: `photo-1567538096630-e0c55bd6374c`, `photo-1592078615290-033ee584e267`
- 8 Диван: `photo-1616486338812-3dadae4b4ace`, `photo-1540574163026-643ea20ade25`

(все `?w=800&q=80`)

- [ ] **Step 1: Проверить img2 кандидатов**

Run:
```bash
for u in photo-1544022613-e87ca99a784a photo-1591047139829-d91aecb6caea photo-1576566588028-4147f3842f27 photo-1583743814966-8936f5b7be1a photo-1525966222134-fcfa99b8ae77 photo-1606107557195-0e29a4b5b4aa photo-1595950653106-6c9ebd614d3a photo-1542291026-7eec264c27ff photo-1622560480605-d83c853bc5c3 photo-1491637639811-60e2756cc1c7 photo-1524592094714-0f0654e20314 photo-1508057198894-247b23fe5ade photo-1567538096630-e0c55bd6374c photo-1592078615290-033ee584e267 photo-1616486338812-3dadae4b4ace photo-1540574163026-643ea20ade25; do
  code=$(curl -sfI -o /dev/null -w '%{http_code}' "https://images.unsplash.com/$u?w=800&q=80"); echo "$u -> $code"
done
```
Зафиксировать победителей как `$IMG2_1`…`$IMG2_8`.

- [ ] **Step 2: CSS — зум-фикс и новые элементы карточки**

Удалить правила `.product{... transition:transform .35s ...}` и `.product:hover{transform:translateY(-4px)}`. Заменить блок CATALOG CSS (от `.filters{` до `.product-price{...}`) на:

```css
/* ================= CATALOG (04) ================= */
.filters{display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px}
.filter-btn{
  position:relative; padding:10px 4px;
  font:500 11px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.06em;
  color:var(--ink-3); transition:color .2s;
}
.filter-btn::after{
  content:""; position:absolute; left:50%; bottom:0; width:4px; height:4px;
  border-radius:50%; background:transparent; transform:translateX(-50%);
}
.filter-btn:hover{color:var(--ink)}
.filter-btn.active{color:var(--chapter-accent)}
.filter-btn.active::after{background:var(--chapter-accent)}
.sort-row{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  flex-wrap:wrap; margin-bottom:48px;
}
.sort-label{color:var(--ink-3)}
.sort-label b{color:var(--ink); font-weight:500}
.sort-btns{display:flex; gap:14px; flex-wrap:wrap}
.sort-btn{
  padding:8px 2px; font:500 11px/1 var(--font-mono); text-transform:uppercase;
  letter-spacing:.06em; color:var(--ink-3); transition:color .2s;
}
.sort-btn:hover{color:var(--ink)}
.sort-btn.active{color:var(--chapter-accent); text-decoration:underline; text-underline-offset:5px}
.catalog-grid{
  display:grid; grid-template-columns:repeat(4,1fr); gap:32px;
  background:transparent;
}
.product{background:var(--paper); display:flex; flex-direction:column; cursor:pointer}
.product-unit{color:var(--ink-3); padding:14px 16px 0}
.product-media{position:relative; overflow:hidden; aspect-ratio:4/5; margin:12px 16px 0;
  clip-path:inset(0 0 100% 0); transition:clip-path .9s var(--ease-cine)}
.product-media.is-in{clip-path:inset(0 0 0 0)}
/* зум — единственный владелец transform у img: CSS, без translateY карточки и без gsap */
.product-media img{width:100%; height:100%; object-fit:cover;
  transition:filter .6s var(--ease-cine), transform .8s cubic-bezier(.22,1,.36,1)}
.product:hover .product-media img{transform:scale(1.06)}
.product-stock{
  position:absolute; top:10px; left:10px; padding:6px 10px;
  background:var(--paper); color:var(--chapter-accent);
  font-size:10px; letter-spacing:.08em;
}
.product-quick{
  position:absolute; left:50%; bottom:12px; transform:translate(-50%,8px);
  padding:10px 18px; background:rgba(250,250,249,.92); color:var(--ink);
  font:500 10px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.06em;
  opacity:0; transition:opacity .25s, transform .25s;
  pointer-events:none;
}
.product:hover .product-quick, .product:focus-visible .product-quick{opacity:1; transform:translate(-50%,0)}
.product-info{padding:16px 16px 8px; display:flex; flex-direction:column; gap:6px}
.product-info .tag{font:500 10px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.08em; color:var(--brass)}
.product-info h3{font-size:19px; line-height:1.25}
.product-material{font-size:13px; color:var(--ink-2)}
.product-row{display:flex; align-items:center; justify-content:space-between; margin-top:4px}
.product-price{font:500 12px/1 var(--font-mono); letter-spacing:.04em}
.product-dots{display:flex; gap:6px}
.product-dots i{width:10px; height:10px; border-radius:50%; background:var(--c); border:1px solid var(--line)}
.product-add{
  align-self:flex-start; margin:4px 16px 16px; padding:8px 0;
  font:500 11px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.06em;
  color:var(--ink-2); transition:color .2s;
}
.product-add:hover{color:var(--chapter-accent); text-decoration:underline; text-underline-offset:4px}
.catalog-note{margin-top:64px; max-width:52ch; color:var(--ink-2); font-size:15px}
```

- [ ] **Step 3: PRODUCTS — новые поля (полная замена массива)**

Заменить весь `const PRODUCTS = [ … ];` (поля id/cat/name/price/unit/img/desc/meta сохранить без изменений, добавить material/colors/stock/img2/added):

```js
const PRODUCTS = [
  {
    id: 1, cat: 'odezhda', name: 'Пальто из шерсти', price: 24900, unit: 'Unit n°041',
    img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    img2: '$IMG2_1',
    material: 'шерсть / кашемир', colors: ['#3B3A36', '#7A7163'], stock: 3, added: 8,
    desc: 'Двубортное пальто из итальянской шерсти с добавлением кашемира. Прямой силуэт, скрытая застёжка, подкладка из вискозы. Садится поверх объёмного свитера.',
    meta: 'Состав: <span>80% шерсть, 20% кашемир</span><br>Уход: <span>химчистка</span><br>Артикул: <span>NR-0101</span>'
  },
  {
    id: 2, cat: 'odezhda', name: 'Футболка Heavyweight', price: 3900, unit: 'Unit n°042',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    img2: '$IMG2_2',
    material: 'органический хлопок 240 г/м²', colors: ['#EDE9E4', '#1C1917', '#5B7553'], stock: null, added: 5,
    desc: 'Плотная футболка из органического хлопка 240 г/м². Слегка свободный крой, усиленный ворот, не скатывается и не вытягивается после стирок.',
    meta: 'Состав: <span>100% органический хлопок</span><br>Уход: <span>стирка 30°</span><br>Артикул: <span>NR-0102</span>'
  },
  {
    id: 3, cat: 'obuv', name: 'Кеды Court Low', price: 14900, unit: 'Unit n°043',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    img2: '$IMG2_3',
    material: 'телятина / каучук Margom', colors: ['#2E4A5B', '#EDE9E4'], stock: null, added: 6,
    desc: 'Минималистичные кеды из гладкой телятины на прошитой маргомной подошве. Съёмная стелька из пробки, никаких логотипов снаружи.',
    meta: 'Верх: <span>натуральная кожа</span><br>Подошва: <span>каучук Margom</span><br>Артикул: <span>NR-0201</span>'
  },
  {
    id: 4, cat: 'obuv', name: 'Кроссовки Retro Runner', price: 11900, unit: 'Unit n°044',
    img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
    img2: '$IMG2_4',
    material: 'переработанный текстиль / EVA', colors: ['#2E4A5B', '#C9A227', '#1C1917'], stock: 2, added: 7,
    desc: 'Ретро-силуэт из комбинации замши и дышащей сетки. Амортизирующая подошва EVA, светоотражающие элементы на пятке.',
    meta: 'Верх: <span>замша, сетка</span><br>Подошва: <span>EVA</span><br>Артикул: <span>NR-0202</span>'
  },
  {
    id: 5, cat: 'aksessuary', name: 'Рюкзак Canvas 20L', price: 8900, unit: 'Unit n°045',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    img2: '$IMG2_5',
    material: 'канвас 18 oz / кожа', colors: ['#5B5248', '#1C1917'], stock: null, added: 3,
    desc: 'Рюкзак из плотного хлопкового канваса с кожаной фурнитурой. Мягкое отделение для ноутбука 15″, водоотталкивающая пропитка.',
    meta: 'Материал: <span>канвас 18 oz, кожа</span><br>Объём: <span>20 л</span><br>Артикул: <span>NR-0301</span>'
  },
  {
    id: 6, cat: 'aksessuary', name: 'Часы Minimal 36', price: 16900, unit: 'Unit n°046',
    img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    img2: '$IMG2_6',
    material: 'сталь 316L / кожа', colors: ['#8B8B8B', '#1C1917'], stock: 1, added: 4,
    desc: 'Кварцевые часы с корпусом из матовой стали 36 мм и ремешком из натуральной кожи. Сапфировое стекло, влагозащита 5 ATM.',
    meta: 'Корпус: <span>сталь 316L, 36 мм</span><br>Механизм: <span>Miyota quartz</span><br>Артикул: <span>NR-0302</span>'
  },
  {
    id: 7, cat: 'dom', name: 'Кресло Rattan Lounge', price: 32900, unit: 'Unit n°047',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    img2: '$IMG2_7',
    material: 'бук / ротанг / лён', colors: ['#A98F6B', '#3B3A36'], stock: null, added: 2,
    desc: 'Кресло из ротанга ручного плетения на каркасе из массива бука. Подушка из льняной ткани в комплекте, съёмный чехол.',
    meta: 'Каркас: <span>массив бука</span><br>Плетение: <span>натуральный ротанг</span><br>Артикул: <span>NR-0401</span>'
  },
  {
    id: 8, cat: 'dom', name: 'Диван Modular 2-Seat', price: 89900, unit: 'Unit n°048',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    img2: '$IMG2_8',
    material: 'букле 74% шерсть / дуб', colors: ['#D8D2C8', '#5B5248'], stock: null, added: 1,
    desc: 'Двухместный модульный диван со съёмными чехлами из букле. Наполнитель — пух и высокоэластичная пена HR, ножки из массива дуба.',
    meta: 'Обивка: <span>букле, 74% шерсть</span><br>Наполнитель: <span>пух / пена HR</span><br>Артикул: <span>NR-0402</span>'
  }
];
```

- [ ] **Step 4: state и сортировки (JS)**

`const state = { filter: 'all', cart: [], qvId: null, qvSize: null };` →

```js
const state = { filter: 'all', sort: 'featured', cart: [], qvId: null, qvSize: null };
```

После `const byId = …` добавить:

```js
const SORTS = {
  'featured':  (a, b) => a.id - b.id,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc':(a, b) => b.price - a.price,
  'new':       (a, b) => b.added - a.added
};
```

- [ ] **Step 5: Разметка главы 04 — сортировки и итог**

После `<div class="filters" id="filters" …>…</div>` вставить:

```html
      <div class="sort-row mono">
        <span class="sort-label">Показано <b id="shownCount" aria-live="polite">8</b> из 8</span>
        <div class="sort-btns" role="group" aria-label="Сортировка">
          <button class="sort-btn active" type="button" data-sort="featured" aria-pressed="true">Как в архиве</button>
          <button class="sort-btn" type="button" data-sort="price-asc" aria-pressed="false">Цена ↑</button>
          <button class="sort-btn" type="button" data-sort="price-desc" aria-pressed="false">Цена ↓</button>
          <button class="sort-btn" type="button" data-sort="new" aria-pressed="false">Новизна</button>
        </div>
      </div>
```

После `<div class="catalog-grid" id="catalogGrid"></div>` вставить:

```html
      <p class="catalog-note">Все единицы производятся малыми партиями. Если вашего размера нет — напишите, пошьём под заказ за три недели.</p>
```

- [ ] **Step 6: renderCatalog + updateCatalog (FLIP) + обработчики**

Заменить `renderCatalog()` целиком:

```js
function renderCatalog() {
  const items = PRODUCTS
    .filter(p => state.filter === 'all' || p.cat === state.filter)
    .sort(SORTS[state.sort] || SORTS.featured);
  $('#shownCount').textContent = items.length;
  grid.innerHTML = items.map(p => `
    <article class="product" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name} — быстрый просмотр">
      <div class="product-media" data-cursor="Быстрый просмотр">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.stock != null && p.stock <= 3 ? `<span class="product-stock mono">Осталось ${p.stock}</span>` : ''}
        <button class="product-quick" type="button" data-id="${p.id}">Быстрый просмотр</button>
      </div>
      <div class="product-info">
        <span class="product-unit mono">${p.unit} — ${CATS[p.cat]}</span>
        <h3>${p.name}</h3>
        <p class="product-material">${p.material}</p>
        <div class="product-row">
          <div class="product-price mono">${fmt(p.price)}</div>
          <div class="product-dots">${p.colors.map(c => `<i style="--c:${c}"></i>`).join('')}</div>
        </div>
      </div>
      <button class="product-add mono" type="button" data-add="${p.id}">+ в корзину</button>
    </article>`).join('');
  /* наблюдаем карточку, а не сам media-блок: его clip-path обнуляет intersectionRatio */
  $$('.product', grid).forEach(card => {
    const m = $('.product-media', card);
    if (mediaIO) mediaIO.observe(card);
    else if (m) m.classList.add('is-in');
  });
}

/* перестановка/фильтрация с ручным FLIP: ушедшие позиции → новые */
function updateCatalog() {
  const first = new Map($$('.product', grid).map(c => [c.dataset.id, c.getBoundingClientRect()]));
  renderCatalog();
  if (reducedMotion || !window.gsap) return;
  $$('.product', grid).forEach((c, i) => {
    const f = first.get(c.dataset.id);
    const l = c.getBoundingClientRect();
    if (f && (Math.round(f.left) !== Math.round(l.left) || Math.round(f.top) !== Math.round(l.top))) {
      gsap.fromTo(c, { x: f.left - l.left, y: f.top - l.top }, { x: 0, y: 0, duration: .5, ease: 'power3.out' });
    } else if (!f) {
      gsap.fromTo(c, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, delay: i * 0.03, ease: 'power2.out' });
    }
  });
}
```

Заменить обработчики клика/клавиатуры по `grid`:

```js
grid.addEventListener('click', e => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    const p = byId(+addBtn.dataset.add);
    const sizes = SIZES[p.cat];
    addToCart(p.id, sizes[Math.floor(sizes.length / 2)]);
    flyToCart(addBtn);
    toast(`${p.unit} → Корзина`);
    return;
  }
  const card = e.target.closest('.product');
  if (card) openQuickView(parseInt(card.dataset.id, 10));
});
grid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  if (e.target.closest('button')) return;  /* у нативных кнопок своё поведение */
  const card = e.target.closest('.product');
  if (!card) return;
  e.preventDefault();
  openQuickView(parseInt(card.dataset.id, 10));
});
```

`setFilter` заменить на:

```js
function setFilter(cat) {
  state.filter = cat;
  $$('.filter-btn', filtersWrap).forEach(b =>
    b.classList.toggle('active', b.dataset.filter === cat));
  updateCatalog();
}
```

После `filtersWrap.addEventListener(…)` добавить:

```js
$('#sortRow') && $$('.sort-btn').forEach(b => b.addEventListener('click', () => {
  state.sort = b.dataset.sort;
  $$('.sort-btn').forEach(x => {
    const on = x === b;
    x.classList.toggle('active', on);
    x.setAttribute('aria-pressed', String(on));
  });
  updateCatalog();
}));
```

- [ ] **Step 7: Quick-view — второе фото (разметка + JS)**

В разметке модалки заменить `<div class="modal-media"><img id="qvImg" src="" alt=""></div>` на:

```html
    <div class="modal-media">
      <img id="qvImg" src="" alt="">
      <div class="modal-thumbs">
        <button class="modal-thumb is-active" type="button" data-thumb="0" aria-label="Фото 1"><img id="qvThumb0" src="" alt=""></button>
        <button class="modal-thumb" type="button" data-thumb="1" aria-label="Фото 2"><img id="qvThumb1" src="" alt=""></button>
      </div>
    </div>
```

CSS (после `.modal-media img{…}`):

```css
.modal-thumbs{position:absolute; left:12px; bottom:12px; display:flex; gap:8px}
.modal-thumb{width:56px; height:70px; overflow:hidden; border:1px solid var(--line); opacity:.65; transition:opacity .2s, border-color .2s}
.modal-thumb img{width:100%; height:100%; object-fit:cover}
.modal-thumb.is-active{opacity:1; border-color:var(--brass)}
.modal-media{position:relative}
```

В `openQuickView` после `$('#qvImg').alt = p.name;` добавить:

```js
  $('#qvImg').dataset.cur = p.img;
  $('#qvThumb0').src = p.img;
  const t1 = $('.modal-thumb[data-thumb="1"]');
  if (p.img2) { $('#qvThumb1').src = p.img2; t1.style.display = ''; }
  else t1.style.display = 'none';
  $$('.modal-thumb').forEach(t => t.classList.toggle('is-active', t.dataset.thumb === '0'));
```

После обработчика `$('#qvSizes').addEventListener(…)` добавить:

```js
$$('.modal-thumb').forEach(t => t.addEventListener('click', () => {
  const src = t.dataset.thumb === '0' ? byId(state.qvId).img : byId(state.qvId).img2;
  if (!src) return;
  $('#qvImg').src = src;
  $$('.modal-thumb').forEach(x => x.classList.toggle('is-active', x === t));
}));
```

- [ ] **Step 8: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёные — «зум-фикс», «бейдж дефицита», «материал на карточке», «счётчик показано», «сортировка цена ↓», «+ в корзину с карточки», «quick-view: два фото», фильтры, вся цепочка корзины.

- [ ] **Step 9: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): каталог — зум-фикс, сортировки с FLIP, насыщенные карточки, quick-view ×2"
```

---

### Task 8: Прил. А — Материалы

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка между главами 03 и 04, CSS (новый блок), responsive, motion JS (проявление в цвет)

**Фото (первый 200 побеждает, `?w=800&q=80`):**
- Шерсть: `photo-1620799140408-edc6dcb6d633`, `photo-1615887023544-2f566f46e3a7`
- Переработанный текстиль: `photo-1537832816519-689ad163238b`, `photo-1558769132-cb1aea458c5e`
- Хлопок: `photo-1521572163474-6864f9cf17ab` (проверен)
- Букле: `photo-1584100936595-c0654b55a2e2`, `photo-1555041469-a586c61ea9bc` (проверен)

- [ ] **Step 1: Проверить фото**

Run:
```bash
for u in photo-1620799140408-edc6dcb6d633 photo-1615887023544-2f566f46e3a7 photo-1537832816519-689ad163238b photo-1558769132-cb1aea458c5e photo-1584100936595-c0654b55a2e2; do
  code=$(curl -sfI -o /dev/null -w '%{http_code}' "https://images.unsplash.com/$u?w=800&q=80"); echo "$u -> $code"
done
```
Зафиксировать `$MAT_WOOL`, `$MAT_RECO`, `$MAT_BOUCLE`.

- [ ] **Step 2: Разметка секции**

Между `</section>` главы 03 и `<section … data-chapter="04">` вставить:

```html
  <!-- ================= ПРИЛ. А — МАТЕРИАЛЫ ================= -->
  <section class="chapter" data-chapter="materials" data-accent="#4D7C0F">
    <span class="chapter-numeral" aria-hidden="true">А</span>
    <div class="container">
      <p class="mono chapter-index"><b>Прил. А</b> / Материалы</p>
      <h2 data-mask>Из чего сделан архив</h2>
      <div class="materials-row">
        <article class="material-card">
          <figure class="material-media"><img src="$MAT_WOOL" alt="Шерсть Merino 21 мкм — макро" loading="lazy"></figure>
          <p class="mono material-no">М.1</p>
          <h3>Шерсть Merino 21 мкм</h3>
          <p>Италия, Бьелла. Гребенная пряжа, супервош — можно стирать дома.</p>
          <p class="mono material-used">Используется в: Unit n°041</p>
        </article>
        <article class="material-card">
          <figure class="material-media"><img src="$MAT_RECO" alt="Переработанный текстиль — макро" loading="lazy"></figure>
          <p class="mono material-no">М.2</p>
          <h3>Переработанный текстиль</h3>
          <p>Волокно из собранных ПЭТ-бутылок, 87% состава. Плотное плетение ripstop.</p>
          <p class="mono material-used">Используется в: NR-0202</p>
        </article>
        <article class="material-card">
          <figure class="material-media"><img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" alt="Органический хлопок 240 г/м²" loading="lazy"></figure>
          <p class="mono material-no">М.3</p>
          <h3>Органический хлопок 240</h3>
          <p>Турция, Измир. Плотность 240 г/м² — футболка держит форму годами.</p>
          <p class="mono material-used">Используется в: Unit n°042</p>
        </article>
        <article class="material-card">
          <figure class="material-media"><img src="$MAT_BOUCLE" alt="Букле 74% шерсть — макро" loading="lazy"></figure>
          <p class="mono material-no">М.4</p>
          <h3>Букле 74% шерсть</h3>
          <p>Фактурная обивка с петельной поверхностью. Съёмные чехлы, стирка 30°.</p>
          <p class="mono material-used">Используется в: Unit n°048</p>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: CSS**

```css
/* ================= MATERIALS (Прил. А) ================= */
.materials-row{display:grid; grid-template-columns:repeat(4,1fr); gap:32px}
.material-card{display:flex; flex-direction:column; gap:10px}
.material-media{aspect-ratio:3/4; overflow:hidden; margin-bottom:8px}
.material-media img{width:100%; height:100%; object-fit:cover;
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(1.02);
  transition:filter 1s var(--ease-cine)}
.material-card.is-color .material-media img{filter:none}
.material-no{color:var(--chapter-accent)}
.material-card h3{font-size:22px}
.material-card p{font-size:14px; color:var(--ink-2)}
.material-used{color:var(--ink-3); margin-top:auto; padding-top:10px}
```

В `@media (max-width:1100px)`: `.materials-row{grid-template-columns:repeat(2,1fr)}`. В `@media (max-width:720px)`: `.materials-row{grid-template-columns:1fr}`. В RM-блок: `.material-media img, .journal-media img{filter:none}`.

- [ ] **Step 4: Проявление в цвет по скроллу (JS, motionOK)**

Внутри `if (motionOK)` после clip-reveal блока добавить:

```js
  /* --- материалы и журнал: проявление grayscale→color при входе --- */
  ScrollTrigger.batch('.material-card, .journal-card', {
    start: 'top 78%', once: true,
    onEnter: els => els.forEach((el, i) => setTimeout(() => el.classList.add('is-color'), i * 120))
  });
```

- [ ] **Step 5: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёные — «материалы: 4 карточки», «материалы: дуотон до проявления», «нумералы: 01 02 03 А 04 Б 05» всё ещё FAIL (нет Б), «8 секций» FAIL (7 из 8).

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): Прил. А «Материалы» — библиотека тканей, проявление в цвет"
```

---

### Task 9: Прил. Б — Журнал

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка между marquee после 04 и главой 05, CSS, ARTICLES data + overlay JS, Esc-хендлер

**Фото (`?w=800&q=80`, первый 200):**
- Стиль: `photo-1489987707025-afc232f7bdaf`, `photo-1483985988355-763728e1935b` (проверен)
- Уход: `photo-1545173168-9f1947eebb7f`, `photo-1445205170230-053b83016050` (проверен)
- Производство: `photo-1558769132-cb1aea458c5e`, `photo-1537832816519-689ad163238b`

- [ ] **Step 1: Проверить фото**

Run:
```bash
for u in photo-1489987707025-afc232f7bdaf photo-1545173168-9f1947eebb7f photo-1558769132-cb1aea458c5e photo-1537832816519-689ad163238b; do
  code=$(curl -sfI -o /dev/null -w '%{http_code}' "https://images.unsplash.com/$u?w=800&q=80"); echo "$u -> $code"
done
```
Зафиксировать `$J_STYLE`, `$J_CARE`, `$J_MAKE`.

- [ ] **Step 2: Разметка секции + overlay**

Между marquee после главы 04 и `<section … data-chapter="05">` вставить:

```html
  <!-- ================= ПРИЛ. Б — ЖУРНАЛ ================= -->
  <section class="chapter" data-chapter="journal" data-accent="#475569">
    <span class="chapter-numeral" aria-hidden="true">Б</span>
    <div class="container">
      <p class="mono chapter-index"><b>Прил. Б</b> / Журнал</p>
      <h2 data-mask>Записки архивариуса</h2>
      <div class="journal-grid" id="journalGrid"></div>
    </div>
  </section>
```

Overlay — после `</main>`, перед `<footer>`:

```html
<!-- ================= JOURNAL OVERLAY ================= -->
<div class="journal-overlay" id="journalOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Статья журнала">
  <div class="journal-paper">
    <button class="journal-close mono" type="button" id="journalClose">Закрыть ×</button>
    <p class="mono journal-meta" id="joMeta"></p>
    <h3 id="joTitle"></h3>
    <div class="journal-text" id="joText"></div>
  </div>
</div>
```

- [ ] **Step 3: CSS**

```css
/* ================= JOURNAL (Прил. Б) ================= */
.journal-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:40px}
.journal-card{display:flex; flex-direction:column; gap:12px}
.journal-media{aspect-ratio:16/10; overflow:hidden; margin-bottom:6px}
.journal-media img{width:100%; height:100%; object-fit:cover;
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(1.02);
  transition:filter 1s var(--ease-cine)}
.journal-card.is-color .journal-media img{filter:none}
.journal-meta{color:var(--chapter-accent)}
.journal-card h3{font-size:26px; line-height:1.15}
.journal-lead{font-size:15px; color:var(--ink-2)}
.journal-read{
  align-self:flex-start; margin-top:auto; padding-top:10px;
  font:500 11px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.06em;
  color:var(--ink-2);
}
.journal-read:hover{color:var(--chapter-accent); text-decoration:underline; text-underline-offset:4px}
.journal-overlay{
  position:fixed; inset:0; z-index:210; display:none;
  background:rgba(22,20,18,.55); overflow:auto;
}
.journal-overlay.open{display:block}
.journal-paper{
  max-width:760px; margin:6vh auto; background:var(--paper);
  padding:72px 64px 64px; position:relative;
}
.journal-paper h3{font-size:clamp(2rem,4vw,3.2rem); margin:18px 0 32px; max-width:18ch}
.journal-meta{color:var(--chapter-accent)}
.journal-text p{margin-bottom:22px; font-size:17px; line-height:1.7; color:var(--ink)}
.journal-text p:first-of-type::first-letter{
  font:400 3.2em/0.8 var(--font-display); color:var(--chapter-accent);
  float:left; padding:2px 10px 0 0;
}
.journal-close{position:absolute; top:24px; right:28px; color:var(--ink-3); letter-spacing:.06em; text-transform:uppercase}
.journal-close:hover{color:var(--ink)}
@media (max-width:720px){
  .journal-grid{grid-template-columns:1fr; gap:48px}
  .journal-paper{margin:0; min-height:100vh; padding:64px 24px 48px}
}
```

- [ ] **Step 4: ARTICLES data + рендер + overlay-логика (JS)**

В секцию DATA (после `LOOKS`) добавить:

```js
/* ARTICLES для Прил. Б (рендер — журнал) */
const ARTICLES = [
  {
    id: 1, rubric: 'Гид по стилю', date: '12.07.2026',
    title: 'Как носить архив: три правила слоёв',
    lead: 'Слои — это не про холод. Это про то, как вещи разговаривают друг с другом.',
    img: '$J_STYLE',
    text: [
      'Первое правило: толщина уходит вниз. Самая тонкая вещь — у тела, самая плотная — снаружи. Футболка 240 г/м² под рубашкой под пальто читается как одна линия, а не как капуста. Если хотя бы один слой нарушает порядок, силуэт ломается.',
      'Второе правило: одна фактура на выход. Букле, ротанг, гладкая кожа — выбирайте что-то одно и дайте этому быть главным. Архив собран так, что любая вещь может быть той самой фактурой. Остальные — тихий фон из хлопка и шерсти.',
      'Третье правило: цвет держится на нейтралях, характер — на пропорциях. Удлинённое пальто поверх короткой футболки, широкий рюкзак поверх узкого силуэта. Контраст длин работает сильнее любого принта.',
      'Проверяйте себя просто: сфотографируйте образ и уберите цвет из фото. Если силуэт читается в чёрно-белом — всё собрано правильно. Именно поэтому архивные съёмки мы печатаем в дуотоне.'
    ]
  },
  {
    id: 2, rubric: 'Уход', date: '28.07.2026',
    title: 'Уход за шерстью: меньше стирок, больше воздуха',
    lead: 'Шерсть устроена как крыша: чешуйки волокна сами сбрасывают грязь. Ей нужно не стирать, а проветривать.',
    img: '$J_CARE',
    text: [
      'Главная ошибка владельца шерстяного пальто — стирать его как футболку. Каждая стирка размывает натуральный ланолин, и волокно тускнеет. Норма для пальто, которое носят каждый день, — одна химчистка в сезон.',
      'Между носками — воздух. Оставьте пальто на плечиках на балконе или у открытого окна на два часа: запахи уходят, ворс распрямляется. Влага от дождя уходит так же — сначала сушка при комнатной температуре, потом мягкая щётка против ворса.',
      'Пятна — только точечно. Прохладная вода, капля шерстного средства, промакивать, не тереть. Трение сваливает волокно в войлок, и это уже не чинится.',
      'На лето — чехол из хлопка, не из пластика. Пластик запирает влагу, и к осени вы получаете запах шкафа. Хлопок дышит, моль не любит лаванду: один мешочек в кармане решает вопрос лучше нафталина.'
    ]
  },
  {
    id: 3, rubric: 'Производство', date: '09.08.2026',
    title: 'Почему мы производим малыми партиями',
    lead: 'Восемь единиц, партия по сорок штук, пополнение — когда закончится. Это не маркетинг, это арифметика ответственности.',
    img: '$J_MAKE',
    text: [
      'Большая партия дешевле на единицу — и дороже на совести. Чтобы продать тысячу пальто, нужно спрогнозировать спрос, а прогноз всегда ошибается в большую сторону. Остатки едут на распродажу, потом в переработку, чаще — просто на склад. Мы решили не играть в эту игру.',
      'Партия в сорок штук позволяет держать качество руками. Каждое пальто проходит один стол контроля, а не конвейер выборочной проверки. Если шов уходит волной — партия останавливается, а не списывается процентом брака.',
      'Малые партии — это ещё и честный разговор о времени. Когда размера нет, мы не прячем это за «скоро в продаже»: пишем срок. Пошив под заказ — три недели. Это медленно, и мы считаем, что медленно — нормально.',
      'Архив пополняется, когда единица действительно закончилась. Не сезонная смена коллекций, а естественная ротация: ушёл один силуэт — пришёл следующий номер. Так архив остаётся архивом, а не витриной новинок.'
    ]
  }
];
```

После `renderLooks()` (перед `/* ================= ESC / HEADER ================= */`) добавить:

```js
/* ================= JOURNAL (Прил. Б) ================= */
const journalOverlay = $('#journalOverlay');
let lastReadBtn = null;

function renderJournal() {
  $('#journalGrid').innerHTML = ARTICLES.map(a => `
    <article class="journal-card">
      <figure class="journal-media"><img src="${a.img}" alt="${a.title}" loading="lazy"></figure>
      <p class="mono journal-meta">${a.rubric} · ${a.date}</p>
      <h3>${a.title}</h3>
      <p class="journal-lead">${a.lead}</p>
      <button class="journal-read mono" type="button" data-article="${a.id}">Читать →</button>
    </article>`).join('');
}

function openArticle(id, btn) {
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return;
  lastReadBtn = btn || null;
  $('#joMeta').textContent = `${a.rubric} · ${a.date}`;
  $('#joTitle').textContent = a.title;
  $('#joText').innerHTML = a.text.map(p => `<p>${p}</p>`).join('');
  journalOverlay.classList.add('open');
  journalOverlay.setAttribute('aria-hidden', 'false');
  journalOverlay.scrollTop = 0;
  if (window.__lenis) window.__lenis.stop();
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  journalOverlay.classList.remove('open');
  journalOverlay.setAttribute('aria-hidden', 'true');
  if (window.__lenis) window.__lenis.start();
  document.body.style.overflow = '';
  if (lastReadBtn) lastReadBtn.focus();
}

$('#journalGrid').addEventListener('click', e => {
  const btn = e.target.closest('.journal-read');
  if (btn) openArticle(+btn.dataset.article, btn);
});
$('#journalClose').addEventListener('click', closeArticle);
journalOverlay.addEventListener('click', e => {
  if (e.target === journalOverlay) closeArticle();
});

renderJournal();
```

Esc-хендлер дополнить журналом (между стейджем и модалкой):

```js
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (lookStage.classList.contains('open')) closeLookStage();
  else if (journalOverlay.classList.contains('open')) closeArticle();
  else if (modal.classList.contains('open')) closeQuickView();
  else if (drawer.classList.contains('open')) closeDrawer();
});
```

- [ ] **Step 5: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёные — «журнал: 3 статьи», «журнал: overlay с реальным текстом», «8 секций с маркерами», «нумералы: 01 02 03 А 04 Б 05». FAIL остаются: клуб, marquee, курсор, изображения(end).

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): Прил. Б «Журнал» — 3 статьи-разворота с overlay-чтением"
```

---

### Task 10: Архивный клуб (глава 05)

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка в главе 05 после таблицы, CSS, JS клуба

- [ ] **Step 1: Разметка**

Внутри главы 05, после `</table>`, добавить:

```html
      <div class="club" id="club">
        <p class="mono chapter-index"><b>05.5</b> / Архивный клуб</p>
        <h3>Раньше всех — к новым единицам</h3>
        <p class="club-sub">Раз в месяц: дата пополнения архива и доступ за 48 часов до всех. Без спама, отписаться — одно письмо.</p>
        <form class="club-form" id="clubForm" novalidate>
          <input class="club-input" id="clubEmail" type="email" placeholder="pochta@primer.ru" autocomplete="email" aria-label="Электронная почта">
          <button class="btn btn-primary club-btn" id="clubBtn" type="submit" data-magnetic>Вступить</button>
        </form>
        <p class="mono club-msg" id="clubMsg" role="status" aria-live="polite"></p>
      </div>
```

- [ ] **Step 2: CSS**

```css
/* ================= CLUB (05.5) ================= */
.club{margin-top:120px; max-width:640px; display:flex; flex-direction:column; gap:18px; align-items:flex-start}
.club h3{font-size:clamp(1.8rem,3.4vw,2.8rem); max-width:20ch}
.club-sub{color:var(--ink-2); font-size:16px; max-width:48ch}
.club-form{display:flex; gap:12px; width:100%; max-width:520px}
.club-input{
  flex:1; padding:14px 16px; border:0; border-bottom:1px solid var(--line);
  background:transparent; font:400 15px/1 var(--font-ui); color:var(--ink);
}
.club-input:focus{outline:none; border-bottom-color:var(--brass)}
.club-input::placeholder{color:var(--ink-3)}
.club-msg{min-height:16px; color:var(--ink-2)}
.club-msg.err{color:var(--error)}
.club-msg.ok{color:var(--brass)}
@media (max-width:720px){ .club-form{flex-direction:column; align-items:stretch} .club{margin-top:80px} }
```

- [ ] **Step 3: JS клуба**

Перед `/* ================= INIT ================= */` добавить:

```js
/* ================= CLUB (05.5) ================= */
const clubForm = $('#clubForm');
const clubMsg = $('#clubMsg');
const clubBtn = $('#clubBtn');

function clubDone(no) {
  clubBtn.disabled = true;
  clubBtn.textContent = 'Вы в списке';
  clubMsg.className = 'mono club-msg ok';
  clubMsg.textContent = `Вы в списке — № ${no}. Ждите письма в день пополнения.`;
}

if (sessionStorage.getItem('norde-club-no')) {
  clubDone(sessionStorage.getItem('norde-club-no'));
}

clubForm.addEventListener('submit', e => {
  e.preventDefault();
  if (sessionStorage.getItem('norde-club-no')) return;
  const email = $('#clubEmail').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    clubMsg.className = 'mono club-msg err';
    clubMsg.textContent = 'Проверьте адрес — например, pochta@primer.ru';
    return;
  }
  clubBtn.disabled = true;
  clubBtn.textContent = 'Отправляем…';
  clubMsg.className = 'mono club-msg';
  clubMsg.textContent = '';
  setTimeout(() => {
    const no = String(100 + Math.floor(Math.random() * 100));
    sessionStorage.setItem('norde-club-no', no);
    scrambleText(clubMsg, `Вы в списке — № ${no}. Ждите письма в день пополнения.`, 700);
    clubMsg.className = 'mono club-msg ok';
    clubBtn.textContent = 'Вы в списке';
  }, 700);
});
```

- [ ] **Step 4: Прогон QA**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "FAIL|RESULT"`
Expected: зелёный — «клуб: валидация и успех». FAIL остаются: marquee, курсор, изображения(end).

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): Архивный клуб — подписка с state-кнопкой и scramble-номером"
```

---

### Task 11: Моушн-пакет — marquee-мост, курсор, magnetic, параллакс обложки

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка (marquee между 02 и 03, #cursor после grain), CSS (#cursor), motion JS (курсор, magnetic, параллакс)

- [ ] **Step 1: Marquee-мост 02 → 03**

Между `</section>` главы 02 и `<section … data-chapter="03">` вставить:

```html
  <div class="marquee marquee--dark" aria-hidden="true" style="background:var(--dark)"><div class="marquee-inner">
    <span>Лукбук — Planche — Анатомия — NR-0202 —&nbsp;</span><span>Лукбук — Planche — Анатомия — NR-0202 —&nbsp;</span>
  </div></div>
```

- [ ] **Step 2: Курсор — разметка и CSS**

После `<div class="grain" aria-hidden="true"></div>` вставить:

```html
<div id="cursor" aria-hidden="true"><span id="cursorLabel"></span></div>
```

CSS (после блока GRAIN):

```css
/* ================= CURSOR ================= */
#cursor{
  position:fixed; left:0; top:0; z-index:400; pointer-events:none;
  display:none; align-items:center; will-change:transform;
}
#cursor.on{display:flex}
#cursor::before{
  content:""; position:absolute; left:-5px; top:-5px; width:10px; height:10px;
  border-radius:50%; background:var(--chapter-accent); transition:transform .25s;
}
#cursor.big::before{transform:scale(2.4)}
#cursorLabel{
  position:absolute; left:16px; top:-10px; white-space:nowrap;
  font:500 10px/1 var(--font-mono); text-transform:uppercase; letter-spacing:.08em;
  color:var(--ink); background:var(--paper); padding:7px 10px; border:1px solid var(--line);
  opacity:0; transition:opacity .25s;
}
#cursor.big #cursorLabel{opacity:1}
```

- [ ] **Step 3: Курсор + magnetic + параллакс (JS в motionOK)**

Внутри `if (motionOK)` после velocity-marquee блока добавить:

```js
  /* --- кастомный курсор с контекстной подписью (только pointer:fine) --- */
  if (matchMedia('(pointer:fine)').matches) {
    const cur = $('#cursor'), lbl = $('#cursorLabel');
    cur.classList.add('on');
    const cx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' });
    const cy = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { lbl.textContent = t.dataset.cursor; cur.classList.add('big'); }
      else cur.classList.remove('big');
    });
  }

  /* --- magnetic-кнопки: притяжение ≤25% в радиусе, spring-возврат (делегированно) --- */
  if (matchMedia('(pointer:fine)').matches) {
    const mag = new WeakMap();
    const magged = new Set();  /* WeakMap не итерабелен — ключи держим отдельно */
    document.addEventListener('mousemove', e => {
      const btn = e.target.closest('[data-magnetic]');
      magged.forEach(b => { if (b !== btn) { mag.get(b).xTo(0); mag.get(b).yTo(0); } });
      if (!btn) return;
      if (!mag.has(btn)) {
        mag.set(btn, {
          xTo: gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3' }),
          yTo: gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3' })
        });
        magged.add(btn);
      }
      const r = btn.getBoundingClientRect();
      mag.get(btn).xTo((e.clientX - r.left - r.width / 2) * .25);
      mag.get(btn).yTo((e.clientY - r.top - r.height / 2) * .25);
    });
  }

  /* --- параллакс фото обложки --- */
  gsap.fromTo('.hero-media', { yPercent: 0 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
```

Для параллакса: в CSS `.hero-media` заменить `top:0` на `top:-8%; height:116%` (правило `.hero-media{position:absolute; top:0; right:0; bottom:0; ...}` → `top:-8%; bottom:auto; height:116%`). В `@media (max-width:720px)` hero-media уже переопределён (`top:auto; bottom:0; height:44svh`) — оставить как есть.

- [ ] **Step 4: Прогон QA тремя режимами + кадры**

Run:
```bash
python3 scripts/qa-norde.py --shot 2>&1 | grep -E "FAIL|RESULT"
python3 scripts/qa-norde.py --rm 2>&1 | tail -2
python3 scripts/qa-norde.py --mobile 2>&1 | tail -2
```
Expected: зелёные — «marquee-мосты ≥ 3», «кастомный курсор активен» (desktop, no-rm), «все изображения загружены». На этом этапе должен остаться 0 FAIL во всех трёх режимах. Просмотреть кадры `/tmp/norde-qa-*.png` глазами.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): моушн-пакет — marquee-мост, курсор с подписями, magnetic, параллакс обложки"
```

---

### Task 12: Финал — прогоны, LCP, синк, README

**Files:**
- Modify: `templates/ecommerce/README.md`
- Modify: `public/templates/ecommerce/index.html`, `public/templates/ecommerce/README.md` (копии)

- [ ] **Step 1: Полные прогоны тремя режимами со скриншотами**

Run:
```bash
python3 scripts/qa-norde.py --shot 2>&1 | tail -2
```
Просмотреть ВСЕ `/tmp/norde-qa-*.png`. Затем:
```bash
python3 scripts/qa-norde.py --mobile --shot 2>&1 | tail -2
```
Просмотреть кадры. Затем:
```bash
python3 scripts/qa-norde.py --rm --shot 2>&1 | tail -2
```
Просмотреть кадры.
Expected: RESULT: PASS во всех трёх; визуально — нет битых фото, перекрытий, пустых секций.

- [ ] **Step 2: LCP-спотчек**

Run: `python3 scripts/qa-norde-lcp.py`
Expected: `LCP: <N> ms`, `RESULT: PASS` (N < 2500).

- [ ] **Step 3: Обновить README**

В `templates/ecommerce/README.md` привести к фактам: глава 03 — двухактная 2D-сцена (анатомия + студия цвета, без Three.js); глава 02 — кадр 3:4, интерлюдии, detail-стейдж; каталог — сортировки, насыщенные карточки; новые Прил. А/Б и клуб; пигменты глав; моушн-пакет (курсор, magnetic, marquee-мосты); motion-стек — только GSAP+Lenis; QA — количество чеков по факту (`python3 -c "import json;print(len(json.load(open('scripts/qa-norde-checks.json'))))"`).

- [ ] **Step 4: Синк витрины + финальный коммит**

```bash
cp templates/ecommerce/index.html public/templates/ecommerce/index.html
cp templates/ecommerce/README.md public/templates/ecommerce/README.md
git add templates/ecommerce public/templates/ecommerce
git commit -m "feat(norde): «Архив оживает» — финальная полировка, синхронизация витрины"
```

---

## Self-Review

**Spec coverage:**
- §3 пигменты → Task 2 (+ data-accent в Task 8/9 для новых секций)
- §4 лукбук → Task 5 (компоновка) + Task 6 (стейдж)
- §5 глава 03 → Task 3 (статика+студия) + Task 4 (моушн анатомии)
- §6 каталог → Task 7 (всё включая зум-фикс диагноза: убран translateY, один владелец transform, transform убран из duotone-transition в Task 3 Step 3)
- §7 Материалы/Журнал/Клуб → Task 8/9/10
- §8 моушн-техники: word-mask/clip-reveal (есть), marquee-мосты+курсор+magnetic+параллакс (Task 11), scramble (Task 3/4/10), wipe в пигменте (Task 2), grayscale→color (Task 8 Step 4)
- §9 доступность: Esc/focus-return (Task 9), aria-pressed (Task 3/7), aria-live (Task 7/10), pointer:fine (Task 11), RM (Task 3 Step 6 + существующий RM-блок)
- §10 QA → Task 1 + прогоны в каждой задаче + Task 12
- §12 YAGNI: бэкенд нет, клуб sessionStorage (Task 10)

**Известные отступления от спеки (осознанные):**
- Detail-стейдж — ручной FLIP-клон (`flyClone`, паттерн существующего перелёта) вместо GSAP Flip plugin: тот же визуальный результат, ноль новых зависимостей, не трогает узлы ленты (иначе сдвинулся бы pin-дрейф).
- Новые секции названы «Прил. А/Б» с буквенными нумералами — зафиксировано в спеке §7.
