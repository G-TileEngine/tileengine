import assert from "node:assert/strict";
import { test } from "node:test";
import { openCheckpoint, openShop } from "../../tools/baseline/checkpoint.ts";
import { dressPx } from "../../tools/play-stage/looks.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
test("step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe", () => {
  for (const opened of [openShop(), openCheckpoint()]) {
    if (opened.docs === null) throw new Error(opened.error);
    const match = createMatch(opened.docs), scene = match.scene();
    assert.ok(scene.units.length > 0);
    for (const unit of scene.units) {
      const id = scene.assets[unit.sprite]?.sheet.id;
      assert.equal(typeof id === "string" && id.startsWith("play:anim:starter:unknown-"), true);
      assert.equal(id === undefined ? undefined : match.pixels(id)?.w, 32);
    }
  }
  assert.equal(dressPx("play:anim:starter:unknown-x@player")?.w, 32);
  assert.equal(dressPx("play:anim:starter:nope@player"), undefined);
  assert.equal(dressPx("play:anim:starter:unknown-x@nobody"), undefined);
});
