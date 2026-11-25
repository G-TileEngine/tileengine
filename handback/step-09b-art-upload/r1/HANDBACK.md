# Hand-back step-09b-art-upload r1
Step file: docs/maker/steps/step-09b-art-upload.md (r2, sha256 1cd3ec431bdd4a4535a369fad7b957e52ff8dec19262cf8b9652e689d057a29c, 120 lines). DSK: handoff/dsk-rulings/2026-11-17-phase1.md L77 (sha256 90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8).
Base commit: 8572cd054cccb98761bd6e9a51d77933ed2bfcbd     Code head: cd6c4e0c6b4a8abe189d94d0af0e6028dc17fb40     Code head tree: a17d3728d26df022458d78c3b02762c25e7d9563     Branch: step/step-09b-art-upload-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged.

## Changed files
```
A	handoff/steps/tests/s9b-art-upload/smoke.mjs
A	tests/editor/art-upload.test.ts
A	tools/maker/art.ts
M	tools/maker/home.ts
M	tools/maker/stage.ts
M	tools/maker/store.ts
M	tools/play-stage/backdrop.ts
M	tools/play-stage/board.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/page.ts
A	tools/play-stage/picture.ts
```
`git diff --shortstat 8572cd054cccb98761bd6e9a51d77933ed2bfcbd..cd6c4e0c6b4a8abe189d94d0af0e6028dc17fb40 -- . ':!handback/**'` is `11 files changed, 324 insertions(+), 30 deletions(-)`. 324 + 30 = 354. Under 400.

Caps (insertions + deletions): picture.ts 35/35, backdrop.ts 17/18, page.ts 9/12, board.ts 7/12, hud.ts 9/12, store.ts 13/24, art.ts 70/70, home.ts 26/32, stage.ts 3/6, art-upload.test.ts 98/100, s9b smoke 67/70.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1141 (base 1135 + named tests 1–6). Node's test runner prints `ok`, not `✔`.
```
# tests 1141
# pass 1141
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0. check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L88.

## Smoke
s9b `node handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS (390 and 360). Shots were not committed.
```
ok   1 new @390: ok
ok   2 upload @390: ok
ok   3 refusals @390: ok
ok   4 draws @390: ok
ok   5 too big @390: ok
ok   6 duplicate @390: ok
ok   7 continue @390: ok
ok   1 new @360: ok
ok   2 upload @360: ok
ok   3 refusals @360: ok
ok   4 draws @360: ok
ok   5 too big @360: ok
ok   6 duplicate @360: ok
ok   7 continue @360: ok
SMOKE PASS
```
Unedited, all PASS:
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS. File sha256 0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808 r1` — 14 ok, SMOKE PASS. `CHROME` pointed at the sandbox headless shell; `/usr/bin/google-chrome` is not installed. The file was not edited.
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS. File sha256 d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941. Same `CHROME` setting. The file was not edited.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing the three builders (dev false, commit forty zeros) and was not committed. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` is empty. `find` for `catalogue.json.js` and `behaviours.json` is empty. `window.__play` is absent.
```
play	133 files	grep empty	find empty
baseline	147 files	grep empty	find empty
maker play-stage	133 files	grep empty	find empty
```
AUDIT PASS

## Shipped tests (sha256)
The step file does not pin a shipped test. The new test file, as committed:
```
bc30f46be563284c3bb644c8dcc073c64fd9d841c61f99fb7a86dbba15766bb5  tests/editor/art-upload.test.ts
```
No existing test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper 930304a9: review the 09b diff against the guide (sniff before write, one commit, caps, Law 12, no new code) → one blocker. `loadLayer` awaited `art()` outside `try`, so a throw rejected `Promise.all` and dropped every layer's note. Fixed in the code head: the read, the sniff, the size check and the decode sit in one `try`; a throw is `Background picture <file> couldn't be opened`; `bmp.close()` stays in `finally`; a null blob stays the missing line. Test 5 asserts an `art()` throw. No other blocker.
- Helper 155ede2a: review `s9b-art-upload/smoke.mjs` against the step and the play/maker paths it depends on → SMOKE LOOKS SOUND. No change.
- Helper 6f54837c: a review started before this pass was cancelled and returned no findings.
- Self-review: Done when — green 1141/0 done; tools tsc only the 3 base errors, home.ts at L88 done; 354 ≤ 400 and every cap kept done; s9b 14 ok SMOKE PASS done; s9 12, s8 16, s8c 8, s6d 14, S0 14 all PASS and unedited done; export audit empty done. QA G1 named tests 1–6 exist and the art-throw plant is caught done; G2 root typecheck exit 0, no new ignore or loosened strictness done; G3 check:state done; G4 no quoted interface was rewritten done; G5 no src, data, fixtures, behaviour-library, painter-proto, ui-shell, levels.ts or match.ts, and no existing test or smoke edit done; G6 only the build-table files done; G7 354 and per-file caps done; G8 check:law and one clock done (no new rAF, timer or loop); G9 decisions below done; G10 acceptance lines done.

## Decisions & deviations
- Type and size come from the bytes before any hash or write. A non-picture is `uploadTypeUnsupported` with `{fileName, sniffed}`. A picture over 4096 px on a side is the plain line and no report row (EA ruling Q1). An animated PNG or WebP stays png or webp; the size is the header's. Nothing is decoded, sliced or re-encoded.
- The index entry is name (the stem, at most 64 characters, or "Picture"), ext, `origin: {kind:"upload", fileName}` and `kind:"background"`. The id is `asset_` plus the first 16 hex of sha256 of the uploaded bytes. The layer is `{assetId, depth:1, repeat:"none"}`. The bytes and the plan writes go in one `commitWrites`, bytes first. A failed save uses the existing "Couldn't save … Your phone may be full. Your last save is safe."
- `loadLayer` keeps the 9a missing text for no `art` and for a null blob. Any throw, including `art()`, a bad header or `keep()`, is "couldn't be opened". Over `MAX_SIDE` is named and `open()` is not called. `close()` runs in `finally`. `page.ts` adds 1 to `failed` per miss, in layer order.
- The sheet escapes `&`, `<`, `>` and quotes. An apostrophe is `&#39;`, built with `fromCharCode`, because the type stripper turns a raw entity into source. The note `×` is `#noteX::before`, so `#note` textContent stays the note. The close control is at least 44 px.
- Continue re-reads the slot at `projectHash: rev:<rev after launch>` and `paint()` is on that same line, so the banner is drawn even if play has already started. `behaviourId` stays at `home.ts:88`. `dropUndo` sets `sess.stack` to `[]` after a successful add or remove (EA ruling Q2).
- Duplicate reads each `assets/` file with `readBlob` and writes those bytes in the same `commitWrites`. A missing `assets/` lists as `[]`. `memoryStore` keeps bytes in a separate `bins` map. `makerStore.writeBytes` casts `FileHandle.write` through `unknown` because that method is typed as a string.
- `board.scene()` keeps one assets object while the units' sprite list is unchanged, and `bare()` drops it. No new rAF, timer, loop or dependency.
- `/workspace/share/s8/s8-audit.mjs` is not on disk. The check above was reproduced and not committed. Direct counts are 133 / 147 / 133. s6d and S0 were pointed at the sandbox headless shell; those files were not edited.

## Next step
- 09c (link markers on the play board) is a separate guide and was not started here. Still open, and not 9b: `levels.ts` L64, `match.ts:80` `landed('')`, K6 slice-on-import, Shrink to fit, Scroll speed and Repeat controls, and `settings.maxImageSide`.
