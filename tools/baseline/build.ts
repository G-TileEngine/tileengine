import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { refuse, release, ROOT, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/baseline/page.ts", PAGE = "tools/baseline/index.html", BAD = /editor|tools\/maker|catalogue\.json/;
export function build(out: string, commit: string, root: string = ROOT): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha"); else if (existsSync(out) && readdirSync(out).length > 0) throw new Error("build: not empty");
  const bag = new Map<string, string>(), seen = new Set<string>();
  const walk = (rel: string): void => {
    if (seen.has(rel)) return; seen.add(rel); if (BAD.test(rel)) throw new Error(`build: ${rel}`);
    const raw = readFileSync(join(root, rel), "utf8"), js = rel.endsWith(".json") ? `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}` : toJs(rel, release(raw, rel), walk);
    bag.set(rel.endsWith(".json") ? `${rel}.js` : rel.replace(/\.ts$/, ".js"), js);
  };
  walk(ENTRY);
  bag.set("index.html", readFileSync(join(root, PAGE), "utf8").replace('src="./page.ts"', 'src="./tools/baseline/page.js"').replace("</title>", '</title><link rel="icon" href="data:,">'));
  const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
  if (existsSync(out)) rmSync(out, { recursive: true }); mkdirSync(out, { recursive: true });
  for (const [name, src] of Object.entries(files)) { const dest = join(out, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, src); }
  writeFileSync(join(out, "build.json"), body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3], head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT }));
  const why = out === undefined ? "usage: node tools/baseline/build.ts <out folder> [commit, which must be HEAD]" : refuse(head, asked, dirty);
  if (why !== null || out === undefined) { console.error(why ?? "usage: node tools/baseline/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  build(out, asked ?? head);
}
