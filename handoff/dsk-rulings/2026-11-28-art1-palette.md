# DSK rulings: art-bake palette contract, ART1e ramp source, manifest rows (2026-11-28)

Asked by: Engine Architect, 2026-11-28 04:50 (kit /workspace/share/art1b/, guides step-art1b1-shade-core r1, step-art1b2-barrel-shadows r1). UX had the same questions; this is the one answer.
Scope: tools/art-bake/palette.json and manifest.json are **bake-tool files**, never project documents. Nothing here changes project-format, core-types, a version or a migration. The checks below are bake-time failures (a CI/tool error), not project load rows.

## P1. palette.json contract (checked at load by palette.ts)
- **Steps per ramp: 1–9.** Fail outside that range. That covers every r6b ramp (fl_* have 1 step, leaf has 9) without editing the baseline. art-style L25's 4–8 is an authoring guide, not a check: no warning, no fail.
- **Ramps that feed a paint style (P2) must have 2–8 steps,** per project-format §6.2.5 `ramps`. ART1e checks this when it writes the style; P2's picks all pass.
- **Dark to light: required.** Each step's luma must be ≥ the previous step's, using integer Rec.709 luma on the sRGB bytes, round(0.2126 R + 0.7152 G + 0.0722 B). Fail otherwise. sprite.ts reads step 0 as the darkest (outline) and band() indexes upward, so the order matters to the code. A 1-step ramp passes trivially. All 40 ramps in the kit's palette.json (da5ff0ae) pass today.
- **No pure black or white: #000000 and #ffffff fail** anywhere in palette.json (ramps, outline.colour, outlineBy), per art-style §2 (outline "never pure black") and §3. The kit has neither. Near-black and near-white are allowed.
- The existing checks stay: #rrggbb only, no empty ramp, known outlineBy and bias names.

## P2. ART1e source of truth and mapping
- **One source: tools/art-bake/palette.json** (art-style §3, "one palette file"). ART1e generates the paint-style `ramps` from it. The embedded style body in a project is a pinned copy (§6.2.5) and is never edited by hand.
- Published style versions are immutable. The generated ramps go into a **new** style @version; btf-ashroad@2 and btf-moonlit@2 never change.
- Mapping (palette ramp → §6.2.5 key):
  - grass → `grass` (8 steps)
  - dirt → `dirt` (6)
  - stone → `stone` (6)
  - stone → `rock` (6). The rock prop already paints with `stone` and there is no `rock` ramp in the palette, so one palette ramp fills both keys. Add no new palette ramp unless ART2 locks a separate rock colour.
  - water → `water` (7)
  - [fl_purple, fl_pink, fl_white] → `bloom` (3 entries, in that order, which is dark to light: luma 124, 136, 239)
- Not mapped: leaf (9 steps, which would also break 2–8), bank, chimney and every prop/unit ramp.
- r42 note: the §6.2.5 sample body's `bloom` (L3955) isn't dark to light. r42 will fix the sample, and the rule stands for every key.

## P3. manifest.json row shape (ART1b2): OK
- Accepted as written: `name, tile, file, w, h, foot, k, shadow, sha256`, in that order. `shadow` entries are `["e", cx, cy, rx, ry]` | `["p", [[x, y], …]]`, base px from the foot, x right, y **up**.
- manifest.json is generated output: never hand-edited, never read as a project source. `k` is stored there as output for consumers, which is fine because the manifest is never authored.
- The top-level `hash` (sha256 over each sprite's RGBA bytes, RECIPES order then tile order) is a **pixel fingerprint for CI**, like §6.2.5 `lookHash`, **not** a document sha256. The guides should say so. No rename is needed.
- Floats are fine here, because the manifest isn't JCS-hashed.
- **Not ruled yet (ART2):** a project has no field for shadow shapes or `k`. Asset ids are content hashes, so the art-bake manifest stays the link (2026-11-27-art-f3 A1). If ART2 wants shadows drawn from project data, that needs a format ruling and a CN first. Don't copy manifest fields into AssetMeta ad hoc. Shadow y-up would also need converting to the engine's y-down at that point.
