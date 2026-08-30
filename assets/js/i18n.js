/* ==========================================================================
   Velora Motors — переклади (UA / EN / PL)
   ========================================================================== */
(function (global) {
  'use strict';

  const DICT = {
    ua: {
      meta: {
        title: 'Velora Motors — автосалон преміальних та кастомних авто',
        description: 'Автосалон Velora Motors: нові та вживані автомобілі з перевіреною історією, кастомні збірки та власне СТО.'
      },
      top: {
        hours: 'Пн–Сб 09:00–20:00, Нд 10:00–17:00',
        address: 'Київ, вул. Березова 14',
        phone: '+380 44 123 45 **'
      },
      nav: {
        showcase: 'Новинки',
        catalog: 'Каталог',
        service: 'СТО',
        about: 'Про нас',
        contacts: 'Контакти',
        cta: 'Записатись на огляд',
        menu: 'Меню',
        lang: 'Мова'
      },
      hero: {
        eyebrow: 'Преміальні та кастомні авто',
        title1: 'Velora Motors: де точна',
        title2: 'інженерія зустрічає',
        title3: 'розкіш дороги',
        lead: 'Понад 300 перевірених автомобілів, власні кастом-проєкти та сервіс повного циклу. Кожне авто проходить повну діагностику перед продажем.',
        tabBuy: 'Купити авто',
        tabContact: 'Зв’язатися з нами',
        tabCustom: 'Кастом',
        city: 'Місто',
        cityAny: 'Усі',
        type: 'Тип кузова',
        typeAny: 'Усі',
        budget: 'Бюджет',
        budgetAny: 'Будь-яка',
        search: 'Підібрати',
        searchAria: 'Знайти автомобіль',
        stat1: 'авто в наявності',
        stat2: 'років на ринку',
        stat3: 'на звʼязку щодня',
        tagAero: 'Аеродинаміка та дизайн',
        tagInterior: 'Преміальний інтер’єр',
        scroll: 'Гортайте вниз'
      },
      brands: { title: 'Працюємо з брендами' },
      showcase: {
        eyebrow: 'Три історії',
        title: 'Новинки та кастомні збірки',
        lead: 'Живі відео з нашого шоуруму: свіжі надходження та проєкти, зібрані майстрами Velora Motors.',
        watch: 'Дивитись відео',
        sound: 'Звук',
        details: 'Деталі авто',
        badge1: 'Кастом-проєкт',
        badge2: 'Тюнінг Stage 2',
        badge3: 'Нове надходження',
        i1title: 'Widebody «Emerald»',
        i1sub: 'Honda NSX · ручна робота',
        i1text: 'Повністю ручний широкий обвіс, ковані диски у золоті, перешитий салон Alcantara. Один екземпляр в Україні.',
        i2title: 'BMW M4 «Frozen»',
        i2sub: 'F82 Competition · Stage 2',
        i2text: 'Матове покриття, вихлоп з клапанами, гоночне антикрило, чіп Stage 2 — 620 к.с. на колесах.',
        i3title: 'Porsche 911 GT3 RS',
        i3sub: '991.2 · нічний тест-драйв',
        i3text: 'Атмосферна шістка 4.0, 520 к.с., трекова підвіска. Записуйтесь на нічний тест-драйв містом.',
        specPower: 'Потужність',
        specTime: 'Розгін 0–100',
        specStatus: 'Статус',
        st1: 'Доступний',
        st2: 'В шоурумі',
        st3: 'Під замовлення'
      },
      catalog: {
        eyebrow: 'Каталог',
        title: 'Обирайте свій автомобіль',
        lead: 'Нові та вживані авто з прозорою історією: пробіг, стан, кількість власників і VIN — все відкрито.',
        searchPh: 'Пошук авто',
        searchLabel: 'Пошук по каталогу',
        clear: 'Очистити',
        suggestions: 'Підказки',
        filters: 'Фільтри',
        done: 'Готово',
        filtersFound: 'Показати',
        brand: 'Марка',
        brandAny: 'Усі',
        body: 'Кузов',
        bodyAny: 'Усі',
        fuel: 'Паливо',
        fuelAny: 'Усі',
        gearbox: 'КПП',
        gearboxAny: 'Усі',
        drive: 'Привід',
        driveAny: 'Усі',
        condition: 'Стан',
        conditionAny: 'Усі',
        priceFrom: 'Ціна від',
        priceTo: 'Ціна до',
        yearFrom: 'Рік від',
        mileageTo: 'Пробіг до',
        sort: 'Сортування',
        sortNew: 'Спочатку нові оголошення',
        sortCheap: 'Дешевші спершу',
        sortExpensive: 'Дорожчі спершу',
        sortMileage: 'Менший пробіг',
        sortYear: 'Новіший рік',
        sortPower: 'Потужніші',
        reset: 'Скинути все',
        found: 'Знайдено',
        cars: 'авто',
        showing: 'Показано',
        of: 'з',
        showMore: 'Показати ще',
        collapse: 'Згорнути каталог',
        empty: 'За вашим запитом нічого не знайдено',
        emptyHint: 'Спробуйте змінити фільтри або скинути пошук.',
        details: 'Детальніше',
        fav: 'В обране',
        favOnly: 'Обране',
        favEmpty: 'В обраному поки порожньо',
        favEmptyHint: 'Натисніть сердечко на картці авто, щоб зберегти його тут.',
        favAdded: 'Додано в обране',
        favRemoved: 'Прибрано з обраного',
        km: 'км',
        hp: 'к.с.',
        owners: 'власників',
        owner1: 'власник',
        vin: 'VIN',
        year: 'Рік',
        mileage: 'Пробіг',
        engine: 'Двигун',
        location: 'Локація',
        state: 'Технічний стан',
        priceLabel: 'Ціна',
        callback: 'Замовити дзвінок',
        testDrive: 'Тест-драйв',
        specs: 'Характеристики',
        features: 'Комплектація',
        description: 'Опис',
        credit: 'Кредит від',
        perMonth: '/міс'
      },
      cond: { new: 'Новий', used: 'З пробігом' },
      state: { perfect: 'Ідеальний', excellent: 'Відмінний', good: 'Добрий' },
      body: {
        sedan: 'Седан', suv: 'Позашляховик', crossover: 'Кросовер', coupe: 'Купе',
        hatchback: 'Хетчбек', wagon: 'Універсал', convertible: 'Кабріолет'
      },
      fuel: { petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гібрид', electric: 'Електро' },
      gearbox: { auto: 'Автомат', manual: 'Механіка', robot: 'Робот', cvt: 'Варіатор' },
      drive: { fwd: 'Передній', rwd: 'Задній', awd: 'Повний' },
      color: {
        white: 'Білий', black: 'Чорний', silver: 'Сріблястий', grey: 'Сірий', blue: 'Синій',
        red: 'Червоний', green: 'Зелений', yellow: 'Жовтий', brown: 'Коричневий', beige: 'Бежевий'
      },
      city: {
        kyiv: 'Київ', lviv: 'Львів', odesa: 'Одеса', dnipro: 'Дніпро',
        kharkiv: 'Харків', 'ivano-frankivsk': 'Івано-Франківськ'
      },
      feat: {
        warranty: 'Гарантія салону', serviceBook: 'Сервісна книга', noAccident: 'Без ДТП',
        customs: 'Розмитнений', leasing: 'Лізинг', tradeIn: 'Trade-in', firstOwner: 'Перший власник',
        panoramic: 'Панорамний дах', matrixLed: 'Матричне світло', adaptiveCruise: 'Адаптивний круїз',
        heatedSeats: 'Підігрів сидінь', camera360: 'Камера 360°'
      },
      badge: { hit: 'Хіт продажів', new: 'Новий', custom: 'Кастом' },
      sto: {
        eyebrow: 'Власне СТО',
        title: 'Сервіс, який залишає авто новим',
        lead: 'Три пости, оригінальні запчастини, комп’ютерна діагностика та гарантія на всі роботи 12 місяців.',
        s1t: 'Повна діагностика',
        s1d: 'Перевірка кузова, підвіски, електроніки та товщини фарби перед купівлею.',
        s2t: 'Технічне обслуговування',
        s2d: 'Регламентне ТО з оригінальними мастилами та фільтрами будь-якої марки.',
        s3t: 'Ремонт двигуна та КПП',
        s3d: 'Капітальний ремонт, заміна ланцюга ГРМ, обслуговування АКПП і роботів.',
        s4t: 'Кузовний цех і фарбування',
        s4d: 'Локальне фарбування, полірування, оклейка плівкою та керамічний захист.',
        s5t: 'Тюнінг і кастом',
        s5d: 'Обвіси, чип-тюнінг, вихлопні системи, диски та індивідуальний салон.',
        s6t: 'Шиномонтаж і розвал',
        s6d: 'Балансування, сезонне зберігання гуми, 3D розвал-сходження.',
        from: 'від',
        book: 'Записатись на сервіс',
        other: 'Інше — опишу проблему',
        otherHint: 'Опишіть, що сталося з авто',
        formTitle: 'Запис на СТО',
        formLead: 'Залиште контакти — майстер зателефонує протягом 15 хвилин і підбере зручний час.',
        fName: 'Ваше ім’я',
        fPhone: 'Телефон',
        fCar: 'Авто (марка, модель, рік)',
        fService: 'Послуга',
        fComment: 'Коментар',
        submit: 'Записатись',
        ok: 'Дякуємо! Ми зателефонуємо вам найближчим часом.',
        okTitle: 'Заявку прийнято',
        okDone: 'Готово',
        err: 'Заповніть ім’я та телефон.'
      },
      about: {
        eyebrow: 'Чому Velora Motors',
        title: 'Золота середина ринку',
        lead: 'Ми поєднали прозорість європейських дилерів зі швидкістю українського ринку.',
        a1t: 'Перевірена історія',
        a1d: 'Кожне авто пробите по базах, VIN відкритий, звіт видаємо до підписання договору.',
        a2t: 'Обмін і кредит',
        a2d: 'Trade-in за 40 хвилин, кредит від 0.01% та лізинг для бізнесу.',
        a3t: 'Гарантія 12 місяців',
        a3d: 'На двигун і КПП. Обслуговування у власному СТО зі знижкою 20%.',
        a4t: 'Доставка по Україні',
        a4d: 'Привеземо авто у ваше місто на евакуаторі або перегоном з водієм.',
        y1: 'років досвіду',
        y2: 'проданих авто',
        y3: 'відгуків 5★',
        y4: 'кастом-проєктів'
      },
      cta: {
        title: 'Продайте своє авто за 1 день',
        lead: 'Безкоштовна оцінка, викуп за ринковою ціною або комісійний продаж з вітрини салону.',
        button: 'Оцінити авто',
        secondary: 'Зателефонувати'
      },
      modal: {
        close: 'Закрити',
        request: 'Залишити заявку',
        name: 'Ім’я',
        phone: 'Телефон',
        send: 'Надіслати',
        sent: 'Заявку прийнято! Менеджер зв’яжеться з вами.',
        share: 'Поділитись',
        copied: 'Посилання скопійовано'
      },
      footer: {
        about: 'Автосалон повного циклу: продаж нових і вживаних авто, кастомні збірки, власне СТО та підбір автомобіля під ключ.',
        nav: 'Навігація',
        services: 'Послуги',
        contacts: 'Контакти',
        srv1: 'Продаж авто',
        srv2: 'Trade-in та викуп',
        srv4: 'Технічне обслуговування',
        srv5: 'Кастом і тюнінг',
        showroom: 'Шоурум',
        service: 'СТО',
        addressShowroom: 'Київ, вул. Березова 14',
        addressService: 'Київ, вул. Промислова 7',
        hoursTitle: 'Графік роботи',
        hours1: 'Пн–Сб: 09:00–20:00',
        hours2: 'Нд: 10:00–17:00',
        social: 'Соцмережі',
        newsletter: 'Новини та нові надходження',
        emailPh: 'Ваш e-mail',
        subscribe: 'Підписатись',
        subscribed: 'Дякуємо за підписку!',
        rights: '© 2026 Velora Motors. Усі права захищені.',
        privacy: 'Політика конфіденційності',
        terms: 'Умови користування',
        admin: 'Адмінпанель',
        credits: 'Фото автомобілів — Wikimedia Commons.'
      },
      admin: {
        title: 'Адмінпанель Velora Motors',
        login: 'Вхід',
        password: 'Пароль',
        enter: 'Увійти',
        wrong: 'Невірний пароль',
        hint: 'Демо-пароль: admin',
        logout: 'Вийти',
        add: 'Додати авто',
        edit: 'Редагувати',
        delete: 'Видалити',
        save: 'Зберегти',
        cancel: 'Скасувати',
        confirmDelete: 'Видалити це авто з каталогу?',
        saved: 'Збережено',
        deleted: 'Видалено',
        list: 'Автомобілі в каталозі',
        search: 'Пошук по каталогу',
        export: 'Експорт JSON',
        import: 'Імпорт JSON',
        reset: 'Скинути до заводських даних',
        resetConfirm: 'Повернути початковий каталог? Усі ваші зміни буде втрачено.',
        image: 'Фото (файл або шлях)',
        imageHint: 'Оберіть файл із комп’ютера або вкажіть шлях/URL',
        required: 'Заповніть обов’язкові поля: марка, модель, рік, ціна.',
        storageServer: 'Дані зберігаються на сервері (data/cars.json)',
        storageLocal: 'Дані зберігаються локально у браузері',
        total: 'Всього авто',
        photos: 'Фотографії авто',
        photosHint: 'Оберіть кілька файлів або впишіть шляхи — по одному в рядку. Перше фото буде головним.',
        mainPhoto: 'головне'
      },
      common: { yes: 'Так', no: 'Ні', all: 'Усі', currency: '$' }
    },

    en: {
      meta: {
        title: 'Velora Motors — premium and custom car dealership',
        description: 'Velora Motors dealership: new and used cars with verified history, custom builds and our own service centre.'
      },
      top: {
        hours: 'Mon–Sat 09:00–20:00, Sun 10:00–17:00',
        address: 'Kyiv, 14 Berezova St.',
        phone: '+380 44 123 45 **'
      },
      nav: {
        showcase: 'New arrivals',
        catalog: 'Catalogue',
        service: 'Service',
        about: 'About',
        contacts: 'Contacts',
        cta: 'Book a viewing',
        menu: 'Menu',
        lang: 'Language'
      },
      hero: {
        eyebrow: 'Premium & custom cars',
        title1: 'Velora Motors: where precision',
        title2: 'engineering meets',
        title3: 'luxury driving',
        lead: 'Over 300 verified cars, in-house custom projects and a full-cycle workshop. Every car goes through a full inspection before it is listed.',
        tabBuy: 'Buy a car',
        tabContact: 'Contact us',
        tabCustom: 'Custom',
        city: 'Location',
        cityAny: 'All',
        type: 'Car type',
        typeAny: 'All',
        budget: 'Budget',
        budgetAny: 'Any',
        search: 'Find',
        searchAria: 'Search cars',
        stat1: 'cars in stock',
        stat2: 'years on the market',
        stat3: 'in touch every day',
        tagAero: 'Aerodynamic design',
        tagInterior: 'Premium interior',
        scroll: 'Scroll down'
      },
      brands: { title: 'Brands we work with' },
      showcase: {
        eyebrow: 'Three stories',
        title: 'New arrivals & custom builds',
        lead: 'Live video from our showroom: fresh arrivals and projects built by the Velora Motors workshop.',
        watch: 'Watch video',
        sound: 'Sound',
        details: 'Car details',
        badge1: 'Custom project',
        badge2: 'Stage 2 tuning',
        badge3: 'Just arrived',
        i1title: 'Widebody “Emerald”',
        i1sub: 'Honda NSX · hand built',
        i1text: 'Hand-made widebody kit, forged gold wheels, re-trimmed Alcantara cabin. The only one in the country.',
        i2title: 'BMW M4 “Frozen”',
        i2sub: 'F82 Competition · Stage 2',
        i2text: 'Satin wrap, valved exhaust, GT wing and a Stage 2 remap — 620 hp at the wheels.',
        i3title: 'Porsche 911 GT3 RS',
        i3sub: '991.2 · night test drive',
        i3text: 'Naturally aspirated 4.0 flat-six, 520 hp, track suspension. Book a night test drive through the city.',
        specPower: 'Power',
        specTime: '0–100 km/h',
        specStatus: 'Status',
        st1: 'Available',
        st2: 'In showroom',
        st3: 'To order'
      },
      catalog: {
        eyebrow: 'Catalogue',
        title: 'Choose your car',
        lead: 'New and used cars with a transparent history: mileage, condition, number of owners and VIN — all in the open.',
        searchPh: 'Search cars',
        searchLabel: 'Search the catalogue',
        clear: 'Clear',
        suggestions: 'Suggestions',
        filters: 'Filters',
        done: 'Done',
        filtersFound: 'Show',
        brand: 'Make',
        brandAny: 'All',
        body: 'Body',
        bodyAny: 'All',
        fuel: 'Fuel',
        fuelAny: 'All',
        gearbox: 'Gearbox',
        gearboxAny: 'All',
        drive: 'Drivetrain',
        driveAny: 'All',
        condition: 'Condition',
        conditionAny: 'All',
        priceFrom: 'Price from',
        priceTo: 'Price to',
        yearFrom: 'Year from',
        mileageTo: 'Mileage up to',
        sort: 'Sort by',
        sortNew: 'Newest listings',
        sortCheap: 'Price: low to high',
        sortExpensive: 'Price: high to low',
        sortMileage: 'Lowest mileage',
        sortYear: 'Newest year',
        sortPower: 'Most powerful',
        reset: 'Reset all',
        found: 'Found',
        cars: 'cars',
        showing: 'Showing',
        of: 'of',
        showMore: 'Show more',
        collapse: 'Collapse catalogue',
        empty: 'Nothing matches your search',
        emptyHint: 'Try changing the filters or resetting the search.',
        details: 'View details',
        fav: 'Save',
        favOnly: 'Saved',
        favEmpty: 'Nothing saved yet',
        favEmptyHint: 'Tap the heart on a car card to keep it here.',
        favAdded: 'Added to favourites',
        favRemoved: 'Removed from favourites',
        km: 'km',
        hp: 'hp',
        owners: 'owners',
        owner1: 'owner',
        vin: 'VIN',
        year: 'Year',
        mileage: 'Mileage',
        engine: 'Engine',
        location: 'Location',
        state: 'Technical condition',
        priceLabel: 'Price',
        callback: 'Request a call',
        testDrive: 'Test drive',
        specs: 'Specifications',
        features: 'Equipment',
        description: 'Description',
        credit: 'Finance from',
        perMonth: '/mo'
      },
      cond: { new: 'New', used: 'Used' },
      state: { perfect: 'Flawless', excellent: 'Excellent', good: 'Good' },
      body: {
        sedan: 'Sedan', suv: 'SUV', crossover: 'Crossover', coupe: 'Coupé',
        hatchback: 'Hatchback', wagon: 'Estate', convertible: 'Convertible'
      },
      fuel: { petrol: 'Petrol', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Electric' },
      gearbox: { auto: 'Automatic', manual: 'Manual', robot: 'Dual-clutch', cvt: 'CVT' },
      drive: { fwd: 'Front', rwd: 'Rear', awd: 'All-wheel' },
      color: {
        white: 'White', black: 'Black', silver: 'Silver', grey: 'Grey', blue: 'Blue',
        red: 'Red', green: 'Green', yellow: 'Yellow', brown: 'Brown', beige: 'Beige'
      },
      city: {
        kyiv: 'Kyiv', lviv: 'Lviv', odesa: 'Odesa', dnipro: 'Dnipro',
        kharkiv: 'Kharkiv', 'ivano-frankivsk': 'Ivano-Frankivsk'
      },
      feat: {
        warranty: 'Dealer warranty', serviceBook: 'Service book', noAccident: 'Accident-free',
        customs: 'Customs cleared', leasing: 'Leasing', tradeIn: 'Trade-in', firstOwner: 'First owner',
        panoramic: 'Panoramic roof', matrixLed: 'Matrix LED', adaptiveCruise: 'Adaptive cruise',
        heatedSeats: 'Heated seats', camera360: '360° camera'
      },
      badge: { hit: 'Best seller', new: 'New', custom: 'Custom' },
      sto: {
        eyebrow: 'Our workshop',
        title: 'Service that keeps a car new',
        lead: 'Three bays, original parts, computer diagnostics and a 12-month guarantee on every job.',
        s1t: 'Full inspection',
        s1d: 'A check of body, suspension, electronics and paint thickness before you buy.',
        s2t: 'Scheduled maintenance',
        s2d: 'Routine servicing with original oils and filters for any make.',
        s3t: 'Engine & gearbox repair',
        s3d: 'Overhauls, timing chain replacement, automatic and dual-clutch servicing.',
        s4t: 'Body shop & paint',
        s4d: 'Local repainting, polishing, PPF wrapping and ceramic coating.',
        s5t: 'Tuning & custom',
        s5d: 'Body kits, remapping, exhaust systems, wheels and bespoke interiors.',
        s6t: 'Tyres & alignment',
        s6d: 'Balancing, seasonal tyre storage, 3D wheel alignment.',
        from: 'from',
        book: 'Book the service',
        other: 'Other — I will describe it',
        otherHint: 'Describe what happened to the car',
        formTitle: 'Service booking',
        formLead: 'Leave your details — a technician will call within 15 minutes and pick a convenient slot.',
        fName: 'Your name',
        fPhone: 'Phone',
        fCar: 'Car (make, model, year)',
        fService: 'Service',
        fComment: 'Comment',
        submit: 'Book now',
        ok: 'Thank you! We will call you shortly.',
        okTitle: 'Request sent',
        okDone: 'Done',
        err: 'Please fill in your name and phone.'
      },
      about: {
        eyebrow: 'Why Velora Motors',
        title: 'The golden middle of the market',
        lead: 'We combined the transparency of European dealers with the speed of the local market.',
        a1t: 'Verified history',
        a1d: 'Every car is checked against databases, the VIN is open and the report comes before signing.',
        a2t: 'Trade-in & finance',
        a2d: 'Trade-in in 40 minutes, credit from 0.01% and leasing for businesses.',
        a3t: '12-month warranty',
        a3d: 'On engine and gearbox. Servicing at our own workshop with a 20% discount.',
        a4t: 'Delivery nationwide',
        a4d: 'We deliver the car to your city by transporter or with our own driver.',
        y1: 'years of experience',
        y2: 'cars sold',
        y3: '5★ reviews',
        y4: 'custom projects'
      },
      cta: {
        title: 'Sell your car in a single day',
        lead: 'Free valuation, buy-out at market price or consignment sale from our showroom floor.',
        button: 'Value my car',
        secondary: 'Call us'
      },
      modal: {
        close: 'Close',
        request: 'Send a request',
        name: 'Name',
        phone: 'Phone',
        send: 'Send',
        sent: 'Request received! Our manager will contact you.',
        share: 'Share',
        copied: 'Link copied'
      },
      footer: {
        about: 'A full-cycle dealership: new and used cars, custom builds, our own workshop and turnkey car sourcing.',
        nav: 'Navigation',
        services: 'Services',
        contacts: 'Contacts',
        srv1: 'Car sales',
        srv2: 'Trade-in & buy-out',
        srv4: 'Maintenance',
        srv5: 'Custom & tuning',
        showroom: 'Showroom',
        service: 'Workshop',
        addressShowroom: 'Kyiv, 14 Berezova St.',
        addressService: 'Kyiv, 7 Promyslova St.',
        hoursTitle: 'Opening hours',
        hours1: 'Mon–Sat: 09:00–20:00',
        hours2: 'Sun: 10:00–17:00',
        social: 'Social',
        newsletter: 'News and new arrivals',
        emailPh: 'Your e-mail',
        subscribe: 'Subscribe',
        subscribed: 'Thanks for subscribing!',
        rights: '© 2026 Velora Motors. All rights reserved.',
        privacy: 'Privacy policy',
        terms: 'Terms of use',
        admin: 'Admin panel',
        credits: 'Car photos — Wikimedia Commons.'
      },
      admin: {
        title: 'Velora Motors admin panel',
        login: 'Sign in',
        password: 'Password',
        enter: 'Enter',
        wrong: 'Wrong password',
        hint: 'Demo password: admin',
        logout: 'Sign out',
        add: 'Add a car',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        confirmDelete: 'Remove this car from the catalogue?',
        saved: 'Saved',
        deleted: 'Deleted',
        list: 'Cars in the catalogue',
        search: 'Search catalogue',
        export: 'Export JSON',
        import: 'Import JSON',
        reset: 'Reset to factory data',
        resetConfirm: 'Restore the original catalogue? All your changes will be lost.',
        image: 'Photo (file or path)',
        imageHint: 'Pick a file from your computer or enter a path/URL',
        required: 'Please fill in the required fields: make, model, year, price.',
        storageServer: 'Data is stored on the server (data/cars.json)',
        storageLocal: 'Data is stored locally in your browser',
        total: 'Cars total',
        photos: 'Car photos',
        photosHint: 'Pick several files or type paths — one per line. The first photo is the main one.',
        mainPhoto: 'main'
      },
      common: { yes: 'Yes', no: 'No', all: 'All', currency: '$' }
    },

    pl: {
      meta: {
        title: 'Velora Motors — salon samochodów premium i custom',
        description: 'Salon Velora Motors: nowe i używane samochody ze sprawdzoną historią, projekty custom i własny serwis.'
      },
      top: {
        hours: 'Pn–Sb 09:00–20:00, Nd 10:00–17:00',
        address: 'Kijów, ul. Berezowa 14',
        phone: '+380 44 123 45 **'
      },
      nav: {
        showcase: 'Nowości',
        catalog: 'Katalog',
        service: 'Serwis',
        about: 'O nas',
        contacts: 'Kontakt',
        cta: 'Umów oglądanie',
        menu: 'Menu',
        lang: 'Język'
      },
      hero: {
        eyebrow: 'Samochody premium i custom',
        title1: 'Velora Motors: gdzie precyzyjna',
        title2: 'inżynieria spotyka',
        title3: 'luksus jazdy',
        lead: 'Ponad 300 sprawdzonych samochodów, własne projekty custom i serwis pełnego cyklu. Każde auto przechodzi pełną diagnostykę.',
        tabBuy: 'Kup auto',
        tabContact: 'Skontaktuj się',
        tabCustom: 'Custom',
        city: 'Miasto',
        cityAny: 'Wszystkie',
        type: 'Typ nadwozia',
        typeAny: 'Wszystkie',
        budget: 'Budżet',
        budgetAny: 'Dowolna',
        search: 'Szukaj',
        searchAria: 'Szukaj samochodu',
        stat1: 'aut w ofercie',
        stat2: 'lat na rynku',
        stat3: 'do dyspozycji codziennie',
        tagAero: 'Aerodynamika i design',
        tagInterior: 'Wnętrze premium',
        scroll: 'Przewiń w dół'
      },
      brands: { title: 'Marki, z którymi pracujemy' },
      showcase: {
        eyebrow: 'Trzy historie',
        title: 'Nowości i projekty custom',
        lead: 'Wideo prosto z naszego salonu: świeże dostawy i projekty zbudowane przez warsztat Velora Motors.',
        watch: 'Zobacz wideo',
        sound: 'Dźwięk',
        details: 'Szczegóły auta',
        badge1: 'Projekt custom',
        badge2: 'Tuning Stage 2',
        badge3: 'Nowa dostawa',
        i1title: 'Widebody „Emerald”',
        i1sub: 'Honda NSX · ręczna robota',
        i1text: 'Ręcznie wykonany szeroki body kit, kute złote felgi, wnętrze przeszyte w Alcantarze. Jedyny taki egzemplarz.',
        i2title: 'BMW M4 „Frozen”',
        i2sub: 'F82 Competition · Stage 2',
        i2text: 'Satynowa folia, wydech z klapami, tylne skrzydło GT i mapa Stage 2 — 620 KM na kołach.',
        i3title: 'Porsche 911 GT3 RS',
        i3sub: '991.2 · nocna jazda testowa',
        i3text: 'Wolnossąca płaska szóstka 4.0, 520 KM, torowe zawieszenie. Umów nocną jazdę po mieście.',
        specPower: 'Moc',
        specTime: '0–100 km/h',
        specStatus: 'Status',
        st1: 'Dostępny',
        st2: 'W salonie',
        st3: 'Na zamówienie'
      },
      catalog: {
        eyebrow: 'Katalog',
        title: 'Wybierz swój samochód',
        lead: 'Nowe i używane auta z przejrzystą historią: przebieg, stan, liczba właścicieli i VIN — wszystko jawnie.',
        searchPh: 'Szukaj aut',
        searchLabel: 'Szukaj w katalogu',
        clear: 'Wyczyść',
        suggestions: 'Podpowiedzi',
        filters: 'Filtry',
        done: 'Gotowe',
        filtersFound: 'Pokaż',
        brand: 'Marka',
        brandAny: 'Wszystkie',
        body: 'Nadwozie',
        bodyAny: 'Wszystkie',
        fuel: 'Paliwo',
        fuelAny: 'Wszystkie',
        gearbox: 'Skrzynia',
        gearboxAny: 'Wszystkie',
        drive: 'Napęd',
        driveAny: 'Wszystkie',
        condition: 'Stan',
        conditionAny: 'Wszystkie',
        priceFrom: 'Cena od',
        priceTo: 'Cena do',
        yearFrom: 'Rok od',
        mileageTo: 'Przebieg do',
        sort: 'Sortowanie',
        sortNew: 'Najnowsze ogłoszenia',
        sortCheap: 'Cena: rosnąco',
        sortExpensive: 'Cena: malejąco',
        sortMileage: 'Najmniejszy przebieg',
        sortYear: 'Najnowszy rocznik',
        sortPower: 'Najmocniejsze',
        reset: 'Wyczyść wszystko',
        found: 'Znaleziono',
        cars: 'aut',
        showing: 'Pokazano',
        of: 'z',
        showMore: 'Pokaż więcej',
        collapse: 'Zwiń katalog',
        empty: 'Nic nie pasuje do wyszukiwania',
        emptyHint: 'Spróbuj zmienić filtry lub zresetować wyszukiwanie.',
        details: 'Szczegóły',
        fav: 'Do ulubionych',
        favOnly: 'Ulubione',
        favEmpty: 'Ulubione są puste',
        favEmptyHint: 'Kliknij serduszko na karcie auta, aby je tu zapisać.',
        favAdded: 'Dodano do ulubionych',
        favRemoved: 'Usunięto z ulubionych',
        km: 'km',
        hp: 'KM',
        owners: 'właścicieli',
        owner1: 'właściciel',
        vin: 'VIN',
        year: 'Rok',
        mileage: 'Przebieg',
        engine: 'Silnik',
        location: 'Lokalizacja',
        state: 'Stan techniczny',
        priceLabel: 'Cena',
        callback: 'Zamów rozmowę',
        testDrive: 'Jazda próbna',
        specs: 'Dane techniczne',
        features: 'Wyposażenie',
        description: 'Opis',
        credit: 'Rata od',
        perMonth: '/mies'
      },
      cond: { new: 'Nowy', used: 'Używany' },
      state: { perfect: 'Idealny', excellent: 'Bardzo dobry', good: 'Dobry' },
      body: {
        sedan: 'Sedan', suv: 'SUV', crossover: 'Crossover', coupe: 'Coupé',
        hatchback: 'Hatchback', wagon: 'Kombi', convertible: 'Kabriolet'
      },
      fuel: { petrol: 'Benzyna', diesel: 'Diesel', hybrid: 'Hybryda', electric: 'Elektryk' },
      gearbox: { auto: 'Automat', manual: 'Manual', robot: 'Dwusprzęgłowa', cvt: 'CVT' },
      drive: { fwd: 'Przedni', rwd: 'Tylny', awd: '4x4' },
      color: {
        white: 'Biały', black: 'Czarny', silver: 'Srebrny', grey: 'Szary', blue: 'Niebieski',
        red: 'Czerwony', green: 'Zielony', yellow: 'Żółty', brown: 'Brązowy', beige: 'Beżowy'
      },
      city: {
        kyiv: 'Kijów', lviv: 'Lwów', odesa: 'Odessa', dnipro: 'Dniepr',
        kharkiv: 'Charków', 'ivano-frankivsk': 'Iwano-Frankiwsk'
      },
      feat: {
        warranty: 'Gwarancja salonu', serviceBook: 'Książka serwisowa', noAccident: 'Bezwypadkowy',
        customs: 'Oclony', leasing: 'Leasing', tradeIn: 'Trade-in', firstOwner: 'Pierwszy właściciel',
        panoramic: 'Dach panoramiczny', matrixLed: 'Światła matrycowe', adaptiveCruise: 'Tempomat adaptacyjny',
        heatedSeats: 'Podgrzewane fotele', camera360: 'Kamera 360°'
      },
      badge: { hit: 'Bestseller', new: 'Nowy', custom: 'Custom' },
      sto: {
        eyebrow: 'Własny serwis',
        title: 'Serwis, który utrzymuje auto jak nowe',
        lead: 'Trzy stanowiska, oryginalne części, diagnostyka komputerowa i 12 miesięcy gwarancji na każdą usługę.',
        s1t: 'Pełna diagnostyka',
        s1d: 'Kontrola nadwozia, zawieszenia, elektroniki i grubości lakieru przed zakupem.',
        s2t: 'Przeglądy okresowe',
        s2d: 'Serwis zgodny z planem, oryginalne oleje i filtry, każda marka.',
        s3t: 'Naprawa silnika i skrzyni',
        s3d: 'Remonty, wymiana łańcucha rozrządu, serwis automatów i skrzyń dwusprzęgłowych.',
        s4t: 'Blacharnia i lakiernia',
        s4d: 'Lakierowanie punktowe, polerowanie, folie PPF i powłoki ceramiczne.',
        s5t: 'Tuning i custom',
        s5d: 'Body kity, chiptuning, układy wydechowe, felgi i wnętrza na zamówienie.',
        s6t: 'Opony i geometria',
        s6d: 'Wyważanie, sezonowe przechowywanie opon, geometria 3D.',
        from: 'od',
        book: 'Umów serwis',
        other: 'Inne — opiszę problem',
        otherHint: 'Opisz, co się stało z autem',
        formTitle: 'Zapis do serwisu',
        formLead: 'Zostaw kontakt — mechanik oddzwoni w 15 minut i dobierze dogodny termin.',
        fName: 'Imię',
        fPhone: 'Telefon',
        fCar: 'Auto (marka, model, rok)',
        fService: 'Usługa',
        fComment: 'Komentarz',
        submit: 'Umów wizytę',
        ok: 'Dziękujemy! Zadzwonimy wkrótce.',
        okTitle: 'Zgłoszenie wysłane',
        okDone: 'Gotowe',
        err: 'Podaj imię i telefon.'
      },
      about: {
        eyebrow: 'Dlaczego Velora Motors',
        title: 'Złoty środek rynku',
        lead: 'Połączyliśmy przejrzystość europejskich dealerów z tempem lokalnego rynku.',
        a1t: 'Sprawdzona historia',
        a1d: 'Każde auto sprawdzone w bazach, VIN jawny, raport przed podpisaniem umowy.',
        a2t: 'Trade-in i finansowanie',
        a2d: 'Trade-in w 40 minut, kredyt od 0,01% i leasing dla firm.',
        a3t: 'Gwarancja 12 miesięcy',
        a3d: 'Na silnik i skrzynię. Serwis u nas z rabatem 20%.',
        a4t: 'Dostawa w całym kraju',
        a4d: 'Dowieziemy auto do Twojego miasta lawetą lub własnym kierowcą.',
        y1: 'lat doświadczenia',
        y2: 'sprzedanych aut',
        y3: 'opinii 5★',
        y4: 'projektów custom'
      },
      cta: {
        title: 'Sprzedaj swoje auto w jeden dzień',
        lead: 'Bezpłatna wycena, odkup w cenie rynkowej lub sprzedaż komisowa z naszej ekspozycji.',
        button: 'Wyceń auto',
        secondary: 'Zadzwoń'
      },
      modal: {
        close: 'Zamknij',
        request: 'Zostaw zgłoszenie',
        name: 'Imię',
        phone: 'Telefon',
        send: 'Wyślij',
        sent: 'Zgłoszenie przyjęte! Menedżer się skontaktuje.',
        share: 'Udostępnij',
        copied: 'Link skopiowany'
      },
      footer: {
        about: 'Salon pełnego cyklu: sprzedaż nowych i używanych aut, projekty custom, własny serwis i sprowadzanie aut pod klucz.',
        nav: 'Nawigacja',
        services: 'Usługi',
        contacts: 'Kontakt',
        srv1: 'Sprzedaż aut',
        srv2: 'Trade-in i odkup',
        srv4: 'Obsługa serwisowa',
        srv5: 'Custom i tuning',
        showroom: 'Salon',
        service: 'Serwis',
        addressShowroom: 'Kijów, ul. Berezowa 14',
        addressService: 'Kijów, ul. Przemysłowa 7',
        hoursTitle: 'Godziny otwarcia',
        hours1: 'Pn–Sb: 09:00–20:00',
        hours2: 'Nd: 10:00–17:00',
        social: 'Social media',
        newsletter: 'Nowości i dostawy',
        emailPh: 'Twój e-mail',
        subscribe: 'Zapisz się',
        subscribed: 'Dziękujemy za zapis!',
        rights: '© 2026 Velora Motors. Wszelkie prawa zastrzeżone.',
        privacy: 'Polityka prywatności',
        terms: 'Regulamin',
        admin: 'Panel administratora',
        credits: 'Zdjęcia aut — Wikimedia Commons.'
      },
      admin: {
        title: 'Panel administratora Velora Motors',
        login: 'Logowanie',
        password: 'Hasło',
        enter: 'Wejdź',
        wrong: 'Błędne hasło',
        hint: 'Hasło demo: admin',
        logout: 'Wyloguj',
        add: 'Dodaj auto',
        edit: 'Edytuj',
        delete: 'Usuń',
        save: 'Zapisz',
        cancel: 'Anuluj',
        confirmDelete: 'Usunąć to auto z katalogu?',
        saved: 'Zapisano',
        deleted: 'Usunięto',
        list: 'Auta w katalogu',
        search: 'Szukaj w katalogu',
        export: 'Eksport JSON',
        import: 'Import JSON',
        reset: 'Przywróć dane fabryczne',
        resetConfirm: 'Przywrócić pierwotny katalog? Twoje zmiany zostaną utracone.',
        image: 'Zdjęcie (plik lub ścieżka)',
        imageHint: 'Wybierz plik z komputera albo podaj ścieżkę/URL',
        required: 'Uzupełnij pola wymagane: marka, model, rok, cena.',
        storageServer: 'Dane zapisywane na serwerze (data/cars.json)',
        storageLocal: 'Dane zapisywane lokalnie w przeglądarce',
        total: 'Aut łącznie',
        photos: 'Zdjęcia auta',
        photosHint: 'Wybierz kilka plików lub wpisz ścieżki — po jednej w wierszu. Pierwsze zdjęcie jest główne.',
        mainPhoto: 'główne'
      },
      common: { yes: 'Tak', no: 'Nie', all: 'Wszystkie', currency: '$' }
    }
  };

  /* ---- доповнення: окремі сторінки, галерея, демо-контакти ---- */
  const EXTRA = {
    ua: {
      nav: { home: 'Головна' },
      about: {
        story1: 'Velora Motors починалася 2014 року з невеликого майданчика на десять автомобілів. Сьогодні це шоурум у центрі Києва, власне СТО на три пости й майстерня кастомних збірок.',
        story2: 'Ми беремо на продаж лише ті авто, які самі перевірили: кузов, підвіска, електроніка, історія по базах. Якщо машина нам не подобається — вона не потрапляє у вітрину.',
        story3: 'Продаємо нові та вживані авто, робимо trade-in за 40 хвилин, підбираємо машину під ключ і обслуговуємо її після покупки — усе в одному місці.'
      },
      clip: {
        more: 'Більше про це авто',
        specs: 'Що зробили',
        ask: 'Запитати про авто',
        i1long: 'Проєкт зайняв пʼять місяців. Кузов розширили вручну: арки, пороги й задній дифузор виготовили зі скловолокна, підігнали по місцю та пофарбували в смарагдовий металік. Салон перешили в Alcantara з контрастною ниткою, поставили ковші й каркас. Мотор лишили атмосферним, але з новим впуском і вихлопом — 610 к.с. на стенді.',
        i2long: 'BMW M4 у сатиновій плівці Frozen Grey. Двигун S55 отримав прошивку Stage 2, інтеркулер збільшеного обʼєму й вихлоп із клапанами — 620 к.с. на колесах. Підвіска на койловерах KW, гоночне антикрило й ковані диски 20 дюймів. Авто на ходу, можна подивитись у шоурумі.',
        i3long: 'Porsche 911 GT3 RS покоління 991.2 з атмосферною шісткою 4.0 і 520 к.с. Трекова підвіска, керамічні гальма, каркас безпеки. Машина обслуговується в нашому СТО, є повна історія. Нічний тест-драйв містом — за попереднім записом.'
      },
      evaluate: {
        title: 'Оцінка вашого авто',
        lead: 'Залиште контакти й додайте фото або відео авто — оцінимо його ринкову вартість і зателефонуємо протягом дня.',
        name: 'Ваше імʼя',
        phone: 'Телефон',
        car: 'Авто (марка, модель, рік, пробіг)',
        comment: 'Що варто знати про авто',
        files: 'Фото або відео авто',
        filesHint: 'Можна кілька файлів — загальний вигляд, салон, документи',
        chosen: 'обрано файлів',
        submit: 'Отримати оцінку',
        ok: 'Дякуємо! Ми передзвонимо та назвемо ціну.'
      },
      testDrive: {
        title: 'Записатися на тест-драйв',
        hint: 'Залиште імʼя та номер — менеджер передзвонить і підбере зручний час.',
        phonePh: '+380 __ ___ __ __'
      },
      meta: {
        catalog: 'Каталог авто — Velora Motors',
        showcase: 'Новинки та кастом — Velora Motors',
        service: 'СТО — Velora Motors',
        about: 'Про нас — Velora Motors',
        contacts: 'Контакти — Velora Motors',
        car: 'Автомобіль — Velora Motors'
      },
      page: {
        home: 'Головна',
        backHome: 'На головну',
        backCatalog: 'Назад до каталогу',
        close: 'Закрити',
        next: 'Наступне фото',
        prev: 'Попереднє фото',
        photo: 'Фото',
        similar: 'Схожі автомобілі',
        catalogLead: 'Повний список автомобілів у наявності: фільтри, пошук і чесні характеристики кожного авто.',
        showcaseLead: 'Три коротких ролики з шоуруму: свіжі надходження та кастомні збірки майстерні Velora.',
        serviceLead: 'Власне СТО: діагностика, ремонт, кузовний цех і тюнінг. Гарантія на всі роботи 12 місяців.',
        aboutLead: 'Хто ми, як працюємо і чому нам довіряють понад 4000 клієнтів.',
        contactsLead: 'Шоурум, СТО, месенджери та форма зв’язку. Відповідаємо протягом 15 хвилин.',
        watchClip: 'Дивитись ролик',
        clipHint: 'Ролик грає сам, без керування'
      },
      demo: {
        badge: 'Демо-проєкт',
        note: 'Це демонстраційний сайт для портфоліо — контакти, адреси та соцмережі вигадані.',
        phone: 'Це тестовий номер — дзвінок нікуди не піде, сайт зроблено для портфоліо.',
        email: 'Тестова адреса пошти: лист нікуди не надійде.',
        map: 'Адреса вигадана — карта тут лише для прикладу.',
        social: 'Тестове посилання на соцмережу: такої сторінки не існує.',
        form: 'Форма демонстраційна — дані нікуди не надсилаються.'
      },
      contacts: {
        title: 'Зв’яжіться з нами',
        showroomTitle: 'Шоурум',
        serviceTitle: 'СТО',
        phoneTitle: 'Телефон',
        emailTitle: 'Пошта',
        hoursTitle: 'Графік роботи',
        socialTitle: 'Месенджери та соцмережі',
        mapTitle: 'Як нас знайти',
        mapHint: 'Демонстраційна карта',
        formTitle: 'Написати нам',
        formLead: 'Залиште запит — менеджер відповість протягом 15 хвилин у робочий час.',
        message: 'Повідомлення',
        send: 'Надіслати',
        sent: 'Дякуємо! Це демо-форма, тому повідомлення нікуди не пішло.',
        req: 'Реквізити',
        reqText: 'ТОВ «Велора Моторс» (демо) · ЄДРПОУ 00 000 000 · дані вигадані'
      }
    },

    en: {
      nav: { home: 'Home' },
      about: {
        story1: 'Velora Motors started in 2014 with a small lot for ten cars. Today it is a showroom in central Kyiv, our own three-bay workshop and a custom build shop.',
        story2: 'We only list cars we have checked ourselves: body, suspension, electronics and database history. If a car does not convince us, it never reaches the floor.',
        story3: 'We sell new and used cars, do trade-in within 40 minutes, source cars to order and service them afterwards — all in one place.'
      },
      clip: {
        more: 'More about this car',
        specs: 'What was done',
        ask: 'Ask about this car',
        i1long: 'The project took five months. The widebody was made by hand: arches, sills and the rear diffuser were shaped in fibreglass, fitted in place and painted emerald metallic. The cabin was re-trimmed in Alcantara with contrast stitching, with bucket seats and a roll cage. The engine stays naturally aspirated but gains a new intake and exhaust — 610 hp on the dyno.',
        i2long: 'BMW M4 in a Frozen Grey satin wrap. The S55 engine has a Stage 2 remap, a larger intercooler and a valved exhaust — 620 hp at the wheels. KW coilovers, a GT wing and 20-inch forged wheels. The car is road-ready and can be seen in the showroom.',
        i3long: 'A 991.2 Porsche 911 GT3 RS with the naturally aspirated 4.0 flat-six and 520 hp. Track suspension, ceramic brakes, roll cage. The car is serviced at our workshop and has a full history. Night test drives through the city by appointment.'
      },
      evaluate: {
        title: 'Value your car',
        lead: 'Leave your details and add photos or a video of the car — we will estimate its market price and call you back the same day.',
        name: 'Your name',
        phone: 'Phone',
        car: 'Car (make, model, year, mileage)',
        comment: 'Anything we should know',
        files: 'Photos or video of the car',
        filesHint: 'Several files are fine — exterior, interior, documents',
        chosen: 'files selected',
        submit: 'Get a valuation',
        ok: 'Thank you! We will call you back with a valuation.'
      },
      testDrive: {
        title: 'Book a test drive',
        hint: 'Leave your name and number — a manager will call and pick a convenient time.',
        phonePh: '+380 __ ___ __ __'
      },
      meta: {
        catalog: 'Car catalogue — Velora Motors',
        showcase: 'New arrivals & custom — Velora Motors',
        service: 'Service centre — Velora Motors',
        about: 'About us — Velora Motors',
        contacts: 'Contacts — Velora Motors',
        car: 'Car — Velora Motors'
      },
      page: {
        home: 'Home',
        backHome: 'Back to home',
        backCatalog: 'Back to catalogue',
        close: 'Close',
        next: 'Next photo',
        prev: 'Previous photo',
        photo: 'Photo',
        similar: 'Similar cars',
        catalogLead: 'The full list of cars in stock: filters, search and honest specifications for every car.',
        showcaseLead: 'Three short clips from the showroom: fresh arrivals and custom builds by the Velora workshop.',
        serviceLead: 'Our own workshop: diagnostics, repairs, body shop and tuning. 12-month guarantee on every job.',
        aboutLead: 'Who we are, how we work and why more than 4,000 customers trust us.',
        contactsLead: 'Showroom, workshop, messengers and a contact form. We reply within 15 minutes.',
        watchClip: 'Watch the clip',
        clipHint: 'The clip plays on its own, without controls'
      },
      demo: {
        badge: 'Demo project',
        note: 'This is a portfolio demo site — contacts, addresses and social links are fictional.',
        phone: 'This is a test number — the call goes nowhere, the site is a portfolio piece.',
        email: 'Test e-mail address: no message will be delivered.',
        map: 'The address is fictional — the map is here only as an example.',
        social: 'Test social link: this page does not exist.',
        form: 'The form is a demo — nothing is actually submitted.'
      },
      contacts: {
        title: 'Get in touch',
        showroomTitle: 'Showroom',
        serviceTitle: 'Workshop',
        phoneTitle: 'Phone',
        emailTitle: 'E-mail',
        hoursTitle: 'Opening hours',
        socialTitle: 'Messengers & social',
        mapTitle: 'How to find us',
        mapHint: 'Demonstration map',
        formTitle: 'Write to us',
        formLead: 'Leave a request — a manager will reply within 15 minutes during working hours.',
        message: 'Message',
        send: 'Send',
        sent: 'Thank you! This is a demo form, so nothing was actually sent.',
        req: 'Company details',
        reqText: 'Velora Motors LLC (demo) · Reg. no. 00 000 000 · sample data'
      }
    },

    pl: {
      nav: { home: 'Główna' },
      about: {
        story1: 'Velora Motors zaczynała w 2014 roku od małego placu na dziesięć aut. Dziś to salon w centrum Kijowa, własny serwis na trzy stanowiska i warsztat projektów custom.',
        story2: 'Wystawiamy tylko te auta, które sami sprawdziliśmy: nadwozie, zawieszenie, elektronika i historia w bazach. Jeśli auto nas nie przekona, nie trafia na ekspozycję.',
        story3: 'Sprzedajemy nowe i używane auta, robimy trade-in w 40 minut, sprowadzamy auta pod klucz i serwisujemy je później — wszystko w jednym miejscu.'
      },
      clip: {
        more: 'Więcej o tym aucie',
        specs: 'Co zrobiliśmy',
        ask: 'Zapytaj o to auto',
        i1long: 'Projekt zajął pięć miesięcy. Szerokie nadwozie powstało ręcznie: nadkola, progi i tylny dyfuzor wykonano z laminatu, dopasowano i polakierowano na szmaragdowy metalik. Wnętrze przeszyto w Alcantarze z kontrastową nicią, dołożono fotele kubełkowe i klatkę. Silnik pozostał wolnossący, ale z nowym dolotem i wydechem — 610 KM na hamowni.',
        i2long: 'BMW M4 w satynowej folii Frozen Grey. Silnik S55 dostał mapę Stage 2, większą chłodnicę powietrza i wydech z klapami — 620 KM na kołach. Zawieszenie KW, skrzydło GT i kute 20-calowe felgi. Auto jeździ i można je obejrzeć w salonie.',
        i3long: 'Porsche 911 GT3 RS generacji 991.2 z wolnossącą szóstką 4.0 i mocą 520 KM. Torowe zawieszenie, hamulce ceramiczne, klatka bezpieczeństwa. Auto serwisowane u nas, z pełną historią. Nocna jazda próbna po mieście po wcześniejszym umówieniu.'
      },
      evaluate: {
        title: 'Wycena Twojego auta',
        lead: 'Zostaw kontakt i dodaj zdjęcia lub wideo auta — wycenimy je i oddzwonimy tego samego dnia.',
        name: 'Imię',
        phone: 'Telefon',
        car: 'Auto (marka, model, rok, przebieg)',
        comment: 'Co warto wiedzieć o aucie',
        files: 'Zdjęcia lub wideo auta',
        filesHint: 'Może być kilka plików — auto z zewnątrz, wnętrze, dokumenty',
        chosen: 'wybrano plików',
        submit: 'Poproś o wycenę',
        ok: 'Dziękujemy! Oddzwonimy z wyceną.'
      },
      testDrive: {
        title: 'Umów jazdę próbną',
        hint: 'Zostaw imię i numer — menedżer oddzwoni i dobierze dogodny termin.',
        phonePh: '+380 __ ___ __ __'
      },
      meta: {
        catalog: 'Katalog aut — Velora Motors',
        showcase: 'Nowości i custom — Velora Motors',
        service: 'Serwis — Velora Motors',
        about: 'O nas — Velora Motors',
        contacts: 'Kontakt — Velora Motors',
        car: 'Samochód — Velora Motors'
      },
      page: {
        home: 'Główna',
        backHome: 'Na stronę główną',
        backCatalog: 'Wróć do katalogu',
        close: 'Zamknij',
        next: 'Następne zdjęcie',
        prev: 'Poprzednie zdjęcie',
        photo: 'Zdjęcie',
        similar: 'Podobne samochody',
        catalogLead: 'Pełna lista aut dostępnych od ręki: filtry, wyszukiwarka i uczciwe dane każdego auta.',
        showcaseLead: 'Trzy krótkie klipy z salonu: świeże dostawy i projekty custom warsztatu Velora.',
        serviceLead: 'Własny serwis: diagnostyka, naprawy, blacharnia i tuning. 12 miesięcy gwarancji na usługi.',
        aboutLead: 'Kim jesteśmy, jak pracujemy i dlaczego ufa nam ponad 4000 klientów.',
        contactsLead: 'Salon, serwis, komunikatory i formularz kontaktowy. Odpowiadamy w 15 minut.',
        watchClip: 'Zobacz klip',
        clipHint: 'Klip odtwarza się sam, bez sterowania'
      },
      demo: {
        badge: 'Projekt demo',
        note: 'To demonstracyjna strona do portfolio — kontakty, adresy i social media są fikcyjne.',
        phone: 'To numer testowy — połączenie nigdzie nie trafi, strona powstała do portfolio.',
        email: 'Testowy adres e-mail: wiadomość nie zostanie dostarczona.',
        map: 'Adres jest fikcyjny — mapa służy tylko jako przykład.',
        social: 'Testowy link do social media: taka strona nie istnieje.',
        form: 'Formularz jest demonstracyjny — nic nie zostaje wysłane.'
      },
      contacts: {
        title: 'Skontaktuj się z nami',
        showroomTitle: 'Salon',
        serviceTitle: 'Serwis',
        phoneTitle: 'Telefon',
        emailTitle: 'E-mail',
        hoursTitle: 'Godziny otwarcia',
        socialTitle: 'Komunikatory i social media',
        mapTitle: 'Jak nas znaleźć',
        mapHint: 'Mapa demonstracyjna',
        formTitle: 'Napisz do nas',
        formLead: 'Zostaw zapytanie — menedżer odpowie w 15 minut w godzinach pracy.',
        message: 'Wiadomość',
        send: 'Wyślij',
        sent: 'Dziękujemy! To formularz demo, więc nic nie zostało wysłane.',
        req: 'Dane firmy',
        reqText: 'Velora Motors sp. z o.o. (demo) · KRS 00 000 000 · dane przykładowe'
      }
    }
  };

  /** Глибоке злиття доповнень у основний словник. */
  (function mergeExtra() {
    Object.keys(EXTRA).forEach(function (lang) {
      Object.keys(EXTRA[lang]).forEach(function (group) {
        DICT[lang][group] = Object.assign({}, DICT[lang][group], EXTRA[lang][group]);
      });
    });
  })();

  // Англійська — мова сайту за замовчуванням; інші доступні через перемикач.
  const LANGS = [
    { code: 'en', label: 'EN', full: 'English', htmlLang: 'en' },
    { code: 'ua', label: 'UA', full: 'Ukrainian', htmlLang: 'uk' },
    { code: 'pl', label: 'PL', full: 'Polish', htmlLang: 'pl' }
  ];

  const DEFAULT_LANG = 'en';
  const STORE_KEY = 'velora.lang.v2';
  let current = DEFAULT_LANG;

  function detect() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && DICT[saved]) return saved;
    return DEFAULT_LANG;
  }

  function get(lang, path) {
    return path.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), DICT[lang]);
  }

  /** Переклад за ключем, з відкатом на англійську. */
  function t(path) {
    const value = get(current, path);
    if (value != null) return value;
    const fallback = get(DEFAULT_LANG, path);
    return fallback != null ? fallback : path;
  }

  /** Переклад конкретною мовою (потрібен для мультимовного пошуку). */
  function tIn(lang, path) {
    const value = get(lang, path);
    if (value != null) return value;
    const fallback = get(DEFAULT_LANG, path);
    return fallback != null ? fallback : path;
  }

  function setLang(lang) {
    if (!DICT[lang]) return;
    current = lang;
    localStorage.setItem(STORE_KEY, lang);
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.lang = meta ? meta.htmlLang : lang;
    applyDom();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /** Проставляє переклади на всі елементи з data-i18n*. */
  function applyDom(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    const title = document.querySelector('title[data-i18n-doc]');
    if (title) title.textContent = t(title.getAttribute('data-i18n-doc'));
    const desc = document.querySelector('meta[name="description"][data-i18n-doc]');
    if (desc) desc.setAttribute('content', t(desc.getAttribute('data-i18n-doc')));
  }

  global.I18N = {
    langs: LANGS,
    t,
    tIn,
    setLang,
    applyDom,
    get lang() { return current; },
    init() {
      current = detect();
      const meta = LANGS.find((l) => l.code === current);
      document.documentElement.lang = meta ? meta.htmlLang : current;
      return current;
    }
  };
})(window);
