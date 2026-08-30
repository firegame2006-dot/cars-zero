/* ==========================================================================
   Velora Motors — версіонування локальних файлів.

   Фото авто лежать за сталими іменами (assets/img/cars/bmw-m5.jpg), тому
   після заміни картинки браузер міг ще годинами показувати стару з кешу —
   на різних компʼютерах виходили різні фото. Додаємо ?v= до кожного
   локального посилання: змінилася версія — браузер бере файл заново.

   Версію беремо з тега <script>, який підключає цей файл, а її проставляє
   tools/bump_assets.py разом з рештою ассетів.
   ========================================================================== */
(function (global) {
  'use strict';

  const own = document.currentScript;
  const found = own && /[?&]v=(\d+)/.exec(own.src || '');
  const VERSION = found ? found[1] : '';

  const ABSOLUTE = /^(?:https?:|data:|blob:|\/\/)/i;

  /**
   * Повертає посилання з версією. Абсолютні адреси (сховище Supabase,
   * CDN, data:) не чіпаємо — у них і так унікальні імена.
   */
  function url(path) {
    const src = path == null ? '' : String(path);
    if (!src || !VERSION) return src;
    if (ABSOLUTE.test(src)) return src;
    if (src.indexOf('?') >= 0) return src;      // версія вже є
    return src + '?v=' + VERSION;
  }

  global.Media = { url: url, version: VERSION };
})(window);
