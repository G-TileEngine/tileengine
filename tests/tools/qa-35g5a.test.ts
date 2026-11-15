import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build, refuse, ROOT } from "../../tools/device-page/build.ts";
const HEAD = "3fba1dffcd1ccaa0016593b5fc0f07e01742d73e", OTHER = "0".repeat(40);
const tool = (name: string): string => new URL(`../../tools/device-page/${name}.ts`, import.meta.url).pathname;
/** Runs the real CLI with git faked: HEAD is `HEAD`, and `status` prints `dirty` (a tracked edit the builder would otherwise ship). */
function cli(name: string, args: string[], dirty: string): { code: number | null; out: string; err: string } {
  const fake = `import cp from "node:child_process"; import { syncBuiltinESMExports } from "node:module"; cp.execFileSync = (_g, a, o) => { if ((a[0] === "-C" ? a[1] : o?.cwd) !== ${JSON.stringify(ROOT)}) throw new Error("git ran outside ROOT"); return a.includes("rev-parse") ? "${HEAD}\\n" : ${JSON.stringify(dirty)}; }; syncBuiltinESMExports();`;
  const r = spawnSync(process.execPath, ["--no-warnings", "--import", `data:text/javascript,${encodeURIComponent(fake)}`, tool(name), ...args], { encoding: "utf8", cwd: tmpdir() });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
test("QA 35g5a: build.json names only the commit the files come from: a tracked edit or another commit is refused, with or without a commit argument", () => {
  assert.equal(refuse(HEAD, undefined, ""), null); assert.equal(refuse(HEAD, HEAD, ""), null);
  assert.match(String(refuse(HEAD, HEAD, " M src/runtime/render/light.ts")), /uncommitted changes/); assert.match(String(refuse(HEAD, OTHER, "")), /not the checked-out commit/);
  const dir = mkdtempSync(join(tmpdir(), "qa-g5a-"));
  try {
    for (const [args, dirty, want] of [[[HEAD], " M src/runtime/render/light.ts", /uncommitted changes/], [[], " M tools/device-page/page.ts", /uncommitted changes/], [[OTHER], "", /not the checked-out commit/]] as const) {
      const out = join(dir, `o${args.length}${dirty.length}`), r = cli("build", [out, ...args], dirty);
      assert.equal(r.code, 1, r.out); assert.match(r.err, want); assert.equal(existsSync(out), false, "nothing is written");
    }
    const out = join(dir, "ok"); build(out, HEAD);
    for (const f of readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile())) assert.ok(![ROOT, dir, tmpdir()].some((p) => readFileSync(join(f.parentPath, f.name), "utf8").includes(p)), `${f.name} names no box path`);
    const r = cli("check", [out], " M src/runtime/render/light.ts");
    assert.equal(r.code, 1); assert.match(r.out, /^check: the checkout has uncommitted changes/m, "check refuses to vouch for a dirty checkout");
    assert.equal(cli("check", [out], "").code, 0, "a clean checkout at build.json's commit passes (git runs in ROOT, not the caller's folder)");
    const old = join(dir, "old"); build(old, OTHER); const o = cli("check", [old], ""); assert.equal(o.code, 1); assert.match(o.out, /^check: 0{40} is not the checked-out commit/m, "check refuses to vouch for another commit");
    for (const extra of ["keep.txt", ".git/HEAD"]) { mkdirSync(join(out, extra, ".."), { recursive: true }); writeFileSync(join(out, extra), "x"); assert.throws(() => build(out, HEAD), /holds other files/); assert.ok(existsSync(join(out, extra)), `${extra} is not deleted with a real build.json beside it`); rmSync(join(out, extra)); }
    assert.doesNotThrow(() => build(out, HEAD), "an earlier build alone (and an empty .git folder) is still replaced");
    const lone = join(dir, "lone"); mkdirSync(lone); writeFileSync(join(lone, "build.json"), JSON.stringify({ commit: HEAD, files: {} })); assert.throws(() => build(lone, HEAD), /not one this builder wrote/, "a build.json without node and entry is not ours");
    writeFileSync(join(lone, "build.json"), JSON.stringify({ commit: HEAD, node: "x", entry: "index.html", files: {}, by: "another tool" })); assert.throws(() => build(lone, HEAD), /not one this builder wrote/, "an extra key is not ours");
  } finally { rmSync(dir, { recursive: true }); }
});
