# QA review: maker step drafts 01–03

QA & Build Guard, 2026-11-18, Europe/London. Read-only. Drafts: `/workspace/tileengine/docs/maker/steps/step-01-project-format.md`, `step-02-home-save-load.md`, `step-03-test.md` (local; not edited). `git fetch -q origin` in `/workspace/tileengine-repo`: `origin/main` is `f2df5c403045b3837d80b0b05b24a3b1a55f7872` (`docs: move all maker docs into docs/maker/`). Stage 1–3 acceptance: `docs/qa/p1-9-touch-play-bugs.md`. No pushes and no edits to the drafts.

**Floor on main:** P1-9 postmerge floor is **1014**. S0 play-input is on main as kit/docs only (`handoff/steps/s0-play-input.md`, QA reviews); `tests/tools/touch-play.test.ts` is absent and `50105702..origin/main` touches no `tests/`, `src/`, or `tools/`. The S0 floor of 1023 must not be used until that code merges. Each new step should set floor = **1014 + N** (or the previous merged step's floor + N).

**`[DSK]` placeholders (step 2):** none in the current draft. The three gaps the parent asked to ignore are not marked. Save-file rules appear written out under **Save rules** (order, rev, refusals, trash, duplicate, errors). Noted only.

## (a) Read-first paths on `origin/main` f2df5c40

Checked with `git cat-file -e origin/main:<path>`. The drafts correctly use post-move `docs/maker/…` paths (pre-move `data/project-format.md`, `data/setup-format.md`, `ux/screen-map.md`, `ux/design-notes/shell-and-look.md` are absent on main and are **not** cited).

| Path | Step | On main? |
|---|---|---|
| `docs/maker/data/project-format.md` | 1, 2 | yes |
| `docs/maker/data/setup-format.md` | 1 | yes |
| `handoff/dsk-rulings/2026-11-17-phase1.md` | 1 | yes |
| `src/project/read/*`, `tools/play-stage/load.ts`, `tests/rules/bot-p15.test.ts` | 1 | yes |
| `docs/maker/ux/screen-map.md`, `docs/maker/ux/design-notes/shell-and-look.md` | 2 | yes |
| `src/editor/effect/save.ts`, `tools/effect-designer/store.ts`, `page.ts` | 2 | yes |
| `docs/maker/maker-spec/MS-00-play-input-and-talk.md` | 3 | yes |
| `docs/maker/ux/design-notes/turn-banner.md` | 3 | yes |
| `tools/play-stage/page.ts`, `load.ts` | 3 | yes |
| `docs/maker/data/s1-project-load.md` | 1, 2, 3 | **MISSING** (also missing at the draft's box path `handoff/steps/s1-project-load.md` on main). A copy exists only on the box at `/workspace/tileengine/handoff/steps/s1-project-load.md`, not in the repo |
| `docs/maker/maker-spec/MS-01-home-and-projects.md` | 2 | **MISSING** (draft says "written next, from this step") |
| `ui-shell/screenshots/01-home.png`, `24-project-settings.png` | 2 | **MISSING** (on the box under `/workspace/tileengine/ui-shell/screenshots/`; not tracked). `docs/maker/shots/` does not exist on main |
| `ui-shell/screenshots/68-test-battle-menu.png` | 3 | **MISSING** (same: box only; not under `docs/maker/shots/`) |
| `tools/maker/project.ts`, `tools/maker/store.ts` | 3 | **MISSING on this tip** — expected until Step 2 merges; the draft says "Needs Step 2 merged" |

A builder told only "read the repo, step N" cannot open S1, MS-01, or the three screenshots.

## Caps

Sums as written, tests included, data excluded where stated: Step 1a **330**, Step 1b **220**, Step 2 **400** (exact), Step 3 **270**. Each run is ≤ 400. Testable only once Done-when names the count command (for example `git diff --shortstat` vs the run's base, fixtures/templates uncounted as Step 1 already says).

## Per-step verdicts

### Step 1 — Project format, reader, validation, versioning: **NOT OK**

1. **Commit `docs/maker/data/s1-project-load.md` to origin/main before the run** (it is read-first #1 and supplies fixture JSON, reader contract, versions, S1 §9 tests and the line budget). Until then a repo-only builder has to invent the project.
2. **Name a test floor and the gate commands in Done-when.** Floor = 1014 + N for 1a, then that floor + N for 1b (S0's 1023 is not on main). Commands: `npm test`, `scripts/check-law.sh`, `scripts/check-state.sh`, plus how the 400-line cap is counted.
3. **Add a Must-NOT plus a plant/test for no second parser and Law 12.** `readProject` / `playDocsOf` / `load.ts` must go through `src/project/read/*` only (p1-9: no second parser in play-stage). An empty `catch`, a silent default, or a swallowed bad `formatVersion` must fail a named test. (The Done-when already has the right v4-migrate / v7-`formatNewer` / hard-row cases, which match S1 §9 b–g and the p1-9 "visible reject" once S1 is in the repo.)

Otherwise the 1a/1b split, reuse of `src/project/read/*`, "no `DEMO_*` left", parity golden, and "ui-shell is a record, never copy it" are the right shape. `ui-shell/js/project-store.js` (Prototype lessons, not Read first) is also absent from main — flag only.

### Step 2 — Home, save and load: **NOT OK**

1. **Commit `docs/maker/maker-spec/MS-01-home-and-projects.md` before the run, or drop it from Read first** and treat Behaviour + Save rules as the complete spec. It is read-first #1 and is not on main.
2. **Put the Home screenshots on main at `docs/maker/shots/` and point Read first there** (`01-home.png`, `24-project-settings.png`). They are not at `ui-shell/screenshots/` on origin/main. Same for `docs/maker/data/s1-project-load.md` (read-first #2).
3. **Name floor = (Step 1's merged floor) + N, and the gate commands, in Done-when.** Add an explicit test that a **corrupt or unreadable project file** shows a typed visible error and does **not** open as an empty default (p1-9 stage 2). Add a plant for an empty `catch`, template JSON in `.ts`, or a copied ui-shell module (Must-NOTs exist; only the write-failure case is currently a named test).

Save rules 1–6 are concrete and testable (staleRev, atomic tmp+rename, kill-before-`project.json`, duplicate/`copiedFrom`, trash+restore). The 6 s Undo and 48 px phone check are manual, which is fine once the unit tests above exist. No literal `[DSK]` markers to ignore.

### Step 3 — Test opens the real play stage: **NOT OK**

1. **Same missing S1 path as Step 1; also the screenshot `ui-shell/screenshots/68-test-battle-menu.png` is not on main.** Commit it under `docs/maker/shots/` (or drop it until then). `tools/maker/project.ts` and `store.ts` may stay as Step 2 outputs.
2. **Done-when must require the touch play gate on Test of the current project** (p1-9: Test runs the real play stage, not a demo or a mock, and the TOUCH PLAY GATE / S0 `touch-smoke.mjs` passes at 390 and 360). After MS-00 is merged (the draft already requires that), name `TOUCH SMOKE PASS` as a handback gate, not only "play a turn" on a phone.
3. **Name the floor (previous merged floor + N) and gate commands.** Add a named test for the Must-NOT already stated: a failed save before Test does not launch and shows why. The unreadable-project "error, not the demo" test is already in Done-when and matches p1-9 / Law 12.

The launch split (`test-gate.ts` / `test-launch.ts` / `project-source.ts`), "no demo fallback", "nothing in play writes", and "do not rebuild ui-shell's fake battle" are right.

## (b)(c)(d) cross-check (short)

- **Testable Done-when:** Step 1's reader/version/parity cases are specific once S1 is on main; all three drafts say "gates pass" or `npm test` without a floor or, for 2 and 3, without naming `check-law` / `check-state`. Phone checks are checklists, not commands — acceptable as a supplement, not as the only play proof.
- **Must-NOT plants:** Step 2 write-failure and Step 3 no-demo-fallback are test-backed. Empty `catch`, second parser, ui-shell copy, and template-in-code are stated but unplanted.
- **p1-9 stages 1–3:** Stage 1's reader-through-`src/project/read/*` and formatVersion reject are intended but not planted / not repo-visible until S1 is committed. Stage 2's corrupt-load visible error is missing. Stage 3's real play stage is in the Goal, but the touch smoke is not a Done-when gate.
