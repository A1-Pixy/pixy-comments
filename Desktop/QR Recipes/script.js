(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     Constants
  ────────────────────────────────────────────── */
  var blends = window.PIXY_BLENDS || [];
  if (!blends.length) {
    console.error('No blends loaded. Check blends.js and script order.');
  }
  var VALID_SLUGS = blends.map(function (b) { return b.id; });
  var scrollY = 0; // overlay scroll-lock (legacy)

  /* ──────────────────────────────────────────────
     Scan tracking
  ────────────────────────────────────────────── */
  function trackScan(slug) {
    var key = 'pixy_scan_' + slug;
    var count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(count));
    console.log('QR blend viewed: ' + slug + ' (local count: ' + count + ')');

    try {
      fetch('/.netlify/functions/track-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blend: slug,
          pageUrl: window.location.href,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      }).catch(function () {});
    } catch (e) {}
  }

  /* ──────────────────────────────────────────────
     Hash router
  ────────────────────────────────────────────── */
  function getHash() {
    return (window.location.hash || '').slice(1);
  }

  function route() {
    var hash = getHash();

    if (hash === 'admin-stats') {
      showAdminView();
      return;
    }

    if (hash && VALID_SLUGS.indexOf(hash) !== -1) {
      for (var i = 0; i < blends.length; i++) {
        if (blends[i].id === hash) {
          showBlendView(blends[i]);
          trackScan(hash);
          return;
        }
      }
    }

    showHomepageView();
  }

  /* ──────────────────────────────────────────────
     View switching
  ────────────────────────────────────────────── */
  function showHomepageView() {
    document.getElementById('homepage-view').classList.remove('hidden');
    document.getElementById('blend-view').classList.add('hidden');
    document.getElementById('admin-view').classList.add('hidden');
    window.scrollTo(0, 0);
  }

  function showBlendView(blend) {
    document.getElementById('homepage-view').classList.add('hidden');
    document.getElementById('admin-view').classList.add('hidden');

    var view = document.getElementById('blend-view');
    view.classList.remove('hidden');
    document.getElementById('blend-view-content').innerHTML = buildBlendHTML(blend);
    window.scrollTo(0, 0);

    var form = document.getElementById('vip-form-' + blend.id);
    if (form) {
      form.addEventListener('submit', function (e) { handleVipSubmit(e, blend); });
    }
  }

  function showAdminView() {
    document.getElementById('homepage-view').classList.add('hidden');
    document.getElementById('blend-view').classList.add('hidden');
    document.getElementById('admin-view').classList.remove('hidden');
    renderAdminStats();
    window.scrollTo(0, 0);
  }

  /* ──────────────────────────────────────────────
     Build blend section HTML
  ────────────────────────────────────────────── */
  function buildBlendHTML(blend) {
    var r = blend.retail;
    var sig = blend.signature;
    var perfectFor = r.perfectFor.join(' • ');

    var ingHTML = '';
    if (sig.ingredients && sig.ingredients.length) {
      ingHTML = '<ul class="recipe-ingredients">' +
        sig.ingredients.map(function (i) { return '<li>' + i + '</li>'; }).join('') +
        '</ul>';
    }

    return (
      '<div class="bv-hero">' +
        '<img class="bv-hero-img" src="' + blend.image + '" alt="' + blend.name + '" onerror="this.style.display=\'none\'">' +
      '</div>' +

      '<section class="bv-retail">' +
        '<div class="bv-inner">' +
          '<p class="bv-blend-label">' + blend.name + '</p>' +
          '<h1 class="bv-headline">' + r.headline + '</h1>' +
          '<p class="bv-copy">' + r.copy + '</p>' +
          '<div class="bv-perfect-for">' +
            '<p class="bv-perfect-label">Perfect For</p>' +
            '<p class="bv-perfect-items">' + perfectFor + '</p>' +
          '</div>' +
          '<p class="bv-support">' + r.support + '</p>' +
          '<div class="bv-trust-row">' +
            '<p class="bv-trust">Trusted by local restaurants and professional kitchens.</p>' +
            '<p class="bv-scan-note">Scan for recipes, cooking tips, and exclusive offers.</p>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="bv-recipe-section">' +
        '<div class="bv-inner">' +
          '<div class="bv-recipe-card">' +
            '<p class="bv-section-label">Featured Recipe</p>' +
            '<h2 class="bv-recipe-title">' + sig.title + '</h2>' +
            ingHTML +
            '<p class="bv-recipe-instructions">' + sig.instructions + '</p>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="bv-vip">' +
        '<div class="bv-inner">' +
          '<h2 class="bv-vip-title">Join The VIP Kitchen</h2>' +
          '<p class="bv-vip-copy">Get new recipes, cooking tips, product releases, and exclusive Pixy Dust offers.</p>' +
          '<form class="vip-form" id="vip-form-' + blend.id + '" novalidate>' +
            '<input type="hidden" name="form-name" value="pixy-vip-signup">' +
            '<input type="hidden" name="blend" value="' + blend.id + '">' +
            '<input type="hidden" name="source" value="qr-recipe">' +
            '<input type="hidden" name="page_url" value="">' +
            '<input type="hidden" name="timestamp" value="">' +
            '<div class="vip-field">' +
              '<label class="vip-label" for="vip-name-' + blend.id + '">Name</label>' +
              '<input class="vip-input" type="text" id="vip-name-' + blend.id + '" name="name" placeholder="Your name" autocomplete="given-name" required>' +
            '</div>' +
            '<div class="vip-field">' +
              '<label class="vip-label" for="vip-email-' + blend.id + '">Email</label>' +
              '<input class="vip-input" type="email" id="vip-email-' + blend.id + '" name="email" placeholder="your@email.com" autocomplete="email" required>' +
            '</div>' +
            '<button class="vip-submit" type="submit">Join VIP</button>' +
          '</form>' +
          '<div class="vip-success hidden" id="vip-success-' + blend.id + '">' +
            "<p>You're in! Welcome to the Pixy Dust VIP Kitchen.</p>" +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="bv-shop">' +
        '<div class="bv-inner">' +
          '<a class="shop-btn" href="https://www.pdseasoning.com/shop?blend=' + blend.id + '" target="_blank" rel="noopener noreferrer">Shop This Blend</a>' +
        '</div>' +
      '</section>'
    );
  }

  /* ──────────────────────────────────────────────
     VIP form submission
  ────────────────────────────────────────────── */
  function handleVipSubmit(e, blend) {
    e.preventDefault();
    var form = e.target;
    var nameVal = form.querySelector('[name="name"]').value.trim();
    var emailVal = form.querySelector('[name="email"]').value.trim();

    if (!nameVal || !emailVal || emailVal.indexOf('@') === -1) return;

    form.querySelector('[name="page_url"]').value = window.location.href;
    form.querySelector('[name="timestamp"]').value = new Date().toISOString();

    var successEl = document.getElementById('vip-success-' + blend.id);

    // Netlify Forms AJAX submission
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'pixy-vip-signup',
        name: nameVal,
        email: emailVal,
        blend: blend.id,
        source: 'qr-recipe',
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      }).toString()
    })
    .then(function () {
      form.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');
    })
    .catch(function () {
      // Graceful degradation — show success anyway
      form.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');
    });
  }

  /* ──────────────────────────────────────────────
     Admin stats
  ────────────────────────────────────────────── */
  function renderAdminStats() {
    var grid = document.getElementById('admin-stats-grid');
    if (!grid) return;

    grid.innerHTML = blends.map(function (b) {
      var count = localStorage.getItem('pixy_scan_' + b.id) || '0';
      return (
        '<div class="admin-stat-card">' +
          '<p class="admin-stat-name">' + b.name + '</p>' +
          '<p class="admin-stat-count">' + count + '</p>' +
          '<p class="admin-stat-label">local scans</p>' +
        '</div>'
      );
    }).join('');
  }

  /* ──────────────────────────────────────────────
     Render blend cards (homepage)
  ────────────────────────────────────────────── */
  function renderCards(list) {
    var grid = document.getElementById('cards-grid');
    var none = document.getElementById('no-results');

    grid.innerHTML = '';

    if (list.length === 0) {
      none.classList.remove('hidden');
      return;
    }
    none.classList.add('hidden');

    list.forEach(function (blend) {
      var article = document.createElement('article');
      article.className = 'blend-card';
      article.setAttribute('role', 'listitem');
      article.setAttribute('tabindex', '0');
      article.setAttribute('aria-label', blend.name + ' — tap to view recipes');

      article.innerHTML =
        '<div class="card-img-wrap">' +
          '<img class="card-img" src="' + blend.image + '" alt="' + blend.name + ' dish" loading="lazy" decoding="async" onerror="this.style.opacity=\'0\'">' +
        '</div>' +
        '<div class="card-body">' +
          '<h2 class="card-name">' + blend.name + '</h2>' +
          '<p class="card-tagline">' + blend.tagline + '</p>' +
        '</div>';

      article.addEventListener('click', function () {
        window.location.hash = '#' + blend.id;
      });
      article.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.hash = '#' + blend.id;
        }
      });

      grid.appendChild(article);
    });
  }

  /* ──────────────────────────────────────────────
     Search
  ────────────────────────────────────────────── */
  function search(query) {
    var q = query.toLowerCase().trim();
    var clearBtn = document.getElementById('search-clear');

    clearBtn.classList.toggle('visible', q.length > 0);
    clearBtn.setAttribute('tabindex', q.length > 0 ? '0' : '-1');

    renderCards(!q ? blends : blends.filter(function (b) {
      return (
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.greatOn.some(function (item) { return item.toLowerCase().includes(q); }) ||
        b.tags.some(function (tag) { return tag.toLowerCase().includes(q); })
      );
    }));
  }

  /* ──────────────────────────────────────────────
     Overlay (legacy — kept for compatibility)
  ────────────────────────────────────────────── */
  function closeOverlay() {
    var overlay = document.getElementById('overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  /* ──────────────────────────────────────────────
     Init
  ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    renderCards(blends);

    // Search
    var input = document.getElementById('search-input');
    var clearBtn = document.getElementById('search-clear');
    input.addEventListener('input', function () { search(input.value); });
    clearBtn.addEventListener('click', function () {
      input.value = '';
      search('');
      input.focus();
    });

    // Blend back button
    document.getElementById('blend-back-btn').addEventListener('click', function () {
      window.location.hash = '';
    });

    // Admin back link
    document.getElementById('admin-back-link').addEventListener('click', function (e) {
      e.preventDefault();
      window.location.hash = '';
    });

    // Admin clear button
    document.getElementById('admin-clear-btn').addEventListener('click', function () {
      blends.forEach(function (b) {
        localStorage.removeItem('pixy_scan_' + b.id);
      });
      renderAdminStats();
    });

    // Overlay close
    document.getElementById('overlay-close').addEventListener('click', closeOverlay);
    document.getElementById('overlay-backdrop').addEventListener('click', closeOverlay);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
    });

    // Hash routing
    window.addEventListener('hashchange', route);
    window.addEventListener('popstate', route);
    route();
  });

}());
