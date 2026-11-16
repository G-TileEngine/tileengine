import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { AB, blockAt, canvasMb, createAB, hashCheck, hashPass, IDEAS, parseFlags, pool, readout, SHARED, verdict, type Hash, type Token } from "../../tools/device-page/bold.ts";
import { applyStubs, breed, BAKE, CAPS, RAMPS, createBake, fusion, lightsOf, living, particlesOf, path, stressDocs, tagMap, tiers, type Ctx } from "../../tools/device-page/bold-stubs.ts";
import { panelRows, SWATCH } from "../../tools/device-page/bold-swatch.ts";
import { build } from "../../tools/device-page/build.ts";
import { check } from "../../tools/device-page/check.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { L1 } from "../../tools/pixel-suite/fixture.ts";
const src = (rel: string): string => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8"), DP = "tools/device-page/";
const hero = { id: "a", fw: 16, fh: 16, columns: 4 }, sheet = { id: "g", fw: 16, fh: 16, columns: 4 }, clip = { name: "move-right", frames: [0, 1, 2, 3], ms: [80, 80, 80, 80] }, base = stressDocs(hero, clip);
const units = Array.from({ length: 40 }, (_, i) => ({ id: `u${i}`, at: { c: 2 + (i % 10) * 5, r: 2 + Math.floor(i / 10) * 8 } }));
const ctx = (seed: number, tMs = 1234, block = 1, ageMs = 30_000): Ctx => ({ seed, tMs, block, ageMs, units, cols: 64, rows: 64, sheet });
const TOKENS = IDEAS.map((i) => i.token);
const P = (gaps: number[]) => pool(gaps), ok = { off: P(Array(100).fill(16.7) as number[]), on: P(Array(100).fill(17.0) as number[]), canvasMb: 40, heapMb: 60, hash: "PASS" as Hash };
test("ED S0 flags: absent/empty/off are all off; exact tokens in engine order, trimmed, deduped; unknown fails closed with a notice; bad seed noticed and played as 0 (plants 1, 2)", () => {
  for (const b of [null, "", "off", " , "]) assert.deepEqual(parseFlags(b, null).on, []); assert.equal(parseFlags(null, null).present, false); assert.equal(parseFlags("off", null).present, true);
  assert.deepEqual(parseFlags(" living, breed ,,breed", "7").on, ["breed", "living"]); assert.equal(parseFlags("breed", "7").seed, 7); assert.equal(parseFlags("breed", null).seed, 0);
  const typo = parseFlags("breed,lingr6", null); assert.deepEqual(typo.on, ["breed"]); assert.deepEqual(typo.unknown, ["lingr6"]); assert.match(typo.notices.join(), /"lingr6" stays off/); assert.equal(typo.scored, false);
  for (const t of ["Breed", "linger", "off,breed"]) assert.ok(!parseFlags(t, null).on.includes("linger6") && parseFlags(t, null).notices.length > 0, t);
  for (const s of ["-1", "2147483648", "1.5", "abc", "", "1e3"]) { const f = parseFlags("breed", s); assert.equal(f.seed, 0, s); assert.match(f.notices.join(), /playing seed 0/, s); }
  assert.equal(parseFlags("breed", "2147483647").seed, 2147483647); assert.equal(parseFlags("breed,path", null).scored, false); assert.equal(parseFlags("path", null).scored, true);
});
test("ED S0 A/B: six 20 s blocks OFF, ON, OFF, ON, OFF, ON then DONE; frames pool by their block; a new run starts at OFF (plant 3)", () => {
  assert.deepEqual([0, 19_999, 20_000, 39_999, 40_000, 60_000, 80_000, 100_000, 119_999].map((t) => blockAt(t).label), ["OFF 1/6", "OFF 1/6", "ON 2/6", "ON 2/6", "OFF 3/6", "ON 4/6", "OFF 5/6", "ON 6/6", "ON 6/6"]);
  assert.equal(blockAt(0).leftS, 20); assert.equal(blockAt(25_500).leftS, 15); assert.ok(blockAt(AB.visitMs).done);
  const ab = createAB(); for (let t = 0; t < 130_000; t += 100) ab.add(t, blockAt(t).on ? 30 : 10);
  assert.ok(ab.off.every((g) => g === 10) && ab.on.every((g) => g === 30)); assert.equal(ab.off.length, 600); assert.equal(ab.on.length, 600); assert.equal(createAB().off.length, 0);
});
test("ED S0 HUD: green under budget; red for on−off p95 over the idea's ms, p95 > 18.3, a frame > 50, dropped > 1 %, canvas or heap > 160, hash FAIL; the canvas line counts the main canvas (plants 5, 6, 10)", () => {
  assert.equal(verdict({ ms: 0.5, ...ok }).red, false); assert.equal(verdict({ ms: null, ...ok, heapMb: null }).red, false);
  const red = (v: Partial<typeof ok> & { ms?: number | null }): string => verdict({ ms: 0.5, ...ok, ...v }).why.join();
  assert.match(red({ on: P(Array(100).fill(17.5) as number[]) }), /on−off p95/); assert.match(red({ ms: null, on: P(Array(100).fill(18.4) as number[]) }), /p95 > 18.3/);
  assert.match(red({ on: P([...Array(99).fill(17) as number[], 51]) }), /a frame > 50/); assert.match(red({ on: P([...Array(97).fill(16) as number[], 26, 26, 26]) }), /dropped > 1 %/);
  assert.match(red({ canvasMb: 160.1 }), /canvas > 160/); assert.match(red({ heapMb: 160.1 }), /heap > 160/); assert.match(red({ hash: "FAIL" }), /hash FAIL/); assert.equal(SHARED.mb, 160);
  assert.ok(Math.abs(canvasMb(0, 1170, 2532) - 11.3) < 0.1, "main canvas alone is 11.3 MB at 1170×2532"); assert.ok(canvasMb(160 * 1048576, 1, 1) > 160);
  const f = parseFlags("breed", "3"), text = readout({ flags: f, block: blockAt(AB.visitMs), off: ok.off, on: P(Array(100).fill(19.5) as number[]), canvasPeak: 1, heapPeak: null, hash: "PASS", hashOf: "", cap: true, lite: "off", switches: 0, extra: [] });
  assert.match(text, /^DONE/); assert.match(text, /heap MB peak n\/a/); assert.match(text, /budget RED/); assert.doesNotMatch(text, /GREEN/);
});
const sceneHash = (on: readonly Token[], seed: number, wobble = false): string[] => { const link = createSceneLink(); return hashPass((T) => { const b = blockAt(T), out = applyStubs(on, b.on, base, ctx(seed, T, b.i, T - b.i * AB.blockMs)), effects = wobble ? out.effects.map((e) => ({ ...e, pieces: e.pieces.map((q) => ({ ...q, particle_count: 1 + Math.floor(Math.random() * 23) })) })) : out.effects;
  const scene = link.scene({ cols: 64, rows: 64, tileW: 16, tileH: 16, mapSeed: 1, style: { ramps: RAMPS }, overlays: [...out.overlays], objects: [], assets: { g: { sheet }, hero: { sheet: hero, clips: [clip] } }, layers: [], units: units.map((u) => ({ ...u, sprite: "hero", offset: null, facing: "E" as const, alive: true, action: "move" })), effects: [...effects] }, { tMs: T, stepMs: 10 });
  return { standing: scene.standing, overlays: scene.overlays, dots: scene.dots, lit: link.lit, notes: out.notes }; }); };
test("ED S0 hash: two same-seed passes match for every token; a wall-noise dummy is a FAIL; flags off ignore the seed and L1 is unchanged (plants 6, 11, 12)", () => {
  const off = sceneHash([], 9).join(); for (const t of TOKENS) { const h = sceneHash([t], 9); assert.equal(hashCheck(h, sceneHash([t], 9)), "PASS", t); if (t !== "export" && t !== "react") assert.notEqual(h.join(), off, `${t} shows in the fingerprint`); }
  assert.equal(hashCheck(sceneHash(["breed"], 9, true), sceneHash(["breed"], 9, true)), "FAIL"); assert.equal(hashCheck([], []), "FAIL"); assert.equal(sceneHash([], 0).length, AB.visitMs / AB.hashEveryMs);
  assert.deepEqual(sceneHash([], 0), sceneHash([], 12345)); assert.deepEqual([...L1], ["1:150x98:04b5748d", "2:150x98:6865666d", "3:150x98:846e2223"]);
  for (const t of TOKENS) assert.equal(applyStubs([t], false, base, ctx(5)).effects, base, `${t}: OFF block is the base docs`); assert.equal(applyStubs([], true, base, ctx(5)).effects, base);
});
test("ED S0 stubs: each token changes only its own dummy; caps hold; breed/fusion stay one LiveFx per cast; living ≤ 64 and empty when off; tiers take a plain int; bake is bounded and byte-equal (plants 1, 8, 9)", () => {
  const sig = (t: Token): string => JSON.stringify(applyStubs([t], true, base, ctx(5)));
  const sigs = TOKENS.map(sig); assert.equal(new Set(sigs).size, TOKENS.length, "each token has its own dummy"); assert.equal(sig("export"), JSON.stringify(applyStubs([], true, base, ctx(5))));
  for (const t of TOKENS) for (const s of [0, 1, 77]) { const out = applyStubs([t], true, base, ctx(s, 3000 + s)); assert.ok(out.effects.length <= base.length && new Set(out.effects.map((e) => e.id)).size === out.effects.length, t);
    for (const e of out.effects) { assert.ok(particlesOf(e) <= CAPS.particles && lightsOf(e) <= CAPS.lights && e.pieces.length <= CAPS.steps, `${t} ${e.id}`); assert.ok(e.target !== undefined, "hits stay on a unit"); } }
  const b = breed(base, ctx(3), []); assert.equal(b.kids.length, 6); assert.equal(b.effects.length, 4); assert.ok(b.kids.every((k) => particlesOf(k) <= 48 && lightsOf(k) <= 2));
  const fz = fusion(base, ctx(3), []); assert.equal(fz.length, 3); assert.ok(fz.some((e) => e.id === "e0+e1") && !fz.some((e) => e.id === "e0" || e.id === "e1"));
  for (const age of [0, 5000, 60_000, 1e9]) assert.ok(living(base, ctx(4, 0, 1, age)).length <= 64); assert.equal(living(base, ctx(4, 0, 1, 1e9)).length, 64); assert.equal(applyStubs(["living"], false, base, ctx(4)).overlays.length, 0);
  assert.equal(tagMap(64, 64, 1).length, 4096); assert.equal(path(base, ctx(2)).pts.length, 16); assert.ok(path(base, ctx(2)).pts.every((p) => Number.isInteger(p.dc * 8) && Number.isInteger(p.dr * 8)));
  for (const bad of [1.5, -1, 3, Number.NaN]) assert.throws(() => tiers(base, bad), /plain int/); assert.ok(tiers(base, 2).every((e) => particlesOf(e) <= 48 && (e.shake ?? 0) <= 3 && (e.hit_stop_ms ?? 0) <= 150));
  assert.ok(applyStubs(["rhythm"], true, base, ctx(8)).effects.every((e) => e.pieces.every((p) => p.at % 30 === 0)));
  const k = createBake(); for (let i = 0; i < BAKE.frames * 2; i += 1) k.step(6, base[0], true); assert.ok(k.equal && k.peakMb > 0 && k.peakMb < 160, String(k.peakMb)); k.step(6, base[0], false); assert.equal(k.mb, 0, "released when off");
});
test("ED S0 law: no timers, wall time, Math.random or second rAF loop in the harness and dummies; the page keeps its one host wrapper and one start kick; stubs read no stat names and no src/fx (plants 4, 7, 12)", () => {
  for (const f of ["bold.ts", "bold-stubs.ts", "bold-swatch.ts"]) { const s = src(DP + f); assert.doesNotMatch(s, /\b(setInterval|setTimeout|requestAnimationFrame|Date\.now|new Date|performance\.now|Math\.random)\b/, f); assert.doesNotMatch(s, /\b(hp|mana|cost)\b|src\/fx/i, f); }
  const page = src(`${DP}page.ts`); assert.equal(page.match(/requestAnimationFrame\(/g)?.length, 2, "the env wrapper's window call and the one-shot start kick only"); assert.doesNotMatch(page, /setInterval|setTimeout|Math\.random|createClock\(\).*createClock\(/);
  assert.equal(page.match(/createClock\(/g)?.length, 1); assert.equal(page.match(/createDriver\(/g)?.length, 1); assert.match(page, /canvasMb\(driver\?\.backend\.stats\.bytes \?\? 0, canvas\.width, canvas\.height\)/);
});
test("ED S0 export audit and swatch hook: the gh-pages tree is the page and what it loads (no editor, devtools, tests, fixtures, maps); the approved stops equal UX's ramps.json copy", () => {
  const dir = mkdtempSync(join(tmpdir(), "eds0-")), out = join(dir, "device-page");
  try { const names = Object.keys((JSON.parse(build(out, "0".repeat(40))) as { files: Record<string, string> }).files); assert.deepEqual(check(out).filter((p) => !p.includes("not the checked-out")), []);
    for (const n of ["tools/device-page/bold.js", "tools/device-page/bold-stubs.js", "tools/device-page/bold-swatch.js"]) assert.ok(names.includes(n), n);
    assert.ok(!names.some((n) => /^(tests|handoff|handback|ux|docs)\/|src\/editor|effect-designer|devtools|\.map$|\.json$|serve|build|check/.test(n)), names.join());
    for (const f of readdirSync(out, { recursive: true }).map(String).filter((n) => n.endsWith(".js"))) assert.doesNotMatch(readFileSync(join(out, f), "utf8"), /DebugPort|@te\/devtools/, f);
  } finally { rmSync(dir, { recursive: true }); }
  const ux = (JSON.parse(src("tests/fixtures/ed-s0/ramps.json")) as { styles: Record<string, { effectRamps: Record<string, string[]> }> }).styles;
  assert.deepEqual(SWATCH.styles["btf-ashroad@3"], ux["btf-ashroad"]?.effectRamps); assert.deepEqual(SWATCH.styles["btf-moonlit@4"], ux["btf-moonlit"]?.effectRamps); assert.match(SWATCH.status, /^approved 2026-11-16, style ids btf-ashroad@3 \/ btf-moonlit@4 \(pending engine data\)$/);
  assert.equal(panelRows().length, 8); assert.ok(panelRows().every((r) => r.stops.length === 6));
});
