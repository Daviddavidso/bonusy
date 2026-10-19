/* ═══════════════════════════════════════════════════════════════════════
   Бонусы — главная: тексты и карточки из data.js (правится в panel.html),
   копирование промокодов.

   Карточка, добавленная в панели, появляется на сайте сама. Порядок
   карточек = порядок в OFFERS. На адресе index.html?draft=1 подставляется
   черновик из панели («Предпросмотр»).
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Каталог объявлен глобальными const (data.php или data.js), а const мимо
     window не переприсвоить — работаем с локальными копиями. */
  var site   = typeof SITE   !== 'undefined' ? SITE   : {};
  var offers = typeof OFFERS !== 'undefined' ? OFFERS : [];
  if (/[?&]draft/.test(location.search)) {
    try {
      var draftFile = localStorage.getItem('bonusy_admin_draft:file');
      if (draftFile) {
        var d = new Function(draftFile + '\n;return { SITE: SITE, OFFERS: OFFERS };')();
        site = d.SITE || site; offers = d.OFFERS || offers;
      }
    } catch (e) { /* битый черновик — показываем то, что на сайте */ }
  }
  offers = offers.filter(function (o) { return o && !o.hidden; });

  var THEMES = ['amber', 'cyan', 'emerald', 'purple', 'rose', 'orange', 'blue', 'lime'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function t(v) { return String(v == null ? '' : v).trim(); }
  function okLink(u) { return /^https?:\/\/[^\s]+\.[^\s]+/i.test(u || ''); }

  /* Разделитель «•» видно глазами, но вслух его не читаем. */
  function dotted(s) {
    return t(s).split('•').map(function (p) { return esc(p.trim()); })
      .filter(Boolean).join(' <span aria-hidden="true">•</span> ');
  }

  /* ── тексты страницы ──────────────────────────────────────────────── */
  if (t(site.pageTitle)) document.title = t(site.pageTitle);
  Array.prototype.forEach.call(document.querySelectorAll('[data-site]'), function (n) {
    var key = n.getAttribute('data-site');
    if (!(key in site)) return;
    var v = t(site[key]);
    if (key === 'badge') {
      if (v) n.innerHTML = dotted(v);
      n.closest('.badge').hidden = !v;
      return;
    }
    if (!v && key === 'heading') return;   // без заголовка страница без h1 — оставляем текст из html
    n.textContent = v;
    /* Пустое поле — убираем строку целиком, чтобы не висел пустой блок. */
    if (key === 'legal' || key === 'footer' || key === 'lead') n.hidden = !v;
    if (key === 'trust1' || key === 'trust2') n.closest('.trust__item').hidden = !v;
  });
  var trust = document.querySelector('.trust');
  if (trust) trust.hidden = !document.querySelector('.trust__item:not([hidden])');

  /* ── карточки ─────────────────────────────────────────────────────── */

  /* Буквы на плашке: поле mark, иначе первые буквы слов или заглавные
     внутри слова (JetTon → JT, SpinBetter → SB). */
  function initials(o) {
    var m = t(o.mark);
    if (m) return m.slice(0, 3).toUpperCase();
    var name = t(o.name);
    var words = name.split(/[\s.\-—_]+/).filter(Boolean);
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
    var caps = name.match(/[A-ZА-ЯЁ]/g);
    if (caps && caps.length > 1) return (caps[0] + caps[1]).toUpperCase();
    return name.slice(0, 2).toUpperCase() || '?';
  }

  var cta = t(site.cta) || 'Получить бонус';

  function card(o, i) {
    var id = 'o' + (i + 1);
    var name = t(o.name) || 'Без названия';
    var theme = THEMES.indexOf(t(o.theme)) !== -1 ? t(o.theme) : THEMES[i % 4];
    var rating = t(o.rating).replace(',', '.');
    var note = t(o.note);
    var promo = t(o.promo);
    var url = t(o.url);

    var ratingHTML = '';
    if (rating || note) {
      ratingHTML = '<p class="rating">' +
        (rating ? '<span class="stars" aria-hidden="true">★★★★★</span>' : '') +
        '<span class="rating__text">' +
          (rating ? '<span class="vh">Рейтинг </span>' + esc(rating) + '<span class="vh"> из 5.</span>' : '') +
          (rating && note ? '<span aria-hidden="true"> • </span>' : '') +
          esc(note) +
        '</span></p>';
    }

    var fact = (t(o.factLabel) || t(o.factValue))
      ? '<dl class="fact' + (t(o.factTone) === 'green' ? ' fact--green' : '') + '"><dt>' + esc(o.factLabel) + '</dt><dd>' + esc(o.factValue) + '</dd></dl>'
      : '';

    var bonusHead = (t(o.bonusTitle) || t(o.bonusBadge))
      ? '<p class="bonus__head"><span>' + esc(o.bonusTitle) + '</span>' +
          (t(o.bonusBadge) ? ' <span class="bonus__badge">' + esc(o.bonusBadge) + '</span>' : '') + '</p>'
      : '';

    var promoHTML = promo
      ? '<div class="promo">' +
          '<p class="promo__label">Промокод</p>' +
          '<div class="promo__box">' +
            '<span class="promo__code-wrap">' +
              '<svg class="promo__ico" aria-hidden="true" focusable="false"><use href="#i-tag"/></svg>' +
              '<span class="promo__code">' + esc(promo) + '</span>' +
            '</span>' +
            '<button type="button" class="copy" data-code="' + esc(promo) + '">' +
              '<span class="copy__idle">Копировать<span class="vh"> промокод ' + esc(promo) + '</span></span>' +
              '<span class="copy__done" aria-hidden="true">' +
                '<svg aria-hidden="true" focusable="false"><use href="#i-check"/></svg>Скопировано</span>' +
            '</button>' +
          '</div>' +
        '</div>'
      : '';

    var button = okLink(url)
      ? '<a class="cta" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="cta__label">' + esc(cta) +
            '<span class="vh"> в ' + esc(name) + ' (откроется в новой вкладке)</span></span>' +
          '<svg class="cta__ico" aria-hidden="true" focusable="false"><use href="#i-arrow"/></svg>' +
        '</a>'
      : '<span class="cta cta--soon">Ссылка скоро</span>';

    return '<article class="card t-' + theme + '" aria-labelledby="' + id + '-name">' +
      '<div class="head">' +
        '<div class="brand">' +
          '<div class="tile" aria-hidden="true">' + esc(initials(o)) + '</div>' +
          '<div class="brand__text">' +
            '<div class="name-row"><h2 class="name" id="' + id + '-name">' + esc(name) + '</h2>' +
              (t(o.tag) ? '<span class="tag">' + esc(o.tag) + '</span>' : '') + '</div>' +
            ratingHTML +
          '</div>' +
        '</div>' +
        fact +
      '</div>' +
      '<div class="bonus">' + bonusHead + '<p class="bonus__text">' + esc(o.bonus) + '</p></div>' +
      promoHTML +
      '<div class="cta-wrap">' + button + '</div>' +
    '</article>';
  }

  var grid = document.getElementById('offers');
  if (grid) {
    grid.innerHTML = offers.length
      ? offers.map(card).join('')
      : '<p class="nojs">Скоро здесь появятся бонусы партнеров.</p>';
  }

  /* ── копирование промокода ────────────────────────────────────────── */

  var sr = document.getElementById('sr-status');
  var toast = document.getElementById('toast');
  var toastCode = document.getElementById('toast-code');
  var toastTimer, sayTimer;

  /* Пустой такт перед текстом: иначе второй одинаковый текст подряд
     скринридер не объявит. */
  function say(msg) {
    if (!sr) return;
    clearTimeout(sayTimer);
    sr.textContent = '';
    sayTimer = setTimeout(function () { sr.textContent = msg; }, 60);
  }

  function legacyCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true });
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    /* Фокус обратно на кнопку: иначе с клавиатуры он падал бы на body. */
    btn.focus({ preventScroll: true });
    return ok;
  }

  function copyText(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; },
        function () { return legacyCopy(text, btn); });
    }
    return Promise.resolve(legacyCopy(text, btn));
  }

  function done(btn, code) {
    clearTimeout(btn._t);
    btn.classList.add('is-done');
    btn._t = setTimeout(function () { btn.classList.remove('is-done'); }, 2000);

    if (toast && toastCode) {
      toastCode.textContent = code;
      toast.hidden = true;
      void toast.offsetWidth;   // перезапуск анимации появления
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.hidden = true; }, 2500);
    }
    say('Промокод ' + code + ' скопирован');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('button.copy');
    if (!btn) return;
    var code = btn.getAttribute('data-code');
    if (!code) return;
    copyText(code, btn).then(function (ok) {
      if (ok) done(btn, code);
      else say('Не удалось скопировать. Промокод: ' + code);
    });
  });
})();
