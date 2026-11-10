import assert from "node:assert/strict";
import { test } from "node:test";
import { pickLanding } from "../../src/fx/order/index.ts";

const target = { c: 2, r: 2 };
const from = { c: 0, r: 0 };
const open = () => true;
const block = (bad: readonly string[]) => (at: { c: number; r: number }) => !bad.includes(`${at.c},${at.r}`);
const sides = ["1,2", "2,1", "2,3", "3,2"];

test("holy-sword landing (CEO 2026-11-10): the free neighbour nearest the sword; 8 around by default, 4 sides as the option", () => {
  assert.deepEqual(pickLanding(target, from, "eight", open), { c: 1, r: 1 });
  assert.deepEqual(pickLanding(target, from, "four", open), { c: 1, r: 2 });
  assert.deepEqual(pickLanding(target, from, "eight", block(["1,1"])), { c: 1, r: 2 });
  assert.deepEqual(pickLanding(target, from, "eight", block(sides)), { c: 1, r: 1 });
  assert.deepEqual(pickLanding(target, { c: 0, r: 5 }, "eight", block(["1,3"])), { c: 1, r: 2 });
  assert.deepEqual(pickLanding({ c: 0, r: 0 }, { c: 3, r: 3 }, "eight", (at) => at.c >= 0 && at.r >= 0), { c: 1, r: 1 });
  const seen: string[] = [];
  pickLanding(target, from, "eight", (at) => { seen.push(`${at.c},${at.r}`); return true; });
  assert.deepEqual(seen, ["1,1", "1,2", "1,3", "2,1", "2,3", "3,1", "3,2", "3,3"]);
});
test("holy-sword landing (CEO 2026-11-10): every neighbour filled by objects or units means the sword cannot reach the target", () => {
  assert.equal(pickLanding(target, from, "eight", () => false), null);
  assert.equal(pickLanding(target, from, "four", block(sides)), null);
});
test("landing across a seam (CoS 2026-11-10): the caller's canLand decides; blocked rejects the seam-cut side tile", () => {
  assert.deepEqual(pickLanding(target, { c: 0, r: 2 }, "eight", open), { c: 1, r: 2 });
  assert.deepEqual(pickLanding(target, { c: 0, r: 2 }, "eight", block(["1,2"])), { c: 1, r: 1 });
});
