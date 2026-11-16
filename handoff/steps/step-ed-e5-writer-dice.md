# step-ed-e5-writer-dice: Effect Designer E5. Editor core 2 (scope §4.3, §5 "Undo/redo" and "Export clean", §6(b)–(c), §8 E5, §9 M4, gap X4): the narrow effect writer (canonical names M6, frozen step and part ids M4, one `history` op per action, `group`s, undo/redo, Export clean), dice on one layer with a 6-roll strip, Breed (6 children), and house-style defaults (CN-022). No UI, no runtime change, no format change beyond CN-021/CN-022 as filed.

Step id: step-ed-e5-writer-dice          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`f8a451f5`** (`f8a451f5ad977ad3dde9f2fc31c9ccb02d901939`, main: CN-021 and CN-022 ACCEPTED (docs only) on top of `00c17cff` (the E4 merge-time step doc), `40365c5c` (QA's E4 docs) and `8118f98d` (PR #58, ED-E4 ChatB + QA4); test floor **835/0**). Branch: `step/step-ed-e5-writer-dice-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-e5-writer-dice-r<N>.bundle f8a451f5..step/step-ed-e5-writer-dice-r<N>`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: `handback/step-ed-e5-writer-dice/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: ED-E1/E4 (merged): `src/editor/effect/parts.ts` (`PARTS`, `writeSeed`, `exportClean`), `fit.ts` (`fit`, `Source`), `merge.ts` (`blend`, `layerOf`, `meter`, `AB`, `Meter`); `src/runtime/render/fx-doc.ts` (`stepsOf`, `FxDocValues`), `frames.ts` (`hash32`). E4 step doc on main `step-ed-e4-blend-core.md` (`9c87969d…`, merge-time, ruling 17).
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green), §7; the scope `/workspace/share/effect-designer/scope.md` (sha256 `2b81170c…`) §4.3, §5, §6(b)–(c), §7 CN-021/CN-022, §8 E5, §9 M4, M12; `data/setup-format.md` r29 §2.1–2.2 (envelope, Answer), §2.10 document rules (M4), §2.10.1.8, §2.10.2.11, §2.10.3.3 (aliases, M6), §2.10.3.2 (`pixel_scale`), §4 (history, groups); CN-020 on main (`a60aec99…`, ACCEPTED); CN-021 (`42a5c158…`) and CN-022 (`ab5232ea…`; `3c93d865…` on main at `f8a451f5`, rule 4 motes clause updated in this kit push), **ACCEPTED**.
Kit: kit-1 **r4**, 2026-11-16 (r3 → r4: QA's r3 review `step-ed-e5-review.md` (sha256 `2f0a0eb8…`) NOT OK TO SEND for a pin only, closed by QA's fix-a adopted as G7 (`dd29f737`, pin `effect-e5-qa4.test.ts`); size reason for 417 lines in the 400–500 band, S8 ruling, and report-only items carried to E6 (§ Rulings record r4). r2 → r3: QA's r2 review `step-ed-e5-review.md` (sha256 `c8cce169…`) NOT OK with M1 and M2, both closed by QA's fix-a adopted as G6 (`ddf15b88` pins, `432cb0ab` history cap clamp); EA rulings on QA's should-fixes S1–S6 built in r3, S7 recorded for UX. r1 → r2: the UX feel calls Q5–Q7, accepted by EA 21:58 London, in rulings 8 and 11; DSK ACCEPTED CN-021/CN-022 and agreed the built defaults Q2–Q4 and Q8 at 22:00, in rulings 2, 4, 7, 12 and 13; rebased onto `f8a451f5`). Engine Architect. Proto `/tmp/ede5` branch `proto/ede5`, head **`dd29f737`** (`dd29f73722535ff8205ebfb078e0817946ab5396`, tree `d118f03f`), parent `7ff4d701` (r3) ← `432cb0ab` (QA fix-a M2) ← `ddf15b88` (QA fix-a pins) ← `ce4f450b` (r2) ← `52c00512` (r1); 6 commits on the Base (G-TileEngine noreply author and committer on all). 9 files, +417/−0 = **417 changed lines** (src 180, tests 237: EA 145, QA pins 92). Green **857/0** (835 + 15 EA + 7 QA). EA plants **106/106** (`ede5-plants-r3.py`), QA plants **48/48** (r1 33 + r2 15). Bundle backup `/workspace/share/step-ed-e5-proto-r4.bundle` (sha256 `088a197b…`).
Carries: see § Not in this step. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change, no runtime change.** Three new editor files; deps 113 modules / 363 deps → **116 / 373**; the depcruise config is unchanged and passes.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Prerequisites (status at kit r4 time; EA checked, not assumed)
- **CN-020 (parts) ACCEPTED on main — met** (`a60aec99…`, unchanged on the Base).
- **CN-021 (`variant_seed`) ACCEPTED, on main at `f8a451f5` — met** (DSK 22:0x London, for this step doc; sha256 `42a5c1583b4670ece6552d810ea5bdfe84ab1116332d97ca87aa37e275f125cc`). E1 shipped the runtime fold; E5 is its writer (rule 1: 0 → absent) and dice (rule 5: the strip is editor-prefs).
- **CN-022 (shelf, house, reactions) ACCEPTED, on main at `f8a451f5` — met** (sha256 `ab5232ea1012a171ba3af7f1b782a6786bc13663e3a7d5d1d69c29354e2c04b3`; main `f8a451f5` has `3c93d865…`, and this kit push updates rule 4 with the motes exception clause). E5 reads only `settings.effectHouse`. The ACCEPTED text adds **house rule 4** (a blank doc writes the first ramp as the effect `tint_ramp` knob; a bad house `pixel_scale` warns and is ignored = Q8 as built, ruling 13) and **order-free reaction pairs** (editor-only, read in E7; no E5 change).
- The kit does not carry the CN files (format docs are DSK's); both are on the Base.
- **Catalogue:** none needed. E5 reads no catalogue (L50/L51 already name `variant_seed`, `parts`, the N5 presets and the reaction table).

## Goal
E4 gave the editor its merge maths, but nothing writes a document: no `history`, no undo, no frozen ids, no canonical names, no dice and no house style. After this step (pure editor logic in `src/editor/effect/`, testable in Node, no DOM):
1. **A narrow effect writer** (scope M4, gap X4): edits to an effect document's `answers` go through one function that writes canonical names (M6), keeps step and part ids frozen (M4), logs exactly one `set` op per user action with its `group`, and offers undo/redo (one group = one entry) and "Export clean".
2. **Dice** (UX-L6): one tap rerolls one layer's sliders inside each value's own ±25 % (a ±1 step about half the time for small whole numbers, never to 0) and the format range, from a 32-bit seed that is also written as `variant_seed`; a 6-roll strip for editor-prefs.
3. **Breed** (UX-B1): 2–3 parents give exactly 6 children, each a full `blend` (base A/B, Mix spread) with 1–2 seeded discrete flips and only the layers it took rolled, then fitted, with its meter.
4. **House style** (CN-022 Rule N / M3): read `settings.effectHouse`, and write its defaults only into a blank new doc or a newly added part.
5. **E4's acceptance lines are kept** (ruling 14).

## Rulings
1. **Place and layering.** New files `src/editor/effect/writer.ts` (`WRITER` (`cap` 200, `retries` 8, `barriers`, `ids`), `canonStep`, `canonKnob`, `valuesOf`, `usedIds`, `write`, `undo`, `redo`, `exportEffect`, types `Row`, `Change`, `Op`, `WriteOpts`), `dice.ts` (`DICE`, `seedOf`, `rollValue`, `roll`, `pushRoll`, `breed`, type `Child`) and `house.ts` (`HOUSE`, `readHouse`, `blankDoc`, `addPart`, types `House`, `PixelScale`). `fit.ts`, `merge.ts` and `parts.ts` are **unchanged**. The editor imports `hash32` (`frames.ts`) and types/values from `fx-doc.ts`, and `core/notice.ts` as a type; depcruise already allows `src/editor`. Nothing in `src/runtime`, `src/sim`, `src/core` or `src/fx` changes. Deps 113 / 363 → **116 / 373**.
2. **Writer: the document and its values.** An effect document is the setup envelope (setup-format §2.1: `rev`, `answers`, `orphans`, `history`, `updatedAt`). `valuesOf(doc)` = every answer whose `source` is not `"default"` and that holds a `value`, as `knob → value` (the `FxDocValues` the converter, `blend`, dice and house read). `write(doc, values, {at, mint, group?, note?})` writes each key of `values`; **`undefined` = back to the default** (`source: "default"`, no `value`); a key not in `values` is untouched (a caller removing a knob passes `undefined`). Each changed answer: `source: "user"`, `value`, its other fields kept, `rev` + 1. The host passes `at` (ISO-8601) and `mint`; the writer reads no clock. Inputs are never mutated. **Prototype names (r3, QA S2; E4 ruling 15's own-key rule):** a knob named `__proto__`, `constructor` or `prototype` is skipped by `write` (no change, no op) and by undo/redo of a stored change, so `answers` never gets a new prototype; the writer has no notes channel, so the skip is silent (the host's check names it `invalidValue`). Pinned by tests 1, 3, 5, 6, 15, 22.
3. **Canonical names (M6, setup-format §2.10.1.8, §2.10.2.11, §2.10.3.3).** When `steps` is written, each step is normalised by `canonStep`: `start_at`→`start_at_ms`, `hold` (number only)→`hold_ms`, `particle_life`→`particle_life_ms`, `flash_seconds`→`flash_ms` (round(s × 1000)), step `light` `off`/`steady`/`pop`→`light_mode`, `flash_center` `hit`/`caster`/`screen`→`anchor` `target`/`caster`/`screen`, `radius_from`→`wave_from`, `radius_to`→`wave_radius`, `ring_thickness_px`→`wave_thickness_px`, `blank_at` `hit`/`step-start`→`start_mode` `at-hit`/`with-last`, `smear_remnant` `true`/`false`→`smear_remnant_ms` 40/0, step `ease` `fast-out`/`linear`→`look_ease` `out`/`linear`. **The canonical key wins when both are present**, and the alias is then removed (no second live key). A boolean `hold`, and any alias value outside its table (e.g. `light: "glow"`, `ease: "in-out"`), is kept in place untouched. When any step changed, the whole old `steps` answer is kept as `orphans["steps#items"] = {answer, removedAtRev, reason: "aliases normalised (M6)"}`; the old value also stays in the op's `before`. Knobs (`canonKnob`): `pixel_scale` `"1"`–`"6"` → the integer; **`variant_seed` 0 → back to the default (CN-021 rule 1: absent, never a stored 0)**. A stored 0 is never rewritten by a load or by writing another knob; it reads as 0 until that knob is written (CN-021 check 3; **DSK-agreed 22:00**, was Q2). Pinned by tests 1, 6.
4. **Frozen ids (M4; CN-020 rule 2).** When `steps` (prefix `s-`) or `parts` (prefix `p-`) is written, an item gets a fresh `mint(prefix)` id when its id is missing, `""` or not a string, **repeats an earlier item in the same list (the first keeps it)**, or **was held by this document before but is not live now** (a deleted id is never reused). "Held before" = `usedIds(doc, knob)`: the live list, every `before`/`after` value of that knob in `history.ops`, and `orphans["<knob>#items"]`. A minted id that is already used or taken is minted again, at most 8 more times (`WRITER.retries`); if it still collides (a stuck host `mint`), the id is the first free `<prefix><n>` counting up from n = (used + taken) + 1. Ids already stored are kept. **A non-record item** (`null`, a number, a string, an array) in a written `steps` or `parts` list **is dropped**, never turned into an id-only item (r3, QA S3; silent, as above). **Cap compaction (DSK-agreed 22:00, was Q4; no CN):** ids held only by ops the cap dropped are forgotten (host mints are ULIDs). Undo restores `before` as stored, so an undone delete brings the step back with its own id. Pinned by tests 2, 15.
5. **History (setup-format §4 rules 1, 2, 6, 7, 10).** One `write` = **one** op `{seq, at, kind: "set", changes, group?, note?}`, `changes` = one `{knob, before, after}` per changed knob (states are the Answer minus `rev`); unchanged knobs are not listed; **a write that changes nothing returns the same document object and appends nothing**. `seq` = last op's `seq` (else `baseSeq`) + 1; doc `rev` + 1 per appended op; `updatedAt` = `at`. Cap = the stored `history.cap` **when it is a whole number 1–200, else 200** (r3, QA M2, Law 13: `Infinity`, `NaN`, 1e6, 0, −3, 2.5 and `"9"` all read as 200): the oldest ops are dropped and `baseSeq` advances by the number dropped. **Junk ops (r3, QA S1):** on read, `history.ops` keeps only records with an integer `seq` and an array `changes` whose items are all records; anything else (`null`, `changes: {}`, `seq: "5"`, a `null` change) is dropped (history is never needed to load, §4 rule 7), so a bad op never blocks an edit; the next write stores the cleaned list. A merge (`blend`), a dice tap, a Breed keep and an update-from-source are each one `write` with one `group: "grp_<ULID>"` (scope §5). Pinned by tests 3, 6, 15, 19, 22.
6. **Undo / redo (single document; §4 rules 3–6, 10).** `undo(doc, at)` takes the newest op that is not `undo`/`redo`, not already undone, and after the last `migrate` barrier (`WRITER.barriers`); with its `group`, **every** such op of that group in this document is undone as one entry, newest first. **A group with a later non-undone op among it is refused (setup-format §4 rule 10, "changed since; undo there first"; r3, QA S4):** when an open op that is not in the group sits after the group's first open op, `undo` returns the same document (nothing is half-undone); e.g. `shake 1` (group g), `shake 2` (no group), `squash` (group g) → `undo` is refused. Each undone op appends `{kind: "undo", target: seq, changes: [], group?}` and sets each changed answer to its `before` state (answer `rev` + 1, doc `rev` + 1). `redo(doc, at)` works only while the newest op is an `undo` or `redo` (nothing new written since); it re-applies the last undone entry **whose target is still in `history.ops`** (its whole group, the members still held) as `redo` ops with the `after` states; an entry whose op the cap dropped is skipped (r3, QA S5), so redo never sticks. Nothing to undo or redo = the same document. **S8 (r4, Engine Architect):** a refused group undo stays a refusal (the same document back). The rule for callers, binding on the E6/E7 UI, is that the editor never interleaves groups: it opens one group at a time and closes it before any other op is logged, so the refused state can't happen from the UI. Carry-forward to E6: when a group undo is refused, fall back to undoing the top op alone, so undo can never get stuck (an E6 writer item, owned by EA with UX told). The cross-document group (Save & use: "changed since; undo there first" across documents) is E6's host. Pinned by tests 4, 6, 15, 17, 22.
7. **Export clean (scope §5; CN-020 rule 3).** `exportEffect(doc)` returns the document as is (hub/export keep `from` as inert data). `exportEffect(doc, {clean: true})` strips `from` from every part in the live `parts` answer (via E1's `exportClean`), removes `orphans["parts#items"]`, and **drops `history.ops`** (keeping `cap`; `baseSeq` = the last `seq`), because old `parts` values in history carry `from` too (history is never needed to load, §4 rule 7; **DSK-agreed 22:00**, was Q3). Pinned by test 5.
8. **Dice (UX-L6, scope §4.3; UX calls Q5 and Q7, accepted by EA 2026-11-16 21:58).** `roll(anchor, layer, seed, {ramps?, preset?})`. **Rolls always start from `anchor`** (the values before the first roll; the editor keeps it while the strip is open), so a re-roll never drifts. `seedOf(seed)` = trunc, `>>> 0`, `& 0x7fffffff` (non-finite = 0). Sliders (`DICE.sliders`, per step of that layer by `layerOf`): shape `seconds` 0.15–3 step 0.01, `bend` −2.5–2.5 step 0.01; sparks `particle_count` 0–48 step 1, `particle_life_ms` 200–3000 step 10, `particle_pull` 0–2000 step 100; light `light_radius` 0.5–6 step 0.5; trail `smear_ms` 40–120 step 10; punch (effect knobs) `hit_stop_ms` 0–150 step 10, `shake` 0–3 step 1. `rollValue`: only a finite number inside its range is rolled. **Small whole numbers (Q5):** on a step-1 field (`particle_count`, `shake`) a non-zero integer with |v| ≤ 4 (`DICE.small`) takes u = `hash32(seed, "dice:<layer>:<field>", stepIndex, 0) / 2³²`: u < 0.5 keeps v; else d = −1 (u < 0.75) or +1 and the value is v + d, or v − d when v + d is 0 or outside min/max, or v when both are; **never 0, never outside min/max**. Every other value: the new value lies in `[max(min, v × 0.75), min(max, v × 1.25)]` (bounds ordered for negatives), x = lo + (hi − lo) × `hash32(seed, "dice:<layer>:<field>", stepIndex, 0) / 2³²`; k = round(x / step) × step, moved one step back inside if it falls past a bound; **if no step value lies inside the bounds, the value is kept**; k is then whole for step ≥ 1, else rounded to 0.01. **Dice never adds a field**; a 0 stays 0 (its bounds are 0–0; off stays off) and an out-of-range or non-number value is kept. Every roll writes `variant_seed` = `writeSeed(seed)` (0 = absent). The result goes through `fit(doc, [], {preset})`, so budgets hold and trims are never silent. Shape dice changes only `seconds` and `bend` (Q7, OK as is; E7's UI labels the Size slider "Size, whole effect", per-step size comes later). Pinned by tests 7, 8, 13.
9. **Colour and Punch dice.** `colour`: each colour-layer step **that has** a `tint_ramp`, and the effect knob `tint_ramp` when present, gets `ramps[floor(u × ramps.length)]`; `ramps` = the visible house ramps (ruling 12); no ramps = colour unchanged. `punch` rolls the two knobs above (only if present). Pinned by test 8.
10. **Dice strip (CN-021 rule 5).** `pushRoll(list, seed)` = `[seedOf(seed), …list without it]`, at most 6 (`DICE.rolls`). It is device-local editor-prefs (project-format §11.3); the writer never stores it. Pinned by test 9.
11. **Breed (UX-B1; UX call Q6, accepted by EA 2026-11-16 21:58).** `breed(parents, {seed, mint, ramps?, preset?})`: **`null` parents (a removed effect) are dropped first** (r3, QA S6), then the first 3 are used; fewer than 2 = `[]` (so `[A, null]` = `[]`, like one parent). Plan (exactly 6, `DICE.children`): **2 parents** → base `a` then `b`, each at Mix 25 / 50 / 75; **3 parents** → pairs (0,1), (1,2), (2,0), each at Mix 25 / 75, base `a`. Child k: `blend(pa, pb, {base, mix, mint, preset})`, seed = `hash32(seedOf(seed), "breed", k, 0) & 0x7fffffff`; then **1 + (`hash32(seed, "flip", 0, 0)` & 1) discrete flips** (1 or 2): flip f picks, by `hash32(seed, "flip", f + 1, 0)` modulo the candidates, a not-yet-flipped step among the first 12 that has one, and sets the first of `DICE.flips` (`picture`, `tint_ramp`, `particle_motion`) whose value differs on a parent step **with the same key** (`keyOf`) to that parent's value (no candidate = fewer flips); then **only the layers the child took are rolled** (ruling 8; the `layerOf` of its steps, plus `punch` only with a Punch part; no Fit between), then one Fit; `messages` = the blend's lines, then Fit's new lines; `meter` from E4. Each `Child` = `{doc, messages, meter, seed, parents: [i, j], base, mix}`, with `i`, `j` the indices **in the caller's list** (so `[null, A, B]` gives `[1, 2]`). Variety = base A/B, the Mix spread and the flips; no "Wilder" reroll in E5. "3 at a time" is E7's UI. Pinned by tests 10, 14, 21, 22.
12. **House read (CN-022).** `readHouse(settings, styleRamps)` reads `settings.effectHouse` (absent = `{ramps: [], punch: 0, motes: false}`, no notes; not an object = `invalidValue effectHouse`). `ramps`: not an array of strings = `invalidValue`; over 4 = `overCap effectHouse.ramps: <n> of 4` and keeps all; **the editor uses the first 4, then hides keys `styleRamps` lacks** (never `fxRampMissing`). `punch`: not a number = `invalidValue`; not an integer 0–3 = `outOfRange`, seeds 0. `motes`: not a boolean = `invalidValue`; only `true` adds motes. `pixel_scale` by setup-format §2.10.3.2: `null`, `"match-sprite"`, int 1–6 kept, `"1"`–`"6"` → the integer; another number or string = `outOfRange`, another type = `invalidValue`; both ignored, so the standing `"match-sprite"` write stays (**CN-022 house rule 4; DSK-agreed 22:00**, was Q8). Notes in field order. `styleRamps` is the host's resolved `paintStyleDefault` ramp keys. Pinned by test 11.
13. **House writes (Rule N / M3; CN-022 house rule 4, DSK-agreed 22:00).** `blankDoc(house, mint)`: `pixel_scale` = the house's (else the standing `"match-sprite"`), effect knob `tint_ramp` = the first visible ramp (if any), the Punch row (`HOUSE.punch`: 0 nothing; 1 = 50/40/squash/shake 0; 2 = 100/40/squash/1; 3 = 150/80/squash/2; `shake_ms`/`shake_dir` absent), and with `motes` one Sparks part `{id: mint("p-"), kind: "sparks", beats: ["linger"]}` and one step `{id: mint("s-"), kind: "particles", particle_motion: "rise", particle_count: 12, particle_life_ms: 800, particle_pull: 1000, picture: "ember", start_mode: "at-hit", tint_ramp: <first ramp>, part}`. `addPart(doc, part, steps, house, mint)`: appends the part with a fresh id and its new steps with fresh ids and `part`; the first house ramp only on new steps **without** a `tint_ramp`; for a `punch` part the Punch row only into knobs **not already set**. Existing steps and set knobs are never touched. Pinned by test 12.
14. **E4 acceptance lines kept (QA's E4 close).** No E4 code changes, and every E4 test (QA pins included) passes unchanged: (a) **ruling 15** — beat names match by own key only; prototype names (`__proto__`, `constructor`, `toString`, `valueOf`) count as unknown; `impactMarks` beats list `cast`/`travel`/`hit`/`linger` first, no prototype change, spans `null` or finite; (b) **rule 2 "after Fit"** — a part counts as moved only if one of its steps survives Fit's trim; fully trimmed moved parts are dropped; an empty base with a pick of `a` keeps no B steps; (c) **Fit's count lines skip steps 13+**. (a)–(c) are pinned by `tests/editor/effect-e4-qa4.test.ts` (sha256 `b84302cd…`, on the Base). E5's own `blend`/`fit` calls inherit them.
15. **One clock, no rules, bounded (Law 13).** No `Math.random`, `Date`, timers or wall time; the same inputs give the same output (tests 7, 10, 13, 14). No HP, mana, cost or `Card`/`Deck` identifiers. Bounds: history ≤ `cap` ops, `cap` a whole 1–200 (ruling 5); strip ≤ 6; Breed = 6 children from ≤ 3 parents, ≤ 2 flips each; every list a function of its inputs (the mint retry is at most 8 calls, and the counting fallback ends within used + taken + 1 tries).

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- **No new CN.** E5 writes only existing envelope fields (`answers`, `orphans`, `history`, `rev`, `updatedAt`), existing effect knobs and step fields, and CN-020/021 keys. It reads CN-022's `settings.effectHouse` only. The dice strip, `Child`, `House` and notes are editor API, never saved.
- **CN-021 and CN-022 are ACCEPTED, on main at `f8a451f5`** (§ Prerequisites). E5 follows them: CN-021 rules 1, 3 and 5; CN-022 § House style 1–4 and the Punch and motes tables, word for word. CN-022's order-free reaction pairs are editor-only and read in E7 (no E5 change).
- **Settled (DSK 22:11):** the motes step keeping its own `tint_ramp` (= the first ramp) is a deliberate exception to house rule 4; CN-022 rule 4 now says so in one clause (sha256 `ab5232ea…`, shipped in this kit push). E5 is built that way: knob **and** the motes step's own copy, and `addPart` gives new steps the first ramp only where they lack one (plant 77 pins it).
- **Catalogue:** no new L-entry. L50 (`parts`, `variant_seed`) and L51 (N5 presets ≤32 particles, reaction table) already cover what E5 touches.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/editor/effect/writer.ts` | new: `WRITER`, `canonStep`, `canonKnob`, `valuesOf`, `usedIds`, `write`, `undo`, `redo`, `exportEffect` (rulings 2–7; r3: cap clamp, junk ops, non-record items, prototype names, group refusal, redo after compaction) | 83 | 87 |
| `src/editor/effect/dice.ts` | new: `DICE`, `seedOf`, `rollValue`, `roll`, `pushRoll`, `breed` (rulings 8–11; `DICE.small`, `DICE.flips` new in r2; null parents r3) | 57 | 61 |
| `src/editor/effect/house.ts` | new: `HOUSE`, `readHouse`, `blankDoc`, `addPart` (rulings 12–13) | 40 | 44 |
| `tests/editor/effect-e5-writer.test.ts` | new, shipped (7 tests) | 65 | 65 |
| `tests/editor/effect-e5.test.ts` | new, shipped (8 tests) | 80 | 80 |
| `tests/editor/effect-e5-qa.test.ts` | new, shipped (QA pin, 3 tests) | 34 | 34 |
| `tests/editor/effect-e5-qa2.test.ts` | new, shipped (QA pin, 1 test) | 14 | 14 |
| `tests/editor/effect-e5-qa3.test.ts` | new, shipped (QA pin, 2 tests) | 27 | 27 |
| `tests/editor/effect-e5-qa4.test.ts` | new, shipped (QA pin, 1 test) | 17 | 17 |
Total ≤ 417 changed lines (proto r4 **417**, in the 400–500 band: src 180, tests 237 = EA 145 + QA pins 92). r3 was 400; QA's r3 pin adds the 17-line regression file `effect-e5-qa4.test.ts`. **Size reason:** 417 lines, in the 400–500 band, because QA's 17-line regression pin `effect-e5-qa4.test.ts` locks S1/S2/S4/S6 edge cases (Q50 non-integer/NaN/Infinity seq dropped, Q51 redo never applies `__proto__`, Q54 a group undo is refused when another live group's op is inside it, Q55 breed drops nulls before taking 3 parents). The source is still 180 lines; only test lines grew. Caps follow STEP-TEMPLATE (proto + 4); shipped tests are byte-identical, so their cap is their proto. Under the scope's ~380 because Fit, the seed fold, `blend` and provenance landed in E1/E4. **No split** (scope §8 named E5a writer / E5b dice+Breed only if over 400; the overage is a QA pin, not new source).

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/editor/effect/writer.ts
export type Row = Record<string, unknown>;
export type Change = { readonly knob: string; readonly before: Row; readonly after: Row };
export type Op = { readonly seq: number; readonly at: string; readonly kind: string; readonly changes: readonly Change[]; readonly target?: number; readonly group?: string; readonly note?: string };
export type WriteOpts = { readonly at: string; readonly mint: (prefix: string) => string; readonly group?: string; readonly note?: string };
export const WRITER = { cap: 200, retries: 8, barriers: ["migrate"], ids: { steps: "s-", parts: "p-" } } as const;
export function canonStep(step: Row): Row;
export const canonKnob: (knob: string, v: unknown) => unknown;
export const valuesOf: (doc: Row) => FxDocValues;
export function usedIds(doc: Row, knob: string): Set<string>;
export function write(doc: Row, values: Readonly<Record<string, unknown>>, o: WriteOpts): Row;
export function undo(doc: Row, at: string): Row;
export function redo(doc: Row, at: string): Row;
export function exportEffect(doc: Row, o?: { clean?: boolean }): Row;
// src/editor/effect/dice.ts   (Slider = readonly [field: string, min: number, max: number, step: number], not exported)
export const DICE: { spread: 0.25; small: 4; rolls: 6; children: 6; flips: readonly ["picture", "tint_ramp", "particle_motion"]; sliders: Readonly<Record<string, readonly Slider[]>> };
export type Child = { readonly doc: FxDocValues; readonly messages: readonly string[]; readonly meter: Meter; readonly seed: number; readonly parents: readonly [number, number]; readonly base: AB; readonly mix: number };
export const seedOf: (seed: unknown) => number;
export function rollValue(v: unknown, s: Slider, seed: number, key: string, i: number): unknown;
export function roll(anchor: FxDocValues, layer: string, seed: unknown, o?: { ramps?: readonly string[]; preset?: boolean }): { doc: FxDocValues; messages: string[] };
export const pushRoll: (list: readonly number[], seed: unknown) => number[];
export function breed(parents: readonly (Source | null)[], o: { seed: unknown; mint: (prefix: string) => string; ramps?: readonly string[]; preset?: boolean }): Child[];
// src/editor/effect/house.ts
export type PixelScale = number | "match-sprite" | null;
export type House = { readonly ramps: readonly string[]; readonly pixel_scale?: PixelScale; readonly punch: number; readonly motes: boolean };
export const HOUSE: { ramps: 4; punch: readonly [{}, {…1}, {…2}, {…3}] /* ruling 13 */; motes: { kind: "particles"; particle_motion: "rise"; particle_count: 12; particle_life_ms: 800; particle_pull: 1000; picture: "ember"; start_mode: "at-hit" } };
export function readHouse(settings: unknown, styleRamps: readonly string[]): { house: House; notes: Notice[] };
export function blankDoc(house: House, mint: (prefix: string) => string): FxDocValues;
export function addPart(doc: FxDocValues, part: { kind: string; beats: readonly string[]; label?: string }, steps: readonly Row[], house: House, mint: (prefix: string) => string): FxDocValues;
```

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. The host example still prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`.

## Existing tests changed by ruling (and only these)
None. Every E1–E4 test (QA pins `effect-e4-qa` … `effect-e4-qa4` included) passes unchanged on the proto.

## Tests that prove it is done (22 new: 15 EA, 7 QA pins; ship all six files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e5-writer-dice/`) | Copy to | sha256 |
|---|---|---|
| `tests/editor/effect-e5-writer.test.ts` | same path | `2069965e3e3237b51e8ce0dc78528468f98063d327b5109b3c3b6f70e25bc401` |
| `tests/editor/effect-e5.test.ts` | same path | `5bba78fd0bc31978deae169143b5da2d4e3f7b8f086fda96a58e91fe988b9621` |
| `tests/editor/effect-e5-qa.test.ts` | same path | `717c5efa8d647086710f8148a7a4d9c522bc28442a46e1c5e88018b3c9ea75c8` |
| `tests/editor/effect-e5-qa2.test.ts` | same path | `4f6138e9c5e82a5552c06b5de757d3aa7dfcc144fa3948013286c7c9cfbafb54` |
| `tests/editor/effect-e5-qa3.test.ts` | same path | `188e6d6ee1715db8e1252d72a62a400744024ca9d6e377fa74f8f59bea1303f9` |
| `tests/editor/effect-e5-qa4.test.ts` | same path | `7dee155e9bd2d80a11efa1636ad2e5fecfb0127075a22277f1b6ed9752bf4ecc` |

`tests/editor/effect-e5-writer.test.ts`:
1. "E5 writer M6: aliases are written under canonical names (canonical wins), a boolean hold stays, the old list is kept as an orphan; seed 0 is absent, pixel_scale \"3\" is 3"
2. "E5 writer M4: missing, empty and repeated step ids are minted; an id deleted earlier is never reused; part ids too; minted ids skip any used id"
3. "E5 writer history: one set op per action with only changed knobs, rev +1 on doc and answer, group and note kept; no change writes nothing; cap compaction moves baseSeq"
4. "E5 writer undo/redo: one group is one undo entry (newest first) and one redo; redo is refused after a new write; undo never crosses a migrate barrier"
5. "E5 writer Export clean: strips from on every part and drops history ops; a plain export is unchanged; valuesOf skips default answers"
6. "E5 writer + blend + dice: a merge and a dice tap are one op each (one undo back to the doc before); a stored seed 0 reads as 0 until that knob is written"
15. "E5 r3 (QA S1-S5): junk history ops and non-record list items are dropped; prototype-name knobs are skipped; a group undo with a later non-undone op among it is refused (§4 rule 10); redo skips an entry compaction dropped" (r3; numbered after 14 so earlier numbers hold)

`tests/editor/effect-e5.test.ts`:
7. "E5 dice: same anchor + seed gives the same doc; each value stays within ±25% and its range, snapped; 0, absent and out-of-range values stay; only the layer's steps move; the seed is written (0 = absent)"
8. "E5 dice punch and colour: Punch rolls the knobs; colour picks only house ramps on steps and knob that have one; no ramps = unchanged; Fit trims an over-budget roll with its line"
9. "E5 dice strip: newest first, no repeats, at most 6 seeds"
10. "E5 Breed: 2 parents give 6 children (base a/b × Mix 25/50/75), 3 give 6 (3 pairs × 25/75); fewer than 2 give none (null parents dropped, indices kept), a 4th is ignored; deterministic, distinct seeds, within budget" (r3: name and one line extended for S6)
11. "E5 house read (CN-022): first 4 ramps minus those the style lacks; bad types are invalidValue; punch out of range seeds 0; pixel_scale by the §2.10.3.2 contract"
12. "E5 house writes (Rule N / M3): a blank doc gets pixel_scale, the first ramp, the Punch row and the motes step; a new part fills only what its new steps and absent knobs lack"
13. "E5 dice small whole numbers (UX Q5): |v| ≤ 4 on a step-1 field moves ±1 about half the time, by the seed; never to 0, never past min/max"
14. "E5 Breed (UX Q6): only the layers a child took are rolled (no Punch knobs without a Punch part, no colour knob without a colour step); each child gets 1–2 seeded discrete flips from a parent step with the same key"

`tests/editor/effect-e5-qa.test.ts` (QA pin, M1; `ddf15b88`):
16. "E5 QA writer: inputs untouched, full M6 table, orphan copy, M4 held-before from before-states and orphans, pixel_scale aliases only 1-6"
17. "E5 QA history: undo/redo bump answer rev, the last migrate is the wall, redo takes the last undone entry; Export clean keeps cap, drops parts orphans, seq carries on"
18. "E5 QA house: null/string/0/-1 are flagged, match-sprite kept, the first ramp is used, Punch row only on a punch part"

`tests/editor/effect-e5-qa2.test.ts` (QA pin, M2; `432cb0ab`):
19. "E5 QA Law 13: a stored history cap outside whole 1-200 reads as 200, so history stays bounded and baseSeq moves by the ops dropped"

`tests/editor/effect-e5-qa3.test.ts` (QA pin, M1; `ddf15b88`):
20. "E5 QA dice small whole numbers (Q5): exact keep/−1/+1 by u, reverse step at 0 or a bound; 4 is small, 5 and 2.5 use ±25%"
21. "E5 QA Breed (Q6): flips come from either parent, only among the first 12 steps, picked by the child seed, for motion too; a layer only parent B has is still rolled"

`tests/editor/effect-e5-qa4.test.ts` (QA pin, M3; `dd29f737`):
22. "E5 QA r3: a non-integer seq is dropped; redo skips prototype knobs; another live group inside a group refuses its undo; nulls drop before the first-3 cut"

## How a planted bug is caught (EA plants 106/106, `ede5-plants-r3.py`; QA plants 48/48; run by `proto-check.sh` / `qa-plants.sh --plants-file` against the six shipped files; plant 41 retired in r1: its clause was redundant and removed from the code; r2 adds 84–95 for Q5/Q6; r3 adds 96–106 for S1–S6; 83 is unused)
| # | Plant | Caught by |
|---|---|---|
| 1 | M6: start_at not canonical | test 1 |
| 2 | M6: alias beats the canonical name | test 1 |
| 3 | M6: alias left beside the canonical name | test 1 |
| 4 | M6: boolean hold read as hold_ms | test 1 |
| 5 | M6: flash_seconds not x1000 | test 1 |
| 6 | M6: unknown alias value converted | test 1 |
| 7 | CN-021: seed 0 stored | test 1 |
| 8 | M6: pixel_scale "3" kept as a string | test 1 |
| 9 | M6: no orphan copy of the old list | test 1 |
| 10 | M4: missing id not minted | test 2 |
| 11 | M4: empty id kept | test 2 |
| 12 | M4: repeated id kept | test 2 |
| 13 | M4: deleted id reused | test 2 |
| 14 | M4: history ids not counted | test 2 |
| 15 | M4: minted id may collide | test 2 |
| 15b | M4/Law 13: a stuck mint has no fallback | test 2 |
| 16 | M4: part ids not frozen | test 2 |
| 17 | history: a no-change write appends an op | test 3 |
| 18 | history: unchanged knob recorded | tests 1, 3 |
| 19 | history: doc rev not bumped | tests 3, 4 |
| 20 | history: answer rev not bumped | test 3 |
| 21 | history: group dropped on write | tests 3, 4, 6 |
| 22 | history: note dropped | test 3 |
| 23 | history: no cap compaction | test 3 |
| 24 | history: baseSeq not advanced | test 3 |
| 25 | history: reset keeps the value | test 1 |
| 26 | undo: group ignored | test 4 |
| 27 | undo: group oldest first | test 4 |
| 28 | undo: crosses a migrate barrier | test 4 |
| 29 | undo: an undone op undone again | test 4 |
| 30 | redo: restores before | test 4 |
| 31 | redo: allowed after a new write | test 4 |
| 32 | redo: group ignored | test 4 |
| 33 | Export clean keeps from | test 5 |
| 34 | Export clean keeps history ops | test 5 |
| 35 | plain export is cleaned | test 5 |
| 36 | valuesOf includes default answers | tests 4, 5, 6 |
| 37 | dice: spread 0.5 | tests 7, 8, 13 |
| 38 | dice: no low range clamp | test 7 |
| 39 | dice: no high range clamp | test 7 |
| 40 | dice: negative values get swapped bounds | test 7 |
| 42 | dice: out-of-range value rolled | test 7 |
| 43 | dice: not snapped to the step | tests 7, 8 |
| 44 | dice: decimals not rounded | test 7 |
| 44b | dice: a snap past a bound is kept | test 7 |
| 45 | dice: other layers rolled | test 8 |
| 46 | dice: seed not written | tests 7, 10 |
| 47 | dice: seed 0 written | test 7 |
| 48 | dice: Fit not run | test 8 |
| 49 | dice: preset not passed to Fit | test 8 |
| 50 | dice: Punch knobs not rolled | tests 8, 14 |
| 51 | dice: colour ramp outside the list | test 8 |
| 52 | dice: colour adds a ramp to a step without one | test 8 |
| 53 | dice: colour knob not rolled | test 8 |
| 54 | strip: no dedupe | test 9 |
| 55 | strip: no cap | test 9 |
| 56 | strip: newest last | test 9 |
| 57 | seed: no 31-bit mask | test 9 |
| 58 | Breed: one parent bred | test 10 |
| 59 | Breed: one seed for all children | test 10 |
| 60 | Breed: no dice | tests 10, 14 |
| 61 | Breed: 2-parent plan never swaps the base | test 10 |
| 62 | Breed: 3-parent mixes 25/50 | test 10 |
| 63 | Breed: blend lines lost | test 10 |
| 64 | house: ramps not filtered by the style | test 11 |
| 65 | house: style filter before the first-4 cut | test 11 |
| 66 | house: no overCap | test 11 |
| 67 | house: punch out of range kept | test 11 |
| 68 | house: punch 1.5 kept | test 11 |
| 69 | house: motes truthy | test 11 |
| 70 | house: pixel "4" not normalised | test 11 |
| 71 | house: pixel 7 accepted | test 11 |
| 72 | house: wrong pixel type is outOfRange | test 11 |
| 73 | house: Punch 3 hit-white 40 | test 12 |
| 74 | house: Punch 3 shake 3 | test 12 |
| 75 | house: motes count 24 | test 12 |
| 76 | house: blank pixel_scale null | test 12 |
| 77 | house: motes step without the house ramp | test 12 |
| 78 | house: motes always added | test 12 |
| 79 | house: new part overwrites a step's ramp | test 12 |
| 80 | house: new part overwrites set knobs | test 12 |
| 81 | house: new steps keep their ids | test 12 |
| 82 | house: blank doc without the ramp knob | test 12 |
| 84 | Q5: small whole numbers use the ±25% rule | test 13 |
| 85 | Q5: a small whole number always moves | test 13 |
| 86 | Q5: a small whole number may reach 0 | test 13 |
| 87 | Q5: no min/max clamp on the ±1 step | test 13 |
| 88 | Q5: small limit 2 | test 13 |
| 89 | Q6: every layer rolled | test 14 |
| 90 | Q6: a Punch part not counted as taken | test 14 |
| 91 | Q6: no discrete flips | test 14 |
| 92 | Q6: always one flip | test 14 |
| 93 | Q6: up to 4 flips | test 14 |
| 94 | Q6: a flip ignores the key | test 14 |
| 95 | Q6: the same step flipped twice | test 14 |
| 96 | S1: junk history ops kept | test 15 |
| 97 | S1: a string seq kept | test 15 |
| 98 | S1: a null change kept | test 15 |
| 99 | S3: non-record list items become id-only items | test 15 |
| 100 | S2: a prototype-name knob written | test 15 |
| 101 | S2: only __proto__ skipped | test 15 |
| 102 | S2: undo applies a prototype-name change | test 15 |
| 103 | S4: group undo not refused past a later op | test 15 |
| 104 | S5: redo targets an op compaction dropped | test 15 |
| 105 | S6: null parents not dropped | test 10 |
| 106 | S6: child parent indices not the caller's | test 10 |

QA plants (QA's lists `qa-ede5-plants.py` Q1–Q33 and `qa-ede5-plants-r2.py` Q34–Q49, Q45 retired; 48/48 on r3; Q4's needle re-pointed to r3's `freeze` line, same bug): Q2–Q31 (writer, history, Export clean, house) are caught by tests 16–18, Q35–Q49 (dice small numbers, Breed flips and taken layers) by tests 20–21, the cap clamp by test 19; Q1, Q3, Q32–Q34, Q36, Q37, Q39 and Q46 were already caught by tests 1–14. QA's row-by-row table is in its review (§ r2 must-fix).

## Example
`fire`: `a` stamp 0.6 s, `h` straight 1 s bend −1 (`connect_step: "h"`), `x` 20 sparks life 1000 pull 1000 `at-hit`; knobs shake 2, hit-stop 100.
- `roll(fire, "sparks", 77)`: `x` becomes 20 sparks, life 1040, pull 1100; `a` and `h` unchanged; `variant_seed` 77; no Fit line. The same call again gives the same doc; `roll(fire, "sparks", 0)` writes no seed.
- `roll(fire, "punch", s)`: shake 2 stays 2 on about half the seeds, else becomes 1 or 3 (Q5; seeds 1–200: 116 × 2, 31 × 1, 53 × 3), never 0; hit-stop 80–120 in steps of 10. `roll(fire, "colour", s, {ramps: ["frost", "holy"]})` changes only ramps that exist, to `frost` or `holy`.
- `breed([A, B], {seed: 9})` on two 12-step effects (4 × 16 sparks each): 6 children `a25 a50 a75 b25 b50 b75`, each with "Scaled sparks 128 → 48 to fit 48 · Trimmed 12 linger steps to fit", 21–25/48 sparks after the trim, 12/12 steps, 6 distinct seeds. Here the parents share `picture`, ramp and motion, so there is nothing to flip; with a parent step of the same key that differs (test 14), each child takes 1 or 2 of those values.
- `write(doc, blend(...).doc, {group: "grp_…", note: "blend"})` is one op; `undo` returns `valuesOf` to the doc before the merge. A dice tap is one more op and one more undo.
- `blankDoc` with `{ramps: ["frost"], punch: 3, motes: true}`: `pixel_scale "match-sprite"`, `tint_ramp "frost"`, hit-stop 150, hit-white 80, squash, shake 2, Sparks part `p-1` with its motes step `s-2` (12 `ember` sparks, rise, `at-hit`, frost).

## Decisions note: what to name
The writer's shape (`write` with `undefined` = reset; one op per call; same object when nothing changed); the alias table and "canonical wins, alias removed, unknown values kept"; the `steps#items` orphan copy; seed 0 → default only when that knob is written; the first-occurrence rule for repeated ids; "held before" = live + history + orphans; the 8-retry mint and counting fallback; undo of a whole group per document, newest first; redo only right after an undo/redo; Export clean dropping history ops; dice from an anchor, ±25 %, never adding a field, the slider table and steps; snapping one step back inside the bounds or keeping the value; the colour pick from visible house ramps; the strip (6, newest first, no repeats); the small-whole-number ±1 rule (Q5); the Breed plan (2 → a/b × 25/50/75; 3 → 3 pairs × 25/75), rolling only the layers a child took and the 1–2 same-key flips (Q6); house: first 4 then hide, `pixel_scale` aliases, Punch rows, motes step, `addPart` filling only gaps. Bounds (Law 13): ruling 15.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 857 passing** (835 + 15 EA + 7 QA) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto r4 on `f8a451f5`: 857/0; deps 116 modules / 373 deps; `check:law OK (src)`.) Main's stress p95 > 4 ms test can flake under a shared-box load: re-run it alone before believing a failure.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `node tools/host-example/match-picture.ts` prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands` and exits 0.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.
- [ ] `git diff f8a451f5 --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff f8a451f5 --stat -- src/runtime src/sim src/core src/fx src/editor/effect/fit.ts src/editor/effect/merge.ts src/editor/effect/parts.ts` is empty.
- [ ] E4's acceptance lines hold (ruling 14): `tests/editor/effect-e4-qa4.test.ts` (sha256 `b84302cd19824c3f09bd256bafa45b5e6d8e143c2974e3d2ffce4a9a7639d1f2`) and every other E4 test pass unchanged.
- [ ] All six shipped test files are byte-identical to the sha256s above.
- [ ] Each file within its cap; ≤ 417 changed lines in total (400–500 band; size reason in § Files).
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no hp/mana/cost in `src/`. No UI files. No game rule in the editor (the designer never reads or writes damage).
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
835 → **857**: 835 (main `f8a451f5`) + 15 EA (7 in `effect-e5-writer`, 8 in `effect-e5`; r2 added tests 13 and 14, r3 test 15) + 7 QA pins (3 `effect-e5-qa`, 1 `effect-e5-qa2`, 2 `effect-e5-qa3`, 1 `effect-e5-qa4`; tests 16–22). Kit tests under `handoff/` are not run on main until merge. The Delivery footer needs at least **857** passing.

## Perf (phone floor)
No runtime code changes, so the draw, particle and light caps, `fx-live` and the 34b numbers are untouched. All of E5 runs once per edit, never per frame (EA desktop probe, not shipped): `write` of a 12-step doc p50 0.026 ms / p95 0.064 ms with 200 ops in history; `undo` p50 0.013 / p95 0.104 ms; `breed` of two 12-step effects (6 blends + 36 rolls + 6 Fits) p50 1.1–1.4 ms / p95 2.2–2.7 ms (r1 and r2 runs). A phone at ~5× desktop stays far under the 18.3 ms p95 line and S0's Breed budget (2.0 ms added p95 is for the live preview, not this one-off).

## Not in this step (carries, with their target step)
- Shelf (`effectShelf`: add/remove, ≤48 `overCap`, dangling `ref`/`part` as info, not `used`, not in the export closure) and the reaction table (`effectReactions`, editor suggestions only) → **E7** (CN-022; UI), reading the same CN. E5 reads only `settings.effectHouse`.
- The cross-document group (Save & use writes several docs; "changed since; undo there first"), `expectedRev`/`staleRev`, OPFS save → **E6**, on `write`/`undo` per document.
- "Fire Slash changed: update this layer?" (one tap = one group) → **E7**, on `fromInfo` + `write`.
- Dice strip UI, Breed 3 at a time, house-style card, A/B badges on Breed → **E7**.
- The generic catalogue-driven writer → later (scope M4); E5 is the narrow effect writer only.
- **Report-only (from QA's E4 close):** when the hit step has no id and there is no `connect_step`, Fit never trims an id-less step (`steps[i].id !== hitId` is false for every id-less step). E4 code, unchanged here. Every doc saved through `write` has ids (ruling 4), so it can only touch unsaved `blend`/Breed inputs.
- Report-only (EA): Fit scales sparks before it trims steps, so a child's post-trim count can sit well under the cap (Breed example: 21–25/48 after "Scaled sparks 128 → 48"). E4 order, unchanged.
- **"Wilder" reroll** for Breed (roll every layer on request; UX idea, not in E5 since Q6) → later, with E7's UI.
- Per-step Size (E7's Size slider is "Size, whole effect", the effect `scale`; Q7) → later.
- **Notes for dropped input (r3, QA S1–S3):** the writer returns a document, not notes, so junk ops, non-record list items and prototype-name knobs are dropped silently in E5 → **E6**'s save path reports them (`invalidValue`) when it gains a notes return.
- **S7 (UX, no code change in E5):** the Q5 ±1 rule only covers step-1 fields, so small values on step-10/100/0.5 sliders never move under any seed: `light_radius` 0.5 and 1, `hit_stop_ms` 10–30, `particle_pull` 100–300 (`smear_ms` 40 does move). As ruled, but it is the same "stuck" feel UX fixed for counts → **UX call later** ("one slider step ±1" for these?), with E7's dice UI.
- **S8 (r4, Engine Architect; no code change in E5):** a refused group undo returns the refusal with the doc unchanged (the writer stays as shipped). The E6/E7 UI never interleaves groups (one group open at a time, closed before any other op is logged). Carry-forward to **E6**: when a group undo is refused, fall back to undoing the top op alone, so undo can never get stuck. An E6 writer item, owned by EA with UX told.
- **QA report-only (r3, carried to E6, not fixed in E5):** knob 5 writes an answer under key `"5"`; seqs `[5, 3]` give a next seq of 4; a group split by a migrate barrier half-undoes; `breed` throws on `[A, [], B]`; a loaded `__proto__` answer passes through `valuesOf`. Also: plants 58, 96, 98, 105 and QA Q27 are caught only by crash, and E6 adds assert-level catches.
- **QA report-only (r2):** `Child.seed` ≠ the child's `variant_seed` when it took no layer; a flip can add a field (a missing `picture` counts as "differs"); Breed of two 300-step parents takes ~174 ms on the box (editor-only); the host's `mint` must be the doc-wide ULID one; `canonStep` passes `NaN`/`Infinity` and the writer stores odd `variant_seed` values raw (CN-021 rule 3 warns at check time); Export clean forgets history-only ids. Unchanged in E5.
- (a), (c), (g) and the deps rule stay open as in the E1 doc.

## Out of scope
Game rules (HP, mana, cost, damage) and any sim, core, runtime or render change. Any editor UI or DOM. Any format change beyond CN-021/CN-022 as accepted. CN acceptance is DSK's; the catalogue rev is the Librarian's.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**`, `src/runtime/**`, `src/editor/effect/fit.ts`, `merge.ts`, `parts.ts`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/**` (`tools/painter-proto/**` and `tools/ui-shell/**` above all), every E1–E4 shipped test.

## Rulings record (r4; no open questions remain)
1. CN-021 and CN-022 on main: **done**, ACCEPTED by DSK (22:0x London), on main at `f8a451f5`.
2. CN-021 check 3 (a stored 0 is cleared only when `variant_seed` is written): **DSK-agreed 22:00, as built** (ruling 2).
3. Export clean drops `history.ops`: **DSK-agreed 22:00, as built** (ruling 7).
4. M4 across cap compaction (no used-id floor, no CN): **DSK-agreed 22:00, as built** (ruling 4).
5. Dice ±25 %, never adds a field, never turns off on; **small whole numbers ±1 about half the time, never 0 (UX call, accepted by EA 2026-11-16 21:58)** (ruling 8; test 13).
6. Breed rolls **only the layers each child took**, with 1–2 seeded discrete flips; no "Wilder" reroll in E5 (**UX call, accepted by EA 2026-11-16 21:58**; ruling 11; test 14). Resolved, no longer risky.
7. Shape dice = `seconds` and `bend` only (**UX call, OK as is, accepted by EA 2026-11-16 21:58**); E7's UI labels Size "Size, whole effect"; per-step size later (ruling 8).
8. House on a blank doc (effect `tint_ramp` knob; bad house `pixel_scale` ignored with its note): **DSK-agreed 22:00, as built; CN-022 house rule 4** (rulings 12–13). The motes exception is now written into rule 4 (DSK 22:11).

**r3 (QA r2 review `c8cce169…`, NOT OK; EA rulings):**
- **M1 (G1), FIXED:** 40 of QA's 48 plants were missed by the kit tests. QA's pins `effect-e5-qa.test.ts` and `effect-e5-qa3.test.ts` are adopted as G6 (`ddf15b88`) and shipped (tests 16–18, 20–21).
- **M2 (Law 13), FIXED:** a stored `history.cap` is clamped to a whole 1–200, else 200 (QA's one line, `432cb0ab`; ruling 5; test 19).
- **S1, FIXED:** junk `history.ops` entries are dropped on read, never crash (ruling 5; test 15; plants 96–98). Notes → E6.
- **S2, FIXED:** `__proto__`/`constructor`/`prototype` knobs are skipped by `write` and by undo/redo (ruling 2; test 15; plants 100–102).
- **S3, FIXED:** non-record `steps`/`parts` items are dropped, never become id-only items (ruling 4; test 15; plant 99).
- **S4, FIXED:** setup-format §4 rule 10 implemented as written: a group undo with a later non-undone op among the group's ops is refused (same document back); nothing is half-undone (ruling 6; test 15; plant 103).
- **S5, FIXED:** redo skips undone entries whose op the cap dropped, so it never sticks (ruling 6; test 15; plant 104).
- **S6, FIXED:** `breed` drops `null` parents before the fewer-than-2 check (`[A, null]` = `[]`, like one parent); `Child.parents` are the caller's indices (ruling 11; test 10; plants 105–106).
- **S7, RECORDED for UX** (no code change): § Not in this step.

**r4 (QA r3 review `2f0a0eb8…`, NOT OK TO SEND for a pin only; EA rulings):**
- **M3 (G1), FIXED:** 4 of QA's 6 new plants (Q50, Q51, Q54, Q55) were missed by the kit tests. QA's pin `effect-e5-qa4.test.ts` is adopted as G7 (`dd29f737`) and shipped (test 22). Floor 856 → 857. Size 417, in the 400–500 band: the 17-line pin locks the S1/S2/S4/S6 edge cases; source is still 180 lines (size reason in § Files).
- **S8, RULED (no code change in E5):** the writer stays as shipped; a refused group undo returns the refusal with the doc unchanged. Binding on the E6/E7 UI: the editor never interleaves groups (one group open at a time, closed before any other op is logged), so the refused state can't happen from the UI. Carry-forward to E6: when a group undo is refused, fall back to undoing the top op alone, so undo can never get stuck. An E6 writer item, owned by EA with UX told.
- **Report-only, carried to E6 (not fixed in E5):** knob 5 writes an answer under key `"5"`; seqs `[5, 3]` give a next seq of 4; a group split by a migrate barrier half-undoes; `breed` throws on `[A, [], B]`; a loaded `__proto__` answer passes through `valuesOf`. Plants 58, 96, 98, 105 and QA Q27 are caught only by crash; E6 adds assert-level catches.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 857 passing and 0 failing**. Paste the summary line, the smoke line, the host example line, and the sim and stress lines into HANDBACK.md.
- All six shipped test files are **byte-identical** to the sha256s above.
- Base **`f8a451f5`**. The bundle is `f8a451f5..step/step-ed-e5-writer-dice-r<N>` and passes `git bundle verify`. Total ≤ 417 changed lines (400–500 band; size reason in § Files). Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-e5-writer-dice-r<N>` (base `f8a451f5`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-ed-e5-writer-dice-r<N>.bundle f8a451f5..step/step-ed-e5-writer-dice-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
