import { versionRows } from "../../project/load/migrate.ts";
import type { ProjectFiles, ReportRow } from "../../project/load/types.ts";
export type DocText = Readonly<Record<string, string>>;
export type SavePlan = { readonly ok: true; readonly writes: readonly { readonly path: string; readonly text: string }[] } | { readonly ok: false; readonly error: "staleRev" | "readOnly" | "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly ReportRow[] };
const MSG = { staleRev: "This project changed somewhere else. Reopen it to see the latest.", readOnly: "Made with a newer TileEngine. Open only." } as const;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const DOC = /^(?:maps|stages|units|setups)\/[^/]+\.json$/;
const fail = (error: "staleRev" | "readOnly" | "writeFailed", path: string, message: string): SavePlan => ({ ok: false, error, path, message, rows: [{ code: error, severity: "hard", path, detail: message }] });
export function planSave(stored: DocText, next: DocText, expectedRev: number, now: string): SavePlan {
  const parsed: Record<string, unknown> = {};
  for (const [path, text] of Object.entries(stored)) { if (!path.endsWith(".json")) continue; try { parsed[path] = JSON.parse(text) as unknown; } catch { return fail("writeFailed", path, `Can't open: ${path} invalid JSON`); } }
  const root = parsed["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null, rev = project !== null && typeof project["rev"] === "number" ? project["rev"] : null;
  if (rev !== expectedRev) return fail("staleRev", "project.json", MSG.staleRev);
  if (versionRows(parsed as ProjectFiles).some((row) => row.code === "formatNewer")) return fail("readOnly", "project.json", MSG.readOnly);
  const changed = [...new Set([...Object.keys(stored), ...Object.keys(next)])].filter((path) => (stored[path] ?? null) !== (next[path] ?? null));
  if (changed.length === 0) return { ok: true, writes: [] };
  const render = (path: string, manifestDoc: boolean): string => {
    const text = (manifestDoc ? next[path] ?? stored[path] : next[path]) ?? "";
    if (!manifestDoc && !DOC.test(path) && path !== "catalogue/slice.json") return text;
    let doc: unknown; try { doc = JSON.parse(text) as unknown; } catch { throw new Error(path); }
    if (!isObj(doc)) throw new Error(path);
    if (manifestDoc && isObj(doc["project"])) { doc["project"]["rev"] = rev + 1; doc["project"]["updatedAt"] = now; } else { if (typeof doc["rev"] === "number") doc["rev"] += 1; doc["updatedAt"] = now; }
    return JSON.stringify(doc);
  };
  try {
    const writes = changed.filter((path) => path !== "project.json" && path !== "catalogue/slice.json").sort().map((path) => ({ path, text: render(path, false) }));
    if (changed.includes("catalogue/slice.json")) writes.push({ path: "catalogue/slice.json", text: render("catalogue/slice.json", false) });
    writes.push({ path: "project.json", text: render("project.json", true) });
    return { ok: true, writes };
  } catch (e) { const path = e instanceof Error ? e.message : "project.json"; return fail("writeFailed", path, `Couldn't save ${path}. Your phone may be full. Your last save is safe.`); }
}
export function asWrites(files: DocText): { readonly path: string; readonly text: string }[] {
  const writes = Object.entries(files).filter(([path]) => path !== "project.json").sort(([a], [b]) => (a < b ? -1 : 1)).map(([path, text]) => ({ path, text })), project = files["project.json"];
  if (project !== undefined) writes.push({ path: "project.json", text: project });
  return writes;
}
