/* ==========================================================================
   Velora Motors — шар даних + пошукові утиліти
   Джерело даних: Supabase (таблиця cars) → data/cars.json →
   assets/js/seed.js (запасний варіант, якщо бази не видно з file://).
   ========================================================================== */
(function (global) {
  'use strict';

  const LS_FAV = 'velora.favorites';

  let cars = [];
  let mode = 'offline';     // 'supabase' | 'offline'

  /* ---------- переклад рядка бази у звичне для сайту авто ---------- */

  const FIELDS = [
    'brand', 'model', 'trim', 'year', 'body', 'fuel', 'gearbox', 'drive',
    'engine', 'power', 'mileage', 'condition', 'state', 'owners', 'vin',
    'city', 'price', 'color', 'image'
  ];

  function fromRow(row) {
    const car = { id: row.id };
    FIELDS.forEach((f) => { car[f] = row[f]; });
    car.engine = row.engine == null ? 0 : Number(row.engine);
    car.oldPrice = row.old_price || null;
    car.gallery = row.gallery || [];
    car.badges = row.badges || [];
    car.features = row.features || [];
    car.desc = row.descriptions || {};
    car.published = row.published !== false;
    car.createdAt = (row.created_at || '').slice(0, 10);
    return car;
  }

  function toRow(car) {
    const row = { id: car.id };
    FIELDS.forEach((f) => { row[f] = car[f] == null ? null : car[f]; });
    row.year = Number(car.year) || new Date().getFullYear();
    row.price = Number(car.price) || 0;
    row.mileage = Number(car.mileage) || 0;
    row.owners = Number(car.owners) || 0;
    row.power = Number(car.power) || 0;
    row.engine = Number(car.engine) || 0;
    row.old_price = car.oldPrice ? Number(car.oldPrice) : null;
    row.gallery = car.gallery || [];
    row.badges = car.badges || [];
    row.features = car.features || [];
    row.descriptions = car.desc || {};
    row.published = car.published !== false;
    return row;
  }

  /* ---------- завантаження ---------- */

  async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(res.status + ' ' + url);
    return res.json();
  }

  async function init() {
    // 1. база
    try {
      const rows = await DB.from('cars').select({ order: 'created_at.desc' });
      if (Array.isArray(rows) && rows.length) {
        cars = rows.map(fromRow);
        mode = 'supabase';
        return cars;
      }
      if (Array.isArray(rows)) {          // база на звʼязку, але каталог порожній
        cars = [];
        mode = 'supabase';
        return cars;
      }
    } catch (e) {
      console.warn('[velora] каталог з бази недоступний, показуємо локальні дані:', e.message);
    }

    // 2. запасний каталог із репозиторію
    cars = await loadSeed();
    mode = 'offline';
    return cars;
  }

  let seedRequest = null;

  /**
   * seed.js важить 28 КБ і потрібен лише тоді, коли недоступні і база,
   * і data/cars.json. Тому підвантажуємо його на вимогу, а не на кожній
   * сторінці — це прибирає зайвий запит і 28 КБ з кожного відкриття сайту.
   */
  function loadSeedScript() {
    if (Array.isArray(global.CARS_SEED)) return Promise.resolve();
    if (seedRequest) return seedRequest;

    seedRequest = new Promise((resolve) => {
      const el = document.createElement('script');
      const v = global.Media && Media.version ? '?v=' + Media.version : '';
      el.src = 'assets/js/seed.js' + v;
      el.onload = resolve;
      el.onerror = resolve;          // немає файлу — просто підемо далі
      document.head.appendChild(el);
    });
    return seedRequest;
  }

  async function loadSeed() {
    try {
      const data = await fetchJSON('data/cars.json');
      if (Array.isArray(data)) return data;
    } catch (e) { /* file:// або немає файлу */ }

    await loadSeedScript();
    return Array.isArray(global.CARS_SEED) ? global.CARS_SEED.slice() : [];
  }

  /** Перечитує каталог із бази (потрібно адмінці після змін). */
  async function reload() {
    const rows = await DB.from('cars').select({ order: 'created_at.desc' });
    cars = (rows || []).map(fromRow);
    mode = 'supabase';
    return cars;
  }

  /* ---------- CRUD (лише для адміністратора) ---------- */

  async function save(car) {
    delete car._hay;
    delete car._tokens;
    delete car._simple;

    const saved = await DB.from('cars').upsert(toRow(car), 'id');
    const next = fromRow(Array.isArray(saved) ? saved[0] : saved);

    const idx = cars.findIndex((c) => c.id === next.id);
    if (idx >= 0) cars[idx] = next; else cars.unshift(next);
    return next;
  }

  async function remove(id) {
    await DB.from('cars').remove({ id: 'eq.' + id });
    cars = cars.filter((c) => c.id !== id);
  }

  /** Імпорт JSON: усе, що є у файлі, заливається поверх наявного каталогу. */
  async function replaceAll(list) {
    const rows = list.map(toRow);
    for (let i = 0; i < rows.length; i += 20) {
      await DB.from('cars').upsert(rows.slice(i, i + 20), 'id');
    }
    return reload();
  }

  /** Повертає початковий каталог із репозиторію назад у базу. */
  async function resetFactory() {
    const seed = await loadSeed();
    if (!seed.length) throw new Error('немає початкових даних');
    await DB.from('cars').remove({ id: 'not.is.null' });
    return replaceAll(seed);
  }

  /* ---------- обране ---------- */

  function favorites() {
    try { return JSON.parse(localStorage.getItem(LS_FAV) || '[]'); }
    catch (e) { return []; }
  }

  function toggleFavorite(id) {
    const list = favorites();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    localStorage.setItem(LS_FAV, JSON.stringify(list));
    return i < 0;
  }

  /* ---------- форматування ---------- */

  const nf = () => new Intl.NumberFormat(I18N.lang === 'en' ? 'en-US' : (I18N.lang === 'pl' ? 'pl-PL' : 'uk-UA'));

  function fmtNum(n) { return nf().format(Math.round(n || 0)); }
  function fmtPrice(n) { return '$' + fmtNum(n); }

  /* ---------- нормалізація тексту для пошуку ---------- */

  const CYR = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z',
    и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
    р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
    ь: '', ю: 'yu', я: 'ya', ы: 'y', э: 'e', ъ: '', ё: 'e'
  };

  /** Кириличні та польські назви марок → латиниця. */
  const ALIASES = {
    'бмв': 'bmw', 'бэмвэ': 'bmw', 'мерс': 'mercedes', 'мерседес': 'mercedes',
    'ауді': 'audi', 'ауди': 'audi', 'порше': 'porsche', 'поршe': 'porsche',
    'тесла': 'tesla', 'тойота': 'toyota', 'фольксваген': 'volkswagen', 'фольцваген': 'volkswagen',
    'вольво': 'volvo', 'шкода': 'skoda', 'лексус': 'lexus', 'форд': 'ford',
    'мазда': 'mazda', 'хюндай': 'hyundai', 'хендай': 'hyundai', 'кіа': 'kia', 'киа': 'kia',
    'ніссан': 'nissan', 'нісан': 'nissan', 'хонда': 'honda', 'субару': 'subaru',
    'ленд': 'land', 'ровер': 'rover', 'рендж': 'range', 'рейндж': 'range',
    'седан': 'sedan', 'кросовер': 'crossover', 'позашляховик': 'suv', 'джип': 'suv',
    'універсал': 'wagon', 'купе': 'coupe', 'хетчбек': 'hatchback', 'кабріолет': 'convertible',
    'електро': 'electric', 'електрокар': 'electric', 'гібрид': 'hybrid', 'дизель': 'diesel',
    'бензин': 'petrol', 'автомат': 'auto', 'механіка': 'manual',
    'київ': 'kyiv', 'львів': 'lviv', 'одеса': 'odesa', 'дніпро': 'dnipro', 'харків': 'kharkiv',
    'новий': 'new', 'нові': 'new', 'вживаний': 'used', 'пробіг': 'used',
    'кайєн': 'cayenne', 'кайен': 'cayenne', 'туарег': 'touareg', 'рендж': 'range',
    'аутбек': 'outback', 'октавія': 'octavia', 'мустанг': 'mustang', 'камрі': 'camry',
    'тігуан': 'tiguan', 'туксон': 'tucson', 'спортейдж': 'sportage', 'гольф': 'golf',
    'кабріо': 'convertible', 'універсал': 'wagon'
  };

  function translit(str) {
    let out = '';
    for (const ch of str) out += (CYR[ch] !== undefined ? CYR[ch] : ch);
    return out;
  }

  /** Нижній регістр + зняття діакритики + транслітерація. */
  function norm(str) {
    const low = String(str || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return translit(ALIASES[low.trim()] || low)
      .replace(/[^a-z0-9\s.\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Розбирає запит на слова та числові умови («до 30000», «від 2019»). */
  function parseQuery(raw) {
    const result = { words: [], maxPrice: null, minPrice: null, minYear: null, raw: String(raw || '').trim() };
    const parts = String(raw || '').toLowerCase().split(/\s+/).filter(Boolean);
    const LESS = ['до', 'do', 'under', 'max', 'ниже', 'нижче', '<'];
    const MORE = ['від', 'от', 'from', 'od', 'min', 'over', '>'];

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const num = Number(p.replace(/[^\d]/g, ''));
      const isNum = /\d/.test(p) && !Number.isNaN(num) && num > 0;
      const prev = i > 0 ? parts[i - 1] : '';

      if (isNum) {
        if (LESS.includes(prev)) {
          if (num >= 1980 && num <= 2100) result.minYear = null; // «до 2020» — рік не фільтруємо жорстко
          else result.maxPrice = num;
          continue;
        }
        if (MORE.includes(prev)) {
          if (num >= 1980 && num <= 2100) result.minYear = num;
          else result.minPrice = num;
          continue;
        }
        if (num >= 1980 && num <= 2100) { result.words.push(String(num)); continue; }
        if (num > 2100) { result.maxPrice = result.maxPrice == null ? num : result.maxPrice; continue; }
      }

      if (LESS.includes(p) || MORE.includes(p)) continue;
      const n = norm(p);
      if (n) result.words.push(n);
    }
    return result;
  }

  /** Текст, по якому шукаємо конкретне авто (усі мови одразу). */
  function haystack(car) {
    const t = (key) => ['ua', 'en', 'pl'].map((lng) => I18N.tIn(lng, key)).join(' ');
    const parts = [
      car.brand, car.model, car.trim, car.year, car.vin, car.price,
      car.body, car.fuel, car.gearbox, car.drive, car.color, car.city, car.condition,
      t('body.' + car.body), t('fuel.' + car.fuel), t('gearbox.' + car.gearbox),
      t('drive.' + car.drive), t('color.' + car.color), t('city.' + car.city),
      t('cond.' + car.condition)
    ];
    return norm(parts.join(' '));
  }

  /** Оцінка релевантності авто до розібраного запиту. 0 = не підходить. */
  function score(car, parsed, allowFuzzy) {
    if (!parsed.words.length && parsed.maxPrice == null && parsed.minPrice == null && parsed.minYear == null) return 1;
    if (parsed.maxPrice != null && car.price > parsed.maxPrice) return 0;
    if (parsed.minPrice != null && car.price < parsed.minPrice) return 0;
    if (parsed.minYear != null && car.year < parsed.minYear) return 0;

    if (!parsed.words.length) return 1;

    const brand = norm(car.brand);
    const model = norm(car.model + ' ' + (car.trim || ''));
    const hay = car._hay || (car._hay = haystack(car));
    let total = 0;

    for (const w of parsed.words) {
      let best = 0;
      if (brand === w) best = 10;
      else if (brand.startsWith(w)) best = 8;
      else if (model.split(' ').some((part) => part === w)) best = 7;
      else if (model.includes(w)) best = 5;
      else if (hay.includes(' ' + w) || hay.startsWith(w)) best = 4;
      else if (hay.includes(w)) best = 3;
      else if (allowFuzzy !== false && w.length >= 4 && fuzzy(car, w)) best = 1.5;
      if (!best) return 0;               // усі слова обов'язкові
      total += best;
    }
    return total;
  }

  /** Відстань Левенштейна з обмеженням — для пошуку з друкарськими помилками. */
  function editDistance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    let prev = new Array(b.length + 1);
    let cur = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      cur[0] = i;
      let best = cur[0];
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < best) best = cur[j];
      }
      if (best > limit) return limit + 1;
      const tmp = prev; prev = cur; cur = tmp;
    }
    return prev[b.length];
  }

  /**
   * Спрощує слово до «звукового скелета»: c→k, y→i, німе h, подвоєння.
   * Завдяки цьому «кайєн» знаходить Cayenne, а «порше» — Porsche.
   */
  function simplify(word) {
    return word
      .replace(/ph/g, 'f')
      .replace(/ck/g, 'k')
      .replace(/c/g, 'k')
      .replace(/ou/g, 'u')
      .replace(/[hg]/g, '')
      .replace(/[yj]/g, 'i')
      .replace(/w/g, 'v')
      .replace(/(.)\1+/g, '$1');
  }

  /** Похибка допустима, лише якщо вона мала відносно довжини слова. */
  function close(a, b) {
    if (a.length < 4 || b.length < 4) return a === b;
    const limit = Math.min(2, Math.floor(Math.max(a.length, b.length) * 0.34));
    if (limit < 1) return a === b;
    return editDistance(a, b, limit) <= limit;
  }

  /** Чи схоже слово хоч на одне слово з опису авто (1–2 помилки). */
  function fuzzy(car, word) {
    if (/^[0-9]+$/.test(word)) return false;        // роки та ціни — тільки точно
    const tokens = car._tokens || (car._tokens = Array.from(new Set(
      (car._hay || (car._hay = haystack(car))).split(/[\s\-]+/).filter((x) => x.length > 2)
    )));
    if (tokens.some((tok) => close(word, tok))) return true;

    // друга спроба — по «звуковому скелету» (кайєн → Cayenne, туарег → Touareg)
    const simple = simplify(word);
    const simpleTokens = car._simple || (car._simple = tokens.map(simplify));
    return simpleTokens.some((tok) => close(simple, tok));
  }

  /**
   * Пошук по списку авто: спершу точні збіги, і лише якщо їх нема —
   * друга спроба з допуском на друкарські помилки.
   */
  function search(list, parsed) {
    const strict = list
      .map((car) => ({ car, s: score(car, parsed, false) }))
      .filter((x) => x.s > 0);
    if (strict.length || !parsed.words.length) return strict;

    return list
      .map((car) => ({ car, s: score(car, parsed, true) }))
      .filter((x) => x.s > 0);
  }

  global.Store = {
    init,
    get mode() { return mode; },
    all() { return cars; },
    get(id) { return cars.find((c) => c.id === id); },
    save, remove, replaceAll, resetFactory, loadSeed, reload,
    favorites, toggleFavorite,
    fmtNum, fmtPrice, norm, parseQuery, score, search
  };
})(window);
