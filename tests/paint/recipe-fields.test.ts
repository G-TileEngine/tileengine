import assert from "node:assert/strict"; import { test } from "node:test";
import { BTF_SPRITE_RECIPE_LIMITS } from "../../src/btf-adapters/src/index.ts";
import { readSpriteRecipe } from "../../src/paint/recipe/index.ts";
import { SAMPLE, copy, fieldPaths, getPath, setPath } from "./sample.ts"; const LIM = BTF_SPRITE_RECIPE_LIMITS;
const WANT = ["light", "palette.slots[1].team", "defaults.shade.dither", "parts[0].promotedFrom.runs[0]", "parts[3].geom.pts[3]", "parts[7].runs[2]", "skeleton.joints[1].parent", "anims[0].gen.arm", "anims[0].frames[0].runs.eyes[0]", "facings.up.pose.neck.rot", "facings.sideMirror", "variants[0].swap.cloak", "code.outHash", "history.ops"];
test("recipe sample reads clean (SE-01) doc and stored match the sample", () => {
const r = readSpriteRecipe(copy(SAMPLE), LIM);
assert.equal(r.ok && !r.ok ? false : r.ok && r.readOnly === false && r.notices.length === 0, true); if (!r.ok) return;
assert.deepEqual(r.doc, SAMPLE); assert.deepEqual(r.stored, SAMPLE); });
test("recipe field list (SE-01) is the 240 sample paths", () => { const paths = fieldPaths(SAMPLE);
assert.equal(paths.length, 240); for (const p of WANT) assert.equal(paths.includes(p), true); });
for (const key of fieldPaths(SAMPLE)) { test("recipe field " + key + " (SE-01) a wrong type names that key", () => {
const src = copy(SAMPLE); const bad = typeof getPath(src, key) === "boolean" ? 7 : true; setPath(src, key, bad);
const r = readSpriteRecipe(src, LIM); assert.equal(r.ok, true); if (!r.ok) return;
assert.deepEqual(r.notices, [{ code: "badField", message: "badField " + key }]);
assert.deepEqual(getPath(r.stored, key), bad); assert.notDeepEqual(getPath(r.doc, key), bad);
for (const v of [null, Number.NaN, -1e9, 0.5, "", [], {}, "__proto__"]) { const s2 = copy(SAMPLE); setPath(s2, key, v);
assert.equal(readSpriteRecipe(s2, LIM).ok, true); } }); }
