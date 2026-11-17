import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import { createRng } from "../../src/core/rng/index.ts";
import { createLevels, type LevelRules } from "../../src/rules/levels/index.ts";
import { CATALOGUE, GATE_DEFAULTS, TERRAIN_KNOBS, XP_LEVELS_KNOBS, TERRAIN, XP_LEVELS, createRegistry, installOne, installSetups, outOf, type BehaviourDef, type Installed, type TerrainOut } from "../../src/rules/behaviours/index.ts";
import { createWorld, snapshot } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const user = (value: unknown): { source: string; value: unknown; rev: number } => ({ source: "user", value, rev: 1 });
const v = (value: unknown): { value: unknown; rev: number } => ({ value, rev: 1 });
const codes = (i: Installed): string[] => i.notes.map((n) => `${n.code} ${n.message}`);
const gaps = (i: Installed): string[] => i.unsupported.map((u) => `${u.knob}${u.detail === undefined ? "" : ` ${u.detail}`} ${u.why}`);
const xp = (layers: Parameters<typeof installOne>[1], ctx = {}): Installed<LevelRules | null> => installOne(XP_LEVELS, layers, ctx);
const terrain = (layers: Parameters<typeof installOne>[1]): Installed<TerrainOut> => installOne(TERRAIN, layers);
const ROSTER: BehaviourDef<number> = { id: "roster-test", knobs: [{ id: "unit_hp", type: "slider", default: 9, min: 1, max: 99, step: 1, perUnit: true, l5: "hp" }], install: (k) => k.get("unit_hp") as number };
const XP_GAPS = ["xp_basic", "xp_kill_summon", "xp_contest_win", "xp_kill_neutral", "xp_kill_unit", "choice_levels", "unit_unlock_when", "unit_unlock_sides", "unit_unlock_levels", "unit_unlock_pairs"].map((k) => `${k} noCode`);

test("B1 registry: one id per behaviour and per knob, repeats throw; the catalogue slice is stamped rev 26", () => {
  const reg = createRegistry([XP_LEVELS, TERRAIN]);
  assert.deepEqual(reg.ids, ["xp-levels", "terrain"]); assert.equal(reg.get("terrain"), TERRAIN); assert.equal(reg.get("__proto__"), undefined); assert.equal(reg.get("toString"), undefined);
  assert.throws(() => createRegistry([XP_LEVELS, XP_LEVELS]), RangeError); assert.throws(() => createRegistry([{ ...ROSTER, id: "" }]), RangeError);
  assert.throws(() => createRegistry([{ ...ROSTER, knobs: [...ROSTER.knobs, ...ROSTER.knobs] }]), RangeError);
  assert.deepEqual([CATALOGUE.rev, CATALOGUE.sha.slice(0, 8), XP_LEVELS.knobs.length, TERRAIN.knobs.length], [26, "ea8b3302", 19, 10]);
});

test("B1 BTF parity: xp-levels at L0 is BTF_LEVEL_RULES and terrain at L0 is the 15 built-ins (water, lava, wall-block as confirmed); a world built from them matches the BTF one", () => {
  const x = xp({}), t = terrain({});
  assert.deepEqual(x.out, BTF_LEVEL_RULES); assert.equal(x.playable, true); assert.equal(x.knobs["xp_move"]?.layer, "L0");
  const tiles = t.out?.tiles ?? [], at = (id: string): unknown => tiles.find((s) => s.id === id);
  assert.equal(tiles.length, 15); assert.deepEqual(t.out?.terrain, { push_into_walls: false });
  assert.deepEqual([at("water"), at("lava"), at("wall-block"), at("floor")], [{ id: "water", open: false, push_can_enter: false }, { id: "lava", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false }, { id: "floor", open: true, push_can_enter: true }]);
  const pools = { player: ["guard"], wolves: ["howl"] }, base = input("stage-fixed");
  const ours = createWorld({ ...base, tiles, terrain: t.out?.terrain ?? { push_into_walls: true }, levels: { rules: x.out ?? BTF_LEVEL_RULES, pools } }), btf = createWorld({ ...base, terrain: { push_into_walls: false }, levels: { rules: BTF_LEVEL_RULES, pools } });
  assert.equal(JSON.stringify(snapshot(ours)), JSON.stringify(snapshot(btf)));
});

test("B1 layering: an army knob is L2 ?? L1 ?? L0; a default-source answer falls through; a preset answer is L1", () => {
  assert.deepEqual(xp({ answers: { xp_move: user(3) } }).knobs["xp_move"], { value: 3, layer: "L1" });
  assert.deepEqual(xp({ answers: { xp_move: user(3) }, stage: { xp_move: v(4) } }).knobs["xp_move"], { value: 4, layer: "L2" });
  const dflt = xp({ answers: { xp_move: { source: "default", rev: 2 } } }); assert.deepEqual([dflt.knobs["xp_move"], dflt.playable], [{ value: 1, layer: "L0" }, true]);
  assert.deepEqual(xp({ answers: { xp_move: { source: "preset", value: 2, rev: 1 } } }).out?.xp, { move: 2 });
  assert.deepEqual(xp({ unit: { xp_move: v(5) }, stageUnit: { xp_move: v(5) } }).knobs["xp_move"], { value: 1, layer: "L0" });
  assert.deepEqual(codes(xp({ unit: { xp_move: v(5) } })).filter((c) => !c.startsWith("knobUnsupported")), ["notPerUnit xp-levels.xp_move"]);
});

test("B1 unit stats: L4 ?? L3 ?? L2 ?? L1 ?? L0, then L5 HP = max(1, round(value × hp)); a bad multiplier is hard", () => {
  const hp = (layers: Parameters<typeof installOne>[1], ctx = {}): unknown => installOne(ROSTER, layers, ctx).out;
  assert.deepEqual([hp({}), hp({ answers: { unit_hp: user(5) } }), hp({ answers: { unit_hp: user(5) }, stage: { unit_hp: v(6) } })], [9, 5, 6]);
  assert.deepEqual([hp({ stage: { unit_hp: v(6) }, unit: { unit_hp: v(7) } }), hp({ unit: { unit_hp: v(7) }, stageUnit: { unit_hp: v(8) } })], [7, 8]);
  assert.deepEqual([hp({ stageUnit: { unit_hp: v(8) } }, { difficulty: { hp: 1.5 } }), hp({}, { difficulty: { hp: 0.01 } }), hp({}, { difficulty: { hp: 1 } }), hp({ answers: { unit_hp: user(3) } }, { difficulty: { hp: 0.5 } })], [12, 1, 9, 2]);
  for (const bad of [0, -1, Number.NaN, Infinity]) { const i = installOne(ROSTER, {}, { difficulty: { hp: bad } }); assert.deepEqual([i.playable, i.out, codes(i)], [false, null, ["invalidValue difficulty.hp for roster-test.unit_hp"]]); }
  assert.equal(installOne(ROSTER, {}).knobs["unit_hp"]?.layer, "L0");
});

test("B1 checks: a wrong type is a hard invalidValue (that layer skipped, nothing installed); out of range and off step warn and are used as is; unknown knobs warn", () => {
  const bad = xp({ answers: { xp_move: user("3") }, stage: { levels: 9 } });
  assert.deepEqual([bad.playable, bad.out, bad.unsupported], [false, null, []]);
  assert.deepEqual(codes(bad), ["invalidValue xp-levels.levels (L2)", "invalidValue xp-levels.xp_move (L1)"]); assert.deepEqual(bad.knobs["xp_move"], { value: 1, layer: "L0" });
  for (const a of [5, { value: 2 }, { source: "user", rev: 1 }, { source: "preset", rev: 1 }, { source: "x", value: 2 }, user(true)]) assert.equal(xp({ answers: { xp_move: a } }).playable, false);
  assert.equal(xp({ answers: { thresholds: user("1,1,1") } }).playable, false); assert.equal(xp({ answers: { unit_unlock_pairs: user([{ label: "x" }]) } }).playable, false);
  const far = xp({ answers: { xp_move: user(9) } }); assert.deepEqual([far.out?.xp.move, codes(far)[0]], [9, "outOfRange xp-levels.xp_move"]);
  assert.deepEqual(codes(installOne(ROSTER, { answers: { unit_hp: user(7.5) } })), ["offStep roster-test.unit_hp"]);
  const odd = xp(JSON.parse('{"answers":{"__proto__":{"source":"user","value":1},"xp_fly":{"source":"user","value":1}},"stage":{"constructor":{"value":1}}}') as object);
  assert.deepEqual(codes(odd).slice(0, 3), ["unknownKnob xp-levels.__proto__ (answers)", "unknownKnob xp-levels.xp_fly (answers)", "unknownKnob xp-levels.constructor (stage)"]); assert.equal(odd.playable, true);
});

test("B1 knobUnsupported: every active knob with no code is reported, defaults included; inactive knobs are not; each has a notice", () => {
  const x = xp({}); assert.deepEqual(gaps(x), XP_GAPS); assert.equal(codes(x).length, XP_GAPS.length);
  assert.deepEqual(x.unsupported[0], { code: "knobUnsupported", behaviour: "xp-levels", knob: "xp_basic", value: 1, layer: "L0", why: "noCode" });
  assert.equal(codes(x)[5], "knobUnsupported xp-levels.choice_levels (noCode)");
  const t = terrain({});
  assert.deepEqual(gaps(t), ["tile_types fallen.kills_on_landing value", "tile_types vines.slows_move value", "tile_types trap.trips value", "tile_types lava.kills_on_landing value", "lethal_landing_scope noCode", "wall_blocks_los noCode", "wall_blocks_shots noCode"]);
  const off = xp({ answers: { unit_unlock_when: user("never"), xp_basic: user(0) } });
  assert.deepEqual(gaps(off), XP_GAPS.filter((g) => !g.startsWith("unit_unlock_s") && !g.startsWith("unit_unlock_l") && !g.startsWith("unit_unlock_p")));
  assert.deepEqual(off.unsupported[0], { code: "knobUnsupported", behaviour: "xp-levels", knob: "xp_basic", value: 0, layer: "L1", why: "noCode" });
});

test("B1 gates: same-behaviour and named gates decide which knobs are active; pvp_kills and lanes are reported, not ignored", () => {
  const pvp = xp({ answers: { level_rule: user("pvp_kills") } });
  assert.equal(pvp.out, null); assert.equal(pvp.playable, true); assert.equal("thresholds" in pvp.knobs, false);
  assert.equal(gaps(pvp)[0], "level_rule pvp_kills levelling value"); assert.equal(gaps(pvp).includes("pvp_kills noCode"), true);
  const cards = xp({}, { gates: { "uses-menu": false, "uses-card-hand": true } });
  assert.deepEqual(cards.out, { ...BTF_LEVEL_RULES, offerLevels: [], offerSize: 1 }); assert.equal("ability_unlock_levels" in cards.knobs, false);
  assert.deepEqual(gaps(cards).filter((g) => g.startsWith("level_")), ["level_card_offer_levels noCode", "level_draw_levels noCode"]);
  assert.deepEqual(xp({}, { gates: {} }).out, BTF_LEVEL_RULES); assert.deepEqual(xp({}, { gates: { "uses-menu": "yes" } as never }).out?.offerLevels, []);
  const lanes = terrain({ stage: { lanes_enabled: v(true), lane_count: v(5) } });
  assert.deepEqual(gaps(lanes).slice(4), ["lanes_enabled lanes value", "lethal_landing_scope noCode", "wall_blocks_los noCode", "wall_blocks_shots noCode", "lane_axis noCode", "lane_count noCode", "lane_field_lanes noCode", "centre_lane noCode"]);
  assert.deepEqual(lanes.knobs["lane_count"], { value: 5, layer: "L2" });
});

test("B1 edits change the game: fewer levels trim thresholds and offers, the second table and a pick of 2 reach createLevels; bad levels are refused", () => {
  const out = xp({ answers: { levels: user(5), thresholds: user("13,10,11,12,13,10,11,12,13") }, stage: { unlock_pick_count: v(2), xp_move: v(2) } }).out;
  assert.deepEqual(out, { bar: "side", thresholds: [13, 10, 11, 12, 13], offerLevels: [1, 3, 4], offerSize: 2, xp: { move: 2 } });
  const levels = createLevels({ rules: out ?? BTF_LEVEL_RULES, pools: { player: ["a", "b", "c"] } }, createRng(1), () => undefined);
  levels.gain("player", "player", 13); assert.equal(levels.state().bars[0]?.level, 1); assert.equal(levels.offer("player")?.length, 2);
  for (const [n, msg] of [[0, "0 needs 1–9"], [10, "10 needs 1–9"], [2.5, "2.5 needs 1–9"]] as const) assert.deepEqual([xp({ answers: { levels: user(n) } }).out, gaps(xp({ answers: { levels: user(n) } }))[0]], [null, `levels ${msg} value`]);
  assert.deepEqual(gaps(xp({ answers: { xp_move: user(-1) } }))[0], "xp_move -1 is not a whole number ≥ 0 value"); assert.equal(xp({ answers: { xp_move: user(0.5) } }).out, null);
  assert.equal(xp({ answers: { unlock_pick_count: user(0) } }).out, null);
});

test("B1 terrain lists: an absent item field reads its default, a missing built-in warns and is appended, repeats and non-boolean flags are hard; push_into_walls reaches the sim", () => {
  const t = terrain({ answers: { tile_types: user([{ id: "floor", label: "F", open: false }, { id: "bog", label: "Bog", slows_move: true }]), push_into_walls: user(true) } });
  assert.deepEqual(t.out?.tiles.slice(0, 2), [{ id: "floor", open: false, push_can_enter: true }, { id: "bog", open: true, push_can_enter: true }]);
  assert.equal(t.out?.tiles.length, 16); assert.deepEqual(t.out?.terrain, { push_into_walls: true }); assert.equal(terrain({ answers: { push_into_walls: user(1) } }).playable, false);
  assert.deepEqual(codes(t).filter((c) => c.startsWith("reservedMissing")).length, 14); assert.equal(codes(t)[0], "reservedMissing terrain.tile_types fallen");
  assert.equal(gaps(t)[0], "tile_types bog.slows_move value");
  for (const list of [[{ id: "a", label: "A" }, { id: "a", label: "A" }], [{ id: "a", label: "A", open: "yes" }], [{ id: 3 }], [null], "floor"]) assert.equal(terrain({ answers: { tile_types: user(list) } }).out, null);
  const w = createWorld({ ...input("stage-fixed"), tiles: t.out?.tiles ?? [], terrain: t.out?.terrain ?? { push_into_walls: false } });
  assert.deepEqual([w.grid.isOpen({ c: 0, r: 0 }), w.grid.tileTypeAt({ c: 0, r: 0 })], [false, { id: "floor", open: false, push_can_enter: true }]);
});

test("B1 installSetups: in order; a repeat warns and is skipped; a behaviour with no code reports every answer as noBehaviour", () => {
  const reg = createRegistry([XP_LEVELS, TERRAIN]);
  const got = installSetups(reg, [{ behaviourId: "xp-levels", answers: { xp_move: user(2) } }, { behaviourId: "terrain" }, { behaviourId: "xp-levels", answers: { xp_move: user(5) } }, { behaviourId: "mana-pool", answers: { mana_start: user(6), mana_max: { source: "default", rev: 0 } } }, { behaviourId: "line-shot" }, { behaviourId: "__proto__", answers: 7 }]);
  assert.deepEqual([...got.keys()], ["xp-levels", "terrain", "mana-pool", "line-shot", "__proto__"]);
  assert.deepEqual(outOf(got, XP_LEVELS)?.xp, { move: 2 }); assert.equal(got.get("xp-levels")?.notes.at(-1)?.code, "duplicateSetup");
  assert.deepEqual(got.get("mana-pool")?.unsupported, [{ code: "knobUnsupported", behaviour: "mana-pool", knob: "mana_start", value: 6, layer: null, why: "noBehaviour" }, { code: "knobUnsupported", behaviour: "mana-pool", knob: "mana_max", value: undefined, layer: null, why: "noBehaviour" }]);
  assert.deepEqual([got.get("line-shot")?.unsupported[0]?.knob, got.get("line-shot")?.notes[0]?.message, got.get("__proto__")?.out], ["*", "line-shot.* (noBehaviour)", null]);
  assert.deepEqual(installSetups(reg, []).size, 0); assert.equal(outOf(got, TERRAIN)?.tiles.length, 15); assert.equal(outOf(new Map(), TERRAIN), null);
});

test("B1 r2 DSK rulings (setup-format r29 §2.2, §2.5, §2.6, §2.9.4): strayValue, {value, rev} layers, nullable, and no checks on inactive knobs", () => {
  const stray = { xp_move: { source: "default", value: 4, rev: 1 } }, sx = xp({ answers: stray });
  assert.deepEqual([sx.knobs["xp_move"], sx.playable, sx.out?.xp.move, codes(sx)[0], stray.xp_move.value], [{ value: 1, layer: "L0" }, true, 1, "strayValue xp-levels.xp_move", 4]);
  assert.deepEqual(xp({ answers: stray, stage: { xp_move: v(3) } }).knobs["xp_move"], { value: 3, layer: "L2" }); assert.equal(codes(xp({ answers: { xp_move: { source: "default", rev: 1 } } })).includes("strayValue xp-levels.xp_move"), false);
  const l2 = xp({ answers: { xp_move: user(2) }, stage: { xp_move: v(null) } }); assert.deepEqual([l2.playable, l2.knobs["xp_move"], codes(l2)[0]], [false, { value: 2, layer: "L1" }, "invalidValue xp-levels.xp_move (L2)"]);
  const far = xp({ stage: { xp_move: v(9) } }); assert.deepEqual([far.playable, far.out?.xp.move, codes(far)[0]], [true, 9, "outOfRange xp-levels.xp_move"]);
  const NUL: BehaviourDef<unknown> = { id: "nul", knobs: [{ id: "team_colour", type: "picker", default: null, options: ["#f00"], nullable: true }], install: (k) => k.get("team_colour") };
  assert.deepEqual([installOne(NUL, { answers: { team_colour: user("#f00") }, stage: { team_colour: v(null) } }).out, installOne(NUL, { answers: { team_colour: user(null) } }).playable], [null, true]);
  assert.deepEqual([installOne(ROSTER, { stageUnit: { unit_hp: v(null) }, unit: { unit_hp: v(4) } }).knobs["unit_hp"], installOne(ROSTER, { stageUnit: { unit_hp: { rev: 1 } } }).playable], [{ value: 4, layer: "L3" }, false]);
  const off = xp({ answers: { pvp_kills: user("x"), unit_unlock_when: user("never"), unit_unlock_sides: { source: "default", value: "both", rev: 1 } } });
  assert.deepEqual([off.playable, off.out, codes(off).filter((c) => !c.startsWith("knobUnsupported"))], [true, BTF_LEVEL_RULES, []]);
  assert.equal(xp({ answers: { level_rule: user("pvp_kills"), pvp_kills: user("x") } }).playable, false);
});

test("B1 r2 QA findings: the generated table is hash-stamped, gate defaults come from the catalogue, nothing is dropped without a warning, and a gated-off value is kept silently (§2.6)", () => {
  assert.equal(createHash("sha256").update(JSON.stringify({ gates: GATE_DEFAULTS, "xp-levels": XP_LEVELS_KNOBS, terrain: TERRAIN_KNOBS })).digest("hex"), CATALOGUE.table);
  assert.deepEqual(GATE_DEFAULTS, { "uses-card-hand": false, "uses-menu": true });
  assert.deepEqual(codes(installOne(ROSTER, { unit: { unit_atk: v(1) }, stageUnit: { x: v(1) } })), ["unknownKnob roster-test.unit_atk (unit)", "unknownKnob roster-test.x (stageUnit)"]);
  const ghost = installSetups(createRegistry([]), [{ behaviourId: "mana-pool", answers: { mana_start: user(6) }, stage: { mana_max: v(9) }, unit: {}, stageUnit: { mana_start: v(1) } }]).get("mana-pool");
  assert.deepEqual([ghost?.playable, ghost?.notes.slice(0, 3).map((n) => n.message), ghost?.notes[0]?.code], [true, ["mana-pool (answers)", "mana-pool (stage)", "mana-pool (stageUnit)"], "unknownBehaviour"]);
  const kept = { stage: { lane_count: v(5) }, answers: { lane_count: user(4) } }, lanes = terrain(kept); // §2.6: gated off, kept for when the gate turns on
  assert.deepEqual([lanes.playable, "lane_count" in lanes.knobs, codes(lanes).filter((c) => !c.startsWith("knobUnsupported")), kept], [true, false, [], { stage: { lane_count: v(5) }, answers: { lane_count: user(4) } }]);
  const odd = terrain({ answers: { tile_types: user([{ id: "floor", label: "F", glow: true }]) } });
  assert.deepEqual([odd.playable, codes(odd)[0], odd.out?.tiles[0], (odd.knobs["tile_types"]?.value as Record<string, unknown>[])[0]?.["glow"]], [true, "unknownField terrain.tile_types floor.glow", { id: "floor", open: true, push_can_enter: true }, true]);
});

test("B1 r4 QA review: a layer that is not a record warns, list items need a pattern id and a non-empty label, L5 stays finite, and the catalogue is frozen", () => {
  const bad = xp({ answers: 7, stage: "x", unit: [user(1)], stageUnit: null }); // M2
  assert.deepEqual([bad.playable, codes(bad).filter((c) => !c.startsWith("knobUnsupported")), bad.out], [true, ["unknownKnob xp-levels.* (answers)", "unknownKnob xp-levels.* (stage)", "unknownKnob xp-levels.* (unit)"], BTF_LEVEL_RULES]);
  for (const item of [{ id: "Bad Id!", label: "x" }, { id: "a".repeat(33), label: "x" }, { id: "-a", label: "x" }, { id: "bog" }, { id: "bog", label: 5 }, { id: "bog", label: "" }]) {
    const t = terrain({ answers: { tile_types: user([item]) } }); assert.deepEqual([t.playable, codes(t)[0], t.knobs["tile_types"]?.layer], [false, "invalidValue terrain.tile_types (L1)", "L0"], JSON.stringify(item)); // S1
  }
  assert.equal(terrain({ answers: { tile_types: user([{ id: "0bog_2-x", label: "x".repeat(48) }]) } }).playable, true);
  const long = terrain({ answers: { tile_types: user([{ id: "bog", label: "x".repeat(49) }]) } }); // DSK: a long label warns and is kept
  assert.deepEqual([long.playable, long.knobs["tile_types"]?.layer, codes(long).filter((c) => c.startsWith("outOfRange"))], [true, "L1", ["outOfRange terrain.tile_types bog.label"]]);
  const huge = installOne(ROSTER, { answers: { unit_hp: user(1e308) } }, { difficulty: { hp: 2 } }); // S2
  assert.deepEqual([huge.playable, huge.knobs["unit_hp"], codes(huge).includes("invalidValue roster-test.unit_hp (L5)")], [false, { value: 1e308, layer: "L1" }, true]);
  assert.throws(() => (terrain({}).knobs["tile_types"]?.value as unknown[]).push({ id: "x", label: "x" }), TypeError); // S3
  assert.throws(() => { (XP_LEVELS_KNOBS.find((k) => k.id === "xp_move") as { default: unknown }).default = 3; }, TypeError);
  assert.throws(() => { ((TERRAIN_KNOBS[0]?.default as unknown[])[0] as { open: boolean }).open = false; }, TypeError);
  assert.deepEqual([terrain({}).out?.tiles.length, terrain({}).out?.tiles[0], xp({}).out, Object.isFrozen(CATALOGUE)], [15, { id: "floor", open: true, push_can_enter: true }, BTF_LEVEL_RULES, true]);
  assert.throws(() => { (TERRAIN as { knobs: unknown }).knobs = []; }, TypeError); assert.throws(() => { (XP_LEVELS as { install: unknown }).install = () => 42; }, TypeError); // S5
  assert.deepEqual([terrain({}).out?.tiles.length, xp({}).out, TERRAIN.knobs.length, XP_LEVELS.knobs.length], [15, BTF_LEVEL_RULES, 10, 19]);
});
