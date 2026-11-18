import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { WIN_CONDITION, wipeRule } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { openProject } from "../../tools/play-stage/project.ts";
import { demoDocs, loadFixture, U } from "./demo-fixture.ts";

const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const slug = (text: string): string => Object.entries(U).reduce((out, [name, id]) => out.replaceAll(id, name), text);
test("(a) parity: seed 24301 bot versus bot equals the 1a golden", () => {
  const docs = demoDocs(), input = docsToInput(docs).input, win = installOne(WIN_CONDITION, {}).out, budget = installOne(ACTION_BUDGET, {}).out;
  if (win === null || budget === null) throw new Error("parity: rules");
  assert.equal(input.hostSeed, 24301); assert.equal(input.projectHash, "demo");
  const world = createWorld(input);
  const result = runMatch(world, { sides: ["player", "wolves"], ai: botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: docs.rules }), victory: wipeRule(win, ["player", "wolves"]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
  const got = { outcome: result.outcome, snapshot: sha(JSON.parse(slug(JSON.stringify(snapshot(world))))), log: sha(slug(world.log.toJSON())), bus: sha(JSON.parse(slug(JSON.stringify(world.bus.history())))) };
  assert.deepEqual(got, JSON.parse(readFileSync(new URL("./golden/demo-parity.json", import.meta.url), "utf8")) as unknown);
});
test("a rejected project shows the error text and does not fall back to the demo", () => {
  const files = loadFixture(), manifest = files["project.json"];
  if (typeof manifest !== "object" || manifest === null) throw new Error("project");
  const got = openProject({ ...files, "project.json": { ...manifest, formatVersion: 7 } });
  assert.equal(got.docs, null);
  assert.match(got.error, /formatNewer/); assert.match(got.error, /project\.json/);
  assert.equal(got.error.includes("knight"), false);
});
