import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { bakeAll, bakeOne, RECIPES } from "../../tools/art-bake/bake.ts";
import { rock } from "../../tools/art-bake/recipes/rock.ts";

// From the kit's ref/ref-art1b2.py: the frozen B r6b Python (b-r6/style_b6.py barrel6, crate6; recipes.py rock and lantern).
const PINS = [
  { name: "barrel", tile: 32, w: 17, h: 22, foot: [9, 21], sha: "3cece1b77e15fd21d8f8fcb576729950496d462c590d447b90045e39bec180d2" },
  { name: "barrel", tile: 48, w: 23, h: 31, foot: [12, 30], sha: "9be6b10957cab1559e9c920ec7726fe90e41272bfef56c370dbdc6cde1dcf60c" },
] as const;

test("ART1b2 port check: the r6 barrel bakes pixel for pixel the same as the B r6b Python at 32 and 48 px, after the crate in RECIPES", () => {
  assert.deepEqual(Object.keys(RECIPES), ["crate", "barrel", "rock", "lantern"]);
  for (const pin of PINS) {
    const { sprite, sha256 } = bakeOne(pin.name, pin.tile);
    assert.equal(sha256, pin.sha, `${pin.name} at ${pin.tile}`);
    assert.deepEqual([sprite.w, sprite.h, sprite.foot], [pin.w, pin.h, pin.foot], `${pin.name} at ${pin.tile} size and foot`);
  }
});

test("ART1b2 contact shadows: each recipe's shapes in base px from the foot, scaled by k at placement, as the Python returns them", () => {
  assert.deepEqual(["crate", "barrel", "rock", "lantern"].map((name) => [bakeOne(name, 32).k, bakeOne(name, 48).k]), [[1.3, 1.9500000000000002], [1.3, 1.9500000000000002], [1.3, 1.9500000000000002], [1.25, 1.875]]);
  assert.deepEqual(bakeOne("crate", 32).shadow, [["e", 1.6, -0.3, 8.138461538461538, 2.4], ["p", [[6.138461538461538, 0.4], [9.138461538461538, -0.2], [9.138461538461538, -5], [6.138461538461538, -6.4]]]]);
  assert.deepEqual(bakeOne("crate", 48).shadow, [["e", 1.6, -0.3, 8.01025641025641, 2.4], ["p", [[6.010256410256409, 0.4], [9.01025641025641, -0.2], [9.01025641025641, -5], [6.010256410256409, -6.4]]]]);
  assert.deepEqual(bakeOne("barrel", 32).shadow, [["e", 1.4, -0.5, 6.969230769230769, 2.2], ["p", [[4.969230769230769, 0.2], [7.769230769230769, -0.6], [7.36923076923077, -5], [4.569230769230769, -6]]]]);
  assert.deepEqual(bakeOne("barrel", 48).shadow, [["e", 1.4, -0.5, 6.584615384615384, 2.2], ["p", [[4.584615384615384, 0.2], [7.384615384615384, -0.6], [6.984615384615385, -5], [4.184615384615384, -6]]]]);
  assert.deepEqual([bakeOne("rock", 48).shadow, rock(32, 3, true).shadow], [[["e", 3, -0.8, 7, 2.6]], [["e", 4.050000000000001, -0.8, 9.450000000000001, 3.5100000000000002]]]);
  assert.deepEqual(bakeOne("lantern", 32).shadow, [["e", 3, -0.5, 4, 1.5]]);
});

test("ART1b2 manifest: rows carry k and shadow, and the hash pins every sprite's RGBA bytes in RECIPES order then tile order", () => {
  const dir = mkdtempSync(join(tmpdir(), "art1b2-"));
  try {
    const rows = bakeAll(dir, [32, 48]);
    const man = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { hash: string; sprites: unknown[] };
    assert.deepEqual(man.sprites, JSON.parse(JSON.stringify(rows)));
    assert.deepEqual(rows.map((r) => `${r.name}-${r.tile}`), ["crate-32", "crate-48", "barrel-32", "barrel-48", "rock-32", "rock-48", "lantern-32", "lantern-48"]);
    assert.deepEqual(Object.keys(rows[0] ?? {}), ["name", "tile", "file", "w", "h", "foot", "k", "shadow", "sha256"]);
    assert.equal(man.hash, "ef216fc42063bf0f373386a8b1a12fb7787dea964a6abdc7879acd3e067f1d21");
    bakeAll(dir);
    assert.equal((JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { hash: string }).hash, "d12bc6625b1b089be5d2cf4a3608910966a0d9967ca50c8ab2cb21172470f2c6");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
