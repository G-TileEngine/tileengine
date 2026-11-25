import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/baseline/build.ts";
import { checkpointFiles, openCheckpoint } from "../../tools/baseline/checkpoint.ts";
import { canvasMbOf, framesOf, heapPeakOf, readout } from "../../tools/baseline/readout.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
const DIR = "handback/step-06c-checkpoint/r1/checkpoint.tileproj", GAPS = [16, 17, 16, 18, 16, 30, 16, 17, 55, 16, 16, 17, 16, 16, 16, 17, 16, 16, 16, 20];
const BAD = /JSON\.parse|formatVersion|kind === |tools\/maker|src\/editor|\bfetch\b/;
const disk = (at: string, base: string): string[] => { const out: string[] = []; for (const name of readdirSync(at)) { const path = join(at, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) out.push(...disk(path, rel)); else out.push(rel); } return out; };
const tree = (at: string, base: string): string[] => { const out: string[] = []; for (const name of readdirSync(at)) { const path = join(at, name), rel = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) out.push(...tree(path, rel)); else out.push(rel); } return out; };
test("baseline page opens the checkpoint project", () => {
  assert.deepEqual(Object.keys(checkpointFiles()).sort(), disk(DIR, "").sort());
  const opened = openCheckpoint(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const match = createMatch(opened.docs, 0); assert.equal(match.world.grid.cols, 6); assert.equal(match.world.grid.rows, 6); assert.equal(match.sides.contest, true); assert.equal(match.view().outcome, null);
  const page = readFileSync("tools/baseline/page.ts", "utf8"); assert.match(page, /from "\.\.\/play-stage\/page\.ts"/); assert.match(page, /startMatch\(opened\.docs\)/); assert.match(page, /baseline: the checkpoint did not open/); assert.match(page, /prev = -1/); assert.equal((page.match(/requestAnimationFrame/g) ?? []).length, 2);
  const hits = disk("tools/baseline", "tools/baseline").filter((rel) => BAD.test(readFileSync(rel, "utf8"))); assert.deepEqual(hits, []);
});
test("baseline readout maths on a fixed frame list", () => {
  assert.deepEqual(framesOf(GAPS), { p50: 16, p95: 55, max: 55, dropped: 2, over50: 1, n: 20 }); assert.deepEqual(framesOf([]), { p50: 0, p95: 0, max: 0, dropped: 0, over50: 0, n: 0 });
  assert.equal(framesOf([25]).dropped, 0); assert.equal(framesOf([50]).over50, 0); assert.equal(framesOf([50]).dropped, 1); assert.equal(framesOf([25.1]).dropped, 1); assert.equal(framesOf([50.1]).over50, 1);
  const bytes = 1170 * 1536 * 4 + 512 * 512 * 4; assert.equal(canvasMbOf([{ width: 1170, height: 1536 }, { width: 512, height: 512 }]), bytes / 1_048_576);
  assert.equal(heapPeakOf(null, undefined), null); assert.equal(heapPeakOf(null, 8 * 1_048_576), 8); assert.equal(heapPeakOf(12, 8 * 1_048_576), 12);
  const early = readout({ gaps: GAPS, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 2 }); assert.equal(early.startsWith("DONE"), false);
  assert.equal(early, "baseline · Skirmish (checkpoint.tileproj)\nframe ms p50 16.0 p95 55.0 max 55.0\ndropped (>25 ms) 2 over 50 ms 1 of 20\ncanvas MB 1.0 · dpr 2.0\nheap MB peak n/a\nGC: n/a (browsers don't expose it)");
  const done = readout({ gaps: GAPS, elapsedMs: 60_000, canvasMb: 1, heapMb: 9.25, dpr: 2 }); assert.equal(done.startsWith("DONE\n"), true); assert.equal(done.includes("heap MB peak 9.3"), true);
});
test("baseline build ships the checkpoint and no maker or editor code", () => {
  const out = mkdtempSync(join(tmpdir(), "s6d-build-")); try {
    build(out, "0".repeat(40)); const html = readFileSync(join(out, "index.html"), "utf8"); assert.equal(html.includes('src="./tools/baseline/page.js"'), true);
    const shipped = tree(out, "").filter((rel) => rel.includes("checkpoint.tileproj/")); const want = disk(DIR, "").map((rel) => `${DIR}/${rel}.js`).sort();
    assert.deepEqual(shipped.sort(), want); assert.deepEqual(tree(out, "").filter((rel) => /editor|tools\/maker|catalogue\.json/.test(rel)), []);
    const page = readFileSync(join(out, "tools/play-stage/page.js"), "utf8"); assert.equal(page.includes("__play"), false); assert.equal(page.includes("dev-only"), false);
    assert.throws(() => build(out, "0".repeat(40)), /not empty/);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
