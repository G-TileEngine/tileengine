/* Sprite Studio — round 62 clickable prototype (UX half of ux/pixel-editor-plan.md).
   MOCK: in-memory only, no real recipe format. Internally every stroke is a "pixelRun" of palette
   slots (no raw RGB); the UI only ever says "pixels". Outline + shade are render rules, never baked. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- default style palette: 5 hue-shifted ramps × 3 = 15 of 16 slots (slot 0 = clear) ---------- */
  const RAMPS = [
    { name: "Skin", c: ["#8a4b4c", "#d08a62", "#f6c99a"], line: "#4a2230" },
    { name: "Hair", c: ["#3b2140", "#6b3a3a", "#a8684a"], line: "#1e1024" },
    { name: "Tunic", c: ["#5a1f3d", "#a8323e", "#e8704e"], line: "#2e0f24" },
    { name: "Cloth", c: ["#22305e", "#3d5fa8", "#78aee0"], line: "#121a38" },
    { name: "Leather", c: ["#3a2a3a", "#6e4a35", "#b0824e"], line: "#1f1418" },
  ];
  const SLOT = (r, t) => r * 3 + t + 1; // t: 0 shadow, 1 base, 2 light
  const slotColour = (s) => (s ? RAMPS[Math.floor((s - 1) / 3)].c[(s - 1) % 3] : null);
  const slotRamp = (s) => Math.floor((s - 1) / 3);

  const KINDS = [
    { id: "hero", name: "Hero", sub: "Starter body to draw over", w: 32, h: 32, tpl: "hero" },
    { id: "enemy", name: "Enemy", sub: "Blob shape guide", w: 32, h: 32, tpl: "enemy" },
    { id: "item", name: "Item", sub: "Small pickup", w: 16, h: 16, tpl: "item" },
    { id: "tile", name: "Tile", sub: "Matches your tile size", w: 32, h: 32, tpl: null },
    { id: "effect", name: "Effect", sub: "Burst guide", w: 32, h: 32, tpl: "effect" },
    { id: "blank", name: "Blank", sub: "Empty canvas", w: 32, h: 32, tpl: null },
  ];
  const SIZES = [16, 24, 32, 48, 64];
  const PROJECT_TILE = 32;

  const EXTRA = [
    { id: "shapes", name: "Shapes", ico: "◯", hint: "Boxes, circles, lines" },
    { id: "select", name: "Select", ico: "⬚", hint: "Pick up and move pixels" },
    { id: "mirror", name: "Mirror", ico: "⇋", hint: "Draw both sides at once" },
    { id: "parts", name: "Parts", ico: "▤", hint: "Body, face, back detail" },
    { id: "frames", name: "Frames", ico: "🎞", hint: "Walk cycles in 3 taps" },
    { id: "shade", name: "Shade", ico: "◐", hint: "Light from the top left" },
    { id: "outline", name: "Outline", ico: "▢", hint: "Auto 1px dark edge" },
    { id: "recolour", name: "Recolour", ico: "🎨", hint: "Swap a whole colour set" },
    { id: "pose", name: "Pose", ico: "🤸", hint: "Move arms and legs" },
  ];
  const BASE_TOOLS = [
    { id: "pencil", name: "Pencil", ico: "✏️" },
    { id: "eraser", name: "Eraser", ico: "⌫" },
    { id: "fill", name: "Fill", ico: "🪣" },
    { id: "colour", name: "Colour", ico: "" },
  ];
  // Facing (format §1.5): one drawing; facing only changes which parts show and their order.
  const PARTS = [
    { id: "back", name: "Back detail", hint: "Hair and cape seen from behind" },
    { id: "body", name: "Body", hint: "Everything you draw by default" },
    { id: "face", name: "Face (front)", hint: "Eyes and mouth" },
    { id: "faceSide", name: "Face (side)", hint: "One eye, for side views" },
  ];
  const FACING_ORDER = { down: ["body", "face"], up: ["body", "back"], side: ["back", "body", "faceSide"], left: ["back", "body", "faceSide"] };
  const FACING_LABEL = { down: "Down", up: "Up", side: "Side", left: "Left" };
  const DIRS = [
    { id: "down", label: "Walk down", facing: "down" },
    { id: "up", label: "Walk up", facing: "up" },
    { id: "left", label: "Walk left", sub: "mirror of Side", facing: "left" },
    { id: "right", label: "Walk right", facing: "side" },
  ];
  const WALK_STYLES = {
    bob: { name: "Bob", frames: ["base", "bob"] },
    four: { name: "4-frame", frames: ["base", "liftL bob", "base", "liftR bob"] },
    six: { name: "6-frame", frames: ["base", "liftL", "liftL bob", "base", "liftR", "liftR bob"] },
  };

  const st = {
    started: false, kind: "hero", W: 32, H: 32, pickW: 32, pickH: 32, tpl: "hero",
    parts: {}, activePart: "body", facing: "down",
    tool: "pencil", slot: SLOT(2, 1), pencilSize: 1,
    mirror: false, outline: false, shade: false, dither: "none", advanced: false,
    unlocked: [], zoom: 1, panX: 0, panY: 0,
    hist: [], redo: [],
    walk: null, walkStyle: "four", touch: {}, frameSel: null, onion: true,
    chip: null, sheet: null, rotation: 0, upgraded: false, keepHistory: true,
    lastUnlockMsg: "",
  };
  window.__spriteStudioState = st;

  /* ---------- data ---------- */
  function blank() { return new Uint8Array(st.W * st.H); }
  function resetData() {
    st.parts = {}; PARTS.forEach((p) => (st.parts[p.id] = blank()));
    st.hist = []; st.redo = []; st.walk = null; st.touch = {}; st.frameSel = null; st.chip = null;
  }
  function snapshot() {
    const parts = {}; Object.keys(st.parts).forEach((k) => (parts[k] = st.parts[k].slice()));
    return { parts, touch: JSON.stringify(st.touch), outline: st.outline, shade: st.shade, dither: st.dither, upgraded: st.upgraded, walk: st.walk };
  }
  function restore(s) {
    st.parts = s.parts; st.touch = JSON.parse(s.touch); st.outline = s.outline; st.shade = s.shade; st.dither = s.dither; st.upgraded = s.upgraded; st.walk = s.walk;
  }
  function pushHist() { st.hist.push(snapshot()); if (st.hist.length > 60) st.hist.shift(); st.redo = []; }
  function undo() { if (!st.hist.length) return say("Nothing to undo"); st.redo.push(snapshot()); restore(st.hist.pop()); st.chip = null; renderAll(); say("Undone"); }
  function redo() { if (!st.redo.length) return say("Nothing to redo"); st.hist.push(snapshot()); restore(st.redo.pop()); renderAll(); say("Redone"); }

  /* ---------- templates (faint guide, not data) ---------- */
  function tplMask(x, y) {
    const fx = (x + 0.5) * 32 / st.W, fy = (y + 0.5) * 32 / st.H;
    switch (st.tpl) {
      case "hero": {
        if ((fx - 16) ** 2 + (fy - 8) ** 2 <= 30) return true;
        if (fx >= 11 && fx <= 21 && fy >= 13 && fy <= 22) return true;
        if (((fx >= 8 && fx < 11) || (fx > 21 && fx <= 24)) && fy >= 14 && fy <= 21) return true;
        if (((fx >= 12 && fx <= 15.5) || (fx >= 16.5 && fx <= 20)) && fy > 22 && fy <= 31) return true;
        return false;
      }
      case "enemy": return ((fx - 16) / 12) ** 2 + ((fy - 20) / 10) ** 2 <= 1;
      case "item": return Math.abs(fx - 16) + Math.abs(fy - 16) <= 10;
      case "effect": { const d = Math.hypot(fx - 16, fy - 16); return d <= 5 || (d <= 13 && Math.abs(Math.sin(Math.atan2(fy - 16, fx - 16) * 4)) > 0.85); }
      default: return false;
    }
  }

  /* ---------- compose ---------- */
  function composeFacing(facing) {
    const W = st.W, H = st.H, out = new Uint8Array(W * H);
    for (const pid of FACING_ORDER[facing]) {
      const a = st.parts[pid];
      for (let i = 0; i < a.length; i++) if (a[i]) out[i] = a[i];
    }
    if (facing === "left") return mirrorImg(out);
    return out;
  }
  function mirrorImg(a) {
    const W = st.W, H = st.H, o = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) o[y * W + x] = a[y * W + (W - 1 - x)];
    return o;
  }
  function applyFrameOps(img, ops) {
    const W = st.W, H = st.H, legRow = Math.floor(H * 0.72);
    let a = img.slice();
    if (ops.includes("bob")) { // 1px bob: upper body sinks 1px
      const o = a.slice();
      for (let y = legRow - 1; y >= 0; y--) for (let x = 0; x < W; x++) o[y * W + x] = y > 0 ? a[(y - 1) * W + x] : 0;
      a = o;
    }
    const lift = (fromX, toX) => { // one leg steps (its pixels move up 1px: legs swap front/back)
      const o = a.slice();
      for (let y = legRow; y < H; y++) for (let x = fromX; x < toX; x++) o[y * W + x] = y + 1 < H ? a[(y + 1) * W + x] : 0;
      a = o;
    };
    if (ops.includes("liftL")) lift(0, Math.floor(W / 2));
    if (ops.includes("liftR")) lift(Math.floor(W / 2), W);
    return a;
  }
  function frameImg(dirId, i) {
    const d = DIRS.find((x) => x.id === dirId);
    const ops = WALK_STYLES[st.walk || st.walkStyle].frames[i] || "base";
    const a = applyFrameOps(composeFacing(d.facing), ops);
    const t = (st.touch[dirId] || {})[i] || {};
    Object.keys(t).forEach((k) => (a[+k] = t[k]));
    return a;
  }
  function displayImg() { return st.frameSel ? frameImg(st.frameSel.dir, st.frameSel.i) : composeFacing(st.facing); }

  // Render rules: shade (3-step, top-left light) + auto 1px dark-hue outline. Returns colour per pixel.
  function bake(img, opts = {}) {
    const W = st.W, H = st.H, out = new Array(W * H).fill(null);
    const outline = opts.outline ?? st.outline, shade = opts.shade ?? st.shade, dither = opts.dither ?? st.dither;
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : img[y * W + x]);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const s = img[y * W + x];
      if (!s) continue;
      let t = (s - 1) % 3; const r = slotRamp(s);
      if (shade && t === 1) {
        const sr = (v) => v && slotRamp(v) === r;
        if (!sr(at(x, y - 1)) || !sr(at(x - 1, y))) t = 2;
        else if (!sr(at(x, y + 1)) || !sr(at(x + 1, y))) t = 0;
        else if (dither === "checker" && !sr(at(x + 2, y + 1)) && (x + y) % 2) t = 0;
        else if (dither === "bayer" && !sr(at(x + 2, y + 2)) && (x % 2) && (y % 2)) t = 0;
      }
      out[y * W + x] = RAMPS[r].c[t];
    }
    if (outline) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (img[y * W + x]) continue;
      const n = at(x, y - 1) || at(x - 1, y) || at(x + 1, y) || at(x, y + 1);
      if (n) out[y * W + x] = RAMPS[slotRamp(n)].line;
    }
    return out;
  }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ---------- canvas ---------- */
  function cellSize() {
    const vp = $("#ss-viewport"); if (!vp) return 8;
    const fit = Math.max(2, Math.floor(Math.min((vp.clientWidth - 24) / st.W, (vp.clientHeight - 128) / st.H)));
    return Math.max(2, Math.round(fit * st.zoom));
  }
  function renderCanvas() {
    const cv = $("#ss-canvas"), vp = $("#ss-viewport"); if (!cv || !vp) return;
    const c = cellSize(), W = st.W, H = st.H, dpr = window.devicePixelRatio || 1;
    cv.width = W * c * dpr; cv.height = H * c * dpr;
    cv.style.width = W * c + "px"; cv.style.height = H * c + "px";
    cv.style.left = Math.round((vp.clientWidth - W * c) / 2 + st.panX) + "px";
    cv.style.top = Math.round((vp.clientHeight - H * c) / 2 + st.panY) + "px";
    const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.imageSmoothingEnabled = false;
    const ca = css("--checker-a") || "#eceff4", cb = css("--checker-b") || "#fff";
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { g.fillStyle = (x + y) % 2 ? ca : cb; g.fillRect(x * c, y * c, c, c); }
    if (st.tpl && !st.frameSel) {
      g.fillStyle = document.documentElement.dataset.theme === "dark" ? "rgba(160,175,205,0.22)" : "rgba(40,55,90,0.13)";
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (tplMask(x, y)) g.fillRect(x * c, y * c, c, c);
    }
    if (st.frameSel && st.onion) {
      const n = WALK_STYLES[st.walk].frames.length, prev = bake(frameImg(st.frameSel.dir, (st.frameSel.i + n - 1) % n));
      g.globalAlpha = 0.28;
      prev.forEach((col, i) => { if (col) { g.fillStyle = col; g.fillRect((i % W) * c, Math.floor(i / W) * c, c, c); } });
      g.globalAlpha = 1;
    }
    const cols = bake(displayImg());
    cols.forEach((col, i) => { if (col) { g.fillStyle = col; g.fillRect((i % W) * c, Math.floor(i / W) * c, c, c); } });
    if (c >= 6) {
      g.fillStyle = css("--grid-line") || "#d0d5dd";
      for (let x = 0; x <= W; x++) g.fillRect(Math.min(x * c, W * c - 1), 0, 1, H * c);
      for (let y = 0; y <= H; y++) g.fillRect(0, Math.min(y * c, H * c - 1), W * c, 1);
    }
    if (st.mirror) {
      g.strokeStyle = css("--accent") || "#2f5bff"; g.lineWidth = 2; g.setLineDash([6, 4]);
      g.beginPath(); g.moveTo(W * c / 2, 0); g.lineTo(W * c / 2, H * c); g.stroke(); g.setLineDash([]);
    }
  }

  /* ---------- painting ---------- */
  function targetWrite(x, y, slot) {
    const W = st.W, H = st.H;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    if (st.frameSel) {
      const d = st.frameSel.dir, i = st.frameSel.i;
      st.touch[d] = st.touch[d] || {}; st.touch[d][i] = st.touch[d][i] || {};
      st.touch[d][i][y * W + x] = slot; // per-frame touch-up: only this frame changes
      return;
    }
    const px = st.facing === "left" ? W - 1 - x : x;
    st.parts[st.activePart][y * W + px] = slot;
  }
  function paintAt(x, y, slot) {
    const r = st.pencilSize, o = Math.floor((r - 1) / 2);
    for (let dy = 0; dy < r; dy++) for (let dx = 0; dx < r; dx++) {
      targetWrite(x - o + dx, y - o + dy, slot);
      if (st.mirror) targetWrite(st.W - 1 - (x - o + dx), y - o + dy, slot);
    }
  }
  function line(x0, y0, x1, y1, slot) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) { paintAt(x0, y0, slot); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  function fillAt(x, y, slot) {
    if (st.frameSel) { say("Fill works on the main drawing. Use Pencil to touch up a frame."); return false; }
    const W = st.W, H = st.H;
    const a = st.parts[st.activePart];
    const pxs = (xx) => (st.facing === "left" ? W - 1 - xx : xx);
    const seeds = [[pxs(x), y]]; if (st.mirror) seeds.push([pxs(W - 1 - x), y]);
    for (const [sx, sy] of seeds) {
      const from = a[sy * W + sx]; if (from === slot) continue;
      const q = [[sx, sy]];
      while (q.length) {
        const [cx, cy] = q.pop();
        if (cx < 0 || cy < 0 || cx >= W || cy >= H || a[cy * W + cx] !== from) continue;
        a[cy * W + cx] = slot; q.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
    }
    return true;
  }
  function cellFromEvent(e) {
    const r = $("#ss-canvas").getBoundingClientRect(), c = r.width / st.W;
    return [Math.floor((e.clientX - r.left) / c), Math.floor((e.clientY - r.top) / c)];
  }

  /* ---------- gestures: 1 finger draws · 2 fingers pinch/pan · hold = eyedropper · 2-finger tap undo · 3-finger tap redo ---------- */
  const ptrs = new Map(); let g = null;
  function onDown(e) {
    if (e.target.closest("button")) return;
    if (!st.started) return;
    e.preventDefault();
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, t: Date.now() });
    try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    if (ptrs.size === 1) {
      const [x, y] = cellFromEvent(e);
      g = { mode: "draw", snap: snapshot(), last: [x, y], start: [x, y], cells: new Set([x + "," + y]), moved: 0, t0: Date.now() };
      g.hold = setTimeout(() => { if (g && g.mode === "draw" && g.moved < 6) eyedrop(x, y); }, 480);
      if (st.tool === "fill") { clearTimeout(g.hold); if (fillAt(x, y, st.slot)) { st.hist.push(g.snap); st.redo = []; } g = null; renderAll(); return; }
      paintAt(x, y, st.tool === "eraser" ? 0 : st.slot); renderCanvas();
    } else {
      if (g && g.mode === "draw") { clearTimeout(g.hold); restore(g.snap); }
      const pts = [...ptrs.values()];
      g = { mode: "multi", n: ptrs.size, t0: Date.now(), moved: 0, d0: dist(pts), m0: mid(pts), zoom0: st.zoom, pan0: [st.panX, st.panY] };
      renderCanvas();
    }
  }
  const dist = (p) => (p.length < 2 ? 1 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y));
  const mid = (p) => ({ x: p.reduce((s, q) => s + q.x, 0) / p.length, y: p.reduce((s, q) => s + q.y, 0) / p.length });
  function onMove(e) {
    if (!ptrs.has(e.pointerId) || !g) return;
    const p = ptrs.get(e.pointerId); const dm = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    if (g.mode === "draw") {
      g.moved += dm; p.x = e.clientX; p.y = e.clientY;
      const [x, y] = cellFromEvent(e);
      if (x !== g.last[0] || y !== g.last[1]) { line(g.last[0], g.last[1], x, y, st.tool === "eraser" ? 0 : st.slot); g.last = [x, y]; g.cells.add(x + "," + y); renderCanvas(); }
    } else if (g.mode === "multi") {
      p.x = e.clientX; p.y = e.clientY; g.moved += dm;
      const pts = [...ptrs.values()]; const m = mid(pts);
      if (pts.length >= 2) st.zoom = Math.min(6, Math.max(0.5, g.zoom0 * dist(pts) / g.d0));
      st.panX = g.pan0[0] + (m.x - g.m0.x); st.panY = g.pan0[1] + (m.y - g.m0.y);
      renderCanvas();
    }
  }
  function onUp(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (!g) return;
    if (g.mode === "draw") {
      clearTimeout(g.hold);
      if (g.mode === "draw" && !g.picked) {
        st.hist.push(g.snap); st.redo = [];
        const [sx, sy] = g.start, [ex, ey] = g.last;
        if (st.tool === "pencil" && !st.frameSel && g.cells.size >= 8 && Math.hypot(ex - sx, ey - sy) <= 1.5) st.chip = "pixels"; else st.chip = null;
      }
      g = null; renderAll();
    } else if (g.mode === "multi" && ptrs.size === 0) {
      if (Date.now() - g.t0 < 280 && g.moved < 20) { if (g.n === 2) { st.zoom = g.zoom0; st.panX = g.pan0[0]; st.panY = g.pan0[1]; undo(); } else if (g.n >= 3) redo(); }
      g = null; renderAll();
    }
  }
  function eyedrop(x, y) {
    if (!g) return;
    restore(g.snap); g.picked = true;
    const s = displayImg()[y * st.W + x];
    if (s) { st.slot = s; if (st.tool === "eraser" || st.tool === "fill") st.tool = "pencil"; say(`Picked ${RAMPS[slotRamp(s)].name.toLowerCase()} colour`); }
    else say("Nothing to pick there");
    renderAll();
  }

  /* ---------- UI ---------- */
  function say(msg) { const l = $("#ss-live"); if (l) l.textContent = msg; }
  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 3200);
  }
  function railBtn(id, name, ico, pressed, extra = "") {
    return `<button type="button" class="rail-btn" data-ss-tool="${id}" aria-pressed="${pressed}" aria-label="${name}"${extra}><span class="rail-ico" aria-hidden="true">${ico}</span><span class="rail-lbl">${name}</span></button>`;
  }
  function renderRail() {
    const r = $("#ss-rail"); if (!r) return;
    r.hidden = !st.started;
    let h = BASE_TOOLS.map((t) => t.id === "colour"
      ? railBtn("colour", "Colour", `<span class="ss-swatch" style="background:${slotColour(st.slot)}"></span>`, st.sheet === "colour")
      : railBtn(t.id, t.name, t.ico, st.tool === t.id)).join("");
    st.unlocked.forEach((id) => {
      const t = EXTRA.find((x) => x.id === id);
      const on = id === "mirror" ? st.mirror : id === "outline" ? st.outline : st.sheet === id;
      h += railBtn(id, t.name, t.ico, on);
    });
    h += railBtn("more", "More", "⋯", st.sheet === "more");
    r.innerHTML = h;
    r.classList.toggle("is-crowded", st.unlocked.length > 3);
    $$("[data-ss-tool]", r).forEach((b) => (b.onclick = () => tapTool(b.dataset.ssTool)));
  }
  function tapTool(id) {
    if (["pencil", "eraser", "fill"].includes(id)) {
      if (st.tool === id && id === "pencil") { openSheet(st.sheet === "pencil" ? null : "pencil"); return; }
      st.tool = id; if (st.sheet === "pencil" || st.sheet === "colour") openSheet(null); else renderAll();
      say(id === "pencil" ? "Pencil" : id === "eraser" ? "Eraser" : "Fill"); return;
    }
    if (id === "mirror") { st.mirror = !st.mirror; say(st.mirror ? "Mirror on: you draw both sides" : "Mirror off"); renderAll(); return; }
    if (id === "outline") { pushHist(); st.outline = !st.outline; say(st.outline ? "Outline on: 1px dark edge" : "Outline off"); renderAll(); return; }
    if (id === "select") { say("Select is a mock: drag a box to pick up pixels (SE-03)"); toast("Select: drag a box to pick up pixels · mock"); return; }
    openSheet(st.sheet === id ? null : id);
  }
  function openSheet(id) { st.sheet = id; renderAll(); const b = $("#ss-sheet-body"); if (b) b.scrollTop = 0; }

  function unlock(id) {
    if (!st.unlocked.includes(id)) st.unlocked.push(id);
    const t = EXTRA.find((x) => x.id === id);
    st.lastUnlockMsg = `${t.name} added to your bar`;
    if (id === "mirror") st.mirror = true;
    if (id === "outline") { pushHist(); st.outline = true; }
    say(st.lastUnlockMsg);
    renderAll();
  }

  function seg(group, opts, cur, attrs = "") {
    return `<div class="sheet-row wrap" role="group" aria-label="${group}">${opts.map(([v, l, dis]) => `<button type="button" class="toggle" data-${attrs}="${v}" aria-pressed="${cur === v}"${dis ? " disabled" : ""}>${l}</button>`).join("")}</div>`;
  }
  function frameThumb(dirId, i) { return `<canvas class="ss-thumb" data-thumb="${dirId}:${i}" width="${st.W}" height="${st.H}"></canvas>`; }

  function sheetHtml(id) {
    switch (id) {
      case "colour": {
        const used = RAMPS.length * 3;
        return `<div class="ss-sheet-head"><p class="eyebrow">Colours · ${used} of 16 · default style</p><button type="button" class="toggle" id="ss-add-colour">+ Add</button></div>
        <p class="hint ss-tight">Light on top, shadow below. Shadows lean cool, lights warm.</p>
        <div class="ss-ramps">${RAMPS.map((r, ri) => `<div class="ss-ramp"><span class="ss-ramp-name">${r.name}</span>${[2, 1, 0].map((t) => `<button type="button" class="ss-slot" data-slot="${SLOT(ri, t)}" aria-pressed="${st.slot === SLOT(ri, t)}" aria-label="${r.name} ${["shadow", "base", "light"][t]}" style="background:${r.c[t]}"></button>`).join("")}</div>`).join("")}</div>`;
      }
      case "pencil":
        return `<p class="eyebrow">Pencil</p>${seg("Pencil size", [[1, "1 pixel"], [2, "2 pixels"], [3, "3 pixels"]], st.pencilSize, "pen")}
        <p class="hint">Hard edges only: every pixel is solid. There's no soft brush.</p>`;
      case "more":
        return `<div class="ss-sheet-head"><p class="eyebrow">More tools · tap to add to your bar</p><button type="button" class="toggle" id="ss-open-preview">Preview</button></div>
        <p class="hint ss-tight" id="ss-unlock-msg" role="status">${st.lastUnlockMsg || "Nothing is locked for good. Tools appear when you need them."}</p>
        <div class="ss-extra-grid">${EXTRA.map((t) => { const on = st.unlocked.includes(t.id);
          return `<button type="button" class="ss-extra ${on ? "is-on" : "is-locked"}" data-extra="${t.id}" aria-label="${t.name}: ${t.hint}${on ? " (on your bar)" : ""}">
            <span class="ss-extra-name"><span aria-hidden="true">${on ? "✓" : "🔒"}</span> ${t.name}</span><span class="ss-extra-hint">${on ? "On your bar" : t.hint}</span></button>`; }).join("")}</div>`;
      case "frames": {
        const facingRow = `<p class="eyebrow">Facing · same drawing, parts reorder</p>
          ${seg("Facing", [["down", "Down"], ["up", "Up"], ["side", "Side"], ["left", "Left"]], st.facing, "facing")}
          <p class="hint ss-tight">Left is Side mirrored. Up hides the face and shows the back detail.</p>`;
        if (!st.walk) return `${facingRow}<p class="eyebrow" style="margin-top:10px">Walk style</p>
          ${seg("Walk style", [["bob", "Bob"], ["four", "4-frame"], ["six", "6-frame"]], st.walkStyle, "wstyle")}
          <button type="button" class="btn btn-primary ss-wide" id="ss-make-walk">Make walk cycle</button>`;
        const n = WALK_STYLES[st.walk].frames.length;
        return `<div class="ss-sheet-head"><p class="eyebrow">Walk · ${WALK_STYLES[st.walk].name} · 4 directions</p><button type="button" class="toggle" id="ss-onion" aria-pressed="${st.onion}">Onion skin</button></div>
          <div class="ss-strip" style="--n:${n}">${DIRS.map((d) => `<div class="ss-strip-row"><span class="ss-strip-lbl">${d.label}${d.sub ? `<small>${d.sub}</small>` : ""}</span>${Array.from({ length: n }, (_, i) => {
            const sel = st.frameSel && st.frameSel.dir === d.id && st.frameSel.i === i;
            const touched = st.touch[d.id] && st.touch[d.id][i] && Object.keys(st.touch[d.id][i]).length;
            return `<button type="button" class="ss-frame${sel ? " is-sel" : ""}" data-frame="${d.id}:${i}" aria-pressed="${!!sel}" aria-label="${d.label} frame ${i + 1}${touched ? ", touched up" : ""}">${frameThumb(d.id, i)}${touched ? `<span class="ss-touch-dot" aria-hidden="true">✎</span>` : ""}</button>`; }).join("")}</div>`).join("")}</div>
          <p class="hint ss-tight">Tap a frame to touch it up. Drawing there changes only that frame.</p>
          ${facingRow}
          <div class="sheet-row wrap" style="margin-top:8px"><button type="button" class="btn btn-ghost" id="ss-rewalk">Change walk style</button><button type="button" class="btn btn-ghost" id="ss-open-preview2">Preview</button></div>`;
      }
      case "preview":
        return `<div class="ss-sheet-head"><p class="eyebrow">Live preview · on an Ashroad tile</p><button type="button" class="toggle" id="ss-preview-frames">Frames</button></div>
          <div class="ss-preview">
            <figure><canvas id="ss-prev-day" width="96" height="64"></canvas><figcaption>Day</figcaption></figure>
            <figure><canvas id="ss-prev-night" width="96" height="64"></canvas><figcaption>Night · scene tint</figcaption></figure>
          </div>
          <p class="hint ss-tight">Night tints the whole scene. It's the same sprite, nothing to redraw.</p>`;
      case "parts":
        return `<p class="eyebrow">Parts · you're drawing on ${PARTS.find((p) => p.id === st.activePart).name}</p>
          <div class="ss-parts">${PARTS.map((p) => { const vis = FACING_ORDER[st.facing].includes(p.id);
            return `<button type="button" class="ss-part" data-part="${p.id}" aria-pressed="${st.activePart === p.id}"><span><b>${p.name}</b><small>${p.hint}</small></span><span class="ss-part-vis">${vis ? "Shows" : "Hidden"} facing ${FACING_LABEL[st.facing]}</span></button>`; }).join("")}</div>`;
      case "shade":
        return `<div class="ss-sheet-head"><p class="eyebrow">Shade · 3 steps · light from the top left</p><button type="button" class="toggle" id="ss-shade-on" aria-pressed="${st.shade}">${st.shade ? "On" : "Off"}</button></div>
          <p class="eyebrow" style="margin-top:6px">Dither</p>
          ${seg("Dither", [["none", "None"], ["checker", "Checker"]].concat(st.advanced ? [["bayer", "Bayer"]] : []), st.dither, "dither")}
          <div class="sheet-row wrap" style="margin-top:8px"><button type="button" class="toggle" id="ss-adv" aria-pressed="${st.advanced}">Advanced</button>
          <a class="btn btn-ghost ss-link" href="index.html#stage" id="ss-glow-link" aria-label="Glow: add in Effects (opens the Effect Designer)">Glow: add in Effects</a></div>
          <p class="hint ss-tight">Hard edges only. Glows live in the Effect Designer, not in the sprite.</p>`;
      case "shapes":
        return `<p class="eyebrow">Shapes · rotate and mirror</p>
          ${seg("Shape", [["box", "Box"], ["circle", "Circle"], ["line", "Line"]], st.shapeKind || "box", "shape")}
          <div class="sheet-row wrap" style="margin-top:8px"><button type="button" class="btn btn-ghost" id="ss-rot90">Turn 90°</button><button type="button" class="btn btn-ghost" id="ss-flip">Mirror</button><button type="button" class="toggle" id="ss-adv2" aria-pressed="${st.advanced}">Advanced</button></div>
          ${st.advanced ? `<label class="ss-range"><span>Any angle · ${st.rotation}°</span><input type="range" id="ss-rot-free" min="0" max="359" step="1" value="${st.rotation}" aria-label="Rotation in whole degrees"></label>` : `<p class="hint ss-tight">Basic turns in 90° steps. Advanced allows any whole degree.</p>`}`;
      case "recolour":
        return `<p class="eyebrow">Recolour · swap a whole colour set</p>
          <div class="sheet-row wrap"><button type="button" class="btn btn-ghost" data-swap="2:3">Tunic ⇄ Cloth</button><button type="button" class="btn btn-ghost" data-swap="1:4">Hair ⇄ Leather</button></div>
          <p class="hint ss-tight">Every pixel in that set changes at once, in every frame. One undo step.</p>`;
      case "pose":
        return `<p class="eyebrow">Pose · move parts by their joints</p>
          <div class="sheet-row wrap"><button type="button" class="btn btn-ghost" data-pose="wave">Wave</button><button type="button" class="btn btn-ghost" data-pose="crouch">Crouch</button></div>
          <p class="hint ss-tight">Mock: poses come from body joints in SE-06.</p>`;
      case "help":
        return `<p class="eyebrow">Gestures</p>
          <ul class="ss-help">
            <li><b>One finger</b> draws</li><li><b>Two fingers</b> pinch to zoom, drag to move</li>
            <li><b>Hold one finger</b> picks the colour under it</li><li><b>Two-finger tap</b> undo · <b>three-finger tap</b> redo</li>
            <li><b>Stylus</b> draws; your palm is ignored</li></ul>
          <div class="sheet-row wrap"><button type="button" class="tool" id="ss-zoom-out" aria-label="Zoom out">−</button><button type="button" class="tool" id="ss-zoom-fit">Fit</button><button type="button" class="tool" id="ss-zoom-in" aria-label="Zoom in">+</button></div>`;
      case "export": {
        const n = st.walk ? WALK_STYLES[st.walk].frames.length * 4 : 1;
        return `<p class="eyebrow">Save · ${KINDS.find((k) => k.id === st.kind).name} ${st.W}×${st.H} · ${n} frame${n > 1 ? "s" : ""} · 15 colours</p>
          <p class="ss-export-line"><b>Baked to pixels</b> · drawing history isn't included in games</p>
          <button type="button" class="btn btn-primary ss-wide" id="ss-save">Save to project sprites</button>
          <div class="ss-hub-row"><div class="ss-sheet-head"><p class="eyebrow">Upload to hub · mock, nothing leaves this device</p></div>
            <button type="button" class="toggle ss-wide-toggle" id="ss-keep-hist" aria-pressed="${st.keepHistory}">${st.keepHistory ? "✓ " : ""}Keep drawing history (proves it's yours)</button>
            <button type="button" class="btn btn-ghost ss-wide" id="ss-hub-upload">Upload to hub</button></div>`;
      }
      case "upgrade":
        return `<p class="eyebrow">Upgrade look · default style v2</p>
          <div class="ss-preview"><figure><canvas id="ss-up-before" width="${st.W}" height="${st.H}"></canvas><figcaption>Before</figcaption></figure>
          <figure><canvas id="ss-up-after" width="${st.W}" height="${st.H}"></canvas><figcaption>After</figcaption></figure></div>
          <div class="sheet-row wrap"><button type="button" class="btn btn-primary" id="ss-up-yes" style="flex:1">Update</button><button type="button" class="btn btn-ghost" id="ss-up-no" style="flex:1">Keep current</button></div>
          <p class="hint ss-tight">Adds the outline and 3-step shade. One undo step.</p>`;
      default: return "";
    }
  }
  function drawSmall(cv, img, opts) {
    if (!cv) return; const g2 = cv.getContext("2d"); g2.clearRect(0, 0, cv.width, cv.height);
    bake(img, opts).forEach((col, i) => { if (col) { g2.fillStyle = col; g2.fillRect(i % st.W, Math.floor(i / st.W), 1, 1); } });
  }
  function wireSheet(id) {
    const b = $("#ss-sheet-body");
    $$("[data-slot]", b).forEach((x) => (x.onclick = () => { st.slot = +x.dataset.slot; if (st.tool === "eraser") st.tool = "pencil"; say("Colour picked"); renderAll(); }));
    $("#ss-add-colour") && ($("#ss-add-colour").onclick = () => toast("Add colour: one slot left (16 max) · mock"));
    $$("[data-pen]", b).forEach((x) => (x.onclick = () => { st.pencilSize = +x.dataset.pen; renderAll(); }));
    $$("[data-extra]", b).forEach((x) => (x.onclick = () => unlock(x.dataset.extra)));
    $$("[data-facing]", b).forEach((x) => (x.onclick = () => setFacing(x.dataset.facing)));
    $$("[data-wstyle]", b).forEach((x) => (x.onclick = () => { st.walkStyle = x.dataset.wstyle; renderAll(); }));
    $("#ss-make-walk") && ($("#ss-make-walk").onclick = makeWalk);
    $("#ss-rewalk") && ($("#ss-rewalk").onclick = () => { pushHist(); st.walk = null; st.frameSel = null; renderAll(); });
    $("#ss-onion") && ($("#ss-onion").onclick = () => { st.onion = !st.onion; renderAll(); });
    ["#ss-open-preview", "#ss-open-preview2"].forEach((s) => $(s) && ($(s).onclick = () => openSheet("preview")));
    $("#ss-preview-frames") && ($("#ss-preview-frames").onclick = () => { if (!st.unlocked.includes("frames")) st.unlocked.push("frames"); openSheet("frames"); });
    $$("[data-frame]", b).forEach((x) => (x.onclick = () => { const [d, i] = x.dataset.frame.split(":"); selectFrame(d, +i); }));
    $$("[data-thumb]", b).forEach((cv) => { const [d, i] = cv.dataset.thumb.split(":"); drawSmall(cv, frameImg(d, +i)); });
    $$("[data-part]", b).forEach((x) => (x.onclick = () => { st.activePart = x.dataset.part; say("Drawing on " + PARTS.find((p) => p.id === st.activePart).name); renderAll(); }));
    $("#ss-shade-on") && ($("#ss-shade-on").onclick = () => { pushHist(); st.shade = !st.shade; renderAll(); });
    $$("[data-dither]", b).forEach((x) => (x.onclick = () => { pushHist(); st.dither = x.dataset.dither; renderAll(); }));
    ["#ss-adv", "#ss-adv2"].forEach((s) => $(s) && ($(s).onclick = () => { st.advanced = !st.advanced; if (!st.advanced && st.dither === "bayer") st.dither = "checker"; renderAll(); }));
    $("#ss-glow-link") && ($("#ss-glow-link").onclick = (e) => { e.preventDefault(); toast("Opens the Effect Designer (mock-effects) · glow is an effect, not sprite pixels"); });
    $$("[data-shape]", b).forEach((x) => (x.onclick = () => { st.shapeKind = x.dataset.shape; renderAll(); }));
    $("#ss-rot90") && ($("#ss-rot90").onclick = rotate90);
    $("#ss-flip") && ($("#ss-flip").onclick = flipPart);
    $("#ss-rot-free") && ($("#ss-rot-free").oninput = (e) => { st.rotation = +e.target.value; const s = $(".ss-range span"); if (s) s.textContent = `Any angle · ${st.rotation}°`; });
    $$("[data-swap]", b).forEach((x) => (x.onclick = () => { const [a, c] = x.dataset.swap.split(":").map(Number); swapRamps(a, c); }));
    $$("[data-pose]", b).forEach((x) => (x.onclick = () => toast(`Pose “${x.textContent}” · mock until joints land (SE-06)`)));
    $("#ss-zoom-in") && ($("#ss-zoom-in").onclick = () => { st.zoom = Math.min(6, st.zoom * 1.5); renderCanvas(); });
    $("#ss-zoom-out") && ($("#ss-zoom-out").onclick = () => { st.zoom = Math.max(0.5, st.zoom / 1.5); renderCanvas(); });
    $("#ss-zoom-fit") && ($("#ss-zoom-fit").onclick = () => { st.zoom = 1; st.panX = st.panY = 0; renderCanvas(); });
    $("#ss-save") && ($("#ss-save").onclick = () => toast("Saved to your project's sprites · PNG + frames · drawing history kept"));
    $("#ss-keep-hist") && ($("#ss-keep-hist").onclick = () => { st.keepHistory = !st.keepHistory; renderAll(); });
    $("#ss-hub-upload") && ($("#ss-hub-upload").onclick = () => toast("Mock only · nothing was uploaded" + (st.keepHistory ? " · history would be kept" : "")));
    if (id === "upgrade") {
      drawSmall($("#ss-up-before"), composeFacing(st.facing));
      drawSmall($("#ss-up-after"), composeFacing(st.facing), { outline: true, shade: true });
      $("#ss-up-yes").onclick = () => { pushHist(); st.outline = true; st.shade = true; st.upgraded = true; if (!st.unlocked.includes("outline")) st.unlocked.push("outline"); openSheet(null); toast("Look updated · one undo step"); };
      $("#ss-up-no").onclick = () => openSheet(null);
    }
    if (id === "preview") startPreview(); else stopPreview();
  }
  function setFacing(f) { st.facing = f; st.frameSel = null; say("Facing " + FACING_LABEL[f]); renderAll(); }
  function makeWalk() {
    pushHist(); st.walk = st.walkStyle; st.touch = {}; st.frameSel = null;
    say(`${WALK_STYLES[st.walk].name} walk made for 4 directions`); renderAll();
  }
  function selectFrame(d, i) {
    st.frameSel = st.frameSel && st.frameSel.dir === d && st.frameSel.i === i ? null : { dir: d, i };
    renderAll();
  }
  function rotate90() {
    if (st.W !== st.H) return toast("Turn 90° needs a square canvas · mock");
    pushHist(); const W = st.W, a = st.parts[st.activePart], o = new Uint8Array(a.length);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) o[x * W + (W - 1 - y)] = a[y * W + x];
    st.parts[st.activePart] = o; st.rotation = (st.rotation + 90) % 360; renderAll(); say("Turned 90°");
  }
  function flipPart() { pushHist(); st.parts[st.activePart] = mirrorImg(st.parts[st.activePart]); renderAll(); say("Mirrored"); }
  function swapRamps(a, c) {
    pushHist();
    const map = (s) => { if (!s) return s; const r = slotRamp(s), t = (s - 1) % 3; return r === a ? SLOT(c, t) : r === c ? SLOT(a, t) : s; };
    Object.values(st.parts).forEach((arr) => { for (let i = 0; i < arr.length; i++) arr[i] = map(arr[i]); });
    Object.values(st.touch).forEach((fr) => Object.values(fr).forEach((m) => Object.keys(m).forEach((k) => (m[k] = map(m[k])))));
    renderAll(); toast("Recoloured everywhere · one undo step");
  }

  /* ---------- live preview ---------- */
  const tileImg = new Image(); tileImg.src = "mock-art/test-images/painter/ashroad-v1-tiles.png";
  let prevTimer = null, prevTick = 0;
  function stopPreview() { clearInterval(prevTimer); prevTimer = null; }
  function startPreview() {
    stopPreview();
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = () => {
      ["day", "night"].forEach((k) => {
        const cv = $("#ss-prev-" + k); if (!cv) return;
        const g2 = cv.getContext("2d"); g2.imageSmoothingEnabled = false;
        for (let tx = 0; tx < 3; tx++) for (let ty = 0; ty < 2; ty++) {
          const src = ty === 0 ? 0 : 1; // grass row, path row
          if (tileImg.complete && tileImg.naturalWidth) g2.drawImage(tileImg, src * 32, 0, 32, 32, tx * 32, ty * 32, 32, 32);
          else { g2.fillStyle = ty ? "#9a8a6a" : "#5f8a4a"; g2.fillRect(tx * 32, ty * 32, 32, 32); }
        }
        const dir = st.walk ? "right" : null, n = st.walk ? WALK_STYLES[st.walk].frames.length : 1;
        const fi = prevTick % n;
        const img = dir ? frameImg(dir, fi) : composeFacing("side");
        const x0 = reduce ? 32 : ((prevTick * 2 + 32 + st.W) % (96 + st.W)) - st.W, y0 = 60 - st.H;
        bake(img).forEach((col, i) => { if (col) { g2.fillStyle = col; g2.fillRect(x0 + (i % st.W), y0 + Math.floor(i / st.W), 1, 1); } });
        if (k === "night") { // scene tint, not a separate sprite
          g2.globalCompositeOperation = "multiply"; g2.fillStyle = "#6a7cb4"; g2.fillRect(0, 0, 96, 64);
          g2.globalCompositeOperation = "source-over";
        }
      });
      prevTick++;
    };
    draw();
    if (!reduce) prevTimer = setInterval(draw, 160);
    else prevTimer = setInterval(draw, 600);
  }

  /* ---------- start ---------- */
  function renderStart() {
    const el = $("#ss-start"); if (!el) return;
    el.hidden = st.started;
    if (st.started) return;
    const heights = SIZES.filter((h) => h >= st.pickW);
    el.innerHTML = `<h2 class="ss-start-title">What are you making?</h2>
      <div class="ss-kinds" role="group" aria-label="Sprite kind">${KINDS.map((k) => `<button type="button" class="choice ss-kind" data-kind="${k.id}" aria-pressed="${st.kind === k.id}"><span class="label">${k.name}</span><span class="sub">${k.sub}</span></button>`).join("")}</div>
      <p class="ss-licence">Starter body: Made by TileEngine · free to use</p>
      <p class="eyebrow">Width · ${PROJECT_TILE} suggested from your tiles</p>
      ${seg("Width", SIZES.map((s) => [s, String(s)]), st.pickW, "pw")}
      <p class="eyebrow" style="margin-top:8px">Height · can be taller than wide</p>
      ${seg("Height", heights.map((s) => [s, String(s)]), st.pickH, "ph")}
      <button type="button" class="btn btn-primary ss-wide" id="ss-start-go">Start drawing · ${st.pickW}×${st.pickH}</button>`;
    $$("[data-kind]", el).forEach((b) => (b.onclick = () => { const k = KINDS.find((x) => x.id === b.dataset.kind); st.kind = k.id; st.pickW = k.w; st.pickH = k.h; renderStart(); }));
    $$("[data-pw]", el).forEach((b) => (b.onclick = () => { st.pickW = +b.dataset.pw; if (st.pickH < st.pickW) st.pickH = st.pickW; renderStart(); }));
    $$("[data-ph]", el).forEach((b) => (b.onclick = () => { st.pickH = +b.dataset.ph; renderStart(); }));
    $("#ss-start-go").onclick = () => begin(st.kind, st.pickW, st.pickH);
  }
  function begin(kind, w, h) {
    const k = KINDS.find((x) => x.id === kind);
    st.kind = kind; st.W = w; st.H = h; st.tpl = k.tpl; st.started = true; st.zoom = 1; st.panX = st.panY = 0;
    st.tool = "pencil"; st.sheet = null; resetData(); renderAll();
    say(`${k.name} canvas ${w} by ${h}. One finger draws.`);
  }

  function renderTop() {
    const t = $("#ss-title"); if (t) t.textContent = st.started ? `${KINDS.find((k) => k.id === st.kind).name} ${st.W}×${st.H}` : "New sprite";
    const u = $("#ss-upgrade"); if (u) u.hidden = !st.started || st.upgraded;
    const e = $("#ss-export-btn"); if (e) e.hidden = !st.started;
    const h = $("#ss-help-btn"); if (h) h.setAttribute("aria-pressed", String(st.sheet === "help"));
  }
  function renderOverlays() {
    const fab = $("#ss-fab-undo"); if (fab) { fab.hidden = !st.started || !!st.sheet; fab.disabled = !st.hist.length; }
    const fc = $("#ss-facing-chip"); if (fc) { fc.hidden = !st.started || st.kind !== "hero" || !!st.frameSel; fc.textContent = "Facing: " + FACING_LABEL[st.facing]; }
    const fb = $("#ss-frame-banner"); if (fb) {
      fb.hidden = !st.frameSel;
      if (st.frameSel) { const d = DIRS.find((x) => x.id === st.frameSel.dir); $("#ss-frame-banner-text").textContent = `${d.label} · frame ${st.frameSel.i + 1} only`; }
    }
    const ch = $("#ss-chips"); if (ch) {
      ch.hidden = !st.chip || !!st.sheet;
      $("#ss-chip-pixels").setAttribute("aria-pressed", String(st.chip === "pixels"));
      $("#ss-chip-shape").setAttribute("aria-pressed", String(st.chip === "shape"));
      $("#ss-chips-lbl").textContent = st.chip === "shape" ? "Now a shape (blob) · sliders later" : "Closed shape drawn";
    }
  }
  function renderSheet() {
    const sh = $("#ss-sheet"); if (!sh) return;
    sh.hidden = !st.started || !st.sheet;
    sh.dataset.mode = st.sheet || "";
    $("#ss-undo").disabled = !st.hist.length; $("#ss-redo").disabled = !st.redo.length;
    if (st.sheet) { $("#ss-sheet-body").innerHTML = sheetHtml(st.sheet); wireSheet(st.sheet); } else stopPreview();
  }
  function renderAll() {
    renderTop(); renderStart(); renderRail(); renderSheet(); renderOverlays();
    requestAnimationFrame(renderCanvas); renderCanvas();
  }

  function onShow() {
    renderAll();
  }

  function init() {
    const vp = $("#ss-viewport"); if (!vp) return;
    resetData();
    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove);
    vp.addEventListener("pointerup", onUp);
    vp.addEventListener("pointercancel", onUp);
    $("#ss-back").onclick = () => { stopPreview(); window.__show && window.__show("stage"); };
    $("#ss-help-btn").onclick = () => { if (!st.started) return toast("Pick what you're making first"); openSheet(st.sheet === "help" ? null : "help"); };
    $("#ss-export-btn").onclick = () => openSheet(st.sheet === "export" ? null : "export");
    $("#ss-upgrade").onclick = () => openSheet("upgrade");
    $("#ss-sheet-close").onclick = () => openSheet(null);
    $("#ss-undo").onclick = undo; $("#ss-redo").onclick = redo; $("#ss-fab-undo").onclick = undo;
    $("#ss-facing-chip").onclick = () => { if (!st.unlocked.includes("frames")) st.unlocked.push("frames"); openSheet("frames"); };
    $("#ss-frame-done").onclick = () => { st.frameSel = null; renderAll(); };
    $("#ss-chip-pixels").onclick = () => { st.chip = "pixels"; say("Kept as pixels"); renderOverlays(); };
    $("#ss-chip-shape").onclick = () => { st.chip = "shape"; say("Made into a shape. Keep as pixels restores it exactly."); renderOverlays(); };
    if (window.ResizeObserver) new ResizeObserver(() => renderCanvas()).observe(vp);
    new MutationObserver(() => { if ($("#screen-sprite-studio.active")) renderAll(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (location.hash === "#sprite-studio") renderAll();
  }

  /* ---------- capture helpers (dev only) ---------- */
  function demoHero() {
    // Draw the left half with Mirror on; the right half is written by the mirror rule.
    const W = st.W, prevMirror = st.mirror; st.mirror = true;
    const P = (x, y, s) => paintAt(x, y, s), prevPart = st.activePart;
    st.activePart = "body"; pushHist();
    const sk = SLOT(0, 1), hr = SLOT(1, 1), tu = SLOT(2, 1), cl = SLOT(3, 1), le = SLOT(4, 1);
    for (let y = 3; y <= 13; y++) for (let x = 10; x < 16; x++) {
      const inHead = (x + 0.5 - 16) ** 2 + (y + 0.5 - 8.5) ** 2 <= 30;
      if (!inHead) continue;
      P(x, y, y <= 5 || (x <= 11 && y <= 9) ? hr : sk);
    }
    for (let y = 14; y <= 22; y++) for (let x = 11; x < 16; x++) P(x, y, y === 20 ? le : tu);
    for (let y = 15; y <= 21; y++) for (let x = 8; x < 11; x++) P(x, y, y >= 20 ? sk : tu);
    for (let y = 23; y <= 28; y++) for (let x = 12; x < 15; x++) P(x, y, cl);
    for (let y = 29; y <= 30; y++) for (let x = 11; x < 15; x++) P(x, y, le);
    st.activePart = "face"; P(13, 9, SLOT(1, 0)); P(14, 11, SLOT(0, 0));
    st.mirror = false;
    st.activePart = "faceSide"; paintAt(18, 9, SLOT(1, 0)); paintAt(20, 11, SLOT(0, 0));
    st.mirror = true;
    st.activePart = "back";
    for (let y = 3; y <= 12; y++) for (let x = 10; x < 16; x++) if ((x + 0.5 - 16) ** 2 + (y + 0.5 - 8.5) ** 2 <= 30) P(x, y, SLOT(1, 1));
    for (let y = 14; y <= 23; y++) for (let x = 10; x < 16; x++) P(x, y, SLOT(2, 0));
    st.activePart = prevPart; st.mirror = prevMirror; renderAll();
  }
  window.SpriteStudio = {
    onShow,
    _cap: {
      reset() { st.started = false; st.kind = "hero"; st.pickW = 32; st.pickH = 32; st.unlocked = []; st.mirror = false; st.outline = false; st.shade = false; st.dither = "none"; st.advanced = false; st.upgraded = false; st.facing = "down"; st.sheet = null; st.lastUnlockMsg = ""; st.walkStyle = "four"; resetData(); renderAll(); },
      begin, unlock, openSheet, demoHero, setFacing, makeWalk, selectFrame, tapTool,
      touchUpFrame(dir, i) { // per-frame touch-up via the same write path as a pencil stroke
        st.frameSel = { dir, i }; pushHist();
        const s = SLOT(4, 2); [[22, 18], [23, 17], [24, 16], [25, 15], [26, 14]].forEach(([x, y]) => targetWrite(x, y, s));
        renderAll();
      },
      state: () => ({ started: st.started, W: st.W, H: st.H, tool: st.tool, unlocked: st.unlocked.slice(), mirror: st.mirror, outline: st.outline, shade: st.shade, facing: st.facing, walk: st.walk, frameSel: st.frameSel, chip: st.chip, sheet: st.sheet, hist: st.hist.length, touched: JSON.parse(JSON.stringify(st.touch)) }),
      pixelCount: (part) => st.parts[part || "body"].reduce((n, v) => n + (v ? 1 : 0), 0),
      frameDiff(dir, a, b) { const x = frameImg(dir, a), y = frameImg(dir, b); let n = 0; for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n++; return n; },
      facingDiff(a, b) { const x = composeFacing(a), y = composeFacing(b); let n = 0; for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n++; return n; },
      mirrorSymmetric(part) { const a = st.parts[part || "body"], W = st.W; for (let y = 0; y < st.H; y++) for (let x = 0; x < W; x++) if (a[y * W + x] !== a[y * W + W - 1 - x]) return false; return true; },
      outlinePixels() { const img = displayImg(); return bake(img).filter((c, i) => c && !img[i]).length; },
    },
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
