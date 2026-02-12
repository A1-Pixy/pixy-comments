// ======================================================
// PIXY DUST — flash-sales.js
// Flash sale banner + countdown + VIP toast
// - Front-end only
// - Uses localStorage.pixy_subscribers from main.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  initFlashSales();
});

// --------- CONFIGURE YOUR SALE HERE ---------
// Edit these dates/texts whenever you run a new flash sale.
const FLASH_SALE_CONFIG = {
  enabled: true,
  // Use local time ISO strings: YYYY-MM-DDTHH:MM:SS
  // Example: today 09:00 to tomorrow 23:59
  start: "2025-12-05T09:00:00",
  end: "2025-12-07T23:59:00",
  message: "48-Hour Glow Sale · 15% off blends & trios.",
  discountLabel: "15% off"
};

const SUB_KEY = "pixy_subscribers";
const VIP_TOAST_SESSION_KEY = "pixy_vip_toast_shown";

function initFlashSales() {
  if (!FLASH_SALE_CONFIG.enabled) return;

  const banner = document.getElementById("flash-sale-banner");
  const textEl = banner ? banner.querySelector(".pd-flash-text") : null;
  const countdownEl = banner
    ? banner.querySelector(".pd-flash-countdown")
    : null;
  const toast = document.getElementById("vip-toast");

  // If the elements don't exist on this page, just bail quietly
  if (!banner || !textEl || !countdownEl) return;

  const now = new Date();
  const start = new Date(FLASH_SALE_CONFIG.start);
  const end = new Date(FLASH_SALE_CONFIG.end);

  if (!isFinite(start.getTime()) || !isFinite(end.getTime())) {
    // Misconfigured dates; do nothing.
    return;
  }

  if (now < start || now > end) {
    // Sale not active, hide banner if needed
    banner.hidden = true;
    return;
  }

  // Sale is active: show banner and start countdown
  banner.hidden = false;
  textEl.textContent =
    FLASH_SALE_CONFIG.message ||
    "Flash Sale Live · Limited time pricing on Pixy Dust blends.";
  countdownEl.textContent = formatTimeRemaining(end - now);

  let timerId = window.setInterval(() => {
    const remaining = end - new Date();
    if (remaining <= 0) {
      window.clearInterval(timerId);
      banner.hidden = true;
      return;
    }
    countdownEl.textContent = formatTimeRemaining(remaining);
  }, 1000);

  // VIP toast: only if subscriber + sale active + not shown this session
  if (shouldShowVipToast()) {
    showVipToast(toast);
  }
}

function formatTimeRemaining(ms) {
  if (ms <= 0) return "Sale ending…";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours <= 0 && minutes <= 0) {
    return `Ends in ${seconds}s`;
  }
  if (hours <= 0) {
    return `Ends in ${minutes}m ${seconds}s`;
  }
  return `Ends in ${hours}h ${minutes}m ${seconds}s`;
}

function shouldShowVipToast() {
  // Has toast been shown this session?
  try {
    if (sessionStorage.getItem(VIP_TOAST_SESSION_KEY) === "1") {
      return false;
    }
  } catch {
    // ignore if sessionStorage not available
  }

  // Is user a subscriber?
  let subscribers = [];
  try {
    const raw = localStorage.getItem(SUB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        subscribers = parsed;
      }
    }
  } catch {
    // ignore if localStorage not available
  }

  return subscribers.length > 0;
}

function showVipToast(toastEl) {
  if (!toastEl) return;

  toastEl.hidden = false;
  toastEl.classList.add("is-visible");

  try {
    sessionStorage.setItem(VIP_TOAST_SESSION_KEY, "1");
  } catch {
    // ignore if sessionStorage not available
  }

  // Auto-hide after a few seconds
  window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    toastEl.hidden = true;
  }, 6000);
}
