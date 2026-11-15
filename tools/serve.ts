import { readFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import * as nodeModule from "node:module";
import { networkInterfaces } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const type: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".ts": "text/javascript; charset=utf-8", ".json": "application/json" };
/** v22.18+ on the 22 line, v23.6+ on the 23 line, any v24+. A leading v is allowed. */
export const nodeOk = (version: string): boolean => { const m = /^v?(\d+)\.(\d+)/.exec(version); if (m === null) return false; const maj = Number(m[1]), min = Number(m[2]); return maj > 23 || (maj === 23 && min >= 6) || (maj === 22 && min >= 18); };
export function serve(port: number): Promise<{ url: string; server: Server }> {
  const server = createServer((req, res) => void (async (): Promise<void> => {
    try {
      const u = new URL(req.url ?? "", "http://127.0.0.1"); let path = decodeURIComponent(u.pathname); if (path.endsWith("/")) path += "index.html";
      const file = resolve(ROOT, path.slice(1)), under = (d: string): boolean => file.startsWith(join(ROOT, d) + sep);
      if (!under("src") && !under("tools")) { res.writeHead(404); res.end(); return; }
      const ext = extname(file), raw = await readFile(file, "utf8");
      res.writeHead(200, { "content-type": type[ext] ?? "application/octet-stream" }); res.end(ext === ".ts" ? nodeModule.stripTypeScriptTypes(raw, { mode: "strip" }) : raw);
    } catch (e) { res.writeHead((e as { code?: string }).code === "ENOENT" ? 404 : 400); res.end(); }
  })());
  return new Promise((ok, no) => { const fail = (e: Error): void => { server.off("error", fail); no(e); }; server.on("error", fail); server.listen(port, "0.0.0.0", () => { server.off("error", fail); const a = server.address(); ok({ url: `http://127.0.0.1:${typeof a === "object" && a !== null ? a.port : port}`, server }); }); });
}
export function links(port: number, list: () => ReturnType<typeof networkInterfaces> = networkInterfaces): string[] {
  const own = (why: string): string[] => [`http://127.0.0.1:${port}/tools/device-page/`, why];
  try {
    const ips = Object.values(list() ?? {}).flatMap((xs) => xs ?? []).filter((i) => i.family === "IPv4" && i.internal === false);
    return ips.length === 0 ? own("(on this computer or phone only; join the Wi-Fi to open it from another phone)") : ips.map((i) => `http://${i.address}:${port}/tools/device-page/`);
  } catch { return own("(on this phone; to open it from another phone, find this phone's IP in Wi-Fi settings and use it instead of 127.0.0.1)"); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const asked = Number(process.argv[2] ?? 8734), ver = process.versions.node.replace(/^v/, "");
  if (!nodeOk(ver)) { console.error(`This needs Node v22.18 or newer (on the 23 line, v23.6 or newer). This computer has v${ver}. Install a newer Node, then try again.`); process.exit(1); }
  void serve(asked).then(({ server }) => { const a = server.address(); const bound = typeof a === "object" && a !== null ? a.port : asked; for (const line of links(bound)) console.log(line); }, (e: NodeJS.ErrnoException) => { console.error(e.code === "EADDRINUSE" ? `port ${asked} is already used by another program; close it or run node tools/serve.ts ${asked + 1}` : `the server could not start: ${e.message}`); process.exit(1); });
}
