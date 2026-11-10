import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { ESLint } from "eslint";

function run(script: string, root?: string): number {
  const args = root ? [script, root] : [script];
  const r = spawnSync("sh", args, { encoding: "utf8" });
  return r.status ?? -1;
}

test("gates: check:state passes on src and on a clean fixture", () => {
  assert.equal(run("scripts/check-state.sh"), 0);
  assert.equal(run("scripts/check-state.sh", "tests/fixtures/state-good"), 0);
});

test("gates: check:state fails on direct phase writes and a second transition function", () => {
  assert.equal(run("scripts/check-state.sh", "tests/fixtures/state-bad"), 1);
});

test("gates: check:law passes on src and fails on a law-breaking core fixture", () => {
  assert.equal(run("scripts/check-law.sh"), 0);
  assert.equal(run("scripts/check-law.sh", "tests/fixtures/law-bad"), 1);
  assert.equal(run("scripts/check-law.sh", "tests/fixtures/law-good"), 0);
});

test("gates: eslint allows the frame loop only in src/runtime/host/raf-driver.ts", async () => {
  const eslint = new ESLint();
  const code = "export const go = (f: (t: number) => void): number => requestAnimationFrame(f);\nexport const t = setTimeout;";
  const rules = async (filePath: string): Promise<string[]> => {
    const [res] = await eslint.lintText(code, { filePath });
    return (res?.messages ?? []).map((m) => `${m.ruleId ?? "?"}:${m.line}`);
  };
  assert.deepEqual(await rules("src/runtime/host/raf-driver.ts"), ["no-restricted-globals:2"]);
  assert.deepEqual(await rules("src/runtime/host/other.ts"), ["no-restricted-globals:1", "no-restricted-globals:2"]);
});

test("gates: eslint rejects wall time, Math.random, rule words and upward imports in src/core", async () => {
  const eslint = new ESLint();
  const code = [
    'import { xGo } from "../state/xgo.ts";',
    "export const hp = Date.now() + Math.random();",
    "export const t = setTimeout;",
    "export { xGo };",
  ].join("\n");
  const [res] = await eslint.lintText(code, { filePath: "src/core/probe.ts" });
  const ids = new Set((res?.messages ?? []).map((m) => m.ruleId));
  for (const rule of ["no-restricted-imports", "no-restricted-properties", "no-restricted-globals", "id-denylist"]) {
    assert.ok(ids.has(rule), `expected ${rule}, got ${[...ids].join(", ")}`);
  }
});
