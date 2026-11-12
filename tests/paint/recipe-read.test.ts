import assert from "node:assert/strict"; import { test } from "node:test";
import { BTF_SPRITE_RECIPE_LIMITS as LIM } from "../../src/btf-adapters/src/index.ts";
import { SPRITE_RASTER, readSpriteRecipe, type RecipeRead } from "../../src/paint/recipe/index.ts";
import { SAMPLE, copy, getPath, setPath } from "./sample.ts"; const ok = (j: unknown, limits = LIM): Extract<RecipeRead, { ok: true }> => {
const r = readSpriteRecipe(j, limits); if (!r.ok) throw new Error(r.needsMigration ? "migration" : r.error); return r; };
const msgs = (r: { notices: readonly { message: string }[] }): string[] => r.notices.map((n) => n.message);
const err = (j: unknown): string => { const r = readSpriteRecipe(j, LIM); return r.ok || r.needsMigration ? "" : r.error; };
test("recipe guard (SE-01) only an unreadable document fails", () => { for (const j of [null, [], "x", 7]) assert.equal(err(j), "not an object");
assert.equal(err({ ...SAMPLE, kind: "map" }), "wrong kind map"); assert.equal(err({ ...SAMPLE, kind: {} }), "wrong kind object");
for (const fv of ["1", 1.5, undefined]) assert.equal(err({ ...SAMPLE, formatVersion: fv }), "bad field formatVersion");
assert.deepEqual(readSpriteRecipe({ ...SAMPLE, formatVersion: 0 }, LIM), { ok: false, needsMigration: true, kind: "sprite-recipe", found: 0 });
const neu = ok({ ...copy(SAMPLE), formatVersion: 2 }); assert.equal(neu.readOnly && neu.doc.formatVersion === 2 && neu.doc.parts.length === 8, true);
assert.deepEqual(msgs(neu), ["newerFormat formatVersion"]);
const cyc: Record<string, unknown> = copy(SAMPLE); cyc.self = cyc; assert.equal(err(cyc), "not plain JSON");
for (const prop of ["kind", "formatVersion", "name"]) { const o = copy(SAMPLE) as Record<string, unknown>;
Object.defineProperty(o, prop, { enumerable: true, get() { throw new Error("get"); } }); assert.equal(err(o), "not plain JSON"); }
const rev = Proxy.revocable(copy(SAMPLE), {}); rev.revoke(); assert.equal(err(rev.proxy), "not plain JSON");
assert.equal(err(new Proxy(copy(SAMPLE), { get() { throw new Error("trap"); } })), "not plain JSON");
const boom = copy(SAMPLE) as { toJSON?: () => unknown }; boom.toJSON = () => { throw new Error("json"); }; assert.equal(err(boom), "not plain JSON");
const nest = (n: number): unknown => { let d: unknown = []; for (let i = 0; i < n; i += 1) d = [d]; return { ...copy(SAMPLE), deep: d }; };
assert.equal(ok(nest(1000)).readOnly, false); assert.equal(err(nest(100000)), "not plain JSON"); assert.equal(SPRITE_RASTER, 1);
const ras = ok({ ...copy(SAMPLE), raster: 2 }); assert.deepEqual(msgs(ras), ["rasterTooNew raster"]); assert.equal(ras.doc.raster, 2); });
test("recipe limits (SE-01) rejects a non-integer cap", () => {
assert.deepEqual(LIM, { side: 256, parts: 256, points: 256, runs: 16384, joints: 64, anims: 32, frames: 64, variants: 32, historyBatches: 2000, historyBytes: 1000000 });
for (const x of [-1, 1.5, Number.NaN]) assert.throws(() => readSpriteRecipe(SAMPLE, { ...LIM, runs: x }), { name: "RangeError", message: "readSpriteRecipe: limits must be integers >= 0" });
}); test("recipe caps (SE-01) warns one under the sample count and not at it", () => {
const bytes = new TextEncoder().encode(JSON.stringify(SAMPLE.history)).length; const rows: readonly [keyof typeof LIM, number, string, boolean][] = [
["side", 32, "size.w", false], ["parts", 8, "parts", true], ["points", 4, "parts[3].geom.pts", true], ["runs", 3, "parts[7].runs", true],
["joints", 2, "skeleton.joints", true], ["anims", 1, "anims", true], ["frames", 1, "anims[0].frames", true], ["variants", 1, "variants", true],
["historyBatches", 2, "history.ops", true], ["historyBytes", bytes, "history", false], ]; for (const [cap, n, key, asLen] of rows) {
assert.deepEqual(msgs(ok(copy(SAMPLE), { ...LIM, [cap]: n })), []); const under = ok(copy(SAMPLE), { ...LIM, [cap]: n - 1 });
assert.deepEqual(msgs(under), ["overCap " + key]); assert.deepEqual(under.stored, SAMPLE);
if (cap === "historyBytes") assert.deepEqual(under.doc.history, SAMPLE.history);
else assert.equal(asLen ? (getPath(under.doc, key) as unknown[]).length : getPath(under.doc, key), n - 1); } });
test("recipe floats, ids and runs (SE-01) floors, rejects duplicates and bad runs", () => {
const a = copy(SAMPLE); setPath(a, "size.w", 31.7); setPath(a, "parts[7].runs[0][2]", 1.5); const r = ok(a);
assert.deepEqual(msgs(r), ["floatParam size.w", "floatParam parts[7].runs[0][2]"]); assert.equal(r.doc.size.w, 31);
assert.deepEqual(getPath(r.doc, "parts[7].runs[0]"), [3, 4, 1, 0]); assert.equal(getPath(r.stored, "size.w"), 31.7);
const dup = copy(SAMPLE); setPath(dup, "skeleton.joints[0].id", "arm"); assert.deepEqual(msgs(ok(dup)), ["duplicateId skeleton.joints[0].id"]);
const badRun = (v: unknown): string[] => { const s = copy(SAMPLE); setPath(s, "parts[7].runs[2]", v); const g = ok(s); assert.equal((getPath(g.doc, "parts[7].runs") as unknown[]).length, 2); return msgs(g); };
assert.deepEqual(badRun([3, 5, 1, 0]), ["badField parts[7].runs[2]"]); assert.deepEqual(badRun([5, 0, 0, 0]), ["badField parts[7].runs[2][2]"]);
assert.deepEqual(badRun([5, 0, 1, -3]), ["badField parts[7].runs[2][3]"]); assert.deepEqual(badRun([5, 0, 1]), ["badField parts[7].runs[2]"]);
const geom = copy(SAMPLE); setPath(geom, "parts[7].geom", { x: 1 }); assert.deepEqual(msgs(ok(geom)), ["badField parts[7].geom"]); });
test("recipe formats and ranges (SE-01) one badField names the key", () => { const cases: readonly [string, unknown][] = [
["id", "sprite_01jd7z5k3m8q2w4e6r9t0y1x2v"], ["parts[0].id", "Body"], ["parts[0].slot", "x".repeat(25)],
["palette.slots[0].ramp[0]", "#12345"], ["parts[0].outline.colour", "dark!"], ["code.outHash", "0".repeat(63)],
["size.w", 0], ["defaults.outline.px", 3], ["parts[0].geom.round", 101], ["anims[0].gen.stride", 5], ];
for (const [key, val] of cases) { const s = copy(SAMPLE); setPath(s, key, val); assert.deepEqual(msgs(ok(s)), ["badField " + key]); }
const pose = copy(SAMPLE) as { anims: { frames: { pose: Record<string, unknown> }[] }[] };
const poseRec = pose.anims[0]?.frames[0]?.pose; if (poseRec) poseRec.Root = { dx: 0, dy: 0, rot: 0 };
assert.deepEqual(msgs(ok(pose)), ["badField anims[0].frames[0].pose.Root"]); const hex = copy(SAMPLE); setPath(hex, "palette.slots[0].ramp[0]", "#5A3A2A");
assert.deepEqual(msgs(ok(hex)), []); }); test("recipe droppedKey (SE-01) drops proto keys in document order", () => { let text = JSON.stringify(SAMPLE);
text = text.replace("\"name\":\"Hero\"", "\"name\":\"Hero\",\"__proto__\":{\"polluted\":1},\"createdAt\":\"2026-11-12\",\"note\":{\"x\":1}");
text = text.replace("\"dither\":\"none\"", "\"dither\":\"none\",\"prototype\":7");
text = text.replace("\"locked\":false", "\"locked\":false,\"constructor\":{\"prototype\":1}"); const r = ok(JSON.parse(text));
assert.deepEqual(msgs(r), ["droppedKey __proto__", "droppedKey prototype", "droppedKey constructor"]);
assert.equal(Object.hasOwn(r.stored, "__proto__") || Object.hasOwn(getPath(r.stored, "parts[0]") as object, "constructor") || Object.hasOwn(getPath(r.stored, "defaults.shade") as object, "prototype"), false);
assert.equal((Object.prototype as { polluted?: unknown }).polluted, undefined); assert.equal(Object.hasOwn(r.stored, "createdAt"), true);
assert.deepEqual(getPath(r.stored, "note"), { x: 1 }); assert.equal("note" in r.doc, false); assert.deepEqual(r.doc, SAMPLE); });
test("recipe R1 round-trip (SE-01) a second read of stored matches", () => {
const text = JSON.stringify(SAMPLE).replace("\"light\":135", "\"light\":1.5").replace("\"id\":\"skin\"", "\"id\":\"skin\",\"__proto__\":1").replace("\"z\":1", "\"z\":\"3\"");
const src = JSON.parse(text) as Record<string, unknown>; src.extra = [1, { a: 2 }]; const lim = { ...LIM, parts: 6 }; const r = ok(src, lim);
assert.deepEqual(msgs(r), ["droppedKey __proto__", "floatParam light", "overCap parts", "badField parts[1].z"]);
const again = ok(JSON.parse(JSON.stringify(r.stored)), lim); assert.deepEqual(again.doc, r.doc); assert.deepEqual(again.stored, r.stored);
assert.equal(again.readOnly, r.readOnly); assert.deepEqual(msgs(again), ["floatParam light", "overCap parts", "badField parts[1].z"]);
const paint = copy(SAMPLE) as { history?: unknown; name?: unknown; rev?: unknown; parts: Record<string, unknown>[]; code: { src?: unknown } };
delete paint.history; delete paint.name; delete paint.rev; delete paint.parts[0]?.locked; delete paint.parts[0]?.promotedFrom; delete paint.code.src;
assert.deepEqual(msgs(ok(paint)), []); });
