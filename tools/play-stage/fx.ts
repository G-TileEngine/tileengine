import type { Action } from "../../src/core/log/types.ts";
import { readEffect } from "../../src/project/read/index.ts";
import type { FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import { createCastFx, cueFromEntry, type CastCue, type EffectValues } from "../../src/runtime/scene/cast-fx.ts";
import { TILE } from "./load.ts";

export const HOUSE_ATTACK = "house:basic-attack";
export const HOUSE_DOC: FxDocValues = { hit_stop_ms: 80, shake: 2, squash: true, hit_white_ms: 90, steps: [{ kind: "stamp", seconds: 0.25 }] };
export const LINE_SHOT_DOC: FxDocValues = { connect_step: "fly", shake: 1, hit_white_ms: 60, tint_ramp: "fire", steps: [{ id: "fly", kind: "swerve", seconds: 0.2, bend: 1, outline: "on", light: "steady", light_radius: 2 }, { kind: "stamp", start_mode: "at-hit", seconds: 0.15, blend: "add", light: "pop", light_radius: 3 }, { kind: "particles", start_mode: "with-last", seconds: 0.3, particle_count: 12, particle_life_ms: 300 }] };
export const FX_CLIP = { name: "spark", frames: [0, 1, 2, 3], ms: [60, 60, 60, 60] };
const FX_SHEET = { id: "play:fx", columns: 4, fw: TILE, fh: TILE };
/** Exactly one effect ref. Empty or several effects stay undefined; the host supplies the house default. */
export const refOf = (action: Action): string | undefined => (action.effects.length === 1 ? action.effects[0] : undefined);
const stock = new Map<string, EffectValues>([[HOUSE_ATTACK, { rev: 1, values: HOUSE_DOC }], ["line-shot", { rev: 1, values: LINE_SHOT_DOC }]]);

export function fxPx(id: string): Pixels | undefined {
  if (id !== FX_SHEET.id) return undefined;
  const data = new Uint8ClampedArray(TILE * 4 * TILE * 4);
  for (let f = 0; f < 4; f += 1) {
    const rad = 3 + f;
    for (let y = 0; y < TILE; y += 1) for (let x = 0; x < TILE; x += 1) {
      const dx = x - TILE / 2, dy = y - TILE / 2;
      if (dx * dx + dy * dy > rad * rad) continue;
      const o = (y * TILE * 4 + f * TILE + x) * 4;
      data[o] = 246; data[o + 1] = 192; data[o + 2] = 74; data[o + 3] = 255;
    }
  }
  return { w: TILE * 4, h: TILE, data };
}

const houseCue = (entry: { seq: number; tick: number; action: Action }, stepMs: number): CastCue | null => {
  const action = entry.action;
  if (action.kind !== "ability" || action.effects.length !== 0) return null;
  const aim = action.target, target = aim !== null && aim.pipe === "unit" ? aim.unitId : undefined;
  return { id: `cast:${entry.seq}`, atMs: entry.tick * stepMs, caster: action.actor, ref: HOUSE_ATTACK, ...(target === undefined ? {} : { target }) };
};

export function createPlayFx(docs?: readonly unknown[]) {
  const table = new Map(stock);
  for (const doc of docs ?? []) { const read = readEffect(doc); if (read.ok) table.set(read.doc.id, { rev: read.doc.rev, values: read.doc.values }); }
  const engine = createCastFx({ sheetOf: () => FX_SHEET, clipOf: () => FX_CLIP, values: (ref) => table.get(ref) ?? null });
  return {
    engine,
    values: (ref: string) => table.get(ref) ?? null,
    ingest(log: { entries(): readonly { seq: number; tick: number; action: Action }[] }, stepMs: number, now: number) {
      for (const entry of log.entries()) { const cue = cueFromEntry(entry, stepMs, refOf) ?? houseCue(entry, stepMs); if (cue !== null) engine.cast(cue); }
      return engine.effects(now);
    },
  };
}
