import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { DEMO_LOOKS } from "../../tools/play-stage/looks.ts";
export const U = { knight: "unit_01JDAN00000000000000000001", archer: "unit_01JDAN00000000000000000002", cleric: "unit_01JDAN00000000000000000003", wolf: "unit_01JDAN00000000000000000004", villager: "unit_01JDAN00000000000000000005", crate: "unit_01JDAN00000000000000000006", merchant: "unit_01JDAN00000000000000000007" } as const;
const ROOT = fileURLToPath(new URL("../../fixtures/demo.tileproj/", import.meta.url));
export function loadFixture(): ProjectFiles {
  const files: Record<string, unknown> = {}, walk = (at: string, rel: string): void => { for (const name of readdirSync(at)) { const p = join(at, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(p).isDirectory()) walk(p, next); else files[next] = JSON.parse(readFileSync(p, "utf8")) as unknown; } };
  walk(ROOT, ""); return files;
}
export function demoDocs() {
  const load = readProject(loadFixture());
  if (!load.ok || load.readOnly || load.project === null) throw new Error(load.report.map((r) => `${r.code} ${r.path}`).join("\n"));
  return { ...playDocsOf(load.project), looks: DEMO_LOOKS };
}
