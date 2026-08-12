# FORM — Sectional Monument

Архитектурное бюро как последовательность сечений. Hero разделяет фасад и внутреннюю программу с помощью scroll-driven `clip-path`.

## Что внутри

- **Hero** — фасад / срез, разведённые скроллом; размерные SVG-аннотации
- **Проекты** — 3 секционные полосы с асимметричной сеткой
- **Материалы** — интерактивная полоса из 5 образцов
- **Услуги** — 4 карточки
- **Контакт** — форма с валидацией
- **Футер** — контурный логотип

## Стек

- HTML5, CSS3 (custom properties, grid, clip-path)
- Vanilla JS
- GSAP + ScrollTrigger + Lenis
- Google Fonts: Outfit, Inter, JetBrains Mono

## QA

```bash
python3 scripts/qa-template.py form [--mobile] [--shot]
```

## Запуск

Открыть `index.html` в браузере или поднять статик-сервер.
