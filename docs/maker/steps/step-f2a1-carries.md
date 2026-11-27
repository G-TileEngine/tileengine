# step-f2a1-carries: the F1 carries: the On label, the Budgets icon, F-b's three icons, the dead `.card.new` (maker overhaul plan F2a, first half; EA split, 27 Nov)

Step id: step-f2a1-carries          Revision: r1 (EA kit, 2026-11-27, for QA's kit review)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: main **`8791cecc056e87281514ac0fee0b7dd4aa57a9dc`**, docs-only on the **ART1a merge `5e668961`** (PR #115, tree `1593f6ea`). Checked from a fresh `/tmp` clone: green on `8791cecc` is **1194 pass, 0 fail**, all checks OK; `5e668961..8791cecc` adds only `docs/qa/step-art1a-r2-review.md`. If main has moved by the go, CoS re-checks that the move is docs-only and that the trial patch applies.
Branch: step/step-f2a1-carries-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-f2a1-carries-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the code head sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-f2a1-carries/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- F1 (merged, `b6c3da0e`) and its record `docs/rebuild/step-f1.md` (sha256 `af2213b9…`): L154, L156, L162 and "QA non-blockers carried forward" L207–L212, which name every item here.
- `docs/maker/steps/step-f1-look-kit.md` r3b (sha256 `9d7ecff2…`): "Not in this step" L186 (Budgets icon) and L193 (a) (the On label).
- QA's F1 reviews: `docs/qa/step-f1-handback-review.md` (sha256 `823a5e62…`) F-b and "Carries to F2a"; `docs/qa/step-f1-r2-review.md` (`cb0cd581…`) L25 and L28; `docs/qa/step-f1-kit-r3b-check.md` (`75f8add7…`) L25 and "Carries for F2a"; `docs/qa/step-f1-kit-r3-recheck.md` L57 (`.card.new`).
- `docs/maker/style-spec.md` r2 (sha256 `8765d849…`): § 7 Icons (budgets is in the set), shot `f02-game-menu.png` (`2111ba98…`, the Budgets row's icon).
- `docs/maker/ux/maker-overhaul-plan.md` (sha256 `97cbf0ba…`, on the base): L70 (the F2a row; EA's split is in "Size" and in the proposed plan delta CoS holds).
- Format: none read or written (tile-project 6, stage 2, no bump). No play, export or `map.tile` change.
Read first: BUILD_GUIDE.md §2.2, §6, §7; `docs/rebuild/step-f1.md` L150–L165 and L205–L216; the F1 guide's Rulings 4b and 5 and its "Not in this step"; style-spec § 7 Icons.
Kit: r1, 2026-11-27. Trial commit `37493459ac526743c2cbd5876ad6a778aa6dfb88` on `8791cecc` (tree `d202af4bd5199c4c3f781cae32d26a6b1a7b73c1`). Checked on a fresh GitHub clone: `f2a1-trial.patch` passes `git apply --check` on `8791cecc` and gives the same tree. Green **1198 pass, 0 fail** (1194 + 4), all checks OK. `tsc -p tools/tsconfig.json` shows only the 3 base errors. Plants **12/12** caught. Counted **124** lines (+107/−17). Smokes on that tree, all 25 solo at 390 and 360 (s6a and s6c edited by ruling, see Smoke lines): s0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6 ok, all PASS (s11b on port 8840, because 8820 was taken on EA's box; no re-runs). Export audit not run (no play, export or build file changes). EA's look-check shots (Budgets row closed and open at 390 and 360, the unit page's rename at 390) are on the box (`/workspace/share/f2a/trial-shots/`, not pushed). Rule 8 scan of the trial diff: clean.
Carries: none filed. This step closes F1's F2a carries except the Budgets row's move into ☰ and the eyebrows, which go with F2a2's sheets (see Not in this step).

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
F1 left five small items for F2a (step-f1.md L207–L212). F2a's plan row (land on the map: ☰ sheet, stage switcher, project page deleted, 14 smokes and 2 tests rebased) is 340–390 lines on its own (plan EA-3), so with the carries F2a is about 460–510, over 400. EA splits it: **F2a1** (this step) clears the carries that don't need the new layout; **F2a2** is the plan row. After F2a1:
- every framed-pill toggle's On option is announced as `{label}: On`, matching Off's `{label}: Off` (UX 16:45);
- the Budgets row's button leads with UX's budgets line icon, and `budgets-11c1.test.ts` still pins its four aria-hidden meters, now by name;
- the stage error screen's Back, the unit page's rename button and the read-only/newer levels card carry the icon or thumb F1's Rulings 5 and 6 named (F-b);
- `app.css` loses the dead `.card.new` selector.
No handler, saved data, format, layout or play change.

## Where step-f2a1-carries sits (placement card)
1. No new screen. Lives at: the toggles on Rules, View, Autosave here and On your team; the project page's Budgets row; the stage error screen; the unit page; the project page's levels card · tap path: unchanged.
2. Changes or replaces: one aria-label per toggle; one icon each on four existing buttons or cards; one CSS selector removed.
3. Seen at once: the Budgets icon, the edit icon before the unit's name, the back icon on the error screen, the levels thumb on the read-only card. The On label is heard, not seen.
4. Data path: none (no file read or written changes) · read by Test/play: nothing · demo data: unchanged · pictures: none.
5. Usable on landing: yes; nothing new to learn.
6. Proof: the shipped test's pins, 12 plants, the 7 re-pinned smoke lines and EA's trial shots (box only).

## Rulings
1. **The On label** (UX ruled 2026-11-27 16:45; F1 guide L193 (a)): in `seg()` (`tools/maker/widgets.ts` L10) the On option's name becomes `` `${label}: On` ``; Off keeps `` `${label}: Off` ``. Nothing else in `seg()` changes: exactly one option pressed, only the unset option carries `data-act`, the visible words stay "Off" and "On". Every call site (knob toggles, Grid lines, Autosave here, On your team) gets it through `seg()`.
2. **The 7 smoke lines** (F1 guide L193 (a); QA r3b check L25): each `[aria-label="On your team"]` in `s6a-win-rules/smoke.mjs` L54, L60, L62 and `s6c-checkpoint/smoke.mjs` L57, L62, L63, L69 becomes `[aria-label="On your team: On"]`. Nothing else in those lines or files changes. Each is 2 counted lines (14 in all).
3. **Dead CSS** (QA F1 kit r3 recheck L57): `app.css` L8 `.card.new, .choice[aria-pressed="true"] {` becomes `.choice[aria-pressed="true"] {` with its body unchanged. No markup has used `card new` since F1 (F1's test pins that).
4. **The Budgets icon** (F1 QA kit must-fix 2; F1 guide L186; style-spec § 7): `icons.ts` gains one entry after `resize`, UX's drawing from shot `f02`, byte for byte: `` budgets: `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`, `` (stroke only, no fill). `budgets.ts` imports `icon` (`import { icon } from "./icons.ts";` after the `project-files.ts` import) and its button becomes `` …aria-expanded="${open ? "true" : "false"}">${icon("budgets")}${summary}</button> ``. The icon is `aria-hidden`, so the button's accessible name stays the summary ("Budgets: all good").
5. **The budgets test keeps its intent, re-pinned by ruling** (F1 guide L186: "re-pins the test by ruling"): `tests/project/budgets-11c1.test.ts` L124 and L127 counted every `aria-hidden="true"` in the row (`.split('aria-hidden="true"').length === 5`), meaning "the four meters are hidden". The icon is a fifth, correct, `aria-hidden`. Each count becomes a count of hidden meters: `(open.match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length === 4` on L124 and the same on `view()` on L127. That is the test's stated intent ("an aria-hidden meter" per row), now exact; the shipped test also pins the total of 5 hidden nodes (4 meters plus the icon), so neither half can drift. The Budgets row stays where 11c1 put it; F2a2 moves it, icon and all, into ☰.
6. **F-b's three placements** (F1 Rulings 5 and 6; QA F1 handback review F-b; step-f1.md L162): (a) the stage error state (`stage.ts` L142): `data-act="s:back">Back</button>` → `` data-act="s:back">${icon("back")}Back</button> ``, as the normal stage bar's Back (L150) already is; (b) the unit page's rename button (`units.ts` L108): `` data-act="u:rename">${esc(name)}</button> `` → `` data-act="u:rename">${icon("edit")}${esc(name)}</button> ``; (c) the read-only/newer levels card (`levels.ts` L24): `` <div class="card"><p> `` → `` <div class="card">${thumb("levels")}<p> ``, as the Off, older and normal cards (L25–L27) already are. The icons are `aria-hidden`; no button's name or text changes. CoS's V1 fourth (read-only Save) is already present (QA F1 r1) and is not touched.
7. **The F1 test edits, by ruling**: `tests/tools/f1-look-kit.test.ts` L94 pins the off toggle's exact HTML; its On option's `aria-label="Wipe wins"` becomes `aria-label="Wipe wins: On"`. L105's two regexes `aria-label="Grid lines(: Off)?"` become `aria-label="Grid lines: (Off|On)"` (the On option no longer has the bare name). Nothing else in that file changes. The F1 kit folder's copies (`handoff/steps/tests/step-f1-look-kit/`) are history and are not edited; its plants P20 and P24 no longer apply after this step, which is expected.
8. **Rule 8 (BUILD_GUIDE; QA Ruling 8):** one statement per line in all new code; no chained control headers: each header gets its own line and a braced body, and only an innermost `for (…) oneStatement;` or a braceless `if (…) continue;` / `if (…) return x;` may stay on one line. Type-literal members separated by `;` are not statements. The edits inside existing dense lines (Rulings 1, 3–7) are the only changes in those lines; never pack a new statement onto an existing line.

## Files to create or change
| File | What | Trial / cap |
|---|---|---|
| `tools/maker/widgets.ts` | L10, Ruling 1 | 2 / 2 |
| `tools/maker/app.css` | L8, Ruling 3 | 2 / 2 |
| `tools/maker/icons.ts` | +1 after L17, Ruling 4 | 1 / 1 |
| `tools/maker/budgets.ts` | +1 import, L39, Ruling 4 | 3 / 3 |
| `tools/maker/stage.ts` | L142, Ruling 6a | 2 / 2 |
| `tools/maker/units.ts` | L108, Ruling 6b | 2 / 2 |
| `tools/maker/levels.ts` | L24, Ruling 6c | 2 / 2 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | L54, L60, L62, Ruling 2 | 6 / 6 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | L57, L62, L63, L69, Ruling 2 | 8 / 8 |
| `tests/project/budgets-11c1.test.ts` | L124, L127, Ruling 5 | 4 / 4 |
| `tests/tools/f1-look-kit.test.ts` | L94, L105, Ruling 7 | 4 / 4 |
| `tests/tools/f2a1-carries.test.ts` | the kit's file, verbatim | 88 / 88 |
| **Total** | 12 files | **124 / 124** |

(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.) Every edit is quoted exactly, so the caps are the trial's counts; there is no headroom to spend.

Size: the trial changes **124** lines (+107/−17) in 12 files (count: `git add -N . && git diff --numstat <base> -- . ':!handback/**' ':!package-lock.json'`, QA's G7). Not counted: the kit folder (pushed by CoS before the go). **F2a split (EA):** F2a's plan row is 340–390 (plan L70, EA-3) and F2a's carries add about 120, so F2a as one step is about 460–510, over 400. F2a1 is this step (124); F2a2 is the plan row plus the eyebrows and the ☰/switcher/close/chevron/check icons (about 350–400; sized by its own trial). The proposed plan lines are in EA's plan delta (held by CoS; UX owns the plan).

Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Smoke lines
All 25 smokes PASS solo at 390 and 360 (ports as in the 11c1 guide; s11b on 8820, or 8840 if 8820 is taken). Two are edited by ruling, nothing else in them: `s6a-win-rules/smoke.mjs` L54, L60, L62 and `s6c-checkpoint/smoke.mjs` L57, L62, L63, L69 (Ruling 2). The toggles are still tapped by their act (`tap(page, "t:team")`, s6c L57), which sits on the unset option, so each tap still flips the value; the re-pinned lines read the On option's `aria-pressed`, as before. The touch smokes (s0, s3) and every smoke's 48 px check pass at 390 and 360. The export audit is not required: F2a1 touches no play, export or build file.

## Existing tests changed by ruling (and only these)
- `tests/project/budgets-11c1.test.ts` L124 and L127 (Ruling 5).
- `tests/tools/f1-look-kit.test.ts` L94 and L105 (Ruling 7).

## Tests that prove it is done
Copy `handoff/steps/tests/step-f2a1-carries/tests/tools/f2a1-carries.test.ts` to `tests/tools/f2a1-carries.test.ts` **verbatim** (sha256 `a86157f71502edef041511d399aa96c77099e199dbf6823e3f46889eaea93eff`, 88 lines). Four tests; all four fail on the base:
- "F2a1 toggles: the On option's aria-label is "{label}: On", matching Off's "{label}: Off" (UX 16:45), on every framed-pill toggle, and the 7 smoke lines read the new label": the knob toggle off and on, `seg("On your team", …)`, View's Grid lines, and the two smokes (3 and 4 new selectors, no old one).
- "F2a1 dead CSS: app.css has no .card.new (no markup uses it since F1); the picked .choice rule stays as it was".
- "F2a1 Budgets icon: UX's budgets line icon (shot f02) leads the Budgets row's button; the button's words, its act and the four aria-hidden meters are unchanged": the exact SVG; closed and open rows; 4 hidden meters and 5 hidden nodes.
- "F2a1 placements (F1 carry F-b): the stage error state's Back has the back icon, the unit page's rename button has the edit icon, and the read-only levels card has the levels thumb".
(You may add tests. The hand-back lists the shipped file's sha256, unchanged.) Floor: **1194 + 4 = 1198**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-f2a1-carries/plants-f2a1.py` (sha256 `a39479a632527ad6310766321223f86c840b8fed234047bef22f1b421795cadc`, 31 lines), run from the repo root on a clean F2a1 tree: **12/12 caught** in the trial. P1 the On option keeps the bare label (the F1 form); P2 the On option says Off; P3 a smoke line still reads the old label; P4 the dead `.card.new` selector back; P5 the Budgets row without its icon; P6 the Budgets icon after the words; P7 a different budgets drawing; P8 the budgets icon filled; P9 the stage error state's Back without the icon; P10 the rename button without the edit icon; P11 the read-only levels card without its thumb; P12 the picked choice rule loses its ring border. Each plant is one exact edit; the script asserts it applies once and restores the file. Its anchors are the next section's lines, so keep them verbatim. If a plant doesn't apply, report it; don't edit the script.

## Plant anchors (quoted exactly; each appears exactly once in its file)
- `tools/maker/widgets.ts`: `` ${opt("On", on, `${label}: On`)} ``
- `tools/maker/app.css`: `.choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }`
- `tools/maker/budgets.ts`: `${icon("budgets")}${summary}</button>`
- `tools/maker/icons.ts`: `<ellipse cx="12" cy="6" rx="7" ry="3"/>` · ``7-3v-6"/>`,``
- `tools/maker/stage.ts`: `data-act="s:back">${icon("back")}Back</button><h1>Stage</h1>`
- `tools/maker/units.ts`: `data-act="u:rename">${icon("edit")}${esc(name)}</button>`
- `tools/maker/levels.ts`: `` "newer") return `${head}<div class="card">${thumb("levels")}<p> ``
- `handoff/steps/tests/s6c-checkpoint/smoke.mjs`: the whole L63, ``      await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("04-hero");``

## Example
QA opens the demo, goes to a unit and turns on a screen reader: the team toggle reads "On your team: Off" and "On your team: On". The unit page shows the pencil before the unit's name. The project page's Budgets row shows the stack icon before "Budgets: all good"; tapping it still lists the four rows. A broken stage link opens the error screen with "← Back". A newer project's levels card shows the star thumb.

## Decisions note: what to name
- Any deviation from the quoted edits (there should be none).
- The smoke runs (25 solo at 390 and 360) with their ok counts, and any re-run of a known flake (s3 step 9, s8c steps 1–3).

## QA checklist (what QA will check)
- The diff is exactly the 12 files and the quoted edits; the counted total is 124.
- The shipped test is byte-identical; green ≥ 1198, 0 fail; tsc base errors only; plants 12/12.
- The 25 smokes pass solo; s6a and s6c differ from the base only in the 7 selectors.
- Rule 8 scan clean (no new packed statements, no chained headers).
- No play, export, build or format file touched.

## Do not touch
- `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `tools/maker/home.ts`, `tools/maker/project.ts`, `data/`, `fixtures/`, the format docs, `docs/maker/**`, `painter-proto`, `ui-shell`; plus BUILD_GUIDE §7's never-edit list.
- The root `package.json`, `package-lock.json`; any smoke or test not listed above; the F1 and ART1a kit folders.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1198** tests passing, 0 failing.
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors: `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L93 twice (TS7053).
- [ ] The shipped test is byte-identical to its listed sha256; `plants-f2a1.py`: 12/12 caught, tree clean afterwards.
- [ ] All 25 smokes PASS solo at 390 and 360, with only the Smoke lines edits.
- [ ] `git diff --name-only <base>` lists only the 12 files in Files (plus `handback/**`); each within its cap; **124** counted lines.
- [ ] Rule 8 (Ruling 8): no new statement packed onto a line, no chained control headers.
- [ ] `cd handoff/steps/tests/step-f2a1-carries && sha256sum -c SHA256SUMS` passes (you didn't change the kit).
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above, with § Green (code head and tree, test counts), § Plants, § Smoke (all 25, ok counts), § Rule 8 scan, § Size and § Helpers & self-review.

## Not in this step (carries, with their target step)
- **F2a2 (land on the map, plan L70):** opening a game on the stage editor; the ☰ game menu and stage switcher sheets; the project page deleted; Budgets (with this step's icon) and Build game moved into ☰; 14 smokes and 2 tests rebased. Also: **eyebrow section headers** (UX 15:4x; style-spec § 7; shot `f03` shows "STAGES" in the switcher), with the sheets that have groups; the **icons for ☰, the stage switcher (down), close, chevrons and the picked check** (F1 guide L190; UX's drawings are in the f01–f03 mocks).
- **F2b:** `+ Add ability`'s plus icon (UX 16:45; F1 guide L194 (b)).
- **F4:** the § 7 `.chips` wrap row, the tool-bar icons, the unit page's 72×72 thumb.
- **ART1b** (unchanged; not F2a's): the manifest hash order, `rgb()` `#rrggbb`, `?? [0, 0, 0]` at `sprite.ts` L55 and L71, the ramp bound.
- `map.tile` and the tile-size setting: **F3a**.

## Out of scope
- Any layout move, sheet, route or screen (F2a2, F2b, F4), the map's look (F3a, F3b), any art.
- Any project, format, play or export change.

## Open questions
1. (UX) The F2a split and the F2a2 row are EA's proposal; UX owns the plan lines (EA's `PLAN-LINES.md` / `PLAN-DELTA.patch`, held by CoS). F2a2's kit sizes it with a trial.
2. (UX) Eyebrows: style-spec § 7 says "above each group in a sheet or page". EA reads that as F2a2's sheets (the switcher's "STAGES" in `f03`) plus any group header UX names on today's sheets (units' "Start from a role", levels' "XP to reach each level"). UX to list which existing headers become eyebrows before F2a2's kit.
