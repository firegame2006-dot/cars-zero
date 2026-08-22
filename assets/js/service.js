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

    $('#bService').innerHTML = Layout.SERVICES
      .map((s) => `<option value="${esc(t('sto.' + s.k + 't'))}">${esc(t('sto.' + s.k + 't'))}</option>`)
      .join('');

    Layout.reveal($('#services'));
  }

  function bind() {
    $('#bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('#bookingMsg');
      if (!$('#bName').value.trim() || !$('#bPhone').value.trim()) {
        msg.textContent = t('sto.err');
        msg.className = 'form-msg is-err';
        return;
      }
      msg.textContent = t('sto.ok') + ' ' + t('demo.form');
      msg.className = 'form-msg is-ok';
      Layout.toast(t('demo.form'));
      e.target.reset();
    });
  }

  async function start() {
    I18N.init();
    Layout.mount('service');
    await Store.init();
    render();
    bind();
    I18N.applyDom();

    document.addEventListener('layout:lang', () => {
      render();
      I18N.applyDom();
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
