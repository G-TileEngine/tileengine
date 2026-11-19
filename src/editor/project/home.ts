import { readProject, type ProjectFiles } from "../../project/load/index.ts";
export type DocText = Readonly<Record<string, string>>;
export type Row = { readonly id: string; readonly name: string; readonly updatedAt: string; readonly stages: number; readonly readOnly: boolean; readonly fixing: number; readonly error: string | null; readonly badge: string | null };
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const LIVE = "tileengine/projects/", TRASH = "tileengine/projects/.deleted/";
export const prefix = (id: string, trash = false): string => `${trash ? TRASH : LIVE}${id}/`;
export function ulid(now: number, bytes: Uint8Array): string {
  if (bytes.length !== 16) throw new Error("ulid: need 16 bytes");
  const t = Math.floor(now); let n = Number.isFinite(t) && t > 0 ? t : 0;
  const time = Array.from({ length: 10 }, () => { const c = B32[n % 32] ?? "0"; n = Math.floor(n / 32); return c; }).reverse().join("");
  return time + [...bytes].map((b) => B32[b % 32] ?? "0").join("");
}
export const projectId = (now: number, bytes: Uint8Array): string => `project_${ulid(now, bytes)}`;
export function checkName(raw: string): string | null { const name = raw.trim(), n = [...name].length; return n === 0 ? "Give your game a name" : n > 40 ? "Use 40 characters or fewer" : null; }
export function copyName(name: string, taken: readonly string[]): string { const base = `${name} copy`; if (!taken.includes(base)) return base; let i = 2; while (taken.includes(`${base} ${i}`)) i += 1; return `${base} ${i}`; }
function manifest(files: DocText): Record<string, unknown> { const raw = files["project.json"]; if (raw === undefined) throw new Error("missing project.json"); const doc = JSON.parse(raw) as unknown; if (!isObj(doc) || !isObj(doc["project"])) throw new Error("missing project.json"); return doc; }
export function stampNew(files: DocText, name: string, id: string, now: string): DocText { const err = checkName(name); if (err !== null) throw new Error(err); const doc = manifest(files), project = doc["project"] as Record<string, unknown>; project["id"] = id; project["name"] = name.trim(); project["rev"] = 1; project["createdAt"] = now; project["updatedAt"] = now; project["copiedFrom"] = null; return { ...files, "project.json": JSON.stringify(doc) }; }
export function renameTo(files: DocText, name: string): DocText { const err = checkName(name); if (err !== null) throw new Error(err); const doc = manifest(files); (doc["project"] as Record<string, unknown>)["name"] = name.trim(); return { ...files, "project.json": JSON.stringify(doc) }; }
export function duplicate(files: DocText, newId: string, now: string, taken: readonly string[]): DocText {
  const doc = manifest(files), project = doc["project"] as Record<string, unknown>;
  const prevName = typeof project["name"] === "string" ? project["name"] : "Project", prevId = typeof project["id"] === "string" ? project["id"] : "", prevRev = typeof project["rev"] === "number" ? project["rev"] : 0;
  project["id"] = newId; project["name"] = copyName(prevName, taken); project["copiedFrom"] = { projectId: prevId, rev: prevRev, at: now }; project["updatedAt"] = now;
  return { ...files, "project.json": JSON.stringify(doc) };
}
export function rowBlocked(id: string, message: string): Row { const error = message.startsWith("Can't open:") ? message : `Can't open: ${message}`; return { id, name: "Project", updatedAt: "", stages: 0, readOnly: false, fixing: 0, error, badge: null }; }
export function rowFrom(id: string, files: ProjectFiles): Row {
  const load = readProject(files), root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null, hard = load.report.filter((item) => item.severity === "hard").length;
  return { id, name: project !== null && typeof project["name"] === "string" ? project["name"] : "Project", updatedAt: project !== null && typeof project["updatedAt"] === "string" ? project["updatedAt"] : "", stages: project !== null && Array.isArray(project["stages"]) ? project["stages"].length : 0, readOnly: load.readOnly, fixing: load.readOnly ? 0 : hard, error: null, badge: load.readOnly ? "Newer version" : hard > 0 ? `Needs fixing (${hard})` : null };
}
export function sortRows(rows: readonly Row[]): readonly Row[] { return [...rows].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); }
export function subline(row: Row, nowMs: number): string {
  if (row.error !== null) return row.error;
  const then = Date.parse(row.updatedAt), sec = Number.isFinite(then) ? Math.max(0, Math.floor((nowMs - then) / 1000)) : -1;
  const ago = sec < 0 ? "unknown" : sec < 60 ? "just now" : sec < 3600 ? `${Math.floor(sec / 60)} min ago` : sec < 86400 ? `${Math.floor(sec / 3600)} h ago` : `${Math.floor(sec / 86400)} d ago`;
  return `Edited ${ago} · ${row.stages} ${row.stages === 1 ? "stage" : "stages"}`;
}
export function restorePlan(id: string, idTaken: boolean, files: DocText, newId: string, now: string, taken: readonly string[]): { readonly id: string; readonly files: DocText } { return idTaken ? { id: newId, files: duplicate(files, newId, now, taken) } : { id, files }; }
export function storedRev(files: ProjectFiles): number { const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null; return project !== null && typeof project["rev"] === "number" ? project["rev"] : 0; }
