import assert from "node:assert/strict";
import { test } from "node:test";
import { report } from "../../scripts/sim.ts";

test("the sim script's report is the 50-seed batch, byte for byte", () => {
  assert.deepEqual(report(50, 60000), [
    "stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75",
    "stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c",
  ]);
  assert.throws(() => report(0, 60000), RangeError);
});
