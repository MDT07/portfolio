# Дизайн: Изометрическая галерея проектов FORM

## Дата
2026-08-12

## Цель
Полностью перестроить секцию «Галерея — Проекты в 3D» с изометрической сеткой макетов зданий и параллакс-эффектом.

## Архитектура

### HTML-структура
```
<section class="sec" id="gallery-3d">
  <div class="wrap">
    <div class="label"><b>01-E</b> · Галерея</div>
    <h2 class="sec-title">Проекты в <span class="acc">3D</span></h2>
    <div class="iso-scene" id="isoScene">
      <div class="iso-grid" id="isoGrid">
        <div class="iso-card" data-index="0">
          <div class="iso-model"><svg><!-- Макет --></svg></div>
          <div class="iso-pedestal">
            <div class="iso-top"></div>
            <div class="iso-front"></div>
            <div class="iso-side"></div>
          </div>
          <div class="iso-info">
            <div class="iso-num">01</div>
            <div class="iso-name">Музей «Платформа»</div>
            <div class="iso-meta">Москва · 12 400 м²</div>
          </div>
        </div>
        <!-- ×6 карточек -->
      </div>
    </div>
    <div class="iso-nav">
      <button id="isoPrev">←</button>
      <div class="iso-dots" id="isoDots"></div>
      <button id="isoNext">→</button>
    </div>
  </div>
</section>
```

### CSS-изометрия

**Сцена:**
- `perspective: 1200px`
- `height: 500px`
- Центрирование flex

**Сетка:**
- `display: flex`, `gap: 40px`
- `transform-style: preserve-3d`
- Базовый поворот: `rotateX(60deg) rotateZ(-45deg)`
- Переход: `transition: transform 0.1s ease-out`

**Карточка:**
- `width: 180px`, `position: relative`
- `transition: transform 0.3s var(--ease-cine)`
- Hover: `translateZ(20px)`

**Макет (SVG):**
- Позиционирование: `absolute`, `bottom: 60px`
- Де-изометрирование: `rotateZ(45deg) rotateX(-60deg)`
- Размер: `140×110px`
- Stroke: `var(--ink)`, `stroke-width: 1.5`
- Hover: stroke → `var(--accent)`

**Пьедестал (3 грани):**
- `.iso-top`: `180×180px`, `rotateX(90deg) translateZ(30px)`, фон `var(--panel)`
- `.iso-front`: `180×60px`, `translateZ(90px)`, фон `var(--bg)`
- `.iso-side`: `180×60px`, `rotateY(90deg) translateZ(90px)`, фон `var(--panel)`
- Границы: `1px solid var(--line)`

**Инфо-блок:**
- Позиционирование: `absolute`, `bottom: -80px`
- Де-изометрирование для читаемости
- `.iso-num`: моно, акцентный, 11px
- `.iso-name`: Unbounded, 13px, uppercase
- `.iso-meta`: моно, 9px, muted

### JS-параллакс

```javascript
isoScene.addEventListener('mousemove', (e) => {
  const rect = isoScene.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  isoGrid.style.transform = `rotateX(${60 + y * 10}deg) rotateZ(${-45 + x * 10}deg)`;
});

isoScene.addEventListener('mouseleave', () => {
  isoGrid.style.transform = 'rotateX(60deg) rotateZ(-45deg)';
});
```

### Навигация

**Кнопки ← →:**
- Сдвигают `isoGrid` по `translateX` на ширину карточки + gap
- Плавный переход: `transition: transform 0.6s var(--ease-cine)`

**Точки (dots):**
- Генерируются динамически под количество проектов
- Активная точка: фон `var(--accent)`

**Клик на карточку:**
- Центрирование карточки в сцене
- Добавление класса `.active` (акцентный stroke макета)

### SVG-макеты (6 проектов)

Упрощённые изометрические макеты с тремя видимыми гранями:

1. **Музей «Платформа»** — прямоугольный корпус с плоской крышей, окна на фасаде, навес
2. **«Северный парк»** — три секции разной высоты, ступенчатая композиция
3. **Вокзал «Южный»** — волнообразная крыша, сквозной просвет
4. **«Терминал»** — высокая башня, атриум в центре
5. **«Старая гавань»** — низкая широкая композиция, сетка кварталов
6. **«Стрелка»** — дом на сваях, консольные вылеты

Каждый макет: viewBox="0 0 140 110", три грани (верх + два фасада), stroke-only.

### Адаптив

**Desktop (>1024px):**
- Все 6 карточек видны
- Параллакс активен

**Tablet (768–1024px):**
- 4 карточки видны, 2 скрыты
- Навигация точками

**Mobile (<768px):**
- 1 карточка в центре
- Свайп + кнопки
- Упрощённый пьедестал (только front-грань)

## Файлы для изменения
- `templates/form/index.html` — заменить секцию 3D-слайдера

## Проверка
- Открыть в браузере, проверить изометрию
- Навести мышь — сцена должна реагировать
- Кликать карточки — активная подсвечивается
- Нажимать ← → — сетка сдвигается
