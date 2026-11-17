import type { Notice } from "../../core/notice.ts";
import type { FxDocValues } from "../../runtime/render/fx-doc.ts";
import type { Row } from "./writer.ts";
export type PixelScale = number | "match-sprite" | null;
export type House = { readonly ramps: readonly string[]; readonly pixel_scale?: PixelScale; readonly punch: number; readonly motes: boolean };
export const HOUSE = { ramps: 4, punch: [{}, { hit_stop_ms: 50, hit_white_ms: 40, squash: true, shake: 0 }, { hit_stop_ms: 100, hit_white_ms: 40, squash: true, shake: 1 }, { hit_stop_ms: 150, hit_white_ms: 80, squash: true, shake: 2 }], motes: { kind: "particles", particle_motion: "rise", particle_count: 12, particle_life_ms: 800, particle_pull: 1000, picture: "ember", start_mode: "at-hit" } } as const;
const rec = (v: unknown): Row | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Row) : null);
const note = (code: string, message: string): Notice => ({ code, message });
export function readHouse(settings: unknown, styleRamps: readonly string[]): { house: House; notes: Notice[] } {
  const raw = rec(settings)?.["effectHouse"]; if (raw === undefined) return { house: { ramps: [], punch: 0, motes: false }, notes: [] };
  const o = rec(raw); if (o === null) return { house: { ramps: [], punch: 0, motes: false }, notes: [note("invalidValue", "effectHouse")] };
  const notes: Notice[] = []; let ramps: string[] = [];
  if ("ramps" in o) { const list = o["ramps"]; if (!Array.isArray(list) || list.some((x) => typeof x !== "string")) notes.push(note("invalidValue", "effectHouse.ramps")); else { if (list.length > HOUSE.ramps) notes.push(note("overCap", `effectHouse.ramps: ${list.length} of ${HOUSE.ramps}`)); ramps = list.filter((x): x is string => typeof x === "string").slice(0, HOUSE.ramps).filter((k) => styleRamps.includes(k)); } }
  let punch = 0; if ("punch" in o) { const p = o["punch"]; if (typeof p !== "number") notes.push(note("invalidValue", "effectHouse.punch")); else if (!Number.isInteger(p) || p < 0 || p > 3) notes.push(note("outOfRange", "effectHouse.punch")); else punch = p; }
  let motes = false; if ("motes" in o) { if (typeof o["motes"] !== "boolean") notes.push(note("invalidValue", "effectHouse.motes")); else motes = o["motes"] === true; }
  let pixel: PixelScale | undefined; if ("pixel_scale" in o) { const v = o["pixel_scale"]; if (v === null || v === "match-sprite") pixel = v; else if (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 6) pixel = v; else if (typeof v === "string" && /^[1-6]$/.test(v)) pixel = Number(v); else notes.push(note(typeof v === "number" || typeof v === "string" ? "outOfRange" : "invalidValue", "effectHouse.pixel_scale")); }
  return { house: { ramps, punch, motes, ...(pixel !== undefined ? { pixel_scale: pixel } : {}) }, notes };
}
export function blankDoc(house: House, mint: (prefix: string) => string): FxDocValues {
  const out: Row = { pixel_scale: house.pixel_scale !== undefined ? house.pixel_scale : "match-sprite" }, ramp = house.ramps[0], row = HOUSE.punch[house.punch] ?? {};
  if (ramp !== undefined) out["tint_ramp"] = ramp; Object.assign(out, row);
  if (house.motes === true) { const part = mint("p-"), id = mint("s-"); out["parts"] = [{ id: part, kind: "sparks", beats: ["linger"] }]; out["steps"] = [{ id, ...HOUSE.motes, ...(ramp !== undefined ? { tint_ramp: ramp } : {}), part }]; }
  return out;
}
export function addPart(doc: FxDocValues, part: { kind: string; beats: readonly string[]; label?: string }, steps: readonly Row[], house: House, mint: (prefix: string) => string): FxDocValues {
  const id = mint("p-"), ramp = house.ramps[0], made = steps.map((s) => { const next: Row = { ...s, id: mint("s-"), part: id }; if (ramp !== undefined && !("tint_ramp" in s)) next["tint_ramp"] = ramp; return next; });
  const out: Row = { ...doc, parts: [...(Array.isArray(doc["parts"]) ? doc["parts"] : []), { ...part, id }], steps: [...(Array.isArray(doc["steps"]) ? doc["steps"] : []), ...made] };
  if (part.kind === "punch") for (const [k, v] of Object.entries(HOUSE.punch[house.punch] ?? {})) if (!(k in doc)) out[k] = v;
  return out;
}
