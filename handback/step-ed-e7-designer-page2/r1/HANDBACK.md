# Hand-back step-ed-e7-designer-page2 r1
Step file: handoff/steps/step-ed-e7-designer-page2.md
Step file sha256: cc3a3fa7c737e8804a7e265763c161f989e389757929a65635281bda3f27a29c
Base commit: 3ca06e6d0a4b0eccc9412e7b55b51949c054538a     Head commit: 35bc38837f9d67cfe0b63de2ac34140197ca7dc8     Tree: 7ca78810d2c621a87acfe574520445c992dedced     Branch: step/step-ed-e7-designer-page2-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/editor/effect/dice.ts
M	src/editor/effect/save.ts
M	src/editor/effect/writer.ts
A	tests/editor/effect-e7-carries.test.ts
M	tests/tools/ed-e6.test.ts
A	tests/tools/ed-e7.test.ts
M	tools/effect-designer/index.html
A	tools/effect-designer/mixer.ts
M	tools/effect-designer/page.ts
M	tools/effect-designer/presets.ts
M	tools/effect-designer/store.ts
M	tools/effect-designer/strip.ts
A	tools/effect-designer/ulid.ts

## Green
npm test: 973/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Floor 973 (base 957 + 16). duration_ms 101431.449257. deps: no dependency violations found (146 modules, 462 dependencies cruised) — the kit's 128/410 is the older stack; this base is unchanged.

## Smoke
`CHROME_PATH=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node tools/pixel-suite/smoke.ts` (this box has no `/usr/bin/google-chrome`):
```
ok   start: still drawing
ok   lite on: the scene gets lite on (60 ms pose grid)
ok   lite off: the scene gets lite off (30 ms pose grid)
ok   60 fps cap on: still drawing
ok   60 fps cap off: still drawing
ok   run again: still drawing
info canvas MB 2.5 (main canvas alone 1.0 MB)
ok   no page error
smoke: 0 failed
```
`node tools/host-example/match-picture.ts`:
```
match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands
```
`npm run -s sim`:
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
`node tests/perf/stress-budget.ts` (re-run alone after one C lap p95 of 4.26 ms under load):
```
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.32 p95 0.59 ms; lap 2 p50 0.26 p95 0.50 ms; lap 3 p50 0.24 p95 0.63 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.42 p95 0.71 ms; lap 2 p50 0.40 p95 0.67 ms; lap 3 p50 0.40 p95 0.62 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.35 p95 2.39 ms; lap 2 p50 1.28 p95 2.03 ms; lap 3 p50 1.29 p95 1.95 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.71 p95 2.30 ms; lap 2 p50 1.72 p95 2.33 ms; lap 3 p50 1.72 p95 2.42 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.10 p95 1.77 ms; lap 2 p50 1.06 p95 1.67 ms; lap 3 p50 1.08 p95 1.69 ms; counts 27/373/0
```
Kit browser smoke, 390×844 touch @3x, `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core` (playwright-core 1.59.1, outside the repo) `CHROME=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome node handoff/steps/tests/step-ed-e7-designer-page2/smoke.mjs . 8791 /tmp/ed-e7-smoke.png`:
```
ok   strip paints: 98670 painted px
ok   strip opens at the largest fitting scale (UX r2): ["Fit"] canvas 390x253, scale 23 (7.7x css)
ok   Save & use: "Saved 'Slash arc' and basic-attack uses it. One un" ["effects/setup_01M7N0GC05ES7DAYZ1XRDRF343.json","setups/basic-attack.json"]
ok   Undo: ["effects/.deleted/setup_01M7N0GC05ES7DAYZ1XRDRF343.json","setups/basic-attack.json"]
ok   Redo: ["effects/setup_01M7N0GC05ES7DAYZ1XRDRF343.json","setups/basic-attack.json"]
ok   owner uses it after Redo: effect="setup_01M7N0GC05ES7DAYZ1XRDRF343" last op redo
ok   Undo again: ["effects/.deleted/setup_01M7N0GC05ES7DAYZ1XRDRF343.json","setups/basic-attack.json"]
ok   reload purges effects/.deleted/ (S2): ["setups/basic-attack.json"]
ok   D8.1(a) redo with its .deleted copy gone fails cleanly: "Not redone: its deleted copy is gone (a reload cleared it, maybe in another tab)" ["setups/basic-attack.json"]
ok   layer chips + meter (UX-L1): ["shape","punch"] ["Particles 0 of 48 · Draws 2 of 60"]
ok   shelf (UX-L5): ["Shelf it","Pop","Slash arc"]
ok   Take a layer offers the other card's layers (UX-L4): ["Take its sparks","Take its punch"]
ok   Take its sparks: ["shape A","sparks B"]
ok   Blend card + A/B badges (UX-L3): ["shape A+B","sparks A+B","punch"] ["Base Pop"]
ok   trim line never silent, with Undo: ["Particles 12 of 48 · Draws 14 of 60","Slash arc step 1 starts before 0: moved to 0"]
ok   trim Undo goes back one: ["shape A","sparks B"]
ok   Swap: ["Base Slash arc"]
ok   Mix snaps: ["75"]
ok   Breed 3 at a time (UX-B1): ["Breed","Child 1","Child 2","Child 3","Next 3"]
ok   Next 3 plays child 4: ["Breed","Child 4","Child 5","Child 6","Next 3"]
ok   dice strip (UX-L6): ["Dice sparks","#1","#2"]
ok   a roll replays: ["Dice sparks","#1","#2"]
ok   house style blank (UX-L7): ["sparks","punch"]
ok   Advanced beat row, Travel with no 'arrives later' label: ["Cast 0","Travel 0","Hit 0","Linger 1 0–480 ms"]
ok   per-key picks (Advanced): ["shape:cast both","shape:hit both","sparks:hit both","punch:hit both"]
ok   a key cycles to A: "shape:cast a"
ok   Save & use a blend: Base Slash arc "Saved 'Slash arc × Pop' and basic-attack uses it. One undo. "
ok   strip paints the blend: 98670 px; label Arrow
ok   owner junk refused: "Not saved: can't read setups/basic-attack.json (unreadable). Nothing w"
ok   owner null refused: "Not saved: can't read setups/basic-attack.json (unreadable). Nothing w"
ok   owner array refused: "Not saved: can't read setups/basic-attack.json (unreadable). Nothing w"
ok   owner {} refused: "Not saved: can't read setups/basic-attack.json (no setup envelope). No"
ok   one rAF callback per frame: 90 frames, 0 with >1
ok   touch targets >= 44x44: 42 buttons, small []
ok   no sideways scroll at 390: scrollWidth 390
ok   D8.2 no localStorage, sessionStorage or IndexedDB: {"ls":0,"ss":0,"idb":0}
ok   page errors: none
SMOKE PASS
```

## Shipped tests (sha256, unchanged)
```
31a4d5b7dce52f3805c5f135035c10f2ff27c9c046f9bb78fc85046b4793c3c4  tests/editor/effect-e7-carries.test.ts
1571a811f331cb8cb6eea2634a3d8a006962925a34969da70ae06c89ffbfbdb8  tests/tools/ed-e7.test.ts
c251876c4def246034461e277b4f3718cc9165c82c70b0e396e6a78bbad06448  tests/tools/ed-e6.test.ts
```
Smoke kit sha256 (not copied into the repo): 922ffb26bba8ff9d1f7d55cad7ffd925d6bf29c24d27576477a428079a25ac59

## Helpers & self-review
- Helper caps/pins: counted `git diff --numstat` plus untracked lines, forbidden paths, the three shipped sha256s, and a grep for Math.random / localStorage / sessionStorage / indexedDB. Found PASS at 334 lines before the rAF margin, every file inside its cap, forbidden diff empty, hashes match, designer grep clean. No files edited.
- Helper smoke walk: read page, mixer, save, writer, dice, store, strip, ulid, presets, and smoke.mjs, then walked take/blend/breed/blank/save/undo/redo/D8 in Node. Found PASS against the shipped tests and the smoke's chip, shelf, toast, and rev checks. Did not run the browser. Flagged five risks (fit before layout, OPFS NotFound, distinct dice seeds, hasText joins, one rAF). No files edited.
- Self-review: the browser smoke then failed `one rAF callback per frame` with 0 frames. The strip's box sat 4px above the viewport (scroll 278, bottom -4) after the zoom chips were scrolled to the top edge, so the intersection pause disposed the driver and the chip clicks did not start it again. Fixed by a 320px observer rootMargin and by the Turn/Fit/zoom clicks calling `seen(view, true)` before `boot`. Re-ran the kit smoke: 90 frames, SMOKE PASS. Recount after that fix is 336 changed lines (295 insertions, 41 deletions), still ≤ 376.
- Acceptance: green 973/0 done; pixel `smoke: 0 failed` done; host match-picture line done; sim `afc89d56…` and `b8007292…` done; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 done (p95 flake re-run alone); pin diff empty done; runtime/sim/core/fx/project/device-page/pixel-suite/painter-proto/ui-shell/fit/merge/parts/house/grid diff empty done; three shipped files byte-identical done; caps done (save 15/22, writer 4/8, dice 2/7, ulid 7/8, store 13/13, strip 5/11, mixer 40/47, page 102/128, html 4/15, carries 65/65, ed-e7 62/62, ed-e6 4/4, presets 13/22, total 336/376); kit smoke SMOKE PASS done; no Math.random and no localStorage/sessionStorage/indexedDB in the designer, randomness only via crypto.getRandomValues, no hp/mana/cost/damage done; delivery is this commit then one push, done in the hand-back message.
- QA checklist: G1 done (three shipped files verbatim). G2 done (tsc 0, eslint 0, no ts-ignore, no any added). G3 done (no phase writes; src/state untouched). G4 done (redoGroup, trashGone, ulid/minter, purgeTrash, fitZoom, mixer names match the quoted interfaces). G5 done (do-not-touch paths absent). G6 done (only the 13 listed product files; this folder is the required hand-back). G7 done (336, each file inside its cap). G8 done (deps/state/law exit 0). G9 done (decisions below). G10 done (no second driver; shelf 48, picks 3, rolls 6, children 6, one previous effect, one redo entry).

## Decisions & deviations
- Preset bodies are not on this base (E6 left stubs). Slash arc is two shape steps at 0.15s plus shake 1 (chips shape, punch). Pop is one particles step plus hit_stop_ms 40 and shake 1 (sparks, punch, no shape). Arrow is two shape steps at 3s and no punch, so keysOf(Arrow, Halo) omits punch:hit and Slash+Arrow still emits a join message. Mend is stamp then particles. Burst tiles stay pop, scorch. PRESETS[0] still has two pieces and no tint_ramp. VIEW0.zoom stays 3.
- A shelf card's id is its label, so newest-first text is "Pop" then "Slash arc". Picks toggle by that id. Take/Blend/Breed/Dice/Blank replace the working effect (`chosen`); the grid tile is only the preset that was tapped. Trim Undo keeps one previous working effect and does not touch the document undo.
- Blend is `blend(m.a, m.b, …)` with no swapped arguments. A is the first picked card. Mix starts at 50. A non-finite mix snaps to 50; other values go through snapMix. Take sets the taken layer's keys, including punch:hit, to b and every other key to a.
- The intersection observer uses rootMargin 320px (larger than the 253px strip) so the driver stays live when the browser scrolls the zoom chips to the top edge. Turn, Fit, and 1×/2×/3× also set visible true before boot, so that tap restarts a paused strip. Off-screen still pauses once the strip is more than 320px outside.
- seqOf is the highest integer seq or baseSeq, plus 1. flash_seconds converts only when finite. breed keeps a parent only when it and its doc are records. Shelf ≤48, picks ≤3 (oldest drops), rolls ≤6, children 6 shown 3 at a time, one redo of one Save & use. Nothing is stored in localStorage, sessionStorage, or indexedDB. The mint stays DOM-free in ulid.ts.
- No core-types, package, or dependency-rule change. src deps stay this base's 146 modules / 462 deps.

## Next step (optional proposal)
- E8 can take the still-open writer items (knob "5", migrate barrier, canonStep by name) plus addPart and per-layer nudge. Shelf and house style stay in page memory until the project loader.
