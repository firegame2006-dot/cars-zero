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

  let cars = [];

  /* Підбір авто переїхав у каталог — тут лишилась тільки лічба авто. */
  function fillHero() {
    $('#statCars').innerHTML = cars.length + '<span>+</span>';
  }

  /* ---------- ролики ---------- */

  function renderClips() {
    const clip = Showcase.text;
    $('#clips').innerHTML = Showcase.items.map((item, i) => `
      <article class="showcase__item reveal">
        <div class="showcase__media">
          <span class="showcase__badge">${esc(clip(item.badge))}</span>
          <video src="${item.video}" poster="${item.poster}" muted loop playsinline preload="none"></video>
        </div>
        <div class="showcase__info">
          <h3 class="showcase__title">${esc(clip(item.title))}</h3>
          <div class="showcase__sub">${esc(clip(item.sub))}</div>
          <p class="showcase__text">${esc(clip(item.text))}</p>
          <dl class="showcase__specs">
            <div class="showcase__spec"><dt>${esc(t('showcase.specPower'))}</dt>
              <dd>${item.power} ${esc(t('catalog.hp'))}</dd></div>
            <div class="showcase__spec"><dt>${esc(t('showcase.specTime'))}</dt>
              <dd>${item.time}</dd></div>
            <div class="showcase__spec"><dt>${esc(t('showcase.specStatus'))}</dt>
              <dd>${esc(clip(item.status))}</dd></div>
          </dl>
          <button class="link-arrow" type="button" data-clipinfo="${i}">
            <span>${esc(t('clip.more'))}</span>${icon('i-arrow-right')}
          </button>
        </div>
      </article>`).join('');

    CarsUI.autoplayWhenVisible($$('#clips video'));
    Layout.reveal($('#clips'));

    $('#clips').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-clipinfo]');
      if (btn) CarsUI.openClipInfo(Number(btn.dataset.clipinfo));
    });
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

  async function start() {
    I18N.init();
    Layout.mount('home');
    cars = await Store.init();
    await Showcase.load();

    fillHero();
    renderClips();
    renderPicks();
    renderServices();
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
