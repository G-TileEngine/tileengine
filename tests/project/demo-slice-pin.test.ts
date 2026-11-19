import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
// sliceOf(behaviours.json bba8c252, IDS)
test("demo slice pin: catalogue/slice.json is the rev 29 slice, byte for byte", () => {
  const bytes = readFileSync("fixtures/demo.tileproj/catalogue/slice.json");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3");
});
