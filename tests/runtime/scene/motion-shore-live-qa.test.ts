import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, fitView, snapCamera, type Pixels } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const source = (_id: string, _f: number, fw: number, fh: number): Pixels => ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4).map((_, i) => (i >> 2) % 251) });

test("tiles share one motion clock: sway and scroll tiles of one kind show the same pose in every column (ruling 1, QA 33i A/B)", () => {
  for (const motion of [{ sway: { trunkFrom: 8 } }, { scroll: { step: 1 } }]) {
    const link = createSceneLink(source), w: SceneWorld = { cols: 6, rows: 1, tileW: 16, tileH: 16, mapSeed: 3, assets: { g: { sheet: { id: "g", columns: 4, fw: 16, fh: 16 }, tileProps: { "1": { motion } } } }, layers: [{ tileset: "g", aboveUnits: false, visible: true, tiles: [1, 1, 1, 1, 1, 1] }], units: [], objects: [], overlays: [] };
    for (const t of [0, 400, 800, 1200]) {
      const cmds = buildDrawList(link.scene(w, { tMs: t, stepMs: 10 }), fitView(96, 16, 1, 16, 16), snapCamera(0, 0, 1), t, 10).cmds;
      assert.deepEqual([cmds.length, new Set(cmds.map((c) => c.sx)).size], [6, 1], `${Object.keys(motion)[0]} at ${t} ms`); } }
});

test("an object whose asset has clips still sways when sway is on; with sway off (objects[].motion null) it stays static, with no ANIM hint (EA ruling 2 on 33i A/B, QA 33i A/B)", () => {
  const tree: SceneAsset = { sheet: { id: "tree", columns: 2, fw: 16, fh: 32 }, clips: [{ name: "chop", frames: [0, 1] }], motion: { sway: { trunkFrom: 24 } } };
  const run = (motion?: null): { ids: string[]; sx: number[]; notes: string[] } => { const link = createSceneLink(source), w: SceneWorld = { cols: 4, rows: 3, tileW: 16, tileH: 16, mapSeed: 3, assets: { tree }, layers: [], units: [], objects: [{ assetId: "tree", at: { c: 1, r: 2 }, ...(motion === null ? { motion } : {}) }], overlays: [] };
    const cmds = [0, 400].map((t) => buildDrawList(link.scene(w, { tMs: t, stepMs: 10 }), fitView(64, 48, 1, 16, 16), snapCamera(0, 0, 1), t, 10).cmds[0]); return { ids: cmds.map((c) => c?.sheet ?? ""), sx: cmds.map((c) => c?.sx ?? -1), notes: link.notices.map((n) => n.code) }; };
  const on = run(), off = run(null);
  assert.deepEqual([on.ids.every((id) => id.startsWith("tree~m0~")), on.sx[0] !== on.sx[1], on.notes], [true, true, []]);
  assert.deepEqual([off.ids, off.sx[0] === off.sx[1], off.notes], [["tree", "tree"], true, []]);
});
