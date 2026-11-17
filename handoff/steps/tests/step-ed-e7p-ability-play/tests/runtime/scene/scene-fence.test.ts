import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("the scene folder holds cast-fx, match-link and world-scene; world-scene imports only the render index and the notice type, match-link only types from world-scene and the notice type, cast-fx only core log/notice/plain types and fx-doc/fx-live; no game words, DOM names or wall time (step 31; ED-E3; E7p)", () => {
  const dir = fileURLToPath(new URL("../../../src/runtime/scene/", import.meta.url));
  assert.deepEqual(readdirSync(dir).filter((name) => name.endsWith(".ts")), ["cast-fx.ts", "match-link.ts", "world-scene.ts"]);
  const code = (text: string): string => text.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
  const words = (text: string): string => code(text).replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/g, "");
  const banned = /\b(?:hp|mana|cost|deck|damage|cards|phase|document|window|navigator|HTMLCanvasElement|HTMLElement|Element|Node|Event|localStorage|fetch|Date|performance|setTimeout|setInterval|queueMicrotask|requestAnimationFrame|globalThis|process)\b/;
  const allow = { "world-scene.ts": /^(?:\.\.\/render\/index\.ts|\.\.\/\.\.\/core\/notice\.ts)$/, "match-link.ts": /^(?:\.\/world-scene\.ts|\.\.\/\.\.\/core\/notice\.ts)$/, "cast-fx.ts": /^(?:\.\.\/\.\.\/core\/(?:log\/types|notice|plain)\.ts|\.\.\/render\/(?:fx-doc|fx-live)\.ts)$/ } as const;
  const check = (file: keyof typeof allow, src: string): void => { assert.equal(banned.test(words(src)), false); for (const hit of code(src).matchAll(/(?:from|import)\s*[`'"]([^`'"]+)[`'"]/g)) assert.match(hit[1] ?? "", allow[file]); if (file === "match-link.ts") assert.equal(/^\s*import\s+(?!type\b)/m.test(code(src)), false); };
  const text = readFileSync(`${dir}/world-scene.ts`, "utf8"), link = readFileSync(`${dir}/match-link.ts`, "utf8"), fx = readFileSync(`${dir}/cast-fx.ts`, "utf8"); check("world-scene.ts", text); check("match-link.ts", link); check("cast-fx.ts", fx);
  for (const extra of ['import "../../state/xgo.ts";', 'import "../host/raf-driver.ts";', "export const hp = 1;", 'import "../../sim/index.ts";', 'import "./match-link.ts";']) assert.throws(() => check("world-scene.ts", `${text}\n${extra}`));
  for (const extra of ['import "../render/index.ts";', 'import { createSceneLink } from "./world-scene.ts";', 'import "../../sim/index.ts";', "export const hp = 1;"]) assert.throws(() => check("match-link.ts", `${link}\n${extra}`));
  for (const extra of ['import "../../sim/index.ts";', "export const hp = 1;", 'import "./match-link.ts";', 'import "../host/raf-driver.ts";']) assert.throws(() => check("cast-fx.ts", `${fx}\n${extra}`));
});
