/* ==========================================================================
   ДЕМО-СЕРВЕР.

   Демо живёт на GitHub Pages, а там нет PHP. Модуль перехватывает запросы
   панели к api.php и отвечает так же, как настоящий сервер: вход по паролю,
   «Сохранить на сайт», откат, смена пароля. Только хранит всё в браузере
   посетителя — другие люди его правок не видят. Логика панели не тронута.

   Подключается ПЕРВЫМ скриптом на panel.html.
   ========================================================================== */

(function () {
  'use strict';

  var DEFAULT_PASS = 'demo2026';
  var K = {
    site: 'bonusy:site',          // текст data.js, «сохранённый на сайт»
    prev: 'bonusy:site-prev',     // версия до последнего сохранения
    info: 'bonusy:published',     // когда сохраняли
    pass: 'bonusy:pass',          // пароль, если его сменили в демо
    auth: 'bonusy:auth'           // вход (на вкладку, как сессия PHP)
  };
  var ORIGINAL = '__original__';     // «до сохранения был исходный data.js»
  var MAX_BYTES = 4 * 1024 * 1024;

  function get(store, k) { try { return store.getItem(k); } catch (e) { return null; } }
  function set(store, k, v) { store.setItem(k, v); }
  function del(store, k) { try { store.removeItem(k); } catch (e) { /* нет доступа */ } }

  function currentPass() { return get(localStorage, K.pass) || DEFAULT_PASS; }
  function authed() { return get(sessionStorage, K.auth) === '1'; }
  function info() {
    try { return JSON.parse(get(localStorage, K.info) || 'null'); } catch (e) { return null; }
  }

  /* «Начать демо заново»: всё — с нуля, панель и сайт как при первом
     открытии. Чистим на СЛЕДУЮЩЕЙ загрузке, а не перед reload(): ядро
     панели на pagehide дописывает черновик обратно. Вход не трогаем —
     gate.js по метке panel:keep впустит обратно и скажет итог. */
  var RESET_FLAG = 'bonusy:reset';
  if (get(sessionStorage, RESET_FLAG) === '1') {
    del(sessionStorage, RESET_FLAG);
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('bonusy') === 0) del(localStorage, k);   // и черновик bonusy_admin_draft*
      });
    } catch (e) { /* нет доступа */ }
    try { sessionStorage.setItem('panel:keep', 'Демо начато заново: каталог и пароль вернулись к исходным.'); } catch (e) { /* без метки спросит пароль */ }
  }

  window.DEMO = {
    defaultPass: DEFAULT_PASS,
    currentPass: currentPass,
    passChanged: function () { return currentPass() !== DEFAULT_PASS; },
    requestReset: function () {
      try { sessionStorage.setItem(RESET_FLAG, '1'); } catch (e) { /* без флага просто перезагрузится */ }
      window.PANEL_RELOADING = true;   // иначе beforeunload спросит «покинуть сайт?»
      location.reload();
    }
  };

  /* Ответ как у api.php: JSON и код статуса. Небольшая пауза — чтобы
     «Сохраняю…» и прочие состояния панели было видно, как на живом сайте. */
  function reply(body, status) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(new Response(JSON.stringify(body), {
          status: status || 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }));
      }, 250 + Math.round(Math.random() * 250));
    });
  }

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16) + s.length.toString(16);
  }

  function stamp(d) {
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  var NEED_AUTH = { ok: false, error: 'Сессия истекла — войдите заново.' };

  function handle(action, input) {
    if (action === 'state') {
      return reply({ ok: true, auth: authed(), published: info(), curl: true });
    }

    if (action === 'login') {
      var pass = String(input.password || '').trim();
      if (pass !== currentPass()) {
        return reply({ ok: false, error: 'Пароль не подошёл. Сейчас в демо пароль — ' + currentPass() + '.' }, 401);
      }
      set(sessionStorage, K.auth, '1');
      return reply({ ok: true, auth: true, published: info() });
    }

    if (action === 'logout') {
      del(sessionStorage, K.auth);
      return reply({ ok: true, auth: false });
    }

    if (action === 'publish' || action === 'rollback') {
      if (!authed()) return reply(NEED_AUTH, 401);
      var data;
      if (action === 'rollback') {
        var prev = get(localStorage, K.prev);
        if (prev === null) return reply({ ok: false, error: 'Предыдущей версии нет — откатывать не к чему.' }, 409);
        data = prev;
      } else {
        data = String(input.data || '');
        if (!data) return reply({ ok: false, error: 'Пустые данные — публиковать нечего.' }, 400);
        if (data.length > MAX_BYTES) {
          return reply({ ok: false, error: 'Слишком много данных: скорее всего, дело в тяжёлой картинке. Уменьшите её и попробуйте снова.' }, 413);
        }
      }

      var now = new Date();
      var meta = { at: now.toISOString(), hash: hash(data), stamp: stamp(now) };
      var before = get(localStorage, K.site);
      try {
        if (action === 'publish') set(localStorage, K.prev, before === null ? ORIGINAL : before);
        if (data === ORIGINAL) del(localStorage, K.site);
        else set(localStorage, K.site, data);
        set(localStorage, K.info, JSON.stringify(meta));
      } catch (e) {
        /* Место в браузере кончилось — оставляем сайт как был. */
        if (before === null) del(localStorage, K.site); else try { set(localStorage, K.site, before); } catch (e2) { /* как есть */ }
        return reply({ ok: false, error: 'В браузере не хватило места для демо: скорее всего, дело в тяжёлой картинке. Уменьшите её и попробуйте снова.' }, 413);
      }
      return reply({ ok: true, published: meta, pages: 2 });
    }

    if (action === 'password') {
      if (!authed()) return reply(NEED_AUTH, 401);
      var old = String(input.old || '');
      var nw = String(input['new'] || '');
      if (old !== currentPass()) return reply({ ok: false, field: 'old', error: 'Текущий пароль не подошёл.' }, 403);
      if (nw.length < 8) return reply({ ok: false, field: 'new', error: 'Новый пароль короче 8 символов.' }, 400);
      if (nw === old) return reply({ ok: false, field: 'new', error: 'Новый пароль совпадает с текущим.' }, 400);
      if (/\s/.test(nw)) return reply({ ok: false, field: 'new', error: 'В пароле не должно быть пробелов.' }, 400);
      try { set(localStorage, K.pass, nw); } catch (e) {
        return reply({ ok: false, error: 'Браузер не дал сохранить пароль. Пароль не изменён.' }, 500);
      }
      return reply({ ok: true });
    }

    return reply({ ok: false, error: 'Неизвестное действие.' }, 404);
  }

  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (resource, init) {
    var url = typeof resource === 'string' ? resource : (resource && resource.url) || '';
    if (!/(^|\/)api\.php(\?|$)/.test(url)) return realFetch(resource, init);
    var input = {};
    try { input = JSON.parse((init && init.body) || '{}') || {}; } catch (e) { input = {}; }
    var m = url.match(/[?&]action=([a-z]+)/);
    return handle(String(input.action || (m && m[1]) || ''), input);
  };

  /* «Скачать сайт целиком» шлёт форму на api.php?action=zip — на Pages
     такой запрос упал бы в 405. В демо вместо архива объясняем, что было бы. */
  var realSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function () {
    var action = this.getAttribute('action') || '';
    if (/(^|\/)api\.php\?action=zip/.test(action)) {
      if (typeof window.DEMO.onZip === 'function') window.DEMO.onZip();
      return;
    }
    return realSubmit.call(this);
  };
})();
