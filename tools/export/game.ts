import { zipStore } from "./zip.ts";
export const KEEP_OUT = ["notes/", "sprite-recipes/"];
export const shipped = (path: string): boolean => path.endsWith(".json") && !path.split("/").includes(".deleted") && !KEEP_OUT.some((pre) => path.startsWith(pre));
export const filesModule = (text: Readonly<Record<string, string>>): string => `export default {\n${Object.keys(text).filter(shipped).sort().map((path) => `${JSON.stringify(path)}: ${text[path] ?? ""}`).join(",\n")}\n};\n`;
export function markPage(html: string): string {
  if (!html.includes(`<canvas id="board">`)) throw new Error("Can't build: index.html");
  return html.replace(`<canvas id="board">`, `<canvas id="board" data-game="project/files.js">`);
}
const sha256 = async (data: Uint8Array): Promise<string> => [...new Uint8Array(await crypto.subtle.digest("SHA-256", data.slice()))].map((b) => b.toString(16).padStart(2, "0")).join("");
export async function gameZip(play: Readonly<Record<string, string>>, text: Readonly<Record<string, string>>, assets: Readonly<Record<string, Uint8Array>>): Promise<Uint8Array> {
  const raw = play["build.json"] ?? "";
  const commit = /\n {2}"commit": "([0-9a-f]{40})",\n/.exec(raw)?.[1];
  const node = /\n {2}"node": "([^"\\]*)",\n/.exec(raw)?.[1];
  if (commit === undefined || node === undefined) throw new Error("Can't build: build.json");
  const enc = new TextEncoder();
  const files = new Map<string, Uint8Array>();
  for (const [name, body] of Object.entries(play)) if (name !== "build.json") files.set(name, enc.encode(name === "index.html" ? markPage(body) : body));
  files.set("project/files.js", enc.encode(filesModule(text)));
  for (const [name, bytes] of Object.entries(assets)) if (!name.split("/").includes(".deleted")) files.set(`project/assets/${name}`, bytes);
  const names = [...files.keys()].sort();
  const sums: Record<string, string> = {};
  for (const name of names) sums[name] = await sha256(files.get(name) ?? new Uint8Array());
  const build = `${JSON.stringify({ commit, node, entry: "index.html", files: sums }, null, 2)}\n`;
  const entries = names.map((name) => ({ name, data: files.get(name) ?? new Uint8Array() }));
  entries.push({ name: "build.json", data: enc.encode(build) });
  return zipStore(entries);
}
