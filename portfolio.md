# Portfolio — архитектура проекта

## Продуктовая концепция

`SIGNAL / SHIP` — двуязычное технологическое портфолио Эмира Семенова. Главная страница ведёт посетителя по естественному document flow: сигнал → профессиональная позиция → системы и стек → работы → AI → метод → контакт.

Визуальный язык строится на инженерной сетке, тёплой editorial-бумаге `#F0EEE6`, глубоком petrol `#061113` и одном спокойном синем сигнале `#72B9D8`. Интерактивность объясняет профессиональный подход: 2D delivery map переключает режимы «Интерфейс / Архитектура / Интеллект», небольшой WebGL-узел остаётся микроакцентом, каталог работает как touch-friendly project reel, а AI-сцена показывает проверяемый pipeline.

Скролл не перехватывается, секции не pin-ятся и имеют физическую высоту в document flow. На главной Lenis отключён. `prefers-reduced-motion` отключает кинетическую ленту, входные трансформации и непрерывный WebGL render loop.

## Стек

| Слой | Реализация |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styles | Tailwind CSS 4 + CSS design tokens |
| Motion | Framer Motion, CSS Motion; Lenis только на внутренних страницах |
| Graphics | Нативный WebGL/GLSL с CSS fallback |
| Content | Типизированный JSON data-layer `lib/work-data.json` |
| i18n | RU на корне, EN под `/en`, routing через `proxy.ts` |
| Images | `next/image`, локальные portfolio assets |
| SEO | Metadata, canonical/hreflang, Open Graph, Person/WebSite/CreativeWork JSON-LD, sitemap, robots |
| Delivery | Vercel Analytics, опциональный Sentry, Vercel deployment |

## Основные модули

```text
app/[lang]/
├── page.tsx                    # metadata + schema + SIGNAL / SHIP
├── ai-works/page.tsx           # AI workshop
└── works/
    ├── page.tsx                # полный архив
    └── [slug]/page.tsx         # типизированный case-study route

components/
├── sections/DigitalExperience.tsx
├── interactive/
│   ├── WebGLSignal.tsx         # GPU-сцена и CSS fallback
│   ├── SceneNavigator.tsx      # chapter index
│   ├── ProjectReel.tsx         # scroll-snap gallery
│   ├── ExpertiseExplorer.tsx   # accessible tabs
│   ├── AIProcessDiagram.tsx
│   ├── BuildEngineArchive.tsx
│   ├── DemoViewer.tsx
│   └── ProjectBrief.tsx
├── layout/
└── ui/

lib/
├── work-data.json              # RU/EN кейсы
├── works.ts                    # типизированный data API
├── dictionaries/              # интерфейсный контент RU/EN
├── config.ts                   # публичные ссылки и canonical origin
└── i18n.ts
```

## Маршруты

| Route | Назначение |
|---|---|
| `/`, `/en` | Основной narrative portfolio / tech CV |
| `/works`, `/en/works` | Архив работ |
| `/works/[slug]`, `/en/works/[slug]` | Кейс и рабочее demo |
| `/ai-works`, `/en/ai-works` | AI-направление и CRMP |
| `/works/ai`, `/en/works/ai` | Permanent redirect на AI Works |
| `/templates/*` | Самодостаточные статические прототипы |

## Контент и достоверность

В каталоге находятся шесть авторских концептов и рабочих прототипов: ATLAS, AURA, PRIMARY TERRA, FORM, METRIC и NORDE. Они явно обозначены как концепты; PULSE, VOLT и старый AI WORKS исключены. CRMP указан только как реально опубликованный конкурсный проект. Клиенты, отзывы, метрики, опыт и результаты не придумываются.

Каждый кейс хранит общие технические поля и синхронные RU/EN-секции в `lib/work-data.json`. Live demo остаётся самодостаточным HTML в `templates/<slug>/index.html` и синхронной public-копии.

## Проверка

```bash
npm run validate
npm run lint
npm run typecheck
npm run build
npm run qa:premium
```

`qa:premium` поднимает production server на свободном порту и проверяет локали, metadata, все routes, redirects, sitemap, robots, assets, удалённые кейсы и отсутствие server warnings.
