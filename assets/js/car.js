/* ==========================================================================
   Velora Motors — сторінка одного авто: галерея з гортанням, характеристики
   ========================================================================== */
(function () {
  'use strict';

  const t = (k) => I18N.t(k);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Layout.esc;
  const icon = Layout.icon;

  let car = null;
  let photos = [];
  let index = 0;

  const colorLabel = () => ({ ua: 'Колір', en: 'Colour', pl: 'Kolor' }[I18N.lang] || 'Колір');

  /* ---------- галерея ---------- */

  function galleryHTML() {
    return `
      <div class="gallery" id="gallery">
        <div class="gallery__track" id="track">
          ${photos.map((src, i) => `
            <figure class="gallery__slide">
              <img src="${esc(src)}" alt="${esc(CarsUI.carName(car))} — ${t('page.photo')} ${i + 1}"
                   draggable="false" loading="${i === 0 ? 'eager' : 'lazy'}"
                   onerror="this.src='${CarsUI.FALLBACK}'">
            </figure>`).join('')}
        </div>

        <div class="gallery__tags">${CarsUI.tagsHTML(car)}</div>

        ${photos.length > 1 ? `
          <button class="gallery__nav gallery__nav--prev" id="prevBtn"
                  aria-label="${esc(t('page.prev'))}">${icon('i-chev-left')}</button>
          <button class="gallery__nav gallery__nav--next" id="nextBtn"
                  aria-label="${esc(t('page.next'))}">${icon('i-chev-right')}</button>
          <div class="gallery__counter"><span id="galleryNum">1</span> / ${photos.length}</div>` : ''}
      </div>

      ${photos.length > 1 ? `
        <div class="thumbs" id="thumbs">
          ${photos.map((src, i) => `
            <button class="thumb${i === 0 ? ' is-active' : ''}" data-go="${i}"
                    aria-label="${esc(t('page.photo'))} ${i + 1}">
              <img src="${esc(src)}" alt="" loading="lazy" onerror="this.src='${CarsUI.FALLBACK}'">
            </button>`).join('')}
        </div>` : ''}`;
  }

  function goTo(i) {
    index = (i + photos.length) % photos.length;
    $('#track').style.transform = `translate3d(${-index * 100}%,0,0)`;
    const num = $('#galleryNum');
    if (num) num.textContent = index + 1;
    $$('#thumbs .thumb').forEach((el, n) => el.classList.toggle('is-active', n === index));
  }

  function bindGallery() {
    if (photos.length < 2) return;
    $('#prevBtn').addEventListener('click', () => goTo(index - 1));
    $('#nextBtn').addEventListener('click', () => goTo(index + 1));
    $('#thumbs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b) goTo(Number(b.dataset.go));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // гортання пальцем / мишею
    const gallery = $('#gallery');
    let startX = null;
    const start = (x) => { startX = x; };
    const end = (x) => {
      if (startX == null) return;
      const dx = x - startX;
      if (Math.abs(dx) > 45) goTo(index + (dx < 0 ? 1 : -1));
      startX = null;
    };

    gallery.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
    gallery.addEventListener('touchend', (e) => end(e.changedTouches[0].clientX), { passive: true });
    gallery.addEventListener('mousedown', (e) => { e.preventDefault(); start(e.clientX); });
    gallery.addEventListener('mouseup', (e) => end(e.clientX));
    gallery.addEventListener('mouseleave', () => { startX = null; });
  }

  /* ---------- сторінка ---------- */

  function specsHTML() {
    const specs = [
      [t('catalog.year'), car.year],
      [t('catalog.mileage'), CarsUI.mileageText(car)],
      [t('catalog.engine'), CarsUI.engineText(car)],
      [t('catalog.fuel'), t('fuel.' + car.fuel)],
      [t('catalog.gearbox'), t('gearbox.' + car.gearbox)],
      [t('catalog.drive'), t('drive.' + car.drive)],
      [t('catalog.body'), t('body.' + car.body)],
      [colorLabel(), t('color.' + car.color)],
      [t('catalog.condition'), t('cond.' + car.condition)],
      [t('catalog.state'), t('state.' + car.state)],
      [t('catalog.owners'), CarsUI.ownersText(car)],
      [t('catalog.location'), t('city.' + car.city)],
      [t('catalog.vin'), car.vin || '—', true]
    ];
    return specs.map(([k, v, wide]) => `
      <div class="detail__spec${wide ? ' detail__spec--wide' : ''}">
        <dt>${esc(k)}</dt><dd>${esc(v)}</dd>
      </div>`).join('');
  }

  function render() {
    const desc = (car.desc && (car.desc[I18N.lang] || car.desc.ua)) || '';
    const monthly = Math.round((car.price * 0.75) / 60);
    const favOn = Store.favorites().includes(car.id);

    document.title = `${CarsUI.carName(car)} — Velora Motors`;

    $('#carPage').innerHTML = `
      <div class="carhead">
        <a class="carhead__back" href="catalog.html">${icon('i-arrow-left')}<span>${esc(t('page.backCatalog'))}</span></a>
        <a class="carhead__close" href="catalog.html" aria-label="${esc(t('page.close'))}">${icon('i-x')}</a>
      </div>

      <div class="carpage">
        <div class="carpage__media">
          ${galleryHTML()}
        </div>

        <aside class="carpage__side">
          <span class="eyebrow">${esc(t('city.' + car.city))} · ${car.year}</span>
          <h1 class="carpage__title">${esc(CarsUI.carName(car))}</h1>
          <div class="carpage__sub">${esc(car.trim || '')}</div>

          <div class="carpage__price">${esc(Store.fmtPrice(car.price))}
            ${car.oldPrice ? `<s>${esc(Store.fmtPrice(car.oldPrice))}</s>` : ''}
            <small>${esc(t('catalog.credit'))} $${Store.fmtNum(monthly)}${esc(t('catalog.perMonth'))}</small>
          </div>

          <div class="carpage__quick">
            <div class="card__spec">${icon('i-gauge')}<span>${esc(CarsUI.mileageText(car))}</span></div>
            <div class="card__spec">${icon('i-engine')}<span>${esc(CarsUI.engineText(car))}</span></div>
            <div class="card__spec">${icon('i-gear')}<span>${esc(t('gearbox.' + car.gearbox))}</span></div>
            <div class="card__spec">${icon('i-drive')}<span>${esc(t('drive.' + car.drive))}</span></div>
          </div>

          <form class="carpage__form" id="leadForm">
            <div class="f">
              <label for="lName">${esc(t('modal.name'))}</label>
              <input id="lName" type="text" autocomplete="name">
            </div>
            <div class="f">
              <label for="lPhone">${esc(t('modal.phone'))}</label>
              <input id="lPhone" type="tel" placeholder="+380 __ ___ __ **" autocomplete="tel">
            </div>
            <button class="btn btn--accent btn--block" type="submit">${esc(t('catalog.testDrive'))}</button>
            <button class="btn btn--ghost btn--block" type="button" data-demo="phone">
              ${icon('i-phone')}<span>${esc(t('catalog.callback'))}</span>
            </button>
            <div class="form-msg" id="leadMsg" role="status"></div>
          </form>

          <button class="carpage__fav${favOn ? ' is-on' : ''}" id="favBtn">
            ${icon('i-heart')}<span>${esc(t('catalog.fav'))}</span>
          </button>
        </aside>
      </div>

      <section class="carinfo">
        <div class="carinfo__block">
          <h2 class="detail__section-title">${esc(t('catalog.specs'))}</h2>
          <dl class="detail__specs">${specsHTML()}</dl>
        </div>

        ${(car.features || []).length ? `
          <div class="carinfo__block">
            <h2 class="detail__section-title">${esc(t('catalog.features'))}</h2>
            <div class="detail__features">
              ${car.features.map((f) => `<span class="detail__feature">${icon('i-check')}${esc(t('feat.' + f))}</span>`).join('')}
            </div>
          </div>` : ''}

        ${desc ? `
          <div class="carinfo__block">
            <h2 class="detail__section-title">${esc(t('catalog.description'))}</h2>
            <p class="detail__desc">${esc(desc)}</p>
          </div>` : ''}
      </section>

      <section class="similar">
        <div class="section-head">
          <div class="section-head__text">
            <h2 class="section-title">${esc(t('page.similar'))}</h2>
          </div>
          <a class="link-arrow" href="catalog.html"><span>${esc(t('nav.catalog'))}</span>${icon('i-arrow-right')}</a>
        </div>
        <div class="grid" id="similarGrid"></div>
      </section>`;

    // схожі авто: той самий кузов або близька ціна
    const similar = Store.all()
      .filter((c) => c.id !== car.id)
      .map((c) => ({
        c,
        score: (c.body === car.body ? 2 : 0) + (c.brand === car.brand ? 2 : 0)
          + (Math.abs(c.price - car.price) < car.price * 0.35 ? 1 : 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.c);
    $('#similarGrid').innerHTML = similar.map((c, i) => CarsUI.cardHTML(c, i, [])).join('');
    CarsUI.bindCards($('#similarGrid'));

    bindGallery();
    goTo(0);

    $('#leadForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('#leadMsg');
      if (!$('#lName').value.trim() || !$('#lPhone').value.trim()) {
        msg.textContent = t('sto.err');
        msg.className = 'form-msg is-err';
        return;
      }
      msg.textContent = t('modal.sent') + ' ' + t('demo.form');
      msg.className = 'form-msg is-ok';
      $('#leadForm').reset();
    });

    $('#favBtn').addEventListener('click', () => {
      const on = Store.toggleFavorite(car.id);
      $('#favBtn').classList.toggle('is-on', on);
      Layout.toast(on ? t('catalog.favAdded') : t('catalog.favRemoved'));
    });

    I18N.applyDom($('#carPage'));
  }

  function renderMissing() {
    $('#carPage').innerHTML = `
      <div class="empty">
        ${icon('i-sad')}
        <h3>${esc(t('catalog.empty'))}</h3>
        <p>${esc(t('catalog.emptyHint'))}</p>
        <a class="btn btn--primary" href="catalog.html">${esc(t('nav.catalog'))}</a>
      </div>`;
  }

  async function start() {
    I18N.init();
    Layout.mount('catalog');
    await Store.init();

    const id = new URLSearchParams(location.search).get('id');
    car = id ? Store.get(id) : null;

    if (!car) { renderMissing(); return; }

    photos = CarsUI.gallery(car);
    render();

    document.addEventListener('layout:lang', () => {
      index = 0;
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
