import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
const RE = /JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/;
const ALLOW: readonly string[] = [];
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
  return out;
}
test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !ALLOW.includes(hit)), []);
});
