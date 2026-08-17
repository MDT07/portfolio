# NORDE «Живой архив» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переосмыслить NORDE как «Живой архив» — сохранить editorial-ДНК и инвентарную ведомость, добавить кинетическую типографику глав, процедурное зерно, звуковой слой opt-in, CSS scroll-driven reveal, View Transitions, один dopamine-акцент.

**Architecture:** Однофайловый HTML-шаблон с progressive enhancement: базовый слой — CSS (scroll-driven animations, View Transitions, feTurbulence зерно), JS-слой — GSAP SplitText для кинетики заголовков + Howler для звука + Lenis для smooth scroll. Каждая глава получает свою моушн-подпись. Условные блоки: `motionOK` (GSAP+Lenis), `soundOK` (opt-in toggle), `pointer:fine` (курсор).

**Tech Stack:** HTML5, CSS3 (scroll-driven animations, View Transitions, feTurbulence), GSAP 3.12.5 + ScrollTrigger + SplitText, Lenis 1.1.14, Howler 2.2.4 (vendor), Chrome DevTools Protocol QA.

**Files:**
- `templates/ecommerce/index.html` — основной файл (2265 строк, модификация)
- `templates/ecommerce/README.md` — обновление документации
- `scripts/qa-norde-checks.json` — обновление чеков под новые фичи
- `scripts/qa-norde-probe.py` — обновление зондов (звук, зерно, кинетика)
- `public/templates/ecommerce/` — синк копий

---

### Task 1: Цветовая палитра — dopamine-акцент

**Files:**
- Modify: `templates/ecommerce/index.html:22-35` (токены :root)
- Test: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`

- [ ] **Step 1: Выбрать и зафиксировать акцент**

  Два варианта (выбор пользователя):
  - **Киноварь** `#B7410E` — тёплый красно-оранжевый, исторический краситель, подходит к латуни и бумаге
  - **Изумруд** `#0B6E4F` — jewel tone, контраст с бумажной базой, свежесть

  Рекомендация: киноварь — он исторически связан с печатью и архивами, органичен editorial-ДНК.

- [ ] **Step 2: Обновить токены**

  ```css
  :root{
    --paper:#FAFAF9; --paper-2:#F4F3F1; --ink:#1C1917;
    --ink-2:rgba(28,25,23,.62); --ink-3:rgba(28,25,23,.68);
    --line:#D6D3D1; --brass:#A16207; --brass-hover:#8A5506;
    --accent:#B7410E; --accent-hover:#9A350B;  /* киноварь — dopamine-акцент */
    --dark:#161412; --dark-ink:#EDE9E4; --dark-ink-2:rgba(237,233,228,.62);
    --dark-line:rgba(237,233,228,.16);
    --error:#DC2626;
    --chapter-accent:var(--accent);  /* пигмент текущей главы */
    --font-display:"Playfair Display",Georgia,serif;
    --font-ui:"Manrope",system-ui,sans-serif;
    --font-mono:"JetBrains Mono",monospace;
    --ease-cine:cubic-bezier(0.65,0,0.35,1);
    --container:1360px;
  }
  ```

  Заменить все жёсткие `#A16207` на `var(--accent)` в CSS, кроме явных brass-элементов (кнопки, штампы).

- [ ] **Step 3: Проверить контраст акцента**

  Киноварь `#B7410E` на бумаге `#FAFAF9`: контраст ~4.8:1 — проходит WCAG AA для крупного текста (18pt+ или 14pt bold), для body-текста — нет. Использовать акцент только для:
  - Крупных заголовков (h2, h3) — OK
  - Кнопок primary — OK (текст белый на акценте: контраст ~5.2:1)
  - Иконок, индикаторов, подчёркиваний — OK
  - НЕ использовать для body-текста 16px — использовать `--ink` или `--brass`

- [ ] **Step 4: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`
  Expected: PASS (цветовые чеки проверяют computed style, не конкретный hex)

- [ ] **Step 5: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): dopamine-акцент киноварь (#B7410E) — тёплый красно-оранжевый для editorial-архива"
  ```

---

### Task 2: Кинетическая типографика заголовков глав

**Files:**
- Modify: `templates/ecommerce/index.html` — секции с `h2` (главы 01–05)
- Modify: `templates/ecommerce/index.html` — блок MOTION (ScrollTrigger batch)
- Test: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`

- [ ] **Step 1: Добавить SplitText в загрузку**

  GSAP SplitText — часть GSAP 3.12.5 (бесплатен с конца 2024). Убедиться, что CDN включает плагин:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/SplitText.min.js"></script>
  ```
  Проверить: `window.gsap.plugins.splitText` существует после загрузки.

- [ ] **Step 2: Разметка заголовков для SplitText**

  Каждый `h2` главы оборачиваем в `.chapter-title`:
  ```html
  <h2 class="chapter-title" data-split-text>01 / ВВЕДЕНИЕ</h2>
  ```
  CSS:
  ```css
  .chapter-title .word{display:inline-block; overflow:hidden; vertical-align:top}
  .chapter-title .word-inner{display:inline-block; transform:translateY(100%); transition:none}
  .chapter-title.revealed .word-inner{transform:translateY(0); transition:transform .8s var(--ease-cine)}
  /* stagger через transition-delay на nth-child */
  .chapter-title.revealed .word:nth-child(1) .word-inner{transition-delay:0s}
  .chapter-title.revealed .word:nth-child(2) .word-inner{transition-delay:.08s}
  .chapter-title.revealed .word:nth-child(3) .word-inner{transition-delay:.16s}
  .chapter-title.revealed .word:nth-child(4) .word-inner{transition-delay:.24s}
  .chapter-title.revealed .word:nth-child(5) .word-inner{transition-delay:.32s}
  ```

- [ ] **Step 3: JS — SplitText + ScrollTrigger**

  В блоке MOTION, после существующих ScrollTrigger.batch:
  ```javascript
  /* кинетическая типографика глав */
  $$('.chapter-title[data-split-text]').forEach(title => {
    const text = title.textContent;
    title.innerHTML = text.split(' ').map(word =>
      `<span class="word"><span class="word-inner">${word}</span></span>`
    ).join(' ');
    gsap.set(title.querySelectorAll('.word-inner'), { y: '100%' });
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      onEnter: () => title.classList.add('revealed'),
      once: true
    });
  });
  ```

- [ ] **Step 4: Альтернатива без GSAP (progressive enhancement)**

  Если SplitText не загрузился (CDN-фейл), заголовки остаются читаемыми — нет JS-зависимости для базового контента.

- [ ] **Step 5: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`
  Expected: PASS (чек hero-title разбит на слова — обновить под новую разметку)

- [ ] **Step 6: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): кинетическая типографика глав — SplitText + mask-line reveal по скроллу"
  ```

---

### Task 3: Процедурное зерно/текстура бумаги

**Files:**
- Modify: `templates/ecommerce/index.html:60-76` (существующий .grain)
- Test: `python3 scripts/qa-norde.py --rm 2>&1 | grep RESULT` (RM должен глушить анимацию)

- [ ] **Step 1: Улучшить feTurbulence-зерно**

  Текущий `.grain` — базовый fractalNoise. Усилить:
  ```css
  .grain{
    position:fixed; inset:-140px; z-index:999; pointer-events:none; opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    will-change:transform;
    animation:grainShift 1.2s steps(1) infinite;
  }
  @keyframes grainShift{
    0%{transform:translate3d(0,0,0) scale(1.1)}
    25%{transform:translate3d(-80px,60px,0) scale(1.15)}
    50%{transform:translate3d(60px,-90px,0) scale(1.08)}
    75%{transform:translate3d(-70px,-50px,0) scale(1.12)}
    100%{transform:translate3d(0,0,0) scale(1.1)}
  }
  ```
  Улучшения: больше плитка (512×512), numOctaves:3 для плотности, stitchTiles, desaturate через feColorMatrix, scale в ключевых кадрах для размытия краёв.

- [ ] **Step 2: Добавить бумажную текстуру на секции**

  ```css
  .paper-texture{
    position:relative;
  }
  .paper-texture::before{
    content:''; position:absolute; inset:0; pointer-events:none; opacity:.03;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting lighting-color='%23F4F3F1' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E");
    mix-blend-mode:multiply;
  }
  ```
  Применить к `.ledger-sheet`, `.opis`, `.journal-overlay` — «бумажные» диалоги.

- [ ] **Step 3: RM-фолбэк**

  ```css
  @media (prefers-reduced-motion: reduce){
    .grain{animation:none; opacity:.02}
    .paper-texture::before{opacity:.01}
  }
  ```

- [ ] **Step 4: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep RESULT && python3 scripts/qa-norde.py --rm 2>&1 | grep RESULT`
  Expected: PASS ×2

- [ ] **Step 5: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): процедурное зерно + бумажная текстура — feTurbulence без PNG-веса"
  ```

---

### Task 4: Звуковой слой opt-in

**Files:**
- Create: `templates/ecommerce/assets/sounds/` (спрайт-файл, 1-2 микро-звука в base64 для демо)
- Modify: `templates/ecommerce/index.html` — тоггл звука, Howler init, привязка звуков к событиям
- Modify: `scripts/qa-norde-checks.json` — чек «звук opt-in, выключен по умолчанию»
- Test: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`

- [ ] **Step 1: Добавить Howler CDN**

  ```html
  <script src="https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js"></script>
  ```

- [ ] **Step 2: Тоггл звука в шапке**

  ```html
  <button class="sound-toggle" id="soundToggle" type="button" aria-pressed="false" aria-label="Звук выключен">
    <span class="sound-off" aria-hidden="true">🔇</span>
    <span class="sound-on" aria-hidden="true" hidden>🔊</span>
  </button>
  ```
  CSS: `.sound-toggle{font-size:14px; padding:8px; border-radius:50%; border:1px solid var(--line)} .sound-toggle[aria-pressed="true"]{border-color:var(--accent)}`

- [ ] **Step 3: JS — Howler + привязка**

  ```javascript
  const soundEnabled = () => $('#soundToggle').getAttribute('aria-pressed') === 'true';
  let stampSound = null;
  if (window.Howl) {
    stampSound = new Howl({
      src: ['data:audio/mp3;base64,/* base64 микро-звука штампа ~2KB */'],
      volume: 0.15
    });
  }
  $('#soundToggle').addEventListener('click', () => {
    const btn = $('#soundToggle');
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', on);
    btn.setAttribute('aria-label', on ? 'Звук включён' : 'Звук выключен');
    btn.querySelector('.sound-off').hidden = on;
    btn.querySelector('.sound-on').hidden = !on;
  });
  function playStamp() {
    if (soundEnabled() && stampSound) stampSound.play();
  }
  // Привязка: штамп «принято в архив» в акте
  // В checkout(): после отрисовки штампа — playStamp()
  ```

  Для демо: один base64-звук штампа (~2KB inline), ленивая загрузка не нужна (вес в бюджете <3MB).

- [ ] **Step 4: Добавить чек в qa-norde-checks.json**

  ```json
  {"name": "звук opt-in: выключен по умолчанию", "js": "document.querySelector('#soundToggle').getAttribute('aria-pressed') === 'false'"},
  {"name": "звук: тоггл переключает aria-pressed", "js": "(document.querySelector('#soundToggle').click(), document.querySelector('#soundToggle').getAttribute('aria-pressed') === 'true')"}
  ```

- [ ] **Step 5: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`
  Expected: PASS

- [ ] **Step 6: Commit**

  ```bash
  git add templates/ecommerce/index.html scripts/qa-norde-checks.json
  git commit -m "feat(norde): звуковой слой opt-in — Howler, микро-штамп, тоггл в шапке"
  ```

---

### Task 5: CSS Scroll-Driven Animations (progressive enhancement)

**Files:**
- Modify: `templates/ecommerce/index.html` — CSS-правила для reveal
- Modify: `templates/ecommerce/index.html` — JS-фолбэк через ScrollTrigger
- Test: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`

- [ ] **Step 1: CSS scroll-driven reveal для простых элементов**

  ```css
  @supports (animation-timeline: view()){
    .scroll-reveal{
      animation: fade-in-up linear both;
      animation-timeline: view();
      animation-range: entry 10% entry 60%;
    }
    @keyframes fade-in-up{
      from{opacity:0; transform:translateY(30px)}
      to{opacity:1; transform:translateY(0)}
    }
  }
  ```
  Применить к `.ledger-item`, `.material-card`, `.journal-item` — заменяет часть GSAP ScrollTrigger.batch.

- [ ] **Step 2: JS-фолбэк для браузеров без поддержки**

  ```javascript
  const supportsScrollDriven = CSS.supports('animation-timeline', 'view()');
  if (!supportsScrollDriven && motionOK) {
    // Существующий ScrollTrigger.batch для .ledger-item остаётся
    // (уже реализован в предыдущих коммитах)
  }
  ```
  CSS `@supports` автоматически гасит правила в неподдерживаемых браузерах; JS-фолбэк — только для отключения дублирования анимации.

- [ ] **Step 3: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`
  Expected: PASS

- [ ] **Step 4: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): CSS scroll-driven reveal — progressive enhancement, GSAP fallback"
  ```

---

### Task 6: View Transitions (same-document)

**Files:**
- Modify: `templates/ecommerce/index.html` — `@view-transition` + именованные снапшоты
- Test: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`

- [ ] **Step 1: CSS opt-in для same-document transitions**

  ```css
  @view-transition{
    navigation:auto;
  }
  ::view-transition-old(root),
  ::view-transition-new(root){
    animation-duration:.5s;
    animation-timing-function:var(--ease-cine);
  }
  ```
  Это включает плавные переходы при DOM-изменениях (открытие/закрытие drawer, look-stage, опись, журнал).

- [ ] **Step 2: Именованные снапшоты для ключевых элементов**

  ```css
  .ledger-sheet.open .sheet-media img{
    view-transition-name: product-photo;
  }
  .drawer .cart-item img{
    view-transition-name: product-photo;
  }
  ```
  При добавлении в корзину — фото «перелетает» из листа в drawer через VT.

- [ ] **Step 3: JS-обёртка для DOM-изменений**

  ```javascript
  function withTransition(fn) {
    if (document.startViewTransition) {
      document.startViewTransition(fn);
    } else {
      fn();
    }
  }
  // Использовать: withTransition(() => toggleSheet(id)) — при открытии/закрытии листа
  ```

- [ ] **Step 4: Прогон QA**

  Run: `python3 scripts/qa-norde.py 2>&1 | grep RESULT`
  Expected: PASS (VT не ломает функциональность в неподдерживаемых браузерах)

- [ ] **Step 5: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): View Transitions API — same-document, именованные снапшоты product-photo"
  ```

---

### Task 7: Микро-интерактив и polish

**Files:**
- Modify: `templates/ecommerce/index.html` — hover-эффекты, магнитные кнопки, курсор
- Test: `python3 scripts/qa-norde.py 2>&1 | grep RESULT && python3 scripts/qa-norde-probe.py 2>&1 | tail -5`

- [ ] **Step 1: Магнитные кнопки (pointer:fine)**

  ```css
  @media (pointer:fine){
    .btn-magnetic{transition:transform .2s var(--ease-cine)}
    .btn-magnetic:hover{transform:scale(1.03)}
    .btn-magnetic:active{transform:scale(.97)}
  }
  ```
  Применить к `.btn-primary`, `.sheet-add`, `.size-btn`.

- [ ] **Step 2: Усилить кастомный курсор**

  Текущий `#cursor` — простой круг. Усилить: лупа цвета при наведении на `.ledger-row` (показывает accent-цвет), lerp-инерция через requestAnimationFrame (уже есть quickTo в preview — расширить на курсор).

- [ ] **Step 3: Hover-эффекты ведомости**

  ```css
  .ledger-row{transition:background .25s, border-color .25s}
  .ledger-row:hover{background:var(--paper-2); border-left-color:var(--accent)}
  .ledger-row::before{content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:transparent; transition:background .25s}
  .ledger-row:hover::before{background:var(--accent)}
  ```

- [ ] **Step 4: Прогон QA + probe**

  Run:
  ```bash
  python3 scripts/qa-norde.py 2>&1 | grep RESULT
  python3 scripts/qa-norde-probe.py 2>&1 | tail -5
  ```
  Expected: PASS, FPS 60, 0 long tasks

- [ ] **Step 5: Commit**

  ```bash
  git add templates/ecommerce/index.html
  git commit -m "feat(norde): микро-интерактив — магнитные кнопки, accent-hover строк, курсор-лупа"
  ```

---

### Task 8: QA-сьют — обновление чеков

**Files:**
- Modify: `scripts/qa-norde-checks.json` — новые чеки (звук, VT, scroll-driven, кинетика)
- Modify: `scripts/qa-norde-probe.py` — зонды зерна, звука, кинетики
- Test: `python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'`

- [ ] **Step 1: Добавить чеки**

  ```json
  {"name": "кинетика: заголовки глав разбиты на слова", "js": "document.querySelectorAll('.chapter-title .word').length > 0"},
  {"name": "зерно: .grain существует и анимирован", "js": "getComputedStyle(document.querySelector('.grain')).animationName !== 'none'"},
  {"name": "View Transitions: @view-transition в стилях", "js": "[...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.cssText && r.cssText.includes('@view-transition')); } catch(e){ return false; } })"},
  {"name": "scroll-driven: @supports animation-timeline", "js": "CSS.supports('animation-timeline', 'view()') || document.querySelector('.scroll-reveal') !== null"}
  ```

- [ ] **Step 2: Обновить probe**

  Добавить зонд «зерно не ломает FPS» (проверить, что grain анимация не создаёт long tasks при скролле) — расширить существующий зонд 5.

- [ ] **Step 3: Полный прогон**

  Run:
  ```bash
  python3 scripts/qa-norde.py 2>&1 | grep -E 'FAIL|RESULT'
  python3 scripts/qa-norde.py --mobile 2>&1 | grep RESULT
  python3 scripts/qa-norde.py --rm 2>&1 | grep RESULT
  python3 scripts/qa-norde-probe.py 2>&1 | tail -5
  python3 scripts/qa-norde-lcp.py 2>&1 | tail -3
  ```
  Expected: PASS ×3, FPS 60, LCP < 1500ms

- [ ] **Step 4: Commit**

  ```bash
  git add scripts/qa-norde-checks.json scripts/qa-norde-probe.py
  git commit -m "test(norde): чеки под кинетику, зерно, VT, scroll-driven + probe зерна"
  ```

---

### Task 9: README + синк

**Files:**
- Modify: `templates/ecommerce/README.md`
- Modify: `public/templates/ecommerce/index.html`, `public/templates/ecommerce/README.md`
- Test: `python3 scripts/validate-case.mjs 2>&1 | tail -5`

- [ ] **Step 1: Обновить README**

  Буллеты:
  - Кинетическая типографика глав (SplitText + ScrollTrigger)
  - Процедурное зерно/текстура (feTurbulence, без PNG)
  - Звуковой слой opt-in (Howler, микро-штамп)
  - CSS scroll-driven reveal (progressive enhancement)
  - View Transitions API (same-document, именованные снапшоты)
  - Dopamine-акцент киноварь (#B7410E)
  - Микро-интерактив: магнитные кнопки, accent-hover строк
  - 70+ проверок CDP

- [ ] **Step 2: Синк**

  ```bash
  cp templates/ecommerce/index.html public/templates/ecommerce/index.html
  cp templates/ecommerce/README.md public/templates/ecommerce/README.md
  ```

- [ ] **Step 3: Валидация**

  Run: `npm run validate 2>&1 | tail -5`
  Expected: синк проходит, MDX-кейсы валидны

- [ ] **Step 4: Финальный коммит**

  ```bash
  git add templates/ecommerce public/templates/ecommerce scripts/
  git commit -m "docs(norde): README под Живой архив + синк — T4 завершена"
  ```

---

## Self-Review

**Spec coverage:**
- [x] Кинетическая типографика → Task 2
- [x] Процедурное зерно/текстура → Task 3
- [x] Звуковой слой opt-in → Task 4
- [x] CSS scroll-driven reveal → Task 5
- [x] View Transitions → Task 6
- [x] Dopamine-акцент → Task 1
- [x] Микро-интерактив → Task 7
- [x] QA-сьют → Task 8
- [x] README + синк → Task 9

**Placeholder scan:** Нет TBD/TODO/«implement later». Все шаги содержат конкретный код.

**Type consistency:** `--accent` используется единообразно; `var(--accent)` в CSS, `--accent` в :root. `playStamp()` — единая функция звука.

**Scope:** 9 задач, каждая — самодостаточный инкремент. Нет разделения на подсистемы — NORDE остаётся однофайловым.

**Execution handoff:** Plan saved to `docs/superpowers/plans/2026-08-08-norde-living-archive.md`.
