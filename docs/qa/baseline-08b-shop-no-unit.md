# QA finding: baseline-08b ?scene=shop has no visible or selectable unit, so the stair walk can't be done

QA & Build Guard, 2026-11-24, about 18:10 London. Severity: it blocks the 8b stair phone check. A code fix is needed; nothing the CEO does on the phone gets past it.

## What the CEO saw (18:00, as relayed by CoS)
"There is no units on the screen. Just two long blocks of squares."

## QA repro (live https://g-tileengine.github.io/tileengine/baseline-08b/?scene=shop, headless Chrome 390x844, dsf 3, touch)
1. Open the page and wait for the readout.
2. The board shows only the map: floor, plus the row-2 wall blocks. No unit is drawn.
3. The plate reads 0/0, and the view says selected false.
4. I tapped every point on a 20 px grid across the whole board (390x664). No tap selected anything. Stage changes stayed 0.

## What the data says (source 42cc84b4)
- `openShop()` opens fine. `chosen = [Hero]`, the stage spawn is (0,4), the stairs link is at (1,4), and the map is 6x6.
- `createMatch(docs)` puts Hero at (0,4), on the player side and alive, with no notices.
- So the unit exists in the match, but the baseline page neither shows it nor lets you select it.

## Scope and root cause
- The root cause isn't pinned. It is in the baseline page path (`tools/baseline/page.ts`, which wraps rAF and calls `startMatch`), or in the board drawing and touch on that page. It is not in the shop data.
- The 06c skirmish baseline also showed no unit on the CEO's phone (06c Red Magic shot). That run measured frames only, so it didn't matter there.
- No smoke ever walked the shop stairs on the baseline page. s6d-baseline doesn't open ?scene=shop.
- QA miss: my baseline-08b post-publish check covered errors, 4xx and overflow, but not "a unit is visible and the stairs are reachable".

## What the fix must show
1. A unit is visible on ?scene=shop, and a tap selects it (the plate shows 20/20).
2. A walk onto (1,4) before DONE makes stage changes 1, and worst-after-swap becomes a real number.
3. A smoke step proves step 2 with waitForFunction, at 390 and 360.
4. Then republish (this needs the CEO's typed OK), and QA does the post-publish check with the walk.
