/* ==========================================================================
   Velora Motors — сторінка контактів. Усі дані демонстраційні.
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s) => document.querySelector(s);

  function bind() {
    $('#contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('#contactMsg');
      if (!$('#cName').value.trim() || !$('#cPhone').value.trim()) {
        msg.textContent = t('sto.err');
        msg.className = 'form-msg is-err';
        return;
      }
      msg.textContent = t('contacts.sent');
      msg.className = 'form-msg is-ok';
      Layout.toast(t('demo.form'));
      e.target.reset();
    });
  }

  async function start() {
    I18N.init();
    Layout.mount('contacts');
    bind();
    I18N.applyDom();
    Layout.reveal();
  }

  document.addEventListener('DOMContentLoaded', start);
})();
