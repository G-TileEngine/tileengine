import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix } from "../../src/editor/project/home.ts";
import { readProject } from "../../src/project/load/index.ts";
import { openCheckpoint } from "../../tools/baseline/checkpoint.ts";
import { addPicture, artLines, artSheet, dropLayer, setArtLines, showArt } from "../../tools/maker/art.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { loadLayer, type Bitmap } from "../../tools/play-stage/backdrop.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { readPicture } from "../../tools/play-stage/picture.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stage_01JDAS00000000000000000001", PID = "project_01JDAP00000000000000000001", NOW = "2026-11-25T00:00:00.000Z";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
function textOf(dir: string, base = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) { const rel = base === "" ? ent.name : `${base}/${ent.name}`; if (ent.isDirectory()) Object.assign(out, textOf(join(dir, ent.name), rel)); else out[rel] = readFileSync(join(dir, ent.name), "utf8"); }
  return out;
}
const be = (n: number): number[] => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const png = (w: number, h: number): Uint8Array => new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, ...be(w), ...be(h)]);
const jpg = (w: number, h: number): Uint8Array => new Uint8Array([255, 216, 255, 192, 0, 7, 8, (h >> 8) & 255, h & 255, (w >> 8) & 255, w & 255]);
const webp = (kind: string, payload: number[]): Uint8Array => { const b = new Uint8Array(30); b.set([82, 73, 70, 70, 22, 0, 0, 0, 87, 69, 66, 80]); b.set([...kind].map((c) => c.charCodeAt(0)), 12); payload.forEach((n, i) => { b[20 + i] = n; }); return b; };
const ftyp = (brand: string): Uint8Array => { const b = new Uint8Array(12); b.set([0, 0, 0, 24]); b.set([102, 116, 121, 112], 4); b.set([...brand].map((c) => c.charCodeAt(0)), 8); return b; };
const sniff = (bytes: Uint8Array): string => { const got = readPicture(bytes); return got.ok ? `${got.ext} ${got.w}x${got.h}` : got.sniffed; };
const parse = (text: Record<string, string>): Record<string, unknown> => { const out: Record<string, unknown> = {}; for (const [k, v] of Object.entries(text)) out[k] = JSON.parse(v) as unknown; return out; };
async function loaded(): Promise<{ files: Record<string, string>; store: ReturnType<typeof memoryStore>; rev: number }> {
  const files = textOf(root), store = memoryStore(), body = JSON.parse(files["project.json"] ?? "{}") as { project?: { rev?: number } };
  for (const [path, text] of Object.entries(files)) await store.write(`${prefix(PID)}${path}`, text);
  return { files, store, rev: body.project?.rev ?? 0 };
}
const shot = (store: ReturnType<typeof memoryStore>): string => JSON.stringify([...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1)));
test("upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named", () => {
  const still = png(96, 144), anim = new Uint8Array(still.length + 4); anim.set(still); anim.set([97, 99, 84, 76], still.length);
  assert.equal(sniff(still), "png 96x144"); assert.equal(sniff(anim), "png 96x144"); assert.equal(sniff(jpg(640, 480)), "jpg 640x480");
  assert.equal(sniff(webp("VP8X", [2, 0, 0, 0, 99, 0, 0, 49, 0, 0])), "webp 100x50"); assert.equal(sniff(webp("VP8L", [47, 15, 192, 3, 0])), "webp 16x16"); assert.equal(sniff(webp("VP8 ", [0, 0, 0, 0, 0, 0, 20, 0, 10, 0])), "webp 20x10");
  assert.deepEqual([sniff(new TextEncoder().encode("GIF89a")), sniff(new TextEncoder().encode("BM")), sniff(new TextEncoder().encode("<svg xmlns='x'/>")), sniff(ftyp("heic")), sniff(ftyp("avif")), sniff(new TextEncoder().encode("hello")), sniff(still.subarray(0, 8)), sniff(new Uint8Array([255, 216, 255, 224, 0, 2]))], ["gif", "bmp", "svg", "heic", "avif", "unknown", "damaged png", "damaged jpg"]);
});
test("upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean", async () => {
  const { files, store, rev } = await loaded(), bytes = jpg(640, 480), got = await addPicture(store, PID, files, rev, STAGE, NOW, "pic.jpeg", bytes);
  assert.equal(got.ok, true); if (!got.ok) return; assert.equal(got.rev, rev + 1);
  const project = JSON.parse(got.files["project.json"] ?? "{}") as { project: { assets: Record<string, unknown> } }, id = Object.keys(project.project.assets)[0] ?? "";
  assert.deepEqual(project.project.assets[id], { name: "pic", ext: "jpg", origin: { kind: "upload", fileName: "pic.jpeg" }, kind: "background" });
  const blob = await store.readBlob(`${prefix(PID)}assets/${id}.jpg`); assert.equal(blob !== null && Buffer.from(await blob.arrayBuffer()).equals(Buffer.from(bytes)), true);
  assert.deepEqual(await store.list(`${prefix(PID)}assets/`), [`${id}.jpg`]);
  const map = JSON.parse(got.files[MAP] ?? "{}") as { background: { layers: unknown[] } }; assert.deepEqual(map.background.layers, [{ assetId: id, depth: 1, repeat: "none" }]);
  const docs = parse(got.files), load = readProject(docs); assert.equal(load.report.some((row) => row.severity === "hard"), false); assert.deepEqual(await assetRows(store, prefix(PID), docs), []);
  const kept = store.files.get(`${prefix(PID)}project.json`); store.failOn(`${prefix(PID)}project.json.tmp`);
  const again = await addPicture(store, PID, got.files, got.rev, STAGE, NOW, "more.jpeg", jpg(8, 8));
  assert.equal(again.ok, false); if (again.ok) return; assert.equal(again.line.startsWith("Couldn't save "), true);
  assert.deepEqual(await store.list(`${prefix(PID)}assets/`), [`${id}.jpg`]); assert.equal(store.files.get(`${prefix(PID)}project.json`), kept); assert.equal([...store.files.keys(), ...(await store.list(prefix(PID)))].some((key) => key.endsWith(".tmp")), false);
});
test("upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)", async () => {
  const { files, store, rev } = await loaded(), before = shot(store), gif = await addPicture(store, PID, files, rev, STAGE, NOW, "cat.png", new TextEncoder().encode("GIF89a"));
  assert.equal(gif.ok, false); if (gif.ok) return;
  assert.equal(gif.line, "Can't use cat.png: it's a gif file. Use a PNG, JPG or WebP picture.");
  assert.deepEqual(gif.row, { code: "uploadTypeUnsupported", severity: "hard", path: "cat.png", detail: "gif" });
  const wide = await addPicture(store, PID, files, rev, STAGE, NOW, "wide.png", png(5000, 10));
  assert.equal(wide.ok, false); if (wide.ok) return; assert.equal(wide.line, "wide.png is too big: 5000 × 10 px. A picture can be at most 4096 px a side. Nothing was saved."); assert.deepEqual(wide.row, { code: "uploadTooLarge", severity: "hard", path: "wide.png", detail: JSON.stringify({ w: 5000, h: 10, max: 4096 }) });
  assert.equal(shot(store), before); assert.deepEqual(await store.list(`${prefix(PID)}assets/`), []); assert.equal(files["project.json"], textOf(root)["project.json"]);
});
test("background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset", async () => {
  const { files, store, rev } = await loaded(), id = "asset_00112233445566aa", project = JSON.parse(files["project.json"] ?? "{}") as Record<string, unknown>, map = JSON.parse(files[MAP] ?? "{}") as Record<string, unknown>;
  if (!isObj(project["project"])) return; const body = project["project"]; body["assets"] = { [id]: { name: "pic", ext: "png", origin: { kind: "upload", fileName: "pic.png" }, kind: "background" } }; map["background"] = { layers: [{ assetId: id, depth: 1, repeat: "none" }] };
  const next = { ...files, "project.json": JSON.stringify(project), [MAP]: JSON.stringify(map) }; for (const [path, text] of Object.entries(next)) await store.write(`${prefix(PID)}${path}`, text);
  const hard = `A picture this project uses is missing: assets/${id}.png. Test is blocked until it's fixed.`;
  assert.deepEqual(await artLines(store, PID, next, STAGE), [hard]); showArt(); setArtLines([hard]); const html = artSheet(next, STAGE, false);
  assert.equal(html.includes("Layer 1 · pic") && html.includes("Test is blocked") && html.includes("b:del:0"), true); assert.equal(artSheet(next, STAGE, true).includes("Add picture") || artSheet(next, STAGE, true).includes("Remove"), false);
  body["render"] = { ...(isObj(body["render"]) ? body["render"] : {}), excludedStages: [STAGE] }; const warned = { ...next, "project.json": JSON.stringify(project) };
  assert.deepEqual(await artLines(store, PID, warned, STAGE), [`A picture this project uses is missing: assets/${id}.png.`]);
  map["background"] = { layers: [0, 1, 2, 3].map(() => ({ assetId: id, depth: 1.5, repeat: "none", fit: "cover" })) };
  const busy = await artLines(store, PID, { ...warned, [MAP]: JSON.stringify(map) }, STAGE);
  assert.equal(busy.includes("4 layers: more than 3. All of them still draw.") && busy.includes("A scroll speed is outside 0–1. It's drawn as the nearest end.") && busy.includes("Cover and Stretch need Advanced render. It's drawn as is."), true);
  await store.writeBytes(`${prefix(PID)}assets/${id}.png`, png(8, 8)); const dropped = await dropLayer(store, PID, next, rev, STAGE, 0, NOW);
  assert.equal(dropped.ok, true); if (!dropped.ok) return; const after = JSON.parse(dropped.files[MAP] ?? "{}") as { background: { layers: unknown[] } }, kept = JSON.parse(dropped.files["project.json"] ?? "{}") as { project: { assets: Record<string, { ext: string }> } };
  assert.deepEqual(after.background.layers, []); assert.equal(kept.project.assets[id]?.ext, "png"); assert.notEqual(await store.readBlob(`${prefix(PID)}assets/${id}.png`), null); assert.equal(dropped.rev, rev + 1);
});
test("play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed", async () => {
  let opened = 0, closed = 0; const open = async (): Promise<Bitmap> => { opened += 1; return { width: 4, height: 6, close() { closed += 1; } }; };
  const layer = { assetId: "asset_00112233445566aa", file: "assets/asset_00112233445566aa.png", depth: 1, repeat: "none" } as const, file = layer.file;
  assert.equal((await loadLayer(layer, undefined, open, () => undefined)).miss, `Background picture missing: ${file}`);
  assert.equal((await loadLayer(layer, async () => null, open, () => undefined)).miss, `Background picture missing: ${file}`);
  assert.equal((await loadLayer(layer, async () => new Blob([png(4097, 8)]), open, () => undefined)).miss, `Background picture ${file} is too big to open (4097 × 8 px)`);
  assert.equal((await loadLayer(layer, async () => new Blob(["nope"]), open, () => undefined)).miss, `Background picture ${file} couldn't be opened`);
  assert.equal((await loadLayer(layer, async () => { throw new Error("read"); }, open, () => undefined)).miss, `Background picture ${file} couldn't be opened`); assert.equal(opened, 0);
  const good = await loadLayer(layer, async () => new Blob([png(8, 8)]), open, () => undefined);
  assert.deepEqual(good.row, { sheet: { id: layer.assetId, columns: 1, fw: 4, fh: 6 }, depth: 1, repeat: "none" });
  assert.equal((await loadLayer(layer, async () => new Blob([png(8, 8)]), open, () => { throw new Error("keep"); })).miss, `Background picture ${file} couldn't be opened`);
  assert.deepEqual([opened, closed], [2, 2]);
});
test("scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks", () => {
  const opened = openCheckpoint(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const match = createMatch(opened.docs), first = match.scene(), second = match.scene();
  assert.equal(first.assets, second.assets); match.bare(); const third = match.scene(); assert.notEqual(third.assets, first.assets); assert.equal(third.assets, match.scene().assets);
});
