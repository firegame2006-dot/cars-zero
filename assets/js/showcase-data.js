/* ==========================================================================
   Velora Motors — три ролики шоуруму (головна + сторінка «Новинки»).

   Дані живуть у таблиці showcase у Supabase, щоб їх можна було міняти
   з адмінки. Якщо база недоступна — беремо текст із словника перекладів,
   а відео та постери з репозиторію.
   ========================================================================== */
(function (global) {
  'use strict';

  let items = [];
  let loaded = false;

  /** Текст поточною мовою. Приймає і {ua,en,pl}, і звичайний рядок. */
  function text(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    const lang = (global.I18N && I18N.lang) || 'en';
    return value[lang] || value.en || value.ua || value.pl || '';
  }

  /** Збирає {ua,en,pl} з ключа словника — потрібно для запасного варіанта. */
  function fromKey(key) {
    if (!global.I18N) return { en: key };
    return { ua: I18N.tIn('ua', key), en: I18N.tIn('en', key), pl: I18N.tIn('pl', key) };
  }

  function fallback() {
    return [1, 2, 3].map((n) => ({
      id: 'local-' + n,
      position: n,
      video: Media.url('assets/video/showcase-' + n + '.mp4'),
      poster: Media.url('assets/img/showcase/poster-' + n + '.jpg'),
      photo: Media.url('assets/img/showcase/photo-' + n + '.jpg'),
      power: ['610', '620', '520'][n - 1],
      time: ['3.1 s', '3.4 s', '3.2 s'][n - 1],
      badge: fromKey('showcase.badge' + n),
      title: fromKey('showcase.i' + n + 'title'),
      sub: fromKey('showcase.i' + n + 'sub'),
      status: fromKey(n === 1 ? 'showcase.st2' : 'showcase.st1'),
      text: fromKey('showcase.i' + n + 'text'),
      details: fromKey('clip.i' + n + 'long')
    }));
  }

  function fromRow(row) {
    return {
      id: row.id,
      position: row.position,
      video: Media.url(row.video_url || ''),
      poster: Media.url(row.poster_url || ''),
      photo: Media.url(row.photo_url || row.poster_url || ''),
      power: row.power || '',
      time: row.time_to_100 || '',
      badge: row.badge || {},
      title: row.title || {},
      sub: row.subtitle || {},
      status: row.status || {},
      text: row.summary || {},
      details: row.details || {},
      published: row.published !== false
    };
  }

  async function load() {
    try {
      const rows = await DB.from('showcase').select({ order: 'position.asc' });
      if (Array.isArray(rows) && rows.length) {
        items = rows.map(fromRow);
        loaded = true;
        return items;
      }
    } catch (e) {
      console.warn('[velora] ролики з бази недоступні, показуємо локальні:', e.message);
    }
    items = fallback();
    loaded = true;
    return items;
  }

  global.Showcase = {
    text: text,
    load: load,
    fromRow: fromRow,
    get items() { return items; },
    get loaded() { return loaded; },
    get(index) { return items[index]; }
  };
})(window);
