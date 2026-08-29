/* ==========================================================================
   Velora Motors — сторінка СТО: послуги, ціни, запис (демо-форма)
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s) => document.querySelector(s);
  const esc = Layout.esc;
  const icon = Layout.icon;

  function render() {
    $('#services').innerHTML = Layout.SERVICES.map((s) => `
      <button class="service service--action reveal" type="button"
              data-booking data-service="${esc(t('sto.' + s.k + 't'))}">
        <div class="service__ico">${icon(s.icon)}</div>
        <h3>${esc(t('sto.' + s.k + 't'))}</h3>
        <p>${esc(t('sto.' + s.k + 'd'))}</p>
        <div class="service__foot">
          <span class="service__price"><span>${esc(t('sto.from'))}</span><b>$${s.price}</b></span>
          <span class="service__go">${esc(t('sto.book'))}${icon('i-arrow-right')}</span>
        </div>
      </button>`).join('');

    Layout.reveal($('#services'));
  }

  async function start() {
    I18N.init();
    Layout.mount('service');
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
