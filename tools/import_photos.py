#!/usr/bin/env python3
"""
Імпорт фотографій авто з колажів 2×2.

Кожен файл-колаж (чотири кадри одного авто: перед, зад, профіль, салон)
ріжеться на чотири окремі фото й розкладається в assets/img/cars
під іменами <slug>.jpg, <slug>-2.jpg, <slug>-3.jpg, <slug>-4.jpg.
Роздільність не зменшується, зайвого стиснення немає.

Використання:
    python tools/import_photos.py --list                 показати, що лежить у теці
    python tools/import_photos.py                        імпортувати за файлом-картою
    python tools/import_photos.py --sheet                зібрати контактний аркуш

Карта «файл → авто» лежить у tools/photo_map.json:
    { "photo_2026-08-27_10-00-00.jpg": "bmw-m5", ... }
"""

import argparse
import io
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INBOX = os.path.join(os.path.dirname(ROOT), "фото", "авто")
CARS = os.path.join(ROOT, "assets", "img", "cars")
DATA = os.path.join(ROOT, "data", "cars.json")
MAP = os.path.join(ROOT, "tools", "photo_map.json")
QUALITY = 92

# колір авто на нових фотографіях (застосовується під час імпорту)
COLORS = {
    "toyota-camry": "black", "mercedes-s-class": "black", "kia-sportage": "white",
    "audi-q7": "black", "porsche-911": "black", "tesla-model-3": "grey",
    "honda-cr-v": "white", "lexus-rx": "white", "nissan-leaf": "white",
    "volvo-xc90": "black", "ford-mustang": "yellow", "range-rover-sport": "black",
    "mercedes-gle": "black", "audi-rs6": "grey", "tesla-model-y": "grey",
    "bmw-x5": "grey", "bmw-m5": "blue", "hyundai-tucson": "grey",
    "mazda-cx5": "red", "vw-golf-gti": "grey", "porsche-cayenne": "black",
    "skoda-octavia": "red", "subaru-outback": "silver", "vw-touareg": "black",
}

# дрібні уточнення опису, які видно на фото
TRIM_FIX = {
    "porsche-911": "992 Coupé",
}


def images_in(folder):
    if not os.path.isdir(folder):
        return []
    return sorted(f for f in os.listdir(folder)
                  if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))


def _seam(im, axis):
    """Межі світлої роздільної смуги біля центру (по ширині або висоті)."""
    W, H = im.size
    size = W if axis == "x" else H
    centre = size // 2
    span = max(4, int(size * 0.03))
    small = im.convert("L")
    lo, hi = centre, centre

    def is_light(i):
        if axis == "x":
            line = small.crop((i, 0, i + 1, H))
        else:
            line = small.crop((0, i, W, i + 1))
        px = list(line.getdata())
        return sum(px) / len(px) > 235

    if not is_light(centre):
        return centre, centre
    while lo - 1 > centre - span and is_light(lo - 1):
        lo -= 1
    while hi + 1 < centre + span and is_light(hi + 1):
        hi += 1
    return lo, hi


def split_quadrants(im):
    """Ріже колаж 2×2 на чотири кадри, прибираючи роздільну смугу."""
    W, H = im.size
    x0, x1 = _seam(im, "x")
    y0, y1 = _seam(im, "y")
    boxes = [
        (0, 0, x0, y0),
        (x1 + 1, 0, W, y0),
        (0, y1 + 1, x0, H),
        (x1 + 1, y1 + 1, W, H),
    ]
    return [im.crop(b) for b in boxes]


def to_32(im):
    """Приводить кадр до 3:2 без розтягування — обрізає зайве по довшій стороні."""
    W, H = im.size
    target = 3 / 2
    if abs(W / H - target) < 0.02:
        return im
    if W / H > target:                      # зашироке — ріжемо з боків
        w = int(H * target)
        x = (W - w) // 2
        return im.crop((x, 0, x + w, H))
    h = int(W / target)                     # зависоке — ріжемо зверху й знизу
    y = (H - h) // 2
    return im.crop((0, y, W, y + h))


def save(im, path):
    im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True,
            subsampling=0)                  # 4:4:4 — без втрат кольору


def do_list():
    files = images_in(INBOX)
    print("тека:", INBOX)
    if not files:
        print("порожньо — покладіть сюди колажі")
        return
    for f in files:
        with Image.open(os.path.join(INBOX, f)) as im:
            print(f"  {f}  {im.size[0]}×{im.size[1]}")
    print(f"всього: {len(files)}")


def do_sheet():
    """Контактний аркуш із підписами — щоб скласти карту «файл → авто»."""
    files = images_in(INBOX)
    if not files:
        print("у теці порожньо")
        return
    from PIL import ImageDraw
    cw, ch = 320, 250
    cols = 4
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cw * cols, ch * rows), "white")
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        with Image.open(os.path.join(INBOX, f)) as im:
            im = im.convert("RGB")
            im.thumbnail((cw - 6, ch - 22))
            x, y = (i % cols) * cw, (i // cols) * ch
            sheet.paste(im, (x + 3, y))
            d.text((x + 4, y + ch - 18), f"{i + 1}. {f}", fill="black")
    out = os.path.join(ROOT, "tools", "_inbox_sheet.png")
    sheet.save(out)
    print("аркуш:", out)


def do_import():
    if not os.path.exists(MAP):
        print("немає карти", MAP)
        print("створіть її у форматі {\"файл.jpg\": \"slug-авто\"}")
        sys.exit(1)

    mapping = json.load(io.open(MAP, encoding="utf-8"))
    cars = json.load(io.open(DATA, encoding="utf-8"))
    by_slug = {os.path.basename(c["image"]).replace(".jpg", ""): c for c in cars}

    done = 0
    for fname, slug in mapping.items():
        src = os.path.join(INBOX, fname)
        if not os.path.exists(src):
            print("нема файлу:", fname)
            continue
        if slug not in by_slug:
            print("нема такого авто в каталозі:", slug)
            continue

        with Image.open(src) as im:
            im = im.convert("RGB")
            parts = [to_32(p) for p in split_quadrants(im)]

        names = [f"{slug}.jpg", f"{slug}-2.jpg", f"{slug}-3.jpg", f"{slug}-4.jpg"]
        for part, name in zip(parts, names):
            save(part, os.path.join(CARS, name))

        car = by_slug[slug]
        car["gallery"] = ["assets/img/cars/" + n for n in names]
        car["image"] = car["gallery"][0]
        if slug in COLORS:
            car["color"] = COLORS[slug]
        if slug in TRIM_FIX:
            car["trim"] = TRIM_FIX[slug]
        done += 1
        print(f"{slug}: 4 фото {parts[0].size[0]}×{parts[0].size[1]}")

    json.dump(cars, io.open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    json.dump(cars, io.open(DATA.replace("cars.json", "cars.seed.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    with io.open(os.path.join(ROOT, "assets", "js", "seed.js"), "w", encoding="utf-8") as f:
        f.write("/* Згенеровано server.py — початковий каталог для роботи без сервера. */\n"
                "window.CARS_SEED = ")
        json.dump(cars, f, ensure_ascii=False, indent=1)
        f.write(";\n")

    print(f"\nоновлено авто: {done}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true", help="показати вміст теки")
    ap.add_argument("--sheet", action="store_true", help="контактний аркуш")
    args = ap.parse_args()

    if args.list:
        do_list()
    elif args.sheet:
        do_sheet()
    else:
        do_import()
