/* Dark theme, studio profile, achievements, game settings, sound sheet.
   Loaded after app.js. Uses window.__state / __show when present. */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  function state() { return window.__state || (window.__state = {}); }
  function toast(msg) {
    if (typeof window.toast === "function") return window.toast(msg);
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function showAchToast(def) {
    if (!def || !window.ProfileStore) return;
    if (window.__suppressAchToast) return;
    if (ProfileStore.toastSeen(def.id)) return;
    ProfileStore.markToastSeen(def.id);
    const el = $("#ach-toast");
    if (!el) return;
    const title = $("#ach-toast-title");
    const sub = $("#ach-toast-sub");
    const coin = $("#ach-toast-coin");
    if (title) title.textContent = def.title;
    if (sub) sub.textContent = (ProfileStore.categoryLabel(def.category) || "Editor") + " · tap for profile";
    const reward = (ProfileStore.COIN_REWARDS && ProfileStore.COIN_REWARDS[def.id]) || 0;
    if (coin) {
      if (reward) { coin.hidden = false; coin.textContent = "+" + reward + " 🪙"; }
      else { coin.hidden = true; }
    }
    el.hidden = false;
    el.classList.add("show");
    clearTimeout(showAchToast._t);
    showAchToast._t = setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => { el.hidden = true; }, 220);
    }, 3000);
  }

  function fireEvents(newly) {
    (newly || []).forEach(showAchToast);
  }

  function record(event, delta, payload) {
    if (!window.ProfileStore) return;
    const r = ProfileStore.recordEvent(event, delta, payload);
    fireEvents(r.newly);
    return r;
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    if (!window.ProfileStore) return;
    const p = ProfileStore.load();
    ProfileStore.applyTheme(p.prefs.theme || "system");
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const cur = ProfileStore.load().prefs.theme || "system";
      if (cur === "system") ProfileStore.applyTheme("system");
    };
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }

  /* ---------- Stage sheet helpers ---------- */
  function syncSheetChrome() {
    const sheet = $("#stage-sheet");
    const wrap = document.querySelector(".stage-wrap-lean");
    const open = !!(sheet && !sheet.hidden);
    if (wrap) {
      wrap.classList.toggle("is-sheet-open", open);
      requestAnimationFrame(() => {
        const h = open ? sheet.getBoundingClientRect().height : 0;
        wrap.style.setProperty("--sheet-h", Math.round(h) + "px");
      });
    }
    const promptEl = $("#vote-prompt");
    if (promptEl) {
      if (open) {
        if (!promptEl.hidden) { promptEl.dataset.parked = "1"; promptEl.hidden = true; }
      } else if (promptEl.dataset.parked === "1") {
        promptEl.hidden = false;
        delete promptEl.dataset.parked;
      }
    }
    const fab = $("#btn-stage-undo");
    const sheetUndo = $("#btn-sheet-undo");
    if (sheetUndo) {
      sheetUndo.hidden = !open;
      if (fab) sheetUndo.disabled = fab.disabled;
    }
  }

  function openSoundSheet(opts) {
    opts = opts || {};
    const st = state();
    if (window.SoundPanel) SoundPanel.attach(st);
        if (opts.assignEvent) st.soundUi.assignEvent = opts.assignEvent;
    if (opts.pickerFor) st.soundUi.pickerFor = opts.pickerFor;
    if (opts.abilityId) st.soundUi.abilityId = opts.abilityId;
    if (opts.ownPickerOpen) st.soundUi.ownPickerOpen = true;
    const sheet = $("#stage-sheet");
    if (!sheet) return;
    ["sheet-paint","sheet-walls","sheet-objects","sheet-units","sheet-unit","sheet-move","sheet-more","sheet-sound"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = id !== "sheet-sound";
    });
    sheet.hidden = false;
    sheet.dataset.mode = "sound";
    st.stageSheetMode = "sound";
    $$(".rail-btn").forEach((b) => b.setAttribute("aria-pressed", b.id === "rail-more" ? "true" : "false"));
    renderSoundSheet();
    syncSheetChrome();
    // Pan selected unit into the visible grid above the sheet
    requestAnimationFrame(() => {
      const u = (st.units || []).find((x) => x.id === st.selectedUnitId) || (st.units || [])[0];
      if (u && typeof window.applyStageCamera === "function") {
        try {
          const cell = document.querySelector('#stage-grid .cell[data-x="'+u.x+'"][data-y="'+u.y+'"]');
          const scroll = document.getElementById("stage-scroll");
          if (cell && scroll) {
            const cr = cell.getBoundingClientRect();
            const sr = scroll.getBoundingClientRect();
            if (cr.bottom > sr.bottom - 8 || cr.top < sr.top + 8) {
              cell.scrollIntoView({ block: "center", inline: "center" });
            }
          }
        } catch (_) {}
      }
    });
    const mid = window.SoundPanel ? SoundPanel.resolveSoundId("stage.music", {}) : null;
    const def = window.SoundPanel && SoundPanel.getDef(mid);
    if (def && SoundPanel.isUnlocked() && !st.soundUi.musicMute) {
      SoundPanel.startMusic(def);
    }
    updateStageMusicReadonly();
  }

  function updateStageMusicReadonly() {
    const st = state();
    if (window.SoundPanel) SoundPanel.attach(st);
    if (window.SoundPanel) SoundPanel.attach(st);
    const id = window.SoundPanel ? SoundPanel.resolveSoundId("stage.music", {}) : null;
    const def = window.SoundPanel && SoundPanel.getDef(id);
    const name = def ? def.name : "None";
    ["stage-music-name", "settings-stage-music-name"].forEach((nid) => {
      const el = document.getElementById(nid);
      if (el) el.textContent = name;
    });
  }

  /* ---------- Sound sheet render ---------- */
  function renderSoundSheet() {
    const st = state();
    if (!window.SoundPanel) return;
    SoundPanel.attach(st);
    const ui = st.soundUi;
    const unlock = $("#btn-sound-unlock");
    if (unlock) unlock.hidden = SoundPanel.isUnlocked();
    const silent = $("#sound-silent-hint");
    if (silent) silent.hidden = !SoundPanel.getSilentHint();

    $$("[data-sound-tab]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-sound-tab") === ui.tab ? "true" : "false"));
    $$("[data-sound-filter]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-sound-filter") === ui.filter ? "true" : "false"));

    const list = $("#sound-list");
    if (list) {
      let items = [];
      if (ui.tab === "library") items = SoundPanel.LIB.filter((x) => x.kind === ui.filter);
      else items = Object.values(st.sounds || {}).filter((x) => x.kind === ui.filter || (!x.kind && ui.filter === "sfx"));
      list.innerHTML = items.map((def) => {
        const warn = SoundPanel.sizeWarn(def);
        const stream = def.streamed ? '<span class="tag-stream">Streamed</span>' : "";
        const tag = def.tag || (def.credit && (def.credit.license === "own" ? "Yours" : "CC0 · Kenney")) || "";
        return `<div class="sound-row" data-sound-id="${def.id}">
          <div class="sound-meta"><strong>${escapeHtml(def.name)}</strong><span>${escapeHtml(tag)} ${stream}</span>${warn ? `<span style="color:var(--warn)"> · ${escapeHtml(warn)}</span>` : ""}</div>
          <button type="button" class="sound-play" data-play="${def.id}" aria-label="Play ${escapeHtml(def.name)}" aria-pressed="false">▶</button>
        </div>`;
      }).join("") || '<p class="hint">No sounds in this filter.</p>';
    }

    const presets = $("#sound-presets");
    if (presets) {
      presets.innerHTML = SoundPanel.PRESETS.map((p) =>
        `<button type="button" class="toggle" data-preset="${p}" aria-pressed="${st.soundGen.recipe === p ? "true" : "false"}">${p[0].toUpperCase() + p.slice(1)}</button>`
      ).join("");
    }

    const sliders = $("#sound-sliders");
    if (sliders) {
      const g = st.soundGen;
      const labels = { pitch: "Pitch", length: "Length", punch: "Punch", wobble: "Wobble", noise: "Noise", volume: "Volume" };
      const ranges = { pitch: [0.5, 2, 0.01], length: [0.05, 1.2, 0.01], punch: [0, 1, 0.01], wobble: [0, 1, 0.01], noise: [0, 1, 0.01], volume: [0, 1, 0.01] };
      sliders.innerHTML = SoundPanel.FRIENDLY.map((k) => {
        const [min, max, step] = ranges[k];
        const locked = !!(g.locks && g.locks[k]);
        return `<div class="sound-slider-row">
          <label for="snd-${k}">${labels[k]}</label>
          <input id="snd-${k}" class="slider" type="range" min="${min}" max="${max}" step="${step}" value="${g.friendly[k]}" data-friendly="${k}" aria-label="${labels[k]}" />
          <button type="button" class="sound-lock" data-lock="${k}" aria-pressed="${locked ? "true" : "false"}" aria-label="Lock ${labels[k]}">${locked ? "🔒" : "🔓"}</button>
        </div>`;
      }).join("");
    }

    const adv = $("#sound-advanced-body");
    if (adv) {
      const p = st.soundGen.params || {};
      adv.innerHTML = SoundPanel.ADVANCED_KEYS.map((k) => {
        const v = p[k] != null ? p[k] : 0;
        if (k === "wave_type") {
          return `<div class="field"><label>${k}</label><input class="slider" type="range" min="0" max="3" step="1" value="${v}" data-adv="${k}" aria-label="${k}" /></div>`;
        }
        return `<div class="field"><label>${k} <span class="val">${Number(v).toFixed(3)}</span></label><input class="slider" type="range" min="0" max="1" step="0.001" value="${v}" data-adv="${k}" aria-label="${k}" /></div>`;
      }).join("");
    }

    const seedLine = $("#sound-gen-seed");
    if (seedLine) seedLine.textContent = `Seed ${st.soundGen.seed} · generator ${SoundPanel.GENERATOR} · export audio.procedural: ${(st.audio && st.audio.procedural) || "live"}`;

    const mute = $("#btn-sound-music-mute");
    if (mute) mute.setAttribute("aria-pressed", st.soundUi.musicMute ? "true" : "false");

    renderSoundEvents();
    renderUnitOverrides();
    renderAbilitySounds("#sound-ability-list");
    const ownPanel = $("#own-sound-picker");
    if (ownPanel) ownPanel.hidden = !(st.soundUi && st.soundUi.ownPickerOpen);
    // also refresh unit editor list if present
    renderAbilitySounds("#unit-ability-sound-list");
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderSoundEvents() {
    const st = state();
    const box = $("#sound-events");
    if (!box || !window.SoundPanel) return;
    SoundPanel.attach(st);
    box.innerHTML = SoundPanel.EVENTS.map((ev) => {
      const b = SoundPanel.findDefaultBinding(ev.id);
      const sid = b ? b.soundId : SoundPanel.resolveSoundId(ev.id, {});
      const missing = b && b._state === "unknownRef";
      const def = SoundPanel.getDef(sid);
      const active = st.soundUi.assignEvent === ev.id;
      const name = missing ? "Sound missing, pick another" : (def ? def.name : "None");
      return `<div class="event-row${missing ? " sound-missing" : ""}" data-event="${ev.id}">
        <button type="button" class="btn btn-ghost" style="min-height:48px;min-width:110px;${active ? "border-color:var(--accent)" : ""}" data-pick-event="${ev.id}">${escapeHtml(ev.label)}</button>
        <span class="ev-sound">${escapeHtml(name)}</span>
        <button type="button" class="sound-play" data-play="${(!missing && sid) || ""}" aria-label="Audition" ${(!missing && sid) ? "" : "disabled"}>▶</button>
        <button type="button" class="btn btn-ghost" style="min-height:48px" data-clear-event="${ev.id}" aria-label="Clear">Clear</button>
      </div>`;
    }).join("");
  }

  function renderUnitOverrides() {
    const st = state();
    const box = $("#sound-unit-overrides");
    if (!box || !window.SoundPanel) return;
    SoundPanel.attach(st);
    const unit = (st.units || []).find((u) => u.id === st.selectedUnitId) || (st.units || [])[0];
    if (!unit) {
      box.innerHTML = '<p class="hint">Select a unit to override cast / hurt / death.</p>';
      return;
    }
    const keys = SoundPanel.EVENTS.filter((e) => e.overridable);
    box.innerHTML = `<p class="hint" style="margin:0 0 6px">Overrides for <strong>${escapeHtml(unit.name || "Unit")}</strong> (bindings · match.unit)</p>` + keys.map((ev) => {
      const own = SoundPanel.findOwnBinding(ev.id, { unit: unit.id });
      const resolved = SoundPanel.resolveSoundId(ev.id, { unit: unit.id });
      const missing = own && own._state === "unknownRef";
      const def = SoundPanel.getDef(resolved);
      const label = !own ? "Inherit" : (missing ? "Sound missing, pick another" : (def ? def.name : "None"));
      return `<div class="override-row${missing ? " sound-missing" : ""}">
        <span class="ev-label">${escapeHtml(ev.label)}</span>
        <button type="button" class="btn btn-ghost" style="min-height:48px" data-unit-ov="${ev.id}">${escapeHtml(label)}</button>
        <button type="button" class="btn btn-ghost" style="min-height:48px" data-unit-inherit="${ev.id}">Inherit</button>
        <button type="button" class="sound-play" data-play="${(!missing && resolved) || ""}" ${(!missing && resolved) ? "" : "disabled"}>▶</button>
      </div>`;
    }).join("");
  }

  function renderAbilitySounds(targetId) {
    const st = state();
    const box = $(targetId || "#sound-ability-list");
    if (!box || !window.SoundPanel) return;
    SoundPanel.attach(st);
    const abs = SoundPanel.DEMO_ABILITY_SETUPS;
    box.innerHTML = abs.map((ab) => {
      const own = SoundPanel.abilityHasOwnSound(ab.id);
      const castB = SoundPanel.findOwnBinding("ability.cast", { ability: ab.id });
      const hitB = SoundPanel.findOwnBinding("ability.hit", { ability: ab.id });
      const castId = SoundPanel.resolveSoundId("ability.cast", { ability: ab.id });
      const hitId = SoundPanel.resolveSoundId("ability.hit", { ability: ab.id });
      const castMissing = castB && castB._state === "unknownRef";
      const hitMissing = hitB && hitB._state === "unknownRef";
      const castDef = SoundPanel.getDef(castId);
      const hitDef = SoundPanel.getDef(hitId);
      const castLabel = castMissing ? "Sound missing, pick another" : (castDef ? castDef.name : "None");
      const hitLabel = hitMissing ? "Sound missing, pick another" : (hitDef ? hitDef.name : "None");
      return `<div class="ability-sound-card" data-ability="${ab.id}">
        <div class="as-top">
          <strong>${escapeHtml(ab.name)}</strong>
          <button type="button" class="toggle" data-ability-own="${ab.id}" aria-pressed="${own ? "true" : "false"}" style="min-height:48px">Own sound</button>
        </div>
        ${own ? `<div class="as-actions">
          <button type="button" class="btn btn-ghost${castMissing ? " sound-missing" : ""}" style="min-height:48px" data-ability-pick="${ab.id}" data-ev="ability.cast">Cast: ${escapeHtml(castLabel)}</button>
          <button type="button" class="btn btn-ghost${hitMissing ? " sound-missing" : ""}" style="min-height:48px" data-ability-pick="${ab.id}" data-ev="ability.hit">Hit: ${escapeHtml(hitLabel)}</button>
          <button type="button" class="sound-play" data-play="${(!castMissing && castId) || ""}" ${(!castMissing && castId) ? "" : "disabled"} aria-label="Play cast">▶</button>
        </div>` : `<p class="hint" style="margin:0">Uses shared Cast / Hit</p>`}
      </div>`;
    }).join("");
  }

  function openOwnSoundPicker(opts) {
    const st = state();
    if (!st.soundUi) return;
    st.soundUi.pickerFor = opts.pickerFor || "ability-override";
    st.soundUi.abilityId = opts.abilityId || null;
    st.soundUi.abilityEvent = opts.eventId || "ability.cast";
    st.soundUi.ownPickerOpen = true;
    st.soundUi.assignEvent = opts.eventId || st.soundUi.assignEvent;
    const panel = $("#own-sound-picker");
    if (panel) panel.hidden = false;
    const title = $("#own-sound-picker-title");
    const hint = $("#own-sound-picker-hint");
    const ab = opts.abilityId && (SoundPanel.DEMO_ABILITY_SETUPS || []).find((a) => a.id === opts.abilityId);
    if (title) title.textContent = ab ? (ab.name + " · Own sound") : "Own sound";
    if (hint) hint.textContent = "Make a sound, upload a file, or pick Built-in. Or use the shared sound.";
    // ensure sound sheet open
    openSoundSheet({ pickerFor: st.soundUi.pickerFor, abilityId: opts.abilityId, assignEvent: opts.eventId, ownPickerOpen: true });
    // scroll picker into view
    setTimeout(() => {
      const body = $("#stage-sheet-body");
      if (body && panel) {
        const br = body.getBoundingClientRect();
        const pr = panel.getBoundingClientRect();
        body.scrollTop += (pr.top - br.top) - 12;
      }
    }, 80);
  }

  function closeOwnSoundPicker() {
    const st = state();
    if (st.soundUi) st.soundUi.ownPickerOpen = false;
    const panel = $("#own-sound-picker");
    if (panel) panel.hidden = true;
  }

  function playGen() {
    const st = state();
    if (!window.SoundPanel) return;
    SoundPanel.unlockFromGesture().then(() => {
      SoundPanel.playFromFriendly(st.soundGen.recipe, st.soundGen.friendly, { seed: st.soundGen.seed });
    });
  }

  /* ---------- Profile ---------- */
  function renderProfile() {
    if (!window.ProfileStore) return;
    const p = ProfileStore.load();
    const name = $("#profile-name");
    if (name) name.value = (p.prefs && p.prefs.name) || "Maker";
    const av = $("#profile-avatar");
    if (av && !(window.TileEngineQoL && TileEngineQoL.enhanceProfile)) {
      const id = p.prefs && p.prefs.avatarId;
      if (id) {
        const meta = ProfileStore.AVATARS.find((a) => a.id === id);
        av.textContent = meta ? meta.label.slice(0, 1) : "?";
      } else {
        const n = (p.prefs && p.prefs.name) || "Maker";
        av.textContent = n.slice(0, 1).toUpperCase();
      }
    }
    const theme = (p.prefs && p.prefs.theme) || "system";
    $$("[data-appearance]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-appearance") === theme ? "true" : "false"));

    const avatars = $("#profile-avatars");
    if (avatars) {
      avatars.innerHTML = ProfileStore.AVATARS.map((a) =>
        `<button type="button" class="toggle" data-avatar="${a.id}" aria-pressed="${(p.prefs && p.prefs.avatarId) === a.id ? "true" : "false"}" style="min-height:48px">${escapeHtml(a.label)}</button>`
      ).join("") + `<button type="button" class="toggle soon" disabled aria-disabled="true" style="min-height:48px">Upload… Coming later</button>`;
    }

    const coinEl = $("#profile-coin-count");
    if (coinEl) coinEl.textContent = String(ProfileStore.getCoins());
    const stats = $("#profile-stats");
    if (stats) {
      const pairs = [
        ["Stages", ProfileStore.counterSum(p, "stageCreated")],
        ["Sprites", ProfileStore.counterSum(p, "spriteUploaded")],
        ["Play-tests", ProfileStore.counterSum(p, "previewStarted")],
        ["Builds", ProfileStore.counterSum(p, "buildStarted")],
      ];
      stats.innerHTML = pairs.map(([l, v]) => `<div class="profile-stat"><b>${v}</b><span>${l}</span></div>`).join("");
    }

    const list = $("#ach-list");
    if (list && !(window.TileEngineQoL && TileEngineQoL.renderAchievementsScreen)) {
      const rows = ProfileStore.listForUi(p);
      const unknownCount = rows.filter((r) => r.status === "unknown").length;
      list.innerHTML = rows.map((r) => {
        const pct = Math.min(100, Math.round((100 * r.progress.current) / Math.max(1, r.progress.target)));
        const grey = r.greyed || r.status === "unknown" ? " style=\"opacity:.7\"" : "";
        return `<div class="ach-card ${r.unlocked ? "" : "locked"}"${grey}>
          <div class="ach-top"><strong>${escapeHtml(r.title)}</strong><span class="ach-cat">${escapeHtml(r.categoryLabel)}</span></div>
          <p class="hint" style="margin:4px 0 0">${escapeHtml(r.description)}</p>
          <div class="ach-bar" aria-hidden="true"><i style="width:${r.unlocked ? 100 : pct}%"></i></div>
          <p class="hint" style="margin:4px 0 0">${r.unlocked ? "Unlocked" : r.progress.current + " / " + r.progress.target}</p>
        </div>`;
      }).join("") + (unknownCount ? `<p class="hint">${unknownCount} from a newer version (kept)</p>` : "");
    }

    const pv = $("#preview-volume");
    if (pv) {
      const ep = ProfileStore.loadEditorPrefs();
      pv.value = ep.previewVolume;
      const val = $("#preview-volume-val");
      if (val) val.textContent = ep.previewVolume + "%";
    }
    if (window.TileEngineQoL && TileEngineQoL.enhanceProfile) TileEngineQoL.enhanceProfile();
  }

  /* ---------- Game settings ---------- */
  let gsWriteTimer = null;
  function scheduleGsWrite() {
    // Instant apply in memory; debounced 300 ms persist (r2 §3.5.1)
    clearTimeout(gsWriteTimer);
    gsWriteTimer = setTimeout(() => {
      // mock: values already on state.gameSettings; flush hook for future ProjectStore
      const st = state();
      if (st.gameSettings) st.gameSettings._flushedAt = Date.now();
    }, 300);
  }
  function stampGs(key) {
    const gs = ensureGameSettings();
    gs.stamps = gs.stamps || {};
    gs.stamps[key] = { at: new Date().toISOString(), deviceId: "device_proto" };
  }
  function ensureGameSettings() {
    const st = state();
    if (!st.gameSettings || st.gameSettings._rev !== 4) {
      st.gameSettings = {
        template: "btf-hud-settings@1",
        _rev: 4,
        controls: [],
        values: {},
        stamps: {},
      };
      const tpl = ProfileStore.BTF_TEMPLATE;
      tpl.groups.forEach((g) => g.settings.forEach((s) => {
        // CEO: Before The Fall extras + keybinds OFF by default for new games
        const on = s.core ? true : (s.includeDefault === false ? false : true);
        st.gameSettings.controls.push({
          key: s.key,
          include: on,
          hidden: false,
          default: s.default,
          showIn: s.showIn || "both",
        });
        st.gameSettings.values[s.key] = s.default;
      }));
    }
    return st.gameSettings;
  }

  function renderGameSettings() {
    if (!window.ProfileStore) return;
    const gs = ensureGameSettings();
    const tpl = ProfileStore.BTF_TEMPLATE;
    const box = $("#game-settings-list");
    if (!box) return;
    let html = "";
    tpl.groups.forEach((g) => {
      html += `<p class="eyebrow" style="margin-top:12px">${escapeHtml(g.label)}</p>`;
      g.settings.forEach((s) => {
        const c = gs.controls.find((x) => x.key === s.key) || { key: s.key, include: true, hidden: false, default: s.default, showIn: "both" };
        const val = gs.values[s.key];
        const showIn = c.showIn || s.showIn || "both";
        html += `<div class="gs-row" data-gs-key="${s.key}">
          <div class="gs-row-top">
            <span class="gs-label">${escapeHtml(s.label)}${s.proposed ? ' <span class="gs-proposed">Proposed</span>' : ""}</span>
            ${s.core
              ? '<span class="gs-required" title="Required — always shown">🔒 Required</span>'
              : `<button type="button" class="toggle" data-gs-include="${s.key}" aria-pressed="${c.include !== false ? "true" : "false"}">Include</button>
                 <button type="button" class="toggle" data-gs-hide="${s.key}" aria-pressed="${c.hidden ? "true" : "false"}">Hide</button>`}
          </div>`;
        if (s.type === "slider") {
          html += `<label>Default <span class="val">${val == null ? s.default : val}</span></label><input class="slider" type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${val == null ? s.default : val}" data-gs-val="${s.key}" aria-label="${escapeHtml(s.label)}" />`;
        } else if (s.type === "picker") {
          const cur = val == null ? s.default : val;
          html += `<div class="toggle-row" role="group">` + s.options.map((o) =>
            `<button type="button" class="toggle" data-gs-pick="${s.key}" data-val="${o.value}" aria-pressed="${String(cur) === String(o.value) ? "true" : "false"}">${escapeHtml(o.label)}</button>`
          ).join("") + `</div>`;
        } else if (s.type === "toggle") {
          const on = !!(val == null ? s.default : val);
          html += `<div class="toggle-row"><button type="button" class="toggle" data-gs-pick="${s.key}" data-val="true" aria-pressed="${on ? "true" : "false"}">${(s.valueLabels && s.valueLabels.on) || "On"}</button>
            <button type="button" class="toggle" data-gs-pick="${s.key}" data-val="false" aria-pressed="${!on ? "true" : "false"}">${(s.valueLabels && s.valueLabels.off) || "Off"}</button></div>`;
        } else if (s.type === "keybind") {
          html += `<p class="hint">Default key: <strong>${escapeHtml(String(val == null ? s.default : val))}</strong> (PC only · Include off for new games)</p>`;
        }
        html += `<details class="advanced"><summary>Advanced</summary><div class="inner">
          <p class="hint">Show in</p>
          <div class="toggle-row">
            <button type="button" class="toggle" data-gs-showin="${s.key}" data-val="title" aria-pressed="${showIn === "title" ? "true" : "false"}">Title menu</button>
            <button type="button" class="toggle" data-gs-showin="${s.key}" data-val="pause" aria-pressed="${showIn === "pause" ? "true" : "false"}">Pause menu</button>
            <button type="button" class="toggle" data-gs-showin="${s.key}" data-val="both" aria-pressed="${showIn === "both" ? "true" : "false"}">Both</button>
          </div>
        </div></details></div>`;
      });
    });
    html += `<button type="button" class="btn btn-ghost" id="btn-gs-reset" style="width:100%;min-height:48px;margin-top:12px">Reset to defaults</button>`;
    html += `<p class="hint">Changes apply instantly with live preview. Reset restores defaults. Editor preview volume is separate and never exported.</p>`;
    box.innerHTML = html;
    renderGsPreview();
  }

  function renderGsPreview() {
    const gs = ensureGameSettings();
    const card = $("#gs-preview-card");
    if (!card || !window.ProfileStore) return;
    const tpl = ProfileStore.BTF_TEMPLATE;
    const rows = [];
    tpl.groups.forEach((g) => g.settings.forEach((s) => {
      const c = gs.controls.find((x) => x.key === s.key);
      if (c && c.include === false) return;
      if (c && c.hidden) return;
      const v = gs.values[s.key] == null ? s.default : gs.values[s.key];
      let text = s.label + ": ";
      if (s.type === "slider") text += v;
      else if (s.type === "picker") {
        const o = (s.options || []).find((x) => String(x.value) === String(v));
        text += o ? o.label : v;
      } else if (s.type === "keybind") text += v;
      else text += v ? ((s.valueLabels && s.valueLabels.on) || "On") : ((s.valueLabels && s.valueLabels.off) || "Off");
      rows.push(`<div class="gs-btn ${s.key === "edge_glow" && v ? "on" : ""}">${escapeHtml(text)}</div>`);
    }));
    card.innerHTML = `<p style="margin:0 0 8px;font-weight:700">Settings</p>` + rows.join("") + `<div class="gs-btn">Back</div>`;
  }

  function livePreviewAudio(key, val) {
    // Audition at preview volume — never writes exported defaults beyond gameSettings.values
    if (!window.SoundPanel || !window.ProfileStore) return;
    const ep = ProfileStore.loadEditorPrefs();
    const vol = (ep.previewVolume != null ? ep.previewVolume : 100) / 100;
    if (key === "bgm" || key === "sfx" || key === "master") {
      SoundPanel.unlockFromGesture().then(() => {
        const recipe = key === "bgm" ? "bed" : "click";
        const length = key === "bgm" ? 0.4 : 0.08;
        SoundPanel.playFromFriendly(recipe, { pitch: 1, length, volume: vol * (Number(val) / 100), punch: 0.3, wobble: 0, noise: 0.05 }, { seed: 3 });
      });
    }
  }


  /* ---------- Hub: library / shop / chart (PROPOSED) ---------- */
  // made-game v1 mock (§9.0) + live votes for chart
  const HUB_GAMES = [
    { kind: "made-game", formatVersion: 1, gameId: "project_yours", publisherAccountId: "acct_you", title: "Floor Tactics", iconAssetId: null, links: [{ store: "itch", url: "https://example.itch.io/floor-tactics" }], publishedAt: "2026-09-01T00:00:00Z", listedAt: "2026-09-01T00:00:00Z", maker: "You", yours: true, votes: 12, allTimeVotes: 40, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_ash", publisherAccountId: "acct_rai", title: "Ashroad Skirmish", iconAssetId: null, links: [{ store: "appStore", url: "https://apps.apple.com/app/id000" }], publishedAt: "2026-08-15T00:00:00Z", listedAt: "2026-08-15T00:00:00Z", maker: "RaiKynn", yours: false, votes: 88, allTimeVotes: 210, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_moon", publisherAccountId: "acct_north", title: "Moonlit Duels", iconAssetId: null, links: [{ store: "web", url: "https://play.example.com/moonlit" }], publishedAt: "2026-07-20T00:00:00Z", listedAt: "2026-07-20T00:00:00Z", maker: "Studio North", yours: false, votes: 64, allTimeVotes: 150, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_grid", publisherAccountId: "acct_bee", title: "Grid Knights", iconAssetId: null, links: [{ store: "play", url: "https://play.google.com/store/apps/details?id=x" }], publishedAt: "2026-06-01T00:00:00Z", listedAt: "2026-06-01T00:00:00Z", maker: "Indie Bee", yours: false, votes: 41, allTimeVotes: 120, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_tide", publisherAccountId: "acct_tide", title: "Tidebound", iconAssetId: null, links: [{ store: "web", url: "https://example.com/tide" }], publishedAt: "2026-05-01T00:00:00Z", listedAt: "2026-05-01T00:00:00Z", maker: "Tide Co", yours: false, votes: 37, allTimeVotes: 95, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_ember", publisherAccountId: "acct_ember", title: "Ember March", iconAssetId: null, links: [{ store: "itch", url: "https://example.itch.io/ember" }], publishedAt: "2026-04-01T00:00:00Z", listedAt: "2026-04-01T00:00:00Z", maker: "Ember Lab", yours: false, votes: 33, allTimeVotes: 88, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_frost", publisherAccountId: "acct_frost", title: "Frost Columns", iconAssetId: null, links: [{ store: "web", url: "https://example.com/frost" }], publishedAt: "2026-03-01T00:00:00Z", listedAt: "2026-03-01T00:00:00Z", maker: "Frostbyte", yours: false, votes: 29, allTimeVotes: 70, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_sand", publisherAccountId: "acct_sand", title: "Sandline Siege", iconAssetId: null, links: [{ store: "play", url: "https://play.google.com/store/apps/details?id=sand" }], publishedAt: "2026-02-01T00:00:00Z", listedAt: "2026-02-01T00:00:00Z", maker: "Dune Soft", yours: false, votes: 25, allTimeVotes: 60, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_veil", publisherAccountId: "acct_veil", title: "Veil Tactics", iconAssetId: null, links: [{ store: "web", url: "https://example.com/veil" }], publishedAt: "2026-01-15T00:00:00Z", listedAt: "2026-01-15T00:00:00Z", maker: "Veil Works", yours: false, votes: 22, allTimeVotes: 55, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_oak", publisherAccountId: "acct_oak", title: "Oak & Iron", iconAssetId: null, links: [{ store: "itch", url: "https://example.itch.io/oak" }], publishedAt: "2025-12-01T00:00:00Z", listedAt: "2025-12-01T00:00:00Z", maker: "Oak Games", yours: false, votes: 18, allTimeVotes: 44, flagged: false },
    { kind: "made-game", formatVersion: 1, gameId: "project_spark", publisherAccountId: "acct_spark", title: "Spark Arena", iconAssetId: null, links: [{ store: "web", url: "https://example.com/spark" }], publishedAt: "2025-11-01T00:00:00Z", listedAt: "2025-11-01T00:00:00Z", maker: "Spark", yours: false, votes: 15, allTimeVotes: 30, flagged: true },
  ];
  const HUB_ASSETS = [
    { id: "pack_code_sfx", name: "Procedural hit kit", maker: "Code lab", votes: 54, allTimeVotes: 130, yours: false, kind: "sound", flagged: false },
    { id: "pack_code_tiles", name: "Code-paint tile recipes", maker: "Code lab", votes: 48, allTimeVotes: 110, yours: false, kind: "art", flagged: false },
    { id: "pack_comm_ash", name: "Ashroad footfalls", maker: "RaiKynn", votes: 40, allTimeVotes: 105, yours: false, kind: "sound", flagged: false },
    { id: "pack_comm_moon", name: "Moonlit tile pack", maker: "Studio North", votes: 36, allTimeVotes: 90, yours: false, kind: "art", flagged: false },
    { id: "pack_kenney_ui", name: "Kenney UI Audio", maker: "Kenney", votes: 30, allTimeVotes: 200, yours: false, kind: "sound", flagged: false },
    { id: "pack_code_beds", name: "Soft loop generator", maker: "Code lab", votes: 28, allTimeVotes: 70, yours: false, kind: "sound", flagged: false },
    { id: "pack_tiles_extra", name: "Extra tiles", maker: "Hub", votes: 22, allTimeVotes: 50, yours: false, kind: "art", flagged: false },
    { id: "pack_flagged_demo", name: "Sketchy SFX dump", maker: "Anon", votes: 99, allTimeVotes: 99, yours: false, kind: "sound", flagged: true },
  ];
  const CHART_SNAPSHOTS = {
    "2026-10": {
      kind: "chart-snapshot", formatVersion: 1, chartId: "chart_2026-10", month: "2026-10",
      frozenAt: "2026-11-01T00:00:00Z",
      gameOfTheMonth: "project_ash",
      assetOfTheMonth: "pack_kenney_ui",
      entries: [
        { rank: 1, gameId: "project_ash", votes: 120 },
        { rank: 2, gameId: "project_moon", votes: 90 },
        { rank: 3, gameId: "project_grid", votes: 55 },
        { rank: 4, gameId: "project_yours", votes: 18 },
      ],
      assetEntries: [
        { rank: 1, assetId: "pack_kenney_ui", votes: 140 },
        { rank: 2, assetId: "pack_code_sfx", votes: 95 },
        { rank: 3, assetId: "pack_comm_ash", votes: 70 },
      ],
    },
  };
  const HUB_PACKS = [
    { id: "pack_kenney_ui", name: "Kenney UI Audio", cost: 20, tag: "CC0 · Kenney", section: "packs", kind: "sound", allTimeVotes: 200 },
    { id: "pack_kenney_impact", name: "Kenney Impacts", cost: 15, tag: "CC0 · Kenney", section: "packs", kind: "sound", allTimeVotes: 80 },
    { id: "pack_tiles_extra", name: "Extra tiles (placeholder)", cost: 30, tag: "CC0 placeholder", section: "packs", kind: "art", allTimeVotes: 50 },
    { id: "pack_code_sfx", name: "Procedural hit kit", cost: 18, tag: "JS generative · sfxr", section: "codegen", kind: "sound", allTimeVotes: 130 },
    { id: "pack_code_tiles", name: "Code-paint tile recipes", cost: 22, tag: "JS generative · art", section: "codegen", kind: "art", allTimeVotes: 110 },
    { id: "pack_code_beds", name: "Soft loop generator", cost: 28, tag: "JS generative · music", section: "codegen", kind: "sound", allTimeVotes: 70 },
    { id: "pack_comm_ash", name: "Ashroad footfalls", cost: 12, tag: "Community · pending review cleared", section: "community", kind: "sound", allTimeVotes: 105 },
    { id: "pack_comm_moon", name: "Moonlit tile pack", cost: 16, tag: "Community · CC0", section: "community", kind: "art", allTimeVotes: 90 },
  ];
  let shopTab = "packs";
  let chartMonth = "live";
  // Vote rate (reported via DSK, 2026-11-10 15:03 Europe/London): 1 / 60 min, 12 / UTC day
  const VOTES_PER_HOUR = 1;
  const VOTES_PER_DAY = 12;
  const VOTE_MIN_ACCOUNT_DAYS = 7;
  const VOTE_HOUR_MS = 60 * 60 * 1000;
  const VOTE_STORE_KEY = "tileengine.votes.v1";
  const VOTE_USAGE_KEY = "tileengine.voteprompt.usage.v1";
  const VOTE_PROMPT_MS = 60 * 60 * 1000;
  let voteAccount = { signedIn: true, accountId: "acct_you", createdAt: Date.now() - 40 * 86400000 };
  let voteState = { day: "", sends: [], lastVoteAt: null, retryAt: null };
  let monthVotes = {}; // subjectId -> { month, kind }
  let outbound = { url: "", title: "", returnTo: "hub-library" };
  let pendingUpload = null; // { name, bytes, durationMs, kind }
  // Chart daily refresh mock (not live) — last rebuild at local midnight-ish offset
  let chartUpdatedAt = Date.now() - 3 * 3600 * 1000; // ~3h ago for "next update in Xh"
  let chartSection = "games"; // games | assets
  let chartCarouselIdx = 0;
  let chartCarouselTimer = null;
  let chartCarouselPaused = false;
  let recommendedSeed = 0;
  let promptAsset = null;
  let thanksTimer = null;
  let usageLastTick = 0;

  function utcDayKey(d) {
    const x = d || new Date();
    return x.getUTCFullYear() + "-" + String(x.getUTCMonth() + 1).padStart(2, "0") + "-" + String(x.getUTCDate()).padStart(2, "0");
  }
  function utcMonthKey(d) {
    const x = d || new Date();
    return x.getUTCFullYear() + "-" + String(x.getUTCMonth() + 1).padStart(2, "0");
  }
  function loadVoteStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(VOTE_STORE_KEY) || "null");
      if (raw && raw.voteState) voteState = raw.voteState;
      if (raw && raw.monthVotes) monthVotes = raw.monthVotes;
    } catch (e) { /* mock store */ }
    getDayState();
  }
  function saveVoteStore() {
    try { localStorage.setItem(VOTE_STORE_KEY, JSON.stringify({ voteState, monthVotes })); } catch (e) { /* ignore */ }
  }
  function getDayState() {
    const day = utcDayKey();
    if (!voteState || voteState.day !== day) {
      voteState = {
        day,
        sends: [],
        lastVoteAt: voteState && voteState.lastVoteAt,
        retryAt: voteState && voteState.retryAt,
      };
    }
    return voteState;
  }
  function votesUsedToday() { return (getDayState().sends || []).length; }
  function votesLeftToday() { return Math.max(0, VOTES_PER_DAY - votesUsedToday()); }
  function votedThisMonth(id) {
    const rec = monthVotes[id];
    return !!(rec && rec.month === utcMonthKey());
  }
  function getRetryAt() { return (getDayState().retryAt) || 0; }
  function isHourLocked() { return getRetryAt() > Date.now(); }
  function isDailyCapped() { return votesLeftToday() <= 0; }
  function isVoteLocked() { return isDailyCapped() || isHourLocked(); }
  function minutesUntilRetry() {
    const ms = Math.max(0, getRetryAt() - Date.now());
    return Math.max(1, Math.ceil(ms / 60000));
  }
  function accountAgeDays() {
    if (!voteAccount || !voteAccount.createdAt) return 0;
    return Math.floor((Date.now() - voteAccount.createdAt) / 86400000);
  }
  function subjectId(target) {
    return target && (target.voteKey || target.gameId || target.id);
  }
  function canSendVote(target) {
    if (!target) return { ok: false, reason: "missing" };
    if (!voteAccount || !voteAccount.signedIn) return { ok: false, reason: "voteNeedsAccount" };
    if (accountAgeDays() < VOTE_MIN_ACCOUNT_DAYS) return { ok: false, reason: "voteAccountTooNew" };
    if (target.yours) return { ok: false, reason: "voteOwnSubject" };
    if (target.flagged) return { ok: false, reason: "flagged" };
    const id = subjectId(target);
    if (votedThisMonth(id)) return { ok: false, reason: "alreadyVotedThisMonth" };
    if (isDailyCapped()) return { ok: false, reason: "voteRateLimited", retryAt: nextUtcMidnight() };
    if (isHourLocked()) return { ok: false, reason: "voteRateLimited", retryAt: getRetryAt() };
    return { ok: true };
  }
  function nextUtcMidnight() {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0);
  }
  function applyVote(target) {
    const id = subjectId(target);
    if (!id) return { ok: false, reason: "missing" };
    if (votedThisMonth(id)) {
      target.votes = Math.max(0, (target.votes || 0) - 1);
      delete monthVotes[id];
      saveVoteStore();
      return { ok: true, withdrawn: true };
    }
    const gate = canSendVote(target);
    if (!gate.ok) return gate;
    const now = Date.now();
    getDayState().sends.push({ id, at: now });
    voteState.lastVoteAt = now;
    voteState.retryAt = now + (VOTE_HOUR_MS / Math.max(1, VOTES_PER_HOUR));
    monthVotes[id] = { month: utcMonthKey(), kind: target.gameId ? "game" : "asset" };
    target.votes = (target.votes || 0) + 1;
    saveVoteStore();
    return { ok: true, withdrawn: false, retryAt: voteState.retryAt };
  }
  function hoursUntilChartUpdate() {
    const elapsed = Date.now() - chartUpdatedAt;
    const left = Math.max(0, 24 * 3600 * 1000 - elapsed);
    return Math.max(1, Math.ceil(left / 3600000));
  }
  function dailyVoteStatusText() {
    const left = votesLeftToday();
    if (left <= 0) return "No votes left today · resets 00:00 UTC";
    if (isHourLocked()) return "Next vote in " + minutesUntilRetry() + "m · " + left + " of " + VOTES_PER_DAY + " left today";
    return "Vote ready · " + left + " of " + VOTES_PER_DAY + " left today";
  }
  function voteLockLabel() {
    if (isDailyCapped()) return "No votes left today";
    if (isHourLocked()) return "Next vote in " + minutesUntilRetry() + "m";
    return "";
  }
  function setVoteStateForCapture(opts) {
    opts = opts || {};
    const now = Date.now();
    voteAccount = {
      signedIn: opts.signedIn !== false,
      accountId: "acct_you",
      createdAt: now - (opts.ageDays != null ? opts.ageDays : 40) * 86400000,
    };
    voteState = { day: utcDayKey(), sends: [], lastVoteAt: null, retryAt: null };
    monthVotes = {};
    const skip = opts.skipIds || ["project_ash"];
    const pool = HUB_GAMES.filter((g) => !g.yours && !g.flagged && skip.indexOf(g.gameId) < 0)
      .concat(HUB_ASSETS.filter((a) => !a.yours && !a.flagged && skip.indexOf(a.id) < 0));
    const n = Math.max(0, Number(opts.usedToday) || 0);
    for (let i = 0; i < n; i++) {
      const it = pool[i];
      if (!it) break;
      const id = it.gameId || it.id;
      const at = now - (n - i) * 1000;
      voteState.sends.push({ id, at });
      monthVotes[id] = { month: utcMonthKey(), kind: it.gameId ? "game" : "asset" };
    }
    if (opts.retryInMs != null && Number(opts.retryInMs) > 0) {
      voteState.retryAt = now + Number(opts.retryInMs);
      voteState.lastVoteAt = voteState.retryAt - VOTE_HOUR_MS;
    }
    saveVoteStore();
  }

  /* --- Asset-usage vote prompt (§9.7.1) --- */
  function loadUsage() {
    try { return JSON.parse(localStorage.getItem(VOTE_USAGE_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveUsage(map) {
    try { localStorage.setItem(VOTE_USAGE_KEY, JSON.stringify(map)); } catch (e) { /* ignore */ }
  }
  function usedHubAssets() {
    const p = ProfileStore.load();
    const owned = p.ownedPacks || [];
    const ids = owned.length ? owned : ["pack_code_sfx"];
    return HUB_ASSETS.filter((a) => ids.indexOf(a.id) >= 0);
  }
  function promptWouldBeRefused(asset) {
    if (!asset || asset.yours) return true;
    if (votedThisMonth(asset.id)) return true;
    return !canSendVote(asset).ok;
  }
  function hideVotePrompt() {
    const el = $("#vote-prompt");
    if (el) { el.hidden = true; delete el.dataset.parked; }
    promptAsset = null;
  }
  function hideVoteThanks() {
    const el = $("#vote-thanks");
    if (el) el.hidden = true;
  }
  function showVoteThanks() {
    hideVotePrompt();
    const el = $("#vote-thanks");
    if (!el) return;
    el.hidden = false;
    el.textContent = "Thanks, vote counted";
    clearTimeout(thanksTimer);
    thanksTimer = setTimeout(() => { el.hidden = true; }, 2400);
  }
  function showVotePrompt(asset) {
    if (!asset) return false;
    if (promptWouldBeRefused(asset)) return false;
    const wrap = $("#vote-prompt");
    if (!wrap) return false;
    const sheet = $("#stage-sheet");
    if (sheet && !sheet.hidden) return false;
    promptAsset = asset;
    const title = $("#vote-prompt-title");
    if (title) title.textContent = "Enjoying " + asset.name + "?";
    const creator = $("#vote-prompt-creator");
    if (creator) creator.textContent = asset.maker || "";
    const thumb = $("#vote-prompt-thumb");
    if (thumb) thumb.textContent = asset.kind === "art" ? "🎨" : "🔊";
    hideVoteThanks();
    wrap.hidden = false;
    return true;
  }
  function markUsageState(id, state, usedMs) {
    const usage = loadUsage();
    const rec = usage[id] || { usedMs: 0, state: "counting" };
    if (state) rec.state = state;
    if (usedMs != null) rec.usedMs = usedMs;
    usage[id] = rec;
    saveUsage(usage);
  }
  function pickPromptAsset() {
    const usage = loadUsage();
    const candidates = usedHubAssets().filter((a) => {
      if (promptWouldBeRefused(a)) return false;
      const rec = usage[a.id] || { usedMs: 0, state: "counting" };
      if (rec.state === "done") return false;
      return (rec.usedMs || 0) >= VOTE_PROMPT_MS;
    });
    return candidates[0] || null;
  }
  function maybeShowVotePrompt() {
    const stage = $("#screen-stage");
    if (!stage || !stage.classList.contains("active")) return;
    const wrap = $("#vote-prompt");
    if (wrap && !wrap.hidden) return;
    const thanks = $("#vote-thanks");
    if (thanks && !thanks.hidden) return;
    const asset = pickPromptAsset();
    if (asset) showVotePrompt(asset);
  }
  function tickUsage() {
    const stage = $("#screen-stage");
    if (!stage || !stage.classList.contains("active")) { usageLastTick = 0; return; }
    const now = Date.now();
    if (!usageLastTick) usageLastTick = now;
    const delta = Math.min(now - usageLastTick, 15000);
    usageLastTick = now;
    const usage = loadUsage();
    let changed = false;
    usedHubAssets().forEach((a) => {
      const rec = usage[a.id] || { usedMs: 0, state: "counting" };
      if (rec.state === "done") return;
      rec.usedMs = (rec.usedMs || 0) + delta;
      usage[a.id] = rec;
      changed = true;
    });
    if (changed) saveUsage(usage);
    maybeShowVotePrompt();
  }
  function onVotePromptNow() {
    if (!promptAsset) { hideVotePrompt(); return; }
    const r = applyVote(promptAsset);
    markUsageState(promptAsset.id, "done", 0);
    if (r.ok && !r.withdrawn) showVoteThanks();
    else hideVotePrompt();
  }
  function onVotePromptLater() {
    if (promptAsset) markUsageState(promptAsset.id, "later", 0);
    hideVotePrompt();
  }
  function onVotePromptNever() {
    if (promptAsset) markUsageState(promptAsset.id, "done", 0);
    hideVotePrompt();
  }
  function showVotePromptForCapture(assetId) {
    voteAccount = { signedIn: true, accountId: "acct_you", createdAt: Date.now() - 40 * 86400000 };
    const asset = HUB_ASSETS.find((a) => a.id === (assetId || "pack_code_sfx")) || HUB_ASSETS[0];
    return showVotePrompt(asset);
  }

  loadVoteStore();
  function pickRecommended(pool) {
    const eligible = pool.filter((x) => (x.allTimeVotes || x.votes || 0) > 100);
    const list = eligible.length ? eligible : pool;
    if (!list.length) return null;
    recommendedSeed = (recommendedSeed * 1103515245 + 12345) >>> 0;
    // re-pick on every open: mix seed with time (unsigned index — JS % keeps sign)
    const mixed = (recommendedSeed ^ (Date.now() & 0xffff)) >>> 0;
    const i = mixed % list.length;
    return list[i];
  }

  function storeLabel(s) {
    return ({ appStore: "App Store", play: "Play", itch: "itch", web: "Web" })[s] || s;
  }
  function renderRecommendCard(elId, item, kindLabel) {
    const id = (elId || "").replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    if (!item) { el.hidden = true; el.innerHTML = ""; return; }
    el.hidden = false;
    el.innerHTML = `<p class="eyebrow" style="margin:0 0 6px">Recommended</p>
      <strong>${escapeHtml(item.title || item.name)}</strong>
      <p class="hint" style="margin:4px 0 0">${escapeHtml(item.maker || "")} · ${kindLabel} · ${item.allTimeVotes || item.votes || 0} all-time thumbs</p>
      <p class="hint" style="margin:4px 0 0">Fresh pick each time you open this screen.</p>`;
  }

  function renderHubLibrary() {
    const box = $("#hub-library-grid");
    if (!box) return;
    const rec = pickRecommended(HUB_GAMES.filter((g) => !g.yours));
    renderRecommendCard("#hub-recommended", rec, "game");
    box.innerHTML = HUB_GAMES.map((g) => {
      const badges = (g.links || []).map((l) => storeLabel(l.store).toUpperCase()).join(" · ");
      return `<button type="button" class="game-card" data-open-game="${g.gameId}">
        <div class="thumb">${escapeHtml(g.title.slice(0,1))}</div>
        <strong>${escapeHtml(g.title)}</strong>
        <div class="hint" style="margin:4px 0 0">${escapeHtml(g.maker)}${g.yours ? ' <span class="badge-yours">Yours</span>' : ""}</div>
        <div class="hint">${escapeHtml(badges)}</div>
      </button>`;
    }).join("");
  }

  function renderHubShop() {
    const p = ProfileStore.load();
    const c = $("#shop-coin-count");
    if (c) c.textContent = String(ProfileStore.getCoins());
    $$("[data-shop-tab]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-shop-tab") === shopTab ? "true" : "false"));
    const rec = pickRecommended(HUB_ASSETS.concat(HUB_PACKS));
    renderRecommendCard("#shop-recommended", rec, "asset");
    const box = $("#hub-shop-list");
    if (!box) return;
    const owned = p.ownedPacks || [];
    const packs = HUB_PACKS.filter((x) => (x.section || "packs") === shopTab);
    if (!packs.length) {
      box.innerHTML = '<p class="hint">Nothing in this section yet.</p>';
      return;
    }
    box.innerHTML = packs.map((pack) => {
      const isOwned = owned.indexOf(pack.id) >= 0;
      const tagClass = pack.section === "codegen" ? "tag-code" : (pack.section === "community" ? "tag-community" : "");
      const ico = pack.kind === "sound" ? "🔊" : (pack.kind === "art" ? "🎨" : "📦");
      return `<div class="shop-card">
        <div class="thumb">${ico}</div>
        <strong>${escapeHtml(pack.name)}</strong>
        <p class="hint" style="margin:4px 0"><span class="${tagClass}">${escapeHtml(pack.tag)}</span> · ${pack.cost} 🪙 <span class="gs-proposed">placeholder</span></p>
        <button type="button" class="btn ${isOwned ? "btn-ghost" : "btn-primary"}" style="min-height:48px;width:100%"
          data-buy-pack="${pack.id}" ${isOwned ? "disabled" : ""}>${isOwned ? "Owned" : "Buy"}</button>
      </div>`;
    }).join("");
  }

  function countedVotes(item) {
    // Flagged votes don't count until approved (reported via DSK / CEO 2026-11-10)
    if (item.flagged) return 0;
    return item.votes || 0;
  }

  function stopChartCarousel() {
    if (chartCarouselTimer) { clearInterval(chartCarouselTimer); chartCarouselTimer = null; }
  }
  function startChartCarousel(n) {
    stopChartCarousel();
    if (n <= 1) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || chartCarouselPaused) return;
    chartCarouselTimer = setInterval(() => {
      chartCarouselIdx = (chartCarouselIdx + 1) % n;
      paintCarouselSlide();
    }, 10000);
  }
  let _carouselItems = [];
  function paintCarouselSlide() {
    const slide = $("#chart-runners-slide");
    const dots = $("#chart-runners-dots");
    const countEl = $("#chart-runners-count");
    if (!slide) return;
    const items = _carouselItems;
    if (!items.length) {
      slide.innerHTML = '<p class="hint" style="margin:0">No runners-up yet.</p>';
      if (dots) dots.innerHTML = "";
      if (countEl) countEl.textContent = "0/0";
      return;
    }
    const idx = chartCarouselIdx % items.length;
    const it = items[idx];
    slide.innerHTML = `<div class="chart-runner-card">
      <span class="chart-rank">#${it.rank}</span>
      <div style="flex:1;min-width:0"><strong>${escapeHtml(it.title || it.name)}</strong>
        <div class="hint">${escapeHtml(it.maker || "")}</div></div>
      <span class="vote-count">👍 ${it.votes}</span>
    </div>`;
    if (dots) {
      // Decorative dots only (swipe / prev-next / counter are the controls — keeps chrome slim)
      dots.innerHTML = items.map((_, i) =>
        `<span class="chart-dot" aria-current="${i === idx ? "true" : "false"}"></span>`
      ).join("");
    }
    if (countEl) countEl.textContent = (idx + 1) + "/" + items.length;
  }

  function renderHubChart() {
    const box = $("#hub-chart-list");
    if (!box) return;
    const frozen = chartMonth !== "live";
    const snap = CHART_SNAPSHOTS["2026-10"];
    const isAssets = chartSection === "assets";
    $$("[data-chart-section]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-chart-section") === chartSection ? "true" : "false"));

    const byGame = Object.fromEntries(HUB_GAMES.map((g) => [g.gameId, g]));
    const byAsset = Object.fromEntries(HUB_ASSETS.map((a) => [a.id, a]));

    const gotmGame = byGame[snap.gameOfTheMonth] || HUB_GAMES[1];
    const aotm = byAsset[snap.assetOfTheMonth] || HUB_ASSETS[0];
    const gt = $("#gotm-title");
    const glabel = $("#gotm-label");
    if (isAssets) {
      if (glabel) glabel.textContent = "ASSET OF THE MONTH · frozen snapshot";
      if (gt) gt.textContent = "October 2026: " + aotm.name;
    } else {
      if (glabel) glabel.textContent = "GAME OF THE MONTH · frozen snapshot";
      if (gt) gt.textContent = "October 2026: " + gotmGame.title;
    }

    const upd = $("#chart-update-status");
    if (upd) upd.textContent = frozen ? "Frozen month — voting closed" : ("Updated daily · next update in " + hoursUntilChartUpdate() + "h");

    const locked = isVoteLocked();
    const status = dailyVoteStatusText();
    const statusEl = $("#chart-vote-status");
    if (statusEl) {
      statusEl.textContent = frozen ? "Voting closed for this snapshot" : status;
      statusEl.classList.toggle("used", locked && !frozen);
      statusEl.dataset.locked = locked ? "1" : "0";
    }
    const infoStatus = $("#chart-daily-status");
    if (infoStatus) infoStatus.textContent = status;

    let rows;
    if (isAssets) {
      if (frozen && snap.assetEntries) {
        rows = snap.assetEntries.map((e) => {
          const a = byAsset[e.assetId] || { id: e.assetId, name: e.assetId, maker: "—", yours: false };
          return { ...a, votes: e.votes, rank: e.rank, voteKey: a.id };
        });
      } else {
        rows = HUB_ASSETS.slice()
          .map((a) => ({ ...a, votes: countedVotes(a), voteKey: a.id }))
          .sort((a, b) => b.votes - a.votes)
          .map((a, i) => ({ ...a, rank: i + 1 }));
      }
    } else {
      if (frozen && snap.entries) {
        rows = snap.entries.map((e) => {
          const g = byGame[e.gameId] || { gameId: e.gameId, title: e.gameId, maker: "—", yours: false };
          return { ...g, votes: e.votes, rank: e.rank, voteKey: g.gameId };
        });
      } else {
        rows = HUB_GAMES.slice()
          .map((g) => ({ ...g, votes: countedVotes(g), voteKey: g.gameId }))
          .sort((a, b) => b.votes - a.votes)
          .map((g, i) => ({ ...g, rank: i + 1 }));
      }
    }

    // Top-10 runners-up carousel (ranks 2..11) — winner is the card above
    const runners = rows.filter((r) => r.rank >= 2 && r.rank <= 11);
    _carouselItems = runners.map((r) => ({
      rank: r.rank,
      title: r.title || r.name,
      name: r.name,
      maker: r.maker,
      votes: r.votes,
    }));
    if (chartCarouselIdx >= Math.max(1, _carouselItems.length)) chartCarouselIdx = 0;
    paintCarouselSlide();
    startChartCarousel(_carouselItems.length);
    const pauseBtn = $("#btn-chart-pause");
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-pressed", chartCarouselPaused ? "true" : "false");
      pauseBtn.textContent = chartCarouselPaused ? "Play" : "Pause";
    }

    // Rest of list: everything after the carousel window (rank >= 12), plus note ranks 2-11 are in carousel
    // Show full ranked list below but skip #1 (in winner card) — show from rank 2 with a hint, or only rank>=12?
    // Spec: "then the rest of the list" after carousel of top-10 runners-up → so list = ranks 12+
    const rest = rows.filter((r) => r.rank >= 12);
    // Also show ranks 2-11 compactly? Spec says carousel then rest — so rest = after top 10 runners = rank 12+.
    // For a short mock list, also include ranks 2+ in the list would duplicate. Follow spec: rest only.
    // If few items, show ranks 2+ in list when carousel covers them — still ok to list all except #1 for usability in mock.
    // Practical mock: list all except winner; carousel highlights runners. Avoid duplicate "Vote used" notes.
    const lead = rows.find((r) => r.rank === 1);
    const leadEl = $("#chart-leading");
    const leadTitle = $("#chart-leading-title");
    const leadVote = $("#chart-leading-vote");
    const leadCount = $("#chart-leading-votes");
    if (leadEl) {
      if (!lead || frozen) leadEl.hidden = true;
      else {
        leadEl.hidden = false;
        if (leadTitle) leadTitle.textContent = (lead.title || lead.name) + (lead.maker ? (" · " + lead.maker) : "");
        if (leadCount) leadCount.textContent = String(lead.votes);
        if (leadVote) {
          const vid = lead.voteKey;
          const voted = votedThisMonth(vid);
          const mine = !!lead.yours;
          const flagged = !!lead.flagged;
          const locked = isVoteLocked() && !voted;
          leadVote.setAttribute("data-vote", vid);
          leadVote.setAttribute("aria-pressed", voted ? "true" : "false");
          leadVote.disabled = !!(mine || flagged || locked);
          leadVote.classList.toggle("is-disabled", leadVote.disabled);
          let label = "Thumbs up (" + lead.votes + ")";
          if (mine) label = "Cannot vote for your own";
          else if (flagged) label = "Flagged — not counted yet";
          else if (voted) label = "Withdraw (" + lead.votes + ")";
          else if (locked) label = voteLockLabel();
          leadVote.setAttribute("aria-label", label);
        }
      }
    }
    const listRows = rows.filter((r) => r.rank >= 12);

    box.innerHTML = (listRows.length ? "" : '<p class="hint">No other entries this month.</p>') + listRows.map((g) => {
      const mine = !!g.yours;
      const vid = g.voteKey;
      const voted = votedThisMonth(vid);
      const flagged = !!g.flagged;
      const locked = isVoteLocked() && !voted;
      let label = "Thumbs up (" + g.votes + ")";
      let disabled = false;
      if (mine) { label = "Cannot vote for your own"; disabled = true; }
      else if (frozen) { disabled = true; label = "Frozen (" + g.votes + ")"; }
      else if (flagged) { label = "Flagged — not counted yet"; disabled = true; }
      else if (voted) { label = "Withdraw thumbs-up (" + g.votes + ")"; }
      else if (locked) { disabled = true; label = voteLockLabel(); }
      const title = g.title || g.name;
      return `<div class="chart-row">
        <span class="chart-rank">#${g.rank}</span>
        <div style="flex:1;min-width:0">
          <strong>${escapeHtml(title)}</strong>
          <div class="hint">${escapeHtml(g.maker || "")}${g.yours ? " · Yours" : ""}${g.flagged ? " · Flagged (not counted)" : ""}</div>
          ${mine ? '<div class="hint" style="color:var(--muted)">Cannot vote for your own</div>' : ""}
        </div>
        <button type="button" class="chart-vote" data-vote="${vid}" aria-pressed="${voted ? "true" : "false"}"
          ${disabled ? "disabled" : ""} aria-label="${escapeHtml(label)}">
          <span aria-hidden="true">👍</span><span class="vote-count">${g.votes}</span>
        </button>
      </div>`;
    }).join("");
    $$("[data-chart-month]").forEach((b) => b.setAttribute("aria-pressed", b.getAttribute("data-chart-month") === chartMonth ? "true" : "false"));
  }

  function openOutbound(game) {
    const link = (game.links && game.links[0]) || { url: game.url || "" };
    const href = link.url || game.url || "";
    outbound = { url: href, title: game.title, returnTo: "hub-library" };
    try {
      const u = new URL(href);
      const d = $("#outbound-domain");
      if (d) d.textContent = u.hostname;
    } catch (_) {
      const d = $("#outbound-domain");
      if (d) d.textContent = href;
    }
    const t = $("#outbound-title");
    if (t) t.textContent = game.title;
    const url = $("#outbound-url");
    if (url) url.textContent = href;
    if (window.__show) window.__show("outbound");
  }


  /* ---------- Bindings ---------- */
  function bind() {
    initTheme();
    if (window.SoundPanel) SoundPanel.attach(state());

    // Patch show — retry until app.js init assigns window.__show (async race)
    function patchShow() {
      const prevShow = window.__show;
      if (typeof prevShow !== "function") return false;
      if (prevShow.__uxPatched) return true;
      function wrapped(id) {
        prevShow(id);
        if (id === "profile") renderProfile();
        if (id === "game-settings") renderGameSettings();
        if (id === "hub-library") renderHubLibrary();
        if (id === "hub-shop") renderHubShop();
        if (id === "hub-chart") renderHubChart();
        if (id === "unit-editor") {
                    renderAbilitySounds("#unit-ability-sound-list");
        }
        if (id === "stage" || id === "project-settings") updateStageMusicReadonly();
        syncSheetChrome();
      }
      wrapped.__uxPatched = true;
      window.__show = wrapped;
      return true;
    }
    if (!patchShow()) {
      let tries = 0;
      const t = setInterval(() => {
        tries += 1;
        if (patchShow() || tries > 40) clearInterval(t);
      }, 50);
    }

    // Observe sheet changes
    const sheet = $("#stage-sheet");
    if (sheet) {
      const mo = new MutationObserver(syncSheetChrome);
      mo.observe(sheet, { attributes: true, attributeFilter: ["hidden", "data-mode"] });
    }

    $("#btn-sheet-undo")?.addEventListener("click", () => $("#btn-stage-undo")?.click());

    $("#ach-toast")?.addEventListener("click", () => {
      $("#ach-toast").classList.remove("show");
      if (window.__show) window.__show("profile");
      else location.hash = "profile";
    });

    // Appearance
    document.addEventListener("click", (e) => {
      const appBtn = e.target.closest("[data-appearance]");
      if (appBtn && window.ProfileStore) {
        const v = appBtn.getAttribute("data-appearance");
        const r = ProfileStore.setTheme(v);
        fireEvents(r.newly);
        renderProfile();
      }
      const av = e.target.closest("[data-avatar]");
      if (av && window.ProfileStore) {
        ProfileStore.setAvatar(av.getAttribute("data-avatar"));
        renderProfile();
      }
    });

    $("#profile-name")?.addEventListener("change", () => {
      if (window.ProfileStore) ProfileStore.setName($("#profile-name").value);
      renderProfile();
    });

    $("#preview-volume")?.addEventListener("input", () => {
      if (!window.ProfileStore) return;
      ProfileStore.setPreviewVolume($("#preview-volume").value);
      const val = $("#preview-volume-val");
      if (val) val.textContent = $("#preview-volume").value + "%";
    });

    // Sound open
    $("#btn-open-sound")?.addEventListener("click", () => openSoundSheet({}));
    $("#btn-unit-sounds")?.addEventListener("click", () => openSoundSheet({ pickerFor: "unit-override" }));
    $("#btn-change-stage-music")?.addEventListener("click", () => openSoundSheet({ assignEvent: "stage.music" }));
    $("#btn-settings-change-music")?.addEventListener("click", () => {
      if (window.__show) window.__show("stage");
      setTimeout(() => openSoundSheet({ assignEvent: "stage.music" }), 200);
    });

    $("#btn-sound-unlock")?.addEventListener("click", () => {
      SoundPanel.unlockFromGesture().then(() => renderSoundSheet());
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#sheet-sound")) return;
      // any tap in sound sheet unlocks
      if (window.SoundPanel && !SoundPanel.isUnlocked()) {
        SoundPanel.unlockFromGesture().then(() => renderSoundSheet());
      }
      const tab = e.target.closest("[data-sound-tab]");
      if (tab) { state().soundUi.tab = tab.getAttribute("data-sound-tab"); renderSoundSheet(); }
      const fil = e.target.closest("[data-sound-filter]");
      if (fil) { state().soundUi.filter = fil.getAttribute("data-sound-filter"); renderSoundSheet(); }
      const play = e.target.closest("[data-play]");
      if (play && play.getAttribute("data-play")) {
        const def = SoundPanel.getDef(play.getAttribute("data-play"));
        if (def) SoundPanel.ensurePlay(def, { asMusic: def.kind === "music" && state().soundUi.filter === "music" });
      }
      const row = e.target.closest(".sound-row[data-sound-id]");
      if (row && !e.target.closest("[data-play]")) {
        const id = row.getAttribute("data-sound-id");
        const st = state();
        SoundPanel.attach(st);
        if (st.soundUi.pickerFor === "ability-override" || (st.soundUi.awaitingOwnAssign && st.soundUi.abilityId)) {
          SoundPanel.upsertOwnBinding(st.soundUi.abilityEvent || "ability.cast", id, { ability: st.soundUi.abilityId });
          st.soundUi.awaitingOwnAssign = false;
          closeOwnSoundPicker();
        } else if (st.soundUi.pickerFor === "unit-override") {
          const unit = (st.units || []).find((u) => u.id === st.selectedUnitId) || (st.units || [])[0];
          if (unit) SoundPanel.upsertOwnBinding(st.soundUi.unitOverrideEvent || "ability.cast", id, { unit: unit.id });
        } else {
          SoundPanel.setEventDefault(st.soundUi.assignEvent, id);
        }
        updateStageMusicReadonly();
        renderSoundSheet();
        toast("Assigned");
      }
      const preset = e.target.closest("[data-preset]");
      if (preset) {
        const st = state();
        st.soundGen.recipe = preset.getAttribute("data-preset");
        st.soundGen.friendly = SoundPanel.defaultFriendly(st.soundGen.recipe);
        // keep locked
        Object.keys(st.soundGen.locks || {}).forEach((k) => {
          if (st.soundGen.locks[k]) {/* keep from previous - already in friendly if we merge */}
        });
        st.soundGen.params = SoundPanel.friendlyToParams(st.soundGen.friendly);
        renderSoundSheet();
        playGen();
      }
      const lock = e.target.closest("[data-lock]");
      if (lock) {
        const k = lock.getAttribute("data-lock");
        const st = state();
        st.soundGen.locks[k] = !st.soundGen.locks[k];
        renderSoundSheet();
      }
      const pe = e.target.closest("[data-pick-event]");
      if (pe) { state().soundUi.assignEvent = pe.getAttribute("data-pick-event"); state().soundUi.pickerFor = "assign"; renderSoundSheet(); }
      const ce = e.target.closest("[data-clear-event]");
      if (ce) {
        const st = state();
        SoundPanel.attach(st);
        SoundPanel.setEventDefault(ce.getAttribute("data-clear-event"), null);
        // null default → silent asset
        const silent = "snd_silent";
        if (!st.sounds.snd_silent) SoundPanel.attach(st);
        SoundPanel.setEventDefault(ce.getAttribute("data-clear-event"), silent);
        updateStageMusicReadonly();
        renderSoundSheet();
      }
      const uo = e.target.closest("[data-unit-ov]");
      if (uo) { state().soundUi.unitOverrideEvent = uo.getAttribute("data-unit-ov"); state().soundUi.pickerFor = "unit-override"; toast("Tap a sound to assign override"); }
      const ui = e.target.closest("[data-unit-inherit]");
      if (ui) {
        const st = state();
        SoundPanel.attach(st);
        const unit = (st.units || []).find((u) => u.id === st.selectedUnitId) || (st.units || [])[0];
        if (unit) SoundPanel.clearOwnBinding(ui.getAttribute("data-unit-inherit"), { unit: unit.id });
        renderSoundSheet();
      }
    });

    document.addEventListener("input", (e) => {
      const f = e.target.getAttribute && e.target.getAttribute("data-friendly");
      if (f) {
        const st = state();
        st.soundGen.friendly[f] = Number(e.target.value);
        st.soundGen.params = SoundPanel.friendlyToParams(st.soundGen.friendly);
        playGen();
      }
      const a = e.target.getAttribute && e.target.getAttribute("data-adv");
      if (a) {
        const st = state();
        st.soundGen.params[a] = Number(e.target.value);
        st.soundGen.friendly = SoundPanel.paramsToFriendly(st.soundGen.params);
        playGen();
      }
      const gk = e.target.getAttribute && e.target.getAttribute("data-gs-val");
      if (gk) {
        const gs = ensureGameSettings();
        gs.values[gk] = Number(e.target.value);
        stampGs(gk);
        scheduleGsWrite();
        livePreviewAudio(gk, gs.values[gk]);
        renderGsPreview();
        const lab = e.target.parentElement.querySelector(".val");
        if (lab) lab.textContent = gs.values[gk];
      }
    });

    $("#btn-sound-rand")?.addEventListener("click", () => {
      SoundPanel.randomise(state().soundGen, false);
      renderSoundSheet();
      playGen();
    });
    $("#btn-sound-rand-little")?.addEventListener("click", () => {
      SoundPanel.randomise(state().soundGen, true);
      renderSoundSheet();
      playGen();
    });
    $("#btn-sound-save")?.addEventListener("click", () => {
      const def = SoundPanel.saveGenerated();
      const st = state();
      st.soundUi.tab = "made";
      if (def && (st.soundUi.awaitingOwnAssign || st.soundUi.pickerFor === "ability-override") && st.soundUi.abilityId) {
        SoundPanel.upsertOwnBinding(st.soundUi.abilityEvent || "ability.cast", def.id, { ability: st.soundUi.abilityId });
        st.soundUi.awaitingOwnAssign = false;
        closeOwnSoundPicker();
      }
      renderSoundSheet();
      toast(def ? "Saved " + def.name : "Could not save");
    });
    $("#btn-sound-try")?.addEventListener("click", () => {
      const st = state();
      const unit = (st.units || []).find((u) => u.id === st.selectedUnitId) || (st.units || [])[0];
      SoundPanel.playTrySequence(unit, (ev) => {
        // pulse selected unit cell
        const u = unit;
        if (!u) return;
        const cell = document.querySelector(`#stage-grid .cell[data-x="${u.x}"][data-y="${u.y}"]`);
        if (cell) {
          cell.style.outline = "3px solid var(--accent)";
          setTimeout(() => { cell.style.outline = ""; }, 280);
        }
      });
    });
    $("#btn-sound-music-mute")?.addEventListener("click", () => {
      const st = state();
      st.soundUi.musicMute = !st.soundUi.musicMute;
      SoundPanel.setMusicMuted(st.soundUi.musicMute);
      renderSoundSheet();
    });

    // Game settings clicks
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#screen-game-settings")) return;
      const gs = ensureGameSettings();
      const inc = e.target.closest("[data-gs-include]");
      if (inc && !inc.disabled) {
        const c = gs.controls.find((x) => x.key === inc.getAttribute("data-gs-include"));
        if (c) c.include = !(c.include !== false);
        scheduleGsWrite();
        renderGameSettings();
      }
      const hid = e.target.closest("[data-gs-hide]");
      if (hid) {
        const c = gs.controls.find((x) => x.key === hid.getAttribute("data-gs-hide"));
        if (c) c.hidden = !c.hidden;
        scheduleGsWrite();
        renderGameSettings();
      }
      const pick = e.target.closest("[data-gs-pick]");
      if (pick) {
        const key = pick.getAttribute("data-gs-pick");
        let val = pick.getAttribute("data-val");
        if (val === "true") val = true;
        else if (val === "false") val = false;
        else if (!Number.isNaN(Number(val)) && String(Number(val)) === val) val = Number(val);
        gs.values[key] = val;
        stampGs(key);
        scheduleGsWrite();
        livePreviewAudio(key, val);
        renderGameSettings();
      }
      const show = e.target.closest("[data-gs-showin]");
      if (show) {
        const c = gs.controls.find((x) => x.key === show.getAttribute("data-gs-showin"));
        if (c) c.showIn = show.getAttribute("data-val");
        scheduleGsWrite();
        renderGameSettings();
      }
      if (e.target.id === "btn-gs-reset" || e.target.closest("#btn-gs-reset")) {
        const tpl = ProfileStore.BTF_TEMPLATE;
        // r2 §3.5.1: Reset writes stamped null (use effective default), not a delete
        tpl.groups.forEach((g) => g.settings.forEach((s) => {
          gs.values[s.key] = null;
          stampGs(s.key);
          const c = gs.controls.find((x) => x.key === s.key);
          if (c) {
            c.default = s.default;
            c.include = s.core ? true : (s.includeDefault === false ? false : true);
            c.hidden = false;
            c.showIn = s.showIn || "both";
          }
        }));
        scheduleGsWrite();
        renderGameSettings();
        toast("Defaults restored");
      }
    });

    // Achievement hooks — wrap common actions
    document.addEventListener("click", (e) => {
      if (e.target.closest("#btn-create")) {
        setTimeout(() => {
          record("wizardCompleted", 1);
          record("stageCreated", 1);
        }, 500);
      }
      if (e.target.closest("#btn-export-project")) {
        record("projectExported", 1);
        record("exportCompleted", 1);
      }
      if (e.target.closest("#btn-stage-play") || e.target.closest("#btn-loadout-play")) {
        setTimeout(() => record("previewStarted", 1), 100);
      }
      if (e.target.closest('[data-nav="render"]') || e.target.closest("#btn-render-android") || e.target.closest("#btn-render-ios") || e.target.closest("#btn-render-pc")) {
        record("buildStarted", 1);
      }
      if (e.target.closest('[data-nav="stage-map"]')) {
        record("legendOpened", 1);
      }
    }, true);


    $("#btn-how-earn")?.addEventListener("click", () => { if (window.__show) window.__show("how-earn"); });
    $("#btn-reset-achievements")?.addEventListener("click", () => {
      const wipe = !!$("#reset-wipe-synced")?.checked;
      const note = $("#reset-synced-note");
      if (note) note.hidden = !wipe;
      const copy = $("#reset-confirm-copy");
      if (copy) copy.textContent = wipe
        ? "Reset local achievements AND wipe the synced studio profile? This cannot be undone on the account. Gold coins are never reset."
        : "Start a new local studio profile? Your current one is kept as a backup on this device. Gold coins are never reset.";
      if (window.__show) window.__show("reset-confirm");
    });
    $("#btn-reset-confirm")?.addEventListener("click", () => {
      const wipe = !!$("#reset-wipe-synced")?.checked;
      ProfileStore.resetLocal(wipe);
      ProfileStore.applyTheme(ProfileStore.load().prefs.theme || "system");
      toast(wipe ? "Local reset + synced wipe requested (mock)" : "Local achievements reset");
      if (window.__show) window.__show("profile");
      renderProfile();
    });
    $("#btn-chart-info")?.addEventListener("click", () => { if (window.__show) window.__show("chart-info"); });
    // Carousel swipe
    (function () {
      const el = $("#chart-runners");
      if (!el) return;
      let x0 = null;
      el.addEventListener("touchstart", (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", (e) => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0;
        x0 = null;
        if (Math.abs(dx) < 40 || !_carouselItems.length) return;
        chartCarouselIdx = (chartCarouselIdx + (dx < 0 ? 1 : _carouselItems.length - 1)) % _carouselItems.length;
        paintCarouselSlide();
        startChartCarousel(_carouselItems.length);
      }, { passive: true });
    })();
    $("#btn-shop-submit")?.addEventListener("click", () => {
      toast("Submit yours — proposed. Review before listing.");
    });
    $("#btn-outbound-cancel")?.addEventListener("click", () => { if (window.__show) window.__show(outbound.returnTo || "hub-library"); });
    $("#btn-outbound-open")?.addEventListener("click", () => {
      toast("Would open " + (outbound.url || ""));
      if (window.__show) window.__show(outbound.returnTo || "hub-library");
    });

    // Own sound + upload
    document.addEventListener("click", (e) => {
      const ownToggle = e.target.closest("[data-ability-own]");
      if (ownToggle) {
        const st = state();
        SoundPanel.attach(st);
        const id = ownToggle.getAttribute("data-ability-own");
        if (SoundPanel.abilityHasOwnSound(id)) {
          SoundPanel.clearAllAbilityOwn(id);
        } else {
          // turn on with shared defaults written as ability-scoped bindings
          const cast = SoundPanel.resolveSoundId("ability.cast", {});
          const hit = SoundPanel.resolveSoundId("ability.hit", {});
          if (cast) SoundPanel.upsertOwnBinding("ability.cast", cast, { ability: id });
          if (hit) SoundPanel.upsertOwnBinding("ability.hit", hit, { ability: id });
        }
        renderAbilitySounds("#sound-ability-list");
        renderAbilitySounds("#unit-ability-sound-list");
        return;
      }
      const pick = e.target.closest("[data-ability-pick]");
      if (pick) {
        openOwnSoundPicker({
          abilityId: pick.getAttribute("data-ability-pick"),
          eventId: pick.getAttribute("data-ev") || "ability.cast",
          pickerFor: "ability-override",
        });
        return;
      }
      const src = e.target.closest("[data-own-source]");
      if (src) {
        const mode = src.getAttribute("data-own-source");
        const st = state();
        if (mode === "make") {
          // scroll to Make a sound
          const head = document.querySelector('#sheet-sound .sound-subhead');
          const body = $("#stage-sheet-body");
          const nodes = [...document.querySelectorAll("#sheet-sound .sound-subhead")];
          const makeHead = nodes.find((n) => n.textContent.includes("Make a sound"));
          if (body && makeHead) {
            const br = body.getBoundingClientRect();
            const hr = makeHead.getBoundingClientRect();
            body.scrollTop += (hr.top - br.top) - 8;
          }
          toast("Tweak sliders, then Save as project sound — it assigns to this Own sound");
          st.soundUi.awaitingOwnAssign = true;
        } else if (mode === "upload") {
          const zone = $("#sound-upload-zone");
          const body = $("#stage-sheet-body");
          if (body && zone) {
            const br = body.getBoundingClientRect();
            const zr = zone.getBoundingClientRect();
            body.scrollTop += (zr.top - br.top) - 8;
          }
          $("#sound-file")?.click();
          st.soundUi.awaitingOwnAssign = true;
        } else if (mode === "builtin") {
          st.soundUi.tab = "library";
          st.soundUi.awaitingOwnAssign = true;
          renderSoundSheet();
          toast("Tap a Built-in sound, then it assigns to this Own sound");
          const list = $("#sound-list");
          const body = $("#stage-sheet-body");
          if (body && list) {
            const br = body.getBoundingClientRect();
            const lr = list.getBoundingClientRect();
            body.scrollTop += (lr.top - br.top) - 8;
          }
        }
        return;
      }
      if (e.target.closest("#btn-own-sound-shared")) {
        const st = state();
        SoundPanel.attach(st);
        if (st.soundUi.abilityId) {
          SoundPanel.clearAllAbilityOwn(st.soundUi.abilityId);
          toast("Using shared sound");
        }
        closeOwnSoundPicker();
        renderAbilitySounds("#sound-ability-list");
        renderAbilitySounds("#unit-ability-sound-list");
        return;
      }
      if (e.target.closest("#btn-sound-upload-save") && pendingUpload) {
        const st = state();
        if (!window.SoundPanel) return;
        SoundPanel.attach(st);
        const id = "snd_up_" + Date.now().toString(36);
        const def = {
          id,
          name: pendingUpload.name.slice(0, 40),
          kind: pendingUpload.kind || "sfx",
          origin: { kind: "upload", mime: pendingUpload.mime || "audio/wav", bytes: pendingUpload.bytes, durationMs: pendingUpload.durationMs },
          credit: { license: "own", author: "maker" },
          tag: "Uploaded",
          bytes: pendingUpload.bytes,
          durationMs: pendingUpload.durationMs,
          streamed: !!(pendingUpload.kind === "music" || (pendingUpload.durationMs || 0) > 180000),
        };
        st.sounds[id] = def;
        if (st.soundUi && st.soundUi.awaitingOwnAssign && st.soundUi.abilityId) {
          SoundPanel.upsertOwnBinding(st.soundUi.abilityEvent || "ability.cast", id, { ability: st.soundUi.abilityId });
          st.soundUi.awaitingOwnAssign = false;
          closeOwnSoundPicker();
        }
        pendingUpload = null;
        const stEl = $("#sound-upload-status");
        if (stEl) { stEl.hidden = true; stEl.textContent = ""; }
        const saveBtn = $("#btn-sound-upload-save");
        if (saveBtn) { saveBtn.hidden = true; saveBtn.disabled = true; }
        st.soundUi.tab = "made";
        renderSoundSheet();
        toast("Saved upload");
        return;
      }
    });

    $("#sound-file")?.addEventListener("change", (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const name = f.name || "upload.wav";
      const bytes = f.size || 0;
      const lower = name.toLowerCase();
      const kind = (lower.includes("bed") || lower.includes("music") || lower.includes("loop") || bytes > 500000) ? "music" : "sfx";
      // mock duration from size (~176KB/s mono 44.1k roughly) — placeholder
      const durationMs = Math.round((bytes / 176000) * 1000);
      pendingUpload = { name, bytes, durationMs, kind, mime: f.type || "audio/wav" };
      const stEl = $("#sound-upload-status");
      const warnParts = [];
      if (kind === "sfx" && (durationMs > 3000 || bytes > 300000)) warnParts.push("SFX over 3 s or 300 KB — consider mono. Warn only.");
      if (kind === "music" && durationMs > 180000) warnParts.push("Long track — will be marked Streamed. Warn only.");
      if (stEl) {
        stEl.hidden = false;
        stEl.innerHTML = "<strong>" + name.replace(/</g,"") + "</strong> · " + Math.round(bytes/1024) + " KB · ~" + (durationMs/1000).toFixed(1) + "s"
          + (warnParts.length ? '<br><span style="color:var(--warn)">' + warnParts.join(" ") + "</span>" : "");
      }
      const saveBtn = $("#btn-sound-upload-save");
      if (saveBtn) { saveBtn.hidden = false; saveBtn.disabled = false; }
      const st = state();
      if (st.soundUi) st.soundUi.awaitingOwnAssign = !!st.soundUi.ownPickerOpen;
    });

    document.addEventListener("click", (e) => {
      const g = e.target.closest("[data-open-game]");
      if (g) {
        const game = HUB_GAMES.find((x) => x.gameId === g.getAttribute("data-open-game") || x.id === g.getAttribute("data-open-game"));
        if (game) openOutbound(game);
      }
      const buy = e.target.closest("[data-buy-pack]");
      if (buy && !buy.disabled) {
        const pack = HUB_PACKS.find((x) => x.id === buy.getAttribute("data-buy-pack"));
        if (pack) {
          const r = ProfileStore.spendCoins(pack.cost, pack.id);
          toast(r.ok ? "Owned " + pack.name : "Not enough coins");
          renderHubShop();
          renderProfile();
        }
      }
      const vote = e.target.closest("[data-vote]");
      if (vote && !vote.disabled) {
        const id = vote.getAttribute("data-vote");
        const game = HUB_GAMES.find((x) => x.gameId === id);
        const asset = HUB_ASSETS.find((x) => x.id === id);
        const target = game || asset;
        if (!target || target.yours) return;
        if (target.flagged) { toast("Flagged — not counted until approved"); return; }
        const r = applyVote(target);
        if (!r.ok) {
          if (r.reason === "voteRateLimited") toast(dailyVoteStatusText());
          else if (r.reason === "voteNeedsAccount") toast("Sign in to vote");
          else if (r.reason === "voteAccountTooNew") toast("Account too new to vote");
          return;
        }
        renderHubChart();
      }
      const cm = e.target.closest("[data-chart-month]");
      if (cm) { chartMonth = cm.getAttribute("data-chart-month"); renderHubChart(); }
      const cs = e.target.closest("[data-chart-section]");
      if (cs) { chartSection = cs.getAttribute("data-chart-section"); chartCarouselIdx = 0; renderHubChart(); }
      const shopT = e.target.closest("[data-shop-tab]");
      if (shopT) { shopTab = shopT.getAttribute("data-shop-tab"); renderHubShop(); }
      const dot = e.target.closest("[data-carousel-dot]");
      if (dot) {
        chartCarouselIdx = Number(dot.getAttribute("data-carousel-dot")) || 0;
        paintCarouselSlide();
        startChartCarousel(_carouselItems.length);
      }
      if (e.target.closest("#btn-chart-pause")) {
        chartCarouselPaused = !chartCarouselPaused;
        if (chartCarouselPaused) stopChartCarousel();
        else startChartCarousel(_carouselItems.length);
        const pauseBtn = $("#btn-chart-pause");
        if (pauseBtn) {
          pauseBtn.setAttribute("aria-pressed", chartCarouselPaused ? "true" : "false");
          pauseBtn.textContent = chartCarouselPaused ? "Play" : "Pause";
        }
      }
      if (e.target.closest("#btn-chart-prev") && _carouselItems.length) {
        chartCarouselIdx = (chartCarouselIdx + _carouselItems.length - 1) % _carouselItems.length;
        paintCarouselSlide();
        startChartCarousel(_carouselItems.length);
      }
      if (e.target.closest("#btn-chart-next") && _carouselItems.length) {
        chartCarouselIdx = (chartCarouselIdx + 1) % _carouselItems.length;
        paintCarouselSlide();
        startChartCarousel(_carouselItems.length);
      }
    });

    // Hash route additions
    const known = ["profile", "game-settings", "hub-library", "hub-shop", "hub-chart", "how-earn", "outbound", "chart-info", "reset-confirm"];
    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#/, "");
      if (known.includes(id) && window.__show) window.__show(id);
    });

    // If landing on profile
    const boot = location.hash.replace(/^#/, "");
    if (boot === "profile") renderProfile();
    if (boot === "game-settings") renderGameSettings();

    syncSheetChrome();
    updateStageMusicReadonly();

    const vpNow = $("#btn-vote-prompt-now");
    const vpLater = $("#btn-vote-prompt-later");
    const vpNever = $("#btn-vote-prompt-never");
    const vpDismiss = $("#btn-vote-prompt-dismiss");
    if (vpNow) vpNow.addEventListener("click", onVotePromptNow);
    if (vpLater) vpLater.addEventListener("click", onVotePromptLater);
    if (vpNever) vpNever.addEventListener("click", onVotePromptNever);
    if (vpDismiss) vpDismiss.addEventListener("click", onVotePromptLater);
    setInterval(tickUsage, 5000);
    setInterval(() => {
      const statusEl = $("#chart-vote-status");
      const screen = $("#screen-hub-chart");
      if (!statusEl || !screen || !screen.classList.contains("active")) return;
      const frozen = chartMonth !== "live";
      if (frozen) return;
      const wasLocked = statusEl.dataset.locked === "1";
      const locked = isVoteLocked();
      statusEl.textContent = dailyVoteStatusText();
      statusEl.classList.toggle("used", locked);
      if (wasLocked && !locked) renderHubChart();
      else statusEl.dataset.locked = locked ? "1" : "0";
    }, 15000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(bind, 0));
  else setTimeout(bind, 0);

  window.__uxFeatures = {
    openSoundSheet, openOwnSoundPicker, renderProfile, renderGameSettings, record, syncSheetChrome,
    renderHubLibrary, renderHubShop, renderHubChart, renderAbilitySounds, showAchToast,
    VOTES_PER_HOUR, VOTES_PER_DAY,
    _setVoteStateForCapture: setVoteStateForCapture,
    _setDailyVoteForCapture: (gameId) => {
      if (!gameId) { setVoteStateForCapture({ usedToday: 0 }); return; }
      setVoteStateForCapture({ usedToday: 0, retryInMs: 59 * 60 * 1000 });
      const now = Date.now();
      voteState.sends = [{ id: gameId, at: now - 1000 }];
      monthVotes[gameId] = { month: utcMonthKey(), kind: "game" };
      voteState.retryAt = now + 59 * 60 * 1000;
      saveVoteStore();
    },
    _setChartSection: (s) => { chartSection = s; },
    _showVotePromptForCapture: showVotePromptForCapture,
    _showVoteThanksForCapture: showVoteThanks,
    _hideVotePromptForCapture: () => { hideVotePrompt(); hideVoteThanks(); },
  };
})();
