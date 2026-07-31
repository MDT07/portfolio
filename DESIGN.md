---
version: alpha
name: Portfolio Real
description: Strict engineering realism. Monochrome base, one signal accent, modular grid, zero decoration.
---

# DESIGN.md — Portfolio

## 1. Visual Theme & Atmosphere

Строгий инженерный реализм. Интерфейс как чертёж: точный, функциональный, без декора. Плотность — средняя, щедрый whitespace между секциями, но компактный внутри компонентов. Настроение: уверенность через сдержанность. Ничего лишнего — каждый пиксель обоснован.

Философия: **precision over decoration**. Дизайн не замечают — замечают результат.

## 2. Color Palette & Roles

### Base (monochrome)

| Token | Hex | Role |
|-------|-----|------|
| `surface-0` | `#0A0A0A` | Page background (dark-first) |
| `surface-1` | `#111111` | Card, elevated surface |
| `surface-2` | `#1A1A1A` | Hover state, input background |
| `surface-3` | `#242424` | Border, divider |
| `text-primary` | `#EDEDED` | Headings, body |
| `text-secondary` | `#A1A1A1` | Captions, metadata, secondary text |
| `text-tertiary` | `#666666` | Placeholders, disabled |

### Accent (signal)

| Token | Hex | Role |
|-------|-----|------|
| `accent` | `#0070F3` | Primary CTA, links, active states, focus rings |
| `accent-hover` | `#0060DF` | Hover on accent elements |
| `accent-subtle` | `#0C2D4D` | Accent backgrounds (badges, highlights) |

### Semantic

| Token | Hex | Role |
|-------|-----|------|
| `success` | `#17C964` | Success states |
| `error` | `#F31260` | Errors, destructive actions |
| `warning` | `#F5A524` | Warnings |

### Light mode (secondary)

| Token | Hex | Role |
|-------|-----|------|
| `surface-0` | `#FFFFFF` | Page background |
| `surface-1` | `#FAFAFA` | Card |
| `surface-2` | `#F5F5F5` | Hover |
| `surface-3` | `#E5E5E5` | Border |
| `text-primary` | `#171717` | Headings, body |
| `text-secondary` | `#737373` | Captions |
| `text-tertiary` | `#A3A3A3` | Placeholders |

Dark mode — основной (дефолт). Light — переопределение семантического слоя под `[data-theme="light"]` в `globals.css`; компоненты не меняются. Выбор пользователя — в localStorage (`theme`), иначе `prefers-color-scheme`.

## 3. Typography Rules

### Font families

| Role | Family | Fallback | Weight |
|------|--------|----------|--------|
| Sans (UI, body) | Inter | system-ui, sans-serif | 400, 500, 600, 700 |
| Mono (code, labels, metadata) | JetBrains Mono | monospace | 400, 500 |

### Hierarchy

| Level | Size | Weight | Line-height | Letter-spacing | Family |
|-------|------|--------|-------------|----------------|--------|
| Display | 72px / 4.5rem | 700 | 1.0 | -0.03em | Sans |
| H1 | 48px / 3rem | 700 | 1.1 | -0.02em | Sans |
| H2 | 36px / 2.25rem | 600 | 1.2 | -0.02em | Sans |
| H3 | 24px / 1.5rem | 600 | 1.3 | -0.01em | Sans |
| H4 | 18px / 1.125rem | 600 | 1.4 | 0 | Sans |
| Body | 16px / 1rem | 400 | 1.6 | 0 | Sans |
| Small | 14px / 0.875rem | 400 | 1.5 | 0 | Sans |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.02em | Mono |
| Label | 11px / 0.6875rem | 500 | 1.3 | 0.06em | Mono |

Uppercase только для `Label` и `Caption` в mono. Body и заголовки — sentence case.

## 4. Component Stylings

### Button

| Variant | Background | Text | Border | Radius |
|---------|-----------|------|--------|--------|
| Primary | `accent` | `#FFFFFF` | none | 6px |
| Secondary | `surface-2` | `text-primary` | `surface-3` | 6px |
| Ghost | transparent | `text-secondary` | none | 6px |

- Height: 40px (default), 32px (small), 48px (large)
- Padding: 0 16px (default)
- Font: 14px, weight 500
- Transition: `background 150ms ease`
- Focus: `2px solid accent` outline, offset 2px

### Card

- Background: `surface-1`
- Border: `1px solid surface-3`
- Radius: 8px
- Padding: 24px
- Hover: `border-color: text-tertiary`, `transform: translateY(-2px)`
- Transition: `border-color 200ms, transform 200ms`

### Input

- Background: `surface-2`
- Border: `1px solid surface-3`
- Radius: 6px
- Height: 40px
- Padding: 0 12px
- Font: 14px
- Focus: `border-color: accent`
- Placeholder: `text-tertiary`

### Navigation (Header)

- Height: 64px
- Background: `surface-0` at 80% opacity + `backdrop-blur(12px)`
- Border-bottom: `1px solid surface-3`
- Links: 14px, weight 400, `text-secondary`; hover → `text-primary`
- Active link: `text-primary` + `2px accent` underline

### Tag / Badge

- Background: `surface-2`
- Border: `1px solid surface-3`
- Radius: 4px
- Padding: 2px 8px
- Font: 12px mono, weight 500
- Accent variant: `background: accent-subtle`, `border-color: accent`, `color: accent`

### ThemeToggle / LangSwitcher

- 32×32px (иконка) или mono-кнопка `RU / EN`, radius 6px, border `surface-3`
- Idle: `text-secondary`; hover → `text-primary`, `border-color: text-tertiary`
- Тема хранится в `data-theme` на `<html>` + localStorage; anti-FOUC inline-скрипт в `<head>`

### Reveal (scroll-анимация)

- `opacity 0 → 1`, `translateY(24px) → 0`, 400ms, ease `cubic-bezier(0.22, 1, 0.36, 1)`
- `whileInView`, once, viewport margin `-80px`
- Вариант `tiltIn` для карточек: + `rotateX(4deg) → 0`

### Counter

- Число: mono, tabular-nums; досчёт до значения 1.2s ease-out при появлении в кадре
- Единица измерения (`M`, `%`) — `text-accent`, размер ~60% от числа

### BeforeAfter

- Контейнер `aspect-16/9`, radius 8px, border `surface-3`
- Разделитель: 1px `text-primary/70` + ручка 36px круг `surface-0/90` + border
- Drag — pointer events, keyboard: стрелки ±4%; `cursor: ew-resize`

### ProcessSteps

- Вертикальный рельс 1px `surface-3`, прогресс — 1px `accent`, scaleY по скроллу (useScroll)
- Точки шагов: 8px круг, border `accent`, fill `surface-0`
- Номер шага: mono 11px uppercase `text-tertiary`

### DemoViewer

- Fullscreen overlay `z-100`, background `surface-0`; появление — fade 200ms + scale 0.99→1
- Тулбар 56px: mono-путь к демо, переключатель desktop/mobile, ссылка «в новой вкладке», закрытие (Esc)
- Mobile-режим: iframe 390px, radius 8px, border

### Gallery

- Scroll-snap ряд кадров `aspect-16/9`, скрытый скроллбар
- Счётчик `01 / 05` mono 12px `text-tertiary`; стрелки 32×32px border-кнопки

## 5. Layout Principles

### Spacing scale (4px base)

| Token | Value | Use |
|-------|-------|-----|
| `space-1` | 4px | Inline gaps |
| `space-2` | 8px | Compact padding |
| `space-3` | 12px | Input padding |
| `space-4` | 16px | Default gap |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section inner gap |
| `space-12` | 48px | Between component groups |
| `space-16` | 64px | Between sections |
| `space-24` | 96px | Major section breaks |
| `space-32` | 128px | Page-level rhythm |

### Grid

- Max content width: **1200px**
- Columns: 12, gap: 24px
- Side padding: 24px (mobile), 48px (desktop)
- Секции выравниваются по модульной сетке; асимметрия — исключение, не правило

### Whitespace philosophy

Пустое пространство — функциональный элемент. Оно разделяет смысловые блоки и создаёт ритм. Между секциями — минимум 96px. Внутри компонентов — компактно. Никогда не заполнять пустоту декором.

## 6. Depth & Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| 0 | none | Default |
| 1 | `0 1px 2px rgba(0,0,0,0.4)` | Cards at rest |
| 2 | `0 4px 12px rgba(0,0,0,0.5)` | Dropdowns, popovers |
| 3 | `0 8px 24px rgba(0,0,0,0.6)` | Modals |

Без цветных теней. Без glow-эффектов. Глубина — только через тень и border.

## 7. Do's and Don'ts

### Do
- Один акцентный цвет на экране
- Mono-шрифт для меток, дат, тегов, кода
- Тонкие borders (1px) вместо теней для разделения
- Анимации UI 150–300ms, `ease` или `ease-out`; кинематографика demo-шаблонов — по §10
- Skeleton-загрузка вместо спиннеров

### Don't
- Градиенты (кроме subtle overlay на фото)
- Скругления больше 8px
- Тени с цветным оттенком
- Больше 3 уровней типографической иерархии на одном экране
- Декоративные иконки без функции
- Uppercase для body-текста
- Анимации дольше 400ms вне кинематографического слоя (§10)

## 8. Responsive Behavior

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, stacked, 24px side padding |
| Tablet | 640–1024px | 2-column where appropriate, 32px side padding |
| Desktop | > 1024px | 12-column grid, 1200px max-width, 48px side padding |

- Touch targets: минимум 44×44px на mobile
- Display/H1: уменьшаются на ~40% на mobile
- Навигация: hamburger на mobile, horizontal на desktop
- Карточки: full-width на mobile, grid на desktop

## 9. Agent Prompt Guide

### Quick color reference

```
Background: #0A0A0A (dark) / #FFFFFF (light)
Card:       #111111 / #FAFAFA
Border:     #242424 / #E5E5E5
Text:       #EDEDED / #171717
Secondary:  #A1A1A1 / #737373
Accent:     #0070F3
```

### Ready-to-use prompt

> Build a page using strict engineering realism. Dark background #0A0A0A, cards on #111111 with 1px #242424 borders, text #EDEDED. Single accent #0070F3 for CTAs and links only. Inter for UI, JetBrains Mono for labels and metadata. 6px border-radius on interactive elements, 8px on cards. No gradients, no decorative shadows, no rounded corners beyond 8px. Generous whitespace between sections (96px+), compact within components. Every element must justify its existence.

## 10. Cinematic Layer (только demo-шаблоны)

Применяется исключительно к self-contained демо в `templates/<slug>/`. Основной сайт (`app/`, `components/`) остаётся на правилах §4 и §7. Цель слоя — award-уровень подачи без нарушения базовых принципов: монохром, один акцент, ноль декора.

### Motion

- UI-микроинтеракции (hover, focus, tabs): по-прежнему 150–300ms.
- Кинематографика: 800–1100ms, ease `cubic-bezier(0.65, 0, 0.35, 1)`. Анимируются только `transform`, `opacity`, `clip-path`.
- Техники: clip-path reveal медиа (`inset(100% 0 0 0) → inset(0)` + inner `scale 1.12 → 1`), line/word-mask reveal заголовков (overflow-hidden строки, stagger 60–90ms), curtain-wipe между главами, scroll-scrubbed параллакс через rAF (только transform), velocity-marquee.
- Скролл не джекится: нормальный document flow, без scroll-hijacking и fake-scroll.
- `prefers-reduced-motion: reduce` отключает весь слой без исключений: контент виден сразу, rAF-циклы не запускаются.

### Chapter inversion (светлая глава)

- Одна, максимум две светлые главы на страницу. Токены: фон `paper` `#EDEDED`, текст `ink` `#0A0A0A`, вторичный текст `rgba(10,10,10,0.62)`, borders `rgba(10,10,10,0.14)`.
- Акцент `#0070F3` — только крупные метки и индексы; текстовые акценты на paper — `accent-hover` `#0060DF` (контраст).
- Инверсия — ритмический бит между тёмными главами, не тема оформления.

### Редакционные детали

- Архивная нумерация сущностей: «Проект n0.047» — mono 11px, `text-tertiary`.
- Figure captions у медиа: «Fig. 02 — TERRA NORD, Москва» — mono 11px.
- Маркеры глав: «001 / Название» — mono uppercase + hairline 1px.
- Постерный футер: wordmark во всю ширину, частично уходит за нижний край (clipped).
- Зернистость: SVG-noise overlay, opacity ≤ 0.05, fixed, `pointer-events: none` — кинематографическая текстура, не декор.
- Live-data штрихи: часы/координаты в mono, обновление не чаще 1 раза в секунду.
- Display-типографика шаблонов: fluid `clamp()` до 10–14vw, uppercase допустим только в hero-headline и постерном футере.

## 11. Editorial Layer (главная dev.developer)

Применяется к главной странице портфолио (`app/[lang]/page.tsx`, секции `Poster*`/`AboutChapter`/`WorksIndex`) и постерному футеру на всех страницах. Остальные страницы (`/works`, `/works/[slug]`) остаются на правилах §4 и §7. Цель — editorial-постер уровня Awwwards внутри строгого реализма: палитра §2 и токены глубины §6 не меняются.

### Типографика

- Display-serif: **Prata** (Google Fonts, regular 400, кириллица). CSS-var `--font-prata`, утилита `font-display`; fallback Georgia, serif.
- Prata — только для: hero-headline, заголовков глав, постерного футера. Body, UI, карточки — Inter; метаданные, индексы, маркеры — JetBrains Mono. Больше одной serif-роли на экране не бывает.
- Размеры — fluid `clamp()`: hero до `clamp(3rem, 9vw, 8rem)`, заголовки глав до `clamp(2.25rem, 5vw, 4.5rem)`. Line-height 0.95–1.05, tracking 0 — Prata не требует сжатия.
- Uppercase: только hero-headline и постерный футер (как §10). Заголовки глав — sentence case.

### Motion

- Полностью по §10 Motion: 800–1100ms, `cubic-bezier(0.65, 0, 0.35, 1)`, только `transform`/`opacity`/`clip-path`.
- Допущены на главной: preloader 0→100 (один раз за сессию, sessionStorage), line-mask reveal заголовков, clip-reveal медиа, hover-превью в индексе работ, velocity-marquee, лёгкий scroll-параллакс.
- Скролл не джекится. `prefers-reduced-motion: reduce` отключает preloader и весь слой: контент виден сразу.

### Редакционные детали

- По §10: маркеры глав «001 / Название», архивная нумерация работ, figure captions, постерный футер с clipped wordmark, noise overlay ≤ 0.05.
- Главы нумеруются последовательно: 001 Подход → 002 Кейсы.
- Светлая инверсия (§10) допустима, но не обязательна; v1 главной — полностью тёмная.
