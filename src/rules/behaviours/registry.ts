import type { Notice } from "../../core/notice.ts";
import { isRecord } from "../../core/plain.ts";
import { GATE_DEFAULTS } from "./catalogue.ts";
import type { BehaviourDef, InstallCtx, Installed, KnobReader, KnobSpec, KnobUnsupported, Layer, Registry, Resolved, SetupIn, SetupLayers } from "./types.ts";

const ITEM_ID = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const ORDER = ["answers", "stage", "unit", "stageUnit"] as const;
const CODE: Record<(typeof ORDER)[number], Layer> = { answers: "L1", stage: "L2", unit: "L3", stageUnit: "L4" };
const note = (code: string, message: string): Notice => ({ code, message });
const hard = (behaviour: string, id: string, layer: Layer): Notice => note("invalidValue", `${behaviour}.${id} (${layer})`);
type Use = { use: true; value: unknown } | { use: false };
type Cell = { on: boolean; resolved: Resolved; notes: Notice[] };
export function createRegistry(defs: readonly BehaviourDef[]): Registry {
  const map = new Map<string, BehaviourDef>(), ids: string[] = [];
  for (const def of defs) {
    if (def.id === "" || map.has(def.id)) throw new RangeError(`createRegistry: ${def.id}`);
    const seen = new Set<string>();
    for (const knob of def.knobs) { if (knob.id === "" || seen.has(knob.id)) throw new RangeError(`createRegistry: ${def.id}.${knob.id}`); seen.add(knob.id); }
    map.set(def.id, def); ids.push(def.id);
  }
  return Object.freeze({ ids: Object.freeze(ids), get: (id: string) => map.get(id) });
}
const gateOn = (name: string, ctx?: InstallCtx): boolean => { const gates = ctx?.gates; return gates !== undefined && Object.hasOwn(gates, name) ? gates[name] === true : GATE_DEFAULTS[name] === true; };
function listCopy(spec: KnobSpec, value: unknown, behaviour: string, layer: Layer, notes: Notice[]): unknown[] | null {
  if (!Array.isArray(value)) return (notes.push(hard(behaviour, spec.id, layer)), null);
  const item = spec.item ?? {}, seen = new Set<string>(), out: Record<string, unknown>[] = [];
  for (const raw of value) {
    if (!isRecord(raw) || typeof raw.id !== "string" || !ITEM_ID.test(raw.id) || seen.has(raw.id) || typeof raw.label !== "string" || raw.label === "") return (notes.push(hard(behaviour, spec.id, layer)), null);
    seen.add(raw.id); const copy: Record<string, unknown> = {};
    for (const key of Object.keys(raw)) { if (key !== "id" && key !== "label" && !Object.hasOwn(item, key)) notes.push(note("unknownField", `${behaviour}.${spec.id} ${String(raw.id)}.${key}`)); if (Object.hasOwn(item, key) && typeof raw[key] !== "boolean") return (notes.push(hard(behaviour, spec.id, layer)), null); copy[key] = raw[key]; }
    if (raw.label.length > 48) notes.push(note("outOfRange", `${behaviour}.${spec.id} ${raw.id}.label`));
    for (const key of Object.keys(item)) if (!Object.hasOwn(copy, key)) copy[key] = item[key]; out.push(copy);
  }
  if (spec.reserved === true && Array.isArray(spec.default)) for (const raw of spec.default) if (isRecord(raw) && typeof raw.id === "string" && !seen.has(raw.id)) { notes.push(note("reservedMissing", `${behaviour}.${spec.id} ${raw.id}`)); seen.add(raw.id); out.push({ ...raw }); }
  return out;
}
function accept(spec: KnobSpec, value: unknown, behaviour: string, layer: Layer, notes: Notice[]): Use {
  const bad = (): Use => (notes.push(hard(behaviour, spec.id, layer)), { use: false });
  if (value === null) return spec.nullable === true ? { use: true, value } : bad();
  if (spec.type === "slider") { if (typeof value !== "number" || !Number.isFinite(value)) return bad(); const step = spec.step, min = spec.min ?? 0; if ((spec.min !== undefined && value < spec.min) || (spec.max !== undefined && value > spec.max)) notes.push(note("outOfRange", `${behaviour}.${spec.id}`)); else if (step !== undefined && step > 0 && Math.abs((value - min) / step - Math.round((value - min) / step)) > 1e-9) notes.push(note("offStep", `${behaviour}.${spec.id}`)); return { use: true, value }; }
  if (spec.type === "toggle") return typeof value === "boolean" ? { use: true, value } : bad();
  if (spec.type === "picker") return (spec.options ?? []).some((opt) => (isRecord(opt) && Object.hasOwn(opt, "value") ? opt.value : opt) === value) ? { use: true, value } : bad();
  const copied = listCopy(spec, value, behaviour, layer, notes); return copied === null ? { use: false } : { use: true, value: copied };
}
function readSlot(spec: KnobSpec, raw: unknown, layer: Layer, answer: boolean, behaviour: string, notes: Notice[]): Use {
  if (!isRecord(raw)) return (notes.push(hard(behaviour, spec.id, layer)), { use: false });
  const has = Object.hasOwn(raw, "value");
  if (answer && raw.source === "default") { if (has) notes.push(note("strayValue", `${behaviour}.${spec.id}`)); return { use: false }; }
  if (answer ? (raw.source !== "user" && raw.source !== "preset") || !has : !has) return (notes.push(hard(behaviour, spec.id, layer)), { use: false });
  return accept(spec, raw.value, behaviour, layer, notes);
}
export function resolveKnob(behaviour: string, s: KnobSpec, layers: SetupLayers, ctx?: InstallCtx): { resolved: Resolved; notes: Notice[] } {
  const notes: Notice[] = [], slots = s.perUnit === true ? (["stageUnit", "unit", "stage", "answers"] as const) : (["stage", "answers"] as const);
  let resolved: Resolved = { value: s.default, layer: "L0" };
  for (const name of slots) { const doc = layers[name]; if (!isRecord(doc) || !Object.hasOwn(doc, s.id)) continue; const got = readSlot(s, doc[s.id], CODE[name], name === "answers", behaviour, notes); if (got.use) { resolved = { value: got.value, layer: CODE[name] }; break; } }
  const hp = ctx?.difficulty;
  if (s.l5 === "hp" && hp !== undefined && Object.hasOwn(hp, "hp") && typeof resolved.value === "number") { if (typeof hp.hp !== "number" || !Number.isFinite(hp.hp) || !(hp.hp > 0)) notes.push(note("invalidValue", `difficulty.hp for ${behaviour}.${s.id}`)); else { const next = Math.max(1, Math.round(resolved.value * hp.hp)); if (Number.isFinite(next)) resolved = { value: next, layer: resolved.layer }; else notes.push(note("invalidValue", `${behaviour}.${s.id} (L5)`)); } }
  return { resolved, notes };
}
function entry(behaviour: string, knob: string, value: unknown, layer: KnobUnsupported["layer"], why: KnobUnsupported["why"], detail?: string): KnobUnsupported {
  const row = { code: "knobUnsupported" as const, behaviour, knob, value, layer, why }; return detail === undefined ? row : { ...row, detail };
}
const uNote = (row: KnobUnsupported): Notice => note("knobUnsupported", `${row.behaviour}.${row.knob}${row.detail === undefined ? "" : ` ${row.detail}`} (${row.why})`);
function finish<T>(row: Installed<T>): Installed<T> {
  return Object.freeze({ ...row, knobs: Object.freeze({ ...row.knobs }), unsupported: Object.freeze([...row.unsupported]), notes: Object.freeze([...row.notes]) });
}
export function installOne<T>(def: BehaviourDef<T>, layers: SetupLayers, ctx?: InstallCtx): Installed<T> {
  const byId = new Map(def.knobs.map((spec) => [spec.id, spec])), notes: Notice[] = [], clean: { -readonly [K in keyof SetupLayers]: SetupLayers[K] } = {};
  for (const name of ORDER) { const raw = layers[name]; if (raw === undefined || raw === null) continue; if (!isRecord(raw)) { notes.push(note("unknownKnob", `${def.id}.* (${name})`)); continue; } for (const key of Object.keys(raw)) { const spec = byId.get(key); if (spec === undefined) notes.push(note("unknownKnob", `${def.id}.${key} (${name})`)); else if ((name === "unit" || name === "stageUnit") && spec.perUnit !== true) notes.push(note("notPerUnit", `${def.id}.${key}`)); } clean[name] = raw; }
  const memo = new Map<string, Cell>(), stack: string[] = [];
  const cell = (spec: KnobSpec): Cell => {
    const hit = memo.get(spec.id); if (hit) return hit;
    if (stack.includes(spec.id)) return { on: false, resolved: { value: spec.default, layer: "L0" }, notes: [] };
    stack.push(spec.id); const when = spec.when; let on = when === undefined;
    if (when !== undefined && "gate" in when) on = gateOn(when.gate, ctx); else if (when !== undefined) { const other = byId.get(when.knob); on = other !== undefined && !stack.includes(other.id) && cell(other).on && cell(other).resolved.value === when.eq; }
    stack.pop(); const row: Cell = on ? { on: true, ...resolveKnob(def.id, spec, clean, ctx) } : { on: false, resolved: { value: spec.default, layer: "L0" }, notes: [] }; memo.set(spec.id, row); return row;
  };
  const knobs: Record<string, Resolved> = {};
  for (const spec of def.knobs) { const row = cell(spec); if (!row.on) continue; notes.push(...row.notes); knobs[spec.id] = row.resolved; }
  if (notes.some((item) => item.code === "invalidValue")) return finish<T>({ id: def.id, out: null, knobs, unsupported: [], notes, playable: false });
  const unsupported: KnobUnsupported[] = [], read = new Set<string>();
  const reader: KnobReader = {
    get(knob) { read.add(knob); const spec = byId.get(knob); if (spec === undefined) return undefined; const row = cell(spec); return row.on ? row.resolved.value : undefined; },
    unsupported(knob, detail) { read.add(knob); const spec = byId.get(knob), row = spec === undefined ? undefined : cell(spec), on = row?.on === true; unsupported.push(entry(def.id, knob, on && row !== undefined ? row.resolved.value : undefined, on && row !== undefined ? row.resolved.layer : null, "value", detail)); },
  };
  const out = def.install(reader);
  for (const spec of def.knobs) { const row = cell(spec); if (row.on && !read.has(spec.id)) unsupported.push(entry(def.id, spec.id, row.resolved.value, row.resolved.layer, "noCode")); }
  for (const row of unsupported) notes.push(uNote(row)); return finish({ id: def.id, out, knobs, unsupported, notes, playable: true });
}
function missing(setup: SetupIn): Installed {
  const id = setup.behaviourId, notes: Notice[] = [], unsupported: KnobUnsupported[] = [], answers = isRecord(setup.answers) ? setup.answers : undefined, keys = answers === undefined ? [] : Object.keys(answers);
  for (const name of ORDER) { const raw = setup[name]; if (isRecord(raw) && Object.keys(raw).length > 0) notes.push(note("unknownBehaviour", `${id} (${name})`)); }
  if (keys.length === 0 || answers === undefined) unsupported.push(entry(id, "*", undefined, null, "noBehaviour"));
  else for (const key of keys) { const raw = answers[key]; unsupported.push(entry(id, key, isRecord(raw) && Object.hasOwn(raw, "value") ? raw.value : undefined, null, "noBehaviour")); }
  for (const row of unsupported) notes.push(uNote(row)); return finish({ id, out: null, knobs: {}, unsupported, notes, playable: true });
}
export function installSetups(reg: Registry, setups: readonly SetupIn[], ctx?: InstallCtx): Map<string, Installed> {
  const got = new Map<string, Installed>();
  for (const setup of setups) { const id = setup.behaviourId, prev = got.get(id); if (prev !== undefined) got.set(id, finish({ ...prev, notes: [...prev.notes, note("duplicateSetup", id)] })); else { const def = reg.get(id); got.set(id, def === undefined ? missing(setup) : installOne(def, setup, ctx)); } }
  return got;
}
export const outOf = <T>(got: ReadonlyMap<string, Installed>, def: BehaviourDef<T>): T | null => (got.get(def.id)?.out ?? null) as T | null;
