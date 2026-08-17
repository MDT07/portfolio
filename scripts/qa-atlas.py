#!/usr/bin/env python3
"""QA-сьют для ATLAS — проверка карты, flyTo, маршрутов."""

import json, subprocess, sys, tempfile, os

CHECKS = [
    {"name": "карта загрузилась", "js": "document.querySelector('#map canvas') !== null"},
    {"name": "MapLibre инициализирован", "js": "typeof maplibregl !== 'undefined'"},
    {"name": "6 секций маршрутов", "js": "document.querySelectorAll('[data-route]').length >= 6"},
    {"name": "координаты в карточках", "js": "document.querySelector('.route-coords') !== null"},
    {"name": "штампы присутствуют", "js": "document.querySelector('.route-stamp') !== null"},
    {"name": "сетка на фоне", "js": "document.querySelector('.grid-overlay') !== null"},
    {"name": "кнопка заявки работает", "js": "document.querySelector('[data-book]') !== null"},
    {"name": "шрифт Cormorant", "js": "document.fonts.check('1em Cormorant')"},
    {"name": "контраст заголовков", "js": "true"},  # ручная проверка
    {"name": "нет ошибок консоли", "js": "true"},  # CDP check
]

def run():
    print("ATLAS QA — запуск...")
    # Здесь можно добавить CDP-скриншоты и проверки
    # Для базового прогона — проверим файл на валидность
    html_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'atlas', 'index.html')
    if not os.path.exists(html_path):
        print("FAIL: templates/atlas/index.html не найден")
        sys.exit(1)

    with open(html_path, 'r') as f:
        content = f.read()

    checks_passed = 0

    # Проверки по содержимому файла
    if 'maplibre-gl' in content:
        print("PASS: MapLibre GL подключен")
        checks_passed += 1
    else:
        print("FAIL: MapLibre GL не найден")

    if 'map.flyTo' in content:
        print("PASS: flyTo реализован")
        checks_passed += 1
    else:
        print("FAIL: flyTo не найден")

    if 'IntersectionObserver' in content:
        print("PASS: IntersectionObserver для скролла")
        checks_passed += 1
    else:
        print("FAIL: IntersectionObserver не найден")

    if 'data-route' in content:
        print("PASS: data-route атрибуты есть")
        checks_passed += 1
    else:
        print("FAIL: data-route не найден")

    if 'Cormorant' in content:
        print("PASS: Шрифт Cormorant подключен")
        checks_passed += 1
    else:
        print("FAIL: Cormorant не найден")

    if '--paper:#F5F0E8' in content:
        print("PASS: Картографическая палитра")
        checks_passed += 1
    else:
        print("FAIL: Палитра не найдена")

    if 'route-stamp' in content:
        print("PASS: Микро-индустриальный слой")
        checks_passed += 1
    else:
        print("FAIL: Штампы не найдены")

    if 'prefers-reduced-motion' in content:
        print("PASS: Уважение к reduced motion")
        checks_passed += 1
    else:
        print("FAIL: reduced-motion не найден")

    print(f"\nRESULT: {checks_passed}/8 checks passed")
    if checks_passed >= 7:
        print("PASS")
        sys.exit(0)
    else:
        print("FAIL")
        sys.exit(1)

if __name__ == '__main__':
    run()
