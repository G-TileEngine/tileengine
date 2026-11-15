import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createLighting, fitView, lightOps, snapCamera } from "../../src/runtime/render/index.ts";
import { LIMIT_MS, runStress, STRESS } from "../perf/stress-budget.ts";
import { PERF } from "../perf/fx-light-budget.ts";
import { FakeCanvas } from "./canvas/fake-canvas.ts";
import { frames, L1, RASTERS } from "../../tools/pixel-suite/fixture.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../.."), SRC = join(ROOT, "src");
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isSymbolicLink() ? [`${join(dir, e.name)} (symlink)`] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
test("light walk: the plan visits only each light's box and both op passes only the view's squares plus one margin, at the map's corners and middle, never the whole map (step 34b)", () => {
  const n = 128, fit = fitView(390, 844, 2, 16, 16), res = 4, L = createLighting(), plan = L.plan({ cols: n, rows: n, tileW: 16, tileH: 16, blocks: new Uint8Array(n * n).map((_, i) => (i % 13 === 0 ? 1 : 0)) }, [{ x: 300, y: 400, radius: 64 }], 0.6, 0, res);
  const box = (Math.ceil(364 / res) - Math.floor(236 / res)) * (Math.ceil(464 / res) - Math.floor(336 / res)); // QA 34b: the light box exactly (every square of it, nothing more)
  assert.equal(L.stats.squares, box, `the plan visited ${L.stats.squares} squares; box ${box}, map ${plan.w * plan.h}`);
  const least = 2 * Math.ceil(fit.artW / res) * Math.ceil(fit.artH / res), span = (a: number, len: number, n: number): number => Math.min(n, Math.ceil((a + len + res) / res) + 1) - Math.max(0, Math.floor(a / res) - 1);
  for (const [x, y] of [[0, 0], [700, 900], [n * 16 - fit.artW, n * 16 - fit.artH]] as const) {
    const walked = { squares: 0 }, cam = snapCamera(x, y, 2), bound = 2 * (span(cam.devX / fit.s, fit.artW, plan.w) + 1) * span(cam.devY / fit.s, fit.artH, plan.h); lightOps(plan, fit, cam, undefined, walked); // QA 34b: both passes cover at least the view, at most floor-1..ceil+1 (+ the flush column)
    assert.ok(walked.squares >= least && walked.squares <= bound, `walked ${walked.squares} squares at (${x},${y}); view ${least}..${bound}, whole map ${2 * plan.w * plan.h}`);
  }
});
test("stress: one warm-up lap is never judged, light alone must hold 2 ms p95 and the rest 4 ms (step 34b)", () => {
  assert.equal(LIMIT_MS["L"], 2); assert.equal(PERF.limitMs, 4);
  const clock = (warmMs: number, ms: number, lapMs: number, slowLaps = 1): (() => number) => { let at = 0, calls = 0; return () => { calls += 1; if (calls % 2 === 0) at += calls <= 2 * slowLaps * Math.ceil(lapMs / PERF.frameMs) ? warmMs : ms; return at; }; };
  const scene = (k: string): (typeof STRESS)[string] => { const o = STRESS[k]; assert.ok(o !== undefined, k); return o; };
  assert.ok(runStress("A", scene("A"), clock(50, 3, 160), 160).got.ok, "a slow warm-up lap failed the 4 ms budget"); assert.ok(!runStress("A", scene("A"), clock(50, 3, 160, 2), 160).got.ok, "a slow first judged lap passed (QA 34b: exactly one warm-up lap)");
  const l = runStress("L", scene("L"), clock(0, 3, 160), 160); assert.equal(l.limit, 2); assert.ok(!l.got.ok, "3 ms light frames passed");
  assert.equal(l.got.p95.length, PERF.laps);
});
test("pixel fixture: the recording canvas draws the L1 frames the browsers must match (QA L1/L2, step 34b)", () => {
  const view = new FakeCanvas(), got = frames(view, (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; return c; }, (id) => RASTERS[id], () => view.px);
  assert.deepEqual(got, ["1:150x98:04b5748d", "2:150x98:6865666d", "3:150x98:846e2223"]); assert.deepEqual(got, [...L1], "the phone page's pixel check uses the same frames");
});
test("export gate: nothing under src reaches tools/ (phone page, pixel suite, dev server), the dev overlay or tests, and package.json exposes no tools (step 34b)", () => {
  for (const file of walk(SRC)) {
    assert.ok(!file.endsWith(" (symlink)"), `${file}: no symlinks under src`); const text = readFileSync(file, "utf8"), name = relative(ROOT, file);
    assert.ok(!text.includes("data-dev-overlay") && !text.includes("import.meta") && !/\bimport\s*\((?!\s*["'`][^"'`$]*["'`]\s*\))/.test(text), `${name} carries the dev overlay, import.meta or a computed import()`);
    for (const { fileName: spec } of ts.preProcessFile(text, true, true).importedFiles) { const to = relative(SRC, resolve(dirname(file), spec)); assert.ok(spec.startsWith("node:") || !to.startsWith(".."), `${name} imports ${spec}, outside src`); } // QA 34b: TypeScript's own scan (side-effect, template and commented imports too)
  }
  assert.ok(readFileSync(join(ROOT, "tools/device-page/index.html"), "utf8").includes("data-dev-overlay"), "the phone page keeps its overlay marker");
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as Record<string, unknown>;
  for (const k of ["main", "exports", "files", "bin", "module", "browser"]) assert.ok(!JSON.stringify(pkg[k] ?? "").includes("tools"), `package.json ${k} exposes tools`);
});
