import assert from "node:assert/strict";
import { test } from "node:test";
import { blend, keyOf } from "../../src/editor/effect/merge.ts";
import { hash32 } from "../../src/runtime/render/frames.ts";
import { breed, DICE, pushRoll, roll, rollValue } from "../../src/editor/effect/dice.ts";
import { addPart, blankDoc, HOUSE, readHouse } from "../../src/editor/effect/house.ts";
type Row = Record<string, unknown>;
const mint = () => { let n = 0; return (p: string) => `${p}${(n += 1)}`; };
const st = (id: string, x: Row = {}): Row => ({ id, kind: "stamp", ...x });
const sp = (id: string, x: Row = {}): Row => ({ id, kind: "particles", particle_count: 20, particle_life_ms: 1000, particle_pull: 1000, start_mode: "at-hit", ...x });
const fire: Row = { connect_step: "h", tint_ramp: "fire", shake: 2, hit_stop_ms: 100, parts: [{ id: "c", kind: "colour", beats: ["cast"] }], steps: [st("a", { seconds: 0.6, part: "c", tint_ramp: "fire" }), st("h", { kind: "straight", seconds: 1, bend: -1 }), sp("x"), sp("y", { particle_count: 0, light_radius: 2 })] };
const stepsOf = (d: Row): Row[] => d["steps"] as Row[];
test("E5 dice: same anchor + seed gives the same doc; each value stays within ±25% and its range, snapped; 0, absent and out-of-range values stay; only the layer's steps move; the seed is written (0 = absent)", () => {
  const a = roll(fire, "sparks", 77), b = roll(fire, "sparks", 77), c = roll(fire, "sparks", 78);
  assert.deepEqual(a, b); assert.notDeepEqual(a.doc, c.doc); assert.equal(a.doc["variant_seed"], 77); assert.equal("variant_seed" in roll(fire, "sparks", 0).doc, false);
  const x = stepsOf(a.doc as Row)[2] ?? {}; assert.ok(Number.isInteger(x["particle_count"]) && (x["particle_count"] as number) >= 15 && (x["particle_count"] as number) <= 25, String(x["particle_count"]));
  assert.ok((x["particle_life_ms"] as number) % 10 === 0 && (x["particle_life_ms"] as number) >= 750 && (x["particle_life_ms"] as number) <= 1250); assert.equal((x["particle_pull"] as number) % 100, 0);
  assert.equal(stepsOf(a.doc as Row)[3]?.["particle_count"], 0); assert.deepEqual(stepsOf(a.doc as Row).slice(0, 2), stepsOf(fire).slice(0, 2)); assert.equal(fire["variant_seed"], undefined);
  for (let s = 1; s < 40; s += 1) { const v = rollValue(0.2, ["seconds", 0.15, 3, 0.01], s, "k", 0) as number; assert.ok(v >= 0.15 && v <= 0.25 && Math.round(v * 100) / 100 === v, String(v)); assert.equal(rollValue(-1, ["bend", -2.5, 2.5, 0.01], s, "k", 0) as number <= -0.75, true); }
  const bends = new Set<unknown>(); for (let s = 1; s < 40; s += 1) { assert.ok((rollValue(2.8, ["seconds", 0.15, 3, 0.01], s, "k", 0) as number) <= 3 && (rollValue(0.16, ["seconds", 0.15, 3, 0.01], s, "k", 0) as number) >= 0.15); assert.equal(rollValue(0, ["smear_ms", 40, 120, 10], s, "k", 0), 0); bends.add(rollValue(-1, ["bend", -2.5, 2.5, 0.01], s, "k", 0)); } assert.ok(bends.size > 5 && [...bends].every((v) => Math.round((v as number) * 100) / 100 === v)); assert.equal(rollValue(3.2, ["seconds", 0.15, 3, 0.01], 1, "k", 0), 3.2);
  for (let s = 1; s < 40; s += 1) { const v = rollValue(1030, ["particle_life_ms", 200, 3000, 10], s, "k", 0) as number; assert.ok(v % 10 === 0 && v >= 772.5 && v <= 1287.5, String(v)); assert.deepEqual([rollValue(13, ["hit_stop_ms", 0, 150, 10], s, "k", 0), rollValue(3, ["hit_stop_ms", 0, 150, 10], s, "k", 0)], [10, 3]); }
  assert.equal(rollValue(9, ["shake", 0, 3, 1], 5, "k", 0), 9); assert.equal(rollValue("2", ["shake", 0, 3, 1], 5, "k", 0), "2"); assert.deepEqual(roll(roll(fire, "shape", 5).doc, "shape", 9).doc["steps"] === roll(fire, "shape", 9).doc["steps"], false);
  const sh = stepsOf(roll(fire, "shape", 9).doc as Row)[1] ?? {}; assert.ok((sh["bend"] as number) <= -0.75 && (sh["bend"] as number) >= -1.25 && (sh["seconds"] as number) >= 0.75); assert.equal("bend" in (stepsOf(roll(fire, "shape", 9).doc as Row)[0] ?? {}), false);
});
test("E5 dice punch and colour: Punch rolls the knobs; colour picks only house ramps on steps and knob that have one; no ramps = unchanged; Fit trims an over-budget roll with its line", () => {
  const p = roll(fire, "punch", 3).doc; assert.ok((p["shake"] as number) >= 1 && (p["shake"] as number) <= 3 && (p["hit_stop_ms"] as number) >= 80 && (p["hit_stop_ms"] as number) <= 120, JSON.stringify(p));
  const ramps = ["frost", "holy"]; for (let s = 1; s < 12; s += 1) { const d = roll(fire, "colour", s, { ramps }).doc; assert.ok(ramps.includes(d["tint_ramp"] as string) && ramps.includes(stepsOf(d as Row)[0]?.["tint_ramp"] as string)); assert.equal("tint_ramp" in (stepsOf(d as Row)[1] ?? {}), false); assert.equal("tint_ramp" in (stepsOf(roll({ parts: [{ id: "c", kind: "colour", beats: ["cast"] }], steps: [st("q", { part: "c" })] }, "colour", s, { ramps }).doc as Row)[0] ?? {}), false); }
  assert.equal(roll(fire, "colour", 4).doc["tint_ramp"], "fire"); assert.ok(new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => roll(fire, "punch", s).doc["hit_stop_ms"])).size > 2);
  const trail = { parts: [{ id: "t", kind: "trail", beats: ["linger"] }], steps: [sp("t1", { part: "t" })] }; assert.deepEqual(roll(trail, "sparks", 5).doc["steps"], trail.steps);
  const big = roll({ steps: [sp("p", { particle_count: 40 }), sp("q", { particle_count: 40 })] }, "sparks", 11); assert.match(big.messages.join(), /^Scaled sparks \d+ → \d+ to fit 48/);
  assert.match(roll({ steps: [sp("p", { particle_count: 30 }), sp("q", { particle_count: 30 })] }, "sparks", 11, { preset: true }).messages.join(), /fit 32/);
});
test("E5 dice strip: newest first, no repeats, at most 6 seeds", () => {
  let list: number[] = []; for (const s of [1, 2, 3, 2, 4, 5, 6, 7]) list = pushRoll(list, s);
  assert.deepEqual(list, [7, 6, 5, 4, 2, 3]); assert.deepEqual([1, 2, 3, 2, 4].reduce<number[]>((l, x) => pushRoll(l, x), []), [4, 2, 3, 1]); assert.equal(DICE.rolls, 6); assert.deepEqual(pushRoll([], -1), [2147483647]);
});
test("E5 Breed: 2 parents give 6 children (base a/b × Mix 25/50/75), 3 give 6 (3 pairs × 25/75); fewer than 2 give none (null parents dropped, indices kept), a 4th is ignored; deterministic, distinct seeds, within budget", () => {
  const A = { id: "A", rev: 1, doc: fire }, B = { id: "B", rev: 2, doc: { connect_step: "g", shake: 1, steps: [st("g", { seconds: 0.5 }), sp("z", { particle_count: 40 })] } }, C = { id: "C", rev: 1, doc: { steps: [st("k")] } };
  const two = breed([A, B], { seed: 9, mint: mint() }); assert.deepEqual(two.map((c) => [c.parents, c.base, c.mix]), [[[0, 1], "a", 25], [[0, 1], "a", 50], [[0, 1], "a", 75], [[0, 1], "b", 25], [[0, 1], "b", 50], [[0, 1], "b", 75]]);
  assert.deepEqual(breed([A, B, C, C], { seed: 9, mint: mint() }).map((c) => [c.parents, c.mix]), [[[0, 1], 25], [[0, 1], 75], [[1, 2], 25], [[1, 2], 75], [[2, 0], 25], [[2, 0], 75]]);
  assert.deepEqual([breed([A], { seed: 9, mint: mint() }), breed([A, null], { seed: 9, mint: mint() })], [[], []]); const nb = breed([null, A, B], { seed: 9, mint: mint() }); assert.deepEqual([nb.map((c) => c.parents), nb.map((c) => c.doc)], [two.map(() => [1, 2]), two.map((c) => c.doc)]); const lines = blend(A, B, { base: "a", mix: 25, mint: mint() }).messages; assert.ok(lines.length > 0); assert.deepEqual(two[0]?.messages.slice(0, lines.length), lines); assert.deepEqual(breed([A, B], { seed: 9, mint: mint() }), two);
  assert.equal(new Set(two.map((c) => c.seed)).size, 6); assert.ok(two.every((c) => c.meter.particles.n <= 48 && c.doc["variant_seed"] === c.seed && (c.doc["steps"] as Row[]).length <= 12));
  assert.ok(two.some((c) => c.messages.some((m) => m.startsWith("Scaled sparks")))); assert.ok(breed([A, B], { seed: 9, mint: mint(), preset: true }).every((c) => c.meter.particles.n <= 32 && c.meter.particles.cap === 32));
  assert.notDeepEqual(two[0]?.doc, two[3]?.doc); assert.notDeepEqual(breed([A, B], { seed: 10, mint: mint() })[0]?.doc, two[0]?.doc);
});
test("E5 house read (CN-022): first 4 ramps minus those the style lacks; bad types are invalidValue; punch out of range seeds 0; pixel_scale by the §2.10.3.2 contract", () => {
  const r = readHouse({ effectHouse: { ramps: ["fire", "nope", "frost", "holy", "venom"], punch: 2, motes: true, pixel_scale: "4" } }, ["fire", "frost", "holy", "venom"]);
  assert.deepEqual(r, { house: { ramps: ["fire", "frost", "holy"], punch: 2, motes: true, pixel_scale: 4 }, notes: [{ code: "overCap", message: "effectHouse.ramps: 5 of 4" }] });
  assert.deepEqual(readHouse({}, []), { house: { ramps: [], punch: 0, motes: false }, notes: [] }); assert.deepEqual(readHouse({ effectHouse: [] }, []).notes, [{ code: "invalidValue", message: "effectHouse" }]);
  const bad = readHouse({ effectHouse: { ramps: [1], punch: 4, motes: "yes", pixel_scale: 7 } }, ["fire"]); assert.deepEqual(bad.house, { ramps: [], punch: 0, motes: false }); assert.deepEqual(bad.notes.map((n) => n.code + " " + n.message), ["invalidValue effectHouse.ramps", "outOfRange effectHouse.punch", "invalidValue effectHouse.motes", "outOfRange effectHouse.pixel_scale"]);
  assert.deepEqual(readHouse({ effectHouse: { punch: "2", pixel_scale: true } }, []).notes.map((n) => n.code), ["invalidValue", "invalidValue"]); assert.deepEqual(readHouse({ effectHouse: { punch: 1.5, pixel_scale: null } }, []).house, { ramps: [], punch: 0, motes: false, pixel_scale: null });
});
test("E5 house writes (Rule N / M3): a blank doc gets pixel_scale, the first ramp, the Punch row and the motes step; a new part fills only what its new steps and absent knobs lack", () => {
  const h = readHouse({ effectHouse: { ramps: ["frost"], punch: 3, motes: true } }, ["frost"]).house;
  assert.deepEqual(blankDoc(h, mint()), { pixel_scale: "match-sprite", tint_ramp: "frost", hit_stop_ms: 150, hit_white_ms: 80, squash: true, shake: 2, parts: [{ id: "p-1", kind: "sparks", beats: ["linger"] }], steps: [{ id: "s-2", kind: "particles", particle_motion: "rise", particle_count: 12, particle_life_ms: 800, particle_pull: 1000, picture: "ember", start_mode: "at-hit", tint_ramp: "frost", part: "p-1" }] });
  assert.deepEqual(blankDoc({ ramps: [], punch: 0, motes: false, pixel_scale: 2 }, mint()), { pixel_scale: 2 }); assert.deepEqual(HOUSE.punch.map((p) => (p as Row)["hit_stop_ms"] ?? 0), [0, 50, 100, 150]);
  assert.deepEqual(blankDoc({ ramps: [], punch: 1, motes: false }, mint()), { pixel_scale: "match-sprite", hit_stop_ms: 50, hit_white_ms: 40, squash: true, shake: 0 });
  const d = addPart(fire, { kind: "punch", beats: ["hit"] }, [st("old", { tint_ramp: "holy" }), st("new")], h, mint());
  assert.deepEqual([d["shake"], d["hit_stop_ms"], d["hit_white_ms"], d["squash"]], [2, 100, 80, true]); assert.deepEqual(stepsOf(d as Row).slice(0, 4), stepsOf(fire));
  assert.deepEqual(stepsOf(d as Row).slice(4), [{ id: "s-2", kind: "stamp", tint_ramp: "holy", part: "p-1" }, { id: "s-3", kind: "stamp", part: "p-1", tint_ramp: "frost" }]); assert.deepEqual((d["parts"] as Row[])[1], { kind: "punch", beats: ["hit"], id: "p-1" });
});
test("E5 dice small whole numbers (UX Q5): |v| ≤ 4 on a step-1 field moves ±1 about half the time, by the seed; never to 0, never past min/max", () => {
  for (const [v, max] of [[1, 3], [2, 3], [3, 3], [1, 48], [4, 48], [-2, 3]] as const) {
    const got = Array.from({ length: 80 }, (_, s) => rollValue(v, ["shake", v < 0 ? -3 : 0, max, 1], s + 1, "k", 0) as number), same = got.filter((x) => x === v).length;
    assert.ok(same >= 20 && same <= 60, `${v}: ${same}`); assert.ok(got.every((x) => x !== 0 && Math.abs(x - v) <= 1 && x <= max && x >= (v < 0 ? -3 : 0)), `${v}: ${got.join()}`);
    assert.deepEqual(got, Array.from({ length: 80 }, (_, s) => rollValue(v, ["shake", v < 0 ? -3 : 0, max, 1], s + 1, "k", 0)));
  }
  assert.ok([1, 2].every((v) => Array.from({ length: 20 }, (_, s) => rollValue(v, ["shake", 0, 3, 1], s + 1, "k", 0)).some((x) => x !== v))); assert.ok(Array.from({ length: 40 }, (_, s) => rollValue(3, ["shake", 0, 3, 1], s + 1, "k", 0)).includes(2));
  assert.equal(rollValue(0, ["shake", 0, 3, 1], 7, "k", 0), 0); for (let s = 1; s < 30; s += 1) { const x = rollValue(1.5, ["seconds", 0.15, 3, 0.01], s, "k", 0) as number; assert.ok(x >= 1.12 && x <= 1.88); }
});
test("E5 Breed (UX Q6): only the layers a child took are rolled (no Punch knobs without a Punch part, no colour knob without a colour step); each child gets 1–2 seeded discrete flips from a parent step with the same key", () => {
  const lg = { start_mode: "at-hit", hold_ms: 100 }, A = { id: "A", rev: 1, doc: { connect_step: "h", shake: 2, hit_stop_ms: 100, tint_ramp: "fire", steps: [st("h", { picture: "slash" }), sp("x", { picture: "ember", particle_motion: "rise" }), st("l", { picture: "smoke", ...lg })] } }, B = { id: "B", rev: 1, doc: { connect_step: "g", shake: 1, steps: [st("g", { picture: "bolt" }), sp("y", { picture: "ice", particle_motion: "burst" }), st("m", { picture: "mist", ...lg })] } };
  const kids = breed([A, B], { seed: 4, mint: mint(), ramps: ["frost", "holy"] }), plain = kids.map((c) => blend(A, B, { base: c.base, mix: c.mix, mint: mint() }).doc), keys = ["picture", "tint_ramp", "particle_motion"], pool = [A.doc, B.doc].flatMap((d) => d.steps.map((s, i) => ({ key: keyOf(d, i), s: s as Row })));
  kids.forEach((c, k) => {
    const pd = plain[k] as Row, cs = stepsOf(c.doc as Row); assert.deepEqual([c.doc["shake"], c.doc["hit_stop_ms"], c.doc["tint_ramp"]], [pd["shake"], pd["hit_stop_ms"], pd["tint_ramp"]]);
    const changed = cs.flatMap((s, i) => keys.filter((f) => s[f] !== stepsOf(pd)[i]?.[f]).map((f) => ({ i, f, v: s[f] }))); assert.equal(changed.length, 1 + (hash32(c.seed, "flip", 0, 0) & 1), JSON.stringify(changed)); assert.equal(new Set(changed.map((x) => x.i)).size, changed.length);
    assert.ok(changed.every((x) => pool.some((p) => p.key === keyOf(pd, x.i) && p.s[x.f] === x.v)), JSON.stringify(changed));
  });
  const P = { ...A, doc: { ...A.doc, parts: [{ id: "pp", kind: "punch", beats: ["hit"] }] } }; assert.ok(breed([P, B], { seed: 4, mint: mint() }).some((c) => c.doc["hit_stop_ms"] !== 100));
});
