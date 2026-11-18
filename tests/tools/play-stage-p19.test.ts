import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildWeb, debugGlobals, listFiles } from "../../tools/apk/build.ts";
import { boardBox, fit, HUD_FOOT, HUD_TOP, PLATE_H, ROW_FOOT, TILE } from "../../tools/play-stage/board.ts";
import { DEV_ONLY, release } from "../../tools/play-stage/build.ts";
import { createCam, seatCam } from "../../tools/play-stage/camera-touch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { demoDocs } from "./demo-fixture.ts";

const hudSrc = readFileSync(new URL("../../tools/play-stage/hud.ts", import.meta.url), "utf8");

test("the board canvas sits between the HUD bands: row 0 is whole and below the top bar at 390 and 360 @3x; the banner is in the top band and click-through", () => {
  assert.equal(HUD_FOOT, ROW_FOOT + PLATE_H);
  for (const w of [390, 360]) {
    const dpr = 3, box = boardBox(844), devW = w * dpr, devH = box.height * dpr, cam = createCam(1);
    assert.deepEqual(box, { top: HUD_TOP, height: 844 - HUD_TOP - HUD_FOOT });
    seatCam(cam, fit(devW, devH, 6, 9, dpr).s, dpr);
    const padY = Math.floor((devH - Math.floor(devH / cam.s) * cam.s) / 2), top = box.top + padY / dpr, bottom = top + (TILE * cam.s) / dpr;
    assert.ok(top >= HUD_TOP, `${w}: row 0 top ${top} is under the top bar`);
    assert.ok(bottom <= box.top + box.height, `${w}: row 0 bottom ${bottom} runs past the board`);
  }
  assert.match(hudSrc, /#top\{[^}]*top:0;height:\$\{HUD_TOP\}px;/);
  assert.match(hudSrc, /#banner\{[^}]*top:0;height:\$\{HUD_TOP\}px;/);
  assert.match(hudSrc, /#plate\{[^}]*bottom:\$\{ROW_FOOT\}px;height:\$\{PLATE_H\}px;/);
  assert.match(hudSrc, /#hud #banner\{pointer-events:none\}/);
  assert.match(hudSrc, /#row\{[^}]*bottom:24px;height:64px;/);
  assert.equal(24 + 64, ROW_FOOT);
});

test("export audit: a release www drops every DEV path (define + dead-code removal); the dev build keeps the hooks for the smokes", () => {
  assert.equal(release(`a\nimport { DEV } from "./dev.ts"; ${DEV_ONLY}\nif (DEV) go(); ${DEV_ONLY}  \nc`), "a\nc");
  assert.throws(() => release(`window.__x = 1; ${DEV_ONLY}`), /must be an if \(DEV\) statement/);
  assert.throws(() => release("if (DEV) go();"), /DEV is used outside a dev-only line/);
  const rel = mkdtempSync(join(tmpdir(), "p19r5-")), dev = mkdtempSync(join(tmpdir(), "p19r5-"));
  try {
    buildWeb(rel, "0".repeat(40)); buildWeb(dev, "0".repeat(40), undefined, true);
    assert.deepEqual(debugGlobals(rel), []);
    assert.ok(!listFiles(rel).includes("tools/play-stage/dev.js") && listFiles(dev).includes("tools/play-stage/dev.js"));
    for (const name of listFiles(rel)) assert.ok(!readFileSync(join(rel, name), "utf8").includes("Object.assign(window"), name);
    assert.deepEqual(debugGlobals(dev), ["tools/play-stage/dev.js", "tools/play-stage/page.js"]);
    const page = readFileSync(join(dev, "tools/play-stage/page.js"), "utf8");
    for (const g of ["__play", "__driver", "__cam", "__hud", "__fx", "__link"]) assert.ok(page.includes(g), g);
    writeFileSync(join(rel, "planted.js"), "globalThis.__link = 1;\n");
    assert.deepEqual(debugGlobals(rel), ["planted.js"]);
  } finally { rmSync(rel, { recursive: true, force: true }); rmSync(dev, { recursive: true, force: true }); }
});

test("stage seed 24301 is the host seed when docs give none", () => {
  const docs = demoDocs(), stage = docs.stage, { hostSeed: _host, ...rest } = docs;
  assert.equal(typeof stage === "object" && stage !== null && "seed" in stage && stage.seed, 24301);
  assert.equal(docs.hostSeed, 24301);
  assert.equal(docsToInput(rest).input.hostSeed, 24301);
  assert.equal(docsToInput({ ...rest, hostSeed: 7 }).input.hostSeed, 7);
  void _host;
});
