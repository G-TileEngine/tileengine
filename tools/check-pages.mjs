// Pages check (step 26): run `node tools/check-pages.mjs` before a publish. No dependencies.
// 1. no string-to-code doors (new Function, Function(), eval) in the shipped JS or index.html;
// 2. app.js puts no raw id into HTML (escapeHtml it); 3. raw ${...} in HTML templates never grows past tools/pages-html-baseline.json.
import { readFileSync, readdirSync } from "node:fs";
const root = new URL("..", import.meta.url).pathname, SAFE = /^(esc|escapeHtml|TileEngineSafe\.escapeHtml)\s*\(/;
export function htmlHoles(src) { // ${...} inside template literals that hold markup, not wrapped in an escape call
  const holes = [], stack = []; let i = 0, prev = "";
  const regexOk = () => /^$|[(,=:[!&|?{};+\-*%<>~^]$|\b(return|typeof|case)$/.test(prev);
  while (i < src.length) {
    const c = src[i], top = stack[stack.length - 1];
    if (top && top.tpl) {
      if (c === "\\") i += 2;
      else if (c === "`") { stack.pop(); if (/<[a-z!/]/i.test(src.slice(top.at, i))) holes.push(...top.exprs); i += 1; prev = "x"; }
      else if (c === "$" && src[i + 1] === "{") { top.tpl = false; top.brace = 0; top.from = i + 2; i += 2; prev = "{"; }
      else i += 1;
      continue;
    }
    if (top && c === "}" && top.brace === 0) { top.exprs.push({ at: top.from, text: src.slice(top.from, i).trim() }); top.tpl = true; i += 1; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i += 1; continue; }
    if (c === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i + 2) + 2; continue; }
    if (c === "'" || c === "\"") { i += 1; while (i < src.length && src[i] !== c) i += src[i] === "\\" ? 2 : 1; i += 1; prev = "x"; continue; }
    if (c === "/" && regexOk()) { let cls = false; i += 1; while (i < src.length && src[i] !== "\n" && (src[i] !== "/" || cls)) { if (src[i] === "\\") i += 1; else if (src[i] === "[") cls = true; else if (src[i] === "]") cls = false; i += 1; } i += 1; prev = "x"; continue; }
    if (c === "`") { stack.push({ tpl: true, at: i, exprs: [] }); i += 1; continue; }
    if (top) { if (c === "{") top.brace += 1; else if (c === "}") top.brace -= 1; }
    if (!/\s/.test(c)) prev = /[\w$]/.test(c) && /[\w$]$/.test(prev) ? prev + c : c;
    i += 1;
  }
  return holes.filter((h) => !SAFE.test(h.text));
}
export function checkPages(dir = root) {
  const fails = [], base = JSON.parse(readFileSync(dir + "tools/pages-html-baseline.json", "utf8")), counts = {};
  const files = readdirSync(dir + "js").filter((f) => f.endsWith(".js")).map((f) => "js/" + f).concat("index.html");
  for (const f of files) {
    const src = readFileSync(dir + f, "utf8"), line = (k) => src.slice(0, k).split("\n").length;
    for (const m of src.matchAll(/\bnew\s+Function\b|(?<![\w$.])Function\s*\(|(?<![\w$.])eval\s*\(/g)) fails.push(`${f}:${line(m.index)} string-to-code door: ${m[0]}`);
    if (f === "index.html") continue;
    const holes = htmlHoles(src); counts[f] = holes.length;
    if (f === "js/app.js") for (const h of holes) if (/(\.id|Id)$/.test(h.text)) fails.push(`${f}:${line(h.at)} raw id in HTML: \${${h.text}} (use escapeHtml)`);
    if (holes.length > (base[f] ?? 0)) fails.push(`${f}: ${holes.length} raw \${...} in HTML, baseline ${base[f] ?? 0} (escape the new one)`);
  }
  return { fails, counts };
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { fails, counts } = checkPages();
  if (process.argv[2] === "--counts") console.log(JSON.stringify(counts, null, 1));
  for (const f of fails) console.log("FAIL " + f);
  console.log(fails.length ? `pages check: ${fails.length} failing` : "pages check OK"); process.exit(fails.length ? 1 : 0);
}
