type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const PREFIX = "builtin:effect/";
export function fxBehaviour(cat: unknown): Obj | undefined {
  if (!isObj(cat)) return undefined;
  return list(cat["behaviours"]).find((row): row is Obj => isObj(row) && row["id"] === "effect");
}
export function builtinFx(slice: unknown, answer: unknown): { readonly id: string; readonly values: Obj } | undefined {
  if (typeof answer !== "string") return undefined;
  const id = answer.startsWith(PREFIX) ? answer.slice(PREFIX.length) : answer;
  const row = fxBehaviour(slice);
  if (row === undefined) return undefined;
  const preset = list(row["presets"]).find((item): item is Obj => isObj(item) && item["id"] === id);
  if (preset === undefined) return undefined;
  const values: Obj = {};
  for (const knob of list(row["knobs"]))
    if (isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default")) values[knob["id"]] = knob["default"];
  const over = preset["overrides"];
  if (isObj(over))
    for (const key of Object.keys(over)) values[key] = over[key];
  return { id, values };
}
