type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type PanelRole = "card" | "row" | "off";
export type PanelOpt = string | { readonly value: string; readonly label: string };
export type PanelKnob = { readonly id: string; readonly label: string; readonly type: string; readonly value: unknown; readonly def: unknown; readonly min?: number; readonly max?: number; readonly step?: number; readonly max_len?: number; readonly options?: readonly PanelOpt[]; readonly builtin?: readonly string[] };
export type PanelSection = { readonly question: string; readonly knobs: readonly PanelKnob[]; readonly open: boolean };
export type PanelModel = { readonly role: PanelRole; readonly name: string; readonly sections: readonly PanelSection[] };
export const aimKind = (id: string): "basic" | "spell" | undefined => id === "basic-attack" ? "basic" : id === "line-shot" ? "spell" : undefined;
export const badge = (unit: Obj): number => list(unit["setupIds"]).filter((id) => typeof id === "string").length;
export const detach = (unit: Obj, setupId: string): Obj => ({ ...unit, setupIds: list(unit["setupIds"]).filter((id) => id !== setupId) });
export const setAnswer = (answers: Obj, id: string, value: unknown, def: unknown): Obj => ({ ...answers, [id]: Object.is(value, def) ? { source: "default" } : { source: "user", value, rev: 1 } });
export const resetAnswer = (answers: Obj, id: string): Obj => ({ ...answers, [id]: { source: "default" } });
const readValue = (answers: Obj, id: string, fallback: unknown): unknown => { const row = answers[id]; return isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value") ? row["value"] : fallback; };
function knobOf(knob: Obj, answers: Obj): PanelKnob | null {
  if (typeof knob["id"] !== "string" || typeof knob["label"] !== "string" || typeof knob["type"] !== "string") return null;
  const options: PanelOpt[] = [];
  if (Array.isArray(knob["options"])) for (const item of knob["options"]) { if (typeof item === "string") options.push(item); else if (isObj(item) && typeof item["value"] === "string" && typeof item["label"] === "string") options.push({ value: item["value"], label: item["label"] }); }
  const ref = knob["ref"], built = isObj(ref) && Array.isArray(ref["builtin"]) ? ref["builtin"].filter((item): item is string => typeof item === "string") : undefined;
  return { id: knob["id"], label: knob["label"], type: knob["type"], value: readValue(answers, knob["id"], knob["default"]), def: knob["default"], ...(typeof knob["min"] === "number" ? { min: knob["min"] } : {}), ...(typeof knob["max"] === "number" ? { max: knob["max"] } : {}), ...(typeof knob["step"] === "number" ? { step: knob["step"] } : {}), ...(typeof knob["max_len"] === "number" ? { max_len: knob["max_len"] } : {}), ...(Array.isArray(knob["options"]) ? { options } : {}), ...(built === undefined ? {} : { builtin: built }) };
}
export function panelOf(slice: Obj, wired: Readonly<Record<string, readonly string[]>>, behaviourId: string, answers: Obj): PanelModel {
  const hit = list(slice["behaviours"]).find((row) => isObj(row) && row["id"] === behaviourId), row = isObj(hit) ? hit : null;
  if (row === null) return { role: "off", name: behaviourId, sections: [] };
  const allow = new Set(wired[behaviourId] ?? []), byId = new Map<string, Obj>();
  for (const knob of list(row["knobs"])) if (isObj(knob) && typeof knob["id"] === "string") byId.set(knob["id"], knob);
  const sections: PanelSection[] = [];
  for (const block of list(row["menu_order"])) {
    if (!isObj(block) || typeof block["question"] !== "string") continue;
    const knobs: PanelKnob[] = [];
    for (const key of list(block["knob_ids"])) {
      if (typeof key !== "string" || !allow.has(key)) continue;
      const spec = byId.get(key); if (spec === undefined || (list(spec["depends_on"]).length > 0 && !(isObj(spec["active_when"]) && typeof spec["active_when"]["knob"] === "string" && readValue(answers, spec["active_when"]["knob"], byId.get(spec["active_when"]["knob"])?.["default"]) === spec["active_when"]["eq"]))) continue;
      const view = knobOf(spec, answers); if (view !== null) knobs.push(view);
    }
    if (knobs.length > 0) sections.push({ question: block["question"], knobs, open: sections.length === 0 });
  }
  const comp = list(row["composable_as"]), role: PanelRole = comp.includes("primary") ? "card" : comp.includes("rider") || comp.includes("scaler") || comp.includes("trigger") ? "row" : "off";
  return { role, name: typeof row["name"] === "string" ? row["name"] : behaviourId, sections };
}
export function stageFor(files: Readonly<Record<string, unknown>>, unitId: string): string | null {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear0 = isObj(project["loadout"]) ? project["loadout"] : {};
  for (const id of list(project["stages"])) {
    if (typeof id !== "string") continue;
    let stage: Obj | null = null;
    for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === id) stage = doc;
    if (stage === null) continue;
    const gear = isObj(stage["loadout"]) ? stage["loadout"] : gear0;
    if ([...list(gear["required"]), ...list(gear["roster"])].includes(unitId)) return id;
    if (list(stage["neutrals"]).some((n) => isObj(n) && n["unitId"] === unitId)) return id;
    const pool = stage["enemyPool"]; if (isObj(pool) && list(pool["entries"]).some((entry) => isObj(entry) && entry["unitId"] === unitId)) return id;
  }
  return null;
}
