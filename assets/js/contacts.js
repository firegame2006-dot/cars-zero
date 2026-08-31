/* ==========================================================================
   Velora Motors — сторінка контактів. Усі дані демонстраційні.
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s) => document.querySelector(s);

  function bind() {
    const form = $('#contactForm');
    const name = $('#cName');
    const phone = Forms.phone($('#cPhone'));
    const fields = [
      { el: name, type: 'name' },
      { el: phone, type: 'phone' }
    ];
    Forms.watch(fields);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      Forms.submit({
        form: form,
        fields: fields,
        send: () => DB.lead({
          kind: 'contact',
          name: name.value,
          phone: Forms.phoneValue(phone),
          message: $('#cMessage') ? $('#cMessage').value : ''
        })
      });
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
