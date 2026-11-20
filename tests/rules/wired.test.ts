import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readProject } from "../../src/project/load/index.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const opt = (item: unknown): string => typeof item === "string" ? item : isObj(item) && typeof item["value"] === "string" ? item["value"] : "";
test("wired list matches the play adapter", () => {
  const parsed = parseProject(walk("fixtures/demo.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const load = readProject(parsed.files), project = load.project; assert.equal(project !== null, true); if (project === null) return;
  const behaviours = project.slice["behaviours"]; if (!Array.isArray(behaviours)) return;
  const base = playDocsOf(project), setups = project.setups;
  for (const beh of behaviours) {
    if (!isObj(beh) || typeof beh["id"] !== "string" || !Object.hasOwn(WIRED, beh["id"]) || !Array.isArray(beh["knobs"])) continue;
    const id = beh["id"], wired = new Set(WIRED[id] ?? []), owned = Object.entries(setups).filter(([, setup]) => setup["behaviourId"] === id);
    assert.equal(owned.length, 1, id); const hit = owned[0]; if (hit === undefined) continue; const [sid, setup] = hit;
    for (const knob of beh["knobs"]) {
      if (!isObj(knob) || typeof knob["id"] !== "string") continue;
      const key = knob["id"], answers = isObj(setup["answers"]) ? structuredClone(setup["answers"]) as Obj : {}, row = answers[key], cur = isObj(row) && Object.hasOwn(row, "value") ? row["value"] : knob["default"];
      const picked = knob["type"] === "picker" && Array.isArray(knob["options"]) ? knob["options"].map(opt).find((item) => item !== "" && item !== cur) : undefined;
      const value = key === "reach_mode" ? "orth-only-1" : knob["type"] === "slider" ? (cur === knob["max"] ? knob["min"] : knob["max"]) : knob["type"] === "toggle" ? cur !== true : picked !== undefined ? picked : typeof cur === "string" ? `${cur} x` : "x";
      if (wired.has(key) && isObj(knob["active_when"]) && typeof knob["active_when"]["knob"] === "string") answers[knob["active_when"]["knob"]] = { source: "user", value: knob["active_when"]["eq"], rev: 1 };
      answers[key] = { source: "user", value, rev: 1 };
      const next = playDocsOf({ ...project, setups: { ...setups, [sid]: { ...setup, answers } } });
      if (wired.has(key)) assert.notDeepEqual(next, base, `${id}.${key}`); else assert.deepEqual(next, base, `${id}.${key}`);
      if (key === "reach_mode") { let owner = ""; for (const [unit, doc] of Object.entries(project.units)) if (isObj(doc) && Array.isArray(doc["setupIds"]) && doc["setupIds"].some((item: unknown) => item === sid)) owner = unit; assert.equal(next.rules.reach?.[owner], 1); }
    }
  }
});
