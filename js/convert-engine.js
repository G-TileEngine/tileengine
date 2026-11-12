/* Convert engine (r67): the converter's pixel pipeline, plain JavaScript, no AI, no network, no DOM.
   Built and tuned in the study harness (ux/converter-quality-study.md, r66b–66e) and now shared by both:
   - the live converter (js/imagine-convert.js) loads this file in the browser as window.ConvertEngine
   - the study harness (study/convert-study.js re-exports it) runs it in Node.
   Default (CEO-approved 2026-11-12): "Combo A" = 2-pass OKLab downscale + k-means OKLab palette + one near-black outline,
   no clean-up, feature protection on, ≤16 colours incl. outline. Detail 20 / 24 = Combo A body + r66 head and weapon regions.
   The background key, subject crop and placement are r66's own functions (passed in with initWith, or lifted from source in Node).
   Images are { w, h, d: Uint8Array RGBA }. Output sprites are { N, px: Array<[r,g,b]|null>, body: Uint8Array } (body = filled cells, px also has the outline). */
(function () {
"use strict";

/* ---------- OKLab (Björn Ottosson, https://bottosson.github.io/posts/oklab/) ---------- */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const LIN = new Float32Array(256).map((_, i) => lin(i));
const gam = (c) => { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(c * 255))); };
function toLab(r, g, b) {
  r = LIN[r | 0]; g = LIN[g | 0]; b = LIN[b | 0];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function toRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbHex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
// Perceptual distance with a "dark boost": in the shadows hue differences matter more than OKLab says (navy vs black, dark brown vs dark green)
function dE2(p, q) { const dl = p[0] - q[0], da = p[1] - q[1], db = p[2] - q[2], L = Math.min(p[0], q[0]), w = 1 + 1.6 * Math.max(0, 0.55 - L); return dl * dl + w * w * (da * da + db * db); }
const lch = ([L, a, b]) => [L, Math.hypot(a, b), Math.atan2(b, a) * 180 / Math.PI];
const fromLch = ([L, C, h]) => [L, C * Math.cos(h * Math.PI / 180), C * Math.sin(h * Math.PI / 180)];
const towardsHue = (h, t, amt) => { const d = ((t - h + 540) % 360) - 180; return h + Math.sign(d) * Math.min(Math.abs(d), amt); };
const HUE_BLUE = 264, HUE_YELLOW = 100; // OKLab hue angles of pure blue / yellow
const shiftTone = (lab, dL, toward, deg, cMul) => { const [L, C, h] = lch(lab); return fromLch([Math.max(0.04, Math.min(0.98, L + dL)), C * cMul, C > 0.02 ? towardsHue(h, toward, deg) : h]); };

/* ---------- published palettes ---------- */
const PALETTES = {
  // PICO-8 16-colour palette, Lexaloffle. Hex list from https://lospec.com/palette-list/pico-8 (also in the PICO-8 manual).
  pico8: ["#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8", "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa"],
  // Game Boy (DMG) 4 shades as used by the BGB emulator, darkest → lightest. https://lospec.com/palette-list/nintendo-gameboy-bgb
  gameboy: ["#081820", "#346856", "#88c070", "#e0f8d0"],
};
// PICO-8 "one step darker" table (the common fade / pal() shading convention): index → darker index
const PICO_DARKER = [0, 0, 1, 1, 2, 1, 5, 6, 2, 4, 9, 3, 13, 5, 8, 4];

/* ---------- small utils ---------- */
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const mean3 = (list) => { const m = [0, 0, 0]; for (const p of list) { m[0] += p[0]; m[1] += p[1]; m[2] += p[2]; } const n = list.length || 1; return [m[0] / n, m[1] / n, m[2] / n]; };
const quantile = (arr, q) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]; };

/* ---------- 1. prepare: key + crop + OKLab + feature map on the source ---------- */
function prepare(src, R66, bgMode = "magenta") {
  const det = R66.detectBackground(src, bgMode, null), mask = R66.keyBackground(src, det, 40), box = R66.subjectBox(mask, src.w, src.h);
  return prepareMasked(src, mask, box, det);
}
// r67: the live converter has already keyed and cropped (with the user's background mode and tolerance), so it starts here
function prepareMasked(src, mask, box, det) {
  const n = src.w * src.h, lab = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) if (mask[i]) { const c = toLab(src.d[i * 4], src.d[i * 4 + 1], src.d[i * 4 + 2]); lab[i * 3] = c[0]; lab[i * 3 + 1] = c[1]; lab[i * 3 + 2] = c[2]; }
  // feature map: pixels that stand out from a 9x9 local mean in lightness (eyes, trim, belts, thin lines)
  const w = src.w, h = src.h, Lc = new Float32Array(n), M = new Float32Array(n);
  for (let i = 0; i < n; i++) { Lc[i] = mask[i] ? lab[i * 3] : 0; M[i] = mask[i] ? 1 : 0; }
  const box2 = (A, r) => { const t = new Float32Array(n), o = new Float32Array(n);
    for (let y = 0; y < h; y++) { let s = 0; for (let x = -r; x < w; x++) { if (x + r < w) s += A[y * w + x + r]; if (x - r - 1 >= 0) s -= A[y * w + x - r - 1]; if (x >= 0) t[y * w + x] = s; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y < h; y++) { if (y + r < h) s += t[(y + r) * w + x]; if (y - r - 1 >= 0) s -= t[(y - r - 1) * w + x]; if (y >= 0) o[y * w + x] = s; } } return o; };
  const r = Math.max(3, Math.round(Math.max(box.bw, box.bh) / 110)), SL = box2(Lc, r), SM = box2(M, r), feat = new Float32Array(n);
  for (let i = 0; i < n; i++) if (mask[i] && SM[i] > 0) feat[i] = Lc[i] - SL[i] / SM[i]; // signed: <0 darker than surroundings, >0 brighter
  // accent map: small, strongly coloured details (gems, glow, buttons) that differ in hue/chroma from their surroundings
  const Ac = new Float32Array(n), Bc = new Float32Array(n); for (let i = 0; i < n; i++) if (mask[i]) { Ac[i] = lab[i * 3 + 1]; Bc[i] = lab[i * 3 + 2]; }
  const ME = box2(M, 2); // pixels within 2 px of the background are fringe, never accents (magenta/mint leftovers)
  const SA = box2(Ac, r * 5), SB = box2(Bc, r * 5), SM2 = box2(M, r * 5), accent = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (mask[i] && SM2[i] > 0 && ME[i] >= 24.5) { const da = Ac[i] - SA[i] / SM2[i], db = Bc[i] - SB[i] / SM2[i]; if (Math.hypot(da, db) > 0.1 && Math.hypot(Ac[i], Bc[i]) > 0.09) accent[i] = 1; }
  return { src, det, mask, box, lab, feat, accent, w, h };
}

/* ---------- 2. palette builders in OKLab ---------- */
function medianCut(cols, k) {
  let boxes = [cols];
  while (boxes.length < k) {
    let bi = -1, br = 0, bc = 0;
    boxes.forEach((b, i) => { if (b.length < 2) return; for (let c = 0; c < 3; c++) { let lo = 1e9, hi = -1e9; for (const p of b) { if (p[c] < lo) lo = p[c]; if (p[c] > hi) hi = p[c]; } const rr = (hi - lo) * (c ? 1.4 : 1) * Math.sqrt(b.length); if (rr > br) { br = rr; bi = i; bc = c; } } });
    if (bi < 0) break;
    const b = boxes[bi].slice().sort((p, q) => p[bc] - q[bc]), m = b.length >> 1; boxes.splice(bi, 1, b.slice(0, m), b.slice(m));
  }
  return boxes.map(mean3);
}
function kmeans(cols, centres, iters = 10, dist = dE2) {
  let C = centres.map((c) => c.slice()); const asg = new Int32Array(cols.length);
  for (let it = 0; it < iters; it++) {
    const acc = C.map(() => [0, 0, 0, 0]);
    cols.forEach((p, i) => { let bj = 0, bd = Infinity; C.forEach((c, j) => { const d = dist(p, c); if (d < bd) { bd = d; bj = j; } }); asg[i] = bj; const a = acc[bj]; a[0] += p[0]; a[1] += p[1]; a[2] += p[2]; a[3]++; });
    C = C.map((c, j) => (acc[j][3] ? [acc[j][0] / acc[j][3], acc[j][1] / acc[j][3], acc[j][2] / acc[j][3]] : c));
  }
  const used = [...new Set(asg)].sort((a, b) => a - b), remap = new Map(used.map((j, i) => [j, i]));
  return { centres: used.map((j) => C[j]), asg: asg.map((j) => remap.get(j)) };
}
// Xiaolin Wu's greedy orthogonal bipartition quantiser (Graphics Gems II, 1991), here on a 32³ OKLab histogram.
function wu(cols, k) {
  const S = 33, idx = (r, g, b) => (r * S + g) * S + b, n = S * S * S;
  const wt = new Float64Array(n), m0 = new Float64Array(n), m1 = new Float64Array(n), m2 = new Float64Array(n), m3 = new Float64Array(n);
  const q = (v, lo, hi) => 1 + Math.max(0, Math.min(31, Math.floor((v - lo) / (hi - lo) * 32)));
  for (const p of cols) { const i = idx(q(p[0], 0, 1), q(p[1], -0.32, 0.32), q(p[2], -0.32, 0.32)); wt[i]++; m0[i] += p[0]; m1[i] += p[1]; m2[i] += p[2]; m3[i] += p[0] * p[0] + p[1] * p[1] + p[2] * p[2]; }
  for (const A of [wt, m0, m1, m2, m3]) { // 3-D prefix sums
    for (let r = 1; r < S; r++) for (let g = 1; g < S; g++) for (let b = 1; b < S; b++)
      A[idx(r, g, b)] += A[idx(r - 1, g, b)] + A[idx(r, g - 1, b)] + A[idx(r, g, b - 1)] - A[idx(r - 1, g - 1, b)] - A[idx(r - 1, g, b - 1)] - A[idx(r, g - 1, b - 1)] + A[idx(r - 1, g - 1, b - 1)];
  }
  const vol = (c, A) => A[idx(c.r1, c.g1, c.b1)] - A[idx(c.r1, c.g1, c.b0)] - A[idx(c.r1, c.g0, c.b1)] + A[idx(c.r1, c.g0, c.b0)] - A[idx(c.r0, c.g1, c.b1)] + A[idx(c.r0, c.g1, c.b0)] + A[idx(c.r0, c.g0, c.b1)] - A[idx(c.r0, c.g0, c.b0)];
  const varOf = (c) => { const w = vol(c, wt); if (!w) return 0; const a = vol(c, m0), b = vol(c, m1), d = vol(c, m2); return vol(c, m3) - (a * a + b * b + d * d) / w; };
  const boxes = [{ r0: 0, r1: 32, g0: 0, g1: 32, b0: 0, b1: 32 }], vv = [varOf(boxes[0])];
  while (boxes.length < k) {
    let bi = -1, bv = 1e-12; vv.forEach((v, i) => { if (v > bv) { bv = v; bi = i; } }); if (bi < 0) break;
    const c = boxes[bi], W = vol(c, wt), T = [vol(c, m0), vol(c, m1), vol(c, m2)];
    let best = null, bestScore = -1;
    for (const ax of ["r", "g", "b"]) for (let cut = c[ax + "0"] + 1; cut < c[ax + "1"]; cut++) {
      const lo = { ...c, [ax + "1"]: cut }, w1 = vol(lo, wt), w2 = W - w1; if (!w1 || !w2) continue;
      const a = [vol(lo, m0), vol(lo, m1), vol(lo, m2)], b2 = [T[0] - a[0], T[1] - a[1], T[2] - a[2]];
      const s = (a[0] ** 2 + a[1] ** 2 + a[2] ** 2) / w1 + (b2[0] ** 2 + b2[1] ** 2 + b2[2] ** 2) / w2;
      if (s > bestScore) { bestScore = s; best = [ax, cut]; }
    }
    if (!best) { vv[bi] = 0; continue; }
    const [ax, cut] = best, lo = { ...c, [ax + "1"]: cut }, hi = { ...c, [ax + "0"]: cut };
    boxes.splice(bi, 1, lo, hi); vv.splice(bi, 1, varOf(lo), varOf(hi));
  }
  return boxes.filter((c) => vol(c, wt) > 0).map((c) => { const w = vol(c, wt); return [vol(c, m0) / w, vol(c, m1) / w, vol(c, m2) / w]; });
}
function buildPalette(cols, k, method) {
  if (!cols.length) return [];
  k = Math.min(k, cols.length);
  if (method === "median") return medianCut(cols, k);
  if (method === "wu") return kmeans(cols, wu(cols, k), 2).centres; // Wu + 2 refinement passes (what Retro Diffusion-style reducers do)
  return kmeans(cols, medianCut(cols, k), 10).centres; // k-means seeded by median cut
}
const nearest = (p, pal) => { let bj = 0, bd = Infinity; for (let j = 0; j < pal.length; j++) { const d = dE2(p, pal[j]); if (d < bd) { bd = d; bj = j; } } return bj; };

/* ---------- 3. downscale candidates → cells { N, solid, lab, feat } ---------- */
function cellPixels(P, pl, cx, cy, step) {
  const { box } = P, s = pl.s, sx0 = box.bx + cx * s, sy0 = box.by + cy * s, sx1 = Math.min(box.bx + box.bw, sx0 + s), sy1 = Math.min(box.by + box.bh, sy0 + s);
  const out = []; let tot = 0;
  for (let y = Math.floor(sy0); y < Math.ceil(sy1); y += step) for (let x = Math.floor(sx0); x < Math.ceil(sx1); x += step) {
    if (x < 0 || y < 0 || x >= P.w || y >= P.h) continue; tot++; const i = y * P.w + x; if (P.mask[i]) out.push(i);
  }
  return { ids: out, tot };
}
function downscale(P, N, method, opts = {}) {
  const pl = opts.place || (P.place && P.place[N]) || require_placement(P, N), solid = new Uint8Array(N * N), lab = new Float32Array(N * N * 3), feat = new Int8Array(N * N), cov = new Float32Array(N * N);
  const L3 = (i) => [P.lab[i * 3], P.lab[i * 3 + 1], P.lab[i * 3 + 2]];
  const step = Math.max(1, Math.floor(pl.s / 10));
  let gpal = null, gidx = null;
  if (method === "twopass") { // pass 1: a rich global palette (24) from the whole subject; pass 2: each cell takes its most common palette colour
    const sample = []; for (let y = P.box.by; y < P.box.by + P.box.bh; y += 3) for (let x = P.box.bx; x < P.box.bx + P.box.bw; x += 3) { const i = y * P.w + x; if (P.mask[i]) sample.push(L3(i)); }
    gpal = buildPalette(sample, opts.pass1 || 24, "kmeans"); gidx = new Map();
  }
  for (let cy = 0; cy < pl.ch; cy++) for (let cx = 0; cx < pl.cw; cx++) {
    const { ids, tot } = cellPixels(P, pl, cx, cy, step); const X = pl.ox + cx, Y = pl.oy + cy;
    if (!tot || X < 0 || Y < 0 || X >= N || Y >= N) continue; const c = Y * N + X; cov[c] = ids.length / tot;
    if (cov[c] < 0.4) continue; solid[c] = 1;
    const px = ids.map(L3); let col;
    if (method === "majority") { // r66 rule, in OKLab bins: most common colour family, averaged within it
      const bins = new Map(); px.forEach((p) => { const k = `${Math.round(p[0] * 16)},${Math.round(p[1] * 24)},${Math.round(p[2] * 24)}`; let b = bins.get(k); if (!b) bins.set(k, (b = [])); b.push(p); });
      let best = null; bins.forEach((b) => { if (!best || b.length > best.length) best = b; }); col = mean3(best);
    } else if (method === "average") col = mean3(px);
    else if (method === "twopass") { const cnt = new Map(); px.forEach((p) => { const j = nearest(p, gpal); cnt.set(j, (cnt.get(j) || 0) + 1); }); let bj = 0, bn = -1; cnt.forEach((v, j) => { if (v > bn) { bn = v; bj = j; } }); col = gpal[bj].slice(); gidx.set(c, cnt); }
    else { // k-centroid (Astropulse): k-means inside the cell, keep the dominant cluster's centre
      const k = method === "kc3" ? 3 : 2; const sub = px.length > 120 ? px.filter((_, i) => i % Math.ceil(px.length / 120) === 0) : px;
      const init = medianCut(sub, Math.min(k, sub.length)); const km = kmeans(sub, init, 6);
      const cnt = new Array(km.centres.length).fill(0); km.asg.forEach((j) => cnt[j]++); let bj = 0; cnt.forEach((v, j) => { if (v > cnt[bj]) bj = j; }); col = km.centres[bj];
    }
    // feature protection: a small dark/bright detail that covers enough of the cell wins over the dominant colour
    if (opts.protect) {
      let dark = [], bright = [], acc = [];
      ids.forEach((i) => { const f = P.feat[i]; if (P.accent[i]) acc.push(L3(i)); if (f < -0.1) dark.push(L3(i)); else if (f > 0.1) bright.push(L3(i)); });
      const need = opts.protectMin || (N <= 32 ? 0.3 : 0.22); // at 32 px a cell is ~15 source px: only big details may win
      if (dark.length / ids.length >= need && dark.length >= bright.length) { col = mean3(dark); feat[c] = -1; }
      else if (bright.length / ids.length >= need + 0.04) { col = mean3(bright); feat[c] = 1; }
      if (acc.length / ids.length >= Math.max(0.1, need * 0.5)) { col = mean3(acc); feat[c] = 3; } // accents (gems, glow) beat everything
    }
    lab[c * 3] = col[0]; lab[c * 3 + 1] = col[1]; lab[c * 3 + 2] = col[2];
  }
  // features on the silhouette edge are just the art's own outline → let the outline pass handle those (avoids double outlines)
  if (opts.protect) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = y * N + x; if (!feat[c]) continue;
    const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= N || Y >= N || !solid[Y * N + X]; });
    if (edge && feat[c] < 0) feat[c] = 0; }
  return { N, solid, lab, feat, cov, pl };
}
let require_placement = null; // set by initWith(): the live r66 placement()

const skinLabV1 = (p) => p[0] > 0.6 && p[0] < 0.93 && p[1] > 0.012 && p[1] < 0.1 && p[2] > 0.02 && p[2] < 0.13 && p[2] > p[1] * 0.6; // 66b rule (cel/hd2d/vector/PICO-8/snes baseline)
// skin: light, warm, moderate chroma, hue 30–72° in OKLab (gold trim sits at ~85° and must not count as skin)
const skinLab = (p) => { if (p[0] < 0.6 || p[0] > 0.93) return false; const C = Math.hypot(p[1], p[2]), h = Math.atan2(p[2], p[1]) * 180 / Math.PI; return C > 0.025 && C < 0.13 && h > 30 && h < 72; };
/* ---------- 4. eyes: keep at least one dark pixel per eye on the face ---------- */
function protectEyes(P, cells) {
  const { box, w } = P, N = cells.N, pl = cells.pl; const skin = (p) => p[0] > 0.62 && p[0] < 0.93 && p[1] > 0.015 && p[1] < 0.1 && p[2] > 0.02 && p[2] < 0.12;
  // face = biggest skin blob in the top 35% of the subject
  const y1 = box.by + Math.round(box.bh * 0.35), seen = new Uint8Array(P.w * P.h); let face = null;
  for (let y = box.by; y < y1; y += 1) for (let x = box.bx; x < box.bx + box.bw; x++) { const i = y * w + x; if (!P.mask[i] || seen[i] || !skin([P.lab[i * 3], P.lab[i * 3 + 1], P.lab[i * 3 + 2]])) continue;
    const q = [i]; seen[i] = 1; let n = 0, X0 = x, X1 = x, Y0 = y, Y1 = y;
    while (q.length) { const j = q.pop(), jx = j % w, jy = (j / w) | 0; n++; X0 = Math.min(X0, jx); X1 = Math.max(X1, jx); Y0 = Math.min(Y0, jy); Y1 = Math.max(Y1, jy);
      for (const k of [j - 1, j + 1, j - w, j + w]) { const ky = (k / w) | 0; if (k < 0 || ky >= y1 || seen[k] || !P.mask[k]) continue; if (skin([P.lab[k * 3], P.lab[k * 3 + 1], P.lab[k * 3 + 2]])) { seen[k] = 1; q.push(k); } } }
    if (!face || n > face.n) face = { n, X0, X1, Y0, Y1 }; }
  if (!face || face.n < 150) return { eyes: 0 };
  const toCell = (x, y) => [pl.ox + Math.floor((x - box.bx) / pl.s), pl.oy + Math.floor((y - box.by) / pl.s)];
  const [cx0, cy0] = toCell(face.X0, face.Y0), [cx1, cy1] = toCell(face.X1, face.Y1), faceBox = { x0: cx0, y0: cy0, x1: cx1, y1: cy1 };
  if ((face.X1 - face.X0 + 1) / cells.pl.s < 4) return { eyes: 0, face: true, faceBox, tooSmall: true }; // face under 4 px wide: eyes would swallow it, keep skin
  // eyes = dark feature blobs inside the face box, upper 75% of it
  const fy1 = face.Y0 + Math.round((face.Y1 - face.Y0) * 0.75), blobs = [], seen2 = new Uint8Array(P.w * P.h);
  for (let y = face.Y0; y <= fy1; y++) for (let x = face.X0; x <= face.X1; x++) { const i = y * w + x; if (seen2[i] || !P.mask[i] || P.feat[i] > -0.12 || P.lab[i * 3] > 0.55) continue;
    const q = [i]; seen2[i] = 1; let n = 0, sx = 0, sy = 0, ac = [0, 0, 0];
    while (q.length) { const j = q.pop(), jx = j % w, jy = (j / w) | 0; n++; sx += jx; sy += jy; ac[0] += P.lab[j * 3]; ac[1] += P.lab[j * 3 + 1]; ac[2] += P.lab[j * 3 + 2];
      for (const k of [j - 1, j + 1, j - w, j + w]) { const kx = k % w, ky = (k / w) | 0; if (kx < face.X0 || kx > face.X1 || ky < face.Y0 || ky > fy1 || seen2[k] || !P.mask[k]) continue; if (P.feat[k] < -0.12 && P.lab[k * 3] < 0.55) { seen2[k] = 1; q.push(k); } } }
    if (n >= 6 && n < face.n * 0.08) blobs.push({ n, x: sx / n, y: sy / n, c: ac.map((v) => v / n) }); }
  blobs.sort((a, b) => b.n - a.n); const eyes = blobs.slice(0, 2).filter((b, _, arr) => arr.length < 2 || Math.abs(arr[0].y - arr[1].y) < (face.Y1 - face.Y0) * 0.25 ? true : b === arr[0]);
  let set = 0;
  eyes.forEach((e) => { const X = pl.ox + Math.floor((e.x - box.bx) / pl.s), Y = pl.oy + Math.floor((e.y - box.by) / pl.s), c = Y * N + X;
    if (X >= 0 && Y >= 0 && X < N && Y < N && cells.solid[c]) { cells.lab[c * 3] = Math.min(e.c[0], 0.3); cells.lab[c * 3 + 1] = e.c[1]; cells.lab[c * 3 + 2] = e.c[2]; cells.feat[c] = -2; set++; } });
  return { eyes: set, face: true, faceBox };
}

/* ---------- 5. clean-up on an index grid ---------- */
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function cleanIdx(idx, N, feat, opts = {}) {
  const at = (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : idx[y * N + x]); let fixes = 0;
  // silhouette: spurs (≤1 solid 4-neighbour) out, notches (≥3 solid 4-neighbours) in
  for (let pass = 0; pass < 2; pass++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = y * N + x;
    const nb = N4.map(([dx, dy]) => at(x + dx, y + dy)), solidN = nb.filter((v) => v >= 0);
    const solid8 = N8.filter(([dx, dy]) => at(x + dx, y + dy) >= 0).length; // diagonal thin lines (swords, staffs) are kept
    if (idx[c] >= 0 && solid8 <= 1 && !(feat && feat[c])) { idx[c] = -1; fixes++; }
    else if (idx[c] < 0 && solidN.length >= 3 && !(opts.cov && opts.cov[c] < 0.2)) { const cnt = {}; solidN.forEach((v) => (cnt[v] = (cnt[v] || 0) + 1)); idx[c] = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; fixes++; } }
  // orphans: a pixel matching none of its 8 neighbours (and not a protected feature) takes the most common neighbour
  const out = idx.slice();
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = y * N + x; if (idx[c] < 0 || (feat && feat[c])) continue;
    const nb = N8.map(([dx, dy]) => at(x + dx, y + dy)).filter((v) => v >= 0); if (nb.length < 5 || nb.includes(idx[c])) continue;
    const cnt = {}; nb.forEach((v) => (cnt[v] = (cnt[v] || 0) + 1)); out[c] = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; fixes++; }
  // optional mode filter (flat looks): 3x3 majority keeps shapes clean
  if (opts.smooth) for (let p = 0; p < opts.smooth; p++) { const src = out.slice();
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = y * N + x; if (src[c] < 0 || (feat && feat[c])) continue;
      const cnt = {}; N8.forEach(([dx, dy]) => { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= N || Y >= N) return; const v = src[Y * N + X]; if (v >= 0) cnt[v] = (cnt[v] || 0) + 1; });
      const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; if (top !== undefined && cnt[top] >= 5 && +top !== src[c]) { out[c] = +top; fixes++; } } }
  return { idx: out, fixes };
}

/* ---------- 6. outline: selective (darker hue of the neighbour) or one colour, with pixel-perfect corners ---------- */
function outlineRing(isSolid, N, pixelPerfect) {
  const ring = new Uint8Array(N * N), at = (x, y) => x >= 0 && y >= 0 && x < N && y < N && isSolid(y * N + x);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!at(x, y) && N4.some(([dx, dy]) => at(x + dx, y + dy))) ring[y * N + x] = 1;
  let removed = 0;
  if (pixelPerfect) { // Aseprite-style: drop the inner corner of every L-shaped step so the ring reads as clean 1px diagonals
    const R = (x, y) => x >= 0 && y >= 0 && x < N && y < N && ring[y * N + x];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!R(x, y)) continue;
      for (const [hx, vy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        if (R(x + hx, y) && R(x, y + vy) && !R(x + hx, y + vy) && !R(x - hx, y) && !R(x, y - vy)) {
          // only if the corner pixel touches the sprite diagonally only (removing it can't open a gap next to a flat side)
          if (N4.filter(([dx, dy]) => at(x + dx, y + dy)).length <= 1 && at(x + hx, y + vy)) { ring[y * N + x] = 0; removed++; break; }
        } } }
  }
  return { ring, removed };
}

// CEO-approved default (66d/66e, 2026-11-12): "Combo A"
const COMBO_A_OPTS = { downscale: "twopass", palette: "kmeans", protect: true, outline: "black", pixelPerfect: false, clean: false };

/* ---------- 7. generic pipeline (rendering study): downscale → palette → clean → outline ---------- */
function renderPipeline(P, N, o) {
  const CAP = o.cap || 16, cells = downscale(P, N, o.downscale, { protect: o.protect, pass1: Math.max(24, CAP + 8) });
  const eyes = o.protect ? protectEyes(P, cells) : { eyes: 0 };
  const outlineSlots = o.outline === "black" ? 1 : 0, K = Math.min(o.colours || CAP - 1, CAP - outlineSlots);
  const list = []; for (let c = 0; c < N * N; c++) if (cells.solid[c]) list.push([cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]]);
  let pal = buildPalette(list, K, o.palette);
  if (o.protect) { // features must survive quantising: make sure the darkest feature colour has its own entry
    const fl = []; for (let c = 0; c < N * N; c++) if (cells.feat[c] < 0) fl.push([cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]]);
    if (fl.length) { const dk = fl.reduce((a, b) => (b[0] < a[0] ? b : a)); if (Math.min(...pal.map((p) => dE2(p, dk))) > 0.006) { if (pal.length >= K) pal.splice(pal.reduce((bi, p, i, arr) => { const d = Math.min(...arr.map((q, j) => (j === i ? 9 : dE2(p, q)))); return d < bi[1] ? [i, d] : bi; }, [0, 9])[0], 1); pal.push(dk); } }
  }
  let idx = new Int16Array(N * N).fill(-1); for (let c = 0; c < N * N; c++) if (cells.solid[c]) idx[c] = nearest([cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]], pal);
  let fixes = 0; if (o.clean !== false) { const cl = cleanIdx(idx, N, o.protect ? cells.feat : null); idx = cl.idx; fixes = cl.fixes; }
  const px = new Array(N * N).fill(null); for (let c = 0; c < N * N; c++) if (idx[c] >= 0) px[c] = toRgb(pal[idx[c]]);
  let ppRemoved = 0;
  if (o.outline !== "none") {
    const { ring, removed } = outlineRing((c) => idx[c] >= 0, N, o.pixelPerfect !== false); ppRemoved = removed;
    const black = o.outline === "black" ? [0.16, 0.01, -0.03] : null;
    for (let c = 0; c < N * N; c++) if (ring[c]) {
      const x = c % N, y = (c / N) | 0, nb = N8.map(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= N || Y >= N ? -1 : idx[Y * N + X]; }).filter((v) => v >= 0);
      let col;
      if (black) col = black;
      else { // selective: darkest palette entry close in hue to the touching colour, else the palette's darkest
        const n0 = pal[nb[0]], want = shiftTone(n0, -0.3, HUE_BLUE, 18, 0.9);
        const cands = pal.filter((p) => p[0] < n0[0] - 0.12); col = cands.length ? cands[nearest(want, cands)] : pal.reduce((a, b) => (b[0] < a[0] ? b : a));
      }
      px[c] = toRgb(col);
    }
  }
  return capColours({ N, px, body: Uint8Array.from(idx, (v) => (v >= 0 ? 1 : 0)), palette: pal.length + outlineSlots, eyes: eyes.eyes, fixes, ppRemoved }, CAP);
}

/* ---------- 8. target looks (input presets) ---------- */
const LOOKS = {
  cel:    { name: "Cel / anime flat", B: 6, S: 2, lines: 4, smooth: 1, toplight: false, downscale: "twopass", chunky: false },
  snes:   { name: "16-bit SNES/GBA", B: 4, S: 3, lines: 4, smooth: 0, toplight: true, downscale: "twopass", chunky: false, borrow: true }, // r66c = 66b + head/weapon borrow
  snesOld:{ name: "16-bit (66b)", B: 4, S: 3, lines: 4, smooth: 0, toplight: true, downscale: "twopass", chunky: false },
  snesV2: { name: "16-bit v2 (material budget, rejected)", v2: true, B: 8, toplight: true, downscale: "twopass" },
  hd2d:   { name: "HD-2D lite (chunky)", B: 5, S: 3, lines: 1, smooth: 0, toplight: true, downscale: "twopass", chunky: true },
  gameboy:{ name: "Game Boy 4-shade", fixed: "gameboy", downscale: "twopass" },
  pico8:  { name: "PICO-8 16", fixed: "pico8", K: 11, downscale: "twopass" },
  vector: { name: "Vector / flat", B: 8, S: 1, lines: 8, smooth: 2, toplight: false, downscale: "twopass", chunky: false },
};
// farthest-point seeds: a rare but very different colour (a blue gem among gold trim) still gets its own centre
function farthest(cols, k) { const seeds = [cols.reduce((a, b) => (Math.hypot(b[1], b[2]) > Math.hypot(a[1], a[2]) ? b : a))];
  while (seeds.length < k) { let best = null, bd = -1; for (const p of cols) { const d = Math.min(...seeds.map((q) => dE2(p, q))); if (d > bd) { bd = d; best = p; } } if (bd < 0.004) break; seeds.push(best); } return seeds; }
// thin structures (staff and bow shafts, bowstrings): a 1–2 px run across, in a sparse 5×5 neighbourhood
function thinMask(solid, N) {
  const t = new Uint8Array(N * N), S = (x, y) => x >= 0 && y >= 0 && x < N && y < N && solid[y * N + x];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!S(x, y)) continue;
    let h = 1, v = 1; for (let k = 1; S(x - k, y); k++) h++; for (let k = 1; S(x + k, y); k++) h++; for (let k = 1; S(x, y - k); k++) v++; for (let k = 1; S(x, y + k); k++) v++;
    let dn = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (S(x + dx, y + dy)) dn++;
    if ((h <= 2 || v <= 2) && dn / 25 < 0.44) t[y * N + x] = 1; }
  return t;
}
const accentOrTone = (p, acc, tones) => { const a = acc[nearest(p, acc)], t = tones[nearest(p, tones)]; return dE2(p, a) < dE2(p, t) ? a : t; };
function solidList(cells) { const ids = [], cols = []; for (let c = 0; c < cells.N * cells.N; c++) if (cells.solid[c]) { ids.push(c); cols.push([cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]]); } return { ids, cols }; }
function edgeSides(cells, groupOf, c) { const N = cells.N, x = c % N, y = (c / N) | 0, g = groupOf(c), other = (X, Y) => X < 0 || Y < 0 || X >= N || Y >= N || !cells.solid[Y * N + X] || groupOf(Y * N + X) !== g;
  return { top: other(x, y - 1), left: other(x - 1, y), bottom: other(x, y + 1), right: other(x + 1, y) }; }
function lineOfLab(base) { const [L, C, h] = lch(base); return fromLch([Math.max(0.13, Math.min(0.27, L * 0.42)), Math.min(0.12, C * 0.85 + 0.01), C > 0.02 ? towardsHue(h, HUE_BLUE, 20) : 270]); }

function rampLook(P, N, look) {
  const work = look.chunky ? Math.round(N / 2) : N, CAP = look.cap || 16; // 66e: colour budget (16 = style default; 20 / 24 = raised-cap test)
  const cells = downscale(P, work, look.downscale, { protect: true, pass1: Math.max(24, CAP + 8) }), eyeInfoR = protectEyes(P, cells);
  const { ids, cols } = solidList(cells);
  // hue groups: cluster mostly on hue/chroma (lightness weighted down) so a group's lights and shadows stay together
  const key = (p) => { const w = 1 + 1.6 * Math.max(0, 0.55 - p[0]); return [p[0] * 0.45, p[1] * w, p[2] * w]; };
  // skin always gets its own group (faces and hands must not merge into armour or cloth)
  const isSkin = cols.map(skinLabV1), nSkin = isSkin.filter(Boolean).length, skinOwn = nSkin >= 2;
  const rest = cols.map((p, i) => i).filter((i) => !(skinOwn && isSkin[i])), keyed = rest.map((i) => key(cols[i]));
  const km = kmeans(keyed, medianCut(keyed, Math.min(look.B - (skinOwn ? 1 : 0), keyed.length)), 12);
  const B = km.centres.length + (skinOwn ? 1 : 0), gOf = new Int16Array(N * N).fill(-1);
  rest.forEach((i, r) => (gOf[ids[i]] = km.asg[r])); if (skinOwn) ids.forEach((c, i) => { if (isSkin[i]) gOf[c] = B - 1; });
  if (look.smooth) { const r = cleanIdx(Int16Array.from(gOf.slice(0, work * work)), work, cells.feat, { smooth: look.smooth }); r.idx.forEach((v, c) => { if (cells.solid[c] && v >= 0) gOf[c] = v; }); }
  // per group: tones from the art's own lightness (quantiles), nudged by a top-left light for 16-bit / HD-2D
  const groups = []; for (let g = 0; g < B; g++) groups.push({ cells: [], L: [] });
  ids.forEach((c, i) => { const g = gOf[c]; if (g < 0) return; groups[g].cells.push(c); groups[g].L.push(cells.lab[c * 3]); });
  const tone = new Int8Array(N * N).fill(-1), ramps = [];
  groups.forEach((G, g) => {
    if (!G.cells.length) { ramps.push(null); return; }
    const labs = G.cells.map((c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]]), base = mean3(labs), Lm = base[0];
    const spread = quantile(G.L, 0.85) - quantile(G.L, 0.15);
    const qs = look.S === 3 ? [quantile(G.L, 0.3), quantile(G.L, 0.78)] : look.S === 2 ? [quantile(G.L, 0.4)] : [];
    G.cells.forEach((c) => { let t = 0; const L = cells.lab[c * 3]; qs.forEach((q) => { if (L > q) t++; }); if (spread < 0.05 && look.S > 1) t = look.S === 3 ? 1 : 1;
      if (look.toplight && !cells.feat[c]) { const e = edgeSides(cells, (k) => gOf[k], c); if ((e.top || e.left) && !(e.bottom || e.right)) t++; else if ((e.bottom || e.right) && !(e.top || e.left)) t--; }
      tone[c] = Math.max(0, Math.min(look.S - 1, t)); });
    // the ramp itself: hue-shifted steps around the group's mean (shadows cool, lights warm)
    const dl = Math.max(0.08, Math.min(0.16, spread * 0.6));
    const r = look.S === 3 ? [shiftTone(base, -dl, HUE_BLUE, 10, 1.04), base, shiftTone(base, dl * 0.75, HUE_YELLOW, 8, 0.92)]
      : look.S === 2 ? [shiftTone(base, -dl * 0.9, HUE_BLUE, 10, 1.05), shiftTone(base, 0.02, HUE_YELLOW, 3, 1)] : [base];
    ramps.push({ tones: r, line: lineOfLab(base), base });
  });
  // features (eyes, dark trim) → the line colour of their group; bright features → top tone; accents keep their own colour
  // a cell far from its group's colour and strongly coloured is an accent too (a blue gem inside a purple robe group)
  const gMean = groups.map((G) => (G.cells.length ? mean3(G.cells.map((c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]])) : null));
  for (let c = 0; c < work * work; c++) if (cells.solid[c] && gOf[c] >= 0 && !cells.feat[c]) { const p = [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]], m = gMean[gOf[c]];
    if (m && Math.hypot(p[1] - m[1], p[2] - m[2]) > 0.16 && Math.hypot(p[1], p[2]) > 0.1) cells.feat[c] = 3; }
  const accIds = []; for (let c = 0; c < work * work; c++) if (cells.solid[c] && cells.feat[c] && gOf[c] >= 0) { if (cells.feat[c] === 3) { tone[c] = -3; accIds.push(c); } else tone[c] = cells.feat[c] < 0 ? -2 : look.S - 1; }
  const accCols = accIds.map((c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]]); const accPal = accCols.length ? farthest(accCols, Math.min(3, accCols.length)) : [];
  // line colours: one per group, merged down to the look's budget
  const used = ramps.filter(Boolean); let lines = used.map((r) => r.line);
  // (66c tried 2 outline colours to free slots; rejected: it recolours outlines everywhere)
  const lineBudget = Math.max(1, Math.min(look.lines, CAP - used.length * look.S - accPal.length));
  if (lines.length > lineBudget) lines = kmeans(lines, medianCut(lines, lineBudget), 8).centres;
  used.forEach((r) => (r.lineIdx = nearest(r.line, lines)));
  // compose at work size
  let img = new Array(work * work).fill(null), gridG = new Int16Array(work * work).fill(-1);
  for (let c = 0; c < work * work; c++) if (cells.solid[c] && gOf[c] >= 0) { const r = ramps[gOf[c]]; img[c] = tone[c] === -3 ? accentOrTone([cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]], accPal, r.tones) : tone[c] === -2 ? lines[r.lineIdx] : r.tones[tone[c]]; gridG[c] = gOf[c]; }
  // r66c borrow: in head and weapon zones only, a cell whose banded colour is clearly wrong takes the nearest palette colour
  // (or a spare-slot detail colour). Everything outside the zones stays exactly as 66b.
  let zone = null, thinW = null, borrowInfo = null;
  if (look.borrow && !look.chunky) {
    const eyeInfo = eyeInfoR || {}; thinW = thinMask(cells.solid, work); zone = new Uint8Array(work * work);
    for (let c = 0; c < work * work; c++) if (thinW[c]) { const x = c % work, y = (c / work) | 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < work && Y < work && cells.solid[Y * work + X]) zone[Y * work + X] = 2; } }
    const fb = look.headZone ? eyeInfo.faceBox : null; if (fb) { const w = fb.x1 - fb.x0 + 1, h = fb.y1 - fb.y0 + 1;
      for (let y = Math.max(0, fb.y0 - Math.ceil(h * 1.1)); y <= Math.min(work - 1, fb.y1 + Math.ceil(h * 0.25)); y++) for (let x = Math.max(0, fb.x0 - Math.ceil(w * 0.9)); x <= Math.min(work - 1, fb.x1 + Math.ceil(w * 0.9)); x++) if (cells.solid[y * work + x] && !zone[y * work + x]) zone[y * work + x] = 1; }
    const L3c = (c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]], keyOf = (l) => l.map((v) => v.toFixed(4)).join();
    const palMap = new Map(); used.forEach((r) => r.tones.forEach((t) => palMap.set(keyOf(t), t))); accPal.forEach((t) => palMap.set(keyOf(t), t)); lines.forEach((t) => palMap.set(keyOf(t), t));
    let pal = [...palMap.values()]; const err = look.zoneErr || 0.006;
    // head error under the plain 66b colours: if the 66b head is already close to the art (mean ΔE² under headOk), the head is left alone
    let he = 0, hn = 0; for (let c = 0; c < work * work; c++) if (zone[c] === 1 && img[c]) { he += dE2(L3c(c), img[c]); hn++; }
    const headErr = hn ? he / hn : 0, headOn = headErr > (look.headOk || 0.004);
    if (!headOn) for (let c = 0; c < work * work; c++) if (zone[c] === 1) zone[c] = 0;
    const zc = []; for (let c = 0; c < work * work; c++) if (zone[c] && img[c] && cells.feat[c] !== -2 && dE2(L3c(c), img[c]) > err) zc.push(c);
    // free up to 2 slots by merging near-twins (ΔE < 0.04 in OKLab, barely visible side by side); the smaller one takes the bigger one's colour
    let merges = 0, mergedPx = 0;
    const imgBefore = img.slice(), palBefore = pal.slice();
    const freeNow = () => { const u = new Set(img.filter(Boolean).map(keyOf)); lines.forEach((t) => u.add(keyOf(t))); return CAP - u.size; };
    for (let m = 0; m < (look.maxMerge ?? 2) && freeNow() < 2 && zc.length; m++) { const cnt = new Map(); img.forEach((l) => { if (l) { const k = keyOf(l); cnt.set(k, (cnt.get(k) || [l, 0])); cnt.get(k)[1]++; } });
      lines.forEach((l) => { const k = keyOf(l); if (!cnt.has(k)) cnt.set(k, [l, 0]); cnt.get(k)[1] += 1000; }); // outline colours always stay
      const fb = eyeInfo.faceBox, faceKeys = new Set(); // colours on the face are never merged (the 66b heads stay exactly as they were)
      if (fb) for (let y = Math.max(0, fb.y0 - 2); y <= Math.min(work - 1, fb.y1 + 1); y++) for (let x = Math.max(0, fb.x0 - 2); x <= Math.min(work - 1, fb.x1 + 2); x++) if (img[y * work + x]) faceKeys.add(keyOf(img[y * work + x]));
      faceKeys.forEach((k) => cnt.delete(k));
      const E = [...cnt.values()]; let bi = -1, bj = -1, bd = 0.04 * 0.04;
      for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) { const a = E[i][0], b = E[j][0], d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2; if (d < bd) { bd = d; bi = i; bj = j; } }
      if (bi < 0) break; const [keep, drop] = E[bi][1] >= E[bj][1] ? [E[bi], E[bj]] : [E[bj], E[bi]], dk = keyOf(drop[0]);
      for (let c = 0; c < img.length; c++) if (img[c] && keyOf(img[c]) === dk) { img[c] = keep[0]; mergedPx++; }
      pal = pal.filter((t) => keyOf(t) !== dk); merges++; }
    // spare slots (16 minus what is used now) become detail colours: farthest-first, each must serve ≥2 zone cells
    const usedNow = new Set(img.filter(Boolean).map(keyOf)); lines.forEach((t) => usedNow.add(keyOf(t)));
    const free = Math.max(0, Math.min(4 + Math.max(0, CAP - 16), CAP - usedNow.size)), detail = [];
    for (let k = 0; k < free; k++) { const P2 = pal.concat(detail); let best = null, bs = 0;
      for (const c of zc) { const p = L3c(c), e = dE2(p, P2[nearest(p, P2)]); if (e <= err) continue; let sup = 0; for (const o of zc) if (dE2(L3c(o), p) < 0.004) sup++;
        const x = c % work, y = (c / work) | 0, fb = eyeInfo.faceBox, onFace = fb && x >= fb.x0 && x <= fb.x1 && y >= fb.y0 && y <= fb.y1 ? 2.5 : 1; // faces first
        if (sup >= 2 && e * Math.sqrt(sup) * onFace > bs) { bs = e * Math.sqrt(sup) * onFace; best = p; } }
      if (!best) break; const near = zc.map(L3c).filter((p) => dE2(p, best) < 0.004); detail.push(mean3(near)); }
    if (merges && detail.length < Math.max(0, 2 - (CAP - usedNow.size - merges)) + 0 && detail.length === 0) { for (let c = 0; c < img.length; c++) img[c] = imgBefore[c]; pal = palBefore; merges = 0; mergedPx = 0; } // merges only pay for detail colours
    pal = pal.concat(detail); let changed = 0;
    for (const c of zc) { const p = L3c(c), q = pal[nearest(p, pal)]; if (dE2(p, q) < dE2(p, img[c]) * 0.6 && dE2(p, q) < 0.008) { img[c] = q; changed++; } }
    borrowInfo = { zone: zone.reduce((a, b) => a + (b ? 1 : 0), 0), changed, detail: detail.length, free, merges, mergedPx, headErr: +headErr.toFixed(4), headOn, detailRgb: detail.map(toRgb) };
  }
  // chunky: every work pixel becomes 2×2 at N (HD-2D lite), outline drawn at full N so the edge stays crisp
  let outImg = img, outG = gridG, outF = cells.feat;
  if (look.chunky) { outImg = new Array(N * N).fill(null); outG = new Int16Array(N * N).fill(-1); outF = new Int8Array(N * N);
    const ox = Math.floor((N - work * 2) / 2);
    for (let y = 0; y < work; y++) for (let x = 0; x < work; x++) { const c = y * work + x; if (!img[c]) continue;
      for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) { const X = x * 2 + dx + ox, Y = y * 2 + dy; if (X >= 0 && Y >= 0 && X < N && Y < N) { outImg[Y * N + X] = img[c]; outG[Y * N + X] = gridG[c]; outF[Y * N + X] = cells.feat[c]; } } }
    // HD-2D touch: one fine rim of light on the top-left edge of the chunky shapes
    const at = (X, Y) => X >= 0 && Y >= 0 && X < N && Y < N && outImg[Y * N + X];
    for (let Y = 0; Y < N; Y++) for (let X = 0; X < N; X++) { const c = Y * N + X; if (outImg[c] && (!at(X, Y - 1) || !at(X - 1, Y)) && outG[c] >= 0) { const r = ramps[outG[c]]; if (outImg[c] !== lines[r.lineIdx]) outImg[c] = r.tones[r.tones.length - 1]; } }
  }
  // clean-up on colour identity, then the selective outline
  const palAll = []; const keyOf = (l) => l && l.map((v) => v.toFixed(4)).join(); const map = new Map();
  outImg.forEach((l) => { if (l && !map.has(keyOf(l))) { map.set(keyOf(l), palAll.length); palAll.push(l); } });
  let idx = Int16Array.from(outImg.map((l) => (l ? map.get(keyOf(l)) : -1)));
  if (!look.noClean) { let pf = outF; if (zone) { pf = new Int8Array(N * N); for (let c = 0; c < N * N; c++) pf[c] = outF[c] || zone[c] || thinW[c] ? 1 : 0; }
    const cl = cleanIdx(idx, N, pf, zone ? { cov: cells.cov } : {}); idx = cl.idx; }
  const { ring, removed } = look.noOutline ? { ring: new Uint8Array(N * N), removed: 0 } : outlineRing((c) => idx[c] >= 0, N, true);
  const px = new Array(N * N).fill(null);
  for (let c = 0; c < N * N; c++) if (idx[c] >= 0) px[c] = toRgb(palAll[idx[c]]);
  const thinNow = zone ? thinMask(Uint8Array.from(idx, (v) => (v >= 0 ? 1 : 0)), N) : null, S4 = (x, y) => x >= 0 && y >= 0 && x < N && y < N && idx[y * N + x] >= 0;
  for (let c = 0; c < N * N; c++) if (ring[c]) { const x = c % N, y = (c / N) | 0; let g = -1;
    if (zone) { // r66c: keep 1 px gaps inside the sprite open; next to a shaft draw only the outer (right/bottom) side, in the line colour
      if ((S4(x - 1, y) && S4(x + 1, y)) || (S4(x, y - 1) && S4(x, y + 1))) continue;
      const nb = N8.map(([dx, dy]) => [dx, dy, (y + dy) * N + x + dx]).filter(([dx, dy]) => S4(x + dx, y + dy));
      if (nb.length && nb.every(([, , k]) => thinNow[k])) { const o = nb.find(([dx, dy]) => dx === -1 && dy === 0) || nb.find(([dx, dy]) => dx === 0 && dy === -1);
        if (!o) continue; const r = ramps[outG[o[2]]]; px[c] = toRgb(r ? lines[r.lineIdx] : lines[0]); continue; } }
    for (const [dx, dy] of N8) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N && idx[Y * N + X] >= 0 && outG[Y * N + X] >= 0) { g = outG[Y * N + X]; break; } }
    px[c] = toRgb(lines[g >= 0 && ramps[g] ? ramps[g].lineIdx : 0]); }
  let headRect = null; const fbR = eyeInfoR && eyeInfoR.faceBox; if (fbR && !look.chunky) { const w = fbR.x1 - fbR.x0 + 1, h = fbR.y1 - fbR.y0 + 1;
    headRect = { x0: Math.max(0, fbR.x0 - Math.ceil(w * 0.9) - 1), x1: Math.min(N - 1, fbR.x1 + Math.ceil(w * 0.9) + 1), y0: 0, y1: Math.min(N - 1, fbR.y1 + Math.ceil(h * 0.25)) }; }
  return { N, px, body: Uint8Array.from(idx, (v) => (v >= 0 ? 1 : 0)), ppRemoved: removed, groups: used.length, borrow: borrowInfo, headRect, zone };
}


/* ---------- 16-bit v2 (r66c): material-aware budget, thin-line care, outer-side outline on shafts ---------- */
function snesLook(P, N, look) {
  const cells = downscale(P, N, look.downscale, { protect: true }), eyeInfo = protectEyes(P, cells);
  const { ids, cols } = solidList(cells), total = ids.length || 1;
  const thin = thinMask(cells.solid, N);
  // detail zones, where the art's own colours win over banded ramps: the head (face + hair/hood around it) and weapons
  // (thin shafts plus 2 cells around them, so a staff head or bow grip comes along)
  const zone = new Uint8Array(N * N);
  if (look.zones !== false) {
    for (let c = 0; c < N * N; c++) if (thin[c]) { const x = c % N, y = (c / N) | 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N && cells.solid[Y * N + X]) zone[Y * N + X] = 2; } }
    const fb = eyeInfo.faceBox; if (fb) { const w = fb.x1 - fb.x0 + 1, h = fb.y1 - fb.y0 + 1;
      for (let y = Math.max(0, fb.y0 - Math.ceil(h * 1.1)); y <= Math.min(N - 1, fb.y1 + Math.ceil(h * 0.25)); y++) for (let x = Math.max(0, fb.x0 - Math.ceil(w * 0.9)); x <= Math.min(N - 1, fb.x1 + Math.ceil(w * 0.9)); x++) if (cells.solid[y * N + x] && !zone[y * N + x]) zone[y * N + x] = 1; }
  }
  for (let c = 0; c < N * N; c++) if (thin[c] && cells.feat[c] === -1) cells.feat[c] = 0; // a shaft's own edge is not a dark "detail"
  // materials: skin first, the rest clustered on hue/chroma (lightness weighted down, darks hue-boosted)
  const key = (p) => { const w = 1 + 1.6 * Math.max(0, 0.55 - p[0]); return [p[0] * 0.45, p[1] * w, p[2] * w]; };
  const isSkin = cols.map(skinLab), skinOwn = isSkin.filter(Boolean).length >= 2;
  const rest = cols.map((p, i) => i).filter((i) => !(skinOwn && isSkin[i])), keyed = rest.map((i) => key(cols[i]));
  const km = kmeans(keyed, medianCut(keyed, Math.min(look.B - (skinOwn ? 1 : 0), keyed.length)), 12);
  // merge materials that only differ in lightness (one robe split into light/dark purple) — the tones handle lightness
  const cen = km.centres.map((c) => [c[0] / 0.45, c[1], c[2]]), asg = Array.from(km.asg), alive = cen.map(() => true), cnt = cen.map((_, j) => asg.filter((v) => v === j).length);
  for (;;) { let bi = -1, bj = -1, bd = Infinity;
    for (let i = 0; i < cen.length; i++) for (let j = i + 1; j < cen.length; j++) if (alive[i] && alive[j]) { const dab = Math.hypot(cen[i][1] - cen[j][1], cen[i][2] - cen[j][2]), dL = Math.abs(cen[i][0] - cen[j][0]);
      if (dab < 0.03 && dL < 0.22 && dab < bd) { bd = dab; bi = i; bj = j; } }
    if (bi < 0) break; alive[bj] = false; for (let k = 0; k < asg.length; k++) if (asg[k] === bj) asg[k] = bi; cnt[bi] += cnt[bj]; }
  const live = alive.map((a, j) => (a ? j : -1)).filter((j) => j >= 0), rm = new Map(live.map((j, i) => [j, i]));
  const B = live.length + (skinOwn ? 1 : 0), gOf = new Int16Array(N * N).fill(-1);
  rest.forEach((i, r) => (gOf[ids[i]] = rm.get(asg[r]))); if (skinOwn) ids.forEach((c, i) => { if (isSkin[i]) gOf[c] = B - 1; });
  const G = Array.from({ length: B }, (_, g) => ({ g, cells: [], L: [], thin: 0, skin: skinOwn && g === B - 1 }));
  ids.forEach((c) => { const g = G[gOf[c]]; g.cells.push(c); g.L.push(cells.lab[c * 3]); if (thin[c]) g.thin++; });
  const lab = (c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]];
  G.forEach((g) => { g.share = g.cells.length / total; g.mean = g.cells.length ? mean3(g.cells.map(lab)) : null;
    g.S = g.share >= 0.12 ? 3 : g.share >= 0.035 ? 2 : 1;
    if (g.skin) g.S = N >= 64 && g.cells.length >= 6 ? 3 : 2; g.minS = g.skin ? g.S : 1;           // faces keep shadow / base / light at 64
    if (g.cells.length && g.thin / g.cells.length > 0.5) g.S = Math.max(g.S, 2); // weapons: base + shadow side
    if (!g.cells.length) g.S = 0; });
  // accents (gem, glow): own colour, plus a light step when the accent itself has a highlight
  const accIds = []; for (let c = 0; c < N * N; c++) if (cells.solid[c] && gOf[c] >= 0) { const m = G[gOf[c]].mean, p = lab(c);
    if (cells.feat[c] === 3 && dE2(p, m) > 0.012) accIds.push(c); } // only accents their material can't express (materials already own the gem/gold)
  let acc = accIds.length ? farthest(accIds.map(lab), Math.min(2, accIds.length)).map((b) => ({ base: b, light: null })) : [];
  acc.forEach((a) => { const mine = accIds.map(lab).filter((p) => acc.every((o) => dE2(p, a.base) <= dE2(p, o.base))); const Ls = mine.map((p) => p[0]);
    if (Ls.length >= 2 && quantile(Ls, 0.9) - quantile(Ls, 0.1) > 0.1) a.light = mean3(mine.filter((p) => p[0] >= quantile(Ls, 0.75))); });
  acc = acc.filter((a, i) => G.every((g) => !g.mean || dE2(a.base, g.mean) > 0.01) && acc.slice(0, i).every((o) => dE2(a.base, o.base) > 0.01));
  // budget: tones + accents + line colours ≤ 16. Give back in this order: lines 3→2, small groups' tones, accent lights, lines 2→1
  // outline colours: if the art has a near-black material, its shadow tone doubles as the outline (costs no slot)
  let Lw = Math.min(2, B), reuse = false, Dw = look.zones === false ? 0 : N >= 64 ? 3 : 2; // Dw = slots kept for detail-zone colours
  const cost = () => G.reduce((s, g) => s + g.S, 0) + acc.reduce((s, a) => s + 1 + (a.light ? 1 : 0), 0) + (reuse ? 0 : Lw) + Dw;
  if (G.some((g) => g.mean && g.mean[0] < 0.34 && g.share > 0.02)) reuse = true;
  const steps = [() => (Lw > 2 ? (Lw--, true) : false),
    () => { const g = G.filter((g) => g.S > g.minS && !(g.thin / (g.cells.length || 1) > 0.5)).sort((a, b) => a.share - b.share)[0]; if (!g) return false; g.S--; return true; },
    () => { const a = acc.find((a) => a.light); if (!a) return false; a.light = null; return true; },
    () => (Lw > 1 ? (Lw--, true) : false),
    () => { const g = G.filter((g) => g.S > 1).sort((a, b) => a.share - b.share)[0]; if (!g) return false; g.S--; return true; },
    () => (acc.length ? (acc.pop(), true) : false), () => (Dw > 0 ? (Dw--, true) : false)];
  for (const st of steps) while (cost() > 16 && st());
  if (look.zones !== false) Dw = Math.min(4, Dw + 16 - cost()); // unused slots go to detail colours in the head / weapon zones
  // tones per material from the art's own lightness; top-left light only on big, non-thin areas
  const tone = new Int8Array(N * N).fill(-1);
  G.forEach((g) => { if (!g.cells.length) return;
    const qs = g.skin && g.S === 3 ? [quantile(g.L, 0.15), quantile(g.L, 0.55)] : g.S === 3 ? [quantile(g.L, 0.3), quantile(g.L, 0.78)] : g.S === 2 ? [quantile(g.L, 0.4)] : [], spread = quantile(g.L, 0.85) - quantile(g.L, 0.15);
    g.cells.forEach((c) => { let t = 0; qs.forEach((q) => { if (cells.lab[c * 3] > q) t++; }); if (spread < 0.05 && g.S > 1) t = g.S - 1;
      if (thin[c]) t = Math.max(t, g.S - 1 - (g.S === 3 ? 1 : 0)); // shafts sit on base (the outer outline gives them their shadow)
      else if (look.toplight && g.S === 3 && !g.skin && !cells.feat[c]) { const e = edgeSides(cells, (k) => gOf[k], c); if ((e.top || e.left) && !(e.bottom || e.right)) t++; else if ((e.bottom || e.right) && !(e.top || e.left)) t--; }
      tone[c] = Math.max(0, Math.min(g.S - 1, t)); });
    const dl = Math.max(0.08, Math.min(0.16, spread * 0.6)), b = g.mean;
    g.tones = g.S === 3 ? [shiftTone(b, -dl, HUE_BLUE, 10, 1.04), b, shiftTone(b, dl * 0.75, HUE_YELLOW, 8, 0.92)] : g.S === 2 ? [shiftTone(b, -dl * 0.9, HUE_BLUE, 10, 1.05), b] : [b];
    g.line = lineOfLab(b); });
  let lines = G.filter((g) => g.cells.length).map((g) => g.line); if (lines.length > Lw) lines = kmeans(lines, medianCut(lines, Lw), 8).centres;
  if (reuse) lines = G.filter((g) => g.tones && g.tones[0][0] < 0.3).map((g) => g.tones[0]).sort((a, b) => a[0] - b[0]).slice(0, 2);
  if (!lines.length) lines = [lineOfLab(G.find((g) => g.mean).mean)];
  G.forEach((g) => { if (g.line) g.lineIdx = nearest(g.line, lines); });
  const accPal = acc.flatMap((a) => (a.light ? [a.base, a.light] : [a.base]));
  // detail colours: the zone cells the palette fits worst get up to Dw extra colours (farthest-first, only if clearly off)
  const basePal = G.flatMap((g) => g.tones || []).concat(accPal, lines);
  const zoneCells = []; for (let c = 0; c < N * N; c++) if (zone[c] && cells.solid[c] && cells.feat[c] > -2) zoneCells.push(c);
  const detail = [];
  for (let k = 0; k < Dw; k++) { const pal = basePal.concat(detail); let best = null, bd = 0.004;
    // weight by how many zone cells sit near the candidate, so one stray pixel does not take a slot
    for (const c of zoneCells) { const p = lab(c), e = dE2(p, pal[nearest(p, pal)]); if (e <= bd) continue; let sup = 0; for (const o of zoneCells) if (dE2(lab(o), p) < e * 0.35) sup++; if (sup >= 2 && e * Math.sqrt(sup) > bd) { bd = e * Math.sqrt(sup); best = p; } }
    if (!best) break; const near = zoneCells.map(lab).filter((p) => dE2(p, best) < 0.004); detail.push(near.length ? mean3(near) : best); }
  const zonePal = basePal.concat(detail);
  // compose
  const img = new Array(N * N).fill(null);
  for (let c = 0; c < N * N; c++) { const gi = gOf[c]; if (!cells.solid[c] || gi < 0) continue; const g = G[gi], p = lab(c);
    if (zone[c] && cells.feat[c] !== -2) { const rampCol = g.tones[tone[c]]; // in head/weapon zones the ramp stays unless it is clearly wrong
      if (dE2(p, rampCol) > (look.zoneErr || 0.006)) { img[c] = zonePal[nearest(p, zonePal)]; continue; } }
    if (cells.feat[c] === -2) { img[c] = lines[0]; continue; } // eyes
    if (accPal.length && accIds.includes(c)) { img[c] = accentOrTone(p, accPal, g.tones); continue; }
    if (cells.feat[c] < 0 && !thin[c]) { img[c] = lines[g.lineIdx]; continue; }
    if (cells.feat[c] === 1) { img[c] = g.tones[g.S - 1]; continue; }
    img[c] = g.tones[tone[c]]; }
  const palAll = [], map = new Map(), keyOf = (l) => l.map((v) => v.toFixed(4)).join();
  img.forEach((l) => { if (l && !map.has(keyOf(l))) { map.set(keyOf(l), palAll.length); palAll.push(l); } });
  let idx = Int16Array.from(img.map((l) => (l ? map.get(keyOf(l)) : -1)));
  const protect = new Int8Array(N * N); for (let c = 0; c < N * N; c++) protect[c] = cells.feat[c] || thin[c] || zone[c] ? 1 : 0;
  idx = cleanIdx(idx, N, protect, { cov: cells.cov }).idx;
  // outline: normal ring = the material's line colour. Next to a shaft: only the outer (bottom/right) side, in the shaft's own shadow tone
  const { ring, removed } = outlineRing((c) => idx[c] >= 0, N, true), px = new Array(N * N).fill(null);
  for (let c = 0; c < N * N; c++) if (idx[c] >= 0) px[c] = toRgb(palAll[idx[c]]);
  const thinNow = thinMask(Uint8Array.from(idx, (v) => (v >= 0 ? 1 : 0)), N);
  for (let c = 0; c < N * N; c++) if (ring[c]) { const x = c % N, y = (c / N) | 0, nb = [];
    for (const [dx, dy] of N8) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N && idx[Y * N + X] >= 0) nb.push([dx, dy, Y * N + X]); }
    if (!nb.length) continue;
    const S4 = (dx, dy) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < N && Y < N && idx[Y * N + X] >= 0; };
    if ((S4(-1, 0) && S4(1, 0)) || (S4(0, -1) && S4(0, 1))) continue; // a 1 px gap inside the sprite (staff loop, between legs) stays open
    const allThin = nb.every(([, , k]) => thinNow[k]);
    if (allThin) { const outer = nb.find(([dx, dy]) => dx === -1 && dy === 0) || nb.find(([dx, dy]) => dx === 0 && dy === -1);
      if (!outer) continue; const k = outer[2], g = G[gOf[k]] || G.find((q) => q.cells.length); px[c] = toRgb(g.S > 1 ? g.tones[0] : lines[g.lineIdx]); continue; }
    const k = (nb.find(([dx, dy]) => !dx || !dy) || nb[0])[2], g = gOf[k] >= 0 ? G[gOf[k]] : G.find((q) => q.cells.length);
    px[c] = toRgb(lines[g.lineIdx]); }
  if (process.env.DBG) console.log(G.map((g) => ({ n: g.cells.length, S: g.S, thin: g.thin, skin: g.skin, rgb: g.mean && toRgb(g.mean) })), "acc", accPal.map(toRgb), "lines", lines.map(toRgb), "accIds", accIds.length, "detail", detail.map(toRgb), "zone", zoneCells.length, eyeInfo.faceBox);
  return { N, px, ppRemoved: removed, groups: G.filter((g) => g.cells.length).length, budget: { tones: G.map((g) => g.S), acc: accPal.length, lines: lines.length, detail: detail.length, zone: zoneCells.length } };
}

function fixedLook(P, N, look) {
  const pal = PALETTES[look.fixed].map((h) => toLab(...hexToRgb(h)));
  const cells = downscale(P, N, look.downscale, { protect: true }); protectEyes(P, cells);
  const { ids, cols } = solidList(cells); const pidx = new Int16Array(N * N).fill(-1);
  if (look.fixed === "gameboy") {
    // 4 shades by lightness: darkest = outline + eyes/dark detail, the other three split by the art's own value quantiles
    const Ls = cols.map((p) => p[0]), q1 = quantile(Ls, 0.3), q2 = quantile(Ls, 0.75), dk = quantile(Ls, 0.08);
    ids.forEach((c, i) => { const L = cols[i][0]; pidx[c] = cells.feat[c] < 0 || L <= dk ? 0 : L <= q1 ? 1 : L <= q2 ? 2 : 3; });
  } else {
    // PICO-8: lift each cell a little (PICO art is bright and punchy), then snap it straight to the nearest PICO-8 colour
    // skin is not punched (it would turn orange); coloured cells may not snap to PICO-8's greys (olive cloak ≠ grey)
    const punch = (p) => (skinLabV1(p) ? p : [p[0] * 0.85 + 0.12, p[1] * 1.35, p[2] * 1.35]), d = (p, q) => 0.5 * (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2;
    const chroma = pal.map((q) => Math.hypot(q[1], q[2]));
    ids.forEach((c, i) => { const p = punch(cols[i]), coloured = Math.hypot(p[1], p[2]) > 0.05; let bj = 0, bd = Infinity;
      pal.forEach((q, j) => { if (coloured && chroma[j] < 0.03) return; const v = d(p, q); if (v < bd) { bd = v; bj = j; } }); pidx[c] = bj; if (cells.feat[c] < 0) pidx[c] = PICO_DARKER[bj]; });
  }
  const cl = cleanIdx(pidx, N, cells.feat); const idx = cl.idx;
  const { ring, removed } = outlineRing((c) => idx[c] >= 0, N, true); const px = new Array(N * N).fill(null);
  for (let c = 0; c < N * N; c++) if (idx[c] >= 0) px[c] = hexToRgb(PALETTES[look.fixed][idx[c]]);
  for (let c = 0; c < N * N; c++) if (ring[c]) { let j = 0;
    if (look.fixed === "pico8") { const x = c % N, y = (c / N) | 0; for (const [dx, dy] of N8) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N && idx[Y * N + X] >= 0) { j = PICO_DARKER[PICO_DARKER[idx[Y * N + X]]]; break; } } }
    px[c] = hexToRgb(PALETTES[look.fixed][j]); }
  return { N, px, body: Uint8Array.from(idx, (v) => (v >= 0 ? 1 : 0)), ppRemoved: removed };
}
function renderLook(P, N, id, over) { const look = Object.assign({}, LOOKS[id], over || {}), CAP = look.cap || 16;
  // 66e raised cap: the extra slots buy one more hue group per 4 colours (20 → 5 groups, 24 → 6), lines and detail take the rest
  if (CAP > 16 && look.B && look.S) look.B += Math.floor((CAP - 16) / 4);
  if (look.borrow && !look.headZone) { // 16-bit 66c: head stays pixel-for-pixel as 66b (CEO: the 66b knight head is the better one)
    const spr = rampLook(P, N, look), old = rampLook(P, N, Object.assign({}, LOOKS.snesOld, { cap: CAP, B: look.B })), r = old.headRect;
    if (r) { let n = 0; for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) { const c = y * N + x; if (spr.zone && spr.zone[c] === 2) continue; // weapon cells next to the head keep their fix
        if (spr.body && old.body) spr.body[c] = old.body[c]; if (String(spr.px[c]) !== String(old.px[c])) { spr.px[c] = old.px[c]; n++; } } if (spr.borrow) spr.borrow.headRestored = n; }
    return capColours(spr, CAP); } return capColours(look.fixed ? fixedLook(P, N, look) : look.v2 ? snesLook(P, N, look) : rampLook(P, N, look), CAP); }


/* ---------- 66e hybrid: a 16-colour body (Combo A @16 by default, or snes-new @16) + a head with its own small palette budget ---------- */
// The CEO liked r66's face and hair (24 colours) but snes-new / Combo A robes. So the 16 snes-new colours stay for the whole sprite,
// and the extra slots (cap − 16, e.g. 8 at 24) are spent only inside the head box: the head cells are re-read with r66's own
// downscale (majority, faithful colours, no banding) and quantised to the snes palette PLUS a few head-only colours.
// Outline, weapon cells (zone 2) and everything outside the head box stay pixel-for-pixel snes-new.
function hybridLook(P, N, o = {}) {
  const CAP = o.cap || 24, COMBO_A = Object.assign({}, COMBO_A_OPTS, o.pipe || {});
  let base, r;
  if (o.base === "snes") { base = renderLook(P, N, "snes"); r = base.headRect; }
  else { // 66e: Combo A @16 is the leading general pipeline (CEO), so it is the default body; head box as in rampLook
    base = renderPipeline(P, N, COMBO_A); const c0 = downscale(P, N, "twopass", { protect: true }), fb = protectEyes(P, c0).faceBox;
    if (fb) { const w = fb.x1 - fb.x0 + 1, h = fb.y1 - fb.y0 + 1; r = { x0: Math.max(0, fb.x0 - Math.ceil(w * 0.9) - 1), x1: Math.min(N - 1, fb.x1 + Math.ceil(w * 0.9) + 1), y0: 0, y1: Math.min(N - 1, fb.y1 + Math.ceil(h * 0.25)) }; }
    // weapon zone: thin cells (shafts, bowstrings, blades) grown by 2, so the staff head, gem and grip are inside it (same rule as the 66c borrow)
    const th = thinMask(c0.solid, N); base.zone = new Uint8Array(N * N);
    for (let c = 0; c < N * N; c++) if (th[c]) { const x = c % N, y = (c / N) | 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N && c0.solid[Y * N + X]) base.zone[Y * N + X] = 2; } } }
  // armoured / warrior sprites keep their head as it is (CEO: the 16-bit knight head is the better one); same rule as Analyse's warrior test
  const keep = o.keepHead ?? (P._an && P._an[N] ? P._an[N] : (P._an = Object.assign(P._an || {}, { [N]: analyse(P, N) }))[N]).metrics.warrior;
  const cells = downscale(P, N, o.down || "majority", { protect: true, pass1: 32 }); protectEyes(P, cells); // r66's own downscale: faithful colours, no banding
  const toL = (c) => [cells.lab[c * 3], cells.lab[c * 3 + 1], cells.lab[c * 3 + 2]];
  const basePal = [...new Set(base.px.filter(Boolean).map((c) => c.join()))].map((k) => toLab(...k.split(",").map(Number)));
  const edge = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= N || Y >= N || !cells.solid[Y * N + X]; });
  // head region: inside the head box, not weapon, not on the silhouette edge (majority edge cells can carry background fringe, mint on the fairy)
  const head = []; if (r && !keep) for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) { const c = y * N + x;
    if (cells.solid[c] && base.px[c] && !(base.zone && base.zone[c] === 2) && !edge(x, y)) head.push(c); }
  // weapon region (66e, CEO: r66's staff is the clearest): zone-2 cells; shafts are 1–2 px so edge cells are allowed here
  const weapon = []; if (o.weapon !== false && base.zone) for (let c = 0; c < N * N; c++) if (base.zone[c] === 2 && cells.solid[c] && base.px[c]) weapon.push(c);
  // budget: cap − 16-colour body. Weapon gets up to half first, the head the rest, then any slot the head did not need goes back to the weapon.
  const K = Math.max(0, CAP - basePal.length), extra = [], tag = [];
  const pick = (cellsIn, k, name) => { const cand = cellsIn.map(toL); let got = 0;
    for (; got < k; got++) { const P2 = basePal.concat(extra); let best = -1, bs = 0.003;
      cand.forEach((p, i) => { const e = dE2(p, P2[nearest(p, P2)]); if (e <= 0.003) return; let sup = 0; for (const q of cand) if (dE2(p, q) < 0.003) sup++;
        if (sup < 2 && e < 0.02) return; // a single cell only earns a colour when it is far off (the gem's white glint, a second blue)
        const sc = e * Math.sqrt(sup); if (sc > bs) { bs = sc; best = i; } });
      if (best < 0) break; extra.push(mean3(cand.filter((q) => dE2(q, cand[best]) < 0.003))); tag.push(name); }
    return got; };
  const wHalf = Math.ceil(K / 2); let wGot = weapon.length ? pick(weapon, wHalf, "weapon") : 0;
  const hGot = head.length ? pick(head, K - wGot, "head") : 0; if (weapon.length) wGot += pick(weapon, K - wGot - hGot, "weapon");
  if (o.ref) { // 66e "r66 regions": the head and weapon regions take r66's own pixels (same grid, same silhouette), re-palettised into cap − 16 extra slots
    const R = o.ref, inHead = new Uint8Array(N * N), inW = new Uint8Array(N * N), Cr = (p) => Math.hypot(p[1], p[2]);
    // noise gate: an r66 pixel much more saturated than the art under it (r66's orange specks on the knight and the ranger's bow) is not taken
    const noisy = (c) => { const q = toLab(...R[c]), p = toL(c); if (!cells.solid[c] || !(Cr(q) > Cr(p) + 0.07 && dE2(p, q) > 0.02)) return false;
      const dh = Math.abs(((Math.atan2(q[2], q[1]) - Math.atan2(p[2], p[1])) * 180 / Math.PI + 540) % 360 - 180); return Cr(p) < 0.03 || dh > 25; }; // a brighter blue on a blue gem is fine
    let gated = 0;
    if (r && !keep) for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) { const c = y * N + x; if (R[c] && base.px[c] && !(base.zone && base.zone[c] === 2)) { if (noisy(c)) gated++; else inHead[c] = 1; } }
    if (o.weapon !== false && base.zone) for (let c = 0; c < N * N; c++) if (base.zone[c] === 2 && R[c] && base.px[c]) { if (noisy(c)) gated++; else inW[c] = 1; }
    const ex = [], exTag = [], pickR = (mask, k, name) => { const cand = []; for (let c = 0; c < N * N; c++) if (mask[c]) cand.push(toLab(...R[c])); let got = 0;
      for (; got < k; got++) { const P2 = basePal.concat(ex); let best = -1, bs = 0.002;
        cand.forEach((p, i) => { const e = dE2(p, P2[nearest(p, P2)]); if (e <= 0.002) return; let sup = 0; for (const q of cand) if (dE2(p, q) < 0.002) sup++;
          if (sup < 2 && e < 0.02) return; const sc = e * Math.sqrt(sup) * (name === "head" ? 1.2 : 1); if (sc > bs) { bs = sc; best = i; } });
        if (best < 0) break; ex.push(mean3(cand.filter((q) => dE2(q, cand[best]) < 0.002))); exTag.push(name); } return got; };
    let wG = pickR(inW, Math.ceil(K / 2), "weapon"); const hG = pickR(inHead, K - wG, "head"); wG += pickR(inW, K - wG - hG, "weapon");
    const palR = basePal.concat(ex); let hc = 0, wc = 0;
    for (let c = 0; c < N * N; c++) if (inHead[c] || inW[c]) { const q = toRgb(palR[nearest(toLab(...R[c]), palR)]); if (String(q) !== String(base.px[c])) { base.px[c] = q; inW[c] ? wc++ : hc++; } }
    base.hybrid = { head: inHead.reduce((a, v) => a + v, 0), weapon: inW.reduce((a, v) => a + v, 0), headChanged: hc, weaponChanged: wc, headExtra: hG, weaponExtra: wG, keptHead: !!keep, ref: "r66", gated };
    base.region = Uint8Array.from(inHead, (v, c) => (v ? 1 : inW[c] ? 2 : 0)); // r67: which cells carry r66 pixels (the UI keeps their colours in their own parts)
    return capColours(base, CAP); }
  const pal = basePal.concat(extra), counts = { head: 0, weapon: 0 };
  const region = (list, name) => { for (const c of list) { if (cells.feat[c] < 0) continue; // eyes and dark features keep the body's dark
    const p = toL(c), q = toRgb(pal[nearest(p, pal)]); if (dE2(p, toLab(...q)) < dE2(p, toLab(...base.px[c])) * 0.8 && String(q) !== String(base.px[c])) { base.px[c] = q; counts[name]++; } } };
  region(head, "head"); region(weapon, "weapon");
  base.hybrid = { head: head.length, weapon: weapon.length, headChanged: counts.head, weaponChanged: counts.weapon, headExtra: hGot, weaponExtra: wGot, keptHead: !!keep };
  return capColours(base, CAP);
}

/* ---------- 9. Analyse: measure the input, pick the look that will convert best, say why ---------- */
function analyse(P, N = 32) {
  const { box, w, lab, mask, feat } = P; let n = 0, flat = 0, grad = 0, edge = 0, busy = 0, glow = 0, chromaSum = 0, satHi = 0;
  const bins = new Set(), step = Math.max(1, Math.round(Math.max(box.bw, box.bh) / 256));
  const L = (i) => lab[i * 3];
  for (let y = box.by + step; y < box.by + box.bh - step; y += step) for (let x = box.bx + step; x < box.bx + box.bw - step; x += step) {
    const i = y * w + x; if (!mask[i] || !mask[i - step] || !mask[i + step] || !mask[i - step * w] || !mask[i + step * w]) continue; n++;
    const gx = (L(i + step) - L(i - step)) / 2, gy = (L(i + step * w) - L(i - step * w)) / 2, g = Math.hypot(gx, gy) / step;
    if (g < 0.002) flat++; else if (g < 0.02) grad++; if (g > 0.06) edge++;
    if (Math.abs(feat[i]) > 0.06) busy++;
    const C = Math.hypot(lab[i * 3 + 1], lab[i * 3 + 2]); chromaSum += C; if (C > 0.14) satHi++;
    if (L(i) > 0.86 && C > 0.06 && feat[i] > 0.08) glow++;
    bins.add(`${Math.round(L(i) * 20)},${Math.round(lab[i * 3 + 1] * 30)},${Math.round(lab[i * 3 + 2] * 30)}`);
  }
  // silhouette outline: share of the inner edge ring that is dark
  let ring = 0, darkRing = 0; for (let y = box.by; y < box.by + box.bh; y += step) for (let x = box.bx; x < box.bx + box.bw; x += step) { const i = y * w + x; if (!mask[i]) continue;
    if (!mask[i - 3] || !mask[i + 3] || !mask[i - 3 * w] || !mask[i + 3 * w]) { ring++; if (L(i) < 0.32) darkRing++; } }
  // colour count: how many OKLab k-means colours until the average error is small
  const sample = []; for (let y = box.by; y < box.by + box.bh; y += step * 2) for (let x = box.bx; x < box.bx + box.bw; x += step * 2) { const i = y * w + x; if (mask[i]) sample.push([lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]]); }
  let effColours = 32; for (const k of [4, 6, 8, 10, 12, 16, 24]) { const pal = buildPalette(sample, k, "kmeans"); const err = sample.reduce((s, p) => s + Math.sqrt(dE2(p, pal[nearest(p, pal)])), 0) / sample.length; if (err < 0.035) { effColours = k; break; } }
  let metal = 0; for (let y = box.by; y < box.by + box.bh; y += step * 2) for (let x = box.bx; x < box.bx + box.bw; x += step * 2) { const i = y * w + x; if (mask[i] && L(i) > 0.55 && L(i) < 0.92 && Math.hypot(lab[i * 3 + 1], lab[i * 3 + 2]) < 0.035) metal++; }
  const m = { metal: metal / Math.max(1, sample.length), flat: flat / n, gradient: grad / n, edges: edge / n, busy: busy / n, glow: glow / n, chroma: chromaSum / n, saturated: satHi / n, colourBins: bins.size, effColours, outline: ring ? darkRing / ring : 0, aspect: box.bh / box.bw };
  m.painterly = Math.min(1, m.gradient * 1.1 + m.busy * 0.8 - m.flat * 0.6);
  // scores per look, plain rules (weights tuned on the 5 test samples — see ux/converter-quality-study.md)
  const S = {
    cel: 0.3 + m.flat * 1.5 + m.saturated * 0.8 + m.outline * 0.3 - m.painterly * 0.4 + (m.aspect < 1.6 ? 0.15 : 0), // chibi proportions → anime
    vector: 0.2 + m.flat * 1.8 - m.edges * 1.2 - m.painterly * 0.6 + (m.effColours <= 8 ? 0.15 : 0),
    snes: 0.5 + m.painterly * 0.6 + m.gradient * 0.4 - m.flat * 0.3 + (m.effColours >= 12 ? 0.1 : 0),
    hd2d: 0.15 + m.busy * 1.3 + m.edges * 0.7 + m.glow * 3 + (m.effColours >= 16 ? 0.1 : 0) - (N < 64 ? 0.5 : 0), // chunky halves the grid: only sensible at 64 px
    pico8: 0.2 + m.saturated * 1.2 + (m.effColours <= 12 ? 0.15 : -0.1) - m.painterly * 0.4,
    gameboy: 0.1 + (m.chroma < 0.06 ? 0.45 : 0) + (m.effColours <= 10 ? 0.1 : 0) - m.saturated * 0.8 + m.outline * 0.3,
  };
  // warrior rule (CEO 2026-11-12, 64 px only): armoured, hard-edged sprites (plate metal ≥ 10% and edges ≥ 12%) get Vector as
  // the runner-up, just under 16-bit, so 16-bit stays the default. At 32 px nothing changes.
  m.warrior = m.metal >= 0.1 && m.edges >= 0.12;
  // CEO-ranked rules at 64 px (2026-11-12): 16-bit is the strongest default; bright, saturated chibi art (saturated ≥ 30%, height/width < 1.6)
  // prefers PICO-8 with 16-bit just behind. 32 px keeps the 66b scores.
  m.brightChibi = m.saturated >= 0.3 && m.aspect < 1.6;
  if (N >= 64) { S.snes += 0.3; if (m.brightChibi) S.pico8 = Math.max(S.pico8, S.snes + 0.02); if (m.warrior) S.vector = Math.max(S.vector, S.snes - 0.02); }
  const order = Object.keys(S).sort((a, b) => S[b] - S[a]), lookPick = order[0], lookSecond = order[1];
  // r67 (CEO 2026-11-12: Combo A "is the best overall in general"): Crisp (Combo A) is the general recommendation. The CEO-ranked
  // 64 px rules still win where they apply: bright chibi → PICO-8 then 16-bit; warrior → Crisp with Vector as the strong second.
  // Otherwise the best-scoring look becomes the runner-up. lookPick / lookSecond keep the 66b–66c look ranking for the test table.
  let pick = "crisp", second = lookPick;
  if (N >= 64 && m.brightChibi) { pick = "pico8"; second = "snes"; }
  else if (N >= 64 && m.warrior) second = "vector";
  const pct = (v) => Math.round(v * 100) + "%";
  const name = { crisp: "Crisp", cel: "Cel", vector: "Vector", snes: "16-bit", hd2d: "HD-2D", pico8: "PICO-8", gameboy: "Game Boy" };
  const whyLook = {
    cel: `Big flat colour areas (${pct(m.flat)} flat) and ${m.aspect < 1.6 ? "chibi proportions" : m.outline > 0.3 ? "a dark outline already drawn" : "clear shapes"}: anime-style flat colour with one shadow step keeps it clean.`,
    vector: `Mostly flat fills (${pct(m.flat)}) with few lines: flat shapes and no shading will look closest.`,
    snes: `Soft painted shading (${pct(m.gradient)} smooth gradients, about ${m.effColours} colours): three-step ramps turn the gradients into clean bands.`,
    hd2d: `Lots of small detail and texture (${pct(m.busy)} busy${m.glow > 0.005 ? ", some glow" : ""}): chunky pixels keep the shapes readable instead of noisy.`,
    pico8: `Bright, saturated colours (${pct(m.saturated)})${m.brightChibi ? " on a chibi figure" : ""}: the PICO-8 palette has strong matches for them${m.brightChibi && N >= 64 ? ", and 16-bit is a close second" : ""}.`,
    gameboy: `Low colour (${m.chroma.toFixed(2)} average chroma): four shades of one colour will read well.`,
  }[lookPick] + (m.warrior && N >= 64 && lookSecond === "vector" ? " Armoured and hard-edged, so the flat Vector look is a strong second choice." : "");
  // one plain-words reason line for the UI
  const why = pick === "pico8" ? `Bright, saturated colours on a chibi figure (${pct(m.saturated)} saturated): PICO-8 matches them best. 16-bit is a close second.`
    : N >= 64 && m.warrior ? `Crisp keeps your art's own colours with a clean outline. Armoured and hard-edged, so Vector is a strong second.`
    : `Crisp keeps your art's own colours with a clean outline, the best general choice. ${name[second]} is a good second.`;
  return { pick, second, why, whyLook, lookPick, lookSecond, scores: Object.fromEntries(Object.entries(S).map(([k, v]) => [k, +v.toFixed(3)])), metrics: Object.fromEntries(Object.entries(m).map(([k, v]) => [k, typeof v === "number" ? +v.toFixed(3) : v])) };
}

/* ---------- prompt tips per look (UI help text) ---------- */
const PROMPT_TIPS = {
  crisp: "clean game sprite, full body, front facing, clear shapes, solid colours, plain magenta background",
  cel: "flat cel shading, bold dark outlines, two tones per colour, full body, plain magenta background",
  snes: "16-bit RPG sprite style, simple shapes, clear light from top left, few colours, full body, plain magenta background",
  hd2d: "chunky low-res sprite, big readable shapes, simple face, soft light from top left, plain magenta background",
  gameboy: "high contrast, simple shapes, strong light and dark areas, no gradients, plain magenta background",
  pico8: "bright saturated colours, very simple shapes, big head, few colours, plain magenta background",
  vector: "flat vector illustration, solid colour fills, no gradients, no texture, clean shapes, plain magenta background",
};

// hard cap: merge the two closest colours (OKLab) until at most `max` remain — the ≤16 incl. outline rule is never broken
function capColours(spr, max = 16) {
  for (;;) { const keys = [...new Set(spr.px.filter(Boolean).map((c) => c.join()))]; if (keys.length <= max) return spr;
    const labs = keys.map((k) => toLab(...k.split(",").map(Number))); let bi = 0, bj = 1, bd = Infinity;
    for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) { const d = dE2(labs[i], labs[j]); if (d < bd) { bd = d; bi = i; bj = j; } }
    const cnt = (k) => spr.px.filter((c) => c && c.join() === k).length, [keep, drop] = cnt(keys[bi]) >= cnt(keys[bj]) ? [bi, bj] : [bj, bi], kc = keys[keep].split(",").map(Number);
    spr.px = spr.px.map((c) => (c && c.join() === keys[drop] ? kc : c)); spr.merged = (spr.merged || 0) + 1; }
}
function countColours(spr) { return new Set(spr.px.filter(Boolean).map((c) => c.join())).size; }
let R66fns = null;
const API = {
  // the converter hands over its own r66 functions (no source parsing, no eval)
  initWith(R) { R66fns = R; require_placement = (P, N) => R.placement(P.box, N, null); return API; },
  prepare, prepareMasked, renderPipeline, renderLook, hybridLook, analyse, downscale, COMBO_A: COMBO_A_OPTS,
  rawCells: (P, N, m, o) => { const c = downscale(P, N, m, o || {}); return { N, px: Array.from({ length: N * N }, (_, i) => (c.solid[i] ? toRgb([c.lab[i * 3], c.lab[i * 3 + 1], c.lab[i * 3 + 2]]) : null)) }; },
  countColours, capColours, LOOKS, PALETTES, PROMPT_TIPS, toLab, toRgb, dE2, wu, medianCut, kmeans };
if (typeof module !== "undefined" && module.exports) module.exports = API; else { window.ConvertEngine = API; window.ConvertStudy = API; }
})();
