import assert from "node:assert/strict";
import { test } from "node:test";
import { visibleCells, type Blockers } from "../../../src/runtime/render/index.ts";

// QA P1 A/B (M1 follow-up): a wall bit on only ONE side of an edge stops light, on every axis and in every direction.
// The shipped one-sided check covers e/w looking east only; its north wall sets both bits, so a one-sided n/s leak passed.
const open = (cols: number, rows: number): Blockers => ({ cols, rows, blocks: new Uint8Array(cols * rows) });
const N = 12, at = (c: number, r: number): number => r * N + c;
// Each case: the light at (5,5), one bit on one cell, and the far-side test for the cells beyond that edge.
const cases: readonly [string, number, number, number, (c: number, r: number) => boolean][] = [
  ["north, own n bit", 5, 5, 1, (_c, r) => r < 5],
  ["north, neighbour s bit", 5, 4, 4, (_c, r) => r < 5],
  ["south, own s bit", 5, 5, 4, (_c, r) => r > 5],
  ["south, neighbour n bit", 5, 6, 1, (_c, r) => r > 5],
  ["west, own w bit", 5, 5, 8, (c) => c < 5],
  ["west, neighbour e bit", 4, 5, 2, (c) => c < 5],
  ["east, own e bit", 5, 5, 2, (c) => c > 5],
  ["east, neighbour w bit", 6, 5, 8, (c) => c > 5],
];

test("a one-sided wall bit stops light on n/s and e/w, both ways round (QA P1 M1 follow-up)", () => {
  for (const [name, wc, wr, bit, far] of cases) {
    const w = new Uint8Array(N * N);
    // Wall the whole line of that edge so light cannot go round its ends.
    for (let i = 0; i < N; i += 1) { if (bit === 1 || bit === 4) w[at(i, wr)] = bit; else w[at(wc, i)] = bit; }
    const seen = visibleCells({ ...open(N, N), lightWalls: w }, 5, 5, 6);
    const leak = [...seen].findIndex((v, i) => v === 1 && far(i % N, Math.floor(i / N)));
    assert.equal(leak, -1, `${name}: light leaks to cell ${leak}`);
    assert.equal(seen[at(5, 5)], 1, `${name}: the light's own cell stays lit`);
  }
});
