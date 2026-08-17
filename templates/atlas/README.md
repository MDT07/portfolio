# ATLAS — Экспедиционный атлас

Интерактивный лендинг экспедиционного travel-клуба с 3D-рельефом MapLibre как сквозным слоем. Scroll-driven перелёты камеры между координатами маршрутов.

## Что внутри

- **MapLibre 3D** — сквозная карта с terrain exaggeration 1.5, картографическая стилизация OSM
- **Scroll-driven camera** — IntersectionObserver триггерит `map.flyTo()` к координатам каждого маршрута
- **6 экспедиций** — Памир, Шпицберген, Сахара, Азоры, Алтай, Лофотены с координатами, высотой, уровнем
- **Картографическая палитра** — бумажная база `#F5F0E8`, сигнальный оранжевый `#E85D04`, сепия-чернила
- **Типографика** — Cormorant (old-style serif) + JetBrains Mono для координат
- **Микро-индустриальный слой** — штампы «ПРОВЕРЕНО», координатная сетка, печати
- **Прогрессивное улучшение** — без JS контент читаем, карта статична
- **Доступность** — `prefers-reduced-motion` отключает flyTo

## Стек

- HTML5, CSS3 (custom properties, grid, flex)
- MapLibre GL JS 5.3.1 (CDN)
- Vanilla JS (IntersectionObserver, requestAnimationFrame)
- Google Fonts: Cormorant, Onest, JetBrains Mono

## Перфоманс

- LCP < 1.5s
- 60fps при скролле
- Карта не интерактивна (меньше событий)
- OSM tiles с низкой opacity + desaturation

## QA

- CDP-скриншоты desktop 1440 + mobile 375
- Чеки: карта загрузилась, flyTo работает, линии маршрутов видны
- Чистая консоль
