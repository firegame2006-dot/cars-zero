/* ==========================================================================
   Velora Motors — спільні елементи для авто: картка, форматування, автовідтворення відео
   ========================================================================== */
(function (global) {
  'use strict';

  const t = (k) => I18N.t(k);
  const esc = Layout.esc;
  const icon = Layout.icon;

  /*
   * Нейтральна заглушка на випадок, коли файл фото не знайдено.
   * Раніше тут стояв постер із червоним Porsche — і будь-яке відсутнє фото
   * показувало чуже авто, ніби це фото цієї машини. Так робити не можна:
   * краще порожня плашка, ніж неправдиве фото в картці.
   */
  const FALLBACK =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
      '<rect width="600" height="400" fill="#efe6d7"/>' +
      '<g fill="none" stroke="#b9ab92" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M170 232h260"/>' +
      '<path d="M199 232l22-62a28 28 0 0 1 26-18h106a28 28 0 0 1 26 18l22 62v46h-40v-28H239v28h-40z"/>' +
      '<circle cx="238" cy="264" r="13"/><circle cx="362" cy="264" r="13"/></g></svg>'
    );

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.missing) return;
    img.dataset.missing = '1';
    img.src = FALLBACK;
    img.classList.add('is-missing');
  }, true);

  const carName = (car) => `${car.brand} ${car.model}`;

  const gallery = (car) => {
    const list = Array.isArray(car.gallery) && car.gallery.length ? car.gallery.slice() : [];
    if (car.image && !list.includes(car.image)) list.unshift(car.image);
    return list.length ? list : [FALLBACK];
  };

  function mileageText(car) {
    return car.condition === 'new' && !car.mileage
      ? t('cond.new')
      : Store.fmtNum(car.mileage) + ' ' + t('catalog.km');
  }

  function engineText(car) {
    if (car.fuel === 'electric') return car.power + ' ' + t('catalog.hp');
    return `${Number(car.engine).toFixed(1)} · ${car.power} ${t('catalog.hp')}`;
  }

  function ownersText(car) {
    if (car.condition === 'new') return t('cond.new');
    return car.owners + ' ' + (car.owners === 1 ? t('catalog.owner1') : t('catalog.owners'));
  }

  function highlight(text, words) {
    let html = esc(text);
    (words || []).forEach((w) => {
      if (!w || w.length < 2) return;
      const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      html = html.replace(re, '<mark>$1</mark>');
    });
    return html;
  }

  function tagsHTML(car) {
    const tags = [];
    if (car.condition === 'new') tags.push(`<span class="tag tag--new">${esc(t('badge.new'))}</span>`);
    (car.badges || []).forEach((b) => {
      if (b === 'new' && car.condition === 'new') return;
      tags.push(`<span class="tag tag--${esc(b)}">${esc(t('badge.' + b))}</span>`);
    });
    return tags.join('');
  }

  /** Картка авто — веде на окрему сторінку car.html. */
  function cardHTML(car, index, words) {
    const favs = Store.favorites();
    const photos = gallery(car);
    return `
      <article class="card" data-id="${esc(car.id)}" style="animation-delay:${Math.min(index || 0, 9) * 45}ms">
        <a class="card__media" href="car.html?id=${encodeURIComponent(car.id)}"
           aria-label="${esc(carName(car))}">
          <span class="card__bg" style="background-image:url('${esc(Media.url(photos[0]))}')"></span>
          <div class="card__tags">${tagsHTML(car)}</div>
          <img src="${esc(Media.url(photos[0]))}" alt="${esc(carName(car))}" loading="lazy" width="1200" height="800">
          ${photos.length > 1 ? `<span class="card__count">${icon('i-expand')}${photos.length}</span>` : ''}
        </a>
        <button class="card__fav${favs.includes(car.id) ? ' is-on' : ''}" data-fav
                aria-label="${esc(t('catalog.fav'))}">${icon('i-heart')}</button>
        <div class="card__body">
          <h3 class="card__title">
            <a href="car.html?id=${encodeURIComponent(car.id)}">${highlight(carName(car), words)}</a>
          </h3>
          <div class="card__sub">${esc(car.trim || '')} · ${esc(t('city.' + car.city))}</div>
          <div class="card__specs">
            <div class="card__spec">${icon('i-calendar')}<span>${car.year}</span></div>
            <div class="card__spec">${icon('i-gauge')}<span>${esc(mileageText(car))}</span></div>
            <div class="card__spec">${icon('i-engine')}<span>${esc(engineText(car))}</span></div>
            <div class="card__spec">${icon('i-gear')}<span>${esc(t('gearbox.' + car.gearbox))}</span></div>
            <div class="card__spec">${icon('i-fuel')}<span>${esc(t('fuel.' + car.fuel))}</span></div>
            <div class="card__spec">${icon('i-drive')}<span>${esc(t('drive.' + car.drive))}</span></div>
          </div>
          <div class="card__foot">
            <div>
              <div class="card__price">${esc(Store.fmtPrice(car.price))}
                ${car.oldPrice ? `<s>${esc(Store.fmtPrice(car.oldPrice))}</s>` : ''}
              </div>
              <div class="card__state"><i></i>${esc(t('state.' + car.state))}</div>
            </div>
            <a class="btn btn--ghost btn--sm" href="car.html?id=${encodeURIComponent(car.id)}"
               data-i18n="catalog.details">${esc(t('catalog.details'))}</a>
          </div>
        </div>
      </article>`;
  }

  /** Обране на картках (решта — звичайні посилання на сторінку авто). */
  function bindCards(root) {
    root.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (!fav) return;
      e.preventDefault();
      const card = fav.closest('.card');
      const on = Store.toggleFavorite(card.dataset.id);
      fav.classList.toggle('is-on', on);
      Layout.toast(on ? t('catalog.favAdded') : t('catalog.favRemoved'));
      document.dispatchEvent(new CustomEvent('velora:favchange'));
    });
  }

  /** Відео грає лише коли видиме на екрані. */
  function autoplayWhenVisible(videos) {
    if (!('IntersectionObserver' in window)) {
      videos.forEach((v) => v.play().catch(() => {}));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.dataset.loaded) { v.load(); v.dataset.loaded = '1'; }
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.3 });
    videos.forEach((v) => io.observe(v));
  }

  /* ---------- вікно з описом авто, яке знято на відео ---------- */

  function clipLayer() {
    let layer = document.getElementById('clipInfo');
    if (layer) return layer;
    layer = document.createElement('div');
    layer.className = 'modal';
    layer.id = 'clipInfo';
    layer.innerHTML = `
      <div class="modal__box modal__box--clip">
        <button class="modal__close" data-clipinfo-close>${icon('i-x')}</button>
        <div class="clipinfo" id="clipInfoBody"></div>
      </div>`;
    document.body.appendChild(layer);

    layer.addEventListener('click', (e) => {
      if (e.target === layer || e.target.closest('[data-clipinfo-close]')) closeClipInfo();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeClipInfo();
    });
    return layer;
  }

  /** Показує повний опис кастомного авто з ролика. */
  function openClipInfo(index) {
    const item = global.Showcase && Showcase.get(index);
    if (!item) return;
    const layer = clipLayer();
    const clip = Showcase.text;
    // у вікні показуємо повний кадр, а не обрізаний під відео постер
    const photo = item.photo || item.poster || FALLBACK;

    document.getElementById('clipInfoBody').innerHTML = `
      <div class="clipinfo__media">
        <span class="clipinfo__bg" style="background-image:url('${esc(Media.url(photo))}')"></span>
        <img src="${esc(Media.url(photo))}" alt="${esc(clip(item.title))}" loading="lazy">
        <span class="clipinfo__badge">${esc(clip(item.badge))}</span>
      </div>
      <div class="clipinfo__body">
        <h2>${esc(clip(item.title))}</h2>
        <div class="clipinfo__sub">${esc(clip(item.sub))}</div>
        <dl class="showcase__specs">
          <div class="showcase__spec"><dt>${esc(t('showcase.specPower'))}</dt>
            <dd>${item.power} ${esc(t('catalog.hp'))}</dd></div>
          <div class="showcase__spec"><dt>${esc(t('showcase.specTime'))}</dt>
            <dd>${item.time}</dd></div>
          <div class="showcase__spec"><dt>${esc(t('showcase.specStatus'))}</dt>
            <dd>${esc(clip(item.status))}</dd></div>
        </dl>
        <h3 class="detail__section-title">${esc(t('clip.specs'))}</h3>
        <p class="clipinfo__text">${esc(clip(item.details))}</p>
        <div class="clipinfo__actions">
          <button class="btn btn--accent" data-booking
                  data-service="${esc(t('sto.s5t'))}">${esc(t('clip.ask'))}</button>
          <a class="btn btn--ghost" href="catalog.html">${esc(t('nav.catalog'))}</a>
        </div>
      </div>`;

    document.querySelectorAll('.modal.is-open').forEach((m) => {
      if (m !== layer) m.classList.remove('is-open');
    });
    layer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeClipInfo() {
    const layer = document.getElementById('clipInfo');
    if (!layer) return;
    layer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  global.CarsUI = {
    carName, gallery, mileageText, engineText, ownersText, highlight,
    tagsHTML, cardHTML, bindCards, autoplayWhenVisible, openClipInfo, closeClipInfo, FALLBACK
  };
})(window);
