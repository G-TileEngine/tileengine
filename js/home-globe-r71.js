/* r71 Home globe carousel (ux/home-globe-plan.md, Q1–Q6 ACCEPTED).
   Offline-first. No new deps. Existing Home actions are unchanged. */
(function (global) {
  "use strict";

  const ITEMS = [
    { id: "standalone", label: "Standalone engine", caption: "Start the New Project wizard", selector: "#screen-home #btn-standalone",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 4v16M14 4v16M4 10h16M4 14h16"/></svg>' },
    { id: "stage", label: "Open blank stage", caption: "Skip to the stage editor", selector: '#screen-home [data-nav="stage"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/></svg>' },
    { id: "profile", label: "Studio profile", caption: "Your name, badges and setup", selector: '#screen-home [data-nav="profile"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.2-3 3.5-4.5 7-4.5S17.8 16 19 19"/></svg>' },
    { id: "library", label: "Made games", caption: "Games you have published", selector: '#screen-home [data-nav="hub-library"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h0M12 9h4"/></svg>' },
    { id: "chart", label: "Thumbs-up chart", caption: "This month's most liked", selector: '#screen-home [data-nav="hub-chart"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 11v8H4v-8h3zm3 8h7.2a2 2 0 0 0 2-1.7l1-6.3A1.5 1.5 0 0 0 18.7 9H13V5.5A1.5 1.5 0 0 0 11.5 4h-.3L10 11v8z"/></svg>' },
    { id: "shop", label: "Asset shop", caption: "Tiles, packs and more", selector: '#screen-home [data-nav="hub-shop"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M8 8V7a4 4 0 0 1 8 0v1"/></svg>' },
    { id: "settings", label: "Project settings", caption: "Combat, map and defaults", selector: '#screen-home [data-nav="project-settings"]',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.7 1 1.1 1.6 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>' },
    { id: "export", label: "Export project", caption: "Save the project as JSON", selector: "#screen-home #btn-export-project",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>' }
  ];
  const N = ITEMS.length;
  const LOOP = true;
  const PREFS_KEY = (global.ProfileStore && ProfileStore.PREFS_KEY) || "tileengine.editor-prefs.v1";

  let pos = 0, vel = 0, dragging = false, claim = null;
  let startX = 0, startY = 0, lastX = 0, lastT = 0, samples = [];
  let raf = 0, frozen = false, flicked = false, snapDest = null;
  let lastAnnounced = -1, moving = false, hintTimer = 0, wheelTimer = 0;
  let viewPref = "globe", motionForced = false, showingList = false;
  let inited = false;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const home = () => document.getElementById("screen-home");

  function loadRawPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveRawPrefs(patch) {
    const o = Object.assign(loadRawPrefs(), patch);
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
    return o;
  }
  function readHomePrefs() {
    const o = loadRawPrefs();
    return {
      view: o.homeView === "list" ? "list" : "globe",
      last: typeof o.homeLast === "string" ? o.homeLast : null,
      hintSeen: !!o.homeHintSeen,
    };
  }

  function cssPx(name, fallback) {
    const host = home();
    const v = host ? getComputedStyle(host).getPropertyValue(name).trim() : "";
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function radius() { return cssPx("--globe-r", 230); }
  function dragPx() { return cssPx("--drag-px", 108); }

  function wrapDelta(delta) {
    if (!LOOP) return delta;
    return ((delta % N) + N + N / 2) % N - N / 2;
  }
  function wrapPos(p) {
    if (!LOOP) return Math.max(0, Math.min(N - 1, p));
    return ((p % N) + N) % N;
  }
  function nearest(p) {
    if (!LOOP) return Math.max(0, Math.min(N - 1, Math.round(p)));
    return Math.round(p);
  }
  function frontIndex() { return ((Math.round(wrapPos(pos)) % N) + N) % N; }
  function indexOfId(id) {
    const i = ITEMS.findIndex((it) => it.id === id);
    return i >= 0 ? i : 0;
  }

  function motionNow() {
    return !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function applyLayout() {
    const screen = home();
    if (!screen) return;
    motionForced = motionNow();
    showingList = motionForced || viewPref === "list";
    screen.classList.toggle("is-list", showingList);
    screen.classList.toggle("is-reduced", motionForced);
    const g = $("#btn-home-view-globe");
    const l = $("#btn-home-view-list");
    const note = $("#home-view-note");
    if (g) {
      g.setAttribute("aria-pressed", showingList ? "false" : "true");
      if (motionForced) g.setAttribute("aria-disabled", "true");
      else g.removeAttribute("aria-disabled");
    }
    if (l) l.setAttribute("aria-pressed", showingList ? "true" : "false");
    if (note) note.hidden = !motionForced;
    const hint = $("#globe-hint");
    if (showingList && hint) hint.classList.remove("show");
    if (showingList && raf) { cancelAnimationFrame(raf); raf = 0; }
    paintListPrimary();
    if (!showingList) render();
  }

  function setView(which, persist) {
    if (motionForced && which === "globe") { applyLayout(); return; }
    viewPref = which === "list" ? "list" : "globe";
    if (persist !== false) saveRawPrefs({ homeView: viewPref });
    applyLayout();
  }

  function paintListPrimary() {
    const last = readHomePrefs().last;
    const idx = last ? indexOfId(last) : 0;
    const use = last && ITEMS.some((it) => it.id === last) ? idx : 0;
    ITEMS.forEach((it, i) => {
      const btn = $(it.selector);
      if (!btn) return;
      btn.classList.toggle("btn-primary", i === use);
      btn.classList.toggle("btn-ghost", i !== use);
    });
  }

  function build() {
    const ring = $("#globe-ring");
    const nav = $("#globe-nav");
    if (!ring || !nav) return;
    ring.innerHTML = "";
    nav.innerHTML = "";
    ITEMS.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "globe-item";
      btn.id = "opt-" + item.id;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-label", item.label);
      btn.dataset.index = String(i);
      btn.innerHTML = item.icon + "<span>" + item.label + "</span>";
      btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); onItemTap(i); });
      ring.appendChild(btn);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "globe-dot";
      dot.dataset.index = String(i);
      dot.setAttribute("aria-label", item.label + ", " + (i + 1) + " of " + N);
      dot.innerHTML = "<i></i>";
      dot.addEventListener("click", () => jumpTo(i));
      nav.appendChild(dot);
    });
  }

  function render() {
    const ring = $("#globe-ring");
    const stage = $("#globe-stage");
    const caption = $("#globe-caption");
    const nav = $("#globe-nav");
    if (!ring || !stage) return;
    const R = radius();
    const step = 360 / N;
    const nodes = ring.children;
    const front = frontIndex();
    for (let i = 0; i < N; i++) {
      const el = nodes[i];
      if (!el) continue;
      const delta = wrapDelta(i - pos);
      const angleDeg = delta * step;
      const angleRad = angleDeg * Math.PI / 180;
      const c = Math.cos(angleRad);
      const frontness = 0.5 + 0.5 * c;
      const scale = 0.55 + 0.45 * frontness;
      const cutoff = Math.cos(70 * Math.PI / 180);
      const opacity = Math.max(0, Math.min(1, (c - cutoff) / (1 - cutoff)));
      el.style.transform = "rotateY(" + angleDeg + "deg) translateZ(" + R + "px) scale(" + scale + ")";
      el.style.opacity = String(opacity);
      el.style.filter = "none";
      el.style.zIndex = "auto";
      el.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = opacity > 0.25 ? "auto" : "none";
      el.setAttribute("aria-hidden", opacity <= 0.01 ? "true" : "false");
      const isFront = Math.abs(delta) < 0.5;
      el.classList.toggle("is-front", isFront);
      el.setAttribute("aria-selected", isFront ? "true" : "false");
      el.tabIndex = -1;
    }
    if (caption) caption.textContent = ITEMS[front].caption;
    stage.setAttribute("aria-activedescendant", "opt-" + ITEMS[front].id);
    if (nav) {
      [...nav.children].forEach((d, i) => {
        if (i === front) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    }
    if (moving) {
      ring.style.willChange = "transform";
      for (const el of nodes) el.style.willChange = "transform, opacity";
    } else {
      ring.style.willChange = "auto";
      for (const el of nodes) el.style.willChange = "auto";
    }
  }

  function announce() {
    const live = $("#globe-live");
    const i = frontIndex();
    if (i === lastAnnounced) return;
    lastAnnounced = i;
    if (live) live.textContent = ITEMS[i].label + ", " + (i + 1) + " of " + N;
  }

  function haptic() {
    if (showingList || motionNow()) return;
    try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) { /* ignore */ }
  }

  function tick() {
    raf = 0;
    if (frozen || dragging || showingList) { render(); return; }
    const target = snapDest == null ? nearest(pos) : snapDest;
    const dist = target - pos;
    if (snapDest == null && Math.abs(vel) > 0.012) {
      pos += vel;
      vel *= 0.92;
      if (!LOOP) {
        if (pos < 0) { pos = 0; vel = 0; }
        if (pos > N - 1) { pos = N - 1; vel = 0; }
      }
      if (Math.abs(vel) <= 0.012) vel = 0;
      moving = true;
      render();
      raf = requestAnimationFrame(tick);
      return;
    }
    if (Math.abs(dist) > 0.001) {
      vel += dist * 0.18;
      vel *= 0.75;
      pos += vel;
      moving = true;
      render();
      raf = requestAnimationFrame(tick);
      return;
    }
    pos = LOOP ? wrapPos(target) : target;
    vel = 0;
    snapDest = null;
    moving = false;
    render();
    announce();
  }
  function kick() {
    if (frozen || raf || showingList) return;
    raf = requestAnimationFrame(tick);
  }

  function dismissHint() {
    const hint = $("#globe-hint");
    if (hint) hint.classList.remove("show");
    saveRawPrefs({ homeHintSeen: true });
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = 0; }
  }
  function showHintIfNeeded() {
    const hint = $("#globe-hint");
    if (!hint || showingList) return;
    if (readHomePrefs().hintSeen) { hint.classList.remove("show"); return; }
    hint.classList.add("show");
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(dismissHint, 6000);
  }

  function jumpTo(i, instant) {
    dismissHint();
    if (showingList) return;
    const cur = pos;
    let dest = i;
    if (LOOP) dest = cur + wrapDelta(i - wrapPos(cur));
    else dest = Math.max(0, Math.min(N - 1, i));
    if (instant) {
      pos = dest;
      vel = 0;
      snapDest = null;
      render();
      announce();
      return;
    }
    vel = 0;
    snapDest = dest;
    haptic();
    kick();
  }
  function step(dir) {
    const i = frontIndex();
    let next = i + dir;
    if (LOOP) next = (next + N) % N;
    else next = Math.max(0, Math.min(N - 1, next));
    jumpTo(next);
  }
  function setIndex(i) {
    const idx = Math.max(0, Math.min(N - 1, i | 0));
    pos = idx;
    vel = 0;
    frozen = false;
    render();
    announce();
  }

  function onItemTap(i) {
    if (flicked || claim === "x") return;
    if (i === frontIndex()) openItem(i);
    else jumpTo(i);
  }

  function openItem(i) {
    dismissHint();
    const item = ITEMS[i];
    if (!item) return;
    saveRawPrefs({ homeLast: item.id });
    paintListPrimary();
    const btn = $(item.selector);
    if (btn) btn.click();
  }

  function pointerDown(e) {
    if (showingList || frozen) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    claim = null;
    dragging = false;
    flicked = false;
    startX = lastX = e.clientX;
    startY = e.clientY;
    lastT = performance.now();
    samples = [{ x: e.clientX, t: lastT }];
    vel = 0;
    const stage = $("#globe-stage");
    try { if (stage) stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  function pointerMove(e) {
    if (showingList || frozen) return;
    if (claim === "y") return;
    const x = e.clientX, y = e.clientY;
    const dx = x - startX, dy = y - startY;
    if (!claim) {
      if (Math.hypot(dx, dy) < 8) return;
      claim = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (claim === "y") return;
      dragging = true;
      moving = true;
      dismissHint();
    }
    if (claim !== "x") return;
    e.preventDefault();
    const now = performance.now();
    pos -= (x - lastX) / dragPx();
    if (!LOOP) pos = Math.max(-0.12, Math.min(N - 1 + 0.12, pos));
    lastX = x;
    lastT = now;
    samples.push({ x, t: now });
    if (samples.length > 8) samples.shift();
    render();
  }
  function pointerUp(e) {
    const stage = $("#globe-stage");
    if (claim === "x") {
      flicked = true;
      const now = performance.now();
      const recent = samples.filter((s) => s.t >= now - 80);
      if (recent.length >= 2) {
        const a = recent[0], b = recent[recent.length - 1];
        const dt = Math.max(16, b.t - a.t);
        vel = -((b.x - a.x) / dt) * (16.67 / dragPx()) * 12;
        vel = Math.max(-0.85, Math.min(0.85, vel));
      } else vel = 0;
      dragging = false;
      claim = null;
      snapDest = null;
      haptic();
      kick();
      setTimeout(function () { flicked = false; }, 0);
    } else {
      dragging = false;
      claim = null;
    }
    try { if (stage) stage.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  function onWheel(e) {
    if (showingList || frozen) return;
    const dx = e.deltaX, dy = e.deltaY;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
    e.preventDefault();
    dismissHint();
    pos += delta / 80;
    if (!LOOP) pos = Math.max(0, Math.min(N - 1, pos));
    moving = true;
    render();
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { vel = 0; kick(); }, 80);
  }
  function onKey(e) {
    if (showingList) return;
    const keys = { ArrowLeft: -1, ArrowRight: 1 };
    if (e.key in keys) { e.preventDefault(); step(keys[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); jumpTo(0); }
    else if (e.key === "End") { e.preventDefault(); jumpTo(N - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItem(frontIndex()); }
  }

  function bindListOpens() {
    ITEMS.forEach((it) => {
      const btn = $(it.selector);
      if (!btn || btn.dataset.globeBound) return;
      btn.dataset.globeBound = "1";
      btn.addEventListener("click", () => {
        saveRawPrefs({ homeLast: it.id });
        paintListPrimary();
      });
    });
  }

  function syncFrontFromPrefs() {
    const last = readHomePrefs().last;
    const idx = last && ITEMS.some((it) => it.id === last) ? indexOfId(last) : 0;
    pos = idx;
    vel = 0;
    render();
    announce();
  }

  function init() {
    if (inited) return;
    const screen = home();
    const stage = $("#globe-stage");
    if (!screen || !stage) return;
    inited = true;
    viewPref = readHomePrefs().view;
    build();
    bindListOpens();
    syncFrontFromPrefs();
    applyLayout();
    showHintIfNeeded();

    $("#btn-home-view-globe")?.addEventListener("click", () => {
      if ($("#btn-home-view-globe").getAttribute("aria-disabled") === "true") return;
      setView("globe");
    });
    $("#btn-home-view-list")?.addEventListener("click", () => setView("list"));
    $("#btn-home-prev")?.addEventListener("click", () => step(-1));
    $("#btn-home-next")?.addEventListener("click", () => step(1));

    stage.addEventListener("pointerdown", pointerDown);
    stage.addEventListener("pointermove", pointerMove);
    stage.addEventListener("pointerup", pointerUp);
    stage.addEventListener("pointercancel", pointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("keydown", onKey);
    window.addEventListener("resize", () => { if (!showingList) render(); });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => applyLayout();
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  function onShow(id) {
    if (id !== "home") return;
    if (!inited) init();
    viewPref = readHomePrefs().view;
    syncFrontFromPrefs();
    applyLayout();
    showHintIfNeeded();
  }

  global.TileEngineGlobe = {
    onShow,
    init,
    setView,
    setIndex,
    open(id) {
      const i = indexOfId(id);
      setIndex(i);
      openItem(i);
    },
    jumpTo,
    step,
    applyLayout,
    getState() {
      return {
        pos, vel, showingList, viewPref, motionForced,
        front: ITEMS[frontIndex()].id,
        index: frontIndex(),
      };
    },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : globalThis);
