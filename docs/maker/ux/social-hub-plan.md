# Bootleg social hub — plan only (after r69)

**Status: ACCEPTED 2026-11-12 04:55 Europe/London, amended 04:56 (S2).** The CEO took all 12 UX picks, relayed by CoS. At 04:56 the CEO ruled S2: follower counts are **private by default**, overriding the public-count pick in Q7. A creator may opt in with Show follower count (`prefs.social.showFollowerCount`). Popular still ranks by new follows in the last 30 days without showing numbers. This is a plan only, and any build needs the CEO's own SEND.

**Owner:** Editor & UX Designer  
**Status:** PLAN ONLY, 2026-11-12. CEO direction 04:39 (Europe/London, UTC+0), relayed by the Chief Of Staff. Nothing is built into the live shell, nothing is published, and nothing goes live until the CEO's own SEND.  
**Mocks:** `ui-shell/mock-social/`  
**Shots:** `ui-shell/screenshots/71s-*.png` (phone 390×844, light plus dark)  
**Capture:** `ui-shell/scripts/capture_71_social.py`  
**Does not touch:** `ui-shell/js`, `ui-shell/css`, `ui-shell/index.html` (round 69 is editing those).

This is a screen and flow plan. The Data & Save Keeper owns the records. This doc lists data needs as questions; it does not invent formats, ledger kinds, or payment rules.

---

## 1. What it is

A light, mobile-first social layer on the existing Studio hub, in three parts:

1. **Discover creators.** A public **creator page** you can open from an asset or a game, plus a **Creators** browse with simple search and sort chips (New, Popular, Verified).
2. **Follow, then get told.** A Follow button, and a notifications inbox (a bell with a red count that clears on view, same pattern as the Achievements badge in `ux/qol-plan-r69.md` P2 item 12).
3. **Requests.** If the shop hasn't got what someone wants, they post a request for a more personal asset. Creators can pick it up. This is a board, not a contracts desk.

It sits **after r69**. The profile overhaul, badges, borders and trust marks in r69 are the base this reuses.

---

## 2. Locked design rules

CEO-locked, same as the rest of the editor:

- Phone-first. Thin top bar, a bottom rail on hub list screens, contextual sheets at **most 40%** of the height. Full-height only for pickers, inboxes and forms, always with a **Back** button.
- Canvas stays roomy: list screens should not feel like a packed admin tool. Calm r62 look, no "Isberg Labs" density.
- **48 px+** touch targets. AA contrast, light and dark.
- **Basic adds zero extra taps.** Follow from a Creators row is one tap. Opening a creator from a shop card is one tap on the creator row. Posting a request is one tap on the board.
- All code stays hidden. Short, plain words.

---

## 3. How it ties to the profile and to trust

The **Studio profile** (`qol-plan-r69.md` item 12, mocks `ui-shell/mock-qol/20-25-profile-*.html`) stays the private editor page: name, coins, How to earn, My setup, Appearance, Achievements, Pictures / Badges / Borders.

The **creator page** is the public face of that same account.

| Shown on the creator page | Source (already decided) | Own view | Visitor view |
|---|---|---|---|
| Avatar | `prefs.avatarId` (`te-avatars`) | yes | yes |
| Equipped badge | `prefs.badgeId` (`te-cosmetics`) | yes | yes, if unlocked |
| Equipped border | `prefs.borderId` | yes, drawn on the avatar | yes, if unlocked |
| Display name | `prefs.name` | editable via Studio profile, not here | yes |
| **Verified creator** / **Partner** | account verification, sync-format §6.5.1 | yes, if granted | yes, if granted |
| **Made by TileEngine** | `studioProject: true` on first-party listings, pack-format §8 | on the official account and its listings | same |
| Sale counts (`assetSales`) | `profile.rewards.metrics`, profile-format r8 §1.12.9 R7-Q9 | **yes, marked "Only you can see this"** | **never** — visitors see the badge only |
| Coins, How to earn, My setup, Appearance, Achievements list, progress bars ("Sold 7/10") | Studio profile | not on the public page | not shown |
| Assets and games | hub listings / `made-game` | yes | yes (public, approved only) |
| Follower count (aggregate) | derived; public only if `prefs.social.showFollowerCount` (S2) | **yes, marked "Only you can see this"**, with a link to the toggle | **only if the creator opted in**; otherwise hidden |

**Trust marks are not cosmetics** (profile-format r8 §1.12.8, sync-format §6.5.1, pack-format §8):

- **Verified creator** is by application, CEO approval, via the existing `hub-request` type `verifiedCreator`. The badge is derived at display time and already shows on hub asset and game listings. It also shows on the creator page. It cannot be equipped, hidden, or put in `te-cosmetics`.
- **Partner** is invite-only, granted by the CEO. Same treatment, higher than Verified (`partner` > `verifiedCreator`).
- **Made by TileEngine** is a label on first-party listings (and on the official TileEngine creator page), derived from `studioProject: true`. It is not a user verification and cannot be granted to a user.
- Chart badges (Game / Asset of the Month) *are* cosmetics and can be equipped; if equipped they appear in the badge slot, not as trust marks.

The server, not the client pref, decides what visitors see for badge and border (profile-format §1.12.6). Locked or unknown keys show as none.

A quiet **Apply for Verified creator** sits only on your own creator page and files the existing `hub-request` type. Partner has no apply path.

---

## 4. Entry points and hub navigation

**Recommended hub chrome** (CEO-Q1): Studio hub list screens (Shop, Games, Creators, Requests) share one thin top bar and a **four-item bottom rail**.

```
Top bar:  Studio hub · [Back]  Title                    [🔔 3]
Rail:     Shop     Games     Creators     Requests
```

- **Home** keeps the existing **Asset shop** and **Made games** buttons. They open the same screens as today, now sitting on this rail. That is **zero extra taps** in Basic.
- **Creators** and **Requests** are one tap from that rail. They are not added as extra Home buttons (Home is already a tall stack; P3 item 14 wants it shorter).
- **Studio profile** (Stage → ⋯ → Profile) gets a single row: **Your public page**. One tap to the own-view creator page. It also gains a **Social** section with the three toggles in §5.3.
- Every **shop card, asset page and game card** already names a creator. The avatar + name + trust mark is one 48 px row. Tapping it opens that creator page (one tap).
- The **bell** lives in the hub top bar on every hub list screen. On Home, the same bell sits in the top bar so a new upload is not missed. Count, colour and `aria-label` match Achievements: deep red `#b42318` with a white numeral, subtitle or label "3 new", `aria-label="Notifications, 3 new"`. The badge is never colour-only.

Full-height panels (creator page, inbox, post-request, request detail) use **Back** and drop the rail, so the canvas stays tall.

Search is a single 48 px field at the top of Creators (name or handle only in v1) and a matching field on the request board (title text). No advanced filters in v1.

---

## 5. Screens and flows

### 5.1 Creators browse (discovery)

- Sort chips, one selected: **New**, **Popular**, **Verified**, and **Following** (the last is useful once you follow someone; hide it only if the list would be empty — see empty states).
- Recommended meanings (CEO-Q2), for the Keeper to store, not for this UI to invent: **New** = published an asset or a game in the last 7 days; **Popular** = most new followers in the last 30 days; **Verified** = current `verifiedCreator` or `partner`; **Following** = people you follow.
- Each row: avatar (with border if equipped), name, trust mark if any, equipped badge if any, a short line ("12 assets · 3 games"), and a 48 px **Follow** / **Following** button. Tapping the row (not the button) opens the creator page. A follower count is added to that line only when that creator has turned on Show follower count. **Popular** does not show numbers; it only changes the order (most new follows in the last 30 days).
- Official TileEngine may appear in Verified and Popular, with the **Made by TileEngine** mark. Whether it is followable is CEO-Q10.
- Signed-out: rows still open; Follow reads **Sign in to follow**.
- Simple search filters the list as you type, name and handle only.

### 5.2 Creator page (own and visitor)

Shared header:

- Avatar at 72 px with the equipped border.
- Name, equipped badge (icon + title, or nothing).
- Trust marks as labelled chips, never in the badge slot.
- Follower count is **private by default** (S2, overriding the public-count pick in Q7). Visitors see it only if the creator has turned on Show follower count. No follower list in v1.
- Tabs: **Assets** | **Games**. Approved, visible listings only. A disputed listing stays visible and labelled "Disputed" (existing H5). Taken-down listings are absent.

**Visitor view**

- A full-width 48 px **Follow** or **Following** button under the header (CEO-Q4 for the unfollow confirm).
- No coins, no sale counts, no "Sold 7/10", no Achievements, no Edit.
- A quiet **Report** (and **Block**) at the bottom, not in the first screenful.

**Own view**

- No Follow button. A short line: "This is your public page."
- **Edit Studio profile** takes you to the existing private profile, which now also holds a **Social** section (below).
- A clearly marked private strip for sales: **Only you can see this · Sold 47**. The number is `assetSales`. Visitors never see the strip.
- Your own follower count sits in the same private treatment: **Only you can see this · 12 followers**, plus a 48 px link (**Show follower count**) that opens the Social settings toggle. If you have opted in, the count also appears in the public header, without the private label.
- **Apply for Verified creator** if you are not already verified or a partner, and you have no open application. If an application is open: "Application in review". Partner is never offered here.

### 5.3 Social settings

A small **Social** section lives under Studio profile settings. The same controls also open as a **40% sheet** from the **Show follower count** link on your own creator page. Three controls, defaults from `prefs.social` in social-format r1.1 §6:

1. **Show follower count** — off by default (`showFollowerCount: false`). When off, only you (and the CEO admin view) see the number. When on, visitors and browse rows may show it.
2. **Who can send me requests directly** — **Off** / **Followers** / **Anyone**. Default **Off** (`directWishes: "off"`). The UI word is always **Requests**; the data kind `hub-wish` must never appear in the UI.
3. **Notify me about new followers** — off by default (`notifyNewFollower: false`).

### 5.4 Follow button states

| State | Control | Notes |
|---|---|---|
| Not following | Primary **Follow** | One tap. |
| Following | Ghost **Following** | One tap opens a 40% sheet: "Unfollow River Hale?" with **Keep following** and **Unfollow** (CEO-Q4). Stops accidental unfollows; starting a follow stays one tap. |
| Own page | hidden | Replaced by the "This is your public page" line. |
| Signed out | **Sign in to follow** | Opens the existing account path; nothing is faked. |
| Blocked (you blocked them) | no Follow | "You blocked this creator", with **Unblock**. |
| Just posted (busy) | button disabled, same label | Prevents a double fire. No spinner circus. |

Unfollow stops future notifications. It does not delete older inbox rows.

### 5.5 Notifications inbox

A **full-height** panel with **Back**. Opening it clears the red count (same rule as Achievements: a device-local seen list; a second device may show the count once more — question K3).

v1 rows are only:

- A followed creator listed a **new asset** ("River Hale listed Oak barricade · 2 hours ago").
- A followed creator **published a game** ("River Hale published Moss courtyard · Yesterday").
- **Request life-cycle** for something you posted or picked up: picked up, delivered, or closed ("Ash Reed picked up your request: Village well").

No notification for avatar, badge, name or follow-back changes (CEO-Q3). Tapping a row opens the asset, the game, or the request. Rows are at least 64 px, with the creator's avatar and a "New" mark on unseen items.

The bell on other screens then shows no count. The inbox itself may still list older items.

### 5.6 Request board

A hub list screen (rail on Requests). Filter chips: **Open**, **Picked up**, **Delivered**, **Closed**, **Mine**. Default **Open**. **Mine** is your posts and the ones you picked up.

Each card (min 48 px, usually taller because of a thumb): title (the "what"), optional reference thumb, style chip, optional budget hint ("Up to 40"), requester name, state, age. Tapping opens the detail.

A 48 px primary **Post a request** is pinned at the top of the list, not buried.

### 5.7 Post-request flow

**Full-height** with Back (it is a form, not a 40% sheet). Few fields:

| Field | Required | Notes |
|---|---|---|
| **What do you need?** | yes | Short text, one or two sentences. Placeholder: "A village well, top-down, in the Ashroad colours." |
| **Reference picture** | no | Optional upload. Dashed 48 px+ drop area: "Add a picture (optional)". |
| **Style** | no, default **Any** | Chips reuse the existing Convert **Look** names so we do not invent a second vocabulary: **Any**, **Crisp**, **16-bit**, **Cel**, **HD-2D**, **Game Boy**, **PICO-8**, **Vector** (`ux/pixel-editor-plan.md`). This is a hint for the maker, not a paint-style pin. |
| **Coin budget** | no | Optional. Label: **Up to (optional)**. Hint on the form: "A hint of what you'd pay. It is not a payment, and coins do not move when someone picks this up." Amounts stay placeholders until coin values are set. |

Footer: **Cancel** · **Post request**. Posting is one tap after the form is valid (What is non-empty). The new request lands on the board in **Open**, subject to the moderation rule in §7 and CEO-Q8.

### 5.8 Request detail and Pick up

Full-height with Back. Shows the what, the reference picture, the style, the budget hint, the requester, the state, and (once picked up) the creator who picked it up.

| State | Who can do what |
|---|---|
| **Open** | Any signed-in creator with upload rights can **Pick up** (one at a time — CEO-Q6). The requester can **Close**. Anyone can **Report**. |
| **Picked up** | The picker sees **Mark delivered** (how it points at a finished listing is K6 — the UI shows a "Link the listing" control, but the record is the Keeper's). The requester can **Close** or, if they don't want this picker, **Return to open** (CEO-Q6). |
| **Delivered** | The requester can **Close**. The listing, once linked, is tappable. Buying that listing is the normal shop purchase, not a special checkout on this page (CEO-Q5). |
| **Closed** | Read-only, plus Report. |

**Pick up** is a 48 px primary. It is not a contract: the copy under the button says "You're taking this on. Coins do not move from this screen." If the viewer is the requester, Pick up is hidden (you cannot pick up your own request). If they are signed out: **Sign in to pick up**.

This plan does **not** add messages or a negotiation thread.

---

## 6. Empty states (short, one action)

| Screen | Copy | Action |
|---|---|---|
| Creators, no results | "No creators match that search." | Clear search |
| Creators, Following, you follow no one | "You're not following anyone yet. Follow a creator to see them here and to hear when they upload." | Chip jumps to Popular |
| Notifications, none | "Nothing yet. Follow a creator to hear when they upload something new." | **Find creators** |
| Request board, Open, empty | "Nothing open. If the shop hasn't got what you need, post a request." | **Post a request** |
| Request board, Mine, empty | "You haven't posted or picked up a request yet." | **Post a request** |
| Creator Assets / Games, empty | "No public assets yet." / "No published games yet." | Own view only: **Open the shop** / **Made games** |
| Signed out, trying to follow / post / pick up | Stay on the same screen; the button itself is the sign-in prompt | Existing account path |

---

## 7. Safety, report, block, and what v1 will not do

**No DMs in v1** (CEO-Q9). Pickup and delivery are state changes on the request, plus at most a short public note if the Keeper later adds one. A chat would turn this into a contracts desk. If a later version needs a message, that is a new CEO call.

**Report** (40% sheet) is available on a creator page and on a request (and already exists, in spirit, on hub listings via `hub-claim`). v1 reasons, as plain chips: **Spam**, **Stolen art**, **Harassment**, **Other**. A short optional note. **Submit report**. We do not invent a new claim format; the sheet should reuse the existing report/claim path where the Keeper says it fits (K5). Server replies already include `claimNeedsAccount`, `claimDuplicate`, `claimRateLimited`, `claimSubjectUnavailable`.

**Requests are moderated.** Recommended (CEO-Q8): they go up on the board after the same kind of light pre-check used for hub uploads; flagged ones wait in the CEO/mod queue; we do not hold every request for a manual approve, or the board will feel empty. Illegal or spam reports can take a request down. The reference picture should be fingerprinted like other hub images if the Keeper agrees (K7).

**Block** (from the visitor creator page, 40% sheet: "Block River Hale? You will unfollow them, and you won't see their page, listings or requests."). Effects are for the Keeper (K9). UI intent: they disappear from browse, From-the-community shop rows, Following, and the request board; existing notifications from them stop; they cannot pick up your requests. Unblock is on their page or from a short Blocked list under Studio profile (Advanced is fine).

**Anti-spam** is not specified here. Limits, account age and duplicates are Keeper questions (K10).

Three upheld listing claims already remove upload rights (sync-format H12). That existing strike path stays the serious end of abuse; this plan does not add a second punishments system.

---

## 8. Payment and escrow — not invented here

The optional coin budget is a **hint only** in this plan (CEO-Q5). In v1:

- Coins do **not** move when a request is posted, picked up, delivered or closed.
- There is **no escrow**, no hold, no automatic payout, and no new coin reason on this board.
- If the maker lists the finished art in the shop, the requester buys it like any other listing (existing `hubAssetPurchase`). Paying user sellers is already deferred (pack-format Q3, `hubAssetSale`).
- Coin figures in the mocks are placeholders, as they are everywhere else until the CEO sets amounts.

Open questions for the CEO and the Keeper are in §9–10. The UI copy must keep saying this is a hint, so the board cannot be mistaken for a contract.

---

## 9. Open questions for the CEO

Each has a recommended pick. Short on purpose.

| # | Question | Recommended pick |
|---|---|---|
| **Q1** | How do people reach Creators and Requests without making Home taller? | **A four-item hub rail: Shop, Games, Creators, Requests.** Home keeps Asset shop and Made games (same tap count). Creators and Requests are one rail tap from there. |
| **Q2** | What do the sort chips mean? | **New** = listed or published in the last 7 days. **Popular** = most new followers in the last 30 days. **Verified** = Verified creator or Partner. **Following** = people you follow. |
| **Q3** | What earns a notification? | **New assets and new published games** from people you follow, plus **request state changes** on yours (posted or picked up). Not profile or follow-back noise. |
| **Q4** | Can a Follow be undone in one tap? | **No.** Follow is one tap; unfollow goes through a 40% "Unfollow?" sheet so it is harder to do by mistake. |
| **Q5** | Is the coin budget a payment, an escrow, or a hint? | **A hint only in v1.** "Up to 40" is what you'd pay. Coins do not move on this board. The finished asset is bought in the shop as usual. Escrow and contracts wait for legal and for a seller earn reason. |
| **Q6** | Can more than one creator pick up a request? | **No, one at a time.** The requester may return it to Open or Close it. |
| **Q7** | Are follower lists public? | **No lists.** The accepted UX pick (04:55) was a public **count** so Popular has a number. **Overridden 04:56 (S2):** the count is **private by default**; a creator may opt in with Show follower count (`prefs.social.showFollowerCount`). Popular still ranks by new follows in the last 30 days **without showing numbers**. Who follows whom stays private in v1. |
| **Q8** | Do requests wait for a manual approve before they show? | **No, not every one.** Light pre-check, then live; flagged ones wait in the CEO/mod queue. Reports can take one down. |
| **Q9** | Direct messages in v1? | **No.** State changes on the request are enough. A chat would make this a contracts desk. |
| **Q10** | Can people follow the official TileEngine account? | **Yes**, so a Starter Pack or official listing can notify followers. It still shows **Made by TileEngine**, not Verified creator. |
| **Q11** | Who may pick up a request? | **Any signed-in account that still has upload rights** (not struck out under H12). The requester cannot pick up their own. |
| **Q12** | Where does the bell appear? | **On every Studio hub screen, and on Home**, same red count pattern as Achievements. Not on the stage canvas. |

---

## 10. Questions for the Data & Save Keeper

No formats, field names or endpoints are proposed below. These are needs the screens have, for you to house in the right doc.

1. **Public creator document.** Which fields are public (name, avatar, equipped badge and border, trust marks, approved assets and games, follower **count** — now only if the creator opted in, S2)? Please confirm sale metrics and coins never leave the owner (and CEO admin) view, matching r8 §1.12.9 R7-Q9. The client pref is not trusted for public badge/border display (§1.12.6).
2. **Follow graph.** Follow and unfollow; uniqueness; what block does to a follow; fan-out when a followed account has a listing approved or a `gamePublished` entry written. Own-follow refused.
3. **Notifications list vs the "new" count.** The badge should clear on view, like `editor-prefs.achievementsSeen` (device-local, may repeat on a second device). Is the inbox itself a server list, and is the seen-state device-local?
4. **Asset-request record.** This is **not** the existing `hub-request` v1 (`verifiedCreator`, `uploadRightsAppeal`). The board needs its own kind, with states Open / Picked up / Delivered / Closed, the "what" text, an optional reference picture, a style hint, an optional budget hint, the requester, the picker, and timestamps. Status should be derived, not a loose client flag, if that matches your usual rule.
5. **Report and block.** Can creator and request reports reuse `hub-claim` (or the same report path), and where does a block live? Needed effects are in §7.
6. **Delivered → listing.** How a picker points the request at a finished hub listing (a listing id?). Pickup should not reserve or charge anything in v1.
7. **Reference pictures.** Storage, size cap, and whether D2 fingerprinting and the stolen-art pre-check apply (they should, if the picture can be public).
8. **Follower count.** A derived aggregate, **private by default** (S2); shown publicly only if the creator opts in. No identities in v1. Popular ranks by new follows in the last 30 days and does not need to show numbers.
9. **Block semantics.** Hide their page, listings and requests for the blocker; unfollow both ways or one way?; may they still buy from each other?; may they pick up the blocker's requests? (UI intent: no.)
10. **Anti-spam limits.** Rate limits on follows, request posts, reports and notification volume; whether a 7-day account age applies (it already does for votes and for a sale to count); duplicate open requests from the same account; signed-in-only for write actions.
11. **Search.** Name/handle prefix (creators) and title text (requests). Who indexes, and is it online-only?
12. **Account deletion** (sync-format §7). What happens to follows, notifications, and open or picked-up requests when an account goes?
13. **Official TileEngine account.** How the first-party account is identified for the Made by TileEngine creator page and for Q10 (followable official uploads).
14. **Apply for Verified** stays the existing `hub-request` type; the creator page is only an entry. No new verification path.
15. **Moderation queue** for flagged requests (Q8): same CEO queue as listings, or a sibling view?

---

## 11. Suggested build order (after r69, and only after a later SEND to go live)

The live r69 work stays untouched until that build is done. This is a later slice.

1. **Creator page** (own + visitor), hooked from existing shop and game creator rows. Reuse avatar, badge, border and trust marks. Private sales strip on the own view only.
2. **Hub rail and Creators browse**, with simple search and the four sort chips. Follow on the row (one tap).
3. **Follow + notifications inbox** (bell, red count, clear on view, empty state).
4. **Request board, post flow, and detail with Pick up**, including the four states and the "hint, not a payment" copy.
5. **Report and block** sheets, moderation empty/error notices, signed-out prompts.
6. **Polish:** dark theme audit, 48 px / AA pass, Home bell, "Your public page" on Studio profile, Social settings (the three toggles), official TileEngine row.

---

## 12. Mocks and shots

Stand-alone HTML in `ui-shell/mock-social/`, linking `../css/app.css` read-only plus `social-mocks.css`. Built by `build_social_mocks.py`. Phone frame 390×844.

| Mock | What it shows |
|---|---|
| `01-shop-entry-light.html` | Asset shop card with a tappable creator row (entry point). |
| `02-creator-own-light.html`, `02-creator-own-dark.html` | Own public page: private "Sold 47" and "12 followers" strips, a **Show follower count** link, Edit Studio profile, no Follow. |
| `03-creator-visitor-light.html`, `03-creator-visitor-dark.html` | River Hale, Verified, equipped badge and border, **Follow**. No follower count (default). |
| `13-creator-visitor-opt-in-light.html` | Same visitor page, with the creator opted in: "128 followers" is visible. |
| `04-creator-following-light.html` | **Following** state. |
| `05-creator-unfollow-sheet-light.html` | 40% "Unfollow?" sheet. |
| `06-creators-browse-light.html`, `06-creators-browse-dark.html` | Search, New / Popular / Verified / Following, row-level Follow, bell with 3. |
| `07-notifications-light.html`, `07-notifications-dark.html` | Full-height inbox. |
| `08-notifications-empty-light.html` | Empty inbox. |
| `09-request-board-light.html`, `09-request-board-dark.html` | Board, Open filter, Post a request. |
| `10-request-post-light.html` | Post flow (what, reference, style, optional budget). |
| `11-request-detail-light.html`, `11-request-detail-dark.html` | Open request with **Pick up**. |
| `12-request-report-sheet-light.html` | 40% Report sheet on a request. |
| `14-social-settings-light.html`, `14-social-settings-dark.html` | 40% Social settings sheet: Show follower count (off), Who can send me requests directly (Off), Notify me about new followers (off). |

Shots: `ui-shell/screenshots/71s-*.png`, plus a contact sheet. Local only; the capture script starts a local server and must not touch the live shell.

---

## 13. Things this plan does not decide

Left open on purpose, beyond the questions above:

- Final copy tone on official TileEngine notifications ("New from TileEngine" vs the listing title only).
- Whether **Mark delivered** should also let the picker attach a short public note. v1 can ship without it.
- A Blocked-list screen's exact placement (recommended: Studio profile, Advanced).
- Whether Home's later P3 shrink (item 14) also folds the bell into a smaller hub entry. v1 of this plan already puts the bell on Home's top bar.

End of plan.

## Appendix: Keeper answers (ACCEPTED r1.1, 2026-11-12 04:56)
The Keeper's K1–K15 answers in `data/social-format.md` §15 were accepted by the CEO at 04:56 (via CoS) as S1–S15. social-format is **ACCEPTED r1.1** (sha c20431f9). Fold these in when the hub build starts:
- Asset requests are the new kind `hub-wish` (this name is data-only and must never appear in the UI; the screens say **Requests**). Their statuses are pending ("In review"), open, picked up, delivered, accepted, closed, expired, withdrawn, declined and removed. The 4 board chips group these.
- Delivery states are inReview, ready, disputed and void. Feed cards carry getMode (free, buy or unavailable) and subjectState (listed or disputed).
- The follower count is opt-in and **private by default** (S2, overriding the public-count pick in Q7). Popular sorts by new follows in the last 30 days and does not show numbers.
- The bell count uses a synced "seen up to" mark. Row "New" marks stay on the device.
- Reports reuse `hub-claim` (spam, stolenArt, harassment, other). Block is its own record.
- Limits: 7-day account age to post or pick up; 3 open requests, 3 new per day, 30 follows an hour.
- Settings in `prefs.social`: showFollowerCount (default off), directWishes (off / followers / anyone; default off), notifyNewFollower (default off). These live in a small Social section in profile settings, mocked as a 40% sheet.
- Search is online only.
