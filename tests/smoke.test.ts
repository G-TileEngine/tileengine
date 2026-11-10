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
  assert.equal(sha, "055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3");
});
