import assert from "node:assert/strict";
import { test } from "node:test";
import { blankEffect, SAVE, saveAndUse } from "../../src/editor/effect/save.ts";
import { valuesOf, type Row } from "../../src/editor/effect/writer.ts";
import { shopFiles } from "../../tools/baseline/checkpoint.ts";
import type { Dir } from "../../tools/effect-designer/store.ts";
import { uploadBytes } from "../../tools/maker/art.ts";
import { makerStore } from "../../tools/maker/store.ts";
import { pixelsOf } from "../../tools/play-stage/board.ts";
import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
const at = "2026-11-25T00:00:00.000Z", mint = (p: string): string => `${p}0001`, extra = 300 * 1024;
const owner = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 0, behaviourId: "basic-attack", answers: { effect: { source: "user", value: "setup_01JD0000000000000000000001", rev: 1 } }, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } });
const be = (n: number): number[] => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const png = (w: number, h: number): Uint8Array => new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, ...be(w), ...be(h)]);
const blob = (head: Uint8Array, n: number): Blob => { const all = new Uint8Array(head.length + n); all.set(head); return new Blob([all]); };
test("10a D22 effect ids: a new effect is effect_<ULID> only; a saved setup_<ULID> effect is accepted for ever, saved again under its own id and file, never re-id'd", () => {
  const id = "setup_01JD0000000000000000000001", file = `effects/${id}.json`, fresh = `effect_${"0".repeat(26)}`;
  assert.equal(SAVE.id.test(fresh), true); assert.equal(SAVE.id.test(id), false);
  const bad = saveAndUse({ name: file, doc: null, values: { shake: 1 } }, { name: "o", doc: owner() }, { at, mint, id, label: "Fire", catalogueRev: 28 });
  assert.deepEqual(bad, { error: "invalidValue", message: "a new effect needs a fresh effect_<ULID> at effects/<id>.json" });
  const doc = blankEffect(id, "Fire", at, 28), out = saveAndUse({ name: file, doc, values: { shake: 1 } }, { name: "o", doc: owner() }, { at, mint, id, label: "Fire", catalogueRev: 28 });
  if ("error" in out) throw new Error(out.message);
  assert.equal(Object.keys(out.docs).includes(file), true); assert.equal(out.docs[file]?.["id"], id); assert.equal(valuesOf(out.docs["o"] ?? {})["effect"], id);
  assert.equal(Object.keys(out.docs).some((key) => key.includes("effect_")), false);
});
test("10a upload read: a 5000×10 PNG header plus 300 kB reads 65536 bytes; a GIF plus 300 kB reads 65536; a 96×144 PNG plus 300 kB and a JPG with no size marker in its head read the whole file; a small file reads whole", async () => {
  const wide = png(5000, 10), gif = new TextEncoder().encode("GIF89a"), fit = png(96, 144), jpg = new Uint8Array([255, 216, 255]), small = png(8, 8);
  assert.equal((await uploadBytes(blob(wide, extra))).length, 65536);
  assert.equal((await uploadBytes(blob(gif, extra))).length, 65536);
  assert.equal((await uploadBytes(blob(fit, extra))).length, fit.length + extra);
  assert.equal((await uploadBytes(blob(jpg, extra))).length, jpg.length + extra);
  assert.equal((await uploadBytes(new Blob([small]))).length, small.length);
});
test("10a writeBytes: a write that throws aborts the writable and rethrows; a good write closes it", async () => {
  const fake = (fail: boolean): { root: Dir; n: { abort: number; close: number } } => {
    const n = { abort: 0, close: 0 }, writable = { write: async () => { if (fail) throw new Error("full"); }, close: async () => { n.close += 1; }, abort: async () => { n.abort += 1; } };
    const handle = { getFile: async () => ({ text: async () => "" }), createWritable: async () => writable };
    const root: Dir = { getDirectoryHandle: () => Promise.resolve(root), getFileHandle: () => Promise.resolve(handle), removeEntry: () => Promise.resolve() };
    return { root, n };
  };
  const bad = fake(true); await assert.rejects(makerStore(bad.root).writeBytes("a/b.bin", new Uint8Array([1])), /full/); assert.deepEqual(bad.n, { abort: 1, close: 0 });
  const good = fake(false); await makerStore(good.root).writeBytes("a/b.bin", new Uint8Array([1])); assert.deepEqual(good.n, { abort: 0, close: 1 });
});
test("10a tidies: linkPx serves only its own shapes (play:link-constructor is undefined), and a link into a stage whose map is missing returns openProject's error", () => {
  assert.equal(pixelsOf("play:link-constructor"), undefined); assert.notEqual(pixelsOf("play:link-stairs"), undefined); assert.equal(pixelsOf("play:link-nope"), undefined);
  const files = { ...shopFiles() }, to = "stage_01JDES00000000000000000002"; delete files["maps/map_01JDEM00000000000000000002.json"];
  const party = { side: "player" as const, members: [{ unitId: "unit_01M81X2BX5ANZS5PWVAFHNCASA", hp: 20 }], bar: null }, got = arriveIn(files, "stage_01JDES00000000000000000001", to, party), plain = openProject(files, to);
  assert.equal(got.error, plain.error); assert.equal(got.docs === null, plain.docs === null); assert.notEqual(plain.error, "");
});
