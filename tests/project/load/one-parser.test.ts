import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const RE = /JSON\.parse|formatVersion|kind ===/;
const PLAY = ["board.ts:109", "build.ts:13", "build.ts:14", "load.ts:20", "load.ts:21", "load.ts:23", "match.ts:63", "match.ts:90", "match.ts:96", "match.ts:102", "match.ts:105", "match.ts:108"];
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) readFileSync(join(dir, name), "utf8").split("\n").forEach((line, i) => { if (RE.test(line)) out.push(`${name}:${i + 1}`); });
  return out;
}

test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.includes(hit)), []);
});
