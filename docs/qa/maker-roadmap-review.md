# QA review: maker roadmap r1 (`e516848a`)

QA & Build Guard, 2026-11-18, Europe/London. Read-only. File: `/workspace/tileengine/docs/maker/roadmap.md`, 202 lines, sha256 `e516848ae53f53aea02d461f33b568ad01332eb75f15cb2dba419b2f8116ae12` (re-hashed this turn). `git fetch -q origin` in `/workspace/tileengine-repo`: `origin/main` is `aa158fda573aac196965139700e4e9b5fd1bebd5` (PR #77, S1a merged; floor **1034**). No GitHub writes and no edits to the roadmap. This doc is local for CoS to push.

## Verdict: **NOT OK**

Five fixes, each a line edit. Stages 1–2, screen order, the rules of direction, the seven CEO decisions, and the held-local effect-ramps / held-item-motions rows are fine. The two-floor shop EA ruling and the wizard in stage 5 are accepted and are not flagged.

1. **L23–32, standing Done-when applies to every maker step.** “the step ships an openable app page built by `node tools/maker/build.ts <out>`” plus the 390 px shot and handback screenshot cannot apply to S0 (already merged, play-stage only) or Step 1 / 1b (“None (data only)”). `tools/maker/build.ts` is not on origin/main; it is created in Step 2. **Change:** keep “Standing lines for every maker step” for the 400-line cap, `npm test` at floor+N, `scripts/check-law.sh`, `scripts/check-state.sh`, offline / no new dependencies, and 48 px targets. Move the openable-app-page, `docs/maker/shots/` match, and 390×844 screenshot bullets under a new sentence: “From Step 2 on (maker UI steps):”.

2. **Cited sources that are not on origin/main, presented as if they were.** Label them the same way as L192–193.
   - **L12:** after `` `share/maker-spec/ux-plan-2026-11-18.md` `` add `(local / box share, not on main)`. The file is at `/workspace/share/maker-spec/ux-plan-2026-11-18.md` only.
   - **L13:** after `` `/workspace/tileengine/behaviour-library/` `` add `(local, not on main)`. The tree is not in the repo. Catalogue facts check out on the box (`behaviours.json` sha256 `bba8c252…`, rev 29, 65 behaviours, 570 knobs; `gaps.md` is 804 lines).
   - **L196–201** (and L202 if it stays a row): add `(local, not on main)` on each behaviour-library audit path. Stage-table shorthand can stay once the key-source line is labelled.
   - **L87:** `` `rules.ts` `` is not a path on main. Write it as prose (“the anniversary game's rules”), not a repo path.

3. **L195, `` `ui-shell/README.md` `` is not on origin/main.** The only `ui-shell/` tree on main is `ui-shell/mock-effects-v3/` (44 files). The prototype README exists only on the box at `/workspace/tileengine/ui-shell/README.md`. **Change:** add `(local, not on main)`. Do not retarget `ui-shell/mock-effects-v3/README.md` — that file is the v3 mock, not the prototype README. Historical mentions of `ui-shell/mock-art`, `ui-shell/mock-effects` and `app.css` in rewrite reasons (L152, L156) are also box-only; no change required if they stay clearly historical.

4. **L194 mis-marks an on-main path as local.** `` `design-notes/refs/` `` is grouped as `(local)`, but `ux/design-notes/refs/` exists on origin/main (6 files under `ux/design-notes/refs/ai-sprites-ui/`). There is no `docs/maker/ux/design-notes/refs/`. **Change:** split the row:
   - `` `ux/design-notes/refs/` `` | Keep | Reference images left at the pre-move path on main.
   - `` `ux/effects-v2-ref/` ``, `` `ux/ref-btf-acolyte-orbs.jpg` `` `(local, not on main)` | Keep | Reference images only. Held local; decide later.

5. **L101, `docs/audio-module.md` is not on origin/main.** A draft exists only on the box at `/workspace/tileengine/docs/audio-module.md` (EA, 2026-11-09, “Do not put this in handoff yet”). **Change:** the Depends-on cell from `TBD (docs/audio-module.md)` to `TBD (local draft docs/audio-module.md, not on main)`, matching L102’s “TBD (no MS doc yet)”. L174 already correctly says the companion `audio-authoring.md` is missing.

## Checks

| # | Check | Result |
|---|---|---|
| 1 | Audit completeness | **51 data rows** (L152–202), not 52. All **40** `docs/maker/ux/**` files on main have a row. Live plan/spec docs not given their own audit row (they are cited in Key sources and the stage tables): `docs/maker/style-spec.md`; `docs/maker/data/{project-format,s1-project-load,setup-format}.md`; `docs/maker/maker-spec/MS-00-play-input-and-talk.md`, `MS-01-home-and-projects.md`; `docs/maker/steps/step-00`…`step-03`. The five `docs/maker/shots/*.png` files are references (cited in stage 2), not plans. The only local-only file under `/workspace/tileengine/docs/maker` that is not on main is `roadmap.md` itself. Rows for files that do not exist on main: L195–202 unlabelled (fix 2–3); L194 partly wrong (fix 4); L192–193 correctly labelled local. |
| 2 | Cited paths on `origin/main` | Full paths and the `docs/maker/ux/` (or `data/` / `maker-spec/`) short names used in the stage and audit tables resolve, including shots 01, 18, 24, 39b and 68, `docs/cozy/JOINT-MAP.md`, `docs/cozy/GDD.md`, `docs/foundation/STATUS.md`, `docs/chaos-player-outline.md` and `docs/qa/chaos-player-invariants.md`. Missing on main and not labelled local: the paths in fixes 2, 3 and 5, plus the future `tools/maker/build.ts` (fix 1). L192–193 are labelled correctly and are not cited as if they were on main. |
| 3 | Stages 1–2 vs steps 0–3 | **Pass.** S0: exists, merged PR #76; play stage tap / pan / pinch, battle menu, End Turn, Talk panel. Step 1: exists; S1a merged PR #77, S1b TBD; data only, play stage loads a project; sources match the step (step-01, s1-project-load, project-format, setup-format). Step 2: exists, not built; Home cards with New, Open, ⋯ Rename, Duplicate, Delete, Save, autosave; shots 01, 18, 24; depends on Step 1. Step 3: exists, not built; Test, hard-block errors in words, release play stage with `?project=<id>`; shots 39b, 68; depends on Steps 0 and 2. Caps and gates in the standing lines (400, floor+N, check-law, check-state) match the steps. The roadmap does not name a stale floor. |
| 4 | No screen before the step that makes it work | **Pass.** Stage 1 has no maker editor. Home / save / load is Step 2; Test is Step 3, after save and S0. Stage 3 starts with the stage editor after Step 3 (also stated in L5). Editors travel with their data and rule, with an explicit a/b split when a row would exceed 400. The wizard is in stage 5 (accepted). The two-floor shop is the accepted EA ruling (two linked stages, stairs / C3a/C3b) and is not flagged. |
| 5 | Rules match the agreed direction | **Pass.** L16: maker authors data, engine runs the rules; no rule logic in a screen. L18: ui-shell is reference only, never merged, never for code. L34: slices 400 lines or fewer. Rewrite reasons that mention the ui-shell tell the writer to leave it, not to copy code. No wording that puts game-specific logic in engine code or rule logic in the maker. |
| 6 | Seven CEO decisions stay open | **Pass.** L134–140 are all “Plan needed later”: store publish, AI kit, accessibility, translator, paid asset store, optional online layer, two chaos players. No designed answers are presented as settled. |

## Notes (not must-fixes)

- Step-01 on main still says floor **1023 + N** (base `8a737c5f`). Step-02 L59 still says “main today is 1014”. Those are stale in the step docs, not in this roadmap. Current floor after S1a is **1034**. Fix the step docs on a later edit; 1b should use 1034 + N.
- The rules do not name Grok Build / GrokHeavy, or “nothing public without the CEO’s typed OK”. Step 2 and Step 3 already require the CEO’s OK for a gh-pages `app/` publish. A one-line add under Rules would be enough; not a blocker for this file.
- L130 “TileEngine is not open source” sits above the open-decisions table as a fact, not as a designed answer to one of the seven.

Checked against origin/main `aa158fda` and the step files `docs/maker/steps/step-00-play-input.md`, `step-01-project-format.md`, `step-02-home-save-load.md`, `step-03-test.md`.
