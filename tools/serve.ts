import { readFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { stripTypeScriptTypes } from "node:module";
import { networkInterfaces } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const type: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".ts": "text/javascript; charset=utf-8", ".json": "application/json" };
export function serve(port: number): Promise<{ url: string; server: Server }> {
  const server = createServer((req, res) => void (async (): Promise<void> => {
    try {
      const u = new URL(req.url ?? "", "http://127.0.0.1"); let path = decodeURIComponent(u.pathname); if (path.endsWith("/")) path += "index.html";
      const file = resolve(ROOT, path.slice(1)), under = (d: string): boolean => file.startsWith(join(ROOT, d) + sep);
      if (!under("src") && !under("tools")) { res.writeHead(404); res.end(); return; }
      const ext = extname(file), raw = await readFile(file, "utf8");
      res.writeHead(200, { "content-type": type[ext] ?? "application/octet-stream" }); res.end(ext === ".ts" ? stripTypeScriptTypes(raw, { mode: "strip" }) : raw);
    } catch (e) { res.writeHead((e as { code?: string }).code === "ENOENT" ? 404 : 400); res.end(); }
  })());
  return new Promise((ok) => server.listen(port, "0.0.0.0", () => { const a = server.address(); ok({ url: `http://127.0.0.1:${typeof a === "object" && a !== null ? a.port : port}`, server }); }));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) void serve(Number(process.argv[2] ?? 8734)).then(() => {
  const port = process.argv[2] ?? "8734", ips = Object.values(networkInterfaces()).flatMap((xs) => xs ?? []).filter((i) => i.family === "IPv4" && !i.internal);
  console.log(ips.length === 0 ? "join the Wi-Fi" : ips.map((i) => `http://${i.address}:${port}/tools/device-page/`).join("\n"));
});
