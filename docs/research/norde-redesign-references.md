# NORDE — банк референсов и материалов для редизайна (Awwwards)

Собрано 2026-07-31. Источники: локальный граф знаний (`~/Desktop/knowledge-graph`), скилл `awwwards-redesign`, подтверждённые страницы awwwards.com.

## Текущее состояние шаблона

- `templates/ecommerce/index.html` — 1504 строки, self-contained, vanilla JS, без зависимостей.
- Секции: Header → Hero → Категории (4) → Каталог (8 товаров, фильтры) → Преимущества → Footer + quick-view модалка + drawer корзины (рабочие: +/−, доставка от 10 000 ₽, toast).
- Визуал: strict-realism (тёмная тема #0A0A0A, акцент #0070F3, Inter + JetBrains Mono, бордеры вместо теней). Скандинавская эстетика, фото Unsplash.
- Моушн: только fade-up reveal (IntersectionObserver). Нет кинематографики, 3D, камер, скролл-сторителлинга.
- Вердикт: добротный «корпоративный» магазин — базовый уровень, не Awwwards.

## Подтверждённые референсы (awwwards.com)

| Сайт | Награда | Что воровать |
|---|---|---|
| [DICH™ Fashion](https://www.awwwards.com/sites/dichtm-fashion) | SOTD 09.06.2025 | WebGL-текст + 3D-объект в hero, cursor trail, прелоадер с характером, палитра из 2 цветов |
| [Max Mara — Jacket Circle](https://www.awwwards.com/sites/max-mara-jacket-circle) | SOTD 16.04.2026 | Геймификация вместо каталога; живой: thejacketcirclegame.maxmara.com |
| [VERO ITALY 3D](https://www.awwwards.com/sites/vero-italy-3d-immersive-site) | Nominee 2025 | Осмотр товара 360° (дешёвая версия — спрайт-секвенсия по скроллу) |
| [KM20 Online Store](https://www.awwwards.com/sites/km20-online-store) | HM 2024 | Московский концепт-стор (RU-репер!): «Digital Island» — интерактивная зона над каталогом |
| [Outfit (hellohello)](https://www.awwwards.com/sites/outfit) | SOTD | Ритейл как сторителлинг: e-com больше, чем транзакция |
| [Studio KARO](https://www.awwwards.com/sites/studio-karo) | HM 2025 | Контент-хаб (арт/музыка) встроен в шопинг |
| [The Cloister](https://www.awwwards.com/sites/the-cloister) | HM | Винтаж как архив: кураторская editorial-подача, нумерация единиц |
| [Retronova](https://www.awwwards.com/sites/retronova) | SOTD 09.2024 | Одна метафора через все элементы («one metaphor everywhere») |
| [Pollini](https://www.awwwards.com/sites/pollini) | HM 2024 | Эталон сдержанной люксовой типографики/сетки |
| [ONS Clothing](https://www.awwwards.com/sites/ons-clothing) | HM | Tone-of-voice для одежды без пафоса |
| [Clothing Network](https://www.awwwards.com/sites/clothing-network) | Nominee 2026 | B2B-шит fashion |
| [Infinite Passerella (Lusion)](https://exp-infinite-passerella.lusion.co/) | SOTD 2022 + FWA | Эталон камеры: cinematic ↔ free orbit ↔ snapshot. Живой линк |

## Техники по реалистичности (single-file HTML + CDN: GSAP/Lenis/Three.js)

**Легко (GSAP/Lenis):** curtain/clip-path wipe переходы, fade-through-black, word/letter-mask reveals (stagger 40–60ms), velocity-marquee, magnetic buttons, color-drench инверсия глав, горизонтальный дрейф/каталог, deck-of-cards, chapter-маркеры «01–05», архивная нумерация «Batch n0.0847», cursor trail.

**Средне (Three.js из CDN, 200–400 строк):** glTF-вьюер продукта (orbit + scroll-driven camera по заданному пути), WebGL-текст, pinned scroll-scrub продукта. Дешёвая альтернатива 3D: **360° спрайт-секвенсия (60–90 кадров) со скрабером по скроллу** — 80% эффекта без WebGL.

**Не стоит:** XR walk-around магазин, процедурный подиум 24/7, GPU-симуляция ткани, мульти-SKU 3D-конфигуратор (R&D-бюджеты студий).

## Визуальные тренды award-tier fashion

- **Типографика:** 3 гарнитуры — display serif (hero) + гротеск (UI) + mono (метки); fluid `clamp(3.5rem, 11vw, 10rem)`.
- **Цвет:** палитры из 1–2 цветов; тёплый off-white вместо #FFF; 1–2 near-black главы максимум.
- **Изображения:** clip-path «проявление» (inset(100% 0 0 0)→0 + scale 1.12→1), Ken Burns 18–24s вместо видео, text-mask заливки.
- **Переходы:** занавес-вайпы, сквозь-чёрный фейд, FLIP-перелёт продукта между секциями, marquee-мосты; скролл через Lenis.
- **Анти-паттерны (штраф жюри):** глассморфизм, blob-формы, градиентный текст, typewriter, autoplay-видео без связи со скроллом, icon-zoo, AI-иллюстрации.

## Данные из графа знаний

- **Продуктовые паттерны:** [[design/products/e-commerce]] → Vibrant & Block-based / Aurora UI / Motion-Driven; [[design/products/e-commerce-luxury]] → Liquid Glass / 3D & Hyperrealism / Aurora UI; лендинг — Feature-Rich Showcase.
- **Палитра luxury:** primary `#1C1917`, bg `#FAFAF9`, акцент-металлик `#A16207` (WCAG 3:1).
- **Стили-кандидаты:** Editorial Grid/Magazine, Exaggerated Minimalism, Minimalist Monochrome.
- **Типографика:** пара «Fashion Forward» = Syne (заголовки) + Manrope (текст), avant-garde. ⚠️ **Syne без кириллицы** (greek/latin/latin-ext) — для RU нужна замена display-гарнитуры с кириллицей (Prata, Playfair Display, Cormorant, Unbounded, Manrope Display…). Manrope — кириллица есть.
- **Motion-пресеты:** page-transition, parallax-scroll (2 тира), scroll-reveal (3 тира), stagger-list, hover-micro-interaction, loading-skeleton — `design/motion/` в графе.
- **Скилл:** `~/.hermes/skills/web-development/awwwards-redesign/` + `references/awwwards-patterns.md` (12 SOTD-кейсов, переходы с реализацией).

## Живые 3D/камера референсы

1. https://exp-infinite-passerella.lusion.co/ — cinematic camera ↔ free orbit (SOTD 2022, эталон)
2. https://thejacketcirclegame.maxmara.com — 3D-опыт вокруг одного продукта (SOTD 2026)
3. VERO ITALY 3D — линк со страницы кейса awwwards
