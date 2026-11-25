import { migrateProject } from "../../src/project/load/migrate.ts";
import type { ReportRow } from "../../src/project/load/types.ts";
import type { MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const hex = (buf: ArrayBuffer): string => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
function usedIds(project: Record<string, unknown>, files: Readonly<Record<string, unknown>>): Set<string> {
  const render = isObj(project["render"]) ? project["render"] : {}, excluded = new Set(Array.isArray(render["excludedStages"]) ? render["excludedStages"].filter((id): id is string => typeof id === "string") : []);
  const stages = new Set((Array.isArray(project["stages"]) ? project["stages"] : []).filter((id): id is string => typeof id === "string" && !excluded.has(id))), maps = new Set<string>(), used = new Set<string>();
  for (const doc of Object.values(files)) if (isObj(doc) && typeof doc["id"] === "string" && stages.has(doc["id"]) && typeof doc["mapRef"] === "string") maps.add(doc["mapRef"]);
  for (const doc of Object.values(files)) if (isObj(doc) && typeof doc["id"] === "string" && maps.has(doc["id"])) { const layers = isObj(doc["background"]) && Array.isArray(doc["background"]["layers"]) ? doc["background"]["layers"] : []; for (const layer of layers) if (isObj(layer) && typeof layer["assetId"] === "string") used.add(layer["assetId"]); }
  return used;
}
/** H4 at Test only. Hard when a selected stage's map names the asset, else a warning. The index entry is kept. */
export async function assetRows(store: MakerStore, folder: string, files: Readonly<Record<string, unknown>>): Promise<ReportRow[]> {
  let docs = files; try { docs = migrateProject(files).files; } catch { return [{ code: "invalidValue", severity: "hard", path: "project.json", detail: "unreadable" }]; }
  const root = docs["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, used = usedIds(project, docs), pre = folder.endsWith("/") ? folder : `${folder}/`, rows: ReportRow[] = [];
  for (const [id, meta] of Object.entries(assets)) {
    if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
    const path = `assets/${id}.${meta["ext"]}`, blob = await store.readBlob(`${pre}${path}`), severity: ReportRow["severity"] = used.has(id) ? "hard" : "warning";
    if (blob === null) { rows.push({ code: "assetFileMissing", severity, path, detail: id }); continue; }
    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    if (`asset_${hex(digest).slice(0, 16)}` !== id) rows.push({ code: "assetHashMismatch", severity, path, detail: id });
  }
  return rows;
}
