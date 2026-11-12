/* Body map + region walk — r68 (Sprite Studio).
   A body map gives every pixel of a sprite a body region (head, body, arms, legs, weapon, wings/cape).
   guess() makes one from the picture alone (silhouette rows, the gap between the legs, thin weapon shapes, colour parts);
   the user can fix it with a brush. walkFrame() makes the classic 4-frame pixel walk by MOVING regions 1 px:
   frames 1/3 contact, 2/4 passing; legs alternate up (and forward in side view), body + head bob 1 px, arms swing
   opposite to the legs, the weapon follows its hand, wings/cape lag 1 frame. Pixels are only moved, never scaled;
   1 px cracks the moves open are filled from the original picture. Plain JS, no network. Node: module.exports. */
(() => {
  const REGIONS = [
    null,
    { id: 1, key: "head", name: "Head", col: "#ffb020" },
    { id: 2, key: "body", name: "Body", col: "#3d7bff" },
    { id: 3, key: "armL", name: "Left arm", col: "#22c55e" },
    { id: 4, key: "armR", name: "Right arm", col: "#00b5c8" },
    { id: 5, key: "legL", name: "Left leg", col: "#ff4f8b" },
    { id: 6, key: "legR", name: "Right leg", col: "#a35cff" },
    { id: 7, key: "weapon", name: "Weapon", col: "#ff7a00" },
    { id: 8, key: "extra", name: "Wings / cape", col: "#9ad7ff" },
  ];
  const HEAD = 1, BODY = 2, ARML = 3, ARMR = 4, LEGL = 5, LEGR = 6, WEAPON = 7, EXTRA = 8;

  // thin structures (blades, staffs, bows): a 1–2 px run across in a sparse 5×5 neighbourhood (same rule as the converter)
  function thinMask(solid, W, H) {
    const t = new Uint8Array(W * H), S = (x, y) => x >= 0 && y >= 0 && x < W && y < H && solid[y * W + x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!S(x, y)) continue;
      let h = 1, v = 1; for (let k = 1; S(x - k, y); k++) h++; for (let k = 1; S(x + k, y); k++) h++; for (let k = 1; S(x, y - k); k++) v++; for (let k = 1; S(x, y + k); k++) v++;
      let dn = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (S(x + dx, y + dy)) dn++;
      if ((h <= 2 || v <= 2) && dn / 25 < 0.44) t[y * W + x] = 1; }
    return t;
  }
  function components(mask, W, H, eight) {
    const lab = new Int32Array(W * H).fill(-1), out = [];
    for (let i = 0; i < W * H; i++) { if (!mask[i] || lab[i] >= 0) continue;
      const c = { px: [], x0: W, x1: -1, y0: H, y1: -1 }, q = [i]; lab[i] = out.length;
      while (q.length) { const j = q.pop(), x = j % W, y = (j / W) | 0; c.px.push(j);
        if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; if (!eight && dx && dy) continue;
          const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const k = Y * W + X; if (mask[k] && lab[k] < 0) { lab[k] = out.length; q.push(k); } } }
      out.push(c); }
    return { comps: out, lab };
  }
  const pct = (arr, p) => { if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

  // info: { partOf(slot) → part id, weaponParts, legParts, headParts (Sets of part ids, for drawn heroes whose parts are known) }
  function guess(img, W, H, info = {}) {
    const N = W * H, solid = new Uint8Array(N); let n = 0, x0 = W, x1 = -1, y0 = H, y1 = -1;
    for (let i = 0; i < N; i++) if (img[i]) { solid[i] = 1; n++; const x = i % W, y = (i / W) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const reg = new Uint8Array(N), meta = { cx: W / 2, legTop: H, neck: 0, splitX: W / 2, weaponArm: 0, legGap: false };
    if (!n) return { reg, meta };
    const h = y1 - y0 + 1, part = (i) => (info.partOf ? info.partOf(img[i]) : img[i]);
    const colX = (rows) => { const xs = []; for (let y = rows[0]; y <= rows[1]; y++) for (let x = 0; x < W; x++) if (solid[y * W + x]) xs.push(x); return xs; };
    const cx0 = pct(colX([y0, y1]), 0.5);
    // 1. weapon: a known weapon part, else the longest thin limb that sticks out of the trunk (the trunk = what survives
    //    shrinking the silhouette by 1 px per 32 px, then growing it back). Arms hug the trunk along their length; weapons don't.
    const weapon = new Uint8Array(N), r = Math.max(1, Math.round(W / 32));
    const trunk = trunkOf(solid, W, H, r);
    if (info.weaponParts) { for (let i = 0; i < N; i++) if (solid[i] && info.weaponParts.has(part(i))) weapon[i] = 1; }
    else {
      const app = new Uint8Array(N); for (let i = 0; i < N; i++) app[i] = solid[i] && !trunk[i] ? 1 : 0;
      const { comps } = components(app, W, H, true);
      const cands = comps.map((c) => { const ext = Math.hypot(c.x1 - c.x0 + 1, c.y1 - c.y0 + 1); let touch = 0;
          c.px.forEach((j) => { const x = j % W, y = (j / W) | 0; if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < W && Y < H && trunk[Y * W + X]; })) touch++; });
          return { c, ext, touch: touch / c.px.length, fat: c.px.length / ext }; })
        .filter((k) => k.ext >= Math.max(5, 0.3 * h) && k.touch < 0.45 && k.fat <= 2.2 * r + 1.5)
        .sort((a, b) => b.ext - a.ext);
      if (cands[0]) cands[0].c.px.forEach((j) => (weapon[j] = 1));
    }
    const nonW = (i) => solid[i] && !weapon[i];
    // 2. axis and leg width from the feet (bottom ~10 % of rows, weapon left out)
    const foot = []; for (let y = y1 - Math.max(1, Math.round(h * 0.1)) + 1; y <= y1; y++) for (let x = 0; x < W; x++) if (nonW(y * W + x)) foot.push(x);
    let bx0 = W, bx1 = -1; for (let i = 0; i < N; i++) if (nonW(i)) { const x = i % W; if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; }
    const fa = foot.length ? pct(foot, 0.04) : cx0, fb = foot.length ? pct(foot, 0.96) : cx0;
    // the axis: middle of the figure without its weapon (wings and capes are usually symmetric); the feet only if the figure is lopsided
    let cx = (bx0 + bx1 + 1) / 2; const fc = (fa + fb + 1) / 2; if (fc < cx - (bx1 - bx0) * 0.25 || fc > cx + (bx1 - bx0) * 0.25) cx = fc;
    const legHalf = Math.max(1.5, Math.min(Math.max(Math.abs(fa - cx), Math.abs(fb + 1 - cx)) + 0.5, (bx1 - bx0 + 1) * 0.42));
    // 3. wings / cape: colour parts that sit on BOTH sides of the figure and hardly in the middle (≥ 4 % of it), plus everything
    //    further out than them on the same row (a wing's dark underside)
    const extra = new Uint8Array(N), bw = bx1 - bx0 + 1, nW = foot.length ? 0 : 0;
    { const st = {}; let tot = 0; for (let i = 0; i < N; i++) if (nonW(i)) { tot++; const p = part(i), dx = (i % W) + 0.5 - cx; const o = st[p] || (st[p] = { n: 0, c: 0, l: 0, r: 0, low: 0 }); o.n++; if (((i / W) | 0) >= y1 - h * 0.3) o.low++; if (dx < -bw * 0.42) o.el = 1; if (dx > bw * 0.42) o.er = 1;
        if (Math.abs(dx) <= bw * 0.15) o.c++; else if (dx < -bw * 0.22) o.l++; else if (dx > bw * 0.22) o.r++; }
      const wingParts = new Set(Object.keys(st).filter((p) => { const o = st[p]; return o.n >= tot * 0.04 && o.c / o.n <= 0.25 && o.l / o.n >= 0.2 && o.r / o.n >= 0.2 && o.low / o.n <= 0.15 && o.el && o.er; }).map(Number));
      if (info.extraParts) info.extraParts.forEach((p) => wingParts.add(p));
      meta.wingParts = [...wingParts];
      if (wingParts.size) {
        const inner = [new Float32Array(H).fill(1e9), new Float32Array(H).fill(1e9)];
        for (let i = 0; i < N; i++) if (nonW(i) && wingParts.has(part(i))) { const dx = (i % W) + 0.5 - cx, y = (i / W) | 0; if (Math.abs(dx) > bw * 0.12) { const sd = dx < 0 ? 0 : 1; inner[sd][y] = Math.min(inner[sd][y], Math.abs(dx)); } }
        for (const arr of inner) { const src = arr.slice(); for (let y = 0; y < H; y++) if (src[y] >= 1e9) { for (let k = 1; k <= Math.max(3, Math.round(h * 0.2)); k++) { if (y - k >= 0 && src[y - k] < 1e9) { arr[y] = src[y - k]; break; } if (y + k < H && src[y + k] < 1e9) { arr[y] = src[y + k]; break; } } } }
        for (let i = 0; i < N; i++) if (nonW(i)) { const dx = (i % W) + 0.5 - cx, y = (i / W) | 0; if (Math.abs(dx) >= inner[dx < 0 ? 0 : 1][y] && Math.abs(dx) > bw * 0.12) extra[i] = 1; }
        // never the feet: the bottom 12 % stays body
        for (let y = y1 - Math.round(h * 0.12) + 1; y <= y1; y++) for (let x = 0; x < W; x++) extra[y * W + x] = 0;
      } }
    const coreHalf = Math.max(legHalf * 1.6 + 1, W * 0.14);
    const free = (i) => nonW(i) && !extra[i];
    // 4. legs: bottom ~30–35 %, split row by row through the gap between them
    const L0 = Math.floor(cx - legHalf - 1), L1 = Math.ceil(cx + legHalf + 1), split = new Float32Array(H).fill(cx);
    const gapRun = (y, near) => { let best = null; for (let x = Math.max(L0 + 1, 0); x < Math.min(L1, W); x++) { if (free(y * W + x)) continue;
        let e = x; while (e + 1 < W && !free(y * W + e + 1) && e + 1 < L1) e++;
        let l = false, rr = false; for (let k = x - 1; k >= Math.max(0, L0); k--) if (free(y * W + k)) { l = true; break; } for (let k = e + 1; k <= Math.min(W - 1, L1); k++) if (free(y * W + k)) { rr = true; break; }
        const c = (x + e + 1) / 2; if (l && rr && Math.abs(c - cx) <= legHalf * 0.75 && (!best || Math.abs(c - near) < Math.abs(best - near))) best = c; x = e; }
      return best; };
    let top = -1, misses = 0, near = cx;
    const jump = Math.max(2, Math.round(W / 16));
    for (let y = y1; y >= y1 - Math.round(h * 0.55); y--) { let c = gapRun(y, near); if (c !== null && top >= 0 && Math.abs(c - near) > jump) c = null; if (c !== null) { top = y; split[y] = c; near = c; misses = 0; } else if (top >= 0) { if (++misses > 1) break; split[y] = near; } else if (++misses > 3) break; else split[y] = cx; }
    let legTop = top >= 0 ? top : y1 - Math.round(h * 0.32) + 1;
    legTop = Math.max(y1 - Math.round(h * 0.4) + 1, Math.min(y1 - Math.round(h * 0.25) + 1, legTop));
    for (let y = legTop; y <= y1; y++) if (!split[y]) split[y] = cx;
    for (let y = legTop; y <= y1; y++) for (let x = Math.max(0, L0); x <= Math.min(W - 1, L1); x++) extra[y * W + x] = 0; // the legs are never wings
    for (let y = legTop - 1; y >= 0; y--) split[y] = split[legTop];
    meta.legGap = top >= 0;
    // 5. head: above the narrowest row (the neck) in the upper half; no narrowing → top 30 %
    const width = (y) => { let c = 0; for (let x = 0; x < W; x++) { const i = y * W + x; if (free(i) && Math.abs(x + 0.5 - cx) <= coreHalf) c++; } return c; };
    let neck = -1, best = 1e9, maxAbove = 0;
    for (let y = y0; y <= y0 + Math.round(h * 0.5); y++) { const w = width(y);
      if (y >= y0 + Math.round(h * 0.15) && w > 0 && w <= maxAbove * 0.85 && w < best) { best = w; neck = y; }
      maxAbove = Math.max(maxAbove, w); }
    if (neck < 0) neck = y0 + Math.round(h * 0.3);
    if (info.headParts) { let lowest = -1; for (let i = 0; i < N; i++) if (solid[i] && info.headParts.has(part(i))) lowest = Math.max(lowest, (i / W) | 0); if (lowest > y0) neck = Math.max(neck, Math.min(lowest + 1, y0 + Math.round(h * 0.55))); }
    // 5b. winged figures: the head is only the central run (rows where the helm stands free of the wings set its width);
    //     the rest of the head rows is wing
    let headHalf = 1e9;
    if (meta.wingParts && meta.wingParts.length) { const halfs = [];
      for (let y = y0; y < neck; y++) { let r0 = -1, r1 = -1, bd = 1e9;
        for (let x = 0; x < W; x++) { if (!solid[y * W + x] || weapon[y * W + x]) continue; let e = x; while (e + 1 < W && solid[y * W + e + 1] && !weapon[y * W + e + 1]) e++;
          const d = cx >= x && cx <= e + 1 ? 0 : Math.min(Math.abs(x - cx), Math.abs(e + 1 - cx)); if (d < bd) { bd = d; r0 = x; r1 = e; } x = e; }
        if (r0 < 0 || bd > 1) continue;
        const free0 = r0 > 0 && !solid[y * W + r0 - 1], free1 = r1 < W - 1 && !solid[y * W + r1 + 1];
        if (free0 && free1 && !extra[y * W + r0] && !extra[y * W + r1]) halfs.push(Math.max(cx - r0, r1 + 1 - cx)); }
      halfs.sort((a2, b2) => a2 - b2);
      headHalf = halfs.length ? halfs[halfs.length >> 1] * 1.2 + 0.5 : coreHalf * 0.5; meta.headHalf = headHalf; }
    // 6. label. Arms: in the rows between neck and legs, separate side pieces, or the outer ~18 % of the torso row
    const armMax = Math.max(1, Math.round(W / 16));
    for (let i = 0; i < N; i++) { if (!solid[i]) continue; const x = i % W, y = (i / W) | 0;
      if (weapon[i]) { reg[i] = WEAPON; continue; }
      if (extra[i]) { reg[i] = EXTRA; continue; }
      if (y < neck) { reg[i] = Math.abs(x + 0.5 - cx) > headHalf ? EXTRA : HEAD; continue; }
      const legPx = info.legParts ? info.legParts.has(part(i)) && y >= neck + 2 : y >= legTop && x >= L0 && x <= L1;
      if (legPx) { reg[i] = x + 0.5 < split[y] ? LEGL : LEGR; continue; }
    }
    const armRows = [neck + (h >= 40 ? 2 : 1), legTop + Math.round(h * 0.1)];
    for (let y = armRows[0]; y < Math.min(H, armRows[1]); y++) {
      const runs = []; for (let x = 0; x < W; x++) { const i = y * W + x; if (!free(i) || reg[i]) continue; let e = x; while (e + 1 < W && free(y * W + e + 1) && !reg[y * W + e + 1]) e++; runs.push([x, e]); x = e; }
      if (!runs.length) continue;
      const mid = runs.reduce((b, r) => (Math.abs((r[0] + r[1] + 1) / 2 - cx) < Math.abs((b[0] + b[1] + 1) / 2 - cx) ? r : b), runs[0]);
      runs.forEach((r) => { const isMid = r === mid, w = r[1] - r[0] + 1, aw = isMid ? (y < legTop ? Math.min(armMax, Math.max(1, Math.round(w * 0.18))) : 0) : w;
        for (let x = r[0]; x <= r[1]; x++) { const i = y * W + x;
          if (!isMid) reg[i] = (x + 0.5 < cx ? ARML : ARMR);
          else if (x < r[0] + aw) reg[i] = ARML; else if (x > r[1] - aw) reg[i] = ARMR; else if (y < legTop) reg[i] = BODY; } }); }
    for (let i = 0; i < N; i++) if (solid[i] && !reg[i] && ((i / W) | 0) < legTop) reg[i] = BODY;
    // leftovers take the nearest labelled neighbour
    for (let pass = 0; pass < W + H; pass++) { let left = 0; const nx = reg.slice();
      for (let i = 0; i < N; i++) if (solid[i] && !reg[i]) { const x = i % W, y = (i / W) | 0; let v = 0;
        for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && reg[Y * W + X]) { v = reg[Y * W + X]; break; } }
        if (v) nx[i] = v; else left++; }
      reg.set(nx); if (!left) break; }
    Object.assign(meta, { cx, legTop, neck, splitX: split[y1], legHalf, coreHalf });
    return { reg, meta };
  }
  function trunkOf(solid, W, H, r) { // opening: erode by r (square), keep the biggest piece, grow back by r inside the silhouette
    const S = (a, x, y) => x >= 0 && y >= 0 && x < W && y < H && a[y * W + x];
    const er = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!solid[y * W + x]) continue; let ok = true;
      for (let dy = -r; dy <= r && ok; dy++) for (let dx = -r; dx <= r; dx++) if (!S(solid, x + dx, y + dy)) { ok = false; break; } if (ok) er[y * W + x] = 1; }
    const { comps } = components(er, W, H, false); const big = comps.sort((a, b) => b.px.length - a.px.length)[0];
    const core = new Uint8Array(W * H); if (big) big.px.forEach((j) => (core[j] = 1));
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!solid[y * W + x]) continue;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (S(core, x + dx, y + dy)) { out[y * W + x] = 1; dy = r + 1; break; } }
    return out;
  }
  function thinNear(thin, W, H, x, y) { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && thin[Y * W + X]) return true; } return false; }

  // The weapon follows the arm that touches it most (else the nearer side, else the body).
  function weaponArm(reg, W, H) {
    let a = 0, b = 0, wx = 0, wn = 0, ax = [0, 0, 0, 0, 0], an = [0, 0, 0, 0, 0];
    for (let i = 0; i < W * H; i++) { const x = i % W, y = (i / W) | 0;
      if (reg[i] === ARML || reg[i] === ARMR) { ax[reg[i]] += x; an[reg[i]]++; }
      if (reg[i] !== WEAPON) continue; wx += x; wn++;
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const r = reg[Y * W + X]; if (r === ARML) a++; if (r === ARMR) b++; } }
    if (!wn) return 0; if (a || b) return a >= b ? ARML : ARMR;
    if (!an[ARML] && !an[ARMR]) return BODY;
    const m = wx / wn, dl = an[ARML] ? Math.abs(ax[ARML] / an[ARML] - m) : 1e9, dr = an[ARMR] ? Math.abs(ax[ARMR] / an[ARMR] - m) : 1e9;
    return dl <= dr ? ARML : ARMR;
  }

  // phase: c1 contact A · p1 passing A (left leg up) · c2 contact B · p2 passing B (right leg up); "h" = half step (6-frame), "bob" = bob only
  const PHASES = { four: ["c1", "p1", "c2", "p2"], six: ["c1", "p1h", "p1", "c2", "p2h", "p2"], bob: ["c1", "bob"] };
  function offsets(phase, view) {
    const o = {}; for (let r = 1; r <= 8; r++) o[r] = [0, 0];
    const bobOf = (p) => (p === "p1" || p === "p2" || p === "bob" ? -1 : 0);
    const prev = { c1: "p2", p1h: "c1", p1: "c1", c2: "p1", p2h: "c2", p2: "c2", bob: "c1" }[phase];
    const bob = bobOf(phase);
    o[BODY] = [0, bob]; o[HEAD] = [0, bob];
    o[EXTRA] = [0, bobOf(prev)]; // wings / cape lag one frame
    const upL = phase === "p1" || phase === "p1h", upR = phase === "p2" || phase === "p2h";
    if (view === "side") {
      // facing right: the right-hand leg is the front leg. Contact = stride (front +1, back −1), passing = lifted leg under the body
      if (phase === "c1") { o[LEGR] = [1, 0]; o[LEGL] = [-1, 0]; o[ARMR] = [-1, 0]; o[ARML] = [1, 0]; }
      if (phase === "c2") { o[LEGR] = [-1, 0]; o[LEGL] = [1, 0]; o[ARMR] = [1, 0]; o[ARML] = [-1, 0]; }
      if (upL) { o[LEGL] = [0, -1]; o[LEGR] = [0, 0]; o[ARML] = [0, bob]; o[ARMR] = [0, bob]; }
      if (upR) { o[LEGR] = [0, -1]; o[LEGL] = [0, 0]; o[ARML] = [0, bob]; o[ARMR] = [0, bob]; }
    } else {
      // front / back: the lifted leg rises 1 px with the body; the arm on the other side swings (stays 1 px lower)
      if (upL) { o[LEGL] = [0, -1]; o[ARML] = [0, bob]; o[ARMR] = [0, bob + 1]; }
      if (upR) { o[LEGR] = [0, -1]; o[ARMR] = [0, bob]; o[ARML] = [0, bob + 1]; }
      if (phase === "bob") { o[ARML] = [0, bob]; o[ARMR] = [0, bob]; o[LEGL] = [0, 0]; o[LEGR] = [0, 0]; }
    }
    return o;
  }
  // opts: { view: "front" | "side", include: [regions to draw] (default all), weaponBehind: bool (mirrored side view: weapon stays in the same hand, so it goes behind the body) }
  function walkFrame(img, reg, W, H, phase, opts = {}) {
    const N = W * H, out = new Uint8Array(N), owner = new Uint8Array(N), o = offsets(phase, opts.view || "front");
    const wa = weaponArm(reg, W, H); if (wa) o[WEAPON] = o[wa].slice();
    const inc = opts.include ? new Set(opts.include) : null, use = (r) => !inc || inc.has(r);
    const behind = opts.weaponBehind ? [WEAPON, wa === ARML || wa === ARMR ? wa : 0] : [];
    const order = [EXTRA].concat(behind.filter(Boolean), opts.view === "side" ? [LEGL, LEGR] : [LEGL, LEGR], [BODY, HEAD, ARML, ARMR, WEAPON].filter((r) => !behind.includes(r)));
    for (const r of order) { if (!use(r)) continue; const [dx, dy] = o[r];
      for (let i = 0; i < N; i++) { if (reg[i] !== r || !img[i]) continue; const X = (i % W) + dx, Y = ((i / W) | 0) + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        const k = Y * W + X; out[k] = img[i]; owner[k] = r; } }
    // unlabelled solid pixels (shouldn't happen) stay with the body
    if (!inc) for (let i = 0; i < N; i++) if (img[i] && !reg[i]) { const [dx, dy] = o[BODY], X = (i % W) + dx, Y = ((i / W) | 0) + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && !out[Y * W + X]) out[Y * W + X] = img[i]; }
    // fill 1 px cracks the moves opened (between body and the planted leg, at shoulders) from the original picture
    const solidOut = (x, y) => x >= 0 && y >= 0 && x < W && y < H && out[y * W + x];
    for (let pass = 0; pass < 2; pass++) { const fill = []; // 2 passes: a crack next to a crack fills on the second
      for (let i = 0; i < N; i++) { if (out[i] || !img[i]) continue; const x = i % W, y = (i / W) | 0;
        if (!use(reg[i])) continue;
        if ((solidOut(x - 1, y) && solidOut(x + 1, y)) || (solidOut(x, y - 1) && solidOut(x, y + 1))) fill.push(i); }
      if (!fill.length) break; fill.forEach((i) => (out[i] = img[i])); }
    return out;
  }
  const API = { REGIONS, HEAD, BODY, ARML, ARMR, LEGL, LEGR, WEAPON, EXTRA, PHASES, guess, walkFrame, weaponArm, offsets, thinMask };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else window.BodyMap = API;
})();
