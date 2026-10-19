/* ==========================================================================
   ДЕМО: поведение демо-плашек панели (разметка — в panel.html).

   • Экран входа показывает текущий пароль демо (его можно сменить в панели).
   • «Начать демо заново» — через общий диалог #ask; сам сброс делает
     demo-api.js на следующей загрузке.
   • «Скачать сайт целиком» в демо не скачивает, а объясняет, что было бы.
   ========================================================================== */

(function () {
  'use strict';

  var demo = window.DEMO;
  if (!demo) return;

  function announce(text, assertive) {
    if (window.PANEL && typeof window.PANEL.announce === 'function') { window.PANEL.announce(text, assertive); return; }
    var node = document.getElementById(assertive ? 'a-alert' : 'a-status');
    if (!node) return;
    node.textContent = '';
    setTimeout(function () { node.textContent = text; }, 80);
  }

  /* Пароль на экране входа — всегда тот, что сейчас подходит. */
  var passNode = document.getElementById('gate-demo-pass');
  if (passNode) passNode.textContent = demo.currentPass();
  if (passNode && demo.passChanged()) {
    passNode.insertAdjacentText('afterend', ' (вы сменили его в демо)');
  }

  /* ---------------------------------------------- начать заново -------- */

  var ask = document.getElementById('ask');
  var yes = document.getElementById('ask-yes');
  var no = document.getElementById('ask-no');
  var resetBtn = document.getElementById('demo-reset');

  if (ask && yes && no && resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (ask.open) return;
      document.getElementById('ask-title').textContent = 'Начать демо заново?';
      document.getElementById('ask-text').textContent =
        'Пропадут все правки, сохранения и сменённый пароль в этом браузере. ' +
        'Каталог и пароль ' + demo.defaultPass + ' вернутся к исходным.';
      yes.textContent = 'Начать заново';
      yes.setAttribute('data-demo-run', '1');   // это наше подтверждение, не удаление карточки
      ask.showModal();
      no.focus({ preventScroll: true });
    });

    yes.addEventListener('click', function () {
      if (this.getAttribute('data-demo-run') !== '1') return;
      this.removeAttribute('data-demo-run');
      demo.requestReset();
    });

    /* Метку снимаем при любом закрытии мимо «Начать заново» — иначе
       следующее «Удалить карточку» заодно сбросило бы всё демо. */
    var disarm = function () { yes.removeAttribute('data-demo-run'); };
    ask.addEventListener('cancel', disarm);
    ask.addEventListener('close', disarm);
    no.addEventListener('click', disarm);
  }

  /* ---------------------------------------------- архив сайта ---------- */

  /* Перехват в фазе захвата на документе — раньше обработчика publish.js:
     он отправил бы форму на api.php (на Pages это 405) и сказал бы
     «Собираю архив…». Enter и пробел на кнопке — тоже click. */
  var zipMsg = document.getElementById('demo-zip-msg');
  function onZip() {
    var text = 'В демо архив не скачивается. На вашем сайте эта кнопка скачает копию всего сайта — на всякий случай или для переезда.';
    if (zipMsg) zipMsg.textContent = text;   // видно глазами; это не живая область
    announce(text);                          // вежливо: это не ошибка
  }
  demo.onZip = onZip;   // страховка в demo-api.js, если форму отправят мимо кнопки
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest || !e.target.closest('#zip')) return;
    e.preventDefault();
    e.stopPropagation();
    onZip();
  }, true);
})();
