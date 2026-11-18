# Validator TODO — hard-error cases the UI shell does not check

Owner of the real checks: core spine validator. Hand-off for QA & Build Guard, who will turn these into tests.
Spec: `/workspace/tileengine/data/project-format.md` §13 (hard errors H1–H6).
Shell today: `ui-shell/js/app.js` `hardBlockers()` covers H1, H5, H6, and most of H2, H3 and H4. The four cases below are NOT checked.

| # | Rule | Case | Expected result | Test idea |
|---|------|------|-----------------|-----------|
| 1 | H4 | The asset file's content hash doesn't match its asset id | Hard error. Play and Render are blocked. Fix opens the asset. | Edit one byte of a stored PNG while keeping its id, then load. |
| 2 | H3 | `presetRef` has no embedded copy and no library copy, but the setup's values need the preset | Hard error. If the values don't need the preset, it's only a notice. | Delete `presets/<id>@<rev>.json` while a setup still points at it. Test both cases: values that need the preset and values that don't. |
| 3 | H3 | `pages[].assetId` under a parent asset points at a page asset that doesn't exist | Hard error, and the error names the parent asset. | Remove one page asset of an auto-sliced or paged image. |
| 4 | H2 | Malformed colours or lists in overrides and unit stats (outside setup answers), e.g. `#12G`, a list item missing `kind`, or more items than `max` | Hard error. Fix jumps to the field. | Feed bad values into `stage.overrides`, a unit's stats, and an effect `steps` list. |

All four must leave Save working. Save is never blocked.
