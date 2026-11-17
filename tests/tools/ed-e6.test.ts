import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { INTENTS, intentFor, rampChips, recolour, tagsOf, tiles } from "../../tools/effect-designer/grid.ts";
import { PRESETS } from "../../tools/effect-designer/presets.ts";
import { opfsStore, type Dir } from "../../tools/effect-designer/store.ts";
import { preview, seen, STRIP, turn, VIEW0, zoom } from "../../tools/effect-designer/strip.ts";
const src = (rel: string): string => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8"), sheet = { id: "a", fw: 16, fh: 16, columns: 4 };
test("E6 chips (UX v3 §1.1): seven intents in order; the ability kind pre-selects only when obvious; the grid filters on effect.tags (first 4 only); every intent has a tile", () => {
  assert.deepEqual(INTENTS, ["slash", "shot", "burst", "aura", "heal", "buff", "ground"]);
  assert.deepEqual(["melee", "ranged", "area", "heal", "buff", "summon", "__proto__", 3, undefined].map(intentFor), ["slash", "shot", "ground", "heal", "buff", null, null, null, null]);
  assert.deepEqual(tiles(PRESETS, "burst", null).map((t) => t.id), ["pop", "scorch"]); assert.equal(tiles(PRESETS, null, null).length, PRESETS.length); for (const i of INTENTS) assert.ok(tiles(PRESETS, i, null).length > 0, i);
  assert.deepEqual(tagsOf({ tags: [{ id: "a" }, null, { id: 3 }, { id: "b" }, { id: "c" }, { id: "d" }] }), ["a", "b"]); assert.deepEqual(tagsOf({ tags: "slash" }), []);
});
test("E6 colour chips (CN-019 rule 6, CN-015): only ramps the style has, in option order, once; a tap recolours the knob and every step that names its own ramp; null keeps the same doc; inputs untouched", () => {
  assert.deepEqual(rampChips(["fire", "frost", "holy", "venom", "fire"], ["venom", "fire", "moss"]), ["fire", "venom"]); assert.deepEqual(rampChips(["fire"], []), []);
  const doc = { tint_ramp: "frost", steps: [{ kind: "stamp", tint_ramp: "holy" }, { kind: "flash" }, 7] }, copy = JSON.stringify(doc), out = recolour(doc, "fire");
  assert.deepEqual(out, { tint_ramp: "fire", steps: [{ kind: "stamp", tint_ramp: "fire" }, { kind: "flash" }, 7] }); assert.equal(JSON.stringify(doc), copy); assert.equal(recolour(doc, null), doc);
  assert.ok(tiles(PRESETS, null, "venom").every((t) => t.doc["tint_ramp"] === "venom")); assert.equal(PRESETS[0]?.doc["tint_ramp"], undefined);
});
test("E6 strip (scope R5, M8): Turn cycles S W N E on the stand-in caster; 1×–3× zoom, opening at 3× (UX default); off-screen pauses (same view when unchanged); one LiveFx on fx-live per preview", () => {
  let v = VIEW0; const faces: string[] = []; for (let i = 0; i < 5; i += 1) { faces.push(preview({}, v, 0, sheet).units[0]?.facing ?? ""); v = turn(v); } assert.deepEqual(faces, ["S", "W", "N", "E", "S"]);
  assert.equal(VIEW0.zoom, 3); assert.equal(zoom(VIEW0, 1).zoom, 1); assert.equal(seen(VIEW0, true), VIEW0); assert.equal(seen(VIEW0, false).visible, false); assert.deepEqual(STRIP.zooms, [1, 2, 3]);
  const p = preview(PRESETS[0]?.doc ?? {}, VIEW0, 120, sheet); assert.equal(p.effects.length, 1); const fx = p.effects[0];
  assert.deepEqual([fx?.id, fx?.caster, fx?.target, fx?.castMs, fx?.loopMs, fx?.pieces.length], ["preview", "me", "foe", 120, STRIP.loopMs, 2]); assert.deepEqual(p.units.map((u) => [u.id, u.at.c]), [["me", 0], ["foe", 2]]); assert.equal(preview({}, VIEW0, 0, sheet).effects[0]?.pieces.length, 0);
});
test("E6 OPFS store: a missing file reads null; write makes nested folders and reads back; remove of a missing file is fine; other errors are thrown", async () => {
  const nf = (): Error => Object.assign(new Error("nf"), { name: "NotFoundError" }), files = new Map<string, string>();
  const dir = (path: string): Dir => ({ getDirectoryHandle: (name, o) => (o?.create === true || [...files.keys()].some((k) => k.startsWith(`${path}${name}/`)) ? Promise.resolve(dir(`${path}${name}/`)) : Promise.reject(nf())),
    getFileHandle: (name, o) => { const k = `${path}${name}`; if (name === "boom") return Promise.reject(new Error("quota")); if (!files.has(k) && o?.create !== true) return Promise.reject(nf()); return Promise.resolve({ getFile: () => Promise.resolve({ text: () => Promise.resolve(files.get(k) ?? "") }), createWritable: () => { let buf = ""; return Promise.resolve({ write: (t: string) => { buf += t; return Promise.resolve(); }, close: () => { files.set(k, buf); return Promise.resolve(); } }); } }); },
    removeEntry: (name) => (files.delete(`${path}${name}`) ? Promise.resolve() : Promise.reject(nf())) });
  const s = opfsStore(dir("")); assert.equal(await s.read("effects/a.json"), null); await s.write("effects/a.json", "{}\n"); assert.equal(await s.read("effects/a.json"), "{}\n"); assert.deepEqual([...files.keys()], ["effects/a.json"]);
  await s.remove("effects/a.json"); await s.remove("effects/a.json"); assert.equal(files.size, 0); await assert.rejects(s.read("boom"), /quota/);
});
test("E6 page: Save & use through saveAndUse + commit, Undo through undoGroup with the undoStep fallback and the trash move (D6.2), a setup_<ULID> mint (D6.1), storage errors toasted (QA E6 note 1), a bad owner file refused by name (QA E6 r2 S1), IntersectionObserver pause, OPFS only, pixelated strip; the device page build stays without it", () => {
  const page = src("tools/effect-designer/page.ts"), html = src("tools/effect-designer/index.html");
  for (const s of ["saveAndUse(", "commit(store", "undoGroup(", "undoStep(", "new IntersectionObserver(", "navigator.storage.getDirectory()", "Designing for", "One undo.", "{ moves: got.moves }", "{ absent: out.absent }", "taken: [...taken]", "for (const t of trash) await store.remove(t)", "Not saved: storage error", "ownerOf(ownerFile, await store.read(ownerFile)); if (\"error\" in read) { say(read.message); return; }", "revs[ownerFile] = read.doc === null ? null : Number(read.doc[\"rev\"])", "Not undone: storage error", "minter("]) assert.ok(page.includes(s), s);
  assert.ok(!/localStorage|sessionStorage|indexedDB|fetch\(|Math\.random|\bhp\b|damage|mana/.test(page)); assert.match(html, /<canvas id="strip">/); assert.match(html, /Save &amp; use/); assert.match(html, /button\{min-width:48px;min-height:48px/); assert.equal((page.match(/\} catch \(e\) \{ say\(/g) ?? []).length, 3, "all three handlers catch"); assert.match(html, /#strip\{[^}]*image-rendering:pixelated/);
  assert.ok(!src("tools/device-page/page.ts").includes("effect-designer"));
});
