// QA pin from the S0 builds A/B (Q8): an all-off visit (`?bold=`, `off`, `off,off`) with cap on and lite off is the
// scored baseline the run sheet starts with (ruling 1). Only several tokens, an unknown token or off-mixed are NOT SCORED.
import assert from "node:assert/strict";
import { test } from "node:test";
import { AB, blockAt, parseFlags, pool, readout } from "../../tools/device-page/bold.ts";

const P = pool(Array(100).fill(16.7) as number[]);
const text = (bold: string): string => readout({ flags: parseFlags(bold, null), block: blockAt(AB.visitMs), off: P, on: P, canvasPeak: 1, heapPeak: null, hash: "PASS", hashOf: "", cap: true, lite: "off", switches: 0, extra: [] });

test("QA S0 builds: an all-off ?bold visit is a scored baseline; several tokens, an unknown or off-mixed stay NOT SCORED (QA Q8)", () => {
  for (const b of ["", "off", "off,off", " off ", "breed"]) {
    assert.equal(parseFlags(b, null).scored, true, `"${b}"`);
    assert.doesNotMatch(text(b), /NOT SCORED/, `"${b}"`);
  }
  for (const b of ["breed,path", "breed,lingr6", "off,breed"]) {
    assert.equal(parseFlags(b, null).scored, false, b);
    assert.match(text(b), /NOT SCORED/, b);
  }
});
