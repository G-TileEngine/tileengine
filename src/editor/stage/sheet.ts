type Obj = Record<string, unknown>;
export type SheetRow = { readonly group: "Ground" | "Terrain"; readonly id: string; readonly label: string };
const WIRED: readonly { readonly id: string; readonly group: "Ground" | "Terrain" }[] = [
  { id: "floor", group: "Ground" }, { id: "water", group: "Terrain" }, { id: "wall-block", group: "Terrain" },
];
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function typesOf(slice: Obj): Map<string, { readonly label: string; readonly open: boolean }> {
  const out = new Map<string, { readonly label: string; readonly open: boolean }>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") out.set(item["id"], { label: typeof item["label"] === "string" ? item["label"] : item["id"], open: item["open"] !== false });
  return out;
}
/** A type missing from the slice is not closed (unknown counts as Floor). */
export function closedType(slice: Obj, id: string): boolean { return typesOf(slice).get(id)?.open === false; }
export function typeLabel(slice: Obj, id: string): string { return typesOf(slice).get(id)?.label ?? id; }
/** Wired rows present in the slice. Occupied tiles hide closed types. */
export function sheetRows(slice: Obj, occupied: boolean): readonly SheetRow[] {
  const types = typesOf(slice), out: SheetRow[] = [];
  for (const row of WIRED) { const hit = types.get(row.id); if (hit === undefined || (occupied && !hit.open)) continue; out.push({ group: row.group, id: row.id, label: hit.label }); }
  return out;
}
