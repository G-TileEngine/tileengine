# r72 cleanup plan — QoL, stability, performance (no new features)

**Status:** PLAN ONLY. Do not edit live `ui-shell/index.html` / `js/*` / `css/*`. Do not publish. A build needs the CEO’s SEND.  
**Date:** 2026-11-12, afternoon, Europe/London (GMT).  
**Base:** r71 live (`gh-pages` d25df6b; local `ui-shell` matches). CEO decision 13:25 Europe/London: r72 is a cleanup round only.  
**Audit:** read of the live shell; Playwright probes at 390×844, 768×1024, 1024×768, 1280×800, light and dark; last capture reports for r65–r71; QA checklist and risk register cited below.  
**Probe shots:** `ui-shell/screenshots/72c-*.png` (59 files) and `ui-shell/screenshots/72c-audit-report.json`.  
**QA sources folded in:**  
- `docs/qa/ux-r65-r71-regression-checklist.md` (sha256 `864eacd6…`, 2026-11-12 13:28 Europe/London) — r72’s regression sweep is mapped to this list, because QA will re-run it.  
- `docs/qa/cleanup-risk-register.md` (2026-11-12 13:28 Europe/London) — UX-facing items cited by id below. Engine-only ids are listed as out of shell scope.

---

## Recommendation

**Do in r72 (phone and tablet first, then a simple wide layout):**

1. Break the 390×844 phone frame on tablet and PC (the highest-impact user-facing bug). Full-bleed from 768px up. Keep the bottom rail on tablet portrait. Dock editor sheets as a side panel, as Sprite Studio already does. Ask the CEO before building a left side-rail on landscape / PC (see questions).  
2. Fix silent save / storage / upload holes: visible quota and OPFS failures, corrupt-JSON recovery with a plain-words note, upload type and size checks, and a real “restore from the export file” path if the CEO wants it in this round (otherwise later). This is the UX side of risk-register **#3, #5, #8** and part of **#10**.  
3. Consistency pass: replace leftover jargon, unify Back controls, cap sheets at 40% on the phone, tidy Coming-soon and Home “prototype / catalogue” copy.  
4. Performance trims, no new features: do not block first paint on the 767 KB behaviour catalogue; lazy-load converter / studio / social / stage-live until those screens open; keep Home’s first payload small. This is the UX side of risk-register **#11**.  
5. Fix the capture_67 `#ic-go-corner` timeout (mostly a test vs r68 detector mismatch; confirm the pink-hint rule with the CEO) and close the automated gaps on QA’s r65–r71 checklist so their re-run is against the live tree, not `/tmp/pages`.

**Leave for later (r73+ or the engine stability step):**

- Engine risk-register **#1, #2, #6, #7, #9, #12–#19** (sim `submit` / `packAction`, chaos-gen, painter @1, depcruise, law greps, notice typography). These are not shell UX.  
- Risk **#4** pack / DSK / unsigned-sandbox live validation, and risk **#10** real-device painter self-test + slim export audit — track them, don’t try to close them inside the editor shell.  
- Full left side-rail information architecture if the CEO wants a second pass.  
- Multi-tab live merge, unsaved-document dialogs beyond a simple leaving warning, and a production backup product if export/import is deferred.  
- Rewriting `app.js` (258 KB) into modules; that’s a stability risk if bundled with the layout work.

**Effort:** **L overall**, about **4–6 working days** if the wide layout is “full-bleed + docked sheets + keep the bottom rail,” and the rest stays S/M. Add **1–2 days** if a left side-rail ships in the same round. Risk of the package is **medium** (layout CSS is the touchy part; storage and copy changes are smaller).

---

## Top-ranked fix list (plain words)

Each item: problem, evidence, fix, effort (S/M/L), risk.

### 1. Tablet and PC still live inside a 390px phone frame — **L, risk M**

**Problem.** On a tablet or a PC the app is a small rounded phone, letterboxed on a dark desk, except on Sprite Studio and the Welcome quiz (those two already go full-bleed from 768px). The stage grid, Home globe, shop, profile and almost every other screen stay 390px wide. That wastes space, keeps the grid cramped, and fights the locked shell rule (canvas / grid ≥ 75% when sheets are closed).

**Evidence.**  
- `css/app.css`: `.app` is `width: min(100%, var(--phone-w))` with `--phone-w: 390px`. Full-bleed media queries exist only for `#screen-sprite-studio` and `#screen-welcome`.  
- Probes: at 768×1024 the app is 390×844 (50.8% of the width). At 1024×768 it is 390×736 (38% wide). At 1280×800 it is 390×768 (30.5% wide). Sprite Studio on the same sizes is 100% of the viewport.  
- Shots: `72c-tablet-port-light-home.png`, `72c-tablet-land-light-stage.png`, `72c-pc-light-home.png`, `72c-pc-light-stage.png` (and the dark pairs).

**Proposed layout (locked shell, phone first):**

| Width | Shell | Rail | Sheets | Canvas / grid |
|---|---|---|---|---|
| Phone, &lt; 768px (390×844 remains the design target) | Full bleed, no device chrome | Bottom rail, 72px + safe area | Bottom sheet, **≤ 40%** of app height | **≥ 75%** of app height when the sheet is closed |
| Tablet portrait, ≥ 768px (incl. QA’s 820×1180) | Full bleed, thin top bar stays | **Keep the bottom rail** (thumbs still reach) | Dock as a **right-hand panel** (~360px, same pattern as Sprite Studio). 40% height no longer applies; the panel may use most of the column. | Remaining column, **≥ 75%** of the content width/height |
| Tablet landscape / PC, ≥ 1024px | Full bleed, thin top bar | **CEO question:** keep the bottom rail, or move it to a **left side rail** (icon + short label, 48px+ targets). Recommendation: side rail on this band only, if he agrees. | Right-hand panel, not a bottom sheet | Remaining stage ≥ 75% |

Do not invent a second visual language. Reuse r62 tokens, 48px targets, AA contrast, light and dark. Home globe should use the extra width (larger radius, more of the ring readable) rather than sitting as a lonely card in a 390px column.

### 2. First load is heavier than it needs to be — **M, risk M** (risk-register **#11**)

**Problem.** Opening Home already downloads the converter, Sprite Studio, the social hub, stage-live and the full behaviour catalogue, even if the user only wanted to flick the globe. Risk-register **#11** already says performance is noted, not budgeted; the shell is the place users feel it.

**Evidence.** (localhost, 390×844, `?noquiz`, `72c-audit-report.json`)

| Measure | Now |
|---|---|
| Requests | 27 (17 JS, 7 CSS, 1 image, 1 fetch, plus document) |
| Transfer / encoded | **~2.02 MB / 2.01 MB** (no gzip on the local static server; a host with gzip will be smaller, but the catalogue and scripts still parse) |
| JS on disk | **1,093,153 bytes** in 17 files (`app.js` 258 KB is the largest) |
| CSS on disk | **145,541 bytes** in 7 files (`app.css` 89 KB) |
| Biggest request | **`data/behaviours.json` 766,881 bytes**, fetched in `init()` via `loadCatalogue()` *before* the first screen is shown |
| Time to interactive (localhost) | Navigation timing `domInteractive` 46 ms, wall 587 ms. This will be much worse on a mid-range phone over the network. |
| Long tasks after first navigation | two, ~60–63 ms (under 100 ms here; catalogue parse will dominate on device) |
| Images | almost none (`ashroad-v1-tiles.png` 1.8 KB). Not the problem. |
| localStorage on a first run | **`tileengine.social.v1` is 114,009 characters** (~228 KB UTF-16) seeded immediately. After a normal boot, profile + social ≈ 114,507 characters. |

Coverage tools were not available in this Playwright build, but whole feature files (social, imagine-convert, convert-engine, body-map, sound-panel, welcome) are parsed on Home and then unused. That is the unused-JS story.

**Fix.** No new features: lazy-load `imagine-convert.js` / `convert-engine.js` / `sprite-studio.js` / `social-*.js` / `stage-live.js` / `sound-panel.js` until their screen opens; cache the catalogue (drop `cache: "no-store"` unless the rev changes) and defer the 767 KB fetch until a screen needs behaviours; don’t seed the full social demo graph until the hub is opened, or shrink the seed. Keep a small “Loading…” state. Re-measure TTI, request count and long tasks on 390×844 after the trim. Do not start a bundler rewrite in r72.

### 3. Saves can fail in silence; there is no restore story — **M, risk M** (risk-register **#3, #5, #8, #10**)

**Problem.** The editor mostly writes to OPFS and localStorage. If the disk is full, OPFS write fails, or a JSON blob is corrupt, the user often sees nothing. Export is a JSON placeholder with no matching Import. Closing the tab never warns. Two tabs can overwrite each other. This is the editor-facing side of **#3** (tampered / corrupt project and save files), **#5** (hostile or odd input is not handled the same at every door), **#8** (no general string cap; huge names can be stored), and **#10** (export work is still on the shelf).

**Evidence.**  
- `ProjectStore.persist`: on OPFS failure it sets `opfsNote = "OPFS write failed — keeping project in memory this session."` `persistProject()` in `app.js` does **not** toast that after first open (`/* soft note already toasted on open */`).  
- `social-store.save`, `ProfileStore.save`, prefs and welcome library all `catch (_) {}` on `QuotaExceeded`. Probe filled localStorage (threw at key `__q51`) and a following prefs save showed **no toast**. Shot context: `72c-audit-report.json` → `storage.quota`.  
- Corrupt `tileengine.profile.v1` (`{broken`): `ProfileStore.load()` already catches and returns defaults, so the shell still boots (`72c-phone-corrupt-profile-boot.png`). The broken string is **left in storage**, there is no “We couldn’t read your profile, so we started a fresh one. Your old file was kept as a backup.”  
- No `beforeunload` and no `window` `storage` listener. Last tab write wins.  
- `#btn-export-project` calls `ProjectStore.exportPlaceholder` and toasts “Export downloaded (JSON placeholder)”. There is **no import control**.  
- Size warning exists at 2048 KB (“Nothing is blocked”) but there is no backup prompt when we know a write failed.  
- No autosave indicator (no “Saved just now”).

**Fix.**  
- One shared “couldn’t save” toast in plain words (quota full / disk failed / profile was damaged), and write a timestamped backup key when JSON parse fails, then reset to defaults.  
- Surface `opfsNote` after mid-session persist failures, not only on open.  
- A small “Saved” / “Saving…” / “Not saved on this device” chip on stage and studio (Basic adds zero extra taps).  
- `beforeunload` only when a persist has failed or a write is in flight.  
- Optional **r72** if the CEO agrees: Import next to Export, with a named failure (not a throw) for junk files — this is also how we start closing **#3** on the shell side. If he says later, keep the placeholder label honest (“Download a copy”) and do import in r73.  
- Multi-tab: at least a toast “This project is open in another tab; reloading to avoid a clash.” Full merge is later.

### 4. Uploaded files are barely checked — **S, risk L** (risk-register **#5, #8**)

**Problem.** The Imagine converter accepts `image/*` and reads whatever was picked as a data URL. A huge or non-image file is only caught when `Image.onerror` fires (“That file didn’t open as a picture”). There is no byte or pixel cap here (the social reference picker *does* cap PNG/WebP at 4 MB and 4096 px). A 1e6-character name can be stored (**#8**).

**Evidence.** `imagine-convert.js` `onFile` has no `file.type` / `file.size` check. `index.html` `#sprite-file` is `accept="image/*"`. Social hub is the good pattern to copy (`social-store` `referenceMaxBytes` / `referenceMaxPx`).

**Fix.** Same rules as the social reference: PNG, WebP and JPEG, 4 MB, 4096 px, plain-words errors. Cap stored names (unit, project, part, request title) to a modest length. Do not change the convert pipeline.

### 5. Screens don’t speak in one voice — **S–M, risk L**

**Problem.** Most of the shell is calm r62, but leftovers from earlier rounds still show through: engine jargon, mixed Back buttons, some sheets slightly over 40%, a few Coming-soon rows, and Home still calling itself a prototype.

**Evidence.**  
- Unit editor still shows “null team_colour = inherit the side palette (rev 9 / L30).” and “unit-roster.clip_cues — for units without clips.” (`index.html` around the team-colour / hit-flash blocks). Shot: `72c-phone-unit-editor-jargon.png`. This is the same jargon `capture_69` / `69q-audit-report.json` flagged (44 jargon hits).  
- Back controls: most screens use a labelled **Back** button; Sprite Studio and the converter use **‹** only (`aria-label` “Back to the stage editor” / “Back to Sprite Studio”); Welcome / Starter use “‹ Back”. 59 screens inventoried in the probe.  
- Sheets at **41.7%** in the r69 QoL audit: stage More, unit sheet (scrolled / after a chip / after save / dark), sound, walls (Advanced), stage Advanced. Locked rule is ≤ 40% on the phone.  
- Coming soon still visible: Profile “Upload… Coming later”; Special Meter in the behaviour picker (`69q-audit-report.json`).  
- Home About: “Catalogue snapshot `data/behaviours.json`…” plus “Prototype shell — taps navigate screens…”.  
- Dark theme tokens generally hold up (`72c-phone-dark-*.png`, `72c-pc-dark-*.png`). Toasts use `ink` on `bg`, which inverts correctly in dark. No new contrast failures in the last r65–r71 touch audits.

**Fix.** Rewrite the two unit-editor hints in plain words (“Use the side’s colours” / “A short flash when this unit is hit”). Pick one Back pattern (labelled “Back”, 48px, with a clear `aria-label`) and use it everywhere, including Studio and the converter. Trim the over-40% sheets on the phone (content already scrolls). Keep Coming-soon, but one treatment, disabled, never a silent control. Soften or hide the catalogue / “prototype” lines behind Advanced, or drop them from Home.

### 6. capture_67 times out on `#ic-go-corner` — mostly a test bug, with one UX question — **S, risk L**

**Problem.** `scripts/capture_67.py` builds a pink fairy on a magenta backdrop, converts it, then does `tap("#ic-go-corner")`. Playwright waits for that button and times out when the pink banner never appears, so `#ic-go-corner` is not in the DOM.

**Root cause.**

1. **The button is created only when the pink banner is shown.** `banner()` in `imagine-convert.js` requires `R.pink === true` and the current key to be magenta (or a user-chosen key). If `R.pink` is false, the banner stays `hidden` and there is no `#ic-go-corner`. That is not a click-intercept or a 48px-target bug; a force click also fails because the node does not exist.  
2. **r68 tightened `pinkInside()`** (OKLab distance to `#FF00FF`, skip “flat” key colour, require a share of interior pixels). The same official fixtures already disagree between rounds, in the last `68-touch-audit-report.json`:

   | Fixture | r67 banner | r68 banner |
   |---|---|---|
   | `magenta-fairy-magenta.png` (`magentaFairy`) | shown | **still shown** |
   | `pink-fairy-magenta.png` (`pinkFairyOnMagenta`) | shown | **`pink: false`, banner `null`** |
   | `winged-knight-purple-magenta.png` (`purpleKnight`) | shown | **`pink: false`, banner `null`** |

   So after r68, a “pink sprite on magenta” does **not** always get the hint — by design of the tighter detector, or as a regression of the hint. The r67 capture was never updated.  
3. **The r67 recipe is also fragile.** It paints mint→magenta in the page, then calls `sample('fairy')`, then swaps the file input and converts. If the swap is late or the detector returns `pink: false`, the same timeout happens. This plan’s probe hit that path: result `{ pink: false, used: "magenta" }`, banner hidden, `tap("#ic-go-corner")` timed out at 8 s. Shot: `72c-phone-pink-hint.png` (converted fairy, **no** pink banner).  
4. The last **full** `67-touch-audit-report.json` on this tree still recorded the hint text and 0 errors — so the timeout is **intermittent** on the synthetic path, and **deterministic** if someone points the script at the official `pink-fairy-magenta.png` under r68 rules.

**Verdict.** **Primarily a test bug** (capture_67 still assumes the pre-r68 hint). **Possible UX bug** if the CEO still wants the hint on `pink-fairy-magenta.png` (a pink character keyed with magenta). `magentaFairy` still shows the hint, so the feature is not dead.

**Fix.**  
- Update `capture_67.py` (and any combo that copies this tap) to use the official fixtures, assert the banner **when `pink` is true**, and skip or assert-absent `#ic-go-corner` when `pink` is false. Prefer `wait_for_selector` with a diagnosis dump over a blind 30 s click.  
- Ask the CEO (question 2) whether `pinkFairyOnMagenta` / `purpleKnight` should still get the hint. If yes, relax `PINK_NEAR` / `PINK_SHARE` or treat “magenta key + obvious pink in the original” as enough; that’s a small UX fix, not a feature. If no, document the r68 rule and keep the test in line.

### 7. Empty, error and “nothing here” states are uneven — **S, risk L**

**Problem.** Some lists already explain themselves and offer a next step. Others never appear empty because the demo project or the social seed always has rows. Failed import and “storage full” have no screen.

**Evidence.**  
- Good: inbox (“Nothing yet. Follow a creator…” + Find creators), Sprite Studio start (“Your library is empty” + Make some for me / Starter Pack — `72c-phone-empty-studio.png`), presets (“No presets yet.”), several social empty cards.  
- Seeded, so “empty” is hard to see: Made games and the shop (`72c-phone-empty-library.png` is a full library of demo games), unit list shows Warrior A / Mage B on the demo project (`72c-phone-empty-units.png`), stage select already has Floor 1.  
- Missing: a failed project import (there is no import), a quota-full screen, a “we couldn’t read this file” after a bad picture (only a toast), a damaged-profile note (see item 3).

**Fix.** Keep the good empty copy. Add a true empty for “your” made games when the user has none (seeded demos can stay in a Recommended row). Add one shared failure card for import / quota / corrupt, with a next step (try another file, download a copy, reset this bit of data). Do not invent new product flows.

### 8. XSS and hostile text in the shell — **S, risk L** (risk-register **#5, #8**)

**Problem.** Names and titles from the user (and from seeded social data) are interpolated into HTML. Most recent code escapes; it is not consistent, and there is no string cap (**#8**).

**Evidence.** `social-hub.js` and `qol-r69.js` use a local `esc()`. `app.js` uses `escapeHtml` in many summaries, but a full pass was not finished in this audit (the live XSS probe could not reach `state` from `page.evaluate`). `innerHTML` appears ~138 times across `js/`. Avatar art in the hub is treated as trusted HTML. Catalogue / seed data is local, but project names, part names and request titles are user text.

**Fix.** One shared `escapeHtml` used at every `innerHTML` of user or file-derived text; prefer `textContent` where possible. Cap name length (item 4). Add a small Playwright check: a unit named `<img src=x onerror=…>` must appear escaped in the unit list. This does not close engine doors in **#5**; it is the shell door only.

### 9. QA’s r65–r71 checklist will not stay green unless the harness points at the live tree — **S–M, risk L**

**Problem.** QA will re-run `docs/qa/ux-r65-r71-regression-checklist.md`. Several of their cited smokes serve **`/tmp/pages`**, not `ui-shell`. A green smoke can be a stale tree. Some checklist items have no automated script at all (see the map below). capture_67’s pink-hint click is a known flake (item 6).

**Fix.** For r72, run the checklist against **this** `ui-shell` (or a freshly synced pages tree whose SHA is recorded). Point the `/workspace/r6x-smoke` ROOT at that tree, or add a one-line “live tree” wrapper. Fill the gaps in the map rather than adding features. Keep `?noquiz` as a test-only flag; a fresh profile without it must still see the welcome quiz (checklist cross-round rule).

---

## Risk register — UX items to carry in r72

Cited from `docs/qa/cleanup-risk-register.md`. “In r72” means a *shell* fix or test, not an engine close.

| Id | Sev | How it shows up in the editor | r72? |
|---|---|---|---|
| **#3** | high | Tampered or corrupt saves / project files. Shell today: corrupt profile boots with defaults and no message; no project import; persist can fail quietly. | **Yes, UX side:** named recovery, backup key, import-or-honest-export (item 3). Engine readers / `restore` stay on the save-slice step. |
| **#4** | high | Shop, social and pack DSK formats not live-validated in engine `src`. Follower counts private by default (`prefs.social.showFollowerCount`) is already ACCEPTED and covered by `capture_70_social.py`. Nothing public until SEND. | **Do not regress** the private follower default. Pack / unsigned-sandbox / coin ledgers are **later / engine**. |
| **#5** | high | Hostile input is not the same at every door. Shell doors: file pickers, `JSON.parse` of localStorage, export placeholder. | **Yes, shell doors only** (items 3, 4, 8). |
| **#8** | med | No general string cap; over-size data can be stored. | **Yes, cap names and upload pixels/bytes** (item 4). |
| **#10** | med | Real-device painter self-test and END-GAME export audit still pending. Device work “on the shelf since 2026-11-09.” | **Partial:** honest export / optional import in the shell if the CEO wants it. The painter self-test and slim-runtime export audit stay **later**. |
| **#11** | med | Performance noted, not budgeted. | **Yes, first-load trims** (item 2). Re-measure on 390×844 after the trim. |

**Out of UX-shell scope (do not take as r72 editor work):** **#1, #2** (`submit` / `packAction` throws), **#6** (sparse `effects`), **#7** (`chaos-gen` live mix), **#9** (painter @1 / `te-classic@1`), **#12** (depcruise), **#13** (`resolvePlacements` caps), **#14–#18** (SE-01 C1–C5), **#19** (law-grep number patterns). Point EA at the register; the shell should not open those files.

---

## Regression sweep — mapped to QA’s r65–r71 checklist

Source: `docs/qa/ux-r65-r71-regression-checklist.md` (sha256 `864eacd6…`). Shared harness (do not invent a new one): Chromium, **390×844**, `device_scale_factor=2`, `has_touch=True`, `is_mobile=True`, `index.html?noquiz` unless the test is the welcome quiz. Also phone-or-tablet shell rules: 48px+ targets, sheets ≤ 40% on the phone, grid ≥ 75% with sheets closed, AA, light and dark. r69 also asks for tablet **820×1180**.

**Status of last reports on this box** (from the r71-era runs already on disk; this plan pass did not re-run the long capture suite, to avoid clobbering `65-`…`71-` PNG goldens — probes used `72c-*` instead):

| Round | Automated script(s) | Last report | Notes |
|---|---|---|---|
| r65 | `ui-shell/scripts/capture_65.py`; `/workspace/r65-live-debug/test_live.py` | `65-touch-audit-report.json`: 0 errors, 0 undersized, 0 contrast | `test_live.py` / combo smoke use `/tmp/pages` (gap). |
| r66 | `ui-shell/scripts/capture_66.py` | `66-touch-audit-report.json`: 0 / 0 / 0, basic taps 3 | Still contains `tap("#ic-go-corner")` (same risk as r67). |
| r67 | `ui-shell/scripts/capture_67.py`; combo `/workspace/r65-r67-combo-test/test_combo.py` | `67-touch-audit-report.json`: 0 / 0 / 0, last run *did* record the pink hint — **flake** | `#ic-go-corner` timeout when `R.pink` is false (item 6). Combo ROOT = `/tmp/pages`. |
| r68 | `capture_68.py`, `capture_68_stage.py`; `/workspace/r68-smoke/smoke.py` | `68-touch-audit-report.json` and `68-stage-audit-report.json`: 0 / 0 / 0; stage repeat 10/10; smoke `ok: true` | Smoke ROOT = `/tmp/pages`. Pink-hint fixtures already show r68 vs r67 disagreement. |
| r69 | `capture_69.py`; `/workspace/r69-smoke/smoke.py` | `69-touch-audit-report.json`: 0 / 0 / 0; `69q-audit-report.json`: **57 issues** (44 jargon, 10 sheet&gt;40, 3 coming-soon); `69p-profile-audit-report.json`: 0 errors; smoke `ok: true` | Tablet 820×1180 is in `capture_69.py`. Jargon / sheet issues still live. |
| r70 | `capture_70_social.py`; `/workspace/r70-smoke/smoke.py` | `70-social-audit-report.json`: 0 / 0 / 0, max sheet 40%, 0 off-device; `70p-audit-report.json`: 0 errors; smoke `ok: true` (includes “r69 still works”) | Follower-count privacy is in the capture, not in the short smoke. Smoke ROOT = `/tmp/pages`. |
| r71 | `capture_71_globe.py`; `/workspace/r71-smoke/smoke.py` | `71-globe-audit-report.json`: 0 errors, all 8 Home opens recorded; smoke `ok: true` | `capture_71_social.py` is **mock-only**, not a live regression. Smoke ROOT = `/tmp/pages`. Flick / haptic / reduced-motion are only lightly automated. |

### Item-by-item map

**r65 — Stage grid, live view**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Tap-to-place (Basic), house in 3 taps, `#live-pop`, close via Close / outside / Esc | `capture_65.py`; `test_live.py`; combo test | Smokes hit `/tmp/pages`. Re-run against live `ui-shell`. |
| 2 | Placed thing: Edit / Move / Delete; NPC Assign behaviour; one undo step | `capture_65.py` (Move ghost, Assign) | Undo mixed with rail strokes is easy to miss — keep a manual or scripted “paint then delete then Undo” check. |
| 3 | Rail still works; popover stays out of the way while a rail tool is on | `capture_65.py` | — |
| 4 | View menu `#btn-stage-view`, blocks / art; Advanced needs tap menus on; fresh Basic has them on | `capture_65.py`; `test_live.py` sections A–C | — |
| 5 | Showcase not auto-present on a fresh profile; welcome quiz without `?noquiz`; Skip = Just exploring (`#wq-skip`) | `test_live.py` (quiz) | **Gap:** `capture_65.py` and most captures use `?noquiz` only. Add one scripted boot *without* `?noquiz` and a Skip path, or keep it as a **manual** first-run check. |
| 6 | Mouse click must not be lost to pointer capture (r64 bug) | mentioned in the r65 plan | **Gap:** captures are `has_touch=True`. Add a **mouse** (`has_touch=False`) click on a tile in `capture_65.py` or a tiny dedicated smoke. |
| 7 | Phone layout 75% / 40% / 48px; tablet: same popovers, bigger tiles, no separate layout (plan §8) | `capture_65.py` audits; r69 later uses 820×1180 | **Conflict with r72 item 1:** the r65 plan said “no separate tablet layout.” r72 *should* introduce a full-bleed tablet shell. Update the checklist when the layout ships so QA doesn’t fail “no separate layout.” Tablet is still inside the 390px frame today (`72c-tablet-*-stage.png`). |
| 8 | Out of round (roles, autotiles, etc.) | — | Do not treat as r72 promises. |

**r66 — Imagine → pixel converter**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Sprite Studio → Import → Convert; real JS; tablet layout; in memory only | `capture_66.py`, `capture_67.py` | Tablet of the converter is still the 390px frame except where Studio itself full-bleeds. |
| 2 | Before/After, original kept, Undo/Redo, Back to original, Parts recolour + rename, 4 ways + Match to master, pink hint, eyedropper | `capture_66.py`, `capture_67.py`, `capture_68.py` | Pink hint: see item 6. **Keep these in the r72 sweep so walk / Keep-as-asset don’t drop them.** |
| 3 | 48px+, `?noquiz` | those captures | — |

**r67 — Study pipeline in the real converter**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Same `convert-engine.js` in app and study; pixel-identical to 66e on mage, knight, fairy at 32 and 64 | claimed in the plan; some exactness in `67-touch-audit-report.json` (`detailKeepExact` 0.9993) | **Gap:** no r72 job currently re-diffs app output to the approved 66e study renders. Add a check or keep a **manual / study-script** step. |
| 2 | Detail chips 16 / 20 / 24; Detail for Crisp and 16-bit only | `capture_67.py` | — |
| 3 | Keep lands in Studio; Standard 100% identical; Detail twin parts | `capture_67.py` | — |
| 4 | Combo: `?noquiz#home` → Standalone → Create → View → empty-tile popover → Studio → `#ss-import-pic` → `#ic-convert` → `#ic-keep` → back to stage | `/workspace/r65-r67-combo-test/test_combo.py` | ROOT is `/tmp/pages`. Point at live `ui-shell` for the r72 sweep. |
| 5 | Re-run `67-touch-audit-report.json` and keep it clean | `capture_67.py` | Fix the `#ic-go-corner` flake first or the sweep will randomly fail. |

**r68 — Walk cycle + fringe tolerance**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Walk from a Body map; auto path Convert → Keep → Walk → Make walk cycle (0 Body-map taps); 3 taps to fix a region; Mirror / “Keep weapon in same hand”; “Needs back view.” | `capture_68.py` | Confirm the “Needs back view.” copy is still asserted (easy to miss). |
| 2 | Tolerance 0 fringe uses at least the tolerance-40 distance + blend; default output unchanged | `capture_68.py` (converter fixes) | Largely pixel-level; keep the r67-vs-r68 route the script already has. |
| 3 | Smoke: `?noquiz#home` → stage → empty-tile → Levels / Stages → Studio → `#ss-import-pic` | `r68-smoke/smoke.py` (`ok: true`) | ROOT `/tmp/pages`. |
| 4 | `68-touch-audit-report.json` | `capture_68.py` | Also run `capture_68_stage.py` (F–K: unit tap menu, 10/10 tile menu, Place on art view, Erase, abilities badge). Not named in the checklist — **keep it anyway.** |

**r69 — QoL**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Behaviour picker: 7 goal tiles, 5 role presets, 3 taps for Heal; Advanced searchable list | `capture_69.py`; `r69-smoke` | — |
| 2 | Unit sheet home = Abilities; tabs; + Add ability; Test and remove (Undo) | `capture_69.py` | — |
| 3 | Basic card applies defaults and returns; Advanced form; no Cancel (Back + Done) | `capture_69.py` | — |
| 4 | Play starts on the stage (Basic) with “Playing Floor 1 · Exit”; loadout is Advanced / More. No full battle runtime. | `capture_69.py` | Do not fail r72 because a fight doesn’t run. |
| 5 | Stages type picker Safe / Battle / Freestyle; “How stages chain”; Safe hides threats; change hides, doesn’t delete; typeless = Freestyle; 6×9 | `capture_69.py`; smoke | — |
| 6 | Keep creates a project asset; “Kept art” in Add here | `capture_69.py` | Plan already notes kept art may draw as a generic prop — don’t treat missing PNG as an r72 fail. |
| 7 | Profile Pictures / Badges / Borders; Achievements + red count; Appearance in View; More → Sprite Studio | `capture_69.py`; `69p-profile-audit-report.json` | — |
| 8 | Smoke path + cosmetics manifest HTTP 200 from the page origin | `r69-smoke` | ROOT `/tmp/pages`. |
| 9 | 48px+, phone 390×844 and tablet **820×1180**, 0 undersized / contrast / JS / off-device | `capture_69.py` (includes 820×1180) | Language / sheet audit (`69q`) still fails on jargon and 41.7% sheets — treat as r72 fixes (item 5), then re-run. |

**r70 — Social hub**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Home → Shop, list not empty | `capture_70_social.py`; `r70-smoke`; `capture_71_globe.py` open-shop | — |
| 2 | Made games list not empty | same | “Empty of *my* games” is untested (item 7). |
| 3 | Bell opens inbox | `capture_70_social.py`; smoke | — |
| 4 | Creators list; open a page; Follow | same | — |
| 5 | Requests board (not a contracts desk) | same | — |
| 6 | r69 still works (wizard, empty-tile, 7-kind picker, avatar panel) | `r70-smoke` explicitly | Keep this habit in the r72 sweep (`r71-smoke` does *not* re-check the editor doors — **gap**). |
| 7 | 48px+, sheets ≤ 40%, Back on full-height inbox / pickers | `capture_70_social.py` | — |
| — | Follower counts **private by default** (CEO S2; risk **#4**) | `capture_70_social.py` (visitor vs opt-in) | **Not in the short smoke.** Keep the capture in the r72 sweep so this doesn’t regress. |

**r71 — Home globe**

| # | Checklist item | Covers it today | Gap |
|---|---|---|---|
| 1 | Globe on Home, 8 options, `#btn-home-view-globe` pressed | `capture_71_globe.py`; `r71-smoke` | Smoke ROOT `/tmp/pages`. |
| 2 | List toggle and back to globe | same | — |
| 3 | Each option opens its target (export stays on Home) | same | — |
| 4 | Touch 390×844; swipe / flick | smoke `ok: true` | **Gap:** smoke / capture do not really drive a flick with momentum, keyboard, haptic, or `prefers-reduced-motion`. `capture_71_globe.py` already has reduced-motion and keyboard shots — **assert them in the sweep**, and add a scripted swipe. Haptic (`navigator.vibrate`) needs a **manual** phone check. |

**Cross-round**

| Rule | Covers it today | Gap |
|---|---|---|
| `?noquiz` is test-only; a fresh profile still sees the welcome quiz | `test_live.py` | Not in later captures. Add one boot without the flag (r65.5). |
| Don’t drop r66 converter basics when walking / Keep-as-asset | r66–r68 captures | Keep them all on the r72 list. |
| r70 and r71 smokes re-check earlier editor doors | r70 smoke does; **r71 smoke does not** | Extend the r72 sweep (or r71 smoke) with the r69 doors. |
| Nothing is a public publish until CEO SEND | this plan | — |

### What to run for the r72 sweep (once a build is approved)

1. Point smokes at the live `ui-shell` (or a pages tree whose SHA is logged).  
2. Fix capture_67 / capture_66 `#ic-go-corner` first.  
3. Automated, in order: `capture_65.py`, `test_live.py` (quiz + tap menus), a new **mouse** tile-click, `capture_66.py`, `capture_67.py`, combo test, `capture_68.py`, `capture_68_stage.py`, `capture_69.py` (390 and 820×1180), `capture_70_social.py`, `capture_71_globe.py`, then live-tree copies of r68–r71 smokes (with r69 doors added to the last one).  
4. Manual / thin automation: welcome quiz without `?noquiz`; globe flick + haptic on a real phone; `prefers-reduced-motion`; one corrupt-storage and one quota-full path; import failure if import ships.  
5. Pass bar: 0 JS errors, 0 undersized 48px targets, 0 AA fails, phone sheets ≤ 40%, grid ≥ 75% closed, 0 off-device requests, checklist items above green or explicitly waived.

---

## Questions for the CEO

1. **Wide layout.** On tablet landscape and PC, should the bottom rail stay, or move to a **left side rail** (icon + short label)? Recommendation: bottom rail on phone and tablet portrait; side rail only from 1024px up, if he agrees.  
2. **Pink hint.** After r68, the official `pink-fairy-magenta.png` (and the purple knight) no longer show “Your sprite has pink in it…”. Is that the rule he wants, or should those pictures still get the hint?  
3. **Export / import.** Export is still a “JSON placeholder” with no way to open it again. Is a real “Download a copy / Restore from a file” pair in **r72**, or later? (This is the shell side of risk **#3** / **#10**.)  
4. **Lazy load.** May r72 load Studio, the converter, the social hub and the 767 KB catalogue only when those screens are opened, so Home starts lighter? No feature is removed.  
5. **r65 “no separate tablet layout.”** The r65 checklist says tablet uses the same layout. r72 needs a full-bleed tablet/PC shell. Is it OK to update that rule so QA doesn’t fail the new layout?  
6. **Engine risks #1–#2, #6–#7, #9, #12–#19** live in the sim / painter / save slice, not in this shell. Confirm r72 (Editor & UX) does not try to close those, and that EA owns them on the stability step.

---

## File paths

| Kind | Path |
|---|---|
| This plan | `ux/r72-cleanup-plan.md` |
| QA checklist (sha `864eacd6…`) | `docs/qa/ux-r65-r71-regression-checklist.md` |
| QA risk register | `docs/qa/cleanup-risk-register.md` |
| Probe report | `ui-shell/screenshots/72c-audit-report.json` |
| Probe screenshots | `ui-shell/screenshots/72c-*.png` (59). Key ones: `72c-phone-light-home.png`, `72c-phone-dark-home.png`, `72c-tablet-port-light-home.png`, `72c-tablet-land-light-stage.png`, `72c-pc-light-home.png`, `72c-pc-light-stage.png`, `72c-phone-pink-hint.png`, `72c-phone-unit-editor-jargon.png`, `72c-phone-empty-studio.png`, `72c-phone-empty-inbox.png`, `72c-phone-empty-library.png`, `72c-phone-corrupt-profile-boot.png`, `72c-phone-dark-toast.png` |
| Last round audits | `ui-shell/screenshots/65-` … `71-*-audit-report.json` |
| Live capture scripts | `ui-shell/scripts/capture_65.py` … `capture_71_globe.py` (plus `capture_68_stage.py`, `capture_70_social.py`) |
| QA smokes (ROOT today = `/tmp/pages`) | `/workspace/r65-r67-combo-test/test_combo.py`, `/workspace/r65-live-debug/test_live.py`, `/workspace/r68-smoke/smoke.py`, `/workspace/r69-smoke/smoke.py`, `/workspace/r70-smoke/smoke.py`, `/workspace/r71-smoke/smoke.py` |

---

## Caveats

- PLAN ONLY. No live shell edits and no publish in this pass.  
- Playwright in this environment has no page-coverage API, so unused CSS/JS is inferred from what is loaded on Home, not from a precise coverage %. Transfer sizes are uncompressed localhost figures.  
- The XSS runtime probe could not hook `state` from the page; the XSS item is from a static read.  
- Last r65–r71 capture reports were not regenerated in this pass (to protect existing `65-`…`71-` PNG goldens). Current status is those last reports plus the new `72c` probes. Several of those last reports are green; `69q` and the pink-hint flake are the known holes.  
- QA smokes that serve `/tmp/pages` must not be treated as proof of the live r71 tree until ROOT is pointed at it.
