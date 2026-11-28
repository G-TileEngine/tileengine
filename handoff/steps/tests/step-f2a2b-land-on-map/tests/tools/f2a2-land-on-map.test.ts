import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { backScreen } from "../../tools/maker/test-launch.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const read = (rel: string): string => readFileSync(join(root, rel), "utf8");
const maker = readdirSync(join(root, "tools/maker")).filter((name) => name.endsWith(".ts")).map((name) => read(`tools/maker/${name}`));

test("F2a2 land on the map: the stage bar opens ☰ and the switcher, the project page is gone, Back returns to the stage", () => {
  const stage = read("tools/maker/stage.ts");
  assert.ok(stage.includes('<button type="button" class="btn icon bare" data-act="m:menu" aria-label="Game menu">${icon("menu")}</button><h1><button type="button" class="switch" data-act="m:switch"><span>${esc(name)}</span>${dot}${icon("down")}</button></h1>'));
  assert.equal(stage.split('data-act="s:back"').length - 1, 1);
  assert.equal(existsSync(join(root, "tools/maker/project.ts")), false);
  assert.equal(maker.some((text) => text.includes("projectScreen")), false);
  const home = read("tools/maker/home.ts");
  assert.ok(home.includes("budgets: budgetsRow(state.files), build: buildButton(building)"));
  assert.ok(home.includes("units: unitCount(state.files), effects: effectCount(state.files)"));
  assert.ok(home.includes("if (!landOn(id, text, null)) return;"));
  assert.ok(home.includes("const menu = built === null && edit === \"\" ? menuSheet(state.stageId) : \"\";"));
  assert.ok(home.includes('state.banner = "This game has no stages, so it can\'t open."'));
  assert.ok(home.includes("const next = hit.stageId ?? (gone ? stageRows(state.files)[0]?.id ?? null : null);"));
  assert.ok(home.includes("if (got.docs === null) { out(); state.banner = got.error; paint(); return; }"));
  assert.ok(home.includes("if (menuView() === \"menu\") {\n    menuSet(\"none\");\n  }"));
  assert.equal(home.includes('| "project" |'), false);
  assert.deepEqual([null, "home", "trash", "stage", "project"].map(backScreen), ["stage", "home", "trash", "stage", "stage"]);
});
