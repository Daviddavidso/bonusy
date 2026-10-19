/* ==========================================================================
   СХЕМА САЙТА «БОНУСЫ» ДЛЯ ЯДРА ПАНЕЛИ (panel-core.js).

   Ядро одинаковое во всех витринах и про формат data.js ничего не знает.
   Здесь сказано только: какие у карточки поля и как разложить общий вид
   обратно в файл, который читает сайт: SITE / CATEGORIES / OFFERS.

   Особенности этого сайта:
     * раздел ровно один и на сайте не виден, поэтому singleGroup: true —
       панель не даёт добавлять, переставлять и удалять разделы;
     * в записях OFFERS нет поля «раздел» — в файл оно не пишется;
     * логотипов нет: в карточке квадратная плашка с буквами (поле mark),
       цвет всей карточки выбирается из готовых тем (поле theme).
   ========================================================================== */

window.ADMIN = {
  brand: 'Бонусы',
  dataFile: 'data.js',
  draftKey: 'bonusy_admin_draft',
  preview: 'index.html?draft=1',

  /* Маркировки erid в ссылках казино нет — панель про неё молчит. */
  requireErid: false,

  /* Блока «Логотип» нет: плашка с буквами и цвет темы — поля карточки. */
  logo: false,

  /* Один раздел: без кнопок «Добавить/Удалить/Переместить раздел» и без
     выбора раздела в карточке. */
  singleGroup: true,

  /* Фон карточки на сайте. Ядру нужен только для проверки контраста
     цветной плашки логотипа, а её тут нет — строка на будущее. */
  surface: '#101725',

  /* Тексты сайта. Порядок полей = порядок в панели. Лишние ключи SITE,
     которых нет в этом списке, сохраняются как есть. */
  site: [
    { key: 'pageTitle', label: 'Заголовок вкладки браузера', required: true,
      hint: 'Его видно на вкладке и в поиске, например «Эксклюзивные бонусы и промокоды».' },
    { key: 'badge',     label: 'Плашка над заголовком',
      hint: 'Мелкая строка с зелёной точкой, например «Актуальные бонусы • Прямые ссылки». Пусто — плашки не будет.' },
    { key: 'heading',   label: 'Заголовок, белая часть', required: true,
      hint: 'Первая строка крупного заголовка, например «Эксклюзивные бонусы».' },
    { key: 'accent',    label: 'Заголовок, золотая часть',
      hint: 'Вторая строка заголовка, золотым градиентом, например «официальных партнеров».' },
    { key: 'lead',      label: 'Текст под заголовком', textarea: true,
      hint: 'Одно-два предложения серым текстом. Пусто — строки не будет.' },
    { key: 'cta',       label: 'Надпись на кнопках', required: true,
      hint: 'Одна на все карточки, например «Получить бонус».' },
    { key: 'trust1',    label: 'Строка внизу с зелёным щитом',
      hint: 'Например «Безопасное соединение». Пусто — пункта не будет.' },
    { key: 'trust2',    label: 'Строка внизу с жёлтой молнией',
      hint: 'Например «Мгновенная активация бонуса». Пусто — пункта не будет.' },
    { key: 'footer',    label: 'Подвал',
      hint: 'Самая нижняя строка, например «© 2026 Все права защищены.»' },
    { key: 'legal',     label: 'Предупреждение 18+', textarea: true,
      hint: 'Мелкая строка под подвалом. Советуем не удалять: возрастная пометка нужна в рекламе азартных игр.' }
  ],

  /* У единственного раздела подписей нет — на сайте его не видно. */
  groups: [],

  card: [
    { key: 'name',  label: 'Название', required: true,
      hint: 'Крупно в карточке, например «Lucky Bear».' },
    { key: 'mark',  label: 'Буквы на плашке',
      hint: '1–3 буквы на цветном квадрате слева, например «LB». Пусто — возьмутся первые буквы названия.' },
    { key: 'theme', label: 'Цвет карточки', type: 'select', 'default': 'amber',
      hint: 'Цвет плашки, кнопки, промокода и подсветки. Все цвета подобраны так, чтобы текст хорошо читался.',
      options: [
        { value: 'amber',   label: 'Золотой' },
        { value: 'cyan',    label: 'Бирюзовый' },
        { value: 'emerald', label: 'Изумрудный' },
        { value: 'purple',  label: 'Фиолетовый' },
        { value: 'rose',    label: 'Розовый' },
        { value: 'orange',  label: 'Оранжевый' },
        { value: 'blue',    label: 'Синий' },
        { value: 'lime',    label: 'Салатовый' }
      ] },
    { key: 'tag',   label: 'Плашка рядом с названием',
      hint: 'Короткое слово: «ТОП», «ХИТ», «TELEGRAM». Пусто — плашки не будет.' },
    { key: 'rating', label: 'Оценка',
      hint: 'Число от 1 до 5 с точкой, например 4.9. Рядом всегда пять звёзд. Пусто — без звёзд.' },
    { key: 'note',  label: 'Подпись после оценки',
      hint: 'Например «Популярное», «Быстрый старт».' },
    { key: 'factLabel', label: 'Справа сверху: подпись',
      hint: 'Серая строка в правом углу, например «Выплаты». Пусто вместе со значением — угол пустой.' },
    { key: 'factValue', label: 'Справа сверху: значение',
      hint: 'Цветная строка под подписью, например «Мгновенно».' },
    { key: 'factTone', label: 'Цвет значения справа', type: 'select', 'default': '',
      hint: 'В цвет карточки или зелёный — как «Мгновенно» у Lucky Bear.',
      options: [
        { value: '',      label: 'Как у карточки' },
        { value: 'green', label: 'Зелёный' }
      ] },
    { key: 'bonusTitle', label: 'Заголовок блока бонуса',
      hint: 'Мелкие буквы над бонусом, например «Приветственный бонус».' },
    { key: 'bonusBadge', label: 'Метка в блоке бонуса',
      hint: 'Короткое слово справа: «New», «Hot», «VIP». Пусто — без метки.' },
    { key: 'bonus', label: 'Бонус', required: true, type: 'textarea',
      hint: 'Крупный текст, например «Бонус к пополнению + до 200 FS». Цифры ставьте те, что даёт ваша партнёрка.' },
    { key: 'promo', label: 'Промокод',
      hint: 'Например MEGAFS250. Рядом появится кнопка «Копировать». Пусто — блока с промокодом не будет.' },
    { key: 'url',   label: 'Партнёрская ссылка', type: 'url',
      hint: 'Ссылка из партнёрки целиком, вместе с метками. Пока поле пусто, вместо кнопки в карточке надпись «Ссылка скоро».' }
  ],

  /* ---------------------------------------------- чтение --------------- */

  load: function () {
    function str(v) { return v == null ? '' : String(v); }
    function extraOf(obj, known) {
      var x = {};
      Object.keys(obj).forEach(function (k) { if (known.indexOf(k) === -1) x[k] = obj[k]; });
      return x;
    }

    var cats = (typeof CATEGORIES !== 'undefined' && CATEGORIES && CATEGORIES.length)
      ? CATEGORIES : [{ id: 'bonus', label: 'Карточки бонусов' }];
    var first = cats[0];
    var groups = [{
      key: str(first.id) || 'bonus',
      title: str(first.label) || 'Карточки бонусов',
      extra: extraOf(first, ['id', 'label'])
    }];

    var KEYS = ['name', 'mark', 'theme', 'tag', 'rating', 'note', 'factLabel', 'factValue', 'factTone',
                'bonusTitle', 'bonusBadge', 'bonus', 'promo', 'url'];

    var seen = {};
    var list = (typeof OFFERS !== 'undefined' && OFFERS) ? OFFERS : [];
    var cards = list.map(function (o, i) {
      /* Устойчивый ключ: в файле его нет, а ядру он нужен, чтобы не путать
         карточки при перестановке. Считаем от названия. */
      var base = str(o.name).toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || ('c' + i);
      var uid = base, n = 2;
      while (seen[uid]) uid = base + '-' + (n++);
      seen[uid] = true;

      var card = { uid: uid, group: groups[0].key, hidden: !!o.hidden };
      KEYS.forEach(function (k) { card[k] = str(o[k]); });
      if (!card.theme) card.theme = 'amber';
      /* Ключи, которых панель не знает (допишут руками), не теряются. */
      card.extra = extraOf(o, KEYS.concat(['hidden']));
      return card;
    });

    return {
      SITE: JSON.parse(JSON.stringify(typeof SITE !== 'undefined' ? SITE : {})),
      GROUPS: groups,
      CARDS: cards
    };
  },

  /* ---------------------------------------------- сборка файла --------- */

  build: function (m) {
    function t(v) { return String(v == null ? '' : v).trim(); }
    function q(v) { return JSON.stringify(v); }
    function nested(v, pad) { return JSON.stringify(v, null, 2).replace(/\n/g, '\n' + pad); }

    var site = {};
    Object.keys(m.SITE || {}).forEach(function (k) {
      var v = m.SITE[k];
      site[k] = typeof v === 'string' ? v.trim() : v;
    });

    var g = (m.GROUPS && m.GROUPS[0]) || { key: 'bonus', title: 'Карточки бонусов' };
    var category = { id: g.key, label: t(g.title) || 'Карточки бонусов' };
    Object.keys(g.extra || {}).forEach(function (k) { category[k] = g.extra[k]; });

    var items = m.CARDS.map(function (c) {
      var pad = '    ';
      var rows = [
        pad + '"name": '       + q(t(c.name)),
        pad + '"mark": '       + q(t(c.mark)),
        pad + '"theme": '      + q(t(c.theme) || 'amber'),
        pad + '"tag": '        + q(t(c.tag)),
        pad + '"rating": '     + q(t(c.rating).replace(',', '.')),
        pad + '"note": '       + q(t(c.note)),
        pad + '"factLabel": '  + q(t(c.factLabel)),
        pad + '"factValue": '  + q(t(c.factValue))
      ];
      if (t(c.factTone)) rows.push(pad + '"factTone": ' + q(t(c.factTone)));
      rows.push(
        pad + '"bonusTitle": ' + q(t(c.bonusTitle)),
        pad + '"bonusBadge": ' + q(t(c.bonusBadge)),
        pad + '"bonus": '      + q(t(c.bonus)),
        pad + '"promo": '      + q(t(c.promo)),
        pad + '"url": '        + q(t(c.url))
      );
      if (c.hidden) rows.push(pad + '"hidden": true');
      Object.keys(c.extra || {}).forEach(function (k) {
        rows.push(pad + q(k) + ': ' + nested(c.extra[k], pad));
      });
      return '  {\n' + rows.join(',\n') + '\n  }';
    });

    return [
      '/* ═════════════════════════════════════════════════════════════════════════',
      '   СОДЕРЖИМОЕ САЙТА — единственный файл с текстами и карточками бонусов.',
      '   Собран панелью ' + new Date().toLocaleString('ru-RU') + '.',
      '',
      '   Правится через panel.html (панель управления). Руками тоже можно, но при',
      '   следующем сохранении из панели правки будут перезаписаны.',
      '',
      '   SITE        — тексты страницы (плашка, заголовок, подзаголовок, низ).',
      '   CATEGORIES  — один служебный раздел, на сайте его не видно.',
      '   OFFERS      — карточки. Порядок в файле = порядок на сайте.',
      '     theme     — цвет карточки: amber, cyan, emerald, purple, rose,',
      '                 orange, blue, lime.',
      '     factTone  — green, чтобы значение справа сверху было зелёным.',
      '     promo     — промокод; пусто — блока с промокодом нет.',
      '     url       — партнёрская ссылка; пусто — вместо кнопки «Ссылка скоро».',
      '     hidden    — true, чтобы временно убрать карточку с сайта.',
      '   ═════════════════════════════════════════════════════════════════════════ */',
      '',
      'const SITE = ' + JSON.stringify(site, null, 2) + ';',
      '',
      'const CATEGORIES = [\n  ' + nested(category, '  ') + '\n];',
      '',
      'const OFFERS = [\n' + items.join(',\n') + '\n];',
      ''
    ].join('\n');
  }
};
