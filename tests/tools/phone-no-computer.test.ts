import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/device-page/build.ts";
import { check } from "../../tools/device-page/check.ts";
import { links, nodeOk, serve } from "../../tools/serve.ts";
const SERVE = new URL("../../tools/serve.ts", import.meta.url).pathname, COMMIT = "acc695ade5008b0fe6623b48de1cb566dcf896cf";
const sha256 = (t: string): string => createHash("sha256").update(t).digest("hex");
const pre = (code: string): string => `data:text/javascript,${encodeURIComponent(code)}`;
const TERMUX = pre(`import os from "node:os"; import { syncBuiltinESMExports } from "node:module"; os.networkInterfaces = () => { throw Object.assign(new Error("uv_interface_addresses returned Unknown system error 13"), { code: "ERR_SYSTEM_ERROR" }); }; syncBuiltinESMExports();`);
/** Runs the real `node tools/serve.ts` until it prints a link (then stops it) or exits; preloads stand in for the phone's Node. */
function run(args: string[], preload?: string): Promise<{ out: string; err: string; code: number | null; url?: string; body?: number }> {
  return new Promise((done) => {
    const kid = spawn(process.execPath, ["--no-warnings", ...(preload === undefined ? [] : ["--import", preload]), SERVE, ...args]), got: { out: string; err: string; url?: string; body?: number } = { out: "", err: "" };
    const stop = setTimeout(() => kid.kill(), 15_000);
    kid.stderr.on("data", (d: Buffer) => { got.err += String(d); });
    kid.stdout.on("data", (d: Buffer) => { got.out += String(d); const url = /http:\/\/\S+\/tools\/device-page\//.exec(got.out)?.[0]; if (url === undefined || got.url !== undefined) return; got.url = url; void fetch(url.replace(/\/\/[^:/]+:/, "//127.0.0.1:"), { signal: AbortSignal.timeout(5000) }).then((r) => r.status, () => -1).then((body) => { got.body = body; kid.kill(); }); });
    kid.once("exit", (code) => { clearTimeout(stop); done({ ...got, code }); });
  });
}
const busy = (): Promise<Server> => new Promise((ok) => { const s = createServer(); s.listen(0, "0.0.0.0", () => ok(s)); });
const portOf = (s: { address(): unknown }): number => (s.address() as { port: number }).port;
test("serve: a phone that hides its network addresses (Termux) keeps serving and prints its own 127.0.0.1 link with the real port and the Wi-Fi hint (step 35g5a)", async () => {
  const r = await run(["0"], TERMUX);
  assert.match(r.out, /^http:\/\/127\.0\.0\.1:([1-9]\d*)\/tools\/device-page\/\n.*find this phone's IP in Wi-Fi settings/, r.err); assert.equal(r.body, 200, "the printed link serves the page"); assert.equal(r.err, "");
  assert.deepEqual(links(8734, () => { throw new Error("error 13"); })[0], "http://127.0.0.1:8734/tools/device-page/");
});
test("serve: port 0 prints the bound port, one link per IPv4 Wi-Fi address, the phone's own link when there is none (step 35g5a)", async () => {
  const r = await run(["0"]); assert.ok(r.url !== undefined && !r.url.includes(":0/"), r.out); assert.equal(r.body, 200);
  const nic = (address: string, family: "IPv4" | "IPv6", internal: boolean) => ({ address, family, internal, netmask: "", mac: "", cidr: null }) as never;
  assert.deepEqual(links(9001, () => ({ wlan0: [nic("192.168.1.7", "IPv4", false), nic("fe80::1", "IPv6", false)], lo: [nic("127.0.0.1", "IPv4", true)], rmnet: [nic("10.0.0.9", "IPv4", false)] })), ["http://192.168.1.7:9001/tools/device-page/", "http://10.0.0.9:9001/tools/device-page/"]);
  assert.match(links(9001, () => ({ lo: [nic("127.0.0.1", "IPv4", true)] })).join("\n"), /^http:\/\/127\.0\.0\.1:9001\/tools\/device-page\/\n.*join the Wi-Fi/);
  const { url, server } = await serve(0); try { assert.match(url, /^http:\/\/127\.0\.0\.1:[1-9]\d*$/); } finally { server.close(); }
});
test("serve: a busy port prints the friendly line naming the next port and exits non-zero; serve() rejects with EADDRINUSE (step 35g5a)", async () => {
  const held = await busy(), port = portOf(held);
  try {
    const r = await run([String(port)]); assert.equal(r.code, 1); assert.equal(r.out, "");
    assert.equal(r.err.trim(), `port ${port} is already used by another program; close it or run node tools/serve.ts ${port + 1}`);
    await assert.rejects(serve(port), (e: { code?: string }) => e.code === "EADDRINUSE");
  } finally { held.close(); }
});
test("serve: Node below v22.18, or v23.0 to v23.5, gets one plain line and exit 1 before serving (step 35g5a)", async () => {
  assert.deepEqual(["22.17.1", "22.18.0", "23.5.0", "23.6.0", "24.0.0", "26.13.1", "20.19.0", "v22.18.1"].map(nodeOk), [false, true, false, true, true, true, false, true]);
  for (const v of ["23.5.0", "22.17.1"]) {
    const r = await run(["0"], pre(`Object.defineProperty(process.versions, "node", { value: "${v}" });`));
    assert.equal(r.code, 1); assert.equal(r.out, ""); assert.equal(r.err.trim(), `This needs Node v22.18 or newer (on the 23 line, v23.6 or newer). This computer has v${v}. Install a newer Node, then try again.`);
  }
});
test("gh-pages build: exactly the page's runtime import set, types stripped, .js names, relative paths, build.json with commit and sha256; the check passes (step 35g5a)", () => {
  const dir = mkdtempSync(join(tmpdir(), "g5a-")), out = join(dir, "device-page");
  try {
    const meta = JSON.parse(build(out, COMMIT)) as { commit: string; node: string; files: Record<string, string> }, names = Object.keys(meta.files);
    assert.equal(meta.commit, COMMIT); assert.equal(meta.node, process.versions.node); assert.deepEqual(check(out), []);
    assert.ok(names.includes("index.html") && names.includes("tools/device-page/page.js") && names.includes("tools/pixel-suite/l2.js") && names.includes("src/runtime/host/raf-driver.js"));
    assert.ok(names.every((n) => n === "index.html" || n.endsWith(".js")), "only .html and .js ship"); assert.ok(!names.includes("src/types/core-types.js"), "type-only imports do not ship");
    assert.ok(!names.some((n) => n.startsWith("tools/serve") || n.startsWith("tools/device-page/build") || n.startsWith("tests/")), "no server, builder or test ships");
    const html = readFileSync(join(out, "index.html"), "utf8"), page = readFileSync(join(out, "tools/device-page/page.js"), "utf8");
    assert.ok(html.includes('</title><link rel="icon" href="data:,">'), "an inline icon, so no /favicon.ico is asked outside the sub-path"); assert.ok(html.includes('src="./tools/device-page/page.js"') && !/(src|href)="\//.test(html), "the entry loads the page by a relative path");
    assert.ok(page.includes('from "../../src/runtime/host/raf-driver.js"') && !/from\s*"[^"]*\.ts"/.test(page) && !page.includes(": HTMLElement"), "types stripped, imports renamed");
    assert.throws(() => build(dir, COMMIT), /not empty/); writeFileSync(join(out, "build.json"), JSON.stringify({ commit: COMMIT, files: {} })); assert.throws(() => build(out, COMMIT), /not one this builder wrote/); assert.ok(readFileSync(join(out, "index.html"), "utf8").length > 0, "nothing deleted"); assert.throws(() => build(join(dir, "x"), "HEAD"), /40-character/);
  } finally { rmSync(dir, { recursive: true }); }
});
test("gh-pages check: an extra, missing, changed or unstripped file, an import that does not ship, or a stale build each fail (step 35g5a)", () => {
  const dir = mkdtempSync(join(tmpdir(), "g5a-")), out = join(dir, "device-page"), meta = (): string => readFileSync(join(out, "build.json"), "utf8");
  const again = (edit: () => void): string[] => { rmSync(out, { recursive: true, force: true }); build(out, COMMIT); edit(); return check(out); };
  try {
    assert.match(again(() => writeFileSync(join(out, "extra.js"), "")).join("\n"), /extra\.js: ships but is not in build\.json/);
    assert.match(again(() => rmSync(join(out, "src/runtime/render/light.js"))).join("\n"), /light\.js: in build\.json but missing[\s\S]*imports \.\/light\.js, which does not ship/);
    const page = join(out, "tools/device-page/page.js");
    assert.match(again(() => writeFileSync(page, `${readFileSync(page, "utf8")}\n`)).join("\n"), /page\.js: sha256 differs[\s\S]*page\.js: is not its stripped source/);
    assert.match(again(() => { const b = readFileSync(page, "utf8").replace('"../pixel-suite/l2.js"', '"../pixel-suite/l2.ts"'); writeFileSync(page, b); const m = JSON.parse(meta()) as { files: Record<string, string> }; m.files["tools/device-page/page.js"] = sha256(b); writeFileSync(join(out, "build.json"), JSON.stringify(m, null, 2) + "\n"); }).join("\n"), /page\.js: is not its stripped source[\s\S]*imports \.\.\/pixel-suite\/l2\.ts, which does not ship[\s\S]*l2\.js: ships but nothing the page loads imports it[\s\S]*rebuild/);
    assert.match(again(() => { const m = JSON.parse(meta()) as { files: Record<string, string> }; m.files["tests/x.js"] = "0"; writeFileSync(join(out, "build.json"), JSON.stringify(m)); writeFileSync(join(out, "tests-x.js"), ""); }).join("\n"), /tests-x\.js: ships but is not in build\.json[\s\S]*tests\/x\.js: in build\.json but missing[\s\S]*not byte-equal/);
  } finally { rmSync(dir, { recursive: true }); }
});
