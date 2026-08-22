/* ==========================================================================
   Velora Motors — сторінка «Новинки та кастом»: три ролики великим планом
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Layout.esc;
  const icon = Layout.icon;

  function render() {
    $('#showcaseList').innerHTML = SHOWCASE.map((item, i) => `
      <article class="showcase__item reveal">
        <div class="showcase__media">
          <span class="showcase__badge">${esc(t(item.badge))}</span>
          <video src="${item.video}" poster="${item.poster}" muted loop playsinline preload="none"></video>
        </div>
        <div class="showcase__info">
          <div class="showcase__num">0${i + 1}</div>
          <h2 class="showcase__title">${esc(t(item.title))}</h2>
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
          <div class="showcase__actions">
            <a class="btn btn--primary" href="catalog.html">${esc(t('nav.catalog'))}</a>
            <a class="btn btn--ghost" href="contacts.html">${esc(t('nav.contacts'))}</a>
          </div>
          <p class="showcase__hint">${icon('i-info')}<span>${esc(t('page.clipHint'))}</span></p>
        </div>
      </article>`).join('');

    CarsUI.autoplayWhenVisible($$('#showcaseList video'));
    Layout.reveal($('#showcaseList'));
  }

  async function start() {
    I18N.init();
    Layout.mount('showcase');
    await Store.init();
    render();
    I18N.applyDom();

    document.addEventListener('layout:lang', () => {
      render();
      I18N.applyDom();
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
