/* ══════════════════════════════════════════════════════════════
   LANDING 2026 — autorskie ruchy strony głównej
   Silnik scrollcraft.js prowadzi akty (data-sc-*). Tutaj mieszka to,
   czego silnik nie ma: choreografia rzeźby w hero, znak pulsu,
   światło przy bezruchu, stan nawigacji.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var html = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var easeOut = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };

  /* ── stan „załadowano": wejścia hero startują po zniknięciu loadera ── */
  var loadedFired = false;
  function markLoaded() { if (loadedFired) return; loadedFired = true; html.classList.add('is-loaded'); }
  if (html.classList.contains('no-loader') || !document.getElementById('page-loader')) markLoaded();
  document.addEventListener('sm:loaded', markLoaded);
  setTimeout(markLoaded, 4200); // bezpiecznik: nigdy nie zostawiaj hero pustego

  /* ── silnik ── */
  var sc = null;
  if (window.ScrollCraft) {
    try { sc = ScrollCraft.mount(document.body); } catch (e) { console.warn('[landing] engine', e); }
  }
  if (!sc) {
    // bez silnika: pokaż wszystko, strona ma czytać się jak dokument
    Array.prototype.forEach.call(document.querySelectorAll('[data-sc-in],[data-sc-stagger]>*,[data-sc-cue]'), function (el) {
      el.classList.add('sc-in'); el.style.opacity = '1';
    });
  }
  var heroAct = null;
  if (sc) for (var i = 0; i < sc.acts.length; i++) if (sc.acts[i].el.id === 'hero') heroAct = sc.acts[i];

  /* ── hero: rzeźba wjeżdża spod kadru, ustawia się, potem lekko osiada ── */
  var subject = document.getElementById('lpSubject');
  var lastSubject = '';
  function driveSubject() {
    if (!subject || !heroAct) return;
    if (reduce) { if (lastSubject !== 'none') { subject.style.transform = 'none'; lastSubject = 'none'; } return; }
    var p = heroAct.p;
    var vh = window.innerHeight;
    var small = window.innerWidth <= 860;
    // na telefonie rzeźba rusza dopiero, gdy nagłówek zaczyna gasnąć (brak kolizji z tekstem)
    var rise = small ? easeOut((p - 0.22) / 0.5) : easeOut(p / 0.62);
    var settle = easeOut((p - 0.72) / 0.28);
    var y = (1 - rise) * vh * (small ? 0.5 : 0.72) - settle * vh * 0.03;
    var s = (small ? 0.94 : 0.9) + rise * (small ? 0.06 : 0.1);
    var t = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(4) + ')';
    if (t !== lastSubject) { subject.style.transform = t; lastSubject = t; }
  }

  /* ── światło przy bezruchu: sekcja „Dla przyszłych mam" ── */
  var dwellEls = Array.prototype.slice.call(document.querySelectorAll('[data-lp-dwell]'));
  var lastScrollAt = performance.now();
  window.addEventListener('scroll', function () { lastScrollAt = performance.now(); }, { passive: true });
  function driveDwell(now) {
    var still = now - lastScrollAt > 900;
    var vh = window.innerHeight;
    for (var i = 0; i < dwellEls.length; i++) {
      var el = dwellEls[i], r = el.getBoundingClientRect();
      var centered = r.top < vh * 0.6 && r.bottom > vh * 0.4;
      var on = still && centered;
      if (on !== el.classList.contains('is-dwelling')) el.classList.toggle('is-dwelling', on);
    }
  }

  /* ── pętla ── */
  var lastProgress = '';
  function frame(now) {
    var y = window.scrollY || window.pageYOffset;
    var max = Math.max((document.documentElement.scrollHeight || 0) - window.innerHeight, 1);
    var pr = clamp(y / max, 0, 1).toFixed(4);
    if (pr !== lastProgress) { html.style.setProperty('--lp-progress', pr); lastProgress = pr; }
    var scrolled = y > 24;
    if (scrolled !== html.classList.contains('is-scrolled')) html.classList.toggle('is-scrolled', scrolled);
    driveSubject();
    driveDwell(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ── wideo hero: pewny autoplay, szacunek dla reduced motion ── */
  var v = document.querySelector('.lp-plane-video video');
  if (v) {
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
})();
