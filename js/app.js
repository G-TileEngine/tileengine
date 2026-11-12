/* TileEngine UI shell — clickable prototype, no game logic. Uses SetupStore §11 r2. */
(function () {
  "use strict";

  const S = window.SetupStore;
  const WIZARD = [
    "wizard-platform",
    "wizard-combat",
    "wizard-ability-pick",
    "wizard-camera",
    "wizard-tiles",
    "wizard-map",
  ];
  const STARTER_ORDER = [
    "action-budget",
    "step-pattern",
    "basic-attack",
    "damage-resolution",
    "mana-pool",
    "hand-and-draw",
    "win-condition",
    "unit-roster",
  ];

  const state = {
    entry: "standalone", // in-game maker removed (CEO S1)
    platform: "mobile",
    combat: "grid-tactics",
    abilityPick: "all-menu",
    basicStyle: "unit-action-menu",
    spellsStyle: "unit-action-menu",
    handPlacement: "hand-docked",
    handOpenFromMenu: false,
    screenFit: "letterbox",
    enemyMode: "fixed",
    mapTool: null, // "walls" | "objects" | "paint" | "fill" | "move" | null
    paintTileType: "floor",
    renderTarget: "browser",
    wallHover: true,
    spriteReturn: "wizard-tiles",
    stageZoom: 1,
    stagePanX: 0,
    stagePanY: 0,
    spriteSlice: null, // { srcCanvas, name, url, tile, cols, rows, result, originalMeta }
    wizardPeekOpen: false,
    paintHistory: [],
    paintStroke: null,
    refixId: null,
    refixDraft: null,
    allowFracZoom: false,
    selectedObjectId: null,
    objectDraft: { blocks: false, blocks_los: null, blocks_shots: null },
    walkRulesOverlay: false,
    editorZoom: 1,
    editorMinimap: true,
    minimapExpanded: false,
    stageSheetMode: null, // paint|walls|objects|units|unit|move|more
    statusChipDismissed: false,
    activeLayer: "ground",
    stageLoadoutMode: "project",
    godWhat: "unit-stat",
    godWhere: "this-stage",
    _pendingDiff: { hp: 1, damage: 1 },
    unitMenuOpen: false,
    cameraView: "top-down",
    cameraMode: "fixed",
    zoom: 1.0,
    tileSize: 64,
    tileSizeTouched: false,
    tileSizeSuggested: 64,
    tileset: "stone",
    mapW: 6,
    mapH: 9,
    terrain: "stone",
    fog: false,
    placeMode: false,
    units: [
      { id: 1, name: "Warrior A", x: 1, y: 7, hp: 9, atk: 1, setups: [] },
      { id: 2, name: "Mage B", x: 4, y: 1, hp: 6, atk: 2, setups: [] },
    ],
    selectedUnitId: 1,
    selectedCell: { x: 1, y: 7 },
    nextId: 3,
    catalogueDoc: null,
    catalogue: [],
    catalogueRev: null,
    behaviourQuery: "",
    selectedBehaviourId: null,
    draftDoc: null,
    draftNotices: [],
    activeSetupId: null,
    editKnobId: null,
    reaskQueue: [],
    draftQuestionValue: null,
    pendingPresetId: null,
    lastNotices: [],
    previewDev: false,
    previewStage: 1,
    god: { hp: 20, dmg: 1, mana: 14 },
    spriteName: "",
    spriteUrl: "",
    project: null,
    currentStageId: null,
    loadoutSelected: [],
    loadoutSlots: 4,
    sizeWarn: null,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function humanize(s) {
    const map = {
      "orthogonal-1": "Orthogonal 1",
      "orthogonal-2": "Orthogonal 2",
      "king-1": "King 1",
      "king-2": "King 2",
      "forward2-back1-side2": "Forward 2, back 1, side 2",
      "ns1-diag2": "N/S 1, diagonal 2",
      "ns2-ew1": "N/S 2, E/W 1",
      "orth1-diag2": "Orthogonal 1, diagonal 2",
      "diag-2": "Diagonal 2",
      "same-as-step": "Same as step",
      "custom-cross": "Custom cross",
      "orth-only-1": "Orthogonal only (1)",
      "steps-and-basics": "Steps & basics",
      "caster-warrior": "Caster warrior",
    };
    if (map[s]) return map[s];
    if (typeof s === "boolean") return s ? "On" : "Off";
    return String(s)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function unitCrossValues(unit) {
    // Effective answers from this unit's setups + project rules (for cross-behaviour active_when).
    const cross = {};
    const sc = presentationStyle();
    cross["ability-presentation"] = {
      shortcut: sc,
      style: sc === "all-cards" ? "card-hand" : sc === "all-menu" ? "unit-action-menu" : sc,
    };
    const docs = [];
    if (unit && unit.setups) unit.setups.forEach((s) => s.doc && docs.push(s.doc));
    if (state.project && window.ProjectStore) {
      ProjectStore.listSetups(state.project).forEach((d) => docs.push(d));
    }
    docs.forEach((doc) => {
      const b = behaviourById(doc.behaviourId);
      if (!b) return;
      cross[doc.behaviourId] = cross[doc.behaviourId] || {};
      (b.knobs || []).forEach((k) => {
        const a = doc.answers[k.id];
        if (!a) return;
        cross[doc.behaviourId][k.id] = a.source === "default" ? k.default : a.value;
      });
    });
    return cross;
  }

  function presentationStyleSafe(v) {
    if (v === "card-hand") return "card-hand";
    return "unit-action-menu";
  }

  function mapViaCatalogueOptions(behaviourId, knobId, value) {
    if (value == null) return value;
    const beh = behaviourById(behaviourId);
    const kn = beh && (beh.knobs || []).find((k) => k.id === knobId || (k.renamed_from || []).indexOf(knobId) >= 0);
    if (!kn || !Array.isArray(kn.options)) return value;
    if (kn.options.some((o) => (typeof o === "object" ? o.value : o) === value)) return value;
    const hit = kn.options.find(
      (o) => o && typeof o === "object" && Array.isArray(o.renamed_from) && o.renamed_from.indexOf(value) >= 0
    );
    return hit ? hit.value : value;
  }

  function presentationStyle() {
    // Returns rev 6 shortcut; legacy option values via catalogue options[].renamed_from.
    let v = state.abilityPick;
    if (state.project && window.ProjectStore) {
      try {
        v = ProjectStore.presentationFromProject(state.project, state.catalogueDoc) || v;
      } catch (e) {}
    }
    if (v === "custom") return "custom";
    if (v === "unit-menu" || v === "menu") v = "unit-action-menu";
    if (v === "cards" || v === "hand") v = "card-hand";
    v = mapViaCatalogueOptions("ability-presentation", "shortcut", v);
    if (v === "all-cards") return "all-cards";
    if (v === "custom") return "custom";
    return "all-menu";
  }

  function presentationAnswers() {
    if (state.project && window.ProjectStore) {
      try {
        return ProjectStore.getPresentationAnswers(state.project, state.catalogueDoc);
      } catch (e) {}
    }
    return {
      shortcut: state.abilityPick || "all-menu",
      basic_style: state.basicStyle || "unit-action-menu",
      spells_style: state.spellsStyle || "unit-action-menu",
      hand_placement: state.handPlacement || "hand-docked",
    };
  }

  function usesCardHand() {
    const vals = presentationAnswers();
    const s = vals.shortcut || presentationStyle();
    if (s === "all-cards") return true;
    if (s === "custom") {
      return vals.basic_style === "card-hand" || vals.spells_style === "card-hand";
    }
    return false;
  }

  function handInMenu() {
    return usesCardHand() && (presentationAnswers().hand_placement || "hand-docked") === "hand-in-menu";
  }

  function handDocked() {
    return usesCardHand() && !handInMenu();
  }

  function syncPresentationStateFromProject() {
    const vals = presentationAnswers();
    state.abilityPick = vals.shortcut || "all-menu";
    state.basicStyle = vals.basic_style || "unit-action-menu";
    state.spellsStyle = vals.spells_style || "unit-action-menu";
    state.handPlacement = vals.hand_placement || "hand-docked";
  }

  function renderAbilityPanels() {
    const custom = state.abilityPick === "custom";
    const cards = usesCardHand();
    ["ability-custom-panel", "ability-custom-panel-settings"].forEach((id) => {
      const el = $("#" + id);
      if (el) el.hidden = !custom;
    });
    ["ability-hand-panel", "ability-hand-panel-settings"].forEach((id) => {
      const el = $("#" + id);
      if (el) el.hidden = !cards;
    });
    setPressed("ability-pick", state.abilityPick);
    setPressed("basic-style", state.basicStyle);
    setPressed("spells-style", state.spellsStyle);
    setPressed("hand-placement", state.handPlacement);
  }


  function mapCaps() {
    if (state.platform === "pc") return { max: 24, tileDefault: 48 };
    return { max: 12, tileDefault: 64 }; // both uses mobile caps
  }

  /** Read-only from project-format §3.1 TILE_SIZE_SUGGESTION — no invented fallback. */
  function suggestedTileSizeForPlatform(platform) {
    if (!window.ProjectStore || !ProjectStore.TILE_SIZE_SUGGESTION) return undefined;
    return ProjectStore.TILE_SIZE_SUGGESTION[platform];
  }

  function platformLabel(platform) {
    if (platform === "pc") return "PC"; // stored value still "pc"
    if (platform === "both") return "Both";
    return "Mobile";
  }

  /** Wizard only: while still in the wizard and untouched, follow Platform. */
  function applyPlatformTileSuggestion() {
    const suggested = suggestedTileSizeForPlatform(state.platform);
    if (suggested == null) return;
    state.tileSizeSuggested = suggested;
    if (!state.tileSizeTouched) {
      state.tileSize = suggested;
      const tile = $("#tile-size");
      if (tile) tile.value = String(suggested);
      const val = $("#tile-size-val");
      if (val) val.textContent = suggested + " px";
      renderTilePreview();
    }
    renderTileSizeSuggestion();
  }

  function renderTileSizeSuggestion() {
    const hint = $("#tile-size-suggest-hint");
    const btn = $("#btn-tile-size-reset");
    const suggested = suggestedTileSizeForPlatform(state.platform);
    state.tileSizeSuggested = suggested;
    const platLabel = platformLabel(state.platform);
    if (hint) {
      if (suggested == null) hint.textContent = "";
      else hint.textContent = "Suggested for " + platLabel + ": " + suggested + " px";
    }
    if (btn) {
      btn.hidden = suggested == null || !state.tileSizeTouched || state.tileSize === suggested;
    }
  }

  /** Project settings: hint + reset only — NEVER rewrite settings.tileSize on platform change. */
  function renderSettingsTileSizeHint() {
    if (!state.project) return;
    const m = ProjectStore.manifest(state.project).project;
    const stored = m.settings.tileSize;
    const platform = m.settings.platform || state.platform;
    const suggested = suggestedTileSizeForPlatform(platform);
    const hint = $("#settings-tile-size-hint");
    const btn = $("#btn-settings-tile-size-reset");
    const slider = $("#settings-tile-size");
    const val = $("#settings-tile-size-val");
    if (slider && stored != null) slider.value = String(stored);
    if (val && stored != null) val.textContent = stored + " px";
    if (hint) {
      hint.textContent =
        suggested == null ? "" : "Suggested for " + platformLabel(platform) + ": " + suggested + " px";
    }
    if (btn) btn.hidden = suggested == null || stored === suggested;
    setPressed("platform", platform);
  }


  function ensureBehaviourSetup(behaviourId, name) {
    if (!state.project || !window.SetupStore) return null;
    let doc = ProjectStore.listSetups(state.project).find((s) => s.behaviourId === behaviourId);
    if (doc) return doc;
    const created = SetupStore.createSetup(behaviourId, state.catalogueDoc, name || behaviourId);
    if (created && created.doc) {
      ProjectStore.saveSetupFile(state.project, created.doc);
      const m = ProjectStore.manifest(state.project);
      m.project.rules = m.project.rules || [];
      if (m.project.rules.indexOf(created.doc.id) < 0) m.project.rules.push(created.doc.id);
      return created.doc;
    }
    return null;
  }

  function rosterAnswer(knobId) {
    const doc = ensureBehaviourSetup("unit-roster", "Unit roster");
    if (!doc || !window.SetupStore) return null;
    const beh = behaviourById("unit-roster");
    const knob = (beh && beh.knobs || []).find((k) => k.id === knobId);
    const a = doc.answers[knobId];
    return { doc, knob, value: SetupStore.effective(a, knob) };
  }

  function setRosterAnswer(knobId, value) {
    const row = rosterAnswer(knobId);
    if (!row || !row.doc) return;
    const res = SetupStore.editAnswer(row.doc, knobId, value, row.doc.rev, state.catalogueDoc);
    if (res.doc) {
      ProjectStore.saveSetupFile(state.project, res.doc);
      persistProject();
    }
  }

  function terrainAnswer(knobId) {
    const doc = ensureBehaviourSetup("terrain", "Terrain");
    if (!doc || !window.SetupStore) return null;
    const beh = behaviourById("terrain");
    const knob = (beh && beh.knobs || []).find((k) => k.id === knobId);
    const a = doc.answers[knobId];
    return { doc, knob, value: SetupStore.effective(a, knob) };
  }

  function setTerrainAnswer(knobId, value) {
    const row = terrainAnswer(knobId);
    if (!row || !row.doc) return;
    const res = SetupStore.editAnswer(row.doc, knobId, value, row.doc.rev, state.catalogueDoc);
    if (res.doc) {
      ProjectStore.saveSetupFile(state.project, res.doc);
      persistProject();
    }
  }

  function resolveTeamColour(side) {
    // rev 9 / L30: team_colour null = inherit ability-presentation.team_colours for the side
    const c = rosterAnswer("team_colour");
    if (c && c.value != null && c.value !== "") return c.value;
    if (state.project && window.SetupStore) {
      const ap = ProjectStore.listSetups(state.project).find((s) => s.behaviourId === "ability-presentation");
      const beh = behaviourById("ability-presentation");
      const knob = (beh && beh.knobs || []).find((k) => k.id === "team_colours");
      if (ap && knob) {
        const list = SetupStore.effective(ap.answers.team_colours, knob) || knob.default || [];
        const hit = (list || []).find((it) => it && it.id === (side || "player"));
        if (hit && hit.colour) return hit.colour;
      }
    }
    return side === "rival" ? "#c44a3a" : "#badcff";
  }

  function currentMapDoc() {
    if (!state.project || !window.ProjectStore) return null;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st || !st.mapRef) return null;
    return ProjectStore.getMap(state.project, st.mapRef);
  }

  function currentWallLookResolved() {
    const map = currentMapDoc();
    const tsz = state.tileSize || 64;
    if (window.ProjectStore && ProjectStore.resolveWallLook) return ProjectStore.resolveWallLook(map, null, tsz);
    return ProjectStore.stockWallLook ? ProjectStore.stockWallLook(tsz) : { mode: "line", colour: "#20242C", width: Math.max(1, Math.round(tsz / 16)) };
  }

  function writeMapWallLook(patch) {
    const map = currentMapDoc();
    if (!map || !window.ProjectStore) return;
    const cur = map.wallLook && map.wallLook.mode ? Object.assign({}, map.wallLook) : { mode: "line" };
    const next = Object.assign(cur, patch || {});
    if (next.mode === "line") {
      // Persist colour/width only when user set them (stock constants otherwise stay unwritten)
      if (next.width == null && patch && patch.width != null) next.width = patch.width;
      if (next.colour == null && patch && patch.colour != null) next.colour = patch.colour;
    }
    ProjectStore.setMapWallLook(state.project, map.id, next);
    persistProject();
    renderGrid();
  }

  function renderWallsPrefs() {
    const box = $("#walls-prefs");
    const row = $("#walls-prefs-row");
    if (!box || !row) return;
    const on = state.mapTool === "walls";
    box.hidden = !on;
    if (!on) return;
    const los = terrainAnswer("wall_blocks_los");
    const shots = terrainAnswer("wall_blocks_shots");
    const push = terrainAnswer("push_into_walls");
    const losOn = !!(los && los.value !== false);
    const shotsOn = !!(shots && shots.value !== false);
    const pushOn = !!(push && push.value === true); // catalogue default off
    const look = currentWallLookResolved();
    const width = look.width != null ? look.width : 2;
    const colour = look.colour || "#20242C";
    const colours = ["#20242C", "#4b5563", "#12141a", "#f2f4f7"];
    const hoverOn = state.wallHover !== false;
    row.innerHTML = `
      <div class="walls-pref-line">
        <span class="name">Walls block line of sight</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-wall-pref="wall_blocks_los" data-value="true" aria-pressed="${losOn}">On</button>
          <button type="button" class="toggle" data-wall-pref="wall_blocks_los" data-value="false" aria-pressed="${!losOn}">Off</button>
        </div>
      </div>
      <div class="walls-pref-line">
        <span class="name">Walls block shots</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-wall-pref="wall_blocks_shots" data-value="true" aria-pressed="${shotsOn}">On</button>
          <button type="button" class="toggle" data-wall-pref="wall_blocks_shots" data-value="false" aria-pressed="${!shotsOn}">Off</button>
        </div>
      </div>
      <div class="walls-pref-line">
        <span class="name">Pushes can slam into walls</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-wall-pref="push_into_walls" data-value="true" aria-pressed="${pushOn}">On</button>
          <button type="button" class="toggle" data-wall-pref="push_into_walls" data-value="false" aria-pressed="${!pushOn}">Off</button>
        </div>
      </div>
      <details class="wall-more" open>
        <summary>Wall look</summary>
        <div class="walls-pref-line wrap">
          <span class="sub">Thickness</span>
          <div class="toggle-row" role="group" aria-label="Wall thickness">
            ${[1, 2, 3, 4].map((n) => `<button type="button" class="toggle" data-wall-width="${n}" aria-pressed="${width === n}">${n} px</button>`).join("")}
          </div>
        </div>
        <div class="walls-pref-line wrap">
          <span class="sub">Colour</span>
          <div class="swatch-grid" style="margin:0">
            ${colours.map((h) => `<button type="button" class="swatch sm" data-wall-colour="${h}" style="background:${h}" aria-pressed="${colour.toLowerCase() === h.toLowerCase()}" aria-label="${h}"></button>`).join("")}
          </div>
        </div>
        <p class="hint" style="margin:4px 0 0">Drawn ${width} px thick × zoom, above the floor and below units. Look only — does not change walk rules.</p>
        <div class="walls-pref-line" style="margin-top:8px">
          <span class="name">Show wall rules on tap</span>
          <div class="toggle-row" role="group">
            <button type="button" class="toggle" data-wall-hover="true" aria-pressed="${hoverOn}">On</button>
            <button type="button" class="toggle" data-wall-hover="false" aria-pressed="${!hoverOn}">Off</button>
          </div>
        </div>
      </details>`;
    row.querySelectorAll("[data-wall-pref]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kid = btn.getAttribute("data-wall-pref");
        const val = btn.getAttribute("data-value") === "true";
        setTerrainAnswer(kid, val);
        renderWallsPrefs();
        const label = kid === "wall_blocks_los" ? "Line of sight" : kid === "wall_blocks_shots" ? "Shots" : "Pushes into walls";
        toast(kid === "push_into_walls" ? (val ? "Pushes can slam into walls" : "Pushes stop at walls") : (label + (val ? " blocked" : " pass")));
      });
    });
    row.querySelectorAll("[data-wall-width]").forEach((btn) => {
      btn.addEventListener("click", () => {
        writeMapWallLook({ mode: "line", width: Number(btn.getAttribute("data-wall-width")) });
        renderWallsPrefs();
      });
    });
    row.querySelectorAll("[data-wall-colour]").forEach((btn) => {
      btn.addEventListener("click", () => {
        writeMapWallLook({ mode: "line", colour: btn.getAttribute("data-wall-colour") });
        renderWallsPrefs();
      });
    });
    row.querySelectorAll("[data-wall-hover]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.wallHover = btn.getAttribute("data-wall-hover") === "true";
        renderWallsPrefs();
        renderGrid();
      });
    });
  }

  function renderObjectsPrefs() {
    const box = $("#objects-prefs");
    const row = $("#objects-prefs-row");
    if (!box || !row) return;
    const on = state.mapTool === "objects";
    box.hidden = !on;
    if (!on) return;
    const draft = state.objectDraft || { blocks: false, blocks_los: null, blocks_shots: null };
    const blocksOn = !!draft.blocks;
    const losInherit = draft.blocks_los == null;
    const shotsInherit = draft.blocks_shots == null;
    const losOn = losInherit ? true : !!draft.blocks_los;
    const shotsOn = shotsInherit ? true : !!draft.blocks_shots;
    const selected = state.selectedObjectId;
    row.innerHTML = `
      <p class="hint" style="margin:0 0 8px">Tap a cell to place or remove. Objects can't be targeted. No per-stage objects — use another map.</p>
      <div class="walls-pref-line">
        <span class="name">Blocks movement</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-obj-blocks="true" aria-pressed="${blocksOn}">On</button>
          <button type="button" class="toggle" data-obj-blocks="false" aria-pressed="${!blocksOn}">Off</button>
        </div>
      </div>
      <div class="walls-pref-line" ${blocksOn ? "" : "hidden"}>
        <span class="name">Blocks line of sight</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-obj-los="inherit" aria-pressed="${losInherit}">Terrain</button>
          <button type="button" class="toggle" data-obj-los="true" aria-pressed="${!losInherit && losOn}">On</button>
          <button type="button" class="toggle" data-obj-los="false" aria-pressed="${!losInherit && !losOn}">Off</button>
        </div>
      </div>
      <div class="walls-pref-line" ${blocksOn ? "" : "hidden"}>
        <span class="name">Blocks shots</span>
        <div class="toggle-row" role="group">
          <button type="button" class="toggle" data-obj-shots="inherit" aria-pressed="${shotsInherit}">Terrain</button>
          <button type="button" class="toggle" data-obj-shots="true" aria-pressed="${!shotsInherit && shotsOn}">On</button>
          <button type="button" class="toggle" data-obj-shots="false" aria-pressed="${!shotsInherit && !shotsOn}">Off</button>
        </div>
      </div>
      <p class="hint">${selected ? "Selected: " + selected : "Default blocks: off (follows terrain wall knobs when on)."}</p>`;
    row.querySelectorAll("[data-obj-blocks]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.objectDraft.blocks = btn.getAttribute("data-obj-blocks") === "true";
        if (!state.objectDraft.blocks) {
          state.objectDraft.blocks_los = null;
          state.objectDraft.blocks_shots = null;
        }
        syncSelectedObjectDraft();
        renderObjectsPrefs();
      });
    });
    row.querySelectorAll("[data-obj-los]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-obj-los");
        state.objectDraft.blocks_los = v === "inherit" ? null : v === "true";
        syncSelectedObjectDraft();
        renderObjectsPrefs();
      });
    });
    row.querySelectorAll("[data-obj-shots]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-obj-shots");
        state.objectDraft.blocks_shots = v === "inherit" ? null : v === "true";
        syncSelectedObjectDraft();
        renderObjectsPrefs();
      });
    });
  }

  function syncSelectedObjectDraft() {
    if (!state.selectedObjectId || !state.project || !window.ProjectStore) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st || !st.mapRef) return;
    const d = state.objectDraft || {};
    ProjectStore.updateMapObject(state.project, st.mapRef, state.selectedObjectId, {
      blocks: !!d.blocks,
      blocks_los: d.blocks ? d.blocks_los : null,
      blocks_shots: d.blocks ? d.blocks_shots : null,
    });
    persistProject();
    renderGrid();
  }

  function renderUnitTeamColourUI() {
    const col = rosterAnswer("team_colour");
    const custom = !!(col && col.value != null && col.value !== "");
    const colour = custom ? col.value : (resolveTeamColour("player") || "#badcff");
    const btnInh = $("#btn-team-inherit");
    const btnCust = $("#btn-team-custom");
    if (btnInh) btnInh.setAttribute("aria-pressed", custom ? "false" : "true");
    if (btnCust) btnCust.setAttribute("aria-pressed", custom ? "true" : "false");
    const field = $("#unit-team-colour-field");
    if (field) field.hidden = !custom;
    const inp = $("#unit-team-colour");
    const txt = $("#unit-team-colour-text");
    if (inp) inp.value = colour;
    if (txt) txt.value = colour;
    const cues = rosterAnswer("clip_cues");
    const cuesOn = !cues || cues.value !== false;
    const cOn = $("#btn-clip-cues-on");
    const cOff = $("#btn-clip-cues-off");
    if (cOn) cOn.setAttribute("aria-pressed", cuesOn ? "true" : "false");
    if (cOff) cOff.setAttribute("aria-pressed", cuesOn ? "false" : "true");
    const slot = $("#sprite-team-colour-slot");
    if (slot) {
      slot.innerHTML = `<p class="hint">Resolved token tint: <strong style="color:${escapeHtml(resolveTeamColour("player"))}">${escapeHtml(resolveTeamColour("player"))}</strong> · ${custom ? "custom" : "inherit"}</p>`;
    }
  }



  function syncHash(id) {
    if (location.hash.replace(/^#/, "") !== id) {
      history.replaceState(null, "", "#" + id);
    }
  }

  function show(id) {
    if (id === "sliders") id = "unit-editor";
    const toastEl = $("#toast");
    if (toastEl && id !== "_keep_toast") toastEl.classList.remove("show");

    $$(".screen").forEach((s) => {
      const on = s.id === "screen-" + id;
      s.classList.toggle("active", on);
      if (s.id !== "screen-sliders") s.hidden = !on;
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    syncHash(id);
    renderChrome(id);
    if (id === "stage" || id === "place-unit" || id === "stage-map") {
      if (id === "stage") {
        state.statusChipDismissed = false;
        const om = $("#stage-overflow-menu");
        const ob = $("#btn-stage-overflow");
        if (om) om.hidden = true;
        if (ob) ob.setAttribute("aria-expanded", "false");
      }
      loadStageEditorPrefs().then(() => {
        renderGrid();
        renderStageOverlays();
        updatePlayBanner();
        renderTileLegend();
        if (id === "stage") {
          const title = $("#stage-title");
          if (title && state.project && window.ProjectStore) {
            const st = ProjectStore.getStage(state.project, state.currentStageId);
            title.textContent = (st && st.name) || "Stage";
          }
        }
      });
    }
    if (id === "sprite-studio" && window.SpriteStudio) window.SpriteStudio.onShow();
    if (window.Experience) window.Experience.onShow(id); // r64: tiers, Next-step chip, quiz/setup screens
    if (id === "unit-list") renderUnitList();
    if (id === "unit-editor") renderUnitEditor();
    if (id === "refix") { renderRefix(); }
    if (id === "sprite-upload") {
      if (!state.spriteReturn || state.spriteReturn === id) {
        // keep existing return target if already set by nav handler
      }
      noteOddAssetSizes();
      renderUnitTeamColourUI();
      const ret = state.spriteReturn || "stage";
      const back = document.getElementById("btn-sprite-back");
      const done = document.getElementById("btn-sprite-done");
      if (back) back.onclick = () => show(ret);
      if (done) done.onclick = () => show(ret === "wizard-tiles" ? "wizard-tiles" : "stage");
    }
    if (id === "pick-behaviour") renderPickList();
    if (id === "assign-behaviour") {
      if (!state.draftDoc && !state.selectedBehaviourId && state.catalogue.length) {
        openBehaviour("step-pattern");
        return;
      }
      renderAssign();
    }
    if (id === "behaviour-summary") renderSummary();
    if (id === "behaviour-question") renderQuestion();
    if (id === "duplicate-setup") renderDuplicate();
    if (id === "save-preset") renderSavePreset();
    if (id === "use-preset") renderUsePreset();
    if (id === "update-preset") renderUpdatePreset();
    if (id === "wizard-tiles") { applyPlatformTileSuggestion(); renderTilePreview(); renderTileSizeSuggestion(); }
    if (id === "wizard-map") renderMapPreview();
    if (id.indexOf("wizard-") === 0) { renderWizardPreviewStrip(id); bindWizardAdvancedScroll(); }
    if (id === "wizard-camera") {
      const z = $("#zoom-val");
      if (z) z.textContent = state.zoom.toFixed(2);
    }
    if (id === "preview") renderPreview();
    if (id === "stage-select") renderStageSelect();
    if (id === "stage-enemy-pool") renderEnemyPool();
    if (id === "stage-map") renderStageMap();
    if (id === "stage-loadout") renderStageLoadout();
    if (id === "render") renderBuildSize();
    if (id === "unit-editor") { renderUnitStatsInherit(); renderUnitTeamColourUI(); }
    if (id === "loadout") renderLoadout();
    if (id === "render") {
      /* static */
    }
    if (id === "project-settings") { renderProjectDifficulty(); renderSettingsTileSizeHint(); }
    if (id === "stage-loadout") { renderStageDifficulty(); }
    if (id === "project-settings" || id === "wizard-ability-pick") {
      syncPresentationStateFromProject();
      renderAbilityPanels();
    }
    if (id === "home") {
      const rev = $("#catalogue-rev");
      if (rev) rev.textContent = "catalogue_rev: " + (state.catalogueRev != null ? state.catalogueRev : "—");
    }
  }

  function renderChrome(id) {
    $$(".wizard-dots").forEach((d) => (d.innerHTML = ""));
    if (!String(id).startsWith("wizard-")) return;
    const screen = $("#screen-" + id);
    const dots = screen && screen.querySelector(".wizard-dots");
    if (!dots) return;
    const steps = wizardSteps();
    const cur = steps.indexOf(id);
    dots.innerHTML = steps
      .map((step, i) => {
        const cls = i < cur ? "done" : i === cur ? "current" : "";
        return `<span class="dot ${cls}" aria-hidden="true"></span>`;
      })
      .join("");
  }

  function setPressed(group, value) {
    $$(`[data-group="${group}"]`).forEach((btn) => {
      const on = String(btn.getAttribute("data-value")) === String(value);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("pressed", on);
    });
  }

  /* ---------- catalogue ---------- */

  async function loadCatalogue() {
    try {
      const res = await fetch("data/behaviours.json", { cache: "no-store" });
      const data = await res.json();
      state.catalogueDoc = data;
      if (typeof globalThis !== "undefined") globalThis.__catalogueGates = data.gates || {};
      state.catalogue = data.behaviours || [];
      state.catalogueRev = data.catalogue_rev;
    } catch (e) {
      state.catalogueDoc = { behaviours: [], schema_version: 3, catalogue_rev: null };
      state.catalogue = [];
      state.catalogueRev = null;
    }
  }

  function behaviourById(id) {
    return state.catalogue.find((b) => b.id === id);
  }

  function orderedCatalogue() {
    const byId = Object.fromEntries(state.catalogue.map((b) => [b.id, b]));
    const starters = STARTER_ORDER.map((id) => byId[id]).filter(Boolean);
    const rest = state.catalogue.filter((b) => !b.starter_safe);
    return { starters, rest };
  }

  function matchesQuery(b, q) {
    if (!q) return true;
    const hay = (b.name + " " + (b.summary || "") + " " + (b.group || "")).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function selectedUnit() {
    return state.units.find((u) => u.id === state.selectedUnitId) || null;
  }

  function activeSetupEntry() {
    const u = selectedUnit();
    if (!u) return null;
    return (u.setups || []).find((s) => s.id === state.activeSetupId) || null;
  }

  function activeDoc() {
    const e = activeSetupEntry();
    return e ? e.doc : null;
  }

  function persistActiveDoc(doc) {
    const e = activeSetupEntry();
    if (e) e.doc = doc;
  }

  function projectBehavioursOn(unit) {
    const set = new Set();
    (unit && unit.setups ? unit.setups : []).forEach((s) => {
      if (s.doc && s.doc.behaviourId) set.add(s.doc.behaviourId);
    });
    return set;
  }

  function allProjectBehavioursOn() {
    const set = new Set();
    state.units.forEach((u) => projectBehavioursOn(u).forEach((id) => set.add(id)));
    return set;
  }

  function formatValue(knob, val) {
    if (!knob) return humanize(val);
    if (knob.type === "toggle") return val ? "On" : "Off";
    if (knob.type === "picker") return humanize(val);
    if (knob.type === "colour") return String(val);
    if (knob.type === "slider") {
      const step = S.interimStep(knob);
      const dec = decimalsOf(step);
      if (typeof val === "number" && dec > 0) return val.toFixed(dec);
      return String(val);
    }
    return String(val);
  }

  function decimalsOf(n) {
    const s = String(n);
    if (!s.includes(".")) return 0;
    return s.split(".")[1].replace(/0+$/, "").length || s.split(".")[1].length;
  }

  function wasHint(knob) {
    const prev = S.previousDefault(knob);
    if (prev === null || prev === knob.default) return "";
    return `<span class="was-hint" title="Previous catalogue default">was ${escapeHtml(formatValue(knob, prev))}</span>`;
  }

  function knobStatusTag(knob) {
    const st = knob.status || {};
    const fields = ["default", "min", "max", "options", "step"];
    const bad = fields.some((f) => S.fieldNeedsPlaceholder(knob, f));
    if (bad || (Array.isArray(knob.proposed) && knob.proposed.length)) {
      return `<span class="tag-ph">placeholder value</span>`;
    }
    return "";
  }

  function reasonPlain(reason, note) {
    if (note) {
      // first sentence of no_default_reason
      const cut = String(note).split(/[.(]/)[0].trim();
      return cut || note;
    }
    const map = {
      noDefault: "No default yet — pick a value before Play.",
      bannedCombo: "This combination isn't allowed.",
      offStep: "Value is off the allowed steps.",
      outOfRange: "Value is outside the allowed range.",
      retired: "This answer was retired.",
    };
    return map[reason] || reason || "Needs a new answer";
  }

  /* ---------- pick / assign ---------- */

  function renderPickList() {
    const u = selectedUnit();
    const nameEl = $("#pick-unit-name");
    if (nameEl) nameEl.textContent = u ? u.name : "No unit";
    const root = $("#behaviour-pick-list");
    if (!root) return;
    if (!state.catalogue.length) {
      root.innerHTML = `<p class="hint">Behaviour list not loaded.</p>`;
      return;
    }
    const q = state.behaviourQuery.trim();
    const { starters, rest } = orderedCatalogue();

    const style = presentationStyle();
    const cross = unitCrossValues(u);
    function behaviourVisible(b) {
      if (!b) return false;
      if (S.isBehaviourActive) return S.isBehaviourActive(b, style, cross, state.catalogueDoc);
      // fallback: group "Presentation: card hand only" only when card-hand
      if ((b.group || "").toLowerCase().indexOf("card hand only") >= 0) return style === "card-hand";
      return true;
    }
    const hiddenCard = state.catalogue.filter((b) => !behaviourVisible(b)).length;

    const startersVis = starters.filter((b) => behaviourVisible(b));
    const restAll = rest.filter((b) => behaviourVisible(b));

    // group visible rest by catalogue group; ability owners also by ability_group
    const byGroup = {};
    restAll.filter((b) => matchesQuery(b, q)).forEach((b) => {
      const g = b.group || "More";
      if (g === "Effects") {
        (byGroup["Effects"] = byGroup["Effects"] || []).push(b);
        return;
      }
      const hasAbilityGroup = (b.knobs || []).some((k) => k.id === "ability_group");
      if (hasAbilityGroup) {
        // resolve default ability_group for grouping in Pick
        const ag = (b.knobs || []).find((k) => k.id === "ability_group");
        const gid = (ag && ag.default) || "spells";
        const label = gid === "basic" ? "Abilities · Basic" : gid === "spells" ? "Abilities · Spells" : "Abilities · " + gid;
        (byGroup[label] = byGroup[label] || []).push(b);
        return;
      }
      (byGroup[g] = byGroup[g] || []).push(b);
    });
    const starterList = startersVis.filter((b) => matchesQuery(b, q));
    let html = "";
    if (starterList.length) {
      html += `<div class="beh-group-title">Day-one starters</div>`;
      html += starterList
        .map(
          (b) => `<button type="button" class="beh-row" role="listitem" data-beh="${escapeHtml(b.id)}" aria-label="${escapeHtml(b.name)}">
            <span class="name">${escapeHtml(b.name)}</span>
            <span class="sub">${escapeHtml(b.summary || "")}</span>
            <span class="starter-tag">Day-one</span>
          </button>`
        )
        .join("");
    }
    Object.keys(byGroup)
      .sort()
      .forEach((g) => {
        html += `<div class="beh-group-title">${escapeHtml(g)}</div>`;
        html += byGroup[g]
          .map(
            (b) => `<button type="button" class="beh-row" role="listitem" data-beh="${escapeHtml(b.id)}" aria-label="${escapeHtml(b.name)}">
            <span class="name">${escapeHtml(b.name)}</span>
            <span class="sub">${escapeHtml(b.summary || "")}</span>
          </button>`
          )
          .join("");
      });
    if (hiddenCard) {
      html =
        `<p class="hint" id="hidden-card-note">${hiddenCard} card-only behaviour${hiddenCard === 1 ? "" : "s"} hidden</p>` +
        html;
    }
    // ability-availability is in Pick; default Enabled = Off (catalogue default)
    const aa = state.catalogue.find((b) => b.id === "ability-availability");
    if (aa && behaviourVisible(aa) && matchesQuery(aa, q)) {
      html =
        `<p class="hint" id="ability-availability-note">Ability Availability is Off by default — assign it and turn Enabled on to use cooldowns / uses per match.</p>` +
        html;
    }
    root.innerHTML = html || `<p class="hint">No behaviours match that search.</p>`;
    root.querySelectorAll("[data-beh]").forEach((btn) => {
      btn.addEventListener("click", () => openBehaviour(btn.getAttribute("data-beh")));
    });
  }

  function openBehaviour(id) {
    const created = S.createSetup(id, state.catalogueDoc, behaviourById(id)?.name);
    if (!created.doc) {
      toast("Can't open that behaviour");
      return;
    }
    state.selectedBehaviourId = id;
    state.activeSetupId = null;
    state.draftDoc = created.doc;
    state.draftNotices = created.notices || [];
    show("assign-behaviour");
  }
  window.__openBehaviour = openBehaviour;
    window.renderAssign = renderAssign;
    window.closeUnitMenu = closeUnitMenu;
    window.openUnitMenu = openUnitMenu;

  function orderedSteps(behaviour) {
    const menus = behaviour.menu_order || [];
    if (menus.length && typeof menus[0] === "object") {
      return menus.map((step) => ({
        question: step.question,
        knobs: (step.knob_ids || []).map((id) => behaviour.knobs.find((k) => k.id === id)).filter(Boolean),
      }));
    }
    // legacy string menus
    return (behaviour.knobs || []).map((k, i) => ({
      question: menus[i] || k.label,
      knobs: [k],
    }));
  }

  function questionForKnob(behaviour, knobId) {
    for (const step of orderedSteps(behaviour)) {
      if (step.knobs.some((k) => k.id === knobId)) return step.question;
    }
    const k = behaviour.knobs.find((x) => x.id === knobId);
    return k ? k.label : knobId;
  }

  function valuesFromDoc(doc, behaviour) {
    const out = {};
    (behaviour.knobs || []).forEach((k) => {
      const a = doc.answers[k.id];
      out[k.id] = a ? S.effective(a, k) : k.default;
    });
    return out;
  }

  function renderAssign() {
    const doc = state.draftDoc;
    const b = doc ? behaviourById(doc.behaviourId) : behaviourById(state.selectedBehaviourId);
    const title = $("#assign-title");
    const summary = $("#assign-summary");
    const root = $("#knob-root");
    const banner = $("#banned-banner");
    if (!b || !root || !doc) {
      if (root) root.innerHTML = `<p class="hint">Pick a behaviour first.</p>`;
      return;
    }
    if (title) title.textContent = b.name;
    if (summary) {
      const u = selectedUnit();
      summary.innerHTML = `For <strong>${escapeHtml(u ? u.name : "Unit")}</strong>. ${escapeHtml(b.summary || "")}`;
    }

    const disabledMap = S.disabledByBans(doc, state.catalogueDoc);
    const gates = S.dependencyGates(b, projectBehavioursOn(selectedUnit()));
    const missing = S.listMissing(doc, Object.assign({}, state.catalogueDoc, {_presentationStyle: presentationStyle()}));
    const reask = S.listNeedsReask(doc, state.catalogueDoc);
    if (banner) {
      const first = missing[0] || reask[0];
      if (first) {
        banner.hidden = false;
        banner.textContent = reasonPlain(first.reason, first.note || (first.needsReask && first.needsReask.note));
      } else banner.hidden = true;
    }

    const values = valuesFromDoc(doc, b);
    const style = presentationStyle();
    const cross = unitCrossValues(selectedUnit());
    // stamp for readiness helpers
    state.catalogueDoc._presentationStyle = style;
    state.catalogueDoc._crossValues = cross;
    // BTF / builtin presets bar
    let presetBar = "";
    const builtins = (b.presets || []).map((p) => S.builtinPresetFromCatalogue(b, p, state.catalogueRev)).filter(Boolean);
    if (builtins.length) {
      presetBar =
        `<div class="btf-preset-bar">` +
        builtins
          .map(
            (p) =>
              `<button type="button" class="btn btn-ghost" data-btf-preset="${escapeHtml(p.id)}" aria-label="Load ${escapeHtml(p.name)}"><span class="chip-builtin">Built-in</span> Load ${escapeHtml(p.name)}</button>`
          )
          .join("") +
        `</div>`;
    }

    const rendered = new Set();
    let html = presetBar;
    orderedSteps(b).forEach((step) => {
      step.knobs.forEach((knob) => {
        if (rendered.has(knob.id)) return;
        // Pair unlimited toggle + slider into one card
        if (knob.unlimited_toggle) {
          const tog = b.knobs.find((k) => k.id === knob.unlimited_toggle);
          if (tog) {
            rendered.add(knob.id);
            rendered.add(tog.id);
            const active = S.answerIsActive
              ? S.answerIsActive(knob, doc, b, style, cross)
              : true;
            const unlimitedOn = !!values[tog.id];
            const gateReason = gates[knob.id];
            const inactiveReason = !active ? S.activeWhenReason(knob.active_when) : null;
            html += `<div class="knob-card ${!active ? "inactive" : ""}" data-knob-card="${escapeHtml(knob.id)}">
              <h2>${escapeHtml(step.question)}</h2>
              <div class="unlimited-row">
                <span class="knob-label">${escapeHtml(tog.label)}</span>
                <div class="toggle-row" role="group" aria-label="${escapeHtml(tog.label)}">
                  <button type="button" class="toggle" data-knob-toggle="${escapeHtml(tog.id)}" data-value="true" aria-pressed="${unlimitedOn}">On</button>
                  <button type="button" class="toggle" data-knob-toggle="${escapeHtml(tog.id)}" data-value="false" aria-pressed="${!unlimitedOn}">Off</button>
                </div>
              </div>
              <div class="knob-label">${escapeHtml(knob.label)} <span class="val" data-readout="${escapeHtml(knob.id)}">${escapeHtml(formatValue(knob, values[knob.id]))}</span></div>
              <input class="slider" type="range" min="${knob.min}" max="${knob.max}" step="${S.interimStep(knob)}" value="${escapeHtml(values[knob.id])}" data-knob="${escapeHtml(knob.id)}" ${unlimitedOn || !active ? "disabled" : ""} aria-label="${escapeHtml(knob.label)}" />
              ${inactiveReason ? `<div class="knob-reason">${escapeHtml(inactiveReason)}</div>` : ""}
              ${gateReason ? `<div class="knob-reason">${escapeHtml(gateReason)}</div>` : ""}
            </div>`;
            return;
          }
        }
        if (String(knob.id).endsWith("_unlimited")) {
          // rendered with its slider
          const slider = b.knobs.find((k) => k.unlimited_toggle === knob.id);
          if (slider) return;
        }
        rendered.add(knob.id);
        const gateReason = gates[knob.id];
        const banReason = disabledMap[knob.id];
        const active = S.answerIsActive ? S.answerIsActive(knob, doc, b, style, cross) : true;
        const optDisabled = {};
        Object.keys(disabledMap).forEach((key) => {
          if (key.startsWith(knob.id + "::")) {
            optDisabled[key.slice(knob.id.length + 2)] = disabledMap[key];
          }
        });
        const grey = !active || !!(gateReason || banReason);
        const reason =
          (!active && S.activeWhenReason(knob.active_when)) || gateReason || banReason || null;
        html += knobCardHtml(knob, step.question, values[knob.id], grey, reason, optDisabled, true, !active);
      });
    });
    // knobs not in menu_order
    (b.knobs || []).forEach((knob) => {
      if (rendered.has(knob.id)) return;
      if (String(knob.id).endsWith("_unlimited") && b.knobs.some((k) => k.unlimited_toggle === knob.id)) return;
      rendered.add(knob.id);
      const active = S.answerIsActive ? S.answerIsActive(knob, doc, b, style, cross) : true;
      const grey = !active;
      const reason = !active ? S.activeWhenReason(knob.active_when) : null;
      html += knobCardHtml(knob, knob.label, values[knob.id], grey, reason, {}, true, !active);
    });
    root.innerHTML = html;
    root.querySelectorAll("[data-btf-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-btf-preset");
        const preset = builtins.find((p) => p.id === pid);
        if (!preset) return;
        const res = S.applyPreset(state.draftDoc, preset, "overlay", state.catalogueDoc);
        if (res.doc) {
          state.draftDoc = res.doc;
          toast("Loaded " + preset.name + " (one undo step)");
          renderAssign();
        } else toast("Could not apply preset");
      });
    });
    bindKnobControls(root, (knobId, value) => {
      applyDraftEdit(knobId, value);
    });
  }

  function applyDraftEdit(knobId, value) {
    if (!state.draftDoc) return;
    const res = S.editAnswer(state.draftDoc, knobId, value, state.draftDoc.rev, state.catalogueDoc);
    if (res.error) {
      if (res.error.nearest != null) {
        toast("Use steps of " + res.error.step + " — nearest " + res.error.nearest);
        // snap to nearest
        const snap = S.editAnswer(state.draftDoc, knobId, res.error.nearest, state.draftDoc.rev, state.catalogueDoc);
        if (snap.doc) state.draftDoc = snap.doc;
      } else if (res.error.message) toast(res.error.message);
      else toast("Can't set that value");
      renderAssign();
      return;
    }
    state.draftDoc = res.doc;
    renderAssign();
  }


  function refChoices(knob) {
    const out = [];
    const seen = new Set();
    const add = (value, label) => {
      if (seen.has(value)) return;
      seen.add(value);
      out.push({ value, label: label || humanize(value) });
    };
    const builtin = (knob.ref && knob.ref.builtin) || [];
    builtin.forEach((v) => add(v, v === "none" ? "None" : humanize(v)));
    // list target from project ability-presentation or effect.saved_effects
    const listPath = knob.ref && knob.ref.list;
    if (listPath && state.project && window.ProjectStore) {
      const [bid, kid] = String(listPath).split(".");
      const setup = ProjectStore.listSetups(state.project).find((s) => s.behaviourId === bid);
      const beh = behaviourById(bid);
      const kn = beh && (beh.knobs || []).find((k) => k.id === kid);
      let items = [];
      if (setup && setup.answers && setup.answers[kid]) {
        const a = setup.answers[kid];
        items = a.source === "default" ? (kn && kn.default) || [] : a.value || [];
      } else if (kn) items = kn.default || [];
      (items || []).forEach((it) => {
        if (it && it.id) add(it.id, it.label || it.id);
      });
    }
    if (!out.length) add("none", "None");
    return out;
  }

  function terrainTileTypes() {
    const beh = behaviourById("terrain");
    const kn = beh && (beh.knobs || []).find((k) => k.id === "tile_types");
    if (!kn) return [];
    if (state.project && window.ProjectStore) {
      const setup = ProjectStore.listSetups(state.project).find((s) => s.behaviourId === "terrain");
      if (setup && setup.answers && setup.answers.tile_types) {
        const a = setup.answers.tile_types;
        return a.source === "default" ? kn.default || [] : a.value || [];
      }
    }
    return kn.default || [];
  }

  function renderTileLegend() {
    const root = $("#tile-legend-list");
    if (!root) return;
    const items = terrainTileTypes();
    root.innerHTML =
      items
        .map(
          (it) => `<div class="list-row" role="listitem">
            <span class="name-btn" style="font-weight:750">${escapeHtml(it.label || it.id)}</span>
            <span class="hint">${escapeHtml(it.id)}${it.open === false ? " · blocked" : " · open"}${it.kills_on_landing ? " · kills" : ""}${it.slows_move ? " · slow" : ""}${it.trips ? " · trips" : ""}</span>
          </div>`
        )
        .join("") || `<p class="hint">No tile types in catalogue.</p>`;
  }

  function knobCardHtml(knob, question, val, grey, reason, optDisabled, showWas, inactive) {
    const tag = knobStatusTag(knob);
    const was = showWas && val === knob.default ? wasHint(knob) : "";
    const reasonHtml = reason ? `<div class="knob-reason">${escapeHtml(reason)}</div>` : "";
    const disabledAttr = grey ? "disabled" : "";
    const proposed = new Set((knob.proposed_options || []).map(String));
    let control = "";
    if (knob.type === "slider") {
      const min = knob.min != null ? knob.min : 0;
      const max = knob.max != null ? knob.max : 10;
      const step = S.interimStep(knob);
      const readout = formatValue(knob, val);
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was} <span class="val" data-readout="${escapeHtml(knob.id)}">${escapeHtml(readout)}</span></div>
        <input class="slider" type="range" min="${min}" max="${max}" step="${step}" value="${escapeHtml(val)}" data-knob="${escapeHtml(knob.id)}" ${disabledAttr} aria-label="${escapeHtml(knob.label)}" />`;
    } else if (knob.type === "toggle") {
      const on = !!val;
      const propOn = proposed.has("true") || proposed.has("True");
      const propOff = proposed.has("false") || proposed.has("False");
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was}</div>
        <div class="toggle-row" role="group" aria-label="${escapeHtml(knob.label)}">
          <button type="button" class="toggle" data-knob-toggle="${escapeHtml(knob.id)}" data-value="true" aria-pressed="${on}" ${disabledAttr}>On${propOn ? ' <span class="tag-new-opt">new option</span>' : ""}</button>
          <button type="button" class="toggle" data-knob-toggle="${escapeHtml(knob.id)}" data-value="false" aria-pressed="${!on}" ${disabledAttr}>Off${propOff ? ' <span class="tag-new-opt">new option</span>' : ""}</button>
        </div>`;
    } else if (knob.type === "picker") {
      const opts = knob.options || [];
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was}</div>
        <div class="picker-grid" role="group" aria-label="${escapeHtml(knob.label)}">
          ${opts
            .map((opt) => {
              const value = opt && typeof opt === "object" ? opt.value : opt;
              const label = opt && typeof opt === "object" ? opt.label : humanize(opt);
              const pressed = String(val) === String(value);
              const od = optDisabled && optDisabled[String(value)];
              const neu = proposed.has(String(value));
              return `<button type="button" class="toggle" data-knob-pick="${escapeHtml(knob.id)}" data-value="${escapeHtml(value)}" aria-pressed="${pressed}" ${grey || od ? "disabled" : ""}>${escapeHtml(label)}${neu ? ' <span class="tag-new-opt">new option</span>' : ""}</button>`;
            })
            .join("")}
        </div>`;
    } else if (knob.type === "list") {
      const items = Array.isArray(val) ? val : [];
      const max = knob.max_items != null ? knob.max_items : knob.max;
      const min = knob.min_items;
      const hard = !!knob.max_items_hard;
      const over = max != null && items.length > max;
      const under = min != null && items.length < min;
      const canAdd = !(hard && max != null && items.length >= max) && !grey;
      const reserved = knob.reserved_ids || [];
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was}</div>
        <div class="list-editor" data-list-knob="${escapeHtml(knob.id)}">
          ${items
            .map((item, idx) => {
              const label = item.label || item.id || "Item";
              const isReserved = reserved.indexOf(item.id) >= 0;
              const colourField = knob.item && knob.item.colour;
              const colour = item.colour || (colourField && colourField.default) || "#badcff";
              return `<div class="list-item-card" data-list-idx="${idx}">
                <div class="list-item-top">
                  <button type="button" class="btn btn-ghost" data-list-up="${idx}" ${idx === 0 || grey ? "disabled" : ""} aria-label="Move up">↑</button>
                  <button type="button" class="btn btn-ghost" data-list-down="${idx}" ${idx >= items.length - 1 || grey ? "disabled" : ""} aria-label="Move down">↓</button>
                  <span class="name" style="flex:1;font-weight:700">${escapeHtml(label)}${isReserved ? " · built-in" : ""}</span>
                  <button type="button" class="btn btn-ghost" data-list-remove="${idx}" ${grey || isReserved ? "disabled" : ""} aria-label="Remove">Remove</button>
                </div>
                <p class="hint" style="margin:4px 0 0">${escapeHtml(item.id || "")}${item.style ? " · " + escapeHtml(item.style) : ""}${over && max != null && idx >= max ? " · over cap (kept)" : ""}</p>
                ${
                  colourField
                    ? `<div class="list-item-colour">
                        <input type="color" data-list-colour="${idx}" value="${escapeHtml(colour)}" ${grey ? "disabled" : ""} aria-label="Colour for ${escapeHtml(label)}" />
                        <input type="text" data-list-colour-text="${idx}" value="${escapeHtml(colour)}" ${grey ? "disabled" : ""} aria-label="Colour hex" />
                      </div>`
                    : ""
                }
              </div>`;
            })
            .join("") || `<p class="hint">No items yet.</p>`}
          ${over ? `<div class="list-cap-warn" role="status">Over the soft max (${items.length}/${max}). Extras stay — first ${max} used. Never blocks.</div>` : ""}
          ${under ? `<div class="list-cap-warn" role="status">Under the minimum (${items.length}/${min}). Runtime will pad from defaults.</div>` : ""}
          <button type="button" class="btn btn-primary" data-list-add="${escapeHtml(knob.id)}" style="width:100%;margin-top:8px" ${!canAdd ? "disabled" : ""}>Add item${max != null ? " (" + items.length + "/" + max + (hard ? " hard" : " soft") + ")" : (min != null ? " (min " + min + ")" : "")}</button>
        </div>`;
    } else if (knob.type === "ref") {
      const choices = refChoices(knob);
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was}</div>
        <div class="picker-grid" role="group" aria-label="${escapeHtml(knob.label)}">
          ${choices
            .map((c) => {
              const pressed = String(val) === String(c.value);
              return `<button type="button" class="toggle" data-knob-pick="${escapeHtml(knob.id)}" data-value="${escapeHtml(c.value)}" aria-pressed="${pressed}" ${grey ? "disabled" : ""}>${escapeHtml(c.label)}</button>`;
            })
            .join("")}
        </div>
        ${
          knob.id === "effect"
            ? `<button type="button" class="btn btn-ghost" data-open-effect-designer style="width:100%;margin-top:8px" ${grey ? "disabled" : ""}>Open Effect Designer</button>
               <p class="hint">Effect Designer comes later — placeholder only.</p>`
            : ""
        }`;
    } else if (knob.type === "colour") {
      control = `<div class="knob-label">${escapeHtml(knob.label)}${tag} ${was}</div>
        <div class="colour-custom">
          <input type="color" data-knob-colour="${escapeHtml(knob.id)}" value="${escapeHtml(val || "#ffffff")}" ${disabledAttr} aria-label="${escapeHtml(knob.label)}" />
          <input type="text" data-knob-colour-text="${escapeHtml(knob.id)}" value="${escapeHtml(val || "")}" ${disabledAttr} aria-label="${escapeHtml(knob.label)} hex" />
        </div>`;
    }
    return `<div class="knob-card ${grey ? "disabled" : ""} ${inactive ? "inactive" : ""}" data-knob-card="${escapeHtml(knob.id)}">
      <h2>${escapeHtml(question)}</h2>
      ${control}
      ${reasonHtml}
    </div>`;
  }

  function bindKnobControls(root, onSet) {
    root.querySelectorAll("input[data-knob]").forEach((input) => {
      input.addEventListener("input", () => {
        const id = input.getAttribute("data-knob");
        const kn = findKnobAnywhere(id);
        const step = kn ? S.interimStep(kn) : 1;
        const n = Number(input.value);
        const ro = root.querySelector(`[data-readout="${id}"]`);
        if (ro) ro.textContent = kn ? formatValue(kn, n) : String(n);
      });
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-knob");
        onSet(id, Number(input.value));
      });
    });
    root.querySelectorAll("[data-knob-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const id = btn.getAttribute("data-knob-toggle");
        onSet(id, btn.getAttribute("data-value") === "true");
      });
    });
    root.querySelectorAll("[data-knob-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const id = btn.getAttribute("data-knob-pick");
        onSet(id, btn.getAttribute("data-value"));
      });
    });
    root.querySelectorAll("[data-knob-colour]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-knob-colour");
        onSet(id, input.value);
      });
    });
    root.querySelectorAll("[data-knob-colour-text]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-knob-colour-text");
        onSet(id, input.value);
      });
    });
    root.querySelectorAll("[data-list-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kid = btn.getAttribute("data-list-add");
        const knob = findKnobAnywhere(kid);
        const eff = S.effective(state.draftDoc.answers[kid], knob);
        const items = Array.isArray(eff) ? eff.map((x) => Object.assign({}, x)) : [];
        const max = knob && (knob.max_items != null ? knob.max_items : knob.max);
        if (knob && knob.max_items_hard && max != null && items.length >= max) return;
        const n = items.length + 1;
        let id = "item-" + n;
        while (items.some((it) => it.id === id) || (knob && (knob.reserved_ids || []).indexOf(id) >= 0)) {
          id = "item-" + (n + Math.floor(Math.random() * 1000));
        }
        const item = { id, label: "Item " + n };
        if (knob && knob.item && knob.item.style) item.style = knob.item.style.default || "unit-action-menu";
        if (knob && knob.item && knob.item.colour) item.colour = knob.item.colour.default || "#badcff";
        items.push(item);
        onSet(kid, items);
      });
    });
    root.querySelectorAll("[data-list-colour]").forEach((input) => {
      input.addEventListener("change", () => {
        const listRoot = input.closest("[data-list-knob]");
        const kid = listRoot && listRoot.getAttribute("data-list-knob");
        const idx = Number(input.getAttribute("data-list-colour"));
        const knob = findKnobAnywhere(kid);
        const eff = S.effective(state.draftDoc.answers[kid], knob);
        const items = Array.isArray(eff) ? eff.map((x) => Object.assign({}, x)) : [];
        if (!items[idx]) return;
        items[idx].colour = input.value;
        onSet(kid, items);
      });
    });
    root.querySelectorAll("[data-list-colour-text]").forEach((input) => {
      input.addEventListener("change", () => {
        const listRoot = input.closest("[data-list-knob]");
        const kid = listRoot && listRoot.getAttribute("data-list-knob");
        const idx = Number(input.getAttribute("data-list-colour-text"));
        const knob = findKnobAnywhere(kid);
        const eff = S.effective(state.draftDoc.answers[kid], knob);
        const items = Array.isArray(eff) ? eff.map((x) => Object.assign({}, x)) : [];
        if (!items[idx]) return;
        items[idx].colour = input.value;
        onSet(kid, items);
      });
    });
    root.querySelectorAll("[data-list-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const listRoot = btn.closest("[data-list-knob]");
        const kid = listRoot && listRoot.getAttribute("data-list-knob");
        const idx = Number(btn.getAttribute("data-list-remove"));
        const knob = findKnobAnywhere(kid);
        const eff = S.effective(state.draftDoc.answers[kid], knob);
        const items = Array.isArray(eff) ? eff.map((x) => Object.assign({}, x)) : [];
        items.splice(idx, 1);
        onSet(kid, items);
      });
    });
    root.querySelectorAll("[data-list-up], [data-list-down]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const listRoot = btn.closest("[data-list-knob]");
        const kid = listRoot && listRoot.getAttribute("data-list-knob");
        const up = btn.hasAttribute("data-list-up");
        const idx = Number(btn.getAttribute(up ? "data-list-up" : "data-list-down"));
        const knob = findKnobAnywhere(kid);
        const eff = S.effective(state.draftDoc.answers[kid], knob);
        const items = Array.isArray(eff) ? eff.map((x) => Object.assign({}, x)) : [];
        const j = up ? idx - 1 : idx + 1;
        if (j < 0 || j >= items.length) return;
        const tmp = items[idx];
        items[idx] = items[j];
        items[j] = tmp;
        onSet(kid, items);
      });
    });
    root.querySelectorAll("[data-open-effect-designer]").forEach((btn) => {
      btn.addEventListener("click", () => toast("Effect Designer coming later"));
    });
  }

  function findKnobAnywhere(id) {
    for (const b of state.catalogue) {
      const k = (b.knobs || []).find((x) => x.id === id);
      if (k) return k;
    }
    return null;
  }

  function saveNewSetup() {
    const doc = state.draftDoc;
    const u = selectedUnit();
    if (!doc || !u) return;
    const b = behaviourById(doc.behaviourId);
    // ensure bans/invalidation applied once more
    const loaded = S.loadSetup(doc, state.catalogueDoc);
    const finalDoc = loaded.doc;
    const entry = {
      id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      doc: finalDoc,
      notices: loaded.notices || [],
    };
    u.setups = u.setups || [];
    u.setups.push(entry);
    state.activeSetupId = entry.id;
    state.draftDoc = null;
    state.lastNotices = entry.notices;
    toast("Behaviour saved");
    show("behaviour-summary");
  }

  /* ---------- summary / question ---------- */

  function renderSummary() {
    const entry = activeSetupEntry();
    const u = selectedUnit();
    const doc = entry && entry.doc;
    const b = doc ? behaviourById(doc.behaviourId) : null;
    const title = $("#summary-title");
    const sub = $("#summary-sub");
    const rows = $("#summary-rows");
    const banner = $("#summary-flag-banner");
    const defaultsBanner = $("#defaults-banner");
    const fixBtn = $("#btn-review-flagged");
    const undoBtn = $("#btn-undo");
    const redoBtn = $("#btn-redo");
    if (!doc || !b || !rows) {
      if (title) title.textContent = "Summary";
      if (rows) rows.innerHTML = `<p class="hint">No setup selected.</p>`;
      return;
    }
    if (title) title.textContent = b.name;
    if (sub) sub.innerHTML = `For <strong>${escapeHtml(u.name)}</strong>. Tap any row to change just that answer.`;

    if (undoBtn) undoBtn.disabled = !S.canUndo(doc);
    if (redoBtn) redoBtn.disabled = !S.canRedo(doc);

    const missing = S.listMissing(doc, Object.assign({}, state.catalogueDoc, {_presentationStyle: presentationStyle()}));
    const reask = S.listNeedsReask(doc, state.catalogueDoc);
    // unique by knobId
    const flagIds = new Set([...missing, ...reask].map((x) => x.knobId));
    if (banner) {
      if (flagIds.size) {
        banner.hidden = false;
        banner.textContent = `${flagIds.size} answer${flagIds.size > 1 ? "s" : ""} need a new look — everything else stays.`;
      } else banner.hidden = true;
    }
    if (fixBtn) {
      fixBtn.hidden = !flagIds.size;
      fixBtn.textContent = flagIds.size ? `Review ${flagIds.size}` : "Review";
    }

    // Defaults moved banner from notices / default_history
    const movedLines = [];
    (b.knobs || []).forEach((k) => {
      const prev = S.previousDefault(k);
      if (prev !== null && prev !== k.default) {
        movedLines.push(`${k.label} ${formatValue(k, prev)} → ${formatValue(k, k.default)}`);
      }
    });
    if (defaultsBanner) {
      if (movedLines.length) {
        defaultsBanner.hidden = false;
        defaultsBanner.textContent = "Defaults moved: " + movedLines.slice(0, 4).join(", ") + (movedLines.length > 4 ? "…" : "");
      } else {
        defaultsBanner.hidden = true;
      }
    }

    const view = S.viewSetup(doc, state.catalogueDoc);
    const missingById = Object.fromEntries(missing.map((m) => [m.knobId, m]));
    let html = "";
    view.forEach((step) => {
      step.rows.forEach((row) => {
        const knob = b.knobs.find((k) => k.id === row.knobId);
        const miss = missingById[row.knobId];
        const needs = row.needsReask;
        const flagged = !!(miss || (needs && needs.reason));
        const sourceChip =
          row.source === "user"
            ? `<span class="source-chip user">yours</span>`
            : row.source === "preset"
            ? `<span class="source-chip preset">preset</span>`
            : "";
        const was = row.isDefault && knob ? wasHint(knob) : "";
        const note =
          miss && miss.note
            ? `<span class="missing-note">${escapeHtml(reasonPlain(miss.reason, miss.note))}</span>`
            : flagged && needs
            ? `<span class="missing-note">${escapeHtml(reasonPlain(needs.reason, needs.note))}</span>`
            : "";
        const qLabel = step.rows.length > 1 ? row.label : step.question;
        html += `<button type="button" class="summary-row ${flagged ? "flagged" : ""} ${miss ? "missing" : ""}" data-edit-knob="${escapeHtml(row.knobId)}" aria-label="Edit ${escapeHtml(qLabel)}">
          <span class="q">${escapeHtml(qLabel)}</span>
          <span class="a">${escapeHtml(formatValue(knob, row.effective))} ${was}</span>
          <span class="meta-row">
            ${row.isDefault ? '<span class="tag-default">default</span>' : ""}
            ${sourceChip}
            ${flagged ? '<span class="tag-flag">Needs a new answer</span>' : ""}
            ${knobStatusTag(knob || {})}
          </span>
          ${note}
        </button>`;
      });
    });
    rows.innerHTML = html || `<p class="hint">No knobs.</p>`;
    rows.querySelectorAll("[data-edit-knob]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.editKnobId = btn.getAttribute("data-edit-knob");
        state.reaskQueue = [];
        const a = doc.answers[state.editKnobId];
        const kn = b.knobs.find((k) => k.id === state.editKnobId);
        state.draftQuestionValue = a ? S.effective(a, kn) : kn && kn.default;
        show("behaviour-question");
      });
    });
  }

  function renderQuestion() {
    const doc = activeDoc();
    const b = doc ? behaviourById(doc.behaviourId) : null;
    const knob = b && b.knobs.find((k) => k.id === state.editKnobId);
    const root = $("#question-root");
    const title = $("#question-title");
    const flag = $("#question-flag");
    const keepBtn = $("#btn-keep-answer");
    if (!doc || !b || !knob || !root) {
      if (root) root.innerHTML = `<p class="hint">Nothing to edit.</p>`;
      return;
    }
    const q = questionForKnob(b, knob.id);
    if (title) title.textContent = q;
    const a = doc.answers[knob.id];
    const needs = a && a.needsReask;
    if (flag) {
      flag.hidden = !needs;
      if (needs) flag.textContent = reasonPlain(needs.reason, needs.note || knob.no_default_reason);
    }
    if (keepBtn) {
      keepBtn.hidden = !(needs && (needs.reason === "offStep" || needs.reason === "outOfRange"));
    }
    if (state.draftQuestionValue === null || state.draftQuestionValue === undefined) {
      state.draftQuestionValue = S.effective(a, knob);
    }
    const draft = { [knob.id]: state.draftQuestionValue };
    root.innerHTML = knobCardHtml(knob, q, state.draftQuestionValue, false, null, {}, true);
    bindKnobControls(root, (id, value) => {
      state.draftQuestionValue = value;
      draft[id] = value;
      // live readout only; don't commit until Save
      const kn = knob;
      const ro = root.querySelector(`[data-readout="${id}"]`);
      if (ro && kn && kn.type === "slider") ro.textContent = formatValue(kn, value);
      // re-render pressed states for toggles/pickers
      if (kn.type !== "slider") renderQuestion();
    });
  }

  function saveQuestionEdit() {
    const doc = activeDoc();
    const b = doc ? behaviourById(doc.behaviourId) : null;
    const knob = b && b.knobs.find((k) => k.id === state.editKnobId);
    if (!doc || !knob) return;
    const a = doc.answers[knob.id];
    let res;
    if (a && a.needsReask) {
      res = S.resolveReask(doc, knob.id, state.draftQuestionValue, state.catalogueDoc);
    } else {
      res = S.editAnswer(doc, knob.id, state.draftQuestionValue, doc.rev, state.catalogueDoc);
    }
    if (res.error) {
      if (res.error.nearest != null) {
        toast("Off-step — nearest " + res.error.nearest);
        state.draftQuestionValue = res.error.nearest;
        renderQuestion();
        return;
      }
      toast((res.error && res.error.message) || "Can't save that");
      return;
    }
    persistActiveDoc(res.doc);
    if (state.reaskQueue.length) {
      const next = state.reaskQueue.shift();
      if (next) {
        state.editKnobId = next;
        const kn = b.knobs.find((k) => k.id === next);
        const ans = res.doc.answers[next];
        state.draftQuestionValue = ans ? S.effective(ans, kn) : kn.default;
        toast("Saved — next flagged answer");
        show("behaviour-question");
        return;
      }
    }
    state.draftQuestionValue = null;
    toast("Answer updated");
    show("behaviour-summary");
  }

  function resetKnobToDefault() {
    const doc = activeDoc();
    const b = doc ? behaviourById(doc.behaviourId) : null;
    const knob = b && b.knobs.find((k) => k.id === state.editKnobId);
    if (!knob) return;
    if (knob.default == null) {
      toast("No default for this one");
      return;
    }
    state.draftQuestionValue = knob.default;
    renderQuestion();
    toast("Reset to default (not saved yet)");
  }

  function keepCurrentAnswer() {
    // resolve reask by re-submitting current stored value if valid, else nearest
    const doc = activeDoc();
    const b = doc ? behaviourById(doc.behaviourId) : null;
    const knob = b && b.knobs.find((k) => k.id === state.editKnobId);
    if (!doc || !knob) return;
    const a = doc.answers[knob.id];
    let v = a && "value" in a ? a.value : knob.default;
    const res = S.resolveReask(doc, knob.id, v, state.catalogueDoc);
    if (res.error && res.error.nearest != null) {
      const snap = S.resolveReask(doc, knob.id, res.error.nearest, state.catalogueDoc);
      if (snap.doc) {
        persistActiveDoc(snap.doc);
        toast("Snapped to nearest step");
        show("behaviour-summary");
        return;
      }
    }
    if (res.doc) {
      persistActiveDoc(res.doc);
      toast("Kept");
      show("behaviour-summary");
    } else toast("Can't keep that value");
  }

  function undoLast() {
    const doc = activeDoc();
    if (!doc) return;
    const res = S.undo(doc);
    if (res.error) {
      toast("Nothing to undo");
      return;
    }
    persistActiveDoc(res.doc);
    toast("Undone");
    show("behaviour-summary");
  }

  function redoLast() {
    const doc = activeDoc();
    if (!doc) return;
    const res = S.redo(doc);
    if (res.error) {
      toast("Nothing to redo");
      return;
    }
    persistActiveDoc(res.doc);
    toast("Redone");
    show("behaviour-summary");
  }

  function startFixFlagged() {
    const doc = activeDoc();
    if (!doc) return;
    const missing = S.listMissing(doc, Object.assign({}, state.catalogueDoc, {_presentationStyle: presentationStyle()}));
    const reask = S.listNeedsReask(doc, state.catalogueDoc);
    const ids = [...missing, ...reask].map((x) => x.knobId);
    const uniq = [...new Set(ids)];
    if (!uniq.length) return;
    state.reaskQueue = uniq.slice(1);
    state.editKnobId = uniq[0];
    const b = behaviourById(doc.behaviourId);
    const kn = b.knobs.find((k) => k.id === uniq[0]);
    const a = doc.answers[uniq[0]];
    state.draftQuestionValue = a ? S.effective(a, kn) : kn.default;
    show("behaviour-question");
  }

  /* ---------- duplicate / presets ---------- */

  function renderDuplicate() {
    const root = $("#dup-unit-list");
    if (!root) return;
    root.innerHTML = state.units
      .map(
        (u) =>
          `<button type="button" class="beh-row" data-dup-unit="${u.id}" aria-label="Copy onto ${escapeHtml(u.name)}">
            <span class="name">${escapeHtml(u.name)}</span>
            <span class="sub">${(u.setups || []).length} behaviour${(u.setups || []).length === 1 ? "" : "s"}</span>
          </button>`
      )
      .join("");
    root.querySelectorAll("[data-dup-unit]").forEach((btn) => {
      btn.addEventListener("click", () => duplicateSetupTo(Number(btn.getAttribute("data-dup-unit"))));
    });
  }

  function duplicateSetupTo(unitId) {
    const doc = activeDoc();
    const target = state.units.find((u) => u.id === unitId);
    if (!doc || !target) return;
    const res = S.duplicate(doc, (doc.name || "Setup") + " copy");
    if (!res.doc) {
      toast("Duplicate failed");
      return;
    }
    const entry = { id: "s" + Date.now().toString(36), doc: res.doc, notices: [] };
    target.setups = target.setups || [];
    target.setups.push(entry);
    state.selectedUnitId = unitId;
    state.activeSetupId = entry.id;
    toast("Copied onto " + target.name);
    show("behaviour-summary");
  }

  function duplicateSameUnit() {
    const u = selectedUnit();
    if (!u) return;
    duplicateSetupTo(u.id);
  }

  function renderSavePreset() {
    const name = $("#preset-name");
    const doc = activeDoc();
    const b = doc && behaviourById(doc.behaviourId);
    if (name && b && !name.value) name.value = b.name + " preset";
  }

  function confirmSavePreset() {
    const doc = activeDoc();
    if (!doc) return;
    const name = ($("#preset-name") && $("#preset-name").value.trim()) || "Preset";
    const res = S.savePreset(doc, name, null);
    if (res.error) {
      toast("Couldn't save preset");
      return;
    }
    toast("Preset saved");
    show("behaviour-summary");
  }

  function renderUsePreset() {
    const root = $("#preset-pick-list");
    if (!root) return;
    const all = [];
    state.catalogue.forEach((b) => {
      S.listPresets(b.id).forEach((p) => all.push(p));
    });
    if (!all.length) {
      root.innerHTML = `<p class="hint">No presets yet. Save one from a behaviour summary.</p>`;
      return;
    }
    root.innerHTML = all
      .map(
        (p) => `<button type="button" class="beh-row" data-preset="${escapeHtml(p.id)}" aria-label="${escapeHtml(p.name)}">
          <span class="name">${escapeHtml(p.name)}</span>
          <span class="sub">${escapeHtml(p.behaviourId)} · rev ${p.rev || 1}</span>
        </button>`
      )
      .join("");
    root.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.getAttribute("data-preset")));
    });
  }

  function applyPreset(presetId) {
    const preset = S.getPreset(presetId);
    if (!preset) {
      toast("Preset missing");
      return;
    }
    const u = selectedUnit();
    if (!u) return;
    // create new setup from behaviour then apply preset
    const created = S.createSetup(preset.behaviourId, state.catalogueDoc, preset.name);
    if (!created.doc) {
      toast("Can't apply");
      return;
    }
    const applied = S.applyPreset(created.doc, preset, "replace", state.catalogueDoc);
    if (!applied.doc) {
      toast("Apply failed");
      return;
    }
    const entry = { id: "s" + Date.now().toString(36), doc: applied.doc, notices: applied.notices || [] };
    u.setups.push(entry);
    state.activeSetupId = entry.id;
    state.selectedBehaviourId = preset.behaviourId;
    toast("Preset applied");
    show("behaviour-summary");
  }

  function renderUpdatePreset() {
    const root = $("#preset-diff-list");
    const doc = activeDoc();
    if (!root || !doc || !state.pendingPresetId) {
      if (root) root.innerHTML = `<p class="hint">No preset selected.</p>`;
      return;
    }
    const preset = S.getPreset(state.pendingPresetId);
    const diff = S.diffPreset(doc, preset, state.catalogueDoc);
    root.innerHTML = (diff.rows || [])
      .map((r) => {
        return `<label class="summary-row" style="display:flex;gap:10px;align-items:flex-start">
          <input type="checkbox" data-diff-knob="${escapeHtml(r.knobId)}" ${r.changed ? "checked" : ""} style="margin-top:6px;width:20px;height:20px" />
          <span style="flex:1">
            <span class="q">${escapeHtml(r.label || r.knobId)}</span>
            <span class="a">${escapeHtml(String(r.current))} → ${escapeHtml(String(r.incoming))}</span>
          </span>
        </label>`;
      })
      .join("") || `<p class="hint">No differences.</p>`;
  }

  function applyPresetDiff() {
    const doc = activeDoc();
    const preset = S.getPreset(state.pendingPresetId);
    if (!doc || !preset) return;
    const ids = $$("[data-diff-knob]:checked").map((el) => el.getAttribute("data-diff-knob"));
    const res = S.updateFromPreset(doc, preset, ids, state.catalogueDoc);
    if (res.doc) {
      persistActiveDoc(res.doc);
      toast("Updated from preset");
      show("behaviour-summary");
    } else toast("Update failed");
  }

  /* ---------- unit editor / list / grid ---------- */

  function renderUnitEditor() {
    const u = selectedUnit();
    const name = $("#editor-unit-name");
    const list = $("#editor-setups");
    if (name) name.textContent = u ? u.name : "Unit";
    if (!list) return;
    if (!u || !(u.setups || []).length) {
      list.innerHTML = `<p class="hint">No behaviours yet. Add one below.</p>`;
    } else {
      list.innerHTML = u.setups
        .map((s) => {
          const b = behaviourById(s.doc.behaviourId);
          const ready = S.readiness(s.doc, Object.assign({}, state.catalogueDoc, {_presentationStyle: presentationStyle()}));
          const flag = ready.playable ? "" : `<span class="tag-flag">${ready.missing.length} missing</span>`;
          return `<button type="button" class="beh-row" data-open-setup="${escapeHtml(s.id)}" aria-label="Edit ${escapeHtml(b ? b.name : s.doc.behaviourId)}">
            <span class="name">${escapeHtml(b ? b.name : s.doc.behaviourId)}</span>
            <span class="sub">${escapeHtml((b && b.summary) || "")}</span>
            ${flag}
          </button>`;
        })
        .join("");
      list.querySelectorAll("[data-open-setup]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.activeSetupId = btn.getAttribute("data-open-setup");
          const entry = activeSetupEntry();
          if (entry) {
            const loaded = S.loadSetup(entry.doc, state.catalogueDoc);
            entry.doc = loaded.doc;
            entry.notices = loaded.notices;
            state.lastNotices = loaded.notices;
          }
          show("behaviour-summary");
        });
      });
    }
    $("#btn-plate-style")?.addEventListener(
      "click",
      () => {
        openBehaviour("stat-plates");
      },
      { once: true }
    );
  }

  function renderUnitList() {
    const root = $("#unit-list-root");
    if (!root) return;
    root.innerHTML = state.units
      .map(
        (u) => `<button type="button" class="beh-row" data-sel-unit="${u.id}" aria-label="${escapeHtml(u.name)}">
          <span class="name">${escapeHtml(u.name)}</span>
          <span class="sub">(${u.x},${u.y}) · HP ${u.hp} · ${(u.setups || []).length} behaviours</span>
        </button>`
      )
      .join("");
    root.querySelectorAll("[data-sel-unit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedUnitId = Number(btn.getAttribute("data-sel-unit"));
        show("unit-editor");
      });
    });
  }

  function renderUpload() {
    const img = $("#sprite-preview");
    const label = $("#sprite-name");
    if (label) label.textContent = state.spriteName || "No sprite yet";
    if (img) {
      if (state.spriteUrl) {
        img.src = state.spriteUrl;
        img.hidden = false;
      } else img.hidden = true;
    }
    renderSpriteSlicePanel();
  }

  function checkHtml(level, html) {
    const ic = { ok: "✓", warn: "!", err: "✕", info: "i" }[level] || "i";
    return '<div class="check ' + level + '"><span class="ic" aria-hidden="true">' + ic + '</span><span>' + html + "</span></div>";
  }

  function syncSliceSteppers() {
    const sl = state.spriteSlice;
    if (!sl) return;
    const tileEl = $("#slice-tile-val");
    if (tileEl) tileEl.textContent = sl.tile + " px";
    $$("[data-slice-tile]").forEach((b) => {
      b.setAttribute("aria-pressed", String(Number(b.getAttribute("data-slice-tile")) === sl.tile));
    });
    const colsN = $("#slice-cols-num");
    const rowsN = $("#slice-rows-num");
    const gridV = $("#slice-grid-val");
    if (colsN) colsN.textContent = String(sl.cols);
    if (rowsN) rowsN.textContent = String(sl.rows);
    if (gridV) gridV.textContent = sl.cols + " × " + sl.rows + " · " + sl.tile + " px";
  }

  function runAutoSlice() {
    const sl = state.spriteSlice;
    if (!sl || !sl.srcCanvas || !window.SpriteSlice) return null;
    const T = sl.mode === "sprite" && sl.fw ? sl.fw : sl.tile;
    let result = null;
    try {
      result = SpriteSlice.autoSlice(sl.srcCanvas, T);
    } catch (e) {
      return null;
    }
    if (sl.mode === "sprite" && sl.fw && sl.fh) {
      sl.cols = Math.max(1, Math.floor(sl.srcCanvas.width / sl.fw));
      sl.rows = Math.max(1, Math.floor(sl.srcCanvas.height / sl.fh));
    } else {
      sl.cols = result.cols;
      sl.rows = result.rows;
    }
    sl.result = result;
    return result;
  }

  function adjustSliceGrid(dim, delta) {
    const sl = state.spriteSlice;
    if (!sl || !sl.srcCanvas) return;
    const w = sl.srcCanvas.width;
    const h = sl.srcCanvas.height;
    let cols = sl.cols;
    let rows = sl.rows;
    if (dim === "cols") cols = Math.max(1, cols + delta);
    else rows = Math.max(1, rows + delta);
    // Prefer tile that divides both axes for the requested grid
    const tx = Math.floor(w / cols);
    const ty = Math.floor(h / rows);
    let tile = Math.min(tx, ty);
    // Snap to common sizes when close
    const commons = [16, 24, 32, 48, 64];
    const near = commons.find((c) => Math.abs(c - tile) <= 2 && w % c === 0 && h % c === 0);
    if (near) tile = near;
    if (tile < 8) tile = 8;
    // If requested cols don't fit exactly, keep floor
    sl.tile = tile;
    sl.cols = Math.max(1, Math.floor(w / tile));
    sl.rows = Math.max(1, Math.floor(h / tile));
    renderSpriteSlicePanel();
  }


  function workingSpriteCanvas() {
    const sl = state.spriteSlice;
    if (!sl || !sl.originalCanvas) return null;
    return SpriteSlice.applyOps(sl.originalCanvas, sl.ops || []);
  }

  function syncWorkingFromOps() {
    const sl = state.spriteSlice;
    if (!sl) return;
    sl.srcCanvas = workingSpriteCanvas();
    const T = sl.tile || state.tileSize || 32;
    if (sl.mode === "sprite" && sl.fw && sl.fh) {
      sl.cols = Math.max(1, Math.floor(sl.srcCanvas.width / sl.fw));
      sl.rows = Math.max(1, Math.floor(sl.srcCanvas.height / sl.fh));
    } else {
      sl.cols = Math.max(1, Math.floor(sl.srcCanvas.width / T));
      sl.rows = Math.max(1, Math.floor(sl.srcCanvas.height / T));
    }
  }

  function renderSpriteSlicePanel() {
    const panel = $("#sprite-slice-panel");
    if (!panel) return;
    const sl = state.spriteSlice;
    if (!sl || !sl.originalCanvas) {
      panel.hidden = true;
      renderArtAssetList();
      return;
    }
    panel.hidden = false;
    syncWorkingFromOps();
    const result = runAutoSlice();
    syncSliceSteppers();

    const checks = $("#slice-checks");
    const stats = $("#slice-stats");
    const tsStage = $("#slice-ts-stage");
    const srcStage = $("#slice-src-stage");
    const orig = $("#slice-orig-line");
    const accept = $("#btn-slice-accept");
    const fixRow = $("#slice-fix-row");
    const fixLog = $("#slice-fixlog");

    // Fix buttons
    if (fixRow) {
      const w = sl.srcCanvas.width, h = sl.srcCanvas.height;
      const T = sl.tile || state.tileSize || 32;
      const fw = sl.fw || T, fh = sl.fh || T;
      const fits = w % fw === 0 && h % fh === 0;
      const wide = sl.mode === "sprite" && fw > T;
      const a = SpriteSlice.alphaStats(sl.srcCanvas);
      const bits = [];
      if (!fits) {
        bits.push(
          '<button type="button" class="btn btn-ghost" data-sp-fix="crop">Crop<small>→ ' +
            Math.floor(w / fw) * fw +
            " × " +
            Math.floor(h / fh) * fh +
            "</small></button>"
        );
        bits.push(
          '<button type="button" class="btn btn-ghost" data-sp-fix="pad">Pad<small>→ ' +
            Math.ceil(w / fw) * fw +
            " × " +
            Math.ceil(h / fh) * fh +
            "</small></button>"
        );
      }
      if (wide) {
        bits.push(
          '<button type="button" class="btn btn-ghost" data-sp-fix="narrow">Crop to one tile wide<small>middle ' +
            T +
            " px of each frame</small></button>"
        );
      }
      if (!a.clear) {
        bits.push(
          '<button type="button" class="btn btn-ghost" data-sp-fix="key">Make the corner colour see-through</button>'
        );
      }
      fixRow.hidden = bits.length === 0;
      fixRow.innerHTML = bits.join("");
      fixRow.querySelectorAll("[data-sp-fix]").forEach((btn) => {
        btn.addEventListener("click", () => applySpriteFix(btn.getAttribute("data-sp-fix")));
      });
    }
    if (fixLog) {
      const ops = (sl.ops || []).filter((o) => o.op !== "slice" && o.op !== "dedupe");
      fixLog.innerHTML = ops.length
        ? '<div class="fix-log-card"><p class="spec-title" style="margin:0 0 4px">Fix steps · saved with the new copy</p><div class="fl-ops">' +
          ops
            .map(function (o, i) {
              return SpriteSlice.opsStepHtml(o, i);
            })
            .join("") +
          '</div><p class="orig-line">Original kept (not exported). Re-fix any time from the art list.</p></div>'
        : "";
    }

    // Clip names for sprite sheets
    const clipsField = $("#slice-clips-field");
    const clipsRoot = $("#slice-clips");
    if (clipsField && clipsRoot) {
      const showClips = sl.mode === "sprite" && sl.rows >= 1;
      clipsField.hidden = !showClips;
      if (showClips) {
        sl.clipNames = SpriteSlice.clipNames(sl.rows, sl.clipNames);
        const val = $("#slice-clips-val");
        if (val) val.textContent = sl.rows === 4 ? "one per row" : sl.rows === 1 ? "one row" : sl.rows + " rows";
        clipsRoot.innerHTML = sl.clipNames
          .map(function (n, i) {
            return (
              '<label class="clip-in"><span>Row ' +
              (i + 1) +
              '</span><input type="text" value="' +
              String(n).replace(/"/g, "&quot;") +
              '" maxlength="32" data-clip="' +
              i +
              '" aria-label="Name for row ' +
              (i + 1) +
              '" /></label>'
            );
          })
          .join("");
        clipsRoot.querySelectorAll("[data-clip]").forEach((inp) => {
          inp.addEventListener("input", () => {
            sl.clipNames = SpriteSlice.clipNames(sl.rows, sl.clipNames);
            sl.clipNames[Number(inp.getAttribute("data-clip"))] = inp.value;
          });
        });
        clipsField.querySelectorAll("[data-clip-preset]").forEach((btn) => {
          btn.onclick = () => {
            const kind = btn.getAttribute("data-clip-preset");
            sl.clipNames = SpriteSlice.clipPresetNames(kind, sl.rows);
            clipsField.querySelectorAll("[data-clip-preset]").forEach((b) => {
              b.setAttribute("aria-pressed", String(b === btn));
            });
            renderSpriteSlicePanel();
            toast(kind.charAt(0).toUpperCase() + kind.slice(1) + " names applied");
          };
        });
      }
    }

    if (!result) {
      if (checks) checks.innerHTML = checkHtml("err", "<strong>Can't slice.</strong> Pick a smaller tile size.");
      if (accept) accept.disabled = true;
      renderArtAssetList();
      return;
    }
    const bits = [];
    if (result.notWholeTiles) {
      bits.push(
        checkHtml(
          "warn",
          "<strong>Not whole tiles:</strong> cropped to " +
            result.cropped.width +
            " × " +
            result.cropped.height +
            " px for this slice. Original stays untouched."
        )
      );
    } else {
      bits.push(checkHtml("ok", "Sheet splits into whole " + result.tileSize + " px tiles."));
    }
    bits.push(
      checkHtml(
        result.unique > 256 ? "warn" : "ok",
        result.unique > 256
          ? "<strong>" + result.unique + " different tiles</strong>: few repeats — more like a painted image."
          : "<strong>" + result.unique + " unique tiles</strong>. Exact pixel matches only; nothing similar is merged."
      )
    );
    if (checks) checks.innerHTML = bits.join("");
    if (stats) {
      stats.hidden = false;
      stats.innerHTML =
        "<div><b>" +
        result.cells.toLocaleString("en-GB") +
        "</b><span>cells (" +
        result.cols +
        " × " +
        result.rows +
        ")</span></div><div><b>" +
        result.unique +
        "</b><span>unique tiles</span></div><div><b>" +
        result.repeatsRemoved +
        "</b><span>repeats removed</span></div>";
    }
    if (tsStage) {
      tsStage.innerHTML = "";
      const ts = SpriteSlice.draw(result.tileset, result.tileset.width, result.tileset.height);
      const pz = SpriteSlice.showCanvas(ts, 320, 180);
      tsStage.appendChild(ts);
      const cap = $("#slice-ts-cap");
      if (cap) cap.textContent = result.tileset.width + " × " + result.tileset.height + " · " + pz.label;
    }
    if (srcStage) {
      srcStage.innerHTML = "";
      // Post-fix working image (already cropped/keyed); grid overlays it exactly
      const post = sl.srcCanvas || result.cropped;
      const pv = SpriteSlice.draw(post, post.width, post.height);
      const pz = SpriteSlice.showCanvas(pv, 320, 220);
      const wrap = document.createElement("div");
      wrap.className = "slice-overlay-wrap";
      wrap.style.width = pv.style.width;
      wrap.style.height = pv.style.height;
      wrap.appendChild(pv);
      const overlay = document.createElement("div");
      overlay.className = "slice-grid-overlay";
      overlay.setAttribute("aria-hidden", "true");
      const T = result.tileSize;
      const cols = Math.max(1, Math.floor(post.width / T));
      const rows = Math.max(1, Math.floor(post.height / T));
      // Only draw lines that fall on the post-fix image (0 … cols/rows inclusive)
      for (let i = 0; i <= cols; i++) {
        const v = document.createElement("span");
        v.className = "sg-v";
        if (i === cols) {
          v.style.right = "0";
          v.style.left = "auto";
        } else {
          v.style.left = (i / cols) * 100 + "%";
        }
        overlay.appendChild(v);
      }
      for (let j = 0; j <= rows; j++) {
        const h = document.createElement("span");
        h.className = "sg-h";
        if (j === rows) {
          h.style.bottom = "0";
          h.style.top = "auto";
        } else {
          h.style.top = (j / rows) * 100 + "%";
        }
        overlay.appendChild(h);
      }
      wrap.appendChild(overlay);
      srcStage.appendChild(wrap);
      const cap = $("#slice-src-cap");
      if (cap) cap.textContent = pz.label;
    }
    if (orig) {
      const hasFixOps = (sl.ops || []).some((o) => o.op !== "slice" && o.op !== "dedupe");
      // Keep "Original kept" only inside the Fix steps card when fixes exist
      if (hasFixOps) {
        orig.hidden = true;
      } else {
        orig.hidden = false;
        orig.textContent =
          "Original kept (not exported) · " +
          (sl.name || "upload") +
          " · " +
          sl.originalCanvas.width +
          " × " +
          sl.originalCanvas.height +
          " px";
      }
    }
    if (accept) accept.disabled = result.cols < 1 || result.rows < 1;
    renderArtAssetList();
  }

  function applySpriteFix(kind) {
    const sl = state.spriteSlice;
    if (!sl || !sl.srcCanvas) return;
    const T = sl.tile || state.tileSize || 32;
    const w = sl.srcCanvas.width, h = sl.srcCanvas.height;
    // Tileset crop/pad follows the chosen tile size; sprites keep frame size
    const fw = sl.mode === "sprite" ? sl.fw || T : T;
    const fh = sl.mode === "sprite" ? sl.fh || T : T;
    sl.ops = sl.ops || [];
    if (kind === "crop") {
      const nw = Math.floor(w / fw) * fw, nh = Math.floor(h / fh) * fh;
      if (nw < 1 || nh < 1) return toast("Nothing left to crop");
      sl.ops.push({ op: "crop", x: 0, y: 0, w: nw, h: nh });
      toast("Cropped to " + nw + " × " + nh);
    } else if (kind === "pad") {
      const nw = Math.ceil(w / fw) * fw, nh = Math.ceil(h / fh) * fh;
      sl.ops.push({ op: "pad", left: 0, top: 0, right: nw - w, bottom: nh - h, fill: "transparent" });
      toast("Padded to " + nw + " × " + nh);
    } else if (kind === "key") {
      const colour = SpriteSlice.cornerColourHex(sl.srcCanvas);
      sl.ops.push({ op: "colourKey", colour: colour });
      toast("Corner colour is now see-through");
    } else if (kind === "narrow") {
      const off = Math.floor((fw - T) / 2);
      sl.ops.push({
        op: "cropFrames",
        frame: { w: fw, h: fh },
        rect: { x: off, y: 0, w: T, h: fh },
      });
      sl.fw = T;
      toast("Each frame cropped to " + T + " px wide");
    }
    renderSpriteSlicePanel();
  }

  function acceptSpriteSlice() {
    const sl = state.spriteSlice;
    if (!sl || !sl.result || !state.project) {
      toast("Nothing to add yet");
      return;
    }
    const result = sl.result;
    if (!state.project.assets) state.project.assets = {};
    const srcId = "src-" + Date.now().toString(36);
    const outId = (sl.mode === "sprite" ? "sp-" : "ts-") + Date.now().toString(36);
    // Keep original canvas in memory map for Re-fix
    if (!state._assetCanvases) state._assetCanvases = {};
    state._assetCanvases[srcId] = sl.originalCanvas;
    state._assetCanvases[outId] = result.tileset;
    const fixOps = (sl.ops || []).slice();
    const allOps = fixOps.concat(result.ops || []);
    state.project.assets[srcId] = {
      name: sl.name || "upload",
      kind: "source",
      role: "source",
      w: sl.originalCanvas.width,
      h: sl.originalCanvas.height,
      source: "upload",
    };
    state.project.assets[outId] = {
      name: (sl.name || "tiles").replace(/\\.\\w+$/, "") + (sl.mode === "sprite" ? " (sprite)" : " (sliced)"),
      kind: sl.mode === "sprite" ? "sprite" : "tileset",
      w: result.tileset.width,
      h: result.tileset.height,
      source: "upload",
      derivedFrom: { assetId: srcId, ops: allOps },
      tileSize: result.tileSize,
      unique: result.unique,
      repeatsRemoved: result.repeatsRemoved,
      clips: sl.mode === "sprite" ? SpriteSlice.clipNames(sl.rows, sl.clipNames) : undefined,
      fw: sl.fw,
      fh: sl.fh,
    };
    sl.acceptedId = outId;
    sl.sourceId = srcId;
    if (typeof persistProject === "function") persistProject();
    toast(
      "Sliced set added · " +
        result.unique +
        " unique · " +
        result.repeatsRemoved +
        " repeats removed · original kept"
    );
    renderArtAssetList();
  }

  function renderArtAssetList() {
    const box = $("#art-asset-list");
    const rows = $("#art-asset-rows");
    if (!box || !rows || !state.project) return;
    const assets = state.project.assets || {};
    const visible = Object.keys(assets).filter((id) => assets[id] && assets[id].role !== "source");
    box.hidden = visible.length === 0;
    rows.innerHTML = visible
      .map(function (id) {
        const a = assets[id];
        const thumb = state._assetCanvases && state._assetCanvases[id]
          ? state._assetCanvases[id].toDataURL()
          : "";
        const fix = a.derivedFrom ? SpriteSlice.opsText(a.derivedFrom.ops) : "";
        const clips = a.clips && a.clips.length ? " · clips: " + a.clips.join(", ") : "";
        return (
          '<div class="list-item"><div class="asset-row">' +
          (thumb
            ? '<img class="thumb" src="' + thumb + '" alt="" />'
            : '<span class="thumb" aria-hidden="true"></span>') +
          '<div class="meta"><span class="name">' +
          (a.name || id) +
          '</span><span class="sub">' +
          (a.kind || "art") +
          " · " +
          (a.w || "?") +
          " × " +
          (a.h || "?") +
          clips +
          "</span>" +
          (fix ? '<span class="sub fix-log">Fixed: ' + fix + "</span>" : "") +
          "</div>" +
          (a.derivedFrom
            ? '<button type="button" class="toggle" data-refix="' + id + '" aria-label="Re-fix">Re-fix</button>'
            : "") +
          "</div>" +
          (a.derivedFrom
            ? '<p class="orig-line">Original kept (not exported)</p>'
            : "") +
          "</div>"
        );
      })
      .join("");
    rows.querySelectorAll("[data-refix]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.refixId = btn.getAttribute("data-refix");
        state.refixDraft = null;
        show("refix");
      });
    });
  }

  function renderRefix() {
    const body = $("#rf-body");
    const apply = $("#rf-apply");
    if (!body || !state.project) return;
    const a = state.project.assets && state.project.assets[state.refixId];
    if (!a || !a.derivedFrom) {
      body.innerHTML = '<p class="hint">Nothing to re-fix.</p>';
      if (apply) apply.disabled = true;
      return;
    }
    const srcMeta = state.project.assets[a.derivedFrom.assetId];
    const srcCanvas = state._assetCanvases && state._assetCanvases[a.derivedFrom.assetId];
    if (!srcCanvas) {
      body.innerHTML = '<p class="hint">Original pixels are not in memory for this session.</p>';
      if (apply) apply.disabled = true;
      return;
    }
    const T = state.tileSize || a.tileSize || 32;
    const draft = state.refixDraft || {
      op: (a.derivedFrom.ops.find((o) => o.op === "crop" || o.op === "pad") || { op: "crop" }).op,
      anchor: 4,
    };
    state.refixDraft = draft;
    const sw = srcCanvas.width, sh = srcCanvas.height;
    const cw = Math.floor(sw / T) * T, ch = Math.floor(sh / T) * T;
    const pw = Math.ceil(sw / T) * T, ph = Math.ceil(sh / T) * T;
    const ax = draft.anchor % 3, ay = Math.floor(draft.anchor / 3);
    let ops;
    if (draft.op === "crop") {
      ops = [
        {
          op: "crop",
          x: Math.round((sw - cw) * ax / 2),
          y: Math.round((sh - ch) * ay / 2),
          w: cw,
          h: ch,
        },
      ];
    } else {
      const left = Math.round((pw - sw) * ax / 2);
      const top = Math.round((ph - sh) * ay / 2);
      ops = [
        {
          op: "pad",
          left: left,
          top: top,
          right: pw - sw - left,
          bottom: ph - sh - top,
          fill: "transparent",
        },
      ];
    }
    // Keep non crop/pad ops from previous (colourKey, cropFrames, slice, dedupe) after the new size fix
    const rest = (a.derivedFrom.ops || []).filter((o) => o.op !== "crop" && o.op !== "pad");
    const nextOps = ops.concat(rest);
    const before = SpriteSlice.opsText(a.derivedFrom.ops);
    const after = SpriteSlice.opsText(nextOps);
    const same = before === after;
    const preview = SpriteSlice.applyOps(srcCanvas, ops);
    body.innerHTML =
      '<div class="list-item"><div class="asset-row"><div class="meta"><span class="name">' +
      (a.name || state.refixId) +
      '</span><span class="sub">now ' +
      a.w +
      " × " +
      a.h +
      " · fixed: " +
      before +
      '</span></div></div><p class="orig-line">Original kept (not exported) · ' +
      ((srcMeta && srcMeta.name) || "source") +
      " · " +
      sw +
      " × " +
      sh +
      "</p></div>" +
      checkHtml("info", "Re-fix starts again from your <strong>original</strong> file, so nothing gets worse each time.") +
      '<div class="field"><label>Fix <span class="val">' +
      (draft.op === "crop" ? "Crop" : "Pad") +
      '</span></label><div class="fix-row two" role="group" aria-label="Fix">' +
      '<button type="button" class="btn btn-ghost" data-rf-op="crop" aria-pressed="' +
      (draft.op === "crop") +
      '">Crop<small>→ ' +
      cw +
      " × " +
      ch +
      "</small></button>" +
      '<button type="button" class="btn btn-ghost" data-rf-op="pad" aria-pressed="' +
      (draft.op === "pad") +
      '">Pad<small>→ ' +
      pw +
      " × " +
      ph +
      "</small></button></div>" +
      '<div class="opt-line"><div class="anchor-grid" role="group" aria-label="Anchor">' +
      ["↖", "↑", "↗", "←", "•", "→", "↙", "↓", "↘"]
        .map(function (sym, i) {
          return (
            '<button type="button" data-rf-anchor="' +
            i +
            '" aria-pressed="' +
            (i === draft.anchor) +
            '" aria-label="Anchor ' +
            i +
            '">' +
            sym +
            "</button>"
          );
        })
        .join("") +
      '</div></div></div>' +
      '<div class="result-card"><div class="rc-row"><span>Before</span><strong>' +
      before +
      '</strong></div><div class="rc-row"><span>After</span><strong>' +
      after +
      '</strong></div><div class="rc-row"><span>Undo</span><strong>One step puts it all back</strong></div></div>' +
      '<div class="art-box"><div class="cap"><span>New result</span><span id="rf-z"></span></div><div class="stage checker" id="rf-stage"></div></div>';
    const stage = $("#rf-stage");
    if (stage) {
      stage.innerHTML = "";
      const pz = SpriteSlice.showCanvas(preview, 330, 240);
      stage.appendChild(preview);
      const z = $("#rf-z");
      if (z) z.textContent = preview.width + " × " + preview.height + " · " + pz.label;
    }
    body.querySelectorAll("[data-rf-op]").forEach((b) => {
      b.addEventListener("click", () => {
        state.refixDraft.op = b.getAttribute("data-rf-op");
        renderRefix();
      });
    });
    body.querySelectorAll("[data-rf-anchor]").forEach((b) => {
      b.addEventListener("click", () => {
        state.refixDraft.anchor = Number(b.getAttribute("data-rf-anchor"));
        renderRefix();
      });
    });
    if (apply) {
      apply.disabled = same;
      apply.onclick = () => {
        // One undo step: snapshot previous derivedFrom + canvas
        if (!state.paintHistory) state.paintHistory = [];
        const prev = {
          kind: "refix",
          id: state.refixId,
          ops: (a.derivedFrom.ops || []).slice(),
          w: a.w,
          h: a.h,
          canvas: state._assetCanvases[state.refixId],
        };
        state.paintHistory.push([prev]);
        const finalCanvas = SpriteSlice.applyOps(srcCanvas, nextOps);
        a.derivedFrom.ops = nextOps;
        a.w = finalCanvas.width;
        a.h = finalCanvas.height;
        state._assetCanvases[state.refixId] = finalCanvas;
        if (typeof persistProject === "function") persistProject();
        toast("Re-fixed. One undo step puts it all back.");
        show("sprite-upload");
        renderArtAssetList();
        updateStageUndoBtn();
      };
    }
  }

  function pushPaintStroke(entries) {
    if (!entries || !entries.length) return;
    state.paintHistory = state.paintHistory || [];
    state.paintHistory.push(entries);
    updateStageUndoBtn();
  }

  function undoPaintStroke() {
    const stroke = (state.paintHistory || []).pop();
    if (!stroke) {
      toast("Nothing to undo");
      updateStageUndoBtn();
      return;
    }
    // reverse apply
    for (let i = stroke.length - 1; i >= 0; i--) {
      const ent = stroke[i];
      if (ent.kind === "edge") {
        // toggle edge back
        if (state.project && window.ProjectStore) {
          const st = ProjectStore.getStage(state.project, state.currentStageId);
          if (st && st.mapRef) {
            ProjectStore.toggleMapEdge(state.project, st.mapRef, { c: ent.c, r: ent.r, side: ent.side });
          }
        }
      } else if (ent.kind === "object") {
        const st = ProjectStore.getStage(state.project, state.currentStageId);
        if (st && st.mapRef) {
          if (ent.action === "added" && ent.objectId) {
            // remove by scanning at stored id
            const objs = ProjectStore.listMapObjects(state.project, st.mapRef) || [];
            const hit = objs.find((o) => o.id === ent.objectId);
            if (hit) ProjectStore.removeMapObjectAt(state.project, st.mapRef, hit.at.c, hit.at.r);
          } else if (ent.action === "removed" && ent.object) {
            ProjectStore.addMapObject(state.project, st.mapRef, ent.object);
          }
        }
      } else if (ent.kind === "terrain") {
        const stg = ProjectStore.getStage(state.project, state.currentStageId);
        if (stg && stg.mapRef) {
          const map = ProjectStore.getMap(state.project, stg.mapRef);
          if (map && map.logic && Array.isArray(map.logic.terrain) && ent.index >= 0 && ent.index < map.logic.terrain.length) {
            map.logic.terrain[ent.index] = ent.prev;
            ProjectStore.saveMap(state.project, map);
          }
        }
      } else if (ent.kind === "live" && typeof ent.undo === "function") {
        ent.undo(); // r65: tap-menu actions (place, move, delete, role) are one step each
      } else if (ent.kind === "refix") {
        const a = state.project.assets[ent.id];
        if (a && a.derivedFrom) {
          a.derivedFrom.ops = ent.ops;
          a.w = ent.w;
          a.h = ent.h;
          if (ent.canvas) state._assetCanvases[ent.id] = ent.canvas;
        }
        renderArtAssetList();
      }
    }
    if (typeof persistProject === "function") persistProject();
    renderGrid();
    renderMinimap();
    updateStageUndoBtn();
    toast("Undone");
  }

  function updateStageUndoBtn() {
    const btn = $("#btn-stage-undo");
    if (btn) btn.disabled = !(state.paintHistory && state.paintHistory.length);
  }


  function setStageSheet(mode) {
    const sheet = $("#stage-sheet");
    if (!sheet) return;
    const panels = {
      paint: "#sheet-paint",
      walls: "#sheet-walls",
      objects: "#sheet-objects",
      units: "#sheet-units",
      unit: "#sheet-unit",
      move: "#sheet-move",
      more: "#sheet-more",
      sound: "#sheet-sound",
    };
    state.stageSheetMode = mode || null;
    const open = !!mode;
    sheet.hidden = !open;
    sheet.dataset.mode = mode || "";
    Object.keys(panels).forEach((k) => {
      const el = document.querySelector(panels[k]);
      if (el) el.hidden = k !== mode;
    });
    // Sync rail pressed for modes that map 1:1
    const railMap = { paint: "rail-paint", walls: "btn-walls", objects: "btn-objects", units: "rail-units", move: "btn-move", more: "rail-more" };
    Object.keys(railMap).forEach((k) => {
      const el = document.getElementById(railMap[k]);
      if (!el) return;
      // Keep tool aria-pressed for active map tools; rail "units/more" follow sheet
      if (k === "paint") {
        const on = state.mapTool === "paint" || state.mapTool === "fill" || mode === "paint";
        el.setAttribute("aria-pressed", on && (mode === "paint" || state.mapTool === "paint" || state.mapTool === "fill") ? "true" : "false");
      } else if (k === "walls") {
        el.setAttribute("aria-pressed", state.mapTool === "walls" ? "true" : "false");
      } else if (k === "objects") {
        el.setAttribute("aria-pressed", state.mapTool === "objects" ? "true" : "false");
      } else if (k === "move") {
        el.setAttribute("aria-pressed", state.mapTool === "move" ? "true" : "false");
      } else {
        el.setAttribute("aria-pressed", mode === k ? "true" : "false");
      }
    });
    // Measure sheet for fab offset
    const wrap = document.querySelector(".stage-wrap-lean");
    if (wrap) {
      wrap.classList.toggle("is-sheet-open", open);
      requestAnimationFrame(() => {
        const h = open && sheet ? sheet.getBoundingClientRect().height : 0;
        wrap.style.setProperty("--sheet-h", Math.round(h) + "px");
        const sheetUndo = document.getElementById("btn-sheet-undo");
        const fab = document.getElementById("btn-stage-undo");
        if (sheetUndo) {
          sheetUndo.hidden = !open;
          if (fab) sheetUndo.disabled = fab.disabled;
        }
      });
    }
    if (mode === "unit") {
      const u = selectedUnit();
      const title = $("#sheet-unit-title");
      if (title) title.textContent = u ? u.name : "Unit";
    }
    if (mode === "paint") {
      const pp = $("#paint-prefs");
      if (pp) pp.hidden = !(state.mapTool === "paint" || state.mapTool === "fill");
    }
  }

  function closeStageSheet() {
    setStageSheet(null);
  }

  function syncRailFromTool() {
    const t = state.mapTool;
    if (t === "paint" || t === "fill") setStageSheet("paint");
    else if (t === "walls") setStageSheet("walls");
    else if (t === "objects") setStageSheet("objects");
    else if (t === "move") setStageSheet("move");
    else if (state.stageSheetMode === "paint" || state.stageSheetMode === "walls" || state.stageSheetMode === "objects" || state.stageSheetMode === "move") {
      // tool turned off — close tool sheet unless units/more/unit
      closeStageSheet();
    }
  }

  function renderMinimap() {
    const mm = $("#stage-minimap");
    const cv = $("#minimap-canvas");
    const rect = $("#minimap-rect");
    const scroll = $("#stage-scroll");
    const chip = $("#btn-minimap-chip");
    if (!mm || !cv || !scroll) return;
    const big =
      state.mapW * (state.tileSize || 32) * state.stageZoom > scroll.clientWidth + 8 ||
      state.mapH * (state.tileSize || 32) * state.stageZoom > scroll.clientHeight + 8 ||
      state.mapW > 12 ||
      state.mapH > 12;
    const needed = !(!big && state.stageZoom <= 1);
    if (chip) {
      chip.hidden = !needed;
      chip.setAttribute("aria-pressed", state.minimapExpanded ? "true" : "false");
    }
    mm.hidden = !(needed && state.minimapExpanded);
    if (mm.hidden) return;
    const maxW = 96;
    const ppt = Math.max(1, Math.min(4, Math.floor(maxW / Math.max(1, state.mapW))));
    cv.width = state.mapW * ppt;
    cv.height = state.mapH * ppt;
    cv.style.width = cv.width + "px";
    cv.style.height = cv.height + "px";
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    for (let r = 0; r < state.mapH; r++) {
      for (let c = 0; c < state.mapW; c++) {
        ctx.fillStyle = (c + r) % 2 ? "#ffffff" : "#f4f5f7";
        ctx.fillRect(c * ppt, r * ppt, ppt, ppt);
      }
    }
    state.units.forEach((u) => {
      ctx.fillStyle = "#2f5bff";
      ctx.fillRect(u.x * ppt, u.y * ppt, Math.max(2, ppt), Math.max(2, ppt));
    });
    if (rect) {
      const k = ppt / ((state.tileSize || 32) * state.stageZoom);
      const vw = scroll.clientWidth, vh = scroll.clientHeight;
      rect.style.left = 4 + Math.max(0, -(state.stagePanX || 0) * k) + "px";
      rect.style.top = 4 + Math.max(0, -(state.stagePanY || 0) * k) + "px";
      rect.style.width = Math.min(cv.width, vw * k) + "px";
      rect.style.height = Math.min(cv.height, vh * k) + "px";
    }
  }

  function minimapJump(clientX, clientY) {
    const cv = $("#minimap-canvas");
    const scroll = $("#stage-scroll");
    if (!cv || !scroll) return;
    const r = cv.getBoundingClientRect();
    const ppt = cv.width / state.mapW;
    const c = Math.floor((clientX - r.left) / (r.width / state.mapW));
    const rr = Math.floor((clientY - r.top) / (r.height / state.mapH));
    const T = state.tileSize || 32;
    state.stagePanX = scroll.clientWidth / 2 - (c + 0.5) * T * state.stageZoom;
    state.stagePanY = scroll.clientHeight / 2 - (rr + 0.5) * T * state.stageZoom;
    applyStageCamera();
    renderMinimap();
    toast("Jumped");
  }

  function minimapWholeMap() {
    const scroll = $("#stage-scroll");
    if (!scroll) return;
    const T = state.tileSize || 32;
    const fit = Math.min(
      scroll.clientWidth / Math.max(1, state.mapW * T),
      scroll.clientHeight / Math.max(1, state.mapH * T)
    );
    const z = snapZoom(Math.max(0.25, Math.min(6, fit)));
    state.stageZoom = z;
    state.stagePanX = (scroll.clientWidth - state.mapW * T * z) / 2;
    state.stagePanY = (scroll.clientHeight - state.mapH * T * z) / 2;
    applyStageCamera();
    renderMinimap();
    toast("Whole map");
  }

  function minimapJumpToUnits() {
    const scroll = $("#stage-scroll");
    if (!scroll) return;
    if (!state.units || !state.units.length) {
      toast("No units to jump to");
      return;
    }
    let sx = 0, sy = 0;
    state.units.forEach((u) => { sx += u.x; sy += u.y; });
    const cx = sx / state.units.length;
    const cy = sy / state.units.length;
    const T = state.tileSize || 32;
    state.stagePanX = scroll.clientWidth / 2 - (cx + 0.5) * T * state.stageZoom;
    state.stagePanY = scroll.clientHeight / 2 - (cy + 0.5) * T * state.stageZoom;
    applyStageCamera();
    renderMinimap();
    toast("Jump to units");
  }


  function renderTilePreview() {
    const el = $("#tile-preview");
    if (!el) return;
    el.textContent = `${state.tileSize}px · ${state.tileset}`;
  }

  function renderMapPreview() {
    const el = $("#map-preview");
    const build = () => {
      const grid = document.createElement("div");
      grid.className = "preview-grid";
      grid.style.setProperty("--cols", String(state.mapW));
      const maxCells = Math.min(state.mapW * state.mapH, 64 * 48);
      for (let i = 0; i < maxCells; i++) {
        grid.appendChild(document.createElement("span"));
      }
      return grid;
    };
    if (el) {
      el.innerHTML = "";
      el.appendChild(build());
    }
    const strip = $("#wiz-prev-wizard-map");
    if (strip) {
      strip.innerHTML = "";
      const g = build();
      // fit ~96px
      const cell = Math.max(2, Math.floor(88 / Math.max(state.mapW, state.mapH)));
      g.querySelectorAll("span").forEach((sp) => {
        sp.style.width = cell + "px";
      });
      strip.appendChild(g);
      const cap = document.createElement("span");
      cap.style.cssText = "position:absolute;bottom:4px;font-size:0.65rem;font-weight:700;color:var(--muted)";
      // parent needs relative
      strip.style.position = "relative";
      strip.appendChild(document.createTextNode(""));
      const label = document.createElement("div");
      label.style.cssText = "font-size:0.7rem;font-weight:700;margin-top:2px;color:var(--muted)";
      label.textContent = state.mapW + "×" + state.mapH;
      strip.appendChild(label);
    }
  }




  function renderWizardPreviewStrip(screenId) {
    const id = (screenId || "").replace(/^screen-/, "");
    const el = $("#wiz-prev-" + id);
    if (!el) return;
    el.innerHTML = "";
    if (id === "wizard-platform") {
      const map = { mobile: "📱 Phone", pc: "🖥️ PC", both: "Phone + PC" };
      el.textContent = map[state.platform] || "Device";
    } else if (id === "wizard-combat") {
      el.textContent = state.combat === "grid-tactics" ? "Grid\ntactics" : "Combat";
    } else if (id === "wizard-ability-pick") {
      const m = { "all-menu": "Unit\nmenu", "all-cards": "Card\nhand", custom: "Custom" };
      el.textContent = m[state.abilityPick] || "Abilities";
    } else if (id === "wizard-camera") {
      el.textContent = (state.screenFit || "letterbox") + "\nfit";
    } else if (id === "wizard-tiles") {
      el.textContent = (state.tileSize || 32) + " px\n" + (state.tileset || "tiles");
    } else if (id === "wizard-map") {
      renderMapPreview();
      return;
    }
  }

  function openWizardPeek(screenId) {
    const peek = $("#wizard-peek");
    const body = $("#wizard-peek-body");
    if (!peek || !body) return;
    const id = (screenId || "").replace(/^screen-/, "");
    const src = $("#wiz-prev-" + id);
    body.innerHTML = "";
    if (src) body.appendChild(src.cloneNode(true));
    else body.textContent = "Preview";
    peek.hidden = false;
    state.wizardPeekOpen = true;
  }

  function closeWizardPeek() {
    const peek = $("#wizard-peek");
    if (peek) peek.hidden = true;
    state.wizardPeekOpen = false;
  }

  function bindWizardAdvancedScroll() {
    $$(".screen[id^='screen-wizard'] details.advanced").forEach((d) => {
      if (d._advBound) return;
      d._advBound = true;
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        requestAnimationFrame(() => {
          const body = d.closest(".body");
          const bar = d.closest(".screen")?.querySelector(".bottombar");
          const barH = bar ? bar.getBoundingClientRect().height : 72;
          const rect = d.getBoundingClientRect();
          const bodyRect = body ? body.getBoundingClientRect() : null;
          if (!body) {
            d.scrollIntoView({ block: "nearest", behavior: "smooth" });
            return;
          }
          // Scroll so Advanced sits above the thumb bar
          const overflow = rect.bottom - (window.innerHeight - barH - 8);
          if (overflow > 0) body.scrollBy({ top: overflow + 12, behavior: "smooth" });
          else d.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
      });
    });
  }

  function applyStageCamera() {
    const cam = $("#stage-camera");
    const zval = $("#stage-zoom-val");
    const z = snapZoom(state.stageZoom || 1);
    state.stageZoom = z;
    if (zval) {
      zval.textContent = Number.isInteger(z) ? z + "×" : z.toFixed(2).replace(/\.?0+$/, "") + "×";
    }
    if (!cam) return;
    cam.style.transform =
      "translate(" + (state.stagePanX || 0) + "px," + (state.stagePanY || 0) + "px) scale(" + z + ")";
    updateFracZoomChrome();
  }

  function updateFracZoomChrome() {
    const btn = $("#btn-frac-zoom");
    const hint = $("#frac-zoom-hint");
    const advOk = state.project && window.ProjectStore && ProjectStore.effectiveAdvancedRender
      ? ProjectStore.effectiveAdvancedRender(state.project)
      : false;
    const pp = effectivePixelPerfect();
    const fracAllowed = advOk && !pp;
    if (btn) {
      btn.disabled = !advOk;
      btn.classList.toggle("soon-locked", !advOk);
      btn.setAttribute("aria-pressed", fracAllowed ? "true" : "false");
      btn.textContent = fracAllowed ? "½ steps on" : "½ steps";
    }
    if (hint) {
      hint.textContent = !advOk
        ? "½ steps need Advanced render (Settings)"
        : pp
          ? "Pixel-perfect on — whole steps only"
          : "In-between zoom may blur your art";
    }
  }

  function effectivePixelPerfect() {
    if (!state.project || !window.ProjectStore) return true;
    const adv = ProjectStore.effectiveAdvancedRender
      ? ProjectStore.effectiveAdvancedRender(state.project)
      : !!(ProjectStore.manifest(state.project).project.settings || {}).advancedRender;
    if (!adv) return true;
    const cam = ProjectStore.manifest(state.project).project.settings.camera || {};
    return cam.pixelPerfect !== false;
  }

  function snapZoom(z) {
    const pp = effectivePixelPerfect();
    if (pp) return Math.max(1, Math.min(6, Math.round(z)));
    // ¼ steps when Advanced render + pixel-perfect off
    const q = Math.round(z * 4) / 4;
    return Math.max(0.5, Math.min(6, q));
  }

  function setStageZoom(z, cx, cy) {
    const scroll = $("#stage-scroll");
    z = snapZoom(z);
    if (Math.abs(z - state.stageZoom) < 0.001) {
      applyStageCamera();
      return;
    }
    const rect = scroll ? scroll.getBoundingClientRect() : { left: 0, top: 0, width: 390, height: 400 };
    const px = cx == null ? rect.width / 2 : cx;
    const py = cy == null ? rect.height / 2 : cy;
    const wx = (px - (state.stagePanX || 0)) / state.stageZoom;
    const wy = (py - (state.stagePanY || 0)) / state.stageZoom;
    state.stageZoom = z;
    state.stagePanX = px - wx * z;
    state.stagePanY = py - wy * z;
    applyStageCamera();
    renderMinimap();
  }

  function clampStagePan() {
    // Soft clamp: allow free pan; recentre if zoom is 1 and near origin
    if (state.stageZoom === 1 && Math.hypot(state.stagePanX || 0, state.stagePanY || 0) < 8) {
      state.stagePanX = 0;
      state.stagePanY = 0;
    }
    applyStageCamera();
  }


  async function loadStageEditorPrefs() {
    if (!state.project || !window.ProjectStore || !ProjectStore.loadEditorPrefs) return;
    try {
      const prefs = await ProjectStore.loadEditorPrefs();
      const st = ProjectStore.getStage(state.project, state.currentStageId);
      if (!st) return;
      const row = ProjectStore.getMapEditorPrefs(prefs, ProjectStore.manifest(state.project).project.id, st.mapRef);
      state.editorZoom = row.zoom;
      state.editorMinimap = row.minimap;
      state.activeLayer = row.activeLayer;
      state.walkRulesOverlay = !!row.walkRulesOverlay;
      if (state.walkRulesOverlay) state.mapTool = "walls";
      const btn = $("#btn-walls");
      if (btn) btn.setAttribute("aria-pressed", state.mapTool === "walls" ? "true" : "false");
    } catch (e) {}
  }

  function currentMapEdges() {
    if (!state.project || !window.ProjectStore) return [];
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st) return [];
    const map = ProjectStore.getMap(state.project, st.mapRef);
    if (!map || !map.logic || !Array.isArray(map.logic.edges)) return [];
    return map.logic.edges;
  }

  function edgeAt(edges, c, r, side) {
    // Draw only the canonical record once — never both sides of the same wall.
    const mapLike = { cols: state.mapW, rows: state.mapH };
    return edges.some((e) => {
      const canon = ProjectStore.canonicalizeEdge
        ? ProjectStore.canonicalizeEdge(mapLike, e)
        : e;
      return !!(canon && canon.c === c && canon.r === r && canon.side === side);
    });
  }

  function integerZoom() {
    const z = state.editorZoom != null ? state.editorZoom : state.zoom;
    return Math.max(1, Math.round(Number(z) || 1));
  }

  function paintWallEdges(cell, x, y, edges) {
    const map = currentMapDoc();
    const zoom = integerZoom();
    const los = terrainAnswer("wall_blocks_los");
    const shots = terrainAnswer("wall_blocks_shots");
    const losOn = !los || los.value !== false;
    const shotsOn = !shots || shots.value !== false;
    ["n", "e", "s", "w"].forEach((side) => {
      if (!edgeAt(edges, x, y, side)) return;
      const edge = (edges || []).find((e) => {
        const canon = ProjectStore.canonicalizeEdge
          ? ProjectStore.canonicalizeEdge(map || { cols: state.mapW, rows: state.mapH }, e)
          : e;
        return canon && canon.c === x && canon.r === y && canon.side === side;
      }) || { c: x, r: y, side };
      const tsz = state.tileSize || (map && map.tile && map.tile.w) || 64;
      const look = ProjectStore.resolveWallLook
        ? ProjectStore.resolveWallLook(map, edge, tsz)
        : { mode: "line", colour: "#20242C", width: Math.max(1, Math.round(tsz / 16)) };
      const bar = document.createElement("span");
      bar.className = "wall-edge " + side + (look.mode === "invisible" ? " invisible" : "");
      bar.setAttribute("aria-hidden", "true");
      if (look.mode === "line" || look.mode === "invisible") {
        const w = (look.width != null ? look.width : Math.max(1, Math.round((state.tileSize || 64) / 16))) * zoom;
        bar.style.setProperty("--wall-thick", w + "px");
        if (look.colour) bar.style.setProperty("--wall-colour", look.colour);
      } else if (look.mode === "asset") {
        // Centred on the edge; vertical edges imply 90° clockwise in the real renderer.
        const w = Math.max(2, Math.round((state.tileSize || 64) / 16) * zoom);
        bar.classList.add("asset-wall");
        bar.style.setProperty("--wall-thick", w + "px");
        bar.title = "Wall art (centred; vertical edges rotate 90° CW; warn if not one tile wide)";
      }
      if (state.wallHover !== false) {
        const tip = document.createElement("span");
        tip.className = "wall-hover-tip";
        tip.textContent = (losOn ? "Blocks sight" : "Sight passes") + " · " + (shotsOn ? "Blocks shots" : "Shots pass");
        bar.appendChild(tip);
      }
      cell.appendChild(bar);
    });
  }

  function nearestEdgeFromClick(ev, cell) {
    const rect = cell.getBoundingClientRect();
    const ox = (ev.clientX - rect.left) / Math.max(1, rect.width);
    const oy = (ev.clientY - rect.top) / Math.max(1, rect.height);
    const dist = { n: oy, s: 1 - oy, w: ox, e: 1 - ox };
    let best = "n";
    let bestD = dist.n;
    Object.keys(dist).forEach((k) => {
      if (dist[k] < bestD) {
        bestD = dist[k];
        best = k;
      };
    });
    // Only count as edge tap when near the border (cheap heuristic)
    if (bestD > 0.28) return null;
    return best;
  }

  function currentMapObjects() {
    if (!state.project || !window.ProjectStore) return [];
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st || !st.mapRef) return [];
    return ProjectStore.listMapObjects(state.project, st.mapRef) || [];
  }

  function paintGrid(grid) {
    if (!grid) return;
    grid.innerHTML = "";
    grid.style.setProperty("--cols", String(state.mapW));
    grid.style.setProperty("--rows", String(state.mapH));
    grid.setAttribute("aria-label", state.mapW + " by " + state.mapH + " stage grid");
    grid.classList.toggle("wall-hover-on", state.wallHover !== false && state.mapTool === "walls");
    const edges = currentMapEdges();
    const objects = currentMapObjects();
    const showWalls = state.mapTool === "walls" || state.walkRulesOverlay || edges.length > 0;
    // Cells first (floor), then walls, then occupants row-sorted (objects before units at a tie)
    const cells = {};
    for (let y = 0; y < state.mapH; y++) {
      for (let x = 0; x < state.mapW; x++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", "Tile " + x + "," + y);
        const selected = state.selectedCell && state.selectedCell.x === x && state.selectedCell.y === y;
        if (selected) cell.classList.add("selected");
        // Terrain tint for paint/fill feedback
        try {
          const meta = currentMapTerrainMeta();
          if (meta) {
            const tid = terrainTypeAt(meta.map, y * state.mapW + x);
            if (tid && tid !== "floor") cell.classList.add("terrain-" + tid);
            else cell.classList.add("terrain-floor");
          }
        } catch (e) {}
        if (showWalls) paintWallEdges(cell, x, y, edges);
        cell.addEventListener("click", (ev) => {
          // Tap existing wall edge → show rules tip (no hover). Skip toggle so tip is readable.
          if (state.mapTool === "walls" && state.wallHover !== false) {
            const tipBar = ev.target && ev.target.closest ? ev.target.closest(".wall-edge") : null;
            if (tipBar && cell.contains(tipBar)) {
              document.querySelectorAll(".wall-edge.show-tip").forEach((b) => {
                if (b !== tipBar) b.classList.remove("show-tip");
              });
              tipBar.classList.add("show-tip");
              state._longPressHandled = true; // swallow onCell wall toggle
              toast(tipBar.querySelector(".wall-hover-tip")?.textContent || "Wall rules");
            }
          }
          const unit = state.units.find((u) => u.x === x && u.y === y);
          onCell(x, y, unit, cell, ev);
        });
        // Long-press (≥480ms): open unit menu without depending on hover
        let _lpTimer = null;
        const clearLp = () => { if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; } };
        cell.addEventListener("pointerdown", (ev) => {
          if (ev.pointerType === "mouse" && ev.button !== 0) return;
          clearLp();
          const sx = ev.clientX, sy = ev.clientY;
          _lpTimer = setTimeout(() => {
            _lpTimer = null;
            const unit = state.units.find((u) => u.x === x && u.y === y);
            if (unit) {
              state.selectedUnitId = unit.id;
              state._longPressHandled = true;
              renderGrid();
              const fresh = document.querySelector(
                '#stage-grid .cell[data-x="' + x + '"][data-y="' + y + '"]'
              ) || document.querySelector("#stage-grid .cell.selected");
              openUnitMenu(unit, fresh);
              toast("Long-press · unit menu");
            } else if (state.mapTool === "walls" && state.wallHover !== false) {
              state._longPressHandled = true;
              renderGrid();
              const fresh = document.querySelector(
                '#stage-grid .cell[data-x="' + x + '"][data-y="' + y + '"]'
              );
              if (fresh) fresh.querySelectorAll(".wall-edge").forEach((b) => b.classList.add("show-tip"));
              toast("Long-press · wall rules");
            }
          }, 480);
          const move = (e) => {
            if (Math.hypot(e.clientX - sx, e.clientY - sy) > 12) clearLp();
          };
          const up = () => {
            clearLp();
            cell.removeEventListener("pointermove", move);
            cell.removeEventListener("pointerup", up);
            cell.removeEventListener("pointercancel", up);
          };
          cell.addEventListener("pointermove", move);
          cell.addEventListener("pointerup", up);
          cell.addEventListener("pointercancel", up);
        });
        grid.appendChild(cell);
        cells[x + "," + y] = cell;
      }
    }
    // Row-sort occupants: by r, then c; at a tie, object draws before unit
    const occupants = [];
    objects.forEach((o) => {
      if (!o || !o.at) return;
      occupants.push({ kind: "object", r: o.at.r | 0, c: o.at.c | 0, object: o });
    });
    state.units.forEach((u) => {
      occupants.push({ kind: "unit", r: u.y | 0, c: u.x | 0, unit: u });
    });
    occupants.sort((a, b) => (a.r - b.r) || (a.c - b.c) || (a.kind === "object" ? -1 : 1));
    occupants.forEach((occ) => {
      const cell = cells[occ.c + "," + occ.r];
      if (!cell) return;
      if (occ.kind === "object") {
        const o = occ.object;
        const el = document.createElement("span");
        el.className = "map-object tall" + (o.blocks ? " blocks" : "");
        el.dataset.objectId = o.id;
        el.setAttribute("aria-hidden", "true");
        const glyph = document.createElement("span");
        glyph.className = "obj-glyph";
        glyph.textContent = "🌲";
        el.appendChild(glyph);
        cell.appendChild(el);
        cell.classList.add("has-object");
      } else {
        const unit = occ.unit;
        cell.classList.add("has-unit");
        const tok = document.createElement("span");
        tok.className = "unit-token";
        tok.textContent = (unit.name || "?").trim().charAt(0).toUpperCase();
        const side = unit.id === 2 ? "rival" : "player";
        const tint = resolveTeamColour(side);
        tok.style.background = tint;
        // r64: AA letter on any team tint (light tints got white text before)
        { const m = /^#?([0-9a-f]{6})$/i.exec(String(tint || "").trim()); if (m) { const n = parseInt(m[1], 16), f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          const L = 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); tok.style.color = L > 0.179 ? "#12141a" : "#ffffff"; } }
        tok.dataset.team = side;
        cell.appendChild(tok);
        if (unit.id === state.selectedUnitId) cell.classList.add("selected");
      }
    });
    // r65: live view (art tiles, sprites, footprints, grid-lines toggle). View only, same data.
    if (window.StageLive && grid.id === "stage-grid") { try { StageLive.decorate(grid, cells); } catch (e) { console.error(e); } }
  }

  function renderGrid() {
    paintGrid($("#stage-grid"));
    paintGrid($("#stage-grid-place"));
    applyStageCamera();
    renderMinimap();
    updateStageUndoBtn();
  }

  function currentMapTerrainMeta() {
    if (!state.project || !window.ProjectStore) return null;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st || !st.mapRef) return null;
    const map = ProjectStore.getMap(state.project, st.mapRef);
    if (!map) return null;
    map.logic = map.logic || { terrain: [], palette: { "0": "floor" }, edges: [] };
    if (!Array.isArray(map.logic.terrain) || map.logic.terrain.length !== state.mapW * state.mapH) {
      const next = Array(state.mapW * state.mapH).fill(0);
      (map.logic.terrain || []).forEach((v, i) => { if (i < next.length) next[i] = v; });
      map.logic.terrain = next;
    }
    return { st: st, map: map };
  }

  function terrainTypeAt(map, index) {
    const pal = (map.logic && map.logic.palette) || { "0": "floor" };
    const n = map.logic.terrain[index];
    return pal[String(n)] || "floor";
  }

  function paintTerrainCell(x, y, tileTypeId) {
    const meta = currentMapTerrainMeta();
    if (!meta) return false;
    const index = y * state.mapW + x;
    if (index < 0 || index >= meta.map.logic.terrain.length) return false;
    const prev = meta.map.logic.terrain[index];
    ProjectStore.paintLogicTile(state.project, meta.st.mapRef, index, tileTypeId);
    const next = meta.map.logic.terrain[index];
    if (prev === next) return false;
    const ent = { kind: "terrain", index: index, prev: prev, next: next, x: x, y: y };
    if (state.paintStroke) state.paintStroke.push(ent);
    else pushPaintStroke([ent]);
    return true;
  }

  function fillTerrain(x, y, tileTypeId) {
    const meta = currentMapTerrainMeta();
    if (!meta) return 0;
    const map = meta.map;
    const cols = state.mapW, rows = state.mapH;
    const start = y * cols + x;
    const fromType = terrainTypeAt(map, start);
    if (fromType === tileTypeId) return 0;
    const stroke = state.paintStroke || [];
    const wasStroke = !!state.paintStroke;
    if (!wasStroke) state.paintStroke = stroke;
    const seen = new Set();
    const q = [start];
    seen.add(start);
    let n = 0;
    while (q.length) {
      const i = q.shift();
      const cx = i % cols, cy = (i / cols) | 0;
      if (!paintTerrainCell(cx, cy, tileTypeId)) continue;
      n++;
      const neigh = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
      for (let k = 0; k < neigh.length; k++) {
        const nx = neigh[k][0], ny = neigh[k][1];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const ni = ny * cols + nx;
        if (seen.has(ni)) continue;
        if (terrainTypeAt(map, ni) !== fromType) continue;
        seen.add(ni);
        q.push(ni);
      }
    }
    if (!wasStroke) {
      if (stroke.length) pushPaintStroke(stroke);
      state.paintStroke = null;
    }
    return n;
  }

  function onCell(x, y, unit, cellEl, ev) {
    if (state._longPressHandled) {
      state._longPressHandled = false;
      return;
    }
    if (state._paintGestureHandled) {
      state._paintGestureHandled = false;
      return;
    }
    // r65: tap-to-place menus (no rail tool on, not in place mode). Returns true when handled.
    if (window.StageLive && !state.mapTool && !state.placeMode && StageLive.onCell(x, y, unit, cellEl, ev)) return;
    // Architect: tall units may overhang visually, but hit-test is base cell only.
    // Tokens use pointer-events:none; unit is resolved by this cell's (x,y), never overhang.
    // Objects are not UNIT-targetable — cell tap places/removes them in Objects tool only.
    state.selectedCell = { x, y };
    if ((state.mapTool === "paint" || state.mapTool === "fill") && state.project && window.ProjectStore) {
      const typeId = state.paintTileType || "floor";
      if (state.mapTool === "fill") {
        const n = fillTerrain(x, y, typeId);
        persistProject();
        renderGrid();
        if (!state.paintStroke) toast(n ? "Filled " + n + " tiles" : "Nothing to fill");
      } else {
        paintTerrainCell(x, y, typeId);
        persistProject();
        renderGrid();
        if (!state.paintStroke) toast("Painted");
      }
      return;
    }
    if (state.mapTool === "objects" && state.project && window.ProjectStore) {
      const st = ProjectStore.getStage(state.project, state.currentStageId);
      if (!st || !st.mapRef) return;
      const res = ProjectStore.toggleMapObjectAt(state.project, st.mapRef, x, y, {
        assetId: "asset_prop_tree",
        blocks: !!(state.objectDraft && state.objectDraft.blocks),
        blocks_los: state.objectDraft && "blocks_los" in state.objectDraft ? state.objectDraft.blocks_los : null,
        blocks_shots: state.objectDraft && "blocks_shots" in state.objectDraft ? state.objectDraft.blocks_shots : null,
      });
      // ensure a placeholder asset meta so H3 doesn't fire for demos
      const m = ProjectStore.manifest(state.project).project;
      m.assets = m.assets || {};
      if (!m.assets.asset_prop_tree) {
        m.assets.asset_prop_tree = { name: "Tree", kind: "sprite", ext: "png", w: 64, h: 96 };
        state.project.files["assets/asset_prop_tree.png"] = { placeholder: true };
      }
      if (res.action === "added" && res.object) {
        state.selectedObjectId = res.object.id;
        if (state.objectDraft) {
          ProjectStore.updateMapObject(state.project, st.mapRef, res.object.id, {
            blocks: !!state.objectDraft.blocks,
            blocks_los: state.objectDraft.blocks ? state.objectDraft.blocks_los : null,
            blocks_shots: state.objectDraft.blocks ? state.objectDraft.blocks_shots : null,
          });
        }
        const ent = { kind: "object", action: "added", objectId: res.object.id };
        if (state.paintStroke) state.paintStroke.push(ent);
        else pushPaintStroke([ent]);
        if (!state.paintStroke) toast("Object placed (not targetable)");
      } else if (res.action === "removed") {
        state.selectedObjectId = null;
        const ent = { kind: "object", action: "removed", object: res.object };
        if (state.paintStroke) state.paintStroke.push(ent);
        else pushPaintStroke([ent]);
        if (!state.paintStroke) toast("Object removed");
      }
      persistProject();
      renderGrid();
      renderObjectsPrefs();
      return;
    }
    if (state.mapTool === "walls" && state.project && window.ProjectStore) {
      const side = ev ? nearestEdgeFromClick(ev, cellEl) : null;
      if (!side) {
        toast("Tap nearer a tile edge to place a wall");
        return;
      }
      const st = ProjectStore.getStage(state.project, state.currentStageId);
      if (!st || !st.mapRef) return;
      ProjectStore.toggleMapEdge(state.project, st.mapRef, { c: x, r: y, side });
      if (state.paintStroke) {
        state.paintStroke.push({ kind: "edge", c: x, r: y, side: side });
      } else {
        pushPaintStroke([{ kind: "edge", c: x, r: y, side: side }]);
      }
      persistProject();
      renderGrid();
      if (!state.paintStroke) toast("Wall " + side.toUpperCase() + " toggled");
      return;
    }
    if (state.placeMode) {
      if (unit) {
        toast("Tile occupied");
        return;
      }
      const u = {
        id: state.nextId++,
        name: "Unit " + (state.nextId - 1),
        x,
        y,
        hp: 8,
        atk: 1,
        setups: [],
      };
      state.units.push(u);
      state.selectedUnitId = u.id;
      state.placeMode = false;
      toast("Unit placed");
      show("unit-editor");
      return;
    }
    if (unit) {
      state.selectedUnitId = unit.id;
      renderGrid();
      if (!handDocked() || handInMenu() || presentationStyle() !== "all-cards") {
        const cell =
          cellEl ||
          document.querySelector('#stage-grid .cell.selected') ||
          document.querySelector('#stage-grid .cell.has-unit');
        openUnitMenu(unit, cell);
      } else {
        closeUnitMenu();
      }
    } else {
      state.selectedUnitId = null;
      closeUnitMenu();
      // Collapse contextual sheet on empty grid tap when not mid-paint/walls/objects.
      if (!state.mapTool || state.mapTool === "move") {
        closeStageSheet();
      }
      renderGrid();
    }
  }

  /* ---------- preview / render ---------- */

  function renderPreview() {
    const panel = $("#dev-panel");
    const on = state.previewDev;
    if (panel) panel.hidden = !on;
    $("#btn-dev-on")?.setAttribute("aria-pressed", on ? "true" : "false");
    $("#btn-dev-off")?.setAttribute("aria-pressed", on ? "false" : "true");
    $$("[data-stage]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-stage")) === String(state.previewStage) ? "true" : "false");
    });
    const map = { hp: "god-hp", dmg: "god-dmg", mana: "god-mana" };
    Object.keys(map).forEach((k) => {
      const input = $("#" + map[k]);
      const val = $("#" + map[k] + "-val");
      if (input) input.value = state.god[k];
      if (val) val.textContent = String(state.god[k]);
    });
  }


  function renderStageOverlays() {
    const popup = $("#unit-ability-popup");
    const hand = $("#card-hand");
    const backdrop = $("#popup-backdrop");
    const wraps = $$(".stage-wrap");
    const docked = handDocked();
    wraps.forEach((w) => w.classList.toggle("has-card-hand", docked));
    // Always-visible hand only when docked; hand-in-menu keeps hand hidden until Cards is tapped
    if (hand) {
      if (docked) hand.hidden = false;
      else if (!state.handOpenFromMenu) hand.hidden = true;
    }
    const cardsRow = $("#popup-row-cards");
    if (cardsRow) cardsRow.hidden = !handInMenu();
    // Close popup when switching to docked-all-cards (no unit menu)
    if (docked && presentationStyle() === "all-cards" && !handInMenu()) {
      if (popup) popup.hidden = true;
      if (backdrop) backdrop.hidden = true;
      state.unitMenuOpen = false;
    }
  }

  function openUnitMenu(unit, cellEl) {
    const popup = $("#unit-ability-popup");
    const backdrop = $("#popup-backdrop");
    // Editor sheet always shows Sprite/Stats/Behaviour for the selected unit.
    if (unit) {
      state.selectedUnitId = unit.id;
      setStageSheet("unit");
    }
    // All-cards + docked: no unit menu. Custom/menu or hand-in-menu: show menu.
    if (!popup) return;
    if (handDocked() && presentationStyle() === "all-cards") return;
    state.unitMenuOpen = true;
    popup.hidden = false;
    if (backdrop) backdrop.hidden = false;
    const cardsRow = $("#popup-row-cards");
    if (cardsRow) cardsRow.hidden = !handInMenu();
    const title = $("#unit-ability-title");
    if (title) title.textContent = unit ? unit.name : "Unit";
    const wrap = $(".stage-wrap") || document.body;
    const wr = wrap.getBoundingClientRect();
    popup.style.visibility = "hidden";
    popup.style.top = "0px";
    popup.style.left = "0px";
    const ph = popup.offsetHeight || 160;
    const pw = popup.offsetWidth || 180;
    let top = 120, left = 24;
    if (cellEl) {
      const r = cellEl.getBoundingClientRect();
      const below = r.bottom - wr.top + 8;
      const above = r.top - wr.top - ph - 8;
      // Flip up when near the bottom of the stage
      if (below + ph > wr.height - 16 && above > 8) top = above;
      else top = Math.min(below, wr.height - ph - 8);
      left = Math.min(Math.max(8, r.left - wr.left + r.width / 2 - pw / 2), wr.width - pw - 8);
    }
    popup.style.top = Math.max(8, top) + "px";
    popup.style.left = left + "px";
    popup.style.visibility = "visible";
  }

  function closeUnitMenu() {
    state.unitMenuOpen = false;
    const popup = $("#unit-ability-popup");
    const backdrop = $("#popup-backdrop");
    if (popup) popup.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }


  
  function syncUnitsFromProject() {
    if (!state.project || !window.ProjectStore) return;
    const army = ProjectStore.armyDefaults(state.catalogueDoc, state.project);
    ProjectStore.listUnits(state.project).forEach((u) => {
      const shellId = String(u.id).replace(/^shell-/, "");
      let su = state.units.find((x) => String(x.id) === shellId || "shell-" + x.id === u.id);
      const hp = u.stats && u.stats.unit_hp ? u.stats.unit_hp.value : army.unit_hp;
      const atk = u.stats && u.stats.unit_atk ? u.stats.unit_atk.value : army.unit_atk;
      if (su) {
        su.hp = hp;
        su.atk = atk;
        su.name = u.name || su.name;
      }
    });
  }


  function applyEnemyMode(mode) {
    if (!state.project || !state.currentStageId) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st) return;
    const prev = st.enemyPool || { mode: "fixed", entries: [] };
    let pool = ProjectStore.emptyEnemyPool(mode);
    // carry unit ids across modes lightly
    const ids = [];
    if (prev.mode === "fixed") (prev.entries || []).forEach((e) => ids.push(e.unitId));
    if (prev.mode === "weighted") (prev.entries || []).forEach((e) => ids.push(e.unitId));
    if (prev.mode === "waves") (prev.waves || []).forEach((w) => (w.entries || []).forEach((e) => ids.push(e.unitId)));
    if (mode === "fixed") {
      pool.entries = ids.map((id, i) => ({ unitId: id, at: { c: i % state.mapW, r: 0 } }));
    } else if (mode === "weighted") {
      pool.entries = ids.map((id) => ({ unitId: id, weight: 1 }));
      pool.picks = ids.length;
    } else if (mode === "waves") {
      pool.waves = ids.length ? [{ turn: 1, entries: ids.map((id) => ({ unitId: id, count: 1 })) }] : [];
    }
    ProjectStore.setEnemyPool(state.project, state.currentStageId, pool);
    persistProject();
    renderEnemyPool();
    const hint = $("#enemy-mode-hint");
    if (hint) {
      hint.textContent =
        mode === "fixed"
          ? "Fixed: place exact enemies on tiles."
          : mode === "weighted"
            ? "Weighted: pick N enemies by weight at match start."
            : "Waves: enemies arrive on listed turns.";
    }
  }



  function renderEnemyPool() {
    const root = $("#enemy-pool-list");
    const title = $("#enemy-pool-title");
    if (!root || !state.project) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st) {
      root.innerHTML = `<p class="hint">No stage.</p>`;
      return;
    }
    if (title) title.textContent = (st.name || "Stage") + " · Enemy pool";
    const pool = st.enemyPool || { mode: "fixed", entries: [] };
    state.enemyMode = pool.mode || "fixed";
    setPressed("enemy-mode", state.enemyMode);
    const hint = $("#enemy-mode-hint");
    if (hint) {
      hint.textContent =
        state.enemyMode === "fixed"
          ? "Fixed: place exact enemies on tiles."
          : state.enemyMode === "weighted"
            ? "Weighted: pick N enemies by weight at match start."
            : "Waves: enemies arrive on listed turns.";
    }
    const onIds = new Set();
    if (pool.mode === "fixed") (pool.entries || []).forEach((e) => onIds.add(e.unitId));
    else if (pool.mode === "weighted") (pool.entries || []).forEach((e) => onIds.add(e.unitId));
    else if (pool.mode === "waves")
      (pool.waves || []).forEach((w) => (w.entries || []).forEach((e) => onIds.add(e.unitId)));

    const units = ProjectStore.listUnits(state.project);
    root.innerHTML =
      units
        .map((u) => {
          const on = onIds.has(u.id);
          const weight =
            pool.mode === "weighted"
              ? ((pool.entries || []).find((e) => e.unitId === u.id) || {}).weight || 1
              : null;
          return `<div class="list-row" role="listitem">
            <button type="button" class="pool-toggle" data-pool-toggle="${escapeHtml(u.id)}" aria-pressed="${on}" aria-label="${on ? "On" : "Off"}: include ${escapeHtml(u.name)}">
              <span class="knob" aria-hidden="true"></span>
              <span>${on ? "On" : "Off"}</span>
            </button>
            <span class="name-btn" style="font-weight:750">${escapeHtml(u.name)}</span>
            ${
              pool.mode === "weighted" && on
                ? `<label class="hint">w <input type="number" min="1" step="1" value="${weight}" data-pool-weight="${escapeHtml(u.id)}" style="width:3.5rem" /></label>`
                : ""
            }
          </div>`;
        })
        .join("") || `<p class="hint">No units yet.</p>`;

    root.querySelectorAll("[data-pool-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => toggleEnemyUnit(btn.getAttribute("data-pool-toggle")));
    });
    root.querySelectorAll("[data-pool-weight]").forEach((inp) => {
      inp.addEventListener("change", () => {
        const id = inp.getAttribute("data-pool-weight");
        const st2 = ProjectStore.getStage(state.project, state.currentStageId);
        const pool2 = st2.enemyPool;
        const ent = (pool2.entries || []).find((e) => e.unitId === id);
        if (ent) {
          ent.weight = Math.max(1, Number(inp.value) || 1);
          ProjectStore.setEnemyPool(state.project, state.currentStageId, pool2);
          persistProject();
        }
      });
    });
  }

  function toggleEnemyUnit(unitId) {
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    if (!st) return;
    let pool = st.enemyPool || ProjectStore.emptyEnemyPool(state.enemyMode || "fixed");
    if (pool.mode === "fixed") {
      const i = (pool.entries || []).findIndex((e) => e.unitId === unitId);
      if (i >= 0) pool.entries.splice(i, 1);
      else pool.entries.push({ unitId, at: { c: 0, r: 0 } });
    } else if (pool.mode === "weighted") {
      const i = (pool.entries || []).findIndex((e) => e.unitId === unitId);
      if (i >= 0) pool.entries.splice(i, 1);
      else pool.entries.push({ unitId, weight: 1 });
      pool.picks = pool.entries.length;
    } else {
      pool.waves = pool.waves || [];
      if (!pool.waves[0]) pool.waves[0] = { turn: 1, entries: [] };
      const i = pool.waves[0].entries.findIndex((e) => e.unitId === unitId);
      if (i >= 0) pool.waves[0].entries.splice(i, 1);
      else pool.waves[0].entries.push({ unitId, count: 1 });
    }
    ProjectStore.setEnemyPool(state.project, state.currentStageId, pool);
    persistProject();
    renderEnemyPool();
  }

  function renderStageMap() {
    const root = $("#stage-map-list");
    if (!root || !state.project) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    const maps = ProjectStore.listMaps(state.project);
    root.innerHTML = maps
      .map((m) => {
        const on = st && st.mapRef === m.id;
        return `<button type="button" class="beh-row" data-map-pick="${escapeHtml(m.id)}" aria-pressed="${on}">
          <span class="name">${escapeHtml(m.name || m.id)}</span>
          <span class="sub">${m.cols}×${m.rows}${on ? " · in use" : ""}</span>
        </button>`;
      })
      .join("");
    root.querySelectorAll("[data-map-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        ProjectStore.setStageMap(state.project, state.currentStageId, btn.getAttribute("data-map-pick"));
        persistProject();
        syncMapSizeFromStage();
        renderStageMap();
        toast("Map set");
      });
    });
  }

  function applyStageLoadoutMode(mode) {
    if (!state.project || !state.currentStageId) return;
    setPressed("stage-loadout-mode", mode);
    const custom = $("#stage-loadout-custom");
    if (custom) custom.hidden = mode !== "custom";
    if (mode === "project") {
      ProjectStore.setStageLoadout(state.project, state.currentStageId, null);
      persistProject();
    } else {
      const cur = ProjectStore.effectiveLoadout(state.project, state.currentStageId);
      const base = ProjectStore.manifest(state.project).project.loadout;
      ProjectStore.setStageLoadout(state.project, state.currentStageId, {
        roster: (cur.roster || base.roster || []).slice(),
        size: cur.size || base.size || 4,
        required: (cur.required || []).slice(),
      });
      persistProject();
    }
    renderStageLoadout();
  }

  function renderStageLoadout() {
    if (!state.project || !state.currentStageId) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    const mode = st && st.loadout ? "custom" : "project";
    state.stageLoadoutMode = mode;
    setPressed("stage-loadout-mode", mode);
    const custom = $("#stage-loadout-custom");
    if (custom) custom.hidden = mode !== "custom";
    const lo = ProjectStore.effectiveLoadout(state.project, state.currentStageId);
    const slotsEl = $("#stage-loadout-slots");
    if (slotsEl) slotsEl.textContent = `Roster · size ${lo.size} · required ${(lo.required || []).length}`;
    const root = $("#stage-loadout-list");
    if (!root) return;
    const units = ProjectStore.listUnits(state.project);
    const roster = new Set(lo.roster || []);
    root.innerHTML = units
      .map((u) => {
        const on = roster.has(u.id);
        return `<button type="button" class="loadout-card" data-stage-roster="${escapeHtml(u.id)}" aria-pressed="${on}">
          <span class="name">${escapeHtml(u.name)}</span>
          <span class="sub">${on ? "In roster" : "Tap to add"}</span>
        </button>`;
      })
      .join("");
    root.querySelectorAll("[data-stage-roster]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.stageLoadoutMode !== "custom") return;
        const id = btn.getAttribute("data-stage-roster");
        const cur = ProjectStore.effectiveLoadout(state.project, state.currentStageId);
        const roster2 = (cur.roster || []).slice();
        const i = roster2.indexOf(id);
        if (i >= 0) roster2.splice(i, 1);
        else roster2.push(id);
        ProjectStore.setStageLoadout(state.project, state.currentStageId, {
          roster: roster2,
          size: cur.size,
          required: cur.required || [],
        });
        persistProject();
        renderStageLoadout();
      });
    });
  }

  function renderUnitStatsInherit() {
    if (!state.project) return;
    const u = selectedUnit();
    if (!u) return;
    const unitId = "shell-" + u.id;
    const army = ProjectStore.armyDefaults(state.catalogueDoc, state.project);
    const hpR = ProjectStore.resolveUnitStat(state.project, state.catalogueDoc, unitId, "unit_hp", state.currentStageId);
    const atkR = ProjectStore.resolveUnitStat(state.project, state.catalogueDoc, unitId, "unit_atk", state.currentStageId);
    const hpEl = $("#stat-hp");
    const atkEl = $("#stat-atk");
    if (hpEl) {
      hpEl.min = 1; hpEl.max = 21; hpEl.value = hpR.value;
      $("#stat-hp-val").textContent = String(hpR.value);
    }
    if (atkEl) {
      atkEl.min = 0; atkEl.max = 2; atkEl.value = atkR.value;
      $("#stat-atk-val").textContent = String(atkR.value);
    }
    const hpH = $("#stat-hp-inherit");
    const atkH = $("#stat-atk-inherit");
    if (hpH) hpH.textContent = hpR.inherits ? `Inherits army default (${army.unit_hp}).` : `Own value · army was ${army.unit_hp}.`;
    if (atkH) atkH.textContent = atkR.inherits ? `Inherits army default (${army.unit_atk}).` : `Own value · army was ${army.unit_atk}.`;
  }

  function fmtBytes(n) {
    if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + " MB";
    if (n >= 1024) return Math.round(n / 1024) + " KB";
    return n + " B";
  }


  function noteOddAssetSizes() {
    if (!state.project || !window.ProjectStore) return;
    const m = ProjectStore.manifest(state.project);
    const odd = Object.keys(m.project.assets || {}).filter((id) => {
      const meta = m.project.assets[id];
      return meta && meta.role !== "source" && ProjectStore.assetIsOddSize(meta);
    });
    const hint = $("#sprite-name");
    if (hint && odd.length) {
      const meta = m.project.assets[odd[0]];
      hint.dataset.oddInfo = "Odd width or height (" + (meta.w || "?") + "×" + (meta.h || "?") + ") — info only; may blur.";
    }
  }

  function fmtMb(bytes) {
    const mb = (bytes || 0) / (1024 * 1024);
    if (mb >= 10) return mb.toFixed(0) + " MB";
    if (mb >= 0.1) return mb.toFixed(1) + " MB";
    return Math.round((bytes || 0) / 1024) + " KB";
  }

  function renderCreditsUI() {
    if (!state.project || !window.ProjectStore) return;
    const m = ProjectStore.manifest(state.project);
    ProjectStore.ensureRenderFields(m);
    const on = m.project.render.credits !== false;
    const btnOn = $("#btn-credits-on");
    const btnOff = $("#btn-credits-off");
    if (btnOn) btnOn.setAttribute("aria-pressed", on ? "true" : "false");
    if (btnOff) btnOff.setAttribute("aria-pressed", on ? "false" : "true");
    const ta = $("#credits-text");
    if (ta) {
      ta.disabled = !on;
      const body = m.project.render.creditsText != null
        ? m.project.render.creditsText
        : ProjectStore.defaultCreditsText(state.project);
      if (document.activeElement !== ta) ta.value = body;
    }
  }

  function renderTargetLabel(kind) {
    if (kind === "android") return "Android";
    if (kind === "ios") return "iPhone";
    return "PC";
  }

  function syncRenderTargetButtons() {
    const cur = state.renderTarget || "browser";
    $$("#render-target-row [data-render-target]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-render-target") === cur ? "true" : "false");
    });
  }

  function renderBuildSize() {
    if (!state.project) return;
    ProjectStore.recomputeIndex(state.project, state.catalogueDoc);
    const m = ProjectStore.manifest(state.project);
    ProjectStore.ensureRenderFields(m);
    const size = (m.index && m.index.size) || {};
    const bytes = size.totalBytes != null ? size.totalBytes : ProjectStore.estimateSize(state.project);
    const sizeTxt = bytes / (1024 * 1024) >= 0.1
      ? (bytes / (1024 * 1024)).toFixed(1) + " MB"
      : Math.round(bytes / 1024) + " KB";
    const line = $("#build-size-line");
    if (line) line.textContent = "Download size: " + sizeTxt;
    const warn = $("#build-size-warn");
    if (warn) {
      const mb = bytes / (1024 * 1024);
      if (mb >= ProjectStore.BUILD_STRONG_MB) {
        warn.hidden = false;
        warn.textContent = "Strong warning: download is large. You can still build.";
      } else if (mb >= ProjectStore.BUILD_WARN_MB) {
        warn.hidden = false;
        warn.textContent = "Warning: download is getting large. Nothing is blocked.";
      } else {
        warn.hidden = true;
      }
    }
    const targets = $("#build-size-targets");
    if (targets) {
      const tgs = (m.project.render && m.project.render.targets) || ["browser", "android", "ios"];
      targets.textContent = tgs.map((x) => renderTargetLabel(x) + " ~" + sizeTxt).join(" · ");
    }

    const d = size.decoded || {};
    const peakBytes = (d.stagePeak && d.stagePeak.bytes) || (d.residentEstimate && d.residentEstimate.bytes) || 0;
    const totalBytes = d.totalBytes || 0;
    const platform = (m.project.settings && m.project.settings.platform) || "mobile";
    const phone = platform === "mobile" || platform === "both";
    const chunkMb = phone || platform !== "pc"
      ? ProjectStore.CHUNK_CACHE_MB.phone
      : ProjectStore.CHUNK_CACHE_MB.desktop;
    // Use phone cache when platform is mobile/both; desktop when pc
    const chunkCacheMb = platform === "pc" ? ProjectStore.CHUNK_CACHE_MB.desktop : ProjectStore.CHUNK_CACHE_MB.phone;
    const peakMb = peakBytes / (1024 * 1024);
    const totalMb = totalBytes / (1024 * 1024);
    const estMb = peakMb + chunkCacheMb;
    const meters = size.meters || [];
    let level = "ok";
    meters.forEach((row) => {
      if (!row || String(row.key || "").indexOf("decoded.") !== 0) return;
      if (row.level === "strong") level = "strong";
      else if (row.level === "warn" && level !== "strong") level = "warn";
    });
    let soft = 160, strong = 224;
    const keyHint = platform === "pc" ? "web_desktop" : platform === "android" ? "android" : "web_mobile";
    const thr =
      (ProjectStore.DECODED_THRESHOLDS &&
        (ProjectStore.DECODED_THRESHOLDS[keyHint] ||
          ProjectStore.DECODED_THRESHOLDS.ios)) ||
      null;
    if (thr) {
      soft = thr.stage_peak.warn;
      strong = thr.stage_peak.strong;
    }
    // Scale track a little past strong so the strong mark isn't at the end
    const scaleMax = strong * 1.15;
    const card = $("#decoded-meter-card");
    if (card) {
      card.classList.toggle("warn", level === "warn");
      card.classList.toggle("strong", level === "strong");
    }
    const estTxt = estMb >= 10 ? Math.round(estMb) + " MB" : estMb.toFixed(1) + " MB";
    const val = $("#decoded-meter-val");
    if (val) val.textContent = "Memory use (estimate): ~" + estTxt;
    const dec = $("#build-size-decoded");
    if (dec) {
      dec.textContent =
        "Biggest stage " +
        fmtMb(peakBytes) +
        " · whole project " +
        fmtMb(totalBytes);
    }
    const fill = $("#decoded-meter-fill");
    if (fill) {
      const pct = Math.max(0, Math.min(100, (peakMb / scaleMax) * 100));
      fill.style.width = pct + "%";
    }
    const warnPct = Math.max(0, Math.min(100, (soft / scaleMax) * 100));
    const strongPct = Math.max(0, Math.min(100, (strong / scaleMax) * 100));
    const mw = $("#decoded-meter-mark-warn");
    const ms = $("#decoded-meter-mark-strong");
    if (mw) mw.style.left = warnPct + "%";
    if (ms) ms.style.left = strongPct + "%";
    const lw = $("#decoded-meter-label-warn");
    const ls = $("#decoded-meter-label-strong");
    if (lw) {
      lw.style.left = warnPct + "%";
      lw.textContent = "Warn " + soft + " MB";
    }
    if (ls) {
      ls.style.left = strongPct + "%";
      ls.textContent = "Strong " + strong + " MB";
    }
    const how = $("#decoded-meter-how-body");
    if (how) {
      how.textContent =
        "Biggest stage " +
        fmtMb(peakBytes) +
        " plus a " +
        chunkCacheMb +
        " MB map cache ≈ " +
        estTxt +
        ". Whole project art is " +
        fmtMb(totalBytes) +
        ". Size is width × height × 4 bytes per image; that undercounts GPU copies, atlases and audio. Download size excludes unused source originals. Warn and strong marks never block a build.";
    }
    const dw = $("#decoded-meter-warn");
    if (dw) {
      if (level === "ok") {
        dw.hidden = true;
      } else {
        dw.hidden = false;
        dw.textContent =
          (level === "strong" ? "Strong warning: " : "Warning: ") +
          "may be closed on low-end phones. Nothing is blocked.";
      }
    }
    syncRenderTargetButtons();
    renderCreditsUI();
  }


  /** Project-format §13 hard errors H1–H6. forRender includes H6. */
  function hardBlockers(opts) {
    opts = opts || {};
    const forRender = !!opts.forRender;
    if (!state.project || !window.ProjectStore) return [];
    const rows = [];
    const push = (row) => rows.push(row);
    const m = ProjectStore.manifest(state.project);
    const cat = state.catalogueDoc;
    const stages = ProjectStore.listStages(state.project);
    const selectedStageIds = (m.project.stages || []).filter(
      (id) => (m.project.render.excludedStages || []).indexOf(id) < 0
    );

    // H1 — required unanswered / noDefault on used setups (+ missing ability-presentation)
    const setups = ProjectStore.listSetups(state.project);
    const hasAp = setups.some((s) => s.behaviourId === "ability-presentation");
    if (!hasAp) {
      push({
        code: "H1",
        label: "Ability presentation",
        detail: "needs an answer",
        plain: "Ability presentation needs an answer",
        target: { screen: "wizard-ability-pick" },
      });
    }
    if (window.SetupStore) {
      setups.forEach((doc) => {
        const checks = (SetupStore.check
          ? SetupStore.check(doc, Object.assign({}, cat, { _presentationStyle: presentationStyle() }))
          : []) || [];
        checks.filter((c) => c.severity === "hard").forEach((c) => {
          if (c.code === "invalidValue") {
            push({
              code: "H2",
              label: c.label || c.knobId,
              detail: "invalidValue",
              plain: (c.label || c.knobId) + " has a value the game can't read",
              setupId: doc.id,
              behaviourId: doc.behaviourId,
              knobId: c.knobId,
              target: { screen: "assign-behaviour", setupId: doc.id, behaviourId: doc.behaviourId, knobId: c.knobId },
            });
          } else {
            // requiredUnanswered / noDefault → H1
            push({
              code: "H1",
              label: c.label || c.knobId,
              detail: c.code || "requiredUnanswered",
              plain: (c.label || c.knobId) + " needs an answer",
              setupId: doc.id,
              behaviourId: doc.behaviourId,
              knobId: c.knobId,
              target: { screen: "assign-behaviour", setupId: doc.id, behaviourId: doc.behaviourId, knobId: c.knobId },
            });
          }
        });
      });
      // Also unit-attached draft setups in shell state
      state.units.forEach((u) => {
        (u.setups || []).forEach((s) => {
          if (!s.doc) return;
          const r = SetupStore.readiness(s.doc, Object.assign({}, cat, { _presentationStyle: presentationStyle() }));
          (r.missing || []).forEach((row) => {
            push({
              code: "H1",
              label: row.label || row.knobId,
              detail: row.code || row.reason,
              plain: u.name + ": " + (row.label || row.knobId) + " needs an answer",
              setupId: s.id,
              behaviourId: s.doc.behaviourId,
              unitId: u.id,
              knobId: row.knobId,
              target: { screen: "behaviour-question", unitId: u.id, setupId: s.id, knobId: row.knobId },
            });
          });
        });
      });
    }

    // H2 — difficulty not a number; unit stats wrong type
    const diff = m.project.difficulty || {};
    ["hp", "damage"].forEach((f) => {
      if (diff[f] != null && typeof diff[f] !== "number") {
        push({
          code: "H2",
          label: "Difficulty " + f,
          detail: "not a number",
          plain: "Difficulty " + f + " isn't a number",
          target: { screen: "project-settings" },
        });
      }
    });
    stages.forEach((st) => {
      if (st.difficulty) {
        ["hp", "damage"].forEach((f) => {
          if (st.difficulty[f] != null && typeof st.difficulty[f] !== "number") {
            push({
              code: "H2",
              label: st.name + " difficulty " + f,
              detail: "not a number",
              plain: (st.name || "Stage") + " difficulty " + f + " isn't a number",
              target: { screen: "stage-loadout", stageId: st.id },
            });
          }
        });
      }
      // H2 on stage unit overrides
      const uov = (st.overrides && st.overrides.units) || {};
      Object.keys(uov).forEach((uid) => {
        Object.keys(uov[uid] || {}).forEach((sid) => {
          const v = uov[uid][sid] && uov[uid][sid].value;
          if (v != null && typeof v !== "number") {
            push({
              code: "H2",
              label: uid + " " + sid,
              detail: "invalidValue",
              plain: "A stage unit stat isn't a number",
              target: { screen: "unit-editor" },
            });
          }
        });
      });
    });
    ProjectStore.listUnits(state.project).forEach((u) => {
      Object.keys(u.stats || {}).forEach((sid) => {
        const v = u.stats[sid] && u.stats[sid].value;
        if (v != null && typeof v !== "number") {
          push({
            code: "H2",
            label: u.name + " " + sid,
            detail: "invalidValue",
            plain: (u.name || "Unit") + " has a stat the game can't read",
            target: { screen: "unit-editor", unitId: u.id },
          });
        }
      });
    });

    // H3 — broken refs (needed ones)
    (m.project.stages || []).forEach((sid) => {
      if (!ProjectStore.getStage(state.project, sid)) {
        push({
          code: "H3",
          label: sid,
          detail: "missing stage",
          plain: "A stage in the project list is missing",
          target: { screen: "stage-select" },
        });
      }
    });
    stages.forEach((st) => {
      if (!st.mapRef || !ProjectStore.getMap(state.project, st.mapRef)) {
        push({
          code: "H3",
          label: st.name || st.id,
          detail: "bad mapRef",
          plain: (st.name || "Stage") + " points at a missing map",
          target: { screen: "stage-map", stageId: st.id },
        });
      }
      (st.rules || []).forEach((rid) => {
        if (!ProjectStore.getSetup(state.project, rid)) {
          push({
            code: "H3",
            label: rid,
            detail: "missing rule setup",
            plain: (st.name || "Stage") + " has a missing rules setup",
            target: { screen: "stage", stageId: st.id },
          });
        }
      });
      const lo = st.loadout || m.project.loadout || {};
      (lo.roster || []).concat(lo.required || []).forEach((uid) => {
        if (!ProjectStore.getUnit(state.project, uid)) {
          push({
            code: "H3",
            label: uid,
            detail: "missing unit",
            plain: "Loadout names a missing unit",
            target: { screen: st.loadout ? "stage-loadout" : "loadout", stageId: st.id },
          });
        }
      });
      const pool = st.enemyPool;
      const poolIds = [];
      if (pool && pool.mode === "fixed") (pool.entries || []).forEach((e) => poolIds.push(e.unitId));
      if (pool && pool.mode === "weighted") (pool.entries || []).forEach((e) => poolIds.push(e.unitId));
      if (pool && pool.mode === "waves")
        (pool.waves || []).forEach((w) => (w.entries || []).forEach((e) => poolIds.push(e.unitId)));
      (st.neutrals || []).forEach((n) => poolIds.push(n.unitId));
      poolIds.forEach((uid) => {
        if (uid && !ProjectStore.getUnit(state.project, uid)) {
          push({
            code: "H3",
            label: uid,
            detail: "missing enemy/neutral",
            plain: (st.name || "Stage") + " names a missing unit",
            target: { screen: "stage-enemy-pool", stageId: st.id },
          });
        }
      });
      const map = ProjectStore.getMap(state.project, st.mapRef);
      if (map) {
        (map.layers || []).forEach((layer) => {
          if (layer.tileset && !(m.project.assets && m.project.assets[layer.tileset])) {
            // only needed if layer visible
            if (layer.visible !== false) {
              push({
                code: "H3",
                label: map.name || map.id,
                detail: "missing tileset",
                plain: (map.name || "Map") + " uses a missing tileset",
                target: { screen: "stage-map", stageId: st.id },
              });
            }
          }
        });
        const bg = map.background;
        if (bg && (bg.mode === "image" || bg.mode === "parallax") && bg.assetId) {
          if (!(m.project.assets && m.project.assets[bg.assetId])) {
            push({
              code: "H3",
              label: map.name || map.id,
              detail: "missing background",
              plain: (map.name || "Map") + " background art is missing",
              target: { screen: "stage-map", stageId: st.id },
            });
          }
        }
      }
    });
    (m.project.rules || []).forEach((rid) => {
      if (!ProjectStore.getSetup(state.project, rid)) {
        push({
          code: "H3",
          label: rid,
          detail: "missing project rule",
          plain: "A project rule setup is missing",
          target: { screen: "project-settings" },
        });
      }
    });
    ProjectStore.listUnits(state.project).forEach((u) => {
      if (u.sprite && !(m.project.assets && m.project.assets[u.sprite])) {
        push({
          code: "H3",
          label: u.name || u.id,
          detail: "missing sprite",
          plain: (u.name || "Unit") + " sprite is missing",
          target: { screen: "sprite-upload", unitId: u.id },
        });
      }
    });

    // H4 — asset/page file missing (hash only if cheap: skip; meta without file)
    Object.keys(m.project.assets || {}).forEach((aid) => {
      const meta = m.project.assets[aid];
      const ext = (meta && meta.ext) || "png";
      const path = "assets/" + aid + "." + ext;
      if (!state.project.files[path] && !state.project.files["assets/" + aid]) {
        // Only hard if something references it
        const used =
          ProjectStore.listUnits(state.project).some((u) => u.sprite === aid) ||
          ProjectStore.listMaps(state.project).some(
            (map) =>
              (map.layers || []).some((l) => l.tileset === aid) ||
              (map.background && map.background.assetId === aid)
          );
        if (used) {
          push({
            code: "H4",
            label: (meta && meta.name) || aid,
            detail: "missing file",
            plain: "Art file for " + ((meta && meta.name) || "an asset") + " is missing",
            target: { screen: "sprite-upload" },
          });
        }
      }
    });
    // Note: content-hash verify not done (not cheap without reading all bytes)

    // H5 — terrain / layer length
    ProjectStore.listMaps(state.project).forEach((map) => {
      const expect = (map.cols || 0) * (map.rows || 0);
      if (!expect) return;
      if (map.logic && Array.isArray(map.logic.terrain) && map.logic.terrain.length !== expect) {
        push({
          code: "H5",
          label: map.name || map.id,
          detail: "logic length",
          plain: (map.name || "Map") + " is missing tiles",
          target: { screen: "stage-map" },
        });
      }
      (map.layers || []).forEach((layer) => {
        if (Array.isArray(layer.tiles) && layer.tiles.length !== expect) {
          push({
            code: "H5",
            label: map.name || map.id,
            detail: "layer length",
            plain: (map.name || "Map") + " is missing tiles",
            target: { screen: "stage-map" },
          });
        }
      });
      // legacy v2 terrain field if still present
      if (Array.isArray(map.terrain) && map.terrain.length !== expect) {
        push({
          code: "H5",
          label: map.name || map.id,
          detail: "terrain length",
          plain: (map.name || "Map") + " is missing tiles",
          target: { screen: "stage-map" },
        });
      }
    });

    // H6 — Render only
    if (forRender && selectedStageIds.length === 0) {
      push({
        code: "H6",
        label: "Render",
        detail: "no stages",
        plain: "No stages are selected to render",
        target: { screen: "render" },
      });
    }

    // Dedupe identical plain+code (e.g. logic + layer both H5)
    const seen = new Set();
    return rows.filter((r) => {
      const k = (r.code || "") + "|" + (r.plain || r.label || "");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  function warningRows() {
    if (!state.project || !window.SetupStore) return [];
    const out = [];
    ProjectStore.listSetups(state.project).forEach((doc) => {
      const r = SetupStore.readiness(doc, Object.assign({}, state.catalogueDoc, { _presentationStyle: presentationStyle() }));
      (r.warnings || []).forEach((row) =>
        out.push(Object.assign({ plain: (row.label || row.knobId) + " warning", setupId: doc.id }, row))
      );
    });
    // advancedRender blur warning
    if (state.project && ProjectStore.effectiveAdvancedRender(state.project)) {
      const cam = ProjectStore.manifest(state.project).project.settings.camera || {};
      const maps = ProjectStore.listMaps(state.project);
      const stretchy = maps.some((map) => map.background && (map.background.fit === "cover" || map.background.fit === "stretch"));
      if (cam.pixelPerfect === false || stretchy) {
        out.push({ code: "advancedRender", plain: "may blur or stretch your art", label: "Advanced render" });
      }
    }
    return out;
  }

  function hardPlain(row) {
    return row.plain || row.label || row.code || "Something's wrong";
  }

  function updatePlayBanner() {
    const banner = $("#play-anyway-banner");
    const text = $("#play-anyway-text");
    const hard = hardBlockers({ forRender: false });
    const hardRender = hardBlockers({ forRender: true });
    const warns = warningRows();
    const btn = $("#btn-play-anyway");
    const onStage = !!document.querySelector("#screen-stage.active");
    let mode = "";
    let msg = "";
    let action = "";
    if (hard.length) {
      mode = "hard";
      const first = hardPlain(hard[0]);
      msg = hard.length === 1 ? "Can't play yet: " + first + "." : "Can't play yet: " + first + " (+" + (hard.length - 1) + " more).";
      action = "Fix";
    } else if (warns.length) {
      mode = "warn";
      msg = warns.length === 1
        ? (warns[0].plain || "1 warning") + "."
        : warns.length + " warnings — you can play anyway.";
      action = "Play anyway";
    }
    if (banner) {
      // Global banner stays for non-stage screens; stage uses the chip.
      if (onStage || !mode) {
        banner.hidden = true;
      } else {
        banner.hidden = false;
        if (text) text.textContent = msg;
        if (btn) btn.textContent = action;
        banner.dataset.mode = mode;
      }
      if (!mode) banner.dataset.mode = "";
    }
    const chip = $("#stage-status-chip");
    const chipText = $("#stage-status-text");
    const chipAct = $("#btn-stage-status-action");
    if (chip) {
      if (!mode || state.statusChipDismissed) {
        chip.hidden = true;
      } else {
        chip.hidden = false;
        chip.dataset.mode = mode;
        if (chipText) chipText.textContent = msg;
        if (chipAct) chipAct.textContent = action;
      }
    }
    syncPlayRenderEnabled(hard, hardRender);
  }

  function setBlocked(el, blocked, reason) {
    if (!el) return;
    el.disabled = !!blocked;
    el.setAttribute("aria-disabled", blocked ? "true" : "false");
    el.classList.toggle("is-blocked", !!blocked);
    if (blocked) el.title = reason || "Fix hard errors first";
    else el.removeAttribute("title");
  }

  function syncPlayRenderEnabled(hardPlay, hardRender) {
    hardPlay = hardPlay || hardBlockers({ forRender: false });
    hardRender = hardRender || hardBlockers({ forRender: true });
    const playBlocked = hardPlay.length > 0;
    const renderBlocked = hardRender.length > 0;
    setBlocked($("#btn-stage-play"), playBlocked, "Fix hard errors before play");
    setBlocked($("#btn-loadout-play"), playBlocked, "Fix hard errors before play");
    // Stage toolbar Preview + Render tools
    const prev = document.querySelector('#sheet-more [data-nav="preview"], .stage-tools [data-nav="preview"]');
    setBlocked(prev, playBlocked, "Fix hard errors before preview");
    const stageRender = document.querySelector('#sheet-more [data-nav="render"], .stage-tools [data-nav="render"]');
    setBlocked(stageRender, renderBlocked, "Fix hard errors before render");
  }

  function jumpToHardError(row) {
    if (!row) return false;
    const t = row.target || {};
    if (t.stageId) state.currentStageId = t.stageId;
    if (t.unitId) {
      const shellId = String(t.unitId).replace(/^shell-/, "");
      const u = state.units.find((x) => String(x.id) === shellId || "shell-" + x.id === t.unitId);
      if (u) state.selectedUnitId = u.id;
    }
    if (t.screen === "assign-behaviour" || t.screen === "behaviour-question") {
      const setups = ProjectStore.listSetups(state.project);
      let doc = setups.find((s) => s.id === t.setupId) || setups.find((s) => s.behaviourId === t.behaviourId);
      // unit setup?
      if (!doc && t.unitId) {
        const u = selectedUnit();
        const entry = u && (u.setups || []).find((s) => s.id === t.setupId || s.doc.behaviourId === t.behaviourId);
        if (entry) {
          state.activeSetupId = entry.id;
          state.editKnobId = t.knobId || null;
          state.draftQuestionValue = null;
          show(t.screen === "behaviour-question" ? "behaviour-question" : "behaviour-summary");
          return true;
        }
      }
      if (doc) {
        state.draftDoc = doc;
        state.selectedBehaviourId = doc.behaviourId;
        state.activeSetupId = null;
        show("assign-behaviour");
        return true;
      }
      show("pick-behaviour");
      toast(hardPlain(row));
      return true;
    }
    if (t.screen) {
      show(t.screen);
      return true;
    }
    show("stage");
    toast(hardPlain(row));
    return true;
  }



  
  function renderAdvancedRenderUI() {
    if (!state.project) return;
    updateFracZoomChrome();
    const adv = ProjectStore.effectiveAdvancedRender(state.project);
    setPressed("advanced-render", adv ? "on" : "off");
    const cam = ProjectStore.manifest(state.project).project.settings.camera || {};
    const storedPP = cam.pixelPerfect !== false;
    setPressed("pixel-perfect", storedPP ? "on" : "off");
    const ppField = $("#pixel-perfect-field");
    const bgField = $("#bg-fit-field");
    if (ppField) ppField.classList.toggle("is-locked", !adv);
    if (bgField) bgField.classList.toggle("is-locked", !adv);
    const ppHint = $("#pixel-perfect-hint");
    if (ppHint) {
      ppHint.textContent = adv
        ? storedPP
          ? "Pixel-perfect on — whole-number zoom preferred."
          : "Off — fractional zoom may blur your art."
        : "Locked on while Advanced render is off (stored Off is kept but unused).";
    }
    const maps = ProjectStore.listMaps(state.project);
    const fit = (maps[0] && maps[0].background && maps[0].background.fit) || "none";
    state.bgFit = fit;
    setPressed("bg-fit", fit);
    const bgHint = $("#bg-fit-hint");
    if (bgHint) {
      if (!adv && (fit === "cover" || fit === "stretch")) {
        bgHint.textContent = "Stored as " + fit + " — needs Advanced render (drawn as none).";
      } else if (!adv) {
        bgHint.textContent = "Cover / Stretch need Advanced render. Tile always works.";
      } else {
        bgHint.textContent = fit === "cover" || fit === "stretch" ? "May blur or stretch your art." : "None / Tile keep art sharp.";
      }
    }
    // grey cover/stretch buttons
    $$('[data-group="bg-fit"]').forEach((btn) => {
      const v = btn.getAttribute("data-value");
      if (v === "cover" || v === "stretch") {
        btn.classList.toggle("soon-locked", !adv);
        btn.disabled = !adv;
      }
    });
    $$('[data-group="pixel-perfect"]').forEach((btn) => {
      btn.classList.toggle("soon-locked", !adv);
      btn.disabled = !adv;
    });
  }

  function renderProjectDifficulty() {
    if (!state.project) return;
    const d = ProjectStore.effectiveDifficulty(state.project);
    const hp = $("#diff-hp");
    const dmg = $("#diff-dmg");
    if (hp) { hp.value = d.hp; $("#diff-hp-val").textContent = Number(d.hp).toFixed(1); }
    if (dmg) { dmg.value = d.damage; $("#diff-dmg-val").textContent = Number(d.damage).toFixed(1); }
    setPressed("diff-applies", d.appliesTo || "enemies");
    const cam = ProjectStore.manifest(state.project).project.settings.camera || {};
    const ease = $("#ease-ms");
    if (ease) {
      ease.value = cam.easeMs != null ? cam.easeMs : 120;
      const ev = $("#ease-ms-val");
      if (ev) ev.textContent = (cam.easeMs != null ? cam.easeMs : 120) + " ms";
    }
    const zoom = ProjectStore.manifest(state.project).project.settings.camera.zoom || 1;
    const sz = $("#settings-zoom");
    if (sz) { sz.value = zoom; const zv = $("#settings-zoom-val"); if (zv) zv.textContent = zoom + "×"; }
    setPressed("screen-fit", ProjectStore.manifest(state.project).project.settings.screenFit || "letterbox");
    renderAdvancedRenderUI();
  }

  function renderStageDifficulty() {
    if (!state.project || !state.currentStageId) return;
    const st = ProjectStore.getStage(state.project, state.currentStageId);
    const eff = ProjectStore.effectiveDifficulty(state.project, state.currentStageId);
    const proj = ProjectStore.manifest(state.project).project.difficulty || { hp: 1, damage: 1 };
    const hp = $("#stage-diff-hp");
    const dmg = $("#stage-diff-dmg");
    if (hp) {
      hp.value = eff.hp;
      $("#stage-diff-hp-val").textContent = Number(eff.hp).toFixed(1) + (st && st.difficulty && st.difficulty.hp != null ? "" : " (inherit)");
    }
    if (dmg) {
      dmg.value = eff.damage;
      $("#stage-diff-dmg-val").textContent = Number(eff.damage).toFixed(1) + (st && st.difficulty && st.difficulty.damage != null ? "" : " (inherit)");
    }
    const ov = st && st.overrides && st.overrides.setups && st.overrides.setups["ability-presentation"];
    const mode = ov ? "custom" : "project";
    state.stagePresMode = mode;
    setPressed("stage-pres-mode", mode);
    const panel = $("#stage-pres-custom");
    if (panel) panel.hidden = mode !== "custom";
    if (ov && ov.shortcut) setPressed("stage-pres-shortcut", ov.shortcut.value);
  }


  async function persistProject() {
    if (!state.project || !window.ProjectStore) return;
    const res = await ProjectStore.persist(state.project, state.catalogueDoc);
    state.sizeWarn = res.warn ? res.message : null;
    const banner = $("#size-warn");
    if (banner) {
      if (state.sizeWarn) {
        banner.hidden = false;
        banner.textContent = state.sizeWarn;
      } else banner.hidden = true;
    }
    if (res.opfsNote) {
      /* soft note already toasted on open */
    }
  }

  function syncMapSizeFromStage() {
    if (!state.project || !state.currentStageId) return;
    const map = ProjectStore.getMap(state.project, state.currentStageId);
    if (!map) return;
    state.mapW = map.cols;
    state.mapH = map.rows;
  }

  function renderStageSelect() {
    const root = $("#stage-select-list");
    if (!root || !state.project) return;
    const stages = ProjectStore.listStages(state.project);
    root.innerHTML = stages
      .map((map, i) => {
        const selected = map.id === state.currentStageId;
        return `<div class="stage-select-row" role="listitem">
          <div class="row-top">
            <button type="button" class="name-btn" data-open-stage="${escapeHtml(map.id)}" aria-label="Open ${escapeHtml(map.name)}" aria-pressed="${selected}">${escapeHtml(map.name)}</button>
            <span class="hint" style="margin:0">${map.cols}×${map.rows}</span>
          </div>
          <div class="row-actions">
            <button type="button" class="btn btn-ghost" data-rename-stage="${escapeHtml(map.id)}" aria-label="Rename">Rename</button>
            <button type="button" class="btn btn-ghost" data-dup-stage="${escapeHtml(map.id)}" aria-label="Duplicate">Duplicate</button>
            <button type="button" class="btn btn-ghost" data-up-stage="${escapeHtml(map.id)}" aria-label="Move up" ${i===0?"disabled":""}>Up</button>
            <button type="button" class="btn btn-ghost" data-down-stage="${escapeHtml(map.id)}" aria-label="Move down" ${i===stages.length-1?"disabled":""}>Down</button>
          </div>
        </div>`;
      })
      .join("") || `<p class="hint">No stages yet.</p>`;
    root.querySelectorAll("[data-open-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentStageId = btn.getAttribute("data-open-stage");
        syncMapSizeFromStage();
        show("stage");
      });
    });
    root.querySelectorAll("[data-rename-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-rename-stage");
        const map = ProjectStore.getMap(state.project, id);
        const name = window.prompt("Stage name", map ? map.name : "");
        if (name == null) return;
        ProjectStore.renameStage(state.project, id, name);
        persistProject();
        renderStageSelect();
      });
    });
    root.querySelectorAll("[data-dup-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        ProjectStore.duplicateStage(state.project, btn.getAttribute("data-dup-stage"));
        persistProject();
        renderStageSelect();
        toast("Stage duplicated");
      });
    });
    root.querySelectorAll("[data-up-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idU = btn.getAttribute("data-up-stage"); const arrU = ProjectStore.manifest(state.project).project.stages; const iU = arrU.indexOf(idU); if (iU > 0) ProjectStore.reorderStage(state.project, idU, iU - 1);
        persistProject();
        renderStageSelect();
      });
    });
    root.querySelectorAll("[data-down-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idD = btn.getAttribute("data-down-stage"); const arrD = ProjectStore.manifest(state.project).project.stages; const iD = arrD.indexOf(idD); ProjectStore.reorderStage(state.project, idD, iD + 1);
        persistProject();
        renderStageSelect();
      });
    });
  }


  function renderLoadout() {
    const root = $("#loadout-list");
    const slotsEl = $("#loadout-slots");
    if (!root) return;
    const units = state.units.slice();
    const selected = new Set(state.loadoutSelected);
    if (slotsEl) slotsEl.textContent = `${selected.size} / ${state.loadoutSlots} slots filled. Tap a unit to select or deselect.`;
    root.innerHTML = units
      .map((u) => {
        const on = selected.has(u.id);
        return `<button type="button" class="loadout-card" data-loadout="${u.id}" aria-pressed="${on}" aria-label="${escapeHtml(u.name)}">
          <span class="slot-mark" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(u.name)}</strong>
            <span class="hint" style="display:block;margin:0">HP ${u.hp} · Atk ${u.atk}</span>
          </span>
        </button>`;
      })
      .join("");
    root.querySelectorAll("[data-loadout]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-loadout"));
        const i = state.loadoutSelected.indexOf(id);
        if (i >= 0) state.loadoutSelected.splice(i, 1);
        else if (state.loadoutSelected.length < state.loadoutSlots) state.loadoutSelected.push(id);
        else toast("Loadout full (" + state.loadoutSlots + ")");
        renderLoadout();
      });
    });
  }

  function tryPlay() {
    updatePlayBanner();
    const hard = hardBlockers({ forRender: false });
    if (hard.length) {
      toast("Can't play yet: " + hardPlain(hard[0]));
      jumpToHardError(hard[0]);
      return;
    }
    // Warnings never block Play (banner offers Play anyway as an alternate entry).
    toast("Play test (placeholder)");
    if (window.__uxFeatures) window.__uxFeatures.record("previewStarted", 1);
    show("play");
  }

  function tryRender(kind) {
    updatePlayBanner();
    const hard = hardBlockers({ forRender: true });
    if (hard.length) {
      toast("Can't render yet: " + hardPlain(hard[0]));
      jumpToHardError(hard[0]);
      return;
    }
    const warns = warningRows();
    const title = $("#render-soon-title");
    const sub = $("#render-soon-sub");
    if (title) title.textContent = "Render coming soon";
    const label =
      kind === "android" ? "Android package" : kind === "ios" ? "iPhone package" : kind === "mobile" ? "Mobile package" : "PC (itch.io) export";
    if (sub) {
      sub.textContent =
        label +
        " — runtime + used behaviours + assets only. No editor." +
        (warns.length ? " (" + warns.length + " warning" + (warns.length === 1 ? "" : "s") + " — render anyway.)" : "");
    }
    show("render-soon");
  }


  /* ---------- wizard bindings ---------- */

  function bindChoices() {
    $$("[data-group]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const g = btn.getAttribute("data-group");
        const v = btn.getAttribute("data-value");
        if (g === "platform") {
          state.platform = v;
          // Wizard: follow suggestion only while untouched. Project settings: never rewrite tileSize.
          const onSettings = !$("#screen-project-settings")?.hidden;
          const onWizard = !$("#screen-wizard-platform")?.hidden || !$("#screen-wizard-tiles")?.hidden;
          if (state.project && onSettings) {
            ProjectStore.manifest(state.project).project.settings.platform = v;
            persistProject();
            // NEVER rewrite settings.tileSize — hint only
            renderSettingsTileSizeHint();
          } else {
            applyPlatformTileSuggestion();
          }
        }
        if (g === "combat") state.combat = v;
        if (g === "camera-view") state.cameraView = v;
        if (g === "camera-mode") state.cameraMode = v;
        if (g === "tileset") {
          state.tileset = v;
          renderTilePreview();
        }
        if (g === "terrain") {
          state.terrain = v;
          renderMapPreview();
        }
        if (g === "fog") state.fog = v === "on";
        {
          const active = document.querySelector(".screen.active");
          if (active && active.id && active.id.indexOf("wizard-") >= 0) renderWizardPreviewStrip(active.id);
        }
        if (g === "ability-pick") {
          let mapped = v;
          if (mapped === "unit-menu" || mapped === "menu") mapped = "unit-action-menu";
          if (mapped === "cards" || mapped === "hand") mapped = "card-hand";
          mapped = mapViaCatalogueOptions("ability-presentation", "shortcut", mapped);
          state.abilityPick = mapped;
          if (state.project && window.ProjectStore && window.SetupStore) {
            ProjectStore.setPresentation(state.project, state.catalogueDoc, mapped, SetupStore);
            persistProject();
          }
          renderAbilityPanels();
          renderStageOverlays();
        }
        if (g === "basic-style") {
          state.basicStyle = v;
          if (state.project && window.ProjectStore && window.SetupStore) {
            ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "basic_style", v, SetupStore);
            persistProject();
          }
          renderAbilityPanels();
          renderStageOverlays();
        }
        if (g === "spells-style") {
          state.spellsStyle = v;
          if (state.project && window.ProjectStore && window.SetupStore) {
            ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "spells_style", v, SetupStore);
            persistProject();
          }
          renderAbilityPanels();
          renderStageOverlays();
        }
        if (g === "hand-placement") {
          state.handPlacement = v;
          if (state.project && window.ProjectStore && window.SetupStore) {
            ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "hand_placement", v, SetupStore);
            persistProject();
          }
          state.handOpenFromMenu = false;
          renderAbilityPanels();
          renderStageOverlays();
        }

        if (g === "screen-fit") {
          state.screenFit = v;
          if (state.project) {
            ProjectStore.manifest(state.project).project.settings.screenFit = v;
            persistProject();
          }
        }
        if (g === "enemy-mode") {
          state.enemyMode = v;
          applyEnemyMode(v);
        }
        if (g === "stage-loadout-mode") {
          state.stageLoadoutMode = v;
          applyStageLoadoutMode(v);
        }
        if (g === "god-what") { state.godWhat = v; setPressed("god-what", v); }
        if (g === "god-where") { state.godWhere = v; setPressed("god-where", v); }
        if (g === "diff-applies") {
          state._pendingDiff = state._pendingDiff || { hp: 1, damage: 1, appliesTo: "enemies" };
          state._pendingDiff.appliesTo = v;
          if (state.project) {
            const cur = ProjectStore.effectiveDifficulty(state.project);
            ProjectStore.setProjectDifficulty(state.project, Object.assign({}, cur, { appliesTo: v }));
            persistProject();
          }
        }
        if (g === "advanced-render") {
          if (!state.project) return;
          const on = v === "on";
          if (on) {
            const ok = window.confirm("Advanced render may blur or stretch your art. Turn it on?");
            if (!ok) { setPressed("advanced-render", "off"); return; }
          }
          ProjectStore.manifest(state.project).project.settings.advancedRender = on;
          persistProject();
          renderAdvancedRenderUI();
        }
        if (g === "pixel-perfect") {
          if (!state.project || !ProjectStore.effectiveAdvancedRender(state.project)) {
            toast("Needs Advanced render");
            renderAdvancedRenderUI();
            return;
          }
          ProjectStore.manifest(state.project).project.settings.camera.pixelPerfect = v !== "off";
          persistProject();
          renderAdvancedRenderUI();
        }
        if (g === "bg-fit") {
          if (!state.project) return;
          if ((v === "cover" || v === "stretch") && !ProjectStore.effectiveAdvancedRender(state.project)) {
            toast("Needs Advanced render");
            renderAdvancedRenderUI();
            return;
          }
          state.bgFit = v;
          const maps = ProjectStore.listMaps(state.project);
          if (maps[0]) {
            maps[0].background = maps[0].background || { mode: "none" };
            maps[0].background.fit = v;
            ProjectStore.saveMap(state.project, maps[0]);
            persistProject();
          }
          renderAdvancedRenderUI();
        }
        if (g === "stage-pres-mode") {
          state.stagePresMode = v;
          const panel = $("#stage-pres-custom");
          if (panel) panel.hidden = v !== "custom";
          if (v === "project") {
            ProjectStore.setStagePresentationOverride(state.project, state.currentStageId, null);
            persistProject();
          } else {
            ProjectStore.setStagePresentationOverride(state.project, state.currentStageId, {
              shortcut: { value: state.abilityPick || "all-menu", rev: 1 },
            });
            persistProject();
          }
        }
        if (g === "stage-pres-shortcut") {
          ProjectStore.setStagePresentationOverride(state.project, state.currentStageId, {
            shortcut: { value: v, rev: 1 },
          });
          persistProject();
        }

        setPressed(g, v);
      });
    });
  }

  function bindSliders() {
    const zoom = $("#zoom");
    zoom?.addEventListener("input", () => {
      state.zoom = Number(zoom.value);
      const z = $("#zoom-val");
      if (z) z.textContent = state.zoom.toFixed(2);
    });
    const tile = $("#tile-size");
    tile?.addEventListener("input", () => {
      state.tileSize = Number(tile.value);
      state.tileSizeTouched = true;
      const val = $("#tile-size-val");
      if (val) val.textContent = state.tileSize + " px";
      renderTilePreview();
      renderTileSizeSuggestion();
    });
    $("#btn-tile-size-reset")?.addEventListener("click", () => {
      state.tileSizeTouched = false;
      applyPlatformTileSuggestion();
      toast("Reset to suggested tile size");
    });
    const mw = $("#map-w");
    const mh = $("#map-h");
    mw?.addEventListener("input", () => {
      const caps = mapCaps();
      state.mapW = Math.min(caps.max, Math.max(3, Number(mw.value)));
      mw.value = state.mapW;
      renderMapPreview();
    });
    mh?.addEventListener("input", () => {
      const caps = mapCaps();
      state.mapH = Math.min(caps.max, Math.max(3, Number(mh.value)));
      mh.value = state.mapH;
      renderMapPreview();
    });
  }

  function wizardSteps() {
    // ask_in_wizard is a UI hint. required + source:default is hard while active (setup-format r4).
    // Ability presentation only for Grid tactics (screen-map / wizard: Coming soon modes skip it).
    let steps = WIZARD.slice();
    const grid = state.combat === "grid-tactics";
    const has = steps.includes("wizard-ability-pick");
    if (grid && !has) {
      const cam = steps.indexOf("wizard-camera");
      if (cam >= 0) steps.splice(cam, 0, "wizard-ability-pick");
      else steps.unshift("wizard-ability-pick");
    } else if (!grid && has) {
      steps = steps.filter((id) => id !== "wizard-ability-pick");
    }
    return steps;
  }

  function wizardNext(from) {
    if (from === "wizard-ability-pick") {
      // Persist the visible pick as a user answer on Next (requiredUnanswered until then).
      let shortcut = state.abilityPick;
      if (shortcut === "unit-menu" || shortcut === "menu") shortcut = "unit-action-menu";
      if (shortcut === "cards" || shortcut === "hand") shortcut = "card-hand";
      shortcut = mapViaCatalogueOptions("ability-presentation", "shortcut", shortcut);
      if (shortcut !== "all-cards" && shortcut !== "custom" && shortcut !== "all-menu") shortcut = "all-menu";
      state.abilityPick = shortcut;
      if (state.project && window.ProjectStore && window.SetupStore) {
        ProjectStore.setPresentation(state.project, state.catalogueDoc, shortcut, SetupStore);
        const setups = ProjectStore.listSetups(state.project);
        const ap = setups.find((s) => s.behaviourId === "ability-presentation");
        if (ap) {
          const kid = ap.answers.shortcut ? "shortcut" : "style";
          const res = SetupStore.editAnswer(
            ap,
            kid,
            shortcut === "all-menu" && kid === "style"
              ? "unit-action-menu"
              : shortcut === "all-cards" && kid === "style"
                ? "card-hand"
                : shortcut,
            ap.rev,
            state.catalogueDoc
          );
          if (res.doc) ProjectStore.saveSetupFile(state.project, res.doc);
          persistProject();
        }
      }
    }
    if (from === "wizard-tiles" && state.project) {
      ProjectStore.manifest(state.project).project.settings.tileSize = state.tileSize;
      persistProject();
    }
    const steps = wizardSteps();
    const i = steps.indexOf(from);
    if (from === "wizard-map" || i === steps.length - 1) {
      toast("Project created");
      show("stage");
      return;
    }
    show(steps[i + 1]);
  }

  function wizardBack(from) {
    const steps = wizardSteps();
    const i = steps.indexOf(from);
    if (i <= 0) {
      show(state.entry === "ingame" ? "home" : "home");
      return;
    }
    show(steps[i - 1]);
  }

  function routeFromHash() {
    const id = location.hash.replace(/^#/, "") || "home";
    const known = [
      "home",
      ...WIZARD,
      "stage",
      "place-unit",
      "pick-behaviour",
      "assign-behaviour",
      "behaviour-summary",
      "behaviour-question",
      "duplicate-setup",
      "save-preset",
      "use-preset",
      "update-preset",
      "unit-editor",
      "sprite-upload",
      "unit-list",
      "play",
      "preview",
      "render",
      "render-soon",
      "project-settings",
      "profile",
      "game-settings",
      "how-earn",
      "stage-select",
      "stage-enemy-pool",
      "stage-map",
      "stage-loadout",
      "loadout",
      "sprite-studio",
      "welcome", "my-setup", "get-started", "starter-make", "starter-pack",
    ];
    // r64: first launch (no profile.experience yet) opens the welcome quiz wherever you land.
    if (window.Experience && Experience.needsQuiz()) { Experience.startQuiz(known.includes(id) && id !== "welcome" ? id : "home"); return; }
    show(known.includes(id) ? id : "home");
  }

  async function init() {
    await loadCatalogue();
    if (window.ProjectStore) {
      const opened = await ProjectStore.openOrCreate(state.catalogueDoc, {
        name: "Demo project",
        cols: state.mapW,
        rows: state.mapH,
        shellState: {
          units: state.units,
          loadoutSlots: state.loadoutSlots || 4,
        },
      });
      state.project = opened.store;
      if (opened.notices && opened.notices.length) {
        const note = opened.notices.find((n) => /OPFS|localStorage|memory/i.test(n));
        if (note) toast(note);
      }
      const stages = ProjectStore.listStages(state.project);
      state.currentStageId = stages[0] ? stages[0].id : null;
      syncMapSizeFromStage();
      // Ensure ability-presentation exists with user answer after wizard; leave default until asked
      const setups = ProjectStore.listSetups(state.project);
      if (!setups.find((s) => s.behaviourId === "ability-presentation")) {
        const created = SetupStore.createSetup("ability-presentation", state.catalogueDoc, "Ability presentation");
        if (created.doc) {
          ProjectStore.saveSetupFile(state.project, created.doc);
          ProjectStore.manifest(state.project).project.rules.push(created.doc.id);
        }
      }
      await persistProject();
      syncPresentationStateFromProject();
      syncUnitsFromProject();
    }

    // Seed demo setup (step-pattern) + one with moved defaults (mana-pool) + one no-default (trap-tile)
    const u0 = state.units[0];
    if (u0.setups.length === 0) {
      ["step-pattern", "mana-pool"].forEach((bid) => {
        const created = S.createSetup(bid, state.catalogueDoc, behaviourById(bid)?.name);
        if (created.doc) {
          const loaded = S.loadSetup(created.doc, state.catalogueDoc);
          u0.setups.push({
            id: "seed-" + bid,
            doc: loaded.doc,
            notices: loaded.notices,
          });
        }
      });
      state.activeSetupId = "seed-step-pattern";
    }

    bindChoices();
    bindSliders();
    setPressed("platform", state.platform);
    setPressed("combat", state.combat);
    setPressed("camera-view", state.cameraView);
    setPressed("camera-mode", state.cameraMode);
    setPressed("tileset", state.tileset);
    setPressed("terrain", state.terrain);
    setPressed("fog", state.fog ? "on" : "off");
    setPressed("ability-pick", state.abilityPick);

    $("#btn-standalone")?.addEventListener("click", () => {
      state.entry = "standalone";
      show("wizard-platform");
    });
    

    $("#behaviour-search")?.addEventListener("input", (e) => {
      state.behaviourQuery = e.target.value;
      renderPickList();
    });

    const saveBeh = $("#btn-save-behaviour");
    if (saveBeh) {
      saveBeh.removeAttribute("data-nav");
      saveBeh.addEventListener("click", saveNewSetup);
    }

    $("#btn-undo")?.addEventListener("click", undoLast);
    $("#btn-redo")?.addEventListener("click", redoLast);
    $("#btn-dup")?.addEventListener("click", () => show("duplicate-setup"));
    $("#btn-save-preset")?.addEventListener("click", () => show("save-preset"));
    $("#btn-review-flagged")?.addEventListener("click", startFixFlagged);
    $("#btn-reset-knob")?.addEventListener("click", resetKnobToDefault);
    $("#btn-keep-answer")?.addEventListener("click", keepCurrentAnswer);
    $("#btn-question-save")?.addEventListener("click", saveQuestionEdit);
    $("#btn-question-back")?.addEventListener("click", () => {
      state.reaskQueue = [];
      state.draftQuestionValue = null;
      show("behaviour-summary");
    });
    $("#btn-dup-same")?.addEventListener("click", duplicateSameUnit);
    $("#btn-confirm-preset")?.addEventListener("click", confirmSavePreset);
    $("#btn-apply-preset-diff")?.addEventListener("click", applyPresetDiff);

    // Preview / Render / Play
    



    $$("#render-target-row [data-render-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.renderTarget = btn.getAttribute("data-render-target") || "browser";
        syncRenderTargetButtons();
      });
    });
    $("#btn-render-go")?.addEventListener("click", () => {
      tryRender(state.renderTarget || "browser");
    });

    $("#btn-credits-on")?.addEventListener("click", () => {
      if (!state.project) return;
      const m = ProjectStore.manifest(state.project);
      ProjectStore.ensureRenderFields(m);
      m.project.render.credits = true;
      persistProject();
      renderCreditsUI();
    });
    $("#btn-credits-off")?.addEventListener("click", () => {
      if (!state.project) return;
      const m = ProjectStore.manifest(state.project);
      ProjectStore.ensureRenderFields(m);
      m.project.render.credits = false;
      persistProject();
      renderCreditsUI();
    });
    $("#credits-text")?.addEventListener("change", (e) => {
      if (!state.project) return;
      const m = ProjectStore.manifest(state.project);
      ProjectStore.ensureRenderFields(m);
      m.project.render.creditsText = e.target.value;
      persistProject();
    });

    $("#btn-team-inherit")?.addEventListener("click", () => {
      setRosterAnswer("team_colour", null);
      renderUnitTeamColourUI();
      renderGrid();
    });
    $("#btn-team-custom")?.addEventListener("click", () => {
      const cur = rosterAnswer("team_colour");
      const next = (cur && cur.value) || resolveTeamColour("player") || "#badcff";
      setRosterAnswer("team_colour", next);
      renderUnitTeamColourUI();
      renderGrid();
    });
    $("#unit-team-colour")?.addEventListener("change", (e) => {
      setRosterAnswer("team_colour", e.target.value);
      const txt = $("#unit-team-colour-text");
      if (txt) txt.value = e.target.value;
      renderGrid();
    });
    $("#unit-team-colour-text")?.addEventListener("change", (e) => {
      const raw = String(e.target.value || "").trim();
      setRosterAnswer("team_colour", raw ? raw : null);
      const inp = $("#unit-team-colour");
      if (inp && raw) inp.value = raw;
      renderUnitTeamColourUI();
      renderGrid();
    });
    $("#btn-clip-cues-on")?.addEventListener("click", () => {
      setRosterAnswer("clip_cues", true);
      renderUnitTeamColourUI();
    });
    $("#btn-clip-cues-off")?.addEventListener("click", () => {
      setRosterAnswer("clip_cues", false);
      renderUnitTeamColourUI();
    });

    function clearToolButtonsExcept(keep) {
      ["btn-walls", "btn-objects", "btn-move", "btn-paint", "btn-fill"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("aria-pressed", id === keep && state.mapTool ? "true" : "false");
      });
      const railPaint = document.getElementById("rail-paint");
      if (railPaint) {
        const on = state.mapTool === "paint" || state.mapTool === "fill";
        railPaint.setAttribute("aria-pressed", on ? "true" : "false");
      }
      const pp = document.getElementById("paint-prefs");
      if (pp) pp.hidden = !(state.mapTool === "paint" || state.mapTool === "fill");
    }

    function setPaintOrFillTool(kind) {
      state.mapTool = state.mapTool === kind ? null : kind;
      state.walkRulesOverlay = false;
      if (state.placeMode) {
        state.placeMode = false;
        const pb = $("#place-banner");
        if (pb) pb.hidden = true;
      }
      clearToolButtonsExcept(state.mapTool === kind ? (kind === "paint" ? "btn-paint" : "btn-fill") : null);
      renderWallsPrefs();
      renderObjectsPrefs();
      renderGrid();
      toast(state.mapTool ? (kind === "paint" ? "Paint: drag to paint tiles" : "Fill: tap a region") : "Paint off");
      syncRailFromTool();
    }

    $("#btn-paint")?.addEventListener("click", () => setPaintOrFillTool("paint"));
    $("#btn-fill")?.addEventListener("click", () => setPaintOrFillTool("fill"));
    $$("[data-paint-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.paintTileType = btn.getAttribute("data-paint-type") || "floor";
        $$("[data-paint-type]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        toast(state.paintTileType.replace("_", " "));
      });
    });

    $("#btn-objects")?.addEventListener("click", () => {
      state.mapTool = state.mapTool === "objects" ? null : "objects";
      const mv2 = $("#btn-move");
      if (mv2) mv2.setAttribute("aria-pressed", "false");
      state.walkRulesOverlay = false;
      const ob = $("#btn-objects");
      const wb = $("#btn-walls");
      if (ob) ob.setAttribute("aria-pressed", state.mapTool === "objects" ? "true" : "false");
      if (wb) wb.setAttribute("aria-pressed", "false");
      const pb2 = $("#btn-paint"); if (pb2) pb2.setAttribute("aria-pressed", "false");
      const fb2 = $("#btn-fill"); if (fb2) fb2.setAttribute("aria-pressed", "false");
      const ppf = $("#paint-prefs"); if (ppf) ppf.hidden = true;
      if (state.placeMode) {
        state.placeMode = false;
        const pb = $("#place-banner");
        if (pb) pb.hidden = true;
      }
      renderWallsPrefs();
      renderObjectsPrefs();
      renderGrid();
      toast(state.mapTool === "objects" ? "Objects: tap a cell to place or remove" : "Objects off");
      syncRailFromTool();
    });

    $("#btn-walls")?.addEventListener("click", async () => {
      state.mapTool = state.mapTool === "walls" ? null : "walls";
      state.walkRulesOverlay = state.mapTool === "walls";
      const mv = $("#btn-move");
      if (mv) mv.setAttribute("aria-pressed", "false");
      const btn = $("#btn-walls");
      const ob = $("#btn-objects");
      if (btn) btn.setAttribute("aria-pressed", state.mapTool === "walls" ? "true" : "false");
      if (ob) ob.setAttribute("aria-pressed", "false");
      const pbw = $("#btn-paint"); if (pbw) pbw.setAttribute("aria-pressed", "false");
      const fbw = $("#btn-fill"); if (fbw) fbw.setAttribute("aria-pressed", "false");
      const ppw = $("#paint-prefs"); if (ppw) ppw.hidden = true;
      if (state.placeMode) {
        state.placeMode = false;
        const pb = $("#place-banner");
        if (pb) pb.hidden = true;
      }
      if (state.project && ProjectStore.setMapEditorPrefs) {
        const st = ProjectStore.getStage(state.project, state.currentStageId);
        if (st) {
          await ProjectStore.setMapEditorPrefs(ProjectStore.manifest(state.project).project.id, st.mapRef, {
            walkRulesOverlay: state.walkRulesOverlay,
            activeLayer: state.walkRulesOverlay ? "logic" : state.activeLayer || "ground",
          });
        }
      }
      renderGrid();
      renderWallsPrefs();
      renderObjectsPrefs();
      toast(state.mapTool === "walls" ? "Walls: tap near a tile edge" : "Walls off");
      syncRailFromTool();
    });

    $("#btn-stage-play")?.addEventListener("click", () => {
      const hard = hardBlockers({ forRender: false });
      if (hard.length) {
        toast("Can't play yet: " + hardPlain(hard[0]));
        jumpToHardError(hard[0]);
        return;
      }
      show("loadout");
    });
    $("#btn-add-stage")?.addEventListener("click", () => {
      if (!state.project) return;
      const map = ProjectStore.addStage(state.project, state.catalogueDoc);
      state.currentStageId = map.id;
      persistProject();
      renderStageSelect();
      toast("Stage added");
    });
    $("#btn-loadout-play")?.addEventListener("click", () => {
      if (!state.loadoutSelected.length) {
        toast("Pick at least one unit");
        return;
      }
      tryPlay();
    });
    $("#btn-loadout-preview")?.addEventListener("click", () => {
      if (!state.loadoutSelected.length) {
        toast("Pick at least one unit");
        return;
      }
      const hard = hardBlockers({ forRender: false });
      if (hard.length) {
        toast("Can't preview yet: " + hardPlain(hard[0]));
        jumpToHardError(hard[0]);
        return;
      }
      show("preview");
    });
    $("#btn-export-project")?.addEventListener("click", () => {
      if (state.project) ProjectStore.exportPlaceholder(state.project);
      toast("Export downloaded (JSON placeholder)");
    });
    // Preview notes → notes/notes.json
    $("#preview-notes")?.addEventListener("change", () => {
      const text = $("#preview-notes").value.trim();
      if (!text || !state.project) return;
      ProjectStore.addNote(state.project, text, {
        stageId: state.currentStageId,
        playMs: 0,
        turn: null,
        projectRev: ProjectStore.manifest(state.project).project.rev,
        godmode: [
          { setupId: null, knobId: "hp", value: state.god.hp },
          { setupId: null, knobId: "dmg", value: state.god.dmg },
          { setupId: null, knobId: "mana", value: state.god.mana },
        ],
      });
      persistProject();
      toast("Note saved to project");
    });
    $("#popup-backdrop")?.addEventListener("click", closeUnitMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeUnitMenu();
    });
    // card hand taps → toast only
    $$(".hand-card").forEach((c) =>
      c.addEventListener("click", () => toast(c.getAttribute("aria-label") + " (placeholder)"))
    );
    $$(".popup-row").forEach((c) =>
      c.addEventListener("click", () => {
        if (c.id === "popup-row-cards") {
          state.handOpenFromMenu = true;
          const hand = $("#card-hand");
          if (hand) hand.hidden = false;
          closeUnitMenu();
          toast("Hand opened");
          return;
        }
        toast(c.textContent.trim() + " (placeholder)");
        closeUnitMenu();
      })
    );
    $("#btn-dev-on")?.addEventListener("click", () => {
      state.previewDev = true;
      renderPreview();
    });
    $("#btn-dev-off")?.addEventListener("click", () => {
      state.previewDev = false;
      renderPreview();
    });
    $$("[data-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.previewStage = Number(btn.getAttribute("data-stage"));
        renderPreview();
      });
    });
    ["hp", "dmg", "mana"].forEach((k) => {
      const id = k === "hp" ? "god-hp" : k === "dmg" ? "god-dmg" : "god-mana";
      $("#" + id)?.addEventListener("input", (e) => {
        state.god[k] = Number(e.target.value);
        const val = $("#" + id + "-val");
        if (val) val.textContent = String(state.god[k]);
      });
    });

    $$("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const to = btn.getAttribute("data-nav");
        if (to === "sprite-upload") {
          const cur = document.querySelector(".screen.active");
          const curId = cur && cur.id ? cur.id.replace(/^screen-/, "") : "stage";
          state.spriteReturn = curId === "sprite-upload" ? (state.spriteReturn || "stage") : curId;
        }
        if (to === "place-unit") {
          state.placeMode = true;
          show("place-unit");
          return;
        }
        if (to === "play") {
          tryPlay();
          return;
        }
        if (to === "preview") {
          const hard = hardBlockers({ forRender: false });
          if (hard.length) {
            toast("Can't preview yet: " + hardPlain(hard[0]));
            jumpToHardError(hard[0]);
            return;
          }
          show("preview");
          updatePlayBanner();
          return;
        }
        if (to === "render") {
          show("render");
          updatePlayBanner();
          return;
        }
        if (to === "wizard-next") {
          wizardNext(btn.getAttribute("data-from"));
          return;
        }
        if (to === "wizard-back") {
          wizardBack(btn.getAttribute("data-from"));
          return;
        }
        if (to === "stage") state.placeMode = false;
        if (to === "assign-behaviour" && !state.draftDoc && !state.selectedBehaviourId) {
          show("pick-behaviour");
          return;
        }
        if (to === "behaviour-summary" && !activeDoc()) {
          show("unit-editor");
          return;
        }
        show(to);
      });
    });

    $$('[data-nav="sliders"]').forEach((b) => b.setAttribute("data-nav", "unit-editor"));

    const file = $("#sprite-file");
    file?.addEventListener("change", async () => {
      const f = file.files && file.files[0];
      if (!f) return;
      if (!window.SpriteSlice) {
        toast("Slice helper missing");
        return;
      }
      try {
        const loaded = await SpriteSlice.loadImageFromFile(f);
        state.spriteName = loaded.name;
        if (state.spriteUrl) URL.revokeObjectURL(state.spriteUrl);
        state.spriteUrl = loaded.url;
        const srcCanvas = SpriteSlice.draw(loaded.img, loaded.img.width, loaded.img.height);
        const T0 = state.tileSize || 32;
        // Try project tile first, then common sizes, so walk sheets still detect
        let det = null;
        let tile = T0;
        let detTile = T0;
        for (const cand of [T0, 32, 16, 24, 48, 64]) {
          const d = SpriteSlice.detectFrames(srcCanvas.width, srcCanvas.height, cand);
          if (d && (!det || d.score > det.score)) {
            det = d;
            detTile = cand;
          }
        }
        tile = det && (det.rows === 4 || det.fh !== detTile) ? detTile : tile;
        if (srcCanvas.width % tile !== 0 || srcCanvas.height % tile !== 0) {
          for (const c of [32, 16, 24, 48, 64]) {
            if (srcCanvas.width % c === 0 && srcCanvas.height % c === 0) {
              tile = c;
              break;
            }
          }
        }
        const isSprite = !!(det && (det.rows === 4 || det.rows === 1 || det.fh !== tile || det.fw !== tile));
        state.spriteSlice = {
          originalCanvas: srcCanvas,
          srcCanvas: srcCanvas,
          name: loaded.name,
          url: loaded.url,
          tile: tile,
          cols: Math.max(1, Math.floor(srcCanvas.width / (isSprite ? det.fw : tile))),
          rows: Math.max(1, Math.floor(srcCanvas.height / (isSprite ? det.fh : tile))),
          result: null,
          detect: det,
          ops: [],
          mode: isSprite ? "sprite" : "tileset",
          fw: isSprite ? det.fw : tile,
          fh: isSprite ? det.fh : tile,
          clipNames: isSprite ? SpriteSlice.clipNames(det.rows) : null,
        };
        renderUpload();
        toast("Loaded · auto-slice ready — exact repeats only");
      } catch (e) {
        toast("Couldn't read that image");
      }
    });

    // Slice steppers / accept
    $$("[data-slice-tile]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.spriteSlice) return;
        state.spriteSlice.tile = Number(btn.getAttribute("data-slice-tile"));
        const w = state.spriteSlice.srcCanvas.width;
        const h = state.spriteSlice.srcCanvas.height;
        const T = state.spriteSlice.tile;
        if (state.spriteSlice.mode !== "sprite") {
          state.spriteSlice.fw = T;
          state.spriteSlice.fh = T;
        }
        state.spriteSlice.cols = Math.max(1, Math.floor(w / T));
        state.spriteSlice.rows = Math.max(1, Math.floor(h / T));
        renderSpriteSlicePanel();
      });
    });
    $("#slice-cols-dec")?.addEventListener("click", () => adjustSliceGrid("cols", -1));
    $("#slice-cols-inc")?.addEventListener("click", () => adjustSliceGrid("cols", 1));
    $("#slice-rows-dec")?.addEventListener("click", () => adjustSliceGrid("rows", -1));
    $("#slice-rows-inc")?.addEventListener("click", () => adjustSliceGrid("rows", 1));
    $("#btn-slice-accept")?.addEventListener("click", () => acceptSpriteSlice());

    window.__openBehaviour = openBehaviour;
    window.__seedFlagged = function () {
      // create/open action-budget with ban values via store
      const created = S.createSetup("action-budget", state.catalogueDoc, "Action Budget");
      if (!created.doc) return;
      let doc = created.doc;
      let r = S.editAnswer(doc, "actions_per_turn", 1, doc.rev, state.catalogueDoc);
      if (r.doc) doc = r.doc;
      r = S.editAnswer(doc, "solo_hero_actions", 2, doc.rev, state.catalogueDoc);
      if (r.doc) doc = r.doc;
      const u = selectedUnit();
      if (!u) return;
      const entry = { id: "flagged-ab", doc, notices: [] };
      u.setups = u.setups.filter((s) => s.id !== "flagged-ab");
      u.setups.push(entry);
      state.activeSetupId = entry.id;
      show("behaviour-summary");
    };
    window.__seedNoDefault = function () {
      const created = S.createSetup("trap-tile", state.catalogueDoc, "Trap tile");
      if (!created.doc) return;
      const loaded = S.loadSetup(created.doc, state.catalogueDoc);
      const u = selectedUnit();
      const entry = { id: "seed-trap", doc: loaded.doc, notices: loaded.notices };
      u.setups.push(entry);
      state.activeSetupId = entry.id;
      show("behaviour-summary");
    };
    window.__state = state;
    window.__pushPaintStroke = pushPaintStroke; // r65 StageLive undo steps
    window.__persistProject = () => { if (typeof persistProject === "function") persistProject(); };
    
    $("#btn-god-save")?.addEventListener("click", () => {
      const sheet = $("#godmode-save-sheet");
      if (sheet) sheet.hidden = false;
      setPressed("god-what", state.godWhat || "unit-stat");
      setPressed("god-where", state.godWhere || "this-stage");
    });
    $("#btn-god-cancel")?.addEventListener("click", () => {
      const sheet = $("#godmode-save-sheet");
      if (sheet) sheet.hidden = true;
    });
    $("#btn-god-confirm")?.addEventListener("click", () => {
      const u = selectedUnit();
      const unitId = u ? "shell-" + u.id : null;
      const hp = Number($("#god-hp")?.value || 20);
      const res = ProjectStore.saveBackGodmode(state.project, state.catalogueDoc, {
        what: state.godWhat || "unit-stat",
        where: state.godWhere || "this-stage",
        unitId,
        statId: "unit_hp",
        value: hp,
        stageId: state.currentStageId,
        setupId: ProjectStore.listSetups(state.project).find((s) => s.behaviourId === "unit-roster")?.id,
        knobId: "unit_hp",
        SetupStore,
      });
      const sheet = $("#godmode-save-sheet");
      if (sheet) sheet.hidden = true;
      persistProject();
      toast(res && res.ok ? "Saved" : "Could not save");
      syncUnitsFromProject();
    });
    $("#btn-play-anyway")?.addEventListener("click", () => {
      const banner = $("#play-anyway-banner");
      if (banner && banner.dataset.mode === "hard") {
        const miss = hardBlockers({ forRender: false })[0];
        if (miss) {
          const ok = jumpToHardError(miss);
          if (!ok) {
            toast("Can't play yet: " + hardPlain(miss));
            show("stage");
          }
          return; // never fall through to play
        }
        toast("Can't play yet — fix hard errors first");
        show("stage");
        return;
      }
      // warnings only
      toast("Playing anyway (shell placeholder)");
      show("play");
    });
    $("#btn-stat-hp-reset")?.addEventListener("click", () => {
      const u = selectedUnit();
      if (!u || !state.project) return;
      ProjectStore.setUnitStat(state.project, state.catalogueDoc, "shell-" + u.id, "unit_hp", null);
      persistProject();
      syncUnitsFromProject();
      renderUnitStatsInherit();
      toast("HP inherits army default");
    });
    $("#btn-stat-atk-reset")?.addEventListener("click", () => {
      const u = selectedUnit();
      if (!u || !state.project) return;
      ProjectStore.setUnitStat(state.project, state.catalogueDoc, "shell-" + u.id, "unit_atk", null);
      persistProject();
      syncUnitsFromProject();
      renderUnitStatsInherit();
      toast("Attack inherits army default");
    });
    // unit editor sliders write stats
    $("#stat-hp")?.addEventListener("input", (e) => {
      const u = selectedUnit();
      if (!u || !state.project) return;
      const v = Number(e.target.value);
      $("#stat-hp-val").textContent = String(v);
      ProjectStore.setUnitStat(state.project, state.catalogueDoc, "shell-" + u.id, "unit_hp", v);
      u.hp = v;
      persistProject();
      renderUnitStatsInherit();
    });
    $("#stat-atk")?.addEventListener("input", (e) => {
      const u = selectedUnit();
      if (!u || !state.project) return;
      const v = Number(e.target.value);
      $("#stat-atk-val").textContent = String(v);
      ProjectStore.setUnitStat(state.project, state.catalogueDoc, "shell-" + u.id, "unit_atk", v);
      u.atk = v;
      persistProject();
      renderUnitStatsInherit();
    });

    
    $("#diff-hp")?.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      $("#diff-hp-val").textContent = v.toFixed(1);
      if (!state.project) return;
      const cur = ProjectStore.effectiveDifficulty(state.project);
      ProjectStore.setProjectDifficulty(state.project, Object.assign({}, cur, { hp: v }));
      persistProject();
    });
    $("#diff-dmg")?.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      $("#diff-dmg-val").textContent = v.toFixed(1);
      if (!state.project) return;
      const cur = ProjectStore.effectiveDifficulty(state.project);
      ProjectStore.setProjectDifficulty(state.project, Object.assign({}, cur, { damage: v }));
      persistProject();
    });
    $("#ease-ms")?.addEventListener("input", (e) => {
      const v = Math.round(Number(e.target.value));
      $("#ease-ms-val").textContent = v + " ms";
      if (!state.project) return;
      ProjectStore.manifest(state.project).project.settings.camera.easeMs = v;
      persistProject();
    });
    $("#stage-diff-hp")?.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      ProjectStore.setStageDifficultyField(state.project, state.currentStageId, "hp", v);
      persistProject();
      renderStageDifficulty();
    });
    $("#stage-diff-dmg")?.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      ProjectStore.setStageDifficultyField(state.project, state.currentStageId, "damage", v);
      persistProject();
      renderStageDifficulty();
    });
    $("#btn-stage-diff-hp-reset")?.addEventListener("click", () => {
      ProjectStore.setStageDifficultyField(state.project, state.currentStageId, "hp", null);
      persistProject();
      renderStageDifficulty();
    });
    $("#btn-stage-diff-dmg-reset")?.addEventListener("click", () => {
      ProjectStore.setStageDifficultyField(state.project, state.currentStageId, "damage", null);
      persistProject();
      renderStageDifficulty();
    });

    window.applyEnemyMode = applyEnemyMode;
    window.renderTileLegend = renderTileLegend;
    window.renderEnemyPool = renderEnemyPool;
    window.renderAdvancedRenderUI = renderAdvancedRenderUI;
    window.renderStageDifficulty = renderStageDifficulty;
    window.renderUnitStatsInherit = renderUnitStatsInherit;
    window.renderBuildSize = renderBuildSize;
    window.syncRenderTargetButtons = syncRenderTargetButtons;
    window.renderCreditsUI = renderCreditsUI;
    window.resolveTeamColour = resolveTeamColour;
    window.renderGrid = renderGrid;
    window.resolveTeamColour = resolveTeamColour;
    window.renderWallsPrefs = renderWallsPrefs;
    window.renderObjectsPrefs = renderObjectsPrefs;
    window.renderUnitTeamColourUI = renderUnitTeamColourUI;
    window.applyPlatformTileSuggestion = applyPlatformTileSuggestion;
    window.platformLabel = platformLabel;
    window.renderTileSizeSuggestion = renderTileSizeSuggestion;
    window.renderSettingsTileSizeHint = renderSettingsTileSizeHint;
    
    // Stage camera: whole-step pinch zoom + pan. Rule:
    //  - Move tool: one finger pans
    //  - Paint tools (walls/objects): one finger paints (drag), two fingers pan/zoom
    //  - Otherwise: one finger taps/selects; two fingers pan/zoom
    (function bindStageCameraGestures() {
      const scroll = document.getElementById("stage-scroll");
      if (!scroll) return;
      const pts = new Map();
      let pinch0 = null;
      let panStart = null;
      let painting = false;
      let lastPaintKey = null;

      const isPaintTool = () => state.mapTool === "walls" || state.mapTool === "objects" || state.mapTool === "paint";
      const isMoveTool = () => state.mapTool === "move";

      const cellFromPoint = (clientX, clientY) => {
        const grid = document.getElementById("stage-grid");
        if (!grid) return null;
        const cells = grid.querySelectorAll(".cell");
        for (const cell of cells) {
          const r = cell.getBoundingClientRect();
          if (clientX >= r.left && clientX < r.right && clientY >= r.top && clientY < r.bottom) {
            return { x: Number(cell.dataset.x), y: Number(cell.dataset.y), cell: cell };
          }
        }
        return null;
      };

      const paintAt = (clientX, clientY, ev) => {
        const hit = cellFromPoint(clientX, clientY);
        if (!hit) return;
        const key = hit.x + "," + hit.y + (state.mapTool === "walls" && ev ? ":" + (nearestEdgeFromClick(ev, hit.cell) || "") : "");
        if (key === lastPaintKey) return;
        lastPaintKey = key;
        const unit = state.units.find((u) => u.x === hit.x && u.y === hit.y);
        // Forge a minimal event for edge detection
        const fake = ev || { clientX: clientX, clientY: clientY };
        onCell(hit.x, hit.y, unit, hit.cell, fake);
      };

      scroll.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".stage-tools, .stage-rail, .stage-sheet, .stage-top, .stage-fab-undo, .stage-status-chip, .minimap-chip, .minimap, .walls-prefs, .unit-ability-popup, .card-hand, .popup-backdrop")) return;
        scroll.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, e);
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          pinch0 = {
            d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
            z: state.stageZoom,
            cx: (a.clientX + b.clientX) / 2 - scroll.getBoundingClientRect().left,
            cy: (a.clientY + b.clientY) / 2 - scroll.getBoundingClientRect().top,
          };
          painting = false;
          panStart = null;
          return;
        }
        panStart = { x: e.clientX, y: e.clientY, ox: state.stagePanX || 0, oy: state.stagePanY || 0 };
        lastPaintKey = null;
        if (isPaintTool() && !isMoveTool()) {
          painting = true;
          state.paintStroke = [];
          paintAt(e.clientX, e.clientY, e);
        } else if (isMoveTool()) {
          painting = false;
        } else {
          painting = false; // tap handled by cell click
        }
      });

      scroll.addEventListener("pointermove", (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, e);
        if (pinch0 && pts.size === 2) {
          e.preventDefault();
          const [a, b] = [...pts.values()];
          const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          const midX = (a.clientX + b.clientX) / 2 - scroll.getBoundingClientRect().left;
          const midY = (a.clientY + b.clientY) / 2 - scroll.getBoundingClientRect().top;
          // Zoom around the midpoint between the two fingers
          const ratio = d / Math.max(1, pinch0.d);
          const step = effectivePixelPerfect() ? 0.5 : 0.125;
          let next = pinch0.z * ratio;
          if (Math.abs(next - state.stageZoom) >= step) {
            setStageZoom(next, midX, midY); // cx/cy = midpoint → zoom about fingers
            pinch0.z = state.stageZoom;
            pinch0.d = d;
          }
          // two-finger pan of the midpoint
          const dx = midX - pinch0.cx;
          const dy = midY - pinch0.cy;
          if (dx || dy) {
            state.stagePanX = (state.stagePanX || 0) + dx;
            state.stagePanY = (state.stagePanY || 0) + dy;
            pinch0.cx = midX;
            pinch0.cy = midY;
            applyStageCamera();
            renderMinimap();
          }
          return;
        }
        if (painting && isPaintTool()) {
          paintAt(e.clientX, e.clientY, e);
          return;
        }
        if (panStart && (isMoveTool() || state.stageZoom > 1 || pts.size === 1 && isMoveTool())) {
          if (isMoveTool() || (pts.size === 1 && !isPaintTool() && state.stageZoom > 1 && Math.hypot(e.clientX - panStart.x, e.clientY - panStart.y) > 10)) {
            // Move tool always pans; at zoom>1 allow one-finger pan when not painting
            if (isMoveTool() || !isPaintTool()) {
              state.stagePanX = panStart.ox + e.clientX - panStart.x;
              state.stagePanY = panStart.oy + e.clientY - panStart.y;
              applyStageCamera();
            }
          }
        }
      });

      const up = (e) => {
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch0 = null;
        if (!pts.size) {
          if (painting) {
            if (state.paintStroke && state.paintStroke.length) {
              pushPaintStroke(state.paintStroke);
              toast("Stroke · " + state.paintStroke.length + " change" + (state.paintStroke.length === 1 ? "" : "s"));
            }
            state._paintGestureHandled = true; // swallow cell click that follows pointerup
          }
          state.paintStroke = null;
          painting = false;
          panStart = null;
          lastPaintKey = null;
          clampStagePan();
          renderMinimap();
        }
      };
      scroll.addEventListener("pointerup", up);
      scroll.addEventListener("pointercancel", up);
      scroll.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          const r = scroll.getBoundingClientRect();
          setStageZoom(state.stageZoom + (e.deltaY < 0 ? 1 : -1), e.clientX - r.left, e.clientY - r.top);
        },
        { passive: false }
      );
    })();

    $("#btn-zoom-in")?.addEventListener("click", () => setStageZoom(state.stageZoom + (effectivePixelPerfect() ? 1 : 0.25)));
    $("#btn-zoom-out")?.addEventListener("click", () => setStageZoom(state.stageZoom - (effectivePixelPerfect() ? 1 : 0.25)));
    $("#btn-stage-undo")?.addEventListener("click", () => undoPaintStroke());
    $("#btn-frac-zoom")?.addEventListener("click", () => {
      if (!state.project || !window.ProjectStore) return;
      if (!ProjectStore.effectiveAdvancedRender(state.project)) {
        toast("Turn on Advanced render in Settings first");
        return;
      }
      const cam = ProjectStore.manifest(state.project).project.settings.camera || {};
      cam.pixelPerfect = cam.pixelPerfect === false;
      ProjectStore.manifest(state.project).project.settings.camera = cam;
      persistProject();
      updateFracZoomChrome();
      // snap current zoom
      setStageZoom(state.stageZoom);
      toast(cam.pixelPerfect === false ? "½ steps on — may blur art" : "Whole steps only");
    });
    $("#stage-minimap")?.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      if (e.target.closest(".mm-btns")) return;
      minimapJump(e.clientX, e.clientY);
    });
    $("#btn-mm-whole")?.addEventListener("click", (e) => {
      e.stopPropagation();
      minimapWholeMap();
    });
    $("#btn-mm-units")?.addEventListener("click", (e) => {
      e.stopPropagation();
      minimapJumpToUnits();
    });
    $("#btn-move")?.addEventListener("click", () => {
      state.mapTool = state.mapTool === "move" ? null : "move";
      state.walkRulesOverlay = false;
      const mb = $("#btn-move");
      if (mb) mb.setAttribute("aria-pressed", state.mapTool === "move" ? "true" : "false");
      const wb = $("#btn-walls");
      if (wb) wb.setAttribute("aria-pressed", "false");
      const ob = $("#btn-objects");
      if (ob) ob.setAttribute("aria-pressed", "false");
      const pbm = $("#btn-paint"); if (pbm) pbm.setAttribute("aria-pressed", "false");
      const fbm = $("#btn-fill"); if (fbm) fbm.setAttribute("aria-pressed", "false");
      const ppm = $("#paint-prefs"); if (ppm) ppm.hidden = true;
      if (window.renderWallsPrefs) renderWallsPrefs();
      if (window.renderObjectsPrefs) renderObjectsPrefs();
      toast(state.mapTool === "move" ? "Move: drag to pan" : "Move off");
      renderGrid();
      syncRailFromTool();
    });


    // --- Lean stage chrome (rail / sheet / chip / overflow) ---
    function closeOverflowMenu() {
      const m = $("#stage-overflow-menu");
      const b = $("#btn-stage-overflow");
      if (m) m.hidden = true;
      if (b) b.setAttribute("aria-expanded", "false");
    }
    $("#btn-stage-overflow")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const m = $("#stage-overflow-menu");
      const b = $("#btn-stage-overflow");
      if (!m) return;
      const open = m.hidden;
      m.hidden = !open;
      if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $("#stage-overflow-menu")?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-nav]");
      if (item) closeOverflowMenu();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#stage-overflow-menu, #btn-stage-overflow")) closeOverflowMenu();
    });

    $("#btn-sheet-collapse")?.addEventListener("click", () => closeStageSheet());

    $("#rail-paint")?.addEventListener("click", () => {
      if (state.mapTool === "paint" || state.mapTool === "fill") {
        // already painting — just ensure sheet open; second tap on paint in sheet toggles off
        if (state.stageSheetMode === "paint") {
          setPaintOrFillTool(state.mapTool === "fill" ? "fill" : "paint"); // toggle off
        } else {
          setStageSheet("paint");
          const pp = $("#paint-prefs");
          if (pp) pp.hidden = false;
        }
      } else {
        setPaintOrFillTool("paint");
      }
    });
    $("#rail-units")?.addEventListener("click", () => {
      if (state.stageSheetMode === "units") closeStageSheet();
      else {
        // clear map tools so empty taps can collapse later
        if (state.mapTool && state.mapTool !== "move") {
          state.mapTool = null;
          state.walkRulesOverlay = false;
          clearToolButtonsExcept(null);
          if (window.renderWallsPrefs) renderWallsPrefs();
          if (window.renderObjectsPrefs) renderObjectsPrefs();
          renderGrid();
        }
        setStageSheet("units");
      }
    });
    $("#rail-more")?.addEventListener("click", () => {
      if (state.stageSheetMode === "more") closeStageSheet();
      else {
        if (state.mapTool) {
          state.mapTool = null;
          state.walkRulesOverlay = false;
          clearToolButtonsExcept(null);
          if (window.renderWallsPrefs) renderWallsPrefs();
          if (window.renderObjectsPrefs) renderObjectsPrefs();
          renderGrid();
        }
        setStageSheet("more");
      }
    });

    $("#btn-minimap-chip")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.minimapExpanded = !state.minimapExpanded;
      renderMinimap();
    });
    $("#btn-mm-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.minimapExpanded = false;
      renderMinimap();
    });

    $("#btn-stage-status-dismiss")?.addEventListener("click", () => {
      state.statusChipDismissed = true;
      const chip = $("#stage-status-chip");
      if (chip) chip.hidden = true;
    });
    $("#btn-stage-status-action")?.addEventListener("click", () => {
      const hard = hardBlockers({ forRender: false });
      const warns = warningRows();
      if (hard.length) {
        jumpToHardError(hard[0]);
        return;
      }
      if (warns.length) {
        // Mirror Play anyway
        const btn = $("#btn-play-anyway");
        if (btn) btn.click();
        else {
          state.statusChipDismissed = true;
          updatePlayBanner();
          show("loadout");
        }
      }
    });

    // When walls/objects rail is tapped while already active, sheet still toggles closed via syncRailFromTool.
    // Opening walls/objects when sheet closed: handlers already call syncRailFromTool.

    // Wizard peek
    $$("[data-peek-for]").forEach((btn) => {
      btn.addEventListener("click", () => openWizardPeek(btn.getAttribute("data-peek-for")));
    });
    $("#btn-peek-close")?.addEventListener("click", () => closeWizardPeek());
    $("#wizard-peek")?.addEventListener("click", (e) => {
      if (e.target.id === "wizard-peek") closeWizardPeek();
    });
    bindWizardAdvancedScroll();

    window.__addUnitAt = (x, y, name) => {
      const u = { id: state.nextId++, name: name || ("Unit " + (state.nextId - 1)), x, y, hp: 8, atk: 1, setups: [] };
      state.units.push(u);
      state.selectedUnitId = u.id;
      renderGrid();
      return u;
    };
    window.__toggleEdge = (c, r, side) => {
      if (!state.project || !window.ProjectStore) return;
      const st = ProjectStore.getStage(state.project, state.currentStageId);
      if (!st || !st.mapRef) return;
      ProjectStore.toggleMapEdge(state.project, st.mapRef, { c, r, side });
      persistProject();
      renderGrid();
    };
    window.__openUnitAt = (x, y) => {
      const unit = state.units.find((u) => u.x === x && u.y === y);
      if (!unit) return false;
      state.selectedUnitId = unit.id;
      renderGrid();
      const cell = document.querySelector('#stage-grid .cell[data-x="' + x + '"][data-y="' + y + '"]');
      openUnitMenu(unit, cell);
      return true;
    };
    window.__setMapTool = (t) => {
      state.mapTool = t;
      state.walkRulesOverlay = t === "walls";
      const setP = (id, on) => { const el = document.getElementById(id); if (el) el.setAttribute("aria-pressed", on ? "true" : "false"); };
      setP("btn-walls", t === "walls");
      setP("btn-objects", t === "objects");
      setP("btn-move", t === "move");
      setP("btn-paint", t === "paint");
      setP("btn-fill", t === "fill");
      const pp = document.getElementById("paint-prefs");
      if (pp) pp.hidden = !(t === "paint" || t === "fill");
      renderGrid();
      if (window.renderObjectsPrefs) renderObjectsPrefs();
      if (window.renderWallsPrefs) renderWallsPrefs();
      syncRailFromTool();
    };
    window.updatePlayBanner = updatePlayBanner;
    window.__show = show;
    window.applyStageCamera = applyStageCamera;
    window.setStageZoom = setStageZoom;
    window.hardBlockers = hardBlockers;
    window.warningRows = warningRows;
    window.jumpToHardError = jumpToHardError;
    window.hardPlain = hardPlain;
    window.setPressed = setPressed;
    window.__state = state;
    window.__setPresentation = async function (shortcut, basic, spells, hand) {
      state.abilityPick = shortcut || "all-menu";
      if (basic) state.basicStyle = basic;
      if (spells) state.spellsStyle = spells;
      if (hand) state.handPlacement = hand;
      if (state.project && window.ProjectStore) {
        ProjectStore.setPresentation(state.project, state.catalogueDoc, state.abilityPick, SetupStore);
        if (basic) ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "basic_style", basic, SetupStore);
        if (spells) ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "spells_style", spells, SetupStore);
        if (hand) ProjectStore.setPresentationKnob(state.project, state.catalogueDoc, "hand_placement", hand, SetupStore);
        await persistProject();
      }
      syncPresentationStateFromProject();
      renderAbilityPanels();
      renderStageOverlays();
    };
    window.__forceSizeWarn = function () {
      const banner = $("#size-warn");
      if (banner) {
        banner.hidden = false;
        banner.textContent = "This project is getting large (2048 KB). Nothing is blocked — just a heads-up.";
      }
    };
    window.__S = S;

    window.addEventListener("hashchange", routeFromHash);
    routeFromHash();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
