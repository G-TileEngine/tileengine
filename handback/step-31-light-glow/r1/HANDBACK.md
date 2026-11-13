# Hand-back step-31-light-glow r1
Step file: handoff/steps/step-31-light-glow.md
Kit file sha256: 15fefa9d452a7119ada5f86dd6cc0daee2488876426949374ae9a97343477f44
Base commit: d0a21b1e723f258d1275e57911827eb4a0471cc5     Head commit: 9b30ae898934186a9a7e9ad56911b7eddab33ed2     Branch: step/step-31-light-glow-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/render/frames.ts
M	src/runtime/render/index.ts
A	src/runtime/render/light.ts
A	src/runtime/render/visibility.ts
M	src/runtime/scene/world-scene.ts
M	tests/runtime/host/raf-driver.test.ts
A	tests/runtime/render/light.test.ts
A	tests/runtime/scene/scene-fence.test.ts

## Green
npm test: 573/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Sight is recursive shadowcasting over eight octants. An empty window stops when `start <= end`, so two walls that only touch at a corner do not leak; the one-cell bleed beside that corner stays. A mask is cached by the `blocks` array's identity plus cell, radius and map width, and the cache is cleared at 256 entries. `openCell` walks N, E, S, W, then the diagonals.
- `darkness` is the ruling formula, clamped, and never above 23/32. While `dim > 0` a light uses half its radius, and `fullyDark` is skipped; with `dim` 0 the flag does nothing. Sample squares take the max band. Darkness is `round(total × (6 − level) / 6)`.
- `lightOps` keeps squares that meet the view, plus one square of slack on the right and the bottom, and merges equal neighbours on a row. Darkness runs are emitted before glow runs. The darkness fill is `rgba(3,8,26,k/32)` (CEO ruling: blue-black, not pure black). Alpha and the 0.72 cap are unchanged. Glow on levels 4, 5 and 6 is `rgba(255,176,72, k/32)` with k = 2, 4, 6. Device x is `ix·res·s − cam.devX + fit.padX`.
- QA must-fix `9b30ae8`, applied with `git apply` on `da773e3`. Each changed memo input (dim, wash, res, a new lights array, a new world) is planned on a fresh `createLighting`, so a memo that ignores that input fails, and the same dim twice still returns one plan. The wall-column torch uses radius 80, so a mask that is ignored would light past the wall. The darkness test pins `rgba(3,8,26,k/32)`, including `rgba(3,8,26,0.59375)`.
- Plans are memoised by world identity, lights identity, wash, dim and res. Moonlit is memoised by scene identity and swap-map identity. An unswapped sheet object is kept; a swapped sheet is a shallow copy with the night id. Ground, above, standing and overlays all go through the map. There is no tint export.
- `badMs` takes `unknown`. `null` and `undefined` are absent. Any other non-array is `clipMsInvalid`, once per clip object, and the clip plays by fps or 8. `clipMs` and the one rewritten world-scene length check both gate on `Array.isArray`. The stored `ms` is not rewritten.
- No constant was added beyond `BANDS_OF_LIGHT` 6, `WASH_MAX` 0.62, `DARK_CAP` 0.72 and `STEPS` 32. `res` stays an argument. The walking-unit seed was already `${sheet.id}#${key}` (Q26); offset `dy` was already scaled by `tileH` (Q28); `start()` after `dispose()` queues nothing (Q33), now pinned by one line.
- Diff vs `d0a21b1` is 8 files, 225 insertions and 3 deletions (228 changed lines), handback excluded. The must-fix is +5/−5 inside those two files, so the caps do not move: visibility 51/58, light 80/80, frames 46/50, render index 9/13, world-scene 88/88, raf-driver.test 153/157, light.test 72/74, scene-fence 16/17. `npm test` is 573/0/0/0. `npm run sim` prints the base's two lines. Pins are unchanged (`61fad786`, `1e5dd82c`, `45a3dbaa`, `4d7bbf48`, `d7f64a09`). `main` was not committed to.

## Next step (optional proposal)
- The host should draw `lightOps` after `present`, keyed on plan identity, and should pass stable world and lights objects. Additive glow wants a `lighter` fill on the backend. CN-011 should move the scene fence into depcruise and check-law.
