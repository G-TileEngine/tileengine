/* TileEngine project store — project-format.md r7 via OPFS (web). */
(function (global) {
  "use strict";

  const LEGACY_VFS = "tileengine.project-vfs.v1"; // import-only
  const LEGACY_PRESETS = "tileengine.presets.v1";
  const LEGACY_PRESET_LIB = "tileengine.preset-library.v1";
  const LEGACY_PRESET_EMBED = "tileengine.preset-embed.v1";
  const OPFS_PROJECTS = "tileengine/projects";
  const OPFS_PRESETS = "tileengine/presets";
  const OPFS_EDITOR_PREFS = "tileengine/editor-prefs.json";
  const SIZE_WARN_BYTES = 1_500_000;
  const BUILD_WARN_MB = 50;
  const BUILD_STRONG_MB = 150;
  const ARMY_HP = 9;
  const ARMY_ATK = 1;
  /** project-format §3.1 / §16 — editor-only; never stored. Only source for wizard seed. */
  const TILE_SIZE_SUGGESTION = { mobile: 64, pc: 48, both: 64 };

  /** docs/target-size-limits.md "Decoded memory" — warn / strong, never block. MB. */
  const DECODED_THRESHOLDS = {
    ios: { stage_peak: { warn: 160, strong: 224 }, total: { warn: 320, strong: 448 } },
    android: { stage_peak: { warn: 160, strong: 240 }, total: { warn: 360, strong: 512 } },
    web_mobile: { stage_peak: { warn: 160, strong: 224 }, total: { warn: 320, strong: 448 } },
    web_desktop: { stage_peak: { warn: 384, strong: 512 }, total: { warn: 768, strong: 1280 } },
  };
  const CHUNK_CACHE_MB = { phone: 96, desktop: 256 };
  /** Stock wall line when map.wallLook / Edge.look absent (Architect; never written). */
  /** Engine Architect r9 stock line — never written when absent. Width depends on tileSize. */
  const STOCK_WALL_COLOUR = "#20242C";
  function stockWallWidth(tileSize) {
    const tsz = Math.max(1, Number(tileSize) || 64);
    return Math.max(1, Math.round(tsz / 16));
  }
  function stockWallLook(tileSize) {
    return { mode: "line", colour: STOCK_WALL_COLOUR, width: stockWallWidth(tileSize) };
  }

  const nowIso = () => new Date().toISOString();
  const ulid = (p) => p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clone = (x) => JSON.parse(JSON.stringify(x));

  let opfsAvailable = null;
  let opfsNote = null;

  function emptyHistory() {
    return { cap: 200, baseSeq: 0, ops: [] };
  }

  function emptyNotes() {
    return { kind: "project-notes", formatVersion: 2, rev: 0, notes: [] };
  }

  function emptyLoadout() {
    return { roster: [], size: 4, required: [] };
  }

  function emptyEnemyPool(mode) {
    mode = mode || "fixed";
    if (mode === "weighted") return { mode: "weighted", picks: 0, allowRepeats: false, spawns: [], entries: [] };
    if (mode === "waves") return { mode: "waves", spawns: [], waves: [] };
    return { mode: "fixed", entries: [] };
  }

  function emptyOverrides() {
    return { setups: {}, units: {} };
  }

  function emptyManifest(catalogueRev, name) {
    const id = ulid("project");
    const at = nowIso();
    return {
      kind: "tile-project",
      formatVersion: 4,
      project: {
        id,
        rev: 0,
        name: name || "Untitled project",
        createdAt: at,
        updatedAt: at,
        copiedFrom: null,
        catalogueRev: catalogueRev != null ? catalogueRev : 0,
        settings: {
          platform: "mobile",
          combat: "grid-tactics",
          advancedRender: false,
          camera: {
            view: "top-down",
            follow: "fixed",
            zoom: 1,
            zoomMin: 1,
            zoomMax: 6,
            pixelPerfect: true,
            followDeadZone: 0.6,
            easeMs: 120,
            edgePan: false,
          },
          tileSize: TILE_SIZE_SUGGESTION.mobile,
          fog: false,
          wrapEdges: false,
          screenFit: "letterbox",
          letterboxColour: "#000000",
          maxImageSide: 4096,
          runLayer: "open-world",
        },
        difficulty: { hp: 1.0, damage: 1.0, appliesTo: "enemies" },
        stages: [],
        rules: [],
        loadout: emptyLoadout(),
        render: { excludedStages: [], targets: ["browser", "android", "ios"], proceduralShip: "auto", credits: true, creditsText: null },
        assets: {},
      },
      extensions: {},
      index: null,
    };
  }

  function makeSlice(catalogue, behaviourIds) {
    const want = new Set(behaviourIds || []);
    const behaviours = (catalogue.behaviours || [])
      .filter((b) => !want.size || want.has(b.id))
      .map((b) => {
        const copy = clone(b);
        delete copy.sources;
        delete copy.variants;
        delete copy.used_by;
        delete copy.conflicts;
        delete copy.needs_reverify;
        (copy.knobs || []).forEach((k) => {
          delete k.default_source;
        });
        return copy;
      });
    return {
      kind: "catalogue-slice",
      formatVersion: 1,
      schema_version: catalogue.schema_version,
      catalogue_rev: catalogue.catalogue_rev,
      behaviours,
    };
  }


  function migrateMapToV3(map) {
    const m = clone(map);
    if (m.formatVersion >= 3) return m;
    const terrain = m.terrain || (m.logic && m.logic.terrain) || Array((m.cols || 1) * (m.rows || 1)).fill(0);
    const tileset = m.tileset != null ? m.tileset : null;
    m.layers = m.layers || [
      { id: "ground", name: "Ground", tileset, aboveUnits: false, visible: true, tiles: terrain.slice() },
    ];
    m.logic = m.logic || { terrain: terrain.slice() };
    m.tile = m.tile !== undefined ? m.tile : null;
    m.background = m.background || { mode: "none", fit: "none" };
    delete m.tileset;
    delete m.terrain;
    m.formatVersion = 3;
    m.kind = "map";
    return m;
  }


  /** map 003: v3 → v4 — legend → palette, add edges */
  function migrateMapToV4(map, catalogue) {
    const m = migrateMapToV3(map);
    if (m.formatVersion >= 4) {
      m.logic = m.logic || { terrain: [], palette: { "0": "floor" }, edges: [] };
      if (!m.logic.palette) m.logic.palette = { "0": "floor" };
      if (!Array.isArray(m.logic.edges)) m.logic.edges = [];
      delete m.logic.legend;
      return m;
    }
    const tileTypes = resolveTileTypes(catalogue);
    const byLabel = {};
    tileTypes.forEach((tt) => {
      if (!tt || !tt.id) return;
      byLabel[String(tt.id).toLowerCase()] = tt.id;
      if (tt.label) byLabel[String(tt.label).toLowerCase()] = tt.id;
    });
    const legend = (m.logic && m.logic.legend) || m.legend || {};
    const palette = {};
    const noticeInts = [];
    const used = new Set();
    (m.logic && m.logic.terrain ? m.logic.terrain : []).forEach((n) => used.add(String(n)));
    Object.keys(legend).forEach((k) => used.add(String(k)));
    used.add("0");
    used.forEach((k) => {
      const text = legend[k] != null ? String(legend[k]) : legend[Number(k)] != null ? String(legend[Number(k)]) : null;
      let id = null;
      if (text) id = byLabel[text.toLowerCase()] || null;
      if (!id && (k === "0" || Number(k) === 0) && !text) id = "floor";
      if (!id && text && byLabel[text.toLowerCase()]) id = byLabel[text.toLowerCase()];
      if (!id) {
        id = "floor";
        if (k !== "0" && Number(k) !== 0) noticeInts.push(k);
      }
      palette[k] = id;
    });
    m.logic = {
      terrain: (m.logic && m.logic.terrain) ? m.logic.terrain.slice() : Array((m.cols || 1) * (m.rows || 1)).fill(0),
      palette,
      edges: Array.isArray(m.logic && m.logic.edges) ? m.logic.edges : [],
    };
    delete m.logic.legend;
    delete m.legend;
    m.formatVersion = 4;
    m._migrateNotices = noticeInts.length
      ? [noticeInts.length + " terrain values had no tile type and now mean Floor"]
      : [];
    return m;
  }

  function resolveTileTypes(catalogue) {
    if (!catalogue) return [];
    if (catalogue.terrain && Array.isArray(catalogue.terrain.tile_types)) return catalogue.terrain.tile_types;
    const beh = (catalogue.behaviours || []).find((b) => b.id === "terrain");
    if (!beh) return [];
    const knob = (beh.knobs || []).find((k) => k.id === "tile_types");
    return (knob && knob.default) || [];
  }

  /** tile-project 003: tileProps[i].logic int → tile type id via map legends */
  function migrateAssetTilePropsLogic(store, catalogue) {
    const m = manifest(store);
    const assets = m.project.assets || {};
    const notices = [];
    // Build tilesetId → legend text map from pre-migration maps if still present; else from palette
    const tilesetLegend = {};
    Object.keys(store.files)
      .filter((k) => k.indexOf("maps/") === 0)
      .forEach((k) => {
        const map = store.files[k];
        const legend = (map.logic && map.logic.legend) || map.legend || null;
        const palette = map.logic && map.logic.palette;
        (map.layers || []).forEach((layer) => {
          if (!layer.tileset) return;
          tilesetLegend[layer.tileset] = tilesetLegend[layer.tileset] || legend || palette || {};
        });
      });
    const tileTypes = resolveTileTypes(catalogue);
    const byLabel = {};
    tileTypes.forEach((tt) => {
      if (!tt || !tt.id) return;
      byLabel[String(tt.id).toLowerCase()] = tt.id;
      if (tt.label) byLabel[String(tt.label).toLowerCase()] = tt.id;
    });
    Object.keys(assets).forEach((aid) => {
      const meta = assets[aid];
      if (!meta || !meta.tileProps) return;
      Object.keys(meta.tileProps).forEach((ti) => {
        const props = meta.tileProps[ti];
        if (!props || props.logic == null) return;
        if (typeof props.logic === "string") return; // already id
        if (typeof props.logic !== "number") {
          delete props.logic;
          notices.push("dropped non-int tileProps.logic on " + aid);
          return;
        }
        const leg = tilesetLegend[aid] || {};
        const text = leg[props.logic] != null ? String(leg[props.logic]) : leg[String(props.logic)];
        let id = null;
        if (text) id = byLabel[text.toLowerCase()] || null;
        if (!id && props.logic === 0 && !text) id = "floor";
        if (!id) {
          delete props.logic;
          notices.push("dropped unmatched tileProps.logic " + props.logic + " on " + aid);
          return;
        }
        props.logic = id;
      });
    });
    return notices;
  }

  /** Canonical edge: store e as w of (c+1,r), s as n of (c,r+1) when neighbour on map. */
  function canonicalizeEdge(map, edge) {
    if (!edge || !map) return null;
    let c = edge.c | 0;
    let r = edge.r | 0;
    let side = edge.side;
    if (side === "e" && c + 1 < (map.cols || 0)) {
      c = c + 1;
      side = "w";
    } else if (side === "s" && r + 1 < (map.rows || 0)) {
      r = r + 1;
      side = "n";
    }
    if (c < 0 || r < 0 || c >= (map.cols || 0) || r >= (map.rows || 0)) return null;
    if (side !== "n" && side !== "e" && side !== "s" && side !== "w") return null;
    return { c, r, side };
  }

  function edgeKey(e) {
    return e.c + "," + e.r + "," + e.side;
  }

  function toggleMapEdge(store, mapId, edge) {
    const map = getMap(store, mapId);
    if (!map) return null;
    map.logic = map.logic || { terrain: [], palette: { "0": "floor" }, edges: [] };
    if (!Array.isArray(map.logic.edges)) map.logic.edges = [];
    const canon = canonicalizeEdge(map, edge);
    if (!canon) return map;
    const k = edgeKey(canon);
    const i = map.logic.edges.findIndex((e) => edgeKey(canonicalizeEdge(map, e) || e) === k);
    if (i >= 0) map.logic.edges.splice(i, 1);
    else map.logic.edges.push(canon);
    saveMap(store, map);
    bumpProject(store);
    return map;
  }

  /** Write palette index for a tile type id into logic.terrain[i] (painter). */
  function paintLogicTile(store, mapId, index, tileTypeId) {
    const map = getMap(store, mapId);
    if (!map || !map.logic) return null;
    map.logic.palette = map.logic.palette || { "0": "floor" };
    let paletteIndex = null;
    Object.keys(map.logic.palette).forEach((k) => {
      if (map.logic.palette[k] === tileTypeId) paletteIndex = Number(k);
    });
    if (paletteIndex == null) {
      const nums = Object.keys(map.logic.palette).map(Number).filter((n) => !isNaN(n));
      paletteIndex = (nums.length ? Math.max.apply(null, nums) : -1) + 1;
      map.logic.palette[String(paletteIndex)] = tileTypeId;
    }
    if (!Array.isArray(map.logic.terrain)) map.logic.terrain = [];
    if (index >= 0 && index < map.logic.terrain.length) {
      map.logic.terrain[index] = paletteIndex;
      saveMap(store, map);
      bumpProject(store);
    }
    return map;
  }

  function listVisibleAssets(store) {
    const m = manifest(store);
    const out = [];
    Object.keys(m.project.assets || {}).forEach((id) => {
      const meta = m.project.assets[id];
      if (meta && meta.role === "source") return; // hidden from normal lists
      out.push(Object.assign({ id }, meta));
    });
    return out;
  }

  function assetDecodedBytes(meta) {
    if (!meta) return 0;
    const w = meta.w || 0;
    const h = meta.h || 0;
    return w * h * 4;
  }

  function assetIsOddSize(meta) {
    if (!meta) return false;
    const w = meta.w | 0;
    const h = meta.h | 0;
    return (w > 0 && w % 2 === 1) || (h > 0 && h % 2 === 1);
  }

  function emptyEditorPrefs() {
    return { kind: "editor-prefs", formatVersion: 1, maps: {} };
  }

  let editorPrefsCache = null;

  async function loadEditorPrefs() {
    if (editorPrefsCache) return editorPrefsCache;
    const defaults = emptyEditorPrefs();
    try {
      if (!(await probeOpfs())) {
        editorPrefsCache = defaults;
        return defaults;
      }
      const root = await opfsRoot();
      const parts = OPFS_EDITOR_PREFS.split("/");
      const dir = await walkPath(root, parts.slice(0, -1), true);
      let fh;
      try {
        fh = await dir.getFileHandle(parts[parts.length - 1], { create: false });
      } catch (e) {
        editorPrefsCache = defaults;
        return defaults;
      }
      const file = await fh.getFile();
      const raw = JSON.parse(await file.text());
      if (!raw || raw.kind !== "editor-prefs") {
        editorPrefsCache = defaults;
        return defaults;
      }
      editorPrefsCache = Object.assign(defaults, raw, { maps: raw.maps || {} });
      return editorPrefsCache;
    } catch (e) {
      editorPrefsCache = defaults;
      return defaults;
    }
  }

  async function saveEditorPrefs(prefs) {
    editorPrefsCache = prefs || emptyEditorPrefs();
    try {
      if (!(await probeOpfs())) return false;
      const root = await opfsRoot();
      await opfsWriteJson(root, OPFS_EDITOR_PREFS, editorPrefsCache);
      return true;
    } catch (e) {
      return false;
    }
  }

  function mapPrefsKey(projectId, mapId) {
    return projectId + "/" + mapId;
  }

  function getMapEditorPrefs(prefs, projectId, mapId) {
    const key = mapPrefsKey(projectId, mapId);
    const row = (prefs && prefs.maps && prefs.maps[key]) || {};
    return {
      zoom: row.zoom != null ? row.zoom : 1,
      minimap: row.minimap != null ? !!row.minimap : true,
      activeLayer: row.activeLayer || "ground",
      walkRulesOverlay: row.walkRulesOverlay != null ? !!row.walkRulesOverlay : false,
    };
  }

  async function setMapEditorPrefs(projectId, mapId, patch) {
    const prefs = await loadEditorPrefs();
    const key = mapPrefsKey(projectId, mapId);
    prefs.maps = prefs.maps || {};
    prefs.maps[key] = Object.assign(getMapEditorPrefs(prefs, projectId, mapId), patch || {});
    await saveEditorPrefs(prefs);
    return prefs.maps[key];
  }


  /** stage 001: re-key overrides.setups from setupId → behaviourId */
  function migrateStageOverridesToBehaviourKeys(store, stage) {
    const st = clone(stage);
    st.formatVersion = 2;
    if (st.difficulty === undefined) st.difficulty = null;
    const setups = st.overrides && st.overrides.setups;
    if (!setups) {
      st.overrides = st.overrides || emptyOverrides();
      return st;
    }
    const byBeh = {};
    Object.keys(setups).forEach((key) => {
      const doc = store.files["setups/" + key + ".json"];
      const behId = doc && doc.behaviourId ? doc.behaviourId : key; // already behaviour id, or lookup
      // If key looks like a behaviour id (no setup_ prefix / found as behaviour), keep
      if (!doc && !key.startsWith("setup_")) {
        byBeh[key] = setups[key];
        return;
      }
      if (doc && doc.behaviourId) {
        // stage rules win: if stage.rules has a setup for this behaviour, prefer that key's overrides when colliding
        if (byBeh[doc.behaviourId] && (st.rules || []).indexOf(key) < 0) {
          // keep existing (from winning setup); drop this
          return;
        }
        byBeh[doc.behaviourId] = setups[key];
      } else {
        byBeh[key] = setups[key];
      }
    });
    st.overrides.setups = byBeh;
    return st;
  }

  function ensureProjectV3(store, catalogue) {
    // r5: upgrades through v4 (name kept for callers)
    const m = manifest(store);
    m.kind = "tile-project";
    // settings upgrades (never set advancedRender true)
    const s = m.project.settings || {};
    if (s.advancedRender == null) s.advancedRender = false;
    // Migrations never set advancedRender to true. Preserve an existing true from a prior user action.
    s.camera = s.camera || {};
    if (s.camera.pixelPerfect == null) s.camera.pixelPerfect = true;
    if (s.camera.followDeadZone == null) s.camera.followDeadZone = 0.6;
    if (s.camera.easeMs == null) s.camera.easeMs = 120;
    // zoom: allow fractional storage; warn in UI when pixelPerfect effective
    if (s.screenFit == null) s.screenFit = "letterbox";
    if (s.letterboxColour == null) s.letterboxColour = "#000000";
    if (s.maxImageSide == null) s.maxImageSide = 4096;
    m.project.settings = s;
    if (!m.project.difficulty) m.project.difficulty = { hp: 1.0, damage: 1.0, appliesTo: "enemies" };
    delete m.project.host;

    // maps v3 then v4 (tile-project 003 runs before map 003 conceptually; tileProps first)
    const tpNotices = migrateAssetTilePropsLogic(store, catalogue);
    Object.keys(store.files)
      .filter((k) => k.indexOf("maps/") === 0)
      .forEach((k) => {
        store.files[k] = migrateMapToV4(store.files[k], catalogue);
      });
    // Re-run tileProps after maps have palette (idempotent for already-string logic)
    migrateAssetTilePropsLogic(store, catalogue);

    // stages
    Object.keys(store.files)
      .filter((k) => k.indexOf("stages/") === 0)
      .forEach((k) => {
        store.files[k] = migrateStageOverridesToBehaviourKeys(store, store.files[k]);
      });

    m.formatVersion = 4;
    store.notices = (store.notices || []).concat(tpNotices || []);
    return store;
  }

  function effectiveAdvancedRender(store) {
    const s = manifest(store).project.settings || {};
    return !!s.advancedRender;
  }

  function effectivePixelPerfect(store) {
    if (!effectiveAdvancedRender(store)) return true;
    const cam = manifest(store).project.settings.camera || {};
    return cam.pixelPerfect !== false;
  }

  function effectiveBackgroundFit(store, fit) {
    if (fit === "tile" || fit === "none" || !fit) return fit || "none";
    if (!effectiveAdvancedRender(store)) return "none"; // cover/stretch inactive
    return fit;
  }

  function effectiveDifficulty(store, stageId) {
    const m = manifest(store);
    const base = Object.assign({ hp: 1, damage: 1, appliesTo: "enemies" }, m.project.difficulty || {});
    const st = stageId ? getStage(store, stageId) : null;
    if (st && st.difficulty) return Object.assign({}, base, st.difficulty);
    return base;
  }

  function setProjectDifficulty(store, diff) {
    const m = manifest(store);
    m.project.difficulty = {
      hp: Number(diff.hp != null ? diff.hp : 1),
      damage: Number(diff.damage != null ? diff.damage : 1),
      appliesTo: diff.appliesTo || "enemies",
    };
    bumpProject(store);
  }

  function setStageDifficultyField(store, stageId, field, valueOrNull) {
    const st = getStage(store, stageId);
    if (!st) return;
    if (valueOrNull == null) {
      if (st.difficulty) {
        delete st.difficulty[field];
        if (!Object.keys(st.difficulty).length) st.difficulty = null;
      }
    } else {
      st.difficulty = st.difficulty || {};
      st.difficulty[field] = valueOrNull;
    }
    saveStage(store, st);
    bumpProject(store);
  }

  function setStagePresentationOverride(store, stageId, knobsOrNull) {
    // knobsOrNull: null = clear (same as project); else Record<knobId,{value,rev}>
    const st = getStage(store, stageId);
    if (!st) return;
    st.overrides = st.overrides || emptyOverrides();
    st.overrides.setups = st.overrides.setups || {};
    if (!knobsOrNull) delete st.overrides.setups["ability-presentation"];
    else st.overrides.setups["ability-presentation"] = knobsOrNull;
    saveStage(store, st);
    bumpProject(store);
  }


  function makeMap(opts) {
    const at = nowIso();
    const cols = opts.cols || 6;
    const rows = opts.rows || 9;
    const cells = Array(cols * rows).fill(0);
    return {
      kind: "map",
      formatVersion: 4,
      id: opts.id || ulid("map"),
      rev: 0,
      name: opts.name || "Map 1",
      cols,
      rows,
      tile: null,
      background: { mode: "none", fit: "none" },
      layers: [
        {
          id: "ground",
          name: "Ground",
          tileset: null,
          aboveUnits: false,
          visible: true,
          tiles: cells.slice(),
        },
      ],
      logic: {
        terrain: cells.slice(),
        palette: { "0": "floor" },
        edges: [],
      },
      createdAt: at,
      updatedAt: at,
    };
  }

  function makeStage(opts) {
    const at = nowIso();
    return {
      kind: "stage",
      formatVersion: 2,
      id: opts.id || ulid("stage"),
      rev: 0,
      name: opts.name || "Floor 1",
      mapRef: opts.mapRef,
      playerSpawns: opts.playerSpawns || [],
      neutrals: opts.neutrals || [],
      enemyPool: opts.enemyPool || emptyEnemyPool("fixed"),
      type: opts.type || null,
      threatEvent: !!opts.threatEvent,
      lairSet: opts.lairSet || null,
      loadout: opts.loadout != null ? opts.loadout : null,
      rules: opts.rules || [],
      overrides: opts.overrides || emptyOverrides(),
      difficulty: opts.difficulty != null ? opts.difficulty : null,
      history: emptyHistory(),
      createdAt: at,
      updatedAt: at,
    };
  }

  function makeUnit(opts) {
    const at = nowIso();
    return {
      kind: "unit",
      formatVersion: 2,
      id: opts.id || ulid("unit"),
      rev: 0,
      name: opts.name || "Unit",
      sprite: opts.sprite || null,
      setupIds: opts.setupIds || [],
      stats: opts.stats || {},
      history: emptyHistory(),
      createdAt: at,
      updatedAt: at,
    };
  }

  function armyDefaults(catalogue, store) {
    let hp = ARMY_HP;
    let atk = ARMY_ATK;
    try {
      const setups = listSetups(store);
      const roster = setups.find((s) => s.behaviourId === "unit-roster");
      const beh = (catalogue.behaviours || []).find((b) => b.id === "unit-roster");
      if (roster && beh) {
        const knobs = {};
        (beh.knobs || []).forEach((k) => (knobs[k.id] = k));
        const eff = (id) => {
          const a = roster.answers[id];
          const k = knobs[id];
          if (!a || a.source === "default") return k ? k.default : undefined;
          return a.value;
        };
        if (eff("unit_hp") != null) hp = eff("unit_hp");
        if (eff("unit_atk") != null) atk = eff("unit_atk");
      } else if (beh) {
        const kh = (beh.knobs || []).find((k) => k.id === "unit_hp");
        const ka = (beh.knobs || []).find((k) => k.id === "unit_atk");
        if (kh && kh.default != null) hp = kh.default;
        if (ka && ka.default != null) atk = ka.default;
      }
    } catch (e) {}
    return { unit_hp: hp, unit_atk: atk };
  }

  function createBlankProject(catalogue, opts) {
    opts = opts || {};
    const catRev = catalogue && catalogue.catalogue_rev != null ? catalogue.catalogue_rev : 0;
    const manifest = emptyManifest(catRev, opts.name);
    const map = makeMap({ cols: opts.cols || 6, rows: opts.rows || 9, name: "Map 1" });
    const stage = makeStage({
      name: opts.stageName || "Floor 1",
      mapRef: map.id,
      playerSpawns: [
        { c: 1, r: 7 },
        { c: 4, r: 1 },
      ],
    });
    manifest.project.stages = [stage.id];
    const files = {
      "project.json": manifest,
      "catalogue/slice.json": makeSlice(catalogue, ["ability-presentation", "unit-roster"]),
      "notes/notes.json": emptyNotes(),
      ["maps/" + map.id + ".json"]: map,
      ["stages/" + stage.id + ".json"]: stage,
    };
    const store = { files, notices: [], storage: "memory", projectId: manifest.project.id };
    recomputeIndex(store, catalogue);
    return store;
  }

  /* ---------- OPFS ---------- */

  async function probeOpfs() {
    if (opfsAvailable !== null) return opfsAvailable;
    try {
      if (!global.navigator || !navigator.storage || !navigator.storage.getDirectory) {
        opfsAvailable = false;
        opfsNote = "OPFS unavailable — using memory fallback (import localStorage once if present).";
        return false;
      }
      const root = await navigator.storage.getDirectory();
      await root.getDirectoryHandle("tileengine", { create: true });
      opfsAvailable = true;
      opfsNote = null;
      return true;
    } catch (e) {
      opfsAvailable = false;
      opfsNote = "OPFS unavailable — using memory fallback.";
      return false;
    }
  }

  async function opfsRoot() {
    return navigator.storage.getDirectory();
  }

  async function ensureDir(parent, name) {
    return parent.getDirectoryHandle(name, { create: true });
  }

  async function walkPath(root, parts, create) {
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      cur = await cur.getDirectoryHandle(parts[i], { create: !!create });
    }
    return cur;
  }

  async function opfsWriteJson(root, path, obj) {
    const parts = path.split("/").filter(Boolean);
    const dir = await walkPath(root, parts.slice(0, -1), true);
    const fh = await dir.getFileHandle(parts[parts.length - 1], { create: true });
    const w = await fh.createWritable();
    await w.write(JSON.stringify(obj));
    await w.close();
  }

  async function opfsReadJson(root, path) {
    const parts = path.split("/").filter(Boolean);
    const dir = await walkPath(root, parts.slice(0, -1), false);
    const fh = await dir.getFileHandle(parts[parts.length - 1], { create: false });
    const file = await fh.getFile();
    return JSON.parse(await file.text());
  }

  async function opfsListFiles(dir, prefix) {
    const out = [];
    async function walk(handle, base) {
      for await (const [name, ent] of handle.entries()) {
        const p = base ? base + "/" + name : name;
        if (ent.kind === "directory") await walk(ent, p);
        else if (name.endsWith(".json")) out.push(prefix ? prefix + "/" + p : p);
      }
    }
    await walk(dir, "");
    return out;
  }

  async function writeOpfsStore(store) {
    const root = await opfsRoot();
    const te = await ensureDir(root, "tileengine");
    const projects = await ensureDir(te, "projects");
    const pid = store.projectId || manifest(store).project.id;
    store.projectId = pid;
    // clear+rewrite: write each file under tileengine/projects/<projectId>/
    const baseParts = ["tileengine", "projects", pid];
    let bytes = 0;
    for (const path of Object.keys(store.files)) {
      const full = baseParts.concat(path.split("/").filter(Boolean)).join("/");
      const json = JSON.stringify(store.files[path]);
      bytes += json.length;
      await opfsWriteJson(root, full, store.files[path]);
    }
    store.storage = "opfs";
    return bytes;
  }

  async function readOpfsStore(projectId) {
    const root = await opfsRoot();
    try {
      const te = await root.getDirectoryHandle("tileengine", { create: false });
      const projects = await te.getDirectoryHandle("projects", { create: false });
      let dir;
      if (projectId) {
        dir = await projects.getDirectoryHandle(projectId, { create: false });
      } else {
        // pick first project
        let first = null;
        for await (const [name, ent] of projects.entries()) {
          if (ent.kind === "directory") {
            first = name;
            break;
          }
        }
        if (!first) return null;
        projectId = first;
        dir = await projects.getDirectoryHandle(projectId, { create: false });
      }
      const files = {};
      const paths = await opfsListFiles(dir, "");
      for (const p of paths) {
        const clean = p.replace(/^\//, "");
        try {
          files[clean] = await opfsReadJson(root, ["tileengine", "projects", projectId].concat(clean.split("/")).join("/"));
        } catch (e) {}
      }
      if (!files["project.json"]) return null;
      return { files, notices: [], storage: "opfs", projectId };
    } catch (e) {
      return null;
    }
  }

  function readLocalFallback() {
    try {
      return JSON.parse(localStorage.getItem(LEGACY_VFS) || "null");
    } catch (e) {
      return null;
    }
  }

  /* ---------- import / migrate ---------- */

  function migrateMapV1toV2(map) {
    const m = clone(map);
    const placements = m.placements || [];
    const enemyPool = m.enemyPool;
    delete m.placements;
    delete m.enemyPool;
    m.kind = "map";
    m.formatVersion = 2;
    return { map: m, placements, legacyEnemyPool: enemyPool };
  }

  function migrateUnitProto(unit, army) {
    const u = clone(unit);
    u.kind = "unit";
    u.formatVersion = 2;
    u.stats = u.stats || {};
    u.history = u.history || emptyHistory();
    u.setupIds = u.setupIds || [];
    if (u._protoStats) {
      const hp = u._protoStats.hp;
      const atk = u._protoStats.atk;
      if (hp != null && hp !== army.unit_hp) u.stats.unit_hp = { value: hp, rev: 0 };
      if (atk != null && atk !== army.unit_atk) u.stats.unit_atk = { value: atk, rev: 0 };
      delete u._protoStats;
    }
    if (u.hp != null || u.atk != null) {
      if (u.hp != null && u.hp !== army.unit_hp && !u.stats.unit_hp) u.stats.unit_hp = { value: u.hp, rev: 0 };
      if (u.atk != null && u.atk !== army.unit_atk && !u.stats.unit_atk) u.stats.unit_atk = { value: u.atk, rev: 0 };
      delete u.hp;
      delete u.atk;
    }
    return u;
  }

  function importPrototype(catalogue, shellState) {
    const notices = [];
    const raw = readLocalFallback();
    const army = { unit_hp: ARMY_HP, unit_atk: ARMY_ATK };
    let store;

    if (raw && raw.files && raw.files["project.json"]) {
      store = { files: clone(raw.files), notices: ["imported localStorage project-vfs"], storage: "memory" };
      notices.push("imported " + LEGACY_VFS);
    } else {
      store = createBlankProject(catalogue, { name: (shellState && shellState.name) || "Demo project" });
    }

    const m = manifest(store);
    // bump project format
    m.kind = "tile-project";
    m.formatVersion = 3;
    if (!m.project.loadout) m.project.loadout = emptyLoadout();
    if (!m.project.render) m.project.render = { excludedStages: [], targets: ["browser", "android", "ios"] };
    if (!m.project.assets) m.project.assets = {};
    if (!m.project.settings.screenFit) m.project.settings.screenFit = "letterbox";
    if (!m.project.settings.letterboxColour) m.project.settings.letterboxColour = "#000000";
    // integer zoom
    const cam = m.project.settings.camera || {};
    cam.zoom = Math.max(1, Math.min(6, Math.round(Number(cam.zoom) || 1)));
    cam.zoomMin = 1;
    cam.zoomMax = Math.max(cam.zoomMin, Math.round(Number(cam.zoomMax) || 6));
    m.project.settings.camera = cam;
    delete m.project.host;

    // Migrate maps → stages
    const mapKeys = Object.keys(store.files).filter((k) => k.indexOf("maps/") === 0);
    const newStages = [];
    const stageIds = [];
    mapKeys.forEach((k) => {
      const rawMap = store.files[k];
      if (!rawMap) return;
      if (rawMap.kind === "stage") return;
      const { map, placements, legacyEnemyPool } = migrateMapV1toV2(rawMap);
      store.files["maps/" + map.id + ".json"] = map;
      if (k !== "maps/" + map.id + ".json") delete store.files[k];

      const playerSpawns = (placements || [])
        .filter((p) => p.side === "player" || !p.side)
        .map((p) => ({ c: p.c != null ? p.c : p.x || 0, r: p.r != null ? p.r : p.y || 0 }));
      const neutrals = (placements || [])
        .filter((p) => p.side === "neutral")
        .map((p) => ({ unitId: p.unitId, at: { c: p.c, r: p.r } }));
      let enemyPool = emptyEnemyPool("fixed");
      const enemyPlacements = (placements || []).filter((p) => p.side === "enemy");
      if (enemyPlacements.length) {
        enemyPool = {
          mode: "fixed",
          entries: enemyPlacements.map((p) => ({
            unitId: p.unitId,
            at: { c: p.c != null ? p.c : 0, r: p.r != null ? p.r : 0 },
          })),
        };
      } else if (Array.isArray(legacyEnemyPool) && legacyEnemyPool.length) {
        enemyPool = {
          mode: "weighted",
          picks: legacyEnemyPool.length,
          allowRepeats: false,
          spawns: [],
          entries: legacyEnemyPool.map((e) => ({
            unitId: e.unitId || e.id,
            weight: e.weight != null ? e.weight : 1,
          })),
        };
        notices.push("migrated maps[].enemyPool → stage weighted pool");
      }

      const stage = makeStage({
        name: map.name || "Floor 1",
        mapRef: map.id,
        playerSpawns: playerSpawns.length ? playerSpawns : [{ c: 1, r: 7 }],
        neutrals,
        enemyPool,
        loadout: null,
      });
      store.files["stages/" + stage.id + ".json"] = stage;
      stageIds.push(stage.id);
      newStages.push(stage);
    });

    // If project.stages still hold map ids, replace with stage ids
    if (stageIds.length) {
      const looksLikeMaps = (m.project.stages || []).every((id) => store.files["maps/" + id + ".json"] && !store.files["stages/" + id + ".json"]);
      if (looksLikeMaps || !(m.project.stages || []).length || !(m.project.stages || []).some((id) => store.files["stages/" + id + ".json"])) {
        m.project.stages = stageIds;
      }
    }

    // Ensure at least one stage
    if (!(m.project.stages || []).length) {
      const map = makeMap({ cols: 6, rows: 9 });
      const stage = makeStage({ mapRef: map.id });
      store.files["maps/" + map.id + ".json"] = map;
      store.files["stages/" + stage.id + ".json"] = stage;
      m.project.stages = [stage.id];
    }

    // Units
    Object.keys(store.files)
      .filter((k) => k.indexOf("units/") === 0)
      .forEach((k) => {
        store.files[k] = migrateUnitProto(store.files[k], army);
      });

    // Shell state units
    if (shellState && Array.isArray(shellState.units)) {
      shellState.units.forEach((su) => {
        const id = "shell-" + su.id;
        const existing = store.files["units/" + id + ".json"];
        const stats = {};
        if (su.hp != null && su.hp !== army.unit_hp) stats.unit_hp = { value: su.hp, rev: 0 };
        if (su.atk != null && su.atk !== army.unit_atk) stats.unit_atk = { value: su.atk, rev: 0 };
        if (!existing) {
          store.files["units/" + id + ".json"] = makeUnit({
            id,
            name: su.name,
            stats,
          });
        } else {
          store.files["units/" + id + ".json"] = migrateUnitProto(
            Object.assign({}, existing, { name: su.name || existing.name }),
            army
          );
        }
        // playerSpawns from x,y on first stage
        if (su.x != null && su.y != null && m.project.stages[0]) {
          const st = getStage(store, m.project.stages[0]);
          if (st) {
            const hit = (st.playerSpawns || []).some((s) => s.c === su.x && s.r === su.y);
            if (!hit) {
              st.playerSpawns = st.playerSpawns || [];
              st.playerSpawns.push({ c: su.x, r: su.y });
              saveStage(store, st);
            }
          }
        }
      });
      // loadout roster from shell units
      m.project.loadout.roster = shellState.units.map((u) => "shell-" + u.id);
      if (shellState.loadoutSlots) m.project.loadout.size = shellState.loadoutSlots;
    }

    // Setups → v3 via SetupStore if available
    Object.keys(store.files)
      .filter((k) => k.indexOf("setups/") === 0)
      .forEach((k) => {
        const doc = store.files[k];
        if (global.SetupStore && SetupStore.loadSetup) {
          const loaded = SetupStore.loadSetup(doc, catalogue);
          if (loaded.doc) store.files[k] = loaded.doc;
        } else {
          doc.formatVersion = 3;
        }
      });

    // notes v2
    if (store.files["notes/notes.json"]) {
      store.files["notes/notes.json"].formatVersion = 2;
    } else {
      store.files["notes/notes.json"] = emptyNotes();
    }

    store.projectId = m.project.id;
    store.notices = notices;
    ensureProjectV3(store, catalogue);
    // import copies advancedRender as false
    manifest(store).project.settings.advancedRender = false;
    recomputeIndex(store, catalogue);
    return store;
  }

  /* ---------- accessors ---------- */

  function manifest(store) {
    return store.files["project.json"];
  }

  function getMap(store, mapId) {
    return store.files["maps/" + mapId + ".json"] || null;
  }

  function listMaps(store) {
    return Object.keys(store.files)
      .filter((k) => k.indexOf("maps/") === 0)
      .map((k) => store.files[k])
      .filter(Boolean);
  }

  function getStage(store, stageId) {
    return store.files["stages/" + stageId + ".json"] || null;
  }

  function listStages(store) {
    const m = manifest(store);
    return (m.project.stages || []).map((id) => getStage(store, id)).filter(Boolean);
  }

  function saveMap(store, map) {
    map.updatedAt = nowIso();
    map.rev = (map.rev || 0) + 1;
    store.files["maps/" + map.id + ".json"] = map;
  }

  function saveStage(store, stage) {
    stage.updatedAt = nowIso();
    stage.rev = (stage.rev || 0) + 1;
    store.files["stages/" + stage.id + ".json"] = stage;
  }

  function addStage(store, catalogue, name, mapRef) {
    const m = manifest(store);
    let mapId = mapRef;
    if (!mapId) {
      const maps = listMaps(store);
      mapId = maps[0] ? maps[0].id : null;
      if (!mapId) {
        const map = makeMap({ cols: 6, rows: 9 });
        store.files["maps/" + map.id + ".json"] = map;
        mapId = map.id;
      }
    }
    const stage = makeStage({ name: name || "Floor " + ((m.project.stages || []).length + 1), mapRef: mapId });
    store.files["stages/" + stage.id + ".json"] = stage;
    m.project.stages = m.project.stages || [];
    m.project.stages.push(stage.id);
    bumpProject(store);
    return stage;
  }

  function duplicateStage(store, stageId) {
    const src = getStage(store, stageId);
    if (!src) return null;
    const copy = clone(src);
    copy.id = ulid("stage");
    copy.name = (src.name || "Stage") + " copy";
    copy.rev = 0;
    copy.createdAt = nowIso();
    copy.updatedAt = copy.createdAt;
    copy.history = emptyHistory();
    store.files["stages/" + copy.id + ".json"] = copy;
    const m = manifest(store);
    const i = (m.project.stages || []).indexOf(stageId);
    m.project.stages.splice(i >= 0 ? i + 1 : m.project.stages.length, 0, copy.id);
    bumpProject(store);
    return copy;
  }

  function renameStage(store, stageId, name) {
    const st = getStage(store, stageId);
    if (!st) return;
    st.name = String(name || st.name).slice(0, 48);
    saveStage(store, st);
    bumpProject(store);
  }

  function reorderStage(store, stageId, toIndex) {
    const m = manifest(store);
    const arr = m.project.stages || [];
    const i = arr.indexOf(stageId);
    if (i < 0) return;
    arr.splice(i, 1);
    arr.splice(Math.max(0, Math.min(toIndex, arr.length)), 0, stageId);
    bumpProject(store);
  }

  function setStageMap(store, stageId, mapId) {
    const st = getStage(store, stageId);
    if (!st || !getMap(store, mapId)) return;
    st.mapRef = mapId;
    saveStage(store, st);
    bumpProject(store);
  }

  function effectiveLoadout(store, stageId) {
    const m = manifest(store);
    const st = stageId ? getStage(store, stageId) : null;
    if (st && st.loadout) return st.loadout;
    return m.project.loadout || emptyLoadout();
  }

  function setProjectLoadout(store, loadout) {
    const m = manifest(store);
    m.project.loadout = {
      roster: (loadout.roster || []).slice(),
      size: Math.max(1, loadout.size | 0 || 1),
      required: (loadout.required || []).slice(),
    };
    bumpProject(store);
  }

  function setStageLoadout(store, stageId, loadoutOrNull) {
    const st = getStage(store, stageId);
    if (!st) return;
    st.loadout = loadoutOrNull
      ? {
          roster: (loadoutOrNull.roster || []).slice(),
          size: Math.max(1, loadoutOrNull.size | 0 || 1),
          required: (loadoutOrNull.required || []).slice(),
        }
      : null;
    saveStage(store, st);
    bumpProject(store);
  }

  function setEnemyPool(store, stageId, pool) {
    const st = getStage(store, stageId);
    if (!st) return;
    st.enemyPool = pool;
    saveStage(store, st);
    bumpProject(store);
  }

  function getUnit(store, unitId) {
    return store.files["units/" + unitId + ".json"] || null;
  }

  function listUnits(store) {
    return Object.keys(store.files)
      .filter((k) => k.indexOf("units/") === 0)
      .map((k) => store.files[k]);
  }

  function upsertUnit(store, catalogue, data) {
    const army = armyDefaults(catalogue, store);
    let unit = getUnit(store, data.id);
    if (!unit) {
      const stats = {};
      if (data.hp != null && data.hp !== army.unit_hp) stats.unit_hp = { value: data.hp, rev: 0 };
      if (data.atk != null && data.atk !== army.unit_atk) stats.unit_atk = { value: data.atk, rev: 0 };
      if (data.stats) Object.assign(stats, data.stats);
      unit = makeUnit({ id: data.id, name: (window.TileEngineSafe && TileEngineSafe.clampName && data.name) ? TileEngineSafe.clampName(data.name) : data.name, stats, sprite: data.sprite || null });
    } else {
      if (data.name) unit.name = (window.TileEngineSafe && TileEngineSafe.clampName) ? TileEngineSafe.clampName(data.name) : String(data.name).slice(0, 80);
      unit.stats = unit.stats || {};
      if (data.stats) {
        Object.keys(data.stats).forEach((k) => {
          if (data.stats[k] == null) delete unit.stats[k];
          else unit.stats[k] = data.stats[k];
        });
      }
      if (data.hp != null) {
        if (data.hp === army.unit_hp) delete unit.stats.unit_hp;
        else unit.stats.unit_hp = { value: data.hp, rev: (unit.stats.unit_hp && unit.stats.unit_hp.rev) || 0 };
      }
      if (data.atk != null) {
        if (data.atk === army.unit_atk) delete unit.stats.unit_atk;
        else unit.stats.unit_atk = { value: data.atk, rev: (unit.stats.unit_atk && unit.stats.unit_atk.rev) || 0 };
      }
    }
    saveUnit(store, unit);
    return unit;
  }

  function saveUnit(store, unit) {
    unit.updatedAt = nowIso();
    unit.rev = (unit.rev || 0) + 1;
    store.files["units/" + unit.id + ".json"] = unit;
    bumpProject(store);
  }

  function resolveUnitStat(store, catalogue, unitId, statId, stageId) {
    const army = armyDefaults(catalogue, store);
    const unit = getUnit(store, unitId);
    const stage = stageId ? getStage(store, stageId) : null;
    // L4
    if (stage && stage.overrides && stage.overrides.units && stage.overrides.units[unitId] && stage.overrides.units[unitId][statId]) {
      return { value: stage.overrides.units[unitId][statId].value, layer: "stage-unit" };
    }
    // L3
    if (unit && unit.stats && unit.stats[statId]) {
      return { value: unit.stats[statId].value, layer: "unit" };
    }
    // L1 army
    return { value: army[statId], layer: "army", inherits: true };
  }

  function setUnitStat(store, catalogue, unitId, statId, valueOrNull) {
    const unit = getUnit(store, unitId) || upsertUnit(store, catalogue, { id: unitId, name: unitId });
    unit.stats = unit.stats || {};
    if (valueOrNull == null) {
      delete unit.stats[statId];
    } else {
      const prev = unit.stats[statId];
      unit.stats[statId] = { value: valueOrNull, rev: prev ? prev.rev + 1 : 0 };
    }
    saveUnit(store, unit);
    return unit;
  }

  function getSetup(store, setupId) {
    return store.files["setups/" + setupId + ".json"] || null;
  }

  function saveSetupFile(store, doc) {
    store.files["setups/" + doc.id + ".json"] = doc;
    bumpProject(store);
  }

  function listSetups(store) {
    return Object.keys(store.files)
      .filter((k) => k.indexOf("setups/") === 0)
      .map((k) => store.files[k]);
  }

  function bumpProject(store) {
    const m = manifest(store);
    m.project.rev = (m.project.rev || 0) + 1;
    m.project.updatedAt = nowIso();
  }

  function recomputeIndex(store, catalogue) {
    const m = manifest(store);
    const setups = listSetups(store).map((s) => ({
      id: s.id,
      behaviourId: s.behaviourId,
      rev: s.rev,
      playable: true,
      warnings: 0,
      used: true,
    }));
    const units = listUnits(store).map((u) => ({
      id: u.id,
      setupIds: u.setupIds || [],
      onStages: (m.project.stages || []).filter((sid) => {
        const st = getStage(store, sid);
        if (!st) return false;
        const lo = st.loadout || m.project.loadout;
        if (lo && (lo.roster || []).indexOf(u.id) >= 0) return true;
        if ((st.neutrals || []).some((n) => n.unitId === u.id)) return true;
        const pool = st.enemyPool;
        if (!pool) return false;
        if (pool.mode === "fixed") return (pool.entries || []).some((e) => e.unitId === u.id);
        if (pool.mode === "weighted") return (pool.entries || []).some((e) => e.unitId === u.id);
        if (pool.mode === "waves")
          return (pool.waves || []).some((w) => (w.entries || []).some((e) => e.unitId === u.id));
        return false;
      }),
      used: true,
    }));
    const maps = listMaps(store).map((map) => ({
      id: map.id,
      cols: map.cols,
      rows: map.rows,
      usedByStages: (m.project.stages || []).filter((sid) => {
        const st = getStage(store, sid);
        return st && st.mapRef === map.id;
      }),
    }));
    const stages = listStages(store).map((st) => ({
      id: st.id,
      mapRef: st.mapRef,
      selected: (m.project.render.excludedStages || []).indexOf(st.id) < 0,
    }));
    const notes = store.files["notes/notes.json"] || emptyNotes();
    // Export-closure size: exclude role:"source" asset files (§6.2.1 / §10)
    const assetMeta = m.project.assets || {};
    const sourceIds = new Set(
      Object.keys(assetMeta).filter((id) => assetMeta[id] && assetMeta[id].role === "source")
    );
    let totalBytes = 0;
    const files = [];
    const byKind = {};
    Object.keys(store.files).forEach((k) => {
      if (k.indexOf("assets/") === 0) {
        const base = k.slice("assets/".length);
        const aid = base.replace(/\.[^.]+$/, "");
        if (sourceIds.has(aid)) return; // never in export closure
      }
      const bytes = JSON.stringify(store.files[k]).length;
      totalBytes += bytes;
      const kind = k.indexOf("assets/") === 0 ? "image" : "data";
      byKind[kind] = (byKind[kind] || 0) + bytes;
      files.push({ path: k, bytes, kind });
    });
    // Decoded-size meter (§10) — thresholds from target-size-limits.md (Architect)
    const decodedImages = [];
    let decodedTotal = 0;
    Object.keys(assetMeta).forEach((id) => {
      if (sourceIds.has(id)) return;
      const meta = assetMeta[id];
      if (!meta || meta.kind === "audio") return;
      const w = meta.w | 0;
      const h = meta.h | 0;
      if (!w || !h) return;
      const bytes = w * h * 4;
      decodedImages.push({ assetId: id, w, h, bytes });
      decodedTotal += bytes;
    });
    let peak = { stageId: null, bytes: 0 };
    (m.project.stages || []).forEach((sid) => {
      if ((m.project.render.excludedStages || []).indexOf(sid) >= 0) return;
      const st = getStage(store, sid);
      if (!st) return;
      const used = new Set();
      const map = getMap(store, st.mapRef);
      if (map) {
        (map.layers || []).forEach((l) => { if (l.tileset) used.add(l.tileset); });
        if (map.background && map.background.assetId) used.add(map.background.assetId);
        (map.background && map.background.layers || []).forEach((l) => { if (l.assetId) used.add(l.assetId); });
        if (map.wallLook && map.wallLook.assetId) used.add(map.wallLook.assetId);
        (map.logic && map.logic.edges || []).forEach((e) => {
          if (e && e.look && e.look.assetId) used.add(e.look.assetId);
        });
        (map.objects || []).forEach((o) => { if (o && o.assetId) used.add(o.assetId); });
      }
      listUnits(store).forEach((u) => {
        if (!u.sprite) return;
        const lo = st.loadout || m.project.loadout;
        const inLo = lo && (lo.roster || []).indexOf(u.id) >= 0;
        const inN = (st.neutrals || []).some((n) => n.unitId === u.id);
        const pool = st.enemyPool;
        let inE = false;
        if (pool && pool.mode === "fixed") inE = (pool.entries || []).some((e) => e.unitId === u.id);
        if (pool && pool.mode === "weighted") inE = (pool.entries || []).some((e) => e.unitId === u.id);
        if (pool && pool.mode === "waves")
          inE = (pool.waves || []).some((w) => (w.entries || []).some((e) => e.unitId === u.id));
        if (inLo || inN || inE) used.add(u.sprite);
      });
      let stageBytes = 0;
      used.forEach((aid) => {
        if (sourceIds.has(aid)) return;
        stageBytes += assetDecodedBytes(assetMeta[aid]);
      });
      if (stageBytes > peak.bytes) peak = { stageId: sid, bytes: stageBytes };
    });
    const sizeWarnings = [];
    const mb = totalBytes / (1024 * 1024);
    if (mb >= BUILD_STRONG_MB) sizeWarnings.push({ code: "build-size-strong", detail: Math.round(mb) + " MB (over " + BUILD_STRONG_MB + " MB)" });
    else if (mb >= BUILD_WARN_MB) sizeWarnings.push({ code: "build-size", detail: Math.round(mb) + " MB (over " + BUILD_WARN_MB + " MB)" });
    if (totalBytes >= SIZE_WARN_BYTES) sizeWarnings.push({ code: "editor-size", detail: Math.round(totalBytes / 1024) + " KB" });
    ensureRenderFields(m);
    const targets = (m.project.render && m.project.render.targets) || ["browser"];
    const platform = (m.project.settings && m.project.settings.platform) || "mobile";
    function decodedLevel(bytes, softMb, strongMb) {
      const vmb = bytes / (1024 * 1024);
      if (vmb >= strongMb) return "strong";
      if (vmb >= softMb) return "warn";
      return "ok";
    }
    function pushDecodedMeters(keyPrefix, row) {
      const peakLevel = decodedLevel(peak.bytes, row.stage_peak.warn, row.stage_peak.strong);
      const totalLevel = decodedLevel(decodedTotal, row.total.warn, row.total.strong);
      meters.push({
        key: "decoded." + keyPrefix + ".stage_peak",
        value: peak.bytes,
        soft: row.stage_peak.warn * 1024 * 1024,
        strong: row.stage_peak.strong * 1024 * 1024,
        level: peakLevel,
      });
      meters.push({
        key: "decoded." + keyPrefix + ".total",
        value: decodedTotal,
        soft: row.total.warn * 1024 * 1024,
        strong: row.total.strong * 1024 * 1024,
        level: totalLevel,
      });
      if (peakLevel !== "ok" || totalLevel !== "ok") {
        sizeWarnings.push({
          code: "decoded-" + keyPrefix,
          detail: "may be closed on low-end phones",
          level: peakLevel === "strong" || totalLevel === "strong" ? "strong" : "warn",
        });
      }
    }
    const meters = [
      {
        key: "build.total",
        value: totalBytes,
        soft: BUILD_WARN_MB * 1024 * 1024,
        strong: BUILD_STRONG_MB * 1024 * 1024,
        level: mb >= BUILD_STRONG_MB ? "strong" : mb >= BUILD_WARN_MB ? "warn" : "ok",
      },
    ];
    if (targets.indexOf("ios") >= 0) pushDecodedMeters("ios", DECODED_THRESHOLDS.ios);
    if (targets.indexOf("android") >= 0) pushDecodedMeters("android", DECODED_THRESHOLDS.android);
    if (targets.indexOf("browser") >= 0) {
      if (platform === "mobile" || platform === "both") pushDecodedMeters("web_mobile", DECODED_THRESHOLDS.web_mobile);
      if (platform === "pc" || platform === "both") pushDecodedMeters("web_desktop", DECODED_THRESHOLDS.web_desktop);
    }

    const assetIndex = Object.keys(assetMeta).map((id) => {
      const meta = assetMeta[id];
      return {
        id,
        role: meta.role || null,
        w: meta.w || null,
        h: meta.h || null,
        decodedBytes: assetDecodedBytes(meta),
        oddSize: assetIsOddSize(meta),
        used: meta.role !== "source",
      };
    });

    m.index = {
      computedAt: nowIso(),
      projectRev: m.project.rev,
      catalogueRev: m.project.catalogueRev,
      setups,
      behaviours: [],
      presets: [],
      units,
      maps,
      stages,
      assets: assetIndex,
      presentation: { groups: [], usesCardHand: false, usesMenu: true },
      export: {
        stages: (m.project.stages || []).filter((id) => (m.project.render.excludedStages || []).indexOf(id) < 0),
        setups: setups.map((s) => s.id),
        behaviours: [],
        units: units.map((u) => u.id),
        assets: Object.keys(assetMeta).filter((id) => assetMeta[id].role !== "source"),
        extensions: [],
        errors: [],
        warnings: [],
      },
      size: {
        totalBytes,
        fileCount: files.length,
        files,
        byKind,
        byTarget: {},
        decoded: {
          images: decodedImages,
          totalBytes: decodedTotal,
          stagePeak: peak,
          residentEstimate: peak, // legacy alias
          chunkCacheBytes: { phone: CHUNK_CACHE_MB.phone * 1024 * 1024, desktop: CHUNK_CACHE_MB.desktop * 1024 * 1024 },
        },
        meters,
        warnings: sizeWarnings,
      },
      notes: {
        open: (notes.notes || []).filter((n) => n.status === "open").length,
        total: (notes.notes || []).length,
      },
    };
    const bids = new Set(setups.map((s) => s.behaviourId));
    bids.add("ability-presentation");
    bids.add("unit-roster");
    store.files["catalogue/slice.json"] = makeSlice(catalogue || { behaviours: [] }, [...bids]);
  }

  async function openOrCreate(catalogue, opts) {
    const notices = [];
    const hasOpfs = await probeOpfs();
    if (opfsNote) notices.push(opfsNote);

    if (hasOpfs) {
      let store = await readOpfsStore(opts && opts.projectId);
      if (store) {
        store = migrateExistingStore(store, catalogue, opts && opts.shellState);
        recomputeIndex(store, catalogue);
        return { store, notices: notices.concat(store.notices || []), readOnly: false };
      }
      const raw = readLocalFallback();
      if (raw && raw.files && raw.files["project.json"]) {
        store = importPrototype(catalogue, opts && opts.shellState);
        await writeOpfsStore(store);
        notices.push("migrated localStorage → OPFS tileengine/projects/" + store.projectId);
        return { store, notices: notices.concat(store.notices || []), readOnly: false };
      }
      store = createBlankProject(catalogue, opts);
      // seed shell units if provided
      if (opts && opts.shellState) seedShell(store, catalogue, opts.shellState);
      await writeOpfsStore(store);
      notices.push("created blank project (OPFS)");
      return { store, notices, readOnly: false };
    }

    // memory / no OPFS
    const raw = readLocalFallback();
    let store;
    if (raw && raw.files && raw.files["project.json"]) {
      store = importPrototype(catalogue, opts && opts.shellState);
      notices.push("imported localStorage (OPFS unavailable)");
    } else {
      store = createBlankProject(catalogue, opts);
      if (opts && opts.shellState) seedShell(store, catalogue, opts.shellState);
      notices.push("created blank project (memory)");
    }
    store.storage = "memory";
    return { store, notices: notices.concat(store.notices || []), readOnly: false };
  }

  function migrateExistingStore(store, catalogue, shellState) {
    const m = manifest(store);
    if (m.formatVersion < 2) {
      store = importPrototype(catalogue, shellState);
    } else {
      const stageIds = m.project.stages || [];
      const needMigrate = stageIds.some((id) => !getStage(store, id) && getMap(store, id));
      if (needMigrate) store = importPrototype(catalogue, shellState);
    }
    ensureProjectV3(store, catalogue);
    store.projectId = manifest(store).project.id;
    store.notices = store.notices || [];
    return store;
  }

  function seedShell(store, catalogue, shellState) {
    const m = manifest(store);
    const army = armyDefaults(catalogue, store);
    (shellState.units || []).forEach((su) => {
      upsertUnit(store, catalogue, {
        id: "shell-" + su.id,
        name: su.name,
        hp: su.hp,
        atk: su.atk,
      });
    });
    m.project.loadout.roster = (shellState.units || []).map((u) => "shell-" + u.id);
    if (shellState.loadoutSlots) m.project.loadout.size = shellState.loadoutSlots;
    const st = listStages(store)[0];
    if (st && shellState.units) {
      st.playerSpawns = shellState.units.map((u) => ({ c: u.x || 0, r: u.y || 0 }));
      saveStage(store, st);
    }
  }

  async function persist(store, catalogue) {
    recomputeIndex(store, catalogue);
    let bytes = 0;
    Object.keys(store.files).forEach((k) => (bytes += JSON.stringify(store.files[k]).length));
    if (store.storage === "opfs" || (await probeOpfs())) {
      try {
        bytes = await writeOpfsStore(store);
      } catch (e) {
        store.storage = "memory";
        opfsNote = "OPFS write failed — keeping project in memory this session.";
      }
    } else {
      store.storage = "memory";
    }
    const mb = bytes / (1024 * 1024);
    const sizeWarnings = (manifest(store).index && manifest(store).index.size && manifest(store).index.size.warnings) || [];
    return {
      bytes,
      warn: bytes >= SIZE_WARN_BYTES || mb >= BUILD_WARN_MB,
      message:
        mb >= BUILD_STRONG_MB
          ? "Build is large (" + Math.round(mb) + " MB). Over " + BUILD_STRONG_MB + " MB — still allowed."
          : mb >= BUILD_WARN_MB
            ? "Build is getting large (" + Math.round(mb) + " MB). Over " + BUILD_WARN_MB + " MB — nothing blocked."
            : bytes >= SIZE_WARN_BYTES
              ? "This project is getting large (" + Math.round(bytes / 1024) + " KB). Nothing is blocked — just a heads-up."
              : null,
      storage: store.storage,
      opfsNote,
      sizeWarnings,
    };
  }

  function exportPlaceholder(store) {
    const blob = new Blob([JSON.stringify({ files: store.files }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (manifest(store).project.name || "project").replace(/\s+/g, "-") + ".tileproj.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function addNote(store, text, capture) {
    const notes = store.files["notes/notes.json"] || emptyNotes();
    notes.notes = notes.notes || [];
    notes.notes.push({
      id: ulid("note"),
      kind: "note",
      status: "open",
      text: String(text || ""),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      statusAt: nowIso(),
      capture: capture || null,
      anchors: [],
    });
    notes.rev += 1;
    store.files["notes/notes.json"] = notes;
    bumpProject(store);
    return notes;
  }

  /* presentation helpers */

  function mapOptionViaCatalogue(catalogue, behaviourId, knobId, value) {
    if (value == null) return value;
    const beh = (catalogue.behaviours || []).find((b) => b.id === behaviourId);
    const knob = beh && (beh.knobs || []).find((k) => k.id === knobId || (k.renamed_from || []).indexOf(knobId) >= 0);
    if (!knob || !Array.isArray(knob.options)) return value;
    if (knob.options.some((o) => (typeof o === "object" ? o.value : o) === value)) return value;
    const hit = knob.options.find(
      (o) => o && typeof o === "object" && Array.isArray(o.renamed_from) && o.renamed_from.indexOf(value) >= 0
    );
    return hit ? hit.value : value;
  }

  function resolveShortcutKnobId(catalogue) {
    const beh = (catalogue.behaviours || []).find((b) => b.id === "ability-presentation");
    if (!beh) return "shortcut";
    if ((beh.knobs || []).some((k) => k.id === "shortcut")) return "shortcut";
    if ((beh.knobs || []).some((k) => k.id === "style")) return "style";
    return "shortcut";
  }

  function presentationFromProject(store, catalogue) {
    const setups = listSetups(store);
    const ap = setups.find((s) => s.behaviourId === "ability-presentation");
    const beh = (catalogue.behaviours || []).find((b) => b.id === "ability-presentation");
    const knob = beh && (beh.knobs || []).find((k) => k.id === "shortcut" || k.id === "style");
    if (ap && ap.answers) {
      const a = ap.answers.shortcut || ap.answers.style;
      if (a) {
        if (a.source === "default") return knob ? knob.default : "all-menu";
        return a.value;
      }
    }
    return knob ? knob.default : "all-menu";
  }

  function setPresentation(store, catalogue, styleOrShortcut, SetupStore) {
    let setup = listSetups(store).find((s) => s.behaviourId === "ability-presentation");
    if (!setup) {
      const created = SetupStore.createSetup("ability-presentation", catalogue, "Ability presentation");
      setup = created.doc;
      const m = manifest(store);
      m.project.rules = m.project.rules || [];
      if (m.project.rules.indexOf(setup.id) < 0) m.project.rules.push(setup.id);
    }
    if (SetupStore.loadSetup) {
      const mig = SetupStore.loadSetup(setup, catalogue);
      if (mig && mig.doc) setup = mig.doc;
    }
    const kid = resolveShortcutKnobId(catalogue);
    let shortcut = mapOptionViaCatalogue(catalogue, "ability-presentation", kid, styleOrShortcut);
    if (shortcut === "unit-menu") shortcut = mapOptionViaCatalogue(catalogue, "ability-presentation", kid, "unit-action-menu");
    if (shortcut === "cards") shortcut = mapOptionViaCatalogue(catalogue, "ability-presentation", kid, "card-hand");
    const res = SetupStore.editAnswer(setup, kid, shortcut, setup.rev, catalogue);
    if (res.doc) {
      setup = res.doc;
      saveSetupFile(store, setup);
      bumpProject(store);
    }
    return setup;
  }

  function setPresentationKnob(store, catalogue, knobId, value, SetupStore) {
    let setup = listSetups(store).find((s) => s.behaviourId === "ability-presentation");
    if (!setup) {
      setPresentation(store, catalogue, "all-menu", SetupStore);
      setup = listSetups(store).find((s) => s.behaviourId === "ability-presentation");
    }
    if (!setup) return null;
    const res = SetupStore.editAnswer(setup, knobId, value, setup.rev, catalogue);
    if (res.doc) {
      saveSetupFile(store, res.doc);
      bumpProject(store);
      return res.doc;
    }
    return setup;
  }

  function getPresentationAnswers(store, catalogue) {
    const beh = (catalogue.behaviours || []).find((b) => b.id === "ability-presentation");
    const setup = listSetups(store).find((s) => s.behaviourId === "ability-presentation");
    const out = {};
    (beh && beh.knobs ? beh.knobs : []).forEach((k) => {
      const a = setup && setup.answers[k.id];
      out[k.id] = a ? (a.source === "default" ? k.default : a.value) : k.default;
    });
    return out;
  }

  /** Godmode save-back: what + where → one layer */
  function saveBackGodmode(store, catalogue, opts) {
    // opts: { what: 'setup'|'army'|'unit-stat', where: 'this-stage'|'all-stages',
    //         setupId?, knobId?, unitId?, statId?, value, stageId, SetupStore? }
    const stage = getStage(store, opts.stageId);
    if (opts.what === "unit-stat") {
      if (opts.where === "this-stage" && stage) {
        stage.overrides = stage.overrides || emptyOverrides();
        stage.overrides.units = stage.overrides.units || {};
        stage.overrides.units[opts.unitId] = stage.overrides.units[opts.unitId] || {};
        const prev = stage.overrides.units[opts.unitId][opts.statId];
        stage.overrides.units[opts.unitId][opts.statId] = { value: opts.value, rev: prev ? prev.rev + 1 : 0 };
        saveStage(store, stage);
      } else {
        setUnitStat(store, catalogue, opts.unitId, opts.statId, opts.value);
      }
      return { ok: true };
    }
    // setup / army knob
    if (opts.where === "this-stage" && stage) {
      stage.overrides = stage.overrides || emptyOverrides();
      stage.overrides.setups = stage.overrides.setups || {};
      const behKey = opts.behaviourId || (getSetup(store, opts.setupId) || {}).behaviourId || opts.setupId;
      stage.overrides.setups[behKey] = stage.overrides.setups[behKey] || {};
      const prev = stage.overrides.setups[behKey][opts.knobId];
      stage.overrides.setups[behKey][opts.knobId] = { value: opts.value, rev: prev ? prev.rev + 1 : 0 };
      saveStage(store, stage);
      return { ok: true };
    }
    const setup = getSetup(store, opts.setupId);
    if (setup && opts.SetupStore) {
      const res = opts.SetupStore.editAnswer(setup, opts.knobId, opts.value, setup.rev, catalogue);
      if (res.doc) {
        // tag note preview if possible — editAnswer may not accept note; store as-is
        saveSetupFile(store, res.doc);
      }
      return { ok: !!res.doc, skipped: res.error ? [res.error] : [] };
    }
    return { ok: false };
  }


  function ensureRenderFields(m) {
    m.project.render = m.project.render || { excludedStages: [], targets: ["browser"] };
    const r = m.project.render;
    if (r.proceduralShip == null) r.proceduralShip = "auto";
    if (r.credits == null) r.credits = true;
    if (!("creditsText" in r)) r.creditsText = null;
    return r;
  }

  function defaultCreditsText(store) {
    const m = manifest(store);
    const lines = ["Credits", "=======", ""];
    const assets = (m.project && m.project.assets) || {};
    const ids = Object.keys(assets).filter((id) => assets[id] && assets[id].role !== "source");
    if (!ids.length) {
      lines.push("(no credited assets yet)");
    } else {
      ids.forEach((id) => {
        const a = assets[id];
        const credit = a.credit || {};
        const title = credit.title || a.name || id;
        const author = credit.author || "credit not provided";
        const license = credit.license || "";
        lines.push("- " + title + (author ? " — " + author : "") + (license ? " (" + license + ")" : ""));
      });
    }
    lines.push("", "Generated by TileEngine");
    return lines.join("\n");
  }

  function mapTileSize(store, map) {
    if (map && map.tile && map.tile.w) return map.tile.w;
    try {
      const m = store ? manifest(store) : null;
      if (m && m.project && m.project.settings && m.project.settings.tileSize) return m.project.settings.tileSize;
    } catch (e) {}
    return 64;
  }

  function resolveWallLook(map, edge, tileSize) {
    const tsz = tileSize != null ? tileSize : (map && map.tile && map.tile.w) || 64;
    const stock = stockWallLook(tsz);
    const look = (edge && edge.look) || (map && map.wallLook) || null;
    if (!look || !look.mode) return Object.assign({}, stock);
    if (look.mode === "invisible") return { mode: "invisible" };
    if (look.mode === "asset") {
      return {
        mode: "asset",
        assetId: look.assetId || null,
        // warn when asset width ≠ tile — caller may surface
        warnNotTileWide: true,
      };
    }
    return {
      mode: "line",
      colour: look.colour || stock.colour,
      width: look.width != null ? Math.max(1, look.width | 0) : stock.width,
    };
  }

  function setMapWallLook(store, mapId, look) {
    const map = getMap(store, mapId);
    if (!map) return null;
    if (!look) delete map.wallLook;
    else map.wallLook = look;
    map.updatedAt = nowIso();
    saveMap(store, map);
    return map;
  }

  function ensureMapObjects(map) {
    if (!map) return [];
    if (!Array.isArray(map.objects)) map.objects = [];
    return map.objects;
  }

  function listMapObjects(store, mapId) {
    const map = getMap(store, mapId);
    return ensureMapObjects(map).slice();
  }

  function objectAt(map, c, r) {
    const objs = ensureMapObjects(map);
    return objs.find((o) => o && o.at && (o.at.c | 0) === (c | 0) && (o.at.r | 0) === (r | 0)) || null;
  }

  function addMapObject(store, mapId, obj) {
    const map = getMap(store, mapId);
    if (!map) return null;
    const objs = ensureMapObjects(map);
    const id = (obj && obj.id) || ulid("obj").replace(/^obj_/, "o").slice(0, 32);
    const next = {
      id,
      assetId: (obj && obj.assetId) || null,
      at: { c: (obj && obj.at && obj.at.c) | 0, r: (obj && obj.at && obj.at.r) | 0 },
      blocks: !!(obj && obj.blocks),
    };
    if (obj && "blocks_los" in obj) next.blocks_los = obj.blocks_los;
    if (obj && "blocks_shots" in obj) next.blocks_shots = obj.blocks_shots;
    // one object per cell: replace
    const i = objs.findIndex((o) => o && o.at && o.at.c === next.at.c && o.at.r === next.at.r);
    if (i >= 0) objs.splice(i, 1);
    objs.push(next);
    map.updatedAt = nowIso();
    saveMap(store, map);
    return next;
  }

  function removeMapObjectAt(store, mapId, c, r) {
    const map = getMap(store, mapId);
    if (!map) return false;
    const objs = ensureMapObjects(map);
    const i = objs.findIndex((o) => o && o.at && (o.at.c | 0) === (c | 0) && (o.at.r | 0) === (r | 0));
    if (i < 0) return false;
    objs.splice(i, 1);
    map.updatedAt = nowIso();
    saveMap(store, map);
    return true;
  }

  function updateMapObject(store, mapId, objectId, patch) {
    const map = getMap(store, mapId);
    if (!map) return null;
    const objs = ensureMapObjects(map);
    const o = objs.find((x) => x && x.id === objectId);
    if (!o) return null;
    Object.assign(o, patch || {});
    map.updatedAt = nowIso();
    saveMap(store, map);
    return o;
  }

  function toggleMapObjectAt(store, mapId, c, r, defaults) {
    const map = getMap(store, mapId);
    if (!map) return { action: "none" };
    const existing = objectAt(map, c, r);
    if (existing) {
      removeMapObjectAt(store, mapId, c, r);
      return { action: "removed", object: existing };
    }
    const created = addMapObject(store, mapId, Object.assign({ at: { c, r }, blocks: false }, defaults || {}));
    return { action: "added", object: created };
  }

  function suggestedTileSize(platform) {
    const table = TILE_SIZE_SUGGESTION;
    if (platform && Object.prototype.hasOwnProperty.call(table, platform)) return table[platform];
    // No invented fallback — table is the only source; unknown platform → undefined
    return table[platform];
  }

  function estimateSize(store) {
    const m = manifest(store);
    const assetMeta = (m.project && m.project.assets) || {};
    const sourceIds = new Set(
      Object.keys(assetMeta).filter((id) => assetMeta[id] && assetMeta[id].role === "source")
    );
    let bytes = 0;
    Object.keys(store.files || {}).forEach((k) => {
      if (k.indexOf("assets/") === 0) {
        const base = k.slice("assets/".length);
        const aid = base.replace(/\.[^.]+$/, "");
        if (sourceIds.has(aid)) return;
      }
      bytes += JSON.stringify(store.files[k]).length;
    });
    return bytes;
  }

  global.ProjectStore = {
    LEGACY_VFS,
    SIZE_WARN_BYTES,
    BUILD_WARN_MB,
    BUILD_STRONG_MB,
    TILE_SIZE_SUGGESTION,
    DECODED_THRESHOLDS,
    CHUNK_CACHE_MB,
    STOCK_WALL_COLOUR,
    stockWallWidth,
    stockWallLook,
    ensureRenderFields,
    defaultCreditsText,
    resolveWallLook,
    mapTileSize,
    setMapWallLook,
    ensureMapObjects,
    listMapObjects,
    objectAt,
    addMapObject,
    removeMapObjectAt,
    updateMapObject,
    toggleMapObjectAt,
    openOrCreate,
    createBlankProject,
    importPrototype,
    persist,
    exportPlaceholder,
    manifest,
    getMap,
    listMaps,
    getStage,
    listStages,
    addStage,
    duplicateStage,
    renameStage,
    reorderStage,
    setStageMap,
    saveMap,
    saveStage,
    effectiveLoadout,
    setProjectLoadout,
    setStageLoadout,
    setEnemyPool,
    emptyEnemyPool,
    getUnit,
    listUnits,
    upsertUnit,
    saveUnit,
    resolveUnitStat,
    setUnitStat,
    armyDefaults,
    getSetup,
    saveSetupFile,
    listSetups,
    addNote,
    presentationFromProject,
    setPresentation,
    setPresentationKnob,
    getPresentationAnswers,
    saveBackGodmode,
    estimateSize,
    suggestedTileSize,
    recomputeIndex,
    probeOpfs,
    getOpfsNote: () => opfsNote,
    ensureProjectV3,
    migrateMapToV4,
    toggleMapEdge,
    canonicalizeEdge,
    paintLogicTile,
    listVisibleAssets,
    assetDecodedBytes,
    assetIsOddSize,
    loadEditorPrefs,
    saveEditorPrefs,
    getMapEditorPrefs,
    setMapEditorPrefs,
    OPFS_EDITOR_PREFS,
    effectiveAdvancedRender,
    effectivePixelPerfect,
    effectiveBackgroundFit,
    effectiveDifficulty,
    setProjectDifficulty,
    setStageDifficultyField,
    setStagePresentationOverride,
  };
})(typeof window !== "undefined" ? window : globalThis);
