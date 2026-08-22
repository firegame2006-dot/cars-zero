/* ==========================================================================
   Velora Motors — спільний каркас сторінок: іконки, хедер, футер, тости.
   Кожна сторінка викликає Layout.mount('catalog') після I18N.init().
   ========================================================================== */
(function (global) {
  'use strict';

  // після перезавантаження показуємо початок сторінки, а не місце, де зупинився читач
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', () => window.scrollTo(0, 0));

  const t = (k) => I18N.t(k);

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const icon = (id, cls) => `<svg class="${cls || ''}" aria-hidden="true"><use href="#${id}"/></svg>`;

  const PAGES = [
    { id: 'home', href: 'index.html', key: 'nav.home' },
    { id: 'showcase', href: 'showcase.html', key: 'nav.showcase' },
    { id: 'catalog', href: 'catalog.html', key: 'nav.catalog' },
    { id: 'service', href: 'service.html', key: 'nav.service' },
    { id: 'about', href: 'about.html', key: 'nav.about' },
    { id: 'contacts', href: 'contacts.html', key: 'nav.contacts' }
  ];

  const SERVICES = [
    { icon: 'i-shield', k: 's1', price: 35 },
    { icon: 'i-wrench', k: 's2', price: 60 },
    { icon: 'i-engine', k: 's3', price: 250 },
    { icon: 'i-paint', k: 's4', price: 120 },
    { icon: 'i-sparkle', k: 's5', price: 200 },
    { icon: 'i-tire', k: 's6', price: 25 }
  ];

  /* ---------- спрайт іконок ---------- */

  const SPRITE = `
<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">
  <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  <symbol id="i-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M7 12h10M10 17h4"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
  <symbol id="i-chev-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-chev-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></symbol>
  <symbol id="i-chev-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></symbol>
  <symbol id="i-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15"/><path d="m5.5 13 6.5 6.5 6.5-6.5"/></symbol>
  <symbol id="i-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5"/><path d="m5.5 11 6.5-6.5 6.5 6.5"/></symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 5.5 6.5 6.5-6.5 6.5"/></symbol>
  <symbol id="i-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><path d="m11 5.5-6.5 6.5 6.5 6.5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.7-7.5-10A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.9c0 5.3-7.5 10-7.5 10Z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></symbol>
  <symbol id="i-gauge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 14 4-4"/><circle cx="12" cy="18" r="1.2"/></symbol>
  <symbol id="i-fuel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15"/><path d="M3 20h11"/><path d="M13 10h3a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V9l-2.5-2.5"/><path d="M6 8h5"/></symbol>
  <symbol id="i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5v14M12 5v14M17 5v10"/><path d="M5 5h14"/><circle cx="17" cy="18" r="1.6"/></symbol>
  <symbol id="i-engine" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h3l2-2h4v4h3l2 2v4H8l-3-3Z"/><path d="M10 6h4"/><path d="M20 12h1v4h-1"/></symbol>
  <symbol id="i-car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16v2M19 16v2"/><path d="M3 16v-3.2a2 2 0 0 1 .3-1L5.6 8A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.7 1l2.3 3.8c.2.3.3.7.3 1V16Z"/><path d="M3 13h18"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/></symbol>
  <symbol id="i-drive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6Z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-wrench" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3.5a5 5 0 0 0-5.6 6.9L3.6 16.7a2 2 0 0 0 2.8 2.8l6.3-6.3a5 5 0 0 0 6.9-5.6l-3 3-2.5-2.5Z"/></symbol>
  <symbol id="i-paint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="14" height="7" rx="2"/><path d="M17 6h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-6"/><path d="M11 13v3"/><rect x="9" y="16" width="4" height="5" rx="1.4"/></symbol>
  <symbol id="i-tire" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5Z"/><path d="M18.5 16.5 19.5 19l2.5 1-2.5 1-1 2.5-1-2.5L15 20l2.5-1Z"/></symbol>
  <symbol id="i-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5Z"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></symbol>
  <symbol id="i-sad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 15.5a5 5 0 0 1 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.3 3 10.3 4.5 10.3 7v2H8v3h2.3v9h3.4v-9h2.5l.3-3Z"/></symbol>
  <symbol id="i-ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-tg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.3 4.3 3 11.4c-.9.3-.9 1.5.1 1.7l4.6 1.4 1.7 5.2c.2.7 1.1.9 1.6.3l2.4-2.6 4.6 3.4c.6.5 1.5.1 1.7-.6l3.2-14.6c.2-.9-.7-1.6-1.6-1.3ZM9.2 14.1l8.3-5.4-6.8 6.4-.3 3.2Z"/></symbol>
  <symbol id="i-yt" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3-.4-4.4a2.8 2.8 0 0 0-2-2C18.2 5.2 12 5.2 12 5.2s-6.2 0-7.6.4a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.4a2.8 2.8 0 0 0 2 2c1.4.4 7.6.4 7.6.4s6.2 0 7.6-.4a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12ZM10 15.2V8.8l5.5 3.2Z"/></symbol>
</svg>`;

  /* ---------- розмітка ---------- */

  function headerHTML(active) {
    return `
<div class="topbar">
  <div class="wrap topbar__inner">
    <ul class="topbar__list">
      <li class="topbar__item">${icon('i-phone')}
        <button class="demo-link" data-demo="phone" data-i18n="top.phone">+380 44 123 45 **</button></li>
      <li class="topbar__item topbar__list--extra">${icon('i-pin')}
        <button class="demo-link" data-demo="map" data-i18n="top.address"></button></li>
    </ul>
    <ul class="topbar__list topbar__list--extra">
      <li class="topbar__item"><span class="demo-chip" data-i18n="demo.badge">Демо-проєкт</span></li>
      <li class="topbar__item">${icon('i-clock')}<span data-i18n="top.hours"></span></li>
    </ul>
  </div>
</div>

<header class="header" id="header">
  <div class="wrap header__inner">
    <a class="logo" href="index.html" aria-label="Velora Motors">
      <span class="logo__mark">V</span>
      <span><b>Velora</b> <span>Motors</span></span>
    </a>

    <nav class="nav" id="nav" aria-label="main">
      <ul class="nav__list">
        ${PAGES.map((p) => `
          <li><a class="nav__link${p.id === active ? ' is-active' : ''}" href="${p.href}"
                 data-i18n="${p.key}"></a></li>`).join('')}
        <li class="nav__cta">
          <button class="btn btn--primary btn--block" data-booking data-i18n="nav.cta"></button>
        </li>
      </ul>
    </nav>

    <div class="header__actions">
      <div class="lang" id="lang">
        <button class="lang__btn" id="langBtn" aria-haspopup="true" aria-expanded="false">
          <span id="langCurrent">UA</span>${icon('i-chev-down')}
        </button>
        <div class="lang__menu" id="langMenu" role="menu"></div>
      </div>
      <button class="btn btn--primary" data-booking data-i18n="nav.cta"></button>
      <button class="burger" id="burger" data-i18n-aria="nav.menu" aria-expanded="false"><span></span></button>
    </div>
  </div>
</header>`;
  }

  function footerHTML() {
    return `
<footer class="footer" id="contacts">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a class="logo" href="index.html">
          <span class="logo__mark">V</span>
          <span><b>Velora</b> <span>Motors</span></span>
        </a>
        <p class="footer__about" data-i18n="footer.about"></p>
        <p class="footer__demo">${icon('i-info')}<span data-i18n="demo.note"></span></p>
        <div class="socials">
          <button class="demo-link" data-demo="social" aria-label="Facebook">${icon('i-fb')}</button>
          <button class="demo-link" data-demo="social" aria-label="Instagram">${icon('i-ig')}</button>
          <button class="demo-link" data-demo="social" aria-label="Telegram">${icon('i-tg')}</button>
          <button class="demo-link" data-demo="social" aria-label="YouTube">${icon('i-yt')}</button>
        </div>
      </div>

      <div>
        <h4 data-i18n="footer.nav"></h4>
        <ul class="footer__list">
          ${PAGES.map((p) => `<li><a href="${p.href}" data-i18n="${p.key}"></a></li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 data-i18n="footer.services"></h4>
        <ul class="footer__list">
          <li><a href="catalog.html" data-i18n="footer.srv1"></a></li>
          <li><a href="service.html" data-i18n="footer.srv2"></a></li>
          <li><a href="service.html" data-i18n="footer.srv3"></a></li>
          <li><a href="service.html" data-i18n="footer.srv4"></a></li>
          <li><a href="showcase.html" data-i18n="footer.srv5"></a></li>
          <li><a href="contacts.html" data-i18n="footer.srv6"></a></li>
        </ul>
      </div>

      <div>
        <h4 data-i18n="footer.contacts"></h4>
        <div class="footer__contact">${icon('i-phone')}
          <span>
            <button class="demo-link demo-link--strong" data-demo="phone" data-i18n="top.phone"></button>
            <button class="demo-link" data-demo="email">info@velora-motors.demo</button>
          </span>
        </div>
        <div class="footer__contact">${icon('i-pin')}
          <span><b data-i18n="footer.showroom"></b>
            <button class="demo-link" data-demo="map" data-i18n="footer.addressShowroom"></button></span>
        </div>
        <div class="footer__contact">${icon('i-wrench')}
          <span><b data-i18n="footer.service"></b>
            <button class="demo-link" data-demo="map" data-i18n="footer.addressService"></button></span>
        </div>
        <div class="footer__contact">${icon('i-clock')}
          <span><b data-i18n="footer.hoursTitle"></b>
            <span data-i18n="footer.hours1"></span><br><span data-i18n="footer.hours2"></span></span>
        </div>
        <form class="subscribe" id="subscribeForm">
          <input type="email" id="subEmail" required data-i18n-placeholder="footer.emailPh">
          <button class="btn btn--primary btn--sm" type="submit" data-i18n="footer.subscribe"></button>
        </form>
      </div>
    </div>

    <div class="footer__bottom">
      <span data-i18n="footer.rights"></span>
      <nav>
        <button class="demo-link" data-demo="form" data-i18n="footer.privacy"></button>
        <button class="demo-link" data-demo="form" data-i18n="footer.terms"></button>
      </nav>
    </div>
  </div>
</footer>`;
  }

  function bookingHTML() {
    return `
<div class="modal" id="bookingModal" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
  <div class="modal__box modal__box--form">
    <button class="modal__close" data-booking-close data-i18n-aria="page.close">${icon('i-x')}</button>
    <form class="booking booking--modal" id="bookingModalForm">
      <h2 id="bookingModalTitle" data-i18n="sto.formTitle"></h2>
      <p data-i18n="sto.formLead"></p>
      <div class="form-row">
        <label for="mName" data-i18n="sto.fName"></label>
        <input id="mName" type="text" autocomplete="name">
      </div>
      <div class="form-row">
        <label for="mPhone" data-i18n="sto.fPhone"></label>
        <input id="mPhone" type="tel" placeholder="+380 __ ___ __ **" autocomplete="tel">
      </div>
      <div class="form-row">
        <label for="mCar" data-i18n="sto.fCar"></label>
        <input id="mCar" type="text">
      </div>
      <div class="form-row">
        <label for="mService" data-i18n="sto.fService"></label>
        <select id="mService"></select>
      </div>
      <div class="form-row">
        <label for="mComment" data-i18n="sto.fComment"></label>
        <textarea id="mComment" rows="2"></textarea>
      </div>
      <button class="btn btn--light btn--block" type="submit" data-i18n="sto.submit"></button>
      <div class="form-msg" id="bookingModalMsg" role="status"></div>
    </form>
  </div>
</div>`;
  }

  function fillBookingServices(selected) {
    const sel = document.getElementById('mService');
    if (!sel) return;
    sel.innerHTML = SERVICES.map((s) => {
      const label = t('sto.' + s.k + 't');
      return `<option value="${esc(label)}"${label === selected ? ' selected' : ''}>${esc(label)}</option>`;
    }).join('');
  }

  /** Відкриває картку запису; можна одразу підставити послугу. */
  function openBooking(service) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    document.body.classList.remove('menu-open');   // мобільне меню не має лишатися відкритим
    fillBookingServices(service);
    document.getElementById('bookingModalMsg').textContent = '';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('mName').focus(), 250);
  }

  function closeBooking() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function bindBooking() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    fillBookingServices();

    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-booking]');
      if (opener) {
        e.preventDefault();
        openBooking(opener.dataset.service || '');
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-booking-close]')) closeBooking();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBooking();
    });

    document.getElementById('bookingModalForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('bookingModalMsg');
      if (!document.getElementById('mName').value.trim() || !document.getElementById('mPhone').value.trim()) {
        msg.textContent = t('sto.err');
        msg.className = 'form-msg is-err';
        return;
      }
      msg.textContent = t('sto.ok') + ' ' + t('demo.form');
      msg.className = 'form-msg is-ok';
      e.target.reset();
      fillBookingServices();
    });
  }

  /* ---------- поведінка ---------- */

  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._id);
    el._id = setTimeout(() => el.classList.remove('is-visible'), 3200);
  }

  function buildLangMenu() {
    const menu = document.getElementById('langMenu');
    if (!menu) return;
    menu.innerHTML = I18N.langs.map((l) => `
      <button class="lang__item${l.code === I18N.lang ? ' is-active' : ''}" data-lang="${l.code}" role="menuitem">
        <span>${esc(l.full)}</span><small>${esc(l.label)}</small>
      </button>`).join('');
    document.getElementById('langCurrent').textContent =
      (I18N.langs.find((l) => l.code === I18N.lang) || {}).label || 'UA';
  }

  let revealObserver;
  function reveal(root) {
    const list = Array.from((root || document).querySelectorAll('.reveal:not(.is-in)'));
    if (!('IntersectionObserver' in window)) {
      list.forEach((el) => el.classList.add('is-in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            revealObserver.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
    }
    list.forEach((el) => revealObserver.observe(el));
  }

  function bindCommon() {
    const header = document.getElementById('header');
    const up = document.getElementById('upBtn');

    const onScroll = () => {
      if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
      if (up) up.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('burger');
    if (burger) {
      burger.addEventListener('click', () => {
        const open = document.body.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }
    document.querySelectorAll('.nav__link').forEach((l) =>
      l.addEventListener('click', () => document.body.classList.remove('menu-open')));

    if (up) up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = document.getElementById('lang').classList.toggle('is-open');
        langBtn.setAttribute('aria-expanded', String(open));
      });
      document.getElementById('langMenu').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-lang]');
        if (!btn) return;
        I18N.setLang(btn.dataset.lang);
        document.getElementById('lang').classList.remove('is-open');
      });
      document.addEventListener('click', () => {
        const lang = document.getElementById('lang');
        if (lang) lang.classList.remove('is-open');
      });
    }

    // всі демонстраційні контакти пояснюють, що вони несправжні
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-demo]');
      if (!link) return;
      e.preventDefault();
      toast(t('demo.' + link.dataset.demo));
    });

    const sub = document.getElementById('subscribeForm');
    if (sub) {
      sub.addEventListener('submit', (e) => {
        e.preventDefault();
        toast(t('footer.subscribed') + ' ' + t('demo.form'));
        sub.reset();
      });
    }

    document.addEventListener('langchange', () => {
      buildLangMenu();
      fillBookingServices();
      document.dispatchEvent(new CustomEvent('layout:lang'));
    });
  }

  /**
   * Вставляє спільні частини сторінки.
   * @param {string} active - id поточної сторінки для підсвітки в меню
   */
  function mount(active) {
    document.body.insertAdjacentHTML('afterbegin', SPRITE + headerHTML(active));
    document.body.insertAdjacentHTML('beforeend', footerHTML() + bookingHTML() +
      '<div class="toast" id="toast" role="status"></div>' +
      `<button class="up" id="upBtn" aria-label="Up">${icon('i-arrow-up')}</button>`);
    buildLangMenu();
    bindCommon();
    bindBooking();
    I18N.applyDom();
    reveal();
  }

  global.Layout = { mount, toast, reveal, icon, esc, PAGES, SERVICES, openBooking, closeBooking };
})(window);
