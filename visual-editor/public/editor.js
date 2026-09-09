/**
 * Moodilier Inline Visual Page Editor
 * Spec sections A–D — self-contained browser script.
 * Admin UI when cookie ihuntev_logged_in=true; otherwise only applies /api/content.
 */
(function () {
  "use strict";

  var COOKIE_NAME = "ihuntev_logged_in";
  // Fallbacks if an older cookie name is still present
  var COOKIE_ALIASES = ["ihuntev_logged_in", "ihuntev_logged_in"];
  var API_BASE =
    (typeof window !== "undefined" && window.__VISUAL_EDITOR_API__) || "";

  var pendingChanges = {};
  var editMode = false;
  var originalContent = {};
  var pageName = detectPageName();
  var activeLinkEl = null;
  var activeImageEl = null;
  var activeImageKey = null;
  var galleryCache = [];

  function detectPageName() {
    var p = window.location.pathname.replace(/\/+$/, "") || "/";
    if (p === "/") return "home";
    return p.replace(/^\//, "").replace(/\//g, "_");
  }

  function apiUrl(path) {
    return API_BASE + path;
  }

  function hasEditorCookie() {
    var parts = document.cookie.split(";");
    var names = [COOKIE_NAME].concat(COOKIE_ALIASES || []);
    return parts.some(function (c) {
      var t = c.trim();
      return names.some(function (name) {
        return t === name + "=true";
      });
    });
  }

  function toast(message, type) {
    var box = document.getElementById("ve-toast-container");
    if (!box) return;
    var el = document.createElement("div");
    el.className = "ve-toast ve-toast--" + (type || "info");
    el.textContent = message;
    box.appendChild(el);
    setTimeout(function () {
      el.classList.add("ve-toast--out");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 280);
    }, 2800);
  }

  function pendingCount() {
    return Object.keys(pendingChanges).length;
  }

  function updateUnsavedBadge() {
    var badge = document.getElementById("ve-unsaved");
    if (!badge) return;
    var n = pendingCount();
    if (n > 0) {
      badge.hidden = false;
      badge.textContent = String(n);
    } else {
      badge.hidden = true;
      badge.textContent = "0";
    }
  }

  function trackChange(key, value, type) {
    pendingChanges[key] = { key: key, value: value, type: type || "text" };
    updateUnsavedBadge();
  }

  function setImageSrc(el, url) {
    if (!el || !url) return;
    function applyImg(img) {
      img.setAttribute("src", url);
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
    }
    if (el.tagName === "IMG") {
      applyImg(el);
      return;
    }
    var imgs = el.querySelectorAll("img");
    if (imgs.length) {
      imgs.forEach(applyImg);
      return;
    }
    el.style.backgroundImage = 'url("' + String(url).replace(/"/g, "") + '")';
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  }

  function badgeLabel(type) {
    if (type === "link") return "🔗 LINK";
    if (type === "number") return "# NUMĂR";
    if (type === "image") return "🖼 IMAGINE";
    if (type === "html") return "✏ HTML";
    return "✏ TEXT";
  }

  /* ── Apply saved content ───────────────────────────────────────────── */

  function applyContent(data) {
    if (!data || typeof data !== "object") return;
    originalContent = data;

    document.querySelectorAll("[data-key]").forEach(function (el) {
      var key = el.getAttribute("data-key");
      if (!key || data[key] == null) return;
      var type = el.getAttribute("data-editable") || "text";
      var val = data[key];

      if (type === "image") {
        setImageSrc(el, val);
      } else if (type === "link") {
        if (el.tagName === "A") el.setAttribute("href", val);
        else {
          var a = el.querySelector("a");
          if (a) a.setAttribute("href", val);
        }
      } else if (type === "html") {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    applyLayout(data["layout_" + pageName]);
    refreshHiddenOverlays();
  }

  function applyLayout(raw) {
    var layout;
    try {
      layout = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (_) {
      return;
    }
    if (!layout || !Array.isArray(layout.order)) return;

    var sections = {};
    document.querySelectorAll("[data-section-id]").forEach(function (el) {
      sections[el.getAttribute("data-section-id")] = el;
    });

    var parent = null;
    layout.order.forEach(function (id) {
      var el = sections[id];
      if (!el) return;
      if (!parent) parent = el.parentElement;
      if (parent) parent.appendChild(el);
      var hidden = layout.hidden && layout.hidden.indexOf(id) !== -1;
      el.setAttribute("data-section-hidden", hidden ? "true" : "false");
      if (!hidden) el.style.display = "";
    });
  }

  function fetchAndApply() {
    return fetch(apiUrl("/api/content"), { credentials: "include" })
      .then(function (r) {
        return r.json();
      })
      .then(applyContent)
      .catch(function () {
        /* silent for visitors */
      });
  }

  /* ── Styles ────────────────────────────────────────────────────────── */

  function injectStyles() {
    if (document.getElementById("ve-styles")) return;
    var style = document.createElement("style");
    style.id = "ve-styles";
    style.textContent =
      "#ve-toolbar{position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:#111;color:#fff;border-radius:12px;box-shadow:0 10px 32px rgba(0,0,0,.32);font:500 12px/1.2 Montserrat,system-ui,sans-serif}" +
      "#ve-toolbar button{appearance:none;border:0;border-radius:6px;padding:8px 12px;cursor:pointer;font:600 11px/1 Montserrat,system-ui,sans-serif;letter-spacing:.02em;background:#2a2a2a;color:#fff}" +
      "#ve-toolbar button:hover{background:#3a3a3a}" +
      "#ve-toolbar button.ve-primary{background:#c4a574;color:#111}" +
      "#ve-toolbar button.ve-active{background:#c4a574;color:#111}" +
      "#ve-unsaved{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;background:#e74c3c;color:#fff;border-radius:999px;padding:0 6px;font-size:11px;font-weight:700}" +
      "#ve-toast-container{position:fixed;bottom:88px;right:20px;z-index:100000;display:flex;flex-direction:column;gap:8px;max-width:min(320px,90vw)}" +
      ".ve-toast{background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:500 12px/1.3 Montserrat,system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);opacity:1;transition:opacity .25s}" +
      ".ve-toast--success{background:#1e7a46}.ve-toast--error{background:#a32020}.ve-toast--out{opacity:0}" +
      "body.ve-edit-mode [data-editable]{outline:2px dashed rgba(196,165,116,.7);outline-offset:3px;cursor:pointer;position:relative;min-height:1em}" +
      "body.ve-edit-mode [data-editable=\"text\"]{outline-color:rgba(52,152,219,.75)}" +
      "body.ve-edit-mode [data-editable=\"number\"]{outline-color:rgba(241,196,15,.9)}" +
      "body.ve-edit-mode [data-editable=\"html\"]{outline-color:rgba(155,89,182,.75)}" +
      "body.ve-edit-mode [data-editable=\"link\"]{outline-color:rgba(46,204,113,.75)}" +
      "body.ve-edit-mode [data-editable=\"image\"]{outline-color:rgba(230,126,34,.85);z-index:6;pointer-events:auto;cursor:pointer}" +
      "body.ve-edit-mode .aw-page-hero-overlay,body.ve-edit-mode .aw-page-hero-fade,body.ve-edit-mode .aw-hero-scrim,body.ve-edit-mode .aw-hero-fade{pointer-events:none!important}" +
      "body.ve-edit-mode .aw-cta-bg-shot{z-index:4;pointer-events:auto}" +
      "body.ve-edit-mode [data-editable]:hover::after{content:attr(data-ve-badge);position:absolute;top:-20px;left:0;background:#111;color:#fff;font:700 9px/1 Montserrat,sans-serif;padding:4px 7px;border-radius:4px;letter-spacing:.03em;pointer-events:none;z-index:20;white-space:nowrap}" +
      "body.ve-edit-mode [data-section-id]{position:relative}" +
      ".ve-section-controls{position:absolute;top:8px;right:8px;z-index:60;display:none;gap:4px}" +
      "body.ve-edit-mode [data-section-id] > .ve-section-controls{display:flex}" +
      ".ve-section-controls button{appearance:none;border:0;background:#111;color:#fff;min-width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:12px;padding:0 6px}" +
      ".ve-section-overlay{position:absolute;inset:0;z-index:55;display:none;align-items:center;justify-content:center;background:rgba(80,80,80,.55);backdrop-filter:grayscale(1);pointer-events:auto}" +
      "body.ve-edit-mode [data-section-id][data-section-hidden=\"true\"] > .ve-section-overlay{display:flex}" +
      "body.ve-edit-mode [data-section-id][data-section-hidden=\"true\"]{outline:2px dashed rgba(120,120,120,.8);min-height:80px}" +
      ".ve-section-overlay button{appearance:none;border:0;background:#fff;color:#111;border-radius:8px;padding:10px 14px;font:600 12px Montserrat,sans-serif;cursor:pointer}" +
      "#ve-structure{position:fixed;top:0;right:0;width:min(320px,92vw);height:100vh;background:#111;color:#fff;z-index:99998;transform:translateX(100%);transition:transform .25s ease;padding:24px 16px 24px;box-sizing:border-box;overflow:auto;font:400 13px/1.4 Montserrat,system-ui,sans-serif}" +
      "#ve-structure.ve-open{transform:translateX(0)}" +
      "#ve-structure h3{margin:0 0 12px;font-size:14px;letter-spacing:.04em;text-transform:uppercase;color:#c4a574}" +
      "#ve-structure-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}" +
      "#ve-structure-list li{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;background:#1c1c1c;border-radius:8px}" +
      "#ve-structure-list li.ve-hidden-item{opacity:.45}" +
      "#ve-structure-list .ve-struct-name{flex:1;cursor:pointer;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:0}" +
      "#ve-structure-list .ve-struct-actions{display:flex;gap:4px}" +
      "#ve-structure-list .ve-struct-actions button{appearance:none;border:0;background:#2a2a2a;color:#fff;width:26px;height:26px;border-radius:5px;cursor:pointer}" +
      ".ve-link-popup{position:absolute;z-index:100002;background:#fff;color:#111;border-radius:10px;padding:12px;box-shadow:0 12px 36px rgba(0,0,0,.28);min-width:260px;font:400 12px Montserrat,system-ui,sans-serif}" +
      ".ve-link-popup label{display:block;margin:6px 0 4px;font-weight:600}" +
      ".ve-link-popup input{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #ddd;border-radius:6px;font:inherit}" +
      ".ve-link-popup .ve-modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}" +
      ".ve-link-popup button{appearance:none;border:0;border-radius:6px;padding:8px 12px;cursor:pointer;font:600 12px Montserrat,sans-serif;background:#eee}" +
      ".ve-link-popup .ve-primary{background:#111;color:#fff}" +
      ".ve-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px}" +
      ".ve-modal{background:#fff;color:#111;border-radius:12px;max-width:560px;width:100%;max-height:85vh;overflow:auto;padding:20px;box-shadow:0 16px 40px rgba(0,0,0,.3)}" +
      ".ve-modal.ve-modal-lg{max-width:840px}" +
      ".ve-modal h3{margin:0 0 12px;font:600 16px/1.2 Playfair Display,Georgia,serif}" +
      ".ve-modal label{display:block;font:500 12px/1.2 Montserrat,sans-serif;margin:10px 0 4px}" +
      ".ve-modal input[type=text],.ve-modal input[type=url],.ve-modal input[type=search]{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;font:400 13px Montserrat,sans-serif}" +
      ".ve-modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}" +
      ".ve-modal-actions button,.ve-choice-btn{appearance:none;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font:600 12px Montserrat,sans-serif;background:#eee}" +
      ".ve-modal-actions .ve-primary,.ve-choice-btn.ve-primary{background:#111;color:#fff}" +
      ".ve-choice-row{display:flex;flex-direction:column;gap:10px;margin-top:8px}" +
      ".ve-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-top:12px}" +
      ".ve-gallery button{border:1px solid #ddd;padding:0;border-radius:8px;overflow:hidden;cursor:pointer;background:#f7f7f7;aspect-ratio:1}" +
      ".ve-gallery img{width:100%;height:100%;object-fit:cover;display:block}" +
      "[data-section-id].ve-highlight{animation:veFlash 1.2s ease}" +
      "@keyframes veFlash{0%,100%{box-shadow:none}40%{box-shadow:0 0 0 4px rgba(196,165,116,.85)}}" +
      "body.ve-edit-mode{cursor:default}";
    document.head.appendChild(style);
  }

  /* ── Chrome (A) ────────────────────────────────────────────────────── */

  function injectChrome() {
    injectStyles();

    if (!document.getElementById("ve-toolbar")) {
      var bar = document.createElement("div");
      bar.id = "ve-toolbar";
      bar.innerHTML =
        '<button type="button" id="ve-btn-edit">Edit Mode</button>' +
        '<button type="button" id="ve-btn-save" class="ve-primary">Salvează Tot</button>' +
        '<button type="button" id="ve-btn-cancel">Anulează</button>' +
        '<button type="button" id="ve-btn-structure">Structură</button>' +
        '<span id="ve-unsaved" hidden>0</span>';
      document.body.appendChild(bar);

      document.getElementById("ve-btn-edit").addEventListener("click", toggleEditMode);
      document.getElementById("ve-btn-save").addEventListener("click", saveAll);
      document.getElementById("ve-btn-cancel").addEventListener("click", cancelAll);
      document
        .getElementById("ve-btn-structure")
        .addEventListener("click", toggleStructure);
    }

    if (!document.getElementById("ve-toast-container")) {
      var toastBox = document.createElement("div");
      toastBox.id = "ve-toast-container";
      document.body.appendChild(toastBox);
    }

    if (!document.getElementById("ve-structure")) {
      var side = document.createElement("div");
      side.id = "ve-structure";
      side.innerHTML =
        "<h3>Structură pagină</h3><ul id=\"ve-structure-list\"></ul>";
      document.body.appendChild(side);
    }
  }

  function toggleEditMode() {
    editMode = !editMode;
    document.body.classList.toggle("ve-edit-mode", editMode);
    var btn = document.getElementById("ve-btn-edit");
    if (btn) btn.classList.toggle("ve-active", editMode);
    if (editMode) {
      enableEditableHandlers();
      ensureSectionControls();
      refreshHiddenOverlays();
      toast("Mod editare activ", "info");
    } else {
      disableEditableHandlers();
      closeLinkPopup();
      closeModals();
      toast("Mod editare dezactivat", "info");
    }
  }

  /* ── Editable handlers (B) ─────────────────────────────────────────── */

  function commitEditable(el) {
    var key = el.getAttribute("data-key");
    var type = el.getAttribute("data-editable") || "text";
    if (!key) return;
    var value = type === "html" ? el.innerHTML : el.textContent;
    if (type === "number") value = String(value || "").trim();
    trackChange(key, value, type);
  }

  function onEditableClick(e) {
    if (!editMode) return;
    var el = e.currentTarget;
    var type = el.getAttribute("data-editable");
    var key = el.getAttribute("data-key");
    if (!key) return;

    if (type === "link") {
      e.preventDefault();
      e.stopPropagation();
      openLinkPopup(el, key);
      return;
    }
    if (type === "image") {
      e.preventDefault();
      e.stopPropagation();
      openImageChooser(el, key);
      return;
    }
  }

  function onEditableKeydown(e) {
    if (!editMode) return;
    var el = e.currentTarget;
    var type = el.getAttribute("data-editable") || "text";

    if (type === "number" && e.key === "Enter") {
      e.preventDefault();
      el.blur();
      commitEditable(el);
      return;
    }

    if ((type === "text" || type === "html" || type === "number") && e.key === "Enter" && !e.shiftKey) {
      if (type !== "html") {
        e.preventDefault();
        el.blur();
        commitEditable(el);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      var key = el.getAttribute("data-key");
      if (key && originalContent[key] != null) {
        if (type === "html") el.innerHTML = originalContent[key];
        else el.textContent = originalContent[key];
      }
      el.blur();
    }
  }

  function onEditableBlur(e) {
    if (!editMode) return;
    commitEditable(e.currentTarget);
  }

  function enableEditableHandlers() {
    document.querySelectorAll("[data-editable][data-key]").forEach(function (el) {
      var type = el.getAttribute("data-editable");
      el.setAttribute("data-ve-badge", badgeLabel(type));
      el.addEventListener("click", onEditableClick);
      if (type === "text" || type === "html" || type === "number") {
        el.setAttribute("contenteditable", "true");
        el.addEventListener("keydown", onEditableKeydown);
        el.addEventListener("blur", onEditableBlur);
      }
    });
  }

  function disableEditableHandlers() {
    document.querySelectorAll("[data-editable][data-key]").forEach(function (el) {
      el.removeEventListener("click", onEditableClick);
      el.removeEventListener("keydown", onEditableKeydown);
      el.removeEventListener("blur", onEditableBlur);
      el.removeAttribute("contenteditable");
    });
  }

  /* ── Link popup (floating under element) ───────────────────────────── */

  function closeLinkPopup() {
    var p = document.getElementById("ve-link-popup");
    if (p) p.remove();
    activeLinkEl = null;
  }

  function openLinkPopup(el, key) {
    closeLinkPopup();
    closeModals();
    activeLinkEl = el;

    var currentHref = "";
    var currentText = el.textContent || "";
    if (el.tagName === "A") currentHref = el.getAttribute("href") || "";
    else {
      var a = el.querySelector("a");
      if (a) {
        currentHref = a.getAttribute("href") || "";
        currentText = a.textContent || currentText;
      }
    }

    var popup = document.createElement("div");
    popup.id = "ve-link-popup";
    popup.className = "ve-link-popup";
    popup.innerHTML =
      "<label for=\"ve-link-text\">Text link</label>" +
      '<input id="ve-link-text" type="text" />' +
      "<label for=\"ve-link-url\">URL</label>" +
      '<input id="ve-link-url" type="url" />' +
      '<div class="ve-modal-actions">' +
      '<button type="button" id="ve-link-cancel">Anulează</button>' +
      '<button type="button" class="ve-primary" id="ve-link-ok">Aplică</button>' +
      "</div>";

    document.body.appendChild(popup);
    document.getElementById("ve-link-text").value = currentText.trim();
    document.getElementById("ve-link-url").value = currentHref;

    var rect = el.getBoundingClientRect();
    var top = window.scrollY + rect.bottom + 8;
    var left = window.scrollX + rect.left;
    popup.style.top = top + "px";
    popup.style.left = Math.max(8, left) + "px";

    document.getElementById("ve-link-cancel").onclick = closeLinkPopup;
    document.getElementById("ve-link-ok").onclick = function () {
      var text = document.getElementById("ve-link-text").value;
      var url = document.getElementById("ve-link-url").value.trim();
      var labelKey = null;
      var labelEl = el.querySelector("[data-editable=\"text\"][data-key]");

      if (el.tagName === "A") {
        el.setAttribute("href", url);
        if (labelEl) {
          labelEl.textContent = text;
          labelKey = labelEl.getAttribute("data-key");
        } else {
          el.textContent = text;
        }
      } else {
        var link = el.querySelector("a");
        if (link) {
          link.setAttribute("href", url);
          if (labelEl) {
            labelEl.textContent = text;
            labelKey = labelEl.getAttribute("data-key");
          } else {
            link.textContent = text;
          }
        }
      }

      trackChange(key, url, "link");
      if (labelKey) trackChange(labelKey, text, "text");
      closeLinkPopup();
      toast("Link actualizat", "success");
    };

    setTimeout(function () {
      function outside(ev) {
        if (!popup.contains(ev.target) && ev.target !== el) {
          closeLinkPopup();
          document.removeEventListener("mousedown", outside);
        }
      }
      document.addEventListener("mousedown", outside);
    }, 0);
  }

  /* ── Image chooser + gallery ───────────────────────────────────────── */

  function closeModals() {
    var m = document.getElementById("ve-modal");
    if (m) m.remove();
  }

  function openImageChooser(el, key) {
    closeLinkPopup();
    closeModals();
    activeImageEl = el;
    activeImageKey = key;

    var backdrop = document.createElement("div");
    backdrop.className = "ve-modal-backdrop";
    backdrop.id = "ve-modal";
    backdrop.innerHTML =
      '<div class="ve-modal" role="dialog" aria-modal="true">' +
      "<h3>Editează imagine</h3>" +
      '<div class="ve-choice-row">' +
      '<button type="button" class="ve-choice-btn ve-primary" id="ve-img-upload">Încarcă imagine nouă</button>' +
      '<button type="button" class="ve-choice-btn" id="ve-img-gallery">Alege din Galerie</button>' +
      "</div>" +
      '<input id="ve-img-file" type="file" accept="image/*" hidden />' +
      '<div class="ve-modal-actions">' +
      '<button type="button" id="ve-img-cancel">Anulează</button>' +
      "</div></div>";
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (ev) {
      if (ev.target === backdrop) closeModals();
    });
    document.getElementById("ve-img-cancel").onclick = closeModals;

    var fileInput = document.getElementById("ve-img-file");
    document.getElementById("ve-img-upload").onclick = function () {
      fileInput.click();
    };
    fileInput.onchange = function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var fd = new FormData();
      fd.append("file", file);
      fetch(apiUrl("/api/content/upload"), {
        method: "POST",
        body: fd,
        credentials: "include",
      })
        .then(function (r) {
          return r.json().then(function (j) {
            if (!r.ok) throw new Error(j.error || "Upload eșuat");
            return j;
          });
        })
        .then(function (j) {
          applyImageUrl(j.url);
        })
        .catch(function (err) {
          toast(err.message || "Upload eșuat", "error");
        });
    };

    document.getElementById("ve-img-gallery").onclick = function () {
      openGalleryModal();
    };
  }

  function applyImageUrl(url) {
    var el = activeImageEl;
    var key = activeImageKey;
    if (!el || !key) return;
    setImageSrc(el, url);
    trackChange(key, url, "image");
    closeModals();
    toast("Imagine actualizată", "success");
  }

  function openGalleryModal() {
    closeModals();
    var backdrop = document.createElement("div");
    backdrop.className = "ve-modal-backdrop";
    backdrop.id = "ve-modal";
    backdrop.innerHTML =
      '<div class="ve-modal ve-modal-lg" role="dialog" aria-modal="true">' +
      "<h3>Galerie media</h3>" +
      '<label for="ve-gallery-search">Caută după nume</label>' +
      '<input id="ve-gallery-search" type="search" placeholder="Filtrează…" />' +
      '<div class="ve-gallery" id="ve-gallery"></div>' +
      '<div class="ve-modal-actions">' +
      '<button type="button" id="ve-gallery-back">Înapoi</button>' +
      '<button type="button" id="ve-gallery-close">Închide</button>' +
      "</div></div>";
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function (ev) {
      if (ev.target === backdrop) closeModals();
    });
    document.getElementById("ve-gallery-close").onclick = closeModals;
    document.getElementById("ve-gallery-back").onclick = function () {
      openImageChooser(activeImageEl, activeImageKey);
    };
    document.getElementById("ve-gallery-search").oninput = function (ev) {
      renderGallery(ev.target.value || "");
    };

    loadGallery().then(function () {
      renderGallery("");
    });
  }

  function loadGallery() {
    var gallery = document.getElementById("ve-gallery");
    if (gallery) {
      gallery.innerHTML =
        '<p style="grid-column:1/-1;opacity:.6">Se încarcă…</p>';
    }
    return fetch(apiUrl("/api/media"), { credentials: "include" })
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        galleryCache = Array.isArray(list) ? list : [];
        return galleryCache;
      })
      .catch(function () {
        galleryCache = [];
        if (gallery) {
          gallery.innerHTML =
            '<p style="grid-column:1/-1;opacity:.6">Nu s-a putut încărca galeria.</p>';
        }
        return galleryCache;
      });
  }

  function renderGallery(filter) {
    var gallery = document.getElementById("ve-gallery");
    if (!gallery) return;
    var q = String(filter || "").toLowerCase().trim();
    var list = galleryCache.filter(function (m) {
      if (!q) return true;
      var name = (m.original_name || m.filename || "").toLowerCase();
      return name.indexOf(q) !== -1;
    });
    gallery.innerHTML = "";
    if (!list.length) {
      gallery.innerHTML =
        '<p style="grid-column:1/-1;opacity:.6">Nicio imagine.</p>';
      return;
    }
    list.forEach(function (m) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.title = m.original_name || m.filename;
      var img = document.createElement("img");
      img.src = m.url;
      img.alt = "";
      btn.appendChild(img);
      btn.onclick = function () {
        applyImageUrl(m.url);
      };
      gallery.appendChild(btn);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Sections / structure (C) ──────────────────────────────────────── */

  function ensureSectionControls() {
    document.querySelectorAll("[data-section-id]").forEach(function (section) {
      if (!section.querySelector(":scope > .ve-section-controls")) {
        var controls = document.createElement("div");
        controls.className = "ve-section-controls";
        controls.innerHTML =
          '<button type="button" data-act="up" title="Mută Sus (↑)">↑</button>' +
          '<button type="button" data-act="down" title="Mută Jos (↓)">↓</button>' +
          '<button type="button" data-act="hide" title="Ascunde (✕)">✕</button>';
        controls.addEventListener("click", function (e) {
          var btn = e.target.closest("button");
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          var act = btn.getAttribute("data-act");
          if (act === "up") moveSection(section, -1);
          if (act === "down") moveSection(section, 1);
          if (act === "hide") toggleSectionHidden(section, true);
        });
        section.insertBefore(controls, section.firstChild);
      }

      if (!section.querySelector(":scope > .ve-section-overlay")) {
        var overlay = document.createElement("div");
        overlay.className = "ve-section-overlay";
        overlay.innerHTML =
          '<button type="button" data-act="restore">Afișează secțiunea</button>';
        overlay.addEventListener("click", function (e) {
          var btn = e.target.closest("button");
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          toggleSectionHidden(section, false);
        });
        section.appendChild(overlay);
      }
    });
    refreshStructureList();
    refreshHiddenOverlays();
  }

  function refreshHiddenOverlays() {
    document.querySelectorAll("[data-section-id]").forEach(function (section) {
      var hidden = section.getAttribute("data-section-hidden") === "true";
      if (hidden && editMode) {
        // Keep in layout flow with overlay; do not display:none so restore works
        if (section.style.display === "none") section.style.display = "";
      } else if (hidden && !editMode) {
        section.style.display = "none";
      } else {
        section.style.display = "";
      }
    });
  }

  function moveSection(section, dir) {
    var parent = section.parentElement;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (n) {
      return n.hasAttribute && n.hasAttribute("data-section-id");
    });
    var idx = siblings.indexOf(section);
    var target = siblings[idx + dir];
    if (!target) return;
    if (dir < 0) parent.insertBefore(section, target);
    else parent.insertBefore(target, section);
    persistLayout();
    refreshStructureList();
  }

  function toggleSectionHidden(section, forceHide) {
    var currentlyHidden = section.getAttribute("data-section-hidden") === "true";
    var hide =
      typeof forceHide === "boolean" ? forceHide : !currentlyHidden;
    section.setAttribute("data-section-hidden", hide ? "true" : "false");
    refreshHiddenOverlays();
    persistLayout();
    refreshStructureList();
  }

  function collectLayout() {
    var order = [];
    var hidden = [];
    document.querySelectorAll("[data-section-id]").forEach(function (el) {
      var id = el.getAttribute("data-section-id");
      order.push(id);
      if (el.getAttribute("data-section-hidden") === "true") {
        hidden.push(id);
      }
    });
    return { order: order, hidden: hidden };
  }

  function persistLayout() {
    var layoutKey = "layout_" + pageName;
    var json = JSON.stringify(collectLayout());
    trackChange(layoutKey, json, "json");
  }

  function toggleStructure() {
    var side = document.getElementById("ve-structure");
    if (!side) return;
    side.classList.toggle("ve-open");
    refreshStructureList();
  }

  function scrollToSection(el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.remove("ve-highlight");
    void el.offsetWidth;
    el.classList.add("ve-highlight");
    setTimeout(function () {
      el.classList.remove("ve-highlight");
    }, 1300);
  }

  function refreshStructureList() {
    var list = document.getElementById("ve-structure-list");
    if (!list) return;
    list.innerHTML = "";
    document.querySelectorAll("[data-section-id]").forEach(function (el) {
      var id = el.getAttribute("data-section-id");
      var name = el.getAttribute("data-section-name") || id || "Secțiune";
      var isHidden = el.getAttribute("data-section-hidden") === "true";
      var li = document.createElement("li");
      if (isHidden) li.className = "ve-hidden-item";
      li.innerHTML =
        '<button type="button" class="ve-struct-name">' +
        escapeHtml(name) +
        "</button>" +
        '<span class="ve-struct-actions">' +
        '<button type="button" data-act="up" title="Mută Sus">↑</button>' +
        '<button type="button" data-act="down" title="Mută Jos">↓</button>' +
        '<button type="button" data-act="hide" title="Ascunde">' +
        (isHidden ? "◉" : "✕") +
        "</button></span>";
      li.querySelector(".ve-struct-name").addEventListener("click", function () {
        scrollToSection(el);
      });
      li.querySelectorAll(".ve-struct-actions button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var act = btn.getAttribute("data-act");
          if (act === "up") moveSection(el, -1);
          if (act === "down") moveSection(el, 1);
          if (act === "hide") toggleSectionHidden(el);
        });
      });
      list.appendChild(li);
    });
  }

  /* ── Save / Cancel (D) ─────────────────────────────────────────────── */

  function saveAll() {
    var items = Object.keys(pendingChanges).map(function (k) {
      return pendingChanges[k];
    });
    if (!items.length) {
      toast("Nicio modificare de salvat", "info");
      return;
    }
    fetch(apiUrl("/api/content"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    })
      .then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) throw new Error(j.error || "Salvare eșuată");
          return j;
        });
      })
      .then(function () {
        pendingChanges = {};
        updateUnsavedBadge();
        toast("Conținut salvat cu succes", "success");
        return fetchAndApply();
      })
      .catch(function (err) {
        toast(err.message || "Eroare la salvare", "error");
      });
  }

  function cancelAll() {
    pendingChanges = {};
    updateUnsavedBadge();
    closeLinkPopup();
    closeModals();
    fetchAndApply().then(function () {
      if (editMode) {
        ensureSectionControls();
        refreshHiddenOverlays();
      }
      toast("Modificările au fost anulate", "info");
    });
  }

  /* ── Boot ──────────────────────────────────────────────────────────── */

  function boot() {
    if (hasEditorCookie()) {
      injectChrome();
      fetchAndApply();
    } else {
      fetchAndApply();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
