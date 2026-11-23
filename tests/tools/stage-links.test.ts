import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { addLink, removeLink } from "../../src/editor/stage/links.ts";
import { addStage, deleteStage, docsIn } from "../../src/editor/stage/rooms.ts";
import { resizeMap } from "../../src/editor/stage/resize.ts";
import { readProject } from "../../src/project/load/index.ts";
import { readStage } from "../../src/project/read/stage.ts";
import { arrival, type LinkEvent } from "../../src/rules/session/links.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { arriveIn, playDocsOf, type PlayOut } from "../../tools/play-stage/project.ts";
const DIR = "handback/step-06c-checkpoint/r1/checkpoint.tileproj";
const A = "stage_01JDEM00000000000000000003", B = "stage_BTEST0000000000000000001";
type Obj = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(rel, ""); return out; };
const bagOf = (text: Record<string, string>): Record<string, Obj> => { const parsed = parseProject(text); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const stairs = (c: number, r: number, to: string): Obj => ({ type: "stairs", at: { c, r }, to });
function linked(): Record<string, Obj> {
  const bag = bagOf(walk(DIR)), aPath = `stages/${A}.json`, stage = bag[aPath]; if (!isObj(stage) || typeof stage["mapRef"] !== "string") throw new Error("stage");
  const cleared = { ...stage, enemyPool: { mode: "fixed", entries: [] } };
  const added = addStage({ ...bag, [aPath]: cleared }, cleared, null, B, stage["mapRef"], "Upstairs", "Upstairs map");
  const bPath = `stages/${B}.json`, b = added[bPath]; if (!isObj(b)) throw new Error("up");
  return { ...added, [aPath]: { ...cleared, links: [stairs(1, 0, B)] }, [bPath]: { ...b, name: "Upstairs", playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] }, links: [stairs(2, 1, A)] } };
}
function docsOf(files: Record<string, Obj>, id: string): PlayOut {
  const load = readProject(files); if (!load.ok || load.project === null) throw new Error(load.report.map((row) => row.path).join(" "));
  return playDocsOf(load.project, id);
}
const heroAt = (m: Match): Sq => { const u = m.world.units.all().find((unit) => unit.alive && unit.side === m.sides.me); if (u === undefined) throw new Error("hero"); return { c: u.at.c, r: u.at.r }; };
function go(m: Match, at: Sq): void {
  const id = m.world.units.all().find((unit) => unit.alive && unit.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero");
  if (m.world.phases.battle !== "idle") { m.endTurn(); for (let i = 0; i < 40 && (m.walk !== null || !m.view().mine); i += 1) { m.world.clock.advance(50); m.sync(); } }
  m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at });
  for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(50); m.sync(); }
}
test("stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back", () => {
  assert.deepEqual(arrival([], A, [{ c: 0, r: 0 }]), [{ c: 0, r: 0 }]);
  assert.deepEqual(arrival([{ type: "stairs", at: { c: 2, r: 1 }, to: A }], A, [{ c: 2, r: 1 }, { c: 0, r: 0 }]), [{ c: 2, r: 1 }, { c: 0, r: 0 }]);
  const files = linked(), docs = docsOf(files, A), m = createMatch(docs, 200), got: LinkEvent[] = [];
  m.onLink((ev) => got.push(ev));
  go(m, { c: 0, r: 1 }); assert.deepEqual(got.slice(), []); assert.deepEqual(heroAt(m), { c: 0, r: 1 });
  go(m, { c: 1, r: 1 }); go(m, { c: 1, r: 0 });
  assert.equal(got.length, 1); assert.equal(got[0]?.linkType, "stairs"); assert.equal(got[0]?.to, B); assert.deepEqual(got[0]?.at, { c: 1, r: 0 });
  const up = arriveIn(files, docs, got[0] ?? got[0]); if (up.docs === null) throw new Error(up.error);
  const mb = createMatch(up.docs, 200); assert.deepEqual(heroAt(mb), { c: 2, r: 1 }); assert.equal(mb.sides.contest, false);
  const back: LinkEvent[] = []; mb.onLink((ev) => back.push(ev)); go(mb, { c: 3, r: 1 }); go(mb, { c: 2, r: 1 });
  assert.equal(back.length, 1); assert.equal(back[0]?.to, A); assert.deepEqual(back[0]?.at, { c: 2, r: 1 });
  const down = arriveIn(files, up.docs, back[0] ?? back[0]); if (down.docs === null) throw new Error(down.error);
  assert.deepEqual(heroAt(createMatch(down.docs, 200)), { c: 1, r: 0 });
  const page = readFileSync("tools/play-stage/page.ts", "utf8");
  assert.equal(page.split("driver.dispose()").length - 1, 1);
  assert.equal(page.includes('const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };'), true);
});
test("stage link rebuild fits the frame budget", () => {
  const files = linked(), from = docsOf(files, A), link: LinkEvent = { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } }, times: number[] = [];
  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); const got = arriveIn(files, from, link); if (got.docs === null) throw new Error(got.error); createMatch(got.docs, 200).scene(); times.push(performance.now() - t0); }
  const sample = times.slice(5).sort((a, b) => a - b), mid = sample.length / 2, median = ((sample[mid - 1] ?? 0) + (sample[mid] ?? 0)) / 2;
  assert.ok(median < 4, String(median));
});
test("stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed", () => {
  const files = linked(), aPath = `stages/${A}.json`, base = files[aPath]; if (!isObj(base)) throw new Error("a");
  const outside = readProject({ ...files, [aPath]: { ...base, links: [stairs(1, 0, B), { type: "door", at: { c: 9, r: 0 }, to: B }] } });
  const drop = outside.report.find((row) => row.path === `${aPath}#/links/1`);
  assert.deepEqual(drop, { code: "placementDropped", severity: "warning", path: `${aPath}#/links/1`, detail: "outsideMap" });
  const missing = readProject({ ...files, [aPath]: { ...base, links: [stairs(1, 0, B), { type: "gate", at: { c: 0, r: 1 }, to: "missing" }] } });
  const broke = missing.report.find((row) => row.path === `${aPath}#/links/1/to`);
  assert.equal(broke?.code, "brokenRef"); assert.equal(broke?.severity, "hard");
  const clean = readProject(bagOf(walk(DIR))); assert.equal(clean.report.some((row) => row.path.includes("/links/")), false);
  const self = readProject({ ...files, [aPath]: { ...base, links: [{ type: "door", at: { c: 0, r: 1 }, to: A }] } });
  const own = self.report.find((row) => row.path === `${aPath}#/links/0/to`);
  assert.equal(own?.code, "brokenRef"); assert.equal(own?.severity, "hard");
  const bad = { ...base, links: [{ type: "window", at: { c: 0, r: 1 }, to: B }] };
  assert.equal(readStage(bad, { picks: 0, waveUnits: 0 }).ok, false);
  assert.equal(readProject({ ...files, [aPath]: bad }).report.some((row) => row.severity === "hard" && row.path === aPath), true);
});
test("stage link: a stage a link leads to can't be deleted until the link is removed", () => {
  const files = linked(), aPath = `stages/${A}.json`, stage = files[aPath]; if (!isObj(stage)) throw new Error("a");
  assert.deepEqual(deleteStage(files, B), { ok: false, reason: "A link on Blank leads here. Remove it first." });
  const freed = deleteStage({ ...files, [aPath]: removeLink(stage, 1, 0) }, B); assert.equal(freed.ok, true);
  assert.equal(addLink(stage, "stairs", 0, 1, A), null);
});
test("stage link: a resize drops a link cell outside the map with a placementDropped row", () => {
  const files = linked(), mapId = files[`stages/${A}.json`]?.["mapRef"], map = docsIn(files, "maps").find((row) => row.doc["id"] === mapId);
  if (map === undefined) throw new Error("map");
  const sized = resizeMap(map.path, map.doc, docsIn(files, "stages"), 2, 2);
  assert.deepEqual(sized.rows.map((row) => row.code === "placementDropped" ? [row.code, row.list, row.path] : [row.code]), [["placementDropped", "links", `stages/${B}.json#/links/0`]]);
  const next = sized.stages.find((row) => row.path === `stages/${B}.json`)?.doc["links"];
  assert.deepEqual(next, []);
});
test("stage link: arrival is the target's first link back to the source, in array order", () => {
  assert.deepEqual(arrival([{ type: "gate", at: { c: 4, r: 4 }, to: "x" }, { type: "door", at: { c: 3, r: 1 }, to: A }, { type: "stairs", at: { c: 2, r: 1 }, to: A }], A, [{ c: 2, r: 1 }]), [{ c: 3, r: 1 }, { c: 2, r: 1 }]);
  const files = linked(), bPath = `stages/${B}.json`, b = files[bPath]; if (!isObj(b)) throw new Error("b");
  const land = (links: readonly Obj[]): Sq => {
    const from = docsOf({ ...files, [bPath]: { ...b, links } }, A);
    const got = arriveIn({ ...files, [bPath]: { ...b, links } }, from, { type: "link", linkType: "stairs", from: A, to: B, at: { c: 1, r: 0 } });
    if (got.docs === null) throw new Error(got.error); return heroAt(createMatch(got.docs, 200));
  };
  assert.deepEqual(land([{ type: "door", at: { c: 3, r: 1 }, to: A }, { type: "stairs", at: { c: 2, r: 1 }, to: A }]), { c: 3, r: 1 });
  assert.deepEqual(land([{ type: "door", at: { c: 2, r: 1 }, to: A }, { type: "stairs", at: { c: 3, r: 1 }, to: A }]), { c: 2, r: 1 });
});
