# Hand-back se-01-recipe-reader r1
Step file: handoff/steps/se-01-recipe-reader.md
Base commit: d05be365f79a62e8f61c74eac7fbb0553c4bee50     Head commit: 9e6df0ecee4c4d2985af76a5e5fa7e7ebf6d42c8     Branch: step/se-01-recipe-reader-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.dependency-cruiser.cjs
M	scripts/check-law.sh
M	src/btf-adapters/src/index.ts
A	src/btf-adapters/src/sprite-recipe-limits.ts
A	src/paint/recipe/fields.ts
A	src/paint/recipe/index.ts
A	src/paint/recipe/limits.ts
A	src/paint/recipe/read.ts
A	src/paint/recipe/types.ts
A	tests/paint/recipe-fields.test.ts
A	tests/paint/recipe-read.test.ts
A	tests/paint/sample.ts

## Green
npm test: 463/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Field readers are small functions (`num`, `bool`, `str`, `enm`, `ident`, `take`, `pts`, `runs`, `geom`) walked in the field table's order. The sample reads clean (`doc` deep-equals `SAMPLE`) and one generated test per path (240) warns `badField <key>`.
- `doc` is rebuilt: floats are floored, bad values take the table default, lists are cut to the cap. `stored` is the plain copy, so floats and unknown keys stay. R1 re-reads `JSON.parse(JSON.stringify(stored))` and matches `doc`, `stored` and `readOnly`, without the `droppedKey` notices.
- Items past a cap are sliced off before they are read. A frame or facing `geom`, `code.out` and `history.ops` are kept and not entered. The plain copy sits in `try`. Depth above 10000, a cycle, a BigInt or any other non-JSON value returns a fail symbol, so `src/paint` has exactly one `throw` (the limits `RangeError`). A throwing getter, `toJSON`, revoked proxy or proxy trap is that catch: `not plain JSON`.
- Guard order is Behaviour 2. `formatVersion` above 1 is read and `readOnly`, not refused. Its first notice is `newerFormat formatVersion`, then the copy's `droppedKey` notices. `needsMigration` is only an integer `formatVersion` below 1. After that, notices follow the table (a list's notice before its items), then `overCap history` from the UTF-8 length of `JSON.stringify(stored.history)`, then `rasterTooNew`.
- Defaults the step left as the bracket or the first legal value: a bad `locked`, `visible` or `team` is `false`; a bad ref is `""`; a bad id is `""` and is not registered; a bad `parent` or `sideMirror` is `null`; a bad `gen.kind` is `"walk"` and a bad `code.lang` is `"js"`; a bad `code.src` is `""`; a bad non-`pixelRun` geom object is that kind's zero geom with no inner notices; a bad `size` object is `w` and `h` of `min(32, side)` with no further notices. The plain-copy depth cap is 10000 (1000 nested arrays pass, 100000 fail).
- CN-008 only. `.dependency-cruiser.cjs` sha256 `45a3dbaad28c0c827e2aa64ed0b63129b471e29482c8d6e6d88f5211c5118831` (2 insertions, 0 deletions) and `scripts/check-law.sh` sha256 `4d7bbf48edf945851022711bf9a9e765db8eac63b77c52b14865e5faf83b0163` (5 insertions, 0 deletions). `btf-adapters` imports paint with `import type` only. `core-types.ts` and `package.json` are unchanged. `npm run sim` still prints 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- Diff is 334 insertions and 0 deletions on the 12 named files, under 400. No Change Notice. `main` was not committed to. The branch starts at `d05be36`, not at the kit commit on `main`.
- `se-01-recipe-reader-r1-chatB.bundle` and `HAND-BACK-se-01-recipe-reader-r1-chatB.md` were already on Drive and this chat did not upload them, so they were left untouched. This chat uploads `se-01-recipe-reader-r1-chatB2.bundle` and `HAND-BACK-se-01-recipe-reader-r1-chatB2.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- SE-02 rasteriser paints from `doc` only: check `raster` (`rasterTooNew` means it cannot paint) and add `unknownRef` for a part's `slot`. Not built here.

## Kit files used
- handoff/steps/se-01-recipe-reader.md (user-supplied sha256; not in this tree) b701d181618c7d7933c6496082956bb7d1dcaddf8461c1919718d5582081891e
- handoff/change-notices/CN-008-paint-layer.md (user-supplied sha256; not in this tree) 23189e0fd8fa5f504f3a2653137c0739543d7949df0c7e9b4e9af67f35dbd82c
- BUILD_GUIDE.md re-read before starting (main, sha256 27a12d2fc1322d27d2996b34201db38ef23f008746b901834f44bb6972b2b738); this branch's copy is the base file, unchanged, not edited, sha256 c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base d05be36) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
