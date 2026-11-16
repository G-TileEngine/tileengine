import assert from "node:assert/strict";
import { test } from "node:test";
import { fit, flatten, type Side } from "../../src/editor/effect/fit.ts";
import { blendSeed, checkParts, exportClean, fromInfo, snapMix, writeSeed } from "../../src/editor/effect/parts.ts";
import { stepTimes, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
const codes = (doc: FxDocValues): string[] => checkParts(doc).map((n) => `${n.code} ${n.message}`);
const S = (id: string, part: string, o: Record<string, unknown> = {}): Record<string, unknown> => ({ id, part, kind: "straight", seconds: 0.3, ...o });
test("E1 CN-020 checks: types invalidValue, unknown kind/beat outOfRange, nudge off the 30 ms grid offStep, > 6 overCap, a dangling step part unknownRef (kept); label optional", () => {
  const ok: FxDocValues = { parts: [{ id: "p1", kind: "sparks", beats: ["hit"] }, { id: "p2", kind: "trail", beats: ["travel", "linger"], nudge_ms: -60, label: "Tail", from: { effect: "effect_X", rev: 2 } }], steps: [S("a", "p1"), { id: "b" }] };
  assert.deepEqual(codes(ok), []); assert.deepEqual(codes({}), []); assert.deepEqual(codes({ parts: "x" }), ["invalidValue parts"]);
  assert.deepEqual(codes({ parts: [{ id: "p", kind: "glow", beats: ["hit", "nap"], nudge_ms: 45, label: 3, from: { effect: "e", rev: "2" } }, { id: "p", kind: 1, beats: [] }, 7], steps: [S("a", "zz"), S("b", "p", { part: 4 })] }), [
    "outOfRange parts[0].kind", "outOfRange parts[0].beats", "invalidValue parts[0].from", "offStep parts[0].nudge_ms", "invalidValue parts[0].label", "invalidValue parts[1].id duplicate", "invalidValue parts[1].kind", "invalidValue parts[1].beats", "invalidValue parts[2]", "unknownRef steps[0].part zz", "invalidValue steps[1].part"]);
  assert.deepEqual(codes({ parts: Array.from({ length: 7 }, (_, i) => ({ id: `p${i}`, kind: "shape", beats: ["cast"], nudge_ms: 1.5 })).slice(0, 7) })[0], "overCap parts: 7 of 6");
  assert.match(codes({ parts: [{ id: "p", kind: "shape", beats: ["cast"], nudge_ms: 1.5 }] }).join(), /outOfRange parts\[0\].nudge_ms/);
});
test("E1 provenance is info only (current / changed / removed / cycle); Export clean strips from and nothing else", () => {
  const docs: Record<string, { rev: number; doc: FxDocValues }> = { effect_A: { rev: 3, doc: {} }, effect_B: { rev: 5, doc: { parts: [{ id: "q", kind: "shape", beats: ["cast"], from: { effect: "effect_me", rev: 1 } }] } } };
  const me: FxDocValues = { parts: [{ id: "p1", kind: "sparks", beats: ["hit"], from: { effect: "effect_A", rev: 3 } }, { id: "p2", kind: "light", beats: ["hit"], from: { effect: "effect_A", rev: 2 } }, { id: "p3", kind: "punch", beats: ["hit"], from: { effect: "effect_gone", rev: 1 } }, { id: "p4", kind: "trail", beats: ["linger"], from: { effect: "effect_B", rev: 5 } }, { id: "p5", kind: "shape", beats: ["cast"], label: "keep" }], steps: [S("a", "p1")] };
  assert.deepEqual(fromInfo("effect_me", me, (id) => docs[id] ?? null).map((x) => x.state), ["current", "changed", "removed", "cycle"]);
  assert.deepEqual(codes(me), [], "provenance never warns"); const clean = exportClean(me);
  assert.doesNotMatch(JSON.stringify(clean), /"from"/); assert.deepEqual(JSON.parse(JSON.stringify(clean).replace(/,"label":"keep"/, "")).steps, me.steps); assert.equal((clean.parts as { label?: string }[])[4]?.label, "keep"); assert.equal(exportClean({ steps: [] }).parts, undefined);
});
test("E1 CN-021 writer and blend seed: 0 is written absent; the blend seed is deterministic in (A seed, B seed, Mix snap, base) and in 0…2^31−1", () => {
  assert.equal(writeSeed(0), undefined); assert.equal(writeSeed(9), 9); assert.deepEqual([snapMix(37), snapMix(38), snapMix(-5), snapMix(140)], [25, 50, 0, 100]);
  const s = blendSeed(4, 9, 50, "a"); assert.equal(blendSeed(4, 9, 50, "a"), s); assert.equal(blendSeed(4, 9, 60, "a"), s, "same snap");
  for (const other of [blendSeed(5, 9, 50, "a"), blendSeed(4, 8, 50, "a"), blendSeed(4, 9, 75, "a"), blendSeed(4, 9, 50, "b"), blendSeed(9, 4, 50, "a")]) assert.notEqual(other, s);
  for (const v of [s, blendSeed(undefined, "x", 0, "b"), blendSeed(2147483647, 2147483647, 100, "b")]) assert.ok(Number.isInteger(v) && v >= 0 && v <= 2147483647);
});
test("E1 Fit particles and lights: pro rata to 48 (32 presets), the 2 largest lights stay (ties keep the base), each with one message", () => {
  const p = (o: Record<string, unknown>): Record<string, unknown> => ({ kind: "particles", particle_count: 24, ...o }), doc: FxDocValues = { steps: [p({ light_mode: "steady", light_radius: 4 }), p({ light: "pop", light_radius: 3 }), p({ light_mode: "pop", light_radius: 3 }), { kind: "straight", light_mode: "steady", light_radius: 1 }] }, sides: Side[] = ["other", "other", "base", "base"];
  const r = fit(doc, sides), steps = r.doc.steps as Record<string, unknown>[]; assert.deepEqual(steps.map((s) => s["particle_count"]), [16, 16, 16, undefined]);
  assert.deepEqual(steps.map((s) => s["light_mode"] ?? s["light"]), ["steady", "off", "pop", "off"]); assert.equal("light" in (steps[1] ?? {}), false);
  assert.deepEqual(r.messages, ["Scaled sparks 72 → 48 to fit 48", "Kept the 2 largest lights; turned off 2"]);
  assert.deepEqual((fit(doc, sides, { preset: true }).doc.steps as Record<string, unknown>[]).map((s) => s["particle_count"]), [10, 10, 10, undefined]); assert.equal(fit(doc, sides, { preset: true }).messages[0], "Scaled sparks 72 → 30 to fit 32");
  assert.deepEqual(fit({ steps: [p({}), p({})] }, ["base", "base"]).messages, [], "under budget: untouched, silent");
});
test("E1 Fit steps: over 12 drop the lowest-weight Linger first, then trail, then spread; ties drop the non-base side; never the hit or a side's last step in a beat", () => {
  const parts = [{ id: "pc", kind: "shape", beats: ["cast"] }, { id: "ph", kind: "sparks", beats: ["hit"] }, { id: "pl", kind: "shape", beats: ["linger"] }, { id: "pt", kind: "trail", beats: ["cast"] }];
  const steps = [S("b0", "pc"), S("b1", "ph"), S("b2", "pl", { seconds: 0.15 }), S("b3", "pl"), S("o4", "pl", { seconds: 0.15 }), S("o5", "pl", { seconds: 0.15 }), S("o6", "pt"), S("o7", "pt"), S("o8", "pc", { jitter: 2 }), S("o9", "pc"), ...[10, 11, 12, 13, 14].map((i) => S(`b${i}`, "pc"))];
  const sides: Side[] = ["base", "base", "base", "base", "other", "other", "other", "other", "other", "other", "base", "base", "base", "base", "base"];
  const r = fit({ connect_step: "b1", parts, steps }, sides), ids = (r.doc.steps as Record<string, unknown>[]).map((s) => s["id"]);
  assert.equal(ids.length, 12); assert.deepEqual(steps.map((s) => s["id"]).filter((id) => !ids.includes(id)), ["b2", "o5", "o7"]);
  assert.deepEqual(r.messages, ["Trimmed 2 linger steps to fit", "Trimmed 1 trail step to fit"]);
  const spread = fit({ connect_step: "h", parts, steps: [S("h", "pl", { seconds: 0.15 }), S("l", "pl"), ...Array.from({ length: 11 }, (_, i) => S(`c${i}`, "pc", i === 4 ? { jitter: 1 } : {}))] }, []);
  assert.deepEqual((spread.doc.steps as Record<string, unknown>[]).map((s) => s["id"]).includes("h"), true); assert.deepEqual(spread.messages, ["Trimmed 1 linger step to fit"]);
  const sp = fit({ parts, steps: Array.from({ length: 13 }, (_, i) => S(`c${i}`, "pc", i === 4 ? { jitter: 1 } : {})) }, []);
  assert.deepEqual(sp.messages, ["Trimmed 1 spread step to fit"]); assert.equal((sp.doc.steps as unknown[]).length, 12); assert.equal(sp.doc["connect_step"], "c11", "the hit (last of the first 12) is pinned before a drop moves 'last'");
  const tie = fit({ connect_step: "h", parts, steps: [S("h", "ph"), S("lb1", "pl"), S("lb2", "pl"), S("lo1", "pl"), S("lo2", "pl"), ...Array.from({ length: 8 }, (_, i) => S(`c${i}`, "pc"))] }, ["base", "base", "base", "other", "other"]);
  assert.deepEqual((tie.doc.steps as Record<string, unknown>[]).map((s) => s["id"]).slice(0, 4), ["h", "lb1", "lb2", "lo1"], "a weight tie drops the non-base side (later first)");
  assert.deepEqual(fit({ parts, steps: Array.from({ length: 14 }, (_, i) => S(`c${i}`, "pc")) }, []).messages, ["Still 14 steps: steps 13+ are saved but won't play"]);
});
test("E1 flatten: one ordinary doc; base knobs and hit win; the other side lands on the base hit with fresh ids and from {effect, rev}; the seed is stored once", () => {
  const a = { id: "effect_A", rev: 3, doc: { connect: 0.5, shake: 1, parts: [{ id: "pa", kind: "shape", beats: ["cast"] }], steps: [S("a1", "pa"), S("a2", "pa")] } };
  const b = { id: "effect_B", rev: 7, doc: { shake: 3, variant_seed: 11, parts: [{ id: "pb", kind: "sparks", beats: ["hit"] }], steps: [S("b1", "pb"), { id: "b2", kind: "straight", seconds: 0.3 }] } };
  let n = 0; const mint = (p: string): string => `${p}${(n += 1)}`, r = flatten(a, b, { base: "a", mix: 40, mint }), d = r.doc, steps = d.steps as Record<string, unknown>[];
  assert.equal(d["shake"], 1); assert.equal(d["connect_step"], "a2", "the base hit is pinned, not the merged last step"); assert.equal(stepTimes(d).hitMs, 450); assert.equal(d["variant_seed"], blendSeed(undefined, 11, 50, "a"));
  assert.deepEqual(d.parts, [a.doc.parts[0], { id: "p-1", kind: "sparks", beats: ["hit"], from: { effect: "effect_B", rev: 7 } }]);
  assert.deepEqual(steps.slice(2).map((s) => [s["id"], s["start_mode"], s["start_at_ms"], s["part"]]), [["s-2", "at-time", 0, "p-1"], ["s-3", "at-time", 174, undefined]]);
  assert.deepEqual(r.messages, ["effect_B step 1 starts before 0: moved to 0"]); assert.deepEqual(checkParts(d), []);
  assert.notEqual(flatten(a, b, { base: "b", mix: 40, mint }).doc["variant_seed"], d["variant_seed"]);
  const zero = flatten({ ...a, doc: { ...a.doc, steps: [] } }, { ...b, doc: { steps: [] } }, { base: "a", mix: 0, mint }); assert.equal("variant_seed" in zero.doc, blendSeed(undefined, undefined, 0, "a") !== 0);
});
