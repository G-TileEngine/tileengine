/* r70 social hub — ONE local adapter for follows, blocks, the in-app feed and the request board.
 *
 * LOCAL ONLY / OFFLINE-FIRST. Nothing here talks to a server. Seeded sample creators, listings,
 * games and requests live in localStorage under KEY. Record shapes and names follow
 * data/social-format.md ACCEPTED r1.1 (plus profile-format r10, sync-format r11):
 *   follow v1 (§2) · block v1 (§3) · feed-item v1 (§4.1–4.2) · hub-wish v1 (§5.1, status derived §5.3)
 *   creator card derived (§6.1) · prefs.social (§6) · server config defaults (§10.1) · notices (§10)
 * The UI must never show kind names ("hub-wish") or ids.
 *
 * TODO(server, social-format §4.5): replace the local mutations below with
 *   pull: GET /v1/social/feed|follows|wishes?since=<cursor>; push: POST /v1/social/ops {ops} (idempotent opId).
 * TODO(server, §5.6): wish actions are online-only on the real service (account age, strikes, moderation).
 * TODO(server, §6.1): creator cards, follower counts and Popular are derived server-side; search is server-indexed.
 */
(function (global) {
  "use strict";
  const KEY = "tileengine.social.v1";
  const SEEN_KEY = "tileengine.social.rowseen.v1"; // device-local "New" row marks (§15 K3)
  const DAY = 86400000, HOUR = 3600000;
  const ME = "acct_you";

  // §10.1 server config defaults (informative; the CEO can tune them)
  const CONFIG = {
    followsPerHour: 30, followsPerDay: 200, maxFollowing: 2000,
    wishOpenPerAccount: 3, wishPostsPerDay: 3, wishMaxPickups: 1, pickupsLivePerCreator: 5,
    wishMinAccountAgeDays: 7, wishExpiryDays: 30, wishReferencesMax: 1,
    referenceMaxBytes: 4 * 1024 * 1024, referenceMaxPx: 4096, referenceTypes: ["image/png", "image/webp"],
    moderationDelayMs: 2500, // local simulation of the light pre-check (§5.5): "In review" → open
  };
  const SOCIAL_DEFAULTS = { showFollowerCount: false, directWishes: "off", notifyNewFollower: false }; // §6
  const TERMINAL = ["accepted", "closed", "expired", "withdrawn", "declined"];
  const LOOKS = [["any", "Any"], ["crisp", "Crisp"], ["16bit", "16-bit"], ["cel", "Cel"], ["hd2d", "HD-2D"], ["gameBoy", "Game Boy"], ["pico8", "PICO-8"], ["vector", "Vector"]];

  let seq = 0;
  function ulid(prefix) {
    seq = (seq + 1) % 1296;
    return prefix + "_" + Date.now().toString(36).padStart(9, "0") + seq.toString(36).padStart(2, "0") + Math.random().toString(36).slice(2, 7);
  }
  const iso = (t) => new Date(t).toISOString();
  const now = () => Date.now();

  /* ---------- seed (sample data; replaced by server pulls later) ---------- */
  function seed() {
    const t = now();
    const accounts = {
      acct_you:     { accountId: "acct_you", handle: "you", displayName: null, createdAt: iso(t - 40 * DAY), avatarId: null, social: { ...SOCIAL_DEFAULTS } },
      acct_river:   { accountId: "acct_river", handle: "riverhale", displayName: "River Hale", avatarId: "fox", badge: "verifiedCreator", equippedBadge: "Asset of the Month", equippedBorder: "gold", createdAt: iso(t - 400 * DAY), social: { showFollowerCount: false, directWishes: "anyone", notifyNewFollower: false } },
      acct_studio:  { accountId: "acct_studio", handle: "tileengine", displayName: "TileEngine", avatarId: "studio", official: true, createdAt: iso(t - 900 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_quin:    { accountId: "acct_quin", handle: "quinvale", displayName: "Quin Vale", avatarId: "knight", badge: "partner", equippedBorder: "gold", createdAt: iso(t - 300 * DAY), social: { showFollowerCount: false, directWishes: "followers", notifyNewFollower: false } },
      acct_ash:     { accountId: "acct_ash", handle: "ashreed", displayName: "Ash Reed", avatarId: "archer", createdAt: iso(t - 120 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_north:   { accountId: "acct_north", handle: "studionorth", displayName: "Studio North", avatarId: "mage", badge: "verifiedCreator", createdAt: iso(t - 500 * DAY), social: { showFollowerCount: true, directWishes: "off", notifyNewFollower: false } },
      acct_rai:     { accountId: "acct_rai", handle: "raikynn", displayName: "RaiKynn", avatarId: "wolf", createdAt: iso(t - 365 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_codelab: { accountId: "acct_codelab", handle: "codelab", displayName: "Code lab", avatarId: "robot", badge: "verifiedCreator", createdAt: iso(t - 200 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_kenney:  { accountId: "acct_kenney", handle: "kenney", displayName: "Kenney", avatarId: "owl", createdAt: iso(t - 800 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_bee:     { accountId: "acct_bee", handle: "indiebee", displayName: "Indie Bee", avatarId: "cat", createdAt: iso(t - 150 * DAY), social: { ...SOCIAL_DEFAULTS } },
      acct_tide:    { accountId: "acct_tide", handle: "tideco", displayName: "Tide Co", avatarId: "slime", createdAt: iso(t - 150 * DAY), social: { ...SOCIAL_DEFAULTS } },
    };
    // Public, approved listings (sync-format §6 upload, use = listing). price null = free.
    const L = (id, owner, title, thumb, price, daysAgo, packId) => ({ hubAssetId: id, ownerAccountId: owner, title, thumb, price, approvedAt: iso(t - daysAgo * DAY), subjectState: "listed", packId: packId || null });
    const listings = [
      L("hub_oak", "acct_river", "Oak barricade", "oak", 25, 3),
      L("hub_well_river", "acct_river", "Village well", "well", 15, 20),
      L("hub_lantern", "acct_river", "Lantern", "lantern", 10, 40),
      L("hub_banner", "acct_you", "Village banner", "banner", 10, 12),
      L("hub_lamp", "acct_you", "Night lamp", "lantern", null, 30),
      L("hub_starter", "acct_studio", "Starter Pack", "pack", null, 2),
      L("hub_tiles_extra", "acct_studio", "Extra tiles", "pack", 30, 60, "pack_tiles_extra"),
      L("hub_quin_cart", "acct_quin", "Ruined cart", "cart", 20, 9),
      L("hub_quin_moss", "acct_quin", "Moss stones", "moss", 12, 25),
      L("hub_ash_slime", "acct_ash", "Crowned slime", "slime", 8, 5),
      L("hub_ash_well", "acct_ash", "Village well, Ashroad colours", "well", 12, 1),
      L("hub_ash_cart", "acct_ash", "Hay cart", "cart", null, 15),
      L("hub_moon", "acct_north", "Moonlit tile pack", "moss", 16, 45, "pack_comm_moon"),
      L("hub_ash_foot", "acct_rai", "Ashroad footfalls", "banner", 12, 50, "pack_comm_ash"),
      L("hub_code_sfx", "acct_codelab", "Procedural hit kit", "pack", 18, 70, "pack_code_sfx"),
      L("hub_code_tiles", "acct_codelab", "Code-paint tile recipes", "pack", 22, 70, "pack_code_tiles"),
      L("hub_code_beds", "acct_codelab", "Soft loop generator", "pack", 28, 70, "pack_code_beds"),
      L("hub_kenney_ui", "acct_kenney", "Kenney UI Audio", "pack", 20, 300, "pack_kenney_ui"),
      L("hub_kenney_imp", "acct_kenney", "Kenney Impacts", "pack", 15, 300, "pack_kenney_impact"),
    ];
    // made-game entries (profile-format §9.0), listed
    const G = (gameId, owner, title, thumb, daysAgo) => ({ gameId, ownerAccountId: owner, title, thumb, listedAt: iso(t - daysAgo * DAY) });
    const games = [
      G("project_yours", "acct_you", "Floor Tactics", "moss", 70),
      G("project_ash", "acct_rai", "Ashroad Skirmish", "cart", 88),
      G("project_moon", "acct_north", "Moonlit Duels", "lantern", 110),
      G("project_grid", "acct_bee", "Grid Knights", "oak", 160),
      G("project_tide", "acct_tide", "Tidebound", "slime", 190),
      G("project_moss", "acct_river", "Moss courtyard", "moss", 6),
      G("project_quin", "acct_quin", "Cart Run", "cart", 14),
    ];
    const follows = [];
    const F = (follower, creator, daysAgo) => follows.push({ kind: "follow", formatVersion: 1, followId: ulid("follow"), followerAccountId: follower, creatorAccountId: creator, at: iso(t - daysAgo * DAY), muted: false, mutedChangedAt: null, endedAt: null, endReason: null });
    // Synthetic follower accounts so counts and Popular have something to derive from.
    const crowd = (creator, n, recentShare) => { for (let i = 0; i < n; i++) F("acct_fan" + creator.slice(5) + i, creator, i < n * recentShare ? 2 + (i % 25) : 40 + i); };
    crowd("acct_river", 128, 0.3); crowd("acct_quin", 54, 0.2); crowd("acct_ash", 40, 0.5); crowd("acct_north", 61, 0.05);
    crowd("acct_studio", 90, 0.25); crowd("acct_rai", 22, 0.1); crowd("acct_codelab", 18, 0.1); crowd("acct_you", 12, 0.25);
    F(ME, "acct_quin", 20); // you already follow Quin Vale
    const W = (id, asker, title, look, budget, daysAgo, events, thumb) => ({
      kind: "hub-wish", formatVersion: 1, wishId: id, askerAccountId: asker, audience: { board: true },
      title, text: title, assetKind: "other", styleHint: look, budgetHint: budget ? { coins: budget } : undefined,
      references: thumb ? [{ hubAssetId: "ref_" + id }] : [], bounty: null, expiresAt: iso(t + (30 - daysAgo) * DAY),
      createdAt: iso(t - daysAgo * DAY),
      moderation: { severity: "low", routeReasons: [], reviewer: "bot", decision: "approved", reason: null, decidedAt: iso(t - daysAgo * DAY + HOUR) },
      events: events || [], _thumb: thumb || null,
    });
    const wishes = [
      W("wish_seed_slime", "acct_ash", "A slime with a little crown", "any", null, 0.2, [], "slime"),
      W("wish_seed_well", "acct_river", "A village well, top-down, in the Ashroad colours", "crisp", 40, 2, [], "well"),
      W("wish_seed_cart", "acct_north", "Ruined cart, side view", "16bit", 20, 1, [{ at: iso(t - 0.5 * DAY), by: "acct_quin", action: "pickedUp" }], "cart"),
      W("wish_seed_door", "acct_rai", "Castle door, four frames", "cel", 30, 6, [{ at: iso(t - 5 * DAY), by: "acct_ash", action: "pickedUp" }, { at: iso(t - 3 * DAY), by: "acct_ash", action: "delivered", hubAssetId: "hub_ash_cart" }], "banner"),
      W("wish_seed_torch", "acct_bee", "Wall torch, animated", "pico8", null, 25, [{ at: iso(t - 1 * DAY), by: "system", action: "expired" }], "lantern"),
    ];
    return { formatNote: "local sample data; social-format r1.1 shapes", seededAt: iso(t), actor: ME, accounts, listings, games, follows, blocks: [], feed: [], seenUpTo: {}, wishes, claims: [], uploads: {}, verifiedApplication: null };
  }

  /* ---------- persistence ---------- */
  let db = null;
  function load() {
    if (db) return db;
    try { const raw = localStorage.getItem(KEY); db = raw ? JSON.parse(raw) : null; } catch (_) { db = null; }
    if (!db || !db.accounts) { db = seed(); save(); }
    if (db.wishes.some((w) => w.moderation && w.moderation.decision == null)) setTimeout(scheduleModeration, 0); // resume local review after a reload
    return db;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (_) { /* quota: keep in memory */ } listeners.forEach((f) => { try { f(); } catch (_) {} }); }
  function reset() { db = seed(); save(); try { localStorage.removeItem(SEEN_KEY); } catch (_) {} return db; }
  const listeners = [];
  function onChange(f) { listeners.push(f); }

  /* ---------- who is acting (local simulation of a second signed-in account) ---------- */
  function actor() { return load().actor || ME; }
  function setActor(id) { load(); if (db.accounts[id]) { db.actor = id; save(); } return actor(); }

  /* ---------- your own profile bridges (profile-format r10) ---------- */
  function profile() { return global.ProfileStore ? ProfileStore.load() : { prefs: {} }; }
  function socialPrefs(accountId) {
    const id = accountId || actor();
    if (id === ME) {
      const p = profile();
      return { ...SOCIAL_DEFAULTS, ...((p.prefs && p.prefs.social) || {}) };
    }
    const a = load().accounts[id];
    return { ...SOCIAL_DEFAULTS, ...((a && a.social) || {}) };
  }
  // prefs.social is LWW per leaf, stamped prefStamps["social.<leaf>"] (§6)
  function setSocialPref(leaf, value, accountId) {
    if (!(leaf in SOCIAL_DEFAULTS)) return;
    const id = accountId || ME;
    if (id === ME && global.ProfileStore) {
      const p = ProfileStore.load();
      p.prefs = p.prefs || {};
      p.prefs.social = { ...SOCIAL_DEFAULTS, ...(p.prefs.social || {}), [leaf]: value };
      p.prefStamps = p.prefStamps || {};
      p.prefStamps["social." + leaf] = { at: iso(now()), deviceId: ProfileStore.DEVICE || "device_local" };
      ProfileStore.save(p);
      save();
      return;
    }
    const a = load().accounts[id]; if (!a) return;
    a.social = { ...SOCIAL_DEFAULTS, ...(a.social || {}), [leaf]: value }; save();
  }

  function account(id) { return load().accounts[id] || null; }
  function displayName(id) {
    if (id === "system") return "TileEngine";
    if (id === ME) { const p = profile(); return (p.prefs && p.prefs.name) || "Maker"; }
    const a = account(id); return a ? (a.displayName || a.handle) : "A creator";
  }
  function accountAgeDays(id) { const a = account(id || actor()); return a ? Math.floor((now() - Date.parse(a.createdAt)) / DAY) : 0; }
  function setAccountCreatedDaysAgo(id, days) { const a = account(id); if (a) { a.createdAt = iso(now() - days * DAY); save(); } }

  /* ---------- blocks (§3) ---------- */
  function liveBlock(a, b) { return load().blocks.find((x) => !x.liftedAt && x.blockerAccountId === a && x.blockedAccountId === b) || null; }
  function blockedEither(a, b) { return !!(liveBlock(a, b) || liveBlock(b, a)); }
  function isBlockedByMe(id) { return !!liveBlock(actor(), id); }
  function block(id) {
    const me = actor(); if (id === me || liveBlock(me, id)) return { ok: false };
    load().blocks.push({ kind: "block", formatVersion: 1, blockId: ulid("block"), blockerAccountId: me, blockedAccountId: id, at: iso(now()), liftedAt: null });
    // 1. ends follows both ways; lifting the block doesn't restore them
    db.follows.forEach((f) => { if (!f.endedAt && ((f.followerAccountId === me && f.creatorAccountId === id) || (f.followerAccountId === id && f.creatorAccountId === me))) { f.endedAt = iso(now()); f.endReason = "blocked"; } });
    // 3. a live pickup between them is released by system
    db.wishes.forEach((w) => {
      const pick = livePickups(w);
      if ((w.askerAccountId === me && pick.includes(id)) || (w.askerAccountId === id && pick.includes(me))) {
        const who = w.askerAccountId === me ? id : me;
        w.events.push({ at: iso(now()), by: "system", action: "released", note: "block:" + who });
      }
    });
    save(); return { ok: true };
  }
  function unblock(id) { const b = liveBlock(actor(), id); if (b) { b.liftedAt = iso(now()); save(); } return { ok: !!b }; }

  /* ---------- follows (§2) ---------- */
  function liveFollow(follower, creator) { return load().follows.find((f) => !f.endedAt && f.followerAccountId === follower && f.creatorAccountId === creator) || null; }
  function isFollowing(id) { return !!liveFollow(actor(), id); }
  function followerCount(id) { return load().follows.filter((f) => !f.endedAt && f.creatorAccountId === id).length; }
  function newFollows30d(id) { const since = now() - 30 * DAY; return load().follows.filter((f) => f.creatorAccountId === id && Date.parse(f.at) >= since && !f.endedAt).length; }
  function hasCreatorPage(id) { return listingsOf(id).length > 0 || gamesOf(id).length > 0; }
  function follow(id) {
    const me = actor();
    if (id === me) return { ok: false, notice: "followOwnAccount" };
    if (liveFollow(me, id)) return { ok: false, notice: "followDuplicate" };
    if (!account(id) || !hasCreatorPage(id) || blockedEither(me, id)) return { ok: false, notice: "followUnavailable" };
    const hourAgo = now() - HOUR;
    const recent = load().follows.filter((f) => f.followerAccountId === me && Date.parse(f.at) >= hourAgo);
    if (recent.length >= CONFIG.followsPerHour) {
      const retryAt = Math.min.apply(null, recent.map((f) => Date.parse(f.at))) + HOUR;
      return { ok: false, notice: "followRateLimited", retryAt: iso(retryAt) };
    }
    const rec = { kind: "follow", formatVersion: 1, followId: ulid("follow"), followerAccountId: me, creatorAccountId: id, at: iso(now()), muted: false, mutedChangedAt: null, endedAt: null, endReason: null };
    db.follows.push(rec);
    if (socialPrefs(id).notifyNewFollower) writeFeed(id, "newFollower", me, { accountId: me }, "follower:" + rec.followId);
    save(); return { ok: true };
  }
  function unfollow(id) { const f = liveFollow(actor(), id); if (!f) return { ok: false }; f.endedAt = iso(now()); f.endReason = "unfollowed"; save(); return { ok: true }; }

  /* ---------- listings, games, creator cards (§6.1, derived) ---------- */
  function listingsOf(id) { return load().listings.filter((l) => l.ownerAccountId === id && l.subjectState !== "removed"); }
  function gamesOf(id) { return load().games.filter((g) => g.ownerAccountId === id); }
  function listing(id) { return load().listings.find((l) => l.hubAssetId === id) || null; }
  function creatorForPack(packId) { const l = load().listings.find((x) => x.packId === packId); return l ? l.ownerAccountId : null; }
  function creatorForGame(gameId) { const g = load().games.find((x) => x.gameId === gameId); return g ? g.ownerAccountId : null; }
  function latestAt(id) {
    const ts = listingsOf(id).map((l) => Date.parse(l.approvedAt)).concat(gamesOf(id).map((g) => Date.parse(g.listedAt)));
    return ts.length ? Math.max.apply(null, ts) : 0;
  }
  function card(id) {
    const a = account(id); if (!a) return null;
    const viewer = actor();
    const own = id === viewer;
    const prefs = socialPrefs(id);
    let avatarId = a.avatarId, equippedBadge = a.equippedBadge || null, equippedBorder = a.equippedBorder || null;
    if (id === ME && global.ProfileStore) {
      const p = ProfileStore.load();
      avatarId = (p.prefs && p.prefs.avatarId) ? p.prefs.avatarId : null;
      const b = ProfileStore.shownCosmetic(p, "badge"); const br = ProfileStore.shownCosmetic(p, "border");
      equippedBadge = b.shown && b.item ? b.item.title : null; // server-checked unlock (§1.12.6)
      equippedBorder = br.shown || null;
    }
    const count = followerCount(id);
    return {
      accountId: id, handle: a.handle, displayName: displayName(id), avatarId, avatarIsProfile: id === ME,
      badge: a.badge || null, official: !!a.official, equippedBadge, equippedBorder,
      listingCount: listingsOf(id).length, gameCount: gamesOf(id).length, latestListingAt: latestAt(id),
      // §6: visitors get the count only if the creator opted in; the owner always gets it (private strip)
      followerCount: (prefs.showFollowerCount || own) ? count : undefined,
      followerCountPublic: !!prefs.showFollowerCount,
      acceptsDirectWishes: directAllowed(id, viewer),
      viewerFollows: !!liveFollow(viewer, id), viewerBlocked: !!liveBlock(viewer, id), own,
    };
  }
  function directAllowed(creator, asker) {
    if (creator === asker || blockedEither(creator, asker)) return false;
    const mode = socialPrefs(creator).directWishes;
    if (mode === "anyone") return true;
    if (mode === "followers") { const f = liveFollow(asker, creator); return !!f && now() - Date.parse(f.at) >= 7 * DAY; }
    return false;
  }
  // Sorts (§6.1 / EUX Q2). TODO(server): search is server-indexed and online-only; here it filters local samples.
  function creators(sort, query) {
    const viewer = actor();
    let ids = Object.keys(load().accounts).filter((id) => id !== viewer && hasCreatorPage(id) && !blockedEither(viewer, id));
    const q = (query || "").trim().toLowerCase();
    if (q) ids = ids.filter((id) => { const a = account(id); return (a.handle || "").toLowerCase().startsWith(q) || displayName(id).toLowerCase().split(/\s+/).some((w) => w.startsWith(q)) || displayName(id).toLowerCase().startsWith(q); });
    if (sort === "new") ids = ids.filter((id) => now() - latestAt(id) <= 7 * DAY).sort((a, b) => latestAt(b) - latestAt(a));
    else if (sort === "verified") ids = ids.filter((id) => { const a = account(id); return a.badge === "verifiedCreator" || a.badge === "partner"; }).sort((a, b) => newFollows30d(b) - newFollows30d(a));
    else if (sort === "following") ids = ids.filter((id) => !!liveFollow(viewer, id)).sort((a, b) => displayName(a).localeCompare(displayName(b)));
    else ids = ids.sort((a, b) => newFollows30d(b) - newFollows30d(a)); // popular
    return ids.map(card);
  }

  /* ---------- feed (§4) ---------- */
  function writeFeed(recipient, type, actorId, subject, dedupeKey) {
    const d = load();
    const ex = d.feed.find((f) => f.recipientAccountId === recipient && f.dedupeKey === dedupeKey);
    if (ex) { ex.rev += 1; return ex; }
    const item = { kind: "feed-item", formatVersion: 1, feedItemId: ulid("feed"), recipientAccountId: recipient, type, actorAccountId: actorId, subject, dedupeKey, rev: 1, at: iso(now()) };
    d.feed.push(item); return item;
  }
  function followersFor(creator) { return load().follows.filter((f) => !f.endedAt && !f.muted && f.creatorAccountId === creator && !blockedEither(f.followerAccountId, creator)).map((f) => f.followerAccountId); }
  function feed(recipient) {
    const id = recipient || actor();
    return load().feed.filter((f) => f.recipientAccountId === id && !f.removed).sort((a, b) => (a.feedItemId < b.feedItemId ? 1 : -1));
  }
  function unseenCount(recipient) { const id = recipient || actor(); const mark = load().seenUpTo[id] || ""; return feed(id).filter((f) => f.feedItemId > mark).length; }
  function markFeedSeen(recipient) {
    const id = recipient || actor(); const items = feed(id);
    const mark = load().seenUpTo[id] || "";
    const fresh = items.filter((f) => f.feedItemId > mark).map((f) => f.feedItemId);
    if (items.length) { db.seenUpTo[id] = items[0].feedItemId; save(); } // synced "seen up to" mark (§15 K3)
    return fresh;
  }
  function rowSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"); } catch (_) { return []; } }
  function markRowsSeen(ids) { const s = new Set(rowSeen()); (ids || []).forEach((i) => s.add(i)); try { localStorage.setItem(SEEN_KEY, JSON.stringify([...s].slice(-500))); } catch (_) {} }

  /* ---------- local simulation: a creator's upload is approved / a game is listed ---------- */
  function simulateUpload(creator, title, opts) {
    opts = opts || {};
    const l = { hubAssetId: ulid("hub"), ownerAccountId: creator, title: title || "New asset", thumb: opts.thumb || "oak", price: opts.price === undefined ? 10 : opts.price, approvedAt: iso(now()), subjectState: "listed", packId: null };
    load().listings.push(l);
    followersFor(creator).forEach((r) => writeFeed(r, "creatorUpload", creator, { hubAssetId: l.hubAssetId }, "upload:" + l.hubAssetId));
    save(); return l;
  }
  function simulateGame(creator, title) {
    const g = { gameId: ulid("project"), ownerAccountId: creator, title: title || "New game", thumb: "moss", listedAt: iso(now()) };
    load().games.push(g);
    followersFor(creator).forEach((r) => writeFeed(r, "creatorGame", creator, { gameId: g.gameId }, "game:" + g.gameId));
    save(); return g;
  }
  function simulateFollowMe(follower) {
    const prev = actor(); db.actor = follower; const r = follow(ME); db.actor = prev; save(); return r;
  }

  /* ---------- request board: hub-wish (§5) ---------- */
  function wish(id) { return load().wishes.find((w) => w.wishId === id) || null; }
  function livePickups(w) {
    const live = [];
    (w.events || []).forEach((e) => {
      if (e.action === "pickedUp" && !live.includes(e.by)) live.push(e.by);
      if (e.action === "released") { const who = (e.note && e.note.startsWith("block:")) ? e.note.slice(6) : (e.by === w.askerAccountId || e.by === "system" ? live[live.length - 1] : e.by); const i = live.indexOf(who); if (i >= 0) live.splice(i, 1); }
      if (e.action === "delivered") { const i = live.indexOf(e.by); if (i >= 0) live.splice(i, 1); }
    });
    return live;
  }
  function visibleDeliveries(w) {
    const out = [];
    (w.events || []).forEach((e) => {
      if (e.action === "delivered") out.push({ by: e.by, hubAssetId: e.hubAssetId, at: e.at });
      if (e.action === "deliveryWithdrawn") { const i = out.findIndex((d) => d.hubAssetId === e.hubAssetId); if (i >= 0) out.splice(i, 1); }
    });
    return out.filter((d) => { const l = listing(d.hubAssetId); return l && l.subjectState !== "removed"; });
  }
  // §5.3 precedence, first match wins. Derived, never stored.
  function status(w) {
    const m = w.moderation || {};
    if (m.decision == null) return "pending";
    if (m.decision === "rejected") return "removed";
    const has = (a) => (w.events || []).some((e) => e.action === a);
    for (const a of ["accepted", "withdrawn", "declined", "closed", "expired"]) if (has(a)) return a;
    if (visibleDeliveries(w).length) return "delivered";
    if (livePickups(w).length) return "pickedUp";
    return "open";
  }
  function chipOf(st) { // EUX's four board groups (§5.3)
    if (st === "open") return "open"; if (st === "pickedUp") return "pickedUp"; if (st === "delivered") return "delivered";
    if (st === "pending") return "pending"; return "closed";
  }
  function visibleTo(w, viewer) {
    if (w.askerAccountId === viewer) return true;
    if (status(w) === "pending") return false; // only the asker (and reviewers) see pending
    if (w.audience && w.audience.creatorAccountId) return w.audience.creatorAccountId === viewer;
    return !blockedEither(viewer, w.askerAccountId);
  }
  function wishes(filter) {
    const viewer = actor();
    let list = load().wishes.filter((w) => visibleTo(w, viewer));
    if (filter === "mine") list = list.filter((w) => w.askerAccountId === viewer || (w.events || []).some((e) => e.by === viewer && (e.action === "pickedUp" || e.action === "delivered")));
    else if (filter) list = list.filter((w) => chipOf(status(w)) === filter);
    return list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
  function openWishesOf(id) { return load().wishes.filter((w) => w.askerAccountId === id && !TERMINAL.includes(status(w)) && status(w) !== "removed").length; }
  function postsToday(id) { const d = new Date(); const start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); return load().wishes.filter((w) => w.askerAccountId === id && Date.parse(w.createdAt) >= start).length; }
  // §5.6 checks (server-side on the real service). Returns null or {notice, retryAt?}.
  function canPost(id) {
    id = id || actor();
    const age = accountAgeDays(id);
    if (age < CONFIG.wishMinAccountAgeDays) return { notice: "wishAccountTooNew", retryAt: iso(Date.parse(account(id).createdAt) + CONFIG.wishMinAccountAgeDays * DAY) };
    if (openWishesOf(id) >= CONFIG.wishOpenPerAccount) return { notice: "wishLimitReached" };
    if (postsToday(id) >= CONFIG.wishPostsPerDay) { const d = new Date(); return { notice: "wishRateLimited", retryAt: iso(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)) }; }
    return null;
  }
  const OFF_PLATFORM = /(@[a-z0-9_]{2,}|https?:\/\/|www\.|\b\S+@\S+\.\S+|\bpaypal\b|\bcash\b|gift ?card|\bdm me\b|\+?\d[\d\s-]{7,}\d)/i;
  function postWish(input) {
    const me = actor();
    const gate = canPost(me); if (gate) return { ok: false, ...gate };
    const text = String(input.what || "").trim().slice(0, 1000);
    if (!text) return { ok: false, notice: "wishEmpty" };
    if (OFF_PLATFORM.test(text)) return { ok: false, notice: "wishOffPlatform" }; // §5.5 reject
    if (input.audience && input.audience.creatorAccountId && !directAllowed(input.audience.creatorAccountId, me)) return { ok: false, notice: "wishDirectOff" };
    const look = LOOKS.some(([k]) => k === input.styleHint) ? input.styleHint : undefined;
    const coins = Math.round(Number(input.budget) || 0);
    const w = {
      kind: "hub-wish", formatVersion: 1, wishId: ulid("wish"), askerAccountId: me,
      audience: input.audience && input.audience.creatorAccountId ? { creatorAccountId: input.audience.creatorAccountId } : { board: true },
      title: text.split(/\n/)[0].slice(0, 80), text, assetKind: "other",
      references: [], bounty: null, expiresAt: null, createdAt: iso(now()),
      moderation: { severity: "low", routeReasons: [], reviewer: null, decision: null, reason: null, decidedAt: null },
      events: [],
    };
    if (look && look !== "any") w.styleHint = look;
    if (coins >= 1) w.budgetHint = { coins: Math.min(coins, 9999) }; // display only; no coins move (§5.1, S11)
    if (input.reference) { // TODO(server §5.4): an ordinary hub upload with use: "wishReference"
      const refId = ulid("hub");
      db.uploads[refId] = { hubAssetId: refId, use: "wishReference", ownerAccountId: me, dataUrl: input.reference.dataUrl, w: input.reference.w, h: input.reference.h, type: input.reference.type };
      w.references = [{ hubAssetId: refId }];
    }
    db.wishes.push(w); save();
    scheduleModeration();
    return { ok: true, wish: w };
  }
  let modTimer = null;
  function scheduleModeration() { clearTimeout(modTimer); modTimer = setTimeout(runModeration, CONFIG.moderationDelayMs); }
  // Local stand-in for the light pre-check + bot review (§5.5). Approved → open, expiresAt stamped.
  function runModeration() {
    let n = 0;
    load().wishes.forEach((w) => {
      if (w.moderation && w.moderation.decision == null) {
        w.moderation = { severity: "low", routeReasons: [], reviewer: "bot", decision: "approved", reason: null, decidedAt: iso(now()) };
        w.expiresAt = iso(now() + CONFIG.wishExpiryDays * DAY); n++;
        if (w.audience && w.audience.creatorAccountId) writeFeed(w.audience.creatorAccountId, "wishDirected", w.askerAccountId, { wishId: w.wishId }, "wish:" + w.wishId + ":directed");
      }
    });
    if (n) save();
    return n;
  }
  function canPickUp(w, id) {
    id = id || actor();
    if (!w) return { notice: "wishUnavailable" };
    if (w.askerAccountId === id) return { notice: "wishOwn" };
    if (blockedEither(id, w.askerAccountId)) return { notice: "wishUnavailable" };
    if (w.audience && w.audience.creatorAccountId && w.audience.creatorAccountId !== id) return { notice: "wishUnavailable" };
    if (status(w) !== "open") return { notice: "wishPickupFull" };
    if (accountAgeDays(id) < CONFIG.wishMinAccountAgeDays) return { notice: "wishAccountTooNew" };
    const mine = load().wishes.filter((x) => livePickups(x).includes(id)).length;
    if (mine >= CONFIG.pickupsLivePerCreator) return { notice: "wishLimitReached" };
    return null;
  }
  function pickUp(wishId) {
    const w = wish(wishId); const me = actor(); const gate = canPickUp(w, me); if (gate) return { ok: false, ...gate };
    w.events.push({ at: iso(now()), by: me, action: "pickedUp" });
    writeFeed(w.askerAccountId, "wishPickedUp", me, { wishId }, "wish:" + wishId + ":pickup:" + me);
    save(); return { ok: true };
  }
  function deliver(wishId, hubAssetId) {
    const w = wish(wishId); const me = actor(); const l = listing(hubAssetId);
    if (!w || !livePickups(w).includes(me)) return { ok: false, notice: "wishDeliveryNotOwn" };
    if (!l || l.ownerAccountId !== me) return { ok: false, notice: "wishDeliveryNotOwn" };
    w.events.push({ at: iso(now()), by: me, action: "delivered", hubAssetId });
    // The listing is already approved here, so the delivery is visible at once (§5.4); nothing is charged.
    writeFeed(w.askerAccountId, "wishDelivered", me, { wishId, hubAssetId }, "wish:" + wishId + ":delivery:" + hubAssetId);
    save(); return { ok: true };
  }
  function release(wishId) { // asker: "Return to open"
    const w = wish(wishId); const me = actor();
    if (!w || w.askerAccountId !== me || status(w) !== "pickedUp") return { ok: false };
    const pickers = livePickups(w);
    w.events.push({ at: iso(now()), by: me, action: "released" });
    pickers.forEach((p) => writeFeed(p, "wishEnded", me, { wishId }, "wish:" + wishId + ":released:" + w.events.length));
    save(); return { ok: true };
  }
  function close(wishId) { // asker: one Close button → withdrawn (no visible delivery) or closed (§5.3)
    const w = wish(wishId); const me = actor();
    if (!w || w.askerAccountId !== me) return { ok: false };
    const st = status(w); if (TERMINAL.includes(st) || st === "removed") return { ok: false };
    const pickers = livePickups(w).concat(visibleDeliveries(w).map((d) => d.by));
    w.events.push({ at: iso(now()), by: me, action: visibleDeliveries(w).length ? "closed" : "withdrawn" });
    [...new Set(pickers)].forEach((p) => writeFeed(p, "wishEnded", me, { wishId }, "wish:" + wishId + ":ended"));
    save(); return { ok: true };
  }
  /* ---------- reports reuse hub-claim v1 (§9, S15) ---------- */
  const REASONS = { spam: "Spam", stolenArt: "Stolen art", harassment: "Harassment", other: "Other" };
  function report(subject, reason, note) {
    const me = actor();
    if (!REASONS[reason]) return { ok: false };
    const key = JSON.stringify(subject);
    if (load().claims.some((c) => c.claimantAccountId === me && JSON.stringify(c.subject) === key && c.reason === reason)) return { ok: false, notice: "claimDuplicate" };
    db.claims.push({ kind: "hub-claim", formatVersion: 1, claimId: ulid("claim"), claimantAccountId: me, subject, reason, note: String(note || "").slice(0, 500), at: iso(now()), state: "open" });
    save(); return { ok: true };
  }
  function applyVerified() { load().verifiedApplication = { kind: "hub-request", type: "verifiedCreator", at: iso(now()), state: "open" }; save(); }

  function upload(id) { return load().uploads[id] || null; }

  global.SocialStore = {
    KEY, ME, CONFIG, LOOKS, REASONS, SOCIAL_DEFAULTS,
    load, reset, onChange, actor, setActor,
    account, displayName, accountAgeDays, setAccountCreatedDaysAgo,
    socialPrefs, setSocialPref,
    follow, unfollow, isFollowing, followerCount, newFollows30d,
    block, unblock, isBlockedByMe, blockedEither,
    card, creators, listingsOf, gamesOf, listing, creatorForPack, creatorForGame, directAllowed,
    feed, unseenCount, markFeedSeen, rowSeen, markRowsSeen,
    simulateUpload, simulateGame, simulateFollowMe,
    wish, wishes, status, chipOf, livePickups, visibleDeliveries, canPost, postWish, runModeration,
    canPickUp, pickUp, deliver, release, close, report, applyVerified, upload, openWishesOf,
  };
})(typeof window !== "undefined" ? window : globalThis);
