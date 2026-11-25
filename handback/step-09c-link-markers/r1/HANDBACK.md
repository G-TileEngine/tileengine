# Hand-back step-09c-link-markers r1
Step file: docs/maker/steps/step-09c-link-markers.md (r1, sha256 b38c88c92d5f21395d80adb536eba4f9de95e56454d17323dae7a1185ab7a0af, 90 lines).
Base commit: 2176307096c22c0dd94980bfc38a32646e7b9897     Code head: 838a17bdb01afb7bfd1dd0691f5dc069e3d59a70     Code head tree: 0278a961b783701eb1ed99e7838ffe55f79e6069     Branch: step/step-09c-link-markers-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged.

## Changed files
```
A	handoff/steps/tests/s9c-link-markers/smoke.mjs
A	tests/tools/link-markers.test.ts
M	tools/play-stage/board.ts
```
`git diff --shortstat 2176307096c22c0dd94980bfc38a32646e7b9897..838a17bdb01afb7bfd1dd0691f5dc069e3d59a70 -- . ':!handback/**'` is `3 files changed, 86 insertions(+), 1 deletion(-)`. 86 + 1 = 87. Under 120, and under the 400 hard gate.

Caps (insertions + deletions): board.ts 20/20, link-markers.test.ts 26/30, s9c smoke 41/45.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1142. Node's test runner prints `ok`, not `✔`.
```
# tests 1142
# pass 1142
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0. check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L88. `behaviourId` was not moved.

## Smoke
s9c `node handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS. At 390 the hero blob is 4096 px and the stairs cell has 1152 light pixels (floor cell 0). At 360 the blob is 2304 px and the stairs cell has 648 (floor 0). After the tap the plate is `Hero 20/20` and the stairs cell is unchanged. Shots were not committed.
```
ok   1 hero @390: 4096px ok
ok   2 stairs @390: stairs 1152 floor 0
ok   3 selected @390: Hero 20/20 stairs 1152 ok
ok   1 hero @360: 2304px ok
ok   2 stairs @360: stairs 648 floor 0
ok   3 selected @360: Hero 20/20 stairs 648 ok
SMOKE PASS
```
Unedited smokes, all PASS: s9b on 8813, 14 ok. s9 on 8811, 12 ok. s8 on 8810, 16 ok, file sha `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`. s8c on 8812, 8 ok (a parallel run with the other smokes missed the 390 hero blob once; alone it passed). s6d on 8808, 14 ok. S0 on 8797, 14 ok, file sha `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser for s6d and S0: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (`/usr/bin/google-chrome` is not installed). Their files were not edited.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing the three builders and was not committed. Release builds, dev false, commit 40 zeros. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save`, and `__play`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	133 files	grep empty	find empty
baseline	147 files	grep empty	find empty
maker play-stage	133 files	grep empty	find empty
```
AUDIT PASS. No new built file. `window.__play` is absent from the release trees.

## Shipped tests (sha256)
The step file does not pin a shipped test. The new test file, as committed:
```
a844a5723c5ea6fc3e44a54dc106ba0e47d10550ec0b867d9ea8bcfdd4c8fb85  tests/tools/link-markers.test.ts
```
No existing test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper d9523868: the s9c smoke against the step and the s8c smoke → SMOKE LOOKS SOUND. It checked that the hero box is the successful poll (`jsonValue`), so a later water frame cannot null it, and that steps 2 and 3 keep that pre-select box so reach squares cannot widen the blob.
- Helper 22045d3d: the board diff against Rules 1–4 and the cap → still running when this note was written. No change came from it. Self-review below covers the same rules.
- Self-review: Rules 1–4 done. Named test 1 done (the guide's outcomes: one `play:link-stairs` cmd on `fxGround` at c1,r4, the same overlays array while idle, the marker still last after SelectUnit with reach non-empty, stairs opaque count between 21 and 255, door/gate/link opaque, `play:link-nope` undefined). Done-when: green 1142/0 done; tools tsc only the 3 base errors done; 87 ≤ 400 and every cap kept done; s9c 6 ok SMOKE PASS done; s9b, s9, s8, s8c, s6d, S0 PASS done; export audit empty done. QA G1 the named test fails if the marker is missing, moves, drops while selected, or the pictures are solid or missing. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface. G5 nothing in src, data, fixtures, match, levels, hud, page, or tools/maker. G6 only the three build-table files. G7 87 and each cap kept (board.ts is on its cap). G8 no new rAF, timer, or loop; the marker cache is the existing bake map. G9 this note. G10 the smoke shows the stairs before the tap and still after it, at 390 and 360. Done.

## Decisions & deviations
- Each shape is sixteen row masks. Bit 0 is the left column. Stairs are three treads (72 cream pixels). The door is a slab with a window (80). The gate is four bars with a top and a bottom rail (52). `link` is a filled diamond centred on (7, 7) (41). Cream is 248, 244, 230. A pixel that is not lit and touches a lit pixel on any of the eight neighbours is the dark edge 16, 20, 28. Everything else is transparent, so the floor shows through.
- `linkPx` stores the picture in the existing bake cache, one entry per kind that was asked for. A frame does not allocate another copy. An unknown `play:link-*` id returns undefined and is not cached. Stairs has 134 opaque pixels, which is more than 20 and fewer than 256.
- `marks` is built once when the match starts, one `fxGround` overlay per `body.links` entry. A type that is not a key of `SHAPE` uses `play:link-link`. `x` and `y` are `c * TILE` and `r * TILE`. The sheet is 16×16. `TILE` is 16, so the marker fills the cell.
- When nothing is selected and the phase is not `targeting`, `scene()` returns that same `marks` array, so the world-scene memo holds. Otherwise the overlays are reach and path (only while a unit is selected), then the aim squares, then `marks`. The marker is last in the band, so it draws above those squares. `fxGround` already paints after the floor and the backdrop and before units. Nothing in `src/` changes.
- The optional "Stairs to <stage name>" row is left out. No rule change, no new format field, no new rAF, timer, or loop, and no new dependency. `tools/play-stage` still does not import `tools/maker`.
- `/workspace/share/s8/s8-audit.mjs` is not on disk. The check above was reproduced and not committed. Counts stay 133 / 147 / 133 because this step adds no built file. s6d and S0 need `CHROME` set to the headless shell; those files were not edited.
- Run beside the other smokes, s8c once reported no hero at 390 (the blue box is not square while a water frame matches the same test). Alone, immediately after, it passed 8 ok. The file was not edited.

## Next step
- Not this step: a tapped link's info row ("Stairs to <stage name>"), starter-frame art for the markers, and markers in the maker's stage editor. From 9b, still open: `levels.ts` L64, `match.ts` `landed('')`, and the DSK note that slice-on-import waits for a later format. A baseline republish that shows these markers needs the CEO's typed OK via Chief Of Staff. The builder does not publish.
