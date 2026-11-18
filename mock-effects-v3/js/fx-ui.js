/* Effect Designer v3 mock: UI. Plain JS, no dependencies, no network. State lives in memory. */
(function () {
  'use strict';
  const M = window.FXM, R = window.FXR;
  const $ = s => document.querySelector(s);
  const h = (tag, attrs, kids) => {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k]; if (k.startsWith('aria-') && typeof v === 'boolean') { e.setAttribute(k, String(v)); continue; } if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    }
    (kids || []).forEach(c => c != null && e.append(c)); return e;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const S = {
    doc: M.fromPreset('fire-slash'), mode: 'basic', kind: 'Slash', rampFilter: null, selLayer: null, selBeat: null,
    shelf: [], house: { family: 'asmade', pixel: 1, punch: null, motes: false }, rolls: [], rollIdx: -1,
    undo: [], userCards: [], sheet: null, trim: null, pick: null, removed: {}, theme: 'light',
    freeze: null, t0: performance.now(), kidPage: 0, kidPlay: 0, kids: null, exportClean: false, rhythm: [], selShelf: null,
    blendUi: null, pickPop: null, forceCoach: false
  };
  S.selCard = 'fire-slash';
  const ctxOf = () => ({ house: S.house });
  const applyStyle = () => { if (R.setStyle) R.setStyle(M.styleOf(S.house)); };
  const res = (doc) => { applyStyle(); return M.resolve(doc || S.doc, ctxOf()); };
  const nameOf = id => (M.lib[id] && M.lib[id].name) || id;

  /* ---------- undo / toast ---------- */
  function snap() { return JSON.stringify({ doc: S.doc, userCards: S.userCards, shelf: S.shelf, selCard: S.selCard }); }
  function pushUndo() { S.undo.push(snap()); if (S.undo.length > 40) S.undo.shift(); }
  function undo() {
    const s = S.undo.pop(); if (!s) return; const o = JSON.parse(s);
    S.doc = o.doc; S.userCards = o.userCards; S.shelf = o.shelf; S.selCard = o.selCard;
    S.userCards.forEach(c => { M.lib[c.id] = c; });
    S.trim = null; hideToast(); renderAll(); if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
  }
  let toastTimer = 0;
  function toast(msg, action, fn) {
    const t = $('#toast'); t.innerHTML = ''; t.append(h('span', { style: 'flex:1', text: msg }));
    if (action) t.append(h('button', { onclick: () => { fn(); } , text: action }));
    t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 4200);
  }
  function hideToast() { $('#toast').hidden = true; }
  function change(fn, msg, opts) {
    pushUndo(); fn(); S.trim = null;
    if (!(opts && opts.keepRolls)) { /* keep history */ }
    renderAll(); if (msg) toast(msg, 'Undo', undo);
    if (S.sheet && !(opts && opts.noSheet)) openSheet(S.sheet.kind, S.sheet.arg, true);
  }

  /* ---------- canvases ---------- */
  const thumbs = []; // {cv, getDoc, off, still}
  function thumbCanvas(kind) { const g = R.geom(kind || 'thumb'); const c = h('canvas', { class: 'px', width: g.W, height: g.H }); return c; }
  function regThumb(cv, getDoc, opts) { thumbs.push(Object.assign({ cv, getDoc, off: thumbs.length * 377, kind: 'thumb' }, opts || {})); }

  function gridDoc(id) {
    const base = M.lib[id]; const d = M.fromPreset ? JSON.parse(JSON.stringify(base)) : base;
    d.from = d.from || {}; d.touched = d.touched || {}; d.exp = {}; d.beatSrc = d.beatSrc || {};
    if (S.rampFilter) { d.layers.colour.ramp = S.rampFilter; d.touched.colour = true; if (d.layers.sparks.ramp) d.layers.sparks.ramp = S.rampFilter; }
    return d;
  }

  /* ---------- top-level render ---------- */
  function renderAll() {
    applyStyle();
    thumbs.length = 0;
    $('#fx-name').textContent = S.doc.name;
    renderLayers(); renderMeter(); renderRolls(); renderBeats(); renderKinds(); renderRamps(); renderShelfRow(); renderGrid(); renderCaps();
    $('#mode-basic').setAttribute('aria-pressed', S.mode === 'basic'); $('#mode-adv').setAttribute('aria-pressed', S.mode === 'adv');
    $('#shelf-count').textContent = S.shelf.length;
    renderBanner(); if (S.sheet) dockSheet();
  }

  function provOf(k) {
    const f = S.doc.from && S.doc.from[k]; if (!f) return null;
    if (S.removed[f.effect]) return { state: 'removed', text: 'source removed', f };
    const src = M.lib[f.effect]; if (!src) return { state: 'removed', text: 'source removed', f };
    if (src.rev > f.rev) return { state: 'changed', text: src.name + ' changed · Update?', f };
    return { state: 'ok', text: 'from ' + src.name, f };
  }
  function sideOf(k) { const b = S.doc.blend; if (!b) return null; const p = b.pick[k] || 'A'; return p === 'Both' ? 'AB' : p; }

  function renderLayers() {
    const el = $('#layers'); el.innerHTML = '';
    const r = res();
    M.LAYERS.forEach(k => {
      const L = S.doc.layers[k]; const pv = provOf(k), side = sideOf(k);
      const kids = [];
      if (k === 'colour') { const rr = R.RAMPS[r.light.ramp] || R.RAMPS.fire; const a = rr[Math.min(2, rr.length-1)], b = rr[Math.min(3, rr.length-1)], c = rr[rr.length-2]; kids.push(h('i', { class: 'sw', style: `background:linear-gradient(90deg,${a} 0 33%,${b} 33% 66%,${c} 66%)` })); }
      kids.push(h('span', { text: M.LAYER_LABEL[k] + (k === 'sparks' ? ' ' + r.sparks.reduce((s, x) => s + x.n, 0) : k === 'punch' ? ' ' + r.punch.level : '') }));
      if (side) kids.push(h('span', { class: 'badge ' + side, text: side === 'AB' ? 'A+B' : side, 'aria-label': 'from side ' + side }));
      if (pv && !side) kids.push(h('span', { class: 'from-dot' + (pv.state === 'changed' ? ' changed' : ''), title: pv.text }));
      if (pv && side && pv.state === 'changed') kids.push(h('span', { class: 'from-dot changed', title: pv.text }));
      const off = (k === 'light' && L.mode === 'off') || (k === 'trail' && L.len === 0) || (k === 'punch' && r.punch.level === 0);
      el.append(h('button', { class: 'lchip', 'aria-pressed': S.selLayer === k, 'aria-label': M.LAYER_LABEL[k] + ' layer' + (pv ? ', ' + pv.text : ''), style: off ? 'opacity:.62' : null,
        onclick: () => onLayerChip(k) }, kids));
    });
  }

  function renderMeter() {
    const el = $('#meter'); el.innerHTML = ''; el.className = 'meter';
    const c = res().cost, B = M.BUDGET;
    if (S.trim) {
      el.classList.add('trimmed');
      el.append(h('span', { style: 'flex:1', text: '✂ ' + S.trim.msg }), h('button', { class: 'act plain', onclick: undo, text: 'Undo' }));
      return;
    }
    const bar = (lab, v, max, hot) => h('span', { class: 'bar' + (hot ? ' hot' : ''), 'aria-label': `${lab} ${v} of ${max}` }, [
      h('span', { class: 'bn', text: `${v}/${max}` }),
      h('span', { class: 'bl', text: lab.toLowerCase() })
    ]);
    const bars = h('span', { class: 'bars' }, [
      bar('particles', c.particles, c.capP || B.particles, c.pOver),
      bar('draws', c.draws, B.draws, c.dOver),
      bar('steps', c.steps, c.capS || B.steps, c.sOver)
    ]);
    if (S.doc.exp && S.doc.exp.fusion) bars.append(h('span', { class: 'bar', 'aria-label': `On screen ${c.draws} of ${B.screen}` }, [h('span', { class: 'bn', text: `${c.draws}/${B.screen}` }), h('span', { class: 'bl', text: 'on screen' })]));
    if (c.over) {
      el.classList.add('over');
      el.append(h('span', { 'aria-hidden': 'true', text: '⚠' }), bars, h('button', { class: 'act', id: 'btn-fit', onclick: fitNow, text: 'Fit to budget' }));
    } else el.append(h('span', { 'aria-hidden': 'true', text: '✦' }), bars);
  }
  function fitNow() {
    pushUndo();
    const f = M.fit(S.doc, ctxOf());
    S.doc = f.doc; S.trim = f.trimmed ? { msg: f.msg } : null;
    renderAll(); if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
  }
  /* Tier-up runs through Fit at the level you pick, so a highest-level tier
     (Lv3 at 13 steps) can never be left unsaved-over. One undo reverts both. */
  function setTier(v) {
    pushUndo();
    S.doc.exp = S.doc.exp || {};
    S.doc.exp.tier = +v;
    const c = res().cost;
    if (c.over) {
      const f = M.fit(S.doc, ctxOf());
      S.doc = f.doc;
      S.trim = f.trimmed ? { msg: f.msg } : null;
    } else S.trim = null;
    renderAll(); if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
  }

  function renderRolls() {
    const el = $('#rolls'); el.hidden = S.rolls.length === 0; el.innerHTML = '';
    if (!S.rolls.length) return;
    el.append(h('span', { class: 'rlab', html: `Seed ${S.doc.seed % 100000}<br>last 6 rolls · on this device` }));
    for (let i = 0; i < 6; i++) {
      const r = S.rolls[i];
      if (!r) { el.append(h('span', { class: 'roll', style: 'opacity:.35', 'aria-hidden': 'true' })); continue; }
      const cv = thumbCanvas('mini');
      el.append(h('button', { class: 'roll', 'aria-pressed': S.rollIdx === i, 'aria-label': 'Go back to roll ' + (i + 1), onclick: () => { S.rollIdx = i; S.doc = M.clone(r.doc); renderAll(); } }, [cv]));
      regThumb(cv, () => r.doc, { still: true });
    }
  }

  function renderBeats() {
    const el = $('#beats'); el.hidden = S.mode !== 'adv'; el.innerHTML = '';
    if (S.mode !== 'adv') return;
    const order = M.BEATS, si = order.indexOf(S.doc.timing.start);
    order.forEach((b, i) => {
      const src = S.doc.beatSrc && S.doc.beatSrc[b];
      const nud = S.doc.timing.nudge[b];
      const noTravel = b === 'travel' && !src && (!S.doc.layers.shape.travel || S.doc.layers.shape.travel === 'none');
      let sub = src ? nameOf(src) : noTravel ? 'none' : (b === 'travel' ? 'path only' : 'this effect');
      if (nud) sub = (nud > 0 ? '+' : '') + nud + ' ms · ' + sub;
      el.append(h('button', { class: 'beat' + (i < si ? ' skipped' : '') + (b === 'travel' ? ' later' : ''), 'data-beat': b, 'aria-pressed': S.selBeat === b,
        onclick: () => { S.selBeat = S.selBeat === b ? null : b; S.selLayer = null; renderLayers(); renderBeats(); S.selBeat ? openSheet('beat', b) : closeSheet(); } },
        [h('span', { class: 'prog' }), h('span', { class: 'bn', text: M.BEAT_LABEL[b] }), h('span', { class: 'bs', text: sub })]));
    });
  }

  function renderKinds() {
    const el = $('#kinds'); el.innerHTML = '';
    M.KINDS.forEach(k => el.append(h('button', { class: 'chip-btn', 'aria-pressed': S.kind === k, onclick: () => { S.kind = k; $('#kind-hint').textContent = k === 'Slash' ? '· picked from Cleave' : ''; renderGrid(); renderKinds(); }, text: k })));
  }
  function rampSw(key) {
    const r = R.RAMPS[key] || R.RAMPS.fire;
    const idxs = r.length > 4 ? [1, 2, 3, r.length - 2, r.length - 1] : r.map((_, i) => i).slice(1);
    return h('span', { class: 'ramp', 'aria-hidden': 'true' }, idxs.map(i => h('i', { style: 'background:' + r[i] })));
  }
  function renderRamps() {
    const el = $('#ramps'); el.innerHTML = '';
    ['fire', 'frost', 'holy', 'venom', 'grass', 'water', 'stone', 'bloom', 'dirt', 'rock'].forEach(k => {
      el.append(h('button', { class: 'chip-btn', 'aria-pressed': S.rampFilter === k, onclick: () => {
        const on = S.rampFilter !== k;
        change(() => { S.rampFilter = on ? k : null; if (on) { S.doc.layers.colour.ramp = k; if (S.doc.layers.sparks.ramp) S.doc.layers.sparks.ramp = k; S.doc.touched.colour = true; } }, null, { noSheet: true });
      } }, [rampSw(k), h('span', { text: R.RAMP_LABEL[k] })]));
    });
  }
  function renderShelfRow() {
    const el = $('#shelf-wrap'); el.innerHTML = '';
    if (!S.shelf.length) return;
    el.append(h('div', { class: 'label', html: `Shelf <span class="hint">· ${S.shelf.length} of 48 · references only · this project</span>` }));
    const row = h('div', { class: 'row scroll shelf-row' });
    S.shelf.forEach((it, i) => row.append(shelfCard(it, i, () => { if (it.layer || (M.lib[it.id] && M.lib[it.id].onePart)) applyShelfLayer(it); else useCard(it.id); })));
    el.append(row);
  }
  function shelfCard(it, i, onclick) {
    const layerKey = it.layer || (M.lib[it.id] && M.lib[it.id].onePart);
    if (layerKey) {
      const part = M.lib[it.id] || {};
      const rr = R.RAMPS[(part.layers && part.layers.colour && part.layers.colour.ramp) || 'stone'] || R.RAMPS.stone;
      const mid = rr[Math.min(2, rr.length-1)], hi = rr[Math.min(4, rr.length-1)];
      const srcName = (part.from && part.from[layerKey] && nameOf(part.from[layerKey].effect)) || (part.name || '').replace(/^.*from /, '') || 'source';
      return h('button', { class: 'scard layer-item', 'aria-pressed': S.selShelf === i, onclick }, [
        h('div', { class: 'lico', style: `background:linear-gradient(90deg,${mid},${hi})`, 'aria-hidden': 'true' }),
        h('div', { class: 'sn', html: `${esc(M.LAYER_LABEL[layerKey])}<small>one-part · from ${esc(srcName)}</small>` })]);
    }
    const cv = thumbCanvas(); const b = h('button', { class: 'scard', 'aria-pressed': S.selShelf === i, onclick }, [cv, h('div', { class: 'sn', html: esc(nameOf(it.id)) + '<small>effect</small>' })]);
    regThumb(cv, () => gridDoc(it.id) || M.lib[it.id]);
    return b;
  }

  function gridItems() {
    const pre = M.PRESETS.filter(p => S.kind === 'All' || p.kind === S.kind).map(p => p.id);
    return S.userCards.map(c => c.id).concat(pre);
  }
  function renderGrid() {
    const el = $('#grid'); el.innerHTML = '';
    const items = gridItems();
    const others = S.kind === 'All' ? [] : M.PRESETS.filter(p => p.kind !== S.kind).map(p => p.id);
    items.concat(others.length ? ['__div'] : [], others).forEach(id => {
      if (id === '__div') { el.append(h('div', { class: 'divider', text: 'Other effects · blend or take parts from these' })); return; }
      const p = M.lib[id]; const user = S.userCards.some(c => c.id === id);
      const cv = thumbCanvas();
      const hearted = S.shelf.some(s => s.type === 'effect' && s.id === id);
      const card = h('div', { class: 'card' + (S.selCard === id ? ' sel' : '') + (user ? ' blend' : '') + (S.pick ? ' pickmode' : ''), 'data-id': id }, [
        h('button', { class: 'pick', 'aria-label': (S.pick ? S.pick.label + ': ' : 'Use ') + p.name }, [cv]),
        user ? h('span', { class: 'tagb', text: p.breedOf ? 'Bred' : 'Blend' }) : null,
        h('div', { class: 'foot' }, [h('div', { class: 'nm', html: esc(p.name) + `<small>${esc(user ? (p.breedOf ? 'bred' : 'blend') : p.kind)}</small>` }),
          h('button', { class: 'heart', 'aria-pressed': hearted, 'aria-label': (hearted ? 'Remove ' : 'Add ') + p.name + (hearted ? ' from' : ' to') + ' shelf', onclick: e => { e.stopPropagation(); toggleShelf(id); }, text: hearted ? '♥' : '♡' })])
      ]);
      attachCardGestures(card, id);
      el.append(card);
      regThumb(cv, () => user ? M.lib[id] : gridDoc(id));
    });
  }
  function renderBanner() {
    const el = $('#pick-banner'); el.innerHTML = '';
    if (!S.pick) return;
    el.append(h('div', { class: 'banner' }, [h('span', { text: S.pick.label + ': tap an effect' }), h('span', { class: 'spacer' }), h('button', { class: 'btn btn-ghost', onclick: () => { S.pick = null; renderAll(); }, text: 'Cancel' })]));
  }
  let capsKey = '';
  function renderCaps(beat) {
    const ex = S.doc.exp || {}; const showTravel = beat === 'travel' || S.selBeat === 'travel';
    const key = [ex.fusion, ex.living, ex.tier, showTravel].join('|');
    if (key === capsKey && beat !== undefined) return; capsKey = key;
    const el = $('#strip-caps'); el.innerHTML = '';
    const off = (k, lab) => h('button', { class: 'cap lab', 'aria-label': 'Turn off ' + lab, onclick: () => change(() => { S.doc.exp[k] = k === 'tier' ? 0 : false; }, null, { noSheet: false }) }, [h('span', { html: lab }), h('b', { text: '×' })]);
    if (ex.fusion) el.append(off('fusion', 'Combo fusion: a ready-made fused look swaps in'));
    if (ex.living) el.append(off('living', 'Living linger · visual only'));
    if (ex.tier) { el.append(off('tier', 'Tier Lv' + (ex.tier + 1))); el.append(h('span', { class: 'cap', text: 'later: value scaling' })); }
    if (showTravel) el.append(h('span', { class: 'cap', text: 'Travel arrives in a later update' }));
  }

  /* ---------- actions ---------- */
  function useCard(id) {
    if (S.pick) { const p = S.pick; S.pick = null; p.fn(id); return; }
    pushUndo();
    const user = S.userCards.find(c => c.id === id);
    S.doc = user ? M.clone(user) : M.fromPreset(id);
    if (!user && S.rampFilter) { S.doc.layers.colour.ramp = S.rampFilter; S.doc.touched.colour = true; }
    S.selCard = id; S.trim = null; S.rolls = []; S.rollIdx = -1;
    renderAll();
    if (S.doc.blend) openSheet('blend'); else if (S.sheet && S.sheet.kind !== 'layer' && S.sheet.kind !== 'beat') closeSheet(); else if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
  }
  function toggleShelf(id) {
    const i = S.shelf.findIndex(s => s.type === 'effect' && s.id === id);
    if (i < 0 && S.shelf.length >= 48) { toast('The shelf holds 48. Remove one first.'); return; }
    change(() => { if (i >= 0) S.shelf.splice(i, 1); else S.shelf.unshift({ type: 'effect', id }); }, i >= 0 ? 'Removed from shelf' : `${nameOf(id)} is on the shelf (not given to anything)`, { noSheet: false });
  }
  function shelfLayer(k) {
    if (S.shelf.length >= 48) { toast('The shelf holds 48. Remove one first.'); return; }
    change(() => {
      const part = M.onePartDoc(S.doc, k);
      M.lib[part.id] = part;
      S.shelf.unshift({ type: 'effect', id: part.id, layer: k }); // reference only (CN-022)
    }, `${M.LAYER_LABEL[k]} layer is on the shelf (a one-part effect, referenced)`);
  }
  function applyShelfLayer(it) {
    const part = M.lib[it.id]; if (!part) return;
    const k = it.layer || part.onePart;
    const srcFrom = part.from && part.from[k];
    change(() => {
      S.doc.layers[k] = M.clone(part.layers[k]);
      S.doc.from[k] = srcFrom ? M.clone(srcFrom) : { effect: part.id, rev: part.rev };
      S.doc.touched[k] = true;
    }, `Added ${M.LAYER_LABEL[k].toLowerCase()} from ${part.name.replace(/^.*from /, '')}`);
  }
  const TAKE = { sparks: 'sparks', colour: 'colour', motion: 'shape', timing: 'timing' };
  function take(srcId, what) {
    const src = M.lib[srcId]; if (!src) return;
    change(() => {
      if (what === 'timing') {
        S.doc.layers.shape.speed = src.layers.shape.speed; S.doc.timing.lingerSteps = src.timing.lingerSteps; S.doc.timing.nudge = M.clone(src.timing.nudge);
        S.doc.from.timing = { effect: srcId, rev: src.rev };
      } else {
        const k = TAKE[what];
        const v = M.clone(src.layers[k]); if (k === 'shape') v.speed = S.doc.layers.shape.speed;
        if (k === 'sparks') v.ramp = src.layers.colour.ramp;
        S.doc.layers[k] = v; S.doc.from[k] = { effect: srcId, rev: src.rev }; S.doc.touched[k] = true;
      }
    }, `Took ${what} from ${src.name}`);
  }
  function updateFromSource(k) { updateChanged(k); }
  function updateChanged(clicked) {
    const ks = M.LAYERS.filter(k => { const pv = provOf(k); return pv && pv.state === 'changed'; });
    if (!ks.length) return;
    pushUndo();
    const names = [];
    if (S.doc.blend) {
      const full = buildBlend(S.doc.blend);
      ks.forEach(k => {
        S.doc.layers[k] = M.clone(full.layers[k]);
        S.doc.from[k] = M.clone(full.from[k]);
        names.push(M.LAYER_LABEL[k].toLowerCase());
      });
      if (ks.includes('shape')) S.doc.timing.lingerSteps = full.timing.lingerSteps;
    } else {
      ks.forEach(k => {
        const pv = provOf(k); const src = M.lib[pv.f.effect]; if (!src || !src.layers[k]) return;
        const v = M.clone(src.layers[k]); if (k === 'sparks' && !v.ramp) v.ramp = src.layers.colour.ramp;
        S.doc.layers[k] = v; S.doc.from[k] = { effect: src.id, rev: src.rev };
        names.push(M.LAYER_LABEL[k].toLowerCase());
      });
    }
    const f = M.fit(S.doc, ctxOf());
    S.doc = f.doc;
    S.trim = f.trimmed ? { msg: f.msg } : null;
    renderAll();
    if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
    toast(f.trimmed ? f.msg : ('Updated ' + names.join(', ')), 'Undo', undo);
  }
  function makeBlend(aId, bId) {
    if (aId === bId) return;
    pushUndo();
    const pick = { shape: 'A', colour: 'Both', sparks: 'Both', light: 'A', punch: 'A', trail: 'B' };
    const meta = { a: aId, b: bId, mix: 50, pick, by: 'layer', beatPick: { cast: 'A', travel: 'A', hit: 'A', linger: 'B' } };
    const d = buildBlend(meta);
    S.userCards = S.userCards.filter(c => c.id !== d.id); S.userCards.unshift(d); M.lib[d.id] = d;
    S.doc = M.clone(d); S.selCard = d.id; S.trim = null; S.selLayer = null;
    renderAll(); openSheet('blend');
    toast(`Blended ${nameOf(bId)} into ${nameOf(aId)}`, 'Undo', undo);
  }
  function buildBlend(meta) {
    const A = M.lib[meta.a], B = M.lib[meta.b];
    const d = M.blend(A, B, meta.mix, meta.pick);
    d.blend = M.clone(meta); d.touched = { colour: true }; d.exp = {}; d.beatSrc = {};
    if (meta.by === 'beat') M.BEATS.forEach(b => { const p = meta.beatPick[b]; if (p === 'A') d.beatSrc[b] = meta.a; else if (p === 'B') d.beatSrc[b] = meta.b; });
    if (meta.reaction) { const r = M.reactionFor(A.layers.colour.ramp, B.layers.colour.ramp); if (r) { r.apply(d); d.name = r.name + ' (' + A.name + ' × ' + B.name + ')'; } }
    return d;
  }
  function applyBlend(fn, opts) {
    opts = opts || {};
    if (!opts.live && !opts.noUndo) pushUndo();
    const meta = M.clone(S.doc.blend); fn(meta);
    const keepId = S.doc.id;
    const d = buildBlend(meta);
    const old = S.userCards.findIndex(c => c.id === keepId);
    if (old >= 0) S.userCards.splice(old, 1, d); else S.userCards.unshift(d);
    M.lib[d.id] = d; S.doc = M.clone(d); S.selCard = d.id; S.trim = null;
    if (opts.live) { renderMeter(); renderLayers(); return; }
    renderAll();
    if (!opts.noSheet && S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
    if (S.pickPop) openPickPop(S.pickPop, true);
  }
  function editBlend(fn) { applyBlend(fn); }
  function rollDice() {
    const base = S.doc; const seed = (Math.imul(base.seed ^ 0x5bd1e995, 2654435761) + S.rolls.length * 7919 + 1) >>> 0;
    const d = M.roll(base, S.selLayer, seed);
    if (!S.rolls.length) S.rolls.push({ seed: base.seed, doc: M.clone(base) });
    S.rolls.push({ seed, doc: M.clone(d) }); while (S.rolls.length > 6) S.rolls.shift();
    S.rollIdx = S.rolls.length - 1; pushUndo(); S.doc = d; S.trim = null; renderAll();
    if (S.sheet) openSheet(S.sheet.kind, S.sheet.arg, true);
  }
  function save() {
    const c = res().cost;
    if (c.over) { toast('Over budget: fit it before saving', 'Fit to budget', () => { fitNow(); hideToast(); }); return; }
    toast(`Saved “${S.doc.name}” · Cleave uses it`, 'Undo', undo);
  }

  /* ---------- gestures: tap = use, hold = Take menu, hold + drag = blend ---------- */
  let drag = null;
  function attachCardGestures(card, id) {
    const pickBtn = card.querySelector('.pick');
    let timer = 0, sx = 0, sy = 0, lifted = false, moved = false, pid = null, isMouse = false;
    const clear = () => { clearTimeout(timer); card.classList.remove('lifted'); };
    card.addEventListener('contextmenu', e => { e.preventDefault(); });
    pickBtn.addEventListener('pointerdown', e => {
      if (e.button > 0) return;
      sx = e.clientX; sy = e.clientY; lifted = false; moved = false; pid = e.pointerId; isMouse = e.pointerType === 'mouse';
      timer = setTimeout(() => { lifted = true; card.classList.add('lifted'); try { pickBtn.setPointerCapture(pid); } catch (_) {} if (navigator.vibrate) navigator.vibrate(10); }, 420);
    });
    pickBtn.addEventListener('touchmove', e => { if (lifted) e.preventDefault(); }, { passive: false });
    pickBtn.addEventListener('pointermove', e => {
      const dx = e.clientX - sx, dy = e.clientY - sy, far = Math.hypot(dx, dy) > 10;
      if (!lifted && far && !drag) { if (isMouse && e.buttons === 1) { lifted = true; card.classList.add('lifted'); try { pickBtn.setPointerCapture(pid); } catch (_) {} } else { clearTimeout(timer); return; } }
      if (lifted && far && !drag) startDrag(card, id, e);
      if (drag) moveDrag(e);
    });
    pickBtn.addEventListener('pointerup', e => {
      clearTimeout(timer);
      if (drag) { endDrag(e); card.classList.remove('lifted'); lifted = false; return; }
      if (lifted) { card.classList.remove('lifted'); lifted = false; openSheet('take', id); return; }
      if (Math.hypot(e.clientX - sx, e.clientY - sy) < 10) useCard(id);
    });
    pickBtn.addEventListener('pointercancel', () => { clear(); lifted = false; if (drag) cancelDrag(); });
    pickBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); useCard(id); } if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); openSheet('take', id); } });
  }
  function startDrag(card, id, e) {
    const g = h('div', { class: 'ghost' }); const cv = thumbCanvas();
    g.append(cv, h('div', { text: M.lib[id].name }));
    document.body.append(g);
    drag = { id, ghost: g, cv, target: null, card };
    window.FXR.draw(cv.getContext('2d'), R.geom('thumb'), res(gridDocOrUser(id)), 700);
    moveDrag(e);
  }
  function gridDocOrUser(id) { return S.userCards.find(c => c.id === id) || gridDoc(id); }
  function moveDrag(e) {
    drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
    const el = document.elementFromPoint(e.clientX, e.clientY); const card = el && el.closest && el.closest('.card');
    const tid = card && card.dataset.id !== drag.id ? card.dataset.id : null;
    document.querySelectorAll('.card.droptarget').forEach(c => { if (c !== card) c.classList.remove('droptarget'); });
    if (tid) card.classList.add('droptarget');
    drag.target = tid;
  }
  function endDrag() { const d = drag; cancelDrag(); if (d.target) makeBlend(d.target, d.id); }
  function cancelDrag() { if (!drag) return; drag.ghost.remove(); document.querySelectorAll('.card.droptarget').forEach(c => c.classList.remove('droptarget')); drag = null; }

  /* ---------- blend UI (Round 3, progressive disclosure) ---------- */
  const COACH_KEY = 'fx-coach-blend-chips';
  function blendUiMode() {
    if (S.blendUi) return S.blendUi;
    try {
      const v = String(new URLSearchParams(location.search).get('blend') || '').toLowerCase();
      if (v === 'chips' || v === 'b') return 'chips';
    } catch (e) {}
    return 'default';
  }
  function isChipsBlend() { return blendUiMode() === 'chips'; }
  function ensureHost(id, cls, attrs) {
    let el = document.getElementById(id);
    if (!el) { el = h('div', Object.assign({ id, class: cls, hidden: true }, attrs || {})); $('#app').append(el); }
    return el;
  }
  function onLayerChip(k) {
    if (S.doc && S.doc.blend) {
      if (S.pickPop === k) { closePickPop(); return; }
      dismissCoach(true);
      openPickPop(k);
      return;
    }
    S.selLayer = S.selLayer === k ? null : k; renderLayers(); S.selLayer ? openSheet('layer', k) : closeSheet();
  }
  function closePickPop(keepSel) {
    const el = $('#pick-pop'); if (el) el.hidden = true;
    const was = S.pickPop; S.pickPop = null;
    if (!keepSel && S.selLayer === was && !(S.sheet && S.sheet.kind === 'layer')) { S.selLayer = null; renderLayers(); }
  }
  function openPickPop(k, refresh) {
    const m = S.doc && S.doc.blend; if (!m) return;
    S.pickPop = k; S.selLayer = k; renderLayers();
    const pop = ensureHost('pick-pop', 'pick-pop', { role: 'dialog', 'aria-label': 'Pick side for ' + M.LAYER_LABEL[k] });
    pop.innerHTML = ''; pop.hidden = false;
    const cur = m.pick[k] || 'A';
    const cv = thumbCanvas();
    pop.append(
      h('div', { class: 'ph' }, [
        cv,
        h('b', { text: M.LAYER_LABEL[k] }),
        h('button', { class: 'adjust', onclick: () => { closePickPop(true); openSheet('layer', k); }, text: 'Adjust…' }),
        h('button', { class: 'icon-btn', 'aria-label': 'Close picker', onclick: () => closePickPop(), text: '×' })
      ]),
      seg([['A', 'A'], ['B', 'B'], ['Both', 'Both']], cur, v => applyBlend(x => { x.by = 'layer'; x.pick[k] = v; }, { noSheet: false }), M.LAYER_LABEL[k] + ' side')
    );
    regThumb(cv, () => S.doc);
    placePickPop();
  }
  function placePickPop() {
    const pop = $('#pick-pop'); if (!pop || pop.hidden) return;
    const app = $('#app').getBoundingClientRect();
    const chip = document.querySelector('#layers .lchip[aria-pressed="true"]');
    let left = 8, top = 120;
    if (chip) {
      const r = chip.getBoundingClientRect();
      top = r.bottom - app.top + 6;
      left = r.left - app.left;
    }
    const maxL = Math.max(8, app.width - pop.offsetWidth - 8);
    if (left > maxL) left = maxL;
    if (left < 8) left = 8;
    const sheet = $('#sheet');
    if (sheet && !sheet.hidden) {
      const maxBottom = sheet.getBoundingClientRect().top - app.top - 6;
      if (top + pop.offsetHeight > maxBottom) top = Math.max(8, maxBottom - pop.offsetHeight);
    }
    pop.style.top = top + 'px'; pop.style.left = left + 'px'; pop.style.right = 'auto';
  }
  function hideCoach() { const el = $('#coach'); if (el) el.hidden = true; }
  function dismissCoach(silent) {
    try { sessionStorage.setItem(COACH_KEY, '1'); } catch (e) {}
    S.forceCoach = false; hideCoach();
  }
  function maybeShowCoach() {
    if (!isChipsBlend() || !S.doc || !S.doc.blend) { hideCoach(); return; }
    let seen = false;
    try { seen = !!sessionStorage.getItem(COACH_KEY); } catch (e) {}
    if (seen && !S.forceCoach) { hideCoach(); return; }
    const el = ensureHost('coach', 'coach', { role: 'status' });
    el.innerHTML = '';
    el.append(
      h('p', { text: 'Tap a part to pick A, B or Both' }),
      h('button', { onclick: () => dismissCoach(), text: 'Got it', 'aria-label': 'Got it' })
    );
    el.hidden = false;
    placeCoach();
  }
  function placeCoach() {
    const el = $('#coach'); if (!el || el.hidden) return;
    const app = $('#app').getBoundingClientRect();
    const meter = $('#meter');
    const layers = $('#layers');
    const anchor = (meter && !meter.hidden) ? meter : layers;
    el.style.top = (anchor.getBoundingClientRect().bottom - app.top + 8) + 'px';
    el.style.left = '12px'; el.style.right = '12px';
  }
  function dockScrim() {
    const scrim = $('#scrim'); if (!scrim) return;
    if (window.innerWidth < 760 && !scrim.hidden) {
      let bottom = 0;
      ['#strip', '#layers', '#meter', '#rolls', '#beats'].forEach(q => {
        const el = $(q); if (el && !el.hidden) bottom = Math.max(bottom, el.getBoundingClientRect().bottom);
      });
      scrim.style.top = bottom + 'px';
    } else {
      scrim.style.top = '';
    }
  }
  function parentCluster(id, leads, onInfo) {
    const doc = M.lib[id]; const cv = thumbCanvas();
    const name = h('span', { class: 'pn', text: doc ? doc.name : id });
    const metaKids = [name];
    if (leads) metaKids.push(h('span', { class: 'leads', text: 'leads' }));
    const kids = [cv, h('div', { class: 'parent-meta' }, metaKids)];
    const el = onInfo
      ? h('button', { class: 'parent-side', 'aria-label': (doc ? doc.name : id) + ' leads the blend. Activate for what that means.', onclick: onInfo }, kids)
      : h('div', { class: 'parent-side' }, kids);
    regThumb(cv, () => M.lib[id], { still: true });
    return el;
  }
  function mixSlider(m, A, B) {
    let undid = false;
    const inp = h('input', { type: 'range', min: 0, max: 100, step: 25, value: m.mix, 'aria-label': 'Mix, more ' + A.name + ' or more ' + B.name });
    const snap = v => Math.round(v / 25) * 25;
    inp.addEventListener('input', () => {
      if (!undid) { pushUndo(); undid = true; }
      applyBlend(x => { x.mix = snap(+inp.value); }, { live: true, noUndo: true });
    });
    inp.addEventListener('change', () => {
      if (!undid) pushUndo();
      applyBlend(x => { x.mix = snap(+inp.value); }, { noUndo: true });
    });
    return h('div', { class: 'mix-block' }, [
      h('div', { class: 'mix-ends' }, [h('span', { text: 'more ' + A.name }), h('span', { text: 'more ' + B.name })]),
      inp,
      h('div', { class: 'mix-ticks', 'aria-hidden': 'true' }, [0, 25, 50, 75, 100].map(v => h('span', { text: String(v) })))
    ]);
  }
  function steamRow(m, rx) {
    if (!rx) return null;
    return h('div', { class: 'suggest-slim' }, [
      h('span', { class: 'sg-text', text: m.reaction ? (rx.name + ' is on') : ('These colours can make ' + rx.name) }),
      h('button', { class: 'try-text', 'aria-label': (m.reaction ? 'Undo ' : 'Try ') + rx.name, onclick: () => applyBlend(x => { x.reaction = !x.reaction; }), text: m.reaction ? 'Undo' : 'Try' })
    ]);
  }
  function blendHome(body, m) {
    const A = M.lib[m.a], B = M.lib[m.b];
    const rx = M.reactionFor(A.layers.colour.ramp, B.layers.colour.ramp);
    const hd = head('Blend');
    body.append(h('div', { class: 'parents' }, [
      parentCluster(m.a, true, () => toast('A leads the blend and owns the Hit.')),
      h('button', { class: 'btn-swap', 'aria-label': 'Swap A and B', onclick: () => applyBlend(x => { const t = x.a; x.a = x.b; x.b = t; }), text: '⇄' }),
      parentCluster(m.b, false)
    ]));
    body.append(mixSlider(m, A, B));
    const steam = steamRow(m, rx); if (steam) body.append(steam);
    if (!isChipsBlend()) {
      body.append(h('button', { class: 'fine-tune', onclick: () => { closePickPop(true); openSheet('blend', 'fine'); }, text: 'Fine-tune parts ›' }));
    }
    return [hd];
  }
  function blendFine(body, m) {
    const hd = h('div', { class: 'sheet-head' }, [
      h('button', { class: 'icon-btn', 'aria-label': 'Back to blend', onclick: () => openSheet('blend'), text: '‹' }),
      h('h2', { text: 'Fine-tune' }),
      h('span', { class: 'sub', html: '' }),
      seg([['layer', 'Layer'], ['beat', 'Beat']], m.by, v => applyBlend(x => { x.by = v; }), 'By layer or by beat'),
      h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: closeSheet, text: '×' })
    ]);
    const rows = m.by === 'layer' ? M.LAYERS.map(k => ({ lab: M.LAYER_LABEL[k], cur: m.pick[k] || 'A', set: v => applyBlend(x => { x.pick[k] = v; }) }))
                                  : M.BEATS.map(b => ({ lab: M.BEAT_LABEL[b] + (b === 'travel' ? ' · later' : ''), cur: m.beatPick[b], set: v => applyBlend(x => { x.beatPick[b] = v; }) }));
    rows.forEach(r => body.append(h('div', { class: 'ft-row' }, [
      h('span', { class: 'pl', text: r.lab }),
      seg([['A', 'A'], ['B', 'B'], ['Both', 'Both']], r.cur, r.set, r.lab)
    ])));
    return [hd];
  }

  /* ---------- sheets ---------- */
  function closeSheet() {
    closePickPop(true);
    S.sheet = null; S.pickPop = null;
    $('#sheet').hidden = true; $('#scrim').hidden = true; $('#scrim').style.top = '';
    S.selLayer = null; S.selBeat = null; renderLayers(); renderBeats(); renderCaps();
  }
  function head(title, sub, extra) {
    return h('div', { class: 'sheet-head' }, [h('h2', { text: title }), h('span', { class: 'sub', html: sub || '' }), ...(extra || []), h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: closeSheet, text: '×' })]);
  }
  function slider(label, val, min, max, step, fmt, onin) {
    const out = h('span', { text: fmt(val) });
    const inp = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
    inp.addEventListener('input', () => { out.textContent = fmt(+inp.value); onin(+inp.value, false); });
    inp.addEventListener('change', () => onin(+inp.value, true));
    return h('div', { class: 'field' }, [h('div', { class: 'fl' }, [h('span', { text: label }), out]), inp]);
  }
  function seg(opts, cur, fn, label) {
    return h('div', { class: 'seg', role: 'group', 'aria-label': label || '' }, opts.map(o => h('button', { 'aria-pressed': String(cur) === String(o[0]), onclick: () => fn(o[0]) }, [h('span', { class: 'seg-pill', text: o[1] })])));
  }
  function liveSet(fn) { // slider drag: update live, one undo on release
    return (v, done) => { if (done) { pushUndo(); } fn(v); S.trim = null; renderMeter(); renderLayers(); if (done) renderRolls(); };
  }

  function openSheet(kind, arg, refresh) {
    const sh = $('#sheet'); const prevScroll = refresh && sh.querySelector('.sheet-body') ? sh.querySelector('.sheet-body').scrollTop : 0;
    S.sheet = { kind, arg };
    let cls = 'sheet';
    if (kind === 'blend') cls += (arg === 'fine' ? ' blend-fine' : ' blend-home');
    sh.className = cls; sh.innerHTML = ''; sh.hidden = false;
    const body = h('div', { class: 'sheet-body' });
    const B = SHEETS[kind](body, arg) || [];
    sh.append(...B, body);
    body.scrollTop = prevScroll;
    renderCaps(); dockSheet(); dockScrim();
    if (kind === 'blend' && arg !== 'fine') maybeShowCoach();
    else hideCoach();
  }
  function dockSheet() {
    const sh = $('#sheet');
    if (window.innerWidth < 760) { sh.style.top = ''; sh.style.maxHeight = ''; return; }
    let bottom = 0; ['#strip', '#layers', '#meter', '#rolls', '#beats'].forEach(q => { const el = $(q); if (!el.hidden) bottom = Math.max(bottom, el.getBoundingClientRect().bottom); });
    sh.style.top = (bottom + 8) + 'px'; sh.style.maxHeight = 'none';
  }
  const SHEETS = {
    layer(body, k) {
      S.selLayer = k; const L = S.doc.layers[k], pv = provOf(k), adv = S.mode === 'adv';
      const provBtn = pv ? h('button', { class: 'prov ' + pv.state, onclick: () => { if (pv.state === 'changed') updateFromSource(k); }, 'aria-label': pv.text, text: pv.state === 'ok' ? '↳ ' + pv.text : pv.state === 'changed' ? '⟳ ' + pv.text : '⌀ ' + pv.text }) : null;
      const side = sideOf(k);
      const hd = head(M.LAYER_LABEL[k], side ? `side ${side === 'AB' ? 'A+B' : side}` : '', provBtn ? [provBtn] : []);
      const set = (fn) => liveSet(v => { fn(v); S.doc.touched[k] = true; });
      if (k === 'shape') {
        body.append(h('div', { class: 'note', text: 'Hit shape' }), h('div', { class: 'row scroll', style: 'padding:0' }, ['arc', 'ring', 'star', 'cross', 'pillar'].map(s => h('button', { class: 'chip-btn', 'aria-pressed': L.hit === s, onclick: () => change(() => { L.hit = s; S.doc.touched.shape = true; }), text: { arc: 'Arc', ring: 'Ring', star: 'Star', cross: 'Cross', pillar: 'Pillar' }[s] }))));
        body.append(slider('Size', L.size, .6, 1.6, .05, v => v.toFixed(2) + '×', set(v => { L.size = v; })));
        body.append(slider('Speed', L.speed, .6, 1.8, .05, v => v.toFixed(2) + '×', set(v => { L.speed = v; })));
        if (adv) body.append(slider('Bend (travel path)', L.bend, 0, 1, .05, v => Math.round(v * 100) + '%', set(v => { L.bend = v; })));
      } else if (k === 'colour') {
        body.append(h('div', { class: 'note', text: 'Ramp (palette colours only)' }), h('div', { class: 'row scroll', style: 'padding:0' }, Object.keys(R.RAMPS).map(r => h('button', { class: 'chip-btn', 'aria-pressed': L.ramp === r, onclick: () => change(() => { L.ramp = r; S.doc.touched.colour = true; if (S.doc.layers.sparks.ramp && !S.doc.layers.sparks.extra) S.doc.layers.sparks.ramp = r; }) }, [rampSw(r), h('span', { text: R.RAMP_LABEL[r] })]))));
        body.append(slider('Bright', L.bright, -1, 1, 1, v => ['Deep', 'As ramp', 'Bright'][v + 1], set(v => { L.bright = v; })));
        if (L.steps && L.steps.length) {
          const inner = L.steps.find(s => s.role === 'inner') || L.steps[0];
          const outer = L.steps.find(s => s.role === 'outer') || L.steps[1];
          body.append(h('div', { class: 'note', text: 'Joined colour steps. Each step keeps its own ramp. The rim is the outer step’s ramp — there is no separate rim field.' }));
          body.append(h('div', { class: 'note', html: `Inner: ${esc(R.RAMP_LABEL[inner.ramp] || inner.ramp)} · Outer (rim): ${esc(outer ? (R.RAMP_LABEL[outer.ramp] || outer.ramp) : '—')}` }));
        } else if (adv) {
          body.append(h('div', { class: 'note', text: 'A second colour is a joined outer step (Blend, Colour = Both), not a rim-ramp field.' }));
        }
      } else if (k === 'sparks') {
        body.append(slider('Amount', L.amount, 0, 48, 1, v => v + ' of 48', set(v => { L.amount = v; })));
        body.append(slider('Life', L.life, .3, 1.2, .05, v => Math.round(v * 1000) + ' ms', set(v => { L.life = v; })));
        body.append(slider('Pull', L.pull, -1, 1, .1, v => v < -.15 ? 'Burst out' : v > .15 ? 'Draw in' : 'Drift', set(v => { L.pull = v; })));
        if (L.extra) body.append(h('div', { class: 'note', text: `Plus ${L.extra.amount} ${R.RAMP_LABEL[L.extra.ramp] || ''} sparks from side B` }));
      } else if (k === 'light') {
        body.append(h('div', { class: 'field' }, [h('div', { class: 'fl' }, [h('span', { text: 'Light' })]), seg([['off', 'Off'], ['steady', 'Steady'], ['pop', 'Pop']], L.mode, v => change(() => { L.mode = v; S.doc.touched.light = true; }))]));
        body.append(slider('Radius', L.radius, 1, 3, 1, v => v + (v > 1 ? ' tiles' : ' tile'), set(v => { L.radius = v; })));
      } else if (k === 'punch') {
        body.append(slider('Punch', L.level, 0, 3, 1, v => ['Off', 'Soft', 'Firm', 'Heavy'][v], set(v => { L.level = v; })));
        body.append(slider('Shake (inside the preview only)', L.shake, 0, 3, 1, v => ['Off', 'Low', 'Mid', 'Full'][v], set(v => { L.shake = v; })));
      } else if (k === 'trail') {
        body.append(slider('Length', L.len, 0, 8, 1, v => v ? v + ' steps' : 'Off', set(v => { L.len = v; })));
      }
      const what = { shape: 'motion', colour: 'colour', sparks: 'sparks' }[k];
      body.append(h('div', { class: 'actions' }, [
        what ? h('button', { class: 'btn btn-ghost', onclick: () => { S.pick = { label: `Take ${what} from`, fn: id => take(id, what) }; closeSheet(); renderAll(); }, text: 'Take from…' }) : null,
        h('button', { class: 'btn btn-ghost', onclick: rollDice, text: '🎲 Roll this layer' }),
        h('button', { class: 'btn btn-ghost', onclick: () => shelfLayer(k), text: '♡ Shelf it' })]));
      return [hd];
    },
    beat(body, b) {
      S.selBeat = b; const src = S.doc.beatSrc[b] || null;
      const hd = head(M.BEAT_LABEL[b] + ' beat', 'Advanced');
      if (b === 'travel') body.append(h('div', { class: 'note', text: 'Travel arrives in a later update. The path shows still in the preview for now.' }));
      if (b === 'hit') body.append(h('div', { class: 'note', text: '“Hit here” stays in this effect. The sprite is not changed.' }));
      body.append(h('div', { class: 'note', text: 'Take this beat from' }));
      const opts = [null].concat(S.userCards.map(c => c.id), M.PRESETS.map(p => p.id).filter(id => id !== S.doc.base));
      body.append(h('div', { class: 'row scroll', style: 'padding:0' }, opts.slice(0, 14).map(id => h('button', { class: 'chip-btn', 'aria-pressed': src === id, onclick: () => change(() => { if (id) S.doc.beatSrc[b] = id; else delete S.doc.beatSrc[b]; }), text: id ? nameOf(id) : 'This effect' }))));
      const n = S.doc.timing.nudge[b];
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: `Nudge <small>${n > 0 ? '+' : ''}${n} ms · 30 ms steps</small>` }),
        h('button', { class: 'btn btn-ghost', 'aria-label': 'Nudge earlier', onclick: () => change(() => { S.doc.timing.nudge[b] = Math.max(-180, n - 30); }), text: '−30' }),
        h('button', { class: 'btn btn-ghost', 'aria-label': 'Nudge later', onclick: () => change(() => { S.doc.timing.nudge[b] = Math.min(180, n + 30); }), text: '+30' })]));
      const isStart = S.doc.timing.start === b;
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: 'Start here <small>skip the beats before it</small>' }),
        h('button', { class: 'switch', role: 'switch', 'aria-checked': isStart, 'aria-label': 'Start at ' + M.BEAT_LABEL[b], onclick: () => change(() => { S.doc.timing.start = isStart ? 'cast' : b; }) })]));
      body.append(h('div', { class: 'actions' }, [h('button', { class: 'btn btn-ghost', onclick: () => openSheet('rhythm'), text: '👆 Tap the rhythm' })]));
      return [hd];
    },
    take(body, id) {
      const p = M.lib[id]; const cv = thumbCanvas(); regThumb(cv, () => gridDocOrUser(id));
      const hd = head(p.name, 'hold menu');
      body.append(h('div', { class: 'ab-head' }, [h('div', { class: 'ab-side' }, [cv, h('span', { html: `Take a part into <b>${esc(S.doc.name)}</b><small>The part keeps a “from ${esc(p.name)}” note.</small>` })])]));
      body.append(h('div', { class: 'grid2' }, ['sparks', 'colour', 'motion', 'timing'].map(w => h('button', { class: 'btn btn-ghost', onclick: () => { closeSheet(); take(id, w); }, text: 'Take its ' + w }))));
      body.append(h('div', { class: 'actions' }, [
        h('button', { class: 'btn btn-primary', onclick: () => { closeSheet(); makeBlend(S.selCard && M.lib[S.selCard] ? S.selCard : S.doc.base, id); }, text: 'Blend into current' }),
        h('button', { class: 'btn btn-ghost', onclick: () => { closeSheet(); toggleShelf(id); }, text: S.shelf.some(s => s.id === id) ? '♥ On shelf' : '♡ Shelf it' })]));
      return [hd];
    },
    blend(body, arg) {
      const m = S.doc.blend; if (!m) { closeSheet(); return []; }
      return arg === 'fine' ? blendFine(body, m) : blendHome(body, m);
    },
    shelf(body) {
      const hd = head('Shelf', `${S.shelf.length} of 48 · references only · this project`);
      if (!S.shelf.length) body.append(h('p', { class: 'note', text: 'Tap ♡ on any effect, or “Shelf it” on a layer. A shelved layer is a one-part effect the shelf only references. Liking is not using: the shelf gives nothing to an ability until you say so.' }));
      const g = h('div', { class: 'shelf-grid' });
      S.shelf.forEach((it, i) => g.append(shelfCard(it, i, () => { S.selShelf = S.selShelf === i ? null : i; openSheet('shelf', null, true); })));
      body.append(g);
      const it = S.shelf[S.selShelf];
      const isPart = it && (it.layer || (M.lib[it.id] && M.lib[it.id].onePart));
      if (it && !isPart) body.append(h('div', { class: 'note', text: 'Give ' + nameOf(it.id) + ' to' }), h('div', { class: 'row scroll', style: 'padding:0' }, ['Cleave', 'Ember shot', 'Second wind', 'Ward'].map(a => h('button', { class: 'chip-btn', onclick: () => toast(`${a} now uses ${nameOf(it.id)}`, 'Undo', () => hideToast()), text: a }))));
      if (isPart) { const k = it.layer || M.lib[it.id].onePart; body.append(h('div', { class: 'note', text: 'A one-part effect the shelf only references.' }), h('div', { class: 'actions' }, [h('button', { class: 'btn btn-primary', onclick: () => applyShelfLayer(it), text: `Add this ${M.LAYER_LABEL[k].toLowerCase()} to ${S.doc.name}` })])); }
      if (S.shelf.filter(s => s.type === 'effect' && !(s.layer || (M.lib[s.id] && M.lib[s.id].onePart))).length >= 2) body.append(h('div', { class: 'actions' }, [h('button', { class: 'btn btn-ghost', onclick: () => openSheet('breed'), text: '✧ Breed from shelf' })]));
      return [hd];
    },
    house(body) {
      const H = S.house;
      const hd = head('House style', "this project's editor defaults");
      body.append(h('p', { class: 'note', text: 'New effects and layers start with these, so the set feels like one game. A value you set yourself is never changed. Day uses btf-ashroad@3 effect ramps; Moonlit uses btf-moonlit@4 (fire stays fire — no pink stand-in).' }));
      body.append(h('div', { class: 'note', text: 'Ramp family' }), h('div', { class: 'row scroll', style: 'padding:0' }, Object.entries(M.HOUSE_FAMILIES).map(([k, f]) => {
        const pal = (R.STYLES && R.STYLES[f.style || 'ashroad']) || R.RAMPS;
        const keys = (f.ramps && f.ramps.length) ? f.ramps : ['fire', 'frost', 'holy', 'venom'];
        const stop = r => (pal[r] || R.RAMPS[r] || pal.fire)[Math.min(3, ((pal[r] || pal.fire).length - 1))];
        return h('button', { class: 'chip-btn', 'aria-pressed': H.family === k, onclick: () => change(() => { H.family = k; applyStyle(); }) }, [h('span', { class: 'ramp' }, keys.map(r => h('i', { style: 'background:' + stop(r) }))), h('span', { text: f.label })]);
      })));
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: 'Pixel size <small>effect pixels next to the sprite</small>' }), seg([[1, 'Match'], [2, 'Chunky']], H.pixel, v => change(() => { H.pixel = v; }), 'Pixel size')]));
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: 'Punch <small>default hit feel</small>' }), seg([['', 'As made'], [0, '0'], [1, '1'], [2, '2'], [3, '3']], H.punch == null ? '' : H.punch, v => change(() => { H.punch = v === '' ? null : +v; }), 'Punch')]));
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: 'Motes <small>a few drifting specks on every effect</small>' }), h('button', { class: 'switch', role: 'switch', 'aria-checked': H.motes, 'aria-label': 'Motes', onclick: () => change(() => { H.motes = !H.motes; }) })]));
      return [hd];
    },
    lab(body) {
      const hd = head('Lab', 'bold ideas · each checked against the budget');
      const base = S.doc;
      const fitsPill = (d) => {
        const c = M.resolve(d, ctxOf()).cost; const cap = c.capP || 48;
        return c.over
          ? h('span', { class: 'pill over', text: `Over: ${c.particles}/${cap} · ${c.draws}/60 · ${c.steps}/12 → Fit` })
          : h('span', { class: 'pill fits', text: `Fits: ${c.particles}/${cap} · ${c.draws}/60 · ${c.steps}/12` });
      };
      const withExp = (o) => { const d = M.clone(base); d.exp = Object.assign({}, d.exp, o); return d; };
      const kids = M.breed(M.lib[base.base] || base, M.lib[partnerId()], 9013, S.house);
      const kOver = kids.filter(k => M.resolve(k, ctxOf()).cost.over).length;
      const rows = [
        ['Breed', 'first', 'Pick two, get 6 children with mixed parts.', h('span', { class: 'pill ' + (kOver ? 'over' : 'fits'), text: `${6 - kOver} of 6 fit · ${kOver} flagged` }), () => openSheet('breed')],
        ['Caster colours', 'first', "Colour from the caster sprite's palette, nearest ramp, boosted.", h('span', { class: 'pill zero', text: '0 particles · 0 draws' }), () => change(() => { S.doc.layers.colour.ramp = 'frost'; S.doc.layers.colour.bright = 1; S.doc.touched.colour = true; }, "Caster colours: Frost, one step brighter (from the Knight's palette)")],
        ['Tap the rhythm', 'first', 'Tap the beats; timings snap to 30 ms.', h('span', { class: 'pill zero', text: '0 particles · 0 draws' }), () => openSheet('rhythm')],
        ['Export as asset', 'first', 'A sprite sheet of this effect.', h('span', { class: 'pill zero', text: 'No game cost' }), () => openSheet('export')],
        ['Power-up tiers', 'next', 'Lv1–3 switch extra steps on. Tier-up runs through Fit. Later: value scaling.', fitsPill(withExp({ tier: 2 })), null, true],
        ['Element reactions', 'next', 'Fire + Frost suggests Steam while you blend.', h('span', { class: 'pill zero', text: 'Same budget as the blend' }), null],
        ['Combo fusion', 'stretch', 'Two hits on one tile: a ready-made fused look swaps in.', fitsPill(withExp({ fusion: true })), () => change(() => { S.doc.exp.fusion = !S.doc.exp.fusion; }, null)],
        ['Living linger', 'stretch', 'Linger spreads to nearby tiles. Visual only.', fitsPill(withExp({ living: true, livingTiles: 4 })), () => change(() => { S.doc.exp.living = !S.doc.exp.living; S.doc.exp.livingTiles = 4; }, null)],
        ['Draw the spell', 'later', 'A finger stroke becomes the path. Needs travel.', h('span', { class: 'pill zero', text: 'Same as travel' }), null],
        ['World-aware linger', 'later', 'Scorch on grass, ice on water. Needs map reads.', h('span', { class: 'pill zero', text: 'Same as linger' }), null]
      ];
      rows.forEach(([n, tag, desc, pill, fn, tiers]) => {
        const act = tiers ? seg([[0, 'Lv1'], [1, 'Lv2'], [2, 'Lv3']], (S.doc.exp && S.doc.exp.tier) || 0, v => setTier(+v), 'Tier')
          : fn ? h('button', { class: 'btn btn-ghost', onclick: fn, text: (n === 'Combo fusion' && S.doc.exp.fusion) || (n === 'Living linger' && S.doc.exp.living) ? 'Turn off' : 'Try' }) : h('span', { class: 'tag', text: n === 'Element reactions' ? 'in Blend' : 'later' });
        body.append(h('div', { class: 'lab-row' }, [h('div', { class: 'lt' }, [h('b', { html: `${esc(n)} <span class="tag">${tag}</span>` }), h('span', { text: desc }), pill]), act]));
      });
      return [hd];
    },
    breed(body) {
      const a = M.lib[S.doc.base] || M.lib[S.selCard] || M.lib['fireball'];
      const b = M.lib[partnerId()];
      if (!S.kids || S.kids.of !== a.id + b.id) { S.kids = { of: a.id + b.id, list: M.breed(a, b, 9013, S.house), seed: 9013 }; S.kidPlay = 0; S.kidPage = 0; }
      const hd = head('Breed', `${esc(a.name)} × ${esc(b.name)} · 6 children`);
      const wrap = h('div', { class: 'kids' });
      for (let pg = 0; pg < 2; pg++) {
        const page = h('div', { class: 'kpage' });
        for (let i = pg * 3; i < pg * 3 + 3; i++) {
          const k = S.kids.list[i], cv = thumbCanvas(), c = M.resolve(k, ctxOf()).cost, playing = S.kidPlay === i;
          const flip = (k.flips && k.flips.length) ? k.flips.join(' · ') : '';
          page.append(h('button', { class: 'kid', 'aria-pressed': playing, 'aria-label': k.name + (flip ? ', ' + flip : '') + (playing ? ', playing' : ', tap to play'), onclick: () => { S.kidPlay = i; openSheet('breed', null, true); } }, [cv,
            h('div', { class: 'kn' }, [h('span', { text: k.name }), h('span', { class: 'pill ' + (c.over ? 'over' : 'fits'), text: c.over ? 'Over' : 'Fits' })]),
            h('div', { class: 'still', text: flip || (playing ? '▶ playing' : 'still · tap to play') })]));
          regThumb(cv, () => k, { still: !playing });
        }
        wrap.append(page);
      }
      wrap.addEventListener('scroll', () => { const p = Math.round(wrap.scrollLeft / wrap.clientWidth); if (p !== S.kidPage) { S.kidPage = p; dots.querySelectorAll('i').forEach((d, j) => d.className = j === p ? 'on' : ''); } });
      const dots = h('div', { class: 'dots' }, [h('i', { class: S.kidPage === 0 ? 'on' : '' }), h('i', { class: S.kidPage === 1 ? 'on' : '' })]);
      body.append(wrap, dots);
      setTimeout(() => { wrap.scrollLeft = S.kidPage * wrap.clientWidth; }, 0);
      const kid = S.kids.list[S.kidPlay];
      body.append(h('div', { class: 'actions' }, [
        h('button', { class: 'btn btn-ghost', onclick: () => { S.kidPage = 1 - S.kidPage; wrap.scrollTo({ left: S.kidPage * wrap.clientWidth }); }, text: S.kidPage ? '‹ First 3' : 'Next 3 ›' }),
        h('button', { class: 'btn btn-ghost', onclick: () => { S.kids.seed += 1; S.kids.list = M.breed(a, b, S.kids.seed, S.house); S.kidPlay = 0; openSheet('breed', null, true); }, text: '🎲 New litter' }),
        h('button', { class: 'btn btn-primary', onclick: () => keepKid(kid), text: 'Keep ' + kid.name })]));
      return [hd];
    },
    rhythm(body) {
      const names = ['start', 'travel', 'hit', 'linger', 'end'];
      const hd = head('Tap the rhythm', 'snaps to 30 ms');
      const n = S.rhythm.length;
      body.append(h('button', { class: 'tap-pad', id: 'tap-pad', onclick: () => { S.rhythm.push(performance.now()); if (S.rhythm.length === 5) applyRhythm(S.rhythm); openSheet('rhythm', null, true); } , text: n < 5 ? `Tap: ${names[n]}  (${n + 1} of 5)` : 'Done · tap again to redo' }));
      if (n >= 5) S.rhythm = [];
      const last = S.doc.rhythmShown;
      if (last) body.append(h('p', { class: 'note', text: `Cast ${last[0]} ms · Travel ${last[1]} ms · Hit ${last[2]} ms · Linger ${last[3]} ms` }));
      body.append(h('p', { class: 'note', text: 'Tap along while it plays. Uneven taps are fine: every beat snaps to the 30 ms grid, and one Undo puts it back.' }));
      return [hd];
    },
    export(body) {
      const hd = head('Export', 'sprite sheet · offline');
      const cv = h('canvas', { class: 'px sheet-strip', width: 48 * 8, height: 32 });
      body.append(cv);
      const g = R.geom('sheet'), ctx = cv.getContext('2d'), Rr = res(), T = R.timeline(Rr);
      const off = document.createElement('canvas'); off.width = g.W; off.height = g.H; const oc = off.getContext('2d');
      for (let i = 0; i < 8; i++) { R.draw(oc, g, Rr, (T.total - 520) * (i + .5) / 8); ctx.drawImage(off, i * 48, 0); }
      body.append(h('div', { class: 'note', text: '8 frames · 12 fps · 384 × 32 px' }));
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: 'Format' }), seg([['sheet', 'Sprite sheet'], ['gif', 'GIF (later)']], 'sheet', () => toast('GIF strip comes later'), 'Format')]));
      body.append(h('div', { class: 'switch-row' }, [h('span', { class: 'lt', html: "Export clean <small>removes the “from” links · the look stays</small>" }), h('button', { class: 'switch', role: 'switch', 'aria-checked': S.exportClean, 'aria-label': 'Export clean', onclick: () => { S.exportClean = !S.exportClean; openSheet('export', null, true); } })]));
      body.append(h('div', { class: 'actions' }, [h('button', { class: 'btn btn-primary', onclick: () => toast('Mock only: no file was written'), text: 'Export' })]));
      return [hd];
    },
    more(body) {
      const hd = head(S.doc.name, 'this effect');
      body.append(h('div', { class: 'menu-list' }, [
        h('button', { class: 'btn btn-ghost', onclick: () => { S.pick = { label: 'Blend with', fn: id => makeBlend(S.doc.base && M.lib[S.doc.base] ? S.doc.base : S.selCard, id) }; closeSheet(); renderAll(); }, text: '⊕ Blend with…' }),
        h('button', { class: 'btn btn-ghost', onclick: () => { S.pick = { label: 'Take sparks from', fn: id => take(id, 'sparks') }; closeSheet(); renderAll(); }, text: '↳ Take a part from…' }),
        h('button', { class: 'btn btn-ghost', onclick: () => openSheet('export'), text: '⇩ Export…' }),
        h('button', { class: 'btn btn-ghost mock', onclick: () => { mockEditSource('fireball'); closeSheet(); }, text: 'Mock: someone edits Fireball' }),
        h('button', { class: 'btn btn-ghost mock', onclick: () => { S.removed.fireball = true; closeSheet(); renderAll(); toast('Mock: Fireball was removed'); }, text: 'Mock: Fireball is removed' })]));
      return [hd];
    }
  };
  function partnerId() {
    const sh = S.shelf.find(s => s.type === 'effect' && !s.layer && !(M.lib[s.id] && M.lib[s.id].onePart) && s.id !== S.doc.base && M.lib[s.id]);
    return sh ? sh.id : (S.doc.base === 'frost-shard' ? 'fireball' : 'frost-shard');
  }
  function keepKid(k) {
    pushUndo(); const d = M.clone(k); d.name = k.name + ' (bred)'; d.id = 'bred-' + k.id; d.breedOf = k.breedOf; delete d.blend;
    d.touched = { colour: true }; d.exp = {}; d.beatSrc = {};
    S.userCards.unshift(d); M.lib[d.id] = d; S.doc = M.clone(d); S.selCard = d.id; S.trim = null;
    closeSheet(); renderAll(); toast(`Kept ${d.name}`, 'Undo', undo);
  }
  function applyRhythm(ts) {
    const iv = [0, 1, 2, 3].map(i => Math.round((ts[i + 1] - ts[i]) / 30) * 30);
    pushUndo();
    const base = { cast: 420, travel: 360, hit: 330, linger: 240 + 150 * S.doc.timing.lingerSteps }, sp = S.doc.layers.shape.speed;
    const hasTravel = S.doc.layers.shape.travel && S.doc.layers.shape.travel !== 'none';
    M.BEATS.forEach((b, i) => { if (b === 'travel' && !hasTravel) { S.doc.timing.nudge[b] = 0; return; } S.doc.timing.nudge[b] = M.clamp(Math.round((iv[i] - base[b] / sp) / 30) * 30, -300, 600); });
    S.doc.rhythmShown = iv; renderAll(); toast('Rhythm set from your taps', 'Undo', undo);
  }
  function mockEditSource(id) {
    const p = M.lib[id]; p.rev += 1; p.layers.sparks.amount = Math.min(40, p.layers.sparks.amount + 6); p.layers.sparks.pull = -.8; p.layers.colour.bright = 1;
    renderAll(); toast(`Mock: ${p.name} was edited (rev ${p.rev})`);
  }

  /* ---------- loop ---------- */
  const strip = $('#preview'), sctx = strip.getContext('2d'), G = R.geom('strip');
  let lastBeat = null, frameN = 0, beatEls = null;
  function sizeStrip() {
    const w = $('#strip').clientWidth; const hmax = window.innerWidth >= 760 ? window.innerHeight * .42 : 9999; const sc = Math.max(1, Math.min(Math.floor(w / 130 + .05), Math.floor(hmax / 56)));
    strip.style.width = Math.min(w, 130 * sc) + 'px'; strip.style.margin = '0 auto';
  }
  function tick(now) {
    const t = S.freeze != null ? S.freeze : now - S.t0;
    const Rr = res();
    const info = R.draw(sctx, G, Rr, t, { forceBeat: S.forceBeat });
    if (info.beat !== lastBeat) { lastBeat = info.beat; renderCaps(info.beat); }
    if (S.mode === 'adv') {
      const T = info.T; document.querySelectorAll('#beats .beat').forEach(el => {
        const b = el.dataset.beat, tb = T[b], m = info.ms >= T.hitAt + T.stop ? info.ms - T.stop : Math.min(info.ms, T.hitAt);
        const p = tb.d ? Math.max(0, Math.min(1, (m - tb.s) / tb.d)) : 0; el.firstChild.style.width = (p * 100) + '%';
      });
    }
    if ((frameN++ & 1) === 0) {
      thumbs.forEach(th => {
        if (!th.cv.isConnected) return;
        const d = th.getDoc(); if (!d) return; const rr = M.resolve(d, ctxOf()); const T = R.timeline(rr);
        const tt = th.still || S.freeze != null ? T.hitAt + T.stop + 90 + (th.off % 3) * 60 : t + th.off;
        R.draw(th.cv.getContext('2d'), R.geom('thumb'), rr, tt);
      });
    }
    requestAnimationFrame(tick);
  }

  /* ---------- wiring ---------- */
  function setTheme(t) { S.theme = t; document.documentElement.setAttribute('data-theme', t); }
  $('#btn-theme').onclick = () => setTheme(S.theme === 'light' ? 'dark' : 'light');
  $('#btn-more').onclick = () => openSheet('more');
  $('#btn-dice').onclick = rollDice;
  $('#btn-style').onclick = () => openSheet('house');
  $('#btn-shelf').onclick = () => openSheet('shelf');
  $('#btn-lab').onclick = () => openSheet('lab');
  $('#btn-save').onclick = save;
  $('#btn-back').onclick = () => toast('Back to Cleave (mock)');
  $('#mode-basic').onclick = () => { S.mode = 'basic'; S.selBeat = null; if (S.sheet && S.sheet.kind === 'beat') closeSheet(); renderAll(); };
  $('#mode-adv').onclick = () => { S.mode = 'adv'; renderAll(); };
  $('#scrim').onclick = () => {
    if ($('#pick-pop') && !$('#pick-pop').hidden) { closePickPop(); return; }
    if ($('#coach') && !$('#coach').hidden) { dismissCoach(); return; }
    closeSheet();
  };
  $('#strip').addEventListener('click', e => { if (e.target === strip) S.t0 = performance.now(); });
  window.addEventListener('resize', () => { sizeStrip(); dockSheet(); dockScrim(); placePickPop(); placeCoach(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('#pick-pop') && !$('#pick-pop').hidden) { closePickPop(); return; }
    if ($('#coach') && !$('#coach').hidden) { dismissCoach(); return; }
    if (S.pick) { S.pick = null; renderAll(); return; }
    closeSheet();
  });

  renderAll(); sizeStrip(); requestAnimationFrame(tick);

  /* ---------- test hooks (used by scripts/capture.py only) ---------- */
  window.__fx = {
    S, M, R, ready: true, editBlend, setTheme, renderAll, openSheet, closeSheet, makeBlend, take, toggleShelf, rollDice, fitNow, setTier, keepKid, applyRhythm, mockEditSource, useCard,
    setKind(k) { S.kind = k; renderAll(); },
    setMode(m) { S.mode = m; renderAll(); },
    freezeAt(beat, frac) { const T = R.timeline(res()); S.freeze = beat === 'abs' ? frac : (beat === 'hit' ? T.hitAt + T.stop : T[beat].s) + (T[beat] ? T[beat].d : 0) * (frac || 0); },
    unfreeze() { S.freeze = null; },
    selLayer(k) { S.selLayer = k; renderLayers(); openSheet('layer', k); },
    selBeat(b) { S.selBeat = b; renderBeats(); openSheet('beat', b); },
    cost() { return res().cost; },
    openPickPop, closePickPop,
    setBlendUi(m) { S.blendUi = m || null; if (S.sheet && S.sheet.kind === 'blend') openSheet('blend', S.sheet.arg, true); },
    showCoach() { S.forceCoach = true; maybeShowCoach(); },
    sheetBox() { const sh = $('#sheet'); if (!sh || sh.hidden) return null; const r = sh.getBoundingClientRect(); return { h: Math.round(r.height * 10) / 10, pct: Math.round(r.height / innerHeight * 1000) / 10, vh: innerHeight, w: Math.round(r.width * 10) / 10 }; }
  };
})();
