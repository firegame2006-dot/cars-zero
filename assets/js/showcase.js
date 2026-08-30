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
    const clip = Showcase.text;
    $('#showcaseList').innerHTML = Showcase.items.map((item, i) => `
      <article class="showcase__item reveal">
        <div class="showcase__media">
          <span class="showcase__badge">${esc(clip(item.badge))}</span>
          <video src="${item.video}" poster="${item.poster}" muted loop playsinline preload="none"></video>
        </div>
        <div class="showcase__info">
          <h2 class="showcase__title">${esc(clip(item.title))}</h2>
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
          <div class="showcase__actions">
            <button class="btn btn--primary" data-clipinfo="${i}">${esc(t('clip.more'))}</button>
            <a class="btn btn--ghost" href="catalog.html">${esc(t('nav.catalog'))}</a>
          </div>
        </div>
      </article>`).join('');

    CarsUI.autoplayWhenVisible($$('#showcaseList video'));
    Layout.reveal($('#showcaseList'));

    $('#showcaseList').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-clipinfo]');
      if (btn) CarsUI.openClipInfo(Number(btn.dataset.clipinfo));
    });
  }

  async function start() {
    I18N.init();
    Layout.mount('showcase');
    await Store.init();
    await Showcase.load();
    render();
    I18N.applyDom();

    document.addEventListener('layout:lang', () => {
      render();
      I18N.applyDom();
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
