# Step D3 host guide review (EA, 2 commits on main `24b014fa`): QA

`refs/cmp/d3-proto-r2` = `40d45950f34512d2c4150ac9f1cf8be2b1f3ebba` (bundle `03bd551d`). Inputs copied to `docs/qa/qa-runs/step-d3/in/`; outputs are in `out/`. /tmp/d3 was only read. Nothing pushed.

## Verdict: OK. No must-fixes; nits below.

1. **Hashes.**
   - `push-sha256.txt` `98f0d49c` (3/3) and `buildguide-push-sha256.txt` `a82f7a24` (1/1) pass `sha256sum -c` from /workspace/tileengine.
   - `144ac842`: tree `a00f814e`, parent `24b014fa`. It adds host-guide `0a4e3d43` (50 lines), match-picture `7cd3f1fe` (51) and tsconfig `a46ab227` (+1/−1).
   - `40d45950`: tree `5cd20254`, parent `144ac842`. BUILD_GUIDE `55968a83` (+2/−2, lines 54 and 64).
   - Author and committer are noreply on both. `git apply --index` of patches 0001 and 0002 on `24b014fa` gives exactly `a00f814e`, then `5cd20254`.
2. **Rules vs code at `40d45950`.** Every rule has a cite, and every cite lands on the claimed code.
   - Seams 7, 8, 13, 27, 35 and 37 match `integration-seams.md` (`9bda3899`):
     - 7: `draw-list.ts:43` tiles have no offset; `:65` / `frames.ts:43` give the hash offset.
     - 8: `chunk-plan.ts:7,20,25`.
     - 13: `raf-driver.ts:83,86` with `world-scene.ts:14,16`.
     - 27: `fx-particles.ts:4`. The cut is applied per build at `draw-list.ts:78`.
     - 35: first-wins at `world-scene.ts:110`.
     - 37: identity of the array and its elements at `world-scene.ts:115`.
   - p95: `raf-driver.ts:39` is `ceil(0.95·n)−1`; `page.ts:21` is `floor(n·q)` and is noted (one rank higher only when 0.95·n is whole); `TEMPLATE.md:53` is right.
   - Door table:
     - `actions.ts:26-28` are the 4 notices.
     - `clock.ts:120` is the RangeError.
     - `log.ts:62,64` are the append throws.
     - `run.ts:59,62,65` are the restore throws.
     - `run.ts:68,78-84` are `SaveRefusal` and the `load:` throws.
   - END_TURN: it is accepted only from idle/unitSelected (`tactics.flow.table.ts:11`). No other table row takes END_TURN; `UNDO_MOVE` is at `input.table.ts:10` and FUSE_EXPIRE from actMenu at `flow:12`.
   - Rules 7, 10 and 11 are written as "after P1", and their cites are true on main, which has no P1 code yet (`visibility.ts:1` has no `lightWalls`; `actions.ts:25` is `plainCopy`).
   - `.dependency-cruiser.cjs:15` and `world-scene.ts:6` are right.
3. **Example.** `node tools/host-example/match-picture.ts` exits 0 in 0.2 s and prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`.
   - It draws no canvas; it returns a draw list. The commands are real:
     - 54 `ground` tiles (6×9) plus one command per unit, at the units' replayed cells. For example knight#1 at (2,5) is drawn at dx 32, dy 80, 16×16.
     - The units really moved from their start (knight (0,8) → (2,5)). Log seq is 23.
   - A raster of the commands is `out/match-picture.png` (sha `e25902fd`); probes are `out/cmds.ts` and `out/moved.ts`.
4. **Gates.** Green **692/0** on main (0 cancelled, skipped or todo); exit 0 covers tsc, lint, deps, state and law. tsc lists `tools/host-example/match-picture.ts`, and eslint on it exits 0.
5. **Build law.**
   - One clock: `world.clock.now()` and `stepMs` feed both `scene()` and `buildDrawList`.
   - Tiles go through a scene `layers` tile layer and units through `sprites` → `SceneUnit` → `createSceneLink`.
   - No chess or other copied trees.
   - Size: guide 50 of ~80, example 51 of ~60.
   - BUILD_GUIDE line 54: `src/fx/` is kept as BTF hit-timing rules only. True: only `src/btf-adapters/src/fx-preset.ts` imports `src/fx`, and no `src/runtime` file does.
   - Export audit: low risk today. The device-page build walks imports from `tools/device-page/page.ts` only, and nothing imports host-example. There is no Render config in the repo. `tools/serve.ts` serves all of `tools/` on the LAN, so the source would be visible there; its `tests/` imports return 404.

## Nits (none block)
- N1, public entry points: `sceneFromMatch` uses only public modules (`render/index.ts`, `scene/world-scene.ts`, `sim/index.ts`). But `demo()` imports `tests/sim/{ai,input,seats}.ts` to play the match, and a host copying the "working copy" can't use those. Add one comment line ("demo() uses test helpers to make a match; a host brings its own seats and input"), or move the play step out.
- N2, probe titles: rule 9 quotes "getter steps clock" and "getter submits again"; the full titles are `S7 re-entrant: getter steps clock` and `S7 re-entrant: getter submits again` (QA `qa-runs/post34/probes/hostile.ts`).
- N3, sources outside the repo: `post34-diagnosis-plan.md`, `integration-seams.md` and `docs/qa/*` aren't in the repo, so hosts can't open them. Say "EA/QA notes", or inline the bits needed.
- N4, rule 12: "finishes the action" could cite `CHOOSE_ACTION` / `WAIT` (`tactics.input.table.ts:11,13`).
- N5, replay vs played: the replayed snapshot equals the played one except `phases` (played `play.result`, replay `play.loading`; runMatch drives the machine, the log doesn't). Hosts should take phases from the save, not expect them from a replay. Worth one line in the restore section.
- N6, BUILD_GUIDE line 54: write the path as `src/btf-adapters/src/fx-preset.ts` (the text says `btf-adapters/src/fx-preset.ts`).
- N7, stale cites after P1: rules 7, 10 and 11 cite pre-P1 lines (`visibility.ts:1`, `actions.ts:25`). Re-cite when P1 lands.
- N8, stale backup: `kit-backup-d3/kit/` holds an older BUILD_GUIDE (`7abc12a4`) and list (`99a4bf27`). The share list and the commit are right.
- Carry: a pin test that the device-page `build.json` lists only `src/` and `tools/device-page/` files, so host-example and `tests/` can never ship.
