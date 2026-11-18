import assert from "node:assert/strict";
import { test } from "node:test";
import { chunkedList, createLighting, fitView, snapCamera, type RenderScene } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { TILE } from "../../tools/play-stage/board.ts";
import { animId, litPlan, picturesOf, sourceOf } from "../../tools/play-stage/looks.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { U } from "./demo-fixture.ts";

type Match = ReturnType<typeof createMatch>;

const hook = (m: Match) => { const link = createSceneLink(sourceOf((id) => m.pixels(id))); return { link, pixels: picturesOf((id) => m.pixels(id), link) }; };
const unitOf = (m: Match, unitId: string) => { const u = m.world.units.all().find((x) => x.unitId === unitId && x.alive); if (u === undefined) throw new Error(unitId); return u; };
const fit = fitView(390 * 3, 600 * 3, 9, TILE, TILE), cam = snapCamera(0, 0, fit.s);
/** Every picture the page's draw list names (chunks and plain fills aside) must load through the page's lookup. */
const unloaded = (rs: RenderScene, pixels: ReturnType<typeof hook>["pixels"], t: number): string[] => chunkedList(rs, fit, cam, t, 10).cmds.map((c) => c.sheet).filter((id) => id !== "" && !id.startsWith("chunk:") && pixels(id) === undefined);
function cast(kind: "basic" | "spell"): { m: Match; t0: number } {
  const m = createMatch(undefined, 40), me = unitOf(m, kind === "basic" ? U.knight : U.archer), wolf = unitOf(m, U.wolf);
  m.world.units.moveTo(me.id, { c: wolf.at.c, r: wolf.at.r + (kind === "basic" ? 1 : 2) }, "move");
  m.intend({ type: "SelectUnit", unitId: me.id }); assert.equal(m.choose(kind), null);
  const at = m.aims[0] ?? wolf.at; m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); m.sync();
  return { m, t0: m.world.clock.now() };
}

test("the bundled stage has water that blocks walking, moving water tiles with shore foam, rock, and chunked ground", () => {
  const m = createMatch(), { link, pixels } = hook(m), sc = m.scene(), rs = link.scene(sc, { tMs: 0, stepMs: 10 }), ground = rs.ground[0];
  assert.ok(ground !== undefined && ground.tiles.includes(1) && ground.tiles.includes(2) && ground.tiles.includes(0));
  assert.equal(m.world.grid.isOpen({ c: 0, r: 3 }), false); assert.equal(m.world.grid.isOpen({ c: 4, r: 6 }), false);
  assert.ok(ground.motion?.[1] !== undefined, "water tiles cycle");
  const shore = rs.overlays.filter((o) => o.sheet.id.startsWith("shore~")); assert.ok(shore.length >= 1);
  for (const o of shore) assert.ok(pixels(o.sheet.id) !== undefined, "shore foam bakes");
  const cmds = chunkedList(rs, fit, cam, 0, 10).cmds;
  assert.ok(cmds.some((c) => c.sheet.startsWith("chunk:g0:")) && cmds.some((c) => c.sheet.startsWith("play:ground~m1~")), "static ground is chunked; water draws per tile");
  assert.deepEqual(unloaded(rs, pixels, 0), []); assert.deepEqual(link.notices, []);
});

test("canopy sways above units and turns see-through over a unit; braziers flicker", () => {
  const m = createMatch(), { link } = hook(m), before = link.scene(m.scene()), canopy = before.above[0];
  assert.ok(canopy !== undefined && canopy.tiles.filter((t) => t !== null).length === 3 && canopy.motion?.[0] !== undefined);
  const braziers = before.standing.filter((s) => s.kind === "object"); assert.equal(braziers.length, 2); assert.ok(braziers.every((s) => s.motion !== undefined));
  m.world.units.moveTo(unitOf(m, U.wolf).id, { c: 5, r: 2 }, "move");
  const after = link.scene(m.scene()).above[0]; assert.ok(after !== undefined);
  assert.equal(after.tiles[2 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 4], 0);
});

test("braziers light the dusk board; rock casts a shadow (sight lines); a constructor id is not a picture", () => {
  const m = createMatch(), { link, pixels } = hook(m), lighting = createLighting();
  link.scene(m.scene(), { tMs: 0, stepMs: 10 });
  const plan = litPlan(lighting, m.looks, link.lit), lit = plan.level.filter((v) => v > 0).length;
  assert.ok(m.looks.lights.length === 2 && lit > 0 && Math.max(...plan.dark) > 0, "dusk with two torches");
  const open = litPlan(createLighting(), { ...m.looks, light: { ...m.looks.light, blocks: new Uint8Array(m.looks.light.blocks.length) } }, link.lit);
  assert.ok(open.level.filter((v) => v > 0).length > lit, "rock blocks some torch light");
  assert.equal(pixels("constructor"), undefined); assert.equal(pixels("play:anim:constructor"), undefined);
});

test("units idle on a two-frame clip; a basic hit plays hit-stop, squash, hit-white and shake", () => {
  const { m, t0 } = cast("basic"), { link, pixels } = hook(m), idle = pixels(animId("starter:hero-sword"));
  assert.ok(idle !== undefined && idle.w === 2 * TILE);
  let shake = 0, white = 0, squash = 0, lag = 0, clips = 0;
  for (let t = t0; t < t0 + 600; t += 10) {
    const rs = link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    if (link.shake.x !== 0 || link.shake.y !== 0) shake += 1;
    for (const s of rs.standing) { if (s.look?.startsWith("hw:") === true) white += 1; if (s.squash === true) squash += 1; if ((s.lagMs ?? 0) > 0) lag += 1; if (s.clip?.name === "idle") clips += 1; }
    assert.deepEqual(unloaded(rs, pixels, t), []);
  }
  assert.ok(shake > 0 && white > 0 && squash > 0 && lag > 0 && clips > 0, JSON.stringify({ shake, white, squash, lag, clips }));
});

test("a spell lights the board, throws particles, animates outlined frames, flashes the target and shakes; every picture loads", () => {
  const { m, t0 } = cast("spell"), { link, pixels } = hook(m), lighting = createLighting(), quiet = litPlan(lighting, m.looks, { lights: [] });
  let lights = 0, dots = 0, white = 0, shake = 0, brighter = 0; const frames = new Set<number>(); let outlined = 0, added = 0;
  for (let t = t0; t < t0 + 900; t += 10) {
    const rs = link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    if (link.lit.lights.length > 0) { lights += 1; if (litPlan(lighting, m.looks, link.lit).level.filter((v) => v > 0).length > quiet.level.filter((v) => v > 0).length) brighter += 1; }
    for (const c of chunkedList(rs, fit, cam, t, 10).cmds) if (c.sheet.startsWith("play:fx")) { frames.add(c.sheet === "play:fx" ? c.sx / TILE : Number(/~fx(\d+)~/.exec(c.sheet)?.[1])); if (/[~|]ol#/.test(c.sheet)) outlined += 1; if (c.op === "add") added += 1; }
    dots += rs.dots?.length ?? 0; if (rs.standing.some((s) => s.look !== undefined)) white += 1; if (link.shake.x !== 0 || link.shake.y !== 0) shake += 1;
    assert.deepEqual(unloaded(rs, pixels, t), []);
  }
  assert.ok(lights > 0 && brighter > 0 && dots > 0 && white > 0 && shake > 0 && frames.size > 1 && outlined > 0 && added > 0, JSON.stringify({ lights, brighter, dots, white, shake, frames: [...frames], outlined, added }));
  assert.deepEqual(m.fx.engine.notes, []);
});
