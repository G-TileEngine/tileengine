import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { ENGINE_NAME, ENGINE_VERSION } from "../src/index.ts";

test("smoke: engine root exports name and version", () => {
  assert.equal(ENGINE_NAME, "tileengine");
  assert.match(ENGINE_VERSION, /^\d+\.\d+\.\d+$/);
});

test("smoke: core-types.ts is the pinned DSK copy", () => {
  const sha = createHash("sha256").update(readFileSync("src/types/core-types.ts")).digest("hex");
  assert.equal(sha, "439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5");
});
