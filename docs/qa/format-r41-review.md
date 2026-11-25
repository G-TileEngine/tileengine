# project-format r41 draft review: OK (one wording fix), code drift noted

Draft /workspace/tileengine/data/project-format.md (sha256 edcc98f6, 4160 lines). Diff vs r40 f4427708: data/staging/project-format.r41.diff (608743bb). This review supersedes the earlier 032684cc draft. The diff has 18 changed lines and is doc text only: no version bump, no migration, no CN. The six hard errors are unchanged.

## Checked against main ea3b08f4
- `notPlaced`: matches src/project/read/placements.ts L15 (enemy picks past cells) and L25 (loadout picks past spawns). It is a note, distinct from `placementDropped` (resize.ts, load/drops.ts).
- `assetFileMissing` / `assetHashMismatch`: match tools/maker/asset-check.ts L19-22. They are hard when a selected stage uses the asset, a warning otherwise, and the index entry is kept.
- `uploadTypeUnsupported`: matches tools/maker/art.ts L12/L28 (path = fileName, detail = sniffed), with nothing written.
- `advancedRenderInactive`: emitted at read-project.ts L51.
- D22/D22b (`effects/` slot, `legacyEffectId`, `badEffectId`, `.deleted` skip): doc-ahead for step 10b. Nothing on main contradicts them. Step 10a keeps setup_ docs working by exact id, which fits "never re-id'd".
- Attribution: rows cite DSK D22/D22b/D29 and EA 2026-11-24/25. The only CEO cite is the old r18 one, unchanged.

## Fix before push (wording)
1. `assetHashMismatch` is documented as `{assetId}`, but the code also sets `path: "assets/<id>.<ext>"`. Make it `{assetId, path}` like `assetFileMissing`, in both the H4 row and the L1746 table row.

## Code drift once r41 lands (carries for EA, not format blockers)
- `uploadTooLarge`: main and the 10a trial show only the plain "too big" line, with no row. Code has to add the `uploadTooLarge` row `{fileName, w, h, max: 4096}`, in 10b or as a 10a add.
- `advancedRenderInactive`: code emits only the pixelPerfect row. The `fit` (cover/stretch) row comes with the Cover/Stretch carry.
- asset-check.ts L16 has `catch { docs = files; }`, which falls back silently when migrateProject fails. That is a Law 12 carry.
