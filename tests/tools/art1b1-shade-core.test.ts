import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { bakeAll, bakeOne, RECIPES } from "../../tools/art-bake/bake.ts";
import { band, fbm, hash2, LIGHT, roundEven, sphere, vnoise } from "../../tools/art-bake/blocks.ts";
import { checkPalette, luma, PALETTE, rgb, stepOf } from "../../tools/art-bake/palette.ts";
import { rock } from "../../tools/art-bake/recipes/rock.ts";
import { canvasSprite, colourise, newCanvas, rect } from "../../tools/art-bake/sprite.ts";

// From the kit's ref/ref-art1b1.py: the frozen B r6b Python (recipes.py rock and lantern), r6b colourise, no haze.
const PINS = [
  { name: "rock", tile: 32, w: 29, h: 21, foot: [13, 17], sha: "dbeb8b41fae682badc801abcb03f6e7552b2b66aa93926689f7657b2a9feb215" },
  { name: "rock", tile: 48, w: 43, h: 31, foot: [20, 25], sha: "fa49fcaa67eb7fa7319f1fab4c3a9cbbc58f43cf0cdc5c5f69b5ccdd5f21f216" },
  { name: "lantern", tile: 32, w: 12, h: 32, foot: [6, 30], sha: "bb33ae6028e31e9f0b18b4f6713ec8daf3d24881db37f624a61f740ff0ffa5a9" },
  { name: "lantern", tile: 48, w: 19, h: 49, foot: [9, 45], sha: "643c5c02c77909f90338784457d730b462c414946075f8c367e7de10f27ae7f2" },
] as const;
const sha = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");

test("ART1b1 port check: the rock and lantern bake pixel for pixel the same as the B r6b Python at 32 and 48 px (shade, bias, rim, outline, glow)", () => {
  for (const pin of PINS) {
    const { sprite, sha256 } = bakeOne(pin.name, pin.tile);
    assert.equal(sha256, pin.sha, `${pin.name} at ${pin.tile}`);
    assert.deepEqual([sprite.w, sprite.h, sprite.foot], [pin.w, pin.h, pin.foot], `${pin.name} at ${pin.tile} size and foot`);
  }
  assert.equal(sha(colourise(rock(32, 3, true))), "04306148e0152c8cb10955adea9d9188e677eb5d95d6e350bec928b761ba4ec4");
  assert.equal(sha(colourise(rock(48, 3, true))), "2a91ed0aa64c61cb7dbcda855ed823039686584689f9d6b86eaef94ba86e3f4e");
});

test("ART1b1 shared blocks: hash2, vnoise, fbm and sphere equal common.py to the last bit, and rounding is half to even", () => {
  const pts = [[0.5, 0.5], [3.25, -1.75], [17.0, 9.5], [-6.4, 12.9]] as const;
  assert.deepEqual([hash2(0, 0, 0), hash2(3, -2, 1), hash2(-7, 11, 31), hash2(123, 456, 9)], [0, 0.49683130509220064, 0.5839142997283489, 0.18888358771800995]);
  assert.deepEqual(pts.map(([x, y]) => vnoise(x, y, 2.5, 4)), [0.3289607841677815, 0.523513046376884, 0.25758525890916606, 0.494276797901658]);
  assert.deepEqual(pts.map(([x, y]) => fbm(x, y, 6.0, 9)), [0.5572101567450851, 0.5081219562188636, 0.4323309533432743, 0.49556307643089154]);
  assert.deepEqual([sphere(0, 0), sphere(-0.5, -0.4), sphere(0.7, 0.6), sphere(0.3, -0.9)], [0.7799300262390673, 0.9764529825801106, 0.230011022503135, 0.7849725402528176]);
  assert.deepEqual([...LIGHT], [-0.549862551541025, -0.6198450581007918, 0.5598600524781345]);
  assert.deepEqual([roundEven(2.5), roundEven(3.5), roundEven(0.5), band(0.25, 3), band(0.75, 3), band(-1, 6), band(2, 6)], [2, 4, 0, 0, 2, 0, 5]);
});

test("ART1b1 shade pass: a glow pixel takes no outline and no rim; other pixels get the rim on a top or left edge; shade plus bias adds in float32", () => {
  const c = newCanvas(5, 3, 0, 0, 1);
  rect(c, 1, 1, 2, 2, "glow", 0.7, true);
  rect(c, 3, 1, 4, 2, "glow", 0.7);
  const px = colourise(canvasSprite(c));
  const at = (x: number, y: number): number[] => [...px.subarray((y * 5 + x) * 4, (y * 5 + x) * 4 + 4)];
  assert.deepEqual([at(1, 1), at(3, 1)], [[...stepOf("glow", 1), 255], [...stepOf("glow", 2), 255]]);
  assert.deepEqual([at(0, 1), at(1, 0), at(1, 2), at(3, 0)[3]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 255]);
  const block = newCanvas(2, 2, 0, 0, 1);
  rect(block, 0, 0, 2, 2, "stone", 0.6);
  assert.deepEqual([...colourise(canvasSprite(block)).subarray(12, 16)], [...stepOf("stone", 2), 255]);
});

test("ART1b1 manifest hash: sha256 over every sprite's RGBA bytes, in RECIPES order and then tile order, nothing else", () => {
  const dir = mkdtempSync(join(tmpdir(), "art1b1-"));
  try {
    for (const tiles of [[32], [32, 48], [48, 32]] as const) {
      bakeAll(dir, tiles);
      const all = createHash("sha256");
      for (const name of Object.keys(RECIPES)) {
        for (const tile of tiles) all.update(bakeOne(name, tile).rgba);
      }
      assert.equal((JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { hash: string }).hash, all.digest("hex"), tiles.join(","));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("ART1b1 law 12: rgb takes only #rrggbb, the palette contract throws, and a missing step has no black fallback", () => {
  for (const bad of ["#12345", "red", "#12345g", "#1234567", " #123456"]) assert.throws(() => rgb(bad), /is not #rrggbb/);
  const withRamp = (name: string, hexes: readonly string[]): Parameters<typeof checkPalette>[0] => ({ ...PALETTE, ramps: { ...PALETTE.ramps, [name]: hexes } });
  assert.throws(() => checkPalette(withRamp("none", [])), /ramp "none" has 0 steps, must be 1 to 9/);
  assert.throws(() => checkPalette(withRamp("wide", ["#111111", "#222222", "#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#aaaaaa"])), /ramp "wide" has 10 steps, must be 1 to 9/);
  assert.throws(() => checkPalette(withRamp("odd", ["#12345"])), /"#12345" is not #rrggbb/);
  assert.throws(() => checkPalette(withRamp("dup", ["#14301a", "#14301A"])), /ramp "dup" repeats colour "#14301A"/);
  assert.throws(() => checkPalette(withRamp("dim", ["#5aa052", "#14301a"])), /ramp "dim" is not strictly lighter at "#14301a"/);
  assert.throws(() => checkPalette(withRamp("flat", ["#ff0000", "#004c00"])), /ramp "flat" is not strictly lighter at "#004c00"/);
  assert.throws(() => checkPalette(withRamp("ink", ["#000000"])), /colour "#000000" is pure black or white/);
  assert.throws(() => checkPalette(withRamp("paper", ["#FFFFFF"])), /colour "#FFFFFF" is pure black or white/);
  assert.throws(() => checkPalette({ ...PALETTE, outline: { ...PALETTE.outline, colour: "#000000" } }), /colour "#000000" is pure black or white/);
  assert.throws(() => checkPalette({ ...PALETTE, outlineBy: { leaf: "#ffffff" } }), /colour "#ffffff" is pure black or white/);
  assert.throws(() => checkPalette({ ...PALETTE, outline: { ...PALETTE.outline, colour: "plum" } }), /"plum" is not #rrggbb/);
  assert.throws(() => checkPalette({ ...PALETTE, bias: { nope: 0.1 } }), /bias names "nope"/);
  assert.throws(() => checkPalette({ ...PALETTE, outlineBy: { nope: "#123456" } }), /outlineBy names "nope"/);
  assert.throws(() => stepOf("iron", 4), /ramp "iron" has no step 4/);
  assert.doesNotThrow(() => checkPalette(withRamp("near", ["#010000"])));
  assert.deepEqual([luma(rgb("#000000")), luma(rgb("#ffffff")), luma(rgb("#e86a9a")), luma(rgb("#9a6ad8")), luma(rgb("#f2eef0")), luma(rgb("#ff0000")), luma(rgb("#004c00"))], [0, 255, 136, 124, 239, 54, 54]);
  assert.deepEqual([PALETTE.ramps["fl_pink"]?.length, PALETTE.ramps["leaf"]?.length, PALETTE.rim, PALETTE.bias], [1, 9, 0.16, { steel: -0.16, stone: -0.1 }]);
  assert.equal(Object.keys(PALETTE.ramps).length, 38);
  assert.doesNotMatch(readFileSync(new URL("../../tools/art-bake/sprite.ts", import.meta.url), "utf8"), /\?\? \[0, 0, 0\]/);
});
