import assert from "node:assert/strict";
import { test } from "node:test";
import { blankEffect, commit, notesOf, ownerOf, SAVE, saveAndUse, trashOf, undoGroup, undoStep, type Store } from "../../src/editor/effect/save.ts";
import { undo, valuesOf, write, type Row } from "../../src/editor/effect/writer.ts";
let n = 0; const mint = (p: string): string => `${p}${String((n += 1)).padStart(4, "0")}`, at = "2026-11-17T01:00:00.000Z";
const ops = (d: Row): Row[] => (d["history"] as { ops: Row[] }).ops;
const doc0 = (): Row => blankEffect("setup_E", "Fire", at, 28);
const owner0 = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 4, behaviourId: "basic-attack", answers: { range: { source: "user", value: 1, rev: 1 } }, orphans: {}, history: { cap: 200, baseSeq: 3, ops: [] } });
const ID = (k: number): string => `setup_01JD${String(k).padStart(22, "0")}`, FILE = (k: number): string => `effects/${ID(k)}.json`, E = FILE(1);
const use = (values: Row, doc: Row | null = null, owner: Row = owner0(), k = 1): Exclude<ReturnType<typeof saveAndUse>, { error: string }> => { const out = saveAndUse({ name: FILE(k), doc, values }, { name: "o", doc: owner }, { at, mint, id: ID(k), label: "Fire", catalogueRev: 28 }); if ("error" in out) throw new Error(out.message); return out; };
const mem = (): Store & { files: Map<string, string> } => { const files = new Map<string, string>(); return { files, read: (k) => Promise.resolve(files.get(k) ?? null), write: (k, t) => { files.set(k, t); return Promise.resolve(); }, remove: (k) => { files.delete(k); return Promise.resolve(); } }; };
test("E6 writer no-op (QA E5 should-fix): another key order or an extra field writes nothing; a value object in another key order too; a real change still logs one op", () => {
  const d = { ...doc0(), answers: { shake: { value: 2, note: "x", source: "user", rev: 3 }, look: { source: "user", value: { b: 2, a: 1 }, rev: 1 } } };
  assert.equal(write(d, { shake: 2 }, { at, mint }), d); assert.equal(write(d, { look: { a: 1, b: 2 } }, { at, mint }), d); assert.equal(write(d, { shake: 2, look: { a: 1, b: 2 } }, { at, mint }), d);
  const t = { ...doc0(), answers: { tags: { source: "user", value: [{ label: "Slash", id: "slash" }], rev: 1 } } }; assert.equal(write(t, { tags: [{ id: "slash", label: "Slash" }] }, { at, mint }), t, "list items compare key-order-free too");
  const w = write(d, { shake: 3 }, { at, mint }); assert.equal(ops(w).length, 1); assert.equal(w["rev"], 1); assert.deepEqual((w["answers"] as Row)["shake"], { note: "x", source: "user", value: 3, rev: 4 });
});
test("E6 S8 fallback: a refused group undo undoes the top op alone; undo(…, {alone}) takes one op; undoStep never sticks while ops are open", () => {
  let d = write(doc0(), { shake: 1 }, { at, mint, group: "grp_g" }); d = write(d, { shake: 2 }, { at, mint }); d = write(d, { squash: true }, { at, mint, group: "grp_g" });
  assert.equal(undo(d, at), d, "E5 refusal stands"); const a = undoStep(d, at); assert.deepEqual(valuesOf(a), { shake: 2 }); assert.equal(ops(a).length, 4); assert.equal(ops(a)[3]?.["target"], 3);
  const b = undoStep(a, at); assert.deepEqual(valuesOf(b), { shake: 1 }); const c = undoStep(b, at); assert.deepEqual(valuesOf(c), {}); assert.equal(undoStep(c, at), c);
  const g = write(write(doc0(), { shake: 1 }, { at, mint, group: "grp_h" }), { squash: true }, { at, mint, group: "grp_h" }); assert.deepEqual(valuesOf(undoStep(g, at)), {}, "an unrefused group still undoes whole"); assert.deepEqual(valuesOf(undo(g, at, { alone: true })), { shake: 1 });
});
test("E6 notes (E5 r3 S1–S3 carries): invalidValue for prototype-name knobs, a loaded __proto__ answer, junk ops and non-record list items; clean input has none", () => {
  const values = JSON.parse('{"__proto__": 1, "constructor": 2, "steps": [1, {"kind": "stamp"}, null], "parts": ["x"]}') as Row, d = { ...doc0(), answers: JSON.parse('{"__proto__": {"source": "user", "value": 1}}') as Row, history: { cap: 200, baseSeq: 0, ops: [null, { seq: "5", changes: [] }, { seq: 1, changes: [] }] } };
  const got = notesOf(d, values).map((x) => `${x.code}|${x.message}`);
  assert.deepEqual(got, ['invalidValue|knob "__proto__" skipped', 'invalidValue|knob "constructor" skipped', 'invalidValue|answers["__proto__"] ignored', "invalidValue|2 history op(s) dropped", "invalidValue|2 non-record steps item(s) dropped", "invalidValue|1 non-record parts item(s) dropped"]);
  assert.deepEqual(notesOf(doc0(), { shake: 1, steps: [{ kind: "stamp" }] }), []); assert.deepEqual(notesOf(doc0()), []);
});
test("E6 Save & use (K-5, setup §4 rule 10): a new effect doc and the owner's effect answer, one grp_ group across both, one entry; the new doc is a v3 effect envelope", () => {
  const out = use({ shake: 1, steps: [{ kind: "stamp", start_at: 10 }] }), e = out.docs[E] ?? {}, o = out.docs["o"] ?? {}, group = out.entry.group;
  assert.match(group, /^grp_/); assert.deepEqual(out.entry.docs, [E, "o"]); assert.deepEqual(out.entry.created, [E]); assert.deepEqual(out.absent, [`effects/.deleted/${ID(1)}.json`]);
  assert.equal(ops(e)[0]?.["group"], group); assert.equal(ops(o)[0]?.["group"], group); assert.equal(ops(o)[0]?.["seq"], 4); assert.deepEqual(valuesOf(o), { range: 1, [SAVE.knob]: ID(1) });
  assert.deepEqual([e["kind"], e["formatVersion"], e["behaviourId"], e["id"], e["name"], (e["catalogue"] as Row)["rev"], e["rev"], e["createdAt"], e["updatedAt"], e["copiedFrom"]], ["behaviour-setup", 3, "effect", ID(1), "Fire", 28, 1, at, at, null]);
  assert.equal(((valuesOf(e)["steps"] as Row[])[0] ?? {})["start_at_ms"], 10, "written through the E5 writer (M6)"); assert.deepEqual(out.notes, []);
  const again = use(valuesOf(e), e, o); assert.deepEqual(again.entry.docs, [], "nothing changed: no doc in the entry"); assert.deepEqual(again.entry.created, []); assert.deepEqual(again.absent, []);
  assert.deepEqual(use(JSON.parse('{"__proto__": 1, "shake": 1}') as Row).notes.map((x) => x.message), ['knob "__proto__" skipped'], "Save & use returns the notes");
});
test("E6 D6.1 (DSK ed2e705f): a new effect's id is a fresh setup_<ULID>, never reused, at effects/<id>.json; anything else is invalidValue and writes nothing", () => {
  const ask = (id: string, name: string, taken?: string[]): ReturnType<typeof saveAndUse> => saveAndUse({ name, doc: null, values: { shake: 1 } }, { name: "o", doc: owner0() }, { at, mint, id, label: "F", catalogueRev: 28, ...(taken === undefined ? {} : { taken }) });
  for (const [id, name] of [["setup_E", "effects/setup_E.json"], [`setup_01JD${"0".repeat(21)}`, "x"], [`setup_01JD${"0".repeat(21)}I`, "x"], [`setup_01jd${"0".repeat(22)}`, "x"], [`grp_01JD${"0".repeat(22)}`, "x"], [ID(2), `effects/${ID(3)}.json`], [ID(2), `${ID(2)}.json`], [ID(2), `effects/.deleted/${ID(2)}.json`]]) assert.equal((ask(id ?? "", name === "x" ? `effects/${id ?? ""}.json` : name ?? "") as { error?: string }).error, "invalidValue", `${id ?? ""} ${name ?? ""}`);
  assert.match((ask(ID(2), FILE(2), [ID(2)]) as { message: string }).message, /fresh setup_<ULID> at effects\/<id>\.json/); assert.ok(!("error" in ask(ID(2), FILE(2), [ID(1)]))); assert.ok(!("error" in ask(`setup_7ZZZZZZZZZ${"Z".repeat(16)}`, `effects/setup_7ZZZZZZZZZ${"Z".repeat(16)}.json`)));
  assert.ok(!("error" in saveAndUse({ name: "anything", doc: blankEffect(ID(4), "F", at, 28), values: { shake: 1 } }, { name: "o", doc: owner0() }, { at, mint, id: ID(4), label: "F", catalogueRev: 28, taken: [ID(4)] })), "an existing doc is not re-minted");
  assert.equal(trashOf(E), `effects/.deleted/${ID(1)}.json`); assert.equal(trashOf("x.json"), "effects/.deleted/x.json");
});
test("E6 undoGroup (D6.2): both docs as one entry, newest document first; the created doc moves to effects/.deleted/<id>.json with its history; refused with 'changed since' if either doc has a later op, nothing half-undone", () => {
  const out = use({ shake: 1 });
  const ok = undoGroup(out.docs, out.entry, at); assert.ok(!("error" in ok)); assert.deepEqual(Object.keys(ok.docs), ["o"]); assert.deepEqual(valuesOf(ok.docs["o"] ?? {}), { range: 1 }); assert.equal(ops(ok.docs["o"] ?? {})[1]?.["kind"], "undo");
  assert.deepEqual(ok.moves.map((m) => [m.from, m.to]), [[E, `effects/.deleted/${ID(1)}.json`]]); const moved = ok.moves[0]?.doc ?? {}; assert.deepEqual(ops(moved).map((x) => x["kind"]), ["set", "undo"], "history kept for redo"); assert.equal(moved["id"], ID(1));
  for (const name of [E, "o"]) { const later = { ...out.docs, [name]: write(out.docs[name] ?? {}, { shake: 3 }, { at, mint }) }, no = undoGroup(later, out.entry, at); assert.deepEqual(no, { error: SAVE.refused, name }); assert.equal(SAVE.refused, "changed since; undo there first"); }
  const kept = use({ shake: 2 }, out.docs[E] ?? null, out.docs["o"] ?? {}), two = undoGroup(kept.docs, kept.entry, at);
  assert.ok(!("error" in two)); assert.deepEqual(two.moves, []); assert.deepEqual(valuesOf(two.docs[E] ?? {}), { shake: 1 }); assert.equal(valuesOf(two.docs["o"] ?? {})[SAVE.knob], ID(1));
  let mixed = write(owner0(), { a: 1 }, { at, mint, group: "grp_m" }); mixed = write(mixed, { b: 1 }, { at, mint }); mixed = write(mixed, { c: 1 }, { at, mint, group: "grp_m" });
  assert.deepEqual(undoGroup({ o: mixed }, { group: "grp_m", docs: ["o"], created: [] }, at), { error: SAVE.refused, name: "o" }, "a doc whose own group undo is refused refuses the entry");
  const blank = blankEffect(ID(5), "N", at, 28), gone = undoGroup({ [FILE(5)]: blank }, { group: "grp_z", docs: [FILE(5)], created: [FILE(5)] }, at); assert.ok(!("error" in gone)); assert.deepEqual(gone.moves, [{ from: FILE(5), to: `effects/.deleted/${ID(5)}.json`, doc: blank }], "a created doc with no ops still moves");
});
test("E6 commit (setup §11, D6.3): absent or null expectedRev = must not exist, an unreadable file too; a stale rev saves nothing (all checked first); a move checks its source rev and an empty target; JSON ends with a newline", async () => {
  const s = mem(), out = use({ shake: 1 }); s.files.set("o", JSON.stringify(owner0()));
  assert.deepEqual(await commit(s, out.docs, { [E]: null, o: 4 }, { absent: out.absent }), { saved: [E, "o"], moved: [] }); assert.ok(s.files.get(E)?.endsWith("}\n")); assert.equal((JSON.parse(s.files.get("o") ?? "{}") as Row)["rev"], 5);
  const before = new Map(s.files); assert.deepEqual(await commit(s, out.docs, { o: 4 }), { error: "staleRev", name: E, want: null, got: 1 }, "an absent expectedRev means must not exist"); assert.deepEqual(s.files, before, "nothing written");
  const snap = new Map(s.files); assert.deepEqual(await commit(s, { o: out.docs["o"] ?? {}, [E]: {} }, { o: 5, [E]: null }), { error: "staleRev", name: E, want: null, got: 1 }); assert.deepEqual(s.files, snap, "a later stale doc stops the earlier one too");
  assert.deepEqual(await commit(s, { o: out.docs["o"] ?? {} }, { o: 4 }), { error: "staleRev", name: "o", want: 4, got: 5 });
  for (const bad of ["{bad", "5", "null", "[]", "[1]", "\"x\""]) { s.files.set("x", bad); assert.deepEqual(await commit(s, { x: {} }, { x: null }), { error: "staleRev", name: "x", want: null, got: 0 }, `unreadable ${bad} exists: got 0`); assert.equal(s.files.get("x"), bad); }
  s.files.set(out.absent[0] ?? "", "{}"); const pre = new Map(s.files); assert.deepEqual(await commit(s, {}, {}, { absent: out.absent }), { error: "staleRev", name: out.absent[0], want: null, got: 0 }, "a used id in the trash is never reused"); assert.deepEqual(s.files, pre); s.files.delete(out.absent[0] ?? "");
  const u = undoGroup(out.docs, out.entry, at); assert.ok(!("error" in u)); const keep = new Map(s.files);
  assert.deepEqual(await commit(s, u.docs, { o: 5, [E]: 2 }, { moves: u.moves }), { error: "staleRev", name: E, want: 2, got: 1 }, "a move checks its source rev"); assert.deepEqual(s.files, keep);
  s.files.set(u.moves[0]?.to ?? "", "{}"); assert.deepEqual(await commit(s, u.docs, { o: 5, [E]: 1 }, { moves: u.moves }), { error: "staleRev", name: u.moves[0]?.to, want: null, got: 0 }, "the trash target must not exist"); s.files.delete(u.moves[0]?.to ?? "");
  assert.deepEqual(await commit(s, u.docs, { o: 5, [E]: 1 }, { moves: u.moves }), { saved: ["o"], moved: [`effects/.deleted/${ID(1)}.json`] }); assert.equal(s.files.has(E), false);
  const trashed = JSON.parse(s.files.get(`effects/.deleted/${ID(1)}.json`) ?? "{}") as Row; assert.equal(trashed["id"], ID(1)); assert.equal(ops(trashed).length, 2, "moved with its history, never hard-deleted");
});
test("E6 commit order and rollback (QA E6 notes 2): new files first, the referencing doc last, move sources removed last; a write or remove that fails mid-commit rolls back what was done and rethrows, leaving the files as they were", async () => {
  const s = mem(), log: string[] = [], out = use({ shake: 1 }); s.files.set("o", JSON.stringify(owner0())); let failAt = -1, n2 = 0;
  const f: Store = { read: s.read, write: (k, t) => { log.push(`w ${k}`); if (n2++ === failAt) return Promise.reject(new Error("QuotaExceededError")); return s.write(k, t); }, remove: (k) => { log.push(`r ${k}`); if (n2++ === failAt) return Promise.reject(new Error("io")); return s.remove(k); } };
  const flipped = { o: out.docs["o"] ?? {}, [E]: out.docs[E] ?? {} }, before = new Map(s.files); failAt = 1;
  await assert.rejects(commit(f, flipped, { o: 4 }), /QuotaExceededError/); assert.deepEqual(log, [`w ${E}`, "w o", `r ${E}`], "new effect first, owner last, then the rollback"); assert.deepEqual(s.files, before, "nothing left behind");
  failAt = -1; log.length = 0; assert.deepEqual(await commit(f, flipped, { o: 4 }), { saved: ["o", E], moved: [] }); assert.deepEqual(log, [`w ${E}`, "w o"]);
  const u = undoGroup(out.docs, out.entry, at); assert.ok(!("error" in u)); const saved = new Map(s.files); n2 = 0; failAt = 2; log.length = 0;
  await assert.rejects(commit(f, u.docs, { o: 5, [E]: 1 }, { moves: u.moves }), /io/); const T = `effects/.deleted/${ID(1)}.json`;
  assert.deepEqual(log, [`w ${T}`, "w o", `r ${E}`, "w o", `r ${T}`], "trash first, owner, source last; rollback in reverse"); assert.deepEqual(s.files, saved, "the undo left the files as they were");
});
test("E6 owner file (QA E6 r2 S1): a missing file is a new owner, a setup envelope loads as is; junk, null, an array, a number or a record without the envelope is refused by name (staleRev), never overwritten", () => {
  const F = "setups/o.json", o = owner0(), no = (why: string): unknown => ({ error: "staleRev", name: F, message: `Not saved: can't read ${F} (${why}). Nothing was changed.` });
  assert.deepEqual(ownerOf(F, null), { doc: null }); assert.deepEqual(ownerOf(F, `${JSON.stringify(o, null, 2)}\n`), { doc: o }); assert.deepEqual(ownerOf(F, JSON.stringify({ ...o, rev: 0 })), { doc: { ...o, rev: 0 } });
  for (const text of ["{oops", "", "null", "[]", "[{}]", "0", "\"x\"", "true"]) assert.deepEqual(ownerOf(F, text), no("unreadable"), text);
  const drop = (k: string): Row => Object.fromEntries(Object.entries(o).filter(([key]) => key !== k));
  for (const d of [{}, ...["kind", "formatVersion", "id", "behaviourId", "rev", "answers", "history"].map(drop), { ...o, kind: "match-save" }, { ...o, formatVersion: "3" }, { ...o, id: 7 }, { ...o, behaviourId: null }, { ...o, rev: 1.5 }, { ...o, rev: -1 }, { ...o, rev: "4" }, { ...o, answers: [] }, { ...o, history: null }]) assert.deepEqual(ownerOf(F, JSON.stringify(d)), no("no setup envelope"), JSON.stringify(d));
});
