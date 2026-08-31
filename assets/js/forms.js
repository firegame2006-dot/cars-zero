/* ==========================================================================
   Velora Motors — спільна логіка всіх форм сайту.

   Дає чотири речі:
     Forms.phone(input)    — міжнародне поле телефону з вибором країни
     Forms.check(fields)   — перевірка з підказкою біля конкретного поля
     Forms.submit(options) — блокування кнопки, стан «надсилаємо», помилки
     Forms.success(...)    — велике підтвердження по центру екрана

   Телефон перевіряється за кількістю цифр обраної країни, тому «12345»
   надіслати не вийде. Ті самі правила продубльовані у базі (CHECK на
   таблиці leads), щоб їх не можна було обійти через DevTools.
   ========================================================================== */
(function (global) {
  'use strict';

  const t = (k) => (global.I18N ? I18N.t(k) : k);

  /* ---------- довідник країн ----------
     mask: '#' — одна цифра національного номера. Кількість '#' задає
     очікувану довжину; min — якщо в країні довжина плаваюча. */
  const COUNTRIES = [
    { iso: 'UA', dial: '380', mask: '## ### ## ##' },
    { iso: 'PL', dial: '48', mask: '### ### ###' },
    { iso: 'US', dial: '1', mask: '(###) ###-####' },
    { iso: 'CA', dial: '1', mask: '(###) ###-####' },
    { iso: 'GB', dial: '44', mask: '#### ######', min: 9 },
    { iso: 'DE', dial: '49', mask: '#### #######', min: 9 },
    { iso: 'FR', dial: '33', mask: '# ## ## ## ##' },
    { iso: 'IT', dial: '39', mask: '### ### ####', min: 9 },
    { iso: 'ES', dial: '34', mask: '### ## ## ##' },
    { iso: 'NL', dial: '31', mask: '# ########' },
    { iso: 'BE', dial: '32', mask: '### ## ## ##', min: 8 },
    { iso: 'AT', dial: '43', mask: '### #######', min: 9 },
    { iso: 'CH', dial: '41', mask: '## ### ## ##' },
    { iso: 'CZ', dial: '420', mask: '### ### ###' },
    { iso: 'SK', dial: '421', mask: '### ### ###' },
    { iso: 'HU', dial: '36', mask: '## ### ####', min: 8 },
    { iso: 'RO', dial: '40', mask: '### ### ###' },
    { iso: 'BG', dial: '359', mask: '### ### ###', min: 8 },
    { iso: 'GR', dial: '30', mask: '### ### ####' },
    { iso: 'PT', dial: '351', mask: '### ### ###' },
    { iso: 'SE', dial: '46', mask: '## ### ## ##', min: 7 },
    { iso: 'NO', dial: '47', mask: '### ## ###' },
    { iso: 'DK', dial: '45', mask: '## ## ## ##' },
    { iso: 'FI', dial: '358', mask: '## ### ####', min: 8 },
    { iso: 'IE', dial: '353', mask: '## ### ####', min: 7 },
    { iso: 'LT', dial: '370', mask: '### #####' },
    { iso: 'LV', dial: '371', mask: '## ### ###' },
    { iso: 'EE', dial: '372', mask: '#### ####', min: 7 },
    { iso: 'HR', dial: '385', mask: '## ### ####', min: 8 },
    { iso: 'SI', dial: '386', mask: '## ### ###' },
    { iso: 'RS', dial: '381', mask: '## ### ####', min: 8 },
    { iso: 'MD', dial: '373', mask: '## ### ###' },
    { iso: 'TR', dial: '90', mask: '### ### ## ##' },
    { iso: 'AE', dial: '971', mask: '## ### ####' },
    { iso: 'IL', dial: '972', mask: '## ### ####' },
    { iso: 'AU', dial: '61', mask: '### ### ###' },
    { iso: 'NZ', dial: '64', mask: '## ### ####', min: 8 },
    { iso: 'JP', dial: '81', mask: '## #### ####', min: 9 },
    { iso: 'KR', dial: '82', mask: '## #### ####', min: 9 },
    { iso: 'CN', dial: '86', mask: '### #### ####' },
    { iso: 'IN', dial: '91', mask: '##### #####' },
    { iso: 'BR', dial: '55', mask: '## ##### ####', min: 10 },
    { iso: 'MX', dial: '52', mask: '## #### ####' },
    { iso: 'ZA', dial: '27', mask: '## ### ####' },
    { iso: 'GE', dial: '995', mask: '### ### ###' },
    { iso: 'KZ', dial: '7', mask: '### ### ## ##' }
  ];

  const NAMES = {
    UA: { en: 'Ukraine', ua: 'Україна', pl: 'Ukraina' },
    PL: { en: 'Poland', ua: 'Польща', pl: 'Polska' },
    US: { en: 'United States', ua: 'США', pl: 'Stany Zjednoczone' },
    CA: { en: 'Canada', ua: 'Канада', pl: 'Kanada' },
    GB: { en: 'United Kingdom', ua: 'Велика Британія', pl: 'Wielka Brytania' },
    DE: { en: 'Germany', ua: 'Німеччина', pl: 'Niemcy' },
    FR: { en: 'France', ua: 'Франція', pl: 'Francja' },
    IT: { en: 'Italy', ua: 'Італія', pl: 'Włochy' },
    ES: { en: 'Spain', ua: 'Іспанія', pl: 'Hiszpania' },
    NL: { en: 'Netherlands', ua: 'Нідерланди', pl: 'Holandia' },
    BE: { en: 'Belgium', ua: 'Бельгія', pl: 'Belgia' },
    AT: { en: 'Austria', ua: 'Австрія', pl: 'Austria' },
    CH: { en: 'Switzerland', ua: 'Швейцарія', pl: 'Szwajcaria' },
    CZ: { en: 'Czechia', ua: 'Чехія', pl: 'Czechy' },
    SK: { en: 'Slovakia', ua: 'Словаччина', pl: 'Słowacja' },
    HU: { en: 'Hungary', ua: 'Угорщина', pl: 'Węgry' },
    RO: { en: 'Romania', ua: 'Румунія', pl: 'Rumunia' },
    BG: { en: 'Bulgaria', ua: 'Болгарія', pl: 'Bułgaria' },
    GR: { en: 'Greece', ua: 'Греція', pl: 'Grecja' },
    PT: { en: 'Portugal', ua: 'Португалія', pl: 'Portugalia' },
    SE: { en: 'Sweden', ua: 'Швеція', pl: 'Szwecja' },
    NO: { en: 'Norway', ua: 'Норвегія', pl: 'Norwegia' },
    DK: { en: 'Denmark', ua: 'Данія', pl: 'Dania' },
    FI: { en: 'Finland', ua: 'Фінляндія', pl: 'Finlandia' },
    IE: { en: 'Ireland', ua: 'Ірландія', pl: 'Irlandia' },
    LT: { en: 'Lithuania', ua: 'Литва', pl: 'Litwa' },
    LV: { en: 'Latvia', ua: 'Латвія', pl: 'Łotwa' },
    EE: { en: 'Estonia', ua: 'Естонія', pl: 'Estonia' },
    HR: { en: 'Croatia', ua: 'Хорватія', pl: 'Chorwacja' },
    SI: { en: 'Slovenia', ua: 'Словенія', pl: 'Słowenia' },
    RS: { en: 'Serbia', ua: 'Сербія', pl: 'Serbia' },
    MD: { en: 'Moldova', ua: 'Молдова', pl: 'Mołdawia' },
    TR: { en: 'Türkiye', ua: 'Туреччина', pl: 'Turcja' },
    AE: { en: 'United Arab Emirates', ua: 'ОАЕ', pl: 'ZEA' },
    IL: { en: 'Israel', ua: 'Ізраїль', pl: 'Izrael' },
    AU: { en: 'Australia', ua: 'Австралія', pl: 'Australia' },
    NZ: { en: 'New Zealand', ua: 'Нова Зеландія', pl: 'Nowa Zelandia' },
    JP: { en: 'Japan', ua: 'Японія', pl: 'Japonia' },
    KR: { en: 'South Korea', ua: 'Південна Корея', pl: 'Korea Południowa' },
    CN: { en: 'China', ua: 'Китай', pl: 'Chiny' },
    IN: { en: 'India', ua: 'Індія', pl: 'Indie' },
    BR: { en: 'Brazil', ua: 'Бразилія', pl: 'Brazylia' },
    MX: { en: 'Mexico', ua: 'Мексика', pl: 'Meksyk' },
    ZA: { en: 'South Africa', ua: 'ПАР', pl: 'RPA' },
    GE: { en: 'Georgia', ua: 'Грузія', pl: 'Gruzja' },
    KZ: { en: 'Kazakhstan', ua: 'Казахстан', pl: 'Kazachstan' }
  };

  const STORE_KEY = 'velora.phoneCountry';
  const digits = (s) => String(s || '').replace(/[^0-9]/g, '');
  const maxLen = (c) => (c.mask.match(/#/g) || []).length;
  const minLen = (c) => c.min || maxLen(c);

  function countryName(iso) {
    const lang = (global.I18N && I18N.lang) || 'en';
    const bag = NAMES[iso] || {};
    return bag[lang] || bag.en || iso;
  }

  /** Прапор із коду країни — символами Unicode, без картинок. */
  function flag(iso) {
    return String.fromCodePoint(...iso.toUpperCase().split('').map((c) => 0x1f1a5 + c.charCodeAt(0)));
  }

  function findCountry(iso) {
    return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];
  }

  /** Країна за замовчуванням: збережений вибір → мова сайту → Україна. */
  function defaultCountry() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && COUNTRIES.some((c) => c.iso === saved)) return findCountry(saved);
    } catch (e) { /* приватний режим */ }

    const byLang = { en: 'GB', pl: 'PL', ua: 'UA' };
    return findCountry(byLang[(global.I18N && I18N.lang) || 'en'] || 'UA');
  }

  /** Розкладає цифри за маскою: 5551234567 -> (555) 123-4567 */
  function applyMask(mask, value) {
    const nums = digits(value).slice(0, (mask.match(/#/g) || []).length);
    let out = '';
    let at = 0;
    for (const ch of mask) {
      if (at >= nums.length) break;
      if (ch === '#') { out += nums[at]; at += 1; } else { out += ch; }
    }
    return out;
  }

  /* =======================================================================
     ПОЛЕ ТЕЛЕФОНУ
     ======================================================================= */

  /**
   * Перетворює звичайний <input type="tel"> на поле з вибором країни.
   * Сам input лишається на місці й зберігає свій id, тому решта коду,
   * яка звертається до нього за id, продовжує працювати.
   */
  function phone(input) {
    if (!input || input.dataset.phoneReady) return input;
    input.dataset.phoneReady = '1';

    const box = document.createElement('div');
    box.className = 'phone';
    input.parentNode.insertBefore(box, input);

    const picker = document.createElement('button');
    picker.type = 'button';
    picker.className = 'phone__country';
    picker.setAttribute('aria-haspopup', 'listbox');
    picker.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'phone__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    box.appendChild(picker);
    box.appendChild(input);
    box.appendChild(menu);

    input.classList.add('phone__input');
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('autocomplete', 'tel-national');

    let current = defaultCountry();

    function paint() {
      picker.innerHTML = '<span class="phone__flag">' + flag(current.iso) + '</span>' +
        '<span class="phone__dial">+' + current.dial + '</span>' +
        '<span class="phone__caret" aria-hidden="true"></span>';
      picker.setAttribute('aria-label', countryName(current.iso) + ' +' + current.dial);
      input.placeholder = current.mask.replace(/#/g, '0');
      input.maxLength = current.mask.length;
    }

    function buildMenu() {
      menu.innerHTML = COUNTRIES.map((c) =>
        '<button type="button" class="phone__option' + (c.iso === current.iso ? ' is-active' : '') +
        '" role="option" data-iso="' + c.iso + '" aria-selected="' + (c.iso === current.iso) + '">' +
        '<span class="phone__flag">' + flag(c.iso) + '</span>' +
        '<span class="phone__name">' + countryName(c.iso) + '</span>' +
        '<span class="phone__dial">+' + c.dial + '</span></button>').join('');
    }

    function openMenu(open) {
      if (open) buildMenu();
      menu.hidden = !open;
      picker.setAttribute('aria-expanded', String(open));
      box.classList.toggle('is-open', open);
      if (open) {
        const active = menu.querySelector('.is-active');
        if (active) active.scrollIntoView({ block: 'center' });
      }
    }

    picker.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu(menu.hidden);
    });

    menu.addEventListener('click', (e) => {
      const opt = e.target.closest('[data-iso]');
      if (!opt) return;
      current = findCountry(opt.dataset.iso);
      try { localStorage.setItem(STORE_KEY, current.iso); } catch (err) { /* дарма */ }
      paint();
      input.value = applyMask(current.mask, input.value);
      openMenu(false);
      clearError(input);
      input.focus();
    });

    document.addEventListener('click', (e) => {
      if (!menu.hidden && !box.contains(e.target)) openMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) openMenu(false);
    });

    input.addEventListener('input', () => {
      const before = input.selectionStart === input.value.length;
      input.value = applyMask(current.mask, input.value);
      if (before) input.setSelectionRange(input.value.length, input.value.length);
      clearError(input);
    });

    // Якщо вставили номер разом із кодом країни — розпізнаємо країну.
    input.addEventListener('paste', (e) => {
      const text = (e.clipboardData || global.clipboardData).getData('text') || '';
      if (text.indexOf('+') < 0) return;
      const nums = digits(text);
      const match = COUNTRIES.slice()
        .sort((a, b) => b.dial.length - a.dial.length)
        .find((c) => nums.indexOf(c.dial) === 0);
      if (!match) return;
      e.preventDefault();
      current = match;
      paint();
      input.value = applyMask(current.mask, nums.slice(current.dial.length));
      clearError(input);
    });

    input._phone = {
      get country() { return current; },
      value() { return '+' + current.dial + digits(input.value); },
      valid() {
        const n = digits(input.value).length;
        return n >= minLen(current) && n <= maxLen(current);
      },
      reset() { input.value = ''; }
    };

    paint();
    document.addEventListener('langchange', () => { paint(); if (!menu.hidden) buildMenu(); });
    return input;
  }

  /** Повний номер у форматі E.164 (+380671234567). */
  function phoneValue(input) {
    return input && input._phone ? input._phone.value() : (input ? input.value.trim() : '');
  }

  /* =======================================================================
     ПОМИЛКИ БІЛЯ ПОЛЯ
     ======================================================================= */

  function fieldBox(input) {
    return input.closest('.form-row') || input.closest('.f') || input.parentElement;
  }

  function showError(input, text) {
    const row = fieldBox(input);
    if (!row) return;
    input.classList.add('is-err');
    input.setAttribute('aria-invalid', 'true');

    let note = row.querySelector('.field-err');
    if (!note) {
      note = document.createElement('small');
      note.className = 'field-err';
      note.setAttribute('role', 'alert');
      row.appendChild(note);
    }
    note.textContent = text;
    row.classList.add('has-err');
  }

  function clearError(input) {
    const row = fieldBox(input);
    input.classList.remove('is-err');
    input.removeAttribute('aria-invalid');
    if (!row) return;
    const note = row.querySelector('.field-err');
    if (note) note.remove();
    row.classList.remove('has-err');
  }

  /* =======================================================================
     ПЕРЕВІРКИ
     ======================================================================= */

  /** Імʼя: щонайменше дві літери, а не «1» чи набір символів. */
  function nameOk(value) {
    const v = String(value || '').trim();
    if (v.length < 2) return false;
    return (v.match(/[\p{L}]/gu) || []).length >= 2;
  }

  function emailOk(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
  }

  /**
   * Перевіряє список полів і підсвічує перше проблемне.
   * fields: [{ el, type: 'name'|'phone'|'email'|'required', message }]
   */
  function check(fields) {
    let firstBad = null;

    fields.forEach((f) => {
      if (!f.el) return;
      clearError(f.el);

      let ok = true;
      let msg = f.message;

      if (f.type === 'name') {
        ok = nameOk(f.el.value);
        msg = msg || t('form.nameErr');
      } else if (f.type === 'phone') {
        ok = f.el._phone ? f.el._phone.valid() : digits(f.el.value).length >= 7;
        msg = msg || t('form.phoneErr');
      } else if (f.type === 'email') {
        ok = emailOk(f.el.value);
        msg = msg || t('form.emailErr');
      } else {
        ok = String(f.el.value || '').trim().length > 0;
        msg = msg || t('form.requiredErr');
      }

      if (!ok) {
        showError(f.el, msg);
        if (!firstBad) firstBad = f.el;
      }
    });

    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return !firstBad;
  }

  /** Знімає підсвітку, щойно користувач почав виправляти поле. */
  function watch(fields) {
    fields.forEach((f) => {
      if (!f.el) return;
      const ev = f.el.tagName === 'SELECT' ? 'change' : 'input';
      f.el.addEventListener(ev, () => clearError(f.el));
    });
  }

  /* =======================================================================
     ПІДТВЕРДЖЕННЯ НА ВЕСЬ ЕКРАН
     ======================================================================= */

  function successLayer() {
    let layer = document.getElementById('formSuccess');
    if (layer) return layer;

    layer = document.createElement('div');
    layer.className = 'okmodal';
    layer.id = 'formSuccess';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.innerHTML =
      '<div class="okmodal__card">' +
      '  <span class="okmodal__mark" aria-hidden="true">' +
      '    <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-16"/></svg>' +
      '  </span>' +
      '  <h2 class="okmodal__title"></h2>' +
      '  <p class="okmodal__text"></p>' +
      '  <button class="btn btn--accent okmodal__btn" type="button"></button>' +
      '</div>';
    document.body.appendChild(layer);

    const close = () => hideSuccess();
    layer.addEventListener('click', (e) => {
      if (e.target === layer || e.target.closest('.okmodal__btn')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && layer.classList.contains('is-open')) close();
    });
    return layer;
  }

  function success(title, text) {
    const layer = successLayer();
    layer.querySelector('.okmodal__title').textContent = title || t('form.successTitle');
    layer.querySelector('.okmodal__text').textContent = text || t('form.successText');
    layer.querySelector('.okmodal__btn').textContent = t('form.successClose');

    // інші вікна ховаємо, щоб підтвердження було єдиним на екрані
    document.querySelectorAll('.modal.is-open').forEach((m) => m.classList.remove('is-open'));

    layer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => layer.querySelector('.okmodal__btn').focus(), 350);
  }

  function hideSuccess() {
    const layer = document.getElementById('formSuccess');
    if (!layer) return;
    layer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* =======================================================================
     СТАН КНОПКИ
     ======================================================================= */

  function busy(button, on) {
    if (!button) return;
    if (on) {
      if (!button.dataset.label) button.dataset.label = button.textContent;
      button.textContent = t('form.sending');
      button.disabled = true;
      button.classList.add('is-busy');
    } else {
      if (button.dataset.label) button.textContent = button.dataset.label;
      button.disabled = false;
      button.classList.remove('is-busy');
    }
  }

  /**
   * Єдиний шлях відправки: перевірка → блокування кнопки → запит →
   * підтвердження або зрозуміла помилка. Повторний клік під час
   * надсилання ігнорується.
   */
  async function submit(options) {
    const form = options.form;
    const button = options.button || form.querySelector('[type="submit"]');

    if (form.dataset.sending === '1') return false;
    if (!check(options.fields || [])) return false;

    form.dataset.sending = '1';
    busy(button, true);

    try {
      const sent = await options.send();
      if (sent === false) throw new Error('not sent');

      form.reset();
      (options.fields || []).forEach((f) => f.el && clearError(f.el));
      if (options.after) options.after();
      success(options.successTitle, options.successText);
      return true;
    } catch (err) {
      if (options.onError) options.onError(err);
      else showFormError(form, t('form.serverErr'));
      return false;
    } finally {
      form.dataset.sending = '';
      busy(button, false);
    }
  }

  /** Помітна смуга з помилкою сервера над кнопкою. */
  function showFormError(form, text) {
    let box = form.querySelector('.form-alert');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-alert';
      box.setAttribute('role', 'alert');
      const submitBtn = form.querySelector('[type="submit"]');
      form.insertBefore(box, submitBtn || null);
    }
    box.textContent = text;
    box.hidden = false;
    box.scrollIntoView({ block: 'center', behavior: 'smooth' });
    clearTimeout(box._id);
    box._id = setTimeout(() => { box.hidden = true; }, 8000);
  }

  global.Forms = {
    countries: COUNTRIES,
    phone: phone,
    phoneValue: phoneValue,
    check: check,
    watch: watch,
    nameOk: nameOk,
    emailOk: emailOk,
    showError: showError,
    clearError: clearError,
    success: success,
    hideSuccess: hideSuccess,
    submit: submit,
    showFormError: showFormError,
    busy: busy
  };
})(window);
