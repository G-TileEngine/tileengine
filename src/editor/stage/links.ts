import type { LinkType } from "../../types/core-types.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const onCell = (link: unknown, c: number, r: number): boolean => isObj(link) && isObj(link["at"]) && link["at"]["c"] === c && link["at"]["r"] === r;
export function linkOn(stage: Obj, c: number, r: number): Obj | null { const hit = list(stage["links"]).find((link) => onCell(link, c, r)); return isObj(hit) ? clone(hit) : null; }
export function addLink(stage: Obj, type: LinkType, c: number, r: number, to: string): Obj | null {
  if (to === stage["id"]) return null; const next = clone(stage); next["links"] = [...list(stage["links"]).filter((link) => !onCell(link, c, r)), { type, at: { c, r }, to }]; return next;
}
export function removeLink(stage: Obj, c: number, r: number): Obj { const next = clone(stage); next["links"] = list(stage["links"]).filter((link) => !onCell(link, c, r)); return next; }
export function setAutosave(stage: Obj, c: number, r: number, on: boolean): Obj { const next = clone(stage); next["links"] = list(stage["links"]).map((link) => { if (!isObj(link) || !onCell(link, c, r)) return link; const copy: Obj = { ...link }; if (on) copy["autosave"] = true; else delete copy["autosave"]; return copy; }); return next; }
export function linksTo(files: Record<string, Obj>, id: string): readonly string[] {
  const root = files["project.json"], proj = isObj(root) && isObj(root["project"]) ? root["project"] : {}, live = list(proj["stages"]);
  return Object.entries(files).flatMap(([path, doc]) => !path.startsWith("stages/") || !isObj(doc) || typeof doc["id"] !== "string" || doc["id"] === id || !live.includes(doc["id"]) ? [] : list(doc["links"]).some((link) => isObj(link) && link["to"] === id) ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : []);
}
