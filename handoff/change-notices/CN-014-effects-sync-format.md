# CN-014 (33a): effect sync and depth (clip events, anchor points, attach, draw layers, lit) (format only, additive, render only; no pin moves)

Filed by: Data & Save Format Keeper, 2026-11-13 18:4x London. Status: **ACCEPTED pending the EA's confirmation of the DSK rulings.** Sources: UX `ux/effects-sprite-sync.md` (`4e72b97e`) §9 fields, §10 EA answers 18:33; CEO 18:35 via the EA; DSK rulings. CN-011 stays reserved for scene-pin.
Kind: format only, additive, render only. **core-types unchanged at `61fad786`** (it holds no AssetMeta, clip, recipe or effect-step types). No version bump, no migration: every field is optional; all absent = today's draw list, byte-identical (UX A5).

Docs: project-format **r35** (`ce7e9f53`), setup-format **r23** (`193e4075`) §2.10.3.1. Catalogue request **L48** (after L47).

## Fields
| Field | Home | Type / range | Absent means | Warnings |
|---|---|---|---|---|
| `clips[].events` | sprite AssetMeta clip (project-format §6.2) | `{frame: int 0…frames.length−1, name: "release"\|"contact"\|"step"\|"end"\|string 1–16}[]`, at most 16 | derived, never stored: `contact` = biggest pose change (else `floor(n/2)`), `release` = same frame. `null` / `[]` = absent | `clipEventInvalid` (bad entry skipped; non-array = absent), `clipEventsOverCap` (over 16: **the first 16 in stored order fire**, the rest are kept and never fire) |
| `clips[].points` | sprite AssetMeta clip (§6.2) | `{hand?, tip?, head?, centre?: ([x, y] \| null)[]}`, whole art px from the frame's top-left, inside the frame; 1 entry = same spot on all frames | `centre` / `head` derived from the opaque box; `hand` / `tip` fall back to `centre` | `clipPointsInvalid` (bad entry → `null`; other length mismatch padded with last / cut; a stored `foot` ignored: foot = AssetMeta `anchor`) |
| `skeleton.joints[].tag` | sprite recipe (§6.2.2) | `"hand"\|"tip"` | untagged | `jointTagDuplicate` (first wins). The bake writes tagged joints into the baked `clips[].points`; live procedural sprites derive them, never stored. Recipe `anims[].events` use the `clips[].events` shape; the bake copies them. Stored clip `events` / `points` on a procedural sprite: `styleParamIgnored` (kept) |
| `start_on` | effect knob (setup-format §2.10.3.1) | `"cast"\|"release"\|"contact"` | `"cast"` (today) | unknown option → `"cast"` + the existing unknown-option warning; a caster with no clip starts at `cast` silently |
| `anchor_point` | effect step | `"tile"\|"foot"\|"centre"\|"head"\|"hand"\|"tip"` | `"tile"` (today) | unknown option → `"tile"`; ignored with `anchor: "screen"` |
| `attach` / `detach` | effect step | `"spawn"\|"follow"` / `"end"\|"hit"` | `"spawn"` / `"end"` (today) | `detach` ignored silently on `spawn` |
| `draw_layer` | effect step (extends §2.10.1.3) | += `"behind-unit"\|"front-unit"` | `"air"` (unchanged) | plays as `"air"` with no anchor unit; old readers: unknown → `"air"` |
| `depth_by_facing` | effect step | toggle | `true` (only affects `"front-unit"`, which is new) | — |
| `lit` | effect step | `"self"\|"scene"` | **`"self"`** (today) | — |

## Rulings where DSK departs from the EA/UX list
1. **`lit` absent = `"self"`, not "from the stock picture".** A reader default taken from the picture would darken old smoke, dust and rock steps on moonlit stages, breaking "all absent = today". The editor writes the stock picture's default when it creates a step or changes its picture (rule N).
2. **No `points.foot`.** Foot is the AssetMeta `anchor` (one source of truth).
3. **A 1-entry `points` list means "same spot on all frames"**, so UX's option writes one value, not a copy per frame. Other length mismatches follow the `ms[]` pad / cut rule, with `clipPointsInvalid`.
4. **Events and points on procedural sprites live in the recipe** (joint tags, `anims[].events`). AssetMeta copies are ignored with `styleParamIgnored`, the same rule as `motion` (CN-012). **EA to confirm** that `anims[].events` is fine in `sprite-recipe` v1 (additive, optional, hashed).
5. **`null` / `[]` events = absent (derived),** matching the `ms` rule. There's no stored "no events" value.

## The 64 refusal (EA §10.1)
- One code, the existing **`fxTooManyFrames`** (r25), no new code. `readFxOrder` refuses the effect block when it has more than 64 steps or plays a picture strip with more than 64 frames. Detail: `{subject: "steps" | "strip", count, limit: 64, assetId?}`.
- Refused, **never truncated**; the effect plays as `"none"`; files kept untouched. The editor stops adding steps at 64 and won't pick a strip over 64 frames. Separate from `motionTooLarge` (CN-012) and the 12-step play cap.

## Not in the format (runtime only)
- `hitAt`, the emitted events (`clip:event{name}`, `fx:start` / `release` / `hit` / `end` / `loop`), the crossing rule, mirrored points (`x' = fw − 1 − x`), the bands and sort keys (EA §10.4), the moonlit sampling (EA §10.5), the pose grid. `keepInDim` and `fullyDark` stay runtime-only.

## Core-types candidates (CN only, not staged; wait until after H2, then a new CN through the EA, sha to QA)
- CN-E2 amend: unions `StartOn`, `AnchorPoint`, `FxDrawLayer` (+ `behind-unit` / `front-unit`), `FxLit`. None is needed in `61fad786` for step 33a.

## Readers
- The step 33a player reads these from the documents; the host loader picks up the clip fields with the host shell. QA: no core-types sha change, so no add-only check. Please check the reader against these docs (A1–A6, and the byte-identity guard A5 with every field absent).
