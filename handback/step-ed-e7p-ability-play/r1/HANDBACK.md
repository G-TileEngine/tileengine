# Hand-back step-ed-e7p-ability-play r1
Step file: handoff/steps/step-ed-e7p-ability-play.md (sha256 163fcc298413ceb235f3a14d83d7bda0515f93dd25f01305ce38e1571da4fc58)
Base commit: 70c4d07d7d70cbd209babe3e8bb41564b643e73a     Head commit: 5ce65515796947156006264b5eced9cc655f33b7     Tree: 6f3bafc3dbf34f5bcb96b84f1658f1f8a3f3022d     Branch: step/step-ed-e7p-ability-play-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	docs/host-guide.md
A	src/project/read/effect.ts
M	src/project/read/index.ts
A	src/runtime/scene/cast-fx.ts
A	tests/project/read-effect-qa-e7p.test.ts
A	tests/project/read-effect.test.ts
A	tests/runtime/cast-fx.test.ts
M	tests/runtime/scene/scene-fence.test.ts
A	tools/host-example/match-fx.ts

## Green
npm test: 988/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0. npm test: 988 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 98077.876038. deps 148 modules / 470 deps. check:state OK (src). check:law OK (src).

## Smoke
node tools/pixel-suite/smoke.ts
smoke: 0 failed
node tools/host-example/match-picture.ts
match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands
node tools/host-example/match-fx.ts
match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing
npm run -s sim
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
node tests/perf/stress-budget.ts
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.33 p95 0.57 ms; lap 2 p50 0.25 p95 0.44 ms; lap 3 p50 0.23 p95 0.47 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.41 p95 0.69 ms; lap 2 p50 0.40 p95 0.67 ms; lap 3 p50 0.40 p95 0.69 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.57 p95 3.02 ms; lap 2 p50 1.23 p95 1.73 ms; lap 3 p50 1.23 p95 1.81 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.72 p95 2.32 ms; lap 2 p50 1.78 p95 2.95 ms; lap 3 p50 1.75 p95 2.30 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.13 p95 1.85 ms; lap 2 p50 1.13 p95 2.00 ms; lap 3 p50 1.11 p95 1.91 ms; counts 27/373/0

## Shipped tests (sha256, byte-identical to the kit)
dc8a295b48585915831120b048129d8b724ad44f4bb918917ee2a6b6f22600fb  tests/project/read-effect.test.ts
d6ab84c74637d8c50a1d17f0bc4a78a97b66f76d8f3f2c949d150e809d096d83  tests/runtime/cast-fx.test.ts
78e2e11f8f44887dd9e981f946396ba0131df9372f36e964b1b3fae9ca26b627  tests/runtime/scene/scene-fence.test.ts
564069e948a1333c2d5e4884d23446cf87148227f727d2132a4fcdaf97ea003e  tests/project/read-effect-qa-e7p.test.ts

## Helpers & self-review
- Helper readEffect review (effect.ts against rulings 2–4, guard.ts, limits.ts, read-effect.test.ts and the QA pin): no must-fix. behaviourId is checked before id, formatVersion 2 is needsMigration, default-source omits a missing default and ignores a stray value, 65 keys is over cap answers, own constructor is kept, inherited keys are skipped, steps stay at 13, and each values key is Object.defineProperty so an own "__proto__" answer leaves the prototype as Object.prototype.
- Helper host-example review (match-fx.ts, host-guide §§13–15, hit timing in fx-doc/fx-player/fx-live, file caps and do-not-touch): no must-fix. The printed line is `match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing` (exit 0). values uses Object.hasOwn. Rules 1–12 are unchanged. Caps: match-fx 33/46, host-guide +6/11, effect.ts 36/36, index +1/5, cast-fx 96/106.
- Helper cross-check (line caps, four sha256s, pin prefixes, empty do-not-touch diffs, banned-token grep, cast-fx import allowlist, the four test files, match-fx): no must-fix. Total changed lines 303 ≤ 320. Pins 1e5dd82c, d7f64a09, 45a3dbaa, 4d7bbf48, d6d08696. Imports are only core/log/types, core/notice, core/plain, render/fx-doc and render/fx-live.
- Self-review: Acceptance done. npm ci && npm run green exits 0 with 988/0 (base 981 + 7); none cancelled, skipped or todo. typecheck, lint, deps, check:state and check:law each exit 0. smoke: 0 failed. match-picture prints the stage-fixed line and exits 0. match-fx prints the ability line and exits 0. sim prints stage-fixed 48/2 afc89d56… and stage-weighted 22/28 b8007292…. stress re-run alone prints 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 (one earlier A p95 was over 4 ms under load and was not believed). Pin diff and do-not-touch diff are empty. The four shipped tests match the step sha256s; scene-fence is the ruling replacement, not an added test. File caps hold; 299 insertions + 4 deletions = 303 ≤ 320. No Math.random, Date, timers, storage, Card or Deck in the new src files; no hp/mana/cost/damage in cast-fx or readEffect. QA checklist: G1 done (shipped tests verbatim and passing), G2 done (no ts-ignore, no any, tsconfig untouched), G3 done (check:state OK; no phase writes), G4 done (exported signatures match the quoted interfaces), G5 done (do-not-touch paths absent from the diff), G6 done (only the nine files in the step table), G7 done (303 lines, each file at or under its cap), G8 done (check:law OK), G9 done (decisions below match the diff), G10 done (the Acceptance lines above).

## Decisions & deviations
- Base is 70c4d07d7d70cbd209babe3e8bb41564b643e73a (E7 and P1-6 merged, 981 tests). Floor used is 981 + 7 = 988. The run is 988/0. Changed lines are 303 (299 insertions, 4 deletions), under the 320 cap. effect.ts is 36/36.
- BAD_REF is `__proto__`, `constructor`, `toString` and `valueOf`. Those refs note unknownRef and do not call values. The cache key is `ref@rev`, LRU by delete-and-reinsert, cap 64, per createCastFx. compiles counts docToLiveFx only.
- The seq watermark starts at 0, because log seqs are 1-based, and reset only raises it (max). A `cast:N` id with N ≤ the watermark is refused with no note. The same id is ignored only while that cue is still stored.
- overCap's message is `live` (the live-list cap). Notes stop at 64 and then add `{code:"noticesCapped", message:"and N more"}`, the same shape as capNotes, which cast-fx cannot import. A compile with no pieces notes noPicture with the ref as the message, unless the compiler already noted noPicture.
- loopMs is never set on the live copy. endMs is stepTimes(values).endMs. A cast stays through atMs+endMs and is gone at atMs+endMs+1. effects() returns the same array until the visible list changes.
- cueFromEntry plain-copies the entry at depth 4 and passes the action to refOf inside try/catch (the copy is asserted as Action; via and effects[] are not read). cast plain-copies the cue at depth 3. `"none"` adds no note and no picture.
- Smoke used CHROME_PATH=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome. /usr/bin/google-chrome is not on this machine. The pixel-suite script was not edited.

## Next step (optional proposal)
- P1-8 can import createCastFx and cueFromEntry from this step into tools/play-stage/fx.ts. The match-fx device run stays with the APK showcase (P1-9).
