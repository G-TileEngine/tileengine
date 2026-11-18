/* Effect Designer v3 mock: data model (editor side). An effect is a flat doc with 6 layers.
   Taking, blending and rolling all write ordinary values into the doc ("flatten in the editor"),
   plus editor-only provenance {effect, rev}. Nothing here is the real format; see the design note. */
(function () {
  'use strict';
  const LAYERS = ['shape', 'colour', 'sparks', 'light', 'punch', 'trail'];
  const LAYER_LABEL = { shape: 'Shape', colour: 'Colour', sparks: 'Sparks', light: 'Light', punch: 'Punch', trail: 'Trail' };
  const BEATS = ['cast', 'travel', 'hit', 'linger'];
  const BEAT_LABEL = { cast: 'Cast', travel: 'Travel', hit: 'Hit', linger: 'Linger' };
  const KINDS = ['All', 'Slash', 'Shot', 'Burst', 'Aura', 'Heal', 'Buff', 'Ground'];
  const BUDGET = { particles: 48, draws: 60, screen: 120, steps: 12, presetParticles: 32 };
  const clone = o => JSON.parse(JSON.stringify(o));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, f) => a + (b - a) * f;

  function P(id, name, kind, ramp, o) {
    return {
      id, name, kind, rev: 1,
      layers: {
        shape: { cast: o.cast || 'none', travel: o.travel || 'none', hit: o.hit || 'ring', linger: o.linger || 'none', size: o.size || 1, speed: o.speed || 1, bend: o.bend == null ? .4 : o.bend },
        colour: { ramp, bright: o.bright || 0 },
        sparks: { amount: o.sparks == null ? 16 : o.sparks, life: o.life || .55, pull: o.pull == null ? -.3 : o.pull },
        light: { mode: o.light || 'pop', radius: o.radius || 2 },
        punch: { level: o.punch == null ? 1 : o.punch, shake: o.shake || 0 },
        trail: { len: o.trail == null ? 3 : o.trail }
      },
      timing: { lingerSteps: o.steps || 2, nudge: { cast: 0, travel: 0, hit: 0, linger: 0 }, start: o.start || 'cast' },
      seed: o.seed || (id.length * 7331 + 17)
    };
  }
  const PRESETS = [
    P('fire-slash', 'Fire slash', 'Slash', 'fire', { cast: 'flare', hit: 'arc', linger: 'embers', sparks: 20, light: 'pop', radius: 2, punch: 1, trail: 4 }),
    P('venom-bite', 'Venom bite', 'Slash', 'venom', { hit: 'arc', linger: 'scorch', sparks: 12, size: 1.2, light: 'off', punch: 2, trail: 2, steps: 3 }),
    P('frost-shard', 'Frost shard', 'Shot', 'frost', { cast: 'gather', travel: 'bolt', hit: 'star', linger: 'lring', sparks: 16, light: 'steady', radius: 1, trail: 3 }),
    P('fireball', 'Fireball', 'Shot', 'fire', { cast: 'gather', travel: 'orb', hit: 'ring', linger: 'scorch', sparks: 28, light: 'pop', radius: 3, punch: 2, trail: 5, size: 1.1 }),
    P('holy-cross', 'Holy cross', 'Burst', 'holy', { cast: 'rune', hit: 'cross', linger: 'motes', sparks: 18, light: 'pop', radius: 2, trail: 2 }),
    P('thunder', 'Thunder pillar', 'Burst', 'holy', { cast: 'rune', hit: 'pillar', linger: 'lring', sparks: 24, light: 'pop', radius: 3, punch: 3, shake: 2, trail: 3, bright: 1 }),
    P('bloom-aura', 'Bloom aura', 'Aura', 'bloom', { cast: 'rune', hit: 'ring', linger: 'motes', sparks: 14, pull: .5, light: 'steady', radius: 2, punch: 0, trail: 1, speed: .8 }),
    P('mend', 'Mend', 'Heal', 'grass', { hit: 'ring', linger: 'embers', sparks: 16, pull: .6, light: 'steady', radius: 2, punch: 0, trail: 0, start: 'hit', speed: .8 }),
    P('rally', 'Rally', 'Buff', 'holy', { cast: 'flare', hit: 'star', linger: 'motes', sparks: 12, light: 'steady', radius: 1, punch: 0, trail: 1 }),
    P('quake', 'Quake', 'Ground', 'dirt', { cast: 'rune', hit: 'ring', linger: 'scorch', sparks: 22, size: 1.4, light: 'off', punch: 3, shake: 3, trail: 2, steps: 3 }),
    P('tide', 'Tide', 'Ground', 'water', { hit: 'ring', linger: 'lring', sparks: 20, pull: -.1, light: 'steady', radius: 2, punch: 1, trail: 3, steps: 3, size: 1.3 }),
    P('stone-spike', 'Stone spike', 'Ground', 'stone', { hit: 'pillar', linger: 'scorch', sparks: 14, light: 'off', punch: 2, shake: 1, trail: 1, bright: 1 })
  ];
  // ready-made looks used by experiments (not in the grid)
  const HIDDEN = [
    P('steam-burst', 'Steam burst', 'Burst', 'stone', { cast: 'gather', hit: 'star', linger: 'embers', sparks: 26, pull: -.6, light: 'pop', radius: 2, punch: 2, trail: 3, bright: 1 })
  ];
  const REACTIONS = [
    { a: 'fire', b: 'frost', name: 'Steam', apply: d => { d.layers.colour.ramp = 'stone'; d.layers.colour.bright = 1; d.layers.sparks.pull = -.7; d.layers.shape.linger = 'embers'; } },
    { a: 'venom', b: 'holy', name: 'Purge glow', apply: d => { d.layers.colour.ramp = 'holy'; d.layers.colour.bright = 1; d.layers.shape.hit = 'ring'; d.layers.light.mode = 'pop'; } },
    { a: 'fire', b: 'venom', name: 'Blight smoke', apply: d => { d.layers.colour.ramp = 'rock'; d.layers.shape.linger = 'scorch'; } }
  ];
  const HOUSE_FAMILIES = {
    asmade: { label: 'As made', style: 'ashroad', ramps: [] },
    ember: { label: 'Ember court', style: 'ashroad', ramps: ['fire', 'holy', 'dirt', 'bloom'] },
    moon: { label: 'Moonlit', style: 'moonlit', ramps: [] }, // night look: btf-moonlit@4, no key remap (fire stays fire)
    wild: { label: 'Wild', style: 'ashroad', ramps: ['venom', 'grass', 'bloom', 'holy'] }
  };
  function styleOf(house) { const f = HOUSE_FAMILIES[house && house.family]; return (f && f.style) || 'ashroad'; }
  const PALETTE = ['fire', 'frost', 'holy', 'venom', 'grass', 'water', 'stone', 'bloom', 'dirt', 'rock'];
  const HUE = { fire: 18, holy: 48, dirt: 32, bloom: 315, frost: 205, water: 210, venom: 95, stone: 225, grass: 110, rock: 30 };
  function familyRamp(ramp, fam) {
    const F = HOUSE_FAMILIES[fam]; if (!F || !F.ramps.length || F.ramps.includes(ramp)) return ramp;
    let best = F.ramps[0], bd = 999;
    F.ramps.forEach(r => { let d = Math.abs(HUE[r] - HUE[ramp]); d = Math.min(d, 360 - d); if (d < bd) { bd = d; best = r; } });
    return best;
  }

  const lib = {};
  PRESETS.concat(HIDDEN).forEach(p => { lib[p.id] = p; });

  /* ---------- resolve: doc -> flat pieces the renderer draws ---------- */
  const KIND_DRAWS = { cast: 3, travel: 2, hit: 4, linger: 3 };
  /* Tiers v1 (CN-025): only switch extra steps on. Values stay inside the caps; no value scaling. */
  function tierExtras(doc) {
    const hit = doc.layers.shape.hit, linger = doc.layers.shape.linger;
    const lv2 = linger === 'motes' ? 'lring' : 'motes';
    const lv3 = hit === 'star' ? 'ring' : (hit === 'ring' ? 'star' : 'ring');
    return [
      { min_tier: 1, beat: 'linger', kind: lv2, weight: .55, side: 'A' },
      { min_tier: 2, beat: 'hit', kind: lv3, weight: .5, side: 'A' }
    ];
  }
  function resolve(doc, ctx) {
    ctx = ctx || {}; const house = ctx.house || {}, exp = doc.exp || {};
    const L = doc.layers, sh = L.shape, col = L.colour;
    const touched = doc.touched || {};
    const rampOf = (r) => (house.family && !touched.colour && !doc.blend && !doc.breedOf) ? familyRamp(r, house.family) : r;
    const baseRamp = rampOf(col.ramp);
    const colourSteps = (col.steps && col.steps.length)
      ? col.steps.map(s => Object.assign({}, s, { ramp: rampOf(s.ramp) }))
      : [{ ramp: baseRamp, role: 'inner' }];
    const outer = colourSteps.find(s => s.role === 'outer');
    const speed = sh.speed;
    const dur = { cast: 0, travel: 0, hit: 0, linger: 0 };
    const pieces = [];
    const tier = exp.tier || 0;
    const add = (b, k, r, size, side, weight, S, C, glyph) => {
      if (!k || k === 'none') return;
      if (b === 'travel') { pieces.push({ beat: b, kind: 'path', glyph: glyph || k, ramp: r, bright: C.bright, size: size, bend: S.bend, side, weight }); return; }
      pieces.push({ beat: b, kind: k === 'ring' && b === 'linger' ? 'lring' : k, ramp: r, bright: C.bright, size: size, side, weight });
    };
    BEATS.forEach(b => {
      const srcId = doc.beatSrc && doc.beatSrc[b];
      const src = srcId && lib[srcId] ? lib[srcId] : null;
      const S = src ? src.layers.shape : sh, C = src ? src.layers.colour : col;
      const kind = S[b];
      const ramp = src ? rampOf(C.ramp) : baseRamp;
      const hasExtra = !src && sh.extra && sh.extra[b] && sh.extra[b] !== 'none' && sh.extra[b] !== kind;
      // Colour Both without a shape-B step: joined colour steps. The outer step is the rim (no rim_ramp field).
      if (!src && outer && kind && kind !== 'none' && b !== 'travel' && !hasExtra) {
        add(b, kind, outer.ramp, S.size * 1.18, 'B', .7, S, C);
      }
      add(b, kind, ramp, S.size, 'A', 1, S, C, kind);
      if (hasExtra) add(b, sh.extra[b], rampOf(sh.extra.ramp || BRamp(sh, col, rampOf)), (sh.extra.size || S.size), 'B', .7, S, { bright: C.bright }, sh.extra[b]);
      (tierExtras(doc)).forEach(ts => {
        if (ts.min_tier <= tier && ts.beat === b && ts.kind && ts.kind !== 'none' && ts.kind !== kind) {
          add(b, ts.kind, rampOf(ts.ramp || baseRamp), ts.size || S.size, ts.side || 'A', ts.weight || .5, S, C);
        }
      });
      const has = pieces.some(p => p.beat === b);
      const base = { cast: 420, travel: 360, hit: 330, linger: 240 + 150 * doc.timing.lingerSteps }[b];
      dur[b] = has || b === 'hit' ? Math.round((base / speed + (doc.timing.nudge[b] || 0)) / 30) * 30 : 0;
      if (b === 'linger' && !has) dur[b] = 150;
    });
    const sp = L.sparks, sparks = [];
    sparks.push({ n: sp.amount, life: sp.life, pull: sp.pull, ramp: rampOf(sp.ramp || col.ramp), bright: col.bright, side: 'A' });
    if (sp.extra) sparks.push({ n: sp.extra.amount, life: sp.extra.life, pull: sp.extra.pull, ramp: rampOf(sp.extra.ramp || col.ramp), bright: col.bright, side: 'B' });
    const punchLvl = touched.punch || house.punch == null ? L.punch.level : house.punch;
    const lights = [];
    if (L.light.mode !== 'off') lights.push({ mode: L.light.mode, radius: L.light.radius, ramp: rampOf(L.light.ramp || baseRamp), side: 'A' });
    if (L.light.extra && L.light.extra.mode && L.light.extra.mode !== 'off') lights.push({ mode: L.light.extra.mode, radius: L.light.extra.radius, ramp: rampOf(L.light.extra.ramp || baseRamp), side: 'B' });
    const R = {
      start: doc.timing.start, dur, pieces, sparks, lights,
      light: lights[0] || { mode: 'off', radius: 1, ramp: baseRamp },
      punch: { level: punchLvl, shake: L.punch.shake },
      trail: { len: L.trail.len },
      seed: doc.seed, ps: house.pixel === 2 ? 2 : 1, motes: !!house.motes, moteRamp: baseRamp,
      living: exp.living ? (exp.livingTiles || 4) : 0
    };
    if (exp.fusion) {
      const F = resolve(lib['steam-burst'], { house });
      R.pieces = pieces.filter(p => p.beat === 'cast').concat(F.pieces.filter(p => p.beat !== 'cast'));
      R.sparks = F.sparks; R.light = F.light; R.lights = F.lights; R.punch = F.punch; R.fusion2 = true;
      R.dur = Object.assign({}, R.dur, { travel: 0, hit: F.dur.hit, linger: F.dur.linger });
    }
    R.cost = cost(R, doc);
    return R;
  }
  function BRamp(sh, col, rampOf) { return sh.extra && sh.extra.ramp ? rampOf(sh.extra.ramp) : rampOf(col.ramp); }
  function cost(R, doc) {
    let particles = R.sparks.reduce((s, x) => s + x.n, 0) + (R.motes ? 6 : 0);
    let draws = 0; const lsteps = doc.timing.lingerSteps;
    R.pieces.forEach(p => {
      if (p.beat === 'linger') draws += KIND_DRAWS.linger * lsteps * (1 + (R.living || 0)) * .5 + 1 + (R.living || 0) * 2;
      else draws += KIND_DRAWS[p.beat];
      if (p.beat === 'hit') draws += R.trail.len * 2;
    });
    if (R.living) particles += R.living * 4;
    const nLights = (R.lights && R.lights.length) ? R.lights.length : (R.light && R.light.mode !== 'off' ? 1 : 0);
    draws += nLights * 3 + Math.ceil(particles / 3) + (R.motes ? 2 : 0);
    draws = Math.round(draws);
    const capP = particleCap(doc), capS = BUDGET.steps;
    const steps = stepsOf(R, doc).length;
    const pOver = particles > capP, dOver = draws > BUDGET.draws, sOver = steps > capS;
    return { particles, draws, steps, capP, capS, pOver, dOver, sOver, over: pOver || dOver || sOver };
  }
  function isPresetDoc(doc) {
    // A blend, a bred child or a one-part shelf doc uses the 48 cap. Any other doc
    // whose base is a library preset — including one you are mid-edit, or with a
    // tier / linger / fusion experiment on — uses the 32 preset particle cap.
    if (!doc || doc.blend || doc.breedOf || doc.onePart) return false;
    const id = doc.base || doc.id;
    return PRESETS.some(p => p.id === id);
  }
  function particleCap(doc) { return isPresetDoc(doc) ? BUDGET.presetParticles : BUDGET.particles; }
  function stepsOf(R, doc) {
    const mix = ((doc.blend && doc.blend.mix) || 50) / 100;
    const steps = [], seen = {};
    R.pieces.forEach(p => {
      const n = p.beat === 'linger' ? doc.timing.lingerSteps : 1;
      for (let i = 0; i < n; i++) {
        const key = (p.beat === 'linger' ? 'linger' : 'shape') + '|' + p.beat + '|' + p.kind + '|' + i;
        const sideW = p.side === 'B' ? mix : (1 - mix);
        const rec = { cls: p.beat === 'linger' ? 'linger' : 'shape', beat: p.beat, side: p.side || 'A', weight: (p.weight || 1) * sideW - i * .04, kind: p.kind };
        if (seen[key]) {
          if (rec.weight < seen[key].weight) { const ix = steps.indexOf(seen[key]); steps[ix] = rec; seen[key] = rec; }
          continue;
        }
        seen[key] = rec; steps.push(rec);
      }
    });
    for (let i = 0; i < R.trail.len; i++) steps.push({ cls: 'trail', beat: 'hit', side: 'A', weight: .35 - i * .02 });
    const living = R.living || 0;
    for (let i = 0; i < living; i++) steps.push({ cls: 'spread', beat: 'linger', side: 'A', weight: .25 - i * .02 });
    return steps;
  }
  function playSteps(doc, ctx) {
    return stepsOf(resolve(doc, ctx), doc);
  }

  /* ---------- fit to budget: merge rule 4 ----------
     Particles scale pro rata to ≤48 (≤32 for presets) and are never cut by step.
     Lights keep the 2 largest.
     If more than 12 steps play, drop the lowest-weight Linger steps first, then trail, then spread.
     Never remove a side's last step in a beat. On ties, drop from the non-base (B) side first. */
  function fit(doc, ctx) {
    const d = clone(doc), out = [];
    const cap = particleCap(d);

    // 1. Particles: scale every spark group pro rata. Never drop a spark step/group.
    let R0 = resolve(d, ctx);
    if (R0.cost.particles > cap) {
      const before = R0.cost.particles;
      const scale = cap / before;
      const sp = d.layers.sparks;
      sp.amount = Math.max(0, Math.floor(sp.amount * scale));
      if (sp.extra) sp.extra.amount = Math.max(0, Math.floor(sp.extra.amount * scale));
      // leftover from motes / living: shave one at a time from the larger group, still not dropping a group
      while (resolve(d, ctx).cost.particles > cap) {
        const s = d.layers.sparks;
        if (s.extra && s.extra.amount >= s.amount && s.extra.amount > 0) s.extra.amount--;
        else if (s.amount > 0) s.amount--;
        else break;
      }
      out.push('particles ' + before + '→' + resolve(d, ctx).cost.particles);
    }

    // 2. Lights keep the 2 largest (by radius, then A over B so B is dropped on a tie if we had more than 2)
    const lights = (resolve(d, ctx).lights || []).slice();
    if (lights.length > 2) {
      lights.sort((a, b) => (b.radius - a.radius) || ((a.side === 'B') - (b.side === 'B')));
      const keep = lights.slice(0, 2);
      d.layers.light = { mode: keep[0].mode, radius: keep[0].radius, ramp: keep[0].ramp };
      if (keep[1]) d.layers.light.extra = { mode: keep[1].mode, radius: keep[1].radius, ramp: keep[1].ramp };
      else delete d.layers.light.extra;
      out.push('kept the 2 largest lights');
    }

    // 3. More than 12 playable steps: linger, then trail, then spread
    let lingerN = 0, trailN = 0, spreadN = 0;
    const canDropSideInBeat = (side, beat) => {
      const R = resolve(d, ctx);
      const n = R.pieces.filter(p => p.beat === beat && (p.side || 'A') === side).length;
      return (beat === 'linger' ? n * d.timing.lingerSteps : n) > 1;
    };
    for (let g = 0; g < 40 && (playSteps(d, ctx).length > 12 || resolve(d, ctx).cost.dOver); g++) {
      const overSteps = playSteps(d, ctx).length > 12;
      // Prefer linger trims first when over the 12-step cap (and also when over draws, same order)
      if (d.timing.lingerSteps > 1) {
        // reducing lingerSteps leaves each side with at least one linger step
        d.timing.lingerSteps--; lingerN++; continue;
      }
      const extra = d.layers.shape.extra;
      if (extra && extra.linger && extra.linger !== 'none' && canDropSideInBeat('B', 'linger')) {
        extra.linger = 'none'; lingerN++; continue;
      }
      if (overSteps || resolve(d, ctx).cost.dOver) {
        if (d.layers.trail.len > 0) { d.layers.trail.len--; trailN++; continue; }
        if (d.exp && d.exp.living && (d.exp.livingTiles || 0) > 0) {
          d.exp.livingTiles -= 1; spreadN++;
          if (d.exp.livingTiles <= 0) d.exp.living = false;
          continue;
        }
      }
      break;
    }
    if (lingerN) out.push(lingerN + ' linger step' + (lingerN > 1 ? 's' : ''));
    if (trailN) out.push('trail by ' + trailN);
    if (spreadN) out.push(spreadN + ' spread tile' + (spreadN > 1 ? 's' : ''));
    return { doc: d, msg: out.length ? 'Trimmed ' + out.join(', ') + ' to fit' : 'Already fits', trimmed: out.length > 0 };
  }

  /* ---------- blend (drop B onto A: A is the base and owns the Hit) ---------- */
  function variantSeed(aSeed, bSeed, mix, baseSide) {
    let h = 2166136261;
    const mixIn = v => { h = Math.imul(h ^ (v >>> 0), 16777619) >>> 0; };
    mixIn(aSeed); mixIn(bSeed); mixIn(mix); mixIn(baseSide === 'B' ? 0x42 : 0x41);
    return h >>> 0;
  }
  function blend(aDoc, bDoc, mix, pick) {
    const A = aDoc.layers, B = bDoc.layers, m = mix / 100;
    const d = clone(aDoc);
    d.id = 'blend-' + aDoc.id + '-' + bDoc.id; d.name = aDoc.name + ' × ' + bDoc.name; d.kind = aDoc.kind;
    const side = k => pick[k] || 'A';
    const num = (a, b) => lerp(a, b, m);
    // shape: Hit always from base unless Both. Both = joined steps, each with its own tint_ramp.
    const sa = A.shape, sb = B.shape, sk = side('shape');
    const pickS = sk === 'B' ? sb : sa;
    d.layers.shape = { cast: pickS.cast, travel: pickS.travel, hit: sk === 'B' ? sb.hit : sa.hit, linger: pickS.linger, size: num(sa.size, sb.size), speed: num(sa.speed, sb.speed), bend: num(sa.bend, sb.bend) };
    if (sk === 'Both') d.layers.shape.extra = { cast: sb.cast, travel: 'none', hit: sb.hit, linger: sb.linger, size: sb.size, ramp: B.colour.ramp };
    const ck = side('colour');
    d.layers.colour = { ramp: (ck === 'B' ? B : A).colour.ramp, bright: Math.round(num(A.colour.bright, B.colour.bright)) };
    if (ck === 'Both') {
      // joined colour steps; the rim is the outer step's ramp. No rim_ramp field.
      d.layers.colour.steps = [
        { ramp: A.colour.ramp, role: 'inner' },
        { ramp: B.colour.ramp, role: 'outer' }
      ];
      d.layers.colour.ramp = A.colour.ramp;
    }
    const pk = side('sparks');
    const spA = A.sparks, spB = B.sparks;
    if (pk === 'Both') {
      d.layers.sparks = { amount: Math.round(spA.amount * (1 - m * .5)), life: spA.life, pull: spA.pull, ramp: A.colour.ramp,
        extra: { amount: Math.round(spB.amount * (.5 + m * .5)), life: spB.life, pull: spB.pull, ramp: B.colour.ramp } };
    } else {
      const s = pk === 'B' ? spB : spA;
      d.layers.sparks = { amount: Math.round(num(spA.amount, spB.amount)), life: num(spA.life, spB.life), pull: s.pull, ramp: (pk === 'B' ? B : A).colour.ramp };
    }
    const lk = side('light');
    if (lk === 'Both') {
      const first = A.light.mode !== 'off' ? A.light : B.light;
      const second = (A.light.mode !== 'off' && B.light.mode !== 'off') ? B.light : null;
      d.layers.light = { mode: first.mode, radius: first.radius, ramp: (first === A.light ? A : B).colour.ramp };
      if (second) d.layers.light.extra = { mode: second.mode, radius: second.radius, ramp: B.colour.ramp };
    } else {
      const lsrc = lk === 'B' ? B.light : A.light;
      d.layers.light = { mode: lsrc.mode, radius: Math.round(num(A.light.radius, B.light.radius)), ramp: (lk === 'B' ? B : A).colour.ramp };
    }
    const uk = side('punch');
    d.layers.punch = uk === 'Both' ? { level: Math.max(A.punch.level, B.punch.level), shake: Math.max(A.punch.shake, B.punch.shake) } : clone((uk === 'B' ? B : A).punch);
    const tk = side('trail');
    d.layers.trail = { len: tk === 'Both' ? A.trail.len + B.trail.len : Math.round(num(A.trail.len, B.trail.len)) };
    d.timing = clone(aDoc.timing); d.timing.lingerSteps = Math.round(num(aDoc.timing.lingerSteps, bDoc.timing.lingerSteps)) + (sk === 'Both' ? 1 : 0);
    d.from = {};
    LAYERS.forEach(k => { const s = side(k); d.from[k] = s === 'B' ? { effect: bDoc.id, rev: bDoc.rev } : { effect: aDoc.id, rev: aDoc.rev }; });
    // variant_seed = hash(A.seed, B.seed, mix snap, base side). Stored once and fixed. A is the base here.
    d.seed = variantSeed(aDoc.seed, bDoc.seed, mix, 'A');
    d.variant_seed = d.seed;
    return d;
  }
  function reactionFor(a, b) {
    return REACTIONS.find(r => (r.a === a && r.b === b) || (r.a === b && r.b === a)) || null;
  }

  /* ---------- dice: seeded reroll inside the layer's bounds ---------- */
  const SHAPE_SETS = { hit: ['arc', 'ring', 'star', 'cross', 'pillar'], cast: ['none', 'gather', 'rune', 'flare'], linger: ['embers', 'scorch', 'lring', 'motes'] };
  function roll(doc, layer, seed) {
    const d = clone(doc), r = window.FXR.mulberry(seed); d.seed = seed;
    const jig = (v, a, b, f) => clamp(v * (1 + (r() - .5) * 2 * f), a, b);
    const L = d.layers, ks = layer ? [layer] : LAYERS;
    ks.forEach(k => {
      if (k === 'shape') {
        L.shape.size = +jig(L.shape.size, .6, 1.6, .25).toFixed(2); L.shape.bend = +clamp(L.shape.bend + (r() - .5) * .6, 0, 1).toFixed(2);
        if (r() < .5) { const set = SHAPE_SETS.linger; L.shape.linger = set[Math.floor(r() * set.length)]; }
        if (r() < .35) { const set = SHAPE_SETS.hit; const i = set.indexOf(L.shape.hit); L.shape.hit = set[(i + (r() < .5 ? 1 : set.length - 1)) % set.length]; }
      }
      if (k === 'colour') { L.colour.bright = clamp(Math.round((r() - .5) * 2.4), -1, 1); }
      if (k === 'sparks') { L.sparks.amount = Math.round(jig(L.sparks.amount || 8, 4, 40, .3)); L.sparks.life = +jig(L.sparks.life, .3, 1.1, .25).toFixed(2); L.sparks.pull = +clamp(L.sparks.pull + (r() - .5) * .8, -1, 1).toFixed(2); }
      if (k === 'light') { L.light.radius = clamp(Math.round(L.light.radius + (r() < .5 ? -1 : 1)), 1, 3); }
      if (k === 'punch') { L.punch.level = clamp(L.punch.level + (r() < .5 ? -1 : 1), 0, 3); }
      if (k === 'trail') { L.trail.len = clamp(Math.round(L.trail.len + (r() - .5) * 4), 0, 8); }
    });
    return d;
  }
  /* breed: 6 children = mix × dice of two parents, plus 1–2 discrete flips (kind, picture or ramp, on-palette only).
     All of it is driven by variant_seed so the same parents + seed always yield the same litter. */
  function onPalette(house) {
    const F = HOUSE_FAMILIES[house && house.family];
    if (F && F.ramps && F.ramps.length) return F.ramps.slice();
    return PALETTE.slice();
  }
  function flipDiscrete(d, seed, palette) {
    const r = window.FXR.mulberry((seed ^ 0xA53C9E13) >>> 0);
    const nFlips = r() < .5 ? 1 : 2;
    const pool = ['kind', 'picture', 'ramp'];
    const flips = [];
    for (let n = 0; n < nFlips && pool.length; n++) {
      const what = pool.splice(Math.floor(r() * pool.length), 1)[0];
      if (what === 'kind') {
        const kinds = KINDS.filter(k => k !== 'All' && k !== d.kind);
        d.kind = kinds[Math.floor(r() * kinds.length)];
        flips.push(d.kind);
      } else if (what === 'picture') {
        const slots = ['hit', 'linger', 'cast'];
        const slot = slots[Math.floor(r() * slots.length)];
        const set = (SHAPE_SETS[slot] || []).filter(s => s !== 'none' && s !== d.layers.shape[slot]);
        if (set.length) { d.layers.shape[slot] = set[Math.floor(r() * set.length)]; flips.push(d.layers.shape[slot]); }
      } else if (what === 'ramp') {
        const pal = (palette || PALETTE).filter(x => x !== d.layers.colour.ramp);
        if (pal.length) {
          const nr = pal[Math.floor(r() * pal.length)];
          d.layers.colour.ramp = nr;
          if (d.layers.sparks.ramp) d.layers.sparks.ramp = nr;
          if (d.layers.colour.steps && d.layers.colour.steps[0]) d.layers.colour.steps[0].ramp = nr;
          flips.push(RAMPNAME(nr));
        }
      }
    }
    d.flips = flips;
    return d;
  }
  function RAMPNAME(k) { return { fire: 'Fire', frost: 'Frost', holy: 'Holy', venom: 'Venom', grass: 'Grass', water: 'Water', stone: 'Stone', bloom: 'Bloom', dirt: 'Dirt', rock: 'Rock' }[k] || k; }
  function breed(a, b, seed, house) {
    const r = window.FXR.mulberry(seed), kids = [], pal = onPalette(house);
    for (let i = 0; i < 6; i++) {
      const pick = {}; LAYERS.forEach(k => { const x = r(); pick[k] = x < .42 ? 'A' : x < .84 ? 'B' : 'Both'; });
      const mix = [0, 25, 50, 75, 100][Math.floor(r() * 5)];
      let d = blend(a, b, mix, pick);
      const childSeed = (variantSeed(a.seed, b.seed, mix, 'A') ^ Math.imul(seed + 1, 0x9E3779B9) ^ (i * 0x85EBCA6B)) >>> 0;
      d = roll(d, null, childSeed);
      d = flipDiscrete(d, childSeed, pal);
      d.seed = childSeed; d.variant_seed = childSeed;
      d.name = 'Child ' + (i + 1); d.id = 'kid-' + seed + '-' + i; d.breedOf = [a.id, b.id]; d.blend = { a: a.id, b: b.id, mix, pick, by: 'layer' };
      kids.push(d);
    }
    return kids;
  }

  /* A shelved single layer becomes a one-part effect doc with `from` pointing at its source.
     The shelf itself only stores a reference to that doc (CN-022). */
  function onePartDoc(src, layer) {
    const d = fromPreset(src.id || src.base);
    d.id = 'part-' + (src.id || src.base) + '-' + layer;
    d.name = LAYER_LABEL[layer] + ' from ' + src.name;
    d.kind = src.kind;
    d.rev = 1;
    d.onePart = layer;
    d.used = false;
    // other layers sit at harmless defaults so this is still a normal effect doc
    d.layers = {
      shape: { cast: 'none', travel: 'none', hit: layer === 'shape' ? src.layers.shape.hit : 'ring', linger: 'none', size: 1, speed: 1, bend: .4 },
      colour: { ramp: src.layers.colour.ramp, bright: 0 },
      sparks: { amount: 0, life: .55, pull: -.3 },
      light: { mode: 'off', radius: 1 },
      punch: { level: 0, shake: 0 },
      trail: { len: 0 }
    };
    d.layers[layer] = clone(src.layers[layer]);
    if (layer === 'sparks' && !d.layers.sparks.ramp) d.layers.sparks.ramp = src.layers.colour.ramp;
    if (layer === 'colour') d.layers.colour = clone(src.layers.colour);
    if (layer === 'shape') d.layers.shape = clone(src.layers.shape);
    d.from = {}; d.from[layer] = { effect: src.id, rev: src.rev || 1 };
    d.timing = { lingerSteps: 1, nudge: { cast: 0, travel: 0, hit: 0, linger: 0 }, start: 'cast' };
    d.seed = variantSeed(src.seed || 1, layer.length, 0, 'A');
    d.variant_seed = d.seed;
    d.touched = {}; d.exp = {}; d.beatSrc = {};
    return d;
  }

  function fromPreset(id) {
    const p = lib[id]; const d = clone(p);
    d.base = id; d.from = {}; d.touched = {}; d.exp = {}; d.beatSrc = {};
    return d;
  }

  window.FXM = { LAYERS, LAYER_LABEL, BEATS, BEAT_LABEL, KINDS, BUDGET, PRESETS, HIDDEN, HOUSE_FAMILIES, PALETTE, lib, clone, clamp,
    resolve, fit, blend, roll, breed, fromPreset, reactionFor, familyRamp, styleOf, variantSeed, onePartDoc, particleCap, playSteps, stepsOf, isPresetDoc };
})();
