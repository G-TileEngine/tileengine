import { docToLiveFx, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import type { LiveFx } from "../../src/runtime/render/fx-live.ts";
import type { FxNote } from "../../src/runtime/render/fx-player.ts";
import type { Sheet } from "../../src/runtime/render/types.ts";
import type { SceneUnit } from "../../src/runtime/scene/world-scene.ts";
export const STRIP = { facings: ["S", "W", "N", "E"], zooms: [1, 2, 3], cols: 3, rows: 2, loopMs: 1600, caster: "me", target: "foe" } as const;
export type View = { readonly facing: number; readonly zoom: 1 | 2 | 3; readonly visible: boolean };
export const VIEW0: View = { facing: 0, zoom: 3, visible: true };
export const turn = (v: View): View => ({ ...v, facing: (v.facing + 1) % STRIP.facings.length });
export const zoom = (v: View, z: 1 | 2 | 3): View => ({ ...v, zoom: z });
export const seen = (v: View, visible: boolean): View => (v.visible === visible ? v : { ...v, visible });
const unit = (id: string, c: number, facing: SceneUnit["facing"]): SceneUnit => ({ id, sprite: "stand", at: { c, r: 0 }, offset: null, facing, alive: true });
export function preview(doc: FxDocValues, v: View, castMs: number, sheet: Sheet): { effects: LiveFx[]; units: SceneUnit[]; notes: FxNote[] } {
  const { fx, notes } = docToLiveFx(doc, { id: "preview", castMs, caster: STRIP.caster, target: STRIP.target, loopMs: STRIP.loopMs, sheetOf: () => sheet });
  return { effects: [fx], units: [unit(STRIP.caster, 0, STRIP.facings[v.facing] ?? "S"), unit(STRIP.target, STRIP.cols - 1, "W")], notes };
}
