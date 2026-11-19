# Roadmap r14 review — 2026-11-19, Europe/London

Read-only. `git fetch -q origin`: `origin/main` is **`594ea8ae`**. **r14 is not on main.** Main's roadmap is r13b **`0913ccdf832b9ea2c410a18bff4aea9f1a645f8a2f666b3c19a9d405b1fc605c`** (284 lines), landed in that tip with the step-04 / DSK `step 9` → `step 7` renumber. Share `/workspace/share/maker-spec/roadmap.md` is sha256 **`685de17df50c0b0a3d6ac6a251814e90f550f9c8e84b642fa348588526b4283b`**, 285 lines, as claimed.

**Verdict: OK** on `685de17d`. Correction (QA, 2026-11-19 02:00 London): the r1 must-fix below was a false positive. Roadmap L84 already cites `src/project/load/types.ts` lines 25–30; the short path was a misread. No fixes.

## CoS vs UX, and vs r13b

UX r14 at `/workspace/share/r13/roadmap-64cf8ea3.md` is sha256 **`64cf8ea3`**, also 285 lines. The only CoS edit is **L239**: "Research base for step 33 effects" became "Research base for engine-build step 33 effects (old engine numbering, not roadmap step 33)". Confirmed; no other line differs.

Against main r13b, the claimed r14 changes are all present: early order 5, 6, tactics checkpoint, 7 links, 8 doors/stairs autosave, 9 art upload, 10 engine effect path, 11 export MVP, exported-plays checkpoint; Effect Designer split (10 + 33); export MVP as a restricted run of the same pipeline with a vertical-slice test and store / signing / device save / APK excluded; mapping table with r12, r13 and r14 columns. Stage 5 after the new 33 shifts by one (34–38). Catalogue line L21 is **byte-identical** to r13b.

## Graph, PROPOSED, mapping, attribution

- **No back-edges.** 8 → 7 and Step 2; 9 → 4; 10 → 5 and Step 2; 11 → 6, Step 3, and after 9 and 10; 14 → 8 and 13; 33 → 10, 5 and Step 2; 35 → MS-06 (32) and MS-07 (10 and 33, both < 35); 36 → 11; 37 and 38 → 36. Numbered 5–38 are all **PROPOSED**. 0–4c stay AGREED. Checkpoints stay internal.
- **Mapping (L135–174) is complete and consistent** across the three columns. Every r12 number 5–34 and 31a appears once; r13 9/10/11 become 11 / 9 / (10 and 33); 10→8 and 14 stays; stage-5 33–37 become 34–38; new 38 is in the table. Row labels `(r13: N; r12: M)` match. The r13 "after 9" checkpoint is noted on the export-MVP map row as moving to after 11.
- **Attribution is clean.** Only the 01:41 engine-first decision is the CEO's (L3, L5, L67, quote present, CoS proposed and relayed). r14 changes are labelled CoS proposals; the outside feedback is "shared by the CEO" and "**not CEO rulings**" (L3, L84, L85). L93's sleep split stays a UX proposal, not a CEO ruling.

## Step-10 cites on `594ea8ae`

| Cite | Verdict |
|---|---|
| `src/project/read/effect.ts` L34–36 (`readEffect`); `EffectDoc` L4 | **Holds** |
| `tools/play-stage/fx.ts` L39–51 (`createPlayFx`); stock L8–15 | **Holds** |
| F17 = `tests/tools/play-stage-p18.test.ts` L36, "F17: an editor-saved effect setup is what the match uses" | **Holds** (P1-8: a saved doc drives the match, not the stock) |
| `src/project/types.ts` L25–30 `knownKind` | **Correct (rechecked).** L84 cites `src/project/load/types.ts`. The function is at **`src/project/load/types.ts` L25–30** and, as claimed, has no `effects/` slot (only maps/stages/units/setups) |
| `read-project.ts` L85 `unknownFile` when `knownKind` is null | **Holds** |
| `tools/play-stage/project.ts` L43 `effectRef: "line-shot"`; `playDocsOf` (L56) never passes `effects` | **Holds** |
| `board.ts` L76 `createPlayFx(body.effects)` | **Holds** |
| `tools/play-stage/build.ts` L35 (`walk` throws if `rel.includes("editor")`) | **Holds.** This is play-stage `build.ts`, not `tools/apk/build.ts` (whose L35 is a blank line). Same file as the export MVP's `build()` |
| `createCastFx` / `cueFromEntry` at `cast-fx.ts` L38 and L18; `FxDocValues` at `fx-doc.ts` L6; `SAVE` / `blankEffect` at `save.ts` L3 and L14; setup-format §2.10 L437; project-format layout L294 and §6.7 L1144–1145 | **Hold** |
| Id clash: project-format L1145 `effect_<ULID>` vs `save.ts` L3 `setup_<ULID>` | **Holds** (F17 itself uses a `setup_` id). Rightly left for DSK |

**Must-fix:**

1. ~~`roadmap.md:84` path fix~~: withdrawn. L84 already reads `src/project/load/types.ts` lines 25–30.

## Export MVP, ED, and other guides

Export MVP (L85) matches the audit in substance: a restricted run of the play-stage / `buildWeb()` pipeline, DEV paths stripped, play-only `FORBIDDEN`, debug-globals and offline checks, project files instead of `openBundled`, **no** store, signing, device save or APK, vertical-slice "export and play to a win." It does not literally say "runtime + used behaviours + project assets only, no editor code, no dev overlay"; the cited checks already cover no editor and no dev overlay. Niggle, not a must-fix.

The Effect Designer stays out of the maker until its maker steps: basic picker on the Behaviour panel at 10, full tidy at 33; ui-shell mock never wired; `tools/effect-designer/` / `src/editor/effect/` remain the standalone ED-E page.

**Guides and DSK on main:** `rg` of step 9/10/11 (and 29/30/33/35/36) in `step-00`, `00b`, `01`, `02`, `03`, `03b`, `04` and the DSK file: **no refs whose meaning changed in r14.** step-04 and the DSK already say **step 7** for links, and step 7 did not move. Mentions of an "Effect Designer split" in step-01/02/04 are the model/store/UI file layout, not a roadmap step number. **No follow-ups.**

Hold r14 until L84's path is fixed; recheck that cite only.
