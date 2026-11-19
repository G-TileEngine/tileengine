# Roadmap r13 batch review — 2026-11-19, Europe/London

Read-only. `git fetch -q origin`: `origin/main` is **`e75919c5`** (r12 + the r12 QA review). Full shas and line counts, checked first:

| File | Full sha256 | Lines |
|---|---|---|
| share `roadmap.md` r13 | `dbf44986d80d161bdae6511cb860b7001945643ee76c783b13b88b16f7caabda` | 284 |
| r12 on main `docs/maker/roadmap.md` | `0d0e642d` (confirmed) | 233 |
| share `r13/step-04.md` | `98dcfe8925fc17930e67da17efc703ba51ff8694ea817e3af6c8d5f8c825e1be` | 384 |
| main `step-04-stage-editor.md` | `ba589ccc` | 384 |
| share `r13/dsk.md` | `aacb7e01c4a2baba3a9eae5fd14ca1b2a25a5f4cac6e3d1f32ee82b8d3fe164c` | 68 |
| main DSK `24cba61e` | confirmed | 68 |

## Verdicts

| File | Verdict |
|---|---|
| roadmap r13 `dbf44986` | **NOT OK** — 2 must-fixes (attribution) |
| step-04 `98dcfe89` | **OK** |
| DSK `aacb7e01` | **OK** |

## 1. Roadmap r13

The reorder is as claimed: 7 links (was 9), 8 autosave doors/stairs (was 10, part 1), 9 new export MVP, 10 art upload (was 30), 11 Effect Designer (was 29), 12 onward cozy, 14 sleep autosave (split from old 10), 24–28 stealth, 29–37 stage 5. 3a / 3b headings are in. Catalogue-location line is **byte-identical** to r12.

**(a) Dependencies.** Built from each row's Needs column against the new numbers. **No back-edges.** Every numbered dep is a strictly earlier step (or 4 / Step 1–3 / 00b / 03b, all before 5). Notable: 8 → 7 and Step 2; 9 → 6 and Step 3; 11 → Step 2 and 5; 14 → 8 and 13; 16 → 12 and 13; 18 → 5 and 12; 25 → 24 and 12; 27 → 8, 14 and 25; 34 → MS-06 (32) and MS-07 (11); 35 → 9 and stages 1–4; 36 and 37 → 35.

**(b)** Numbered rows 5–37 are all **PROPOSED**. 0–4c, 00b and 03b stay **AGREED** (shipped / in build / build-ready). The after-4c, after-6 and after-9 rows are internal checkpoints, not build rows, as in r12.

**(e) Mapping table (L134–173) is complete and consistent.** Every r12 number 5–34 and 31a appears once; 10 maps once to 8 and 14; new 9 is "— (new)". New numbers match the rows, including the first-loop checkpoint "after 7–14" → "after 12–18" and "checkpoint after 5" → "after 6".

**(f) Behaviour editors.** No stale old numbers (ED is step 11, not 29). The Stage column still says "3" / "3 on" and does not mark 3a vs 3b. Units, terrain and win rules are 3a (5–6, 4a); effect *use* is cozy 3b, the designer is 3a step 11 (the row already says that). Niggle, not a must-fix: optionally split that column to 3a/3b.

**(g)** No stale "step 9/10/29/30" left with the old meaning. Risks now say "Step 7 (was 9)" and "Steps 8 and 14 (were 10)". Remaining "step 9" hits (L84, L130) correctly mean the export MVP.

**(h)** Effect Designer is still "never in the maker"; the maker version is step 11; don't wire the mock (L86, L104, editors table). Export MVP (L83) is consistent with the export-audit role: a static play-stage web build, `buildWeb()` play-only (`FORBIDDEN`) / offline / no debug-globals, project files instead of `openBundled`, no store, signing or device save. It does not literally say "runtime + used behaviours + project assets only, no editor code" — a niggle, not a contradiction.

**(d) Attribution — must-fixes.** The quote is present (L67: "Yes, reorder engine-first") and the order is "proposed by CoS". The time **01:41** is missing (date only: 2026-11-19). New rows and the sleep split are sourced as the CEO decision, which over-claims: the CEO approved the reorder, not those contents.

1. **`roadmap.md:3`, `:5`, `:67`.** Add the timestamp **01:41** to the CEO-decision cite (the quote is already at L67). Keep it clear that CoS proposed the order and relayed the decision. Only the engine-first reorder is the CEO's.

2. **`roadmap.md:80`, `:83`, `:84`, `:93`.** Relabel these as UX/CoS proposals, not as made "by the CEO decision". L83–84 are the new export MVP and its checkpoint; L93 is the sleep/doors split; L80 moved the tactics checkpoint after 6 because win rules already land in 6 (5 and 6 were **unchanged** by the reorder, so that move is not the CEO's).

## 2. step-04 `98dcfe89` — OK

Diff against `ba589ccc` is **exactly** the claimed 11 lines (L8, 27, 71, 273, 278, 282, 284, 285, 334, 362, 376), each a pure `step 9` → `step 7` (or `Step 9` → `Step 7`). No other change. Remaining "step N" refs are 0, 2, 3, 4, 5, 7, 03b and 4a/4b/4c, all still correct under the new numbering (step 5 is still MS-04 units; step 7 is links). No leftover 10/29/30.

## 3. DSK `aacb7e01` — OK

Diff against `24cba61e` is **only L63**: `Step 9` → `Step 7` (pure). No other 9/10/29/30. Remaining "step" hits are Step 4 / step 4, and "drift step 5" (setup-format §8, not a roadmap number).

## Other guides on main

`rg` of `step-00b`, `step-03b`, `step-02`, `step-03` (and, for completeness, `step-00` and `step-01`) on `e75919c5` for step 9/10/29/30: **none**. No follow-up list.

Hold the r13 roadmap until the two attribution fixes land; recheck those lines. step-04 and the DSK file can go with it.
