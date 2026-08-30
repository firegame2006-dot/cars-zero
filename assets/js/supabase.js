/* ==========================================================================
   Velora Motors — тонкий клієнт Supabase без зовнішніх бібліотек.

   Дає три речі:
     DB.auth   — вхід адміністратора, сесія, вихід
     DB.from   — читання й запис таблиць (cars, showcase, leads, admins)
     DB.files  — завантаження фото та відео у сховище

   Сайт має працювати навіть якщо база недоступна (немає мережі, відкрито
   через file://), тому кожен виклик кидає помилку, а Store і Showcase
   мають запасний варіант із локальних файлів.
   ========================================================================== */
(function (global) {
  'use strict';

  const CONFIG = {
    url: 'https://irsujudzcocivkqtczon.supabase.co',
    key: 'sb_publishable_Xt4UvQz1qyy42sG_jXfiTw_gYY6ADC4',
    bucket: 'media'
  };

  const SESSION_KEY = 'velora.session';
  const TIMEOUT = 15000;

  let session = null;
  let refreshing = null;

  /* ---------- сесія ---------- */

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeSession(next) {
    session = next;
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
    document.dispatchEvent(new CustomEvent('db:auth', { detail: { user: next && next.user } }));
  }

  function storeToken(data) {
    if (!data || !data.access_token) throw new Error('no token');
    writeSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      user: data.user || (session && session.user) || null
    });
    return session;
  }

  session = readSession();

  /* ---------- базовий запит ---------- */

  function authHeader() {
    return 'Bearer ' + (session ? session.access_token : CONFIG.key);
  }

  async function raw(path, options) {
    const opts = options || {};
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeout || TIMEOUT);

    try {
      return await fetch(CONFIG.url + path, {
        method: opts.method || 'GET',
        headers: Object.assign({ apikey: CONFIG.key, Authorization: authHeader() }, opts.headers),
        body: opts.body,
        signal: ctrl.signal
      });
    } finally {
      clearTimeout(timer);
    }
  }

  /** Тихо оновлює токен; кілька паралельних запитів чекають на одне оновлення. */
  function refreshSession() {
    if (refreshing) return refreshing;
    if (!session || !session.refresh_token) return Promise.reject(new Error('no session'));

    refreshing = raw('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('refresh failed'))))
      .then(storeToken)
      .catch((err) => { writeSession(null); throw err; })
      .finally(() => { refreshing = null; });

    return refreshing;
  }

  /** Запит із одноразовою спробою оновити протермінований токен. */
  async function request(path, options, retried) {
    const res = await raw(path, options);

    if (res.status === 401 && session && !retried) {
      try {
        await refreshSession();
        return request(path, options, true);
      } catch (e) {
        /* сесія вмерла — повертаємо початкову помилку нижче */
      }
    }

    if (!res.ok) {
      let detail = '';
      try {
        const body = await res.json();
        detail = body.message || body.error_description || body.error || body.msg || '';
      } catch (e) { /* тіло не JSON */ }
      const err = new Error(detail || (res.status + ' ' + res.statusText));
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  /* ---------- автентифікація ---------- */

  const auth = {
    get user() { return session ? session.user : null; },
    get token() { return session ? session.access_token : null; },
    signedIn() { return Boolean(session && session.access_token); },

    async signIn(email, password) {
      const data = await request('/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });
      return storeToken(data);
    },

    async signOut() {
      if (session) {
        try { await raw('/auth/v1/logout', { method: 'POST' }); }
        catch (e) { /* навіть якщо не вийшло — локально сесію прибираємо */ }
      }
      writeSession(null);
    },

    /** Перевіряє, що токен ще живий, і що користувач є у списку адміністраторів. */
    async check() {
      if (!session) return null;
      if (session.expires_at && session.expires_at - Date.now() < 60000) {
        try { await refreshSession(); } catch (e) { return null; }
      }
      try {
        const rows = await request('/rest/v1/admins?select=user_id,email&limit=1');
        if (!rows || !rows.length) return null;
        return session.user;
      } catch (e) {
        return null;
      }
    }
  };

  /* ---------- таблиці ---------- */

  function qs(params) {
    const parts = [];
    Object.keys(params || {}).forEach((k) => {
      if (params[k] != null) parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    });
    return parts.length ? '?' + parts.join('&') : '';
  }

  function from(table) {
    const base = '/rest/v1/' + table;
    return {
      /** select({ select, order, limit, filters: { id: 'eq.abc' } }) */
      async select(options) {
        const o = options || {};
        const params = Object.assign({
          select: o.select || '*',
          order: o.order,
          limit: o.limit
        }, o.filters);
        return request(base + qs(params));
      },

      async insert(rows, options) {
        const o = options || {};
        return request(base + qs({ select: o.select }), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: o.returning === false ? 'return=minimal' : 'return=representation'
          },
          body: JSON.stringify(rows)
        });
      },

      async upsert(rows, conflict) {
        return request(base + qs({ on_conflict: conflict }), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(rows)
        });
      },

      async update(patch, filters) {
        return request(base + qs(filters), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify(patch)
        });
      },

      async remove(filters) {
        return request(base + qs(filters), { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
      }
    };
  }

  /* ---------- сховище файлів ---------- */

  /** Робить із назви файлу безпечний ключ: латиниця, цифри, дефіси. */
  function safeName(name) {
    const dot = name.lastIndexOf('.');
    const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : 'bin';
    const stem = (dot > 0 ? name.slice(0, dot) : name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'file';
    const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return stem + '-' + stamp + '.' + ext;
  }

  const files = {
    publicUrl(path) {
      return CONFIG.url + '/storage/v1/object/public/' + CONFIG.bucket + '/' + path;
    },

    /** Завантажує файл і повертає готове публічне посилання. */
    async upload(file, folder) {
      const path = (folder || 'misc') + '/' + safeName(file.name || 'file');
      await request('/storage/v1/object/' + CONFIG.bucket + '/' + path, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' },
        body: file,
        timeout: 180000              // відео вантажиться довго
      });
      return files.publicUrl(path);
    },

    /** Видаляє файл за публічним посиланням (свої файли, не чужі URL). */
    async removeByUrl(url) {
      const marker = '/storage/v1/object/public/' + CONFIG.bucket + '/';
      const at = String(url || '').indexOf(marker);
      if (at < 0) return false;
      await request('/storage/v1/object/' + CONFIG.bucket + '/' + url.slice(at + marker.length), {
        method: 'DELETE'
      });
      return true;
    },

    isStored(url) {
      return String(url || '').indexOf(CONFIG.url + '/storage/v1/object/public/') === 0;
    }
  };

  /* ---------- заявки з форм ---------- */

  /**
   * Кладе заявку в базу. Нічого не повертає й ніколи не кидає помилку далі —
   * форма на сайті має показати «дякуємо» навіть якщо база не відповіла.
   */
  async function lead(payload) {
    const row = {
      kind: payload.kind || 'other',
      name: trim(payload.name, 120),
      phone: trim(payload.phone, 40),
      email: trim(payload.email, 160),
      message: trim(payload.message, 2000),
      car_id: trim(payload.carId, 120),
      car_title: trim(payload.carTitle, 200),
      service: trim(payload.service, 200),
      page: location.pathname.split('/').pop() || 'index.html',
      lang: (global.I18N && I18N.lang) || 'en'
    };

    try {
      await from('leads').insert(row, { returning: false });
      return true;
    } catch (e) {
      console.warn('[velora] заявку не вдалося надіслати:', e.message);
      return false;
    }
  }

  function trim(value, max) {
    const s = String(value == null ? '' : value).trim();
    if (!s) return null;
    return s.slice(0, max);
  }

  global.DB = {
    config: CONFIG,
    auth: auth,
    from: from,
    files: files,
    lead: lead
  };
})(window);
