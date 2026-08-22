/* ==========================================================================
   Velora Motors — сторінка каталогу: пошук, фільтри, порції по 10 авто
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Layout.esc;
  const icon = Layout.icon;
  const PAGE = 10;

  const BODIES = ['sedan', 'suv', 'crossover', 'coupe', 'hatchback', 'wagon', 'convertible'];
  const FUELS = ['petrol', 'diesel', 'hybrid', 'electric'];
  const GEARBOXES = ['auto', 'manual', 'robot', 'cvt'];
  const DRIVES = ['fwd', 'rwd', 'awd'];
  const CITIES = ['kyiv', 'lviv', 'odesa', 'dnipro', 'kharkiv', 'ivano-frankivsk'];
  const MILEAGES = [
    { v: '', l: '' }, { v: '1', l: '0 km' }, { v: '50000', l: '50 000 km' },
    { v: '100000', l: '100 000 km' }, { v: '150000', l: '150 000 km' }
  ];

  const KEYS = ['q', 'brand', 'body', 'fuel', 'gearbox', 'drive', 'condition',
    'city', 'year', 'priceMin', 'priceMax', 'mileage', 'sort'];

  const state = {
    q: '', brand: '', body: '', fuel: '', gearbox: '', drive: '', condition: '',
    city: '', year: '', priceMin: '', priceMax: '', mileage: '', sort: 'new', visible: PAGE
  };

  let allCars = [];
  let filtered = [];

  /* ---------- стан в адресі сторінки ---------- */

  function readURL() {
    const p = new URLSearchParams(location.search);
    KEYS.forEach((k) => { if (p.get(k)) state[k] = p.get(k); });
    if (p.get('budget')) {
      const [min, max] = p.get('budget').split('-');
      state.priceMin = min || '';
      state.priceMax = max || '';
    }
  }

  function writeURL() {
    const p = new URLSearchParams();
    KEYS.forEach((k) => { if (state[k] && !(k === 'sort' && state[k] === 'new')) p.set(k, state[k]); });
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ---------- селекти ---------- */

  const option = (v, l, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(l)}</option>`;

  function fillSelects() {
    const brands = Array.from(new Set(allCars.map((c) => c.brand))).sort();
    const years = Array.from(new Set(allCars.map((c) => c.year))).sort((a, b) => b - a);

    $('#sort').innerHTML = [
      ['new', t('catalog.sortNew')], ['cheap', t('catalog.sortCheap')],
      ['expensive', t('catalog.sortExpensive')], ['mileage', t('catalog.sortMileage')],
      ['year', t('catalog.sortYear')], ['power', t('catalog.sortPower')]
    ].map(([v, l]) => option(v, l, state.sort === v)).join('');

    $('#fBrand').innerHTML = option('', t('catalog.brandAny'), !state.brand)
      + brands.map((b) => option(b, b, state.brand === b)).join('');
    $('#fBody').innerHTML = option('', t('catalog.bodyAny'), !state.body)
      + BODIES.map((b) => option(b, t('body.' + b), state.body === b)).join('');
    $('#fFuel').innerHTML = option('', t('catalog.fuelAny'), !state.fuel)
      + FUELS.map((f) => option(f, t('fuel.' + f), state.fuel === f)).join('');
    $('#fGearbox').innerHTML = option('', t('catalog.gearboxAny'), !state.gearbox)
      + GEARBOXES.map((g) => option(g, t('gearbox.' + g), state.gearbox === g)).join('');
    $('#fDrive').innerHTML = option('', t('catalog.driveAny'), !state.drive)
      + DRIVES.map((d) => option(d, t('drive.' + d), state.drive === d)).join('');
    $('#fCondition').innerHTML = option('', t('catalog.conditionAny'), !state.condition)
      + ['new', 'used'].map((c) => option(c, t('cond.' + c), state.condition === c)).join('');
    $('#fCity').innerHTML = option('', t('hero.cityAny'), !state.city)
      + CITIES.map((c) => option(c, t('city.' + c), state.city === c)).join('');
    $('#fYear').innerHTML = option('', t('common.all'), !state.year)
      + years.map((y) => option(y, y, String(state.year) === String(y))).join('');
    $('#fMileage').innerHTML = MILEAGES
      .map((m) => option(m.v, m.v ? m.l : t('common.all'), state.mileage === m.v)).join('');

    $('#q').value = state.q;
    $('#fPriceMin').value = state.priceMin;
    $('#fPriceMax').value = state.priceMax;
    $('#searchWrap').classList.toggle('has-value', !!state.q);
  }

  /* ---------- фільтрація ---------- */

  function applyFilters() {
    const parsed = Store.parseQuery(state.q);

    filtered = Store.search(allCars, parsed).filter(({ car }) => {
      if (state.brand && car.brand !== state.brand) return false;
      if (state.body && car.body !== state.body) return false;
      if (state.fuel && car.fuel !== state.fuel) return false;
      if (state.gearbox && car.gearbox !== state.gearbox) return false;
      if (state.drive && car.drive !== state.drive) return false;
      if (state.condition && car.condition !== state.condition) return false;
      if (state.city && car.city !== state.city) return false;
      if (state.year && car.year < Number(state.year)) return false;
      if (state.priceMin && car.price < Number(state.priceMin)) return false;
      if (state.priceMax && car.price > Number(state.priceMax)) return false;
      if (state.mileage && car.mileage >= Number(state.mileage)) return false;
      return true;
    });

    const byRelevance = state.sort === 'new' && parsed.words.length;
    const cmp = {
      new: (a, b) => String(b.car.createdAt || '').localeCompare(String(a.car.createdAt || '')),
      cheap: (a, b) => a.car.price - b.car.price,
      expensive: (a, b) => b.car.price - a.car.price,
      mileage: (a, b) => a.car.mileage - b.car.mileage,
      year: (a, b) => b.car.year - a.car.year,
      power: (a, b) => b.car.power - a.car.power
    }[state.sort] || (() => 0);

    filtered.sort((a, b) => (byRelevance ? (b.s - a.s) || cmp(a, b) : cmp(a, b)));
    filtered = filtered.map((x) => x.car);
  }

  /* ---------- рендер ---------- */

  function render() {
    applyFilters();
    writeURL();

    const words = Store.parseQuery(state.q).words
      .concat(state.q.split(/\s+/).filter((w) => w.length > 1));
    const shown = filtered.slice(0, state.visible);

    $('#grid').innerHTML = shown.map((car, i) => CarsUI.cardHTML(car, i, words)).join('');
    $('#foundCount').textContent = filtered.length;
    $('#empty').hidden = filtered.length !== 0;
    $('#showingInfo').textContent = filtered.length
      ? `${t('catalog.showing')} ${shown.length} ${t('catalog.of')} ${filtered.length}`
      : '';

    const more = $('#more');
    if (filtered.length <= PAGE) {
      more.hidden = true;
    } else {
      more.hidden = false;
      const isEnd = state.visible >= filtered.length;
      more.classList.toggle('is-collapse', isEnd);
      $('#moreLabel').textContent = isEnd ? t('catalog.collapse') : t('catalog.showMore');
      $('#moreHint').textContent = isEnd ? ''
        : `+${Math.min(PAGE, filtered.length - state.visible)} ${t('catalog.cars')}`;
    }

    renderChips();
  }

  function renderChips() {
    const items = [];
    const add = (key, label) => items.push(
      `<span class="chip">${esc(label)}<button data-chip="${key}" aria-label="×">×</button></span>`);

    if (state.q) add('q', '“' + state.q + '”');
    if (state.brand) add('brand', state.brand);
    if (state.body) add('body', t('body.' + state.body));
    if (state.fuel) add('fuel', t('fuel.' + state.fuel));
    if (state.gearbox) add('gearbox', t('gearbox.' + state.gearbox));
    if (state.drive) add('drive', t('drive.' + state.drive));
    if (state.condition) add('condition', t('cond.' + state.condition));
    if (state.city) add('city', t('city.' + state.city));
    if (state.year) add('year', t('catalog.yearFrom') + ' ' + state.year);
    if (state.priceMin) add('priceMin', t('catalog.priceFrom') + ' $' + Store.fmtNum(state.priceMin));
    if (state.priceMax) add('priceMax', t('catalog.priceTo') + ' $' + Store.fmtNum(state.priceMax));
    if (state.mileage) add('mileage', t('catalog.mileageTo') + ' ' + Store.fmtNum(state.mileage) + ' ' + t('catalog.km'));

    if (items.length) items.push(`<button class="chip chip--reset" data-chip="all">${esc(t('catalog.reset'))}</button>`);
    $('#chips').innerHTML = items.join('');
  }

  function resetFilters() {
    KEYS.forEach((k) => { if (k !== 'sort') state[k] = ''; });
    state.visible = PAGE;
    fillSelects();
    render();
  }

  /* ---------- підказки ---------- */

  function renderSuggest() {
    const box = $('#suggest');
    if (!state.q.trim()) { box.classList.remove('is-open'); box.innerHTML = ''; return; }

    const parsed = Store.parseQuery(state.q);
    const scored = Store.search(allCars, parsed).sort((a, b) => b.s - a.s);
    const brands = Array.from(new Set(scored.map((x) => x.car.brand))).slice(0, 3);
    const cars = scored.slice(0, 5);
    const words = parsed.words;

    let html = '';
    if (brands.length) {
      html += `<div class="suggest__group">${esc(t('catalog.brand'))}</div>`;
      html += brands.map((b) => {
        const n = allCars.filter((c) => c.brand === b).length;
        return `<button type="button" class="suggest__item" data-brand="${esc(b)}">
          <span class="ico">${icon('i-car')}</span>
          <span><b>${CarsUI.highlight(b, words)}</b><small>${n} ${esc(t('catalog.cars'))}</small></span>
        </button>`;
      }).join('');
    }
    if (cars.length) {
      html += `<div class="suggest__group">${esc(t('nav.catalog'))}</div>`;
      html += cars.map(({ car }) => `
        <a class="suggest__item" href="car.html?id=${encodeURIComponent(car.id)}">
          <img src="${esc(CarsUI.gallery(car)[0])}" alt="" loading="lazy">
          <span><b>${CarsUI.highlight(CarsUI.carName(car), words)}</b>
            <small>${car.year} · ${esc(CarsUI.mileageText(car))} · ${esc(t('body.' + car.body))}</small></span>
          <span class="suggest__price">${esc(Store.fmtPrice(car.price))}</span>
        </a>`).join('');
    }
    if (!html) html = `<div class="suggest__group">${esc(t('catalog.empty'))}</div>`;

    box.innerHTML = html;
    box.classList.add('is-open');
  }

  function moveSuggest(dir) {
    const items = $$('#suggest .suggest__item');
    if (!items.length) return;
    let i = items.findIndex((el) => el.classList.contains('is-active'));
    items.forEach((el) => el.classList.remove('is-active'));
    i = (i + dir + items.length + 1) % (items.length + 1) - 1;
    if (i >= 0) {
      items[i].classList.add('is-active');
      items[i].scrollIntoView({ block: 'nearest' });
    }
  }

  /* ---------- події ---------- */

  function debounce(fn, ms) {
    let id;
    return function () {
      clearTimeout(id);
      const args = arguments;
      id = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  function bind() {
    const q = $('#q');
    const onInput = debounce(() => {
      state.q = q.value;
      state.visible = PAGE;
      $('#searchWrap').classList.toggle('has-value', !!q.value);
      renderSuggest();
      render();
    }, 160);

    q.addEventListener('input', onInput);
    q.addEventListener('focus', () => { if (state.q) renderSuggest(); });
    q.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSuggest(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSuggest(-1); }
      else if (e.key === 'Escape') { $('#suggest').classList.remove('is-open'); q.blur(); }
      else if (e.key === 'Enter') {
        const active = $('#suggest .suggest__item.is-active');
        if (active) { e.preventDefault(); active.click(); }
        else $('#suggest').classList.remove('is-open');
      }
    });

    $('#qClear').addEventListener('click', () => {
      q.value = '';
      state.q = '';
      state.visible = PAGE;
      $('#searchWrap').classList.remove('has-value');
      $('#suggest').classList.remove('is-open');
      render();
      q.focus();
    });

    $('#suggest').addEventListener('click', (e) => {
      const brandBtn = e.target.closest('[data-brand]');
      if (!brandBtn) return;
      state.brand = brandBtn.dataset.brand;
      state.q = '';
      state.visible = PAGE;
      $('#suggest').classList.remove('is-open');
      fillSelects();
      render();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#searchWrap')) $('#suggest').classList.remove('is-open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        q.focus();
      }
    });

    const bindSel = (sel, key) => $(sel).addEventListener('change', () => {
      state[key] = $(sel).value;
      state.visible = PAGE;
      render();
    });
    bindSel('#fBrand', 'brand');
    bindSel('#fBody', 'body');
    bindSel('#fFuel', 'fuel');
    bindSel('#fGearbox', 'gearbox');
    bindSel('#fDrive', 'drive');
    bindSel('#fCondition', 'condition');
    bindSel('#fCity', 'city');
    bindSel('#fYear', 'year');
    bindSel('#fMileage', 'mileage');
    bindSel('#sort', 'sort');

    const onPrice = debounce(() => {
      state.priceMin = $('#fPriceMin').value;
      state.priceMax = $('#fPriceMax').value;
      state.visible = PAGE;
      render();
    }, 320);
    $('#fPriceMin').addEventListener('input', onPrice);
    $('#fPriceMax').addEventListener('input', onPrice);

    $('#chips').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-chip]');
      if (!btn) return;
      if (btn.dataset.chip === 'all') { resetFilters(); return; }
      state[btn.dataset.chip] = '';
      state.visible = PAGE;
      fillSelects();
      render();
    });

    $('#emptyReset').addEventListener('click', resetFilters);

    $('#moreBtn').addEventListener('click', () => {
      if (state.visible >= filtered.length) {
        state.visible = PAGE;
        render();
        $('#catalogTop').scrollIntoView({ behavior: 'smooth' });
      } else {
        const firstNew = state.visible;
        state.visible += PAGE;
        render();
        const card = $$('#grid .card')[firstNew];
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    CarsUI.bindCards($('#grid'));

    document.addEventListener('layout:lang', () => {
      fillSelects();
      render();
    });
  }

  async function start() {
    I18N.init();
    Layout.mount('catalog');
    readURL();
    allCars = await Store.init();
    fillSelects();
    render();
    bind();
    I18N.applyDom();
  }

  document.addEventListener('DOMContentLoaded', start);
})();
