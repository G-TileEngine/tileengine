import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildDrawList, createFxLive, fitView, footAt, lookBox, lookPixels, recolour, rgbOf, snapCamera, type FxPiece, type LiveFx, type Pixels, type RenderScene, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { build } from "../../../tools/device-page/build.ts";

const SRC = new URL("../../../src/runtime/", import.meta.url).pathname, fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(0, 0, 1);
const files = (dir: string): string[] => readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(".ts")).map((e) => join(e.parentPath, e.name));
const scene = (over: Partial<RenderScene>): RenderScene => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [], overlays: [], ...over });
const list = (sc: RenderScene, tMs = 0) => buildDrawList(sc, fit, cam, tMs, 10);
const hero: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 };
const world = (over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: {}, layers: [], units: [], objects: [], overlays: [], ...over });

test("item 4: the tile-foot maths lives only in footAt (frames.ts); px rounds the half tile (G1)", () => {
  for (const f of files(SRC)) if (!f.endsWith("render/frames.ts")) { const s = readFileSync(f, "utf8"); assert.doesNotMatch(s, /tileW\s*\/\s*2/, f); assert.doesNotMatch(s, /\.?\br\s*\+\s*1\)\s*\*/, f); }
  assert.deepEqual([footAt(2, 3, 16, 16, 1, -2), footAt(1, 0, 15, 10), footAt(0, 0, 16, 16, undefined, 4)], [{ x: 41, y: 62 }, { x: 23, y: 10 }, { x: 8, y: 20 }]);
  const live = createFxLive(), g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }, slash: Sheet = { id: "slash", columns: 1, fw: 8, fh: 8 };
  const atUnit = (d: { dx?: number; dy?: number }) => live.unit({ kind: "unit", key: "a", sheet: hero, c: 2, r: 2, ...d }, "E", undefined, 50, g);
  const air: FxPiece = { at: 0, ms: 400, sheet: slash, draw_layer: "air", anchor_point: "foot", attach: "follow" }, lit: FxPiece = { ...air, draw_layer: "front-unit", light_mode: "steady", light_radius: 1 };
  const fx = (p: FxPiece): LiveFx => ({ id: "e", castMs: 0, caster: "a", pieces: [p] });
  assert.deepEqual([createFxLive().frame([fx(air)], () => atUnit({}), 0, 50, g).overlays[0]?.x, createFxLive().frame([fx(air)], () => atUnit({ dx: 16 }), 0, 50, g).overlays[0]?.x], [36, 52]);
  assert.deepEqual([createFxLive().frame([fx(lit)], () => atUnit({}), 0, 50, g).lit.lights[0]?.y, createFxLive().frame([fx(lit)], () => atUnit({ dy: 16 }), 0, 50, g).lit.lights[0]?.y], [44, 60]);
});

test("item 5: lookBox is the one reader of look geometry; the draw list's box and look id come from it (G1)", () => {
  assert.deepEqual([lookBox(8, 4, "r4|ol#000000"), lookBox(8, 4, "ol#000000"), lookBox(8, 4, "hw:white")], [{ w: 11, h: 11, ox: 1.5, oy: 3.5 }, { w: 10, h: 6, ox: 1, oy: 1 }, { w: 8, h: 4, ox: 0, oy: 0 }]);
  const dl = readFileSync(join(SRC, "render/draw-list.ts"), "utf8"); assert.doesNotMatch(dl, /hypot|~fx|ol#/);
  const st: Standing = { kind: "object", sheet: { id: "rock", columns: 1, fw: 8, fh: 4 }, c: 2, r: 2, look: "r4|ol#000000" }, cmd = list(scene({ standing: [st] })).cmds[0];
  assert.deepEqual([cmd?.sheet, cmd?.sw, cmd?.sh, cmd?.dx, cmd?.dy], ["rock~fx0~8x4~r4|ol#000000", 11, 11, 35, 41]);
});

test("item 6: LiveOut has no holds field; the scene link owns holds (G1)", () => {
  const out = createFxLive().frame([], () => null, 0, 10, { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 1 });
  assert.equal("holds" in out, false);
});

test("item 7: #rgb reads as #rrggbb for hit-white, outline and dot colours; other lengths stay unread (G1)", () => {
  assert.deepEqual([rgbOf("#f00"), rgbOf("#F0a"), rgbOf("#ff0000"), rgbOf("#ff00"), rgbOf("f00")], [[255, 0, 0], [255, 0, 170], [255, 0, 0], null, null]);
  const px: Pixels = { w: 2, h: 1, data: new Uint8ClampedArray([9, 9, 9, 255, 0, 0, 0, 0]) };
  assert.deepEqual(recolour(px, "#f00", undefined), recolour(px, "#ff0000", undefined));
  const src = (): Pixels => px; assert.deepEqual(lookPixels("s~fx0~2x1~ol#0f0", src, undefined), lookPixels("s~fx0~2x1~ol#00ff00", src, undefined));
  assert.equal(list(scene({ dots: [{ band: "fxAir", x: 10, y: 10, size: 1, colour: "#f00", alpha: 0.5 }] })).cmds[0]?.colour, "rgba(255,0,0,0.5)");
});

test("item 8: clip and motion warnings name the asset id (and the sheet id when it differs), a tile's own motion names the tile (G1)", () => {
  const s: Sheet = { id: "s", columns: 1, fw: 16, fh: 16 }, motion = { scroll: { step: 2 }, cycle: { ramp: ["#112233"] } };
  const two = createSceneLink(); two.scene(world({ assets: { a: { sheet: s, clips: [{ name: "x", frames: [0], fps: 0 }] }, b: { sheet: s, clips: [{ name: "y", frames: [0], fps: 0 }] } } }));
  assert.deepEqual(two.notices.map((n) => `${n.code}:${n.message}`), ["clipFpsInvalid:a (sheet s)", "clipFpsInvalid:b (sheet s)"]);
  const mo = createSceneLink(); mo.scene(world({ assets: { a: { sheet: s, motion }, b: { sheet: s, motion } }, objects: [{ assetId: "a", at: { c: 1, r: 1 } }, { assetId: "b", at: { c: 2, r: 1 } }] }));
  assert.deepEqual(mo.notices.map((n) => `${n.code}:${n.message}`), ["motionInvalid:a (sheet s)", "motionInvalid:b (sheet s)"]);
  const grass: SceneAsset = { sheet: { ...s, id: "grass" }, tileProps: { "2": { motion } } }, tl = createSceneLink();
  tl.scene(world({ assets: { grass }, layers: [{ tileset: "grass", aboveUnits: false, visible: true, tiles: [1, 2, ...Array.from({ length: 58 }, () => 1)] }] }));
  assert.deepEqual(tl.notices.map((n) => `${n.code}:${n.message}`), ["motionInvalid:grass#2"]);
});

test("item 9: the hit-white edge and the effect wake reach scene.dueMs and the draw list's dueMs; a scene with no effect has none (G1)", () => {
  const atk = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, piece: FxPiece = { at: 0, ms: 10, sheet: { id: "slash", columns: 1, fw: 8, fh: 8 }, draw_layer: "air" };
  const unit = (id: string, c: number) => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E" as const, alive: true, action: "atk" });
  const fx: LiveFx = { id: "e", castMs: 1000, caster: "a", target: "b", hit_white_ms: 100, pieces: [piece] };
  const w = world({ assets: { hero: { sheet: hero, clips: [atk] } }, units: [unit("a", 2), unit("b", 4)], effects: [fx] }), link = createSceneLink(), at = (tMs: number) => ({ tMs, stepMs: 10 });
  const look = (t: number): string | undefined => link.scene(w, at(t)).standing.find((st) => st.key === "b")?.look;
  assert.equal(link.scene(w, at(1000)).dueMs, 1020); assert.equal(link.scene(w, at(1100)).dueMs, 1320); assert.equal(look(1319), undefined); assert.equal(look(1320), "hw:white");
  const on = link.scene(w, at(1350)); assert.equal(on.dueMs, 1410); assert.equal(list(on, 1350).dueMs <= 1410, true); assert.equal(look(1409), "hw:white"); assert.equal(look(1410), undefined);
  assert.equal("dueMs" in link.scene(w, at(1500)), false); assert.equal("dueMs" in createSceneLink().scene(world(), at(0)), false);
  assert.equal(list(scene({ dueMs: 5 })).dueMs, 5);
  const lit = world({ ...w, effects: [{ ...fx, pieces: [{ ...piece, ms: 2000, light_mode: "steady" }] }] }), gate = createSceneLink(); gate.scene(lit, at(1100));
  const off = gate.scene({ ...lit, effects: [] }, at(1150)); assert.equal(off.dueMs, 1200); assert.equal("dueMs" in gate.scene({ ...lit, effects: [] }, at(1200)), false);
  assert.equal("dueMs" in createSceneLink().scene({ ...w, effects: [{ ...fx, hit_white_ms: 0 }] }, at(1100)), false);
  const frac = createSceneLink(), fw = world({ ...w, effects: [{ ...fx, hit_white_ms: 110.1 }] });
  assert.equal(frac.scene(fw, at(1350)).dueMs, 1440); assert.equal(frac.scene(fw, at(1410)).standing.find((st) => st.key === "b")?.look, "hw:white"); assert.equal("dueMs" in frac.scene(fw, at(1440)), false);
});

test("seam 33: a dot partly on screen draws until it is fully off screen (G1)", () => {
  const dot = (x: number, y: number) => ({ band: "fxAir" as const, x, y, size: 2, colour: "#ffffff", alpha: 1 });
  const rects = list(scene({ dots: [dot(-1, 10), dot(10, -1), dot(-2, 10), dot(10, -2), dot(fit.artW + 1, 10), dot(fit.artW - 1, 10)] })).cmds[0]?.rects ?? [];
  assert.deepEqual(rects, [-1, 10, 2, 2, 10, -1, 2, 2, fit.artW - 1, 10, 2, 2]);
});

test("item 45: a tall object covers a unit on the row above inside its art, a unit below or to the right draws after it, and in one cell the object draws first (G1)", () => {
  const tall: Standing = { kind: "object", sheet: { id: "tower", columns: 1, fw: 32, fh: 48 }, c: 2, r: 4 }, u = (c: number, r: number): Standing => ({ kind: "unit", sheet: hero, c, r, key: `u${c}${r}` });
  const order = (st: Standing[]): string[] => list(scene({ standing: st })).cmds.map((c) => c.sheet === "tower" ? "T" : "u");
  assert.deepEqual([order([tall, u(2, 3)]), order([tall, u(3, 3)]), order([u(2, 5), tall]), order([u(3, 4), tall]), order([u(2, 4), tall])], [["u", "T"], ["u", "T"], ["T", "u"], ["T", "u"], ["T", "u"]]);
  assert.deepEqual(order([tall, { ...u(2, 3), dy: 16 }]), ["T", "u"]);
});

test("carry: the gh-pages build lists only index.html, src/, tools/device-page/ and the two pixel-suite files the page imports (G1)", () => {
  const dir = mkdtempSync(join(tmpdir(), "g1-page-"));
  try { const names = Object.keys((JSON.parse(build(join(dir, "out"), "0".repeat(40))) as { files: Record<string, string> }).files); assert.ok(names.includes("tools/device-page/page.js") && names.some((n) => n.startsWith("src/")));
    assert.deepEqual(names.filter((n) => !(n === "index.html" || n === "tools/pixel-suite/fixture.js" || n === "tools/pixel-suite/l2.js" || n.startsWith("src/") || n.startsWith("tools/device-page/"))), []); } finally { rmSync(dir, { recursive: true }); }
});
