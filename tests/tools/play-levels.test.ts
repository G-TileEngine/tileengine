import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { Action } from "../../src/core/log/index.ts";
import { setLevels, setThreshold, setXpMove, turnOff, turnOn } from "../../src/editor/rules/levels.ts";
import { readProject } from "../../src/project/load/index.ts";
import { submit } from "../../src/sim/actions.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { bundledDocs, playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), ID = "setup_01JXP00000000000000000001A", DEF = [17, 11, 13, 11, 13, 14, 11, 11, 11];
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const bagOf = (): Record<string, Obj> => { const parsed = parseProject(walk("fixtures/demo.tileproj")); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.rule.json"), "utf8")) as unknown; if (!isObj(doc)) throw new Error("skel"); return doc; };
const played = (files: Record<string, Obj>) => { const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.detail ?? row.code).join(" ")); return playDocsOf(load.project); };
const wrote = <T extends { readonly mode: string; readonly bag?: Record<string, Obj> }>(got: T): Record<string, Obj> => { if (got.mode !== "wrote" || got.bag === undefined) throw new Error(got.mode); return got.bag; };
const on = (): Record<string, Obj> => wrote(turnOn(bagOf(), skel(), ID, BUNDLED));
const level = (m: Match): number => m.world.levels?.state().bars.find((bar) => bar.id === m.sides.me)?.level ?? -1;
function hop(m: Match, n: number): void {
  const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id, home = id === undefined ? undefined : m.world.units.get(id); if (id === undefined || home === undefined) throw new Error("me");
  let away: { c: number; r: number } | undefined;
  for (let r = 0; r < m.world.grid.rows && away === undefined; r += 1) for (let c = 0; c < m.world.grid.cols; c += 1) if ((c !== home.at.c || r !== home.at.r) && m.world.grid.isOpen({ c, r }) && !m.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r)) away = { c, r };
  if (away === undefined) throw new Error("cell");
  const a = { c: home.at.c, r: home.at.r };
  for (let i = 0; i < n; i += 1) { const action: Action = { id: `m${m.world.log.lastSeq()}-${i}`, kind: "move", actor: id, target: { pipe: "tile", at: i % 2 === 0 ? away : a }, durationMs: null, turns: null, effects: [] }; submit(m.world, action); }
}
test("levels reach Test", () => {
  assert.equal(played(bagOf()).levels, undefined);
  const docs = played(on()); assert.deepEqual(docs.levels?.rules.thresholds, DEF); assert.equal(docs.levels?.rules.xp.move, 1); assert.equal(docs.levels?.rules.bar, "side");
  assert.deepEqual(played(wrote(setLevels(on(), 3))).levels?.rules.thresholds, [17, 11, 13]);
  assert.equal(played(wrote(turnOff(on()))).levels, undefined);
});
test("a move pays XP in Test", () => {
  const m = createMatch(played(wrote(setThreshold(on(), 0, 2))), 20);
  assert.deepEqual(m.view().xp, { level: 0, now: 0, need: 2, top: false }); hop(m, 2); assert.equal(level(m), 1); assert.deepEqual(m.view().xp, { level: 1, now: 0, need: 11, top: false });
});
test("custom curve plays in Test", () => {
  let bag = wrote(setLevels(on(), 3)); for (const i of [0, 1, 2]) bag = wrote(setThreshold(bag, i, 5)); bag = wrote(setXpMove(bag, 1));
  const docs = played(bag); assert.deepEqual(docs.levels?.rules.thresholds, [5, 5, 5]); assert.equal(docs.levels?.rules.xp.move, 1);
  const m = createMatch(docs, 20); hop(m, 5); assert.equal(level(m), 1); hop(m, 5); assert.equal(level(m), 2);
});
test("no levels, no strip", () => { const m = createMatch(bundledDocs(), 20); assert.equal(m.view().xp, null); assert.equal(m.world.levels, null); });
