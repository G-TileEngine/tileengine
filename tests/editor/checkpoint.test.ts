import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, stampNew } from "../../src/editor/project/home.ts";
import { planSave, asWrites } from "../../src/editor/project/save.ts";
import { setThreshold, turnOn } from "../../src/editor/rules/levels.ts";
import { setStageRule } from "../../src/editor/rules/rules.ts";
import { paintCells } from "../../src/editor/stage/paint.ts";
import { addEnemy, addSpawn } from "../../src/editor/stage/place.ts";
import { resizeMap } from "../../src/editor/stage/resize.ts";
import { addAbility } from "../../src/editor/unit/add.ts";
import { setTeam } from "../../src/editor/unit/team.ts";
import { newUnit, setStat } from "../../src/editor/unit/units.ts";
import { readProject } from "../../src/project/load/index.ts";
import { sliceOf } from "../../src/project/slice-of.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { BUNDLED } from "../../tools/maker/catalogue.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { commitWrites, memoryStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), NOW = "2026-11-22T00:00:00.000Z", PID = "project_01JSKIRM0000000000000000001";
const STAGE = "stage_01JDEM00000000000000000003", MAP = "maps/map_01JDEM00000000000000000002.json", STG = "stages/stage_01JDEM00000000000000000003.json";
const HERO = "unit_01JHERO0000000000000000001", RAIDER = "unit_01JRAID0000000000000000001";
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
type Sq = { readonly c: number; readonly r: number };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const json = (rel: string): Obj => { const doc = JSON.parse(readFileSync(join(root, rel), "utf8")) as unknown; if (!isObj(doc)) throw new Error(rel); return doc; };
const bagOf = (text: Record<string, string>): Record<string, Obj> => { const parsed = parseProject(text); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const wrote = <T extends { readonly mode: string; readonly bag?: Record<string, Obj> }>(got: T): Record<string, Obj> => { if (got.mode !== "wrote" || got.bag === undefined) throw new Error(got.mode); return got.bag; };
function built(): { readonly stamped: Record<string, string>; readonly next: Record<string, string>; readonly bag: Record<string, Obj> } {
  const stamped = stampNew(walk("data/templates/empty.tileproj"), "Skirmish", PID, NOW), bag0 = bagOf(stamped), stage0 = bag0[STG], map0 = bag0[MAP];
  if (!isObj(stage0) || !isObj(map0)) throw new Error("blank");
  const sized = resizeMap(MAP, map0, [{ path: STG, doc: stage0 }], 6, 6);
  let bag: Record<string, Obj> = { ...bag0, [MAP]: paintCells(sized.map, [0, 1, 2, 4, 5].map((c) => ({ c, r: 2 })), "wall-block") };
  for (const row of sized.stages) bag = { ...bag, [row.path]: row.doc };
  const unit = json("data/templates/unit.json"), ability = json("data/templates/setup.ability.json"), rule = json("data/templates/setup.rule.json");
  bag = { ...bag, [`units/${HERO}.json`]: setStat(setStat(newUnit(unit, HERO, "Hero"), "unit_hp", 20), "unit_atk", 5) };
  bag = setTeam(bag, HERO, true);
  const added = addAbility(bag, ability, HERO, "setup_01JLINE000000000000000001A", "line-shot", BUNDLED); if (added.mode !== "added") throw new Error(added.mode);
  bag = { ...added.bag, [`units/${RAIDER}.json`]: setStat(newUnit(unit, RAIDER, "Raider"), "unit_hp", 2) };
  const stage = bag[STG]; if (!isObj(stage)) throw new Error("stage");
  const foe = addEnemy(addSpawn(stage, { c: 0, r: 0 }), RAIDER, { c: 5, r: 5 }); if (foe === null) throw new Error("enemy");
  bag = { ...bag, [STG]: foe };
  const ruled = wrote(setStageRule(bag, rule, STAGE, "setup_01JWIN0000000000000000001A", "win-condition", "wipe_wins", true, BUNDLED));
  const turned = turnOn(ruled, rule, "setup_01JXP10000000000000000001A", BUNDLED); if (turned.mode !== "wrote" || turned.slice === "") throw new Error(turned.mode);
  const curved = wrote(setThreshold(turned.bag, 0, 1));
  const next: Record<string, string> = {}; for (const [path, doc] of Object.entries(curved)) next[path] = path === "catalogue/slice.json" ? turned.slice : JSON.stringify(doc);
  return { stamped, next, bag: curved };
}
const tick = (m: Match): void => { m.world.clock.advance(m.world.clock.stepMs); m.sync(); };
const key = (at: Sq): string => `${at.c},${at.r}`;
function stepOf(m: Match, from: Sq, foe: Sq): Sq {
  const prev = new Map<string, string>([[key(from), ""]]), q: Sq[] = [from];
  const open = (at: Sq): boolean => at.c >= 0 && at.r >= 0 && at.c < m.world.grid.cols && at.r < m.world.grid.rows && m.world.grid.isOpen(at) && m.world.units.occupantAt(at) === undefined;
  while (q.length > 0) {
    const at = q.shift(); if (at === undefined) break;
    if (inOrthogonalReach(at, foe, 3)) { let cur = key(at); while (prev.get(cur) !== key(from) && prev.get(cur) !== "") cur = prev.get(cur) ?? ""; const [c, r] = cur.split(","); return { c: Number(c), r: Number(r) }; }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) { const n = { c: at.c + dc, r: at.r + dr }; if (prev.has(key(n)) || !open(n)) continue; prev.set(key(n), key(at)); q.push(n); }
  }
  throw new Error("path");
}
function fight(m: Match, off: boolean): void {
  let leveled = false;
  const mine = (): string => { const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero"); return id; };
  const foeAt = (): Sq | null => { const u = m.world.units.all().find((u) => u.alive && u.side !== m.sides.me && u.side !== "neutral"); return u === undefined ? null : { c: u.at.c, r: u.at.r }; };
  if (foeAt() === null) throw new Error("foe");
  const shoot = (id: string, at: Sq): void => { if (m.world.phases.battle === "idle") m.intend({ type: "SelectUnit", unitId: id }); const no = m.choose("spell"); if (no !== null) throw new Error(no); m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); };
  for (let n = 0; n < 30 && m.outcome === null && foeAt() !== null; n += 1) {
    const id = mine(), foe = foeAt(); if (foe === null) break;
    const me = m.world.units.get(id); if (me === undefined) throw new Error("hero");
    if (inOrthogonalReach(me.at, foe, 3)) { shoot(id, foe); break; }
    const at = stepOf(m, me.at, foe); m.intend({ type: "SelectUnit", unitId: id }); m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); tick(m);
    if ((m.view().xp?.level ?? 0) >= 1) leveled = true;
    const moved = m.world.units.get(id), left = foeAt(); if (moved !== undefined && left !== null && inOrthogonalReach(moved.at, left, 3)) { shoot(id, left); break; }
    m.endTurn(); for (let i = 0; i < 12; i += 1) tick(m);
  }
  if (off) { assert.equal(foeAt(), null); assert.equal(m.outcome, null); m.endTurn(); assert.equal(m.outcome, null); return; }
  assert.equal(foeAt(), null); assert.equal(m.outcome, "win"); assert.equal(leveled, true); assert.ok(m.view().turns <= 30);
}
const d16 = (bag: Record<string, Obj>): boolean => {
  const slice = bag["catalogue/slice.json"], rows = isObj(slice) && Array.isArray(slice["behaviours"]) ? slice["behaviours"] : [];
  let seen = 0;
  for (const [path, doc] of Object.entries(bag)) {
    if (!path.startsWith("setups/")) continue;
    if (!isObj(doc) || !isObj(doc["answers"]) || typeof doc["behaviourId"] !== "string") return false;
    const hit = rows.find((row) => isObj(row) && row["id"] === doc["behaviourId"]); if (!isObj(hit) || !Array.isArray(hit["knobs"])) return false;
    const knobs = hit["knobs"].flatMap((knob) => isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default") && !(typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "") ? [knob["id"]] : []);
    const answers = doc["answers"]; if (knobs.length === 0 || Object.keys(answers).length !== knobs.length || knobs.some((id) => !Object.hasOwn(answers, id))) return false;
    for (const id of knobs) { const row = answers[id]; if (!(isObj(row) && (JSON.stringify(row) === "{\"source\":\"default\"}" || (row["source"] === "user" && row["rev"] === 1 && Object.hasOwn(row, "value") && Object.keys(row).length === 3)))) return false; }
    seen += 1;
  }
  return seen >= 4;
};
test("tactics checkpoint: Empty to a win", async () => {
  const { stamped, next } = built(), plan = planSave(stamped, next, 1, NOW); if (!plan.ok) throw new Error(plan.error + " " + plan.message + " " + plan.path);
  const store = memoryStore(); assert.equal((await commitWrites(store, prefix(PID), asWrites(stamped))).ok, true);
  let docs: Parameters<typeof createMatch>[0];
  const got = await launchTest({ store, id: PID, stored: stamped, next, rev: 1, from: "project", now: NOW, start(ready) { docs = ready; } });
  assert.equal(got.ok, true); if (docs === undefined) throw new Error("start");
  fight(createMatch(docs, 0), false);
});
test("checkpoint win comes from the rule", () => {
  const { bag } = built(), off = wrote(setStageRule(bag, json("data/templates/setup.rule.json"), STAGE, "setup_01JWIN0000000000000000001A", "win-condition", "wipe_wins", false, BUNDLED));
  const load = readProject(off); if (!load.ok || load.project === null) throw new Error("load");
  fight(createMatch(playDocsOf(load.project), 0), true);
});
test("checkpoint project loads clean", () => {
  const { next, bag } = built(), parsed = parseProject(next); if (!parsed.ok) throw new Error(parsed.path + " " + parsed.message);
  const load = readProject(parsed.files); assert.equal(load.ok, true); assert.deepEqual([...load.report], []);
  const slice = bag["catalogue/slice.json"], ids = isObj(slice) && Array.isArray(slice["behaviours"]) ? slice["behaviours"].flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []) : [];
  assert.equal(next["catalogue/slice.json"], sliceOf(BUNDLED, ids)); assert.equal(d16(bag), true);
  assert.deepEqual([...ids].sort(), ["line-shot", "terrain", "unit-roster", "win-condition", "xp-levels"].sort());
});
