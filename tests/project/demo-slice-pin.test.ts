import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
// sliceOf(behaviours.json 583f7e21, IDS)
test("demo slice pin: catalogue/slice.json is the rev 30 slice, byte for byte", () => {
  const bytes = readFileSync("fixtures/demo.tileproj/catalogue/slice.json");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "fe646b927da86b05722ddb9272170a2ec0a62c8e44e94bcb0fa7371381ed7b3f");
});
