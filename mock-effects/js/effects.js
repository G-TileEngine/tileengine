/* TileEngine — Effect Designer mock. No game logic; effects are presentation only.
   Knob ids come from the shared catalogue mirror (../data/behaviours.json, catalogue_rev 9, behaviour `effect`).
   rev 9/10: effect.picture (ref asset, "none" = stock blade), steps[].picture (asset | null), cue_name (text),
   ui_derived speed / count, preset display_name / blurb / recipe / look; rev 10: steps[].anchor (caster | target) with
   {dc, dr} point offsets, rotate_with_facing, scale_snap, booth_cols / booth_rows / booth_caster / booth_foe. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;

  // ---------- UI copy (plain labels; catalogue ids stay hidden) ----------
  const PRESET_UI = {
    "btf-purple-drop": ["Purple Drop", "A purple blade drops onto the target."],
    "btf-holy-blade": ["Holy Blade", "A gold sword falls from above."],
    "btf-cut": ["Cut", "The purple cut, dropped on the target."],
    "btf-wrath-cone": ["Wrath Cone", "A fan slash climbing toward the foe."],
    "btf-heaven-sword": ["Heaven Sword", "A great sword drops from the sky."],
    "btf-chain-hook": ["Chain Hook", "Hook the foe and reel them in."],
    "btf-feather": ["Feather", "A feather floats down onto the target."],
    "btf-spike": ["Earth Spike", "A spike lands on the target."],
    "btf-spin-fly-together": ["Spin, Fly Together", "Blades circle you, then fly as one."],
    "btf-spin-split": ["Spin, Split", "Blades circle you, then curve apart."],
  };
  const KIND_UI = {
    straight: ["Straight line", "Flies to the target"], swerve: ["Swerve", "Bends off the straight line"],
    trace: ["Trace", "Follows a path you draw"], row: ["Row of them", "Copies fly side by side"],
    orbit: ["Spin around you", "Blades circle the caster"], cone: ["Cone slash", "A fan toward the foe"],
    reel: ["Hook and reel", "Hooks and pulls the foe"], bounce: ["Bounce", "Hits tiles in order"],
    scratch: ["Scratch line", "A slash line that fades"],
  };
  const STOCK_UI = { cut: "Cut", holy: "Holy blade", wrath: "Wrath blade", heaven: "Heaven sword", chain: "Chain", feather: "Feather", spike: "Spike" };
  const TINTS = ["#f4f0ff", "#a855f7", "#7e22ce", "#e6c34a", "#f472b6", "#c42822", "#3b82f6", "#f97316", "#ece7dc"]; // spec.ts TINTS
  const GLOWS = ["#e9d5ff", "#f5d0fe", "#fde68a", "#fecdd3", "#bfdbfe", "#fed7aa", "#ffffff"]; // spec.ts GLOWS
  const SPEEDS = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 2];
  const SPEED_WORDS = ["Very slow", "Slow", "A bit slow", "As designed", "A bit fast", "Fast", "Very fast"];
  const TILE_PX = 64; // project tile size in this mock (Mobile default)
  const PIC_PX = 16;  // stock stand-in pictures are 16 px pixel art

  const S = {
    cat: null, eff: null, knobs: {}, presets: [], owners: [],
    work: null, past: [], future: [], editKey: null, editAt: 0,
    saved: [], sprites: [], assign: {},
    returnTo: null, pickPreset: null, openStep: null, picPick: null, upload: null,
    stageOv: {}, ph: [], confirmDel: null, gm: null,
    unitSprites: true, // mock: does the project have unit sprites? (CoS call: use them; shapes otherwise)
    useOn: new Set(), freeze: null, speedIdx: 3, previewRate: 1, advOpen: {}, tab: "simple",
  };
  window.__fx = { S };

  // ---------- catalogue ----------
  // Preview board default comes from the catalogue (rev 12 booth_*: 2 × 2, caster {c:0,r:1}, foe {c:1,r:1}; rows run downward).
  // CoS call (reversible), 2026-11-09: flat effects use 2 × 1 instead (the catalogue: "recommended for flat effects").
  // The flat board is derived from the catalogue defaults with one row. Set FLAT_FALLBACK = false to always use the catalogue board.
  const FLAT_FALLBACK = true;
  const FLAT_KINDS = ["straight", "reel", "scratch"];
  // Flat = nothing in the recipe moves up or down: no drop, no ring/row/cone/swerve, no point off the caster's row.
  function isFlat(v) {
    if (v.spawn === "drop-on-tile") return false;
    const offRow = (q) => !!q && (Array.isArray(q) ? q.some(offRow) : (q.dr || 0) !== 0);
    return (v.steps || []).every((f) => FLAT_KINDS.includes(f.kind) && !(f.kind === "straight" && f.lock === "free") &&
      !offRow(f.reel_tie) && !offRow(f.reel_land) && !offRow(f.reel_links) && !offRow(f.trace_points) && !offRow(f.bounce_points));
  }
  function applyBoardDefault(v) {
    if (!FLAT_FALLBACK || !isFlat(v)) return v; // v already holds the catalogue booth_* defaults
    v.booth_rows = 1; v.booth_caster = Object.assign({}, v.booth_caster, { r: 0 }); v.booth_foe = Object.assign({}, v.booth_foe, { r: 0 });
    return v;
  }
  function knobDefaults() {
    const v = {};
    for (const k of S.eff.knobs) v[k.id] = clone(k.default);
    if (!("picture" in v)) v.picture = "none";
    if (!("cue_name" in v)) v.cue_name = ""; delete v.cue; // rev 9: cue (list) retired -> cue_name (text) // L32 (mock only): assetId or "none" = the stock blade
    return v;
  }
  function presetValues(pid) {
    const v = knobDefaults();
    const p = S.presets.find((x) => x.id === pid);
    if (p) for (const [k, val] of Object.entries(p.overrides)) v[k] = clone(val);
    const setsBoard = p && Object.keys(p.overrides).some((k) => k.startsWith("booth_"));
    return setsBoard ? v : applyBoardDefault(v);
  }
  function stepItemDefaults() { const it = S.knobs.steps.item; const o = {}; for (const f in it) o[f] = clone(it[f].default); return o; }
  function newStep(kind, idx) { return Object.assign({ id: "step-" + (idx + 1), label: "Step " + (idx + 1) }, stepItemDefaults(), { kind }); }
  function itemSpec(f) { return S.knobs.steps.item[f]; }
  function presetOf(pid) { return S.presets.find((p) => p.id === pid); }
  function presetName(pid) { const p = presetOf(pid); return (p && p.display_name) || (PRESET_UI[pid] || [pid])[0]; }
  function presetBlurb(pid) { const p = presetOf(pid); return (p && p.blurb) || (PRESET_UI[pid] || ["", ""])[1]; }
  // Real presets change motion; the rest only pick a stock picture (+ tint/glow) on the default drop.
  function recipeLabel(p) { const r = (S.eff.recipes || []).find((x) => x.id === p.recipe); return r ? r.label : "Recipe"; }
  function effectById(id) {
    if (!id || id === "none") return null;
    const s = S.saved.find((x) => x.id === id); if (s) return s;
    if (presetOf(id)) return { id, label: presetName(id), base: id, v: presetValues(id), builtin: true };
    return null;
  }

  // ---------- pixel pictures (stand-ins for the BTF PNGs; 16 px, pointing right) ----------
  function maskFor(id) {
    const g = Array.from({ length: 16 }, () => Array(16).fill("."));
    const set = (x, y, c = "#") => { if (x >= 0 && x < 16 && y >= 0 && y < 16) g[y][x] = c; };
    if (id === "cut" || id === "holy" || id === "heaven") {
      const wide = id === "heaven";
      for (let x = 5; x <= 13; x++) { set(x, 7); set(x, 8); if (wide) { set(x, 6); set(x, 9); } set(x, 7, "o"); }
      set(14, 7); set(14, 8); set(15, 7, "#");
      for (let y = wide ? 2 : 4; y <= (wide ? 13 : 11); y++) set(4, y);
      if (wide) { for (let y = 3; y <= 12; y++) set(3, y); set(3, 7, "o"); set(3, 8, "o"); }
      for (let x = 0; x <= 3; x++) { set(x, 7, x === 0 ? "o" : "#"); set(x, 8); }
    } else if (id === "wrath") {
      for (let x = 5; x <= 12; x++) for (let y = 6; y <= 9; y++) set(x, y);
      for (let x = 5; x <= 12; x++) set(x, 7, "o");
      set(13, 7); set(13, 8); set(14, 7); set(14, 8); set(15, 8);
      for (let y = 3; y <= 12; y++) { set(3, y); set(4, y); }
      for (let x = 0; x <= 2; x++) { set(x, 7); set(x, 8); }
    } else if (id === "chain") {
      for (let x = 0; x <= 10; x += 2) { set(x, 7); set(x + 1, 8); }
      [[11, 6], [12, 5], [13, 5], [14, 6], [14, 7], [14, 8], [13, 9], [12, 9], [11, 9], [12, 8], [11, 8]].forEach(([x, y]) => set(x, y));
      set(13, 6, "o"); set(13, 8, "o");
    } else if (id === "feather") {
      for (let x = 2; x <= 14; x++) { const h = Math.round(2.6 * Math.sin(((x - 2) / 12) * Math.PI)); for (let y = 7 - h; y <= 8 + h; y++) set(x, y); set(x, 7, "o"); }
      set(0, 8); set(1, 8);
    } else if (id === "spike") {
      for (let x = 1; x <= 15; x++) { const h = Math.max(0, Math.round((15 - x) * 0.42)); for (let y = 7 - h; y <= 8 + h; y++) set(x, y); }
      for (let x = 3; x <= 13; x++) set(x, 7, "o");
    }
    const out = g.map((r) => r.slice());
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x] === ".") {
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy] && g[y + dy][x + dx] && g[y + dy][x + dx] !== ".");
      if (n) out[y][x] = "k";
    }
    return out;
  }
  const MASKS = {}; ["cut", "holy", "wrath", "heaven", "chain", "feather", "spike"].forEach((k) => (MASKS[k] = maskFor(k)));
  function darken(hex, f) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * f, g = ((n >> 8) & 255) * f, b = (n & 255) * f; return `rgb(${r | 0},${g | 0},${b | 0})`; }
  const picCache = new Map();
  function pictureCanvas(blade, tint, glow, fb = "cut") {
    if (blade.startsWith("asset:")) { const sp = findAsset(blade.slice(6)); return sp ? sp.canvas : pictureCanvas(fb, tint, glow); }
    const key = blade + tint + glow;
    if (picCache.has(key)) return picCache.get(key);
    let c;
    {
      const m = MASKS[blade] || MASKS.cut;
      c = document.createElement("canvas"); c.width = 16; c.height = 16;
      const x = c.getContext("2d");
      for (let yy = 0; yy < 16; yy++) for (let xx = 0; xx < 16; xx++) {
        const ch = m[yy][xx]; if (ch === ".") continue;
        x.fillStyle = ch === "#" ? tint : ch === "o" ? glow : darken(tint, 0.45);
        x.fillRect(xx, yy, 1, 1);
      }
    }
    picCache.set(key, c);
    return c;
  }
  function picSize(blade) { if (blade.startsWith("asset:")) { const sp = findAsset(blade.slice(6)); if (sp) return sp.fw; } return PIC_PX; }
  // Built-in library pictures (CC0, stand-ins drawn here). Copied into the project as an asset when used.
  let CC0 = null;
  function cc0List() {
    if (CC0) return CC0;
    const mk = (draw) => { const c = document.createElement("canvas"); c.width = 16; c.height = 16; const x = c.getContext("2d"); draw((px, py, col) => { x.fillStyle = col; x.fillRect(px, py, 1, 1); }); return c; };
    CC0 = [
      { id: "lib_arrow", name: "Arrow", src: "cc0", fw: 16, canvas: mk((d) => { for (let i = 1; i < 12; i++) { d(i, 7, "#8a5a2b"); d(i, 8, "#5c3a1a"); } [[12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [13, 6], [13, 7], [13, 8], [13, 9], [14, 7], [14, 8], [15, 7]].forEach(([a, b]) => d(a, b, "#c9ced6")); [[0, 5], [1, 6], [0, 10], [1, 9], [0, 6], [0, 9]].forEach(([a, b]) => d(a, b, "#e5484d")); }) },
      { id: "lib_orb", name: "Orb", src: "cc0", fw: 16, canvas: mk((d) => { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const r = Math.hypot(x - 7.5, y - 7.5); if (r < 6) d(x, y, r < 2.2 ? "#ecfeff" : r < 4 ? "#67e8f9" : r < 5.2 ? "#0891b2" : "#164e63"); } }) },
      { id: "lib_spark", name: "Spark", src: "cc0", fw: 16, canvas: mk((d) => { for (let i = 1; i < 15; i++) { d(i, 7, "#facc15"); d(7, i, "#facc15"); d(i, 8, "#ca8a04"); d(8, i, "#ca8a04"); } for (let i = 4; i < 12; i++) { d(i, i, "#fde68a"); d(15 - i, i, "#fde68a"); } d(7, 7, "#ffffff"); d(8, 8, "#ffffff"); d(7, 8, "#ffffff"); d(8, 7, "#ffffff"); }) },
    ];
    return CC0;
  }
  function findAsset(id) { return S.sprites.find((s) => s.id === id) || cc0List().find((s) => s.id === id) || null; }
  function picKey(v) { return v.picture && v.picture !== "none" ? "asset:" + v.picture : v.blade; }
  function picSource(key) { if (!key.startsWith("asset:")) return "studio"; const a = findAsset(key.slice(6)); return a ? a.src : "missing"; }
  function picTag(src) { return src === "studio" ? '<span class="tag-pending">Studio pack (pending)</span>' : src === "cc0" ? '<span class="tag-cc0">CC0</span>' : src === "own" ? '<span class="tag-yours">Yours</span>' : ""; }
  // rev 11: knob.disabled_when {knob, in_docs} + disabled_reason {text, action {label, set {knob, value}}}; UI only, value kept
  function disabledBy(id, v) {
    const k = S.knobs[id], w = k && k.disabled_when; if (!w) return null;
    const val = v[w.knob], ref = S.knobs[w.knob] && S.knobs[w.knob].ref;
    const isDoc = val != null && !((ref && ref.builtin) || []).includes(val) && (!ref || ref.docs === w.in_docs);
    return isDoc ? k.disabled_reason || { text: "Not available" } : null;
  }
  function picMissing(v) { return !!(v.picture && v.picture !== "none" && !findAsset(v.picture)) || v.steps.some((f) => f.picture && !findAsset(f.picture)); }

  // ---------- renderer (one canvas loop for every preview; rules never run here) ----------
  // The preview board is the effect's own booth frame (catalogue rev 12 booth_* defaults; 2 × 1 when the effect is flat).
  let COLS = 2, ROWS = 1, CT = { c: 0, r: 0 }, FT = { c: 1, r: 0 }, CASTER = { x: 0.5, y: 0.5 }, TARGET = { x: 1.5, y: 0.5 }, ROT = true, FACE = "right";
  function boardOf(v) {
    const kd = (id, d) => (S.knobs[id] ? S.knobs[id].default : d);
    const cols = clamp(Math.round((v && v.booth_cols) || kd("booth_cols", 2)), 2, 8), rows = clamp(Math.round((v && v.booth_rows) || kd("booth_rows", 2)), 1, 10);
    const fit = (q, d) => ({ c: clamp((q || d).c, 0, cols - 1), r: clamp((q || d).r, 0, rows - 1) });
    return { cols, rows, ct: fit(v && v.booth_caster, kd("booth_caster", { c: 0, r: 1 })), ft: fit(v && v.booth_foe, kd("booth_foe", { c: 1, r: 1 })) };
  }
  function setBoard(v) {
    const b = boardOf(v); COLS = b.cols; ROWS = b.rows; CT = b.ct; FT = b.ft;
    CASTER = { x: CT.c + 0.5, y: CT.r + 0.5 }; TARGET = { x: FT.c + 0.5, y: FT.r + 0.5 };
    // project-format r9 §6.7: rotation is the identity when the anchor unit has no facing; booth pieces have none.
    ROT = false;
    const dx = FT.c - CT.c, dy = FT.r - CT.r;
    FACE = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  }
  const EASE = { linear: (u) => u, out: (u) => 1 - (1 - u) * (1 - u), "in-out": (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2) };
  function rnd(k) { const s = Math.sin(k * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function spawnPoint(v) {
    if (v.spawn === "drop-on-tile") return { x: TARGET.x, y: TARGET.y - v.drop };
    if (v.spawn === "beside") return { x: CASTER.x, y: CASTER.y - 1 };
    if (v.spawn === "in-front") return { x: CASTER.x + 1, y: CASTER.y };
    return { x: CASTER.x, y: CASTER.y };
  }
  const tileC = (q) => ({ x: q.c + 0.5, y: q.r + 0.5 });
  function polyAt(pts, u) {
    if (pts.length < 2) return { x: pts[0].x, y: pts[0].y, a: 0 };
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); seg.push(d); L += d; }
    let want = u * L, i = 0;
    while (i < seg.length - 1 && want > seg[i]) { want -= seg[i]; i++; }
    const t = seg[i] ? clamp(want / seg[i], 0, 1) : 1, A = pts[i], B = pts[i + 1];
    return { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), a: Math.atan2(B.y - A.y, B.x - A.x) };
  }
  // rev 10: points are {dc, dr} offsets from the step's anchor (caster | target); they turn with the caster's facing.
  const anc = (f) => (f.anchor === "target" ? FT : CT);
  const turn = (dc, dr) => (!ROT || FACE === "right" ? [dc, dr] : FACE === "left" ? [-dc, -dr] : FACE === "down" ? [-dr, dc] : [dr, -dc]);
  const unturn = (x, y) => (!ROT || FACE === "right" ? [x, y] : FACE === "left" ? [-x, -y] : FACE === "down" ? [y, -x] : [-y, x]);
  const absQ = (f, q) => { const [x, y] = turn(q.dc || 0, q.dr || 0); return { c: anc(f).c + x, r: anc(f).r + y }; };
  const relQ = (f, c, r) => { const [dc, dr] = unturn(c - anc(f).c, r - anc(f).r); return { dc: dc + 0, dr: dr + 0 }; };
  const ptC = (f, q) => tileC(absQ(f, q));
  function reelAnchor(f) { return f.reel_anchor === "tile" && f.reel_tie ? ptC(f, f.reel_tie) : CASTER; }
  function reelEnd(f) {
    if (f.reel_pull === "yank") return f.reel_land ? ptC(f, f.reel_land) : { x: reelAnchor(f).x + 1, y: reelAnchor(f).y };
    return { x: TARGET.x - 1, y: TARGET.y };
  }
  function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const q = Math.round(u * 12) / 12; const ch = (sh) => Math.round(lerp((A >> sh) & 255, (B >> sh) & 255, q)); return "#" + [16, 8, 0].map((sh) => ch(sh).toString(16).padStart(2, "0")).join(""); }
  function playable(v) { const max = S.knobs.steps.max_items; return v.steps.length > max ? Object.assign({}, v, { steps: v.steps.slice(0, max) }) : v; }
  function totalOf(v) { return v.steps.reduce((a, f) => a + f.seconds, 0); }
  function edgeFix(p, v) {
    const max = COLS - 0.5;
    if (v.edge === "stop") p.x = Math.min(p.x, max);
    else if (v.edge === "bounce" && p.x > max) p.x = 2 * max - p.x;
    else if (v.edge === "clip" && p.x > COLS) p.alpha = 0;
    return p;
  }
  const usesSpread = (f) => f.kind === "row" || f.kind === "orbit" || (f.kind === "straight" && f.lock === "free");
  function reelTarget(f, u) {
    if (u <= 0.45) return { x: TARGET.x, y: TARGET.y };
    const e = reelEnd(f), k = EASE.out((u - 0.45) / 0.55);
    return { x: lerp(TARGET.x, e.x, k), y: lerp(TARGET.y, e.y, k) };
  }
  function motion(kind, f, starts, u0, v) {
    const out = [];
    const e = EASE[v.ease] || EASE.out;
    const spread = usesSpread(Object.assign({}, f, { kind }));
    const uk = (k) => { if (!spread || !f.start_spread) return u0; const d = f.start_spread * rnd(k + 3); return clamp((u0 - d) / (1 - d), 0, 1); };
    const jit = (k) => (spread ? f.jitter * (rnd(k + 9) - 0.5) * 2 : 0);
    const sz = (k) => (spread ? 1 + f.size_spread * (rnd(k + 17) - 0.5) * 2 : 1);
    if (kind === "orbit") {
      const n = f.orbit_count, src = starts[0];
      for (let k = 0; k < n; k++) {
        const u = e(uk(k)), grow = clamp(u0 / 0.18, 0, 1);
        const ang = (2 * Math.PI * k) / n - Math.PI / 2 + 2 * Math.PI * f.orbit_turns * u;
        const R = f.orbit_radius + jit(k);
        const ring = { x: CASTER.x + Math.cos(ang) * R, y: CASTER.y + Math.sin(ang) * R };
        out.push({ x: lerp(src.x, ring.x, grow), y: lerp(src.y, ring.y, grow), a: ang + Math.PI / 2, s: sz(k), alpha: 1 });
      }
      return out;
    }
    if (kind === "row") {
      const n = f.row_count, src = starts[0];
      for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * f.row_gap + jit(k), u = e(uk(k));
        const p0 = { x: src.x, y: src.y + off }, p1 = { x: TARGET.x, y: TARGET.y + off };
        out.push({ x: lerp(p0.x, p1.x, u), y: lerp(p0.y, p1.y, u), a: Math.atan2(p1.y - p0.y, p1.x - p0.x), s: sz(k), alpha: 1 });
      }
      return out;
    }
    if (kind === "cone") {
      const u = e(u0), d = TARGET.x - CASTER.x, rows = f.cone_rows;
      const a0 = (f.cone_angle * Math.PI) / 180;
      const th = a0 * (1 - 2 * u);
      const r = 0.6 + (d - 0.6) * u;
      for (let k = 0; k < Math.min(rows, 3); k++) {
        const rk = Math.max(0.4, r - k * (d / rows) * 0.5);
        out.push({ x: CASTER.x + Math.cos(th) * rk, y: CASTER.y + Math.sin(th) * rk, a: th, s: 1 - k * 0.15, alpha: 1 - k * 0.25, ribbon: k === 0 ? { r, th, w: f.cone_ribbon, a0 } : null });
      }
      return out;
    }
    if (kind === "reel") {
      const an = reelAnchor(f), go = e(clamp(u0 / 0.45, 0, 1));
      const d = Math.hypot(TARGET.x - an.x, TARGET.y - an.y) || 1, reach = Math.min(f.reel_reach, d) / d;
      let head = { x: lerp(an.x, TARGET.x, go * reach), y: lerp(an.y, TARGET.y, go * reach) };
      if (u0 > 0.45) head = reelTarget(f, u0);
      out.push({ x: head.x, y: head.y, a: Math.atan2(TARGET.y - an.y, TARGET.x - an.x), s: 1, alpha: 1, chain: an });
      return out;
    }
    if (kind === "scratch") {
      const src = starts[0], u = clamp(u0 / 0.4, 0, 1), fade = u0 > 0.7 ? 1 - (u0 - 0.7) / 0.3 : 1;
      const p = { x: lerp(src.x, TARGET.x, e(u)), y: lerp(src.y, TARGET.y, e(u)) };
      out.push({ x: p.x, y: p.y, a: Math.atan2(TARGET.y - src.y, TARGET.x - src.x), s: 1, alpha: fade, scratch: { from: src, to: p } });
      return out;
    }
    const pts = kind === "trace" ? f.trace_points : kind === "bounce" ? f.bounce_points : null;
    if (pts && pts.length) {
      return starts.map((src) => { const p = polyAt([src].concat(pts.map((q) => ptC(f, q))), e(u0)); return { x: p.x, y: p.y, a: p.a, s: 1, alpha: 1 }; });
    }
    // straight / swerve, and an empty trace or bounce (falls back to a straight flight, as in spec.ts)
    const n = starts.length;
    starts.forEach((src, k) => {
      const u = e(uk(k));
      let end = { x: TARGET.x, y: TARGET.y };
      if (kind === "straight" && f.lock === "free") end = { x: TARGET.x + (f.pierce + 1.2), y: TARGET.y + jit(k) };
      let bend = kind === "swerve" ? f.bend : 0;
      if (f._idx > 0 && n > 1 && f.release === "split") bend += (k / (n - 1) - 0.5) * 2.4;
      const mid = { x: (src.x + end.x) / 2, y: (src.y + end.y) / 2 };
      const L = Math.hypot(end.x - src.x, end.y - src.y) || 1;
      const ctl = { x: mid.x + ((end.y - src.y) / L) * bend, y: mid.y - ((end.x - src.x) / L) * bend };
      const q = (t) => ({ x: (1 - t) * (1 - t) * src.x + 2 * (1 - t) * t * ctl.x + t * t * end.x, y: (1 - t) * (1 - t) * src.y + 2 * (1 - t) * t * ctl.y + t * t * end.y });
      const p = q(u), p2 = q(Math.min(1, u + 0.02)), p1 = q(Math.max(0, u - 0.02));
      out.push(edgeFix({ x: p.x, y: p.y, a: Math.atan2(p2.y - p1.y, p2.x - p1.x), s: sz(k), alpha: 1 }, v));
    });
    return out;
  }
  function stepAt(v, t) {
    let acc = 0;
    for (let i = 0; i < v.steps.length; i++) { const s = v.steps[i].seconds; if (t < acc + s || i === v.steps.length - 1) return { i, u: clamp((t - acc) / s, 0, 1) }; acc += s; }
    return { i: 0, u: 0 };
  }
  function withIdx(f, i) { return Object.assign({}, f, { _idx: i }); }
  function bladesAt(v, i, u) {
    let starts = [spawnPoint(v)];
    for (let j = 0; j < i; j++) starts = motion(v.steps[j].kind, withIdx(v.steps[j], j), starts, 1, v).map((b) => ({ x: b.x, y: b.y }));
    const f = withIdx(v.steps[i], i);
    let list = motion(f.kind, f, starts, u, v);
    if (f.layer_kind && f.layer_kind !== "none" && u > f.layer_delay) {
      const ul = (u - f.layer_delay) / (1 - f.layer_delay || 1);
      list = list.concat(motion(f.layer_kind, f, [spawnPoint(v)], ul, v).map((b) => Object.assign(b, { alpha: b.alpha * 0.85 })));
    }
    const le = EASE[f.look_ease] || EASE.linear, lu = le(u);
    list.forEach((b) => {
      b.scale = (f.scale_on ? lerp(f.scale_from, f.scale_to, lu) : v.scale) * b.s;
      b.glow = f.glow_on ? lerp(f.glow_from, f.glow_to, lu) : v.glow_size;
      if (f.fade_on) b.alpha *= lerp(f.fade_from, f.fade_to, lu);
      if (f.tint_on) b.tint = mixHex(f.tint_from, f.tint_to, lu);
      b.pic = f.picture ? "asset:" + f.picture : null; // L32 mock only; null = the effect's picture
    });
    return list;
  }
  function hitTime(v) { const last = v.steps.length - 1; let st = 0; for (let j = 0; j < last; j++) st += v.steps[j].seconds; return st + v.connect * v.steps[last].seconds; }
  function targetPos(v, t) {
    const p = { x: TARGET.x, y: TARGET.y, split: 0 };
    const last = v.steps[v.steps.length - 1];
    const total = totalOf(v), ht = hitTime(v);
    if (last.kind === "reel") { const st = total - last.seconds; if (t >= st) Object.assign(p, reelTarget(last, clamp((t - st) / last.seconds, 0, 1))); }
    if (t >= ht) {
      const dt = t - ht;
      if (v.hit === "nudge") p.x += v.nudge * Math.sin(Math.PI * clamp(dt / 0.25, 0, 1));
      if (v.hit === "knock-1") p.x = Math.min(COLS - 0.5, p.x + clamp(dt / 0.2, 0, 1));
      if (v.hit === "split") p.split = 0.16 * clamp(dt / 0.25, 0, 1);
    }
    return p;
  }
  // Stand-in project unit sprites (16 px): "You" = Archer, foe = Rival Knight. Drawn at whole zoom, nearest-neighbour.
  const UNIT_ART = {
    you: ["......kkkk......", ".....kbbbbk.....", "....kbbbbbbk....", "....kbsssbbk....", "....kssksskk.k..", "....ksssssk.kwk.", ".....kssssk.kwk.", "....kbbbbbbkkwk.", "...kbbbybbbbkwk.", "...kbbbybbbkswk.", "...ksbbbbbbk.kwk", "....kbbbbbbk.kwk", "....kbbkkbbk..k.", "....kbbk.kbbk...", "....kkk...kkk...", "................"],
    foe: [".....kkkkkk.....", "....kggggggk....", "...kggrrrrggk...", "...kgkkkkkkgk...", "...kgrrrrrrgk...", "....kggggggk....", "..kkkrrrrrrkkk..", ".kgggrrrrrrgggk.", ".kgkkrrggrrkkgk.", ".kg.krrggrrk.gk.", ".kk.krrrrrrk.kk.", "....kggggggk....", "....kggkkggk....", "....kggk.kggk...", "....kkk...kkk...", "................"],
  };
  const UNIT_COL = { k: "#1d2939", b: "#2f5bff", s: "#f5c6a5", w: "#8a5a2b", y: "#fde68a", g: "#98a2b3", r: "#b42318" };
  const unitCache = {};
  function unitCanvas(who) {
    if (unitCache[who]) return unitCache[who];
    const c = document.createElement("canvas"); c.width = 16; c.height = 16; const x = c.getContext("2d");
    UNIT_ART[who].forEach((row, yy) => [...row].forEach((ch, xx) => { if (ch !== ".") { x.fillStyle = UNIT_COL[ch]; x.fillRect(xx, yy, 1, 1); } }));
    return (unitCache[who] = c);
  }
  function drawPiece(ctx, T, p, who, dpr) {
    if (!S.unitSprites) return drawToken(ctx, T, p, who === "you" ? "#2f5bff" : "#b42318", who === "you" ? "You" : "Foe");
    const pic = unitCanvas(who), k = Math.max(1, Math.floor((T * 0.9 * dpr) / 16)), w = (16 * k) / dpr;
    const draw = (dy) => { ctx.imageSmoothingEnabled = false; ctx.drawImage(pic, Math.round((p.x * T - w / 2) * dpr) / dpr, Math.round((p.y * T - w / 2 + dy) * dpr) / dpr, w, w); };
    if (p.split) {
      for (const sgn of [-1, 1]) { ctx.save(); ctx.beginPath(); ctx.rect(p.x * T - w, sgn < 0 ? p.y * T - w - p.split * T : p.y * T + p.split * T, 2 * w, w); ctx.clip(); draw(sgn * p.split * T); ctx.restore(); }
      return;
    }
    draw(0);
  }
  function drawToken(ctx, T, p, fill, label) {
    const r = T * 0.32;
    ctx.fillStyle = fill;
    if (p.split) {
      for (const sgn of [-1, 1]) {
        ctx.save(); ctx.beginPath();
        ctx.rect(p.x * T - r - 2, sgn < 0 ? p.y * T - r - 2 - p.split * T : p.y * T + p.split * T, 2 * r + 4, r + 2); ctx.clip();
        ctx.beginPath(); ctx.arc(p.x * T, p.y * T + sgn * p.split * T, r, 0, 7); ctx.fill(); ctx.restore();
      }
      return;
    }
    ctx.beginPath(); ctx.arc(p.x * T, p.y * T, r, 0, 7); ctx.fill();
    if (T >= 30) { ctx.fillStyle = "#fff"; ctx.font = `800 ${Math.round(T * 0.22)}px system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, p.x * T, p.y * T + 1); }
  }
  function drawBlade(ctx, T, b, v, dpr) {
    if (b.alpha <= 0.01) return;
    const key = b.pic || picKey(v);
    const pic = pictureCanvas(key, b.tint || v.tint, v.glow, v.blade);
    const native = picSize(key);
    // whole-number zoom only: device pixels per art pixel is an integer, nearest-neighbour
    const k = Math.max(1, Math.round((b.scale * T * dpr) / native));
    const w = (pic.width * k) / dpr, h = (pic.height * k) / dpr;
    ctx.save();
    ctx.globalAlpha = clamp(b.alpha, 0, 1);
    ctx.translate(Math.round(b.x * T * dpr) / dpr, Math.round(b.y * T * dpr) / dpr);
    ctx.rotate(b.a + (v.spin * Math.PI) / 180);
    ctx.imageSmoothingEnabled = false;
    if (b.glow > 0) { ctx.shadowColor = v.glow; ctx.shadowBlur = (b.glow * T) / 72; }
    ctx.drawImage(pic, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  function render(cv, v, t) {
    setBoard(v || (cv._getV && cv._getV()));
    const T = Math.max(8, Math.floor(Math.min(cv._boxW / COLS, cv._boxH / ROWS, cv._base * 1.5)));
    if (cv._T !== T || cv._cols !== COLS || cv._rows !== ROWS) sizeBoard(cv, T);
    const dpr = cv._dpr, ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, COLS * T, ROWS * T);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { ctx.fillStyle = (r + c) % 2 ? "#f2f4f7" : "#ffffff"; ctx.fillRect(c * T, r * T, T, T); }
    ctx.strokeStyle = "#d0d5dd"; ctx.lineWidth = 1;
    for (let c = 1; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(c * T + 0.5, 0); ctx.lineTo(c * T + 0.5, ROWS * T); ctx.stroke(); }
    for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * T + 0.5); ctx.lineTo(COLS * T, r * T + 0.5); ctx.stroke(); }
    if (!v) return;
    const total = totalOf(v), ht = hitTime(v);
    if (T >= 30) v.steps.forEach((f) => {
      const pts = f.kind === "trace" ? f.trace_points : f.kind === "bounce" ? f.bounce_points : f.kind === "reel" ? f.reel_links : null;
      if (!pts || !pts.length) return;
      ctx.save(); ctx.strokeStyle = "#2f5bff"; ctx.globalAlpha = 0.55; ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.beginPath();
      pts.forEach((q, k) => { const c = ptC(f, q); if (k) ctx.lineTo(c.x * T, c.y * T); else ctx.moveTo(c.x * T, c.y * T); }); ctx.stroke(); ctx.setLineDash([]);
      pts.forEach((q, k) => { const c = ptC(f, q); ctx.globalAlpha = 0.85; ctx.fillStyle = "#2f5bff"; ctx.beginPath(); ctx.arc(c.x * T, c.y * T, T * 0.13, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = `800 ${Math.round(T * 0.15)}px system-ui, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(k + 1), c.x * T, c.y * T + 1); });
      ctx.restore();
    });
    drawPiece(ctx, T, CASTER, "you", dpr);
    const tp = targetPos(v, t);
    drawPiece(ctx, T, tp, "foe", dpr);
    if (t <= total + 0.15) {
      const fadeOut = t > total ? 1 - (t - total) / 0.15 : 1;
      const { i, u } = stepAt(v, Math.min(t, total));
      const blades = bladesAt(v, i, u);
      if (v.trail && u > 0) {
        let prev = blades;
        ctx.strokeStyle = v.tint; ctx.lineCap = "round";
        for (let j = 1; j <= 5; j++) {
          const back = bladesAt(v, i, Math.max(0, u - j * 0.035));
          blades.forEach((b, k) => {
            const p = back[k], q = prev[k]; if (!p || !q || b.chain || b.scratch) return;
            ctx.globalAlpha = 0.32 * (1 - j / 6) * fadeOut * clamp(b.alpha, 0, 1); ctx.lineWidth = T * 0.09 * (1 - j / 7);
            ctx.beginPath(); ctx.moveTo(q.x * T, q.y * T); ctx.lineTo(p.x * T, p.y * T); ctx.stroke();
          });
          prev = back;
        }
        ctx.globalAlpha = 1;
      }
      blades.forEach((b) => {
        if (b.ribbon) { ctx.save(); ctx.globalAlpha = 0.28 * fadeOut; ctx.strokeStyle = v.tint; ctx.lineWidth = b.ribbon.w * T * 0.45; ctx.beginPath(); ctx.arc(CASTER.x * T, CASTER.y * T, b.ribbon.r * T, Math.min(b.ribbon.a0, b.ribbon.th), Math.max(b.ribbon.a0, b.ribbon.th)); ctx.stroke(); ctx.restore(); }
        if (b.chain) { ctx.save(); ctx.strokeStyle = darken(v.tint, 0.6); ctx.setLineDash([T * 0.08, T * 0.06]); ctx.lineWidth = Math.max(2, T * 0.05); ctx.beginPath(); ctx.moveTo(b.chain.x * T, b.chain.y * T); ctx.lineTo(b.x * T, b.y * T); ctx.stroke(); ctx.restore(); }
        if (b.scratch) { ctx.save(); ctx.globalAlpha = clamp(b.alpha, 0, 1); ctx.lineCap = "round"; ctx.strokeStyle = v.tint; ctx.lineWidth = T * 0.16; ctx.beginPath(); ctx.moveTo(b.scratch.from.x * T, b.scratch.from.y * T); ctx.lineTo(b.scratch.to.x * T, b.scratch.to.y * T); ctx.stroke(); ctx.strokeStyle = v.glow; ctx.lineWidth = T * 0.05; ctx.stroke(); ctx.restore(); }
        drawBlade(ctx, T, Object.assign({}, b, { alpha: b.alpha * fadeOut }), v, dpr);
      });
    }
    if (t >= ht) {
      const dt = t - ht;
      if (v.impact && dt < 0.45) {
        const a = 1 - dt / 0.45, R = v.impact_radius * T * EASE.out(clamp(dt / 0.3, 0, 1));
        ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = v.impact_colour; ctx.lineWidth = Math.max(1.5, T * 0.04); ctx.lineCap = "round";
        for (let s = 0; s < v.sparks; s++) { const an = (s / v.sparks) * Math.PI * 2 + 0.3; ctx.beginPath(); ctx.moveTo(tp.x * T + Math.cos(an) * R * 0.45, tp.y * T + Math.sin(an) * R * 0.45); ctx.lineTo(tp.x * T + Math.cos(an) * R, tp.y * T + Math.sin(an) * R); ctx.stroke(); }
        ctx.globalAlpha = a * 0.5; ctx.fillStyle = v.impact_colour; ctx.beginPath(); ctx.arc(tp.x * T, tp.y * T, T * 0.22 * a, 0, 7); ctx.fill(); ctx.restore();
      }
      if (v.damage_label === "show-rule-damage" && dt < 0.9 && T >= 30) {
        ctx.save(); ctx.globalAlpha = 1 - dt / 0.9; ctx.fillStyle = "#b42318"; ctx.font = `800 ${Math.round(T * 0.26)}px system-ui, sans-serif`; ctx.textAlign = "center";
        const dmg = ruleDamage(damageOwner()); ctx.fillText(dmg != null ? "−" + dmg : "−dmg", tp.x * T, tp.y * T - T * 0.45 - dt * T * 0.3); ctx.restore();
      }
    }
  }
  const boards = new Set();
  function sizeBoard(cv, T) {
    cv.width = COLS * T * cv._dpr; cv.height = ROWS * T * cv._dpr;
    cv.style.width = COLS * T + "px"; cv.style.height = ROWS * T + "px";
    cv._T = T; cv._cols = COLS; cv._rows = ROWS;
  }
  function makeBoard(tile, getV) {
    const cv = document.createElement("canvas");
    const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
    cv._dpr = dpr; cv._boxW = 6 * tile; cv._boxH = 3 * tile; // fits any booth size inside the old 6 × 3 box
    cv._base = tile; setBoard(getV()); sizeBoard(cv, Math.max(8, Math.floor(Math.min(cv._boxW / COLS, cv._boxH / ROWS, tile * 1.5))));
    cv.className = "px"; cv._getV = getV; cv._t0 = performance.now();
    cv.setAttribute("role", "img");
    boards.add(cv);
    return cv;
  }
  function tick(now) {
    for (const cv of boards) {
      if (!cv.isConnected) { boards.delete(cv); continue; }
      if (!cv.offsetParent) continue;
      const v0 = cv._getV();
      if (!v0) { render(cv, null, 0); continue; }
      const v = playable(v0);
      const total = totalOf(v), loop = total + 0.9;
      const t = S.freeze != null ? (typeof S.freeze === "function" ? S.freeze(v) : S.freeze) : (((now - cv._t0) / 1000) * (cv._main ? S.previewRate : 1)) % loop;
      render(cv, v, t);
      if (cv._clock) cv._clock.textContent = `${Math.min(t, total).toFixed(2)} / ${total.toFixed(2)} s · hit ${hitTime(v).toFixed(2)} s`;
    }
    requestAnimationFrame(tick);
  }

  // ---------- toast ----------
  let toastT;
  function toast(msg, act) {
    const t = $("#toast");
    t.innerHTML = `<span class="msg">${esc(msg)}</span>${act ? `<button type="button" class="fx-toast-act" id="toast-act">${esc(act.label)}</button>` : ""}`;
    t.classList.toggle("has-act", !!act);
    if (act) $("#toast-act").addEventListener("click", () => { t.classList.remove("show"); act.fn(); });
    t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), act ? 5000 : 2200);
  }
  // ---------- project-level undo (compound actions: one group, one undo entry) ----------
  function pSnap() { return clone({ saved: S.saved, assign: S.assign, stageOv: S.stageOv }); }
  function pCommit(label, before, msg) { S.ph.push({ label, before }); toast(msg, { label: "Undo", fn: pUndo }); }
  function pUndo() { const e = S.ph.pop(); if (!e) return; Object.assign(S, clone(e.before)); S.confirmDel = null; S.gm = null; route(); toast(`Undone: ${e.label}`); }

  // ---------- editing: undo / redo ----------
  function edit(key, fn) {
    const now = Date.now();
    if (key !== S.editKey || now - S.editAt > 900) { S.past.push(clone(S.work)); if (S.past.length > 50) S.past.shift(); S.future = []; }
    S.editKey = key; S.editAt = now;
    fn(S.work.v);
    updateBar();
  }
  const once = () => "k" + Math.random();
  function undo() { if (!S.past.length) return; S.future.push(clone(S.work)); S.work = S.past.pop(); S.editKey = null; renderDesign(); toast("Undone"); }
  function redo() { if (!S.future.length) return; S.past.push(clone(S.work)); S.work = S.future.pop(); S.editKey = null; renderDesign(); toast("Redone"); }
  function updateBar() {
    const u = $("#fx-undo"), r = $("#fx-redo");
    if (u) u.disabled = !S.past.length;
    if (r) r.disabled = !S.future.length;
    $("#des-title").textContent = S.work.label;
  }
  function startFrom(pid) { S.work = { id: null, label: presetName(pid), base: pid, v: presetValues(pid) }; S.past = []; S.future = []; S.openStep = null; S.speedIdx = 3; S.speedBase = null; }
  function openSaved(id) { const e = S.saved.find((x) => x.id === id); S.work = clone(e); S.past = []; S.future = []; S.openStep = null; S.speedIdx = 3; S.speedBase = null; }
  function uniqueName(n) { let name = n, i = 2; while (S.saved.some((s) => s.label === name)) name = `${n} ${i++}`; return name; }

  // ---------- controls ----------
  const TAG_MAX = () => (S.knobs.tags && S.knobs.tags.label_max_len) || 16;
  const CUE_MAX = () => (S.knobs.cue_name && S.knobs.cue_name.max_len) || 32;
  const fmt2 = (x) => Number(x).toFixed(2), fmt0 = (x) => String(Math.round(x)), fmtP = (x) => Math.round(x * 100) + "%";
  const fmtBy = (f, x) => (f === "0" ? fmt0(x) : f === "1" ? Number(x).toFixed(1) : f === "pct" ? fmtP(x) : fmt2(x));
  function sliderField(id, label, min, max, step, val, fmt, extra = "") {
    return `<div class="field"><label for="${id}">${esc(label)} <span class="val" id="${id}-val">${esc(fmt(val))}</span></label>
      <input class="slider" type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" />${extra}</div>`;
  }
  function pickerField(id, label, opts, val, hint = "") {
    return `<div class="field"><label>${esc(label)}</label>${hint ? `<p class="hint">${esc(hint)}</p>` : ""}
      <div class="picker-grid" role="group" aria-label="${esc(label)}">${opts.map(([v, l]) => `<button type="button" class="toggle" data-pick="${id}" data-value="${esc(v)}" aria-pressed="${String(v) === String(val)}">${esc(l)}</button>`).join("")}</div></div>`;
  }
  function toggleField(id, label, val, hint = "") {
    return `<div class="field fx-inline"><label>${esc(label)}${hint ? `<span class="fx-note" style="display:block;font-weight:500;margin:2px 0 0">${esc(hint)}</span>` : ""}</label>
      <div class="seg" role="group" aria-label="${esc(label)}"><button type="button" class="toggle" data-tog="${id}" data-value="true" aria-pressed="${val === true}">On</button><button type="button" class="toggle" data-tog="${id}" data-value="false" aria-pressed="${val === false}">Off</button></div></div>`;
  }
  function swatches(id, label, list, val) {
    return `<div class="field"><label>${esc(label)} <span class="val">${esc(val)}</span></label><div class="swatch-grid" role="group" aria-label="${esc(label)}">${list.map((c) => `<button type="button" class="swatch" data-swatch="${id}" data-value="${c}" style="background:${c}" aria-pressed="${c === val}" aria-label="${c}"></button>`).join("")}
      <span class="colour-custom"><input type="color" data-colour="${id}" value="${val}" aria-label="${esc(label)}: any colour" /></span></div></div>`;
  }
  function placeholder(title, sub) { return `<div class="fx-ph"><span><strong>${esc(title)}</strong>${esc(sub)}</span><span class="soon">Coming soon</span></div>`; }
  const KNOB_OPT = (id) => (S.knobs[id].options || []).map((o) => [o.value, o.label]);
  const ITEM_OPT = (f) => (itemSpec(f).options || []).map((o) => [o.value, o.label]);
  const kindOpts = () => ITEM_OPT("kind").map(([v]) => [v, KIND_UI[v][0]]);
  const EASE_WORD = { linear: "Even", out: "Fast then soft", "in-out": "Slow, fast, slow" };
  function mainCountStep(v) { return v.steps.findIndex((f) => f.kind === "row" || f.kind === "orbit"); }
  function toolsBar() {
    return `<div class="icon-bar">
        <button type="button" class="btn btn-ghost" id="fx-undo">↶ Undo</button>
        <button type="button" class="btn btn-ghost" id="fx-redo">↷ Redo</button>
        <button type="button" class="btn btn-ghost" id="fx-reset" aria-label="Reset to ${esc(presetName(S.work.base))}">Reset</button>
        <button type="button" class="btn btn-ghost" id="fx-dup">Duplicate</button>
      </div>`;
  }
  function zoomOf(v) { return Math.max(1, Math.round((v.scale * TILE_PX) / picSize(picKey(v)))); }
  // rev 10 scale_snap: "whole" by default; "fractional" only while the project's Advanced render is on (off in this mock)
  const snapWhole = (v) => !(S.advancedRender && v.scale_snap === "fractional");
  function sizeRange(v) {
    const k = S.knobs.scale; if (!snapWhole(v)) return { min: k.min, max: k.max, step: k.step, val: v.scale };
    const st = picSize(picKey(v)) / TILE_PX; const min = Math.ceil(k.min / st - 1e-9) * st, max = Math.floor(k.max / st + 1e-9) * st;
    return { min, max, step: st, val: clamp(Math.round(v.scale / st) * st, min, max) };
  }
  function zoomWord(v) { if (!snapWhole(v)) return `${fmt2(v.scale)} tiles`; const k = zoomOf(v); return `×${k} · ${k * picSize(picKey(v))} px`; }
  function sizeNote(v) { return snapWhole(v) ? `Whole zoom steps of your ${picSize(picKey(v))} px picture (a tile is ${TILE_PX} px), so it stays sharp.` : "Any size. May blur pixel art."; }
  function sizeField(v) {
    const r = sizeRange(v), opts = S.knobs.scale_snap ? S.knobs.scale_snap.options : [{ value: "whole" }, { value: "fractional" }];
    return sliderField("fx-size", "Size", +r.min.toFixed(4), +r.max.toFixed(4), +r.step.toFixed(4), +r.val.toFixed(4), () => zoomWord(v), `<p class="fx-note" id="fx-size-note">${sizeNote(v)}</p>
      <div class="field fx-inline" style="margin:10px 0 0;padding:0;border:0;box-shadow:none;background:none"><label>Size steps</label><div class="seg" role="group" aria-label="Size steps">${opts.map((o) => { const frac = o.value === "fractional", dis = frac && !S.advancedRender; return `<button type="button" class="toggle" data-snap="${o.value}" aria-pressed="${(v.scale_snap || "whole") === o.value}"${dis ? ' disabled aria-disabled="true"' : ""}>${frac ? "Any size" : "Whole"}</button>`; }).join("")}</div></div>
      ${S.advancedRender ? "" : v.scale_snap === "fractional" ? `<p class="fx-note" style="margin:6px 0 0"><strong>Any size is saved</strong> but plays as Whole. Turn on Advanced render to use it.</p>` : `<p class="fx-note" style="margin:6px 0 0">Any size: Turn on Advanced render (project settings).</p>`}`);
  }

  function renderSimple() {
    const v = S.work.v, b = $("#des-body");
    const ci = mainCountStep(v);
    const cf = ci >= 0 ? v.steps[ci] : null;
    const cKey = cf ? (cf.kind === "row" ? "row_count" : "orbit_count") : null;
    const cs = cKey ? itemSpec(cKey) : null;
    const pk = picKey(v), src = picSource(pk), stock = src === "studio" || src === "missing";
    const picSub = { studio: "May not ship in exported games yet.", cc0: "Built-in library · free to ship", own: "Your upload", missing: "Picture not found" }[src];
    const cWord = cf && cf.kind === "row" ? "side by side" : "in the ring";
    b.innerHTML = `${toolsBar()}
      <div class="field"><label for="fx-name">Name</label><input class="fx-input" id="fx-name" value="${esc(S.work.label)}" maxlength="32" /></div>
      <div class="field"><label>Picture</label>
        <button type="button" class="fx-picture" data-nav="sprite" aria-label="Change picture: ${esc(picLabel(pk))}"><span id="fx-pic-thumb"></span><span><strong>${esc(picLabel(pk))}</strong> ${picTag(src)}<br><span class="fx-note" style="margin:0">${picSub}</span></span><span class="go">Change</span></button>
        ${src === "missing" ? `<div class="check warn" style="margin-top:8px"><span class="ic" aria-hidden="true">!</span><span>This effect names a picture that isn't in the project. It draws the stock ${esc(STOCK_UI[v.blade] || v.blade)} picture until you pick another.</span></div>` : ""}</div>
      ${bladeField(v)}
      ${swatches("tint", "Colour", TINTS, v.tint)}
      ${sliderField("fx-speed", "Speed · shortcut", 0, 6, 1, S.speedIdx, (i) => `${SPEED_WORDS[i]} · ${totalOf(v).toFixed(2)} s`, `<div class="fx-scale"><span>Slower</span><span>Faster</span></div><p class="fx-note">Shortcut: rescales every step's length. Not saved on its own.</p>`)}
      ${sizeField(v)}
      ${cf ? sliderField("fx-count", "Count · shortcut", cs.min, cs.max, cs.step, cf[cKey], (x) => `${x} ${cWord}`, `<p class="fx-note">Shortcut: sets step ${ci + 1}'s ${cf.kind === "row" ? "row" : "ring"} size.</p>`) : `<div class="field is-off"><label>Count · shortcut <span class="val">1</span></label><p class="fx-note">This look has one blade. For copies, add a "Row of them" or "Spin around you" step in Advanced steps.</p></div>`}
      ${toggleField("impact", "Hit flash", v.impact, "Sparks where it lands.")}
      ${v.impact ? swatches("impact_colour", "Flash colour", GLOWS, v.impact_colour) : ""}
      <p class="fx-note">Effects only change how an ability looks. Damage, pushes and targets stay in the ability's rules.</p>`;
    $("#fx-pic-thumb").appendChild(thumbCanvas(pk, v.tint, v.glow, v.blade));
    const bs = $("#fx-back-stock", b); if (bs) bs.addEventListener("click", () => { edit(once(), (vv) => (vv[bs.dataset.setKnob] = bs.dataset.setValue)); keepScroll(renderSimple); toast(`Back to the ${STOCK_UI[S.work.v.blade] || S.work.v.blade} stock drawing. Undo brings your picture back.`); });
    bindCommon(b);
    $("#fx-name").addEventListener("input", (e) => edit("name", () => { S.work.label = e.target.value || "Untitled effect"; }));
    $("#fx-speed").addEventListener("input", (e) => {
      const i = +e.target.value; if (!S.speedBase) S.speedBase = S.work.v.steps.map((f) => f.seconds);
      const sp = itemSpec("seconds");
      edit("speed", (vv) => { S.speedIdx = i; vv.steps.forEach((f, j) => (f.seconds = +clamp((S.speedBase[j] || f.seconds) / SPEEDS[i], sp.min, sp.max).toFixed(2))); });
      $("#fx-speed-val").textContent = `${SPEED_WORDS[i]} · ${totalOf(S.work.v).toFixed(2)} s`;
    });
    $$("[data-snap]", b).forEach((btn) => btn.addEventListener("click", () => { if (btn.disabled) return; edit(once(), (vv) => (vv.scale_snap = btn.dataset.snap)); keepScroll(renderSimple); }));
    $("#fx-size").addEventListener("input", (e) => {
      edit("scale", (vv) => (vv.scale = +e.target.value));
      $("#fx-size-val").textContent = zoomWord(S.work.v);
      $("#fx-size-note").textContent = sizeNote(S.work.v);
    });
    if (cf) $("#fx-count").addEventListener("input", (e) => { edit("count", (vv) => (vv.steps[ci][cKey] = +e.target.value)); $("#fx-count-val").textContent = `${e.target.value} ${cWord}`; });
    updateBar();
  }
  function bladeField(v) {
    const dis = disabledBy("blade", v); if (!dis) return "";
    const act = dis.action;
    return `<div class="field is-off fx-greyed" id="fx-blade-field"><label>${esc(S.knobs.blade.label === "Picture" ? "Stock drawing" : S.knobs.blade.label)} <span class="val">${esc(STOCK_UI[v.blade] || v.blade)}</span></label>
      <p class="fx-note" style="margin:0"><strong>${esc(dis.text)}</strong></p>
      <p class="fx-note" style="margin:2px 0 8px">${esc((S.knobs.blade.disabled_note || "Blade applies to stock pictures only").replace(/\.?$/, "."))} Your choice stays saved.</p>
      <div class="picker-grid" role="group" aria-label="Stock drawing (disabled)">${KNOB_OPT("blade").map(([id]) => `<button type="button" class="toggle" disabled aria-disabled="true" aria-pressed="${v.blade === id}">${esc(STOCK_UI[id] || id)}</button>`).join("")}</div>
      ${act ? `<button type="button" class="fx-link" id="fx-back-stock" data-set-knob="${esc(act.set.knob)}" data-set-value="${esc(act.set.value)}">${esc(act.label)}</button>` : ""}</div>`;
  }
  function picLabel(blade) { if (blade.startsWith("asset:")) { const s = findAsset(blade.slice(6)); return s ? s.name : "Missing picture"; } return STOCK_UI[blade] || blade; }
  function thumbCanvas(blade, tint, glow, fb) {
    const pic = pictureCanvas(blade, tint, glow, fb);
    const c = document.createElement("canvas"); const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
    const size = 48; c.width = size * dpr; c.height = size * dpr; c.style.width = size + "px"; c.style.height = size + "px"; c.className = "px checker";
    const x = c.getContext("2d"); x.imageSmoothingEnabled = false;
    const kk = Math.max(1, Math.floor((size * dpr) / Math.max(pic.width, pic.height)));
    const w = pic.width * kk, h = pic.height * kk;
    x.drawImage(pic, Math.round((size * dpr - w) / 2), Math.round((size * dpr - h) / 2), w, h);
    c.setAttribute("aria-hidden", "true");
    return c;
  }
  function keepScroll(fn) { const b = $("#des-body"); const top = b.scrollTop; fn(); b.scrollTop = top; }
  function bindCommon(root) {
    $$("[data-pick]", root).forEach((btn) => btn.addEventListener("click", () => { const id = btn.dataset.pick; edit(once(), (v) => (v[id] = btn.dataset.value)); keepScroll(rerender); }));
    $$("[data-tog]", root).forEach((btn) => btn.addEventListener("click", () => { const id = btn.dataset.tog; edit(once(), (v) => (v[id] = btn.dataset.value === "true")); keepScroll(rerender); }));
    $$("[data-swatch]", root).forEach((btn) => btn.addEventListener("click", () => { const id = btn.dataset.swatch; edit(once(), (v) => (v[id] = btn.dataset.value)); keepScroll(rerender); }));
    $$("[data-colour]", root).forEach((inp) => inp.addEventListener("change", () => { const id = inp.dataset.colour; edit(once(), (v) => (v[id] = inp.value)); keepScroll(rerender); }));
    $$("[data-knob-slider]", root).forEach((inp) => inp.addEventListener("input", () => { const id = inp.dataset.knobSlider; edit(id, (v) => (v[id] = +inp.value)); $(`#${inp.id}-val`).textContent = fmtBy(inp.dataset.fmt, inp.value); }));
    const u = $("#fx-undo", root); if (u) u.addEventListener("click", undo);
    const r = $("#fx-redo", root); if (r) r.addEventListener("click", redo);
    const rs = $("#fx-reset", root); if (rs) rs.addEventListener("click", () => { edit(once(), (v) => Object.assign(v, presetValues(S.work.base))); S.speedIdx = 3; S.speedBase = null; S.editKey = null; rerender(); toast(`Back to ${presetName(S.work.base)}. Undo brings your changes back.`); });
    const d = $("#fx-dup", root); if (d) d.addEventListener("click", duplicate);
  }
  function rerender() { if (S.tab === "advanced") renderAdvanced(); else renderSimple(); }

  // ---------- advanced ----------
  function knobSlider(id, label, val, fmt = "2") {
    const k = S.knobs[id];
    return `<div class="field"><label for="ks-${id}">${esc(label || k.label)} <span class="val" id="ks-${id}-val">${fmtBy(fmt, val)}</span></label>
      <input class="slider" type="range" id="ks-${id}" data-knob-slider="${id}" data-fmt="${fmt}" min="${k.min}" max="${k.max}" step="${k.step}" value="${val}" /></div>`;
  }
  function sSlider(i, f, label, fmt = "2") {
    const s = itemSpec(f), val = S.work.v.steps[i][f];
    return `<div class="field"><label for="sf-${i}-${f}">${esc(label)} <span class="val" id="sf-${i}-${f}-val">${fmtBy(fmt, val)}</span></label>
      <input class="slider" type="range" id="sf-${i}-${f}" data-step-slider="${i}:${f}" data-fmt="${fmt}" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}" /></div>`;
  }
  function sPick(i, f, label, opts) {
    const val = S.work.v.steps[i][f];
    return `<div class="field"><label>${esc(label)}</label><div class="picker-grid" role="group" aria-label="${esc(label)}">${opts.map(([v, l]) => `<button type="button" class="toggle" data-step-pick="${i}:${f}" data-value="${esc(v)}" aria-pressed="${String(v) === String(val)}">${esc(l)}</button>`).join("")}</div></div>`;
  }
  function sTog(i, f, label) {
    const val = S.work.v.steps[i][f];
    return `<div class="field fx-inline"><label>${esc(label)}</label><div class="seg" role="group" aria-label="${esc(label)}"><button type="button" class="toggle" data-step-tog="${i}:${f}" data-value="true" aria-pressed="${val === true}">On</button><button type="button" class="toggle" data-step-tog="${i}:${f}" data-value="false" aria-pressed="${val === false}">Off</button></div></div>`;
  }
  function tileField(i, f, label, hint) {
    setBoard(S.work.v);
    const sp = itemSpec(f), st = S.work.v.steps[i], val = st[f];
    const raw = many0(sp) ? val : val ? [val] : [], many = many0(sp);
    const list = raw.map((q) => { const a = absQ(st, q); return { c: Math.round(a.c), r: Math.round(a.r) }; });
    const rel = true;
    const sg = (n) => (n > 0 ? "+" + n : n < 0 ? "−" + -n : "0");
    const off = (q) => `(${sg(q.dc)}, ${sg(q.dr)})`;
    const idx = (c, r) => list.map((q, k) => (q.c === c && q.r === r ? k + 1 : 0)).filter(Boolean);
    let cells = "";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const hits = idx(c, r), who = c === CT.c && r === CT.r ? "You" : c === FT.c && r === FT.r ? "Foe" : "";
      cells += `<button type="button" class="fx-tilebtn ${hits.length ? "on" : ""} ${who ? "who-" + who.toLowerCase() : ""}" data-tile="${i}:${f}" data-c="${c}" data-r="${r}" aria-label="Tile column ${c + 1}, row ${r + 1}${who ? " (" + who + ")" : ""}${hits.length ? ", point " + hits.join(" and ") : ""}">${hits.length ? (many ? hits.join("·") : (f === "reel_tie" ? "Tie" : "Land")) : who ? `<span class="who">${who}</span>` : ""}</button>`;
    }
    const cap = sp.max_items, over = many && cap && list.length > cap;
    return `<div class="field fx-tilefield" id="tf-${i}-${f}"><label>${esc(label)} <span class="val">${many ? `${list.length}${cap ? " of " + cap : ""}` : list.length ? "Set" : sp.nullable ? "Not set" : ""}</span></label>
      <p class="fx-note" style="margin:0 0 8px">${esc(hint)}</p>
      ${rel && raw.length ? `<p class="fx-note fx-offsets" style="margin:0 0 8px">Saved as offsets from the ${st.anchor === "target" ? "target" : "caster"}: ${raw.slice(0, 6).map(off).join(" ")}${raw.length > 6 ? " …" : ""}</p>` : ""}
      ${COLS * ROWS <= 4 ? `<p class="fx-note" style="margin:0 0 8px">The preview board is ${COLS} × ${ROWS}. Make it bigger under Preview board to draw longer paths.</p>` : ""}
      <div class="fx-tilegrid" style="grid-template-columns:repeat(${COLS},1fr)" role="group" aria-label="${esc(label)}">${cells}</div>
      ${over ? `<p class="fx-cap">Over ${cap}: games use the first ${cap}. The extra points stay saved.</p>` : ""}
      ${many || sp.nullable ? `<div class="list-actions" style="margin-top:8px">${many ? `<button type="button" class="btn btn-ghost" data-tile-undo="${i}:${f}" ${list.length ? "" : "disabled"}>Remove last</button>` : ""}<button type="button" class="btn btn-ghost" data-tile-clear="${i}:${f}" ${list.length ? "" : "disabled"}>${many ? "Clear" : "Unset"}</button></div>` : ""}</div>`;
  }
  function many0(sp) { return sp.type === "tiles"; }
  function colourPair(i, label) {
    const f = S.work.v.steps[i];
    const sw = (fld) => `<div class="field"><label>${fld === "tint_from" ? "From" : "To"} <span class="val">${esc(f[fld])}</span></label><div class="swatch-grid" role="group" aria-label="${label} ${fld === "tint_from" ? "from" : "to"}">${TINTS.concat(GLOWS.slice(0, 3)).map((c) => `<button type="button" class="swatch" data-step-colour="${i}:${fld}" data-value="${c}" style="background:${c}" aria-pressed="${c === f[fld]}" aria-label="${c}"></button>`).join("")}<span class="colour-custom"><input type="color" data-step-colour-in="${i}:${fld}" value="${f[fld]}" aria-label="${label}: any colour" /></span></div></div>`;
    return `<div class="fx-ramp-bar" style="background:linear-gradient(90deg, ${f.tint_from}, ${f.tint_to})" aria-hidden="true"></div>${sw("tint_from")}${sw("tint_to")}`;
  }
  function stepBody(i) {
    const f = S.work.v.steps[i];
    const rel = i > 0 && ["straight", "swerve", "bounce"].includes(f.kind);
    let kh = "";
    if (f.kind === "straight") kh = sPick(i, "lock", "Aim", [["target", "Lock onto the foe"], ["free", "Free fire past it"]]) + (f.lock === "free" ? sSlider(i, "pierce", "Tiles past the aim", "1") : "");
    if (f.kind === "swerve") kh = sSlider(i, "bend", "Bend (left − / right +)");
    if (f.kind === "row") kh = sSlider(i, "row_count", "How many", "0") + sSlider(i, "row_gap", "Gap (tiles)");
    if (f.kind === "orbit") kh = sSlider(i, "orbit_count", "How many", "0") + sSlider(i, "orbit_radius", "Ring size (tiles)") + sSlider(i, "orbit_turns", "Turns");
    if (f.kind === "cone") kh = sSlider(i, "cone_rows", "Rows it climbs", "0") + sSlider(i, "cone_angle", "Tilt (degrees)", "0") + sSlider(i, "cone_ribbon", "Slash width (tiles)");
    if (f.kind === "reel") kh = sSlider(i, "reel_reach", "Reach (tiles)", "0") + sPick(i, "reel_pull", "Pull", ITEM_OPT("reel_pull").map(([v]) => [v, v === "yank" ? "Yank all the way" : "Chain, one tile"])) + sPick(i, "reel_anchor", "Tied to", ITEM_OPT("reel_anchor").map(([v]) => [v, v === "you" ? "You" : "A tile"])) + (f.reel_anchor === "tile" ? tileField(i, "reel_tie", "Tie tile", "Tap the tile the chain is tied to.") : "") + (f.reel_pull === "yank" ? tileField(i, "reel_land", "Landing tile", "Tap where the foe lands. Not set: the tile in front of the tie.") : tileField(i, "reel_links", "Chain bodies", "Tap each extra body in order. Each moves one tile closer."));
    if (f.kind === "trace") kh = tileField(i, "trace_points", "Path", "Tap tiles in order to draw the path. Empty: it flies straight.");
    if (f.kind === "bounce") kh = tileField(i, "bounce_points", "Bounce tiles", "Tap the tiles it hits, in order. Empty: it flies straight.");
    if (["trace", "bounce", "reel"].includes(f.kind)) kh = anchorField(i) + kh;
    if (f.kind === "scratch") kh = `<p class="fx-note" style="margin-bottom:12px">Draws a slash line to the foe, holds, then fades.</p>`;
    const look = f.scale_on || f.glow_on || f.fade_on || f.tint_on;
    return `<div class="fx-step-body">
      ${sPick(i, "kind", "What it does", kindOpts())}
      ${sSlider(i, "seconds", "Length (seconds)")}
      ${rel ? sPick(i, "release", "How they leave", [["together", "All at once"], ["split", "Split and curve"]]) : ""}
      ${kh}
      ${stepPicField(i)}
      <p class="fx-sub-title">Look across this step</p>
      ${sTog(i, "scale_on", "Grow or shrink")}${f.scale_on ? sSlider(i, "scale_from", "Size from") + sSlider(i, "scale_to", "Size to") : ""}
      ${sTog(i, "glow_on", "Glow change")}${f.glow_on ? sSlider(i, "glow_from", "Glow from", "0") + sSlider(i, "glow_to", "Glow to", "0") : ""}
      ${sTog(i, "fade_on", "Fade")}${f.fade_on ? sSlider(i, "fade_from", "Opacity from") + sSlider(i, "fade_to", "Opacity to") : ""}
      ${look ? sPick(i, "look_ease", "Look change ease", ITEM_OPT("look_ease").map(([v]) => [v, EASE_WORD[v]])) : ""}
      ${sTog(i, "tint_on", "Colour change")}${f.tint_on ? colourPair(i, "Colour change") : ""}
      ${usesSpread(f) ? `<p class="fx-sub-title">Let copies differ</p>${sSlider(i, "jitter", "Wobble off the path (tiles)")}${sSlider(i, "start_spread", "Start spread")}${sSlider(i, "size_spread", "Size spread")}` : ""}
      <p class="fx-sub-title">Second motion in this step</p>
      ${sPick(i, "layer_kind", "Also do", ITEM_OPT("layer_kind").map(([v]) => [v, v === "none" ? "Nothing" : KIND_UI[v][0]]))}
      ${f.layer_kind !== "none" ? sSlider(i, "layer_delay", "Starts late by (part of the step)") : ""}
    </div>`;
  }
  function anchorField(i) {
    const f = S.work.v.steps[i], cur = f.anchor === "target" ? "target" : "caster";
    return `<div class="field fx-inline"><label>Points start from</label><div class="seg" role="group" aria-label="Points start from">${[["caster", "Caster"], ["target", "Target"]].map(([v, l]) => `<button type="button" class="toggle" data-anchor="${i}" data-value="${v}" aria-pressed="${cur === v}">${l}</button>`).join("")}</div></div>
      <p class="fx-note" style="margin:-6px 0 12px">Each tile is saved as a step from the ${cur} (left and up are negative)${S.work.v.rotate_with_facing !== false ? ", and turns with a caster that has a facing" : ""}.</p>`;
  }
  function rebase(f, to) {
    setBoard(S.work.v);
    const conv = (q) => { if (!q) return q; const a = absQ(f, q); const g = Object.assign({}, f, { anchor: to }); return relQ(g, a.c, a.r); };
    ["trace_points", "bounce_points", "reel_links"].forEach((k) => { if (Array.isArray(f[k])) f[k] = f[k].map(conv); });
    ["reel_land", "reel_tie"].forEach((k) => { if (f[k]) f[k] = conv(f[k]); });
    f.anchor = to;
  }
  function stepPicField(i) {
    const f = S.work.v.steps[i], cur = f.picture || "";
    const assets = cc0List().concat(S.sprites);
    const opts = [["", "Effect's picture"]].concat(assets.map((a) => [a.id, a.name]));
    const miss = cur && !findAsset(cur);
    return `<div class="field"><label>Picture for this step <span class="tag-mock">proposed</span></label><div class="picker-grid" role="group" aria-label="Picture for this step">${opts.map(([id, l]) => `<button type="button" class="toggle" data-step-picture="${i}" data-value="${esc(id)}" aria-pressed="${id === cur}">${esc(l)}</button>`).join("")}</div>
      ${miss ? `<div class="check warn" style="margin-top:8px"><span class="ic" aria-hidden="true">!</span><span>Picture not in the project. This step draws the stock picture.</span></div>` : ""}
      <p class="fx-note">“Effect's picture” saves nothing for this step (null).</p></div>`;
  }
  function damageOwner() { if (S.returnTo) return S.returnTo; const id = S.work && S.work.id; const a = id ? Object.keys(S.assign).find((k) => S.assign[k] === id) : null; return a || null; }
  function ruleDamage(owner) {
    if (!owner || !S.cat) return null; const o = S.cat.behaviours.find((b) => b.id === owner); if (!o) return null;
    const k = o.knobs.find((x) => x.type === "slider" && /damage/.test(x.id)); return k ? k.default : null;
  }
  function damageInfo() {
    const o = damageOwner(), d = ruleDamage(o);
    return `<div class="fx-readonly" role="note"><span class="ic" aria-hidden="true">i</span><span>${d != null ? `<strong>${esc(ownerName(o))} hits for ${d}</strong> (set by the ability rules). Change it there, not here.` : "Damage comes from each ability's rules. This effect only changes the look."}</span></div>`;
  }
  function boothFields(v) {
    const b = boardOf(v), place = S.boothPlace || "caster";
    let cells = "";
    for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.cols; c++) {
      const who = c === b.ct.c && r === b.ct.r ? "You" : c === b.ft.c && r === b.ft.r ? "Foe" : "";
      cells += `<button type="button" class="fx-tilebtn ${who ? "who-" + who.toLowerCase() : ""}" data-booth-c="${c}" data-booth-r="${r}" aria-label="Square column ${c + 1}, row ${r + 1}${who ? " (" + who + ")" : ""}">${who ? `<span class="who">${who}</span>` : ""}</button>`;
    }
    return `${knobSlider("booth_cols", "Columns", b.cols, "0")}${knobSlider("booth_rows", "Rows", b.rows, "0")}
      <div class="field"><label>Place</label><div class="seg" role="group" aria-label="Place"><button type="button" class="toggle" data-booth-place="caster" aria-pressed="${place === "caster"}">You (caster)</button><button type="button" class="toggle" data-booth-place="foe" aria-pressed="${place === "foe"}">Foe (target)</button></div>
        <div class="fx-tilegrid" style="grid-template-columns:repeat(${b.cols},1fr);margin-top:10px" role="group" aria-label="Preview board squares">${cells}</div>
        <p class="fx-note">Only for this preview. In a game the effect plays between the real caster and target.</p></div>
      <div class="field"><label>Pieces <span class="val">${S.unitSprites ? "Project sprites" : "Shapes"}</span></label>
        <p class="fx-note" style="margin:0 0 8px">${S.unitSprites ? "Using your project's unit sprites: Archer for you, Rival Knight for the foe." : "No unit sprites in this project yet, so the preview shows shapes. Add unit art and it switches on its own."}</p>
        <div class="field fx-inline" style="margin:0;padding:0;border:0;box-shadow:none;background:none"><label><span class="tag-mock">Mock only</span> Project has unit sprites</label><div class="seg" role="group" aria-label="Mock: project has unit sprites"><button type="button" class="toggle" data-mock-sprites="true" aria-pressed="${S.unitSprites}">Yes</button><button type="button" class="toggle" data-mock-sprites="false" aria-pressed="${!S.unitSprites}">No</button></div></div></div>`;
  }
  function renderAdvanced() {
    const v = S.work.v, b = $("#des-body"), n = v.steps.length, max = S.knobs.steps.max_items;
    const pv = playable(v), total = totalOf(pv), ht = hitTime(pv);
    const L = (id, map) => KNOB_OPT(id).map(([val]) => [val, map[val] || val]);
    b.innerHTML = `${toolsBar()}
      <p class="beh-group-title">Motion steps · ${n > max ? `${n} (first ${max} play)` : `${n} of ${max}`}</p>
      <div class="fx-timeline" role="group" aria-label="Step timeline">
        ${v.steps.map((f, i) => `<button type="button" data-tl="${i}" class="${i >= max ? "skip" : ""}" style="flex:${f.seconds}" aria-pressed="${S.openStep === i}" aria-label="Step ${i + 1}: ${esc(KIND_UI[f.kind][0])}, ${f.seconds.toFixed(2)} seconds${i >= max ? ", won't play" : ""}">${i + 1} ${esc(KIND_UI[f.kind][0])}</button>`).join("")}
        <span class="fx-hitmark" style="left:calc(${(ht / totalOf(v)) * 100}% - 1px)" aria-hidden="true"></span>
      </div>
      <div class="fx-tl-legend"><span>Tap a block to edit it</span><span class="hitkey">Hit lands at ${ht.toFixed(2)} s</span></div>
      ${v.steps.map((f, i) => `<div class="fx-step ${S.openStep === i ? "open" : ""}" id="step-${i}">
        <div class="fx-step-head">
          <span class="fx-step-num ${i >= max ? "skip" : ""}" aria-hidden="true">${i + 1}</span>
          <button type="button" class="fx-open" data-open="${i}" aria-expanded="${S.openStep === i}"><span class="name">${esc(KIND_UI[f.kind][0])}</span><span class="sub">${f.seconds.toFixed(2)} s · ${i >= max ? "Won't play (over " + max + ")" : esc(KIND_UI[f.kind][1])}</span></button>
          <button type="button" class="btn btn-ghost" data-up="${i}" ${i === 0 ? "disabled" : ""} aria-label="Move step ${i + 1} up">↑</button>
          <button type="button" class="btn btn-ghost" data-down="${i}" ${i === n - 1 ? "disabled" : ""} aria-label="Move step ${i + 1} down">↓</button>
          <button type="button" class="btn btn-ghost" data-del="${i}" ${n === 1 ? "disabled" : ""} aria-label="Remove step ${i + 1}">✕</button>
        </div>${S.openStep === i ? stepBody(i) : ""}</div>`).join("")}
      <button type="button" class="btn btn-primary fx-add" id="fx-add">${n > max ? `+ Add step (${n} · first ${max} play)` : `+ Add step (${n} of ${max})`}</button>
      ${n > max ? `<p class="fx-cap" id="fx-cap">More than ${max} steps. Preview and exported games both play only the first ${max}; ${n > max + 1 ? `steps ${max + 1}–${n} stay` : `step ${max + 1} stays`} saved but won't play.</p>` : n === max ? `<p class="fx-cap" id="fx-cap">${max} steps is the most that plays, in Preview and in exported games. You can add more, but both skip them.</p>` : `<p class="fx-note" style="margin-bottom:14px">The hit lands in the last step. Earlier steps are the wind-up.</p>`}
      <details class="advanced" ${S.advOpen.look ? "open" : ""} data-sec="look"><summary>Look</summary><div class="inner">
        ${swatches("glow", "Glow colour", GLOWS, v.glow)}
        ${knobSlider("glow_size", "Glow size", v.glow_size, "0")}
        ${knobSlider("spin", "Rest angle (degrees)", v.spin, "0")}
        ${toggleField("trail", "Trail", v.trail)}
      </div></details>
      <details class="advanced" ${S.advOpen.birth ? "open" : ""} data-sec="birth"><summary>Where it starts</summary><div class="inner">
        ${pickerField("spawn", "Starts", L("spawn", { "drop-on-tile": "Drops on the target", "from-caster": "On you", beside: "Beside you", "in-front": "In front of you" }), v.spawn)}
        ${v.spawn === "drop-on-tile" ? knobSlider("drop", "Drop height (tiles)", v.drop) : ""}
        ${pickerField("ease", "Motion ease", L("ease", EASE_WORD), v.ease)}
        ${pickerField("edge", "At the board edge", L("edge", { off: "Fly off", stop: "Stop", clip: "Vanish", bounce: "Bounce back" }), v.edge)}
        ${toggleField("rotate_with_facing", "Turn points with facing", v.rotate_with_facing !== false, "Paths and tiles turn when the caster faces up, down or left. No effect for units with no facing, like the pieces in this preview.")}
      </div></details>
      <details class="advanced" ${S.advOpen.booth ? "open" : ""} data-sec="booth"><summary>Preview board</summary><div class="inner">${boothFields(v)}</div></details>
      <details class="advanced" ${S.advOpen.hit ? "open" : ""} data-sec="hit"><summary>Hit (looks only)</summary><div class="inner">
        ${pickerField("hit", "Foe reaction", L("hit", { none: "None", nudge: "Nudge", "knock-1": "Knock back 1", split: "Split" }), v.hit, "Visual only. Real pushes stay in the ability's rules.")}
        ${v.hit === "nudge" ? knobSlider("nudge", "Nudge distance (tiles)", v.nudge) : ""}
        ${damageInfo()}
        ${pickerField("damage_label", "Damage number", L("damage_label", { none: "Don't show", "show-rule-damage": "Show the rule's damage" }), v.damage_label)}
        ${toggleField("impact", "Hit flash", v.impact)}
        ${v.impact ? swatches("impact_colour", "Flash colour", GLOWS, v.impact_colour) + knobSlider("sparks", "Sparks", v.sparks, "0") + knobSlider("impact_radius", "Flash size (tiles)", v.impact_radius) : ""}
      </div></details>
      <details class="advanced" ${S.advOpen.tags ? "open" : ""} data-sec="tags"><summary>Library tags</summary><div class="inner">
        <p class="fx-note" style="margin:0 0 8px">Short labels to find this effect later. Add as many as you like.</p>
        <div class="seg" role="group" aria-label="Tags">${v.tags.map((t, k) => `<button type="button" class="toggle" data-tag-del="${k}" aria-label="Remove tag ${esc(t.label)}">${esc(t.label)} ✕</button>`).join("") || `<span class="fx-note" style="margin:0">No tags yet.</span>`}</div>
        ${v.tags.length > S.knobs.tags.max_items ? `<p class="fx-cap">More than ${S.knobs.tags.max_items} tags. That's fine: nothing is blocked and every tag stays saved. Exports to the BTF booth keep only the first ${S.knobs.tags.max_items}.</p>` : ""}
        <div class="fx-tag-add"><input class="fx-input" id="fx-tag" maxlength="${TAG_MAX()}" placeholder="Add a tag, e.g. holy" aria-describedby="fx-tag-count" /><button type="button" class="btn btn-ghost" id="fx-tag-add">Add</button></div>
        <p class="fx-note" id="fx-tag-count" style="margin:6px 0 0">0 / ${TAG_MAX()} · ${TAG_MAX()} characters max per tag</p>
      </div></details>
      <details class="advanced" ${S.advOpen.time ? "open" : ""} data-sec="time"><summary>Timing &amp; sound</summary><div class="inner">
        ${knobSlider("connect", "Hit lands, through last step", v.connect, "pct")}
        <div class="field"><label for="fx-cue">Sound name <span class="val">${v.cue_name.length} / ${CUE_MAX()}</span></label><input class="fx-input" id="fx-cue" maxlength="${CUE_MAX()}" placeholder="e.g. sword-swish" value="${esc(v.cue_name)}" /><p class="fx-note">Any name your game's sounds use. Leave empty for no sound. The preview is silent.</p></div>
        <div id="fx-cue-at-wrap" class="${v.cue_name ? "" : "is-off"}">${knobSlider("cue_at", "Sound at (seconds)", v.cue_at, "2")}<p class="fx-note" id="fx-cue-at-note" style="margin-top:-6px"${v.cue_name ? " hidden" : ""}>Add a sound name to use this.</p></div>
      </div></details>`;
    bindCommon(b);
    $$("details[data-sec]", b).forEach((d) => d.addEventListener("toggle", () => (S.advOpen[d.dataset.sec] = d.open)));
    $$("[data-tl],[data-open]", b).forEach((btn) => btn.addEventListener("click", () => {
      const i = +(btn.dataset.tl != null ? btn.dataset.tl : btn.dataset.open);
      S.openStep = S.openStep === i ? null : i; renderAdvanced();
      const el = $("#step-" + i); if (el && S.openStep === i) b.scrollTop = el.offsetTop - b.offsetTop - 8;
    }));
    $$("[data-up]", b).forEach((btn) => btn.addEventListener("click", () => moveStep(+btn.dataset.up, -1)));
    $$("[data-down]", b).forEach((btn) => btn.addEventListener("click", () => moveStep(+btn.dataset.down, 1)));
    $$("[data-del]", b).forEach((btn) => btn.addEventListener("click", () => { const i = +btn.dataset.del; edit(once(), (vv) => { vv.steps.splice(i, 1); relabel(vv); }); S.openStep = null; keepScroll(renderAdvanced); toast(`Step ${i + 1} removed. Undo brings it back.`); }));
    $("#fx-add").addEventListener("click", addStep);
    $$("[data-tile]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.tile.split(":"); setBoard(S.work.v); const q = relQ(S.work.v.steps[+i], +btn.dataset.c, +btn.dataset.r); const many = itemSpec(f).type === "tiles"; edit(once(), (vv) => { if (many) vv.steps[+i][f] = vv.steps[+i][f].concat([q]); else vv.steps[+i][f] = q; }); keepScroll(renderAdvanced); }));
    $$("[data-tile-undo]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.tileUndo.split(":"); edit(once(), (vv) => vv.steps[+i][f].pop()); keepScroll(renderAdvanced); }));
    $$("[data-tile-clear]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.tileClear.split(":"); const sp = itemSpec(f); edit(once(), (vv) => (vv.steps[+i][f] = sp.type === "tiles" ? [] : null)); keepScroll(renderAdvanced); }));
    $$("[data-step-colour]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.stepColour.split(":"); edit(once(), (vv) => (vv.steps[+i][f] = btn.dataset.value)); keepScroll(renderAdvanced); }));
    $$("[data-step-colour-in]", b).forEach((inp) => inp.addEventListener("change", () => { const [i, f] = inp.dataset.stepColourIn.split(":"); edit(once(), (vv) => (vv.steps[+i][f] = inp.value)); keepScroll(renderAdvanced); }));
    const cue = $("#fx-cue", b); if (cue) { cue.addEventListener("input", () => { const name = cue.value.slice(0, CUE_MAX()); edit("cue_name", (vv) => (vv.cue_name = name)); cue.previousElementSibling.querySelector(".val").textContent = `${name.length} / ${CUE_MAX()}`; }); cue.addEventListener("input", () => { const on = !!cue.value; const w = $("#fx-cue-at-wrap", b); if (w) w.classList.toggle("is-off", !on); const nt = $("#fx-cue-at-note", b); if (nt) nt.hidden = on; }); }
    const ca = $("#ks-cue_at", b); if (ca && !S.work.v.cue_name) ca.disabled = true;
    const tagAdd = () => { const inp = $("#fx-tag", b); const t = inp.value.trim(); if (!t) return; const id = t.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+/, "").slice(0, 32) || "tag"; if (S.work.v.tags.some((x) => x.id === id)) return toast("That tag is already there"); edit(once(), (vv) => vv.tags.push({ id, label: t.slice(0, TAG_MAX()) })); S.advOpen.tags = true; keepScroll(renderAdvanced); };
    const ti = $("#fx-tag", b); if (ti) ti.addEventListener("input", () => { $("#fx-tag-count", b).textContent = `${ti.value.length} / ${TAG_MAX()} · ${TAG_MAX()} characters max per tag`; });
    const ta = $("#fx-tag-add", b); if (ta) { ta.addEventListener("click", tagAdd); $("#fx-tag", b).addEventListener("keydown", (e) => { if (e.key === "Enter") tagAdd(); }); }
    $$("[data-tag-del]", b).forEach((btn) => btn.addEventListener("click", () => { const k = +btn.dataset.tagDel; edit(once(), (vv) => vv.tags.splice(k, 1)); keepScroll(renderAdvanced); }));
    $$("[data-step-slider]", b).forEach((inp) => {
      inp.addEventListener("input", () => { const [i, f] = inp.dataset.stepSlider.split(":"); edit("s" + i + f, (vv) => (vv.steps[+i][f] = +inp.value)); $(`#${inp.id}-val`).textContent = fmtBy(inp.dataset.fmt, inp.value); });
      inp.addEventListener("change", () => keepScroll(renderAdvanced));
    });
    $$("[data-mock-sprites]", b).forEach((btn) => btn.addEventListener("click", () => { S.unitSprites = btn.dataset.mockSprites === "true"; keepScroll(renderAdvanced); }));
    $$("[data-booth-place]", b).forEach((btn) => btn.addEventListener("click", () => { S.boothPlace = btn.dataset.boothPlace; keepScroll(renderAdvanced); }));
    $$("[data-booth-c]", b).forEach((btn) => btn.addEventListener("click", () => {
      const q = { c: +btn.dataset.boothC, r: +btn.dataset.boothR }, bo = boardOf(S.work.v), k = (S.boothPlace || "caster") === "caster" ? "booth_caster" : "booth_foe";
      const other = k === "booth_caster" ? bo.ft : bo.ct; if (other.c === q.c && other.r === q.r) return toast("You and the foe need different squares");
      edit(once(), (vv) => { vv.booth_caster = bo.ct; vv.booth_foe = bo.ft; vv[k] = q; }); keepScroll(renderAdvanced);
    }));
    ["booth_cols", "booth_rows"].forEach((id) => { const el = $("#ks-" + id, b); if (el) el.addEventListener("change", () => { const bo = boardOf(S.work.v); edit(once(), (vv) => { vv.booth_caster = bo.ct; vv.booth_foe = bo.ft.c === bo.ct.c && bo.ft.r === bo.ct.r ? { c: Math.min(bo.cols - 1, bo.ct.c + 1) === bo.ct.c ? bo.ct.c - 1 : bo.ct.c + 1, r: bo.ct.r } : bo.ft; }); keepScroll(renderAdvanced); }); });
    $$("[data-anchor]", b).forEach((btn) => btn.addEventListener("click", () => { const i = +btn.dataset.anchor; edit(once(), (vv) => rebase(vv.steps[i], btn.dataset.value)); keepScroll(renderAdvanced); }));
    $$("[data-step-picture]", b).forEach((btn) => btn.addEventListener("click", () => { const i = +btn.dataset.stepPicture, id = btn.dataset.value || null; edit(once(), (vv) => (vv.steps[i].picture = id)); keepScroll(renderAdvanced); }));
    $$("[data-step-pick]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.stepPick.split(":"); const val = itemSpec(f).type === "slider" ? +btn.dataset.value : btn.dataset.value; edit(once(), (vv) => (vv.steps[+i][f] = val)); keepScroll(renderAdvanced); }));
    $$("[data-step-tog]", b).forEach((btn) => btn.addEventListener("click", () => { const [i, f] = btn.dataset.stepTog.split(":"); edit(once(), (vv) => (vv.steps[+i][f] = btn.dataset.value === "true")); keepScroll(renderAdvanced); }));
    updateBar();
  }
  function relabel(v) { v.steps.forEach((f, j) => { f.id = "step-" + (j + 1); f.label = "Step " + (j + 1); }); }
  function moveStep(i, d) { edit(once(), (v) => { const [s] = v.steps.splice(i, 1); v.steps.splice(i + d, 0, s); relabel(v); }); if (S.openStep === i) S.openStep = i + d; keepScroll(renderAdvanced); }
  function addStep() {
    const v = S.work.v;
    edit(once(), (vv) => vv.steps.push(newStep("straight", vv.steps.length)));
    S.openStep = v.steps.length - 1; renderAdvanced();
    const el = $("#step-" + S.openStep), b = $("#des-body"); if (el) b.scrollTop = el.offsetTop - b.offsetTop - 8;
  }

  // ---------- designer shell ----------
  function renderDesign() {
    if (!S.work) startFrom("btf-purple-drop");
    $("#des-eyebrow").textContent = S.work.id ? "Effect Designer · Your effect" : "New effect · Step 2 of 2";
    $("#des-title").textContent = S.work.label;
    $("#des-base").innerHTML = `From ${esc(presetName(S.work.base))}`;
    const ret = $("#des-return");
    if (S.returnTo) { ret.hidden = false; ret.textContent = `Designing for ${ownerName(S.returnTo)}. Saving takes you back to it.`; $("#des-save").textContent = `Save & use`; }
    else { ret.hidden = true; $("#des-save").textContent = "Save effect"; }
    mountStage($("#des-stage"), () => S.work && S.work.v, 44, true);
    $("#tab-simple").setAttribute("aria-pressed", String(S.tab !== "advanced"));
    $("#tab-adv").setAttribute("aria-pressed", String(S.tab === "advanced"));
    rerender();
  }
  function mountStage(host, getV, tile, main) {
    host.innerHTML = "";
    const wrap = document.createElement("div"); wrap.className = "fx-board";
    const cv = makeBoard(tile, getV); cv._main = !!main; cv.setAttribute("aria-label", "Live preview: you on the left, the foe on the right");
    wrap.appendChild(cv); host.appendChild(wrap);
    const ctl = document.createElement("div"); ctl.className = "fx-ctrl";
    ctl.innerHTML = `<button type="button" class="tool" data-replay>↻ Replay</button><button type="button" class="tool" data-rate aria-pressed="${S.previewRate !== 1}">${S.previewRate === 1 ? "Speed 1×" : "Speed ½×"}</button><span class="fx-clock"></span>`;
    host.appendChild(ctl);
    cv._clock = $(".fx-clock", ctl);
    $("[data-replay]", ctl).addEventListener("click", () => { cv._t0 = performance.now(); });
    $("[data-rate]", ctl).addEventListener("click", (e) => { S.previewRate = S.previewRate === 1 ? 0.5 : 1; e.currentTarget.textContent = S.previewRate === 1 ? "Speed 1×" : "Speed ½×"; e.currentTarget.setAttribute("aria-pressed", String(S.previewRate !== 1)); cv._t0 = performance.now(); });
    return cv;
  }

  // ---------- presets ----------
  function renderPresets() {
    $("#pre-eyebrow").textContent = S.returnTo ? `New effect for ${ownerName(S.returnTo)} · Step 1 of 2` : "New effect · Step 1 of 2";
    const stage = $("#pre-stage");
    if (S.pickPreset) { const pv = presetValues(S.pickPreset); mountStage(stage, () => pv, 50, true); }
    else stage.innerHTML = `<div class="fx-empty">Tap a look to watch it here. You can change everything after.</div>`;
    const b = $("#pre-body");
    const tile = (p) => `<button type="button" class="fx-tile" data-preset="${p.id}" aria-pressed="${S.pickPreset === p.id}"><span class="cv"></span><span class="fx-name">${esc(presetName(p.id))} <span class="tag-btf">BTF</span></span><span class="fx-recipe"><span class="pic" data-pic="${esc((p.look && p.look.blade) || p.overrides.blade || "cut")}"></span><span class="fx-recipe-chip">${esc(recipeLabel(p))}</span></span><span class="sub">${esc(presetBlurb(p.id))}</span></button>`;
    b.innerHTML = `<p class="beh-group-title">Built-in looks from Before The Fall</p><p class="fx-note" style="margin:-4px 0 8px">Each look is a motion recipe plus a picture.</p><div class="fx-grid" role="group" aria-label="Built-in looks">${S.presets.map(tile).join("")}</div>`;
    $$("[data-preset]", b).forEach((btn) => {
      const pid = btn.dataset.preset; const v = presetValues(pid);
      const cv = makeBoard(25, () => v); cv.setAttribute("aria-hidden", "true"); $(".cv", btn).appendChild(cv);
      const ph = $(".pic", btn); const th = thumbCanvas(ph.dataset.pic, v.tint, v.glow); th.style.width = th.style.height = "24px"; th.classList.remove("checker"); ph.appendChild(th);
      btn.addEventListener("click", () => { const top = b.scrollTop; S.pickPreset = pid; history.replaceState(null, "", "#presets/" + pid.replace(/^btf-/, "")); renderPresets(); b.scrollTop = top; });
    });
    $("#pre-go").disabled = !S.pickPreset;
    $("#pre-go").textContent = S.pickPreset ? `Use ${presetName(S.pickPreset)}` : "Use this look";
  }

  // ---------- picture (sprite) picker ----------
  function renderSprite() {
    const v = S.work.v, b = $("#spr-body");
    if (!S.picPick) S.picPick = picKey(v);
    const stockIds = KNOB_OPT("blade").map(([x]) => x);
    const own = (list, label) => `<div class="fx-stock" role="group" aria-label="${label}">${list.map((s) => `<button type="button" data-own="${s.id}" aria-pressed="${S.picPick === "asset:" + s.id}"><span class="th"></span>${esc(s.name)}</button>`).join("")}</div>`;
    b.innerHTML = `
      <p class="beh-group-title">Studio pack pictures <span class="tag-pending">Studio pack (pending)</span></p>
      <div class="fx-stock" role="group" aria-label="Studio pack pictures">${stockIds.map((id) => `<button type="button" data-stock="${id}" aria-pressed="${S.picPick === id}"><span class="th"></span>${esc(STOCK_UI[id] || id)}</button>`).join("")}</div>
      <div class="check info" id="spr-pending"><span class="ic" aria-hidden="true">i</span><span>May not ship in exported games yet. Pick a CC0 or your own picture to be safe.</span></div>
      <p class="fx-note">These take your colour. Stand-in art here.</p>
      <p class="beh-group-title" style="margin-top:18px">Built-in library <span class="tag-cc0">CC0</span></p>
      ${own(cc0List(), "Built-in library pictures")}
      <p class="fx-note">Free to ship. Copied into your project when used. They keep their own colours.</p>
      <p class="beh-group-title" style="margin-top:18px">Your pictures <span class="tag-yours">Yours</span></p>
      ${S.sprites.length ? own(S.sprites, "Your pictures") : `<p class="hint" style="margin-top:0">None yet. Upload one below.</p>`}
      <p class="fx-note">Library and uploaded pictures are saved as the effect's picture. The stock drawing stays saved underneath, greyed out, until you switch back.</p>
      <p class="beh-group-title" style="margin-top:18px">Upload a picture</p>
      <div class="upload-zone" style="min-height:0;padding:14px;margin-bottom:12px">
        <span>PNG with a see-through background. Small pixel art works best (16, 32 or 64 px). It is never stretched or blurred.</span>
        <label class="file-btn">Choose image<input type="file" id="spr-file" accept="image/png,image/webp,image/jpeg" /></label>
        <div class="sample-row"><span class="fx-note" style="margin:0;width:100%">Test images:</span>
          <button type="button" class="tool" data-sample="fireball">Fireball 16×16</button>
          <button type="button" class="tool" data-sample="box">Rune 24×24, no see-through</button>
          <button type="button" class="tool" data-sample="strip">Bolt strip 64×16</button></div>
      </div>
      <div id="spr-result"></div>`;
    $$("[data-stock]", b).forEach((btn) => { $(".th", btn).appendChild(thumbCanvas(btn.dataset.stock, v.tint, v.glow)); btn.addEventListener("click", () => { S.picPick = btn.dataset.stock; keepScrollOf(b, renderSprite); }); });
    $$("[data-own]", b).forEach((btn) => { $(".th", btn).appendChild(thumbCanvas("asset:" + btn.dataset.own, v.tint, v.glow, v.blade)); btn.addEventListener("click", () => { S.picPick = "asset:" + btn.dataset.own; keepScrollOf(b, renderSprite); }); });
    $$("[data-sample]", b).forEach((btn) => btn.addEventListener("click", () => loadSample(btn.dataset.sample)));
    $("#spr-file").addEventListener("change", (e) => { const f = e.target.files[0]; if (!f) return; const img = new Image(); img.onload = () => checkUpload(img, f.name, f.type); img.src = URL.createObjectURL(f); });
    $("#spr-done").textContent = `Use ${picLabel(S.picPick)}`;
    if (S.upload) renderUpload();
  }
  function keepScrollOf(el, fn) { const top = el.scrollTop; fn(); el.scrollTop = top; }
  function makeSample(kind) {
    const c = document.createElement("canvas"), x = c.getContext("2d");
    if (kind === "fireball") {
      c.width = 16; c.height = 16; const cols = ["#7a2e0e", "#c2410c", "#f97316", "#fdba74", "#fff7ed"];
      for (let y = 0; y < 16; y++) for (let xx = 0; xx < 16; xx++) {
        const d = Math.hypot(xx - 10, (y - 7.5) * (xx < 10 ? 1 + (10 - xx) * 0.12 : 1));
        const tail = xx < 10 ? (10 - xx) * 0.55 : 0;
        const r = d - tail * 0.5;
        const ii = r < 1.2 ? 4 : r < 2.4 ? 3 : r < 3.4 ? 2 : r < 4.2 ? 1 : r < 4.8 ? 0 : -1;
        if (ii >= 0) { x.fillStyle = cols[ii]; x.fillRect(xx, y, 1, 1); }
      }
    }
    if (kind === "box") { c.width = 24; c.height = 24; x.fillStyle = "#1f2a44"; x.fillRect(0, 0, 24, 24); x.fillStyle = "#93c5fd"; for (let i = 4; i < 20; i++) { x.fillRect(i, 11, 1, 2); x.fillRect(11, i, 2, 1); } x.fillStyle = "#e0f2fe"; x.fillRect(10, 10, 4, 4); }
    if (kind === "strip") { c.width = 64; c.height = 16; for (let fr = 0; fr < 4; fr++) { x.fillStyle = ["#3b82f6", "#60a5fa", "#93c5fd", "#60a5fa"][fr]; for (let xx = 2; xx < 14; xx++) { const y = 7 + Math.round(Math.sin((xx + fr * 3) * 0.9) * 3); x.fillRect(fr * 16 + xx, y, 1, 2); } x.fillStyle = "#eff6ff"; x.fillRect(fr * 16 + 12, 6, 3, 3); } }
    return c;
  }
  function loadSample(kind) {
    const c = makeSample(kind);
    const img = new Image(); img.onload = () => checkUpload(img, { fireball: "fireball-16.png", box: "rune-24.png", strip: "bolt-strip-64x16.png" }[kind], "image/png"); img.src = c.toDataURL("image/png");
  }
  function checkUpload(img, name, type) {
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data; let alpha = false; for (let i = 3; i < d.length; i += 4) if (d[i] < 255) { alpha = true; break; }
    const w = c.width, h = c.height;
    const frames = w > h && w % h === 0 ? w / h : 1;
    const fw = frames > 1 ? h : Math.max(w, h);
    S.upload = { canvas: c, name, type, w, h, alpha, frames, fw, keyed: false };
    renderUpload();
    const r = $("#spr-result"), b = $("#spr-body"); if (r && b) b.scrollTop = r.offsetTop - b.offsetTop - 8;
  }
  function frameCanvas(u) { if (u.frames <= 1) return u.canvas; const c = document.createElement("canvas"); c.width = u.h; c.height = u.h; c.getContext("2d").drawImage(u.canvas, 0, 0); return c; }
  function colourKey(u) { const x = u.canvas.getContext("2d"); const im = x.getImageData(0, 0, u.w, u.h); const d = im.data; const [r, g, b] = [d[0], d[1], d[2]]; for (let i = 0; i < d.length; i += 4) if (d[i] === r && d[i + 1] === g && d[i + 2] === b) d[i + 3] = 0; x.putImageData(im, 0, 0); u.keyed = true; u.alpha = true; }
  function renderUpload() {
    const u = S.upload, r = $("#spr-result"); if (!r) return;
    const checks = [["ok", `<strong>${esc(u.name)}</strong> · ${u.w} × ${u.h} px`]];
    if (u.type === "image/jpeg") checks.push(["warn", "JPG blurs pixel edges and can't be see-through. Save as PNG."]);
    if (!u.alpha) checks.push(["warn", `No see-through background, so it shows as a ${u.w} × ${u.h} box.<br><button type="button" class="btn btn-ghost" id="spr-key" style="margin-top:6px;width:100%">Make the corner colour see-through</button>`]);
    else checks.push(["ok", u.keyed ? "Corner colour is now see-through." : "See-through background found."]);
    if (u.frames > 1) checks.push(["info", `Looks like ${u.frames} frames of ${u.h} × ${u.h}. The first frame is used for now.`]);
    const steps = [0.5, 1, 1.5, 2, 2.5].map((s) => Math.max(1, Math.round((s * TILE_PX) / u.fw))).filter((k, i, a) => a.indexOf(k) === i);
    checks.push(["ok", `Sizes use whole zoom steps only (×${steps.join(", ×")}) with sharp pixels. Never stretched.`]);
    if (u.fw > TILE_PX * 2.5) checks.push(["warn", "Bigger than the largest effect size (2.5 tiles), so it always draws at ×1. Upload a smaller copy instead."]);
    r.innerHTML = `${checks.map(([k, t]) => `<div class="check ${k}"><span class="ic" aria-hidden="true">${k === "ok" ? "✓" : k === "warn" ? "!" : "i"}</span><span>${t}</span></div>`).join("")}
      <div class="zoom-row" id="spr-zoom" role="img" aria-label="Whole-number zoom preview"></div>
      <button type="button" class="btn btn-primary" id="spr-accept" style="width:100%">Add to your pictures</button>`;
    const fc = frameCanvas(u);
    [1, 2, 3].forEach((k) => {
      const f = document.createElement("figure"); const cv = document.createElement("canvas");
      const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1)); const sz = fc.width * k;
      cv.width = sz * dpr; cv.height = fc.height * k * dpr; cv.style.width = sz + "px"; cv.style.height = fc.height * k + "px"; cv.className = "px checker";
      const xx = cv.getContext("2d"); xx.imageSmoothingEnabled = false; xx.drawImage(fc, 0, 0, cv.width, cv.height);
      f.appendChild(cv); const cap = document.createElement("figcaption"); cap.textContent = `×${k}`; f.appendChild(cap); $("#spr-zoom").appendChild(f);
    });
    const key = $("#spr-key"); if (key) key.addEventListener("click", () => { colourKey(u); renderUpload(); });
    $("#spr-accept").addEventListener("click", () => {
      const id = "asset_up" + (S.sprites.length + 1);
      S.sprites.push({ id, name: u.name.replace(/\.[a-z]+$/i, ""), canvas: frameCanvas(u), fw: u.fw, src: "own" });
      S.picPick = "asset:" + id; S.upload = null; renderSprite(); $("#spr-body").scrollTop = 0; toast("Added to your pictures");
    });
  }

  // ---------- ability Effect row + pick sheet ----------
  const ABILITY = "sky-drop";
  function ownerName(id) { const o = S.owners.find((x) => x.id === id); return o ? o.short : id; }
  function effLabel(id) { if (!id || id === "none") return "None"; const e = effectById(id); return e ? e.label : "Missing effect (shows None)"; }
  function fmtVal(k) { const d = k.default; if (k.type === "toggle") return d ? "On" : "Off"; if (k.type === "picker") { const o = (k.options || []).find((x) => x.value === d); return o ? o.label || String(d) : String(d); } return String(d); }
  function renderAbility() {
    const o = S.cat.behaviours.find((x) => x.id === ABILITY);
    const cur = S.assign[ABILITY] || "none";
    const e = effectById(cur);
    const rules = o.knobs.filter((k) => !["effect", "ability_group"].includes(k.id) && ["slider", "toggle", "picker"].includes(k.type)).slice(0, 3);
    $("#ab-title").textContent = ownerName(ABILITY);
    const b = $("#ab-body");
    b.innerHTML = `<p class="beh-group-title">What it does</p>
      ${rules.map((k) => `<div class="summary-row" style="cursor:default"><span class="q">${esc(k.label)}</span><span class="a">${esc(fmtVal(k))}</span></div>`).join("")}
      <p class="beh-group-title">How it looks</p>
      <div class="knob-card" id="ab-effect-card"><h2>Effect</h2>
        <div class="fx-eff-row"><span class="cvh"></span><span class="meta"><span class="name">${esc(effLabel(cur))} ${e ? (e.builtin ? '<span class="tag-btf">BTF</span>' : '<span class="tag-yours">YOURS</span>') : ""}</span><br><span class="sub">${e ? "Plays when this ability is used." : "The game's own drawing."}</span></span></div>
        <div class="list-actions">
          <button type="button" class="btn btn-ghost" id="ab-pick">${cur === "none" ? "Pick an effect" : "Change"}</button>
          ${e && !e.builtin ? `<button type="button" class="btn btn-ghost" id="ab-edit">Edit effect</button>` : `<button type="button" class="btn btn-ghost" id="ab-new">Design new</button>`}
        </div>
        <p class="fx-note">Looks only. Damage, pushes and targets stay in the rules above.</p></div>`;
    const h = $(".cvh", b); if (e) { const cv = makeBoard(14, () => e.v); cv.setAttribute("aria-hidden", "true"); h.appendChild(cv); } else h.remove();
    $("#ab-pick").addEventListener("click", () => setHash("ability-pick"));
    const ed = $("#ab-edit"); if (ed) ed.addEventListener("click", () => { openSaved(cur); S.returnTo = ABILITY; S.tab = "simple"; setHash("simple"); });
    const nw = $("#ab-new"); if (nw) nw.addEventListener("click", () => { S.returnTo = ABILITY; S.pickPreset = null; setHash("presets"); });
    $("#ab-sheet").hidden = !S.sheetOpen;
    if (S.sheetOpen) renderPickSheet();
  }
  function renderPickSheet() {
    const cur = S.assign[ABILITY] || "none";
    const card = $("#ab-sheet-card");
    const row = (id, name, sub, tag) => `<button type="button" class="fx-pick fx-row" data-assign="${id}" aria-pressed="${cur === id}"><span class="cvh" data-cv="${id}"></span><span class="meta"><span class="name">${esc(name)} ${tag}</span><span class="sub">${esc(sub)}</span></span></button>`;
    card.innerHTML = `<h2 class="fx-sheet-title" id="ab-sheet-title">Effect for ${esc(ownerName(ABILITY))}</h2><p class="hint" style="margin:0 0 10px">Changes how it looks, never what it does.</p>
      <button type="button" class="btn btn-primary" id="sh-new" style="width:100%;margin-bottom:12px">+ Design a new effect</button>
      ${row("none", "None", "The game's own drawing", "")}
      <p class="beh-group-title">Your effects (${S.saved.length})</p>
      ${S.saved.map((s) => row(s.id, s.label, `From ${presetName(s.base)}`, '<span class="tag-yours">YOURS</span>')).join("") || `<p class="hint">None yet.</p>`}
      <p class="beh-group-title">Built-in</p>
      ${S.presets.map((p) => row(p.id, presetName(p.id), presetBlurb(p.id), '<span class="tag-btf">BTF</span>')).join("")}
      <button type="button" class="btn btn-ghost" id="sh-close" style="width:100%;margin-top:4px">Close</button>`;
    $$("[data-cv]", card).forEach((h) => { const e = effectById(h.dataset.cv); if (e) { const cv = makeBoard(10, () => e.v); cv.setAttribute("aria-hidden", "true"); h.appendChild(cv); } else { h.style.width = "60px"; } });
    $$("[data-assign]", card).forEach((btn) => btn.addEventListener("click", () => { S.assign[ABILITY] = btn.dataset.assign; S.sheetOpen = false; setHash("ability"); toast(`${ownerName(ABILITY)} now uses ${effLabel(btn.dataset.assign)}`); }));
    $("#sh-new").addEventListener("click", () => { S.sheetOpen = false; S.returnTo = ABILITY; S.pickPreset = null; setHash("presets"); });
    $("#sh-close").addEventListener("click", () => { S.sheetOpen = false; setHash("ability"); });
  }

  // ---------- library ----------
  let idN = 0; const nextId = () => "fx_" + ++idN;
  function usedBy(id) {
    return Object.entries(S.assign).filter(([, e]) => e === id).map(([a]) => ownerName(a))
      .concat(Object.entries(S.stageOv).filter(([, e]) => e === id).map(([k]) => { const [st, a] = k.split(":"); return `${ownerName(a)} (${STAGES[st]} only)`; }));
  }
  const STAGES = { bridge: "Bridge" };
  const byName = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const nAb = (n) => `${n} abilit${n === 1 ? "y" : "ies"}`;
  function renderLibrary() {
    $("#lib-count").textContent = `${S.saved.length} in project`;
    const b = $("#lib-body");
    const list = S.saved.slice().sort(byName);
    b.innerHTML = `<p class="hint" style="margin-top:0">Effects change how an ability looks, never what it does. Any ability's Effect row can use one. Sorted by name.</p>
      <div class="list">${list.map((s) => { const u = usedBy(s.id), n = u.length, open = S.confirmDel === s.id; return `<div class="list-item" data-item="${s.id}"><div class="fx-row"><span class="cvh"></span><span class="meta"><span class="name">${esc(s.label)}</span><span class="sub">From ${esc(presetName(s.base))} · ${s.v.steps.length} step${s.v.steps.length > 1 ? "s" : ""}</span><span class="sub">${n ? "Used by " + esc(u.join(", ")) : "Not used yet"}</span>${picMissing(s.v) ? `<span class="sub fx-warn-line">! Picture missing · draws the stock picture</span>` : ""}</span></div>
        ${open ? `<div class="fx-cap fx-del" style="margin:0"><strong>Used by ${nAb(n)}</strong>: ${esc(u.join(", "))}. Deleting leaves ${n === 1 ? "it" : "them"} with a missing-effect warning; ${n === 1 ? "it shows" : "they show"} None until you pick another.
          <button type="button" class="btn btn-danger" data-del-switch="${s.id}" style="width:100%;margin-top:8px">Delete and switch ${nAb(n)} to None</button>
          <button type="button" class="btn btn-ghost" data-del-plain="${s.id}" style="width:100%;margin-top:8px">Delete, leave the warning</button>
          <button type="button" class="btn btn-ghost" data-keep style="width:100%;margin-top:8px">Keep it</button></div>`
          : `<div class="list-actions"><button type="button" class="btn btn-ghost" data-edit="${s.id}">Edit</button><button type="button" class="btn btn-ghost" data-useon="${s.id}">Use on…</button><button type="button" class="btn btn-ghost" data-dupl="${s.id}">Duplicate</button><button type="button" class="btn btn-danger" data-delete="${s.id}">Delete</button></div>`}</div>`; }).join("") || `<p class="hint">No effects yet. Tap New effect.</p>`}</div>
      <p class="fx-note" style="margin-top:12px">The 10 built-in BTF looks are presets, not project effects, so they can't be deleted. Pick them from New effect or any Effect row.</p>`;
    $$("[data-item]", b).forEach((it) => { const e = S.saved.find((x) => x.id === it.dataset.item); const cv = makeBoard(14, () => e.v); cv.setAttribute("aria-hidden", "true"); $(".cvh", it).appendChild(cv); });
    $$("[data-edit]", b).forEach((x) => x.addEventListener("click", () => { openSaved(x.dataset.edit); S.returnTo = null; S.tab = "simple"; setHash("simple"); }));
    $$("[data-useon]", b).forEach((x) => x.addEventListener("click", () => { openSaved(x.dataset.useon); openUseOn(); }));
    $$("[data-dupl]", b).forEach((x) => x.addEventListener("click", () => {
      const e = S.saved.find((s) => s.id === x.dataset.dupl), n = usedBy(e.id).length, before = pSnap();
      const c = dupDoc(e); renderLibrary();
      pCommit(`Duplicate ${e.label}`, before, `Duplicated as “${c.label}”. ${n ? `${nAb(n)} still ${n === 1 ? "uses" : "use"} “${e.label}”.` : "Abilities keep using the original."}`);
      const el = $(`[data-item="${c.id}"]`, b); if (el) el.classList.add("fx-flash");
    }));
    const doDelete = (id, sw) => {
      const e = S.saved.find((s) => s.id === id), n = usedBy(id).length, before = pSnap();
      S.saved = S.saved.filter((s) => s.id !== id);
      if (sw) { for (const a in S.assign) if (S.assign[a] === id) S.assign[a] = "none"; for (const k in S.stageOv) if (S.stageOv[k] === id) S.stageOv[k] = "none"; }
      S.confirmDel = null; renderLibrary();
      pCommit(sw ? `Delete ${e.label} and switch ${nAb(n)}` : `Delete ${e.label}`, before,
        sw ? `Deleted “${e.label}” and switched ${nAb(n)} to None. One undo.` : n ? `Deleted “${e.label}”. ${nAb(n)} now ${n === 1 ? "shows" : "show"} a missing-effect warning.` : `Deleted “${e.label}”.`);
    };
    $$("[data-delete]", b).forEach((x) => x.addEventListener("click", () => { const id = x.dataset.delete; if (usedBy(id).length) { S.confirmDel = id; renderLibrary(); return; } doDelete(id, false); }));
    $$("[data-del-plain]", b).forEach((x) => x.addEventListener("click", () => doDelete(x.dataset.delPlain, false)));
    $$("[data-del-switch]", b).forEach((x) => x.addEventListener("click", () => doDelete(x.dataset.delSwitch, true)));
    $$("[data-keep]", b).forEach((x) => x.addEventListener("click", () => { S.confirmDel = null; renderLibrary(); }));
  }
  function dupDoc(e) { const c = clone(e); c.id = nextId(); c.label = uniqueName(e.label + " copy"); c.copiedFrom = e.id; S.saved.push(c); return c; }
  function save() {
    const w = S.work, before = pSnap();
    if (!w.id) { w.id = nextId(); w.label = uniqueName(w.label); S.saved.push(clone(w)); }
    else { const i = S.saved.findIndex((s) => s.id === w.id); S.saved[i] = clone(w); }
    if (S.returnTo) { const a = S.returnTo; S.assign[a] = w.id; S.returnTo = null; setHash("ability"); pCommit(`Save & use ${w.label}`, before, `Saved “${w.label}” and ${ownerName(a)} uses it. One undo.`); }
    else { setHash("library"); pCommit(`Save ${w.label}`, before, `Saved “${w.label}”`); }
  }
  function duplicate() {
    const src = S.work.id ? S.saved.find((s) => s.id === S.work.id) : null;
    const n = src ? usedBy(src.id).length : 0;
    const c = dupDoc(Object.assign(clone(S.work), { id: S.work.id || "new" }));
    S.work = clone(c); S.past = []; S.future = []; renderDesign();
    toast(`Saved a copy. Now editing “${c.label}”. ${n ? `${nAb(n)} still ${n === 1 ? "uses" : "use"} the original.` : "Abilities keep using the original."}`);
  }

  // ---------- use on… ----------
  function openUseOn() { S.useOn = new Set(Object.entries(S.assign).filter(([, e]) => S.work.id && e === S.work.id).map(([a]) => a)); S.useBack = location.hash.slice(1) || "library"; setHash("use-on"); }
  function renderUseOn() {
    $("#use-title").textContent = `Use "${S.work.label}" on…`;
    const groups = {}; S.owners.forEach((o) => (groups[o.group] = groups[o.group] || []).push(o));
    const b = $("#use-body");
    b.innerHTML = `<label class="search-wrap"><span class="sr-only">Search abilities</span><input type="search" id="use-q" placeholder="Search ${S.owners.length} abilities" /></label>
      <p class="hint">Tick every ability that should look like this. Their rules don't change.</p>
      ${Object.entries(groups).map(([g, list]) => `<p class="beh-group-title">${esc(g)}</p>${list.map((o) => `<button type="button" class="use-row" data-use="${o.id}" data-q="${esc(o.short.toLowerCase())}" aria-pressed="${S.useOn.has(o.id)}"><span class="box" aria-hidden="true">${S.useOn.has(o.id) ? "✓" : ""}</span><span class="meta"><span class="name">${esc(o.short)}</span><br><span class="sub">Now: ${esc(effLabel(S.assign[o.id] || "none"))}</span></span></button>`).join("")}`).join("")}`;
    $$("[data-use]", b).forEach((x) => x.addEventListener("click", () => { const id = x.dataset.use; if (S.useOn.has(id)) S.useOn.delete(id); else S.useOn.add(id); const on = S.useOn.has(id); x.setAttribute("aria-pressed", String(on)); $(".box", x).textContent = on ? "✓" : ""; useCount(); }));
    $("#use-q").addEventListener("input", (e) => { const q = e.target.value.toLowerCase(); $$("[data-use]", b).forEach((x) => (x.hidden = !!q && !x.dataset.q.includes(q))); });
    useCount();
  }
  function useCount() { $("#use-count").textContent = `${S.useOn.size} picked`; $("#use-apply").textContent = `Save & apply to ${S.useOn.size}`; }


  // ---------- Preview Godmode: Effect section (saves to All stages only; Fork for this stage) ----------
  const GM_OWNER = "line-shot", GM_STAGE = "bridge";
  function gmResolve() { const k = GM_STAGE + ":" + GM_OWNER; return k in S.stageOv ? { id: S.stageOv[k], over: true } : { id: S.assign[GM_OWNER] || "none", over: false }; }
  function openGodmode() {
    const r = gmResolve(), e = effectById(r.id);
    S.gm = e ? { effId: e.id, builtin: !!e.builtin, label: e.label, over: r.over, forkOf: e.copiedFrom ? (effectById(e.copiedFrom) || {}).label : null, v: clone(e.v), base: clone(e.v) } : { none: true };
  }
  function gmChanges() {
    const g = S.gm; if (!g || g.none) return 0; let n = 0;
    for (const k in g.v) { if (k === "steps") g.v.steps.forEach((f, i) => { if (JSON.stringify(f) !== JSON.stringify(g.base.steps[i])) n++; }); else if (JSON.stringify(g.v[k]) !== JSON.stringify(g.base[k])) n++; }
    return n;
  }
  function gmSlider(id, label, min, max, step, val, fmt) { return `<div class="field"><label for="gm-${id}">${esc(label)} <span class="val" id="gm-${id}-val">${esc(fmt(val))}</span></label><input class="slider" type="range" id="gm-${id}" data-gm="${id}" min="${min}" max="${max}" step="${step}" value="${val}" /></div>`; }
  function renderGodmode() {
    if (!S.gm) openGodmode();
    const g = S.gm, b = $("#gm-body");
    $("#gm-tabs").innerHTML = ["Units", "Rules", "Effect"].map((t) => `<button type="button" class="toggle" ${t === "Effect" ? 'aria-pressed="true"' : `aria-pressed="false" data-toast="${t} section (placeholder)"`}>${t}</button>`).join("");
    if (g.none) { $("#gm-stage").innerHTML = `<div class="fx-empty">Line Shot has no effect on this stage.</div>`; b.innerHTML = ""; $("#gm-save").disabled = true; $("#gm-fork").disabled = true; return; }
    mountStage($("#gm-stage"), () => S.gm.v, 36, true);
    const v = g.v, k = S.knobs, n = gmChanges(), users = usedBy(g.effId).length, max = k.steps.max_items;
    const cueName = v.cue_name || "";
    const head = g.over
      ? `On <strong>Bridge</strong>, ${esc(ownerName(GM_OWNER))} uses <strong>“${esc(g.label)}”</strong> <span class="tag-yours">THIS STAGE</span>. Other stages keep ${g.forkOf ? `“${esc(g.forkOf)}”` : "their effect"}.`
      : `${esc(ownerName(GM_OWNER))} uses <strong>“${esc(g.label)}”</strong> ${g.builtin ? '<span class="tag-btf">BTF</span>' : ""} on every stage.${users > 1 ? ` Shared by ${nAb(users)}.` : ""}`;
    b.innerHTML = `<div class="knob-card fx-gm-head"><h2>Effect</h2><p class="fx-note" style="margin:0 0 10px">${head}</p>
        <div class="fx-inline field" style="margin:0;padding:0;border:0;box-shadow:none"><label>Save to</label><div class="seg" role="group" aria-label="Save to"><button type="button" class="toggle" aria-pressed="true">All stages</button><button type="button" class="toggle" disabled aria-disabled="true">This stage</button></div></div>
        <p class="fx-note" style="margin:8px 0 0">Effects are shared, so tweaks save to every stage${g.builtin ? "" : ` (${nAb(Math.max(users, 1))})`}. To change it only on Bridge, use Fork for this stage.</p></div>
      ${swatches("gm-tint", "Colour", TINTS, v.tint)}
      <p class="beh-group-title">Step lengths</p>
      ${v.steps.slice(0, max).map((f, i) => gmSlider("seconds-" + i, `${i + 1} · ${KIND_UI[f.kind][0]} (seconds)`, itemSpec("seconds").min, itemSpec("seconds").max, itemSpec("seconds").step, f.seconds, fmt2)).join("")}
      <p class="beh-group-title">Timing & sound</p>
      ${gmSlider("connect", "Hit lands, through last step", k.connect.min, k.connect.max, k.connect.step, v.connect, fmtP)}
      ${gmSlider("cue_at", "Sound at (seconds)", k.cue_at.min, k.cue_at.max, k.cue_at.step, v.cue_at, fmt2)}
      <div class="field"><label for="gm-cue">Sound name <span class="val">${cueName.length} / 32</span></label><input class="fx-input" id="gm-cue" maxlength="32" value="${esc(cueName)}" placeholder="No sound" /></div>
      <details class="advanced" data-sec="gm-more"${S.gmMore ? " open" : ""}><summary>More fields</summary><div class="inner">
        ${gmSlider("sparks", k.sparks.label || "Sparks", k.sparks.min, k.sparks.max, k.sparks.step, v.sparks, fmt0)}
        ${gmSlider("scale", "Size (tiles)", k.scale.min, k.scale.max, k.scale.step, v.scale, fmt2)}
        <p class="fx-note">Every effect field can be tweaked here. The full set is in the Effect Designer.</p></div></details>
`;
    $("#gm-count").textContent = n ? `${n} change${n === 1 ? "" : "s"}` : "No changes";
    $("#gm-save").disabled = !n || g.builtin;
    $("#gm-save").textContent = g.builtin ? "Built-in: fork to change" : "Save to all stages";
    $("#gm-fork").disabled = false;
    const up = () => { const c = gmChanges(); $("#gm-count").textContent = c ? `${c} change${c === 1 ? "" : "s"}` : "No changes"; $("#gm-save").disabled = !c || g.builtin; };
    $$("[data-gm]", b).forEach((el) => el.addEventListener("input", () => {
      const id = el.dataset.gm, x = +el.value;
      if (id.startsWith("seconds-")) v.steps[+id.split("-")[1]].seconds = x; else v[id] = x;
      $(`#gm-${id}-val`).textContent = id === "connect" ? fmtP(x) : id === "sparks" ? fmt0(x) : fmt2(x); up();
    }));
    $$('[data-swatch="gm-tint"]', b).forEach((el) => el.addEventListener("click", () => { v.tint = el.dataset.value; keepScrollOf(b, renderGodmode); }));
    $('[data-colour="gm-tint"]', b).addEventListener("input", (e) => { v.tint = e.target.value; up(); });
    $("#gm-cue").addEventListener("input", (e) => { const t = e.target.value.slice(0, 32); v.cue_name = t; up(); });
    $("details", b).addEventListener("toggle", (e) => (S.gmMore = e.target.open));
  }
  function gmSave() {
    const g = S.gm, before = pSnap(), i = S.saved.findIndex((x) => x.id === g.effId); if (i < 0) return;
    S.saved[i].v = clone(g.v); g.base = clone(g.v); renderGodmode();
    pCommit(`Godmode save ${g.label}`, before, `Saved to all stages: “${g.label}”.`);
  }
  function gmFork() {
    const g = S.gm, before = pSnap(), src = effectById(g.effId);
    const c = { id: nextId(), label: uniqueName(`${src.builtin ? presetName(src.id) : src.label.replace(/ \(Bridge\)( \d+)?$/, "")} (Bridge)`), base: src.base, v: clone(g.v), copiedFrom: src.id };
    S.saved.push(c); S.stageOv[GM_STAGE + ":" + GM_OWNER] = c.id;
    S.gm = { effId: c.id, label: c.label, over: true, forkOf: src.label, v: clone(c.v), base: clone(c.v) };
    renderGodmode(); $("#gm-body").scrollTop = 0;
    pCommit("Fork for Bridge", before, `Forked as “${c.label}” with your tweaks. ${ownerName(GM_OWNER)} on Bridge uses it; other stages keep “${src.label}”. One undo.`);
  }

  // ---------- routing ----------
  function setHash(h) { if (location.hash.slice(1) === h) route(); else location.hash = h; }
  function show(id) { $$(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id)); }
  function ensureWork() { if (!S.work) startFrom("btf-holy-blade"); }
  function route() {
    const h = (location.hash || "#library").slice(1);
    const [name, arg] = h.split("/");
    S.sheetOpen = name === "ability-pick";
    switch (name) {
      case "presets": S.pickPreset = arg ? "btf-" + arg : S.pickPreset; show("presets"); renderPresets(); break;
      case "simple": ensureWork(); S.tab = "simple"; show("design"); renderDesign(); break;
      case "advanced": ensureWork(); S.tab = "advanced"; show("design"); renderDesign(); break;
      case "step": ensureWork(); S.tab = "advanced"; S.openStep = clamp((+arg || 1) - 1, 0, S.work.v.steps.length - 1); show("design"); renderDesign(); break;
      case "sprite": ensureWork(); S.picPick = picKey(S.work.v); show("sprite"); renderSprite(); break;
      case "ability": case "ability-pick": show("ability"); renderAbility(); break;
      case "use-on": ensureWork(); show("useon"); renderUseOn(); break;
      case "godmode": show("godmode"); renderGodmode(); break;
      default: show("library"); renderLibrary();
    }
    const body = $(".screen.active .body"); if (body && name !== "step") body.scrollTop = 0;
    if (name === "step") { const el = $("#step-" + S.openStep), b = $("#des-body"); if (el) b.scrollTop = el.offsetTop - b.offsetTop - 8; }
  }
  function wire() {
    document.addEventListener("click", (e) => {
      const n = e.target.closest("[data-nav]"); if (n) { setHash(n.dataset.nav); return; }
      const t = e.target.closest("[data-toast]"); if (t) toast(t.dataset.toast);
    });
    $("#lib-new").addEventListener("click", () => { S.returnTo = null; S.pickPreset = null; setHash("presets"); });
    $("#pre-back").addEventListener("click", () => setHash(S.returnTo ? "ability" : "library"));
    $("#pre-go").addEventListener("click", () => { startFrom(S.pickPreset); S.tab = "simple"; setHash("simple"); });
    $("#des-save").addEventListener("click", save);
    $("#gm-save").addEventListener("click", gmSave);
    $("#gm-fork").addEventListener("click", gmFork);
    $("#des-useon").addEventListener("click", openUseOn);
    $("#spr-done").addEventListener("click", () => { const p = S.picPick; if (p !== picKey(S.work.v)) edit(once(), (v) => { if (p.startsWith("asset:")) v.picture = p.slice(6); /* blade stays as the stock drawing */ else { v.blade = p; v.picture = "none"; } }); setHash("simple"); toast(`Picture: ${picLabel(p)}`); });
    $("#use-cancel").addEventListener("click", () => setHash(S.useBack || "library"));
    $("#use-apply").addEventListener("click", () => {
      const before = pSnap();
      if (!S.work.id) { S.work.id = nextId(); S.work.label = uniqueName(S.work.label); S.saved.push(clone(S.work)); }
      else { const i = S.saved.findIndex((s) => s.id === S.work.id); S.saved[i] = clone(S.work); }
      for (const a in S.assign) if (S.assign[a] === S.work.id && !S.useOn.has(a)) S.assign[a] = "none";
      S.useOn.forEach((a) => (S.assign[a] = S.work.id));
      setHash("library"); pCommit(`Use ${S.work.label} on ${nAb(S.useOn.size)}`, before, `Saved “${S.work.label}”. Used on ${nAb(S.useOn.size)}. One undo.`);
    });
    window.addEventListener("hashchange", route);
    $("#ab-sheet").addEventListener("click", (e) => { if (e.target.id === "ab-sheet") setHash("ability"); });
  }

  // ---------- boot ----------
  fetch("../data/behaviours.json").then((r) => r.json()).then((cat) => {
    S.cat = cat;
    S.eff = cat.behaviours.find((b) => b.id === "effect");
    S.eff.knobs.forEach((k) => (S.knobs[k.id] = k));
    S.presets = S.eff.presets;
    S.owners = cat.behaviours.filter((b) => b.knobs.some((k) => k.id === "effect" && k.type === "ref" && k.ref && k.ref.docs === "effect"))
      .map((b) => ({ id: b.id, group: b.group, short: b.name.replace(/\s*\(.*?\)\s*/g, " ").trim() }));
    const a = { id: nextId(), label: "Dawn Strike", base: "btf-holy-blade", v: presetValues("btf-holy-blade") }; a.v.sparks = 20;
    const n = { id: nextId(), label: "Needle Storm", base: "btf-spin-split", v: presetValues("btf-spin-split") }; n.v.tint = "#3b82f6"; n.v.glow = "#bfdbfe"; n.v.steps[0].orbit_count = 8;
    const m = { id: nextId(), label: "Ember Rain", base: "btf-purple-drop", v: presetValues("btf-purple-drop") }; m.v.tint = "#f97316"; m.v.picture = "asset_gone01"; // names a deleted asset: warns, draws the stock blade
    S.saved.push(n, a, m);
    S.assign["line-shot"] = n.id;
    wire(); route(); requestAnimationFrame(tick);
    Object.assign(window.__fx, { pUndo, openGodmode, startFrom, openSaved, renderDesign, route, setHash, loadSample, presetValues, newStep, edit, addStep, ready: true });
  }).catch((err) => { document.body.insertAdjacentHTML("beforeend", `<p style="color:#fff">Could not load the catalogue: ${esc(err.message)}</p>`); });
})();
