/* r72 cleanup: save chip, failed-save / quota / corrupt recovery, unsaved leaving
   warning, two-tab guard, Download / Restore, shared safe text and name caps,
   image upload checks. Offline-first. No new deps. */
(function (global) {
  "use strict";
  const NAME_MAX = 80;
  const TITLE_MAX = 200;
  const IMG_MAX_BYTES = 4 * 1024 * 1024;
  const IMG_MAX_PX = 4096;
  const IMG_TYPES = ["image/png", "image/webp", "image/jpeg", "image/jpg"];
  const TAB_KEY = "tileengine.tab-lock.v1";
  const TAB_ID = "tab_" + Math.random().toString(36).slice(2, 10);
  const BACKUP_FMT = "tileengine.backup.v1";

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function clampName(s, max) {
    const n = max || NAME_MAX;
    const t = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
    return t.length > n ? t.slice(0, n) : t;
  }

  const save = {
    dirty: false,
    failed: false,
    inFlight: false,
    lastError: "",
    onDevice: true,
  };

  function chipEl() { return document.getElementById("save-chip"); }
  function showChip(text, state) {
    const el = chipEl();
    if (!el) return;
    el.textContent = text;
    el.dataset.state = state || "ok";
    el.classList.add("show");
    el.hidden = false;
    clearTimeout(showChip._t);
    if (state !== "error") showChip._t = setTimeout(() => el.classList.remove("show"), 1800);
  }
  function toast(msg) {
    if (global.TileEngineQoL && false) { /* keep local */ }
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 3600);
  }

  function markDirty() { save.dirty = true; }
  function markSaved() {
    save.dirty = false;
    save.failed = false;
    save.inFlight = false;
    save.lastError = "";
    showChip("Saved", "ok");
  }
  function markSaveFailed(msg) {
    save.failed = true;
    save.dirty = true;
    save.inFlight = false;
    save.lastError = msg || "Couldn't save";
    showChip("Not saved", "error");
    toast(save.lastError);
  }
  function onQuota() {
    markSaveFailed("This device is full, so the latest change isn't saved. Download a copy, or free some space.");
  }

  function backupCorrupt(key, raw) {
    try {
      localStorage.setItem(key + ".damaged-" + Date.now(), String(raw || "").slice(0, 200000));
    } catch (_) { /* quota: at least we tried */ }
  }

  function hookStores() {
    const P = global.ProfileStore;
    if (P && P.load && !P.load._r72) {
      const orig = P.load.bind(P);
      const wrapped = function () {
        try {
          return orig();
        } catch (e) {
          return orig();
        }
      };
      wrapped._r72 = true;
      P.load = wrapped;
    }
    const S = global.SocialStore;
    if (S && S.load) { /* seed-without-write is in social-store.js */ }
  }

  function hookPersist() {
    const PS = global.ProjectStore;
    if (!PS || !PS.persist || PS.persist._r72) return;
    const orig = PS.persist.bind(PS);
    PS.persist = async function (store, catalogue) {
      save.inFlight = true;
      try {
        const res = await orig(store, catalogue);
        save.inFlight = false;
        if (res && res.opfsNote && /failed|unavailable|memory/i.test(res.opfsNote)) {
          save.onDevice = res.storage === "opfs";
          if (/failed/i.test(res.opfsNote)) {
            markSaveFailed("Couldn't save this project on the device. It's kept in memory until you close the tab. Download a copy now.");
            return res;
          }
        }
        if (res && res.storage && res.storage !== "opfs") save.onDevice = false;
        else save.onDevice = true;
        markSaved();
        return res;
      } catch (e) {
        save.inFlight = false;
        const quota = e && (e.name === "QuotaExceededError" || /quota/i.test(String(e)));
        if (quota) onQuota();
        else markSaveFailed("Couldn't save this project. Download a copy so you don't lose it.");
        throw e;
      }
    };
    PS.persist._r72 = true;
  }

  /* ---------- two-tab guard ---------- */
  let tabWarned = false;
  function tabBeat() {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(TAB_KEY);
      let other = null;
      if (raw) {
        try { other = JSON.parse(raw); } catch (_) { other = null; }
      }
      if (other && other.id && other.id !== TAB_ID && now - (other.at || 0) < 8000) {
        if (!tabWarned) {
          tabWarned = true;
          toast("This project is open in another tab. Work in one tab only — the other can overwrite it.");
        }
      }
      localStorage.setItem(TAB_KEY, JSON.stringify({ id: TAB_ID, at: now }));
    } catch (e) {
      if (e && e.name === "QuotaExceededError") onQuota();
    }
  }
  function onStorage(ev) {
    if (ev.key === TAB_KEY && ev.newValue) {
      try {
        const other = JSON.parse(ev.newValue);
        if (other && other.id && other.id !== TAB_ID && !tabWarned) {
          tabWarned = true;
          toast("This project is open in another tab. Work in one tab only — the other can overwrite it.");
        }
      } catch (_) { /* ignore */ }
    }
  }

  /* ---------- leaving with unsaved work ---------- */
  function onBeforeUnload(e) {
    if (save.inFlight || save.failed || (save.dirty && !save.onDevice)) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes.";
      return e.returnValue;
    }
  }

  /* ---------- image upload checks (converter / studio) ---------- */
  function validateImageFile(file) {
    return new Promise((resolve) => {
      if (!file) return resolve({ ok: false, error: "Choose a picture first." });
      const typ = (file.type || "").toLowerCase();
      const name = (file.name || "").toLowerCase();
      const okType = IMG_TYPES.indexOf(typ) >= 0 || /\.(png|webp|jpe?g)$/.test(name);
      if (!okType) return resolve({ ok: false, error: "Please use a PNG, WebP or JPEG picture." });
      if (file.size > IMG_MAX_BYTES) return resolve({ ok: false, error: "That picture is over 4 MB. Try a smaller one." });
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth, h = img.naturalHeight;
        URL.revokeObjectURL(url);
        if (w > IMG_MAX_PX || h > IMG_MAX_PX) {
          return resolve({ ok: false, error: "That picture is bigger than 4096 px. Try a smaller one." });
        }
        resolve({ ok: true, file, w, h });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ ok: false, error: "That file didn't open as a picture." });
      };
      img.src = url;
    });
  }

  /* ---------- Download / Restore ---------- */
  function downloadBackup() {
    const PS = global.ProjectStore;
    const state = global.__state || {};
    const store = state.project;
    if (!PS || !store) { toast("Nothing to download yet."); return; }
    let profile = null, prefs = null;
    try { profile = global.ProfileStore && ProfileStore.load && ProfileStore.load(); } catch (_) {}
    try { prefs = JSON.parse(localStorage.getItem((global.ProfileStore && ProfileStore.PREFS_KEY) || "tileengine.editor-prefs.v1") || "null"); } catch (_) {}
    const m = PS.manifest(store) || {};
    const name = (m.project && m.project.name) || "project";
    const bundle = {
      format: BACKUP_FMT,
      exportedAt: new Date().toISOString(),
      project: { files: store.files, projectId: store.projectId, storage: store.storage },
      profile: profile || null,
      prefs: prefs || null,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = String(name).replace(/\s+/g, "-").replace(/[^\w.-]+/g, "") + ".tileproj.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Download started.");
  }

  function validateBundle(raw) {
    if (raw == null) return { ok: false, error: "That file is empty." };
    let data = raw;
    if (typeof raw === "string") {
      try { data = JSON.parse(raw); } catch (_) { return { ok: false, error: "That file isn't valid JSON, so it can't be restored." }; }
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, error: "That file isn't a TileEngine project copy." };
    }
    // Accept r72 bundles and the older placeholder { files: ... }.
    let files = null;
    if (data.format === BACKUP_FMT && data.project && data.project.files) files = data.project.files;
    else if (data.files && typeof data.files === "object") files = data.files;
    if (!files || typeof files !== "object" || !files["project.json"]) {
      return { ok: false, error: "That file is missing the project data, so it can't be restored." };
    }
    let man = null;
    try { man = typeof files["project.json"] === "string" ? JSON.parse(files["project.json"]) : files["project.json"]; }
    catch (_) { return { ok: false, error: "The project data in that file is damaged." }; }
    if (!man || !man.project) return { ok: false, error: "The project data in that file is damaged." };
    const stages = (man.project.stages && man.project.stages.length) || Object.keys(files).filter((k) => /stages\//.test(k)).length;
    const units = (man.project.units && man.project.units.length) || Object.keys(files).filter((k) => /units\//.test(k)).length;
    return {
      ok: true,
      data,
      files,
      preview: {
        name: man.project.name || "Untitled project",
        stages: stages,
        units: units,
        exportedAt: data.exportedAt || null,
        hasProfile: !!(data.profile),
      },
    };
  }

  function openRestorePreview(check) {
    const root = document.getElementById("restore-root");
    const sheet = document.getElementById("restore-sheet");
    if (!root || !sheet) return;
    const err = sheet.querySelector(".restore-error");
    const body = sheet.querySelector(".restore-body");
    const confirm = document.getElementById("btn-restore-confirm");
    if (err) { err.hidden = true; err.textContent = ""; }
    if (!check.ok) {
      if (err) { err.hidden = false; err.textContent = check.error; }
      if (body) body.innerHTML = "";
      if (confirm) confirm.disabled = true;
      root.hidden = false;
      return;
    }
    const p = check.preview;
    if (body) {
      body.innerHTML = "";
      const ul = document.createElement("ul");
      ul.style.margin = "0";
      ul.style.padding = "0 0 0 1.1em";
      function li(t) { const x = document.createElement("li"); x.textContent = t; ul.appendChild(x); }
      li("Project: " + p.name);
      li((p.stages || 0) + " stage" + (p.stages === 1 ? "" : "s") + ", " + (p.units || 0) + " unit" + (p.units === 1 ? "" : "s"));
      if (p.exportedAt) {
        try { li("Copied " + new Date(p.exportedAt).toLocaleString()); } catch (_) {}
      }
      if (p.hasProfile) li("Includes your studio profile");
      const warn = document.createElement("p");
      warn.className = "hint";
      warn.textContent = "Restoring replaces the project on this device with this copy. This can't be undone, so download a copy first if you might want the current one back.";
      body.appendChild(ul);
      body.appendChild(warn);
    }
    if (confirm) {
      confirm.disabled = false;
      confirm.onclick = () => applyRestore(check).catch((e) => {
        if (err) { err.hidden = false; err.textContent = "Couldn't restore that file. " + (e && e.message ? e.message : "Try another copy."); }
      });
    }
    openRestorePreview._pending = check;
    root.hidden = false;
  }

  function closeRestore() {
    const root = document.getElementById("restore-root");
    if (root) root.hidden = true;
    openRestorePreview._pending = null;
  }

  async function applyRestore(check) {
    const PS = global.ProjectStore;
    if (!PS || !check || !check.ok) return;
    const files = check.files;
    // Write through a temporary store shape and persist.
    const state = global.__state || {};
    const store = state.project || {};
    store.files = files;
    try {
      const man = typeof files["project.json"] === "string" ? JSON.parse(files["project.json"]) : files["project.json"];
      if (man && man.project && man.project.id) store.projectId = man.project.id;
    } catch (_) {}
    if (check.data && check.data.profile && global.ProfileStore && ProfileStore.save) {
      try { ProfileStore.save(check.data.profile); } catch (e) {
        if (e && e.name === "QuotaExceededError") { onQuota(); throw e; }
      }
    }
    if (check.data && check.data.prefs) {
      try { localStorage.setItem((global.ProfileStore && ProfileStore.PREFS_KEY) || "tileengine.editor-prefs.v1", JSON.stringify(check.data.prefs)); }
      catch (e) { if (e && e.name === "QuotaExceededError") onQuota(); }
    }
    if (PS.persist) {
      const res = await PS.persist(store, state.catalogueDoc);
      if (!res) throw new Error("Save failed.");
    }
    closeRestore();
    toast("Project restored. Reloading…");
    setTimeout(() => location.reload(), 400);
  }

  function pickRestoreFile() {
    const inp = document.getElementById("restore-file");
    if (inp) { inp.value = ""; inp.click(); }
  }
  function onRestoreFile(e) {
    const file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      openRestorePreview({ ok: false, error: "That file is too large to restore here (over 20 MB)." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const check = validateBundle(String(reader.result || ""));
      openRestorePreview(check);
    };
    reader.onerror = () => openRestorePreview({ ok: false, error: "That file couldn't be read." });
    reader.readAsText(file);
  }

  function bind() {
    hookStores();
    hookPersist();
    tabBeat();
    setInterval(tabBeat, 3000);
    window.addEventListener("storage", onStorage);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", (e) => {
      const btn = e.target.closest && e.target.closest("#btn-export-project");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      downloadBackup();
    }, true);
    const rst = document.getElementById("btn-restore-project");
    if (rst) rst.addEventListener("click", pickRestoreFile);
    const inp = document.getElementById("restore-file");
    if (inp) inp.addEventListener("change", onRestoreFile);
    const cancel = document.getElementById("btn-restore-cancel");
    if (cancel) cancel.addEventListener("click", closeRestore);
    const scrim = document.querySelector("#restore-root .restore-scrim");
    if (scrim) scrim.addEventListener("click", closeRestore);
  }

  global.TileEngineSafe = {
    escapeHtml, clampName, NAME_MAX, TITLE_MAX,
    validateImageFile, IMG_MAX_BYTES, IMG_MAX_PX, IMG_TYPES,
    markDirty, markSaved, markSaveFailed, onQuota, backupCorrupt,
    downloadBackup, validateBundle, toast, showChip,
  };

  hookPersist();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})(typeof window !== "undefined" ? window : globalThis);
