/* Effect Designer v3 mock: pixel renderer. Whole pixels, ramp-stepped colours, 30 ms pose grid.
   Draws one flat "resolved" effect (the editor flattens layers before this, as the EA ruled). */
(function () {
  'use strict';
  /* CEO-approved effect ramps from ux/design-notes/effect-ramps/ramps.json
     sha 700f5e13903d. Day = btf-ashroad@3, night = btf-moonlit@4.
     Terrain stops come from that file; bloom is a mock-only effect ramp
     (not one of the CN-019 keys). */
  const BLOOM = { ashroad: ['#3a1838', '#7a2e72', '#c25aa8', '#f0a0d8', '#ffe2f4'], moonlit: ['#1c1838', '#4a3670', '#7a2e72', '#c25aa8', '#f0d0ea'] };
  const STYLES = {
    ashroad: {
      fire:  ["#3a0f1e", "#7c1a16", "#c4400f", "#ee7c1a", "#ffc53d", "#fff6d2"],
      frost: ["#0c1c3e", "#173a78", "#2270b2", "#44b4e2", "#9ee4f6", "#ecfbff"],
      holy:  ["#2e2250", "#6a4880", "#c88a2c", "#ecc650", "#faeab2", "#fffdf3"],
      venom: ["#26163c", "#22502e", "#3c8424", "#78bc20", "#bee63a", "#effa9c"],
      grass: ["#353b14", "#474e1b", "#5a6323", "#6b7432", "#7f8640", "#9aa055"],
      dirt:  ["#4d431f", "#6c592f", "#86653c", "#977244", "#a6804f", "#bc9866"],
      stone: ["#4e3c22", "#674e2a", "#83643d", "#967750", "#ad9474", "#c4b092"],
      rock:  ["#4a3f30", "#6b5c46", "#8a7a62", "#a89880", "#c4b69c"],
      water: ["#123040", "#184658", "#1f5f6e", "#2c7a84", "#4c9ea0", "#a6d8cf"],
      bloom: BLOOM.ashroad
    },
    moonlit: {
      fire:  ["#200a24", "#5c1428", "#a8301c", "#e2661e", "#ffb440", "#ffefc4"],
      frost: ["#06122e", "#0e2a62", "#1c56a6", "#2e96d4", "#78d6f2", "#dcf6ff"],
      holy:  ["#1c1838", "#4a3670", "#ae8030", "#dcba52", "#f2e4a8", "#fffaea"],
      venom: ["#160c28", "#183c24", "#2a6428", "#4c9a24", "#94d43a", "#daf28a"],
      grass: ["#071118", "#0c1d22", "#13282a", "#1d3532", "#2b4a3e", "#3f6650"],
      dirt:  ["#0d1417", "#172022", "#232520", "#332f28", "#47423a", "#5c5648"],
      stone: ["#07030b", "#0c1a28", "#132230", "#1c2a38", "#26384a", "#3a4e62"],
      rock:  ["#0a1428", "#1e2c2e", "#353a3a", "#4f5656", "#6c7474"],
      water: ["#06101c", "#0a1a2c", "#10283e", "#183a56", "#2a5e7e", "#7fc4d8"],
      bloom: BLOOM.moonlit
    }
  };
  const STYLE_ID = { ashroad: 'btf-ashroad@3', moonlit: 'btf-moonlit@4' };
  let STYLE = 'ashroad';
  let RAMPS = STYLES.ashroad;
  const RAMP_LABEL = { fire: 'Fire', frost: 'Frost', holy: 'Holy', venom: 'Venom', grass: 'Grass', water: 'Water', stone: 'Stone', bloom: 'Bloom', dirt: 'Dirt', rock: 'Rock' };
  const POSE_MS = 30, GAP_MS = 520;

  function mulberry(seed) {
    let a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, f) { return a.map((v, i) => Math.round(v + (b[i] - v) * f)); }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const BOARD_DAY = { a: hex('#4d525f'), b: hex('#575d6b'), line: hex('#444955') };
  const BOARD_NIGHT = { a: hex('#0c1a28'), b: hex('#132230'), line: hex('#1c2a38') };
  let BOARD = BOARD_DAY;
  function setStyle(id) {
    STYLE = STYLES[id] ? id : 'ashroad';
    RAMPS = STYLES[STYLE];
    BOARD = STYLE === 'moonlit' ? BOARD_NIGHT : BOARD_DAY;
    if (window.FXR) { window.FXR.RAMPS = RAMPS; window.FXR.STYLE = STYLE; window.FXR.STYLE_ID = STYLE_ID[STYLE]; }
  }

  /* ---------- timeline ---------- */
  function timeline(R) {
    const order = ['cast', 'travel', 'hit', 'linger'];
    const si = order.indexOf(R.start || 'cast');
    const t = {}; let acc = 0;
    order.forEach((b, i) => {
      const d = i < si ? 0 : Math.max(0, R.dur[b] || 0);
      t[b] = { s: acc, d }; acc += d;
    });
    t.hitAt = t.hit.s; t.stop = R.punch.level * 40; t.total = acc + t.stop + GAP_MS;
    return t;
  }
  function beatAt(T, ms) {
    if (ms >= T.hitAt && ms < T.hitAt + T.stop) return 'hit';
    const m = ms >= T.hitAt + T.stop ? ms - T.stop : ms;
    for (const b of ['cast', 'travel', 'hit', 'linger']) if (m >= T[b].s && m < T[b].s + T[b].d) return b;
    return null;
  }

  /* ---------- board ---------- */
  function lightRings(light) {
    const ramp = RAMPS[light.ramp] || RAMPS.fire;
    const lr = hex(ramp[ramp.length - 1]); // light uses the lightest step
    // soft falloff in whole-pixel rings (not a flat disc)
    const rings = [0.22, 0.40, 0.58, 0.74, 0.88, 1];
    const amts = [0.55, 0.40, 0.28, 0.18, 0.11, 0.05];
    return {
      x: light.x, y: light.y, r: light.r,
      rings: rings.map((s, i) => ({ s, a: mix(BOARD.a, lr, amts[i]), b: mix(BOARD.b, lr, amts[i]), line: mix(BOARD.line, lr, amts[i] * .7) }))
    };
  }
  function drawBoard(ctx, G, R, T, ms, lights) {
    const W = G.W, H = G.H, img = ctx.createImageData(W, H), d = img.data;
    const list = !lights ? [] : (Array.isArray(lights) ? lights : [lights]);
    const Ls = list.filter(Boolean).map(lightRings);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const tx = Math.floor(x / G.tile), ty = Math.floor((y + G.tileOff) / G.tile);
      const odd = (tx + ty) & 1; let c = odd ? BOARD.a : BOARD.b;
      if ((x % G.tile === 0) || ((y + G.tileOff) % G.tile === 0)) c = BOARD.line;
      for (let li = 0; li < Ls.length; li++) {
        const L = Ls[li];
        const dx = (x - L.x), dy = (y - L.y) * 1.6, dd = dx * dx + dy * dy;
        for (let k = 0; k < L.rings.length; k++) {
          const rad = L.r * L.rings[k].s;
          if (dd <= rad * rad) {
            const isLine = (x % G.tile === 0) || ((y + G.tileOff) % G.tile === 0);
            c = isLine ? L.rings[k].line : (odd ? L.rings[k].a : L.rings[k].b);
            break;
          }
        }
      }
      const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------- units ---------- */
  const KNIGHT = [
    '..0000..', '.011110.', '.0122100'.slice(0, 8), '.0133100'.slice(0, 8), '..0110..', '.022220.', '02222220', '02233220',
    '.022220.', '.022220.', '.04..40.', '.44..44.'];
  const KCOL = { 0: '#1b1f2a', 1: '#c9d3e6', 2: '#3d63c9', 3: '#f2c38f', 4: '#2a2f3d' };
  const DUMMY = ['..0000..', '.055550.', '.056650.', '..0550..', '0555555.', '.055550.', '..0550..', '.055550.', '.05..50.', '.05..50.', '.00..00.', '........'];
  const DCOL = { 0: '#2b2118', 5: '#b98a52', 6: '#7a5836' };
  function drawUnit(ctx, map, cols, x, feetY, sc, white, squash, flip) {
    const h = map.length, w = 8, step = sc < 1 ? 2 : 1;
    for (let r = 0; r < h; r += step) for (let c = 0; c < w; c += step) {
      const ch = map[r][flip ? w - 1 - c : c]; if (ch === '.' || ch === undefined) continue;
      ctx.fillStyle = white ? (ch === '0' ? '#2b2118' : '#ffffff') : cols[ch];
      const px = x - (w * sc) / 2 + Math.floor(c * sc), py = feetY - Math.round(h * sc) + Math.floor(r * sc) + (squash ? 1 : 0);
      ctx.fillRect(Math.round(px), Math.round(py), Math.max(1, Math.ceil(sc)) + (squash && c === 0 ? 1 : 0), Math.max(1, Math.ceil(sc)));
    }
  }

  /* ---------- effect pixels ---------- */
  function painter(ctx, ps) {
    return function put(x, y, col, w, h) {
      const X = Math.floor(x / ps) * ps, Y = Math.floor(y / ps) * ps;
      ctx.fillStyle = col; ctx.fillRect(X, Y, (w || 1) * ps, (h || 1) * ps);
    };
  }
  function rampCol(key, bright) {
    const r = RAMPS[key] || RAMPS.fire;
    const last = r.length - 1;
    // callers still pass 0–4; stretch onto this style's stop count (6 for approved effect ramps)
    return i => r[clamp(Math.round((i + (bright || 0)) * last / 4), 0, last)];
  }
  function ellipsePts(cx, cy, rx, ry, n, fn) {
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; fn(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, k); }
  }
  function drawPiece(put, P, G, p, col, rnd, frame) {
    const s = P.size * G.fx, hx = G.cx + 4 * G.unit, hy = G.gy - 8 * G.unit, tx = G.tx, ty = G.gy - 6 * G.unit;
    switch (P.kind) {
      case 'gather': {
        const n = 14; for (let k = 0; k < n; k++) {
          const a = k / n * Math.PI * 2 + k, r = (1 - p) * 20 * s + 1;
          put(hx + Math.cos(a) * r, hy + Math.sin(a) * r * .8, col(k % 2 ? 3 : 2)); put(hx + Math.cos(a) * (r + 2), hy + Math.sin(a) * (r + 2) * .8, col(1));
        }
        const c = 1 + Math.floor(p * 3 * P.size); put(hx - c / 2, hy - c / 2, col(4), c, c); break;
      }
      case 'rune': {
        const rx = 11 * s, ry = 4 * s, off = Math.floor(p * 12);
        ellipsePts(G.cx, G.gy, rx, ry, 24, (x, y, k) => { if ((k + off) % 3) put(x, y, col(k % 6 === 0 ? 4 : 2)); });
        if (p > .5) put(hx - 1, hy - 1, col(4), 2, 2); break;
      }
      case 'flare': {
        for (let k = -1; k <= 1; k++) { const len = Math.floor(p * 14 * s) - Math.abs(k) * 3; for (let j = 0; j < len; j++) put(hx + k * 3, hy - j, col(j > len - 3 ? 4 : j > len - 7 ? 3 : 2)); }
        break;
      }
      case 'path': { // static travel path: effects can't fly yet
        const x0 = hx, y0 = hy, x1 = tx - 4, y1 = ty, cxp = (x0 + x1) / 2, cyp = Math.min(y0, y1) - 6 - P.bend * 16 * G.fx;
        const N = Math.floor((x1 - x0) / 2.5);
        for (let k = 0; k <= N; k++) {
          if (k % 2) continue; const u = k / N, x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cxp + u * u * x1, y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cyp + u * u * y1;
          put(x, y, col(k % 6 === 0 ? 4 : 2));
        }
        const u = .5, mx = .25 * x0 + .5 * cxp + .25 * x1, my = .25 * y0 + .5 * cyp + .25 * y1;
        if (P.glyph === 'orb') { put(mx - 1, my - 1, col(1), 3, 3); put(mx, my, col(4)); }
        else if (P.glyph === 'bolt') { put(mx - 2, my, col(3), 4, 1); put(mx + 2, my, col(4)); }
        else { put(mx - 1, my - 2, col(3)); put(mx, my - 1, col(4)); put(mx, my, col(4)); put(mx - 1, my + 1, col(3)); }
        break;
      }
      case 'arc': {
        const r = 16 * s, a0 = -2.3, a1 = a0 + Math.min(1, p * 1.6) * 3.6, n = Math.max(8, Math.floor(r * 4));
        for (let k = 0; k <= n; k++) {
          const a = a0 + (a1 - a0) * (k / n), lead = k / n;
          const th = Math.max(1, Math.round(3.2 * P.size * Math.sin(lead * Math.PI) * (1 - Math.max(0, p - .62) * 2.2)));
          for (let j = 0; j < th; j++) put(tx + Math.cos(a) * (r - j), ty + Math.sin(a) * (r - j) * .75, col(lead > .85 ? 4 : lead > .45 ? 3 : 2));
        }
        break;
      }
      case 'ring': {
        const r = 2 + p * 18 * s; const n = Math.max(10, Math.floor(r * 6));
        ellipsePts(tx, ty, r, r * .8, n, (x, y) => put(x, y, col(p < .35 ? 4 : p < .7 ? 3 : 2)));
        if (p < .7) ellipsePts(tx, ty, r - 1.5, (r - 1.5) * .8, n, (x, y) => put(x, y, col(p < .35 ? 3 : 2)));
        if (p < .3) put(tx - 2, ty - 2, col(4), 5, 5); break;
      }
      case 'star': {
        const len = Math.min(1, p * 1.8) * 17 * s * (1 - Math.max(0, p - .7));
        for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, L = k % 2 ? len * .55 : len; for (let j = 1; j < L; j++) put(tx + Math.cos(a) * j, ty + Math.sin(a) * j, col(j < L * .4 ? 4 : j < L * .8 ? 3 : 2)); }
        put(tx - 2, ty - 2, col(4), 5, 5); break;
      }
      case 'pillar': {
        const w = Math.max(3, Math.round(5 * P.size * (1 - Math.max(0, p - .6)))), top = 0, bot = G.gy, fall = Math.min(1, p / .3);
        const yEnd = top + (bot - top) * fall;
        for (let y = top; y < yEnd; y += 1) { put(tx - w / 2 - 1, y, col(2)); put(tx - w / 2, y, col(p > .8 ? 3 : 4), w, 1); put(tx + w / 2, y, col(2)); }
        if (fall >= 1) for (let k = -6; k <= 6; k += 2) put(tx + k * s, bot - 1, col(3));
        break;
      }
      case 'cross': {
        const L = Math.floor(Math.min(1, p * 1.7) * 14 * s) + 1, w = Math.max(2, Math.round(P.size * 3));
        put(tx - L, ty - Math.floor(w / 2), col(2), L * 2 + 1, w); put(tx - Math.floor(w / 2), ty - L, col(2), w, L * 2 + 1); put(tx - L + 2, ty, col(4), L * 2 - 3, 1); put(tx, ty - L + 2, col(4), 1, L * 2 - 3);
        put(tx - 1, ty - 1, col(4), 3, 3); break;
      }
      case 'scorch': {
        const rx = 11 * s * (1 - p * .4), ry = 3.2 * s;
        for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
          if ((x * x) / (rx * rx) + (y * y) / (ry * ry) > 1) continue;
          if (((x + y) & 1) === 0) put(G.ltx(P) + x, G.gy + y, col(0));
        }
        for (let k = 0; k < 5; k++) { const r2 = rnd(k, frame); if (r2 > .55) put(G.ltx(P) + (rnd(k + 9, 0) - .5) * rx * 2, G.gy - 1, col(3)); }
        break;
      }
      case 'embers': {
        for (let k = 0; k < 12; k++) {
          const ph = (p + k / 12) % 1, x = G.ltx(P) + (rnd(k, 0) - .5) * 20 * s + Math.sin(ph * 6 + k) * 1.5, y = G.gy - ph * 22 * s;
          put(x, y, col(ph < .3 ? 4 : ph < .7 ? 3 : 1));
        }
        break;
      }
      case 'lring': {
        const r = 8 + p * 9 * s; ellipsePts(G.ltx(P), G.gy, r, r * .34, 34, (x, y, k) => { if (k % 2 === 0) put(x, y, col(p < .5 ? 3 : 1)); });
        break;
      }
      case 'motes': {
        for (let k = 0; k < 6; k++) { const a = p * 3 + k / 6 * Math.PI * 2; put(G.ltx(P) + Math.cos(a) * 13 * s, ty + Math.sin(a) * 5 * s - p * 6, col(k % 2 ? 4 : 3), 2, 2); }
        break;
      }
    }
  }

  function drawSparks(put, S, G, age, col, seed, trailLen, idx) {
    if (age < 0 || S.n <= 0) return;
    const rnd = mulberry((seed ^ (idx * 0x9E37)) >>> 0), tx = G.tx, ty = G.gy - 6 * G.unit;
    for (let i = 0; i < S.n; i++) {
      const a = rnd() * Math.PI * 2, v = (.5 + rnd() * .8) * 26 * G.fx, life = S.life * (.6 + rnd() * .4);
      const u = age / life; if (u > 1) continue;
      const pos = (uu) => {
        if (S.pull > 0) { const r = (1 - uu) * v * (.6 + S.pull * .6); return [tx + Math.cos(a) * r, ty + Math.sin(a) * r * .8]; }
        const r = uu * v * (1 + -S.pull * .6); return [tx + Math.cos(a) * r, ty + Math.sin(a) * r * .8 + uu * uu * 6 * G.fx];
      };
      const [x, y] = pos(u);
      for (let k = Math.min(2, Math.floor(trailLen / 3)); k >= 1; k--) { const [x2, y2] = pos(Math.max(0, u - k * .08)); put(x2, y2, col(1)); }
      if (u < .2 && G.fx >= 1) put(x, y, col(4), 2, 2); else put(x, y, col(u < .25 ? 4 : u < .55 ? 3 : u < .8 ? 2 : 1));
    }
  }

  /* draw(ctx, G, R, ms, opts) — ms is time inside the loop */
  function draw(ctx, G, R, ms, opts) {
    opts = opts || {};
    const T = timeline(R); ms = ((ms % T.total) + T.total) % T.total;
    ms = Math.floor(ms / POSE_MS) * POSE_MS;
    // hit-stop: freeze effect time during [hitAt, hitAt+stop)
    let fxms = ms; const inStop = ms >= T.hitAt && ms < T.hitAt + T.stop;
    if (inStop) fxms = T.hitAt; else if (ms >= T.hitAt + T.stop) fxms = ms - T.stop;
    const frame = Math.floor(ms / POSE_MS);
    const seed = R.seed >>> 0;
    const rnd = (k, f) => { const r = mulberry((seed + k * 7919 + f * 104729) >>> 0); return r(); };
    // shake (whole px, inside the strip only)
    let sx = 0, sy = 0;
    if (R.punch.shake > 0 && ms >= T.hitAt && ms < T.hitAt + T.stop + 210) {
      const dec = 1 - (ms - T.hitAt) / (T.stop + 210), amp = R.punch.shake * dec * dec * G.fx;
      sx = Math.round((rnd(1, frame) - .5) * 2 * amp); sy = Math.round((rnd(2, frame) - .5) * 2 * amp * .6);
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, G.W, G.H); ctx.translate(sx, sy);
    // light: one or two sources, pop has a soft pixel-ring falloff (not a flat disc)
    const lightSrc = (R.lights && R.lights.length) ? R.lights : (R.light ? [R.light] : []);
    const lights = [];
    const ty = G.gy - 6 * G.unit, end = T.linger.s + T.linger.d;
    lightSrc.forEach((L, li) => {
      if (!L || L.mode === 'off') return;
      if (fxms >= T.hitAt) {
        const since = fxms - T.hitAt;
        let r = L.radius * G.tile * .72;
        if (L.mode === 'pop') r = r * (since < 120 ? 1.2 : Math.max(.38, 1 - since / Math.max(400, end - T.hitAt)));
        if (fxms < end) lights.push({ x: G.tx + (li ? 3 : 0), y: ty, r: Math.round(r / 2) * 2, ramp: L.ramp });
      } else if (L.mode === 'steady' && fxms >= T.cast.s && T.cast.d > 0) {
        lights.push({ x: G.cx + 4 * G.unit + (li ? 3 : 0), y: G.gy - 8 * G.unit, r: G.tile * .9, ramp: L.ramp });
      }
    });
    drawBoard(ctx, G, R, T, fxms, lights);
    const put = painter(ctx, R.ps || 1);
    const beat = beatAt(T, ms);
    // living linger: copies on neighbour tiles (visual only)
    const lingerTiles = [0];
    if (R.living) { for (let k = 1; k <= R.living; k++) lingerTiles.push(k % 2 ? -Math.ceil(k / 2) : Math.ceil(k / 2)); }
    // linger pieces sit behind units
    const drawBeatPieces = (b, layerFront) => {
      const tb = T[b]; if (!tb.d) return;
      let p = (fxms - tb.s) / tb.d;
      if (opts.forceBeat === b) p = .55;
      if (p < 0 || p >= 1) return;
      R.pieces.filter(P => P.beat === b).forEach(P => {
        const col = rampCol(P.ramp, P.bright);
        if (b === 'linger') {
          lingerTiles.forEach((tt, i) => {
            const delay = i * .12; const pp = (p - delay) / (1 - delay); if (pp < 0) return;
            const Q = Object.assign({}, P, { _lt: tt });
            drawPiece(put, Q, G, pp, col, rnd, frame);
          });
          return;
        }
        // trail: afterimages, stepped darker
        if (b === 'hit' && R.trail.len > 0) {
          for (let k = Math.min(R.trail.len, 8); k >= 1; k--) {
            const pp = p - k * .055; if (pp <= 0) continue;
            const darker = rampCol(P.ramp, P.bright - 1 - Math.floor(k / 3));
            drawPiece(put, P, G, pp, darker, rnd, frame);
          }
        }
        drawPiece(put, P, G, p, col, rnd, frame);
      });
    };
    G.ltx = P => G.tx + (P._lt || 0) * G.tile;
    drawBeatPieces('linger');
    if (R.fusion2) { // second caster for combo fusion
      drawUnit(ctx, KNIGHT, KCOL, G.cx + 2 * G.tile * .0 + G.tile * .6, G.gy - G.tile, G.unit, false, false, false);
    }
    const flash = R.punch.level > 0 && ms >= T.hitAt && ms < T.hitAt + T.stop + 90;
    drawUnit(ctx, KNIGHT, KCOL, G.cx, G.gy, G.unit, false, false, false);
    drawUnit(ctx, DUMMY, DCOL, G.tx, G.gy, G.unit, flash && (frame % 2 === 0 || T.stop === 0), flash && R.punch.level >= 2, true);
    ['cast', 'travel', 'hit'].forEach(b => drawBeatPieces(b));
    // sparks
    const age = (fxms - T.hitAt) / 1000;
    R.sparks.forEach((S, i) => drawSparks(put, S, G, age, rampCol(S.ramp, S.bright), seed, R.trail.len, i));
    // motes (house style)
    if (R.motes) {
      const c = rampCol(R.moteRamp, 0);
      for (let k = 0; k < 6; k++) { const ph = ((ms / 2600) + k / 6) % 1; put(G.tx + (rnd(k + 40, 0) - .5) * 30 * G.fx, G.gy - 2 - ph * 22 * G.fx, c(ph < .5 ? 3 : 2)); }
    }
    ctx.restore();
    return { beat, T, ms };
  }

  function geom(kind) {
    if (kind === 'thumb') return { W: 58, H: 32, tile: 8, tileOff: 4, cx: 11, gy: 26, tx: 44, unit: .5, fx: .55 };
    if (kind === 'mini') return { W: 58, H: 32, tile: 8, tileOff: 4, cx: 11, gy: 26, tx: 44, unit: .5, fx: .55 };
    if (kind === 'sheet') return { W: 48, H: 32, tile: 8, tileOff: 4, cx: 6, gy: 26, tx: 30, unit: .5, fx: .55 };
    return { W: 130, H: 56, tile: 16, tileOff: 4, cx: 22, gy: 46, tx: 88, unit: 1, fx: 1 };
  }

  window.FXR = { RAMPS, RAMP_LABEL, STYLES, STYLE, STYLE_ID, setStyle, draw, geom, timeline, beatAt, mulberry, POSE_MS };
})();
