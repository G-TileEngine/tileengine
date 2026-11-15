import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const ENTRY = "tools/device-page/page.ts", PAGE = "tools/device-page/index.html", SCRIPT = ['src="./page.ts"', 'src="./tools/device-page/page.js"'] as const;
export const toHtml = (html: string): string => html.replace(SCRIPT[0], SCRIPT[1]).replace("</title>", '</title><link rel="icon" href="data:,">');
export const sha = (text: string): string => createHash("sha256").update(text).digest("hex");
export const strip = (src: string): string => stripTypeScriptTypes(src, { mode: "strip" });
export const ours = (text: string): boolean => { try { const v = JSON.parse(text) as Record<string, unknown>; return Object.keys(v).join() === "commit,node,entry,files" && typeof v["commit"] === "string" && /^[0-9a-f]{40}$/.test(v["commit"]) && typeof v["node"] === "string" && v["entry"] === "index.html" && typeof v["files"] === "object" && v["files"] !== null && !Array.isArray(v["files"]); } catch { return false; } };
export const onlyBuild = (out: string, text: string): boolean => { const files = (JSON.parse(text) as { files: Record<string, unknown> }).files; return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll("\\", "/"); return name === "build.json" || Object.hasOwn(files, name); }); };
const RENAME = /(from\s*|import\s*)"(\.[^"]*)"/g;
export function toJs(rel: string, src: string, dep: (rel: string) => void): string {
  const out = strip(src).replace(RENAME, (all, pre: string, spec: string) => { const next = spec.replace(/\.ts$/, ".js"); const target = posix.normalize(posix.join(posix.dirname(rel), spec)).replace(/\.js$/, ".ts"); dep(target.endsWith(".ts") ? target : `${target}.ts`); return `${pre}"${next}"`; });
  const bad = /(?:from\s*|import\s*)"([^."][^"]*)"/.exec(out); if (bad !== null) throw new Error(`build: non-relative import ${bad[1] ?? ""} in ${rel}`); return out;
}
export const refuse = (head: string, asked: string | undefined, dirty: string): string | null => dirty !== "" ? "build: the checkout has uncommitted changes; build.json must name a real commit" : asked !== undefined && asked !== head ? `build: ${asked} is not the checked-out commit ${head}; check it out first` : null;
export function build(out: string, commit: string, root: string = ROOT): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bj = join(out, "build.json"), prior = existsSync(out) && readdirSync(out).length > 0, text = prior && existsSync(bj) ? readFileSync(bj, "utf8") : "";
  if (prior && (text === "" || !ours(text) || !onlyBuild(out, text))) throw new Error(text === "" ? `build: ${out} is not empty; give an empty folder` : `build: ${out}/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder`);
  const bag = new Map<string, string>(), seen = new Set<string>();
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, readFileSync(join(root, rel), "utf8"), walk)); };
  walk(ENTRY); bag.set("index.html", toHtml(readFileSync(join(root, PAGE), "utf8")));
  const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
  if (existsSync(out)) rmSync(out, { recursive: true });
  mkdirSync(out, { recursive: true });
  for (const [name, src] of Object.entries(files)) { const dest = join(out, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, src); }
  writeFileSync(bj, body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3];
  if (out === undefined) { console.error("usage: node tools/device-page/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8" })), why = refuse(head, asked, dirty);
  if (why !== null) { console.error(why); process.exit(1); }
  build(out, asked ?? head);
}
