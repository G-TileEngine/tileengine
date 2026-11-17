// Host guide: three scripted ability cues (stock, a saved effect, a missing ref). src never imports this.
// Run: node tools/host-example/match-fx.ts
import type { Action } from "../../src/core/log/types.ts";
import { readEffect } from "../../src/project/read/effect.ts";
import { createCastFx, cueFromEntry, type EffectValues } from "../../src/runtime/scene/cast-fx.ts";
import { sceneFromMatch, type MatchArt } from "../../src/runtime/scene/match-link.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";

const sheet = { id: "fx", columns: 4, fw: 16, fh: 16 };
const steps = [{ kind: "stamp", seconds: 0.3 }];
const saved = readEffect({ kind: "behaviour-setup", formatVersion: 3, id: "setup_01J0EFFECT0000000000000000", rev: 1, behaviourId: "effect", answers: { steps: { source: "user", value: steps } } });
if (!saved.ok) throw new Error("saved effect");
const stockValues: Record<string, unknown> = { steps };
const rows: Record<string, EffectValues> = { stock: { rev: 1, values: stockValues }, saved: { rev: saved.doc.rev, values: saved.doc.values } };
const values = (ref: string): EffectValues | null => (Object.hasOwn(rows, ref) ? rows[ref] ?? null : null);
const refOf = (action: Action): string | undefined => (action.effects.length === 1 ? action.effects[0] : undefined);
const act = (ref: string): Action => ({ id: "a", kind: "ability", actor: "k1", target: { pipe: "unit", unitId: "w1", fallbackAt: { c: 1, r: 1 } }, durationMs: null, turns: null, effects: [ref] });
const refs = ["stock", "saved", "missing"] as const;
const cues = refs.map((ref, i) => cueFromEntry({ seq: i + 1, tick: 0, action: act(ref) }, 10, refOf));
const fx = createCastFx({ sheetOf: () => sheet, values });
let n = 0;
for (const cue of cues) if (cue !== null) { fx.cast(cue); n += 1; }
const live = fx.effects(50).length;
const art: MatchArt = { cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, assets: { fx: { sheet } }, layers: [{ tileset: null, aboveUnits: false, visible: true, tiles: Array.from({ length: 16 }, () => 0) }], sprites: {} };
const link = createSceneLink();
link.scene({ ...sceneFromMatch({ units: [] }, art).world, effects: fx.effects(280) }, { tMs: 280, stepMs: 10 });
const hits = link.fired.filter((event) => event.type === "fx:hit").length;
const line = `match-fx: ${n} cues, ${live} live at 50ms, ${hits} hits, notes: ${fx.notes.map((item) => `${item.code} ${item.message}`).join(", ")}`;

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(line);
  if (line !== "match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing") process.exit(1);
}
