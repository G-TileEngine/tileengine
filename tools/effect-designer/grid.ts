import type { FxDocValues } from "../../src/runtime/render/fx-doc.ts";
export const INTENTS = ["slash", "shot", "burst", "aura", "heal", "buff", "ground"] as const;
export type Intent = (typeof INTENTS)[number];
export type Preset = { readonly id: string; readonly label: string; readonly doc: FxDocValues };
const KIND = { melee: "slash", ranged: "shot", area: "ground", heal: "heal", buff: "buff" } as const;
const rec = (v: unknown): Record<string, unknown> | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null);
export const intentFor = (kind: unknown): Intent | null => (typeof kind === "string" && Object.hasOwn(KIND, kind) ? KIND[kind as keyof typeof KIND] : null);
export const tagsOf = (doc: FxDocValues): string[] => (Array.isArray(doc["tags"]) ? doc["tags"] : []).slice(0, 4).flatMap((item) => { const id = rec(item)?.["id"]; return typeof id === "string" ? [id] : []; });
export const rampChips = (options: readonly string[], styleRamps: readonly string[]): string[] => { const have = new Set(styleRamps), out: string[] = []; for (const r of options) if (have.has(r) && !out.includes(r)) out.push(r); return out; };
export function recolour(doc: FxDocValues, ramp: string | null): FxDocValues {
  if (ramp === null) return doc;
  const steps = doc["steps"];
  return { ...doc, tint_ramp: ramp, ...(Array.isArray(steps) ? { steps: steps.map((s) => { const o = rec(s); return o !== null && Object.hasOwn(o, "tint_ramp") ? { ...o, tint_ramp: ramp } : s; }) } : {}) };
}
export const tiles = (presets: readonly Preset[], intent: Intent | null, ramp: string | null): Preset[] => presets.filter((p) => intent === null || tagsOf(p.doc).includes(intent)).map((p) => (ramp === null ? p : { ...p, doc: recolour(p.doc, ramp) }));
