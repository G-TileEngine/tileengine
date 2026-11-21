import raw from "./catalogue.json" with { type: "json" };
import type { CatalogueDoc } from "../project/slice-of.ts";
function asCatalogue(value: unknown): CatalogueDoc {
  if (typeof value !== "object" || value === null || !("behaviours" in value) || !("catalogue_rev" in value)) throw new Error("maker: catalogue");
  return value as CatalogueDoc;
}
export const BUNDLED: CatalogueDoc = asCatalogue(raw);
export function revCase(p: number, b: number): "same" | "older" | "newer" { return p === b ? "same" : p < b ? "older" : "newer"; }
