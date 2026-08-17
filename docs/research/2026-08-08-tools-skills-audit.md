# Аудит инструментов и скиллов + план дополнения (T2)

Дата: 2026-08-08. Назначение: инвентарь возможностей перед тотальным редизайном NORDE, ATLAS, FORM, AI WORKS, VOLT; что дополнить и как.
Метод: 3 explore-субагента (граф знаний+скиллы / CLI+тулчейн / веб-дополнения), данные npm/caniuse/GitHub API.

---

## 1. Что у нас есть

### Граф знаний (~/Desktop/knowledge-graph, 3466+5 заметок)
- design/: fonts 1923 (с кириллицей), colors 192, products 192, ui-reasoning 161, icons 105, ux-guidelines 99, styles 84, typography-пары 74, motion 16, stacks 22, hubs 22 и др.
- skills/: hermes 223, clawhub-registry 171, kimi 16, claude 13, agents 12.
- `kg.py` сканирует живьём — добавление = положить .md с фронтматтером (title/type/tags/aliases/source обязателен), пересборка не нужна.
- **Добавлено в рамках T2** (5 заметок + 2 фикса алиасов):
  - `design/hubs/trends-2026-hub.md` — тренды 2026 со ссылками на ресёрч T1
  - `design/stacks/threejs-webgpu-tsl.md`, `design/stacks/view-transitions-api.md`, `design/stacks/css-scroll-driven-animations.md`
  - `design/motion/ui-sound-design.md`
  - Русские алиасы в kinetic-typography и tactile-digital-deformable-ui — языковая дыра поиска частично закрыта
- Проверка: запросы webgpu / звук / тренды 2026 / view transitions / кинетическая — все находят новые заметки. Коммит в репо графа НЕ делался (git-мьютации только по запросу).

### CLI-агенты (все ходят в один Kimi Coding API, различаются обвязкой)
| CLI | Версия | Модель | Сильное для нашей работы |
|---|---|---|---|
| hermes | 0.20.0 | kimi-k3 (+MoA, делегация на k2.7-code) | 188 скиллов: ui-ux-pro-max, design-system, creative (p5js, blender, hyperframes, design-md), browser/computer-use |
| claude | 2.1.225 | k3-256k (через ANTHROPIC_BASE_URL) | Claude Code UX, GitNexus-хук |
| openclaw | 2026.7.1 | kimi/k3 (+k2.5) | мультиагентный gateway, изолированные workspace |
| kimi | 0.34.0 | k3-256k (умолч.), k3 1M | plan-mode, фон-задачи, MCP |

### Скиллы (188 hermes + 11 agents + 13 claude + superpowers)
- Ядро дизайна: **ui-ux-pro-max** (CSV-датасеты + поиск), **design-system** (токены/спеки/слайды), **hallmark** (анти-AI-slop, 29 референсов, cookbook компонентов), **impeccable** (audit/animate/bolder/typeset/polish), creative/popular-web-designs (54 дизайн-системы Stripe/Linear/Vercel как HTML), web-development/awwwards-redesign, dogfood/adversarial-ux-test.

### Шаблоны проекта (7 однофайловых, templates/ → public/templates/)
| Шаблон | Библиотеки CDN |
|---|---|
| development (PRIMARY TERRA) | maplibre-gl@4.7.1, lenis@1.1.18 |
| ecommerce (NORDE) | gsap@3.12.5+ScrollTrigger, lenis@1.1.14 |
| ai / atlas / form / metric / volt | только Google Fonts (metric — чарты руками на SVG) |

### QA-тулчейн
qa-norde.py (66 чеков CDP), qa-norde-probe.py, qa-norde-lcp.py, qa-metric.py, qa-template.py (atlas/form/volt/ai), shot-covers.py, validate-case.mjs (синк шаблонов, MDX-валидация).
**Дыра:** нет visual-regression baseline'ов (скриншоты без snapshot-diff).

### Проблема конфига
`~/.kimi-code/config.toml` → mcp.servers указывает на мёртвый путь `~/Desktop/ux-ui-designkits/.kimi/mcp.json` (папки нет). Действующие MCP живут в `~/.kimi-code/mcp.json` (github, sentry, context7, ai-bot-factory). **Кандидат на чистку — нужно подтверждение пользователя.**

## 2. Что принимаем из интернета (по убыванию ценности)

| # | Инструмент | Зачем | Как принимаем |
|---|---|---|---|
| 1 | **View Transitions API** (Baseline 2025-10) | Переходы страниц одной строкой CSS; React 19 `<ViewTransition>` | Нативно, 0 KB. В портфолио (кейсы) и шаблоны. Заметка в графе ✓ |
| 2 | **Motion v13** (= framer-motion 13) | Микровзаимодействия React-части | `npm i motion`, миграция импортов с framer-motion@12 — при редизайне dev.developer, не сейчас |
| 3 | **Three.js WebGPU + TSL** (r185) | Единый шейдер-код WGSL/GLSL, compute, нодовый пост-процесс | `three/webgpu` + forceWebGL-фолбэк. Для 3D-шаблонов по концепциям T3. Заметка ✓ |
| 4 | **tsl-textures** | Процедурное зерно/шум на GPU вместо PNG | npm, при появлении TSL-сцен |
| 5 | **CSS Scroll-Driven Animations** | 60fps off-main-thread reveal без JS | Progressive enhancement; FF-preview — фолбэк GSAP. Заметка ✓ |
| 6 | **swup 4.9** | MPA-переходы в статичных шаблонах | Только где CSS VT недостаточно (FF) |
| 7 | **OGL 1.0.11** (~10-20KB treeshake) | Лёгкие шейдер-герои без three.js | Vendor «как замороженный» (поддержка замедлена) |
| 8 | **Rive canvas-lite** | Интерактивная векторная анимация (стек SOTY 2025) | Точечно: маскоты/курсоры/stateful-иллюстрации |
| 9 | **Howler 2.2.4** (10KB) | Звуковой слой (тренд 2026) | Vendor; только opt-in. Заметка ✓ |
| 10 | **Google design.md spec + CLI** | `lint` DESIGN.md (WCAG-контраст!), `export --format css-tailwind` → Tailwind v4 @theme | `npx @google/design.md` в QA-пайплайн — прямая интеграция с нашим DESIGN.md |
| 11 | **dembrandt** | Реверс дизайн-систем референсов в токены | npm CLI, для анализа awwwards-референсов |
| 12 | **Fontshare** (Sentient/Boska/Switzer/Clash) + GF old-style (EB Garamond, Cormorant, Brygada 1918, Archivo-condensed) + Velvetyne | Типографика трендов 2026 | self-host woff2 в public/fonts, по концепциям |
| 13 | **fffuel/Transparent Textures/feTurbulence** | Зерно, бумага, тактильность | генерация ассетов |
| 14 | **Lucide/Phosphor** | Тех-иконки для micro-industrial | svg-спрайт vendor |
| 15 | **Poly Haven / Quaternius / Kenney** | CC0 HDRI/текстуры/GLB для 3D | скачать + оптимизация KTX2 |

**VoltAgent/awesome-design-md** (107k★): целиком НЕ качать. Точечно 5-10 DESIGN.md близких архетипов (Ferrari/Bugatti — chiaroscuro, WIRED/The Verge — editorial, ElevenLabs — cinematic dark, Dell-1996 — ретро-брутал). Плюс сверить наш ui-ux-pro-max с апстримом (115k★).

**НЕ принимаем:** split-type (мёртв, у нас SplitText), Barba.js (заглох), curtains.js (угас), Theatre.js (замёрз), Locomotive Scroll (вытеснен Lenis), anime.js v4 (90% дубль GSAP — только если нужен лёгкий vanilla-движок).

## 3. Оставшиеся дыры (зафиксированы, не блокеры)

1. Visual-regression baseline'ов нет — при желании: playwright snapshots или dembrandt+CDP эталоны.
2. Motion-категория графа тощая (16+1) — пополняется по мере редизайнов.
3. Serif-таксономии нет — решаем выбором шрифтов в T3 вручную.
4. Мёртвый MCP-путь в config.toml — ждёт подтверждения на чистку.

## 4. Источники

npm registry, caniuse/webstatus.dev, GitHub API, bundlejs — через отчёты субагентов;
developer.chrome.com/docs/web-platform/view-transitions, github.com/mrdoob/three.js/wiki (TSL), google-labs-code/design.md, VoltAgent/awesome-design-md, fontshare.com, scroll-driven-animations.style.
Оговорки: bundlejs-размеры без treeshake; WebGPU в FF141 частичный; поисковики капчили — поздние материалы 2026 могли пройти мимо.
