import { fxBehaviour } from "../../project/builtin-fx.ts";
import { sliceDoc, type CatalogueDoc } from "../../project/slice-of.ts";
import { addCase } from "../unit/add.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export function builtinRows(bag: Record<string, Obj>, bundled: CatalogueDoc, behaviourId: string): readonly { readonly id: string; readonly name: string }[] {
  const slice = bag["catalogue/slice.json"];
  if (!isObj(slice)) return [];
  const owner = list(slice["behaviours"]).find((row): row is Obj => isObj(row) && row["id"] === behaviourId);
  const knob = owner === undefined ? undefined : list(owner["knobs"]).find((item): item is Obj => isObj(item) && item["id"] === "effect");
  const ref = knob !== undefined && isObj(knob["ref"]) ? knob["ref"]["builtin"] : undefined;
  const live = fxBehaviour(slice);
  const source = live !== undefined ? live : addCase(bag, bundled).mode === "same" ? fxBehaviour(bundled) : undefined;
  if (source === undefined) return [];
  const name = new Map(list(source["presets"]).flatMap((item): [string, string][] => (isObj(item) && typeof item["id"] === "string" ? [[item["id"], typeof item["display_name"] === "string" ? item["display_name"] : item["id"]]] : [])));
  const out: { id: string; name: string }[] = [];
  for (const id of list(ref))
    if (typeof id === "string" && name.has(id)) out.push({ id, name: name.get(id) ?? id });
  return out;
}
export function isBuiltin(answer: string, id: string): boolean {
  return answer === id || answer === `builtin:effect/${id}`;
}
export function withFx(bag: Record<string, Obj>, bundled: CatalogueDoc): Record<string, Obj> | null {
  const slice = bag["catalogue/slice.json"];
  if (!isObj(slice)) return null;
  if (fxBehaviour(slice) !== undefined) return bag;
  if (addCase(bag, bundled).mode !== "same") return null;
  const ids = list(slice["behaviours"]).flatMap((row) => (isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []));
  const sliced = sliceDoc(bundled, [...ids, "effect"]);
  if (!isObj(sliced)) return null;
  return { ...bag, "catalogue/slice.json": sliced };
}
