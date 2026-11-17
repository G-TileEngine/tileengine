import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { breed } from "../../src/editor/effect/dice.ts";
import { commit, redoGroup, SAVE, saveAndUse, trashGone, trashOf, undoGroup, type Store } from "../../src/editor/effect/save.ts";
import { canonStep, valuesOf, write, type Row } from "../../src/editor/effect/writer.ts";
import { opfsStore, purgeTrash, type Dir } from "../../tools/effect-designer/store.ts";
import { B32, minter, ulid } from "../../tools/effect-designer/ulid.ts";
let n = 0; const mint = (p: string): string => `${p}${String((n += 1)).padStart(4, "0")}`, at = "2026-11-17T02:00:00.000Z";
const ID = "setup_01JD0000000000000000000001", E = `effects/${ID}.json`, ops = (d: Row | undefined): Row[] => ((d?.["history"] as { ops: Row[] } | undefined)?.ops ?? []);
const owner0 = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 4, behaviourId: "basic-attack", answers: {}, orphans: {}, history: { cap: 200, baseSeq: 3, ops: [] } });
const mem = (): Store & { files: Map<string, string> } => { const files = new Map<string, string>(); return { files, read: (k) => Promise.resolve(files.get(k) ?? null), write: (k, t) => { files.set(k, t); return Promise.resolve(); }, remove: (k) => { files.delete(k); return Promise.resolve(); } }; };
const saved = (): Exclude<ReturnType<typeof saveAndUse>, { error: string }> => { const out = saveAndUse({ name: E, doc: null, values: { shake: 2 } }, { name: "o", doc: owner0() }, { at, mint, id: ID, label: "Fire", catalogueRev: 28 }); if ("error" in out) throw new Error(out.message); return out; };
test("E7 carries S3: the setup_<ULID> mint is DOM-free; 26 Crockford chars, time first so later sorts later, every random byte used, a bad clock reads 0", () => {
  assert.equal(B32, "0123456789ABCDEFGHJKMNPQRSTVWXYZ"); const bytes = Uint8Array.from({ length: 16 }, (_, i) => i * 7 + 1), a = ulid(1_763_340_000_000, bytes);
  assert.match(`setup_${a}`, SAVE.id); assert.ok(ulid(1_763_340_000_001, bytes) > a); assert.equal(ulid(Number.NaN, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(-5, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(33.7, new Uint8Array(16)), ulid(33, new Uint8Array(16))); assert.equal(ulid(33.7, new Uint8Array(16)).slice(8, 10), "11");
  for (let i = 0; i < 16; i += 1) { const b = Uint8Array.from(bytes); b[i] = (b[i] ?? 0) + 1; assert.notEqual(ulid(1_763_340_000_000, b), a, `byte ${i} is used`); }
  const asked: number[] = [], m = minter(() => 32, (k) => { asked.push(k); return new Uint8Array(k).fill(31); }); assert.equal(m("setup_"), `setup_${"0".repeat(8)}10${"Z".repeat(16)}`); assert.deepEqual(asked, [16]);
});
test("E7 carries S2: opfsStore lists a dir's file names sorted (OPFS keys()); a missing dir lists none; another error is thrown", async () => {
  const nf = (): Error => Object.assign(new Error("nf"), { name: "NotFoundError" }), tree: Record<string, string[]> = { "effects/": [".deleted"], "effects/.deleted/": ["b.json", "a.json"] };
  const dir = (path: string): Dir => ({ getDirectoryHandle: (name) => (name === "boom" ? Promise.reject(new Error("io")) : tree[`${path}${name}/`] === undefined ? Promise.reject(nf()) : Promise.resolve(dir(`${path}${name}/`))), getFileHandle: () => Promise.reject(nf()), removeEntry: () => Promise.resolve(),
    keys: async function* () { for (const k of tree[path] ?? []) yield await Promise.resolve(k); } });
  const s = opfsStore(dir("")); assert.deepEqual(await s.list(SAVE.trash), ["a.json", "b.json"]); assert.deepEqual(await s.list("nope/"), []); await assert.rejects(s.list("boom/"), /io/);
});
test("E7 carries redo across documents (E6 carry): Redo puts back exactly what Save & use wrote, owner by writer.redo and the created doc moved back from effects/.deleted/; refused when the owner moved on or the name is taken", async () => {
  const out = saved(), store = mem(), revs: Record<string, number | null> = { o: null, [E]: null };
  assert.ok(!("error" in await commit(store, out.docs, revs, { absent: out.absent }))); const after = { ...Object.fromEntries([...store.files].map(([k, v]) => [k, JSON.parse(v) as Row])) };
  for (const [k, d] of Object.entries(out.docs)) revs[k] = Number(d["rev"] ?? 0);
  const un = undoGroup(out.docs, out.entry, at); if ("error" in un) throw new Error(un.error); assert.ok(!("error" in await commit(store, un.docs, revs, { moves: un.moves })));
  assert.deepEqual([...store.files.keys()].sort(), [trashOf(E), "o"]); for (const m of un.moves) { revs[m.from] = null; revs[m.to] = Number(m.doc["rev"] ?? 0); } revs["o"] = Number(un.docs["o"]?.["rev"] ?? 0);
  const re = redoGroup(un.docs, out.entry, un.moves, at); if ("error" in re) throw new Error(re.error);
  assert.deepEqual(re.moves.map((m) => [m.from, m.to]), [[trashOf(E), E]]); assert.deepEqual(valuesOf(re.docs["o"] ?? {}), valuesOf(out.docs["o"] ?? {})); assert.equal(ops(re.docs["o"]).at(-1)?.["kind"], "redo"); assert.ok(ops(re.docs["o"]).slice(-1).every((op) => op["group"] === out.entry.group));
  assert.ok(!("error" in await commit(store, re.docs, revs, { moves: re.moves }))); assert.deepEqual([...store.files.keys()].sort(), [E, "o"]); const back = JSON.parse(store.files.get(E) ?? "") as Row; assert.deepEqual(valuesOf(back), valuesOf(after[E] ?? {})); assert.deepEqual(ops(back).map((op) => op["kind"]), ["set", "undo", "redo"]); assert.equal(back["rev"], 3);
  const moved = write(un.docs["o"] ?? {}, { range: 3 }, { at, mint }); assert.deepEqual(redoGroup({ ...un.docs, o: moved }, out.entry, un.moves, at), { error: SAVE.refused, name: "o" }, "the owner moved on: no redo");
  assert.deepEqual(redoGroup({ ...un.docs, [E]: {} }, out.entry, un.moves, at), { error: SAVE.refused, name: E }, "the name is taken"); assert.deepEqual(redoGroup(un.docs, out.entry, [], at), { error: SAVE.refused, name: E }, "no trash move: refused");
  assert.deepEqual(redoGroup(out.docs, out.entry, un.moves, at), { error: SAVE.refused, name: E }, "nothing undone: refused");
});
test("E7 carries QA E5 report-only writer items: the next seq is past the highest ([5, 3] goes on at 6); flash_seconds NaN or Infinity is not turned into flash_ms; a hole, [] or a doc-less Breed parent is skipped, never thrown", () => {
  const d = { kind: "effect", rev: 2, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [{ seq: 5, at, kind: "set", changes: [] }, { seq: 3, at, kind: "set", changes: [] }] } };
  assert.equal(ops(write(d, { shake: 1 }, { at, mint })).at(-1)?.["seq"], 6); assert.equal(ops(write({ ...d, history: { cap: 200, baseSeq: 9, ops: [] } }, { shake: 1 }, { at, mint })).at(-1)?.["seq"], 10);
  for (const v of [Number.NaN, Number.POSITIVE_INFINITY]) assert.deepEqual(canonStep({ flash_seconds: v }), { flash_seconds: v }); assert.deepEqual(canonStep({ flash_seconds: 0.25 }), { flash_ms: 250 });
  const A = { id: "a", rev: 1, doc: { steps: [{ kind: "stamp", start_at: 0, colour: "fire" }] } }, B = { id: "b", rev: 1, doc: { steps: [{ kind: "stamp", start_at: 0, colour: "ice" }] } }, k = (): number => { n = 0; return 0; };
  k(); const ref = JSON.stringify(breed([A, null, B], { seed: 4, mint })); assert.ok(ref.length > 2);
  for (const hole of [[], undefined, { id: "x", rev: 1 }, 7]) { k(); assert.equal(JSON.stringify(breed([A, hole as never, B], { seed: 4, mint })), ref, String(hole)); }
});
test("E7 carries, page: the mint comes from ulid.ts, a reload purges effects/.deleted/ (S2), Redo after Undo through redoGroup with its storage error toasted, a new Save closes the redo", () => {
  const page = readFileSync(new URL("../../tools/effect-designer/page.ts", import.meta.url), "utf8");
  for (const s of ['import { minter } from "./ulid.ts";', "minter(() => Date.now(), (n) => crypto.getRandomValues(new Uint8Array(n)))", "await purgeTrash(store);", "const gone = trashGone(r, got.moves); if (gone !== null) undone = null;", "Not redone: its deleted copy is gone (a reload cleared it, maybe in another tab). Nothing was changed.", "redoGroup(docs, undone.entry, undone.moves,", "say(\"Undone.\"); redoBtn();", "Not redone: storage error", "trash = []; undone = null;", "revs[m.to] = Number(m.doc[\"rev\"] ?? 0)"]) assert.ok(page.includes(s), s);
  assert.ok(!/const B32|Math\.random|localStorage/.test(page));
});
test("E7 carries DSK D8.1(a): a redo whose .deleted copy is gone fails cleanly: nothing written, the missing file named so the page drops only that redo; any other refusal or a success names nothing", async () => {
  const out = saved(), store = mem(), revs: Record<string, number | null> = { o: null, [E]: null }; await commit(store, out.docs, revs, { absent: out.absent }); for (const [k, d] of Object.entries(out.docs)) revs[k] = Number(d["rev"] ?? 0);
  const un = undoGroup(out.docs, out.entry, at); if ("error" in un) throw new Error(un.error); await commit(store, un.docs, revs, { moves: un.moves }); for (const m of un.moves) { revs[m.from] = null; revs[m.to] = Number(m.doc["rev"] ?? 0); } revs["o"] = Number(un.docs["o"]?.["rev"] ?? 0);
  await store.remove(trashOf(E)); const before = new Map(store.files), re = redoGroup(un.docs, out.entry, un.moves, at); if ("error" in re) throw new Error(re.error);
  const r = await commit(store, re.docs, revs, { moves: re.moves }); assert.ok("error" in r); assert.equal(trashGone(r, re.moves), trashOf(E)); assert.deepEqual(store.files, before, "nothing written, no partial file");
  assert.equal(trashGone({ error: "staleRev", name: "o", want: 5, got: 6 }, re.moves), null); assert.equal(trashGone({ error: "staleRev", name: trashOf(E), want: 1, got: 2 }, re.moves), null, "a changed copy is a plain staleRev"); assert.equal(trashGone({ saved: [], moved: [] }, re.moves), null);
});
test("E7 carries DSK D8.1(b): the reload purge removes only *.json files directly in effects/.deleted/; live effects/*.json and sub-folders are never touched", async () => {
  const files = new Set(["effects/live.json", "effects/.deleted/a.json", "effects/.deleted/b.json", "setups/o.json"]), gone: string[] = [], nf = (): Error => Object.assign(new Error("nf"), { name: "NotFoundError" });
  const kids = (path: string): string[] => [...new Set([...files].filter((f) => f.startsWith(path)).map((f) => f.slice(path.length).split("/")[0] ?? ""))].concat(path === "effects/.deleted/" ? ["old"] : []);
  const dir = (path: string): Dir => ({ getDirectoryHandle: (name) => (kids(path).includes(name) ? Promise.resolve(dir(`${path}${name}/`)) : Promise.reject(nf())), getFileHandle: () => Promise.reject(nf()), removeEntry: (name) => { gone.push(`${path}${name}`); files.delete(`${path}${name}`); return Promise.resolve(); }, keys: async function* () { for (const k of kids(path)) yield await Promise.resolve(k); } });
  assert.deepEqual(await purgeTrash(opfsStore(dir(""))), ["a.json", "b.json"]); assert.deepEqual(gone, ["effects/.deleted/a.json", "effects/.deleted/b.json"]); assert.deepEqual([...files].sort(), ["effects/live.json", "setups/o.json"]);
  assert.deepEqual(await purgeTrash({ list: () => Promise.resolve(["../live.json", "x/y.json", "c.json"]), remove: (n) => { gone.push(n); return Promise.reject(new Error("io")); } }), ["c.json"], "a failed remove is best-effort; odd names are skipped"); assert.equal(gone.at(-1), "effects/.deleted/c.json");
});
