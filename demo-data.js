/* ДЕМО: каталог, «сохранённый на сайт» из панели, лежит в браузере
   (см. demo-api.js). Если он есть — сайт и панель берут его, иначе следом
   грузится обычный data.js. */
(function () {
  'use strict';
  var text = null;
  try { text = localStorage.getItem('bonusy:site'); } catch (e) { text = null; }
  if (!text) return;
  var s = document.createElement('script');
  s.text = text;
  (document.head || document.documentElement).appendChild(s);
})();
