import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { build, PAGE, refuse, ROOT, sha, strip, toHtml } from "./build.ts";
const filesOf = (dir: string): string[] => readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).map((e) => relative(dir, join(e.parentPath, e.name)).replaceAll("\\", "/"));
const specs = (name: string, text: string): string[] => [...text.matchAll(name.endsWith(".html") ? /\ssrc="(\.[^"]*)"/g : /(?:from\s*|import\s*)"(\.[^"]*)"/g)].map((m) => m[1] ?? "");
const built = (root: string, name: string): string | undefined => name === "index.html" ? toHtml(readFileSync(join(root, PAGE), "utf8")) : name.endsWith(".js") && existsSync(join(root, name.replace(/\.js$/, ".ts"))) ? strip(readFileSync(join(root, name.replace(/\.js$/, ".ts")), "utf8")).replace(/(from\s*|import\s*)"(\.[^"]*)\.ts"/g, "$1\"$2.js\"") : undefined;
export function check(out: string, root: string = ROOT): string[] {
  const meta = JSON.parse(readFileSync(join(out, "build.json"), "utf8")) as { commit: string; node: string; files: Record<string, string> };
  const disk = filesOf(out).filter((n) => n !== "build.json"), listed = meta.files, problems: string[] = [], have = new Set(disk);
  for (const n of disk) if (!Object.hasOwn(listed, n)) problems.push(`${n}: ships but is not in build.json`);
  for (const n of Object.keys(listed)) if (!have.has(n)) problems.push(`${n}: in build.json but missing`);
  for (const n of disk) if (Object.hasOwn(listed, n) && sha(readFileSync(join(out, n), "utf8")) !== listed[n]) problems.push(`${n}: sha256 differs`);
  for (const n of disk) { const want = built(root, n); if (want !== undefined && readFileSync(join(out, n), "utf8") !== want) problems.push(`${n}: is not its stripped source`); }
  const reach = new Set<string>(), stack = ["index.html"];
  while (stack.length > 0) { const n = stack.pop(); if (n === undefined || reach.has(n) || !have.has(n)) continue; reach.add(n); for (const spec of specs(n, readFileSync(join(out, n), "utf8"))) { const target = posix.normalize(posix.join(posix.dirname(n), spec)); if (!have.has(target)) problems.push(`${n}: imports ${spec}, which does not ship`); else stack.push(target); } }
  for (const n of disk) if (!reach.has(n)) problems.push(`${n}: ships but nothing the page loads imports it`);
  const tmp = mkdtempSync(join(tmpdir(), "g5a-"));
  try {
    const fresh = join(tmp, "b"); build(fresh, meta.commit, root); const a = filesOf(out).sort(), b = filesOf(fresh).sort();
    if (a.join("\0") !== b.join("\0") || a.some((n) => readFileSync(join(out, n), "utf8") !== readFileSync(join(fresh, n), "utf8"))) problems.push(meta.node === process.versions.node ? "rebuild is not byte-equal" : `rebuild is not byte-equal (Node ${meta.node} vs ${process.versions.node})`);
  } finally { rmSync(tmp, { recursive: true }); }
  return problems;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2]; if (out === undefined) { console.error("usage: node tools/device-page/check.ts <out folder>"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8" }));
  const asked = (JSON.parse(readFileSync(join(out, "build.json"), "utf8")) as { commit: string }).commit, why = refuse(head, asked, dirty);
  if (why !== null) { console.log(`check: ${why.replace(/^build: /, "")}`); process.exit(1); }
  const problems = check(out); console.log(problems.length === 0 ? "check ok" : problems.join("\n")); process.exit(problems.length === 0 ? 0 : 1);
}
