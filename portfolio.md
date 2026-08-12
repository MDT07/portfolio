# Portfolio — Архитектура проекта

## Концепция

Портфолио разработчика как демонстрация инженерной культуры. Не визитка, а артефакт: код, структура и визуальный язык сами по себе доказывают уровень.

**Стиль:** строгий реализм. Инженерная точность, модульная сетка, монохромная база с одним сигнальным акцентом. Никакой декоративности — каждый элемент обоснован функцией. Ближе к Vercel и Linear по духу: precision, clarity, restraint.

**Главная** — editorial-постер уровня Awwwards внутри той же строгости (DESIGN.md §11): display-serif Prata, нумерованные главы, прелоадер, line-mask заголовки, velocity-marquee, hover-превью работ, постерный футер. Контент: «Принципы и подход» + работы.

**Референсы по духу:**
- [Vercel](https://vercel.com) — чёрно-белая точность, Geist, нулевой шум
- [Linear](https://linear.app) — ультраминимализм, один акцент, идеальный ритм
- [GeoLibre](https://github.com/opengeos/GeoLibre) — технический уровень: React + TypeScript, чистая архитектура

**Дизайн-система:** формат [DESIGN.md](https://github.com/VoltAgent/awesome-design-md) (Google Stitch spec) — единый источник правды для токенов. §10 — кинематографический слой демо-шаблонов, §11 — editorial-слой главной.

---

## Стек

| Слой | Технология | Версия | Назначение |
|------|-----------|--------|-----------|
| Фреймворк | Next.js (App Router) | 16 | SSG, routing, image optimization, proxy (ex-middleware) |
| Язык | TypeScript | 5 | Типобезопасность |
| Стили | Tailwind CSS | 4 | Токены из DESIGN.md → utility classes |
| Анимации | Framer Motion | 12 | Scroll-driven, page transitions (template.tsx), кинематографика §11 |
| Smooth scroll | Lenis | 1 | Тактильный скролл (components/providers/SmoothScroll) |
| Контент | MDX (next-mdx-remote/rsc + gray-matter) | — | Кейсы, локализация `<slug>.en.mdx` |
| i18n | Собственная (app/[lang] + proxy.ts) | — | RU на корне, EN под /en |
| Мониторинг | Sentry (@sentry/nextjs) | — | Опционально, env-gated (без DSN отключён) |
| Аналитика | Vercel Analytics | — | Нативно |
| Шрифты | Inter + JetBrains Mono + Prata | — | Sans для UI, mono для меток, Prata — display-serif §11 |
| Деплой | Vercel | — | Нативно для Next.js |

---

## Структура

```
portfolio/
├── portfolio.md                  # Этот файл — архитектурный контракт
├── HERMES.md                     # Инструментальный стек для Hermes agent
├── DESIGN.md                     # Дизайн-токены (Google Stitch spec)
├── package.json
├── next.config.ts                # withSentryConfig при наличии DSN
├── proxy.ts                      # i18n-роутинг: /en → [lang]=en, /ru → редирект, /* → rewrite /ru
├── tsconfig.json
├── instrumentation.ts            # Sentry server/edge register
├── instrumentation-client.ts     # Sentry client init
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── .env.example                  # Sentry DSN (заглушка)
│
├── app/
│   ├── globals.css               # Токены @theme + --font-display + light-вариант [data-theme]
│   ├── [lang]/                   # Локализованное дерево (ru, en)
│   │   ├── layout.tsx            # html, шрифты, anti-FOUC тема, Header/PosterFooter, Analytics
│   │   ├── template.tsx          # Кинематографичный вход страницы (300ms)
│   │   ├── page.tsx              # Главная: PosterHero + Marquee + AboutChapter + WorksIndex (§11)
│   │   └── works/
│   │       ├── page.tsx          # Каталог кейсов (grid)
│   │       └── [slug]/page.tsx   # Детальная кейса (MDX + демо)
│   ├── sitemap.ts                # Все маршруты × локали + hreflang
│   ├── robots.ts
│   └── opengraph-image.png       # 1200×630, брендированная
│
├── components/
│   ├── ui/                       # Примитивы: Button, Card, Tag, Reveal, MaskText,
│   │                             #   ThemeToggle, LangSwitcher
│   ├── layout/                   # Header (nav + theme + lang), PosterFooter (§11), Container
│   ├── sections/                 # Главная §11: PosterHero, Marquee, AboutChapter,
│   │                             #   WorksIndex + WorksIndexClient (hover-превью)
│   │                             # Каталог /works: WorksGrid
│   ├── interactive/              # Клиентские виджеты для MDX и страниц:
│   │                             #   Counter, BeforeAfter, ProcessSteps,
│   │                             #   DemoViewer (iframe fullscreen), Gallery
│   ├── mdx/mdx-components.tsx    # Маппинг MDX → стилизованные блоки + интерактив
│   └── providers/SmoothScroll.tsx # Lenis (off при prefers-reduced-motion)
│
├── content/
│   └── works/                    # Кейсы: development (Primary Terra),
│                                 #   norde (NORDE), metric (METRIC CRM),
│                                 #   atlas (travel-клуб), form (архстудия),
│                                 #   volt (EV-зарядки), ai (AI WORKS — раздел AI-интеграций);
│                                 #   EN-версии — <slug>.en.mdx
│
├── templates/                    # Исходники самодостаточных демо-шаблонов
│   ├── development/              # PRIMARY TERRA — девелопер полного цикла
│   ├── norde/                    # NORDE — архив объектов с биографией
│   ├── metric/                   # METRIC — CRM-конструктор для бизнеса
│   ├── atlas/                    # ATLAS — экспедиционный travel-клуб
│   ├── form/                     # FORM — архитектурная студия
│   ├── volt/                     # VOLT — сеть EV-зарядок
│   └── ai/                       # AI WORKS — лендинг AI-интеграций (демо-чат, ядра)
│
├── lib/
│   ├── config.ts                 # siteConfig: бренд, контакты
│   ├── i18n.ts                   # locales, getDictionary, withLocale, stripLocale
│   ├── dictionaries/             # ru.ts, en.ts (DeepString-тип Dictionary)
│   ├── mdx.ts                    # Загрузчик MDX (works, локали)
│   ├── animations.ts             # Framer Motion пресеты (150–400ms + кинематографика §10/§11)
│   └── utils.ts                  # cn()
│
└── public/
    ├── images/
    │   ├── portrait-dot.webp     # Портрет: точечная монохромная стилизация
    │   └── works/                # Обложки кейсов 1600×900 (headless Chrome)
    └── templates/                # Копия templates/ для live-демо по /templates/*
```

---

## Конвенции

### Именование
- Компоненты: `PascalCase.tsx`
- Утилиты: `camelCase.ts`
- MDX-кейсы: `kebab-case.mdx`
- CSS-классы: только Tailwind utilities, кастомные классы — исключение

### Компоненты
- Server Components по умолчанию; `"use client"` только при необходимости (анимации, интерактив)
- Один файл — один компонент
- Props типизируются через `interface ComponentNameProps`

### Контент
- Каждый кейс = один MDX в `content/works/` (+ `<slug>.en.mdx`) + live-исходники в `templates/<slug>/`, дублированные в `public/templates/<slug>/`
- Frontmatter works: `title`, `description`, `tags`, `year`, `role`, `stack`, `cover`, `demo`, `featured`

### i18n
- RU — дефолт на корневых путях (proxy rewrite → `/ru`), EN — под префиксом `/en`
- Тексты — только через словари `lib/dictionaries/`; новые ключи добавляются в оба языка
- Третий язык: добавить локаль в `lib/i18n.ts` + словарь — маршруты поднимутся автоматически

### Коммиты
- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

---

## Маршруты

| Путь | Страница | Тип |
|------|----------|-----|
| `/` (и `/en`) | Главная — editorial-постер: подход + работы | SSG |
| `/works` | Каталог кейсов | SSG |
| `/works/[slug]` | Детальная кейса | SSG (generateStaticParams) |
| `/templates/*` | Live-демо шаблонов | Статика из public/ |

Все страницы статические, обе локали пререндерятся. Бэкенда нет — контакт через mailto (email в `lib/config.ts`), мониторинг — Sentry при наличии DSN в env.

---

## Кейсы

### 1. PRIMARY TERRA — девелопер полного цикла (реальный кейс)

Сайт девелоперской компании. Нумерованные секции 001–004, анимированные счётчики метрик, каталог проектов с фильтром и цифрами по каждому (цена за м², площади, рассрочка, статус), технологии строительства, контакты с формой.

**Визуал:** монументальная типографика, монохром + один акцент, фото объектов (Unsplash), reveal-анимации на IntersectionObserver.

### 2. NORDE — интернет-магазин

Витрина минималистичного магазина одежды и товаров для дома. Каталог с фильтрами, quick-view с выбором размера, корзина-drawer с полным состоянием на чистом JS.

### 3. METRIC — CRM поддержка для ведения бизнеса

Полнофункциональная CRM-платформа уровня 2026: дашборд с SVG-графиком и воронкой, сделки с канбаном (drag-n-drop на pointer events) и drawer-карточкой, клиенты, задачи с календарём, аналитика, счета. Ось продукта — конструктор: сборка своих страниц из виджетов на dnd-сетке и кастомные сущности с полями, появляющиеся в сайдбаре с CRUD. METRIC AI — локальный чат-ассистент (сводки, прогноз, создание записей). Командная палитра ⌘K, шорткаты, светлая/тёмная темы, RU/EN. Своя айдентика: светлый Linear/Attio-like UI, акцент индиго #4F46E5, Onest + JetBrains Mono.

**Формат всех кейсов:** самодостаточный `templates/<slug>/index.html` — открывается без сборки. Плюс MDX-страница в `content/works/<slug>.mdx` (ru+en) и обложка `public/images/works/<slug>-cover.png` (скриншот headless Chrome 1600×900).
