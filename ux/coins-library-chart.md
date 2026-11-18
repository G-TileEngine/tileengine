# Studio hub: coins, made-games library, monthly chart — DRAFT

Status: **DRAFT / PROPOSED**. Aligned with **profile-format r2** §1.10 / §9, CEO answers 2026-11-10. Nothing public.

This is **studio hub** content for TileEngine makers — separate from a built game's `player-profile`.

## Gold coins (§1.10)

| Field | Type | Notes |
|---|---|---|
| `profile.coins` | `{ checkpoint, entries[] }` | Server-authoritative ledger copy; **balance is derived**, never stored |
| `CoinTx` | `coinTx_<ULID>` | signed earn/spend; reasons frozen |
| `ownedPacks[]` | mock / server | Hub shop owned state (mock local until server) |

**Earn reasons:** `achievementUnlocked`, `firstStageMade`, `firstGameFinished`, `gamePublished`, `gameFeatured`, `firstTop100`, `gameOfTheMonth`, **`assetOfTheMonth`** (hub asset chart).  
`gameLiked` is **retired** (id kept).  
**Spend:** `hubAssetPurchase` only.  
**Never:** purchase-for-money, visiting/installing apps or store pages, votes, receiving votes, link clicks.  
**Reset:** coins are **never** reset (local or synced wipe).

### Coin amounts — PLACEHOLDERS (CEO 2026-11-10)

Amounts are **random placeholders for now**; server config will replace them. Label every UI/doc figure as a placeholder until CEO sets real values.

| Reason | Placeholder coins | Notes |
|---|---|---|
| `achievementUnlocked` (per achievement) | 5–50 (varies by id) | mock map in `ProfileStore.COIN_REWARDS` |
| `firstStageMade` | 10 | placeholder |
| `firstGameFinished` | 40 | placeholder |
| `gamePublished` | 25 | placeholder |
| `gameFeatured` | 75 | placeholder |
| `firstTop100` | 100 | from **frozen** snapshot only |
| `gameOfTheMonth` | 200 | from **frozen** snapshot only |
| `assetOfTheMonth` | 200 | same reward class as GOTM (placeholder) |

UI: profile header chip · How to earn · coin line on unlock toasts · hub shop.

## Made-games library (`made-game` v1 §9.0)

Outbound library of published games. Own games tagged **Yours**.

### Recommended (CEO / reported via DSK 2026-11-10)

In **Made games** (view other games) and the **hub shop**: a **Recommended** card shows **one random pick**, re-picked **every time the screen opens**, from items with **> 100 all-time thumbs**.

## Monthly thumbs-up charts — **reported via DSK** as CEO-decided 2026-11-10

Two parallel monthly charts:

| Section | Winner | Reward |
|---|---|---|
| **Games** | Game of the Month | most thumbs (same reward class) |
| **Shop assets** | Asset of the Month | most thumbs (same reward class) |

### Refresh

- Chart **refreshes every 24h** (not live).
- UI: **“Updated daily · next update in Xh”**.
- Month tab renamed from “This month (live)” → **“This month”**.

### Voting — **DECIDED** (reported via DSK, 2026-11-10 15:03 Europe/London)

This replaces the earlier CEO “1 vote per day” answer and the short-lived profile-format r2 §9.4 “10 votes per UTC day” figure. Both are superseded.

- Constants (single switches in the shell): `VOTES_PER_HOUR = 1`, `VOTES_PER_DAY = 12` (UTC day).
- Next vote unlocks **60 minutes after the last send**. A refused send returns `voteRateLimited` with `retryAt`.
- **One live thumbs-up per item per month**, unique on `(accountId, subject.kind, subject.id, month)`. Withdrawable in the same month only. Withdraw is not a new send: it does not clear the hourly lock or refund a daily send.
- Never vote for your own item (`voteOwnSubject`). Account required (`voteNeedsAccount`); account must be at least **7 days** old (`voteAccountTooNew`).
- **Flagged votes do not count until approved**.
- Vote buttons are **disabled** while the hourly lock is on, or when the daily cap is reached. An item already voted this month stays withdrawable.
- Status, shown **once at the top** only (count-driven):
  - Available: **“Vote ready · X of 12 left today”**
  - Waiting: **“Next vote in 59m · X of 12 left today”** (countdown from `retryAt`)
  - Daily cap: **“No votes left today · resets 00:00 UTC”**
- **No coins for votes or link clicks.**

### Asset-usage vote prompt — profile-format r2 §9.7.1 (**PROPOSED** shell)

After **60 minutes of active editing** in a project that uses a **downloaded hub asset**, show **one** calm prompt: **“Enjoying &lt;asset&gt;?”** with the asset thumb and creator.

Buttons: **Vote now** (primary) / **Later** / **Don't ask again**.

- A small **bottom card above the tool rail**, not a modal. Never more than about **25%** of the screen height, and never covering the grid or Undo. Dismissible (same as Later). One prompt at a time.
- **Vote now** casts a normal vote (no reward) and ends the prompt for that asset. A brief **“Thanks, vote counted”** strip follows.
- **Later** hides the card and asks again after another 60 minutes of use.
- **Don't ask again** ends it for that asset.
- Never shown for your own asset, an asset already voted this month, or when a vote would be refused (no account, account under 7 days, hourly lock, or daily cap).
- Usage counter is device-local at `voteprompt/usage.json`. The prototype mocks this in `localStorage` under `tileengine.voteprompt.usage.v1`, shape `{[hubAssetId]: {usedMs, state: "counting"|"later"|"done"}}`.
- Dev-only hook (not in the user UI): `window.__uxFeatures._showVotePromptForCapture(assetId)` forces the card for screenshots, still honouring the refusal rules above.

### Layout (top → bottom)

1. **Last month’s winner** card (Game of the Month or Asset of the Month).
2. **Slim rotating banner** of top-10 runners-up (~10 s): one card, compact counter + Pause (swipe / prev-next); respects `prefers-reduced-motion`.
3. **Rest of the list**.

### Anti-abuse (CEO 2026-11-10 — DECIDED; server-side only)

1. **Flag** multiple accounts from the **same IP**.
2. After a **confirmed review**, send a **warning**.
3. If it **continues**, **ban**.

Nothing in exported games.

## Hub shop catalogue (PROPOSED — CEO 2026-11-10)

| Section | What | Notes |
|---|---|---|
| **Made with code** | Generative (code-made, JS) sounds and art | Recipes / procedural packs |
| **From the community** | Maker submissions | **Review before listing** |
| **Submit yours** | Button | **Proposed** — review before listing |

Earn-only coins. Recommended card on open (see above).

## Closed / open

| Item | Status |
|---|---|
| Chart rate: 1 vote / 60 min, 12 / UTC day | **DECIDED** (reported via DSK) 2026-11-10 15:03 Europe/London |
| Two charts: Games + Assets; GOTM + AOTM | **DECIDED** (reported via DSK) 2026-11-10 |
| Chart refresh every 24h | **DECIDED** (reported via DSK) |
| Flagged votes count only after approval | **DECIDED** (reported via DSK) |
| Recommended (>100 all-time) | **DECIDED** (reported via DSK) |
| Same-IP → flag → warn → ban | **DECIDED** CEO 2026-11-10 |
| Coin amounts | **PLACEHOLDERS** |
| One vote per item per month (withdrawable same month) | **DECIDED** (profile-format r2 §9) |
| Asset-usage vote prompt (§9.7.1) | **PROPOSED** shell |
| Own sound via `project.audio.bindings[]` | **PROPOSED** audio-format r1 §3.7 |
