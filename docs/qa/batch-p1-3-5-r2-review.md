# QA review: P1-3/4/5 r2 + combined docs list (LEAN)
QA & Build Guard, 2026-11-17 (Europe/London, GMT). Gates run one at a time after a clear `pgrep`. Nothing pushed; GitHub and Drive were read-only. This is a new file (the r1 review is not edited).

## Verdicts
- **P1-3 r2 (`8d1acc02`, tree `0a260759`): OK TO SEND.** 419 lines (cap 420). Gates **917/0 PASS** (floor 917, main `75df4642`), law PASS, stress SAME.
- **P1-4 r2 (`bb975418`, tree `9471c462`): OK TO SEND.** 365 lines. Gates **928/0 PASS**, law PASS, stress SAME.
- **P1-5 r2 (`2db004f6`, tree `9191701c`): OK TO SEND.** 313 lines. Gates **937/0 PASS**, law PASS, stress SAME.
- **Combined list: OK TO SEND.** `/workspace/share/p1-3-5-e7-r2/push-sha256.txt` sha256 `5c1a120b6b1ed85c0c375a27f51b738622d93b8da708a6801be0d1c2b896dda1`, 35/35, every file in `scratch-ea/p1-batch-push-src` matches. Trial apply on `75df4642` (`/tmp/p1-trial`) is docs/handoff only (no repo `src/` or `tests/`) and stays **904/0**.

## Pins and should-fixes
Pin tests are byte-identical in each later stack and in the list (EA blobs): P1-3 `f4c554d4` (`tests/rules/battle-qa-p13.test.ts`, git `03c3286d`, ref `9c05e03f`), P1-4 `5f5043c4` (`battle-qa-p14.test.ts`, git `bbd40e21`, ref `679dc1e4`), P1-5 `2c04c0a3` (`bot-qa-p15.test.ts`, git `fe5748cf`, ref `057a2853`). The r2 should-fixes are present: `reachOf`, the line-shot abilities lookup, `shotRow`, and `setup.stats`/`ownStat` all use `Object.hasOwn`. No remaining plain `[id]` / `?.[id]` lookups keyed by unit id in the P1-3..5 src diffs. Probes of `constructor` / `__proto__` on reach and line-shot take the defaults and do not throw.

## P1-3 constructor fixture (KEY)
The merged pin `tests/rules/battle-qa-build.test.ts` (list sha256 `9d367f32`) now places the units as foes one tile apart (`player`/`wolves`, `{c:0,r:0}` / `{c:1,r:0}`). That is the documented P1-3 `allyTarget` rule (same-side refused even when out of reach; the old same-cell same-side fixture would refuse, and the same tile is not in reach). It is not a weakening: the own-key assertion remains (constructor base 9/1, wolf 2→1). Plant `cfg.stats[id] ?? cfg.base` in `battle.ts` `of()`: the test **fails** (constructor dropped from state; wolf hp 0, not 1).

## Docs and list
Each step doc has the §0.6 HANDBACK helpers paragraph (`HANDBACK.md` must include `§ Helpers & self-review` or the hand-back is REJECT). Bundles match: P1-3 `9067a56c`, P1-4 `c407eb99`, P1-5 `64453e9d`. The list holds the eight E7 prefixes (`5b0fcb6c`, `08f2ef8c`, `d99cebbd`, `31a4d5b7`, `1571a811`, `c251876c`, `922ffb26`, review `c5502f3c`), batch review `0b2682f6`, the P1 r2 docs/pastes (`0cfb566d`, `a4b22ab6`, `c5947b0d`, `a6bd5305`, `697e35ef`, `b50e13b2`), P1-2 walk `c26bf4f1`, and STATUS `12ce54cf`. The two QA docs in the list are byte-identical to `/workspace/tileengine/docs/qa`.

No must-fixes. No pin.
