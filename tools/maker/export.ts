import { prefix } from "../../src/editor/project/home.ts";
import { emptyBoard, playLine, testGate } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import { gameZip } from "../export/game.ts";
import { openProject } from "../play-stage/project.ts";
import { assetRows } from "./asset-check.ts";
import { parseProject } from "./project-files.ts";
import { readTree, type MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export function isTree(doc: unknown): doc is { readonly commit: string; readonly node: string; readonly files: Readonly<Record<string, string>> } {
  if (!isObj(doc) || typeof doc["commit"] !== "string" || typeof doc["node"] !== "string" || !isObj(doc["files"])) return false;
  return Object.values(doc["files"]).every((item) => typeof item === "string");
}
export function playBase(url: string): string {
  const at = url.indexOf("/maker/");
  if (at < 0) throw new Error("Can't build: /maker/");
  const rest = url.slice(at + "/maker/".length);
  const slash = rest.indexOf("/");
  if (slash < 0) throw new Error("Can't build: /maker/");
  return `${url.slice(0, at)}/play-stage/${rest.slice(0, slash)}/`;
}
export async function buildGame(store: MakerStore, id: string, get: (path: string) => Promise<string>): Promise<{ readonly ok: true; readonly bytes: Uint8Array } | { readonly ok: false; readonly lines: readonly string[] }> {
  const text = await readTree(store, prefix(id));
  const parsed = parseProject(text);
  if (!parsed.ok) return { ok: false, lines: [parsed.message] };
  const load = readProject(parsed.files);
  const rows = await assetRows(store, prefix(id), parsed.files);
  const gate = testGate([...load.report, ...rows], load.readOnly);
  if (!gate.allowed) return { ok: false, lines: gate.lines };
  const opened = openProject(parsed.files);
  if (opened.docs === null) return { ok: false, lines: [playLine(opened.error)] };
  if (emptyBoard(opened.docs)) return { ok: false, lines: ["Place a unit on this stage to test it."] };
  const assets: Record<string, Uint8Array> = {};
  for (const name of await store.list(`${prefix(id)}assets/`)) {
    if (name === ".deleted") continue;
    const blob = await store.readBlob(`${prefix(id)}assets/${name}`);
    if (blob === null) throw new Error(`Can't build: assets/${name}`);
    assets[name] = new Uint8Array(await blob.arrayBuffer());
  }
  const raw = await get("build.json");
  const tree = parseProject({ "build.json": raw });
  if (!tree.ok || !isTree(tree.files["build.json"])) throw new Error("Can't build: build.json");
  const doc = tree.files["build.json"];
  const play: Record<string, string> = { "build.json": raw };
  for (const name of Object.keys(doc.files)) play[name] = await get(name);
  return { ok: true, bytes: await gameZip(play, text, assets) };
}
