Build step-ed-e7-designer-page2 r1 (kit-1 **r2**) from the step file `handoff/steps/step-ed-e7-designer-page2.md` on main (sha256 `08f2ef8cba9b894ccaa1dc7fe1a8a8a23744481b2a9318db1e37ca4f622b6d15`); it wins over this paste.

Base commit: **current `main` when you start**, which must contain the **ED-E6 merge**; quote its full sha. If E6's code is not on main, or its API differs from what the shipped tests import (step file § Interfaces to match), stop and report. Branch: **`step/step-ed-e7-designer-page2-r<N>-chatA`**, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Builds: one builder chat (ChatA), one QA review, and a rework round (r2, r3…) if QA finds must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff).
Delivery (CN-028, token issued 2026-11-17): commit `handback/step-ed-e7-designer-page2/r<N>/HANDBACK.md` as the branch's last commit (author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`), then push once, through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-ed-e7-designer-page2-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line). The CEO gives you the token in chat once, at the start: keep it as `GH_BUILDER_TOKEN`, set with `export GH_BUILDER_TOKEN=...` in the shell that runs git (without `export` the credential helper sees nothing; never write a real value); never print, echo, log or commit it, never store it in `.git/config` or a saved remote; if it ever appears in output, say so (the CEO revokes and reissues it). Never write the builder account's numeric id; never write a token value anywhere. Push that `step/**` branch only: never `main`, never a tag, never force-push (the rulesets block all three), no branch delete, no PR actions. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the branch`. Your hand-back message quotes the branch name, the full 40-character tip sha, its tree, the Base sha, the test counts (`pass N fail 0`, floor = main's count at the Base + 16) and the kit-run browser smoke output.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

Shipped files (copy byte-identical from `handoff/steps/tests/step-ed-e7-designer-page2/` to the same paths at the repo root): `tests/editor/effect-e7-carries.test.ts`, `tests/tools/ed-e7.test.ts`, `tests/tools/ed-e6.test.ts` (replaces E6's, changed by ruling). Run, do not copy: `smoke.mjs` (the kit-run browser smoke at 390 × 844, REQUIRED, all lines quoted in HANDBACK.md). Floor: green at least main's count at the Base + 16 passing, 0 failing. At most 282 changed lines. Pins unchanged. Noreply author and committer. Push only your own step branch (CN-028). After E7 merges: HARD STOP for CEO phone test 1.

## Goal
After this step the Effect Designer has its second page, below **Save & use** (the 3-tap Save path is unchanged):
1. **Layer chips + meter (UX-L1, §4.2 rule 4).** One chip per layer the working effect uses (≤6, kind order: shape, colour, sparks, light, punch, trail), each with its A/B badge after a merge, then the meter "Particles N of 48 · Draws N of 60" and, when a merge trimmed or fixed something, the **one trim line** with an **Undo** button (never silent).
2. **Advanced (one `<details>` card).** The **beat row** (Cast, Travel, Hit, Linger: step count and span in ms) and, while a Blend card is open, the **per-layer picks** (each `layer:beat` key cycles Both → A → B → Mix).
3. **Shelf (UX-L5).** "Shelf it" puts the working effect on a horizontal row of cards (newest first, one per id, ≤48, page memory). Tapping a card picks it (≤3).
4. **Take a layer (UX-L4).** With one card picked: "Take its <layer>" for each layer that card uses; the working effect keeps its other layers.
5. **Blend card (UX-L3).** With two cards picked: "Blend with…" opens the card: the base's name, **Swap**, and **Mix** snaps 0, 25, 50, 75, 100. The result plays live and becomes the working effect, with its badges and trim line.
6. **Breed (UX-B1).** With 2–3 cards picked: **Breed** gives 6 children shown 3 at a time; the strip plays one (tap another to play it); **Next 3** pages (wraps).
7. **Dice (UX-L6).** With a layer chip selected: **Dice <layer>** rerolls that layer from the effect it started from; the last 6 seeds are a strip (`#1`…`#6`) that replays a roll.
8. **House style (UX-L7).** Punch 0–3 and Motes chips plus the selected ramp chip feed `readHouse`; **New blank** makes a blank effect with them (only blank docs get the house style).
9. **E6 carries.** The `setup_<ULID>` mint moves to DOM-free `tools/effect-designer/ulid.ts` (S3); a reload purges the `*.json` files in `effects/.deleted/` and nothing else (S2, D8.1(b)); after **Undo**, **Redo** puts back exactly what Save & use wrote, across both documents, and if the `.deleted` copy is gone it warns, writes nothing and drops only that redo (D8.1(a)); QA's E5 report-only writer items: seqs `[5, 3]` go on at 6, `flash_seconds` NaN or Infinity is not converted, and a hole, `[]` or a doc-less Breed parent is skipped.
10. **Strip scale (UX r2).** The strip opens at the largest integer scale at which the 3 × 2 board fits its card (3× floor; pixelated, centred); a **Fit** chip returns to it next to 1×, 2×, 3×.
11. **Kit-run browser smoke.** `handoff/steps/tests/step-ed-e7-designer-page2/smoke.mjs` automates E6's manual smoke plus every page-2 row (0 repo lines; required in the hand-back).

## Rulings
1. **One step.** 278 changed lines ≤ 400 (scope E7: split only if over). Base = current main with E6 merged; floor = main's count at the Base + 16.
2. **S3 (QA E6 r2): the mint.** `ulid(now, bytes)`: 10 Crockford base-32 chars of `Math.floor(now)` (a bad clock gives "0" chars), then one char per byte for 16 bytes; `minter(now, random)` returns `(prefix) => prefix + ulid(now(), random(16))`. `page.ts` keeps D6.1's `taken` set and calls `minter(() => Date.now(), (n) => crypto.getRandomValues(new Uint8Array(n)))`. E6's page test 13 drops its alphabet needle for `"minter("` (§ Existing tests changed by ruling).
3. **S2 (QA E6 r2): a reload closes the undo window; DSK D8.1 OK.** At boot `purgeTrash(store)` lists `effects/.deleted/` (`opfsStore(...).list(dir)`, OPFS `keys()`, sorted; a missing folder lists none; another error is thrown) and removes each name matching `^[^/]+\.json$` there (best-effort: a failed remove is skipped). Sub-folders and odd names are skipped, and a live `effects/*.json` is never touched (D8.1(b), test 7).
4. **Redo across documents (setup §4 rule 10).** `redoGroup(docs, entry, moved, at)` walks `entry.docs` in write order. A created doc must be one of the Undo's `moved` (its trash copy) and must not exist meanwhile; a fresh one (no ops) moves back unchanged, otherwise it gets `writer.redo`. Every other doc gets `writer.redo`. Any `redo` that appends nothing, or an op outside `entry.group`, refuses by name (`SAVE.refused`), as `undoGroup` does. The page commits with `{ moves }` (trash → name, `expectedRev` checked both ends), shows **Redo** only right after **Undo**, and a new Save & use closes the redo. **D8.1(a):** if the `.deleted` copy is missing, `commit` refuses before writing anything (a missing move source is `staleRev`, `got` null) and `trashGone(r, moves)` names it; the page then toasts "Not redone: its deleted copy is gone (a reload cleared it, maybe in another tab). Nothing was changed.", drops only that redo entry and keeps every document's own history (test 6). Any other `staleRev` keeps the redo.
5. **QA E5 report-only items fixed here:** `seqOf` = the highest integer seq (or `baseSeq`) + 1; `canonStep` converts `flash_seconds` only when finite; `breed` keeps only parents that are records with a record `doc`. The rest stay carried (§ Not in this step).
6. **Page 2 is never on the Save path** (scope §5 L82, UX). Its rows sit below the toast; chip → preset → Save & use stays 3 taps. Every page-2 result becomes the working effect (`chosen`), so Save & use saves it with its label (for example "Slash arc × Pop").
7. **Layer chips** come from `keyOf` (part kind, else particles → sparks, else shape); a Punch chip shows when any of `hit_stop_ms`, `hit_white_ms`, `shake`, `squash` is set and not 0 or false. The badge is the one side that won every key of that layer (`A`, `B`), `A+B` when they differ, none before a merge.
8. **Meter and trim line.** `meter(doc, notes)` where `notes` are the last merge, roll or Breed messages; the line is shown without its " · Undo" and the page draws **Undo**, which goes back **one** working effect (UX-4; the default stands).
9. **Travel label retired.** Scope §4.1 shows "Travel arrives in a later update" only until E2 merges; E2 is merged (PR #56), so the beat row shows Travel like the other beats and no page text says "arrives later" (UX-1; the default stands).
10. **Blend card.** A = the first picked shelf card, B = the second; the base starts at A; Swap flips it; Mix starts at 50 and snaps via `snapMix`; the result is exactly `blend(a, b, { base, mix, mint, picks })`. Picks default to Both; Advanced cycles one key at a time. Haptic ticks are left out (UX-3; the default stands).
11. **Take a layer** is buttons, not long-press (no drag-only or press-only actions, §4.4), and offers the other card's layer kinds (no separate "timing" entry; UX-2, the default stands). It is `blend(base, other, { base: "a", mix: 0, picks })` with every key of the taken layer set to `b` and every other key to `a` (`punch:hit` included), so budgets, trims and badges apply.
12. **Shelf** lives in page memory (CN-022 `effectShelf` waits for the project loader; **DSK D8.2: OK, no ad-hoc persistence**: no localStorage, sessionStorage or IndexedDB keys and no extra field in any file; if anything must persist before the loader, it uses CN-022's shape exactly; pinned by test 13 and the smoke): newest first, one card per id, ≤48 (CN-022's cap); picks toggle, ≤3, the oldest drops.
13. **Breed** uses E5's `breed(sel(), { seed, mint })` (6 children); `page3(kids, at)` shows 3, wraps, and reads a bad page as 0; the first child of a page plays. One live strip only.
14. **Dice** rerolls the selected layer from an **anchor** (the effect before the first roll; any other change resets it); seeds are 31-bit from `crypto.getRandomValues`; `pushRoll` keeps 6. E5's slider steps are unchanged (S7: unchanged, UX-5; the default stands).
15. **House style** is the page's stand-in CN-022 `effectHouse` (`{ punch, motes, ramps: [selected ramp] }`) through `readHouse` (a ramp the style lacks is dropped); **New blank** = `blankDoc(house, mint)`. Page memory only, as the shelf (DSK D8.2). Adding a house-styled part to an existing effect (`addPart`) has no E7 UI (carry).
16. **Smoke.** The kit-run smoke is the hand-back's browser evidence (390 × 844, touch, @3x): it exits 1 on any FAIL. It replaces E6's quoted manual smoke.
17. **Strip scale (UX ruling, E7 r2 carry).** `fitZoom(cssW, cssH, dpr, boardW, boardH)` = the largest integer device-pixel scale at which the 48 × 32 board fits the canvas card on both sides, never under 3 (a bad size is 3); `fitView` draws it pixelated and centred. The page opens at it and offers **Fit** beside 1×, 2×, 3× (E6's checks stay). At 390 × 253 CSS px and 3 dpr that is 23 (about 7.7× in CSS px); at 360 wide, 22 (about 7×). It is small (6 lines in `strip.ts`, 2 in `page.ts`) and keeps E7 under 400, so it is folded in.
18. **UX-1…UX-8 defaults stand** (UX, E7 rulings): rulings 6–15 as built. UX-8's canonical file is `/workspace/share/foundation/ux-p1-answers.md` (sha256 `7f938011254554cf8a32b6622e0e71cb6e914ddcdd38ace0d757a9c10d8c8894`).

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- None. CN-022 stays unread and unwritten until the project loader (rulings 12, 15).

## Files to create or change (and nothing else)
| File | What | Proto | Cap |
|---|---|---|---|
| `src/editor/effect/save.ts` | change: `redoGroup`, `trashGone` (ruling 4) | 16 | 20 |
| `src/editor/effect/writer.ts` | change: `seqOf` highest seq; finite `flash_seconds` (ruling 5) | 4 | 8 |
| `src/editor/effect/dice.ts` | change: `breed` skips holes (ruling 5) | 3 | 7 |
| `tools/effect-designer/ulid.ts` | new: `B32`, `ulid`, `minter` (ruling 2) | 4 | 8 |
| `tools/effect-designer/store.ts` | change: `list(dir)`; `Dir.keys?`; `purgeTrash` (ruling 3) | 9 | 13 |
| `tools/effect-designer/strip.ts` | change: `View.zoom` a number; `zoom`; `fitZoom` (ruling 17) | 6 | 10 |
| `tools/effect-designer/mixer.ts` | new: `PAGE2`, `Card`, `Chip`, `Mixer`, `chips`, `meterText`, `trimLine`, `beatRow`, `mixer`, `swap`, `snap`, `keysOf`, `cycle`, `mixed`, `take`, `shelve`, `toggle`, `page3`, `houseOf` (rulings 7–15) | 43 | 47 |
| `tools/effect-designer/page.ts` | change: mint import, boot purge, Redo and its gone-copy warning, Fit, page-2 glue (rulings 2–4, 6–15, 17) | 60 | 64 |
| `tools/effect-designer/index.html` | change: the page-2 rows and the Advanced card | 2 | 6 |
| `tests/editor/effect-e7-carries.test.ts` | new, shipped (7 tests) | 65 | 65 |
| `tests/tools/ed-e7.test.ts` | new, shipped (9 tests) | 62 | 62 |
| `tests/tools/ed-e6.test.ts` | change by ruling, shipped whole (§ Existing tests changed by ruling) | 4 | 4 |
Total ≤ 282 changed lines (proto **278**: src 23, tools 124 incl. 2 html, tests 131; the cap is proto + 4). Caps follow STEP-TEMPLATE (proto + 4); shipped tests are byte-identical, so their cap is their proto.

## Interfaces to match (quoted exactly; bodies elided)
The shipped tests import these. E6 and E4/E5 names they use must already be on main as quoted; if not, stop and report.
```ts
// src/editor/effect/save.ts (E6, unchanged): SAVE, saveAndUse, undoGroup, commit, trashOf, type Entry, type Move, type Store
export function redoGroup(docs: Docs, entry: Entry, moved: readonly Move[], at: string): { docs: Record<string, Row>; moves: Move[] } | { error: typeof SAVE.refused; name: string };
export const trashGone: (r: Commit, moves: readonly Move[]) => string | null;   // the missing move source, else null (D8.1(a))
// src/editor/effect/writer.ts (E5, unchanged signatures): canonStep, valuesOf, write, redo, type Row
// src/editor/effect/dice.ts (E5): breed, type Child;  house.ts: blankDoc, HOUSE;  merge.ts: blend, impactMarks, keyOf, meter
// tools/effect-designer/store.ts
export type Dir = { getDirectoryHandle(name: string, o?: { create?: boolean }): Promise<Dir>; getFileHandle(name: string, o?: { create?: boolean }): Promise<FileHandle>; removeEntry(name: string): Promise<void>; keys?(): AsyncIterable<string> };
export function opfsStore(root: Dir): Store & { list(dir: string): Promise<string[]> };
export async function purgeTrash(store: Pick<ReturnType<typeof opfsStore>, "list" | "remove">): Promise<string[]>;   // names removed (D8.1(b))
// tools/effect-designer/strip.ts (E6, widened): View.zoom is a number; zoom(v, z: number)
export const fitZoom: (cssW: number, cssH: number, dpr: number, boardW: number, boardH: number) => number;
// tools/effect-designer/ulid.ts
export const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export function ulid(now: number, bytes: Uint8Array): string;
export const minter = (now: () => number, random: (n: number) => Uint8Array) => (prefix: string): string;
// tools/effect-designer/mixer.ts
export const PAGE2 = { show: 3, shelf: 48, picks: ["both", "a", "b", "mix"], punch: ["hit_stop_ms", "hit_white_ms", "shake", "squash"] } as const;
export type Card = Source & { readonly label: string };
export type Chip = { readonly layer: string; readonly beats: Readonly<Record<string, number>>; readonly badge: AB | "both" | null };
export type Mixer = { readonly a: Card; readonly b: Card; readonly base: AB; readonly mix: number; readonly picks: Readonly<Record<string, Pick>> };
export function chips(doc: FxDocValues, badges?: Readonly<Record<string, AB | "both">>): Chip[];
export const meterText: (m: Meter) => string;            // "Particles N of CAP · Draws N of CAP"
export const trimLine: (m: Meter) => string | null;      // m.line without " · Undo"; "" → null
export const beatRow: (doc: FxDocValues) => { beat: string; span: readonly [number, number] | null; steps: number }[];
export const mixer: (a: Card, b: Card) => Mixer;         // base "a", mix 50, picks {}
export const swap: (m: Mixer) => Mixer;  export const snap: (m: Mixer, mix: number) => Mixer;  export const cycle: (m: Mixer, key: string) => Mixer;
export const keysOf: (m: Mixer) => string[];  export const mixed: (m: Mixer, mint: (prefix: string) => string) => Blend;
export function take(base: Card, other: Card, layer: string, mint: (prefix: string) => string): Blend;
export const shelve: (shelf: readonly Card[], card: Card) => Card[];  export const toggle: (picked: readonly string[], id: string) => string[];
export const page3: (kids: readonly Child[], at: number) => { at: number; shown: Child[] };
export const houseOf: (punch: number, motes: boolean, ramp: string | null, styleRamps: readonly string[]) => House;
```
Page ids (index.html, in this order after `#toast`): `layers`, `meter`, `dice`, `shelf`, `blend`, `breed`, `house`, then `<details class="row"><summary>Advanced</summary>` holding `beats` and `picks`. Button labels the smoke taps: "Fit", "Shelf it", "Take its <layer>", "Blend with…", "Swap", "0"…"100", "Breed", "Child N", "Next 3", "Dice <layer>", "#N", "Punch N", "Motes", "New blank", "Undo", "Redo".

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. The host example still prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`. The kit-run browser smoke ends `SMOKE PASS` (Acceptance).

## Existing tests changed by ruling (and only these)
- `tests/tools/ed-e6.test.ts` test 13 ("E6 page: …"), ruling 2 and 4: the needle `"0123456789ABCDEFGHJKMNPQRSTVWXYZ"` becomes `"minter("` (the alphabet moved to `ulid.ts`, pinned by the carries test 1), and `"both handlers catch"` (2) becomes `"all three handlers catch"` (3, the Redo handler). Two lines; ship the whole file byte-identical (sha below). Every other E1–E6, B1 and P1 test passes unchanged.

## Tests that prove it is done (16 new; ship all three files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e7-designer-page2/`) | Copy to | sha256 |
|---|---|---|
| `tests/editor/effect-e7-carries.test.ts` | same path | `31a4d5b7dce52f3805c5f135035c10f2ff27c9c046f9bb78fc85046b4793c3c4` |
| `tests/tools/ed-e7.test.ts` | same path | `1571a811f331cb8cb6eea2634a3d8a006962925a34969da70ae06c89ffbfbdb8` |
| `tests/tools/ed-e6.test.ts` (changed by ruling) | same path (replaces E6's) | `c251876c4def246034461e277b4f3718cc9165c82c70b0e396e6a78bbad06448` |
| `smoke.mjs` (kit-run, not copied into the repo) | run from the kit path | `922ffb26bba8ff9d1f7d55cad7ffd925d6bf29c24d27576477a428079a25ac59` |
E6's `ed-e6.test.ts` on main is `3b828a0e…`; if main's differs, stop and report.

`tests/editor/effect-e7-carries.test.ts`:
1. "E7 carries S3: the setup_<ULID> mint is DOM-free; 26 Crockford chars, time first so later sorts later, every random byte used, a bad clock reads 0"
2. "E7 carries S2: opfsStore lists a dir's file names sorted (OPFS keys()); a missing dir lists none; another error is thrown"
3. "E7 carries redo across documents (E6 carry): Redo puts back exactly what Save & use wrote, owner by writer.redo and the created doc moved back from effects/.deleted/; refused when the owner moved on or the name is taken"
4. "E7 carries QA E5 report-only writer items: the next seq is past the highest ([5, 3] goes on at 6); flash_seconds NaN or Infinity is not turned into flash_ms; a hole, [] or a doc-less Breed parent is skipped, never thrown"
5. "E7 carries, page: the mint comes from ulid.ts, a reload purges effects/.deleted/ (S2), Redo after Undo through redoGroup with its storage error toasted, a new Save closes the redo"
6. "E7 carries DSK D8.1(a): a redo whose .deleted copy is gone fails cleanly: nothing written, the missing file named so the page drops only that redo; any other refusal or a success names nothing"
7. "E7 carries DSK D8.1(b): the reload purge removes only *.json files directly in effects/.deleted/; live effects/*.json and sub-folders are never touched"

`tests/tools/ed-e7.test.ts`:
8. "E7 page 2: layer chips (UX-L1): one per used layer in kind order with steps per beat; punch from its knobs alone; the A/B badge is the side that won the layer, A+B when its beats differ"
9. "E7 page 2: meter + trim line: particles and draws against their caps; the trim/fix line is never silent and the page draws its Undo; nothing trimmed, no line"
10. "E7 page 2: beat row (Advanced, UX-L2): Cast, Travel, Hit, Linger in order, each with its steps and its span from impactMarks; Travel has no 'arrives later' label (E2 is merged)"
11. "E7 page 2: Blend card (UX-L3): Swap flips the base, Mix snaps to 0/25/50/75/100 (bad input 50), a key cycles Both → A → B → Mix → Both, keys in kind then beat order with punch:hit when either side punches; the result is blend() itself"
12. "E7 page 2: Take a layer (UX-L4): the base keeps all its other layers, the taken layer comes only from the other card; punch takes the knobs"
13. "E7 page 2: shelf (UX-L5) and Breed pages (UX-B1): newest first, one per id, ≤48; picks toggle, ≤3 (oldest drops); 6 children 3 at a time, pages wrap, bad input is page 0"
14. "E7 page 2: house style (UX-L7): the page's stand-in effectHouse goes through readHouse; only a blank doc gets it; a ramp the style lacks is dropped"
15. "E7 page 2, page: page 2 sits below Save & use (the Save path stays 3 taps), every row is wired, randomness from crypto, one live strip"
16. "E7 page 2: the strip opens at the largest integer scale that fits its card, never under 3 (UX r2): 390 x 253 at 3 dpr is 23, 360 wide is 22 (about 7x css), tiny or bad sizes are 3; Fit returns to it"

## How a planted bug is caught (EA plants 42/42, `/workspace/scratch-ea/ede7/ede7-plants-r2.py`; run by `proto-check.sh` / `qa-plants.sh --plants-file` against the two new files, `ed-e6`, the E6 save and QA pin tests and the E5 writer tests)
- 1–4 S3 mint (time chars; random bytes; fractional clock; 8 bytes) · 5–7 S2 (list unsorted; missing dir throws; no boot purge) · 8–13 redo (group check; name taken; owner not redone; created doc left in trash; no Redo button; Save leaves redo open) · 14–16 QA E5 items (last seq not highest; NaN flash; Breed holes).
- 17–19 chips (punch knobs; badge; kind order) · 20–21 meter and trim (caps hidden; Undo left in the line) · 22 beat spans · 23–26 Blend card (Swap no-op; no snap; cycle stuck; no `punch:hit`) · 27 Take takes every layer · 28–30 shelf and picks (no dedupe; no cap; no pick cap) · 31 Breed pages do not wrap · 32 house ramp not passed · 33 page-2 rows missing · 34 Travel label shown.
- 35–37 D8.1(a) (a changed copy read as gone; gone never named; the redo entry kept) · 38–39 D8.1(b) (any name purged; a failed remove throws) · 40–42 strip scale (no 3× floor; card height ignored; opens at 3×).
- The kit-run smoke, run by EA against ten of these planted into a worktree, fails on 6 (7 purge, 12 Redo, 17 chips, 23 Swap, 27 Take, 33 rows; r1 run, unchanged plants); 13, 24, 30 and 32 have no smoke step and are caught by the Node tests. The smoke also catches the E6 page cases QA's plants found only in a browser (R10, R14, R16, R17, D6, D8).

## Example
From the **basic-attack** Effect row (`?for=basic-attack&kind=melee`): tap *Slash arc* and the chips read **shape · punch**, the meter "Particles 0 of 48 · Draws 2 of 60". **Shelf it**; clear the Slash intent, tap *Pop*, **Shelf it**; tap *Arrow*. Pick the *Pop* card: "Take its sparks" and "Take its punch" appear; **Take its sparks** gives Arrow's shape with Pop's sparks (chips **shape A · sparks B**). Pick *Slash arc* too, **Blend with…**: the card reads "Base Pop", chips **shape A+B · sparks A+B · punch**, and the trim line "slash-arc step 1 starts before 0: moved to 0" with **Undo** (back to the Take result). **Swap** → "Base Slash arc"; **75** snaps. **Breed** → Child 1–3 and **Next 3** → Child 4 plays. Select **sparks**, **Dice sparks** twice → `#1 #2`. **Punch 2**, **Motes**, **New blank** → chips **sparks · punch**. Advanced shows "Cast 0 · Travel 0 · Hit 0 · Linger 1 0–480 ms". Save & use on a blend saves "Slash arc × Pop". After Save & use and **Undo**, **Redo** moves `effects/.deleted/setup_<ULID>.json` back and the owner's last op is `redo`; a reload with a trashed file purges it; if the trashed file is gone (another tab reloaded), **Redo** toasts "Not redone: its deleted copy is gone (a reload cleared it, maybe in another tab). Nothing was changed." and the Redo button goes. On a 390 px phone the strip opens with **Fit** pressed (scale 23, about 7.7× in CSS px).

## Decisions note: what to name
The redo order (write order; created docs by move) and its refusal test; the boot purge point (S2) and that it is best-effort; the mint split (`ulid` pure, `minter` with injected clock and bytes); `seqOf`'s highest-seq rule; what makes a Breed parent usable; the chip order and the Punch-from-knobs rule; the badge rule; the meter text and the trim Undo depth (one); the beat-row source (`impactMarks`); A and B from pick order; Mix start 50; the pick cycle order; the Take picks table; shelf order and caps; the pick cap and which pick drops; the Breed page size and wrap; the dice anchor and when it resets; the house stand-in settings; bounds (BUILD_GUIDE law 13): the shelf ≤48 cards, picks ≤3, children 6, rolls 6, one previous working effect, one undone Save & use; nothing grows per frame; one driver (the strip), disposed when hidden or rebooted.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 916 passing** (main's count at the Base + 16; 916 if main is 900 after the E6 merge) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0 (proto: 916/0; deps 128 modules / 410 deps; `check:law OK (src)`). Main's stress p95 > 4 ms test can flake under a shared-box load: re-run it alone before believing a failure.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `node tools/host-example/match-picture.ts` prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands` and exits 0.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.
- [ ] `git diff <Base> --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff <Base> --stat -- src/runtime src/sim src/core src/fx src/project tools/device-page tools/pixel-suite tools/painter-proto tools/ui-shell src/editor/effect/fit.ts src/editor/effect/merge.ts src/editor/effect/parts.ts src/editor/effect/house.ts tools/effect-designer/grid.ts tools/effect-designer/presets.ts` is empty.
- [ ] The three shipped test files are byte-identical to the sha256s above; every other E1–E6, B1 and P1 test passes unchanged.
- [ ] Each file within its cap; at most 282 changed lines.
- [ ] **Kit-run browser smoke (REQUIRED):** from the repo root, `PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome binary> node handoff/steps/tests/step-ed-e7-designer-page2/smoke.mjs . 8791 /tmp/ed-e7-smoke.png` (install `playwright-core@1.59.1` outside the repo if you lack it, for example `npm i --prefix /tmp/pw playwright-core@1.59.1`, then `PLAYWRIGHT_CORE=/tmp/pw/node_modules/playwright-core`). It serves `tools/serve.ts`, opens `/tools/effect-designer/?for=basic-attack&kind=melee` headless at **390 × 844** (touch, @3x) and prints one `ok` or `FAIL` line per check, then `SMOKE PASS`. Paste **all** its lines into HANDBACK.md § Smoke (37 `ok` lines on the proto) and attach nothing else; a `FAIL` or a timeout is a stop-and-fix. If no Chrome can run at all, stop and report (no manual substitute).
- [ ] No `Math.random`, `Date`, timers, `localStorage`/`sessionStorage`/`indexedDB` or `Card`/`Deck` identifiers in `src/`; no hp/mana/cost/damage in the designer. Storage only through the page's OPFS `Store`; randomness in `tools/` only through `crypto.getRandomValues`.
- [ ] Delivery per CN-028: the branch `step/step-ed-e7-designer-page2-r<N>-chatA` is pushed once with `GH_BUILDER_TOKEN` through the one-shot credential helper (that branch only; the token never printed, logged, committed or saved in `.git/config` or a remote), HANDBACK.md is its last commit, and the hand-back message quotes the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
Main's count at the Base + **16** = 7 (`effect-e7-carries`) + 9 (`ed-e7`); `ed-e6.test.ts` is replaced, not added (same 5 tests). Proto: 900 (E6 r4 on `82326beb`) + 16 = **916**. (Main moved to `75df4642`, P1-2 merged, during r2; the floor rule is unchanged.) Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
No runtime code changes, so the draw, particle and light caps, `fx-live` and the 34b numbers are untouched. Page 2 adds no second driver: every result plays in the one strip. Merges, Take, Breed (6 blends) and rolls run once per tap, never per frame; Breed is 6 `blend` calls on ≤12-step docs. The shelf, picks, rolls and children are capped (Decisions note).

## Not in this step (carries, with their target step)
- **Night chip** (scope §5 L79): the stand-in board still has no style ramps with night swaps (gap X5) → **E9** (effect ramps art), was E7.
- **Catalogue presets** (N5, the 10 BTF effects) and "Make my own…" on the owner's Effect row: need the catalogue and project loader → **the project-loader step** (Phase 1), was E7.
- **The real patch** (the caster's real clip and tiles, hit mark on `hitAt`): the page still has no project loader → **the project-loader step**, was E7.
- **Shelf and house style persistence** (CN-022 `effectShelf`, `effectHouse` in `project.json`): page memory until the project loader (rulings 12, 15).
- **`addPart` with house style** (a house-styled new part on an existing effect): no "add layer" UI yet → **E8**.
- **Provenance:** "<source> changed: update this layer?" and "source removed" chips (§4.2 rule 5), and **parent badges on Breed** children → **E8**.
- **Per-layer nudge** (±30 ms, UX-B4) → **E8** with the scrub timeline.
- **QA report-only (E5, still open):** knob `5` writes an answer under key `"5"`; a group split by a migrate barrier half-undoes; `canonStep` renames by name whatever the value type; `"true"`/`"false"` smear strings kept; a non-integer stored `baseSeq` reads as 0 silently; `valuesOf` passes a loaded `__proto__` answer through (E6 reports it). Plants 58, 96, 98, 105 and QA Q27 (E5) are still caught only by crash → **E8 writer pass** (EA).
- **Dangling refs after a purge** (D6.2 `unknownRef` + default) → the project reader.
- **gh-pages build of the designer** (`tools/device-page/build.ts` builds only the device page) → the **E6+E7 batch publish** for phone test 1 (scope M13), with RaiKynn's own typed OK naming the commit (open question CoS-1).
- Reactions (editor suggestions only) → later (scope §4).

## Out of scope
Game rules (HP, mana, cost, damage) and any sim, core, runtime or render change. Any format change. The project loader and the stage editor. CN acceptance is DSK's; the catalogue rev is the Librarian's.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**`, `src/runtime/**`, `src/project/**`, `src/editor/effect/fit.ts`, `merge.ts`, `parts.ts`, `house.ts`, `tools/effect-designer/grid.ts`, `presets.ts`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/device-page/**`, `tools/pixel-suite/**`, `tools/painter-proto/**` and `tools/ui-shell/**` above all, every shipped test other than `ed-e6.test.ts` (ruling 2).

## Known proto limit (DSK D8.1(c))
With two tabs open, one tab's reload ends the other tab's redo: the reload purges `effects/.deleted/`, and the other tab's Redo then fails cleanly (ruling 4). Revisit at the project-loader step, which could purge only ids older than every open session.

## HARD STOP after E7 (CEO phone test 1)
Scope §8 cut line and CEO answer 4 ("Yes"): once E7 merges, **stop**. One gh-pages publish of the E6+E7 designer, then the CEO tests it on his phone. E7p (ability play) and E8 (Advanced) wait for that test. Builders do not start E7p or E8 from this kit.

## Open questions
- **CoS-1** Phone test 1 needs the designer on gh-pages; `tools/device-page/build.ts` does not build it and is out of bounds here. A separate publish step (or a build-script step) is needed before the test.
- Settled in r2: DSK-1 and DSK-2 by DSK D8 (`handoff/dsk-rulings/2026-11-17-phase1.md` § D8, sha256 `5b0fcb6c497c9f64f52b9be3adfb98b99a3936f1d5e96350e70b3efea7033a3b`, DSK's area `/workspace/tileengine`; not yet on main, whose copy is `58cf837c…`) (rulings 3, 4, 12, 15; § Known proto limit); UX-1…UX-8 defaults stand (ruling 18; UX-8's canonical file `ux-p1-answers.md` `7f938011…`); the strip scale (ruling 17).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 916 passing and 0 failing** (main's count at the Base + 16). Paste the summary line, the smoke line, the host example line, the sim and stress lines and all kit-run browser smoke lines into HANDBACK.md.
- All three shipped test files are **byte-identical** to the sha256s above.
- Base = main with E6 merged. At most 282 changed lines. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-ed-e7-designer-page2-r<N>-chatA` (base = main with E6 merged), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-ed-e7-designer-page2-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the smoke lines.
