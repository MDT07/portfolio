# NORDE — Object Biographies

Скандинавская витрина как музейный архив: у каждого объекта есть биография — материал, происхождение, жизненный цикл.

## Что внутри

- **Hero** — specimen card флагмана
- **Манифест** — 3 принципа архива
- **Карта происхождения** — MapLibre с маршрутами материалов
- **Паспорт материалов** — 4 карточки
- **Инвентарная ведомость** — 8 объектов, аккордеон, размеры, корзина
- **Журнал** — заметки к материалам
- **Архивный клуб** — подписка

## Стек

- HTML5, CSS3
- Vanilla JS
- GSAP + ScrollTrigger + Lenis
- MapLibre GL JS
- Howler (opt-in звук)
- Google Fonts: Cormorant Garamond, Source Sans 3, IBM Plex Mono

## QA

```bash
python3 scripts/qa-template.py norde [--mobile] [--shot]
```

## Запуск

Открыть `index.html` в браузере или поднять статик-сервер.
