# NORDE «Архив» — апгрейд Editorial+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять NORDE до editorial-уровня: borderless-система, дуотон-фото, обложка-hero, манифест-разворот, честный 3D-planche, отзывчивый скролл — без «пропадающих» элементов.

**Architecture:** Точечная перекомпозиция внутри текущего однофайлового шаблона `templates/ecommerce/index.html` (структура глав 00–05 и e-commerce ядро не трогаем). Тесты = CDP QA-харнесс `scripts/qa-norde.py` + `scripts/qa-norde-checks.json` (TDD: чек сначала красный, потом зелёный).

**Tech Stack:** vanilla HTML/CSS/JS, GSAP 3 + ScrollTrigger, Lenis, Three.js (import map), все по CDN.

**Спека:** `docs/superpowers/specs/2026-07-31-norde-editorial-plus-design.md`

**Общие правила:**
- Работаем на `main`, коммит на задачу.
- QA-команда: `python3 scripts/qa-norde.py` из `~/Desktop/portfolio` (флаги `--mobile`, `--rm`, `--shot`). PASS = exit 0.
- После любых правок разметки/копирайта — прогон всех трёх режимов перед коммитом задачи, если это указано в шагах.

---

### Task 1: Падающие QA-чеки апгрейда (TDD-база)

**Files:**
- Modify: `scripts/qa-norde-checks.json` (добавить 4 записи в конец массива, после строки с «спеки mono присутствуют»)

- [ ] **Step 1: Добавить 4 чека**

В `scripts/qa-norde-checks.json` перед закрывающей `]` добавить (после записи «спеки mono присутствуют» не забыть запятую):

```json
,
  {"name": "нумералы в главах 01–05", "js": "document.querySelectorAll('.chapter-numeral').length", "expect": 5},
  {"name": "borderless: глава без border-top", "js": "getComputedStyle(document.querySelector('[data-chapter=\"01\"]')).borderTopWidth", "expect": "0px"},
  {"name": "дуотон на образах лукбука", "js": "getComputedStyle(document.querySelector('.look img')).filter.includes('grayscale')"},
  {"name": "образы лукбука eager", "js": "[...document.querySelectorAll('.look img')].every(i => i.loading === 'eager')"}
```

- [ ] **Step 2: Прогон — все 4 красные**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "нумералы|borderless|дуотон|eager|RESULT"`
Expected: 4 строки FAIL, RESULT: FAIL (консоль/остальные чеки зелёные).

- [ ] **Step 3: Commit**

```bash
git add scripts/qa-norde-checks.json
git commit -m "test(norde): чеки апгрейда Editorial+ (красная база)"
```

---

### Task 2: Дизайн-система — borderless, дуотон, нумералы

**Files:**
- Modify: `templates/ecommerce/index.html` — CSS-блоки `.chapter` (стр. 64–70), `.hero-media` (107), `.look-media` (140), `#plancheStage` (171–175), `.catalog-grid` (204–207), `.product`/`.product:hover` (208–212), `.footer`/`.footer-cols` (241,247–250), `.marquee` (124), `.manifest-list` (114–121); новый CSS нумералов и дуотона; разметка секций `data-chapter="01".."05"` (стр. 424, 442, 467, 501, 522)

- [ ] **Step 1: Borderless — CSS**

Заменить правила (точные строки сверить по файлу, содержимое ниже — целиком):

```css
.chapter{padding:160px 0; position:relative; overflow:hidden}
/* border-top убран: разделение воздухом и тоном */
```

(удалить `.chapter:first-of-type` и `.chapter--dark{border-top-color…}` — строку 66 сократить до):
```css
.chapter--dark{background:var(--dark); color:var(--dark-ink)}
```

Медиа-запрос мобилы (стр. 377): `.chapter{padding:88px 0}` → `.chapter{padding:96px 0}`.

Убрать рамки:
- `.hero-media{… border:1px solid var(--line); …}` → удалить `border` из правила.
- `.look-media{aspect-ratio:4/5; overflow:hidden}` (без `border`).
- `#plancheStage` → удалить `border:1px solid var(--dark-line);`.
- `.catalog-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:32px; background:transparent}` (без `background:var(--line); border:…`).
- `.product{…}` → удалить строку `.product:hover{background:var(--paper-2)}` (hover заменяется lift в Task 7).
- `.footer{padding-top:80px; overflow:hidden}` (без `border-top`); `.footer-cols{… padding:64px 40px 40px}` (без `border-top`).
- `.marquee{overflow:hidden; padding:14px 0}` (без border-top/bottom).
- `.manifest-list li{…}` → удалить `border-top`; `.manifest-list li:last-child{border-bottom:…}` → удалить всю строку (полная перекомпоновка — Task 6, здесь только снять линии).

- [ ] **Step 2: Дуотон-система — новый CSS-блок**

После блока `/* ================= LOOKBOOK (02) ================= */` (перед `/* ================= PLANCHE (03) ================= */`) вставить:

```css
/* ================= DUOTONE (архивная обработка фото) ================= */
.hero-media img, .look-media img, .product-media img,
.planche-fallback, .modal-media img, .cart-item img{
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(1.02);
  transition:filter .6s var(--ease-cine), transform .5s var(--ease-cine);
}
.chapter--dark .look-media img, .planche-fallback{
  filter:grayscale(1) sepia(.22) contrast(1.06) brightness(.95);
}
.look:hover .look-media img, .product:hover .product-media img{filter:none}
```

NB: это правило замещает прежний `transition:transform .5s` у `.product-media img` (строка 217) — там transition объединён здесь; строку 217 сократить до `.product-media img{width:100%; height:100%; object-fit:cover}`.

- [ ] **Step 3: Нумералы — CSS + разметка**

CSS после дуотон-блока:

```css
/* ================= CHAPTER NUMERALS ================= */
.chapter-numeral{
  position:absolute; top:32px; right:-0.04em; z-index:0;
  font:900 clamp(8rem,18vw,16rem)/0.8 var(--font-display);
  color:var(--ink); opacity:.05; pointer-events:none; user-select:none;
}
.chapter--dark .chapter-numeral{color:var(--dark-ink); opacity:.07}
.chapter>.container, .chapter>.lookbook-viewport{position:relative; z-index:1}
@media (max-width:720px){
  .chapter-numeral{top:20px; font-size:clamp(5rem,22vw,8rem)}
}
```

Разметка: первым дочерним элементом внутри каждой секции КРОМЕ hero (hero — сама обложка, нумерал не нужен), ПОСЛЕ `<div class="wipe"…>` там где wipe есть:

```html
<span class="chapter-numeral" aria-hidden="true">01</span>
```

— в `[data-chapter="01"]` (01), `[data-chapter="02"]` (02), `[data-chapter="03"]` (03), `[data-chapter="04"]` (04), `[data-chapter="05"]` (05). В hero НЕ добавлять.

- [ ] **Step 4: Прогон QA — 3 чека зелёные, eager красный**

Run: `python3 scripts/qa-norde.py 2>&1 | grep -E "нумералы|borderless|дуотон|eager|RESULT"`
Expected: «нумералы», «borderless», «дуотон» — PASS; «образы лукбука eager» — FAIL; RESULT: FAIL.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): borderless-система, дуотон-фото, нумералы глав"
```

---

### Task 3: Глава 00 — Обложка 100svh

**Files:**
- Modify: `templates/ecommerce/index.html` — CSS `.hero` (стр. 97–111), разметка hero (411–421), мобильный медиа-запрос (378–380)

- [ ] **Step 1: Разметка**

Заменить секцию `[data-chapter="00"]` целиком на:

```html
  <!-- ================= 00 ОБЛОЖКА ================= -->
  <section class="chapter hero" data-chapter="00">
    <figure class="hero-media" data-clip>
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" alt="Коллекция NORDE — стеллаж с одеждой" fetchpriority="high">
    </figure>
    <p class="mono hero-meta-v" aria-hidden="true">Архив · Выпуск 01 · Осень 2026</p>
    <div class="container">
      <p class="mono chapter-index"><b>00</b> / Обложка</p>
      <h1 class="hero-title" data-mask>Одежда и предметы дома — без <em>лишнего шума</em></h1>
      <p class="hero-sub">Архив-издание скандинавского магазина: восемь единиц хранения, шесть образов и одна planche. Каждая вещь работает каждый день.</p>
      <p class="mono hero-scroll" aria-hidden="true">Листайте ↓</p>
    </div>
  </section>
```

- [ ] **Step 2: CSS обложки**

Заменить блок `/* ================= HERO (00) ================= */` (стр. 97–111) на:

```css
/* ================= HERO (00) ================= */
.hero{min-height:100svh; display:flex; align-items:center; padding:120px 0 96px}
.hero .container{position:relative; z-index:1; width:100%}
.hero-media{
  position:absolute; top:0; right:0; bottom:0; width:55%; margin:0; z-index:0;
}
.hero-media::after{  /* напыление бумаги: заголовок заходит на фото и читается */
  content:""; position:absolute; inset:0;
  background:linear-gradient(90deg, var(--paper) 0%, transparent 45%);
}
.hero-media img{width:100%; height:100%; object-fit:cover}
.hero-meta-v{
  position:absolute; right:18px; top:50%; transform:translateY(-50%); z-index:1;
  writing-mode:vertical-rl; font:500 11px/1 var(--font-mono);
  letter-spacing:.18em; color:var(--ink-3);
}
.hero-title{
  font-size:clamp(3rem,8vw,7.2rem); line-height:.98; font-weight:400;
  max-width:11ch; margin:24px 0 32px;
}
.hero-title em{font-style:italic; color:var(--brass)}
.hero-sub{max-width:44ch; color:var(--ink-2); font-size:17px}
.hero-scroll{margin-top:24px; color:var(--ink-3)}
```

- [ ] **Step 3: Мобильная обложка**

В `@media (max-width:720px)` заменить три hero-правила (стр. 378–380) на:

```css
  .hero{min-height:100svh; padding:104px 0 calc(46svh + 48px); align-items:flex-start}
  .hero-media{top:auto; bottom:0; left:0; width:100%; height:44svh}
  .hero-media::after{background:linear-gradient(180deg, var(--paper) 0%, transparent 45%)}
  .hero-meta-v{display:none}
  .hero-title{font-size:clamp(2.6rem,13vw,4rem)}
```

- [ ] **Step 4: QA + визуальный кадр**

Run: `python3 scripts/qa-norde.py --shot 2>&1 | tail -3` → RESULT: FAIL (eager — ожидаемо, чинится в Task 4).
Run: `python3 scripts/qa-norde.py --mobile --shot 2>&1 | tail -3` → RESULT: FAIL (только eager).
Глазами: `/tmp/norde-qa-ch00.png` обеих — фото справа/снизу, заголовок читается, мета вертикальная (десктоп).

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): глава 00 — обложка 100svh с напылением и вертикальной метой"
```

---

### Task 4: Глава 02 — eager-образы, геометрия, отзывчивый пин

**Files:**
- Modify: `templates/ecommerce/index.html` — `<head>` (preload), статичные фигуры луков (456–461), `renderLooks` (981), `.look`/`.lookbook-track` (138–139), пин лукбука (1127–1130)

- [ ] **Step 1: Eager + preload**

В `<head>` (перед закрывающим `</head>`, рядом с preconnect):

```html
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80">
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80">
<link rel="preload" as="image" href="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80">
```

В `renderLooks` (стр. 981): `loading="lazy"` → `loading="eager"`.
В шести статичных фигурах (456–461): `loading="lazy"` → `loading="eager"`.

- [ ] **Step 2: Геометрия ленты**

```css
.lookbook-track{display:flex; gap:48px; will-change:transform}
.look{flex:0 0 min(62vw,640px)}
```

- [ ] **Step 3: Пин отзывчивее**

В scrollTrigger лукбук-пина (стр. 1127–1130): `scrub: 1` → `scrub: 0.6`, добавить `anticipatePin: true`:

```js
        trigger: '[data-chapter="02"]', start: 'top top',
        end: () => '+=' + (dist() + innerHeight * 0.6),
        pin: true, scrub: 0.6, anticipatePin: true, invalidateOnRefresh: true,
```

- [ ] **Step 4: QA — eager зелёный, все 37 чеков PASS**

Run: `python3 scripts/qa-norde.py 2>&1 | tail -3` → RESULT: PASS.
Run: `python3 scripts/qa-norde.py --mobile 2>&1 | tail -2` → PASS; `python3 scripts/qa-norde.py --rm 2>&1 | tail -2` → PASS.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): лукбук — eager-образы и preload, крупнее кадр, отзывчивый пин"
```

---

### Task 5: Глава 03 — Planche «Archive Runner»

**Files:**
- Modify: `templates/ecommerce/index.html` — заголовок/спеки (470–479), swatches (480–484), нормализация модели (1245), пин 03 (1281), swatch-JS (1258–1270)

- [ ] **Step 1: Честный копирайт**

```html
      <h2 data-mask>Archive Runner в четырёх ракурсах</h2>
      <div class="planche-grid">
        <aside>
          <ol id="plancheSpecs" class="mono">
            <li>Верх — <b>переработанный текстиль</b></li>
            <li>Подошва — <b>пена EVA</b></li>
            <li>Вес — <b>290 г</b></li>
            <li>Артикул — <b>NR-0202</b></li>
          </ol>
          <div class="swatches">
            <button class="swatch active" type="button" data-i="0" style="--c:#2E4A5B" aria-label="Вариант 1"></button>
            <button class="swatch" type="button" data-i="1" style="--c:#C9A227" aria-label="Вариант 2"></button>
            <button class="swatch" type="button" data-i="2" style="--c:#1C1917" aria-label="Вариант 3"></button>
            <span class="mono swatch-name" id="swatchName"></span>
          </div>
        </aside>
```

CSS (после `.swatch.active` правила, ~стр. 193):

```css
.swatch-name{align-self:center; color:var(--dark-ink-2); letter-spacing:.06em; text-transform:uppercase}
```

- [ ] **Step 2: Имена вариантов из GLB**

Заменить swatch-блок (стр. 1258–1270) на:

```js
  /* swatch: KHR_materials_variants (имена — из самого GLB), иначе — тинт */
  const swatchBtns = $$('.swatch');
  const swatchName = $('#swatchName');
  const setSwatchName = i => {
    const names = (gltfRef && gltfRef.userData && gltfRef.userData.variants) || [];
    if (swatchName) swatchName.textContent = names[i] || '';
    swatchBtns.forEach((b, bi) => b.setAttribute('aria-label', 'Вариант: ' + (names[bi] || bi + 1)));
  };
  swatchBtns.forEach((btn, i, all) => btn.addEventListener('click', async () => {
    all.forEach(b => b.classList.toggle('active', b === btn));
    setSwatchName(i);
    if (!model) return;
    const variants = (gltfRef && gltfRef.userData && gltfRef.userData.variants) || [];
    try {
      if (variants.length && gltfRef.functions && gltfRef.functions.selectVariant) {
        await gltfRef.functions.selectVariant(model, i % variants.length);
      } else {
        model.traverse(o => { if (o.isMesh && o.material && o.material.color) o.material.color.set(btn.dataset.c); });
      }
    } catch (e) { /* вариант не применился — оставляем как есть */ }
  }));
```

В onLoad GLB (после `renderer.render(scene, camera); // первый кадр`, стр. 1250) добавить строку: `setSwatchName(0);`

- [ ] **Step 3: Модель крупнее + отзывчивый пин**

Стр. 1245: `model.scale.setScalar(1.6 / size);` → `model.scale.setScalar(2.0 / size);` (и комментарий `габарит ~1.6` → `габарит ~2.0`).
Стр. 1281: `pin: true, scrub: 1,` → `pin: true, scrub: 0.6, anticipatePin: true,`

- [ ] **Step 4: QA 3 режима + кадр**

Run: `python3 scripts/qa-norde.py --shot 2>&1 | tail -3` → PASS. Глазами `/tmp/norde-qa-ch03.png`: модель крупнее, копирайт Archive Runner.
Run: `python3 scripts/qa-norde.py --mobile 2>&1 | tail -2` и `--rm` → PASS.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): planche — Archive Runner, варианты из GLB, крупнее модель"
```

---

### Task 6: Глава 01 — Манифест-разворот

**Files:**
- Modify: `templates/ecommerce/index.html` — разметка `[data-chapter="01"]` (424–435), CSS `.manifest-*` (113–121), мобильный запрос

- [ ] **Step 1: Разметка**

Содержимое `.container` секции 01 заменить на:

```html
    <div class="container manifest-grid">
      <div class="manifest-head">
        <p class="mono chapter-index"><b>01</b> / Манифест</p>
        <h2 data-mask>Правила простые и одинаковые для всех</h2>
      </div>
      <div class="manifest-body">
        <p class="manifest-quote" data-mask>Материалы важнее <em>логотипов</em></p>
        <ol class="manifest-list">
          <li><span class="manifest-no">П. 1.1</span><p>Вещь должна работать каждый день и не надоедать.</p></li>
          <li><span class="manifest-no">П. 1.2</span><p>Никаких акций-ловушек и условий со звёздочкой.</p></li>
          <li><span class="manifest-no">П. 1.3</span><p>Архив пополняется медленно — и это нормально.</p></li>
        </ol>
      </div>
    </div>
```

- [ ] **Step 2: CSS**

Заменить блок `/* ================= MANIFEST (01) ================= */` (стр. 113–121) на:

```css
/* ================= MANIFEST (01) ================= */
.manifest-grid{display:grid; grid-template-columns:repeat(12,1fr); gap:40px}
.manifest-head{grid-column:1/6}
.manifest-body{grid-column:7/13}
.manifest-quote{
  font:italic 400 clamp(2rem,4vw,3.4rem)/1.15 var(--font-display);
  color:var(--brass); max-width:14ch; margin:0 0 64px;
}
.manifest-list{list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:56px 48px}
.manifest-no{display:block; font:400 28px/1 var(--font-display); color:var(--brass); margin-bottom:16px}
.manifest-list li p{color:var(--ink-2); font-size:16px; line-height:1.55}
.manifest-list li:first-child p::first-letter{
  font:400 3.2em/0.75 var(--font-display); color:var(--brass);
  float:left; padding:8px 10px 0 0;
}
@media (max-width:720px){
  .manifest-grid{grid-template-columns:1fr}
  .manifest-head, .manifest-body{grid-column:auto}
  .manifest-quote{margin:0 0 48px}
  .manifest-list{grid-template-columns:1fr; gap:40px}
}
```

- [ ] **Step 3: QA + кадр**

Run: `python3 scripts/qa-norde.py --shot 2>&1 | tail -3` → PASS; глазами `/tmp/norde-qa-ch01.png`: pull-quote, drop cap, две колонки.
Run: `python3 scripts/qa-norde.py --mobile --shot 2>&1 | tail -3` → PASS; глазами мобильный ch01.

- [ ] **Step 4: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): манифест — разворот с pull-quote, drop cap, сетка 12 кол"
```

---

### Task 7: Глава 04 — borderless-каталог, ранний reveal, фильтры-текст, FLIP-дуотон

**Files:**
- Modify: `templates/ecommerce/index.html` — `mediaIO` (712–721), `.filter-btn` (197–202), `.product` hover (208–212), FLIP (1158–1162)

- [ ] **Step 1: Ранний reveal карточек**

Стр. 720: `}, { threshold: 0.15 })` → `}, { threshold: 0.15, rootMargin: '0px 0px 200px 0px' })`

- [ ] **Step 2: Hover-lift вместо фона**

```css
.product{
  background:var(--paper); display:flex; flex-direction:column; cursor:pointer;
  transition:transform .35s var(--ease-cine);
}
.product:hover{transform:translateY(-4px)}
```

- [ ] **Step 3: Фильтры без рамок**

Заменить `.filter-btn` правила (стр. 197–202):

```css
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
.filter-btn.active{color:var(--brass)}
.filter-btn.active::after{background:var(--brass)}
```

- [ ] **Step 4: Дуотон FLIP-клону**

В FLIP (стр. 1158–1162) в `Object.assign(clone.style, {…})` добавить свойство:

```js
        filter: 'grayscale(1) sepia(.22) contrast(1.06) brightness(1.02)',
```

- [ ] **Step 5: QA 3 режима + кадр**

Run: `python3 scripts/qa-norde.py --shot 2>&1 | tail -3` → PASS; глазами `/tmp/norde-qa-ch04.png` — сетка без рамок, фильтры текстовые.
Run: `--mobile` и `--rm` → PASS.

- [ ] **Step 6: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): каталог — borderless, hover-lift, ранний reveal, фильтры-текст"
```

---

### Task 8: Скролл-тюнинг

**Files:**
- Modify: `templates/ecommerce/index.html` — Lenis (1026), ScrollTrigger.config (после 1025), `[data-clip]` (1106)

- [ ] **Step 1: Тюнинг**

Стр. 1026: `const lenis = new Lenis({ lerp: 0.11 });` → `const lenis = new Lenis({ lerp: 0.12 });`
После стр. 1025 (`gsap.registerPlugin(ScrollTrigger);`) добавить строку: `ScrollTrigger.config({ ignoreMobileResize: true });`
Стр. 1106: `start: 'top 85%'` → `start: 'top 90%'`

- [ ] **Step 2: QA 3 режима**

Run: `python3 scripts/qa-norde.py 2>&1 | tail -2` → PASS; `--mobile` → PASS; `--rm` → PASS.

- [ ] **Step 3: Commit**

```bash
git add templates/ecommerce/index.html
git commit -m "feat(norde): скролл — lerp 0.12, ignoreMobileResize, ранние clip-ревилы"
```

---

### Task 9: Финал — визуальный ревью, синхронизация, README

**Files:**
- Modify: `public/templates/ecommerce/index.html`, `templates/ecommerce/README.md`, `public/templates/ecommerce/README.md`

- [ ] **Step 1: Полные прогоны с кадрами**

Run: `python3 scripts/qa-norde.py --shot` / `--mobile --shot` / `--rm --shot` — все RESULT: PASS (37 чеков).
Глазами ВСЕ кадры `/tmp/norde-qa-*.png` (desktop+mobile): нет «пустых» луков, каталог появляется вовремя, границ нет, дуотон единый, hero-обложка, pull-quote. Замечания — фиксить в этой же задаче.

- [ ] **Step 2: Перф-спотчек**

LCP через PerformanceObserver (buffered) < 2500ms; консоль без ошибок. Eager-образы лукбука — осознанное утяжеление, зафиксировано в спеке §9.

- [ ] **Step 3: Синхронизация витрины**

```bash
cp templates/ecommerce/index.html public/templates/ecommerce/index.html
```

- [ ] **Step 4: README**

В `templates/ecommerce/README.md` обновить: дуотон-система и hover-проявление; обложка 100svh; манифест-разворот; «Archive Runner» вместо Court Low в planche; eager/preload лукбука; borderless. Скопировать в `public/templates/ecommerce/README.md`.

- [ ] **Step 5: Commit**

```bash
git add templates/ecommerce/ public/templates/ecommerce/
git commit -m "feat(norde): Editorial+ — финальная полировка, синхронизация витрины"
```

---

## Self-Review пройдено

- Покрытие спеки: §1→Task 2/7, §2→Task 3, §3→Task 6, §4→Task 4, §5→Task 5, §6→Task 7, §7→Task 2, §8→Task 4/5/8, §9→Task 9, §10 — не трогаем. ✓
- Плейсхолдеров нет; имена/селекторы согласованы между задачами (`.chapter-numeral`, `.manifest-*`, `.swatch-name`, `setSwatchName`). ✓
- Нумералов 5 (главы 01–05; hero исключён — она сама обложка, уточнение к спеке §1). ✓
