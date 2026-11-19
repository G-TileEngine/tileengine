import type { ProjectFiles } from "../../src/project/load/types.ts";
export type Unreadable = { readonly ok: false; readonly error: "unreadable"; readonly path: string; readonly message: string };
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export function parseProject(files: Readonly<Record<string, string>>): { readonly ok: true; readonly files: ProjectFiles } | Unreadable {
  const out: Record<string, unknown> = {};
  for (const [path, text] of Object.entries(files)) {
    if (!path.endsWith(".json")) { out[path] = text; continue; }
    try { const doc = JSON.parse(text) as unknown; if (!isObj(doc)) return { ok: false, error: "unreadable", path, message: `Can't open: ${path} is not a JSON object` }; out[path] = doc; }
    catch (e) { return { ok: false, error: "unreadable", path, message: `Can't open: ${path} ${e instanceof SyntaxError ? e.message : "invalid JSON"}` }; }
  }
  return { ok: true, files: out };
}
