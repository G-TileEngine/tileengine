const DROP = new Set(["sources", "variants", "used_by", "conflicts", "needs_reverify", "default_source", "item_cites", "item_sources"]);

function copy(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(copy);
  if (typeof v !== "object" || v === null) return v;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(v)) { if (!DROP.has(key)) out[key] = copy((v as Record<string, unknown>)[key]); }
  return out;
}

export type CatalogueDoc = { readonly schema_version: number; readonly catalogue_rev: number; readonly gates: unknown; readonly behaviours: readonly Record<string, unknown>[] };

/** Pure slice: catalogue order, ids only, dropped info keys removed. `JSON.stringify(., null, 2) + "\\n"`. */
export function sliceOf(catalogue: CatalogueDoc, ids: readonly string[]): string {
  const want = new Set(ids);
  const behaviours = catalogue.behaviours.filter((b) => want.has(String(b["id"]))).map(copy);
  const slice = { kind: "catalogue-slice", formatVersion: 1, schema_version: catalogue.schema_version, catalogue_rev: catalogue.catalogue_rev, gates: catalogue.gates, behaviours };
  return `${JSON.stringify(slice, null, 2)}\n`;
}
