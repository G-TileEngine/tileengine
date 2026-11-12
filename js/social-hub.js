/* r70 social hub UI: hub rail, Creators, creator page, Follow, bell + inbox, Requests board / post / detail,
 * report + block sheets, Social settings. All data goes through window.SocialStore (js/social-store.js).
 * LOCAL ONLY. Plan: ux/social-hub-plan.md (ACCEPTED, S2). Never shows kind names or ids. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = () => window.SocialStore;

  /* ---------- art ---------- */
  const BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"/><path d="M9 17a3 3 0 0 0 6 0"/></svg>';
  const IC = {
    "hub-shop": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M8 8V7a4 4 0 0 1 8 0v1"/></svg>',
    "hub-library": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h0M12 9h4"/></svg>',
    creators: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.2-3 3.5-4.5 7-4.5S17.8 16 19 19"/></svg>',
    requests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 4h10v16H7z"/><path d="M10 8h4M10 12h4M10 16h2"/></svg>',
  };
  const CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5 5 9.5 10 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const STAR = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.2 7.4 4.4 10.8 4.8 8.2 7.1 8.9 10.5 6 8.8 3.1 10.5 3.8 7.1 1.2 4.8 4.6 4.4Z" fill="currentColor"/></svg>';
  const tile = (bg, body) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/>${body}</svg>`;
  const THUMB = {
    oak: tile("#3d5a32", '<rect x="20" y="28" width="24" height="28" fill="#6e4a35"/><rect x="10" y="10" width="44" height="28" fill="#3d8a4a"/><rect x="16" y="6" width="32" height="16" fill="#5aaa5a"/>'),
    moss: tile("#2a4030", '<rect x="4" y="36" width="56" height="20" fill="#3d5a32"/><rect x="10" y="20" width="18" height="24" fill="#8a7a6a"/><rect x="36" y="16" width="16" height="28" fill="#6e4a35"/><rect x="8" y="44" width="48" height="8" fill="#5aaa5a"/>'),
    well: tile("#c8d4a8", '<rect x="8" y="40" width="48" height="12" fill="#8a9a5a"/><rect x="18" y="22" width="28" height="26" fill="#8a7a6a"/><rect x="22" y="26" width="20" height="18" fill="#2a3040"/><rect x="14" y="18" width="36" height="8" fill="#c0a090"/><rect x="16" y="10" width="6" height="12" fill="#6e4a35"/><rect x="42" y="10" width="6" height="12" fill="#6e4a35"/><rect x="16" y="8" width="32" height="6" fill="#8a6a45"/>'),
    slime: tile("#d8f0d0", '<rect x="14" y="28" width="36" height="24" fill="#3a8a3a"/><rect x="18" y="20" width="28" height="16" fill="#5cba5c"/><rect x="22" y="30" width="6" height="6" fill="#1e1024"/><rect x="36" y="30" width="6" height="6" fill="#1e1024"/><rect x="26" y="8" width="12" height="8" fill="#d0a040"/>'),
    cart: tile("#c8b090", '<rect x="8" y="28" width="48" height="18" fill="#6e4a35"/><rect x="6" y="24" width="52" height="8" fill="#8a6a45"/><rect x="12" y="42" width="12" height="12" fill="#3a2a20"/><rect x="40" y="42" width="12" height="12" fill="#3a2a20"/>'),
    lantern: tile("#1c2330", '<rect x="26" y="8" width="12" height="8" fill="#6a6a74"/><rect x="20" y="16" width="24" height="28" fill="#f5c26b"/><rect x="24" y="20" width="16" height="20" fill="#fff3c0"/><rect x="28" y="44" width="8" height="12" fill="#8a8fa0"/>'),
    pack: tile("#e8edff", '<rect x="10" y="14" width="44" height="36" fill="#2f5bff"/><rect x="16" y="20" width="32" height="24" fill="#6b8cff"/><rect x="22" y="26" width="8" height="14" fill="#ffffff"/><rect x="30" y="26" width="12" height="5" fill="#ffffff"/>'),
    banner: tile("#3a2140", '<rect x="28" y="6" width="8" height="52" fill="#6e4a35"/><rect x="16" y="10" width="32" height="28" fill="#8a2e6a"/><rect x="20" y="14" width="24" height="20" fill="#c05090"/>'),
  };
  const STUDIO_AVATAR = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="32" height="32" fill="#2f5bff"/><rect x="6" y="6" width="20" height="20" fill="#1a3fd4"/><rect x="8" y="8" width="16" height="16" fill="#6b8cff"/><rect x="11" y="11" width="4" height="10" fill="#ffffff"/><rect x="15" y="11" width="6" height="3" fill="#ffffff"/><rect x="15" y="18" width="6" height="3" fill="#ffffff"/></svg>';
  function avatarArt(c) {
    const art = (window.TileEngineQoL && TileEngineQoL.AVATAR_ART) || {};
    if (!c.avatarId) return null;
    if (c.avatarId === "studio") return STUDIO_AVATAR;
    return art[c.avatarId] || art["avatar_" + c.avatarId] || null;
  }
  function borderClass(b) {
    if (!b) return "";
    if (b === "gold") return "b-gold";
    if (b === "border_seller_100") return "b-seller";
    if (b === "border_published_10") return "b-published";
    if (b === "border_achievements_10") return "b-achievements";
    return "";
  }
  function avatar(c, size) {
    const art = avatarArt(c);
    return `<span class="sh-ava ${size || ""} ${borderClass(c.equippedBorder)}" aria-hidden="true">${art || esc((c.displayName || "?").slice(0, 1).toUpperCase())}</span>`;
  }
  function marks(c, withBadge) {
    const out = [];
    if (c.official) out.push(`<span class="sh-mark official">${CHECK} Made by TileEngine</span>`);
    else if (c.badge === "partner") out.push(`<span class="sh-mark partner">${CHECK} Partner</span>`);
    else if (c.badge === "verifiedCreator") out.push(`<span class="sh-mark verified">${CHECK} Verified creator</span>`);
    if (withBadge && c.equippedBadge) out.push(`<span class="sh-mark">${STAR} ${esc(c.equippedBadge)}</span>`);
    return out.length ? `<span class="sh-marks">${out.join("")}</span>` : "";
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  function countsLine(c) {
    const bits = [];
    if (c.listingCount) bits.push(plural(c.listingCount, "asset", "assets"));
    if (c.gameCount) bits.push(plural(c.gameCount, "game", "games"));
    return bits.join(" · ") || "No public items yet";
  }
  function ago(isoStr) {
    const d = Date.now() - Date.parse(isoStr);
    if (d < 60000) return "Just now";
    if (d < 3600000) return Math.floor(d / 60000) + " min ago";
    if (d < 86400000) { const h = Math.floor(d / 3600000); return h + (h === 1 ? " hour ago" : " hours ago"); }
    if (d < 2 * 86400000) return "Yesterday";
    return Math.floor(d / 86400000) + " days ago";
  }
  function shortDate(isoStr) { return new Date(isoStr).toLocaleDateString(undefined, { day: "numeric", month: "short" }); }
  function toast(m) { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3200); }
  const lookLabel = (k) => { const f = S().LOOKS.find(([id]) => id === (k || "any")); return f ? f[1] : "Any"; };

  /* ---------- navigation ---------- */
  const st = { stack: [], creatorId: null, creatorTab: "assets", sort: "popular", query: "", reqFilter: "open", reqQuery: "", wishId: null, inboxFresh: null, post: null, directTo: null };
  function current() { const a = $(".screen.active"); return a ? a.id.replace(/^screen-/, "") : "home"; }
  function go(id, opts) {
    const from = current();
    if (!(opts && opts.noPush) && from !== id) { st.stack.push(from); if (st.stack.length > 30) st.stack.shift(); }
    closeSheet();
    if (window.__show) window.__show(id);
  }
  function back(fallback) {
    closeSheet();
    let to = st.stack.pop();
    while (to && to === current()) to = st.stack.pop();
    if (window.__show) window.__show(to || fallback || "home");
  }
  const HUB_LIST = ["hub-shop", "hub-library", "creators", "requests"];
  function railHtml(cur) {
    const items = [["hub-shop", "Shop"], ["hub-library", "Games"], ["creators", "Creators"], ["requests", "Requests"]];
    return items.map(([id, lab]) => `<button type="button" data-sh-rail="${id}" ${id === cur ? 'aria-current="page"' : ""} aria-label="${lab}">${IC[id]}<span>${lab}</span></button>`).join("");
  }
  function bellHtml() { return `<button type="button" class="sh-bell" data-sh-bell aria-label="Notifications">${BELL}<span class="nbadge" hidden aria-hidden="true">0</span></button>`; }

  function paintBells() {
    if (!S()) return;
    const n = S().unseenCount();
    $$("[data-sh-bell]").forEach((b) => {
      const badge = b.querySelector(".nbadge");
      if (badge) { badge.hidden = !n; badge.textContent = String(n); }
      b.setAttribute("aria-label", n ? `Notifications, ${n} new` : "Notifications");
    });
  }

  /* ---------- sheets (≤ 40% height; scrim; inside the active screen) ---------- */
  function openSheet(html, label) {
    closeSheet();
    const host = $(".screen.active"); if (!host) return null;
    const scrim = document.createElement("div"); scrim.className = "sh-scrim"; scrim.setAttribute("data-sh-close", "");
    const sh = document.createElement("div"); sh.className = "sh-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-label", label || "Sheet");
    sh.innerHTML = `<span class="handle" aria-hidden="true"></span>${html}`;
    host.appendChild(scrim); host.appendChild(sh);
    const f = sh.querySelector("button, input"); if (f) setTimeout(() => f.focus({ preventScroll: true }), 30);
    return sh;
  }
  function closeSheet() { $$(".sh-sheet, .sh-scrim").forEach((n) => n.remove()); }

  /* ---------- Creators browse ---------- */
  const SORTS = [["new", "New", "New · listed or published in the last 7 days."], ["popular", "Popular", "Popular · most new followers in the last 30 days."], ["verified", "Verified", "Verified · Verified creators and Partners."], ["following", "Following", "Following · creators you follow."]];
  function followBtn(c, wide) {
    if (c.own) return "";
    if (c.viewerBlocked) return "";
    return c.viewerFollows
      ? `<button type="button" class="btn btn-ghost sh-follow ${wide ? "wide" : ""}" data-sh-unfollow="${esc(c.accountId)}" aria-label="Following ${esc(c.displayName)}. Tap to unfollow">Following</button>`
      : `<button type="button" class="btn btn-primary sh-follow ${wide ? "wide" : ""}" data-sh-follow="${esc(c.accountId)}" aria-label="Follow ${esc(c.displayName)}">Follow</button>`;
  }
  function creatorRow(c) {
    return `<div class="sh-crow"><button type="button" class="sh-crow-open" data-sh-creator="${esc(c.accountId)}" aria-label="Open ${esc(c.displayName)}">${avatar(c)}<span style="min-width:0"><strong>${esc(c.displayName)}</strong>${marks(c, true)}<span class="sh-meta">${esc(countsLine(c))}</span></span></button>${followBtn(c)}</div>`;
  }
  function renderCreators(keepFocus) {
    const body = $("#sh-creators-body"); if (!body) return;
    const sort = SORTS.find((s) => s[0] === st.sort) || SORTS[1];
    const list = S().creators(st.sort, st.query);
    let rows;
    if (!list.length && st.query) rows = `<div class="sh-empty"><p>No creators match that search.</p><button type="button" class="btn btn-ghost" data-sh-clear-search>Clear search</button></div>`;
    else if (!list.length && st.sort === "following") rows = `<div class="sh-empty"><p>You're not following anyone yet. Follow a creator to see them here and to hear when they upload.</p><button type="button" class="btn btn-ghost" data-sh-sort="popular">See popular creators</button></div>`;
    else if (!list.length) rows = `<div class="sh-empty"><p>Nobody here yet.</p></div>`;
    else rows = `<div class="sh-list">${list.map(creatorRow).join("")}</div>`;
    const search = $("#sh-creator-search");
    if (!search) {
      body.innerHTML = `<label class="sr-only" for="sh-creator-search">Search creators</label><input id="sh-creator-search" class="sh-search" type="search" placeholder="Search creators" autocomplete="off" />
        <div class="sh-chips" role="group" aria-label="Sort creators">${SORTS.map(([id, lab]) => `<button type="button" class="toggle" data-sh-sort="${id}" aria-pressed="${id === st.sort}">${lab}</button>`).join("")}</div>
        <p class="sh-note" id="sh-sort-note"></p><div id="sh-creators-list"></div>`;
      $("#sh-creator-search").addEventListener("input", (e) => { st.query = e.target.value; renderCreators(true); });
    }
    $$("[data-sh-sort]", body).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-sh-sort") === st.sort)));
    $("#sh-sort-note").textContent = sort[2];
    $("#sh-creators-list").innerHTML = rows;
    if (!keepFocus && $("#sh-creator-search").value !== st.query) $("#sh-creator-search").value = st.query;
  }

  /* ---------- Creator page ---------- */
  function openCreator(id, tab) { st.creatorId = id; st.creatorTab = tab || "assets"; go("creator"); }
  function tileHtml(l, own) {
    const price = l.price ? `${l.price} coins` : "Free";
    return `<div class="sh-tile"><div class="th">${THUMB[l.thumb] || THUMB.pack}</div><strong>${esc(l.title)}</strong><span>${esc(price)}${own ? " · yours" : ""}${l.subjectState === "disputed" ? " · Disputed" : ""}</span></div>`;
  }
  function renderCreator() {
    const body = $("#sh-creator-body"); if (!body) return;
    const id = st.creatorId || S().ME;
    const c = S().card(id);
    if (!c) { body.innerHTML = `<div class="sh-empty"><p>This creator isn't available.</p></div>`; return; }
    $("#sh-creator-title").textContent = c.displayName;
    $("#sh-creator-eyebrow").textContent = c.own ? "Your public page" : "Creator";
    const metaBits = [countsLine(c)];
    if (c.followerCountPublic && c.followerCount != null) metaBits.push(plural(c.followerCount, "follower", "followers"));
    let h = `<div class="sh-hero">${avatar(c, "lg")}<div style="min-width:0;flex:1"><h2>${esc(c.displayName)}</h2><p class="sh-meta">${esc(metaBits.join(" · "))}</p>${marks(c, true)}</div></div>`;
    if (c.viewerBlocked) {
      h += `<div class="sh-notice"><b>You blocked this creator.</b><p>You won't see their listings or requests, and they can't pick up yours.</p></div>
        <div class="sh-stack"><button type="button" class="btn btn-ghost" data-sh-unblock="${esc(id)}">Unblock</button></div>`;
      body.innerHTML = h; return;
    }
    if (c.own) {
      const p = window.ProfileStore ? ProfileStore.load() : {};
      const sales = (window.TileEngineQoL && TileEngineQoL.readRewardCounters) ? TileEngineQoL.readRewardCounters(p).assetSales : 0;
      h += `<p class="sh-note">This is your public page. Visitors do not see your sales or coins${c.followerCountPublic ? "" : ", or your follower count"}.</p>`;
      if (c.followerCountPublic) {
        h += `<div class="sh-private"><b>Your follower count is public · ${esc(plural(c.followerCount, "follower", "followers"))}</b><p>Everyone can see this number on your page.</p><button type="button" class="btn btn-ghost" data-sh-social>Social settings</button></div>`;
      } else {
        h += `<div class="sh-private" id="sh-own-followers"><b>Only you can see this · ${esc(plural(c.followerCount, "follower", "followers"))}</b><p>Visitors don't see this number unless you turn it on.</p><button type="button" class="btn btn-ghost" data-sh-social>Show follower count</button></div>`;
      }
      h += `<div class="sh-private" id="sh-own-sales"><b>Only you can see this · Sold ${esc(sales)}</b><p>Paid sales across your listings. Visitors see the badge only.</p></div>`;
      const app = S().load().verifiedApplication;
      h += `<div class="sh-stack"><button type="button" class="btn btn-ghost" data-sh-edit-profile>Edit Studio profile</button>`;
      if (!c.badge) h += app ? `<p class="sh-note" style="margin:0;text-align:center">Verified creator application in review.</p>` : `<button type="button" class="btn btn-ghost" data-sh-apply-verified>Apply for Verified creator</button>`;
      h += `</div>`;
    } else {
      h += followBtn(c, true);
      if (c.acceptsDirectWishes) h += `<button type="button" class="btn btn-ghost" style="width:100%;margin:6px 0 4px" data-sh-ask="${esc(id)}">Send ${esc(c.displayName)} a request</button>`;
    }
    const tab = st.creatorTab;
    h += `<div class="sh-tabs" role="group" aria-label="Show"><button type="button" class="toggle" data-sh-ctab="assets" aria-pressed="${tab === "assets"}">Assets</button><button type="button" class="toggle" data-sh-ctab="games" aria-pressed="${tab === "games"}">Games</button></div>`;
    if (tab === "assets") {
      const ls = S().listingsOf(id);
      h += ls.length ? `<div class="sh-grid">${ls.map((l) => tileHtml(l, c.own)).join("")}</div>`
        : `<div class="sh-empty"><p>No public assets yet.</p>${c.own ? '<button type="button" class="btn btn-ghost" data-sh-rail="hub-shop">Open the shop</button>' : ""}</div>`;
    } else {
      const gs = S().gamesOf(id);
      h += gs.length ? `<div class="sh-grid">${gs.map((g) => `<div class="sh-tile"><div class="th">${THUMB[g.thumb] || THUMB.moss}</div><strong>${esc(g.title)}</strong><span>Published ${esc(shortDate(g.listedAt))}</span></div>`).join("")}</div>`
        : `<div class="sh-empty"><p>No published games yet.</p>${c.own ? '<button type="button" class="btn btn-ghost" data-sh-rail="hub-library">Made games</button>' : ""}</div>`;
    }
    if (!c.own) h += `<div class="sh-quiet"><button type="button" class="btn" data-sh-report-creator="${esc(id)}">Report</button><button type="button" class="btn" data-sh-block="${esc(id)}">Block</button></div>`;
    body.innerHTML = h;
  }

  /* ---------- Follow / unfollow / block ---------- */
  const NOTICE = {
    followRateLimited: "You've followed a lot of creators this hour. Try again a bit later.",
    followUnavailable: "You can't follow this creator right now.",
    followOwnAccount: "That's you.",
    wishAccountTooNew: "New accounts can do this once they're 7 days old.",
    wishLimitReached: "You've reached the limit for now.",
    wishRateLimited: "You've posted 3 requests today. You can post again tomorrow.",
    wishOffPlatform: "Please keep it in the hub: no links, contact details or outside payment.",
    wishOwn: "You can't pick up your own request.",
    wishPickupFull: "Someone has already picked this up.",
    wishUnavailable: "This request isn't available.",
    wishDeliveryNotOwn: "Pick one of your own listings.",
    wishDirectOff: "This creator isn't taking direct requests from you.",
    claimDuplicate: "You've already reported this. Thanks.",
  };
  function doFollow(id, btn) {
    if (btn) btn.disabled = true; // busy: prevents a double fire
    const r = S().follow(id);
    if (!r.ok && r.notice !== "followDuplicate") toast(NOTICE[r.notice] || "Couldn't follow right now.");
    rerender();
  }
  function askUnfollow(id) {
    const name = S().displayName(id);
    openSheet(`<div class="sh-sheet-head"><h2>Unfollow ${esc(name)}?</h2><p>You'll stop hearing when they upload something new. Older notifications stay.</p></div>
      <div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>Keep following</button><button type="button" class="btn btn-primary" data-sh-confirm-unfollow="${esc(id)}">Unfollow</button></div>`, "Unfollow");
  }
  function askBlock(id) {
    const name = S().displayName(id);
    openSheet(`<div class="sh-sheet-head"><h2>Block ${esc(name)}?</h2><p>You'll unfollow each other. You won't see their page, listings or requests, and they can't pick up yours. They aren't told.</p></div>
      <div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>Cancel</button><button type="button" class="btn btn-danger" data-sh-confirm-block="${esc(id)}">Block</button></div>`, "Block");
  }
  let reportCtx = null;
  function askReport(subject, label) {
    reportCtx = { subject, reason: null };
    openSheet(`<div class="sh-sheet-head"><h2>Report ${esc(label)}</h2><p>Pick a reason. A moderator checks every report.</p></div>
      <div class="sh-sheet-body"><div class="sh-reasons" role="group" aria-label="Reason">${Object.entries(S().REASONS).map(([k, v]) => `<button type="button" class="toggle" data-sh-reason="${k}" aria-pressed="false">${v}</button>`).join("")}</div>
      <label class="sr-only" for="sh-report-note">Note (optional)</label><input id="sh-report-note" class="sh-input" type="text" maxlength="500" placeholder="Add a note (optional)" /></div>
      <div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>Cancel</button><button type="button" class="btn btn-primary" data-sh-submit-report disabled>Submit report</button></div>`, "Report");
  }

  /* ---------- Social settings (40% sheet) ---------- */
  function openSocialSettings() {
    const p = S().socialPrefs(S().ME);
    const onOff = (v) => (v ? "On" : "Off");
    openSheet(`<div class="sh-sheet-head"><h2>Social</h2><p>Choose who can see your follower count, and who can send you a request.</p></div>
      <div class="sh-sheet-body">
        <div class="sh-set"><div class="tx"><b>Show follower count</b><small id="sh-sc-sub">${p.showFollowerCount ? "On. Everyone can see the number." : "Off. Only you can see the number."}</small></div><button type="button" class="toggle" data-sh-pref="showFollowerCount" aria-pressed="${p.showFollowerCount}" aria-label="Show follower count">${onOff(p.showFollowerCount)}</button></div>
        <b style="display:block;margin-top:6px">Who can send me requests directly</b>
        <div class="sh-seg" role="group" aria-label="Who can send me requests directly">${[["off", "Off"], ["followers", "Followers"], ["anyone", "Anyone"]].map(([k, v]) => `<button type="button" class="toggle" data-sh-direct="${k}" aria-pressed="${p.directWishes === k}">${v}</button>`).join("")}</div>
        <div class="sh-set"><div class="tx"><b>Notify me about new followers</b></div><button type="button" class="toggle" data-sh-pref="notifyNewFollower" aria-pressed="${p.notifyNewFollower}" aria-label="Notify me about new followers">${onOff(p.notifyNewFollower)}</button></div>
      </div>`, "Social settings");
  }
  function socialSummary() {
    const p = S().socialPrefs(S().ME);
    const req = { off: "Direct requests off", followers: "Direct requests from followers", anyone: "Direct requests from anyone" }[p.directWishes] || "Direct requests off";
    return `${p.showFollowerCount ? "Follower count shown" : "Follower count hidden"} · ${req}`;
  }

  /* ---------- Inbox ---------- */
  function feedText(f) {
    const a = esc(S().displayName(f.actorAccountId));
    const sub = f.subject || {};
    const l = sub.hubAssetId ? S().listing(sub.hubAssetId) : null;
    const g = sub.gameId ? S().load().games.find((x) => x.gameId === sub.gameId) : null;
    const w = sub.wishId ? S().wish(sub.wishId) : null;
    const wt = w ? esc(w.title) : "a request";
    switch (f.type) {
      case "creatorUpload": return `${a} listed ${esc(l ? l.title : "a new asset")}`;
      case "creatorPackRev": return `${a} updated ${esc(l ? l.title : "a pack")}`;
      case "creatorGame": return `${a} published ${esc(g ? g.title : "a game")}`;
      case "wishPickedUp": return `${a} picked up your request: ${wt}`;
      case "wishDelivered": return `${a} delivered your request: ${wt}`;
      case "wishAccepted": return `${a} accepted your delivery: ${wt}`;
      case "wishDirected": return `${a} sent you a request: ${wt}`;
      case "wishEnded": return w && S().status(w) === "open" ? `${a} returned a request to open: ${wt}` : `A request you picked up has ended: ${wt}`;
      case "newFollower": return `${a} followed you`;
      default: return "Something new";
    }
  }
  function renderInbox() {
    const body = $("#sh-inbox-body"); if (!body) return;
    if (!st.inboxFresh) st.inboxFresh = new Set(S().markFeedSeen()); // clears the bell on view
    const items = S().feed();
    paintBells();
    if (!items.length) {
      body.innerHTML = `<div class="sh-empty"><p>Nothing yet. Follow a creator to hear when they upload something new.</p><button type="button" class="btn btn-primary" data-sh-rail="creators">Find creators</button></div>`;
      return;
    }
    const seenRows = new Set(S().rowSeen());
    body.innerHTML = `<div class="sh-list">${items.map((f) => {
      const c = S().card(f.actorAccountId) || { displayName: "TileEngine", avatarId: "studio" };
      const isNew = st.inboxFresh.has(f.feedItemId) || !seenRows.has(f.feedItemId);
      return `<button type="button" class="sh-nrow" data-sh-feed="${esc(f.feedItemId)}">${avatar(c)}<span class="tx"><span>${feedText(f)}</span><small>${esc(ago(f.at))}</small></span>${isNew ? '<span class="sh-new">New</span>' : ""}</button>`;
    }).join("")}</div>`;
    S().markRowsSeen(items.map((f) => f.feedItemId)); // device-local row marks
  }
  function openFeedItem(id) {
    const f = S().feed().find((x) => x.feedItemId === id); if (!f) return;
    const sub = f.subject || {};
    if (sub.wishId) { st.wishId = sub.wishId; go("request-detail"); return; }
    if (sub.gameId) { openCreator(f.actorAccountId, "games"); return; }
    openCreator(f.actorAccountId, "assets");
  }

  /* ---------- Requests board ---------- */
  const FILTERS = [["open", "Open"], ["pickedUp", "Picked up"], ["delivered", "Delivered"], ["closed", "Closed"], ["mine", "Mine"]];
  const STATUS_LABEL = { pending: "In review", open: "Open", pickedUp: "Picked up", delivered: "Delivered", accepted: "Closed", closed: "Closed", expired: "Closed", withdrawn: "Closed", declined: "Closed", removed: "Closed" };
  const REASON_LINE = { accepted: "Accepted", closed: "Closed", expired: "Expired", withdrawn: "Cancelled", declined: "Declined", removed: "Removed" };
  function pill(w) { const s = S().status(w); const chip = S().chipOf(s); return `<span class="sh-pill ${chip}">${esc(STATUS_LABEL[s] || "Open")}</span>`; }
  function wishThumb(w) {
    const ref = w.references && w.references[0] && S().upload(w.references[0].hubAssetId);
    if (ref && ref.dataUrl) return `<img src="${ref.dataUrl}" alt="" />`;
    if (w._thumb && THUMB[w._thumb]) return THUMB[w._thumb];
    return esc((w.title || "?").slice(0, 1).toUpperCase());
  }
  function gateMessage(g) {
    if (!g) return "";
    if (g.notice === "wishAccountTooNew") return `<div class="sh-notice" id="sh-gate"><b>Posting opens when your account is 7 days old</b><p>That's on ${esc(shortDate(g.retryAt))}. It keeps the board friendly. You can still browse and follow.</p></div>`;
    if (g.notice === "wishLimitReached") return `<div class="sh-notice" id="sh-gate"><b>You have 3 open requests</b><p>Close one to post another. The limit keeps the board fair for everyone.</p></div>`;
    if (g.notice === "wishRateLimited") return `<div class="sh-notice" id="sh-gate"><b>You've posted 3 requests today</b><p>You can post again tomorrow.</p></div>`;
    return "";
  }
  function renderRequests(keepFocus) {
    const body = $("#sh-requests-body"); if (!body) return;
    const me = S().actor();
    const gate = S().canPost(me);
    if (!$("#sh-req-list")) {
      body.innerHTML = `<div id="sh-post-slot"></div>
        <div class="sh-chips" role="group" aria-label="Filter requests">${FILTERS.map(([id, lab]) => `<button type="button" class="toggle" data-sh-filter="${id}" aria-pressed="${id === st.reqFilter}">${lab}</button>`).join("")}</div>
        <label class="sr-only" for="sh-req-search">Search requests</label><input id="sh-req-search" class="sh-search" type="search" placeholder="Search requests" autocomplete="off" />
        <p class="sh-note">If the shop hasn't got it, ask here. A budget is a hint, not a payment.</p><div id="sh-req-list"></div>`;
      $("#sh-req-search").addEventListener("input", (e) => { st.reqQuery = e.target.value; renderRequests(true); });
    }
    $("#sh-post-slot").innerHTML = gate ? gateMessage(gate) : `<button type="button" class="btn btn-primary sh-post" data-sh-post>Post a request</button>`;
    $$("[data-sh-filter]", body).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-sh-filter") === st.reqFilter)));
    let list = S().wishes(st.reqFilter);
    const q = st.reqQuery.trim().toLowerCase();
    if (q) list = list.filter((w) => q.split(/\s+/).every((t) => w.title.toLowerCase().includes(t)));
    let html;
    if (!list.length) {
      const msg = st.reqFilter === "mine" ? "You haven't posted or picked up a request yet." : st.reqFilter === "open" ? "Nothing open. If the shop hasn't got what you need, post a request." : "Nothing here right now.";
      html = `<div class="sh-empty"><p>${q ? "No requests match that search." : msg}</p></div>`;
    } else {
      html = `<div class="sh-list">${list.map((w) => {
        const s = S().status(w);
        const bits = [lookLabel(w.styleHint), w.budgetHint ? "up to " + w.budgetHint.coins : "no budget"];
        const picker = S().livePickups(w)[0] || (S().visibleDeliveries(w)[0] || {}).by;
        bits.push(picker && (s === "pickedUp" || s === "delivered") ? (s === "delivered" ? "delivered by " : "picked up by ") + S().displayName(picker) : (w.askerAccountId === me ? "You" : S().displayName(w.askerAccountId)));
        if (REASON_LINE[s]) bits.push(REASON_LINE[s]);
        bits.push(ago(w.createdAt).replace(" ago", ""));
        return `<button type="button" class="sh-rcard" data-sh-wish="${esc(w.wishId)}"><span class="sh-rthumb">${wishThumb(w)}</span><span class="tx"><strong>${esc(w.title)}</strong><small>${esc(bits.join(" · "))}</small></span>${pill(w)}</button>`;
      }).join("")}</div>`;
    }
    $("#sh-req-list").innerHTML = html;
  }

  /* ---------- Post a request (full-height form) ---------- */
  function startPost(directTo) {
    const gate = S().canPost(S().actor());
    if (gate) { toast(NOTICE[gate.notice] || "You can't post right now."); renderRequests(); return; }
    st.post = { what: "", look: "any", budget: "", reference: null, error: "" };
    st.directTo = directTo || null;
    go("request-post");
  }
  function renderPost() {
    const body = $("#sh-post-body"); if (!body) return;
    if (!st.post) st.post = { what: "", look: "any", budget: "", reference: null, error: "" };
    const p = st.post;
    const direct = st.directTo ? `<div class="sh-notice"><b>Asking ${esc(S().displayName(st.directTo))}</b><p>Only you, them and the moderators see this request.</p></div>` : "";
    body.innerHTML = `<div class="sh-form">${direct}
      <div class="sh-field"><label class="lbl" for="sh-post-what">What do you need?</label>
        <textarea id="sh-post-what" maxlength="1000" placeholder="A village well, top-down, in the Ashroad colours.">${esc(p.what)}</textarea></div>
      <div class="sh-field"><span class="lbl" style="display:block;font-weight:750;margin:0 0 6px">Reference picture (optional)</span>
        <label class="sh-drop" for="sh-post-file" id="sh-post-drop">${p.reference ? `<img src="${p.reference.dataUrl}" alt="" /><span>Picture added · tap to change</span>` : "<span>Add a picture (optional)</span>"}</label>
        <input id="sh-post-file" type="file" accept="image/png,image/webp" class="sr-only" />
        ${p.reference ? '<button type="button" class="btn btn-ghost" style="width:100%;margin-top:8px" data-sh-ref-remove>Remove picture</button>' : ""}
        <p class="sh-hint">PNG or WebP, up to 4 MB and 4096 px. Only shown on this request.</p><p class="sh-err" id="sh-ref-err" role="alert">${esc(p.refError || "")}</p></div>
      <div class="sh-field"><span class="lbl" style="display:block;font-weight:750;margin:0 0 6px">Style</span>
        <div class="sh-chips" role="group" aria-label="Style">${S().LOOKS.map(([k, v]) => `<button type="button" class="toggle" data-sh-look="${k}" aria-pressed="${p.look === k}">${v}</button>`).join("")}</div></div>
      <div class="sh-field"><label class="lbl" for="sh-post-budget">Up to (optional)</label>
        <input id="sh-post-budget" type="number" inputmode="numeric" min="1" max="9999" placeholder="Coins, e.g. 40" value="${esc(p.budget)}" />
        <p class="sh-hint">A hint of what you'd pay. It is not a payment, and coins do not move when someone picks this up.</p></div>
      <p class="sh-err" id="sh-post-err" role="alert">${esc(p.error)}</p></div>`;
    $("#sh-post-what").addEventListener("input", (e) => { p.what = e.target.value; syncPostBtn(); });
    $("#sh-post-budget").addEventListener("input", (e) => { p.budget = e.target.value; });
    $("#sh-post-file").addEventListener("change", (e) => { const f = e.target.files && e.target.files[0]; if (f) readReference(f); });
    syncPostBtn();
  }
  function syncPostBtn() { const b = $("#sh-post-submit"); if (b) b.disabled = !(st.post && st.post.what.trim()); }
  function readReference(file) {
    const C = S().CONFIG; const p = st.post;
    const fail = (m) => { p.refError = m; renderPost(); };
    if (C.referenceTypes.indexOf(file.type) < 0) return fail("Please use a PNG or WebP picture.");
    if (file.size > C.referenceMaxBytes) return fail("That picture is over 4 MB. Try a smaller one.");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      if (w > C.referenceMaxPx || h > C.referenceMaxPx) { URL.revokeObjectURL(url); return fail("That picture is bigger than 4096 px. Try a smaller one."); }
      // Local preview copy only (≤ 256 px). TODO(server §5.4): upload the original as a hub upload, use "wishReference".
      const k = Math.min(1, 256 / Math.max(w, h));
      const cv = document.createElement("canvas"); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
      const cx = cv.getContext("2d"); cx.imageSmoothingEnabled = false; cx.drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      p.reference = { dataUrl: cv.toDataURL("image/png"), w, h, type: file.type }; p.refError = "";
      renderPost();
    };
    img.onerror = () => { URL.revokeObjectURL(url); fail("We couldn't read that picture."); };
    img.src = url;
  }
  function submitPost() {
    const p = st.post; if (!p) return;
    const r = S().postWish({ what: p.what, styleHint: p.look, budget: p.budget, reference: p.reference, audience: st.directTo ? { creatorAccountId: st.directTo } : null });
    if (!r.ok) { p.error = r.notice === "wishEmpty" ? "Tell creators what you need." : (NOTICE[r.notice] || "Couldn't post right now."); renderPost(); return; }
    st.post = null; st.directTo = null;
    st.reqFilter = "mine"; st.wishId = r.wish.wishId;
    toast("Posted. It's in review for a moment.");
    st.stack = st.stack.filter((x) => x !== "request-post");
    go("request-detail", { noPush: false });
    st.stack = st.stack.filter((x) => x !== "request-post");
  }

  /* ---------- Request detail ---------- */
  function renderDetail() {
    const body = $("#sh-detail-body"); if (!body) return;
    const w = S().wish(st.wishId);
    const me = S().actor();
    if (!w || (w.askerAccountId !== me && S().status(w) === "pending")) { body.innerHTML = `<div class="sh-empty"><p>This request isn't available.</p></div>`; return; }
    const s = S().status(w);
    const own = w.askerAccountId === me;
    const pickers = S().livePickups(w);
    const deliveries = S().visibleDeliveries(w);
    const iPicked = pickers.includes(me);
    let h = `<div class="sh-detail"><span class="sh-detail-pill">${pill(w)}</span><h2>${esc(w.text || w.title)}</h2>`;
    const ref = w.references && w.references[0] && S().upload(w.references[0].hubAssetId);
    if ((ref && ref.dataUrl) || (w._thumb && THUMB[w._thumb])) h += `<div class="sh-pic">${wishThumb(w)}</div>`;
    h += `<div class="sh-kv"><div><span>Style</span><b>${esc(lookLabel(w.styleHint))}</b></div>
      <div><span>Budget</span><b>${w.budgetHint ? "Up to " + esc(w.budgetHint.coins) + " · a hint, not a payment" : "No budget given"}</b></div>
      <div><span>From</span><b>${own ? "You" : esc(S().displayName(w.askerAccountId))} · ${esc(ago(w.createdAt))}</b></div>
      ${pickers.length ? `<div><span>Picked up by</span><b>${pickers.map((p) => p === me ? "You" : esc(S().displayName(p))).join(", ")}</b></div>` : ""}
      ${REASON_LINE[s] ? `<div><span>Status</span><b>${esc(REASON_LINE[s])}</b></div>` : ""}</div>`;
    deliveries.forEach((d) => {
      const l = S().listing(d.hubAssetId);
      if (l) h += `<button type="button" class="sh-linked" data-sh-creator="${esc(d.by)}" aria-label="Delivered: ${esc(l.title)} by ${esc(S().displayName(d.by))}. Open their page"><span class="sh-rthumb">${THUMB[l.thumb] || THUMB.pack}</span><span class="tx"><strong>${esc(l.title)}</strong><small>Delivered by ${d.by === me ? "you" : esc(S().displayName(d.by))} · ${l.price ? esc(l.price) + " coins in the shop" : "Free in the shop"}</small></span></button>`;
    });
    if (own) {
      if (s === "pending") h += `<div class="sh-notice" id="sh-in-review"><b>In review</b><p>A quick check before it goes on the board. Only you can see it until then.</p></div>`;
      if (s === "delivered") h += `<p class="sh-note">Buy it in the shop like any other listing. Nothing is charged from this page.</p>`;
      h += `<div class="sh-stack">`;
      if (s === "pickedUp") h += `<button type="button" class="btn btn-ghost" data-sh-release>Return to open</button>`;
      if (["pending", "open", "pickedUp", "delivered"].includes(s)) h += `<button type="button" class="btn btn-ghost" data-sh-close-wish>Close request</button>`;
      h += `</div>`;
    } else {
      if (iPicked) {
        h += `<p class="sh-note">You're on this. When it's ready, list it in the shop, then link it here. Coins do not move from this screen.</p>
          <div class="sh-stack"><button type="button" class="btn btn-primary" data-sh-deliver>Mark delivered</button></div>`;
      } else if (s === "open") {
        const gate = S().canPickUp(w, me);
        if (!gate) h += `<p class="sh-note">You're taking this on. Coins do not move from this screen. When it's ready, list it in the shop as usual.</p><div class="sh-stack"><button type="button" class="btn btn-primary" data-sh-pickup>Pick up</button></div>`;
        else if (gate.notice === "wishAccountTooNew") h += `<div class="sh-notice"><b>Picking up opens when your account is 7 days old</b><p>You can still follow creators and browse the board.</p></div>`;
        else if (gate.notice === "wishLimitReached") h += `<div class="sh-notice"><b>You're already working on 5 requests</b><p>Deliver one before picking up another.</p></div>`;
        else h += `<div class="sh-notice"><b>Not available to pick up</b></div>`;
      }
      h += `<div class="sh-quiet"><button type="button" class="btn" data-sh-report-wish>Report this request</button></div>`;
    }
    body.innerHTML = h + `</div>`;
  }
  function askDeliver() {
    const me = S().actor();
    const ls = S().listingsOf(me);
    if (!ls.length) { openSheet(`<div class="sh-sheet-head"><h2>Mark delivered</h2><p>List the finished asset in the shop first, then link it here.</p></div><div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>OK</button></div>`, "Mark delivered"); return; }
    st.deliverPick = null;
    openSheet(`<div class="sh-sheet-head"><h2>Link one of your listings</h2></div>
      <div class="sh-sheet-body">${ls.map((l) => `<button type="button" class="sh-pick" data-sh-pick="${esc(l.hubAssetId)}" aria-pressed="false"><span class="sh-rthumb">${THUMB[l.thumb] || THUMB.pack}</span>${esc(l.title)}</button>`).join("")}</div>
      <div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>Cancel</button><button type="button" class="btn btn-primary" data-sh-confirm-deliver disabled>Mark delivered</button></div>`, "Mark delivered");
  }
  function askCloseWish() {
    const w = S().wish(st.wishId); if (!w) return;
    const hasDelivery = S().visibleDeliveries(w).length > 0;
    openSheet(`<div class="sh-sheet-head"><h2>Close this request?</h2><p>${hasDelivery ? "It moves to Closed. The delivered listing stays in the shop." : "It comes off the board. You can post a new one later."}</p></div>
      <div class="sh-sheet-foot"><button type="button" class="btn btn-ghost" data-sh-close>Keep it open</button><button type="button" class="btn btn-primary" data-sh-confirm-close>Close request</button></div>`, "Close request");
  }

  /* ---------- shop + games: creator rows (one tap to the creator page) ---------- */
  function byRow(accountId) {
    const c = S().card(accountId); if (!c) return "";
    return `<button type="button" class="sh-by" data-sh-creator="${esc(accountId)}" aria-label="By ${esc(c.displayName)}. Open creator page">${avatar(c, "sm")}<span class="nm">${c.own ? "You" : esc(c.displayName)}</span>${marks(c, false)}</button>`;
  }
  function decorateShop() {
    const box = $("#hub-shop-list"); if (!box || !S()) return;
    $$(".shop-card", box).forEach((card) => {
      if (card.querySelector(".sh-by")) return;
      const buy = card.querySelector("[data-buy-pack]"); if (!buy) return;
      const owner = S().creatorForPack(buy.getAttribute("data-buy-pack")); if (!owner || S().blockedEither(S().actor(), owner)) return;
      buy.insertAdjacentHTML("beforebegin", byRow(owner));
    });
  }
  function decorateLibrary() {
    const box = $("#hub-library-grid"); if (!box || !S()) return;
    $$(".game-card[data-open-game]", box).forEach((g) => {
      if (g.parentElement && g.parentElement.classList.contains("sh-gwrap")) return;
      const owner = S().creatorForGame(g.getAttribute("data-open-game")); if (!owner) return;
      const wrap = document.createElement("div"); wrap.className = "sh-gwrap";
      g.parentNode.insertBefore(wrap, g); wrap.appendChild(g);
      wrap.insertAdjacentHTML("beforeend", byRow(owner));
    });
  }

  /* ---------- profile: "Your public page" + Social section ---------- */
  function decorateProfile() {
    const sub = $("#sh-social-sub"); if (sub) sub.textContent = socialSummary();
  }

  /* ---------- chrome injection ---------- */
  function injectChrome() {
    $$("[data-sh-bell-slot]").forEach((slot) => { if (!slot.querySelector("[data-sh-bell]")) slot.outerHTML = bellHtml(); });
    $$("[data-sh-rail-slot]").forEach((slot) => { slot.classList.add("bottombar", "sh-rail"); slot.setAttribute("role", "navigation"); slot.setAttribute("aria-label", "Studio hub"); slot.innerHTML = railHtml(slot.getAttribute("data-sh-rail-slot")); });
    paintBells();
  }

  function rerender() {
    const id = current();
    paintBells();
    if (id === "creators") renderCreators(true);
    if (id === "creator") renderCreator();
    if (id === "requests") renderRequests(true);
    if (id === "request-detail") renderDetail();
    if (id === "profile") decorateProfile();
  }

  function onShow(id) {
    if (!S()) return;
    if (id !== "inbox") st.inboxFresh = null;
    if (id === "creators") renderCreators();
    if (id === "creator") renderCreator();
    if (id === "inbox") renderInbox();
    if (id === "requests") renderRequests();
    if (id === "request-post") renderPost();
    if (id === "request-detail") renderDetail();
    if (id === "profile") decorateProfile();
    // Home's data-nav buttons call app.js show() directly, which skipped ux-features' list render
    // (the shop/games/chart lists opened empty from Home). Render once if empty, then add creator rows.
    const ux = window.__uxFeatures;
    if (id === "hub-shop") { const b = $("#hub-shop-list"); if (ux && b && !b.children.length) ux.renderHubShop(); setTimeout(decorateShop, 0); }
    if (id === "hub-library") { const b = $("#hub-library-grid"); if (ux && b && !b.children.length) ux.renderHubLibrary(); setTimeout(decorateLibrary, 0); }
    if (id === "hub-chart") { const b = $("#chart-runners-slide"); if (ux && b && !b.children.length && ux.renderHubChart) ux.renderHubChart(); }
    paintBells();
  }

  /* ---------- events (one delegated listener) ---------- */
  function onClick(e) {
    const t = e.target;
    const q = (sel) => t.closest(sel);
    let el;
    if ((el = q("[data-sh-close]"))) { closeSheet(); return; }
    if ((el = q("[data-sh-bell]"))) { go("inbox"); return; }
    if ((el = q("[data-sh-back]"))) { back(el.getAttribute("data-sh-back") || "home"); return; }
    if ((el = q("[data-sh-rail]"))) { const to = el.getAttribute("data-sh-rail"); if (to !== current()) { st.stack = []; go(to, { noPush: true }); st.stack = ["home"]; } return; }
    if ((el = q("[data-sh-creator]"))) { e.stopPropagation(); openCreator(el.getAttribute("data-sh-creator")); return; }
    if ((el = q("[data-sh-follow]"))) { doFollow(el.getAttribute("data-sh-follow"), el); return; }
    if ((el = q("[data-sh-unfollow]"))) { askUnfollow(el.getAttribute("data-sh-unfollow")); return; }
    if ((el = q("[data-sh-confirm-unfollow]"))) { S().unfollow(el.getAttribute("data-sh-confirm-unfollow")); closeSheet(); rerender(); return; }
    if ((el = q("[data-sh-block]"))) { askBlock(el.getAttribute("data-sh-block")); return; }
    if ((el = q("[data-sh-confirm-block]"))) { S().block(el.getAttribute("data-sh-confirm-block")); closeSheet(); toast("Blocked."); rerender(); return; }
    if ((el = q("[data-sh-unblock]"))) { S().unblock(el.getAttribute("data-sh-unblock")); toast("Unblocked. Follow again if you like."); rerender(); return; }
    if ((el = q("[data-sh-sort]"))) { st.sort = el.getAttribute("data-sh-sort"); renderCreators(true); return; }
    if ((el = q("[data-sh-clear-search]"))) { st.query = ""; const s = $("#sh-creator-search"); if (s) s.value = ""; renderCreators(true); return; }
    if ((el = q("[data-sh-ctab]"))) { st.creatorTab = el.getAttribute("data-sh-ctab"); renderCreator(); return; }
    if ((el = q("[data-sh-report-creator]"))) { const id = el.getAttribute("data-sh-report-creator"); askReport({ accountId: id }, S().displayName(id)); return; }
    if ((el = q("[data-sh-report-wish]"))) { askReport({ wishId: st.wishId }, "this request"); return; }
    if ((el = q("[data-sh-reason]"))) {
      if (reportCtx) reportCtx.reason = el.getAttribute("data-sh-reason");
      $$("[data-sh-reason]").forEach((b) => b.setAttribute("aria-pressed", String(b === el)));
      const sub = $("[data-sh-submit-report]"); if (sub) sub.disabled = false; return;
    }
    if ((el = q("[data-sh-submit-report]"))) {
      if (!reportCtx || !reportCtx.reason) return;
      const r = S().report(reportCtx.subject, reportCtx.reason, ($("#sh-report-note") || {}).value);
      closeSheet(); toast(r.ok ? "Thanks. A moderator will take a look." : (NOTICE[r.notice] || "Couldn't send the report.")); return;
    }
    if ((el = q("[data-sh-social]")) || (el = q("#btn-profile-social"))) { openSocialSettings(); return; }
    if ((el = q("[data-sh-pref]"))) {
      const leaf = el.getAttribute("data-sh-pref"); const v = el.getAttribute("aria-pressed") !== "true";
      S().setSocialPref(leaf, v);
      el.setAttribute("aria-pressed", String(v)); el.textContent = v ? "On" : "Off";
      if (leaf === "showFollowerCount") { const sub = $("#sh-sc-sub"); if (sub) sub.textContent = v ? "On. Everyone can see the number." : "Off. Only you can see the number."; }
      rerenderUnderSheet(); return;
    }
    if ((el = q("[data-sh-direct]"))) {
      S().setSocialPref("directWishes", el.getAttribute("data-sh-direct"));
      $$("[data-sh-direct]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); rerenderUnderSheet(); return;
    }
    if ((el = q("#btn-profile-public"))) { openCreator(S().ME); return; }
    if ((el = q("[data-sh-edit-profile]"))) { go("profile"); return; }
    if ((el = q("[data-sh-apply-verified]"))) { S().applyVerified(); toast("Application sent. The CEO reviews each one."); rerender(); return; }
    if ((el = q("[data-sh-ask]"))) { startPost(el.getAttribute("data-sh-ask")); return; }
    if ((el = q("[data-sh-feed]"))) { openFeedItem(el.getAttribute("data-sh-feed")); return; }
    if ((el = q("[data-sh-filter]"))) { st.reqFilter = el.getAttribute("data-sh-filter"); renderRequests(true); return; }
    if ((el = q("[data-sh-post]"))) { startPost(null); return; }
    if ((el = q("[data-sh-wish]"))) { st.wishId = el.getAttribute("data-sh-wish"); go("request-detail"); return; }
    if ((el = q("[data-sh-look]"))) { if (st.post) st.post.look = el.getAttribute("data-sh-look"); $$("[data-sh-look]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); return; }
    if ((el = q("[data-sh-ref-remove]"))) { if (st.post) { st.post.reference = null; st.post.refError = ""; } renderPost(); return; }
    if ((el = q("#sh-post-submit"))) { submitPost(); return; }
    if ((el = q("#sh-post-cancel"))) { st.post = null; st.directTo = null; back("requests"); return; }
    if ((el = q("[data-sh-pickup]"))) { const r = S().pickUp(st.wishId); if (!r.ok) toast(NOTICE[r.notice] || "Couldn't pick this up."); else toast("Picked up. The requester has been told."); renderDetail(); return; }
    if ((el = q("[data-sh-deliver]"))) { askDeliver(); return; }
    if ((el = q("[data-sh-pick]"))) { st.deliverPick = el.getAttribute("data-sh-pick"); $$("[data-sh-pick]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); const c = $("[data-sh-confirm-deliver]"); if (c) c.disabled = false; return; }
    if ((el = q("[data-sh-confirm-deliver]"))) { const r = S().deliver(st.wishId, st.deliverPick); closeSheet(); toast(r.ok ? "Delivered. The requester has been told." : (NOTICE[r.notice] || "Couldn't mark delivered.")); renderDetail(); return; }
    if ((el = q("[data-sh-release]"))) { S().release(st.wishId); toast("Back on the board as Open."); renderDetail(); return; }
    if ((el = q("[data-sh-close-wish]"))) { askCloseWish(); return; }
    if ((el = q("[data-sh-confirm-close]"))) { S().close(st.wishId); closeSheet(); toast("Request closed."); renderDetail(); return; }
  }
  function rerenderUnderSheet() {
    // Update the page beneath without closing the sheet.
    const id = current();
    if (id === "creator") { const sh = $$(".sh-sheet, .sh-scrim"); sh.forEach((n) => n.remove()); renderCreator(); const host = $(".screen.active"); sh.forEach((n) => host.appendChild(n)); }
    if (id === "profile") decorateProfile();
  }

  function init() {
    if (!window.SocialStore) return;
    SocialStore.load();
    injectChrome();
    document.addEventListener("click", onClick, true);
    SocialStore.onChange(() => { paintBells(); const id = current(); if (id === "requests" || id === "request-detail") { if (!$(".sh-sheet")) rerender(); } });
    // Shop / library lists re-render often (tabs, buys): keep creator rows on them.
    const obs = new MutationObserver(() => { decorateShop(); decorateLibrary(); });
    ["#hub-shop-list", "#hub-library-grid"].forEach((s) => { const n = $(s); if (n) obs.observe(n, { childList: true }); });
    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#/, "");
      if (["creators", "requests", "inbox"].includes(id) && current() !== id && window.__show) window.__show(id);
    });
    const id = current(); if (id) onShow(id);
  }
  window.TileEngineSocial = { onShow, paintBells, openCreator, openSocialSettings, closeSheet, go, back, state: st, renderInbox, decorateShop, decorateLibrary };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
