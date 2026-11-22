# QA review: Step 6c r1 (tactics checkpoint, Empty to a win)

**Verdict: OK TO MERGE.** No must-fix. One review, no rework round.

Branch `step/step-06c-checkpoint-r1-chatA`, tip `f2de1870c0e1ea86fd3655083f4fb3831b94cc09` (tree `1624456ec4c7322b107ad7a3dbe53412f0f08139`), code head `c028fbd2012999089951cff90a7442cf675e7428` (tree `2549e455247708b54ce494616d44d9a0612d764b`), base `68a67a56787dcf439554a267a1af987479c5f745`. Current `origin/main` is `c89e39b6021615d6a8fe2d5dff45dfc637ff9c55` (docs-only on top of the base: the three 6b rebuild/QA files). Guide: `docs/maker/steps/step-06-levels-win-rules.md` r2, blob `c846699d`, sha256 `a8060239…`, same on the base, the tip, the code head, current main, and the share copy. 6c is L197–226; count command L82; Check 8 L37; caps sum 130 at L211; EA Ruling 1 at L235. HANDBACK blob `a357dc06`, 193 lines, plus eight 390×844 light pngs and `checkpoint.tileproj/` written by the smoke. CoS report `/workspace/share/step-06c-verify/report.md` (sha256 `0abc4043…`, hash-object `aa598003`, 57 lines) was used as a pointer only. Tip vs code head is `handback/step-06c-checkpoint/r1/` only (17 files, 2623 insertions). Both branch commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>`. HANDBACK has a **Code head** label (HB:3).

## Numbers (my own runs on a fresh worktree at the tip, real `npm ci`)
- `npm test` exits 0: **1105** pass, 0 fail, 0 skipped, 0 todo. Floor 1102 + N=3. All three named tests are present, close on their last line, and passing: `tactics checkpoint: Empty to a win` (`tests/editor/checkpoint.test.ts:100-107`), `checkpoint win comes from the rule` (`:108-112`), `checkpoint project loads clean` (`:113-119`). Parity seed 24301 still ships on the Empty template stage. Golden `90dde42a…` is unchanged. Lockfile is unchanged vs the base.
- `typecheck`, `lint`, `deps` (172 modules, 492 dependencies), `check:state` and `check:law` each exit 0.
- **G7:** the guide L82 command (with `s6c-checkpoint`) at the code head and at the tip against the product base, and at the trial-merge tree against first parent `c89e39b6`: **1 file changed, 119 insertions(+)** = 119 ≤ 400. Only `tests/editor/checkpoint.test.ts` is counted. It is **119 against guidance cap 90** (guide L207); HB:190 names it and why (the fight is in the file because the p18 intend helpers are not exported; the D16 walk and dead-foe asserts stayed). The 130 figure is the sum of file caps (guide L211), not a second gate. Uncounted: s6c smoke 119 lines (cap 130). No product file, no gap-fix file, no `home.ts` edit, no file near 500. Without the excludes, at the code head: 2 files, 238 insertions (the uncounted smoke). At the tip against `c89e39b6` without merging, the official excludes also show the three 6b docs as deletions (4 files, 119+/1561−); that is not the merge-tree number.
- **Smokes** (`/opt/google/chrome/chrome` 156.0.8078.47, `PLAYWRIGHT_CORE` playwright-core under `/tmp/pw`, this box Node v24.22.1), all at the tip:
  - s6c port 8807: solo SMOKE PASS (18 ok lines at 390 and 360); under 8 CPU-burn loops, same 18 ok lines, SMOKE PASS. Ok lines are byte-equal to HB:33–51. New waits are `waitForFunction`. `locator.waitFor` remains only inside `tap` / `press` / `slide` (L15–16, L19). No `waitForTimeout`.
  - S0 port 8797: 7/7 at both widths, `TOUCH SMOKE PASS`. Ok lines byte-equal to HB:56–70. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` is identical on base, code head and tip. No `tools/play-stage/` edit, so S0 is not required this step (guide L224); it was still run and is unedited.
  - s3 port 8798, s4a port 8799, s6a port 8805, s6b port 8806: all unedited this step; each PASS at 390 and 360. Ok lines byte-equal to HB:75–93, 98–114, 119–137, 142–158.
- **Pins:** zero diff under `behaviour-library/**`, `src/rules/behaviours/catalogue.ts`, `tools/maker/catalogue.ts`, `src/`, `tools/`, `package.json`, or the lockfile. No export audit required (guide L35 / L224, HB:28). `node tools/maker/build.ts <out>` on a clean tree still writes stamp **`ec57342595a1`** (maker and play-stage), unchanged from 6b.
- **Merge tree:** `git merge-tree --write-tree c89e39b6021615d6a8fe2d5dff45dfc637ff9c55 f2de1870c0e1ea86fd3655083f4fb3831b94cc09` is clean and gives **`3832f731820c4a58786ad114790c3645daf34913`**, matching CoS. Diff vs the tip tree `1624456e` is only the three 6b docs: `docs/rebuild/step-06b.md`, `docs/qa/rebuild-step-06b-review.md`, `docs/qa/rebuild-step-06b-recheck.md`.

## Checked OK
- **6c behaviour.** The scripted test starts from `data/templates/empty.tileproj` and `stampNew`, uses only the named exported editor functions, and saves through `planSave` / `memoryStore` / `launchTest` (`checkpoint.test.ts:36-54,100-107`). `start` is called (`:104-105`). `createMatch(docs, 0)` reaches `outcome === "win"` within 30 turns with the Raider dead and the XP strip's level ≥ 1 (`fight` at `:68-85`, asserted at `:84`). The Off-rule test leaves `outcome` null after the Raider falls and End turn (`:108-112,83`). `readProject` is clean, the slice equals `sliceOf(BUNDLED, ids)`, ids are exactly `line-shot`, `terrain`, `unit-roster`, `win-condition`, `xp-levels`, and every setup has D16 answers (`:113-119`). No Demo file, no hand-written project, no level-set picker or offer. The smoke writes `checkpoint.tileproj/` from `window.__read()`, not by hand (HB:172). The p18 intend helpers are not exported, so the fight inlines `intend` / `choose` of the same family (HB:190); that meets Done when L221 in substance.
- **Guide L213 Attack 5 vs Empty `unit_atk` max 2 — documented OK, not a must-fix.** The slice (`data/templates/empty.tileproj/catalogue/slice.json`) has `unit_atk` default 1, min 0, max 2. Catalogue edits are forbidden. The smoke slides the Attack slider to 5 and waits until the shown number is 2 (`smoke.mjs:56`); the dumped Hero has `unit_atk.value` 2; shots 04 / 04b show Attack 2 at the slider max. `setStat` itself does not clamp (`units.ts:24-25`), so the scripted test still writes 5 as the step names (`checkpoint.test.ts:43`); `readProject` does not range-check unit stats (HB:183). The kill is line-shot damage 2 against Raider Health 2, so Attack is not what wins. This is a stale number in guide L213, not a product fail and not a silent omit. A later guide typo can say 2; it must not be "fixed" by raising the slice max.
- **Done-when / smoke split on levels.** L221 requires the named win test to have the XP strip's level ≥ 1; the test turns levels on and sets the first threshold to 1 (`:51-52,79,84`). Guide L213 does not ask the smoke to turn levels on; it does not, and shot 08 is Victory in 2 turns with no strip (HB:185). That is not doc-vs-code drift.
- **Laws.** No product file changed, so no new rAF, clock, cache, pipe, CSS, or dependency. The only new BFS maps are local path helpers in the test and the smoke, bounded by the 6×6 grid. UNIT and TILE remain the only pipes. Maker still does not import into play-stage. Scope matches 6c only. No CEO / CoS / UX / EA / DSK choice is labelled a CEO ruling (L201 / Ruling 2 stay a CoS ruling citing the CEO). No raw `.txt` / `.log` test output is committed in this tip.
- **Check 8 / HB:31.** `see()` / `big()` runs while each listed sheet is open (`smoke.mjs:36` resize, `:44` Add here, `:53` unit name, `:57` Hero editor, `:58` goals, `:60` ability cards, `:61` line-shot panel, `:67` Raider name, `:70` Raider editor, `:74` Add here again, `:76` unit picker, `:82` Rules), then `9 check 8` at `:114`. That matches guide L37 / L213. There is no `see()` on the Victory veil (`:111` only takes the shot); Restart / Back are existing play-stage HUD buttons. Check 8 was ok at 390 and 360 on both of my runs.
- **Shots.** Eight 390×844 light screenshots, as named, matching the captions at HB:163–170. `02` is the blank 6×6 with the free-roam lines and "Nothing to undo". `03` is the wall row with a gap at column 3 and the rightmost W outlined. `04` shows Hero, Health 20, Attack 2, On your team, and the top of the Line Shot card. `04b` scrolls that card fully into the frame. `05` is Raider, Health 2, Attack 1 "Same as army" (the unit is off the team: smoke waits for `aria-pressed === "false"`; the dump roster is only Hero). `06` has Hero at 0,0 and Enemy Raider at 5,5. `07` is the Rules sheet over the dimmed stage, default wipe On. `08` is Victory, "2 turns", Hero 20/20, no level strip. Screenshots are not the builder's gate.
- **Doc vs code.** HANDBACK claims I checked (SHAs, trees, N=3 titles, 119, the over-cap at HB:190, S0 pin, no export audit, Code head, Attack-5 note, Check 8 list, s6c 119 lines) match the tree. HB:3 "PR: none yet from the branch" was true at hand-back / CoS verify time (V:5, V:11).

## Law 12 — every new `catch` / `??` / `||` default in the diff

No product file is in the diff. Every site is in the new test or the smoke, and is fail-closed or the copied smoke-server shape.

**`tests/editor/checkpoint.test.ts`**
- `:35` `got.mode !== "wrote" || got.bag === undefined` — throws.
- `:38` `!isObj(stage0) || !isObj(map0)` — throws `"blank"`.
- `:51` `turned.mode !== "wrote" || turned.slice === ""` — throws.
- `:63` `prev.get(cur) ?? ""` in the BFS reconstruct; a missing key stops the walk. A bad path throws `"path"` at `:66`.
- `:64` `prev.has(key(n)) || !open(n)` — skip a closed or already-seen cell.
- `:79` `(m.view().xp?.level ?? 0) >= 1` — a missing strip counts as 0, so `leveled` stays false and `:84` fails. Not a silent pass.
- `:91-95, 110` `||` guards in the D16 walk and the Off-rule load; they return false or throw, they do not invent answers.

**`handoff/steps/tests/s6c-checkpoint/smoke.mjs`**
- `:3` `process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/"` — env default, same as earlier smokes.
- `:10` `rq.url ?? "/"`, MIME `?? "application/octet-stream"`, and `catch { rs.writeHead(404); rs.end("missing"); }` — visible 404, same as earlier smokes.
- `:14` `process.env.CHROME ??` the headless-shell path — env default.
- `:26` `data-act ?? aria-label ?? tagName` — check-8 labels only; `||` is the undersize predicate (`width < 48 || height < 48`).
- `:28` step `catch` prints the error on the FAIL line.
- `:35, 59, 77` `?? ""` then `if (… === "") throw`.
- `:75, 78` `?? ""` inside a `waitForFunction` includes() check (wait fails closed).
- `:95, 98, 99, 101, 109` `||` in wait predicates, "missing unit/foe" throws, orthogonal-shot geometry, and the Victory cap (`outcome !== "win" || turns > 30` throws).

No empty `catch`. No silent product default.

## Non-blockers
- **Guide L213 still says Attack 5.** Documented at HB:183; see above. Fix the guide later; do not change the slice.
- **Check 8 has no collection on the Victory veil.** Restart / Back are existing play-stage controls. Not a product fail.
- **Chrome / Node.** HB:29 is a Playwright headless shell; I re-ran with `/opt/google/chrome/chrome` 156.0.8078.47. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (this box is v24.22.1).
- **Standing 4a/4b/4c/D22 carries** are still open, as after 6b. The scripted test writes `unit_atk` 5 while the maker stores 2 (`setStat` has no range clamp); named at HB:183, and it does not affect the win.

## Must-fix
None.
