import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { Child } from "../../src/editor/effect/dice.ts";
import { blankDoc, HOUSE } from "../../src/editor/effect/house.ts";
import { blend, impactMarks, keyOf, meter } from "../../src/editor/effect/merge.ts";
import { stepsOf } from "../../src/runtime/render/fx-doc.ts";
import { beatRow, chips, cycle, houseOf, keysOf, meterText, mixed, mixer, page3, PAGE2, shelve, snap, swap, take, toggle, trimLine, type Card } from "../../tools/effect-designer/mixer.ts";
import { PRESETS } from "../../tools/effect-designer/presets.ts";
import { fitZoom } from "../../tools/effect-designer/strip.ts";
let n = 0; const mint = (p: string): string => `${p}${String((n += 1)).padStart(4, "0")}`, src = (p: string): string => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const P = (label: string): Card => { const p = PRESETS.find((x) => x.label === label); if (p === undefined) throw new Error(label); return { id: p.id, rev: 0, label: p.label, doc: p.doc }; };
const layers = (d: Card["doc"]): string[] => stepsOf(d).map((_, i) => keyOf(d, i).split(":")[0] ?? "");
test("E7 page 2: layer chips (UX-L1): one per used layer in kind order with steps per beat; punch from its knobs alone; the A/B badge is the side that won the layer, A+B when its beats differ", () => {
  assert.deepEqual(chips(P("Slash arc").doc).map((c) => c.layer), ["shape", "punch"]); assert.deepEqual(chips(P("Mend").doc).map((c) => c.layer), ["shape", "sparks"]); assert.deepEqual(chips({}), []);
  assert.deepEqual(chips({ shake: 1 }), [{ layer: "punch", beats: { cast: 0, travel: 0, hit: 0, linger: 0 }, badge: null }]); assert.deepEqual(chips({ shake: 0, squash: false }), []);
  const d = P("Mend").doc, c = chips(d); assert.equal(c.reduce((s, x) => s + Object.values(x.beats).reduce((a, b) => a + b, 0), 0), stepsOf(d).length);
  assert.deepEqual(chips(d, { "shape:cast": "a", "shape:hit": "a", "sparks:hit": "b", "sparks:linger": "a" }).map((x) => x.badge), ["a", "both"]); assert.equal(chips(d, { "shape:cast": "b" })[0]?.badge, "b");
});
test("E7 page 2: meter + trim line: particles and draws against their caps; the trim/fix line is never silent and the page draws its Undo; nothing trimmed, no line", () => {
  const m = meter(P("Pop").doc); assert.match(meterText(m), /^Particles \d+ of 48 · Draws \d+ of 60$/); assert.equal(trimLine(m), null);
  const r = mixed(mixer(P("Slash arc"), P("Arrow")), mint); assert.ok(r.messages.length > 0); assert.equal(trimLine(r.meter), r.messages.join(" · ")); assert.ok(!(trimLine(r.meter) ?? "").endsWith("Undo"));
  assert.equal(meterText({ ...m, particles: { n: 60, cap: 48 } }).startsWith("Particles 60 of 48"), true);
});
test("E7 page 2: beat row (Advanced, UX-L2): Cast, Travel, Hit, Linger in order, each with its steps and its span from impactMarks; Travel has no 'arrives later' label (E2 is merged)", () => {
  for (const p of PRESETS) { const row = beatRow(p.doc), marks = impactMarks(p.doc); assert.deepEqual(row.map((b) => b.beat), ["cast", "travel", "hit", "linger"]); assert.equal(row.reduce((s, b) => s + b.steps, 0), stepsOf(p.doc).length, p.label); for (const b of row) assert.deepEqual(b.span, marks.beats[b.beat] ?? null); }
  for (const f of ["tools/effect-designer/page.ts", "tools/effect-designer/mixer.ts", "tools/effect-designer/index.html"]) assert.ok(!/arrives in a later update|arrives later/i.test(src(f).replace("(no \"arrives later\" label)", "")), f);
});
test("E7 page 2: Blend card (UX-L3): Swap flips the base, Mix snaps to 0/25/50/75/100 (bad input 50), a key cycles Both → A → B → Mix → Both, keys in kind then beat order with punch:hit when either side punches; the result is blend() itself", () => {
  const m = mixer(P("Slash arc"), P("Mend")); assert.equal(m.base, "a"); assert.equal(swap(m).base, "b"); assert.equal(swap(swap(m)).base, "a");
  assert.deepEqual([37, 38, -9, 140, Number.NaN].map((v) => snap(m, v).mix), [25, 50, 0, 100, 50]); let c = m; const seen: string[] = []; for (let i = 0; i < 4; i += 1) { c = cycle(c, "shape:cast"); seen.push(c.picks["shape:cast"] ?? ""); } assert.deepEqual(seen, ["a", "b", "mix", "both"]);
  const keys = keysOf(m); assert.ok(keys.includes("punch:hit")); const rank = (k: string): number => ["shape", "colour", "sparks", "light", "punch", "trail"].indexOf(k.split(":")[0] ?? "") * 10 + ["cast", "travel", "hit", "linger"].indexOf(k.split(":")[1] ?? ""); assert.deepEqual(keys, [...keys].sort((x, y) => rank(x) - rank(y))); assert.equal(new Set(keys).size, keys.length); assert.equal(PAGE2.picks.length, 4);
  assert.ok(!keysOf(mixer(P("Arrow"), P("Halo"))).includes("punch:hit")); const s = snap(swap(cycle(m, "sparks:hit")), 75); n = 0; const a = mixed(s, mint); n = 0; assert.deepEqual(a, blend(s.a, s.b, { base: "b", mix: 75, mint, picks: { "sparks:hit": "a" } }));
});
test("E7 page 2: Take a layer (UX-L4): the base keeps all its other layers, the taken layer comes only from the other card; punch takes the knobs", () => {
  const base = P("Arrow"), other = P("Pop"), r = take(base, other, "sparks", mint); const got = layers(r.doc);
  assert.equal(got.filter((l) => l === "shape").length, layers(base.doc).filter((l) => l === "shape").length); assert.equal(got.filter((l) => l === "sparks").length, layers(other.doc).filter((l) => l === "sparks").length); assert.ok(got.includes("sparks"));
  for (const k of ["hit_stop_ms", "shake"]) assert.equal(r.doc[k], base.doc[k], `${k} stays the base's`); const p = take(base, other, "punch", mint); assert.equal(p.doc["hit_stop_ms"], other.doc["hit_stop_ms"]); assert.ok(!layers(p.doc).includes("sparks"));
  assert.ok(Object.values(r.badges).every((v) => v === "a" || v === "b"));
});
test("E7 page 2: shelf (UX-L5) and Breed pages (UX-B1): newest first, one per id, ≤48; picks toggle, ≤3 (oldest drops); 6 children 3 at a time, pages wrap, bad input is page 0", () => {
  let shelf: Card[] = []; for (let i = 0; i < 50; i += 1) shelf = shelve(shelf, { ...P("Pop"), id: `c${i % 49}` }); assert.equal(shelf.length, 48); assert.equal(shelf[0]?.id, "c0"); assert.equal(new Set(shelf.map((c) => c.id)).size, 48); assert.deepEqual(shelve(shelve([P("Pop")], P("Mend")), P("Pop")).map((c) => c.label), ["Pop", "Mend"]);
  assert.deepEqual(toggle(toggle(toggle(toggle([], "a"), "b"), "c"), "d"), ["b", "c", "d"]); assert.deepEqual(toggle(["a", "b"], "a"), ["b"]);
  const kids = Array.from({ length: 6 }, (_, i) => ({ seed: i }) as unknown as Child); assert.deepEqual(page3(kids, 0).shown.map((k) => k.seed), [0, 1, 2]); assert.deepEqual(page3(kids, 1).shown.map((k) => k.seed), [3, 4, 5]);
  assert.equal(page3(kids, 2).at, 0); assert.equal(page3(kids, -1).at, 1); assert.equal(page3(kids, Number.NaN).at, 0); assert.deepEqual(page3([], 3), { at: 0, shown: [] });
});
test("E7 page 2: house style (UX-L7): the page's stand-in effectHouse goes through readHouse; only a blank doc gets it; a ramp the style lacks is dropped", () => {
  const h = houseOf(2, true, "fire", ["fire", "frost"]), d = blankDoc(h, mint); assert.deepEqual(h, { ramps: ["fire"], punch: 2, motes: true });
  for (const [k, v] of Object.entries(HOUSE.punch[2] ?? {})) assert.equal(d[k], v); assert.equal(stepsOf(d)[0]?.["particle_motion"], "rise"); assert.equal(stepsOf(d)[0]?.["tint_ramp"], "fire");
  assert.deepEqual(houseOf(0, false, "venom", ["fire"]), { ramps: [], punch: 0, motes: false }); assert.deepEqual(stepsOf(blankDoc(houseOf(0, false, null, []), mint)), []);
});
test("E7 page 2, page: page 2 sits below Save & use (the Save path stays 3 taps), every row is wired, randomness from crypto, one live strip", () => {
  const page = src("tools/effect-designer/page.ts"), html = src("tools/effect-designer/index.html");
  assert.ok(html.indexOf('id="save"') < html.indexOf('id="layers"')); for (const id of ["layers", "meter", "dice", "shelf", "blend", "breed", "house", "beats", "picks"]) { assert.ok(html.includes(`id="${id}"`), id); assert.ok(page.includes(`"${id}"`), id); }
  for (const s of ["chips(doc, badges)", "meterText(m)", "trimLine(m)", "pushRoll(rolls, s)", "roll(anchor, l, s)", "shelve(shelf, cardOf(chosen))", "toggle(picked, c.id)", "take(base, one, c.layer, mint)", "blendNow(swap(mm))", "blendNow(snap(mm, v))", "blendNow(cycle(mm, k))", "breed(sel(), { seed: seed(), mint })", "page3(kids, at)", "blankDoc(houseOf(punch, motes, ramp, styleRamps), mint)", "beatRow(doc)", "crypto.getRandomValues(new Uint32Array(1))", "Blend with…", "Next 3", "page2();"]) assert.ok(page.includes(s), s);
  assert.ok(!/Math\.random|localStorage|createDriver\([^]*createDriver\(/.test(page)); for (const f of [page, src("tools/effect-designer/mixer.ts")]) assert.ok(!/localStorage|sessionStorage|indexedDB/.test(f), "DSK D8.2: shelf and house style in page memory only"); assert.match(html, /<details class="row"><summary>Advanced<\/summary>/);
});
test("E7 page 2: the strip opens at the largest integer scale that fits its card, never under 3 (UX r2): 390 x 253 at 3 dpr is 23, 360 wide is 22 (about 7x css), tiny or bad sizes are 3; Fit returns to it", () => {
  assert.equal(fitZoom(390, 253, 3, 48, 32), 23); assert.equal(fitZoom(360, 253, 3, 48, 32), 22); assert.equal(fitZoom(390, 60, 3, 48, 32), 5, "the card height bounds it too"); assert.equal(fitZoom(390, 253, 1, 48, 32), 7);
  for (const [w, h, d] of [[40, 30, 1], [0, 0, 3], [Number.NaN, 100, 3], [100, 100, Number.NaN]] as const) assert.equal(fitZoom(w, h, d, 48, 32), 3);
  const page = src("tools/effect-designer/page.ts"); for (const s of ["STRIP.rows * 16); view = zoom(view, fit());", 'chip("checks", "Fit", view.zoom === fit()', "fitZoom(canvas.clientWidth, canvas.clientHeight, devicePixelRatio, STRIP.cols * 16, STRIP.rows * 16)"]) assert.ok(page.includes(s), s);
});
