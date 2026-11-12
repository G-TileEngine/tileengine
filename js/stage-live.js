/* TileEngine UI shell — round 65: live stage grid (ux/stage-grid-live-plan.md).
   Art view (real code-drawn Starter Pack tiles + sprites, autotiled river banks), Simple blocks view,
   grid lines on/off, tap-to-place popovers (NPC / Building / Terrain / Land), Edit / Move / Delete,
   Assign behaviour for NPCs, move with ghost + red/green footprint, drag on touch.
   SAME DATA, VIEW ONLY: writes map.logic.terrain (paintLogicTile), map.objects (add/update/remove), stage units.
   PROVISIONAL (open Qs in the plan): tile types path/dirt (Q-A1), asset.tiles footprint (Q-D1), unit.kind/npcRole (Q-D2),
   view prefs storage (Q-D3). Hide all code: nothing here shows ids or JSON to the user. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const S = () => window.__state;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200); };

  /* ---------- view prefs (user-level, never the project; Q-D3) ---------- */
  const PREF_KEY = "tileengine.stageview.v1";
  let prefs = { look: "art", lines: true, tapMenus: null };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(PREF_KEY)) || {}); } catch (_) {}
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (_) {} };
  const stageMode = () => (window.Experience && Experience.modeFor ? Experience.modeFor("stage") : "basic");
  const tapMenusOn = () => (prefs.tapMenus == null ? stageMode() === "basic" : !!prefs.tapMenus);

  /* ---------- code-drawn art (Starter Pack recipes; P3 code-drawn terrain) ---------- */
  const cache = {};
  function draw(key, w, h, fn) {
    if (cache[key]) return cache[key];
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    const px = (x, y, col, ww = 1, hh = 1) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
    fn(g, px); return (cache[key] = c.toDataURL());
  }
  const rnd = (seed) => { let x = (seed * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };
  const TILES = {
    floor: { name: "Grass", group: "land" }, path: { name: "Brick path", group: "land" }, dirt: { name: "Dirt", group: "land" },
    water: { name: "River", group: "terrain", blocks: true }, wall_block: { name: "Brick wall", group: "terrain", blocks: true }, lava: { name: "Lava", group: "terrain", blocks: true },
  };
  function tileArt(type, v, mask) { // v: variant 0..2; mask: water banks N1 E2 S4 W8 (neighbour is not water)
    return draw(`t:${type}:${v}:${mask || 0}`, 16, 16, (g, px) => {
      const r = rnd(7 + v * 13 + (mask || 0));
      if (type === "water") {
        px(0, 0, "#3f7fc4", 16, 16);
        [[2, 4], [9, 7], [4, 11], [11, 13]].forEach(([x, y], k) => { const xx = (x + v * 3) % 13; px(xx, y, "#79b4e8", 3, 1); if (k % 2) px(xx + 1, y - 1, "#a8d4f6", 1, 1); });
        px((5 + v * 4) % 13, 9, "#2f63a8", 3, 1);
        const bank = "#d8c08a", edge = "#24425e", grass = "#5f8f45", B = 4; // grass B px, sand 2px, dark edge 1px
        if (mask & 1) { px(0, 0, grass, 16, B); px(0, B, bank, 16, 2); px(0, B + 2, edge, 16, 1); }
        if (mask & 4) { px(0, 16 - B, grass, 16, B); px(0, 14 - B, bank, 16, 2); px(0, 13 - B, edge, 16, 1); }
        if (mask & 8) { px(0, 0, grass, B, 16); px(B, 0, bank, 2, 16); px(B + 2, 0, edge, 1, 16); }
        if (mask & 2) { px(16 - B, 0, grass, B, 16); px(14 - B, 0, bank, 2, 16); px(13 - B, 0, edge, 1, 16); }
        const corner = (cx, cy) => px(cx, cy, grass, B, B);
        if ((mask & 1) && (mask & 8)) corner(0, 0); if ((mask & 1) && (mask & 2)) corner(16 - B, 0);
        if ((mask & 4) && (mask & 8)) corner(0, 16 - B); if ((mask & 4) && (mask & 2)) corner(16 - B, 16 - B);
      } else if (type === "wall_block") {
        px(0, 0, "#5a2e2a", 16, 16);
        for (let row = 0; row < 4; row++) { const y = row * 4, off = row % 2 ? 4 : 0;
          for (let x = -off; x < 16; x += 8) { px(Math.max(0, x + 1), y + 1, "#a8553a", Math.min(7, 16 - Math.max(0, x + 1)) - (x < 0 ? -x - 1 : 0), 2); px(Math.max(0, x + 1), y + 1, "#d07a52", Math.max(0, Math.min(6, 15 - x)), 1); } }
        px(0, 15, "#3a1a1a", 16, 1);
      } else if (type === "path") {
        px(0, 0, "#7a6a58", 16, 16);
        for (let row = 0; row < 4; row++) { const y = row * 4, off = row % 2 ? 2 : 0;
          for (let x = -off; x < 16; x += 4) { const x0 = Math.max(0, x + 1), w = Math.min(x + 4, 16) - x0; if (w > 0) { px(x0, y + 1, (x + row + v) % 3 ? "#b8a68a" : "#c8b89a", w, 3); px(x0, y + 1, "#d8ccb0", w, 1); } } }
      } else if (type === "dirt") {
        px(0, 0, "#8a6440", 16, 16); for (let k = 0; k < 10; k++) px(Math.floor(r() * 16), Math.floor(r() * 16), k % 2 ? "#6e4a30" : "#a87a50");
      } else if (type === "lava") {
        px(0, 0, "#c8401e", 16, 16); for (let k = 0; k < 6; k++) { const x = Math.floor(r() * 13), y = Math.floor(r() * 13); px(x, y, "#f6a030", 3, 2); px(x + 1, y, "#f6e070", 1, 1); }
        px(Math.floor(r() * 14), Math.floor(r() * 14), "#7a1e12", 2, 2);
      } else { // grass
        px(0, 0, "#5f8f45", 16, 16);
        for (let k = 0; k < 9; k++) { const x = Math.floor(r() * 15), y = Math.floor(r() * 14) + 1; px(x, y, "#7fb05a", 1, 2); px(x + 1, y + 1, "#4a7438"); }
        if (v === 2) { px(5, 6, "#f0e070"); px(11, 10, "#f6f6fa"); }
      }
    });
  }
  const OBJECTS = {
    asset_house: { name: "House", fw: 2, fh: 2, blocks: true },
    asset_shop: { name: "Shop", fw: 2, fh: 2, blocks: true },
    asset_well: { name: "Well", fw: 1, fh: 1, blocks: true },
    asset_prop_tree: { name: "Tree", fw: 1, fh: 1, blocks: true },
    asset_rock: { name: "Rock", fw: 1, fh: 1, blocks: true },
    asset_crate: { name: "Crate", fw: 1, fh: 1, blocks: true },
    asset_barrel: { name: "Barrel", fw: 1, fh: 1, blocks: true },
    asset_torch: { name: "Torch", fw: 1, fh: 1, blocks: false },
  };
  const objMeta = (id) => OBJECTS[id] || OBJECTS.asset_prop_tree;
  function objArt(id) {
    const m = objMeta(id), W = m.fw * 16, H = m.fh * 16;
    return draw("o:" + id, W, H, (g, px) => {
      if (id === "asset_house" || id === "asset_shop") {
        const shop = id === "asset_shop", roof = shop ? ["#22305e", "#3d5fa8", "#78aee0"] : ["#8a2e24", "#b8402e", "#e0644a"], ol = "#2a1a1a";
        px(4, 15, ol, 24, 17); px(5, 15, "#c0a878", 22, 16); px(5, 15, "#e8d4a8", 17, 16); // walls
        for (let y = 2; y < 16; y++) { const inset = Math.max(0, 14 - y); const x0 = 1 + Math.floor(inset * 0.5), x1 = 31 - Math.floor(inset * 0.5);
          px(x0, y, ol, x1 - x0, 1); px(x0 + 1, y, roof[1], x1 - x0 - 2, 1); px(x0 + 1, y, roof[2], Math.floor((x1 - x0) * 0.35), 1); px(x1 - 6, y, roof[0], 5, 1); }
        px(1, 15, ol, 30, 1); px(7, 0, ol, 1, 1); if (!shop) { px(22, 2, ol, 4, 6); px(23, 2, "#8a7f78", 2, 5); }
        px(13, 22, ol, 6, 10); px(14, 23, "#6e4a35", 4, 9); px(16, 27, "#f0d070", 1, 1); // door
        [[7, 19], [21, 19]].forEach(([x, y]) => { px(x, y, ol, 5, 5); px(x + 1, y + 1, "#8ac0e8", 3, 3); px(x + 1, y + 1, "#d8f0ff", 1, 1); });
        if (shop) { for (let x = 5; x < 27; x++) px(x, 16, (x >> 1) % 2 ? "#a8323e" : "#f6f6fa", 1, 3); px(5, 19, ol, 22, 1); }
        px(4, 31, ol, 24, 1);
      } else if (id === "asset_well") {
        px(2, 9, "#2a2a34", 12, 7); px(3, 10, "#8a8fa0", 10, 5); px(3, 10, "#b8bcc8", 10, 1); px(5, 11, "#3f7fc4", 6, 2);
        px(3, 2, "#3a2a3a", 1, 8); px(12, 2, "#3a2a3a", 1, 8); px(1, 1, "#2a1a1a", 14, 3); px(2, 1, "#b8402e", 12, 2);
      } else if (id === "asset_rock") {
        px(2, 7, "#2a1a1a", 12, 8); px(3, 8, "#7a6a58", 10, 6); px(4, 8, "#9a8a70", 4, 3);
      } else if (id === "asset_crate") {
        px(2, 4, "#2a1a1a", 12, 12); px(3, 5, "#8a6230", 10, 10); px(3, 9, "#2a1a1a", 10, 1); px(7, 5, "#2a1a1a", 1, 10);
      } else if (id === "asset_barrel") {
        px(4, 3, "#2a1a1a", 8, 13); px(5, 4, "#8a4a20", 6, 11); px(5, 7, "#2a1a1a", 6, 1); px(5, 11, "#2a1a1a", 6, 1);
      } else if (id === "asset_torch") {
        px(7, 7, "#6e4a35", 2, 9); px(6, 2, "#c44a22", 4, 6); px(7, 1, "#f0d070", 2, 3);
      } else { // tree
        px(7, 11, "#2a1a1a", 3, 5); px(7, 11, "#6e4a35", 2, 5);
        for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) { const d = Math.hypot(x - 7.5, y - 6); if (d < 6.5) px(x, y, d > 5.6 ? "#1e3a24" : (x + y < 10 ? "#7fb05a" : x - y > 4 ? "#3a6a30" : "#5a8a40")); }
      }
    });
  }
  const NPCS = {
    villager: { name: "Villager", preset: { body: "classic", hair: "short", outfit: "tunic", weapon: "none" }, colours: { Skin: "Tan", Hair: "Brown", Shirt: "Green", Trousers: "Brown", Boots: "Leather" } },
    merchant: { name: "Merchant", preset: { body: "sturdy", hair: "none", outfit: "robe", weapon: "none" }, colours: { Skin: "Peach", Shirt: "Gold", Trousers: "Purple", Boots: "Dark leather" } },
    guard: { name: "Guard", preset: { body: "sturdy", hair: "short", outfit: "armour", weapon: "sword" }, colours: { Skin: "Brown", Hair: "Black", Shirt: "Grey", Trousers: "Blue", Boots: "Steel", Weapon: "Steel" } },
    elder: { name: "Elder", preset: { body: "small", hair: "long", outfit: "robe", weapon: "staff" }, colours: { Skin: "Fair", Hair: "White", Shirt: "Blue", Trousers: "White", Boots: "Leather", Weapon: "Wood" } },
  };
  const ENEMIES = {
    slime: { name: "Slime", col: "#5a8a40" },
    bat: { name: "Bat", col: "#4a3a6a" },
    skeleton: { name: "Skeleton", col: "#c8c0b0" },
    wolf: { name: "Wolf", col: "#6a5a4a" },
    goblin: { name: "Goblin", col: "#3a6a30" },
    acolyte: { name: "Acolyte", col: "#5a3a6a" },
    "tall-boss": { name: "Tall boss", col: "#6a2a4a" },
    "big-boss": { name: "Big boss", col: "#5a2a2a" },
  };
  function enemyArt(id) {
    const e = ENEMIES[id] || ENEMIES.slime;
    return draw("e:" + id, 16, 16, (g, px) => {
      px(3, 4, "#1a1210", 10, 11); px(4, 5, e.col, 8, 9); px(6, 7, "#1a1210", 2, 2); px(9, 7, "#1a1210", 2, 2);
    });
  }
  const HEROES = [
    { preset: { body: "classic", hair: "short", outfit: "tunic", weapon: "sword" }, colours: { Skin: "Peach", Hair: "Brown", Shirt: "Blue", Trousers: "Brown", Boots: "Leather", Weapon: "Steel" } },
    { preset: { body: "small", hair: "long", outfit: "robe", weapon: "staff" }, colours: { Skin: "Fair", Hair: "Black", Shirt: "Red", Trousers: "Purple", Boots: "Dark leather", Weapon: "Crystal" } },
  ];
  const ROLES = [["idle", "Idle / Sit", "💤"], ["wander", "Wander", "↔"], ["quest", "Quest giver", "!"], ["seller", "Seller", "🪙"]];
  function spriteArt(def, key) {
    if (cache["u:" + key]) return cache["u:" + key];
    if (!window.SpriteStudio || !SpriteStudio.heroThumb) return null;
    const c = document.createElement("canvas"); SpriteStudio.heroThumb(def.preset, def.colours, c); return (cache["u:" + key] = c.toDataURL());
  }
  const isNpc = (u) => u && u.kind === "npc";
  const isEnemy = (u) => u && u.kind === "enemy";
  const pal = () => (window.TileEngineQoL && TileEngineQoL.stagePalette && TileEngineQoL.stagePalette()) || { showEnemies: true, showLava: true, showLairs: false, showThreats: true, allowHostileNpc: true, hideNote: null, lairSet: null, type: "freestyle" };
  const unitArt = (u) => isNpc(u) ? spriteArt(NPCS[u.npcType] || NPCS.villager, "npc:" + (u.npcType || "villager")) : isEnemy(u) ? enemyArt(u.enemyType || "slime") : spriteArt(HEROES[u.id === 2 ? 1 : 0], "hero:" + (u.id === 2 ? 1 : 0));
  const unitName = (u) => isNpc(u) ? (NPCS[u.npcType] || NPCS.villager).name : (u.name || "Unit");

  /* ---------- data helpers (same data as the rail tools) ---------- */
  function mapCtx() { const s = S(); if (!s || !s.project || !window.ProjectStore) return null; const st = ProjectStore.getStage(s.project, s.currentStageId); if (!st || !st.mapRef) return null; const map = ProjectStore.getMap(s.project, st.mapRef); return map ? { s, st, map, ref: st.mapRef } : null; }
  function typeAt(x, y) { const c = mapCtx(); if (!c || !c.map.logic || !c.map.logic.terrain) return "floor"; const pal = c.map.logic.palette || { 0: "floor" }; return pal[String(c.map.logic.terrain[y * c.s.mapW + x])] || "floor"; }
  const objects = () => { const c = mapCtx(); return c ? (ProjectStore.listMapObjects(c.s.project, c.ref) || []) : []; };
  function objectCovering(x, y) { return objects().find((o) => { const m = objMeta(o.assetId); return o.at && x >= o.at.c && x < o.at.c + m.fw && y >= o.at.r && y < o.at.r + m.fh; }) || null; }
  const unitAt = (x, y) => S().units.find((u) => u.x === x && u.y === y) || null;
  function setType(x, y, type) { const c = mapCtx(); const i = y * c.s.mapW + x; const prev = c.map.logic.terrain[i]; ProjectStore.paintLogicTile(c.s.project, c.ref, i, type); return { i, prev }; }
  function restoreTerrain(list) { const c = mapCtx(); if (!c) return; for (let k = list.length - 1; k >= 0; k--) c.map.logic.terrain[list[k].i] = list[k].prev; ProjectStore.saveMap(c.s.project, c.map); }
  function pushUndo(fn) { if (window.__pushPaintStroke) __pushPaintStroke([{ kind: "live", undo: fn }]); }
  function commit() { if (window.__persistProject) __persistProject(); window.renderGrid && renderGrid(); }
  function ensureAsset(id) {
    const c = mapCtx(); const m = ProjectStore.manifest(c.s.project).project; m.assets = m.assets || {};
    const meta = objMeta(id), tsz = c.s.tileSize || 64;
    if (!m.assets[id]) { m.assets[id] = { name: meta.name, kind: "sprite", ext: "png", w: meta.fw * tsz, h: meta.fh * tsz, tiles: { w: meta.fw, h: meta.fh }, source: "starter-pack" }; c.s.project.files["assets/" + id + ".png"] = { placeholder: true }; }
  }
  /** Footprint check for a thing of fw x fh at (c, r). Returns null if it fits, else a plain reason. */
  function blockedReason(c0, r0, fw, fh, ignore) {
    const s = S();
    if (c0 < 0 || r0 < 0 || c0 + fw > s.mapW || r0 + fh > s.mapH) return "Off the map";
    for (let y = r0; y < r0 + fh; y++) for (let x = c0; x < c0 + fw; x++) {
      const t = typeAt(x, y); if (TILES[t] && TILES[t].blocks && !(ignore && ignore.tile)) return "Blocked by " + TILES[t].name.toLowerCase();
      const o = objectCovering(x, y); if (o && !(ignore && ignore.obj === o.id)) return "Overlaps the " + objMeta(o.assetId).name.toLowerCase();
      const u = unitAt(x, y); if (u && !(ignore && ignore.unit === u.id)) return "Overlaps " + unitName(u);
    }
    return null;
  }

  /* ---------- decorate the grid after app.js paints it ---------- */
  function decorate(grid, cells) {
    const s = S(), art = prefs.look === "art";
    if ((L.erase || L.arm) && s.mapTool) { L.erase = null; L.arm = null; const eb = $("#btn-erase"); if (eb) eb.setAttribute("aria-pressed", "false"); renderChip(); } // a rail tool took over
    grid.classList.toggle("live-art", art); grid.classList.toggle("live-blocks", !art); grid.classList.toggle("lines-off", !prefs.lines);
    grid.style.setProperty("--gap", prefs.lines ? "1px" : "0px");
    for (let y = 0; y < s.mapH; y++) for (let x = 0; x < s.mapW; x++) {
      const cell = cells[x + "," + y]; if (!cell) continue; const t = typeAt(x, y);
      if (art) {
        let mask = 0; if (t === "water") { const nw = (xx, yy) => xx < 0 || yy < 0 || xx >= s.mapW || yy >= s.mapH || typeAt(xx, yy) === "water"; if (!nw(x, y - 1)) mask |= 1; if (!nw(x + 1, y)) mask |= 2; if (!nw(x, y + 1)) mask |= 4; if (!nw(x - 1, y)) mask |= 8; }
        cell.style.setProperty("background-image", `url(${tileArt(TILES[t] ? t : "floor", (x * 7 + y * 3) % 3, mask)})`, "important");
      }
      const o = objectCovering(x, y), u = unitAt(x, y);
      cell.setAttribute("aria-label", `Tile ${x + 1},${y + 1}: ${(TILES[t] || TILES.floor).name}${o ? ", " + objMeta(o.assetId).name : ""}${u ? ", " + unitName(u) : ""}`);
    }
    objects().forEach((o) => {
      const cell = cells[o.at.c + "," + o.at.r]; if (!cell) return; const m = objMeta(o.assetId);
      const el = document.createElement("span"); el.className = "live-obj" + (L.move && L.move.kind === "object" && L.move.id === o.id ? " is-lifted" : "");
      el.style.setProperty("--fw", m.fw); el.style.setProperty("--fh", m.fh); el.setAttribute("aria-hidden", "true");
      if (art) el.style.backgroundImage = `url(${objArt(o.assetId)})`; else el.innerHTML = `<span class="lb-lbl">${esc(m.name)}</span>`;
      cell.appendChild(el);
    });
    s.units.forEach((u) => {
      const cell = cells[u.x + "," + u.y]; if (!cell) return;
      const el = document.createElement("span"); el.className = "live-unit" + (isNpc(u) ? " npc" : "") + (L.move && L.move.kind === "unit" && L.move.id === u.id ? " is-lifted" : "");
      el.dataset.team = isNpc(u) ? "npc" : u.id === 2 ? "rival" : "player"; el.setAttribute("aria-hidden", "true");
      const a = art && unitArt(u); if (a) el.style.backgroundImage = `url(${a})`;
      if (isNpc(u) && u.npcRole) { const r = ROLES.find((x) => x[0] === u.npcRole); if (r) el.innerHTML = `<span class="lu-role">${r[2]}</span>`; }
      if (art || isNpc(u)) cell.appendChild(el);
      if (!art && isNpc(u)) { const tok = cell.querySelector(".unit-token"); if (tok) tok.textContent = "N"; }
    });
    // r68 (J): ✦N badge = how many abilities the unit has
    s.units.forEach((u) => { const n = (u.setups || []).length, cell = cells[u.x + "," + u.y]; if (!n || !cell) return;
      const b = document.createElement("span"); b.className = "lu-abil"; b.textContent = "✦" + n; b.setAttribute("aria-hidden", "true"); cell.appendChild(b);
      cell.setAttribute("aria-label", (cell.getAttribute("aria-label") || "") + `, ${n} abilit${n === 1 ? "y" : "ies"}`); });
    if (L.test && L.test.targeting) L.test.targeting.targets.forEach((k) => { const c = cells[k]; if (c) c.classList.add("test-target"); });
    if (L.test && L.test.blink) { const b = L.test.blink, c1 = cells[b.to], c0 = cells[b.from]; if (c1) c1.classList.add("test-blink-in"); if (c0) c0.classList.add("test-blink-out"); }
    if (L.move) drawMove(cells);
    if (L.popCell) { const c = cells[L.popCell.x + "," + L.popCell.y]; if (c) c.classList.add("live-target"); }
  }

  /* ---------- popover ---------- */
  const L = { pop: null, popCell: null, move: null, brush: null, drag: null, arm: null, erase: null, test: null };
  function popEl() {
    let p = $("#live-pop"); if (p) return p;
    p = document.createElement("div"); p.id = "live-pop"; p.className = "live-pop"; p.hidden = true; p.setAttribute("role", "dialog");
    $("#screen-stage .stage-wrap").appendChild(p); return p;
  }
  function closePop() { const p = $("#live-pop"); if (p) p.hidden = true; const had = !!L.popCell; L.popCell = null; L.pop = null; if (had && window.renderGrid) renderGrid(); }
  function placePop(x, y) {
    const p = popEl(), wrap = $("#screen-stage .stage-wrap").getBoundingClientRect();
    const cell = document.querySelector(`#stage-grid .cell[data-x="${x}"][data-y="${y}"]`); if (!cell) return;
    const r = cell.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight, pad = 8;
    let left, top;
    if (r.right + pad + pw <= wrap.right - pad) { left = r.right + pad - wrap.left; top = r.top + r.height / 2 - ph / 2 - wrap.top; }        // beside, right
    else if (r.left - pad - pw >= wrap.left + pad) { left = r.left - pad - pw - wrap.left; top = r.top + r.height / 2 - ph / 2 - wrap.top; } // beside, left
    else { left = Math.min(Math.max(pad, r.left + r.width / 2 - pw / 2 - wrap.left), wrap.width - pw - pad);                                // above / below
      top = r.bottom + pad + ph <= wrap.bottom - 72 ? r.bottom + pad - wrap.top : r.top - pad - ph - wrap.top; }
    top = Math.min(Math.max(pad, top), wrap.height - ph - 72);
    p.style.left = Math.round(left) + "px"; p.style.top = Math.round(top) + "px";
  }
  function openPop(x, y, html, kind) {
    const p = popEl(); L.popCell = { x, y }; L.pop = kind;
    p.setAttribute("aria-label", kind); p.dataset.kind = kind;
    p.innerHTML = html; p.hidden = false; p.classList.toggle("wide", html.indexOf("lp-row") >= 0); // pickers get room for 4 thumbnails
    window.renderGrid && renderGrid(); placePop(x, y);
    p.querySelectorAll("[data-lp]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); act(b.dataset.lp, b.dataset.v, x, y); }));
    const f = p.querySelector("button"); if (f) f.focus({ preventScroll: true });
  }
  const head = (t, sub) => `<div class="lp-head"><div class="lp-title"><b>${esc(t)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div><button type="button" class="lp-x" data-lp="close" aria-label="Close">×</button></div>`;
  const menuBtn = (a, ico, label, v = "") => `<button type="button" class="lp-btn" data-lp="${a}" data-v="${v}"><span class="lp-ico" aria-hidden="true">${ico}</span><span>${esc(label)}</span></button>`;
  const artBtn = (a, v, img, label, extra = "") => `<button type="button" class="lp-art-btn" data-lp="${a}" data-v="${v}" aria-label="${esc(label)}"><span class="lp-art${extra}" style="background-image:url(${img})" aria-hidden="true"></span><span class="lp-art-lbl">${esc(label)}</span></button>`;
  function emptyMenu(x, y) {
    const p = pal();
    let btns = menuBtn("addUnit", "🧍", "Unit") + menuBtn("pick", "🙂", "NPC", "npc") + menuBtn("pick", "🏠", "Building", "building");
    if (p.showEnemies) btns += menuBtn("pick", "💀", "Enemy", "enemy");
    if (p.showLairs) btns += menuBtn("lairs", "🏛", "Lair sets");
    btns += menuBtn("pick", "🌊", "Terrain", "terrain") + menuBtn("pick", "🌱", "Land", "land");
    const kept = S() && S().qolPlaceAsset;
    if (kept) btns += menuBtn("addKept", "🎨", "Kept art");
    const sub = p.hideNote || `Tile ${x + 1},${y + 1}`;
    openPop(x, y, head("Add here", sub) + `<div class="lp-grid">${btns}</div>`, "Add here");
  }
  function picker(x, y, what, mode) {
    const verb = mode === "edit" ? "swap" : "add";
    let body = "", title = "";
    if (what === "npc") { title = "Pick an NPC"; body = Object.keys(NPCS).map((k) => artBtn(verb === "swap" ? "swapNpc" : "addNpc", k, spriteArt(NPCS[k], "npc:" + k), NPCS[k].name, " is-sprite")).join(""); }
    if (what === "building") { title = "Pick a building"; body = Object.keys(OBJECTS).map((k) => artBtn(verb === "swap" ? "swapObj" : "addObj", k, objArt(k), OBJECTS[k].name + (OBJECTS[k].fw > 1 ? ` ${OBJECTS[k].fw}×${OBJECTS[k].fh}` : ""))).join(""); }
    if (what === "enemy") {
      title = "Pick an enemy";
      const p = pal();
      let ids = Object.keys(ENEMIES);
      if (p.lairSet && p.lairSet !== "all") {
        const focus = p.lairSet === "bandit" ? ["acolyte"] : [p.lairSet];
        ids = ids.filter((k) => focus.indexOf(k) >= 0).concat(ids.filter((k) => focus.indexOf(k) < 0));
      }
      body = ids.map((k) => artBtn(verb === "swap" ? "swapEnemy" : "addEnemy", k, enemyArt(k), ENEMIES[k].name + (p.lairSet && (p.lairSet === k || (p.lairSet === "bandit" && k === "acolyte")) ? " · set" : ""))).join("");
    }
    if (what === "terrain" || what === "land") { title = what === "terrain" ? "Pick terrain" : "Pick land"; body = Object.keys(TILES).filter((k) => (TILES[k].group === what || (mode === "edit")) && (k !== "lava" || pal().showLava || mode === "edit")).map((k) => artBtn("tile", k, tileArt(k, 0, k === "water" ? 5 : 0), TILES[k].name)).join(""); }
    openPop(x, y, head(title, mode === "edit" ? "Tap to swap" : "Starter Pack · free") + `<div class="lp-row${body.split("lp-art-btn").length > 5 ? " wrap" : ""}">${body}</div>`, title);
  }
  function thingMenu(x, y) {
    const u = unitAt(x, y), o = objectCovering(x, y), t = typeAt(x, y);
    if (u) {
      const role = isNpc(u) && u.npcRole ? ROLES.find((r) => r[0] === u.npcRole) : null;
      return openPop(x, y, head(unitName(u), isNpc(u) ? (role ? "Does: " + role[1] : "No behaviour yet") : u.id === 2 ? "Rival team" : "Your team") + `<div class="lp-grid">${isNpc(u) ? menuBtn("roles", "🎭", "Behaviour") : ""}${menuBtn("edit", "✏️", "Edit")}${menuBtn("move", "✥", "Move")}${menuBtn("del", "🗑", "Delete")}${isNpc(u) ? "" : menuBtn("test", "▶", "Test")}</div>`, unitName(u));
    }
    if (o) { const m = objMeta(o.assetId); return openPop(x, y, head(m.name, m.fw > 1 ? `${m.fw}×${m.fh} tiles` : "1 tile") + `<div class="lp-grid">${menuBtn("edit", "✏️", "Edit")}${menuBtn("move", "✥", "Move")}${menuBtn("del", "🗑", "Delete")}</div>`, m.name); }
    return openPop(x, y, head((TILES[t] || TILES.floor).name, `Tile ${x + 1},${y + 1}`) + `<div class="lp-grid">${menuBtn("edit", "✏️", "Edit")}${menuBtn("move", "✥", "Move")}${menuBtn("del", "🗑", "Delete")}</div>`, (TILES[t] || TILES.floor).name);
  }
  function rolesMenu(x, y, fresh) {
    const u = unitAt(x, y); if (!u) return;
    const host = pal().allowHostileNpc
      ? menuBtn("hostile", u.npcHostile ? "⚔" : "☮", u.npcHostile ? "Hostile · On" : "Hostile · Off")
      : "";
    openPop(x, y, head(fresh ? `${unitName(u)} placed` : "Assign behaviour", "What do they do? NPCs are friendly until you opt in to hostility.") + `<div class="lp-grid">${ROLES.map(([id, n, ico]) => menuBtn("role", ico, n, id).replace('class="lp-btn"', `class="lp-btn" aria-pressed="${u.npcRole === id}"`)).join("")}${host}</div>` + (fresh ? `<button type="button" class="lp-later" data-lp="close">Later</button>` : ""), "Assign behaviour");
  }

  /* ---------- actions ---------- */
  function act(a, v, x, y) {
    const s = S(), c = mapCtx(); if (!c) return;
    if (a === "close") return closePop();
    if (a === "pick") return picker(x, y, v);
    if (a === "addObj") {
      const m = objMeta(v); let at = null;
      for (const [dc, dr] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) if (!blockedReason(x + dc, y + dr, m.fw, m.fh)) { at = { c: x + dc, r: y + dr }; break; }
      if (!at) { toast(`No room for a ${m.fw}×${m.fh} ${m.name.toLowerCase()} here: ${blockedReason(x, y, m.fw, m.fh).toLowerCase()}`); return; }
      ensureAsset(v); const o = ProjectStore.addMapObject(s.project, c.ref, { assetId: v, at, blocks: m.blocks });
      pushUndo(() => { const h = objects().find((q) => q.id === o.id); if (h) ProjectStore.removeMapObjectAt(s.project, c.ref, h.at.c, h.at.r); });
      commit(); toast(`${m.name} placed`); return thingMenu(at.c, at.r);
    }
    if (a === "addNpc") {
      if (blockedReason(x, y, 1, 1)) { toast(blockedReason(x, y, 1, 1)); return; }
      const u = { id: s.nextId++, name: NPCS[v].name, kind: "npc", npcType: v, npcRole: null, npcHostile: false, x, y, hp: 5, atk: 0, setups: [] };
      s.units.push(u); pushUndo(() => { const i = s.units.indexOf(u); if (i >= 0) s.units.splice(i, 1); });
      commit(); return rolesMenu(x, y, true);
    }
    if (a === "lairs") { closePop(); if (window.__show) __show("stage-lairs"); return; }
    if (a === "addEnemy") {
      if (!pal().showEnemies) { toast("Enemies stay hidden on a Safe stage until you add a threat or event."); return; }
      if (blockedReason(x, y, 1, 1)) { toast(blockedReason(x, y, 1, 1)); return; }
      const e = ENEMIES[v] || ENEMIES.slime;
      const u = { id: s.nextId++, name: e.name, kind: "enemy", enemyType: v, x, y, hp: 6, atk: 1, setups: [], hostile: true };
      s.units.push(u); pushUndo(() => { const i = s.units.indexOf(u); if (i >= 0) s.units.splice(i, 1); });
      commit(); toast(e.name + " placed"); return thingMenu(x, y);
    }
    if (a === "addKept") {
      const id = s.qolPlaceAsset; if (!id) return;
      if (blockedReason(x, y, 1, 1)) { toast(blockedReason(x, y, 1, 1)); return; }
      ensureAsset(id);
      const o = ProjectStore.addMapObject(s.project, c.ref, { assetId: id, at: { c: x, r: y }, blocks: true });
      pushUndo(() => { const h = objects().find((q) => q.id === o.id); if (h) ProjectStore.removeMapObjectAt(s.project, c.ref, h.at.c, h.at.r); });
      s.qolPlaceAsset = null; commit(); toast("Kept art placed"); return thingMenu(x, y);
    }
    if (a === "hostile") {
      const u = unitAt(x, y); if (!u) return;
      if (!pal().allowHostileNpc && !u.npcHostile) { toast("Hostility is locked on a Safe stage until you add a threat or event."); return; }
      const prev = !!u.npcHostile; u.npcHostile = !prev; pushUndo(() => { u.npcHostile = prev; });
      commit(); toast(unitName(u) + (u.npcHostile ? " is now hostile" : " is friendly again")); return rolesMenu(x, y, false);
    }
    if (a === "roles") return rolesMenu(x, y, false);
    if (a === "role") {
      const u = unitAt(x, y); if (!u) return; const prev = u.npcRole; u.npcRole = v; pushUndo(() => { u.npcRole = prev; });
      commit(); closePop(); toast(`${unitName(u)}: ${ROLES.find((r) => r[0] === v)[1]}`); return;
    }
    if (a === "tile") {
      const o = objectCovering(x, y), u = unitAt(x, y);
      if (TILES[v].blocks && (o || u)) { toast(`Can't put ${TILES[v].name.toLowerCase()} under the ${o ? objMeta(o.assetId).name.toLowerCase() : unitName(u)}`); return; }
      const list = [setType(x, y, v)]; pushUndo(() => restoreTerrain(list)); closePop();
      L.brush = { type: v, list }; commit(); renderBrushChip(); return;
    }
    if (a === "edit") {
      const u = unitAt(x, y), o = objectCovering(x, y);
      if (u && isNpc(u)) return picker(x, y, "npc", "edit");
      // r68: Edit on a hero/enemy opens its editor sheet (Sprite · Stats · Behaviour), never the battle menu
      if (u) { closePop(); s.selectedUnitId = u.id; window.renderGrid && renderGrid(); window.__setStageSheet && __setStageSheet("unit"); toast(`Editing ${unitName(u)}`); return; }
      if (o) return picker(o.at.c, o.at.r, "building", "edit");
      return picker(x, y, "terrain", "edit");
    }
    if (a === "swapNpc") { const u = unitAt(x, y); const prev = u.npcType; u.npcType = v; u.name = NPCS[v].name; pushUndo(() => { u.npcType = prev; u.name = NPCS[prev].name; }); commit(); return thingMenu(x, y); }
    if (a === "swapObj") {
      const o = objectCovering(x, y); const m = objMeta(v), why = blockedReason(o.at.c, o.at.r, m.fw, m.fh, { obj: o.id });
      if (why) { toast(`${m.name} won't fit here: ${why.toLowerCase()}`); return; }
      ensureAsset(v); const prev = o.assetId; ProjectStore.updateMapObject(s.project, c.ref, o.id, { assetId: v, blocks: m.blocks });
      pushUndo(() => ProjectStore.updateMapObject(s.project, c.ref, o.id, { assetId: prev })); commit(); return thingMenu(o.at.c, o.at.r);
    }
    if (a === "del") {
      const u = unitAt(x, y), o = objectCovering(x, y); closePop();
      if (u) { const i = s.units.indexOf(u); s.units.splice(i, 1); pushUndo(() => s.units.splice(i, 0, u)); commit(); toast(`${unitName(u)} deleted`); return; }
      if (o) { const keep = JSON.parse(JSON.stringify(o)); ProjectStore.removeMapObjectAt(s.project, c.ref, o.at.c, o.at.r); pushUndo(() => ProjectStore.addMapObject(s.project, c.ref, keep)); commit(); toast(`${objMeta(o.assetId).name} deleted`); return; }
      const t = typeAt(x, y), list = [setType(x, y, "floor")]; pushUndo(() => restoreTerrain(list)); commit(); toast(`${(TILES[t] || TILES.floor).name} removed`); return;
    }
    if (a === "move") return startMove(x, y);
    if (a === "addUnit") return startNewUnit(x, y);
    if (a === "delEdge") return deleteEdge(x, y, v);
    if (a === "test") { const u = unitAt(x, y); return startTest(u && u.id); }
    if (a === "soon") { toast(`${v} is coming soon`); return; }
    if (a === "noplay") { toast(`${v} is not playable yet`); return; }
    if (a === "tSpells") return spellsMenu(x, y);
    if (a === "tCast") return castAbility(x, y, v, false);
    if (a === "tCastAny") return castAbility(x, y, v, true);
  }

  /* ---------- r68 (I): walls — tap a wall edge for a small Delete menu, long-press to delete with a confirm, Erase tool ---------- */
  const SIDE_NAME = { n: "top", e: "right", s: "bottom", w: "left" };
  function edgeKey(e) { return e.c + "," + e.r + "," + e.side; }
  function hasEdge(x, y, side) {
    const c = mapCtx(); if (!c || !c.map.logic || !Array.isArray(c.map.logic.edges)) return false;
    const map = c.map, canon = ProjectStore.canonicalizeEdge(map, { c: x, r: y, side }); if (!canon) return false; const k = edgeKey(canon);
    return c.map.logic.edges.some((e) => { const q = ProjectStore.canonicalizeEdge(map, e) || e; return edgeKey(q) === k; });
  }
  // the wall edge under a tap: the nearest side of the tile that has a wall, within `band` of the tile size
  function edgeNear(x, y, ev, band) {
    if (!ev || ev.clientX == null) return null; const cell = document.querySelector(`#stage-grid .cell[data-x="${x}"][data-y="${y}"]`); if (!cell) return null;
    const r = cell.getBoundingClientRect(), lim = Math.max(6, r.width * band);
    const d = { n: ev.clientY - r.top, s: r.bottom - ev.clientY, w: ev.clientX - r.left, e: r.right - ev.clientX };
    let best = null; Object.keys(d).forEach((k) => { if (d[k] <= lim && d[k] >= -2 && hasEdge(x, y, k) && (!best || d[k] < d[best])) best = k; }); return best;
  }
  function wallMenu(x, y, side, confirm) {
    L.popEdge = { x, y, side };
    openPop(x, y, confirm
      ? head("Delete this wall?", `${SIDE_NAME[side]} edge of tile ${x + 1},${y + 1}`) + `<div class="lp-grid">${menuBtn("delEdge", "🗑", "Delete wall", side)}${menuBtn("close", "↩", "Keep it")}</div>`
      : head("Wall", `${SIDE_NAME[side]} edge of tile ${x + 1},${y + 1}`) + `<div class="lp-grid">${menuBtn("delEdge", "🗑", "Delete", side)}</div>`, "Wall");
  }
  function deleteEdge(x, y, side) {
    const c = mapCtx(); closePop(); if (!c || !hasEdge(x, y, side)) return;
    ProjectStore.toggleMapEdge(c.s.project, c.ref, { c: x, r: y, side });
    pushUndo(() => { if (!hasEdge(x, y, side)) ProjectStore.toggleMapEdge(S().project, mapCtx().ref, { c: x, r: y, side }); });
    commit(); toast("Wall removed");
  }
  function clearRailTools() {
    const s = S(); if (!s) return; s.mapTool = null; s.walkRulesOverlay = false;
    ["#btn-paint", "#btn-fill", "#btn-walls", "#btn-objects", "#btn-move"].forEach((id) => { const b = $(id); if (b) b.setAttribute("aria-pressed", "false"); });
    const pp = $("#paint-prefs"); if (pp) pp.hidden = true;
  }
  function armErase(on) {
    closePop(); L.brush = null; L.arm = null; if (L.move) cancelMove();
    L.erase = on === false || (on == null && L.erase) ? null : { last: null };
    if (L.erase) clearRailTools();
    const b = $("#btn-erase"); if (b) b.setAttribute("aria-pressed", String(!!L.erase));
    renderChip(); window.renderGrid && renderGrid();
  }
  // erase one thing at a tile: a wall edge near the finger first, then a building / prop, then the terrain (back to grass)
  function eraseAt(x, y, ev) {
    const c = mapCtx(); if (!c) return null;
    const side = edgeNear(x, y, ev, 0.3), key = x + "," + y + ":" + (side || "");
    if (L.erase && L.erase.last === key) return null; if (L.erase) L.erase.last = key;
    if (side) { ProjectStore.toggleMapEdge(c.s.project, c.ref, { c: x, r: y, side }); pushUndo(() => { if (!hasEdge(x, y, side)) ProjectStore.toggleMapEdge(S().project, mapCtx().ref, { c: x, r: y, side }); }); commit(); return "wall"; }
    const o = objectCovering(x, y);
    if (o) { const keep = JSON.parse(JSON.stringify(o)); ProjectStore.removeMapObjectAt(c.s.project, c.ref, o.at.c, o.at.r); pushUndo(() => ProjectStore.addMapObject(S().project, mapCtx().ref, keep)); commit(); return objMeta(o.assetId).name; }
    const t = typeAt(x, y);
    if (t !== "floor") { const list = [setType(x, y, "floor")]; pushUndo(() => restoreTerrain(list)); commit(); return (TILES[t] || TILES.floor).name; }
    return null;
  }

  /* ---------- r68 (H): place a unit on the art view — arm, tap a tile, ghost snaps (green / red), drop ---------- */
  function armUnit() {
    closePop(); L.brush = null; L.erase = null; if (L.move) cancelMove(); clearRailTools();
    if (window.__setStageSheet) __setStageSheet(null);
    L.arm = { kind: "unit" }; renderChip(); window.renderGrid && renderGrid();
  }
  function startNewUnit(x, y) {
    closePop(); L.arm = null;
    L.move = { kind: "newunit", id: -1, fw: 1, fh: 1, name: "New unit", from: { c: -99, r: -99 }, at: { c: x, r: y } };
    window.renderGrid && renderGrid(); renderMoveChip();
  }

  /* ---------- r68 (J): Test mode — a lightweight play test on this stage; nothing is saved ---------- */
  const knobValue = (doc, b, id) => { const a = doc && doc.answers && doc.answers[id], k = b && (b.knobs || []).find((q) => q.id === id);
    return a && a.source !== "default" && a.value !== undefined ? a.value : k ? k.default : undefined; };
  const behaviourOf = (entry) => (window.__behaviourById ? __behaviourById(entry.doc && entry.doc.behaviourId) : null);
  const shortName = (entry) => (window.__abilityShortName ? __abilityShortName(behaviourOf(entry), entry.doc) : (entry.doc && entry.doc.name) || "Ability");
  // runtime wiring: only abilities listed here can be played in Test
  const RUNTIME = {
    teleport(u, entry, forceAny) { // catalogue: Teleport / Reposition — knob "destination": beside-own-summon (default) | any-empty-tile
      const b = behaviourOf(entry), dest = forceAny ? "any-empty-tile" : knobValue(entry.doc, b, "destination") || "beside-own-summon", s = S(), out = new Set();
      if (dest === "any-empty-tile") { for (let y = 0; y < s.mapH; y++) for (let x = 0; x < s.mapW; x++) if (!blockedReason(x, y, 1, 1)) out.add(x + "," + y); }
      else s.units.filter((q) => q.summon && q.summonedBy === u.id).forEach((q) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && !blockedReason(q.x + dx, q.y + dy, 1, 1)) out.add((q.x + dx) + "," + (q.y + dy)); });
      return { targets: out, dest, spends: !!knobValue(entry.doc, b, "spends_action"), destLabel: ((b && (b.knobs || []).find((k) => k.id === "destination")) || { options: [] }).options.reduce((m, o) => (o.value === dest ? o.label : m), dest) };
    },
  };
  function testing() { return !!L.test; }
  function startTest(unitId) {
    if (L.test) return; closePop(); L.brush = null; L.arm = null; L.erase = null; if (L.move) cancelMove(); clearRailTools();
    const s = S(); L.test = { snap: JSON.stringify(s.units), targeting: null, blink: null, log: [], focus: unitId || null, actions: {} };
    if (window.__setStageSheet) __setStageSheet(null); if (window.__setStagePlay) __setStagePlay(true);
    const u = s.units.find((q) => q.id === unitId);
    say(u ? `Test started. Tap ${unitName(u)} to act.` : "Test started. Tap a unit to act.");
    window.renderGrid && renderGrid(); toast("Test mode · nothing is saved");
  }
  function exitTest() {
    if (!L.test) return; const s = S(), snap = JSON.parse(L.test.snap);
    s.units.length = 0; snap.forEach((u) => s.units.push(u)); // exactly as it was: positions, abilities, everything
    L.test = null; closePop(); if (window.__setStagePlay) __setStagePlay(false); renderChip(); window.renderGrid && renderGrid();
    toast("Test ended · the stage is back as it was");
  }
  function say(line) { if (!L.test) return; L.test.log.push(line); renderChip(); }
  function battleMenu(x, y) {
    const u = unitAt(x, y); if (!u || !L.test) return;
    const soon = (ico, n) => `<button type="button" class="lp-btn is-soon" aria-disabled="true" data-lp="soon" data-v="${n}"><span class="lp-ico" aria-hidden="true">${ico}</span><span>${n}</span><small class="lp-soon">Coming soon</small></button>`;
    openPop(x, y, head(unitName(u), "Test · your turn") + `<div class="lp-grid">${soon("⚔", "Attack")}${menuBtn("tSpells", "✦", `Spells (${(u.setups || []).length})`)}${soon("🎒", "Items")}</div>`, "Battle");
  }
  function spellsMenu(x, y) {
    const u = unitAt(x, y); if (!u) return; const list = u.setups || [];
    const rows = list.map((e) => { const b = behaviourOf(e), id = e.doc && e.doc.behaviourId, nm = shortName(e);
      return RUNTIME[id] ? menuBtn("tCast", "✦", nm, e.id) : `<button type="button" class="lp-btn is-soon" aria-disabled="true" data-lp="noplay" data-v="${esc(nm)}"><span class="lp-ico" aria-hidden="true">✦</span><span>${esc(nm)}</span><small class="lp-soon">Not playable yet</small></button>`; }).join("");
    openPop(x, y, head("Spells", `${unitName(u)} · ${list.length} abilit${list.length === 1 ? "y" : "ies"}`) + (rows ? `<div class="lp-grid">${rows}</div>` : `<p class="lp-note">No abilities yet. Exit test, then Behaviour → Add behaviour.</p>`), "Spells");
  }
  function castAbility(x, y, setupId, forceAny) {
    const u = unitAt(x, y); if (!u) return; const e = (u.setups || []).find((q) => q.id === setupId); if (!e) return;
    const id = e.doc.behaviourId, nm = shortName(e), r = RUNTIME[id](u, e, forceAny);
    if (!r.targets.size) {
      openPop(x, y, head(nm, `Destination: ${r.destLabel}`) + `<p class="lp-note">${esc(nm)} lands next to one of ${esc(unitName(u))}'s summons. There are none on the board, so there's nowhere to go.</p><div class="lp-grid">${menuBtn("tCastAny", "🎯", "Try: any empty tile (test only)", setupId)}</div>`, nm);
      say(`${nm}: no tiles. ${unitName(u)} has no summon on the board.`); return;
    }
    closePop(); L.test.targeting = { unitId: u.id, name: nm, targets: r.targets, spends: r.spends, dest: r.destLabel, forced: !!forceAny };
    say(`${nm}: tap a highlighted tile (${r.targets.size} tiles${forceAny ? ", any empty tile, test only" : ""}).`);
    window.renderGrid && renderGrid();
  }
  function testTap(x, y) {
    const t = L.test.targeting, s = S();
    if (t) {
      const u = s.units.find((q) => q.id === t.unitId); L.test.targeting = null;
      if (!u || !t.targets.has(x + "," + y)) { say(`${t.name} cancelled: tile ${x + 1},${y + 1} isn't one of the highlighted tiles.`); window.renderGrid && renderGrid(); return; }
      const from = { x: u.x, y: u.y }; u.x = x; u.y = y; L.test.blink = { from: from.x + "," + from.y, to: x + "," + y };
      say(`${unitName(u)} used ${t.name}: moved from tile ${from.x + 1},${from.y + 1} to tile ${x + 1},${y + 1}${t.spends ? " and used an action" : ". It didn't use an action"}.`);
      window.renderGrid && renderGrid(); clearTimeout(L.test._bt); L.test._bt = setTimeout(() => { if (L.test) { L.test.blink = null; window.renderGrid && renderGrid(); } }, 650);
      return;
    }
    if (unitAt(x, y)) return battleMenu(x, y);
    closePop();
  }

  /* ---------- one chip for armed modes: Place unit / Erase / Test ---------- */
  function renderChip() {
    if (L.move) return renderMoveChip(); if (L.brush) return renderBrushChip();
    const el = chipEl();
    if (L.test) {
      const last = L.test.log.slice(-2);
      el.innerHTML = `<span class="lc-txt"><b>Test mode · nothing is saved</b>${last.map((l) => `<small class="lc-log">${esc(l)}</small>`).join("")}</span>${L.test.targeting ? `<button type="button" class="btn btn-ghost lc-btn" id="live-test-cancel">Cancel</button>` : ""}<button type="button" class="btn btn-primary lc-btn" id="live-test-exit">Exit test</button>`;
      el.hidden = false; el.classList.add("is-test"); $("#live-test-exit").onclick = exitTest; const cb = $("#live-test-cancel"); if (cb) cb.onclick = () => { const n = L.test.targeting.name; L.test.targeting = null; say(`${n} cancelled.`); window.renderGrid && renderGrid(); };
      return;
    }
    el.classList.remove("is-test");
    if (L.arm) { el.innerHTML = `<span class="lc-txt"><b>Place unit</b><small>Tap a tile on the board</small></span><button type="button" class="btn btn-ghost lc-btn" id="live-arm-cancel">Cancel</button>`; el.hidden = false; $("#live-arm-cancel").onclick = () => { L.arm = null; renderChip(); }; return; }
    if (L.erase) { el.innerHTML = `<span class="lc-art lc-erase" aria-hidden="true">⌫</span><span class="lc-txt"><b>Erase</b><small>Tap or drag: walls, buildings, terrain</small></span><button type="button" class="btn btn-primary lc-btn" id="live-erase-done">Done</button>`; el.hidden = false; $("#live-erase-done").onclick = () => armErase(false); return; }
    el.hidden = true;
  }

  /* ---------- paint run (after picking terrain / land) ---------- */
  function chipEl() {
    let el = $("#live-chip"); if (el) return el;
    el = document.createElement("div"); el.id = "live-chip"; el.className = "live-chip"; el.hidden = true; el.setAttribute("role", "status");
    $("#screen-stage .stage-wrap").appendChild(el); return el;
  }
  function renderBrushChip() {
    const el = chipEl(); if (!L.brush) { el.hidden = true; return; }
    el.innerHTML = `<span class="lc-art" style="background-image:url(${tileArt(L.brush.type, 0, L.brush.type === "water" ? 5 : 0)})" aria-hidden="true"></span><span class="lc-txt"><b>Painting ${esc(TILES[L.brush.type].name)}</b><small>Tap or drag more tiles</small></span><button type="button" class="btn btn-primary lc-btn" id="live-brush-done">Done</button>`;
    el.hidden = false; $("#live-brush-done").onclick = () => { L.brush = null; renderBrushChip(); };
  }
  function brushAt(x, y) {
    if (!L.brush) return; const v = L.brush.type;
    if (typeAt(x, y) === v) return; if (TILES[v].blocks && (objectCovering(x, y) || unitAt(x, y))) return;
    L.brush.list.push(setType(x, y, v)); commit();
  }

  /* ---------- move (ghost + footprint) ---------- */
  function startMove(x, y) {
    const u = unitAt(x, y), o = objectCovering(x, y); closePop(); L.brush = null; renderBrushChip();
    if (u) L.move = { kind: "unit", id: u.id, fw: 1, fh: 1, name: unitName(u), from: { c: u.x, r: u.y }, at: { c: u.x, r: u.y } };
    else if (o) { const m = objMeta(o.assetId); L.move = { kind: "object", id: o.id, fw: m.fw, fh: m.fh, name: m.name, asset: o.assetId, from: { c: o.at.c, r: o.at.r }, at: { c: o.at.c, r: o.at.r } }; }
    else L.move = { kind: "tile", type: typeAt(x, y), fw: 1, fh: 1, name: (TILES[typeAt(x, y)] || TILES.floor).name, from: { c: x, r: y }, at: { c: x, r: y } };
    window.renderGrid && renderGrid(); renderMoveChip();
  }
  function moveReason() {
    const m = L.move; if (m.at.c === m.from.c && m.at.r === m.from.r) return "same";
    return blockedReason(m.at.c, m.at.r, m.fw, m.fh, m.kind === "object" ? { obj: m.id } : m.kind === "unit" || m.kind === "newunit" ? { unit: m.id } : { tile: true });
  }
  function drawMove(cells) {
    const m = L.move, why = moveReason(), ok = !why || why === "same", s = S();
    for (let y = m.at.r; y < m.at.r + m.fh; y++) for (let x = m.at.c; x < m.at.c + m.fw; x++) { const c = cells[x + "," + y]; if (c) c.classList.add(ok ? "fp-ok" : "fp-bad"); }
    const anchor = cells[Math.min(Math.max(0, m.at.c), s.mapW - 1) + "," + Math.min(Math.max(0, m.at.r), s.mapH - 1)]; if (!anchor) return;
    const g = document.createElement("span"); g.className = "live-ghost " + (ok ? "ok" : "bad"); g.setAttribute("aria-hidden", "true");
    g.style.setProperty("--fw", m.fw); g.style.setProperty("--fh", m.fh);
    const img = m.kind === "object" ? objArt(m.asset) : m.kind === "unit" ? unitArt(S().units.find((u) => u.id === m.id)) : m.kind === "newunit" ? unitArt({ id: 1 }) : tileArt(m.type, 0, 0);
    if (img) g.style.backgroundImage = `url(${img})`; anchor.appendChild(g);
  }
  function renderMoveChip() {
    const el = chipEl(); if (!L.move) { el.hidden = true; return; }
    const why = moveReason(), ok = !why || why === "same";
    el.innerHTML = `<span class="lc-txt"><b>${L.move.kind === "newunit" ? "Placing a unit" : "Moving " + esc(L.move.name)}</b><small class="${ok ? "" : "lc-bad"}">${why === "same" ? "Drag it or tap a tile" : ok ? "✓ Fits here" : "✕ " + esc(why)}</small></span><button type="button" class="btn btn-ghost lc-btn" id="live-move-cancel">Cancel</button><button type="button" class="btn btn-primary lc-btn" id="live-move-ok"${ok && why !== "same" ? "" : " disabled"}>Place here</button>`;
    el.hidden = false; $("#live-move-cancel").onclick = cancelMove; $("#live-move-ok").onclick = confirmMove;
  }
  function cancelMove() { L.move = null; renderChip(); window.renderGrid && renderGrid(); }
  function confirmMove() {
    const m = L.move, s = S(), c = mapCtx(); if (!m || moveReason()) return;
    if (m.kind === "newunit") { // r68 (H): drop the new unit, select it, open its sheet
      const u = { id: s.nextId++, name: "Unit " + (s.nextId - 1), x: m.at.c, y: m.at.r, hp: 8, atk: 1, setups: [] };
      s.units.push(u); pushUndo(() => { const i = s.units.indexOf(u); if (i >= 0) s.units.splice(i, 1); });
      L.move = null; renderChip(); s.selectedUnitId = u.id; commit(); toast(`${u.name} placed`); if (window.__setStageSheet) __setStageSheet("unit"); return;
    }
    if (m.kind === "unit") { const u = s.units.find((q) => q.id === m.id); u.x = m.at.c; u.y = m.at.r; pushUndo(() => { u.x = m.from.c; u.y = m.from.r; }); }
    else if (m.kind === "object") { ProjectStore.updateMapObject(s.project, c.ref, m.id, { at: { c: m.at.c, r: m.at.r } }); pushUndo(() => ProjectStore.updateMapObject(s.project, c.ref, m.id, { at: { c: m.from.c, r: m.from.r } })); }
    else { const list = [setType(m.at.c, m.at.r, m.type), setType(m.from.c, m.from.r, "floor")]; pushUndo(() => restoreTerrain(list)); }
    L.move = null; renderMoveChip(); commit(); toast(`${m.name} moved`);
  }
  function moveTo(x, y) { if (!L.move) return; L.move.at = { c: x, r: y }; window.renderGrid && renderGrid(); renderMoveChip(); }

  /* ---------- tap hook (from app.js onCell) ---------- */
  function onCell(x, y, unit, cellEl, ev) {
    if (L.test) { if (!dupTap(x, y, ev)) testTap(x, y); return true; }
    if (L.move) { moveTo(x, y); return true; }
    if (L.brush) { brushAt(x, y); return true; }
    if (L.arm) { startNewUnit(x, y); return true; }
    if (L.erase) { if (!L.erasedOnDown) { const what = eraseAt(x, y, ev); if (what) toast(`${what} erased`); } L.erasedOnDown = false; if (L.erase) L.erase.last = null; return true; }
    if (!tapMenusOn()) return false;
    if (dupTap(x, y, ev)) return true;
    const s = S(); s.selectedCell = null; s.selectedUnitId = null;
    const side = !unitAt(x, y) && edgeNear(x, y, ev, 0.16); // r68 (I): a tap right on a wall edge opens the wall's menu
    if (side) return wallMenu(x, y, side, false), true;
    if (unitAt(x, y) || objectCovering(x, y) || typeAt(x, y) !== "floor") thingMenu(x, y); else emptyMenu(x, y);
    return true;
  }
  // r68 (G): the same physical tap can arrive twice (pointer path + click). Only swallow a repeat within 120 ms;
  // the old 400 ms window ate real second taps, so the menu opened only every other tap.
  function dupTap(x, y, ev) {
    const now = Date.now(), ts = ev && ev.timeStamp;
    const dup = L.lastTap && L.lastTap.x === x && L.lastTap.y === y && (now - L.lastTap.t < 120 || (ts && L.lastTap.ts === ts));
    L.lastTap = { x, y, t: now, ts }; return !!dup;
  }

  /* ---------- drag (touch): press a building/unit and drag; drag the ghost in Move; drag to paint ---------- */
  function cellFromPoint(cx, cy) { const el = document.elementFromPoint(cx, cy); const c = el && el.closest && el.closest("#stage-grid .cell"); return c ? { x: +c.dataset.x, y: +c.dataset.y } : null; }
  function bindDrag() {
    const scroll = $("#stage-scroll"); if (!scroll || scroll.__live) return; scroll.__live = true;
    scroll.addEventListener("pointerdown", (e) => {
      const s = S(); if (!s || s.mapTool || !e.target.closest("#stage-grid .cell")) return;
      const hit = cellFromPoint(e.clientX, e.clientY); if (!hit) return;
      if (L.test) return; // Test: taps only (onCell)
      if (L.erase) { // r68 (I): erase on press, then along the drag
        e.stopPropagation(); L.erase.last = null; const what = eraseAt(hit.x, hit.y, e); L.erasedOnDown = true; if (what) toast(`${what} erased`);
        L.drag = { sx: e.clientX, sy: e.clientY, start: hit, on: false, erase: true }; return;
      }
      // r68 (I): long-press a wall edge (no tool on) → "Delete this wall?" confirm
      clearTimeout(L.lpWall); const side = !L.move && !L.brush && !L.arm && !unitAt(hit.x, hit.y) && edgeNear(hit.x, hit.y, e, 0.16);
      if (side) { const sx = e.clientX, sy = e.clientY; L.lpWall = setTimeout(() => { L.lpWall = null; if (L.lpMoved) return; s._longPressHandled = true; setTimeout(() => { s._longPressHandled = false; }, 600); wallMenu(hit.x, hit.y, side, true); }, 520); L.lpMoved = false; L.lpStart = { sx, sy }; }
      const inGhost = L.move && hit.x >= L.move.at.c && hit.x < L.move.at.c + L.move.fw && hit.y >= L.move.at.r && hit.y < L.move.at.r + L.move.fh;
      const thing = !L.move && !L.brush && !L.arm && tapMenusOn() && (unitAt(hit.x, hit.y) || objectCovering(hit.x, hit.y));
      if (!inGhost && !thing && !L.brush) return; // empty board: pan as before
      e.stopPropagation();
      L.drag = { sx: e.clientX, sy: e.clientY, start: hit, off: L.move ? { c: hit.x - L.move.at.c, r: hit.y - L.move.at.r } : null, on: false, brush: !!L.brush };
      if (L.brush) { brushAt(hit.x, hit.y); L.drag.on = true; }
    }, true);
    window.addEventListener("pointermove", (e) => {
      if (L.lpWall && L.lpStart && Math.hypot(e.clientX - L.lpStart.sx, e.clientY - L.lpStart.sy) > 10) { L.lpMoved = true; clearTimeout(L.lpWall); L.lpWall = null; }
      const d = L.drag; if (!d) return;
      if (d.erase) { const hit = cellFromPoint(e.clientX, e.clientY); if (hit) { d.on = d.on || Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= 12; if (d.on) eraseAt(hit.x, hit.y, e); } return; }
      if (!d.on && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 12) return;
      if (!d.on) { d.on = true; if (!L.move) { startMove(d.start.x, d.start.y); d.off = { c: d.start.x - L.move.at.c, r: d.start.y - L.move.at.r }; } }
      const hit = cellFromPoint(e.clientX, e.clientY); if (!hit) return;
      if (d.brush) { brushAt(hit.x, hit.y); return; }
      const nc = hit.x - d.off.c, nr = hit.y - d.off.r; if (nc !== L.move.at.c || nr !== L.move.at.r) moveTo(nc, nr);
    });
    window.addEventListener("pointerup", () => {
      clearTimeout(L.lpWall); L.lpWall = null;
      const d = L.drag; L.drag = null; if (!d || !d.on) return;
      if (d.erase) { S()._longPressHandled = true; L.erasedOnDown = false; setTimeout(() => { const s = S(); if (s) s._longPressHandled = false; }, 400); return; }
      S()._longPressHandled = true; setTimeout(() => { const s = S(); if (s) s._longPressHandled = false; }, 400); // swallow the click after a drag
      if (!d.brush && L.move) { if (!moveReason()) confirmMove(); else if (moveReason() !== "same") { toast("Can't drop there: " + moveReason().toLowerCase()); cancelMove(); } }
    });
    // r64 bug fix: with a mouse, the stage's pointer capture retargets the click to the scroll box, so tile clicks
    // were lost on PC (touch was fine). Re-dispatch to the tile under the pointer; same handlers as a touch tap.
    scroll.addEventListener("click", (e) => {
      if (L.redispatching || !e.isTrusted || (e.target.closest && e.target.closest(".cell"))) return;
      const el = document.elementFromPoint(e.clientX, e.clientY), c = el && el.closest && el.closest("#stage-grid .cell");
      if (!c) return; L.redispatching = true;
      try { c.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: e.clientX, clientY: e.clientY })); } finally { L.redispatching = false; }
    });
    document.addEventListener("pointerdown", (e) => { // tap outside closes the popover
      const p = $("#live-pop"); if (!p || p.hidden) return;
      if (e.target.closest("#live-pop, #stage-grid .cell")) return; closePop();
    }, true);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (L.move) cancelMove(); else closePop(); } });
  }

  /* ---------- View menu (top bar) ---------- */
  function viewMenu() {
    let m = $("#live-view-menu");
    if (!m) { m = document.createElement("div"); m.id = "live-view-menu"; m.className = "stage-menu live-view-menu"; m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "View"); $("#screen-stage .stage-top").appendChild(m); }
    const seg = (key, opts, label) => `<p class="lv-lbl">${label}</p><div class="lv-seg" role="group" aria-label="${label}">${opts.map(([v, n]) => `<button type="button" class="toggle" data-lv="${key}" data-v="${v}" aria-pressed="${String(key === "tapMenus" ? tapMenusOn() === (v === "on") : key === "lines" ? prefs.lines === (v === "on") : prefs[key] === v)}">${n}</button>`).join("")}</div>`;
    m.innerHTML = seg("look", [["art", "Art"], ["blocks", "Simple blocks"]], "Look") + seg("lines", [["on", "On"], ["off", "Off"]], "Grid lines") + seg("tapMenus", [["on", "On"], ["off", "Off"]], "Tap menus") +
      `<p class="lv-hint">${stageMode() === "basic" ? "Basic: tap the board to add things. The tools below still work." : "Advanced: the tools below come first. Tap menus are optional."}</p>`;
    m.querySelectorAll("[data-lv]").forEach((b) => b.onclick = () => {
      const k = b.dataset.lv, v = b.dataset.v;
      if (k === "look") prefs.look = v; else if (k === "lines") prefs.lines = v === "on"; else prefs.tapMenus = v === "on";
      savePrefs(); if (k === "tapMenus" && !tapMenusOn()) closePop(); window.renderGrid && renderGrid(); viewMenu();
    });
    return m;
  }
  function toggleView(force) {
    const m = viewMenu(), btn = $("#btn-stage-view"); const open = force != null ? force : m.hidden !== false || m.hasAttribute("hidden");
    m.hidden = !open; btn && btn.setAttribute("aria-expanded", String(open)); if (open) closePop();
  }
  function init() {
    const btn = $("#btn-stage-view"); if (btn) btn.addEventListener("click", (e) => { e.stopPropagation(); toggleView(); });
    viewMenu().hidden = true;
    document.addEventListener("click", (e) => { const m = $("#live-view-menu"); if (m && !m.hidden && !e.target.closest("#live-view-menu, #btn-stage-view")) toggleView(false); });
    bindDrag();
    window.addEventListener("hashchange", () => { closePop(); L.move = null; L.brush = null; L.arm = null; L.erase = null; if (L.test) exitTest(); renderChip(); });
    const eb = $("#btn-erase"); if (eb) eb.addEventListener("click", () => armErase());
  }

  function stampLair(id) {
    const s = S(), c = mapCtx(); if (!s || !c) return 0;
    const recipes = {
      goblin: { enemies: ["goblin", "goblin", "goblin"], props: ["asset_rock", "asset_torch", "asset_crate"] },
      slime: { enemies: ["slime", "slime", "slime"], props: ["asset_rock", "asset_rock"], water: true },
      bandit: { enemies: ["acolyte", "acolyte"], props: ["asset_barrel", "asset_crate", "asset_torch"] },
    };
    const rec = recipes[id] || recipes.goblin;
    const empties = [];
    for (let y = 0; y < s.mapH; y++) for (let x = 0; x < s.mapW; x++) if (!blockedReason(x, y, 1, 1)) empties.push({ x, y });
    let n = 0, i = 0;
    rec.enemies.forEach((et) => {
      if (i >= empties.length) return;
      const { x, y } = empties[i++]; const e = ENEMIES[et] || ENEMIES.slime;
      const u = { id: s.nextId++, name: e.name, kind: "enemy", enemyType: et, x, y, hp: 6, atk: 1, setups: [], hostile: true };
      s.units.push(u); n++;
    });
    rec.props.forEach((pid) => {
      if (i >= empties.length) return;
      const { x, y } = empties[i++]; const m = objMeta(pid);
      if (blockedReason(x, y, m.fw, m.fh)) return;
      ensureAsset(pid); ProjectStore.addMapObject(s.project, c.ref, { assetId: pid, at: { c: x, r: y }, blocks: m.blocks }); n++;
    });
    if (rec.water && empties[i]) { const { x, y } = empties[i++]; setType(x, y, "water"); n++; }
    commit();
    return n;
  }

  window.StageLive = {
    decorate, onCell, prefs: () => Object.assign({}, prefs, { tapMenusOn: tapMenusOn(), mode: stageMode() }),
    setPrefs(p) { Object.assign(prefs, p || {}); savePrefs(); window.renderGrid && renderGrid(); },
    toggleView, closePop,
    unitMenu(x, y) { if (unitAt(x, y)) thingMenu(x, y); },
    armUnit, armErase, startTest, exitTest, testing, battleMenu, stampLair, // r69 lair stamp + r68 test
    _cap: { L, act, startMove, moveTo, confirmMove, objects, typeAt, blockedReason, tileArt, objArt, hasEdge, eraseAt, testLog: () => (L.test ? L.test.log.slice() : null) },
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
