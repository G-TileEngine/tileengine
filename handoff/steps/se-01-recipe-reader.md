# se-01-recipe-reader: a sprite recipe document is read field by field into a safe, typed form; every problem is a notice that names its key; caller-set caps bound the work; the new `src/paint` layer is fenced by CN-008

Step id: se-01-recipe-reader          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `d05be365f79a62e8f61c74eac7fbb0553c4bee50` (`d05be36`, the step-18-card-free-levelling merge on `main`, PR #23; verified by the Engine Architect 2026-11-12: green 214/0, sim unchanged, all sixteen smoke lines as pinned). The diff is always `<base>..<head>`.
Branch: `step/se-01-recipe-reader-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create se-01-recipe-reader-r<N>.bundle <base>..step/se-01-recipe-reader-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/se-01-recipe-reader/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-00 (the gates: `check:law`, depcruise), step-08-project-reader (the `ReadResult` / `Notice` / `checkVersion` shape this reader copies locally), step-16-door-guard (caller-set limits that throw `RangeError` on bad limits, `droppedKey`, `wrong kind` without `String()` on an object, `BTF_STAGE_LIMITS` as the pattern for BTF data in `src/btf-adapters`)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 6, 7, 10, 11, 12; §3 (the new `src/paint/` row and the scripts row, CN-008; the `src/btf-adapters/` row); `handoff/change-notices/CN-008-paint-layer.md` (attached; binding); `docs/sprite-recipe-architecture.md` §1 and §4 (attached; background for the format: where it and this file differ, this file wins); `src/project/read/guard.ts` and `src/project/read/map.ts` (the shapes and the `droppedKey` notice copied here)
Kit: kit-2, 2026-11-12. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 463/0) on Node 24.22.1 on top of the step-18 merge `d05be36` (prototype `55e5ea0`; a fresh clone of the prototype runs green), against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `npm run sim` 48/2 and 22/28, the four chaos smoke lines, the six exploit smoke lines and the six levels smoke lines are unchanged by this step (nothing in the match path imports `src/paint`).
Carries: **CN-008** (attached; `change-notices/CN-008-paint-layer.md`): two lines in `.dependency-cruiser.cjs` (new sha256 `45a3dbaa…`) and five lines in `scripts/check-law.sh` (new sha256 `4d7bbf48…`), exactly as quoted in the CN, plus two BUILD_GUIDE §3 lines (Chief Of Staff publishes the GUIDE; you do not edit it). `src/types/core-types.ts` (`f00c722c…`) and `package.json` (`1e5dd82c…`) are unchanged. `sprite-recipe` is **not** added to `CurrentFormatVersions` (DSK ruling 1: a local guard, no core-types change). No random draws anywhere in this step. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Start TileEngine's sprite track (CEO 2026-11-11: SE-01 after step 18, then engine and SE steps alternate). A sprite is a small JSON document, a **recipe** (`kind: "sprite-recipe"`, `formatVersion: 1`): a palette of colour ramps, a list of parts (shapes and hand-drawn pixel runs), outline and shade rules, a skeleton, animations, facings, skins, an optional frozen code output, and drawing history. Later slices draw it (SE-02 rasteriser) and bake it (SE-06). This step only **reads** it, safely. After this step: (1) **`readSpriteRecipe(json, limits)`** in the new layer `src/paint/recipe` returns a typed `doc` (what later slices paint from: every field checked, a default in place of each bad value, non-integers floored, lists cut at the caps) and `stored` (the document to write back: every key kept, unknown keys included, except `__proto__`, `constructor` and `prototype`). (2) **Only an unreadable document fails** (not an object, wrong kind, a bad `formatVersion`, an older version that needs migration, or something that isn't plain JSON). Every other problem is a **per-field notice naming its key** (`badField parts[3].geom.w`), and the stored value is kept (law 10: warn, don't block). (3) **`SpriteRecipeLimits`** are caller-set caps on everything that drives paint work (side length, parts, points, runs, joints, anims, frames, variants, history batches, history bytes). Over a cap is an `overCap` notice, the stored list is kept, and the items past the cap are not even read. The BTF values are the preset **`BTF_SPRITE_RECIPE_LIMITS`** in `src/btf-adapters` (CEO-accepted 2026-11-12; makers can change them). (4) **R1 round-trip:** read → write `stored` → read gives the same `doc`, the same `stored` and the same notices (less the `droppedKey` ones, which are gone). (5) **CN-008:** `src/paint` may import only `src/types` and the `Notice` type; only `src/runtime`, the future `src/editor` and `src/btf-adapters` may import `src/paint`; `check:law` bans float maths, wall time and locale in `src/paint`.

Rulings in this step (CEO 2026-11-11 via CoS; DSK rulings 2026-11-11, accepted by the Architect, and all ten sprite-recipe rulings accepted by the CEO as a block 2026-11-12: `data/sprite-recipe-rulings.md` ACCEPTED r1.1; Engine Architect 2026-11-12):
- **The CEO's sprite decisions this reader honours.** Shipped games never run code recipes live and hub uploads strip `code.src`, keeping `code.out` and `outHash`: so `code.src` is optional, and a recipe without it reads clean. Drawing history is always stripped from game exports: so `history` is optional, and a recipe without it reads clean. The same goes for `name`, `rev` and each part's `locked` and `promotedFrom`, which the paint form also drops (doc §1.9). A rasteriser change is always a new `raster` version: so `SPRITE_RASTER = 1` names the newest rasteriser this engine has, and a recipe with a newer `raster` gets the notice `rasterTooNew` (SE-02 then treats it as "can't paint", H4). Rotation is quarter turns plus mirror, with any whole degree in Advanced: so `geom.rot` is any integer, and the editor decides what Basic offers. Edges are hard and glows come from the FX layer: a recipe has no alpha or blur field to read.
- **Local guard, no core-types change (DSK ruling 1).** The guard lives in `src/paint/recipe`, with the same result and notice shape as `src/project/read` but its own types (`src/paint` may not import `src/project`). An older `formatVersion` gives `needsMigration` (the reader never patches). A newer one is read anyway and marked `readOnly: true`, with the notice `newerFormat` (the editor opens it read-only).
- **Stored fields are int, string or bool only (DSK ruling 6, doc §1.1).** A non-integer number is `floatParam`: kept in `stored`, floored in `doc`. A value of the wrong type (a string where a number belongs, and so on) or out of its range is `badField`: kept in `stored`, with the field's default in `doc`. Over a cap is `overCap`. Unknown keys are kept in `stored` and never read. Only `__proto__`, `constructor` and `prototype` are dropped, each with a `droppedKey` notice (the step-16 rule).
- **Ids `[a-z0-9_-]{1,24}`, unique per recipe (doc §1.1).** The `id`s of palette slots, parts, joints and variants share one namespace. A repeat is `duplicateId` (the value is kept in both places). The recipe's own id is `sprite_<ULID>` (DSK ruling 10).
- **SE-01 reads; later slices judge meaning (Engine Architect).** This step checks every field's type, range and shape, and the caps. Whether a reference points at something real (a part's `slot` and `joint`, a joint's `parent`, a pose's joint ids, a variant's slots), joint cycles (`jointCycle`, SE-05), a slot's `base` against its ramp length (SE-04), per-facing and per-frame `geom` against the part's kind (SE-05), `code.out` against `outHash` (`codeOutMismatch`, SE-08) and history compaction (SE-07) come with the slices that use them. Here those values are read structurally and kept.
- **Caps are per list (Engine Architect).** `points` caps each `pts` list, `runs` caps each `runs` list (a part's, a `promotedFrom`'s, a frame's), and `frames` caps each anim. `side` caps `size.w` and `size.h` (`doc` uses the cap). `historyBytes` is the UTF-8 length of `JSON.stringify(stored.history)`. Read work is bounded by the caps, because items past a cap are never read.
- **A defaulted value is never invented data (law 12).** Every default is listed in the field table below. None is a BTF value: `light` defaults to 0, not BTF's 135.
- **No random draws.** The reader is a pure function of `(json, limits)`. It never imports `src/core/rng` (nor anything but `src/types` and `src/core/notice.ts`).

## Files to create or change
- create `src/paint/recipe/types.ts`: the recipe types and `RecipeRead` (≤ 37 changed lines); `src/paint/recipe/limits.ts`: `SpriteRecipeLimits` and the limits check (≤ 14); `src/paint/recipe/fields.ts`: the field readers, one per §1 field, as in the field table (≤ 112); `src/paint/recipe/read.ts`: `SPRITE_RECIPE_FORMAT`, `SPRITE_RASTER`, the guard, the plain copy, `readSpriteRecipe` (≤ 50); `src/paint/recipe/index.ts` (≤ 7)
- create `src/btf-adapters/src/sprite-recipe-limits.ts`: `BTF_SPRITE_RECIPE_LIMITS` (≤ 8); change `src/btf-adapters/src/index.ts` (≤ 5)
- change `.dependency-cruiser.cjs`: the two CN-008 lines, exactly as in the CN (2 insertions); `scripts/check-law.sh`: the five CN-008 lines, exactly as in the CN (5 insertions)
- create `tests/paint/sample.ts`: the sample recipe and the path helpers (≤ 45); `tests/paint/recipe-fields.test.ts` (≤ 35); `tests/paint/recipe-read.test.ts` (≤ 94)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 414 (prototype `55e5ea0` on `d05be36`: 374 changed lines). No fixture files (the sample is a `.ts` helper). If you pass ~390, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 08 (shape only, not imported): `ReadResult`'s `{ ok, doc, notices }` / `{ ok: false, needsMigration, … }` arms. From core: `Notice` (`src/core/notice.ts`, type only). Import `Notice`; never retype it.
```ts
// src/paint/recipe/types.ts (imports only the Notice type)
/** A sprite recipe as read (SE-01): every field checked, defaults in place of bad values, floats floored, lists cut at the caps. */
export type PartKind = "rect" | "ellipse" | "capsule" | "blob" | "polygon" | "line" | "strokePath" | "pixelRun";
export type Run = readonly [y: number, x: number, len: number, step: number];
export type Json = Readonly<Record<string, unknown>>;
export type Outline = { readonly on: boolean; readonly px: number; readonly colour: string; readonly sides: "all" | "outer" };
export type Shade = { readonly angle?: number; readonly steps: number; readonly strength: number; readonly highlight: boolean; readonly dither: "none" | "checker" | "bayer4" };
export type Slot = { readonly id: string; readonly ramp: readonly string[]; readonly base: number; readonly team?: boolean };
export type RecipePart = {
  readonly id: string; readonly kind: PartKind; readonly slot: string; readonly z: number; readonly joint: string; readonly mirror: "none" | "x";
  readonly visible: boolean; readonly locked?: boolean; readonly geom?: Readonly<Record<string, number | readonly (readonly [number, number])[] | string>>;
  readonly outline?: Outline; readonly shade?: Shade; readonly runs?: readonly Run[]; readonly promotedFrom?: { readonly runs: readonly Run[] };
};
export type Pose = Readonly<Record<string, { readonly dx: number; readonly dy: number; readonly rot: number }>>;
export type Frame = { readonly ms: number; readonly pose: Pose; readonly parts?: Readonly<Record<string, { readonly visible?: boolean; readonly slot?: string; readonly geom?: Json }>>; readonly runs?: Readonly<Record<string, readonly Run[]>> };
export type Anim = { readonly name: string; readonly loop: boolean; readonly gen?: { readonly kind: "walk"; readonly style: "bob" | "4" | "6"; readonly stride: number; readonly bob: number; readonly arm: number }; readonly frames: readonly Frame[] };
export type Facing = { readonly parts: Readonly<Record<string, { readonly visible?: boolean; readonly z?: number; readonly geom?: Json }>>; readonly pose?: Pose };
export type SpriteRecipe = {
  readonly kind: "sprite-recipe"; readonly formatVersion: number; readonly id: string; readonly rev?: number; readonly name?: string; readonly raster: number;
  readonly size: { readonly w: number; readonly h: number }; readonly light: number; readonly palette: { readonly slots: readonly Slot[] };
  readonly defaults: { readonly outline: Outline; readonly shade: Shade }; readonly parts: readonly RecipePart[];
  readonly skeleton: { readonly joints: readonly { readonly id: string; readonly parent: string | null; readonly at: { readonly x: number; readonly y: number } }[] };
  readonly anims: readonly Anim[]; readonly facings?: { readonly down: Facing; readonly up: Facing; readonly side: Facing; readonly sideMirror: "side" | null };
  readonly variants: readonly { readonly id: string; readonly swap: Readonly<Record<string, readonly string[] | string>> }[];
  readonly code: { readonly lang: "js"; readonly src?: string; readonly out?: readonly unknown[]; readonly outHash?: string } | null;
  readonly history?: { readonly cap: number; readonly baseSeq: number; readonly ops: readonly unknown[] };
};
/** `doc` is what painting reads; `stored` is the document to write back (every key kept except `__proto__`, `constructor`, `prototype`). */
export type RecipeRead =
  | { readonly ok: true; readonly doc: SpriteRecipe; readonly stored: Json; readonly notices: readonly Notice[]; readonly readOnly: boolean }
  | { readonly ok: false; readonly needsMigration: true; readonly kind: "sprite-recipe"; readonly found: number }
  | { readonly ok: false; readonly needsMigration: false; readonly error: string };
// src/paint/recipe/limits.ts
/** Caller-set caps on everything that drives paint work (SE-01; step-16 `StageLimits` pattern), no defaults. `side` caps `size.w` and `size.h`;
 *  `points` and `runs` cap each list; `frames` caps each anim; `historyBytes` is the UTF-8 length of the stored `history` as JSON. */
export type SpriteRecipeLimits = {
  readonly side: number; readonly parts: number; readonly points: number; readonly runs: number; readonly joints: number;
  readonly anims: number; readonly frames: number; readonly variants: number; readonly historyBatches: number; readonly historyBytes: number;
};
// src/paint/recipe/read.ts
/** The stored shape this reader knows, and the newest rasteriser this engine has (a newer `raster` can't be painted: H4, SE-02). */
export const SPRITE_RECIPE_FORMAT = 1;
export const SPRITE_RASTER = 1;
export function readSpriteRecipe(json: unknown, limits: SpriteRecipeLimits): RecipeRead;
// src/paint/recipe/index.ts
export type { Anim, Facing, Frame, Outline, PartKind, Pose, RecipePart, RecipeRead, Run, Shade, Slot, SpriteRecipe } from "./types.ts";
export type { SpriteRecipeLimits } from "./limits.ts";
export { SPRITE_RASTER, SPRITE_RECIPE_FORMAT, readSpriteRecipe } from "./read.ts";
// src/btf-adapters/src/sprite-recipe-limits.ts
import type { SpriteRecipeLimits } from "../../paint/recipe/index.ts";
/** BTF sprite recipe caps (CEO 2026-11-12, docs/sprite-recipe-architecture.md §1.1): what one BTF recipe may hold before the excess is warned and not drawn. */
export const BTF_SPRITE_RECIPE_LIMITS: SpriteRecipeLimits = { side: 256, parts: 256, points: 256, runs: 16384, joints: 64, anims: 32, frames: 64, variants: 32, historyBatches: 2000, historyBytes: 1000000 };
// src/btf-adapters/src/index.ts — appended
export { BTF_SPRITE_RECIPE_LIMITS } from "./sprite-recipe-limits.ts";
```
Write your own comments in your own words, except the two quoted on `SpriteRecipeLimits` and `BTF_SPRITE_RECIPE_LIMITS`. How `fields.ts` is built is yours (the prototype uses small composable field readers driven by one table), as long as the behaviour and the field table below hold. `src/types/**`, `src/core/**`, `src/state/**`, `src/project/**`, `src/rules/**`, `src/fx/**`, `src/runtime/**`, `src/sim/**`, `src/index.ts` and `tests/fixtures/**` are unchanged.

Behaviour (exact; each line has a test):
1. **Limits are checked once, first:** `readSpriteRecipe` throws `RangeError("readSpriteRecipe: limits must be integers >= 0")` unless all ten `SpriteRecipeLimits` values are integers ≥ 0 (a caller bug, step-16 rule). Nothing else in `src/paint` throws.
2. **The guard, in this order** (the only failures): `json` null or not an object (`typeof`) → `{ ok: false, needsMigration: false, error: "not an object" }`. Then the plain copy (Behaviour 3), **before anything else is read**: if it throws (a cycle, a BigInt, nesting too deep to copy, a throwing getter or `toJSON`, a revoked proxy or a proxy trap that throws), the result is `error: "not plain JSON"`. Every later check reads `stored`, never `json`: `stored` an array → `not an object`; `kind !== "sprite-recipe"` → `error: "wrong kind <k>"`, where `<k>` is `object` when `kind` is a non-null object or array and `String(kind)` otherwise (never `String()` on an object, step 16); `formatVersion` not an integer → `error: "bad field formatVersion"`; `formatVersion < 1` → `{ ok: false, needsMigration: true, kind: "sprite-recipe", found }`; `formatVersion > 1` → read on, with `readOnly: true` and the first notice `newerFormat formatVersion` (the copy's `droppedKey` notices come after it). So a document that can't be copied is `not plain JSON` even when its `kind` or version is also wrong. Nothing ever throws out of the reader for any input (QA SE-01 hold: reading `kind` or `formatVersion` from `json` before the copy let a throwing getter escape).
3. **`stored`, the plain copy:** the JSON text round-trip of `json`. An own key `__proto__`, `constructor` or `prototype` of an object (not an array) is dropped at any depth, with one notice `droppedKey <key>` each, in document order; its value is not entered. Every other key and value is kept as it was (unknown keys included). Non-finite numbers become `null`, as in JSON. All reading, the guard's included, is done on `stored`, never on `json`.
4. **Reading the fields into `doc`:** `doc` starts with `kind: "sprite-recipe"` and `formatVersion` (as found), then every field of the field table, read from `stored` in the table's order (for a part: its fields in table order, then `geom`). Rules for every field:
   - an **int**: not a finite number → `badField`, default; not an integer → `floatParam`, floored; then outside its range → `badField`, default;
   - a **string, bool, enum or pattern**: anything else → `badField`, default (an enum's default is its first value);
   - an **object**: not a plain object → **one** `badField` for the object itself; its fields then take their defaults with no further notices;
   - a **list**: not an array → `badField`, `[]`; longer than its cap → `overCap` (a `SpriteRecipeLimits` cap) or `badField` (a format bound), and the items past it are not read; shorter than its minimum → `badField` (the items are still read). A list's notice comes before its items' notices;
   - a **record** (an object keyed by ids): not a plain object → `badField`, `{}`; a key that is not an id → `badField <record>.<key>`, and that entry is skipped;
   - a **required** field that is missing is `badField`; an **optional** field (marked `?`) that is missing is absent from `doc`, with no notice;
   - an **id** field (`palette.slots[].id`, `parts[].id`, `skeleton.joints[].id`, `variants[].id`) that repeats an earlier one → `duplicateId` (both values kept).
5. **Runs** (`[y, x, len, step]`): an item that is not an array of 4 → `badField runs[i]`; each element is an int (y, x any; `len` ≥ 1; `step` ≥ −2: −1 = base, let shade decide; −2 = erase), named `runs[i][j]`. A run with any `badField` is not in `doc`. A run that comes before the last kept run (smaller `y`, or the same `y` and smaller `x`) → `badField runs[i]`, not in `doc`. **Points** (`[x, y]`): the same, with pairs of two ints.
6. **Geometry by kind:** `geom` is read by the part's `kind`, as in the table; every kind but `pixelRun` also takes an optional `rot` (int). A `pixelRun` that has a `geom` → `badField parts[i].geom`, and `doc` has no `geom`. A bad `kind` reads as `"pixelRun"`, and its `geom` is not read (no second notice).
7. **Caps:** `side` caps `size.w` and `size.h` (over it: `overCap size.w`, and `doc` holds `side`). `parts`, `joints`, `anims` and `variants` cap their lists. `points` caps each `pts` list, `runs` caps each `runs` list, `frames` caps each anim's `frames`, and `historyBatches` caps `history.ops`. After all field notices, if `stored.history` is present and the UTF-8 length of `JSON.stringify(stored.history)` is above `historyBytes` → `overCap history` (`doc.history` unchanged). A value exactly at its cap gives no notice.
8. **Raster:** last, if `doc.raster > SPRITE_RASTER` → `rasterTooNew raster` (`doc.raster` keeps the value).
9. **Notices** are `{ code, message: "<code> <key>" }` (no `at`), with the codes `badField`, `floatParam`, `overCap`, `droppedKey`, `duplicateId`, `rasterTooNew` and `newerFormat`. A key is the path as written: `size.w`, `parts[3].geom.pts[1][0]`, `anims[0].frames[0].pose.root.dx`, `variants[0].swap.skin[1]`; `droppedKey` names only the dropped key.
10. **R1:** for any readable document, reading `JSON.parse(JSON.stringify(stored))` with the same limits gives the same `doc`, the same `stored`, the same `readOnly` and the same notices less the `droppedKey` ones. A recipe in paint form (no `history`, `name`, `rev`, part `locked` or `promotedFrom`, or `code.src`) reads with no notice.

Field table (`int a–b` is an integer range; `id` is `[a-z0-9_-]{1,24}`; `ref` is an id-shaped string that is not checked against anything here; a colour is `#rrggbb`, hex digits in either case; defaults in brackets):
| Field | Type and range [default] |
|---|---|
| `id` | string `sprite_` + 26 of `0-9 A-H J K M N P-T V-Z` (a ULID) [`""`] |
| `rev?` / `name?` | int ≥ 0 [0] / string [`""`] |
| `raster` | int ≥ 1 [1] |
| `size` | `{ w, h }`: int ≥ 1, capped by `side` [32] |
| `light` | int [0] |
| `palette` | `{ slots }`; `slots[]` (no cap): `{ id: id, ramp, base: int 0–7 [0], team?: bool [false] }`; `ramp` is a list of 2–8 colours (format bound), each [`"#000000"`] |
| `defaults` | `{ outline, shade }` |
| outline (also `parts[].outline?`) | `{ on: bool [false], px: int 0–2 [1], colour: "darker" or a ref ["darker"], sides: "outer" \| "all" }` |
| shade (also `parts[].shade?`) | `{ angle?: int [0], steps: int 1–4 [2], strength: int 0–100 [60], highlight: bool [false], dither: "none" \| "checker" \| "bayer4" }` |
| `parts[]` (cap `parts`) | `{ id: id, kind: "pixelRun" \| "rect" \| "ellipse" \| "capsule" \| "blob" \| "polygon" \| "line" \| "strokePath", slot: ref, z: int [0], joint: ref, mirror: "none" \| "x", visible: bool [false], locked?: bool, outline?, shade?, runs?: runs, promotedFrom?: { runs: runs }, geom }` |
| `parts[].geom` by kind (ints [0]) | `rect` `{ x, y, w ≥ 0, h ≥ 0, round 0–100 }`; `ellipse` `{ cx, cy, rx ≥ 0, ry ≥ 0 }`; `capsule` `{ x0, y0, x1, y1, r ≥ 0 }`; `blob` `{ pts (≥ 3 points), round 0–100 }`; `polygon` `{ pts (≥ 3) }`; `line` `{ x0, y0, x1, y1, width 1–3 [1], cap: "butt" \| "round" }`; `strokePath` `{ pts (≥ 2), width 1–3 [1], cap }`; each with `rot?` int; `pixelRun`: none |
| `skeleton` | `{ joints }`; `joints[]` (cap `joints`): `{ id: id, parent: null or a ref [null], at: { x, y } (ints [0]) }` |
| `anims[]` (cap `anims`) | `{ name: string [""], loop: bool [false], gen?: { kind: "walk", style: "4" \| "6" \| "bob", stride: int 0–4, bob: int 0–2, arm: int 0–4 [0] }, frames }`; `frames[]` (cap `frames`): `{ ms: int ≥ 1 [100], pose, parts?: record of { visible?: bool, slot?: ref, geom?: object }, runs?: record of runs }` |
| pose (also a facing's `pose?`) | record of `{ dx, dy, rot }` (ints [0]) |
| `facings?` | `{ down, up, side, sideMirror: null \| "side" }`; each facing `{ parts: record of { visible?: bool, z?: int, geom?: object }, pose? }` |
| `variants[]` (cap `variants`) | `{ id: id, swap: record of (a ramp list, if an array; else a ref) }` |
| `code` | `null`, or `{ lang: "js", src?: string, out?: list (no cap), outHash?: 64 lowercase hex [""] }`; anything else (also missing) → `badField`, `null` |
| `history?` | `{ cap: int ≥ 1 [2000], baseSeq: int ≥ 0 [0], ops: list (cap `historyBatches`) }` |
The contents of a frame's or a facing's `geom` (an object), and the items of `code.out` and `history.ops`, are kept but not read in this step (SE-05, SE-08, SE-07).

## Draw order
None. This step makes no random draw and creates no rng stream; `src/paint` may not import `src/core/rng` (CN-008). Every existing seeded stream, smoke line and `npm run sim` line is untouched because nothing on the match path imports `src/paint`.

## Tests that prove it is done
Run: `npm test`. Common: `LIM = BTF_SPRITE_RECIPE_LIMITS`; `SAMPLE` is the recipe below, quoted exactly (one recipe holding every field of the table, all valid; `RUN(y, x, len, step)` is `[y, x, len, step]`), in `tests/paint/sample.ts` with your own copy / get-at-path / set-at-path helpers. **The field paths** of `SAMPLE` are every key path in it, except the top-level `kind` and `formatVersion`. Objects and arrays are entered, except these four, which are listed but not entered: a run or a point (an array whose first item is a number), `history.ops`, `code.out`, and a frame's or a facing's `geom`. Each path is named as Behaviour 9 names keys. There are **240**. Test titles start with the quoted words (QA's plants find tests by them); the rest of each title is yours.
```ts
export const SAMPLE = {
  kind: "sprite-recipe", formatVersion: 1, id: "sprite_01JD7Z5K3M8Q2W4E6R9T0Y1X2V", rev: 7, name: "Hero", raster: 1, size: { w: 32, h: 24 }, light: 135,
  palette: { slots: [{ id: "skin", ramp: ["#5a3a2a", "#8a5a40", "#c08a68"], base: 2 }, { id: "cloak", ramp: ["#0a1428", "#26384a"], base: 1, team: true }] },
  defaults: { outline: { on: true, px: 1, colour: "darker", sides: "outer" }, shade: { steps: 2, strength: 60, highlight: true, dither: "none" } },
  parts: [
    { id: "body", kind: "rect", slot: "skin", z: 0, joint: "root", mirror: "none", visible: true, locked: false, geom: { x: 1, y: 2, w: 8, h: 9, round: 50, rot: 90 },
      outline: { on: false, px: 2, colour: "cloak", sides: "all" }, shade: { angle: 45, steps: 3, strength: 10, highlight: false, dither: "bayer4" },
      runs: [RUN(0, 1, 2, -1), RUN(1, 0, 1, -2)], promotedFrom: { runs: [RUN(2, 2, 3, 1)] } },
    { id: "head", kind: "ellipse", slot: "skin", z: 1, joint: "neck", mirror: "x", visible: true, geom: { cx: 5, cy: 4, rx: 3, ry: 2 } },
    { id: "arm", kind: "capsule", slot: "skin", z: 2, joint: "root", mirror: "none", visible: true, geom: { x0: 0, y0: 0, x1: 4, y1: 6, r: 1 } },
    { id: "cape", kind: "blob", slot: "cloak", z: -1, joint: "neck", mirror: "none", visible: true, geom: { pts: [[0, 0], [6, 0], [6, 8], [0, 8]], round: 40 } },
    { id: "badge", kind: "polygon", slot: "cloak", z: 3, joint: "root", mirror: "none", visible: false, geom: { pts: [[1, 1], [3, 1], [2, 3]] } },
    { id: "spear", kind: "line", slot: "skin", z: 4, joint: "root", mirror: "none", visible: true, geom: { x0: 0, y0: 9, x1: 9, y1: 0, width: 2, cap: "round" } },
    { id: "belt", kind: "strokePath", slot: "cloak", z: 5, joint: "root", mirror: "none", visible: true, geom: { pts: [[0, 5], [8, 5]], width: 1, cap: "butt" } },
    { id: "eyes", kind: "pixelRun", slot: "skin", z: 6, joint: "neck", mirror: "none", visible: true, runs: [RUN(3, 4, 1, 0), RUN(3, 6, 1, 0), RUN(4, 0, 2, -1)] },
  ],
  skeleton: { joints: [{ id: "root", parent: null, at: { x: 16, y: 23 } }, { id: "neck", parent: "root", at: { x: 16, y: 8 } }] },
  anims: [{ name: "walk-down", loop: true, gen: { kind: "walk", style: "4", stride: 2, bob: 1, arm: 3 },
    frames: [{ ms: 120, pose: { root: { dx: 0, dy: -1, rot: 0 } }, parts: { head: { visible: true, slot: "cloak", geom: { cx: 6 } } }, runs: { eyes: [RUN(3, 4, 1, 1)] } }] }],
  facings: { down: { parts: { cape: { visible: false } } }, up: { parts: { head: { z: 9, geom: { ry: 3 } } }, pose: { neck: { dx: 1, dy: 0, rot: 90 } } }, side: { parts: {} }, sideMirror: "side" },
  variants: [{ id: "night", swap: { skin: ["#101010", "#202020"], cloak: "skin" } }],
  code: { lang: "js", src: "emit()", out: [{ op: "addPart" }], outHash: "0".repeat(64) },
  history: { cap: 2000, baseSeq: 0, ops: [{ seq: 1 }, { seq: 2 }] },
};
```
- `tests/paint/recipe-fields.test.ts`
  - "recipe sample reads clean (SE-01)…": `readSpriteRecipe(copy of SAMPLE, LIM)` is ok with notices `[]`, `readOnly` false, and both `doc` and `stored` deep-equal `SAMPLE` (so every field in it is read).
  - "recipe field list (SE-01)…": there are 240 field paths, among them `light`, `palette.slots[1].team`, `defaults.shade.dither`, `parts[0].promotedFrom.runs[0]`, `parts[3].geom.pts[3]`, `parts[7].runs[2]`, `skeleton.joints[1].parent`, `anims[0].gen.arm`, `anims[0].frames[0].runs.eyes[0]`, `facings.up.pose.neck.rot`, `facings.sideMirror`, `variants[0].swap.cloak`, `code.outHash` and `history.ops`.
  - "recipe field <key> (SE-01)…": **one test per field path** (240 tests, generated in a loop). The value at the path is set to `7` if it is a boolean, else to `true` (always the wrong type). Then the notices are exactly `[{ code: "badField", message: "badField <key>" }]`, `stored` holds the wrong value at that path, and `doc`'s value there is not it. Then the same path set to each of `null`, `NaN`, `-1e9`, `0.5`, `""`, `[]`, `{}` and `"__proto__"` still gives `ok: true` (no throw).
- `tests/paint/recipe-read.test.ts`
  - "recipe guard (SE-01)…": `null`, `[]`, `"x"`, `7` → `not an object`. `kind` `"map"` → `wrong kind map`; `kind` `{}` → `wrong kind object`. `formatVersion` `"1"`, `1.5` and missing → `bad field formatVersion`. `0` → `{ ok: false, needsMigration: true, kind: "sprite-recipe", found: 0 }`. `2` → ok, `readOnly` true, notices exactly `["newerFormat formatVersion"]` (as messages), `doc.formatVersion` 2, 8 parts. A cyclic object → `not plain JSON`. `SAMPLE` with a throwing own enumerable getter on `kind`, on `formatVersion` and on `name` (one at a time), and a revoked proxy → each `{ ok: false, needsMigration: false, error: "not plain JSON" }`, no throw. `SAMPLE` plus a key `deep` holding 1000 nested arrays → ok; 100000 nested → `not plain JSON` (no throw). `SPRITE_RASTER` is 1; `raster` 2 → `["rasterTooNew raster"]` and `doc.raster` 2.
  - "recipe limits (SE-01)…": `BTF_SPRITE_RECIPE_LIMITS` deep-equals the quoted value. `{ ...LIM, runs: x }` for x = −1, 1.5, NaN throws the quoted RangeError.
  - "recipe caps (SE-01)…": for each cap, with `{ ...LIM, [cap]: n }` at the sample's count n → no notice, and at n − 1 → notices exactly `["overCap <key>"]`, the capped value or length is n − 1, and `stored` deep-equals `SAMPLE`: `side` 32 → `size.w` (`doc.size.w` 31); `parts` 8 → `parts`; `points` 4 → `parts[3].geom.pts`; `runs` 3 → `parts[7].runs`; `joints` 2 → `skeleton.joints`; `anims` 1 → `anims`; `frames` 1 → `anims[0].frames`; `variants` 1 → `variants`; `historyBatches` 2 → `history.ops`; `historyBytes` = the UTF-8 length of `JSON.stringify(SAMPLE.history)` → `history`.
  - "recipe floats, ids and runs (SE-01)…": `size.w` 31.7 and `parts[7].runs[0][2]` 1.5 → `["floatParam size.w", "floatParam parts[7].runs[0][2]"]`, `doc.size.w` 31, that run `[3, 4, 1, 0]`, and `stored.size.w` 31.7. `skeleton.joints[0].id` `"arm"` → `["duplicateId skeleton.joints[0].id"]`. `parts[7].runs[2]` set to `[3, 5, 1, 0]` (before the run at x 6) → `["badField parts[7].runs[2]"]`; to `[5, 0, 0, 0]` → `["badField parts[7].runs[2][2]"]`; to `[5, 0, 1, -3]` → `["badField parts[7].runs[2][3]"]`; to `[5, 0, 1]` → `["badField parts[7].runs[2]"]`; each leaves 2 runs in `doc`. `parts[7].geom` `{ x: 1 }` (on the pixelRun) → `["badField parts[7].geom"]`.
  - "recipe formats and ranges (SE-01)…": each gives exactly one `badField` naming its key: `id` `"sprite_01jd7z5k3m8q2w4e6r9t0y1x2v"` (lower case); `parts[0].id` `"Body"`; `parts[0].slot` 25 × `"x"`; `palette.slots[0].ramp[0]` `"#12345"`; `parts[0].outline.colour` `"dark!"`; `code.outHash` 63 zeros; `size.w` 0; `defaults.outline.px` 3; `parts[0].geom.round` 101; `anims[0].gen.stride` 5; a pose key `Root` (`anims[0].frames[0].pose.Root`). `palette.slots[0].ramp[0]` `"#5A3A2A"` reads clean.
  - "recipe droppedKey (SE-01)…": the JSON text of `SAMPLE` plus `createdAt: "2026-11-12"` and `note: { x: 1 }`, with `"__proto__":{"polluted":1}` added after `name`, `"constructor":{"prototype":1}` in `parts[0]` and `"prototype":7` in `defaults.shade`, parsed and read → notices exactly `["droppedKey __proto__", "droppedKey prototype", "droppedKey constructor"]` (document order; the `prototype` inside the dropped `constructor` is not visited). None of the three is in `stored`, `Object.prototype` is not polluted, `createdAt` and `note` are kept in `stored`, and `doc` has no `note` and deep-equals `SAMPLE`.
  - "recipe R1 round-trip (SE-01)…": `SAMPLE` with `light` 1.5, an own `"__proto__":1` in `palette.slots[0]` (added in the JSON text), `parts[1].z` `"3"` and an unknown `extra: [1, { a: 2 }]`, read with `{ ...LIM, parts: 6 }` → notices `["droppedKey __proto__", "floatParam light", "overCap parts", "badField parts[1].z"]`. Reading `JSON.parse(JSON.stringify(stored))` with the same limits gives the same `doc`, the same `stored` and the first notices less `droppedKey`. `SAMPLE` in paint form (without `history`, `name`, `rev`, `parts[0].locked`, `parts[0].promotedFrom` and `code.src`) reads with no notice.
- Unchanged (byte-identical): `npm run sim` prints the base's two lines; the four chaos smoke lines, the six exploit smoke lines and the six levels smoke lines are as at the base (step 18 "Tests").

## How a planted bug is caught (for QA; prototype `55e5ea0` on `d05be36`; reverted after each; `/tmp/se01-plants.sh` on the Architect's box)
Each plant is an **intent**; the script holds the prototype's example patch. On the build, QA adapts the patch text to that build's code (same intent, same expected failing tests). A "plant text not found" line means "adapt it", not "passed".
| Plant (one edit; intent) | Tests that fail (of 463), by title prefix |
|---|---|
| a wrong type where a number belongs is read / a bad object warns once per field too / a notice loses its parent key / a frame's or facing's `geom` accepts any value | recipe field |
| a part field not read (`mirror`) / a geometry field not read (`rect` `round`) | recipe sample reads clean, recipe field |
| a non-integer not floored / duplicate ids not warned / runs out of x order accepted / a bad run drawn / a pixelRun's `geom` not warned | recipe floats |
| a non-integer gives no `floatParam` | recipe floats, R1 |
| format ranges not checked | recipe formats, recipe floats |
| ids, colours or the `sprite_<ULID>` pattern not checked (three plants) | recipe formats |
| over a cap gives no `overCap` / a list exactly at its cap warned (off by one) / items past the cap still read / size not capped by `side` / history bytes not checked / `history.ops` capped by the wrong limit | recipe caps |
| `__proto__` and `prototype` kept / a dropped key gives no notice | recipe droppedKey |
| unknown keys not kept (`stored` is the read view) | recipe droppedKey, recipe caps |
| a field the export strips is required (`history`) | R1 |
| an older version not `needsMigration` / a newer version not read-only / a newer version refused / a newer `raster` not warned / a non-JSON document throws / `kind` and `formatVersion` read from `json` before the plain copy (a throwing getter escapes) / the array check reads `json` outside the copy (a revoked proxy escapes) | recipe guard |
| bad limits accepted / a BTF cap changed | recipe limits |

All 35 test plants fail at least one named test (`/tmp/se01-fix-plants.log`: 64/64 plants in all). **Depcruise plants (CN-008)**, each one probe file, checked with the new config and with the base config: a `src/paint` import of `src/core/clock`, `src/state`, `src/sim` or `src/btf-adapters` → `paint-imports-only-types-notice` (plus `nothing-imports-sim` / `adapters-only-from-runtime-editor` for the last two); an import of `src/paint` from `src/sim`, `src/rules`, `src/project`, `src/core`, `src/fx` or `src/*.ts` → `only-runtime-editor-import-paint` (plus the layer's own rule where it has one); imports of `src/paint` from `src/runtime/host`, `src/editor` and `src/btf-adapters` pass (13/13). **Law plants:** `**`, `Math.pow`, `Math.sin`, `Math.hypot`, `Math.log`, `Intl`, `Date` and `damage` in a `src/paint` file each fail `check:law` `[paint-integer-only]`; a JSDoc `/**` and a plain `*` pass (9/9). **Grep plants** (caught by Acceptance): `src/sim` importing `src/paint`; `Math.sin`, `eval` or `createRng` in `src/paint`; a second `throw`; an extra file; `core-types.ts` or `package.json` touched; a CN line edited; `BTF_SPRITE_RECIPE_LIMITS` used outside `src/btf-adapters`. Scripted (7/7): a `src/btf-adapters` value import of `readSpriteRecipe` (one line, or split over lines), a value re-export, an inline `{ type X }` import and a dynamic `import()` of `src/paint` each fail the type-only grep, while `npm run deps` passes them (depcruise allows the package; the grep is the gate); a multi-line `import type` passes; and `kind` / `formatVersion` read from `json` before the copy fails the hostile-input probe (a throwing getter on `kind`, `formatVersion` or a later field, a throwing `toJSON`, a revoked proxy, a cycle and a throwing proxy trap must each give `not plain JSON`).

## Example
```ts
const r = readSpriteRecipe(JSON.parse(text), BTF_SPRITE_RECIPE_LIMITS);  // the host passes its own caps; the editor may pass bigger ones
if (!r.ok) return r.needsMigration ? migrate(r.found) : showError(r.error);   // only an unreadable document stops here
r.notices;   // e.g. [{ code: "floatParam", message: "floatParam parts[2].geom.r" }, { code: "overCap", message: "overCap parts[7].runs" }]
r.doc;       // typed, safe to paint from (SE-02): parts[2].geom.r floored, runs past the cap not read
r.stored;    // what the editor writes back: unchanged except for any dropped __proto__ / constructor / prototype keys
r.readOnly;  // true for a newer formatVersion: the editor opens it read-only
```

## How later steps use this (context only; do not build)
- SE-02 (rasteriser) paints from `doc` only: it checks `raster` against its table (`rasterTooNew` → H4 "can't paint") and adds the reference checks it needs (`unknownRef` for a part's `slot`).
- SE-04 checks a slot's `base` against its ramp and team slots in variants. SE-05 adds `jointCycle`, the joint references, and per-facing and per-frame `geom` by kind. SE-07 adds history compaction and `huntSpriteRecipes`, which tampers recipes through this reader and checks that it never throws, every notice names a key, the caps hold and the output is plain JSON. SE-08 adds `codeOutMismatch` (`code.out` vs `outHash`) and the export audit for `code.src`.
- The paint-form hash (JCS of `stored` minus history, name, rev, timestamps, `copiedFrom`, `locked`, `promotedFrom` and `code.src`, doc §1.9) is computed from `stored` in a later slice. R1 here is what makes it stable.
- The runtime (bank, SE-06) and the editor (SE-09) are the only importers besides `src/btf-adapters` (CN-008).

## Decisions note: what to name
- How you built the field readers, and how your tests prove every row of the field table is read (the sample reads clean, and doc equals the sample) and warned by key (one test per field path).
- How `doc` and `stored` are kept apart (what is floored, defaulted or cut in `doc`, and kept in `stored`), and how R1 holds.
- How read work stays bounded (items past a cap are never read; the opaque parts are not entered) and why the reader never throws (the plain copy in a try, taken before the guard reads anything, so the guard and the fields read only the copy; field reading driven by the table and not by the input's depth).
- The guard order and why a newer version is read (read-only) and not refused.
- The notice order you produce (Behaviour 4, 7, 8), if it differs anywhere from this file, and why.
- How CN-008's two depcruise lines and the check-law gate are proven (your own planted imports and words).
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/check-state.sh`, `scripts/sim.ts`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json` (change only by Change Notice).
- `.dependency-cruiser.cjs` and `scripts/check-law.sh`, **except** the CN-008 lines (2 and 5); every other line stays byte-identical.
- `src/core/**`, `src/state/**`, `src/project/**`, `src/rules/**`, `src/fx/**`, `src/runtime/**`, `src/sim/**`, `src/index.ts`, `src/btf-adapters/src/{fx-preset,lane-labels,stage-limits,levels}.ts`.
- `tests/fixtures/**` and every test and helper not in the file list.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 463; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos smoke lines, the six exploit smoke lines and the six levels smoke lines are as at the base.
- [ ] `npm run check:state` / `check:law` print OK; `npm run deps` reports no violations. `sha256sum src/types/core-types.ts package.json .dependency-cruiser.cjs scripts/check-law.sh` prints `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`, `45a3dbaad28c0c827e2aa64ed0b63129b471e29482c8d6e6d88f5211c5118831` (CN-008) and `4d7bbf48edf945851022711bf9a9e765db8eac63b77c52b14865e5faf83b0163` (CN-008). `git diff --numstat <base>..<head> -- .dependency-cruiser.cjs scripts/check-law.sh` shows 2 and 5 insertions with no deletion. `git diff <base>..<head> -- BUILD_GUIDE.md docs src/types src/core src/state src/project src/rules src/fx src/runtime src/sim src/index.ts` is empty.
- [ ] Names: `SpriteRecipeLimits` with the ten keys in the quoted order; `readSpriteRecipe(json: unknown, limits: SpriteRecipeLimits): RecipeRead`; `SPRITE_RECIPE_FORMAT = 1` and `SPRITE_RASTER = 1`; `RecipeRead` with its three arms as quoted; the `BTF_SPRITE_RECIPE_LIMITS` line as quoted, and `rg -l BTF_SPRITE_RECIPE_LIMITS src` lists only the two `src/btf-adapters/src` files; the index exports as quoted.
- [ ] Notices and failures: each of the seven codes `badField`, `floatParam`, `overCap`, `droppedKey`, `duplicateId`, `rasterTooNew`, `newerFormat` appears in `src/paint/recipe`; the hard errors are only `not an object`, `wrong kind …`, `bad field formatVersion`, `not plain JSON` and `needsMigration`; exactly one `throw` in `src/paint` (the limits `RangeError`). Hostile objects never throw out of the reader: a throwing getter on `kind`, `formatVersion` or a later field, a throwing `toJSON`, a revoked proxy, a cycle and a proxy whose traps throw each give `not plain JSON`.
- [ ] Layer (CN-008): every import in `src/paint` is `./…`, `../../types/…` or `../../core/notice.ts`; no file outside `src/paint`, `src/runtime`, `src/editor` and `src/btf-adapters` imports `src/paint`; `src/btf-adapters` imports it with `import type` only: every statement there that imports or re-exports `src/paint` (read across line breaks) starts `import type` or `export type` (an inline `{ type X }` does not count), and there is no dynamic `import()` or `require()` of it. `npm run deps` allows the package, so this is checked by grep.
- [ ] Laws hold in `src/paint`: no `**`, `Math.pow`, trig, `exp`, `log`, `hypot`, `Math.random`; no `Date`, `Intl`, `performance` or timers; no `eval`, `Function(`, `new Function`, dynamic `import(`, `Worker` or `require(` (a recipe's code never runs here); no `createHash`, `crypto.`, `process.`, `node:` imports, `fetch`, `localStorage` or `globalThis`; no rng (`createRng`, `streamSeed`, `core/rng`); no rules words (`hp|maxhp|mana|cost|damage|deck|cards?|stats?|gold|currency|reward`) in `src/paint` or `src/btf-adapters/src/sprite-recipe-limits.ts`.
- [ ] Tests: the ten quoted title prefixes exist; the per-field tests are generated from the sample's field paths (240).
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 12 files of the file list (`A` for the nine created, `M` for the three changed); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/se-01-recipe-reader/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- The rasteriser, goldens, the walk generator, the bank, bake, the memory meter (SE-02 to SE-06). Any hashing (JCS, paint-form hash), and `params.sprite` in the project reader (a later project-format step).
- Reference checks (`unknownRef`), `jointCycle`, slot `base` against its ramp, team-slot rules, per-facing and per-frame `geom` by kind, `codeOutMismatch`, history compaction or Squash, `stripHistory`, the export audit, `huntSpriteRecipes`, `upgradeSpriteRaster`, migrations (`migrations/sprite-recipe/` stays empty).
- The ESLint mirror of the `src/paint` ban list (SE-02, the first slice with pixel maths). Writing recipes (the editor's ops and writer, SE-09 onward).

## Out of scope
- Any game rule, HP, damage or stat; the match path (`src/sim`, `src/rules`, `src/runtime/input`); networking, saves, the hub; any change to the command log, the state tables or core types.
