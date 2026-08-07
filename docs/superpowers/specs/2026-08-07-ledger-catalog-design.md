# Глава 04 «Инвентарная ведомость» — дизайн пересборки (07.08.2026)

**Объект:** `templates/ecommerce/index.html` (NORDE), глава 04 «Архив единиц».
**Статус:** утверждён пользователем в брейншторме (3 ответа + утверждение дизайна).

## Решения брейншторма

1. **Функциональность:** старый интерактив (фильтры, сортировки, quick-view) удаляется вместе со стилем; секция получает новый интерактивный язык, **покупка сохраняется** в новой форме.
2. **Контент:** те же 8 единиц (`PRODUCTS` без изменений — на них завязаны лукбук, студия NR-0202, журнал); «новый контент» = новая подача, тексты и язык секции пишутся заново.
3. **Стиль:** **«Инвентарная ведомость»** — полноширинный типографический реестр вместо сетки карточек. Отклонены: «витрина-полки» (повторяет жест лукбука 02), «карточный каталог» (структурно снова сетка карточек).

## Концепт и структура

Глава 04 — архивная ведомость: реестр из 8 строк-записей, чистая типографика поверх бумаги.

```
section.chapter data-chapter="04" data-accent="#9A3412" (пигмент без изменений)
  head: chapter-index «04 / Архив единиц» + H2 «Инвентарная ведомость» (data-mask)
  .ledger
    per product: <button class="ledger-row" aria-expanded="false" aria-controls="sheet-N">
      .l-no (UNIT N°…, mono, пигмент) · .l-name (Playfair, clamp) · .l-cat (mono, muted) · .l-price (mono) · .l-hint («Лист →»)
    <div class="ledger-sheet" id="sheet-N"> — раскрываемый инвентарный лист:
      .sheet-media (фото 4:5, дуотон → цвет при открытии)
      .sheet-body: рубрика/unit · имя · цена (scramble) · описание · состав (meta) · .sizes · «+ в корзину»
  .ledger-preview — fixed img за курсором (pointer:fine, не RM)
```

Разделители строк — тонкие border-top, как у `.opis-list`. Никакой сетки карточек.

## Интерактив

- **Плавающее фото** (pointer:fine, не RM): один fixed img, src меняется по hover на строке; GSAP quickTo x/y, fade in/out; дуотон → проявление в цвет. Подписной жест главы.
- **Аккордеон:** клик/Enter по строке раскрывает инвентарный лист (grid-template-rows 0fr→1fr); одновременно открыт один лист; `aria-expanded` синхронизируется.
- **Scramble цены** при открытии листа (существующий `scrambleText`).
- **Reveal строк:** ScrollTrigger.batch, y+opacity stagger, once.
- **data-cursor** «Открыть лист» на строках.
- Клавиатура: строки — `<button>`, Tab из строки уходит в лист (DOM-порядок). Без Esc для листа (не слой; сворачивается повторным кликом) — YAGNI.

## Покупка

Цепочка не прерывается: выбор размера в листе → `addToCart(id, size)` → toast → `openDrawer()` → checkout → акт приёма. Корзина, drawer, checkout, акт — **не трогаем**.

## Удаляемое (физически из кода)

- Разметка: filters row, sort row, catalog-grid, catalog-note; `#modal` (quick-view) целиком.
- CSS: `.filters`, `.filter-btn`, `.sort-*`, `.catalog-grid`, `.product*` (media/unit/stock/quick/info/material/row/price/dots/add), `.modal*`, `.sizes` в модалке (у листа — свои стили).
- JS: `renderCatalog`, `updateCatalog` (FLIP-перестановка), `setFilter`, sort-хендлеры, `state.filter/state.sort/shownCount`, `openQuickView/closeQuickView` и все qv-хендлеры.
- Footer: 4 ссылки `data-goto-filter` → одна «Архив единиц» (`scrollToEl` к главе 04).
- Esc-цепочка и Tab-trap: `modal` выпадает из обеих (стейдж/журнал/drawer остаются).
- Опись: пункт 04 `data-preview` → `.ledger-sheet img` (фото первой единицы).

## Остаётся нетронутым

`PRODUCTS`/`CATS`/`SIZES`, корзина (`addToCart`, drawer, checkout, акт), лукбук/студия/журнал (ссылки на товары не меняются), пигмент главы `#9A3412`, hero-тексты. `img2` в данных не используется новой секцией (остаётся в данных безвредно — YAGNI).

## A11y / RM / мобайл / перф

- **a11y:** строки — `<button>` с `aria-expanded`/`aria-controls`; Tab-порядок естественный; data-cursor; фокус-стили как у opis-item.
- **RM:** строки видимы сразу, без плавающего фото и scramble; лист открывается мгновенно (transition глушится глобальным RM-правилом).
- **Мобайл 390px:** строка в две линии (no+name / cat+price), preview off (pointer:coarse), лист в одну колонку.
- **Перф:** один img превью (src по требованию); новых тяжёлых слоёв нет; бюджет 60 fps сохраняется.

## QA и документация

- `scripts/qa-norde-checks.json`: удалить чеки фильтров/сортировок/quick-view/зум-фикса/статичности product-media (~18); добавить: 8 строк ведомости, toggle aria-expanded, содержимое листа (имя/цена), выбор размера, add-to-cart из листа → drawer открыт + счётчик, preview off в RM (~8). Скриншот ch04 обновляется автоматически прогоном.
- `templates/ecommerce/README.md` (+ копия в `public/`): переписать буллет главы 04, фичи (quick-view → инвентарный лист), доступность (Esc-цепочка без модалки), число проверок.
- Синк `templates/` → `public/templates/`, коммит(ы).

## Критерии приёмки

1. В главе 04 нет фильтров/сортировок/сетки/quick-view — только ведомость из 8 строк + раскрываемые листы.
2. Покупка работает из листа: корзина → акт приёма (подтверждено QA-чеками).
3. Плавающее фото за курсором на desktop, отсутствует в RM и на таче.
4. `python3 scripts/qa-norde.py` — PASS во всех трёх режимах; FPS-зонд 60 fps, 0 longtasks; LCP ≤ 1 с.
5. Консоль чистая; grep не находит висячих ссылок на `modal`/quick-view/`product-media`/setFilter.
