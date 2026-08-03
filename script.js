/* ============================================
   REMON ARCHIVES — KIRO × ZANGETSU
   Vanilla JS. No dependencies. No build step.
   Wrapped defensively so one bad selector
   can never take down the whole script.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---------- Toast helper ---------- */
  function createToast() {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    return toast;
  }

  var toastEl = createToast();
  var toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------- Placeholder link guard ---------- */
  // If the download buttons still point at the placeholder text,
  // stop the click and tell the visitor clearly instead of
  // silently navigating to a dead / non-existent page.
  var downloadButtons = document.querySelectorAll('.btn[data-app]');

  downloadButtons.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      var href = btn.getAttribute('href') || '';
      var isPlaceholder = href.indexOf('PASTE_') === 0 || href.trim() === '' || href.trim() === '#';

      // small visual feedback on every click
      btn.classList.remove('is-pressed');
      // eslint-disable-next-line no-unused-expressions
      void btn.offsetWidth; // restart animation
      btn.classList.add('is-pressed');

      if (isPlaceholder) {
        event.preventDefault();
        var appName = btn.getAttribute('data-app') === 'kiro' ? 'Kiro' : 'Zangetsu';
        showToast(appName + ' release link not added yet — paste it in index.html');
        return;
      }

      showToast('Starting download…');
      // real links are left to navigate normally (no preventDefault)
    });
  });

  /* ---------- Smooth in-page nav (native fallback safe) ---------- */
  var navLinks = document.querySelectorAll('.topbar__nav a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href').slice(1);
      var targetEl = targetId ? document.getElementById(targetId) : null;
      if (!targetEl) return; // let default anchor behavior handle it

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Scroll-reveal for poster cards ---------- */
  var posters = document.querySelectorAll('.poster');

  if ('IntersectionObserver' in window && posters.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    posters.forEach(function (poster) {
      revealObserver.observe(poster);
    });
  }

  /* ---------- Console signature (harmless) ---------- */
  try {
    console.log('%cREMON ARCHIVES', 'color:#c41e3a;font-weight:bold;font-size:14px;');
    console.log('Kiro × Zangetsu — built by Remon');
  } catch (e) {
    /* no-op: console may be unavailable in some environments */
  }
});
