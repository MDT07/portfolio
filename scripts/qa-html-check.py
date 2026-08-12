#!/usr/bin/env python3
"""HTML-level QA без браузера. Проверяет структуру, селекторы и отсутствие очевидных ошибок."""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ASSERTS = {
    "form": [
        ("title", r"<title>.*</title>"),
        ("viewport", r'name="viewport"'),
        ("logo FORM", r"FORM"),
        ("section plane", r'id="sectionPlane"'),
        ("dimension lines", r'class="dim"'),
        ("material strip", r'class="mat-cell"'),
        ("project bands", r'class="band"'),
        ("services", r'class="service"'),
        ("contact form", r'id="contactForm"'),
        ("prefers-reduced-motion", r"prefers-reduced-motion"),
        ("gsap cdn", r"gsap@3\.12"),
        ("lenis cdn", r"lenis@1\.1"),
    ],
    "volt": [
        ("title", r"<title>.*</title>"),
        ("viewport", r'name="viewport"'),
        ("logo VOLT", r"VOLT"),
        ("particle canvas", r'id="particleCanvas"'),
        ("liquid level", r'id="liquidLevel"'),
        ("stats", r'class="stat"'),
        ("station cards", r'class="station-card"'),
        ("calculator", r'id="calculator"'),
        ("tariffs", r'class="tariff"'),
        ("faq items", r'class="faq-item"'),
        ("fleet form", r'id="fleetForm"'),
        ("prefers-reduced-motion", r"prefers-reduced-motion"),
    ],
    "norde": [
        ("title", r"<title>.*</title>"),
        ("viewport", r'name="viewport"'),
        ("logo NORDE", r"NORDE"),
        ("specimen card", r'class="specimen-card"'),
        ("provenance map", r'id="map"'),
        ("passport cards", r'class="passport-card"'),
        ("ledger rows", r'class="ledger-row"'),
        ("journal cards", r'class="journal-card"'),
        ("cart drawer", r'id="drawer"'),
        ("cart button", r'id="cartBtn"'),
        ("club form", r'id="clubForm"'),
        ("prefers-reduced-motion", r"prefers-reduced-motion"),
        ("maplibre cdn", r"maplibre-gl"),
    ],
}

def check(name):
    path = os.path.join(ROOT, "templates", name, "index.html")
    if not os.path.exists(path):
        print(f"FAIL: {path} not found")
        return False
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    checks = ASSERTS.get(name, [])
    passed = 0
    for label, pattern in checks:
        ok = re.search(pattern, html) is not None
        print(("  PASS " if ok else "  FAIL ") + label)
        if ok:
            passed += 1
    # basic balance
    open_html = html.count("<html")
    close_html = html.count("</html")
    open_body = html.count("<body")
    close_body = html.count("</body")
    balanced = open_html == close_html and open_body == close_body
    print(("  PASS " if balanced else "  FAIL ") + "html/body tags balanced")
    if balanced:
        passed += 1
    total = len(checks) + 1
    print(f"\nRESULT: {passed}/{total}")
    return passed == total

if __name__ == "__main__":
    ok = True
    for name in ["form", "volt", "norde"]:
        print(f"== {name.upper()} ==")
        ok = check(name) and ok
        print()
    sys.exit(0 if ok else 1)
