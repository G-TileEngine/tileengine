import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { bakeAll, bakeOne, DEFAULT_TILES, RECIPES } from "../../tools/art-bake/bake.ts";
import { PALETTE, ramp, rgb } from "../../tools/art-bake/palette.ts";
import { encodePng } from "../../tools/art-bake/png.ts";
import { colourise, gridSprite, newGrid, put } from "../../tools/art-bake/sprite.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const RIG = join(root, "tools/art-bake");

// sha256 of the RGBA pixels from the B r6b Python recipe (b-r6/style_b6.py crate6, colourised by the
// r6b chain without the scene's far-depth haze), made by the kit's ref/ref-art1a.py.
const PINS = [
  { name: "crate", tile: 32, w: 19, h: 27, foot: [10, 26], sha: "99ef690d60bf8dab906d85236e4a11001152a39445fd2cae787e03fab0fbcc88" },
  { name: "crate", tile: 48, w: 27, h: 40, foot: [14, 39], sha: "97047142d2bc1409abb3bd50d5442c5f5c5b522d7bca9c727e9acafb4b8d5984" },
] as const;

const walk = (dir: string): string[] => readdirSync(dir, { recursive: true, encoding: "utf8" }).map((name) => join(dir, name)).filter((path) => statSync(path).isFile());

test("ART1a port check: the crate recipe bakes pixel for pixel the same as the B r6b Python recipe at 32 and 48 px (pixel sha256, size, whole-pixel foot)", () => {
  assert.deepEqual(Object.keys(RECIPES), ["crate"]);
  for (const pin of PINS) {
    const { sprite, sha256 } = bakeOne(pin.name, pin.tile);
    assert.equal(sha256, pin.sha, `${pin.name} at ${pin.tile}`);
    assert.deepEqual([sprite.w, sprite.h], [pin.w, pin.h], `${pin.name} at ${pin.tile} size`);
    assert.deepEqual(sprite.foot, pin.foot, `${pin.name} at ${pin.tile} foot`);
  }
});

test("ART1a deterministic: two bakes give identical bytes, and the PNG holds exactly those pixels (RGBA 8-bit, filter 0)", () => {
  for (const pin of PINS) {
    const a = bakeOne(pin.name, pin.tile);
    const b = bakeOne(pin.name, pin.tile);
    assert.deepEqual(a.rgba, b.rgba);
    const png = encodePng(a.sprite.w, a.sprite.h, a.rgba);
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20), png[24], png[25]], [pin.w, pin.h, 8, 6]);
    const idatLen = png.readUInt32BE(33);
    assert.equal(png.toString("latin1", 37, 41), "IDAT");
    const rows = inflateSync(png.subarray(41, 41 + idatLen));
    const stride = pin.w * 4 + 1;
    const pixels = Buffer.concat(Array.from({ length: pin.h }, (_, y) => rows.subarray(y * stride + 1, (y + 1) * stride)));
    assert.ok(Array.from({ length: pin.h }, (_, y) => rows[y * stride]).every((f) => f === 0));
    assert.deepEqual(new Uint8Array(pixels), a.rgba);
  }
});

test("ART1a sprite: a 1 px margin, steps clipped to the ramp, foot at the bottom centre, and a sel-out outline (right, left, below, above) from the neighbour's darkest step mixed with plum", () => {
  const g = newGrid(3, 1, null);
  put(g, 0, 0, "crate", 99);
  put(g, 2, 0, "steel8", -4);
  const s = gridSprite(g);
  assert.deepEqual([s.w, s.h, s.foot], [5, 3, [3, 2]]);
  const px = colourise(s);
  const at = (x: number, y: number): number[] => [...px.subarray((y * s.w + x) * 4, (y * s.w + x) * 4 + 4)];
  const mix = (m: string): number[] => {
    const dark = ramp(m)[0] ?? [0, 0, 0];
    const plum = rgb(PALETTE.outline.colour);
    return [0, 1, 2].map((i) => Math.trunc((dark[i] ?? 0) * 0.45 + (plum[i] ?? 0) * 0.55)).concat(255);
  };
  assert.deepEqual(at(1, 1), [...(ramp("crate")[5] ?? []), 255]);
  assert.deepEqual(at(3, 1), [...(ramp("steel8")[0] ?? []), 255]);
  assert.deepEqual(at(2, 1), mix("steel8"));
  assert.deepEqual(at(0, 1), mix("crate"));
  assert.deepEqual(at(1, 0), mix("crate"));
  assert.deepEqual(at(3, 2), mix("steel8"));
  assert.deepEqual(at(4, 2), [0, 0, 0, 0]);
  assert.deepEqual(mix("crate"), [43, 24, 32, 255]);
});

test("ART1a palette: one palette.json, every recipe reads its ramps by material name; the B r6b ramps and outline, never pure black or white", () => {
  assert.equal(Object.keys(PALETTE.ramps).length, 38);
  assert.deepEqual(PALETTE.ramps["crate"], ["#2e1c0e", "#4e3219", "#6e4924", "#8e6232", "#ab7c44", "#c69a60"]);
  assert.deepEqual(PALETTE.ramps["steel8"], ["#18161f", "#2c2c3a", "#454857", "#646876", "#878b97", "#acb0b9", "#d7d9dd", "#fbf8f0"]);
  assert.deepEqual(PALETTE.outline, { colour: "#2a1630", rampWeight: 0.45, colourWeight: 0.55 });
  const all = Object.values(PALETTE.ramps).flat();
  assert.ok(all.every((hex) => /^#[0-9a-f]{6}$/.test(hex) && hex !== "#000000" && hex !== "#ffffff"));
  assert.throws(() => ramp("nope"), /no ramp "nope"/);
  const recipes = readdirSync(join(RIG, "recipes")).map((name) => readFileSync(join(RIG, "recipes", name), "utf8"));
  assert.ok(recipes.every((text) => !/#[0-9a-f]{6}/i.test(text) && !text.includes("palette.json")));
});

test("ART1a fence: tools/art-bake has its own package.json with no dependencies, the root package.json gains none, nothing in src imports it, and the rig has no Math.random, Date or performance", () => {
  const own = JSON.parse(readFileSync(join(RIG, "package.json"), "utf8")) as { name: string; dependencies?: unknown; devDependencies?: unknown };
  assert.equal(own.name, "tileengine-art-bake");
  assert.equal(own.dependencies, undefined);
  assert.equal(own.devDependencies, undefined);
  const top = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { dependencies?: unknown; devDependencies: Record<string, string> };
  assert.equal(top.dependencies, undefined);
  assert.deepEqual(Object.keys(top.devDependencies), ["@types/node", "dependency-cruiser", "eslint", "typescript", "typescript-eslint"]);
  const hits = walk(join(root, "src")).filter((path) => readFileSync(path, "utf8").includes("art-bake"));
  assert.deepEqual(hits, []);
  for (const path of walk(RIG).filter((p) => p.endsWith(".ts"))) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /Math\.random|\bDate\b|performance\.|getRandomValues/, path);
  }
  assert.ok(readFileSync(join(root, ".gitignore"), "utf8").split("\n").includes("tools/art-bake/out"));
});

test("ART1a runner: bakeAll writes one PNG per recipe at the 32 px default (the 48 px bake on request, any other tile refused), plus manifest.json with each file's size, whole-pixel foot and pixel sha256", () => {
  const dir = mkdtempSync(join(tmpdir(), "art1a-"));
  try {
    assert.deepEqual(DEFAULT_TILES, [32]);
    const rows = bakeAll(dir);
    assert.deepEqual(rows.map((r) => r.file), ["crate-32.png"]);
    const man = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { sprites: { file: string; sha256: string; foot: number[] }[] };
    assert.deepEqual(man.sprites, JSON.parse(JSON.stringify(rows)));
    for (const row of rows) {
      assert.ok(existsSync(join(dir, row.file)));
      assert.equal(row.sha256, PINS.find((p) => p.name === row.name && p.tile === row.tile)?.sha);
      assert.ok(row.foot.every((v) => Number.isInteger(v)));
    }
    assert.equal(bakeAll(dir, [32, 48]).length, 2);
    const bad = spawnSync(process.execPath, [join(RIG, "bake.ts"), dir, "64"], { encoding: "utf8" });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /art-bake: tile must be 32 or 48 \("64"\)/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
