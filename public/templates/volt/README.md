# VOLT — Liquid Charge

Сеть быстрой зарядки EV как тёмный сосуд, наполняемый жидкой энергией. Canvas particle field, индикатор уровня скролла, калькулятор экономии.

## Что внутри

- **Hero** — коннектор в негативном пространстве, частицы энергии
- **Статистика** — 4 счётчика сети
- **Станции** — 6 карт с hover-spotlight
- **Калькулятор** — слайдеры → экономия в месяц
- **Тарифы** — Pay Go / Subscriber / Fleet
- **Приложение** — CSS-мокап телефона
- **FAQ** — аккордеон
- **Fleet** — форма для автопарков

## Стек

- HTML5, CSS3
- Vanilla JS
- GSAP + ScrollTrigger + Lenis
- Canvas 2D particle field
- Google Fonts: Chakra Petch, Inter, JetBrains Mono

## QA

```bash
python3 scripts/qa-template.py volt [--mobile] [--shot]
```

## Запуск

Открыть `index.html` в браузере или поднять статик-сервер.
