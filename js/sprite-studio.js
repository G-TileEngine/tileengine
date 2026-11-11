/* Sprite Studio — round 63 clickable prototype (UX half of ux/pixel-editor-plan.md).
   r64: opens in Basic/Advanced from profile.experience.spriteStudio (window.Experience), toolsShown filters the
   Advanced More sheet (hide only, same data), guided 'Next step' chip, empty-library starter choice.
   r63: true Basic mode for non-artists (ready-made parts, outline+shade always on, colour by part, Tidy, fixed 5-tool rail);
   Advanced = the r62 editor. Both modes write the same data (P1).
   MOCK: in-memory only, no real recipe format. Internally every stroke is a "pixelRun" of palette
   slots (no raw RGB); the UI only ever says "pixels". Outline + shade are render rules, never baked. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- r63: one colour set (ramp) per part, so the ramp index IS the part id on every pixel ---------- */
  // Each ramp: shadow (cooler/darker), base, light (warmer), line = dark-hue outline. Hue-shifted by hand.
  const R4 = (name, s, b, l, line) => ({ name, c: [s, b, l], line });
  const SWATCHES = {
    skin: [R4("Peach", "#8a4b4c", "#d08a62", "#f6c99a", "#4a2230"), R4("Fair", "#9a5a5e", "#e0a689", "#fbe0c4", "#4f2a33"), R4("Tan", "#6e3a3e", "#b06a48", "#e0a070", "#3a1c26"),
      R4("Brown", "#4a2632", "#8a5038", "#c08458", "#26121c"), R4("Deep", "#2e1828", "#5e3428", "#94603e", "#170a14"), R4("Orc green", "#2e4a3e", "#5a8a4a", "#a8c870", "#16261e")],
    hair: [R4("Brown", "#3b2140", "#6b3a3a", "#a8684a", "#1e1024"), R4("Black", "#1a1428", "#2e2a40", "#545a70", "#0c0814"), R4("Blonde", "#8a5a3a", "#d0a040", "#f6e08a", "#4a2c1e"), R4("Red", "#5a1e30", "#a8402e", "#e8784a", "#2e0e1a"),
      R4("White", "#6a6a8a", "#b8b8cc", "#f0f0f6", "#343048"), R4("Blue", "#22305e", "#3d5fa8", "#78aee0", "#121a38"), R4("Pink", "#6a2a5a", "#c05a8a", "#f0a0c0", "#34142c"), R4("Green", "#1e4a3a", "#3a8a4a", "#8ac860", "#0e261e")],
    cloth: [R4("Red", "#5a1f3d", "#a8323e", "#e8704e", "#2e0f24"), R4("Blue", "#22305e", "#3d5fa8", "#78aee0", "#121a38"), R4("Green", "#1e3e3a", "#3a7a48", "#84b860", "#0e201e"), R4("Purple", "#2e1e4e", "#5e3a8a", "#9a70c8", "#160e28"),
      R4("Gold", "#6a4a2a", "#c09030", "#f0d070", "#36241a"), R4("Grey", "#34344a", "#6a6e84", "#a8b0c0", "#1a1a28"), R4("Brown", "#3a2a3a", "#6e4a35", "#b0824e", "#1f1418"), R4("White", "#6a6a8a", "#c8c8d8", "#f6f6fa", "#343048")],
    gear: [R4("Leather", "#3a2a3a", "#6e4a35", "#b0824e", "#1f1418"), R4("Dark leather", "#241a24", "#4a3430", "#7a5a48", "#120c12"), R4("Steel", "#3a4060", "#8890a8", "#dce2ee", "#1c1e30"), R4("Red", "#5a1f3d", "#a8323e", "#e8704e", "#2e0f24"),
      R4("Black", "#1a1428", "#2e2a40", "#545a70", "#0c0814"), R4("Sand", "#6a4a2a", "#a87a4a", "#d8b07a", "#36241a")],
    metal: [R4("Steel", "#3a4060", "#8890a8", "#dce2ee", "#1c1e30"), R4("Gold", "#6a4a2a", "#c09030", "#f6e08a", "#36241a"), R4("Wood", "#3a2a3a", "#6e4a35", "#b0824e", "#1f1418"), R4("Crystal", "#2a3e6a", "#4a8ad0", "#a8e0f6", "#141e36"),
      R4("Bronze", "#5a2e2a", "#a8643a", "#e0a060", "#2e1614"), R4("Obsidian", "#1a1428", "#3a2a50", "#7a6a9a", "#0c0814")],
  };
  const PIECES = [ // Basic "colour by part" chips; index = ramp index = part id stored on every pixel
    { name: "Skin", set: "skin", def: 0 }, { name: "Hair", set: "hair", def: 0 }, { name: "Shirt", set: "cloth", def: 0 },
    { name: "Trousers", set: "cloth", def: 1 }, { name: "Boots", set: "gear", def: 0 }, { name: "Weapon", set: "metal", def: 0 },
  ];
  const P_SKIN = 0, P_HAIR = 1, P_SHIRT = 2, P_TROUSERS = 3, P_BOOTS = 4, P_WEAPON = 5;
  const defaultRamps = () => PIECES.map((p) => { const s = SWATCHES[p.set][p.def]; return { name: p.name, c: s.c.slice(), line: s.line, sw: s.name }; });
  let RAMPS = defaultRamps();
  const SLOT = (r, t) => r * 3 + t + 1; // t: 0 shadow, 1 base, 2 light
  const slotColour = (s) => (s ? RAMPS[Math.floor((s - 1) / 3)].c[(s - 1) % 3] : null);
  const slotRamp = (s) => Math.floor((s - 1) / 3);

  const KINDS = [
    { id: "hero", name: "Hero", sub: "Starter body to draw over", basicSub: "Ready-made body: pick parts", w: 32, h: 32, tpl: "hero" },
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
  // Basic: one fixed rail, nothing to unlock, no More sheet.
  const BASIC_TOOLS = [
    { id: "presets", name: "Parts", ico: "🧩" },
    { id: "bcolour", name: "Colour", ico: "" },
    { id: "pencil", name: "Pencil", ico: "✏️" },
    { id: "tidy", name: "Tidy", ico: "✨" },
    { id: "walk", name: "Walk", ico: "🚶" },
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
    mode: "basic", piece: P_SHIRT, preset: null, edited: false, tidyInfo: null, prevDir: "right",
  };
  window.__spriteStudioState = st;

  /* ---------- data ---------- */
  function blank() { return new Uint8Array(st.W * st.H); }
  function resetData() {
    st.parts = {}; PARTS.forEach((p) => (st.parts[p.id] = blank()));
    st.hist = []; st.redo = []; st.walk = null; st.touch = {}; st.frameSel = null; st.chip = null;
    RAMPS = defaultRamps(); st.tidyInfo = null; st.edited = false;
  }
  function snapshot() {
    const parts = {}; Object.keys(st.parts).forEach((k) => (parts[k] = st.parts[k].slice()));
    return { parts, ramps: JSON.stringify(RAMPS), preset: Object.assign({}, st.preset), touch: JSON.stringify(st.touch), outline: st.outline, shade: st.shade, dither: st.dither, upgraded: st.upgraded, walk: st.walk };
  }
  function restore(s) {
    st.parts = s.parts; if (s.ramps) RAMPS = JSON.parse(s.ramps); if (s.preset) st.preset = s.preset; st.touch = JSON.parse(s.touch); st.outline = s.outline; st.shade = s.shade; st.dither = s.dither; st.upgraded = s.upgraded; st.walk = s.walk;
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
    const basic = st.mode === "basic";
    const outline = opts.outline ?? (basic || st.outline), shade = opts.shade ?? (basic || st.shade), dither = opts.dither ?? (basic ? "none" : st.dither);
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
        st.hist.push(g.snap); st.redo = []; st.edited = true;
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
    r.classList.toggle("is-basic", st.mode === "basic");
    if (st.mode === "basic") {
      r.innerHTML = BASIC_TOOLS.map((t) => t.id === "bcolour"
        ? railBtn("bcolour", "Colour", `<span class="ss-swatch" style="background:${RAMPS[st.piece].c[1]}"></span>`, st.sheet === "bcolour")
        : t.id === "pencil" ? railBtn("pencil", st.tool === "eraser" ? "Eraser" : "Pencil", st.tool === "eraser" ? "⌫" : "✏️", (st.tool === "pencil" || st.tool === "eraser") && (!st.sheet || st.sheet === "pencil"))
        : railBtn(t.id, t.name, t.ico, st.sheet === t.id)).join("");
      r.classList.remove("is-crowded");
      $$("[data-ss-tool]", r).forEach((b) => (b.onclick = () => tapTool(b.dataset.ssTool)));
      return;
    }
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
    if (st.mode === "basic") {
      if (id === "pencil") {
        if ((st.tool === "pencil" || st.tool === "eraser") && !st.sheet) { openSheet("pencil"); return; }
        if (st.tool !== "eraser") st.tool = "pencil"; st.slot = SLOT(st.piece, 1); openSheet(null); say(`Pencil · drawing ${PIECES[st.piece].name.toLowerCase()}`); return;
      }
      if (id === "tidy") { tidy(); return; }
      if (["presets", "bcolour", "walk"].includes(id)) { openSheet(st.sheet === id ? null : id); return; }
      return; // nothing else exists in Basic
    }
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
  // r64: toolsShown (profile.experience) only hides tools in the More sheet; nothing is removed from the data.
  const EXTRA_TIER = { mirror: "core", frames: "core", shade: "core", outline: "core", shapes: "standard", recolour: "standard", parts: "standard", select: "all", pose: "all" };
  function shownExtra(id) {
    if (st.unlocked.includes(id)) return true;
    const t = (window.Experience && Experience.get().toolsShown) || "all";
    const rank = { core: 0, standard: 1, all: 2 };
    return rank[EXTRA_TIER[id] || "all"] <= rank[t];
  }
  // r64: guided "Next step" chip (guidance: guided). One step at a time; tap does the step.
  function nextStep() {
    if (!st.started || st.sheet || st.frameSel || st.chip) return null;
    if (!window.Experience || Experience.get().guidance !== "guided") return null;
    const coloured = RAMPS.some((r, i) => r.sw !== SWATCHES[PIECES[i].set][PIECES[i].def].name);
    if (st.mode === "basic" && st.kind === "hero") {
      if (!coloured) return { label: "Colour your hero", go: () => openSheet("bcolour") };
      if (!st.tidyInfo) return { label: "Tap Tidy to clean up", go: () => tidy() };
      if (!st.walk) return { label: "Make it walk", go: () => openSheet("walk") };
      return { label: "Save your hero", go: () => openSheet("export") };
    }
    if (!st.hist.length) return { label: "Draw with one finger", go: () => say("One finger draws. Two fingers move and zoom.") };
    if (st.kind === "hero" && !st.walk) return { label: "Make it walk", go: () => { if (!st.unlocked.includes("frames")) st.unlocked.push("frames"); openSheet("frames"); } };
    return { label: "Save your sprite", go: () => openSheet("export") };
  }
  function openSheet(id) { if (id === "more" && st.mode === "basic") id = null; st.sheet = id; renderAll(); const b = $("#ss-sheet-body"); if (b) b.scrollTop = 0; }

  function unlock(id) {
    if (st.mode === "basic") return; // Basic has nothing to unlock
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
        return `<div class="ss-sheet-head"><p class="eyebrow">Colours · one set per part · default style</p><button type="button" class="toggle" id="ss-add-colour">+ Add</button></div>
        <p class="hint ss-tight">Light on top, shadow below. Shadows lean cool, lights warm.</p>
        <div class="ss-ramps">${RAMPS.map((r, ri) => `<div class="ss-ramp"><span class="ss-ramp-name">${r.name}</span>${[2, 1, 0].map((t) => `<button type="button" class="ss-slot" data-slot="${SLOT(ri, t)}" aria-pressed="${st.slot === SLOT(ri, t)}" aria-label="${r.name} ${["shadow", "base", "light"][t]}" style="background:${r.c[t]}"></button>`).join("")}</div>`).join("")}</div>`;
      }
      case "presets": {
        if (st.kind !== "hero") return `<p class="eyebrow">Ready-made parts</p><p class="hint">Ready-made parts are for heroes in this mock. Use Pencil to draw, then Tidy.</p>`;
        return `<p class="eyebrow">Ready-made parts · tap to swap</p>
          <div class="ss-presets">${PRESET_GROUPS.map(([g, label]) => `<div class="ss-prow" role="group" aria-label="${label}"><span class="ss-prow-lbl">${label}</span><div class="ss-popts" style="--n:${PRESETS[g].length}">${PRESETS[g].map((p) =>
            `<button type="button" class="ss-popt" data-preset="${g}:${p.id}" aria-pressed="${st.preset[g] === p.id}" aria-label="${label}: ${p.name}"><canvas class="ss-pthumb" data-pthumb="${g}:${p.id}" width="${st.W}" height="${st.H}" aria-hidden="true"></canvas><span>${p.name}</span></button>`).join("")}</div></div>`).join("")}</div>
          <p class="hint ss-tight">Then pick colours, or draw over it with Pencil.</p>`;
      }
      case "bcolour": {
        const pc = PIECES[st.piece], sws = SWATCHES[pc.set];
        return `<p class="eyebrow">Colour by part · tap a part, then a colour</p>
          <div class="ss-pchips" role="group" aria-label="Part">${PIECES.map((p, i) => `<button type="button" class="ss-pchip" data-piece="${i}" aria-pressed="${st.piece === i}"><span class="ss-dot" style="background:${RAMPS[i].c[1]}" aria-hidden="true"></span>${p.name}</button>`).join("")}</div>
          <div class="ss-swatches" role="group" aria-label="${pc.name} colours">${sws.map((w) => `<button type="button" class="ss-sw" data-sw="${w.name}" aria-pressed="${RAMPS[st.piece].sw === w.name}" aria-label="${pc.name}: ${w.name}" style="background:linear-gradient(${w.c[2]} 0 34%, ${w.c[1]} 34% 67%, ${w.c[0]} 67%)"></button>`).join("")}</div>
          <p class="hint ss-tight">The whole part changes, in every frame.</p>`;
      }
      case "tidy": {
        const t = st.tidyInfo || { n: 0 };
        return `<div class="ss-sheet-head"><p class="eyebrow">Tidy · ${t.n ? "done" : "already tidy"}</p>${t.n ? `<button type="button" class="toggle" id="ss-tidy-undo">Undo Tidy</button>` : ""}</div>
          <div class="ss-preview ss-tidy-prev"><figure><canvas id="ss-tidy-before" width="${st.W}" height="${st.H}"></canvas><figcaption>Before</figcaption></figure>
          <figure><canvas id="ss-tidy-after" width="${st.W}" height="${st.H}"></canvas><figcaption>After</figcaption></figure></div>
          <p class="hint ss-tight">${t.n ? `Removed ${t.stray} stray pixel${t.stray === 1 ? "" : "s"} · filled ${t.gaps} gap${t.gaps === 1 ? "" : "s"} · ${t.mirror ? `evened ${t.even} on the other side` : "sides left as drawn (Both sides is off)"}. Weapons are never touched.` : "Nothing to fix. Draw freely, then tap Tidy again."}</p>`;
      }
      case "walk": {
        if (!st.walk) return `<p class="eyebrow">Walk · 4 directions × 4 frames</p>
          <div class="ss-walk-intro"><canvas class="ss-pthumb ss-walk-hero" id="ss-walk-hero" width="${st.W}" height="${st.H}" aria-hidden="true"></canvas>
          <p class="hint">Your hero walks down, up, left and right. You can touch up any frame later.</p></div>
          <button type="button" class="btn btn-primary ss-wide" id="ss-make-walk-basic">Make walk cycle</button>`;
        return `<div class="ss-sheet-head"><p class="eyebrow">Walking · 4 ways × 4 frames</p><button type="button" class="toggle" id="ss-touchup">Touch up frames</button></div>
          <div class="ss-preview">
            <figure><canvas id="ss-prev-day" width="96" height="64"></canvas><figcaption>Day</figcaption></figure>
            <figure><canvas id="ss-prev-night" width="96" height="64"></canvas><figcaption>Night · scene tint</figcaption></figure>
          </div>
          ${seg("Preview direction", [["down", "Down"], ["up", "Up"], ["left", "Left"], ["right", "Right"]], st.prevDir, "pdir")}`;
      }
      case "pencil":
        if (st.mode === "basic") return `<p class="eyebrow">Pencil · drawing ${PIECES[st.piece].name.toLowerCase()}</p>
          ${seg("Pencil or eraser", [["pencil", "Draw"], ["eraser", "Erase"]], st.tool, "btool")}
          ${seg("Pencil size", [[1, "1 pixel"], [2, "2 pixels"]], st.pencilSize, "pen")}
          <button type="button" class="toggle ss-wide-toggle" id="ss-both" aria-pressed="${st.mirror}">${st.mirror ? "✓ " : ""}Both sides (draw once, mirror the other side)</button>
          <p class="hint ss-tight">Outline and shading are added for you. Change part in Colour.</p>`;
        return `<p class="eyebrow">Pencil</p>${seg("Pencil size", [[1, "1 pixel"], [2, "2 pixels"], [3, "3 pixels"]], st.pencilSize, "pen")}
        <p class="hint">Hard edges only: every pixel is solid. There's no soft brush.</p>`;
      case "more":
        return `<div class="ss-sheet-head"><p class="eyebrow">More tools · tap to add to your bar</p><button type="button" class="toggle" id="ss-open-preview">Preview</button></div>
        <p class="hint ss-tight" id="ss-unlock-msg" role="status">${st.lastUnlockMsg || "Nothing is locked for good. Tools appear when you need them."}</p>
        <div class="ss-extra-grid">${EXTRA.filter((t) => shownExtra(t.id)).map((t) => { const on = st.unlocked.includes(t.id);
          return `<button type="button" class="ss-extra ${on ? "is-on" : "is-locked"}" data-extra="${t.id}" aria-label="${t.name}: ${t.hint}${on ? " (on your bar)" : ""}">
            <span class="ss-extra-name"><span aria-hidden="true">${on ? "✓" : "🔒"}</span> ${t.name}</span><span class="ss-extra-hint">${on ? "On your bar" : t.hint}</span></button>`; }).join("")}</div>
        ${EXTRA.some((t) => !shownExtra(t.id)) ? `<p class="hint ss-tight">${EXTRA.filter((t) => !shownExtra(t.id)).length} more tools are tucked away. Show them in Settings › My setup.</p>` : ""}`;
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
          <div class="sheet-row wrap"><button type="button" class="btn btn-ghost" data-swap="2:3">Shirt ⇄ Trousers</button><button type="button" class="btn btn-ghost" data-swap="1:4">Hair ⇄ Boots</button></div>
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
        return `<p class="eyebrow">Save · ${KINDS.find((k) => k.id === st.kind).name} ${st.W}×${st.H} · ${n} frame${n > 1 ? "s" : ""} · ${colourCount()} colours</p>
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
    $$("[data-preset]", b).forEach((x) => (x.onclick = () => { const [g, v] = x.dataset.preset.split(":"); pickPreset(g, v); }));
    $$("[data-pthumb]", b).forEach((cv) => { const [g, v] = cv.dataset.pthumb.split(":"); const L = buildHero(Object.assign({}, st.preset, { [g]: v }), st.W, st.H);
      const img = new Uint8Array(st.W * st.H); ["body", "face"].forEach((k) => L[k].forEach((v2, i) => { if (v2) img[i] = v2; })); drawSmall(cv, img); });
    $$("[data-piece]", b).forEach((x) => (x.onclick = () => { st.piece = +x.dataset.piece; st.slot = SLOT(st.piece, 1); say(`${PIECES[st.piece].name} picked`); renderAll(); }));
    $$("[data-sw]", b).forEach((x) => (x.onclick = () => recolourPiece(st.piece, x.dataset.sw)));
    $$("[data-btool]", b).forEach((x) => (x.onclick = () => { st.tool = x.dataset.btool; st.slot = SLOT(st.piece, 1); renderAll(); }));
    $("#ss-both") && ($("#ss-both").onclick = () => { st.mirror = !st.mirror; say(st.mirror ? "Both sides on" : "Both sides off"); renderAll(); });
    $("#ss-tidy-undo") && ($("#ss-tidy-undo").onclick = () => { undo(); st.tidyInfo = null; openSheet(null); });
    if (id === "tidy" && st.tidyInfo) { drawSmall($("#ss-tidy-before"), st.tidyInfo.before); drawSmall($("#ss-tidy-after"), st.tidyInfo.after); }
    $("#ss-walk-hero") && drawSmall($("#ss-walk-hero"), composeFacing("down"));
    $("#ss-make-walk-basic") && ($("#ss-make-walk-basic").onclick = () => { st.walkStyle = "four"; makeWalk(); });
    $("#ss-touchup") && ($("#ss-touchup").onclick = () => openSheet("frames"));
    $$("[data-pdir]", b).forEach((x) => (x.onclick = () => { st.prevDir = x.dataset.pdir; renderAll(); }));
    if (id === "upgrade") {
      drawSmall($("#ss-up-before"), composeFacing(st.facing));
      drawSmall($("#ss-up-after"), composeFacing(st.facing), { outline: true, shade: true });
      $("#ss-up-yes").onclick = () => { pushHist(); st.outline = true; st.shade = true; st.upgraded = true; if (!st.unlocked.includes("outline")) st.unlocked.push("outline"); openSheet(null); toast("Look updated · one undo step"); };
      $("#ss-up-no").onclick = () => openSheet(null);
    }
    if (id === "preview" || (id === "walk" && st.walk)) startPreview(); else stopPreview();
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
    const t = RAMPS[a]; RAMPS[a] = Object.assign({}, RAMPS[c], { name: RAMPS[a].name }); RAMPS[c] = Object.assign({}, t, { name: RAMPS[c].name });
    renderAll(); toast("Recoloured everywhere · one undo step");
  }
  function colourCount() { const seen = new Set(); Object.values(st.parts).forEach((arr) => arr.forEach((v) => v && seen.add(v))); return seen.size; }

  /* ---------- r63 Basic: ready-made hero parts (code-drawn on the 32×32 grid; every pixel carries its part id) ---------- */
  const PRESETS = {
    body: [{ id: "classic", name: "Classic" }, { id: "sturdy", name: "Sturdy" }, { id: "small", name: "Small" }],
    hair: [{ id: "short", name: "Short" }, { id: "long", name: "Long" }, { id: "spiky", name: "Spiky" }, { id: "none", name: "None" }],
    outfit: [{ id: "tunic", name: "Tunic" }, { id: "armour", name: "Armour" }, { id: "robe", name: "Robe" }],
    weapon: [{ id: "sword", name: "Sword" }, { id: "staff", name: "Staff" }, { id: "bow", name: "Bow" }, { id: "none", name: "None" }],
  };
  const PRESET_GROUPS = [["body", "Body"], ["hair", "Hair"], ["outfit", "Outfit"], ["weapon", "Weapon"]];
  const DEFAULT_PRESET = { body: "classic", hair: "short", outfit: "tunic", weapon: "sword" };
  const BODY = {
    classic: { cy: 8, r2: 26, tx: 12, ty0: 14, ty1: 21, ax: 9, legX: 12, legY1: 28, footX: 11 },
    sturdy: { cy: 8, r2: 26, tx: 11, ty0: 14, ty1: 21, ax: 8, legX: 11, legY1: 28, footX: 10 },
    small: { cy: 9, r2: 40, tx: 12, ty0: 16, ty1: 22, ax: 10, legX: 12, legY1: 28, footX: 11 },
  };
  function buildHero(preset, W = 32, H = 32) {
    const L = {}; PARTS.forEach((p) => (L[p.id] = new Uint8Array(W * H)));
    const m = BODY[preset.body] || BODY.classic;
    const set = (layer, x, y, piece, tone = 1) => { if (x >= 0 && y >= 0 && x < W && y < H) L[layer][y * W + x] = SLOT(piece, tone); };
    const sym = (layer, x, y, piece, tone) => { set(layer, x, y, piece, tone); set(layer, W - 1 - x, y, piece, tone); };
    const box = (layer, x0, x1, y0, y1, piece) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) sym(layer, x, y, piece); };
    const inHead = (x, y) => (x + 0.5 - 16) ** 2 + (y + 0.5 - (m.cy + 0.5)) ** 2 <= m.r2;
    let headTop = 99, headL = 99;
    for (let y = 0; y < H; y++) for (let x = 0; x < 16; x++) if (inHead(x, y)) { headTop = Math.min(headTop, y); headL = Math.min(headL, x); }
    // body (skin silhouette)
    for (let y = 0; y < H; y++) for (let x = 0; x < 16; x++) if (inHead(x, y)) { sym("body", x, y, P_SKIN); sym("back", x, y, P_HAIR); }
    box("body", 15, 15, m.ty0 - 1, m.ty0 - 1, P_SKIN);
    box("body", m.tx, 15, m.ty0, m.ty1, P_SKIN);
    box("body", m.ax, m.tx - 1, m.ty0, m.ty1, P_SKIN);
    box("body", m.legX, 14, m.ty1 + 1, m.legY1, P_SKIN);
    box("body", 15, 15, m.ty1 + 1, m.ty1 + 2, P_SKIN);
    box("body", m.footX, 14, m.legY1 + 1, m.legY1 + 2, P_BOOTS);
    // outfit
    const hands = m.ty1 - 1;
    if (preset.outfit === "tunic") {
      box("body", m.tx, 15, m.ty0, m.ty1 + 2, P_SHIRT); box("body", m.ax, m.tx - 1, m.ty0, hands - 1, P_SHIRT);
      box("body", m.tx, 15, m.ty1 - 1, m.ty1 - 1, P_BOOTS);
      box("body", m.legX, 14, m.ty1 + 3, m.legY1, P_TROUSERS); box("body", m.legX, 14, m.legY1, m.legY1, P_BOOTS);
    } else if (preset.outfit === "armour") {
      box("body", m.tx, 15, m.ty0, m.ty1, P_SHIRT); box("body", m.ax, m.tx - 1, m.ty0, hands - 1, P_SHIRT);
      box("body", m.ax - 1, m.tx - 1, m.ty0, m.ty0 + 1, P_SHIRT); // shoulder pads
      box("body", m.tx, 15, m.ty1, m.ty1, P_BOOTS);
      box("body", m.legX, 14, m.ty1 + 1, m.legY1, P_TROUSERS); box("body", m.legX, 14, m.legY1 - 2, m.legY1, P_BOOTS);
    } else { // robe: covers the legs; trousers colour becomes the hem trim
      box("body", m.tx, 15, m.ty0, m.legY1, P_SHIRT); box("body", m.ax, m.tx - 1, m.ty0, hands - 1, P_SHIRT);
      box("body", m.legX - 1, m.tx - 1, m.ty1 + 1, m.legY1, P_SHIRT);
      box("body", m.legX - 1, 15, m.legY1 - 1, m.legY1, P_TROUSERS); box("body", m.tx, 15, m.ty1 - 1, m.ty1 - 1, P_TROUSERS);
    }
    // hair (front view on body, full head on back)
    if (preset.hair !== "none") {
      for (let y = 0; y < H; y++) for (let x = 0; x < 16; x++) if (inHead(x, y) && (y <= m.cy - 2 || (x <= headL + 1 && y <= m.cy))) sym("body", x, y, P_HAIR);
      if (preset.hair === "long") for (let y = m.cy - 3; y <= m.cy + 6; y++) { sym("body", headL - 1, y, P_HAIR); sym("body", headL, y, P_HAIR); sym("back", headL - 1, y, P_HAIR); sym("back", headL, y, P_HAIR); }
      if (preset.hair === "long") for (let y = m.ty0; y <= m.ty0 + 4; y++) for (let x = headL; x < 16; x++) sym("back", x, y, P_HAIR);
      if (preset.hair === "spiky") { // a centre tuft on the crown + one spike each side, 2px apart so Tidy keeps them
        const rowL = (y) => { for (let x = 0; x < 16; x++) if (inHead(x, y)) return x; return 16; };
        [[rowL(headTop), headTop - 2, headTop - 1], [rowL(headTop + 1) - 1, headTop - 1, headTop]].forEach(([x, y0, y1]) => { for (let y = y0; y <= y1; y++) { sym("body", x, y, P_HAIR); sym("back", x, y, P_HAIR); } });
      }
    } else for (let y = 0; y < H; y++) for (let x = 0; x < 16; x++) if (inHead(x, y)) sym("back", x, y, P_SKIN);
    // face: front eyes (both), side face (one eye) · dark tone of the hair set
    sym("face", 13, m.cy + 1, P_HAIR, 0);
    set("faceSide", 19, m.cy + 1, P_HAIR, 0);
    // weapon (one hand only, never mirrored)
    const wx = W - m.ax, hy = m.ty1;
    if (preset.weapon === "sword") { for (let y = hy - 11; y <= hy - 2; y++) set("body", wx, y, P_WEAPON); for (let x = wx - 1; x <= wx + 1; x++) set("body", x, hy - 1, P_WEAPON); set("body", wx, hy, P_WEAPON); set("body", wx, hy + 1, P_WEAPON); }
    else if (preset.weapon === "staff") { for (let y = hy - 14; y <= Math.min(H - 2, hy + 8); y++) set("body", wx, y, P_WEAPON); for (let x = wx - 1; x <= wx + 1; x++) for (let y = hy - 17; y <= hy - 15; y++) set("body", x, y, P_WEAPON); }
    else if (preset.weapon === "bow") { [[0, -6], [1, -5], [2, -4], [2, -3], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [1, 3], [0, 4]].forEach(([dx, dy]) => set("body", wx + dx, hy - 1 + dy, P_WEAPON)); }
    // settle the drawing so Tidy on an untouched preset changes nothing (chin corners, hair edges)
    const sw = st.W, sh = st.H; st.W = W; st.H = H;
    ["body", "back"].forEach((k) => { for (let n = 0; n < 4; n++) { const r = tidyLayer(L[k], false); L[k] = r.a; if (!r.stray && !r.gaps) break; } });
    st.W = sw; st.H = sh;
    return L;
  }
  function applyPreset() {
    const L = buildHero(st.preset, st.W, st.H);
    Object.keys(L).forEach((k) => (st.parts[k] = L[k]));
  }
  function pickPreset(group, id) {
    if (st.preset[group] === id) return;
    pushHist(); st.preset = Object.assign({}, st.preset, { [group]: id });
    const hadEdits = st.edited; applyPreset(); st.edited = false; st.walk = st.walk ? st.walk : null; st.touch = {};
    const name = PRESETS[group].find((p) => p.id === id).name;
    say(`${group[0].toUpperCase() + group.slice(1)}: ${name}`);
    if (hadEdits) toast("Parts swapped. Your pencil touch-ups were replaced · Undo brings them back");
    renderAll();
  }
  function recolourPiece(piece, swName) {
    const sw = SWATCHES[PIECES[piece].set].find((s) => s.name === swName); if (!sw) return;
    pushHist(); RAMPS[piece] = { name: PIECES[piece].name, c: sw.c.slice(), line: sw.line, sw: sw.name };
    st.piece = piece; st.slot = SLOT(piece, 1);
    say(`${PIECES[piece].name} is now ${sw.name.toLowerCase()}`); renderAll();
  }

  /* ---------- r63 Tidy: strays out, 1px gaps filled, left/right evened (only when Both sides is on) ---------- */
  function tidyLayer(a, evenSides) {
    const W = st.W, H = st.H, isW = (s) => s && slotRamp(s) === P_WEAPON;
    const at = (b, x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : b[y * W + x]);
    let stray = 0, gaps = 0, even = 0;
    let b = a.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const s = a[y * W + x]; if (!s || isW(s)) continue;
      let n8 = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && at(a, x + dx, y + dy)) n8++;
      if (n8 === 0) { b[y * W + x] = 0; stray++; continue; }
      const o4 = [at(a, x, y - 1), at(a, x - 1, y), at(a, x + 1, y), at(a, x, y + 1)];
      if (o4.every((v) => v && slotRamp(v) !== slotRamp(s))) { // a lone speck of another colour inside a part
        const cnt = {}; o4.forEach((v) => (cnt[slotRamp(v)] = (cnt[slotRamp(v)] || 0) + 1));
        const [r, n] = Object.entries(cnt).sort((p, q) => q[1] - p[1])[0];
        if (n >= 3) { b[y * W + x] = SLOT(+r, 1); stray++; }
      }
    }
    a = b; b = a.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (a[y * W + x]) continue;
      const u = at(a, x, y - 1), l = at(a, x - 1, y), r = at(a, x + 1, y), d = at(a, x, y + 1);
      const o4 = [u, l, r, d].filter((v) => v && !isW(v));
      const same = (p, q) => p && q && !isW(p) && slotRamp(p) === slotRamp(q);
      let fill = 0;
      if (o4.length >= 3) { const cnt = {}; o4.forEach((v) => (cnt[slotRamp(v)] = (cnt[slotRamp(v)] || 0) + 1)); fill = SLOT(+Object.entries(cnt).sort((p, q) => q[1] - p[1])[0][0], 1); }
      else if (same(l, r)) fill = SLOT(slotRamp(l), 1); else if (same(u, d)) fill = SLOT(slotRamp(u), 1);
      if (fill) { b[y * W + x] = fill; gaps++; }
    }
    a = b;
    if (evenSides) {
      b = a.slice();
      for (let y = 0; y < H; y++) for (let x = 0; x < W / 2; x++) {
        const i = y * W + x, j = y * W + (W - 1 - x), p = a[i], q = a[j];
        if (isW(p) || isW(q)) continue;
        if (p && !q) { b[j] = p; even++; } else if (q && !p) { b[i] = q; even++; }
      }
      a = b;
    }
    return { a, stray, gaps, even };
  }
  function tidy() {
    const before = composeFacing(st.facing);
    const snap = snapshot(); let stray = 0, gaps = 0, even = 0;
    ["body", "back"].forEach((k) => { for (let pass = 0; pass < 4; pass++) { const r = tidyLayer(st.parts[k], st.mirror); st.parts[k] = r.a; stray += r.stray; gaps += r.gaps; even += r.even; if (!(r.stray + r.gaps + r.even)) break; } });
    const n = stray + gaps + even;
    if (n) { st.hist.push(snap); if (st.hist.length > 60) st.hist.shift(); st.redo = []; }
    st.tidyInfo = { before, after: composeFacing(st.facing), stray, gaps, even, n, mirror: st.mirror };
    say(n ? `Tidied: ${stray} stray, ${gaps} gaps filled, ${even} evened` : "Already tidy");
    openSheet("tidy");
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
        const pd = st.sheet === "walk" ? st.prevDir : "right";
        const dir = st.walk ? pd : null, n = st.walk ? WALK_STYLES[st.walk].frames.length : 1;
        const fi = prevTick % n;
        const img = dir ? frameImg(dir, fi) : composeFacing("side");
        const run = ((prevTick * 2 + 32 + st.W) % (96 + st.W)) - st.W;
        const x0 = reduce || pd === "down" || pd === "up" ? 32 : pd === "left" ? 96 - st.W - run : run, y0 = 60 - st.H;
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
    const lib = window.Experience ? Experience.library() : { empty: false };
    el.innerHTML = `${lib.empty ? `<div class="ss-empty-lib" role="group" aria-label="Your library is empty">
        <p class="ss-empty-title">Your library is empty</p>
        <p class="hint ss-tight">Start with something ready-made, or draw your own below.</p>
        <div class="ss-empty-row"><button type="button" class="btn btn-ghost" id="ss-lib-make">Make some for me</button><button type="button" class="btn btn-ghost" id="ss-lib-pack">Starter Pack · free</button></div>
      </div>` : ""}<h2 class="ss-start-title">What are you making?</h2>
      <div class="ss-kinds" role="group" aria-label="Sprite kind">${KINDS.map((k) => `<button type="button" class="choice ss-kind" data-kind="${k.id}" aria-pressed="${st.kind === k.id}"><span class="label">${k.name}</span><span class="sub">${st.mode === "basic" && k.basicSub ? k.basicSub : k.sub}</span></button>`).join("")}</div>
      <p class="ss-licence">Starter body: Made by TileEngine · free to use</p>
      ${st.mode === "basic" ? `<p class="hint ss-tight">Basic: ${st.pickW}×${st.pickH}, outline and shading done for you. Sizes are in Advanced.</p>` : `<p class="eyebrow">Width · ${PROJECT_TILE} suggested from your tiles</p>
      ${seg("Width", SIZES.map((s) => [s, String(s)]), st.pickW, "pw")}
      <p class="eyebrow" style="margin-top:8px">Height · can be taller than wide</p>
      ${seg("Height", heights.map((s) => [s, String(s)]), st.pickH, "ph")}`}
      <button type="button" class="btn btn-primary ss-wide" id="ss-start-go">${st.mode === "basic" && st.kind === "hero" ? "Start with a ready-made hero" : `Start drawing · ${st.pickW}×${st.pickH}`}</button>`;
    $$("[data-kind]", el).forEach((b) => (b.onclick = () => { const k = KINDS.find((x) => x.id === b.dataset.kind); st.kind = k.id; st.pickW = k.w; st.pickH = k.h; renderStart(); }));
    $$("[data-pw]", el).forEach((b) => (b.onclick = () => { st.pickW = +b.dataset.pw; if (st.pickH < st.pickW) st.pickH = st.pickW; renderStart(); }));
    $$("[data-ph]", el).forEach((b) => (b.onclick = () => { st.pickH = +b.dataset.ph; renderStart(); }));
    $("#ss-start-go").onclick = () => begin(st.kind, st.pickW, st.pickH);
    $("#ss-lib-make") && ($("#ss-lib-make").onclick = () => Experience.openStarter("make", "sprite-studio"));
    $("#ss-lib-pack") && ($("#ss-lib-pack").onclick = () => Experience.openStarter("pack", "sprite-studio"));
  }
  function begin(kind, w, h) {
    const k = KINDS.find((x) => x.id === kind);
    st.kind = kind; st.W = w; st.H = h; st.tpl = k.tpl; st.started = true; st.zoom = 1; st.panX = st.panY = 0;
    st.tool = "pencil"; st.sheet = null; resetData();
    if (st.mode === "basic" && kind === "hero") {
      st.preset = Object.assign({}, DEFAULT_PRESET); st.tpl = null; st.mirror = true; st.piece = P_SHIRT; st.slot = SLOT(P_SHIRT, 1);
      applyPreset(); openSheet("presets"); say("Ready-made hero. Tap parts to swap them."); return;
    }
    if (st.mode === "basic") { st.mirror = true; st.slot = SLOT(P_SHIRT, 1); }
    renderAll();
    say(`${k.name} canvas ${w} by ${h}. One finger draws.`);
  }

  function setMode(m) {
    if (st.mode === m) return;
    st.mode = m;
    if (m === "advanced") { // keep the look: Basic's always-on rules become real toggles, already on
      st.outline = true; st.shade = true; ["outline", "shade"].forEach((id) => { if (!st.unlocked.includes(id)) st.unlocked.push(id); });
      if (st.sheet && ["presets", "bcolour", "tidy", "walk"].includes(st.sheet)) st.sheet = st.sheet === "bcolour" ? "colour" : st.sheet === "walk" ? "frames" : null;
      toast("Advanced: every tool, same drawing. Outline and Shade are on your bar.");
    } else {
      if (st.tool === "fill") st.tool = "pencil";
      if (st.sheet && !["pencil", "frames"].includes(st.sheet)) st.sheet = st.sheet === "colour" ? "bcolour" : null;
      toast("Basic: outline and shading are always on. Same drawing.");
    }
    if (!st.started) { const k = KINDS.find((x) => x.id === st.kind); if (m === "basic") { st.pickW = k.w; st.pickH = k.h; } }
    say(m === "basic" ? "Basic mode" : "Advanced mode"); renderAll();
  }
  function renderTop() {
    $$("[data-ss-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ssMode === st.mode)));
    const t = $("#ss-title"); if (t) t.textContent = st.started ? (st.mode === "basic" ? KINDS.find((k) => k.id === st.kind).name : `${KINDS.find((k) => k.id === st.kind).name} ${st.W}×${st.H}`) : (st.mode === "basic" ? "New" : "New sprite");
    const u = $("#ss-upgrade"); if (u) u.hidden = !st.started || st.upgraded || st.mode === "basic" || (st.outline && st.shade);
    const e = $("#ss-export-btn"); if (e) e.hidden = !st.started;
    const h = $("#ss-help-btn"); if (h) h.setAttribute("aria-pressed", String(st.sheet === "help"));
  }
  function renderOverlays() {
    const nx = $("#ss-next"); if (nx) { const n = nextStep(); nx.hidden = !n; if (n) { $("#ss-next-text").textContent = n.label; nx.onclick = () => { n.go(); }; nx.setAttribute("aria-label", "Next step: " + n.label); } }
    const rb = $("#ss-rules-badge"); if (rb) rb.hidden = !st.started || st.mode !== "basic" || !!st.frameSel;
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
    // r64: before a drawing starts, the user's setup decides Basic or Advanced (they can still flip it here).
    if (!st.started && !st.userMode && window.Experience) {
      const m = Experience.modeFor("spriteStudio");
      if (m !== st.mode) { st.mode = m; const k = KINDS.find((x) => x.id === st.kind); if (m === "basic") { st.pickW = k.w; st.pickH = k.h; } }
      if (m === "advanced" && Experience.get().startWith === "blank" && st.kind === "hero") st.kind = "blank";
    }
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
    $$("[data-ss-mode]").forEach((b) => (b.onclick = () => { st.userMode = true; setMode(b.dataset.ssMode); }));
    $("#ss-undo").onclick = undo; $("#ss-redo").onclick = redo; $("#ss-fab-undo").onclick = undo;
    $("#ss-facing-chip").onclick = () => { if (st.mode !== "basic" && !st.unlocked.includes("frames")) st.unlocked.push("frames"); openSheet("frames"); };
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
  /* ---------- r64: thumbnails for the starter screens (same parts + render rules, nothing stored) ---------- */
  function drawThumb(img, W, H, ramps, canvas) {
    const sw = st.W, sh = st.H, sr = RAMPS, sm = st.mode; st.W = W; st.H = H; RAMPS = ramps; st.mode = "basic";
    const out = bake(img, { outline: true, shade: true, dither: "none" });
    st.W = sw; st.H = sh; RAMPS = sr; st.mode = sm;
    canvas.width = W; canvas.height = H; const c = canvas.getContext("2d"); c.clearRect(0, 0, W, H);
    out.forEach((col, i) => { if (col) { c.fillStyle = col; c.fillRect(i % W, Math.floor(i / W), 1, 1); } });
  }
  function heroThumb(preset, colours, canvas) {
    const L = buildHero(preset, 32, 32), img = new Uint8Array(32 * 32);
    ["body", "face"].forEach((k) => L[k].forEach((v, i) => { if (v) img[i] = v; }));
    const ramps = PIECES.map((p, i) => { const s = SWATCHES[p.set].find((x) => x.name === (colours || {})[p.name]) || SWATCHES[p.set][p.def]; return { name: p.name, c: s.c.slice(), line: s.line, sw: s.name }; });
    drawThumb(img, 32, 32, ramps, canvas);
  }
  function rampThumb(img, W, H, swatchList, canvas) { // swatchList: [{set, name}] -> ramp i
    drawThumb(img, W, H, swatchList.map((x) => { const s = SWATCHES[x.set].find((y) => y.name === x.name) || SWATCHES[x.set][0]; return { name: s.name, c: s.c.slice(), line: s.line, sw: s.name }; }), canvas);
  }
  window.SpriteStudio = {
    onShow, heroThumb, rampThumb,
    parts: { PRESETS, PIECES, SWATCHES },
    _cap: {
      setMode, pickPreset, recolourPiece, tidy, buildHero,
      tidyCheck() { return ["body", "back"].map((k) => { const r = tidyLayer(st.parts[k], st.mirror); return r.stray + r.gaps + r.even; }).reduce((p, q) => p + q, 0); },
      allPresetsTidy() { const out = []; for (const b of PRESETS.body) for (const h of PRESETS.hair) for (const o of PRESETS.outfit) for (const w of PRESETS.weapon) {
        const L = buildHero({ body: b.id, hair: h.id, outfit: o.id, weapon: w.id }, 32, 32); const n = ["body", "back"].map((k) => { const r = tidyLayer(L[k], true); return r.stray + r.gaps + r.even; }).reduce((p, q) => p + q, 0);
        if (n) out.push(`${b.id}/${h.id}/${o.id}/${w.id}:${n}`); } return out; },
      tidyDiff(preset) { const L = buildHero(preset, 32, 32), out = []; ["body", "back"].forEach((k) => { const r = tidyLayer(L[k], true); r.a.forEach((v, i) => { if (v !== L[k][i]) out.push(`${k}:${i % 32},${Math.floor(i / 32)} ${L[k][i]}->${v}`); }); }); return out; },
      rampsUsed: () => RAMPS.map((r) => r.sw),
      bakedColours() { const c = new Set(bake(displayImg()).filter(Boolean)); return c.size; },
      reset() { st.userMode = false; st.mode = "basic"; st.preset = Object.assign({}, DEFAULT_PRESET); st.piece = P_SHIRT; st.prevDir = "right"; st.started = false; st.kind = "hero"; st.pickW = 32; st.pickH = 32; st.unlocked = []; st.mirror = false; st.outline = false; st.shade = false; st.dither = "none"; st.advanced = false; st.upgraded = false; st.facing = "down"; st.sheet = null; st.lastUnlockMsg = ""; st.walkStyle = "four"; resetData(); renderAll(); },
      begin, unlock, openSheet, demoHero, setFacing, makeWalk, selectFrame, tapTool,
      touchUpFrame(dir, i) { // per-frame touch-up via the same write path as a pencil stroke
        st.frameSel = { dir, i }; pushHist();
        const s = SLOT(4, 2); [[22, 18], [23, 17], [24, 16], [25, 15], [26, 14]].forEach(([x, y]) => targetWrite(x, y, s));
        renderAll();
      },
      state: () => ({ mode: st.mode, preset: Object.assign({}, st.preset), piece: st.piece, tidy: st.tidyInfo && { stray: st.tidyInfo.stray, gaps: st.tidyInfo.gaps, even: st.tidyInfo.even }, started: st.started, W: st.W, H: st.H, tool: st.tool, unlocked: st.unlocked.slice(), mirror: st.mirror, outline: st.outline, shade: st.shade, facing: st.facing, walk: st.walk, frameSel: st.frameSel, chip: st.chip, sheet: st.sheet, hist: st.hist.length, touched: JSON.parse(JSON.stringify(st.touch)) }),
      pixelCount: (part) => st.parts[part || "body"].reduce((n, v) => n + (v ? 1 : 0), 0),
      frameDiff(dir, a, b) { const x = frameImg(dir, a), y = frameImg(dir, b); let n = 0; for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n++; return n; },
      facingDiff(a, b) { const x = composeFacing(a), y = composeFacing(b); let n = 0; for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n++; return n; },
      mirrorSymmetric(part) { const a = st.parts[part || "body"], W = st.W; for (let y = 0; y < st.H; y++) for (let x = 0; x < W; x++) if (a[y * W + x] !== a[y * W + W - 1 - x]) return false; return true; },
      outlinePixels() { const img = displayImg(); return bake(img).filter((c, i) => c && !img[i]).length; },
    },
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
