# Portfolio — Архитектура проекта

## Концепция

Портфолио разработчика как демонстрация инженерной культуры. Не визитка, а артефакт: код, структура и визуальный язык сами по себе доказывают уровень.

**Стиль:** строгий реализм. Инженерная точность, модульная сетка, монохромная база с одним сигнальным акцентом. Никакой декоративности — каждый элемент обоснован функцией. Ближе к Vercel и Linear по духу: precision, clarity, restraint.

**Референсы по духу:**
- [Vercel](https://vercel.com) — чёрно-белая точность, Geist, нулевой шум
- [Linear](https://linear.app) — ультраминимализм, один акцент, идеальный ритм
- [GeoLibre](https://github.com/opengeos/GeoLibre) — технический уровень: React + TypeScript, чистая архитектура

**Дизайн-система:** формат [DESIGN.md](https://github.com/VoltAgent/awesome-design-md) (Google Stitch spec) — единый источник правды для токенов.

---

## Стек

| Слой | Технология | Версия | Назначение |
|------|-----------|--------|-----------|
| Фреймворк | Next.js (App Router) | 15 | SSR/SSG, routing, image optimization |
| Язык | TypeScript | 5 | Типобезопасность |
| Стили | Tailwind CSS | 4 | Токены из DESIGN.md → utility classes |
| Анимации | Framer Motion | 12 | Scroll-driven, page transitions |
| Smooth scroll | Lenis | 1 | Тактильный скролл |
| Контент | MDX | — | Кейсы и шаблоны |
| Шрифт | Inter + JetBrains Mono | — | Sans для UI, mono для кода/меток |
| Деплой | Vercel | — | Нативно для Next.js |

---

## Структура

```
portfolio/
├── portfolio.md                  # Этот файл — архитектурный контракт
├── HERMES.md                     # Инструментальный стек для Hermes agent
├── DESIGN.md                     # Дизайн-токены (Google Stitch spec)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx                # Root layout: fonts, Lenis, header/footer
│   ├── page.tsx                  # Главная: Hero + manifesto + избранные работы
│   ├── about/
│   │   └── page.tsx              # О разработчике: био, подход, принципы
│   ├── skills/
│   │   └── page.tsx              # Скиллы: группировка по доменам, уровень
│   ├── works/
│   │   ├── page.tsx              # Каталог шаблонов (grid)
│   │   └── [slug]/
│   │       └── page.tsx          # Детальная страница шаблона (MDX)
│   └── contact/
│       └── page.tsx              # Контакты + форма
│
├── components/
│   ├── ui/                       # Примитивы
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Header.tsx            # Fixed, minimal, blur-on-scroll
│   │   ├── Footer.tsx            # Sitemap + socials
│   │   └── Container.tsx         # Max-width wrapper
│   └── sections/
│       ├── Hero.tsx              # Full-viewport, крупная типографика
│       ├── Manifesto.tsx         # Текстовый блок с принципами
│       ├── SkillsGrid.tsx        # Скиллы по доменам
│       ├── WorksGrid.tsx         # Сетка карточек шаблонов
│       └── ContactForm.tsx
│
├── content/
│   └── works/                    # MDX-файлы шаблонов
│       └── development.mdx       # Первый кейс: девелопмент/строительство
│
├── templates/
│   └── development/              # Live-исходники демо-шаблона
│       ├── index.html            # Самодостаточный демо-файл
│       └── README.md             # Описание, как запустить
│
├── lib/
│   ├── mdx.ts                    # MDX-парсер, frontmatter
│   ├── animations.ts             # Framer Motion пресеты
│   └── utils.ts                  # cn(), форматтеры
│
└── public/
    ├── fonts/                    # Локальные woff2 (если не Google Fonts)
    └── images/
        └── works/                # Скриншоты шаблонов
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
- Каждый шаблон = один MDX в `content/works/` + live-исходники в `templates/<slug>/`
- Frontmatter MDX: `title`, `description`, `tags`, `year`, `role`, `stack`, `cover`

### Коммиты
- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

---

## Маршруты

| Путь | Страница | Тип |
|------|----------|-----|
| `/` | Главная | SSG |
| `/about` | О разработчике | SSG |
| `/skills` | Скиллы | SSG |
| `/works` | Каталог шаблонов | SSG |
| `/works/[slug]` | Детальная шаблона | SSG (generateStaticParams) |
| `/contact` | Контакты | SSG |

Все страницы статические. Никакого бэкенда на старте — форма контактов через `mailto:` или внешний сервис (Formspree).

---

## Первый шаблон: «Девелопмент / Строительство»

Демонстрационный кейс — сайт строительной компании.

**Секции:**
1. Hero — полноэкранный, крупный заголовок, фоновое фото объекта
2. О компании — ключевые цифры (лет, м², проектов), строгая сетка
3. Проекты — карточки с фильтром (жилое / коммерческое / инфраструктура)
4. Технологии — BIM, энергоэффективность, модульное строительство
5. Контакты — адрес, телефон, форма

**Визуал:** монументальная типографика, приглушённая палитра (графит, бетон, тёплый металл), строгая модульная сетка, акцент на фотографии объектов. Фото — Unsplash/Pexels.

**Формат:** самодостаточный `templates/development/index.html` — открывается в браузере без сборки. Плюс MDX-страница в `content/works/development.mdx` с описанием и скриншотами.
