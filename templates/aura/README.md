# AURA — необанк и платёжный кошелёк

Демо-шаблон необанка: баланс-карта, студия дизайна карт, конвертер валют, security-объяснение и форма раннего доступа.

## Концепция

«Деньги, которые движутся в реальном времени». Тёмная торговая эстетика, монохромная база с электрическим фиолетовым акцентом (#7C5CFF), инженерная типографика Sora + Inter + JetBrains Mono.

## Секции

1. **Hero** — кинетическая баланс-карта, кольцевые spending-ринги на Canvas, count-up метрики.
2. **Возможности** — 4 продукта в карточках.
3. **Студия карт** — интерактивный выбор цвета и материала карты.
4. **Конвертер** — обмен валют с моковым курсом и копированием.
5. **Безопасность** — 3 security-слоя.
6. **Ранний доступ** — waitlist-форма.

## Стек

- HTML5 + CSS3 (custom properties)
- GSAP 3 + ScrollTrigger
- Lenis (smooth scroll)
- Canvas 2D для spending-рингов

## Запуск

```bash
python3 -m http.server 8646 --directory templates
open http://localhost:8646/aura/index.html
```

## QA

```bash
python3 scripts/qa-template.py aura
python3 scripts/qa-template.py aura --mobile
python3 scripts/shot-covers.py aura
```

## Особенности

- `prefers-reduced-motion: reduce` отключает плавный скролл, анимации и Canvas-ринги.
- Все формы работают без бэкенда.
- Самодостаточный `index.html`, не требует сборки.
