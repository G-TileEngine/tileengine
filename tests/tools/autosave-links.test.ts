import assert from "node:assert/strict";
import { test } from "node:test";
import { createRng } from "../../src/core/rng/index.ts";
import { setAutosave } from "../../src/editor/stage/links.ts";
import { deleteStage, setStart } from "../../src/editor/stage/rooms.ts";
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { readManifest, readStage } from "../../src/project/read/index.ts";
import { readSession, sessionSave, settleSession } from "../../src/project/read/session.ts";
import { createLevels } from "../../src/rules/levels/index.ts";
import { arrival, autosaves } from "../../src/rules/session/links.ts";
import { partyOf } from "../../src/rules/session/party.ts";
import { SAVE_MIGRATIONS, type SaveChains } from "../../src/sim/migrations/save/index.ts";
import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
import { openShop, shopFiles } from "../../tools/baseline/checkpoint.ts";
import { readout } from "../../tools/baseline/readout.ts";
import { readAutosave, slotOf, writeAutosave } from "../../tools/maker/session.ts";
import { memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
const S1 = "stage_01JDES00000000000000000001", S2 = "stage_01JDES00000000000000000002", H = "unit_01M81X2BX5ANZS5PWVAFHNCASA", R = "unit_01M81X2PKRZ2NQKAHDV247ZRX3", ID = "project_01M81X22DNRFYKC2MHE6JECEM3";
type Obj = Record<string, unknown>; type Match = ReturnType<typeof createMatch>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), bad = (e: unknown, message: string): boolean => e instanceof Error && e.message === message;
const bag = (files: ProjectFiles): Record<string, Obj> => { const out: Record<string, Obj> = {}; for (const [k, v] of Object.entries(files)) if (isObj(v)) out[k] = v; return out; };
const party = (hp: number, members: SessionParty["members"] = [{ unitId: H, hp }]): SessionParty => ({ side: "player", members, bar: null });
const header: SaveHeader = { projectHash: "rev:12", engineVersion: "0.0.0", projectId: ID, savedAt: "2026-11-24T00:00:00.000Z" }, want = { projectId: ID, projectHash: "rev:12", engineVersion: "0.0.0" };
const hpOf = (m: Match): number | undefined => { const u = m.world.units.all().find((x) => x.unitId === H); return m.world.rules?.state().units.find((x) => x.id === u?.id)?.hp; };
const atOf = (m: Match, unitId: string, side: string): { c: number; r: number }[] => m.world.units.all().filter((u) => u.alive && u.unitId === unitId && u.side === side).map((u) => ({ c: u.at.c, r: u.at.r }));
const open = (files: ProjectFiles, from: string | null, to: string, body: SessionParty) => { const got = arriveIn(files, from, to, body); if (got.docs === null) throw new Error(got.error); return got.docs; };
const RULES = { bar: "side" as const, thresholds: [10], offerLevels: [1], offerSize: 1, xp: { move: 1 } }, free4 = (sq: { c: number; r: number }): boolean => sq.c >= 0 && sq.r >= 0 && sq.c < 4 && sq.r < 4 && !(sq.c === 2 && sq.r === 1);
const doc = (over: Obj = {}): Obj => ({ kind: "session-save", formatVersion: 1, header, from: S1, to: S2, party: party(2), ...over });
const boom = (m: Match, at: { c: number; r: number }): void => { const id = m.world.units.all().find((u) => u.alive && u.side === m.sides.me)?.id; if (id === undefined) throw new Error("hero"); if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: id }); m.feed({ type: "TargetCell", at }); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(50); m.sync(); } };
test("step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again", () => {
  assert.equal(hpOf(createMatch(open(shopFiles(), S1, S2, party(2)), 200)), 2); assert.equal(hpOf(createMatch(open(shopFiles(), S1, S2, party(70)), 200)), 20);
  const docs = open(shopFiles(), S1, S2, party(20)); assert.throws(() => createMatch({ ...docs, rules: { ...docs.rules, carry: { side: "player", hp: { [H]: 0 } } } }, 200), (e: unknown) => bad(e, "createBattle: bad setup"));
  const got = partyOf([{ unitId: "a", side: "player", alive: true }, { unitId: "a", side: "player", alive: true }, { unitId: "b", side: "player", alive: false }], { a: 3, b: 1 }, "player", [{ id: "player", xp: 1, level: 2, banked: 4, offer: ["z"], abilities: ["q"] }]);
  assert.deepEqual(got.members, [{ unitId: "a", hp: 3 }]); assert.deepEqual(got.bar, { xp: 1, level: 2, banked: 4, offer: ["z"], abilities: ["q"] });
  const levels = createLevels({ rules: RULES, pools: { player: ["y"] }, start: [{ id: "player", xp: 1, level: 0, banked: 2, offer: ["y"], abilities: [] }] }, createRng(1), () => undefined);
  assert.deepEqual(levels.offer("player"), ["y"]); assert.equal(levels.state().bars[0]?.banked, 2);
  assert.throws(() => createLevels({ rules: RULES, pools: {}, start: [{ id: "player", xp: -1, level: 0, banked: 0, offer: null, abilities: [] }] }, createRng(1), () => undefined), (e: unknown) => bad(e, "createLevels: bad start"));
  assert.throws(() => createLevels({ rules: RULES, pools: {}, start: [{ id: "player", xp: 0, level: 0, banked: 0, offer: [1 as never], abilities: [] }] }, createRng(1), () => undefined), (e: unknown) => bad(e, "createLevels: bad start"));
  assert.throws(() => partyOf([{ unitId: "a", side: "player", alive: true }], {}, "player", null), (e: unknown) => bad(e, "partyOf: no hp"));
});
test("step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W", () => {
  assert.deepEqual(arrival([], "x", [{ c: 2, r: 2 }], 3, free4), [{ c: 2, r: 2 }, { c: 3, r: 2 }, { c: 2, r: 3 }]); assert.deepEqual(arrival([{ type: "stairs", at: { c: 2, r: 1 }, to: "x" }], "x", [{ c: 2, r: 2 }], 1, free4), [{ c: 2, r: 2 }]);
  const files = shopFiles(), path = `stages/${S2}.json`, stage = files[path]; if (!isObj(stage)) throw new Error("s2");
  const m = createMatch(open({ ...files, [path]: { ...stage, enemyPool: { mode: "fixed", entries: [{ unitId: R, at: { c: 1, r: 4 } }] } } }, S1, S2, party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }])), 200);
  assert.deepEqual(atOf(m, H, m.sides.me), [{ c: 0, r: 4 }]); assert.deepEqual(atOf(m, R, m.sides.me), [{ c: 1, r: 3 }]); assert.deepEqual(atOf(m, R, "rival"), [{ c: 1, r: 4 }]);
});
test("step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses", async () => {
  const on = { type: "stairs" as const, at: { c: 1, r: 4 }, to: S2, autosave: true as const }; assert.equal(autosaves(on, false), true); assert.equal(autosaves(on, true), false); assert.equal(autosaves({ type: "stairs", at: { c: 1, r: 4 }, to: S2 }, false), false);
  const walked = (enemy: boolean): boolean => { const files = shopFiles(), path = `stages/${S1}.json`, stage = files[path]; if (!isObj(stage)) throw new Error("s1"); const links = [{ type: "stairs", at: { c: 1, r: 4 }, to: S2, autosave: true }], pool = enemy ? { mode: "fixed", entries: [{ unitId: R, at: { c: 3, r: 4 } }] } : stage["enemyPool"]; const m = createMatch(open({ ...files, [path]: { ...stage, links, enemyPool: pool } }, null, S1, party(20)), 200), got: { autosave: boolean }[] = []; m.onLink((ev) => got.push(ev)); boom(m, { c: 1, r: 4 }); const hit = got[0]; if (hit === undefined) throw new Error("link"); return hit.autosave; };
  assert.equal(walked(false), true); assert.equal(walked(true), false);
  const store = memoryStore(), body = party(2), wrote = await writeAutosave(store, header, S1, S2, body), back = await readAutosave(store, want);
  assert.equal(wrote.ok, true); assert.equal(back?.ok, true); if (back !== null && back.ok) assert.equal(back.save.to, S2); assert.equal([...store.files.keys()].some((k) => k.startsWith("tileengine/projects/")), false);
  const slot = slotOf(ID), keep = async (text: string): Promise<void> => { store.files.set(slot, text); const res = await writeAutosave(store, header, S1, S2, body); assert.equal(res.ok, false); assert.equal(store.files.get(slot), text); };
  await keep(JSON.stringify({ kind: "session-save", formatVersion: 2 })); await keep("{");
  store.files.set(slot, JSON.stringify(sessionSave({ ...header, projectHash: "rev:1" }, S1, S2, body))); assert.equal((await writeAutosave(store, header, S1, S2, body)).ok, true); assert.equal(store.files.get(slot)?.includes('"projectHash":"rev:12"'), true);
  const held = "{\"v\":2}", disk: MakerStore = { ...store, read: (path) => path === slot ? Promise.reject(new Error("disk")) : store.read(path) }; store.files.set(slot, held);
  await assert.rejects(() => writeAutosave(disk, header, S1, S2, body), (e: unknown) => bad(e, "disk")); assert.equal(store.files.get(slot), held);
  const fresh = memoryStore(); assert.equal((await writeAutosave(fresh, header, S1, S2, party(1, []))).ok, false); assert.equal(fresh.files.size, 0); assert.equal((await writeAutosave(fresh, header, S1, S2, body)).ok, true);
  const full = memoryStore(); full.failOn(`tileengine/saves/${ID}/autosave.json.tmp`); assert.equal((await writeAutosave(full, header, S1, S2, body)).ok, false);
});
test("step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted", () => {
  const files = bag(shopFiles()), started = setStart(files, S2), man = readManifest(started["project.json"]); assert.equal(man.ok && man.doc.project.session?.start, S2);
  const opened = openProject(started); if (opened.docs === null) throw new Error(opened.error); const stage = opened.docs.stage; assert.equal(isObj(stage) && stage["id"], S2);
  const refused = deleteStage(started, S2); assert.equal(refused.ok, false); if (!refused.ok) assert.equal(refused.reason, "The game starts here. Pick another start first."); assert.equal(setStart(started, "no-such-stage"), started);
  const first = setStart(files, S1), again = readManifest(first["project.json"]); assert.equal(again.ok && again.doc.project.session?.start, S1);
  const root = structuredClone(files["project.json"]); if (!isObj(root) || !isObj(root["project"])) throw new Error("root");
  const gone = { ...files, "project.json": { ...root, project: { ...root["project"], session: { start: "missing-stage" } } } }, dangling = readProject(gone).report.find((row) => row.path === "project.json#/project/session/start");
  assert.equal(dangling?.code, "brokenRef"); assert.equal(dangling?.severity, "hard"); assert.equal(readManifest({ ...root, project: { ...root["project"], session: { start: 3 } } }).ok, false);
});
test("step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it", () => {
  const stage = bag(shopFiles())[`stages/${S1}.json`]; if (stage === undefined) throw new Error("s1");
  const on = setAutosave(stage, 1, 4, true), link = Array.isArray(on["links"]) ? on["links"][0] : undefined; assert.equal(isObj(link) && link["autosave"], true);
  const off = setAutosave(on, 1, 4, false), dropped = Array.isArray(off["links"]) ? off["links"][0] : undefined; assert.equal(isObj(dropped) && Object.hasOwn(dropped, "autosave"), false);
  const kept = readStage(on, { picks: 0, waveUnits: 0 }); assert.equal(kept.ok && kept.doc.links?.[0]?.autosave, true);
  assert.equal(readStage({ ...stage, links: [{ type: "stairs", at: { c: 1, r: 4 }, to: S2, autosave: "yes" }] }, { picks: 0, waveUnits: 0 }).ok, false);
});
test("step 8 link event: a stage with no string id throws instead of sending an empty from", () => {
  const opened = openProject(shopFiles()); if (opened.docs === null) throw new Error(opened.error);
  const m = createMatch(opened.docs, 200); m.onLink(() => undefined); if (isObj(opened.docs.stage)) opened.docs.stage["id"] = 7;
  assert.throws(() => boom(m, { c: 1, r: 4 }), (e: unknown) => bad(e, "play: stage id")); assert.throws(() => arriveIn(shopFiles(), "", S2, party(20)), (e: unknown) => bad(e, "play: stage id"));
});
test("step 8 link rebuild with the party carry and the autosave write fits the step 7 budget", async () => {
  const files = shopFiles(), store = memoryStore(), times: number[] = [], body = party(20);
  for (let i = 0; i < 25; i += 1) { const t0 = performance.now(); createMatch(open(files, S1, S2, body), 200).scene(); await writeAutosave(store, header, S1, S2, body); times.push(performance.now() - t0); }
  const sample = times.slice(5).sort((a, b) => a - b), mid = sample.length / 2, median = ((sample[mid - 1] ?? 0) + (sample[mid] ?? 0)) / 2; console.log(`step 8 rebuild median ${median.toFixed(2)} ms`); assert.ok(median < 4, String(median));
});
test("step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped", async () => {
  const older = readSession({ ...doc(), formatVersion: 0 }, want), newer = readSession({ ...doc(), formatVersion: 2 }, want);
  assert.equal(!older.ok && older.code, "saveFormatOlder"); assert.equal(!newer.ok && newer.code, "saveFormatNewer");
  const wrong = readSession(doc({ header: { ...header, projectId: "other" } }), want); assert.equal(!wrong.ok && wrong.code === "invalidValue" && wrong.detail, "projectId");
  const mis = readSession(doc({ header: { ...header, projectHash: "rev:1", engineVersion: "9" } }), want); assert.equal(mis.ok, true); if (mis.ok) assert.deepEqual(mis.notes.map((n) => n.code), ["saveProjectMismatch", "saveEngineMismatch"]);
  for (const members of [[], [{ unitId: H, hp: 2 }, { unitId: H, hp: 2 }], [{ unitId: H, hp: 0 }], [{ unitId: H, hp: 1.5 }]]) assert.equal(readSession(doc({ party: { side: "player", members, bar: null } }), want).ok, false);
  const store = memoryStore(), slot = slotOf(ID), v0 = { kind: "session-save", formatVersion: 0, header, from: S1, to: S2, party: { side: "player", members: [H], hp: { [H]: 2 } } };
  store.files.set(slot, JSON.stringify(v0)); const bare = await readAutosave(store, want); assert.equal(bare !== null && !bare.ok && bare.code, "saveFormatOlder");
  const lift = (row: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> => { const p = row["party"]; if (!isObj(p) || !Array.isArray(p["members"]) || !isObj(p["hp"]) || typeof p["side"] !== "string") throw new Error("party"); const hp = p["hp"]; return { ...row, formatVersion: 1, party: { side: p["side"], bar: null, members: p["members"].flatMap((id) => typeof id === "string" && typeof hp[id] === "number" ? [{ unitId: id, hp: hp[id] }] : []) } }; };
  const chains: SaveChains = { ...SAVE_MIGRATIONS, "session-save": { 0: lift } }, moved = await readAutosave(store, want, chains); assert.equal(moved?.ok, true); if (moved !== null && moved.ok) assert.equal(moved.save.party.members[0]?.hp, 2);
  const thrown: SaveChains = { ...SAVE_MIGRATIONS, "session-save": { 0: () => { throw new Error("nope"); } } }, failed = await readAutosave(store, want, thrown); assert.equal(failed !== null && !failed.ok && failed.code, "saveMigrationFailed");
  const settled = settleSession(sessionSave(header, "gone-from", "gone-to", party(2, [{ unitId: H, hp: 2 }, { unitId: "missing", hp: 3 }])), [S1, S2], [H, R], S2);
  assert.equal(settled.to, S2); assert.equal(settled.from, null); assert.deepEqual(settled.party.members, [{ unitId: H, hp: 2 }]); assert.equal(settled.notes.length === 3 && settled.notes.every((n) => n.code === "saveRefDropped"), true);
  assert.deepEqual(atOf(createMatch(open(shopFiles(), settled.from, settled.to, settled.party), 200), H, "player"), [{ c: 0, r: 4 }]);
});
const nook = (open: readonly number[]): ProjectFiles => {
  const files = shopFiles(), mapPath = "maps/map_01JDEM00000000000000000002.json", map = files[mapPath], stagePath = `stages/${S2}.json`, stage = files[stagePath], logic = isObj(map) ? map["logic"] : undefined, cells = isObj(logic) && Array.isArray(logic["terrain"]) ? logic["terrain"] : null;
  if (cells === null || !isObj(map) || !isObj(logic) || !isObj(stage)) throw new Error("nook");
  return { ...files, [mapPath]: { ...map, logic: { ...logic, terrain: cells.map((_, i) => open.includes(i) ? 0 : 1) } }, [stagePath]: { ...stage, enemyPool: { mode: "fixed", entries: [{ unitId: R, at: { c: 1, r: 4 } }] } } };
};
test("step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame", () => {
  const opened = openShop(); assert.equal(opened.error, ""); if (opened.docs === null) throw new Error(opened.error); assert.equal(createMatch(opened.docs, 0).sides.contest, false);
  const down = shopFiles()[`stages/${S1}.json`], up = shopFiles()[`stages/${S2}.json`]; if (!isObj(down) || !isObj(up) || !Array.isArray(down["links"]) || !Array.isArray(up["links"])) throw new Error("stairs");
  const a = down["links"][0], b = up["links"][0]; assert.equal(isObj(a) && a["to"], S2); assert.equal(isObj(b) && b["to"], S1);
  const gaps = [16, 16, 40, 61, 16, 16, 30], row = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1, swaps: [2, 5], scene: "shop" });
  assert.equal(row.endsWith("stage changes 2\nworst ms in 3 frames after a swap 61.0"), true); assert.equal(row.includes("over 50 ms 1 of 7"), true); assert.equal(row.startsWith("baseline 06c · Shop stairs (?scene=shop)\n"), true);
  const plain = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1 }); assert.equal(plain.includes("stage changes"), false); assert.equal(plain.includes("after a swap"), false); assert.equal(plain.startsWith("baseline 06c · Skirmish (checkpoint.tileproj)\n"), true);
});
test("step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip", async () => {
  const carried = party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }]), docs = open(nook([24, 25, 29]), S1, S2, carried), m = createMatch(docs, 200);
  assert.deepEqual(atOf(m, H, m.sides.me), [{ c: 0, r: 4 }]); assert.deepEqual(atOf(m, R, m.sides.me), [{ c: 5, r: 4 }]); assert.deepEqual(m.party().members, carried.members); assert.equal(m.view().note, null);
  const store = memoryStore(), wrote = await writeAutosave(store, header, S1, S2, m.party()), back = await readAutosave(store, want); assert.equal(wrote.ok, true); assert.equal(back?.ok, true); if (back !== null && back.ok) assert.deepEqual(back.save.party.members, carried.members);
});
test("step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row", async () => {
  const carried = party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }]), docs = open(nook([24, 25]), S1, S2, carried), m = createMatch(docs, 200);
  assert.deepEqual(atOf(m, R, m.sides.me), []); assert.deepEqual(docs.bench, [{ unitId: R, hp: 2 }]); assert.deepEqual(m.party().members, carried.members);
  assert.equal(m.world.notices.some((n) => n.code === "notPlaced"), true); assert.equal(m.view().note?.startsWith("Not placed: 1 of your team had no free cell"), true);
  const store = memoryStore(); assert.equal((await writeAutosave(store, header, S1, S2, m.party())).ok, true); const kept = await readAutosave(store, want); assert.equal(kept?.ok, true); if (kept !== null && kept.ok) assert.deepEqual(kept.save.party.members, carried.members);
});
