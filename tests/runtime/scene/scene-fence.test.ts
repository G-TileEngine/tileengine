import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("the scene folder imports only the render index and the notice type, and uses no game words, DOM names or wall time (step 31)", () => {
  const dir = fileURLToPath(new URL("../../../src/runtime/scene/", import.meta.url));
  assert.deepEqual(readdirSync(dir).filter((name) => name.endsWith(".ts")), ["world-scene.ts"]);
  const code = (text: string): string => text.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
  const words = (text: string): string => code(text).replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/g, "");
  const banned = /\b(?:hp|mana|cost|deck|damage|cards|phase|document|window|navigator|HTMLCanvasElement|HTMLElement|Element|Node|Event|localStorage|fetch|Date|performance|setTimeout|setInterval|queueMicrotask|requestAnimationFrame|globalThis|process)\b/;
  const ok = /^(?:\.\.\/render\/index\.ts|\.\.\/\.\.\/core\/notice\.ts)$/;
  const check = (src: string): void => { assert.equal(banned.test(words(src)), false); for (const hit of code(src).matchAll(/(?:from|import)\s*[`'"]([^`'"]+)[`'"]/g)) assert.match(hit[1] ?? "", ok); };
  const text = readFileSync(`${dir}/world-scene.ts`, "utf8"); check(text);
  for (const extra of ['import "../../state/xgo.ts";', 'import "../host/raf-driver.ts";', "export const hp = 1;", 'import "../../sim/index.ts";']) assert.throws(() => check(`${text}\n${extra}`));
});
