/* TileEngine UI shell — round 64: welcome quiz + per-user setup profile (WQ-1, ux/welcome-quiz-plan.md)
   + "Get started" (Make some for me / free Starter Pack) + Settings > My setup + Next-step chip + tool tiers.
   PROVISIONAL: profile.experience shape is pending the Data & Save Keeper. Prototype stores it inside the
   studio profile (ProfileStore, localStorage "tileengine.profile.v1") as profile.experience.
   Direction (CEO): don't dumb it down, add help. Every setting only changes what's offered or shown;
   nothing is removed from data (P1). */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LIB_KEY = "tileengine.library.mock.v1"; // MOCK: real library lives in the hub/asset store
  const AREAS = [["editor", "Editor"], ["spriteStudio", "Sprite Studio"], ["stage", "Stage editor"], ["hub", "Home hub"]];

  /* ---------- the 5 questions ---------- */
  const QUESTIONS = [
    { id: "make", q: "What do you want to make first?", choices: [
      ["quick", "🎲", "A quick game", "Something small you can play today"],
      ["big", "🏰", "Something big", "A full game with stages and a story"],
      ["art", "🎨", "Art", "Heroes, enemies and tiles"],
      ["look", "👀", "Just look around", "See what's here first"]] },
    { id: "before", q: "Have you made a game before?", choices: [
      ["never", "🌱", "Never", "This is my first time"],
      ["little", "🧱", "A little", "Mario Maker, RPG Maker, Roblox"],
      ["engine", "🛠", "Yes, in an engine", "Unity, Godot, GameMaker or similar"]] },
    { id: "draw", q: "Do you draw?", choices: [
      ["no", "🙂", "Not really", "I'd like help with art"],
      ["bit", "✏️", "A bit", "I can doodle"],
      ["pixel", "👾", "Yes, pixel art", "I know my way around pixels"]] },
    { id: "code", q: "Do you code?", choices: [
      ["no", "🙂", "No", "Buttons and sliders are perfect"],
      ["little", "🔤", "A little", "I've tried it"],
      ["yes", "💻", "Yes", "I'd like to see how things work"]] },
    { id: "help", q: "How much help would you like?", choices: [
      ["step", "🧭", "Step by step", "Show me what to do next"],
      ["tips", "💡", "Tips when I'm stuck", "A hint now and then"],
      ["off", "🤫", "Stay out of my way", "No hints"]] },
  ];

  /* ---------- PROVISIONAL profile.experience shape (pending Data & Save Keeper) ----------
     { v: 1, provisional: true, source: "quiz" | "skip" | "settings",
       answers: { make, before, draw, code, help } | null,
       startMode: "basic" | "advanced",
       areas: { editor, spriteStudio, stage, hub }   // each null (= same as startMode) | "basic" | "advanced"
       toolsShown: "core" | "standard" | "all",
       startWith: "template" | "blank",
       guidance: "guided" | "tips" | "off",
       artist: boolean, coder: boolean, updatedAt: ISO string } */
  const SKIP_EXPERIENCE = () => ({ v: 1, provisional: true, source: "skip", answers: null, startMode: "basic",
    areas: { editor: null, spriteStudio: null, stage: null, hub: null }, toolsShown: "standard", startWith: "template",
    guidance: "tips", artist: false, coder: false });

  /** THE MAPPING: quiz answers -> profile.experience. One place, plain rules.
      e.g. Never + Not really + No + Step by step => Basic everywhere, core tools, templates, guided. */
  function mapAnswersToExperience(a) {
    const e = SKIP_EXPERIENCE(); e.source = "quiz"; e.answers = Object.assign({}, a);
    const exp = a.before === "engine" ? 2 : a.before === "little" ? 1 : 0;      // game-making experience 0..2
    e.artist = a.draw === "pixel";
    e.coder = a.code === "yes";
    // Mode: Advanced only for people who've used a real engine; Basic still has every feature one tap away.
    e.startMode = exp === 2 ? "advanced" : "basic";
    // Per-area overrides (only where they differ from startMode)
    const ss = a.draw === "pixel" ? "advanced" : (a.draw === "bit" && exp === 2) ? "advanced" : "basic";
    const ed = exp === 2 || (exp === 1 && a.make === "big") ? "advanced" : "basic";
    e.areas = { editor: ed, spriteStudio: ss, stage: ed, hub: "basic" };
    Object.keys(e.areas).forEach((k) => { if (e.areas[k] === e.startMode) e.areas[k] = null; });
    // Tools shown: grows with experience; coders see everything; "stay out of my way" never gets the smallest set
    e.toolsShown = e.coder || exp === 2 ? "all" : exp === 1 ? "standard" : "core";
    if (a.help === "off" && e.toolsShown === "core") e.toolsShown = "standard";
    // Start with a template unless they're experienced and building big, or a pixel artist making art
    e.startWith = (exp === 2 && a.make === "big") || (e.artist && a.make === "art") ? "blank" : "template";
    e.guidance = a.help === "step" ? "guided" : a.help === "off" ? "off" : "tips";
    return e;
  }

  /* ---------- store ---------- */
  function rawExp() { try { return window.ProfileStore ? ProfileStore.load().experience || null : null; } catch (_) { return null; } }
  function get() { return Object.assign(SKIP_EXPERIENCE(), rawExp() || {}); }
  function save(e) {
    if (!window.ProfileStore) return e;
    const p = ProfileStore.load(); e.updatedAt = new Date().toISOString(); p.experience = e; ProfileStore.save(p); return e;
  }
  function modeFor(area) { const e = get(); return (e.areas && e.areas[area]) || e.startMode; }
  function needsQuiz() { return !rawExp() && !/[?&]noquiz\b/.test(location.search); }
  function lib() { try { return JSON.parse(localStorage.getItem(LIB_KEY)) || {}; } catch (_) { return {}; } }
  function saveLib(l) { try { localStorage.setItem(LIB_KEY, JSON.stringify(l)); } catch (_) {} }
  function library() { const l = lib(); return Object.assign({ empty: !l.starterPack && !l.madeForMe }, l); }
  const show = (id) => window.__show && window.__show(id);
  const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); };

  /* ---------- labels for summary + My setup ---------- */
  const L = {
    mode: { basic: "Basic", advanced: "Advanced" },
    toolsShown: { core: "Core tools", standard: "Standard tools", all: "All tools" },
    startWith: { template: "A template", blank: "Blank" },
    guidance: { guided: "Step by step", tips: "Tips when stuck", off: "No hints" },
  };
  function modeSummary(e) {
    const diff = AREAS.filter(([k]) => e.areas[k] && e.areas[k] !== e.startMode);
    if (!diff.length) return `${L.mode[e.startMode]} everywhere`;
    return `${L.mode[e.startMode]} · ${diff.map(([k, n]) => `${n} ${L.mode[e.areas[k]]}`).join(" · ")}`;
  }
  function shortSummary(e) { return `${modeSummary(e)} · ${L.toolsShown[e.toolsShown].toLowerCase()} · ${L.guidance[e.guidance].toLowerCase()}`; }

  /* ---------- quiz ---------- */
  const Q = { i: 0, answers: {}, from: "home", open: null };
  function startQuiz(from) {
    Q.i = 0; Q.from = from || "home"; Q.open = null;
    const e = rawExp(); Q.answers = e && e.answers ? Object.assign({}, e.answers) : {};
    show("welcome");
  }
  function seg(name, opts, cur, key, extra = "") {
    return `<div class="big-seg" role="group" aria-label="${esc(name)}"${extra}>${opts.map(([v, lbl]) =>
      `<button type="button" class="toggle" data-${key}="${v}" aria-pressed="${String(cur === v)}">${esc(lbl)}</button>`).join("")}</div>`;
  }
  function renderQuiz() {
    const body = $("#wq-body"), foot = $("#wq-foot"), dots = $("#wq-dots"); if (!body) return;
    const done = Q.i >= QUESTIONS.length;
    dots.innerHTML = QUESTIONS.map((_, i) => `<span class="dot ${i < Q.i ? "done" : i === Q.i ? "on" : ""}"></span>`).join("");
    $("#wq-count").textContent = done ? "All set" : `${Q.i + 1} of ${QUESTIONS.length}`;
    $("#wq-back").style.visibility = Q.i === 0 ? "hidden" : "visible";
    $("#screen-welcome").classList.toggle("is-summary", done);
    if (!done) {
      const q = QUESTIONS[Q.i];
      body.innerHTML = `${Q.i === 0 ? `<p class="wq-hello">Welcome to TileEngine</p>` : ""}
        <h1 class="wq-q" tabindex="-1">${esc(q.q)}</h1>
        <p class="wq-sub">${Q.i === 0 ? "5 quick questions so we can set things up for you." : "Pick one. You can change it later."}</p>
        <div class="wq-choices" role="group" aria-label="${esc(q.q)}">${q.choices.map(([v, ico, lbl, sub]) =>
          `<button type="button" class="wq-choice" data-wq="${v}" aria-pressed="${String(Q.answers[q.id] === v)}"><span class="wq-ico" aria-hidden="true">${ico}</span><span class="wq-txt"><span class="wq-lbl">${esc(lbl)}</span><span class="wq-csub">${esc(sub)}</span></span></button>`).join("")}</div>`;
      foot.innerHTML = `<button type="button" class="btn btn-ghost wq-skip" id="wq-skip">Skip (just exploring)</button>`;
      $$("[data-wq]", body).forEach((b) => (b.onclick = () => {
        Q.answers[q.id] = b.dataset.wq; Q.draft = null; $$("[data-wq]", body).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        setTimeout(() => { Q.i++; Q.open = null; renderQuiz(); }, 160);
      }));
      $("#wq-skip").onclick = skipQuiz;
      return;
    }
    // Summary: "Here's how we set you up"
    const e = Q.draft || (Q.draft = mapAnswersToExperience(Q.answers));
    const rows = [
      ["mode", "Mode", modeSummary(e), seg("Mode", [["basic", "Basic"], ["advanced", "Advanced"]], e.startMode, "sum-mode")],
      ["ss", "Sprite Studio opens in", L.mode[e.areas.spriteStudio || e.startMode], seg("Sprite Studio", [["basic", "Basic"], ["advanced", "Advanced"]], e.areas.spriteStudio || e.startMode, "sum-ss")],
      ["tools", "Tools shown", L.toolsShown[e.toolsShown], seg("Tools shown", [["core", "Core"], ["standard", "Standard"], ["all", "All"]], e.toolsShown, "sum-tools")],
      ["start", "New things start from", L.startWith[e.startWith], seg("Start from", [["template", "A template"], ["blank", "Blank"]], e.startWith, "sum-start")],
      ["help", "Help", L.guidance[e.guidance], seg("Help", [["guided", "Step by step"], ["tips", "Tips"], ["off", "Off"]], e.guidance, "sum-help")],
    ];
    body.innerHTML = `<h1 class="wq-q" tabindex="-1">Here's how we set you up</h1>
      <p class="wq-sub">Every tool is still there. Change anything now or later in Settings › My setup.</p>
      <div class="wq-sum">${rows.map(([k, lbl, val, ctl]) => `<div class="wq-row${Q.open === k ? " is-open" : ""}">
        <div class="wq-row-main"><span class="wq-row-txt"><span class="wq-row-lbl">${esc(lbl)}</span><span class="wq-row-val">${esc(val)}</span></span>
        <button type="button" class="toggle wq-change" data-open="${k}" aria-expanded="${String(Q.open === k)}" aria-label="Change ${esc(lbl)}">${Q.open === k ? "Done" : "Change"}</button></div>
        ${Q.open === k ? ctl : ""}</div>`).join("")}</div>`;
    foot.innerHTML = `<button type="button" class="btn btn-primary wq-go" id="wq-go">Let's go</button>`;
    $$("[data-open]", body).forEach((b) => (b.onclick = () => { Q.open = Q.open === b.dataset.open ? null : b.dataset.open; renderQuiz(); }));
    const on = (key, fn) => $$(`[data-${key}]`, body).forEach((b) => (b.onclick = () => { fn(b.getAttribute(`data-${key}`)); renderQuiz(); }));
    on("sum-mode", (v) => { const ss = e.areas.spriteStudio || e.startMode; e.startMode = v; e.areas = { editor: null, spriteStudio: ss === v ? null : ss, stage: null, hub: null }; });
    on("sum-ss", (v) => { e.areas.spriteStudio = v === e.startMode ? null : v; });
    on("sum-tools", (v) => (e.toolsShown = v));
    on("sum-start", (v) => (e.startWith = v));
    on("sum-help", (v) => (e.guidance = v));
    $("#wq-go").onclick = () => {
      const fromSetup = Q.from === "my-setup"; save(Q.draft); Q.draft = null;
      if (fromSetup) { show("my-setup"); toast("Your setup is updated"); }
      else { GS.from = Q.from === "home" ? "home" : Q.from; show("get-started"); }
    };
  }
  function skipQuiz() {
    const e = SKIP_EXPERIENCE(); Q.draft = null; save(e);
    show(Q.from === "welcome" ? "home" : Q.from); toast("Just exploring. Set things up any time in Settings › My setup.");
  }

  /* ---------- Get started: Make some for me / free Starter Pack ---------- */
  const GS = { from: "home", seed: 7, set: null };
  function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const PALETTES = [
    { id: "ashroad-day", name: "Ashroad · day", c: ["#b49a7a", "#8a7f78", "#6f8f4e", "#5a5560", "#c0603a"] },
    { id: "moonlit-night", name: "Moonlit · night", c: ["#3a4a6a", "#26304a", "#4a6a6a", "#7a8ab0", "#c8d4f0"] },
    { id: "meadow", name: "Meadow", c: ["#7ab85a", "#4e8a3e", "#c8b47a", "#5a8ac8", "#8a6a4a"] },
    { id: "dungeon", name: "Dungeon", c: ["#4a4458", "#2e2a3a", "#7a6a5a", "#a89a7a", "#3a5a4a"] },
  ];
  const ENEMY_SHAPES = ["Slime", "Horned slime", "Spiky blob"];
  const ENEMY_COLOURS = ["Green", "Purple", "Red", "Blue", "Gold", "Grey"];
  function enemyImg(shape) { // code-drawn 32x32, ramp 0 body, 1 eyes, 2 horns/spikes
    const W = 32, img = new Uint8Array(W * W), S = (r, t) => r * 3 + t + 1, set = (x, y, v) => { if (x >= 0 && y >= 0 && x < W && y < W) img[y * W + x] = v; };
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const dx = (x + 0.5 - 16) / 11, dy = (y + 0.5 - 21) / 9; if (dx * dx + dy * dy <= 1 && y <= 28) set(x, y, S(0, 1)); }
    [[11, 18], [19, 18]].forEach(([x, y]) => { set(x, y, S(1, 0)); set(x + 1, y, S(1, 0)); set(x, y + 1, S(1, 0)); set(x + 1, y + 1, S(1, 0)); });
    if (shape === "Horned slime") [[9, 8], [22, 8]].forEach(([x, y0]) => { for (let k = 0; k < 5; k++) { set(x + (x < 16 ? k >> 1 : -(k >> 1)), y0 + 4 - k + 1, S(2, 1)); set(x + 1 + (x < 16 ? k >> 1 : -(k >> 1)) - (x < 16 ? 0 : 2), y0 + 4 - k + 2, S(2, 1)); } });
    if (shape === "Spiky blob") [10, 15, 20].forEach((x) => { for (let k = 0; k < 3; k++) for (let w = 0; w < 3 - k; w++) set(x + w + (k > 0 ? 0 : 0), 11 - k, S(2, 1)); });
    return img;
  }
  function effectImg(kind) { // code-drawn burst/projectile, ramp 0
    const W = 32, img = new Uint8Array(W * W), S = (t) => t + 1;
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const d = Math.hypot(x + 0.5 - 16, y + 0.5 - 16), a = Math.atan2(y - 16, x - 16);
      if (kind === "burst" && (d <= 4 || (d <= 12 && Math.abs(Math.sin(a * 4)) > 0.9))) img[y * W + x] = S(1);
      if (kind === "orb" && d <= 7) img[y * W + x] = S(1);
      if (kind === "arrow" && ((y === 16 && x > 6 && x < 24) || (Math.abs(y - 16) <= 25 - x && x >= 22 && x <= 25))) img[y * W + x] = S(1); }
    return img;
  }
  function makeSet(seed) {
    const r = rng(seed * 2654435761), e = get(), a = e.answers || {};
    const nH = a.make === "art" ? 4 : a.make === "big" ? 3 : 2, nE = a.make === "big" ? 4 : a.make === "art" ? 2 : 3;
    const P = window.SpriteStudio.parts, heroes = [];
    for (let i = 0; i < nH; i++) {
      const preset = { body: pick(r, P.PRESETS.body).id, hair: pick(r, P.PRESETS.hair.filter((h) => h.id !== "none")).id, outfit: pick(r, P.PRESETS.outfit).id, weapon: pick(r, P.PRESETS.weapon.filter((w) => w.id !== "none")).id };
      const colours = {}; P.PIECES.forEach((p) => (colours[p.name] = pick(r, P.SWATCHES[p.set]).name));
      colours.Skin = pick(r, P.SWATCHES.skin.slice(0, 5)).name; colours.Weapon = colours.Boots === "Steel" ? "Steel" : colours.Weapon;
      heroes.push({ preset, colours });
    }
    const shape = pick(r, ENEMY_SHAPES), cols = ENEMY_COLOURS.slice().sort(() => r() - 0.5).slice(0, nE);
    const palette = a.make === "big" ? PALETTES[Math.floor(r() * 2)] : pick(r, PALETTES);
    return { heroes, enemies: cols.map((c) => ({ shape, colour: c })), palette, fit: a.make || "look" };
  }
  const FIT = { quick: "a quick game", big: "something big", art: "making art", look: "looking around" };
  function heroCanvas(h, cls = "") { const c = document.createElement("canvas"); c.className = "px-thumb " + cls; window.SpriteStudio.heroThumb(h.preset, h.colours, c); return c; }
  function enemyCanvas(en, cls = "") { const c = document.createElement("canvas"); c.className = "px-thumb " + cls; window.SpriteStudio.rampThumb(enemyImg(en.shape), 32, 32, [{ set: "cloth", name: en.colour }, { set: "hair", name: "Black" }, { set: "metal", name: "Bronze" }], c); return c; }
  function effectCanvas(kind, sw, cls = "") { const c = document.createElement("canvas"); c.className = "px-thumb " + cls; window.SpriteStudio.rampThumb(effectImg(kind), 32, 32, [{ set: "metal", name: sw }], c); return c; }
  function tileCanvas(pal, kind, seed) { // code-drawn 16x16 tile
    const c = document.createElement("canvas"); c.width = c.height = 16; c.className = "px-thumb px-tile"; const g = c.getContext("2d"), r = rng(seed);
    const base = { floor: pal.c[0], grass: pal.c[2], wall: pal.c[3], water: pal.c[1] }[kind], dot = { floor: pal.c[1], grass: pal.c[4], wall: pal.c[1], water: pal.c[4] }[kind];
    g.fillStyle = base; g.fillRect(0, 0, 16, 16); g.fillStyle = dot;
    if (kind === "wall") { for (let y = 0; y < 16; y += 4) { g.fillRect(0, y, 16, 1); for (let x = (y / 4) % 2 ? 2 : 6; x < 16; x += 8) g.fillRect(x, y, 1, 4); } }
    else if (kind === "water") { for (let y = 3; y < 16; y += 5) for (let x = 0; x < 16; x++) if ((x + y) % 6 < 3) g.fillRect(x, y + ((x % 6) < 1 ? 1 : 0), 1, 1); }
    else for (let k = 0; k < 9; k++) g.fillRect(Math.floor(r() * 16), Math.floor(r() * 16), 1, kind === "grass" ? 2 : 1);
    return c;
  }
  function thumbCard(canvas, label) { const d = document.createElement("div"); d.className = "px-card"; d.appendChild(canvas); const s = document.createElement("span"); s.className = "px-lbl"; s.textContent = label; d.appendChild(s); return d; }
  function renderGetStarted() {
    const m = $("#gs-make-art"), p = $("#gs-pack-art"); if (!m || !window.SpriteStudio) return;
    m.innerHTML = ""; p.innerHTML = "";
    const s = makeSet(GS.seed); s.heroes.slice(0, 2).forEach((h) => m.appendChild(heroCanvas(h))); m.appendChild(enemyCanvas(s.enemies[0]));
    PACK.heroes.slice(0, 2).forEach((h) => p.appendChild(heroCanvas(h))); p.appendChild(enemyCanvas(PACK.enemies[1])); p.appendChild(tileCanvas(PALETTES[0], "grass", 3));
    const a = get().answers; $("#gs-make-sub").textContent = `A hero, enemies and tiles to fit ${FIT[(a && a.make) || "look"]}. Shuffle until you like them.`;
    $("#gs-make").onclick = () => openStarter("make", GS.from);
    $("#gs-pack").onclick = () => openStarter("pack", GS.from);
    $("#gs-later").onclick = () => show(GS.from);
  }
  function openStarter(which, from) { GS.from = from || GS.from; if (which === "make") GS.set = null; show(which === "make" ? "starter-make" : "starter-pack"); }
  function renderMake() {
    const b = $("#sm-body"); if (!b || !window.SpriteStudio) return;
    const s = GS.set || (GS.set = makeSet(GS.seed)), e = get();
    b.innerHTML = `<p class="hint gs-lead">Picked to fit ${FIT[s.fit]} · ${L.mode[modeFor("spriteStudio")]} Sprite Studio. Every piece is editable.</p>
      <p class="eyebrow">Heroes · ${s.heroes.length}</p><div class="px-grid" id="sm-heroes"></div>
      <p class="eyebrow">Enemies · ${s.enemies.length} colour variants</p><div class="px-grid" id="sm-enemies"></div>
      <p class="eyebrow">Tiles · ${esc(s.palette.name)}</p><div class="px-grid px-grid-tiles" id="sm-tiles"></div>
      <div class="pal-row" aria-label="Palette ${esc(s.palette.name)}">${s.palette.c.map((c) => `<span class="pal-sw" style="background:${c}"></span>`).join("")}</div>
      <p class="hint ss-tight" style="margin-top:10px">Made by TileEngine · free to use</p>`;
    s.heroes.forEach((h) => $("#sm-heroes").appendChild(thumbCard(heroCanvas(h), `${cap(h.preset.hair)} · ${h.preset.weapon}`)));
    s.enemies.forEach((en) => $("#sm-enemies").appendChild(thumbCard(enemyCanvas(en), `${en.colour} ${en.shape.toLowerCase()}`)));
    ["floor", "grass", "wall", "water"].forEach((k, i) => $("#sm-tiles").appendChild(thumbCard(tileCanvas(s.palette, k, GS.seed * 10 + i), cap(k))));
    $("#sm-back").onclick = () => show("get-started");
    $("#sm-shuffle").onclick = () => { GS.seed++; GS.set = null; renderMake(); announce("Shuffled: a new starter set"); };
    $("#sm-keep").onclick = () => {
      const l = lib(); l.madeForMe = { keptAt: new Date().toISOString(), heroes: s.heroes, enemies: s.enemies, palette: s.palette.id }; saveLib(l);
      toast(`Kept: ${s.heroes.length} heroes, ${s.enemies.length} enemies and ${s.palette.name} tiles are in your library`);
      show(GS.from === "get-started" ? "home" : GS.from);
    };
    void e;
  }
  const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
  function announce(m) { const l = $("#ss-live"); if (l) l.textContent = m; }
  // Free Starter Pack (hub listing). Counts match ux/starter-pack-contents.md (v1 targets).
  const PACK = {
    heroes: [
      { preset: { body: "classic", hair: "short", outfit: "tunic", weapon: "sword" }, colours: { Skin: "Peach", Hair: "Brown", Shirt: "Blue", Trousers: "Brown", Boots: "Leather", Weapon: "Steel" } },
      { preset: { body: "small", hair: "long", outfit: "robe", weapon: "staff" }, colours: { Skin: "Fair", Hair: "White", Shirt: "Purple", Trousers: "Gold", Boots: "Leather", Weapon: "Wood" } },
      { preset: { body: "sturdy", hair: "spiky", outfit: "armour", weapon: "sword" }, colours: { Skin: "Brown", Hair: "Red", Shirt: "Grey", Trousers: "Red", Boots: "Steel", Weapon: "Steel" } },
      { preset: { body: "classic", hair: "long", outfit: "tunic", weapon: "bow" }, colours: { Skin: "Tan", Hair: "Blonde", Shirt: "Green", Trousers: "Brown", Boots: "Dark leather", Weapon: "Wood" } },
    ],
    enemies: [{ shape: "Slime", colour: "Green" }, { shape: "Horned slime", colour: "Purple" }, { shape: "Spiky blob", colour: "Red" }, { shape: "Slime", colour: "Blue" }],
  };
  function renderPack() {
    const b = $("#sp-body"); if (!b || !window.SpriteStudio) return;
    const added = !!lib().starterPack;
    b.innerHTML = `<article class="hub-listing" aria-label="TileEngine Starter Pack">
        <div class="hl-art" id="sp-art" aria-hidden="true"></div>
        <h2 class="hl-title">TileEngine Starter Pack</h2>
        <p class="hl-meta"><span class="hl-price">0 gold</span> · Free · Made by TileEngine</p>
        <p class="hint ss-tight">Everything for a first game. Free to use in your games, even ones you sell.</p>
      </article>
      <p class="eyebrow" style="margin-top:14px">What's inside</p>
      <div class="sp-group"><p class="sp-h">Heroes <span>8</span></p><div class="px-row" id="sp-heroes"></div></div>
      <div class="sp-group"><p class="sp-h">Enemies <span>10 + 2 bosses</span></p><div class="px-row" id="sp-enemies"></div></div>
      <div class="sp-group"><p class="sp-h">Tiles <span>Ashroad + Moonlit, day and night</span></p><div class="px-row" id="sp-tiles"></div></div>
      <div class="sp-group"><p class="sp-h">Effects <span>12</span></p><div class="px-row" id="sp-fx"></div></div>
      <div class="sp-group"><p class="sp-h">UI <span>icons, frames, health bars, buttons</span></p><div class="px-row sp-ui">
        <span class="ui-ico" aria-label="Heart icon">♥</span><span class="ui-ico ui-coin" aria-label="Coin icon">●</span>
        <span class="ui-bar" aria-label="Health bar"><span></span></span><span class="ui-btn" aria-label="Button frame">OK</span></div></div>
      <div class="sp-group"><p class="sp-h">Sounds <span>20 effects + 3 songs</span></p><div class="px-row sp-snd">
        ${["Step", "Hit", "Coin", "Town theme"].map((n) => `<span class="snd-chip"><span aria-hidden="true">♪</span> ${n}</span>`).join("")}</div></div>
      <p class="hint" style="margin-top:6px">Also: 6 NPCs, 15 items, props, portraits, 5 starter behaviours and one sample stage.</p>`;
    PACK.heroes.slice(0, 4).forEach((h) => $("#sp-heroes").appendChild(heroCanvas(h)));
    PACK.enemies.forEach((en) => $("#sp-enemies").appendChild(enemyCanvas(en)));
    [[PALETTES[0], "floor"], [PALETTES[0], "grass"], [PALETTES[0], "wall"], [PALETTES[1], "floor"], [PALETTES[1], "water"]].forEach(([p, k], i) => $("#sp-tiles").appendChild(tileCanvas(p, k, 40 + i)));
    [["burst", "Gold"], ["orb", "Crystal"], ["arrow", "Wood"], ["orb", "Obsidian"]].forEach(([k, s]) => $("#sp-fx").appendChild(effectCanvas(k, s)));
    const art = $("#sp-art"); [PACK.heroes[0], PACK.heroes[2]].forEach((h) => art.appendChild(heroCanvas(h))); art.appendChild(enemyCanvas(PACK.enemies[1])); art.appendChild(heroCanvas(PACK.heroes[1]));
    const bar = $("#screen-starter-pack .sp-bar");
    bar.classList.toggle("is-added", added);
    bar.innerHTML = added
      ? `<span class="sp-added" role="status"><span aria-hidden="true">✓</span> In your library</span><button type="button" class="btn btn-primary" id="sp-use">Use it now</button>`
      : `<button type="button" class="btn btn-primary" id="sp-add">Add to my library · Free</button>`;
    $("#sp-back").onclick = () => show("get-started");
    $("#sp-add") && ($("#sp-add").onclick = () => { const l = lib(); l.starterPack = { addedAt: new Date().toISOString(), id: "tileengine-starter-pack@1" }; saveLib(l); renderPack(); toast("Starter Pack added to your library"); });
    $("#sp-use") && ($("#sp-use").onclick = () => show(GS.from === "get-started" ? "home" : GS.from));
  }

  /* ---------- Settings > My setup ---------- */
  function renderMySetup() {
    const b = $("#ms-body"); if (!b) return; const e = get();
    b.innerHTML = `<p class="proposed-banner">Proposed: not final</p>
      <p class="hint">Choose what TileEngine shows you. Nothing you've made changes, and every tool stays one tap away.</p>
      <section class="ms-sec"><p class="ms-h">Start in</p>${seg("Start in", [["basic", "Basic"], ["advanced", "Advanced"]], e.startMode, "ms-mode")}</section>
      <section class="ms-sec"><p class="ms-h">Mode by area</p><p class="hint ss-tight">Same follows Start in.</p>${AREAS.map(([k, n]) => `<div class="ms-area"><span class="ms-area-n">${n}</span>
        ${seg(n + " mode", [["same", "Same"], ["basic", "Basic"], ["advanced", "Advanced"]], e.areas[k] || "same", "ms-area", ` data-area="${k}"`)}</div>`).join("")}</section>
      <section class="ms-sec"><p class="ms-h">Tools shown</p>${seg("Tools shown", [["core", "Core"], ["standard", "Standard"], ["all", "All"]], e.toolsShown, "ms-tools")}
        <p class="hint ss-tight">${{ core: "The main tools. The rest wait in More, ready when you want them.", standard: "Most tools. A few expert ones wait in More.", all: "Every tool on show." }[e.toolsShown]}</p></section>
      <section class="ms-sec"><p class="ms-h">New things start from</p>${seg("Start from", [["template", "A template"], ["blank", "Blank"]], e.startWith, "ms-start")}</section>
      <section class="ms-sec"><p class="ms-h">Help</p>${seg("Help", [["guided", "Step by step"], ["tips", "Tips"], ["off", "Off"]], e.guidance, "ms-help")}
        <p class="hint ss-tight">${{ guided: "A Next step button shows what to do next.", tips: "A hint now and then, when you seem stuck.", off: "No hints. Press ? on any screen for help." }[e.guidance]}</p></section>
      <section class="ms-sec"><p class="ms-h">I draw pixel art</p>${seg("I draw pixel art", [["yes", "Yes"], ["no", "No"]], e.artist ? "yes" : "no", "ms-artist")}</section>
      <section class="ms-sec"><p class="ms-h">I write code</p>${seg("I write code", [["yes", "Yes"], ["no", "No"]], e.coder ? "yes" : "no", "ms-coder")}</section>`;
    const on = (key, fn) => $$(`[data-${key}]`, b).forEach((x) => (x.onclick = () => { const e2 = get(); fn(e2, x.getAttribute(`data-${key}`), x); e2.source = "settings"; save(e2); const top = b.scrollTop; renderMySetup(); b.scrollTop = top; }));
    on("ms-mode", (e2, v) => (e2.startMode = v));
    on("ms-area", (e2, v, x) => (e2.areas[x.closest("[data-area]").dataset.area] = v === "same" ? null : v));
    on("ms-tools", (e2, v) => (e2.toolsShown = v));
    on("ms-start", (e2, v) => (e2.startWith = v));
    on("ms-help", (e2, v) => (e2.guidance = v));
    on("ms-artist", (e2, v) => (e2.artist = v === "yes"));
    on("ms-coder", (e2, v) => (e2.coder = v === "yes"));
    $("#ms-retake").onclick = () => startQuiz("my-setup");
    $("#ms-done").onclick = () => show("profile");
  }

  /* ---------- tiers (hide only) + stage Next-step chip ---------- */
  function applyTiers() {
    const t = get().toolsShown;
    $$("[data-tier]").forEach((el) => el.classList.toggle("is-tier-hidden", t === "core" && el.dataset.tier === "standard"));
    const more = $("#sheet-more"); if (more) {
      let n = $("#stage-more-tucked"); if (!n) { n = document.createElement("p"); n.id = "stage-more-tucked"; n.className = "hint ss-tight"; more.querySelector(".sheet-row").after(n); }
      const k = $$("#sheet-more [data-tier]").filter((x) => x.classList.contains("is-tier-hidden")).length + $$(".stage-rail [data-tier].is-tier-hidden").length;
      n.hidden = !k; n.textContent = `${k} more tools are tucked away. Show them in Settings › My setup.`;
    }
  }
  function stageStep() {
    if (get().guidance !== "guided" || !window.ProfileStore) return null;
    const sh = $("#stage-sheet"); if (sh && !sh.hidden) return null;
    const p = ProfileStore.load(), n = (ev) => ProfileStore.counterSum(p, ev);
    if (!n("unitPlaced")) return { label: "Place your hero", go: () => $("#rail-units") && $("#rail-units").click() };
    if (!n("tilePainted")) return { label: "Paint the floor", go: () => $("#rail-paint") && $("#rail-paint").click() };
    if (!n("previewStarted")) return { label: "Press Play to try it", go: () => $("#btn-stage-play") && $("#btn-stage-play").click() };
    return null;
  }
  function renderStageNext() {
    const c = $("#stage-next"); if (!c) return; const s = stageStep(); c.hidden = !s;
    if (s) { $("#stage-next-text").textContent = s.label; c.setAttribute("aria-label", "Next step: " + s.label); c.onclick = s.go; }
  }
  function onShow(id) {
    applyTiers();
    if (id === "welcome") { $("#wq-back").onclick = () => { if (Q.i > 0) { Q.i--; Q.draft = null; Q.open = null; renderQuiz(); } }; renderQuiz(); }
    if (id === "my-setup") renderMySetup();
    if (id === "get-started") renderGetStarted();
    if (id === "starter-make") renderMake();
    if (id === "starter-pack") renderPack();
    if (id === "stage") renderStageNext();
    if (id === "profile") { const s = $("#setup-entry-sub"); if (s) s.textContent = shortSummary(get()); }
  }
  document.addEventListener("click", () => setTimeout(() => { if ($("#screen-stage.active")) renderStageNext(); }, 60), true);

  window.Experience = { QUESTIONS, mapAnswersToExperience, get, save, modeFor, needsQuiz, startQuiz, onShow, library, openStarter,
    _cap: { Q, GS, makeSet, setSeed(n) { GS.seed = n; GS.set = null; }, clearLibrary() { localStorage.removeItem(LIB_KEY); } } };
})();
