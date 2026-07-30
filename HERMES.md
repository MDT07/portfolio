# HERMES.md — Инструментальный стек и скиллы

Контекст для Hermes agent: какие инструменты использовать, как и в какой последовательности при работе над этим проектом.

---

## Проект

Web-портфолио разработчика. Строгий реализм, монохром + один акцент, модульная сетка. Next.js 15 + TypeScript + Tailwind CSS 4. Дизайн-токены — в `DESIGN.md`. Архитектура — в `portfolio.md`.

---

## Скиллы Hermes (установлены)

### Дизайн

| Скилл | Команда | Когда использовать |
|-------|---------|-------------------|
| **`design-md`** | `hermes skills inspect skills-sh/nousresearch/hermes-agent/design-md` | Авторинг и валидация `DESIGN.md`. WCAG-контраст, экспорт токенов в Tailwind. Использовать при любом изменении дизайн-системы |
| **`popular-web-designs`** | `hermes skills inspect skills-sh/nousresearch/hermes-agent/popular-web-designs` | 54 дизайн-системы (Stripe, Linear, Vercel) как HTML/CSS-референсы. Загружать при выборе визуального направления нового шаблона |
| **`claude-design`** | builtin | Процесс и вкус: скоупинг брифа, варианты, верификация HTML-артефакта. Парный с `popular-web-designs`: `claude-design` ведёт workflow, `popular-web-designs` даёт словарь |
| **`architecture-diagram`** | builtin | Диаграммы архитектуры для документации и README |
| **`excalidraw`** | builtin | Wireframe-скетчи перед вёрсткой новых секций |

### Разработка

| Скилл | Команда | Когда использовать |
|-------|---------|-------------------|
| **`codebase-inspection`** | builtin | Анализ чужого кода перед интеграцией |
| **`github-auth`** | builtin | GitHub-аутентификация для пушей и PR |
| **`github-code-review`** | builtin | Ревью PR перед мержем |

### Креатив

| Скилл | Команда | Когда использовать |
|-------|---------|-------------------|
| **`p5js`** | builtin | Generative-элементы для hero-секций (если понадобятся) |
| **`concept-diagrams`** | official | Схемы и диаграммы для кейсов |

---

## ClawHub (через Hermes)

ClawHub индексируется через `hermes skills search`. Установка: `hermes skills install <identifier>`.

### Рекомендуемые к установке

```bash
# Гайдлайны Vercel по веб-дизайну
hermes skills install skills-sh/vercel-labs/agent-skills/web-design-guidelines

# Инженерный подход к дизайну
hermes skills install skills-sh/conardli/web-design-skill/web-design-engineer
```

### Поиск дополнительных скиллов

```bash
hermes skills search <query>     # Поиск по ClawHub и skills.sh
hermes skills browse             # Интерактивный браузер
hermes skills list               # Установленные
```

---

## Kimi Code инструменты

| Инструмент | Роль |
|-----------|------|
| **Kimi Code CLI** | Основная среда разработки. Все файловые операции, запуск команд, управление проектом |
| **MCP `context7`** | Актуальная документация Next.js, Tailwind, Framer Motion, React. Запрос через `mcp__context7__query-docs` |
| **MCP `github`** | Пуш, PR, issues, управление репозиторием. Через `mcp__github__*` |
| **MCP `sentry`** | Мониторинг ошибок (если подключён к проекту) |

### Context7 — типовые запросы

```
# Документация Next.js App Router
mcp__context7__resolve-library-id → libraryName: "Next.js"
mcp__context7__query-docs → query: "App Router layout and page conventions"

# Tailwind CSS 4
mcp__context7__resolve-library-id → libraryName: "Tailwind CSS"
mcp__context7__query-docs → query: "CSS-first configuration with @theme"

# Framer Motion
mcp__context7__resolve-library-id → libraryName: "Framer Motion"
mcp__context7__query-docs → query: "scroll-driven animations with useScroll"
```

---

## Workflow для Hermes agent

### Создание нового шаблона (кейса)

1. **Бриф** → `claude-design` — скоупинг, варианты, выбор направления
2. **Визуальный словарь** → `popular-web-designs` — загрузить ближайшую дизайн-систему как референс
3. **Wireframe** → `excalidraw` — быстрый скетч секций
4. **Токены** → `design-md` — проверить/расширить `DESIGN.md` при необходимости
5. **Вёрстка** → Kimi Code — HTML/CSS/JS в `templates/<slug>/`
6. **MDX-страница** → Kimi Code — `content/works/<slug>.mdx`
7. **Верификация** → `claude-design` — проверка артефакта на «AI-дизайн слизень»

### Изменение дизайн-системы

1. **Редактировать** `DESIGN.md`
2. **Валидировать** → `design-md` скилл (WCAG, структура)
3. **Экспортировать** → `design-md` → Tailwind config
4. **Обновить** компоненты под новые токены

### Добавление страницы

1. **Проверить** `portfolio.md` — соответствие структуре
2. **Создать** `app/<route>/page.tsx`
3. **Документация** → `context7` при использовании новых API
4. **Стили** — строго по токенам из `DESIGN.md`

---

## Промпты для Hermes agent

### Создание компонента

```
Create a React Server Component for the portfolio project.
Follow DESIGN.md tokens strictly: dark background #0A0A0A, cards #111111,
borders #242424, text #EDEDED, accent #0070F3. Inter for UI text,
JetBrains Mono for labels. 6px radius on interactive elements,
8px on cards. No gradients, no decorative shadows.
TypeScript, Tailwind CSS 4, no "use client" unless animations needed.
```

### Создание шаблона

```
Build a self-contained HTML template for a [industry] company website.
Style: strict engineering realism per DESIGN.md. Monochrome base
(#0A0A0A, #111111, #242424), single accent #0070F3. Inter + JetBrains Mono.
Modular grid, generous whitespace between sections, compact within.
Sections: hero, about (key numbers), projects (filterable grid),
technologies, contact. Photos from Unsplash. No AI-generated images.
```

### Ревью кода

```
Review this component against DESIGN.md. Check: token compliance
(colors, spacing, typography), accessibility (WCAG contrast, focus states),
responsive behavior (mobile < 640px, tablet 640-1024px, desktop > 1024px),
and adherence to the "no decoration" principle. Flag any gradient,
any shadow beyond the elevation system, any radius > 8px.
```

---

## Правила

1. **DESIGN.md — единственный источник правды** для визуальных решений. Не отклоняться без обновления DESIGN.md
2. **portfolio.md — единственный источник правды** для архитектуры. Новые директории/маршруты — только после обновления portfolio.md
3. **Один акцентный цвет** на экране. Всегда
4. **Server Components по умолчанию.** `"use client"` — только при необходимости
5. **Фото — только реальные** (Unsplash, Pexels). Никаких AI-генераций для кейсов
6. **Каждый элемент обоснован.** Если не можешь объяснить зачем — не добавляй
