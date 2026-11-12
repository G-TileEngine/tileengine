/* r69 QoL: Basic ability picker, unit-sheet home, defaults, Play-on-stage, Stages type, Keep-as-asset helpers.
   Plan: ux/qol-plan-r69.md. LOCAL ONLY. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const toast = (m) => {
    const t = $("#toast"); if (!t) return;
    t.textContent = m; t.classList.add("show"); clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  };
  const state = () => window.__state;
  const show = (id) => window.__show && window.__show(id);
  const isBasic = (area) => !window.Experience || Experience.modeFor(area || "editor") !== "advanced";
  const selectedUnit = () => { const s = state(); return s && s.units ? (s.units.find((u) => u.id === s.selectedUnitId) || null) : null; };
  const beh = (id) => window.__behaviourById ? __behaviourById(id) : null;
  const shortName = (b, doc) => window.__abilityShortName ? __abilityShortName(b, doc) : ((b && b.name) || (doc && doc.behaviourId) || "Ability");
  const word = { add: () => (isBasic() ? "+ Add ability" : "+ Add behaviour"), one: () => (isBasic() ? "ability" : "behaviour"), many: () => (isBasic() ? "Abilities" : "Behaviours"), pickTitle: () => (isBasic() ? "Add an ability" : "Browse all behaviours") };

  /* ---------- catalogue browse (Basic) ---------- */
  const GOALS = [
    { id: "move", name: "Move", sub: "Walk, step, reach", ids: ["step-pattern", "teleport", "reach-extension"], more: null,
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 3v14M10 3l-3.5 3.5M10 3l3.5 3.5M4 17h12"/></svg>' },
    { id: "attack", name: "Attack", sub: "Strikes and shots", ids: ["basic-attack", "line-shot", "pierce-line", "sky-drop", "radial-volley", "splash-hop"],
      more: "More in Advanced: Joint Attack, Random Multi-Strike, Target Lock",
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 15L15 5M11 5h4v4M6 11l-2 6 6-2"/></svg>' },
    { id: "defend", name: "Defend", sub: "Shields, walls, taunts", ids: ["shield-immunity", "barrier-line", "taunt"], more: null,
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 2.5l7 2.5v5.2c0 4-3 6.8-7 7.8-4-1-7-3.8-7-7.8V5l7-2.5z"/></svg>' },
    { id: "support", name: "Support", sub: "Heals, cleanses, buffs", ids: ["heal", "cleanse", "revive", "stat-buff"],
      more: "More in Advanced: Stat Copy / Swap, Buffer → Firer, On-Death Trigger",
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 6.5v7M6.5 10h7"/></svg>' },
    { id: "spells", name: "Spells", sub: "Waves, bursts, summons", ids: ["lane-sweep", "cross-burst", "cone-sweep", "orbit-ring", "summon-unit", "pull-hook"],
      more: "More in Advanced: Holy Sword, Autonomous Avatar",
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.8 4.8l2 2M13.2 13.2l2 2M15.2 4.8l-2 2M6.8 13.2l-2 2"/><circle cx="10" cy="10" r="2.2"/></svg>' },
    { id: "status", name: "Status", sub: "Stun, poison, push", ids: ["stun-hold", "trap-tile", "slow-tiles", "damage-over-time", "push-knockback"], more: null,
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 2.8c2.6 4.2 5 6.3 5 9.2A5 5 0 1 1 5 12c0-2.9 2.4-5 5-9.2z"/></svg>' },
    { id: "ai", name: "AI", sub: "How a bot chooses", ids: ["bot-ability-priority", "reveal-intent"], more: null,
      ico: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="6" width="12" height="9" rx="2"/><path d="M8 6V4.5M12 6V4.5M7.5 10.5h.1M12.5 10.5h.1M8 13h4"/></svg>' },
  ];
  const MARKS = { teleport: "Needs a summon", "splash-hop": "Check range" };
  const PLAIN = {
    "step-pattern": "How this unit walks: shape and step length.",
    teleport: "Blink to an empty tile beside one of your summons.",
    "reach-extension": "When hurt, the next two actions reach farther.",
    "basic-attack": "Hit a neighbouring tile. Free, no mana.",
    "line-shot": "A straight shot. Stops on the first body.",
    "pierce-line": "A shot that goes through the first body.",
    "sky-drop": "A telegraphed strike from above.",
    "radial-volley": "Rays lock onto targets as they launch.",
    "splash-hop": "A short hop that hits the tile you land beside.",
    "shield-immunity": "A shield that also blocks a status.",
    "barrier-line": "Raise a wall on a tile seam, or a cage.",
    taunt: "Force a nearby foe to target this unit.",
    heal: "Restore hit points to a nearby ally.",
    cleanse: "Strip a harmful status from an ally.",
    revive: "Bring a fallen ally back with some health.",
    "stat-buff": "Raise an ally’s attack or health for a short time.",
    "lane-sweep": "A wave down a row or column.",
    "cross-burst": "A burst north, east, south and west of a host.",
    "cone-sweep": "A cone of hits in front of the unit.",
    "orbit-ring": "A ring of hits around the unit.",
    "summon-unit": "Call an ally onto an empty nearby tile.",
    "pull-hook": "Pull a target toward this unit.",
    "stun-hold": "The target skips its next turns.",
    "trap-tile": "A tile that triggers when someone steps on it.",
    "slow-tiles": "Tiles that slow whoever walks them.",
    "damage-over-time": "Poison: it keeps hurting for a few turns.",
    "push-knockback": "Push a target back, or charge into them.",
    "bot-ability-priority": "The order a bot picks its abilities.",
    "reveal-intent": "Show what a foe is about to do.",
  };
  const MINI = {
    "step-pattern": "......o...ouo...o......",
    teleport: "......s.o...u..........",
    "reach-extension": ".....ooo..ouo..ooo.....",
    "basic-attack": "......h...huh...h......",
    "line-shot": "..........uohh.........",
    "pierce-line": "..........uohho........",
    "sky-drop": "..h...............u....",
    "radial-volley": ".....h.h...u...h.h.....",
    "splash-hop": "..........u.h..........",
    "shield-immunity": "......o...ouo...o......",
    "barrier-line": "......f...u............",
    taunt: "..........u..h.........",
    heal: "......f...fuf...f......",
    cleanse: "..........u.f..........",
    revive: "......f...fuf...f......",
    "stat-buff": "..........u.f..........",
    "lane-sweep": ".....hhhhhu............",
    "cross-burst": "......h...huh...h......",
    "cone-sweep": ".....hhh...h....u......",
    "orbit-ring": ".....hhh..huh..hhh.....",
    "summon-unit": "......s...s.us.........",
    "pull-hook": "..........u.oh.........",
    "stun-hold": "..........u..h.........",
    "trap-tile": "......f...u............",
    "slow-tiles": "......o...ouo...o......",
    "damage-over-time": "..........u..h.........",
    "push-knockback": "..........u.oh.........",
    "bot-ability-priority": "......o...oux...o......",
    "reveal-intent": "......h........u......",
  };
  const ROLES = [
    { id: "warrior", name: "Warrior", ids: ["step-pattern", "basic-attack", "shield-immunity"], note: null },
    { id: "archer", name: "Archer", ids: ["step-pattern", "line-shot", "target-lock"], note: "Line Shot’s default caster class is mage — confirm with the Librarian." },
    { id: "mage", name: "Mage", ids: ["step-pattern", "lane-sweep", "damage-over-time"], note: null },
    { id: "healer", name: "Healer", ids: ["step-pattern", "heal", "cleanse"], note: null },
    { id: "scout", name: "Scout", ids: ["step-pattern", "reveal-intent", "basic-attack"], note: "Teleport isn’t included: it blinks beside a summon." },
  ];
  const ATTACK_IDS = ["basic-attack", "line-shot", "pierce-line", "sky-drop", "radial-volley", "splash-hop", "random-strikes", "lane-sweep", "cross-burst"];
  const THREAT_BEHS = ["bot-ability-priority", "trap-tile"];
  const PROJECT_RULES = ["action-budget", "mana-pool", "win-condition", "damage-resolution", "unit-roster", "resource-gain", "xp-levels"];

  function mini(id) {
    const cells = MINI[id] || ".........................";
    const map = { ".": "", u: "unit", o: "on", h: "hit", s: "sum", f: "safe", x: "self" };
    return `<span class="qol-mini" aria-hidden="true">${[...cells].map((c) => `<i class="${map[c] || ""}"></i>`).join("")}</span>`;
  }
  function setupsOf(u) { return (u && u.setups) || []; }
  function hasBeh(u, id) { return setupsOf(u).some((s) => s.doc && s.doc.behaviourId === id); }
  function suggestionsFor(u) {
    const out = [];
    if (!u) return out;
    const list = setupsOf(u);
    if (!list.length) return [{ id: "__role", label: "Start from a role" }];
    if (hasBeh(u, "teleport")) {
      if (!hasBeh(u, "ability-availability")) out.push({ id: "ability-availability", label: "Add a cooldown" });
      if (!hasBeh(u, "stun-hold")) out.push({ id: "stun-hold", label: "Pair with Stun" });
    }
    if (list.some((s) => ATTACK_IDS.indexOf(s.doc && s.doc.behaviourId) >= 0) && !hasBeh(u, "stun-hold") && !hasBeh(u, "damage-over-time"))
      out.push({ id: "stun-hold", label: "Pair with Stun" });
    if (hasBeh(u, "heal") && !hasBeh(u, "cleanse")) out.push({ id: "cleanse", label: "Add Cleanse" });
    if (hasBeh(u, "shield-immunity") && !hasBeh(u, "taunt")) out.push({ id: "taunt", label: "Add Taunt" });
    if (hasBeh(u, "summon-unit") && !hasBeh(u, "teleport")) out.push({ id: "teleport", label: "Add Teleport" });
    if (list.length === 1 && hasBeh(u, "step-pattern") && !hasBeh(u, "basic-attack")) out.push({ id: "basic-attack", label: "Add Basic Attack" });
    return out.slice(0, 3);
  }
  function hiddenOnThisStage(id) {
    const pal = stagePalette();
    if (!pal || pal.showThreats) return false;
    if (id === "basic-attack") return false;
    return THREAT_BEHS.indexOf(id) >= 0;
  }

  /* ---------- add with defaults (Basic) ---------- */
  function addById(id, { silent } = {}) {
    const s = state(), u = selectedUnit();
    if (!s || !u || !window.SetupStore) return false;
    if (hiddenOnThisStage(id)) { toast("That stays hidden on a Safe stage until you add a threat or event."); return false; }
    if (hasBeh(u, id)) { toast("Already on this unit"); return false; }
    const created = SetupStore.createSetup(id, s.catalogueDoc, (beh(id) || {}).name);
    if (!created || !created.doc) { toast("Can't add that"); return false; }
    const loaded = SetupStore.loadSetup(created.doc, s.catalogueDoc);
    const entry = { id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), doc: loaded.doc, notices: loaded.notices || [] };
    u.setups = u.setups || [];
    u.setups.push(entry);
    s.activeSetupId = entry.id;
    s.draftDoc = null;
    if (window.__persistProject) __persistProject();
    if (window.renderGrid) renderGrid();
    if (!silent) toast(`${shortName(beh(id), entry.doc)} added to ${u.name}`);
    return true;
  }
  function tryQuickAdd(id, opts) {
    const s = state();
    if (!s) return false;
    if (opts && opts.forceForm) return false;
    if (!isBasic() || s.qolAdvancedBrowse) return false;
    if (PROJECT_RULES.indexOf(id) >= 0) { toast("Turns, mana and win rules live in Settings."); return true; }
    if (addById(id)) { if (window.__showAbilities) __showAbilities(true); }
    return true;
  }
  function applyRole(role) {
    const u = selectedUnit(); if (!u || !role) return;
    let n = 0;
    role.ids.forEach((id) => { if (!hasBeh(u, id) && addById(id, { silent: true })) n++; });
    toast(`${role.name} set added to ${u.name}${n ? ` · ${n} ${word.many().toLowerCase()}` : ""}`);
    if (window.__showAbilities) __showAbilities(true);
  }

  /* ---------- picker views ---------- */
  let pickerView = "home"; // home | roles | advanced | goal id
  function setPickerChrome(title, sub, backTo) {
    const h = $("#screen-pick-behaviour h1");
    const eye = $("#screen-pick-behaviour .eyebrow");
    const hint = $("#screen-pick-behaviour .body > .hint");
    const search = $("#screen-pick-behaviour .search-wrap");
    const back = $('#screen-pick-behaviour [data-nav="unit-abilities"]');
    const preset = $('#screen-pick-behaviour [data-nav="use-preset"]');
    if (h) h.textContent = title;
    if (eye) eye.textContent = isBasic() ? "Abilities" : "Behaviour";
    if (hint) {
      if (sub) { hint.innerHTML = sub; hint.hidden = false; }
      else hint.hidden = true;
    }
    // Keep search visible on every picker view (including Basic home) so people
    // who know the name can type it, and so r68 captures can fill #behaviour-search.
    // Typing switches to the Advanced list via bindSearchOnce.
    if (search) {
      search.hidden = false;
      const inp = search.querySelector("input") || document.getElementById("behaviour-search");
      if (inp) inp.placeholder = (isBasic() && pickerView !== "advanced") ? "Or search by name" : "Search behaviours";
    }
    if (preset) preset.hidden = pickerView !== "advanced";
    if (back) {
      back.textContent = backTo === "home" ? "Goals" : "Back";
      back.onclick = (e) => {
        if (backTo === "home") { e.preventDefault(); e.stopPropagation(); pickerView = "home"; renderPickList(); }
      };
    }
  }
  function renderHome() {
    const u = selectedUnit();
    const sug = suggestionsFor(u).filter((x) => x.id !== "__role");
    const chips = sug.length ? `<p class="qol-kicker">Suggested for this unit</p><div class="qol-sug-row">${sug.map((c) => `<button type="button" class="qol-sug" data-qol-add="${esc(c.id)}"><span class="plus">+</span> ${esc(c.label)}</button>`).join("")}</div>` : "";
    const grid = GOALS.map((g) => `<button type="button" class="qol-goal" data-qol-goal="${g.id}" aria-label="${g.name}: ${g.sub}"><span class="g-ico">${g.ico}</span><b>${esc(g.name)}</b><small>${esc(g.sub)}</small></button>`).join("");
    setPickerChrome(word.pickTitle(), `For <strong>${esc(u ? u.name : "this unit")}</strong>. Pick a goal, or give the unit a role in one tap. No code.`, "abilities");
    return `${chips}
      <button type="button" class="qol-role-entry" data-qol-roles aria-label="Start from a role preset">Start from a role <span>Warrior, Archer, Mage…</span></button>
      <p class="qol-kicker">Browse by goal</p>
      <div class="qol-goal-grid">${grid}</div>
      <button type="button" class="qol-link-row" data-qol-advanced aria-label="Browse all in Advanced">Browse all (Advanced) <small>Searchable list</small></button>
      <p class="hint" style="margin-top:12px">Turns, mana and win rules live in Settings — not in this list.</p>`;
  }
  function renderGoal(goal) {
    const cards = goal.ids.map((id) => {
      const b = beh(id); if (!b) return "";
      const mark = MARKS[id] ? `<span class="qol-mark">${esc(MARKS[id])}</span>` : "";
      const desc = PLAIN[id] || b.summary || "";
      return `<button type="button" class="qol-acard" data-qol-add="${esc(id)}" aria-label="${esc(shortName(b))}. ${esc(desc)}">${mini(id)}<span class="name">${esc(shortName(b))}</span><span class="desc">${esc(desc)}</span>${mark}</button>`;
    }).join("");
    setPickerChrome(goal.name, `${esc(goal.name)} ${isBasic() ? "abilities" : "behaviours"} from the catalogue. Tap a card to add it with defaults.`, "home");
    return `<div class="qol-card-grid">${cards}</div>${goal.more ? `<p class="hint" style="margin-top:12px">${esc(goal.more)}</p>` : ""}`;
  }
  function renderRoles() {
    const u = selectedUnit();
    setPickerChrome("Start from a role", `One tap adds a sensible set to <strong>${esc(u ? u.name : "this unit")}</strong>, with defaults on. You can remove any item after.`, "home");
    return ROLES.map((r) => {
      const names = r.ids.map((id) => shortName(beh(id), { behaviourId: id })).join(", ");
      return `<button type="button" class="qol-role" data-qol-role="${r.id}" aria-label="Use ${r.name} preset: ${names}">
        <span class="qol-r-top"><b>${esc(r.name)}</b><span class="qol-use">Use</span></span>
        <span class="set">${esc(names)}</span>${r.note ? `<p class="qol-note">${esc(r.note)}</p>` : ""}</button>`;
    }).join("");
  }
  function renderAdvancedList() {
    const s = state();
    const rootBuild = window.__qolLegacyPick;
    setPickerChrome("Browse all behaviours", "Full catalogue, grouped. Day-one starters are tagged.", "home");
    if (typeof rootBuild === "function") return null; // fallback: let legacy fill
    return "";
  }
  function bindPicker(root) {
    root.querySelectorAll("[data-qol-goal]").forEach((b) => b.addEventListener("click", () => { pickerView = b.getAttribute("data-qol-goal"); renderPickList(); }));
    root.querySelectorAll("[data-qol-roles]").forEach((b) => b.addEventListener("click", () => { pickerView = "roles"; renderPickList(); }));
    root.querySelectorAll("[data-qol-advanced]").forEach((b) => b.addEventListener("click", () => { pickerView = "advanced"; const s = state(); if (s) s.qolAdvancedBrowse = true; renderPickList(); }));
    root.querySelectorAll("[data-qol-add]").forEach((b) => b.addEventListener("click", () => {
      const id = b.getAttribute("data-qol-add");
      if (pickerView === "home" || isBasic()) { addById(id); if (window.__showAbilities) __showAbilities(true); }
      else if (window.__openBehaviour) __openBehaviour(id, { forceForm: true });
    }));
    root.querySelectorAll("[data-qol-role]").forEach((b) => b.addEventListener("click", () => {
      applyRole(ROLES.find((r) => r.id === b.getAttribute("data-qol-role")));
    }));
  }
  function bindSearchOnce() {
    const inp = $("#behaviour-search");
    if (!inp || inp.dataset.qolBound) return;
    inp.dataset.qolBound = "1";
    inp.addEventListener("input", () => {
      const s = state();
      if (inp.value.trim()) { pickerView = "advanced"; if (s) s.qolAdvancedBrowse = true; }
      else { pickerView = "home"; if (s) s.qolAdvancedBrowse = false; }
      if (window.__show && document.getElementById("screen-pick-behaviour") && document.getElementById("screen-pick-behaviour").classList.contains("active"))
        __show("pick-behaviour");
    });
  }
  function renderPickList() {
    const root = $("#behaviour-pick-list");
    if (!root) return false;
    bindSearchOnce();
    const s = state();
    const uName = $("#pick-unit-name");
    const u = selectedUnit();
    if (uName) uName.textContent = u ? u.name : "No unit";
    const q = (($("#behaviour-search") || {}).value || "").trim();
    if (q) {
      pickerView = "advanced";
      if (s) s.qolAdvancedBrowse = true;
      setPickerChrome("Browse all behaviours", "Full catalogue, grouped.", isBasic() ? "home" : "abilities");
      const search = $("#screen-pick-behaviour .search-wrap"); if (search) search.hidden = false;
      return false; // app.js renders the searchable list (data-beh rows)
    }
    if (isBasic() && pickerView !== "advanced") {
      if (s) s.qolAdvancedBrowse = false;
      if (pickerView === "roles") root.innerHTML = renderRoles();
      else if (pickerView !== "home") {
        const g = GOALS.find((x) => x.id === pickerView);
        root.innerHTML = g ? renderGoal(g) : renderHome();
        if (!g) pickerView = "home";
      } else root.innerHTML = renderHome();
      bindPicker(root);
      return true;
    }
    // Advanced (or Basic → Browse all): polished grouped list is still rendered by app.js after we return false,
    // but we set chrome first.
    pickerView = "advanced";
    if (s) s.qolAdvancedBrowse = true;
    setPickerChrome("Browse all behaviours", "Full catalogue, grouped. Day-one starters are tagged. Card-only items hide when the project uses the unit menu.", isBasic() ? "home" : "abilities");
    return false;
  }

  /* ---------- unit sheet home ---------- */
  let unitTab = "abilities";
  function renderUnitSheet() {
    const box = $("#sheet-unit-abilities"), u = selectedUnit(); if (!box) return false;
    const title = $("#sheet-unit-title"); if (title) title.textContent = u ? u.name : "Unit";
    const tabs = $("#sheet-unit-tabs");
    if (tabs) {
      tabs.innerHTML = ["abilities", "stats", "art"].map((t) => {
        const label = t === "abilities" ? word.many() : t === "stats" ? "Stats" : "Art";
        return `<button type="button" class="toggle" data-ua-tab="${t}" ${t === "abilities" ? 'id="btn-unit-behaviour"' : ""} aria-pressed="${unitTab === t}">${label}</button>`;
      }).join("");
      tabs.querySelectorAll("[data-ua-tab]").forEach((b) => b.addEventListener("click", () => { unitTab = b.getAttribute("data-ua-tab"); renderUnitSheet(); }));
    }
    const stats = $("#sheet-unit-stats"), art = $("#sheet-unit-art");
    box.hidden = unitTab !== "abilities";
    if (stats) stats.hidden = unitTab !== "stats";
    if (art) art.hidden = unitTab !== "art";
    if (unitTab === "stats") { renderStatsTab(); return true; }
    if (unitTab === "art") { renderArtTab(); return true; }
    const list = setupsOf(u);
    const sug = suggestionsFor(u);
    const chips = sug.length ? `<div class="qol-sug-row">${sug.map((c) => c.id === "__role"
      ? `<button type="button" class="qol-sug" data-qol-open-roles><span class="plus">+</span> ${esc(c.label)}</button>`
      : `<button type="button" class="qol-sug" data-qol-add="${esc(c.id)}"><span class="plus">+</span> ${esc(c.label)}</button>`).join("")}</div>` : "";
    box.innerHTML = `<p class="eyebrow ua-head">${esc(word.many())}${list.length ? ` · ${list.length}` : ""}</p>` + chips +
      (list.length
        ? `<ul class="ua-list">${list.map((st) => {
            const b = beh(st.doc && st.doc.behaviourId); const nm = shortName(b, st.doc);
            const line = PLAIN[st.doc && st.doc.behaviourId] || (b && b.summary) || (isBasic() ? "Ability" : "Behaviour");
            return `<li class="ua-row"><span class="ua-ico" aria-hidden="true">✦</span><button type="button" class="ua-txt" data-ua-open="${esc(st.id)}" aria-label="Edit ${esc(nm)}"><b>${esc(nm)}</b><small>${esc(line)}</small></button><button type="button" class="ua-tst" data-ua-test="${esc(st.id)}" aria-label="Test ${esc(nm)}">Test</button><button type="button" class="ua-x" data-ua-remove="${esc(st.id)}" aria-label="Remove ${esc(nm)}">×</button></li>`;
          }).join("")}</ul>`
        : `<p class="hint ua-empty">${isBasic() ? "No abilities yet." : "No behaviours yet."}</p>`) +
      `<button type="button" class="btn btn-primary ua-add" data-qol-pick aria-label="${esc(word.add())} to ${esc(u ? u.name : "this unit")}">${esc(word.add())}</button>` +
      `<button type="button" class="btn btn-ghost ua-test" id="btn-unit-test" aria-label="Test this stage with ${esc(u ? u.name : "this unit")}">▶ Test</button>`;
    box.querySelector("[data-qol-pick]")?.addEventListener("click", () => { pickerView = "home"; const s = state(); if (s) s.qolAdvancedBrowse = false; show("pick-behaviour"); });
    box.querySelectorAll("[data-qol-add]").forEach((b) => b.addEventListener("click", () => { addById(b.getAttribute("data-qol-add")); renderUnitSheet(); if (window.renderGrid) renderGrid(); }));
    box.querySelector("[data-qol-open-roles]")?.addEventListener("click", () => { pickerView = "roles"; show("pick-behaviour"); });
    box.querySelectorAll("[data-ua-open]").forEach((btn) => btn.addEventListener("click", () => {
      const s = state(); s.activeSetupId = btn.dataset.uaOpen;
      if (isBasic() && window.__openBehaviour) {
        // Basic: open a clean single-ability edit (summary). Advanced also uses summary.
      }
      const entry = (u.setups || []).find((x) => x.id === btn.dataset.uaOpen);
      if (entry && window.SetupStore) {
        const loaded = SetupStore.loadSetup(entry.doc, s.catalogueDoc);
        entry.doc = loaded.doc; entry.notices = loaded.notices; s.lastNotices = loaded.notices;
      }
      show("behaviour-summary");
    }));
    box.querySelectorAll("[data-ua-remove]").forEach((btn) => btn.addEventListener("click", () => {
      const id = btn.dataset.uaRemove, i = u.setups.findIndex((x) => x.id === id); if (i < 0) return;
      const [gone] = u.setups.splice(i, 1); const nm = shortName(beh(gone.doc && gone.doc.behaviourId), gone.doc);
      if (window.__pushPaintStroke) __pushPaintStroke([{ kind: "live", undo: () => { u.setups.splice(i, 0, gone); renderUnitSheet(); } }]);
      if (window.__persistProject) __persistProject();
      if (window.renderGrid) renderGrid();
      renderUnitSheet(); toast(`${nm} removed from ${u.name}`);
    }));
    box.querySelectorAll("[data-ua-test]").forEach((btn) => btn.addEventListener("click", () => {
      if (window.StageLive && StageLive.startTest) StageLive.startTest(u && u.id);
    }));
    const tb = box.querySelector("#btn-unit-test");
    if (tb) tb.addEventListener("click", () => { if (window.StageLive && StageLive.startTest) StageLive.startTest(u && u.id); });
    return true;
  }
  function renderStatsTab() {
    const el = $("#sheet-unit-stats"), u = selectedUnit(), s = state(); if (!el || !u || !s) return;
    let hp = u.hp, atk = u.atk;
    if (window.ProjectStore && s.project) {
      const hpR = ProjectStore.resolveUnitStat(s.project, s.catalogueDoc, "shell-" + u.id, "unit_hp", s.currentStageId);
      const atkR = ProjectStore.resolveUnitStat(s.project, s.catalogueDoc, "shell-" + u.id, "unit_atk", s.currentStageId);
      if (hpR) hp = hpR.value; if (atkR) atk = atkR.value;
    }
    const adv = !isBasic();
    el.innerHTML = `<p class="eyebrow">Health and attack</p>
      <div class="field"><label>Health <span class="val" id="sheet-hp-val">${hp}</span></label>
        <input id="sheet-hp" class="slider" type="range" min="1" max="20" value="${hp}" aria-label="Health" />
        <p class="hint">${adv ? "Uses the team colour if no custom colour is set." : "How many hits this unit can take."}</p></div>
      <div class="field"><label>Attack <span class="val" id="sheet-atk-val">${atk}</span></label>
        <input id="sheet-atk" class="slider" type="range" min="0" max="10" value="${atk}" aria-label="Attack" />
        <p class="hint">${adv ? "Clip cues (flash when hit) stay under Advanced in the unit editor." : "How hard this unit hits."}</p></div>`;
    const bind = (key, elId, valId, statId) => {
      const inp = el.querySelector("#" + elId), lab = el.querySelector("#" + valId);
      if (!inp) return;
      inp.addEventListener("input", () => {
        const v = Number(inp.value); if (lab) lab.textContent = String(v); u[key] = v;
        if (window.ProjectStore && s.project) ProjectStore.setUnitStat(s.project, s.catalogueDoc, "shell-" + u.id, statId, v);
        if (window.__persistProject) __persistProject();
        if (window.renderGrid) renderGrid();
      });
    };
    bind("hp", "sheet-hp", "sheet-hp-val", "unit_hp");
    bind("atk", "sheet-atk", "sheet-atk-val", "unit_atk");
  }
  function renderArtTab() {
    const el = $("#sheet-unit-art"), u = selectedUnit(); if (!el) return;
    el.innerHTML = `<p class="hint">Art for <strong>${esc(u ? u.name : "this unit")}</strong>.</p>
      <div class="sheet-row wrap">
        <button type="button" class="tool" data-nav="sprite-upload" id="qol-art-upload">Sprite</button>
        <button type="button" class="tool" data-nav="sprite-studio" id="qol-art-studio">Sprite Studio</button>
        <button type="button" class="tool" id="qol-art-sounds">Sounds</button>
      </div>`;
    el.querySelector("#qol-art-upload")?.addEventListener("click", () => show("sprite-upload"));
    el.querySelector("#qol-art-studio")?.addEventListener("click", () => show("sprite-studio"));
    el.querySelector("#qol-art-sounds")?.addEventListener("click", () => { if (window.__setStageSheet) __setStageSheet("sound"); });
  }

  /* ---------- Stages (decided) ---------- */
  const TYPE_META = {
    safe: { name: "Safe", kicker: "Basic", desc: "A town, village or campfire. No threats by default. Enemy units and enemy-style behaviours stay hidden.", ex: "Examples: village square, forest campfire, quiet harbour." },
    battle: { name: "Battle", kicker: "Basic", desc: "Almost everything is allowed. NPCs can still stand at a spawn. Hazards and themed lair sets sit up front.", ex: "Examples: goblin lair, slime den, escort a caravan." },
    freestyle: { name: "Freestyle", kicker: "Advanced", desc: "Every asset, full freedom. For makers who want a town with a hidden fight, or a mixed route.", ex: "The whole catalogue stays in reach.", adv: true },
  };
  const RUN_LAYERS = [
    { id: "open-world", name: "Open-world wandering", desc: "A connected map, Pokémon style. Safe stages work as hubs and towns; Battle stages are encounters on the route." },
    { id: "horde", name: "Stage-by-stage horde", desc: "Clear a floor, then the next. Best with Battle floors and a Safe camp between waves." },
    { id: "fight-shop", name: "Fight, then loot or shop", desc: "After a clear, a camp or shop stage. The Tower of Ascension pattern." },
    { id: "rogue", name: "Rogue run — death restarts", desc: "A run of Battle floors. Dying wipes the run and starts again." },
  ];
  const ENEMY_IDS = ["slime", "bat", "skeleton", "wolf", "goblin", "acolyte", "tall-boss", "big-boss"];
  const ENEMY_HIDDEN_COUNT = 12; // 10 starter enemies + 2 bosses (variants sit in the 10)
  function currentStage() {
    const s = state(); if (!s || !s.project || !window.ProjectStore) return null;
    return ProjectStore.getStage(s.project, s.currentStageId) || null;
  }
  function stageTypeOf(st) { return (st && st.type) || "freestyle"; }
  function stagePalette() {
    const st = currentStage(); if (!st) return { type: "freestyle", showThreats: true, showEnemies: true, showLava: true, showLairs: true };
    const type = stageTypeOf(st);
    const threat = type === "safe" && !!st.threatEvent;
    const showThreats = type !== "safe" || threat;
    return {
      type, threat, showThreats,
      showEnemies: showThreats,
      showLava: showThreats,
      showLairs: type === "battle" || type === "freestyle",
      allowHostileNpc: showThreats,
      lairSet: st.lairSet || null,
      hideNote: !showThreats ? `${ENEMY_HIDDEN_COUNT} enemy items hidden · Lava and threat behaviours hidden` : (st.threatEvent ? `${ENEMY_HIDDEN_COUNT} enemy items unlocked for this stage` : null),
    };
  }
  function setStageField(patch) {
    const s = state(), st = currentStage(); if (!s || !st || !window.ProjectStore) return;
    Object.assign(st, patch); ProjectStore.saveStage(s.project, st);
    if (window.__persistProject) __persistProject();
    renderTypeBar(); if (window.renderGrid) renderGrid();
  }
  function renderTypeBar() {
    const bar = $("#stage-type-bar"); if (!bar) return;
    const onStage = !!document.querySelector("#screen-stage.active");
    if (!onStage) { bar.hidden = true; return; }
    const pal = stagePalette(); const meta = TYPE_META[pal.type] || TYPE_META.freestyle;
    bar.hidden = false;
    let extra = "";
    if (pal.type === "safe") {
      extra = `<button type="button" class="tb-toggle${pal.threat ? " on" : ""}" id="btn-threat-toggle" aria-pressed="${pal.threat}"><span class="sw" aria-hidden="true"></span> Add threat or event · ${pal.threat ? "On" : "Off"}</button>`;
    } else if (pal.showLairs) {
      extra = `<button type="button" class="tb-toggle" id="btn-themed-sets" style="margin-left:auto">Themed sets</button>`;
    }
    bar.innerHTML = `<button type="button" class="tb-type" id="btn-change-stage-type" aria-label="Change stage type">${esc(meta.name)}</button>${extra}`;
    $("#btn-change-stage-type")?.addEventListener("click", () => openChangeType());
    $("#btn-threat-toggle")?.addEventListener("click", () => {
      const st = currentStage(); setStageField({ threatEvent: !st.threatEvent });
      toast(st && st.threatEvent ? "Threat unlocked for this stage. The type is still Safe." : "Threats hidden again on this Safe stage.");
    });
    $("#btn-themed-sets")?.addEventListener("click", () => { renderLairScreen(); show("stage-lairs"); });
    const chip = $("#stage-hide-chip");
    if (chip) {
      if (pal.hideNote) { chip.hidden = false; chip.textContent = pal.hideNote; chip.classList.toggle("unlocked", !!pal.threat); }
      else chip.hidden = true;
    }
  }
  function renderTypePicker() {
    const root = $("#stage-type-list"); if (!root) return;
    root.innerHTML = Object.keys(TYPE_META).map((id) => {
      const m = TYPE_META[id];
      return `<button type="button" class="qol-type-card${m.adv ? " adv" : ""}" data-stage-type="${id}">
        <span class="tc-kicker">${esc(m.kicker)}</span><b>${esc(m.name)}</b>
        <span class="tc-desc">${esc(m.desc)}</span><span class="tc-ex">${esc(m.ex)}</span></button>`;
    }).join("") + `<p class="hint">Ruins, wreckage and a bandit lair are planned — they are not in the Starter Pack yet. How stages chain is a separate setting.</p>`;
    root.querySelectorAll("[data-stage-type]").forEach((b) => b.addEventListener("click", () => createStageOfType(b.getAttribute("data-stage-type"))));
  }
  function createStageOfType(type) {
    const s = state(); if (!s || !s.project || !window.ProjectStore) return;
    const map = ProjectStore.addStage(s.project, s.catalogueDoc);
    map.type = type; map.threatEvent = false; map.lairSet = null;
    ProjectStore.saveStage(s.project, map);
    s.currentStageId = map.id;
    if (window.__persistProject) __persistProject();
    toast(`${TYPE_META[type].name} stage added`);
    show("stage");
  }
  function itemsThatWouldHide(fromType, toType, toThreat) {
    const s = state(); if (!s) return [];
    const hidden = [];
    const wouldHideThreats = toType === "safe" && !toThreat;
    if (!wouldHideThreats) return hidden;
    (s.units || []).forEach((u) => {
      if (u.kind === "enemy") hidden.push(u.name || "Enemy");
      if (u.kind === "npc" && u.npcHostile) hidden.push((u.name || "NPC") + " (hostile)");
      (u.setups || []).forEach((st) => { if (THREAT_BEHS.indexOf(st.doc && st.doc.behaviourId) >= 0) hidden.push(shortName(beh(st.doc.behaviourId), st.doc)); });
    });
    // lava tiles: counted via map if present
    try {
      const st = currentStage(); const map = st && ProjectStore.getMap(s.project, st.mapRef);
      if (map && map.logic && map.logic.terrain) {
        const pal = map.logic.palette || {};
        let n = 0;
        map.logic.terrain.forEach((v) => { const t = pal[String(v)] || v; if (t === "lava") n++; });
        if (n) hidden.push(n === 1 ? "a lava tile" : n + " lava tiles");
      }
    } catch (_) {}
    return hidden;
  }
  function openChangeType() {
    const st = currentStage(); if (!st) return show("stage-type");
    const root = $("#stage-change-body"); const pal = stagePalette();
    const choices = Object.keys(TYPE_META).map((id) => `<button type="button" class="qol-type-card${id === pal.type ? "" : ""}" data-to-type="${id}" ${id === pal.type ? "disabled" : ""}><span class="tc-kicker">${id === pal.type ? "Current" : TYPE_META[id].kicker}</span><b>${esc(TYPE_META[id].name)}</b><span class="tc-desc">${esc(TYPE_META[id].desc)}</span></button>`).join("");
    if (root) root.innerHTML = `<p class="hint">This stage is <strong>${esc(TYPE_META[pal.type].name)}</strong>. Switching type hides items that would leave the palette. Nothing is deleted.</p>${choices}<div id="stage-change-warn"></div>`;
    $$("[data-to-type]").forEach((b) => b.addEventListener("click", () => confirmChangeType(b.getAttribute("data-to-type"))));
    show("stage-change-type");
  }
  function confirmChangeType(toType) {
    const st = currentStage(); if (!st) return;
    const hidden = itemsThatWouldHide(stageTypeOf(st), toType, false);
    const warn = $("#stage-change-warn");
    if (hidden.length && warn) {
      warn.innerHTML = `<div class="qol-warn"><b>${hidden.length} placed item${hidden.length === 1 ? "" : "s"} will be hidden</b>
        <p>${esc(hidden.slice(0, 6).join(", "))}${hidden.length > 6 ? "…" : ""} would leave the visible palette.</p>
        <ul><li>Stay on ${esc(TYPE_META[stageTypeOf(st)].name)} to keep them visible.</li>
        <li>Or add a threat or event on a Safe stage to unlock enemies and hazards for this stage only.</li></ul>
        <div class="qol-warn-actions">
          <button type="button" class="btn btn-ghost" id="btn-keep-type">Keep ${esc(TYPE_META[stageTypeOf(st)].name)}</button>
          <button type="button" class="btn btn-primary" id="btn-do-switch">Switch to ${esc(TYPE_META[toType].name)}</button>
        </div></div>`;
      $("#btn-keep-type")?.addEventListener("click", () => show("stage"));
      $("#btn-do-switch")?.addEventListener("click", () => doChangeType(toType));
      return;
    }
    doChangeType(toType);
  }
  function doChangeType(toType) {
    const patch = { type: toType };
    if (toType !== "safe") patch.threatEvent = false;
    if (toType !== "battle" && toType !== "freestyle") patch.lairSet = null;
    setStageField(patch); toast("Stage type is now " + TYPE_META[toType].name); show("stage");
  }
  function renderLairScreen() {
    const root = $("#stage-lair-list"); if (!root) return;
    const sets = [
      { id: "goblin", name: "Goblin lair", desc: "Places Goblins, rocks, torches and crates, then keeps the palette on that set." },
      { id: "slime", name: "Slime den", desc: "Places Slimes and rocks, with water nearby. A blob-enemy layout from the Starter Pack." },
      { id: "bandit", name: "Bandit lair", desc: "Stand-in: Acolyte guards, barrels, crates and torches.", note: "There are no bandits in the Starter Pack yet. Ruined houses and wreckage are also planned, not in the pack." },
    ];
    root.innerHTML = `<p class="hint">A themed set stamps a starting layout and filters the palette. You can still place anything Battle allows after.</p>` +
      sets.map((r) => `<button type="button" class="qol-lair" data-lair="${r.id}"><span class="qol-r-top"><b>${esc(r.name)}</b><span class="qol-use">Use</span></span><span class="set">${esc(r.desc)}</span>${r.note ? `<p class="qol-note">${esc(r.note)}</p>` : ""}</button>`).join("");
    root.querySelectorAll("[data-lair]").forEach((b) => b.addEventListener("click", () => stampLair(b.getAttribute("data-lair"))));
  }
  function stampLair(id) {
    const s = state(); if (!s || !window.StageLive || !StageLive.stampLair) { setStageField({ lairSet: id }); toast("Lair filter on. Stamp needs the stage tools."); show("stage"); return; }
    const n = StageLive.stampLair(id);
    setStageField({ lairSet: id });
    toast((n ? n + " tiles placed · " : "") + "Palette filtered to this set");
    show("stage");
  }
  function renderRunLayer() {
    const root = $("#run-layer-list"); if (!root || !state() || !state().project || !window.ProjectStore) return;
    const m = ProjectStore.manifest(state().project);
    m.project.settings = m.project.settings || {};
    const cur = m.project.settings.runLayer || "open-world";
    root.innerHTML = `<p class="hint">This is a project setting, not a per-stage type. Type is what a stage contains; this is how stages chain.</p>` +
      RUN_LAYERS.map((r) => `<button type="button" class="qol-chain${r.id === cur ? " on" : ""}" data-run-layer="${r.id}"><b>${esc(r.name)}</b><small>${esc(r.desc)}</small></button>`).join("") +
      `<p class="hint">Odd mixes get a warning: an all-Safe horde, or an open world with only Battle stages.</p>`;
    root.querySelectorAll("[data-run-layer]").forEach((b) => b.addEventListener("click", () => {
      m.project.settings.runLayer = b.getAttribute("data-run-layer");
      if (window.__persistProject) __persistProject();
      renderRunLayer();
      toast("How stages chain updated");
    }));
  }

  /* ---------- Play starts on the stage (Basic) ---------- */
  function startStagePlay() {
    const s = state(); if (!s) return false;
    const st = currentStage();
    const name = (st && st.name) || "this stage";
    if (window.__setStageSheet) __setStageSheet(null);
    if (window.__setStagePlay) __setStagePlay(true);
    const chip = $("#stage-playing-chip");
    if (chip) {
      chip.hidden = false;
      chip.innerHTML = `<span>Playing ${esc(name)}</span><button type="button" class="btn btn-ghost" id="btn-exit-stage-play" style="min-height:48px">Exit</button>`;
      $("#btn-exit-stage-play")?.addEventListener("click", exitStagePlay);
    }
    const hide = $("#stage-hide-chip"); if (hide) hide.hidden = true;
    const status = $("#stage-status-chip"); if (status) status.hidden = true;
    toast("Playing " + name + " with the units already on this stage. Runtime coming soon.");
    return true;
  }
  function exitStagePlay() {
    if (window.__setStagePlay) __setStagePlay(false);
    if (window.StageLive && StageLive.exitTest && StageLive.testing && StageLive.testing()) StageLive.exitTest();
    const chip = $("#stage-playing-chip"); if (chip) chip.hidden = true;
    renderTypeBar();
    toast("Back to editing");
  }
  function onPlayClicked() {
    if (!isBasic("stage")) return false; // Advanced still goes to Loadout
    return startStagePlay();
  }

  /* ---------- Keep → project asset ---------- */
  function keepAsProjectAsset(payload) {
    const s = state(); if (!s || !s.project || !window.ProjectStore) return null;
    const m = ProjectStore.manifest(s.project);
    m.project.assets = m.project.assets || {};
    const id = "asset_kept_" + Date.now().toString(36);
    const name = (payload && payload.name) || "Kept sprite";
    const w = (payload && payload.w) || 32, h = (payload && payload.h) || 32;
    m.project.assets[id] = { name, kind: "sprite", ext: "png", w, h, tiles: { w: 1, h: 1 }, source: "keep", role: "kept", placeable: true };
    if (payload && payload.dataUrl) s.project.files["assets/" + id + ".png"] = { dataUrl: payload.dataUrl, kept: true };
    else s.project.files["assets/" + id + ".png"] = { placeholder: true, kept: true };
    if (window.__persistProject) __persistProject();
    s.qolLastKept = id;
    return id;
  }
  function offerPlaceKept(id) {
    const chip = $("#stage-status-chip"), text = $("#stage-status-text"), act = $("#btn-stage-status-action");
    // Don't steal the hard-error chip; use a follow-on toast and a Remember id for Add here.
    toast("Kept as a project asset. Open the stage and use Add here → Art to place it.");
    const s = state(); if (s) s.qolPlaceAsset = id;
  }

  /* ---------- Appearance in View; Effect Designer door ---------- */
  function enhanceViewMenu() {
    const m = $("#live-view-menu"); if (!m || m.querySelector("[data-qol-appear]")) return;
    const cur = (window.ProfileStore && (ProfileStore.load().prefs || {}).theme) || "system";
    const row = document.createElement("div");
    row.innerHTML = `<p class="lv-lbl">Appearance</p><div class="lv-seg" role="group" aria-label="Appearance">
      <button type="button" class="toggle" data-qol-appear="light" aria-pressed="${cur === "light"}">Light</button>
      <button type="button" class="toggle" data-qol-appear="dark" aria-pressed="${cur === "dark"}">Dark</button>
      <button type="button" class="toggle" data-qol-appear="system" aria-pressed="${cur === "system" || cur === "follow"}">Follow device</button>
    </div>`;
    m.appendChild(row);
    row.querySelectorAll("[data-qol-appear]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const v = b.getAttribute("data-qol-appear");
      if (window.ProfileStore && ProfileStore.setTheme) ProfileStore.setTheme(v);
      enhanceViewMenu.refresh = true;
      // rebuild pressed
      row.querySelectorAll("[data-qol-appear]").forEach((x) => x.setAttribute("aria-pressed", String(x.getAttribute("data-qol-appear") === v)));
    }));
  }
  function openEffects() {
    // Prefer the existing mock-effects designer; same-origin so it stays in the prototype.
    show("effects-designer");
  }


  /* ---------- P2 item 12: Studio profile overhaul ---------- */
  function bust(a, b, feat, extra) {
    return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
      <rect width="32" height="32" fill="#3a2a3a00"/>
      <rect x="6" y="26" width="20" height="6" fill="${b}"/>
      <rect x="6" y="26" width="8" height="6" fill="${a}"/>
      <rect x="8" y="8" width="16" height="18" fill="${a}"/>
      <rect x="16" y="8" width="8" height="18" fill="${b}"/>
      <rect x="10" y="14" width="3" height="3" fill="#2a1c18"/>
      <rect x="19" y="14" width="3" height="3" fill="#2a1c18"/>
      ${feat || ""}${extra || ""}</svg>`;
  }
  /* Placeholder portrait art for existing ProfileStore.AVATARS ids.
     Real Imagine busts arrive later (starter-pack-v2, outside the 100). */
  const AVATAR_ART = {
    avatar_knight: bust("#8a93a4", "#c0c6d4", '<rect x="8" y="4" width="16" height="6" fill="#8a93a4"/><rect x="10" y="3" width="12" height="3" fill="#c0c6d4"/>', '<rect x="8" y="22" width="16" height="6" fill="#2d4a9a"/>'),
    avatar_mage: bust("#e8c4a8", "#f0d4bc", '<rect x="8" y="4" width="16" height="8" fill="#2a1c18"/><rect x="13" y="2" width="6" height="4" fill="#2a1c18"/>', '<rect x="8" y="22" width="16" height="6" fill="#8a2e6a"/>'),
    avatar_rogue: bust("#c88858", "#d8a070", '<rect x="7" y="6" width="18" height="8" fill="#2a1c18"/><rect x="8" y="4" width="16" height="4" fill="#3a2820"/>', '<rect x="8" y="22" width="16" height="6" fill="#3a2a3a"/>'),
    avatar_archer: bust("#e0b090", "#edc4a4", '<rect x="9" y="5" width="14" height="5" fill="#3b2140"/>', '<rect x="8" y="22" width="16" height="6" fill="#3d8a4a"/>'),
    avatar_slime: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="6" y="14" width="20" height="14" fill="#3a8a3a"/><rect x="8" y="10" width="16" height="8" fill="#5cba5c"/>
      <rect x="6" y="14" width="8" height="14" fill="#5cba5c"/><rect x="11" y="16" width="3" height="3" fill="#1e1024"/>
      <rect x="18" y="16" width="3" height="3" fill="#1e1024"/><rect x="9" y="12" width="3" height="2" fill="#b8e8b0"/></svg>`,
    avatar_dragon: bust("#3d8a4a", "#5aaa5a", '<rect x="6" y="4" width="5" height="8" fill="#3d8a4a"/><rect x="21" y="4" width="5" height="8" fill="#3d8a4a"/>', '<rect x="13" y="18" width="6" height="3" fill="#b8402e"/>'),
    avatar_wolf: bust("#8a7a6a", "#c0a090", '<rect x="6" y="4" width="6" height="8" fill="#6a5a4a"/><rect x="20" y="4" width="6" height="8" fill="#6a5a4a"/>', ""),
    avatar_cat: bust("#d0a040", "#f6e08a", '<rect x="7" y="4" width="5" height="8" fill="#d0a040"/><rect x="20" y="4" width="5" height="8" fill="#d0a040"/>', '<rect x="14" y="18" width="4" height="2" fill="#3b2140"/>'),
    avatar_owl: bust("#c0a878", "#e8d4a8", '<rect x="8" y="8" width="6" height="6" fill="#f6f6fa"/><rect x="18" y="8" width="6" height="6" fill="#f6f6fa"/><rect x="10" y="10" width="3" height="3" fill="#2a1c18"/><rect x="19" y="10" width="3" height="3" fill="#2a1c18"/>', '<rect x="6" y="4" width="20" height="5" fill="#6e4a35"/>'),
    avatar_robot: bust("#8a8fa0", "#b8bcc8", '<rect x="10" y="4" width="12" height="5" fill="#6a6a74"/><rect x="8" y="6" width="3" height="3" fill="#78aee0"/><rect x="21" y="6" width="3" height="3" fill="#78aee0"/>', ""),
    avatar_ghost: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="8" y="6" width="16" height="20" fill="#d8dde8"/><rect x="8" y="6" width="7" height="20" fill="#f4f5f7"/>
      <rect x="8" y="24" width="4" height="4" fill="#d8dde8"/><rect x="16" y="24" width="4" height="4" fill="#f4f5f7"/>
      <rect x="20" y="24" width="4" height="4" fill="#d8dde8"/>
      <rect x="11" y="13" width="3" height="3" fill="#2a1c18"/><rect x="18" y="13" width="3" height="3" fill="#2a1c18"/></svg>`,
    avatar_fox: bust("#a8402e", "#e8784a", '<rect x="6" y="4" width="6" height="8" fill="#a8402e"/><rect x="20" y="4" width="6" height="8" fill="#a8402e"/><rect x="8" y="6" width="3" height="4" fill="#f6e08a"/><rect x="21" y="6" width="3" height="4" fill="#f6e08a"/>', ""),
  };

  /* r8 §1.12.9 ACCEPTED: these thresholds are final. */
  const REWARD_CONFIG = {
    salesBadges: [10, 50, 250],
    salesBorder: 100,
    publishedBadges: [1, 5, 20],
    publishedBorder: 10,
    achievementsBorder: 10,
    achievementsBadge: 20,
  };
  const THRESHOLD_NOTE = "Sales badges at 10, 50 and 250, plus a border at 100 (paid sales only). Published games at 1, 5 and 20, plus a border at 10. A border at 10 achievements and a badge for all 20. One badge and one border at a time. Sale counts show only on your own profile.";

  /**
   * Read-only adapter for profile.rewards.metrics (r7 §1.12.2 / §1.12.5).
   * assetSales and gamesPublished (from gamePublished entries) live here.
   * The client never writes this object. Missing keys read as 0 (stub).
   */
  function readRewardCounters(profile) {
    const m = (profile && profile.rewards && profile.rewards.metrics) || {};
    return {
      assetSales: Number(m.assetSales) || 0,
      gamesPublished: Number(m.gamesPublished) || 0,
      achievementsUnlocked: Number(m.achievementsUnlocked) || 0,
      stub: !(profile && profile.rewards && (profile.rewards.metricsAt || (profile.rewards.metrics && Object.keys(profile.rewards.metrics).length))),
    };
  }

  function pendingNote() { return THRESHOLD_NOTE; }

  /* R7-Q9: sale counts are only visible on the owner's own profile (and a CEO admin view). Visitors see the badge only. The Studio profile is the owner's unless a visitor flag is set. */
  function viewingOwnProfile() {
    const s = state();
    if (s && s.qolForeignProfile) return false;
    return true;
  }
  function canSeeSaleCounts() { return viewingOwnProfile(); }

  function metricKind(metric) {
    if (metric === "assetSales") return { kind: "Sold", how: "Earn this by selling your own assets in the shop." };
    if (metric === "gamesPublished") return { kind: "Published", how: "Earn this by publishing games." };
    if (metric === "achievementsUnlocked") return { kind: "Unlocked", how: "Earn this by unlocking achievements." };
    return { kind: "Progress", how: "Keep going to unlock this reward." };
  }

  function cosmeticState(item, profile, counts) {
    counts = counts || readRewardCounters(profile);
    const unlocked = ProfileStore.isCosmeticUnlocked(profile, item);
    const by = item.unlockedBy || {};
    if (by === "always") return { locked: false, current: 1, target: 1, label: "", kind: "", how: "" };
    if (by.coinReason) {
      const n = ProfileStore.coinReasonCount(profile, by.coinReason);
      return { locked: !unlocked, current: n, target: 1, label: n > 1 ? "×" + n : (unlocked ? "" : "Not awarded yet"), kind: "Chart", how: "Awarded when your game or asset is featured as of the month.", times: n };
    }
    const achId = by.achievement;
    const def = ProfileStore.defByIdAny(achId);
    if (def && def.trigger && def.trigger.metric) {
      const meta = metricKind(def.trigger.metric);
      const hideCounts = def.trigger.metric === "assetSales" && !canSeeSaleCounts();
      const cur = hideCounts ? 0 : (counts[def.trigger.metric] || 0);
      const tgt = def.trigger.count || 1;
      const label = unlocked || hideCounts ? "" : `${meta.kind} ${cur}/${tgt}`;
      return { locked: !unlocked, current: cur, target: tgt, label, kind: meta.kind, how: meta.how, hideCounts };
    }
    if (def) {
      const rows = ProfileStore.listForUi(profile);
      const row = rows.find((r) => r.id === achId);
      const cur = row ? row.progress.current : 0;
      const tgt = row ? row.progress.target : ((def.trigger && def.trigger.count) || 1);
      return { locked: !unlocked, current: unlocked ? tgt : cur, target: tgt, label: unlocked ? "" : `${cur}/${tgt}`, kind: "Achievement", how: def.description || "" };
    }
    return { locked: !unlocked, current: 0, target: 1, label: "", kind: "Progress", how: "" };
  }

  function unlockedAchievementIds(profile) {
    const ids = [];
    ProfileStore.listForUi(profile).forEach((r) => { if (r.unlocked) ids.push(r.id); });
    (ProfileStore.METRIC_ACHIEVEMENTS || []).forEach((d) => {
      if (ProfileStore.metricUnlockStatus(profile, d.id) && ids.indexOf(d.id) < 0) ids.push(d.id);
    });
    return ids;
  }

  function achievementListSeen(id) {
    return (ProfileStore.achievementsSeen() || []).indexOf(id) >= 0;
  }
  function newAchievementCount(profile) {
    return unlockedAchievementIds(profile).filter((id) => !achievementListSeen(id)).length;
  }
  function markAchievementsViewed(profile) {
    ProfileStore.markAchievementsSeen(unlockedAchievementIds(profile));
  }

  function paintAvatarEl(el, p) {
    if (!el) return;
    const id = p.prefs && p.prefs.avatarId;
    const shown = ProfileStore.shownCosmetic(p, "border");
    el.classList.toggle("is-on", !!id);
    el.classList.remove("has-border-gold", "has-border-shop", "has-border-staple", "has-border-seller", "has-border-published", "has-border-achievements");
    const border = shown.shown;
    if (border === "border_seller_100") el.classList.add("has-border-seller");
    if (border === "border_published_10") el.classList.add("has-border-published");
    if (border === "border_achievements_10") el.classList.add("has-border-achievements");
    const meta = id && ProfileStore.AVATARS.find((a) => a.id === id);
    if (id && AVATAR_ART[id]) el.innerHTML = AVATAR_ART[id];
    else {
      const n = (p.prefs && p.prefs.name) || "Maker";
      el.textContent = n.slice(0, 1).toUpperCase();
    }
    if (el.tagName === "BUTTON") {
      el.setAttribute("aria-label", "Change avatar" + (meta ? ", currently " + meta.label : ", initials"));
    }
  }

  function enhanceProfile() {
    if (!window.ProfileStore) return;
    const p = ProfileStore.load();
    achievementsVisitUnseen = null;
    paintAvatarEl($("#profile-avatar"), p);
    const rows = allAchievementRows(p);
    const unlocked = rows.filter((r) => r.unlocked).length;
    const fresh = newAchievementCount(p);
    const badge = $("#ach-new-badge");
    const sub = $("#ach-entry-sub");
    const btn = $("#btn-profile-achievements");
    if (sub) sub.textContent = fresh ? `${fresh} new · ${unlocked} of ${rows.length}` : `${unlocked} of ${rows.length}`;
    if (badge) {
      if (fresh) { badge.hidden = false; badge.textContent = String(fresh); badge.setAttribute("aria-hidden", "true"); }
      else badge.hidden = true;
    }
    if (btn) btn.setAttribute("aria-label", fresh ? `Achievements, ${fresh} new` : "Achievements");
    bindProfileOnce();
  }

  let profileBound = false;
  let achievementsVisitUnseen = null;
  let avatarTab = "pictures";
  function bindProfileOnce() {
    if (profileBound) return;
    profileBound = true;
    $("#profile-avatar")?.addEventListener("click", () => { avatarTab = "pictures"; closeRewardSheet(); show("profile-avatar"); });
    $("#btn-profile-achievements")?.addEventListener("click", () => show("profile-achievements"));
    $("#btn-reward-sheet-close")?.addEventListener("click", () => closeRewardSheet());
  }

  function closeRewardSheet() {
    const sh = $("#profile-reward-sheet");
    if (sh) sh.hidden = true;
  }

  function allAchievementRows(profile) {
    const rows = ProfileStore.listForUi(profile).slice();
    const counts = readRewardCounters(profile);
    (ProfileStore.METRIC_ACHIEVEMENTS || []).forEach((def) => {
      const unlocked = ProfileStore.metricUnlockStatus(profile, def.id);
      const cur = counts[def.trigger.metric] || 0;
      const tgt = def.trigger.count || 1;
      const hideCounts = def.trigger.metric === "assetSales" && !canSeeSaleCounts();
      rows.push({
        id: def.id,
        status: "active",
        category: def.category,
        categoryLabel: ProfileStore.categoryLabel(def.category),
        hidden: !!def.hidden,
        unlocked,
        title: def.hidden && !unlocked ? "???" : def.title,
        description: def.hidden && !unlocked ? "Hidden, keep playing" : def.description,
        progress: { current: unlocked ? tgt : (hideCounts ? 0 : cur), target: tgt, hideCounts },
        unlockedAt: unlocked ? true : null,
      });
    });
    return rows;
  }

  function renderAvatarPanel() {
    const root = $("#profile-avatar-body"); if (!root || !window.ProfileStore) return;
    bindProfileOnce();
    const p = ProfileStore.load();
    const counts = readRewardCounters(p);
    const badgeShown = ProfileStore.shownCosmetic(p, "badge").shown;
    const borderShown = ProfileStore.shownCosmetic(p, "border").shown;
    const tabs = [["pictures", "Pictures"], ["badges", "Badges"], ["borders", "Borders"]]
      .map(([id, lab]) => `<button type="button" data-profile-tab="${id}" aria-pressed="${avatarTab === id}">${lab}</button>`)
      .join("");
    const cosmetics = ProfileStore.COSMETICS || [];
    let body = "";
    if (avatarTab === "pictures") {
      const cur = (p.prefs && p.prefs.avatarId) || "";
      const name = (p.prefs && p.prefs.name) || "Maker";
      const cells = [];
      cells.push(`<button type="button" class="pic" data-avatar="" aria-pressed="${!cur}" aria-label="Initials"><span class="ph">${esc(name.slice(0, 1).toUpperCase())}</span>Initials</button>`);
      (ProfileStore.AVATARS || []).forEach((a) => {
        const art = AVATAR_ART[a.id] || `<span>${esc(a.label.slice(0, 1))}</span>`;
        cells.push(`<button type="button" class="pic" data-avatar="${esc(a.id)}" aria-pressed="${cur === a.id}" aria-label="${esc(a.label)}"><span class="ph">${art}</span>${esc(a.label)}</button>`);
      });
      cells.push(`<button type="button" class="pic is-later" disabled aria-disabled="true" aria-label="Upload, coming later"><span class="ph">↑</span>Upload later</button>`);
      body = `<p class="hint" style="margin:0 0 10px">Pictures land tomorrow from Imagine. These are place-holders. 16 colours, square busts.</p>
        <div class="pic-grid">${cells.join("")}</div>`;
    } else if (avatarTab === "badges") {
      const items = cosmetics.filter((c) => c.slot === "badge");
      body = `<p class="hint" style="margin:0 0 10px">Earned from achievements, shop sales and published games. Locked ones show how to earn them. Month-chart badges can be equipped here. Verified creator and Made by TileEngine are trust marks, not cosmetics.</p>
        <div class="badge-grid">${items.map((item) => rewardButton(item, p, counts, badgeShown, "badge")).join("")}</div>
        <p class="example">${esc(pendingNote())}</p>`;
    } else {
      const items = cosmetics.filter((c) => c.slot === "border");
      const plainOn = !borderShown;
      const plainBtn = `<button type="button" class="rew" data-reward-id="" data-reward-kind="border" aria-pressed="${plainOn}" aria-label="Plain border"><span class="ico">▭</span>Plain</button>`;
      body = `<p class="hint" style="margin:0 0 10px">A border sits around your avatar on the Studio profile. Plain is the default (no border equipped).</p>
        <div class="badge-grid">${plainBtn}${items.map((item) => rewardButton(item, p, counts, borderShown, "border")).join("")}</div>
        <p class="example">${esc(pendingNote())}</p>`;
    }
    root.innerHTML = `<div class="pf-tabs" role="tablist" aria-label="Avatar and rewards">${tabs}</div>${body}`;
    root.querySelectorAll("[data-profile-tab]").forEach((b) => b.addEventListener("click", () => { avatarTab = b.getAttribute("data-profile-tab"); closeRewardSheet(); renderAvatarPanel(); }));
    root.querySelectorAll("[data-avatar]").forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = b.getAttribute("data-avatar") || null;
      ProfileStore.setAvatar(id);
      toast(id ? `${(ProfileStore.AVATARS.find((a) => a.id === id) || {}).label || "Picture"} selected` : "Using initials");
      renderAvatarPanel();
    }));
    root.querySelectorAll("[data-reward-id]").forEach((b) => b.addEventListener("click", () => onRewardTap(b.getAttribute("data-reward-id"), b.getAttribute("data-reward-kind"))));
  }

  function rewardButton(item, profile, counts, equippedId, kind) {
    const st = cosmeticState(item, profile, counts);
    const locked = st.locked;
    const on = !locked && equippedId === item.key;
    const ico = locked ? "🔒" : (kind === "border" ? "▭" : "★");
    const times = st.times > 1 ? ` ×${st.times}` : "";
    const label = locked ? `${item.title}${kind === "border" ? " border" : ""}, locked${st.label ? ", " + st.label : ""}` : `${item.title}${kind === "border" ? " border" : ""}${times}`;
    const showBar = locked && !st.hideCounts && st.target && st.label && st.kind && st.kind !== "Chart" && st.kind !== "Achievement";
    const bar = showBar ? `<span class="bar" aria-hidden="true"><i style="width:${Math.min(100, Math.round(100 * st.current / Math.max(1, st.target)))}%"></i></span><small>${esc(st.label)}</small>` : (locked && st.label && !st.hideCounts ? `<small>${esc(st.label)}</small>` : (times ? `<small>${esc(times.trim())}</small>` : ""));
    return `<button type="button" class="rew${locked ? " is-locked" : ""}" data-reward-id="${esc(item.key)}" data-reward-kind="${esc(kind)}" aria-pressed="${on}" aria-label="${esc(label)}"><span class="ico">${ico}</span>${esc(item.title)}${bar}</button>`;
  }

  function onRewardTap(id, kind) {
    const p = ProfileStore.load();
    if (kind === "border" && !id) {
      ProfileStore.setBorder(null);
      toast("Plain border");
      closeRewardSheet();
      renderAvatarPanel();
      return;
    }
    const item = ProfileStore.cosmeticByKey(id); if (!item) return;
    const st = cosmeticState(item, p);
    if (!st.locked) {
      if (kind === "badge") ProfileStore.setBadge(id);
      else ProfileStore.setBorder(id);
      toast(`${item.title} equipped`);
      closeRewardSheet();
      renderAvatarPanel();
      return;
    }
    openRewardSheet(item, kind, st);
  }

  function openRewardSheet(item, kind, st) {
    const sh = $("#profile-reward-sheet"); if (!sh) return;
    $("#reward-sheet-title").textContent = item.title;
    $("#reward-sheet-kicker").textContent = (kind === "border" ? "Profile border" : "Badge") + " · locked";
    $("#reward-sheet-how").textContent = st.how || "Keep going to unlock this reward.";
    $("#reward-sheet-kind").textContent = st.hideCounts ? "Locked" : (st.kind || "Progress");
    $("#reward-sheet-frac").textContent = st.hideCounts ? "" : `${st.current}/${st.target}`;
    const prog = $("#reward-sheet-prog");
    if (prog) prog.hidden = !!st.hideCounts;
    const bar = $("#reward-sheet-bar");
    if (bar) bar.style.width = st.hideCounts ? "0%" : Math.min(100, Math.round(100 * st.current / Math.max(1, st.target))) + "%";
    const ex = $("#reward-sheet-example");
    if (ex) ex.textContent = st.hideCounts
      ? "Sale counts are only visible on your own profile. Visitors see the badge only."
      : "Counts come from profile.rewards.metrics (read-only). Paid sales only. Sale counts are only visible on your own profile.";
    sh.hidden = false;
    sh.setAttribute("aria-label", `${item.title}${kind === "border" ? " border" : ""}, locked`);
  }

  function renderAchievementsScreen() {
    const list = $("#ach-list"); if (!list || !window.ProfileStore) return;
    const p = ProfileStore.load();
    const rows = allAchievementRows(p);
    if (!achievementsVisitUnseen) {
      achievementsVisitUnseen = {};
      unlockedAchievementIds(p).forEach((id) => { if (!achievementListSeen(id)) achievementsVisitUnseen[id] = true; });
      markAchievementsViewed(p);
    }
    const unknownCount = rows.filter((r) => r.status === "unknown").length;
    list.innerHTML = rows.map((r) => {
      const pct = Math.min(100, Math.round((100 * r.progress.current) / Math.max(1, r.progress.target)));
      const isNew = r.unlocked && achievementsVisitUnseen[r.id];
      const grey = r.greyed || r.status === "unknown" ? ' style="opacity:.7"' : "";
      return `<div class="ach-card ${r.unlocked ? "" : "locked"}${isNew ? " is-new" : ""}"${grey}>
        <div class="ach-top"><strong>${esc(r.title)}</strong><span class="ach-cat">${isNew ? '<span class="ach-new">New</span> · ' : ""}${esc(r.categoryLabel)}</span></div>
        <p class="hint" style="margin:4px 0 0">${esc(r.description)}</p>
        <div class="ach-bar" aria-hidden="true"><i style="width:${r.unlocked ? 100 : pct}%"></i></div>
        <p class="hint" style="margin:4px 0 0">${r.unlocked ? "Unlocked" : (r.progress && r.progress.hideCounts ? "Locked" : r.progress.current + " / " + r.progress.target)}</p>
      </div>`;
    }).join("") + (unknownCount ? `<p class="hint">${unknownCount} from a newer version (kept)</p>` : "");
  }

  /* ---------- public + hooks ---------- */
  function onShow(id) {
    if (id === "pick-behaviour") {
      if (isBasic() && pickerView === "advanced" && state() && !state().qolAdvancedBrowse) pickerView = "home";
    }
    if (id === "stage" || id === "stage-type") renderTypeBar();
    if (id === "stage-type") renderTypePicker();
    if (id === "stage-lairs") renderLairScreen();
    if (id === "project-settings") renderRunLayer();
    if (id === "stage") { const chip = $("#stage-playing-chip"); if (chip && state() && !state().stagePlay) chip.hidden = true; }
    if (id === "profile") enhanceProfile();
    if (id === "profile-avatar") renderAvatarPanel();
    if (id === "profile-achievements") renderAchievementsScreen();
  }
  window.TileEngineQoL = {
    isBasic, word, tryQuickAdd, addById, applyRole, suggestionsFor,
    renderPickList, renderUnitSheet, renderTypeBar, stagePalette, onShow,
    onPlayClicked, startStagePlay, exitStagePlay,
    keepAsProjectAsset, offerPlaceKept, renderTypePicker, createStageOfType,
    enhanceViewMenu, openEffects, enhanceProfile, renderAvatarPanel, renderAchievementsScreen,
    readRewardCounters, REWARD_CONFIG, AVATAR_ART, canSeeSaleCounts, viewingOwnProfile,
    THREAT_BEHS, ENEMY_HIDDEN_COUNT, TYPE_META,
    resetPicker() { pickerView = "home"; const s = state(); if (s) s.qolAdvancedBrowse = false; },
    resetUnitTab() { unitTab = "abilities"; },
  };
  document.addEventListener("click", () => { if ($("#live-view-menu") && !$("#live-view-menu").hidden) enhanceViewMenu(); });
})();
