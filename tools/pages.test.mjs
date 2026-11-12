// Pages tests (step 26): `node --test tools/`. No dependencies, no DOM: the escape helper app.js uses is read from app.js itself.
import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs"; import { createRequire } from "node:module"; import { runInNewContext } from "node:vm";
import { checkPages, htmlHoles } from "./check-pages.mjs";
const root = new URL("..", import.meta.url).pathname, app = readFileSync(root + "js/app.js", "utf8");
const escapeHtml = runInNewContext(app.slice(app.indexOf("function escapeHtml(s)"), app.indexOf("function humanize(")) + "; escapeHtml");
const unescape = (s) => s.replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
test("a unit id with markup renders as text (step 26)", () => {
  for (const id of ["<img src=x onerror=alert(1)>", "\"><img src=x onerror=alert(1)>", "7"]) {
    for (const attr of ["data-dup-unit", "data-sel-unit", "data-loadout"]) {
      assert.equal(app.includes(`${attr}="\${escapeHtml(u.id)}"`), true, attr + " escapes the unit id");
      const html = `<button type="button" ${attr}="${escapeHtml(id)}">x</button>`, value = html.match(new RegExp(`${attr}="([^"]*)"`))[1];
      assert.equal(html.includes("<img"), false); assert.equal(unescape(value), id);
    }
  }
});
test("the converter has no source-eval door (step 26)", () => {
  const eng = createRequire(import.meta.url)("../js/convert-engine.js");
  assert.equal(eng.init, undefined); assert.equal(typeof eng.initWith, "function");
  assert.equal(/new\s+Function|eval\s*\(/.test(readFileSync(root + "js/convert-engine.js", "utf8")), false);
});
test("the pages check passes and catches each door (step 26)", () => {
  assert.deepEqual(checkPages().fails, []);
  assert.deepEqual(htmlHoles("const a = `<b data-x=\"${u.id}\">${esc(n)}</b>`;").map((h) => h.text), ["u.id"]);
  assert.deepEqual(htmlHoles("const a = `plain ${u.id}`; const r = /`<b>${x}/;").length, 0);
});
