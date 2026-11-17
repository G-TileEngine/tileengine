# Hand-back step-ed-e5-writer-dice r1
Step file: handoff/steps/step-ed-e5-writer-dice.md
Step sha256: 4d99491d9f8940729e2bc59991c6f317611e6932b06507eeed7b571eb5db4a3e
Base commit: f8a451f5ad977ad3dde9f2fc31c9ccb02d901939     Head commit: 4e8a8236deeda66bd6d90829faf0412292b7eb5c     Branch: step/step-ed-e5-writer-dice-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/editor/effect/dice.ts
A	src/editor/effect/house.ts
A	src/editor/effect/writer.ts
A	tests/editor/effect-e5-qa.test.ts
A	tests/editor/effect-e5-qa2.test.ts
A	tests/editor/effect-e5-qa3.test.ts
A	tests/editor/effect-e5-qa4.test.ts
A	tests/editor/effect-e5-writer.test.ts
A	tests/editor/effect-e5.test.ts

## Green
npm test: 857/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

# tests 857
# suites 0
# pass 857
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 47181.534442

deps: 116 modules, 373 dependencies. smoke: 0 failed. match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands. stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75. stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c. stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.

## Shipped tests (sha256, unchanged)
2069965e3e3237b51e8ce0dc78528468f98063d327b5109b3c3b6f70e25bc401  tests/editor/effect-e5-writer.test.ts
5bba78fd0bc31978deae169143b5da2d4e3f7b8f086fda96a58e91fe988b9621  tests/editor/effect-e5.test.ts
717c5efa8d647086710f8148a7a4d9c522bc28442a46e1c5e88018b3c9ea75c8  tests/editor/effect-e5-qa.test.ts
4f6138e9c5e82a5552c06b5de757d3aa7dfcc144fa3948013286c7c9cfbafb54  tests/editor/effect-e5-qa2.test.ts
188e6d6ee1715db8e1252d72a62a400744024ca9d6e377fa74f8f59bea1303f9  tests/editor/effect-e5-qa3.test.ts
7dee155e9bd2d80a11efa1636ad2e5fecfb0127075a22277f1b6ed9752bf4ecc  tests/editor/effect-e5-qa4.test.ts

## Helpers & self-review (required)
- Helper writer (earlier pass): reviewed undo/redo against ruling 6. Redo was reapplying every still-undone undo of a group across generations. Fixed so a redo entry is only the newest contiguous run of undo ops that share that group. Probe: one knob undo/redo/undo/redo ends at rev 5 with two redo ops; two knobs end at rev 10 with four redo ops.
- Helper dice (earlier pass): reviewed rollValue. Each ±25% end was clamped before the two ends were ordered, so bend −2.5 could fall below −2.5. Fixed by ordering v×0.75 and v×1.25 first, then clamping to [min, max].
- Helper house (earlier pass): reviewed rulings 12–13. No change.
- Helper writer (this pass, 6901c506): reviewed rulings 2–7 and 15 against 73b75ece. Must-fix: the counting fallback probed used+taken+2 (`n < start + held.size + seen.size + 2`). Changed to used+taken+1 tries, from n = used+taken+1. Should-note, not changed: valuesOf still returns a loaded prototype-name answer (E6 report-only); state equality is JSON.stringify, so key order can log one rewrite. Redo contiguous rule confirmed.
- Helper dice (this pass, 44b17a18): reviewed rulings 8–11 and the fit/blend/parts call sites. No change. Punch seeds 1–200 are 116×2, 31×1, 53×3. roll(fire, sparks, 77) is count 20, life 1040, pull 1100. Bend −2.5 stays ≥ −2.5.
- Helper house (this pass, ce53a659): reviewed rulings 12–13, including a live probe of bad types, the first-4 ramp cut, and punch rows. No change.
- An earlier helper wave (8987d6b2, 5f24de35, b038d0b8) returned no verdict and was stopped. Not a pass.
- Self-review: Acceptance green 857/0/0/0/0 duration_ms 47181.534442, typecheck/lint/deps/check:state/check:law exit 0, deps 116/373: done. smoke `smoke: 0 failed`: done. host `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`: done. sim stage-fixed 48/2 afc89d56… and stage-weighted 22/28 b8007292…: done. stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0: done. Pin diff empty (1e5dd82c, d7f64a09, 45a3dbaa, 4d7bbf48, d6d08696): done. runtime/sim/core/fx/fit/merge/parts diff empty: done. E4 tests including effect-e4-qa4 sha256 b84302cd19824c3f09bd256bafa45b5e6d8e143c2974e3d2ffce4a9a7639d1f2 pass inside the 857: done. Six shipped files byte-identical to the step table: done. Caps writer 85/87, dice 53/61, house 30/44, total 405 ≤ 417: done. No Math.random, Date, timers, Card/Deck, or hp/mana/cost, and no UI: done. QA checklist G1 done, G2 done, G3 done, G4 done, G5 done, G6 done, G7 done, G8 done, G9 done, G10 done.

## Decisions & deviations (5–10 lines)
- `write` treats undefined as source default with no value, leaves keys that were not passed untouched, and returns the same object when nothing changed. One call appends one set op. Two states count as the same when JSON.stringify matches, so a loaded answer whose keys are not in source-then-value order is rewritten once.
- The alias table is ruling 3. The canonical key wins and the alias is dropped. A value outside its table stays. orphans["steps#items"] is kept only when a step's canon differs, with the old answer and reason "aliases normalised (M6)".
- variant_seed 0 becomes the default only when that knob is written. Held-before ids are the live list, every history before and after, and orphans["<knob>#items"]. A colliding mint is tried once plus 8 retries, then prefix+n from used+taken+1 for used+taken+1 tries.
- Redo reapplies only the newest contiguous run of undo ops that share a group and whose set-op is still in history, oldest target first. It does not replay an earlier undo of that group. A refused group undo returns the same document (S8). Undoing the top op alone on that refusal is E6, and is not done here.
- The ±25% window orders v×0.75 and v×1.25 before clamping to min and max, so a negative bend stays inside its range. Dice never adds a field. There is no cache: history keeps at most the stored cap (a whole number 1–200, otherwise 200), the strip keeps at most 6, and breed returns at most 6 children.
- 405 changed lines (source 168, shipped tests 237) is in the 400–500 band because the byte-identical 17-line pin tests/editor/effect-e5-qa4.test.ts is required. Source stays under the 180-line proto. Deps are 116 modules and 373 dependencies. Every pin is unchanged.
- valuesOf does not skip a loaded __proto__, constructor, or prototype answer (report-only, carried to E6). Junk ops, non-record list items, and those three knob names are dropped with no note, because this writer returns a document and not notes.
- Export clean drops history.ops and orphans["parts#items"], keeps cap, and sets baseSeq to the last surviving seq, or the stored baseSeq when none remains.

## Next step (optional proposal)
- E6 writer: when a group undo is refused, fall back to undoing the top op alone so undo cannot stick. Also the cross-document group, and notes (invalidValue) for junk ops, non-record items, and prototype-name knobs. Not implemented in this step.
