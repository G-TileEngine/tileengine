import assert from "node:assert/strict";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { TILE } from "../../tools/play-stage/board.ts"; import { bundledDocs } from "../../tools/play-stage/project.ts";
import { createCam } from "../../tools/play-stage/camera-touch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
const named = bundledDocs().recipes;
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && named?.[u.unitId]?.name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && named?.[u.unitId]?.name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
function rig(moveMs = 40) {
  const m = createMatch(undefined, moveMs), cam = createCam(12), box = () => ({ devW: 1170, devH: 1992, kx: 3, ky: 3, cols: m.world.grid.cols, rows: m.world.grid.rows }), touch = createTouch({ match: m, cam, box });
  let t = 1000, n = 1;
  const screen = (c: number, r: number) => { const b = box(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); return { x: (((c + 0.5) * TILE - cam.x) * f.s + f.padX) / b.kx, y: (((r + 0.5) * TILE - cam.y) * f.s + f.padY) / b.ky }; };
  const ev = (id: number, x: number, y: number, time: number): TouchEv => ({ id, offsetX: x, offsetY: y, clientX: x, clientY: y, timeStamp: time, pointerType: "touch" });
  const tap = (c: number, r: number, gap = 80) => { const p = screen(c, r), id = n++; touch.down(ev(id, p.x, p.y, t)); touch.up(ev(id, p.x, p.y, t + 16)); t += gap; };
  return { m, cam, touch, screen, tap, land: () => { m.world.clock.advance(500); m.sync(); }, ev, nid: () => n++, now: () => t, bump: (dt: number) => { t += dt; } };
}
test("touch: one tap selects the knight and one tap on a reach cell walks", () => {
  const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8); assert.equal(g.m.selected, knight);
  const dest = g.m.reach[0]; assert.ok(dest !== undefined); g.tap(dest.c, dest.r); assert.equal(g.m.world.phases.battle, "moving");
  g.land(); assert.equal(g.m.world.phases.battle, "actMenu"); assert.equal(g.m.world.units.get(knight)?.at.c, dest.c); assert.equal(g.m.world.units.get(knight)?.at.r, dest.r);
});
test("touch: Attack then one tap on the wolf hits it", () => {
  const g = rig(), knight = idOf(g.m, "knight"); assert.equal(g.m.world.units.moveTo(knight, { c: 2, r: 1 }, "move").ok, true);
  const wolf = wolfTo(g.m, 2, 0), before = hpOf(g.m, wolf), n0 = logs(g.m); g.tap(2, 1); assert.equal(g.m.choose("basic"), null); g.tap(2, 0);
  assert.ok(hpOf(g.m, wolf) < before); assert.equal(g.m.world.phases.battle, "idle"); assert.ok(g.m.done.has(knight)); assert.equal(logs(g.m), n0 + 1);
});
test("touch: Talk opens the panel through the match layer; Close spends the action", () => {
  const g = rig(), knight = idOf(g.m, "knight"); assert.equal(g.m.world.units.moveTo(idOf(g.m, "villager"), { c: 0, r: 7 }, "move").ok, true);
  g.tap(0, 8); assert.equal(g.m.choose("talk"), null); g.tap(0, 7); assert.deepEqual(g.m.talk, { name: "Villager", text: "Hello, traveler." });
  g.tap(1, 8); assert.equal(g.m.selected, knight); assert.deepEqual(g.m.talk, { name: "Villager", text: "Hello, traveler." });
  g.m.closeTalk(); assert.equal(g.m.talk, null); assert.equal(g.m.world.phases.battle, "idle"); assert.ok(g.m.done.has(knight));
});
test("touch: after a move, tapping the archer switches with an implicit Wait", () => {
  const g = rig(), knight = idOf(g.m, "knight"), archer = idOf(g.m, "archer"); g.tap(0, 8); g.tap(0, 7); g.land();
  assert.equal(g.m.world.phases.battle, "actMenu"); g.tap(1, 8); assert.equal(g.m.selected, archer); assert.equal(g.m.world.phases.battle, "unitSelected"); assert.ok(g.m.done.has(knight));
  const k = g.m.world.units.get(knight); assert.ok(k !== undefined); g.tap(k.at.c, k.at.r); assert.equal(g.m.selected, archer);
});
test("touch: pan then tap selects the unit under the finger", () => {
  const g = rig(), mx = 40 / 3, my = 1900 / 3, t0 = g.now(), a = g.nid(), b = g.nid();
  g.touch.down(g.ev(a, mx - 10, my, t0)); g.touch.down(g.ev(b, mx + 10, my, t0 + 5)); g.touch.move(g.ev(a, mx - 20, my, t0 + 10)); g.touch.move(g.ev(b, mx + 20, my, t0 + 15));
  g.touch.up(g.ev(a, mx - 20, my, t0 + 20)); g.touch.up(g.ev(b, mx + 20, my, t0 + 25)); assert.equal(g.cam.s, 18); assert.ok(g.cam.x <= 2); assert.equal(g.cam.y, 34);
  const x0 = g.cam.x, id = g.nid(); g.touch.down(g.ev(id, 180, 400, g.now() + 30)); g.touch.move(g.ev(id, 60, 400, g.now() + 40)); g.touch.up(g.ev(id, 60, 400, g.now() + 50));
  assert.ok(Math.abs(g.cam.x - x0 - 20) <= 0.01); assert.equal(g.cam.y, 34); const p = g.screen(1, 8); g.bump(80); g.tap(1, 8); assert.equal(g.m.selected, idOf(g.m, "archer"));
  const hit = g.touch.hit(p.x, p.y), f = fitView(1170, 1992, g.cam.s, TILE, TILE); assert.equal(Math.floor(hit.x / TILE), 1); assert.equal(Math.floor(hit.y / TILE), 8);
  assert.ok(Math.floor(((p.x * 3 - f.padX) / f.s) / TILE) !== 1 || Math.floor(((p.y * 3 - f.padY) / f.s) / TILE) !== 8);
});
test("touch: pinch sends cancel, fires no tap, and the next tap works", () => {
  const g = rig(), s0 = g.cam.s, t0 = g.now(), a = g.nid(), b = g.nid();
  g.touch.down(g.ev(a, 200, 80, t0)); g.touch.down(g.ev(b, 240, 80, t0 + 5)); g.touch.move(g.ev(a, 160, 80, t0 + 10)); g.touch.move(g.ev(b, 280, 80, t0 + 15));
  g.touch.up(g.ev(a, 160, 80, t0 + 20)); g.touch.up(g.ev(b, 280, 80, t0 + 25)); assert.ok(g.cam.s > s0); assert.equal(g.m.selected, null);
  g.bump(40); g.tap(0, 8); assert.equal(g.m.selected, idOf(g.m, "knight"));
});
test("touch: a quick double tap never wedges input", () => {
  const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8, 60); g.tap(0, 8, 60); g.tap(0, 7); g.land();
  assert.equal(g.m.world.units.get(knight)?.at.r, 7); assert.equal(g.m.world.phases.battle, "actMenu"); const wolf = wolfTo(g.m, 0, 6), n0 = logs(g.m);
  assert.equal(g.m.choose("basic"), null); g.tap(0, 6, 60); g.tap(0, 6, 60); assert.equal(logs(g.m), n0 + 1); assert.ok(hpOf(g.m, wolf) >= 0);
});
test("touch: End Turn clears targeting, actMenu and unitSelected, runs the wolves and returns", () => {
  for (const phase of ["unitSelected", "actMenu", "targeting"] as const) {
    const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8); if (phase !== "unitSelected") { g.tap(0, 7); g.land(); }
    if (phase === "targeting") { wolfTo(g.m, 0, 6); assert.equal(g.m.choose("basic"), null); }
    g.m.endTurn(); for (let i = 0; i < 40 && g.m.side !== "player"; i += 1) { g.m.world.clock.advance(40); g.m.sync(); }
    assert.equal(g.m.side, "player"); assert.equal(g.m.world.phases.battle, "idle"); assert.equal(g.m.done.size, 0); assert.equal(g.m.aims.length, 0); assert.equal(g.m.talk, null);
    const at = g.m.world.units.get(knight); assert.ok(at?.alive); g.tap(at.at.c, at.at.r); assert.equal(g.m.selected, knight);
  }
});
test("touch: no targets means no target mode; an off-target tap cancels back to Selected; unit keys are safe", () => {
  const g = rig(); g.tap(0, 8); assert.equal(g.m.choose("basic"), "noTarget"); assert.equal(g.m.world.phases.battle, "unitSelected");
  wolfTo(g.m, 0, 7); assert.equal(g.m.choose("basic"), null); g.tap(5, 8); assert.equal(g.m.world.phases.battle, "unitSelected"); assert.equal(g.m.aims.length, 0);
  const g2 = rig(); g2.tap(0, 8); g2.tap(0, 7); g2.land(); wolfTo(g2.m, 0, 6); assert.equal(g2.m.choose("basic"), null); g2.tap(5, 8);
  assert.equal(g2.m.world.phases.battle, "actMenu"); assert.equal(g2.m.aims.length, 0);
  const snap = [g2.m.world.phases.battle, g2.m.selected, g2.m.aims.length, g2.m.done.size, g2.m.talk] as const;
  assert.doesNotThrow(() => { g2.m.feed({ type: "SelectUnit", unitId: "constructor" }); g2.m.feed({ type: "SelectUnit", unitId: "__proto__" }); });
  assert.deepEqual([g2.m.world.phases.battle, g2.m.selected, g2.m.aims.length, g2.m.done.size, g2.m.talk], [...snap]);
});
