/* Imagine → pixel style converter — round 67 clickable prototype (spec: ux/pixel-editor-plan.md, "Prototype r67").
   Plain JavaScript on <canvas>, in the browser. No AI, no network: the picture never leaves the device.
   r67 pipeline: keyBackground → subjectBox → placement (r66, below) → js/convert-engine.js (window.ConvertEngine):
     Look "Crisp" = Combo A (CEO-approved 2026-11-12): 2-pass OKLab downscale + k-means OKLab palette + near-black outline,
     no clean-up, feature protection on, ≤16 colours incl. outline. Detail 20 / 24 = Crisp body + the r66 pipeline's own
     head and weapon pixels (run live in the browser: downscale → autoPalette → snapPalette → cleanUp → groupParts → buildRamps).
     The other looks (16-bit, Cel, HD-2D, Game Boy, PICO-8, Vector) are the study looks.
   → partsFromSprite: every colour becomes one tone of a recolourable part (≤3 tones per part), the outline is the parts'
   line colour, so Sprite Studio's own live outline rule redraws it (SpriteStudio.renderRecipe, shade off).
   The r66 functions below (downscale … buildRamps) still run: for "My style" parts, and as the r66 pass for Detail.
   Keep hands the result to Sprite Studio as recolourable parts (one colour set per part), never a flat bitmap.
   The original picture is kept untouched (S.dirs[d].original); all work happens on a copy. */
(() => {
  /* ===== DEFAULTS — CEO-locked 2026-11-12 (via CoS). Change here only. ===== */
  const IC_DEFAULTS = {
    bgMode: "magenta",   // CEO-locked 2026-11-12: Imagine art is asked for on magenta. Fallbacks: "corner" (corner colour) · "pick" (eyedropper)
    size: 32,            // CEO-locked 2026-11-12: 32 px (64 is one tap away)
    palette: "auto",     // CEO-locked 2026-11-12: Auto from his art. "ramp" = locked style ramp, one chip in the Basic sheet
    look: "crisp",       // r67, CEO-approved 2026-11-12: Crisp = Combo A. Chips: crisp · snes · cel · hd2d (64 px only) · gameboy · pico8 · vector
    detail: 16,          // r67, CEO-approved 2026-11-12: Standard 16 · Detailed 20 · Extra detailed 24 colours (incl. outline). 20/24 = head + weapon detail
    tolerance: 40,       // background tolerance slider 0–100
    // Advanced only (Crisp)
    downscale: "twopass", // r67 default "twopass" (2-pass OKLab) | "majority" (r66's most common colour)
    outline: "black",     // r67 default "black" (one near-black) | "hue" (dark hue per colour) | "none"
    clean: false,         // r67 default off (CEO pick "No clean-up"); on = tidy stray pixels and notches
    reshade: false,       // r67 default off (Crisp keeps the art's own shading); on = extra light from the top left
    merge: 55,            // part merge: colour distance under which colours share one part (≤3 colours per part)
    // r66 reference pass (Detail 20/24 takes its head and weapon pixels) — fixed, as in the CEO-approved 66e study
    colours: 12, island: 2,
  };
  const LOOKS = [["crisp", "Crisp"], ["snes", "16-bit"], ["cel", "Cel"], ["hd2d", "HD-2D"], ["gameboy", "Game Boy"], ["pico8", "PICO-8"], ["vector", "Vector"]];
  const LOOK_NAME = Object.fromEntries(LOOKS);
  const DETAILS = [[16, "Standard", "16 colours"], [20, "Detailed", "20 colours"], [24, "Extra detailed", "24 colours"]];
  const DETAIL_LOOKS = ["crisp", "snes"]; // Detail adds head + weapon colours on these; fixed palettes (Game Boy, PICO-8) and flat looks stay as they are
  const COVERAGE = 0.4;     // a cell is solid when ≥40% of its picture pixels are subject
  const FLAG_DIST = 45;     // match-to-master: farther than this from every master colour = flagged
  const MAX_PARTS = 8;      // more than this → smallest go to "Pixels"
  const MAX_SRC = 640;      // work copy is at most 640 px on its long side (speed on tablets)
  const SAMPLES = [
    { id: "knight", file: "assets/test-imagine/hero-magenta.png", name: "Knight", sub: "on magenta" },
    { id: "mage", file: "assets/test-imagine/mage-white.png", name: "Mage", sub: "on white" },
    { id: "ranger", file: "assets/test-imagine/ranger-gradient.png", name: "Ranger", sub: "soft gradient" },
    { id: "fairy", file: "assets/test-imagine/pink-fairy-mint.png", name: "Fairy", sub: "pink, on mint" },
    { id: "knight-back", file: "assets/test-imagine/hero-back-magenta.png", name: "Knight back", sub: "for Up" },
  ];
  const DIRS = [["down", "Down"], ["up", "Up"], ["left", "Left"], ["right", "Right"]];
  const NAME_IDEAS = ["Hair", "Skin", "Shirt", "Trousers", "Boots", "Weapon", "Cape", "Armour", "Eyes", "Hat"];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clone = (o) => JSON.parse(JSON.stringify(o));

  /* ===== colour helpers ===== */
  const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const unhex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const d2 = (a, b) => { const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]; return 2 * dr * dr + 4 * dg * dg + 3 * db * db; }; // weighted RGB
  const dist = (a, b) => Math.sqrt(d2(a, b) / 3);
  const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  function toHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s, l];
  }
  function fromHsl([h, s, l]) {
    h = ((h % 360) + 360) % 360 / 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    if (!s) return [l * 255, l * 255, l * 255];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = (t) => { t = (t + 1) % 1; return 255 * (t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p); };
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
  }
  const towards = (h, target, amt) => { let d = ((target - h + 540) % 360) - 180; return h + Math.sign(d) * Math.min(Math.abs(d), amt); };
  // Hue-shifted 3-step ramp: shadows lean cool (blue-purple), lights lean warm (yellow) — same idea as the hand-tuned Basic ramps.
  function shadowOf(c) { const [h, s, l] = toHsl(c); return fromHsl([towards(h, 250, 14), Math.min(1, s * 1.05 + 0.04), l * 0.7]); }
  function lightOf(c) { const [h, s, l] = toHsl(c); return fromHsl([towards(h, 55, 10), s * 0.95, l + (1 - l) * 0.28]); }
  function lineOf(c) { const [h, s, l] = toHsl(c); return fromHsl([towards(h, 260, 18), Math.min(1, s * 0.9 + 0.1), Math.min(0.2, l * 0.32)]); }
  function nameFor(c) {
    const [h, s, l] = toHsl(c);
    if (l < 0.13) return "Dark";
    if (s < 0.14 || (l > 0.9 && s < 0.4)) return l > 0.82 ? "White" : l > 0.5 ? (h > 180 && h < 260 && s > 0.05 ? "Steel" : "Light grey") : "Grey";
    if (h >= 8 && h < 42 && l > 0.55 && s > 0.2 && s < 0.85) return "Skin";
    let n = h < 12 || h >= 345 ? "Red" : h < 42 ? (l < 0.42 ? "Brown" : "Orange") : h < 68 ? (l < 0.38 ? "Brown" : s > 0.42 ? "Gold" : "Sand")
      : h < 165 ? "Green" : h < 195 ? "Teal" : h < 258 ? "Blue" : h < 290 ? "Purple" : "Pink";
    if (l < 0.3 && n !== "Brown") n = "Dark " + n.toLowerCase();
    else if (l > 0.78) n = "Light " + n.toLowerCase();
    return n;
  }
  function setFor(name) { // which Sprite Studio swatch family a part recolours with
    const n = name.toLowerCase();
    if (n.includes("skin")) return "skin";
    if (n.includes("brown") || n.includes("sand") || n.includes("orange")) return "gear";
    if (n.includes("gold") || n.includes("steel") || n.includes("grey")) return "metal";
    if (n === "dark") return "hair";
    return "cloth";
  }
  const isPink = (c) => { const [h, s, l] = toHsl(c); return h >= 290 && h <= 345 && s > 0.35 && l > 0.3 && l < 0.88; };
  const isMagenta = ([r, g, b]) => r > 170 && b > 150 && g < 100 && Math.abs(r - b) < 90;

  /* ===== 1. background key ===== */
  function px(src, x, y) { const i = (y * src.w + x) * 4; return [src.d[i], src.d[i + 1], src.d[i + 2]]; }
  function patch(src, cx, cy) { const r = 5, acc = [0, 0, 0]; let n = 0;
    for (let y = Math.max(0, cy - r); y <= Math.min(src.h - 1, cy + r); y++) for (let x = Math.max(0, cx - r); x <= Math.min(src.w - 1, cx + r); x++) { const p = px(src, x, y); acc[0] += p[0]; acc[1] += p[1]; acc[2] += p[2]; n++; }
    return acc.map((v) => v / n); }
  function borderSamples(src) { const out = [], st = Math.max(1, Math.floor(Math.min(src.w, src.h) / 80));
    for (let x = 0; x < src.w; x += st) { out.push(px(src, x, 0), px(src, x, src.h - 1)); }
    for (let y = 0; y < src.h; y += st) { out.push(px(src, 0, y), px(src, src.w - 1, y)); }
    return out; }
  const median = (list) => [0, 1, 2].map((k) => { const v = list.map((c) => c[k]).sort((a, b) => a - b); return v[v.length >> 1]; });
  // Decides how to find the background. Magenta is the default (CEO-locked); corner colour and the eyedropper are fallbacks.
  function detectBackground(src, mode, picked) {
    const border = borderSamples(src), mag = border.filter(isMagenta);
    const magFound = mag.length > border.length * 0.5;
    let used = mode, note = null;
    if (mode === "magenta" && !magFound) { used = "corner"; note = "nomagenta"; }
    if (mode === "pick" && !picked) used = magFound ? "magenta" : "corner";
    let bg;
    if (used === "magenta") { const k = median(mag); bg = () => k; bg.key = k; }
    else if (used === "pick") { bg = () => picked; bg.key = picked; }
    else { // corner colour, bilinear between the four corners, so soft gradients key too
      const c = [patch(src, 4, 4), patch(src, src.w - 5, 4), patch(src, 4, src.h - 5), patch(src, src.w - 5, src.h - 5)];
      bg = (x, y) => { const u = x / (src.w - 1), v = y / (src.h - 1); return [0, 1, 2].map((k) => (c[0][k] * (1 - u) + c[1][k] * u) * (1 - v) + (c[2][k] * (1 - u) + c[3][k] * u) * v); };
      bg.key = median(c);
    }
    return { bg, used, note, magFound };
  }
  // Flood fill from every edge pixel through background-like pixels; magenta also clears enclosed magenta holes.
  function keyBackground(src, det, tolerance) {
    const { w, h } = src, T = 12 + tolerance * 1.6, mask = new Uint8Array(w * h).fill(1), q = new Int32Array(w * h); let qh = 0, qt = 0;
    const near = (x, y, t) => dist(px(src, x, y), det.bg(x, y)) <= t;
    const push = (x, y) => { const i = y * w + x; if (mask[i] && near(x, y, T)) { mask[i] = 0; q[qt++] = i; } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (qh < qt) { const i = q[qh++], x = i % w, y = (i / w) | 0;
      if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1); }
    const keyHsl = toHsl(det.bg.key || [0, 0, 0]);
    if (det.used !== "magenta" && keyHsl[1] > 0.5 && keyHsl[2] > 0.25 && keyHsl[2] < 0.8) // a chroma-like key: clear enclosed gaps of it too (never on white/grey)
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (mask[i] && near(x, y, T * 0.6)) mask[i] = 0; }
    if (det.used === "magenta") for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (mask[i] && isMagenta(px(src, x, y)) && near(x, y, T * 0.8)) mask[i] = 0; }
    // soft edge: one ring of anti-aliased fringe pixels that are still close to the background.
    // r68: also edge pixels that are a BLEND of the inner colour and the key (anti-aliasing), so tolerance 0 leaves no
    // magenta fringe. The blend test fades out by tolerance 40 (where the plain distance rule already keeps it clean).
    // the ring always uses at least the tolerance-40 distance (CEO: 40 looks clean), so 0 never keeps a magenta rim
    const RING_MIN = (12 + 40 * 1.6) * 1.5;
    const tMin = 0.3 + Math.min(1, tolerance / 40) * 0.75;
    // pass 0: one ring (near the key, or an anti-aliased blend). Pass 1: blends only, for soft 2-pixel edges.
    for (let pass = 0; pass < (tMin > 1 ? 1 : 2); pass++) { const fr = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x;
      if (!mask[i] || (mask[i - 1] && mask[i + 1] && mask[i - w] && mask[i + w])) continue;
      if (pass === 0 && near(x, y, Math.max(T * 1.5, RING_MIN))) { fr.push(i); continue; }
      if (tMin > 1) continue;
      const p = px(src, x, y), k = det.bg(x, y), qs = [];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!mask[(y + dy) * w + x + dx]) { const X = x - 2 * dx, Y = y - 2 * dy; if (X >= 0 && Y >= 0 && X < w && Y < h && mask[Y * w + X]) qs.push(px(src, X, Y)); } });
      if (!qs.length) continue;
      const q = [0, 1, 2].map((c) => qs.reduce((s2, v) => s2 + v[c], 0) / qs.length), kq = [k[0] - q[0], k[1] - q[1], k[2] - q[2]], L2 = kq[0] ** 2 + kq[1] ** 2 + kq[2] ** 2;
      if (L2 < 3600) continue; // the inner colour is itself close to the key: leave it
      const t = ((p[0] - q[0]) * kq[0] + (p[1] - q[1]) * kq[1] + (p[2] - q[2]) * kq[2]) / L2;
      const res = Math.hypot(p[0] - q[0] - t * kq[0], p[1] - q[1] - t * kq[1], p[2] - q[2] - t * kq[2]);
      if (t >= tMin && t <= 1.1 && res <= 0.25 * Math.sqrt(L2) + 10) fr.push(i); }
    fr.forEach((i) => (mask[i] = 0)); }
    return mask;
  }
  // Pink inside the sprite? Then the magenta key may eat it — say so in plain words.
  // r68: only colours truly near #FF00FF in OKLab count (pinkish or purple swords and wings don't), and only on the
  // sprite itself (the keyed background and its one-pixel fringe ring are left out).
  const MAGENTA_LAB = oklab([255, 0, 255]), PINK_NEAR = 0.20, PINK_SHARE = 0.008;
  function oklab([r, g, b]) { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const R = f(r), G = f(g), B = f(b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s2 = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2]; }
  function pinkInside(src, det, tolerance, mask) {
    if (!mask) mask = keyBackground(src, det, tolerance);
    const w = src.w, key = det.bg.key || [255, 0, 255];
    // "flat key" = the background itself (or a gap between the legs): within 20 of the key colour. Real magenta-pink in
    // the sprite is shaded, so it sits NEAR #FF00FF in OKLab without being the flat key. Edge pixels are skipped (fringe).
    const flat = (x, y) => dist(px(src, x, y), key) <= 20;
    let pink = 0, solid = 0;
    for (let y = 1; y < src.h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) { const i = y * w + x;
      if (flat(x, y)) continue;
      const interior = !flat(x - 1, y) && !flat(x + 1, y) && !flat(x, y - 1) && !flat(x, y + 1);
      const L = oklab(px(src, x, y));
        const distM = Math.hypot(L[0] - MAGENTA_LAB[0], L[1] - MAGENTA_LAB[1], L[2] - MAGENTA_LAB[2]);
        // Candy pink / orchid / magenta-purple sit a little farther from #FF00FF than 0.12.
        const near = distM < PINK_NEAR || (distM < 0.28 && L[1] > 0.06 && L[0] > 0.45 && Math.abs(L[2]) < 0.16);
      if (mask[i]) { if (interior) { solid++; if (near) pink++; } }
      else if (near && interior) { solid++; pink++; } } // eaten by the key, but shaded like sprite art, not flat background
    return solid > 0 && (pink / solid >= PINK_SHARE || pink >= 6);
  }


  /* ===== 2. crop to the subject's box (ignores specks) ===== */
  function subjectBox(mask, w, h) {
    const seen = new Uint8Array(w * h), comps = [], q = new Int32Array(w * h); let total = 0;
    for (let i = 0; i < w * h; i++) if (mask[i] && !seen[i]) {
      let qh = 0, qt = 0, x0 = w, y0 = h, x1 = 0, y1 = 0; q[qt++] = i; seen[i] = 1;
      while (qh < qt) { const j = q[qh++], x = j % w, y = (j / w) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        for (const k of [j - 1, j + 1, j - w, j + w]) if (k >= 0 && k < w * h && mask[k] && !seen[k] && !((k === j - 1 && x === 0) || (k === j + 1 && x === w - 1))) { seen[k] = 1; q[qt++] = k; } }
      comps.push({ n: qt, x0, y0, x1, y1 }); total += qt;
    }
    const keep = comps.filter((c) => c.n >= Math.max(40, total * 0.0015));
    if (!keep.length) return { bx: 0, by: 0, bw: w, bh: h, empty: true };
    const bx = Math.min(...keep.map((c) => c.x0)), by = Math.min(...keep.map((c) => c.y0));
    return { bx, by, bw: Math.max(...keep.map((c) => c.x1)) - bx + 1, bh: Math.max(...keep.map((c) => c.y1)) - by + 1 };
  }

  /* ===== 3. downscale by majority (or area-average) colour, not nearest ===== */
  function placement(box, N, master) {
    const inner = N - 2; let s = Math.max(box.bw / inner, box.bh / inner);
    if (master) s = master.s; // reuse the master's scale…
    if (box.bw / s > inner || box.bh / s > inner) s = Math.max(box.bw / inner, box.bh / inner); // …unless it wouldn't fit
    const cw = Math.max(1, Math.round(box.bw / s)), ch = Math.max(1, Math.round(box.bh / s));
    const foot = master ? master.foot : N - 2; // foot line: bottom row of the subject
    return { s, cw, ch, ox: Math.floor((N - cw) / 2), oy: Math.max(1, foot - ch + 1), foot };
  }
  function downscale(src, mask, box, N, pl, method) {
    const rgb = new Float32Array(N * N * 3), solid = new Uint8Array(N * N);
    for (let cy = 0; cy < pl.ch; cy++) for (let cx = 0; cx < pl.cw; cx++) {
      const sx0 = box.bx + cx * pl.s, sy0 = box.by + cy * pl.s, sx1 = Math.min(box.bx + box.bw, sx0 + pl.s), sy1 = Math.min(box.by + box.bh, sy0 + pl.s);
      let tot = 0, op = 0; const acc = [0, 0, 0], bins = new Map();
      for (let y = Math.floor(sy0); y < Math.ceil(sy1); y++) for (let x = Math.floor(sx0); x < Math.ceil(sx1); x++) {
        if (x < 0 || y < 0 || x >= src.w || y >= src.h) continue; tot++;
        if (!mask[y * src.w + x]) continue; op++;
        const p = px(src, x, y);
        if (method === "average") { acc[0] += p[0]; acc[1] += p[1]; acc[2] += p[2]; }
        else { const k = ((p[0] >> 4) << 8) | ((p[1] >> 4) << 4) | (p[2] >> 4); let b = bins.get(k); if (!b) bins.set(k, (b = [0, 0, 0, 0])); b[0] += p[0]; b[1] += p[1]; b[2] += p[2]; b[3]++; }
      }
      if (!tot || op / tot < COVERAGE) continue;
      const X = pl.ox + cx, Y = pl.oy + cy; if (X < 0 || Y < 0 || X >= N || Y >= N) continue;
      const i = Y * N + X; solid[i] = 1;
      if (method === "average") { rgb[i * 3] = acc[0] / op; rgb[i * 3 + 1] = acc[1] / op; rgb[i * 3 + 2] = acc[2] / op; }
      else { // majority: the most common colour family in the cell, averaged within that family
        let best = null; bins.forEach((b) => { if (!best || b[3] > best[3]) best = b; });
        rgb[i * 3] = best[0] / best[3]; rgb[i * 3 + 1] = best[1] / best[3]; rgb[i * 3 + 2] = best[2] / best[3];
      }
    }
    return { rgb, solid };
  }

  /* ===== 4. palette: Auto (median cut + k-means) or the locked style ramp ===== */
  function cellColours(ds, N) { const out = []; for (let i = 0; i < N * N; i++) if (ds.solid[i]) out.push([ds.rgb[i * 3], ds.rgb[i * 3 + 1], ds.rgb[i * 3 + 2]]); return out; }
  function medianCut(cols, k) {
    let boxes = [cols];
    while (boxes.length < k) {
      let bi = -1, br = -1, bc = 0;
      boxes.forEach((b, i) => { if (b.length < 2) return; for (let c = 0; c < 3; c++) { const v = b.map((p) => p[c]); const r = (Math.max(...v) - Math.min(...v)) * [1.4, 2, 1.7][c]; if (r > br) { br = r; bi = i; bc = c; } } });
      if (bi < 0 || br <= 0) break;
      const b = boxes[bi].slice().sort((p, q) => p[bc] - q[bc]), m = b.length >> 1;
      boxes.splice(bi, 1, b.slice(0, m), b.slice(m));
    }
    return boxes.map((b) => [0, 1, 2].map((c) => b.reduce((s, p) => s + p[c], 0) / b.length));
  }
  function kmeans(cols, centres, iters = 6) {
    let C = centres.map((c) => c.slice());
    for (let it = 0; it < iters; it++) {
      const acc = C.map(() => [0, 0, 0, 0]);
      cols.forEach((p) => { let bi = 0, bd = Infinity; C.forEach((c, i) => { const d = d2(p, c); if (d < bd) { bd = d; bi = i; } }); const a = acc[bi]; a[0] += p[0]; a[1] += p[1]; a[2] += p[2]; a[3]++; });
      C = C.map((c, i) => (acc[i][3] ? [acc[i][0] / acc[i][3], acc[i][1] / acc[i][3], acc[i][2] / acc[i][3]] : c));
    }
    return C;
  }
  function autoPalette(ds, N, k) { const cols = cellColours(ds, N); if (!cols.length) return []; return kmeans(cols, medianCut(cols, Math.min(k, cols.length))).map((c) => ({ rgb: c.map(Math.round) })); }
  function styleRampPalette() { // placeholder until a project ramp exists: TileEngine's locked default style ramps
    const P = (window.SpriteStudio && SpriteStudio.parts) || null, out = [], seen = new Set();
    if (!P) return out;
    Object.keys(P.SWATCHES).forEach((set) => P.SWATCHES[set].forEach((sw) => {
      const key = sw.c.join(); if (seen.has(key)) return; seen.add(key);
      sw.c.forEach((h, tone) => out.push({ rgb: unhex(h), set, sw: sw.name, tone, ramp: { c: sw.c.slice(), line: sw.line, name: sw.name } }));
    }));
    return out;
  }
  // "My style": the art's own colours first, then each one locks to its nearest style-ramp step (fewer stray colours than per-pixel snapping)
  function toStyleRamp(auto) { const style = styleRampPalette(), out = [], seen = new Map();
    auto.forEach((a) => { let bi = 0, bd = Infinity; style.forEach((c, j) => { const d = d2(a.rgb, c.rgb); if (d < bd) { bd = d; bi = j; } }); if (!seen.has(bi)) { seen.set(bi, out.length); out.push(style[bi]); } });
    return out; }
  function snapPalette(ds, N, palette) {
    const idx = new Int16Array(N * N).fill(-1);
    for (let i = 0; i < N * N; i++) if (ds.solid[i]) { const p = [ds.rgb[i * 3], ds.rgb[i * 3 + 1], ds.rgb[i * 3 + 2]]; let bi = 0, bd = Infinity;
      palette.forEach((c, j) => { const d = d2(p, c.rgb); if (d < bd) { bd = d; bi = j; } }); idx[i] = bi; }
    return idx;
  }

  /* ===== 5. clean-up: same rules as the Basic Tidy button (strays out, specks recoloured, 1px holes filled) + islands ===== */
  function cleanUp(idx, N, island, palette) {
    let a = idx.slice(), strays = 0, specks = 0, holes = 0, islands = 0;
    const at = (b, x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : b[y * N + x]);
    for (let pass = 0; pass < 3; pass++) {
      let changed = 0, b = a.slice();
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = a[y * N + x]; if (v < 0) continue;
        let n8 = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && at(a, x + dx, y + dy) >= 0) n8++;
        if (!n8) { b[y * N + x] = -1; strays++; changed++; continue; }
        const o4 = [at(a, x, y - 1), at(a, x - 1, y), at(a, x + 1, y), at(a, x, y + 1)];
        if (o4.every((u) => u >= 0 && u !== v)) { const cnt = {}; o4.forEach((u) => (cnt[u] = (cnt[u] || 0) + 1));
          const [c, n] = Object.entries(cnt).sort((p, q) => q[1] - p[1])[0];
          // keep high-contrast single pixels (likely eyes, buttons): the help text says to touch those up by hand
          if (n >= 3 && Math.abs(lum(palette[v].rgb) - lum(palette[+c].rgb)) < 0.3) { b[y * N + x] = +c; specks++; changed++; } }
      }
      a = b; b = a.slice();
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (a[y * N + x] >= 0) continue;
        const o4 = [at(a, x, y - 1), at(a, x - 1, y), at(a, x + 1, y), at(a, x, y + 1)];
        if (o4.every((u) => u >= 0)) { const cnt = {}; o4.forEach((u) => (cnt[u] = (cnt[u] || 0) + 1)); b[y * N + x] = +Object.entries(cnt).sort((p, q) => q[1] - p[1])[0][0]; holes++; changed++; } }
      a = b;
      // islands: solid bits no bigger than `island` pixels, cut off from the body
      const seen = new Uint8Array(N * N);
      for (let i = 0; i < N * N; i++) if (a[i] >= 0 && !seen[i]) { const comp = [i]; seen[i] = 1;
        for (let k = 0; k < comp.length; k++) { const j = comp[k], x = j % N, y = (j / N) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= N || Y >= N) continue; const m = Y * N + X; if (a[m] >= 0 && !seen[m]) { seen[m] = 1; comp.push(m); } } }
        if (comp.length <= island) { comp.forEach((j) => (a[j] = -1)); islands += comp.length; changed++; } }
      if (!changed) break;
    }
    return { idx: a, strays, specks, holes, islands };
  }

  /* ===== 6. group colours into named recipe parts (+ a leftover "Pixels" part) ===== */
  function groupParts(idx, palette, merge, rampMode) {
    const count = palette.map(() => 0); idx.forEach((v) => v >= 0 && count[v]++);
    const solid = count.reduce((s, n) => s + n, 0);
    let groups = [];
    if (rampMode) { // one part per style ramp
      const by = {}; palette.forEach((p, i) => { if (!count[i]) return; const k = p.set + ":" + p.sw; (by[k] = by[k] || { members: [], count: 0, ramp: p.ramp, sw: p.sw, set: p.set }).members.push(i); by[k].count += count[i]; });
      groups = Object.values(by).map((g) => Object.assign(g, { mean: unhex(g.ramp.c[1]) }));
    } else {
      groups = palette.map((p, i) => ({ members: [i], count: count[i], mean: p.rgb.slice() })).filter((g) => g.count);
      for (;;) { // merge the closest two while they're within the merge distance
        let bi = -1, bj = -1, bd = Infinity;
        for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) { const d = dist(groups[i].mean, groups[j].mean); if (d < bd) { bd = d; bi = i; bj = j; } }
        if (bi < 0 || bd > merge) break;
        const A = groups[bi], B = groups[bj], n = A.count + B.count;
        A.mean = [0, 1, 2].map((k) => (A.mean[k] * A.count + B.mean[k] * B.count) / n); A.members = A.members.concat(B.members); A.count = n; groups.splice(bj, 1);
      }
    }
    groups.sort((p, q) => q.count - p.count);
    const small = Math.max(3, solid * 0.008);
    groups.forEach((g, i) => { g.pixels = (g.count < small && !(g.count >= 2 && nameFor(g.mean) === "Skin")) || i >= MAX_PARTS; }); // skin stays a part: faces are tiny at 32 px
    const used = {};
    groups.forEach((g) => { if (g.pixels) { g.name = "Pixels"; return; } let n = g.sw || nameFor(g.mean); used[n] = (used[n] || 0) + 1; if (used[n] > 1) n += " " + used[n]; g.name = n; });
    groups.sort((p, q) => (p.pixels - q.pixels) || q.count - p.count);
    return groups;
  }

  /* ===== 7. one colour set (ramp) per part → slots Sprite Studio understands (ramp*3 + tone + 1) ===== */
  function buildRamps(idx, palette, groups, reshade, outlineMode, shared, cap) {
    const of = {}; groups.forEach((g, gi) => g.members.forEach((m) => (of[m] = gi)));
    let darkest = [255, 255, 255]; palette.forEach((p) => { if (lum(p.rgb) < lum(darkest)) darkest = p.rgb; });
    const oneLine = hex(lineOf(darkest));
    const avg = (arr) => [0, 1, 2].map((k) => arr.reduce((s, p) => s + p[k], 0) / arr.length);
    const ramps = groups.map((g) => {
      let c; const toneOf = {};
      if (g.ramp) { c = g.ramp.c.slice(); g.members.forEach((m) => (toneOf[m] = palette[m].tone)); }
      else {
        const base = g.mean, L = lum(base), t = [[], [], []];
        // the art's own light and dark inside a part become its 3 steps
        g.members.forEach((m) => { const l = lum(palette[m].rgb), tn = g.pixels ? 1 : l < L - 0.06 ? 0 : l > L + 0.06 ? 2 : 1; toneOf[m] = tn; t[tn].push(palette[m].rgb); });
        const b = t[1].length ? avg(t[1]) : base;
        if (g.pixels) c = [hex(b), hex(b), hex(b)];
        else if (reshade) c = [hex(shadowOf(b)), hex(b), hex(lightOf(b))]; // hue-shifted: cool shadow, warm light
        else c = [hex(t[0].length ? avg(t[0]) : shadowOf(b)), hex(b), hex(t[2].length ? avg(t[2]) : lightOf(b))];
      }
      const line = outlineMode === "one" ? oneLine : g.ramp ? g.ramp.line : hex(lineOf(g.mean));
      const autoName = g.name, name = shared.names[autoName] || autoName;
      const r = { name, autoName, c, line, sw: g.sw || "Original", set: g.set || setFor(g.name), pixels: !!g.pixels, toneOf, orig: { c: c.slice(), line } };
      const rc = shared.recolours[autoName];
      if (rc && rc.c) { r.c = rc.c.slice(); r.line = outlineMode === "one" ? oneLine : rc.line; r.sw = rc.name; }
      return r;
    });
    const N = Math.round(Math.sqrt(idx.length)), slots = new Uint8Array(idx.length), base = new Uint8Array(idx.length);
    const solid = (x, y) => x >= 0 && y >= 0 && x < N && y < N && idx[y * N + x] >= 0;
    for (let i = 0; i < idx.length; i++) { const v = idx[i]; if (v < 0) continue; const gi = of[v], r = ramps[gi];
      let tone = r.toneOf[v] ?? 1; base[i] = gi * 3 + tone + 1;
      if (reshade && !r.pixels) { // re-shade: light from the top left on the whole silhouette, on top of the art's own values
        const x = i % N, y = (i / N) | 0;
        if (!solid(x, y - 1) || !solid(x - 1, y)) tone = Math.min(2, tone + 1);
        else if (!solid(x, y + 1) || !solid(x + 1, y)) tone = Math.max(0, tone - 1);
      }
      slots[i] = gi * 3 + tone + 1; }
    const capInfo = reshade && cap != null ? capReshade(slots, base, ramps, outlineMode === "none" ? "none" : "ramp", cap) : null;
    return { ramps, slots, N, capInfo };
  }

  /* ===== whole pipeline for one direction ===== */
  function convert(d) {
    const t0 = performance.now();
    const D = S.dirs[d], set = D.settings, master = S.dirs[S.master];
    const useMaster = d !== S.master && D.match && master && master.result;
    const N = useMaster ? master.result.N : set.size;
    const det = detectBackground(D.src, set.bgMode, set.picked);
    const mask = keyBackground(D.src, det, set.tolerance);
    const box = subjectBox(mask, D.src.w, D.src.h);
    const pl = placement(box, N, useMaster ? master.result.place : null);
    const rampMode = useMaster ? master.result.rampMode : set.palette === "ramp";
    const L = useMaster ? master.settings : set; // look, detail and Advanced options follow the master when matched
    const look = L.look === "hd2d" && N < 64 ? "crisp" : L.look, detail = DETAIL_LOOKS.includes(look) ? L.detail : 16;
    // engine pass (js/convert-engine.js) on the r66 cut-out and placement
    const E = engine(), P = prepared(D, mask, box, det, set); P.place = { [N]: pl };
    const an = P._an && P._an[N] ? P._an[N] : (P._an = Object.assign(P._an || {}, { [N]: E.analyse(P, N) }))[N];
    const pipe = { downscale: L.downscale === "majority" ? "majority" : "twopass", outline: L.outline === "none" ? "none" : L.outline === "hue" ? "selective" : "black", clean: !!L.clean };
    let spr;
    if (detail > 16) { // head + weapon detail: the r66 pipeline's own pixels in those regions, re-palettised into the extra slots
      const ref = r66Pixels(D, mask, box, N, pl);
      spr = E.hybridLook(P, N, { cap: detail, base: look === "snes" ? "snes" : "comboA", ref, pipe, keepHead: an.metrics.warrior });
    } else spr = look === "crisp" ? E.renderPipeline(P, N, Object.assign({}, E.COMBO_A, pipe)) : E.renderLook(P, N, look);
    const body = spr.body || Uint8Array.from(spr.px, (c) => (c ? 1 : 0));
    // colours of the filled cells → palette + index; the outline ring becomes each part's line colour
    let palette, idx = new Int16Array(N * N).fill(-1); const flagged = [], key = (c) => c.join();
    if (useMaster) {
      palette = master.result.palette;
      for (let i = 0; i < N * N; i++) if (body[i] && spr.px[i]) { const p = spr.px[i]; let bi = 0, bd = Infinity; palette.forEach((c, j) => { const dd = d2(p, c.rgb); if (dd < bd) { bd = dd; bi = j; } }); idx[i] = bi; if (Math.sqrt(bd / 3) > FLAG_DIST) flagged.push(i); }
    } else {
      const seen = new Map(), cols = [];
      for (let i = 0; i < N * N; i++) if (body[i] && spr.px[i]) { const k = key(spr.px[i]); if (!seen.has(k)) { seen.set(k, cols.length); cols.push({ rgb: spr.px[i].slice(), inR: 0, out: 0 }); } idx[i] = seen.get(k); cols[idx[i]][spr.region && spr.region[i] ? "inR" : "out"]++; }
      // Detail: colours only found in the r66 head / weapon cells stay in their own parts, so their outline keeps r66's colour after Keep
      cols.forEach((c) => { c.ref = c.inR > 0 && c.out === 0; delete c.inR; delete c.out; });
      if (rampMode) { palette = toStyleRamp(cols); const near = cols.map((c) => { let bi = 0, bd = Infinity; palette.forEach((q, j) => { const dd = d2(c.rgb, q.rgb); if (dd < bd) { bd = dd; bi = j; } }); return bi; });
        for (let i = 0; i < N * N; i++) if (idx[i] >= 0) idx[i] = near[idx[i]]; }
      else palette = cols;
    }
    const reshade = !!L.reshade, outline = L.outline;
    const capFor = look === "gameboy" || look === "pico8" ? 0 : detail; // r68: re-shade stays inside the colour cap
    let groups, built;
    if (rampMode) { groups = useMaster ? master.result.groups : groupParts(idx, palette, L.merge, true); built = buildRamps(idx, palette, groups, reshade, outline === "none" ? "none" : "ramp", S.shared, capFor); }
    else { groups = useMaster ? master.result.groups : groupExact(idx, palette, L.merge); built = rampsExact(idx, palette, groups, reshade, spr.px, body, outline, S.shared, !useMaster, capFor); }
    const flagCols = new Set(flagged.map((i) => spr.px[i].map((v) => v >> 5).join()));
    const cut = document.createElement("canvas"); cut.width = D.src.w; cut.height = D.src.h; { const cg = cut.getContext("2d"), id = cg.createImageData(D.src.w, D.src.h);
      for (let i = 0; i < mask.length; i++) { id.data[i * 4] = D.src.d[i * 4]; id.data[i * 4 + 1] = D.src.d[i * 4 + 1]; id.data[i * 4 + 2] = D.src.d[i * 4 + 2]; id.data[i * 4 + 3] = mask[i] ? 255 : 0; } cg.putImageData(id, 0, 0); }
    D.result = { cut, N, det: { used: det.used, note: det.note, key: det.bg.key && det.bg.key.map(Math.round) }, box, place: pl, palette, rampMode, groups, idx, slots: built.slots, ramps: built.ramps, reshadeCap: built.capInfo || null,
      reshade, outline, flagged, flagColours: flagCols.size, clean: { strays: 0, specks: 0, holes: 0, islands: 0, fixes: spr.fixes || 0 }, matched: !!useMaster, pink: pinkInside(D.src, det, set.tolerance, mask),
      look, detail, engineColours: E.countColours(spr), hybrid: spr.hybrid || null, analyse: { pick: an.pick, second: an.second, why: an.why, warrior: !!an.metrics.warrior }, enginePx: spr.px,
      ms: Math.round(performance.now() - t0) };
    D.converted = true;
    return D.result;
  }
  /* ===== r67: engine glue ===== */
  let ENG = null;
  function engine() {
    if (!ENG) { if (!window.ConvertEngine) throw new Error("js/convert-engine.js is not loaded"); ENG = window.ConvertEngine.initWith({ detectBackground, keyBackground, subjectBox, placement, pinkInside, toHsl }); }
    return ENG;
  }
  // the engine's source analysis (OKLab, feature + accent maps) depends only on the picture and its cut-out: cached per key
  function prepared(D, mask, box, det, set) {
    const k = [set.bgMode, set.tolerance, set.picked ? set.picked.join() : ""].join("|");
    if (!D._eng || D._eng.src !== D.src || D._eng.k !== k) D._eng = { src: D.src, k, P: engine().prepareMasked(D.src, mask, box, det) };
    return D._eng.P;
  }
  // the r66 pipeline, unchanged and live (r66 defaults: majority, Auto 12, clean-up, re-shade, dark-hue outline): its pixels feed Detail 20/24
  function r66Pixels(D, mask, box, N, pl) {
    const ds = downscale(D.src, mask, box, N, pl, "majority"), palette = autoPalette(ds, N, IC_DEFAULTS.colours);
    const cl = cleanUp(snapPalette(ds, N, palette), N, IC_DEFAULTS.island, palette);
    const groups = groupParts(cl.idx, palette, IC_DEFAULTS.merge, false), built = buildRamps(cl.idx, palette, groups, true, "hue", { names: {}, recolours: {} });
    const cols = SpriteStudio.renderRecipe(built.slots, N, N, built.ramps, { outline: true, shade: false });
    return cols.map((c) => (c ? unhex(c) : null));
  }
  // parts for an engine sprite: close colours share a part, at most 3 per part (they become its dark / mid / light tones), so
  // every colour stays exact and the whole part still recolours like a ready-made hero
  function groupExact(idx, palette, merge) {
    const count = palette.map(() => 0); idx.forEach((v) => v >= 0 && count[v]++);
    const solid = count.reduce((a, n) => a + n, 0);
    let groups = palette.map((p, i) => ({ members: [i], count: count[i], mean: p.rgb.slice(), ref: !!p.ref })).filter((g) => g.count);
    for (;;) { let bi = -1, bj = -1, bd = Infinity;
      for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) { if (groups[i].ref !== groups[j].ref) continue; const d = dist(groups[i].mean, groups[j].mean); if (d < bd) { bd = d; bi = i; bj = j; } }
      if (bi < 0 || bd > merge) break;
      const A = groups[bi], B = groups[bj], n = A.count + B.count;
      A.mean = [0, 1, 2].map((k) => (A.mean[k] * A.count + B.mean[k] * B.count) / n); A.members = A.members.concat(B.members); A.count = n; groups.splice(bj, 1); }
    const out = [];
    groups.forEach((g) => { const m = g.members.slice().sort((a, b) => lum(palette[a].rgb) - lum(palette[b].rgb)), k = Math.ceil(m.length / 3);
      for (let c = 0; c < k; c++) { const part = m.slice(Math.round((c * m.length) / k), Math.round(((c + 1) * m.length) / k)), cnt = part.reduce((a, i) => a + count[i], 0);
        const mean = [0, 1, 2].map((q) => part.reduce((a, i) => a + palette[i].rgb[q] * count[i], 0) / cnt);
        out.push({ members: part, tones: part.length === 1 ? [1] : part.length === 2 ? [0, 2] : [0, 1, 2], count: cnt, mean }); } });
    out.sort((p, q) => q.count - p.count);
    const small = Math.max(3, solid * 0.008);
    out.forEach((g) => { g.pixels = g.members.length === 1 && g.count < small && !(g.count >= 2 && nameFor(g.mean) === "Skin"); });
    const used = {}; out.forEach((g) => { if (g.pixels) { g.name = "Pixels"; return; } let n = nameFor(g.mean); used[n] = (used[n] || 0) + 1; if (used[n] > 1) n += " " + used[n]; g.name = n; });
    out.sort((p, q) => (p.pixels - q.pixels) || q.count - p.count);
    return out;
  }
  // r68: "Light from top left" may only add new (synthetic) shadow/light colours up to the colour cap of the look and
  // detail (16 Standard, 20/24 Detail, 0 extra on fixed palettes). The most-used new colours win; other cells keep their tone.
  function capReshade(slots, base, ramps, outlineMode, cap) {
    const col = (s2) => { const r = ramps[((s2 - 1) / 3) | 0]; return r.c[(s2 - 1) % 3]; };
    const have = new Set(); for (let i = 0; i < slots.length; i++) if (base[i]) have.add(col(base[i]));
    if (outlineMode !== "none") { const used = new Set(); for (let i = 0; i < base.length; i++) if (base[i]) used.add(((base[i] - 1) / 3) | 0); used.forEach((gi) => ramps[gi].line && have.add(ramps[gi].line)); }
    const fresh = new Map(); for (let i = 0; i < slots.length; i++) if (slots[i] && slots[i] !== base[i]) { const k = col(slots[i]); if (!have.has(k)) fresh.set(k, (fresh.get(k) || 0) + 1); }
    const room = Math.max(0, cap - have.size), keep = new Set([...fresh.entries()].sort((a, b) => b[1] - a[1]).slice(0, room).map((e) => e[0]));
    let reverted = 0; for (let i = 0; i < slots.length; i++) if (slots[i] && slots[i] !== base[i]) { const k = col(slots[i]); if (!have.has(k) && !keep.has(k)) { slots[i] = base[i]; reverted++; } }
    return { cap, base: have.size, added: keep.size, reverted };
  }
  function rampsExact(idx, palette, groups, reshade, px, body, outlineMode, shared, allowTwins, cap) {
    const of = {}, toneOfM = {}; groups.forEach((g, gi) => g.members.forEach((m, k) => { of[m] = gi; toneOfM[m] = g.tones[k]; }));
    const N = Math.round(Math.sqrt(idx.length)), at = (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : idx[y * N + x]);
    // Sprite Studio draws each outline pixel in the line colour of ONE neighbour: the first filled one of up, left, right, down.
    // So each filled cell "owes" a line colour to the outline pixels it decides; parts take the colour most of their cells owe.
    const owe = new Map(); // cell → Map(line hex → count)
    if (outlineMode !== "none") for (let i = 0; i < N * N; i++) { if (body[i] || !px[i]) continue; const x = i % N, y = (i / N) | 0;
      const d = [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]].find(([X, Y]) => at(X, Y) >= 0); if (!d) continue;
      const c = d[1] * N + d[0], k = hex(px[i]); if (!owe.has(c)) owe.set(c, new Map()); owe.get(c).set(k, (owe.get(c).get(k) || 0) + 1); }
    const cellLine = new Map(); owe.forEach((m, c) => { let best = null, bn = 0; m.forEach((n, k) => { if (n > bn) { bn = n; best = k; } }); cellLine.set(c, best); });
    const lineCount = groups.map(() => new Map()); cellLine.forEach((k, c) => { const gi = of[idx[c]]; if (gi === undefined) return; lineCount[gi].set(k, (lineCount[gi].get(k) || 0) + 1); });
    let darkest = null; lineCount.forEach((m) => m.forEach((n, k) => { if (!darkest || lum(unhex(k)) < lum(unhex(darkest))) darkest = k; }));
    const mk = (g, line, twinOf) => {
      const c = [null, null, null]; g.members.forEach((m, k) => (c[g.tones[k]] = hex(palette[m].rgb)));
      if (!c[1]) c[1] = hex(c[0] && c[2] ? [0, 1, 2].map((q) => (unhex(c[0])[q] + unhex(c[2])[q]) / 2) : unhex(c[0] || c[2]));
      if (!c[0]) c[0] = hex(shadowOf(unhex(c[1]))); if (!c[2]) c[2] = hex(lightOf(unhex(c[1])));
      const autoName = g.name, name = shared.names[autoName] || autoName, toneOf = {}; g.members.forEach((m, k) => (toneOf[m] = g.tones[k]));
      const r = { name, autoName, c, line, sw: "Original", set: setFor(g.name), pixels: !!g.pixels, twin: twinOf >= 0, twinOf, toneOf, orig: { c: c.slice(), line } };
      const rc = shared.recolours[autoName]; if (rc && rc.c) { r.c = rc.c.slice(); r.line = outlineMode === "black" || r.twin ? line : rc.line; r.sw = rc.name; }
      return r; };
    const ramps = groups.map((g, gi) => { let line = null, ln = 0; lineCount[gi].forEach((n, k) => { if (n > ln) { ln = n; line = k; } });
      return mk(g, line || (outlineMode === "black" && darkest ? darkest : hex(lineOf(g.mean))), -1); });
    // twins: a hidden copy of a part with another line colour, for the few cells that decide a differently coloured outline pixel
    // (Detail: r66's brown outline around the hair and staff). Same name and colours, recoloured together. Master only.
    const twinOf = new Map(), cellPart = new Int16Array(N * N).fill(-1);
    for (let i = 0; i < N * N; i++) { const v = idx[i]; if (v < 0 || of[v] === undefined) continue; let gi = of[v]; const want = cellLine.get(i);
      if (allowTwins && want && want !== ramps[gi].line && ramps.length < 80) { const k = gi + "|" + want; if (!twinOf.has(k)) { twinOf.set(k, ramps.length); ramps.push(mk(groups[gi], want, gi)); } gi = twinOf.get(k); }
      cellPart[i] = gi; }
    const slots = new Uint8Array(idx.length), base = new Uint8Array(idx.length), solid = (x, y) => x >= 0 && y >= 0 && x < N && y < N && idx[y * N + x] >= 0;
    for (let i = 0; i < idx.length; i++) { const v = idx[i]; if (v < 0 || cellPart[i] < 0) continue; const gi = cellPart[i], r = ramps[gi]; let tone = toneOfM[v] ?? 1;
      base[i] = gi * 3 + tone + 1;
      if (reshade && !r.pixels) { const x = i % N, y = (i / N) | 0; if (!solid(x, y - 1) || !solid(x - 1, y)) tone = Math.min(2, tone + 1); else if (!solid(x, y + 1) || !solid(x + 1, y)) tone = Math.max(0, tone - 1); }
      slots[i] = gi * 3 + tone + 1; }
    const capInfo = reshade && cap != null ? capReshade(slots, base, ramps, outlineMode, cap) : null;
    return { ramps, slots, N, capInfo };
  }

  function bakeResult(R) {
    if (!window.SpriteStudio || !SpriteStudio.renderRecipe) return [];
    return SpriteStudio.renderRecipe(R.slots, R.N, R.N, R.ramps, { outline: R.outline !== "none", shade: false }); // tones are already set; outline is the live rule
  }

  /* ===== state ===== */
  const blankDir = () => ({ original: null, src: null, settings: clone(IC_DEFAULTS), result: null, converted: false, match: true, sample: null });
  const S = { open: false, sheet: null, cur: "down", master: "down", dirs: {}, divider: 0.5, hist: [], redo: [], pickMode: false, showFlags: true, shared: { names: {}, recolours: {} }, part: 0, renaming: false, hintHidden: {} };
  DIRS.forEach(([d]) => (S.dirs[d] = blankDir()));
  window.__icState = S;
  const cur = () => S.dirs[S.cur];
  const adv = () => window.SpriteStudio && SpriteStudio.getMode && SpriteStudio.getMode() === "advanced";

  function snap() { const D = cur(); return { dir: S.cur, settings: clone(D.settings), converted: D.converted, match: D.match, shared: clone(S.shared) }; }
  function restoreSnap(s) { S.cur = s.dir; const D = cur(); D.settings = s.settings; D.match = s.match; S.shared = s.shared; if (s.converted && D.src) convert(S.cur); else { D.converted = false; D.result = null; } }
  function step(fn, msg) { S.hist.push(snap()); if (S.hist.length > 40) S.hist.shift(); S.redo = []; fn(); if (cur().converted) convert(S.cur); render(); if (msg) say(msg); }
  function undo() { if (!S.hist.length) return say("Nothing to undo"); S.redo.push(snap()); restoreSnap(S.hist.pop()); render(); say("Undone one step"); }
  function redo() { if (!S.redo.length) return say("Nothing to redo"); S.hist.push(snap()); restoreSnap(S.redo.pop()); render(); say("Redone"); }

  /* ===== loading a picture (file picker / camera roll, or a sample) ===== */
  function imageToSrc(img) {
    const sc = Math.min(1, MAX_SRC / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * sc)), h = Math.max(1, Math.round(img.naturalHeight * sc));
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
    const id = g.getImageData(0, 0, w, h); // a copy: the original picture is never changed
    // flatten any real transparency onto magenta so it keys like Imagine's magenta
    for (let i = 0; i < id.data.length; i += 4) if (id.data[i + 3] < 128) { id.data[i] = 255; id.data[i + 1] = 0; id.data[i + 2] = 255; id.data[i + 3] = 255; }
    return { w, h, d: id.data, canvas: c };
  }
  function loadInto(d, url, sample) {
    return new Promise((res, rej) => { const img = new Image(); img.onload = () => {
      const D = S.dirs[d]; S.hist.push(snap()); S.redo = [];
      D.original = img; D.src = imageToSrc(img); D.converted = false; D.result = null; D.sample = sample || null;
      D.settings = clone(IC_DEFAULTS); D.match = d !== S.master;
      S.cur = d; S.pickMode = false; S.sheet = null; S.hintHidden = {};
      render(); say("Picture loaded. Tap Convert."); res(); }; img.onerror = () => { toast("That file didn't open as a picture"); rej(); }; img.src = url; });
  }
  function pickFile() { const f = $("#ic-file"); if (f) { f.value = ""; f.click(); } }
  function onFile(e) {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const go = (f) => { const r = new FileReader(); r.onload = () => loadInto(S.cur, r.result, null); r.readAsDataURL(f); };
    if (window.TileEngineSafe && TileEngineSafe.validateImageFile) {
      TileEngineSafe.validateImageFile(file).then((res) => {
        if (!res.ok) { toast(res.error); return; }
        go(file);
      });
      return;
    }
    go(file);
  }

  /* ===== UI ===== */
  function say(m) { const l = $("#ic-live"); if (l) l.textContent = m; }
  function toast(m) { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3200); }
  function build() {
    const host = $("#screen-sprite-studio"); if (!host || $("#ic-root")) return;
    const el = document.createElement("div"); el.id = "ic-root"; el.className = "ic-root"; el.hidden = true;
    el.innerHTML = `
      <div class="stage-top ic-top" role="banner"><div class="stage-top-main">
        <button type="button" class="btn btn-ghost btn-back-label" id="ic-back" aria-label="Back to Sprite Studio">Back</button>
        <h1 class="stage-title" id="ic-title">Picture</h1>
        <div class="stage-top-actions">
          <div class="ss-mode" role="group" aria-label="Editor mode"><button type="button" class="ss-mode-btn" data-ic-mode="basic" aria-pressed="true">Basic</button><button type="button" class="ss-mode-btn" data-ic-mode="advanced" aria-pressed="false">Advanced</button></div>
          <button type="button" class="btn btn-ghost stage-icon-btn" id="ic-help-btn" aria-label="Help: what works best">?</button>
          <button type="button" class="btn btn-primary stage-play-btn ic-keep" id="ic-keep" aria-label="Keep: use this as my sprite">Keep</button>
        </div></div></div>
      <div class="ic-main">
        <div class="ic-viewport" id="ic-viewport" aria-label="Before and after">
          <canvas id="ic-canvas" class="ic-canvas" role="img" aria-label="Before and after picture"></canvas>
          <div class="ic-banner" id="ic-banner" hidden role="status"><span id="ic-banner-text"></span><span class="ic-banner-btns" id="ic-banner-btns"></span></div>
          <p class="ic-stat" id="ic-stat" hidden></p>
          <div class="ic-empty" id="ic-empty">
            <p class="ic-empty-title">Turn a picture into pixel art</p>
            <p class="hint ic-empty-sub">Grok Imagine art on a magenta background works best. Nothing is uploaded.</p>
            <label class="btn btn-primary ic-big" for="ic-file" id="ic-choose">Choose picture</label>
            <button type="button" class="btn btn-ghost ic-big" id="ic-try">Try a sample</button>
            <ul class="ic-help-list ic-empty-help"><li>Simple, front-facing art on a plain background works best.</li><li>Small details like eyes or straps may need a quick pencil touch-up.</li></ul>
          </div>
          <button type="button" class="btn btn-primary ic-convert" id="ic-convert" hidden>Convert</button>
          <button type="button" class="ss-fab ic-fab-undo" id="ic-fab-undo" hidden>Undo</button>
          <button type="button" class="ss-fab ic-fab-orig" id="ic-fab-orig" hidden>Back to original</button>
        </div>
        <div class="stage-sheet ic-sheet" id="ic-sheet" hidden>
          <div class="stage-sheet-bar"><button type="button" class="sheet-undo-btn" id="ic-undo" aria-label="Undo">Undo</button>
            <button type="button" class="stage-sheet-handle" id="ic-sheet-close" aria-label="Close options"><span class="handle-bar" aria-hidden="true"></span></button>
            <button type="button" class="sheet-undo-btn" id="ic-redo" aria-label="Redo">Redo</button></div>
          <div class="stage-sheet-body" id="ic-sheet-body"></div>
        </div>
        <nav class="stage-rail ic-rail" id="ic-rail" role="toolbar" aria-label="Picture tools"></nav>
      </div>
      <input type="file" id="ic-file" accept="image/*" class="ic-file" tabindex="-1" aria-hidden="true">
      <p class="ss-live" id="ic-live" aria-live="polite"></p>`;
    host.appendChild(el);
    $("#ic-file").addEventListener("change", onFile);
    $("#ic-back").onclick = close;
    $("#ic-help-btn").onclick = () => openSheet(S.sheet === "help" ? null : "help");
    $("#ic-keep").onclick = keep;
    $("#ic-try").onclick = () => openSheet("picture");
    $("#ic-convert").onclick = () => doConvert();
    $("#ic-fab-undo").onclick = undo; $("#ic-undo").onclick = undo; $("#ic-redo").onclick = redo;
    $("#ic-fab-orig").onclick = backToOriginal;
    $("#ic-sheet-close").onclick = () => openSheet(null);
    $$("[data-ic-mode]").forEach((b) => (b.onclick = () => { SpriteStudio.setModeUser(b.dataset.icMode); render(); }));
    const vp = $("#ic-viewport");
    vp.addEventListener("pointerdown", onDown); vp.addEventListener("pointermove", onMove); vp.addEventListener("pointerup", onUp); vp.addEventListener("pointercancel", onUp);
    if (window.ResizeObserver) new ResizeObserver(() => S.open && drawCanvas()).observe(vp);
    new MutationObserver(() => S.open && render()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  function open(opts = {}) {
    build(); S.open = true; $("#ic-root").hidden = false;
    if (opts.dir) S.cur = opts.dir;
    render();
    if (opts.pick) pickFile(); // same tap opens the file picker / camera roll
  }
  function close() { S.open = false; S.sheet = null; const r = $("#ic-root"); if (r) r.hidden = true; if (window.SpriteStudio) SpriteStudio.onShow(); }
  function openSheet(id) { S.sheet = id; S.renaming = false; render(); const b = $("#ic-sheet-body"); if (b) b.scrollTop = 0; }
  function doConvert() {
    const D = cur(); if (!D.src) return;
    S.hist.push(snap()); S.redo = []; convert(S.cur); S.divider = 0.5; S.sheet = "look"; render();
    const R = D.result; say(`Converted: ${R.N}×${R.N}, ${LOOK_NAME[R.look]}, ${new Set(bakeResult(R).filter(Boolean)).size} colours, ${R.ramps.filter((r) => !r.pixels && !r.twin).length} parts. Drag the line to compare.`);
  }
  function backToOriginal() { step(() => { const D = cur(); D.converted = false; D.result = null; D.settings = clone(IC_DEFAULTS); S.pickMode = false; }, "Back to the original picture"); }

  function keep() {
    const M = S.dirs[S.master];
    if (!M.converted) { toast(M.src ? "Tap Convert first" : "Choose a picture first"); return; }
    const dirs = {}; let rematched = [];
    DIRS.forEach(([d]) => { const D = S.dirs[d]; if (!D.converted) return;
      if (d !== S.master && !D.result.matched) { D.match = true; convert(d); rematched.push(d); }
      dirs[d] = D.result.slots.slice(); });
    convert(S.master); dirs[S.master] = M.result.slots.slice();
    const R = M.result;
    SpriteStudio.importConverted({ W: R.N, H: R.N, dirs, master: S.master, ramps: R.ramps.map((r) => ({ name: r.name, c: r.c.slice(), line: r.line, sw: r.sw, set: r.set, pixels: r.pixels || !!r.twin, twinOf: r.twin ? r.twinOf : undefined, orig: r.orig })),
      oneLine: R.outline === "black" && !R.rampMode,
      keepShade: true, reshade: R.reshade, outline: R.outline !== "none", original: M.sample || "your picture" });
    const n = Object.keys(dirs).length;
    close();
    let dataUrl = null;
    try {
      const cols = bakeResult(R);
      if (cols && cols.length) {
        const c = document.createElement("canvas"); c.width = R.N; c.height = R.N;
        const g = c.getContext("2d");
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i]; if (!col) continue;
          g.fillStyle = typeof col === "string" ? col : ("#" + (col >>> 0).toString(16).padStart(6, "0"));
          g.fillRect(i % R.N, Math.floor(i / R.N), 1, 1);
        }
        dataUrl = c.toDataURL("image/png");
      }
    } catch (_) {}
    if (window.TileEngineQoL && TileEngineQoL.keepAsProjectAsset) {
      const id = TileEngineQoL.keepAsProjectAsset({ name: "Kept sprite", w: R.N, h: R.N, dataUrl });
      if (id && TileEngineQoL.offerPlaceKept) TileEngineQoL.offerPlaceKept(id);
    } else {
      toast(`Kept as your sprite · ${R.ramps.filter((r) => !r.pixels && !r.twin).length} parts${n > 1 ? ` · ${n} directions` : ""}${rematched.length ? " · matched to the first picture" : ""} · original kept`);
    }
  }

  function railBtn(id, name, ico, pressed, dis) { return `<button type="button" class="rail-btn" data-ic-tool="${id}" aria-pressed="${pressed}"${dis ? " disabled" : ""} aria-label="${name}"><span class="rail-ico" aria-hidden="true">${ico}</span><span class="rail-lbl">${name}</span></button>`; }
  function renderRail() {
    const D = cur(), r = $("#ic-rail");
    r.innerHTML = railBtn("picture", "Picture", "🖼", S.sheet === "picture") + railBtn("look", "Look", "🎨", S.sheet === "look", !D.src) + railBtn("adjust", "Adjust", "🎚", S.sheet === "adjust", !D.src)
      + railBtn("parts", "Parts", "🧩", S.sheet === "parts", !D.converted) + railBtn("dirs", "4 ways", "🧭", S.sheet === "dirs");
    $$("[data-ic-tool]", r).forEach((b) => (b.onclick = () => openSheet(S.sheet === b.dataset.icTool ? null : b.dataset.icTool)));
  }
  const chip = (attr, v, label, on, extra = "") => `<button type="button" class="toggle ic-chip" data-${attr}="${v}" aria-pressed="${on}"${extra}>${label}</button>`;
  function row(label, inner, cls) { return `<div class="ic-row${cls ? " " + cls : ""}"><span class="ic-lbl">${label}</span><div class="ic-ctl">${inner}</div></div>`; }
  function slider(id, label, min, max, val, lo, hi) { return `<div class="ic-row ic-srow"><span class="ic-lbl" id="${id}-val">${label}</span><label class="ic-slider"><span class="ic-ends" aria-hidden="true"><span>${lo}</span><span>${hi}</span></span><input type="range" id="${id}" min="${min}" max="${max}" step="1" value="${val}" aria-label="${label}"></label></div>`; }
  function sheetHtml(id) {
    const D = cur(), set = D.settings, R = D.result, M = S.dirs[S.master];
    const locked = S.cur !== S.master && D.match && M.result;
    switch (id) {
      case "adjust": {
        const bgLbl = { magenta: "Magenta", corner: "Corner colour", pick: "Pick" };
        let h = D.converted ? "" : `<div class="ss-sheet-head"><p class="eyebrow">Adjust, then Convert</p><button type="button" class="toggle" id="ic-sheet-convert">Convert</button></div>`;
        if (locked) h += `<p class="hint ss-tight">Size, look, colours and detail follow the first picture (Match to master). Change it in 4 ways.</p>`;
        else {
          h += row("Size", chip("ic-size", 32, "32 px", set.size === 32) + chip("ic-size", 64, "64 px", set.size === 64));
          h += row("Colours", chip("ic-pal", "auto", "Auto from my art", set.palette === "auto") + chip("ic-pal", "ramp", "My style", set.palette === "ramp"));
          if (set.palette === "ramp") h += `<p class="hint ss-tight ic-ramp-note">My style: TileEngine's default colour sets (your project has no own set yet).</p>`;
        }
        h += row("Background", ["magenta", "corner", "pick"].map((m) => chip("ic-bg", m, bgLbl[m], (R ? (set.bgMode === "pick" ? "pick" : R.det.used) : set.bgMode) === m)).join(""));
        h += slider("ic-tol", `Tolerance ${set.tolerance}`, 0, 100, set.tolerance, "Less", "More");
        if (adv() && !locked) {
          h += `<p class="eyebrow ic-adv-head">Advanced</p>`;
          if (set.look !== "crisp") h += `<p class="hint ss-tight">Shrink, outline and clean-up apply to the Crisp look. ${LOOK_NAME[set.look]} has its own.</p>`;
          h += row("Shrink by", chip("ic-ds", "twopass", "2-pass (best)", set.downscale !== "majority") + chip("ic-ds", "majority", "Most common colour", set.downscale === "majority"));
          h += row("Outline", chip("ic-ol", "black", "Near-black", set.outline === "black") + chip("ic-ol", "hue", "Dark hue", set.outline === "hue") + chip("ic-ol", "none", "None", set.outline === "none"));
          h += row("Extras", `<button type="button" class="toggle ic-chip ic-tick" id="ic-clean" aria-pressed="${!!set.clean}"><span class="ic-check" aria-hidden="true">${set.clean ? "✓" : ""}</span>Tidy stray pixels</button><button type="button" class="toggle ic-chip ic-tick ic-reshade" id="ic-reshade" aria-pressed="${!!set.reshade}"><span class="ic-check" aria-hidden="true">${set.reshade ? "✓" : ""}</span>Light from top left</button>`, "ic-row-extras");
          h += slider("ic-merge", `Merge ${set.merge}`, 10, 120, set.merge, "More parts", "Fewer");
        }
        return h;
      }
      case "look": {
        const an = R && R.analyse, okDetail = DETAIL_LOOKS.includes(set.look);
        let h = D.converted ? "" : `<div class="ss-sheet-head"><p class="eyebrow">Pick a look, then Convert</p><button type="button" class="toggle" id="ic-sheet-convert">Convert</button></div>`;
        if (locked) return h + `<p class="hint ss-tight">Look and detail follow the first picture (Match to master): ${LOOK_NAME[M.settings.look]}, ${M.settings.detail} colours. Change it in 4 ways.</p>`;
        if (D.converted) h += `<p class="eyebrow">Look</p>`;
        h += `<div class="ic-looks" role="group" aria-label="Look">${LOOKS.map(([id, l]) => chip("ic-look", id, `<span class="ic-look-l">${an && an.pick === id ? '<span class="ic-star" aria-hidden="true">★</span>' : ""}${l}</span>${id === "hd2d" ? "<small> 64 px</small>" : ""}`, set.look === id, an && an.pick === id ? ` aria-label="${l}, suggested"` : "")).join("")}</div>`;
        h += an ? `<p class="ic-why" id="ic-why"><b>★ Suggested: ${LOOK_NAME[an.pick]}.</b> ${esc(an.why)}</p>` : `<p class="hint ss-tight ic-why" id="ic-why">Convert to see which look suits this picture.</p>`;
        h += `<div class="ic-row ic-detail-row"><span class="ic-lbl">Detail</span><div class="ic-ctl">${DETAILS.map(([v, l, sub]) => chip("ic-detail", v, `${l}<small>${sub}</small>`, okDetail && set.detail === v, okDetail ? "" : " disabled")).join("")}</div></div>`;
        h += `<p class="hint ss-tight ic-detail-note">${okDetail ? "Detailed adds colours to the face, hair and weapon only. The body stays the same." : `Detail works with Crisp and 16-bit. ${LOOK_NAME[set.look]} keeps its own colours.`}</p>`;
        return h;
      }
      case "picture":
        return `<p class="eyebrow">Picture for ${DIRS.find((x) => x[0] === S.cur)[1]}${S.cur === S.master ? " · master" : ""}</p>
          <label class="btn btn-primary ss-wide ic-choose2" for="ic-file">Choose picture</label>
          <p class="eyebrow ic-sub-head">Or try a sample</p>
          <div class="ic-samples">${SAMPLES.map((s) => `<button type="button" class="ic-sample" data-ic-sample="${s.id}" aria-pressed="${D.sample === s.id}" aria-label="Sample: ${s.name}, ${s.sub}"><img src="${s.file}" alt="" width="48" height="48"><span><b>${s.name}</b><small>${s.sub}</small></span></button>`).join("")}</div>`;
      case "parts": {
        if (!R) return `<p class="hint">Convert first, then your colour areas show here as parts.</p>`;
        const vis = R.ramps.map((r, i) => [r, i]).filter(([r]) => !r.pixels && !r.twin), pix = R.ramps.filter((r) => r.pixels && !r.twin);
        if (S.part >= R.ramps.length || R.ramps[S.part].pixels || R.ramps[S.part].twin) S.part = vis.length ? vis[0][1] : 0;
        const sel = R.ramps[S.part], sws = ((window.SpriteStudio && SpriteStudio.parts.SWATCHES[sel.set]) || []);
        let h = `<div class="ss-sheet-head"><p class="eyebrow">Parts · tap a part, then a colour</p><button type="button" class="toggle" id="ic-rename" aria-pressed="${S.renaming}">Rename</button></div>`;
        h += `<div class="ss-pchips ic-pchips" role="group" aria-label="Part">${vis.map(([r, i]) => `<button type="button" class="ss-pchip" data-ic-part="${i}" aria-pressed="${S.part === i}"><span class="ss-dot" style="background:${r.c[1]}" aria-hidden="true"></span>${esc(r.name)}</button>`).join("")}${pix.length ? `<span class="ic-pixels-chip" title="">Pixels · ${pix.length} small bit${pix.length > 1 ? "s" : ""}</span>` : ""}</div>`;
        if (S.renaming) h += `<div class="ic-rename-row">${NAME_IDEAS.map((n) => `<button type="button" class="toggle ic-chip" data-ic-name="${n}">${n}</button>`).join("")}</div>
          <div class="ic-rename-type"><input type="text" id="ic-name-input" maxlength="16" value="${esc(sel.name)}" aria-label="Part name"><button type="button" class="btn btn-primary" id="ic-name-save">Save</button></div>`;
        else h += `<div class="ss-swatches" role="group" aria-label="${esc(sel.name)} colours">${[{ name: "Original", c: sel.orig.c, line: sel.orig.line }].concat(sws).map((w) => `<button type="button" class="ss-sw${w.name === "Original" ? " ic-sw-orig" : ""}" data-ic-sw="${esc(w.name)}" aria-pressed="${sel.sw === w.name}" aria-label="${esc(sel.name)}: ${w.name}" style="background:linear-gradient(${w.c[2]} 0 34%, ${w.c[1]} 34% 67%, ${w.c[0]} 67%)">${w.name === "Original" ? "<span>Original</span>" : ""}</button>`).join("")}</div>
          <p class="hint ss-tight">The whole part changes, like a ready-made hero. Small bits (Pixels) keep their colours.</p>`;
        return h;
      }
      case "dirs": {
        const M2 = S.dirs[S.master];
        let h = `<p class="eyebrow">4 ways · one picture per direction</p><div class="ic-dirs">${DIRS.map(([d, l]) => { const X = S.dirs[d];
          return `<button type="button" class="ic-dir" data-ic-dir="${d}" aria-pressed="${S.cur === d}" aria-label="${l}${d === S.master ? ", master" : ""}${X.converted ? ", converted" : X.src ? ", picture loaded" : ", no picture yet"}"><canvas class="ic-dir-thumb" data-ic-thumb="${d}" width="32" height="32" aria-hidden="true"></canvas><span><b>${l}</b><small>${d === S.master ? "Master" : X.converted ? (X.result.matched ? "Matched" : "Own colours") : X.src ? "Not converted" : "No picture"}</small></span></button>`; }).join("")}</div>`;
        if (S.cur !== S.master) {
          h += `<button type="button" class="toggle ss-wide-toggle" id="ic-match" aria-pressed="${D.match}" ${M2.result ? "" : "disabled"}>${D.match ? "✓ " : ""}Match to master (same colours, parts, size and foot line)</button>`;
          if (!M2.result) h += `<p class="hint ss-tight">Convert the ${DIRS.find((x) => x[0] === S.master)[1]} picture first. It becomes the master.</p>`;
          if (R && R.matched) h += `<p class="hint ss-tight ic-flag-line">${R.flagged.length ? `⚑ ${R.flagged.length} pixel${R.flagged.length > 1 ? "s" : ""} in ${R.flagColours} colour${R.flagColours > 1 ? "s" : ""} weren't in the master, so they use the nearest master colour.` : "✓ Every colour fits the master."}</p>${R.flagged.length ? `<button type="button" class="toggle ss-wide-toggle" id="ic-flags" aria-pressed="${S.showFlags}">${S.showFlags ? "✓ " : ""}Show those pixels</button>` : ""}`;
          if (!D.src) h += `<label class="btn btn-ghost ss-wide" for="ic-file">Choose picture for ${DIRS.find((x) => x[0] === S.cur)[1]}</label>`;
        } else h += `<p class="hint ss-tight">This is the master. Pictures for the other directions reuse its colours, parts, size and foot line.</p>`;
        return h;
      }
      case "help":
        return `<p class="eyebrow">What works best</p><ul class="ic-help-list">
          <li><b>Simple, front-facing art</b> on a <b>plain background</b> works best. Magenta is ideal.</li>
          <li><b>Small details</b> like eyes or straps may need a quick pencil touch-up after Keep.</li>
          <li>It converts <b>one picture per direction</b>. Use <b>Match to master</b> in 4 ways to keep all four the same.</li>
          <li>Your original picture is always kept. Nothing is uploaded.</li></ul>
          <p class="eyebrow ic-sub-head">Prompt tip for ${LOOK_NAME[D.settings.look]}</p>
          <p class="ic-tip" id="ic-tip">“${esc(((window.ConvertEngine && ConvertEngine.PROMPT_TIPS) || {})[D.settings.look] || "")}”</p>
          <p class="hint ss-tight">Add this to your Grok Imagine prompt. The tip changes with the look.</p>`;
      default: return "";
    }
  }
  const esc = (s) => (window.TileEngineSafe && TileEngineSafe.escapeHtml) ? TileEngineSafe.escapeHtml(s) : String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function wireSheet() {
    const b = $("#ic-sheet-body"), D = cur();
    const set = (k, v, msg) => step(() => { D.settings[k] = v; }, msg);
    $("#ic-sheet-convert") && ($("#ic-sheet-convert").onclick = doConvert);
    $("#ic-orig2") && ($("#ic-orig2").onclick = backToOriginal);
    $$("[data-ic-size]", b).forEach((x) => (x.onclick = () => { const v = +x.dataset.icSize;
      step(() => { D.settings.size = v; if (v < 64 && D.settings.look === "hd2d") D.settings.look = "crisp"; }, v < 64 && D.settings.look === "hd2d" ? "Size 32 px. HD-2D needs 64, so the look is Crisp" : `Size ${v} px`); }));
    $("#ic-reshade") && ($("#ic-reshade").onclick = () => set("reshade", !D.settings.reshade, D.settings.reshade ? "Light from top left off: the art's own shading" : "Light from top left on"));
    $("#ic-clean") && ($("#ic-clean").onclick = () => set("clean", !D.settings.clean, D.settings.clean ? "Stray pixels kept" : "Stray pixels tidied"));
    $$("[data-ic-look]", b).forEach((x) => (x.onclick = () => { const v = x.dataset.icLook;
      step(() => { D.settings.look = v; if (v === "hd2d" && D.settings.size < 64) D.settings.size = 64; }, v === "hd2d" && D.settings.size < 64 ? "HD-2D needs 64 px, so the size is now 64" : `Look: ${LOOK_NAME[v]}`); }));
    $$("[data-ic-detail]", b).forEach((x) => (x.onclick = () => { const v = +x.dataset.icDetail; set("detail", v, `${DETAILS.find((q) => q[0] === v)[1]}: up to ${v} colours`); }));
    $$("[data-ic-pal]", b).forEach((x) => (x.onclick = () => set("palette", x.dataset.icPal, x.dataset.icPal === "ramp" ? "Using my style colours" : "Colours from your art")));
    $$("[data-ic-bg]", b).forEach((x) => (x.onclick = () => {
      const m = x.dataset.icBg;
      if (m === "pick") { S.pickMode = true; S.sheet = null; render(); say("Tap the background colour on the picture"); return; }
      step(() => { D.settings.bgMode = m; D.settings.picked = null; S.hintHidden = {}; }, m === "magenta" ? "Magenta key" : "Corner colour key");
    }));
    $$("[data-ic-ds]", b).forEach((x) => (x.onclick = () => set("downscale", x.dataset.icDs)));
    $$("[data-ic-ol]", b).forEach((x) => (x.onclick = () => set("outline", x.dataset.icOl)));
    const range = (id, key, fmt) => { const el = $("#" + id); if (!el) return;
      el.oninput = () => { const v = $("#" + id + "-val"); if (v) v.textContent = fmt(+el.value); };
      el.onchange = () => set(key, +el.value); };
    range("ic-tol", "tolerance", (v) => `Tolerance ${v}`); range("ic-merge", "merge", (v) => `Merge ${v}`);
    $$("[data-ic-sample]", b).forEach((x) => (x.onclick = () => { const s = SAMPLES.find((y) => y.id === x.dataset.icSample); loadInto(S.cur, s.file, s.id); }));
    $$("[data-ic-part]", b).forEach((x) => (x.onclick = () => { S.part = +x.dataset.icPart; S.renaming = false; render(); }));
    $("#ic-rename") && ($("#ic-rename").onclick = () => { S.renaming = !S.renaming; render(); });
    $$("[data-ic-name]", b).forEach((x) => (x.onclick = () => renamePart(x.dataset.icName)));
    $("#ic-name-save") && ($("#ic-name-save").onclick = () => renamePart($("#ic-name-input").value.trim()));
    $$("[data-ic-sw]", b).forEach((x) => (x.onclick = () => recolourPart(x.dataset.icSw)));
    $$("[data-ic-dir]", b).forEach((x) => (x.onclick = () => { S.cur = x.dataset.icDir; render(); say(DIRS.find((y) => y[0] === S.cur)[1] + " picture"); }));
    $$("[data-ic-thumb]", b).forEach((cv) => drawThumb(cv, S.dirs[cv.dataset.icThumb]));
    $("#ic-match") && ($("#ic-match").onclick = () => step(() => { D.match = !D.match; }, D.match ? "Own colours for this direction" : "Matched to the master"));
    $("#ic-flags") && ($("#ic-flags").onclick = () => { S.showFlags = !S.showFlags; render(); });
  }
  function renamePart(name) { const R = cur().result; if (!R || !name) return; if (window.TileEngineSafe && TileEngineSafe.clampName) name = TileEngineSafe.clampName(name); const auto = R.ramps[S.part].autoName; step(() => { S.shared.names[auto] = name; S.renaming = false; }, `Part renamed to ${name}`); }
  function recolourPart(swName) {
    const R = cur().result; if (!R) return; const r = R.ramps[S.part];
    const sw = swName === "Original" ? null : (SpriteStudio.parts.SWATCHES[r.set] || []).find((s) => s.name === swName);
    step(() => { if (sw) S.shared.recolours[r.autoName] = { name: sw.name, c: sw.c.slice(), line: sw.line }; else delete S.shared.recolours[r.autoName]; }, `${r.name} is now ${swName.toLowerCase()}`);
  }
  function drawThumb(cv, D) {
    const g = cv.getContext("2d"); g.clearRect(0, 0, cv.width, cv.height);
    if (D.converted) { const R = D.result, cols = bakeResult(R); cv.width = R.N; cv.height = R.N; cols.forEach((c, i) => { if (c) { g.fillStyle = c; g.fillRect(i % R.N, (i / R.N) | 0, 1, 1); } }); }
    else if (D.original) { g.imageSmoothingEnabled = true; g.drawImage(D.original, 0, 0, cv.width, cv.height); }
  }

  function banner() {
    const D = cur(), R = D.result; if (S.pickMode) return { text: "Tap the background colour on the picture.", btns: [["ic-pick-cancel", "Cancel"]] };
    if (!R) return null;
    // r68: the pink hint only when the magenta key could eat real magenta-pink in the sprite; after the user switches
    // it confirms. A missing magenta border is its own note (never blamed on pink).
    const userKey = cur().settings.bgMode !== "magenta" && R.det.used === cur().settings.bgMode;
    if (R.pink && !S.hintHidden.pink && (R.det.used === "magenta" || userKey)) return R.det.used === "magenta"
      ? { text: "Your sprite has pink in it. Try Corner colour or Pick background.", btns: [["ic-go-corner", "Corner colour"], ["ic-go-pick", "Pick background"]] }
      : { text: `${R.det.used === "pick" ? "Your picked background" : "The corner colour"} is used, so the pink in your sprite stays.`, btns: [["ic-hint-ok", "OK"]] };
    if (R.det.note === "nomagenta" && !S.hintHidden.nomag) return { text: "No magenta background found, so the corner colour is used.", btns: [["ic-hint-ok2", "OK"]] };
    return null;
  }
  function renderBanner() {
    const bn = banner(), el = $("#ic-banner"); el.hidden = !bn; if (!bn) return;
    $("#ic-banner-text").textContent = bn.text;
    $("#ic-banner-btns").innerHTML = bn.btns.map(([id, l]) => `<button type="button" class="toggle" id="${id}">${l}</button>`).join("");
    const D = cur();
    $("#ic-pick-cancel") && ($("#ic-pick-cancel").onclick = () => { S.pickMode = false; render(); });
    $("#ic-go-corner") && ($("#ic-go-corner").onclick = () => step(() => { D.settings.bgMode = "corner"; }, "Corner colour key"));
    $("#ic-go-pick") && ($("#ic-go-pick").onclick = () => { S.pickMode = true; render(); });
    $("#ic-hint-ok") && ($("#ic-hint-ok").onclick = () => { S.hintHidden.pink = true; render(); });
    $("#ic-hint-ok2") && ($("#ic-hint-ok2").onclick = () => { S.hintHidden.nomag = true; render(); });
  }
  function render() {
    if (!S.open) return;
    const D = cur(), R = D.result, a = adv();
    $$("[data-ic-mode]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.icMode === "advanced") === a)));
    $("#ic-title").textContent = S.cur === "down" && !S.dirs.up.src && !S.dirs.left.src && !S.dirs.right.src ? "Picture" : DIRS.find((x) => x[0] === S.cur)[1];
    $("#ic-keep").disabled = !S.dirs[S.master].converted;
    $("#ic-empty").hidden = !!D.src || S.sheet === "picture";
    $("#ic-convert").hidden = !D.src || D.converted || S.pickMode;
    $("#ic-fab-undo").hidden = !D.src || !!S.sheet || !S.hist.length;
    $("#ic-fab-orig").hidden = !D.converted || S.pickMode; // always there once converted
    const st = $("#ic-stat"); st.hidden = !R || S.pickMode;
    if (R) st.textContent = `${R.N}×${R.N} · ${LOOK_NAME[R.look]} · ${new Set(bakeResult(R).filter(Boolean)).size} colours · ${R.ramps.filter((r) => !r.pixels && !r.twin).length} parts`;
    const sh = $("#ic-sheet"); sh.hidden = !S.sheet;
    $("#ic-undo").disabled = !S.hist.length; $("#ic-redo").disabled = !S.redo.length;
    if (S.sheet) { $("#ic-sheet-body").innerHTML = sheetHtml(S.sheet); wireSheet(); }
    renderRail(); renderBanner(); drawCanvas();
  }

  /* ===== canvas: Before | After with a drag divider ===== */
  let geom = null;
  function drawCanvas() {
    const cv = $("#ic-canvas"), vp = $("#ic-viewport"); if (!cv || !vp) return;
    const W = vp.clientWidth, H = vp.clientHeight, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const D = cur(); geom = null; if (!D.src) return;
    const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const ca = css("--checker-a") || "#eceff4", cb = css("--checker-b") || "#fff";
    const topPad = $("#ic-banner").hidden ? 52 : 108, botPad = D.converted ? 72 : 76;
    const avail = Math.max(64, Math.min(W - 24, H - topPad - botPad));
    if (!D.converted || S.pickMode) { // the original, whole and untouched
      const o = D.original, sc = avail / Math.max(o.naturalWidth, o.naturalHeight), w = o.naturalWidth * sc, h = o.naturalHeight * sc, x = (W - w) / 2, y = topPad + (H - topPad - botPad - h) / 2;
      g.imageSmoothingEnabled = true; g.drawImage(o, x, y, w, h); g.strokeStyle = css("--line"); g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      geom = { mode: "orig", x, y, w, h, sc: w / D.src.w };
      label(g, "Original", x + 8, y + 8, css); return;
    }
    const R = D.result, N = R.N, c = Math.max(2, Math.floor(avail / N)), size = c * N, x0 = Math.round((W - size) / 2), y0 = Math.round(topPad + (H - topPad - botPad - size) / 2);
    const split = x0 + Math.round(size * S.divider);
    geom = { mode: "pair", x0, y0, c, size, split };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { g.fillStyle = (x + y) % 2 ? ca : cb; g.fillRect(x0 + x * c, y0 + y * c, c, c); }
    // Before (left): the picture's subject box, placed exactly where the pixels land
    g.save(); g.beginPath(); g.rect(x0, y0, split - x0, size); g.clip();
    const b = R.box, pl = R.place; g.imageSmoothingEnabled = true;
    g.drawImage(R.cut, b.bx, b.by, b.bw, b.bh, x0 + pl.ox * c, y0 + pl.oy * c, (b.bw / pl.s) * c, (b.bh / pl.s) * c);
    g.restore();
    // After (right): the converted pixels with the live outline + shade rules
    g.save(); g.beginPath(); g.rect(split, y0, x0 + size - split, size); g.clip();
    bakeResult(R).forEach((col, i) => { if (col) { g.fillStyle = col; g.fillRect(x0 + (i % N) * c, y0 + ((i / N) | 0) * c, c, c); } });
    if (S.showFlags && R.flagged.length) { g.strokeStyle = css("--accent") || "#2f5bff"; g.lineWidth = 2; g.setLineDash([3, 2]);
      R.flagged.forEach((i) => g.strokeRect(x0 + (i % N) * c + 1, y0 + ((i / N) | 0) * c + 1, c - 2, c - 2)); g.setLineDash([]); }
    g.restore();
    g.strokeStyle = css("--line"); g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, size - 1, size - 1);
    // divider + 48px knob
    g.fillStyle = css("--accent") || "#2f5bff"; g.fillRect(split - 1.5, y0 - 6, 3, size + 12);
    g.beginPath(); g.arc(split, y0 + size / 2, 24, 0, Math.PI * 2); g.fill();
    g.fillStyle = css("--accent-ink") || "#fff"; g.font = "800 16px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("‹ ›", split, y0 + size / 2 + 1);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    label(g, "Before", x0 + 6, y0 - 30, css); label(g, "After", x0 + size - 56, y0 - 30, css);
  }
  function label(g, t, x, y, css) {
    g.font = "750 13px system-ui, sans-serif"; const w = g.measureText(t).width + 18;
    g.fillStyle = css("--surface") || "#fff"; g.strokeStyle = css("--line"); g.lineWidth = 2;
    if (g.roundRect) { g.beginPath(); g.roundRect(x, y, w, 24, 12); g.fill(); g.stroke(); } else { g.fillRect(x, y, w, 24); }
    g.fillStyle = css("--ink") || "#12141a"; g.fillText(t, x + 9, y + 16.5);
  }
  let drag = null;
  function onDown(e) {
    if (e.target.closest("button, label, .ic-banner, .ic-empty")) return;
    if (!geom) return;
    if (S.pickMode && geom.mode === "orig") { pickAt(e); return; }
    if (geom.mode === "pair") { drag = e.pointerId; try { e.target.setPointerCapture(e.pointerId); } catch (_) {} moveDivider(e); e.preventDefault(); }
  }
  function onMove(e) { if (drag === e.pointerId) moveDivider(e); }
  function onUp(e) { if (drag === e.pointerId) drag = null; }
  function moveDivider(e) { const r = $("#ic-canvas").getBoundingClientRect(); S.divider = Math.max(0, Math.min(1, (e.clientX - r.left - geom.x0) / geom.size)); drawCanvas(); }
  function pickAt(e) {
    const r = $("#ic-canvas").getBoundingClientRect(), D = cur();
    const x = Math.floor((e.clientX - r.left - geom.x) / geom.sc), y = Math.floor((e.clientY - r.top - geom.y) / geom.sc);
    if (x < 0 || y < 0 || x >= D.src.w || y >= D.src.h) return say("Tap on the picture");
    const p = patch(D.src, x, y).map(Math.round);
    S.pickMode = false;
    step(() => { D.settings.bgMode = "pick"; D.settings.picked = p; S.hintHidden = {}; if (!D.converted) convert(S.cur); }, "Background picked");
  }

  window.ImagineConvert = {
    open, close, DEFAULTS: IC_DEFAULTS,
    fn: { toStyleRamp, detectBackground, keyBackground, subjectBox, placement, downscale, autoPalette, styleRampPalette, snapPalette, cleanUp, groupParts, buildRamps, convert, pinkInside },
    _cap: {
      enginePx: () => { const R = cur().result; return R ? Array.from(R.enginePx, (c) => (c ? hex(c) : null)) : []; },
      file: (url, dir) => loadInto(dir || S.cur, url, null),
      sample: (id, dir) => { const s = SAMPLES.find((y) => y.id === id); return loadInto(dir || S.cur, s.file, s.id); },
      convert: doConvert, set: (k, v) => step(() => { cur().settings[k] = v; }), openSheet, setDir: (d) => { S.cur = d; render(); }, divider: (f) => { S.divider = f; drawCanvas(); },
      undo, keep, backToOriginal, recolourPart, renamePart, part: (i) => { S.part = i; render(); },
      pickAtFrac: (fx, fy) => { const D = cur(); const p = patch(D.src, Math.floor(fx * D.src.w), Math.floor(fy * D.src.h)).map(Math.round); step(() => { D.settings.bgMode = "pick"; D.settings.picked = p; S.pickMode = false; }); },
      reset: () => { DIRS.forEach(([d]) => (S.dirs[d] = blankDir())); S.cur = "down"; S.hist = []; S.redo = []; S.sheet = null; S.pickMode = false; S.shared = { names: {}, recolours: {} }; S.hintHidden = {}; S.divider = 0.5; render(); },
      state: () => { const D = cur(), R = D.result; return { cur: S.cur, sheet: S.sheet, hist: S.hist.length, converted: D.converted, settings: D.settings, pickMode: S.pickMode,
        result: R && { N: R.N, det: R.det, parts: R.ramps.filter((r) => !r.twin).map((r) => ({ name: r.name, sw: r.sw, pixels: r.pixels, base: r.c[1] })), twins: R.ramps.filter((r) => r.twin).length, solid: R.idx.filter((v) => v >= 0).length, clean: { strays: R.clean.strays, specks: R.clean.specks, holes: R.clean.holes, islands: R.clean.islands },
          bakedColours: new Set(bakeResult(R).filter(Boolean)).size, reshadeCap: R.reshadeCap, flagged: R.flagged.length, flagColours: R.flagColours, matched: R.matched, pink: R.pink, place: R.place,
          look: R.look, detail: R.detail, engineColours: R.engineColours, hybrid: R.hybrid, analyse: R.analyse, ms: R.ms,
          exact: (() => { const b = bakeResult(R); let same = 0, n = 0; R.enginePx.forEach((c, i) => { if (c || b[i]) { n++; if (c && b[i] && hex(c) === b[i]) same++; } }); return +(same / Math.max(1, n)).toFixed(3); })() } }; },
      // conversion time: cold = a new picture (engine analysis included), warm = changing a setting on the same picture
      time: (n = 3, cold = true) => { const D = cur(), t = []; for (let k = 0; k < n; k++) { if (cold) D._eng = null; const a = performance.now(); convert(S.cur); t.push(performance.now() - a); } render(); return t.map((v) => Math.round(v)); },
      originalUntouched: () => { const D = cur(); return !!(D.original && D.original.complete && D.original.naturalWidth); },
    },
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
