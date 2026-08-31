#!/usr/bin/env python3
"""
Velora Motors — локальний сервер сайту автосалону.

Запуск:      python server.py          (порт 8000)
             python server.py 8080     (інший порт)

Роздає статичні файли та невеличкий API для адмінпанелі:
    GET  /api/cars        → список авто з data/cars.json
    PUT  /api/cars        → зберегти повний список (адмінка)
    POST /api/cars/reset  → повернути заводський каталог з data/cars.seed.json

Після кожного запису каталог дублюється у assets/js/seed.js,
щоб сайт працював навіть коли його відкрити просто як файл (file://).
"""

import json
import os
import shutil
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Windows-консоль часто має не-UTF8 кодування — не даємо їй впасти на кирилиці
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:  # noqa: BLE001
    pass

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data", "cars.json")
SEED = os.path.join(ROOT, "data", "cars.seed.json")
BACKUP = os.path.join(ROOT, "data", "cars.backup.json")
SEED_JS = os.path.join(ROOT, "assets", "js", "seed.js")
MAX_BODY = 64 * 1024 * 1024  # 64 МБ — фото у формі зберігаються як data:URL


def read_cars():
    with open(DATA, "r", encoding="utf-8") as f:
        return json.load(f)


def write_cars(cars):
    if os.path.exists(DATA):
        shutil.copyfile(DATA, BACKUP)
    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(cars, f, ensure_ascii=False, indent=2)
    write_seed_js(cars)


def write_seed_js(cars):
    """Копія каталогу як JS-файл — запасний варіант для відкриття через file://."""
    os.makedirs(os.path.dirname(SEED_JS), exist_ok=True)
    with open(SEED_JS, "w", encoding="utf-8") as f:
        f.write("/* Згенеровано server.py — початковий каталог для роботи без сервера. */\n")
        f.write("window.CARS_SEED = ")
        json.dump(cars, f, ensure_ascii=False, indent=1)
        f.write(";\n")


def ensure_seed():
    """Первинний знімок каталогу, щоб кнопка «скинути» мала куди повертатись."""
    if not os.path.exists(SEED) and os.path.exists(DATA):
        shutil.copyfile(DATA, SEED)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---------- допоміжне ----------

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > MAX_BODY:
            return None
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def end_headers(self):
        # під час розробки кеш тільки заважає
        if self.path.endswith((".html", ".css", ".js", ".json")):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    # ---------- маршрути ----------

    def do_GET(self):
        if self.path.rstrip("/") in ("/api/cars", "/api/cars?"):
            try:
                self.send_json(read_cars())
            except Exception as exc:  # noqa: BLE001
                self.send_json({"error": str(exc)}, 500)
            return
        super().do_GET()

    def do_PUT(self):
        if self.path.rstrip("/") != "/api/cars":
            self.send_json({"error": "not found"}, 404)
            return
        try:
            cars = self.read_body()
            if not isinstance(cars, list):
                raise ValueError("очікується масив автомобілів")
            write_cars(cars)
            self.send_json({"ok": True, "count": len(cars)})
            print(f"  збережено {len(cars)} авто → data/cars.json")
        except Exception as exc:  # noqa: BLE001
            self.send_json({"error": str(exc)}, 400)

    def do_POST(self):
        if self.path.rstrip("/") != "/api/cars/reset":
            self.send_json({"error": "not found"}, 404)
            return
        try:
            ensure_seed()
            cars = json.load(open(SEED, "r", encoding="utf-8"))
            write_cars(cars)
            self.send_json(cars)
            print("  каталог повернуто до заводського стану")
        except Exception as exc:  # noqa: BLE001
            self.send_json({"error": str(exc)}, 500)

    def log_message(self, fmt, *args):
        if "/api/" in (args[0] if args else ""):
            super().log_message(fmt, *args)


def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    ensure_seed()
    try:
        write_seed_js(read_cars())
    except Exception as exc:  # noqa: BLE001
        print("Не вдалося оновити seed.js:", exc)

    url = f"http://localhost:{port}/"
    print("\n  Velora Motors")
    print("  " + "-" * 38)
    print(f"  Сайт:      {url}")
    print(f"  Адмінка:   {url}admin.html   (вхід через Supabase)")
    print("  Ctrl+C — зупинити\n")

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    if "--no-browser" not in sys.argv:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Зупинено.")
        server.server_close()


if __name__ == "__main__":
    main()
