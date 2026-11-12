/* Studio profile store — aligns with data/profile-format.md r2 (PROPOSED).
   Prototype still uses localStorage; import-only key noted in §1.1.
   This is the STUDIO profile (editor), not a built game's player-profile. */
(function (global) {
  "use strict";

  const KEY = "tileengine.profile.v1"; // prototype; format says OPFS tileengine/profile.json
  const LEGACY_KEY = "tileengine.user-profile.v1"; // import-only
  const PREFS_KEY = "tileengine.editor-prefs.v1"; // device-local; toast-seen + audition volume
  const DEVICE = "device_proto";

  const AVATARS = [
    { id: "avatar_knight", label: "Knight" },
    { id: "avatar_mage", label: "Mage" },
    { id: "avatar_rogue", label: "Rogue" },
    { id: "avatar_archer", label: "Archer" },
    { id: "avatar_slime", label: "Slime" },
    { id: "avatar_dragon", label: "Dragon" },
    { id: "avatar_wolf", label: "Wolf" },
    { id: "avatar_cat", label: "Cat" },
    { id: "avatar_owl", label: "Owl" },
    { id: "avatar_robot", label: "Robot" },
    { id: "avatar_ghost", label: "Ghost" },
    { id: "avatar_fox", label: "Fox" },
  ];

  /** Built-in editor achievement-set (scope editor). title + trigger per DSK §2 / §5.3 */
  const ACHIEVEMENTS = [
    { id: "ach_first_stage", rev: 1, title: "Make your first stage", description: "Create a stage in a project.", category: "editor", scope: "editor", trigger: { event: "stageCreated", count: 1 }, hidden: false },
    { id: "ach_first_sprite", rev: 1, title: "First sprite", description: "Upload a sprite for a unit.", category: "editor", scope: "editor", trigger: { event: "spriteUploaded", count: 1 }, hidden: false },
    { id: "ach_first_paint", rev: 1, title: "Paint the floor", description: "Paint at least one tile on a stage.", category: "editor", scope: "editor", trigger: { event: "tilePainted", count: 1 }, hidden: false },
    { id: "ach_first_wall", rev: 1, title: "Draw a wall", description: "Add a wall edge on a stage.", category: "editor", scope: "editor", trigger: { event: "wallAdded", count: 1 }, hidden: false },
    { id: "ach_first_unit", rev: 1, title: "Cast a unit", description: "Place a unit on a stage.", category: "editor", scope: "editor", trigger: { event: "unitPlaced", count: 1 }, hidden: false },
    { id: "ach_first_behaviour", rev: 1, title: "Give it a mind", description: "Assign a behaviour to a unit.", category: "editor", scope: "editor", trigger: { event: "behaviourAssigned", count: 1 }, hidden: false },
    { id: "ach_five_stages", rev: 1, title: "Stagewright", description: "Have five stages in one project.", category: "editor", scope: "editor", trigger: { event: "stageCreated", count: 5, groupBy: "projectId" }, hidden: false },
    { id: "ach_tile_legend", rev: 1, title: "Legend keeper", description: "Open the tile legend.", category: "editor", scope: "editor", trigger: { event: "legendOpened", count: 1 }, hidden: false },
    { id: "ach_wizard_done", rev: 1, title: "Wizard graduate", description: "Finish the New Project wizard.", category: "editor", scope: "editor", trigger: { event: "wizardCompleted", count: 1 }, hidden: false },
    { id: "ach_dark_mode", rev: 1, title: "Night editor", description: "Switch Appearance to Dark.", category: "editor", scope: "editor", trigger: { event: "themeChanged", count: 1, where: { theme: "dark" } }, hidden: false },
    { id: "ach_first_play", rev: 1, title: "First play-test", description: "Run a play-test from the stage editor.", category: "play", scope: "editor", trigger: { event: "previewStarted", count: 1 }, hidden: false },
    { id: "ach_play_three", rev: 1, title: "Play it again", description: "Play-test three times.", category: "play", scope: "editor", trigger: { event: "previewStarted", count: 3 }, hidden: false },
    { id: "ach_complete_game", rev: 1, title: "Complete your first game", description: "Finish a play-through end-to-end.", category: "play", scope: "editor", trigger: { event: "gameCompleted", count: 1 }, hidden: false },
    { id: "ach_win_stage", rev: 1, title: "Stage clear", description: "Clear one stage in play.", category: "play", scope: "editor", trigger: { event: "stageCleared", count: 1 }, hidden: false },
    { id: "ach_no_damage", rev: 1, title: "Untouchable", description: "Clear a stage without taking damage.", category: "play", scope: "editor", trigger: { event: "stageCleared", count: 1, where: { damageTaken: 0 } }, hidden: true },
    { id: "ach_first_build", rev: 1, title: "Ship it", description: "Start a build / export from Render.", category: "sharing", scope: "editor", trigger: { event: "buildStarted", count: 1 }, hidden: false },
    { id: "ach_export_json", rev: 1, title: "Pack the project", description: "Export project JSON.", category: "sharing", scope: "editor", trigger: { event: "projectExported", count: 1 }, hidden: false },
    { id: "ach_first_save", rev: 1, title: "First save", description: "Save a project for the first time.", category: "sharing", scope: "editor", trigger: { event: "projectSaved", count: 1 }, hidden: false },
    { id: "ach_first_export", rev: 1, title: "Ship it out", description: "Finish an export.", category: "sharing", scope: "editor", trigger: { event: "exportCompleted", count: 1 }, hidden: false },
    { id: "ach_share_link", rev: 1, title: "Pass it on", description: "Share a project link (when sharing ships).", category: "sharing", scope: "editor", trigger: { event: "projectShared", count: 1 }, hidden: false },
    { id: "ach_credits_edit", rev: 1, title: "Credit where due", description: "Edit the project credits file.", category: "sharing", scope: "editor", trigger: { event: "creditsEdited", count: 1 }, hidden: false },
    { id: "ach_library_use", rev: 1, title: "Kenney stash", description: "Use a library art asset in a project.", category: "sharing", scope: "editor", trigger: { event: "libraryAssetUsed", count: 1 }, hidden: false },
  ];

  /* r8 §1.12.4 / §1.12.9 ACCEPTED: metric achievements (editor set). Thresholds are final. */
  const METRIC_ACHIEVEMENTS = [
    { id: "ach_sold_10", rev: 1, title: "Sold 10", description: "Sell your own assets in the shop, 10 paid sales.", category: "sharing", scope: "editor", trigger: { metric: "assetSales", count: 10 }, hidden: false },
    { id: "ach_sold_50", rev: 1, title: "Sold 50", description: "Sell your own assets in the shop, 50 paid sales.", category: "sharing", scope: "editor", trigger: { metric: "assetSales", count: 50 }, hidden: false },
    { id: "ach_sold_250", rev: 1, title: "Sold 250", description: "Sell your own assets in the shop, 250 paid sales.", category: "sharing", scope: "editor", trigger: { metric: "assetSales", count: 250 }, hidden: false },
    { id: "ach_sold_100", rev: 1, title: "Sold 100", description: "Sell your own assets in the shop, 100 paid sales.", category: "sharing", scope: "editor", trigger: { metric: "assetSales", count: 100 }, hidden: false },
    { id: "ach_published_1", rev: 1, title: "Published 1", description: "Publish a game.", category: "sharing", scope: "editor", trigger: { metric: "gamesPublished", count: 1 }, hidden: false },
    { id: "ach_published_5", rev: 1, title: "Published 5", description: "Publish 5 games.", category: "sharing", scope: "editor", trigger: { metric: "gamesPublished", count: 5 }, hidden: false },
    { id: "ach_published_20", rev: 1, title: "Published 20", description: "Publish 20 games.", category: "sharing", scope: "editor", trigger: { metric: "gamesPublished", count: 20 }, hidden: false },
    { id: "ach_published_10", rev: 1, title: "Published 10", description: "Publish 10 games.", category: "sharing", scope: "editor", trigger: { metric: "gamesPublished", count: 10 }, hidden: false },
    { id: "ach_unlocks_10", rev: 1, title: "Ten unlocked", description: "Unlock 10 achievements.", category: "editor", scope: "editor", trigger: { metric: "achievementsUnlocked", count: 10 }, hidden: false },
    { id: "ach_unlocks_20", rev: 1, title: "All 20 starters", description: "Unlock all 20 starter achievements.", category: "editor", scope: "editor", trigger: { metric: "achievementsUnlocked", count: 20 }, hidden: false },
  ];

  /* Stub of data/te-cosmetics.json (r8 §1.12.3). Art is placeholder. Thresholds are accepted. Verified creator and Made by TileEngine are not listed — they are trust marks, not cosmetics. */
  const COSMETICS = [
    { key: "badge_first_stage", slot: "badge", title: "First stage", assetKey: "badge_first_stage", unlockedBy: { achievement: "ach_first_stage" } },
    { key: "badge_night_editor", slot: "badge", title: "Night editor", assetKey: "badge_night_editor", unlockedBy: { achievement: "ach_dark_mode" } },
    { key: "badge_wizard", slot: "badge", title: "Wizard graduate", assetKey: "badge_wizard", unlockedBy: { achievement: "ach_wizard_done" } },
    { key: "badge_seller_10", slot: "badge", title: "Seller", assetKey: "badge_seller_10", unlockedBy: { achievement: "ach_sold_10" } },
    { key: "badge_seller_50", slot: "badge", title: "Established seller", assetKey: "badge_seller_50", unlockedBy: { achievement: "ach_sold_50" } },
    { key: "badge_seller_250", slot: "badge", title: "Best seller", assetKey: "badge_seller_250", unlockedBy: { achievement: "ach_sold_250" } },
    { key: "border_seller_100", slot: "border", title: "Seller trim", assetKey: "border_seller_100", unlockedBy: { achievement: "ach_sold_100" } },
    { key: "badge_published_1", slot: "badge", title: "First publish", assetKey: "badge_published_1", unlockedBy: { achievement: "ach_published_1" } },
    { key: "badge_published_5", slot: "badge", title: "Studio author", assetKey: "badge_published_5", unlockedBy: { achievement: "ach_published_5" } },
    { key: "badge_published_20", slot: "badge", title: "Publisher", assetKey: "badge_published_20", unlockedBy: { achievement: "ach_published_20" } },
    { key: "border_published_10", slot: "border", title: "Published trim", assetKey: "border_published_10", unlockedBy: { achievement: "ach_published_10" } },
    { key: "border_achievements_10", slot: "border", title: "Dedicated maker", assetKey: "border_achievements_10", unlockedBy: { achievement: "ach_unlocks_10" } },
    { key: "badge_achievements_20", slot: "badge", title: "Completionist", assetKey: "badge_achievements_20", unlockedBy: { achievement: "ach_unlocks_20" } },
    { key: "badge_game_of_the_month", slot: "badge", title: "Game of the Month", assetKey: "badge_game_of_the_month", unlockedBy: { coinReason: "gameOfTheMonth" } },
    { key: "badge_asset_of_the_month", slot: "badge", title: "Asset of the Month", assetKey: "badge_asset_of_the_month", unlockedBy: { coinReason: "assetOfTheMonth" } },
  ];

  function emptyRewards() {
    return { metrics: {}, metricsAt: null, metricsSig: null, entries: [] };
  }
  function normalizeRewards(raw) {
    if (!raw || typeof raw !== "object") return emptyRewards();
    const m = raw.metrics && typeof raw.metrics === "object" ? raw.metrics : {};
    const metrics = {};
    ["assetSales", "gamesPublished", "achievementsUnlocked"].forEach((k) => {
      if (m[k] != null && m[k] !== "") metrics[k] = Number(m[k]) || 0;
    });
    return {
      metrics,
      metricsAt: raw.metricsAt || null,
      metricsSig: raw.metricsSig || null,
      entries: Array.isArray(raw.entries) ? raw.entries.slice() : [],
    };
  }

  const BTF_TEMPLATE = {
    kind: "game-settings-template",
    formatVersion: 1,
    templateId: "btf-hud-settings",
    schemaVersion: 1,
    pin: "btf-hud-settings@1",
    groups: [
      { id: "audio", label: "Audio", settings: [
        { key: "master", label: "Master volume", type: "slider", default: 100, min: 0, max: 100, step: 1, core: true, showIn: "both", proposed: true },
        { key: "bgm", label: "Music", type: "slider", default: 100, min: 0, max: 100, step: 1, core: true },
        { key: "sfx", label: "Sound", type: "slider", default: 100, min: 0, max: 100, step: 1, core: true },
      ]},
      { id: "display", label: "Display", settings: [
        { key: "graphics", label: "Graphics", type: "picker", default: "high", options: [{ value: "low", label: "Low" }, { value: "mid", label: "Mid" }, { value: "high", label: "High" }], core: true, showIn: "both" },
        { key: "fps", label: "FPS", type: "picker", default: 60, options: [{ value: 30, label: "30 FPS" }, { value: 60, label: "60 FPS" }], core: true, showIn: "both" },
        { key: "theme", label: "Theme", type: "picker", default: "system", options: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "Follow device" }], core: true, showIn: "both" },
        { key: "language", label: "Language", type: "picker", default: "system", options: [{ value: "system", label: "Follow device" }, { value: "en", label: "English" }, { value: "es", label: "Español" }, { value: "ja", label: "日本語" }], core: true, showIn: "both" },
      ]},
      { id: "game", label: "Game (Before The Fall extras)", settings: [
        { key: "edge_glow", label: "Special indicator", type: "toggle", default: true, valueLabels: { on: "SI on", off: "SI off" }, core: false, includeDefault: false, showIn: "both", proposedLabel: true },
        { key: "fight_speed", label: "Fight speed", type: "picker", default: 2, options: [{ value: 1, label: "1x" }, { value: 2, label: "2x" }, { value: 3, label: "3x" }], core: false, includeDefault: false, showIn: "pause", proposedLabel: true },
        { key: "play_screen", label: "Screen layout", type: "picker", default: "mobile", options: [{ value: "mobile", label: "Mobile" }, { value: "pc", label: "PC" }], core: false, includeDefault: false, showIn: "both", proposedLabel: true },
        { key: "piece_size", label: "Piece size", type: "picker", default: "big", options: [{ value: "small", label: "Small pieces" }, { value: "big", label: "Big pieces" }], core: false, includeDefault: false, showIn: "both", proposedLabel: true },
        { key: "fight_auto", label: "Auto potions", type: "toggle", default: false, valueLabels: { on: "Auto on", off: "Auto off" }, core: false, includeDefault: false, showIn: "pause", proposedLabel: true },
      ]},
      { id: "controls", label: "Keybinds (PC)", settings: [
        { key: "key_confirm", label: "Confirm", type: "keybind", default: "Enter", core: false, includeDefault: false, showIn: "both" },
        { key: "key_cancel", label: "Cancel", type: "keybind", default: "Escape", core: false, includeDefault: false, showIn: "both" },
      ]},
    ],
  };

  /** PLACEHOLDER coin amounts (CEO 2026-11-10: random for now). Not final. */
  const COIN_REWARDS = {
    // placeholders — server config will replace
    ach_first_stage: 10,
    ach_wizard_done: 5,
    ach_first_sprite: 8,
    ach_first_paint: 6,
    ach_first_wall: 6,
    ach_first_unit: 8,
    ach_first_behaviour: 12,
    ach_five_stages: 20,
    ach_first_play: 7,
    ach_play_three: 14,
    ach_complete_game: 40,
    ach_win_stage: 15,
    ach_no_damage: 35,
    ach_first_build: 18,
    ach_export_json: 12,
    ach_first_save: 4,
    ach_first_export: 25,
    ach_share_link: 15,
    ach_credits_edit: 9,
    ach_library_use: 11,
    ach_tile_legend: 3,
    ach_dark_mode: 5,
  };

  function ulid(p) {
    return p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function defaults() {
    const at = new Date().toISOString();
    return {
      kind: "profile",
      formatVersion: 1,
      profileId: ulid("profile"),
      createdAt: at,
      prefs: { theme: "system", name: "Maker", avatarId: null, badgeId: null, borderId: null },
      prefStamps: {},
      stats: { counters: {} },
      achievements: [],
      // r2 §1.10: coins ledger is server-authoritative; balance is derived, never stored
      coins: { checkpoint: null, entries: [] },
      // r7 §1.12.5: rewards is a read-only copy of the server's; the client never writes metrics or entries
      rewards: emptyRewards(),
      ownedPacks: [], // local mock of hub purchases (server owns real owned set)
    };
  }

  function loadEditorPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return { seenToasts: {}, previewVolume: 100, achievementsSeen: [] };
      const o = JSON.parse(raw);
      return {
        seenToasts: o.seenToasts && typeof o.seenToasts === "object" ? o.seenToasts : {},
        previewVolume: typeof o.previewVolume === "number" ? o.previewVolume : 100,
        achievementsSeen: Array.isArray(o.achievementsSeen) ? o.achievementsSeen.map(String) : [],
      };
    } catch {
      return { seenToasts: {}, previewVolume: 100, achievementsSeen: [] };
    }
  }

  function saveEditorPrefs(prefs) {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (_) {}
    return prefs;
  }

  function migrateLegacy(raw) {
    const d = defaults();
    if (!raw || typeof raw !== "object") return d;
    if (raw.kind === "profile" && raw.formatVersion === 1) {
      return {
        ...d,
        ...raw,
        prefs: { ...d.prefs, ...(raw.prefs || {}) },
        prefStamps: raw.prefStamps || {},
        stats: raw.stats && raw.stats.counters ? raw.stats : { counters: {} },
        achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
        rewards: raw.rewards ? normalizeRewards(raw.rewards) : emptyRewards(),
      };
    }
    // legacy tile-user-profile
    const prefs = {
      theme: raw.appearance === "light" || raw.appearance === "dark" || raw.appearance === "system" ? raw.appearance : "system",
      name: raw.name || "Maker",
      avatarId: raw.avatarId || null,
    };
    const achievements = [];
    if (raw.progress && typeof raw.progress === "object") {
      Object.keys(raw.progress).forEach((id) => {
        const p = raw.progress[id] || {};
        achievements.push({
          id,
          unlockedAt: p.unlockedAt || null,
          progress: Number(p.count) || 0,
        });
      });
    }
    achievements.sort((a, b) => (a.id < b.id ? -1 : 1));
    // move seenToasts to editor-prefs
    if (raw.seenToasts) {
      const ep = loadEditorPrefs();
      ep.seenToasts = Object.assign({}, ep.seenToasts, raw.seenToasts);
      saveEditorPrefs(ep);
    }
    return { ...d, prefs, achievements };
  }

  function load() {
    try {
      let raw = localStorage.getItem(KEY);
      if (!raw) {
        const leg = localStorage.getItem(LEGACY_KEY);
        if (leg) {
          const migrated = migrateLegacy(JSON.parse(leg));
          migrated.coins = normalizeCoins(migrated.coins);
          save(migrated);
          return migrated;
        }
        return defaults();
      }
      const profile = migrateLegacy(JSON.parse(raw));
      profile.coins = normalizeCoins(profile.coins);
      profile.rewards = normalizeRewards(profile.rewards);
      return profile;
    } catch {
      return defaults();
    }
  }

  function save(profile) {
    profile.coins = normalizeCoins(profile.coins);
    profile.rewards = normalizeRewards(profile.rewards);
    profile.achievements = (profile.achievements || []).slice().sort((a, b) => (a.id < b.id ? -1 : 1));
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch (_) {}
    return profile;
  }

  function stamp(profile, key) {
    profile.prefStamps = profile.prefStamps || {};
    profile.prefStamps[key] = { at: new Date().toISOString(), deviceId: DEVICE };
  }

  function resolvedTheme(theme) {
    if (theme === "light") return "light";
    if (theme === "dark") return "dark";
    const dark = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
    return dark ? "dark" : "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const mode = theme || "system";
    root.setAttribute("data-appearance", mode);
    const resolved = resolvedTheme(mode);
    root.setAttribute("data-theme", resolved);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", resolved === "dark" ? "dark light" : "light dark");
    return resolved;
  }

  function defById(id) {
    return ACHIEVEMENTS.find((a) => a.id === id) || null;
  }

  function ledgerEntry(profile, id) {
    return (profile.achievements || []).find((e) => e.id === id) || null;
  }

  function progressOf(entry, def) {
    if (!entry) return { current: 0, target: (def && def.trigger && def.trigger.count) || 1, unlockedAt: null };
    const target = (def && def.trigger && def.trigger.count) || 1;
    if (typeof entry.progress === "object" && entry.progress) {
      return { current: Number(entry.progress.current) || 0, target: Number(entry.progress.target) || target, unlockedAt: entry.unlockedAt || null };
    }
    return { current: Number(entry.progress) || 0, target, unlockedAt: entry.unlockedAt || null };
  }

  function bumpCounter(profile, event, delta) {
    delta = delta == null ? 1 : delta;
    profile.stats = profile.stats || { counters: {} };
    profile.stats.counters[event] = profile.stats.counters[event] || {};
    const cur = Number(profile.stats.counters[event][DEVICE]) || 0;
    profile.stats.counters[event][DEVICE] = cur + delta;
    return cur + delta;
  }

  function counterSum(profile, event) {
    const m = (profile.stats && profile.stats.counters && profile.stats.counters[event]) || {};
    return Object.keys(m).reduce((s, k) => s + (Number(m[k]) || 0), 0);
  }

  function whereMatch(where, payload) {
    if (!where) return true;
    payload = payload || {};
    return Object.keys(where).every((k) => payload[k] === where[k]);
  }

  /**
   * Record a camelCase editor event. Returns newly unlocked defs (for toasts).
   */
  function recordEvent(event, delta, payload) {
    delta = delta == null ? 1 : delta;
    payload = payload || {};
    const profile = load();
    bumpCounter(profile, event, delta);
    const newly = [];
    for (const def of ACHIEVEMENTS) {
      if (!def.trigger || def.trigger.event !== event) continue;
      if (!whereMatch(def.trigger.where, payload)) continue;
      const target = def.trigger.count || 1;
      let entry = ledgerEntry(profile, def.id);
      if (!entry) {
        entry = { id: def.id, unlockedAt: null, progress: 0 };
        profile.achievements.push(entry);
      }
      if (entry.unlockedAt) continue;
      const sum = counterSum(profile, event);
      const next = Math.max(progressOf(entry, def).current, Math.min(target, sum));
      entry.progress = next;
      if (next >= target) {
        entry.unlockedAt = new Date().toISOString();
        newly.push(def);
        const reward = COIN_REWARDS[def.id] || 0;
        if (reward) appendCoinTx(profile, "earn", reward, "achievementUnlocked", def.id);
      }
    }
    save(profile);
    return { profile, newly };
  }

  function normalizeCoins(raw) {
    // Migrate mock int → ledger shape; balance is always derived
    if (raw && typeof raw === "object" && Array.isArray(raw.entries)) {
      return { checkpoint: raw.checkpoint || null, entries: raw.entries.slice() };
    }
    const n = Number(raw) || 0;
    if (n > 0) {
      return {
        checkpoint: { balance: n, upToTxId: null, signedAt: new Date().toISOString(), sig: "mock" },
        entries: [],
      };
    }
    return { checkpoint: null, entries: [] };
  }

  function coinBalance(coins) {
    const c = normalizeCoins(coins);
    let bal = (c.checkpoint && Number(c.checkpoint.balance)) || 0;
    (c.entries || []).forEach((e) => {
      const amt = Math.max(0, Number(e.amount) || 0);
      if (e.kind === "earn") bal += amt;
      else if (e.kind === "spend") bal -= amt;
    });
    return Math.max(0, bal);
  }

  function getCoins() {
    return coinBalance(load().coins);
  }

  function appendCoinTx(profile, kind, amount, reason, ref) {
    profile.coins = normalizeCoins(profile.coins);
    profile.coins.entries.push({
      id: ulid("coinTx"),
      kind,
      amount: Math.max(0, Number(amount) || 0),
      reason,
      ref: ref || undefined,
      at: new Date().toISOString(),
      sig: "mock-local",
    });
  }

  function spendCoins(n, packId) {
    const profile = load();
    const cost = Math.max(0, Number(n) || 0);
    if (coinBalance(profile.coins) < cost) return { ok: false, profile };
    appendCoinTx(profile, "spend", cost, "hubAssetPurchase", packId);
    profile.ownedPacks = profile.ownedPacks || [];
    if (packId && profile.ownedPacks.indexOf(packId) < 0) profile.ownedPacks.push(packId);
    save(profile);
    return { ok: true, profile };
  }

  function resetLocal(wipeSyncedFlag) {
    const old = load();
    try {
      localStorage.setItem(KEY + ".backup-" + Date.now(), JSON.stringify(old));
    } catch (_) {}
    const next = defaults();
    // keep theme preference courtesy
    next.prefs.theme = (old.prefs && old.prefs.theme) || "system";
    // r2 §1.7: coins NEVER reset — server ledger wins / local mock keeps ledger
    next.coins = normalizeCoins(old.coins);
    next.rewards = normalizeRewards(old.rewards); // server copy, like coins
    next.ownedPacks = (old.ownedPacks || []).slice();
    const ep = loadEditorPrefs();
    ep.achievementsSeen = [];
    saveEditorPrefs(ep);
    save(next);
    return { profile: next, wipeSynced: !!wipeSyncedFlag, backupKept: true, coinsKept: true };
  }

  function setTheme(theme) {
    const profile = load();
    profile.prefs = profile.prefs || {};
    profile.prefs.theme = theme;
    stamp(profile, "theme");
    save(profile);
    applyTheme(theme);
    if (theme === "dark") return recordEvent("themeChanged", 1, { theme: "dark" });
    return { profile, newly: [] };
  }

  function setName(name) {
    const profile = load();
    profile.prefs = profile.prefs || {};
    profile.prefs.name = String(name || "Maker").slice(0, 32);
    stamp(profile, "name");
    return save(profile);
  }

  function setAvatar(avatarId) {
    const profile = load();
    profile.prefs = profile.prefs || {};
    profile.prefs.avatarId = avatarId;
    stamp(profile, "avatarId");
    return save(profile);
  }

  function setBadge(badgeId) {
    const profile = load();
    profile.prefs = profile.prefs || {};
    profile.prefs.badgeId = badgeId || null;
    stamp(profile, "badgeId");
    return save(profile);
  }

  function setBorder(borderId) {
    const profile = load();
    profile.prefs = profile.prefs || {};
    profile.prefs.borderId = borderId || null;
    stamp(profile, "borderId");
    return save(profile);
  }

  function defByIdAny(id) {
    return defById(id) || METRIC_ACHIEVEMENTS.find((a) => a.id === id) || null;
  }

  function metricUnlockStatus(profile, achievementId) {
    const entries = (profile && profile.rewards && profile.rewards.entries) || [];
    let last = null;
    entries.forEach((e) => { if (e && e.achievementId === achievementId) last = e; });
    return last && last.action === "unlocked";
  }

  function coinReasonCount(profile, reason) {
    const entries = (profile && profile.coins && profile.coins.entries) || [];
    return entries.filter((e) => e && e.reason === reason && e.kind !== "spend").length;
  }

  function eventAchievementUnlocked(profile, achId) {
    const e = ledgerEntry(profile, achId);
    return !!(e && e.unlockedAt);
  }

  function isAchievementUnlocked(profile, achId) {
    const def = defByIdAny(achId);
    if (def && def.trigger && def.trigger.metric) return metricUnlockStatus(profile, achId);
    return eventAchievementUnlocked(profile, achId);
  }

  function isCosmeticUnlocked(profile, item) {
    if (!item || item.retired) return false;
    const by = item.unlockedBy;
    if (by === "always") return true;
    if (by && by.achievement) return isAchievementUnlocked(profile, by.achievement);
    if (by && by.coinReason) return coinReasonCount(profile, by.coinReason) > 0;
    return false;
  }

  function cosmeticByKey(key) {
    return COSMETICS.find((c) => c.key === key) || null;
  }

  /* Locked, revoked, retired or unknown: value is kept, editor shows none (r7 §1.12.6). */
  function shownCosmetic(profile, slot) {
    const key = slot === "badge" ? (profile.prefs || {}).badgeId : (profile.prefs || {}).borderId;
    if (!key) return { key: null, shown: null, notice: null };
    const item = cosmeticByKey(key);
    if (!item || item.slot !== slot) return { key, shown: null, notice: "cosmeticUnknown" };
    if (!isCosmeticUnlocked(profile, item)) return { key, shown: null, notice: "cosmeticNotUnlocked" };
    return { key, shown: key, notice: null, item };
  }

  function achievementsSeen() {
    return (loadEditorPrefs().achievementsSeen || []).slice();
  }

  function markAchievementsSeen(ids) {
    const ep = loadEditorPrefs();
    const set = new Set(ep.achievementsSeen || []);
    (ids || []).forEach((id) => { if (id) set.add(id); });
    ep.achievementsSeen = Array.from(set);
    return saveEditorPrefs(ep);
  }

  function markToastSeen(achId) {
    const ep = loadEditorPrefs();
    ep.seenToasts[achId] = new Date().toISOString();
    saveEditorPrefs(ep);
  }

  function toastSeen(achId) {
    return !!loadEditorPrefs().seenToasts[achId];
  }

  function setPreviewVolume(n) {
    const ep = loadEditorPrefs();
    ep.previewVolume = Math.max(0, Math.min(100, Number(n) || 0));
    return saveEditorPrefs(ep);
  }

  function categoryLabel(c) {
    return c === "play" ? "Play" : c === "sharing" ? "Sharing" : "Editor";
  }

  function listForUi(profile, unknownExtra) {
    profile = profile || load();
    const rows = [];
    const known = new Set();
    for (const def of ACHIEVEMENTS) {
      known.add(def.id);
      const entry = ledgerEntry(profile, def.id);
      const prog = progressOf(entry, def);
      const unlocked = !!prog.unlockedAt;
      rows.push({
        id: def.id,
        status: "active",
        category: def.category,
        categoryLabel: categoryLabel(def.category),
        hidden: !!def.hidden,
        unlocked,
        title: def.hidden && !unlocked ? "???" : def.title,
        description: def.hidden && !unlocked ? "Hidden, keep playing" : def.description,
        progress: prog,
        unlockedAt: prog.unlockedAt,
      });
    }
    // unknown ledger entries (newer engine)
    (profile.achievements || []).forEach((e) => {
      if (known.has(e.id)) return;
      const prog = progressOf(e, null);
      rows.push({
        id: e.id,
        status: "unknown",
        category: "other",
        categoryLabel: "Other",
        hidden: false,
        unlocked: !!e.unlockedAt,
        title: "From a newer version",
        description: "Kept safely. This build does not know this achievement yet.",
        progress: prog,
        unlockedAt: e.unlockedAt || null,
        greyed: true,
      });
    });
    if (unknownExtra) rows.push.apply(rows, unknownExtra);
    return rows;
  }

  global.ProfileStore = {
    KEY, LEGACY_KEY, PREFS_KEY, DEVICE, AVATARS, ACHIEVEMENTS, METRIC_ACHIEVEMENTS, COSMETICS,
    BTF_TEMPLATE, COIN_REWARDS,
    load, save, defaults, loadEditorPrefs, saveEditorPrefs,
    applyTheme, resolvedTheme, setTheme, setName, setAvatar, setBadge, setBorder,
    recordEvent, defById, defByIdAny, ledgerEntry, progressOf, counterSum,
    markToastSeen, toastSeen, setPreviewVolume,
    listForUi, categoryLabel, getCoins, coinBalance, normalizeCoins, spendCoins, resetLocal, appendCoinTx,
    emptyRewards, normalizeRewards, metricUnlockStatus, coinReasonCount,
    isAchievementUnlocked, isCosmeticUnlocked, cosmeticByKey, shownCosmetic,
    achievementsSeen, markAchievementsSeen,
  };
})(typeof window !== "undefined" ? window : globalThis);
