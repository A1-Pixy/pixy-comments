// ======================================================
// PIXY DUST — chatbot.js
// Front-end only Pixy Assistant (no external APIs)
// - Transcript persists across pages (localStorage)
// - Works with the chat shell created in index.html (data-chat-...)
// ======================================================

(function () {
  "use strict";

  var LS_TRANSCRIPT = "pixy_chat_transcript_v1";
  var SS_SESSION = "pixy_chat_session_started_v1";

  function getSessionStorage() {
    try { return window.sessionStorage; } catch (e) { return null; }
  }

  // Reset transcript once per browser tab session.
  (function resetTranscriptPerSession(){
    var ss = getSessionStorage();
    if (!ss) return;
    try {
      if (!ss.getItem(SS_SESSION)) {
        ss.setItem(SS_SESSION, "1");
        try { localStorage.removeItem(LS_TRANSCRIPT); } catch (e2) {}
      }
    } catch (e) {}
  })();

  document.addEventListener("DOMContentLoaded", function () {
    initPixyAssistant();
  });

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function loadTranscript() {
    try {
      var ss = getSessionStorage();
      var store = ss || localStorage;
      var raw = store.getItem(LS_TRANSCRIPT);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTranscript(list) {
    try {
      var ss = getSessionStorage();
      var store = ss || localStorage;
      store.setItem(LS_TRANSCRIPT, JSON.stringify(list));
    } catch (e) {}
  }

  function appendMessage(bodyEl, role, text) {
    var row = document.createElement("div");
    row.className = "chat-row " + (role === "user" ? "is-user" : "is-bot");

    var bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderTranscript(bodyEl, transcript) {
    bodyEl.innerHTML = "";
    transcript.forEach(function (m) {
      if (!m || !m.role || typeof m.text !== "string") return;
      appendMessage(bodyEl, m.role, m.text);
    });
  }

  function normalize(s) {
    return String(s || "").trim().toLowerCase();
  }

  function matchProduct(q) {
    var list = Array.isArray(window.PIXY_PRODUCTS) ? window.PIXY_PRODUCTS : [];
    var nq = normalize(q);

    // direct key match
    for (var i = 0; i < list.length; i++) {
      if (normalize(list[i].key) === nq) return list[i];
    }

    // title contains
    for (var j = 0; j < list.length; j++) {
      var t = normalize(list[j].title);
      if (t && nq && (t.indexOf(nq) !== -1 || nq.indexOf(t) !== -1)) return list[j];
    }

    // keyword match (simple)
    for (var k = 0; k < list.length; k++) {
      var tt = normalize(list[k].title);
      if (!tt) continue;
      if (nq.includes(tt)) return list[k];
    }
    return null;
  }

  
function responseFor(message){
  const t = (message || "").toLowerCase();

  // Identify blend by keywords.
  const alias = [
    { key: "universal-all-purpose-pouch", re: /(universal|all purpose|all-purpose|ap\b)/i },
    { key: "sugar-free-universal-all-purpose-pouch", re: /(sugar[- ]?free|sf\b)/i },
    { key: "asian-stir-fry-pouch", re: /(asian|stir\s*fry|kitchen\s*samurai)/i },
    { key: "fajita-mexican-pouch", re: /(fajita|taco|mexican)/i },
    { key: "jerk-bbq-pouch", re: /(jerk)/i },
    { key: "smoke-bbq-pouch", re: /(smoke\s*bbq|smoke\s*barbecue|bbq\b)/i },
    { key: "garlic-pepper-pouch", re: /(garlic\s*pepper|divine\s*trinity)/i },
    { key: "deep-blue-seafood-pouch", re: /(deep\s*blue|seafood)/i },
    { key: "chophouse-steak-rub-pouch", re: /(chop\s*house|chophouse|steak\s*rub|steak\s*blend)/i }
  ];

  let blendKey = "";
  for (const a of alias) {
    if (a.re.test(message)) { blendKey = a.key; break; }
  }

  const asksIngredients = /ingredient|what'?s in|what is in|contains/i.test(message);

  if (blendKey && BLEND_INFO[blendKey]) {
    const b = BLEND_INFO[blendKey];

    if (asksIngredients) {
      return b.name + " ingredients. " + b.ingredients + " If you need the label view, open the product page.";
    }

    return "Best uses for " + b.name + ". " + (b.best_on || "") + " Tap View & Order to shop this blend.";
  }

  // Food intent recommendations.
  const wants = {
    steak: /(steak|ribeye|sirloin|filet|burger|burgers)/i,
    chicken: /(chicken|wing|wings|drum|thigh)/i,
    pork: /(pork|rib|ribs|bacon|belly)/i,
    seafood: /(fish|salmon|shrimp|scallop|crab|seafood)/i,
    veg: /(vegetable|veggies|broccoli|asparagus|potato|mushroom|mushrooms)/i
  };

  if (wants.steak.test(message)) return "Try Chophouse Steak Rub or Garlic Pepper. For a quick cook, pat dry, season, sear hot, and rest before slicing.";
  if (wants.chicken.test(message)) return "Try Universal All Purpose, Jerk BBQ, or Asian Stir Fry. Season, cook until done, then finish with a light extra sprinkle.";
  if (wants.pork.test(message)) return "Try Smoke BBQ for ribs and pulled pork. Try Jerk BBQ for chops and tenderloin.";
  if (wants.seafood.test(message)) return "Try Deep Blue Seafood. For scallops or shrimp, season lightly and cook fast over high heat.";
  if (wants.veg.test(message)) return "Try Universal All Purpose or Garlic Pepper. For roasted veggies, oil lightly, season, roast until browned.";

  // Site help.
  if (/cart|checkout|shipping|tax/i.test(message)) return "Use the Cart button to review items and checkout. Shipping and tax are calculated at checkout.";
  if (/help|contact|support/i.test(message)) return "Use the Contact page for support. For quick shopping, open Shop and add items to Cart.";

  return "Ask about a blend, a recipe idea, or what to use on chicken, steak, pork, seafood, or veggies.";
}


  function initPixyAssistant() {
    var chat = $("[data-chat]");
    var bodyEl = $("[data-chat-body]", chat);
    var form = $("[data-chat-form]", chat);
    if (!chat || !bodyEl || !form) return;

    var input = form.querySelector('input[name="message"], input[type="text"], textarea');

    var transcript = loadTranscript();

    // First-run greeting
    if (!transcript.length) {
      transcript.push({ role: "bot", text: "Pixy Assistant is ready. Ask about flavors, pairings, or how to use a blend." });
      saveTranscript(transcript);
    }

    renderTranscript(bodyEl, transcript);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input) return;

      var msg = String(input.value || "").trim();
      if (!msg) return;

      transcript = loadTranscript();
      transcript.push({ role: "user", text: msg });

      var reply = responseFor(msg);
      transcript.push({ role: "bot", text: reply });

      saveTranscript(transcript);
      renderTranscript(bodyEl, transcript);

      input.value = "";
      input.focus();
    });
  }
})();
