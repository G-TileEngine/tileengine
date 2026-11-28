# Rebuild record: step F2a2a, the game menu kit (six icons, the sheet/row/eyebrow/grabber CSS, and `tools/maker/game-menu.ts`: the ☰ game menu, the stage switcher, the section sheets, menuView/menuSet; nothing imports the module except the shipped test)

Original brief: [`docs/maker/steps/step-f2a2a-menu-kit.md`](../maker/steps/step-f2a2a-menu-kit.md) on the merge (kit r1, blob `6b39cb70`, sha256 `c8d29a8317f454a974eff38f57105bfc948735bbbfb42ddd7e3ae62f586be8e2`, 177 lines). Step id L3; Base L5; Branch L6; F2a2b follows on this merge L7; Delivery L8; Hand-back L9; Depends on L10–L16 (plan L71/L86/L87, step-f1 L207–L212, step-f2a1, style-spec L71/L73/L76/L77/L91–L93, UX 00:22 and EA 01:37); Read first L17; Kit L18; F1 plants P20 and P24 stay dead L19; Carries L20; Goal L24–L25; Placement card L27–L33; Rulings L35 (1 the eyebrows L36, 2 the six icons L37, 3 rows and sheets L45, 5 the menu view L46; there is no ruling numbered 4; L48 is MenuHost's budgets and build fields, mounted as given, citing F2a2b Ruling 4); Files L50 (icons after L18 at L51; app.css after base L74 at L61; game-menu.ts at L79); Caps L129–L137; Kit and plants L139–L142 (5 tests, 16 plants; P17–P22 need F2a2b); Acceptance L144–L151; Must NOT L153–L154; Open points L156–L164 (points 1–8 only); Places that change if UX re-rules the eyebrow L166–L171; EA trial record L173; Hand-back sections L176. Count command L129 (against `ce848f57`, the guide's named trial base). The hard gate is **129** counted lines, 4 files, each file at its trial count (L133–L137).

Kit (pushed before the go in `fa401c88`, the same commit as the base): `handoff/steps/tests/step-f2a2a-menu-kit/`, exactly 3 files, no `*.r0` copies; its `SHA256SUMS` (blob `f2e9ee90`, sha256 `3913bad9988117b25b03b43361f8fe45b60483ff2797d395f5e110368e0647ae`, 2 entries) covers the other two. It holds the shipped test `tests/tools/f2a2-menu-kit.test.ts` (sha256 `22bb52ea63b29cd37fb10b3a0a31e949c3c66478684200541b1d0c1e72514077`, 65 lines, 5 titles) and `plants-f2a2a.py` (blob `fbb31f91`, sha256 `d38040f16b4a7ea4960b19b5edcd272ea6621417042d9a547563a3747aa629cb`, 36 lines, 16 plants). Box only, never pushed: the go-line paste `/workspace/share/f2a2a/step-f2a2a-paste-final.md` (sha256 `79958f74ce916810546ef16d2b3402e5c87e6bf28175815422642d348e8ce092`, 12 lines; L1 is exactly `export GH_BUILDER_TOKEN=<PASTE TOKEN HERE>`, L2 the helper-agents line; the original 11-line paste `/workspace/share/f2a2/step-f2a2a-paste.md` is sha256 `8bb3b29e7ceb89097094112c074654f17c2f467197153e26f7f7ff438aabc760`); the trial `f2a2a-trial.patch` (sha256 `b6c9007a61df316e2c44b0facaaee88640c17483098b9246c13293d3c4214ffe`; trial commit `3b408883` on `ce848f57`, tree `5687d21b`; `git am` on the go-line base `fa401c88` gives tree `66355177`); EA's look-check shots stayed on the box (not pushed). `SPLIT.md` is also box only, at `/workspace/share/f2a2/SPLIT.md` (see (d)): the plan was not edited in this kit push.

This is **F2a2a**, the first half of plan L71's F2a2 after an EA split (2026-11-28 01:37 London). Plan L71 on the merge is still the unsplit F2a2 row ("Land on the map", 340–390 plus about 10); UX has not updated the plan. The CEO 03:53 order line is unchanged at L86. L87 is the earlier 27 Nov F2a → F2a1 + F2a2 proposal note, not this F2a2a / F2a2b split. F2a2 as one step was 485 counted lines, which breaks the 400 cap, so EA ran it as F2a2a then F2a2b (`SPLIT.md`). F1 left a fifth F2a bullet in [`docs/rebuild/step-f1.md`](step-f1.md) L207–L212, sha256 `af2213b9…`, the fifth bullet at L212: eyebrow headers and the icons for ☰, the stage switcher, the tool bar, close and chevrons (F2a, F4). This step ships the six icons, the sheet CSS (including the one eyebrow) and the module, with no caller yet (guide L12, L25). F2a2b wires them, lands on the map and deletes the project page; the tool bar's icons stay with F4. F1 kit plants **P20 and P24 stay dead** (guide L19; F2a1 Ruling 7 already killed the On-label pins they plant against). Nothing changes in a handler, saved data, the format, layout on screen, play or `map.tile`.

Sources: PR #117 (one branch, one round; https://github.com/G-TileEngine/tileengine/pull/117).
- Branch: `step/step-f2a2a-menu-kit-r1-chatA` (code head `8458307c`, tip `995dcc9d`; no force-push).
- Hand-back, on the merge: `handback/step-f2a2a-menu-kit/r1/HANDBACK.md` (HB1, blob `092f7c07`, 93 lines, sha256 `f55c5ab34cbf4a45077a68a5872d69f3efa645747d3f76e3896e1bfbae3a939a`). The same folder also has `changed-files.txt`, `checks-output.txt`, `stat.txt`, `test-output.txt` and `typecheck-output.txt`. No shots (EA's trial shots stayed on the box).
- CoS verify (box): `/workspace/share/step-f2a2a-verify/pr-body.md` and `report-short.md` (V1, identical, sha256 `ad490078c3befba24c98189a4437edc39d01fafdef2ef0a6c2dd43a9d3d32433`): READY FOR PR; CoS did not re-run the 25 smokes.
- QA docs:
  - Kit, pushed with the kit in `fa401c88`: `docs/qa/step-f2a2-kit-review.md` (QK1, blob `5ee362be`, 23 lines, sha256 `851c88d65385064cf55480a4f3ff82d5a9e0f18d03fdc91b467448bc66ec66f3`). Covers F2a2a and F2a2b r1. **F2a2a: OK TO SEND**, no must-fix (QK1 L5–L10). One non-blocking nit (L10; see (d)). The F2a2b r1 must-fixes in the same document (L12–L16) are not this step.
  - `docs/qa/step-f2a2a-build.md` on `fd87b913` (QA1, blob `75c65473`, 23 lines, sha256 `f02a92f930ff0e7fd5891bae48c8b9582d1590cf802d2f2b7c624bd23ae3ddd5`): **OK TO MERGE**, expected tree `e8f9f255`, floor 1203, no pin. Smokes not re-run here (ran earlier; QA1 L17). One carry (L22; see carries).

Line cites use HB1, V1, QK1 and QA1. Product line cites are at merge `1a6d16a4` (tree `e8f9f255`) unless said otherwise. After-merge docs (QA1, the F2a2b r2 guide and its kit review) are cited at `fd87b913`.

## (a) Start and finish

| | Value |
|---|---|
| Kit | `fa401c886f494265460d1fd313fb8d22264369b4`, 01:59 (UK time, 28 Nov), tree `4097b30d`, on `ce848f57` (the F2a1 record): the guide, the 3-file kit folder and QK1. No plan edit. QK1 **F2a2a: OK TO SEND**, no must-fix. Test-neutral: `npm test` collects `tests/**/*.test.ts` only; the kit folder is not collected. Floor on this tree **1198** |
| Base | The same commit `fa401c88`. The guide names `ce848f57` as its trial base (L5); main moved by this kit-and-review commit (docs and handoff only) before the go. CoS confirmed the trial patch applies on `fa401c88` (tree `66355177`; the same product on `ce848f57` is tree `5687d21b`; the two trees differ only by docs/handoff). Floor **1198** tests, 1198 + 5 = **1203** after this step |
| r1 commits | `8458307cfb59e95f6bd261d295fbd738f3f5ad8a` feat(maker): step F2a2a menu kit (r1 code head, tree `663551775f1a48beab73be237f248404e457bfb4` = the trial tree on this base, 2026-11-28 02:13 UK time), then `995dcc9d74611e6622d5940f5166988c3a1ab910` docs(handback): step F2a2a menu kit r1 (tree `e8f9f255b4c9dce08b2ff0895992d3432ce9b3e5`, 02:15; 6 files under `handback/step-f2a2a-menu-kit/r1/`). Linear on the base, noreply author and committer |
| r1 verdict | Green **1203/0**; tools tsc only the 3 base errors; plants 16/16, tree clean after; 4 files, **129 / 129**, every file on its trial cap; shipped test sha256 `22bb52ea…` byte-identical to the kit; kit `sha256sum -c` passes; Rule 8 scan clean (HB1, V1, QK1, QA1). HANDBACK reports all 25 smokes PASS solo at 390 and 360, first pass (s11b on 8820); CoS did not re-run them. CoS V1: READY FOR PR. PR #117 opened 02:59 UK time (28 Nov). QA1 **OK TO MERGE**, expected tree `e8f9f255`, floor 1203, no pin |
| Merge | PR #117 (opened 02:59, merged 03:02), merge commit `1a6d16a41424c4aa2c9b175b810f5594228f37df`, 2026-11-28 03:02 (UK time). Tree `e8f9f255b4c9dce08b2ff0895992d3432ce9b3e5` (the tree CoS and QA expected). First parent `fa401c886f494265460d1fd313fb8d22264369b4`, second parent `995dcc9d74611e6622d5940f5166988c3a1ab910`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #117: Step F2a2a: game menu kit (icons, sheet CSS, game-menu.ts)`. `merge-pr.sh --expect-tree e8f9f255`: npm test on the merge **1203 pass / 0 fail** |
| After the merge | `fd87b91301f2b0eb6e890126d155ffa7919ad7bc` (03:03, tree `2dd2ec3c`) adds QA1 plus the F2a2b r2 kit (guide, 3-file kit, SHA256SUMS) and `docs/qa/step-f2a2b-r2-kit-review.md`. Docs and handoff only; the four product files are unchanged |
| Postmerge | QA's own postmerge: **PASSED**; F2a2a closed (QA's message to CoS; not in the repo). CoS did not run `qa-postmerge.sh` when this record was written |
| Tests | 1198 + N=5 (the five shipped tests in `tests/tools/f2a2-menu-kit.test.ts`) = **1203 pass / 0 fail**. The floor after this merge is **1203** |

## (b) Files

From `git diff --name-status fa401c88..1a6d16a4 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` against the merge's first parent, which is also the base `fa401c88`. Caps are the guide's Caps table (L133–L137), equal to the trial counts.

| File | Status | ins / del | cap | Counted? |
|---|---|---|---|---|
| `tests/tools/f2a2-menu-kit.test.ts` | A | 65 / 0 | 65 | yes. **65**, on cap (sha256 `22bb52ea63b29cd37fb10b3a0a31e949c3c66478684200541b1d0c1e72514077`) |
| `tools/maker/app.css` | M | 14 / 0 | 14 | yes. **14**, on cap |
| `tools/maker/game-menu.ts` | A | 44 / 0 | 44 | yes. **44**, on cap |
| `tools/maker/icons.ts` | M | 6 / 0 | 6 | yes. **6**, on cap |
| **Total** | 4 files | 129 / 0 | 129 | **129** |

What the merge does not touch:
- Nothing under `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `tools/maker/home.ts`, `tools/maker/stage.ts`, `tools/maker/project.ts`, `data/`, `fixtures/`, the root `package.json` or `package-lock.json`, `docs/maker/**`, any other test or smoke, `ui-shell`, or the F1, ART1a, F2a1 or F2a2a kit folders (V1, QK1, QA1). `painter-proto`, named in the guide's Must NOT (L154), does not exist in the repo.
- No new dependency, no committed PNG, no handler or saved-data change, no `map.tile` or tile-size setting change, no new eyebrow text and no other header converted (Ruling 1 (c)).
- No existing test or smoke file is edited. The only new test is the shipped file, copied verbatim from the kit. Nothing under `tools/maker/**` imports `game-menu.ts`; the only import in the product tree is `tests/tools/f2a2-menu-kit.test.ts` L6 (QA1 L18; Must NOT L154). CSS attribute selectors on `[data-sheet="game-menu"]` and the kit's own copy of the test under `handoff/` are not imports.

The official count at the code head against the base, or at the merge against first parent `fa401c88`, is **4 files changed, 129 insertions(+), 0 deletions(-)** = **129**, at the limit of 129 (the hard gate). Every file is on its trial cap (HB1 § Size, V1, QA1).

## (c) Key code and git commands

**Ruling 1, the eyebrows** (UX 00:22, binding; style-spec L73). The stage switcher's "STAGES" is one eyebrow: `tools/maker/game-menu.ts` L40 is `${head("Stages")}<p class="eyebrow">Stages</p>`. The markup text is "Stages"; the uppercase look is the CSS rule. The ☰ game menu has no eyebrow: `gameMenu` (L26–L31) uses `head(host.name)` as the h2 (the game's name) and then the eight flat rows. `class="eyebrow"` appears exactly once in `tools/maker/**` (the shipped test pins it). Units' "Start from a role", Levels' "XP to reach each level" and the unit page's "Abilities" stay h2.

**Ruling 2, the six icons.** `tools/maker/icons.ts` appends six stroke-only entries after `budgets` at L18, byte for byte as the guide quotes them at L53–L58. On the merge they are L19–L24: menu, down, close, chevron, check, games. The grabber is CSS, not an icon.

**Ruling 3, rows and sheets** (style-spec L77; shots f02, f03). `tools/maker/app.css` appends fourteen lines after the last rule on the base (L74). On the merge they are L75–L88: `.eyebrow` L75, `.grabber` L76, then `.sheet-head`, `.sheet-head.bare`, `.list-row` and the flat look for the Budgets and Build rows inside ☰ (`[data-sheet="game-menu"] .stage-row`), and the ☰ and switch buttons in the stage bar (`.topbar .btn.icon.bare`, `.topbar h1 .switch`, `.switch > span` L88). Every sheet is `scrim[data-sheet] > .sheet[role=dialog] > .grabber` then a `.sheet-head` (h2 + close). The ☰ rows are `.list-row` buttons. The switcher's picked row shows the check; the others a blank 24 px `.slot` (L35).

**Ruling 5, the menu view** (the guide has no ruling numbered 4). New module `tools/maker/game-menu.ts` (44 lines). `MenuView` L4 is `"none" | "menu" | "switch" | "units" | "effects" | "levels"`. `menuSet` (L10–L15) throws `maker: no menu view ${next}` when the name is not one of those six (L12–L13; Law 12, no silent fallback). `sectionSheet` (L42–L43) wraps a body in `menu-${name}` with a bare close head. Names avoid the existing `data-sheet` values ("effects", "levels", "menu"). Guide L48: `MenuHost`'s `budgets` and `build` fields are HTML strings F2a2b fills; here they are only mounted as given between Levels & XP and Save (F2a2b Ruling 4).

The Effects row meta is `String(host.effects)` on L30 (same line as the Units meta `String(host.units)` and the eight-row list). See carries, Open point 9.

**Shipped tests:** the five titles in `tests/tools/f2a2-menu-kit.test.ts` (65/65, verbatim, sha256 `22bb52ea…`): the six drawings byte for byte; the game menu's h2, 8 rows in order, no eyebrow, a grabber and a 48 px close; the switcher's h2 "Stages", one eyebrow "Stages", the check and the blank slot; the exact eyebrow and grabber rules, used once in the maker; `menuSet` throws on an unknown view (Law 12).

```
# Full product diff against the merge's first parent (also the base):
#
#   git diff fa401c88 1a6d16a4 -- . ':!handback/**' ':!docs/**'
#   (the 4 files in (b))
#
# The hand-back (not in the 129):
#   git show 1a6d16a4:handback/step-f2a2a-menu-kit/r1/HANDBACK.md
#
# Product gate. Official command at the code head against the base, or at
# the merge against first parent fa401c88:
#
#   git diff --shortstat fa401c88..HEAD -- . ':!handback/**' ':!package-lock.json'
#   4 files changed, 129 insertions(+)
#
# Named tests (npm test 1203/0, floor 1198 + N=5): the five "F2a2 …" titles of
# tests/tools/f2a2-menu-kit.test.ts.
#
# tools tsc (npx tsc --noEmit -p tools/tsconfig.json): only effect-designer
# page.ts L101 (TS18047) and maker home.ts L93 (×2, TS7053).
#
# Plants: handoff/steps/tests/step-f2a2a-menu-kit/plants-f2a2a.py (d38040f1),
# 16/16 caught at the code head (HB1, V1, QA1), tree clean after:
# P1–P16 as guide L142 (the menu or check icon drawn differently; a games
# square with rounder corners; Effects before Units; an eyebrow in the game
# menu, or the switcher without its eyebrow, or the eyebrow typed in capitals
# / not uppercased by CSS / wrong letter-spacing; the picked stage without
# the check, or the others getting an icon instead of a blank slot; menu rows
# without the chevron; sheets without the grabber, or the grabber in the muted
# colour; an unknown menu view silently ignored; the sheet close borderless).
# P17–P22 need F2a2b's wiring and live in F2a2b's kit (guide L142).
#
# Smokes: no smoke file changed. All 25 solo at 390 and 360, required
# (guide L148, HB1 § Smoke). HANDBACK reports first-pass PASS, ok counts
# matching the guide, s11b on 8820. CoS did not re-run them at verify.
# QA1 did not re-run them at review (ran earlier, QA1 L17). Export audit
# not required (no play, export or build file).
```

## (d) What went wrong, in order, and the fix

1. **No must-fix.** One round, no rework. QK1 **F2a2a: OK TO SEND**; QA1 **OK TO MERGE**; postmerge **PASSED**.

2. **The go-line base moved.** The guide names `ce848f57` as Base (L5) and counts against that commit (L129, L173). CoS had already pushed the kit and QK1 to `fa401c88` (docs and handoff only on `ce848f57`) before the paste went out, and told the builder to branch from `fa401c88`. The trial applies on both; product trees `5687d21b` (on `ce848f57`) and `66355177` (on `fa401c88`) differ only by docs/handoff. HB1 L86 records the move. No product difference.

3. **Plan L71 is still the unsplit F2a2 row.** UX has not updated the plan. The F2a2a / F2a2b split is the EA ruling of 2026-11-28 01:37 London (485 counted as one step breaks the 400 cap), recorded in box-only `/workspace/share/f2a2/SPLIT.md`. QK1 L3 cited that file as sha256 `80b8f9fb…` and said the plan row edit stays with UX. The box file is now sha256 `857b8701de1e2a888b67c8aac61c884366057efb4fc12f1b8534a9f304bac386`, 15 lines, after a later F2a2b r2 note was appended; do not treat `80b8f9fb…` as the current box file. Do not treat plan L87 as this split: L87 is the earlier 27 Nov F2a → F2a1 + F2a2 proposal.

4. **QK1 L10, non-blocking:** `sectionSheet(name: MenuView)` also accepts `"none"`, `"menu"` and `"switch"`; a narrower type would be better in a later touch. Unchanged at the merge (QA1 L22). Carried.

5. **QK1 L16 was a must-fix on F2a2b r1, not on F2a2a:** the Effects row meta reads a number where f02 shows "10 built-in", and that difference was not yet under Open points (the F2a2a guide's Open points, L156–L164, are points 1–8 only). F2a2b r2 listed it as Open point 9 (see carries). No F2a2a rework.

## (e) Do it right first time

- Cite line numbers at the merge named in the record, not at a later docs commit or a pre-split tree. A plan row that has been split still reads as the old step until UX edits it; do not cite L71 as an F2a2a row, and do not cite L87 as the F2a2a / F2a2b split.
- When main moves by a docs-and-handoff kit push before the go, name both the guide's trial base and the go-line base, and record both trial trees if they differ only by docs/handoff.
- Box-only files can gain later notes. Record the hash QA cited and the current hash if they differ (`SPLIT.md`).
- F1 plants that a later ruling already killed stay dead; do not "fix" them in this step (guide L19).
- Nothing imports a new module until the wiring step. The shipped test is the proof (Must NOT L154). Leave `home.ts`, `stage.ts` and `project.ts` untouched.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only docs and the F2a2b
# r2 kit/review at fd87b913):
#   git diff 1a6d16a4 HEAD -- <the 4 files in (b)>
#   (empty)
#
# Product gate at the merge against first parent fa401c88:
#   git diff --shortstat fa401c88..1a6d16a4 -- . ':!handback/**' ':!package-lock.json' ':!docs/**'
#   4 files changed, 129 insertions(+)
#
# Green: npm ci && npm run green → 1203 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L93 ×2).
# Kit: cd handoff/steps/tests/step-f2a2a-menu-kit && sha256sum -c SHA256SUMS → OK.
# Shipped test: sha256sum tests/tools/f2a2-menu-kit.test.ts → 22bb52ea….
# Plants: python3 handoff/steps/tests/step-f2a2a-menu-kit/plants-f2a2a.py → 16/16 caught, tree clean.
# Smokes: all 25 solo at 390 and 360; no smoke file differs from the base.
# Imports: the only product-tree import of game-menu.ts is tests/tools/f2a2-menu-kit.test.ts.
```

## QA non-blockers carried forward

- **To F2a2b** (guide L7, L25, L142, plan L71 still the unsplit row): wiring `game-menu.ts` into the maker, landing on the map, deleting the project page, moving Budgets (with F2a1's icon) and Build game into ☰, rebasing the tests and smokes (open point 6, guide L162: 4 tests and 21 of 25 smokes in the trial, not the plan's 2 and 14). Open points 1–8 in the F2a2a guide (L157–L164) stay listed for QA/UX: Budgets/Build mounted as they are (F2a2b Ruling 4; adding a chevron would re-pin `tests/tools/f2a1-carries.test.ts` L69, budgets-11c1 and export-11a); Continue stays a ghost button under the ☰ rows; stage rows have no "Map · cols×rows" meta; landing goes to the first stage (F2b adds the last stage edited); non-picked switcher rows have a blank 24 px slot; tests and smokes rebased as above; the stage bar keeps its existing second row until F4; "Can't play yet" on the stage is the banner with Dismiss. P17–P22 live in F2a2b's kit.
- **UX Open point 9, Effects meta "10 built-in" vs the count** (text in this step's `game-menu.ts` L30, `String(host.effects)`; later step). QK1 L16 first flagged it on F2a2b r1 (then unlisted). F2a2b r2 lists it as Open point 9 for UX in `docs/maker/steps/step-f2a2b-land-on-map.md` L479 on `fd87b913` (sha256 `4ed8d0ea…`, 492 lines). QA's F2a2b r2 kit review (`docs/qa/step-f2a2b-r2-kit-review.md` L20, sha256 `330e8f45…`) marks that listing **CLEARED** (UX rules on the copy later). F2a2a is closed; a later touch can change the phrase. This is not in the F2a2a guide's Open points (L156–L164 are 1–8 only).
- **`state.problems` has no reader:** after F2a2b r2's travel fix the field is still written and nothing renders it. Remove it in a later step. F2a2b guide L20 on `fd87b913`; QA r2 review L27 (accepted). F2a2a did not introduce this.
- **QA non-blocker, unparsed project:** if the menu ever shows on an unparsed project, show "–" instead of 0 for the unit and effect counts (`unitCount` / `effectCount`). QA's F2a2b r2 review L30. The F2a2a module only renders `String(host.units)` and `String(host.effects)` (L30); the counters are F2a2b's.
- **`sectionSheet` type** (QK1 L10, QA1 L22): `sectionSheet(name: MenuView)` also accepts `"none"`, `"menu"` and `"switch"`. A narrower type in a later touch.
- **To F2b:** `+ Add ability`'s plus icon (UX 16:45; `docs/rebuild/step-f2a1.md`). Landing on the last stage edited (F2a2a open point 4, L160).
- **To F3b:** pictures in thumbnails and chips; the terrain chip's swatch or picture (`docs/rebuild/step-f1.md`).
- **To F4:** the § 7 `.chips` wrap row; the tool-bar icons; the unit page's 72×72 thumb; the stage bar's second row (View, Background, Rules, Start new, Test) until F4's tool bar (open point 7, guide L163).
- **To ART1b:** the manifest hash order; `rgb()` `#rrggbb` only; drop both `?? [0, 0, 0]` black fallbacks in `sprite.ts`. On main the lines are L59 and L75 (see `docs/rebuild/step-art1a.md` and `docs/rebuild/step-f2a1.md`).
- **F1 kit plants P20 and P24 stay dead** (guide L19). The F1 kit folder was not edited and stays as history.
- **Unchanged:** the F0c, 11a, 11a2, 11b and 11c1 carries stand (`docs/rebuild/step-f1.md`).
- **Closed here:** the six icons, the fourteen CSS lines (eyebrow, grabber, sheet head, list rows, ☰/switch buttons), and `tools/maker/game-menu.ts` with no caller except the shipped test; the fifth F2a bullet in step-f1.md L212 as far as shipping those parts (wiring stays with F2a2b; the tool bar stays with F4); F1 plants P20/P24 confirmed still dead.

## Blob check

Each file must have exactly this git blob id at `1a6d16a4`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tests/tools/f2a2-menu-kit.test.ts` | `7b9c7ecba92909605303723fb511d2413a50f746` | 65 |
| `tools/maker/app.css` | `f1a84320e8af6b504631ff854cc88c249a79b841` | 88 |
| `tools/maker/game-menu.ts` | `7b689224abd78e216f03dbf8ee63bee30928c639` | 44 |
| `tools/maker/icons.ts` | `c93de4fd56bd6e2412398d88c6e8810872ce2ad9` | 29 |

## Appendix: full code as merged (step F2a2a, PR #117)

New files are `git show 1a6d16a4:<path>` in full. Edited files are `git diff fa401c88 1a6d16a4 -- <path>`, which is the same as against the base `fa401c88`.

### `tests/tools/f2a2-menu-kit.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { gameMenu, menuSet, menuView, stageSwitcher } from "../../tools/maker/game-menu.ts";
import { ICON_NAMES, icon } from "../../tools/maker/icons.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const read = (rel: string): string => readFileSync(join(root, rel), "utf8");
const maker = readdirSync(join(root, "tools/maker")).filter((name) => name.endsWith(".ts")).map((name) => read(`tools/maker/${name}`));
const HOST = { name: "Quest", stages: 2, units: 3, effects: 1, budgets: '<button type="button" class="btn ghost stage-row" data-act="b:row">B</button>', build: '<button type="button" class="btn ghost stage-row" data-act="build">G</button>', dirty: true, readOnly: false, resume: false };
const ROWS = [{ id: "stage_a", name: "Cave" }, { id: "stage_b", name: "Town" }];
const acts = (html: string): string[] => [...html.matchAll(/data-act="([^"]*)"/g)].map((hit) => hit[1] ?? "");
const DRAW: Record<string, string> = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  down: '<path d="M7 10l5 5 5-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  games: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
};

test("F2a2 icons: UX's six drawings, byte for byte, in the icon set (UX ruling 00:22)", () => {
  for (const [name, draw] of Object.entries(DRAW)) {
    assert.ok((ICON_NAMES as readonly string[]).includes(name), name);
    assert.equal(icon(name as Parameters<typeof icon>[0]), `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${draw}</svg>`);
  }
});

test("F2a2 game menu: h2 is the game's name, 8 flat rows in UX's order, no eyebrow, a grabber and a 48px close", () => {
  const html = gameMenu(HOST);
  assert.match(html, /^<div class="scrim" data-sheet="game-menu"><div class="sheet" role="dialog"><div class="grabber"><\/div><div class="sheet-head"><h2>Quest<\/h2><button type="button" class="btn icon" data-act="m:close" aria-label="Close">/);
  assert.deepEqual(acts(html), ["m:close", "m:switch", "m:units", "m:effects", "m:levels", "b:row", "build", "save", "m:games"]);
  assert.deepEqual([...html.matchAll(/<span class="grow">([^<]*)<\/span>/g)].map((hit) => hit[1]), ["Stages &amp; maps", "Units", "Effects", "Levels &amp; XP", "Save", "My games"]);
  assert.equal(html.split(DRAW.chevron ?? "").length - 1, 6);
  assert.ok(html.includes(`${DRAW.games}</svg><span class="grow">My games</span>`));
  assert.equal(html.includes("eyebrow"), false);
  assert.equal(html.includes("btn primary"), false);
  assert.ok(gameMenu({ ...HOST, resume: true }).endsWith('<button type="button" class="btn ghost" data-act="continue">Continue</button></div></div>'));
});

test('F2a2 stage switcher: h2 "Stages", one eyebrow "Stages", the picked stage shows the check, the others a blank slot', () => {
  const html = stageSwitcher(ROWS, "stage_b", false, "<p>TAIL</p>");
  assert.ok(html.includes('<div class="sheet-head"><h2>Stages</h2>'));
  assert.deepEqual([...html.matchAll(/class="eyebrow">([^<]*)</g)].map((hit) => hit[1]), ["Stages"]);
  assert.ok(html.includes('data-act="stage:stage_a" aria-current="false"><span class="slot"></span><span class="grow">Cave</span>'));
  assert.ok(html.includes(`data-act="stage:stage_b" aria-current="true"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${DRAW.check}</svg><span class="grow">Town</span>`));
  assert.ok(html.endsWith("<p>TAIL</p></div></div>"));
  assert.equal(stageSwitcher(ROWS, "stage_b", true, "").includes("r:menu:stage:"), false);
});

test("F2a2 eyebrow: the exact rule, used once in the maker; the grabber is CSS", () => {
  const css = read("tools/maker/app.css");
  assert.ok(css.includes(".eyebrow { margin: 4px 0 0; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }"));
  assert.ok(css.includes(".grabber { flex: none; width: 40px; height: 4px; border-radius: 999px; background: var(--line); align-self: center; }"));
  assert.equal(maker.join("").split('class="eyebrow"').length - 1, 1);
});

test("F2a2 menu view: only the six named views; anything else throws (Law 12)", () => {
  menuSet("switch");
  assert.equal(menuView(), "switch");
  assert.throws(() => menuSet("project"), /maker: no menu view project/);
  menuSet("none");
});
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index bc1f0b2..f1a8432 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -72,3 +72,17 @@ button.card.ability-add { flex-direction: column; align-items: flex-start; }
 .seg-opt { min-height: 48px; margin: -5px 0; padding: 0; border: 0; background: transparent; color: var(--ink); font-weight: 700; }
 .seg-opt > span { display: inline-flex; align-items: center; height: 30px; margin: 0 4px; padding: 0 12px; border-radius: 8px; }
 .seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }
+.eyebrow { margin: 4px 0 0; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
+.grabber { flex: none; width: 40px; height: 4px; border-radius: 999px; background: var(--line); align-self: center; }
+.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
+.sheet-head.bare { justify-content: flex-end; }
+.list-row { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 0 4px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); font-weight: 700; text-align: left; }
+.list-row > .ico, .list-row > .slot { width: 24px; color: var(--muted); }
+.list-row .grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
+.list-row .meta { color: var(--muted); font-size: 0.82rem; font-weight: 600; }
+.pair { display: flex; align-items: center; gap: 8px; }
+[data-sheet="game-menu"] .stage-row { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 4px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); text-align: left; }
+[data-sheet="game-menu"] .stage-row > .ico { margin: 0; color: var(--muted); }
+.topbar .btn.icon.bare { border-color: transparent; }
+.topbar h1 .switch { display: inline-flex; align-items: center; gap: 4px; max-width: 100%; min-height: 48px; padding: 0; border: 0; background: transparent; color: var(--ink); font: inherit; }
+.switch > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

### `tools/maker/game-menu.ts` (new)

```ts
import { icon, type IconName } from "./icons.ts";
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export type MenuView = "none" | "menu" | "switch" | "units" | "effects" | "levels";
const VIEWS: readonly MenuView[] = ["none", "menu", "switch", "units", "effects", "levels"];
let view: MenuView = "none";
export function menuView(): MenuView {
  return view;
}
export function menuSet(next: string): void {
  const found = VIEWS.find((item) => item === next);
  if (found === undefined) {
    throw new Error(`maker: no menu view ${next}`);
  }
  view = found;
}
export type MenuHost = { readonly name: string; readonly stages: number; readonly units: number; readonly effects: number; readonly budgets: string; readonly build: string; readonly dirty: boolean; readonly readOnly: boolean; readonly resume: boolean };
const close = `<button type="button" class="btn icon" data-act="m:close" aria-label="Close">${icon("close")}</button>`;
const modal = (name: string, inner: string): string => `<div class="scrim" data-sheet="${name}"><div class="sheet" role="dialog"><div class="grabber"></div>${inner}</div></div>`;
const head = (title: string): string => `<div class="sheet-head"><h2>${esc(title)}</h2>${close}</div>`;
const count = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
function row(act: string, glyph: IconName, name: string, meta: string): string {
  const tail = meta === "" ? "" : `<span class="meta">${esc(meta)}</span>`;
  return `<button type="button" class="list-row" data-act="${act}">${icon(glyph)}<span class="grow">${esc(name)}</span>${tail}${icon("chevron")}</button>`;
}
export function gameMenu(host: MenuHost): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = host.readOnly ? `<button type="button" class="list-row" disabled title="${esc(reason)}">${icon("save")}<span class="grow">Save</span>${icon("chevron")}</button>` : row("save", "save", "Save", host.dirty ? "Unsaved" : "Saved");
  const cont = host.resume ? `<button type="button" class="btn ghost" data-act="continue">Continue</button>` : "";
  const rows = [row("m:switch", "stages", "Stages & maps", count(host.stages, "stage", "stages")), row("m:units", "units", "Units", String(host.units)), row("m:effects", "effects", "Effects", String(host.effects)), row("m:levels", "levels", "Levels & XP", ""), host.budgets, host.build, save, row("m:games", "games", "My games", "")];
  return modal("game-menu", `${head(host.name)}${rows.join("")}${cont}`);
}
export function stageSwitcher(rows: readonly { readonly id: string; readonly name: string }[], current: string, readOnly: boolean, tail: string): string {
  const items = rows.map((item) => {
    const lead = item.id === current ? icon("check") : `<span class="slot"></span>`;
    const pick = `<button type="button" class="list-row" data-act="stage:${esc(item.id)}" aria-current="${item.id === current ? "true" : "false"}">${lead}<span class="grow">${esc(item.name)}</span></button>`;
    const more = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(item.id)}" aria-label="Menu ${esc(item.name)}">${icon("more")}</button>`;
    return `<div class="pair">${pick}${more}</div>`;
  });
  return modal("stage-switcher", `${head("Stages")}<p class="eyebrow">Stages</p>${items.join("")}${tail}`);
}
export function sectionSheet(name: MenuView, body: string): string {
  return modal(`menu-${name}`, `<div class="sheet-head bare">${close}</div>${body}`);
}
```

### `tools/maker/icons.ts` (edited)

```diff
diff --git a/tools/maker/icons.ts b/tools/maker/icons.ts
index 0bbe4f5..c93de4f 100644
--- a/tools/maker/icons.ts
+++ b/tools/maker/icons.ts
@@ -16,6 +16,12 @@ const PATHS = {
   plus: `<path d="M12 5v14M5 12h14"/>`,
   resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
   budgets: `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`,
+  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
+  down: `<path d="M7 10l5 5 5-5"/>`,
+  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
+  chevron: `<path d="M9 6l6 6-6 6"/>`,
+  check: `<path d="M5 12l5 5 9-10"/>`,
+  games: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
 } as const;
 export type IconName = keyof typeof PATHS;
 export const ICON_NAMES = Object.keys(PATHS) as readonly IconName[];
```
