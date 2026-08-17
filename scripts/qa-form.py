#!/usr/bin/env python3
"""QA-сьют для FORM — проверка SVG, курсора, сетки."""

import os, sys

def run():
    print("FORM QA — запуск...")
    html_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'form', 'index.html')
    if not os.path.exists(html_path):
        print("FAIL: templates/form/index.html не найден")
        sys.exit(1)

    with open(html_path, 'r') as f:
        content = f.read()

    checks_passed = 0

    checks = [
        ('SVG чертежи', 'draw-svg' in content),
        ('stroke-dasharray анимация', 'stroke-dasharray' in content),
        ('Курсор-рейсфедер', 'cursorCross' in content),
        ('Координаты курсора', 'cursorCoords' in content),
        ('Чертёжные рамки', 'draft-frame' in content),
        ('Штрихкоды', 'barcode' in content),
        ('Печати', 'stamp' in content),
        ('Масштабная линейка', 'scale-bar' in content),
        ('Усиленная сетка', 'gridlines' in content),
        ('Reduced motion', 'prefers-reduced-motion' in content),
    ]

    for name, result in checks:
        if result:
            print(f"PASS: {name}")
            checks_passed += 1
        else:
            print(f"FAIL: {name}")

    print(f"\nRESULT: {checks_passed}/{len(checks)} checks passed")
    if checks_passed >= 8:
        print("PASS")
        sys.exit(0)
    else:
        print("FAIL")
        sys.exit(1)

if __name__ == '__main__':
    run()
