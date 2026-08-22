/* ==========================================================================
   Velora Motors — головна сторінка
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Layout.esc;
  const icon = Layout.icon;

  const BODIES = ['sedan', 'suv', 'crossover', 'coupe', 'hatchback', 'wagon', 'convertible'];
  const CITIES = ['kyiv', 'lviv', 'odesa', 'dnipro', 'kharkiv', 'ivano-frankivsk'];
  const BUDGETS = [
    { v: '', l: 'hero.budgetAny' },
    { v: '0-25000', l: '$0 – $25 000' },
    { v: '25000-50000', l: '$25 000 – $50 000' },
    { v: '50000-100000', l: '$50 000 – $100 000' },
    { v: '100000-', l: '$100 000+' }
  ];

  let cars = [];

  const option = (v, l, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(l)}</option>`;

  function fillHero() {
    $('#heroCity').innerHTML = option('', t('hero.cityAny')) +
      CITIES.map((c) => option(c, t('city.' + c))).join('');
    $('#heroBody').innerHTML = option('', t('hero.typeAny')) +
      BODIES.map((b) => option(b, t('body.' + b))).join('');
    $('#heroBudget').innerHTML = BUDGETS.map((b) => option(b.v, b.v ? b.l : t(b.l))).join('');
    $('#statCars').innerHTML = cars.length + '<span>+</span>';
    // на телефоні кнопка пошуку показує підпис — беремо його з перекладу
    $('.searchbar__submit').setAttribute('data-label', t('hero.search'));
  }

  /* ---------- ролики ---------- */

  function renderClips() {
    $('#clips').innerHTML = SHOWCASE.map((item, i) => `
      <article class="showcase__item reveal">
        <div class="showcase__media">
          <span class="showcase__badge">${esc(t(item.badge))}</span>
          <video src="${item.video}" poster="${item.poster}" muted loop playsinline preload="none"></video>
        </div>
        <div class="showcase__info">
          <div class="showcase__num">0${i + 1}</div>
          <h3 class="showcase__title">${esc(t(item.title))}</h3>
          <div class="showcase__sub">${esc(t(item.sub))}</div>
          <p class="showcase__text">${esc(t(item.text))}</p>
          <dl class="showcase__specs">
            <div class="showcase__spec"><dt>${esc(t('showcase.specPower'))}</dt>
              <dd>${item.power} ${esc(t('catalog.hp'))}</dd></div>
            <div class="showcase__spec"><dt>${esc(t('showcase.specTime'))}</dt>
              <dd>${item.time}</dd></div>
            <div class="showcase__spec"><dt>${esc(t('showcase.specStatus'))}</dt>
              <dd>${esc(t(item.status))}</dd></div>
          </dl>
          <a class="link-arrow" href="showcase.html">
            <span>${esc(t('showcase.details'))}</span>${icon('i-arrow-right')}
          </a>
        </div>
      </article>`).join('');

    CarsUI.autoplayWhenVisible($$('#clips video'));
    Layout.reveal($('#clips'));
  }

  /* ---------- добірка авто ---------- */

  function renderPicks() {
    const picks = cars.slice().sort((a, b) => {
      const score = (c) => (c.badges || []).length * 2 + (c.condition === 'new' ? 1 : 0);
      return score(b) - score(a) || String(b.createdAt).localeCompare(String(a.createdAt));
    }).slice(0, 6);

    $('#picks').innerHTML = picks.map((car, i) => CarsUI.cardHTML(car, i, [])).join('');
    CarsUI.bindCards($('#picks'));
  }

  /* ---------- послуги ---------- */

  function renderServices() {
    $('#servicesPreview').innerHTML = Layout.SERVICES.slice(0, 3).map((s) => `
      <button class="service service--action" type="button"
              data-booking data-service="${esc(t('sto.' + s.k + 't'))}">
        <div class="service__ico">${icon(s.icon)}</div>
        <h3>${esc(t('sto.' + s.k + 't'))}</h3>
        <p>${esc(t('sto.' + s.k + 'd'))}</p>
        <div class="service__foot">
          <span class="service__price"><span>${esc(t('sto.from'))}</span><b>$${s.price}</b></span>
          <span class="service__go">${esc(t('sto.book'))}${icon('i-arrow-right')}</span>
        </div>
      </button>`).join('');
  }

  /* ---------- лічильники ---------- */

  function countUp() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const target = Number(el.dataset.count);
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / 1200);
          el.innerHTML = Store.fmtNum(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach((f) => io.observe(f));
  }

  /* ---------- пошук у герої ---------- */

  function bindHero() {
    $('#heroSearch').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = new URLSearchParams();
      if ($('#heroCity').value) p.set('city', $('#heroCity').value);
      if ($('#heroBody').value) p.set('body', $('#heroBody').value);
      if ($('#heroBudget').value) p.set('budget', $('#heroBudget').value);
      const qs = p.toString();
      location.href = 'catalog.html' + (qs ? '?' + qs : '');
    });

  }

  async function start() {
    I18N.init();
    Layout.mount('home');
    cars = await Store.init();

    fillHero();
    renderClips();
    renderPicks();
    renderServices();
    bindHero();
    countUp();
    Layout.reveal();
    I18N.applyDom();

    document.addEventListener('layout:lang', () => {
      fillHero();
      renderClips();
      renderPicks();
      renderServices();
      I18N.applyDom();
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
