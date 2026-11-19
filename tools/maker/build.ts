import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, build as playBuild, refuse, release, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/maker/home.ts";
const collect = (root: string, dev: boolean): Map<string, string> => {
  const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
  const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
  walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
};
/** `<out>/maker/index.html` is the only unstamped file. The stamp is 12 hex chars of the sorted path+sha list. */
export function build(out: string, commit: string, root: string = ROOT, dev = false): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bag = collect(root, dev), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
  const maker = join(out, "maker"), dir = join(maker, stamp);
  if (existsSync(dir) && names.some((name) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== (bag.get(name) ?? ""))) throw new Error(`build: maker/${stamp} already exists with different files`);
  mkdirSync(dir, { recursive: true });
  for (const name of names) { const dest = join(dir, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, bag.get(name) ?? ""); }
  const html = readFileSync(join(root, "tools/maker/index.html"), "utf8").replaceAll("__STAMP__", stamp);
  writeFileSync(join(maker, "index.html"), html);
  for (const name of readdirSync(maker)) if (name !== stamp && name !== "index.html") rmSync(join(maker, name), { recursive: true });
  const playRoot = join(out, "play-stage"); playBuild(join(playRoot, stamp), commit, root, dev);
  for (const name of readdirSync(playRoot)) if (name !== stamp) rmSync(join(playRoot, name), { recursive: true });
  const files: Record<string, string> = { "maker/index.html": sha(html) }; for (const name of names) files[`maker/${stamp}/${name}`] = sha(bag.get(name) ?? "");
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files }, null, 2)}\n`;
  writeFileSync(join(out, "build.json"), body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3];
  if (out === undefined) { console.error("usage: node tools/maker/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT })), why = refuse(head, asked, dirty);
  if (why !== null) { console.error(why); process.exit(1); }
  build(out, asked ?? head);
}
