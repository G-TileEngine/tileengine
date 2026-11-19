# Roadmap r12 review — 2026-11-19, Europe/London

Read-only. `git fetch -q origin`: `origin/main` is **`0ea3c16e`**. Share `/workspace/share/maker-spec/roadmap.md` is sha256 **`0d0e642d85b4bc4b5723306d007beda19267a3265000da58ed12a1eb566915bc`**, 233 lines, as claimed. `git show 0ea3c16e:docs/maker/roadmap.md` is r11 **`659e8242`**, 208 lines. The catalogue-location line is **byte-identical** to r11 (`behaviour-library/` box only, rev 29, `bba8c252`, 65 / 570 / 40).

**Verdict: OK** — r12 `0d0e642d`. No must-fixes.

## What r12 adds

The diff is this file only: a status line on `0ea3c16e`; S1b marked shipped; rows for 00b and 03b; steps 0–4c labelled AGREED (5+ PROPOSED, with an ask-CoS rule); TBD / precedence / ONLY-greyed-Test rules; Effect Designer status; POST-LAUNCH / DO NOT BUILD; internal checkpoints after 4c and after step 5; a Risks section; the cozy-split rule. All ten claimed folds are present.

## Facts

- **Step 2 is not called merged.** Status: "In build: step 2." Table: `2 · **AGREED · in build**`. Confirmed: branch `step/step-02-home-save-load-r1-chatA` tip `477e021e` sits on base **`772f7aa2`** (four commits, first parent of `55f8ca5` is `772f7aa2`) and is **not** an ancestor of `origin/main`. `tools/maker/` is absent on main.
- **S1b** merged as PR #78, `57af7135`. Step 0 is PR #76, S1a PR #77. All match the log.
- **00b** guide is on main at `docs/maker/steps/step-00b-sides-from-data.md`, sha256 **`fe9f13b9`**, 115 lines. Go-line is after 4a and before 4b (L12 also notes the shared `looks.ts` rebase). **03b** is on main at `docs/maker/steps/step-03b-slice-r29.md`, sha256 **`a72d3352`**, 136 lines. Its own header (L7–9) says it needs only 0, 1a and 1b, and **does not wait on step 2 or 3**. The roadmap matches that (`Depends on: Steps 0, 1a, 1b`). 4b waits on 00b, 4a and 03b (MS-03 row, and the 00b "Blocks: 4b" / step-04 Go-line order). That is the order in the QA-OK guides.
- **`35bc388`** is on main. `git show --stat 35bc388` touches `tools/effect-designer/` and `src/editor/effect/` (and tests). Both trees exist on `0ea3c16e`, as does `ui-shell/mock-effects-v3/`. The maker version is step 29, PROPOSED; the rows say never wire the mock into the maker. The commit sha itself is not cited (niggle).
- New path cites (`step-00b-…`, `step-03b-…`, `step-04-…`, `tools/effect-designer/`, `src/editor/effect/`, `ui-shell/mock-effects-v3/`, `tools/play-stage/match.ts`) all exist on main. Off-main sources stay labelled box-only / local / not on main. (`tools/maker/build.ts` is named only to say it is not on main until Step 2.)

## Only roadmap.md changed

r12 itself is a roadmap edit. Every share step guide that exists on main is **byte-identical** to `origin/main`, except a **pre-existing** share copy of `step-03-test.md` r8 (`12e750b8`, 98 lines) versus main r7 (`c1aa1118`, 97 lines). That r8 was reviewed earlier and was not touched for r12. 00b is on main only (not in share).

## Attribution

r12's new rules, checkpoints and Risks are sourced as **CoS's list from the outside reviews** (GrokHeavy, Grok Build, Gemini), shared by the CEO and relayed by CoS — not as CEO rulings. "A public milestone is the CEO's call" correctly leaves publication to the CEO. Pre-existing CEO items stay cited (CEO #5–#7, CEO-approved tap-to-add, Start new / CEO #6 with the **proposed UX answer** still labelled). No new UX proposal is dressed as a CEO rule.

## Scope, guides, AGREED labels

Rules 1, 3 and 5 still say the maker only authors data, ui-shell is reference only (never copy code), and every slice is 400 lines or fewer. The cozy-split rule keeps "a" (data + rule) tested on project data only, with "b" (editor) the next go-line. Post-launch rows are marked **DO NOT BUILD**. No game-specific engine work is added. That matches the step guides.

AGREED labels match QA-OK guides on main: steps 0 and 1 are shipped; 00b `fe9f13b9` (the two r1 must-fixes are in: `looks.ts` rebase, `scripts/sim.ts:15` / `match-picture.ts:17` carries); 03b `a72d3352` (OK in the step-04 batch); step 2's guide is on main and the code is in build, not merged; step 3's pushed guide is r7 `c1aa1118` (the unpushed r8 does not undermine AGREED); 4a/4b/4c are `ba589ccc` (L347 is edges-only, lanes give no row).

No must-fixes. CoS can push r12 as `0d0e642d`.
