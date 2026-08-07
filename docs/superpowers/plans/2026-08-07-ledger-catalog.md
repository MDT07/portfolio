# Глава 04 «Инвентарная ведомость» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Полностью пересобрать главу 04 шаблона NORDE: удалить картотеку (фильтры/сортировки/сетка/quick-view) и построить «Инвентарную ведомость» — типографический реестр с раскрываемыми листами единиц и покупкой.

**Architecture:** Один самодостаточный файл `templates/ecommerce/index.html` (2424 строки). Данные `PRODUCTS`/`CATS`/`SIZES` не меняются; корзина/drawer/checkout/акт не трогаются. Новый JS-рендер `renderLedger()` строит `<ol>` из 8 `<li>` (кнопка-строка + раскрываемый лист), аккордеон на grid-rows 0fr→1fr, плавающее фото за курсором (pointer:fine, не RM). Спека: `docs/superpowers/specs/2026-08-07-ledger-catalog-design.md`.

**Tech Stack:** Ванильный HTML/CSS/JS в одном файле; GSAP + ScrollTrigger + Lenis (CDN, с деградацией); тесты — CDP-харнес `scripts/qa-norde.py` + чеки `scripts/qa-norde-checks.json`.

**TDD-нюанс:** чеки переписываются первыми (Task 1) и падают до Task 5 — это ожидаемо; зелёный прогон требуется только в Task 7.

---

### Task 1: QA-чеки ведомости (падающие)

**Files:**
- Modify: `scripts/qa-norde-checks.json`

- [ ] **Step 1: Удалить 13 чеков старой картотеки**

Удалить объекты с именами (строки 38–92 файла):
`каталог: 8 карточек картотеки`, `unit на карточке`, `каталог: бейдж дефицита`, `каталог: материал на карточке`, `каталог: счётчик показано`, `зум-фикс: в CSS карточек нет transform/scale вообще`, `каталог: изображения статичны — нет img.alt и clip-path у product-media`, `фильтр obuv → 2 товара`, `фильтры: aria-pressed отражает активный`, `фильтр all → 8 товаров`, `сортировка цена ↓ меняет порядок`, `quick-view открывается с planche-разметкой`, `quick-view: два фото`.

- [ ] **Step 2: Вставить 9 новых чеков на их место**

```json
 {
  "name": "ведомость: 8 строк",
  "js": "document.querySelectorAll('.ledger-row').length",
  "expect": 8
 },
 {
  "name": "строка: unit, имя, рубрика, цена",
  "js": "(() => { const r=document.querySelector('.ledger-row'); return r.querySelector('.l-no').textContent.includes('Unit n°') && r.querySelector('.l-name').textContent.length>2 && r.querySelector('.l-cat').textContent.length>2 && /\\d/.test(r.querySelector('.l-price').textContent); })()"
 },
 {
  "name": "лист раскрывается: aria-expanded + open",
  "js": "(() => { const r=document.querySelector('.ledger-row'); r.click(); return r.getAttribute('aria-expanded')==='true' && document.querySelector('#sheet-'+r.dataset.id).classList.contains('open'); })()"
 },
 {
  "name": "лист содержит имя, цену, размеры",
  "js": "(() => { const s=document.querySelector('.ledger-sheet.open'); return s.querySelector('h3').textContent.length>2 && /\\d/.test(s.querySelector('.sheet-price').textContent) && s.querySelectorAll('.size-btn').length>=2; })()"
 },
 {
  "name": "аккордеон: один лист за раз",
  "js": "(() => { const rows=document.querySelectorAll('.ledger-row'); rows[1].click(); return rows[0].getAttribute('aria-expanded')==='false' && rows[1].getAttribute('aria-expanded')==='true' && document.querySelectorAll('.ledger-sheet.open').length===1; })()"
 },
 {
  "name": "выбор размера в листе",
  "js": "(() => { const btns=document.querySelectorAll('.ledger-sheet.open .size-btn'); btns[2].click(); return btns[2].classList.contains('active'); })()"
 },
 {
  "name": "в корзину из листа → drawer открыт",
  "js": "(document.querySelector('.ledger-sheet.open .sheet-add').click(), document.querySelector('#drawer').classList.contains('open'))"
 },
 {
  "name": "preview за курсором: только pointer:fine и не RM",
  "js": "(() => { const fine=matchMedia('(pointer:fine)').matches, rm=matchMedia('(prefers-reduced-motion: reduce)').matches; const has=!!document.querySelector('.ledger-preview'); return (fine && !rm) ? has : !has; })()"
 },
```

- [ ] **Step 3: Переименовать чек «+ в корзину» с карточки**

Старый (остаётся валидным: `[data-add]` теперь живёт в листах):
```json
 {
  "name": "«+ в корзину» с карточки",
  "js": "(() => { const n0=+document.querySelector('#cartCount').textContent||0; document.querySelector('[data-add]').click(); return (+document.querySelector('#cartCount').textContent)>n0; })()"
 },
```
→ новое имя: `«+ в корзину» из листа (data-add)` (js без изменений).

- [ ] **Step 4: Прогон — новые чеки падают**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`
Expected: FAIL по `ведомость: 8 строк` и др., `RESULT: FAIL`. Это TDD-красный.

- [ ] **Step 5: Commit**

```bash
git add scripts/qa-norde-checks.json
git commit -m "test(norde): чеки главы 04 переписаны под «Инвентарную ведомость» (красные)"
```

---

### Task 2: Разметка главы 04 + опись + marquee + футер

**Files:**
- Modify: `templates/ecommerce/index.html` (разметка ~1004–1021, опись ~809, marquee ~1025–1027, футер ~1082–1088)

- [ ] **Step 1: Заменить содержимое главы 04**

Удалить блок от `<div class="filters" id="filters" …>` до `<p class="catalog-note">…</p>` включительно (строки 1004–1021). Вместо него, после `<h2 data-mask>Картотека</h2>` (H2 заменить на `Инвентарная ведомость`):

```html
      <h2 data-mask>Инвентарная ведомость</h2>
      <p class="ledger-sub">Восемь единиц хранения выпуска 01 — каждая занесена в реестр с инвентарным номером. Строка раскрывается в лист единицы.</p>
      <ol class="ledger" id="ledger"></ol>
      <p class="ledger-note">Все единицы производятся малыми партиями. Если вашего размера нет — напишите, пошьём под заказ за три недели.</p>
```

- [ ] **Step 2: Опись — новый селектор превью главы 04**

Строка ~809: `data-preview=".product-media img"` → `data-preview=".ledger-sheet img"`.

- [ ] **Step 3: Marquee после главы 04**

Строки ~1025–1027: текст `Единицы хранения — Unit n°041–048 — Картотека —&nbsp;` → `Единицы хранения — Unit n°041–048 — Ведомость —&nbsp;` (в обоих спанах).

- [ ] **Step 4: Футер — колонка «Картотека» → «Ведомость»**

```html
      <h4>Ведомость</h4>
      <ul>
        <li><a href="#top" data-goto-ledger>Архив единиц</a></li>
      </ul>
```
(заменяет 4 `<li>` с `data-goto-filter`).

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): разметка главы 04 — ведомость (ol#ledger), опись/marquee/футер"
```

---

### Task 3: CSS ведомости + зачистка старых правил

**Files:**
- Modify: `templates/ecommerce/index.html` (CSS ~57, ~313–321, ~386–451, ~718–735, ~753–754, ~771)

- [ ] **Step 1: Дуотон-списки — sheet-media вместо product/modal**

Строки ~313–314:
```css
.hero-media img, .look-media img, .product-media img,
.modal-media img, .modal-thumb img, .cart-item img{
```
→
```css
.hero-media img, .look-media img, .sheet-media img,
.ledger-preview, .cart-item img{
```
(проверить: правило задаёт общий дуотон-фильтр; `filter` у `.ledger-preview` потом переопределяется ниже — ок, т.к. специфичность класса ниже? НЕТ: список селекторов `X img` имеет специфичность 0-1-1, `.ledger-preview.on{filter:none}` — 0-2-0, побеждает. ОК.)

Строка ~321:
```css
.look:hover .look-media img, .product:hover .product-media img{filter:none}
```
→
```css
.look:hover .look-media img, .ledger-sheet.open .sheet-media img{filter:none}
```

Строка ~771 (print): `.product-media img` → `.sheet-media img`.

Строка ~57: `a:not(.wordmark):not(.btn):not(.product):hover` → `a:not(.wordmark):not(.btn):hover`.

- [ ] **Step 2: Заменить блок CATALOG (строки 386–451) на LEDGER**

Удалить весь блок от `/* ================= CATALOG (04) ================= */` до `.catalog-note{…}` включительно. Вставить:

```css
/* ================= LEDGER (04) ================= */
.ledger-sub{max-width:52ch; color:var(--ink-2); font-size:16px; margin:0 0 48px}
.ledger{list-style:none}
.ledger-item{border-top:1px solid var(--line)}
.ledger-item:last-child{border-bottom:1px solid var(--line)}
.ledger-row{
  display:grid; grid-template-columns:130px 1fr auto auto auto; align-items:baseline; gap:24px;
  width:100%; text-align:left; padding:22px 0; cursor:pointer;
  transition:padding-left .3s var(--ease-cine);
}
.ledger-row:hover, .ledger-row:focus-visible{padding-left:16px}
.ledger-row:focus-visible{outline:none}
.ledger-row:hover .l-name, .ledger-row:focus-visible .l-name{color:var(--chapter-accent)}
.l-no{font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--chapter-accent)}
.l-name{font:400 clamp(1.6rem,3.4vw,2.9rem)/1.05 var(--font-display); transition:color .3s}
.l-cat{font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3)}
.l-price{font-size:12px; letter-spacing:.04em}
.l-hint{font-size:10px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-3); transition:color .3s}
.ledger-row:hover .l-hint, .ledger-row[aria-expanded="true"] .l-hint{color:var(--chapter-accent)}
/* раскрываемый инвентарный лист: grid-rows 0fr→1fr (Chrome/Safari 16+) */
.ledger-sheet{display:grid; grid-template-rows:0fr; transition:grid-template-rows .55s var(--ease-cine)}
.ledger-sheet.open{grid-template-rows:1fr}
.sheet-inner{
  overflow:hidden; min-height:0;
  display:grid; grid-template-columns:minmax(280px,380px) 1fr; gap:48px;
}
.sheet-media{aspect-ratio:4/5; overflow:hidden; margin:8px 0 40px}
.sheet-media img{width:100%; height:100%; object-fit:cover; transition:filter .6s var(--ease-cine)}
.sheet-body{display:flex; flex-direction:column; gap:14px; align-items:flex-start; padding:8px 0 40px}
.sheet-meta{font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-3)}
.sheet-body h3{font-size:clamp(1.6rem,3vw,2.4rem); line-height:1.1}
.sheet-price{font:500 14px/1 var(--font-mono); letter-spacing:.04em}
.sheet-desc{color:var(--ink-2); font-size:15px; max-width:52ch}
.sheet-detail{font-size:12px; color:var(--ink-2); border-top:1px solid var(--line); padding-top:14px; width:100%}
.sheet-detail span{color:var(--ink)}
.sheet-add{margin-top:6px}
.ledger-note{margin-top:64px; max-width:52ch; color:var(--ink-2); font-size:15px}
/* плавающее фото за курсором (создаётся JS только при pointer:fine и не RM) */
.ledger-preview{
  position:fixed; left:0; top:0; z-index:90; width:min(20vw,240px); aspect-ratio:4/5;
  object-fit:cover; pointer-events:none; opacity:0;
  transition:opacity .25s, filter .45s var(--ease-cine);
}
.ledger-preview.on{opacity:1; filter:none}
```

- [ ] **Step 3: Медиа-запросы — удалить catalog/modal, добавить ledger**

Строка ~718 (≤1000px): удалить `.catalog-grid{grid-template-columns:repeat(3,1fr)}`.
Строки ~731–735 (≤720px): удалить `.catalog-grid{grid-template-columns:repeat(2,1fr)}`, `.modal-card{…}`, `.modal-media{…}`; добавить в тот же медиа-запрос:
```css
  .ledger-row{grid-template-columns:1fr auto; gap:6px 16px; padding:18px 0}
  .l-no, .l-name{grid-column:1/-1}
  .l-hint{display:none}
  .sheet-inner{grid-template-columns:1fr; gap:24px}
  .sheet-media{max-width:320px; margin-bottom:0}
```

- [ ] **Step 4: Print — зачистка**

Строки ~753–754: в списке скрываемого убрать `.modal` и `.product-add`, добавить `.ledger-preview`:
```css
  .opis, .opis-preview, .drawer, .overlay, .look-stage, .lens,
  .club-form, .print-btn, .footer-cols, .ledger-preview{display:none !important}
```

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): CSS ведомости — строки, раскрываемый лист, preview; зачистка catalog/modal"
```

---

### Task 4: JS ведомости + зачистка state/SORTS + Esc/Tab

**Files:**
- Modify: `templates/ecommerce/index.html` (JS ~1286–1298, ~1380–1474, Esc ~1900, Tab-trap)

- [ ] **Step 1: state и SORTS**

`const state = { filter: 'all', sort: 'featured', cart: [], qvId: null, qvSize: null };` → `const state = { cart: [] };`
Удалить блок `const SORTS = { … };` (featured/price-asc/price-desc/new).

- [ ] **Step 2: Заменить CATALOG JS + FILTERS JS на LEDGER JS**

Удалить: `const grid = $('#catalogGrid');`, `renderCatalog()`, `updateCatalog()` (с FLIP-перестановкой и scramble цен), оба `grid.addEventListener`, весь блок `/* ================= FILTERS ================= */` (setFilter, filtersWrap listener, sort listener, data-goto-filter handler). Вставить:

```js
/* ================= LEDGER ================= */
const ledgerEl = $('#ledger');

function renderLedger() {
  ledgerEl.innerHTML = PRODUCTS.map(p => `
    <li class="ledger-item">
      <button class="ledger-row" type="button" aria-expanded="false" aria-controls="sheet-${p.id}" data-id="${p.id}" data-cursor="Открыть лист">
        <span class="l-no mono">${p.unit}</span>
        <span class="l-name">${p.name}</span>
        <span class="l-cat mono">${CATS[p.cat]}</span>
        <span class="l-price mono">${fmt(p.price)}</span>
        <span class="l-hint mono" aria-hidden="true">Лист →</span>
      </button>
      <div class="ledger-sheet" id="sheet-${p.id}">
        <div class="sheet-inner">
          <figure class="sheet-media"><img src="${p.img}" alt="${p.name}" loading="lazy"></figure>
          <div class="sheet-body">
            <p class="sheet-meta mono">${CATS[p.cat]} · ${p.unit}</p>
            <h3>${p.name}</h3>
            <p class="sheet-price mono" data-final="${fmt(p.price)}">${fmt(p.price)}</p>
            <p class="sheet-desc">${p.desc}</p>
            <div class="sheet-detail mono">${p.meta}</div>
            <div class="sizes" role="group" aria-label="Размер">
              ${SIZES[p.cat].map(s => `<button class="size-btn${s === SIZES[p.cat][Math.floor(SIZES[p.cat].length / 2)] ? ' active' : ''}" type="button" data-size="${s}">${s}</button>`).join('')}
            </div>
            <button class="btn btn-primary sheet-add" type="button" data-add="${p.id}">+ в корзину</button>
          </div>
        </div>
      </div>
    </li>`).join('');
}
renderLedger();

function toggleSheet(id) {
  const row = $(`.ledger-row[data-id="${id}"]`, ledgerEl);
  const sheet = $('#sheet-' + id);
  if (!row || !sheet) return;
  const opening = !sheet.classList.contains('open');
  /* аккордеон: сначала свернуть текущий лист */
  $$('.ledger-sheet.open', ledgerEl).forEach(s => {
    s.classList.remove('open');
    const r = $(`.ledger-row[aria-controls="${s.id}"]`, ledgerEl);
    if (r) { r.setAttribute('aria-expanded', 'false'); $('.l-hint', r).textContent = 'Лист →'; }
  });
  if (!opening) return;
  sheet.classList.add('open');
  row.setAttribute('aria-expanded', 'true');
  $('.l-hint', row).textContent = 'Свернуть ↑';
  const price = $('.sheet-price', sheet);
  if (price && window.gsap && !reducedMotion) scrambleText(price, price.dataset.final, 500);
}

ledgerEl.addEventListener('click', e => {
  const addBtn = e.target.closest('.sheet-add');
  if (addBtn) {
    const p = byId(+addBtn.dataset.add);
    if (!p) return;
    const sheet = addBtn.closest('.ledger-sheet');
    const sizeEl = $('.size-btn.active', sheet);
    const size = sizeEl ? sizeEl.dataset.size : SIZES[p.cat][Math.floor(SIZES[p.cat].length / 2)];
    addToCart(p.id, size);
    flyToCart(addBtn);
    toast(`${p.unit} → Корзина`);
    openDrawer();
    return;
  }
  const sizeBtn = e.target.closest('.size-btn');
  if (sizeBtn) {
    $$('.size-btn', sizeBtn.closest('.sizes')).forEach(b => b.classList.toggle('active', b === sizeBtn));
    return;
  }
  const row = e.target.closest('.ledger-row');
  if (row) toggleSheet(+row.dataset.id);
});

/* футерная ссылка «Архив единиц» */
$$('[data-goto-ledger]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();  /* иначе нативный прыжок к #top гонится с анимацией скролла */
  scrollToEl($('[data-chapter="04"]'));
}));
```

- [ ] **Step 3: Esc-цепочка и Tab-ловушка — без модалки**

Esc: удалить ветку `else if (modal.classList.contains('open')) closeQuickView();`.
Tab-trap: `[lookStage, modal, drawer]` → `[lookStage, drawer]`.

- [ ] **Step 4: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): JS ведомости — renderLedger, аккордеон, покупка из листа; зачистка каталога"
```

---

### Task 5: Плавающее фото + reveal строк (motion)

**Files:**
- Modify: `templates/ecommerce/index.html` (после блока LEDGER; внутри `if (motionOK) {`)

- [ ] **Step 1: Preview за курсором (сразу после LEDGER-блока, top-level)**

```js
/* плавающее фото за курсором: только pointer:fine и не RM; без GSAP — статично следует нулевым кадром? нет: без GSAP превью не создаём */
if (matchMedia('(pointer:fine)').matches && !reducedMotion && window.gsap) {
  const prev = document.createElement('img');
  prev.className = 'ledger-preview';
  prev.alt = '';
  prev.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prev);
  const qx = gsap.quickTo(prev, 'x', { duration: .35, ease: 'power3' });
  const qy = gsap.quickTo(prev, 'y', { duration: .35, ease: 'power3' });
  ledgerEl.addEventListener('pointermove', e => { qx(e.clientX + 24); qy(e.clientY - 130); });
  ledgerEl.addEventListener('pointerover', e => {
    const row = e.target.closest('.ledger-row');
    if (!row) return;
    const p = byId(+row.dataset.id);
    if (p && prev.getAttribute('src') !== p.img) prev.src = p.img;
    prev.classList.add('on');
  });
  ledgerEl.addEventListener('pointerleave', () => prev.classList.remove('on'));
}
```
(комментарий в коде оставить однострочный: `/* плавающее фото за курсором: pointer:fine + не RM + GSAP */`.)

- [ ] **Step 2: Reveal строк внутри motionOK**

Внутри `if (motionOK) {` (рядом с другими ScrollTrigger.batch):
```js
  /* --- ведомость 04: строки проявляются каскадом --- */
  gsap.set('.ledger-item', { opacity: 0, y: 24 });
  ScrollTrigger.batch('.ledger-item', {
    start: 'top 88%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .07, overwrite: true })
  });
```
(без motionOK элементы видны по умолчанию — деградация сохранена).

- [ ] **Step 3: Прогон QA desktop — чеки ведомости зеленеют (кроме modal-зависимых уже удалённых)**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`
Expected: новые чеки ведомости PASS; могут падать чеки, если #modal ещё не удалён, но ссылающиеся на него уже удалены из json — консольная ошибка QUICK VIEW JS (`$('#modal')` → null) возможна: `const modal = $('#modal')` вернёт null и `modal.addEventListener` упадёт. Поэтому Task 6 выполняется СРАЗУ — между Task 5 и 6 прогон допустимо красный.

- [ ] **Step 4: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): плавающее фото за курсором + каскадное проявление строк ведомости"
```

---

### Task 6: Удаление quick-view (modal)

**Files:**
- Modify: `templates/ecommerce/index.html` (CSS ~567–599; markup `#modal`; JS QUICK VIEW)

- [ ] **Step 1: CSS**

Удалить правила `.modal`, `.modal.open`, `.modal-card`, `.modal.open .modal-card`, `.modal-media` (оба), `.modal-media img`, `.modal-thumbs`, `.modal-thumb` (×3), `.modal-body`, `.modal-close` (блок из Task «Б2»), `.modal-card .tag`, `#qvUnit`, `.modal-body h3`, `.modal-price`, `.modal-desc`, `.modal-meta`, `.modal-meta span`. **Оставить** `.sizes`/`.size-btn` (общие, используются листом).

- [ ] **Step 2: Разметка**

Удалить весь блок от `<!-- ================= QUICK VIEW MODAL ================= -->` до закрывающего `</div>` модалки (`#modal` с `.modal-card`, thumbs, qvSizes, qvAdd).

- [ ] **Step 3: JS**

Удалить весь блок `/* ================= QUICK VIEW ================= */`: `const modal`, `openQuickView`, `closeQuickView`, `modal.addEventListener`, `$('#qvSizes')…`, `$$('.modal-thumb')…`, `$('#qvAdd')…` — до строки `/* ================= CART ================= */` (CART оставить).

- [ ] **Step 4: Проверка отсутствия висячих ссылок**

Run: `grep -nE 'qv|modal|product-media|setFilter|SORTS|state\.(filter|sort|qv)' templates/ecommerce/index.html`
Expected: пусто (совпадений нет), кроме слова `modal` в тексте/комментариях при отсутствии — цель: 0.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "refactor(norde): quick-view удалён полностью — его заменяет инвентарный лист"
```

---

### Task 7: Прогон QA ×3 + FPS + LCP

**Files:**
- нет (только команды)

- [ ] **Step 1: Три режима**

Run: `python3 scripts/qa-norde.py 2>&1 | tail -2; python3 scripts/qa-norde.py --mobile 2>&1 | tail -2; python3 scripts/qa-norde.py --rm 2>&1 | tail -2`
Expected: `RESULT: PASS` ×3 (69 чеков: 73 − 13 + 9).

- [ ] **Step 2: Перф**

Run: `python3 scripts/qa-norde-probe.py 2>&1 | tail -4; python3 scripts/qa-norde-lcp.py 2>&1 | tail -2`
Expected: fps 60, over33pct 0, longtasks 0; `RESULT: PASS` (LCP ≤ 2500 мс, ориентир ≤ 1 с).

- [ ] **Step 3: Скриншоты глав для глаз**

Run: `python3 scripts/qa-norde.py --shot 2>&1 | tail -2` → открыть `/tmp/norde-qa-ch04*.png`, проверить ведомость глазами (строки, раскрытый лист через интерактивный чек).

---

### Task 8: README + синк + финальный коммит

**Files:**
- Modify: `templates/ecommerce/README.md`, `public/templates/ecommerce/README.md`
- Modify: `public/templates/ecommerce/index.html` (копией)

- [ ] **Step 1: README — буллет главы 04**

Заменить буллет `**04 / Архив единиц** — …` на:

```markdown
- **04 / Архив единиц** — **инвентарная ведомость**: типографический реестр из 8 строк (unit · имя Playfair · рубрика · цена) вместо сетки карточек; за курсором плывёт фото единицы (pointer:fine, дуотон→цвет); строка раскрывается в **инвентарный лист** (аккордеон grid-rows, фото 4:5, scramble цены, выбор размера, «+ в корзину» → drawer); фильтров/сортировок/quick-view нет по замыслу — жест главы чисто архивный
```

- [ ] **Step 2: README — фичи и доступность**

- В списке фич найти упоминания quick-view/фильтров/сортировок каталога → удалить/заменить на ведомость.
- Строка доступности: убрать модалку из перечня диалогов (остаются drawer, look-stage, опись, журнал).
- `73 проверки` → `69 проверок`.

- [ ] **Step 3: Синк**

```bash
cp templates/ecommerce/index.html public/templates/ecommerce/index.html
cp templates/ecommerce/README.md public/templates/ecommerce/README.md
```

- [ ] **Step 4: Финальный прогон после синка**

Run: `python3 scripts/qa-norde.py 2>&1 | tail -1`
Expected: `RESULT: PASS`.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce public/templates/ecommerce
git commit -m "docs(norde): README под ведомость + синк в public — пересборка главы 04 завершена"
```

---

## Самопроверка плана (пройдена)

- **Спека покрыта:** структура (T2/T3), интерактив+preview+scramble+reveal (T4/T5), покупка (T4), удаления catalog/quick-view/footer/Esc/Tab/опись (T2–T6), a11y aria-expanded/controls (T4), RM/мобайл/print (T3/T5), QA (T1/T7), README+синк (T8).
- **Плейсхолдеров нет:** весь новый код приведён полностью; удаления заданы точными якорями (имена чеков, селекторы CSS/JS).
- **Консистентность имён:** классы `.ledger-row/.l-no/.l-name/.l-cat/.l-price/.l-hint/.ledger-sheet/.sheet-inner/.sheet-media/.sheet-body/.sheet-meta/.sheet-price/.sheet-desc/.sheet-detail/.sheet-add/.ledger-preview`, id `sheet-${p.id}`, data-attrs `data-id/data-add/data-goto-ledger` совпадают между разметкой (T4 renderLedger), CSS (T3) и чеками (T1).
- **Риск-точка:** между T5 и T6 QA допустимо красный (QUICK VIEW JS без #modal падает в консоль) — Task 6 выполняется сразу вслед, это отражено в T5 Step 3.
