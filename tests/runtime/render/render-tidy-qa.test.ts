// QA pin for G1 E4: a hinted motion message is `<name>: <hint>`, not the hint alone.
import assert from "node:assert/strict";
import { test } from "node:test";
import { ANIM_HINT, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";

const sheet: Sheet = { id: "grass", columns: 1, fw: 16, fh: 16 };
const motion = { scroll: { step: 2 }, cycle: { ramp: ["#112233"] } };
const world = (grass: SceneAsset): SceneWorld => ({
  cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { grass }, units: [], objects: [], overlays: [],
  layers: [{ tileset: "grass", aboveUnits: false, visible: true, tiles: [1, 2, ...Array.from({ length: 58 }, () => 1)] }],
});

test("a motion warning on a tile that already plays a clip names the owner, then the hint (QA G1 E4)", () => {
  const grass: SceneAsset = { sheet, clips: [{ name: "idle", frames: [0] }], tileProps: { "2": { anim: "idle", motion } } };
  const link = createSceneLink();
  link.scene(world(grass));
  assert.deepEqual(link.notices.map((n) => `${n.code}:${n.message}`), [`motionInvalid:grass#2: ${ANIM_HINT}`]);
});
