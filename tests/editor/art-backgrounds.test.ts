import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix } from "../../src/editor/project/home.ts";
import { readProject } from "../../src/project/load/index.ts";
import { buildDrawList, chunkedList, fitView, snapCamera, type RenderScene } from "../../src/runtime/render/index.ts";
import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { slotOf, writeAutosave } from "../../tools/maker/session.ts";
import { memoryStore, movePrefix, readTree } from "../../tools/maker/store.ts";
import { openSaved } from "../../tools/maker/test-launch.ts";
import { backdropOf } from "../../tools/play-stage/backdrop.ts";
import { dress } from "../../tools/play-stage/looks.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", PID = "project_01JDAP00000000000000000001", PNG = "asset_00112233445566aa";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
function textOf(dir: string, base = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) { const rel = base === "" ? ent.name : `${base}/${ent.name}`; if (ent.isDirectory()) Object.assign(out, textOf(join(dir, ent.name), rel)); else out[rel] = readFileSync(join(dir, ent.name), "utf8"); }
  return out;
}
const parse = (text: Record<string, string>): Record<string, unknown> => { const out: Record<string, unknown> = {}; for (const [k, v] of Object.entries(text)) out[k] = JSON.parse(v) as unknown; return out; };
const meta = (ext: string) => ({ name: "pic", ext, origin: { kind: "upload", fileName: `pic.${ext}` }, kind: "background" });
async function idOf(bytes: string): Promise<string> { const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bytes)); return `asset_${[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16)}`; }
function withArt(id: string, layers: unknown[], assets: Record<string, unknown> = {}, settings?: Record<string, unknown>): Record<string, string> {
  const files = textOf(root), project = JSON.parse(files["project.json"] ?? "{}") as Record<string, unknown>, body = isObj(project["project"]) ? { ...project["project"] } : {};
  body["assets"] = { ...(isObj(body["assets"]) ? body["assets"] : {}), [id]: meta("png"), ...assets }; if (settings !== undefined) body["settings"] = { ...(isObj(body["settings"]) ? body["settings"] : {}), ...settings }; project["project"] = body; files["project.json"] = JSON.stringify(project);
  const map = JSON.parse(files[MAP] ?? "{}") as Record<string, unknown>; map["background"] = { layers }; files[MAP] = JSON.stringify(map); return files;
}
const fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(40, 20, 1), ground = { sheet: { id: "ground", columns: 1, fw: 16, fh: 16 }, tiles: Array.from({ length: 20 * 12 }, () => 1) };
const scene = (backdrop: NonNullable<RenderScene["backdrop"]>): RenderScene => ({ cols: 20, rows: 12, tileW: 16, tileH: 16, mapSeed: 1, ground: [ground], above: [], standing: [], overlays: [], backdrop });
const draw = (backdrop: NonNullable<RenderScene["backdrop"]>) => buildDrawList(scene(backdrop), fit, cam, 0, 16).cmds;
const sky = (depth: number, repeat: "none" | "x" | "y" | "both", fw: number) => ({ sheet: { id: "art", columns: 1, fw, fh: fw }, depth, repeat });
const party: SessionParty = { side: "player", members: [{ unitId: "unit_01JDAN00000000000000000001", hp: 2 }], bar: null };
const header: SaveHeader = { projectHash: "rev:12", engineVersion: "0.0.0", projectId: PID, savedAt: "2026-11-24T00:00:00.000Z" };
async function saved(id: string, file: string | null, assets: Record<string, unknown> = {}, layers?: unknown[]): Promise<ReturnType<typeof memoryStore>> {
  const text = withArt(id, layers ?? [{ assetId: id, depth: 1, repeat: "none" }], assets), store = memoryStore();
  for (const [path, body] of Object.entries(text)) await store.write(`${prefix(PID)}${path}`, body);
  if (file !== null) await store.write(`${prefix(PID)}assets/${id}.png`, file);
  return store;
}
test("background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn", () => {
  const good = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none" }]))); assert.equal(good.ok, true); assert.deepEqual([...good.report], []);
  const bad = readProject(parse(withArt(PNG, [{ assetId: "asset_unknownunknown1", depth: 1, repeat: "none" }]))); assert.equal(bad.ok, false); assert.equal(bad.report.length, 1);
  assert.deepEqual(bad.report[0], { code: "brokenRef", severity: "hard", path: `${MAP}#/background/layers/0/assetId`, detail: "asset_unknownunknown1" });
  const four = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 1.5, repeat: "none" }, { assetId: PNG, depth: -0.25, repeat: "none" }, { assetId: PNG, depth: 1, repeat: "none" }, { assetId: PNG, depth: 1, repeat: "none" }])));
  assert.equal(four.ok, true); assert.deepEqual(four.report.map((r) => [r.code, r.path, r.detail]), [["overCap", `${MAP}#/background/layers`, "4"], ["outOfRange", `${MAP}#/background/layers/0/depth`, undefined], ["outOfRange", `${MAP}#/background/layers/1/depth`, undefined]]);
});
test("backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset", () => {
  const jpg = "asset_jpg00000000000", layers = backdropOf({ assets: { [PNG]: meta("png"), [jpg]: meta("jpg") } }, { background: { layers: [{ assetId: PNG, depth: 2, repeat: "x" }, { assetId: "asset_missing000000", depth: 1, repeat: "none" }, { assetId: jpg, fit: "stretch" }] } });
  assert.deepEqual(layers.map((row) => [row.depth, row.repeat, row.file]), [[1, "x", `assets/${PNG}.png`], [1, "none", `assets/${jpg}.jpg`]]);
  const plain = readProject(parse(textOf(root))); assert.equal(plain.project !== null && playDocsOf(plain.project).backdrop, undefined);
  const art = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 0.2, repeat: "y" }]))); assert.equal(art.project !== null && playDocsOf(art.project).backdrop?.[0]?.file, `assets/${PNG}.png`);
  const grid = { cols: 2, rows: 2, tileTypeAt(at: { c: number; r: number }) { return { id: ["floor", "water", "wall-block", "floor"][at.r * 2 + at.c] ?? "floor" }; } };
  assert.deepEqual(dress(grid).layers[0]?.tiles, [0, 1, 2, 0]); assert.deepEqual(dress(grid, undefined, true).layers[0]?.tiles, [null, 1, 2, null]);
});
test("draw list: the backdrop draws first, at whole art px, by depth", () => {
  const at = (depth: number, repeat: "none" | "x" | "y" | "both" = "none", fw = 64) => draw([sky(depth, repeat, fw)]).filter((c) => c.sheet === "art");
  const first = draw([sky(1, "none", 64)]); assert.equal(first[0]?.sheet, "art"); assert.ok(first.some((c) => c.sheet === "ground")); assert.equal(first.findIndex((c) => c.sheet === "art") < first.findIndex((c) => c.sheet === "ground"), true);
  assert.deepEqual(at(1).map((c) => [c.dx, c.dy, c.dw, c.dh]), [[-40, -20, 64, 64]]); assert.deepEqual(at(0).map((c) => [c.dx, c.dy]), [[0, 0]]); assert.deepEqual(at(0.5).map((c) => [c.dx, c.dy]), [[-20, -10]]);
  assert.deepEqual(at(1, "none", 16), []); assert.deepEqual(at(1, "x").map((c) => c.dx), [-40, 24, 88, 152]); assert.equal(at(1, "both").length, 8);
  assert.equal(draw([{ sheet: { id: "art", columns: 1, fw: 0, fh: 0 }, depth: 1, repeat: "both" }]).some((c) => c.sheet === "art"), false);
  assert.ok(at(0.37, "both").every((c) => Number.isInteger(c.dx) && Number.isInteger(c.dy)));
});
test("chunked list draws the backdrop once, before the ground chunks", () => {
  const cmds = chunkedList(scene([{ sheet: { id: "sky", columns: 1, fw: 64, fh: 64 }, depth: 1, repeat: "none" }]), fit, cam, 0, 16).cmds;
  assert.equal(cmds.filter((c) => c.sheet === "sky").length, 1); assert.equal(cmds[0]?.sheet, "sky"); assert.equal(cmds[1]?.sheet.startsWith("chunk:"), true);
  assert.equal(chunkedList(scene([]), fit, cam, 0, 16).cmds.some((c) => c.sheet === "sky"), false);
});
test("store: readTree skips assets, readBlob reads bytes, trash moves assets", async () => {
  const store = memoryStore(), live = prefix(PID), trash = prefix(PID, true);
  await store.write(`${live}project.json`, "{}"); await store.write(`${live}assets/${PNG}.png`, "BYTES");
  const tree = await readTree(store, live); assert.equal(Object.keys(tree).some((key) => key.startsWith("assets/")), false);
  const blob = await store.readBlob(`${live}assets/${PNG}.png`); assert.equal(blob === null ? null : await blob.text(), "BYTES"); assert.equal(await store.readBlob(`${live}assets/missing.png`), null);
  await movePrefix(store, live, trash); const moved = await store.readBlob(`${trash}assets/${PNG}.png`);
  assert.equal(moved === null ? null : await moved.text(), "BYTES"); assert.equal([...store.files.keys()].some((key) => key.startsWith(live)), false);
});
test("test launch hands the stage its background and an art reader", async () => {
  const bytes = "PNGBYTES", id = await idOf(bytes), store = await saved(id, bytes); let file = "", body: Promise<string | null> = Promise.resolve(null);
  const got = await openSaved({ store, id: PID, from: "project", start(next) { file = next.backdrop?.[0]?.file ?? ""; const art = next.art; if (art !== undefined) body = art(`assets/${id}.png`).then((blob) => (blob === null ? null : blob.text())); } });
  assert.equal(got.ok, true); assert.equal(file, `assets/${id}.png`); assert.equal(await body, bytes);
});
test("autosave: two links in a row write in order, and each write reads the slot once", async () => {
  const store = memoryStore(); let reads = 0; const read = store.read.bind(store); store.read = async (path) => { reads += 1; return read(path); };
  const [a, b] = await Promise.all([writeAutosave(store, header, "stage_A", "stage_B", party), writeAutosave(store, header, "stage_B", "stage_C", party)]);
  assert.equal(a.ok && b.ok, true); assert.equal(JSON.parse(store.files.get(slotOf(PID)) ?? "{}").to, "stage_C"); assert.equal(reads, 2); assert.equal([...store.files.keys()].some((key) => key.endsWith(".tmp")), false);
});
test("asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file", async () => {
  const id = await idOf("PNGBYTES"), spare = "asset_spare0000000000", missing = await openSaved({ store: await saved(id, null), id: PID, from: "project", start() { /* refused */ } });
  assert.equal(missing.ok, false); if (!missing.ok) assert.deepEqual([...missing.lines], [`A picture this project uses is missing: assets/${id}.png`]);
  const changed = await openSaved({ store: await saved(id, "OTHER"), id: PID, from: "project", start() { /* refused */ } });
  assert.equal(changed.ok, false); if (!changed.ok) assert.deepEqual([...changed.lines], [`A picture this project uses doesn't match its file: assets/${id}.png`]);
  const text = withArt(id, [{ assetId: id, depth: 1, repeat: "none" }], { [spare]: meta("png") }), store = memoryStore();
  for (const [path, body] of Object.entries(text)) await store.write(`${prefix(PID)}${path}`, body); await store.write(`${prefix(PID)}assets/${id}.png`, "PNGBYTES");
  const rows = await assetRows(store, prefix(PID), parse(text)); assert.deepEqual(rows, [{ code: "assetFileMissing", severity: "warning", path: `assets/${spare}.png`, detail: spare }]);
  const v4 = parse(text); const oldMap = v4[MAP]; if (isObj(oldMap)) { oldMap["formatVersion"] = 4; oldMap["background"] = { mode: "image", assetId: spare }; }
  const aged = await assetRows(store, prefix(PID), v4); assert.deepEqual(aged.filter((r) => r.detail === spare), [{ code: "assetFileMissing", severity: "hard", path: `assets/${spare}.png`, detail: spare }]);
  const opened = await openSaved({ store, id: PID, from: "project", start() { /* opens */ } }); assert.equal(opened.ok, true); assert.equal(store.files.get(`${prefix(PID)}project.json`)?.includes(spare), true);
});
test("advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten", () => {
  const offText = withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none", fit: "cover" }], {}, { advancedRender: false, camera: { pixelPerfect: false } }), offCopy = { ...offText }, offFiles = parse(offText), offClone = structuredClone(offFiles), off = readProject(offFiles);
  assert.equal(off.ok, true); assert.deepEqual(offFiles, offClone); assert.deepEqual(offText, offCopy);
  assert.deepEqual(off.report.map((r) => [r.code, r.severity, r.path, r.detail]), [["advancedRenderInactive", "info", `${MAP}#/background/layers/0/fit`, "fit"], ["advancedRenderInactive", "info", "project.json#/project/settings/camera/pixelPerfect", "pixelPerfect"]]);
  const onText = withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none", fit: "cover" }], {}, { advancedRender: true, camera: { pixelPerfect: false } }), onFiles = parse(onText), onClone = structuredClone(onFiles), on = readProject(onFiles);
  assert.equal(on.ok, true); assert.deepEqual([...on.report], []); assert.deepEqual(onFiles, onClone); assert.equal(onText["project.json"], JSON.stringify(JSON.parse(onText["project.json"] ?? "{}")));
});
