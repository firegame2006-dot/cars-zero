/* ==========================================================================
   Velora Motors — панель керування.

   Працює напряму з Supabase: вхід за email і паролем, каталог авто,
   ролики шоуруму та заявки з форм сайту. Права перевіряються на боці
   бази (RLS), тож у браузері немає жодного «секрету».
   ========================================================================== */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------- довідники ---------- */

  const LISTS = {
    condition: [['new', 'New'], ['used', 'Used']],
    state: [['perfect', 'Flawless'], ['excellent', 'Excellent'], ['good', 'Good']],
    body: [['sedan', 'Sedan'], ['suv', 'SUV'], ['crossover', 'Crossover'], ['coupe', 'Coupé'],
      ['hatchback', 'Hatchback'], ['wagon', 'Estate'], ['convertible', 'Convertible']],
    fuel: [['petrol', 'Petrol'], ['diesel', 'Diesel'], ['hybrid', 'Hybrid'], ['electric', 'Electric']],
    gearbox: [['auto', 'Automatic'], ['manual', 'Manual'], ['robot', 'Dual-clutch'], ['cvt', 'CVT']],
    drive: [['fwd', 'Front'], ['rwd', 'Rear'], ['awd', 'All-wheel']],
    color: [['white', 'White'], ['black', 'Black'], ['silver', 'Silver'], ['grey', 'Grey'],
      ['blue', 'Blue'], ['red', 'Red'], ['green', 'Green'], ['yellow', 'Yellow'],
      ['brown', 'Brown'], ['beige', 'Beige']],
    city: [['kyiv', 'Kyiv'], ['lviv', 'Lviv'], ['odesa', 'Odesa'], ['dnipro', 'Dnipro'],
      ['kharkiv', 'Kharkiv'], ['ivano-frankivsk', 'Ivano-Frankivsk']]
  };

  const BADGES = [['hit', 'Best seller'], ['new', 'New'], ['custom', 'Custom']];

  const FEATURES = [
    ['warranty', 'Dealer warranty'], ['serviceBook', 'Service book'], ['noAccident', 'Accident-free'],
    ['customs', 'Customs cleared'], ['leasing', 'Leasing'], ['tradeIn', 'Trade-in'],
    ['firstOwner', 'First owner'], ['panoramic', 'Panoramic roof'], ['matrixLed', 'Matrix LED'],
    ['adaptiveCruise', 'Adaptive cruise'], ['heatedSeats', 'Heated seats'], ['camera360', '360° camera']
  ];

  const LEAD_KINDS = {
    test_drive: 'Test drive',
    booking: 'Service booking',
    contact: 'Contact form',
    evaluate: 'Car valuation',
    subscribe: 'Newsletter',
    clip: 'Custom build',
    other: 'Other'
  };

  const LEAD_STATUS = { new: 'New', in_progress: 'In progress', done: 'Done' };

  const CLIP_FIELDS = [
    ['title', 'Title'], ['sub', 'Subtitle'], ['badge', 'Badge'],
    ['status', 'Status'], ['text', 'Short text'], ['details', 'Full description']
  ];

  const CLIP_LANGS = [['en', 'English'], ['ua', 'Ukrainian'], ['pl', 'Polish']];

  /* ---------- стан ---------- */

  let cars = [];
  let clips = [];
  let leads = [];
  let carPhotos = [];
  let leadStatusFilter = 'all';

  /* ---------- дрібниці ---------- */

  function toast(text, kind) {
    const el = $('#toast');
    el.textContent = text;
    el.className = 'toast is-visible' + (kind ? ' toast--' + kind : '');
    clearTimeout(el._id);
    el._id = setTimeout(() => { el.className = 'toast'; }, 3000);
  }

  function say(node, text, kind) {
    node.textContent = text || '';
    node.className = 'msg' + (kind ? ' is-' + kind : '');
  }

  function options(list, selected) {
    return list.map(([v, label]) =>
      `<option value="${esc(v)}"${v === selected ? ' selected' : ''}>${esc(label)}</option>`).join('');
  }

  function money(n) {
    return '$' + new Intl.NumberFormat('en-US').format(Math.round(Number(n) || 0));
  }

  function when(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function slugify(text) {
    const map = { а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z',
      и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
      с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ь: '', ю: 'yu', я: 'ya' };
    return String(text || '').toLowerCase()
      .replace(/[Ѐ-ӿ]/g, (ch) => (map[ch] == null ? '' : map[ch]))
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function busy(button, on, label) {
    if (!button) return;
    if (on) {
      button._label = button.textContent;
      button.textContent = label || 'Saving…';
      button.disabled = true;
    } else {
      if (button._label) button.textContent = button._label;
      button.disabled = false;
    }
  }

  /* =======================================================================
     ВХІД
     ======================================================================= */

  async function boot() {
    const user = await DB.auth.check();
    $('#booting').hidden = true;

    if (!user) {
      $('#signin').hidden = false;
      $('#shell').hidden = true;
      return;
    }

    $('#signin').hidden = true;
    $('#shell').hidden = false;
    $('#who').textContent = user.email || '';
    await loadAll();
  }

  /** Кнопка-око: показує або ховає введений пароль. */
  function bindPasswordPeek() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-peek]');
      if (!btn) return;
      const input = $('#' + btn.dataset.peek);
      if (!input) return;

      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.querySelector('use').setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      input.focus();
    });
  }

  function bindSignIn() {
    $('#signinForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('#siMsg');
      const email = $('#siEmail').value.trim();
      const password = $('#siPassword').value;

      if (!email || !password) {
        say(msg, 'Enter your email and password.', 'err');
        return;
      }

      busy($('#siSubmit'), true, 'Signing in…');
      say(msg, '');

      try {
        await DB.auth.signIn(email, password);
        const user = await DB.auth.check();
        if (!user) {
          await DB.auth.signOut();
          say(msg, 'This account has no access to the control panel.', 'err');
          return;
        }
        $('#siPassword').value = '';
        $('#signin').hidden = true;
        $('#shell').hidden = false;
        $('#who').textContent = user.email || '';
        await loadAll();
      } catch (err) {
        say(msg, friendlyAuthError(err), 'err');
      } finally {
        busy($('#siSubmit'), false);
      }
    });

    $('#signout').addEventListener('click', async () => {
      await DB.auth.signOut();
      location.reload();
    });
  }

  function friendlyAuthError(err) {
    const text = String(err && err.message || '').toLowerCase();
    if (text.indexOf('invalid login') >= 0 || text.indexOf('credentials') >= 0) {
      return 'Wrong email or password.';
    }
    if (text.indexOf('email not confirmed') >= 0) {
      return 'This email is not confirmed yet. Confirm it in Supabase and try again.';
    }
    if (text.indexOf('failed to fetch') >= 0 || text.indexOf('abort') >= 0) {
      return 'No connection to the database. Check the internet and try again.';
    }
    return err && err.message ? err.message : 'Could not sign in.';
  }

  /* =======================================================================
     ЗАВАНТАЖЕННЯ ДАНИХ
     ======================================================================= */

  async function loadAll() {
    await Promise.all([loadCars(), loadClips(), loadLeads()]);
  }

  async function loadCars() {
    cars = await DB.from('cars').select({ order: 'created_at.desc' }) || [];
    $('#nCars').textContent = cars.length;
    renderCars();
  }

  async function loadClips() {
    clips = await DB.from('showcase').select({ order: 'position.asc' }) || [];
    $('#nClips').textContent = clips.length;
    renderClips();
  }

  async function loadLeads() {
    leads = await DB.from('leads').select({ order: 'created_at.desc', limit: 300 }) || [];
    const fresh = leads.filter((l) => l.status === 'new').length;
    const badge = $('#nLeads');
    badge.textContent = fresh;
    badge.classList.toggle('is-zero', fresh === 0);
    renderLeads();
  }

  /* =======================================================================
     АВТО
     ======================================================================= */

  function renderCars() {
    const q = $('#carSearch').value.trim().toLowerCase();
    const list = !q ? cars : cars.filter((c) =>
      [c.brand, c.model, c.trim, c.year, c.vin, c.id].join(' ').toLowerCase().indexOf(q) >= 0);

    const hidden = cars.filter((c) => c.published === false).length;
    $('#carsSummary').textContent = cars.length + ' in total' +
      (hidden ? ' · ' + hidden + ' hidden from the website' : '') +
      (q ? ' · ' + list.length + ' match your search' : '');

    if (!list.length) {
      $('#carList').innerHTML = '<p class="empty">' +
        (cars.length ? 'Nothing matches that search.' : 'The catalogue is empty. Add the first car.') + '</p>';
      return;
    }

    $('#carList').innerHTML = list.map((c) => {
      const photo = (c.gallery && c.gallery[0]) || c.image || '';
      return `
      <article class="card${c.published === false ? ' is-hidden' : ''}" data-id="${esc(c.id)}">
        <div class="card__pic">${photo ? `<img src="${esc(Media.url(photo))}" alt="" loading="lazy">` : '<span>no photo</span>'}</div>
        <div class="card__main">
          <h3>${esc(c.brand)} ${esc(c.model)}</h3>
          <p class="card__sub">${esc(c.trim || '')}</p>
          <p class="card__meta">${c.year} · ${new Intl.NumberFormat('en-US').format(c.mileage || 0)} km ·
            ${esc(label('body', c.body))} · ${esc(label('city', c.city))}</p>
        </div>
        <div class="card__price">
          <b>${money(c.price)}</b>
          ${c.old_price ? `<s>${money(c.old_price)}</s>` : ''}
          ${c.published === false ? '<span class="pill pill--off">Hidden</span>' : ''}
        </div>
        <div class="card__acts">
          <button class="iconbtn" type="button" data-car-edit title="Edit"><svg><use href="#i-edit"/></svg></button>
          <button class="iconbtn" type="button" data-car-toggle title="Show / hide on the website">
            <svg><use href="#i-check"/></svg>
          </button>
          <button class="iconbtn iconbtn--danger" type="button" data-car-del title="Delete">
            <svg><use href="#i-trash"/></svg>
          </button>
        </div>
      </article>`;
    }).join('');
  }

  function label(kind, value) {
    const found = (LISTS[kind] || []).find(([v]) => v === value);
    return found ? found[1] : (value || '');
  }

  function fillCarSelects() {
    Object.keys(LISTS).forEach((kind) => {
      const el = $('#f' + kind.charAt(0).toUpperCase() + kind.slice(1));
      if (el) el.innerHTML = options(LISTS[kind]);
    });
    $('#fBadges').innerHTML = BADGES.map(([v, l]) =>
      `<label class="check"><input type="checkbox" name="badge" value="${v}"><span>${esc(l)}</span></label>`).join('');
    $('#fFeatures').innerHTML = FEATURES.map(([v, l]) =>
      `<label class="check"><input type="checkbox" name="feature" value="${v}"><span>${esc(l)}</span></label>`).join('');
  }

  function openCarForm(car) {
    const c = car || {};
    $('#carFormTitle').textContent = car ? 'Edit car' : 'Add a car';
    $('#fId').value = c.id || '';
    $('#fBrand').value = c.brand || '';
    $('#fModel').value = c.model || '';
    $('#fTrim').value = c.trim || '';
    $('#fYear').value = c.year || new Date().getFullYear();
    $('#fPrice').value = c.price != null ? c.price : '';
    $('#fOldPrice').value = c.old_price || '';
    $('#fMileage').value = c.mileage || 0;
    $('#fEngine').value = c.engine != null ? c.engine : 2;
    $('#fPower').value = c.power != null ? c.power : 150;
    $('#fOwners').value = c.owners != null ? c.owners : 1;
    $('#fVin').value = c.vin || '';
    $('#fPublished').checked = c.published !== false;

    ['condition', 'state', 'body', 'fuel', 'gearbox', 'drive', 'color', 'city'].forEach((kind) => {
      const el = $('#f' + kind.charAt(0).toUpperCase() + kind.slice(1));
      el.value = c[kind] || LISTS[kind][0][0];
    });

    const badges = c.badges || [];
    const features = c.features || [];
    $$('#fBadges input').forEach((el) => { el.checked = badges.indexOf(el.value) >= 0; });
    $$('#fFeatures input').forEach((el) => { el.checked = features.indexOf(el.value) >= 0; });

    const d = c.descriptions || {};
    $('#fDescEn').value = d.en || '';
    $('#fDescUa').value = d.ua || '';
    $('#fDescPl').value = d.pl || '';

    carPhotos = (c.gallery && c.gallery.length ? c.gallery.slice() : (c.image ? [c.image] : []));
    renderShots();

    say($('#carFormMsg'), '');
    openSheet('#carSheet');
  }

  function renderShots() {
    $('#fShots').innerHTML = carPhotos.map((src, i) => `
      <div class="shot${i === 0 ? ' is-main' : ''}" draggable="true" data-i="${i}">
        <img src="${esc(Media.url(src))}" alt="">
        ${i === 0 ? '<span class="shot__tag">main</span>' : ''}
        <button class="shot__x" type="button" data-shot-del="${i}" aria-label="Remove">&times;</button>
      </div>`).join('') || '<p class="hint">No photos yet.</p>';
  }

  async function uploadPhotos(files) {
    const msg = $('#carFormMsg');
    let done = 0;
    for (const file of files) {
      say(msg, 'Uploading ' + (done + 1) + ' of ' + files.length + '…');
      try {
        carPhotos.push(await DB.files.upload(file, 'cars'));
        done += 1;
        renderShots();
      } catch (err) {
        say(msg, 'Could not upload ' + file.name + ': ' + err.message, 'err');
        return;
      }
    }
    say(msg, done + (done === 1 ? ' photo uploaded.' : ' photos uploaded.'), 'ok');
  }

  function readCarForm() {
    const brand = $('#fBrand').value.trim();
    const model = $('#fModel').value.trim();
    const year = Number($('#fYear').value);

    if (!brand || !model || !year || !$('#fPrice').value) {
      return { error: 'Fill in make, model, year and price.' };
    }

    const id = $('#fId').value || (slugify(brand + '-' + model + '-' + year) || 'car-' + Date.now());

    return {
      row: {
        id: id,
        brand: brand,
        model: model,
        trim: $('#fTrim').value.trim() || null,
        year: year,
        price: Number($('#fPrice').value) || 0,
        old_price: $('#fOldPrice').value ? Number($('#fOldPrice').value) : null,
        mileage: Number($('#fMileage').value) || 0,
        engine: Number($('#fEngine').value) || 0,
        power: Number($('#fPower').value) || 0,
        owners: Number($('#fOwners').value) || 0,
        vin: $('#fVin').value.trim() || null,
        condition: $('#fCondition').value,
        state: $('#fState').value,
        body: $('#fBody').value,
        fuel: $('#fFuel').value,
        gearbox: $('#fGearbox').value,
        drive: $('#fDrive').value,
        color: $('#fColor').value,
        city: $('#fCity').value,
        image: carPhotos[0] || null,
        gallery: carPhotos,
        badges: $$('#fBadges input:checked').map((el) => el.value),
        features: $$('#fFeatures input:checked').map((el) => el.value),
        descriptions: {
          en: $('#fDescEn').value.trim(),
          ua: $('#fDescUa').value.trim(),
          pl: $('#fDescPl').value.trim()
        },
        published: $('#fPublished').checked
      }
    };
  }

  function bindCars() {
    fillCarSelects();

    $('#carSearch').addEventListener('input', renderCars);
    $('#carNew').addEventListener('click', () => openCarForm(null));

    $('#carList').addEventListener('click', async (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const car = cars.find((c) => c.id === card.dataset.id);
      if (!car) return;

      if (e.target.closest('[data-car-edit]')) { openCarForm(car); return; }

      if (e.target.closest('[data-car-toggle]')) {
        const next = car.published === false;
        try {
          await DB.from('cars').update({ published: next }, { id: 'eq.' + car.id });
          car.published = next;
          renderCars();
          toast(next ? 'The car is visible on the website.' : 'The car is hidden from the website.');
        } catch (err) {
          toast('Could not save: ' + err.message, 'err');
        }
        return;
      }

      if (e.target.closest('[data-car-del]')) {
        if (!confirm('Delete ' + car.brand + ' ' + car.model + ' from the catalogue?')) return;
        try {
          await DB.from('cars').remove({ id: 'eq.' + car.id });
          cars = cars.filter((c) => c.id !== car.id);
          $('#nCars').textContent = cars.length;
          renderCars();
          toast('Car deleted.');
        } catch (err) {
          toast('Could not delete: ' + err.message, 'err');
        }
      }
    });

    $('#fPick').addEventListener('click', () => $('#fFiles').click());
    $('#fFiles').addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      e.target.value = '';
      if (files.length) uploadPhotos(files);
    });

    const drop = $('#fDrop');
    ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add('is-over');
    }));
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.indexOf('image/') === 0);
      if (files.length) uploadPhotos(files);
    });

    $('#fShots').addEventListener('click', (e) => {
      const del = e.target.closest('[data-shot-del]');
      if (!del) return;
      carPhotos.splice(Number(del.dataset.shotDel), 1);
      renderShots();
    });

    // перетягування фото міняє порядок; перше стає головним
    let dragFrom = null;
    $('#fShots').addEventListener('dragstart', (e) => {
      const shot = e.target.closest('.shot');
      if (shot) dragFrom = Number(shot.dataset.i);
    });
    $('#fShots').addEventListener('dragover', (e) => e.preventDefault());
    $('#fShots').addEventListener('drop', (e) => {
      const shot = e.target.closest('.shot');
      if (!shot || dragFrom == null) return;
      e.preventDefault();
      const to = Number(shot.dataset.i);
      carPhotos.splice(to, 0, carPhotos.splice(dragFrom, 1)[0]);
      dragFrom = null;
      renderShots();
    });

    $('#carForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('#carFormMsg');
      const parsed = readCarForm();

      if (parsed.error) { say(msg, parsed.error, 'err'); return; }

      busy($('#carSave'), true);
      try {
        await DB.from('cars').upsert(parsed.row, 'id');
        await loadCars();
        closeSheet('#carSheet');
        toast('Saved.');
      } catch (err) {
        say(msg, 'Could not save: ' + err.message, 'err');
      } finally {
        busy($('#carSave'), false);
      }
    });
  }

  /* =======================================================================
     РОЛИКИ ШОУРУМУ
     ======================================================================= */

  function renderClips() {
    if (!clips.length) {
      $('#clipList').innerHTML = '<p class="empty">No clips yet. Add the first one.</p>';
      return;
    }

    $('#clipList').innerHTML = clips.map((k) => `
      <article class="clip${k.published === false ? ' is-hidden' : ''}" data-id="${esc(k.id)}">
        <div class="clip__pic">
          ${k.photo_url || k.poster_url
            ? `<img src="${esc(Media.url(k.photo_url || k.poster_url))}" alt="" loading="lazy">`
            : '<span>no photo</span>'}
          <span class="clip__pos">${k.position}</span>
        </div>
        <div class="clip__main">
          <h3>${esc((k.title && (k.title.en || k.title.ua)) || 'Untitled')}</h3>
          <p class="card__sub">${esc((k.subtitle && (k.subtitle.en || k.subtitle.ua)) || '')}</p>
          <p class="card__meta">${esc(k.power || '—')} hp · ${esc(k.time_to_100 || '—')}
            ${k.published === false ? ' · <span class="pill pill--off">Hidden</span>' : ''}</p>
          <p class="clip__file">${esc(k.video_url || 'no video')}</p>
        </div>
        <div class="card__acts">
          <button class="iconbtn" type="button" data-clip-edit title="Edit"><svg><use href="#i-edit"/></svg></button>
          <button class="iconbtn iconbtn--danger" type="button" data-clip-del title="Delete">
            <svg><use href="#i-trash"/></svg>
          </button>
        </div>
      </article>`).join('');
  }

  function buildClipLangs() {
    $('#clipLangs').innerHTML = `
      <div class="langtabs">
        ${CLIP_LANGS.map(([code, name], i) =>
          `<button class="langtab${i === 0 ? ' is-active' : ''}" type="button" data-lang="${code}">${esc(name)}</button>`).join('')}
      </div>
      ${CLIP_LANGS.map(([code], i) => `
        <div class="langpane${i === 0 ? ' is-active' : ''}" data-pane="${code}">
          ${CLIP_FIELDS.map(([field, name]) => `
            <label class="fld">
              <span>${esc(name)}</span>
              ${field === 'details'
                ? `<textarea id="k_${field}_${code}" rows="4"></textarea>`
                : `<input id="k_${field}_${code}">`}
            </label>`).join('')}
        </div>`).join('')}`;

    $('#clipLangs').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-lang]');
      if (!tab) return;
      $$('.langtab', $('#clipLangs')).forEach((el) => el.classList.toggle('is-active', el === tab));
      $$('.langpane', $('#clipLangs')).forEach((el) =>
        el.classList.toggle('is-active', el.dataset.pane === tab.dataset.lang));
    });
  }

  const CLIP_COLUMN = { title: 'title', sub: 'subtitle', badge: 'badge', status: 'status', text: 'summary', details: 'details' };

  function openClipForm(clip) {
    const k = clip || {};
    $('#clipFormTitle').textContent = clip ? 'Edit clip' : 'Add a clip';
    $('#kId').value = k.id || '';
    $('#kPosition').value = k.position || (clips.length + 1);
    $('#kPower').value = k.power || '';
    $('#kTime').value = k.time_to_100 || '';
    $('#kVideo').value = k.video_url || '';
    $('#kPoster').value = k.poster_url || '';
    $('#kPhoto').value = k.photo_url || '';
    $('#kPublished').checked = k.published !== false;

    CLIP_FIELDS.forEach(([field]) => {
      const bag = k[CLIP_COLUMN[field]] || {};
      CLIP_LANGS.forEach(([code]) => {
        const el = $('#k_' + field + '_' + code);
        if (el) el.value = bag[code] || '';
      });
    });

    syncClipPreviews();
    say($('#clipFormMsg'), '');
    openSheet('#clipSheet');
  }

  function syncClipPreviews() {
    const video = $('#kVideoPreview');
    const src = $('#kVideo').value.trim();
    video.hidden = !src;
    if (src && video.getAttribute('src') !== src) video.setAttribute('src', src);

    [['#kPoster', '#kPosterPreview'], ['#kPhoto', '#kPhotoPreview']].forEach(([input, preview]) => {
      const url = $(input).value.trim();
      const img = $(preview);
      img.hidden = !url;
      if (url) img.src = url;
    });
  }

  function bindClips() {
    buildClipLangs();

    $('#clipNew').addEventListener('click', () => openClipForm(null));

    $('#clipList').addEventListener('click', async (e) => {
      const node = e.target.closest('.clip');
      if (!node) return;
      const clip = clips.find((k) => String(k.id) === node.dataset.id);
      if (!clip) return;

      if (e.target.closest('[data-clip-edit]')) { openClipForm(clip); return; }

      if (e.target.closest('[data-clip-del]')) {
        if (!confirm('Delete this clip from the website?')) return;
        try {
          await DB.from('showcase').remove({ id: 'eq.' + clip.id });
          await loadClips();
          toast('Clip deleted.');
        } catch (err) {
          toast('Could not delete: ' + err.message, 'err');
        }
      }
    });

    $$('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => $('#' + btn.dataset.pick).click());
    });

    [['#kVideoFile', '#kVideo', 'clips'], ['#kPosterFile', '#kPoster', 'clips'], ['#kPhotoFile', '#kPhoto', 'clips']]
      .forEach(([fileInput, target, folder]) => {
        $(fileInput).addEventListener('change', async (e) => {
          const file = (e.target.files || [])[0];
          e.target.value = '';
          if (!file) return;
          const msg = $('#clipFormMsg');
          say(msg, 'Uploading ' + file.name + '… large videos take a while.');
          try {
            $(target).value = await DB.files.upload(file, folder);
            syncClipPreviews();
            say(msg, 'Uploaded.', 'ok');
          } catch (err) {
            say(msg, 'Could not upload: ' + err.message, 'err');
          }
        });
      });

    ['#kVideo', '#kPoster', '#kPhoto'].forEach((sel) =>
      $(sel).addEventListener('change', syncClipPreviews));

    $('#clipForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('#clipFormMsg');
      const row = {
        position: Number($('#kPosition').value) || 1,
        power: $('#kPower').value.trim() || null,
        time_to_100: $('#kTime').value.trim() || null,
        video_url: $('#kVideo').value.trim() || null,
        poster_url: $('#kPoster').value.trim() || null,
        photo_url: $('#kPhoto').value.trim() || null,
        published: $('#kPublished').checked
      };

      CLIP_FIELDS.forEach(([field]) => {
        const bag = {};
        CLIP_LANGS.forEach(([code]) => {
          const value = $('#k_' + field + '_' + code).value.trim();
          if (value) bag[code] = value;
        });
        row[CLIP_COLUMN[field]] = bag;
      });

      if (!row.title.en && !row.title.ua && !row.title.pl) {
        say(msg, 'Give the clip a title in at least one language.', 'err');
        return;
      }

      busy($('#clipSave'), true);
      try {
        const id = $('#kId').value;
        if (id) await DB.from('showcase').update(row, { id: 'eq.' + id });
        else await DB.from('showcase').insert(row);
        await loadClips();
        closeSheet('#clipSheet');
        toast('Saved.');
      } catch (err) {
        say(msg, 'Could not save: ' + err.message, 'err');
      } finally {
        busy($('#clipSave'), false);
      }
    });
  }

  /* =======================================================================
     ЗАЯВКИ
     ======================================================================= */

  function renderLeads() {
    const list = leadStatusFilter === 'all'
      ? leads
      : leads.filter((l) => l.status === leadStatusFilter);

    const fresh = leads.filter((l) => l.status === 'new').length;
    $('#leadsSummary').textContent = leads.length
      ? leads.length + ' in total · ' + fresh + ' not handled yet'
      : 'No enquiries yet.';

    if (!list.length) {
      $('#leadList').innerHTML = '<p class="empty">' +
        (leads.length ? 'Nothing with this status.' : 'Enquiries from the website forms will appear here.') + '</p>';
      return;
    }

    $('#leadList').innerHTML = list.map((l) => `
      <article class="lead lead--${esc(l.status)}" data-id="${esc(l.id)}">
        <div class="lead__head">
          <span class="pill pill--${esc(l.kind)}">${esc(LEAD_KINDS[l.kind] || l.kind)}</span>
          <span class="lead__time">${esc(when(l.created_at))}</span>
        </div>

        <div class="lead__who">
          <b>${esc(l.name || 'No name')}</b>
          ${l.phone ? `<a href="tel:${esc(String(l.phone).replace(/[^+0-9]/g, ''))}">${esc(l.phone)}</a>` : ''}
          ${l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : ''}
        </div>

        ${l.car_title ? `<p class="lead__row"><i>Car</i>${esc(l.car_title)}</p>` : ''}
        ${l.service ? `<p class="lead__row"><i>Service</i>${esc(l.service)}</p>` : ''}
        ${l.message ? `<p class="lead__msg">${esc(l.message)}</p>` : ''}
        <p class="lead__from">${esc(l.page || '')}${l.lang ? ' · ' + esc(l.lang.toUpperCase()) : ''}</p>

        <div class="lead__acts">
          <select data-lead-status>
            ${Object.keys(LEAD_STATUS).map((s) =>
              `<option value="${s}"${s === l.status ? ' selected' : ''}>${esc(LEAD_STATUS[s])}</option>`).join('')}
          </select>
          <button class="iconbtn iconbtn--danger" type="button" data-lead-del title="Delete">
            <svg><use href="#i-trash"/></svg>
          </button>
        </div>
      </article>`).join('');
  }

  function bindLeads() {
    $('#leadFilter').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-status]');
      if (!btn) return;
      leadStatusFilter = btn.dataset.status;
      $$('#leadFilter button').forEach((el) => el.classList.toggle('is-active', el === btn));
      renderLeads();
    });

    $('#leadList').addEventListener('change', async (e) => {
      const select = e.target.closest('[data-lead-status]');
      if (!select) return;
      const id = select.closest('.lead').dataset.id;
      const lead = leads.find((l) => l.id === id);
      try {
        await DB.from('leads').update({ status: select.value }, { id: 'eq.' + id });
        lead.status = select.value;
        await loadLeads();
        toast('Status updated.');
      } catch (err) {
        toast('Could not save: ' + err.message, 'err');
      }
    });

    $('#leadList').addEventListener('click', async (e) => {
      if (!e.target.closest('[data-lead-del]')) return;
      const id = e.target.closest('.lead').dataset.id;
      if (!confirm('Delete this enquiry?')) return;
      try {
        await DB.from('leads').remove({ id: 'eq.' + id });
        leads = leads.filter((l) => l.id !== id);
        await loadLeads();
        toast('Enquiry deleted.');
      } catch (err) {
        toast('Could not delete: ' + err.message, 'err');
      }
    });
  }

  /* =======================================================================
     ЗАГАЛЬНЕ
     ======================================================================= */

  function openSheet(sel) {
    $(sel).hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeSheet(sel) {
    $(sel).hidden = true;
    document.body.style.overflow = '';
  }

  function bindShell() {
    $('#tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-view]');
      if (!tab) return;
      $$('#tabs .tab').forEach((el) => el.classList.toggle('is-active', el === tab));
      $$('.view').forEach((el) => el.classList.toggle('is-active', el.id === 'view-' + tab.dataset.view));
    });

    $$('[data-close-sheet]').forEach((btn) =>
      btn.addEventListener('click', () => closeSheet('#' + btn.closest('.sheet').id)));

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      $$('.sheet').forEach((s) => { if (!s.hidden) closeSheet('#' + s.id); });
    });

    // клік по темному тлу закриває форму
    $$('.sheet').forEach((sheet) => sheet.addEventListener('click', (e) => {
      if (e.target === sheet) closeSheet('#' + sheet.id);
    }));

    // сесія скінчилася в іншій вкладці — повертаємо на вхід
    document.addEventListener('db:auth', (e) => {
      if (!e.detail.user && !$('#shell').hidden) location.reload();
    });
  }

  function start() {
    bindShell();
    bindPasswordPeek();
    bindSignIn();
    bindCars();
    bindClips();
    bindLeads();
    boot().catch((err) => {
      $('#booting').textContent = 'Could not reach the database: ' + err.message;
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
