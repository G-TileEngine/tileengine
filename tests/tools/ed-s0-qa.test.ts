// QA pins for S0 extras the shipped tests missed: exact budget line, no-?bold 60 s path, scored A/B needs lite off.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { AB, blockAt, parseFlags, pool, readout, verdict, type Hash } from "../../tools/device-page/bold.ts";

const page = readFileSync(new URL("../../tools/device-page/page.ts", import.meta.url), "utf8");
const P = (n: number, v: number) => pool(Array(n).fill(v) as number[]);
const base = { off: P(100, 16.5), on: P(100, 17.0), canvasMb: 40, heapMb: null as number | null, hash: "PASS" as Hash };

test("QA S0: the HUD is green at the exact budget line and red the moment it is exceeded; canvas 160 is green (QA exact line)", () => {
  assert.equal(verdict({ ms: 0.5, ...base }).red, false);
  assert.equal(verdict({ ms: 0.5, ...base, on: P(100, 17.0001) }).red, true);
  assert.equal(verdict({ ms: 0.5, ...base, on: base.off, canvasMb: 160 }).red, false);
  assert.equal(verdict({ ms: 0.5, ...base, on: base.off, canvasMb: 160.1 }).red, true);
});

test("QA S0: a scored A/B readout needs cap on and lite off; auto-lite or cap off is NOT SCORED (QA auto-lite)", () => {
  const flags = parseFlags("breed", "1"), done = blockAt(AB.visitMs);
  const text = (cap: boolean, lite: string): string => readout({ flags, block: done, off: base.off, on: base.on, canvasPeak: 1, heapPeak: null, hash: "PASS", hashOf: "", cap, lite, switches: 0, extra: [] });
  assert.doesNotMatch(text(true, "off"), /NOT SCORED/);
  assert.match(text(true, "auto"), /NOT SCORED/);
  assert.match(text(false, "off"), /NOT SCORED/);
});

test("QA S0: without ?bold the 60 s path is unchanged (window, zoom, pan, rotate); A/B stays behind the bold gate (QA flags-off baseline)", () => {
  assert.match(page, /else if \(t - t0 < 60_000\) gaps\.push\(g\)/);
  assert.match(page, /const t = Math\.min\(60_000, performance\.now\(\) - t0\), s = Math\.min\(4, 1 \+ Math\.floor\(t \/ 15_000\)\)/);
  assert.match(page, /x: \(t \/ 40\) % 480/);
  assert.match(page, /el >= 38_000 && el < 45_000/);
  assert.match(page, /if \(bold\) \{ const t = Math\.min\(AB\.visitMs/);
});
