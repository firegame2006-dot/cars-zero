#!/usr/bin/env python3
"""
Оновлює версію у посиланнях на CSS та JS у всіх сторінках.

Браузер кешує style.css і скрипти за іменем файлу, тому після правок
телефон може показувати стару версію. Додаємо ?v=<число> — і кеш
оновлюється одразу після деплою.

    python tools/bump_assets.py           наступна версія
    python tools/bump_assets.py 12        конкретна версія
"""

import glob
import io
import os
import re
import sys
import time

# консоль Windows часто не в UTF-8 — інакше print з кирилицею падає
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATTERN = re.compile(
    r'((?:href|src)="assets/(?:css|js|img|video)/[a-z0-9\-/]+'
    r'\.(?:css|js|jpg|jpeg|png|webp|avif|svg|mp4|webm))(\?v=\d+)?"'
)


def current_version():
    for path in glob.glob(os.path.join(ROOT, "*.html")):
        text = io.open(path, encoding="utf-8").read()
        found = re.search(r'assets/[a-z]+/[a-z0-9\-/]+\.[a-z0-9]+\?v=(\d+)', text)
        if found:
            return int(found.group(1))
    return 0


def main():
    version = int(sys.argv[1]) if len(sys.argv) > 1 else current_version() + 1
    changed = 0
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        text = io.open(path, encoding="utf-8").read()
        new = PATTERN.sub(lambda m: f'{m.group(1)}?v={version}"', text)
        if new != text:
            io.open(path, "w", encoding="utf-8").write(new)
            changed += 1
    print(f"версія ассетів: {version} | оновлено сторінок: {changed}")
    print("час:", time.strftime("%Y-%m-%d %H:%M"))


if __name__ == "__main__":
    main()
