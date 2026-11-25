import { prefix, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { sentence } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { ProjectFiles, ReportRow } from "../../src/project/load/types.ts";
import { assetRows } from "./asset-check.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, type MakerStore } from "./store.ts";
import { fits, readPicture } from "../play-stage/picture.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? `${amp}amp;` : ch === "<" ? `${amp}lt;` : ch === ">" ? `${amp}gt;` : ch === '"' ? `${amp}quot;` : `${amp}#39;`);
export type ArtRow = { readonly code: "uploadTypeUnsupported"; readonly severity: "hard"; readonly path: string; readonly detail: string };
export type ArtResult = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly line: string; readonly row?: ArtRow };
let shown = false, note: string | null = null, lines: readonly string[] = [];
export const showArt = (): void => { shown = true; note = null; }, hideArt = (): void => { shown = false; note = null; }, setArtNote = (line: string | null): void => { note = line; }, setArtLines = (next: readonly string[]): void => { lines = next; };
function locate(files: ProjectFiles, stageId: string): { mapPath: string; map: Record<string, unknown>; root: Record<string, unknown> } | null {
  let mapRef = "";
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === stageId && typeof doc["mapRef"] === "string") mapRef = doc["mapRef"];
  const root = files["project.json"];
  for (const [path, doc] of Object.entries(files)) if (mapRef !== "" && path.startsWith("maps/") && isObj(doc) && doc["id"] === mapRef && isObj(root)) return { mapPath: path, map: doc, root };
  return null;
}
const layersOf = (map: Record<string, unknown>): Record<string, unknown>[] => { const bg = isObj(map["background"]) ? map["background"] : {}; return (Array.isArray(bg["layers"]) ? bg["layers"] : []).filter(isObj); }, hex = (buf: ArrayBuffer): string => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const typeLine = (fileName: string, sniffed: string): string => sniffed === "unknown" ? `Can't use ${fileName}: it's not a picture. Use a PNG, JPG or WebP picture.` : `Can't use ${fileName}: it's a ${sniffed} file. Use a PNG, JPG or WebP picture.`;
const saved = (files: DocText, rev: number, writes: readonly { readonly path: string; readonly text: string }[]): ArtResult => { let out: DocText = files; for (const w of writes) out = { ...out, [w.path]: w.text }; return { ok: true, files: out, rev: writes.length > 0 ? rev + 1 : rev }; };
export async function uploadBytes(file: Blob): Promise<Uint8Array> {
  const head = new Uint8Array(await file.slice(0, 65536).arrayBuffer()), pic = readPicture(head);
  if (file.size <= head.length || (pic.ok ? !fits(pic.w, pic.h) : !pic.sniffed.startsWith("damaged"))) return head;
  return new Uint8Array(await file.arrayBuffer());
}
export async function addPicture(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, now: string, fileName: string, bytes: Uint8Array): Promise<ArtResult> {
  const pic = readPicture(bytes);
  if (!pic.ok) return { ok: false, line: typeLine(fileName, pic.sniffed), row: { code: "uploadTypeUnsupported", severity: "hard", path: fileName, detail: pic.sniffed } };
  if (!fits(pic.w, pic.h)) return { ok: false, line: `${fileName} is too big: ${pic.w} × ${pic.h} px. A picture can be at most 4096 px a side. Nothing was saved.` };
  const parsed = parseProject(files); if (!parsed.ok) return { ok: false, line: parsed.message };
  const found = locate(parsed.files, stageId); if (found === null) return { ok: false, line: "Can't open this map" };
  const assetId = `asset_${hex(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes))).slice(0, 16)}`, stem = fileName.replace(/\.[^./\\]+$/, "").slice(0, 64), name = stem === "" ? "Picture" : stem;
  const root = structuredClone(found.root), map = structuredClone(found.map), project = isObj(root["project"]) ? root["project"] : null;
  if (project === null) return { ok: false, line: "Can't open: project.json" };
  const assets = isObj(project["assets"]) ? project["assets"] : {}, bg = isObj(map["background"]) ? map["background"] : {};
  project["assets"] = { ...assets, [assetId]: { name, ext: pic.ext, origin: { kind: "upload", fileName }, kind: "background" } };
  map["background"] = { ...bg, layers: [...(Array.isArray(bg["layers"]) ? bg["layers"] : []), { assetId, depth: 1, repeat: "none" }] };
  const next = { ...files, [found.mapPath]: JSON.stringify(map), "project.json": JSON.stringify(root) }, plan = planSave(files, next, rev, now);
  if (!plan.ok) return { ok: false, line: plan.message };
  const wrote = await commitWrites(store, prefix(id), [{ path: `assets/${assetId}.${pic.ext}`, bytes }, ...plan.writes]);
  return wrote.ok ? saved(files, rev, plan.writes) : { ok: false, line: wrote.message };
}
export async function dropLayer(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, index: number, now: string): Promise<ArtResult> {
  const parsed = parseProject(files); if (!parsed.ok) return { ok: false, line: parsed.message };
  const found = locate(parsed.files, stageId); if (found === null) return { ok: false, line: "Can't open this map" };
  const map = structuredClone(found.map), bg = isObj(map["background"]) ? map["background"] : {}, layers = [...(Array.isArray(bg["layers"]) ? bg["layers"] : [])];
  if (!Number.isInteger(index) || index < 0 || index >= layers.length) return { ok: false, line: "That layer is already gone." };
  layers.splice(index, 1); map["background"] = { ...bg, layers };
  const next = { ...files, [found.mapPath]: JSON.stringify(map) }, plan = planSave(files, next, rev, now);
  if (!plan.ok) return { ok: false, line: plan.message };
  const wrote = await commitWrites(store, prefix(id), plan.writes);
  return wrote.ok ? saved(files, rev, plan.writes) : { ok: false, line: wrote.message };
}
const words = (row: ReportRow): string | null => row.code === "overCap" ? `${row.detail ?? ""} layers: more than 3. All of them still draw.` : row.code === "outOfRange" ? "A scroll speed is outside 0–1. It's drawn as the nearest end." : row.code === "advancedRenderInactive" ? "Cover and Stretch need Advanced render. It's drawn as is." : null;
export async function artLines(store: MakerStore, id: string, files: DocText, stageId: string): Promise<string[]> {
  const parsed = parseProject(files); if (!parsed.ok) return [parsed.message];
  const found = locate(parsed.files, stageId); if (found === null) return ["Can't open this map"];
  const ids = new Set(layersOf(found.map).map((layer) => layer["assetId"]).filter((v): v is string => typeof v === "string"));
  const asset = (await assetRows(store, prefix(id), parsed.files)).filter((row) => ids.has(row.detail ?? ""));
  const bg = readProject(parsed.files).report.filter((row) => row.path.startsWith(`${found.mapPath}#/background`));
  return [...asset.map((row) => `${sentence(row)}${row.severity === "hard" ? ". Test is blocked until it's fixed." : "."}`), ...bg.flatMap((row) => { const line = words(row); return line === null ? [] : [line]; })];
}
const layerName = (root: Record<string, unknown>, assetId: string): string => { const project = isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, meta = assets[assetId]; return isObj(meta) && typeof meta["name"] === "string" && meta["name"] !== "" ? meta["name"] : "Picture"; };
export function artSheet(files: DocText, stageId: string, readOnly: boolean): string {
  if (!shown) return "";
  const parsed = parseProject(files), found = parsed.ok ? locate(parsed.files, stageId) : null, layers = found === null ? [] : layersOf(found.map);
  const rows = layers.length === 0 ? `<p>No background yet.</p>` : layers.map((layer, i) => `<p>Layer ${i + 1} · ${esc(found === null || typeof layer["assetId"] !== "string" ? "Picture" : layerName(found.root, layer["assetId"]))}${readOnly ? "" : ` <button type="button" class="btn ghost" data-act="b:del:${i}">Remove</button>`}</p>`).join("");
  const add = readOnly ? "" : `<label class="btn">Add picture<input type="file" data-art accept="image/png,image/jpeg,image/webp"></label>`;
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Background</h2>${note === null ? "" : `<p>${esc(note)}</p>`}${rows}${lines.map((line) => `<p>${esc(line)}</p>`).join("")}${add}<button type="button" class="btn ghost" data-act="b:close">Close</button></div></div>`;
}
