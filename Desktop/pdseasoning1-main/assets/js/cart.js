// ================================================================
// PIXY DUST — assets/js/cart.js
//
// Custom luxury cart drawer.
// Reads cart data from Ecwid's JS API and renders a fully branded
// slide-in panel. Ecwid handles all underlying cart operations.
//
// Registers:  window.PIXY_CART = { open, close, refresh }
// main.js checks window.PIXY_CART before falling back to Ecwid's
// native openPage("cart").
//
// Cart flow:
//   Cart button click → custom drawer opens
//   Items rendered from Ecwid.Cart.get()
//   Qty +/– and remove fire Ecwid.Cart mutations
//   Ecwid.OnCartChanged re-renders the drawer + badge
//   "Proceed to Checkout" closes drawer + opens Ecwid checkout
//
// No dependencies beyond main.js (for ensureEcwidLoaded) and the DOM.
// ================================================================

(function () {
  "use strict";

  // ── Config ───────────────────────────────────────────────────────
  var FALLBACK_IMG = "assets/images/logo-circle.png";

  // ── State ────────────────────────────────────────────────────────
  var _overlay   = null;
  var _bodyEl    = null;
  var _footEl    = null;
  var _isOpen    = false;
  var _listening = false;
  var _busy      = false;
  var _lastCart  = null;

  // ── Utilities ────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(val) {
    if (val == null || val === "") return "";
    var n = parseFloat(val);
    return isNaN(n) ? String(val) : "$" + n.toFixed(2);
  }

  function optionsLabel(item) {
    try {
      if (item.selectedOptions && item.selectedOptions.length) {
        return item.selectedOptions
          .map(function (o) {
            var k = o.name || o.type || "";
            var v = o.value || o.selection || o.text || "";
            return k && v ? k + ": " + v : "";
          })
          .filter(Boolean)
          .join(" · ");
      }
      if (item.options && typeof item.options === "object") {
        var keys = Object.keys(item.options);
        if (keys.length) {
          return keys.map(function (k) { return k + ": " + item.options[k]; }).join(" · ");
        }
      }
    } catch (_) {}
    return "";
  }

  function reconstructOptions(item) {
    try {
      if (item.options && typeof item.options === "object" && Object.keys(item.options).length) {
        return item.options;
      }
      if (item.selectedOptions && item.selectedOptions.length) {
        var opts = {};
        item.selectedOptions.forEach(function (o) {
          var k = o.name || o.type || "";
          var v = o.value || o.selection || o.text || "";
          if (k) opts[k] = v;
        });
        return Object.keys(opts).length ? opts : null;
      }
    } catch (_) {}
    return null;
  }

  function resolveImg(item) {
    var p = item.product || {};
    if (p.imageUrl)     return p.imageUrl;
    if (p.thumbnailUrl) return p.thumbnailUrl;
    var pid = p.id;
    if (pid) {
      var prods = window.PIXY_PRODUCTS || (window.PIXY && window.PIXY.getProducts && window.PIXY.getProducts());
      if (Array.isArray(prods)) {
        for (var i = 0; i < prods.length; i++) {
          if (Number(prods[i].ecwidProductId) === Number(pid) && prods[i].image) {
            return prods[i].image;
          }
        }
      }
    }
    return FALLBACK_IMG;
  }

  // ── Build drawer DOM (once) ───────────────────────────────────────
  function buildDrawer() {
    var overlay = document.createElement("div");
    overlay.id        = "pixy-cart-overlay";
    overlay.className = "cart-drawer-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden    = true;

    var drawer = document.createElement("div");
    drawer.className = "cart-drawer";
    drawer.setAttribute("role",       "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Your cart");

    // Head
    var head = document.createElement("div");
    head.className = "cart-drawer-head";

    var headLeft = document.createElement("div");
    headLeft.className = "cart-drawer-head-left";

    var spark = document.createElement("span");
    spark.className = "cart-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.textContent = "✦";

    var titleEl = document.createElement("span");
    titleEl.className = "cart-drawer-title";
    titleEl.textContent = "Your Cart";

    headLeft.appendChild(spark);
    headLeft.appendChild(titleEl);

    var closeBtn = document.createElement("button");
    closeBtn.type      = "button";
    closeBtn.className = "cart-drawer-close";
    closeBtn.setAttribute("aria-label", "Close cart");
    closeBtn.textContent = "×";

    head.appendChild(headLeft);
    head.appendChild(closeBtn);

    // Body (scrollable)
    var body = document.createElement("div");
    body.className = "cart-drawer-body";
    body.id        = "pixy-cart-body";

    // Foot (subtotal + checkout)
    var foot = document.createElement("div");
    foot.className = "cart-drawer-foot";
    foot.id        = "pixy-cart-foot";
    foot.hidden    = true;

    drawer.appendChild(head);
    drawer.appendChild(body);
    drawer.appendChild(foot);
    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    // Events
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeDrawer();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && _isOpen) closeDrawer();
    });

    _overlay = overlay;
    _bodyEl  = body;
    _footEl  = foot;
  }

  // ── Render states ─────────────────────────────────────────────────
  function showLoading() {
    if (!_bodyEl) return;
    _bodyEl.innerHTML =
      '<div class="cart-loading">' +
        '<span class="cart-loading-dot"></span>' +
        '<span class="cart-loading-dot"></span>' +
        '<span class="cart-loading-dot"></span>' +
      '</div>';
    if (_footEl) _footEl.hidden = true;
  }

  function showEmpty() {
    if (!_bodyEl) return;
    _bodyEl.innerHTML =
      '<div class="cart-empty">' +
        '<span class="cart-empty-icon" aria-hidden="true">✦</span>' +
        '<p>Your cart is empty.</p>' +
      '</div>';
    if (_footEl) _footEl.hidden = true;

    var browseBtn = document.createElement("button");
    browseBtn.type      = "button";
    browseBtn.className = "btn btn-secondary cart-drawer-continue";
    browseBtn.textContent = "Browse Products";
    browseBtn.addEventListener("click", closeDrawer);
    _bodyEl.querySelector(".cart-empty").appendChild(browseBtn);
  }

  function renderItems(cart) {
    if (!_bodyEl) return;
    if (!cart || !cart.items || !cart.items.length) { showEmpty(); return; }

    var html = "";
    var items = cart.items;

    for (var i = 0; i < items.length; i++) {
      var item   = items[i];
      var prod   = item.product || {};
      var name   = prod.name || "Product";
      var qty    = item.quantity || 1;
      var unitPx = item.price != null ? parseFloat(item.price) : parseFloat(prod.price || 0);
      var linePx = item.total != null ? parseFloat(item.total) : (unitPx * qty);
      var fmtPx  = fmt(isNaN(linePx) ? unitPx : linePx);
      var opts   = optionsLabel(item);
      var imgSrc = resolveImg(item);

      html +=
        '<article class="cart-item" data-item-index="' + i + '">' +
          '<div class="cart-item-img">' +
            '<img src="' + esc(imgSrc) + '" alt="' + esc(name) + '" loading="lazy"' +
              ' onerror="this.onerror=null;this.src=\'' + FALLBACK_IMG + '\'">' +
          '</div>' +
          '<div class="cart-item-info">' +
            '<p class="cart-item-name" title="' + esc(name) + '">' + esc(name) + '</p>' +
            (opts ? '<p class="cart-item-options">' + esc(opts) + '</p>' : '') +
            '<div class="cart-item-controls">' +
              '<button class="cart-qty-btn" type="button" aria-label="Decrease quantity"' +
                ' data-action="dec" data-index="' + i + '">−</button>' +
              '<span class="cart-qty-val" aria-label="Quantity: ' + qty + '">' + qty + '</span>' +
              '<button class="cart-qty-btn" type="button" aria-label="Increase quantity"' +
                ' data-action="inc" data-index="' + i + '">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-right">' +
            '<span class="cart-item-price">' + (fmtPx || "") + '</span>' +
            '<button class="cart-item-remove" type="button" aria-label="Remove ' + esc(name) + '"' +
              ' data-action="remove" data-index="' + i + '">×</button>' +
          '</div>' +
        '</article>';
    }

    _bodyEl.innerHTML = html;

    // Wire action buttons
    var btns = _bodyEl.querySelectorAll("[data-action]");
    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener("click", handleItemAction);
    }

    renderFoot(cart);
  }

  function renderFoot(cart) {
    if (!_footEl) return;
    _footEl.hidden  = false;
    _footEl.innerHTML = "";

    var subtotalRow = document.createElement("div");
    subtotalRow.className = "cart-drawer-subtotal";

    var label = document.createElement("span");
    label.textContent = "Subtotal";
    var amount = document.createElement("span");
    amount.textContent = cart.subtotal != null ? fmt(cart.subtotal) : "—";
    subtotalRow.appendChild(label);
    subtotalRow.appendChild(amount);

    var note = document.createElement("p");
    note.className   = "cart-drawer-note";
    note.textContent = "Shipping and taxes calculated at checkout.";

    var checkoutBtn = document.createElement("button");
    checkoutBtn.type      = "button";
    checkoutBtn.className = "btn btn-gold cart-drawer-checkout";
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.addEventListener("click", goToCheckout);

    var continueBtn = document.createElement("button");
    continueBtn.type      = "button";
    continueBtn.className = "btn btn-secondary cart-drawer-continue";
    continueBtn.textContent = "Continue Shopping";
    continueBtn.addEventListener("click", closeDrawer);

    _footEl.appendChild(subtotalRow);
    _footEl.appendChild(note);
    _footEl.appendChild(checkoutBtn);
    _footEl.appendChild(continueBtn);
  }

  // ── Item actions ──────────────────────────────────────────────────
  function handleItemAction(e) {
    if (_busy) return;
    var btn    = e.currentTarget;
    var action = btn.getAttribute("data-action");
    var idx    = parseInt(btn.getAttribute("data-index"), 10);
    if (isNaN(idx) || !_lastCart || !_lastCart.items) return;
    var item = _lastCart.items[idx];
    if (!item) return;

    var qty  = item.quantity || 1;
    var pid  = item.product && item.product.id;
    var opts = reconstructOptions(item);

    if (action === "remove") {
      mutate(function () { window.Ecwid.Cart.removeProduct(idx); });
    } else if (action === "dec") {
      if (qty <= 1) {
        mutate(function () { window.Ecwid.Cart.removeProduct(idx); });
      } else {
        // Remove then re-add with qty-1 to decrement
        mutate(function () {
          window.Ecwid.Cart.removeProduct(idx);
          // Re-add happens after OnCartChanged confirms removal
          _pendingReAdd = { pid: pid, qty: qty - 1, opts: opts };
        });
      }
    } else if (action === "inc") {
      mutate(function () {
        var payload = { id: pid, quantity: 1 };
        if (opts) payload.options = opts;
        window.Ecwid.Cart.addProduct(payload);
      });
    }
  }

  // Pending re-add for decrement (fire after removal is confirmed)
  var _pendingReAdd = null;

  function mutate(fn) {
    _busy = true;
    try { fn(); } catch (e) { _busy = false; }
  }

  // ── Ecwid cart change listener ────────────────────────────────────
  function setupCartChangeListener() {
    if (_listening) return;
    _listening = true;

    if (!window.Ecwid || !window.Ecwid.OnCartChanged ||
        typeof window.Ecwid.OnCartChanged.add !== "function") return;

    window.Ecwid.OnCartChanged.add(function (cart) {
      _lastCart = cart;
      _busy     = false;

      // Handle pending re-add (from decrement operation)
      if (_pendingReAdd) {
        var reAdd = _pendingReAdd;
        _pendingReAdd = null;
        if (reAdd.pid && reAdd.qty > 0) {
          _busy = true;
          var payload = { id: reAdd.pid, quantity: reAdd.qty };
          if (reAdd.opts) payload.options = reAdd.opts;
          try { window.Ecwid.Cart.addProduct(payload); } catch (e) { _busy = false; }
          return; // wait for next OnCartChanged after re-add
        }
      }

      updateBadge(cart ? (cart.productsQuantity || 0) : 0);
      if (_isOpen && _bodyEl) renderItems(cart);
    });
  }

  // ── Badge ─────────────────────────────────────────────────────────
  function updateBadge(count) {
    var badges = document.querySelectorAll(".cart-badge[data-cart-badge]");
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count > 0 ? String(count) : "";
      badges[i].hidden      = count <= 0;
    }
  }

  function injectBadges() {
    var btns = document.querySelectorAll("#openCartBtn, .cart-btn");
    for (var i = 0; i < btns.length; i++) {
      if (!btns[i].querySelector("[data-cart-badge]")) {
        var badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.setAttribute("data-cart-badge", "");
        badge.hidden    = true;
        btns[i].appendChild(badge);
      }
    }
  }

  // ── Cart fetch ────────────────────────────────────────────────────
  function fetchAndRender() {
    if (!window.Ecwid || !window.Ecwid.Cart ||
        typeof window.Ecwid.Cart.get !== "function") {
      showEmpty(); return;
    }
    try {
      window.Ecwid.Cart.get(function (cart) {
        _lastCart = cart;
        updateBadge(cart ? (cart.productsQuantity || 0) : 0);
        renderItems(cart);
      });
    } catch (e) {
      showEmpty();
    }
  }

  // ── Open / Close ──────────────────────────────────────────────────
  function openDrawer() {
    if (!_overlay) buildDrawer();
    if (_isOpen)  return;

    // Prevent body scroll, compensate for scrollbar width
    var scrollW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow    = "hidden";
    if (scrollW > 0) document.body.style.paddingRight = scrollW + "px";

    _overlay.hidden = false;
    _overlay.removeAttribute("aria-hidden");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        _overlay.classList.add("cart-drawer--open");
      });
    });

    _isOpen = true;
    showLoading();

    var pixy = window.PIXY;
    var load = (pixy && typeof pixy.ensureEcwidLoaded === "function")
      ? pixy.ensureEcwidLoaded("add")
      : Promise.resolve(true);

    load
      .then(function () {
        setupCartChangeListener();
        fetchAndRender();
      })
      .catch(function () { fetchAndRender(); });
  }

  function closeDrawer() {
    if (!_overlay || !_isOpen) return;
    _overlay.classList.remove("cart-drawer--open");
    _isOpen = false;
    document.body.style.overflow    = "";
    document.body.style.paddingRight = "";
    _overlay.setAttribute("aria-hidden", "true");
    setTimeout(function () {
      if (!_isOpen && _overlay) _overlay.hidden = true;
    }, 350);
  }

  // ── Checkout ──────────────────────────────────────────────────────
  function goToCheckout() {
    closeDrawer();
    var pixy = window.PIXY;
    var load = (pixy && typeof pixy.ensureEcwidLoaded === "function")
      ? pixy.ensureEcwidLoaded("cart")
      : Promise.resolve(true);
    load
      .then(function () {
        if (window.Ecwid && typeof window.Ecwid.openPage === "function") {
          window.Ecwid.openPage("cart");
        }
      })
      .catch(function () {});
  }

  // ── Public API ────────────────────────────────────────────────────
  window.PIXY_CART = {
    open:    openDrawer,
    close:   closeDrawer,
    refresh: fetchAndRender
  };

  // ── Boot ──────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    injectBadges();

    var pixy = window.PIXY;
    var load = (pixy && typeof pixy.ensureEcwidLoaded === "function")
      ? pixy.ensureEcwidLoaded("add")
      : Promise.resolve(true);

    load
      .then(function () {
        setupCartChangeListener();
        if (window.Ecwid && window.Ecwid.Cart &&
            typeof window.Ecwid.Cart.get === "function") {
          window.Ecwid.Cart.get(function (cart) {
            _lastCart = cart;
            updateBadge(cart ? (cart.productsQuantity || 0) : 0);
          });
        }
      })
      .catch(function () {});
  });

})();
