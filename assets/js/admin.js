/* ==========================================================================
   Velora Motors — адмінпанель: додавання, редагування та видалення авто
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const PASSWORD = 'admin';                 // демо-доступ
  const SESSION_KEY = 'velora.admin';

  const BODIES = ['sedan', 'suv', 'crossover', 'coupe', 'hatchback', 'wagon', 'convertible'];
  const FUELS = ['petrol', 'diesel', 'hybrid', 'electric'];
  const GEARBOXES = ['auto', 'manual', 'robot', 'cvt'];
  const DRIVES = ['fwd', 'rwd', 'awd'];
  const CITIES = ['kyiv', 'lviv', 'odesa', 'dnipro', 'kharkiv', 'ivano-frankivsk'];
  const COLORS = ['white', 'black', 'silver', 'grey', 'blue', 'red', 'green', 'yellow', 'brown', 'beige'];
  const STATES = ['perfect', 'excellent', 'good'];
  const BADGES = ['hit', 'new', 'custom'];
  const FEATURES = ['warranty', 'serviceBook', 'noAccident', 'customs', 'leasing', 'tradeIn',
    'firstOwner', 'panoramic', 'matrixLed', 'adaptiveCruise', 'heatedSeats', 'camera360'];

  let cars = [];
  let editingId = null;

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._id);
    el._id = setTimeout(() => el.classList.remove('is-visible'), 2400);
  }

  function opt(v, l, sel) {
    return `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(l)}</option>`;
  }

  /* ---------- селекти й чекбокси ---------- */

  function fillForm() {
    $('#cCondition').innerHTML = ['new', 'used'].map((c) => opt(c, t('cond.' + c))).join('');
    $('#cState').innerHTML = STATES.map((s) => opt(s, t('state.' + s))).join('');
    $('#cBody').innerHTML = BODIES.map((b) => opt(b, t('body.' + b))).join('');
    $('#cFuel').innerHTML = FUELS.map((f) => opt(f, t('fuel.' + f))).join('');
    $('#cGearbox').innerHTML = GEARBOXES.map((g) => opt(g, t('gearbox.' + g))).join('');
    $('#cDrive').innerHTML = DRIVES.map((d) => opt(d, t('drive.' + d))).join('');
    $('#cColor').innerHTML = COLORS.map((c) => opt(c, t('color.' + c))).join('');
    $('#cCity').innerHTML = CITIES.map((c) => opt(c, t('city.' + c))).join('');

    $('#badgeChecks').innerHTML = BADGES.map((b) => `
      <label class="check"><input type="checkbox" name="badge" value="${b}">${esc(t('badge.' + b))}</label>`).join('');
    $('#featureChecks').innerHTML = FEATURES.map((f) => `
      <label class="check"><input type="checkbox" name="feature" value="${f}">${esc(t('feat.' + f))}</label>`).join('');
  }

  /* ---------- список ---------- */

  function renderRows(filter) {
    const q = Store.norm(filter || '');
    const list = cars.filter((c) => !q || Store.norm(`${c.brand} ${c.model} ${c.trim} ${c.year} ${c.vin}`).includes(q));

    $('#total').textContent = cars.length;
    $('#rows').innerHTML = list.map((c) => `
      <article class="row${c.id === editingId ? ' is-editing' : ''}" data-id="${esc(c.id)}">
        <img src="${esc(c.image)}" alt="" loading="lazy"
             onerror="this.src='assets/img/showcase/poster-3.jpg'">
        <div>
          <div class="row__title">${esc(c.brand)} ${esc(c.model)}</div>
          <div class="row__sub">${c.year} · ${esc(t('cond.' + c.condition))} ·
            ${Store.fmtNum(c.mileage)} ${esc(t('catalog.km'))} · ${esc(t('city.' + c.city))}</div>
          <div class="row__price">${esc(Store.fmtPrice(c.price))}</div>
        </div>
        <div class="row__actions">
          <button class="iconbtn" data-edit data-i18n-title="admin.edit"><svg><use href="#i-edit"/></svg></button>
          <button class="iconbtn iconbtn--danger" data-del data-i18n-title="admin.delete"><svg><use href="#i-trash"/></svg></button>
        </div>
      </article>`).join('');
    I18N.applyDom($('#rows'));
  }

  /* ---------- форма ---------- */

  function clearForm() {
    editingId = null;
    $('#carForm').reset();
    $('#cId').value = '';
    $('#cGallery').value = '';
    renderPreviews();
    $('#formTitle').textContent = t('admin.add');
    $('#formMsg').textContent = '';
    $('#cMileage').value = 0;
    $('#cOwners').value = 1;
    $('#cEngine').value = 2;
    $('#cPower').value = 150;
    $$('[name="badge"], [name="feature"]').forEach((c) => { c.checked = false; });
    renderRows($('#adminSearch').value);
  }

  function fillFromCar(car) {
    editingId = car.id;
    $('#cId').value = car.id;
    $('#cBrand').value = car.brand || '';
    $('#cModel').value = car.model || '';
    $('#cTrim').value = car.trim || '';
    $('#cYear').value = car.year || '';
    $('#cPrice').value = car.price || '';
    $('#cOldPrice').value = car.oldPrice || '';
    $('#cMileage').value = car.mileage || 0;
    $('#cCondition').value = car.condition || 'used';
    $('#cState').value = car.state || 'good';
    $('#cBody').value = car.body || 'sedan';
    $('#cFuel').value = car.fuel || 'petrol';
    $('#cGearbox').value = car.gearbox || 'auto';
    $('#cDrive').value = car.drive || 'fwd';
    $('#cColor').value = car.color || 'white';
    $('#cCity').value = car.city || 'kyiv';
    $('#cEngine').value = car.engine != null ? car.engine : 2;
    $('#cPower').value = car.power || 150;
    $('#cOwners').value = car.owners != null ? car.owners : 1;
    $('#cVin').value = car.vin || '';
    $('#cGallery').value = photosOf(car).join('\n');
    $('#cDescUa').value = (car.desc && car.desc.ua) || '';
    $('#cDescEn').value = (car.desc && car.desc.en) || '';
    $('#cDescPl').value = (car.desc && car.desc.pl) || '';

    $$('[name="badge"]').forEach((c) => { c.checked = (car.badges || []).includes(c.value); });
    $$('[name="feature"]').forEach((c) => { c.checked = (car.features || []).includes(c.value); });

    renderPreviews();
    $('#formTitle').textContent = t('admin.edit');
    $('#formMsg').textContent = '';
    renderRows($('#adminSearch').value);
    $('#carForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Список фото авто (перше — головне). */
  function photosOf(car) {
    const list = Array.isArray(car.gallery) && car.gallery.length ? car.gallery.slice() : [];
    if (car.image && !list.includes(car.image)) list.unshift(car.image);
    return list;
  }

  function galleryValue() {
    return $('#cGallery').value.split('\n').map((x) => x.trim()).filter(Boolean);
  }

  function renderPreviews() {
    const list = galleryValue();
    $('#previews').innerHTML = list.length
      ? list.map((src, i) => `
          <div class="preview preview--sm">
            <img src="${esc(src)}" alt="">
            ${i === 0 ? `<span class="preview__main">${esc(t('admin.mainPhoto'))}</span>` : ''}
          </div>`).join('')
      : `<div class="preview"><span>${esc(t('admin.photosHint'))}</span></div>`;
  }

  function slug(str) {
    return Store.norm(str).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function collect() {
    const brand = $('#cBrand').value.trim();
    const model = $('#cModel').value.trim();
    const year = Number($('#cYear').value);
    const price = Number($('#cPrice').value);
    if (!brand || !model || !year || !price) return null;

    const id = editingId || `${slug(brand + ' ' + model)}-${year}-${Date.now().toString(36).slice(-4)}`;
    const condition = $('#cCondition').value;
    const badges = $$('[name="badge"]:checked').map((c) => c.value);
    const existing = cars.find((c) => c.id === editingId);

    return {
      id,
      brand, model,
      trim: $('#cTrim').value.trim(),
      year,
      body: $('#cBody').value,
      fuel: $('#cFuel').value,
      gearbox: $('#cGearbox').value,
      drive: $('#cDrive').value,
      engine: Number($('#cEngine').value) || 0,
      power: Number($('#cPower').value) || 0,
      mileage: condition === 'new' ? 0 : Number($('#cMileage').value) || 0,
      condition,
      state: $('#cState').value,
      owners: condition === 'new' ? 0 : Number($('#cOwners').value) || 0,
      vin: $('#cVin').value.trim(),
      city: $('#cCity').value,
      price,
      oldPrice: Number($('#cOldPrice').value) || undefined,
      color: $('#cColor').value,
      image: galleryValue()[0] || 'assets/img/showcase/poster-3.jpg',
      gallery: galleryValue().length ? galleryValue() : ['assets/img/showcase/poster-3.jpg'],
      badges,
      features: $$('[name="feature"]:checked').map((c) => c.value),
      desc: {
        ua: $('#cDescUa').value.trim(),
        en: $('#cDescEn').value.trim(),
        pl: $('#cDescPl').value.trim()
      },
      createdAt: (existing && existing.createdAt) || new Date().toISOString().slice(0, 10)
    };
  }

  /* ---------- події ---------- */

  function bind() {
    $('#carForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const car = collect();
      const msg = $('#formMsg');
      if (!car) {
        msg.textContent = t('admin.required');
        msg.className = 'form-msg is-err';
        return;
      }
      await Store.save(car);
      cars = Store.all();
      toast(t('admin.saved'));
      clearForm();
    });

    $('#cancelBtn').addEventListener('click', clearForm);
    $('#newBtn').addEventListener('click', clearForm);

    $('#cGallery').addEventListener('input', renderPreviews);

    $('#cImageFile').addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      let pending = files.length;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const current = $('#cGallery').value.trim();
          $('#cGallery').value = (current ? current + '\n' : '') + reader.result;
          if (--pending === 0) renderPreviews();
        };
        reader.readAsDataURL(file);          // фото зберігається разом з авто
      });
      e.target.value = '';
    });

    $('#rows').addEventListener('click', async (e) => {
      const row = e.target.closest('.row');
      if (!row) return;
      const car = cars.find((c) => c.id === row.dataset.id);
      if (!car) return;

      if (e.target.closest('[data-del]')) {
        if (!confirm(t('admin.confirmDelete') + '\n' + car.brand + ' ' + car.model)) return;
        await Store.remove(car.id);
        cars = Store.all();
        if (editingId === car.id) clearForm(); else renderRows($('#adminSearch').value);
        toast(t('admin.deleted'));
        return;
      }
      fillFromCar(car);
    });

    $('#adminSearch').addEventListener('input', () => renderRows($('#adminSearch').value));

    $('#exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(cars, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cars.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    $('#importFile').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data)) throw new Error('not an array');
          cars = await Store.replaceAll(data);
          clearForm();
          toast(t('admin.saved'));
        } catch (err) {
          toast('JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    $('#resetBtn').addEventListener('click', async () => {
      if (!confirm(t('admin.resetConfirm'))) return;
      cars = await Store.resetFactory();
      clearForm();
      toast(t('admin.saved'));
    });

    $('#logoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });

    document.addEventListener('langchange', () => {
      buildLangMenu();
      const snapshot = editingId ? cars.find((c) => c.id === editingId) : null;
      fillForm();
      if (snapshot) fillFromCar(snapshot); else clearForm();
      updateMode();
    });
  }

  function buildLangMenu() {
    $('#langMenu').innerHTML = I18N.langs.map((l) => `
      <button class="lang__item${l.code === I18N.lang ? ' is-active' : ''}" data-lang="${l.code}" role="menuitem">
        <span>${esc(l.full)}</span><small>${esc(l.label)}</small>
      </button>`).join('');
    $('#langCurrent').textContent = (I18N.langs.find((l) => l.code === I18N.lang) || {}).label || 'UA';
  }

  function updateMode() {
    const server = Store.mode === 'server';
    $('#modeText').textContent = server ? t('admin.storageServer') : t('admin.storageLocal');
    $('#modeBadge').classList.toggle('badge-mode--local', !server);
  }

  /* ---------- старт ---------- */

  async function enterPanel() {
    $('#login').hidden = true;
    $('#panel').hidden = false;
    $('#logoutBtn').hidden = false;

    cars = await Store.init();
    fillForm();
    clearForm();
    updateMode();
    bind();
    I18N.applyDom();
  }

  function start() {
    I18N.init();
    I18N.applyDom();
    buildLangMenu();
    bindLang();

    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      enterPanel();
      return;
    }

    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      if ($('#pwd').value === PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, '1');
        enterPanel();
      } else {
        $('#loginErr').textContent = t('admin.wrong');
        $('#pwd').value = '';
      }
    });

  }

  /** Мовне меню працює і до входу, і всередині панелі. */
  function bindLang() {
    $('#langBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#lang').classList.toggle('is-open');
    });
    $('#langMenu').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;
      I18N.setLang(btn.dataset.lang);
      buildLangMenu();
      $('#lang').classList.remove('is-open');
    });
    document.addEventListener('click', () => $('#lang').classList.remove('is-open'));
  }

  document.addEventListener('DOMContentLoaded', start);
})();
