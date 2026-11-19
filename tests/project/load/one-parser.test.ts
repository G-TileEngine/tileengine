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
test("P2 maker: one JSON.parse in project-files.ts, no formatVersion or kind ===, and play-stage does not import maker", () => {
  const names = readdirSync("tools/maker").filter((name) => name.endsWith(".ts"));
  const lines = names.flatMap((name) => readFileSync(join("tools/maker", name), "utf8").split("\n").map((line) => `${name}\t${line}`));
  const parses = lines.filter((line) => line.includes("JSON.parse"));
  assert.equal(parses.length, 1); assert.match(parses[0] ?? "", /^project-files\.ts/);
  assert.deepEqual(lines.filter((line) => /formatVersion|kind === /.test(line)), []);
  const imported = readdirSync("tools/play-stage").filter((name) => name.endsWith(".ts") && /tools\/maker|\.\.\/maker\//.test(readFileSync(join("tools/play-stage", name), "utf8")));
  assert.deepEqual(imported, []);
});
