# Hand-back step-ed-e6-designer-page r1
Step file: handoff/steps/step-ed-e6-designer-page.md (sha256 224834771c6cb8cf85cdece10f989194de7f0758e03814dc38ffc12502c0a0db)
Base commit: 75df464243426061340d27372e1e97b485843ded     Head commit: 8737b987e2c4b4352dc55a58512aa7f72ac7a05f     Tree: be577d5d44d5b7e095fe48bf2e231be08d56b403     Branch: step/step-ed-e6-designer-page-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/editor/effect/save.ts
M	src/editor/effect/writer.ts
A	tests/editor/effect-e6-qa.test.ts
A	tests/editor/effect-e6-qa2.test.ts
A	tests/editor/effect-e6-save.test.ts
A	tests/tools/ed-e6.test.ts
A	tools/effect-designer/grid.ts
A	tools/effect-designer/index.html
A	tools/effect-designer/page.ts
A	tools/effect-designer/presets.ts
A	tools/effect-designer/store.ts
A	tools/effect-designer/strip.ts

## Green
npm test: 922/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0. npm test: 922 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 98637.416087. deps 134 modules / 434 deps. check:state OK (src). check:law OK (src).
smoke: 0 failed
match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.35 p95 0.60 ms; lap 2 p50 0.26 p95 0.46 ms; lap 3 p50 0.24 p95 0.47 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.44 p95 0.71 ms; lap 2 p50 0.41 p95 0.65 ms; lap 3 p50 0.41 p95 0.65 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.31 p95 3.74 ms; lap 2 p50 1.23 p95 1.74 ms; lap 3 p50 1.27 p95 1.84 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.72 p95 2.30 ms; lap 2 p50 1.73 p95 2.39 ms; lap 3 p50 1.74 p95 2.41 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.07 p95 1.39 ms; lap 2 p50 1.07 p95 1.40 ms; lap 3 p50 1.06 p95 1.38 ms; counts 27/373/0

## Smoke
Browser smoke (REQUIRED), Chromium headless, 390×844, deviceScaleFactor 3, touch, `node tools/serve.ts` then `/tools/effect-designer/?for=basic-attack&kind=melee`.
- Tile count: 1, label "Slash arc". Strip canvas 390×253. Title "Designing for basic-attack".
- rAF callbacks per frame after the re-boots (Turn, 1×, 2×, 3×): max 1, 0 frames with more than 1 (90 frames).
- After Save & use, toast "Saved 'Slash arc' and basic-attack uses it. One undo." OPFS: `setups/basic-attack.json` + `effects/setup_VXM5EHMMHDQC9N4RZ9JDEE9A7B.json`.
- After Undo, toast "Undone." OPFS: the effect is `effects/.deleted/setup_VXM5EHMMHDQC9N4RZ9JDEE9A7B.json`, owner `setups/basic-attack.json` kept.
- After a second Save & use, toast "Saved 'Slash arc' and basic-attack uses it. One undo." OPFS: `setups/basic-attack.json` + `effects/setup_GJGZWDWFB3CEM7TNJ6T2GRJW5W.json`. The `.deleted` file is purged.
- Button sizes: 18 buttons, every one at least 48×48 CSS px (smallest 48×48). None under 44.
- Page errors: none. Console: one 404 (`Failed to load resource: the server responded with a status of 404`). `/favicon.ico` is 404; the page has no favicon link. No script error.
- Bad owner file, files unchanged in each case: junk and `[]` toast "Not saved: can't read setups/basic-attack.json (unreadable). Nothing was changed." `{}` toast "Not saved: can't read setups/basic-attack.json (no setup envelope). Nothing was changed."

## Shipped tests (sha256, unchanged)
342b20a5350931c8bd473f513c6fe186691f45af2787fe170848726e7546b6a0  tests/editor/effect-e6-save.test.ts
3b828a0e1da111de0c63b30e1da732d1391e8287b8b250c7fce70a499fdbaf87  tests/tools/ed-e6.test.ts
738e46f5667fc952e15ceae6587a291a83cdae995820315e101c1ecfe7f7a139  tests/editor/effect-e6-qa.test.ts
1a053e5831cab8c285caf047f82f20a827b3c56dd58d38b83d8739b37398ce99  tests/editor/effect-e6-qa2.test.ts

## Helpers & self-review (required)
- Helper save/writer (read-only, rulings 2–7 and 14 against `save.ts`, the `writer.ts` diff, and tests 1–8 and 14–18): launched and still silent after 8 minutes, then cancelled. The same pass was done in this chat. `saveAndUse` mints one `grp_` group, writes the effect then the owner, lists a doc only when the write changed it, and reserves `effects/.deleted/<id>.json` for a created doc. A new id must match `SAVE.id`, must not be in `taken`, and the file must be `effects/<id>.json`; an existing doc is not re-checked. `undoGroup` walks newest first, refuses the whole entry with nothing half-undone, and moves a created doc (even one with no ops) to the trash with its history. `commit` checks every doc, move source, move target and absent name before any write; a missing `expectedRev` means must-not-exist; unreadable or non-object JSON is `got: 0`; write order is trash copy, new docs, existing docs, then source remove, with reverse rollback. `ownerOf` accepts null as a new owner and a setup envelope as-is, and refuses junk and a record without the envelope by name. `notesOf` order matches test 3. `same` sorts keys at every depth and keeps array order. `undo({alone:true})` takes the top open op; `undoStep` uses it only when plain `undo` returns the same doc. No defect. No code change from that pass beyond the toast line below.
- Helper page/smoke (read-only, `tools/effect-designer/*` against test 13 and the 390×844 smoke): launched and still silent after 8 minutes, then cancelled. The same pass was done by running the page. Test 13's needles are in `page.ts` and `index.html` (both catch handlers, IntersectionObserver, OPFS, pixelated strip, owner refusal before write). The browser run above is the result: 1 tile, rAF max 1, Save/Undo/second Save, 18 buttons ≥ 48, no page error, bad-owner toasts with files unchanged. No defect.
- Self-review: Acceptance done — tests 922/0/0/0 (duration_ms 98637.416087), typecheck/lint/deps/check:state/check:law exit 0; `smoke: 0 failed` (Chromium via `CHROME_PATH`, because this box has no `/usr/bin/google-chrome`); host example prints the tick-460 line and exits 0; sim `afc89d56…` and `b8007292…`; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0, every lap p95 under 4 ms; pin diff vs the Base empty (`1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`); runtime, sim, core, fx, project, device-page, pixel-suite, fit, merge, parts, dice and house diff empty; four shipped sha256s match; 349 changed lines, each file inside its cap; no `Math.random`, `Date`, timers, `localStorage`/`sessionStorage`/`indexedDB` or `Card`/`Deck` in `src/`; no hp/mana/cost/damage in the designer; storage only through the page's OPFS `Store`. Browser smoke quoted above. QA checklist G1 done (four shipped files verbatim, 18 tests ran), G2 done (tsc exit 0, eslint exit 0, no ts-ignore, no `any`), G3 done (no phase writes; `src/state` untouched), G4 done (`SAVE`, `Store`, `Docs`, `Entry`, `Move`, `Commit`, `blankEffect`, `notesOf`, `undoStep`, `trashOf`, `ownerOf`, `saveAndUse`, `undoGroup`, `commit`, `undo(doc, at, o?)`, `INTENTS`, `intentFor`, `tagsOf`, `rampChips`, `recolour`, `tiles`, `PRESETS`, `STRIP`, `VIEW0`, `turn`, `zoom`, `seen`, `preview`, `Dir`, `opfsStore` match the quoted signatures), G5 done (do-not-touch paths absent), G6 done (only the twelve files in the step table; this hand-back folder is the required delivery), G7 done (349 ≤ 355; caps save 65/69, writer 7/11, grid 15/24, presets 12/16, strip 16/23, store 16/19, page 50/52, html 7/10, tests 87/40/21/13), G8 done (deps 134/434, check:state and check:law exit 0; one clock unchanged), G9 done (decisions below), G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- The CEO chat set the Base to `75df464243426061340d27372e1e97b485843ded` (P1-2 is on main) and the floor to at least 922. The step file still names `41ac9bcc` and 900, which was main before that merge. The diff is `75df4642..head`. 922 = that base's 904 tests + these 18. The step file wins over the paste; this base is the chat, not a silent change.
- 349 changed lines (src 72, tools 116, tests 161), under the 355 cap. No file outside the twelve. No new dependency. Pins unchanged from the Base. Depcruise here is 134 modules / 434 deps because the Base is later than `41ac9bcc` (the step file's 128/410).
- A clean Save & use toast is exactly `Saved '<label>' and <for> uses it. One undo.` When `notesOf` returns any, those messages are appended in the same toast (ruling 5). Group ids are `grp_1`, `grp_2`, … from one session counter (`mint`). Effect ids are `setup_` plus 26 Crockford characters from `crypto.getRandomValues` in `page.ts` (S3 stays an E7 carry). `at` is `new Date().toISOString()` in the page only.
- The page keeps one `Entry`, the current docs, one rev per touched name, the trash names of that one entry, and the `taken` id set. The driver is disposed on every reboot and whenever the strip is not intersecting. Nothing grows per frame. A new owner, when the file is missing, is a v3 envelope with `behaviourId` and `id` taken from `?for=`, catalogue rev 28.
- The strip opens at 3× (`VIEW0`). Colour options passed by the page are `fire`, `frost`, `holy`, `venom`, filtered by `?ramps=` (default all four). Canvas clear and page background are `#203040`. Buttons use `min-width:48px;min-height:48px`. `Dir`'s handle type is named `FileHandle`, as in the quoted interface, and is not exported.
- Trash that survives a reload (S2) and moving the ULID mint out of the page (S3) are carried to E7, as the step says. Not fixed here.

## Next step (optional proposal)
- E7 can rebuild the `.deleted` purge list from the folder at boot, move the ULID mint into a DOM-free module, and automate this smoke from `smoke.mjs`. Not a change here.
