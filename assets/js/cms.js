// ======================================================
// PIXY DUST — cms.js
// Lightweight drag-and-drop CMS for Admin Mode
// ======================================================

// We want to:
// - Restore saved content early (before main.js wires behaviors).
// - Then, if ?admin=true, enable admin tools: editable text & drag/drop.

// Storage key is per-pathname (so each page has its own snapshot).
const CMS_KEY_PREFIX = "pixy_cms_";

function getCmsKey() {
  return CMS_KEY_PREFIX + window.location.pathname;
}

// ---------------------------------------------
// Restore snapshot (if any) for this page
// ---------------------------------------------
function restoreCmsSnapshot() {
  try {
    const key = getCmsKey();
    const saved = localStorage.getItem(key);
    if (!saved) return;

    const main = document.querySelector("main");
    if (!main) return;

    main.innerHTML = saved;
  } catch {
    // If anything goes wrong, fail silently.
  }
}

// We want restoration to happen before other scripts hook up
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", restoreCmsSnapshot, {
    once: true,
  });
} else {
  // Document already parsed
  restoreCmsSnapshot();
}

// ---------------------------------------------
// Admin Mode bootstrap
// ---------------------------------------------
function isAdminMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("admin") === "true";
}

function initCmsAdmin() {
  if (!isAdminMode()) return;

  document.body.classList.add("pd-admin");

  addAdminBadge();
  enableEditableText();
  enableDragAndDrop();
  // Image swapping hook (optional; safe if unused in markup)
  enableImageSwapControls();
}

// Run after DOM is ready so we can safely query elements
document.addEventListener("DOMContentLoaded", () => {
  initCmsAdmin();
});

// ---------------------------------------------
// Admin badge
// ---------------------------------------------
function addAdminBadge() {
  const existing = document.querySelector(".pd-admin-badge");
  if (existing) return;

  const badge = document.createElement("div");
  badge.className = "pd-admin-badge";
  badge.textContent = "Admin Mode";

  document.body.appendChild(badge);
}

// ---------------------------------------------
// Editable text fields
// Any element with [data-cms-edit] becomes contentEditable in admin mode.
// ---------------------------------------------
let cmsSaveTimer = null;

function scheduleCmsSave() {
  window.clearTimeout(cmsSaveTimer);
  cmsSaveTimer = window.setTimeout(saveCmsSnapshot, 500);
}

function saveCmsSnapshot() {
  try {
    const main = document.querySelector("main");
    if (!main) return;

    const key = getCmsKey();
    localStorage.setItem(key, main.innerHTML);
  } catch {
    // Storage may be disabled or full; fail silently.
  }
}

function enableEditableText() {
  const editableNodes = document.querySelectorAll("[data-cms-edit]");
  editableNodes.forEach((el) => {
    el.contentEditable = "true";
    el.spellcheck = true;

    el.addEventListener("input", () => {
      scheduleCmsSave();
    });
  });
}

// ---------------------------------------------
// Drag-and-drop reordering
// We treat any elements with [data-cms-section] as draggable blocks
// IF they share the same parent.
// This naturally covers:
// - Homepage sections
// - Product cards with data-cms-section
// - Recipe modules (articles) with data-cms-section
// ---------------------------------------------
function enableDragAndDrop() {
  const allSections = Array.from(document.querySelectorAll("[data-cms-section]"));
  if (!allSections.length) return;

  // Group sections by parent
  const sectionsByParent = new Map();

  allSections.forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    if (!sectionsByParent.has(parent)) {
      sectionsByParent.set(parent, []);
    }
    sectionsByParent.get(parent).push(el);
  });

  sectionsByParent.forEach((sections, parent) => {
    if (!sections || sections.length < 2) return; // nothing to reorder

    sections.forEach((section) => {
      section.draggable = true;
      section.dataset.cmsDraggable = "true";

      section.addEventListener("dragstart", (event) =>
        handleDragStart(event, section)
      );
      section.addEventListener("dragend", handleDragEnd);
      section.addEventListener("dragover", (event) =>
        handleDragOver(event, parent)
      );
      section.addEventListener("drop", (event) =>
        handleDrop(event, parent)
      );
    });
  });
}

let draggingSection = null;

function handleDragStart(event, section) {
  draggingSection = section;
  section.classList.add("pd-cms-dragging");

  try {
    event.dataTransfer.effectAllowed = "move";
    // For Firefox compatibility, set some data:
    event.dataTransfer.setData("text/plain", "dragging");
  } catch {
    // Not critical if dataTransfer fails.
  }
}

function handleDragEnd() {
  if (draggingSection) {
    draggingSection.classList.remove("pd-cms-dragging");
    draggingSection = null;
  }
}

function handleDragOver(event, parent) {
  if (!draggingSection) return;
  event.preventDefault(); // allow drop

  const target = event.target.closest("[data-cms-section]");
  if (!target || target === draggingSection || target.parentElement !== parent) {
    return;
  }

  const bounding = target.getBoundingClientRect();
  const offset = event.clientY - bounding.top;

  // Insert before or after depending on cursor position
  const shouldInsertAfter = offset > bounding.height / 2;

  if (shouldInsertAfter) {
    if (target.nextSibling !== draggingSection) {
      parent.insertBefore(draggingSection, target.nextSibling);
      scheduleCmsSave();
    }
  } else {
    if (target !== draggingSection.nextSibling) {
      parent.insertBefore(draggingSection, target);
      scheduleCmsSave();
    }
  }
}

function handleDrop(event, _parent) {
  event.preventDefault();
  // We already handled position in dragover – just be sure to save.
  scheduleCmsSave();
}

// ---------------------------------------------
// Image swapping (optional enhancement)
// If you later add elements like:
//   <img data-cms-image-id="hero-pouch" src="..." />
//   <input data-cms-image-control="hero-pouch" />
// this will wire them so typing a new URL swaps the image.
// If no such markup exists, this is effectively a no-op.
// ---------------------------------------------
function enableImageSwapControls() {
  const inputs = document.querySelectorAll("[data-cms-image-control]");
  if (!inputs.length) return;

  inputs.forEach((input) => {
    const id = input.getAttribute("data-cms-image-control");
    if (!id) return;

    input.addEventListener("change", () => {
      const newSrc = input.value.trim();
      if (!newSrc) return;

      const imgs = document.querySelectorAll(
        `img[data-cms-image-id="${CSS.escape(id)}"]`
      );
      imgs.forEach((img) => {
        img.setAttribute("src", newSrc);
      });

      scheduleCmsSave();
    });
  });
}
