type Obj = Record<string, unknown>;
export type KnobUse = { readonly id: string; readonly use: "user" | "default" };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function talkKnob(slice: Obj, id: string): Obj | null {
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "talk") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === id) return knob;
  return null;
}
export function talkLimit(slice: Obj): number | null { const knob = talkKnob(slice, "line"); const max = knob?.["max_len"]; return typeof max === "number" && Number.isInteger(max) && max >= 0 ? max : null; }
export function talkKnobs(slice: Obj): readonly KnobUse[] {
  const out: KnobUse[] = [];
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "talk") for (const knob of list(b["knobs"])) {
    if (!isObj(knob) || typeof knob["id"] !== "string") continue;
    const reason = Object.hasOwn(knob, "no_default_reason") ? knob["no_default_reason"] : undefined;
    if (typeof reason === "string" && reason !== "") continue;
    if (knob["id"] === "line") { out.push({ id: "line", use: "user" }); continue; }
    if (Object.hasOwn(knob, "default")) out.push({ id: knob["id"], use: "default" });
  }
  return out;
}
export function fillTalk(skeleton: Obj, id: string, unitName: string, rev: number, line: string, knobs: readonly KnobUse[]): Obj {
  const next = structuredClone(skeleton) as Obj, catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {}, answers: Obj = {};
  next["id"] = id; next["name"] = `${unitName} talk`; catalogue["rev"] = rev; next["catalogue"] = catalogue;
  for (const knob of knobs) answers[knob.id] = knob.use === "user" ? { source: "user", value: line } : { source: "default" };
  next["answers"] = answers; return next;
}
