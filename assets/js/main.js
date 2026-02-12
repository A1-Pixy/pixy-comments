// ======================================================
// PIXY DUST — assets/js/main.js
// Full replacement. Wiring only. No layout, spacing, class, or design changes.
//
// Fixes included:
// - Ensures products.js is loaded before any hero/shop wiring runs
// - Single hero carousel controller only (removes duplicate hero block behavior)
// - Hero carousel does NOT exclude products missing images (uses fallback instead)
// ======================================================

(function () {
  "use strict";

  var ECWID_STORE_ID = 62406545;

  // Chat persistence keys
  var LS_OPEN = "pixy_chat_open_v1";
  var LS_POS  = "pixy_chat_pos_v1";

  document.addEventListener("DOMContentLoaded", function () {
    setupYear();
    setupOpenCartButtons();
    setupChatShell();

    ensureProductsLoaded().then(function () {
      wireProductAddToCart();
      enhanceShopCards();
      enhanceCollectionCarousels();
      enhanceJuniorsCards();
      enhanceJuniorsCarousels();
      enhanceGiftingCards();

      // Home only
      setupHeroCarousel();
      setupHeroDust();
      setupHeroSwipe();

      // Existing horizontal rows only
      enableSwipeOnHorizontalScroll();
    });
  });

  function setupYear() {
    var y = String(new Date().getFullYear());
    var a = document.getElementById("pd-year");
    var b = document.getElementById("year");
    if (a) a.textContent = y;
    if (b) b.textContent = y;
  }

  // ======================================================
  // Products
  // ======================================================
  function getProducts() {
    return Array.isArray(window.PIXY_PRODUCTS) ? window.PIXY_PRODUCTS : null;
  }

  function ensureProductsLoaded() {
    return new Promise(function (resolve) {
      if (getProducts()) { resolve(true); return; }

      var existing = document.querySelector('script[src$="assets/js/products.js"],script[src*="/assets/js/products.js"]');
      if (existing) { waitForProducts(resolve); return; }

      var s = document.createElement("script");
      s.src = "assets/js/products.js";
      s.defer = true;
      s.onload = function () { waitForProducts(resolve); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);

      waitForProducts(resolve);
    });
  }

  function waitForProducts(resolve) {
    var start = Date.now();
    var t = setInterval(function () {
      if (getProducts()) { clearInterval(t); resolve(true); return; }
      if (Date.now() - start > 6000) { clearInterval(t); resolve(false); }
    }, 120);
  }

  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  function getProductByKey(key) {
    var list = getProducts();
    if (!list) return null;
    key = String(key || "");
    for (var i = 0; i < list.length; i++) {
      if (list[i] && String(list[i].key) === key) return list[i];
    }
    return null;
  }

  // ======================================================
  // Remember where the user came from (for Product back link)
  // ======================================================
  function rememberListingPage() {
    try {
      sessionStorage.setItem(
        "pixy_last_listing",
        window.location.pathname.replace(/^.*\//, "") + window.location.search + window.location.hash
      );
    } catch (e) {}
  }

  function decorateProductLink(a) {
    if (!a) return;
    a.addEventListener("click", function () {
      rememberListingPage();
    });
  }

  function buildProductCard(p) {
    var card = document.createElement("article");
    card.className = "card product";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", (p.title || "View product"));

    var href = "product.html?key=" + encodeURIComponent(p.key);

    function go() {
      rememberListingPage();
      window.location.href = href;
    }

    card.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && (t.closest("a") || t.closest("button"))) return;
      go();
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });

    var media = document.createElement("div");
    media.className = "product-media";

    var img = document.createElement("img");
    img.className = "pouch pouch-placeholder";
    img.alt = p.title || "";
    img.loading = "lazy";
    img.src = p.image || "assets/images/logo-pixy-gold.png";
    media.appendChild(img);

    var h3 = document.createElement("h3");
    h3.className = "card-title";
    h3.textContent = (p.title || "");

    var pbl = document.createElement("p");
    pbl.className = "muted";
    pbl.textContent = (p.blurb || p.story || "");

    var actions = document.createElement("div");
    actions.className = "product-actions";

    var details = document.createElement("a");
    details.className = "btn";
    details.href = href;
    details.textContent = "View Details";
    decorateProductLink(details);
    actions.appendChild(details);

    if (p.ecwidProductId) {
      var add = document.createElement("button");
      add.type = "button";
      add.className = "btn btn-secondary";
      add.textContent = "Add to cart";
      add.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        addToCart(p.ecwidProductId, 1);
      });
      actions.appendChild(add);
    }

    card.appendChild(media);
    card.appendChild(h3);
    if (pbl.textContent) card.appendChild(pbl);
    card.appendChild(actions);

    return card;
  }

  function fillCarouselWrap(wrap) {
    if (!wrap) return;
    var category = wrap.getAttribute("data-category");
    var track = wrap.querySelector("[data-carousel-track]");
    if (!category || !track) return;

    var products = getProducts();
    if (!products || !products.length) return;

    var list = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i] && products[i].category === category) list.push(products[i]);
    }

    track.innerHTML = "";
    for (var j = 0; j < list.length; j++) {
      track.appendChild(buildProductCard(list[j]));
    }

    var prev = wrap.querySelector("[data-carousel-prev]");
    var next = wrap.querySelector("[data-carousel-next]");
    function scrollByCards(dir) {
      if (!track) return;
      var first = track.querySelector(".card");
      var cardW = first ? first.getBoundingClientRect().width : 220;
      track.scrollLeft += dir * (cardW + 14);
    }
    if (prev) prev.addEventListener("click", function () { scrollByCards(-1); });
    if (next) next.addEventListener("click", function () { scrollByCards(1); });

    var viewAll = wrap.querySelector("[data-carousel-viewall]");
    if (viewAll) {
      viewAll.addEventListener("click", function () {
        window.location.href = "shop.html?view=" + encodeURIComponent(category);
      });
    }
  }

  function cssEscape(s) {
    try { return CSS && CSS.escape ? CSS.escape(String(s)) : String(s).replace(/"/g, "\\\""); }
    catch (e) { return String(s).replace(/"/g, "\\\""); }
  }

  function enhanceCollectionCarousels() {
    var wraps = document.querySelectorAll(".carousel-wrap[data-category]");
    for (var i = 0; i < wraps.length; i++) fillCarouselWrap(wraps[i]);

    var view = getParam("view");
    if (view) {
      var target = document.querySelector('[data-view-section="' + cssEscape(view) + '"]') || document.getElementById(view);
      if (target && target.scrollIntoView) {
        setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
      }
    }
  }

  // ======================================================
  // Juniors / Gifting / Shop injections (unchanged logic)
  // ======================================================
  function enhanceJuniorsCarousels() {
    var products = getProducts();
    if (!products || !products.length) return;

    var nodes = document.querySelectorAll("[data-product-key]");
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-product-key");
        if (!key) return;
        var p = getProductByKey(key);
        if (!p) return;

        var media = el.querySelector("[data-media]");
        if (media && p.image) {
          media.innerHTML = "";
          var img = document.createElement("img");
          img.src = p.image;
          img.setAttribute("data-key", p.key);
          img.alt = p.title || "";
          img.loading = "lazy";
          img.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            rememberListingPage();
            window.location.href = "product.html?key=" + encodeURIComponent(p.key);
          });
          media.appendChild(img);
        }

        var title = el.querySelector("[data-title]");
        if (title) title.textContent = p.title || "";

        var cta = el.querySelector("[data-cta]");
        if (cta && cta.tagName === "A") {
          cta.setAttribute("href", "product.html?key=" + encodeURIComponent(p.key));
          decorateProductLink(cta);
        }

        var addBtn = el.querySelector("[data-add-to-cart]");
        if (addBtn && p.ecwidProductId) {
          addBtn.addEventListener("click", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            ensureEcwidLoaded().then(function () {
              window.Ecwid.Cart.addProduct({
                id: Number(p.ecwidProductId),
                quantity: 1,
                callback: function (success) {
                  if (success) window.Ecwid.openPage("cart");
                }
              });
            });
          });
        }
      })(nodes[i]);
    }

    var track = document.querySelector('[aria-label="Classic bottles carousel"][data-jr-track]') || document.querySelector('[aria-label="Classic bottles carousel"]');
    if (track) {
      track.innerHTML = "";
      var list = [];
      for (var j = 0; j < products.length; j++) {
        if (products[j] && products[j].category === "Bottles") list.push(products[j]);
      }
      for (var k = 0; k < list.length; k++) {
        var p2 = list[k];
        var card = document.createElement("article");
        card.className = "mini-card";
        card.setAttribute("data-product-key", p2.key);

        var media2 = document.createElement("div");
        media2.className = "bottle-placeholder";
        media2.setAttribute("data-media", "");
        var im2 = document.createElement("img");
        im2.src = p2.image || "assets/images/logo-pixy-gold.png";
        im2.alt = p2.title || "";
        im2.loading = "lazy";
        media2.appendChild(im2);

        var t2 = document.createElement("div");
        t2.className = "mini-title";
        t2.setAttribute("data-title", "");
        t2.textContent = p2.title || "";

        var a2 = document.createElement("a");
        a2.className = "mini-cta";
        a2.setAttribute("data-cta", "");
        a2.href = "product.html?key=" + encodeURIComponent(p2.key);
        a2.textContent = "View Details";
        decorateProductLink(a2);

        card.appendChild(media2);
        card.appendChild(t2);
        card.appendChild(a2);
        track.appendChild(card);
      }
    }

    var jrWraps = document.querySelectorAll(".jr-carousel-wrap[data-jr-carousel]");
    for (var w = 0; w < jrWraps.length; w++) {
      (function (wrap) {
        var t = wrap.querySelector("[data-jr-track]");
        var prev = wrap.querySelector("[data-jr-prev]");
        var next = wrap.querySelector("[data-jr-next]");
        var viewAll = wrap.querySelector("[data-jr-viewall]");
        if (!t) return;

        function scrollByCards(dir) {
          var first = t.querySelector(".mini-card");
          var cw = first ? first.getBoundingClientRect().width : 220;
          t.scrollLeft += dir * (cw + 14);
        }

        if (prev) prev.addEventListener("click", function () { scrollByCards(-1); });
        if (next) next.addEventListener("click", function () { scrollByCards(1); });
        if (viewAll) viewAll.addEventListener("click", function () {
          var cat = wrap.getAttribute("data-jr-category") || "Bottles";
          window.location.href = "shop.html?view=" + encodeURIComponent(cat);
        });
      })(jrWraps[w]);
    }
  }

  function enhanceShopCards() {
    var grid = document.querySelector(".grid.products");
    if (!grid) return;

    var products = getProducts();
    if (!products || !products.length) return;

    var byKey = {};
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      if (p && p.key) byKey[p.key] = p;
    }

    var cards = grid.querySelectorAll("article.card.product[id]");
    for (var c = 0; c < cards.length; c++) {
      var card = cards[c];
      var key = card.id;
      var prod = byKey[key];
      if (!prod) continue;

      var placeholder = card.querySelector(".pouch-placeholder");
      if (placeholder && prod.image) {
        placeholder.style.backgroundImage = 'url("' + prod.image + '")';
        placeholder.style.backgroundRepeat = "no-repeat";
        placeholder.style.backgroundPosition = "center";
        placeholder.style.backgroundSize = "contain";
      }

      var cta = card.querySelector("a.btn.btn-primary");
      if (cta) cta.setAttribute("href", "product.html?key=" + encodeURIComponent(prod.key));
    }
  }

  function enhanceJuniorsCards() {
    var pageHasJuniors = document.querySelector(".juniors-hero");
    if (!pageHasJuniors) return;

    var products = getProducts();
    if (!products || !products.length) return;

    var bottles = [];
    var books = [];
    for (var i = 0; i < products.length; i++) {
      if (!products[i]) continue;
      if (products[i].category === "Bottles") bottles.push(products[i]);
      if (products[i].category === "Books") books.push(products[i]);
    }

    var bottleCards = document.querySelectorAll(".juniors-card .bottle-placeholder");
    for (var b = 0; b < bottleCards.length; b++) {
      var ph = bottleCards[b];
      var p = bottles[b];
      if (!p) continue;

      if (p.image) {
        ph.style.backgroundImage = 'url("' + p.image + '")';
        ph.style.backgroundRepeat = "no-repeat";
        ph.style.backgroundPosition = "center";
        ph.style.backgroundSize = "contain";
      }

      var card = ph.closest(".mini-card");
      if (!card) continue;

      var titleEl = card.querySelector(".mini-title");
      if (titleEl && p.title) titleEl.textContent = p.title;

      var cta = card.querySelector(".mini-cta");
      if (cta) cta.setAttribute("href", "product.html?key=" + encodeURIComponent(p.key));
    }

    var bookCards = document.querySelectorAll(".juniors-card .book-placeholder");
    for (var k = 0; k < bookCards.length; k++) {
      var ph2 = bookCards[k];
      var p2 = books[k];
      if (!p2) continue;

      if (p2.image) {
        ph2.style.backgroundImage = 'url("' + p2.image + '")';
        ph2.style.backgroundRepeat = "no-repeat";
        ph2.style.backgroundPosition = "center";
        ph2.style.backgroundSize = "contain";
      }

      var card2 = ph2.closest(".mini-card");
      if (!card2) continue;

      var titleEl2 = card2.querySelector(".mini-title");
      if (titleEl2 && p2.title) titleEl2.textContent = p2.title;

      var cta2 = card2.querySelector(".mini-cta");
      if (cta2) cta2.setAttribute("href", "product.html?key=" + encodeURIComponent(p2.key));
    }
  }

  function enhanceGiftingCards() {
    var medias = document.querySelectorAll(".gift-media");
    if (!medias || !medias.length) return;

    var products = getProducts();
    if (!products || !products.length) return;

    var pouches = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i] && products[i].category === "Pouches") pouches.push(products[i]);
    }
    if (!pouches.length) return;

    for (var m = 0; m < medias.length; m++) {
      var media = medias[m];
      var holders = media.querySelectorAll(".pouch-placeholder");
      if (!holders || !holders.length) continue;

      for (var h = 0; h < holders.length; h++) {
        var idx = (m * 3 + h) % pouches.length;
        var p = pouches[idx];
        if (!p) continue;

        holders[h].style.backgroundImage = 'url("' + (p.image || "assets/images/logo-pixy-gold.png") + '")';
        holders[h].style.backgroundRepeat = "no-repeat";
        holders[h].style.backgroundPosition = "center";
        holders[h].style.backgroundSize = "contain";
      }
    }
  }

  // ======================================================
  // Index hero carousel (single controller)
  // ======================================================
  function setupHeroCarousel() {
    var stack = document.getElementById("heroStack");
    var prev = document.getElementById("heroPrev");
    var next = document.getElementById("heroNext");
    var name = document.getElementById("heroName");
    var cta  = document.getElementById("heroCta");
 if (!stack) return;


    var products = getProducts();
    if (!products || !products.length) return;

    function norm(s) { return String(s || "").trim().toLowerCase(); }

    var pouches = [];
    for (var i = 0; i < products.length; i++) {
      var p0 = products[i];
      if (!p0) continue;
      if (norm(p0.category) !== "pouches") continue;
      pouches.push(p0);
    }
    if (!pouches.length) return;

    stack.innerHTML = "";

    var imgs = [];
    var idx = 0;

    function safeIndex(n, len) { return (n + len) % len; }

    function apply() {
      if (!imgs.length) return;

      var len = imgs.length;
      for (var k = 0; k < len; k++) imgs[k].className = "pos-hidden";

      var a0 = safeIndex(idx, len);
      var aM1 = safeIndex(idx - 1, len);
      var aP1 = safeIndex(idx + 1, len);
      var aM2 = safeIndex(idx - 2, len);
      var aP2 = safeIndex(idx + 2, len);

      imgs[a0].className = "pos-active";
      if (len > 1) imgs[aM1].className = "pos-prev";
      if (len > 2) imgs[aP1].className = "pos-next";
      if (len > 3) imgs[aM2].className = "pos-prev2";
      if (len > 4) imgs[aP2].className = "pos-next2";

      var p = pouches[a0];
     if (name) name.textContent = p && p.title ? p.title : "";
if (cta && p && p.key) {
  cta.setAttribute("href", "product.html?key=" + encodeURIComponent(p.key));
}

    }

    for (var j = 0; j < pouches.length; j++) {
      (function (p) {
        var img = document.createElement("img");
        img.src = (p.image && String(p.image).trim()) ? String(p.image).trim() : "assets/images/logo-pixy-gold.png";
        img.alt = p.title || "";
        img.className = "pos-hidden";
        img.dataset.key = p.key || "";

        img.onerror = function () {
          if (img.dataset.fallbackApplied === "1") return;
          img.dataset.fallbackApplied = "1";
          img.src = "assets/images/logo-pixy-gold.png";
        };

        img.addEventListener("click", function (e) {
          if (!this.classList || !this.classList.contains("pos-active")) return;
          e.preventDefault();
          e.stopPropagation();
          var key = this.dataset.key;
          if (!key) return;
          rememberListingPage();
          window.location.href = "product.html?key=" + encodeURIComponent(key);
        });

        stack.appendChild(img);
        imgs.push(img);
      })(pouches[j]);
    }

    prev.addEventListener("click", function () {
      idx = (idx - 1 + imgs.length) % imgs.length;
      apply();
    });

    next.addEventListener("click", function () {
      idx = (idx + 1) % imgs.length;
      apply();
    });

    apply();
  }

  // ======================================================
  // Hero swipe (index)
  // ======================================================
  function setupHeroSwipe() {
    var stage = document.getElementById("heroStage");
    var prev = document.getElementById("heroPrev");
    var next = document.getElementById("heroNext");
    if (!stage || !prev || !next) return;

    if (stage.getAttribute("data-swipe-wired") === "1") return;
    stage.setAttribute("data-swipe-wired", "1");

    var startX = 0, startY = 0, tracking = false, moved = false;

    function shouldIgnoreTarget(t) {
      if (!t) return false;
      return !!(t.closest && t.closest("button,a,input,textarea,select"));
    }

    stage.addEventListener("touchstart", function (e) {
      if (shouldIgnoreTarget(e.target)) return;
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      moved = false;
    }, { passive: true });

    stage.addEventListener("touchmove", function (e) {
      if (!tracking) return;
      var p = e.touches && e.touches[0] ? e.touches[0] : null;
      if (!p) return;
      var dx = p.clientX - startX;
      var dy = p.clientY - startY;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) moved = true;
    }, { passive: true });

    stage.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      if (!moved) return;

      var end = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
      if (!end) return;

      var dx = end.clientX - startX;
      var threshold = Math.max(60, Math.floor(stage.clientWidth * 0.12));
      if (dx > threshold) prev.click();
      else if (dx < -threshold) next.click();
    }, { passive: true });
  }

  // ======================================================
  // Dust canvas
  // ======================================================
  function setupHeroDust() {
    var canvas = document.getElementById("heroDust");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var W = 0, H = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    var N = Math.min(160, Math.max(80, Math.floor((W * H) / 11000)));
    var parts = [];
    for (var i = 0; i < N; i++) parts.push(spawn(true));

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function spawn(initial) {
      return {
        x: rnd(0, W),
        y: initial ? rnd(0, H) : -rnd(10, 120),
        r: rnd(0.8, 2.2),
        vy: rnd(0.35, 1.25),
        vx: rnd(-0.35, 0.35),
        a: rnd(0.10, 0.35),
        tw: rnd(0.8, 1.8),
        t: rnd(0, Math.PI * 2)
      };
    }

    var raf = 0;
    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.t += 0.02 * p.tw;
        p.x += p.vx + Math.sin(p.t) * 0.18;
        p.y += p.vy;

        if (p.y > H + 20 || p.x < -40 || p.x > W + 40) {
          parts[i] = spawn(false);
          continue;
        }

        ctx.beginPath();
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#d8b35a";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    }

    tick();
  }

  // ======================================================
  // Product page: Add to Cart button wiring
  // ======================================================
  function wireProductAddToCart() {
    var btn = document.getElementById("addToCartBtn");
    if (!btn) return;

    var key = getParam("key");
    if (!key) return;

    var p = getProductByKey(key);
    if (!p) return;

    if (btn.getAttribute("data-wired") === "1") return;
    btn.setAttribute("data-wired", "1");

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (p.ecwidProductId == null) return;
      addToCart(p.ecwidProductId, 1);
    });
  }

  // ======================================================
  // Ecwid loader + cart helpers
  // ======================================================
  function ecwidReadyNow() {
    return (
      window.Ecwid &&
      window.Ecwid.Cart &&
      typeof window.Ecwid.openPage === "function" &&
      typeof window.Ecwid.Cart.addProduct === "function"
    );
  }

  function ensureEcwidLoaded() {
    return new Promise(function (resolve, reject) {
      if (ecwidReadyNow()) { resolve(true); return; }

      var existing =
        document.querySelector('script[data-ecwid="true"]') ||
        document.querySelector('script[src*="app.ecwid.com/script.js?' + String(ECWID_STORE_ID) + '"]');

      if (!existing) {
        window.ec = window.ec || {};
        window.ec.storefront = window.ec.storefront || {};
        window.ec.storefront.enable_catalog = false;

        var s = document.createElement("script");
        s.src = "https://app.ecwid.com/script.js?" + ECWID_STORE_ID + "&data_platform=code&data_date=2026-01-01";
        s.async = true;
        s.charset = "utf-8";
        s.setAttribute("data-ecwid", "true");
        s.onload = function () { waitForEcwid(resolve, reject); };
        s.onerror = function () { reject(new Error("Ecwid script failed to load")); };
        document.head.appendChild(s);
      } else {
        waitForEcwid(resolve, reject);
      }
    });
  }

  function waitForEcwid(resolve, reject) {
    if (window.Ecwid && typeof window.Ecwid.OnAPILoaded === "function") {
      try {
        window.Ecwid.OnAPILoaded.add(function () {
          if (ecwidReadyNow()) resolve(true);
        });
      } catch (e) {}
    }
    var start = Date.now();
    var t = setInterval(function () {
      if (ecwidReadyNow()) { clearInterval(t); resolve(true); return; }
      if (Date.now() - start > 12000) { clearInterval(t); reject(new Error("Ecwid not ready")); }
    }, 120);
  }

  function openEcwidCart() {
    return ensureEcwidLoaded().then(function () {
      window.Ecwid.openPage("cart");
      return true;
    }).catch(function () { return false; });
  }

  function addToCart(ecwidProductId, qty) {
    qty = qty || 1;
    var id = Number(ecwidProductId);
    if (!id || !isFinite(id)) return Promise.resolve(false);

    return ensureEcwidLoaded().then(function () {
      window.Ecwid.Cart.addProduct({ id: id, quantity: qty });
      window.Ecwid.openPage("cart");
      return true;
    }).catch(function () { return false; });
  }

  // ======================================================
  // Cart buttons
  // ======================================================
  function setupOpenCartButtons() {
    function bind(el) {
      if (!el) return;
      if (el.getAttribute("data-cart-wired") === "1") return;
      el.setAttribute("data-cart-wired", "1");

      el.addEventListener("click", function (e) {
        e.preventDefault();
        openEcwidCart();
      });
    }

    bind(document.getElementById("openCartBtn"));
    bind(document.getElementById("openCartInlineBtn"));

    var els = document.querySelectorAll("[data-open-cart], .cart-btn, a[href='#cart'], a[href='cart']");
    for (var i = 0; i < els.length; i++) bind(els[i]);
  }

  // ======================================================
  // Pixy Assistant shell (open/close + draggable)
  // ======================================================
  function setupChatShell() {
    var openBtn = document.querySelector("[data-chat-open]");
    var chat = document.querySelector("[data-chat]");
    if (!openBtn || !chat) return;

    var closeBtn = chat.querySelector("[data-chat-close]") || chat.querySelector(".chat-close");
    var handle = chat.querySelector(".chat-head");

    var open = false;
    try { open = localStorage.getItem(LS_OPEN) === "1"; } catch (e) { open = false; }
    setChatOpen(open);

    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      setChatOpen(chat.hidden);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setChatOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !chat.hidden) setChatOpen(false);
    });

    document.addEventListener("mousedown", function (e) {
      if (chat.hidden) return;
      var t = e.target;
      if (!t) return;
      if (chat.contains(t)) return;
      if (openBtn.contains(t)) return;
      setChatOpen(false);
    });

    if (handle) enableDrag(chat, handle);

    function setChatOpen(isOpen) {
      chat.hidden = !isOpen;
      chat.style.display = isOpen ? "" : "none";
      openBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      chat.setAttribute("aria-hidden", isOpen ? "false" : "true");
      try { localStorage.setItem(LS_OPEN, isOpen ? "1" : "0"); } catch (e) {}
      if (isOpen) restoreChatPosition(chat);
    }
  }

  function enableDrag(box, handle) {
    var dragging = false;
    var startX = 0, startY = 0, startLeft = 0, startTop = 0;

    handle.style.cursor = "move";

    function pointerXY(e) {
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      var close = e.target && e.target.closest ? e.target.closest("[data-chat-close], .chat-close") : null;
      if (close) return;

      dragging = true;

      var rect = box.getBoundingClientRect();
      box.style.position = "fixed";
      box.style.left = rect.left + "px";
      box.style.top = rect.top + "px";
      box.style.right = "auto";
      box.style.bottom = "auto";

      var p = pointerXY(e);
      startX = p.x;
      startY = p.y;
      startLeft = rect.left;
      startTop = rect.top;

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    }

    function onMove(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();

      var p = pointerXY(e);
      var left = startLeft + (p.x - startX);
      var top = startTop + (p.y - startY);

      var pad = 10;
      var maxLeft = window.innerWidth - box.offsetWidth - pad;
      var maxTop = window.innerHeight - box.offsetHeight - pad;

      if (left < pad) left = pad;
      if (top < pad) top = pad;
      if (left > maxLeft) left = maxLeft;
      if (top > maxTop) top = maxTop;

      box.style.left = left + "px";
      box.style.top = top + "px";
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;

      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);

      saveChatPosition(box);
    }

    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, { passive: true });
  }

  function saveChatPosition(box) {
    try {
      var rect = box.getBoundingClientRect();
      localStorage.setItem(LS_POS, JSON.stringify({ left: rect.left, top: rect.top }));
    } catch (e) {}
  }

  function restoreChatPosition(box) {
    try {
      var raw = localStorage.getItem(LS_POS);
      if (!raw) return;
      var pos = JSON.parse(raw);
      if (!pos) return;

      box.style.position = "fixed";
      box.style.left = Math.max(10, Number(pos.left) || 10) + "px";
      box.style.top = Math.max(10, Number(pos.top) || 10) + "px";
      box.style.right = "auto";
      box.style.bottom = "auto";
    } catch (e) {}
  }

  // ======================================================
  // Horizontal swipe for existing scroll rows (no new UI)
  // ======================================================
  function enableSwipeOnHorizontalScroll() {
    var selectors = [
      ".pouch-carousel",
      ".spices-row",
      ".junior-bottles-row",
      ".juniors-bottles-row",
      ".horizontal-scroll",
      "[data-swipe-scroll]"
    ];

    var wiredAttr = "data-swipe-scroll-wired";
    var els = [];
    for (var i = 0; i < selectors.length; i++) {
      var found = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < found.length; j++) els.push(found[j]);
    }

    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      if (!el || el.nodeType !== 1) continue;
      if (el.getAttribute(wiredAttr) === "1") continue;
      if (!isHorizontalScrollable(el)) continue;

      el.setAttribute(wiredAttr, "1");
      attachScrollDrag(el);
    }
  }

  function isHorizontalScrollable(el) {
    if (!el) return false;
    if (el === document.body || el === document.documentElement) return false;

    if (el.scrollWidth <= el.clientWidth + 5) return false;

    var cs = window.getComputedStyle(el);
    var ox = cs.overflowX;
    if (ox !== "auto" && ox !== "scroll") return false;

    return true;
  }

  function attachScrollDrag(el) {
    var down = false;
    var startX = 0;
    var startLeft = 0;

    function shouldIgnoreTarget(t) {
      if (!t) return false;
      return !!(t.closest && t.closest("a,button,input,textarea,select,label"));
    }

    function getClientX(e) {
      if (e.touches && e.touches[0]) return e.touches[0].clientX;
      return e.clientX;
    }

    el.addEventListener("touchstart", function (e) {
      if (shouldIgnoreTarget(e.target)) return;
      if (!e.touches || e.touches.length !== 1) return;
      down = true;
      startX = getClientX(e);
      startLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener("touchmove", function (e) {
      if (!down) return;
      var x = getClientX(e);
      var dx = x - startX;
      el.scrollLeft = startLeft - dx;
    }, { passive: true });

    el.addEventListener("touchend", function () {
      down = false;
    }, { passive: true });

    el.addEventListener("mousedown", function (e) {
      if (shouldIgnoreTarget(e.target)) return;
      if (e.button !== 0) return;
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;

      function onMove(ev) {
        if (!down) return;
        var dx = ev.clientX - startX;
        el.scrollLeft = startLeft - dx;
      }

      function onUp() {
        down = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

})();

